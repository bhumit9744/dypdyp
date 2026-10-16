"""
Google Gemini Provider Manager & Multi-Project Failover Engine — Placement Hub

Core Guarantees:
1. Official Google Gen AI SDK (`google-genai`).
2. Multi-project credential configuration: tracks Google Cloud projects independently.
   Does not assume multiple keys within the same project increase quota.
3. Cooldowns, exponential backoff with jitter for transient 429 rate limits.
4. Quota exhaustion quarantine: prevents hammering an exhausted project.
5. Transient 503/timeout retries with graceful project-level failover.
6. Authentication & permission errors (401/403) marked unhealthy immediately (never infinite retries).
7. Zero key leakage: keys are strictly redacted in logs, exceptions, and diagnostics.
8. Streaming safety: fails over transparently before output begins; never duplicates
   output after streaming has started.
9. Idempotency-safe execution for interview turns and resume updates.
"""

import time
import math
import random
import logging
from typing import List, Dict, Any, Optional, Iterator, Callable, Set, Tuple
from dataclasses import dataclass, field
from pydantic import BaseModel, Field

from ..core.config import settings

logger = logging.getLogger("gemini_provider")

# ---------------------------------------------------------------------------
# Exceptions
# ---------------------------------------------------------------------------

class GeminiProviderError(Exception):
    """Base exception for Gemini provider operations."""
    def __init__(self, message: str, status_code: int = 502, project_id: Optional[str] = None):
        super().__init__(message)
        self.message = message
        self.status_code = status_code
        self.project_id = project_id

class GeminiAuthError(GeminiProviderError):
    def __init__(self, message: str = "Invalid or unauthenticated Google Gemini API key.", project_id: Optional[str] = None):
        super().__init__(message, status_code=401, project_id=project_id)

class GeminiQuotaExhaustedError(GeminiProviderError):
    def __init__(self, message: str = "Google Gemini quota exhausted for this project.", project_id: Optional[str] = None):
        super().__init__(message, status_code=429, project_id=project_id)

class GeminiRateLimitError(GeminiProviderError):
    def __init__(self, message: str = "Google Gemini rate limit reached. Please retry in a moment.", project_id: Optional[str] = None):
        super().__init__(message, status_code=429, project_id=project_id)

class GeminiUnsupportedModelError(GeminiProviderError):
    def __init__(self, message: str = "Requested Gemini model is not supported in this project.", project_id: Optional[str] = None):
        super().__init__(message, status_code=404, project_id=project_id)

class GeminiTimeoutError(GeminiProviderError):
    def __init__(self, message: str = "Google Gemini request timed out.", project_id: Optional[str] = None):
        super().__init__(message, status_code=504, project_id=project_id)

class GeminiStreamInterruptedError(GeminiProviderError):
    def __init__(self, message: str = "Streaming interrupted after transmission started. Safe continuation unavailable.", project_id: Optional[str] = None):
        super().__init__(message, status_code=502, project_id=project_id)


# ---------------------------------------------------------------------------
# Utility: Key Redaction
# ---------------------------------------------------------------------------

def redact_key(key: Optional[str]) -> str:
    """Returns a safe, masked representation of an API key (e.g. 'AQ.Ab8R...PCgetw')."""
    if not key:
        return "[NOT_CONFIGURED]"
    clean = key.strip().strip("'").strip('"')
    if len(clean) <= 8:
        return "[REDACTED_KEY]"
    return f"{clean[:8]}...{clean[-6:]}"


def sanitize_text(text: str, known_keys: Optional[List[str]] = None) -> str:
    """Removes any raw credential strings from text, logs, or error messages."""
    sanitized = text
    # Collect all known keys
    all_keys = list(known_keys or [])
    if settings.clean_gemini_api_key:
        all_keys.append(settings.clean_gemini_api_key)
    if settings.GEMINI_API_KEY_2:
        all_keys.append(settings.GEMINI_API_KEY_2.strip())
    if settings.GEMINI_API_KEY_3:
        all_keys.append(settings.GEMINI_API_KEY_3.strip())

    for k in set(all_keys):
        if k and len(k) >= 8 and k in sanitized:
            sanitized = sanitized.replace(k, redact_key(k))
    return sanitized


