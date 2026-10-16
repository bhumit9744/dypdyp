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
    last_updated = Column(String, nullable=False)
    ats_score = Column(Integer, default=90)
    ats_breakdown = Column(JSON, default=dict)
    summary = Column(Text, nullable=True)
    evidence_backed_claims = Column(Integer, default=0)

    student = relationship("Student", back_populates="resumes")

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

    student = relationship("Student", back_populates="applications")
    job = relationship("Job", back_populates="applications")
    interviews = relationship("Interview", back_populates="application")

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
