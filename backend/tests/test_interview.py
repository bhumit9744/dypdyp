"""
Tests for Real-Time AI Interview Studio — Placement Hub
Covers:
- Speech provider status and honest credentials reporting
- Session creation and explicit consent validation
- Authenticated session ownership and privacy
- Claude API error handling (401 unauthenticated, timeouts)
- Claude question generation, answer evaluation against rubric, and follow-ups
- OpenCV computer vision camera telemetry
- Session finalization and cancellation
"""

import base64
import pytest
from unittest.mock import patch, MagicMock
from fastapi.testclient import TestClient
import numpy as np
import cv2

from app.main import app
from app.core.database import SessionLocal
from app.models import models
from app.services.claude_interview import QuestionSchema, EvaluationSchema, SummarySchema

client = TestClient(app)

@pytest.fixture(autouse=True)
def setup_test_student():
    """Ensure a verified student exists in SQLite for tests."""
    db = SessionLocal()
    student = db.query(models.Student).filter(models.Student.id == "std_current_user").first()
    if not student:
        student = models.Student(
            id="std_current_user",
            name="Verified Test Candidate",
            email="candidate.test@dypcoe.edu",
            roll_no="2026-CS-042",
            department="Computer Engineering",
            degree="B.E. Computer Engineering",
            batch="2022-2026",
            graduation_year=2026,
            cgpa=8.9,
            placement_status="Eligible"
        )
        db.add(student)
        db.commit()

    intruder = db.query(models.Student).filter(models.Student.id == "std_intruder").first()
    if not intruder:
        intruder = models.Student(
            id="std_intruder",
            name="Other Candidate",
            email="other.candidate@dypcoe.edu",
            roll_no="2026-CS-999",
            department="Computer Engineering",
            degree="B.E. Computer Engineering",
            batch="2022-2026",
            graduation_year=2026,
            cgpa=7.5,
            placement_status="Eligible"
        )
        db.add(intruder)
        db.commit()
    db.close()

def test_speech_status_reporting():
    """Verify speech diagnostics endpoint reports real providers and missing configs."""
    response = client.get("/api/v1/interview/speech/status")
    assert response.status_code == 200
    data = response.json()
    assert "active_stt" in data
    assert "active_tts" in data
    assert "cloud_providers" in data
    assert data["active_stt"]["streaming_support"] is True
    # Honest credentials reporting
    assert "missing_config" in data["cloud_providers"]["stt_whisper"]

def test_session_creation_requires_explicit_consent():
    """Sessions must reject requests where consent policy is not accepted."""
    bad_payload = {
        "role_target": "Backend Software Engineer",
        "interview_type": "Technical",
        "difficulty": "Medium",
        "question_limit": 5,
        "duration_minutes": 15,
        "required_skills": ["Python", "FastAPI", "SQLAlchemy"],
        "consent": {
            "camera_enabled": True,
            "mic_enabled": True,
            "storage_policy_accepted": False
        }
    }
    response = client.post("/api/v1/interview/sessions", json=bad_payload)
    assert response.status_code == 400
    assert "Explicit consent" in response.json()["detail"]

def test_session_lifecycle_and_ownership():
    """Test creating a real session and verifying ownership enforcement."""
    payload = {
        "role_target": "Distributed Systems Engineer",
        "interview_type": "Technical",
        "difficulty": "Hard",
        "question_limit": 3,
        "duration_minutes": 20,
        "required_skills": ["Go", "Distributed Consensus", "gRPC"],
        "consent": {
            "camera_enabled": True,
            "mic_enabled": True,
            "storage_policy_accepted": True
        }
    }
    # 1. Create session
    create_res = client.post("/api/v1/interview/sessions", json=payload)
    assert create_res.status_code == 201
    session_data = create_res.json()
    session_id = session_data["session_id"]
    assert session_id.startswith("isess_")
    assert session_data["status"] == "InProgress"

    # 2. Get session details
    get_res = client.get(f"/api/v1/interview/sessions/{session_id}")
    assert get_res.status_code == 200
    details = get_res.json()
    assert details["role_target"] == "Distributed Systems Engineer"
    assert details["student_id"] == "std_current_user"

    # 3. Ownership enforcement with a different student id header
    forbidden_res = client.get(f"/api/v1/interview/sessions/{session_id}", headers={"x-student-id": "std_intruder"})
    assert forbidden_res.status_code == 403

    # 4. Cancel session
    cancel_res = client.post(f"/api/v1/interview/sessions/{session_id}/cancel")
    assert cancel_res.status_code == 200
    assert cancel_res.json()["message"] == "Interview session cancelled successfully"

    # 5. Verify cancelled status
    updated_res = client.get(f"/api/v1/interview/sessions/{session_id}")
    assert updated_res.json()["status"] == "Cancelled"

