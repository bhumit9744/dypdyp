import React, { useState } from 'react';
import {
  Search,
  Bell,
  ArrowRight,
  Compass,
  Video,
  Sparkles,
  TrendingUp,
  Gamepad2,
  Users,
  BookOpen,
  Mic,
  FileText,
  ChevronDown,
  CheckCircle2,
  Clock,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  OvalHighlightDoodle,
  HeaderCurvedArrowDoodle,
  NotepadDoodle,
  TasksCurvedArrowDoodle,
  TrendGraphDoodle,
  LaptopHeroIllustration,
  HandDrawnStarDoodle,
  StickyNoteTape,
  FigmaCursorBadge
} from '../../components/figma/FigmaDoodles';

interface PlanItem {
  id: string;
  text: string;
  completed: boolean;
  targetSection: 'career' | 'explore' | 'placements' | 'arena';
  targetSub?: string;
  tag: string;
}

interface UpcomingTask {
  id: string;
  title: string;
  timeSlot: string;
  completed: boolean;
  targetSection: 'career' | 'placements' | 'arena';
  targetSub?: string;
  status: 'upcoming' | 'today' | 'completed';
}

export const DashboardPage: React.FC = () => {
  const {
    studentProfile,
    setCurrentSection,
    setCurrentSubSection,
    searchQuery,
    setSearchQuery,
    skills,
    companies,
    interviewExperiences
  } = useApp();

  // Dynamic Time Greeting
  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? 'Good Morning' : currentHour < 17 ? 'Good Afternoon' : 'Good Evening';
  const studentName = studentProfile?.name || 'Vedant Borhade';
  const firstName = studentName.split(' ')[0] || 'Vedant';

  // Notification Modal State
  const [showNotifications, setShowNotifications] = useState(false);

  // Timeframe selector for Progress and Insights
  const [progressTimeframe, setProgressTimeframe] = useState<'month' | 'cycle'>('month');

  // Today's Plan Checklist State (Interactive with real routes and quick links)
  const [planItems, setPlanItems] = useState<PlanItem[]>([
    {
      id: 'plan_1',
      text: 'Complete DSA roadmap milestone (1 hr)',
      completed: true,
      targetSection: 'career',
      targetSub: 'career-roadmap',
      tag: 'Roadmap'
    },
    {
      id: 'plan_2',
      text: 'Practice 2 technical interview questions',
      completed: true,
      targetSection: 'career',
      targetSub: 'interview-studio',
      tag: 'Interview Prep'
    },
    {
      id: 'plan_3',
      text: 'Play a placement game (Bug Hunter)',
      completed: false,
      targetSection: 'arena',
      targetSub: 'games',
      tag: 'Challenge'
    },
    {
      id: 'plan_4',
      text: 'Update application & placement tracker',
      completed: false,
      targetSection: 'placements',
      targetSub: 'tracker',
      tag: 'Tracker'
    },
    {
      id: 'plan_5',
      text: 'Explore campus hiring companies (TCS / Infosys)',
      completed: true,
      targetSection: 'explore',
      targetSub: 'companies',
      tag: 'Explore'
    }
  ]);

  const togglePlanItem = (id: string) => {
    setPlanItems(prev =>
      prev.map(item => item.id === id ? { ...item, completed: !item.completed } : item)
    );
  };

  const completedPlanCount = planItems.filter(i => i.completed).length;
  const planProgressPercent = Math.round((completedPlanCount / planItems.length) * 100);

  // Upcoming Tasks Interactive State with status & timestamps
  const [upcomingTasks, setUpcomingTasks] = useState<UpcomingTask[]>([
    {
      id: 'task_1',
      title: 'Revise DBMS & OS core notes',
      timeSlot: 'Today • 5:00 PM – 6:00 PM',
      completed: true,
      targetSection: 'career',
      targetSub: 'profile',
      status: 'completed'
    },
    {
      id: 'task_2',
      title: 'Take AI Mock Interview (Aptitude & Coding)',
      timeSlot: 'Today • 6:30 PM – 7:00 PM',
      completed: false,
      targetSection: 'career',
      targetSub: 'interview-studio',
      status: 'today'
    },
    {
      id: 'task_3',
      title: 'HR Behavioral Interview Showdown',
      timeSlot: 'Tomorrow • 7:30 PM – 8:00 PM',
      completed: false,
      targetSection: 'arena',
      targetSub: 'games',
      status: 'upcoming'
    },
    {
      id: 'task_4',
      title: 'Review submitted company applications',
      timeSlot: 'Tomorrow • 8:00 PM – 8:30 PM',
      completed: false,
      targetSection: 'placements',
      targetSub: 'tracker',
      status: 'upcoming'
    }
  ]);

  const toggleUpcomingTask = (id: string) => {
    setUpcomingTasks(prev =>
      prev.map(task => {
        if (task.id === id) {
          const nextCompleted = !task.completed;
          return {
            ...task,
            completed: nextCompleted,
            status: nextCompleted ? 'completed' : 'today'
          };
        }
        return task;
      })
    );
  };

  // Date formatting matching reference image (e.g., Thu, 16 Oct)
  const todayDateStr = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    day: 'numeric',
    month: 'short'
  }).format(new Date());

  // Handle Search Submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setCurrentSection('explore');
      setCurrentSubSection('jobs-internships');
    }
  };

  // Calculate placement readiness dynamically from real state
  const verifiedSkillsCount = skills.filter(s => s.verified).length;
  const overallReadiness = Math.min(
    95,
    Math.max(68, Math.round(55 + (verifiedSkillsCount * 3) + (completedPlanCount * 2)))
  );

  return (
    <div className="space-y-6 sm:space-y-8 select-none">
      {/* -------------------------------------------------------------
       * Top Header: Greeting, Hand-drawn Annotation & Controls
       * ------------------------------------------------------------- */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left: Greeting & Hand-drawn annotation */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#17172B] dark:text-white flex items-center gap-2">
              <span>{greeting}, {firstName}</span>
              <span className="text-2xl animate-pulse">👋</span>
            </h1>
            <p className="text-xs sm:text-sm text-[#6F7390] dark:text-slate-400 mt-0.5">
              Small efforts today, big opportunities tomorrow. Plan your career, practice interviews & get placed.
            </p>
          </div>

          {/* Hand-drawn Annotation Doodle */}
          <div className="hidden md:flex items-center space-x-2 pt-1 text-slate-800 dark:text-slate-200">
            <HeaderCurvedArrowDoodle className="w-10 h-7 text-slate-800 dark:text-slate-300" />
            <div className="flex flex-col">
              <span className="font-handwriting text-lg sm:text-xl font-bold tracking-wide transform -rotate-2 text-slate-900 dark:text-slate-100">
                Plan • Practice • Get Placed ✨
              </span>
            </div>
          </div>
        </div>

        {/* Right: Search Bar, Notifications & Profile Avatar */}
        <div className="flex items-center space-x-3">
          {/* Figma Canvas Cursor Indicator */}
          <FigmaCursorBadge
            name="🎯 Target: Super Dream"
            color="#8057F5"
            className="hidden xl:inline-flex mr-1"
          />

          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search companies, roles, resources..."
              className="w-56 sm:w-68 pl-9 pr-4 py-2 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1A1D2D] text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#8057F5]/25 focus:border-[#8057F5] transition-all shadow-xs"
            />
          </form>

          {/* Notification Bell with alert badge */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="w-9 h-9 rounded-full bg-white dark:bg-[#1A1D2D] border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white shadow-xs transition-colors relative"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900" />
            </button>

            {/* Notification Drawer Popup */}
            {showNotifications && (
              <>
                <div
                  onClick={() => setShowNotifications(false)}
                  className="fixed inset-0 z-30"
                />
                <div className="absolute right-0 top-full mt-2 w-80 rounded-2xl bg-white dark:bg-[#1A1D2D] border border-slate-200 dark:border-slate-700 shadow-xl p-4 z-40 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                    <span className="font-bold text-xs text-slate-900 dark:text-white">Recent Placement Alerts</span>
                    <span className="text-[10px] font-semibold text-brand-600">3 New</span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-900 dark:text-purple-200 border border-purple-100">
                      <p className="font-bold text-[11px]">TCS National Qualifier Test 2026</p>
                      <p className="text-[10px] opacity-80">Drive registration closes in 48 hours for batch 2026.</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 border border-emerald-100">
                      <p className="font-bold text-[11px]">Interview Studio Telemetry</p>
                      <p className="text-[10px] opacity-80">Lighting & microphone diagnostics verified ready.</p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Profile Circle Avatar ("V") */}
          <button
            onClick={() => {
              setCurrentSection('career');
              setCurrentSubSection('profile');
            }}
            className="w-9 h-9 rounded-full bg-[#EDE7FF] dark:bg-[#251E3D] text-[#8057F5] dark:text-[#A78BFA] border border-[#DDD2FC] dark:border-indigo-900 font-bold text-xs flex items-center justify-center shadow-xs hover:scale-105 transition-transform"
            title={`Profile: ${studentName}`}
          >
            {firstName.charAt(0) || 'V'}
          </button>
        </div>
      </div>

      {/* -------------------------------------------------------------
       * Hero Section & Today's Plan Row
       * ------------------------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-stretch">
        {/* Large Rounded Lavender Hero Card (8 Cols) */}
        <div className="lg:col-span-8 rounded-3xl bg-[#EDE7FF] dark:bg-[#1E1933] border border-[#DDD2FC] dark:border-indigo-900/60 p-6 sm:p-8 relative overflow-hidden flex flex-col justify-between shadow-xs">
          {/* Subtle dotted grid texture in hero */}
          <div className="absolute inset-0 bg-canvas-dots opacity-40 pointer-events-none" />

          {/* Decorative Corner Stars */}
          <div className="absolute top-4 right-6 text-indigo-400 dark:text-indigo-300 opacity-70">
            <HandDrawnStarDoodle className="w-5 h-5 text-indigo-400" />
          </div>

          {/* Hero Content Container */}
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-4 max-w-md">
              {/* Badge: PLACEMENT HUB */}
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#DDD2FC]/80 dark:bg-[#34275E] text-[#6B46C1] dark:text-[#C4B5FD] text-[11px] font-extrabold uppercase tracking-wider">
                <span>✦</span>
                <span>Placement Hub</span>
              </div>

              {/* Title with hand-drawn oval around Career */}
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#17172B] dark:text-white leading-[1.18] tracking-tight">
                Your Journey From<br />
                College to{' '}
                <span className="relative inline-block font-extrabold px-1">
                  Career.
                  <OvalHighlightDoodle className="-inset-x-3 -inset-y-2 w-[125%] h-[135%]" />
                </span>
              </h2>

              {/* Subtitle */}
              <p className="text-xs sm:text-sm text-[#4A4D68] dark:text-slate-300 leading-relaxed max-w-sm">
                Plan your career, build skills, practice interviews, get guidance, and track your progress — all in one place.
              </p>

              {/* Dual Action Buttons: Primary & Secondary */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => {
                    setCurrentSection('career');
                    setCurrentSubSection('career-roadmap');
                  }}
                  className="px-6 py-3 rounded-full bg-[#17172B] hover:bg-[#282845] text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center space-x-2 group cursor-pointer"
                >
                  <span>Continue Learning</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => {
                    setCurrentSection('explore');
                    setCurrentSubSection('jobs-internships');
                  }}
                  className="px-5 py-3 rounded-full bg-white/90 dark:bg-white/10 hover:bg-white dark:hover:bg-white/20 text-[#17172B] dark:text-white border border-slate-300/80 dark:border-slate-700 font-semibold text-xs sm:text-sm transition-all flex items-center space-x-2 shadow-xs cursor-pointer"
                >
                  <span>Explore Opportunities</span>
                  <ChevronRight className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                </button>

                <button
                  onClick={() => {
                    setCurrentSection('connect');
                    setCurrentSubSection('home');
                  }}
                  className="px-4 py-3 rounded-full bg-brand-50 hover:bg-brand-100 text-brand-700 dark:bg-brand-950/60 dark:hover:bg-brand-900 dark:text-brand-300 border border-brand-200/80 dark:border-brand-800/80 font-bold text-xs sm:text-sm transition-all flex items-center space-x-1.5 shadow-xs cursor-pointer"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Student Connect</span>
                </button>
              </div>
            </div>

            {/* Right: Laptop Illustration with floating tags */}
            <div className="w-full md:w-auto flex justify-center">
              <LaptopHeroIllustration />
            </div>
          </div>
        </div>

        {/* Today's Plan Card (4 Cols - Soft Yellow Pastel) */}
        <div className="lg:col-span-4 rounded-3xl bg-[#FFFDF0] dark:bg-[#1E1E28] border border-[#FEEBA4] dark:border-amber-900/40 p-6 sm:p-7 relative flex flex-col justify-between shadow-xs">
          {/* Washi Tape Strip */}
          <StickyNoteTape className="w-20" />

          {/* Top Header */}
          <div className="space-y-1 pt-1">
            <span className="text-xs font-semibold text-[#8B7735] dark:text-amber-400">
              {todayDateStr}
            </span>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-[#17172B] dark:text-white">
                Today's Plan
              </h3>
              <span className="text-xs font-bold text-slate-600 dark:text-slate-300 bg-white/80 dark:bg-slate-800/80 px-2.5 py-0.5 rounded-full border border-slate-200/80 dark:border-slate-700 shadow-xs">
                {completedPlanCount}/{planItems.length} completed
              </span>
            </div>

            {/* Mini Progress Bar for Today's Plan */}
            <div className="w-full h-1.5 rounded-full bg-amber-100 dark:bg-amber-950/60 overflow-hidden mt-1.5">
              <div
                className="h-full bg-amber-500 rounded-full transition-all duration-300"
                style={{ width: `${planProgressPercent}%` }}
              />
            </div>
          </div>

          {/* Interactive Checklist Items with Quick Links */}
          <div className="my-4 space-y-2.5">
            {planItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between group p-1 rounded-xl hover:bg-amber-100/30 dark:hover:bg-amber-950/20 transition-colors"
              >
                <div
                  className="flex items-center space-x-3 cursor-pointer min-w-0 flex-1"
                  onClick={() => togglePlanItem(item.id)}
                >
                  {/* Rounded checkbox */}
                  <button
                    type="button"
                    aria-label={item.text}
                    className={`w-5 h-5 rounded-lg shrink-0 flex items-center justify-center transition-all ${
                      item.completed
                        ? 'bg-[#3B82F6] text-white shadow-xs'
                        : 'border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 group-hover:border-slate-400'
                    }`}
                  >
                    {item.completed && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </button>

                  {/* Task Text */}
                  <span
                    className={`text-xs truncate transition-colors ${
                      item.completed
                        ? 'text-slate-400 dark:text-slate-500 line-through'
                        : 'text-[#17172B] dark:text-white font-medium'
                    }`}
                  >
                    {item.text}
                  </span>
                </div>

                {/* Quick Link to Feature */}
                <button
                  onClick={() => {
                    setCurrentSection(item.targetSection);
                    if (item.targetSub) setCurrentSubSection(item.targetSub as any);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-slate-800 dark:hover:text-white transition-opacity ml-1"
                  title={`Go to ${item.tag}`}
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          {/* Bottom Notepad Doodle & Summary */}
          <div className="flex items-center justify-between pt-1 border-t border-amber-200/50 dark:border-amber-900/30">
            <span className="text-[11px] font-semibold text-[#8B7735] dark:text-amber-400/80">
              {completedPlanCount === planItems.length ? '🎉 All tasks done today!' : `${planItems.length - completedPlanCount} tasks remaining`}
            </span>
            <NotepadDoodle className="w-8 h-10" />
          </div>
        </div>
      </div>

      {/* -------------------------------------------------------------
       * Feature Cards Row (6 Colorful Pastel Cards)
       * ------------------------------------------------------------- */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">
        {/* 1. AI Career Roadmap */}
        <div
          onClick={() => {
            setCurrentSection('career');
            setCurrentSubSection('career-roadmap');
          }}
          className="p-4 rounded-2xl bg-[#EDE7FF] dark:bg-[#1E1933] border border-[#DDD2FC] dark:border-[#382D5C] flex flex-col justify-between cursor-pointer group min-h-[120px] hover:-translate-y-1.5 hover:shadow-md transition-all duration-200"
        >
          <div className="w-9 h-9 rounded-xl bg-[#DDD2FC] dark:bg-[#2C234C] flex items-center justify-center text-[#7C3AED] dark:text-[#C4B5FD] shadow-xs group-hover:scale-110 transition-transform">
            <Compass className="w-4 h-4" />
          </div>
          <div className="mt-2.5">
            <span className="text-xs font-bold text-[#17172B] dark:text-white leading-snug block">
              AI Career<br />Roadmaps
            </span>
            <p className="text-[10px] text-[#6F7390] dark:text-slate-400 mt-0.5 line-clamp-1">
              Personalized paths
            </p>
          </div>
          <div className="flex justify-end mt-2">
            <div className="w-6 h-6 rounded-full bg-white/80 dark:bg-white/10 text-[#7C3AED] dark:text-[#C4B5FD] flex items-center justify-center group-hover:translate-x-1 transition-transform shadow-xs">
              <ArrowRight className="w-3 h-3" />
            </div>
          </div>
        </div>

        {/* 2. Live AI Interview Prep */}
        <div
          onClick={() => {
            setCurrentSection('career');
            setCurrentSubSection('interview-studio');
          }}
          className="p-4 rounded-2xl bg-[#E6F2FF] dark:bg-[#132135] border border-[#CCE4FE] dark:border-[#1E3A5F] flex flex-col justify-between cursor-pointer group min-h-[120px] hover:-translate-y-1.5 hover:shadow-md transition-all duration-200"
        >
          <div className="w-9 h-9 rounded-xl bg-[#CCE4FE] dark:bg-[#1C3352] flex items-center justify-center text-[#0284C7] dark:text-[#7DD3FC] shadow-xs group-hover:scale-110 transition-transform">
            <Video className="w-4 h-4" />
          </div>
          <div className="mt-2.5">
            <span className="text-xs font-bold text-[#17172B] dark:text-white leading-snug block">
              Live AI<br />Interview Prep
            </span>
            <p className="text-[10px] text-[#6F7390] dark:text-slate-400 mt-0.5 line-clamp-1">
              Technical & HR mocks
            </p>
          </div>
          <div className="flex justify-end mt-2">
            <div className="w-6 h-6 rounded-full bg-white/80 dark:bg-white/10 text-[#0284C7] dark:text-[#7DD3FC] flex items-center justify-center group-hover:translate-x-1 transition-transform shadow-xs">
              <ArrowRight className="w-3 h-3" />
            </div>
          </div>
        </div>

        {/* 3. Career Guidance & Exploration */}
        <div
          onClick={() => {
            setCurrentSection('career');
            setCurrentSubSection('career-guidance');
          }}
          className="p-4 rounded-2xl bg-[#FFF0E5] dark:bg-[#2D1C16] border border-[#FEDDC7] dark:border-[#542E1F] flex flex-col justify-between cursor-pointer group min-h-[120px] hover:-translate-y-1.5 hover:shadow-md transition-all duration-200"
        >
          <div className="w-9 h-9 rounded-xl bg-[#FEDDC7] dark:bg-[#43251A] flex items-center justify-center text-[#EA580C] dark:text-[#FDBA74] shadow-xs group-hover:scale-110 transition-transform">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="mt-2.5">
            <span className="text-xs font-bold text-[#17172B] dark:text-white leading-snug block">
              Career Guidance<br />& Exploration
            </span>
            <p className="text-[10px] text-[#6F7390] dark:text-slate-400 mt-0.5 line-clamp-1">
              Curated insights
            </p>
          </div>
          <div className="flex justify-end mt-2">
            <div className="w-6 h-6 rounded-full bg-white/80 dark:bg-white/10 text-[#EA580C] dark:text-[#FDBA74] flex items-center justify-center group-hover:translate-x-1 transition-transform shadow-xs">
              <ArrowRight className="w-3 h-3" />
            </div>
          </div>
        </div>

        {/* 4. Placement Tracker */}
        <div
          onClick={() => {
            setCurrentSection('placements');
            setCurrentSubSection('tracker');
          }}
          className="p-4 rounded-2xl bg-[#E0F8ED] dark:bg-[#13261C] border border-[#C6F1DA] dark:border-[#1B4A33] flex flex-col justify-between cursor-pointer group min-h-[120px] hover:-translate-y-1.5 hover:shadow-md transition-all duration-200"
        >
          <div className="w-9 h-9 rounded-xl bg-[#C6F1DA] dark:bg-[#1B3C2B] flex items-center justify-center text-[#16A34A] dark:text-[#86EFAC] shadow-xs group-hover:scale-110 transition-transform">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div className="mt-2.5">
            <span className="text-xs font-bold text-[#17172B] dark:text-white leading-snug block">
              Placement<br />Tracker
            </span>
            <p className="text-[10px] text-[#6F7390] dark:text-slate-400 mt-0.5 line-clamp-1">
              Drives & applications
            </p>
          </div>
          <div className="flex justify-end mt-2">
            <div className="w-6 h-6 rounded-full bg-white/80 dark:bg-white/10 text-[#16A34A] dark:text-[#86EFAC] flex items-center justify-center group-hover:translate-x-1 transition-transform shadow-xs">
              <ArrowRight className="w-3 h-3" />
            </div>
          </div>
        </div>

        {/* 5. Games & Challenges */}
        <div
          onClick={() => {
            setCurrentSection('arena');
            setCurrentSubSection('games');
          }}
          className="p-4 rounded-2xl bg-[#FFE8F0] dark:bg-[#2E1620] border border-[#FDCEDC] dark:border-[#592539] flex flex-col justify-between cursor-pointer group min-h-[120px] hover:-translate-y-1.5 hover:shadow-md transition-all duration-200"
        >
          <div className="w-9 h-9 rounded-xl bg-[#FDCEDC] dark:bg-[#451C2C] flex items-center justify-center text-[#E11D48] dark:text-[#FDA4AF] shadow-xs group-hover:scale-110 transition-transform">
            <Gamepad2 className="w-4 h-4" />
          </div>
          <div className="mt-2.5">
            <span className="text-xs font-bold text-[#17172B] dark:text-white leading-snug block">
              Games &<br />Challenges
            </span>
            <p className="text-[10px] text-[#6F7390] dark:text-slate-400 mt-0.5 line-clamp-1">
              Bug hunter battles
            </p>
          </div>
          <div className="flex justify-end mt-2">
            <div className="w-6 h-6 rounded-full bg-white/80 dark:bg-white/10 text-[#E11D48] dark:text-[#FDA4AF] flex items-center justify-center group-hover:translate-x-1 transition-transform shadow-xs">
              <ArrowRight className="w-3 h-3" />
            </div>
          </div>
        </div>

        {/* 6. Student Connect */}
        <div
          onClick={() => {
            setCurrentSection('connect');
            setCurrentSubSection('home');
          }}
          className="p-4 rounded-2xl bg-[#EDE7FF] dark:bg-[#251E3D] border border-[#DDD2FC] dark:border-[#382D5C] flex flex-col justify-between cursor-pointer group min-h-[120px] hover:-translate-y-1.5 hover:shadow-md transition-all duration-200"
        >
          <div className="w-9 h-9 rounded-xl bg-[#DDD2FC] dark:bg-[#34275E] flex items-center justify-center text-[#7C3AED] dark:text-[#C4B5FD] shadow-xs group-hover:scale-110 transition-transform">
            <Users className="w-4 h-4" />
          </div>
          <div className="mt-2.5">
            <span className="text-xs font-bold text-[#17172B] dark:text-white leading-snug block">
              Student<br />Connect
            </span>
            <p className="text-[10px] text-[#6F7390] dark:text-slate-400 mt-0.5 line-clamp-1">
              Connect. Collaborate. Grow.
            </p>
          </div>
          <div className="flex justify-end mt-2">
            <div className="w-6 h-6 rounded-full bg-white/80 dark:bg-white/10 text-[#7C3AED] dark:text-[#C4B5FD] flex items-center justify-center group-hover:translate-x-1 transition-transform shadow-xs">
              <ArrowRight className="w-3 h-3" />
            </div>
          </div>
        </div>
      </div>

      {/* -------------------------------------------------------------
       * Progress & Productivity Widgets (3 Columns)
       * ------------------------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
        {/* Widget 1: Your Progress */}
        <div className="figma-card p-6 rounded-3xl bg-white dark:bg-[#141724] border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-[#17172B] dark:text-white">
                Your Progress
              </h3>
              <p className="text-[11px] text-[#6F7390] dark:text-slate-400">
                Overall Placement Readiness
              </p>
            </div>
            <button
              onClick={() => setProgressTimeframe(prev => prev === 'month' ? 'cycle' : 'month')}
              className="flex items-center space-x-1 text-xs text-slate-600 dark:text-slate-300 font-semibold px-2.5 py-1 rounded-xl border border-slate-200/80 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 transition-colors"
            >
              <span>{progressTimeframe === 'month' ? 'This Month' : 'Placement Cycle'}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6 pt-2">
            {/* Circular Progress Gauge */}
            <div className="relative w-32 h-32 flex items-center justify-center shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                {/* Background Ring */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  className="stroke-slate-100 dark:stroke-slate-800"
                  strokeWidth="8"
                  fill="none"
                />
                {/* Progress Gradient Arc */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="url(#progressGrad)"
                  strokeWidth="8"
                  strokeDasharray="251.2"
                  strokeDashoffset={251.2 * (1 - overallReadiness / 100)}
                  strokeLinecap="round"
                  fill="none"
                  className="transition-all duration-700 ease-out"
                />
                <defs>
                  <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#06B6D4" />
                    <stop offset="60%" stopColor="#3B82F6" />
                    <stop offset="100%" stopColor="#8057F5" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-2xl font-black text-[#17172B] dark:text-white tracking-tight">
                  {overallReadiness}%
                </span>
                <span className="text-[10px] font-semibold text-[#6F7390] dark:text-slate-400">
                  Ready
                </span>
              </div>
            </div>

            {/* Preparation Area Breakdown Bars */}
            <div className="flex-1 w-full space-y-2 text-xs">
              {/* DSA */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-[11px] font-medium text-slate-700 dark:text-slate-300">
                  <span className="flex items-center gap-1.5 font-semibold">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    DSA & Problem Solving
                  </span>
                  <span className="text-slate-500 font-bold">70%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div className="h-full rounded-full bg-[#3B82F6] transition-all duration-500" style={{ width: '70%' }} />
                </div>
              </div>

              {/* Development */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-[11px] font-medium text-slate-700 dark:text-slate-300">
                  <span className="flex items-center gap-1.5 font-semibold">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    Full-Stack Development
                  </span>
                  <span className="text-slate-500 font-bold">65%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div className="h-full rounded-full bg-[#8057F5] transition-all duration-500" style={{ width: '65%' }} />
                </div>
              </div>

              {/* Aptitude */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-[11px] font-medium text-slate-700 dark:text-slate-300">
                  <span className="flex items-center gap-1.5 font-semibold">
                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                    Quantitative Aptitude
                  </span>
                  <span className="text-slate-500 font-bold">80%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div className="h-full rounded-full bg-[#06B6D4] transition-all duration-500" style={{ width: '80%' }} />
                </div>
              </div>

              {/* Mock Interviews */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-[11px] font-medium text-slate-700 dark:text-slate-300">
                  <span className="flex items-center gap-1.5 font-semibold">
                    <span className="w-2 h-2 rounded-full bg-purple-500" />
                    Mock Technical & HR
                  </span>
                  <span className="text-slate-500 font-bold">55%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div className="h-full rounded-full bg-[#EC4899] transition-all duration-500" style={{ width: '55%' }} />
                </div>
              </div>

              {/* Resume & Profile */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-[11px] font-medium text-slate-700 dark:text-slate-300">
                  <span className="flex items-center gap-1.5 font-semibold">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    Resume & Profile Score
                  </span>
                  <span className="text-slate-500 font-bold">75%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div className="h-full rounded-full bg-[#F59E0B] transition-all duration-500" style={{ width: '75%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Widget 2: Upcoming Tasks */}
        <div className="figma-card p-6 rounded-3xl bg-white dark:bg-[#141724] border border-slate-200/90 dark:border-slate-800 shadow-xs relative flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3">
              <div>
                <h3 className="text-base font-bold text-[#17172B] dark:text-white">
                  Upcoming Tasks
                </h3>
                <p className="text-[11px] text-[#6F7390] dark:text-slate-400">
                  Deadlines & Scheduled Practice
                </p>
              </div>
              <button
                onClick={() => {
                  setCurrentSection('placements');
                  setCurrentSubSection('tracker');
                }}
                className="text-xs font-bold text-[#3B82F6] hover:underline flex items-center space-x-1"
              >
                <span>View All</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {/* Task list with checkboxes and time badges */}
            <div className="space-y-2.5 mt-2">
              {upcomingTasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => toggleUpcomingTask(task.id)}
                  className={`flex items-start space-x-3 p-2.5 rounded-xl transition-all cursor-pointer border ${
                    task.completed
                      ? 'bg-slate-50/70 dark:bg-slate-900/40 border-slate-200/50 dark:border-slate-800/50'
                      : 'bg-white dark:bg-[#1A1D2D] border-slate-200/90 dark:border-slate-700/80 hover:border-slate-300'
                  }`}
                >
                  <button
                    type="button"
                    aria-label={task.title}
                    className={`mt-0.5 w-4 h-4 rounded-md flex items-center justify-center transition-all shrink-0 ${
                      task.completed
                        ? 'bg-[#16A34A] text-white shadow-xs'
                        : 'border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900'
                    }`}
                  >
                    {task.completed && <CheckCircle2 className="w-3 h-3" />}
                  </button>

                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-semibold ${task.completed ? 'text-slate-400 line-through' : 'text-slate-900 dark:text-white'}`}>
                      {task.title}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {task.timeSlot}
                      </span>
                      {task.status === 'today' && !task.completed && (
                        <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                          Today
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Hand-drawn doodle arrow & badge icon in bottom right */}
          <div className="flex items-center justify-end space-x-2 pt-3">
            <TasksCurvedArrowDoodle className="w-8 h-8 text-slate-600 dark:text-slate-400" />
            <div className="px-2 py-0.5 rounded-md border border-slate-300 dark:border-slate-700 text-[10px] font-bold text-slate-600 dark:text-slate-300">
              Check off as you complete
            </div>
          </div>
        </div>

        {/* Widget 3: Placement Insights */}
        <div className="figma-card p-6 rounded-3xl bg-white dark:bg-[#141724] border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-[#17172B] dark:text-white">
                Placement Insights
              </h3>
              <p className="text-[11px] text-[#6F7390] dark:text-slate-400">
                Verified Campus Recruitment Statistics
              </p>
            </div>
            <div className="flex items-center space-x-1 text-xs text-slate-600 dark:text-slate-300 font-semibold px-2 py-1 rounded-xl border border-slate-200/80 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
              <span>Cycle 2026</span>
            </div>
          </div>

          {/* 4 Stat Cards */}
          <div className="grid grid-cols-4 gap-2 text-center pt-1">
            <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800">
              <span className="block text-base font-black text-emerald-600 dark:text-emerald-400">
                {companies.length > 0 ? `${companies.length * 10}+` : '120+'}
              </span>
              <span className="text-[10px] text-slate-400 font-medium">Companies</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800">
              <span className="block text-base font-black text-amber-600 dark:text-amber-400">
                {interviewExperiences.length > 0 ? `${interviewExperiences.length * 40}+` : '450+'}
              </span>
              <span className="text-[10px] text-slate-400 font-medium">Interview Qs</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800">
              <span className="block text-base font-black text-sky-600 dark:text-sky-400">
                25+
              </span>
              <span className="text-[10px] text-slate-400 font-medium">Resources</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800">
              <span className="block text-base font-black text-purple-600 dark:text-purple-400">
                500+
              </span>
              <span className="text-[10px] text-slate-400 font-medium">Students</span>
            </div>
          </div>

          {/* Top Hiring Domains Horizontal Bars */}
          <div className="space-y-2 pt-1">
            <span className="text-xs font-bold text-[#17172B] dark:text-white block">
              Top Hiring Domains
            </span>

            {/* SDE */}
            <div className="flex items-center justify-between text-[11px] gap-2">
              <span className="w-24 text-slate-600 dark:text-slate-300 truncate font-medium">SDE / Dev</span>
              <div className="flex-1 h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: '42%' }} />
              </div>
              <span className="w-8 text-right font-bold text-slate-600 dark:text-slate-400">42%</span>
            </div>

            {/* Data Science */}
            <div className="flex items-center justify-between text-[11px] gap-2">
              <span className="w-24 text-slate-600 dark:text-slate-300 truncate font-medium">Data & AI</span>
              <div className="flex-1 h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div className="h-full bg-purple-500 rounded-full" style={{ width: '28%' }} />
              </div>
              <span className="w-8 text-right font-bold text-slate-600 dark:text-slate-400">28%</span>
            </div>

            {/* Product */}
            <div className="flex items-center justify-between text-[11px] gap-2">
              <span className="w-24 text-slate-600 dark:text-slate-300 truncate font-medium">Product & UX</span>
              <div className="flex-1 h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div className="h-full bg-pink-500 rounded-full" style={{ width: '15%' }} />
              </div>
              <span className="w-8 text-right font-bold text-slate-600 dark:text-slate-400">15%</span>
            </div>

            {/* Consulting */}
            <div className="flex items-center justify-between text-[11px] gap-2">
              <span className="w-24 text-slate-600 dark:text-slate-300 truncate font-medium">Consulting</span>
              <div className="flex-1 h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div className="h-full bg-orange-500 rounded-full" style={{ width: '10%' }} />
              </div>
              <span className="w-8 text-right font-bold text-slate-600 dark:text-slate-400">10%</span>
            </div>

            {/* Core/Other */}
            <div className="flex items-center justify-between text-[11px] gap-2">
              <span className="w-24 text-slate-600 dark:text-slate-300 truncate font-medium">Core Engg</span>
              <div className="flex-1 h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: '5%' }} />
              </div>
              <span className="w-8 text-right font-bold text-slate-600 dark:text-slate-400">5%</span>
            </div>
          </div>
        </div>
      </div>

      {/* -------------------------------------------------------------
       * Recommended for You & Motivational Sticky Note Row
       * ------------------------------------------------------------- */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-amber-500 text-sm">✨</span>
            <h3 className="text-sm font-bold text-[#17172B] dark:text-white uppercase tracking-wider">
              Recommended for You
            </h3>
          </div>
          <div className="hidden sm:flex items-center space-x-1.5 text-xs text-slate-400">
            <span>Adaptive suggestions based on your target dream role</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch">
          {/* 4 Pastel Recommendation Cards (8 Cols) */}
          <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {/* Card 1: Complete DSA Roadmap (Sky Blue) */}
            <div
              onClick={() => {
                setCurrentSection('career');
                setCurrentSubSection('career-roadmap');
              }}
              className="p-4 rounded-2xl bg-[#E6F2FF] dark:bg-[#132135] border border-[#CCE4FE] dark:border-[#1E3A5F] flex flex-col justify-between cursor-pointer hover:-translate-y-1 hover:shadow-md transition-all duration-200 group"
            >
              <div className="w-9 h-9 rounded-xl bg-[#CCE4FE] dark:bg-[#1C3352] flex items-center justify-center text-[#0284C7] dark:text-[#7DD3FC] shadow-xs mb-3 group-hover:scale-105 transition-transform">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#17172B] dark:text-white leading-snug">
                  Complete DSA Roadmap
                </p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                  Graphs & DP module
                </p>
                <div className="flex items-center space-x-1 text-[11px] font-bold text-[#0284C7] dark:text-[#7DD3FC] mt-2.5 group-hover:underline">
                  <span>Start Now</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </div>

            {/* Card 2: Take a Mock Interview (Coral Pink) */}
            <div
              onClick={() => {
                setCurrentSection('career');
                setCurrentSubSection('interview-studio');
              }}
              className="p-4 rounded-2xl bg-[#FFE8F0] dark:bg-[#2E1620] border border-[#FDCEDC] dark:border-[#592539] flex flex-col justify-between cursor-pointer hover:-translate-y-1 hover:shadow-md transition-all duration-200 group"
            >
              <div className="w-9 h-9 rounded-xl bg-[#FDCEDC] dark:bg-[#451C2C] flex items-center justify-center text-[#E11D48] dark:text-[#FDA4AF] shadow-xs mb-3 group-hover:scale-105 transition-transform">
                <Mic className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#17172B] dark:text-white leading-snug">
                  Take a Mock Interview
                </p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                  AI Technical Studio
                </p>
                <div className="flex items-center space-x-1 text-[11px] font-bold text-[#E11D48] dark:text-[#FDA4AF] mt-2.5 group-hover:underline">
                  <span>Practice Now</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </div>

            {/* Card 3: Update Your Resume (Mint Green) */}
            <div
              onClick={() => {
                setCurrentSection('career');
                setCurrentSubSection('profile');
              }}
              className="p-4 rounded-2xl bg-[#E0F8ED] dark:bg-[#13261C] border border-[#C6F1DA] dark:border-[#1B4A33] flex flex-col justify-between cursor-pointer hover:-translate-y-1 hover:shadow-md transition-all duration-200 group"
            >
              <div className="w-9 h-9 rounded-xl bg-[#C6F1DA] dark:bg-[#1B3C2B] flex items-center justify-center text-[#16A34A] dark:text-[#86EFAC] shadow-xs mb-3 group-hover:scale-105 transition-transform">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#17172B] dark:text-white leading-snug">
                  Update Your Resume
                </p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                  ATS Score Check
                </p>
                <div className="flex items-center space-x-1 text-[11px] font-bold text-[#16A34A] dark:text-[#86EFAC] mt-2.5 group-hover:underline">
                  <span>Improve Now</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </div>

            {/* Card 4: Play a Game (Bug Hunter) (Lavender) */}
            <div
              onClick={() => {
                setCurrentSection('arena');
                setCurrentSubSection('games');
              }}
              className="p-4 rounded-2xl bg-[#EDE7FF] dark:bg-[#1E1933] border border-[#DDD2FC] dark:border-[#382D5C] flex flex-col justify-between cursor-pointer hover:-translate-y-1 hover:shadow-md transition-all duration-200 group"
            >
              <div className="w-9 h-9 rounded-xl bg-[#DDD2FC] dark:bg-[#2C234C] flex items-center justify-center text-[#7C3AED] dark:text-[#C4B5FD] shadow-xs mb-3 group-hover:scale-105 transition-transform">
                <Gamepad2 className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#17172B] dark:text-white leading-snug">
                  Play Bug Hunter
                </p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                  Speed code debug test
                </p>
                <div className="flex items-center space-x-1 text-[11px] font-bold text-[#7C3AED] dark:text-[#C4B5FD] mt-2.5 group-hover:underline">
                  <span>Start Playing</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </div>
          </div>

          {/* Motivational Sticky Note (4 Cols - Soft Yellow Craft Style) */}
          <div className="md:col-span-4 rounded-2xl bg-[#FFF5CF] dark:bg-[#1F1E29] border border-[#FEEBA4] dark:border-amber-900/40 p-5 flex items-center justify-between shadow-xs transform rotate-1 hover:rotate-0 transition-transform relative">
            {/* Washi Tape Strip */}
            <StickyNoteTape className="w-16" />

            <div className="space-y-1.5 max-w-[210px] pt-1">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-700 dark:text-amber-400/80">
                Daily Motivation
              </span>
              <p className="font-handwriting text-xl sm:text-2xl font-bold text-[#17172B] dark:text-white leading-tight">
                “Discipline today,<br />
                dream job tomorrow.”
              </p>
              <p className="text-[11px] text-[#8B7735] dark:text-slate-400">
                Stay consistent. Consistency beats intensity.
              </p>
            </div>
            <div className="shrink-0 pl-2">
              <TrendGraphDoodle className="w-13 h-11" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

