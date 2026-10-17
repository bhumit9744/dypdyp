import datetime
from sqlalchemy import (
    Column,
    String,
    Integer,
    Float,
    Boolean,
    Text,
    DateTime,
    ForeignKey,
    JSON
)
from sqlalchemy.orm import relationship
from ..core.database import Base

class Student(Base):
    __tablename__ = "students"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    roll_no = Column(String, unique=True, index=True, nullable=False)
    department = Column(String, nullable=False)
    degree = Column(String, nullable=False)
    batch = Column(String, nullable=False)
    graduation_year = Column(Integer, nullable=False)
    cgpa = Column(Float, nullable=False)
    avatar = Column(String, nullable=True)
    bio = Column(Text, nullable=True)
    github_url = Column(String, nullable=True)
    portfolio_url = Column(String, nullable=True)
    linkedin_url = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    active_backlogs = Column(Integer, default=0)
    placement_status = Column(String, default="Eligible")

    # Relationships
    skills = relationship("Skill", back_populates="student", cascade="all, delete-orphan")
    projects = relationship("Project", back_populates="student", cascade="all, delete-orphan")
    resumes = relationship("Resume", back_populates="student", cascade="all, delete-orphan")
    applications = relationship("Application", back_populates="student", cascade="all, delete-orphan")
    assessment_results = relationship("AssessmentResult", back_populates="student", cascade="all, delete-orphan")
    interview_sessions = relationship("InterviewSession", back_populates="student", cascade="all, delete-orphan")
    saved_opportunities = relationship("SavedOpportunityRecord", back_populates="student", cascade="all, delete-orphan")
    roadmaps = relationship("StudentRoadmap", back_populates="student", cascade="all, delete-orphan")

class Project(Base):
    __tablename__ = "projects"

    id = Column(String, primary_key=True, index=True)
    student_id = Column(String, ForeignKey("students.id"), nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    tech_stack = Column(JSON, default=list)
    github_url = Column(String, nullable=True)
    live_demo_url = Column(String, nullable=True)
    stars = Column(Integer, default=0)
    featured = Column(Boolean, default=False)

    student = relationship("Student", back_populates="projects")

class Skill(Base):
    __tablename__ = "skills"

    id = Column(String, primary_key=True, index=True)
    student_id = Column(String, ForeignKey("students.id"), nullable=False)
    name = Column(String, nullable=False)
    category = Column(String, nullable=False)
    level = Column(String, default="Intermediate")
    verified = Column(Boolean, default=False)
    verification_source = Column(String, nullable=True)
    endorsements = Column(Integer, default=0)

    student = relationship("Student", back_populates="skills")
    evidences = relationship("Evidence", back_populates="skill", cascade="all, delete-orphan")

class Evidence(Base):
    __tablename__ = "evidences"

    id = Column(String, primary_key=True, index=True)
    skill_id = Column(String, ForeignKey("skills.id"), nullable=False)
    title = Column(String, nullable=False)
    evidence_type = Column(String, nullable=False) # e.g. "github_commit", "assessment", "hackathon_cert"
    evidence_url = Column(String, nullable=False)
    verification_hash = Column(String, nullable=True)
    verified_at = Column(DateTime, default=datetime.datetime.utcnow)

    skill = relationship("Skill", back_populates="evidences")

class Company(Base):
    __tablename__ = "companies"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False, unique=True)
    logo = Column(String, nullable=True)
    industry = Column(String, nullable=False)
    tier = Column(String, default="Dream") # "Dream", "Super Dream", "Core"
    open_roles_count = Column(Integer, default=0)
    website = Column(String, nullable=True)
    description = Column(Text, nullable=True)
    visited_date = Column(String, nullable=True)
    package_range = Column(String, nullable=True)
    eligibility_cgpa = Column(Float, default=7.0)
    hired_alumni_count = Column(Integer, default=0)
    required_skills = Column(JSON, default=list)

    jobs = relationship("Job", back_populates="company")

class Job(Base):
    __tablename__ = "jobs"

    id = Column(String, primary_key=True, index=True)
    company_id = Column(String, ForeignKey("companies.id"), nullable=False)
    title = Column(String, nullable=False)
    location = Column(String, nullable=False)
    work_type = Column(String, default="Hybrid") # "On-site", "Hybrid", "Remote"
    package_lpa = Column(Float, nullable=False)
    tier = Column(String, default="Dream")
    deadline = Column(String, nullable=False)
    required_cgpa = Column(Float, default=7.5)
    tags = Column(JSON, default=list)
    description = Column(Text, nullable=False)
    required_skills = Column(JSON, default=list)
    is_duplicate_detected = Column(Boolean, default=False)
    duplicate_notice = Column(String, nullable=True)

    company = relationship("Company", back_populates="jobs")
    applications = relationship("Application", back_populates="job")

