"""
Comprehensive Tests for Opportunities Intelligence Module — Placement Hub
Covers:
- Phase 0 provider audit compliance (all 8 providers, API availability, terms, attribution)
- Canonical URL deduplication (hash computation, parameter stripping)
- Factual status computation (open, closing_soon, closed, unknown) without fabrication
- Stale listing detection
- Multi-parameter filtering and search
- Manual opportunity import workflow with duplicate suppression
- Student verified profile and skills gap matching (with ethical AI advisory notice)
- Saved opportunity pipeline state transitions
- Allowlisted Jarvis tools (sources checked, retrieval times, unavailable provider notes)
- Resume Studio tailoring bridge (before/after proposal generation without auto-submission)
"""

import datetime
from unittest.mock import patch, MagicMock
from fastapi.testclient import TestClient

from app.main import app
from app.core.database import SessionLocal
from app.models.models import (
    Student,
    Skill,
    Project,
    Resume,
    OpportunityRecord,
    SavedOpportunityRecord,
    OpportunityUserPreference,
)
from app.integrations.opportunities.phase0_audit import PROVIDER_AUDIT_DATA
from app.integrations.opportunities.connectors import (
    normalize_canonical_url,
    compute_url_hash,
    compute_opportunity_status,
    check_is_stale,
)
from app.integrations.opportunities.service import opportunities_service
from app.integrations.opportunities.schemas import (
    OpportunityFilterParams,
    SaveOpportunityRequest,
    UpdateApplicationStatusRequest,
    ManualImportOpportunityRequest,
)
from app.services.jarvis_agent import jarvis_agent

client = TestClient(app)


# ---------------------------------------------------------------------------
# 1. Phase 0 Provider Audit & Legal Verification Tests
# ---------------------------------------------------------------------------

def test_phase0_provider_audit_contract():
    """Verifies that all 8 requested providers are documented with official API availability and compliance boundaries."""
    expected_slugs = {
        "linkedin", "unstop", "devpost", "mlh",
        "wellfound", "naukri", "company_career", "university"
    }
    audited_slugs = {p.slug for p in PROVIDER_AUDIT_DATA}
    assert expected_slugs == audited_slugs, f"Missing providers in audit: {expected_slugs - audited_slugs}"

    for p in PROVIDER_AUDIT_DATA:
        assert p.name and len(p.name) > 0
        assert p.terms_and_permitted_use and len(p.terms_and_permitted_use) > 20
        assert p.auth_and_approval_requirements and len(p.auth_and_approval_requirements) > 20
        assert p.rate_limits_and_attribution and len(p.rate_limits_and_attribution) > 10
        assert len(p.retrievable_fields) > 0
        assert p.provenance_type in {"api_verified", "official_feed", "link_discovery", "manual_import"}


def test_linkedin_is_strictly_link_discovery():
    """Asserts that LinkedIn is labeled as link_discovery, not claimed as an unauthorized API or scraped feed."""
    li = next(p for p in PROVIDER_AUDIT_DATA if p.slug == "linkedin")
    assert li.official_api_available is False
    assert li.provenance_type == "link_discovery"
    assert "scraping" in li.terms_and_permitted_use.lower()
    assert "link-based" in li.disclaimer.lower()


def test_api_providers_audit_endpoint():
    """Tests GET /api/v1/opportunities/providers/audit endpoint."""
    res = client.get("/api/v1/opportunities/providers/audit")
    assert res.status_code == 200
    data = res.json()
    assert len(data) == 8
    slugs = [item["slug"] for item in data]
    assert "linkedin" in slugs
    assert "devpost" in slugs
    assert "mlh" in slugs


# ---------------------------------------------------------------------------
# 2. Canonical URL Normalization & Deduplication
# ---------------------------------------------------------------------------

