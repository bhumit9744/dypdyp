import {
  OpportunityItem,
  SavedOpportunityItem,
  ProviderAuditReport,
  OpportunityMatchEvaluation
} from '../types';

export const MOCK_OPPORTUNITIES: OpportunityItem[] = [
  {
    id: 'opp_google_swe_2026',
    provider: 'Google Careers',
    provenance_type: 'api_verified',
    title: 'Software Engineering Intern — Summer 2026',
    company_or_organizer: 'Google',
    category: 'internship',
    source_url: 'https://careers.google.com/jobs/results/intern-2026',
    application_url: 'https://careers.google.com/jobs/results/intern-2026/apply',
    location: 'Bengaluru / Hyderabad, India',
    remote_status: 'hybrid',
    compensation_type: 'stipend',
    compensation_amount: '₹1,15,000 / month',
    eligibility: {
      min_cgpa: 7.5,
      branches: ['Computer Science', 'Information Technology', 'Electronics & Telecommunication'],
      grad_year: [2026, 2027]
    },
    experience_requirements: 'Enrolled in B.Tech/B.E. program, strong DSA fundamentals',
    skills: ['C++', 'Python', 'Java', 'Data Structures', 'Algorithms', 'Distributed Systems'],
    deadline: '2026-11-30T23:59:59Z',
    deadline_timezone: 'IST',
    status: 'open',
    is_stale: false,
    last_verified_at: '2026-10-16T10:00:00Z',
    description: 'Join Google engineering teams to design, test, deploy and maintain software solutions that impact billions of users worldwide. You will collaborate on core search, cloud infrastructure, or YouTube video streaming engines.'
  },
  {
    id: 'opp_msft_sde1_2026',
    provider: 'Microsoft University',
    provenance_type: 'api_verified',
    title: 'Software Development Engineer 1 (Full-Time)',
    company_or_organizer: 'Microsoft',
    category: 'job',
    source_url: 'https://careers.microsoft.com/us/en/job/sde1-india-2026',
    application_url: 'https://careers.microsoft.com/us/en/job/sde1-india-2026/apply',
    location: 'Hyderabad / Bengaluru / Pune',
    remote_status: 'hybrid',
    compensation_type: 'paid',
    compensation_amount: '₹22 - 28 LPA',
    eligibility: {
      min_cgpa: 8.0,
      branches: ['Computer Science', 'Information Technology'],
      grad_year: [2026]
    },
    experience_requirements: 'Graduating batch of 2026, experience in full-stack or backend web technologies',
    skills: ['C#', 'TypeScript', 'Azure', 'Python', 'React', 'REST APIs', 'Cloud Computing'],
    deadline: '2026-12-15T23:59:59Z',
    deadline_timezone: 'IST',
    status: 'open',
    is_stale: false,
    last_verified_at: '2026-10-15T14:00:00Z',
    description: 'Architect scalable cloud microservices, develop modern developer tools, and contribute to Azure platform resilience. As an SDE-1, you will write clean, well-tested production code with continuous delivery.'
  },
  {
    id: 'opp_razorpay_frontend',
    provider: 'Razorpay Talent',
    provenance_type: 'official_feed',
    title: 'Frontend Platform Engineer — Core Checkout',
    company_or_organizer: 'Razorpay',
    category: 'job',
    source_url: 'https://razorpay.com/jobs/frontend-engineer',
    application_url: 'https://razorpay.com/jobs/frontend-engineer/apply',
    location: 'Bengaluru / Remote',
    remote_status: 'remote',
    compensation_type: 'paid',
    compensation_amount: '₹18 - 24 LPA',
    eligibility: {
      min_cgpa: 7.0,
      branches: ['Any Engineering Branch with strong web portfolio'],
      grad_year: [2025, 2026]
    },
    experience_requirements: 'Strong portfolio of interactive web apps, deep mastery of React and modern JavaScript',
    skills: ['React 19', 'TypeScript', 'TailwindCSS', 'Web Performance', 'Micro-frontends', 'Browser APIs'],
    deadline: '2026-11-20T18:00:00Z',
    deadline_timezone: 'IST',
    status: 'open',
    is_stale: false,
    last_verified_at: '2026-10-14T09:00:00Z',
    description: 'Build mission-critical checkout experiences powering over 40% of Indian internet payments. You will optimize web bundle sizes, implement accessibility standards, and achieve sub-second payment widget loading.'
  },
  {
    id: 'opp_sih_2026',
    provider: 'Ministry of Education & AICTE',
    provenance_type: 'official_feed',
    title: 'Smart India Hackathon 2026 (Software Edition)',
    company_or_organizer: 'Government of India (AICTE)',
    category: 'hackathon',
    source_url: 'https://sih.gov.in',
    application_url: 'https://sih.gov.in/register',
    location: 'Pune / Nodal Centers Nationwide',
    remote_status: 'on_site',
    compensation_type: 'prize',
    compensation_amount: '₹1,00,000 per problem statement',
    eligibility: {
      team_size: '6 Students (minimum 1 female member)',
      college_verification: 'Mandatory college endorsement letter'
    },
    skills: ['AI/ML', 'Full-Stack Development', 'Mobile Apps', 'IoT', 'Cloud Architecture'],
    deadline: '2026-11-10T23:59:59Z',
    deadline_timezone: 'IST',
    status: 'closing_soon',
    is_stale: false,
    last_verified_at: '2026-10-16T12:00:00Z',
    description: "World's largest open-innovation digital product hackathon addressing pressing real-world challenges posed by Central Ministries, State Governments, and Industry Leaders."
  },
  {
    id: 'opp_hackmit_2026',
    provider: 'MIT Tech Club',
    provenance_type: 'official_feed',
    title: 'HackMIT 2026 Global Student Hackathon',
    company_or_organizer: 'Massachusetts Institute of Technology (MIT)',
    category: 'hackathon',
    source_url: 'https://hackmit.org',
    application_url: 'https://hackmit.org/apply',
    location: 'Cambridge, MA / Virtual Stream',
    remote_status: 'hybrid',
    compensation_type: 'prize',
    compensation_amount: '$50,000+ Prize Pool',
    eligibility: {
      status: 'Open to enrolled undergraduate & graduate university students worldwide'
    },
    skills: ['Web3', 'Generative AI', 'Computer Vision', 'APIs', 'Hardware Hacks'],
    deadline: '2026-12-01T23:59:59Z',
    deadline_timezone: 'EST',
    status: 'open',
    is_stale: false,
    last_verified_at: '2026-10-16T08:00:00Z',
    description: '36-hour weekend sprint bringing together 1,000+ innovators to build game-changing applications with mentorship from leading Silicon Valley technology companies.'
  },
  {
    id: 'opp_reliance_scholarship',
    provider: 'Reliance Foundation',
    provenance_type: 'api_verified',
    title: 'Reliance Foundation Undergraduate Scholarship in Technology',
    company_or_organizer: 'Reliance Foundation',
    category: 'scholarship',
    source_url: 'https://www.scholarships.reliancefoundation.org',
    application_url: 'https://www.scholarships.reliancefoundation.org/apply',
    location: 'Pan-India',
    remote_status: 'remote',
    compensation_type: 'prize',
    compensation_amount: 'Up to ₹2,00,000 over degree duration',
    eligibility: {
      stream: 'First / Second year undergraduate in Engineering / Technology',
      merit_and_means: 'Aptitude test score + household income criteria'
    },
    skills: ['Academic Excellence', 'Leadership', 'Social Impact'],
    deadline: '2026-12-31T23:59:59Z',
    deadline_timezone: 'IST',
    status: 'open',
    is_stale: false,
    last_verified_at: '2026-10-15T11:00:00Z',
    description: 'Comprehensive scholarship supporting ambitious undergraduate students pursuing degrees in Computer Science, Artificial Intelligence, and Electrical Engineering.'
  },
  {
    id: 'opp_gsoc_2026',
    provider: 'Google Open Source',
    provenance_type: 'official_feed',
    title: 'Google Summer of Code (GSoC 2026)',
    company_or_organizer: 'Google Open Source Program Office',
    category: 'programme',
    source_url: 'https://summerofcode.withgoogle.com',
    application_url: 'https://summerofcode.withgoogle.com/apply',
    location: 'Global / Fully Remote',
    remote_status: 'remote',
    compensation_type: 'stipend',
    compensation_amount: '$3,000 - $6,000 USD stipend',
    eligibility: {
      age: '18+ years, new to open source or university student'
    },
    skills: ['Git', 'Open Source', 'Python', 'Rust', 'JavaScript', 'Linux'],
    deadline: '2026-04-02T18:00:00Z',
    deadline_timezone: 'UTC',
    status: 'open',
    is_stale: false,
    last_verified_at: '2026-10-16T15:00:00Z',
    description: 'Global program focused on bringing new contributors into open source software development. Work with an open source organization on a 12-week programming project under dedicated mentorship.'
  },
  {
    id: 'opp_atlassian_intern',
    provider: 'Atlassian Careers',
    provenance_type: 'api_verified',
    title: 'Associate Software Engineer Intern',
    company_or_organizer: 'Atlassian',
    category: 'internship',
    source_url: 'https://www.atlassian.com/company/careers/internships',
    application_url: 'https://www.atlassian.com/company/careers/apply',
    location: 'Bengaluru / Remote',
    remote_status: 'remote',
    compensation_type: 'stipend',
    compensation_amount: '₹1,25,000 / month',
    eligibility: {
      min_cgpa: 7.5,
      branches: ['Computer Science', 'IT'],
      grad_year: [2026]
    },
    skills: ['Java', 'Kotlin', 'React', 'AWS', 'Microservices', 'GraphQL'],
    deadline: '2026-11-28T23:59:59Z',
    deadline_timezone: 'IST',
    status: 'open',
    is_stale: false,
    last_verified_at: '2026-10-15T18:00:00Z',
    description: 'Work directly on Jira, Confluence, and Bitbucket cloud features that empower over 250,000 agile teams globally.'
  }
];

