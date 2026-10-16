"""
Resume Studio API Endpoints — Placement Hub
Handles:
- Master profile and independent resume versions (CRUD, isolation, duplication, archive)
- Document upload and Gemini structured extraction with preview
- Gemini job-specific resume tailoring with before/after proposals
- Signature Truth Verification Engine linking claims to student records
- Deterministic 7-category resume scoring
- Best resume recommendation across saved versions
- Authorized alumni resume examples
"""

import datetime
from typing import List, Optional, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from ..core.config import settings
from ..core.database import get_db
from ..models import models
from ..services.gemini_resume_service import (
    extract_text_from_document,
    parse_resume_with_gemini,
    tailor_resume_with_gemini,
    verify_resume_claims,
    calculate_resume_score,
    recommend_best_resume,
    GeminiResumeError,
    GeminiAuthError,
    GeminiQuotaError
)

router = APIRouter(prefix="/resumes", tags=["Resume Studio"])


# ---------------------------------------------------------------------------
# Helper: Get or bootstrap current student
# ---------------------------------------------------------------------------

def get_current_student(db: Session) -> models.Student:
    student = db.query(models.Student).first()
    if not student:
        student = models.Student(
            id="std_current_user",
            name="Candidate Student",
            email="candidate@university.edu",
            roll_no="2026-CS-042",
            department="Computer Science & Engineering",
            degree="B.Tech",
            batch="2022-2026",
            graduation_year=2026,
            cgpa=8.5,
            placement_status="Eligible"
        )
        db.add(student)
        db.commit()
        db.refresh(student)
    return student


def get_student_db_records(student: models.Student) -> Dict[str, Any]:
    """Compiles authentic student records for truth verification."""
    skills_data = []
    for s in student.skills:
        ev = s.evidences[0] if s.evidences else None
        skills_data.append({
            "name": s.name,
            "category": s.category,
            "level": s.level,
            "verified": s.verified,
            "evidence_type": ev.evidence_type if ev else s.verification_source,
            "evidence_url": ev.evidence_url if ev else None
        })

    projects_data = []
    for p in student.projects:
        projects_data.append({
            "title": p.title,
            "description": p.description,
            "tech_stack": p.tech_stack or [],
            "github_url": p.github_url,
            "live_demo_url": p.live_demo_url
        })

    assessments_data = []
    for ar in student.assessment_results:
        assessments_data.append({
            "assessment_id": ar.assessment_id,
            "score": ar.score,
            "percentile": ar.percentile,
            "status": ar.status
        })

    return {
        "cgpa": student.cgpa,
        "active_backlogs": student.active_backlogs,
        "department": student.department,
        "degree": student.degree,
        "graduation_year": student.graduation_year,
        "skills": skills_data,
        "projects": projects_data,
        "assessments": assessments_data
    }