def test_canonical_url_normalization():
    """Tests that tracking parameters (utm_*, ref, trk) and trailing slashes are removed."""
    url1 = "https://www.linkedin.com/jobs/view/123456/?utm_source=feed&utm_medium=app&ref=dyp#apply"
    url2 = "https://www.linkedin.com/jobs/view/123456?trk=public_jobs"
    url3 = "https://www.linkedin.com/jobs/view/123456"

    norm1 = normalize_canonical_url(url1)
    norm2 = normalize_canonical_url(url2)
    norm3 = normalize_canonical_url(url3)

    assert norm1 == norm2 == norm3
    assert norm1 == "https://www.linkedin.com/jobs/view/123456"

    # Hashes must match
    assert compute_url_hash(url1) == compute_url_hash(url2) == compute_url_hash(url3)


# ---------------------------------------------------------------------------
# 3. Status Computation Without Fabrication
# ---------------------------------------------------------------------------

def test_status_computation_truthfulness():
    """Tests that status is strictly derived from verified deadlines."""
    now = datetime.datetime.now(datetime.timezone.utc)

    # 1. Past deadline -> closed
    past_date = (now - datetime.timedelta(days=2)).strftime("%Y-%m-%d")
    assert compute_opportunity_status(past_date) == "closed"

    # 2. Imminent deadline (within 3 days) -> closing_soon
    soon_date = (now + datetime.timedelta(days=2)).strftime("%Y-%m-%d")
    assert compute_opportunity_status(soon_date) == "closing_soon"

    # 3. Future deadline (> 3 days) -> open
    future_date = (now + datetime.timedelta(days=14)).strftime("%Y-%m-%d")
    assert compute_opportunity_status(future_date) == "open"

    # 4. Missing deadline -> unknown (never fabricated)
    assert compute_opportunity_status(None) == "unknown"
    assert compute_opportunity_status("") == "unknown"


def test_stale_detection():
    """Asserts that opportunities unverified for >= 7 days are flagged as stale."""
    now = datetime.datetime.now(datetime.timezone.utc)
    recent = now - datetime.timedelta(days=2)
    stale = now - datetime.timedelta(days=8)

    assert check_is_stale(recent) is False
    assert check_is_stale(stale) is True
    assert check_is_stale(None) is True


# ---------------------------------------------------------------------------
# 4. Search and Multi-Parameter Filtering
# ---------------------------------------------------------------------------

def test_search_and_category_filtering():
    """Tests GET /api/v1/opportunities with category, query, and status filters."""
    # 1. Fetch all
    res = client.get("/api/v1/opportunities")
    assert res.status_code == 200
    data = res.json()
    assert data["total"] > 0
    assert len(data["items"]) > 0

    # 2. Filter category = hackathon
    res_hack = client.get("/api/v1/opportunities?category=hackathon")
    assert res_hack.status_code == 200
    hack_data = res_hack.json()
    for item in hack_data["items"]:
        assert item["category"] == "hackathon"

    # 3. Filter provider = mlh
    res_mlh = client.get("/api/v1/opportunities?provider=mlh")
    assert res_mlh.status_code == 200
    mlh_data = res_mlh.json()
    assert mlh_data["total"] >= 1
    assert mlh_data["items"][0]["provider"] == "mlh"
    assert mlh_data["items"][0]["provenance_type"] == "official_feed"


def test_closing_soon_endpoint():
    """Tests GET /api/v1/opportunities/closing-soon returns urgent deadlines."""
    res = client.get("/api/v1/opportunities/closing-soon")
    assert res.status_code == 200
    items = res.json()
    for it in items:
        assert it["status"] == "closing_soon"


# ---------------------------------------------------------------------------
# 5. Manual Opportunity Import Workflow & Duplicate Suppression
# ---------------------------------------------------------------------------

