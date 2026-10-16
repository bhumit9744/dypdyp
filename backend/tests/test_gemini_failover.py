"""
Unit and Integration Tests for Google Gemini Provider Management and Failover Engine — Placement Hub

Tested Scenarios:
1. Multi-project configuration parsing & credential key redaction.
2. Rate limiting (429) bounded backoff with jitter and retry delay extraction.
3. Quota exhaustion (RESOURCE_EXHAUSTED) quarantine and failover to distinct healthy project.
4. Same-project quota boundary: multiple keys in the same project share quota/cooldown.
5. Permanent authentication & permission errors (401/403/API_KEY_INVALID) marked UNHEALTHY without infinite retries.
6. Transient 503 / timeout retries and cross-project failover.
7. Streaming safety boundary:
   - Error before first chunk: transparently fails over to backup project.
   - Error after transmission started: raises GeminiStreamInterruptedError (no restart, no duplicate text).
8. Idempotency tracking preventing duplicate turns or duplicate LLM operations.
9. Administrator diagnostics endpoints (/ai/provider-status, /interview/provider-status).
"""

import time
import pytest
from unittest.mock import patch, MagicMock
from fastapi.testclient import TestClient

from app.main import app
from app.core.config import Settings
from app.services.gemini_provider import (
    GeminiProviderManager,
    ProjectState,
    CredentialState,
    GeminiProviderError,
    GeminiAuthError,
    GeminiQuotaExhaustedError,
    GeminiRateLimitError,
    GeminiStreamInterruptedError,
    redact_key,
    sanitize_text,
    extract_retry_delay
)

client = TestClient(app)


# ---------------------------------------------------------------------------
# 1. Key Redaction & Sanitization Tests
# ---------------------------------------------------------------------------

def test_key_redaction_and_sanitization():
    """Verify keys are never exposed in logs, diagnostics, or error strings."""
    secret_key = "fake_test_key_sample_123456789_endpart"
    masked = redact_key(secret_key)
    assert secret_key not in masked
    assert masked.startswith("fake_tes")
    assert masked.endswith("ndpart")
    assert "..." in masked

    raw_err = f"Google API error on key {secret_key}: Quota exceeded for project."
    sanitized = sanitize_text(raw_err, known_keys=[secret_key])
    assert secret_key not in sanitized
    assert masked in sanitized


# ---------------------------------------------------------------------------
# 2. Multi-Project Configuration & Same-Project Quota Boundary
# ---------------------------------------------------------------------------

def test_multi_project_configuration_and_same_project_boundary():
    """
    Verify that:
    1. Credentials belonging to distinct projects are tracked separately.
    2. Multiple keys under the same project share that project's quota state.
    """
    mgr = GeminiProviderManager()
    mgr.projects.clear()

    # Configure 2 distinct projects
    mgr.projects["proj-alpha"] = ProjectState(
        project_id="proj-alpha",
        credentials=[
            CredentialState(api_key="key-alpha-1-secret-long", project_id="proj-alpha", alias="alpha-primary"),
            CredentialState(api_key="key-alpha-2-secret-long", project_id="proj-alpha", alias="alpha-secondary")
        ]
    )
    mgr.projects["proj-beta"] = ProjectState(
        project_id="proj-beta",
        credentials=[
            CredentialState(api_key="key-beta-1-secret-long", project_id="proj-beta", alias="beta-primary")
        ]
    )

    # When proj-alpha has quota exhausted, it must quarantine the ENTIRE project
    mgr.record_failure(
        mgr.projects["proj-alpha"],
        error_type="quota_exhausted",
        error_message="Resource has been exhausted (e.g. check quota).",
        is_transient=False,
        cooldown_seconds=300
    )

    assert mgr.projects["proj-alpha"].is_in_cooldown is True
    assert mgr.projects["proj-alpha"].status == "cooldown"
    assert mgr.projects["proj-alpha"].exhausted_quotas == 1

    # Project selection must now select proj-beta, NOT the second key of proj-alpha
    selected = mgr.select_healthy_project()
    assert selected is not None
    assert selected.project_id == "proj-beta"


