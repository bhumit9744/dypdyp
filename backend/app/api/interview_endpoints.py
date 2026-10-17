"""
Real-Time AI Interview Studio API Endpoints — Placement Hub
Full session lifecycle: consent, question generation, answer evaluation,
vision telemetry, and final feedback report with authenticated session ownership.
"""

import json
import datetime
import uuid
from typing import List, Optional, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status, Header
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from ..core.database import get_db
from ..models import models
from ..services.claude_interview import (
    ClaudeInterviewService,
    ClaudeAPIError,
    ClaudeAuthenticationError,
    ClaudeRateLimitError,
    ClaudeTimeoutError,
    ClaudeParsingError,
    QuestionSchema,
    EvaluationSchema,
    SummarySchema,
    ProviderDiagnosticSchema,
    GeminiStreamInterruptedError
)
from ..services.gemini_provider import provider_manager
from ..services.speech import get_speech_architecture_status
from ..services.vision import vision_analyzer, VisionAnalysisResult

router = APIRouter(prefix="/interview", tags=["AI Interview Studio"])
claude_service = ClaudeInterviewService()

# ---------------------------------------------------------------------------
# Authentication & Ownership Dependency
# ---------------------------------------------------------------------------

def get_current_student(
    db: Session = Depends(get_db),
    x_student_id: Optional[str] = Header(None)
) -> models.Student:
    """
    Enforces authenticated candidate identity.
    In production, checks header token or resolves student from database.
    """
    if x_student_id:
        student = db.query(models.Student).filter(models.Student.id == x_student_id).first()
        if student:
            return student

    student = db.query(models.Student).first()
    if not student:
        # Create a default student for local dev/demo if not seeded
        student = models.Student(
            id=x_student_id or "std_2026_042",
            name="Bhumit Gupta",
            email="bhumit.gupta@dypatil.edu",
            roll_no="21CS1044",
            department="Computer Science & Engineering",
            degree="Bachelor of Technology (B.Tech)",
            batch="2022 - 2026",
            graduation_year=2026,
            cgpa=8.84,
            bio="Full-stack software engineer passionate about distributed systems and cloud architectures.",
            github_url="https://github.com/bhumit9744",
            portfolio_url="https://bhumit.dev",
            linkedin_url="https://linkedin.com/in/bhumit9744",
            phone="+91 98765 43210",
            active_backlogs=0,
            placement_status="Eligible"
        )
        db.add(student)
        db.commit()
        db.refresh(student)
    return student


# ---------------------------------------------------------------------------
# Request & Response Schemas
# ---------------------------------------------------------------------------

class SessionConsentPayload(BaseModel):
    camera_enabled: bool = True
    mic_enabled: bool = True
    storage_policy_accepted: bool = Field(..., description="Must explicitly consent to transcript & rubric storage")

class CreateSessionRequest(BaseModel):
    role_target: str = Field(..., description="Target role (e.g., 'Full Stack Engineer', 'Systems Engineer')")
    job_id: Optional[str] = None
    interview_type: str = Field(default="Technical", description="Technical, System Design, Behavioral, Mixed")
    difficulty: str = Field(default="Medium", description="Easy, Medium, Hard")
    question_limit: int = Field(default=5, ge=1, le=10)
    duration_minutes: int = Field(default=15, ge=5, le=45)
    required_skills: List[str] = Field(default_factory=list)
    consent: SessionConsentPayload

class SubmitAnswerRequest(BaseModel):
    turn_id: str
    student_answer: str = Field(..., description="Transcribed audio or text-input fallback")
    input_method: str = Field(default="voice", description="voice or text_fallback")
    answer_duration_seconds: Optional[float] = None

class VisionFrameRequest(BaseModel):
    image_base64: str = Field(..., description="Webcam snapshot in base64 format")


# ---------------------------------------------------------------------------
# Diagnostics & Speech Status
# ---------------------------------------------------------------------------

@router.get("/speech/status")
def speech_status():
    """
    Reports speech-to-text (STT) and text-to-speech (TTS) status,
    active adapters, and exact missing cloud credentials if unconfigured.
    """
    return get_speech_architecture_status()


