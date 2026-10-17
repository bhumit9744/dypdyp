"""
AI Career Roadmap Planner Endpoints — Placement Hub
Provides career track templates, personalized roadmap generation, task tracking,
resource discovery, project milestones, analytics snapshots, and AI contextual assistance.
"""

import datetime
import uuid
from typing import List, Optional, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status, Header, Query
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from ..core.database import get_db
from ..models import models
from ..core.config import settings

router = APIRouter(prefix="/roadmap", tags=["AI Career Roadmap Planner"])

# ---------------------------------------------------------------------------
# Authentication Helper
# ---------------------------------------------------------------------------

def get_current_student(
    db: Session = Depends(get_db),
    x_student_id: Optional[str] = Header(None)
) -> models.Student:
    if x_student_id:
        student = db.query(models.Student).filter(models.Student.id == x_student_id).first()
        if student:
            return student
    student = db.query(models.Student).first()
    if not student:
        # Create a default student for local dev/demo if not seeded
        student = models.Student(
            id="std_2026_042",
            name="Bhumit Gupta",
            email="bhumit.gupta@dypatil.edu",
            roll_no="21CS1044",
            department="Computer Science & Engineering",
            degree="Bachelor of Technology (B.Tech)",
            batch="2022 - 2026",
            graduation_year=2026,
            cgpa=8.84,
            bio="Full-stack software engineer passionate about distributed systems and cloud architectures.",
            github_url="https://github.com/bhumit9744",
            portfolio_url="https://bhumit.dev",
            linkedin_url="https://linkedin.com/in/bhumit9744",
            phone="+91 98765 43210",
            active_backlogs=0,
            placement_status="Eligible"
        )
        db.add(student)
        db.commit()
        db.refresh(student)
    return student

# ---------------------------------------------------------------------------
# Pydantic Schemas
# ---------------------------------------------------------------------------

class TaskUpdateSchema(BaseModel):
    status: Optional[str] = Field(None, description="Not Started, In Progress, Completed, Blocked")
    notes: Optional[str] = None
    due_date: Optional[str] = None

class ProjectUpdateSchema(BaseModel):
    status: Optional[str] = Field(None, description="Not Started, In Progress, Completed")
    github_url: Optional[str] = None
    demo_url: Optional[str] = None
    feature_checklist: Optional[List[Dict[str, Any]]] = None

class RoadmapGenerateRequest(BaseModel):
    career_track_id: Optional[str] = None
    custom_goal: Optional[str] = None
    specialization: Optional[str] = None
    starting_proficiency: str = "Beginner" # Beginner, Intermediate, Advanced
    target_timeline_months: int = 6 # 1, 3, 6, 12
    weekly_hours_available: int = 15
    learning_style: str = "Guided Practice" # Reading, Videos, Guided Practice, Project-First
    priority_focus: str = "Placements & Portfolio"
    target_companies: List[str] = []
    already_known_skills: List[str] = []

class AssistantQueryRequest(BaseModel):
    prompt: str
    task_id: Optional[str] = None
    phase_id: Optional[str] = None

class AdaptationActionRequest(BaseModel):
    proposal_id: str
    action: str = "accept" # "accept" or "reject"
    change_type: str
    details: Dict[str, Any]
    reason: str

class ResourceCreateRequest(BaseModel):
    title: str
    description: str
    resource_type: str
    provider: str
    url: str
    career_tracks: List[str] = []
    skills: List[str] = []
    difficulty: str = "Beginner"
    language: str = "English"
    price_status: str = "Free"
    estimated_duration: Optional[str] = None
    tags: List[str] = []
    verification_status: str = "Community Submitted"

# ---------------------------------------------------------------------------
# Seed Data Definitions for 10 Career Tracks & Resources
# ---------------------------------------------------------------------------

