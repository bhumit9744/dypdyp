import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  GraduationCap,
  ShieldCheck,
  FileText,
  Award,
  TrendingUp,
  Briefcase,
  Building2,
  Users,
  GitPullRequest,
  Clock,
  ListOrdered,
  CalendarDays,
  FileCheck2,
  Rocket,
  Trophy,
  Code2
} from 'lucide-react';
import { SubSection } from '../../types';

export const SubNav: React.FC = () => {
  const {
    currentSection,
    currentSubSection,
    setCurrentSubSection,
    role,
    jobs,
    companies,
    startups,
    alumni,
    programs,
    projectsFreelance,
    applications,
    campusDrives,
    interviewExperiences
  } = useApp();

  if (currentSection === 'dashboard') return null;

  const tabConfigs: Record<
    string,
    { id: SubSection; label: string; icon: React.ComponentType<{ className?: string }>; count?: number }[]
  > = {
    career: [
      { id: 'profile', label: 'Profile & Academics', icon: GraduationCap },
      { id: 'skills', label: 'Verified Skills', icon: ShieldCheck, count: 7 },
      { id: 'resume', label: 'ATS Resume Builder', icon: FileText },
      { id: 'assessments', label: 'Assessments', icon: Award, count: 4 },
      { id: 'career-prep', label: 'Career Prep & Gaps', icon: TrendingUp }
    ],
    explore: [
      { id: 'jobs-internships', label: 'Jobs & Internships', icon: Briefcase, count: jobs.length },
      { id: 'companies', label: 'Companies', icon: Building2, count: companies.length },
      { id: 'startups', label: 'Startup Ecosystem', icon: Rocket, count: startups.length },
      { id: 'people-referrals', label: 'People & Referrals', icon: Users, count: alumni.length },
      { id: 'programs-challenges', label: 'Programs & Challenges', icon: Trophy, count: programs.length },
      { id: 'projects-freelance', label: 'Projects & Freelance', icon: Code2, count: projectsFreelance.length }
    ],
    placements: [
      { id: 'applications', label: 'My Applications', icon: FileCheck2, count: applications.length },
      { id: 'tracker', label: 'Application Tracker', icon: Clock },
      { id: 'shortlists', label: role === 'coordinator' ? 'Shortlists (TPO Audit)' : 'Shortlists', icon: ListOrdered, count: campusDrives.length },
      { id: 'interviews', label: 'Interview Experiences', icon: CalendarDays, count: interviewExperiences.length }
    ]
  };

  const tabs = tabConfigs[currentSection] || [];

  return (
    <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-2.5 flex items-center overflow-x-auto space-x-2">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = currentSubSection === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => setCurrentSubSection(tab.id)}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 ${
              isActive
                ? 'bg-brand-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