class Alumni(Base):
    __tablename__ = "alumni"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    avatar = Column(String, nullable=True)
    company = Column(String, nullable=False)
    role = Column(String, nullable=False)
    batch = Column(String, nullable=False)
    department = Column(String, nullable=False)
    location = Column(String, nullable=False)
    linkedin_url = Column(String, nullable=True)
    github_url = Column(String, nullable=True)
    willing_to_refer = Column(Boolean, default=True)
    mentorship_available = Column(Boolean, default=True)

    referrals = relationship("Referral", back_populates="alumni")

class Referral(Base):
    __tablename__ = "referrals"

    id = Column(String, primary_key=True, index=True)
    alumni_id = Column(String, ForeignKey("alumni.id"), nullable=False)
    company_name = Column(String, nullable=False)
    role_title = Column(String, nullable=False)
    location = Column(String, nullable=False)
    status = Column(String, default="Open") # "Open", "Requested", "In Review", "Referred"
    eligibility_notes = Column(Text, nullable=True)
    posted_date = Column(String, nullable=False)

    alumni = relationship("Alumni", back_populates="referrals")

class Assessment(Base):
    __tablename__ = "assessments"

    id = Column(String, primary_key=True, index=True)
    title = Column(String, nullable=False)
    category = Column(String, nullable=False)
    duration_minutes = Column(Integer, default=60)
    total_questions = Column(Integer, default=30)
    difficulty = Column(String, default="Medium")
    badge = Column(String, nullable=True)

    results = relationship("AssessmentResult", back_populates="assessment")

class AssessmentResult(Base):
    __tablename__ = "assessment_results"

    id = Column(String, primary_key=True, index=True)
    assessment_id = Column(String, ForeignKey("assessments.id"), nullable=False)
    student_id = Column(String, ForeignKey("students.id"), nullable=False)
    score = Column(Float, nullable=False)
    percentile = Column(Float, nullable=False)
    status = Column(String, default="Completed")
    completed_date = Column(String, nullable=False)

    assessment = relationship("Assessment", back_populates="results")
    student = relationship("Student", back_populates="assessment_results")

class Resume(Base):
    __tablename__ = "resumes"

    id = Column(String, primary_key=True, index=True)
    student_id = Column(String, ForeignKey("students.id"), nullable=False)
    title = Column(String, nullable=False)
    target_role = Column(String, nullable=False)
    target_company = Column(String, nullable=True)
    template_id = Column(String, default="classic-professional")
    is_master = Column(Boolean, default=False)
    is_archived = Column(Boolean, default=False)
    last_updated = Column(String, nullable=False)
    ats_score = Column(Integer, default=85)
    ats_breakdown = Column(JSON, default=dict)
    scoring_report = Column(JSON, default=dict)
    summary = Column(Text, nullable=True)
    evidence_backed_claims = Column(Integer, default=0)
    styling_config = Column(JSON, default=dict)
    sections_order = Column(JSON, default=list)
    content = Column(JSON, default=dict)
    evidence_links = Column(JSON, default=list)
    tailoring_history = Column(JSON, default=list)

    student = relationship("Student", back_populates="resumes")

class AlumniResumeExample(Base):
    __tablename__ = "alumni_resume_examples"

    id = Column(String, primary_key=True, index=True)
    alumni_name = Column(String, nullable=False)
    graduation_year = Column(Integer, nullable=False)
    role = Column(String, nullable=False)
    industry = Column(String, nullable=False)
    template_id = Column(String, default="classic-professional")
    placement_outcome = Column(String, nullable=True)
    is_authorized = Column(Boolean, default=True)
    is_anonymized = Column(Boolean, default=True)
    skills = Column(JSON, default=list)
    projects_summary = Column(JSON, default=list)
    resume_content = Column(JSON, default=dict)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class Application(Base):
    __tablename__ = "applications"

    id = Column(String, primary_key=True, index=True)
    student_id = Column(String, ForeignKey("students.id"), nullable=False)
    job_id = Column(String, ForeignKey("jobs.id"), nullable=False)
    applied_date = Column(String, nullable=False)
    status = Column(String, default="Applied") # "Applied", "Screening", "Interview", "Offer", "Rejected", "Withdrawn"
    current_round = Column(String, default="Application Review")
    next_step_deadline = Column(String, nullable=True)
    match_score = Column(Integer, default=85)
    timeline = Column(JSON, default=list)
    resume_id = Column(String, ForeignKey("resumes.id"), nullable=True)
    resume_snapshot = Column(JSON, nullable=True)

    student = relationship("Student", back_populates="applications")
    job = relationship("Job", back_populates="applications")
    interviews = relationship("Interview", back_populates="application")
    resume = relationship("Resume")

