"""
Vapi Webhook & Tool Execution Endpoints for Placement Hub Jarvis Voice Assistant.
Handles real-time server-side function execution for Vapi calls following the official Vapi protocol.
"""

from __future__ import annotations

import json
import logging
from typing import Any, Dict, List, Optional
from fastapi import APIRouter, Depends, Header, HTTPException, Request, Response, status
from pydantic import BaseModel, Field

from app.core.config import settings
from app.services.vapi_service import (
    vapi_service,
    VAPI_TOOL_DEFINITIONS,
    VAPI_JARVIS_SYSTEM_PROMPT,
)

logger = logging.getLogger("api.vapi")

router = APIRouter(prefix="/jarvis/vapi", tags=["Vapi Voice Assistant"])


# ---------------------------------------------------------------------------
# Public Client Configuration Endpoint
# ---------------------------------------------------------------------------
@router.get("/config")
def get_vapi_client_config():
    """
    Returns public-safe Vapi configuration for the frontend Web SDK.
    Never exposes private keys, webhook secrets, or third-party tokens.
    """
    return vapi_service.get_public_config()


# ---------------------------------------------------------------------------
# Allowlisted Tool Catalog Endpoint
# ---------------------------------------------------------------------------
@router.get("/tools")
def get_allowlisted_tools():
    """Returns the allowlisted tool specifications in OpenAI/Vapi function calling schema."""
    return {
        "count": len(VAPI_TOOL_DEFINITIONS),
        "tools": VAPI_TOOL_DEFINITIONS,
        "system_prompt": VAPI_JARVIS_SYSTEM_PROMPT,
    }


# ---------------------------------------------------------------------------
# Official Vapi Webhook & Tool-Call Handler
# ---------------------------------------------------------------------------
@router.post("/webhook")
async def handle_vapi_webhook(
    request: Request,
    x_vapi_secret: Optional[str] = Header(None, alias="x-vapi-secret"),
):
    """
    Official Vapi Webhook endpoint for server-side function calling and call events.
    Verifies x-vapi-secret if configured in backend environment.
    Executes allowlisted tools with factual database and provider queries.
    Never hallucinates data or statuses when external APIs are disconnected.
    """
    # 1. Enforce Webhook Secret Authentication if configured
    configured_secret = settings.clean_vapi_server_secret
    if configured_secret:
        if not x_vapi_secret or x_vapi_secret.strip() != configured_secret:
            logger.warning("Rejected Vapi webhook request with invalid or missing x-vapi-secret header.")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Unauthorized: invalid or missing x-vapi-secret header.",
            )

    # 2. Parse request body safely
    try:
        raw_body = await request.body()
        if len(raw_body) > 1024 * 512:  # 512 KB request limit
            raise HTTPException(status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE, detail="Payload too large")
        body = json.loads(raw_body.decode("utf-8")) if raw_body else {}
    except json.JSONDecodeError:
        logger.error("Malformed JSON payload in Vapi webhook")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Malformed JSON body")

    # 3. Extract Message Structure
    message = body.get("message") or body
    msg_type = message.get("type", "")

    # Handle standard Vapi function calling events: 'tool-calls' or 'function-call'
    if msg_type in ("tool-calls", "function-call"):
        tool_calls = (
            message.get("toolCalls")
            or message.get("toolWithToolCallList")
            or message.get("toolCallList")
            or []
        )

        # Support single function-call payload structure as fallback
        if not tool_calls and "functionCall" in message:
            fc = message["functionCall"]
            tool_calls = [{
                "id": message.get("toolCallId") or "call_default",
                "type": "function",
                "function": {
                    "name": fc.get("name"),
                    "arguments": fc.get("parameters") or fc.get("arguments") or {},
                }
            }]

        results: List[Dict[str, Any]] = []

        for call in tool_calls:
            call_id = call.get("id") or call.get("toolCallId") or "call_unknown"
            fn = call.get("function") or {}
            fn_name = fn.get("name") or call.get("name") or ""
            fn_args = fn.get("arguments") or call.get("arguments") or call.get("parameters") or {}

            # Handle JSON string arguments if Vapi sent serialized JSON
            if isinstance(fn_args, str):
                try:
                    fn_args = json.loads(fn_args)
                except Exception:
                    fn_args = {}

            # Execute allowlisted tool safely
            try:
                tool_output = vapi_service.execute_tool(fn_name, fn_args)
            except Exception as ex:
                logger.error(f"Error executing tool '{fn_name}': {ex}", exc_info=True)
                tool_output = {
                    "status": "error",
                    "error": f"Internal execution failure executing tool '{fn_name}': {str(ex)}",
                    "source": "Placement Hub Vapi Bridge",
                }

            results.append({
                "toolCallId": call_id,
                "result": tool_output,
            })

        logger.info(f"Returning {len(results)} tool result(s) to Vapi.")
        return {"results": results}

    # Handle informative lifecycle events without error
    elif msg_type in (
        "status-update",
        "speech-update",
        "transcript",
        "conversation-update",
        "end-of-call-report",
        "hang",
    ):
        logger.debug(f"Received Vapi lifecycle event: {msg_type}")
        return {"status": "received", "event": msg_type}

    else:
        logger.debug(f"Acknowledged unrecognized Vapi event type: {msg_type}")
        return {"status": "ok", "type": msg_type}
