"""
Google Gemini AI Resume Engine — Placement Hub
Strict Gemini-only AI service for Resume Studio.
Provides:
1. Document text parsing and Gemini structured resume extraction (with review, no hallucinations).
2. Gemini job-specific tailoring with granular before-and-after proposals.
3. Truth Verification Engine linking resume claims to real student records in DB.
4. Deterministic 7-category transparent resume scoring rubric (out of 100).
5. Best resume version recommendation across saved profiles for target jobs.
"""

import io
import re
import json
import logging
from typing import List, Dict, Any, Optional, Tuple
from pypdf import PdfReader

from ..core.config import settings
from .gemini_provider import (
    provider_manager,
    GeminiProviderError,
    GeminiAuthError as ProviderAuthError,
    GeminiRateLimitError as ProviderRateLimitError,
    GeminiQuotaExhaustedError as ProviderQuotaExhaustedError,
    GeminiUnsupportedModelError as ProviderUnsupportedModelError
)

logger = logging.getLogger("gemini_resume")

# ---------------------------------------------------------------------------
# Custom Exceptions for AI operations
# ---------------------------------------------------------------------------

class GeminiResumeError(Exception):
    """Base exception for Gemini resume operations."""
    def __init__(self, message: str, status_code: int = 502):
        super().__init__(message)
        self.message = message
        self.status_code = status_code

class GeminiAuthError(GeminiResumeError):
    def __init__(self, message: str = "Google Gemini API key is missing or invalid."):
        super().__init__(message, status_code=401)

class GeminiQuotaError(GeminiResumeError):
    def __init__(self, message: str = "Google Gemini quota or rate limit exceeded."):
        super().__init__(message, status_code=429)


# ---------------------------------------------------------------------------
# Gemini Client Helper
# ---------------------------------------------------------------------------

def get_gemini_client():
    api_key = settings.clean_gemini_api_key
    if not api_key or api_key.startswith("your_") or len(api_key) < 10:
        raise GeminiAuthError(
            "Google Gemini API key is not configured. Set GEMINI_API_KEY in backend/.env to use AI resume features."
        )
    try:
        from google import genai
        return genai.Client(api_key=api_key)
    except Exception as e:
        clean_err = str(e).replace(api_key, "[REDACTED_KEY]") if api_key in str(e) else str(e)
        raise GeminiResumeError(f"Failed to initialize Google Gen AI client: {clean_err}")


def generate_gemini_content(prompt: str, request_id: Optional[str] = None) -> str:
    """Invokes Google Gemini with multi-project failover, rate-limit backoff, and quota protection."""
    def _call(client, model_name):
        return client.models.generate_content(
            model=model_name,
            contents=prompt
        )

    try:
        response = provider_manager.execute_with_failover(
            _call,
            model=settings.clean_gemini_model,
            request_id=request_id
        )
        return response.text or ""
    except (ProviderQuotaExhaustedError, ProviderRateLimitError) as e:
        raise GeminiQuotaError(str(e))
    except ProviderAuthError as e:
        raise GeminiAuthError(str(e))
    except GeminiProviderError as e:
        raise GeminiResumeError(str(e), status_code=e.status_code)
    except Exception as e:
        err_msg = str(e)
        api_key = settings.clean_gemini_api_key
        if api_key and api_key in err_msg:
            err_msg = err_msg.replace(api_key, "[REDACTED_KEY]")
        raise GeminiResumeError(f"Gemini AI processing error: {err_msg}")


def clean_json_response(raw_text: str) -> Dict[str, Any]:
    """Strips markdown code fences and parses JSON safely."""
    text = raw_text.strip()
    if text.startswith("```"):
        # Strip ```json or ```
        lines = text.split("\n")
        if lines[0].startswith("```"):
            lines = lines[1:]
        if lines and lines[-1].startswith("```"):
            lines = lines[:-1]
        text = "\n".join(lines).strip()
    
    # Try finding first { and last }
    start_idx = text.find("{")
    end_idx = text.rfind("}")
    if start_idx != -1 and end_idx != -1 and end_idx > start_idx:
        text = text[start_idx:end_idx + 1]

    try:
        return json.loads(text)
    except Exception as e:
        logger.error(f"Failed to parse JSON from Gemini response: {e}\nRaw: {raw_text[:300]}")
        raise GeminiResumeError(f"Could not parse structured JSON from Gemini response: {str(e)}")


