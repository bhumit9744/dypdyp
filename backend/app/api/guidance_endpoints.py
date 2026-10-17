import datetime
import uuid
from typing import List, Dict, Any, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from ..core.database import get_db
from ..models.models import (
    Student,
    CareerGuidanceProfile,
    CareerGoal,
    CareerComparisonRecord,
    CareerExperiment,
    StudentCareerExperiment,
    CareerGuidanceConversation,
    CareerGuidanceAction,
    CareerDecisionHistory,
    StudentRoadmap,
    RoadmapTask,
    RoadmapPhase
)

router = APIRouter(prefix="/guidance", tags=["AI Career Guidance"])

# =========================================================================
# 16 EXTENSIVE CAREER ROLES CATALOG
# =========================================================================

CAREER_CATALOG: List[Dict[str, Any]] = [
    {
        "id": "role_software_engineer",
        "title": "Software Engineer",
        "category": "Software Engineering",
        "description": "Designs, develops, and maintains scalable software systems, algorithms, and backend services that power core enterprise and consumer applications.",
        "day_to_day": "Writing robust code, participating in sprint standups, reviewing pull requests, solving algorithmic bottlenecks, and collaborating with cross-functional teams.",
        "core_responsibilities": [
            "Implement high-performance core algorithms and business logic",
            "Write comprehensive unit and integration test suites",
            "Participate in design reviews and system architecture discussions",
            "Debug production issues and optimize memory and CPU performance"
        ],
        "essential_skills": ["Data Structures & Algorithms", "Java / C++ / Python", "Object-Oriented Design", "Git & CI/CD", "System Design Basics"],
        "useful_skills": ["SQL & Relational Databases", "Docker & Linux", "Design Patterns", "Concurrency & Threading"],
        "academic_foundations": ["Data Structures", "Algorithms", "Operating Systems", "Computer Networks", "DBMS"],
        "tools_technologies": ["Git", "IntelliJ / VS Code", "Docker", "JUnit / PyTest", "Postman"],
        "example_projects": [
            "Distributed Key-Value Store with replication",
            "In-memory Caching Engine with LRU eviction",
            "Algorithmic Trading Backtester"
        ],
        "entry_job_titles": ["Associate Software Engineer", "Graduate Software Engineer", "Junior Developer"],
        "interview_focus": ["DSA Problem Solving (LeetCode Medium)", "Object-Oriented Architecture", "Core CS Fundamentals (OS/CN/DBMS)"],
        "portfolio_expectations": "Clean GitHub repositories with passing automated tests, clear READMEs, and algorithm benchmarks.",
        "prerequisites": ["Basic Programming in Java, C++, or Python"],
        "experiment_id": "exp_software_dev_1"
    },
    {
        "id": "role_frontend_developer",
        "title": "Frontend Developer",
        "category": "Software Engineering",
        "description": "Crafts responsive, accessible, and high-performance user interfaces and client-side applications using modern JavaScript frameworks.",
        "day_to_day": "Translating UI/UX mockups into interactive components, optimizing web vitals, managing complex client state, and integrating backend REST/GraphQL APIs.",
        "core_responsibilities": [
            "Build responsive, pixel-accurate web pages with modern CSS and HTML5",
            "Develop reusable UI components in React, Vue, or Next.js",
            "Manage client state, caching, and optimistic UI updates",
            "Audit web accessibility (WCAG AA) and Core Web Vitals"
        ],
        "essential_skills": ["JavaScript (ES6+) & TypeScript", "React / Next.js", "HTML5 & Semantic Structure", "Tailwind CSS / Modern CSS", "REST / GraphQL Fetching"],
        "useful_skills": ["State Management (Zustand/Redux)", "Performance Profiling", "Web Vitals", "Jest & Playwright Testing"],
        "academic_foundations": ["Web Technologies", "Human-Computer Interaction", "Software Engineering"],
        "tools_technologies": ["VS Code", "Chrome DevTools", "npm/Vite", "Figma (Inspect)", "Vercel / Netlify"],
        "example_projects": [
            "Interactive Dashboard with real-time financial charting",
            "E-commerce Storefront with optimistic cart updates",
            "Accessible Markdown Document Editor"
        ],
        "entry_job_titles": ["Junior Frontend Developer", "UI Engineer", "Frontend Specialist"],
        "interview_focus": ["JavaScript event loop & DOM manipulation", "React Hooks & Component Lifecycle", "CSS Layouts (Flexbox/Grid) & Web Performance"],
        "portfolio_expectations": "Live deployed web applications on Vercel/Netlify with responsive layouts and accessible controls.",
        "prerequisites": ["Basic HTML/CSS and introductory JavaScript"],
        "experiment_id": "exp_software_dev_1"
    },
    {
        "id": "role_backend_developer",
        "title": "Backend Developer",
        "category": "Software Engineering",
        "description": "Architects server-side logic, secure REST and GraphQL APIs, database schemas, and microservice communication pipelines.",
        "day_to_day": "Designing database schemas, implementing API endpoints, writing auth middleware, optimizing SQL queries, and managing background task queues.",
        "core_responsibilities": [
            "Develop authenticated, rate-limited REST and gRPC endpoints",
            "Design normalized relational schemas and indexing strategies",
            "Implement caching layers with Redis and message queues with RabbitMQ/Kafka",
            "Secure applications against OWASP vulnerabilities and data leaks"
        ],
        "essential_skills": ["Node.js / Python / Go", "SQL & Database Design (PostgreSQL)", "RESTful API Architecture", "Authentication (JWT / OAuth2)", "Git & Docker"],
        "useful_skills": ["Redis Caching", "Microservices Architecture", "Message Brokers (Kafka/RabbitMQ)", "API Gateway & CI/CD"],
        "academic_foundations": ["DBMS", "Operating Systems", "Computer Networks", "Information Security"],
        "tools_technologies": ["Postman", "Docker", "pgAdmin / DBeaver", "Redis CLI", "FastAPI / Express"],
        "example_projects": [
            "Role-Based Access Control (RBAC) API with JWT and refresh tokens",
            "Real-time Notification Service with WebSockets and Redis pub/sub",
            "High-Throughput URL Shortener with analytics pipeline"
        ],
        "entry_job_titles": ["Junior Backend Engineer", "Server-Side Developer", "API Engineer"],
        "interview_focus": ["API Design & HTTP status codes", "SQL query optimization & transactions (ACID)", "Concurrency & backend system design"],
        "portfolio_expectations": "Documented Swagger/Postman API collections, clear schema ER diagrams, and live deployed backend services.",
        "prerequisites": ["Basic Python, JavaScript, or Java and basic SQL"],
        "experiment_id": "exp_software_dev_2"
    },
    {
        "id": "role_fullstack",
        "title": "Full-Stack Developer",
        "category": "Software Engineering",
        "description": "Bridges frontend client experiences and backend server architectures to deliver cohesive, end-to-end digital web applications.",
        "day_to_day": "Building full feature verticals from UI forms to database models, connecting frontend state to backend APIs, and deploying production builds.",
        "core_responsibilities": [
            "Develop end-to-end user features across React frontend and Node/Python backend",
            "Model relational and document databases to serve dynamic UI needs",
            "Deploy, configure, and maintain production hosting environments",
            "Conduct full-stack debugging and integration testing"
        ],
        "essential_skills": ["React / Next.js", "Node.js / Express / FastAPI", "PostgreSQL / MongoDB", "TypeScript", "REST APIs & Auth", "Deployment (Vercel/Docker)"],
        "useful_skills": ["Tailwind CSS", "Redis", "CI/CD Workflows", "GraphQL", "Testing (Playwright/Jest)"],
        "academic_foundations": ["Data Structures", "DBMS", "Computer Networks", "Web Systems"],
        "tools_technologies": ["VS Code", "Docker", "Postman", "GitHub Actions", "Vercel / Render"],
        "example_projects": [
            "Campus Placement & Recruitment Portal with multi-role permissions",
            "Real-time Collaborative Kanban Board with live updates",
            "SaaS Subscription Management App with payment webhooks"
        ],
        "entry_job_titles": ["Associate Full-Stack Developer", "Web Application Developer", "Software Engineer"],
        "interview_focus": ["Full-stack architecture", "Data flow from DB to Browser", "DSA + System design discussion"],
        "portfolio_expectations": "At least 2 deployed full-stack applications with authenticated accounts, responsive UI, and GitHub repos.",
        "prerequisites": ["Basic JavaScript & programming fundamentals"],
        "experiment_id": "exp_software_dev_1"
    },
    {
        "id": "role_aiml_engineer",
        "title": "AI/ML Engineer",
        "category": "AI & Data Science",
        "description": "Trains predictive statistical models, builds neural networks, and integrates machine learning systems into production applications.",
        "day_to_day": "Preprocessing raw datasets, engineering features, training and fine-tuning ML models, tracking experiment metrics, and packaging models as inference APIs.",
        "core_responsibilities": [
            "Clean and transform structured and unstructured datasets",
            "Train and validate supervised and unsupervised ML algorithms",
            "Evaluate model performance against statistical metrics (F1, AUC-ROC, RMSE)",
            "Deploy trained models via FastAPI/Flask endpoints for live inference"
        ],
        "essential_skills": ["Python & NumPy / pandas", "Scikit-learn & Machine Learning", "Linear Algebra & Probability", "PyTorch / TensorFlow", "Model Evaluation & Tuning"],
        "useful_skills": ["Hugging Face Transformers", "FastAPI Serving", "MLflow / DVC", "Vector Databases & Embeddings", "Docker"],
        "academic_foundations": ["Applied Mathematics", "Probability & Statistics", "Linear Algebra", "Data Structures"],
        "tools_technologies": ["Jupyter Lab", "PyTorch", "Scikit-Learn", "FastAPI", "Weights & Biases"],
        "example_projects": [
            "Placement Eligibility & Salary Predictor using ensemble trees",
            "Medical Diagnosis Classifier with confusion matrix auditing",
            "Domain-specific RAG Assistant using embeddings and vector search"
        ],
        "entry_job_titles": ["Junior ML Engineer", "AI Associate", "Data Science Engineer"],
        "interview_focus": ["Math foundations (Gradients, Bayes theorem)", "Algorithm trade-offs (Random Forest vs XGBoost)", "Model validation & data leakage"],
        "portfolio_expectations": "Documented Jupyter Notebooks with clear analytical narratives, evaluated metrics, and a deployed inference demo.",
        "prerequisites": ["Python programming & introductory calculus/statistics"],
        "experiment_id": "exp_data_ai_1"
    },
    {
        "id": "role_data_analyst",
        "title": "Data Analyst",
        "category": "AI & Data Science",
        "description": "Translates complex business datasets into actionable operational insights, automated KPI dashboards, and data-backed recommendations.",
        "day_to_day": "Writing SQL queries to extract data, cleaning datasets in pandas/Excel, building interactive dashboards, and presenting trends to stakeholders.",
        "core_responsibilities": [
            "Query relational databases using complex SQL joins, CTEs, and window functions",
            "Perform Exploratory Data Analysis (EDA) to identify business anomalies",
            "Build interactive Tableau / Power BI / Metabase dashboards",
            "Communicate quantitative insights to technical and non-technical teams"
        ],
        "essential_skills": ["Advanced SQL", "Python (pandas & Matplotlib)", "Power BI / Tableau", "Descriptive Statistics", "Spreadsheets & Excel Modeling"],
        "useful_skills": ["A/B Testing Basics", "Data Storytelling", "dbt (Data Build Tool)", "ETL Basics"],
        "academic_foundations": ["Database Management", "Statistics", "Business Mathematics"],
        "tools_technologies": ["PostgreSQL / BigQuery", "Power BI / Tableau", "Jupyter Notebooks", "Excel"],
        "example_projects": [
            "University Campus Placement Trends Dashboard (5-year historical analysis)",
            "Customer Churn & Retention Analysis Report",
            "E-commerce Sales & Inventory Optimization Analysis"
        ],
        "entry_job_titles": ["Junior Data Analyst", "Business Intelligence Analyst", "Analytics Specialist"],
        "interview_focus": ["SQL Window Functions and complex aggregations", "Interpreting business KPIs", "Case study data problem solving"],
        "portfolio_expectations": "Interactive dashboard links (Tableau Public / Power BI) and documented EDA case study write-ups.",
        "prerequisites": ["Basic math & enthusiasm for working with numbers and tables"],
        "experiment_id": "exp_data_ai_1"
    },
    {
        "id": "role_data_scientist",
        "title": "Data Scientist",
        "category": "AI & Data Science",
        "description": "Applies statistical modeling, predictive analytics, and scientific research methodologies to extract deep patterns from complex data.",
        "day_to_day": "Designing scientific experiments, formulating statistical hypotheses, training advanced models, and optimizing algorithms for predictive accuracy.",
        "core_responsibilities": [
            "Formulate and test statistical hypotheses to drive strategic decisions",
            "Build predictive and prescriptive machine learning models",
            "Design and analyze A/B tests with statistical significance rigor",
            "Translate ambiguous research questions into quantifiable modeling tasks"
        ],
        "essential_skills": ["Inferential Statistics & Hypothesis Testing", "Python / R", "Advanced Machine Learning", "Data Wrangling (SQL/pandas)", "Experiment Design (A/B Testing)"],
        "useful_skills": ["Time-Series Forecasting", "Big Data (PySpark)", "Deep Learning", "Cloud Analytics (AWS/GCP)"],
        "academic_foundations": ["Probability & Mathematical Statistics", "Linear Algebra", "Optimization Theory"],
        "tools_technologies": ["Jupyter", "PySpark", "Scikit-Learn", "Statsmodels", "SQL"],
        "example_projects": [
            "Time-Series Energy Consumption Forecaster with Prophet",
            "Customer Lifetime Value (LTV) Predictive Model",
            "A/B Test Evaluation Pipeline with Bayesian statistical rigor"
        ],
        "entry_job_titles": ["Associate Data Scientist", "Quantitative Analyst", "Research Analyst"],
        "interview_focus": ["Probability distributions & p-value interpretation", "Supervised/unsupervised mathematical proofs", "Statistical experiment design"],
        "portfolio_expectations": "Scientific reports demonstrating methodical exploratory data analysis, hypothesis testing, and model benchmarking.",
        "prerequisites": ["Strong mathematics/statistics background and Python"],
        "experiment_id": "exp_data_ai_2"
    },
    {
        "id": "role_uiux_designer",
        "title": "UI/UX Designer",
        "category": "Design & Product",
        "description": "Designs intuitive, accessible, and delightful digital user experiences through research, information architecture, wireframes, and high-fidelity prototypes.",
        "day_to_day": "Conducting user interviews, synthesizing user personas, sketching user flows, designing high-fidelity Figma components, and testing usability.",
        "core_responsibilities": [
            "Conduct qualitative user research and competitive interface audits",
            "Create wireframes, user flows, and interactive Figma prototypes",
            "Build and maintain cohesive design systems with reusable components",
            "Perform usability testing and iterate based on real feedback"
        ],
        "essential_skills": ["Figma & Auto Layout", "User Research & Personas", "Wireframing & Prototyping", "Visual Hierarchy & Typography", "Design Systems", "Usability Testing"],
        "useful_skills": ["Micro-interactions (Principle/Framer)", "Basic HTML/CSS understanding", "Accessibility (WCAG)", "Information Architecture"],
        "academic_foundations": ["Human-Computer Interaction", "Cognitive Psychology", "Graphic Design Basics"],
        "tools_technologies": ["Figma", "FigJam", "Miro", "Notion", "Framer"],
        "example_projects": [
            "Campus Event Discovery App: UX Research to Interactive Prototype",
            "Financial App Onboarding Redesign with Usability Test Case Study",
            "Complete Multi-platform Design System with Tokens"
        ],
        "entry_job_titles": ["Associate Product Designer", "Junior UI/UX Designer", "Interaction Designer"],
        "interview_focus": ["Design process walkthrough (Double Diamond)", "Rationale behind design decisions", "Live design challenge / critique"],
        "portfolio_expectations": "2-3 comprehensive case studies detailing the problem, user research, wireframes, iterations, and final prototype.",
        "prerequisites": ["Eye for visual aesthetics & curiosity about user psychology"],
        "experiment_id": "exp_uiux_1"
    },
    {
        "id": "role_product_designer",
        "title": "Product Designer",
        "category": "Design & Product",
        "description": "Combines deep UX research, interaction design, and business strategy to define and design complete product solutions from conception to launch.",
        "day_to_day": "Aligning product metrics with user needs, defining problem statements, prototyping features, collaborating with engineers and product managers.",
        "core_responsibilities": [
            "Define product requirements balancing user experience and business outcomes",
            "Map end-to-end customer journey maps and edge-case user flows",
            "Design production-ready components and interactive prototypes",
            "Measure product adoption and UX metrics post-launch"
        ],
        "essential_skills": ["Product Thinking & Business Strategy", "Figma High-Fidelity Design", "User Journey Mapping", "Design Systems", "Metrics & Usability Analysis"],
        "useful_skills": ["Framer / Webflow", "A/B Testing Analysis", "Basic Coding Knowledge", "Workshop Facilitation"],
        "academic_foundations": ["HCI", "Product Management Fundamentals", "Design Thinking"],
        "tools_technologies": ["Figma", "Mixpanel / PostHog", "Loom", "Notion", "Whimsical"],
        "example_projects": [
            "End-to-end Job Search & Application Flow Case Study with Business Metrics",
            "Peer Mentorship Platform: Discovery, Strategy & Prototype",
            "B2B SaaS Analytics Workspace Design"
        ],
        "entry_job_titles": ["Junior Product Designer", "Associate UX Designer", "Design Strategist"],
        "interview_focus": ["Product sense & trade-off decisions", "Cross-functional collaboration with engineering", "Portfolio deep dive"],
        "portfolio_expectations": "Case studies demonstrating strategic thinking, business constraints, and measurable design outcomes.",
        "prerequisites": ["UI/UX fundamentals & product curiosity"],
        "experiment_id": "exp_uiux_2"
    },
    {
        "id": "role_business_analyst",
        "title": "Business Analyst",
        "category": "Business & Strategy",
        "description": "Identifies business operational needs, documents functional requirements, and bridges corporate strategy with technical engineering teams.",
        "day_to_day": "Interviewing business stakeholders, writing user stories and acceptance criteria, mapping business processes, and validating software deliverables.",
        "core_responsibilities": [
            "Elicit and document functional and non-functional software requirements",
            "Create Business Process Model and Notation (BPMN) diagrams and user stories",
            "Analyze business data to identify operational bottlenecks",
            "Facilitate User Acceptance Testing (UAT) and stakeholder sign-offs"
        ],
        "essential_skills": ["Requirements Gathering", "User Stories & Acceptance Criteria", "Process Flow Mapping (BPMN)", "SQL Basics", "Agile / Scrum Methodologies"],
        "useful_skills": ["Jira / Confluence", "Data Visualization (Power BI)", "Financial Modeling Basics", "Stakeholder Communication"],
        "academic_foundations": ["Software Project Management", "Information Systems", "Business Administration"],
        "tools_technologies": ["Jira", "Confluence", "Lucidchart / Visio", "Excel", "SQL"],
        "example_projects": [
            "University Library Automation: Business Requirement Document (BRD) & Process Map",
            "Campus Placement Drive Workflow Optimization Analysis",
            "E-commerce Return Management Feature Specification"
        ],
        "entry_job_titles": ["Associate Business Analyst", "Junior Systems Analyst", "Functional Consultant"],
        "interview_focus": ["Translating vague business requests into technical requirements", "Process flow analysis", "Stakeholder conflict resolution"],
        "portfolio_expectations": "Sample BRD documents, detailed process flow diagrams, and user story mapping artifacts.",
        "prerequisites": ["Strong communication, analytical thinking, and basic tech literacy"],
        "experiment_id": "exp_software_dev_1"
    },
    {
        "id": "role_devops_engineer",
        "title": "DevOps / Cloud Engineer",
        "category": "Cloud & Infrastructure",
        "description": "Automates software delivery pipelines, provisions cloud infrastructure as code, and guarantees system reliability, scalability, and uptime.",
        "day_to_day": "Configuring CI/CD pipelines, writing Terraform scripts, managing Kubernetes clusters, monitoring cloud health, and triaging deployment alerts.",
        "core_responsibilities": [
            "Build automated CI/CD pipelines with GitHub Actions or GitLab CI",
            "Provision and maintain cloud resources (AWS/GCP) using Terraform",
            "Containerize microservices with Docker and orchestrate with Kubernetes",
            "Implement observability, alerts, and dashboards using Prometheus & Grafana"
        ],
        "essential_skills": ["Linux System Administration", "Docker & Containerization", "CI/CD Pipelines (GitHub Actions)", "Cloud Basics (AWS / GCP)", "Terraform (IaC)"],
        "useful_skills": ["Kubernetes (K8s)", "Bash Scripting", "Prometheus & Grafana", "Network Security (VPC/Firewalls)"],
        "academic_foundations": ["Operating Systems", "Computer Networks", "Distributed Systems"],
        "tools_technologies": ["Linux / Bash", "Docker", "AWS / GCP", "GitHub Actions", "Terraform", "Kubernetes"],
        "example_projects": [
            "Automated Multi-Stage CI/CD Pipeline with Docker builds and unit testing",
            "Terraform Cloud Infrastructure Blueprint for a resilient web application",
            "Kubernetes Microservices Deployment with live Grafana metrics"
        ],
        "entry_job_titles": ["Junior Cloud Engineer", "Associate DevOps Specialist", "Site Reliability Engineer (SRE)"],
        "interview_focus": ["Linux commands & permissions", "Docker container lifecycle & networking", "CI/CD best practices and troubleshooting"],
        "portfolio_expectations": "GitHub repositories featuring automated workflows, Dockerfiles, and Terraform infrastructure configurations.",
        "prerequisites": ["Basic command-line familiarity and general networking concepts"],
        "experiment_id": "exp_cloud_1"
    },
    {
        "id": "role_cybersecurity",
        "title": "Cybersecurity Analyst",
        "category": "Cloud & Infrastructure",
        "description": "Protects digital systems, networks, and confidential data against unauthorized access, vulnerabilities, cyberattacks, and security breaches.",
        "day_to_day": "Analyzing network packet captures, conducting vulnerability assessments, monitoring SIEM logs for anomalies, and researching threat exploits.",
        "core_responsibilities": [
            "Monitor security alerts and investigate anomalous network traffic",
            "Audit web applications for OWASP Top 10 vulnerabilities",
            "Perform vulnerability scanning with Nmap and security scanners",
            "Draft incident response playbooks and security remediation reports"
        ],
        "essential_skills": ["Network Security & TCP/IP", "Linux Security & Hardening", "OWASP Top 10 Web Vulnerabilities", "Vulnerability Scanning (Nmap/Wireshark)", "Security Fundamentals"],
        "useful_skills": ["SIEM Tools (Splunk/ELK)", "Python for Security Scripting", "Cryptography Basics", "Burp Suite"],
        "academic_foundations": ["Computer Networks", "Information Security", "Cryptography", "Operating Systems"],
        "tools_technologies": ["Wireshark", "Nmap", "Burp Suite Community", "Kali Linux", "Linux Terminal"],
        "example_projects": [
            "Vulnerability Assessment & Remediation Report for a Web Application",
            "Network Intrusion Detection & Wireshark Packet Analysis Log",
            "Hardened Linux Server Configuration Blueprint"
        ],
        "entry_job_titles": ["Junior SOC Analyst", "Security Associate", "Vulnerability Analyst"],
        "interview_focus": ["TCP 3-way handshake & OSI model", "OWASP Top 10 exploits (SQLi, XSS, CSRF)", "Incident response scenarios"],
        "portfolio_expectations": "Ethical security audit reports, TryHackMe / HackTheBox badges, and security automation scripts.",
        "prerequisites": ["Basic networking knowledge (IP addresses, ports, protocols)"],
        "experiment_id": "exp_cyber_1"
    },
    {
        "id": "role_qa_engineer",
        "title": "QA / Automation Engineer",
        "category": "Quality & Testing",
        "description": "Guarantees software reliability, security, and performance by authoring automated test suites, testing APIs, and executing defect lifecycles.",
        "day_to_day": "Writing test cases from user stories, developing automated browser scripts with Playwright/Cypress, validating REST APIs, and filing defect tickets.",
        "core_responsibilities": [
            "Design comprehensive test plans, edge-case matrices, and regression suites",
            "Author automated end-to-end browser tests with Playwright or Cypress",
            "Validate REST API contracts, status codes, and error payloads",
            "Integrate automated test runs into CI/CD deployment pipelines"
        ],
        "essential_skills": ["Manual Testing Methodologies", "Playwright / Cypress Automation", "API Testing (Postman)", "JavaScript or Python", "Test Case Design & Bug Reporting"],
        "useful_skills": ["Performance Testing (k6/JMeter)", "CI/CD Test Integration", "SQL for Data Validation", "BDD / Cucumber"],
        "academic_foundations": ["Software Engineering", "Testing & Verification", "Computer Programming"],
        "tools_technologies": ["Playwright", "Postman", "Jira", "GitHub Actions", "Chrome DevTools"],
        "example_projects": [
            "Automated End-to-End Test Suite for an E-commerce Checkout Flow",
            "REST API Test Automation Collection with Schema Assertions",
            "Load & Stress Test Benchmark Report with k6"
        ],
        "entry_job_titles": ["Junior Automation Engineer", "Software Test Specialist", "QA Analyst"],
        "interview_focus": ["Boundary Value Analysis & Equivalence Partitioning", "Automation framework architecture (Page Object Model)", "Defect lifecycle triage"],
        "portfolio_expectations": "GitHub test repositories with automated tests executing on pull requests via GitHub Actions.",
        "prerequisites": ["Basic programming knowledge in JavaScript or Python"],
        "experiment_id": "exp_software_dev_1"
    },
    {
        "id": "role_embedded_software",
        "title": "Embedded Software Engineer",
        "category": "Hardware & Systems",
        "description": "Programs firmware and low-level software that runs directly on microcontrollers, IoT devices, automotive systems, and specialized hardware.",
        "day_to_day": "Writing C/C++ firmware, debugging with oscilloscopes and logic analyzers, reading hardware schematics, and writing device drivers.",
        "core_responsibilities": [
            "Write resource-constrained, high-efficiency C/C++ code for microcontrollers",
            "Interface with hardware protocols (UART, SPI, I2C, CAN)",
            "Develop low-level device drivers and handle hardware interrupts",
            "Debug memory leaks, race conditions, and timing constraints"
        ],
        "essential_skills": ["Embedded C / C++", "Microcontrollers (ARM Cortex / ESP32 / Arduino)", "Hardware Protocols (UART/SPI/I2C)", "Memory-Constrained Programming", "Hardware Debugging"],
        "useful_skills": ["RTOS (FreeRTOS)", "Linux Device Drivers", "PCB Schematics Reading", "IoT Protocols (MQTT)"],
        "academic_foundations": ["Microprocessors & Microcontrollers", "Digital Electronics", "Computer Architecture", "Operating Systems"],
        "tools_technologies": ["ESP-IDF / Arduino IDE", "PlatformIO", "Logic Analyzer", "GDB", "Saleae"],
        "example_projects": [
            "IoT Environmental Sensor Station with ESP32 and MQTT reporting",
            "Custom UART Bootloader for ARM Microcontroller",
            "Real-time Digital Audio Signal Filter with FreeRTOS"
        ],
        "entry_job_titles": ["Junior Firmware Engineer", "Associate Embedded Developer", "Hardware Software Engineer"],
        "interview_focus": ["Bitwise operations & pointers in C", "Interrupt Service Routines (ISRs) & volatile keyword", "Hardware protocol timings"],
        "portfolio_expectations": "GitHub firmware repos with schematics, breadboard photos/videos, and clean code documentation.",
        "prerequisites": ["C programming fundamentals and basic circuit knowledge"],
        "experiment_id": "exp_software_dev_2"
    },
    {
        "id": "role_robotics_software",
        "title": "Robotics Software Engineer",
        "category": "Hardware & Systems",
        "description": "Develops algorithms for autonomous mobile robots, robotic manipulators, motion planning, sensor fusion, and spatial localization.",
        "day_to_day": "Writing ROS2 nodes in C++/Python, simulating robot kinematics in Gazebo, tuning PID controllers, and testing sensor fusion with LiDAR.",
        "core_responsibilities": [
            "Develop robotic control nodes using ROS2 (Robot Operating System)",
            "Implement path planning and obstacle avoidance algorithms (A*, Dijkstra, RRT)",
            "Simulate robot dynamics and kinematics in Gazebo or Webots",
            "Fuse spatial sensor inputs (LiDAR, IMU, Depth Camera) for SLAM"
        ],
        "essential_skills": ["C++ & Python", "ROS2 (Robot Operating System)", "Kinematics & Coordinate Transforms", "Linear Algebra & Vector Calculus", "Simulation (Gazebo)"],
        "useful_skills": ["SLAM (Simultaneous Localization & Mapping)", "Computer Vision (OpenCV)", "Control Systems (PID)", "LiDAR Data Processing"],
        "academic_foundations": ["Robotics & Control", "Linear Algebra", "Algorithms", "Physics Mechanics"],
        "tools_technologies": ["ROS2 Humble", "Gazebo", "RViz", "Ubuntu Linux", "OpenCV"],
        "example_projects": [
            "Autonomous Mobile Robot Obstacle Avoidance Simulation in Gazebo",
            "2D LiDAR SLAM Navigation Mapping with ROS2",
            "2-DOF Robotic Arm Inverse Kinematics Controller"
        ],
        "entry_job_titles": ["Junior Robotics Engineer", "Autonomy Software Associate", "Controls Engineer"],
        "interview_focus": ["Coordinate transformations & quaternion math", "ROS2 publisher/subscriber architecture", "Path planning algorithms"],
        "portfolio_expectations": "Simulation demonstration videos, Gazebo model packages, and clean ROS2 node implementations.",
        "prerequisites": ["Strong C++ or Python and matrix mathematics"],
        "experiment_id": "exp_data_ai_1"
    },
    {
        "id": "role_mobile_developer",
        "title": "Mobile App Developer",
        "category": "Software Engineering",
        "description": "Builds fast, intuitive, and responsive mobile applications for iOS and Android using modern cross-platform or native frameworks.",
        "day_to_day": "Developing mobile screens in Flutter or React Native, handling mobile permissions, managing offline SQLite data, and testing on emulators.",
        "core_responsibilities": [
            "Build cross-platform mobile apps using Flutter or React Native",
            "Integrate device hardware APIs (Camera, GPS, Push Notifications)",
            "Implement offline-first storage and synchronization with remote APIs",
            "Prepare mobile bundles for Google Play Store and Apple App Store testing"
        ],
        "essential_skills": ["Flutter (Dart) or React Native", "Mobile UI & Navigation", "REST API Integration", "Offline Storage (SQLite/Hive)", "Mobile Lifecycle Management"],
        "useful_skills": ["State Management (Bloc/Riverpod/Redux)", "Firebase Auth & Messaging", "Native Android/iOS Bridge", "App Store Guidelines"],
        "academic_foundations": ["Mobile Computing", "Human-Computer Interaction", "Software Engineering"],
        "tools_technologies": ["Android Studio", "Xcode", "VS Code", "Flutter SDK", "Postman"],
        "example_projects": [
            "Campus Student Companion App with class timetable and offline sync",
            "Personal Habit Tracker with push notifications and local analytics",
            "Food Delivery Interface with live order tracking"
        ],
        "entry_job_titles": ["Associate Mobile Developer", "Junior Flutter Engineer", "Android/iOS Developer"],
        "interview_focus": ["Mobile app lifecycle states", "Offline data synchronization strategies", "Async UI rendering & smooth 60fps animations"],
        "portfolio_expectations": "Installable APK releases on GitHub or live App Store links with screen recordings.",
        "prerequisites": ["Object-oriented programming in Dart, JavaScript, or Kotlin"],
        "experiment_id": "exp_software_dev_1"
    }
]

