import {
  StudentProfile,
  SkillItem,
  ResumeData,
  Assessment,
  CareerGap,
  JobOpening,
  Company,
  Startup,
  Alumni,
  RecruiterContact,
  ReferralOpportunity,
  NetworkingEvent,
  ProgramOpportunity,
  PracticalExperienceProject,
  Application,
  CandidateShortlist,
  InterviewSchedule,
  CampusDrive,
  InterviewExperience,
  OfferDetails
} from '../types';

export const IS_DEMO_MODE = true;

export const mockStudentProfile: StudentProfile = {
  id: 'std_2026_042',
  name: 'Bhumit Gupta',
  email: 'bhumit.gupta@dypatil.edu',
  rollNo: '21CS1044',
  department: 'Computer Science & Engineering',
  degree: 'Bachelor of Technology (B.Tech)',
  batch: '2022 - 2026',
  graduationYear: 2026,
  cgpa: 8.84,
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
  bio: 'Full-stack software engineer passionate about distributed systems, modern web architectures, and developer tooling. Hackathon finalist & active open-source contributor.',
  githubUrl: 'https://github.com/bhumit9744',
  portfolioUrl: 'https://bhumit.dev',
  linkedinUrl: 'https://linkedin.com/in/bhumit9744',
  phone: '+91 98765 43210',
  activeBacklogs: 0,
  placementStatus: 'Eligible',
  projects: [
    {
      id: 'proj_1',
      title: 'Decentralized Placement Verification Engine',
      description: 'Built a cryptographic credential and evidence validation ledger for university degrees and skill proofs with sub-second verification latency.',
      techStack: ['React', 'TypeScript', 'FastAPI', 'PostgreSQL', 'Docker'],
      githubUrl: 'https://github.com/bhumit9744/dypdyp',
      liveDemoUrl: 'https://placement-hub.dyp.edu',
      stars: 48,
      featured: true,
    },
    {
      id: 'proj_2',
      title: 'Robofest Autonomous Telemetry Dashboard',
      description: 'High-frequency telemetry visualization platform parsing real-time sensor streams via WebSockets with interactive 60fps canvas charts.',
      techStack: ['React', 'TailwindCSS', 'WebSockets', 'Python'],
      githubUrl: 'https://github.com/bhumit9744/robofest-telemetry',
      stars: 32,
      featured: true,
    },
    {
      id: 'proj_3',
      title: 'Veda GSAP Micro-Interactions Library',
      description: 'Accessible micro-interaction kit for enterprise dashboards with zero layout shifts and reduced-motion fallbacks.',
      techStack: ['TypeScript', 'GSAP', 'CSS Modules'],
      githubUrl: 'https://github.com/bhumit9744/veda-gsap',
      stars: 76,
      featured: false,
    }
  ]
};

export const mockSkills: SkillItem[] = [
  {
    id: 'sk_1',
    name: 'React & React Native',
    category: 'Frontend',
    level: 'Advanced',
    verified: true,
    verificationSource: 'GitHub Repository',
    evidenceUrl: 'https://github.com/bhumit9744/dypdyp',
    endorsements: 14
  },
  {
    id: 'sk_2',
    name: 'TypeScript',
    category: 'Frontend',
    level: 'Advanced',
    verified: true,
    verificationSource: 'Proctored Assessment',
    evidenceUrl: 'https://assessments.placementhub.edu/cert/ts-982',
    endorsements: 19
  },
  {
    id: 'sk_3',
    name: 'Python & FastAPI',
    category: 'Backend',
    level: 'Advanced',
    verified: true,
    verificationSource: 'Hackathon Winner',
    evidenceUrl: 'https://hackathon.acm.org/projects/fastapi-winner',
    endorsements: 22
  },
  {
    id: 'sk_4',
    name: 'PostgreSQL & SQL Tuning',
    category: 'Database',
    level: 'Intermediate',
    verified: true,
    verificationSource: 'Coursework',
    evidenceUrl: 'https://dyp.edu/grades/cs304-database-systems',
    endorsements: 11
  },
  {
    id: 'sk_5',
    name: 'Docker & Containerization',
    category: 'DevOps',
    level: 'Intermediate',
    verified: false,
    endorsements: 7
  },
  {
    id: 'sk_6',
    name: 'Distributed Systems & Microservices',
    category: 'Fundamentals',
    level: 'Intermediate',
    verified: true,
    verificationSource: 'Coursework',
    evidenceUrl: 'https://dyp.edu/grades/cs401-distrib-sys',
    endorsements: 9
  },
  {
    id: 'sk_7',
    name: 'Applied Machine Learning (LLM RAG)',
    category: 'AI / ML',
    level: 'Intermediate',
    verified: true,
    verificationSource: 'GitHub Repository',
    evidenceUrl: 'https://github.com/bhumit9744/rag-pipeline',
    endorsements: 13
  }
];

export const mockResumeData: ResumeData = {
  id: 'res_01',
  title: 'Full Stack & Distributed Systems Resume',
  targetRole: 'Software Development Engineer I (SDE-1)',
  lastUpdated: 'Today at 02:30 PM',
  atsScore: 92,
  atsBreakdown: {
    keywordMatch: 94,
    formatting: 96,
    quantifiedImpact: 88,
    skillRelevance: 90
  },
  summary: 'Detail-oriented Computer Science undergraduate with proven experience building high-throughput web applications, REST/gRPC microservices, and reactive data pipelines.',
  evidenceBackedClaims: 8,
  downloadUrl: '#'
};

export const mockAssessments: Assessment[] = [
  {
    id: 'as_1',
    title: 'Data Structures & Algorithms Benchmarking (LeetCode Medium/Hard)',
    category: 'Core Computer Science',
    durationMinutes: 90,
    totalQuestions: 4,
    score: 95,
    percentile: 98.4,
    status: 'Completed',
    completedDate: '2026-09-28',
    badge: 'Diamond Tier SDE Candidate',
    difficulty: 'Hard'
  },
  {
    id: 'as_2',
    title: 'System Design & Architectural Patterns',
    category: 'Architecture',
    durationMinutes: 60,
    totalQuestions: 20,
    score: 88,
    percentile: 92.1,
    status: 'Completed',
    completedDate: '2026-10-04',
    badge: 'System Architect Approved',
    difficulty: 'Hard'
  },
  {
    id: 'as_3',
    title: 'Modern React 19 & TypeScript Strict Mode Test',
    category: 'Frontend Engineering',
    durationMinutes: 45,
    totalQuestions: 25,
    score: 96,
    percentile: 99.0,
    status: 'Completed',
    completedDate: '2026-10-10',
    badge: 'Frontend Specialist',
    difficulty: 'Medium'
  },
  {
    id: 'as_4',
    title: 'Cloud Native Infrastructure (Kubernetes & AWS)',
    category: 'Cloud & DevOps',
    durationMinutes: 60,
    totalQuestions: 30,
    status: 'Available',
    difficulty: 'Medium'
  }
];

export const mockCareerGaps: CareerGap[] = [
  {
    skill: 'Kubernetes Cluster Architecture',
    importance: 'High',
    gapDescription: 'Top tier product companies (Uber, Atlassian) require container orchestration comprehension for backend roles.',
    learningResource: 'Hands-on K8s on Minikube & Service Mesh Lab',
    estimatedWeeks: 2
  },
  {
    skill: 'Distributed Caching (Redis Cluster)',
    importance: 'Medium',
    gapDescription: 'Cache invalidation strategies, write-through vs write-back caching benchmarks.',
    learningResource: 'Redis University: High Availability Design',
    estimatedWeeks: 1
  }
];

