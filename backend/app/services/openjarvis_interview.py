"""OpenJarvis Local Inference & Agent Provider Adapter for Placement Hub.
Connects Placement Hub AI Interview Studio to an isolated OpenJarvis service instance
running locally over an authenticated OpenAI-compatible REST API.
"""

from __future__ import annotations

import json
import logging
import re
from typing import Any, Dict, Generator, List, Optional
import urllib.parse

import httpx

from app.core.config import settings
from app.models import models
from app.services.claude_interview import (
    AIAPIError,
    AIAuthenticationError,
    EvaluationSchema,
    ProviderDiagnosticSchema,
    QuestionSchema,
    SummarySchema,
)

logger = logging.getLogger(__name__)


class OpenJarvisInterviewService:
    """
    Adapter interfacing Placement Hub interview sessions with a local OpenJarvis instance.
    Preserves exact session ownership, database persistence, and rubric evaluation contracts.
    """

    def __init__(
        self,
        base_url: Optional[str] = None,
        api_key: Optional[str] = None,
        model: Optional[str] = None
    ):
        self.base_url = (base_url or settings.clean_openjarvis_base_url).rstrip('/')
        self.api_key = (api_key or settings.clean_openjarvis_api_key).strip()
        self.model = (model or settings.OPENJARVIS_MODEL).strip()

    def _get_headers(self) -> Dict[str, str]:
        headers = {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
        if self.api_key:
            headers["Authorization"] = f"Bearer {self.api_key}"
        return headers

    def test_provider_connection(self) -> ProviderDiagnosticSchema:
        """
        Tests connectivity and authentication against the local OpenJarvis instance.
        """
        parsed = urllib.parse.urlparse(self.base_url)
        hostname = parsed.netloc or "127.0.0.1:8008"
        endpoint = "/v1/chat/completions"
        protocol = "OpenJarvis Local Agent Engine (OpenAI-compatible v1)"

        try:
            with httpx.Client(timeout=5.0) as client:
                res = client.get(f"{self.base_url}/health", headers=self._get_headers())
                if res.status_code == 200:
                    return ProviderDiagnosticSchema(
                        hostname=hostname,
                        api_protocol=protocol,
                        endpoint_path=endpoint,
                        model_id=self.model,
                        credential_present=bool(self.api_key),
                        status="authenticated",
                        http_status=200,
                        sanitized_error=None,
                        diagnostic_message=f"Connected to local OpenJarvis service at {hostname}."
                    )
                elif res.status_code in (401, 403):
                    return ProviderDiagnosticSchema(
                        hostname=hostname,
                        api_protocol=protocol,
                        endpoint_path=endpoint,
                        model_id=self.model,
                        credential_present=bool(self.api_key),
                        status="authentication_error",
                        http_status=res.status_code,
                        sanitized_error="OpenJarvis authentication rejected (check OPENJARVIS_API_KEY).",
                        diagnostic_message="Local OpenJarvis rejected the credentials."
                    )
                else:
                    return ProviderDiagnosticSchema(
                        hostname=hostname,
                        api_protocol=protocol,
                        endpoint_path=endpoint,
                        model_id=self.model,
                        credential_present=bool(self.api_key),
                        status="provider_error",
                        http_status=res.status_code,
                        sanitized_error=f"OpenJarvis returned HTTP {res.status_code}",
                        diagnostic_message=f"Service responded with status {res.status_code}."
                    )
        except Exception as e:
            return ProviderDiagnosticSchema(
                hostname=hostname,
                api_protocol=protocol,
                endpoint_path=endpoint,
                model_id=self.model,
                credential_present=bool(self.api_key),
                status="error",
                http_status=503,
                sanitized_error=f"Connection refused to {self.base_url}: {type(e).__name__}",
                diagnostic_message=f"Cannot reach OpenJarvis service at {self.base_url}. Ensure it is running."
            )

    def generate_question(
        self,
        student: models.Student,
        target_role: str,
        required_skills: List[str],
        previous_turns: List[models.InterviewTurn],
    ) -> QuestionSchema:
        """Generates the next technical interview question via OpenJarvis."""
        verified_skills = [s.name for s in student.skills if s.verified]
        turn_number = len(previous_turns) + 1

        history_context = ""
        if previous_turns:
            history_context = "PREVIOUS TURNS IN THIS SESSION:\n"
            for t in previous_turns:
                history_context += f"Q{t.turn_number}: {t.question_text}\n"
                history_context += f"Candidate: {t.student_answer or '[No Answer]'}\n\n"

        prompt = (
            f"You are a Senior Technical Interviewer conducting a mock interview for Placement Hub.\n"
            f"Target Role: {target_role}\n"
            f"Candidate Verified Skills: {', '.join(verified_skills) if verified_skills else 'None verified'}\n"
            f"Required Skills: {', '.join(required_skills) if required_skills else 'General Technical'}\n"
            f"Current Turn: {turn_number}\n\n"
            f"{history_context}"
            f"Generate Turn {turn_number} question. It must be authentic, direct, and role-appropriate.\n"
            f"Output strictly valid JSON with keys: question_text (string), category (string: Technical|System Design|Problem Solving|Behavioral), difficulty (string: Beginner|Medium|Advanced), expected_points (list of strings), rubric (dict)."
        )

        payload = {
            "model": self.model,
            "messages": [
                {"role": "system", "content": "You are a Senior Technical Interviewer. Always output valid JSON."},
                {"role": "user", "content": prompt}
            ],
            "temperature": 0.7
        }

        try:
            with httpx.Client(timeout=60.0) as client:
                res = client.post(f"{self.base_url}/v1/chat/completions", headers=self._get_headers(), json=payload)
                if res.status_code != 200:
                    raise AIAPIError(f"OpenJarvis chat completion failed with HTTP {res.status_code}: {res.text}")
                data = res.json()
                raw_text = data["choices"][0]["message"]["content"]
        except Exception as e:
            raise AIAPIError(f"OpenJarvis generation failed: {type(e).__name__} {str(e)}")

        clean = raw_text.strip()
        if "```" in clean:
            clean = re.sub(r"^```[a-z]*\n", "", clean)
            clean = re.sub(r"\n```$", "", clean)

        try:
            parsed = json.loads(clean.strip())
            return QuestionSchema(
                question_text=parsed.get("question_text", clean),
                category=parsed.get("category", "Technical"),
                expected_points=parsed.get("expected_points", ["Conceptual correctness", "Edge case analysis"]),
                rubric=parsed.get("rubric", {
                    "correctness": "Accurate explanation of concepts",
                    "clarity": "Structured delivery",
                    "completeness": "Covers trade-offs"
                }),
                difficulty=parsed.get("difficulty", "Medium")
            )
        except Exception:
            return QuestionSchema(
                question_text=raw_text.strip(),
                category="Technical",
                expected_points=["Core logic", "Trade-offs"],
                rubric={"correctness": "Direct and technically sound"},
                difficulty="Medium"
            )

    def generate_question_stream(
        self,
        student: models.Student,
        target_role: str,
        required_skills: List[str],
        previous_turns: List[models.InterviewTurn],
    ) -> Generator[Dict[str, Any], None, None]:
        """Streams real-time tokens from OpenJarvis."""
        verified_skills = [s.name for s in student.skills if s.verified]
        turn_number = len(previous_turns) + 1

        prompt = (
            f"You are a Senior Technical Interviewer for Placement Hub.\n"
            f"Target Role: {target_role}\n"
            f"Required Skills: {', '.join(required_skills)}\n"
            f"Candidate Verified Skills: {', '.join(verified_skills)}\n"
            f"Current Turn: {turn_number}\n\n"
            f"Ask the candidate a concise, realistic interview question directly."
        )

        payload = {
            "model": self.model,
            "messages": [
                {"role": "system", "content": "You are a professional technical interviewer."},
                {"role": "user", "content": prompt}
            ],
            "temperature": 0.7,
            "stream": True
        }

        with httpx.Client(timeout=45.0) as client:
            with client.stream("POST", f"{self.base_url}/v1/chat/completions", headers=self._get_headers(), json=payload) as response:
                if response.status_code != 200:
                    raise AIAPIError(f"OpenJarvis streaming failed with HTTP {response.status_code}")

                for line in response.iter_lines():
                    if not line:
                        continue
                    if line.startswith("data: "):
                        raw_data = line[6:].strip()
                        if raw_data == "[DONE]":
                            break
                        try:
                            chunk = json.loads(raw_data)
                            delta = chunk.get("choices", [{}])[0].get("delta", {})
                            content = delta.get("content")
                            if content:
                                yield {"type": "token", "content": content}
                        except Exception:
                            continue

    def evaluate_answer(
        self,
        role_target: str,
        question_text: str,
        expected_points: List[str],
        rubric: Dict[str, str],
        student_answer: str,
        turn_number: int,
        question_limit: int,
    ) -> EvaluationSchema:
        """Evaluates student answer according to Placement Hub rubric."""
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

        prompt = (
            f"Evaluate the candidate's response to this interview question.\n\n"
            f"Target Role: {role_target}\n"
            f"Question Asked: {question_text}\n"
            f"Expected Concepts: {json.dumps(expected_points)}\n"
            f"Candidate Spoken Answer: \"{student_answer}\"\n"
            f"Turn {turn_number} of {question_limit}\n\n"
            f"Return strictly valid JSON with:\n"
            f"correctness_score (0-100 float), relevance_score (0-100 float), completeness_score (0-100 float), "
            f"clarity_score (0-100 float), evidence_score (0-100 float), turn_overall_score (0-100 float), "
            f"strengths (array of strings), areas_for_improvement (array of strings), "
            f"follow_up_recommended (boolean), suggested_follow_up (string or null)."
        )

        payload = {
            "model": self.model,
            "messages": [
                {"role": "system", "content": "You are an expert grading rubric evaluator. Output JSON only."},
                {"role": "user", "content": prompt}
            ],
            "temperature": 0.2
        }

        try:
            with httpx.Client(timeout=30.0) as client:
                res = client.post(f"{self.base_url}/v1/chat/completions", headers=self._get_headers(), json=payload)
                data = res.json()
                raw_text = data["choices"][0]["message"]["content"]
        except Exception as e:
            raise AIAPIError(f"OpenJarvis evaluation failed: {type(e).__name__} {str(e)}")

        clean = raw_text.strip()
        if "```" in clean:
            clean = re.sub(r"^```[a-z]*\n", "", clean)
            clean = re.sub(r"\n```$", "", clean)

        parsed = json.loads(clean.strip())
        return EvaluationSchema(
            correctness_score=float(parsed.get("correctness_score", 70.0)),
            relevance_score=float(parsed.get("relevance_score", 70.0)),
            completeness_score=float(parsed.get("completeness_score", 70.0)),
            clarity_score=float(parsed.get("clarity_score", 70.0)),
            evidence_score=float(parsed.get("evidence_score", 70.0)),
            turn_overall_score=float(parsed.get("turn_overall_score", 70.0)),
            strengths=list(parsed.get("strengths", ["Clear explanation"])),
            areas_for_improvement=list(parsed.get("areas_for_improvement", ["Discuss more edge cases"])),
            follow_up_recommended=bool(parsed.get("follow_up_recommended", False)),
            suggested_follow_up=parsed.get("suggested_follow_up")
        )

    def generate_final_summary(
        self,
        role_target: str,
        turns_data: List[Dict[str, Any]],
        candidate_name: str,
    ) -> SummarySchema:
        """Synthesizes final mock interview evaluation report."""
        prompt = (
            f"Synthesize the overall performance report for candidate '{candidate_name}' for target role '{role_target}'.\n\n"
            f"Interview Turns Summary:\n"
        )
        for i, turn in enumerate(turns_data, 1):
            prompt += f"Turn {i}: {turn.get('question_text')} | Answer: {turn.get('student_answer')} | Score: {turn.get('score')}\n"

        prompt += (
            f"\nReturn strictly valid JSON with:\n"
            f"overall_score (0-100 float), executive_summary (string), "
            f"competency_scores (dict mapping skill string to float score), key_strengths (list of strings), "
            f"priority_growth_areas (list of strings), hiring_readiness_recommendation (string)."
        )

        payload = {
            "model": self.model,
            "messages": [
                {"role": "system", "content": "You are an executive placement committee evaluator. Output JSON only."},
                {"role": "user", "content": prompt}
            ],
            "temperature": 0.3
        }

        with httpx.Client(timeout=30.0) as client:
            res = client.post(f"{self.base_url}/v1/chat/completions", headers=self._get_headers(), json=payload)
            data = res.json()
            raw_text = data["choices"][0]["message"]["content"]

        clean = raw_text.strip()
        if "```" in clean:
            clean = re.sub(r"^```[a-z]*\n", "", clean)
            clean = re.sub(r"\n```$", "", clean)

        parsed = json.loads(clean.strip())
        return SummarySchema(
            overall_score=float(parsed.get("overall_score", 75.0)),
            executive_summary=parsed.get("executive_summary", "Candidate demonstrated good problem-solving ability."),
            competency_scores=parsed.get("competency_scores", {"Core Competency": 75.0}),
            key_strengths=list(parsed.get("key_strengths", ["Solid technical fundamentals"])),
            priority_growth_areas=list(parsed.get("priority_growth_areas", ["Distributed locking specifics"])),
            hiring_readiness_recommendation=parsed.get("hiring_readiness_recommendation", "Ready for Tier-1 Technical Rounds")
        )


openjarvis_service = OpenJarvisInterviewService()