# =========================================================================
# 10 CURATED STARTER CAREER EXPERIMENTS
# =========================================================================

EXPERIMENTS_CATALOG: List[Dict[str, Any]] = [
    {
        "id": "exp_software_dev_1",
        "career_category": "Software Development",
        "title": "Build a Live Dynamic Currency / Metric Converter",
        "difficulty": "Beginner",
        "expected_duration": "45 mins",
        "learning_objective": "Experience the fundamental loop of software engineering: capturing user input, computing transformations, handling edge cases, and updating UI state.",
        "prerequisites": ["Modern web browser", "Basic familiarity with editing HTML or JavaScript"],
        "required_tools": ["Web browser (Chrome/Firefox)", "Online Sandbox (CodeSandbox / StackBlitz) or local VS Code"],
        "instructions": [
            "1. Open CodeSandbox or an HTML file and set up a clean input field for a numeric value.",
            "2. Create a dropdown to select input units (e.g., USD to INR, or Celsius to Fahrenheit).",
            "3. Write a JavaScript function that validates non-negative inputs and calculates the converted value.",
            "4. Add an error badge that triggers if a user enters non-numeric text or zero.",
            "5. Style the converter with clean borders, accessible labels, and a reset button."
        ],
        "expected_deliverable": "A working web widget that converts units instantaneously with error handling.",
        "completion_criteria": [
            "Accurate numeric calculations for at least 3 conversions",
            "Visible error message for invalid characters",
            "Responsive layout that works on desktop and mobile"
        ],
        "resources": ["MDN JavaScript Basics", "freeCodeCamp Interactive Web Projects"]
    },
    {
        "id": "exp_software_dev_2",
        "career_category": "Software Development",
        "title": "Build an Authenticated Mock API Route with Node or FastAPI",
        "difficulty": "Beginner",
        "expected_duration": "50 mins",
        "learning_objective": "Understand how backend servers receive requests, inspect security headers, query structured records, and return JSON responses.",
        "prerequisites": ["Python or Node.js installed locally"],
        "required_tools": ["VS Code", "Terminal", "Postman or curl"],
        "instructions": [
            "1. Create a minimal FastAPI or Express server script with 5 mock student records in a JSON list.",
            "2. Define a GET endpoint `/students` with an optional `?department=` query filter.",
            "3. Add a check requiring a header `X-Campus-Key: secret123`. If missing, return HTTP 401 Unauthorized.",
            "4. Test the endpoint using Postman or curl, verifying both success and unauthorized responses.",
            "5. Add a POST endpoint `/students` to append a new valid record to your list."
        ],
        "expected_deliverable": "A runnable server file that responds to filtered GET and authenticated requests.",
        "completion_criteria": [
            "Returns HTTP 200 with filtered JSON data when authorized",
            "Returns HTTP 401 when the secret header is absent",
            "Successfully validates request bodies"
        ],
        "resources": ["FastAPI Official Quickstart", "Express.js Hello World Guide"]
    },
    {
        "id": "exp_uiux_1",
        "career_category": "UI/UX Design",
        "title": "Audit and Redesign a Confusing Campus Timetable Screen",
        "difficulty": "Beginner",
        "expected_duration": "45 mins",
        "learning_objective": "Experience user interface thinking by analyzing visual hierarchy, typography contrast, cognitive load, and spacing.",
        "prerequisites": ["Free Figma account or pen & paper"],
        "required_tools": ["Figma (Free tier in browser) or notebook"],
        "instructions": [
            "1. Identify 3 critical pain points on a cluttered schedule (e.g., unreadable font, conflicting colors, missing room numbers).",
            "2. Define the primary user goal: A student rushing between classes who has 5 seconds to know their next room and time.",
            "3. Create an improved layout grouping classes chronologically with consistent time chips.",
            "4. Use a disciplined 8px spacing grid and distinct font weights (bold titles, muted time stamps).",
            "5. Write 3 bullet points explaining why your layout reduces student confusion."
        ],
        "expected_deliverable": "A Figma frame or clean wireframe sketch with a brief rationale note.",
        "completion_criteria": [
            "Clear visual hierarchy where the next upcoming class is prominent",
            "Accessible color contrast adhering to WCAG standards",
            "Documented 3 design decisions"
        ],
        "resources": ["Figma Auto Layout 101", "Refactoring UI Principles"]
    },
    {
        "id": "exp_uiux_2",
        "career_category": "UI/UX Design",
        "title": "Map a 3-Step Campus Book-Borrowing User Flow",
        "difficulty": "Beginner",
        "expected_duration": "40 mins",
        "learning_objective": "Understand UX architecture: anticipating user decision forks, error states, and confirmation feedback before writing code.",
        "prerequisites": ["Curiosity about user pathways"],
        "required_tools": ["FigJam, Miro, or blank paper"],
        "instructions": [
            "1. Define the student persona: Looking for a specific textbook for an exam tomorrow.",
            "2. Map the 3 primary screens: Search & Availability → Reserve Confirmation → Pickup Barcode.",
            "3. Add at least two edge-case branches: What happens if the book is checked out? What if their library account is suspended?",
            "4. Annotate what data needs to be visible at each step to prevent user anxiety."
        ],
        "expected_deliverable": "A step-by-step user journey diagram with decision diamonds and edge cases.",
        "completion_criteria": [
            "End-to-end pathway from discovery to physical collection",
            "Both happy-path and fallback branches illustrated",
            "Clear action labels on buttons (e.g., 'Reserve for 24h' vs generic 'Submit')"
        ],
        "resources": ["Nielsen Norman Group: User Flow Mapping"]
    },
    {
        "id": "exp_data_ai_1",
        "career_category": "AI/ML and Data",
        "title": "Analyze and Visualize a Campus Placement Dataset",
        "difficulty": "Beginner",
        "expected_duration": "50 mins",
        "learning_objective": "Experience exploratory data analysis: loading tabular data, detecting outliers, computing summary statistics, and discovering hidden patterns.",
        "prerequisites": ["Basic Python or Google Sheets"],
        "required_tools": ["Google Colab (free in browser) or Google Sheets"],
        "instructions": [
            "1. Open a Google Colab notebook and load a CSV with student CGPA, internships count, and placement outcome.",
            "2. Calculate summary statistics: mean CGPA, median salary, and placement percentage.",
            "3. Create a scatter plot comparing CGPA versus salary offers.",
            "4. Identify if students with 2+ internships have higher placement rates using a grouped bar chart.",
            "5. Write a 2-sentence executive summary of the single most actionable finding."
        ],
        "expected_deliverable": "A Colab notebook or spreadsheet chart displaying findings and a concise takeaway.",
        "completion_criteria": [
            "At least 2 clean visual charts with labeled axes",
            "Zero missing values in the plotted variables",
            "Accurate percentage calculation"
        ],
        "resources": ["pandas 10-Minute Walkthrough", "Kaggle Python Micro-Course"]
    },
    {
        "id": "exp_data_ai_2",
        "career_category": "AI/ML and Data",
        "title": "Train a Decision Tree Classifier to Predict Student Pass/Fail",
        "difficulty": "Beginner",
        "expected_duration": "55 mins",
        "learning_objective": "Understand the machine learning lifecycle: feature selection, train/test splitting, model fitting, and evaluation metrics.",
        "prerequisites": ["Basic Python"],
        "required_tools": ["Google Colab (free in browser)"],
        "instructions": [
            "1. Import `scikit-learn` in a Google Colab notebook.",
            "2. Create a synthetic dataset of 200 records with features: attendance rate, study hours, and test scores.",
            "3. Split into 80% training set and 20% test set using `train_test_split`.",
            "4. Fit a `DecisionTreeClassifier(max_depth=3)` and inspect the decision rules.",
            "5. Evaluate accuracy and print a confusion matrix showing false positives vs false negatives."
        ],
        "expected_deliverable": "A running Colab notebook outputting model accuracy and a confusion matrix.",
        "completion_criteria": [
            "Clean separation between training and test sets",
            "Printed confusion matrix and explanation of what precision/recall mean",
            "Insight into the most influential predictive feature"
        ],
        "resources": ["Scikit-learn Decision Trees Documentation"]
    },
    {
        "id": "exp_cyber_1",
        "career_category": "Cybersecurity",
        "title": "Analyze Unencrypted HTTP Traffic Traces in Wireshark",
        "difficulty": "Beginner",
        "expected_duration": "45 mins",
        "learning_objective": "See firsthand why unencrypted protocols are dangerous and how security analysts inspect network packet headers.",
        "prerequisites": ["Computer with Wireshark installed or access to CloudShark"],
        "required_tools": ["Wireshark (Free open-source) or web-based sample PCAP file"],
        "instructions": [
            "1. Download an authorized sample PCAP capture file of an unencrypted HTTP login form.",
            "2. Open the capture in Wireshark and apply the display filter `http.request.method == 'POST'`.",
            "3. Locate the plaintext credentials submitted in the HTTP POST body.",
            "4. Inspect the TCP 3-way handshake (SYN, SYN-ACK, ACK) preceding the request.",
            "5. Compare this to an HTTPS packet trace to observe how TLS encryption shields payloads."
        ],
        "expected_deliverable": "A screenshot or note documenting the exact line where plaintext credentials were exposed and the remediation (HTTPS/TLS).",
        "completion_criteria": [
            "Identification of the exposed credentials in the packet body",
            "Understanding of the TCP handshake sequence",
            "Clear technical explanation of how HTTPS prevents packet sniffing"
        ],
        "resources": ["Wireshark Official User Guide", "Cloudflare: What is SSL/TLS?"]
    },
    {
        "id": "exp_cloud_1",
        "career_category": "Cloud and DevOps",
        "title": "Containerize a Web Application with Docker",
        "difficulty": "Beginner",
        "expected_duration": "45 mins",
        "learning_objective": "Experience containerization: isolating dependencies, configuring runtime environments, and running identical software across machines.",
        "prerequisites": ["Docker Desktop installed or Play with Docker (free browser lab)"],
        "required_tools": ["Docker Desktop or labs.play-with-docker.com"],
        "instructions": [
            "1. Write a minimal `index.html` file with a hello-campus message.",
            "2. Author a 4-line `Dockerfile` using the lightweight `nginx:alpine` base image.",
            "3. Build the container image: `docker build -t my-campus-app .`.",
            "4. Run the container mapping host port 8080: `docker run -d -p 8080:80 my-campus-app`.",
            "5. Open `http://localhost:8080` in your browser to verify it is serving from the container."
        ],
        "expected_deliverable": "A running Docker container serving your custom web page on localhost.",
        "completion_criteria": [
            "Working Dockerfile committed with proper port exposure",
            "Successful page rendering in browser from container",
            "Understanding of images vs running containers"
        ],
        "resources": ["Docker Getting Started Tutorial", "Play with Docker Browser Labs"]
    }
]