// MODULE A: Jobs & Internships
export const mockJobs: JobOpening[] = [
  {
    id: 'job_01',
    title: 'Member of Technical Staff - Backend (SDE-1)',
    companyId: 'comp_01',
    companyName: 'Atlassian',
    companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=128',
    location: 'Bengaluru (Hybrid)',
    workType: 'Hybrid',
    opportunityType: 'Full-time',
    packageLpa: 28.5,
    salaryOrStipendText: '₹ 28.5 LPA CTC (Base: ₹ 18 LPA + Stocks)',
    tier: 'Super Dream',
    deadline: '2026-10-25',
    requiredCgpa: 8.0,
    tags: ['Distributed Systems', 'Python / Java', 'Kafka', 'PostgreSQL'],
    description: 'We are seeking passionate new graduates to architect resilient services powering Jira and Confluence Cloud infrastructure globally.',
    requiredSkills: ['Python & FastAPI', 'TypeScript', 'PostgreSQL & SQL Tuning', 'Distributed Systems & Microservices'],
    sourceType: 'Campus Direct Drive',
    sourceUrl: 'https://atlassian.com/careers/grads-2026',
    isAlumniShared: false,
    matchScore: 94,
    matchReasons: {
      skillsMatch: '4 of 4 primary required skills verified through GitHub and course proofs.',
      academicMatch: 'CGPA 8.84 exceeds company eligibility cutoff of 8.00.',
      projectMatch: 'Decentralized Placement Ledger demonstrates distributed systems experience.'
    },
    isSaved: true,
    applied: true,
    dataSource: 'Source Verified'
  },
  {
    id: 'job_02',
    title: 'Software Development Engineer - Frontend Infrastructure',
    companyId: 'comp_02',
    companyName: 'Razorpay',
    companyLogo: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=128',
    location: 'Bengaluru / Remote',
    workType: 'Remote',
    opportunityType: 'Full-time',
    packageLpa: 22.0,
    salaryOrStipendText: '₹ 22.0 LPA CTC + Standard FinTech Benefits',
    tier: 'Super Dream',
    deadline: '2026-10-30',
    requiredCgpa: 7.5,
    tags: ['React 19', 'TypeScript', 'Fintech', 'Design Systems'],
    description: 'Help engineer the checkout surfaces powering 15M+ merchant transactions daily across India and Southeast Asia.',
    requiredSkills: ['React & React Native', 'TypeScript', 'PostgreSQL & SQL Tuning'],
    sourceType: 'Campus Direct Drive',
    sourceUrl: 'https://razorpay.com/jobs/sde-frontend',
    isAlumniShared: true,
    sharedByAlumniName: 'Aditya Kulkarni',
    sharedByAlumniRole: 'SDE-2 (Checkout)',
    matchScore: 91,
    matchReasons: {
      skillsMatch: 'Exemplary TypeScript & React verification score (99th percentile).',
      academicMatch: 'CGPA 8.84 is well above the 7.50 requirement.',
      projectMatch: 'Veda GSAP and Dashboard projects match their Design System focus.'
    },
    isSaved: false,
    applied: true,
    dataSource: 'Source Verified'
  },
  {
    id: 'job_03',
    title: 'Associate Cloud Solutions Architect Intern',
    companyId: 'comp_03',
    companyName: 'Amazon Web Services (AWS)',
    companyLogo: 'https://images.unsplash.com/photo-1523474253243-383a82926fd1?auto=format&fit=crop&q=80&w=128',
    location: 'Hyderabad / Pune',
    workType: 'On-site',
    opportunityType: '6-Month Co-op',
    packageLpa: 26.0,
    salaryOrStipendText: '₹ 80,000 / month stipend during co-op (PPO conversion ₹ 26 LPA)',
    tier: 'Super Dream',
    deadline: '2026-11-05',
    requiredCgpa: 8.0,
    tags: ['AWS', 'Python', 'Networking', 'Security'],
    description: 'Collaborate directly with enterprise architects to deploy scalable cloud services across compute, storage, and serverless pillars.',
    requiredSkills: ['Python & FastAPI', 'Docker & Containerization', 'Distributed Systems & Microservices'],
    sourceType: 'Campus Direct Drive',
    sourceUrl: 'https://amazon.jobs/student-programs',
    isAlumniShared: false,
    matchScore: 83,
    matchReasons: {
      skillsMatch: 'Matches 2 of 3 skills. Recommend completing the AWS Cloud Native assessment.',
      academicMatch: 'Meets academic benchmarks with 0 backlogs.',
      projectMatch: 'Telemetry visualization showcases real-time networking proficiency.'
    },
    isSaved: false,
    applied: false,
    dataSource: 'Source Verified'
  },
  {
    id: 'job_04',
    title: 'Full Stack Engineer (Core Platform)',
    companyId: 'comp_04',
    companyName: 'Zomato',
    companyLogo: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&q=80&w=128',
    location: 'Gurugram (On-site)',
    workType: 'On-site',
    opportunityType: 'Full-time',
    packageLpa: 18.0,
    salaryOrStipendText: '₹ 18.0 LPA fixed CTC',
    tier: 'Dream',
    deadline: '2026-11-02',
    requiredCgpa: 7.0,
    tags: ['React', 'Node.js', 'Redis', 'High Concurrency'],
    description: 'Work at the nexus of high scale ordering loops, delivery dispatch algorithms, and instant checkout flows.',
    requiredSkills: ['React & React Native', 'TypeScript', 'PostgreSQL & SQL Tuning'],
    sourceType: 'Off-Campus Verified',
    sourceUrl: 'https://zomato.com/careers',
    isAlumniShared: false,
    matchScore: 89,
    matchReasons: {
      skillsMatch: '3 of 3 core skills matched.',
      academicMatch: 'Exceeds threshold comfortably.',
      projectMatch: 'Previous projects showcase performance-first development.'
    },
    isDuplicateDetected: true,
    duplicateNotice: 'Duplicate listing cross-indexed from Off-Campus portal. You are eligible via DY Patil TPO direct channel.',
    isSaved: true,
    applied: false,
    dataSource: 'Source Verified'
  },
  {
    id: 'job_05',
    title: 'Summer SDE Intern - Cloud Core',
    companyId: 'comp_01',
    companyName: 'Atlassian',
    companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=128',
    location: 'Bengaluru (Hybrid)',
    workType: 'Hybrid',
    opportunityType: 'Summer Internship',
    salaryOrStipendText: '₹ 1,00,000 / month + Housing Allowance',
    tier: 'Super Dream',
    deadline: '2026-11-10',
    requiredCgpa: 8.0,
    tags: ['Go / Java', 'Docker', 'Kubernetes'],
    description: '8-week flagship summer internship program building developer tools inside Jira Service Management.',
    requiredSkills: ['Python & FastAPI', 'Distributed Systems & Microservices'],
    sourceType: 'Alumni Shared',
    sourceUrl: 'https://atlassian.com/internships',
    isAlumniShared: true,
    sharedByAlumniName: 'Pooja Deshmukh',
    sharedByAlumniRole: 'Senior SDE (Alumni 2022)',
    matchScore: 88,
    matchReasons: {
      skillsMatch: 'Verified distributed systems and algorithms competence.',
      academicMatch: 'Meets 8.00 cutoff.',
      projectMatch: 'Strong matching projects.'
    },
    isSaved: false,
    applied: false,
    dataSource: 'Source Verified'
  },
  {
    id: 'job_06',
    title: 'Founding Engineer Intern (AI Infrastructure)',
    companyId: 'comp_startup_01',
    companyName: 'DevZero',
    companyLogo: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=128',
    location: 'Bengaluru / San Francisco (Remote)',
    workType: 'Remote',
    opportunityType: 'Startup Internship',
    salaryOrStipendText: '₹ 50,000 / month + Pre-Seed ESOP Pool',
    tier: 'Startup',
    deadline: '2026-11-15',
    requiredCgpa: 7.0,
    tags: ['eBPF', 'Rust', 'Docker', 'Kubernetes'],
    description: 'Develop next-gen cloud development environments for engineers with sub-second ephemeral container spawns.',
    requiredSkills: ['Docker & Containerization', 'Distributed Systems & Microservices', 'Python & FastAPI'],
    sourceType: 'Alumni Shared',
    sourceUrl: 'https://devzero.io/careers',
    isAlumniShared: true,
    sharedByAlumniName: 'Aarav Mehta',
    sharedByAlumniRole: 'Core Contributor',
    matchScore: 86,
    matchReasons: {
      skillsMatch: 'Docker and networking evidence matched.',
      academicMatch: 'Eligible for startup quota.',
      projectMatch: 'Telemetry platform demonstrates systems depth.'
    },
    isSaved: true,
    applied: false,
    dataSource: 'Fictional Demo'
  }
];

