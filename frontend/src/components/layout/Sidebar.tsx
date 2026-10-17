import React, { useState } from 'react';
import {
  GraduationCap,
  Home,
  UserCheck,
  Compass,
  Video,
  Sparkles,
  Clock,
  Gamepad2,
  Users,
  BookOpen,
  MoreVertical,
  Sun,
  Moon,
  ArrowRight,
  X,
  CheckCircle2,
  User,
  Briefcase,
  Building2,
  Rocket,
  Award,
  ShieldCheck,
  FileCheck2,
  ListOrdered,
  CalendarDays,
  Code2,
  ChevronDown,
  ChevronRight,
  FileText,
  Layers,
  Bot,
  Trophy,
  MessageSquare
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { NavSection, SubSection } from '../../types';
import { SidebarCurvedArrowDoodle } from '../figma/FigmaDoodles';

interface SidebarProps {
  mobileOpen?: boolean;
  setMobileOpen?: (open: boolean) => void;
}

interface SubItemDef {
  id: SubSection;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface MainNavItemDef {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  section: NavSection;
  badge?: string;
  defaultSub?: SubSection;
  subsections?: SubItemDef[];
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen = false, setMobileOpen }) => {
  const {
    currentSection,
    setCurrentSection,
    currentSubSection,
    setCurrentSubSection,
    role,
    setRole,
    darkMode,
    toggleDarkMode,
    studentProfile
  } = useApp();

  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [expandedSection, setExpandedSection] = useState<NavSection | null>(currentSection);

  // Synchronize expanded state with active section
  React.useEffect(() => {
    if (currentSection === 'career' || currentSection === 'explore' || currentSection === 'placements' || currentSection === 'connect') {
      setExpandedSection(currentSection);
    }
  }, [currentSection]);

  const mainNavItems: MainNavItemDef[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: Home,
      section: 'dashboard'
    },
    {
      id: 'career',
      label: 'My Career',
      icon: UserCheck,
      section: 'career',
      defaultSub: 'profile',
      subsections: [
        { id: 'profile', label: 'Profile & Academics', icon: GraduationCap },
        { id: 'career-guidance', label: 'AI Career Guidance', icon: Sparkles },
        { id: 'career-roadmap', label: 'Roadmaps', icon: Compass },
        { id: 'skills', label: 'Verified Skills', icon: ShieldCheck },
        { id: 'assessments', label: 'Assessments', icon: Award },
        { id: 'interview-studio', label: 'Interview Prep', icon: Video }
      ]
    },
    {
      id: 'resume',
      label: 'ATS Resume Builder',
      icon: FileText,
      section: 'resume',
      badge: '92 ATS'
    },
    {
      id: 'explore',
      label: 'Explore',
      icon: Compass,
      section: 'explore',
      defaultSub: 'jobs-internships',
      subsections: [
        { id: 'jobs-internships', label: 'Jobs & Internships', icon: Briefcase },
        { id: 'companies', label: 'Companies', icon: Building2 },
        { id: 'startups', label: 'Startup Ecosystem', icon: Rocket },
        { id: 'people-referrals', label: 'Mentorship & Referrals', icon: Users },
        { id: 'programs-challenges', label: 'Resources & Challenges', icon: BookOpen },
        { id: 'projects-freelance', label: 'Projects & Freelance', icon: Code2 }
      ]
    },
    {
      id: 'opportunities',
      label: 'Opportunities',
      icon: Sparkles,
      section: 'opportunities',
      badge: 'Intelligence'
    },
    {
      id: 'connect',
      label: 'Student Connect',
      icon: Users,
      section: 'connect',
      badge: 'Community',
      defaultSub: 'home',
      subsections: [
        { id: 'home', label: 'Community Home', icon: Home },
        { id: 'communities', label: 'Communities & Q&A', icon: MessageSquare },
        { id: 'mentors', label: 'Senior Mentors', icon: GraduationCap },
        { id: 'challenges', label: 'Challenges & Progress', icon: Trophy }
      ]
    },
    {
      id: 'placements',
      label: 'Placements',
      icon: Briefcase,
      section: 'placements',
      defaultSub: 'applications',
      subsections: [
        { id: 'applications', label: 'My Applications', icon: FileCheck2 },
        { id: 'tracker', label: 'Placement Tracker', icon: Clock },
        { id: 'shortlists', label: 'Shortlists', icon: ListOrdered },
        { id: 'interviews', label: 'Interview Experiences', icon: CalendarDays }
      ]
    },
    {
      id: 'arena',
      label: 'Games',
      icon: Gamepad2,
      section: 'arena'
    },
    {
      id: 'integrations',
      label: 'Integrations',
      icon: Layers,
      section: 'integrations',
      badge: 'Hub'
    }
  ];

  const handleMainClick = (item: MainNavItemDef) => {
    if (item.subsections && item.subsections.length > 0) {
      if (currentSection === item.section) {
        // Toggle expansion if already in this section
        setExpandedSection(prev => prev === item.section ? null : item.section);
      } else {
        setCurrentSection(item.section);
        setCurrentSubSection(item.defaultSub || item.subsections[0].id);
        setExpandedSection(item.section);
        if (setMobileOpen) setMobileOpen(false);
      }
    } else {
      setCurrentSection(item.section);
      if (item.defaultSub) setCurrentSubSection(item.defaultSub);
      setExpandedSection(null);
      if (setMobileOpen) setMobileOpen(false);
    }
  };

  const handleSubClick = (section: NavSection, subId: SubSection) => {
    setCurrentSection(section);
    setCurrentSubSection(subId);
    if (setMobileOpen) setMobileOpen(false);
  };

  const studentName = studentProfile?.name || 'Bhumit Gupta';

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen && setMobileOpen(false)}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 md:hidden animate-in fade-in no-print"
        />
      )}

      {/* Main Clean White Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 md:sticky md:top-0 h-screen w-64 flex flex-col bg-white dark:bg-[#12141F] border-r border-slate-200/90 dark:border-slate-800 transition-transform duration-300 ease-in-out shadow-xs md:shadow-none select-none shrink-0 no-print ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Brand & Platform Header */}
        <div className="flex items-center justify-between h-18 px-5 shrink-0">
          <div
            onClick={() => {
              setCurrentSection('dashboard');
              if (setMobileOpen) setMobileOpen(false);
            }}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-[#6366F1] to-[#8057F5] text-white shadow-sm shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-5 h-5" />
            </div>
            <span className="font-extrabold text-[17px] tracking-tight text-[#17172B] dark:text-white">
              Placement Hub
            </span>
          </div>

          {/* Mobile Close Button */}
          {setMobileOpen && (
            <button
              onClick={() => setMobileOpen(false)}
              className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto px-3 py-1 space-y-1 scrollbar-none">
          {mainNavItems.map((item) => {
            const Icon = item.icon;
            const isMainActive = currentSection === item.section;
            const hasSubsections = Boolean(item.subsections && item.subsections.length > 0);
            const isExpanded = expandedSection === item.section || isMainActive;

            return (
              <div key={item.id} className="space-y-0.5">
                {/* Main Section Button */}
                <button
                  onClick={() => handleMainClick(item)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-[13px] font-semibold transition-all duration-150 border ${
                    isMainActive
                      ? 'bg-[#EDE7FF] text-[#8057F5] dark:bg-[#251E3D] dark:text-[#A78BFA] border-[#DDD2FC] dark:border-[#382D5C] shadow-xs'
                      : 'text-[#4A4D68] dark:text-slate-300 border-transparent hover:text-[#17172B] dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center space-x-3.5 min-w-0">
                    <Icon
                      className={`w-4 h-4 shrink-0 transition-transform ${
                        isMainActive ? 'text-[#8057F5] dark:text-[#A78BFA] scale-110' : 'text-[#6F7390] dark:text-slate-400'
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                  </div>

                  <div className="flex items-center space-x-1.5 shrink-0">
                    {item.badge && (
                      <span
                        className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                          isMainActive
                            ? 'bg-brand-600 text-white shadow-xs'
                            : 'bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300 border border-brand-200/60'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}

                    {/* Subsections Expand / Collapse Chevron */}
                    {hasSubsections && (
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandedSection(prev => prev === item.section ? null : item.section);
                        }}
                        className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                      >
                        {isExpanded ? (
                          <ChevronDown className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronRight className="w-3.5 h-3.5" />
                        )}
                      </div>
                    )}
                  </div>
                </button>

                {/* Subsections Tree (Rendered Inside Parent Section) */}
                {hasSubsections && isExpanded && item.subsections && (
                  <div className="ml-5 pl-2.5 border-l-2 border-indigo-200/70 dark:border-indigo-900/40 my-1 space-y-0.5 animate-in slide-in-from-top-1 duration-150">
                    {item.subsections.map((sub) => {
                      const SubIcon = sub.icon;
                      const isSubActive = currentSection === item.section && currentSubSection === sub.id;

                      return (
                        <button
                          key={sub.id}
                          onClick={() => handleSubClick(item.section, sub.id)}
                          className={`w-full flex items-center space-x-2.5 px-2.5 py-1.5 rounded-xl text-xs transition-all ${
                            isSubActive
                              ? 'bg-[#EDE7FF] text-[#8057F5] dark:bg-[#251E3D] dark:text-[#A78BFA] font-bold shadow-xs'
                              : 'text-[#5C5F79] dark:text-slate-400 hover:text-[#17172B] dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-800/50 font-medium'
                          }`}
                        >
                          <SubIcon
                            className={`w-3.5 h-3.5 shrink-0 ${
                              isSubActive ? 'text-[#8057F5] dark:text-[#A78BFA]' : 'text-slate-400'
                            }`}
                          />
                          <span className="truncate">{sub.label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}

          {/* Sticky Note Box matching the reference image */}
          <div className="pt-3 pb-1 px-1">
            <div className="relative p-4 rounded-2xl bg-[#FCFDFF] dark:bg-[#1A1D2D] border border-slate-200/90 dark:border-slate-700/80 shadow-xs transform -rotate-1 hover:rotate-0 transition-transform duration-200 group">
              <div className="space-y-0.5">
                <p className="font-extrabold text-[15px] leading-tight text-[#17172B] dark:text-white">
                  Plan
                </p>
                <p className="font-extrabold text-[15px] leading-tight text-[#17172B] dark:text-white">
                  Prepare
                </p>
                <p className="font-extrabold text-[15px] leading-tight text-[#17172B] dark:text-white">
                  Practice
                </p>
                <p className="font-extrabold text-[15px] leading-tight text-[#17172B] dark:text-white">
                  Get Placed
                </p>
              </div>

              {/* Black circle arrow button */}
              <button
                onClick={() => {
                  setCurrentSection('career');
                  setCurrentSubSection('career-roadmap');
                  if (setMobileOpen) setMobileOpen(false);
                }}
                className="absolute right-3.5 bottom-3.5 w-8 h-8 rounded-full bg-[#17172B] dark:bg-white text-white dark:text-[#17172B] flex items-center justify-center shadow-md hover:scale-110 transition-transform"
                title="Open Roadmap"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Hand-drawn arrow pointing down towards user profile */}
            <div className="flex justify-start pl-6 -my-1">
              <SidebarCurvedArrowDoodle className="w-8 h-9 text-slate-500" />
            </div>
          </div>
        </div>

        {/* JARVIS Voice & Executive Agent Quick Launch */}
        <div className="px-3 pb-2 shrink-0">
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('open-jarvis'))}
            className="w-full p-2.5 rounded-2xl bg-gradient-to-r from-slate-900 via-cyan-950 to-slate-900 border border-cyan-500/40 text-left hover:border-cyan-400 transition-all shadow-md group relative overflow-hidden"
          >
            <div className="flex items-center space-x-2.5 relative z-10">
              <div className="w-8 h-8 rounded-xl bg-cyan-950 border border-cyan-400/60 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Bot className="w-4 h-4 text-cyan-300 animate-pulse" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-extrabold text-cyan-300 tracking-wide">JARVIS AI</p>
                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-mono">
                    LIVE
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 truncate">Voice • LinkedIn • Mails</p>
              </div>
            </div>
          </button>
        </div>

        {/* User Profile & Footer Section */}
        <div className="p-3.5 border-t border-slate-200/80 dark:border-slate-800 shrink-0 relative">
          <div className="flex items-center justify-between p-2 rounded-2xl hover:bg-slate-100/70 dark:hover:bg-slate-800/60 transition-colors">
            <div
              onClick={() => {
                setCurrentSection('career');
                setCurrentSubSection('profile');
                if (setMobileOpen) setMobileOpen(false);
              }}
              className="flex items-center space-x-3 cursor-pointer min-w-0"
            >
              {studentProfile?.avatar ? (
                <img
                  src={studentProfile.avatar}
                  alt={studentName}
                  className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#8057F5] to-[#6366F1] text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
                  {studentName.split(' ').map(n => n[0]).join('').slice(0, 2) || 'BG'}
                </div>
              )}

              <div className="min-w-0">
                <p className="text-xs font-bold text-[#17172B] dark:text-white truncate">
                  {studentName}
                </p>
                <p className="text-[11px] text-[#6F7390] dark:text-slate-400 capitalize truncate">
                  {role === 'coordinator' ? 'TPO Coordinator' : 'Student'}
                </p>
              </div>
            </div>

            {/* Menu Dropdown Toggle */}
            <div className="relative">
              <button
                onClick={() => setProfileMenuOpen(prev => !prev)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                title="Account options"
                aria-label="Account options"
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {profileMenuOpen && (
                <>
                  <div
                    onClick={() => setProfileMenuOpen(false)}
                    className="fixed inset-0 z-30"
                  />
                  <div className="absolute right-0 bottom-full mb-2 w-48 rounded-2xl bg-white dark:bg-[#1A1D2D] border border-slate-200 dark:border-slate-700 shadow-xl p-1.5 z-40 text-xs space-y-1">
                    <button
                      onClick={() => {
                        setRole(role === 'student' ? 'coordinator' : 'student');
                        setProfileMenuOpen(false);
                      }}
                      className="w-full flex items-center space-x-2 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium"
                    >
                      <User className="w-3.5 h-3.5" />
                      <span>Switch: {role === 'student' ? 'TPO Coordinator' : 'Student'}</span>
                    </button>

                    <button
                      onClick={() => {
                        toggleDarkMode();
                        setProfileMenuOpen(false);
                      }}
                      className="w-full flex items-center space-x-2 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium"
                    >
                      {darkMode ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-indigo-600" />}
                      <span>{darkMode ? 'Light Theme' : 'Dark Theme'}</span>
                    </button>

                    <button
                      onClick={() => {
                        setCurrentSection('career');
                        setCurrentSubSection('profile');
                        setProfileMenuOpen(false);
                        if (setMobileOpen) setMobileOpen(false);
                      }}
                      className="w-full flex items-center space-x-2 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      <span>View Profile</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