class Interview(Base):
    __tablename__ = "interviews"

    id = Column(String, primary_key=True, index=True)
    application_id = Column(String, ForeignKey("applications.id"), nullable=False)
    round_name = Column(String, nullable=False)
    date = Column(String, nullable=False)
    time = Column(String, nullable=False)
    duration_minutes = Column(Integer, default=60)
    interviewer = Column(String, nullable=False)
    meet_url = Column(String, nullable=False)
    status = Column(String, default="Upcoming")
    preparation_checklist = Column(JSON, default=list)
    notes = Column(Text, nullable=True)

    application = relationship("Application", back_populates="interviews")

class CampusDrive(Base):
    __tablename__ = "campus_drives"

    id = Column(String, primary_key=True, index=True)
    company_name = Column(String, nullable=False)
    company_logo = Column(String, nullable=True)
    role_title = Column(String, nullable=False)
    package_lpa = Column(Float, nullable=False)
    drive_date = Column(String, nullable=False)
    status = Column(String, default="Upcoming")  # "Upcoming", "Active", "Completed"
    source = Column(String, default="Official TPO")
    min_cgpa = Column(Float, default=7.0)
    eligible_branches = Column(JSON, default=list)
    stages = Column(JSON, default=list)
    shortlisted_count = Column(Integer, default=0)
    total_registered = Column(Integer, default=0)

class ShortlistRecord(Base):
    __tablename__ = "shortlists"

    id = Column(String, primary_key=True, index=True)
    drive_id = Column(String, nullable=False)
    company_name = Column(String, nullable=False)
    role_title = Column(String, nullable=False)
    student_id = Column(String, nullable=False)
    student_name = Column(String, nullable=False)
    roll_no = Column(String, nullable=False)
    department = Column(String, nullable=False)
    round_cleared = Column(String, nullable=False)
    next_round = Column(String, nullable=False)
    shortlist_date = Column(String, nullable=False)
    published_by = Column(String, default="College TPO")

class InterviewExperienceRecord(Base):
    __tablename__ = "interview_experiences"

    id = Column(String, primary_key=True, index=True)
    student_name = Column(String, nullable=False)
    company_name = Column(String, nullable=False)
    role_title = Column(String, nullable=False)
    placed_status = Column(String, default="Selected")  # "Selected", "Rejected", "Pending"
    package_lpa = Column(Float, nullable=True)
    interview_date = Column(String, nullable=False)
    difficulty = Column(String, default="Medium")
    rounds = Column(JSON, default=list)
    overall_experience = Column(Text, nullable=False)
    preparation_tips = Column(Text, nullable=True)
    topics_covered = Column(JSON, default=list)
    verification_status = Column(String, default="Student-Reported (Unverified)")
    submitted_at = Column(DateTime, default=datetime.datetime.utcnow)
    upvotes = Column(Integer, default=0)

# =========================================================
# Real-Time AI Interview Studio Models
# =========================================================

class InterviewSession(Base):
    __tablename__ = "interview_sessions"

    id = Column(String, primary_key=True, index=True)
    student_id = Column(String, ForeignKey("students.id"), nullable=False, index=True)
    role_target = Column(String, nullable=False)
    job_id = Column(String, nullable=True)
    interview_type = Column(String, default="Technical") # "Technical", "System Design", "Behavioral", "Mixed"
    difficulty = Column(String, default="Medium")        # "Easy", "Medium", "Hard"
    required_skills = Column(JSON, default=list)
    status = Column(String, default="Setup")            # "Setup", "InProgress", "Completed", "Cancelled"
    question_limit = Column(Integer, default=5)
    duration_minutes = Column(Integer, default=15)
    overall_score = Column(Float, nullable=True)        # 0.0 - 100.0, strictly separated from CV measurements
    overall_feedback = Column(JSON, nullable=True)      # Final comprehensive rubric breakdown
    consent_record = Column(JSON, default=dict)         # Explicit camera/mic consent and retention timestamp
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    started_at = Column(DateTime, nullable=True)
    ended_at = Column(DateTime, nullable=True)

    # Relationships
    student = relationship("Student", back_populates="interview_sessions")
    turns = relationship("InterviewTurn", back_populates="session", cascade="all, delete-orphan", order_by="InterviewTurn.turn_number")
    vision_metrics = relationship("InterviewVisionMetric", back_populates="session", cascade="all, delete-orphan", order_by="InterviewVisionMetric.timestamp")

