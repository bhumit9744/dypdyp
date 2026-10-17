"""
Jarvis REST API Endpoints — Voice, LinkedIn & Mail Plugins for Placement Hub
"""

from fastapi import APIRouter, Depends, HTTPException, status
from typing import Dict, Any, List, Optional
from pydantic import BaseModel

from ..services.jarvis_agent import (
    jarvis_agent,
    JarvisCommandRequest,
    LinkedInPostRequest,
    LinkedInOutreachRequest,
    EmailDraftRequest,
    EmailSendRequest,
)

router = APIRouter(prefix="/jarvis", tags=["Jarvis Voice & Executive Agent"])


@router.get("/status")
def get_jarvis_status():
    """Returns the operational status of Jarvis, voice recognition, and active plugins."""
    return jarvis_agent.get_status()


import logging
logger = logging.getLogger("jarvis_endpoints")

@router.post("/command")
def process_jarvis_command(payload: JarvisCommandRequest):
    """
    Executes a voice or text command through the Jarvis AI brain.
    Can trigger LinkedIn post generation, email dispatching, or interview routing.
    Never fails with 500 error; always returns a graceful response.
    """
    try:
        return jarvis_agent.process_command(
            query=payload.query,
            student_id=payload.student_id or "std_current_user",
            context=payload.context
        )
    except Exception as e:
        logger.error(f"Error handling Jarvis command '{payload.query}': {e}", exc_info=True)
        return {
            "response": f"Operational, Sir. I encountered an unexpected latency handling '{payload.query}', but core subsystems remain active. You can review your career telemetry or try again.",
            "voice_speech": "Operational, Sir. Core subsystems remain online.",
            "action_executed": "fallback_operational",
            "plugin": "core_brain"
        }


# ---------------------------------------------------------------------------
# LinkedIn Plugin Endpoints
# ---------------------------------------------------------------------------

@router.post("/linkedin/post")
def create_linkedin_post(payload: LinkedInPostRequest):
    """Drafts an engaging, professional career update post for LinkedIn."""
    return jarvis_agent.generate_linkedin_post(payload)


@router.get("/linkedin/posts")
def list_linkedin_posts():
    """Lists published and drafted LinkedIn posts."""
    return jarvis_agent.get_linkedin_posts()


@router.post("/linkedin/outreach")
def create_linkedin_outreach(payload: LinkedInOutreachRequest):
    """Generates an authentic cold connection note / alumni outreach message."""
    return jarvis_agent.generate_linkedin_outreach(payload)


# ---------------------------------------------------------------------------
# Mail Plugin Endpoints
# ---------------------------------------------------------------------------

@router.post("/mail/draft")
def draft_email(payload: EmailDraftRequest):
    """Drafts a structured professional email (thank you, follow up, or cold outreach)."""
    return jarvis_agent.draft_email(payload)


@router.post("/mail/send")
def send_email(payload: EmailSendRequest):
    """Dispatches or simulates sending an email and records to audit log."""
    return jarvis_agent.send_email(payload)


@router.get("/mail/inbox")
def get_mail_inbox():
    """Returns recent placement notifications and interview invites."""
    return jarvis_agent.get_inbox()


@router.get("/mail/sent")
def get_sent_mails():
    """Returns sent placement communications."""
    return jarvis_agent.get_sent_emails()


# ---------------------------------------------------------------------------
# Allowlisted Opportunity Tools Endpoints
# ---------------------------------------------------------------------------

class SearchOpportunitiesToolRequest(BaseModel):
    query: Optional[str] = None
    category: Optional[str] = None
    limit: int = 5
    student_id: Optional[str] = "std_current_user"

class OpportunityDetailsToolRequest(BaseModel):
    opportunity_id: str
    student_id: Optional[str] = "std_current_user"

class ClosingSoonToolRequest(BaseModel):
    limit: int = 5
    student_id: Optional[str] = "std_current_user"

class CompareOpportunityToolRequest(BaseModel):
    opportunity_id: str
    student_id: Optional[str] = "std_current_user"
    resume_id: Optional[str] = None

class SaveOpportunityToolRequest(BaseModel):
    opportunity_id: str
    status: str = "saved"
    student_id: Optional[str] = "std_current_user"

class UpdateOpportunityStatusToolRequest(BaseModel):
    opportunity_id: str
    status: str = "applied"
    student_id: Optional[str] = "std_current_user"


@router.post("/tools/search-opportunities")
def tool_search_opportunities(payload: SearchOpportunitiesToolRequest):
    """Executes search_opportunities tool with factual provider attribution and retrieval times."""
    return jarvis_agent.search_opportunities_tool(
        query=payload.query,
        category=payload.category,
        limit=payload.limit,
        student_id=payload.student_id or "std_current_user"
    )


@router.post("/tools/opportunity-details")
def tool_opportunity_details(payload: OpportunityDetailsToolRequest):
    """Executes get_opportunity_details tool."""
    return jarvis_agent.get_opportunity_details_tool(
        opportunity_id=payload.opportunity_id,
        student_id=payload.student_id or "std_current_user"
    )


@router.post("/tools/closing-soon")
def tool_closing_soon(payload: ClosingSoonToolRequest):
    """Executes get_closing_soon_opportunities tool."""
    return jarvis_agent.get_closing_soon_opportunities_tool(
        limit=payload.limit,
        student_id=payload.student_id or "std_current_user"
    )


@router.post("/tools/compare-opportunity")
def tool_compare_opportunity(payload: CompareOpportunityToolRequest):
    """Executes compare_opportunity_with_resume tool with skill gap analysis."""
    return jarvis_agent.compare_opportunity_with_resume_tool(
        opportunity_id=payload.opportunity_id,
        student_id=payload.student_id or "std_current_user",
        resume_id=payload.resume_id
    )


@router.post("/tools/save-opportunity")
def tool_save_opportunity(payload: SaveOpportunityToolRequest):
    """Executes save_opportunity tool."""
    return jarvis_agent.save_opportunity_tool(
        opportunity_id=payload.opportunity_id,
        status=payload.status,
        student_id=payload.student_id or "std_current_user"
    )


@router.post("/tools/update-application-status")
def tool_update_application_status(payload: UpdateOpportunityStatusToolRequest):
    """Executes update_application_status tool."""
    return jarvis_agent.update_application_status_tool(
        opportunity_id=payload.opportunity_id,
        status=payload.status,
        student_id=payload.student_id or "std_current_user"
    )

