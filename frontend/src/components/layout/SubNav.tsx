import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  GraduationCap,
  ShieldCheck,
  Award,
  Briefcase,
  Building2,
  Users,
  Clock,
  ListOrdered,
  CalendarDays,
  FileCheck2,
  Rocket,
  Trophy,
  Code2,
  Gamepad2,
  Bot,
  Compass,
  Sparkles
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
    interviewExperiences,
    skills
  } = useApp();

  if (currentSection === 'dashboard' || currentSection === 'resume' || currentSection === 'integrations' || currentSection === 'opportunities') return null;

  const tabConfigs: Record<
    string,
    { id: SubSection; label: string; icon: React.ComponentType<{ className?: string }>; count?: number }[]
  > = {
    career: [
      { id: 'profile', label: 'Profile & Academics', icon: GraduationCap },
      { id: 'career-guidance', label: 'AI Career Guidance', icon: Sparkles },
      { id: 'career-roadmap', label: 'AI Career Roadmap Planner', icon: Compass },
      { id: 'skills', label: 'Verified Skills', icon: ShieldCheck, count: skills.length },
      { id: 'assessments', label: 'Assessments', icon: Award, count: 4 },
      { id: 'interview-studio', label: 'AI Interview Studio', icon: Bot }
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
    ],
    arena: [
      { id: 'games', label: 'Games', icon: Gamepad2 }
    ]
  };

  const tabs = tabConfigs[currentSection] || [];

  return (
    <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/90 dark:border-slate-800 sticky top-14 md:top-0 z-30 transition-colors shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 flex items-center overflow-x-auto space-x-1.5 scrollbar-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentSubSection === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setCurrentSubSection(tab.id)}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                isActive
                  ? 'bg-brand-600 text-white shadow-xs shadow-brand-600/30'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                    isActive
                      ? 'bg-white/25 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
