"""
Google Gemini AI Interview Engine — Placement Hub
Migrated from failing third-party gateway to the official Google Gen AI SDK (`google-genai`).
Direct integration with official Gemini API (e.g. gemini-3-flash-preview).
Validates schemas strictly, handles API errors honestly without fabricated fallbacks,
and grounds questions in verified role requirements and student skill proofs.
"""

import json
import logging
from typing import List, Dict, Any, Optional, Iterator
from pydantic import BaseModel, Field

from ..core.config import settings
from .gemini_provider import (
    provider_manager,
    GeminiProviderError,
    GeminiAuthError,
    GeminiRateLimitError,
    GeminiQuotaExhaustedError,
    GeminiUnsupportedModelError,
    GeminiTimeoutError,
    GeminiStreamInterruptedError
)

logger = logging.getLogger("ai_interview")

# ---------------------------------------------------------------------------
# Custom Typed Exceptions
# ---------------------------------------------------------------------------

class AIAPIError(Exception):
    """Base exception for AI API failures."""
    def __init__(self, message: str, status_code: int = 502):
        super().__init__(message)
        self.message = message
        self.status_code = status_code

class AIAuthenticationError(AIAPIError):
    """Raised when API Key is missing, revoked or rejected (401/403)."""
    def __init__(self, message: str = "Invalid or unauthenticated Google Gemini API key."):
        super().__init__(message, status_code=401)

class AIRateLimitError(AIAPIError):
    """Raised when API rate limit or quota is exceeded (429)."""
    def __init__(self, message: str = "Google Gemini API rate limit or quota reached. Please retry in a moment."):
        super().__init__(message, status_code=429)

class AIUnsupportedModelError(AIAPIError):
    """Raised when the requested model is not found or unsupported (404)."""
    def __init__(self, message: str = "Requested Gemini model is not found or unavailable in this project."):
        super().__init__(message, status_code=404)

class AITimeoutError(AIAPIError):
    """Raised when API times out."""
    def __init__(self, message: str = "Google Gemini API request timed out."):
        super().__init__(message, status_code=504)

class AIParsingError(AIAPIError):
    """Raised when response fails schema validation."""
    def __init__(self, message: str = "Failed to parse structured AI evaluation response."):
        super().__init__(message, status_code=502)

# Backwards-compatible aliases for existing endpoint imports and tests
ClaudeAPIError = AIAPIError
ClaudeAuthenticationError = AIAuthenticationError
ClaudeRateLimitError = AIRateLimitError
ClaudeTimeoutError = AITimeoutError
ClaudeParsingError = AIParsingError


# ---------------------------------------------------------------------------
# Pydantic Schemas for Structured Outputs & Diagnostics
# ---------------------------------------------------------------------------

class ProviderDiagnosticSchema(BaseModel):
    hostname: str = Field(..., description="Selected provider hostname (generativelanguage.googleapis.com)")
    api_protocol: str = Field(..., description="Active protocol (Google Gen AI API - SDK v2)")
    endpoint_path: str = Field(..., description="Target model and action")
    model_id: str = Field(..., description="Configured Gemini model identifier")
    credential_present: bool = Field(..., description="Whether GEMINI_API_KEY is configured in backend/.env")
    status: str = Field(..., description="authenticated | authentication_error | quota_error | unsupported_model | provider_error | not_configured | error")
    http_status: Optional[int] = Field(default=None, description="HTTP status code from minimal verification request")
    sanitized_error: Optional[str] = Field(default=None, description="Sanitized provider error without secret characters")
    diagnostic_message: str = Field(..., description="Actionable human-readable diagnostic status")

class QuestionSchema(BaseModel):
    question_text: str = Field(..., description="The interview question text")
    category: str = Field(default="Technical", description="Question category: Technical, Problem Solving, Experience, FollowUp")
    expected_points: List[str] = Field(default_factory=list, description="Key concepts or proof points expected in a solid answer")
    rubric: Dict[str, str] = Field(
        default_factory=dict,
        description="Evaluation guidelines: correctness, relevance, completeness, clarity, evidence"
    )
    difficulty: str = Field(default="Medium")

