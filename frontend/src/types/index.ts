export type Role = 'student' | 'coordinator';

export type NavSection = 'dashboard' | 'career' | 'explore' | 'placements';

export type CareerSubSection = 'profile' | 'skills' | 'resume' | 'assessments' | 'career-prep';
export type ExploreSubSection = 'jobs' | 'companies' | 'alumni' | 'referrals';
export type PlacementsSubSection = 'applications' | 'tracker' | 'shortlists' | 'interviews';

export type SubSection = CareerSubSection | ExploreSubSection | PlacementsSubSection;

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
  packageLpa: number;
  tier: 'Dream' | 'Super Dream' | 'Core';
  deadline: string;
  requiredCgpa: number;
  tags: string[];
  description: string;
  requiredSkills: string[];
  matchScore: number;
  matchReasons: {
    skillsMatch: string;
    academicMatch: string;
    projectMatch: string;
  };
  isDuplicateDetected?: boolean;
  duplicateNotice?: string;
  applied?: boolean;
}

export interface Company {
  id: string;
  name: string;
  logo: string;
  industry: string;
  tier: 'Dream' | 'Super Dream' | 'Core';
  openRolesCount: number;
  website: string;
  description: string;
  visitedDate: string;
  packageRange: string;
  eligibilityCgpa: number;
  hiredAlumniCount: number;
  requiredSkills: string[];
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

export type ApplicationStatus = 'Applied' | 'Screening' | 'Interview' | 'Offer' | 'Rejected' | 'Withdrawn';

export interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  companyName: string;
  companyLogo: string;
  packageLpa: number;
  appliedDate: string;
  status: ApplicationStatus;
  currentRound: string;
  nextStepDeadline?: string;
  matchScore: number;
  timeline: {
    step: string;
    date: string;
    completed: boolean;
    current?: boolean;
  }[];
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
}
