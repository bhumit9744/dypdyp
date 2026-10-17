"""
Integration Center Manager and Provider Registry for Placement Hub.
Orchestrates connections across GitHub, Google Workspace, Vercel, Cloudflare, and Supabase.
Enforces that status is only 'Connected' upon successful live provider verification.
"""

from __future__ import annotations

import asyncio
import datetime
import logging
from typing import Any, Dict, List, Optional
from sqlalchemy.orm import Session

from app.core.config import settings
from app.models.models import IntegrationConnection
from .base import (
    BaseConnector,
    ConnectorError,
    IntegrationStatus,
    ProviderMetadata,
    VerificationResult,
)
from .github import github_connector, GitHubConnector

logger = logging.getLogger("integrations.manager")


# ---------------------------------------------------------------------------
# Provider Definitions & Stubs for Other Requested Providers
# ---------------------------------------------------------------------------

class StubConnector(BaseConnector):
    """Placeholder connector for upcoming integrations (Google Workspace, Vercel, Cloudflare, Supabase)."""

    def __init__(self, metadata: ProviderMetadata):
        self._meta = metadata

    @property
    def provider_id(self) -> str:
        return self._meta.id

    @property
    def metadata(self) -> ProviderMetadata:
        return self._meta

    def validate_config(self, config: Dict[str, Any]) -> Dict[str, Any]:
        return config

    async def test_connection(
        self,
        credentials: Dict[str, Any],
        config: Optional[Dict[str, Any]] = None,
    ) -> VerificationResult:
        # Stub connectors do not claim connection without provider API verification
        return VerificationResult(
            success=False,
            status=IntegrationStatus.NOT_CONNECTED,
            verified_at=datetime.datetime.utcnow(),
            error=f"{self._meta.name} connector is awaiting OAuth client registration in the subsequent phase.",
        )


ALL_PROVIDERS_METADATA: List[ProviderMetadata] = [
    github_connector.metadata,
    ProviderMetadata(
        id="google_workspace",
        name="Google Workspace",
        description="Synchronize placement interview invitations via Google Calendar and candidate dossiers in Google Drive.",
        category="Productivity & Communications",
        icon="google",
        capabilities=["READ_CALENDAR", "READ_MAILS", "READ_DRIVE"],
        docs_url="https://developers.google.com/workspace",
        is_read_only=True,
        setup_guide="Requires Google Cloud OAuth 2.0 Web Client ID & Secret configured with calendar.readonly and drive.readonly scopes.",
    ),
    ProviderMetadata(
        id="vercel",
        name="Vercel",
        description="Monitor deployment preview URLs, build statuses, and staging environments for candidate portfolio projects.",
        category="Deployment & Hosting",
        icon="vercel",
        capabilities=["READ_DEPLOYMENTS", "READ_PROJECTS"],
        docs_url="https://vercel.com/docs/rest-api",
        is_read_only=True,
        setup_guide="Create a read-only Vercel Personal Access Token from Vercel Account Settings > Tokens.",
    ),
    ProviderMetadata(
        id="cloudflare",
        name="Cloudflare",
        description="Telemetry on edge workers, DNS routing, and security firewall rules guarding Placement Hub services.",
        category="Edge Infrastructure",
        icon="cloudflare",
        capabilities=["READ_DNS", "READ_WORKERS", "READ_PAGES"],
        docs_url="https://developers.cloudflare.com/api",
        is_read_only=True,
        setup_guide="Create a Cloudflare API Token with Zone.Read and Worker.Read permissions.",
    ),
    ProviderMetadata(
        id="supabase",
        name="Supabase",
        description="Inspect cloud storage buckets, authentication session health, and database replication status.",
        category="Database & Backend",
        icon="supabase",
        capabilities=["READ_DATABASE", "READ_AUTH", "READ_STORAGE"],
        docs_url="https://supabase.com/docs/reference/api",
        is_read_only=True,
        setup_guide="Requires Supabase Project Reference ID and read-only Service Key.",
    ),
]


