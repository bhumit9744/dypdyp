import { CareerRole, CareerExperimentItem } from '../types/guidance';

export const INITIAL_CAREER_ROLES: CareerRole[] = [
  {
    id: 'role_software_engineer',
    title: 'Software Engineer',
    category: 'Software Engineering',
    description: 'Designs, develops, and maintains scalable software systems, algorithms, and backend services that power core enterprise and consumer applications.',
    day_to_day: 'Writing robust code, participating in sprint standups, reviewing pull requests, solving algorithmic bottlenecks, and collaborating with cross-functional teams.',
    core_responsibilities: [
      'Implement high-performance core algorithms and business logic',
      'Write comprehensive unit and integration test suites',
      'Participate in design reviews and system architecture discussions',
      'Debug production issues and optimize memory and CPU performance'
    ],
    essential_skills: ['Data Structures & Algorithms', 'Java / C++ / Python', 'Object-Oriented Design', 'Git & CI/CD', 'System Design Basics'],
    useful_skills: ['SQL & Relational Databases', 'Docker & Linux', 'Design Patterns', 'Concurrency & Threading'],
    academic_foundations: ['Data Structures', 'Algorithms', 'Operating Systems', 'Computer Networks', 'DBMS'],
    tools_technologies: ['Git', 'IntelliJ / VS Code', 'Docker', 'JUnit / PyTest', 'Postman'],
    example_projects: [
      'Distributed Key-Value Store with replication',
      'In-memory Caching Engine with LRU eviction',
      'Algorithmic Trading Backtester'
    ],
    entry_job_titles: ['Associate Software Engineer', 'Graduate Software Engineer', 'Junior Developer'],
    interview_focus: ['DSA Problem Solving (LeetCode Medium)', 'Object-Oriented Architecture', 'Core CS Fundamentals (OS/CN/DBMS)'],
    portfolio_expectations: 'Clean GitHub repositories with passing automated tests, clear READMEs, and algorithm benchmarks.',
    prerequisites: ['Basic Programming in Java, C++, or Python'],
    experiment_id: 'exp_software_dev_1'
  },
  {
    id: 'role_frontend_developer',
    title: 'Frontend Developer',
    category: 'Software Engineering',
    description: 'Crafts responsive, accessible, and high-performance user interfaces and client-side applications using modern JavaScript frameworks.',
    day_to_day: 'Translating UI/UX mockups into interactive components, optimizing web vitals, managing complex client state, and integrating backend REST/GraphQL APIs.',
    core_responsibilities: [
      'Build responsive, pixel-accurate web pages with modern CSS and HTML5',
      'Develop reusable UI components in React, Vue, or Next.js',
      'Manage client state, caching, and optimistic UI updates',
      'Audit web accessibility (WCAG AA) and Core Web Vitals'
    ],
    essential_skills: ['JavaScript (ES6+) & TypeScript', 'React / Next.js', 'HTML5 & Semantic Structure', 'Tailwind CSS / Modern CSS', 'REST / GraphQL Fetching'],
    useful_skills: ['State Management (Zustand/Redux)', 'Performance Profiling', 'Web Vitals', 'Jest & Playwright Testing'],
    academic_foundations: ['Web Technologies', 'Human-Computer Interaction', 'Software Engineering'],
    tools_technologies: ['VS Code', 'Chrome DevTools', 'npm/Vite', 'Figma (Inspect)', 'Vercel / Netlify'],
    example_projects: [
      'Interactive Dashboard with real-time financial charting',
      'E-commerce Storefront with optimistic cart updates',
      'Accessible Markdown Document Editor'
    ],
    entry_job_titles: ['Junior Frontend Developer', 'UI Engineer', 'Frontend Specialist'],
    interview_focus: ['JavaScript event loop & DOM manipulation', 'React Hooks & Component Lifecycle', 'CSS Layouts (Flexbox/Grid) & Web Performance'],
    portfolio_expectations: 'Live deployed web applications on Vercel/Netlify with responsive layouts and accessible controls.',
    prerequisites: ['Basic HTML/CSS and introductory JavaScript'],
    experiment_id: 'exp_software_dev_1'
  },
  {
    id: 'role_backend_developer',
    title: 'Backend Developer',
    category: 'Software Engineering',
    description: 'Architects server-side logic, secure REST and GraphQL APIs, database schemas, and microservice communication pipelines.',
    day_to_day: 'Designing database schemas, implementing API endpoints, writing auth middleware, optimizing SQL queries, and managing background task queues.',
    core_responsibilities: [
      'Develop authenticated, rate-limited REST and gRPC endpoints',
      'Design normalized relational schemas and indexing strategies',
      'Implement caching layers with Redis and message queues with RabbitMQ/Kafka',
      'Secure applications against OWASP vulnerabilities and data leaks'
    ],
    essential_skills: ['Node.js / Python / Go', 'SQL & Database Design (PostgreSQL)', 'RESTful API Architecture', 'Authentication (JWT / OAuth2)', 'Git & Docker'],
    useful_skills: ['Redis Caching', 'Microservices Architecture', 'Message Brokers (Kafka/RabbitMQ)', 'API Gateway & CI/CD'],
    academic_foundations: ['DBMS', 'Operating Systems', 'Computer Networks', 'Information Security'],
    tools_technologies: ['Postman', 'Docker', 'pgAdmin / DBeaver', 'Redis CLI', 'FastAPI / Express'],
    example_projects: [
      'Role-Based Access Control (RBAC) API with JWT and refresh tokens',
      'Real-time Notification Service with WebSockets and Redis pub/sub',
      'High-Throughput URL Shortener with analytics pipeline'
    ],
    entry_job_titles: ['Junior Backend Engineer', 'Server-Side Developer', 'API Engineer'],
    interview_focus: ['API Design & HTTP status codes', 'SQL query optimization & transactions (ACID)', 'Concurrency & backend system design'],
    portfolio_expectations: 'Documented Swagger/Postman API collections, clear schema ER diagrams, and live deployed backend services.',
    prerequisites: ['Basic Python, JavaScript, or Java and basic SQL'],
    experiment_id: 'exp_software_dev_2'
  },
  {
    id: 'role_fullstack',
    title: 'Full-Stack Developer',
    category: 'Software Engineering',
    description: 'Bridges frontend client experiences and backend server architectures to deliver cohesive, end-to-end digital web applications.',
    day_to_day: 'Building full feature verticals from UI forms to database models, connecting frontend state to backend APIs, and deploying production builds.',
    core_responsibilities: [
      'Develop end-to-end user features across React frontend and Node/Python backend',
      'Model relational and document databases to serve dynamic UI needs',
      'Deploy, configure, and maintain production hosting environments',
      'Conduct full-stack debugging and integration testing'
    ],
    essential_skills: ['React / Next.js', 'Node.js / Express / FastAPI', 'PostgreSQL / MongoDB', 'TypeScript', 'REST APIs & Auth', 'Deployment (Vercel/Docker)'],
    useful_skills: ['Tailwind CSS', 'Redis', 'CI/CD Workflows', 'GraphQL', 'Testing (Playwright/Jest)'],
    academic_foundations: ['Data Structures', 'DBMS', 'Computer Networks', 'Web Systems'],
    tools_technologies: ['VS Code', 'Docker', 'Postman', 'GitHub Actions', 'Vercel / Render'],
    example_projects: [
      'Campus Placement & Recruitment Portal with multi-role permissions',
      'Real-time Collaborative Kanban Board with live updates',
      'SaaS Subscription Management App with payment webhooks'
    ],
    entry_job_titles: ['Associate Full-Stack Developer', 'Web Application Developer', 'Software Engineer'],
    interview_focus: ['Full-stack architecture', 'Data flow from DB to Browser', 'DSA + System design discussion'],
    portfolio_expectations: 'At least 2 deployed full-stack applications with authenticated accounts, responsive UI, and GitHub repos.',
    prerequisites: ['Basic JavaScript & programming fundamentals'],
    experiment_id: 'exp_software_dev_1'
  },
  {
    id: 'role_aiml_engineer',
    title: 'AI/ML Engineer',
    category: 'AI & Data Science',
    description: 'Trains predictive statistical models, builds neural networks, and integrates machine learning systems into production applications.',
    day_to_day: 'Preprocessing raw datasets, engineering features, training and fine-tuning ML models, tracking experiment metrics, and packaging models as inference APIs.',
    core_responsibilities: [
      'Clean and transform structured and unstructured datasets',
      'Train and validate supervised and unsupervised ML algorithms',
      'Evaluate model performance against statistical metrics (F1, AUC-ROC, RMSE)',
      'Deploy trained models via FastAPI/Flask endpoints for live inference'
    ],
    essential_skills: ['Python & NumPy / pandas', 'Scikit-learn & Machine Learning', 'Linear Algebra & Probability', 'PyTorch / TensorFlow', 'Model Evaluation & Tuning'],
    useful_skills: ['Hugging Face Transformers', 'FastAPI Serving', 'MLflow / DVC', 'Vector Databases & Embeddings', 'Docker'],
    academic_foundations: ['Applied Mathematics', 'Probability & Statistics', 'Linear Algebra', 'Data Structures'],
    tools_technologies: ['Jupyter Lab', 'PyTorch', 'Scikit-Learn', 'FastAPI', 'Weights & Biases'],
    example_projects: [
      'Placement Eligibility & Salary Predictor using ensemble trees',
      'Medical Diagnosis Classifier with confusion matrix auditing',
      'Domain-specific RAG Assistant using embeddings and vector search'
    ],
    entry_job_titles: ['Junior ML Engineer', 'AI Associate', 'Data Science Engineer'],
    interview_focus: ['Math foundations (Gradients, Bayes theorem)', 'Algorithm trade-offs (Random Forest vs XGBoost)', 'Model validation & data leakage'],
    portfolio_expectations: 'Documented Jupyter Notebooks with clear analytical narratives, evaluated metrics, and a deployed inference demo.',
    prerequisites: ['Python programming & introductory calculus/statistics'],
    experiment_id: 'exp_data_ai_1'
  },
  {
    id: 'role_data_analyst',
    title: 'Data Analyst',
    category: 'AI & Data Science',
    description: 'Translates complex business datasets into actionable operational insights, automated KPI dashboards, and data-backed recommendations.',
    day_to_day: 'Writing SQL queries to extract data, cleaning datasets in pandas/Excel, building interactive dashboards, and presenting trends to stakeholders.',
    core_responsibilities: [
      'Query relational databases using complex SQL joins, CTEs, and window functions',
      'Perform Exploratory Data Analysis (EDA) to identify business anomalies',
      'Build interactive Tableau / Power BI / Metabase dashboards',
      'Communicate quantitative insights to technical and non-technical teams'
    ],
    essential_skills: ['Advanced SQL', 'Python (pandas & Matplotlib)', 'Power BI / Tableau', 'Descriptive Statistics', 'Spreadsheets & Excel Modeling'],
    useful_skills: ['A/B Testing Basics', 'Data Storytelling', 'dbt (Data Build Tool)', 'ETL Basics'],
    academic_foundations: ['Database Management', 'Statistics', 'Business Mathematics'],
    tools_technologies: ['PostgreSQL / BigQuery', 'Power BI / Tableau', 'Jupyter Notebooks', 'Excel'],
    example_projects: [
      'University Campus Placement Trends Dashboard (5-year historical analysis)',
      'Customer Churn & Retention Analysis Report',
      'E-commerce Sales & Inventory Optimization Analysis'
    ],
    entry_job_titles: ['Junior Data Analyst', 'Business Intelligence Analyst', 'Analytics Specialist'],
    interview_focus: ['SQL Window Functions and complex aggregations', 'Interpreting business KPIs', 'Case study data problem solving'],
    portfolio_expectations: 'Interactive dashboard links (Tableau Public / Power BI) and documented EDA case study write-ups.',
    prerequisites: ['Basic math & enthusiasm for working with numbers and tables'],
    experiment_id: 'exp_data_ai_1'
  },
  {
    id: 'role_data_scientist',
    title: 'Data Scientist',
    category: 'AI & Data Science',
    description: 'Applies statistical modeling, predictive analytics, and scientific research methodologies to extract deep patterns from complex data.',
    day_to_day: 'Designing scientific experiments, formulating statistical hypotheses, training advanced models, and optimizing algorithms for predictive accuracy.',
    core_responsibilities: [
      'Formulate and test statistical hypotheses to drive strategic decisions',
      'Build predictive and prescriptive machine learning models',
      'Design and analyze A/B tests with statistical significance rigor',
      'Translate ambiguous research questions into quantifiable modeling tasks'
    ],
    essential_skills: ['Inferential Statistics & Hypothesis Testing', 'Python / R', 'Advanced Machine Learning', 'Data Wrangling (SQL/pandas)', 'Experiment Design (A/B Testing)'],
    useful_skills: ['Time-Series Forecasting', 'Big Data (PySpark)', 'Deep Learning', 'Cloud Analytics (AWS/GCP)'],
    academic_foundations: ['Probability & Mathematical Statistics', 'Linear Algebra', 'Optimization Theory'],
    tools_technologies: ['Jupyter', 'PySpark', 'Scikit-Learn', 'Statsmodels', 'SQL'],
    example_projects: [
      'Time-Series Energy Consumption Forecaster with Prophet',
      'Customer Lifetime Value (LTV) Predictive Model',
      'A/B Test Evaluation Pipeline with Bayesian statistical rigor'
    ],
    entry_job_titles: ['Associate Data Scientist', 'Quantitative Analyst', 'Research Analyst'],
    interview_focus: ['Probability distributions & p-value interpretation', 'Supervised/unsupervised mathematical proofs', 'Statistical experiment design'],
    portfolio_expectations: 'Scientific reports demonstrating methodical exploratory data analysis, hypothesis testing, and model benchmarking.',
    prerequisites: ['Strong mathematics/statistics background and Python'],
    experiment_id: 'exp_data_ai_2'
  },
  {
    id: 'role_uiux_designer',
    title: 'UI/UX Designer',
    category: 'Design & Product',
    description: 'Designs intuitive, accessible, and delightful digital user experiences through research, information architecture, wireframes, and high-fidelity prototypes.',
    day_to_day: 'Conducting user interviews, synthesizing user personas, sketching user flows, designing high-fidelity Figma components, and testing usability.',
    core_responsibilities: [
      'Conduct qualitative user research and competitive interface audits',
      'Create wireframes, user flows, and interactive Figma prototypes',
      'Build and maintain cohesive design systems with reusable components',
      'Perform usability testing and iterate based on real feedback'
    ],
    essential_skills: ['Figma & Auto Layout', 'User Research & Personas', 'Wireframing & Prototyping', 'Visual Hierarchy & Typography', 'Design Systems', 'Usability Testing'],
    useful_skills: ['Micro-interactions (Principle/Framer)', 'Basic HTML/CSS understanding', 'Accessibility (WCAG)', 'Information Architecture'],
    academic_foundations: ['Human-Computer Interaction', 'Cognitive Psychology', 'Graphic Design Basics'],
    tools_technologies: ['Figma', 'FigJam', 'Miro', 'Notion', 'Framer'],
    example_projects: [
      'Campus Event Discovery App: UX Research to Interactive Prototype',
      'Financial App Onboarding Redesign with Usability Test Case Study',
      'Complete Multi-platform Design System with Tokens'
    ],
    entry_job_titles: ['Associate Product Designer', 'Junior UI/UX Designer', 'Interaction Designer'],
    interview_focus: ['Design process walkthrough (Double Diamond)', 'Rationale behind design decisions', 'Live design challenge / critique'],
    portfolio_expectations: '2-3 comprehensive case studies detailing the problem, user research, wireframes, iterations, and final prototype.',
    prerequisites: ['Eye for visual aesthetics & curiosity about user psychology'],
    experiment_id: 'exp_uiux_1'
  },
  {
    id: 'role_product_designer',
    title: 'Product Designer',
    category: 'Design & Product',
    description: 'Combines deep UX research, interaction design, and business strategy to define and design complete product solutions from conception to launch.',
    day_to_day: 'Aligning product metrics with user needs, defining problem statements, prototyping features, collaborating with engineers and product managers.',
    core_responsibilities: [
      'Define product requirements balancing user experience and business outcomes',
      'Map end-to-end customer journey maps and edge-case user flows',
      'Design production-ready components and interactive prototypes',
      'Measure product adoption and UX metrics post-launch'
    ],
    essential_skills: ['Product Thinking & Business Strategy', 'Figma High-Fidelity Design', 'User Journey Mapping', 'Design Systems', 'Metrics & Usability Analysis'],
    useful_skills: ['Framer / Webflow', 'A/B Testing Analysis', 'Basic Coding Knowledge', 'Workshop Facilitation'],
    academic_foundations: ['HCI', 'Product Management Fundamentals', 'Design Thinking'],
    tools_technologies: ['Figma', 'Mixpanel / PostHog', 'Loom', 'Notion', 'Whimsical'],
    example_projects: [
      'End-to-end Job Search & Application Flow Case Study with Business Metrics',
      'Peer Mentorship Platform: Discovery, Strategy & Prototype',
      'B2B SaaS Analytics Workspace Design'
    ],
    entry_job_titles: ['Junior Product Designer', 'Associate UX Designer', 'Design Strategist'],
    interview_focus: ['Product sense & trade-off decisions', 'Cross-functional collaboration with engineering', 'Portfolio deep dive'],
    portfolio_expectations: 'Case studies demonstrating strategic thinking, business constraints, and measurable design outcomes.',
    prerequisites: ['UI/UX fundamentals & product curiosity'],
    experiment_id: 'exp_uiux_2'
  },
  {
    id: 'role_business_analyst',
    title: 'Business Analyst',
    category: 'Business & Strategy',
    description: 'Identifies business operational needs, documents functional requirements, and bridges corporate strategy with technical engineering teams.',
    day_to_day: 'Interviewing business stakeholders, writing user stories and acceptance criteria, mapping business processes, and validating software deliverables.',
    core_responsibilities: [
      'Elicit and document functional and non-functional software requirements',
      'Create Business Process Model and Notation (BPMN) diagrams and user stories',
      'Analyze business data to identify operational bottlenecks',
      'Facilitate User Acceptance Testing (UAT) and stakeholder sign-offs'
    ],
    essential_skills: ['Requirements Gathering', 'User Stories & Acceptance Criteria', 'Process Flow Mapping (BPMN)', 'SQL Basics', 'Agile / Scrum Methodologies'],
    useful_skills: ['Jira / Confluence', 'Data Visualization (Power BI)', 'Financial Modeling Basics', 'Stakeholder Communication'],
    academic_foundations: ['Software Project Management', 'Information Systems', 'Business Administration'],
    tools_technologies: ['Jira', 'Confluence', 'Lucidchart / Visio', 'Excel', 'SQL'],
    example_projects: [
      'University Library Automation: Business Requirement Document (BRD) & Process Map',
      'Campus Placement Drive Workflow Optimization Analysis',
      'E-commerce Return Management Feature Specification'
    ],
    entry_job_titles: ['Associate Business Analyst', 'Junior Systems Analyst', 'Functional Consultant'],
    interview_focus: ['Translating vague business requests into technical requirements', 'Process flow analysis', 'Stakeholder conflict resolution'],
    portfolio_expectations: 'Sample BRD documents, detailed process flow diagrams, and user story mapping artifacts.',
    prerequisites: ['Strong communication, analytical thinking, and basic tech literacy'],
    experiment_id: 'exp_software_dev_1'
  },
  {
    id: 'role_devops_engineer',
    title: 'DevOps / Cloud Engineer',
    category: 'Cloud & Infrastructure',
    description: 'Automates software delivery pipelines, provisions cloud infrastructure as code, and guarantees system reliability, scalability, and uptime.',
    day_to_day: 'Configuring CI/CD pipelines, writing Terraform scripts, managing Kubernetes clusters, monitoring cloud health, and triaging deployment alerts.',
    core_responsibilities: [
      'Build automated CI/CD pipelines with GitHub Actions or GitLab CI',
      'Provision and maintain cloud resources (AWS/GCP) using Terraform',
      'Containerize microservices with Docker and orchestrate with Kubernetes',
      'Implement observability, alerts, and dashboards using Prometheus & Grafana'
    ],
    essential_skills: ['Linux System Administration', 'Docker & Containerization', 'CI/CD Pipelines (GitHub Actions)', 'Cloud Basics (AWS / GCP)', 'Terraform (IaC)'],
    useful_skills: ['Kubernetes (K8s)', 'Bash Scripting', 'Prometheus & Grafana', 'Network Security (VPC/Firewalls)'],
    academic_foundations: ['Operating Systems', 'Computer Networks', 'Distributed Systems'],
    tools_technologies: ['Linux / Bash', 'Docker', 'AWS / GCP', 'GitHub Actions', 'Terraform', 'Kubernetes'],
    example_projects: [
      'Automated Multi-Stage CI/CD Pipeline with Docker builds and unit testing',
      'Terraform Cloud Infrastructure Blueprint for a resilient web application',
      'Kubernetes Microservices Deployment with live Grafana metrics'
    ],
    entry_job_titles: ['Junior Cloud Engineer', 'Associate DevOps Specialist', 'Site Reliability Engineer (SRE)'],
    interview_focus: ['Linux commands & permissions', 'Docker container lifecycle & networking', 'CI/CD best practices and troubleshooting'],
    portfolio_expectations: 'GitHub repositories featuring automated workflows, Dockerfiles, and Terraform infrastructure configurations.',
    prerequisites: ['Basic command-line familiarity and general networking concepts'],
    experiment_id: 'exp_cloud_1'
  },
  {
    id: 'role_cybersecurity',
    title: 'Cybersecurity Analyst',
    category: 'Cloud & Infrastructure',
    description: 'Protects digital systems, networks, and confidential data against unauthorized access, vulnerabilities, cyberattacks, and security breaches.',
    day_to_day: 'Analyzing network packet captures, conducting vulnerability assessments, monitoring SIEM logs for anomalies, and researching threat exploits.',
    core_responsibilities: [
      'Monitor security alerts and investigate anomalous network traffic',
      'Audit web applications for OWASP Top 10 vulnerabilities',
      'Perform vulnerability scanning with Nmap and security scanners',
      'Draft incident response playbooks and security remediation reports'
    ],
    essential_skills: ['Network Security & TCP/IP', 'Linux Security & Hardening', 'OWASP Top 10 Web Vulnerabilities', 'Vulnerability Scanning (Nmap/Wireshark)', 'Security Fundamentals'],
    useful_skills: ['SIEM Tools (Splunk/ELK)', 'Python for Security Scripting', 'Cryptography Basics', 'Burp Suite'],
    academic_foundations: ['Computer Networks', 'Information Security', 'Cryptography', 'Operating Systems'],
    tools_technologies: ['Wireshark', 'Nmap', 'Burp Suite Community', 'Kali Linux', 'Linux Terminal'],
    example_projects: [
      'Vulnerability Assessment & Remediation Report for a Web Application',
      'Network Intrusion Detection & Wireshark Packet Analysis Log',
      'Hardened Linux Server Configuration Blueprint'
    ],
    entry_job_titles: ['Junior SOC Analyst', 'Security Associate', 'Vulnerability Analyst'],
    interview_focus: ['TCP 3-way handshake & OSI model', 'OWASP Top 10 exploits (SQLi, XSS, CSRF)', 'Incident response scenarios'],
    portfolio_expectations: 'Ethical security audit reports, TryHackMe / HackTheBox badges, and security automation scripts.',
    prerequisites: ['Basic networking knowledge (IP addresses, ports, protocols)'],
    experiment_id: 'exp_cyber_1'
  },
  {
    id: 'role_qa_engineer',
    title: 'QA / Automation Engineer',
    category: 'Quality & Testing',
    description: 'Guarantees software reliability, security, and performance by authoring automated test suites, testing APIs, and executing defect lifecycles.',
    day_to_day: 'Writing test cases from user stories, developing automated browser scripts with Playwright/Cypress, validating REST APIs, and filing defect tickets.',
    core_responsibilities: [
      'Design comprehensive test plans, edge-case matrices, and regression suites',
      'Author automated end-to-end browser tests with Playwright or Cypress',
      'Validate REST API contracts, status codes, and error payloads',
      'Integrate automated test runs into CI/CD deployment pipelines'
    ],
    essential_skills: ['Manual Testing Methodologies', 'Playwright / Cypress Automation', 'API Testing (Postman)', 'JavaScript or Python', 'Test Case Design & Bug Reporting'],
    useful_skills: ['Performance Testing (k6/JMeter)', 'CI/CD Test Integration', 'SQL for Data Validation', 'BDD / Cucumber'],
    academic_foundations: ['Software Engineering', 'Testing & Verification', 'Computer Programming'],
    tools_technologies: ['Playwright', 'Postman', 'Jira', 'GitHub Actions', 'Chrome DevTools'],
    example_projects: [
      'Automated End-to-End Test Suite for an E-commerce Checkout Flow',
      'REST API Test Automation Collection with Schema Assertions',
      'Load & Stress Test Benchmark Report with k6'
    ],
    entry_job_titles: ['Junior Automation Engineer', 'Software Test Specialist', 'QA Analyst'],
    interview_focus: ['Boundary Value Analysis & Equivalence Partitioning', 'Automation framework architecture (Page Object Model)', 'Defect lifecycle triage'],
    portfolio_expectations: 'GitHub test repositories with automated tests executing on pull requests via GitHub Actions.',
    prerequisites: ['Basic programming knowledge in JavaScript or Python'],
    experiment_id: 'exp_software_dev_1'
  },
  {
    id: 'role_embedded_software',
    title: 'Embedded Software Engineer',
    category: 'Hardware & Systems',
    description: 'Programs firmware and low-level software that runs directly on microcontrollers, IoT devices, automotive systems, and specialized hardware.',
    day_to_day: 'Writing C/C++ firmware, debugging with oscilloscopes and logic analyzers, reading hardware schematics, and writing device drivers.',
    core_responsibilities: [
      'Write resource-constrained, high-efficiency C/C++ code for microcontrollers',
      'Interface with hardware protocols (UART, SPI, I2C, CAN)',
      'Develop low-level device drivers and handle hardware interrupts',
      'Debug memory leaks, race conditions, and timing constraints'
    ],
    essential_skills: ['Embedded C / C++', 'Microcontrollers (ARM Cortex / ESP32 / Arduino)', 'Hardware Protocols (UART/SPI/I2C)', 'Memory-Constrained Programming', 'Hardware Debugging'],
    useful_skills: ['RTOS (FreeRTOS)', 'Linux Device Drivers', 'PCB Schematics Reading', 'IoT Protocols (MQTT)'],
    academic_foundations: ['Microprocessors & Microcontrollers', 'Digital Electronics', 'Computer Architecture', 'Operating Systems'],
    tools_technologies: ['ESP-IDF / Arduino IDE', 'PlatformIO', 'Logic Analyzer', 'GDB', 'Saleae'],
    example_projects: [
      'IoT Environmental Sensor Station with ESP32 and MQTT reporting',
      'Custom UART Bootloader for ARM Microcontroller',
      'Real-time Digital Audio Signal Filter with FreeRTOS'
    ],
    entry_job_titles: ['Junior Firmware Engineer', 'Associate Embedded Developer', 'Hardware Software Engineer'],
    interview_focus: ['Bitwise operations & pointers in C', 'Interrupt Service Routines (ISRs) & volatile keyword', 'Hardware protocol timings'],
    portfolio_expectations: 'GitHub firmware repos with schematics, breadboard photos/videos, and clean code documentation.',
    prerequisites: ['C programming fundamentals and basic circuit knowledge'],
    experiment_id: 'exp_software_dev_2'
  },
  {
    id: 'role_robotics_software',
    title: 'Robotics Software Engineer',
    category: 'Hardware & Systems',
    description: 'Develops algorithms for autonomous mobile robots, robotic manipulators, motion planning, sensor fusion, and spatial localization.',
    day_to_day: 'Writing ROS2 nodes in C++/Python, simulating robot kinematics in Gazebo, tuning PID controllers, and testing sensor fusion with LiDAR.',
    core_responsibilities: [
      'Develop robotic control nodes using ROS2 (Robot Operating System)',
      'Implement path planning and obstacle avoidance algorithms (A*, Dijkstra, RRT)',
      'Simulate robot dynamics and kinematics in Gazebo or Webots',
      'Fuse spatial sensor inputs (LiDAR, IMU, Depth Camera) for SLAM'
    ],
    essential_skills: ['C++ & Python', 'ROS2 (Robot Operating System)', 'Kinematics & Coordinate Transforms', 'Linear Algebra & Vector Calculus', 'Simulation (Gazebo)'],
    useful_skills: ['SLAM (Simultaneous Localization & Mapping)', 'Computer Vision (OpenCV)', 'Control Systems (PID)', 'LiDAR Data Processing'],
    academic_foundations: ['Robotics & Control', 'Linear Algebra', 'Algorithms', 'Physics Mechanics'],
    tools_technologies: ['ROS2 Humble', 'Gazebo', 'RViz', 'Ubuntu Linux', 'OpenCV'],
    example_projects: [
      'Autonomous Mobile Robot Obstacle Avoidance Simulation in Gazebo',
      '2D LiDAR SLAM Navigation Mapping with ROS2',
      '2-DOF Robotic Arm Inverse Kinematics Controller'
    ],
    entry_job_titles: ['Junior Robotics Engineer', 'Autonomy Software Associate', 'Controls Engineer'],
    interview_focus: ['Coordinate transformations & quaternion math', 'ROS2 publisher/subscriber architecture', 'Path planning algorithms'],
    portfolio_expectations: 'Simulation demonstration videos, Gazebo model packages, and clean ROS2 node implementations.',
    prerequisites: ['Strong C++ or Python and matrix mathematics'],
    experiment_id: 'exp_data_ai_1'
  },
  {
    id: 'role_mobile_developer',
    title: 'Mobile App Developer',
    category: 'Software Engineering',
    description: 'Builds fast, intuitive, and responsive mobile applications for iOS and Android using modern cross-platform or native frameworks.',
    day_to_day: 'Developing mobile screens in Flutter or React Native, handling mobile permissions, managing offline SQLite data, and testing on emulators.',
    core_responsibilities: [
      'Build cross-platform mobile apps using Flutter or React Native',
      'Integrate device hardware APIs (Camera, GPS, Push Notifications)',
      'Implement offline-first storage and synchronization with remote APIs',
      'Prepare mobile bundles for Google Play Store and Apple App Store testing'
    ],
    essential_skills: ['Flutter (Dart) or React Native', 'Mobile UI & Navigation', 'REST API Integration', 'Offline Storage (SQLite/Hive)', 'Mobile Lifecycle Management'],
    useful_skills: ['State Management (Bloc/Riverpod/Redux)', 'Firebase Auth & Messaging', 'Native Android/iOS Bridge', 'App Store Guidelines'],
    academic_foundations: ['Mobile Computing', 'Human-Computer Interaction', 'Software Engineering'],
    tools_technologies: ['Android Studio', 'Xcode', 'VS Code', 'Flutter SDK', 'Postman'],
    example_projects: [
      'Campus Student Companion App with class timetable and offline sync',
      'Personal Habit Tracker with push notifications and local analytics',
      'Food Delivery Interface with live order tracking'
    ],
    entry_job_titles: ['Associate Mobile Developer', 'Junior Flutter Engineer', 'Android/iOS Developer'],
    interview_focus: ['Mobile app lifecycle states', 'Offline data synchronization strategies', 'Async UI rendering & smooth 60fps animations'],
    portfolio_expectations: 'Installable APK releases on GitHub or live App Store links with screen recordings.',
    prerequisites: ['Object-oriented programming in Dart, JavaScript, or Kotlin'],
    experiment_id: 'exp_software_dev_1'
  }
];

