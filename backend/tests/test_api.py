import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["message"] == "Placement Hub API is running"

def test_health_check():
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "Live Data Only" in data["policy"]

def test_integrations_status():
    response = client.get("/api/v1/integrations/status")
    assert response.status_code == 200
    data = response.json()
    assert "backend_db" in data
    assert data["backend_db"]["status"] == "connected"
    assert "claude_api" in data
    # Safe check never leaks raw key
    assert "sk-" not in str(data)
    assert data["claude_api"]["provider"] in ("Anthropic Claude API", "Google Gemini API")

def test_real_applications_crud():
    # 1. Create a real application
    app_payload = {
        "job_title": "Distributed Systems Engineer",
        "company_name": "Acme Cloud Corp",
        "package_lpa": 18.5,
        "applied_date": "2026-10-16",
        "status": "Applied",
        "current_round": "Technical Review",
        "source": "Manual Entry"
    }
    create_res = client.post("/api/v1/applications", json=app_payload)
    assert create_res.status_code == 201
    created_id = create_res.json()["id"]

    # 2. List applications and verify it's persisted in SQLite
    list_res = client.get("/api/v1/applications")
    assert list_res.status_code == 200
    apps = list_res.json()
    assert any(a["id"] == created_id for a in apps)

    # 3. Update status
    patch_res = client.patch(f"/api/v1/applications/{created_id}/status", json={"status": "Screening", "current_round": "Round 1 Interview"})
    assert patch_res.status_code == 200
    assert patch_res.json()["status"] == "Screening"

    # 4. Clean up / delete
    del_res = client.delete(f"/api/v1/applications/{created_id}")
    assert del_res.status_code == 200

def test_ai_match_explain_live_data_guarantee():
    # Attempting to explain a non-existent candidate must return 404, not fabricated data
    response = client.post("/api/v1/ai/match-explain?job_id=job_fake&student_id=std_fake")
    assert response.status_code in [404, 503]

def test_interview_experience_honest_labeling():
    payload = {
        "student_name": "Test Candidate",
        "company_name": "Stripe",
        "role_title": "Backend Intern",
        "placed_status": "Selected",
        "package_lpa": 24.0,
        "interview_date": "2026-10-10",
        "difficulty": "Hard",
        "overall_experience": "Two algorithmic rounds and one systems design round.",
        "topics_covered": ["Concurrency", "Rate Limiting", "PostgreSQL"]
    }
    create_res = client.post("/api/v1/interview-experiences", json=payload)
    assert create_res.status_code == 201
    
    list_res = client.get("/api/v1/interview-experiences")
    assert list_res.status_code == 200
    exps = list_res.json()
    assert any(e["companyName"] == "Stripe" for e in exps)
    # Check that it is explicitly labelled as student-reported / unverified
    stripe_exp = next(e for e in exps if e["companyName"] == "Stripe")
    assert "Student-Reported" in stripe_exp["verificationStatus"]