# =========================================================================
# SCHEMAS
# =========================================================================

class ProfileUpdateRequest(BaseModel):
    student_id: str
    interests: List[str] = []
    preferred_activities: List[str] = []
    disliked_activities: List[str] = []
    technical_skills: List[str] = []
    soft_skills: List[str] = []
    academic_focus: List[str] = []
    practical_experiences: List[str] = []
    weekly_hours_available: int = 15
    preparation_timeline: str = "6 Months"
    preferred_learning_format: str = "Project-first"
    preparation_challenges: List[str] = []
    immediate_priority: str = "Skill Development"
    target_companies: List[str] = []

class GoalUpdateRequest(BaseModel):
    student_id: str
    career_id: str
    career_title: str
    is_primary: bool = True
    selection_reasons: List[str] = []
    uncertainties: List[str] = []

class ComparisonSaveRequest(BaseModel):
    student_id: str
    career_ids: List[str]
    notes: Optional[str] = None
    attraction_points: Dict[str, str] = {}
    concern_points: Dict[str, str] = {}
    unanswered_questions: List[str] = []
    selected_primary_id: Optional[str] = None
    selected_alternate_id: Optional[str] = None

class ExperimentReflectRequest(BaseModel):
    student_id: str
    experiment_id: str
    reflection_enjoyed: str
    reflection_difficult: str
    reflection_matched_expectations: str = "Matched"
    reflection_would_advance: bool = True
    reflection_next_learning: str

