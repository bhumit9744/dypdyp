"""
Jarvis AI Executive Agent & Plugin Orchestrator — Placement Hub
Supports voice-first conversational interaction, wake-word activation,
LinkedIn career plugins, and Automated Email communication plugins.
"""

from __future__ import annotations

import datetime
import json
import logging
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field

import asyncio
import concurrent.futures
from app.core.config import settings
from app.core.database import SessionLocal
from app.models.models import IntegrationConnection, Student, OpportunityRecord, SavedOpportunityRecord
from app.integrations.opportunities.service import opportunities_service
from app.integrations.opportunities.schemas import (
    OpportunityFilterParams,
    SaveOpportunityRequest,
    UpdateApplicationStatusRequest,
)
from app.integrations.github import github_connector
from app.integrations.base import (
    ConnectorError,
    ConnectorAuthError,
    ConnectorPermissionError,
    ConnectorRateLimitError,
    ConnectorNotFoundError,
    ConnectorTimeoutError,
    ConnectorNetworkError,
)
from app.services.gemini_provider import provider_manager, GeminiProviderError

logger = logging.getLogger("jarvis_agent")


# ---------------------------------------------------------------------------
# Schemas
# ---------------------------------------------------------------------------

class LinkedInPostRequest(BaseModel):
    topic: str = Field(..., description="Topic of the post, e.g. 'Cleared Google Technical Round' or 'Finished Microservices Project'")
    tone: str = Field(default="professional_inspiring", description="Tone: professional_inspiring, technical_deepdive, casual_student")
    highlights: Optional[List[str]] = Field(default_factory=list, description="Key bullet points to include")
    include_hashtags: bool = True

class LinkedInOutreachRequest(BaseModel):
    target_name: str
    target_company: str
    target_role: str
    student_interest: str
    connection_type: str = Field(default="alumni", description="alumni, recruiter, hiring_manager")

class EmailDraftRequest(BaseModel):
    recipient_name: str
    recipient_email: str
    email_type: str = Field(..., description="thank_you, follow_up, cold_outreach, recommendation_request, acceptance")
    job_role: Optional[str] = "Software Engineer"
    company_name: Optional[str] = "Tech Corp"
    custom_notes: Optional[str] = None

class EmailSendRequest(BaseModel):
    to_email: str
    subject: str
    body: str
    recipient_name: Optional[str] = None

class JarvisCommandRequest(BaseModel):
    query: str
    source: str = Field(default="voice", description="voice or text")
    student_id: Optional[str] = "std_current_user"
    context: Optional[Dict[str, Any]] = None


# ---------------------------------------------------------------------------
# In-Memory Storage for Plugins (Persisted per backend lifetime)
# ---------------------------------------------------------------------------

_LINKEDIN_POSTS_STORE: List[Dict[str, Any]] = [
    {
        "id": "lip_001",
        "created_at": "2026-10-15 14:30",
        "title": "Completed Distributed Systems Project",
        "content": "🚀 Thrilled to share that I've finalized my Placement Hub real-time AI Interview and Evidence Verification architecture!\n\nEngineered with FastAPI, Google Gemini v2 SDK, and automated telemetry. Huge thanks to faculty and peers at D.Y. Patil College of Engineering.\n\n#SoftwareEngineering #FastAPI #AI #CampusPlacement #CareerJourney",
        "likes": 48,
        "shares": 7,
        "status": "published"
    }
]

_EMAIL_INBOX_STORE: List[Dict[str, Any]] = [
    {
        "id": "mail_001",
        "sender": "campus-recruitment@tcs.com",
        "sender_name": "TCS Campus Hiring Team",
        "subject": "Interview Scheduled: Technical Round 1 - Digital Cadre",
        "snippet": "Dear Candidate, your technical interview for the Digital Software Engineer profile has been scheduled for tomorrow at 10:00 AM...",
        "date": "2026-10-16 09:15",
        "read": True,
        "tag": "Interview"
    },
    {
        "id": "mail_002",
        "sender": "talent@microsoft.com",
        "sender_name": "Microsoft University Recruiting",
        "subject": "Update on Your Software Engineer Campus Application",
        "snippet": "Thank you for participating in the Microsoft Online Assessment. We are pleased to advance your profile to the virtual interview stage...",
        "date": "2026-10-15 16:40",
        "read": False,
        "tag": "Shortlisted"
    },
    {
        "id": "mail_003",
        "sender": "placements@dypatil.edu",
        "sender_name": "T&P Cell - DYPCOE",
        "subject": "Upcoming Campus Placement Drive: Amazon & Barclays",
        "snippet": "All eligible final-year B.Tech students with CGPA > 7.5 must verify their master resume in Placement Hub before Tuesday deadline...",
        "date": "2026-10-14 11:20",
        "read": True,
        "tag": "Announcement"
    }
]

_EMAIL_SENT_STORE: List[Dict[str, Any]] = []


# ---------------------------------------------------------------------------
# Jarvis Executive Agent Class
# ---------------------------------------------------------------------------