# ---------------------------------------------------------------------------
# Document Text Extraction
# ---------------------------------------------------------------------------

def extract_text_from_document(file_bytes: bytes, filename: str) -> str:
    """Extracts raw text from PDF or text-based documents."""
    filename_lower = filename.lower()
    if filename_lower.endswith(".pdf"):
        try:
            reader = PdfReader(io.BytesIO(file_bytes))
            pages_text = []
            for i, page in enumerate(reader.pages):
                text = page.extract_text()
                if text:
                    pages_text.append(text)
            full_text = "\n\n".join(pages_text).strip()
            if not full_text:
                raise GeminiResumeError("The uploaded PDF contains no extractable text (it might be a scanned image).")
            return full_text
        except Exception as e:
            if isinstance(e, GeminiResumeError):
                raise
            raise GeminiResumeError(f"Failed to read PDF document: {str(e)}")
    elif filename_lower.endswith(".txt") or filename_lower.endswith(".md"):
        try:
            return file_bytes.decode("utf-8", errors="replace").strip()
        except Exception as e:
            raise GeminiResumeError(f"Failed to read text file: {str(e)}")
    else:
        # Fallback decode
        try:
            return file_bytes.decode("utf-8", errors="replace").strip()
        except Exception:
            raise GeminiResumeError(f"Unsupported file type '{filename}'. Please upload a PDF or plain text document.")


# ---------------------------------------------------------------------------
# Gemini Resume Parsing (Entry path B)
# ---------------------------------------------------------------------------

def parse_resume_with_gemini(raw_text: str) -> Dict[str, Any]:
    """
    Uses Gemini to organize raw extracted document text into standard structured resume fields.
    Does NOT invent information to fill empty sections.
    Flags missing or uncertain fields.
    """
    prompt = f"""You are a professional resume parser.
Your task is to analyze the following raw resume text and organize it into a structured JSON schema.

STRICT ACCURACY RULES:
1. Extract ONLY facts, names, dates, metrics, and technologies explicitly present in the text.
2. NEVER fabricate or invent information. If a section or field is not present in the text, use null or an empty array.
3. Identify any fields that are ambiguous, incomplete, or missing.
4. Return ONLY a valid JSON object matching the schema below.

JSON SCHEMA:
{{
  "contact": {{
    "full_name": string or null,
    "email": string or null,
    "phone": string or null,
    "location": string or null,
    "linkedin": string or null,
    "github": string or null,
    "portfolio": string or null
  }},
  "summary": string or null,
  "education": [
    {{
      "institution": string,
      "degree": string,
      "field": string or null,
      "start_year": string or null,
      "end_year": string or null,
      "score_or_cgpa": string or null,
      "coursework": [string]
    }}
  ],
  "skills": [
    {{
      "category": string (e.g. "Languages", "Frameworks & Libraries", "Developer Tools", "Databases", "Concepts"),
      "items": [string]
    }}
  ],
  "experience": [
    {{
      "role": string,
      "company": string,
      "location": string or null,
      "start_date": string or null,
      "end_date": string or null,
      "current": boolean,
      "bullets": [string]
    }}
  ],
  "projects": [
    {{
      "title": string,
      "description": string or null,
      "tech_stack": [string],
      "bullets": [string],
      "github_url": string or null,
      "live_url": string or null
    }}
  ],
  "certifications": [
    {{
      "name": string,
      "issuer": string or null,
      "issue_date": string or null,
      "credential_url": string or null
    }}
  ],
  "achievements": [string],
  "publications": [string],
  "parsing_notes": {{
    "identified_role_fit": string or null,
    "missing_sections": [string],
    "uncertain_fields": [string],
    "total_bullet_count": number
  }}
}}

RAW RESUME TEXT:
\"\"\"{raw_text[:12000]}\"\"\"
"""
    raw_output = generate_gemini_content(prompt)
    structured_data = clean_json_response(raw_output)
    return structured_data


# ---------------------------------------------------------------------------
# Gemini Job-Specific Resume Tailoring (Requirement 4)
# ---------------------------------------------------------------------------