class EvaluationSchema(BaseModel):
    correctness_score: float = Field(..., ge=0.0, le=100.0, description="Technical correctness of facts, logic, and definitions")
    relevance_score: float = Field(..., ge=0.0, le=100.0, description="Relevance to the specific question asked")
    completeness_score: float = Field(..., ge=0.0, le=100.0, description="Depth and coverage of key architectural/code nuances")
    clarity_score: float = Field(..., ge=0.0, le=100.0, description="Structured communication, concise articulation")
    evidence_score: float = Field(..., ge=0.0, le=100.0, description="Use of real concrete examples, trade-offs, or production metrics")
    turn_overall_score: float = Field(..., ge=0.0, le=100.0, description="Weighted aggregate score for this turn")
    strengths: List[str] = Field(default_factory=list, description="Specific positive elements observed in the candidate's answer")
    areas_for_improvement: List[str] = Field(default_factory=list, description="Constructive feedback points for improvement")
    follow_up_recommended: bool = Field(default=False, description="Whether an immediate follow-up probe is required")
    suggested_follow_up: Optional[str] = Field(default=None, description="Suggested follow-up question if follow_up_recommended is True")

class SummarySchema(BaseModel):
    overall_score: float = Field(..., ge=0.0, le=100.0, description="Overall interview score across all turns")
    executive_summary: str = Field(..., description="Comprehensive objective assessment of performance")
    competency_scores: Dict[str, float] = Field(default_factory=dict, description="Scores per technical competency domain")
    key_strengths: List[str] = Field(default_factory=list, description="Top demonstrable strengths")
    priority_growth_areas: List[str] = Field(default_factory=list, description="Key topics to study before actual campus drive")
    hiring_readiness_recommendation: str = Field(..., description="Readiness recommendation: Ready for Tier-1 Technical Rounds, Needs Focused Preparation, or Developing Fundamentals")


# ---------------------------------------------------------------------------
# Gemini Interview Service Implementation
# ---------------------------------------------------------------------------

