"""
Opportunities Intelligence Endpoints — Placement Hub
Handles discovery, search, saved pipeline tracking, AI relevance matching,
Phase 0 provider audit inspection, and seamless Resume Studio tailoring.
"""

from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models import models
from app.api.resume_endpoints import get_current_student
from app.integrations.opportunities.schemas import (
    OpportunityItem,
    OpportunityFilterParams,
    SavedOpportunityItem,
    SaveOpportunityRequest,
    UpdateApplicationStatusRequest,
    ManualImportOpportunityRequest,
    OpportunityUserPreferenceSchema,
    OpportunityMatchEvaluation,
    ProviderAuditReport,
)
from app.integrations.opportunities.service import opportunities_service
from app.services.gemini_resume_service import (
    tailor_resume_with_gemini,
    GeminiResumeError,
    GeminiAuthError,
    GeminiQuotaError,
)

router = APIRouter(prefix="/opportunities", tags=["Opportunities Intelligence"])


class OpportunitiesListResponse(BaseModel):
    items: List[OpportunityItem]
    total: int
    offset: int
    limit: int


class OpportunityTailorRequest(BaseModel):
    resume_id: str = Field(..., description="ID of student's resume to tailor against this opportunity")


# ---------------------------------------------------------------------------
# 1. Discovery & Search
# ---------------------------------------------------------------------------

@router.get("", response_model=OpportunitiesListResponse)
def list_opportunities(
    q: Optional[str] = Query(None, description="Search keyword"),
    category: Optional[str] = Query(None, description="Category filter (job, internship, hackathon, competition, scholarship, fellowship, programme)"),
    provider: Optional[str] = Query(None, description="Provider filter"),
    role: Optional[str] = Query(None, description="Role filter"),
    location: Optional[str] = Query(None, description="Location filter"),
    remote_status: Optional[str] = Query(None, description="remote, hybrid, on_site"),
    compensation_type: Optional[str] = Query(None, description="paid, stipend, prize"),
    status: Optional[str] = Query(None, description="open, closing_soon, closed"),
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db)
):
    """
    Returns normalized opportunities with multi-parameter filtering,
    real-time status calculation, and duplicate suppression.
    """
    filters = OpportunityFilterParams(
        query=q,
        category=category,
        provider=provider,
        role=role,
        location=location,
        remote_status=remote_status,
        compensation_type=compensation_type,
        status=status,
        limit=limit,
        offset=offset
    )
    items, total = opportunities_service.search_opportunities(filters, db)
    return OpportunitiesListResponse(
        items=items,
        total=total,
        offset=offset,
        limit=limit
    )


@router.get("/closing-soon", response_model=List[OpportunityItem])
def get_closing_soon(
    limit: int = Query(10, ge=1, le=50),
    db: Session = Depends(get_db)
):
    """Returns opportunities with imminent deadlines (next 3 to 7 days)."""
    return opportunities_service.get_closing_soon_opportunities(db, limit=limit)


@router.get("/providers/audit", response_model=List[ProviderAuditReport])
def get_providers_audit():
    """
    Phase 0 Access & Compliance Audit.
    Returns official API availability, terms, rate limits, and provenance for all 8 providers.
    """
    return opportunities_service.get_phase0_audit()


@router.get("/saved", response_model=List[SavedOpportunityItem])
def list_saved_opportunities(
    status: Optional[str] = Query(None, description="saved, applied, interviewing, offered, rejected, archived"),
    db: Session = Depends(get_db)
):
    """Returns student's saved opportunities and application pipeline."""
    student = get_current_student(db)
    return opportunities_service.list_saved_opportunities(student.id, db, status_filter=status)


@router.get("/preferences", response_model=OpportunityUserPreferenceSchema)
def get_preferences(db: Session = Depends(get_db)):
    """Returns student's configured opportunity discovery preferences."""
    student = get_current_student(db)
    return opportunities_service.get_user_preferences(student.id, db)


@router.put("/preferences", response_model=OpportunityUserPreferenceSchema)
def update_preferences(
    payload: OpportunityUserPreferenceSchema,
    db: Session = Depends(get_db)
):
    """Updates student's explicit opportunity preferences."""
    student = get_current_student(db)
    return opportunities_service.update_user_preferences(student.id, payload, db)


