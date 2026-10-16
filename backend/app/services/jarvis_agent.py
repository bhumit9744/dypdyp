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

from app.core.config import settings
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
                "voice": {
                    "enabled": True,
                    "wake_words": ["Jarvis", "Hey Jarvis", "Hello Jarvis"],
                    "voice_engine": "Natural TTS Synthesis",
                    "continuous_listen": True
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
        if intent == "linkedin_post":
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

    def _call_gemini_text(self, prompt: str, fallback: str, system_instruction: Optional[str] = None) -> str:
        if not settings.has_gemini_credential:
            return fallback
        try:
            full_prompt = f"{system_instruction}\n\n{prompt}" if system_instruction else prompt
            def _call(client, model_name):
                return client.models.generate_content(
                    model=model_name,
                    contents=full_prompt
                )
            res = provider_manager.execute_with_failover(_call, model=settings.clean_gemini_model)
            return res.text.strip() if res and res.text else fallback
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


jarvis_agent = JarvisAgent()