class IntegrationManager:
    """Central registry and lifecycle manager for all third-party integrations."""

    def __init__(self):
        self.connectors: Dict[str, BaseConnector] = {
            "github": github_connector,
            "google_workspace": StubConnector(ALL_PROVIDERS_METADATA[1]),
            "vercel": StubConnector(ALL_PROVIDERS_METADATA[2]),
            "cloudflare": StubConnector(ALL_PROVIDERS_METADATA[3]),
            "supabase": StubConnector(ALL_PROVIDERS_METADATA[4]),
        }

    def get_connector(self, provider_id: str) -> Optional[BaseConnector]:
        return self.connectors.get(provider_id.lower().strip())

    def get_all_cards(self, db: Session) -> List[Dict[str, Any]]:
        """
        Returns all 5 provider cards merged with database status.
        Crucial Security Rule: encrypted_token is NEVER returned in the output!
        """
        # Fetch existing records from database
        records = {r.id: r for r in db.query(IntegrationConnection).all()}

        cards: List[Dict[str, Any]] = []
        for meta in ALL_PROVIDERS_METADATA:
            rec = records.get(meta.id)
            status = rec.status if rec else IntegrationStatus.NOT_CONNECTED.value
            last_verified = rec.last_verified_at.isoformat() if rec and rec.last_verified_at else None
            last_error = rec.last_error if rec else None
            account_name = rec.account_name if rec else None
            account_avatar = rec.account_avatar if rec else None
            repository = rec.repository if rec else (meta.id == "github" and settings.clean_github_repository or None)
            rate_limit_info = rec.rate_limit_info if rec else {}
            scopes = rec.scopes if rec else []

            cards.append({
                "id": meta.id,
                "name": meta.name,
                "description": meta.description,
                "category": meta.category,
                "icon": meta.icon,
                "capabilities": meta.capabilities,
                "docs_url": meta.docs_url,
                "is_read_only": meta.is_read_only,
                "setup_guide": meta.setup_guide,
                "status": status,
                "account_name": account_name,
                "account_avatar": account_avatar,
                "repository": repository,
                "scopes": scopes,
                "last_verified_at": last_verified,
                "last_error": last_error,
                "rate_limit_info": rate_limit_info,
            })
        return cards

    async def connect_provider(
        self,
        provider_id: str,
        token: Optional[str],
        repository: Optional[str],
        db: Session,
    ) -> Dict[str, Any]:
        """
        Initiates connection for a provider.
        Performs a real provider API test before saving 'Connected' status.
        """
        provider_key = provider_id.lower().strip()
        connector = self.get_connector(provider_key)
        if not connector:
            raise ValueError(f"Unknown provider '{provider_id}'.")

        if provider_key == "github":
            target_repo = repository or settings.clean_github_repository
            test_res = await connector.test_connection(
                credentials={"token": token},
                config={"repository": target_repo},
            )

            # Persist record in database
            rec = db.query(IntegrationConnection).filter(IntegrationConnection.id == "github").first()
            if not rec:
                rec = IntegrationConnection(id="github", provider="github")
                db.add(rec)

            rec.repository = test_res.repository or target_repo
            rec.last_verified_at = test_res.verified_at
            rec.rate_limit_info = test_res.rate_limit_info
            rec.scopes = test_res.scopes

            if test_res.success and test_res.status == IntegrationStatus.CONNECTED:
                rec.status = IntegrationStatus.CONNECTED.value
                rec.account_id = test_res.account_id
                rec.account_name = test_res.account_name
                rec.account_avatar = test_res.account_avatar
                rec.encrypted_token = token # Stored locally on server; never returned in API
                rec.last_error = None
                rec.metadata_json = test_res.raw_details
                db.commit()
                db.refresh(rec)
                return {
                    "success": True,
                    "status": rec.status,
                    "account_name": rec.account_name,
                    "account_avatar": rec.account_avatar,
                    "repository": rec.repository,
                    "latency_ms": test_res.latency_ms,
                    "last_verified_at": rec.last_verified_at.isoformat(),
                    "rate_limit_info": rec.rate_limit_info,
                    "scopes": rec.scopes,
                }
            else:
                rec.status = test_res.status.value
                rec.last_error = test_res.error or "Verification failed"
                db.commit()
                return {
                    "success": False,
                    "status": rec.status,
                    "error": rec.last_error,
                    "latency_ms": test_res.latency_ms,
                }

        else:
            # Stub providers
            return {
                "success": False,
                "status": IntegrationStatus.NOT_CONNECTED.value,
                "error": f"The {connector.metadata.name} connector foundation is created; OAuth authentication flow is scheduled for Phase 2.",
            }

    async def test_connection(
        self,
        provider_id: str,
        db: Session,
    ) -> Dict[str, Any]:
        """
        Executes an on-demand live test of an existing connection.
        """
        provider_key = provider_id.lower().strip()
        connector = self.get_connector(provider_key)
        if not connector:
            raise ValueError(f"Unknown provider '{provider_id}'.")

        rec = db.query(IntegrationConnection).filter(IntegrationConnection.id == provider_key).first()
        token = rec.encrypted_token if rec else None
        target_repo = (rec.repository if rec else None) or settings.clean_github_repository

        test_res = await connector.test_connection(
            credentials={"token": token},
            config={"repository": target_repo},
        )

        if not rec:
            rec = IntegrationConnection(id=provider_key, provider=provider_key)
            db.add(rec)

        rec.status = test_res.status.value
        rec.last_verified_at = test_res.verified_at
        rec.last_error = test_res.error
        rec.rate_limit_info = test_res.rate_limit_info
        if test_res.account_name:
            rec.account_name = test_res.account_name
        if test_res.account_avatar:
            rec.account_avatar = test_res.account_avatar
        if test_res.scopes:
            rec.scopes = test_res.scopes
        if test_res.repository:
            rec.repository = test_res.repository

        db.commit()
        db.refresh(rec)

        return {
            "success": test_res.success,
            "status": rec.status,
            "latency_ms": test_res.latency_ms,
            "last_verified_at": rec.last_verified_at.isoformat() if rec.last_verified_at else None,
            "account_name": rec.account_name,
            "repository": rec.repository,
            "error": rec.last_error,
            "rate_limit_info": rec.rate_limit_info,
        }

    def disconnect_provider(
        self,
        provider_id: str,
        db: Session,
    ) -> Dict[str, Any]:
        """
        Disconnects a provider, clears stored credentials, and resets status to 'Not connected'.
        """
        provider_key = provider_id.lower().strip()
        rec = db.query(IntegrationConnection).filter(IntegrationConnection.id == provider_key).first()
        if rec:
            rec.status = IntegrationStatus.NOT_CONNECTED.value
            rec.encrypted_token = None
            rec.account_id = None
            rec.account_name = None
            rec.account_avatar = None
            rec.last_error = None
            rec.rate_limit_info = {}
            rec.metadata_json = {}
            db.commit()

        return {
            "success": True,
            "provider": provider_key,
            "status": IntegrationStatus.NOT_CONNECTED.value,
            "message": f"Successfully disconnected {provider_id}.",
        }

    async def get_github_data(
        self,
        db: Session,
        repository: Optional[str] = None,
        commits_limit: int = 10,
        issues_limit: int = 10,
        workflows_limit: int = 10,
    ) -> Dict[str, Any]:
        """
        Retrieves real live GitHub repository overview, commits, issues/PRs, and CI/CD workflow runs.
        """
        rec = db.query(IntegrationConnection).filter(IntegrationConnection.id == "github").first()
        token = (rec.encrypted_token if rec else None) or settings.clean_github_token
        target_repo = repository or (rec.repository if rec else None) or settings.clean_github_repository

        # Run concurrent fetches
        repo_task = github_connector.get_repository(target_repo, token)
        commits_task = github_connector.list_commits(target_repo, token, per_page=commits_limit)
        issues_task = github_connector.list_issues_and_prs(target_repo, token, per_page=issues_limit)
        workflows_task = github_connector.list_workflow_runs(target_repo, token, per_page=workflows_limit)

        results = await asyncio.gather(
            repo_task, commits_task, issues_task, workflows_task, return_exceptions=True
        )

        repo_res, commits_res, issues_res, workflows_res = results

        # Check if repo call failed with an exception
        if isinstance(repo_res, Exception):
            raise repo_res

        commits = commits_res if isinstance(commits_res, list) else []
        issues = issues_res if isinstance(issues_res, list) else []
        workflows = workflows_res if isinstance(workflows_res, list) else []

        now_utc = datetime.datetime.now(datetime.timezone.utc).isoformat()
        return {
            "repository": repo_res,
            "commits": commits,
            "issues": issues,
            "workflows": workflows,
            "retrieved_at": now_utc,
            "rate_limit": repo_res.get("rate_limit", {}),
        }


# Global integration manager singleton
integration_manager = IntegrationManager()