// MODULE B: Companies (including companies with 0 vacancies)
export const mockCompanies: Company[] = [
  {
    id: 'comp_01',
    name: 'Atlassian',
    logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=128',
    industry: 'Enterprise SaaS & Developer Tools',
    headquarters: 'Sydney, Australia (India R&D: Bengaluru)',
    products: ['Jira Software', 'Confluence', 'Bitbucket', 'Loom', 'Trello'],
    tier: 'Super Dream',
    openRolesCount: 2,
    website: 'https://atlassian.com',
    careerPageUrl: 'https://atlassian.com/careers',
    description: 'Global maker of collaboration software powering software development workflows at 300,000+ organizations.',
    visitedDate: '2026-10-18',
    packageRange: '24.0 - 32.5 LPA',
    eligibilityCgpa: 8.0,
    hiredAlumniCount: 14,
    historicalHiringDisclosed: true,
    historicalHiringSummary: '14 DYP alumni hired across 2022-2025 batches (Average compensation: 26.5 LPA).',
    requiredSkills: ['Python', 'Java', 'Distributed Systems', 'Data Structures'],
    relevantAlumniNames: ['Pooja Deshmukh (Senior SDE)', 'Kiran Joshi (SDE-2)'],
    dataSource: 'Source Verified'
  },
  {
    id: 'comp_02',
    name: 'Razorpay',
    logo: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=128',
    industry: 'FinTech & Payments Infrastructure',
    headquarters: 'Bengaluru, India',
    products: ['Payment Gateway', 'RazorpayX Neo-banking', 'Turbo UPI', 'Payroll'],
    tier: 'Super Dream',
    openRolesCount: 1,
    website: 'https://razorpay.com',
    careerPageUrl: 'https://razorpay.com/jobs',
    description: 'India’s leading payments and banking platform for startups and digital businesses processing over $100B in TPV.',
    visitedDate: '2026-10-22',
    packageRange: '18.0 - 24.0 LPA',
    eligibilityCgpa: 7.5,
    hiredAlumniCount: 22,
    historicalHiringDisclosed: true,
    historicalHiringSummary: '22 DYP alumni placed since 2021 (Leading campus hiring partner for frontend engineering).',
    requiredSkills: ['React', 'TypeScript', 'Go', 'PostgreSQL'],
    relevantAlumniNames: ['Aditya Kulkarni (SDE-2)'],
    dataSource: 'Source Verified'
  },
  {
    id: 'comp_03',
    name: 'Amazon Web Services (AWS)',
    logo: 'https://images.unsplash.com/photo-1523474253243-383a82926fd1?auto=format&fit=crop&q=80&w=128',
    industry: 'Cloud Infrastructure & AI',
    headquarters: 'Seattle, USA (India Offices: Hyderabad, Bengaluru, Pune)',
    products: ['EC2', 'S3', 'Amazon Bedrock', 'Lambda', 'RDS'],
    tier: 'Super Dream',
    openRolesCount: 1,
    website: 'https://aws.amazon.com',
    careerPageUrl: 'https://amazon.jobs',
    description: 'The world’s most comprehensive cloud platform offering over 200 fully featured services from data centers globally.',
    visitedDate: '2026-11-05',
    packageRange: '25.0 - 35.0 LPA',
    eligibilityCgpa: 8.0,
    hiredAlumniCount: 31,
    historicalHiringDisclosed: true,
    historicalHiringSummary: '31 alumni in Solutions Architecture and SDE roles.',
    requiredSkills: ['Cloud Networking', 'Python', 'Linux Internals', 'Microservices'],
    relevantAlumniNames: ['Vivek Sharma (Solutions Architect)'],
    dataSource: 'Source Verified'
  },
  {
    id: 'comp_04',
    name: 'Zomato',
    logo: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&q=80&w=128',
    industry: 'Consumer Tech & Quick Commerce',
    headquarters: 'Gurugram, India',
    products: ['Zomato Delivery', 'Blinkit', 'Hyperpure', 'District'],
    tier: 'Dream',
    openRolesCount: 1,
    website: 'https://zomato.com',
    careerPageUrl: 'https://zomato.com/careers',
    description: 'Technology platform connecting customers, restaurant partners and delivery fleets across 1,000+ Indian cities.',
    visitedDate: '2026-11-12',
    packageRange: '16.0 - 20.0 LPA',
    eligibilityCgpa: 7.0,
    hiredAlumniCount: 18,
    historicalHiringDisclosed: true,
    historicalHiringSummary: '18 alumni placed with notable growth in Blinkit supply chain teams.',
    requiredSkills: ['React', 'Node.js', 'System Architecture', 'Redis'],
    relevantAlumniNames: ['Neha Patil (SDE-1)'],
    dataSource: 'Source Verified'
  },
  {
    id: 'comp_05_google',
    name: 'Google India',
    logo: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?auto=format&fit=crop&q=80&w=128',
    industry: 'Internet, Cloud & Artificial Intelligence',
    headquarters: 'Mountain View, USA (India: Bengaluru, Hyderabad)',
    products: ['Google Search', 'Android', 'Google Cloud Platform', 'YouTube', 'Gemini'],
    tier: 'Super Dream',
    openRolesCount: 0, // Explicitly 0 to satisfy requirement: "Companies must remain discoverable even with zero active vacancies."
    website: 'https://about.google',
    careerPageUrl: 'https://careers.google.com/locations/india',
    description: 'Alphabet’s flagship engineering company focusing on information organization, deep learning models, and hyperscale systems.',
    visitedDate: 'Spring Drive Slot (Pending TPO Confirmation)',
    packageRange: 'Undisclosed (Disclosed during off-campus/direct shortlists)',
    eligibilityCgpa: 8.5,
    hiredAlumniCount: 9,
    historicalHiringDisclosed: true,
    historicalHiringSummary: '9 alumni hired through national Google Summer of Code & Hackathon hiring challenges.',
    requiredSkills: ['C++', 'Algorithms', 'Distributed Computing', 'Machine Learning'],
    relevantAlumniNames: ['Tanmay Deshmukh (L4 SWE, Search)'],
    dataSource: 'Source Verified'
  },
  {
    id: 'comp_06_adobe',
    name: 'Adobe Systems',
    logo: 'https://images.unsplash.com/photo-1542744094-24638eff58bb?auto=format&fit=crop&q=80&w=128',
    industry: 'Digital Media & Creative Cloud',
    headquarters: 'San Jose, USA (India: Noida, Bengaluru)',
    products: ['Photoshop', 'Adobe Firefly', 'Illustrator', 'Experience Platform'],
    tier: 'Super Dream',
    openRolesCount: 0, // 0 vacancies
    website: 'https://adobe.com',
    careerPageUrl: 'https://adobe.com/careers',
    description: 'Pioneers in digital creativity, generative AI media synthesis, and global document standards.',
    visitedDate: 'Pool Drive Q1 2027',
    packageRange: '20.0 - 28.0 LPA',
    eligibilityCgpa: 8.0,
    hiredAlumniCount: 7,
    historicalHiringDisclosed: false,
    historicalHiringSummary: 'Historical salary and quota data undisclosed per corporate recruitment policy.',
    requiredSkills: ['C++', 'Computer Graphics', 'WebAssembly', 'Python'],
    relevantAlumniNames: ['Siddharth Rao (Member of Technical Staff)'],
    dataSource: 'Source Verified'
  }
];

// MODULE C: Startup Ecosystem
export const mockStartups: Startup[] = [
  {
    id: 'startup_01',
    name: 'DevZero',
    logo: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=128',
    tagline: 'Developer-first cloud environments & instant ephemeral workspaces',
    description: 'DevZero eliminates local setup friction by provisioning instant, secure cloud-based devboxes connected directly to production-like dependencies.',
    industry: 'Developer Tools & Cloud Infrastructure',
    headquarters: 'Bengaluru / Seattle',
    growthStage: 'Seed',
    fundingDisclosed: true,
    fundingAmount: '$5.3M (Led by Foundation Capital)',
    incubatorOrAccelerator: 'Y Combinator (W22)',
    products: ['DevZero Desktop CLI', 'Ephemeral Devboxes', 'Kubernetes Cloud Controller'],
    founderName: 'Debo Ray',
    founderRole: 'Co-Founder & CEO',
    founderContactChannel: 'Approved TPO Founder Direct Track (tpo-connect@devzero.io)',
    earlyTeamOpportunitiesCount: 2,
    mvpCollaborationOpen: true,
    mvpCollaborationDescription: 'Student capstone project: Building an open-source VSCode extension adapter for DevZero workspace previews.',
    website: 'https://devzero.io',
    requiredSkills: ['Docker', 'Rust', 'TypeScript', 'Kubernetes'],
    dataSource: 'Source Verified'
  },
  {
    id: 'startup_02',
    name: 'Sarvam AI',
    logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=128',
    tagline: 'Frontier foundational AI models tailored for Indian languages & enterprise stack',
    description: 'Building generative AI and speech foundation models optimized for India’s 22 official languages with cost-effective edge inference.',
    industry: 'Generative AI & LLMs',
    headquarters: 'Bengaluru, India',
    growthStage: 'Series A',
    fundingDisclosed: true,
    fundingAmount: '$41M (Led by Lightspeed Venture Partners, Peak XV)',
    incubatorOrAccelerator: 'Independent Indian DeepTech Lab',
    products: ['OpenHathi Hindi LLM', 'Sarvam Voice TTS/ASR Engine', 'Samvaad Agentic Platform'],
    founderName: 'Vivek Raghavan & Pratyush Kumar',
    founderRole: 'Co-Founders',
    founderContactChannel: 'Campus Research Grants Portal',
    earlyTeamOpportunitiesCount: 3,
    mvpCollaborationOpen: true,
    mvpCollaborationDescription: 'Collaborative evaluation benchmark: Validating Indic language tokenizers across regional engineering textbooks.',
    website: 'https://sarvam.ai',
    requiredSkills: ['PyTorch', 'Transformers', 'CUDA', 'Python'],
    dataSource: 'Source Verified'
  },
  {
    id: 'startup_03',
    name: 'Pixxel',
    logo: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=128',
    tagline: 'Building a hyperspectral satellite constellation to monitor Earth’s health',
    description: 'Pixxel is deploying high-resolution hyperspectral imagery satellites to detect invisible environmental changes, crop health, and gas emissions.',
    industry: 'SpaceTech & Geospatial Intelligence',
    headquarters: 'Bengaluru / Los Angeles',
    growthStage: 'Series B',
    fundingDisclosed: true,
    fundingAmount: '$71M (Supported by Google, Radical Ventures)',
    incubatorOrAccelerator: 'Techstars & IIIT Hyd Accelerator',
    products: ['Fireflies Constellation', 'Aurora GeoAI Analytics Engine'],
    founderName: 'Awais Ahmed & Kshitij Khandelwal',
    founderRole: 'Co-Founders',
    founderContactChannel: 'TPO Direct Dispatch for Electronics & CS students',
    earlyTeamOpportunitiesCount: 1,
    mvpCollaborationOpen: false,
    website: 'https://pixxel.space',
    requiredSkills: ['Python', 'Computer Vision', 'GIS', 'C++'],
    dataSource: 'Source Verified'
  },
  {
    id: 'startup_04',
    name: 'Kalam Labs',
    logo: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=128',
    tagline: 'Multiplayer gamified STEM learning metaverse for school students',
    description: 'Live interactive virtual world where K-12 students explore space missions, robotics, and coding through collaborative multiplayer gameplay.',
    industry: 'EdTech & Interactive Gaming',
    headquarters: 'Pune, India',
    growthStage: 'Pre-Seed',
    fundingDisclosed: false,
    fundingAmount: 'Undisclosed Pre-Seed (Angel backed)',
    incubatorOrAccelerator: 'Y Combinator W21',
    products: ['Kalam Space Missions Game', 'RoboCode 3D Arena'],
    founderName: 'Ahmad Fardan',
    founderRole: 'Founder',
    founderContactChannel: 'Direct Founder Telegram (@kalamfounder_dyp)',
    earlyTeamOpportunitiesCount: 2,
    mvpCollaborationOpen: true,
    mvpCollaborationDescription: 'MVP collaboration: Developing 3 WebGL mini-games simulating lunar rover physics.',
    website: 'https://kalamlabs.space',
    requiredSkills: ['Three.js', 'React', 'Node.js', 'WebSockets'],
    dataSource: 'Fictional Demo'
  }
];