class InterviewTurn(Base):
    __tablename__ = "interview_turns"

    id = Column(String, primary_key=True, index=True)
    session_id = Column(String, ForeignKey("interview_sessions.id"), nullable=False, index=True)
    turn_number = Column(Integer, nullable=False)
    question_text = Column(Text, nullable=False)
    question_category = Column(String, default="Technical") # "Technical", "Problem Solving", "Experience", "FollowUp"
    question_rubric = Column(JSON, default=dict)            # Expected criteria & grading anchors
    is_followup = Column(Boolean, default=False)
    parent_turn_id = Column(String, nullable=True)
    student_answer_transcript = Column(Text, nullable=True) # Real audio transcription or text fallback
    input_method = Column(String, default="voice")          # "voice", "text_fallback"
    answer_duration_seconds = Column(Float, nullable=True)
    evaluation_result = Column(JSON, nullable=True)         # Correctness, relevance, completeness, clarity, evidence
    turn_status = Column(String, default="Asking")          # "Asking", "Listening", "Evaluating", "Completed", "Skipped"
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    answered_at = Column(DateTime, nullable=True)

    session = relationship("InterviewSession", back_populates="turns")

class InterviewVisionMetric(Base):
    """
    Separate computer vision telemetry model.
    CRITICAL PRIVACY RULE: These measurements are strictly for camera ergonomics,
    lighting, and framing awareness. They are NEVER used to infer honesty, intelligence,
    cheating, or interview suitability.
    """
    __tablename__ = "interview_vision_metrics"

    id = Column(String, primary_key=True, index=True)
    session_id = Column(String, ForeignKey("interview_sessions.id"), nullable=False, index=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    face_detected = Column(Boolean, default=True)
    face_count = Column(Integer, default=1)
    approx_head_pose = Column(String, default="Looking Forward") # "Looking Forward", "Turned Left", "Turned Right", "Looking Down", "Looking Up", "Undetermined"
    lighting_quality = Column(String, default="Good")            # "Good", "Too Dark", "Too Bright", "Uneven"
    frame_blur = Column(Float, default=0.0)
    obstruction_detected = Column(Boolean, default=False)
    confidence = Column(Float, default=1.0)
    notes = Column(String, default="Camera positioning indicator only; not factored into candidate interview score.")

    session = relationship("InterviewSession", back_populates="vision_metrics")


# =========================================================
# Integration Center Models
# =========================================================

class IntegrationConnection(Base):
    __tablename__ = "integration_connections"

    id = Column(String(50), primary_key=True, index=True) # e.g. "github", "google_workspace", "vercel", "cloudflare", "supabase"
    provider = Column(String(50), nullable=False)
    status = Column(String(30), default="Not connected") # "Not connected", "Connecting", "Connected", "Expired", "Degraded", "Error"
    account_id = Column(String(100), nullable=True)
    account_name = Column(String(150), nullable=True)
    account_avatar = Column(String(300), nullable=True)
    repository = Column(String(150), nullable=True)
    scopes = Column(JSON, default=list)
    encrypted_token = Column(Text, nullable=True) # Stored securely; never exposed in API outputs or logs
    last_verified_at = Column(DateTime, nullable=True)
    last_error = Column(Text, nullable=True)
    rate_limit_info = Column(JSON, default=dict)
    metadata_json = Column(JSON, default=dict)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)


# =========================================================
# Opportunities Intelligence Models
# =========================================================