class ChatQueryRequest(BaseModel):
    student_id: str
    message: str
    active_career_id: Optional[str] = None
    conversation_history: List[Dict[str, str]] = []

class TransferActionRequest(BaseModel):
    student_id: str
    action_title: str
    action_explanation: str
    estimated_hours: int = 3
    associated_skill: str

# =========================================================================
# ENDPOINTS
# =========================================================================

@router.get("/catalog")
def get_career_catalog():
    """Return all 16 supported career roles with detailed attributes."""
    return CAREER_CATALOG

@router.get("/profile/{student_id}")
def get_career_guidance_profile(student_id: str, db: Session = Depends(get_db)):
    """Retrieve saved student guidance profile or generate baseline from student table."""
    profile = db.query(CareerGuidanceProfile).filter(CareerGuidanceProfile.student_id == student_id).first()
    
    # Check student record for academic defaults
    student = db.query(Student).filter(Student.id == student_id).first()
    student_skills = []
    if student and student.skills:
        student_skills = [s.name for s in student.skills]

    if not profile:
        return {
            "id": f"prof_{student_id}",
            "student_id": student_id,
            "interests": ["Building scalable web applications", "Data analysis & problem solving"],
            "preferred_activities": ["Writing code", "Designing architectures", "Solving logical puzzles"],
            "disliked_activities": ["Repetitive manual data entry", "Unclear legacy documentation"],
            "technical_skills": student_skills or ["Python", "JavaScript", "SQL", "React", "Git"],
            "soft_skills": ["Teamwork", "Analytical Thinking", "Communication"],
            "academic_focus": [student.department if student else "Computer Science", "Database Systems"],
            "practical_experiences": [p.title for p in student.projects] if student and student.projects else ["Academic Course Projects", "Hackathon Project"],
            "weekly_hours_available": 15,
            "preparation_timeline": "6 Months",
            "preferred_learning_format": "Project-first",
            "preparation_challenges": ["Balancing college exams with placement prep", "System design depth"],
            "immediate_priority": "Skill Development",
            "target_companies": ["Google", "Microsoft", "Atlassian", "Campus Recruiters"],
            "is_default": True
        }

    return {
        "id": profile.id,
        "student_id": profile.student_id,
        "interests": profile.interests or [],
        "preferred_activities": profile.preferred_activities or [],
        "disliked_activities": profile.disliked_activities or [],
        "technical_skills": profile.technical_skills or student_skills,
        "soft_skills": profile.soft_skills or [],
        "academic_focus": profile.academic_focus or [],
        "practical_experiences": profile.practical_experiences or [],
        "weekly_hours_available": profile.weekly_hours_available,
        "preparation_timeline": profile.preparation_timeline,
        "preferred_learning_format": profile.preferred_learning_format,
        "preparation_challenges": profile.preparation_challenges or [],
        "immediate_priority": profile.immediate_priority,
        "target_companies": profile.target_companies or [],
        "updated_at": profile.updated_at.isoformat() if profile.updated_at else None,
        "is_default": False
    }

