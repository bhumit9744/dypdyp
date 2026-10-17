import os
from pathlib import Path
from urllib.parse import urlparse
from typing import List, Optional
from pydantic_settings import BaseSettings, SettingsConfigDict

# Base backend directory: /home/iamironman/dypdyp/backend
BASE_DIR = Path(__file__).resolve().parent.parent.parent

class Settings(BaseSettings):
    PROJECT_NAME: str = "Placement Hub API"
    VERSION: str = "1.0.0"
    ENVIRONMENT: str = "development"
    DATABASE_URL: str = "sqlite:///./placement_hub.db"
    
    # AI Provider Configuration (Loaded strictly from backend/.env)
    GEMINI_API_KEY: str = ""
    GEMINI_PROJECT_ID: str = "placement-hub-primary"
    GOOGLE_API_KEY: str = ""
    GEMINI_MODEL: str = "gemini-3.5-flash-lite"

    # Multi-project failover credentials
    GEMINI_API_KEY_2: str = ""
    GEMINI_PROJECT_ID_2: str = ""
    GEMINI_API_KEY_3: str = ""
    GEMINI_PROJECT_ID_3: str = ""
    GEMINI_CREDENTIALS: str = ""  # Optional JSON string of [{"api_key": "...", "project_id": "...", "alias": "..."}]

    ANTHROPIC_API_KEY: str = ""
    ANTHROPIC_BASE_URL: str = ""
    ANTHROPIC_MODEL: str = "claude-3-5-sonnet-20241022"

    # Optional OpenJarvis Local Service Configuration
    OPENJARVIS_ENABLED: bool = False
    OPENJARVIS_BASE_URL: str = "http://127.0.0.1:8008"
    OPENJARVIS_API_KEY: str = "jarvis_local_interview_token_987"
    OPENJARVIS_MODEL: str = "openjarvis-interview-model"
    # Vapi Conversational Voice Agent Configuration
    VAPI_PUBLIC_KEY: str = ""
    VAPI_PRIVATE_KEY: str = ""
    VAPI_ASSISTANT_ID: str = ""
    VAPI_SERVER_SECRET: str = ""

    # Integration Center Providers (Read-only, credential-sanitized)
    GITHUB_TOKEN: Optional[str] = None
    GITHUB_REPOSITORY: str = "bhumit9744/dypdyp"

    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173"
    ]

    model_config = SettingsConfigDict(
        env_file=(str(BASE_DIR / ".env"), ".env"),
        extra="allow",
        case_sensitive=False
    )

    @property
    def clean_openjarvis_base_url(self) -> str:
        return (self.OPENJARVIS_BASE_URL or "http://127.0.0.1:8008").strip().rstrip('/')

    @property
    def clean_openjarvis_api_key(self) -> str:
        return (self.OPENJARVIS_API_KEY or "").strip()

    @property
    def clean_vapi_public_key(self) -> str:
        return (self.VAPI_PUBLIC_KEY or "").strip().strip("'").strip('"')

    @property
    def clean_vapi_private_key(self) -> str:
        return (self.VAPI_PRIVATE_KEY or "").strip().strip("'").strip('"')

    @property
    def clean_vapi_assistant_id(self) -> str:
        return (self.VAPI_ASSISTANT_ID or "").strip().strip("'").strip('"')

    @property
    def clean_vapi_server_secret(self) -> str:
        return (self.VAPI_SERVER_SECRET or "").strip().strip("'").strip('"')

    @property
    def clean_gemini_api_key(self) -> str:
        """Returns whitespace- and quote-stripped Gemini API key without leaking it."""
        val = (self.GEMINI_API_KEY or self.GOOGLE_API_KEY or "").strip().strip("'").strip('"')
        return val

    @property
    def clean_gemini_model(self) -> str:
        """Returns normalized Gemini model name."""
        val = (self.GEMINI_MODEL or "gemini-3.5-flash-lite").strip().strip("'").strip('"')
        if val.startswith("models/"):
            val = val[7:]
        return val or "gemini-3.5-flash-lite"

    @property
    def configured_gemini_credentials(self) -> List[dict]:
        """
        Parses all explicitly configured Gemini credentials and their associated Google Cloud projects.
        Ensures keys are validated and linked to unique project IDs.
        """
        creds: List[dict] = []
        # 1. Parse JSON credentials if provided
        if self.GEMINI_CREDENTIALS:
            try:
                import json
                parsed = json.loads(self.GEMINI_CREDENTIALS)
                if isinstance(parsed, list):
                    for idx, c in enumerate(parsed):
                        k = (c.get("api_key") or "").strip().strip("'").strip('"')
                        if k and not k.startswith("your_") and len(k) >= 10:
                            p_id = (c.get("project_id") or f"project-{idx+1}").strip()
                            creds.append({
                                "api_key": k,
                                "project_id": p_id,
                                "alias": c.get("alias") or f"project-{idx+1}",
                                "priority": c.get("priority", idx + 1)
                            })
            except Exception:
                pass

        # 2. Check individual key/project pairs
        pairs = [
            (self.GEMINI_API_KEY or self.GOOGLE_API_KEY, self.GEMINI_PROJECT_ID or "placement-hub-primary", "primary", 1),
            (self.GEMINI_API_KEY_2, self.GEMINI_PROJECT_ID_2 or "placement-hub-backup", "backup-1", 2),
            (self.GEMINI_API_KEY_3, self.GEMINI_PROJECT_ID_3 or "placement-hub-tertiary", "backup-2", 3),
        ]

        for key, proj, alias, prio in pairs:
            clean_k = (key or "").strip().strip("'").strip('"')
            if clean_k and not clean_k.startswith("your_") and len(clean_k) >= 10:
                clean_proj = (proj or "").strip() or f"project-{alias}"
                if not any(c["api_key"] == clean_k for c in creds):
                    creds.append({
                        "api_key": clean_k,
                        "project_id": clean_proj,
                        "alias": alias,
                        "priority": prio
                    })
        return creds

    @property
    def has_gemini_credential(self) -> bool:
        """Checks if at least one valid non-placeholder Gemini API key is configured."""
        return len(self.configured_gemini_credentials) > 0

    @property
    def clean_anthropic_api_key(self) -> str:
        """Returns whitespace- and quote-stripped API key without leaking it."""
        val = (self.ANTHROPIC_API_KEY or "").strip().strip("'").strip('"')
        return val

    @property
    def clean_anthropic_base_url(self) -> str:
        """
        Returns normalized custom base URL without trailing slash or duplicate /v1 suffix.
        Returns empty string if official Anthropic API is targeted.
        """
        val = (self.ANTHROPIC_BASE_URL or "").strip().strip("'").strip('"').rstrip('/')
        if not val:
            return ""
        # Strip trailing /v1 because Anthropic SDK automatically appends /v1/messages
        if val.endswith('/v1'):
            val = val[:-3].rstrip('/')
        return val

    @property
    def effective_base_url(self) -> str:
        """Effective base URL: custom provider if set, otherwise official Anthropic URL."""
        return self.clean_anthropic_base_url or "https://api.anthropic.com"

    @property
    def provider_hostname(self) -> str:
        """Safe hostname of the selected AI provider (e.g. 'theclaudeapi.com' or 'api.anthropic.com')."""
        parsed = urlparse(self.effective_base_url)
        return parsed.netloc or "api.anthropic.com"

    @property
    def provider_endpoint_path(self) -> str:
        """Target messages endpoint path on the configured host (e.g. '/api/public/v1/messages')."""
        parsed = urlparse(self.effective_base_url)
        prefix = parsed.path.rstrip('/')
        return f"{prefix}/v1/messages" if prefix else "/v1/messages"

    @property
    def clean_github_token(self) -> str:
        """Returns whitespace- and quote-stripped GitHub token without logging or leaking it."""
        val = (self.GITHUB_TOKEN or "").strip().strip("'").strip('"')
        return val

    @property
    def clean_github_repository(self) -> str:
        """Returns normalized target GitHub repository, defaulting to 'bhumit9744/dypdyp'."""
        val = (self.GITHUB_REPOSITORY or "bhumit9744/dypdyp").strip().strip("'").strip('"')
        return val or "bhumit9744/dypdyp"

    @property
    def is_custom_provider(self) -> bool:
        """Whether a custom third-party base URL is actively configured."""
        return bool(self.clean_anthropic_base_url)

settings = Settings()