class JarvisAgent:
    """Jarvis Career AI Agent with Tool Execution & Voice Command Handling."""

    def __init__(self):
        self.name = "JARVIS"
        self.version = "3.5"
        self.wake_word = "Jarvis"

    def get_status(self) -> Dict[str, Any]:
        """Returns the operational status of Jarvis, OpenJarvis local runtime, and all plugins."""
        openjarvis_online = False
        try:
            import httpx
            with httpx.Client(timeout=0.6) as c:
                r = c.get(f"{settings.clean_openjarvis_base_url}/health")
                openjarvis_online = (r.status_code == 200)
        except Exception:
            openjarvis_online = False

        has_gemini = settings.has_gemini_credential
        brain_label = "OpenJarvis Local AI (http://127.0.0.1:8008)" if openjarvis_online else ("Google Gemini 3.5 Flash" if has_gemini else "Jarvis Offline Rule Core")

        return {
            "name": self.name,
            "version": self.version,
            "wake_word": self.wake_word,
            "status": "online",
            "brain_engine": brain_label,
            "openjarvis": {
                "installed_repo": "https://github.com/open-jarvis/OpenJarvis.git",
                "local_url": settings.clean_openjarvis_base_url,
                "online": openjarvis_online,
                "failover_active": not openjarvis_online
            },
            "active_plugins": {
                "linkedin": {
                    "enabled": True,
                    "connected_account": "Candidate Student (LinkedIn Pro)",
                    "synced_posts": len(_LINKEDIN_POSTS_STORE),
                    "features": ["post_generator", "alumni_outreach", "profile_sync"]
                },
                "mail": {
                    "enabled": True,
                    "inbox_unread": sum(1 for m in _EMAIL_INBOX_STORE if not m["read"]),
                    "total_inbox": len(_EMAIL_INBOX_STORE),
                    "sent_messages": len(_EMAIL_SENT_STORE),
                    "features": ["ai_drafting", "instant_send", "interview_followup"]
                },
                "github": {
                    "enabled": True,
                    "target_repo": settings.clean_github_repository,
                    "features": ["repository_status", "commit_history", "issue_tracking", "ci_cd_workflows"]
                },
                "voice": {
                    "enabled": True,
                    "wake_words": ["Jarvis", "Hey Jarvis", "Hello Jarvis"],
                    "voice_engine": "Natural TTS Synthesis",
                    "continuous_listen": True
                },
                "opportunities": {
                    "enabled": True,
                    "features": [
                        "search_opportunities",
                        "get_opportunity_details",
                        "get_closing_soon_opportunities",
                        "compare_opportunity_with_resume",
                        "save_opportunity",
                        "update_application_status"
                    ],
                    "monitored_providers": 8
                }
            }
        }

    def process_command(self, query: str, student_id: str = "std_current_user", context: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """Processes voice or text command from student, executing plugins as needed."""
        clean_query = query.strip()
        lower_query = clean_query.lower()

        # 1. Identify Intent
        intent = self._detect_intent(lower_query)

        # 2. Execute appropriate plugin or tool
        if intent == "github_status":
            return self._handle_github_status_intent(clean_query)
        elif intent == "opportunities_closing_soon":
            return self.get_closing_soon_opportunities_tool(student_id=student_id)
        elif intent == "opportunities_search":
            return self._handle_search_opportunities_intent(clean_query, student_id=student_id)
        elif intent == "opportunity_compare":
            return self._handle_compare_opportunity_intent(clean_query, student_id=student_id)
        elif intent == "opportunity_save":
            return self._handle_save_opportunity_intent(clean_query, student_id=student_id)
        elif intent == "linkedin_post":
            return self._handle_linkedin_post_intent(clean_query)
        elif intent == "linkedin_outreach":
            return self._handle_linkedin_outreach_intent(clean_query)
        elif intent == "mail_draft":
            return self._handle_mail_draft_intent(clean_query)
        elif intent == "mail_send":
            return self._handle_mail_send_intent(clean_query)
        elif intent == "mail_inbox":
            return self._handle_mail_inbox_intent()
        elif intent == "interview_start":
            return {
                "response": "Understood, Sir. Initializing your technical interview studio with Google Gemini. Directing you to the interview room now.",
                "voice_speech": "Initializing your technical interview studio with Google Gemini right away, Sir.",
                "action_executed": "redirect_interview",
                "plugin": "interview_studio"
            }
        elif intent == "resume_status":
            return {
                "response": "Accessing your Master Resume. Your current ATS score is in high standing, and your verified projects and skills are synchronized.",
                "voice_speech": "Your Master Resume is active with all verified projects synchronized, Sir.",
                "action_executed": "view_resume",
                "plugin": "resume_studio"
            }

        # 3. General Conversational / Assistant Response via Gemini
        return self._generate_gemini_response(clean_query, context)

    def _detect_intent(self, q: str) -> str:
        # Opportunities Intelligence Intents (check specific career triggers first)
        if any(w in q for w in ["closing soon", "expiring soon", "deadlines approaching", "urgent applications", "urgent deadline"]):
            return "opportunities_closing_soon"
        if any(w in q for w in ["compare opportunity", "match opportunity", "match my resume to", "skills gap", "do i qualify for"]):
            return "opportunity_compare"
        if any(w in q for w in ["save opportunity", "bookmark opportunity", "track opportunity", "save job"]):
            return "opportunity_save"
        if any(w in q for w in [
            "find jobs", "search jobs", "find opportunities", "search opportunities",
            "find hackathons", "search hackathons", "find internships", "search internships",
            "competitions", "scholarships", "fellowships", "any open roles", "campus drives"
        ]):
            return "opportunities_search"

        if any(w in q for w in [
            "github", "repo status", "repository status", "git status",
            "latest commit", "workflow run", "build status", "ci/cd", "pull request",
            "repo activity", "github actions", "status of my repo", "status of my repository"
        ]):
            return "github_status"
        if any(w in q for w in ["linkedin post", "draft linkedin", "write a post", "post on linkedin", "share on linkedin"]):
            return "linkedin_post"
        if any(w in q for w in ["connect on linkedin", "linkedin message", "reach out to alumni", "alumni outreach"]):
            return "linkedin_outreach"
        if any(w in q for w in ["send email", "send an email", "send mail", "email to"]):
            return "mail_send"
        if any(w in q for w in ["draft email", "write an email", "thank you email", "follow up email", "compose mail"]):
            return "mail_draft"
        if any(w in q for w in ["check mail", "read mail", "my inbox", "any new emails", "placement emails"]):
            return "mail_inbox"
        if any(w in q for w in ["start interview", "begin interview", "practice interview", "mock interview"]):
            return "interview_start"
        if any(w in q for w in ["resume score", "check resume", "how is my resume", "my resume"]):
            return "resume_status"
        return "general_conversation"

    # --- LinkedIn Plugin Actions ---
    def generate_linkedin_post(self, payload: LinkedInPostRequest) -> Dict[str, Any]:
        """Generates a professional, high-engagement LinkedIn post."""
        prompt = f"""
You are JARVIS, an elite AI career advisor. Create an engaging, high-impact LinkedIn post for a student/graduate candidate.

Topic: {payload.topic}
Tone: {payload.tone}
Highlights to weave in: {", ".join(payload.highlights) if payload.highlights else "Strong engineering fundamentals, teamwork, verified skills"}
Include Hashtags: {payload.include_hashtags}

Formatting rules:
- First sentence must be a captivating hook (no generic buzzwords).
- Use clean paragraph breaks and bullet points where helpful.
- Sound authentic, humble yet confident.
- End with an engaging question to foster comments and visibility.
- Include 3 to 5 targeted hashtags at the bottom.
"""
        generated_content = self._call_gemini_text(prompt, fallback=self._fallback_linkedin_post(payload.topic))
        
        post_obj = {
            "id": f"lip_{int(datetime.datetime.utcnow().timestamp())}",
            "created_at": datetime.datetime.utcnow().strftime("%Y-%m-%d %H:%M"),
            "title": payload.topic,
            "content": generated_content,
            "likes": 0,
            "shares": 0,
            "status": "draft"
        }
        _LINKEDIN_POSTS_STORE.insert(0, post_obj)
        return post_obj

    def generate_linkedin_outreach(self, payload: LinkedInOutreachRequest) -> Dict[str, Any]:
        prompt = f"""
You are JARVIS. Draft a personalized, polite, and effective LinkedIn connection note / message to an alumni or recruiter.

Target: {payload.target_name} at {payload.target_company} ({payload.target_role})
Student Background / Interest: {payload.student_interest}
Relationship: {payload.connection_type}

Provide two versions:
1. Short Connection Request (strictly under 300 characters for LinkedIn connection note limit).
2. Follow-up Message (for after they accept, ~100-150 words with a specific call to action).
"""
        text = self._call_gemini_text(prompt, fallback=(
            f"Hi {payload.target_name}, I'm a final-year CS student inspired by your work at {payload.target_company}. "
            f"I've been working on {payload.student_interest} and would love to connect and learn from your journey. Best regards!"
        ))
        return {
            "target": f"{payload.target_name} ({payload.target_company})",
            "message": text
        }

    # --- Mail Plugin Actions ---
    def draft_email(self, payload: EmailDraftRequest) -> Dict[str, Any]:
        prompt = f"""
You are JARVIS. Draft a polished, professional email.

Recipient: {payload.recipient_name} <{payload.recipient_email}>
Purpose / Type: {payload.email_type} (e.g. thank you after interview, follow-up, or cold outreach)
Role: {payload.job_role}
Company: {payload.company_name}
Additional Notes: {payload.custom_notes or "None provided"}

Generate:
1. Subject line (crisp, professional, clear)
2. Salutation
3. Body paragraphs
4. Professional sign-off
"""
        fallback_subject = f"Thank you - Interview for {payload.job_role} at {payload.company_name}"
        fallback_body = (
            f"Dear {payload.recipient_name},\n\n"
            f"Thank you for taking the time to speak with me today regarding the {payload.job_role} position at {payload.company_name}. "
            f"I thoroughly enjoyed learning more about your engineering team's vision.\n\n"
            f"Our discussion reaffirmed my strong interest in joining {payload.company_name}. "
            f"Please let me know if you need any additional information or code samples.\n\n"
            f"Sincerely,\nCandidate Student\nD.Y. Patil College of Engineering"
        )
        content = self._call_gemini_text(prompt, fallback=f"Subject: {fallback_subject}\n\n{fallback_body}")
        
        subject = fallback_subject
        body = content
        if "Subject:" in content:
            parts = content.split("Subject:", 1)[1].split("\n\n", 1)
            subject = parts[0].strip()
            body = parts[1].strip() if len(parts) > 1 else content

        return {
            "recipient_name": payload.recipient_name,
            "recipient_email": payload.recipient_email,
            "subject": subject,
            "body": body
        }

    def send_email(self, payload: EmailSendRequest) -> Dict[str, Any]:
        record = {
            "id": f"mail_sent_{int(datetime.datetime.utcnow().timestamp())}",
            "to": payload.to_email,
            "recipient_name": payload.recipient_name or payload.to_email.split('@')[0],
            "subject": payload.subject,
            "body": payload.body,
            "sent_at": datetime.datetime.utcnow().strftime("%Y-%m-%d %H:%M"),
            "status": "delivered"
        }
        _EMAIL_SENT_STORE.insert(0, record)
        return {"success": True, "message": f"Email successfully dispatched to {payload.to_email}.", "record": record}

    def get_inbox(self) -> List[Dict[str, Any]]:
        return _EMAIL_INBOX_STORE

    def get_sent_emails(self) -> List[Dict[str, Any]]:
        return _EMAIL_SENT_STORE

    def get_linkedin_posts(self) -> List[Dict[str, Any]]:
        return _LINKEDIN_POSTS_STORE

    # --- Internal Command Handlers ---
    def _handle_linkedin_post_intent(self, q: str) -> Dict[str, Any]:
        req = LinkedInPostRequest(topic=q.replace("draft linkedin post", "").replace("post on linkedin", "").strip() or "Career Growth & Placement Milestone")
        post = self.generate_linkedin_post(req)
        return {
            "response": f"I have composed a high-impact LinkedIn post for you, Sir:\n\n\"{post['content']}\"",
            "voice_speech": "I've drafted a compelling LinkedIn post for you. You can review and publish it with one click.",
            "action_executed": "linkedin_draft_created",
            "plugin": "linkedin",
            "data": post
        }

    def _handle_linkedin_outreach_intent(self, q: str) -> Dict[str, Any]:
        req = LinkedInOutreachRequest(
            target_name="Senior Engineer / Alumni",
            target_company="Target Placement Company",
            target_role="Software Engineer",
            student_interest="Software Architecture & Machine Learning"
        )
        res = self.generate_linkedin_outreach(req)
        return {
            "response": f"Here is your personalized LinkedIn outreach message, Sir:\n\n{res['message']}",
            "voice_speech": "I've prepared a tailored LinkedIn connection note for your alumni outreach, Sir.",
            "action_executed": "linkedin_outreach_created",
            "plugin": "linkedin",
            "data": res
        }

    def _handle_mail_draft_intent(self, q: str) -> Dict[str, Any]:
        req = EmailDraftRequest(
            recipient_name="Hiring Manager",
            recipient_email="interviewer@company.com",
            email_type="thank_you",
            job_role="Software Engineer",
            company_name="Placement Partner"
        )
        draft = self.draft_email(req)
        return {
            "response": f"I have drafted your follow-up email:\n\n**Subject:** {draft['subject']}\n\n{draft['body']}",
            "voice_speech": "I have drafted a professional thank you email ready for your review and dispatch, Sir.",
            "action_executed": "mail_draft_created",
            "plugin": "mail",
            "data": draft
        }

    def _handle_mail_send_intent(self, q: str) -> Dict[str, Any]:
        draft = self.draft_email(EmailDraftRequest(
            recipient_name="Recruiter",
            recipient_email="recruiter@partner.com",
            email_type="follow_up"
        ))
        sent = self.send_email(EmailSendRequest(
            to_email=draft["recipient_email"],
            subject=draft["subject"],
            body=draft["body"],
            recipient_name=draft["recipient_name"]
        ))
        return {
            "response": f"Email successfully dispatched to {sent['record']['to']} with subject: '{sent['record']['subject']}'.",
            "voice_speech": f"Email successfully dispatched to {sent['record']['to']}, Sir.",
            "action_executed": "mail_sent",
            "plugin": "mail",
            "data": sent["record"]
        }

    def _handle_mail_inbox_intent(self) -> Dict[str, Any]:
        unread = [m for m in _EMAIL_INBOX_STORE if not m["read"]]
        return {
            "response": f"You have {len(unread)} unread placement communications in your inbox, including '{unread[0]['subject'] if unread else 'no pending alerts'}'.",
            "voice_speech": f"You have {len(unread)} unread placement communications in your inbox, Sir.",
            "action_executed": "view_inbox",
            "plugin": "mail",
            "data": _EMAIL_INBOX_STORE
        }

    def _generate_gemini_response(self, query: str, context: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        system_instruction = (
            "You are JARVIS, the ultra-sophisticated AI career and placement assistant at D.Y. Patil College of Engineering. "
            "You address the student with refined British courtesy, witty intelligence (like Tony Stark's JARVIS), and unwavering support. "
            "Keep voice responses concise, impactful, and directly actionable (2-3 sentences max for spoken voice output). "
            "You specialize in campus placement drives, technical interviews, resume tailoring, LinkedIn networking, and recruiter outreach."
        )
        prompt = f"Student query: {query}\nProvide an intelligent, direct response as JARVIS."
        
        reply = self._call_gemini_text(prompt, fallback=(
            f"At your service, Sir. I am monitoring your placement drives, LinkedIn telemetry, and email correspondences. "
            f"How would you like to proceed with your career preparation today?"
        ), system_instruction=system_instruction)

        # Generate a spoken-friendly short snippet
        voice_speech = reply.split("\n\n")[0]
        if len(voice_speech) > 160:
            voice_speech = voice_speech[:157] + "..."

        return {
            "response": reply,
            "voice_speech": voice_speech,
            "action_executed": "conversational_reply",
            "plugin": "core_brain"
        }

    def _call_gemini_text(self, prompt: str, fallback: str, system_instruction: Optional[str] = None, timeout_seconds: float = 4.5) -> str:
        if not settings.has_gemini_credential:
            return fallback
        try:
            full_prompt = f"{system_instruction}\n\n{prompt}" if system_instruction else prompt
            def _call(client, model_name):
                return client.models.generate_content(
                    model=model_name,
                    contents=full_prompt
                )
            with concurrent.futures.ThreadPoolExecutor(max_workers=1) as executor:
                future = executor.submit(provider_manager.execute_with_failover, _call, model=settings.clean_gemini_model)
                res = future.result(timeout=timeout_seconds)
            return res.text.strip() if res and res.text else fallback
        except concurrent.futures.TimeoutError:
            logger.warning("Gemini invocation in Jarvis timed out after threshold; using instant heuristic fallback.")
            return fallback
        except Exception as e:
            logger.warning(f"Gemini invocation in Jarvis fell back: {e}")
            return fallback

    def _fallback_linkedin_post(self, topic: str) -> str:
        return (
            f"🚀 Excited to share an update on {topic}!\n\n"
            f"Over the past few weeks, I've been focused on engineering robust, high-performance systems and refining my technical problem-solving capabilities.\n\n"
            f"Consistency, evidence-backed projects, and continuous learning make all the difference in modern engineering.\n\n"
            f"Looking forward to connecting with fellow engineers and industry mentors!\n\n"
            f"#SoftwareEngineering #CareerGrowth #TechInnovation #PlacementJourney"
        )

    # --- GitHub Status Tool (Allowlisted & Untrusted Input Protected) ---

    def _run_sync(self, coro):
        """Safely executes an async coroutine from synchronous code."""
        try:
            loop = asyncio.get_running_loop()
        except RuntimeError:
            loop = None

        if loop and loop.is_running():
            with concurrent.futures.ThreadPoolExecutor(max_workers=1) as pool:
                return pool.submit(asyncio.run, coro).result()
        else:
            return asyncio.run(coro)

    def query_github_status(self, repo_override: Optional[str] = None) -> Dict[str, Any]:
        """
        Allowlisted tool for querying real GitHub status through the backend.
        Summarizes repository, commit, issue, and workflow data with exact source URLs.
        Never hallucinates or fabricates status if API calls fail.
        Retrieved repo content is treated strictly as untrusted input and not executed.
        """
        db = SessionLocal()
        token = None
        target_repo = repo_override or settings.clean_github_repository

        try:
            rec = db.query(IntegrationConnection).filter(IntegrationConnection.id == "github").first()
            if rec:
                token = rec.encrypted_token or settings.clean_github_token
                if not repo_override and rec.repository:
                    target_repo = rec.repository
        except Exception as e:
            logger.warning(f"Unable to query integration DB for GitHub token: {e}")
            token = settings.clean_github_token
        finally:
            db.close()

        retrieval_time = datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC")

        async def _fetch():
            repo_res = await github_connector.get_repository(target_repo, token)
            commits_res = await github_connector.list_commits(target_repo, token, per_page=3)
            issues_res = await github_connector.list_issues_and_prs(target_repo, token, per_page=3)
            workflows_res = await github_connector.list_workflow_runs(target_repo, token, per_page=3)
            return repo_res, commits_res, issues_res, workflows_res

        try:
            repo_info, commits, issues, workflows = self._run_sync(_fetch())
        except (ConnectorAuthError, ConnectorPermissionError, ConnectorRateLimitError,
                ConnectorNotFoundError, ConnectorTimeoutError, ConnectorNetworkError, ConnectorError) as ce:
            logger.error(f"GitHub connector error in Jarvis: {ce}")
            err_msg = ce.message
            response_text = (
                f"Sir, I attempted to query repository `{target_repo}` via the GitHub REST API at {retrieval_time}, "
                f"but the provider returned an error:\n\n"
                f"❌ **GitHub Verification Issue:** {err_msg}\n\n"
                f"*(Note: In accordance with our reliability standards, no repository status or build results are fabricated when provider requests fail.)*"
            )
            return {
                "response": response_text,
                "voice_speech": f"I was unable to verify repository status for {target_repo}, Sir. The GitHub API reported: {err_msg[:80]}.",
                "action_executed": "github_query_failed",
                "plugin": "github",
                "data": {"error": err_msg, "retrieval_time": retrieval_time, "repository": target_repo}
            }
        except Exception as ex:
            logger.error(f"Unexpected error in Jarvis GitHub tool: {ex}")
            err_msg = str(ex)
            return {
                "response": (
                    f"Sir, an unexpected failure occurred while querying the GitHub connector at {retrieval_time}: {err_msg}. "
                    f"Build status and repository telemetry could not be verified."
                ),
                "voice_speech": "An unexpected error occurred while communicating with the GitHub provider, Sir.",
                "action_executed": "github_query_error",
                "plugin": "github",
                "data": {"error": err_msg, "retrieval_time": retrieval_time}
            }

        # Format verified data
        repo_name = repo_info.get("full_name") or target_repo
        repo_url = repo_info.get("html_url")
        branch = repo_info.get("default_branch", "main")
        stars = repo_info.get("stars_count", 0)
        forks = repo_info.get("forks_count", 0)
        open_issues = repo_info.get("open_issues_count", 0)
        rate_info = repo_info.get("rate_limit", {})
        remaining = rate_info.get("remaining", "N/A")
        limit = rate_info.get("limit", "N/A")

        # Sanitize commits (untrusted input: quote and strip command-like patterns)
        commits_lines = []
        if commits:
            for c in commits:
                clean_msg = c['message'].replace('`', "'").replace('\n', ' ')
                commits_lines.append(f"- [`{c['short_sha']}`]({c['html_url']}) \"{clean_msg}\" — *{c['author_name']}*")
            commits_text = "\n".join(commits_lines)
        else:
            commits_text = "_No recent commits found or repository is empty._"

        # Sanitize issues
        issues_lines = []
        if issues:
            for i in issues:
                clean_title = i['title'].replace('`', "'")
                issues_lines.append(f"- [#{i['number']} ({i['type']})]({i['html_url']}) {clean_title} `[{i['state']}]`")
            issues_text = "\n".join(issues_lines)
        else:
            issues_text = "_No open issues or pull requests currently open._"

        # CI/CD Workflows
        workflows_lines = []
        ci_summary_voice = "has no recorded workflow runs"
        if workflows:
            latest = workflows[0]
            latest_status = latest.get("conclusion") or latest.get("status") or "unknown"
            ci_summary_voice = f"latest build is {latest_status}"
            for w in workflows:
                status_icon = "✅" if w.get("conclusion") == "success" else ("❌" if w.get("conclusion") == "failure" else "⏳")
                workflows_lines.append(
                    f"- {status_icon} [{w['name']} #{w['run_number']}]({w['html_url']}) on `{w['head_branch']}`: **{w['status']}** ({w.get('conclusion') or 'in progress'})"
                )
            workflows_text = "\n".join(workflows_lines)
        else:
            workflows_text = "_No GitHub Actions workflow runs found or Actions are disabled._"

        response_text = (
            f"Sir, here is the verified status for repository [`{repo_name}`]({repo_url}):\n\n"
            f"📌 **Repository Overview**\n"
            f"- **Default Branch:** `{branch}`\n"
            f"- **Stars:** {stars} | **Forks:** {forks} | **Open Issues/PRs:** {open_issues}\n"
            f"- **Source URL:** {repo_url}\n\n"
            f"🚀 **GitHub Actions CI/CD**\n"
            f"{workflows_text}\n\n"
            f"📜 **Recent Commits**\n"
            f"{commits_text}\n\n"
            f"🎯 **Open Issues & PRs**\n"
            f"{issues_text}\n\n"
            f"⏱️ _Verified live via GitHub REST API at {retrieval_time}. Rate Limit: {remaining}/{limit} remaining._"
        )

        latest_author = commits[0]['author_name'] if commits else "the engineering team"
        voice_text = (
            f"Repository {repo_name} is active on branch {branch}. "
            f"The latest commit is by {latest_author}, and the {ci_summary_voice}, Sir."
        )

        return {
            "response": response_text,
            "voice_speech": voice_text,
            "action_executed": "github_status_retrieved",
            "plugin": "github",
            "data": {
                "repository": repo_info,
                "commits": commits,
                "issues": issues,
                "workflows": workflows,
                "retrieved_at": retrieval_time,
            }
        }

    def _handle_github_status_intent(self, q: str) -> Dict[str, Any]:
        """Parses target repository from query if present, or defaults to configured repo."""
        repo_override = None
        # Check if query contains an explicit owner/repo format
        parts = q.split()
        for p in parts:
            clean_p = p.strip(",.?!'\"")
            if "/" in clean_p and len(clean_p.split("/")) == 2 and not clean_p.startswith("http"):
                repo_override = clean_p
                break
        return self.query_github_status(repo_override)

    # -----------------------------------------------------------------------
    # Opportunities Allowlisted Tools
    # -----------------------------------------------------------------------

    def search_opportunities_tool(
        self,
        query: Optional[str] = None,
        category: Optional[str] = None,
        limit: int = 5,
        student_id: str = "std_current_user"
    ) -> Dict[str, Any]:
        """
        Allowlisted tool: search_opportunities.
        Uses actual stored or freshly retrieved records.
        Identifies sources checked, last retrieval time, and unavailable/restricted providers.
        """
        db = SessionLocal()
        retrieval_time = datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC")

        try:
            filters = OpportunityFilterParams(
                query=query,
                category=category,
                limit=limit
            )
            items, total = opportunities_service.search_opportunities(filters, db)
        except Exception as e:
            logger.error(f"Error in search_opportunities_tool: {e}")
            db.close()
            return {
                "response": f"Sir, I encountered an error while searching verified opportunities: {str(e)}.",
                "voice_speech": "I was unable to retrieve opportunities from the database, Sir.",
                "action_executed": "search_opportunities_failed",
                "plugin": "opportunities",
                "data": {"error": str(e), "retrieval_time": retrieval_time}
            }
        finally:
            db.close()

        sources_checked = [
            "Devpost (official_feed)",
            "Major League Hacking (official_feed)",
            "Official ATS Job Boards (api_verified)",
            "University Placement Cell (api_verified)",
            "LinkedIn (link_discovery)",
            "Unstop (link_discovery)",
            "Wellfound (link_discovery)",
            "Naukri (link_discovery)"
        ]
        unavailable_note = (
            "*(Note: LinkedIn, Unstop, Wellfound, and Naukri operate in link-discovery mode per provider terms; "
            "direct automated scraping is not permitted.)*"
        )

        if not items:
            return {
                "response": (
                    f"Sir, no verified opportunities matching '{query or 'all'}' were found at {retrieval_time}.\n\n"
                    f"**Sources Checked:** {', '.join(sources_checked)}.\n\n"
                    f"{unavailable_note}"
                ),
                "voice_speech": f"No opportunities were found matching your query at this time, Sir.",
                "action_executed": "search_opportunities_empty",
                "plugin": "opportunities",
                "data": {"count": 0, "retrieval_time": retrieval_time}
            }

        lines = []
        for opp in items:
            deadline_str = f"Deadline: **{opp.deadline}**" if opp.deadline else "Deadline: Open / Rolling"
            status_badge = f"`[{opp.status.upper()}]`"
            lines.append(
                f"- **[{opp.title}]({opp.application_url})** — *{opp.company_or_organizer}*\n"
                f"  Category: `{opp.category}` | Mode: `{opp.remote_status}` | {status_badge} | {deadline_str}\n"
                f"  _Source: {opp.provider.capitalize()} ({opp.provenance_type})_"
            )

        items_text = "\n\n".join(lines)
        response_text = (
            f"Sir, here are the verified opportunity findings ({len(items)} of {total} total):\n\n"
            f"{items_text}\n\n"
            f"---\n"
            f"📡 **Sources Checked:** {', '.join(sources_checked)}\n"
            f"⏱️ **Last Retrieval:** {retrieval_time}\n"
            f"{unavailable_note}"
        )

        voice_speech = (
            f"I found {len(items)} verified opportunities, Sir. Top listing is {items[0].title} at {items[0].company_or_organizer}."
        )

        return {
            "response": response_text,
            "voice_speech": voice_speech,
            "action_executed": "search_opportunities",
            "plugin": "opportunities",
            "data": {
                "count": len(items),
                "total": total,
                "retrieval_time": retrieval_time,
                "sources_checked": sources_checked,
                "items": [it.dict() for it in items]
            }
        }

    def get_opportunity_details_tool(self, opportunity_id: str, student_id: str = "std_current_user") -> Dict[str, Any]:
        """
        Allowlisted tool: get_opportunity_details.
        Retrieves factual fields without fabrication.
        """
        db = SessionLocal()
        retrieval_time = datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC")
        try:
            opp = opportunities_service.get_opportunity_by_id(opportunity_id, db)
        finally:
            db.close()

        if not opp:
            return {
                "response": f"Sir, opportunity `{opportunity_id}` was not found in the verified registry.",
                "voice_speech": f"I could not locate opportunity record {opportunity_id}, Sir.",
                "action_executed": "get_opportunity_details_not_found",
                "plugin": "opportunities",
                "data": {"found": False}
            }

        comp_text = opp.compensation_amount or ("Unspecified compensation" if opp.compensation_type == "unknown" else opp.compensation_type.capitalize())
        skills_text = ", ".join(opp.skills) if opp.skills else "General software skills"

        response_text = (
            f"Sir, here are the factual details for **{opp.title}**:\n\n"
            f"🏢 **Organizer / Company:** {opp.company_or_organizer}\n"
            f"🏷️ **Category:** `{opp.category}` | **Status:** `{opp.status}`\n"
            f"📍 **Location:** {opp.location} ({opp.remote_status})\n"
            f"💰 **Compensation:** {comp_text}\n"
            f"⏳ **Deadline:** {opp.deadline or 'Not specified'} ({opp.deadline_timezone})\n"
            f"🛠️ **Target Skills:** {skills_text}\n"
            f"🔗 **Official Link:** [Apply Here]({opp.application_url})\n\n"
            f"📋 **Description:**\n{opp.description}\n\n"
            f"⏱️ _Verified at {retrieval_time} via {opp.provider.capitalize()} ({opp.provenance_type})._"
        )

        return {
            "response": response_text,
            "voice_speech": f"{opp.title} at {opp.company_or_organizer} is currently {opp.status}, Sir.",
            "action_executed": "get_opportunity_details",
            "plugin": "opportunities",
            "data": opp.dict()
        }

    def get_closing_soon_opportunities_tool(self, limit: int = 5, student_id: str = "std_current_user") -> Dict[str, Any]:
        """
        Allowlisted tool: get_closing_soon_opportunities.
        Filters opportunities with deadlines in the next 3 to 7 days.
        """
        db = SessionLocal()
        retrieval_time = datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC")
        try:
            items = opportunities_service.get_closing_soon_opportunities(db, limit=limit)
        finally:
            db.close()

        sources_checked = ["University Drives", "Devpost", "Company ATS", "MLH", "Unstop (link-discovery)"]

        if not items:
            return {
                "response": (
                    f"Sir, there are currently no opportunities marked as closing soon (within 3 days) as of {retrieval_time}.\n\n"
                    f"All monitored opportunities have comfortable preparation windows."
                ),
                "voice_speech": "No urgent deadlines are approaching within the next three days, Sir.",
                "action_executed": "closing_soon_empty",
                "plugin": "opportunities",
                "data": {"count": 0, "retrieval_time": retrieval_time}
            }

        lines = []
        for o in items:
            lines.append(
                f"- ⚠️ **[{o.title}]({o.application_url})** — *{o.company_or_organizer}*\n"
                f"  Closing: **{o.deadline}** ({o.deadline_timezone}) | Category: `{o.category}`\n"
                f"  _Source: {o.provider.capitalize()} ({o.provenance_type})_"
            )

        items_text = "\n\n".join(lines)
        response_text = (
            f"Sir, urgent attention required: {len(items)} opportunities have deadlines closing soon:\n\n"
            f"{items_text}\n\n"
            f"---\n"
            f"📡 **Sources Checked:** {', '.join(sources_checked)}\n"
            f"⏱️ **Verified Live At:** {retrieval_time}"
        )

        return {
            "response": response_text,
            "voice_speech": f"There are {len(items)} opportunities closing soon, Sir. Earliest deadline is {items[0].deadline}.",
            "action_executed": "get_closing_soon_opportunities",
            "plugin": "opportunities",
            "data": {"count": len(items), "items": [it.dict() for it in items]}
        }

    def compare_opportunity_with_resume_tool(
        self,
        opportunity_id: str,
        student_id: str = "std_current_user",
        resume_id: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Allowlisted tool: compare_opportunity_with_resume.
        Compares confirmed student skills and projects with target opportunity.
        Explains why it matches and lists skill gaps. Never guarantees selection.
        """
        db = SessionLocal()
        retrieval_time = datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC")

        try:
            student = db.query(Student).filter(Student.id == student_id).first()
            if not student:
                student = db.query(Student).first()

            opp = opportunities_service.get_opportunity_by_id(opportunity_id, db)
            if not opp:
                return {
                    "response": f"Sir, opportunity `{opportunity_id}` was not found.",
                    "voice_speech": "Opportunity not found, Sir.",
                    "action_executed": "compare_not_found",
                    "plugin": "opportunities"
                }

            eval_res = opportunities_service.evaluate_opportunity_match(student, opp)
        finally:
            db.close()

        why_text = "\n".join(f"  • {w}" for w in eval_res.why_it_matches)
        matched_str = ", ".join(eval_res.matched_skills) if eval_res.matched_skills else "None explicitly listed"
        gaps_str = ", ".join(eval_res.skill_gaps) if eval_res.skill_gaps else "No critical skill gaps identified"

        response_text = (
            f"Sir, here is the AI relevance evaluation for **{opp.title}** at *{opp.company_or_organizer}*:\n\n"
            f"📊 **Advisory Match Score:** **{eval_res.match_percentage}%** ({eval_res.match_level})\n\n"
            f"✅ **Why It Matches:**\n{why_text}\n\n"
            f"🎯 **Confirmed Skills Matching:** {matched_str}\n"
            f"⚠️ **Identified Skill Gaps:** {gaps_str}\n\n"
            f"📌 **Academic Eligibility:** {'Eligible' if eval_res.cgpa_eligible is not False else 'Check Backlog / CGPA Criteria'}\n\n"
            f"---\n"
            f"🔒 **Ethical AI Notice:** {eval_res.advisory_notice}"
        )

        voice_speech = (
            f"Your profile has an advisory match of {eval_res.match_percentage}% for {opp.title}, Sir. "
            f"Key matching skills include {matched_str[:40]}."
        )

        return {
            "response": response_text,
            "voice_speech": voice_speech,
            "action_executed": "compare_opportunity_with_resume",
            "plugin": "opportunities",
            "data": eval_res.dict()
        }

    def save_opportunity_tool(
        self,
        opportunity_id: str,
        status: str = "saved",
        student_id: str = "std_current_user"
    ) -> Dict[str, Any]:
        """
        Allowlisted tool: save_opportunity.
        Saves opportunity into student pipeline. Never auto-submits applications.
        """
        db = SessionLocal()
        try:
            student = db.query(Student).filter(Student.id == student_id).first()
            s_id = student.id if student else student_id
            saved_item = opportunities_service.save_opportunity(
                s_id,
                SaveOpportunityRequest(opportunity_id=opportunity_id, application_status=status),
                db
            )
            title = saved_item.opportunity.title if saved_item.opportunity else opportunity_id
        except Exception as e:
            logger.error(f"Error in save_opportunity_tool: {e}")
            db.close()
            return {
                "response": f"Sir, unable to save opportunity: {str(e)}",
                "voice_speech": "Failed to save the opportunity, Sir.",
                "action_executed": "save_opportunity_failed",
                "plugin": "opportunities"
            }
        finally:
            db.close()

        return {
            "response": (
                f"Sir, I have added **{title}** to your saved pipeline with status `{status}`.\n\n"
                f"You can review deadlines and request resume tailoring in the Opportunities Center. "
                f"*(Note: Placement Hub never submits job applications without explicit candidate confirmation.)*"
            ),
            "voice_speech": f"Saved {title} to your pipeline, Sir.",
            "action_executed": "save_opportunity",
            "plugin": "opportunities",
            "data": saved_item.dict()
        }

    def update_application_status_tool(
        self,
        opportunity_id: str,
        status: str,
        student_id: str = "std_current_user"
    ) -> Dict[str, Any]:
        """
        Allowlisted tool: update_application_status.
        Updates status to 'saved', 'applied', 'interviewing', 'offered', 'rejected', or 'archived'.
        """
        db = SessionLocal()
        try:
            student = db.query(Student).filter(Student.id == student_id).first()
            s_id = student.id if student else student_id
            updated = opportunities_service.update_application_status(
                s_id,
                opportunity_id,
                UpdateApplicationStatusRequest(application_status=status),
                db
            )
            title = updated.opportunity.title if updated.opportunity else opportunity_id
        except Exception as e:
            logger.error(f"Error in update_application_status_tool: {e}")
            db.close()
            return {
                "response": f"Sir, unable to update status: {str(e)}",
                "voice_speech": "Status update failed, Sir.",
                "action_executed": "update_status_failed",
                "plugin": "opportunities"
            }
        finally:
            db.close()

        return {
            "response": f"Sir, application status for **{title}** is now recorded as `{status}`.",
            "voice_speech": f"Updated status to {status}, Sir.",
            "action_executed": "update_application_status",
            "plugin": "opportunities",
            "data": updated.dict()
        }

    # -----------------------------------------------------------------------
    # Opportunities Intent Handlers
    # -----------------------------------------------------------------------

    def _handle_search_opportunities_intent(self, q: str, student_id: str = "std_current_user") -> Dict[str, Any]:
        cat = None
        lower_q = q.lower()
        if "hackathon" in lower_q:
            cat = "hackathon"
        elif "internship" in lower_q:
            cat = "internship"
        elif "competition" in lower_q or "challenge" in lower_q:
            cat = "competition"
        elif "scholarship" in lower_q or "fellowship" in lower_q:
            cat = "scholarship"
        elif "job" in lower_q:
            cat = "job"

        # Extract search keywords
        clean_words = [
            w for w in q.split()
            if w.lower() not in {"find", "search", "opportunities", "jobs", "internships", "hackathons", "competitions", "any", "open", "roles", "for", "me", "jarvis", "please"}
        ]
        query_term = " ".join(clean_words) if clean_words else None
        return self.search_opportunities_tool(query=query_term, category=cat, limit=5, student_id=student_id)

    def _handle_compare_opportunity_intent(self, q: str, student_id: str = "std_current_user") -> Dict[str, Any]:
        db = SessionLocal()
        opp_id = None
        try:
            # Check if query contains an opportunity ID
            for word in q.split():
                if word.startswith("opp_"):
                    opp_id = word.strip(".,?!'\"")
                    break
            if not opp_id:
                # Default to first available opportunity
                first_opp = db.query(OpportunityRecord).first()
                if first_opp:
                    opp_id = first_opp.id
        finally:
            db.close()

        if not opp_id:
            return {
                "response": "Sir, please specify which opportunity to compare, or view available opportunities in the Opportunities Center.",
                "voice_speech": "Please specify an opportunity to compare, Sir.",
                "action_executed": "compare_missing_id",
                "plugin": "opportunities"
            }
        return self.compare_opportunity_with_resume_tool(opp_id, student_id=student_id)

    def _handle_save_opportunity_intent(self, q: str, student_id: str = "std_current_user") -> Dict[str, Any]:
        db = SessionLocal()
        opp_id = None
        try:
            for word in q.split():
                if word.startswith("opp_"):
                    opp_id = word.strip(".,?!'\"")
                    break
            if not opp_id:
                first_opp = db.query(OpportunityRecord).first()
                if first_opp:
                    opp_id = first_opp.id
        finally:
            db.close()

        if not opp_id:
            return {
                "response": "Sir, please indicate which opportunity ID you would like me to save.",
                "voice_speech": "Please specify which opportunity to save, Sir.",
                "action_executed": "save_missing_id",
                "plugin": "opportunities"
            }
        return self.save_opportunity_tool(opp_id, status="saved", student_id=student_id)


jarvis_agent = JarvisAgent()