@router.get("/{opp_id}", response_model=OpportunityItem)
def get_opportunity_detail(opp_id: str, db: Session = Depends(get_db)):
    """Fetches full factual details for a single opportunity."""
    item = opportunities_service.get_opportunity_by_id(opp_id, db)
    if not item:
        raise HTTPException(status_code=404, detail="Opportunity not found")
    return item


@router.get("/{opp_id}/evaluate", response_model=OpportunityMatchEvaluation)
def evaluate_opportunity_match(opp_id: str, db: Session = Depends(get_db)):
    """
    Evaluates AI relevance against student's verified skills, projects, and CGPA.
    Provides reasons, matched skills, and skill gaps without guaranteeing hiring.
    """
    student = get_current_student(db)
    opp = opportunities_service.get_opportunity_by_id(opp_id, db)
    if not opp:
        raise HTTPException(status_code=404, detail="Opportunity not found")
    return opportunities_service.evaluate_opportunity_match(student, opp)


# ---------------------------------------------------------------------------
# 2. Saved Tracking & Manual Import
# ---------------------------------------------------------------------------

@router.post("/save", response_model=SavedOpportunityItem)
def save_opportunity(
    payload: SaveOpportunityRequest,
    db: Session = Depends(get_db)
):
    """Saves an opportunity into the student's pipeline with reminders."""
    student = get_current_student(db)
    try:
        return opportunities_service.save_opportunity(student.id, payload, db)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.delete("/saved/{opp_id}")
def remove_saved_opportunity(opp_id: str, db: Session = Depends(get_db)):
    """Removes opportunity from saved collection."""
    student = get_current_student(db)
    deleted = opportunities_service.remove_saved_opportunity(student.id, opp_id, db)
    if not deleted:
        raise HTTPException(status_code=404, detail="Saved opportunity not found")
    return {"message": "Opportunity removed from saved collection"}


@router.post("/{opp_id}/status", response_model=SavedOpportunityItem)
def update_application_status(
    opp_id: str,
    payload: UpdateApplicationStatusRequest,
    db: Session = Depends(get_db)
):
    """Updates candidate status: applied, interviewing, offered, rejected, or archived."""
    student = get_current_student(db)
    return opportunities_service.update_application_status(student.id, opp_id, payload, db)


@router.post("/import-manual", response_model=OpportunityItem)
def import_manual_opportunity(
    payload: ManualImportOpportunityRequest,
    db: Session = Depends(get_db)
):
    """
    Imports a job, competition, or hackathon manually from LinkedIn, Unstop, etc.
    Validates URL, assigns 'manual_import' provenance, and links to user's saved list.
    """
    student = get_current_student(db)
    return opportunities_service.import_manual_opportunity(payload, student.id, db)


# ---------------------------------------------------------------------------
# 3. Resume Studio Tailoring Bridge
# ---------------------------------------------------------------------------

@router.post("/{opp_id}/tailor-resume")
def tailor_resume_for_opportunity(
    opp_id: str,
    payload: OpportunityTailorRequest,
    db: Session = Depends(get_db)
):
    """
    Connects an opportunity directly to Resume Studio.
    Uses Google Gemini to propose granular before-and-after edits for student review.
    Does NOT invent qualifications, skills, or achievements.
    Does NOT auto-submit or upload without explicit student confirmation.
    """
    student = get_current_student(db)
    opp = opportunities_service.get_opportunity_by_id(opp_id, db)
    if not opp:
        raise HTTPException(status_code=404, detail="Opportunity not found")

    resume = db.query(models.Resume).filter(
        models.Resume.id == payload.resume_id,
        models.Resume.student_id == student.id
    ).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")

    try:
        tailor_report = tailor_resume_with_gemini(
            resume_content=resume.content or {},
            job_description=f"{opp.title} at {opp.company_or_organizer}\n\nDescription:\n{opp.description}\n\nRequired Skills: {', '.join(opp.skills)}",
            target_role=opp.title,
            target_company=opp.company_or_organizer
        )

        # Store proposals on resume for student review
        proposals = tailor_report.get("tailoring_proposals", [])
        resume.tailoring_history = proposals
        db.commit()

        return {
            "opportunity_id": opp.id,
            "opportunity_title": opp.title,
            "company": opp.company_or_organizer,
            "resume_id": resume.id,
            "tailor_report": tailor_report
        }
    except GeminiAuthError as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(e))
    except GeminiQuotaError as e:
        raise HTTPException(status_code=status.HTTP_429_TOO_MANY_REQUESTS, detail=str(e))
    except GeminiResumeError as e:
        raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail=str(e))