def extract_retry_delay(error: Exception) -> Optional[float]:
    """Inspects exception headers and error details for Google rate limit retry timings."""
    import re
    # Check response headers if present
    response = getattr(error, "response", None)
    if response:
        headers = getattr(response, "headers", {})
        if headers:
            retry_after = headers.get("retry-after") or headers.get("Retry-After")
            if retry_after:
                try:
                    return float(retry_after)
                except (ValueError, TypeError):
                    pass

    # Check error message strings for retry delays (e.g. "retry in 3.5s" or "quota reset in 5 seconds")
    err_str = str(error)
    match = re.search(r"(?:retry|reset|wait|backoff)[^\d]*(\d+(?:\.\d+)?)\s*(?:s|sec|seconds)?", err_str, re.IGNORECASE)
    if match:
        try:
            val = float(match.group(1))
            if 0 < val <= 60:
                return val
        except (ValueError, TypeError):
            pass
    return None


# ---------------------------------------------------------------------------
# Data Models: Project & Credential State
# ---------------------------------------------------------------------------

@dataclass
class CredentialState:
    api_key: str
    project_id: str
    alias: str
    priority: int = 1
    is_valid: bool = True
    last_error: Optional[str] = None

@dataclass
class ProjectState:
    project_id: str
    credentials: List[CredentialState] = field(default_factory=list)
    status: str = "healthy"  # "healthy", "degraded", "cooldown", "unhealthy"
    consecutive_failures: int = 0
    cooldown_until: Optional[float] = None
    last_error_type: Optional[str] = None
    last_error_message: Optional[str] = None
    last_error_time: Optional[float] = None
    total_requests: int = 0
    successful_requests: int = 0
    transient_retries: int = 0
    exhausted_quotas: int = 0
    rate_limits: int = 0

    @property
    def is_in_cooldown(self) -> bool:
        if self.cooldown_until is None:
            return False
        return time.time() < self.cooldown_until

    @property
    def remaining_cooldown_seconds(self) -> int:
        if not self.is_in_cooldown or self.cooldown_until is None:
            return 0
        return max(0, int(self.cooldown_until - time.time()))

    def get_valid_credential(self) -> Optional[CredentialState]:
        valid = [c for c in self.credentials if c.is_valid]
        return valid[0] if valid else None


# ---------------------------------------------------------------------------
# Provider Manager
# ---------------------------------------------------------------------------