# ---------------------------------------------------------------------------
# 3. Rate Limit (429) Bounded Backoff with Jitter & Retry Timing
# ---------------------------------------------------------------------------

def test_rate_limit_retry_timing_and_backoff():
    """Verify inspection of retry delay and backoff execution."""
    class MockRateLimitError(Exception):
        def __init__(self, msg, retry_delay=None):
            super().__init__(msg)
            self.code = 429
            self.message = msg
            if retry_delay:
                self.response = MagicMock(headers={"retry-after": str(retry_delay)})

    err_with_header = MockRateLimitError("Too Many Requests", retry_delay=3)
    parsed_delay = extract_retry_delay(err_with_header)
    assert parsed_delay == 3.0

    err_with_msg = Exception("Rate limit exceeded: please retry after 4.5s")
    parsed_msg_delay = extract_retry_delay(err_with_msg)
    assert parsed_msg_delay == 4.5

    # Test backoff and eventual success within project
    mgr = GeminiProviderManager()
    mgr.projects.clear()
    mgr.projects["proj-primary"] = ProjectState(
        project_id="proj-primary",
        credentials=[CredentialState(api_key="key-primary-12345678", project_id="proj-primary", alias="p1")]
    )

    attempts = 0
    def mock_call(client, model):
        nonlocal attempts
        attempts += 1
        if attempts < 2:
            raise MockRateLimitError("Rate limit exceeded, please retry in 0.05s")
        mock_resp = MagicMock()
        mock_resp.text = "Success after rate-limit backoff"
        return mock_resp

    with patch.object(mgr, "get_client_for_credential", return_value=MagicMock()):
        with patch("time.sleep", return_value=None):  # Avoid slowing down tests
            res = mgr.execute_with_failover(
                mock_call,
                max_retries_per_project=2,
                base_delay=0.01,
                jitter=0.0
            )
            assert res.text == "Success after rate-limit backoff"
            assert attempts == 2
            assert mgr.projects["proj-primary"].rate_limits == 1


# ---------------------------------------------------------------------------
# 4. Quota Exhaustion Quarantine & Cross-Project Failover
# ---------------------------------------------------------------------------

def test_quota_exhaustion_quarantine_and_failover():
    """
    Verify that when project 1 suffers quota exhaustion, it is quarantined in cooldown,
    does NOT retry project 1, and immediately fails over to healthy project 2.
    """
    mgr = GeminiProviderManager()
    mgr.projects.clear()
    mgr.projects["proj-1"] = ProjectState(
        project_id="proj-1",
        credentials=[CredentialState(api_key="key-proj-1-12345678", project_id="proj-1", alias="p1")]
    )
    mgr.projects["proj-2"] = ProjectState(
        project_id="proj-2",
        credentials=[CredentialState(api_key="key-proj-2-12345678", project_id="proj-2", alias="p2")]
    )

    call_records = []
    def mock_call(client, model):
        # Determine which project is calling
        if client == "client-1":
            call_records.append("proj-1")
            err = Exception("Resource has been exhausted (e.g. check quota).")
            setattr(err, "code", 429)
            raise err
        else:
            call_records.append("proj-2")
            mock_resp = MagicMock()
            mock_resp.text = "Success on backup project 2"
            return mock_resp

    def mock_get_client(api_key):
        if "proj-1" in api_key:
            return "client-1"
        return "client-2"

    with patch.object(mgr, "get_client_for_credential", side_effect=mock_get_client):
        res = mgr.execute_with_failover(mock_call)
        assert res.text == "Success on backup project 2"
        # Proj-1 was tried exactly once, then immediately quarantined, failing over to Proj-2
        assert call_records == ["proj-1", "proj-2"]
        assert mgr.projects["proj-1"].is_in_cooldown is True
        assert mgr.projects["proj-1"].status == "cooldown"
        assert mgr.projects["proj-2"].successful_requests == 1


# ---------------------------------------------------------------------------
# 5. Permanent Authentication / Permission Error Handling
# ---------------------------------------------------------------------------

