import React from 'react';
import {
  Search,
  Moon,
  Sun,
  Bell,
  Sparkles,
  ShieldAlert,
  User,
  Users,
  Building,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { mockStudentProfile } from '../../mock/data';

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
    isDemoMode
  } = useApp();

  return (
    <header className="h-16 border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-slate-200 dark:border-slate-800 px-6 flex items-center justify-between sticky top-0 z-20">
      {/* Search Input with quick shortcut */}
      <div className="flex items-center space-x-3 w-72 md:w-96">
        <div className="relative w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search jobs, skills, companies, alumni..."
            className="w-full pl-9 pr-4 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-850/80 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-bold"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Right Controls: Demo Badge, Role Switcher, Dark Mode, Notifications, User Profile */}
      <div className="flex items-center space-x-3">
        {/* Seed Data Pill Notice */}
        {isDemoMode && (
          <div className="hidden lg:flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-900/40 text-[11px] text-amber-700 dark:text-amber-300 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span>Fictional Hackathon Demo Data</span>
          </div>
        )}

        {/* Role Switcher Pill */}
        <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setRole('student')}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
              role === 'student'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Student</span>
          </button>
          <button
            onClick={() => setRole('coordinator')}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
              role === 'coordinator'
                ? 'bg-brand-600 text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">TPO / Recruiter</span>
          </button>
        </div>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-label="Toggle theme"
        >
          {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
        </button>

        {/* Notifications with badge */}
        <div className="relative">
          <button
            onClick={() => {
              setCurrentSection('placements');
            }}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative"
            title="Interview alerts"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900"></span>
          </button>
        </div>

        {/* User Card */}
        <div className="flex items-center space-x-2.5 pl-2 border-l border-slate-200 dark:border-slate-800">
          <img
            src={mockStudentProfile.avatar}
            alt={mockStudentProfile.name}
            className="w-8 h-8 rounded-full object-cover ring-2 ring-brand-500/30"
          />
          <div className="hidden md:flex flex-col text-left">
            <span className="text-xs font-semibold text-slate-900 dark:text-white leading-tight">
              {role === 'student' ? mockStudentProfile.name : 'Dr. S. K. Patil (TPO)'}
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400">
              {role === 'student' ? `${mockStudentProfile.rollNo} • CSE` : 'Placement Lead Coordinator'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
