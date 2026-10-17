"""
Comprehensive Automated Tests for Vapi Voice Assistant & Webhook Tool Bridge.
Tests public config, webhook secret authentication, allowlisted function calling,
provenance preservation, and rejection of unauthorized or fabricated claims.
"""

import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock

from app.main import app
from app.core.config import settings
from app.services.vapi_service import vapi_service, VAPI_TOOL_DEFINITIONS, VAPI_JARVIS_SYSTEM_PROMPT


client = TestClient(app)


def test_vapi_public_config_endpoint():
    """Verify GET /api/v1/jarvis/vapi/config returns safe public configuration."""
    res = client.get("/api/v1/jarvis/vapi/config")
    assert res.status_code == 200
    data = res.json()
    assert "configured" in data
    assert "system_prompt" in data
    assert "tools_count" in data
    assert data["tools_count"] == 10
    assert "private_key" not in data
    assert "server_secret" not in data


def test_vapi_tools_catalog_endpoint():
    """Verify GET /api/v1/jarvis/vapi/tools returns all 10 allowlisted function schemas."""
    res = client.get("/api/v1/jarvis/vapi/tools")
    assert res.status_code == 200
    data = res.json()
    assert data["count"] == 10
    names = [t["function"]["name"] for t in data["tools"]]
    expected_tools = [
        "get_connected_integrations",
        "get_project_status",
        "get_recent_github_activity",
        "get_failed_workflows",
        "get_upcoming_calendar_events",
        "search_authorized_drive_files",
        "search_authorized_emails",
        "get_deployment_status",
        "search_saved_opportunities",
        "get_placement_progress",
    ]
    for expected in expected_tools:
        assert expected in names


def test_vapi_webhook_secret_enforcement():
    """Verify that when VAPI_SERVER_SECRET is set, requests without matching header are rejected."""
    with patch.object(settings, "VAPI_SERVER_SECRET", "super_secure_webhook_secret_123"):
        # Without header
        res_no_header = client.post(
            "/api/v1/jarvis/vapi/webhook",
            json={"message": {"type": "status-update"}},
        )
        assert res_no_header.status_code == 401

        # With wrong header
        res_wrong = client.post(
            "/api/v1/jarvis/vapi/webhook",
            headers={"x-vapi-secret": "wrong_secret"},
            json={"message": {"type": "status-update"}},
        )
        assert res_wrong.status_code == 401

        # With valid header
        res_valid = client.post(
            "/api/v1/jarvis/vapi/webhook",
            headers={"x-vapi-secret": "super_secure_webhook_secret_123"},
            json={"message": {"type": "status-update"}},
        )
        assert res_valid.status_code == 200
        assert res_valid.json()["status"] == "received"


def test_vapi_webhook_tool_call_get_connected_integrations():
    """Test webhook tool call for get_connected_integrations."""
    payload = {
        "message": {
            "type": "tool-calls",
            "toolCalls": [
                {
                    "id": "call_integrations_1",
                    "type": "function",
                    "function": {
                        "name": "get_connected_integrations",
                        "arguments": {},
                    },
                }
            ],
        }
    }
    res = client.post("/api/v1/jarvis/vapi/webhook", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert "results" in data
    assert len(data["results"]) == 1
    call_res = data["results"][0]
    assert call_res["toolCallId"] == "call_integrations_1"
    res_data = call_res["result"]
    assert res_data["source"] == "Placement Hub Integration Registry"
    assert "retrieval_timestamp" in res_data
    assert "integrations" in res_data
    providers = [i["provider"] for i in res_data["integrations"]]
    assert "github" in providers
    assert "google_workspace" in providers


def test_vapi_webhook_tool_call_get_placement_progress():
    """Test webhook tool call for get_placement_progress."""
    payload = {
        "message": {
            "type": "tool-calls",
            "toolCalls": [
                {
                    "id": "call_progress_1",
                    "type": "function",
                    "function": {
                        "name": "get_placement_progress",
                        "arguments": {"student_id": "std_current_user"},
                    },
                }
            ],
        }
    }
    res = client.post("/api/v1/jarvis/vapi/webhook", json=payload)
    assert res.status_code == 200
    call_res = res.json()["results"][0]
    assert call_res["toolCallId"] == "call_progress_1"
    output = call_res["result"]
    assert output["source"] == "Placement Hub Student Database"
    assert "student" in output
    assert "skills" in output
    assert "applications" in output
    assert "resume" in output


def test_vapi_webhook_tool_call_search_saved_opportunities():
    """Test webhook tool call for search_saved_opportunities with provenance."""
    payload = {
        "message": {
            "type": "tool-calls",
            "toolCalls": [
                {
                    "id": "call_opps_1",
                    "type": "function",
                    "function": {
                        "name": "search_saved_opportunities",
                        "arguments": {"limit": 3},
                    },
                }
            ],
        }
    }
    res = client.post("/api/v1/jarvis/vapi/webhook", json=payload)
    assert res.status_code == 200
    call_res = res.json()["results"][0]
    output = call_res["result"]
    assert output["source"] == "Placement Hub Opportunities Intelligence"
    assert "retrieval_timestamp" in output
    assert "opportunities" in output


def test_vapi_webhook_tool_call_disconnected_providers():
    """Verify that disconnected providers return structured not_connected status instead of fabrications."""
    for tool_name in ["get_upcoming_calendar_events", "search_authorized_drive_files", "get_deployment_status"]:
        payload = {
            "message": {
                "type": "tool-calls",
                "toolCalls": [
                    {
                        "id": f"call_{tool_name}",
                        "type": "function",
                        "function": {
                            "name": tool_name,
                            "arguments": {"query": "test"},
                        },
                    }
                ],
            }
        }
        res = client.post("/api/v1/jarvis/vapi/webhook", json=payload)
        assert res.status_code == 200
        output = res.json()["results"][0]["result"]
        assert "status" in output
        assert output["status"] == "not_connected"
        assert "setup_instructions" in output
        assert "retrieval_timestamp" in output


def test_vapi_webhook_rejects_unallowlisted_tool():
    """Verify that unauthorized or arbitrary tool names are strictly rejected."""
    payload = {
        "message": {
            "type": "tool-calls",
            "toolCalls": [
                {
                    "id": "call_hack_1",
                    "type": "function",
                    "function": {
                        "name": "execute_shell_command",
                        "arguments": {"command": "rm -rf /"},
                    },
                }
            ],
        }
    }
    res = client.post("/api/v1/jarvis/vapi/webhook", json=payload)
    assert res.status_code == 200
    output = res.json()["results"][0]["result"]
    assert output["status"] == "error"
    assert "not in the allowlisted Placement Hub Vapi function registry" in output["error"]


def test_vapi_webhook_lifecycle_events():
    """Verify that standard Vapi lifecycle events (transcript, speech-update, etc.) are safely acknowledged."""
    for ev in ["status-update", "speech-update", "transcript", "conversation-update", "end-of-call-report"]:
        res = client.post("/api/v1/jarvis/vapi/webhook", json={"message": {"type": ev}})
        assert res.status_code == 200
        assert res.json()["status"] == "received"