def test_invalid_credential_marked_unhealthy_no_infinite_retry():
    """Verify 401/403/API_KEY_INVALID marks project unhealthy and fails over without infinite retries."""
    mgr = GeminiProviderManager()
    mgr.projects.clear()
    mgr.projects["proj-bad"] = ProjectState(
        project_id="proj-bad",
        credentials=[CredentialState(api_key="key-bad-12345678", project_id="proj-bad", alias="bad")]
    )
    mgr.projects["proj-good"] = ProjectState(
        project_id="proj-good",
        credentials=[CredentialState(api_key="key-good-12345678", project_id="proj-good", alias="good")]
    )

    call_records = []
    def mock_call(client, model):
        if client == "client-bad":
            call_records.append("proj-bad")
            err = Exception("API_KEY_INVALID: API key not valid. Please pass a valid API key.")
            setattr(err, "code", 401)
            raise err
        else:
            call_records.append("proj-good")
            resp = MagicMock()
            resp.text = "Success on valid credential"
            return resp

    def mock_get_client(api_key):
        return "client-bad" if "bad" in api_key else "client-good"

    with patch.object(mgr, "get_client_for_credential", side_effect=mock_get_client):
        res = mgr.execute_with_failover(mock_call)
        assert res.text == "Success on valid credential"
        assert call_records == ["proj-bad", "proj-good"]
        assert mgr.projects["proj-bad"].status == "unhealthy"
        assert mgr.projects["proj-bad"].credentials[0].is_valid is False


# ---------------------------------------------------------------------------
# 6. Transient 503 Server Error & Failover
# ---------------------------------------------------------------------------

def test_transient_503_retries_and_fails_over():
    """Verify 503 retries limited times on current project, then fails over to another eligible project."""
    mgr = GeminiProviderManager()
    mgr.projects.clear()
    mgr.projects["proj-down"] = ProjectState(
        project_id="proj-down",
        credentials=[CredentialState(api_key="key-down-12345678", project_id="proj-down", alias="down")]
    )
    mgr.projects["proj-up"] = ProjectState(
        project_id="proj-up",
        credentials=[CredentialState(api_key="key-up-12345678", project_id="proj-up", alias="up")]
    )

    call_counts = {"proj-down": 0, "proj-up": 0}
    def mock_call(client, model):
        if client == "client-down":
            call_counts["proj-down"] += 1
            err = Exception("503 The model is overloaded. Please try again later.")
            setattr(err, "code", 503)
            raise err
        else:
            call_counts["proj-up"] += 1
            resp = MagicMock()
            resp.text = "Healthy response from backup project"
            return resp

    def mock_get_client(api_key):
        return "client-down" if "down" in api_key else "client-up"

    with patch.object(mgr, "get_client_for_credential", side_effect=mock_get_client):
        with patch("time.sleep", return_value=None):
            res = mgr.execute_with_failover(mock_call, max_retries_per_project=1)
            assert res.text == "Healthy response from backup project"
            # 1 initial + 1 retry on proj-down, then failover to proj-up
            assert call_counts["proj-down"] == 2
            assert call_counts["proj-up"] == 1


# ---------------------------------------------------------------------------
# 7. Streaming Failure Safety Boundary Tests
# ---------------------------------------------------------------------------

def test_streaming_failover_before_first_chunk():
    """If an error happens BEFORE the first chunk is emitted, failover to backup project transparently."""
    mgr = GeminiProviderManager()
    mgr.projects.clear()
    mgr.projects["proj-stream-1"] = ProjectState(
        project_id="proj-stream-1",
        credentials=[CredentialState(api_key="key-stream1-12345678", project_id="proj-stream-1", alias="s1")]
    )
    mgr.projects["proj-stream-2"] = ProjectState(
        project_id="proj-stream-2",
        credentials=[CredentialState(api_key="key-stream2-12345678", project_id="proj-stream-2", alias="s2")]
    )

    def mock_stream(client, model):
        if client == "client-s1":
            err = Exception("Resource has been exhausted (quota limit).")
            setattr(err, "code", 429)
            raise err
        else:
            # Yield valid chunks from project 2
            chunk1 = MagicMock(text="Hello ")
            chunk2 = MagicMock(text="World!")
            return [chunk1, chunk2]

    def mock_get_client(api_key):
        return "client-s1" if "stream1" in api_key else "client-s2"

    with patch.object(mgr, "get_client_for_credential", side_effect=mock_get_client):
        chunks = list(mgr.stream_with_failover(mock_stream))
        assert "".join(chunks) == "Hello World!"
        assert mgr.projects["proj-stream-1"].is_in_cooldown is True
        assert mgr.projects["proj-stream-2"].successful_requests == 1