export const MOCK_SAVED_OPPORTUNITIES: SavedOpportunityItem[] = [
  {
    id: 'saved_1',
    student_id: 'std_2026_042',
    opportunity_id: 'opp_google_swe_2026',
    application_status: 'applied',
    reminder_enabled: true,
    reminder_frequency: '3_days_before',
    notes: 'Online Assessment completed on HackerEarth. Awaiting shortlist for Technical Round 1.',
    applied_at: '2026-10-10T14:30:00Z',
    created_at: '2026-10-05T09:00:00Z',
    opportunity: MOCK_OPPORTUNITIES[0]
  },
  {
    id: 'saved_2',
    student_id: 'std_2026_042',
    opportunity_id: 'opp_msft_sde1_2026',
    application_status: 'saved',
    reminder_enabled: true,
    reminder_frequency: '1_day_before',
    notes: 'Resume tailored with Cloud & Systems keywords. Submitting this week.',
    created_at: '2026-10-12T11:00:00Z',
    opportunity: MOCK_OPPORTUNITIES[1]
  }
];

export const MOCK_AUDIT_REPORTS: ProviderAuditReport[] = [
  {
    name: 'Google Official Careers API',
    slug: 'google-careers',
    category: 'Official Employer Feed',
    official_api_available: true,
    provenance_type: 'api_verified',
    auth_and_approval_requirements: 'Google Cloud Service Account with Talent Solution read permissions',
    terms_and_permitted_use: 'Authorized educational aggregation and campus placement assistance',
    rate_limits_and_attribution: '100 requests per minute; requires official Google Careers attribution',
    retrievable_fields: ['title', 'department', 'locations', 'responsibilities', 'qualifications'],
    incremental_updates_and_webhooks: true,
    search_url_template: 'https://careers.google.com/jobs/results/?q={query}',
    disclaimer: 'Data refreshed continuously via official Google API gateway.'
  },
  {
    name: 'Microsoft University Gateway',
    slug: 'microsoft-jobs',
    category: 'Campus Direct Partner',
    official_api_available: true,
    provenance_type: 'api_verified',
    auth_and_approval_requirements: 'Microsoft Entra ID authenticated tenant integration',
    terms_and_permitted_use: 'Direct campus hiring candidate application routing',
    rate_limits_and_attribution: '250 requests per minute',
    retrievable_fields: ['title', 'role_tier', 'location', 'qualifications', 'deadline'],
    incremental_updates_and_webhooks: true,
    search_url_template: 'https://careers.microsoft.com/us/en/search-results?keywords={query}',
    disclaimer: 'Verified university hiring pipeline data.'
  },
  {
    name: 'Smart India Hackathon Portal',
    slug: 'sih-aicte',
    category: 'Government & National Competitions',
    official_api_available: false,
    provenance_type: 'official_feed',
    auth_and_approval_requirements: 'AICTE College SPOC endorsement code',
    terms_and_permitted_use: 'Public student hackathon problem statement repository',
    rate_limits_and_attribution: 'No rate limit on cached official syndication feed',
    retrievable_fields: ['problem_id', 'title', 'ministry', 'domain', 'prize_amount'],
    incremental_updates_and_webhooks: false,
    search_url_template: 'https://sih.gov.in/sih2026ProblemStatements',
    disclaimer: 'Official Ministry of Education National Hackathon dataset.'
  }
];

export const getMockMatchEvaluation = (opp: OpportunityItem): OpportunityMatchEvaluation => {
  return {
    opportunity_id: opp.id,
    match_percentage: opp.category === 'internship' ? 96 : opp.category === 'job' ? 92 : 88,
    match_level: 'High Match',
    why_it_matches: [
      `Your verified skills in ${opp.skills.slice(0, 3).join(', ')} directly align with required competencies.`,
      `Your current academic CGPA (8.84) comfortably exceeds the eligibility threshold.`,
      `Your demonstrated project achievements at Dr. D.Y. Patil College of Engineering substantiate hands-on readiness.`
    ],
    matched_skills: opp.skills.slice(0, 4),
    skill_gaps: opp.skills.length > 4 ? opp.skills.slice(4) : ['Production Observability'],
    cgpa_eligible: true,
    department_eligible: true,
    advisory_notice: 'Strong candidate profile. Recommend using AI Tailoring studio before final submission.'
  };
};
