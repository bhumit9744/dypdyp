"""
Jarvis REST API Endpoints — Voice, LinkedIn & Mail Plugins for Placement Hub
"""

from fastapi import APIRouter, Depends, HTTPException, status
from typing import Dict, Any, List

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


@router.post("/command")
def process_jarvis_command(payload: JarvisCommandRequest):
    """
    Executes a voice or text command through the Jarvis AI brain.
    Can trigger LinkedIn post generation, email dispatching, or interview routing.
    """
    return jarvis_agent.process_command(
        query=payload.query,
        student_id=payload.student_id or "std_current_user",
        context=payload.context
    )


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