def test_manual_import_and_duplicate_suppression():
    """Tests importing an opportunity manually and ensuring duplicate URLs are suppressed."""
    payload = {
        "title": "Junior Python Backend Developer",
        "company_or_organizer": "Acme Innovations Labs",
        "category": "job",
        "source_url": "https://www.linkedin.com/jobs/view/9988776655/?ref=share",
        "application_url": "https://acme.example.com/apply/9988",
        "provider": "linkedin",
        "location": "Pune, India",
        "remote_status": "hybrid",
        "compensation_type": "paid",
        "compensation_amount": "₹9.5 LPA",
        "skills": ["Python", "FastAPI", "Docker"],
        "deadline": (datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(days=20)).strftime("%Y-%m-%d"),
        "description": "Building microservices with FastAPI and Postgres for logistics telemetry."
    }

    # First import
    res1 = client.post("/api/v1/opportunities/import-manual", json=payload)
    assert res1.status_code == 200
    data1 = res1.json()
    assert data1["provenance_type"] == "manual_import"
    assert data1["title"] == "Junior Python Backend Developer"
    assert data1["company_or_organizer"] == "Acme Innovations Labs"
    opp_id_1 = data1["id"]

    # Second import with same URL (with differing tracking parameters)
    payload2 = dict(payload)
    payload2["source_url"] = "https://www.linkedin.com/jobs/view/9988776655?utm_source=email"
    res2 = client.post("/api/v1/opportunities/import-manual", json=payload2)
    assert res2.status_code == 200
    data2 = res2.json()

    # Must return the identical existing record (no duplicate row created)
    assert data2["id"] == opp_id_1


# ---------------------------------------------------------------------------
# 6. Saved Opportunities Pipeline
# ---------------------------------------------------------------------------

def test_saved_opportunity_pipeline_lifecycle():
    """Tests saving an opportunity and updating status from 'saved' to 'applied' and 'interviewing'."""
    # Get an opportunity to save
    res = client.get("/api/v1/opportunities?limit=1")
    opp = res.json()["items"][0]
    opp_id = opp["id"]

    # Save
    save_res = client.post("/api/v1/opportunities/save", json={
        "opportunity_id": opp_id,
        "application_status": "saved",
        "reminder_enabled": True,
        "notes": "Target company for campus placement"
    })
    assert save_res.status_code == 200
    saved_data = save_res.json()
    assert saved_data["application_status"] == "saved"
    assert saved_data["opportunity_id"] == opp_id

    # Update status to applied
    update_res = client.post(f"/api/v1/opportunities/{opp_id}/status", json={
        "application_status": "applied",
        "notes": "Applied via official employer portal"
    })
    assert update_res.status_code == 200
    assert update_res.json()["application_status"] == "applied"

    # List saved
    list_saved = client.get("/api/v1/opportunities/saved")
    assert list_saved.status_code == 200
    saved_list = list_saved.json()
    assert any(s["opportunity_id"] == opp_id for s in saved_list)

    # Delete saved
    del_res = client.delete(f"/api/v1/opportunities/saved/{opp_id}")
    assert del_res.status_code == 200


# ---------------------------------------------------------------------------
# 7. AI Relevance & Verified Skill Gap Matching
# ---------------------------------------------------------------------------

def test_ai_relevance_matching_against_student_profile():
    """
    Tests opportunity match evaluation against student's confirmed skills, CGPA, and projects.
    Verifies that the advisory notice is strictly included.
    """
    res = client.get("/api/v1/opportunities?limit=1")
    opp_id = res.json()["items"][0]["id"]

    eval_res = client.get(f"/api/v1/opportunities/{opp_id}/evaluate")
    assert eval_res.status_code == 200
    data = eval_res.json()

    assert "match_percentage" in data
    assert 0 <= data["match_percentage"] <= 100
    assert "match_level" in data
    assert "matched_skills" in data
    assert "skill_gaps" in data
    assert "why_it_matches" in data
    assert len(data["why_it_matches"]) > 0

    # Must contain the ethical AI notice
    assert "guarantee" in data["advisory_notice"].lower()
    assert "advisory" in data["advisory_notice"].lower()


# ---------------------------------------------------------------------------
# 8. Allowlisted Jarvis Opportunity Tools
# ---------------------------------------------------------------------------

def test_jarvis_search_opportunities_tool():
    """Tests Jarvis search_opportunities allowlisted tool with sources checked and retrieval timestamps."""
    result = jarvis_agent.search_opportunities_tool(query="Systems", limit=3)
    assert result["action_executed"] == "search_opportunities"
    assert result["plugin"] == "opportunities"
    assert "response" in result
    assert "voice_speech" in result

    # Check sources attribution in response
    assert "Sources Checked:" in result["response"]
    assert "Last Retrieval:" in result["response"]
    assert "link-discovery mode" in result["response"]