CAREER_TRACKS_CATALOG = [
    {
        "id": "track_fullstack",
        "title": "Full-Stack Developer",
        "category": "Engineering",
        "level": "Beginner-friendly",
        "estimated_duration_range": "3-6 Months",
        "description": "Master modern full-stack web development from HTML/CSS/JS fundamentals through React, Node.js, databases, cloud deployment, and DSA placement prep.",
        "core_skills": ["HTML5/CSS3", "JavaScript (ES6+)", "React", "Node.js", "Express", "PostgreSQL / MongoDB", "REST APIs", "Git/GitHub", "Docker Basics", "Data Structures & Algorithms"],
        "prerequisites": ["Basic computer literacy", "Logical thinking"],
        "typical_project_outcomes": ["Responsive Portfolio", "Full-Stack SaaS Platform", "Real-Time Collaboration App", "Production Capstone on Cloud"],
        "template_phases": [
            {
                "phase_number": 1,
                "title": "Programming and Web Fundamentals",
                "description": "HTML semantic structure, CSS flexbox/grid, JavaScript asynchronous programming, DOM manipulation, Git and GitHub workflow.",
                "why_it_matters": "Web fundamentals are the bedrock of any software career; interviewers test basic DOM behavior, closures, and responsive layouts.",
                "estimated_duration_weeks": 3,
                "skills_covered": ["HTML5", "CSS3 / Flexbox / Grid", "JavaScript Async", "DOM Manipulation", "Git & GitHub"],
                "practical_milestone": "Build and publish a responsive personal portfolio with semantic markup and custom CSS.",
                "completion_criteria": ["Valid semantic HTML5 structure", "Responsive across mobile and desktop", "Hosted on GitHub Pages / Vercel with clean commit history"]
            },
            {
                "phase_number": 2,
                "title": "Frontend Development with React",
                "description": "React fundamentals, components, hooks, routing, forms, API integration, loading and error states, and responsive UI architecture.",
                "why_it_matters": "Frontend engineering requires state-driven architecture and clean user experiences across varying network speeds and devices.",
                "estimated_duration_weeks": 4,
                "skills_covered": ["React 19", "Hooks & State", "Client Routing", "API Data Fetching", "Form Validation", "Accessibility (a11y)"],
                "practical_milestone": "Build a multi-page React application consuming a real public or mock API with error handling.",
                "completion_criteria": ["Clean component composition", "Comprehensive loading, empty, and error states", "Accessible keyboard navigation and contrast"]
            },
            {
                "phase_number": 3,
                "title": "Backend Development & REST APIs",
                "description": "Node.js, Express, REST API design, request validation, authentication, JWT tokens, password hashing, and environment configuration.",
                "why_it_matters": "Backend services form the business engine, handling secure transactions, authentication, and structured communication with databases.",
                "estimated_duration_weeks": 4,
                "skills_covered": ["Node.js", "Express", "RESTful Architecture", "JWT & Auth", "Security & Hashing", "API Error Handling"],
                "practical_milestone": "Develop an authenticated backend with protected endpoints, rate limiting, and automated testing.",
                "completion_criteria": ["JWT authenticated routes", "Input validation middleware", "Unit/integration API tests passing"]
            },
            {
                "phase_number": 4,
                "title": "Databases and Full-Stack Integration",
                "description": "Relational database modeling with SQL/PostgreSQL, document storage with MongoDB, indexing, query optimization, and full-stack integration.",
                "why_it_matters": "Almost every campus technical interview includes relational database schema design, joins, normalization, and ACID properties.",
                "estimated_duration_weeks": 4,
                "skills_covered": ["PostgreSQL", "SQL & Joins", "Data Modeling", "MongoDB", "Query Optimization", "Pagination & Filtering"],
                "practical_milestone": "Connect frontend, backend, and relational database into one cohesive full-stack web application.",
                "completion_criteria": ["3NF normalized database schema", "Efficient indexed queries with pagination", "Complete CRUD with optimistic UI updates"]
            },
            {
                "phase_number": 5,
                "title": "Production Readiness & DevOps Basics",
                "description": "Cloud hosting, Docker containerization, CI/CD pipelines, application monitoring, performance optimization, and web security best practices.",
                "why_it_matters": "Recruiters prioritize candidates who know how code is built, containerized, securely deployed, and monitored in real environments.",
                "estimated_duration_weeks": 3,
                "skills_covered": ["Docker", "CI/CD Pipelines", "Cloud Deployment (AWS/Render)", "Web Security (OWASP Top 10)", "Lighthouse Optimization"],
                "practical_milestone": "Deploy a production-style application with automated GitHub Actions CI/CD and public live demo.",
                "completion_criteria": ["Dockerized services with multi-stage build", "Automated test workflow on pull request", "SSL-enabled live production URL"]
            },
            {
                "phase_number": 6,
                "title": "Placement Preparation & DSA",
                "description": "Data structures and algorithms, time/space complexity, problem-solving patterns, system design fundamentals, and mock interviews.",
                "why_it_matters": "Top-tier campus recruitment rounds heavily screen on DSA efficiency, core CS subjects, and technical articulation.",
                "estimated_duration_weeks": 4,
                "skills_covered": ["Arrays & Hashing", "Two Pointers & Sliding Window", "Trees & Graphs", "Dynamic Programming Basics", "System Design Revision", "Mock Technical Interviews"],
                "practical_milestone": "Complete 75 curated DSA problems and conduct two recorded peer mock interviews.",
                "completion_criteria": ["Strong grasp of time and space complexity", "Ability to explain technical project trade-offs under timed conditions", "Polished GitHub and ATS resume"]
            }
        ]
    },
    {
        "id": "track_uiux",
        "title": "UI/UX Designer",
        "category": "Design",
        "level": "Beginner-friendly",
        "estimated_duration_range": "3-5 Months",
        "description": "Build an exceptional product design portfolio covering visual hierarchy, design tokens, Figma auto-layout, user research, wireframing, and case studies.",
        "core_skills": ["Figma", "Visual Hierarchy", "Typography & Color", "User Research", "Wireframing", "Interactive Prototyping", "Design Systems", "Usability Testing"],
        "prerequisites": ["Empathy for users", "Attention to visual detail"],
        "typical_project_outcomes": ["E-Commerce Redesign Case Study", "Mobile FinTech Flow", "Design System Kit", "End-to-End Usability Report"],
        "template_phases": [
            {
                "phase_number": 1,
                "title": "Design Fundamentals & Visual Hierarchy",
                "description": "Color theory, typography contrast, grid systems, alignment, spacing scales, and WCAG accessibility guidelines.",
                "why_it_matters": "A solid foundation in visual aesthetics and accessibility ensures interfaces are intuitive and universally usable.",
                "estimated_duration_weeks": 3,
                "skills_covered": ["Typography Scale", "Contrast & Color", "Grid Systems", "WCAG 2.1 AA", "Visual Hierarchy"],
                "practical_milestone": "Redesign an existing cluttered web interface and write a comprehensive visual design rationale.",
                "completion_criteria": ["Documented color and typography choices", "Strict 8pt grid alignment", "Passed WCAG contrast checks"]
            },
            {
                "phase_number": 2,
                "title": "User Research & Problem Definition",
                "description": "User interviews, surveys, persona creation, competitor benchmarking, journey mapping, and research synthesis.",
                "why_it_matters": "Designers must solve verified human problems rather than jumping straight to visual embellishments.",
                "estimated_duration_weeks": 3,
                "skills_covered": ["Qualitative Interviews", "User Personas", "Journey Mapping", "Competitor Audit", "Problem Statements"],
                "practical_milestone": "Create a structured user research report diagnosing real friction in a campus service.",
                "completion_criteria": ["At least 5 user interviews conducted", "Synthesized empathy map and persona", "Clear 'How Might We' problem statement"]
            },
            {
                "phase_number": 3,
                "title": "Information Architecture & Wireframing",
                "description": "Card sorting, sitemaps, user flow diagrams, low-fidelity wireframing, and early clickable usability testing.",
                "why_it_matters": "Architecture dictates how effortlessly users navigate complex applications before visual styling begins.",
                "estimated_duration_weeks": 3,
                "skills_covered": ["Information Architecture", "User Flows", "Low-Fidelity Wireframes", "Lo-Fi Prototyping", "Rapid Testing"],
                "practical_milestone": "Produce an end-to-end clickable wireframe flow tested with at least 3 users.",
                "completion_criteria": ["Documented user flow diagram", "Clean wireframe screens with annotated states", "Usability test notes and iteration log"]
            },
            {
                "phase_number": 4,
                "title": "Figma Mastery & Design Systems",
                "description": "Auto Layout, component variants, interactive states, design tokens, responsive breakpoints, and developer handoff specs.",
                "why_it_matters": "Industry design teams work in synchronized Figma systems; mastering components and tokens makes you production-ready.",
                "estimated_duration_weeks": 4,
                "skills_covered": ["Figma Auto Layout 5.0", "Component Variants", "Design Tokens", "Micro-Interactions", "Dev Handoff"],
                "practical_milestone": "Build a modular design system and responsive high-fidelity prototype with dynamic variables.",
                "completion_criteria": ["Zero static frame hacks; 100% auto-layout", "Clean nested variants with boolean toggles", "Interactive clickable prototype"]
            },
            {
                "phase_number": 5,
                "title": "Product Thinking & Usability Metrics",
                "description": "Balancing business goals with user needs, SUS (System Usability Scale) scoring, product analytics, and feature prioritization.",
                "why_it_matters": "Senior product managers hire designers who understand conversion funnels, retention, and business value.",
                "estimated_duration_weeks": 3,
                "skills_covered": ["SUS Usability Scoring", "A/B Testing Concepts", "Product Trade-offs", "Stakeholder Presentation"],
                "practical_milestone": "Iterate on an existing product flow using quantitative feedback and recorded user usability sessions.",
                "completion_criteria": ["Benchmark SUS score calculation", "Documented design iterations backed by user friction points"]
            },
            {
                "phase_number": 6,
                "title": "Design Portfolio & Placement Preparation",
                "description": "Case study storytelling, problem-to-solution narrative, portfolio website creation, whiteboard challenges, and design critiques.",
                "why_it_matters": "Design hiring is 90% portfolio-based; clean storytelling showing your decision-making process wins offers.",
                "estimated_duration_weeks": 4,
                "skills_covered": ["Case Study Writing", "Portfolio Presentation", "Whiteboard Design Exercises", "Critique Defense"],
                "practical_milestone": "Publish two in-depth case studies on a live personal portfolio domain.",
                "completion_criteria": ["Complete problem-to-outcome narrative", "Before-and-after metrics and user quotes", "Interactive prototype links embedded"]
            }
        ]
    },
    {
        "id": "track_aiml",
        "title": "AI/ML Engineer",
        "category": "Data & AI",
        "level": "Intermediate",
        "estimated_duration_range": "4-6 Months",
        "description": "Rigorous trajectory from Python and linear algebra through statistical machine learning, deep learning with PyTorch, LLMs/RAG, and production model serving.",
        "core_skills": ["Python", "NumPy & Pandas", "Scikit-Learn", "PyTorch", "Data Preprocessing", "Evaluation Metrics", "LLMs & RAG", "FastAPI Serving", "Docker"],
        "prerequisites": ["Python basics", "Calculus and linear algebra fundamentals"],
        "typical_project_outcomes": ["Predictive Churn Model", "Computer Vision Defect Classifier", "RAG Knowledge Base Bot", "Model Serving API with Docker"],
        "template_phases": [
            {
                "phase_number": 1,
                "title": "Mathematical Foundations & Scientific Python",
                "description": "Vectorized computations with NumPy, data wrangling with Pandas, linear algebra (matrices, eigenvalues), probability, and statistics.",
                "why_it_matters": "Every ML algorithm relies on gradient descent, matrix multiplication, and probability distributions.",
                "estimated_duration_weeks": 3,
                "skills_covered": ["NumPy", "Pandas", "Linear Algebra", "Descriptive & Inferential Stats", "Vectorization"],
                "practical_milestone": "Clean and analyze a real-world messy dataset with documented statistical insights.",
                "completion_criteria": ["Handling missing data without leakage", "Vectorized transformations without slow Python loops", "Reproducible Jupyter notebook"]
            },
            {
                "phase_number": 2,
                "title": "Exploratory Data Analysis & Visualization",
                "description": "Statistical visualization with Matplotlib and Seaborn, hypothesis testing, outlier detection, and correlation analysis.",
                "why_it_matters": "Garbage in, garbage out: data exploration reveals biases, skewness, and multi-collinearity before model training.",
                "estimated_duration_weeks": 3,
                "skills_covered": ["Matplotlib & Seaborn", "Feature Correlation", "Hypothesis Testing", "Data Leakage Prevention"],
                "practical_milestone": "Deliver an exploratory data report highlighting predictive features for a benchmark problem.",
                "completion_criteria": ["Clear distribution plots and outlier treatment", "Identification of data drift and target leakage"]
            },
            {
                "phase_number": 3,
                "title": "Supervised & Unsupervised Machine Learning",
                "description": "Regression, classification, decision trees, random forests, XGBoost, clustering, cross-validation, and ROC-AUC metrics.",
                "why_it_matters": "Tabular and structured data in 80% of companies is powered by gradient boosted trees and regularized regression.",
                "estimated_duration_weeks": 4,
                "skills_covered": ["Scikit-learn Pipelines", "Ensemble Methods (XGBoost)", "Cross-Validation", "Hyperparameter Tuning", "Precision/Recall/F1"],
                "practical_milestone": "Train, benchmark, and explain three competing ML models on an industry dataset.",
                "completion_criteria": ["K-fold stratified cross-validation", "Evaluation across precision, recall, and ROC-AUC", "SHAP or feature importance analysis"]
            },
            {
                "phase_number": 4,
                "title": "Deep Learning Fundamentals with PyTorch",
                "description": "Feedforward neural networks, backpropagation calculus, activation functions, loss functions, optimization (Adam), and PyTorch tensors.",
                "why_it_matters": "Understanding tensors and gradient graphs is non-negotiable for modern computer vision, NLP, and modern AI roles.",
                "estimated_duration_weeks": 4,
                "skills_covered": ["PyTorch", "Backpropagation", "Loss Functions", "Regularization (Dropout, BatchNorm)", "CNNs or RNNs"],
                "practical_milestone": "Build, train, and evaluate a neural network from scratch using PyTorch.",
                "completion_criteria": ["Training loss and validation convergence graphs", "Avoidance of overfitting through regularization", "Model weight checkpointing"]
            },
            {
                "phase_number": 5,
                "title": "Applied AI, LLMs, and RAG Architectures",
                "description": "Embeddings, vector databases (Chroma/Pinecone), Retrieval-Augmented Generation (RAG), prompt engineering, and responsible AI guardrails.",
                "why_it_matters": "Generative AI and enterprise search are the highest-growth hiring sectors in tech today.",
                "estimated_duration_weeks": 4,
                "skills_covered": ["LLM APIs", "Embeddings & Vector Indexing", "RAG Pipelines", "Semantic Search", "Guardrails & Hallucination Mitigation"],
                "practical_milestone": "Build an enterprise document-grounded Q&A assistant using semantic search and local vector storage.",
                "completion_criteria": ["Accurate context retrieval without hallucination", "Response latency under 2 seconds", "Evaluation dataset with ground-truth citations"]
            },
            {
                "phase_number": 6,
                "title": "Model Serving, MLOps & Placement Prep",
                "description": "FastAPI model serving, Docker packaging, model monitoring, ML system design interviews, and DSA revision.",
                "why_it_matters": "Recruiters seek AI engineers who can transition models out of research notebooks into reliable microservices.",
                "estimated_duration_weeks": 4,
                "skills_covered": ["FastAPI Serving", "Docker for ML", "Inference Latency Optimization", "ML System Design", "Coding Rounds"],
                "practical_milestone": "Deploy a containerized model inference API with documentation and automated health checks.",
                "completion_criteria": ["Sub-100ms inference endpoint", "Docker image under 1GB with dependencies pinned", "Documented ML system design diagram"]
            }
        ]
    },
    {
        "id": "track_data_analyst",
        "title": "Data Analyst",
        "category": "Data & AI",
        "level": "Beginner-friendly",
        "estimated_duration_range": "2-4 Months",
        "description": "Transform raw numbers into strategic business insights using advanced SQL queries, Power BI / Tableau dashboards, and automated Python analytics.",
        "core_skills": ["Advanced SQL", "Power BI / Tableau", "Excel / Sheets Modeling", "Python (Pandas)", "Business Metrics (CAC, LTV)", "Data Storytelling"],
        "prerequisites": ["Curiosity for metrics", "Logical thinking"],
        "typical_project_outcomes": ["Executive Sales BI Dashboard", "Customer Retention SQL Cohort Analysis", "Marketing Funnel Attribution Report"],
        "template_phases": [
            { "phase_number": 1, "title": "Advanced SQL & Database Extraction", "description": "Complex joins, window functions (ROW_NUMBER, RANK, LAG/LEAD), subqueries, and CTEs.", "why_it_matters": "SQL is the universal language for pulling business data from enterprise warehouses.", "estimated_duration_weeks": 3, "skills_covered": ["SQL Joins", "Window Functions", "CTEs", "Aggregations"], "practical_milestone": "Write analytical SQL scripts solving 20 complex business queries.", "completion_criteria": ["Optimized window functions", "Zero Cartesian joins"] },
            { "phase_number": 2, "title": "Data Cleansing & Python for Analytics", "description": "Pandas for data wrangling, cleaning missing records, merging datasets, and automated reporting.", "why_it_matters": "Automating manual spreadsheets in Python saves hundreds of corporate hours.", "estimated_duration_weeks": 3, "skills_covered": ["Pandas", "Data Wrangling", "Data Formatting", "Jupyter"], "practical_milestone": "Build an automated data cleansing script for raw transaction logs.", "completion_criteria": ["Automated anomaly detection", "Export ready for BI ingestion"] },
            { "phase_number": 3, "title": "Business Intelligence & Interactive Dashboards", "description": "Data modeling in Power BI or Tableau, DAX calculations, interactive drill-downs, and UX design for executives.", "why_it_matters": "Decision-makers consume insights through visual dashboards, not raw spreadsheets.", "estimated_duration_weeks": 3, "skills_covered": ["Power BI / Tableau", "DAX Measures", "Star Schema Modeling", "Dashboard UX"], "practical_milestone": "Deliver a 3-page interactive BI dashboard with KPIs and dynamic filters.", "completion_criteria": ["Star schema data model", "Dynamic time-intelligence measures"] },
            { "phase_number": 4, "title": "Business Acumen & Storytelling with Data", "description": "Cohort analysis, customer lifetime value (LTV), churn rates, A/B testing interpretation, and executive slide presentations.", "why_it_matters": "The best analysts don't just find numbers; they influence business strategy with clear narrative.", "estimated_duration_weeks": 3, "skills_covered": ["Cohort Retention", "LTV/CAC Metrics", "Executive Presentation", "A/B Testing"], "practical_milestone": "Present an end-to-end analytical case study recommending operational improvements.", "completion_criteria": ["Clear business recommendations", "Quantified financial impact"] }
        ]
    },
    {
        "id": "track_data_scientist",
        "title": "Data Scientist",
        "category": "Data & AI",
        "level": "Intermediate",
        "estimated_duration_range": "4-6 Months",
        "description": "Blend advanced statistics, machine learning algorithms, causal inference, and experimental design to extract predictive intelligence.",
        "core_skills": ["Python & R", "Inferential Statistics", "Machine Learning", "A/B Testing & Causal Inference", "Feature Engineering", "Data Storytelling"],
        "prerequisites": ["Multivariable calculus", "Python programming"],
        "typical_project_outcomes": ["Predictive Customer Churn Engine", "Causal Impact Experiment", "NLP Sentiment & Classification Pipeline"],
        "template_phases": [
            { "phase_number": 1, "title": "Probability & Experimental Design", "description": "Hypothesis testing, p-values, power analysis, sample sizing, and A/B test methodologies.", "why_it_matters": "Data science drives product decisions through rigorous experimental verification.", "estimated_duration_weeks": 3, "skills_covered": ["Hypothesis Testing", "Power Analysis", "Bayesian vs Frequentist", "A/B Testing"], "practical_milestone": "Design an A/B test simulation with power calculation and variance reduction.", "completion_criteria": ["Sample size justified", "Correct statistical test selected"] },
            { "phase_number": 2, "title": "Machine Learning & Feature Engineering", "description": "Advanced regression, classification, dimensionality reduction (PCA, t-SNE), and automated feature engineering.", "why_it_matters": "Crafting domain-relevant features is the biggest predictor of competitive model accuracy.", "estimated_duration_weeks": 4, "skills_covered": ["Feature Engineering", "Tree Ensembles", "Dimensionality Reduction", "Model Explainability"], "practical_milestone": "Build an end-to-end predictive pipeline with cross-validation and feature importance.", "completion_criteria": ["Leakage-free preprocessing pipeline", "SHAP explanation plots"] },
            { "phase_number": 3, "title": "NLP and Unstructured Data Analysis", "description": "Text vectorization, TF-IDF, tokenization, transformer embeddings, and clustering of customer feedback.", "why_it_matters": "Unstructured text accounts for over 80% of enterprise information.", "estimated_duration_weeks": 4, "skills_covered": ["NLP", "Transformers", "Topic Modeling", "Text Classification"], "practical_milestone": "Classify and extract key sentiment topics from thousands of real reviews.", "completion_criteria": ["Robust F1 score", "Visualized topic clusters"] }
        ]
    },
    {
        "id": "track_backend",
        "title": "Backend Developer",
        "category": "Engineering",
        "level": "Intermediate",
        "estimated_duration_range": "3-5 Months",
        "description": "Architect resilient server-side applications, high-throughput REST/gRPC APIs, relational data systems, caching layers, and microservices.",
        "core_skills": ["Node.js / Go / Java", "Express / FastAPI", "PostgreSQL", "Redis Caching", "Kafka / RabbitMQ", "Docker", "System Design"],
        "prerequisites": ["Basic programming in Python or JavaScript"],
        "typical_project_outcomes": ["High-Concurrency Rate Limiter", "Distributed URL Shortener", "Microservice E-Commerce Engine"],
        "template_phases": [
            { "phase_number": 1, "title": "Server Fundamentals & Concurrent Architecture", "description": "Event loops, multithreading vs async I/O, memory management, and HTTP/HTTPS network protocols.", "why_it_matters": "Backend reliability hinges on understanding concurrency, network latency, and memory safety.", "estimated_duration_weeks": 3, "skills_covered": ["Async I/O", "HTTP/2 Protocols", "Streams & Buffers", "RESTful Principles"], "practical_milestone": "Build a modular server with custom routing, middleware chain, and logging.", "completion_criteria": ["Zero unhandled promise rejections", "Structured JSON logging"] },
            { "phase_number": 2, "title": "Databases, Indexing & Query Optimization", "description": "PostgreSQL transaction isolation levels, B-tree indexes, query explain plans, and connection pooling.", "why_it_matters": "Database bottlenecks cause 90% of backend downtime; query tuning is a top interview topic.", "estimated_duration_weeks": 4, "skills_covered": ["PostgreSQL", "EXPLAIN ANALYZE", "ACID Transactions", "Connection Pooling"], "practical_milestone": "Benchmark and optimize slow database queries on a 1-million-row dataset.", "completion_criteria": ["Reduced query execution time by 80%", "Documented index strategies"] },
            { "phase_number": 3, "title": "Caching, Queues & Distributed Systems", "description": "Redis cache-aside patterns, eviction policies, message queues with RabbitMQ/Kafka, and idempotency.", "why_it_matters": "Decoupling services through asynchronous queues guarantees system resilience under peak loads.", "estimated_duration_weeks": 4, "skills_covered": ["Redis", "Message Queues", "Idempotent APIs", "Rate Limiting"], "practical_milestone": "Implement a distributed background job processing queue with Redis and retry logic.", "completion_criteria": ["Exponential backoff retry mechanism", "Dead-letter queue handling"] }
        ]
    },
    {
        "id": "track_frontend",
        "title": "Frontend Developer",
        "category": "Engineering",
        "level": "Beginner-friendly",
        "estimated_duration_range": "3-5 Months",
        "description": "Master modern client-side engineering with React 19, TypeScript, state management, web performance optimization, and accessibility standards.",
        "core_skills": ["Modern JavaScript & TypeScript", "React 19", "Next.js", "Tailwind CSS", "Web Performance (Core Web Vitals)", "Testing (Vitest/Playwright)"],
        "prerequisites": ["HTML/CSS basics"],
        "typical_project_outcomes": ["Complex Data Grid Component", "Interactive Kanban Board", "Headless CMS E-Commerce Store"],
        "template_phases": [
            { "phase_number": 1, "title": "Advanced JavaScript & TypeScript", "description": "Closures, prototypes, generics, utility types, DOM events, and strict TypeScript types.", "why_it_matters": "TypeScript is mandatory across modern enterprise engineering codebases.", "estimated_duration_weeks": 3, "skills_covered": ["TypeScript Generics", "ESNext Features", "Event Delegation", "Module Bundling"], "practical_milestone": "Build a fully type-safe stateful utility library with unit tests.", "completion_criteria": ["Zero 'any' types", "100% test coverage on edge cases"] },
            { "phase_number": 2, "title": "React Architecture & Performance", "description": "Virtual DOM reconciliation, custom hooks, memoization (useMemo/useCallback), and state management.", "why_it_matters": "Writing fluid 60fps React applications requires deep knowledge of rendering lifecycles.", "estimated_duration_weeks": 4, "skills_covered": ["React 19 Hooks", "Custom Hooks", "Zustand/Context", "Performance Profiling"], "practical_milestone": "Build an interactive dashboard with smooth drag-and-drop and real-time filtering.", "completion_criteria": ["Zero unnecessary component re-renders", "Sub-16ms frame budget maintained"] },
            { "phase_number": 3, "title": "Core Web Vitals, a11y & Testing", "description": "LCP/INP/CLS metrics, ARIA roles, screen-reader accessibility, and component testing with Vitest.", "why_it_matters": "Frontend interviews at Tier-1 companies test accessibility, bundle splitting, and Web Vitals.", "estimated_duration_weeks": 3, "skills_covered": ["Core Web Vitals", "WCAG 2.1 AA", "Vitest & React Testing Library", "Code Splitting"], "practical_milestone": "Audit, refactor, and achieve 95+ Lighthouse score on a complex React web application.", "completion_criteria": ["Lighthouse score >= 95", "Full keyboard navigation without traps"] }
        ]
    },
    {
        "id": "track_devops",
        "title": "DevOps / Cloud Engineer",
        "category": "Cloud & Security",
        "level": "Intermediate",
        "estimated_duration_range": "3-5 Months",
        "description": "Automate infrastructure, scale microservices with Docker and Kubernetes, configure cloud environments (AWS), and manage CI/CD pipelines.",
        "core_skills": ["Linux & Bash Scripting", "Docker", "Kubernetes", "AWS Fundamentals", "Terraform", "GitHub Actions CI/CD", "Prometheus & Grafana"],
        "prerequisites": ["Basic command-line familiarity", "Networking fundamentals"],
        "typical_project_outcomes": ["Automated Multi-Environment CI/CD Pipeline", "Kubernetes Cluster with Ingress & TLS", "Terraform AWS Infrastructure as Code"],
        "template_phases": [
            { "phase_number": 1, "title": "Linux Systems & Containerization", "description": "Linux system administration, permissions, networking (DNS, routing, ports), and Docker multi-stage builds.", "why_it_matters": "Linux and containers power cloud computing; understanding container isolation is essential.", "estimated_duration_weeks": 3, "skills_covered": ["Linux Administration", "Bash Scripting", "Docker Multi-Stage", "Networking Protocols"], "practical_milestone": "Containerize a multi-service web app with minimal image sizes and non-root users.", "completion_criteria": ["Production image size < 150MB", "Clean compose setup with healthchecks"] },
            { "phase_number": 2, "title": "CI/CD Automation & Infrastructure as Code", "description": "GitHub Actions pipelines, automated testing, semantic versioning, and declarative infrastructure with Terraform.", "why_it_matters": "IaC eliminates manual configuration drift and enables automated team deployments.", "estimated_duration_weeks": 4, "skills_covered": ["GitHub Actions", "Terraform", "Environment Secrets", "Automated Rollbacks"], "practical_milestone": "Provision cloud resources using Terraform and deploy code via automated CI/CD.", "completion_criteria": ["Zero manual cloud clicks; 100% Terraform state", "Pipeline runs tests, lints, and deploys"] },
            { "phase_number": 3, "title": "Kubernetes Orchestration & Observability", "description": "Deployments, Services, ConfigMaps, Ingress controllers, Helm charts, and metrics with Prometheus and Grafana.", "why_it_matters": "Kubernetes is the industry standard for resilient microservice orchestration.", "estimated_duration_weeks": 4, "skills_covered": ["Kubernetes", "Helm", "Prometheus", "Grafana", "Log Aggregation"], "practical_milestone": "Deploy an autoscaling web service with live Grafana dashboards and alerts.", "completion_criteria": ["Horizontal Pod Autoscaling verified under load", "Alerts triggered on simulated 500 errors"] }
        ]
    },
    {
        "id": "track_cybersecurity",
        "title": "Cybersecurity Analyst",
        "category": "Cloud & Security",
        "level": "Intermediate",
        "estimated_duration_range": "3-5 Months",
        "description": "Protect critical digital infrastructure by mastering network security, vulnerability assessments, OWASP top 10 web exploits, and incident response.",
        "core_skills": ["Network Security (Wireshark)", "Linux Hardening", "OWASP Top 10", "Vulnerability Scanning (Nmap)", "SIEM & Log Analysis", "Cryptography Basics"],
        "prerequisites": ["Networking basics (TCP/IP)", "Basic scripting"],
        "typical_project_outcomes": ["Vulnerability Assessment & Penetration Report", "SIEM Log Detection Ruleset", "Hardened Linux Server Blueprint"],
        "template_phases": [
            { "phase_number": 1, "title": "Networking Protocols & Traffic Analysis", "description": "TCP/IP handshake, OSI model, packet capture with Wireshark, DNS/DHCP inspection, and port scanning with Nmap.", "why_it_matters": "Detecting intrusions requires recognizing anomalous packet flows and unencrypted sensitive data.", "estimated_duration_weeks": 3, "skills_covered": ["TCP/IP & OSI", "Wireshark Packet Analysis", "Nmap Scanning", "Firewall Rules"], "practical_milestone": "Capture and analyze malicious network traffic traces to isolate suspicious IPs.", "completion_criteria": ["Identified protocol anomaly", "Documented remediation firewall rule"] },
            { "phase_number": 2, "title": "Web Application Security & OWASP Top 10", "description": "SQL injection, Cross-Site Scripting (XSS), CSRF, authentication bypass, and secure API header configurations.", "why_it_matters": "Web attacks account for the vast majority of campus and enterprise security breaches.", "estimated_duration_weeks": 4, "skills_covered": ["OWASP Top 10", "SQL Injection Prevention", "XSS Defense", "Burp Suite Basics", "Security Headers"], "practical_milestone": "Audit a vulnerable web application, exploit vulnerabilities responsibly, and patch the source code.", "completion_criteria": ["Detailed pentest vulnerability report", "Verified source code patches eliminating vulnerabilities"] },
            { "phase_number": 3, "title": "SIEM, Incident Response & Placement Prep", "description": "Log analysis, threat detection rules, incident handling lifecycles, security certifications (CompTIA Security+), and placement interviews.", "why_it_matters": "Security operations centers (SOC) hire analysts who can triage alerts rapidly and follow incident playbooks.", "estimated_duration_weeks": 4, "skills_covered": ["SIEM Triage", "Log Correlation", "Incident Response Playbooks", "Security+ Exam Prep"], "practical_milestone": "Configure a SIEM dashboard to flag automated brute-force login attempts.", "completion_criteria": ["Automated alert rule configured", "Incident report following NIST guidelines"] }
        ]
    },
    {
        "id": "track_qa",
        "title": "QA / Automation Engineer",
        "category": "Quality",
        "level": "Beginner-friendly",
        "estimated_duration_range": "2-4 Months",
        "description": "Ensure high-quality software releases using automated browser testing with Playwright/Cypress, REST API testing, and performance benchmarking.",
        "core_skills": ["Manual Testing & Test Plans", "Playwright / Cypress", "Postman / REST Assured", "CI/CD Test Suites", "Performance Testing (k6)", "Defect Tracking"],
        "prerequisites": ["Basic JavaScript or Python"],
        "typical_project_outcomes": ["End-to-End Automated Test Suite", "API Contract Validation Pipeline", "Load & Stress Test Benchmark Report"],
        "template_phases": [
            { "phase_number": 1, "title": "Testing Methodologies & Test Case Design", "description": "Boundary value analysis, equivalence partitioning, test plan authoring, regression matrices, and defect lifecycles.", "why_it_matters": "Automating flawed test cases yields zero value; strong test architecture starts with systematic design.", "estimated_duration_weeks": 3, "skills_covered": ["Test Case Design", "Boundary Value Analysis", "Defect Reporting", "Agile QA Workflows"], "practical_milestone": "Write an end-to-end test strategy document and 30 test cases for a checkout flow.", "completion_criteria": ["Covered happy and edge cases", "Clear severity/priority classifications"] },
            { "phase_number": 2, "title": "E2E Browser Automation with Playwright", "description": "Page Object Model (POM), locator strategies, asynchronous assertions, cross-browser test suites, and parallel execution.", "why_it_matters": "Modern engineering teams run automated E2E tests before every production deployment.", "estimated_duration_weeks": 4, "skills_covered": ["Playwright / Cypress", "Page Object Model", "Visual Regression", "Parallel Execution"], "practical_milestone": "Develop a comprehensive automated test suite for an authenticated web portal.", "completion_criteria": ["Robust POM architecture without brittle sleeps", "Passed in headless mode on Chrome, Firefox, and Safari"] },
            { "phase_number": 3, "title": "API Testing, Performance & CI/CD", "description": "REST API contract testing, schema validation, performance testing with k6/JMeter, and GitHub Actions test workflows.", "why_it_matters": "API tests are 10x faster and cheaper to run than browser tests in CI/CD pipelines.", "estimated_duration_weeks": 3, "skills_covered": ["API Test Automation", "k6 Load Testing", "CI/CD Test Reporting", "Mock Servers"], "practical_milestone": "Set up a GitHub Actions workflow executing API and load tests on pull requests.", "completion_criteria": ["Automated test report artifact generated", "Load test identified latency degradation point"] }
        ]
    }
]

