import React, { useState } from 'react';
import {
  Search,
  Moon,
  Sun,
  Bell,
  ShieldCheck,
  User,
  Users,
  LayoutDashboard,
  UserCheck,
  Compass,
  Briefcase,
  GraduationCap,
  Menu,
  X,
  ChevronDown
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { NavSection } from '../../types';

export const Header: React.FC = () => {
  const {
    role,
    setRole,
    darkMode,
    toggleDarkMode,
    searchQuery,
    setSearchQuery,
    currentSection,
    setCurrentSection,
    setCurrentSubSection,
    studentProfile,
    jobs,
    applications
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: {
    id: NavSection;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    defaultSub: string;
    badge?: string | number;
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
      defaultSub: 'profile'
    },
    {
      id: 'explore',
      label: 'Explore',
      icon: Compass,
      defaultSub: 'jobs-internships',
      badge: jobs.length > 0 ? jobs.length : undefined
    },
    {
      id: 'placements',
      label: 'Placements',
      icon: Briefcase,
      defaultSub: 'applications',
      badge: applications.length > 0 ? applications.length : undefined
    }
  ];

  const handleNavClick = (item: typeof navItems[0]) => {
    setCurrentSection(item.id);
    if (item.defaultSub) {
      setCurrentSubSection(item.defaultSub as any);
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="h-16 border-b bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-slate-200 dark:border-slate-800 px-4 sm:px-6 sticky top-0 z-40 transition-colors">
      <div className="max-w-7xl mx-auto h-full flex items-center justify-between gap-4">
        
        {/* Left: Brand Identity & Campus Logo */}
        <div className="flex items-center space-x-6 shrink-0">
          <div
            onClick={() => handleNavClick(navItems[0])}
            className="flex items-center space-x-3 cursor-pointer group select-none"
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 text-white font-bold shadow-md shadow-brand-500/25 shrink-0 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5 leading-tight">
                Placement Hub
                <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300 border border-brand-200/60">
                  PS6
                </span>
              </span>
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                D.Y. Patil COE Akurdi
              </span>
            </div>
          </div>

          {/* Primary Top Nav Bar Links (Desktop) */}
          <nav className="hidden lg:flex items-center space-x-1 pl-4 border-l border-slate-200 dark:border-slate-800">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentSection === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item)}
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all relative ${
                    isActive
                      ? 'bg-brand-50 text-brand-700 dark:bg-brand-950/70 dark:text-brand-300 border border-brand-200/80 dark:border-brand-800/60 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100/80 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-brand-600 dark:text-brand-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.badge !== undefined && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                        isActive
                          ? 'bg-brand-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                  {isActive && (
                    <span className="absolute -bottom-[13px] left-1/2 -translate-x-1/2 w-8 h-0.5 bg-brand-600 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Center/Right: Search Bar (Desktop) */}
        <div className="hidden md:flex items-center max-w-xs xl:max-w-sm w-full mx-2">
          <div className="relative w-full">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search jobs, companies, skills..."
              className="w-full pl-8 pr-12 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-850/80 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/25 focus:border-brand-500 transition-all"
            />
            {searchQuery ? (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-bold"
              >
                ✕
              </button>
            ) : (
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-semibold text-slate-400 bg-slate-200/60 dark:bg-slate-800 px-1 rounded">
                ⌘K
              </span>
            )}
          </div>
        </div>

        {/* Right Controls: Role, Theme, Alerts, User Profile */}
        <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
          {/* Live Data Badge */}
          <div className="hidden xl:flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/50 text-[11px] text-emerald-700 dark:text-emerald-300 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span>Placement Hub</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>

          {/* Role Switcher Pill */}
          <div className="flex items-center p-0.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setRole('student')}
              className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                role === 'student'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <User className="w-3.5 h-3.5 text-brand-600" />
              <span className="hidden sm:inline">Student</span>
            </button>
            <button
              onClick={() => setRole('coordinator')}
              className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                role === 'coordinator'
                  ? 'bg-brand-600 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">TPO</span>
            </button>
          </div>

          {/* Theme Toggle Button (Light / Dark) */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
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
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
            title="Application alerts"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-600 ring-2 ring-white dark:ring-slate-900" />
          </button>

          {/* User Profile Pill */}
          <div
            onClick={() => {
              setCurrentSection('career');
              setCurrentSubSection('profile');
            }}
            className="flex items-center space-x-2 pl-2 border-l border-slate-200 dark:border-slate-800 cursor-pointer hover:opacity-85 transition-opacity"
          >
            {studentProfile?.avatar ? (
              <img
                src={studentProfile.avatar}
                alt={studentProfile.name}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-brand-500/25"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-brand-100 dark:bg-brand-900/50 flex items-center justify-center text-brand-600 dark:text-brand-300 font-bold text-xs ring-2 ring-brand-500/25">
                {studentProfile?.name ? studentProfile.name[0].toUpperCase() : <User className="w-4 h-4" />}
              </div>
            )}
            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                {role === 'student'
                  ? studentProfile?.name || 'Bhumit Gupta'
                  : 'TPO Lead Coordinator'}
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">
                {role === 'student'
                  ? studentProfile ? `${studentProfile.rollNo} • CGPA ${studentProfile.cgpa}` : 'Computer Engineering'
                  : 'Training & Placement'}
              </span>
            </div>
          </div>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(prev => !prev)}
            className="p-2 lg:hidden rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation (When open) */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-16 left-0 right-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-4 shadow-xl space-y-2 z-50">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentSection === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item)}
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300 border border-brand-200'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
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
            );
          })}
        </div>
      )}
    </header>
  );
};