export const INITIAL_EXPERIMENTS: CareerExperimentItem[] = [
  {
    id: 'exp_software_dev_1',
    career_category: 'Software Development',
    title: 'Build a Live Dynamic Currency / Metric Converter',
    difficulty: 'Beginner',
    expected_duration: '45 mins',
    learning_objective: 'Experience the fundamental loop of software engineering: capturing user input, computing transformations, handling edge cases, and updating UI state.',
    prerequisites: ['Modern web browser', 'Basic familiarity with editing HTML or JavaScript'],
    required_tools: ['Web browser (Chrome/Firefox)', 'Online Sandbox (CodeSandbox / StackBlitz) or local VS Code'],
    instructions: [
      '1. Open CodeSandbox or an HTML file and set up a clean input field for a numeric value.',
      '2. Create a dropdown to select input units (e.g., USD to INR, or Celsius to Fahrenheit).',
      '3. Write a JavaScript function that validates non-negative inputs and calculates the converted value.',
      '4. Add an error badge that triggers if a user enters non-numeric text or zero.',
      '5. Style the converter with clean borders, accessible labels, and a reset button.'
    ],
    expected_deliverable: 'A working web widget that converts units instantaneously with error handling.',
    completion_criteria: [
      'Accurate numeric calculations for at least 3 conversions',
      'Visible error message for invalid characters',
      'Responsive layout that works on desktop and mobile'
    ],
    resources: ['MDN JavaScript Basics', 'freeCodeCamp Interactive Web Projects']
  },
  {
    id: 'exp_software_dev_2',
    career_category: 'Software Development',
    title: 'Build an Authenticated Mock API Route with Node or FastAPI',
    difficulty: 'Beginner',
    expected_duration: '50 mins',
    learning_objective: 'Understand how backend servers receive requests, inspect security headers, query structured records, and return JSON responses.',
    prerequisites: ['Python or Node.js installed locally'],
    required_tools: ['VS Code', 'Terminal', 'Postman or curl'],
    instructions: [
      '1. Create a minimal FastAPI or Express server script with 5 mock student records in a JSON list.',
      '2. Define a GET endpoint /students with an optional ?department= query filter.',
      '3. Add a check requiring a header X-Campus-Key: secret123. If missing, return HTTP 401 Unauthorized.',
      '4. Test the endpoint using Postman or curl, verifying both success and unauthorized responses.',
      '5. Add a POST endpoint /students to append a new valid record to your list.'
    ],
    expected_deliverable: 'A runnable server file that responds to filtered GET and authenticated requests.',
    completion_criteria: [
      'Returns HTTP 200 with filtered JSON data when authorized',
      'Returns HTTP 401 when the secret header is absent',
      'Successfully validates request bodies'
    ],
    resources: ['FastAPI Official Quickstart', 'Express.js Hello World Guide']
  },
  {
    id: 'exp_uiux_1',
    career_category: 'UI/UX Design',
    title: 'Audit and Redesign a Confusing Campus Timetable Screen',
    difficulty: 'Beginner',
    expected_duration: '45 mins',
    learning_objective: 'Experience user interface thinking by analyzing visual hierarchy, typography contrast, cognitive load, and spacing.',
    prerequisites: ['Free Figma account or pen & paper'],
    required_tools: ['Figma (Free tier in browser) or notebook'],
    instructions: [
      '1. Identify 3 critical pain points on a cluttered schedule (e.g., unreadable font, conflicting colors, missing room numbers).',
      '2. Define the primary user goal: A student rushing between classes who has 5 seconds to know their next room and time.',
      '3. Create an improved layout grouping classes chronologically with consistent time chips.',
      '4. Use a disciplined 8px spacing grid and distinct font weights (bold titles, muted time stamps).',
      '5. Write 3 bullet points explaining why your layout reduces student confusion.'
    ],
    expected_deliverable: 'A Figma frame or clean wireframe sketch with a brief rationale note.',
    completion_criteria: [
      'Clear visual hierarchy where the next upcoming class is prominent',
      'Accessible color contrast adhering to WCAG standards',
      'Documented 3 design decisions'
    ],
    resources: ['Figma Auto Layout 101', 'Refactoring UI Principles']
  },
  {
    id: 'exp_uiux_2',
    career_category: 'UI/UX Design',
    title: 'Map a 3-Step Campus Book-Borrowing User Flow',
    difficulty: 'Beginner',
    expected_duration: '40 mins',
    learning_objective: 'Understand UX architecture: anticipating user decision forks, error states, and confirmation feedback before writing code.',
    prerequisites: ['Curiosity about user pathways'],
    required_tools: ['FigJam, Miro, or blank paper'],
    instructions: [
      '1. Define the student persona: Looking for a specific textbook for an exam tomorrow.',
      '2. Map the 3 primary screens: Search & Availability → Reserve Confirmation → Pickup Barcode.',
      '3. Add at least two edge-case branches: What happens if the book is checked out? What if their library account is suspended?',
      '4. Annotate what data needs to be visible at each step to prevent user anxiety.'
    ],
    expected_deliverable: 'A step-by-step user journey diagram with decision diamonds and edge cases.',
    completion_criteria: [
      'End-to-end pathway from discovery to physical collection',
      'Both happy-path and fallback branches illustrated',
      'Clear action labels on buttons (e.g., Reserve for 24h vs generic Submit)'
    ],
    resources: ['Nielsen Norman Group: User Flow Mapping']
  },
  {
    id: 'exp_data_ai_1',
    career_category: 'AI/ML and Data',
    title: 'Analyze and Visualize a Campus Placement Dataset',
    difficulty: 'Beginner',
    expected_duration: '50 mins',
    learning_objective: 'Experience exploratory data analysis: loading tabular data, detecting outliers, computing summary statistics, and discovering hidden patterns.',
    prerequisites: ['Basic Python or Google Sheets'],
    required_tools: ['Google Colab (free in browser) or Google Sheets'],
    instructions: [
      '1. Open a Google Colab notebook and load a CSV with student CGPA, internships count, and placement outcome.',
      '2. Calculate summary statistics: mean CGPA, median salary, and placement percentage.',
      '3. Create a scatter plot comparing CGPA versus salary offers.',
      '4. Identify if students with 2+ internships have higher placement rates using a grouped bar chart.',
      '5. Write a 2-sentence executive summary of the single most actionable finding.'
    ],
    expected_deliverable: 'A Colab notebook or spreadsheet chart displaying findings and a concise takeaway.',
    completion_criteria: [
      'At least 2 clean visual charts with labeled axes',
      'Zero missing values in the plotted variables',
      'Accurate percentage calculation'
    ],
    resources: ['pandas 10-Minute Walkthrough', 'Kaggle Python Micro-Course']
  },
  {
    id: 'exp_data_ai_2',
    career_category: 'AI/ML and Data',
    title: 'Train a Decision Tree Classifier to Predict Student Pass/Fail',
    difficulty: 'Beginner',
    expected_duration: '55 mins',
    learning_objective: 'Understand the machine learning lifecycle: feature selection, train/test splitting, model fitting, and evaluation metrics.',
    prerequisites: ['Basic Python'],
    required_tools: ['Google Colab (free in browser)'],
    instructions: [
      '1. Import scikit-learn in a Google Colab notebook.',
      '2. Create a synthetic dataset of 200 records with features: attendance rate, study hours, and test scores.',
      '3. Split into 80% training set and 20% test set using train_test_split.',
      '4. Fit a DecisionTreeClassifier(max_depth=3) and inspect the decision rules.',
      '5. Evaluate accuracy and print a confusion matrix showing false positives vs false negatives.'
    ],
    expected_deliverable: 'A running Colab notebook outputting model accuracy and a confusion matrix.',
    completion_criteria: [
      'Clean separation between training and test sets',
      'Printed confusion matrix and explanation of precision vs recall',
      'Insight into the most influential predictive feature'
    ],
    resources: ['Scikit-learn Decision Trees Documentation']
  },
  {
    id: 'exp_cyber_1',
    career_category: 'Cybersecurity',
    title: 'Analyze Unencrypted HTTP Traffic Traces in Wireshark',
    difficulty: 'Beginner',
    expected_duration: '45 mins',
    learning_objective: 'See firsthand why unencrypted protocols are dangerous and how security analysts inspect network packet headers.',
    prerequisites: ['Computer with Wireshark installed or access to CloudShark'],
    required_tools: ['Wireshark (Free open-source) or web-based sample PCAP file'],
    instructions: [
      '1. Download an authorized sample PCAP capture file of an unencrypted HTTP login form.',
      '2. Open the capture in Wireshark and apply the display filter http.request.method == "POST".',
      '3. Locate the plaintext credentials submitted in the HTTP POST body.',
      '4. Inspect the TCP 3-way handshake (SYN, SYN-ACK, ACK) preceding the request.',
      '5. Compare this to an HTTPS packet trace to observe how TLS encryption shields payloads.'
    ],
    expected_deliverable: 'A screenshot or note documenting the exact line where plaintext credentials were exposed and the remediation.',
    completion_criteria: [
      'Identification of the exposed credentials in the packet body',
      'Understanding of the TCP handshake sequence',
      'Clear technical explanation of how HTTPS prevents packet sniffing'
    ],
    resources: ['Wireshark Official User Guide', 'Cloudflare: What is SSL/TLS?']
  },
  {
    id: 'exp_cloud_1',
    career_category: 'Cloud and DevOps',
    title: 'Containerize a Web Application with Docker',
    difficulty: 'Beginner',
    expected_duration: '45 mins',
    learning_objective: 'Experience containerization: isolating dependencies, configuring runtime environments, and running identical software across machines.',
    prerequisites: ['Docker Desktop installed or Play with Docker (free browser lab)'],
    required_tools: ['Docker Desktop or labs.play-with-docker.com'],
    instructions: [
      '1. Write a minimal index.html file with a hello-campus message.',
      '2. Author a 4-line Dockerfile using the lightweight nginx:alpine base image.',
      '3. Build the container image: docker build -t my-campus-app .',
      '4. Run the container mapping host port 8080: docker run -d -p 8080:80 my-campus-app.',
      '5. Open http://localhost:8080 in your browser to verify it is serving from the container.'
    ],
    expected_deliverable: 'A running Docker container serving your custom web page on localhost.',
    completion_criteria: [
      'Working Dockerfile committed with proper port exposure',
      'Successful page rendering in browser from container',
      'Understanding of images vs running containers'
    ],
    resources: ['Docker Getting Started Tutorial', 'Play with Docker Browser Labs']
  }
];