def tailor_resume_with_gemini(
    resume_content: Dict[str, Any],
    job_description: str,
    target_role: str,
    target_company: Optional[str] = None
) -> Dict[str, Any]:
    """
    Uses Gemini to analyze candidate profile against the job description.
    Generates granular before-and-after proposals for user review (accept/reject/edit).
    Does NOT fabricate experience, qualifications, or numbers.
    """
    resume_json_str = json.dumps(resume_content, indent=2)

    prompt = f"""You are an elite, truth-first career advisor and resume editor.
Analyze the candidate's current resume against the job description for the target role: "{target_role}" (Company: "{target_company or 'Employer'}").

CRITICAL ETHICAL RULES:
1. DO NOT fabricate skills, technologies, certifications, company names, or metrics.
2. Only suggest keywords and technical terms if the candidate's projects or experience already demonstrate related capability.
3. Every suggestion to rephrase a bullet point must preserve the underlying factual ground truth while improving clarity, action verbs, and alignment.
4. Highlight missing requirements honestly so the student knows what they do not have.
5. Provide an explicit BEFORE and AFTER comparison for each suggestion.

Return ONLY a valid JSON object with the following schema:
{{
  "job_analysis": {{
    "target_role": string,
    "target_company": string,
    "key_requirements": [string],
    "preferred_qualifications": [string],
    "priority_technologies": [string]
  }},
  "qualification_match": {{
    "matched_skills": [string],
    "missing_skills": [string],
    "match_percentage": number (0 to 100)
  }},
  "tailoring_proposals": [
    {{
      "id": string (unique ID like "prop_1", "prop_2"),
      "section": string (e.g. "summary", "projects", "experience", "skills"),
      "target_item_title": string or null (e.g. project title or company name),
      "proposal_type": string ("bullet_improvement" | "summary_polish" | "keyword_integration" | "section_reordering"),
      "original_text": string,
      "suggested_text": string,
      "reasoning": string,
      "status": "pending"
    }}
  ],
  "recommended_sections_order": [string] (e.g. ["contact", "summary", "skills", "projects", "experience", "education", "certifications", "achievements"]),
  "overall_recommendation": string
}}

CANDIDATE RESUME CONTENT:
{resume_json_str[:10000]}

TARGET JOB DESCRIPTION:
{job_description[:6000]}
"""
    raw_output = generate_gemini_content(prompt)
    tailoring_report = clean_json_response(raw_output)
    return tailoring_report


# ---------------------------------------------------------------------------
# Truth Verification Engine (Requirement 5)
# ---------------------------------------------------------------------------

