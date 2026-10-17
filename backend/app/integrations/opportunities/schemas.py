"""
Data schemas for Opportunities Intelligence Module.
Defines normalized opportunity contracts, filtering, and provider verification reports.
"""

from __future__ import annotations

import datetime
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


class OpportunityItem(BaseModel):
    id: str = Field(..., description="Stable internal identifier (e.g. opp_gh_001)")
    source_id: Optional[str] = Field(None, description="External provider identifier if available")
    provider: str = Field(..., description="Provider slug: linkedin, unstop, devpost, mlh, wellfound, naukri, company_career, university")
    provenance_type: str = Field(
        ...,
        description="Data provenance: 'api_verified', 'official_feed', 'link_discovery', 'manual_import'"
    )
    title: str = Field(..., description="Role title or challenge name")
    company_or_organizer: str = Field(..., description="Hiring company or competition organizer")
    category: str = Field(
        ...,
        description="Category: 'job', 'internship', 'hackathon', 'competition', 'scholarship', 'fellowship', 'programme'"
    )
    source_url: str = Field(..., description="Official landing or search listing URL")
    application_url: str = Field(..., description="Direct application or registration URL")
    location: str = Field(default="Remote", description="Physical city/region or Remote")
    remote_status: str = Field(default="remote", description="'remote', 'hybrid', 'on_site'")
    compensation_type: str = Field(default="unknown", description="'paid', 'unpaid', 'stipend', 'prize', 'unknown'")
    compensation_amount: Optional[str] = Field(None, description="Factual salary range, stipend, or prize pool if verified")
    eligibility: Dict[str, Any] = Field(default_factory=dict, description="Verified eligibility requirements (degrees, branches, batches, min CGPA)")
    experience_requirements: Optional[str] = Field(None, description="e.g. '0-1 years', 'Students only', 'Entry Level'")
    skills: List[str] = Field(default_factory=list, description="Target technical and domain skills")
    deadline: Optional[str] = Field(None, description="Published deadline in ISO 8601 or date format")
    deadline_timezone: str = Field(default="IST", description="Timezone of the deadline")
    status: str = Field(default="open", description="'open', 'closing_soon', 'closed', 'unknown'")
    is_stale: bool = Field(default=False, description="Flagged true if last verified > 7 days ago")
    last_verified_at: Optional[datetime.datetime] = Field(None, description="Last live check timestamp")
    retrieved_at: Optional[datetime.datetime] = Field(None, description="Retrieval timestamp")
    description: str = Field(..., description="Short factual description without hyperbole")
    canonical_url_hash: Optional[str] = Field(None, description="SHA256 hash for duplicate suppression")
    raw_metadata: Dict[str, Any] = Field(default_factory=dict, description="Source attribution metadata")

    model_config = {"from_attributes": True}


class OpportunityFilterParams(BaseModel):
    query: Optional[str] = None
    category: Optional[str] = None # "job", "internship", "hackathon", "competition", "scholarship", "fellowship", "programme"
    provider: Optional[str] = None
    role: Optional[str] = None
    skills: Optional[List[str]] = None
    location: Optional[str] = None
    remote_status: Optional[str] = None # "remote", "hybrid", "on_site"
    compensation_type: Optional[str] = None # "paid", "stipend", "prize"
    experience_level: Optional[str] = None
    status: Optional[str] = None # "open", "closing_soon"
    min_cgpa: Optional[float] = None
    limit: int = 50
    offset: int = 0


class SaveOpportunityRequest(BaseModel):
    opportunity_id: str
    application_status: str = Field(default="saved", description="'saved', 'applied', 'interviewing', 'offered', 'rejected', 'archived'")
    reminder_enabled: bool = True
    reminder_frequency: str = Field(default="3_days_before", description="'daily', '3_days_before', '1_day_before'")
    notes: Optional[str] = None


class UpdateApplicationStatusRequest(BaseModel):
    application_status: str = Field(..., description="'saved', 'applied', 'interviewing', 'offered', 'rejected', 'archived'")
    notes: Optional[str] = None
    applied_at: Optional[datetime.datetime] = None


class SavedOpportunityItem(BaseModel):
    id: str
    student_id: str
    opportunity_id: str
    application_status: str
    reminder_enabled: bool
    reminder_frequency: str
    notes: Optional[str]
    applied_at: Optional[datetime.datetime]
    created_at: datetime.datetime
    opportunity: Optional[OpportunityItem] = None

    model_config = {"from_attributes": True}


class ManualImportOpportunityRequest(BaseModel):
    title: str = Field(..., min_length=2, max_length=200)
    company_or_organizer: str = Field(..., min_length=2, max_length=200)
    category: str = Field(..., description="'job', 'internship', 'hackathon', 'competition', 'scholarship', 'fellowship', 'programme'")
    source_url: str = Field(..., description="URL of the opportunity (e.g. LinkedIn, Unstop, company page)")
    application_url: Optional[str] = None
    provider: str = Field(default="manual", description="Source provider name (e.g. linkedin, unstop, wellfound, naukri, company)")
    location: Optional[str] = "Remote"
    remote_status: str = Field(default="remote", description="'remote', 'hybrid', 'on_site'")
    compensation_type: str = Field(default="unknown", description="'paid', 'unpaid', 'stipend', 'prize', 'unknown'")
    compensation_amount: Optional[str] = None
    experience_requirements: Optional[str] = None
    skills: List[str] = Field(default_factory=list)
    deadline: Optional[str] = None
    description: str = Field(..., min_length=10)


class OpportunityUserPreferenceSchema(BaseModel):
    preferred_roles: List[str] = Field(default_factory=list)
    preferred_categories: List[str] = Field(default_factory=list)
    preferred_locations: List[str] = Field(default_factory=list)
    remote_only: bool = False
    min_compensation: Optional[str] = None
    subscribed_providers: List[str] = Field(default_factory=list)

    model_config = {"from_attributes": True}


class OpportunityMatchEvaluation(BaseModel):
    opportunity_id: str
    match_percentage: int = Field(..., ge=0, le=100)
    match_level: str = Field(..., description="'High Match', 'Moderate Match', 'Low Match'")
    why_it_matches: List[str] = Field(default_factory=list)
    matched_skills: List[str] = Field(default_factory=list)
    skill_gaps: List[str] = Field(default_factory=list)
    cgpa_eligible: Optional[bool] = None
    department_eligible: Optional[bool] = None
    advisory_notice: str = (
        "Relevance score is an advisory match based strictly on verified student profile records. "
        "It does NOT guarantee interview selection, eligibility confirmation, or hiring."
    )


class ProviderAuditReport(BaseModel):
    name: str
    slug: str
    category: str
    official_api_available: bool
    provenance_type: str # "api_verified", "official_feed", "link_discovery", "manual_import"
    auth_and_approval_requirements: str
    terms_and_permitted_use: str
    rate_limits_and_attribution: str
    retrievable_fields: List[str]
    incremental_updates_and_webhooks: bool
    search_url_template: Optional[str] = None
    disclaimer: str