// MODULE D: People, Alumni & Referrals
export const mockAlumni: Alumni[] = [
  {
    id: 'alm_01',
    name: 'Pooja Deshmukh',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=128',
    company: 'Atlassian',
    role: 'Senior Software Engineer (Jira Cloud Platform)',
    batch: 'Batch of 2022',
    department: 'Computer Science & Engineering',
    location: 'Bengaluru, India',
    linkedinUrl: 'https://linkedin.com/in/poojadeshmukh-fake',
    githubUrl: 'https://github.com/poojadeshmukh',
    willingToRefer: true,
    mentorshipAvailable: true,
    mentorshipTopics: ['System Design for Junior SDEs', 'Resume Review', 'Atlassian Culture Fit'],
    sharedJobCount: 2,
    isOptIn: true
  },
  {
    id: 'alm_02',
    name: 'Aditya Kulkarni',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=128',
    company: 'Razorpay',
    role: 'Software Engineer II (Checkout SRE & Frontend)',
    batch: 'Batch of 2023',
    department: 'Information Technology',
    location: 'Bengaluru, India',
    linkedinUrl: 'https://linkedin.com/in/adityakulkarni-fake',
    willingToRefer: true,
    mentorshipAvailable: true,
    mentorshipTopics: ['High-throughput Web Performance', 'React 19 internals'],
    sharedJobCount: 1,
    isOptIn: true
  },
  {
    id: 'alm_03',
    name: 'Sneha Patil',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=128',
    company: 'Microsoft',
    role: 'Product Manager (Azure Developer Experience)',
    batch: 'Batch of 2021',
    department: 'Computer Science',
    location: 'Hyderabad, India',
    linkedinUrl: 'https://linkedin.com/in/snehapatil-fake',
    willingToRefer: false,
    mentorshipAvailable: true,
    mentorshipTopics: ['Transitioning from SDE to Product Management'],
    sharedJobCount: 0,
    isOptIn: true
  }
];

export const mockRecruiters: RecruiterContact[] = [
  {
    id: 'rec_01',
    name: 'Shalini Nair',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=128',
    company: 'Atlassian University Relations',
    role: 'Lead Campus Recruiter (Western India)',
    hiringFocus: ['Graduate MTS 2026', 'Summer Interns 2027'],
    isOptIn: true,
    approvedContactChannel: 'TPO Direct Communication Desk',
    activeDrivesCount: 2
  },
  {
    id: 'rec_02',
    name: 'Karthik Raman',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=128',
    company: 'Razorpay Talent Acquisition',
    role: 'Senior Technical Talent Partner',
    hiringFocus: ['SDE-Frontend', 'Backend Microservices'],
    isOptIn: true,
    approvedContactChannel: 'Campus Placement Portal Desk',
    activeDrivesCount: 1
  }
];

export const mockNetworkingEvents: NetworkingEvent[] = [
  {
    id: 'event_01',
    title: 'Deconstructing Atlassian Systems: From Hackathon to Principal Engineer',
    eventType: 'Alumni Tech Talk',
    hostName: 'Pooja Deshmukh',
    hostCompany: 'Atlassian',
    hostAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=128',
    date: 'Oct 24, 2026',
    time: '06:00 PM - 07:15 PM IST',
    locationOrPlatform: 'Virtual Google Meet (Campus registered only)',
    attendeesCount: 142,
    meetUrl: 'https://meet.google.com/atlassian-alumni-dyp',
    isRegistered: true
  },
  {
    id: 'event_02',
    title: 'Cracking the Razorpay Virtual Onsite & Live Code Sandbox',
    eventType: 'Recruiter AMA',
    hostName: 'Karthik Raman & Aditya Kulkarni',
    hostCompany: 'Razorpay',
    hostAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=128',
    date: 'Oct 28, 2026',
    time: '05:30 PM - 06:45 PM IST',
    locationOrPlatform: 'Seminar Hall 3 & Hybrid Stream',
    attendeesCount: 98,
    meetUrl: 'https://zoom.us/j/rzp-campus-ama',
    isRegistered: false
  }
];

export const mockReferrals: ReferralOpportunity[] = [
  {
    id: 'ref_01',
    companyName: 'Atlassian',
    roleTitle: 'Graduate SDE 2026 Batch',
    alumniId: 'alm_01',
    alumniName: 'Pooja Deshmukh',
    alumniAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=128',
    location: 'Bengaluru (Hybrid)',
    status: 'Requested',
    eligibilityNotes: 'Must have strong DSA skills (LeetCode 300+ solved) and a verified GitHub project.',
    postedDate: '2026-10-12'
  },
  {
    id: 'ref_02',
    companyName: 'Razorpay',
    roleTitle: 'Frontend Engineer (Design Platform)',
    alumniId: 'alm_02',
    alumniName: 'Aditya Kulkarni',
    alumniAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=128',
    location: 'Bengaluru (Remote)',
    status: 'Open',
    eligibilityNotes: 'Looking for students with deep understanding of React DOM reconciler and Web Vitals.',
    postedDate: '2026-10-15'
  }
];

// MODULE E: Programs, Challenges & Experiences
export const mockPrograms: ProgramOpportunity[] = [
  {
    id: 'prog_01',
    title: 'Smart India Hackathon (SIH 2026 - Hardware & Software Edition)',
    organizer: 'Ministry of Education & AICTE',
    logo: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=128',
    opportunityType: 'Hackathon',
    eligibility: 'All B.Tech students (Teams of 6 with at least 1 female coder)',
    deadline: '2026-10-31',
    stipendOrGrant: '₹ 1,00,000 per problem statement winner grant',
    hasCertificate: true,
    prizeOrAward: '₹ 1,00,000 Cash Prize + Ministry Incubation Grant',
    hiringPathway: 'Shortlist PPO',
    mode: 'Hybrid',
    location: 'Grand Nodal Centers Across India',
    externalUrl: 'https://sih.gov.in',
    tags: ['National Hackathon', 'GovTech', 'AICTE Approved', 'Incubation'],
    registeredCount: 310,
    isRegistered: true,
    dataSource: 'Verified Partner'
  },
  {
    id: 'prog_02',
    title: 'Google Summer of Code (GSoC 2027 Pre-Registration Cohort)',
    organizer: 'Google Open Source Programs Office',
    logo: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?auto=format&fit=crop&q=80&w=128',
    opportunityType: 'Research Fellowship',
    eligibility: '18+ enrolled students with Git and open-source contribution history',
    deadline: '2026-11-20',
    stipendOrGrant: '₹ 1,50,000 to ₹ 3,00,000 stipend (tiered by project size)',
    hasCertificate: true,
    prizeOrAward: 'International Contributor Credential & Google Swag Kit',
    hiringPathway: 'Direct Fast-Track Interview',
    mode: 'Virtual',
    externalUrl: 'https://summerofcode.withgoogle.com',
    tags: ['Open Source', 'Stipend', 'Global Mentorship', 'Linux Foundation'],
    registeredCount: 84,
    isRegistered: false,
    dataSource: 'Verified Partner'
  },
  {
    id: 'prog_03',
    title: 'Flipkart GRiD 7.0 - National Tech Challenge',
    organizer: 'Flipkart Campus Recruitment',
    logo: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&q=80&w=128',
    opportunityType: 'Coding Competition',
    eligibility: 'B.Tech / M.Tech Batches 2026 & 2027 (No backlog restrictions)',
    deadline: '2026-11-08',
    stipendOrGrant: 'Fully paid virtual travel + Internship stipends',
    hasCertificate: true,
    prizeOrAward: '₹ 5,00,000 Pool + Direct SDE-1 Pre-Placement Interviews (PPIs)',
    hiringPathway: 'Direct Fast-Track Interview',
    mode: 'Virtual',
    externalUrl: 'https://unstop.com/competitions/flipkart-grid',
    tags: ['E-Commerce Tech', 'PPI Opportunity', 'National Rank'],
    registeredCount: 520,
    isRegistered: true,
    dataSource: 'Verified Partner'
  },
  {
    id: 'prog_04',
    title: 'DRDO Center for Artificial Intelligence & Robotics Fellowship',
    organizer: 'Defence Research and Development Organisation (CAIR)',
    logo: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=128',
    opportunityType: 'Academic Project',
    eligibility: 'CSE & ECE students with CGPA >= 8.5 and Indian Citizenship',
    deadline: '2026-11-18',
    stipendOrGrant: '₹ 25,000 / month research fellowship stipend',
    hasCertificate: true,
    prizeOrAward: 'Government Research Clearance Certificate & Defense Publication co-authorship',
    hiringPathway: 'Corporate Visibility',
    mode: 'In-Person',
    location: 'DRDO CAIR Labs, CV Raman Nagar, Bengaluru',
    externalUrl: 'https://drdo.gov.in/fellowships',
    tags: ['Defense AI', 'Autonomous Robotics', 'Cybersecurity', 'Govt Stipend'],
    registeredCount: 42,
    isRegistered: false,
    dataSource: 'Source Verified'
  }
];