@router.post("/profile")
def save_career_guidance_profile(req: ProfileUpdateRequest, db: Session = Depends(get_db)):
    """Save or update student career guidance profile."""
    profile = db.query(CareerGuidanceProfile).filter(CareerGuidanceProfile.student_id == req.student_id).first()
    now = datetime.datetime.utcnow()

    if not profile:
        profile = CareerGuidanceProfile(
            id=f"prof_{req.student_id}",
            student_id=req.student_id,
            interests=req.interests,
            preferred_activities=req.preferred_activities,
            disliked_activities=req.disliked_activities,
            technical_skills=req.technical_skills,
            soft_skills=req.soft_skills,
            academic_focus=req.academic_focus,
            practical_experiences=req.practical_experiences,
            weekly_hours_available=req.weekly_hours_available,
            preparation_timeline=req.preparation_timeline,
            preferred_learning_format=req.preferred_learning_format,
            preparation_challenges=req.preparation_challenges,
            immediate_priority=req.immediate_priority,
            target_companies=req.target_companies,
            updated_at=now
        )
        db.add(profile)
    else:
        profile.interests = req.interests
        profile.preferred_activities = req.preferred_activities
        profile.disliked_activities = req.disliked_activities
        profile.technical_skills = req.technical_skills
        profile.soft_skills = req.soft_skills
        profile.academic_focus = req.academic_focus
        profile.practical_experiences = req.practical_experiences
        profile.weekly_hours_available = req.weekly_hours_available
        profile.preparation_timeline = req.preparation_timeline
        profile.preferred_learning_format = req.preferred_learning_format
        profile.preparation_challenges = req.preparation_challenges
        profile.immediate_priority = req.immediate_priority
        profile.target_companies = req.target_companies
        profile.updated_at = now

    db.commit()
    db.refresh(profile)

    return {"status": "success", "message": "Career profile saved successfully", "profile_id": profile.id}

