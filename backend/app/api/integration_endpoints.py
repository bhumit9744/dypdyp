"""
FastAPI Router for Placement Hub Integration Center.
Provides endpoints for listing integrations, connecting with live verification,
testing connections, refreshing telemetry, disconnecting, and querying live GitHub data.
Tokens are strictly sanitized and never returned in client responses.
"""

from __future__ import annotations

import logging
from typing import Any, Dict, List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.integrations.base import (
    ConnectorAuthError,
    ConnectorError,
    ConnectorNetworkError,
    ConnectorNotFoundError,
    ConnectorPermissionError,
    ConnectorRateLimitError,
    ConnectorTimeoutError,
)
from app.integrations.manager import integration_manager

logger = logging.getLogger("api.integrations")

router = APIRouter(prefix="/integrations", tags=["Integrations"])


# ---------------------------------------------------------------------------
# Pydantic Request & Response Schemas
# ---------------------------------------------------------------------------

class ConnectRequest(BaseModel):
    token: Optional[str] = Field(default=None, description="Personal Access Token or API Key. Redacted on output.")
    repository: Optional[str] = Field(default=None, description="Target repository, e.g. 'bhumit9744/dypdyp'.")


class ProviderCardResponse(BaseModel):
    id: str
    name: str
    description: str
    category: str
    icon: str
    capabilities: List[str]
    docs_url: str
    is_read_only: bool = True
    setup_guide: Optional[str] = None
    status: str
    account_name: Optional[str] = None
    account_avatar: Optional[str] = None
    repository: Optional[str] = None
    scopes: List[str] = Field(default_factory=list)
    last_verified_at: Optional[str] = None
    last_error: Optional[str] = None
    rate_limit_info: Dict[str, Any] = Field(default_factory=dict)


# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------

@router.get("", response_model=List[ProviderCardResponse])
def list_integrations(db: Session = Depends(get_db)):
    """
    Returns all 5 integration provider cards with live status, verified account metadata,
    and freshness timestamps. Credentials/tokens are strictly redacted and never returned.
    """
    try:
        cards = integration_manager.get_all_cards(db)
        return cards
    except Exception as e:
        logger.error(f"Error fetching integration cards: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Unable to load integrations: {str(e)}",
        )


@router.post("/{provider}/connect")
async def connect_integration(
    provider: str,
    payload: ConnectRequest,
    db: Session = Depends(get_db),
):
    """
    Connects a provider. Performs a real live authenticated verification call
    against the provider API before saving 'Connected' status.
    Never infers connection from configuration existence alone.
    """
    try:
        result = await integration_manager.connect_provider(
            provider_id=provider,
            token=payload.token,
            repository=payload.repository,
            db=db,
        )
        if not result.get("success"):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=result.get("error") or "Connection verification failed.",
            )
        return result
    except HTTPException:
        raise
    except ValueError as ve:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(ve))
    except Exception as ex:
        logger.error(f"Unexpected error connecting {provider}: {ex}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to connect {provider}: {str(ex)}",
        )


@router.post("/{provider}/test")
async def test_integration(
    provider: str,
    db: Session = Depends(get_db),
):
    """
    Executes an on-demand live health verification against the provider API.
    Updates the database with the real verification result, latency, and rate-limit metadata.
    """
    try:
        result = await integration_manager.test_connection(provider_id=provider, db=db)
        return result
    except ValueError as ve:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(ve))
    except Exception as ex:
        logger.error(f"Error testing {provider}: {ex}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to test {provider}: {str(ex)}",
        )


@router.post("/{provider}/refresh")
async def refresh_integration(
    provider: str,
    db: Session = Depends(get_db),
):
    """Refreshes connection status and rate limit telemetry."""
    return await test_integration(provider=provider, db=db)


@router.post("/{provider}/disconnect")
def disconnect_integration(
    provider: str,
    db: Session = Depends(get_db),
):
    """
    Disconnects the provider, purges saved credentials, and resets status to 'Not connected'.
    """
    try:
        return integration_manager.disconnect_provider(provider_id=provider, db=db)
    except Exception as ex:
        logger.error(f"Error disconnecting {provider}: {ex}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to disconnect {provider}: {str(ex)}",
        )


@router.get("/github/data")
async def get_github_repository_data(
    repository: Optional[str] = Query(None, description="Repository in 'owner/repo' format"),
    commits_limit: int = Query(10, ge=1, le=30, description="Max commits to return"),
    issues_limit: int = Query(10, ge=1, le=30, description="Max issues and PRs to return"),
    workflows_limit: int = Query(10, ge=1, le=30, description="Max workflow runs to return"),
    db: Session = Depends(get_db),
):
    """
    Fetches real live GitHub telemetry: repository metadata, recent commits,
    open issues and PRs, and GitHub Actions workflow runs with direct source URLs.
    """
    try:
        data = await integration_manager.get_github_data(
            db=db,
            repository=repository,
            commits_limit=commits_limit,
            issues_limit=issues_limit,
            workflows_limit=workflows_limit,
        )
        return data
    except ConnectorAuthError as ae:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=ae.message,
        )
    except ConnectorPermissionError as pe:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=pe.message,
        )
    except ConnectorRateLimitError as rle:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail=rle.message,
        )
    except ConnectorNotFoundError as nfe:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=nfe.message,
        )
    except (ConnectorTimeoutError, ConnectorNetworkError) as ne:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=ne.message,
        )
    except ValueError as ve:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(ve),
        )
    except Exception as ex:
        logger.error(f"Unexpected error loading GitHub data: {ex}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Unable to retrieve GitHub data: {str(ex)}",
        )