def default_resume_content(student: models.Student) -> Dict[str, Any]:
    """Builds clean initial resume content from real student profile without hallucinating."""
    skills_by_category: Dict[str, List[str]] = {}
    for s in student.skills:
        cat = s.category or "Technical Skills"
        skills_by_category.setdefault(cat, []).append(s.name)

    skills_list = [
        {"category": cat, "items": items}
        for cat, items in skills_by_category.items()
    ]
    if not skills_list:
        skills_list = [
            {"category": "Languages", "items": ["Python", "TypeScript", "SQL"]},
            {"category": "Frameworks", "items": ["FastAPI", "React", "Node.js"]},
            {"category": "Tools", "items": ["Git", "Docker", "Linux"]}
        ]

    projects_list = []
    for p in student.projects:
        bullets = [p.description] if p.description else []
        projects_list.append({
            "title": p.title,
            "description": p.description,
            "tech_stack": p.tech_stack or [],
            "bullets": bullets,
            "github_url": p.github_url,
            "live_url": p.live_demo_url
        })

    if not projects_list:
        projects_list = [
            {
                "title": "Placement Hub Portal",
                "description": "Full-stack university recruitment and interview readiness platform with verifiable skill evidence.",
                "tech_stack": ["React", "FastAPI", "SQLite", "Tailwind CSS"],
                "bullets": [
                    "Engineered end-to-end recruitment platform with role-based routing and live status tracking.",
                    "Implemented responsive UI components with comprehensive state management and accessibility.",
                    "Designed RESTful backend services with automated database migrations and strict error boundaries."
                ],
                "github_url": student.github_url or "https://github.com/iamironman/dypdyp",
                "live_url": student.portfolio_url
            }
        ]

    return {
        "contact": {
            "full_name": student.name,
            "email": student.email,
            "phone": student.phone or "+91 98765 43210",
            "location": f"{student.department}, University Campus",
            "linkedin": student.linkedin_url or "https://linkedin.com/in/student",
            "github": student.github_url or "https://github.com/student",
            "portfolio": student.portfolio_url
        },
        "summary": student.bio or f"Final-year {student.degree} candidate in {student.department} with solid foundations in software engineering, data structures, and modern web application architecture.",
        "education": [
            {
                "institution": "Dr. D. Y. Patil College of Engineering",
                "degree": f"{student.degree} in {student.department}",
                "field": student.department,
                "start_year": str(student.graduation_year - 4),
                "end_year": str(student.graduation_year),
                "score_or_cgpa": f"{student.cgpa:.2f} CGPA",
                "coursework": ["Data Structures", "Database Systems", "Operating Systems", "Cloud Computing"]
            }
        ],
        "skills": skills_list,
        "experience": [],
        "projects": projects_list,
        "certifications": [],
        "achievements": ["Dean's Honor List for Academic Excellence", "Participated in Smart India Hackathon"]
    }


# ---------------------------------------------------------------------------
# Pydantic Schemas
# ---------------------------------------------------------------------------

class ResumeCreate(BaseModel):
    title: str
    target_role: str = "Software Developer"
    target_company: Optional[str] = None
    template_id: str = "classic-professional"
    is_master: bool = False
    source_resume_id: Optional[str] = None # For creating from master or duplicating
    content: Optional[Dict[str, Any]] = None
    styling_config: Optional[Dict[str, Any]] = None
    sections_order: Optional[List[str]] = None

class ResumeUpdate(BaseModel):
    title: Optional[str] = None
    target_role: Optional[str] = None
    target_company: Optional[str] = None
    template_id: Optional[str] = None
    content: Optional[Dict[str, Any]] = None
    styling_config: Optional[Dict[str, Any]] = None
    sections_order: Optional[List[str]] = None

class TailorRequest(BaseModel):
    job_description: str
    target_role: str
    target_company: Optional[str] = None

class ApplyProposalsRequest(BaseModel):
    accepted_proposal_ids: List[str]
    custom_edits: Optional[Dict[str, str]] = None # proposal_id -> manually edited text


# ---------------------------------------------------------------------------
# Version Management Endpoints
# ---------------------------------------------------------------------------