// MODULE F: Projects, Freelance & Practical Experience
export const mockProjectsFreelance: PracticalExperienceProject[] = [
  {
    id: 'prac_01',
    title: 'Automated Placement Verification Smart Contract & Python API',
    sponsorName: 'DY Patil TPO Innovation Lab',
    sponsorLogo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=128',
    sponsorType: 'Company Sponsored',
    compensationType: 'Paid',
    compensationAmount: '₹ 25,000 fixed milestone stipend upon deployment',
    durationWeeks: 4,
    techStack: ['Python', 'FastAPI', 'PostgreSQL', 'Docker'],
    deliverablesSummary: 'Develop an automated RESTful service to parse student transcript PDFs and issue verifiable QR certificates for recruiter audit.',
    verificationBadgeAwarded: 'Production Systems Contributor Badge',
    status: 'Open',
    applied: true,
    dataSource: 'Verified Program'
  },
  {
    id: 'prac_02',
    title: 'PostgreSQL Query Latency Benchmarking for High-Frequency Telemetry',
    sponsorName: 'Robofest Autonomous Club',
    sponsorLogo: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=128',
    sponsorType: 'Startup Trial',
    compensationType: 'Paid',
    compensationAmount: '₹ 15,000 / month contract',
    durationWeeks: 3,
    techStack: ['PostgreSQL', 'TimescaleDB', 'Python', 'Grafana'],
    deliverablesSummary: 'Stress test 50,000 writes/sec telemetry database with partition tuning and explain analyze reports.',
    verificationBadgeAwarded: 'Database Performance Specialist',
    status: 'Open',
    applied: false,
    dataSource: 'Verified Program'
  },
  {
    id: 'prac_03',
    title: 'UI/UX Pro Max Open-Source Component Library Contributions',
    sponsorName: 'NextLevelBuilder OSS Foundation',
    sponsorLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=128',
    sponsorType: 'Open Source',
    compensationType: 'Portfolio-only',
    compensationAmount: 'Zero monetary payout (Official GitHub Contributor Recognition + Verified Credential)',
    durationWeeks: 2,
    techStack: ['React', 'TypeScript', 'Tailwind CSS', 'Vite'],
    deliverablesSummary: 'Author 5 accessible micro-interaction primitives for high-contrast dark mode enterprise dashboards.',
    verificationBadgeAwarded: 'Verified OSS Core Contributor',
    status: 'Open',
    applied: false,
    dataSource: 'Verified Program'
  },
  {
    id: 'prac_04',
    title: 'AI Video Translation Engine Micro-Task Contract',
    sponsorName: 'Stealth Video AI Studio',
    sponsorLogo: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=128',
    sponsorType: 'Freelance Contract',
    compensationType: 'Speculative',
    compensationAmount: 'Revenue share bounty on deployment + $500 milestone release',
    durationWeeks: 6,
    techStack: ['Python', 'FFmpeg', 'Whisper API', 'FastAPI'],
    deliverablesSummary: 'Build background audio extraction and automated subtitle alignment script for regional dialect videos.',
    verificationBadgeAwarded: 'AI Audio Engineering Specialist',
    status: 'Open',
    applied: false,
    dataSource: 'Fictional Demo'
  },
  {
    id: 'prac_05',
    title: 'Campus Student Developer Ambassador (GitHub Campus Program)',
    sponsorName: 'GitHub Education',
    sponsorLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=128',
    sponsorType: 'Campus Ambassador',
    compensationType: 'Compensation-unknown',
    compensationAmount: 'Compensation terms pending institutional sponsorship agreement (Swag + Conference Grants)',
    durationWeeks: 12,
    techStack: ['Git', 'GitHub Actions', 'Community Leadership'],
    deliverablesSummary: 'Host 3 on-campus workshops teaching Git branching strategies and pull request collaboration to 2nd year students.',
    verificationBadgeAwarded: 'GitHub Campus Leader Credential',
    status: 'Open',
    applied: false,
    dataSource: 'Source Verified'
  }
];

