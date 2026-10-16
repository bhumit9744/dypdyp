export type Role = 'student' | 'coordinator';

export type NavSection = 'dashboard' | 'career' | 'explore' | 'placements' | 'arena';

export type CareerSubSection = 'profile' | 'skills' | 'resume' | 'assessments' | 'career-prep';

export type ExploreSubSection =
  | 'jobs-internships'
  | 'companies'
  | 'startups'
  | 'people-referrals'
  | 'programs-challenges'
  | 'projects-freelance'
  | 'jobs'
  | 'alumni'
  | 'referrals';

export type PlacementsSubSection = 'applications' | 'tracker' | 'shortlists' | 'interviews';

export type ArenaSubSection = 'games' | 'leaderboard';

export type SubSection = CareerSubSection | ExploreSubSection | PlacementsSubSection | ArenaSubSection;

export interface StudentProfile {
  id: string;
  name: string;
  email: string;
  rollNo: string;
  department: string;
  degree: string;
  batch: string;
  graduationYear: number;
  cgpa: number;
  avatar: string;
  bio: string;
  githubUrl: string;
  portfolioUrl: string;
  linkedinUrl: string;
  phone: string;
  activeBacklogs: number;
  placementStatus: 'Eligible' | 'Placed' | 'Opted Out';
  projects: Project[];
}

export interface Project {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  githubUrl?: string;
  liveDemoUrl?: string;
  stars?: number;
  featured: boolean;
}

export interface SkillItem {
  id: string;
  name: string;
  category: 'Frontend' | 'Backend' | 'Database' | 'DevOps' | 'AI / ML' | 'Fundamentals';
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  verified: boolean;
  verificationSource?: 'Proctored Assessment' | 'GitHub Repository' | 'Hackathon Winner' | 'Coursework';
  evidenceUrl?: string;
  endorsements: number;
}

export interface ResumeData {
  id: string;
  title: string;
  targetRole: string;
  lastUpdated: string;
  atsScore: number;
  atsBreakdown: {
    keywordMatch: number;
    formatting: number;
    quantifiedImpact: number;
    skillRelevance: number;
  };
  summary: string;
  evidenceBackedClaims: number;
  downloadUrl?: string;
}