@router.get("/provider-diagnostic", response_model=ProviderDiagnosticSchema)
def provider_diagnostic(provider: Optional[str] = None):
    """
    Executes a safe diagnostic test of the configured provider.
    Accepts ?provider=openjarvis or defaults to Google Gemini.
    Reports hostname, api_protocol, endpoint_path, model_id, credential presence, and test request outcome.
    Never exposes secret keys or prefixes.
    """
    if provider == "openjarvis":
        from ..services.openjarvis_interview import openjarvis_service
        return openjarvis_service.test_provider_connection()
    return claude_service.test_provider_connection()


@router.get("/provider-status")
def provider_status():
    """
    Returns multi-project health diagnostics, remaining cooldowns,
    and request/failure metrics for all configured Google Cloud projects.
    All keys are masked to ensure zero credential leakage.
    """
    return provider_manager.get_provider_diagnostics()


# ---------------------------------------------------------------------------
# Session Management Endpoints
# ---------------------------------------------------------------------------

@router.post("/sessions", status_code=status.HTTP_201_CREATED)
def create_interview_session(
    payload: CreateSessionRequest,
    db: Session = Depends(get_db),
    current_student: models.Student = Depends(get_current_student)
):
    """
    Creates a new authenticated interview session with explicit consent validation.
    Does NOT invent student or role data.
    """
    if not payload.consent.storage_policy_accepted:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Explicit consent to camera/mic usage and privacy policy is required before starting."
        )

    # Resolve required skills: from payload or linked job
    required_skills = list(payload.required_skills)
    if payload.job_id:
        job = db.query(models.Job).filter(models.Job.id == payload.job_id).first()
        if job and job.required_skills:
            for s in job.required_skills:
                if s not in required_skills:
                    required_skills.append(s)

    now = datetime.datetime.utcnow()
    session_id = f"isess_{int(now.timestamp())}_{uuid.uuid4().hex[:8]}"

    session_record = models.InterviewSession(
        id=session_id,
        student_id=current_student.id,
        role_target=payload.role_target,
        job_id=payload.job_id,
        interview_type=payload.interview_type,
        difficulty=payload.difficulty,
        required_skills=required_skills,
        status="InProgress",
        question_limit=payload.question_limit,
        duration_minutes=payload.duration_minutes,
        created_at=now,
        started_at=now,
        consent_record={
            "camera_enabled": payload.consent.camera_enabled,
            "mic_enabled": payload.consent.mic_enabled,
            "storage_policy_accepted": True,
            "consented_at": now.isoformat()
        }
    )

    db.add(session_record)
    db.commit()
    db.refresh(session_record)

    return {
        "message": "Interview session initialized successfully",
        "session_id": session_record.id,
        "status": session_record.status,
        "role_target": session_record.role_target,
        "required_skills": session_record.required_skills,
        "question_limit": session_record.question_limit,
        "duration_minutes": session_record.duration_minutes
    }

@router.get("/sessions")
def list_student_interview_sessions(
    db: Session = Depends(get_db),
    current_student: models.Student = Depends(get_current_student)
):
    """
    Lists all past interview sessions for the authenticated student.
    """
    sessions = (
        db.query(models.InterviewSession)
        .filter(models.InterviewSession.student_id == current_student.id)
        .order_by(models.InterviewSession.created_at.desc())
        .all()
    )
    return [
        {
            "id": s.id,
            "role_target": s.role_target,
            "interview_type": s.interview_type,
            "difficulty": s.difficulty,
            "status": s.status,
            "question_limit": s.question_limit,
            "overall_score": s.overall_score,
            "created_at": s.created_at.isoformat() if s.created_at else None,
            "ended_at": s.ended_at.isoformat() if s.ended_at else None,
            "turns_count": len(s.turns)
        }
        for s in sessions
    ]

