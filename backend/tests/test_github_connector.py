"""
Unit and Integration Tests for Placement Hub GitHub Connector,
Integration Center Endpoints, Jarvis GitHub Status Tool, and Secret Redaction.
All provider calls are mocked in unit tests with strict error behavior verification.
"""

import os
import json
import asyncio
import pytest
import httpx
from unittest.mock import patch
from fastapi.testclient import TestClient

from app.main import app
from app.core.config import settings
from app.core.database import SessionLocal, init_db_schema
from app.models.models import IntegrationConnection
from app.integrations.base import (
    ConnectorAuthError,
    ConnectorPermissionError,
    ConnectorRateLimitError,
    ConnectorNotFoundError,
    ConnectorTimeoutError,
    ConnectorNetworkError,
    IntegrationStatus,
)
from app.integrations.github import GitHubConnector, github_connector
from app.integrations.manager import integration_manager
from app.services.jarvis_agent import jarvis_agent

client = TestClient(app)


@pytest.fixture(autouse=True)
def clean_db():
    """Ensure database schema is initialized and integration records are clean for each test."""
    init_db_schema()
    db = SessionLocal()
    try:
        db.query(IntegrationConnection).delete()
        db.commit()
    finally:
        db.close()
    yield
    db = SessionLocal()
    try:
        db.query(IntegrationConnection).delete()
        db.commit()
    finally:
        db.close()


_RealAsyncClient = httpx.AsyncClient

def _make_client_patch(mock_transport):
    """Returns a fresh AsyncClient on every instantiation with mock_transport."""
    return patch(
        "httpx.AsyncClient",
        side_effect=lambda *args, **kwargs: _RealAsyncClient(
            transport=mock_transport,
            timeout=kwargs.get("timeout", 10.0)
        )
    )


# ---------------------------------------------------------------------------
# 1. Repository Input Validation & Sanitization Tests
# ---------------------------------------------------------------------------

def test_repository_name_validation():
    connector = GitHubConnector()

    # Valid formats
    assert connector.validate_repository_name("bhumit9744/dypdyp") == "bhumit9744/dypdyp"
    assert connector.validate_repository_name("https://github.com/bhumit9744/dypdyp.git") == "bhumit9744/dypdyp"
    assert connector.validate_repository_name("org-name/repo_123.prod") == "org-name/repo_123.prod"

    # Invalid formats / path traversal attempts
    with pytest.raises(ValueError):
        connector.validate_repository_name("")
    with pytest.raises(ValueError):
        connector.validate_repository_name("../../../etc/passwd")
    with pytest.raises(ValueError):
        connector.validate_repository_name("onlyonepart")
    with pytest.raises(ValueError):
        connector.validate_repository_name("owner/repo/extra")
    with pytest.raises(ValueError):
        connector.validate_repository_name("owner/repo; rm -rf /")


# ---------------------------------------------------------------------------
# 2. Valid Connection & Identity Verification (Mocked)
# ---------------------------------------------------------------------------

def test_valid_connection_and_identity_verification():
    user_payload = {
        "id": 123456,
        "login": "bhumit9744",
        "name": "Bhumit Patel",
        "avatar_url": "https://avatars.githubusercontent.com/u/123456",
        "html_url": "https://github.com/bhumit9744",
    }
    repo_payload = {
        "name": "dypdyp",
        "full_name": "bhumit9744/dypdyp",
        "description": "Placement Hub Campus System",
        "html_url": "https://github.com/bhumit9744/dypdyp",
        "default_branch": "main",
        "private": False,
        "stargazers_count": 10,
        "forks_count": 2,
        "open_issues_count": 1,
        "language": "Python",
        "updated_at": "2026-10-16T12:00:00Z",
    }

    mock_transport = httpx.MockTransport(lambda req: httpx.Response(
        status_code=200,
        json=user_payload if req.url.path == "/user" else repo_payload,
        headers={
            "x-oauth-scopes": "repo, read:user",
            "x-ratelimit-limit": "5000",
            "x-ratelimit-remaining": "4990",
            "x-ratelimit-reset": "1770000000",
        }
    ))

    with _make_client_patch(mock_transport):
        res = asyncio.run(github_connector.test_connection(
            credentials={"token": "ghp_validTestToken1234567890"},
            config={"repository": "bhumit9744/dypdyp"}
        ))

        assert res.success is True
        assert res.status == IntegrationStatus.CONNECTED
        assert res.account_name == "bhumit9744"
        assert res.account_avatar == "https://avatars.githubusercontent.com/u/123456"
        assert res.scopes == ["repo", "read:user"]
        assert res.rate_limit_info["remaining"] == 4990
        assert res.error is None