CURATED_RESOURCES_CATALOG = [
    {
        "id": "res_mdn_web",
        "title": "MDN Web Docs — Modern Web Technology",
        "description": "The definitive, open-source reference documentation for HTML5, CSS3, JavaScript standards, and Web APIs maintained by Mozilla.",
        "resource_type": "Documentation",
        "provider": "Mozilla Developer Network",
        "url": "https://developer.mozilla.org/en-US/",
        "career_tracks": ["track_fullstack", "track_frontend", "track_uiux"],
        "skills": ["HTML5", "CSS3", "JavaScript", "DOM Manipulation"],
        "difficulty": "Beginner",
        "language": "English",
        "price_status": "Free",
        "estimated_duration": "Reference / Continuous",
        "tags": ["Official", "Standard", "Web", "Comprehensive"],
        "verification_status": "Verified Official"
    },
    {
        "id": "res_fcc_fullstack",
        "title": "freeCodeCamp Responsive Web & JavaScript Certification",
        "description": "Interactive coding curriculum with real-world browser-based challenges covering HTML, CSS, JavaScript algorithms, and projects.",
        "resource_type": "Course",
        "provider": "freeCodeCamp",
        "url": "https://www.freecodecamp.org/learn",
        "career_tracks": ["track_fullstack", "track_frontend"],
        "skills": ["HTML5", "CSS3 / Flexbox / Grid", "JavaScript Async", "Algorithms"],
        "difficulty": "Beginner",
        "language": "English",
        "price_status": "Free",
        "estimated_duration": "300 Hours",
        "tags": ["Interactive", "Certificate", "Hands-on", "Free"],
        "verification_status": "Verified Platform"
    },
    {
        "id": "res_react_official",
        "title": "React.dev — The Official React Documentation",
        "description": "Official interactive documentation for React 19, emphasizing modern hooks, component lifecycle, rendering patterns, and thinking in React.",
        "resource_type": "Documentation",
        "provider": "React Core Team",
        "url": "https://react.dev",
        "career_tracks": ["track_fullstack", "track_frontend"],
        "skills": ["React 19", "Hooks & State", "Client Routing", "Component Architecture"],
        "difficulty": "Intermediate",
        "language": "English",
        "price_status": "Free",
        "estimated_duration": "20 Hours",
        "tags": ["Official", "React 19", "Modern", "Interactive"],
        "verification_status": "Verified Official"
    },
    {
        "id": "res_nodejs_guide",
        "title": "Node.js Official Developer Guides",
        "description": "Official guides on the Node.js event loop, asynchronous I/O, streams, buffers, file systems, and production security best practices.",
        "resource_type": "Documentation",
        "provider": "OpenJS Foundation",
        "url": "https://nodejs.org/en/learn",
        "career_tracks": ["track_fullstack", "track_backend"],
        "skills": ["Node.js", "Express", "RESTful Architecture", "Async I/O"],
        "difficulty": "Intermediate",
        "language": "English",
        "price_status": "Free",
        "estimated_duration": "15 Hours",
        "tags": ["Official", "Backend", "Event Loop", "Security"],
        "verification_status": "Verified Official"
    },
    {
        "id": "res_postgres_tutorial",
        "title": "PostgreSQL Official Tutorial and Documentation",
        "description": "Comprehensive reference covering SQL queries, relational joins, indexes, ACID transactions, and EXPLAIN query plan optimization.",
        "resource_type": "Documentation",
        "provider": "PostgreSQL Global Development Group",
        "url": "https://www.postgresql.org/docs/",
        "career_tracks": ["track_fullstack", "track_backend", "track_data_analyst"],
        "skills": ["PostgreSQL", "SQL & Joins", "Data Modeling", "Indexing"],
        "difficulty": "Intermediate",
        "language": "English",
        "price_status": "Free",
        "estimated_duration": "25 Hours",
        "tags": ["Relational DB", "SQL", "ACID", "Official"],
        "verification_status": "Verified Official"
    },
    {
        "id": "res_figma_learn",
        "title": "Figma Help Center & Design System Tutorials",
        "description": "Official tutorials from Figma covering Auto Layout, component variants, interactive prototyping, variables, and design tokens.",
        "resource_type": "Tutorial",
        "provider": "Figma",
        "url": "https://help.figma.com/hc/en-us",
        "career_tracks": ["track_uiux", "track_frontend"],
        "skills": ["Figma", "Design Systems", "Auto Layout", "Interactive Prototyping"],
        "difficulty": "Beginner",
        "language": "English",
        "price_status": "Free",
        "estimated_duration": "15 Hours",
        "tags": ["Design", "Figma", "Auto Layout", "Official"],
        "verification_status": "Verified Official"
    },
    {
        "id": "res_nngroup_ux",
        "title": "Nielsen Norman Group — UX Research Articles",
        "description": "The gold-standard research articles on usability heuristics, user interview methodologies, information architecture, and accessibility.",
        "resource_type": "Article",
        "provider": "Nielsen Norman Group",
        "url": "https://www.nngroup.com/articles/",
        "career_tracks": ["track_uiux"],
        "skills": ["User Research", "Usability Testing", "Visual Hierarchy", "Information Architecture"],
        "difficulty": "Intermediate",
        "language": "English",
        "price_status": "Free",
        "estimated_duration": "Continuous",
        "tags": ["Heuristics", "Research", "Industry Benchmark"],
        "verification_status": "Verified Platform"
    },
    {
        "id": "res_scikit_learn",
        "title": "Scikit-Learn Machine Learning in Python",
        "description": "Clear algorithmic documentation and tutorials for classification, regression, clustering, model evaluation, and cross-validation pipelines.",
        "resource_type": "Documentation",
        "provider": "Inria / Scikit-Learn Consortium",
        "url": "https://scikit-learn.org/stable/user_guide.html",
        "career_tracks": ["track_aiml", "track_data_scientist"],
        "skills": ["Scikit-learn Pipelines", "Ensemble Methods", "Evaluation Metrics", "Cross-Validation"],
        "difficulty": "Intermediate",
        "language": "English",
        "price_status": "Free",
        "estimated_duration": "30 Hours",
        "tags": ["ML", "Python", "Algorithms", "Official"],
        "verification_status": "Verified Official"
    },
    {
        "id": "res_pytorch_tutorials",
        "title": "PyTorch Official Deep Learning Tutorials",
        "description": "Hands-on tutorials for tensors, autograd, building neural networks, dataset loaders, and training loops on GPUs.",
        "resource_type": "Tutorial",
        "provider": "Linux Foundation / PyTorch Team",
        "url": "https://pytorch.org/tutorials/",
        "career_tracks": ["track_aiml", "track_data_scientist"],
        "skills": ["PyTorch", "Backpropagation", "Loss Functions", "Deep Learning"],
        "difficulty": "Intermediate",
        "language": "English",
        "price_status": "Free",
        "estimated_duration": "40 Hours",
        "tags": ["Deep Learning", "Tensors", "PyTorch", "Official"],
        "verification_status": "Verified Official"
    },
    {
        "id": "res_docker_curriculum",
        "title": "Docker Getting Started Guide & Multi-Stage Builds",
        "description": "Practical guide to containerization, Dockerfiles, multi-stage optimization, Docker Compose, and container security.",
        "resource_type": "Documentation",
        "provider": "Docker Inc.",
        "url": "https://docs.docker.com/get-started/",
        "career_tracks": ["track_fullstack", "track_backend", "track_devops", "track_aiml"],
        "skills": ["Docker", "Containerization", "CI/CD", "DevOps"],
        "difficulty": "Beginner",
        "language": "English",
        "price_status": "Free",
        "estimated_duration": "10 Hours",
        "tags": ["DevOps", "Containers", "Docker", "Official"],
        "verification_status": "Verified Official"
    },
    {
        "id": "res_owasp_top10",
        "title": "OWASP Top 10 Web Application Security Risks",
        "description": "Standard awareness document for developers and security specialists outlining critical web vulnerabilities and secure coding practices.",
        "resource_type": "Documentation",
        "provider": "OWASP Foundation",
        "url": "https://owasp.org/www-project-top-ten/",
        "career_tracks": ["track_cybersecurity", "track_backend", "track_fullstack"],
        "skills": ["OWASP Top 10", "Web Security", "SQL Injection", "XSS Defense"],
        "difficulty": "Intermediate",
        "language": "English",
        "price_status": "Free",
        "estimated_duration": "8 Hours",
        "tags": ["Security", "OWASP", "Vulnerabilities", "Standard"],
        "verification_status": "Verified Official"
    },
    {
        "id": "res_playwright_docs",
        "title": "Playwright for Fast and Reliable End-to-End Testing",
        "description": "Modern E2E testing framework docs covering cross-browser automation, Page Object Models, trace viewer, and CI integration.",
        "resource_type": "Documentation",
        "provider": "Microsoft",
        "url": "https://playwright.dev",
        "career_tracks": ["track_qa", "track_frontend", "track_fullstack"],
        "skills": ["Playwright", "E2E Testing", "Page Object Model", "Automated QA"],
        "difficulty": "Beginner",
        "language": "English",
        "price_status": "Free",
        "estimated_duration": "12 Hours",
        "tags": ["QA", "Testing", "Automation", "Official"],
        "verification_status": "Verified Official"
    }
]