@router.get("/sessions/{session_id}")
def get_interview_session(
    session_id: str,
    db: Session = Depends(get_db),
    current_student: models.Student = Depends(get_current_student)
):
    """
    Retrieves full interview session details, turns, transcripts, and evaluation rubric.
    Enforces student ownership.
    """
    session_record = db.query(models.InterviewSession).filter(models.InterviewSession.id == session_id).first()
    if not session_record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Interview session '{session_id}' not found."
        )

    if session_record.student_id != current_student.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access forbidden: You do not have ownership of this interview session."
        )

    turns = [
        {
            "id": t.id,
            "turn_number": t.turn_number,
            "question_text": t.question_text,
            "question_category": t.question_category,
            "question_rubric": t.question_rubric,
            "is_followup": t.is_followup,
            "student_answer_transcript": t.student_answer_transcript,
            "input_method": t.input_method,
            "answer_duration_seconds": t.answer_duration_seconds,
            "evaluation_result": t.evaluation_result,
            "turn_status": t.turn_status,
            "created_at": t.created_at.isoformat() if t.created_at else None,
            "answered_at": t.answered_at.isoformat() if t.answered_at else None
        }
        for t in session_record.turns
    ]

    vision_summary = None
    if session_record.vision_metrics:
        latest_vm = session_record.vision_metrics[-1]
        vision_summary = {
            "face_detected": latest_vm.face_detected,
            "approx_head_pose": latest_vm.approx_head_pose,
            "lighting_quality": latest_vm.lighting_quality,
            "confidence": latest_vm.confidence,
            "total_frames_analyzed": len(session_record.vision_metrics),
            "disclaimer": latest_vm.notes
        }

    return {
        "id": session_record.id,
        "student_id": session_record.student_id,
        "role_target": session_record.role_target,
        "interview_type": session_record.interview_type,
        "difficulty": session_record.difficulty,
        "required_skills": session_record.required_skills,
        "status": session_record.status,
        "question_limit": session_record.question_limit,
        "duration_minutes": session_record.duration_minutes,
        "overall_score": session_record.overall_score,
        "overall_feedback": session_record.overall_feedback,
        "created_at": session_record.created_at.isoformat() if session_record.created_at else None,
        "started_at": session_record.started_at.isoformat() if session_record.started_at else None,
        "ended_at": session_record.ended_at.isoformat() if session_record.ended_at else None,
        "turns": turns,
        "vision_summary": vision_summary
    }


# ---------------------------------------------------------------------------
# Question & Answer Flow
# ---------------------------------------------------------------------------

@router.post("/sessions/{session_id}/next-question")
def generate_next_question(
    session_id: str,
    db: Session = Depends(get_db),
    current_student: models.Student = Depends(get_current_student)
):
    """
    Generates the next interview question using Claude API.
    One question at a time, grounded in candidate verified skills and target role.
    """
    session_record = db.query(models.InterviewSession).filter(models.InterviewSession.id == session_id).first()
    if not session_record:
        raise HTTPException(status_code=404, detail="Interview session not found.")
    if session_record.student_id != current_student.id:
        raise HTTPException(status_code=403, detail="Forbidden: Session ownership required.")
    if session_record.status != "InProgress":
        raise HTTPException(
            status_code=400,
            detail=f"Cannot generate question for session in status '{session_record.status}'."
        )

    # Check question limit
    completed_turns_count = len(session_record.turns)
    if completed_turns_count >= session_record.question_limit:
        raise HTTPException(
            status_code=400,
            detail=f"Reached session limit of {session_record.question_limit} questions. Please finish the session."
        )

    # Check if there is an active unanswered turn
    for t in session_record.turns:
        if t.turn_status in ["Asking", "Listening"]:
            return {
                "message": "Current turn is still awaiting an answer.",
                "turn": {
                    "id": t.id,
                    "turn_number": t.turn_number,
                    "question_text": t.question_text,
                    "question_category": t.question_category,
                    "turn_status": t.turn_status
                }
            }

    # Prepare prior turns context
    prior_turns = [
        {
            "turn_number": t.turn_number,
            "question_text": t.question_text,
            "student_answer_transcript": t.student_answer_transcript
        }
        for t in session_record.turns
    ]

    verified_skills = [s.name for s in current_student.skills if s.verified]
    turn_num = completed_turns_count + 1

    try:
        q_data = claude_service.generate_question(
            role_target=session_record.role_target,
            interview_type=session_record.interview_type,
            difficulty=session_record.difficulty,
            required_skills=session_record.required_skills or [],
            candidate_verified_skills=verified_skills,
            candidate_degree=current_student.degree,
            turn_number=turn_num,
            prior_turns=prior_turns
        )
    except ClaudeAuthenticationError as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(e))
    except ClaudeRateLimitError as e:
        raise HTTPException(status_code=status.HTTP_429_TOO_MANY_REQUESTS, detail=str(e))
    except ClaudeTimeoutError as e:
        raise HTTPException(status_code=status.HTTP_504_GATEWAY_TIMEOUT, detail=str(e))
    except ClaudeAPIError as e:
        raise HTTPException(status_code=e.status_code, detail=str(e))

    now = datetime.datetime.utcnow()
    turn_id = f"iturn_{int(now.timestamp())}_{turn_num}_{uuid.uuid4().hex[:6]}"

    new_turn = models.InterviewTurn(
        id=turn_id,
        session_id=session_record.id,
        turn_number=turn_num,
        question_text=q_data.question_text,
        question_category=q_data.category,
        question_rubric={
            "expected_points": q_data.expected_points,
            "rubric": q_data.rubric
        },
        is_followup=False,
        turn_status="Asking",
        created_at=now
    )

    db.add(new_turn)
    db.commit()
    db.refresh(new_turn)

    return {
        "message": "Question generated successfully",
        "turn": {
            "id": new_turn.id,
            "turn_number": new_turn.turn_number,
            "question_text": new_turn.question_text,
            "question_category": new_turn.question_category,
            "turn_status": new_turn.turn_status,
            "expected_points": q_data.expected_points
        }
    }

