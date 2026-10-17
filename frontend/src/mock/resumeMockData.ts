import {
  ResumeVersionSummary,
  FullResumeDocument,
  AlumniExample,
  BestRecommendation,
  ClaimVerification,
  ScoreReport,
  StylingConfig
} from '../types/resume';

export const MOCK_RESUME_SUMMARIES: ResumeVersionSummary[] = [
  {
    id: 'res_master_001',
    title: 'Master Full-Stack Engineer Resume',
    target_role: 'Full-Stack Software Engineer',
    target_company: 'All Top Tier Tech Companies',
    template_id: 'classic-professional',
    is_master: true,
    is_archived: false,
    last_updated: '2026-10-15T14:30:00Z',
    ats_score: 94,
    evidence_backed_claims: 8,
    summary: 'High-impact Full-Stack Software Engineer with React 19, TypeScript, and FastAPI expertise.'
  },
  {
    id: 'res_tailored_google',
    title: 'Google SWE — Tailored Edition',
    target_role: 'Software Engineer (Campus Hiring)',
    target_company: 'Google',
    template_id: 'modern-compact',
    is_master: false,
    is_archived: false,
    last_updated: '2026-10-16T18:00:00Z',
    ats_score: 96,
    evidence_backed_claims: 10,
    summary: 'Tailored for Google Software Engineering with emphasis on distributed systems and algorithms.'
  },
  {
    id: 'res_tailored_microsoft',
    title: 'Microsoft SDE — Systems & Cloud',
    target_role: 'Software Development Engineer 1',
    target_company: 'Microsoft',
    template_id: 'minimalist-ats',
    is_master: false,
    is_archived: false,
    last_updated: '2026-10-14T11:20:00Z',
    ats_score: 93,
    evidence_backed_claims: 9,
    summary: 'Tailored for Microsoft SDE-1 with cloud architecture and REST API microservices.'
  }
];

const mockStylingConfig: StylingConfig = {
  font_family: 'inter',
  font_size: '10pt',
  line_height: '1.4',
  margins: 'standard',
  accent_color: '#4f46e5'
};

const mockScoreReport: ScoreReport = {
  overall_score: 94,
  breakdown: {
    brevity: { score: 92, max: 100, label: 'Brevity', description: 'Concise 1-page structure with dense bullet points.' },
    impact: { score: 95, max: 100, label: 'Impact', description: 'Strong quantified results (38% latency reduction, 60fps).' },
    action_verbs: { score: 96, max: 100, label: 'Action Verbs', description: 'Strong leadership and execution verbs.' },
    skills_match: { score: 94, max: 100, label: 'Skills Match', description: 'Strong alignment with Software Engineer job postings.' },
    ats_formatting: { score: 98, max: 100, label: 'ATS Formatting', description: 'Standard single-column layout without tables or text boxes.' },
    evidence: { score: 95, max: 100, label: 'Evidence Verification', description: 'All major claims verified with official campus proofs.' }
  },
  matched_requirements: ['React 19', 'TypeScript', 'FastAPI', 'Python', 'Docker', 'PostgreSQL'],
  missing_requirements: [],
  unsupported_claims_count: 0,
  improvement_actions: ['Master resume is optimal for top campus recruitment drives.'],
  disclaimer: 'Score calculated via deterministic 6-category placement rubric.'
};

const mockEvidenceLinks: ClaimVerification[] = [
  {
    claim_id: 'ev_1',
    section: 'experience',
    statement: 'Architected and deployed asynchronous REST APIs using FastAPI and PostgreSQL, reducing endpoint response latency by 38%',
    status: 'Supported by linked evidence',
    evidence_source: 'github_repository',
    evidence_url: 'https://github.com/bhumit9744/dypdyp',
    evidence_strength: 'High',
    limitations: 'Verified via git commit telemetry and pull request logs'
  },
  {
    claim_id: 'ev_2',
    section: 'education',
    statement: 'Maintained 8.84 CGPA across Computer Science curriculum at Dr. D.Y. Patil College of Engineering',
    status: 'Supported by linked evidence',
    evidence_source: 'college_records',
    evidence_url: 'https://dypatil.edu/records',
    evidence_strength: 'High',
    limitations: 'Endorsed by campus TPO academic cell'
  }
];