export const mockApplications: Application[] = [
  {
    id: 'app_01',
    jobId: 'job_01',
    jobTitle: 'Member of Technical Staff - Backend (SDE-1)',
    companyName: 'Atlassian',
    companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=128',
    packageLpa: 28.5,
    appliedDate: '2026-10-02',
    status: 'Interview',
    currentRound: 'Technical Round 2 (System Design)',
    nextStepDeadline: 'Tomorrow, 11:00 AM IST',
    matchScore: 94,
    source: 'Campus Direct Drive',
    opportunityType: 'Full-time',
    jobDescription: 'Architecting high-throughput distributed microservices in Go and Java. Owning Jira/Confluence core API reliability, database partitioning, and idempotency across event-driven messaging pipelines.',
    eligibilityCriteria: {
      minCgpa: 8.0,
      eligibleBranches: ['Computer Science', 'Information Technology', 'AI & DS'],
      maxBacklogs: 0
    },
    externalApplicationLink: 'https://careers.atlassian.com/jobs/9821',
    resumeVersion: {
      fileName: 'Bhumit_Gupta_Backend_SDE_v2.4.pdf',
      uploadedAt: 'Oct 02, 2026',
      atsScore: 94
    },
    supportingDocuments: [
      { name: 'Semester 6 Official Transcript', url: 'https://dyp.edu/transcripts/sem6-21cs1044.pdf', verified: true },
      { name: 'HackerRank DSA Verified Scorecard', url: 'https://hackerrank.com/certificates/dsa-adv', verified: true }
    ],
    privateNotes: 'David Chen emphasizes low latency and idempotent queue processing. Prepared sharding and read-replica replication lag mitigation for the Confluence scale scenario.',
    tasks: [
      { id: 'tsk_01', title: 'Complete Atlassian system design prep checklist', dueDate: 'Tonight', completed: false, type: 'InterviewPrep' },
      { id: 'tsk_02', title: 'Submit signed College NoC Form to TPO office', dueDate: 'Oct 20, 2026', completed: true, type: 'Document' }
    ],
    timeline: [
      { step: 'Application Submitted', date: 'Oct 02, 2026', completed: true, source: 'Student Reported' },
      { step: 'Online Assessment (DSA + Coding)', date: 'Oct 06, 2026', completed: true, source: 'College Verified Integration' },
      { step: 'Technical Round 1 (Algorithms)', date: 'Oct 12, 2026', completed: true, source: 'Recruiter Confirmed' },
      { step: 'Technical Round 2 (System Design)', date: 'Oct 17, 2026', completed: false, current: true, source: 'Recruiter Confirmed' },
      { step: 'Managerial & Values Round', date: 'Tentative Oct 22', completed: false, source: 'College Verified Integration' },
      { step: 'Final Offer Letter', date: 'TBD', completed: false, source: 'College Verified Integration' }
    ],
    updateHistory: [
      { step: 'Technical Round 2 Scheduled', date: 'Oct 14, 2026', source: 'Recruiter Confirmed', details: 'Interview link generated by David Chen for Oct 17 at 11:00 AM.' },
      { step: 'Technical Round 1 Cleared', date: 'Oct 13, 2026', source: 'College Verified Integration', details: 'Candidate scored 92/100 on tree serialization and DP challenge.' }
    ],
    isDuplicateWarning: false
  },
  {
    id: 'app_02',
    jobId: 'job_02',
    jobTitle: 'Software Development Engineer - Frontend Infrastructure',
    companyName: 'Razorpay',
    companyLogo: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=128',
    packageLpa: 22.0,
    appliedDate: '2026-10-08',
    status: 'Screening',
    currentRound: 'Online Take-home Assignment Evaluation',
    nextStepDeadline: 'In Review by Engineering Team',
    matchScore: 91,
    source: 'Alumni Referral',
    opportunityType: 'Full-time',
    jobDescription: 'Building high-performance checkout UI SDKs, optimizing Core Web Vitals, and maintaining design system tokens across millions of daily payment transactions.',
    eligibilityCriteria: {
      minCgpa: 7.5,
      eligibleBranches: ['Computer Science', 'Information Technology', 'E&TC'],
      maxBacklogs: 1
    },
    externalApplicationLink: 'https://razorpay.com/jobs/frontend-infra',
    resumeVersion: {
      fileName: 'Bhumit_Gupta_FullStack_React.pdf',
      uploadedAt: 'Oct 08, 2026',
      atsScore: 92
    },
    supportingDocuments: [
      { name: 'GitHub Architecture PR Evidence', url: 'https://github.com/bhumit9744', verified: true }
    ],
    privateNotes: 'Referred by alumnus Aniket Deshmukh (Frontend Lead @ Razorpay). Assignment submitted on Oct 11; waiting for review feedback.',
    tasks: [
      { id: 'tsk_03', title: 'Prepare sandbox demo of React 19 micro-frontend', dueDate: 'Oct 19, 2026', completed: false, type: 'InterviewPrep' }
    ],
    timeline: [
      { step: 'Alumni Referral Submitted', date: 'Oct 08, 2026', completed: true, source: 'Student Reported' },
      { step: 'Take-home Component Architecture Test', date: 'Oct 11, 2026', completed: true, current: true, source: 'College Verified Integration' },
      { step: 'Virtual Onsite Interview (2 Rounds)', date: 'Pending Review', completed: false, source: 'Recruiter Confirmed' },
      { step: 'Offer Confirmation', date: 'TBD', completed: false, source: 'College Verified Integration' }
    ],
    updateHistory: [
      { step: 'Take-home Project Received', date: 'Oct 11, 2026', source: 'Recruiter Confirmed', details: 'Automated test suite passed 18/18 test specs for latency benchmark.' }
    ],
    isDuplicateWarning: false
  },
  {
    id: 'app_03',
    jobId: 'job_05_mock',
    jobTitle: 'Junior Data Engineer',
    companyName: 'Morgan Stanley',
    companyLogo: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&q=80&w=128',
    packageLpa: 20.0,
    appliedDate: '2026-09-18',
    status: 'Offer',
    currentRound: 'Offer Letter Received (Decision pending)',
    nextStepDeadline: 'Acceptance required by Oct 24, 2026',
    matchScore: 88,
    source: 'Campus Direct Drive',
    opportunityType: 'Full-time',
    jobDescription: 'Data pipeline engineering with Apache Spark, Kafka, and Snowflake for global institutional trading desks and risk management systems.',
    eligibilityCriteria: {
      minCgpa: 8.5,
      eligibleBranches: ['Computer Science', 'Information Technology'],
      maxBacklogs: 0
    },
    externalApplicationLink: 'https://morganstanley.tal.net/vx/candidate/apply/10293',
    resumeVersion: {
      fileName: 'Bhumit_Gupta_Data_Core.pdf',
      uploadedAt: 'Sep 18, 2026',
      atsScore: 89
    },
    supportingDocuments: [
      { name: 'TPO Verification Card & Marksheets', url: 'https://dyp.edu/grades/ms-verified.pdf', verified: true },
      { name: 'Background Verification Clearance Doc', url: '#', verified: true }
    ],
    privateNotes: 'Offer received: ₹20 LPA CTC (₹15.5 LPA Base + ₹2.5 LPA Joining Bonus + ₹2.0 LPA Performance Bonus). Location: Mumbai Nesco.',
    tasks: [
      { id: 'tsk_04', title: 'Review non-compete clause & employment agreement', dueDate: 'Oct 22, 2026', completed: false, type: 'FollowUp' },
      { id: 'tsk_05', title: 'Submit medical fitness certificate to Morgan Stanley HR portal', dueDate: 'Oct 23, 2026', completed: false, type: 'Document' }
    ],
    timeline: [
      { step: 'Campus Registration', date: 'Sep 18, 2026', completed: true, source: 'College Verified Integration' },
      { step: 'Technical Evaluation (DSA + SQL)', date: 'Sep 24, 2026', completed: true, source: 'College Verified Integration' },
      { step: 'Managing Director & Partner Round', date: 'Oct 01, 2026', completed: true, source: 'Recruiter Confirmed' },
      { step: 'Official Offer Letter Issued', date: 'Oct 14, 2026', completed: true, current: true, source: 'College Verified Integration' }
    ],
    updateHistory: [
      { step: 'Official Offer Letter Dispatched', date: 'Oct 14, 2026', source: 'College Verified Integration', details: 'TPO Placement Cell verified signed digital offer letter #MS-CAMPUS-2026-904.' }
    ],
    isDuplicateWarning: false,
    offerDetails: {
      id: 'off_01',
      companyName: 'Morgan Stanley',
      role: 'Junior Data Engineer',
      baseSalaryLpa: 15.5,
      variableLpa: 2.5,
      stocksLpa: 2.0,
      totalCtcLpa: 20.0,
      location: 'Mumbai (Goregaon Nesco)',
      joiningDate: 'July 15, 2027',
      acceptanceDeadline: 'Oct 24, 2026',
      bondDetails: 'No mandatory service bond',
      status: 'Pending Decision',
      benefits: [
        'Comprehensive Medical Coverage (₹10L)',
        'Annual Relocation Allowance',
        'Hybrid 3/2 Work Policy',
        'CFA/Master Degree Tuition Assistance'
      ]
    }
  },
  {
    id: 'app_04',
    jobId: 'job_03',
    jobTitle: 'Software Development Engineer - SDE-1',
    companyName: 'Amazon',
    companyLogo: 'https://images.unsplash.com/photo-1523474255658-4af61b168344?auto=format&fit=crop&q=80&w=128',
    packageLpa: 24.0,
    appliedDate: '2026-10-15',
    status: 'Applied',
    currentRound: 'Application Screening & ATS Deduplication',
    nextStepDeadline: 'Under Recruiter Review',
    matchScore: 92,
    source: 'Explore Module',
    opportunityType: 'Full-time',
    jobDescription: 'Core SDE role for AWS Elastic Computing team. High scale cloud primitives, asynchronous event brokers, and multi-tenant isolation.',
    eligibilityCriteria: {
      minCgpa: 8.0,
      eligibleBranches: ['Computer Science', 'Information Technology', 'E&TC'],
      maxBacklogs: 0
    },
    externalApplicationLink: 'https://amazon.jobs/en/jobs/281903',
    resumeVersion: {
      fileName: 'Bhumit_Gupta_Backend_SDE_v2.4.pdf',
      uploadedAt: 'Oct 15, 2026',
      atsScore: 94
    },
    supportingDocuments: [],
    privateNotes: 'Applied directly from Placement Hub Explore section. Reviewing Amazon 16 Leadership Principles.',
    tasks: [
      { id: 'tsk_06', title: 'Practice Amazon LP Behavioral Scenarios (STAR format)', dueDate: 'Oct 21, 2026', completed: false, type: 'InterviewPrep' }
    ],
    timeline: [
      { step: 'Application Submitted via Portal', date: 'Oct 15, 2026', completed: true, current: true, source: 'Student Reported' },
      { step: 'Online Assessment (Amazon OA1/OA2)', date: 'Upcoming', completed: false, source: 'College Verified Integration' }
    ],
    updateHistory: [
      { step: 'Application Registered in Portal', date: 'Oct 15, 2026', source: 'Student Reported', details: 'Profile submitted with verified ATS resume v2.4.' }
    ],
    isDuplicateWarning: true,
    duplicateWarningText: 'You previously applied for "AWS Cloud Support Associate" on Amazon Jobs with the same email. Ensure this application is targeted specifically to SDE-1.'
  }
];

export const mockShortlists: CandidateShortlist[] = [
  {
    candidateId: 'cand_01',
    studentName: 'Bhumit Gupta',
    rollNo: '21CS1044',
    department: 'Computer Science',
    cgpa: 8.84,
    matchScore: 94,
    verifiedSkillsCount: 6,
    projectsCount: 3,
    status: 'Shortlisted',
    ranking: 1,
    topSkills: ['Python', 'FastAPI', 'React', 'Distributed Systems']
  },
  {
    candidateId: 'cand_02',
    studentName: 'Aarav Mehta',
    rollNo: '21CS1012',
    department: 'Computer Science',
    cgpa: 9.12,
    matchScore: 91,
    verifiedSkillsCount: 5,
    projectsCount: 2,
    status: 'Shortlisted',
    ranking: 2,
    topSkills: ['Java', 'Spring Boot', 'Kubernetes', 'MySQL']
  },
  {
    candidateId: 'cand_03',
    studentName: 'Ananya Sharma',
    rollNo: '21IT1008',
    department: 'Information Technology',
    cgpa: 8.95,
    matchScore: 88,
    verifiedSkillsCount: 5,
    projectsCount: 4,
    status: 'Waitlisted',
    ranking: 3,
    topSkills: ['React', 'Next.js', 'Node.js', 'MongoDB']
  },
  {
    candidateId: 'cand_04',
    studentName: 'Rohan Verma',
    rollNo: '21CS1089',
    department: 'Computer Science',
    cgpa: 8.21,
    matchScore: 82,
    verifiedSkillsCount: 4,
    projectsCount: 2,
    status: 'Under Review',
    ranking: 4,
    topSkills: ['C++', 'Python', 'PostgreSQL']
  }
];

