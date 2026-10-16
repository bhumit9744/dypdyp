import React, { useState } from 'react';
import {
  LayoutDashboard,
  UserCheck,
  Compass,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Award,
  TrendingUp,
  Building2,
  Users,
  Clock,
  ListOrdered,
  CalendarDays,
  FileCheck2,
  Rocket,
  Trophy,
  Code2,
  Bot,
  Search,
  Sun,
  Moon,
  User,
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { NavSection } from '../../types';

interface SidebarProps {
  mobileOpen?: boolean;
  setMobileOpen?: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen = false, setMobileOpen }) => {
  const {
    currentSection,
    setCurrentSection,
    currentSubSection,
    setCurrentSubSection,
    isSidebarCollapsed,
    setIsSidebarCollapsed,
    role,
    setRole,
    darkMode,
    toggleDarkMode,
    searchQuery,
    setSearchQuery,
    studentProfile,
    jobs,
    applications,
    skills,
    campusDrives,
    interviewExperiences
  } = useApp();

  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    career: true,
    explore: false,
    placements: true
  });

  const toggleSectionExpand = (sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const navItems: {
    id: NavSection;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    defaultSub?: string;
    subItems?: { id: string; label: string; icon: React.ComponentType<{ className?: string }>; badge?: string }[];
  }[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      defaultSub: ''
    },
    {
      id: 'career',
      label: 'My Career',
      icon: UserCheck,
      defaultSub: 'profile',
      subItems: [
        { id: 'profile', label: 'Profile & Academics', icon: GraduationCap },
        { id: 'skills', label: 'Verified Skills', icon: ShieldCheck, badge: `${skills.filter(s => s.verified).length || skills.length}` },
        { id: 'resume', label: 'ATS Resume Builder', icon: FileText, badge: '92 ATS' },
        { id: 'assessments', label: 'Assessments', icon: Award, badge: '4' },
        { id: 'career-prep', label: 'Career Prep & Gaps', icon: TrendingUp },
        { id: 'interview-studio', label: 'AI Interview Studio', icon: Bot, badge: 'AI Live' }
      ]
    },
    {
      id: 'explore',
      label: 'Explore',
      icon: Compass,
      defaultSub: 'jobs-internships',
      subItems: [
        { id: 'jobs-internships', label: 'Jobs & Internships', icon: Briefcase, badge: `${jobs.length} Live` },
        { id: 'companies', label: 'Companies', icon: Building2 },
        { id: 'startups', label: 'Startup Ecosystem', icon: Rocket, badge: 'New' },
        { id: 'people-referrals', label: 'People & Referrals', icon: Users },
        { id: 'programs-challenges', label: 'Programs & Challenges', icon: Trophy },
        { id: 'projects-freelance', label: 'Projects & Freelance', icon: Code2 }
      ]
    },
    {
      id: 'placements',
      label: 'Placements',
      icon: Briefcase,
      defaultSub: 'applications',
      subItems: [
        { id: 'applications', label: 'My Applications', icon: FileCheck2, badge: `${applications.length}` },
        { id: 'tracker', label: 'Application Tracker', icon: Clock },
        { id: 'shortlists', label: 'Shortlists', icon: ListOrdered, badge: role === 'coordinator' ? 'Active' : `${campusDrives.length}` },
        { id: 'interviews', label: 'Interview Exp & Prep', icon: CalendarDays, badge: `${interviewExperiences.length}` }
      ]
    }
  ];

  const handleSelectSection = (id: NavSection, defaultSub?: string) => {
    setCurrentSection(id);
    if (defaultSub) {
      setCurrentSubSection(defaultSub as any);
    }
    if (setMobileOpen) setMobileOpen(false);
  };

  const handleSelectSub = (subId: string, parentSection: NavSection) => {
    setCurrentSection(parentSection);
    setCurrentSubSection(subId as any);
    if (setMobileOpen) setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen && setMobileOpen(false)}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 md:hidden animate-in fade-in"
        />
      )}

      {/* Main Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 md:sticky md:top-0 h-screen flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-300 ease-in-out shadow-lg md:shadow-none ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } ${isSidebarCollapsed ? 'md:w-20' : 'w-64 md:w-64'}`}
      >
        {/* Brand & Platform Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-slate-200 dark:border-slate-800 shrink-0">
          <div
            onClick={() => handleSelectSection('dashboard')}
            className="flex items-center space-x-3 cursor-pointer select-none overflow-hidden"
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-white font-bold shadow-sm shadow-brand-500/25 shrink-0">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            {(!isSidebarCollapsed || mobileOpen) && (
              <div className="flex flex-col truncate">
                <span className="font-extrabold text-sm tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                  Placement Hub
                  <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300 border border-brand-200/60">
                    PS6
                  </span>
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                  DYPCOE Akurdi
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-1">
            {/* Mobile Close Button */}
            <button
              onClick={() => setMobileOpen && setMobileOpen(false)}
              className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Desktop Collapse Toggle */}
            <button
              onClick={() => setIsSidebarCollapsed(prev => !prev)}
              className="hidden md:flex p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
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
        </div>

        {/* Quick Controls: Search, Role Switcher, Theme */}
        {(!isSidebarCollapsed || mobileOpen) && (
          <div className="px-3.5 pt-3 pb-2 space-y-2.5 border-b border-slate-100 dark:border-slate-800/80 shrink-0">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search hub..."
                className="w-full pl-8 pr-7 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:bg-white transition-all"
              />
              {searchQuery ? (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-[11px] text-slate-400 hover:text-slate-600 font-bold"
                >
                  ✕
                </button>
              ) : (
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] font-semibold text-slate-400 bg-slate-200/60 dark:bg-slate-800 px-1 py-0.2 rounded">
                  ⌘K
                </span>
              )}
            </div>

            {/* Role Switcher & Theme Toggle Row */}
            <div className="flex items-center justify-between gap-1.5">
              <div className="flex-1 flex items-center p-0.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700">
                <button
                  onClick={() => setRole('student')}
                  className={`flex-1 flex items-center justify-center space-x-1 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                    role === 'student'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  <User className="w-3 h-3 text-brand-600" />
                  <span>Student</span>
                </button>
                <button
                  onClick={() => setRole('coordinator')}
                  className={`flex-1 flex items-center justify-center space-x-1 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                    role === 'coordinator'
                      ? 'bg-brand-600 text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  <Users className="w-3 h-3" />
                  <span>TPO</span>
                </button>
              </div>

              {/* Theme Toggle Button */}
              <button
                onClick={toggleDarkMode}
                className="p-1.5 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/70 dark:border-slate-800 transition-colors shrink-0"
                title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                aria-label="Toggle theme"
              >
                {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
              </button>
            </div>
          </div>
        )}

        {/* Collapsed Mode Quick Theme & Role Icon */}
        {isSidebarCollapsed && !mobileOpen && (
          <div className="py-2 flex flex-col items-center gap-2 border-b border-slate-100 dark:border-slate-800 shrink-0">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>
          </div>
        )}

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1.5 scrollbar-thin">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActiveSection = currentSection === item.id;
            const hasSubItems = item.subItems && item.subItems.length > 0;
            const isExpanded = expandedSections[item.id] ?? isActiveSection;

            return (
              <div key={item.id} className="space-y-1">
                {/* Main Section Button */}
                <button
                  onClick={() => {
                    handleSelectSection(item.id, item.defaultSub);
                    if (hasSubItems) toggleSectionExpand(item.id);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl font-semibold text-xs transition-all ${
                    isActiveSection
                      ? 'bg-brand-50 text-brand-700 dark:bg-brand-950/70 dark:text-brand-300 shadow-xs border border-brand-200/60 dark:border-brand-900/60'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100/70 dark:hover:bg-slate-800/50'
                  }`}
                  title={item.label}
                >
                  <div className="flex items-center space-x-2.5 min-w-0">
                    <Icon
                      className={`w-4 h-4 shrink-0 transition-transform ${
                        isActiveSection ? 'text-brand-600 dark:text-brand-400 scale-105' : 'text-slate-400'
                      }`}
                    />
                    {(!isSidebarCollapsed || mobileOpen) && (
                      <span className="truncate">{item.label}</span>
                    )}
                  </div>

                  {(!isSidebarCollapsed || mobileOpen) && (
                    <div className="flex items-center space-x-1.5 shrink-0">
                      {isActiveSection && (
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-600 dark:bg-brand-400" />
                      )}
                    </div>
                  )}
                </button>

                {/* Sub-sections dropdown when expanded */}
                {(!isSidebarCollapsed || mobileOpen) && hasSubItems && (isExpanded || isActiveSection) && (
                  <div className="pl-3 ml-3 space-y-0.5 border-l-2 border-brand-100 dark:border-brand-900/50 my-1 py-0.5 animate-in fade-in duration-150">
                    {item.subItems!.map((sub) => {
                      const SubIcon = sub.icon;
                      const isSubActive = isActiveSection && currentSubSection === sub.id;

                      return (
                        <button
                          key={sub.id}
                          onClick={() => handleSelectSub(sub.id, item.id)}
                          className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-colors ${
                            isSubActive
                              ? 'text-brand-700 dark:text-brand-300 font-bold bg-brand-100/70 dark:bg-brand-900/40'
                              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100/60 dark:hover:bg-slate-800/40'
                          }`}
                        >
                          <div className="flex items-center space-x-2 truncate">
                            <SubIcon className={`w-3.5 h-3.5 shrink-0 ${isSubActive ? 'text-brand-600 dark:text-brand-400' : 'text-slate-400'}`} />
                            <span className="truncate">{sub.label}</span>
                          </div>
                          {sub.badge && (
                            <span
                              className={`px-1.5 py-0.2 rounded text-[9px] font-bold shrink-0 ${
                                isSubActive
                                  ? 'bg-brand-600 text-white shadow-xs'
                                  : sub.id === 'interview-studio'
                                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-extrabold'
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

        {/* User Profile & Placement Session Footer */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 shrink-0">
          {(!isSidebarCollapsed || mobileOpen) ? (
            <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-850/80 border border-slate-200/80 dark:border-slate-800 space-y-2">
              <div className="flex items-center space-x-2.5">
                <img
                  src={studentProfile?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=128'}
                  alt={studentProfile?.name || 'Candidate'}
                  className="w-8 h-8 rounded-xl object-cover border border-brand-200 dark:border-slate-700 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {studentProfile?.name || 'Rahul Sharma'}
                  </p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                    {studentProfile?.degree?.split(' ')[0] || 'B.E. Computer'} • CGPA {studentProfile?.cgpa || '9.24'}
                  </p>
                </div>
              </div>

              <div className="pt-1.5 border-t border-slate-200/70 dark:border-slate-800 flex items-center justify-between text-[10px]">
                <span className="font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                  Drive 2026
                </span>
                <span className="px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold">
                  Phase 1
                </span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-2" title={`${studentProfile?.name || 'Candidate'} • Drive 2026 Active`}>
              <img
                src={studentProfile?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=128'}
                alt="Candidate"
                className="w-8 h-8 rounded-xl object-cover border border-brand-200 dark:border-slate-700"
              />
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
