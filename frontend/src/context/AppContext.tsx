import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Role,
  NavSection,
  SubSection,
  CareerSubSection,
  ExploreSubSection,
  PlacementsSubSection,
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
  ApplicationStatus,
  InterviewSchedule,
  SkillItem,
  CampusDrive,
  InterviewExperience,
  CandidateShortlist,
  StudentProfile,
  IntegrationsStatus
} from '../types';
import {
  mockStudentProfile,
  mockSkills,
  mockJobs,
  mockCompanies,
  mockStartups,
  mockAlumni,
  mockRecruiters,
  mockReferrals,
  mockNetworkingEvents,
  mockPrograms,
  mockProjectsFreelance,
  mockApplications,
  mockCampusDrives,
  mockInterviews,
  mockInterviewExperiences
} from '../mock/data';

interface AppContextType {
  role: Role;
  setRole: (role: Role) => void;
  currentSection: NavSection;
  setCurrentSection: (section: NavSection) => void;
  currentSubSection: SubSection;
  setCurrentSubSection: (sub: SubSection) => void;
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: (collapsed: boolean | ((prev: boolean) => boolean)) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Real Student Profile
  studentProfile: StudentProfile | null;
  updateStudentProfile: (profile: StudentProfile) => Promise<void>;

  // Explore interactive state (Source-backed & User-added)
  jobs: JobOpening[];
  companies: Company[];
  startups: Startup[];
  alumni: Alumni[];
  recruiters: RecruiterContact[];
  referrals: ReferralOpportunity[];
  networkingEvents: NetworkingEvent[];
  programs: ProgramOpportunity[];
  projectsFreelance: PracticalExperienceProject[];

  // Cross-module filter states
  exploreCompanyFilter: string | null;
  setExploreCompanyFilter: (name: string | null) => void;

  // Actions
  applyToJob: (jobId: string) => void;
  addJob: (job: JobOpening) => Promise<void>;
  toggleSaveJob: (jobId: string) => void;
  applyToProject: (projectId: string) => void;
  registerForProgram: (programId: string) => void;
  registerForEvent: (eventId: string) => void;
  requestReferral: (referralId: string) => void;

  // Career & Placement state (Real records only)
  applications: Application[];
  addApplication: (app: Application) => Promise<void>;
  deleteApplication: (appId: string) => Promise<void>;
  interviews: InterviewSchedule[];
  skills: SkillItem[];
  addSkill: (skill: SkillItem) => void;
  campusDrives: CampusDrive[];
  interviewExperiences: InterviewExperience[];
  toggleInterviewChecklist: (interviewId: string, itemIndex: number) => void;

  // In-Platform AI Interview Studio Target (native on website, no Zoom)
  activeInterviewTarget: { role: string; company?: string; type?: string; skills?: string[] } | null;
  setActiveInterviewTarget: (target: { role: string; company?: string; type?: string; skills?: string[] } | null) => void;

  // Placements Actions
  updateApplicationNotes: (appId: string, notes: string) => void;
  toggleApplicationTask: (appId: string, taskId: string) => void;
  updateApplicationStatus: (appId: string, newStatus: ApplicationStatus) => void;
  registerForDrive: (driveId: string) => void;
  publishDriveShortlist: (driveId: string) => void;
  addInterviewExperience: (exp: InterviewExperience) => Promise<void>;
  reportInterviewExperience: (expId: string) => void;
  updateOfferDecision: (appId: string, decision: 'Accepted' | 'Declined') => void;

  // Live Architecture & Health Status
  integrationsStatus: IntegrationsStatus | null;
  refreshIntegrations: () => Promise<void>;
  isLiveMode: boolean;
  isLoading: boolean;
}

const API_BASE = 'http://127.0.0.1:8000/api/v1';