export interface Assessment {
  id: string;
  title: string;
  category: string;
  durationMinutes: number;
  totalQuestions: number;
  score?: number;
  percentile?: number;
  status: 'Completed' | 'Available' | 'In Progress';
  completedDate?: string;
  badge?: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface CareerGap {
  skill: string;
  importance: 'High' | 'Medium' | 'Low';
  gapDescription: string;
  learningResource: string;
  estimatedWeeks: number;
}

export interface JobOpening {
  id: string;
  title: string;
  companyId: string;
  companyName: string;
  companyLogo: string;
  location: string;
  workType: 'On-site' | 'Hybrid' | 'Remote';
  opportunityType: 'Full-time' | 'Summer Internship' | '6-Month Co-op' | 'Startup Internship';
  packageLpa?: number;
  salaryOrStipendText: string;
  tier: 'Dream' | 'Super Dream' | 'Core' | 'Startup';
  deadline: string;
  requiredCgpa: number;
  tags: string[];
  description: string;
  requiredSkills: string[];
  sourceType: 'Campus Direct Drive' | 'Alumni Shared' | 'Off-Campus Verified';
  sourceUrl?: string;
  isAlumniShared?: boolean;
  sharedByAlumniName?: string;
  sharedByAlumniRole?: string;
  matchScore: number;
  matchReasons: {
    skillsMatch: string;
    academicMatch: string;
    projectMatch: string;
  };
  isDuplicateDetected?: boolean;
  duplicateNotice?: string;
  isSaved?: boolean;
  applied?: boolean;
  dataSource: 'Source Verified' | 'Fictional Demo';
}

export interface Company {
  id: string;
  name: string;
  logo: string;
  industry: string;
  headquarters: string;
  products: string[];
  tier: 'Dream' | 'Super Dream' | 'Core';
  openRolesCount: number;
  website: string;
  careerPageUrl: string;
  description: string;
  visitedDate: string;
  packageRange: string;
  eligibilityCgpa: number;
  hiredAlumniCount: number;
  historicalHiringDisclosed: boolean;
  historicalHiringSummary?: string;
  requiredSkills: string[];
  relevantAlumniNames?: string[];
  dataSource: 'Source Verified' | 'Fictional Demo';
}

export interface Startup {
  id: string;
  name: string;
  logo: string;
  tagline: string;
  description: string;
  industry: string;
  headquarters: string;
  growthStage: 'Bootstrapped' | 'Pre-Seed' | 'Seed' | 'Series A' | 'Series B';
  fundingDisclosed: boolean;
  fundingAmount?: string;
  incubatorOrAccelerator?: string;
  products: string[];
  founderName: string;
  founderRole: string;
  founderContactChannel: string;
  earlyTeamOpportunitiesCount: number;
  mvpCollaborationOpen: boolean;
  mvpCollaborationDescription?: string;
  website: string;
  requiredSkills: string[];
  dataSource: 'Source Verified' | 'Fictional Demo';
}

export interface Alumni {
  id: string;
  name: string;
  avatar: string;
  company: string;
  role: string;
  batch: string;
  department: string;
  location: string;
  linkedinUrl: string;
  githubUrl?: string;
  willingToRefer: boolean;
  mentorshipAvailable: boolean;
  mentorshipTopics?: string[];
  sharedJobCount: number;
  isOptIn: boolean;
}

export interface RecruiterContact {
  id: string;
  name: string;
  avatar: string;
  company: string;
  role: string;
  hiringFocus: string[];
  isOptIn: boolean;
  approvedContactChannel: string;
  activeDrivesCount: number;
}

export interface ReferralOpportunity {
  id: string;
  companyName: string;
  roleTitle: string;
  alumniId: string;
  alumniName: string;
  alumniAvatar: string;
  location: string;
  status: 'Open' | 'Requested' | 'In Review' | 'Referred';
  eligibilityNotes: string;
  postedDate: string;
}

export interface NetworkingEvent {
  id: string;
  title: string;
  eventType: 'Alumni Tech Talk' | 'Recruiter AMA' | 'Mock Placement Drive' | 'Founder AMA';
  hostName: string;
  hostCompany: string;
  hostAvatar: string;
  date: string;
  time: string;
  locationOrPlatform: string;
  attendeesCount: number;
  meetUrl: string;
  isRegistered?: boolean;
}

export interface ProgramOpportunity {
  id: string;
  title: string;
  organizer: string;
  logo: string;
  opportunityType:
    | 'Hackathon'
    | 'Coding Competition'
    | 'Research Fellowship'
    | 'Academic Project'
    | 'Innovation Challenge'
    | 'Workshop'
    | 'Apprenticeship';
  eligibility: string;
  deadline: string;
  stipendOrGrant: string;
  hasCertificate: boolean;
  prizeOrAward?: string;
  hiringPathway: 'Direct Fast-Track Interview' | 'Shortlist PPO' | 'Corporate Visibility' | 'Skill Credential Only';
  mode: 'Virtual' | 'In-Person' | 'Hybrid';
  location?: string;
  externalUrl: string;
  tags: string[];
  registeredCount: number;
  isRegistered?: boolean;
  dataSource: 'Verified Partner' | 'Source Verified' | 'Fictional Demo';
}

export interface PracticalExperienceProject {
  id: string;
  title: string;
  sponsorName: string;
  sponsorLogo: string;
  sponsorType: 'Company Sponsored' | 'Startup Trial' | 'Open Source' | 'Campus Ambassador' | 'Freelance Contract';
  compensationType: 'Paid' | 'Unpaid' | 'Speculative' | 'Portfolio-only' | 'Compensation-unknown';
  compensationAmount?: string;
  durationWeeks: number;
  techStack: string[];
  deliverablesSummary: string;
  verificationProofBadge?: string;
  verificationBadgeAwarded?: string;
  status: 'Open' | 'In Review' | 'Active';
  applied?: boolean;
  dataSource: 'Verified Program' | 'Source Verified' | 'Fictional Demo';
}

export type ApplicationStatus = 'Applied' | 'Screening' | 'Interview' | 'Offer' | 'Rejected' | 'Withdrawn';

export interface OfferDetails {
  id: string;
  companyName: string;
  role: string;
  baseSalaryLpa: number;
  variableLpa: number;
  stocksLpa?: number;
  totalCtcLpa: number;
  location: string;
  joiningDate: string;
  acceptanceDeadline: string;
  bondDetails: string;
  status: 'Pending Decision' | 'Accepted' | 'Declined';
  benefits: string[];
}

export interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  companyName: string;
  companyLogo?: string;
  packageLpa: number;
  appliedDate: string;
  status: ApplicationStatus;
  currentRound: string;
  nextStepDeadline?: string;
  matchScore?: number;
  source?: 'Campus Direct Drive' | 'Off-Campus Drive' | 'Alumni Referral' | 'Explore Module';
  opportunityType?: 'Full-time' | 'Summer Internship' | '6-Month Co-op';
  jobDescription?: string;
  eligibilityCriteria?: {
    minCgpa: number;
    eligibleBranches: string[];
    maxBacklogs: number;
  };
  externalApplicationLink?: string;
  resumeVersion?: {
    fileName: string;
    uploadedAt: string;
    atsScore: number;
  };
  supportingDocuments?: {
    name: string;
    url: string;
    verified: boolean;
  }[];
  privateNotes?: string;
  tasks?: {
    id: string;
    title: string;
    dueDate: string;
    completed: boolean;
    type: 'Assessment' | 'Document' | 'FollowUp' | 'InterviewPrep';
  }[];
  timeline: {
    step: string;
    date: string;
    completed: boolean;
    current?: boolean;
    source?: 'Student Reported' | 'College Verified Integration' | 'Recruiter Confirmed';
  }[];
  updateHistory?: {
    step: string;
    date: string;
    source: 'Student Reported' | 'College Verified Integration' | 'Recruiter Confirmed';
    details: string;
  }[];
  isDuplicateWarning?: boolean;
  duplicateWarningText?: string;
  offerDetails?: OfferDetails;
}