class GeminiProviderManager:
    """
    Centralized Gemini Provider Manager supporting:
    - Multi-project health tracking and failover.
    - Rate limit exponential backoff with jitter.
    - Quota exhaustion quarantine.
    - Safe client caching.
    - Redacted diagnostics.
    """
    _instance = None

    def __init__(self):
        self.projects: Dict[str, ProjectState] = {}
        self._clients: Dict[str, Any] = {}
        self._idempotency_cache: Dict[str, Tuple[Any, float]] = {}
        self._initialized = False
        self.reload_configuration()

    @classmethod
    def get_instance(cls) -> "GeminiProviderManager":
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance

    def reload_configuration(self):
        """Loads and syncs credentials from environment settings."""
        creds_list = settings.configured_gemini_credentials
        existing_projects = dict(self.projects)
        self.projects.clear()

        for c in creds_list:
            proj_id = c["project_id"]
            if proj_id not in self.projects:
                # Retain stats if project previously existed
                old_state = existing_projects.get(proj_id)
                self.projects[proj_id] = ProjectState(
                    project_id=proj_id,
                    status=old_state.status if old_state and old_state.status != "unhealthy" else "healthy",
                    total_requests=old_state.total_requests if old_state else 0,
                    successful_requests=old_state.successful_requests if old_state else 0
                )
            
            cred = CredentialState(
                api_key=c["api_key"],
                project_id=proj_id,
                alias=c.get("alias", proj_id),
                priority=c.get("priority", 1)
            )
            self.projects[proj_id].credentials.append(cred)

        self._initialized = True
        logger.info(f"GeminiProviderManager initialized with {len(self.projects)} Google Cloud projects.")

    def get_known_keys(self) -> List[str]:
        keys = []
        for p in self.projects.values():
            for c in p.credentials:
                keys.append(c.api_key)
        return keys

    def get_client_for_credential(self, api_key: str):
        """Returns or creates a cached official google-genai Client."""
        if api_key in self._clients:
            return self._clients[api_key]
        try:
            from google import genai
            client = genai.Client(api_key=api_key)
            self._clients[api_key] = client
            return client
        except Exception as e:
            clean_err = sanitize_text(str(e), self.get_known_keys())
            raise GeminiProviderError(f"Failed to create Google Gen AI client: {clean_err}")

    def select_healthy_project(self, exclude_project_ids: Optional[Set[str]] = None) -> Optional[ProjectState]:
        """
        Selects the healthiest eligible project that is not in cooldown,
        not marked unhealthy, and not in the exclude list.
        """
        now = time.time()
        exclude = exclude_project_ids or set()
        eligible: List[ProjectState] = []

        for p_id, p in self.projects.items():
            if p_id in exclude:
                continue

            # Check if cooldown has expired
            if p.status == "cooldown" and p.cooldown_until and now >= p.cooldown_until:
                p.status = "healthy"
                p.cooldown_until = None
                p.consecutive_failures = 0
                logger.info(f"Cooldown expired for project '{p_id}'. Restored to healthy.")

            if p.status == "unhealthy":
                continue

            if p.is_in_cooldown:
                continue

            if not p.get_valid_credential():
                continue

            eligible.append(p)

        if not eligible:
            return None

        # Sort by: (status == 'healthy' first, then lowest consecutive failures, then highest success rate)
        def sort_key(p: ProjectState):
            health_score = 0 if p.status == "healthy" else 1
            return (health_score, p.consecutive_failures, -p.successful_requests)

        eligible.sort(key=sort_key)
        return eligible[0]

    def record_success(self, project: ProjectState):
        project.total_requests += 1
        project.successful_requests += 1
        project.consecutive_failures = 0
        if project.status == "degraded":
            project.status = "healthy"

    def record_failure(
        self,
        project: ProjectState,
        error_type: str,
        error_message: str,
        is_transient: bool = True,
        cooldown_seconds: Optional[int] = None
    ):
        project.total_requests += 1
        project.consecutive_failures += 1
        project.last_error_type = error_type
        project.last_error_message = sanitize_text(error_message, self.get_known_keys())
        project.last_error_time = time.time()

        if error_type == "invalid_key" or error_type == "permission_denied":
            project.status = "unhealthy"
            for c in project.credentials:
                c.is_valid = False
                c.last_error = error_message
            logger.error(f"Project '{project.project_id}' marked UNHEALTHY due to permanent auth/permission error.")
        elif error_type == "quota_exhausted":
            project.exhausted_quotas += 1
            project.status = "cooldown"
            # 5-minute default cooldown for exhausted quota
            cooldown = cooldown_seconds if cooldown_seconds is not None else 300
            project.cooldown_until = time.time() + cooldown
            logger.warning(f"Project '{project.project_id}' QUOTA EXHAUSTED. Quarantined in cooldown for {cooldown}s.")
        elif error_type == "rate_limit":
            project.rate_limits += 1
            if project.consecutive_failures >= 3:
                project.status = "cooldown"
                cooldown = cooldown_seconds if cooldown_seconds is not None else 60
                project.cooldown_until = time.time() + cooldown
            else:
                project.status = "degraded"
        elif is_transient:
            project.transient_retries += 1
            if project.consecutive_failures >= 2:
                project.status = "degraded"

    # -----------------------------------------------------------------------
    # Core Execution Engine with Project Failover
    # -----------------------------------------------------------------------

    def execute_with_failover(
        self,
        call_fn: Callable[[Any, str], Any],
        model: Optional[str] = None,
        max_retries_per_project: int = 2,
        base_delay: float = 1.0,
        max_delay: float = 8.0,
        jitter: float = 0.5,
        request_id: Optional[str] = None
    ) -> Any:
        """
        Executes a Gemini call with bounded backoff and project-level failover.
        call_fn receives (client, model_name).
        Guarantees that on retries, caller side-effects (DB writes) are safe.
        """
        target_model = model or settings.clean_gemini_model
        excluded_projects: Set[str] = set()
        last_exception: Optional[Exception] = None

        # Check idempotency cache if request_id provided
        if request_id and request_id in self._idempotency_cache:
            cached_val, cached_time = self._idempotency_cache[request_id]
            if time.time() - cached_time < 300:  # 5 min TTL
                logger.info(f"Returning cached idempotent response for request_id '{request_id}'")
                return cached_val

        while True:
            project = self.select_healthy_project(exclude_project_ids=excluded_projects)
            if not project:
                # No more eligible projects
                if last_exception:
                    raise last_exception
                all_cooldown = [p for p in self.projects.values() if p.is_in_cooldown]
                if all_cooldown:
                    min_wait = min(p.remaining_cooldown_seconds for p in all_cooldown)
                    raise GeminiRateLimitError(
                        f"All configured Gemini projects are currently in quota cooldown. Please retry in {min_wait}s."
                    )
                raise GeminiAuthError("No healthy configured Google Gemini credentials available. Check backend/.env.")

            cred = project.get_valid_credential()
            if not cred:
                excluded_projects.add(project.project_id)
                continue

            client = self.get_client_for_credential(cred.api_key)

            # Attempt execution within this project with bounded exponential backoff
            for attempt in range(max_retries_per_project + 1):
                try:
                    result = call_fn(client, target_model)
                    self.record_success(project)
                    if request_id:
                        if len(self._idempotency_cache) > 1000:
                            oldest = next(iter(self._idempotency_cache))
                            del self._idempotency_cache[oldest]
                        self._idempotency_cache[request_id] = (result, time.time())
                    return result
                except Exception as e:
                    sanitized_err = sanitize_text(str(e), self.get_known_keys())
                    err_msg = getattr(e, "message", str(e)).lower()
                    code = getattr(e, "code", getattr(e, "status_code", 500))

                    # 1. Invalid Credential / Auth Error (401 / 403 / API_KEY_INVALID)
                    if code in (401, 403) or "api_key_invalid" in err_msg or "permission_denied" in err_msg or "unauthenticated" in err_msg:
                        self.record_failure(project, "invalid_key", sanitized_err, is_transient=False)
                        last_exception = GeminiAuthError(
                            f"Authentication failed on project '{project.project_id}': {sanitized_err}",
                            project_id=project.project_id
                        )
                        excluded_projects.add(project.project_id)
                        break  # Stop trying this project, failover immediately

                    # 2. Unsupported Model (404)
                    if code == 404 or "not found" in err_msg or "no longer available" in err_msg:
                        self.record_failure(project, "unsupported_model", sanitized_err, is_transient=False)
                        last_exception = GeminiUnsupportedModelError(
                            f"Gemini model '{target_model}' not found on project '{project.project_id}': {sanitized_err}",
                            project_id=project.project_id
                        )
                        excluded_projects.add(project.project_id)
                        break

                    # 3. Rate Limit / Quota (429 / RESOURCE_EXHAUSTED)
                    if code == 429 or "resource_exhausted" in err_msg or "quota" in err_msg:
                        # Check if it's daily/plan exhaustion vs burst limit
                        is_daily_exhaustion = any(term in err_msg for term in ["quota exceeded", "check your plan", "exhausted", "billing"])
                        if is_daily_exhaustion:
                            self.record_failure(project, "quota_exhausted", sanitized_err, is_transient=False, cooldown_seconds=300)
                            last_exception = GeminiQuotaExhaustedError(
                                f"Quota exhausted on project '{project.project_id}'. Quarantining project.",
                                project_id=project.project_id
                            )
                            excluded_projects.add(project.project_id)
                            break  # Fail over to another distinct project
                        else:
                            # Transient burst rate limit: inspect retry delay or apply bounded exponential backoff
                            self.record_failure(project, "rate_limit", sanitized_err, is_transient=True)
                            if attempt < max_retries_per_project:
                                suggested_delay = extract_retry_delay(e)
                                if suggested_delay is not None:
                                    delay = min(max_delay, suggested_delay) + random.uniform(0, jitter)
                                else:
                                    delay = min(max_delay, base_delay * (2 ** attempt)) + random.uniform(0, jitter)
                                time.sleep(delay)
                                continue
                            else:
                                last_exception = GeminiRateLimitError(
                                    f"Rate limit exceeded on project '{project.project_id}': {sanitized_err}",
                                    project_id=project.project_id
                                )
                                excluded_projects.add(project.project_id)
                                break

                    # 4. Transient Server Errors (500, 502, 503, 504, Connection Reset, Timeout)
                    if code in (500, 502, 503, 504) or "unavailable" in err_msg or "deadline" in err_msg or "timeout" in err_msg:
                        self.record_failure(project, "server_error", sanitized_err, is_transient=True)
                        if attempt < max_retries_per_project:
                            delay = min(max_delay, base_delay * (attempt + 1)) + random.uniform(0, jitter)
                            time.sleep(delay)
                            continue
                        else:
                            last_exception = GeminiProviderError(
                                f"Service unavailable on project '{project.project_id}': {sanitized_err}",
                                status_code=503,
                                project_id=project.project_id
                            )
                            excluded_projects.add(project.project_id)
                            break

                    # 5. Generic Unexpected Exception
                    self.record_failure(project, "general_error", sanitized_err, is_transient=False)
                    last_exception = GeminiProviderError(f"Gemini error: {sanitized_err}", project_id=project.project_id)
                    excluded_projects.add(project.project_id)
                    break

    # -----------------------------------------------------------------------
    # Streaming Execution Engine with Safe Failure Boundary
    # -----------------------------------------------------------------------

    def stream_with_failover(
        self,
        stream_fn: Callable[[Any, str], Iterator[Any]],
        model: Optional[str] = None,
        request_id: Optional[str] = None
    ) -> Iterator[str]:
        """
        Streams generated tokens with safe failure handling:
        - If error occurs BEFORE first chunk is yielded: transparently failover to another project.
        - If error occurs AFTER streaming has begun: DO NOT restart from scratch (which would
          concatenate duplicate content). Yield an explicit error event.
        """
        target_model = model or settings.clean_gemini_model
        excluded_projects: Set[str] = set()

        while True:
            project = self.select_healthy_project(exclude_project_ids=excluded_projects)
            if not project:
                all_cooldown = [p for p in self.projects.values() if p.is_in_cooldown]
                if all_cooldown:
                    min_wait = min(p.remaining_cooldown_seconds for p in all_cooldown)
                    raise GeminiRateLimitError(
                        f"All configured Gemini projects are currently in quota cooldown. Please retry in {min_wait}s."
                    )
                raise GeminiAuthError("No healthy configured Google Gemini credentials available for streaming.")

            cred = project.get_valid_credential()
            if not cred:
                excluded_projects.add(project.project_id)
                continue

            client = self.get_client_for_credential(cred.api_key)
            chunks_yielded = 0

            try:
                raw_stream = stream_fn(client, target_model)
                for chunk in raw_stream:
                    text_piece = getattr(chunk, "text", "") or ""
                    if text_piece:
                        chunks_yielded += 1
                        yield text_piece
                # Stream completed successfully
                self.record_success(project)
                return
            except Exception as e:
                sanitized_err = sanitize_text(str(e), self.get_known_keys())
                err_msg = getattr(e, "message", str(e)).lower()
                code = getattr(e, "code", getattr(e, "status_code", 500))

                # Determine error category
                if code in (401, 403) or "api_key_invalid" in err_msg or "permission_denied" in err_msg:
                    self.record_failure(project, "invalid_key", sanitized_err, is_transient=False)
                elif code == 429 or "resource_exhausted" in err_msg or "quota" in err_msg:
                    self.record_failure(project, "quota_exhausted", sanitized_err, is_transient=False, cooldown_seconds=300)
                else:
                    self.record_failure(project, "streaming_error", sanitized_err, is_transient=True)

                if chunks_yielded > 0:
                    # Output was already partially sent to client. Do NOT restart generation!
                    logger.error(
                        f"Stream interrupted on project '{project.project_id}' after {chunks_yielded} chunks were yielded. "
                        "Refusing to restart stream to prevent duplicate/garbled content."
                    )
                    raise GeminiStreamInterruptedError(
                        f"Live response stream was interrupted. ({sanitized_err})",
                        project_id=project.project_id
                    )
                else:
                    # Safe to fail over to another healthy project
                    logger.warning(
                        f"Stream failed before first chunk on project '{project.project_id}'. Failing over to backup project."
                    )
                    excluded_projects.add(project.project_id)
                    continue

    # -----------------------------------------------------------------------
    # Administrator Diagnostics & Metrics
    # -----------------------------------------------------------------------

    def get_provider_diagnostics(self) -> Dict[str, Any]:
        """Returns safe, key-redacted status and metrics for all configured projects."""
        projects_info = []
        for p_id, p in self.projects.items():
            creds_info = [
                {
                    "alias": c.alias,
                    "redacted_key": redact_key(c.api_key),
                    "is_valid": c.is_valid,
                    "priority": c.priority
                }
                for c in p.credentials
            ]
            projects_info.append({
                "project_id": p.project_id,
                "status": p.status,
                "is_in_cooldown": p.is_in_cooldown,
                "remaining_cooldown_seconds": p.remaining_cooldown_seconds,
                "consecutive_failures": p.consecutive_failures,
                "total_requests": p.total_requests,
                "successful_requests": p.successful_requests,
                "transient_retries": p.transient_retries,
                "exhausted_quotas": p.exhausted_quotas,
                "rate_limits": p.rate_limits,
                "last_error_type": p.last_error_type,
                "last_error_message": p.last_error_message,
                "last_error_time": p.last_error_time,
                "credentials": creds_info
            })

        active_project = self.select_healthy_project()
        return {
            "service": "Google Gemini API Manager",
            "model": settings.clean_gemini_model,
            "configured_projects_count": len(self.projects),
            "active_project_id": active_project.project_id if active_project else None,
            "has_healthy_project": active_project is not None,
            "projects": projects_info
        }


# Global singleton instance
provider_manager = GeminiProviderManager.get_instance()