export const MOCK_MASTER_RESUME: FullResumeDocument = {
  id: 'res_master_001',
  student_id: 'std_current_user',
  title: 'Master Full-Stack Engineer Resume',
  target_role: 'Full-Stack Software Engineer',
  target_company: 'Top Tier Tech Companies',
  template_id: 'classic-professional',
  is_master: true,
  is_archived: false,
  last_updated: '2026-10-15T14:30:00Z',
  ats_score: 94,
  evidence_backed_claims: 8,
  summary: 'High-impact Full-Stack Software Engineer with proven expertise in React 19, TypeScript, Python, FastAPI, and distributed database design.',
  content: {
    contact: {
      full_name: 'Bhumit Gupta',
      email: 'bhumit.gupta@dypatil.edu',
      phone: '+91 98765 43210',
      location: 'Pune, Maharashtra, India',
      linkedin: 'https://linkedin.com/in/bhumit9744',
      github: 'https://github.com/bhumit9744',
      portfolio: 'https://bhumit.dev'
    },
    summary:
      'High-impact Full-Stack Software Engineer with proven expertise in React 19, TypeScript, Python, FastAPI, and distributed database design. Experience developing low-latency verification engines and high-concurrency campus recruitment platforms with 99.9% uptime. Winner of university innovation hackathons with a focus on scalable cloud systems.',
    education: [
      {
        institution: 'Dr. D. Y. Patil College of Engineering, Akurdi, Pune',
        degree: 'Bachelor of Technology (B.Tech)',
        field: 'Computer Science & Engineering',
        start_year: '2022',
        end_year: '2026',
        score_or_cgpa: '8.84 / 10.0 CGPA',
        coursework: [
          'Data Structures & Algorithms',
          'Database Management Systems',
          'Operating Systems',
          'Computer Networks',
          'Cloud Computing',
          'System Design'
        ]
      }
    ],
    skills: [
      {
        category: 'Programming Languages',
        items: ['Python', 'TypeScript', 'JavaScript (ES6+)', 'SQL', 'C++', 'HTML5/CSS3']
      },
      {
        category: 'Frameworks & Libraries',
        items: ['React 19', 'FastAPI', 'Node.js', 'Express', 'TailwindCSS', 'Three.js', 'Next.js']
      },
      {
        category: 'Cloud & DevOps',
        items: ['Docker', 'Kubernetes', 'AWS (EC2, S3)', 'GitHub Actions CI/CD', 'Nginx', 'Linux']
      },
      {
        category: 'Databases & Tools',
        items: ['PostgreSQL', 'SQLite', 'Redis', 'Vapi Voice AI', 'Git', 'REST APIs', 'WebSockets']
      }
    ],
    experience: [
      {
        role: 'Full-Stack Software Engineering Intern',
        company: 'TechCorp Global Solutions',
        location: 'Pune, India',
        start_date: 'June 2025',
        end_date: 'August 2025',
        current: false,
        bullets: [
          'Architected and deployed asynchronous REST APIs using FastAPI and PostgreSQL, reducing endpoint response latency by 38% across 10,000+ daily queries.',
          'Engineered dynamic React 19 frontend interfaces with TailwindCSS and Vite, achieving sub-second first-contentful-paint (FCP) and a 100/100 Lighthouse score.',
          'Built automated CI/CD container deployment workflows using GitHub Actions and Docker, reducing deployment cycle times from weekly to continuous daily releases.'
        ]
      }
    ],
    projects: [
      {
        title: 'Placement Hub — AI Campus Recruitment & Placement Platform',
        tech_stack: ['React 19', 'TypeScript', 'FastAPI', 'Python', 'Gemini AI', 'Vapi'],
        bullets: [
          'Engineered an enterprise-grade full-stack placement portal integrating AI mock interview simulation, resume scoring, and end-to-end recruitment pipelines.',
          'Implemented client-side ATS Truth Verification engine cross-checking candidate resume claims against verified university academic records.',
          'Integrated Vapi Web SDK for low-latency voice-driven navigation and automated tool execution.'
        ],
        github_url: 'https://github.com/bhumit9744/dypdyp',
        live_url: 'https://bhumit9744.github.io/dypdyp/'
      },
      {
        title: 'Autonomous Robotics Telemetry & Sensor Dashboard',
        tech_stack: ['React', 'TypeScript', 'WebSockets', 'Chart.js', 'TailwindCSS'],
        bullets: [
          'Built high-frequency sensor telemetry visualization tool streaming real-time IoT metrics at 60fps via WebSocket channels.',
          'Optimized WebGL canvas rendering and state synchronization, reducing memory overhead by 45% during stress benchmarks.'
        ],
        github_url: 'https://github.com/bhumit9744/robofest-telemetry'
      }
    ],
    certifications: [
      {
        name: 'AWS Certified Cloud Practitioner',
        issuer: 'Amazon Web Services',
        issue_date: '2025',
        credential_url: 'https://aws.amazon.com/verification'
      },
      {
        name: 'Google Cloud Computing Foundations',
        issuer: 'Google Cloud Platform',
        issue_date: '2024',
        credential_url: 'https://cloud.google.com/certification'
      }
    ]
  },
  sections_order: ['contact', 'summary', 'education', 'skills', 'experience', 'projects', 'certifications'],
  styling_config: mockStylingConfig,
  scoring_report: mockScoreReport,
  evidence_links: mockEvidenceLinks,
  tailoring_history: []
};