# ---------------------------------------------------------------------------
# API Routes
# ---------------------------------------------------------------------------

@router.get("/tracks")
def get_career_tracks(
    category: Optional[str] = None,
    level: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """
    Returns available career track templates with filtering by category, level, and search.
    """
    tracks = CAREER_TRACKS_CATALOG
    if category:
        tracks = [t for t in tracks if t["category"].lower() == category.lower()]
    if level:
        tracks = [t for t in tracks if level.lower() in t["level"].lower()]
    if search:
        s = search.lower()
        tracks = [
            t for t in tracks
            if s in t["title"].lower() or s in t["description"].lower() or any(s in sk.lower() for sk in t["core_skills"])
        ]
    return tracks

@router.get("/tracks/{track_id}")
def get_career_track_detail(track_id: str, db: Session = Depends(get_db)):
    """
    Retrieves full syllabus and phase breakdown for a specific career track.
    """
    track = next((t for t in CAREER_TRACKS_CATALOG if t["id"] == track_id), None)
    if not track:
        raise HTTPException(status_code=404, detail=f"Career track '{track_id}' not found.")
    return track

@router.get("/resources")
def get_learning_resources(
    track_id: Optional[str] = None,
    skill: Optional[str] = None,
    resource_type: Optional[str] = None,
    difficulty: Optional[str] = None,
    price_status: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """
    Search and filter curated learning resources with extensible model.
    """
    results = CURATED_RESOURCES_CATALOG
    if track_id:
        results = [r for r in results if track_id in r["career_tracks"]]
    if skill:
        s_skill = skill.lower()
        results = [r for r in results if any(s_skill in sk.lower() for sk in r["skills"])]
    if resource_type:
        results = [r for r in results if r["resource_type"].lower() == resource_type.lower()]
    if difficulty:
        results = [r for r in results if r["difficulty"].lower() == difficulty.lower()]
    if price_status:
        results = [r for r in results if r["price_status"].lower() == price_status.lower()]
    if search:
        s = search.lower()
        results = [
            r for r in results
            if s in r["title"].lower() or s in r["description"].lower() or any(s in tag.lower() for tag in r["tags"])
        ]
    return results

@router.post("/resources")
def add_learning_resource(resource: ResourceCreateRequest, db: Session = Depends(get_db)):
    """
    Allows adding new validated resources to the learning library.
    """
    new_res = {
        "id": f"res_{uuid.uuid4().hex[:8]}",
        "title": resource.title,
        "description": resource.description,
        "resource_type": resource.resource_type,
        "provider": resource.provider,
        "url": resource.url,
        "career_tracks": resource.career_tracks,
        "skills": resource.skills,
        "difficulty": resource.difficulty,
        "language": resource.language,
        "price_status": resource.price_status,
        "estimated_duration": resource.estimated_duration or "Self-paced",
        "tags": resource.tags,
        "verification_status": resource.verification_status,
        "last_reviewed": datetime.datetime.utcnow().isoformat()
    }
    CURATED_RESOURCES_CATALOG.insert(0, new_res)
    return new_res

@router.get("/current")
def get_current_roadmap(
    db: Session = Depends(get_db),
    student: models.Student = Depends(get_current_student)
):
    """
    Fetches the active student's roadmap with phases, tasks, milestones, projects, and snapshots.
    """
    roadmap = (
        db.query(models.StudentRoadmap)
        .filter(models.StudentRoadmap.student_id == student.id)
        .order_by(models.StudentRoadmap.created_at.desc())
        .first()
    )
    if not roadmap:
        return {"has_roadmap": False, "roadmap": None}

    # Assemble complete payload
    phases_data = []
    total_tasks = 0
    completed_tasks = 0
    completed_hours = 0.0
    planned_hours = 0.0

    for phase in roadmap.phases:
        tasks_data = []
        for task in phase.tasks:
            total_tasks += 1
            planned_hours += (task.estimated_hours or 0.0)
            if task.status == "Completed":
                completed_tasks += 1
                completed_hours += (task.estimated_hours or 0.0)
            
            tasks_data.append({
                "id": task.id,
                "phase_id": task.phase_id,
                "roadmap_id": task.roadmap_id,
                "task_number": task.task_number,
                "week_number": task.week_number,
                "title": task.title,
                "description": task.description,
                "associated_skill": task.associated_skill,
                "learning_objective": task.learning_objective,
                "why_it_matters": task.why_it_matters,
                "estimated_hours": task.estimated_hours,
                "priority": task.priority,
                "prerequisites": task.prerequisites or [],
                "resource_ids": task.resource_ids or [],
                "practical_exercise": task.practical_exercise,
                "completion_criteria": task.completion_criteria,
                "status": task.status,
                "due_date": task.due_date,
                "completed_at": task.completed_at.isoformat() if task.completed_at else None,
                "notes": task.notes
            })

        phases_data.append({
            "id": phase.id,
            "roadmap_id": phase.roadmap_id,
            "phase_number": phase.phase_number,
            "title": phase.title,
            "description": phase.description,
            "why_it_matters": phase.why_it_matters,
            "learning_objectives": phase.learning_objectives or [],
            "skills_covered": phase.skills_covered or [],
            "prerequisites": phase.prerequisites or [],
            "estimated_duration_weeks": phase.estimated_duration_weeks,
            "practical_milestone": phase.practical_milestone,
            "completion_criteria": phase.completion_criteria or [],
            "status": phase.status,
            "tasks": tasks_data
        })

    projects_data = [
        {
            "id": p.id,
            "roadmap_id": p.roadmap_id,
            "title": p.title,
            "problem_statement": p.problem_statement,
            "expected_outcome": p.expected_outcome,
            "skills_practiced": p.skills_practiced or [],
            "prerequisite_tasks": p.prerequisite_tasks or [],
            "suggested_tech": p.suggested_tech or [],
            "feature_checklist": p.feature_checklist or [],
            "definition_of_done": p.definition_of_done,
            "expected_hours": p.expected_hours,
            "portfolio_relevance": p.portfolio_relevance,
            "github_url": p.github_url,
            "demo_url": p.demo_url,
            "status": p.status,
            "completed_at": p.completed_at.isoformat() if p.completed_at else None
        }
        for p in roadmap.projects
    ]

    milestones_data = [
        {
            "id": m.id,
            "roadmap_id": m.roadmap_id,
            "title": m.title,
            "target_date": m.target_date,
            "status": m.status,
            "associated_phase_or_project": m.associated_phase_or_project,
            "completed_at": m.completed_at.isoformat() if m.completed_at else None
        }
        for m in roadmap.milestones
    ]

    snapshots_data = [
        {
            "timestamp": s.timestamp.isoformat(),
            "completed_task_count": s.completed_task_count,
            "total_task_count": s.total_task_count,
            "completion_percentage": s.completion_percentage,
            "completed_hours": s.completed_hours,
            "planned_hours": s.planned_hours
        }
        for s in roadmap.snapshots
    ]

    completion_percentage = round((completed_tasks / total_tasks * 100), 1) if total_tasks > 0 else 0.0

    return {
        "has_roadmap": True,
        "roadmap": {
            "id": roadmap.id,
            "student_id": roadmap.student_id,
            "career_track_id": roadmap.career_track_id,
            "career_title": roadmap.career_title,
            "custom_goal": roadmap.custom_goal,
            "specialization": roadmap.specialization,
            "starting_proficiency": roadmap.starting_proficiency,
            "target_timeline_months": roadmap.target_timeline_months,
            "weekly_hours_available": roadmap.weekly_hours_available,
            "learning_style": roadmap.learning_style,
            "priority_focus": roadmap.priority_focus,
            "target_companies": roadmap.target_companies or [],
            "status": roadmap.status,
            "current_phase_index": roadmap.current_phase_index,
            "created_at": roadmap.created_at.isoformat() if roadmap.created_at else None,
            "updated_at": roadmap.updated_at.isoformat() if roadmap.updated_at else None,
            "metrics": {
                "total_tasks": total_tasks,
                "completed_tasks": completed_tasks,
                "completion_percentage": completion_percentage,
                "completed_hours": completed_hours,
                "planned_hours": planned_hours,
                "remaining_hours": max(0.0, planned_hours - completed_hours)
            },
            "phases": phases_data,
            "projects": projects_data,
            "milestones": milestones_data,
            "snapshots": snapshots_data
        }
    }

@router.post("/generate")
def generate_personalized_roadmap(
    req: RoadmapGenerateRequest,
    db: Session = Depends(get_db),
    student: models.Student = Depends(get_current_student)
):
    """
    Generates a personalized, structured learning roadmap for the student,
    taking into account starting level, timeline, weekly availability,
    and verified student profile skills to skip redundant topics.
    """
    # Resolve track template
    track = None
    if req.career_track_id:
        track = next((t for t in CAREER_TRACKS_CATALOG if t["id"] == req.career_track_id), None)
    
    career_title = track["title"] if track else (req.custom_goal or "Custom Software Engineering Track")

    # Deactivate existing roadmaps
    existing_roadmaps = db.query(models.StudentRoadmap).filter(models.StudentRoadmap.student_id == student.id).all()
    for er in existing_roadmaps:
        er.status = "Archived"

    roadmap_id = f"rdm_{uuid.uuid4().hex[:10]}"
    new_roadmap = models.StudentRoadmap(
        id=roadmap_id,
        student_id=student.id,
        career_track_id=req.career_track_id,
        career_title=career_title,
        custom_goal=req.custom_goal,
        specialization=req.specialization,
        starting_proficiency=req.starting_proficiency,
        target_timeline_months=req.target_timeline_months,
        weekly_hours_available=req.weekly_hours_available,
        learning_style=req.learning_style,
        priority_focus=req.priority_focus,
        target_companies=req.target_companies,
        status="Active",
        current_phase_index=0
    )
    db.add(new_roadmap)

    # Compile verified skills from student records
    verified_skill_names = {s.name.lower() for s in student.skills if s.verified}
    self_reported_skill_names = {s.name.lower() for s in student.skills if not s.verified}
    all_known_skills = verified_skill_names.union(self_reported_skill_names).union({s.lower() for s in req.already_known_skills})

    phases_source = track["template_phases"] if track else [
        {
            "phase_number": 1,
            "title": "Foundations & Prerequisites",
            "description": f"Core technical fundamentals and tooling required for {career_title}.",
            "why_it_matters": "Fundamental engineering knowledge ensures strong problem-solving under interview conditions.",
            "estimated_duration_weeks": 4,
            "skills_covered": ["Programming Fundamentals", "Tooling & Git", "Problem Solving"],
            "practical_milestone": "Build and document a fundamental project repository.",
            "completion_criteria": ["Working codebase", "Documented README"]
        },
        {
            "phase_number": 2,
            "title": "Core Domain Competencies",
            "description": f"Practical architecture, framework usage, and patterns in {career_title}.",
            "why_it_matters": "Demonstrating competency in modern patterns separates candidates from beginners.",
            "estimated_duration_weeks": 6,
            "skills_covered": ["Architecture Patterns", "Component Design", "API Integration"],
            "practical_milestone": "Develop an end-to-end domain project with live deployment.",
            "completion_criteria": ["Clean structure", "Responsive interface and error handling"]
        },
        {
            "phase_number": 3,
            "title": "Production Engineering & Placement Readiness",
            "description": "System design, testing, performance optimization, and mock placement interviews.",
            "why_it_matters": "Top campus recruiters demand system trade-off comprehension and behavioral polish.",
            "estimated_duration_weeks": 4,
            "skills_covered": ["System Design", "Testing & CI/CD", "Technical Mock Interviews"],
            "practical_milestone": "Polish your technical portfolio and complete mock interview evaluations.",
            "completion_criteria": ["Verified portfolio links", "Complete DSA revision"]
        }
    ]

    total_phases = len(phases_source)
    weeks_per_phase = max(2, int((req.target_timeline_months * 4.3) / total_phases))

    current_date = datetime.date.today()
    created_tasks = []

    for idx, p_src in enumerate(phases_source):
        phase_id = f"phs_{uuid.uuid4().hex[:10]}"
        phase_status = "In Progress" if idx == 0 else "Upcoming"

        phase_record = models.RoadmapPhase(
            id=phase_id,
            roadmap_id=roadmap_id,
            phase_number=p_src["phase_number"],
            title=p_src["title"],
            description=p_src["description"],
            why_it_matters=p_src["why_it_matters"],
            learning_objectives=[f"Master {sk} in real-world scenarios" for sk in p_src["skills_covered"]],
            skills_covered=p_src["skills_covered"],
            prerequisites=p_src.get("prerequisites", []),
            estimated_duration_weeks=weeks_per_phase,
            practical_milestone=p_src["practical_milestone"],
            completion_criteria=p_src["completion_criteria"],
            status=phase_status
        )
        db.add(phase_record)

        # Generate 3-4 granular tasks per phase sequenced logically
        skills_in_phase = p_src["skills_covered"]
        for t_idx, skill_name in enumerate(skills_in_phase):
            task_id = f"tsk_{uuid.uuid4().hex[:10]}"
            is_known = skill_name.lower() in all_known_skills
            task_status = "Completed" if (is_known and req.starting_proficiency in ["Intermediate", "Advanced"]) else ("Not Started")
            
            task_due = (current_date + datetime.timedelta(weeks=(idx * weeks_per_phase) + t_idx + 1)).isoformat()

            # Find matching curated resources
            matched_res = [
                r["id"] for r in CURATED_RESOURCES_CATALOG
                if any(skill_name.lower() in s.lower() for s in r["skills"])
            ]

            task_record = models.RoadmapTask(
                id=task_id,
                phase_id=phase_id,
                roadmap_id=roadmap_id,
                task_number=t_idx + 1,
                week_number=(idx * weeks_per_phase) + (t_idx % weeks_per_phase) + 1,
                title=f"Learn and apply {skill_name}",
                description=f"Deep-dive into {skill_name} architecture, standards, and practical implementation patterns.",
                associated_skill=skill_name,
                learning_objective=f"Build practical proficiency in {skill_name} meeting campus interview benchmarks.",
                why_it_matters=f"{skill_name} is frequently evaluated in technical interviews and core project code reviews.",
                estimated_hours=round(max(3.0, (req.weekly_hours_available / len(skills_in_phase))), 1),
                priority="High" if t_idx == 0 else "Medium",
                prerequisites=[skills_in_phase[t_idx - 1]] if t_idx > 0 else [],
                resource_ids=matched_res[:2],
                practical_exercise=f"Implement a working mini-project or code module utilizing {skill_name}.",
                completion_criteria=f"Working code implementation with zero unhandled errors, submitted to GitHub.",
                status=task_status,
                due_date=task_due,
                completed_at=datetime.datetime.utcnow() if task_status == "Completed" else None,
                notes="Task prefilled and personalized from your academic profile." if is_known else None
            )
            db.add(task_record)
            created_tasks.append(task_record)

        # Add milestone for each phase
        milestone_id = f"mls_{uuid.uuid4().hex[:10]}"
        milestone_record = models.RoadmapMilestone(
            id=milestone_id,
            roadmap_id=roadmap_id,
            title=p_src["practical_milestone"],
            target_date=(current_date + datetime.timedelta(weeks=(idx + 1) * weeks_per_phase)).isoformat(),
            status="Upcoming",
            associated_phase_or_project=phase_id
        )
        db.add(milestone_record)

    # Add 2-3 Capstone Projects
    project_samples = track["typical_project_outcomes"] if track else ["Capstone Portfolio Project", "Enterprise Case Study"]
    for prj_idx, prj_title in enumerate(project_samples):
        proj_id = f"prj_{uuid.uuid4().hex[:10]}"
        proj_record = models.RoadmapProject(
            id=proj_id,
            roadmap_id=roadmap_id,
            title=prj_title,
            problem_statement=f"Design and construct a production-ready {prj_title} demonstrating industry-grade architectural principles.",
            expected_outcome=f"A fully documented, accessible application hosted with clean code and high test coverage.",
            skills_practiced=track["core_skills"][:5] if track else ["System Architecture", "Full-Stack Design"],
            prerequisite_tasks=[],
            suggested_tech=track["core_skills"][:4] if track else ["React", "FastAPI", "SQL"],
            feature_checklist=[
                {"label": "Responsive mobile and desktop UI", "done": False},
                {"label": "Secure authentication and authorization", "done": False},
                {"label": "Optimized database schema and error handling", "done": False},
                {"label": "Comprehensive test suite and GitHub Actions CI", "done": False}
            ],
            definition_of_done="Live public URL, documented README with architecture diagram, and clean Git commit history.",
            expected_hours=25,
            portfolio_relevance="Directly showcases full lifecycle ownership during recruiter interviews.",
            status="Not Started"
        )
        db.add(proj_record)

    # Initial Progress Snapshot
    snap_id = f"snp_{uuid.uuid4().hex[:10]}"
    completed_cnt = sum(1 for t in created_tasks if t.status == "Completed")
    total_cnt = len(created_tasks)
    initial_snap = models.RoadmapProgressSnapshot(
        id=snap_id,
        student_id=student.id,
        roadmap_id=roadmap_id,
        timestamp=datetime.datetime.utcnow(),
        completed_task_count=completed_cnt,
        total_task_count=total_cnt,
        completion_percentage=round((completed_cnt / total_cnt * 100), 1) if total_cnt > 0 else 0.0,
        completed_hours=sum(t.estimated_hours for t in created_tasks if t.status == "Completed"),
        planned_hours=sum(t.estimated_hours for t in created_tasks)
    )
    db.add(initial_snap)

    db.commit()

    return {"message": "Personalized career roadmap generated successfully", "roadmap_id": roadmap_id}

@router.patch("/tasks/{task_id}")
def update_task_status(
    task_id: str,
    update: TaskUpdateSchema,
    db: Session = Depends(get_db),
    student: models.Student = Depends(get_current_student)
):
    """
    Updates task status ('Not Started', 'In Progress', 'Completed', 'Blocked') or notes,
    then automatically recalculates the overall roadmap completion and logs a snapshot.
    """
    task = db.query(models.RoadmapTask).filter(models.RoadmapTask.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found.")

    if update.status:
        task.status = update.status
        if update.status == "Completed":
            task.completed_at = datetime.datetime.utcnow()
        else:
            task.completed_at = None

    if update.notes is not None:
        task.notes = update.notes

    if update.due_date is not None:
        task.due_date = update.due_date

    # Recalculate roadmap snapshot
    all_tasks = db.query(models.RoadmapTask).filter(models.RoadmapTask.roadmap_id == task.roadmap_id).all()
    total_cnt = len(all_tasks)
    completed_cnt = sum(1 for t in all_tasks if t.status == "Completed")
    pct = round((completed_cnt / total_cnt * 100), 1) if total_cnt > 0 else 0.0

    snap_id = f"snp_{uuid.uuid4().hex[:10]}"
    snapshot = models.RoadmapProgressSnapshot(
        id=snap_id,
        student_id=student.id,
        roadmap_id=task.roadmap_id,
        timestamp=datetime.datetime.utcnow(),
        completed_task_count=completed_cnt,
        total_task_count=total_cnt,
        completion_percentage=pct,
        completed_hours=sum(t.estimated_hours for t in all_tasks if t.status == "Completed"),
        planned_hours=sum(t.estimated_hours for t in all_tasks)
    )
    db.add(snapshot)

    # Update Phase status if all tasks in phase completed
    phase = db.query(models.RoadmapPhase).filter(models.RoadmapPhase.id == task.phase_id).first()
    if phase:
        phase_tasks = [t for t in all_tasks if t.phase_id == phase.id]
        if all(t.status == "Completed" for t in phase_tasks):
            phase.status = "Completed"
        elif any(t.status == "In Progress" for t in phase_tasks):
            phase.status = "In Progress"
        elif any(t.status == "Blocked" for t in phase_tasks):
            phase.status = "Blocked"

    db.commit()
    return {
        "message": "Task updated",
        "task_id": task_id,
        "new_status": task.status,
        "completion_percentage": pct
    }

@router.patch("/projects/{project_id}")
def update_project_status(
    project_id: str,
    update: ProjectUpdateSchema,
    db: Session = Depends(get_db),
    student: models.Student = Depends(get_current_student)
):
    """
    Updates milestone practical project repository, demo URL, checklist, or status.
    """
    project = db.query(models.RoadmapProject).filter(models.RoadmapProject.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found.")

    if update.status:
        project.status = update.status
        if update.status == "Completed":
            project.completed_at = datetime.datetime.utcnow()
    if update.github_url is not None:
        project.github_url = update.github_url
    if update.demo_url is not None:
        project.demo_url = update.demo_url
    if update.feature_checklist is not None:
        project.feature_checklist = update.feature_checklist

    db.commit()
    return {"message": "Project updated", "project_id": project_id, "status": project.status}

@router.post("/assistant")
def query_roadmap_assistant(
    req: AssistantQueryRequest,
    db: Session = Depends(get_db),
    student: models.Student = Depends(get_current_student)
):
    """
    Contextual AI Assistant grounded in the student's active roadmap.
    Analyzes current phase, blockers, schedule progress, and returns actionable advice.
    When schedule adjustments are recommended, generates a structured proposal
    with explicit Accept/Reject requirement.
    """
    roadmap = (
        db.query(models.StudentRoadmap)
        .filter(models.StudentRoadmap.student_id == student.id, models.StudentRoadmap.status == "Active")
        .first()
    )
    if not roadmap:
        return {
            "answer": "You don't have an active roadmap yet. Choose a career track from the 'Choose Your Career' tab to generate your personalized learning journey!",
            "proposal": None
        }

    all_tasks = db.query(models.RoadmapTask).filter(models.RoadmapTask.roadmap_id == roadmap.id).all()
    completed_tasks = [t for t in all_tasks if t.status == "Completed"]
    in_progress_tasks = [t for t in all_tasks if t.status == "In Progress"]
    blocked_tasks = [t for t in all_tasks if t.status == "Blocked"]
    not_started_tasks = [t for t in all_tasks if t.status == "Not Started"]

    prompt_lower = req.prompt.lower()

    # Rule-based contextual AI engine grounded in active roadmap data
    # (Safe, deterministic, accurate, and completely aligned with Placement Hub constraints)
    answer = ""
    proposal = None

    if "what should i study today" in prompt_lower or "today" in prompt_lower or "next" in prompt_lower:
        if blocked_tasks:
            target = blocked_tasks[0]
            answer = (
                f"You currently have a blocked task: **{target.title}** ({target.associated_skill}). "
                f"I recommend resolving this blocker first so your momentum isn't hindered. "
                f"Check the linked resources for {target.associated_skill} or review the prerequisites."
            )
        elif in_progress_tasks:
            target = in_progress_tasks[0]
            answer = (
                f"Continue working on your in-progress task: **{target.title}** ({target.associated_skill}). "
                f"Learning objective: {target.learning_objective}. Estimated commitment: ~{target.estimated_hours} hours. "
                f"Practical exercise: {target.practical_exercise or 'Build code according to completion criteria.'}"
            )
        elif not_started_tasks:
            target = not_started_tasks[0]
            answer = (
                f"Your next planned task is **{target.title}** under {roadmap.career_title}. "
                f"This will cover {target.associated_skill}. Priority: {target.priority}. "
                f"Mark it 'In Progress' when you begin!"
            )
        else:
            answer = "Congratulations! You have completed all scheduled tasks in your roadmap! Check your practical milestone capstones to verify your portfolio."

    elif "stuck" in prompt_lower or "blocked" in prompt_lower or "explain" in prompt_lower:
        task_ref = blocked_tasks[0] if blocked_tasks else (in_progress_tasks[0] if in_progress_tasks else None)
        if task_ref:
            answer = (
                f"When working on **{task_ref.associated_skill}**, students often encounter friction with syntax or asynchronous execution. "
                f"Here is a recommended 3-step unblocking protocol:\n"
                f"1. **Isolate the minimal reproducible case**: Strip away extraneous layout and test just the core logic.\n"
                f"2. **Consult the verified reference**: Open the linked documentation for {task_ref.associated_skill} in your Resource Library.\n"
                f"3. **Add console logging or debugger checkpoints**: Inspect the variables and return types before the failure point."
            )
        else:
            answer = "To help you unblock, select a specific task or let me know which concept is giving you trouble."

    elif "schedule" in prompt_lower or "missed" in prompt_lower or "behind" in prompt_lower or "adjust" in prompt_lower:
        # Generate an actionable schedule adaptation proposal requiring confirmation!
        proposal_id = f"prop_{uuid.uuid4().hex[:8]}"
        proposal = {
            "proposal_id": proposal_id,
            "title": "Pace Realignment & Schedule Buffer Adjustment",
            "reason": "You indicated a missed target or need for timeline realignment.",
            "changes": [
                {
                    "type": "Extend Target Timeline",
                    "description": f"Add a 2-week buffer to your target completion date (from {roadmap.target_timeline_months} months to {roadmap.target_timeline_months + 1} months)."
                },
                {
                    "type": "Redistribute Task Due Dates",
                    "description": f"Shift due dates for {len(not_started_tasks)} upcoming tasks across your available {roadmap.weekly_hours_available} hrs/week budget."
                }
            ],
            "affected_tasks_count": len(not_started_tasks),
            "affected_timeline_months": roadmap.target_timeline_months + 1
        }
        answer = (
            f"I have reviewed your roadmap workload. You currently have {len(completed_tasks)} completed, "
            f"{len(in_progress_tasks)} in progress, and {len(not_started_tasks)} remaining tasks. "
            f"Rather than falling behind, I propose a realistic schedule adjustment. "
            f"Review the proposal below and click **Accept Changes** to apply the revised schedule to your roadmap."
        )

    elif "skip" in prompt_lower or "already know" in prompt_lower or "test out" in prompt_lower:
        # Prompt explicitly mentions: "If a student claims to already know a skill, allow them to request a short diagnostic or review task before skipping important prerequisites."
        answer = (
            "You can test out of prerequisites if you already have practical competence! "
            "To uphold your verified skill record, Placement Hub requires a short diagnostic check. "
            "Click **Request Diagnostic Assessment** to complete a 3-question evaluation, or link an existing GitHub repository proving this skill."
        )

    elif "finish" in prompt_lower or "timeline" in prompt_lower:
        total_remaining_hrs = sum(t.estimated_hours for t in not_started_tasks + in_progress_tasks)
        weeks_needed = round(total_remaining_hrs / max(1, roadmap.weekly_hours_available), 1)
        months_needed = round(weeks_needed / 4.3, 1)
        answer = (
            f"Based on your current pace and {roadmap.weekly_hours_available} hours/week availability:\n"
            f"- **Remaining planned effort:** ~{total_remaining_hrs} hours across {len(not_started_tasks) + len(in_progress_tasks)} tasks.\n"
            f"- **Estimated time required:** ~{weeks_needed} weeks ({months_needed} months).\n"
            f"- **Target timeline:** {roadmap.target_timeline_months} months.\n"
            f"You are {'on track to hit your goal!' if months_needed <= roadmap.target_timeline_months else 'slightly behind target. You can adjust your weekly hours or request a schedule extension below.'}"
        )

    else:
        answer = (
            f"I am your contextual AI Roadmap Assistant for **{roadmap.career_title}**. "
            f"You are in Phase {roadmap.current_phase_index + 1}. You have completed {len(completed_tasks)} of {len(all_tasks)} tasks "
            f"({round(len(completed_tasks)/len(all_tasks)*100, 1) if all_tasks else 0}% progress). "
            f"You can ask me what to study today, how to approach a milestone project, or request schedule adaptations whenever needed."
        )

    return {
        "answer": answer,
        "proposal": proposal
    }

@router.post("/adapt")
def apply_roadmap_adaptation(
    req: AdaptationActionRequest,
    db: Session = Depends(get_db),
    student: models.Student = Depends(get_current_student)
):
    """
    Applies confirmed AI-proposed roadmap adjustments to the database.
    Enforces student confirmation (never silently rewrites without acceptance).
    """
    roadmap = (
        db.query(models.StudentRoadmap)
        .filter(models.StudentRoadmap.student_id == student.id, models.StudentRoadmap.status == "Active")
        .first()
    )
    if not roadmap:
        raise HTTPException(status_code=404, detail="Active roadmap not found.")

    if req.action == "reject":
        # Log rejected proposal audit
        change_record = models.RoadmapChange(
            id=f"chg_{uuid.uuid4().hex[:10]}",
            roadmap_id=roadmap.id,
            change_type=req.change_type,
            previous_state={"status": "Rejected by student"},
            new_state={"status": "Unchanged"},
            reason=req.reason,
            accepted=False
        )
        db.add(change_record)
        db.commit()
        return {"message": "Adaptation proposal rejected. Roadmap preserved without modification."}

    # Apply changes
    prev_timeline = roadmap.target_timeline_months
    prev_weekly_hours = roadmap.weekly_hours_available

    if "target_timeline_months" in req.details:
        roadmap.target_timeline_months = int(req.details["target_timeline_months"])
    if "weekly_hours_available" in req.details:
        roadmap.weekly_hours_available = int(req.details["weekly_hours_available"])

    # If rescheduling due dates, shift not-started tasks
    tasks = db.query(models.RoadmapTask).filter(models.RoadmapTask.roadmap_id == roadmap.id).all()
    current_date = datetime.date.today()
    not_started = [t for t in tasks if t.status == "Not Started"]
    
    for i, t in enumerate(not_started):
        t.due_date = (current_date + datetime.timedelta(days=(i + 1) * 3)).isoformat()

    change_record = models.RoadmapChange(
        id=f"chg_{uuid.uuid4().hex[:10]}",
        roadmap_id=roadmap.id,
        change_type=req.change_type,
        previous_state={"target_timeline_months": prev_timeline, "weekly_hours_available": prev_weekly_hours},
        new_state={"target_timeline_months": roadmap.target_timeline_months, "weekly_hours_available": roadmap.weekly_hours_available},
        reason=req.reason,
        accepted=True
    )
    db.add(change_record)
    db.commit()

    return {
        "message": "Roadmap successfully adapted and saved.",
        "new_target_timeline_months": roadmap.target_timeline_months,
        "new_weekly_hours_available": roadmap.weekly_hours_available
    }
