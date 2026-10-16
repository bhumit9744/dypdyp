"""
Claude AI Interview Engine — Placement Hub
Strictly backend-only Anthropic Claude integration.
Validates schemas, handles API errors honestly without fabricated fallbacks,
and grounds questions in verified role requirements and student skill proofs.
"""

import json
import logging
from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field

from ..core.config import settings

logger = logging.getLogger("claude_interview")

# ---------------------------------------------------------------------------
# Custom Typed Exceptions
# ---------------------------------------------------------------------------

class ClaudeAPIError(Exception):
    """Base exception for Claude API failures."""
    def __init__(self, message: str, status_code: int = 502):
        super().__init__(message)
        self.message = message
        self.status_code = status_code

class ClaudeAuthenticationError(ClaudeAPIError):
    """Raised when Anthropic API Key is missing or rejected (401)."""
    def __init__(self, message: str = "Invalid or unauthenticated Anthropic API key."):
        super().__init__(message, status_code=401)

class ClaudeRateLimitError(ClaudeAPIError):
    """Raised when Anthropic API rate limit is exceeded (429)."""
    def __init__(self, message: str = "Anthropic API rate limit reached. Please retry in a moment."):
        super().__init__(message, status_code=429)

class ClaudeTimeoutError(ClaudeAPIError):
    """Raised when Anthropic API times out."""
    def __init__(self, message: str = "Anthropic API request timed out."):
        super().__init__(message, status_code=504)

class ClaudeParsingError(ClaudeAPIError):
    """Raised when response fails schema validation."""
    def __init__(self, message: str = "Failed to parse structured Claude evaluation response."):
        super().__init__(message, status_code=502)


# ---------------------------------------------------------------------------
# Pydantic Schemas for Structured Claude Outputs
# ---------------------------------------------------------------------------

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
# Claude Interview Service
# ---------------------------------------------------------------------------