# ---------------------------------------------------------------------------
# 3. Invalid & Expired Credentials (HTTP 401)
# ---------------------------------------------------------------------------

def test_invalid_expired_credentials_raises_auth_error():
    mock_transport = httpx.MockTransport(lambda req: httpx.Response(
        status_code=401,
        json={"message": "Bad credentials", "documentation_url": "https://docs.github.com/rest"},
        headers={"x-ratelimit-remaining": "59"}
    ))

    with _make_client_patch(mock_transport):
        with pytest.raises(ConnectorAuthError) as exc_info:
            asyncio.run(github_connector.verify_account(token="ghp_expiredBadToken"))

        assert "Personal Access Token is invalid, expired, or missing" in str(exc_info.value)

        # test_connection returns status EXPIRED
        res = asyncio.run(github_connector.test_connection(
            credentials={"token": "ghp_expiredBadToken"},
            config={"repository": "bhumit9744/dypdyp"}
        ))
        assert res.success is False
        assert res.status == IntegrationStatus.EXPIRED
        assert "invalid, expired, or missing" in (res.error or "")


# ---------------------------------------------------------------------------
# 4. Missing Permissions (HTTP 403 Forbidden)
# ---------------------------------------------------------------------------

def test_missing_permissions_raises_permission_error():
    mock_transport = httpx.MockTransport(lambda req: httpx.Response(
        status_code=403,
        json={"message": "Resource not accessible by personal access token"},
        headers={
            "x-accepted-oauth-scopes": "repo",
            "x-ratelimit-remaining": "4950"
        }
    ))

    with _make_client_patch(mock_transport):
        with pytest.raises(ConnectorPermissionError) as exc_info:
            asyncio.run(github_connector.get_repository("bhumit9744/dypdyp", token="ghp_lowScopeToken"))

        assert "Token lacks required scopes" in str(exc_info.value)


# ---------------------------------------------------------------------------
# 5. Rate Limiting & Reset Telemetry (HTTP 403 / 429)
# ---------------------------------------------------------------------------

def test_rate_limiting_handling():
    mock_transport = httpx.MockTransport(lambda req: httpx.Response(
        status_code=403,
        json={"message": "API rate limit exceeded for user"},
        headers={
            "x-ratelimit-limit": "60",
            "x-ratelimit-remaining": "0",
            "x-ratelimit-reset": "1770000500"
        }
    ))

    with _make_client_patch(mock_transport):
        with pytest.raises(ConnectorRateLimitError) as exc_info:
            asyncio.run(github_connector.get_repository("bhumit9744/dypdyp", token="ghp_rateLimited"))

        assert "API rate limit exceeded" in str(exc_info.value)
        assert exc_info.value.reset_timestamp == 1770000500


# ---------------------------------------------------------------------------
# 6. Bounded Retries on Transient 5xx Network Errors
# ---------------------------------------------------------------------------

def test_bounded_retries_on_5xx_server_error():
    attempt_count = 0

    def mock_handler(req):
        nonlocal attempt_count
        attempt_count += 1
        return httpx.Response(status_code=503, text="Service Unavailable")

    mock_transport = httpx.MockTransport(mock_handler)

    with _make_client_patch(mock_transport):
        # BaseConnector.MAX_RETRIES is 2, so 3 total attempts
        with pytest.raises(ConnectorNetworkError):
            asyncio.run(github_connector.get_repository("bhumit9744/dypdyp"))

        assert attempt_count == 3