class OpportunityRecord(Base):
    """
    Normalized opportunity entity across all providers.
    Supports jobs, internships, hackathons, competitions, scholarships, fellowships, and programmes.
    Maintains strict provenance, verification timestamps, and deduplication hashes.
    """
    __tablename__ = "opportunities"

    id = Column(String(60), primary_key=True, index=True) # e.g. "opp_gh_001", "opp_devpost_123"
    source_id = Column(String(100), nullable=True, index=True)
    provider = Column(String(50), nullable=False, index=True) # "linkedin", "unstop", "devpost", "mlh", "wellfound", "naukri", "company_career", "university"
    provenance_type = Column(String(30), nullable=False) # "api_verified", "official_feed", "link_discovery", "manual_import"
    title = Column(String(255), nullable=False, index=True)
    company_or_organizer = Column(String(255), nullable=False, index=True)
    category = Column(String(50), nullable=False, index=True) # "job", "internship", "hackathon", "competition", "scholarship", "fellowship", "programme"
    source_url = Column(Text, nullable=False)
    application_url = Column(Text, nullable=False)
    location = Column(String(150), default="Remote")
    remote_status = Column(String(30), default="remote") # "remote", "hybrid", "on_site"
    compensation_type = Column(String(30), default="unknown") # "paid", "unpaid", "stipend", "prize", "unknown"
    compensation_amount = Column(String(150), nullable=True)
    eligibility = Column(JSON, default=dict) # criteria dict (cgpa, degree, batch, etc.)
    experience_requirements = Column(String(150), nullable=True) # "Entry Level", "0-1 years", "Students"
    skills = Column(JSON, default=list) # normalized required/recommended skills
    deadline = Column(String(100), nullable=True) # ISO string or published date string
    deadline_timezone = Column(String(50), default="IST")
    status = Column(String(30), default="open", index=True) # "open", "closing_soon", "closed", "unknown"
    is_stale = Column(Boolean, default=False)
    last_verified_at = Column(DateTime, nullable=True)
    retrieved_at = Column(DateTime, default=datetime.datetime.utcnow)
    description = Column(Text, nullable=False)
    canonical_url_hash = Column(String(64), index=True, nullable=False) # SHA256 of normalized URL
    raw_metadata = Column(JSON, default=dict)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    saved_entries = relationship("SavedOpportunityRecord", back_populates="opportunity", cascade="all, delete-orphan")


class SavedOpportunityRecord(Base):
    """
    User-saved opportunity tracking with pipeline application status and configurable reminders.
    """
    __tablename__ = "saved_opportunities"

    id = Column(String(60), primary_key=True, index=True) # "sopp_..."
    student_id = Column(String, ForeignKey("students.id"), nullable=False, index=True)
    opportunity_id = Column(String(60), ForeignKey("opportunities.id"), nullable=False, index=True)
    application_status = Column(String(30), default="saved", index=True) # "saved", "applied", "interviewing", "offered", "rejected", "archived"
    reminder_enabled = Column(Boolean, default=True)
    reminder_frequency = Column(String(30), default="3_days_before") # "daily", "3_days_before", "1_day_before"
    notes = Column(Text, nullable=True)
    applied_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    opportunity = relationship("OpportunityRecord", back_populates="saved_entries")
    student = relationship("Student", back_populates="saved_opportunities")


class OpportunityUserPreference(Base):
    """
    Explicit user preferences for opportunity discovery.
    Never fabricated or assumed without user configuration.
    """
    __tablename__ = "opportunity_user_preferences"

    id = Column(String(60), primary_key=True, index=True)
    student_id = Column(String, ForeignKey("students.id"), nullable=False, unique=True, index=True)
    preferred_roles = Column(JSON, default=list)
    preferred_categories = Column(JSON, default=list)
    preferred_locations = Column(JSON, default=list)
    remote_only = Column(Boolean, default=False)
    min_compensation = Column(String(100), nullable=True)
    subscribed_providers = Column(JSON, default=list)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)


# =========================================================
# AI Career Roadmap Planner Models
# =========================================================