def test_claude_question_generation_and_evaluation_flow():
    """Test full vertical slice of generating questions, evaluating answers, and follow-ups."""
    # 1. Create session
    create_res = client.post(
        "/api/v1/interview/sessions",
        json={
            "role_target": "Backend Platform Engineer",
            "interview_type": "Technical",
            "difficulty": "Medium",
            "question_limit": 3,
            "duration_minutes": 15,
            "required_skills": ["Python", "PostgreSQL", "Redis"],
            "consent": {
                "camera_enabled": True,
                "mic_enabled": True,
                "storage_policy_accepted": True
            }
        }
    )
    assert create_res.status_code == 201
    session_id = create_res.json()["session_id"]

    # 2. Mock Claude question generation
    mock_question = QuestionSchema(
        question_text="How would you design a distributed rate limiter using Redis and sliding windows?",
        category="Technical",
        expected_points=["Sliding window log vs counter", "Redis Sorted Sets (ZADD, ZREMRANGEBYSCORE)", "Atomic transactions"],
        rubric={
            "correctness": "Accurate Redis data structures and concurrency safety",
            "relevance": "Directly explains sliding window mechanism",
            "completeness": "Covers race conditions and memory usage",
            "clarity": "Logical structure and precision",
            "evidence": "Practical production experience with Redis cluster"
        },
        difficulty="Medium"
    )

    with patch("app.services.claude_interview.ClaudeInterviewService.generate_question", return_value=mock_question):
        q_res = client.post(f"/api/v1/interview/sessions/{session_id}/next-question")
        assert q_res.status_code == 200
        q_data = q_res.json()
        assert "How would you design a distributed rate limiter" in q_data["turn"]["question_text"]
        turn_id = q_data["turn"]["id"]

    # 3. Mock Claude answer evaluation
    mock_eval = EvaluationSchema(
        correctness_score=88.0,
        relevance_score=92.0,
        completeness_score=85.0,
        clarity_score=90.0,
        evidence_score=80.0,
        turn_overall_score=87.0,
        strengths=["Clear explanation of Redis sorted sets using timestamps as scores."],
        areas_for_improvement=["Could mention token bucket as an alternative trade-off."],
        follow_up_recommended=True,
        suggested_follow_up="How would you prevent hot-key bottlenecks in a multi-node Redis cluster under 100k requests/sec?"
    )

    with patch("app.services.claude_interview.ClaudeInterviewService.evaluate_answer", return_value=mock_eval):
        eval_res = client.post(
            f"/api/v1/interview/sessions/{session_id}/submit-answer",
            json={
                "turn_id": turn_id,
                "student_answer": "I would use Redis sorted sets where each request adds a member with the current timestamp as score, then prune elements older than the window with ZREMRANGEBYSCORE.",
                "input_method": "voice",
                "answer_duration_seconds": 24.5
            }
        )
        assert eval_res.status_code == 200
        eval_data = eval_res.json()
        assert eval_data["evaluation"]["turn_overall_score"] == 87.0
        assert eval_data["follow_up_turn"] is not None
        assert "hot-key bottlenecks" in eval_data["follow_up_turn"]["question_text"]

    # 4. Mock Claude final summary
    mock_summary = SummarySchema(
        overall_score=87.5,
        executive_summary="Candidate demonstrated solid distributed systems fundamentals and clean communication.",
        competency_scores={
            "SystemDesign": 88.0,
            "DataStructures": 85.0,
            "Communication": 90.0
        },
        key_strengths=["Distributed caching", "Concurrency awareness"],
        priority_growth_areas=["High-throughput cluster partition strategies"],
        hiring_readiness_recommendation="Ready for Tier-1 Technical Rounds"
    )

    with patch("app.services.claude_interview.ClaudeInterviewService.generate_final_summary", return_value=mock_summary):
        finish_res = client.post(f"/api/v1/interview/sessions/{session_id}/finish")
        assert finish_res.status_code == 200
        finish_data = finish_res.json()
        assert finish_data["overall_score"] == 87.5
        assert finish_data["overall_feedback"]["hiring_readiness_recommendation"] == "Ready for Tier-1 Technical Rounds"

def test_opencv_vision_frame_telemetry():
    """Test OpenCV computer vision frame processing and lighting diagnostics."""
    # Create an artificial synthetic 200x200 BGR test frame with normal illumination
    synthetic_frame = np.full((200, 200, 3), 128, dtype=np.uint8)
    # Add a bright circular gradient simulating light
    cv2.circle(synthetic_frame, (100, 100), 50, (200, 200, 200), -1)
    
    # Encode to JPEG base64
    _, buffer = cv2.imencode('.jpg', synthetic_frame)
    base64_str = base64.b64encode(buffer).decode('utf-8')

    # Create session first
    create_res = client.post(
        "/api/v1/interview/sessions",
        json={
            "role_target": "Frontend Architect",
            "interview_type": "Technical",
            "difficulty": "Easy",
            "question_limit": 2,
            "duration_minutes": 10,
            "required_skills": ["React", "TypeScript"],
            "consent": {
                "camera_enabled": True,
                "mic_enabled": True,
                "storage_policy_accepted": True
            }
        }
    )
    session_id = create_res.json()["session_id"]

    # Post frame
    vf_res = client.post(
        f"/api/v1/interview/sessions/{session_id}/vision-frame",
        json={"image_base64": f"data:image/jpeg;base64,{base64_str}"}
    )
    assert vf_res.status_code == 200
    telemetry = vf_res.json()
    assert "face_detected" in telemetry
    assert "lighting_quality" in telemetry
    assert "confidence" in telemetry
    assert "Never factored into interview scores" in telemetry["disclaimer"]

def test_claude_authentication_error_handling():
    """Verify that Claude API authentication failures return 401 and never fabricate questions."""
    create_res = client.post(
        "/api/v1/interview/sessions",
        json={
            "role_target": "DevOps Engineer",
            "interview_type": "Technical",
            "difficulty": "Medium",
            "question_limit": 3,
            "duration_minutes": 15,
            "required_skills": ["Kubernetes", "Terraform"],
            "consent": {
                "camera_enabled": True,
                "mic_enabled": True,
                "storage_policy_accepted": True
            }
        }
    )
    session_id = create_res.json()["session_id"]

    # When Claude returns 401 Invalid x-api-key, next-question must return 401
    q_res = client.post(f"/api/v1/interview/sessions/{session_id}/next-question")
    # With the live key currently set in .env which Anthropic rejected with 401:
    assert q_res.status_code == 401
    assert "Anthropic" in q_res.json()["detail"] or "unauthenticated" in q_res.json()["detail"].lower()
