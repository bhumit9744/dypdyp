"""
Opportunities Intelligence Module — Placement Hub
Provider-neutral discovery, normalization, verification, and AI matching.
"""

from .schemas import (
    OpportunityItem,
    OpportunityFilterParams,
    SavedOpportunityItem,
    OpportunityUserPreferenceSchema,
    OpportunityMatchEvaluation,
    ProviderAuditReport,
)
from .phase0_audit import PROVIDER_AUDIT_DATA
from .service import opportunities_service

__all__ = [
    "OpportunityItem",
    "OpportunityFilterParams",
    "SavedOpportunityItem",
    "OpportunityUserPreferenceSchema",
    "OpportunityMatchEvaluation",
    "ProviderAuditReport",
    "PROVIDER_AUDIT_DATA",
    "opportunities_service",
]