class CareerTrack(Base):
    __tablename__ = "career_tracks"

    id = Column(String, primary_key=True, index=True)
    title = Column(String, nullable=False, unique=True)
    description = Column(Text, nullable=False)
    category = Column(String, nullable=False) # "Engineering", "Design", "Data & AI", "Cloud & Security", "Quality"
    level = Column(String, default="Beginner-friendly") # "Beginner-friendly", "Intermediate", "Advanced"
    estimated_duration_range = Column(String, default="3-6 Months")
    core_skills = Column(JSON, default=list)
    prerequisites = Column(JSON, default=list)
    typical_project_outcomes = Column(JSON, default=list)
    template_phases = Column(JSON, default=list)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class StudentRoadmap(Base):
    __tablename__ = "student_roadmaps"

    id = Column(String, primary_key=True, index=True)
    student_id = Column(String, ForeignKey("students.id"), nullable=False, index=True)
    career_track_id = Column(String, nullable=True) # None if custom
    career_title = Column(String, nullable=False)
    custom_goal = Column(String, nullable=True)
    specialization = Column(String, nullable=True)
    starting_proficiency = Column(String, default="Beginner") # "Beginner", "Intermediate", "Advanced"
    target_timeline_months = Column(Integer, default=6)
    weekly_hours_available = Column(Integer, default=15)
    learning_style = Column(String, default="Guided Practice") # "Reading", "Videos", "Guided Practice", "Project-First"
    priority_focus = Column(String, default="Placements & Portfolio")
    target_companies = Column(JSON, default=list)
    status = Column(String, default="Active") # "Active", "Paused", "Completed"
    current_phase_index = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    # Relationships
    student = relationship("Student", back_populates="roadmaps")
    phases = relationship("RoadmapPhase", back_populates="roadmap", cascade="all, delete-orphan", order_by="RoadmapPhase.phase_number")
    projects = relationship("RoadmapProject", back_populates="roadmap", cascade="all, delete-orphan")
    milestones = relationship("RoadmapMilestone", back_populates="roadmap", cascade="all, delete-orphan")
    snapshots = relationship("RoadmapProgressSnapshot", back_populates="roadmap", cascade="all, delete-orphan")
    changes = relationship("RoadmapChange", back_populates="roadmap", cascade="all, delete-orphan")