def test_streaming_interrupted_after_transmission_started_no_restart():
    """
    Once transmission has begun (chunk > 0), DO NOT restart generation from scratch
    (which would concatenate duplicate tokens). Must raise GeminiStreamInterruptedError.
    """
    mgr = GeminiProviderManager()
    mgr.projects.clear()
    mgr.projects["proj-stream-live"] = ProjectState(
        project_id="proj-stream-live",
        credentials=[CredentialState(api_key="key-stream-live-12345678", project_id="proj-stream-live", alias="live")]
    )

    def mock_stream_interrupted(client, model):
        # Generator yields first chunk, then crashes
        yield MagicMock(text="First chunk delivered. ")
        raise Exception("Connection reset by peer midway through response")

    with patch.object(mgr, "get_client_for_credential", return_value="client-live"):
        gen = mgr.stream_with_failover(mock_stream_interrupted)
        first_chunk = next(gen)
        assert first_chunk == "First chunk delivered. "

        with pytest.raises(GeminiStreamInterruptedError) as exc_info:
            next(gen)
        assert "Safe continuation unavailable" in str(exc_info.value) or "interrupted" in str(exc_info.value)


# ---------------------------------------------------------------------------
# 8. Idempotency Tracking Tests
# ---------------------------------------------------------------------------

def test_idempotency_tracking_prevents_duplicate_calls():
    """Verify that requests with the same request_id return cached result without hitting LLM twice."""
    mgr = GeminiProviderManager()
    mgr.projects.clear()
    mgr.projects["proj-idem"] = ProjectState(
        project_id="proj-idem",
        credentials=[CredentialState(api_key="key-idem-12345678", project_id="proj-idem", alias="idem")]
    )

    llm_invocations = 0
    def mock_call(client, model):
        nonlocal llm_invocations
        llm_invocations += 1
        resp = MagicMock()
        resp.text = f"Result #{llm_invocations}"
        return resp

    with patch.object(mgr, "get_client_for_credential", return_value=MagicMock()):
        res1 = mgr.execute_with_failover(mock_call, request_id="idemp-key-999")
        res2 = mgr.execute_with_failover(mock_call, request_id="idemp-key-999")
        assert res1.text == "Result #1"
        assert res2.text == "Result #1"
        # LLM must have been invoked exactly ONCE
        assert llm_invocations == 1


# ---------------------------------------------------------------------------
# 9. Administrator Diagnostics Endpoints Tests
# ---------------------------------------------------------------------------

def test_admin_diagnostics_endpoints():
    """Verify /api/v1/ai/provider-status and /api/v1/interview/provider-status return sanitized diagnostic metrics."""
    res_ai = client.get("/api/v1/ai/provider-status")
    assert res_ai.status_code == 200
    data_ai = res_ai.json()
    assert data_ai["service"] == "Google Gemini API Manager"
    assert "configured_projects_count" in data_ai
    assert "projects" in data_ai

    res_int = client.get("/api/v1/interview/provider-status")
    assert res_int.status_code == 200
    data_int = res_int.json()
    assert "projects" in data_int

    # Ensure no raw keys are ever returned
    for p in data_ai["projects"]:
        for c in p.get("credentials", []):
            assert "api_key" not in c
            assert "redacted_key" in c
            assert not c["redacted_key"].startswith("AIza")
            assert "..." in c["redacted_key"]