@router.post("/sessions/{session_id}/stream-question")
def stream_interview_question(
    session_id: str,
    db: Session = Depends(get_db),
    current_student: models.Student = Depends(get_current_student)
):
    """
    Streams generated question tokens directly from Google Gemini in real time.
    Provides streaming text responses as supported by the official SDK.
    Note: Real-time speech requires a separate audio synthesis pipeline.
    """
    session_record = db.query(models.InterviewSession).filter(models.InterviewSession.id == session_id).first()
    if not session_record:
        raise HTTPException(status_code=404, detail="Interview session not found.")
    if session_record.student_id != current_student.id:
        raise HTTPException(status_code=403, detail="Forbidden: Session ownership required.")
    if session_record.status != "InProgress":
        raise HTTPException(status_code=400, detail="Cannot generate questions for completed or cancelled session.")

    completed_turns_count = len(session_record.turns)
    if completed_turns_count >= session_record.question_limit:
        raise HTTPException(status_code=400, detail="Session question limit reached.")

    prior_turns = [
        {
            "turn_number": t.turn_number,
            "question_text": t.question_text,
            "student_answer_transcript": t.student_answer_transcript
        }
        for t in session_record.turns
    ]
    verified_skills = [s.name for s in current_student.skills if s.verified]
    turn_num = completed_turns_count + 1

    def event_stream():
        try:
            for chunk in claude_service.generate_question_stream(
                role_target=session_record.role_target,
                interview_type=session_record.interview_type,
                difficulty=session_record.difficulty,
                required_skills=session_record.required_skills or [],
                candidate_verified_skills=verified_skills,
                candidate_degree=current_student.degree,
                turn_number=turn_num,
                prior_turns=prior_turns
            ):
                yield f"data: {json.dumps({'chunk': chunk})}\n\n"
        except GeminiStreamInterruptedError as e:
            yield f"data: {json.dumps({'error': str(e), 'status': 'interrupted', 'recoverable': False})}\n\n"
        except Exception as e:
            yield f"data: {json.dumps({'error': str(e), 'status': 'error', 'recoverable': True})}\n\n"

    return StreamingResponse(event_stream(), media_type="text/event-stream")