export interface CandidateShortlist {
  candidateId: string;
  studentName: string;
  rollNo: string;
  department: string;
  cgpa: number;
  matchScore: number;
  verifiedSkillsCount: number;
  projectsCount: number;
  status: 'Shortlisted' | 'Waitlisted' | 'Under Review' | 'Rejected';
  ranking: number;
  topSkills: string[];
}

export interface CampusDrive {
  id: string;
  companyName: string;
  companyLogo: string;
  role: string;
  tier: 'Super Dream' | 'Dream' | 'Core';
  packageRange: string;
  driveDate: string;
  registrationDeadline: string;
  registrationStatus: 'Registered' | 'Not Registered' | 'Closed';
  branchEligibility: string[];
  minCgpa: number;
  maxBacklogs: number;
  selectionRounds: string[];
  instructions: string;
  eligibilityAnalysis: {
    status: 'Eligible' | 'Not Eligible' | 'Pending Verification';
    metRequirements: string[];
    unmetRequirements: string[];
    unverifiedRequirements: string[];
  };
  officialShortlistPublished: boolean;
  officialShortlistCount?: number;
  nextRoundSchedule?: string;
  scheduleConflictAlert?: string;
}

export interface InterviewSchedule {
  id: string;
  jobId: string;
  companyName: string;
  companyLogo: string;
  roleTitle: string;
  roundName: string;
  date: string;
  time: string;
  durationMinutes: number;
  interviewer: string;
  meetUrl: string;
  status: 'Upcoming' | 'Completed' | 'Cancelled';
  preparationChecklist: {
    item: string;
    done: boolean;
  }[];
  notes?: string;
  preparationTopics?: string[];
}

export interface InterviewExperience {
  id: string;
  companyName: string;
  companyLogo: string;
  roleTitle: string;
  recruitmentYear: number;
  recruitmentType: 'On-Campus TPO' | 'Off-Campus' | 'Referral' | 'Pool Campus';
  authorName: string;
  authorBatch: string;
  isAnonymous: boolean;
  overallDifficulty: 'Easy' | 'Medium' | 'Hard';
  outcome: 'Offer Received' | 'Rejected' | 'Withdrawn';
  roundsBreakdown: {
    roundNumber: number;
    roundName: string;
    roundType: 'Online Assessment' | 'Technical Round 1' | 'Technical Round 2' | 'System Design' | 'Managerial / Behavioral' | 'HR Round';
    duration: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    description: string;
    questionsAsked: string[];
  }[];
  technicalQuestions: {
    topic: 'DSA' | 'Java' | 'Python' | 'DBMS' | 'Operating Systems' | 'Computer Networks' | 'System Design' | 'Web / Frameworks';
    question: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
  }[];
  studyMaterialsRecommended: string[];
  preparationChecklist: string[];
  similarCompanyRecommendations: string[];
  submissionDate: string;
  verificationBadge: 'Student Reported' | 'TPO Verified Experience';
  helpfulCount: number;
  isReported?: boolean;
}

export interface IntegrationsStatus {
  backend_db: {
    status: string;
    engine?: string;
    records?: Record<string, number>;
    message?: string;
  };
  claude_api: {
    status: 'connected' | 'disconnected' | 'error';
    configured: boolean;
    provider: string;
    model: string;
    message: string;
  };
  college_tpo_api: {
    status: string;
    provider: string;
    message: string;
  };
  external_job_boards: {
    status: string;
    provider: string;
    message: string;
  };
}
