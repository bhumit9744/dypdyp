import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Role,
  NavSection,
  SubSection,
  CareerSubSection,
  ExploreSubSection,
  PlacementsSubSection,
  JobOpening,
  Application,
  InterviewSchedule,
  SkillItem,
  ReferralOpportunity
} from '../types';
import {
  mockStudentProfile,
  mockJobs,
  mockApplications,
  mockInterviews,
  mockSkills,
  mockReferrals,
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

  // Interactive mock state
  jobs: JobOpening[];
  applications: Application[];
  interviews: InterviewSchedule[];
  skills: SkillItem[];
  referrals: ReferralOpportunity[];
  applyToJob: (jobId: string) => void;
  toggleInterviewChecklist: (interviewId: string, itemIndex: number) => void;
  requestReferral: (referralId: string) => void;
  isDemoMode: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<Role>('student');
  const [currentSection, setCurrentSection] = useState<NavSection>('dashboard');
  const [currentSubSection, setCurrentSubSection] = useState<SubSection>('profile');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  
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
    if (sec === 'explore') setCurrentSubSection('jobs');
    if (sec === 'placements') setCurrentSubSection('applications');
  };

  // Mutable interactive state for demo experience
  const [jobs, setJobs] = useState<JobOpening[]>(mockJobs);
  const [applications, setApplications] = useState<Application[]>(mockApplications);
  const [interviews, setInterviews] = useState<InterviewSchedule[]>(mockInterviews);
  const [skills, setSkills] = useState<SkillItem[]>(mockSkills);
  const [referrals, setReferrals] = useState<ReferralOpportunity[]>(mockReferrals);

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
      packageLpa: targetJob.packageLpa,
      appliedDate: 'Just now',
      status: 'Applied',
      currentRound: 'Application Screening',
      matchScore: targetJob.matchScore,
      timeline: [
        { step: 'Application Submitted', date: 'Today', completed: true, current: true },
        { step: 'Aptitude & Coding Evaluation', date: 'Upcoming', completed: false },
        { step: 'Technical Interview', date: 'TBD', completed: false }
      ]
    };

    setApplications(prev => [newApp, ...prev]);
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
        applications,
        interviews,
        skills,
        referrals,
        applyToJob,
        toggleInterviewChecklist,
        requestReferral,
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
