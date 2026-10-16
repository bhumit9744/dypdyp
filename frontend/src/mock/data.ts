import {
  StudentProfile,
  SkillItem,
  ResumeData,
  Assessment,
  CareerGap,
  JobOpening,
  Company,
  Alumni,
  ReferralOpportunity,
  Application,
  CandidateShortlist,
  InterviewSchedule
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

export const mockJobs: JobOpening[] = [
  {
    id: 'job_01',
    title: 'Member of Technical Staff - Backend (SDE-1)',
    companyId: 'comp_01',
    companyName: 'Atlassian',
    companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=128',
    location: 'Bengaluru (Hybrid)',
    workType: 'Hybrid',
    packageLpa: 28.5,
    tier: 'Super Dream',
    deadline: '2026-10-25',
    requiredCgpa: 8.0,
    tags: ['Distributed Systems', 'Python / Java', 'Kafka', 'PostgreSQL'],
    description: 'We are seeking passionate new graduates to architect resilient services powering Jira and Confluence Cloud infrastructure globally.',
    requiredSkills: ['Python & FastAPI', 'TypeScript', 'PostgreSQL & SQL Tuning', 'Distributed Systems & Microservices'],
    matchScore: 94,
    matchReasons: {
      skillsMatch: '4 of 4 primary required skills verified through GitHub and course proofs.',
      academicMatch: 'CGPA 8.84 exceeds company eligibility cutoff of 8.00.',
      projectMatch: 'Decentralized Placement Ledger demonstrates distributed systems experience.'
    },
    applied: true
  },
  {
    id: 'job_02',
    title: 'Software Development Engineer - Frontend Infrastructure',
    companyId: 'comp_02',
    companyName: 'Razorpay',
    companyLogo: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=128',
    location: 'Bengaluru / Remote',
    workType: 'Remote',
    packageLpa: 22.0,
    tier: 'Super Dream',
    deadline: '2026-10-30',
    requiredCgpa: 7.5,
    tags: ['React 19', 'TypeScript', 'Fintech', 'Design Systems'],
    description: 'Help engineer the checkout surfaces powering 15M+ merchant transactions daily across India and Southeast Asia.',
    requiredSkills: ['React & React Native', 'TypeScript', 'PostgreSQL & SQL Tuning'],
    matchScore: 91,
    matchReasons: {
      skillsMatch: 'Exemplary TypeScript & React verification score (99th percentile).',
      academicMatch: 'CGPA 8.84 is well above the 7.50 requirement.',
      projectMatch: 'Veda GSAP and Dashboard projects match their Design System focus.'
    },
    applied: true
  },
  {
    id: 'job_03',
    title: 'Associate Cloud Solutions Architect',
    companyId: 'comp_03',
    companyName: 'Amazon Web Services (AWS)',
    companyLogo: 'https://images.unsplash.com/photo-1523474253243-383a82926fd1?auto=format&fit=crop&q=80&w=128',
    location: 'Hyderabad / Pune',
    workType: 'On-site',
    packageLpa: 26.0,
    tier: 'Super Dream',
    deadline: '2026-11-05',
    requiredCgpa: 8.0,
    tags: ['AWS', 'Python', 'Networking', 'Security'],
    description: 'Collaborate directly with enterprise architects to deploy scalable cloud services across compute, storage, and serverless pillars.',
    requiredSkills: ['Python & FastAPI', 'Docker & Containerization', 'Distributed Systems & Microservices'],
    matchScore: 83,
    matchReasons: {
      skillsMatch: 'Matches 2 of 3 skills. Recommend completing the AWS Cloud Native assessment.',
      academicMatch: 'Meets academic benchmarks with 0 backlogs.',
      projectMatch: 'Telemetry visualization showcases real-time networking proficiency.'
    },
    applied: false
  },
  {
    id: 'job_04',
    title: 'Full Stack Engineer (Core Platform)',
    companyId: 'comp_04',
    companyName: 'Zomato',
    companyLogo: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&q=80&w=128',
    location: 'Gurugram (On-site)',
    workType: 'On-site',
    packageLpa: 18.0,
    tier: 'Dream',
    deadline: '2026-11-02',
    requiredCgpa: 7.0,
    tags: ['React', 'Node.js', 'Redis', 'High Concurrency'],
    description: 'Work at the nexus of high scale ordering loops, delivery dispatch algorithms, and instant checkout flows.',
    requiredSkills: ['React & React Native', 'TypeScript', 'PostgreSQL & SQL Tuning'],
    matchScore: 89,
    matchReasons: {
      skillsMatch: '3 of 3 core skills matched.',
      academicMatch: 'Exceeds threshold comfortably.',
      projectMatch: 'Previous projects showcase performance-first development.'
    },
    isDuplicateDetected: true,
    duplicateNotice: 'Duplicate listing cross-indexed from Off-Campus portal. You are eligible via DY Patil TPO direct channel.',
    applied: false
  }
];

export const mockCompanies: Company[] = [
  {
    id: 'comp_01',
    name: 'Atlassian',
    logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=128',
    industry: 'Enterprise SaaS & Developer Tools',
    tier: 'Super Dream',
    openRolesCount: 3,
    website: 'https://atlassian.com/careers',
    description: 'Global maker of collaboration software including Jira, Confluence, Trello, and Bitbucket.',
    visitedDate: '2026-10-18',
    packageRange: '24.0 - 32.5 LPA',
    eligibilityCgpa: 8.0,
    hiredAlumniCount: 14,
    requiredSkills: ['Python', 'Java', 'Distributed Systems', 'Data Structures']
  },
  {
    id: 'comp_02',
    name: 'Razorpay',
    logo: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=128',
    industry: 'FinTech & Payments Infrastructure',
    tier: 'Super Dream',
    openRolesCount: 2,
    website: 'https://razorpay.com/jobs',
    description: 'Indias leading payments and banking platform for startups and enterprises.',
    visitedDate: '2026-10-22',
    packageRange: '18.0 - 24.0 LPA',
    eligibilityCgpa: 7.5,
    hiredAlumniCount: 22,
    requiredSkills: ['React', 'TypeScript', 'Go', 'PostgreSQL']
  },
  {
    id: 'comp_03',
    name: 'Amazon Web Services',
    logo: 'https://images.unsplash.com/photo-1523474253243-383a82926fd1?auto=format&fit=crop&q=80&w=128',
    industry: 'Cloud Infrastructure & AI',
    tier: 'Super Dream',
    openRolesCount: 5,
    website: 'https://aws.amazon.com',
    description: 'The worlds most comprehensive and broadly adopted cloud platform.',
    visitedDate: '2026-11-05',
    packageRange: '25.0 - 35.0 LPA',
    eligibilityCgpa: 8.0,
    hiredAlumniCount: 31,
    requiredSkills: ['Cloud Networking', 'Python', 'Linux Internals', 'Microservices']
  },
  {
    id: 'comp_04',
    name: 'Zomato',
    logo: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&q=80&w=128',
    industry: 'Consumer Tech & Logistics',
    tier: 'Dream',
    openRolesCount: 4,
    website: 'https://zomato.com/careers',
    description: 'Leading food delivery, quick commerce, and dining discovery giant.',
    visitedDate: '2026-11-12',
    packageRange: '16.0 - 20.0 LPA',
    eligibilityCgpa: 7.0,
    hiredAlumniCount: 18,
    requiredSkills: ['React', 'Node.js', 'System Architecture', 'Redis']
  }
];

export const mockAlumni: Alumni[] = [
  {
    id: 'alm_01',
    name: 'Pooja Deshmukh',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=128',
    company: 'Atlassian',
    role: 'Senior Software Engineer (Jira Platform)',
    batch: 'Batch of 2022',
    department: 'Computer Science',
    location: 'Bengaluru, India',
    linkedinUrl: 'https://linkedin.com',
    githubUrl: 'https://github.com',
    willingToRefer: true,
    mentorshipAvailable: true
  },
  {
    id: 'alm_02',
    name: 'Aditya Kulkarni',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=128',
    company: 'Razorpay',
    role: 'Software Engineer II (Checkout SRE)',
    batch: 'Batch of 2023',
    department: 'Information Technology',
    location: 'Bengaluru, India',
    linkedinUrl: 'https://linkedin.com',
    willingToRefer: true,
    mentorshipAvailable: false
  },
  {
    id: 'alm_03',
    name: 'Sneha Patil',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=128',
    company: 'Microsoft',
    role: 'Product Manager (Azure Core)',
    batch: 'Batch of 2021',
    department: 'Computer Science',
    location: 'Hyderabad, India',
    linkedinUrl: 'https://linkedin.com',
    willingToRefer: false,
    mentorshipAvailable: true
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
    timeline: [
      { step: 'Application Submitted', date: 'Oct 02, 2026', completed: true },
      { step: 'Online Assessment (DSA + Coding)', date: 'Oct 06, 2026', completed: true },
      { step: 'Technical Round 1 (Algorithms)', date: 'Oct 12, 2026', completed: true },
      { step: 'Technical Round 2 (System Design)', date: 'Oct 17, 2026', completed: false, current: true },
      { step: 'Managerial & Values Round', date: 'Tentative Oct 22', completed: false },
      { step: 'Final Offer Letter', date: 'TBD', completed: false }
    ]
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
    timeline: [
      { step: 'Application Submitted', date: 'Oct 08, 2026', completed: true },
      { step: 'Take-home Component Architecture Test', date: 'Oct 11, 2026', completed: true, current: true },
      { step: 'Virtual Onsite Interview (2 Rounds)', date: 'Pending Review', completed: false },
      { step: 'Offer Confirmation', date: 'TBD', completed: false }
    ]
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
    nextStepDeadline: 'Acceptance required by Oct 24',
    matchScore: 88,
    timeline: [
      { step: 'Application Submitted', date: 'Sep 18, 2026', completed: true },
      { step: 'Technical Evaluation', date: 'Sep 24, 2026', completed: true },
      { step: 'Partner Round', date: 'Oct 01, 2026', completed: true },
      { step: 'Offer Issued', date: 'Oct 14, 2026', completed: true, current: true }
    ]
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
    notes: 'Focus on scale: handling 100k writes/sec with idempotent workers.'
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
    notes: 'Live coding session will involve refactoring a laggy table component.'
  }
];