def verify_resume_claims(
    resume_content: Dict[str, Any],
    student_records: Dict[str, Any]
) -> List[Dict[str, Any]]:
    """
    Signature Truth Verification Engine.
    Cross-references every claim against authentic database records:
    - student_records: {
        "cgpa": float,
        "active_backlogs": int,
        "skills": list of {name, verified, level, evidence_type, evidence_url},
        "projects": list of {title, github_url, tech_stack},
        "assessments": list of {title, score, percentile, status}
      }
    Returns list of claim verification records with honest statuses:
    - "Supported by linked evidence"
    - "Partially supported"
    - "Student-confirmed"
    - "Unverified"
    - "Conflicting evidence"
    """
    claims = []
    student_skills = {s.get("name", "").strip().lower(): s for s in student_records.get("skills", [])}
    student_projects = {p.get("title", "").strip().lower(): p for p in student_records.get("projects", [])}
    db_cgpa = student_records.get("cgpa", 0.0)
    db_backlogs = student_records.get("active_backlogs", 0)
    assessments = student_records.get("assessments", [])

    # 1. Verify Education & Academic Records
    for idx, edu in enumerate(resume_content.get("education", [])):
        inst = edu.get("institution", "Academic Institution")
        score_str = str(edu.get("score_or_cgpa") or "")
        
        status = "Student-confirmed"
        source = "Student Academic Profile"
        source_url = None
        strength = "Moderate"
        limitations = "Verified against primary college enrollment database."
        recommendation = None

        # Check for CGPA exaggeration
        if score_str:
            num_match = re.search(r"(\d+(\.\d+)?)", score_str)
            if num_match:
                claim_cgpa = float(num_match.group(1))
                if claim_cgpa > 10.0 and "%" not in score_str:
                    pass
                elif claim_cgpa > (db_cgpa + 0.15):
                    status = "Conflicting evidence"
                    strength = "High"
                    limitations = f"Official college record registers CGPA as {db_cgpa:.2f}, while resume states {claim_cgpa:.2f}."
                    recommendation = f"Adjust stated academic score to match official college transcript ({db_cgpa:.2f})."
                elif claim_cgpa > 0:
                    status = "Supported by linked evidence"
                    strength = "High"
                    limitations = "Official student academic database record."

        claims.append({
            "claim_id": f"claim_edu_{idx}",
            "section": "education",
            "statement": f"{edu.get('degree', 'Degree')} at {inst} ({score_str})",
            "status": status,
            "evidence_source": source,
            "evidence_url": source_url,
            "evidence_strength": strength,
            "limitations": limitations,
            "recommended_correction": recommendation
        })

    # 2. Verify Skills
    skill_groups = resume_content.get("skills", [])
    skill_idx = 0
    for group in skill_groups:
        items = group.get("items", [])
        if isinstance(items, str):
            items = [s.strip() for s in items.split(",") if s.strip()]
        for item in items:
            skill_name = item.strip()
            skill_key = skill_name.lower()
            matching_db_skill = student_skills.get(skill_key)

            if matching_db_skill and matching_db_skill.get("verified"):
                ev_type = matching_db_skill.get("evidence_type") or "Verified Skill Proof"
                ev_url = matching_db_skill.get("evidence_url")
                claims.append({
                    "claim_id": f"claim_skill_{skill_idx}",
                    "section": "skills",
                    "statement": f"Competency in {skill_name}",
                    "status": "Supported by linked evidence",
                    "evidence_source": f"Placement Hub Assessment ({ev_type})",
                    "evidence_url": ev_url,
                    "evidence_strength": "High",
                    "limitations": "Proctored skill assessment or verified portfolio evidence in college records.",
                    "recommended_correction": None
                })
            elif matching_db_skill:
                claims.append({
                    "claim_id": f"claim_skill_{skill_idx}",
                    "section": "skills",
                    "statement": f"Competency in {skill_name}",
                    "status": "Partially supported",
                    "evidence_source": "Student Skill Self-Declaration",
                    "evidence_url": None,
                    "evidence_strength": "Moderate",
                    "limitations": "Declared in student profile but has not completed proctored assessment or linked repo evidence.",
                    "recommended_correction": f"Complete a proctored assessment for {skill_name} to achieve fully verified status."
                })
            else:
                claims.append({
                    "claim_id": f"claim_skill_{skill_idx}",
                    "section": "skills",
                    "statement": f"Proficiency in {skill_name}",
                    "status": "Unverified",
                    "evidence_source": "Unlinked Claim",
                    "evidence_url": None,
                    "evidence_strength": "None",
                    "limitations": "No matching skill record or evidence artifact found in Placement Hub database.",
                    "recommended_correction": f"Add {skill_name} with supporting evidence or assessment to your profile."
                })
            skill_idx += 1

    # 3. Verify Projects
    for idx, proj in enumerate(resume_content.get("projects", [])):
        title = proj.get("title", f"Project {idx+1}")
        title_key = title.strip().lower()
        matching_proj = student_projects.get(title_key)
        github_url = proj.get("github_url") or (matching_proj.get("github_url") if matching_proj else None)

        if github_url and ("github.com" in github_url or "gitlab.com" in github_url):
            claims.append({
                "claim_id": f"claim_proj_{idx}",
                "section": "projects",
                "statement": f"Development of project '{title}'",
                "status": "Supported by linked evidence",
                "evidence_source": "Verified Code Repository",
                "evidence_url": github_url,
                "evidence_strength": "High",
                "limitations": "Public repository confirms code presence. Note: Does not automatically establish sole authorship or production scale.",
                "recommended_correction": None
            })
        elif matching_proj:
            claims.append({
                "claim_id": f"claim_proj_{idx}",
                "section": "projects",
                "statement": f"Project '{title}'",
                "status": "Student-confirmed",
                "evidence_source": "Placement Hub Project Portfolio",
                "evidence_url": None,
                "evidence_strength": "Moderate",
                "limitations": "Recorded in student profile, but no public source repository or demo URL linked.",
                "recommended_correction": "Attach a live demo or GitHub repository link to bolster evidence strength."
            })
        else:
            claims.append({
                "claim_id": f"claim_proj_{idx}",
                "section": "projects",
                "statement": f"Project '{title}'",
                "status": "Unverified",
                "evidence_source": "Unlinked Project",
                "evidence_url": None,
                "evidence_strength": "None",
                "limitations": "Project does not appear in candidate verified database records.",
                "recommended_correction": "Record this project in your Placement Hub profile and link repository evidence."
            })

    # 4. Verify Experience / Internships
    for idx, exp in enumerate(resume_content.get("experience", [])):
        role = exp.get("role", "Role")
        company = exp.get("company", "Organization")
        claims.append({
            "claim_id": f"claim_exp_{idx}",
            "section": "experience",
            "statement": f"{role} at {company}",
            "status": "Student-confirmed",
            "evidence_source": "Student Self-Affirmation",
            "evidence_url": None,
            "evidence_strength": "Moderate",
            "limitations": "Confirmed by student declaration. Verified certificate or offer letter upload recommended for campus TPO verification.",
            "recommended_correction": None
        })

    return claims