# ---------------------------------------------------------------------------
# 7. Empty Repositories and Empty Issue Lists
# ---------------------------------------------------------------------------

def test_empty_repository_and_empty_issues():
    def mock_handler(req):
        if req.url.path.endswith("/commits"):
            # Empty git repository returns 409 Conflict
            return httpx.Response(status_code=409, json={"message": "Git Repository is empty."})
        elif req.url.path.endswith("/issues"):
            return httpx.Response(status_code=200, json=[])
        elif req.url.path.endswith("/actions/runs"):
            return httpx.Response(status_code=200, json={"workflow_runs": []})
        return httpx.Response(status_code=200, json={})

    mock_transport = httpx.MockTransport(mock_handler)

    with _make_client_patch(mock_transport):
        commits = asyncio.run(github_connector.list_commits("bhumit9744/dypdyp"))
        issues = asyncio.run(github_connector.list_issues_and_prs("bhumit9744/dypdyp"))
        workflows = asyncio.run(github_connector.list_workflow_runs("bhumit9744/dypdyp"))

        assert commits == []
        assert issues == []
        assert workflows == []


# ---------------------------------------------------------------------------
# 8. Pagination Verification
# ---------------------------------------------------------------------------

def test_pagination_arguments_passed_correctly():
    captured_params = {}

    def mock_handler(req):
        nonlocal captured_params
        captured_params = dict(req.url.params)
        return httpx.Response(status_code=200, json=[])

    mock_transport = httpx.MockTransport(mock_handler)

    with _make_client_patch(mock_transport):
        asyncio.run(github_connector.list_commits("bhumit9744/dypdyp", per_page=15, page=2))
        assert captured_params.get("per_page") == "15"
        assert captured_params.get("page") == "2"


# ---------------------------------------------------------------------------
# 9. Secret Redaction: Tokens NEVER Exposed in Client Responses
# ---------------------------------------------------------------------------

def test_secret_redaction_in_api_responses():
    user_payload = {"id": 1, "login": "bhumit-candidate", "avatar_url": "https://avatar"}
    repo_payload = {"name": "dypdyp", "full_name": "bhumit9744/dypdyp", "html_url": "https://github.com"}

    mock_transport = httpx.MockTransport(lambda req: httpx.Response(
        status_code=200,
        json=user_payload if req.url.path == "/user" else repo_payload,
        headers={"x-oauth-scopes": "repo"}
    ))

    secret_token = "ghp_superSecretTokenThatMustNeverLeak_999888"

    with _make_client_patch(mock_transport):
        connect_res = client.post(
            "/api/v1/integrations/github/connect",
            json={"token": secret_token, "repository": "bhumit9744/dypdyp"}
        )
        assert connect_res.status_code == 200
        # Token must NOT be in the connect response
        assert secret_token not in connect_res.text
        assert "ghp_" not in connect_res.text

        # 2. Get all cards
        cards_res = client.get("/api/v1/integrations")
        assert cards_res.status_code == 200
        cards_json = cards_res.text
        assert secret_token not in cards_json
        assert "encrypted_token" not in cards_json

        # 3. Test endpoint response
        test_res = client.post("/api/v1/integrations/github/test")
        assert test_res.status_code == 200
        assert secret_token not in test_res.text


# ---------------------------------------------------------------------------
# 10. No Fabricated Status When Requests Fail (Honest Reporting)
# ---------------------------------------------------------------------------

def test_no_fabricated_status_when_api_fails():
    mock_transport = httpx.MockTransport(lambda req: httpx.Response(
        status_code=404,
        json={"message": "Not Found"}
    ))

    with _make_client_patch(mock_transport):
        resp = client.post(
            "/api/v1/integrations/github/connect",
            json={"token": "ghp_sampleToken", "repository": "bhumit9744/nonexistent_repo"}
        )
        # Must return 400 with honest error, not claim success
        assert resp.status_code == 400
        assert "not found" in resp.json()["detail"].lower()


# ---------------------------------------------------------------------------
# 11. Jarvis Status Query Tool Integration (Honest Reporting & Citation)
# ---------------------------------------------------------------------------

