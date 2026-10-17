# Placement Hub — Opportunities Intelligence Provider Audit (Phase 0)

This audit establishes the legal, technical, and operational boundaries for discovering jobs, internships, hackathons, competitions, scholarships, and career programmes across the 8 evaluated providers.

---

## Provider Access Matrix & Compliance Evaluation

| Provider | Category | Official API Available? | Provenance Classification | Account & Auth Requirements | Terms of Service & Scraping Constraints | Rate Limits & Attribution Rules | Retrievable Fields | Incremental Updates / Webhooks |
|---|---|---|---|---|---|---|---|---|
| **LinkedIn** | Professional Jobs & Network | ❌ No public job search API | `link_discovery` & `manual_import` | General Job Search (`/v2/jobSearch`) requires enterprise partner approval under LinkedIn Talent Solutions. Developer OAuth does NOT grant job search access. | **User Agreement §8.2 strictly forbids scraping**, crawlers, automated queries, or headless browser extraction. Bypassing anti-bot systems is prohibited. | No automated API limits. Direct search links must carry LinkedIn branding mark. | Keywords query URL, Job Title, Company, Location, Description (via user-authorized manual import only). | ❌ No |
| **Unstop (Dare2Compete)** | Hackathons & Challenges | ❌ No public API | `link_discovery` & `manual_import` | No public OAuth or open REST API. Web endpoints are proprietary and guarded by Cloudflare WAF. | **Terms of Use explicitly forbid automated data harvesting**, screen scraping, and unauthorized programmatic access. | Link redirection. Attribution to 'Unstop' with direct registration links. | Category links (hackathons, competitions, quizzes), Title, Organizer, Registration URL (via manual import or curated links). | ❌ No |
| **Devpost** | Student Hackathons | ✅ Yes (Public Syndicate Feeds) | `official_feed` | Public RSS/Atom syndicate feed and public hackathon directory. No private OAuth key required for public directory listings. | Permitted for community feed aggregation with full source attribution, canonical event URLs, and bounded poll intervals. | Bounded polling interval (minimum 1 hour cache). Mandatory 'Devpost' source attribution. | Hackathon Title, Organizer, Submission Deadline (UTC/local), Prize Pool, Canonical URL, Themes, Format (Online/In-Person). | ❌ No (polling feed) |
| **Major League Hacking (MLH)** | Student Hackathon League | ✅ Yes (Public Season Schedules) | `official_feed` | MLH publishes official season schedules and community calendars publicly on `mlh.io`. No OAuth required. | Encourages student participation. Public calendar event display permitted with MLH branding and direct links to official event registration portals. | Cache retention: 12 hours. Must cite 'Major League Hacking' and follow MLH Member Event branding. | Event Name, Season Year, Start/End Dates, Registration Deadline, Location/Digital Status, Official Registration URL. | ❌ No (polling feed) |
| **Wellfound (AngelList)** | Tech Startups & Internships | ❌ Public API deprecated | `link_discovery` & `manual_import` | Wellfound deprecated its public API. Programmatic access is limited to enterprise Wellfound Recruit customers. | **Terms of Service prohibit third-party crawling**, automated job scraping, or unlicensed reproduction. | Outbound search query routing. Attribution to 'Wellfound'. | Outbound query URL, Role Title, Startup Name, Compensation/Equity (via manual import). | ❌ No |
| **Naukri** | Indian Campus & Enterprise Jobs | ❌ No public API | `link_discovery` & `manual_import` | Info Edge offers enterprise recruiter APIs (eHire / Naukri RMS) for corporate HR. No public developer job search API exists. | **Terms & Conditions forbid data mining**, automated querying, and scraping. | Outbound search query links with Naukri attribution. | Filtered search URL (role, location, experience), Job Title, Company Name, Experience (via manual import). | ❌ No |
| **Official Company Career Pages** | Direct Enterprise ATS (Greenhouse, Lever) | ✅ Yes (Public Board REST APIs) | `api_verified` | Publicly documented, unauthenticated read-only Job Board REST APIs (e.g. `https://boards-api.greenhouse.io/v1/boards/{token}/jobs`). | ATS read-only endpoints are published specifically for corporate careers integration. Clean plain-text job descriptions and direct URLs are permitted. | Standard caching (15-min TTL). Rate limit ~60 req/min per board. Direct application link preserved. | Job Board ID, Job Title, Department, Workplace Mode (Remote/Hybrid/On-site), Office Location, Application URL, Plain-text Description, Date. | ✅ Yes (REST polling & webhooks where configured) |
| **University Placement Cell** | Campus Drives & Fellowships | ✅ Yes (Internal Verified DB) | `api_verified` | Authenticated campus session linked to Training & Placement (T&P) verified database. | Governed by College Placement Cell charter. Permitted for registered eligible students. | Local database access via SQLAlchemy session. Official D.Y. Patil T&P Cell attribution. | Campus Drive ID, Company Name, Industry Tier, Package CTC (LPA), Min CGPA, Backlogs Policy, Eligible Branches, Deadline, Venue. | ✅ Yes (Real-time DB synchronization) |

---

## Architecture Guarantees & Truth Verification Rules

1. **Zero Web Scraping & Zero Bot Bypass:**
   Under no circumstances does Placement Hub run headless browsers, CAPTCHA bypassers, or unauthorized scrapers against LinkedIn, Unstop, Wellfound, or Naukri.

2. **Honest Data Provenance:**
   Every single opportunity record is tagged with an immutable `provenance_type`:
   - `api_verified`: Live, authenticated API or public ATS board response.
   - `official_feed`: Verified public syndicate or calendar feed (Devpost, MLH).
   - `link_discovery`: Verified external search query routing.
   - `manual_import`: User-provided listing with duplicate URL suppression.

3. **Status Derivation Without Fabrication:**
   - If `deadline < now`: marked strictly as `closed`.
   - If `now <= deadline <= now + 3 days`: marked as `closing_soon`.
   - If `deadline > now + 3 days`: marked as `open`.
   - If deadline is missing: marked as `unknown`. Never fabricated.
   - If `last_verified_at > 7 days ago`: flagged as `is_stale = true` with a user-facing warning.

4. **Deduplication Engine:**
   - Strips tracking query parameters (`utm_source`, `utm_medium`, `utm_campaign`, `ref`, `trk`, `trackingId`, `fbclid`, `gclid`).
   - Standardizes protocol, hostname, and path.
   - Indexes records by `canonical_url_hash` (SHA256).

5. **AI Relevance Matching & Ethical Boundary:**
   - Evaluates confirmed student records: verified skills (`skills` table), academic standing (`cgpa`, `department`), and portfolio projects (`projects` table).
   - Identifies matching skills and explicitly highlights missing skill gaps.
   - **Mandatory Ethical AI Notice:**
     > *"Relevance score is an advisory match based strictly on verified student profile records. It does NOT guarantee interview selection, eligibility confirmation, or hiring."*

6. **Resume Studio Bridge & Zero Auto-Submission:**
   - One-click trigger bridges the opportunity description to the existing Resume Studio (`POST /api/v1/opportunities/{opp_id}/tailor-resume`).
   - Uses Google Gemini to propose before-and-after edits for granular student review (accept/reject/edit).
   - Never auto-submits applications, never uploads resumes without confirmation, and never sends messages automatically.