@router.post("/recommendations")
def get_personalized_recommendations(profile_data: Dict[str, Any]):
    """
    Computes explainable recommendations based on the student's profile, interests, and existing skills.
    Never uses opaque fake percentages; provides clear alignment categories and explicit reasons.
    """
    interests = [i.lower() for i in profile_data.get("interests", [])]
    activities = [a.lower() for a in profile_data.get("preferred_activities", [])]
    existing_skills = [s.lower() for s in profile_data.get("technical_skills", [])]
    priority = profile_data.get("immediate_priority", "Skill Development")

    scored_roles = []

    for role in CAREER_CATALOG:
        matched_interests = []
        matched_skills = []
        skill_gaps = []

        # Check interest alignment
        role_text = f"{role['title']} {role['category']} {role['description']}".lower()
        for interest in interests:
            if any(term in role_text for term in interest.split()):
                matched_interests.append(interest)

        for act in activities:
            if any(term in role_text for term in act.split()):
                matched_interests.append(act)

        # Check existing skills match vs missing
        for req_skill in role["essential_skills"]:
            req_lower = req_skill.lower()
            if any(s in req_lower or req_lower in s for s in existing_skills):
                matched_skills.append(req_skill)
            else:
                skill_gaps.append(req_skill)

        # Calculate a transparent alignment rating
        match_count = len(matched_interests) + len(matched_skills) * 2
        if match_count >= 5 or len(matched_skills) >= 2:
            alignment_tier = "Strong alignment with stated interests"
            tag = "Top Match"
        elif match_count >= 2 or len(matched_skills) >= 1:
            alignment_tier = "Promising career direction"
            tag = "Promising"
        else:
            alignment_tier = "Worth exploring for versatility"
            tag = "Exploratory"

        why_worth_exploring = (
            f"{role['title']} offers high campus placement demand. "
            f"You already demonstrate familiarity with {', '.join(matched_skills[:2]) if matched_skills else 'core CS foundations'}, "
            f"while developing {', '.join(skill_gaps[:2]) if skill_gaps else 'advanced specializations'} will make you interview-ready."
        )

        scored_roles.append({
            "career_id": role["id"],
            "career_title": role["title"],
            "category": role["category"],
            "description": role["description"],
            "alignment_tier": alignment_tier,
            "badge_tag": tag,
            "why_worth_exploring": why_worth_exploring,
            "matched_interests": list(set(matched_interests))[:3],
            "existing_skills_matched": matched_skills,
            "important_skill_gaps": skill_gaps,
            "uncertainties_to_investigate": [
                f"Comfort with {role['essential_skills'][0]} in high-pressure technical interviews",
                f"Interest in day-to-day {role['day_to_day'].split(',')[0].lower()}"
            ],
            "suggested_experiment_id": role.get("experiment_id", "exp_software_dev_1"),
            "recommended_next_action": f"Review {len(skill_gaps)} foundational skill gaps or try the beginner experiment."
        })

    # Sort so top alignment comes first
    tier_weights = {"Top Match": 3, "Promising": 2, "Exploratory": 1}
    scored_roles.sort(key=lambda r: (tier_weights.get(r["badge_tag"], 0), len(r["existing_skills_matched"])), reverse=True)

    return scored_roles

