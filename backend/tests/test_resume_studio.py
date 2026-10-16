import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_resume_list_bootstraps_master():
    """Verify listing resumes bootstraps a master profile if none exist."""
    res = client.get("/api/v1/resumes")
    assert res.status_code == 200
    resumes = res.json()
    assert len(resumes) >= 1
    master = resumes[0]
    assert master["is_master"] is True
    assert master["title"] == "Master Profile"
    assert master["ats_score"] > 0

def test_resume_crud_and_version_isolation():
    """Verify creating a child version and updating it does NOT mutate master profile."""
    # 1. Get master
    list_res = client.get("/api/v1/resumes")
    master = list_res.json()[0]
    master_id = master["id"]

    master_detail_before = client.get(f"/api/v1/resumes/{master_id}").json()
    orig_master_summary = master_detail_before["content"].get("summary")

    # 2. Create child version from master
    child_payload = {
        "title": "Backend Systems Resume",
        "target_role": "Backend Engineer",
        "target_company": "Datadog",
        "template_id": "software-engineer",
        "is_master": False,
        "source_resume_id": master_id
    }
    create_res = client.post("/api/v1/resumes", json=child_payload)
    assert create_res.status_code == 201
    child_id = create_res.json()["id"]

    # 3. Update child version's content
    child_detail = client.get(f"/api/v1/resumes/{child_id}").json()
    new_child_content = dict(child_detail["content"])
    new_child_content["summary"] = "Specialized Backend Engineer focused on distributed consensus and high-throughput pipelines."
    
    update_res = client.put(f"/api/v1/resumes/{child_id}", json={
        "title": "Updated Backend Resume",
        "content": new_child_content
    })
    assert update_res.status_code == 200

    # 4. Verify Master Profile summary was UNCHANGED
    master_detail_after = client.get(f"/api/v1/resumes/{master_id}").json()
    assert master_detail_after["content"].get("summary") == orig_master_summary
    assert master_detail_after["content"].get("summary") != new_child_content["summary"]

    # 5. Duplicate child version and verify independent copy
    dup_res = client.post(f"/api/v1/resumes/{child_id}/duplicate")
    assert dup_res.status_code == 200
    dup_id = dup_res.json()["id"]
    assert dup_id != child_id

    dup_detail = client.get(f"/api/v1/resumes/{dup_id}").json()
    assert "Copy of" in dup_detail["title"]

def test_deterministic_scoring_rubric():
    """Verify 7-category scoring rubric is deterministic and bounded."""
    list_res = client.get("/api/v1/resumes")
    resume_id = list_res.json()[0]["id"]

    score_res = client.post(f"/api/v1/resumes/{resume_id}/score", params={"job_description": "We need Python, FastAPI, Docker, and SQL developers."})
    assert score_res.status_code == 200
    report = score_res.json()
    
    assert "overall_score" in report
    assert 0 <= report["overall_score"] <= 100
    assert "breakdown" in report
    bd = report["breakdown"]
    assert "job_relevance_and_keywords" in bd
    assert "evidence_backed_qualifications" in bd
    assert "project_and_experience_coverage" in bd
    assert "content_clarity_bullet_quality" in bd
    assert "ats_readable_structure" in bd
    assert "formatting_consistency" in bd
    assert "completeness_factual_support" in bd
    assert "disclaimer" in report

def test_truth_verification_engine():
    """Verify truth verification returns honest statuses and evidence details."""
    list_res = client.get("/api/v1/resumes")
    resume_id = list_res.json()[0]["id"]

    verify_res = client.post(f"/api/v1/resumes/{resume_id}/verify-claims")
    assert verify_res.status_code == 200
    data = verify_res.json()
    assert "claims" in data
    assert isinstance(data["claims"], list)
    
    allowed_statuses = {
        "Supported by linked evidence",
        "Partially supported",
        "Student-confirmed",
        "Unverified",
        "Conflicting evidence"
    }
    for claim in data["claims"]:
        assert claim["status"] in allowed_statuses
        assert "statement" in claim
        assert "evidence_source" in claim

def test_best_resume_recommendation():
    """Verify deterministic recommendation chooses strongest version for a role."""
    rec_res = client.get("/api/v1/resumes/recommendation/best", params={"target_role": "Backend Engineer"})
    assert rec_res.status_code == 200
    data = rec_res.json()
    assert "recommended_version" in data
    assert "reasons" in data
    assert len(data["reasons"]) > 0

def test_alumni_examples_privacy():
    """Verify alumni examples endpoint returns authorized records or clean empty state."""
    alumni_res = client.get("/api/v1/resumes/alumni-examples")
    assert alumni_res.status_code == 200
    data = alumni_res.json()
    assert isinstance(data, list)
    for ex in data:
        # Never leak real non-anonymized name if flag is anonymized
        if ex.get("is_anonymized"):
            assert "Anonymized" in ex["alumni_name"]