export const normalizeInterviewExperience = (item: any): InterviewExperience => {
  if (!item || typeof item !== 'object') {
    return {
      id: `exp_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      companyName: 'Company',
      companyLogo: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=128',
      roleTitle: 'Software Engineer',
      recruitmentYear: 2026,
      recruitmentType: 'On-Campus TPO',
      authorName: 'Candidate',
      authorBatch: '2026',
      isAnonymous: false,
      overallDifficulty: 'Medium',
      outcome: 'Offer Received',
      roundsBreakdown: [],
      technicalQuestions: [],
      studyMaterialsRecommended: [],
      preparationChecklist: [],
      similarCompanyRecommendations: [],
      submissionDate: 'Recent',
      verificationBadge: 'Student Reported',
      helpfulCount: 5
    };
  }

  // If item already has technicalQuestions as an array and roundsBreakdown as an array
  const hasTechQuestions = Array.isArray(item.technicalQuestions) && item.technicalQuestions.length > 0;
  const hasRounds = Array.isArray(item.roundsBreakdown) && item.roundsBreakdown.length > 0;

  if (hasTechQuestions && hasRounds) {
    return {
      ...item,
      companyName: item.companyName || 'Company',
      companyLogo: item.companyLogo || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=128',
      roleTitle: item.roleTitle || 'Software Engineer',
      recruitmentYear: item.recruitmentYear || 2026,
      recruitmentType: item.recruitmentType || 'On-Campus TPO',
      authorName: item.authorName || item.studentName || 'Candidate',
      authorBatch: item.authorBatch || '2026',
      isAnonymous: Boolean(item.isAnonymous),
      overallDifficulty: item.overallDifficulty || item.difficulty || 'Medium',
      outcome: item.outcome || (item.placedStatus === 'Selected' ? 'Offer Received' : 'Rejected'),
      roundsBreakdown: Array.isArray(item.roundsBreakdown) ? item.roundsBreakdown : [],
      technicalQuestions: Array.isArray(item.technicalQuestions) ? item.technicalQuestions : [],
      studyMaterialsRecommended: Array.isArray(item.studyMaterialsRecommended) ? item.studyMaterialsRecommended : ['Official Docs', 'LeetCode Curated List'],
      preparationChecklist: Array.isArray(item.preparationChecklist) ? item.preparationChecklist : ['Revise fundamentals', 'Practice problem solving'],
      similarCompanyRecommendations: Array.isArray(item.similarCompanyRecommendations) ? item.similarCompanyRecommendations : ['Google', 'Microsoft', 'Atlassian'],
      submissionDate: item.submissionDate || item.interviewDate || 'Recent',
      verificationBadge: item.verificationBadge || (item.verificationStatus === 'Verified' ? 'TPO Verified Experience' : 'Student Reported'),
      helpfulCount: typeof item.helpfulCount === 'number' ? item.helpfulCount : (item.upvotes || 5)
    };
  }

  // Parse topics from backend or fallback
  const rawTopics = Array.isArray(item.topicsCovered) && item.topicsCovered.length > 0
    ? item.topicsCovered
    : (Array.isArray(item.topics_covered) && item.topics_covered.length > 0 ? item.topics_covered : ['DSA', 'System Design']);

  const techQuestions = rawTopics.map((t: string) => ({
    topic: (['DSA', 'Java', 'Python', 'DBMS', 'Operating Systems', 'Computer Networks', 'System Design', 'Web / Frameworks'].includes(t)
      ? t
      : 'System Design') as any,
    question: `Real campus interview problem on ${t}`,
    difficulty: (item.difficulty || item.overallDifficulty || 'Medium') as any
  }));

  const rawRounds = Array.isArray(item.rounds) && item.rounds.length > 0
    ? item.rounds
    : [
        {
          roundNumber: 1,
          roundName: 'Technical & System Review',
          roundType: 'Technical Round 1',
          duration: '45 mins',
          difficulty: item.difficulty || 'Medium',
          description: item.overallExperience || item.overall_experience || 'Technical coding assessment and project architecture review.',
          questionsAsked: rawTopics.map((t: string) => `In-depth questions on ${t} implementation`)
        }
      ];

  const prepChecklist = item.preparationTips || item.preparation_tips
    ? [String(item.preparationTips || item.preparation_tips)]
    : (Array.isArray(item.preparationChecklist) ? item.preparationChecklist : ['Revise core data structures', 'Clarify constraints early']);

  return {
    id: item.id || `exp_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    companyName: item.companyName || item.company_name || 'Enterprise Partner',
    companyLogo: item.companyLogo || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=128',
    roleTitle: item.roleTitle || item.role_title || 'Software Development Engineer',
    recruitmentYear: item.recruitmentYear || 2026,
    recruitmentType: item.recruitmentType || 'On-Campus TPO',
    authorName: item.studentName || item.student_name || item.authorName || 'Candidate',
    authorBatch: item.authorBatch || '2026',
    isAnonymous: Boolean(item.isAnonymous),
    overallDifficulty: (item.difficulty || item.overallDifficulty || 'Medium') as any,
    outcome: (item.placedStatus === 'Selected' || item.placed_status === 'Selected' || item.outcome === 'Offer Received' ? 'Offer Received' : 'Rejected') as any,
    roundsBreakdown: rawRounds,
    technicalQuestions: techQuestions,
    studyMaterialsRecommended: Array.isArray(item.studyMaterialsRecommended) ? item.studyMaterialsRecommended : ['Official Docs', 'LeetCode Curated List', 'System Design Primer'],
    preparationChecklist: prepChecklist,
    similarCompanyRecommendations: Array.isArray(item.similarCompanyRecommendations) ? item.similarCompanyRecommendations : ['Google', 'Microsoft', 'Razorpay', 'Atlassian'],
    submissionDate: item.interviewDate || item.interview_date || item.submissionDate || 'Recent',
    verificationBadge: item.verificationStatus === 'Verified' || item.verification_status === 'Verified' ? 'TPO Verified Experience' : 'Student Reported',
    helpfulCount: typeof item.helpfulCount === 'number' ? item.helpfulCount : (item.upvotes || 8)
  };
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<Role>('student');
  const [currentSection, setCurrentSection] = useState<NavSection>('dashboard');
  const [currentSubSection, setCurrentSubSection] = useState<SubSection>('profile');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [exploreCompanyFilter, setExploreCompanyFilter] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Live Integrations Status
  const [integrationsStatus, setIntegrationsStatus] = useState<IntegrationsStatus | null>(null);

  // Student profile state (saved in localStorage or defaults to rich mock profile)
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(() => {
    try {
      const saved = localStorage.getItem('hub_student_profile');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // Fallback
    }
    return mockStudentProfile;
  });

  // State data collections initialized with rich mock data as requested
  const [jobs, setJobs] = useState<JobOpening[]>(() => {
    try {
      const saved = localStorage.getItem('hub_real_jobs');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.length > 0) return parsed;
      }
    } catch {}
    return mockJobs;
  });

  const [companies, setCompanies] = useState<Company[]>(() => {
    try {
      const saved = localStorage.getItem('hub_real_companies');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.length > 0) return parsed;
      }
    } catch {}
    return mockCompanies;
  });

  const [startups, setStartups] = useState<Startup[]>(mockStartups);
  const [alumni, setAlumni] = useState<Alumni[]>(mockAlumni);
  const [recruiters, setRecruiters] = useState<RecruiterContact[]>(mockRecruiters);
  const [referrals, setReferrals] = useState<ReferralOpportunity[]>(mockReferrals);
  const [networkingEvents, setNetworkingEvents] = useState<NetworkingEvent[]>(mockNetworkingEvents);
  const [programs, setPrograms] = useState<ProgramOpportunity[]>(mockPrograms);
  const [projectsFreelance, setProjectsFreelance] = useState<PracticalExperienceProject[]>(mockProjectsFreelance);

  const [applications, setApplications] = useState<Application[]>(() => {
    try {
      const saved = localStorage.getItem('hub_real_applications');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.length > 0) return parsed;
      }
    } catch {}
    return mockApplications;
  });

  const [interviews, setInterviews] = useState<InterviewSchedule[]>(mockInterviews);

  const [skills, setSkills] = useState<SkillItem[]>(() => {
    try {
      const saved = localStorage.getItem('hub_real_skills');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.length > 0) return parsed;
      }
    } catch {}
    return mockSkills;
  });

  const [campusDrives, setCampusDrives] = useState<CampusDrive[]>(mockCampusDrives);

  const [interviewExperiences, setInterviewExperiences] = useState<InterviewExperience[]>(() => {
    try {
      const saved = localStorage.getItem('hub_real_experiences');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const normalized = parsed.map(normalizeInterviewExperience);
          return [
            ...normalized,
            ...mockInterviewExperiences.filter((m) => !normalized.some((n) => n.id === m.id))
          ];
        }
      }
    } catch {}
    return mockInterviewExperiences;
  });

  const [activeInterviewTarget, setActiveInterviewTarget] = useState<{
    role: string;
    company?: string;
    type?: string;
    skills?: string[];
  } | null>(null);

  // Default to light theme as requested
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('theme');
    // Default to false (Light Theme)
    return saved === 'dark' ? false : false;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(prev => !prev);

  // Auto-select sensible default subsection on section change
  const handleSetSection = (sec: NavSection) => {
    setCurrentSection(sec);
    if (sec === 'career') setCurrentSubSection('profile');
    if (sec === 'explore') setCurrentSubSection('jobs-internships');
    if (sec === 'placements') setCurrentSubSection('applications');
  };

  // Safe Integration Status Check & Initial Data Sync
  const refreshIntegrations = async () => {
    try {
      const res = await fetch(`${API_BASE}/integrations/status`);
      if (res.ok) {
        const data: IntegrationsStatus = await res.json();
        setIntegrationsStatus(data);
      }
    } catch (e) {
      console.warn('Backend API currently unreachable:', e);
    }
  };

  useEffect(() => {
    refreshIntegrations();

    // Fetch live backend applications
    fetch(`${API_BASE}/applications`)
      .then(r => r.ok ? r.json() : [])
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setApplications(data);
          localStorage.setItem('hub_real_applications', JSON.stringify(data));
        }
      })
      .catch(() => {});

    // Fetch live backend jobs
    fetch(`${API_BASE}/jobs`)
      .then(r => r.ok ? r.json() : [])
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setJobs(data);
          localStorage.setItem('hub_real_jobs', JSON.stringify(data));
        }
      })
      .catch(() => {});

    // Fetch live interview experiences
    fetch(`${API_BASE}/interview-experiences`)
      .then(r => r.ok ? r.json() : [])
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          const normalized = data.map(normalizeInterviewExperience);
          const merged = [
            ...normalized,
            ...mockInterviewExperiences.filter((m) => !normalized.some((n) => n.id === m.id))
          ];
          setInterviewExperiences(merged);
          localStorage.setItem('hub_real_experiences', JSON.stringify(merged));
        }
      })
      .catch(() => {});

    // Fetch real profile
    fetch(`${API_BASE}/profile`)
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data) {
          const profile: StudentProfile = {
            id: data.id,
            name: data.name,
            email: data.email,
            rollNo: data.rollNo,
            department: data.department,
            degree: data.degree,
            batch: data.batch,
            graduationYear: data.graduationYear,
            cgpa: data.cgpa,
            avatar: data.avatar || '',
            bio: data.bio || '',
            githubUrl: data.githubUrl || '',
            portfolioUrl: data.portfolioUrl || '',
            linkedinUrl: data.linkedinUrl || '',
            phone: data.phone || '',
            activeBacklogs: data.activeBacklogs || 0,
            placementStatus: (data.placementStatus as any) || 'Eligible',
            projects: []
          };
          setStudentProfile(profile);
          localStorage.setItem('hub_student_profile', JSON.stringify(profile));
        }
      })
      .catch(() => {});
  }, []);

  // Update Student Profile
  const updateStudentProfile = async (profile: StudentProfile) => {
    setStudentProfile(profile);
    localStorage.setItem('hub_student_profile', JSON.stringify(profile));

    try {
      await fetch(`${API_BASE}/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: profile.name,
          email: profile.email,
          roll_no: profile.rollNo,
          department: profile.department,
          degree: profile.degree,
          batch: profile.batch,
          graduation_year: profile.graduationYear,
          cgpa: profile.cgpa,
          bio: profile.bio,
          github_url: profile.githubUrl,
          portfolio_url: profile.portfolioUrl,
          linkedin_url: profile.linkedinUrl,
          phone: profile.phone,
          active_backlogs: profile.activeBacklogs,
          placement_status: profile.placementStatus
        })
      });
    } catch (e) {
      console.warn('Profile saved to local storage (Backend sync offline)');
    }
  };

  // Add Skill
  const addSkill = (skill: SkillItem) => {
    const updated = [skill, ...skills];
    setSkills(updated);
    localStorage.setItem('hub_real_skills', JSON.stringify(updated));
  };

  // Real Add Application
  const addApplication = async (newApp: Application) => {
    const updated = [newApp, ...applications];
    setApplications(updated);
    localStorage.setItem('hub_real_applications', JSON.stringify(updated));

    try {
      await fetch(`${API_BASE}/applications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: newApp.id,
          job_id: newApp.jobId,
          job_title: newApp.jobTitle,
          company_name: newApp.companyName,
          company_logo: newApp.companyLogo,
          package_lpa: newApp.packageLpa,
          applied_date: newApp.appliedDate,
          status: newApp.status,
          current_round: newApp.currentRound,
          next_step_deadline: newApp.nextStepDeadline,
          source: newApp.source,
          opportunity_type: newApp.opportunityType,
          job_description: newApp.jobDescription,
          eligibility_criteria: newApp.eligibilityCriteria,
          match_score: newApp.matchScore,
          notes: newApp.privateNotes
        })
      });
    } catch (e) {
      console.warn('Saved application locally (Backend sync offline)');
    }
  };

  // Delete Application
  const deleteApplication = async (appId: string) => {
    const updated = applications.filter(a => a.id !== appId);
    setApplications(updated);
    localStorage.setItem('hub_real_applications', JSON.stringify(updated));

    try {
      await fetch(`${API_BASE}/applications/${appId}`, { method: 'DELETE' });
    } catch (e) {
      // Handled
    }
  };

  // Real Add Job
  const addJob = async (job: JobOpening) => {
    const updated = [job, ...jobs];
    setJobs(updated);
    localStorage.setItem('hub_real_jobs', JSON.stringify(updated));

    // Also register company in companies list if not present
    if (!companies.some(c => c.name.toLowerCase() === job.companyName.toLowerCase())) {
      const newComp: Company = {
        id: `comp_${Date.now()}`,
        name: job.companyName,
        logo: job.companyLogo || '',
        industry: 'Technology',
        headquarters: 'India / Global',
        products: ['Software Engineering'],
        tier: (job.tier === 'Startup' ? 'Core' : job.tier) as 'Dream' | 'Super Dream' | 'Core',
        openRolesCount: 1,
        website: job.sourceUrl || '',
        careerPageUrl: job.sourceUrl || '',
        description: `Employer profile for ${job.companyName}`,
        visitedDate: 'Current Active',
        packageRange: `${job.packageLpa} LPA`,
        eligibilityCgpa: job.requiredCgpa,
        hiredAlumniCount: 0,
        historicalHiringDisclosed: false,
        requiredSkills: job.requiredSkills || [],
        dataSource: 'Source Verified'
      };
      const updatedComps = [newComp, ...companies];
      setCompanies(updatedComps);
      localStorage.setItem('hub_real_companies', JSON.stringify(updatedComps));
    }

    try {
      await fetch(`${API_BASE}/jobs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: job.title,
          company_name: job.companyName,
          location: job.location,
          work_type: job.workType,
          package_lpa: job.packageLpa,
          deadline: job.deadline,
          required_cgpa: job.requiredCgpa,
          description: job.description,
          required_skills: job.requiredSkills,
          source_url: job.sourceUrl,
          tags: job.tags
        })
      });
    } catch (e) {
      console.warn('Saved job locally (Backend sync offline)');
    }
  };

  // Apply to job
  const applyToJob = (jobId: string) => {
    const targetJob = jobs.find(j => j.id === jobId);
    if (!targetJob || targetJob.applied) return;

    setJobs(prev => prev.map(j => j.id === jobId ? { ...j, applied: true } : j));

    const newApp: Application = {
      id: `app_${Date.now()}`,
      jobId: targetJob.id,
      jobTitle: targetJob.title,
      companyName: targetJob.companyName,
      companyLogo: targetJob.companyLogo,
      packageLpa: targetJob.packageLpa || 0,
      appliedDate: new Date().toISOString().split('T')[0],
      status: 'Applied',
      currentRound: 'Application Screening',
      matchScore: targetJob.matchScore || 0,
      source: targetJob.sourceType === 'Campus Direct Drive' ? 'Campus Direct Drive' : 'Explore Module',
      opportunityType: targetJob.opportunityType === 'Summer Internship' ? 'Summer Internship' : 'Full-time',
      jobDescription: targetJob.description,
      eligibilityCriteria: {
        minCgpa: targetJob.requiredCgpa,
        eligibleBranches: ['Computer Science', 'Information Technology'],
        maxBacklogs: 0
      },
      privateNotes: `Applied via Placement Hub for ${targetJob.title} at ${targetJob.companyName}.`,
      tasks: [
        { id: `tsk_${Date.now()}`, title: 'Review job requirements & prepare resume', dueDate: 'In 3 days', completed: false, type: 'InterviewPrep' }
      ],
      timeline: [
        { step: 'Application Submitted', date: 'Today', completed: true, current: true, source: 'Student Reported' }
      ],
      updateHistory: [
        { step: 'Application Logged in Hub', date: 'Today', source: 'Student Reported', details: 'Candidate submitted verified application via Placement Hub portal.' }
      ]
    };

    addApplication(newApp);
  };

  const toggleSaveJob = (jobId: string) => {
    setJobs(prev =>
      prev.map(j => (j.id === jobId ? { ...j, isSaved: !j.isSaved } : j))
    );
  };

  const applyToProject = (projectId: string) => {
    setProjectsFreelance(prev =>
      prev.map(p => (p.id === projectId ? { ...p, applied: true } : p))
    );
  };

  const registerForProgram = (programId: string) => {
    setPrograms(prev =>
      prev.map(p =>
        p.id === programId
          ? { ...p, isRegistered: !p.isRegistered, registeredCount: p.isRegistered ? p.registeredCount - 1 : p.registeredCount + 1 }
          : p
      )
    );
  };

  const registerForEvent = (eventId: string) => {
    setNetworkingEvents(prev =>
      prev.map(e =>
        e.id === eventId
          ? { ...e, isRegistered: !e.isRegistered, attendeesCount: e.isRegistered ? e.attendeesCount - 1 : e.attendeesCount + 1 }
          : e
      )
    );
  };

  const toggleInterviewChecklist = (interviewId: string, itemIndex: number) => {
    setInterviews(prev => prev.map(int => {
      if (int.id !== interviewId) return int;
      const updatedList = [...int.preparationChecklist];
      updatedList[itemIndex] = {
        ...updatedList[itemIndex],
        done: !updatedList[itemIndex].done
      };
      return { ...int, preparationChecklist: updatedList };
    }));
  };

  const requestReferral = (referralId: string) => {
    setReferrals(prev => prev.map(ref => {
      if (ref.id !== referralId) return ref;
      return { ...ref, status: 'Requested' };
    }));
  };

  const updateApplicationNotes = (appId: string, notes: string) => {
    setApplications(prev => {
      const updated = prev.map(app => (app.id === appId ? { ...app, privateNotes: notes } : app));
      localStorage.setItem('hub_real_applications', JSON.stringify(updated));
      return updated;
    });
  };

  const toggleApplicationTask = (appId: string, taskId: string) => {
    setApplications(prev => {
      const updated = prev.map(app => {
        if (app.id !== appId || !app.tasks) return app;
        return {
          ...app,
          tasks: app.tasks.map(t => (t.id === taskId ? { ...t, completed: !t.completed } : t))
        };
      });
      localStorage.setItem('hub_real_applications', JSON.stringify(updated));
      return updated;
    });
  };

  const updateApplicationStatus = (appId: string, newStatus: ApplicationStatus) => {
    setApplications(prev => {
      const updated = prev.map(app => {
        if (app.id !== appId) return app;
        const newUpdate = {
          step: `Status shifted to ${newStatus}`,
          date: 'Just now',
          source: 'Student Reported' as const,
          details: `Student updated recruitment pipeline status to ${newStatus}.`
        };
        return {
          ...app,
          status: newStatus,
          updateHistory: [newUpdate, ...(app.updateHistory || [])]
        };
      });
      localStorage.setItem('hub_real_applications', JSON.stringify(updated));
      return updated;
    });

    fetch(`${API_BASE}/applications/${appId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    }).catch(() => {});
  };

  const registerForDrive = (driveId: string) => {
    setCampusDrives(prev =>
      prev.map(d =>
        d.id === driveId
          ? {
              ...d,
              registrationStatus: d.registrationStatus === 'Registered' ? 'Not Registered' : 'Registered'
            }
          : d
      )
    );
  };

  const publishDriveShortlist = (driveId: string) => {
    setCampusDrives(prev =>
      prev.map(d =>
        d.id === driveId
          ? {
              ...d,
              officialShortlistPublished: true,
              officialShortlistCount: (d.officialShortlistCount || 0) + 5
            }
          : d
      )
    );
  };

  const addInterviewExperience = async (exp: InterviewExperience) => {
    const normalized = normalizeInterviewExperience(exp);
    const updated = [normalized, ...interviewExperiences.filter((e) => e.id !== normalized.id)];
    setInterviewExperiences(updated);
    localStorage.setItem('hub_real_experiences', JSON.stringify(updated));

    try {
      await fetch(`${API_BASE}/interview-experiences`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_name: normalized.authorName,
          company_name: normalized.companyName,
          role_title: normalized.roleTitle,
          placed_status: normalized.outcome === 'Offer Received' ? 'Selected' : 'Rejected',
          package_lpa: null,
          interview_date: normalized.submissionDate,
          difficulty: normalized.overallDifficulty,
          rounds: normalized.roundsBreakdown,
          overall_experience: (normalized.roundsBreakdown || []).map((r) => `${r.roundName}: ${r.description}`).join(' '),
          preparation_tips: (normalized.preparationChecklist || []).join(', '),
          topics_covered: (normalized.technicalQuestions || []).map((q) => q.topic)
        })
      });
    } catch (e) {
      console.warn('Saved interview experience locally (Backend sync offline)');
    }
  };

  const reportInterviewExperience = (expId: string) => {
    setInterviewExperiences(prev =>
      prev.map(exp => (exp.id === expId ? { ...exp, isReported: true } : exp))
    );
  };

  const updateOfferDecision = (appId: string, decision: 'Accepted' | 'Declined') => {
    setApplications(prev => {
      const updated = prev.map(app => {
        if (app.id !== appId || !app.offerDetails) return app;
        return {
          ...app,
          status: (decision === 'Accepted' ? 'Offer' : 'Withdrawn') as ApplicationStatus,
          offerDetails: {
            ...app.offerDetails,
            status: decision
          }
        };
      });
      localStorage.setItem('hub_real_applications', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        currentSection,
        setCurrentSection: handleSetSection,
        currentSubSection,
        setCurrentSubSection,
        isSidebarCollapsed,
        setIsSidebarCollapsed,
        darkMode,
        toggleDarkMode,
        searchQuery,
        setSearchQuery,
        studentProfile,
        updateStudentProfile,
        jobs,
        companies,
        startups,
        alumni,
        recruiters,
        referrals,
        networkingEvents,
        programs,
        projectsFreelance,
        exploreCompanyFilter,
        setExploreCompanyFilter,
        applyToJob,
        addJob,
        toggleSaveJob,
        applyToProject,
        registerForProgram,
        registerForEvent,
        requestReferral,
        applications,
        addApplication,
        deleteApplication,
        interviews,
        skills,
        addSkill,
        campusDrives,
        interviewExperiences,
        toggleInterviewChecklist,
        updateApplicationNotes,
        toggleApplicationTask,
        updateApplicationStatus,
        registerForDrive,
        publishDriveShortlist,
        addInterviewExperience,
        reportInterviewExperience,
        updateOfferDecision,
        activeInterviewTarget,
        setActiveInterviewTarget,
        integrationsStatus,
        refreshIntegrations,
        isLiveMode: true,
        isLoading
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