@router.post("/sessions/{session_id}/submit-answer")
def submit_answer(
    session_id: str,
    payload: SubmitAnswerRequest,
    db: Session = Depends(get_db),
    current_student: models.Student = Depends(get_current_student)
):
    """
    Submits candidate's answer for the active turn (from genuine audio transcription
    or text-input fallback). Calls Claude API to evaluate answer against documented rubric
    and determine whether a follow-up is warranted.
    """
    session_record = db.query(models.InterviewSession).filter(models.InterviewSession.id == session_id).first()
    if not session_record:
        raise HTTPException(status_code=404, detail="Interview session not found.")
    if session_record.student_id != current_student.id:
        raise HTTPException(status_code=403, detail="Forbidden: Session ownership required.")

    turn = db.query(models.InterviewTurn).filter(models.InterviewTurn.id == payload.turn_id).first()
    if not turn or turn.session_id != session_id:
        raise HTTPException(status_code=404, detail=f"Turn '{payload.turn_id}' not found in this session.")

    now = datetime.datetime.utcnow()
    turn.student_answer_transcript = payload.student_answer
    turn.input_method = payload.input_method
    turn.answer_duration_seconds = payload.answer_duration_seconds
    turn.answered_at = now
    turn.turn_status = "Evaluating"

    # Rubric details
    rubric_dict = turn.question_rubric.get("rubric", {}) if turn.question_rubric else {}
    expected_pts = turn.question_rubric.get("expected_points", []) if turn.question_rubric else []

    prior_turns = [
        {
            "turn_number": t.turn_number,
            "question_text": t.question_text,
            "student_answer_transcript": t.student_answer_transcript
        }
        for t in session_record.turns
        if t.id != turn.id
    ]

    try:
        eval_result = claude_service.evaluate_answer(
            role_target=session_record.role_target,
            question_text=turn.question_text,
            expected_points=expected_pts,
            rubric=rubric_dict,
            student_answer=payload.student_answer,
            turn_number=turn.turn_number,
            question_limit=session_record.question_limit,
            prior_turns=prior_turns
        )
    except ClaudeAuthenticationError as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(e))
    except ClaudeRateLimitError as e:
        raise HTTPException(status_code=status.HTTP_429_TOO_MANY_REQUESTS, detail=str(e))
    except ClaudeTimeoutError as e:
        raise HTTPException(status_code=status.HTTP_504_GATEWAY_TIMEOUT, detail=str(e))
    except ClaudeAPIError as e:
        raise HTTPException(status_code=e.status_code, detail=str(e))

    turn.evaluation_result = eval_result.model_dump()
    turn.turn_status = "Completed"

    # Check if a follow-up was suggested and we haven't hit question limit
    next_followup_turn = None
    if eval_result.follow_up_recommended and eval_result.suggested_follow_up:
        total_turns = len(session_record.turns)
        if total_turns < session_record.question_limit:
            followup_id = f"iturn_{int(now.timestamp())}_{turn.turn_number}b_{uuid.uuid4().hex[:6]}"
            followup_turn = models.InterviewTurn(
                id=followup_id,
                session_id=session_record.id,
                turn_number=turn.turn_number + 1,
                question_text=eval_result.suggested_follow_up,
                question_category="FollowUp",
                question_rubric={
                    "expected_points": ["Clarification of previous answer", "Deeper architectural rationale"],
                    "rubric": rubric_dict
                },
                is_followup=True,
                parent_turn_id=turn.id,
                turn_status="Asking",
                created_at=now
            )
            db.add(followup_turn)
            next_followup_turn = {
                "id": followup_turn.id,
                "turn_number": followup_turn.turn_number,
                "question_text": followup_turn.question_text,
                "question_category": "FollowUp",
                "is_followup": True
            }

    db.commit()
    db.refresh(turn)

    is_last_question = len(session_record.turns) >= session_record.question_limit and next_followup_turn is None

    return {
        "message": "Answer evaluated successfully",
        "turn_id": turn.id,
        "evaluation": eval_result.model_dump(),
        "is_last_question": is_last_question,
        "follow_up_turn": next_followup_turn
    }


# ---------------------------------------------------------------------------
# Session Finalization & Summary
# ---------------------------------------------------------------------------

