import { CareerTrack, LearningResource } from '../types/roadmap';

export const INITIAL_CAREER_TRACKS: CareerTrack[] = [
  {
    id: 'track_fullstack',
    title: 'Full-Stack Developer',
    category: 'Engineering',
    level: 'Beginner-friendly',
    estimated_duration_range: '3-6 Months',
    description: 'Cover the journey from programming fundamentals and modern frontend architecture to authenticated backend microservices, database modeling, cloud deployments, and placement interviews.',
    core_skills: ['HTML5 & Modern CSS', 'JavaScript (ES6+)', 'React 19', 'Node.js & Express', 'PostgreSQL & MongoDB', 'REST APIs & JWT', 'Docker & CI/CD', 'DSA & System Design'],
    prerequisites: ['Basic logical thinking', 'Familiarity with computer usage'],
    typical_project_outcomes: [
      'Responsive Personal Portfolio with Semantic HTML & CSS',
      'API-Powered React Web App with Client Routing & Search',
      'Authenticated REST Backend with Role-Based Access Control',
      'Full-Stack Application with Relational Database & Migrations',
      'Production-Style Cloud Deployed Capstone with Monitoring'
    ],
    template_phases: [
      {
        phase_number: 1,
        title: 'Phase 1 — Programming and Web Fundamentals',
        description: 'HTML semantic structure, CSS flexbox/grid, JavaScript asynchronous programming, DOM manipulation, Git and GitHub workflow.',
        why_it_matters: 'Web fundamentals are the bedrock of any software career; campus interviewers test DOM event propagation, closures, and responsive layouts.',
        estimated_duration_weeks: 3,
        skills_covered: ['HTML5 Semantic Markup', 'CSS Flexbox & Grid', 'JavaScript Async & Promises', 'DOM Manipulation', 'Git & GitHub Collaboration'],
        practical_milestone: 'Build and publish a responsive personal portfolio with clean semantic markup and custom CSS.',
        completion_criteria: [
          'Zero accessibility errors on semantic elements',
          'Pixel-perfect responsive layout on mobile (360px) and desktop (1280px)',
          'Hosted on GitHub Pages or Vercel with structured commit history'
        ]
      },
      {
        phase_number: 2,
        title: 'Phase 2 — Frontend Development with React',
        description: 'React fundamentals, components, hooks, routing, forms, API integration, loading and error states, and responsive UI architecture.',
        why_it_matters: 'Modern frontend engineering requires state-driven architecture and seamless handling of asynchronous network conditions.',
        estimated_duration_weeks: 4,
        skills_covered: ['React 19 Components & Hooks', 'Client-Side Routing', 'API Integration & Error Handling', 'Forms & Zod/Custom Validation', 'Component Accessibility (a11y)'],
        practical_milestone: 'Build a multi-page React application consuming a real public or mock API with error handling.',
        completion_criteria: [
          'Modular component architecture with custom hooks',
          'Graceful handling of loading, empty, and network error states',
          'Responsive design with keyboard-accessible navigation'
        ]
      },
      {
        phase_number: 3,
        title: 'Phase 3 — Backend Development & APIs',
        description: 'Node.js, Express, REST API design, request validation, authentication, password security, and environment configuration.',
        why_it_matters: 'Backend services execute business rules, authenticate clients safely, and ensure secure communication with data stores.',
        estimated_duration_weeks: 4,
        skills_covered: ['Node.js Event Loop & Streams', 'Express REST Architecture', 'JWT Authentication & Hashing', 'Middleware & Validation', 'Environment Secrets & Logging'],
        practical_milestone: 'Develop an authenticated backend with protected endpoints, rate limiting, and automated testing.',
        completion_criteria: [
          'Stateless JWT authentication with secure password hashing (bcrypt/argon2)',
          'Strict request body validation middleware',
          'Automated API integration test coverage'
        ]
      },
      {
        phase_number: 4,
        title: 'Phase 4 — Databases and Full-Stack Integration',
        description: 'Relational database modeling with SQL/PostgreSQL, document storage with MongoDB, indexing, query optimization, and full-stack integration.',
        why_it_matters: 'Almost every campus technical interview includes relational schema design, table joins, normalization, and ACID guarantees.',
        estimated_duration_weeks: 4,
        skills_covered: ['PostgreSQL & SQL Joins', 'Data Modeling & Normalization', 'MongoDB Document Storage', 'Query Optimization & Indexing', 'Full-Stack Integration'],
        practical_milestone: 'Connect frontend, backend, and database into one cohesive, interactive application.',
        completion_criteria: [
          '3NF relational database schema with foreign key constraints',
          'Efficient indexed queries with server-side pagination and filtering',
          'Optimistic UI state updates on the frontend'
        ]
      },
      {
        phase_number: 5,
        title: 'Phase 5 — Production Readiness & DevOps',
        description: 'Cloud deployment, Docker containerization, security basics, testing, performance optimization, and CI/CD pipelines.',
        why_it_matters: 'Hiring teams strongly favor candidates who understand containerization, automated testing, and cloud deployment pipelines.',
        estimated_duration_weeks: 3,
        skills_covered: ['Docker Multi-Stage Builds', 'GitHub Actions CI/CD', 'Cloud Deployment (AWS/Render)', 'OWASP Web Security Basics', 'Web Performance Tuning'],
        practical_milestone: 'Deploy a production-style application with documentation and a working demo.',
        completion_criteria: [
          'Multi-stage Dockerfile producing minimal image size',
          'Automated test and lint workflow on GitHub pull requests',
          'Publicly accessible HTTPS demo with architectural documentation'
        ]
      },
      {
        phase_number: 6,
        title: 'Phase 6 — Placement Preparation & DSA',
        description: 'Data structures and algorithms, time/space complexity, problem-solving patterns, system design fundamentals, and mock interviews.',
        why_it_matters: 'Top campus recruitment drives rigorously filter candidates based on algorithmic efficiency and technical problem articulation.',
        estimated_duration_weeks: 4,
        skills_covered: ['Arrays, Strings & Two Pointers', 'Trees & Graph Traversal', 'Dynamic Programming Fundamentals', 'System Design Basics', 'Technical Project Explanation'],
        practical_milestone: 'Complete 75 curated DSA problems and conduct two recorded peer mock interviews.',
        completion_criteria: [
          'Demonstrated proficiency in calculating Big-O time and space complexity',
          'Clear verbal walkthrough of architectural trade-offs in past projects',
          'Polished ATS resume with evidence-backed project bullet points'
        ]
      }
    ]
  },
  {
    id: 'track_uiux',
    title: 'UI/UX Designer',
    category: 'Design',
    level: 'Beginner-friendly',
    estimated_duration_range: '3-5 Months',
    description: 'Build a portfolio-ready product design capability from visual hierarchy, color theory, and Figma auto-layout through user research, wireframing, and case studies.',
    core_skills: ['Visual Hierarchy & Grids', 'Typography & Color Systems', 'User Research & Synthesis', 'Information Architecture', 'Figma Auto Layout & Variants', 'Interactive Prototyping', 'Usability Testing', 'Product Thinking'],
    prerequisites: ['Empathy for user problems', 'Interest in visual communication'],
    typical_project_outcomes: [
      'Cluttered Web Interface Redesign & Decision Rationale',
      'Qualitative User Research & Persona Synthesis Report',
      'Tested Interactive Wireframe & User Flow Set',
      'Responsive Design System with Auto-Layout Components',
      'Comprehensive Case Study with Usability Evaluation Metrics'
    ],
    template_phases: [
      {
        phase_number: 1,
        title: 'Phase 1 — Design Fundamentals',
        description: 'Visual hierarchy, typography, color theory, contrast, layout grids, spacing scales, and WCAG accessibility fundamentals.',
        why_it_matters: 'A disciplined grasp of typography, contrast, and spacing ensures designs look polished, trustworthy, and accessible.',
        estimated_duration_weeks: 3,
        skills_covered: ['Typography Hierarchy', 'Color Theory & Contrast', '8pt Grid Systems', 'WCAG 2.1 AA Standards', 'Visual Balance'],
        practical_milestone: 'Redesign an existing interface and document the design decisions.',
        completion_criteria: [
          'Documented typography scale and accessible color palette',
          'Strict adherence to an 8-point spatial grid system',
          'Written rationale comparing before and after interface usability'
        ]
      },
      {
        phase_number: 2,
        title: 'Phase 2 — User Research',
        description: 'Understanding users and their problems, user interviews, surveys, competitor analysis, personas, user journeys, and research synthesis.',
        why_it_matters: 'True product design solves verified user friction points rather than imposing aesthetic assumptions.',
        estimated_duration_weeks: 3,
        skills_covered: ['User Interview Methodologies', 'Persona Development', 'Customer Journey Mapping', 'Competitive Auditing', 'Problem Framing'],
        practical_milestone: 'Create a concise research report for a defined user problem.',
        completion_criteria: [
          'At least 5 conducted user interviews with synthesized takeaways',
          'Evidence-based persona and journey map identifying pain points',
          'Validated problem statement with prioritized opportunities'
        ]
      },
      {
        phase_number: 3,
        title: 'Phase 3 — UX Architecture',
        description: 'Information architecture, user flows, navigation structure, wireframing, low-fidelity prototyping, and early usability testing.',
        why_it_matters: 'Solid information architecture guarantees users can complete their goals with minimal cognitive load.',
        estimated_duration_weeks: 3,
        skills_covered: ['Information Architecture', 'User Flow Diagrams', 'Low-Fidelity Wireframes', 'Usability Testing Protocols', 'Design Iteration'],
        practical_milestone: 'Create a tested user flow and wireframe set.',
        completion_criteria: [
          'Comprehensive user flow mapping edge cases and error states',
          'Clickable low-fidelity wireframe prototype',
          'Documented usability test findings with iteration notes'
        ]
      },
      {
        phase_number: 4,
        title: 'Phase 4 — UI Design and Tools',
        description: 'Figma fundamentals, components, variants, Auto Layout, design systems, responsive design, interactive prototyping, and developer handoff.',
        why_it_matters: 'Modern digital product teams expect deep mastery of Figma components, variables, auto layout, and clean developer specs.',
        estimated_duration_weeks: 4,
        skills_covered: ['Figma Auto Layout 5.0', 'Component Variants & Properties', 'Design Token Variables', 'Interactive Micro-Interactions', 'Developer Handoff Specs'],
        practical_milestone: 'Design a responsive multi-screen interface with reusable components.',
        completion_criteria: [
          'Zero rigid static frames; 100% responsive Auto Layout',
          'Component library utilizing variants and design tokens',
          'High-fidelity interactive prototype demonstrating micro-interactions'
        ]
      },
      {
        phase_number: 5,
        title: 'Phase 5 — Product Thinking',
        description: 'Defining user problems, prioritizing requirements, balancing user needs and business goals, interpreting metrics, and cross-functional collaboration.',
        why_it_matters: 'Designers who understand business funnels, retention, and conversion become indispensable strategic leaders.',
        estimated_duration_weeks: 3,
        skills_covered: ['Product Requirement Prioritization', 'SUS Usability Scoring', 'A/B Testing Methodologies', 'Cross-Functional Collaboration'],
        practical_milestone: 'Improve an existing product flow using research and testing.',
        completion_criteria: [
          'Calculated benchmark SUS (System Usability Scale) score',
          'Documented design iterations directly tied to quantitative metrics'
        ]
      },
      {
        phase_number: 6,
        title: 'Phase 6 — Portfolio and Placement',
        description: 'Case-study structure, explaining design decisions, demonstrating research and iteration, presenting before-and-after results, and interview prep.',
        why_it_matters: 'Design hiring is almost entirely driven by case study depth, storytelling clarity, and whiteboard exercise performance.',
        estimated_duration_weeks: 4,
        skills_covered: ['Case Study Storytelling', 'Design Whiteboard Challenges', 'Critique & Defense Practice', 'Portfolio Site Architecture'],
        practical_milestone: 'Publish two or three strong case studies and a live portfolio website.',
        completion_criteria: [
          'Published live portfolio explaining process, decisions, and results',
          'Two deep-dive case studies with before/after usability metrics',
          'Demonstrated readiness for design whiteboard challenges'
        ]
      }
    ]
  },
  {
    id: 'track_aiml',
    title: 'AI/ML Engineer',
    category: 'Data & AI',
    level: 'Intermediate',
    estimated_duration_range: '4-6 Months',
    description: 'Build a roadmap from Python, linear algebra, and data wrangling to training supervised/unsupervised models, PyTorch deep learning, LLMs/RAG, and cloud model serving.',
    core_skills: ['Python for Data Science', 'NumPy & Pandas', 'Linear Algebra & Statistics', 'Scikit-Learn Pipelines', 'PyTorch & Neural Networks', 'LLMs & RAG Architectures', 'FastAPI Serving & Docker', 'ML System Design'],
    prerequisites: ['Python basics', 'Calculus and probability fundamentals'],
    typical_project_outcomes: [
      'Exploratory Data Analysis Report with Statistical Findings',
      'Supervised Machine Learning Model Comparison & SHAP Interpretability',
      'Deep Learning Image or Text Classifier with PyTorch',
      'Document-Grounded Semantic Search & RAG Assistant',
      'Containerized Model Serving API with Sub-100ms Inference'
    ],
    template_phases: [
      {
        phase_number: 1,
        title: 'Phase 1 — Programming and Mathematics',
        description: 'Python fundamentals, OOP, NumPy, pandas, data cleaning, descriptive statistics, probability, linear algebra, derivatives, and reproducible development.',
        why_it_matters: 'Machine learning relies fundamentally on matrix multiplications, eigenvalue decompositions, and gradient descent optimization.',
        estimated_duration_weeks: 3,
        skills_covered: ['Python OOP & Exceptions', 'NumPy Vectorized Ops', 'Pandas Data Wrangling', 'Linear Algebra & Matrices', 'Descriptive & Inferential Stats'],
        practical_milestone: 'Analyse a real dataset and document meaningful findings.',
        completion_criteria: [
          'Robust missing value and outlier treatment without data leakage',
          'Vectorized transformations without slow Python for-loops',
          'Reproducible Jupyter notebook with clear markdown explanations'
        ]
      },
      {
        phase_number: 2,
        title: 'Phase 2 — Data Analysis and Visualization',
        description: 'Exploratory data analysis, missing values, outliers, transformations, Matplotlib/Seaborn, statistical interpretation, and feature preparation.',
        why_it_matters: 'Understanding feature distributions and multi-collinearity prevents training flawed models on biased datasets.',
        estimated_duration_weeks: 3,
        skills_covered: ['Matplotlib & Seaborn Visualizations', 'Feature Correlation & Distributions', 'Hypothesis Testing', 'Data Leakage Awareness'],
        practical_milestone: 'Produce a reproducible exploratory data-analysis report.',
        completion_criteria: [
          'Clean distribution plots and correlation heatmaps',
          'Quantified statistical hypotheses and outlier diagnoses'
        ]
      },
      {
        phase_number: 3,
        title: 'Phase 3 — Machine Learning',
        description: 'Supervised and unsupervised learning, regression, classification, decision trees, ensemble methods, clustering, cross-validation, and metrics.',
        why_it_matters: 'Classical machine learning models like XGBoost remain the dominant solution for structured corporate tabular datasets.',
        estimated_duration_weeks: 4,
        skills_covered: ['Scikit-learn Pipelines', 'Ensemble Models (XGBoost/RandomForest)', 'Cross-Validation Strategies', 'Precision, Recall & ROC-AUC', 'Feature Importance'],
        practical_milestone: 'Train, evaluate, and compare models for a real problem.',
        completion_criteria: [
          'K-fold stratified cross-validation on train/validation/test splits',
          'Evaluation comparing baseline models with tuned ensembles',
          'Model interpretability analysis using feature importance or SHAP'
        ]
      },
      {
        phase_number: 4,
        title: 'Phase 4 — Deep Learning',
        description: 'Neural-network fundamentals, activation and loss functions, optimization, backpropagation, PyTorch, model training, and regularization.',
        why_it_matters: 'Neural networks are the foundational building block for modern computer vision, natural language processing, and multimodal systems.',
        estimated_duration_weeks: 4,
        skills_covered: ['PyTorch Tensors & Autograd', 'Loss Functions & Optimization (Adam)', 'Backpropagation Intuition', 'Regularization (Dropout & BatchNorm)', 'CNNs or Sequence Models'],
        practical_milestone: 'Build a small deep-learning project and evaluate its limitations.',
        completion_criteria: [
          'Training and validation loss convergence curves',
          'Effective prevention of overfitting via dropout or data augmentation',
          'Documented evaluation of model edge cases and failure modes'
        ]
      },
      {
        phase_number: 5,
        title: 'Phase 5 — Applied AI',
        description: 'Model inference, model versioning, APIs for serving, LLM fundamentals, embeddings, semantic search, RAG architectures, and responsible AI.',
        why_it_matters: 'Enterprise demand is surging for engineers who can construct grounded Retrieval-Augmented Generation workflows.',
        estimated_duration_weeks: 4,
        skills_covered: ['LLM APIs & Prompt Engineering', 'Embeddings & Vector Databases', 'RAG Pipelines & Chunking', 'Responsible AI & Hallucination Defense'],
        practical_milestone: 'Build an AI application with a clear use case and measurable evaluation.',
        completion_criteria: [
          'Grounded retrieval-augmented pipeline with source citations',
          'Evaluation dataset measuring retrieval accuracy and hallucination rate'
        ]
      },
      {
        phase_number: 6,
        title: 'Phase 6 — Deployment and Placement',
        description: 'Model serving, API integration, Docker deployment, monitoring, reproducibility, DSA revision, ML interview questions, and portfolio documentation.',
        why_it_matters: 'Recruiters seek candidates who can deploy containerized APIs and articulate system trade-offs clearly.',
        estimated_duration_weeks: 4,
        skills_covered: ['FastAPI Inference Endpoints', 'Docker Containerization', 'ML System Design Revision', 'Coding & DSA Practice', 'Portfolio Presentation'],
        practical_milestone: 'Deploy a containerized model inference API with documentation and a working demo.',
        completion_criteria: [
          'Documented FastAPI model inference endpoint with sub-100ms latency',
          'Pinned Docker configuration running reproducibly in cloud environments',
          'Comprehensive project documentation and architecture diagram'
        ]
      }
    ]
  },
  {
    id: 'track_data_analyst',
    title: 'Data Analyst',
    category: 'Data & AI',
    level: 'Beginner-friendly',
    estimated_duration_range: '2-4 Months',
    description: 'Harness advanced SQL, Power BI/Tableau, and Python to translate raw enterprise data into executive-level dashboards and strategic business insights.',
    core_skills: ['Advanced SQL (Window Functions & CTEs)', 'Power BI / Tableau', 'Excel Financial Modeling', 'Python Data Cleaning', 'Business Metrics (CAC, LTV, Churn)', 'Data Storytelling'],
    prerequisites: ['Analytical curiosity', 'Basic arithmetic & spreadsheet familiarity'],
    typical_project_outcomes: [
      'Multi-Table Analytical SQL Query Suite with Window Aggregations',
      'Automated Data Cleansing & Normalization Script in Python',
      'Interactive 3-Page Executive Business Intelligence Dashboard',
      'Comprehensive Customer Cohort Retention & Churn Case Study'
    ],
    template_phases: [
      {
        phase_number: 1,
        title: 'Phase 1 — Advanced SQL & Data Extraction',
        description: 'Complex joins, aggregations, window functions (ROW_NUMBER, DENSE_RANK, LAG/LEAD), subqueries, and Common Table Expressions (CTEs).',
        why_it_matters: 'SQL is the primary query language utilized across every major enterprise data warehouse in the world.',
        estimated_duration_weeks: 3,
        skills_covered: ['SQL Joins & Grouping', 'Window Functions', 'CTEs & Subqueries', 'Query Performance'],
        practical_milestone: 'Write analytical SQL queries solving 20 complex business questions on an e-commerce database.',
        completion_criteria: ['Optimized window queries with zero cartesian products', 'Documented execution plans']
      },
      {
        phase_number: 2,
        title: 'Phase 2 — Python for Automated Data Cleaning',
        description: 'Automating spreadsheet workflows using Pandas, handling messy formats, transforming dates, and exporting clean tabular schemas.',
        why_it_matters: 'Automating manual data cleanup saves enterprise teams dozens of recurring hours each reporting cycle.',
        estimated_duration_weeks: 3,
        skills_covered: ['Pandas Cleansing', 'Missing Value Imputation', 'Data Transformation', 'Automated Export'],
        practical_milestone: 'Build an automated Python data ingestion script that cleans raw sales logs.',
        completion_criteria: ['Automated anomaly flags', 'Exported normalized dataset ready for BI import']
      },
      {
        phase_number: 3,
        title: 'Phase 3 — Business Intelligence & Dashboarding',
        description: 'Star schema modeling in Power BI/Tableau, DAX measures, dynamic filtering, KPI cards, and accessible visual storytelling.',
        why_it_matters: 'Executive decision-makers rely on clear, interactive visual dashboards to steer corporate strategy.',
        estimated_duration_weeks: 4,
        skills_covered: ['Power BI / Tableau Modeling', 'DAX Time-Intelligence Measures', 'Dashboard UX Design', 'Executive Summaries'],
        practical_milestone: 'Build and publish an interactive business dashboard with dynamic filters and drill-downs.',
        completion_criteria: ['Verified star schema data model', 'Fast filter responsiveness without lag']
      },
      {
        phase_number: 4,
        title: 'Phase 4 — Business Storytelling & Placement Prep',
        description: 'Cohort analysis, customer lifetime value (LTV), unit economics, A/B test analysis, executive slide decks, and analyst case interviews.',
        why_it_matters: 'The best analysts communicate why numbers change and recommend concrete, profitable operational actions.',
        estimated_duration_weeks: 3,
        skills_covered: ['Cohort Retention Curves', 'Unit Economics (CAC/LTV)', 'Executive Presentation', 'Analyst Case Studies'],
        practical_milestone: 'Deliver an executive analytical presentation recommending strategic business improvements.',
        completion_criteria: ['Quantified financial impact in presentation', 'Clear actionable recommendations backed by data']
      }
    ]
  },
  {
    id: 'track_data_scientist',
    title: 'Data Scientist',
    category: 'Data & AI',
    level: 'Intermediate',
    estimated_duration_range: '4-6 Months',
    description: 'Bridge rigorous statistics, predictive modeling, experimental design (A/B testing), causal inference, and unstructured data processing.',
    core_skills: ['Inferential Statistics & Probability', 'Python & Scientific Stack', 'Predictive Modeling & Feature Engineering', 'A/B Testing & Causal Inference', 'NLP & Unstructured Text', 'Model Interpretability (SHAP)'],
    prerequisites: ['Linear algebra', 'Multivariable calculus', 'Intermediate Python'],
    typical_project_outcomes: [
      'A/B Testing Simulation with Statistical Power Justification',
      'Predictive Churn Classifier with Leakage-Free Preprocessing',
      'Unstructured Customer Review NLP Topic Modeling & Sentiment Pipeline',
      'End-to-End Scientific Case Study with Reproducible Artifacts'
    ],
    template_phases: [
      {
        phase_number: 1,
        title: 'Phase 1 — Experimental Design & Probability',
        description: 'Hypothesis testing, p-values, sample sizing, power calculations, variance reduction, and A/B test methodologies.',
        why_it_matters: 'Data science teams validate product experiments through statistical significance and rigorous causal reasoning.',
        estimated_duration_weeks: 3,
        skills_covered: ['Hypothesis Testing', 'Power Analysis', 'Sample Sizing', 'A/B Testing Frameworks'],
        practical_milestone: 'Design and simulate an A/B test experiment with sample size and power justification.',
        completion_criteria: ['Justified sample size calculation', 'Appropriate statistical test selection']
      },
      {
        phase_number: 2,
        title: 'Phase 2 — Advanced Feature Engineering & ML',
        description: 'Handling high-cardinality features, target encoding, interaction terms, gradient boosting tuning, and SHAP interpretability.',
        why_it_matters: 'Constructing predictive features from domain data is the single largest differentiator in real-world model accuracy.',
        estimated_duration_weeks: 4,
        skills_covered: ['Advanced Feature Engineering', 'Gradient Boosted Trees', 'Hyperparameter Optimization', 'SHAP Interpretability'],
        practical_milestone: 'Train and interpret a predictive model on a challenging real-world dataset.',
        completion_criteria: ['Leakage-free Scikit-learn pipeline', 'SHAP summary plots explaining individual predictions']
      },
      {
        phase_number: 3,
        title: 'Phase 3 — NLP & Unstructured Data',
        description: 'Text embeddings, transformer tokenization, sentiment classification, topic modeling, and clustering customer feedback.',
        why_it_matters: 'Unstructured text represents over 80% of all data generated across enterprise customer touchpoints.',
        estimated_duration_weeks: 4,
        skills_covered: ['Text Embeddings', 'Transformer Tokenization', 'Topic Modeling', 'Clustering Algorithms'],
        practical_milestone: 'Build an automated text classification and topic discovery pipeline on customer reviews.',
        completion_criteria: ['Strong F1 score across imbalanced classes', 'Meaningful clustered topic visualizations']
      }
    ]
  },
  {
    id: 'track_backend',
    title: 'Backend Developer',
    category: 'Engineering',
    level: 'Intermediate',
    estimated_duration_range: '3-5 Months',
    description: 'Master server-side engineering: high-throughput REST and gRPC services, relational database internals, Redis caching, message brokers, and microservices.',
    core_skills: ['Node.js / Go / Java', 'FastAPI / Express', 'PostgreSQL Internals & ACID', 'Redis Caching & PubSub', 'Kafka / RabbitMQ Queues', 'Docker & Microservices', 'High-Concurrency System Design'],
    prerequisites: ['Programming fundamentals in JS, Python, or Java'],
    typical_project_outcomes: [
      'Modular RESTful Service with Authentication & Middleware Pipeline',
      'Optimized Relational Database with Indexed Queries & Explain Plans',
      'Distributed Asynchronous Background Task Queue with Redis',
      'High-Concurrency Microservices Architecture with Rate Limiting'
    ],
    template_phases: [
      {
        phase_number: 1,
        title: 'Phase 1 — Server Architecture & Concurrency',
        description: 'Event loops, async I/O, memory management, HTTP/2 protocols, connection lifecycles, and structured middleware logging.',
        why_it_matters: 'Backend resilience starts with mastering asynchronous concurrency, memory limits, and request lifecycles.',
        estimated_duration_weeks: 3,
        skills_covered: ['Async Concurrency', 'HTTP Protocols', 'Middleware Architecture', 'Structured Logging'],
        practical_milestone: 'Build a modular backend server with custom routing, middleware chain, and logging.',
        completion_criteria: ['Zero unhandled exceptions', 'Structured JSON logs with correlation IDs']
      },
      {
        phase_number: 2,
        title: 'Phase 2 — Database Internals & Query Tuning',
        description: 'PostgreSQL transaction isolation levels, B-tree indexes, query explain plans, connection pooling, and migration strategies.',
        why_it_matters: 'Database bottlenecks cause the majority of production latency; tuning queries is a mandatory senior skill.',
        estimated_duration_weeks: 4,
        skills_covered: ['PostgreSQL Isolation Levels', 'EXPLAIN ANALYZE', 'Index Strategies', 'Connection Pooling'],
        practical_milestone: 'Benchmark and optimize slow database queries on a 1-million-row database.',
        completion_criteria: ['Over 75% reduction in query execution latency', 'Documented index strategy']
      },
      {
        phase_number: 3,
        title: 'Phase 3 — Caching, Queues & Distributed Systems',
        description: 'Redis cache-aside patterns, eviction policies, message queues with RabbitMQ/Kafka, idempotency, and distributed rate limiting.',
        why_it_matters: 'Asynchronous message queues decouple compute loads and guarantee uptime during sudden traffic surges.',
        estimated_duration_weeks: 4,
        skills_covered: ['Redis Caching', 'Message Brokers (RabbitMQ/Kafka)', 'Idempotency', 'Token Bucket Rate Limiting'],
        practical_milestone: 'Implement a distributed background processing queue with retry logic and dead-letter handling.',
        completion_criteria: ['Exponential backoff retry mechanism', 'Guaranteed idempotent message consumption']
      }
    ]
  },
  {
    id: 'track_frontend',
    title: 'Frontend Developer',
    category: 'Engineering',
    level: 'Beginner-friendly',
    estimated_duration_range: '3-5 Months',
    description: 'Master modern frontend engineering: TypeScript, React 19, responsive CSS, state management, Core Web Vitals optimization, accessibility, and component testing.',
    core_skills: ['Modern JavaScript & TypeScript', 'React 19 & Next.js', 'Responsive CSS & Tailwind', 'State Management (Zustand)', 'Core Web Vitals (LCP, INP, CLS)', 'WCAG 2.1 AA Accessibility', 'Unit & E2E Testing'],
    prerequisites: ['HTML and basic CSS knowledge'],
    typical_project_outcomes: [
      'Type-Safe Component Utility Library with Vitest Unit Tests',
      'Fluid 60fps Interactive Kanban Board with Custom Hooks',
      'Accessible Headless E-Commerce Interface with Server Components',
      'Lighthouse 95+ Optimized Web Application with Code Splitting'
    ],
    template_phases: [
      {
        phase_number: 1,
        title: 'Phase 1 — Advanced JavaScript & TypeScript',
        description: 'Closures, prototypes, generics, utility types, DOM events, and strict TypeScript compilation.',
        why_it_matters: 'Enterprise frontend codebases require strict TypeScript typing to prevent runtime errors and ensure scalability.',
        estimated_duration_weeks: 3,
        skills_covered: ['TypeScript Generics', 'Utility Types', 'Event Delegation', 'Module Bundling'],
        practical_milestone: 'Build a fully type-safe stateful utility library with unit tests.',
        completion_criteria: ['Zero "any" types in codebase', '100% test coverage on core utility logic']
      },
      {
        phase_number: 2,
        title: 'Phase 2 — React Architecture & State Management',
        description: 'Reconciliation, custom hooks, memoization (useMemo/useCallback), Zustand, and accessible interactive patterns.',
        why_it_matters: 'Writing fluid, responsive React applications requires deep knowledge of component rendering lifecycles.',
        estimated_duration_weeks: 4,
        skills_covered: ['React 19 Hooks', 'Custom Hook Design', 'Zustand State Management', 'Memoization & Profiling'],
        practical_milestone: 'Build an interactive dashboard with smooth drag-and-drop and real-time filtering.',
        completion_criteria: ['Zero redundant component re-renders', 'Sub-16ms frame budget maintained']
      },
      {
        phase_number: 3,
        title: 'Phase 3 — Core Web Vitals & Accessibility',
        description: 'LCP/INP/CLS metrics, ARIA attributes, screen-reader testing, bundle splitting, and automated Vitest testing.',
        why_it_matters: 'Top engineering teams rigorously measure performance via Core Web Vitals and mandate accessible software.',
        estimated_duration_weeks: 3,
        skills_covered: ['Core Web Vitals Optimization', 'WCAG 2.1 AA', 'Vitest & Testing Library', 'Dynamic Imports'],
        practical_milestone: 'Audit, refactor, and achieve 95+ Lighthouse score on a complex React web application.',
        completion_criteria: ['Lighthouse performance score >= 95', 'Complete keyboard navigation without focus traps']
      }
    ]
  },
  {
    id: 'track_devops',
    title: 'DevOps / Cloud Engineer',
    category: 'Cloud & Security',
    level: 'Intermediate',
    estimated_duration_range: '3-5 Months',
    description: 'Automate infrastructure as code, containerize services with Docker, orchestrate with Kubernetes, manage cloud infrastructure (AWS), and build robust CI/CD pipelines.',
    core_skills: ['Linux & Bash Scripting', 'Docker Multi-Stage Builds', 'Kubernetes Orchestration', 'AWS Fundamentals (EC2, S3, IAM)', 'Terraform Infrastructure as Code', 'GitHub Actions CI/CD', 'Prometheus & Grafana Observability'],
    prerequisites: ['Command line familiarity', 'Basic networking principles'],
    typical_project_outcomes: [
      'Multi-Stage Dockerized Web Application with Health Checks',
      'Automated GitHub Actions CI/CD Pipeline with Semantic Releases',
      'Terraform Declarative Cloud Infrastructure Blueprint',
      'Production Kubernetes Cluster with Ingress, TLS, & Prometheus Monitoring'
    ],
    template_phases: [
      {
        phase_number: 1,
        title: 'Phase 1 — Linux & Containerization',
        description: 'Linux systems, file permissions, shell scripting, networking, and Docker multi-stage build optimization.',
        why_it_matters: 'Containers are the universal currency of modern cloud computing; mastering Docker is essential.',
        estimated_duration_weeks: 3,
        skills_covered: ['Linux Systems Administration', 'Bash Automation', 'Docker Optimization', 'Container Networking'],
        practical_milestone: 'Containerize a multi-service web application with minimal image footprints and non-root users.',
        completion_criteria: ['Docker production image size < 150MB', 'Docker Compose with automated health checks']
      },
      {
        phase_number: 2,
        title: 'Phase 2 — CI/CD & Infrastructure as Code',
        description: 'GitHub Actions pipelines, automated test runs, environment secrets, and declarative provisioning with Terraform.',
        why_it_matters: 'Infrastructure as Code eliminates configuration drift and ensures repeatable, reliable deployments.',
        estimated_duration_weeks: 4,
        skills_covered: ['GitHub Actions Workflows', 'Terraform Modules', 'Secret Management', 'Automated Rollbacks'],
        practical_milestone: 'Provision cloud resources using Terraform and deploy code via automated CI/CD.',
        completion_criteria: ['Zero manual cloud clicks; 100% Terraform state', 'Automated test, lint, and deploy pipeline']
      },
      {
        phase_number: 3,
        title: 'Phase 3 — Kubernetes Orchestration & Observability',
        description: 'Pods, Deployments, Services, ConfigMaps, Ingress controllers, Helm charts, and metrics with Prometheus and Grafana.',
        why_it_matters: 'Kubernetes is the industry standard for resilient, self-healing microservice orchestration at scale.',
        estimated_duration_weeks: 4,
        skills_covered: ['Kubernetes Pods & Services', 'Helm Package Management', 'Prometheus Metrics', 'Grafana Dashboards'],
        practical_milestone: 'Deploy an autoscaling web service with live Grafana dashboards and alerts.',
        completion_criteria: ['Horizontal Pod Autoscaler (HPA) verified under load', 'Alerts triggered on simulated 500 errors']
      }
    ]
  },
  {
    id: 'track_cybersecurity',
    title: 'Cybersecurity Analyst',
    category: 'Cloud & Security',
    level: 'Intermediate',
    estimated_duration_range: '3-5 Months',
    description: 'Protect critical infrastructure by mastering networking protocols, Linux hardening, vulnerability auditing, OWASP Top 10 web defenses, SIEM log triage, and incident response.',
    core_skills: ['TCP/IP & Wireshark Traffic Analysis', 'Linux System Hardening', 'OWASP Top 10 Web Security', 'Vulnerability Assessment (Nmap)', 'SIEM Log Analysis', 'Incident Response Playbooks'],
    prerequisites: ['Networking fundamentals (TCP/IP)', 'Basic script editing'],
    typical_project_outcomes: [
      'Packet Inspection & Suspicious Network Traffic Analysis Report',
      'OWASP Top 10 Web Vulnerability Assessment & Penetration Report',
      'SIEM Automated Threat Detection Rule and Alert Dashboard',
      'Hardened Linux Server Blueprint with Strict Firewall & SSH Controls'
    ],
    template_phases: [
      {
        phase_number: 1,
        title: 'Phase 1 — Networking Protocols & Traffic Analysis',
        description: 'TCP/IP handshake, OSI model, packet capture with Wireshark, DNS/DHCP inspection, and port scanning with Nmap.',
        why_it_matters: 'Detecting network intrusions requires recognizing anomalous packet flows and unencrypted data leaks.',
        estimated_duration_weeks: 3,
        skills_covered: ['TCP/IP & OSI Model', 'Wireshark Packet Analysis', 'Nmap Port Scanning', 'Firewall Configurations'],
        practical_milestone: 'Capture and analyze network traffic traces to isolate suspicious IP communication.',
        completion_criteria: ['Identified protocol anomaly', 'Documented remediation firewall rule']
      },
      {
        phase_number: 2,
        title: 'Phase 2 — Web Application Security & OWASP Top 10',
        description: 'SQL injection, Cross-Site Scripting (XSS), CSRF, authentication bypass, and secure HTTP security headers.',
        why_it_matters: 'Web application attacks represent the largest attack surface targeted by threat actors today.',
        estimated_duration_weeks: 4,
        skills_covered: ['OWASP Top 10 Vulnerabilities', 'SQL Injection Mitigation', 'XSS Prevention', 'Security Headers (CSP/HSTS)'],
        practical_milestone: 'Audit a vulnerable web application, exploit vulnerabilities responsibly, and patch source code.',
        completion_criteria: ['Detailed vulnerability disclosure report', 'Verified source code patches eliminating vulnerabilities']
      },
      {
        phase_number: 3,
        title: 'Phase 3 — SIEM, Incident Response & Placement',
        description: 'Log analysis, threat detection rules, incident handling lifecycles, Security+ prep, and SOC analyst mock interviews.',
        why_it_matters: 'Security Operations Centers (SOC) hire analysts who can triage alerts rapidly and execute playbooks.',
        estimated_duration_weeks: 4,
        skills_covered: ['SIEM Alert Triage', 'Log Correlation', 'Incident Response Lifecycles', 'Security+ Fundamentals'],
        practical_milestone: 'Configure a SIEM dashboard to flag automated brute-force login attempts.',
        completion_criteria: ['Automated alert rule configured', 'Incident report following standard NIST guidelines']
      }
    ]
  },
  {
    id: 'track_qa',
    title: 'QA / Automation Engineer',
    category: 'Quality',
    level: 'Beginner-friendly',
    estimated_duration_range: '2-4 Months',
    description: 'Ensure software reliability through systematic test plan design, end-to-end browser automation with Playwright/Cypress, REST API testing, and performance benchmarking.',
    core_skills: ['Manual Testing & Test Case Design', 'Playwright / Cypress Automation', 'Page Object Model (POM)', 'Postman / REST API Testing', 'Performance Testing with k6', 'CI/CD Automated Test Suites'],
    prerequisites: ['Basic JavaScript or Python knowledge'],
    typical_project_outcomes: [
      'Comprehensive Test Strategy & Regression Matrix Document',
      'Robust End-to-End Test Suite with Page Object Model',
      'Automated REST API Contract Validation Suite in GitHub Actions',
      'k6 Performance & Stress Test Benchmark Report'
    ],
    template_phases: [
      {
        phase_number: 1,
        title: 'Phase 1 — Testing Methodologies & Test Design',
        description: 'Boundary value analysis, equivalence partitioning, test plan authoring, regression matrices, and defect reporting.',
        why_it_matters: 'Automating flawed test cases yields zero value; strong test architecture starts with systematic test design.',
        estimated_duration_weeks: 3,
        skills_covered: ['Test Case Design', 'Boundary Value Analysis', 'Defect Life Cycle', 'Regression Test Planning'],
        practical_milestone: 'Write an end-to-end test strategy document and 30 test cases for an authenticated portal.',
        completion_criteria: ['Covered happy path and critical edge cases', 'Clear defect severity/priority classifications']
      },
      {
        phase_number: 2,
        title: 'Phase 2 — Browser Automation with Playwright',
        description: 'Page Object Model (POM), locator strategies, asynchronous assertions, cross-browser test suites, and parallel execution.',
        why_it_matters: 'Modern engineering teams run automated E2E tests before every production deployment.',
        estimated_duration_weeks: 4,
        skills_covered: ['Playwright Automation', 'Page Object Model', 'Asynchronous Assertions', 'Cross-Browser Testing'],
        practical_milestone: 'Develop a comprehensive automated test suite for an authenticated web portal.',
        completion_criteria: ['Robust POM architecture without brittle sleeps', 'Passed in headless mode on Chrome, Firefox, and WebKit']
      },
      {
        phase_number: 3,
        title: 'Phase 3 — API Testing, Performance & CI/CD',
        description: 'REST API contract testing, schema validation, performance testing with k6, and GitHub Actions test workflows.',
        why_it_matters: 'API tests are 10x faster and cheaper to run than browser tests in automated CI/CD pipelines.',
        estimated_duration_weeks: 3,
        skills_covered: ['API Automation', 'k6 Load Testing', 'GitHub Actions CI', 'Test Artifact Reporting'],
        practical_milestone: 'Set up a GitHub Actions workflow executing API and load tests on pull requests.',
        completion_criteria: ['Automated test report artifact generated', 'Load test identified latency degradation point']
      }
    ]
  }
];

