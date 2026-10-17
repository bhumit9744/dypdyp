"""
Placement Hub Integrations Package
Provider-neutral connector framework with typed errors and bounded retries.
"""

from .base import (
    BaseConnector,
    ConnectorError,
    ConnectorAuthError,
    ConnectorPermissionError,
    ConnectorRateLimitError,
    ConnectorTimeoutError,
    ConnectorNotFoundError,
    ConnectorNetworkError,
    IntegrationStatus,
    ProviderMetadata,
    VerificationResult,
)

__all__ = [
    "BaseConnector",
    "ConnectorError",
    "ConnectorAuthError",
    "ConnectorPermissionError",
    "ConnectorRateLimitError",
    "ConnectorTimeoutError",
    "ConnectorNotFoundError",
    "ConnectorNetworkError",
    "IntegrationStatus",
    "ProviderMetadata",
    "VerificationResult",
]