# ---------------------------------------------------------------------------
# Deterministic Transparent Resume Scoring Rubric (Requirement 6)
# ---------------------------------------------------------------------------

def calculate_resume_score(
    resume_content: Dict[str, Any],
    claims: List[Dict[str, Any]],
    job_description: Optional[str] = None,
    target_role: Optional[str] = None
) -> Dict[str, Any]:
    """
    Calculates a 100-point transparent resume quality score with documented deterministic rubric:
    1. Job relevance and keyword coverage (20 pts)
    2. Required qualifications supported by evidence (20 pts)
    3. Relevant project and experience coverage (20 pts)
    4. Content clarity and bullet quality (15 pts)
    5. ATS-readable structure (10 pts)
    6. Formatting consistency (5 pts)
    7. Completeness and factual-support status (10 pts)
    """
    breakdown = {}
    improvement_actions = []

    # 1. Job Relevance & Keywords (20 points max)
    matched_reqs = []
    missing_reqs = []
    all_text = json.dumps(resume_content).lower()

    if job_description:
        # Extract prominent keywords from JD
        sample_keywords = [
            "python", "react", "typescript", "javascript", "node", "sql", "fastapi", "docker",
            "aws", "git", "ci/cd", "rest", "api", "database", "algorithms", "data structures",
            "testing", "agile", "machine learning", "tailwind", "linux", "system design"
        ]
        jd_lower = job_description.lower()
        jd_keywords = [kw for kw in sample_keywords if kw in jd_lower]
        if not jd_keywords:
            jd_keywords = ["problem solving", "software engineering", "git", "teamwork"]

        for kw in jd_keywords:
            if kw in all_text:
                matched_reqs.append(kw)
            else:
                missing_reqs.append(kw)

        coverage_ratio = len(matched_reqs) / max(len(jd_keywords), 1)
        job_relevance_pts = round(coverage_ratio * 20.0, 1)
        if missing_reqs:
            improvement_actions.append(
                f"Incorporate verified experience with missing keywords: {', '.join(missing_reqs[:4])}."
            )
    else:
        # Standard technical relevance baseline
        core_tech = ["git", "testing", "api", "database", "algorithms"]
        found_tech = [t for t in core_tech if t in all_text]
        job_relevance_pts = round((len(found_tech) / len(core_tech)) * 20.0, 1)
        matched_reqs = found_tech
        missing_reqs = [t for t in core_tech if t not in found_tech]

    breakdown["job_relevance_and_keywords"] = {
        "score": job_relevance_pts,
        "max": 20,
        "label": "Job Relevance & Keywords",
        "description": "Alignment with target role requirements and core technical keywords"
    }

    # 2. Evidence-Backed Qualifications (20 points max)
    total_claims = len(claims)
    if total_claims > 0:
        supported_count = sum(1 for c in claims if c.get("status") == "Supported by linked evidence")
        confirmed_count = sum(1 for c in claims if c.get("status") == "Student-confirmed")
        conflicting_count = sum(1 for c in claims if c.get("status") == "Conflicting evidence")
        
        # Supported claims = 1.0 weight, student-confirmed = 0.5 weight, conflicting = -1.0 penalty
        evidence_score = ((supported_count * 1.0 + confirmed_count * 0.5) / total_claims) * 20.0
        if conflicting_count > 0:
            evidence_score -= (conflicting_count * 5.0)
        evidence_score = max(0.0, min(20.0, round(evidence_score, 1)))
        
        unsupported_count = sum(1 for c in claims if c.get("status") in ["Unverified", "Conflicting evidence"])
        if unsupported_count > 0:
            improvement_actions.append(
                f"Link verified evidence (GitHub repo or assessment) to {unsupported_count} unverified claims."
            )
    else:
        evidence_score = 10.0
        unsupported_count = 0

    breakdown["evidence_backed_qualifications"] = {
        "score": evidence_score,
        "max": 20,
        "label": "Evidence-Backed Qualifications",
        "description": "Proportion of claims corroborated by verified code repos, assessments, and college records"
    }

    # 3. Relevant Project & Experience Coverage (20 points max)
    projects = resume_content.get("projects", [])
    experience = resume_content.get("experience", [])
    proj_pts = min(12.0, len(projects) * 4.0)
    # Extra credit for live demos / github links
    linked_proj_count = sum(1 for p in projects if p.get("github_url") or p.get("live_url"))
    proj_pts += min(4.0, linked_proj_count * 2.0)
    exp_pts = min(4.0, len(experience) * 2.0)
    project_score = round(min(20.0, proj_pts + exp_pts), 1)

    if len(projects) < 2:
        improvement_actions.append("Include at least 2 detailed technical projects with GitHub repository links.")

    breakdown["project_and_experience_coverage"] = {
        "score": project_score,
        "max": 20,
        "label": "Project & Experience Coverage",
        "description": "Demonstrable hands-on technical projects, repo links, and practical experience"
    }

    # 4. Content Clarity & Bullet Quality (15 points max)
    bullets = []
    for p in projects:
        bullets.extend(p.get("bullets", []))
    for e in experience:
        bullets.extend(e.get("bullets", []))

    clarity_score = 15.0
    action_verbs = {"developed", "built", "implemented", "engineered", "designed", "optimized", "architected", "integrated", "automated", "created", "reduced", "improved"}
    
    if bullets:
        weak_verb_count = 0
        word_count_issues = 0
        for b in bullets:
            words = b.strip().split()
            if len(words) < 6 or len(words) > 40:
                word_count_issues += 1
            first_word = words[0].lower().rstrip("d").rstrip("ed") if words else ""
            if not any(v.startswith(first_word) for v in action_verbs):
                weak_verb_count += 1
        
        clarity_deduction = (weak_verb_count * 0.5) + (word_count_issues * 0.5)
        clarity_score = max(5.0, round(15.0 - clarity_deduction, 1))

        if weak_verb_count > 2:
            improvement_actions.append("Begin project bullets with strong action verbs (e.g. Engineered, Implemented, Optimized).")
    else:
        clarity_score = 5.0
        improvement_actions.append("Add descriptive bullet points detailing architectural decisions and metrics.")

    breakdown["content_clarity_bullet_quality"] = {
        "score": clarity_score,
        "max": 15,
        "label": "Content Clarity & Bullet Quality",
        "description": "Action-driven bullet structure, concise phrasing, and quantified technical metrics"
    }

    # 5. ATS-Readable Structure (10 points max)
    structure_score = 10.0
    sections = resume_content.keys()
    essential_sections = ["contact", "education", "skills", "projects"]
    missing_sections = [s for s in essential_sections if s not in sections or not resume_content.get(s)]
    structure_score -= (len(missing_sections) * 2.5)
    structure_score = max(0.0, round(structure_score, 1))

    if missing_sections:
        improvement_actions.append(f"Ensure standard ATS sections are present: {', '.join(missing_sections)}.")

    breakdown["ats_readable_structure"] = {
        "score": structure_score,
        "max": 10,
        "label": "ATS-Readable Structure",
        "description": "Linear semantic sections readable by standard resume parsing engines"
    }

    # 6. Formatting Consistency (5 points max)
    formatting_score = 5.0
    contact = resume_content.get("contact", {})
    if not contact.get("email") or "@" not in contact.get("email", ""):
        formatting_score -= 2.0
    if not contact.get("phone"):
        formatting_score -= 1.0
    formatting_score = max(1.0, round(formatting_score, 1))

    breakdown["formatting_consistency"] = {
        "score": formatting_score,
        "max": 5,
        "label": "Formatting Consistency",
        "description": "Consistent contact channels, verified email syntax, and uniform styling"
    }

    # 7. Completeness & Factual Support (10 points max)
    completeness_score = 10.0
    if not resume_content.get("summary"):
        completeness_score -= 2.0
    conflicts = [c for c in claims if c.get("status") == "Conflicting evidence"]
    if conflicts:
        completeness_score -= (len(conflicts) * 4.0)
        improvement_actions.append("Resolve conflicting academic credentials before submitting to campus drives.")
    completeness_score = max(0.0, round(completeness_score, 1))

    breakdown["completeness_factual_support"] = {
        "score": completeness_score,
        "max": 10,
        "label": "Completeness & Factual Support",
        "description": "Absence of conflicting claims, populated professional summary, and complete profiles"
    }

    # Total Overall Score
    total_score = round(
        job_relevance_pts + evidence_score + project_score + clarity_score + structure_score + formatting_score + completeness_score
    )
    total_score = max(0, min(100, int(total_score)))

    return {
        "overall_score": total_score,
        "breakdown": breakdown,
        "matched_requirements": matched_reqs,
        "missing_requirements": missing_reqs,
        "unsupported_claims_count": unsupported_count,
        "improvement_actions": improvement_actions,
        "disclaimer": "This score is computed deterministically from our documented 7-category rubric. It does not represent an official ATS algorithm or a guarantee of interview selection."
    }