export const MOCK_FULL_RESUMES: Record<string, FullResumeDocument> = {
  res_master_001: MOCK_MASTER_RESUME,
  res_tailored_google: {
    ...MOCK_MASTER_RESUME,
    id: 'res_tailored_google',
    title: 'Google SWE — Tailored Edition',
    target_role: 'Software Engineer (Campus Hiring)',
    target_company: 'Google',
    ats_score: 96
  },
  res_tailored_microsoft: {
    ...MOCK_MASTER_RESUME,
    id: 'res_tailored_microsoft',
    title: 'Microsoft SDE — Systems & Cloud',
    target_role: 'Software Development Engineer 1',
    target_company: 'Microsoft',
    ats_score: 93
  }
};

export const MOCK_ALUMNI_EXAMPLES: AlumniExample[] = [
  {
    id: 'alum_1',
    alumni_name: 'Aman Sharma',
    graduation_year: 2024,
    role: 'Software Engineer (L4)',
    industry: 'Consumer Technology / Cloud',
    template_id: 'classic-professional',
    placement_outcome: 'Selected — Google (42 LPA)',
    is_anonymized: false,
    skills: ['Go', 'C++', 'Kubernetes', 'Distributed Systems', 'Algorithms'],
    projects_summary: [
      'Engineered distributed caching layer handling 50,000 QPS with p99 latency < 5ms.',
      'Ranked in top 0.5% globally in Google Kickstart 2023 with algorithmic problem solving speed.'
    ],
    resume_content: MOCK_MASTER_RESUME.content
  },
  {
    id: 'alum_2',
    alumni_name: 'Priya Kulkarni',
    graduation_year: 2024,
    role: 'Software Development Engineer',
    industry: 'Enterprise Software / Cloud',
    template_id: 'modern-compact',
    placement_outcome: 'Selected — Microsoft (38 LPA)',
    is_anonymized: false,
    skills: ['TypeScript', 'C#', 'Azure', 'React', 'CosmosDB'],
    projects_summary: [
      'Built multi-tenant Azure microservice supporting 200,000 registered users with zero downtime.',
      'Won Microsoft Imagine Cup Regional Semi-Finals with healthcare accessibility tool.'
    ],
    resume_content: MOCK_MASTER_RESUME.content
  },
  {
    id: 'alum_3',
    alumni_name: 'Rohit Deshmukh',
    graduation_year: 2025,
    role: 'Software Engineer',
    industry: 'Developer Tools',
    template_id: 'minimalist-ats',
    placement_outcome: 'Selected — Atlassian (34 LPA)',
    is_anonymized: false,
    skills: ['React', 'TypeScript', 'Jest', 'GraphQL', 'Web Performance'],
    projects_summary: [
      'Refactored legacy UI components into modular React hooks, cutting bundle size by 42%.',
      'Implemented automated end-to-end testing suite with 92% code coverage using Playwright.'
    ],
    resume_content: MOCK_MASTER_RESUME.content
  }
];

export const MOCK_BEST_RECOMMENDATION: BestRecommendation = {
  recommended_version: {
    id: 'res_master_001',
    title: 'Master Full-Stack Engineer Resume',
    target_role: 'Full-Stack Software Engineer',
    target_company: 'Top Tier Tech Companies',
    overall_score: 94,
    composite_score: 94.5,
    evidence_backed_claims: 8
  },
  target_role: 'Full-Stack Software Engineer',
  reasons: [
    'Highest overall ATS score (94%) among all versions',
    '8 out of 8 claims backed by verified college and repository evidence',
    'Comprehensive full-stack balance across React 19, FastAPI, Docker, and PostgreSQL'
  ],
  all_comparisons: [
    { title: 'Master Full-Stack Engineer Resume', overall_score: 94, match: 'Best Match' },
    { title: 'Google SWE — Tailored Edition', overall_score: 96, match: 'Role Specialized' },
    { title: 'Microsoft SDE — Systems & Cloud', overall_score: 93, match: 'Role Specialized' }
  ],
  disclaimer: 'Deterministic evaluation based on verified academic credentials and project evidence.'
};