export const DISCOVERY_QUESTIONS = [
  {
    id: 1,
    title: 'Which core work activities do you naturally enjoy the most?',
    subtitle: 'Think about projects, hackathons, or assignments that energized you.',
    options: [
      { id: 'act_build_apps', label: 'Building functional web or mobile applications with clean UI', category: 'Software' },
      { id: 'act_data_analysis', label: 'Extracting patterns from numbers, charts, and large datasets', category: 'Data' },
      { id: 'act_visual_design', label: 'Designing aesthetic interfaces, user journeys, and prototypes', category: 'Design' },
      { id: 'act_infra_systems', label: 'Configuring servers, automation pipelines, and infrastructure', category: 'Cloud' },
      { id: 'act_security_audit', label: 'Investigating technical vulnerabilities, network traffic, and exploits', category: 'Security' },
      { id: 'act_hardware_iot', label: 'Programming microcontrollers, sensors, and physical systems', category: 'Systems' }
    ]
  },
  {
    id: 2,
    title: 'Which programming languages or technologies have you tried or felt comfortable with?',
    subtitle: 'Select any that you have practiced or want to build upon.',
    options: [
      { id: 'tech_py', label: 'Python (Scripting, pandas, data science, algorithms)', category: 'Data/Backend' },
      { id: 'tech_js_ts', label: 'JavaScript / TypeScript (React, Node.js, Frontend)', category: 'Web' },
      { id: 'tech_java_cpp', label: 'Java / C++ (Data structures, algorithms, object-oriented design)', category: 'Core' },
      { id: 'tech_sql', label: 'SQL (Relational databases, queries, joins)', category: 'Data/Backend' },
      { id: 'tech_figma', label: 'Figma / UI Design tools (Layouts, wireframes, color theory)', category: 'Design' },
      { id: 'tech_linux_git', label: 'Linux Terminal & Git (Command line, version control)', category: 'DevOps' }
    ]
  },
  {
    id: 3,
    title: 'Which college subjects or project domains did you find genuinely interesting?',
    subtitle: 'Your academic curiosity is a valuable hint about career satisfaction.',
    options: [
      { id: 'sub_dsa', label: 'Data Structures & Algorithms', category: 'Software' },
      { id: 'sub_dbms', label: 'Database Management Systems (DBMS)', category: 'Backend/Data' },
      { id: 'sub_os_networks', label: 'Operating Systems & Computer Networks', category: 'Cloud/Security' },
      { id: 'sub_ai_ml', label: 'Artificial Intelligence & Machine Learning', category: 'AI' },
      { id: 'sub_hci', label: 'Human-Computer Interaction / Web Technologies', category: 'Frontend/Design' },
      { id: 'sub_project_mgmt', label: 'Software Engineering & Project Management', category: 'Strategy' }
    ]
  },
  {
    id: 4,
    title: 'How do you prefer to solve problems day-to-day?',
    subtitle: 'Select the working style that fits how you think best.',
    options: [
      { id: 'style_logic', label: 'Mathematical, algorithmic, and structured logical deduction', category: 'AI/DSA' },
      { id: 'style_visual', label: 'Visual composition, human psychology, and empathy with users', category: 'Design/Product' },
      { id: 'style_systems', label: 'Architecting big-picture systems and connecting multiple services', category: 'FullStack/Backend' },
      { id: 'style_detective', label: 'Investigative troubleshooting, forensic analysis, and finding bugs', category: 'QA/Security' }
    ]
  },
  {
    id: 5,
    title: 'What is your primary goal for the next 6 months?',
    subtitle: 'Helps us calibrate recommendations to your real preparation constraints.',
    options: [
      { id: 'goal_internship', label: 'Secure a summer technical internship with a verified portfolio' },
      { id: 'goal_campus_placement', label: 'Prepare strategically for upcoming final-year campus drives' },
      { id: 'goal_skill_foundations', label: 'Build solid foundational coding and project skills first' },
      { id: 'goal_explore_direction', label: 'Explore multiple options before committing to a specialization' }
    ]
  }
];
