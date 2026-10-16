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
    assert "Placement Hub" in data["service"]

def test_ai_match_explain():
    response = client.post("/api/v1/ai/match-explain?job_id=job_01&student_id=std_01")
    assert response.status_code == 200
    data = response.json()
    assert "source" in data
    assert "skills_match_score" in data or "explanation" in data
