"""
Read-only GitHub REST API Connector for Placement Hub.
Complies with GitHub REST API version 2022-11-28.
Supports repository status, commits, issues/PRs, GitHub Actions workflow runs,
rate-limit tracking, bounded retries, and strict token redaction.
"""

from __future__ import annotations

import datetime
import logging
import re
import time
from typing import Any, Dict, List, Optional
import httpx

from app.core.config import settings
from .base import (
    BaseConnector,
    ConnectorAuthError,
    ConnectorError,
    ConnectorNetworkError,
    ConnectorNotFoundError,
    ConnectorPermissionError,
    ConnectorRateLimitError,
    ConnectorTimeoutError,
    IntegrationStatus,
    ProviderMetadata,
    VerificationResult,
)

logger = logging.getLogger("integrations.github")


class GitHubConnector(BaseConnector):
    """
    Read-only GitHub integration connector.
    Write operations are strictly disabled by design.
    """

    GITHUB_API_BASE = "https://api.github.com"
    GITHUB_API_VERSION = "2022-11-28"
    DEFAULT_REPO = "bhumit9744/dypdyp"
    REPO_REGEX = re.compile(r"^[a-zA-Z0-9_.-]+/[a-zA-Z0-9_.-]+$")

    @property
    def provider_id(self) -> str:
        return "github"

    @property
    def metadata(self) -> ProviderMetadata:
        return ProviderMetadata(
            id="github",
            name="GitHub",
            description="Track real repository activity, commit feeds, open pull requests, and CI/CD GitHub Actions workflow runs.",
            category="Source Code & CI/CD",
            icon="github",
            capabilities=[
                "READ_ACCOUNT",
                "READ_REPO",
                "READ_COMMITS",
                "READ_ISSUES",
                "READ_WORKFLOW_RUNS",
            ],
            docs_url="https://docs.github.com/en/rest",
            is_read_only=True,
            setup_guide="Create a Personal Access Token (PAT) with read-only 'repo' (or 'public_repo') scopes from GitHub Settings > Developer settings.",
        )

    # -----------------------------------------------------------------------
    # Validation & Sanitization
    # -----------------------------------------------------------------------

    def validate_repository_name(self, repo: str) -> str:
        """
        Validates and normalizes target repository name into 'owner/repo' format.
        Rejects directory traversal, command injection, and invalid characters.
        """
        if not repo or not isinstance(repo, str):
            raise ValueError("Repository name must be a non-empty string.")

        clean = repo.strip()
        # Strip common URL prefixes if user pasted a full URL
        if clean.startswith("https://github.com/"):
            clean = clean[len("https://github.com/"):].strip("/")
        elif clean.startswith("http://github.com/"):
            clean = clean[len("http://github.com/"):].strip("/")
        elif clean.startswith("git@github.com:"):
            clean = clean[len("git@github.com:"):].strip("/")

        # Strip .git suffix
        if clean.endswith(".git"):
            clean = clean[:-4]

        clean = clean.strip("/")

        if not self.REPO_REGEX.match(clean):
            raise ValueError(
                f"Invalid repository format '{repo}'. Expected 'owner/repository' (e.g. 'bhumit9744/dypdyp')."
            )
        return clean

    def validate_config(self, config: Dict[str, Any]) -> Dict[str, Any]:
        """Validates configuration payload."""
        repo = config.get("repository") or self.DEFAULT_REPO
        clean_repo = self.validate_repository_name(repo)
        return {"repository": clean_repo}

    # -----------------------------------------------------------------------
    # Internal HTTP Helpers
    # -----------------------------------------------------------------------

    def _build_headers(self, token: Optional[str] = None) -> Dict[str, str]:
        headers = {
            "Accept": "application/vnd.github+json",
            "X-GitHub-Api-Version": self.GITHUB_API_VERSION,
            "User-Agent": "PlacementHub-Integration/1.0",
        }
        clean_tok = (token or "").strip()
        if clean_tok:
            # Masked logging to preserve security
            headers["Authorization"] = f"Bearer {clean_tok}"
        return headers

    def _extract_rate_limit(self, headers: httpx.Headers) -> Dict[str, Any]:
        """Extracts standard GitHub rate-limit telemetry from response headers."""
        try:
            limit = int(headers.get("x-ratelimit-limit", 60))
            remaining = int(headers.get("x-ratelimit-remaining", 60))
            reset_ts = int(headers.get("x-ratelimit-reset", 0))
            used = int(headers.get("x-ratelimit-used", 0))
            resource = headers.get("x-ratelimit-resource", "core")
            reset_dt = datetime.datetime.fromtimestamp(reset_ts, datetime.timezone.utc).isoformat() if reset_ts else None
            return {
                "limit": limit,
                "remaining": remaining,
                "reset_timestamp": reset_ts,
                "reset_datetime": reset_dt,
                "used": used,
                "resource": resource,
            }
        except Exception:
            return {}

    def _extract_scopes(self, headers: httpx.Headers) -> List[str]:
        raw = headers.get("x-oauth-scopes", "")
        if not raw:
            return []
        return [s.strip() for s in raw.split(",") if s.strip()]

    def _handle_response_errors(self, response: httpx.Response, context: str):
        """Maps HTTP status codes to typed Connector exceptions with precise diagnosis."""
        rate_info = self._extract_rate_limit(response.headers)

        if response.status_code == 401:
            raise ConnectorAuthError(
                "GitHub authentication failed: Personal Access Token is invalid, expired, or missing.",
                provider="github",
                status_code=401,
                details={"rate_limit": rate_info},
            )

        if response.status_code == 403:
            remaining = response.headers.get("x-ratelimit-remaining")
            if remaining == "0" or "rate limit exceeded" in response.text.lower():
                reset_ts = rate_info.get("reset_timestamp")
                reset_dt = rate_info.get("reset_datetime", "shortly")
                raise ConnectorRateLimitError(
                    f"GitHub API rate limit exceeded. Limit resets at {reset_dt}.",
                    provider="github",
                    reset_timestamp=reset_ts,
                    status_code=403,
                    details={"rate_limit": rate_info},
                )
            accepted_scopes = response.headers.get("x-accepted-oauth-scopes", "")
            raise ConnectorPermissionError(
                f"GitHub permission denied while accessing {context}. Token lacks required scopes ({accepted_scopes or 'repo'}).",
                provider="github",
                status_code=403,
                details={"rate_limit": rate_info, "accepted_scopes": accepted_scopes},
            )

        if response.status_code == 404:
            raise ConnectorNotFoundError(
                f"GitHub resource or repository not found for {context}. Verify that the repository exists and your token has permission to access it.",
                provider="github",
                status_code=404,
                details={"rate_limit": rate_info},
            )

        if response.status_code >= 500:
            raise ConnectorNetworkError(
                f"GitHub API server error ({response.status_code}) while accessing {context}.",
                provider="github",
                status_code=response.status_code,
                details={"rate_limit": rate_info},
            )

        if not response.is_success:
            raise ConnectorError(
                f"GitHub API error ({response.status_code}) on {context}: {response.text[:200]}",
                provider="github",
                status_code=response.status_code,
                details={"rate_limit": rate_info},
            )

    # -----------------------------------------------------------------------
    # Core API Operations
    # -----------------------------------------------------------------------

    async def verify_account(self, token: Optional[str] = None) -> Dict[str, Any]:
        """
        Verifies the authenticated account via GitHub REST API.
        If token is provided, queries /user. If unauthenticated, checks /rate_limit.
        """
        clean_token = (token or "").strip()
        headers = self._build_headers(clean_token)

        async def _call() -> Dict[str, Any]:
            try:
                async with httpx.AsyncClient(timeout=self.REQUEST_TIMEOUT_SECONDS) as client:
                    if clean_token:
                        resp = await client.get(f"{self.GITHUB_API_BASE}/user", headers=headers)
                    else:
                        resp = await client.get(f"{self.GITHUB_API_BASE}/rate_limit", headers=headers)

                    if not resp.is_success:
                        self._handle_response_errors(resp, "verify_account")

                    data = resp.json()
                    rate_info = self._extract_rate_limit(resp.headers)
                    scopes = self._extract_scopes(resp.headers)

                    if clean_token:
                        return {
                            "authenticated": True,
                            "account_id": str(data.get("id", "")),
                            "account_name": data.get("login") or data.get("name") or "GitHub User",
                            "display_name": data.get("name"),
                            "avatar_url": data.get("avatar_url"),
                            "html_url": data.get("html_url"),
                            "scopes": scopes,
                            "rate_limit": rate_info,
                        }
                    else:
                        return {
                            "authenticated": False,
                            "account_id": None,
                            "account_name": "Public GitHub Access",
                            "display_name": "Unauthenticated API",
                            "avatar_url": "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png",
                            "html_url": "https://github.com",
                            "scopes": [],
                            "rate_limit": rate_info,
                        }
            except httpx.TimeoutException:
                raise ConnectorTimeoutError(
                    "Connection to GitHub API timed out during identity verification.",
                    provider="github",
                )
            except httpx.RequestError as e:
                raise ConnectorNetworkError(
                    f"Unable to reach GitHub API: {str(e)}",
                    provider="github",
                )

        return await self.execute_with_bounded_retry(_call, operation_name="verify_account")

    async def get_repository(
        self,
        repo: str,
        token: Optional[str] = None,
    ) -> Dict[str, Any]:
        """
        Retrieves real repository metadata from GitHub.
        """
        clean_repo = self.validate_repository_name(repo)
        headers = self._build_headers(token)

        async def _call() -> Dict[str, Any]:
            try:
                async with httpx.AsyncClient(timeout=self.REQUEST_TIMEOUT_SECONDS) as client:
                    resp = await client.get(f"{self.GITHUB_API_BASE}/repos/{clean_repo}", headers=headers)
                    if not resp.is_success:
                        self._handle_response_errors(resp, f"repository '{clean_repo}'")

                    data = resp.json()
                    rate_info = self._extract_rate_limit(resp.headers)

                    return {
                        "name": data.get("name"),
                        "full_name": data.get("full_name"),
                        "description": data.get("description") or "No description provided",
                        "html_url": data.get("html_url"),
                        "default_branch": data.get("default_branch", "main"),
                        "is_private": data.get("private", False),
                        "stars_count": data.get("stargazers_count", 0),
                        "forks_count": data.get("forks_count", 0),
                        "open_issues_count": data.get("open_issues_count", 0),
                        "language": data.get("language") or "TypeScript/Python",
                        "updated_at": data.get("updated_at"),
                        "pushed_at": data.get("pushed_at"),
                        "rate_limit": rate_info,
                    }
            except httpx.TimeoutException:
                raise ConnectorTimeoutError(
                    f"Timed out fetching repository '{clean_repo}'.",
                    provider="github",
                )
            except httpx.RequestError as e:
                raise ConnectorNetworkError(
                    f"Network error contacting GitHub for repository '{clean_repo}': {str(e)}",
                    provider="github",
                )

        return await self.execute_with_bounded_retry(_call, operation_name=f"get_repository({clean_repo})")

    async def list_commits(
        self,
        repo: str,
        token: Optional[str] = None,
        per_page: int = 10,
        page: int = 1,
    ) -> List[Dict[str, Any]]:
        """
        Retrieves recent commits with normalized SHA, message, author, and source URLs.
        """
        clean_repo = self.validate_repository_name(repo)
        per_page = max(1, min(per_page, 30))
        page = max(1, page)
        headers = self._build_headers(token)

        async def _call() -> List[Dict[str, Any]]:
            try:
                async with httpx.AsyncClient(timeout=self.REQUEST_TIMEOUT_SECONDS) as client:
                    params = {"per_page": per_page, "page": page}
                    resp = await client.get(
                        f"{self.GITHUB_API_BASE}/repos/{clean_repo}/commits",
                        headers=headers,
                        params=params,
                    )
                    # HTTP 409 can occur on completely empty repositories (Git Repository is empty)
                    if resp.status_code == 409:
                        return []
                    if not resp.is_success:
                        self._handle_response_errors(resp, f"commits for '{clean_repo}'")

                    items = resp.json()
                    if not isinstance(items, list):
                        return []

                    normalized: List[Dict[str, Any]] = []
                    for c in items:
                        sha = c.get("sha", "")
                        commit_data = c.get("commit", {})
                        author_data = commit_data.get("author", {}) or {}
                        gh_author = c.get("author") or {}

                        full_msg = commit_data.get("message", "")
                        # Split title and body
                        first_line = full_msg.split("\n")[0] if full_msg else "No commit message"

                        normalized.append({
                            "sha": sha,
                            "short_sha": sha[:7] if sha else "",
                            "message": first_line,
                            "full_message": full_msg,
                            "author_name": author_data.get("name") or gh_author.get("login") or "Unknown Author",
                            "author_avatar": gh_author.get("avatar_url") or "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png",
                            "date": author_data.get("date"),
                            "html_url": c.get("html_url") or f"https://github.com/{clean_repo}/commit/{sha}",
                        })
                    return normalized
            except httpx.TimeoutException:
                raise ConnectorTimeoutError(
                    f"Timed out fetching commits for '{clean_repo}'.",
                    provider="github",
                )
            except httpx.RequestError as e:
                raise ConnectorNetworkError(
                    f"Network error fetching commits for '{clean_repo}': {str(e)}",
                    provider="github",
                )

        return await self.execute_with_bounded_retry(_call, operation_name=f"list_commits({clean_repo})")

    async def list_issues_and_prs(
        self,
        repo: str,
        token: Optional[str] = None,
        state: str = "open",
        per_page: int = 10,
        page: int = 1,
    ) -> List[Dict[str, Any]]:
        """
        Retrieves issues and pull requests, distinguishing PRs and extracting metadata.
        """
        clean_repo = self.validate_repository_name(repo)
        per_page = max(1, min(per_page, 30))
        page = max(1, page)
        headers = self._build_headers(token)

        async def _call() -> List[Dict[str, Any]]:
            try:
                async with httpx.AsyncClient(timeout=self.REQUEST_TIMEOUT_SECONDS) as client:
                    params = {"state": state, "per_page": per_page, "page": page}
                    resp = await client.get(
                        f"{self.GITHUB_API_BASE}/repos/{clean_repo}/issues",
                        headers=headers,
                        params=params,
                    )
                    if not resp.is_success:
                        self._handle_response_errors(resp, f"issues for '{clean_repo}'")

                    items = resp.json()
                    if not isinstance(items, list):
                        return []

                    normalized: List[Dict[str, Any]] = []
                    for it in items:
                        is_pr = "pull_request" in it
                        user_info = it.get("user") or {}
                        normalized.append({
                            "id": it.get("id"),
                            "number": it.get("number"),
                            "title": it.get("title", "Untitled"),
                            "state": it.get("state", "open"),
                            "is_pr": is_pr,
                            "type": "Pull Request" if is_pr else "Issue",
                            "author_name": user_info.get("login") or "Anonymous",
                            "author_avatar": user_info.get("avatar_url") or "",
                            "comments_count": it.get("comments", 0),
                            "created_at": it.get("created_at"),
                            "updated_at": it.get("updated_at"),
                            "html_url": it.get("html_url") or f"https://github.com/{clean_repo}/issues/{it.get('number')}",
                        })
                    return normalized
            except httpx.TimeoutException:
                raise ConnectorTimeoutError(
                    f"Timed out fetching issues for '{clean_repo}'.",
                    provider="github",
                )
            except httpx.RequestError as e:
                raise ConnectorNetworkError(
                    f"Network error fetching issues for '{clean_repo}': {str(e)}",
                    provider="github",
                )

        return await self.execute_with_bounded_retry(_call, operation_name=f"list_issues({clean_repo})")

    async def list_workflow_runs(
        self,
        repo: str,
        token: Optional[str] = None,
        per_page: int = 10,
        page: int = 1,
    ) -> List[Dict[str, Any]]:
        """
        Retrieves recent GitHub Actions workflow runs.
        Catches 404 gracefully if Actions are disabled or not initialized for the repo.
        """
        clean_repo = self.validate_repository_name(repo)
        per_page = max(1, min(per_page, 30))
        page = max(1, page)
        headers = self._build_headers(token)

        async def _call() -> List[Dict[str, Any]]:
            try:
                async with httpx.AsyncClient(timeout=self.REQUEST_TIMEOUT_SECONDS) as client:
                    params = {"per_page": per_page, "page": page}
                    resp = await client.get(
                        f"{self.GITHUB_API_BASE}/repos/{clean_repo}/actions/runs",
                        headers=headers,
                        params=params,
                    )
                    # 404 indicates Actions not enabled or no runs exist yet
                    if resp.status_code == 404:
                        return []
                    if not resp.is_success:
                        self._handle_response_errors(resp, f"workflow runs for '{clean_repo}'")

                    payload = resp.json()
                    runs = payload.get("workflow_runs", [])
                    if not isinstance(runs, list):
                        return []

                    normalized: List[Dict[str, Any]] = []
                    for r in runs:
                        normalized.append({
                            "id": r.get("id"),
                            "name": r.get("name") or "Workflow",
                            "head_branch": r.get("head_branch") or "main",
                            "head_sha": (r.get("head_sha") or "")[:7],
                            "event": r.get("event", "push"),
                            "status": r.get("status", "queued"), # "queued", "in_progress", "completed"
                            "conclusion": r.get("conclusion"), # "success", "failure", "neutral", "cancelled", None
                            "html_url": r.get("html_url") or f"https://github.com/{clean_repo}/actions",
                            "created_at": r.get("created_at"),
                            "updated_at": r.get("updated_at"),
                            "run_number": r.get("run_number"),
                        })
                    return normalized
            except (ConnectorNotFoundError, ConnectorPermissionError):
                # If actions are private or disabled, return empty list without crashing
                return []
            except httpx.TimeoutException:
                raise ConnectorTimeoutError(
                    f"Timed out fetching workflow runs for '{clean_repo}'.",
                    provider="github",
                )
            except httpx.RequestError as e:
                raise ConnectorNetworkError(
                    f"Network error fetching workflow runs for '{clean_repo}': {str(e)}",
                    provider="github",
                )

        return await self.execute_with_bounded_retry(_call, operation_name=f"list_workflow_runs({clean_repo})")

    # -----------------------------------------------------------------------
    # Connection Testing & Verification
    # -----------------------------------------------------------------------

    async def test_connection(
        self,
        credentials: Dict[str, Any],
        config: Optional[Dict[str, Any]] = None,
    ) -> VerificationResult:
        """
        Executes a real live authenticated request against GitHub.
        Only returns 'Connected' status when real provider API verification succeeds.
        """
        start_time = time.perf_counter()
        token = credentials.get("token") or credentials.get("access_token")
        cfg = config or {}
        repo_name = cfg.get("repository") or self.DEFAULT_REPO

        try:
            clean_repo = self.validate_repository_name(repo_name)
        except ValueError as ve:
            return VerificationResult(
                success=False,
                status=IntegrationStatus.ERROR,
                latency_ms=0.0,
                verified_at=datetime.datetime.utcnow(),
                error=str(ve),
            )

        try:
            # 1. Verify account / credentials
            account_data = await self.verify_account(token)
            # 2. Check repository access
            repo_data = await self.get_repository(clean_repo, token)

            latency = round((time.perf_counter() - start_time) * 1000, 2)
            rate_info = repo_data.get("rate_limit") or account_data.get("rate_limit") or {}

            return VerificationResult(
                success=True,
                status=IntegrationStatus.CONNECTED,
                latency_ms=latency,
                verified_at=datetime.datetime.utcnow(),
                account_id=account_data.get("account_id"),
                account_name=account_data.get("account_name"),
                account_avatar=account_data.get("avatar_url"),
                repository=clean_repo,
                scopes=account_data.get("scopes", []),
                rate_limit_info=rate_info,
                error=None,
                raw_details={
                    "repo_url": repo_data.get("html_url"),
                    "stars": repo_data.get("stars_count"),
                    "default_branch": repo_data.get("default_branch"),
                    "is_private": repo_data.get("is_private"),
                },
            )

        except ConnectorAuthError as ae:
            latency = round((time.perf_counter() - start_time) * 1000, 2)
            return VerificationResult(
                success=False,
                status=IntegrationStatus.EXPIRED,
                latency_ms=latency,
                verified_at=datetime.datetime.utcnow(),
                repository=repo_name,
                error=ae.message,
                rate_limit_info=ae.details.get("rate_limit", {}),
            )
        except (ConnectorPermissionError, ConnectorRateLimitError, ConnectorNotFoundError, ConnectorTimeoutError, ConnectorNetworkError) as ce:
            latency = round((time.perf_counter() - start_time) * 1000, 2)
            return VerificationResult(
                success=False,
                status=IntegrationStatus.ERROR,
                latency_ms=latency,
                verified_at=datetime.datetime.utcnow(),
                repository=repo_name,
                error=ce.message,
                rate_limit_info=ce.details.get("rate_limit", {}),
            )
        except Exception as ex:
            latency = round((time.perf_counter() - start_time) * 1000, 2)
            return VerificationResult(
                success=False,
                status=IntegrationStatus.ERROR,
                latency_ms=latency,
                verified_at=datetime.datetime.utcnow(),
                repository=repo_name,
                error=f"Unexpected verification failure: {str(ex)}",
            )


# Global singleton instance
github_connector = GitHubConnector()