class ClaudeInterviewService:
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = (api_key or settings.ANTHROPIC_API_KEY).strip()
        self.model = "claude-3-5-sonnet-latest"

    def _get_client(self):
        if not self.api_key or self.api_key.startswith("your_") or len(self.api_key) < 8:
            raise ClaudeAuthenticationError(
                "Anthropic Claude API key is not configured. "
                "Set ANTHROPIC_API_KEY in backend/.env with a valid Anthropic key."
            )
        try:
            import anthropic
            kwargs = {"api_key": self.api_key}
            if getattr(settings, "ANTHROPIC_BASE_URL", None) and settings.ANTHROPIC_BASE_URL.strip():
                kwargs["base_url"] = settings.ANTHROPIC_BASE_URL.strip()
            return anthropic.Anthropic(**kwargs)
        except Exception as e:
            raise ClaudeAPIError(f"Failed to initialize Anthropic client: {e}")

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
            "You are an expert technical interviewer conducting a rigorous, evidence-grounded campus placement interview.\n"
            "Generate exactly ONE focused, realistic question for the specified role.\n"
            "Never ask generic or trivia questions. Focus on core problem-solving, architectural choices, "
            "practical edge cases, and real production experience.\n"
            "Return ONLY a valid JSON object matching the requested schema without any markdown formatting or commentary."
        )

        user_prompt = (
            f"Role: {role_target}\n"
            f"Interview Type: {interview_type}\n"
            f"Difficulty Level: {difficulty}\n"
            f"Required Skills for Role: {skills_str}\n"
            f"Candidate Verified Skills: {verified_str}\n"
            f"Candidate Academic Background: {candidate_degree}\n"
            f"Current Question Number: {turn_number}\n"
            f"{history_context}\n\n"
            "Output JSON Schema:\n"
            "{\n"
            '  "question_text": "<string: concise, direct question>",\n'
            '  "category": "<Technical | Problem Solving | Experience | FollowUp>",\n'
            '  "expected_points": ["<concept 1>", "<concept 2>", "<concept 3>"],\n'
            '  "rubric": {\n'
            '    "correctness": "<what constitutes correct facts/code>",\n'
            '    "relevance": "<what must directly address the prompt>",\n'
            '    "completeness": "<what corner cases or trade-offs should be covered>",\n'
            '    "clarity": "<structure and brevity expectation>",\n'
            '    "evidence": "<practical metrics or project application expected>"\n'
            "  },\n"
            f'  "difficulty": "{difficulty}"\n'
            "}"
        )

        try:
            import anthropic
            response = client.messages.create(
                model=self.model,
                max_tokens=600,
                system=system_prompt,
                messages=[{"role": "user", "content": user_prompt}]
            )
            raw_text = response.content[0].text.strip()
            data = self._extract_json(raw_text)
            return QuestionSchema(**data)
        except anthropic.AuthenticationError as e:
            raise ClaudeAuthenticationError(f"Anthropic authentication failed (401): {e}")
        except anthropic.RateLimitError as e:
            raise ClaudeRateLimitError(f"Anthropic rate limit exceeded (429): {e}")
        except anthropic.APITimeoutError as e:
            raise ClaudeTimeoutError(f"Anthropic request timed out: {e}")
        except (json.JSONDecodeError, ValueError) as e:
            raise ClaudeParsingError(f"Invalid structured JSON response from Claude: {e}")
        except ClaudeAPIError:
            raise
        except Exception as e:
            raise ClaudeAPIError(f"Claude API question generation failed: {type(e).__name__} - {e}")

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
        client = self._get_client()

        if not student_answer or not student_answer.strip():
            # Return honest zero-content evaluation
            return EvaluationSchema(
                correctness_score=0.0,
                relevance_score=0.0,
                completeness_score=0.0,
                clarity_score=0.0,
                evidence_score=0.0,
                turn_overall_score=0.0,
                strengths=[],
                areas_for_improvement=["No answer content was provided or audio transcript was empty."],
                follow_up_recommended=False,
                suggested_follow_up=None
            )

        system_prompt = (
            "You are a strict, objective campus recruitment evaluator.\n"
            "Evaluate the candidate's actual answer against the question rubric.\n"
            "Grade objectively on five dimensions (0 to 100):\n"
            "- Correctness: Accurate algorithms, syntax, architectural principles.\n"
            "- Relevance: Addressed the exact question without generic padding.\n"
            "- Completeness: Handled edge cases, trade-offs, and failure modes.\n"
            "- Clarity: Cohesive structure, clear reasoning, concise articulation.\n"
            "- Supporting Evidence: Real production anecdotes, measurements, or code rationale.\n"
            "If the answer misses critical depth or reveals an interesting nuance, set follow_up_recommended to true "
            "and suggest a follow-up question, unless we are already on the final question limit.\n"
            "Return ONLY a valid JSON object matching the requested schema."
        )

        user_prompt = (
            f"Target Role: {role_target}\n"
            f"Turn: {turn_number} of {question_limit}\n"
            f"Question Asked: {question_text}\n"
            f"Expected Points: {', '.join(expected_points)}\n"
            f"Grading Rubric:\n{json.dumps(rubric, indent=2)}\n\n"
            f"Candidate's Actual Answer:\n\"{student_answer}\"\n\n"
            "Output JSON Schema:\n"
            "{\n"
            '  "correctness_score": <number 0-100>,\n'
            '  "relevance_score": <number 0-100>,\n'
            '  "completeness_score": <number 0-100>,\n'
            '  "clarity_score": <number 0-100>,\n'
            '  "evidence_score": <number 0-100>,\n'
            '  "turn_overall_score": <number 0-100>,\n'
            '  "strengths": ["<strength 1>", "<strength 2>"],\n'
            '  "areas_for_improvement": ["<gap 1>", "<gap 2>"],\n'
            '  "follow_up_recommended": <true|false>,\n'
            '  "suggested_follow_up": "<string or null>"\n'
            "}"
        )

        try:
            import anthropic
            response = client.messages.create(
                model=self.model,
                max_tokens=700,
                system=system_prompt,
                messages=[{"role": "user", "content": user_prompt}]
            )
            raw_text = response.content[0].text.strip()
            data = self._extract_json(raw_text)
            
            # If at question limit, suppress follow up
            if turn_number >= question_limit:
                data["follow_up_recommended"] = False
                data["suggested_follow_up"] = None

            return EvaluationSchema(**data)
        except anthropic.AuthenticationError as e:
            raise ClaudeAuthenticationError(f"Anthropic authentication failed (401): {e}")
        except anthropic.RateLimitError as e:
            raise ClaudeRateLimitError(f"Anthropic rate limit exceeded (429): {e}")
        except anthropic.APITimeoutError as e:
            raise ClaudeTimeoutError(f"Anthropic request timed out: {e}")
        except (json.JSONDecodeError, ValueError) as e:
            raise ClaudeParsingError(f"Invalid structured JSON response from Claude: {e}")
        except ClaudeAPIError:
            raise
        except Exception as e:
            raise ClaudeAPIError(f"Claude API answer evaluation failed: {type(e).__name__} - {e}")

    def generate_final_summary(
        self,
        role_target: str,
        turns_data: List[Dict[str, Any]],
        total_duration_minutes: float
    ) -> SummarySchema:
        """
        Synthesizes the overall interview performance across all turns into
        a comprehensive, actionable report.
        """
        client = self._get_client()

        session_transcript = ""
        for t in turns_data:
            session_transcript += (
                f"\n--- Turn {t.get('turn_number')} ({t.get('question_category', 'Technical')}) ---\n"
                f"Question: {t.get('question_text')}\n"
                f"Candidate Answer: {t.get('student_answer_transcript') or '[No answer recorded]'}\n"
                f"Evaluation: {json.dumps(t.get('evaluation_result') or {})}\n"
            )

        system_prompt = (
            "You are a Senior Technical Hiring Committee Lead summarizing an interview.\n"
            "Review the full session transcript and evaluations.\n"
            "Produce an honest, evidence-grounded executive summary report with actionable feedback.\n"
            "Return ONLY a valid JSON object matching the requested schema."
        )

        user_prompt = (
            f"Target Role: {role_target}\n"
            f"Total Duration: {total_duration_minutes:.1f} minutes\n"
            f"Full Interview Transcript:\n{session_transcript}\n\n"
            "Output JSON Schema:\n"
            "{\n"
            '  "overall_score": <number 0-100>,\n'
            '  "executive_summary": "<paragraph summarizing technical depth, communication, and readiness>",\n'
            '  "competency_scores": {\n'
            '    "SystemDesign": <number 0-100>,\n'
            '    "DataStructuresAlgorithms": <number 0-100>,\n'
            '    "ProblemSolving": <number 0-100>,\n'
            '    "Communication": <number 0-100>\n'
            "  },\n"
            '  "key_strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],\n'
            '  "priority_growth_areas": ["<growth 1>", "<growth 2>", "<growth 3>"],\n'
            '  "hiring_readiness_recommendation": "<Ready for Tier-1 Technical Rounds | Needs Focused Preparation | Developing Fundamentals>"\n'
            "}"
        )

        try:
            import anthropic
            response = client.messages.create(
                model=self.model,
                max_tokens=850,
                system=system_prompt,
                messages=[{"role": "user", "content": user_prompt}]
            )
            raw_text = response.content[0].text.strip()
            data = self._extract_json(raw_text)
            return SummarySchema(**data)
        except anthropic.AuthenticationError as e:
            raise ClaudeAuthenticationError(f"Anthropic authentication failed (401): {e}")
        except anthropic.RateLimitError as e:
            raise ClaudeRateLimitError(f"Anthropic rate limit exceeded (429): {e}")
        except anthropic.APITimeoutError as e:
            raise ClaudeTimeoutError(f"Anthropic request timed out: {e}")
        except (json.JSONDecodeError, ValueError) as e:
            raise ClaudeParsingError(f"Invalid structured JSON response from Claude: {e}")
        except ClaudeAPIError:
            raise
        except Exception as e:
            raise ClaudeAPIError(f"Claude API final summary generation failed: {type(e).__name__} - {e}")

    def _extract_json(self, text: str) -> Dict[str, Any]:
        """
        Safely extracts JSON from Claude's response text, handling potential
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

        # Find first { and last }
        start = text.find("{")
        end = text.rfind("}")
        if start != -1 and end != -1 and end > start:
            text = text[start:end+1]

        return json.loads(text)