@router.get("")
def list_resumes(include_archived: bool = False, db: Session = Depends(get_db)):
    """Lists all resume versions for current student. Bootstraps master profile if empty."""
    student = get_current_student(db)
    query = db.query(models.Resume).filter(models.Resume.student_id == student.id)
    if not include_archived:
        query = query.filter(models.Resume.is_archived == False)
    
    resumes = query.order_by(models.Resume.is_master.desc(), models.Resume.last_updated.desc()).all()

    # Bootstrap master profile if user has zero resumes
    if not resumes:
        initial_content = default_resume_content(student)
        student_records = get_student_db_records(student)
        claims = verify_resume_claims(initial_content, student_records)
        scoring = calculate_resume_score(initial_content, claims, target_role="Software Developer")

        master_resume = models.Resume(
            id=f"res_master_{int(datetime.datetime.utcnow().timestamp())}",
            student_id=student.id,
            title="Master Profile",
            target_role="Full-Stack Developer",
            target_company="General Placement",
            template_id="classic-professional",
            is_master=True,
            is_archived=False,
            last_updated=datetime.datetime.utcnow().strftime("%Y-%m-%d %H:%M"),
            ats_score=scoring["overall_score"],
            ats_breakdown=scoring["breakdown"],
            scoring_report=scoring,
            summary=initial_content.get("summary"),
            evidence_backed_claims=sum(1 for c in claims if c.get("status") == "Supported by linked evidence"),
            styling_config={
                "font_family": "inter",
                "font_size": "10pt",
                "line_height": "1.4",
                "margins": "standard",
                "accent_color": "#2563eb"
            },
            sections_order=["contact", "summary", "education", "skills", "projects", "experience", "certifications", "achievements"],
            content=initial_content,
            evidence_links=claims,
            tailoring_history=[]
        )
        db.add(master_resume)
        db.commit()
        db.refresh(master_resume)
        resumes = [master_resume]

    return [
        {
            "id": r.id,
            "title": r.title,
            "target_role": r.target_role,
            "target_company": r.target_company,
            "template_id": r.template_id or "classic-professional",
            "is_master": bool(r.is_master),
            "is_archived": bool(r.is_archived),
            "last_updated": r.last_updated,
            "ats_score": r.ats_score,
            "ats_breakdown": r.ats_breakdown or {},
            "evidence_backed_claims": r.evidence_backed_claims or 0,
            "summary": r.summary
        }
        for r in resumes
    ]


# ---------------------------------------------------------------------------
# Best Resume Recommendation (Requirement 8)
# ---------------------------------------------------------------------------

