import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Moon,
  Sun,
  Bell,
  User,
  Users,
  LayoutDashboard,
  UserCheck,
  Compass,
  Briefcase,
  GraduationCap,
  Menu,
  X,
  Gamepad2,
  FileText,
  Sparkles,
  MessageSquare,
  Trophy,
  ChevronDown,
  Building2,
  Rocket,
  BookOpen,
  Code2,
  FileCheck2,
  Clock,
  ListOrdered,
  CalendarDays,
  ShieldCheck,
  Award,
  Bot
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { NavSection, SubSection } from '../../types';

interface HeaderProps {
  onOpenMobileSidebar?: () => void;
}

interface SubNavDef {
  id: SubSection;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface HeaderNavItem {
  id: NavSection;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  defaultSub: string;
  badge?: number | string;
  subsections?: SubNavDef[];
}

export const Header: React.FC<HeaderProps> = ({ onOpenMobileSidebar }) => {
  const {
    role,
    setRole,
    darkMode,
    toggleDarkMode,
    searchQuery,
    setSearchQuery,
    currentSection,
    setCurrentSection,
    currentSubSection,
    setCurrentSubSection,
    studentProfile,
    jobs,
    applications
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<NavSection | null>(null);
  const [mobileExpandedSection, setMobileExpandedSection] = useState<NavSection | null>(null);
  const navRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems: HeaderNavItem[] = [
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
      subsections: [
        { id: 'profile', label: 'Profile & Academics', icon: GraduationCap },
        { id: 'career-guidance', label: 'AI Career Guidance', icon: Sparkles },
        { id: 'career-roadmap', label: 'Roadmaps', icon: Compass },
        { id: 'skills', label: 'Verified Skills', icon: ShieldCheck },
        { id: 'assessments', label: 'Assessments', icon: Award },
        { id: 'interview-studio', label: 'Interview Prep', icon: Bot }
      ]
    },
    {
      id: 'connect',
      label: 'Student Connect',
      icon: Users,
      defaultSub: 'home',
      badge: 'Community',
      subsections: [
        { id: 'home', label: 'Community Home', icon: Sparkles },
        { id: 'communities', label: 'Communities & Q&A', icon: MessageSquare },
        { id: 'mentors', label: 'Senior Mentoring', icon: GraduationCap },
        { id: 'challenges', label: 'Challenges & Progress', icon: Trophy }
      ]
    },
    {
      id: 'resume',
      label: 'ATS Resume',
      icon: FileText,
      defaultSub: 'resume'
    },
    {
      id: 'explore',
      label: 'Explore',
      icon: Compass,
      defaultSub: 'jobs-internships',
      badge: jobs.length > 0 ? jobs.length : undefined,
      subsections: [
        { id: 'jobs-internships', label: 'Jobs & Internships', icon: Briefcase },
        { id: 'companies', label: 'Companies', icon: Building2 },
        { id: 'startups', label: 'Startup Ecosystem', icon: Rocket },
        { id: 'people-referrals', label: 'Mentorship & Referrals', icon: Users },
        { id: 'programs-challenges', label: 'Programs & Challenges', icon: BookOpen },
        { id: 'projects-freelance', label: 'Projects & Freelance', icon: Code2 }
      ]
    },
    {
      id: 'placements',
      label: 'Placements',
      icon: Briefcase,
      defaultSub: 'applications',
      badge: applications.length > 0 ? applications.length : undefined,
      subsections: [
        { id: 'applications', label: 'My Applications', icon: FileCheck2 },
        { id: 'tracker', label: 'Application Tracker', icon: Clock },
        { id: 'shortlists', label: 'Shortlists', icon: ListOrdered },
        { id: 'interviews', label: 'Interview Experiences', icon: CalendarDays }
      ]
    },
    {
      id: 'arena',
      label: 'Games',
      icon: Gamepad2,
      defaultSub: 'games'
    }
  ];

  const handleNavClick = (item: HeaderNavItem) => {
    setCurrentSection(item.id);
    if (item.defaultSub) {
      setCurrentSubSection(item.defaultSub as any);
    }
    setActiveDropdown(null);
    setMobileMenuOpen(false);
  };

  const handleSubNavClick = (sectionId: NavSection, subId: SubSection) => {
    setCurrentSection(sectionId);
    setCurrentSubSection(subId);
    setActiveDropdown(null);
    setMobileMenuOpen(false);
  };

  return (
    <header className="h-16 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 px-3 sm:px-6 sticky top-0 z-40 transition-colors shadow-[0_1px_2px_0_rgba(15,23,42,0.03)] no-print">
      <div className="w-full mx-auto h-full flex items-center justify-between gap-3 sm:gap-6">
        
        {/* Left: Mobile Sidebar Toggle & Brand */}
        <div className="flex items-center space-x-2 sm:space-x-3 select-none shrink-0">
          {onOpenMobileSidebar && (
            <button
              onClick={onOpenMobileSidebar}
              className="md:hidden p-1.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Open side navigation"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <div
            onClick={() => handleNavClick(navItems[0])}
            className="flex items-center space-x-2.5 cursor-pointer group"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-tr from-[#6366F1] to-[#8057F5] text-white font-bold shadow-xs shrink-0 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-4 h-4 text-white" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-sm sm:text-base tracking-tight text-slate-900 dark:text-white leading-tight">
                Placement Hub
              </span>
              <span className="hidden sm:inline-block text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded-md bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300 border border-brand-200/60">
                DYPCOE
              </span>
            </div>
          </div>
        </div>

        {/* Center: Desktop Nav Links with Dropdowns */}
        <nav ref={navRef} className="hidden md:flex items-center space-x-1 lg:space-x-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentSection === item.id;
            const hasSubsections = Boolean(item.subsections && item.subsections.length > 0);
            const isDropdownOpen = activeDropdown === item.id;

            return (
              <div
                key={item.id}
                className="relative"
                onMouseEnter={() => hasSubsections && setActiveDropdown(item.id)}
                onMouseLeave={() => hasSubsections && setActiveDropdown(null)}
              >
                <button
                  onClick={() => handleNavClick(item)}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all group ${
                    isActive
                      ? 'bg-brand-50 text-brand-700 dark:bg-brand-950/70 dark:text-brand-300 border border-brand-200/80 dark:border-brand-800/60 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100/70 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-brand-600 dark:text-brand-400' : 'text-slate-400 group-hover:text-slate-600'}`} />
                  <span className="whitespace-nowrap">{item.label}</span>

                  {item.badge !== undefined && (
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold ${
                        isActive
                          ? 'bg-brand-600 text-white'
                          : typeof item.badge === 'string'
                            ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-300'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}

                  {hasSubsections && (
                    <ChevronDown
                      className={`w-3 h-3 text-slate-400 transition-transform ${
                        isDropdownOpen ? 'rotate-180 text-brand-600' : ''
                      }`}
                    />
                  )}
                </button>

                {/* Subsections Floating Dropdown */}
                {hasSubsections && isDropdownOpen && item.subsections && (
                  <div className="absolute top-full left-0 pt-1.5 w-56 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                    <div className="rounded-2xl bg-white dark:bg-[#1A1D2D] border border-slate-200 dark:border-slate-700/80 shadow-xl p-1.5 space-y-0.5">
                      <div className="px-2.5 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        {item.label}
                      </div>
                      {item.subsections.map((sub) => {
                        const SubIcon = sub.icon;
                        const isSubActive = currentSection === item.id && currentSubSection === sub.id;

                        return (
                          <button
                            key={sub.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSubNavClick(item.id, sub.id);
                            }}
                            className={`w-full flex items-center space-x-2.5 px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                              isSubActive
                                ? 'bg-brand-50 text-brand-700 dark:bg-brand-950/70 dark:text-brand-300 font-bold'
                                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-800/60'
                            }`}
                          >
                            {SubIcon && (
                              <SubIcon
                                className={`w-3.5 h-3.5 shrink-0 ${
                                  isSubActive ? 'text-brand-600 dark:text-brand-400' : 'text-slate-400'
                                }`}
                              />
                            )}
                            <span className="truncate">{sub.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Right: Search, Role, Theme, Profile */}
        <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
          {/* Minimal Search Bar */}
          <div className="hidden lg:flex items-center relative w-40 xl:w-52">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search hub..."
              className="w-full pl-8 pr-7 py-1.5 text-xs rounded-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:bg-white transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            )}
          </div>

          {/* Role Switcher Pill */}
          <div className="flex items-center p-0.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700">
            <button
              onClick={() => setRole('student')}
              className={`flex items-center space-x-1 px-2 py-1 rounded-lg text-xs font-semibold transition-all ${
                role === 'student'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <User className="w-3 h-3 text-brand-600" />
              <span className="hidden sm:inline">Student</span>
            </button>
            <button
              onClick={() => setRole('coordinator')}
              className={`flex items-center space-x-1 px-2 py-1 rounded-lg text-xs font-semibold transition-all ${
                role === 'coordinator'
                  ? 'bg-brand-600 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Users className="w-3 h-3" />
              <span className="hidden sm:inline">TPO</span>
            </button>
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleDarkMode}
            className="p-1.5 sm:p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle theme"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          {/* Notifications */}
          <button
            onClick={() => {
              setCurrentSection('placements');
              setCurrentSubSection('applications');
            }}
            className="p-1.5 sm:p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative"
            title="Application alerts"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-brand-600" />
          </button>

          {/* User Profile Avatar */}
          <div
            onClick={() => {
              setCurrentSection('career');
              setCurrentSubSection('profile');
            }}
            className="cursor-pointer pl-0.5"
            title={studentProfile?.name || 'View Profile'}
          >
            {studentProfile?.avatar ? (
              <img
                src={studentProfile.avatar}
                alt={studentProfile.name}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover ring-2 ring-brand-500/30 hover:ring-brand-500 transition-all"
              />
            ) : (
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-xs ring-2 ring-brand-500/20">
                {studentProfile?.name ? studentProfile.name[0].toUpperCase() : 'B'}
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(prev => !prev)}
            className="p-1.5 md:hidden rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu with Subsections */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-3 shadow-xl space-y-1 z-50 max-h-[80vh] overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentSection === item.id;
            const hasSubsections = Boolean(item.subsections && item.subsections.length > 0);
            const isSubExpanded = mobileExpandedSection === item.id || (isActive && mobileExpandedSection === null);

            return (
              <div key={item.id} className="space-y-1">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => handleNavClick(item)}
                    className={`flex-1 flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300 border border-brand-200'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-brand-600' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge !== undefined && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-brand-100 text-brand-700">
                        {item.badge}
                      </span>
                    )}
                  </button>

                  {hasSubsections && (
                    <button
                      onClick={() => setMobileExpandedSection(prev => prev === item.id ? null : item.id)}
                      className="p-2 text-slate-400 hover:text-slate-600"
                    >
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${isSubExpanded ? 'rotate-180' : ''}`}
                      />
                    </button>
                  )}
                </div>

                {/* Indented mobile subsections */}
                {hasSubsections && isSubExpanded && item.subsections && (
                  <div className="pl-6 pr-2 py-1 space-y-1 border-l-2 border-brand-200 dark:border-brand-900 ml-4">
                    {item.subsections.map((sub) => {
                      const SubIcon = sub.icon;
                      const isSubActive = currentSection === item.id && currentSubSection === sub.id;

                      return (
                        <button
                          key={sub.id}
                          onClick={() => handleSubNavClick(item.id, sub.id)}
                          className={`w-full flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs transition-all ${
                            isSubActive
                              ? 'bg-brand-100 text-brand-900 dark:bg-brand-950 font-bold'
                              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                          }`}
                        >
                          {SubIcon && <SubIcon className="w-3.5 h-3.5 text-brand-600" />}
                          <span>{sub.label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </header>
  );
};
