"""
Provider-neutral connector base interface, typed errors, and metadata definitions.
Enforces read-only contracts, credential validation, bounded retries, and normalized responses.
"""

from __future__ import annotations

import abc
import asyncio
import datetime
import logging
from enum import Enum
from typing import Any, Callable, Coroutine, Dict, List, Optional, TypeVar
from pydantic import BaseModel, Field

logger = logging.getLogger("integrations.base")

T = TypeVar("T")


# ---------------------------------------------------------------------------
# Status & Capability Enums
# ---------------------------------------------------------------------------

class IntegrationStatus(str, Enum):
    NOT_CONNECTED = "Not connected"
    CONNECTING = "Connecting"
    CONNECTED = "Connected"
    EXPIRED = "Expired"
    DEGRADED = "Degraded"
    ERROR = "Error"


class ConnectorCapability(str, Enum):
    READ_ACCOUNT = "READ_ACCOUNT"
    READ_REPO = "READ_REPO"
    READ_COMMITS = "READ_COMMITS"
    READ_ISSUES = "READ_ISSUES"
    READ_WORKFLOW_RUNS = "READ_WORKFLOW_RUNS"
    READ_CALENDAR = "READ_CALENDAR"
    READ_MAILS = "READ_MAILS"
    READ_DEPLOYMENTS = "READ_DEPLOYMENTS"
    READ_DATABASE = "READ_DATABASE"


# ---------------------------------------------------------------------------
# Typed Custom Exceptions
# ---------------------------------------------------------------------------

class ConnectorError(Exception):
    """Base exception for all integration connector failures."""

    def __init__(
        self,
        message: str,
        provider: str,
        status_code: Optional[int] = None,
        details: Optional[Dict[str, Any]] = None,
    ):
        super().__init__(message)
        self.message = message
        self.provider = provider
        self.status_code = status_code
        self.details = details or {}


class ConnectorAuthError(ConnectorError):
    """Raised when authentication fails (HTTP 401 or invalid token/key)."""
    pass


class ConnectorPermissionError(ConnectorError):
    """Raised when credentials lack necessary scopes or permissions (HTTP 403)."""
    pass


class ConnectorRateLimitError(ConnectorError):
    """Raised when provider rate limits are exceeded (HTTP 429 or HTTP 403 rate-limit)."""

    def __init__(
        self,
        message: str,
        provider: str,
        reset_timestamp: Optional[int] = None,
        status_code: Optional[int] = 429,
        details: Optional[Dict[str, Any]] = None,
    ):
        super().__init__(message, provider, status_code, details)
        self.reset_timestamp = reset_timestamp


class ConnectorTimeoutError(ConnectorError):
    """Raised when provider request times out."""
    pass


class ConnectorNotFoundError(ConnectorError):
    """Raised when requested resource or repository is not found (HTTP 404)."""
    pass


class ConnectorNetworkError(ConnectorError):
    """Raised when provider returns 5xx or connection cannot be established."""
    pass


# ---------------------------------------------------------------------------
# Normalized Metadata & Result Schemas
# ---------------------------------------------------------------------------

class ProviderMetadata(BaseModel):
    id: str
    name: str
    description: str
    category: str
    icon: str
    capabilities: List[str]
    docs_url: str
    is_read_only: bool = True
    setup_guide: Optional[str] = None


class VerificationResult(BaseModel):
    success: bool
    status: IntegrationStatus
    latency_ms: float = 0.0
    verified_at: datetime.datetime = Field(default_factory=datetime.datetime.utcnow)
    account_id: Optional[str] = None
    account_name: Optional[str] = None
    account_avatar: Optional[str] = None
    repository: Optional[str] = None
    scopes: List[str] = Field(default_factory=list)
    rate_limit_info: Dict[str, Any] = Field(default_factory=dict)
    error: Optional[str] = None
    raw_details: Dict[str, Any] = Field(default_factory=dict)


# ---------------------------------------------------------------------------
# Base Connector Interface
# ---------------------------------------------------------------------------

class BaseConnector(abc.ABC):
    """
    Abstract base class for all Placement Hub third-party provider connectors.
    Guarantees consistent verification, error classification, bounded retry logic,
    and credential sanitization across providers.
    """

    MAX_RETRIES = 2
    BACKOFF_FACTOR = 0.4
    REQUEST_TIMEOUT_SECONDS = 10.0

    @property
    @abc.abstractmethod
    def provider_id(self) -> str:
        """Unique machine identifier for the provider (e.g. 'github')."""
        pass

    @property
    @abc.abstractmethod
    def metadata(self) -> ProviderMetadata:
        """User-facing metadata and capability declarations."""
        pass

    @abc.abstractmethod
    def validate_config(self, config: Dict[str, Any]) -> Dict[str, Any]:
        """
        Validates provider configuration arguments (e.g. repo name).
        Raises ValueError if arguments are malformed or invalid.
        """
        pass

    @abc.abstractmethod
    async def test_connection(
        self,
        credentials: Dict[str, Any],
        config: Optional[Dict[str, Any]] = None,
    ) -> VerificationResult:
        """
        Executes a real, live authenticated request against the provider API.
        Never infers connection status from configuration existence alone.
        """
        pass

    async def execute_with_bounded_retry(
        self,
        operation: Callable[[], Coroutine[Any, Any, T]],
        operation_name: str = "request",
    ) -> T:
        """
        Executes an async API operation with bounded retries for transient failures.
        Never retries 401 (AuthError), 403 (Permission/RateLimit), or 404 (NotFoundError).
        """
        last_exception: Optional[Exception] = None

        for attempt in range(self.MAX_RETRIES + 1):
            try:
                return await operation()
            except (ConnectorAuthError, ConnectorPermissionError, ConnectorRateLimitError, ConnectorNotFoundError) as e:
                # Terminal client errors: do not retry
                raise e
            except (ConnectorTimeoutError, ConnectorNetworkError) as e:
                last_exception = e
                if attempt < self.MAX_RETRIES:
                    delay = self.BACKOFF_FACTOR * (2 ** attempt)
                    logger.warning(
                        f"[{self.provider_id}] {operation_name} transient failure (attempt {attempt + 1}/{self.MAX_RETRIES + 1}): {e}. Retrying in {delay:.2f}s..."
                    )
                    await asyncio.sleep(delay)
                else:
                    logger.error(
                        f"[{self.provider_id}] {operation_name} exhausted all {self.MAX_RETRIES + 1} attempts."
                    )
                    raise e
            except Exception as e:
                last_exception = e
                if attempt < self.MAX_RETRIES:
                    delay = self.BACKOFF_FACTOR * (2 ** attempt)
                    logger.warning(
                        f"[{self.provider_id}] {operation_name} unexpected failure (attempt {attempt + 1}): {e}. Retrying..."
                    )
                    await asyncio.sleep(delay)
                else:
                    raise ConnectorNetworkError(
                        f"Unexpected error executing {operation_name}: {str(e)}",
                        provider=self.provider_id,
                        details={"error_type": type(e).__name__},
                    )

        if last_exception:
            raise last_exception
        raise ConnectorError(f"Failed to execute {operation_name}", provider=self.provider_id)