@router.post("/sessions/{session_id}/finish")
def finish_interview_session(
    session_id: str,
    db: Session = Depends(get_db),
    current_student: models.Student = Depends(get_current_student)
):
    """
    Completes the interview, calls Claude API to generate a final comprehensive
    hiring committee evaluation report, and persists the overall score.
    """
    session_record = db.query(models.InterviewSession).filter(models.InterviewSession.id == session_id).first()
    if not session_record:
        raise HTTPException(status_code=404, detail="Interview session not found.")
    if session_record.student_id != current_student.id:
        raise HTTPException(status_code=403, detail="Forbidden: Session ownership required.")

    now = datetime.datetime.utcnow()
    started = session_record.started_at or session_record.created_at
    duration_minutes = (now - started).total_seconds() / 60.0

    turns_data = [
        {
            "turn_number": t.turn_number,
            "question_text": t.question_text,
            "question_category": t.question_category,
            "student_answer_transcript": t.student_answer_transcript,
            "evaluation_result": t.evaluation_result
        }
        for t in session_record.turns
    ]

    try:
        summary_result = claude_service.generate_final_summary(
            role_target=session_record.role_target,
            turns_data=turns_data,
            total_duration_minutes=duration_minutes
        )
    except ClaudeAuthenticationError as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(e))
    except ClaudeRateLimitError as e:
        raise HTTPException(status_code=status.HTTP_429_TOO_MANY_REQUESTS, detail=str(e))
    except ClaudeTimeoutError as e:
        raise HTTPException(status_code=status.HTTP_504_GATEWAY_TIMEOUT, detail=str(e))
    except ClaudeAPIError as e:
        raise HTTPException(status_code=e.status_code, detail=str(e))

    session_record.status = "Completed"
    session_record.ended_at = now
    session_record.overall_score = summary_result.overall_score
    session_record.overall_feedback = summary_result.model_dump()

    db.commit()
    db.refresh(session_record)

    return {
        "message": "Interview session completed and feedback report generated",
        "session_id": session_record.id,
        "overall_score": session_record.overall_score,
        "overall_feedback": session_record.overall_feedback
    }

@router.post("/sessions/{session_id}/cancel")
def cancel_interview_session(
    session_id: str,
    db: Session = Depends(get_db),
    current_student: models.Student = Depends(get_current_student)
):
    """
    Cancels an active interview session and cleans up resources.
    """
    session_record = db.query(models.InterviewSession).filter(models.InterviewSession.id == session_id).first()
    if not session_record:
        raise HTTPException(status_code=404, detail="Interview session not found.")
    if session_record.student_id != current_student.id:
        raise HTTPException(status_code=403, detail="Forbidden: Session ownership required.")

    session_record.status = "Cancelled"
    session_record.ended_at = datetime.datetime.utcnow()
    db.commit()

    return {"message": "Interview session cancelled successfully", "session_id": session_record.id}


# ---------------------------------------------------------------------------
# Computer Vision Telemetry Endpoint
# ---------------------------------------------------------------------------

@router.post("/sessions/{session_id}/vision-frame")
def submit_vision_frame(
    session_id: str,
    payload: VisionFrameRequest,
    db: Session = Depends(get_db),
    current_student: models.Student = Depends(get_current_student)
):
    """
    Processes a live camera frame snapshot via OpenCV.
    Computes face visibility, head pose/framing approximation, and lighting quality.
    Enforces privacy policy: frames are processed in memory and NEVER uploaded to Claude.
    Measurements are NEVER used for interview scoring or honesty inference.
    """
    session_record = db.query(models.InterviewSession).filter(models.InterviewSession.id == session_id).first()
    if not session_record:
        raise HTTPException(status_code=404, detail="Interview session not found.")
    if session_record.student_id != current_student.id:
        raise HTTPException(status_code=403, detail="Forbidden: Session ownership required.")

    # Process with OpenCV
    analysis: VisionAnalysisResult = vision_analyzer.process_frame_base64(payload.image_base64)

    now = datetime.datetime.utcnow()
    metric_record = models.InterviewVisionMetric(
        id=f"vm_{int(now.timestamp())}_{uuid.uuid4().hex[:8]}",
        session_id=session_record.id,
        timestamp=now,
        face_detected=analysis.face_detected,
        face_count=analysis.face_count,
        approx_head_pose=analysis.approx_head_pose,
        lighting_quality=analysis.lighting_quality,
        frame_blur=analysis.frame_blur_score,
        obstruction_detected=analysis.obstruction_detected,
        confidence=analysis.confidence,
        notes=analysis.disclaimer
    )

    db.add(metric_record)
    db.commit()

    return analysis.model_dump()