class RoadmapPhase(Base):
    __tablename__ = "roadmap_phases"

    id = Column(String, primary_key=True, index=True)
    roadmap_id = Column(String, ForeignKey("student_roadmaps.id"), nullable=False, index=True)
    phase_number = Column(Integer, nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    why_it_matters = Column(Text, nullable=False)
    learning_objectives = Column(JSON, default=list)
    skills_covered = Column(JSON, default=list)
    prerequisites = Column(JSON, default=list)
    estimated_duration_weeks = Column(Integer, default=4)
    practical_milestone = Column(String, nullable=False)
    completion_criteria = Column(JSON, default=list)
    status = Column(String, default="Upcoming") # "Upcoming", "In Progress", "Completed", "Blocked"

    roadmap = relationship("StudentRoadmap", back_populates="phases")
    tasks = relationship("RoadmapTask", back_populates="phase", cascade="all, delete-orphan", order_by="RoadmapTask.task_number")

class RoadmapTask(Base):
    __tablename__ = "roadmap_tasks"

    id = Column(String, primary_key=True, index=True)
    phase_id = Column(String, ForeignKey("roadmap_phases.id"), nullable=False, index=True)
    roadmap_id = Column(String, nullable=False, index=True)
    task_number = Column(Integer, nullable=False)
    week_number = Column(Integer, default=1)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    associated_skill = Column(String, nullable=False)
    learning_objective = Column(Text, nullable=False)
    why_it_matters = Column(Text, nullable=False)
    estimated_hours = Column(Float, default=3.0)
    priority = Column(String, default="Medium") # "High", "Medium", "Low"
    prerequisites = Column(JSON, default=list)
    resource_ids = Column(JSON, default=list)
    practical_exercise = Column(Text, nullable=True)
    completion_criteria = Column(Text, nullable=False)
    status = Column(String, default="Not Started") # "Not Started", "In Progress", "Completed", "Blocked"
    due_date = Column(String, nullable=True)
    completed_at = Column(DateTime, nullable=True)
    notes = Column(Text, nullable=True)

    phase = relationship("RoadmapPhase", back_populates="tasks")

class LearningResource(Base):
    __tablename__ = "learning_resources"

    id = Column(String, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    resource_type = Column(String, nullable=False) # "Video", "Article", "Documentation", "Course", "Tutorial", "Practice Platform", "Repository", "Other"
    provider = Column(String, nullable=False) # e.g. "MDN", "freeCodeCamp", "Official Docs", "Coursera"
    url = Column(String, nullable=False)
    career_tracks = Column(JSON, default=list)
    skills = Column(JSON, default=list)
    difficulty = Column(String, default="Beginner") # "Beginner", "Intermediate", "Advanced"
    language = Column(String, default="English")
    price_status = Column(String, default="Free") # "Free", "Freemium", "Paid"
    estimated_duration = Column(String, nullable=True)
    tags = Column(JSON, default=list)
    verification_status = Column(String, default="Verified Official") # "Verified Official", "Verified Platform", "Community Submitted"
    last_reviewed = Column(DateTime, default=datetime.datetime.utcnow)

class RoadmapProject(Base):
    __tablename__ = "roadmap_projects"

    id = Column(String, primary_key=True, index=True)
    roadmap_id = Column(String, ForeignKey("student_roadmaps.id"), nullable=False, index=True)
    title = Column(String, nullable=False)
    problem_statement = Column(Text, nullable=False)
    expected_outcome = Column(Text, nullable=False)
    skills_practiced = Column(JSON, default=list)
    prerequisite_tasks = Column(JSON, default=list)
    suggested_tech = Column(JSON, default=list)
    feature_checklist = Column(JSON, default=list)
    definition_of_done = Column(Text, nullable=False)
    expected_hours = Column(Integer, default=20)
    portfolio_relevance = Column(Text, nullable=False)
    github_url = Column(String, nullable=True)
    demo_url = Column(String, nullable=True)
    status = Column(String, default="Not Started") # "Not Started", "In Progress", "Completed"
    completed_at = Column(DateTime, nullable=True)

    roadmap = relationship("StudentRoadmap", back_populates="projects")

class RoadmapMilestone(Base):
    __tablename__ = "roadmap_milestones"

    id = Column(String, primary_key=True, index=True)
    roadmap_id = Column(String, ForeignKey("student_roadmaps.id"), nullable=False, index=True)
    title = Column(String, nullable=False)
    target_date = Column(String, nullable=False)
    status = Column(String, default="Upcoming") # "Upcoming", "In Progress", "Completed", "Overdue"
    associated_phase_or_project = Column(String, nullable=True)
    completed_at = Column(DateTime, nullable=True)

    roadmap = relationship("StudentRoadmap", back_populates="milestones")

class RoadmapProgressSnapshot(Base):
    __tablename__ = "roadmap_progress_snapshots"

    id = Column(String, primary_key=True, index=True)
    student_id = Column(String, nullable=False, index=True)
    roadmap_id = Column(String, ForeignKey("student_roadmaps.id"), nullable=False, index=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    completed_task_count = Column(Integer, default=0)
    total_task_count = Column(Integer, default=0)
    completion_percentage = Column(Float, default=0.0)
    completed_hours = Column(Float, default=0.0)
    planned_hours = Column(Float, default=0.0)

    roadmap = relationship("StudentRoadmap", back_populates="snapshots")

class RoadmapChange(Base):
    __tablename__ = "roadmap_changes"

    id = Column(String, primary_key=True, index=True)
    roadmap_id = Column(String, ForeignKey("student_roadmaps.id"), nullable=False, index=True)
    change_type = Column(String, nullable=False) # "Timeline Extended", "Task Rescheduled", "Availability Updated", "Paced Accelerated", "Phase Reordered"
    previous_state = Column(JSON, default=dict)
    new_state = Column(JSON, default=dict)
    reason = Column(Text, nullable=False)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    accepted = Column(Boolean, default=True)

    roadmap = relationship("StudentRoadmap", back_populates="changes")

# ==========================================
# AI CAREER GUIDANCE MODELS
# ==========================================

class CareerGuidanceProfile(Base):
    __tablename__ = "career_guidance_profiles"

    id = Column(String, primary_key=True, index=True)
    student_id = Column(String, ForeignKey("students.id"), nullable=False, unique=True, index=True)
    interests = Column(JSON, default=list) # e.g. ["Building web apps", "Data analysis", "UX research"]
    preferred_activities = Column(JSON, default=list) # e.g. ["Coding", "System design", "Visual styling"]
    disliked_activities = Column(JSON, default=list) # e.g. ["Low-level assembly", "Sales calls"]
    technical_skills = Column(JSON, default=list)
    soft_skills = Column(JSON, default=list)
    academic_focus = Column(JSON, default=list)
    practical_experiences = Column(JSON, default=list)
    weekly_hours_available = Column(Integer, default=15)
    preparation_timeline = Column(String, default="6 Months") # "3 Months", "6 Months", "1 Year"
    preferred_learning_format = Column(String, default="Project-first") # "Project-first", "Guided Videos", "Interactive Labs"
    preparation_challenges = Column(JSON, default=list) # e.g. ["Time management", "DSA fundamentals"]
    immediate_priority = Column(String, default="Skill Development") # "Exploration", "Internship", "Placement", "Skill Development"
    target_companies = Column(JSON, default=list)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

class CareerGoal(Base):
    __tablename__ = "career_goals"

    id = Column(String, primary_key=True, index=True)
    student_id = Column(String, ForeignKey("students.id"), nullable=False, index=True)
    career_id = Column(String, nullable=False, index=True) # e.g. "role_fullstack", "role_aiml"
    career_title = Column(String, nullable=False)
    is_primary = Column(Boolean, default=True) # True = Primary Goal, False = Alternate/Exploratory
    selection_reasons = Column(JSON, default=list)
    uncertainties = Column(JSON, default=list)
    status = Column(String, default="Active") # "Active", "Exploring", "Archived"
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

class CareerComparisonRecord(Base):
    __tablename__ = "career_comparisons"

    id = Column(String, primary_key=True, index=True)
    student_id = Column(String, ForeignKey("students.id"), nullable=False, index=True)
    career_ids = Column(JSON, default=list) # list of 2 or 3 career role IDs
    notes = Column(Text, nullable=True)
    attraction_points = Column(JSON, default=dict) # { role_id: "What attracts me" }
    concern_points = Column(JSON, default=dict) # { role_id: "What concerns me" }
    unanswered_questions = Column(JSON, default=list)
    selected_primary_id = Column(String, nullable=True)
    selected_alternate_id = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

class CareerExperiment(Base):
    __tablename__ = "career_experiments"

    id = Column(String, primary_key=True, index=True)
    career_category = Column(String, nullable=False) # "Software Development", "UI/UX Design", "AI/ML and Data", "Cybersecurity", "Cloud and DevOps"
    title = Column(String, nullable=False)
    difficulty = Column(String, default="Beginner") # "Beginner", "Intermediate"
    expected_duration = Column(String, default="45-60 mins")
    learning_objective = Column(Text, nullable=False)
    prerequisites = Column(JSON, default=list)
    instructions = Column(JSON, default=list) # Ordered step-by-step guidance
    required_tools = Column(JSON, default=list) # Free tools needed (e.g. Browser, VS Code, Figma Free)
    expected_deliverable = Column(Text, nullable=False)
    completion_criteria = Column(JSON, default=list)
    resources = Column(JSON, default=list)

class StudentCareerExperiment(Base):
    __tablename__ = "student_career_experiments"

    id = Column(String, primary_key=True, index=True)
    student_id = Column(String, ForeignKey("students.id"), nullable=False, index=True)
    experiment_id = Column(String, ForeignKey("career_experiments.id"), nullable=False, index=True)
    status = Column(String, default="Not Started") # "Not Started", "In Progress", "Completed"
    reflection_enjoyed = Column(Text, nullable=True)
    reflection_difficult = Column(Text, nullable=True)
    reflection_matched_expectations = Column(String, nullable=True) # "Exceeded", "Matched", "Different than expected"
    reflection_would_advance = Column(Boolean, default=True)
    reflection_next_learning = Column(Text, nullable=True)
    completed_at = Column(DateTime, nullable=True)

class CareerGuidanceConversation(Base):
    __tablename__ = "career_guidance_conversations"

    id = Column(String, primary_key=True, index=True)
    student_id = Column(String, ForeignKey("students.id"), nullable=False, index=True)
    title = Column(String, default="Career Guidance Session")
    messages = Column(JSON, default=list) # Array of { id, sender, text, timestamp, structured_sections, contextual_actions }
    saved_summary = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

class CareerGuidanceAction(Base):
    __tablename__ = "career_guidance_actions"

    id = Column(String, primary_key=True, index=True)
    student_id = Column(String, ForeignKey("students.id"), nullable=False, index=True)
    title = Column(String, nullable=False)
    explanation = Column(Text, nullable=False)
    why_it_matters = Column(Text, nullable=False)
    estimated_effort = Column(String, default="2-3 hours")
    suggested_deadline = Column(String, nullable=True)
    related_career = Column(String, nullable=True)
    related_skill = Column(String, nullable=True)
    status = Column(String, default="Pending") # "Pending", "In Progress", "Completed"
    transferred_to_roadmap = Column(Boolean, default=False)
    roadmap_task_id = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class CareerDecisionHistory(Base):
    __tablename__ = "career_decision_history"

    id = Column(String, primary_key=True, index=True)
    student_id = Column(String, ForeignKey("students.id"), nullable=False, index=True)
    decision_type = Column(String, nullable=False) # "Goal Selected", "Goal Updated", "Comparison Saved", "Experiment Completed", "Action Plan Created"
    previous_goal = Column(String, nullable=True)
    new_goal = Column(String, nullable=True)
    explanation = Column(Text, nullable=False)
    associated_role_id = Column(String, nullable=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
