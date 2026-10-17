"""
Phase 0 Verification & Access Audit for Opportunity Providers — Placement Hub
Rigorous documentation of official APIs, feeds, terms, rate limits, and compliance boundaries.
Ensures zero web scraping, zero bot bypass, and honest labeling of link-based workflows.
"""

from typing import List
from .schemas import ProviderAuditReport

PROVIDER_AUDIT_DATA: List[ProviderAuditReport] = [
    ProviderAuditReport(
        name="LinkedIn",
        slug="linkedin",
        category="Professional Network & Jobs",
        official_api_available=False,
        provenance_type="link_discovery",
        auth_and_approval_requirements=(
            "LinkedIn Community Management & Sign-In APIs are public, but General Job Search API access "
            "(/v2/jobSearch) is strictly restricted to approved enterprise partners under LinkedIn Talent Solutions "
            "and Job Posting contracts. Standard developer applications do NOT grant job discovery permissions."
        ),
        terms_and_permitted_use=(
            "LinkedIn User Agreement §8.2 explicitly prohibits scraping, crawlers, unauthorized automation, "
            "or indexing jobs without written consent. Programmatic extraction is forbidden. "
            "Permitted workflow: Link-based search redirection and user-authorized manual job import."
        ),
        rate_limits_and_attribution=(
            "No public job search rate limits apply because automated API calls are disabled. "
            "All outbound search links must clearly display the LinkedIn brand mark and direct candidates "
            "to official LinkedIn web surfaces."
        ),
        retrievable_fields=[
            "Outbound search URL with user keywords",
            "Job Title (via user manual import)",
            "Company Name (via user manual import)",
            "Application URL (via user manual import)",
            "Location (via user manual import)",
            "Job Description (via user manual import)",
        ],
        incremental_updates_and_webhooks=False,
        search_url_template="https://www.linkedin.com/jobs/search/?keywords={query}&location={location}",
        disclaimer=(
            "Link-based discovery & manual import only. Placement Hub strictly complies with LinkedIn User Agreement: "
            "no automated scraping, session hijack, or unofficial datasets are utilized."
        ),
    ),
    ProviderAuditReport(
        name="Unstop",
        slug="unstop",
        category="Competitions, Hackathons & Challenges",
        official_api_available=False,
        provenance_type="link_discovery",
        auth_and_approval_requirements=(
            "Unstop (formerly Dare2Compete) does not provide a public developer API or open OAuth endpoint "
            "for third-party opportunity retrieval. Direct API endpoints are proprietary and behind Cloudflare protection."
        ),
        terms_and_permitted_use=(
            "Unstop Terms of Use prohibit automated data harvesting, scraping, or headless browser automation. "
            "Permitted: Curated directory links to official categories (hackathons, case competitions, quizzes) "
            "and candidate-initiated manual import."
        ),
        rate_limits_and_attribution=(
            "Standard web link redirection. Attribution to 'Unstop' with direct registration links is required."
        ),
        retrievable_fields=[
            "Category URL (hackathons, competitions, hiring challenges)",
            "Title & Organizer (via curated link or manual import)",
            "Registration URL (official Unstop domain)",
            "Prizes & Eligibility (via verified notice or manual import)",
        ],
        incremental_updates_and_webhooks=False,
        search_url_template="https://unstop.com/all-opportunities?search={query}",
        disclaimer=(
            "Link-based discovery workflow. Candidates are directed to official Unstop portal links. "
            "No anti-bot systems or security mechanisms are bypassed."
        ),
    ),
    ProviderAuditReport(
        name="Devpost",
        slug="devpost",
        category="Hackathons & Student Challenges",
        official_api_available=True,
        provenance_type="official_feed",
        auth_and_approval_requirements=(
            "Devpost offers public RSS/Atom syndicate feeds and public directory indexing for hackathon announcements. "
            "No private OAuth credentials required for public hackathon event discovery."
        ),
        terms_and_permitted_use=(
            "Public RSS syndicate feeds are permitted for community feed aggregation provided full attribution, "
            "canonical links to Devpost event pages, and non-abusive poll intervals are maintained."
        ),
        rate_limits_and_attribution=(
            "Bounded polling interval (minimum 1 hour cache). All hackathon records display Devpost source badges "
            "and canonical event links."
        ),
        retrievable_fields=[
            "Hackathon Title",
            "Organizer Name",
            "Submission Deadline (with timezone)",
            "Prize Pool & Currency",
            "Canonical Devpost URL",
            "Theme & Target Technologies",
            "Format (Online / In-Person)",
        ],
        incremental_updates_and_webhooks=False,
        search_url_template="https://devpost.com/hackathons?search={query}",
        disclaimer=(
            "Connected via official public syndicate feeds and direct canonical event links. "
            "Attributed to Devpost."
        ),
    ),
    ProviderAuditReport(
        name="Major League Hacking (MLH)",
        slug="mlh",
        category="Student Hackathon League",
        official_api_available=True,
        provenance_type="official_feed",
        auth_and_approval_requirements=(
            "MLH publishes official season schedules and community calendars publicly on mlh.io. "
            "Open calendar data and public event registration URLs require no privileged OAuth approval."
        ),
        terms_and_permitted_use=(
            "MLH encourages student participation. Public calendar event display is permitted with official "
            "Major League Hacking branding and direct links to MLH event registration pages."
        ),
        rate_limits_and_attribution=(
            "Cache retention: 12 hours. Must cite 'Major League Hacking' and follow MLH Member Event branding guidelines."
        ),
        retrievable_fields=[
            "Event Name",
            "Season Year",
            "Event Start and End Dates",
            "Registration Deadline",
            "Location / Digital Status",
            "Official Event Registration URL",
        ],
        incremental_updates_and_webhooks=False,
        search_url_template="https://mlh.io/seasons/2026/events",
        disclaimer=(
            "Verified via official MLH Member Hackathon public season listings. "
            "All registrations route directly to official MLH portals."
        ),
    ),
    ProviderAuditReport(
        name="Wellfound",
        slug="wellfound",
        category="Startups & Tech Internships",
        official_api_available=False,
        provenance_type="link_discovery",
        auth_and_approval_requirements=(
            "Wellfound (formerly AngelList Talent) deprecated its public API. Programmatic access is limited to "
            "enterprise Wellfound Recruit customers via private API tokens for hiring teams."
        ),
        terms_and_permitted_use=(
            "Wellfound Terms of Service prohibit third-party crawling, automated job scraping, or unlicensed reproduction. "
            "Permitted: Search intent links with role/skill query parameters and manual candidate job imports."
        ),
        rate_limits_and_attribution=(
            "Link-based routing. All outbound job queries display Wellfound attribution and direct user to wellfound.com."
        ),
        retrievable_fields=[
            "Outbound search query URL",
            "Role Title (via manual import or verified link)",
            "Startup Name",
            "Compensation & Equity Details (via manual import)",
            "Application URL",
        ],
        incremental_updates_and_webhooks=False,
        search_url_template="https://wellfound.com/jobs?query={query}&location={location}",
        disclaimer=(
            "Link-based startup opportunity discovery. No unauthorized scraping or bot requests."
        ),
    ),
    ProviderAuditReport(
        name="Naukri",
        slug="naukri",
        category="Indian Job Portal & Campus Roles",
        official_api_available=False,
        provenance_type="link_discovery",
        auth_and_approval_requirements=(
            "Info Edge (India) Ltd offers enterprise recruiter APIs (eHire / Naukri RMS) for corporate HR management. "
            "There is no public job-seeker search API available for external software applications."
        ),
        terms_and_permitted_use=(
            "Naukri.com Terms and Conditions explicitly prohibit data mining, automated querying, or scraping. "
            "Permitted: Link-based search queries with location and technology filters, plus manual job tracking."
        ),
        rate_limits_and_attribution=(
            "Outbound search links with Naukri attribution."
        ),
        retrievable_fields=[
            "Filtered search URL (role, location, experience)",
            "Job Title (via manual candidate import)",
            "Company Name (via manual candidate import)",
            "Experience Requirements (via manual candidate import)",
            "Application URL",
        ],
        incremental_updates_and_webhooks=False,
        search_url_template="https://www.naukri.com/{query}-jobs-in-{location}",
        disclaimer=(
            "Link-based Indian market job discovery. No unauthorized scraping."
        ),
    ),
    ProviderAuditReport(
        name="Official Company Career Pages",
        slug="company_career",
        category="Direct Enterprise ATS (Greenhouse, Lever, etc.)",
        official_api_available=True,
        provenance_type="api_verified",
        auth_and_approval_requirements=(
            "Major Applicant Tracking Systems (ATS) such as Greenhouse provide official, publicly documented job board "
            "REST APIs (e.g. `https://boards-api.greenhouse.io/v1/boards/{board_token}/jobs`) that permit public reading "
            "of active openings without API keys or authentication."
        ),
        terms_and_permitted_use=(
            "Official ATS read-only endpoints are explicitly published for corporate careers integration. "
            "Clean plain-text descriptions, role titles, and direct job board URLs may be collected and displayed."
        ),
        rate_limits_and_attribution=(
            "Standard REST caching: 15-minute TTL. Rate limit: ~60 requests/minute per board. "
            "Direct link to official employer application form is preserved."
        ),
        retrievable_fields=[
            "Internal Job Board ID",
            "Job Title & Department",
            "Workplace Type (Remote / Hybrid / On-site)",
            "Office Location",
            "Official Application URL",
            "Full Factual Job Description",
            "Published Date",
        ],
        incremental_updates_and_webhooks=True,
        search_url_template="https://boards-api.greenhouse.io/v1/boards/{board_token}/jobs",
        disclaimer=(
            "Directly verified via official public ATS Job Board APIs. Zero scraping or credential bypass."
        ),
    ),
    ProviderAuditReport(
        name="University Placement Notices & Programmes",
        slug="university",
        category="Campus Drives, Notices & Fellowships",
        official_api_available=True,
        provenance_type="api_verified",
        auth_and_approval_requirements=(
            "Directly integrated with Placement Hub internal Training & Placement (T&P) verified database "
            "and campus drive coordinator notices. Uses authenticated university session."
        ),
        terms_and_permitted_use=(
            "Governed by College Placement Cell charter. Permitted for registered eligible students. "
            "Full eligibility criteria, package LPA, backlogs policy, and drive deadlines are official campus records."
        ),
        rate_limits_and_attribution=(
            "Local database access via SQLAlchemy session. Official D.Y. Patil T&P Cell attribution."
        ),
        retrievable_fields=[
            "Campus Drive ID",
            "Company Name & Industry Tier",
            "Package CTC (LPA) & Stipend",
            "Minimum CGPA & Backlogs Eligibility",
            "Eligible Branches & Degrees",
            "Drive Registration Deadline",
            "Interview Venue / Virtual Mode",
        ],
        incremental_updates_and_webhooks=True,
        search_url_template="/api/v1/placements/drives",
        disclaimer=(
            "Official campus placement notices and drives verified by college Placement Cell coordinators."
        ),
    ),
]