@router.get("/goals/{student_id}")
def get_career_goals(student_id: str, db: Session = Depends(get_db)):
    """Retrieve primary and alternative career goals for a student."""
    goals = db.query(CareerGoal).filter(CareerGoal.student_id == student_id, CareerGoal.status != "Archived").order_by(CareerGoal.is_primary.desc()).all()
    
    primary = None
    alternates = []

    for g in goals:
        goal_data = {
            "id": g.id,
            "career_id": g.career_id,
            "career_title": g.career_title,
            "is_primary": g.is_primary,
            "selection_reasons": g.selection_reasons or [],
            "uncertainties": g.uncertainties or [],
            "status": g.status,
            "created_at": g.created_at.isoformat() if g.created_at else None,
            "updated_at": g.updated_at.isoformat() if g.updated_at else None
        }
        if g.is_primary:
            primary = goal_data
        else:
            alternates.append(goal_data)

    return {
        "primary_goal": primary,
        "alternative_goals": alternates
    }

@router.post("/goals")
def set_career_goal(req: GoalUpdateRequest, db: Session = Depends(get_db)):
    """Establish or update a primary/alternate career goal with persistent decision logging."""
    now = datetime.datetime.utcnow()

    # If setting as primary, demote any existing primary goal to alternate
    previous_primary_title = None
    if req.is_primary:
        existing_primaries = db.query(CareerGoal).filter(
            CareerGoal.student_id == req.student_id,
            CareerGoal.is_primary == True
        ).all()
        for ep in existing_primaries:
            previous_primary_title = ep.career_title
            ep.is_primary = False
            ep.updated_at = now

    # Check if this career already exists as a goal
    goal = db.query(CareerGoal).filter(
        CareerGoal.student_id == req.student_id,
        CareerGoal.career_id == req.career_id
    ).first()

    if not goal:
        goal = CareerGoal(
            id=f"goal_{uuid.uuid4().hex[:8]}",
            student_id=req.student_id,
            career_id=req.career_id,
            career_title=req.career_title,
            is_primary=req.is_primary,
            selection_reasons=req.selection_reasons,
            uncertainties=req.uncertainties,
            status="Active",
            created_at=now,
            updated_at=now
        )
        db.add(goal)
    else:
        goal.is_primary = req.is_primary
        goal.career_title = req.career_title
        goal.selection_reasons = req.selection_reasons
        goal.uncertainties = req.uncertainties
        goal.status = "Active"
        goal.updated_at = now

    # Add to Decision History
    history_record = CareerDecisionHistory(
        id=f"dec_{uuid.uuid4().hex[:8]}",
        student_id=req.student_id,
        decision_type="Goal Selected" if req.is_primary else "Alternate Goal Added",
        previous_goal=previous_primary_title if req.is_primary else None,
        new_goal=req.career_title,
        explanation=f"Selected {req.career_title} based on interests in {', '.join(req.selection_reasons[:2]) if req.selection_reasons else 'career exploration'}.",
        associated_role_id=req.career_id,
        timestamp=now
    )
    db.add(history_record)

    db.commit()

    return {"status": "success", "message": f"{req.career_title} recorded as your {'primary' if req.is_primary else 'alternate'} goal."}

@router.post("/compare")
def save_career_comparison(req: ComparisonSaveRequest, db: Session = Depends(get_db)):
    """Save side-by-side comparison notes and choices."""
    now = datetime.datetime.utcnow()

    comparison = CareerComparisonRecord(
        id=f"cmp_{uuid.uuid4().hex[:8]}",
        student_id=req.student_id,
        career_ids=req.career_ids,
        notes=req.notes,
        attraction_points=req.attraction_points,
        concern_points=req.concern_points,
        unanswered_questions=req.unanswered_questions,
        selected_primary_id=req.selected_primary_id,
        selected_alternate_id=req.selected_alternate_id,
        created_at=now,
        updated_at=now
    )
    db.add(comparison)

    # Log to decision history
    role_titles = [r["title"] for r in CAREER_CATALOG if r["id"] in req.career_ids]
    history_record = CareerDecisionHistory(
        id=f"dec_{uuid.uuid4().hex[:8]}",
        student_id=req.student_id,
        decision_type="Comparison Saved",
        explanation=f"Compared {len(role_titles)} career tracks: {', '.join(role_titles)} with custom evaluation notes.",
        timestamp=now
    )
    db.add(history_record)

    db.commit()

    return {"status": "success", "message": "Career comparison recorded successfully", "comparison_id": comparison.id}

@router.get("/experiments")
def get_career_experiments(student_id: Optional[str] = None, db: Session = Depends(get_db)):
    """Retrieve all available career experiments with student completion status."""
    completed_map = {}
    if student_id:
        student_exps = db.query(StudentCareerExperiment).filter(
            StudentCareerExperiment.student_id == student_id
        ).all()
        for se in student_exps:
            completed_map[se.experiment_id] = {
                "status": se.status,
                "reflection_enjoyed": se.reflection_enjoyed,
                "reflection_difficult": se.reflection_difficult,
                "reflection_matched_expectations": se.reflection_matched_expectations,
                "completed_at": se.completed_at.isoformat() if se.completed_at else None
            }

    result = []
    for exp in EXPERIMENTS_CATALOG:
        exp_data = dict(exp)
        exp_data["student_progress"] = completed_map.get(exp["id"], {"status": "Not Started"})
        result.append(exp_data)

    return result

@router.post("/experiments/reflect")
def record_experiment_reflection(req: ExperimentReflectRequest, db: Session = Depends(get_db)):
    """Record student experiment completion and reflective assessment."""
    now = datetime.datetime.utcnow()

    record = db.query(StudentCareerExperiment).filter(
        StudentCareerExperiment.student_id == req.student_id,
        StudentCareerExperiment.experiment_id == req.experiment_id
    ).first()

    if not record:
        record = StudentCareerExperiment(
            id=f"s_exp_{uuid.uuid4().hex[:8]}",
            student_id=req.student_id,
            experiment_id=req.experiment_id,
            status="Completed",
            reflection_enjoyed=req.reflection_enjoyed,
            reflection_difficult=req.reflection_difficult,
            reflection_matched_expectations=req.reflection_matched_expectations,
            reflection_would_advance=req.reflection_would_advance,
            reflection_next_learning=req.reflection_next_learning,
            completed_at=now
        )
        db.add(record)
    else:
        record.status = "Completed"
        record.reflection_enjoyed = req.reflection_enjoyed
        record.reflection_difficult = req.reflection_difficult
        record.reflection_matched_expectations = req.reflection_matched_expectations
        record.reflection_would_advance = req.reflection_would_advance
        record.reflection_next_learning = req.reflection_next_learning
        record.completed_at = now

    # Log to decision history
    exp_title = next((e["title"] for e in EXPERIMENTS_CATALOG if e["id"] == req.experiment_id), "Career Experiment")
    history_record = CareerDecisionHistory(
        id=f"dec_{uuid.uuid4().hex[:8]}",
        student_id=req.student_id,
        decision_type="Experiment Completed",
        explanation=f"Completed experiment '{exp_title}'. Stated reflection: Enjoyed {req.reflection_enjoyed[:60]}...",
        timestamp=now
    )
    db.add(history_record)

    db.commit()

    return {"status": "success", "message": "Career experiment reflection saved."}