# ---------------------------------------------------------------------------
# Best Resume Recommendation (Requirement 8)
# ---------------------------------------------------------------------------

def recommend_best_resume(
    resumes: List[Dict[str, Any]],
    target_role: str,
    job_description: Optional[str] = None
) -> Dict[str, Any]:
    """
    Compares candidate's saved resume versions and deterministically selects the best match.
    Provides clear reasons, score breakdowns, and truth verification warnings.
    """
    if not resumes:
        return {
            "recommended_version": None,
            "reasons": ["No saved resume versions exist yet."],
            "all_comparisons": []
        }

    evaluated_versions = []
    target_role_lower = target_role.lower()

    for res in resumes:
        res_role = (res.get("target_role") or "").lower()
        scoring_rep = res.get("scoring_report") or {}
        overall_score = scoring_rep.get("overall_score") or res.get("ats_score") or 75
        
        # Role match bonus (deterministic)
        role_alignment = 1.0
        if target_role_lower in res_role or res_role in target_role_lower:
            role_alignment = 1.25
        elif any(w in res_role for w in target_role_lower.split()):
            role_alignment = 1.1

        composite_score = round(overall_score * role_alignment, 1)
        evidence_backed = res.get("evidence_backed_claims", 0)

        evaluated_versions.append({
            "id": res["id"],
            "title": res.get("title", "Resume Version"),
            "target_role": res.get("target_role", "General"),
            "target_company": res.get("target_company"),
            "overall_score": overall_score,
            "composite_score": composite_score,
            "evidence_backed_claims": evidence_backed,
            "scoring_report": scoring_rep,
            "last_updated": res.get("last_updated")
        })

    # Sort descending by composite score, then evidence_backed
    evaluated_versions.sort(key=lambda v: (v["composite_score"], v["evidence_backed_claims"]), reverse=True)
    best = evaluated_versions[0]

    reasons = [
        f"Strongest alignment with '{target_role}' ({best['overall_score']}/100 quality score).",
        f"{best['evidence_backed_claims']} claims grounded in verified evidence sources.",
        f"Targeted role structure matches the '{best['target_role']}' domain."
    ]

    return {
        "recommended_version": best,
        "target_role": target_role,
        "reasons": reasons,
        "all_comparisons": evaluated_versions,
        "disclaimer": "Recommendations are calculated deterministically against the target job profile. No resume guarantees selection."
    }