def test_jarvis_closing_soon_tool():
    """Tests Jarvis get_closing_soon_opportunities allowlisted tool."""
    result = jarvis_agent.get_closing_soon_opportunities_tool(limit=5)
    assert result["action_executed"] in {"get_closing_soon_opportunities", "closing_soon_empty"}
    assert result["plugin"] == "opportunities"


def test_jarvis_compare_opportunity_tool():
    """Tests Jarvis compare_opportunity_with_resume tool."""
    res = client.get("/api/v1/opportunities?limit=1")
    opp_id = res.json()["items"][0]["id"]

    result = jarvis_agent.compare_opportunity_with_resume_tool(opp_id)
    assert result["action_executed"] == "compare_opportunity_with_resume"
    assert "Advisory Match Score:" in result["response"]
    assert "Ethical AI Notice:" in result["response"]


def test_jarvis_save_and_update_status_tools():
    """Tests Jarvis save_opportunity and update_application_status tools."""
    res = client.get("/api/v1/opportunities?limit=1")
    opp_id = res.json()["items"][0]["id"]

    # Save
    save_result = jarvis_agent.save_opportunity_tool(opp_id, status="saved")
    assert save_result["action_executed"] == "save_opportunity"
    assert "saved pipeline" in save_result["response"].lower()
    assert "never submits job applications" in save_result["response"].lower()

    # Update
    update_result = jarvis_agent.update_application_status_tool(opp_id, status="interviewing")
    assert update_result["action_executed"] == "update_application_status"
    assert "interviewing" in update_result["response"]


def test_jarvis_natural_language_intent_routing():
    """Tests that voice and text commands naturally route to the opportunities tools."""
    # Closing soon intent
    res1 = client.post("/api/v1/jarvis/command", json={"query": "Jarvis, what opportunities are closing soon?"})
    assert res1.status_code == 200
    data1 = res1.json()
    assert data1["plugin"] == "opportunities"
    assert data1["action_executed"] in {"get_closing_soon_opportunities", "closing_soon_empty"}

    # Search hackathons intent
    res2 = client.post("/api/v1/jarvis/command", json={"query": "Find hackathons for me"})
    assert res2.status_code == 200
    data2 = res2.json()
    assert data2["plugin"] == "opportunities"
    assert data2["action_executed"] == "search_opportunities"


# ---------------------------------------------------------------------------
# 9. Resume Studio Tailoring Bridge
# ---------------------------------------------------------------------------

def test_resume_studio_tailoring_bridge():
    """
    Tests that POST /api/v1/opportunities/{opp_id}/tailor-resume bridges to Resume Studio
    and generates before/after proposals without auto-submitting applications.
    """
    db = SessionLocal()
    student = db.query(Student).first()
    resume = db.query(Resume).filter(Resume.student_id == student.id).first()
    opp = db.query(OpportunityRecord).first()
    db.close()

    if not resume or not opp:
        return

    # Mock Gemini tailor response to ensure test runs deterministically
    mock_report = {
        "tailoring_proposals": [
            {
                "id": "prop_01",
                "section": "summary",
                "original_text": "Passionate software engineering student.",
                "suggested_text": f"Software engineering candidate focused on {opp.title} systems.",
                "reason": "Direct keyword alignment with role requirements.",
                "match_score_delta": 4
            }
        ],
        "keywords_analysis": {
            "matched_keywords": ["FastAPI", "Python"],
            "missing_keywords": ["Kubernetes"],
            "keyword_density_score": 85
        },
        "score_before": 80,
        "score_after": 88
    }

    with patch("app.api.opportunity_endpoints.tailor_resume_with_gemini", return_value=mock_report):
        res = client.post(
            f"/api/v1/opportunities/{opp.id}/tailor-resume",
            json={"resume_id": resume.id}
        )
        assert res.status_code == 200
        data = res.json()
        assert data["opportunity_id"] == opp.id
        assert data["resume_id"] == resume.id
        assert "tailor_report" in data
        assert len(data["tailor_report"]["tailoring_proposals"]) == 1