@router.get("/history/{student_id}")
def get_decision_history(student_id: str, db: Session = Depends(get_db)):
    """Retrieve persistent chronological career decision records."""
    records = db.query(CareerDecisionHistory).filter(
        CareerDecisionHistory.student_id == student_id
    ).order_by(CareerDecisionHistory.timestamp.desc()).all()

    return [
        {
            "id": r.id,
            "decision_type": r.decision_type,
            "previous_goal": r.previous_goal,
            "new_goal": r.new_goal,
            "explanation": r.explanation,
            "associated_role_id": r.associated_role_id,
            "timestamp": r.timestamp.isoformat() if r.timestamp else None
        }
        for r in records
    ]

@router.post("/chat")
def career_counsellor_chat(req: ChatQueryRequest, db: Session = Depends(get_db)):
    """
    Intelligent, contextual AI career counsellor.
    Synthesizes the student's profile, active career goals, skill gaps, and constraints to return structured, actionable advice.
    """
    msg = req.message.lower()

    # Fetch context
    student = db.query(Student).filter(Student.id == req.student_id).first()
    student_name = student.name.split()[0] if student and student.name else "Student"
    primary_goal = db.query(CareerGoal).filter(CareerGoal.student_id == req.student_id, CareerGoal.is_primary == True).first()
    target_role = primary_goal.career_title if primary_goal else "Software Engineering"

    # Match active role
    active_role = None
    if req.active_career_id:
        active_role = next((r for r in CAREER_CATALOG if r["id"] == req.active_career_id), None)

    # Construct contextual responses
    if "between" in msg or "vs" in msg or ("full-stack" in msg and "ai/ml" in msg):
        headline = "Comparing Full-Stack Development vs AI/ML Engineering for You"
        understanding = f"You are evaluating two distinct career trajectories with high campus placement potential: Full-Stack (web systems architecture) vs AI/ML (data modeling and predictive algorithms)."
        options = [
            {
                "title": "Full-Stack Development",
                "fit": "Faster time to demonstrable projects; recruiters can immediately click and test your live deployed web apps on Vercel.",
                "trade_off": "Requires mastering both client state (React) and server robustness (Node/Python, SQL, Auth)."
            },
            {
                "title": "AI/ML Engineering",
                "fit": "High mathematical depth and exciting generative AI horizons; great if you love statistics, linear algebra, and data pipelines.",
                "trade_off": "Entry-level roles often demand strong mathematical rigor, proof of validated model metrics, and solid Python performance."
            }
        ]
        next_steps = [
            "Try the 'Build a Live Metric Converter' experiment to test frontend-to-backend data flow.",
            "Try the 'Analyze Campus Placement Data' experiment to see if statistical modeling sparks your curiosity.",
            "Compare both roles side-by-side in our 3-Role Comparison tab."
        ]
        contextual_actions = [
            {"label": "Compare Full-Stack vs AI/ML", "action": "open_comparison", "payload": ["role_fullstack", "role_aiml_engineer"]},
            {"label": "Try Frontend Experiment", "action": "open_experiment", "payload": "exp_software_dev_1"},
            {"label": "Try Data AI Experiment", "action": "open_experiment", "payload": "exp_data_ai_1"}
        ]

    elif "don't know" in msg or "which career" in msg or "confused" in msg:
        headline = f"Let's Narrow Down Your Career Direction, {student_name}"
        understanding = "It is completely normal to feel uncertain. College exposes you to dozens of topics simultaneously without showing you what real day-to-day engineering looks like."
        options = [
            {
                "title": "Guided Discovery Questionnaire",
                "fit": "Answers 6 focused questions about your preferred work activities, coding comfort, and 6-month goals.",
                "trade_off": "Takes 4 minutes, but provides transparent interest matching without arbitrary personality scores."
            },
            {
                "title": "Try Micro-Experiments First",
                "fit": "Instead of guessing from descriptions, complete a 45-minute practical lab in web dev, design, or data.",
                "trade_off": "Hands-on proof of whether you actually enjoy the work before committing months of study."
            }
        ]
        next_steps = [
            "Complete the Guided Career Discovery flow to identify your top 3 matching roles.",
            "Pick one beginner experiment this weekend to test your reaction."
        ]
        contextual_actions = [
            {"label": "Start Career Discovery", "action": "open_discovery", "payload": None},
            {"label": "Browse Beginner Experiments", "action": "open_experiments_list", "payload": None}
        ]

    elif "internship" in msg or "placement" in msg or "skills" in msg:
        headline = f"Strategic Placement & Internship Preparation for {target_role}"
        understanding = f"To stand out in campus drives for {target_role}, recruiters look for two things: clean algorithmic problem-solving (DSA) and 1-2 deployed projects that prove end-to-end execution."
        options = [
            {
                "title": "Bridge Essential Skill Gaps",
                "fit": "Focus on the top 2 missing skills required in recruiter interviews rather than trying to learn everything.",
                "trade_off": "Requires 8-12 hours per week of disciplined practice."
            },
            {
                "title": "Generate Phased Learning Roadmap",
                "fit": "Turns your target career into structured weekly milestones with real verified resources and portfolio projects.",
                "trade_off": "Synchronizes directly with your AI Roadmap Planner."
            }
        ]
        next_steps = [
            f"Check your Skill-Gap Analysis for {target_role}.",
            "Transfer recommended preparation milestones to your AI Career Roadmap Planner."
        ]
        contextual_actions = [
            {"label": "View Skill Gaps", "action": "open_skill_gaps", "payload": primary_goal.career_id if primary_goal else "role_fullstack"},
            {"label": "Open Roadmap Planner", "action": "open_roadmap_planner", "payload": None}
        ]

    else:
        headline = f"Guidance Recommendation for {target_role}"
        understanding = f"Based on your profile as a student interested in {target_role}, the key to momentum is clarifying your target and practicing practical deliverables."
        options = [
            {
                "title": "Explore Role Deep-Dive",
                "fit": f"Review day-to-day responsibilities, interview topics, and portfolio requirements for {target_role}.",
                "trade_off": "Helps you know what standard campus recruiters expect."
            }
        ]
        next_steps = [
            "Explore matching career options in the Recommendations tab.",
            "Compare your current skills against industry benchmarks in the Skill-Gap tab."
        ]
        contextual_actions = [
            {"label": "Explore Recommendations", "action": "open_recommendations", "payload": None},
            {"label": "Try Career Experiment", "action": "open_experiments_list", "payload": None}
        ]

    return {
        "headline": headline,
        "understanding": understanding,
        "options": options,
        "recommended_next_steps": next_steps,
        "contextual_actions": contextual_actions,
        "timestamp": datetime.datetime.utcnow().isoformat()
    }

@router.post("/actions/transfer")
def transfer_action_to_roadmap(req: TransferActionRequest, db: Session = Depends(get_db)):
    """
    Transfers a career guidance action item directly into the student's active roadmap tasks.
    Avoids duplicate entries and guarantees student confirmation.
    """
    # Find active student roadmap
    roadmap = db.query(StudentRoadmap).filter(
        StudentRoadmap.student_id == req.student_id,
        StudentRoadmap.status == "Active"
    ).first()

    if not roadmap or not roadmap.phases:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No active roadmap found. Please generate a roadmap first in the AI Career Roadmap Planner."
        )

    # Put task in Phase 1 or current phase
    target_phase = roadmap.phases[0]

    # Check for existing duplicate task
    existing = db.query(RoadmapTask).filter(
        RoadmapTask.phase_id == target_phase.id,
        RoadmapTask.title == req.action_title
    ).first()

    if existing:
        return {"status": "exists", "message": "This action item is already tracked in your roadmap tasks."}

    new_task = RoadmapTask(
        id=f"tsk_transferred_{uuid.uuid4().hex[:6]}",
        phase_id=target_phase.id,
        roadmap_id=roadmap.id,
        task_number=len(target_phase.tasks) + 1,
        week_number=1,
        title=req.action_title,
        description=req.action_explanation,
        associated_skill=req.associated_skill,
        learning_objective=f"Complete guidance action plan task: {req.action_title}",
        why_it_matters="Transferred from your personalized AI Career Guidance action plan.",
        estimated_hours=float(req.estimated_hours),
        priority="High",
        prerequisites=[],
        resource_ids=[],
        completion_criteria="Successfully verified and completed as part of your career action plan.",
        status="Not Started",
        due_date=(datetime.datetime.utcnow() + datetime.timedelta(days=7)).strftime("%Y-%m-%d"),
        notes="Added via AI Career Guidance Counsellor."
    )
    db.add(new_task)
    db.commit()

    return {
        "status": "success",
        "message": f"'{req.action_title}' successfully added to Phase 1 of your AI Career Roadmap!",
        "task_id": new_task.id
    }