class GeminiInterviewService:
    """
    Official Google Gemini API implementation of the Interview Service.
    Acts as a direct provider adapter matching the interview interface.
    """
    def __init__(
        self,
        api_key: Optional[str] = None,
        model: Optional[str] = None
    ):
        self.api_key = (api_key or settings.clean_gemini_api_key).strip()
        self.model = (model or settings.clean_gemini_model).strip()
        self._client = None

    def _sanitize(self, message: str) -> str:
        """Strips secret API keys from any output string if ever reflected."""
        sanitized = message
        if self.api_key and self.api_key in sanitized:
            sanitized = sanitized.replace(self.api_key, "[REDACTED_GEMINI_KEY]")
        if settings.clean_gemini_api_key and settings.clean_gemini_api_key in sanitized:
            sanitized = sanitized.replace(settings.clean_gemini_api_key, "[REDACTED_GEMINI_KEY]")
        if settings.clean_anthropic_api_key and settings.clean_anthropic_api_key in sanitized:
            sanitized = sanitized.replace(settings.clean_anthropic_api_key, "[REDACTED_KEY]")
        return sanitized

    def _get_client(self):
        """Initializes and returns the official Google Gen AI client."""
        if not self.api_key:
            self.api_key = settings.clean_gemini_api_key
        if not self.model:
            self.model = settings.clean_gemini_model

        if not self.api_key or self.api_key.startswith("your_") or len(self.api_key) < 10:
            raise AIAuthenticationError(
                "Google Gemini API key is not configured. "
                "Set GEMINI_API_KEY in backend/.env with a valid Google AI Studio credential."
            )

        if self._client is not None:
            return self._client

        try:
            from google import genai
            self._client = genai.Client(api_key=self.api_key)
            return self._client
        except Exception as e:
            sanitized = self._sanitize(str(e))
            raise AIAPIError(f"Failed to initialize Google Gen AI client: {sanitized}")

    def test_provider_connection(self) -> ProviderDiagnosticSchema:
        """
        Executes exactly ONE minimal request to test Gemini API connectivity, auth, and model quota.
        Never exposes secrets in output.
        """
        hostname = "generativelanguage.googleapis.com"
        protocol = "Google Gen AI API (SDK v2)"
        endpoint_path = f"models/{self.model}:generateContent"
        model_id = self.model
        has_key = bool(self.api_key)

        if not has_key:
            return ProviderDiagnosticSchema(
                hostname=hostname,
                api_protocol=protocol,
                endpoint_path=endpoint_path,
                model_id=model_id,
                credential_present=False,
                status="not_configured",
                http_status=401,
                sanitized_error="GEMINI_API_KEY is not configured in backend/.env.",
                diagnostic_message=f"No credential configured. Add GEMINI_API_KEY in backend/.env for {hostname}."
            )

        try:
            client = self._get_client()
            client.models.generate_content(
                model=self.model,
                contents="Ping"
            )
            return ProviderDiagnosticSchema(
                hostname=hostname,
                api_protocol=protocol,
                endpoint_path=endpoint_path,
                model_id=model_id,
                credential_present=True,
                status="authenticated",
                http_status=200,
                sanitized_error=None,
                diagnostic_message=f"Successfully authenticated with Google Gemini API using model '{model_id}'."
            )
        except Exception as e:
            sanitized_err = self._sanitize(str(e))
            err_msg = getattr(e, "message", str(e))
            code = getattr(e, "code", getattr(e, "status_code", 500))

            from google.genai import errors
            if isinstance(e, errors.ClientError) or code in (400, 401, 403):
                if code == 404 or "not found" in err_msg.lower() or "no longer available" in err_msg.lower():
                    return ProviderDiagnosticSchema(
                        hostname=hostname,
                        api_protocol=protocol,
                        endpoint_path=endpoint_path,
                        model_id=model_id,
                        credential_present=True,
                        status="unsupported_model",
                        http_status=404,
                        sanitized_error=sanitized_err,
                        diagnostic_message=(
                            f"Model '{model_id}' is not found or unsupported for this Google AI Studio project. "
                            "Update GEMINI_MODEL in backend/.env (e.g. gemini-3-flash-preview)."
                        )
                    )
                elif code == 429 or "quota" in err_msg.lower() or "resource_exhausted" in err_msg.lower():
                    return ProviderDiagnosticSchema(
                        hostname=hostname,
                        api_protocol=protocol,
                        endpoint_path=endpoint_path,
                        model_id=model_id,
                        credential_present=True,
                        status="quota_error",
                        http_status=429,
                        sanitized_error=sanitized_err,
                        diagnostic_message=(
                            f"Gemini API quota or rate limit exceeded for model '{model_id}'. "
                            "Check your Google AI Studio plan quota."
                        )
                    )
                else:
                    return ProviderDiagnosticSchema(
                        hostname=hostname,
                        api_protocol=protocol,
                        endpoint_path=endpoint_path,
                        model_id=model_id,
                        credential_present=True,
                        status="authentication_error",
                        http_status=401,
                        sanitized_error=sanitized_err,
                        diagnostic_message=(
                            "Authentication failed with Google Gemini API. "
                            "The GEMINI_API_KEY was rejected by Google AI Studio. "
                            "Please check GEMINI_API_KEY in backend/.env."
                        )
                    )
            elif isinstance(e, errors.ServerError) or code in (500, 502, 503, 504):
                return ProviderDiagnosticSchema(
                    hostname=hostname,
                    api_protocol=protocol,
                    endpoint_path=endpoint_path,
                    model_id=model_id,
                    credential_present=True,
                    status="provider_error",
                    http_status=code,
                    sanitized_error=sanitized_err,
                    diagnostic_message=f"Google Gemini service returned HTTP {code}: model may be temporarily overloaded."
                )
            else:
                return ProviderDiagnosticSchema(
                    hostname=hostname,
                    api_protocol=protocol,
                    endpoint_path=endpoint_path,
                    model_id=model_id,
                    credential_present=True,
                    status="error",
                    http_status=502,
                    sanitized_error=sanitized_err,
                    diagnostic_message=f"Connection to Google Gemini failed: {sanitized_err}"
                )

    def _generate_content_with_retry(self, client, model: str, contents: str, config: Any, max_retries: int = 2):
        """Retries transient 503/500 spikes from Google's preview models with short backoff."""
        import time
        from google.genai import errors
        last_error = None
        for attempt in range(max_retries + 1):
            try:
                return client.models.generate_content(
                    model=model,
                    contents=contents,
                    config=config
                )
            except errors.ServerError as e:
                last_error = e
                code = getattr(e, "code", 503)
                if code in (500, 502, 503, 504) and attempt < max_retries:
                    time.sleep(1.0 * (attempt + 1))
                    continue
                raise
            except Exception:
                raise
        if last_error:
            raise last_error

    def _execute_prompt(
        self,
        system_prompt: str,
        user_prompt: str,
        temperature: float = 0.2,
        json_output: bool = True,
        request_id: Optional[str] = None
    ) -> str:
        """Executes a Gemini prompt using provider_manager failover engine or single-key fallback."""
        def _call(client, model_name):
            from google.genai import types
            kwargs = {
                "system_instruction": system_prompt,
                "temperature": temperature
            }
            if json_output:
                kwargs["response_mime_type"] = "application/json"
            config = types.GenerateContentConfig(**kwargs)
            return client.models.generate_content(
                model=model_name,
                contents=user_prompt,
                config=config
            )

        try:
            if not self.api_key or self.api_key == settings.clean_gemini_api_key:
                res = provider_manager.execute_with_failover(_call, model=self.model, request_id=request_id)
                return res.text.strip()
            else:
                client = self._get_client()
                from google.genai import types
                kwargs = {
                    "system_instruction": system_prompt,
                    "temperature": temperature
                }
                if json_output:
                    kwargs["response_mime_type"] = "application/json"
                config = types.GenerateContentConfig(**kwargs)
                res = self._generate_content_with_retry(client=client, model=self.model, contents=user_prompt, config=config)
                return res.text.strip()
        except AIAPIError:
            raise
        except GeminiAuthError as e:
            raise AIAuthenticationError(str(e))
        except (GeminiRateLimitError, GeminiQuotaExhaustedError) as e:
            raise AIRateLimitError(str(e))
        except GeminiUnsupportedModelError as e:
            raise AIUnsupportedModelError(str(e))
        except GeminiTimeoutError as e:
            raise AITimeoutError(str(e))
        except GeminiProviderError as e:
            raise AIAPIError(str(e), status_code=e.status_code)
        except Exception as e:
            self._handle_genai_exception(e, "model generation")

    def generate_question(
        self,
        role_target: str,
        interview_type: str,
        difficulty: str,
        required_skills: List[str],
        candidate_verified_skills: List[str],
        candidate_degree: str,
        turn_number: int,
        prior_turns: List[Dict[str, Any]]
    ) -> QuestionSchema:
        """
        Generates a context-aware interview question grounded in the target role,
        verified skills, and previous interview conversation history.
        """
        skills_str = ", ".join(required_skills) if required_skills else "General software engineering competencies"
        verified_str = ", ".join(candidate_verified_skills) if candidate_verified_skills else "None verified yet"

        history_context = ""
        if prior_turns:
            history_context = "\nPrior Questions & Answers in this session:\n"
            for t in prior_turns:
                history_context += f"- Q{t.get('turn_number')}: {t.get('question_text')}\n"
                ans = t.get('student_answer_transcript') or '[No answer recorded]'
                history_context += f"  Candidate Answer: {ans[:200]}...\n"

        system_prompt = (
            "You are an expert technical interviewer conducting a rigorous, evidence-grounded campus placement interview.\n"
            "Generate exactly ONE focused, realistic question for the specified role.\n"
            "Never ask generic or trivia questions. Focus on core problem-solving, architectural choices, "
            "practical edge cases, and real production experience.\n"
            "Return ONLY a valid JSON object matching the requested schema without any markdown formatting or commentary."
        )

        user_prompt = (
            f"Role Target: {role_target}\n"
            f"Interview Round: {interview_type}\n"
            f"Difficulty: {difficulty}\n"
            f"Turn Number: {turn_number}\n"
            f"Candidate Degree: {candidate_degree}\n"
            f"Required Skills for Role: {skills_str}\n"
            f"Verified Candidate Skills: {verified_str}\n"
            f"{history_context}\n"
            "Generate the next interview question as JSON matching this schema:\n"
            "{\n"
            '  "question_text": "<the question to ask the candidate>",\n'
            f'  "category": "{interview_type}",\n'
            '  "expected_points": ["<concept 1>", "<concept 2>", "<concept 3>"],\n'
            '  "rubric": {\n'
            '    "correctness": "<what constitutes technical correctness>",\n'
            '    "relevance": "<what must directly address the prompt>",\n'
            '    "completeness": "<what corner cases or trade-offs should be covered>",\n'
            '    "clarity": "<structure and brevity expectation>",\n'
            '    "evidence": "<practical metrics or project application expected>"\n'
            '  },\n'
            f'  "difficulty": "{difficulty}"\n'
            "}"
        )

        req_id = f"q_gen:{turn_number}:{role_target}"
        raw_text = self._execute_prompt(system_prompt, user_prompt, temperature=0.3, json_output=True, request_id=req_id)
        data = self._extract_json(raw_text)
        return QuestionSchema(**data)

    def generate_question_stream(
        self,
        role_target: str,
        interview_type: str,
        difficulty: str,
        required_skills: List[str],
        candidate_verified_skills: List[str],
        candidate_degree: str,
        turn_number: int,
        prior_turns: List[Dict[str, Any]]
    ) -> Iterator[str]:
        """
        Streams generated question text tokens in real time directly from Gemini.
        Note: Real-time speech streaming requires separate audio pipelines.
        """
        client = self._get_client()

        skills_str = ", ".join(required_skills) if required_skills else "General software engineering competencies"
        verified_str = ", ".join(candidate_verified_skills) if candidate_verified_skills else "None verified yet"

        history_context = ""
        if prior_turns:
            history_context = "\nPrior Questions & Answers in this session:\n"
            for t in prior_turns:
                history_context += f"- Q{t.get('turn_number')}: {t.get('question_text')}\n"
                ans = t.get('student_answer_transcript') or '[No answer recorded]'
                history_context += f"  Candidate Answer: {ans[:200]}...\n"

        system_prompt = (
            "You are an expert technical interviewer conducting a live campus placement interview. "
            "Speak directly to the candidate. Ask exactly ONE focused question."
        )

        user_prompt = (
            f"Role: {role_target}\n"
            f"Round: {interview_type}\n"
            f"Difficulty: {difficulty}\n"
            f"Turn: {turn_number}\n"
            f"Degree: {candidate_degree}\n"
            f"Target Skills: {skills_str}\n"
            f"Verified Skills: {verified_str}\n"
            f"{history_context}\n"
            "Ask your next interview question directly to the candidate:"
        )

        def _stream(client, model_name):
            from google.genai import types
            config = types.GenerateContentConfig(
                system_instruction=system_prompt,
                temperature=0.3
            )
            return client.models.generate_content_stream(
                model=model_name,
                contents=user_prompt,
                config=config
            )

        try:
            if not self.api_key or self.api_key == settings.clean_gemini_api_key:
                for chunk_text in provider_manager.stream_with_failover(_stream, model=self.model):
                    yield chunk_text
            else:
                client = self._get_client()
                from google.genai import types
                config = types.GenerateContentConfig(
                    system_instruction=system_prompt,
                    temperature=0.3
                )
                response_stream = client.models.generate_content_stream(
                    model=self.model,
                    contents=user_prompt,
                    config=config
                )
                for chunk in response_stream:
                    if chunk.text:
                        yield chunk.text
        except GeminiStreamInterruptedError:
            raise
        except GeminiAuthError as e:
            raise AIAuthenticationError(str(e))
        except (GeminiRateLimitError, GeminiQuotaExhaustedError) as e:
            raise AIRateLimitError(str(e))
        except GeminiUnsupportedModelError as e:
            raise AIUnsupportedModelError(str(e))
        except GeminiTimeoutError as e:
            raise AITimeoutError(str(e))
        except GeminiProviderError as e:
            raise AIAPIError(str(e), status_code=e.status_code)
        except Exception as e:
            self._handle_genai_exception(e, "streaming question generation")

    def evaluate_answer(
        self,
        role_target: str,
        question_text: str,
        expected_points: List[str],
        rubric: Dict[str, str],
        student_answer: str,
        turn_number: int,
        question_limit: int,
        prior_turns: List[Dict[str, Any]]
    ) -> EvaluationSchema:
        """
        Evaluates a candidate's actual transcribed answer against a documented rubric:
        correctness, relevance, completeness, clarity, supporting evidence.
        Determines whether a follow-up question is warranted or if we advance.
        """
        if not student_answer or not student_answer.strip():
            return EvaluationSchema(
                correctness_score=0.0,
                relevance_score=0.0,
                completeness_score=0.0,
                clarity_score=0.0,
                evidence_score=0.0,
                turn_overall_score=0.0,
                strengths=[],
                areas_for_improvement=["No answer audio or transcript was submitted for this question."],
                follow_up_recommended=False,
                suggested_follow_up=None
            )

        system_prompt = (
            "You are an impartial, highly rigorous technical evaluator for collegiate placement interviews.\n"
            "Score the candidate's actual verbal answer transcript against the target rubric.\n"
            "Do not invent positive points that were not stated. Strictly score each dimension between 0 and 100:\n"
            "- correctness: technical accuracy of algorithms, concepts, and logic\n"
            "- relevance: whether the answer addresses the question directly\n"
            "- completeness: whether boundary conditions, scale, or trade-offs were acknowledged\n"
            "- clarity: structure, articulation, and concise delivery\n"
            "- evidence: real concrete examples, production metrics, or practical projects mentioned\n"
            "Calculate turn_overall_score as a weighted average: (correctness*0.35 + relevance*0.25 + completeness*0.20 + clarity*0.10 + evidence*0.10).\n"
            "Return ONLY a valid JSON object matching the requested schema."
        )

        user_prompt = (
            f"Target Role: {role_target}\n"
            f"Question Asked: {question_text}\n"
            f"Expected Concepts: {json.dumps(expected_points)}\n"
            f"Rubric: {json.dumps(rubric)}\n"
            f"Candidate Spoken Answer: \"{student_answer}\"\n"
            f"Turn {turn_number} of {question_limit}\n\n"
            "Evaluate strictly and return JSON matching this schema:\n"
            "{\n"
            '  "correctness_score": <float 0-100>,\n'
            '  "relevance_score": <float 0-100>,\n'
            '  "completeness_score": <float 0-100>,\n'
            '  "clarity_score": <float 0-100>,\n'
            '  "evidence_score": <float 0-100>,\n'
            '  "turn_overall_score": <float 0-100>,\n'
            '  "strengths": ["<strength 1>", "<strength 2>"],\n'
            '  "areas_for_improvement": ["<area 1>", "<area 2>"],\n'
            '  "follow_up_recommended": <true/false>,\n'
            '  "suggested_follow_up": "<optional follow up probe question or null>"\n'
            "}"
        )

        req_id = f"eval:{turn_number}:{student_answer[:40]}"
        raw_text = self._execute_prompt(system_prompt, user_prompt, temperature=0.2, json_output=True, request_id=req_id)
        data = self._extract_json(raw_text)
        return EvaluationSchema(**data)

    def generate_final_summary(
        self,
        role_target: str,
        turns_data: List[Dict[str, Any]],
        interview_type: str = "Technical",
        total_duration_minutes: float = 0.0
    ) -> SummarySchema:
        """
        Synthesizes the complete multi-turn interview into an honest, comprehensive executive summary
        with domain breakdown, priority study areas, and genuine readiness recommendation.
        """
        turns_summary = ""
        for t in turns_data:
            q = t.get("question_text", "")
            ans = t.get("student_answer_transcript", "[No answer recorded]")
            score = t.get("turn_overall_score", 0.0)
            turns_summary += f"\nTurn {t.get('turn_number')}:\n- Question: {q}\n- Answer: {ans}\n- Turn Score: {score}/100\n"

        system_prompt = (
            "You are a Senior Technical Director synthesizing an executive hiring recommendation for a college candidate.\n"
            "Review the full interview transcript and scores. Provide an objective, encouraging yet honest summary.\n"
            "Do not inflate grades. Suggest specific technical competencies to study before their live drive.\n"
            "hiring_readiness_recommendation must be one of:\n"
            "- 'Ready for Tier-1 Technical Rounds'\n"
            "- 'Needs Focused Preparation'\n"
            "- 'Developing Fundamentals'\n"
            "Return ONLY valid JSON matching the requested schema."
        )

        user_prompt = (
            f"Role: {role_target}\n"
            f"Interview Round: {interview_type}\n"
            f"Session Data:\n{turns_summary}\n\n"
            "Synthesize final evaluation report as JSON:\n"
            "{\n"
            '  "overall_score": <float 0-100>,\n'
            '  "executive_summary": "<2-3 paragraph detailed breakdown of technical depth and communication>",\n'
            '  "competency_scores": {\n'
            '    "System Design & Architecture": <float 0-100>,\n'
            '    "Data Structures & Problem Solving": <float 0-100>,\n'
            '    "Engineering Tradeoffs & Scaling": <float 0-100>,\n'
            '    "Clarity & Production Readiness": <float 0-100>\n'
            '  },\n'
            '  "key_strengths": ["<strength 1>", "<strength 2>"],\n'
            '  "priority_growth_areas": ["<growth area 1>", "<growth area 2>"],\n'
            '  "hiring_readiness_recommendation": "<Ready for Tier-1 Technical Rounds | Needs Focused Preparation | Developing Fundamentals>"\n'
            "}"
        )

        req_id = f"summary:{len(turns_data)}:{role_target}"
        raw_text = self._execute_prompt(system_prompt, user_prompt, temperature=0.2, json_output=True, request_id=req_id)
        data = self._extract_json(raw_text)
        return SummarySchema(**data)

    def _extract_json(self, text: str) -> Dict[str, Any]:
        """
        Safely extracts JSON from model response text, handling potential
        markdown backticks or surrounding text.
        """
        text = text.strip()
        if text.startswith("```json"):
            text = text[7:]
        elif text.startswith("```"):
            text = text[3:]
        if text.endswith("```"):
            text = text[:-3]
        text = text.strip()

        start = text.find("{")
        end = text.rfind("}")
        if start != -1 and end != -1 and end > start:
            text = text[start:end+1]

        try:
            return json.loads(text)
        except Exception as e:
            raise AIParsingError(f"Invalid structured JSON response from Gemini: {e}")

    def _handle_genai_exception(self, e: Exception, action: str):
        """Maps Google Gen AI exceptions to domain exceptions cleanly."""
        sanitized = self._sanitize(str(e))
        err_msg = getattr(e, "message", str(e))
        code = getattr(e, "code", getattr(e, "status_code", 500))

        from google.genai import errors
        if isinstance(e, errors.ClientError) or code in (400, 401, 403):
            if code == 404 or "not found" in err_msg.lower() or "no longer available" in err_msg.lower():
                raise AIUnsupportedModelError(
                    f"Gemini model '{self.model}' is not available or unsupported: {sanitized}"
                )
            elif code == 429 or "quota" in err_msg.lower() or "resource_exhausted" in err_msg.lower():
                raise AIRateLimitError(
                    f"Google Gemini rate limit or quota exceeded during {action}: {sanitized}"
                )
            else:
                raise AIAuthenticationError(
                    f"Google Gemini authentication failed during {action}: {sanitized}. "
                    "Please verify GEMINI_API_KEY in backend/.env."
                )
        elif isinstance(e, errors.ServerError) or code in (500, 502, 503, 504):
            raise AIAPIError(f"Google Gemini service error ({code}) during {action}: {sanitized}", status_code=503)
        else:
            raise AIAPIError(f"Google Gemini {action} failed: {type(e).__name__} - {sanitized}")

# Service Aliases for backwards compatibility with existing endpoints and tests
ClaudeInterviewService = GeminiInterviewService
AIInterviewService = GeminiInterviewService
