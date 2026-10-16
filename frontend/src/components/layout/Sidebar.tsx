import React from 'react';
import {
  LayoutDashboard,
  UserCheck,
  Compass,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Award,
  TrendingUp,
  Building2,
  Users,
  GitPullRequest,
  Clock,
  ListOrdered,
  CalendarDays,
  FileCheck2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { NavSection, CareerSubSection, ExploreSubSection, PlacementsSubSection } from '../../types';

export const Sidebar: React.FC = () => {
  const {
    currentSection,
    setCurrentSection,
    currentSubSection,
    setCurrentSubSection,
    isSidebarCollapsed,
    setIsSidebarCollapsed,
    role
  } = useApp();

  const navItems: {
    id: NavSection;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    subItems?: { id: string; label: string; icon: React.ComponentType<{ className?: string }>; badge?: string }[];
  }[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      id: 'career',
      label: 'My Career',
      icon: UserCheck,
      subItems: [
        { id: 'profile', label: 'Profile & Academics', icon: GraduationCap },
        { id: 'skills', label: 'Verified Skills', icon: ShieldCheck, badge: '7' },
        { id: 'resume', label: 'ATS Resume Builder', icon: FileText, badge: '92 ATS' },
        { id: 'assessments', label: 'Assessments', icon: Award },
        { id: 'career-prep', label: 'Career Prep & Gaps', icon: TrendingUp }
      ]
    },
    {
      id: 'explore',
      label: 'Explore',
      icon: Compass,
      subItems: [
        { id: 'jobs', label: 'Job Openings', icon: Briefcase, badge: '4 New' },
        { id: 'companies', label: 'Companies', icon: Building2 },
        { id: 'alumni', label: 'Alumni Network', icon: Users },
        { id: 'referrals', label: 'Referrals', icon: GitPullRequest }
      ]
    },
    {
      id: 'placements',
      label: 'Placements',
      icon: Briefcase,
      subItems: [
        { id: 'applications', label: 'Applications', icon: FileCheck2, badge: '3' },
        { id: 'tracker', label: 'Status Tracker', icon: Clock },
        { id: 'shortlists', label: 'Candidate Shortlists', icon: ListOrdered, badge: role === 'coordinator' ? 'Active' : 'TPO' },
        { id: 'interviews', label: 'Interview Desk', icon: CalendarDays, badge: 'Tomorrow' }
      ]
    }
  ];

  return (
    <aside
      className={`relative flex flex-col border-r transition-all duration-300 ease-in-out bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 z-30 ${
        isSidebarCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand & Platform Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center space-x-3 overflow-hidden">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-brand-600 text-white font-bold shadow-md shadow-brand-500/20 shrink-0">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          {!isSidebarCollapsed && (
            <div className="flex flex-col truncate">
              <span className="font-bold text-base tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                Placement Hub
                <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-brand-100 text-brand-700 dark:bg-brand-900/50 dark:text-brand-300">
                  PS6
                </span>
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 truncate">
                D.Y. Patil COE Campus
              </span>
            </div>
          )}
        </div>

        <button
          onClick={() => setIsSidebarCollapsed(prev => !prev)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-label="Toggle sidebar"
        >
          {isSidebarCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActiveSection = currentSection === item.id;

          return (
            <div key={item.id} className="space-y-1">
              {/* Main Section Button */}
              <button
                onClick={() => {
                  setCurrentSection(item.id);
                  if (item.subItems && item.subItems.length > 0) {
                    setCurrentSubSection(item.subItems[0].id as any);
                  }
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-medium text-sm transition-all ${
                  isActiveSection
                    ? 'bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300 font-semibold shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
                title={item.label}
              >
                <div className="flex items-center space-x-3">
                  <Icon
                    className={`w-5 h-5 transition-transform ${
                      isActiveSection ? 'text-brand-600 dark:text-brand-400 scale-105' : 'text-slate-400'
                    }`}
                  />
                  {!isSidebarCollapsed && <span>{item.label}</span>}
                </div>
                {!isSidebarCollapsed && isActiveSection && (
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-600 dark:bg-brand-400"></span>
                )}
              </button>

              {/* Sub-sections dropdown when expanded and active */}
              {!isSidebarCollapsed && isActiveSection && item.subItems && (
                <div className="pl-4 ml-4 space-y-1 border-l-2 border-brand-100 dark:border-brand-900/50 my-1 py-0.5">
                  {item.subItems.map((sub) => {
                    const SubIcon = sub.icon;
                    const isSubActive = currentSubSection === sub.id;

                    return (
                      <button
                        key={sub.id}
                        onClick={() => setCurrentSubSection(sub.id as any)}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                          isSubActive
                            ? 'text-brand-700 dark:text-brand-300 font-semibold bg-brand-100/60 dark:bg-brand-900/30'
                            : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100/50 dark:hover:bg-slate-800/30'
                        }`}
                      >
                        <div className="flex items-center space-x-2 truncate">
                          <SubIcon className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">{sub.label}</span>
                        </div>
                        {sub.badge && (
                          <span
                            className={`px-1.5 py-0.2 rounded text-[10px] font-medium ${
                              isSubActive
                                ? 'bg-brand-200 text-brand-800 dark:bg-brand-800 dark:text-brand-100'
                                : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                            }`}
                          >
                            {sub.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Role Indicator Card & Placement Session Status */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800">
        {!isSidebarCollapsed ? (
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-850/60 border border-slate-200/80 dark:border-slate-800/80 text-xs">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                Drive 2026 Active
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 font-medium">
                Phase 1
              </span>
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400">
              {role === 'student' ? 'Student View • Verified Status' : 'TPO Coordinator Mode'}
            </div>
          </div>
        ) : (
          <div className="flex justify-center" title="Drive 2026 Active">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>
        )}
      </div>
    </aside>
  );
};