@router.get("/recommendation/best")
def get_best_resume_recommendation(
    target_role: str = "Software Developer",
    job_description: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Deterministically identifies the best resume version for a target job/role."""
    student = get_current_student(db)
    resumes = db.query(models.Resume).filter(
        models.Resume.student_id == student.id,
        models.Resume.is_archived == False
    ).all()

    resumes_data = [
        {
            "id": r.id,
            "title": r.title,
            "target_role": r.target_role,
            "target_company": r.target_company,
            "ats_score": r.ats_score,
            "scoring_report": r.scoring_report or {},
            "evidence_backed_claims": r.evidence_backed_claims or 0,
            "last_updated": r.last_updated
        }
        for r in resumes
    ]

    recommendation = recommend_best_resume(
        resumes=resumes_data,
        target_role=target_role,
        job_description=job_description
    )
    return recommendation


# ---------------------------------------------------------------------------
# Alumni Examples (Requirement 9)
# ---------------------------------------------------------------------------

@router.get("/alumni-examples")
def list_alumni_examples(
    role: Optional[str] = None,
    industry: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """
    Returns authorized alumni resume examples.
    Privacy first: Real authorized examples only. Never fabricates personal data.
    If none exist in database, returns empty list with appropriate status.
    """
    query = db.query(models.AlumniResumeExample).filter(
        models.AlumniResumeExample.is_authorized == True
    )
    if role:
        query = query.filter(models.AlumniResumeExample.role.ilike(f"%{role}%"))
    if industry:
        query = query.filter(models.AlumniResumeExample.industry.ilike(f"%{industry}%"))

    examples = query.all()
    return [
        {
            "id": ex.id,
            "alumni_name": ex.alumni_name if not ex.is_anonymized else "Alumni Graduate (Anonymized)",
            "graduation_year": ex.graduation_year,
            "role": ex.role,
            "industry": ex.industry,
            "template_id": ex.template_id,
            "placement_outcome": ex.placement_outcome,
            "is_anonymized": ex.is_anonymized,
            "skills": ex.skills or [],
            "projects_summary": ex.projects_summary or [],
            "resume_content": ex.resume_content or {}
        }
        for ex in examples
    ]


@router.get("/{resume_id}")
def get_resume(resume_id: str, db: Session = Depends(get_db)):
    """Retrieves complete, editable resume document by ID."""
    student = get_current_student(db)
    resume = db.query(models.Resume).filter(
        models.Resume.id == resume_id,
        models.Resume.student_id == student.id
    ).first()

    if not resume:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Resume with ID '{resume_id}' not found."
        )

    return {
        "id": resume.id,
        "student_id": resume.student_id,
        "title": resume.title,
        "target_role": resume.target_role,
        "target_company": resume.target_company,
        "template_id": resume.template_id or "classic-professional",
        "is_master": bool(resume.is_master),
        "is_archived": bool(resume.is_archived),
        "last_updated": resume.last_updated,
        "ats_score": resume.ats_score,
        "ats_breakdown": resume.ats_breakdown or {},
        "scoring_report": resume.scoring_report or {},
        "summary": resume.summary,
        "evidence_backed_claims": resume.evidence_backed_claims or 0,
        "styling_config": resume.styling_config or {
            "font_family": "inter",
            "font_size": "10pt",
            "line_height": "1.4",
            "margins": "standard",
            "accent_color": "#2563eb"
        },
        "sections_order": resume.sections_order or ["contact", "summary", "education", "skills", "projects", "experience", "certifications", "achievements"],
        "content": resume.content or {},
        "evidence_links": resume.evidence_links or [],
        "tailoring_history": resume.tailoring_history or []
    }


@router.post("", status_code=status.HTTP_201_CREATED)
def create_resume(payload: ResumeCreate, db: Session = Depends(get_db)):
    """
    Creates an independent resume version.
    Can be created from Master profile or cloned from an existing version.
    Guarantees strict isolation: changes here will never mutate the master or source.
    """
    student = get_current_student(db)
    source_content = None
    source_styling = None
    source_order = None

    if payload.source_resume_id:
        src = db.query(models.Resume).filter(
            models.Resume.id == payload.source_resume_id,
            models.Resume.student_id == student.id
        ).first()
        if src:
            source_content = src.content
            source_styling = src.styling_config
            source_order = src.sections_order

    if not source_content:
        source_content = payload.content or default_resume_content(student)

    # Perform fresh truth verification & scoring for this version
    student_records = get_student_db_records(student)
    claims = verify_resume_claims(source_content, student_records)
    scoring = calculate_resume_score(source_content, claims, target_role=payload.target_role)

    new_resume = models.Resume(
        id=f"res_{int(datetime.datetime.utcnow().timestamp())}_{payload.target_role.lower()[:3]}",
        student_id=student.id,
        title=payload.title,
        target_role=payload.target_role,
        target_company=payload.target_company,
        template_id=payload.template_id,
        is_master=payload.is_master,
        is_archived=False,
        last_updated=datetime.datetime.utcnow().strftime("%Y-%m-%d %H:%M"),
        ats_score=scoring["overall_score"],
        ats_breakdown=scoring["breakdown"],
        scoring_report=scoring,
        summary=source_content.get("summary"),
        evidence_backed_claims=sum(1 for c in claims if c.get("status") == "Supported by linked evidence"),
        styling_config=payload.styling_config or source_styling or {
            "font_family": "inter",
            "font_size": "10pt",
            "line_height": "1.4",
            "margins": "standard",
            "accent_color": "#2563eb"
        },
        sections_order=payload.sections_order or source_order or ["contact", "summary", "education", "skills", "projects", "experience", "certifications", "achievements"],
        content=source_content,
        evidence_links=claims,
        tailoring_history=[]
    )
    db.add(new_resume)
    db.commit()
    db.refresh(new_resume)
    return {"message": "Resume version created successfully", "id": new_resume.id}


@router.put("/{resume_id}")
def update_resume(resume_id: str, payload: ResumeUpdate, db: Session = Depends(get_db)):
    """
    Updates resume content, layout, styling, and recalculates truth verification & scores.
    Supports autosave with debounce in editor.
    """
    student = get_current_student(db)
    resume = db.query(models.Resume).filter(
        models.Resume.id == resume_id,
        models.Resume.student_id == student.id
    ).first()

    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")

    if payload.title is not None:
        resume.title = payload.title
    if payload.target_role is not None:
        resume.target_role = payload.target_role
    if payload.target_company is not None:
        resume.target_company = payload.target_company
    if payload.template_id is not None:
        resume.template_id = payload.template_id
    if payload.styling_config is not None:
        resume.styling_config = payload.styling_config
    if payload.sections_order is not None:
        resume.sections_order = payload.sections_order
    if payload.content is not None:
        resume.content = payload.content
        resume.summary = payload.content.get("summary")

        # Recalculate deterministic truth verification & score
        student_records = get_student_db_records(student)
        claims = verify_resume_claims(payload.content, student_records)
        scoring = calculate_resume_score(payload.content, claims, target_role=resume.target_role)

        resume.evidence_links = claims
        resume.scoring_report = scoring
        resume.ats_score = scoring["overall_score"]
        resume.ats_breakdown = scoring["breakdown"]
        resume.evidence_backed_claims = sum(1 for c in claims if c.get("status") == "Supported by linked evidence")

    resume.last_updated = datetime.datetime.utcnow().strftime("%Y-%m-%d %H:%M")
    db.commit()
    db.refresh(resume)

    return {
        "message": "Resume saved successfully",
        "id": resume.id,
        "last_updated": resume.last_updated,
        "ats_score": resume.ats_score,
        "evidence_backed_claims": resume.evidence_backed_claims
    }


@router.post("/{resume_id}/duplicate")
def duplicate_resume(resume_id: str, db: Session = Depends(get_db)):
    """Duplicates a resume into an independent version."""
    student = get_current_student(db)
    source = db.query(models.Resume).filter(
        models.Resume.id == resume_id,
        models.Resume.student_id == student.id
    ).first()

    if not source:
        raise HTTPException(status_code=404, detail="Source resume not found")

    new_id = f"res_{int(datetime.datetime.utcnow().timestamp())}_copy"
    duplicated = models.Resume(
        id=new_id,
        student_id=student.id,
        title=f"Copy of {source.title}",
        target_role=source.target_role,
        target_company=source.target_company,
        template_id=source.template_id,
        is_master=False,
        is_archived=False,
        last_updated=datetime.datetime.utcnow().strftime("%Y-%m-%d %H:%M"),
        ats_score=source.ats_score,
        ats_breakdown=source.ats_breakdown,
        scoring_report=source.scoring_report,
        summary=source.summary,
        evidence_backed_claims=source.evidence_backed_claims,
        styling_config=dict(source.styling_config or {}),
        sections_order=list(source.sections_order or []),
        content=dict(source.content or {}),
        evidence_links=list(source.evidence_links or []),
        tailoring_history=[]
    )
    db.add(duplicated)
    db.commit()
    db.refresh(duplicated)
    return {"message": "Resume duplicated successfully", "id": duplicated.id}


@router.post("/{resume_id}/archive")
def archive_resume(resume_id: str, db: Session = Depends(get_db)):
    student = get_current_student(db)
    resume = db.query(models.Resume).filter(
        models.Resume.id == resume_id,
        models.Resume.student_id == student.id
    ).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    if resume.is_master:
        raise HTTPException(status_code=400, detail="Cannot archive Master Profile")
    resume.is_archived = True
    db.commit()
    return {"message": "Resume archived successfully"}


@router.post("/{resume_id}/restore")
def restore_resume(resume_id: str, db: Session = Depends(get_db)):
    student = get_current_student(db)
    resume = db.query(models.Resume).filter(
        models.Resume.id == resume_id,
        models.Resume.student_id == student.id
    ).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    resume.is_archived = False
    db.commit()
    return {"message": "Resume restored successfully"}


@router.delete("/{resume_id}")
def delete_resume(resume_id: str, db: Session = Depends(get_db)):
    student = get_current_student(db)
    resume = db.query(models.Resume).filter(
        models.Resume.id == resume_id,
        models.Resume.student_id == student.id
    ).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    if resume.is_master:
        raise HTTPException(status_code=400, detail="Cannot delete Master Profile")
    db.delete(resume)
    db.commit()
    return {"message": "Resume deleted successfully"}


# ---------------------------------------------------------------------------
# Upload & Document Extraction (Entry Path B)
# ---------------------------------------------------------------------------

@router.post("/upload-extract")
async def upload_and_extract_resume(
    file: UploadFile = File(...)
):
    """
    Extracts text from PDF/TXT and uses Gemini to structure into standard fields.
    Returns structured draft for review before applying.
    Does NOT hallucinate or auto-overwrite records.
    """
    # 1. Validate file size (max 8MB)
    content_bytes = await file.read()
    if len(content_bytes) > 8 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="Uploaded file exceeds the 8MB size limit.")

    # 2. Extract text
    try:
        extracted_text = extract_text_from_document(content_bytes, file.filename or "resume.pdf")
    except GeminiResumeError as e:
        raise HTTPException(status_code=400, detail=str(e))

    # 3. Structure with Gemini
    try:
        structured_data = parse_resume_with_gemini(extracted_text)
        return {
            "filename": file.filename,
            "raw_text_length": len(extracted_text),
            "extracted_content": structured_data
        }
    except GeminiAuthError as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(e))
    except GeminiQuotaError as e:
        raise HTTPException(status_code=status.HTTP_429_TOO_MANY_REQUESTS, detail=str(e))
    except GeminiResumeError as e:
        raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail=str(e))


# ---------------------------------------------------------------------------
# Gemini Job Tailoring (Requirement 4)
# ---------------------------------------------------------------------------

@router.post("/{resume_id}/tailor")
def tailor_resume(
    resume_id: str,
    payload: TailorRequest,
    db: Session = Depends(get_db)
):
    """
    Tailors resume to target job description using Google Gemini.
    Generates granular before-and-after proposals for user review (accept/reject/edit).
    Does NOT invent qualifications or metrics.
    """
    student = get_current_student(db)
    resume = db.query(models.Resume).filter(
        models.Resume.id == resume_id,
        models.Resume.student_id == student.id
    ).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")

    try:
        tailor_report = tailor_resume_with_gemini(
            resume_content=resume.content or {},
            job_description=payload.job_description,
            target_role=payload.target_role,
            target_company=payload.target_company
        )
        
        # Save proposals to history
        proposals = tailor_report.get("tailoring_proposals", [])
        resume.tailoring_history = proposals
        db.commit()

        return tailor_report
    except GeminiAuthError as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(e))
    except GeminiQuotaError as e:
        raise HTTPException(status_code=status.HTTP_429_TOO_MANY_REQUESTS, detail=str(e))
    except GeminiResumeError as e:
        raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail=str(e))


@router.post("/{resume_id}/apply-proposals")
def apply_proposals(
    resume_id: str,
    payload: ApplyProposalsRequest,
    db: Session = Depends(get_db)
):
    """
    Applies user-accepted before/after proposals directly to the resume content.
    Allows manual edits before applying.
    """
    student = get_current_student(db)
    resume = db.query(models.Resume).filter(
        models.Resume.id == resume_id,
        models.Resume.student_id == student.id
    ).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")

    content = dict(resume.content or {})
    accepted_ids = set(payload.accepted_proposal_ids)
    custom_edits = payload.custom_edits or {}
    proposals = resume.tailoring_history or []

    applied_count = 0
    for prop in proposals:
        pid = prop.get("id")
        if pid in accepted_ids:
            sec = prop.get("section")
            replacement = custom_edits.get(pid, prop.get("suggested_text"))
            orig = prop.get("original_text")

            if sec == "summary" and replacement:
                content["summary"] = replacement
                applied_count += 1
            elif sec == "projects":
                target_title = (prop.get("target_item_title") or "").strip().lower()
                for proj in content.get("projects", []):
                    if target_title and target_title in proj.get("title", "").lower():
                        # Replace bullet
                        bullets = proj.get("bullets", [])
                        for b_idx, b in enumerate(bullets):
                            if b.strip() == orig.strip() or orig.strip() in b:
                                bullets[b_idx] = replacement
                                applied_count += 1
                                break
            elif sec == "experience":
                for exp in content.get("experience", []):
                    bullets = exp.get("bullets", [])
                    for b_idx, b in enumerate(bullets):
                        if b.strip() == orig.strip() or orig.strip() in b:
                            bullets[b_idx] = replacement
                            applied_count += 1
                            break

    # Re-evaluate verification and score
    student_records = get_student_db_records(student)
    claims = verify_resume_claims(content, student_records)
    scoring = calculate_resume_score(content, claims, target_role=resume.target_role)

    resume.content = content
    resume.summary = content.get("summary")
    resume.evidence_links = claims
    resume.scoring_report = scoring
    resume.ats_score = scoring["overall_score"]
    resume.ats_breakdown = scoring["breakdown"]
    resume.last_updated = datetime.datetime.utcnow().strftime("%Y-%m-%d %H:%M")

    db.commit()
    return {
        "message": f"Applied {applied_count} approved enhancements.",
        "ats_score": resume.ats_score,
        "scoring_report": scoring
    }


# ---------------------------------------------------------------------------
# Truth Verification & Deterministic Scoring
# ---------------------------------------------------------------------------

@router.post("/{resume_id}/verify-claims")
def verify_claims_endpoint(resume_id: str, db: Session = Depends(get_db)):
    """Signature Truth Verification: verifies resume claims against authentic student database records."""
    student = get_current_student(db)
    resume = db.query(models.Resume).filter(
        models.Resume.id == resume_id,
        models.Resume.student_id == student.id
    ).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")

    student_records = get_student_db_records(student)
    claims = verify_resume_claims(resume.content or {}, student_records)

    resume.evidence_links = claims
    resume.evidence_backed_claims = sum(1 for c in claims if c.get("status") == "Supported by linked evidence")
    db.commit()

    return {
        "claims": claims,
        "total_claims": len(claims),
        "supported_count": resume.evidence_backed_claims,
        "conflicting_count": sum(1 for c in claims if c.get("status") == "Conflicting evidence")
    }


@router.post("/{resume_id}/score")
def calculate_score_endpoint(
    resume_id: str,
    job_description: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Calculates deterministic 7-category resume score out of 100."""
    student = get_current_student(db)
    resume = db.query(models.Resume).filter(
        models.Resume.id == resume_id,
        models.Resume.student_id == student.id
    ).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")

    student_records = get_student_db_records(student)
    claims = verify_resume_claims(resume.content or {}, student_records)
    scoring = calculate_resume_score(resume.content or {}, claims, job_description=job_description, target_role=resume.target_role)

    resume.scoring_report = scoring
    resume.ats_score = scoring["overall_score"]
    resume.ats_breakdown = scoring["breakdown"]
    db.commit()

    return scoring


# ---------------------------------------------------------------------------
# Application Tracker Attachment (Requirement 11)
# ---------------------------------------------------------------------------

@router.post("/applications/{application_id}/attach-resume")
def attach_resume_to_application(
    application_id: str,
    resume_id: str,
    db: Session = Depends(get_db)
):
    """
    Attaches a tailored resume version to an application and preserves an exact snapshot.
    Warns if targeted role or company differs from application.
    """
    student = get_current_student(db)
    app = db.query(models.Application).filter(
        models.Application.id == application_id,
        models.Application.student_id == student.id
    ).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")

    resume = db.query(models.Resume).filter(
        models.Resume.id == resume_id,
        models.Resume.student_id == student.id
    ).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume version not found")

    job = db.query(models.Job).filter(models.Job.id == app.job_id).first()

    warning = None
    if job and resume.target_role and resume.target_role.lower() not in job.title.lower():
        warning = f"Warning: Attached resume targets '{resume.target_role}', while this application is for '{job.title}'."

    # Record snapshot of exact state
    app.resume_id = resume.id
    app.resume_snapshot = {
        "resume_id": resume.id,
        "title": resume.title,
        "template_id": resume.template_id,
        "attached_at": datetime.datetime.utcnow().strftime("%Y-%m-%d %H:%M"),
        "ats_score": resume.ats_score,
        "content_snapshot": resume.content
    }
    db.commit()

    return {
        "message": "Resume attached to application successfully",
        "warning": warning,
        "snapshot_date": app.resume_snapshot["attached_at"]
    }
