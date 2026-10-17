from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from .config import settings

engine = create_engine(
    settings.DATABASE_URL,
    connect_args={"check_same_thread": False} if "sqlite" in settings.DATABASE_URL else {}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def init_db_schema():
    Base.metadata.create_all(bind=engine)
    # Check and add missing columns if using SQLite
    if "sqlite" in settings.DATABASE_URL:
        import sqlite3
        db_path = settings.DATABASE_URL.replace("sqlite:///", "")
        if "?" in db_path:
            db_path = db_path.split("?")[0]
        try:
            conn = sqlite3.connect(db_path)
            cur = conn.cursor()
            
            # Resumes columns
            cur.execute("PRAGMA table_info(resumes)")
            existing_resume_cols = {r[1] for r in cur.fetchall()}
            resume_cols_to_add = [
                ("target_company", "TEXT"),
                ("template_id", "TEXT DEFAULT 'classic-professional'"),
                ("is_master", "BOOLEAN DEFAULT 0"),
                ("is_archived", "BOOLEAN DEFAULT 0"),
                ("scoring_report", "TEXT DEFAULT '{}'"),
                ("styling_config", "TEXT DEFAULT '{}'"),
                ("sections_order", "TEXT DEFAULT '[]'"),
                ("content", "TEXT DEFAULT '{}'"),
                ("evidence_links", "TEXT DEFAULT '[]'"),
                ("tailoring_history", "TEXT DEFAULT '[]'"),
            ]
            for col_name, col_type in resume_cols_to_add:
                if col_name not in existing_resume_cols:
                    cur.execute(f"ALTER TABLE resumes ADD COLUMN {col_name} {col_type}")

            # Applications columns
            cur.execute("PRAGMA table_info(applications)")
            existing_app_cols = {r[1] for r in cur.fetchall()}
            app_cols_to_add = [
                ("resume_id", "TEXT"),
                ("resume_snapshot", "TEXT DEFAULT '{}'"),
            ]
            for col_name, col_type in app_cols_to_add:
                if col_name not in existing_app_cols:
                    cur.execute(f"ALTER TABLE applications ADD COLUMN {col_name} {col_type}")

            # Integration connections table check
            cur.execute("PRAGMA table_info(integration_connections)")
            existing_int_cols = {r[1] for r in cur.fetchall()}
            if existing_int_cols:
                int_cols_to_add = [
                    ("scopes", "TEXT DEFAULT '[]'"),
                    ("rate_limit_info", "TEXT DEFAULT '{}'"),
                    ("metadata_json", "TEXT DEFAULT '{}'"),
                ]
                for col_name, col_type in int_cols_to_add:
                    if col_name not in existing_int_cols:
                        cur.execute(f"ALTER TABLE integration_connections ADD COLUMN {col_name} {col_type}")

            # Opportunities table check
            cur.execute("PRAGMA table_info(opportunities)")
            existing_opp_cols = {r[1] for r in cur.fetchall()}
            if existing_opp_cols:
                opp_cols_to_add = [
                    ("is_stale", "BOOLEAN DEFAULT 0"),
                    ("deadline_timezone", "TEXT DEFAULT 'IST'"),
                    ("skills", "TEXT DEFAULT '[]'"),
                    ("raw_metadata", "TEXT DEFAULT '{}'"),
                ]
                for col_name, col_type in opp_cols_to_add:
                    if col_name not in existing_opp_cols:
                        cur.execute(f"ALTER TABLE opportunities ADD COLUMN {col_name} {col_type}")

            conn.commit()
            conn.close()
        except Exception as e:
            print(f"Warning during schema column check: {e}")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def seed_initial_mock_data():
    """
    Auto-seeds the database with rich initial mock records if tables are empty.
    Ensures that fresh deployments have complete mock data out-of-the-box.
    """
    import datetime
    from ..models import models

    db = SessionLocal()
    try:
        # 1. Student
        student = db.query(models.Student).first()
        if not student:
            student = models.Student(
                id="std_current_user",
                name="Bhumit Gupta",
                email="bhumit.gupta@dypatil.edu",
                roll_no="21CS1044",
                department="Computer Science & Engineering",
                degree="B.Tech",
                batch="2022-2026",
                graduation_year=2026,
                cgpa=8.84,
                avatar="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256",
                bio="Full-stack software engineer passionate about distributed systems, modern web architectures, and developer tooling.",
                github_url="https://github.com/bhumit9744",
                portfolio_url="https://bhumit.dev",
                linkedin_url="https://linkedin.com/in/bhumit9744",
                phone="+91 98765 43210",
                active_backlogs=0,
                placement_status="Eligible"
            )
            db.add(student)
            db.commit()

        # 2. Master Resume
        resume = db.query(models.Resume).first()
        if not resume and student:
            now_iso = datetime.datetime.utcnow().isoformat()
            master_resume = models.Resume(
                id="res_master_001",
                student_id=student.id,
                title="Master Full-Stack Engineer Resume",
                target_role="Full-Stack Software Engineer",
                target_company="All Top Tier Tech Companies",
                template_id="classic-professional",
                is_master=True,
                is_archived=False,
                last_updated=now_iso,
                overall_score=94.0,
                content={
                    "contact": {
                        "full_name": student.name,
                        "email": student.email,
                        "phone": "+91 98765 43210",
                        "location": "Pune, Maharashtra, India",
                        "linkedin": student.linkedin_url or "https://linkedin.com/in/bhumit9744",
                        "github": student.github_url or "https://github.com/bhumit9744",
                        "portfolio": "https://bhumit.dev"
                    },
                    "summary": "High-impact Full-Stack Software Engineer with proven expertise in React 19, TypeScript, Python, FastAPI, and distributed database design. Proven track record building low-latency verification engines and high-concurrency campus recruitment platforms with 99.9% uptime.",
                    "education": [
                        {
                            "institution": "Dr. D. Y. Patil College of Engineering, Akurdi, Pune",
                            "degree": "Bachelor of Technology (B.Tech)",
                            "field": "Computer Science & Engineering",
                            "start_year": "2022",
                            "end_year": "2026",
                            "score_or_cgpa": "8.84 / 10.0 CGPA",
                            "coursework": ["Data Structures & Algorithms", "Database Management Systems", "Operating Systems", "Computer Networks", "Cloud Computing", "System Design"]
                        }
                    ],
                    "skills": [
                        {"category": "Programming Languages", "items": ["Python", "TypeScript", "JavaScript (ES6+)", "SQL", "C++", "HTML5/CSS3"]},
                        {"category": "Frameworks & Libraries", "items": ["React 19", "FastAPI", "Node.js", "Express", "TailwindCSS", "Three.js", "Next.js"]},
                        {"category": "Cloud & DevOps", "items": ["Docker", "Kubernetes", "AWS (EC2, S3)", "GitHub Actions CI/CD", "Nginx", "Linux"]},
                        {"category": "Databases & Tools", "items": ["PostgreSQL", "SQLite", "Redis", "Vapi Voice AI", "Git", "REST APIs", "WebSockets"]}
                    ],
                    "experience": [
                        {
                            "role": "Full-Stack Software Engineering Intern",
                            "company": "TechCorp Global Solutions",
                            "location": "Pune, India",
                            "start_date": "June 2025",
                            "end_date": "August 2025",
                            "current": False,
                            "bullets": [
                                "Architected and deployed asynchronous REST APIs using FastAPI and PostgreSQL, reducing endpoint response latency by 38% across 10,000+ daily queries.",
                                "Engineered dynamic React 19 frontend interfaces with TailwindCSS and Vite, achieving sub-second first-contentful-paint (FCP) and a 100/100 Lighthouse score.",
                                "Built automated CI/CD container deployment workflows using GitHub Actions and Docker, reducing deployment cycle times from weekly to continuous daily releases."
                            ]
                        }
                    ],
                    "projects": [
                        {
                            "title": "Placement Hub — AI Campus Recruitment Platform",
                            "tech_stack": ["React 19", "TypeScript", "FastAPI", "Python", "Gemini AI", "Vapi"],
                            "bullets": [
                                "Engineered an enterprise-grade full-stack placement portal integrating AI mock interview simulation, resume scoring, and recruitment pipeline.",
                                "Implemented client-side ATS Truth Verification engine cross-checking candidate resume claims against verified university academic records."
                            ],
                            "github_url": "https://github.com/bhumit9744/dypdyp",
                            "live_url": "https://bhumit9744.github.io/dypdyp/"
                        }
                    ],
                    "certifications": [
                        {"name": "AWS Certified Cloud Practitioner", "issuer": "Amazon Web Services", "issue_date": "2025"}
                    ]
                },
                styling_config={
                    "font_family": "Inter",
                    "font_size_pt": 10,
                    "accent_color": "#4f46e5",
                    "margins_mm": 12,
                    "line_spacing": 1.25,
                    "show_section_dividers": True
                },
                sections_order=["contact", "summary", "education", "skills", "experience", "projects", "certifications"]
            )
            db.add(master_resume)
            db.commit()

        # 3. Opportunities
        opp_count = db.query(models.OpportunityRecord).count()
        if opp_count == 0:
            mock_opps = [
                models.OpportunityRecord(
                    id="opp_google_swe_2026",
                    provider="Google Careers",
                    provenance_type="api_verified",
                    title="Software Engineering Intern — Summer 2026",
                    company_or_organizer="Google",
                    category="internship",
                    source_url="https://careers.google.com/jobs/results/intern-2026",
                    application_url="https://careers.google.com/jobs/results/intern-2026/apply",
                    location="Bengaluru / Hyderabad, India",
                    remote_status="hybrid",
                    compensation_type="stipend",
                    compensation_amount="₹1,15,000 / month",
                    eligibility={"min_cgpa": 7.5, "branches": ["Computer Science", "Information Technology"]},
                    skills=["C++", "Python", "Java", "Data Structures", "Algorithms"],
                    deadline="2026-11-30T23:59:59Z",
                    deadline_timezone="IST",
                    status="open",
                    is_stale=False,
                    description="Join Google engineering teams to design, test, deploy and maintain software solutions that impact billions of users worldwide."
                ),
                models.OpportunityRecord(
                    id="opp_msft_sde1_2026",
                    provider="Microsoft University",
                    provenance_type="api_verified",
                    title="Software Development Engineer 1 (Full-Time)",
                    company_or_organizer="Microsoft",
                    category="job",
                    source_url="https://careers.microsoft.com/us/en/job/sde1-india-2026",
                    application_url="https://careers.microsoft.com/us/en/job/sde1-india-2026/apply",
                    location="Hyderabad / Bengaluru / Pune",
                    remote_status="hybrid",
                    compensation_type="paid",
                    compensation_amount="₹22 - 28 LPA",
                    eligibility={"min_cgpa": 8.0, "branches": ["Computer Science", "IT"]},
                    skills=["C#", "TypeScript", "Azure", "Python", "React", "REST APIs"],
                    deadline="2026-12-15T23:59:59Z",
                    deadline_timezone="IST",
                    status="open",
                    is_stale=False,
                    description="Architect scalable cloud microservices, develop modern developer tools, and contribute to Azure platform resilience."
                ),
                models.OpportunityRecord(
                    id="opp_sih_2026",
                    provider="Ministry of Education & AICTE",
                    provenance_type="official_feed",
                    title="Smart India Hackathon 2026 (Software Edition)",
                    company_or_organizer="Government of India (AICTE)",
                    category="hackathon",
                    source_url="https://sih.gov.in",
                    application_url="https://sih.gov.in/register",
                    location="Pune / Nodal Centers Nationwide",
                    remote_status="on_site",
                    compensation_type="prize",
                    compensation_amount="₹1,00,000 per problem statement",
                    eligibility={"team_size": "6 Students"},
                    skills=["AI/ML", "Full-Stack Development", "Cloud Architecture"],
                    deadline="2026-11-10T23:59:59Z",
                    deadline_timezone="IST",
                    status="closing_soon",
                    is_stale=False,
                    description="World's largest open-innovation digital product hackathon addressing pressing real-world challenges."
                )
            ]
            for opp in mock_opps:
                db.add(opp)
            db.commit()

    except Exception as e:
        print(f"Notice: database seeding note: {e}")
        db.rollback()
    finally:
        db.close()