export const mockCampusDrives: CampusDrive[] = [
  {
    id: 'drive_01',
    companyName: 'Atlassian',
    companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=128',
    role: 'Member of Technical Staff - Backend (SDE-1)',
    tier: 'Super Dream',
    packageRange: '₹ 28.50 LPA',
    driveDate: 'Oct 17, 2026',
    registrationDeadline: 'Oct 01, 2026 (Closed)',
    registrationStatus: 'Registered',
    branchEligibility: ['Computer Science', 'Information Technology', 'AI & DS'],
    minCgpa: 8.0,
    maxBacklogs: 0,
    selectionRounds: ['Online Assessment', 'Technical Round 1', 'Technical Round 2 (System Design)', 'Values Round'],
    instructions: 'Bring 2 printed copies of official TPO resume, institute ID card, and keep HackerRank profile public.',
    eligibilityAnalysis: {
      status: 'Eligible',
      metRequirements: [
        'CGPA: 8.84 (Requirement: ≥ 8.00)',
        'Active Backlogs: 0 (Requirement: 0)',
        'Branch: Computer Science (Approved)',
        'Verified HackerRank Coding Credential'
      ],
      unmetRequirements: [],
      unverifiedRequirements: []
    },
    officialShortlistPublished: true,
    officialShortlistCount: 14,
    nextRoundSchedule: 'Oct 17, 11:00 AM IST (Round 2)'
  },
  {
    id: 'drive_02',
    companyName: 'Deutsche Bank',
    companyLogo: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&q=80&w=128',
    role: 'Graduate Technology Associate',
    tier: 'Dream',
    packageRange: '₹ 19.60 LPA',
    driveDate: 'Oct 19, 2026',
    registrationDeadline: 'Oct 15, 2026',
    registrationStatus: 'Registered',
    branchEligibility: ['Computer Science', 'Information Technology', 'E&TC', 'Instrumentation'],
    minCgpa: 7.5,
    maxBacklogs: 0,
    selectionRounds: ['Aptitude + Coding Test', 'Technical Interview 1', 'Behavioral / HR'],
    instructions: 'Proctored coding round on HackerEarth. Ensure webcam and microphone permissions are tested in advance.',
    eligibilityAnalysis: {
      status: 'Eligible',
      metRequirements: [
        'CGPA: 8.84 (Requirement: ≥ 7.50)',
        'Branch: Computer Science (Approved)',
        'Backlogs: 0'
      ],
      unmetRequirements: [],
      unverifiedRequirements: ['Semester 6 Marksheet Attestation Pending at College TPO Desk']
    },
    officialShortlistPublished: true,
    officialShortlistCount: 22,
    nextRoundSchedule: 'Oct 19, 02:00 PM IST',
    scheduleConflictAlert: 'Caution: Deutsche Bank technical slot at 02:00 PM may overlap with College Mid-Semester Lab Assessment.'
  },
  {
    id: 'drive_03',
    companyName: 'Nvidia',
    companyLogo: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?auto=format&fit=crop&q=80&w=128',
    role: 'Systems Software Engineer (CUDA & High Performance)',
    tier: 'Super Dream',
    packageRange: '₹ 32.00 LPA',
    driveDate: 'Oct 28, 2026',
    registrationDeadline: 'Oct 23, 2026',
    registrationStatus: 'Not Registered',
    branchEligibility: ['Computer Science', 'Information Technology', 'E&TC'],
    minCgpa: 8.5,
    maxBacklogs: 0,
    selectionRounds: ['CUDA / C++ Diagnostic Test', 'Technical System Architecture', 'Director Interview'],
    instructions: 'Proficiency in C++, operating systems fundamentals, memory management, and GPU architecture required.',
    eligibilityAnalysis: {
      status: 'Eligible',
      metRequirements: [
        'CGPA: 8.84 (Requirement: ≥ 8.50)',
        'Branch: Computer Science',
        '0 Backlogs'
      ],
      unmetRequirements: [],
      unverifiedRequirements: ['Official TPO Approval Pending for High-Performance Elective']
    },
    officialShortlistPublished: false,
    officialShortlistCount: 0
  }
];

export const mockInterviews: InterviewSchedule[] = [
  {
    id: 'int_01',
    jobId: 'job_01',
    companyName: 'Atlassian',
    companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=128',
    roleTitle: 'MTS Backend (SDE-1)',
    roundName: 'Technical Round 2: Distributed Systems & DB Design',
    date: 'Tomorrow (Oct 17, 2026)',
    time: '11:00 AM - 12:15 PM IST',
    durationMinutes: 75,
    interviewer: 'David Chen (Principal Architect, Confluence)',
    meetUrl: 'https://zoom.us/j/atlassian-campus-round-2',
    status: 'Upcoming',
    preparationChecklist: [
      { item: 'Review CAP theorem & sharding tradeoffs', done: true },
      { item: 'Prepare walk-through of Placement Verification Engine', done: true },
      { item: 'Revise database connection pooling & query optimization', done: false },
      { item: 'Draft 3 questions for the interviewer regarding Atlassian team topology', done: true }
    ],
    notes: 'Focus on scale: handling 100k writes/sec with idempotent workers.',
    preparationTopics: [
      'Database Sharding & Consistent Hashing',
      'Event-Driven Idempotency with Kafka',
      'Microservice Circuit Breakers (Resilience4j / Envoy)',
      'ACID vs BASE in High-Throughput Read Replicas'
    ]
  },
  {
    id: 'int_02',
    jobId: 'job_02',
    companyName: 'Razorpay',
    companyLogo: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=128',
    roleTitle: 'Frontend Engineer',
    roundName: 'System Architecture & Web Vitals Deep-Dive',
    date: 'Oct 20, 2026',
    time: '03:00 PM - 04:00 PM IST',
    durationMinutes: 60,
    interviewer: 'Rohit K. (Frontend Staff Engineer)',
    meetUrl: 'https://meet.google.com/rzp-campus-tech',
    status: 'Upcoming',
    preparationChecklist: [
      { item: 'Inspect Core Web Vitals (INP, LCP, CLS) optimization strategies', done: true },
      { item: 'Review React 19 Actions & Server Component lifecycle', done: false },
      { item: 'Have local sandbox ready for live coding', done: false }
    ],
    notes: 'Live coding session will involve refactoring a laggy table component.',
    preparationTopics: [
      'Virtual Windowing for High-Volume Ledger Tables',
      'Minimizing Bundle Size & Code-Splitting Routes',
      'Safe Cross-Origin Payment Iframe Messaging'
    ]
  }
];