def test_jarvis_github_status_query_tool_success():
    repo_payload = {
        "name": "dypdyp",
        "full_name": "bhumit9744/dypdyp",
        "html_url": "https://github.com/bhumit9744/dypdyp",
        "default_branch": "main",
        "stargazers_count": 14,
        "forks_count": 3,
        "open_issues_count": 2,
    }
    commits_payload = [
        {
            "sha": "a1b2c3d4e5f67890",
            "commit": {
                "message": "feat(integrations): add GitHub connector\n\nFull details here",
                "author": {"name": "Bhumit Patel", "date": "2026-10-16T18:00:00Z"}
            },
            "html_url": "https://github.com/bhumit9744/dypdyp/commit/a1b2c3d4e5f67890",
            "author": {"login": "bhumit9744"}
        }
    ]
    issues_payload = [
        {
            "id": 101,
            "number": 1,
            "title": "Enable automated CI pipeline",
            "state": "open",
            "user": {"login": "bhumit9744"},
            "html_url": "https://github.com/bhumit9744/dypdyp/issues/1"
        }
    ]
    workflows_payload = {
        "workflow_runs": [
            {
                "id": 888,
                "name": "Continuous Integration",
                "head_branch": "main",
                "status": "completed",
                "conclusion": "success",
                "run_number": 42,
                "html_url": "https://github.com/bhumit9744/dypdyp/actions/runs/888"
            }
        ]
    }

    def mock_handler(req):
        if req.url.path.endswith("/commits"):
            return httpx.Response(status_code=200, json=commits_payload)
        elif req.url.path.endswith("/issues"):
            return httpx.Response(status_code=200, json=issues_payload)
        elif req.url.path.endswith("/actions/runs"):
            return httpx.Response(status_code=200, json=workflows_payload)
        return httpx.Response(status_code=200, json=repo_payload)

    mock_transport = httpx.MockTransport(mock_handler)

    with _make_client_patch(mock_transport):
        res = jarvis_agent.process_command("What is the current status of my repository?")

        assert res["plugin"] == "github"
        assert res["action_executed"] == "github_status_retrieved"
        response_text = res["response"]

        # Cites actual source URLs
        assert "https://github.com/bhumit9744/dypdyp" in response_text
        assert "https://github.com/bhumit9744/dypdyp/commit/a1b2c3d4e5f67890" in response_text
        assert "https://github.com/bhumit9744/dypdyp/actions/runs/888" in response_text

        # Contains commit and workflow details
        assert "feat(integrations): add GitHub connector" in response_text
        assert "Continuous Integration #42" in response_text
        assert "Verified live via GitHub REST API" in response_text


def test_jarvis_github_status_query_tool_failure_handling():
    mock_transport = httpx.MockTransport(lambda req: httpx.Response(
        status_code=401,
        json={"message": "Bad credentials"}
    ))

    with _make_client_patch(mock_transport):
        res = jarvis_agent.process_command("What is the repository status?")

        assert res["plugin"] == "github"
        assert res["action_executed"] == "github_query_failed"
        assert "GitHub Verification Issue" in res["response"]
        assert "no repository status or build results are fabricated" in res["response"]


# ---------------------------------------------------------------------------
# 12. Optional Live API Smoke Test (Only if valid GITHUB_TOKEN in env)
# ---------------------------------------------------------------------------

def test_live_github_api_smoke_test():
    """
    Executes against the real live GitHub REST API ONLY if a non-placeholder
    GITHUB_TOKEN is configured in the environment. Otherwise skips gracefully.
    """
    real_token = os.getenv("GITHUB_TOKEN") or settings.clean_github_token
    if not real_token or real_token.startswith("your_") or len(real_token) < 15:
        pytest.skip("No real GITHUB_TOKEN configured; skipping live provider smoke test.")

    connector = GitHubConnector()
    result = asyncio.run(connector.test_connection(
        credentials={"token": real_token},
        config={"repository": settings.clean_github_repository}
    ))
    assert result.latency_ms > 0
    assert result.status in (IntegrationStatus.CONNECTED, IntegrationStatus.EXPIRED, IntegrationStatus.ERROR)