export const INITIAL_RESOURCES: LearningResource[] = [
  {
    id: 'res_mdn_web',
    title: 'MDN Web Docs — Modern Web Standards',
    description: 'The definitive, open-source reference documentation for HTML5, CSS3, JavaScript standards, and Web APIs maintained by Mozilla.',
    resource_type: 'Documentation',
    provider: 'Mozilla Developer Network',
    url: 'https://developer.mozilla.org/en-US/',
    career_tracks: ['track_fullstack', 'track_frontend', 'track_uiux'],
    skills: ['HTML5 Semantic Markup', 'CSS Flexbox & Grid', 'JavaScript Async & Promises', 'DOM Manipulation'],
    difficulty: 'Beginner',
    language: 'English',
    price_status: 'Free',
    estimated_duration: 'Reference / Continuous',
    tags: ['Official', 'Standard', 'Web', 'Comprehensive'],
    verification_status: 'Verified Official'
  },
  {
    id: 'res_fcc_fullstack',
    title: 'freeCodeCamp Responsive Web & JavaScript Certification',
    description: 'Interactive coding curriculum with real-world browser-based challenges covering HTML, CSS, JavaScript algorithms, and projects.',
    resource_type: 'Course',
    provider: 'freeCodeCamp',
    url: 'https://www.freecodecamp.org/learn',
    career_tracks: ['track_fullstack', 'track_frontend'],
    skills: ['HTML5 Semantic Markup', 'CSS Flexbox & Grid', 'JavaScript Async & Promises', 'Git & GitHub Collaboration'],
    difficulty: 'Beginner',
    language: 'English',
    price_status: 'Free',
    estimated_duration: '300 Hours',
    tags: ['Interactive', 'Certificate', 'Hands-on', 'Free'],
    verification_status: 'Verified Platform'
  },
  {
    id: 'res_react_official',
    title: 'React.dev — The Official React Documentation',
    description: 'Official interactive documentation for React 19, emphasizing modern hooks, component lifecycle, rendering patterns, and thinking in React.',
    resource_type: 'Documentation',
    provider: 'React Core Team',
    url: 'https://react.dev',
    career_tracks: ['track_fullstack', 'track_frontend'],
    skills: ['React 19 Components & Hooks', 'Client-Side Routing', 'API Integration & Error Handling', 'React 19 Hooks'],
    difficulty: 'Intermediate',
    language: 'English',
    price_status: 'Free',
    estimated_duration: '20 Hours',
    tags: ['Official', 'React 19', 'Modern', 'Interactive'],
    verification_status: 'Verified Official'
  },
  {
    id: 'res_nodejs_guide',
    title: 'Node.js Official Developer Guides',
    description: 'Official guides on the Node.js event loop, asynchronous I/O, streams, buffers, file systems, and production security best practices.',
    resource_type: 'Documentation',
    provider: 'OpenJS Foundation',
    url: 'https://nodejs.org/en/learn',
    career_tracks: ['track_fullstack', 'track_backend'],
    skills: ['Node.js Event Loop & Streams', 'Express REST Architecture', 'JWT Authentication & Hashing', 'Async Concurrency'],
    difficulty: 'Intermediate',
    language: 'English',
    price_status: 'Free',
    estimated_duration: '15 Hours',
    tags: ['Official', 'Backend', 'Event Loop', 'Security'],
    verification_status: 'Verified Official'
  },
  {
    id: 'res_postgres_tutorial',
    title: 'PostgreSQL Official Tutorial and Documentation',
    description: 'Comprehensive reference covering SQL queries, relational joins, indexes, ACID transactions, and EXPLAIN query plan optimization.',
    resource_type: 'Documentation',
    provider: 'PostgreSQL Global Development Group',
    url: 'https://www.postgresql.org/docs/',
    career_tracks: ['track_fullstack', 'track_backend', 'track_data_analyst'],
    skills: ['PostgreSQL & SQL Joins', 'Data Modeling & Normalization', 'PostgreSQL Isolation Levels', 'SQL Joins & Grouping'],
    difficulty: 'Intermediate',
    language: 'English',
    price_status: 'Free',
    estimated_duration: '25 Hours',
    tags: ['Relational DB', 'SQL', 'ACID', 'Official'],
    verification_status: 'Verified Official'
  },
  {
    id: 'res_figma_learn',
    title: 'Figma Help Center & Design System Tutorials',
    description: 'Official tutorials from Figma covering Auto Layout, component variants, interactive prototyping, variables, and design tokens.',
    resource_type: 'Tutorial',
    provider: 'Figma',
    url: 'https://help.figma.com/hc/en-us',
    career_tracks: ['track_uiux', 'track_frontend'],
    skills: ['Figma Auto Layout 5.0', 'Component Variants & Properties', 'Design Token Variables', 'Interactive Micro-Interactions'],
    difficulty: 'Beginner',
    language: 'English',
    price_status: 'Free',
    estimated_duration: '15 Hours',
    tags: ['Design', 'Figma', 'Auto Layout', 'Official'],
    verification_status: 'Verified Official'
  },
  {
    id: 'res_nngroup_ux',
    title: 'Nielsen Norman Group — UX Research Articles',
    description: 'The gold-standard research articles on usability heuristics, user interview methodologies, information architecture, and accessibility.',
    resource_type: 'Article',
    provider: 'Nielsen Norman Group',
    url: 'https://www.nngroup.com/articles/',
    career_tracks: ['track_uiux'],
    skills: ['User Interview Methodologies', 'Persona Development', 'Information Architecture', 'WCAG 2.1 AA Standards'],
    difficulty: 'Intermediate',
    language: 'English',
    price_status: 'Free',
    estimated_duration: 'Continuous',
    tags: ['Heuristics', 'Research', 'Industry Benchmark'],
    verification_status: 'Verified Platform'
  },
  {
    id: 'res_scikit_learn',
    title: 'Scikit-Learn Machine Learning in Python',
    description: 'Clear algorithmic documentation and tutorials for classification, regression, clustering, model evaluation, and cross-validation pipelines.',
    resource_type: 'Documentation',
    provider: 'Inria / Scikit-Learn Consortium',
    url: 'https://scikit-learn.org/stable/user_guide.html',
    career_tracks: ['track_aiml', 'track_data_scientist'],
    skills: ['Scikit-learn Pipelines', 'Ensemble Models (XGBoost/RandomForest)', 'Cross-Validation Strategies', 'Precision, Recall & ROC-AUC'],
    difficulty: 'Intermediate',
    language: 'English',
    price_status: 'Free',
    estimated_duration: '30 Hours',
    tags: ['ML', 'Python', 'Algorithms', 'Official'],
    verification_status: 'Verified Official'
  },
  {
    id: 'res_pytorch_tutorials',
    title: 'PyTorch Official Deep Learning Tutorials',
    description: 'Hands-on tutorials for tensors, autograd, building neural networks, dataset loaders, and training loops on GPUs.',
    resource_type: 'Tutorial',
    provider: 'Linux Foundation / PyTorch Team',
    url: 'https://pytorch.org/tutorials/',
    career_tracks: ['track_aiml', 'track_data_scientist'],
    skills: ['PyTorch Tensors & Autograd', 'Loss Functions & Optimization (Adam)', 'Backpropagation Intuition', 'Regularization (Dropout & BatchNorm)'],
    difficulty: 'Intermediate',
    language: 'English',
    price_status: 'Free',
    estimated_duration: '40 Hours',
    tags: ['Deep Learning', 'Tensors', 'PyTorch', 'Official'],
    verification_status: 'Verified Official'
  },
  {
    id: 'res_docker_curriculum',
    title: 'Docker Getting Started Guide & Multi-Stage Builds',
    description: 'Practical guide to containerization, Dockerfiles, multi-stage optimization, Docker Compose, and container security.',
    resource_type: 'Documentation',
    provider: 'Docker Inc.',
    url: 'https://docs.docker.com/get-started/',
    career_tracks: ['track_fullstack', 'track_backend', 'track_devops', 'track_aiml'],
    skills: ['Docker Multi-Stage Builds', 'Docker Optimization', 'Container Networking', 'FastAPI Inference Endpoints'],
    difficulty: 'Beginner',
    language: 'English',
    price_status: 'Free',
    estimated_duration: '10 Hours',
    tags: ['DevOps', 'Containers', 'Docker', 'Official'],
    verification_status: 'Verified Official'
  },
  {
    id: 'res_owasp_top10',
    title: 'OWASP Top 10 Web Application Security Risks',
    description: 'Standard awareness document for developers and security specialists outlining critical web vulnerabilities and secure coding practices.',
    resource_type: 'Documentation',
    provider: 'OWASP Foundation',
    url: 'https://owasp.org/www-project-top-ten/',
    career_tracks: ['track_cybersecurity', 'track_backend', 'track_fullstack'],
    skills: ['OWASP Web Security Basics', 'OWASP Top 10 Vulnerabilities', 'SQL Injection Mitigation', 'XSS Prevention'],
    difficulty: 'Intermediate',
    language: 'English',
    price_status: 'Free',
    estimated_duration: '8 Hours',
    tags: ['Security', 'OWASP', 'Vulnerabilities', 'Standard'],
    verification_status: 'Verified Official'
  },
  {
    id: 'res_playwright_docs',
    title: 'Playwright for Fast and Reliable End-to-End Testing',
    description: 'Modern E2E testing framework docs covering cross-browser automation, Page Object Models, trace viewer, and CI integration.',
    resource_type: 'Documentation',
    provider: 'Microsoft',
    url: 'https://playwright.dev',
    career_tracks: ['track_qa', 'track_frontend', 'track_fullstack'],
    skills: ['Playwright Automation', 'Page Object Model', 'Asynchronous Assertions', 'Cross-Browser Testing'],
    difficulty: 'Beginner',
    language: 'English',
    price_status: 'Free',
    estimated_duration: '12 Hours',
    tags: ['QA', 'Testing', 'Automation', 'Official'],
    verification_status: 'Verified Official'
  }
];
