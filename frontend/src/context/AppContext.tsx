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
  OfferDetails
} from '../types';
import {
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
  mockInterviews,
  mockSkills,
  mockCampusDrives,
  mockInterviewExperiences,
  IS_DEMO_MODE
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

  // Explore interactive state
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
  toggleSaveJob: (jobId: string) => void;
  applyToProject: (projectId: string) => void;
  registerForProgram: (programId: string) => void;
  registerForEvent: (eventId: string) => void;
  requestReferral: (referralId: string) => void;

  // Career & Placement state
  applications: Application[];
  interviews: InterviewSchedule[];
  skills: SkillItem[];
  campusDrives: CampusDrive[];
  interviewExperiences: InterviewExperience[];
  toggleInterviewChecklist: (interviewId: string, itemIndex: number) => void;

  // Placements Actions
  updateApplicationNotes: (appId: string, notes: string) => void;
  toggleApplicationTask: (appId: string, taskId: string) => void;
  updateApplicationStatus: (appId: string, newStatus: ApplicationStatus) => void;
  registerForDrive: (driveId: string) => void;
  publishDriveShortlist: (driveId: string) => void;
  addInterviewExperience: (exp: InterviewExperience) => void;
  reportInterviewExperience: (expId: string) => void;
  updateOfferDecision: (appId: string, decision: 'Accepted' | 'Declined') => void;

  isDemoMode: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<Role>('student');
  const [currentSection, setCurrentSection] = useState<NavSection>('dashboard');
  const [currentSubSection, setCurrentSubSection] = useState<SubSection>('profile');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [exploreCompanyFilter, setExploreCompanyFilter] = useState<string | null>(null);

  // Initialize dark mode from localStorage or system preference
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
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

  // State data collections
  const [jobs, setJobs] = useState<JobOpening[]>(mockJobs);
  const [companies, setCompanies] = useState<Company[]>(mockCompanies);
  const [startups, setStartups] = useState<Startup[]>(mockStartups);
  const [alumni, setAlumni] = useState<Alumni[]>(mockAlumni);
  const [recruiters, setRecruiters] = useState<RecruiterContact[]>(mockRecruiters);
  const [referrals, setReferrals] = useState<ReferralOpportunity[]>(mockReferrals);
  const [networkingEvents, setNetworkingEvents] = useState<NetworkingEvent[]>(mockNetworkingEvents);
  const [programs, setPrograms] = useState<ProgramOpportunity[]>(mockPrograms);
  const [projectsFreelance, setProjectsFreelance] = useState<PracticalExperienceProject[]>(mockProjectsFreelance);
  const [applications, setApplications] = useState<Application[]>(mockApplications);
  const [interviews, setInterviews] = useState<InterviewSchedule[]>(mockInterviews);
  const [skills, setSkills] = useState<SkillItem[]>(mockSkills);
  const [campusDrives, setCampusDrives] = useState<CampusDrive[]>(mockCampusDrives);
  const [interviewExperiences, setInterviewExperiences] = useState<InterviewExperience[]>(mockInterviewExperiences);

  // Apply to job action
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
      packageLpa: targetJob.packageLpa || 15.0,
      appliedDate: 'Just now',
      status: 'Applied',
      currentRound: 'Application Screening',
      matchScore: targetJob.matchScore,
      source: targetJob.sourceType === 'Campus Direct Drive' ? 'Campus Direct Drive' : 'Explore Module',
      opportunityType: targetJob.opportunityType === 'Summer Internship' ? 'Summer Internship' : 'Full-time',
      jobDescription: targetJob.description,
      eligibilityCriteria: {
        minCgpa: targetJob.requiredCgpa,
        eligibleBranches: ['Computer Science', 'Information Technology', 'AI & DS'],
        maxBacklogs: 0
      },
      resumeVersion: {
        fileName: 'Bhumit_Gupta_Backend_SDE_v2.4.pdf',
        uploadedAt: 'Today',
        atsScore: 94
      },
      supportingDocuments: [],
      privateNotes: 'Applied directly from Explore module.',
      tasks: [
        { id: `tsk_${Date.now()}`, title: 'Review company tech stack & prepare elevator pitch', dueDate: 'In 3 days', completed: false, type: 'InterviewPrep' }
      ],
      timeline: [
        { step: 'Application Submitted', date: 'Today', completed: true, current: true, source: 'Student Reported' },
        { step: 'Aptitude & Coding Evaluation', date: 'Upcoming', completed: false, source: 'College Verified Integration' },
        { step: 'Technical Interview', date: 'TBD', completed: false, source: 'Recruiter Confirmed' }
      ],
      updateHistory: [
        { step: 'Application Logged in Hub', date: 'Today', source: 'Student Reported', details: 'Candidate submitted verified application via Placement Hub portal.' }
      ]
    };

    setApplications(prev => [newApp, ...prev]);
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

  // Placements Handlers
  const updateApplicationNotes = (appId: string, notes: string) => {
    setApplications(prev =>
      prev.map(app => (app.id === appId ? { ...app, privateNotes: notes } : app))
    );
  };

  const toggleApplicationTask = (appId: string, taskId: string) => {
    setApplications(prev =>
      prev.map(app => {
        if (app.id !== appId || !app.tasks) return app;
        return {
          ...app,
          tasks: app.tasks.map(t => (t.id === taskId ? { ...t, completed: !t.completed } : t))
        };
      })
    );
  };

  const updateApplicationStatus = (appId: string, newStatus: ApplicationStatus) => {
    setApplications(prev =>
      prev.map(app => {
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
      })
    );
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

  const addInterviewExperience = (exp: InterviewExperience) => {
    setInterviewExperiences(prev => [exp, ...prev]);
  };

  const reportInterviewExperience = (expId: string) => {
    setInterviewExperiences(prev =>
      prev.map(exp => (exp.id === expId ? { ...exp, isReported: true } : exp))
    );
  };

  const updateOfferDecision = (appId: string, decision: 'Accepted' | 'Declined') => {
    setApplications(prev =>
      prev.map(app => {
        if (app.id !== appId || !app.offerDetails) return app;
        return {
          ...app,
          status: decision === 'Accepted' ? 'Offer' : 'Withdrawn',
          offerDetails: {
            ...app.offerDetails,
            status: decision
          }
        };
      })
    );
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
        toggleSaveJob,
        applyToProject,
        registerForProgram,
        registerForEvent,
        requestReferral,
        applications,
        interviews,
        skills,
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
        isDemoMode: IS_DEMO_MODE
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