export const mockInterviewExperiences: InterviewExperience[] = [
  {
    id: 'exp_01',
    companyName: 'Google',
    companyLogo: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?auto=format&fit=crop&q=80&w=128',
    roleTitle: 'Software Development Engineer - SDE-1',
    recruitmentYear: 2026,
    recruitmentType: 'On-Campus TPO',
    authorName: 'Bhumit G.',
    authorBatch: '2026',
    isAnonymous: false,
    overallDifficulty: 'Hard',
    outcome: 'Offer Received',
    roundsBreakdown: [
      {
        roundNumber: 1,
        roundName: 'Online Coding Challenge',
        roundType: 'Online Assessment',
        duration: '90 mins',
        difficulty: 'Medium',
        description: 'Two algorithmic problems on Google internal platform. Focused on custom graph traversal and dynamic programming with bitmask.',
        questionsAsked: [
          'Minimum cost to connect all nodes with bidirectional weighted constraints.',
          'Dynamic programming problem: counting distinct subsequences under modulo.'
        ]
      },
      {
        roundNumber: 2,
        roundName: 'Technical Interview 1 (Data Structures & Graph Theory)',
        roundType: 'Technical Round 1',
        duration: '45 mins',
        difficulty: 'Hard',
        description: 'Live coding in Google Docs. Clean code, time complexity justification, and memory bounds required without IDE auto-complete.',
        questionsAsked: [
          'Design an in-memory LRU Cache with O(1) time complexity and expiration TTL.',
          'Given a directed cyclic graph, detect cycles and print the lexicographically smallest cycle.'
        ]
      },
      {
        roundNumber: 3,
        roundName: 'Technical Interview 2 (System Architecture & Concurrency)',
        roundType: 'Technical Round 2',
        duration: '45 mins',
        difficulty: 'Hard',
        description: 'Discussion on concurrent reader-writer locks, deadlock prevention, and distributed rate limiters.',
        questionsAsked: [
          'How would you implement a distributed sliding-window rate limiter handling 50k req/sec with Redis?',
          'Explain thread-safety in Go channels vs mutex synchronization.'
        ]
      },
      {
        roundNumber: 4,
        roundName: 'Googleyness & Leadership Values',
        roundType: 'Managerial / Behavioral',
        duration: '30 mins',
        difficulty: 'Medium',
        description: 'Behavioral scenarios on handling ambiguous project specs, constructive code reviews, and resolving engineering disagreements.',
        questionsAsked: [
          'Tell me about a time you had to pivot technical architecture mid-sprint.',
          'How do you manage bias in algorithmic decision making?'
        ]
      }
    ],
    technicalQuestions: [
      { topic: 'DSA', question: 'Implement LRU Cache with TTL expiry in O(1)', difficulty: 'Hard' },
      { topic: 'DSA', question: 'Find lexicographically smallest cycle in directed graph', difficulty: 'Hard' },
      { topic: 'Operating Systems', question: 'Explain reader-writer lock starvation prevention', difficulty: 'Medium' },
      { topic: 'System Design', question: 'Design distributed sliding-window rate limiter with Redis', difficulty: 'Hard' }
    ],
    studyMaterialsRecommended: [
      'LeetCode 75 Hard Problems (Graphs, DP, Trees)',
      'Designing Data-Intensive Applications (Martin Kleppmann)',
      'NeetCode 150 System Design Roadmap'
    ],
    preparationChecklist: [
      'Practice writing code on plain Google Docs without syntax highlighting',
      'State time and space complexity explicitly before writing code',
      'Clarify edge cases (null inputs, integer overflows, cycle guarantees) upfront'
    ],
    similarCompanyRecommendations: ['Microsoft', 'Amazon', 'Atlassian', 'Uber'],
    submissionDate: 'Oct 04, 2026',
    verificationBadge: 'TPO Verified Experience',
    helpfulCount: 42
  },
  {
    id: 'exp_02',
    companyName: 'Atlassian',
    companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=128',
    roleTitle: 'MTS Backend Engineer',
    recruitmentYear: 2025,
    recruitmentType: 'On-Campus TPO',
    authorName: 'Priya K.',
    authorBatch: '2025',
    isAnonymous: false,
    overallDifficulty: 'Medium',
    outcome: 'Offer Received',
    roundsBreakdown: [
      {
        roundNumber: 1,
        roundName: 'HackerRank Coding Assessment',
        roundType: 'Online Assessment',
        duration: '90 mins',
        difficulty: 'Medium',
        description: 'Three questions: string manipulation, prefix tree (Trie), and a SQL optimization query.',
        questionsAsked: [
          'Design an autocomplete system using Trie with word frequency ranking.',
          'SQL query to find top 3 departments with consecutive revenue growth.'
        ]
      },
      {
        roundNumber: 2,
        roundName: 'Technical Round 1 (Data Structures)',
        roundType: 'Technical Round 1',
        duration: '60 mins',
        difficulty: 'Medium',
        description: 'Code-pair session in HackerRank. Focus was on clean OOP abstractions and unit tests.',
        questionsAsked: [
          'Serialize and deserialize a binary tree into a string stream.',
          'Find longest consecutive sequence in an unsorted array in O(n) time.'
        ]
      },
      {
        roundNumber: 3,
        roundName: 'Technical Round 2 (System Architecture)',
        roundType: 'System Design',
        duration: '60 mins',
        difficulty: 'Hard',
        description: 'Designing Jira activity feed with pub/sub architecture and fan-out on write.',
        questionsAsked: [
          'Design an audit trail event log that preserves chronological ordering across distributed nodes.'
        ]
      }
    ],
    technicalQuestions: [
      { topic: 'DSA', question: 'Serialize and deserialize binary tree in O(n)', difficulty: 'Medium' },
      { topic: 'DSA', question: 'Longest consecutive sequence in unsorted array', difficulty: 'Medium' },
      { topic: 'DBMS', question: 'Explain indexing tradeoffs (B+ Tree vs Hash Index)', difficulty: 'Medium' },
      { topic: 'System Design', question: 'Design Jira activity feed with Kafka event bus', difficulty: 'Hard' }
    ],
    studyMaterialsRecommended: [
      'Grokking the System Design Interview',
      'Atlassian Engineering Blog (Microservices & Sharding)',
      'Striver SDE Sheet (Binary Trees & Tries)'
    ],
    preparationChecklist: [
      'Be very comfortable writing modular object-oriented classes in your chosen language',
      'Understand Atlassian values: "Open company, no bullshit", "Build with heart & balance"'
    ],
    similarCompanyRecommendations: ['Razorpay', 'Salesforce', 'Adobe', 'Intuit'],
    submissionDate: 'Sep 22, 2026',
    verificationBadge: 'TPO Verified Experience',
    helpfulCount: 38
  },
  {
    id: 'exp_03',
    companyName: 'Razorpay',
    companyLogo: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=128',
    roleTitle: 'Frontend Platform Engineer',
    recruitmentYear: 2026,
    recruitmentType: 'Referral',
    authorName: 'Anonymous Alumnus',
    authorBatch: '2026',
    isAnonymous: true,
    overallDifficulty: 'Medium',
    outcome: 'Rejected',
    roundsBreakdown: [
      {
        roundNumber: 1,
        roundName: 'Take-home Machine Coding Assignment',
        roundType: 'Online Assessment',
        duration: '48 hours',
        difficulty: 'Medium',
        description: 'Build a high-performance checkout cart with virtual scrolling, debounced coupon verification, and accessibility (a11y) standards.',
        questionsAsked: [
          'Implement zero-dependency virtual list in React for 10,000 transaction records.'
        ]
      },
      {
        roundNumber: 2,
        roundName: 'Web Performance & React Architecture',
        roundType: 'Technical Round 1',
        duration: '60 mins',
        difficulty: 'Hard',
        description: 'Deep dive into browser rendering engine, composite layers, layout thrashing, and React Fiber reconciliation.',
        questionsAsked: [
          'How does React schedule state updates in Concurrent Mode?',
          'What causes Interaction to Next Paint (INP) degradations and how do you remediate them?'
        ]
      }
    ],
    technicalQuestions: [
      { topic: 'Web / Frameworks', question: 'Explain React Fiber work loop and concurrent time-slicing', difficulty: 'Hard' },
      { topic: 'Web / Frameworks', question: 'Mitigate layout thrashing and optimize Core Web Vitals (INP/LCP)', difficulty: 'Medium' },
      { topic: 'Java', question: 'JavaScript Event Loop: Microtasks (Promises) vs Macrotasks (setTimeout)', difficulty: 'Medium' }
    ],
    studyMaterialsRecommended: [
      'Web.dev Core Web Vitals Official Guide',
      'Dan Abramov Overreacted Blog',
      'Frontend Masters: Advanced Web Performance'
    ],
    preparationChecklist: [
      'Profile performance in Chrome DevTools Performance panel before the interview',
      'Know keyboard navigation, ARIA attributes, and screen-reader accessibility'
    ],
    similarCompanyRecommendations: ['PhonePe', 'Cred', 'Swiggy', 'Zomato'],
    submissionDate: 'Oct 09, 2026',
    verificationBadge: 'Student Reported',
    helpfulCount: 19
  },
  {
    id: 'exp_04',
    companyName: 'Microsoft',
    companyLogo: 'https://images.unsplash.com/photo-1642132652075-2b23a9d94519?auto=format&fit=crop&q=80&w=128',
    roleTitle: 'Software Engineer - Core Cloud',
    recruitmentYear: 2025,
    recruitmentType: 'On-Campus TPO',
    authorName: 'Siddharth M.',
    authorBatch: '2025',
    isAnonymous: false,
    overallDifficulty: 'Medium',
    outcome: 'Offer Received',
    roundsBreakdown: [
      {
        roundNumber: 1,
        roundName: 'Online Coding Test (Codility)',
        roundType: 'Online Assessment',
        duration: '75 mins',
        difficulty: 'Medium',
        description: 'Three problems covering sliding window, topological sort, and bitwise operations.',
        questionsAsked: [
          'Sliding window maximum with deque.',
          'Course Schedule II (Topological sorting with cycle detection).'
        ]
      },
      {
        roundNumber: 2,
        roundName: 'Technical Round 1',
        roundType: 'Technical Round 1',
        duration: '45 mins',
        difficulty: 'Medium',
        description: 'Binary Search Trees and recursion. Problem was extended to self-balancing AVL trees.',
        questionsAsked: [
          'Lowest Common Ancestor in Binary Tree (not BST).',
          'Inorder successor in BST without parent pointer.'
        ]
      },
      {
        roundNumber: 3,
        roundName: 'Technical Round 2 (OS & Networks)',
        roundType: 'Technical Round 2',
        duration: '45 mins',
        difficulty: 'Medium',
        description: 'Operating systems memory paging, virtual memory, TCP handshake, and socket programming.',
        questionsAsked: [
          'Explain virtual memory, page tables, and Translation Lookaside Buffer (TLB).',
          'What happens during TCP 3-way handshake and 4-way termination?'
        ]
      }
    ],
    technicalQuestions: [
      { topic: 'DSA', question: 'Lowest Common Ancestor in Binary Tree in O(n)', difficulty: 'Medium' },
      { topic: 'Operating Systems', question: 'Virtual Memory, Page faults, and TLB lookup mechanics', difficulty: 'Medium' },
      { topic: 'Computer Networks', question: 'TCP 3-way handshake vs UDP connectionless protocol', difficulty: 'Medium' },
      { topic: 'DBMS', question: 'ACID properties and isolation levels (Dirty Read vs Phantom Read)', difficulty: 'Medium' }
    ],
    studyMaterialsRecommended: [
      'Operating Systems: Three Easy Pieces (Arpaci-Dusseau)',
      'Computer Networking: A Top-Down Approach (Kurose & Ross)',
      'LeetCode Top Microsoft Interview Questions'
    ],
    preparationChecklist: [
      'Revise CS fundamentals: OS, DBMS, Networks (do not skip these for Microsoft)',
      'Explain your thought process aloud before writing code'
    ],
    similarCompanyRecommendations: ['Google', 'Amazon', 'Oracle', 'Cisco'],
    submissionDate: 'Sep 15, 2026',
    verificationBadge: 'TPO Verified Experience',
    helpfulCount: 29
  }
];

