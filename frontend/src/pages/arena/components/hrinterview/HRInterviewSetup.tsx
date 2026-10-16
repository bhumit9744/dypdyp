import React, { useState } from 'react';
import {
  Briefcase,
  Users,
  Zap,
  Compass,
  Flame,
  ShieldAlert,
  Award,
  Clock,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  MessageSquare,
  Target,
  Check,
  HelpCircle
} from 'lucide-react';
import {
  HRConfig,
  HRDifficulty,
  HRCategory,
  HRGameMode
} from '../../types/hrInterview';
import { loadUserHRStats } from '../../utils/hrInterviewStorage';

interface HRInterviewSetupProps {
  onStartGame?: (config: HRConfig) => void;
  onStartSession?: (config: HRConfig) => void;
  onBackToArena: () => void;
  initialMode?: HRGameMode;
  initialConfig?: HRConfig;
}

export const HRInterviewSetup: React.FC<HRInterviewSetupProps> = ({
  onStartGame,
  onStartSession,
  onBackToArena,
  initialMode = 'core-interview',
  initialConfig
}) => {
  const stats = loadUserHRStats();

  const [mode, setMode] = useState<HRGameMode>(initialConfig?.mode || initialMode);
  const [category, setCategory] = useState<HRCategory>(initialConfig?.category || 'Mixed HR');
  const [difficulty, setDifficulty] = useState<HRDifficulty>(initialConfig?.difficulty || 'Beginner');
  const [questionCount, setChallengeCount] = useState<5 | 10 | 15>(initialConfig?.questionCount || 5);
  const [isTimed, setIsTimed] = useState<boolean>(initialConfig?.isTimed ?? initialConfig?.timedMode ?? false);
  const [hintsEnabled, setHintsEnabled] = useState<boolean>(initialConfig?.hintsEnabled ?? initialConfig?.showHints ?? true);

  const modes: {
    id: HRGameMode;
    title: string;
    tagline: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    badge: string;
    color: string;
  }[] = [
    {
      id: 'core-interview',
      title: 'Core HR Interview',
      tagline: 'Structured HR Round Simulation',
      description: 'Progressive interview flow from self-introduction to motivation, strengths, teamwork, and closing questions with multiple-choice and typed answers.',
      icon: Briefcase,
      badge: 'Main Simulation',
      color: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950 dark:text-indigo-300'
    },
    {
      id: 'rapid-fire',
      title: 'Rapid Fire HR',
      tagline: 'Fast-paced spontaneous response round',
      description: 'Quick behavioral and situational prompts with a live countdown timer. Tests spontaneity, authentic communication, and poise under ticking pressure.',
      icon: Zap,
      badge: 'Speed Round',
      color: 'text-amber-600 bg-amber-50 dark:bg-amber-950 dark:text-amber-300'
    },
    {
      id: 'workplace-situations',
      title: 'Workplace Situations',
      tagline: 'Real-world dilemmas & team dynamics',
      description: 'Navigate realistic campus placement scenarios: conflicting deadlines, receiving harsh feedback, peer non-contribution, and ethical integrity.',
      icon: Users,
      badge: 'Situational Judgement',
      color: 'text-blue-600 bg-blue-50 dark:bg-blue-950 dark:text-blue-300'
    },
    {
      id: 'difficult-hr',
      title: 'Difficult HR Round',
      tagline: 'High-stakes & uncomfortable questions',
      description: 'Tackle tough placement probes: explaining lower GPAs, gap years, why to hire you over others, handling rejection, and fresher salary expectations.',
      icon: ShieldAlert,
      badge: 'Pressure Round',
      color: 'text-rose-600 bg-rose-50 dark:bg-rose-950 dark:text-rose-300'
    }
  ];

  const categories: { id: HRCategory; label: string }[] = [
    { id: 'Mixed HR', label: 'All Categories (Comprehensive)' },
    { id: 'Introduction & Motivation', label: 'Introduction & Motivation' },
    { id: 'Strengths & Weaknesses', label: 'Strengths & Self-Awareness' },
    { id: 'Teamwork & Collaboration', label: 'Teamwork & Collaboration' },
    { id: 'Conflict & Pressure', label: 'Conflict, Deadlines & Pressure' },
    { id: 'Failure & Accountability', label: 'Failure, Mistakes & Ownership' },
    { id: 'Ethics & Integrity', label: 'Professional Ethics & Integrity' },
    { id: 'Adaptability & Learning', label: 'Adaptability & Growth Mindset' },
    { id: 'Difficult HR & Salary', label: 'Tough Questions & Salary' },
    { id: 'Workplace Scenarios', label: 'Real Workplace Dilemmas' }
  ];

  const difficulties: { id: HRDifficulty; label: string; desc: string; color: string }[] = [
    { id: 'Beginner', label: 'Beginner', desc: 'Standard HR questions, clear guidelines, supportive hints', color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60' },
    { id: 'Intermediate', label: 'Intermediate', desc: 'Behavioral STAR situations, peer conflict, nuanced options', color: 'text-blue-600 bg-blue-50 dark:bg-blue-950/60' },
    { id: 'Advanced', label: 'Advanced', desc: 'High-pressure questions, competing priorities, salary diplomacy', color: 'text-purple-600 bg-purple-50 dark:bg-purple-950/60' },
    { id: 'Mixed', label: 'Mixed Difficulty', desc: 'Adaptive progression across beginner to tough interview rounds', color: 'text-cyan-600 bg-cyan-50 dark:bg-cyan-950/60' }
  ];

  const handleStart = () => {
    const finalConfig: HRConfig = {
      mode,
      category,
      difficulty,
      questionCount,
      isTimed: mode === 'rapid-fire' ? true : isTimed,
      hintsEnabled,
      timedMode: mode === 'rapid-fire' ? true : isTimed,
      showHints: hintsEnabled
    };
    if (onStartGame) onStartGame(finalConfig);
    if (onStartSession) onStartSession(finalConfig);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
      {/* Navigation Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToArena}
          className="flex items-center space-x-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Games Hub</span>
        </button>

        <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
          <Briefcase className="w-3.5 h-3.5 text-indigo-500" />
          HR Interview Showdown • Campus Edition
        </span>
      </div>

      {/* Main Setup Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-none p-6 sm:p-8 space-y-8">
        
        {/* Banner */}
        <div className="border-b border-slate-100 dark:border-slate-800 pb-6 space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Recruitment Interview Simulator
            </span>
            <span className="text-xs font-bold text-slate-400">
              80+ Original Scenarios & Questions
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            HR Interview Showdown
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
            <em>Your next placement starts with how you answer.</em> Practice realistic campus recruitment questions, master the STAR framework, navigate workplace dilemmas, and receive transparent rubric-based feedback.
          </p>
        </div>

        {/* User Stats Quick Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Sessions Completed</span>
            <span className="text-lg font-black text-slate-900 dark:text-white">
              {stats.totalSessionsCompleted}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Questions Answered</span>
            <span className="text-lg font-black text-slate-900 dark:text-white">
              {stats.totalQuestionsAnswered}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Average Quality</span>
            <span className="text-lg font-black text-indigo-600 dark:text-indigo-400">
              {stats.overallAverage > 0 ? `${stats.overallAverage}%` : '0%'}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Best Score</span>
            <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">
              {stats.bestScore} pts
            </span>
          </div>
        </div>

        <div className="space-y-8">
          
          {/* STEP 1: Select Game Mode */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-indigo-600" />
              1. Choose Interview Mode
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {modes.map((m) => {
                const Icon = m.icon;
                const isSelected = mode === m.id;

                return (
                  <div
                    key={m.id}
                    onClick={() => setMode(m.id)}
                    className={`cursor-pointer rounded-2xl p-4 border transition-all text-left flex flex-col justify-between ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/40 dark:bg-indigo-950/30 shadow-sm ring-1 ring-indigo-500'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-850'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2.5">
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                            isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                          }`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                              {m.title}
                            </h3>
                            <span className="text-[10px] text-slate-400 block">
                              {m.tagline}
                            </span>
                          </div>
                        </div>

                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                          isSelected ? 'bg-indigo-600 text-white' : m.color
                        }`}>
                          {m.badge}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-normal pt-1">
                        {m.description}
                      </p>
                    </div>

                    <div className="pt-3 flex items-center justify-between text-[10px] font-semibold text-slate-400">
                      <span>{m.id === 'rapid-fire' ? '⚡ 20–25s Timed Prompts' : '🎯 Practice / Untimed'}</span>
                      {isSelected && (
                        <span className="text-indigo-600 dark:text-indigo-400 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Selected
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* STEP 2: Category Area */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-indigo-600" />
              2. Interview Category
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {categories.map((cat) => {
                const isSelected = category === cat.id;
                return (
                  <button
                    type="button"
                    key={cat.id}
                    onClick={() => setCategory(cat.id)}
                    className={`p-2.5 rounded-xl border text-left transition-all truncate text-xs ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-600 text-white font-bold shadow-xs'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 3: Difficulty & Length */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Difficulty */}
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-indigo-600" />
                3. Difficulty Level
              </label>

              <div className="space-y-2">
                {difficulties.map((diff) => {
                  const isSelected = difficulty === diff.id;
                  return (
                    <div
                      key={diff.id}
                      onClick={() => setDifficulty(diff.id)}
                      className={`cursor-pointer p-3 rounded-xl border transition-all flex items-center justify-between ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/40 dark:bg-indigo-950/30 ring-1 ring-indigo-500'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <div>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-lg ${diff.color}`}>
                          {diff.label}
                        </span>
                        <p className="text-[11px] text-slate-500 mt-1">
                          {diff.desc}
                        </p>
                      </div>

                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                        isSelected ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-300 dark:border-slate-700'
                      }`}>
                        {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Session Settings */}
            <div className="space-y-6">
              
              {/* Question Count */}
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-indigo-600" />
                  4. Number of Questions
                </label>

                <div className="grid grid-cols-3 gap-2.5">
                  {([5, 10, 15] as const).map((count) => {
                    const isSelected = questionCount === count;
                    return (
                      <button
                        type="button"
                        key={count}
                        onClick={() => setChallengeCount(count)}
                        className={`py-2.5 px-3 rounded-xl border text-center transition-all ${
                          isSelected
                            ? 'border-indigo-600 bg-indigo-600 text-white font-bold shadow-xs'
                            : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold'
                        }`}
                      >
                        <span className="text-xs block">{count} Questions</span>
                        <span className={`text-[10px] block opacity-80 ${isSelected ? 'text-white' : 'text-slate-400'}`}>
                          ~{count * 2} mins
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Toggles */}
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-indigo-600" />
                  5. Session Options
                </label>

                <div className="grid grid-cols-2 gap-3">
                  <div
                    onClick={() => setIsTimed(!isTimed)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                      isTimed || mode === 'rapid-fire'
                        ? 'border-indigo-600 bg-indigo-50/40 dark:bg-indigo-950/30'
                        : 'border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    <div>
                      <span className="text-xs font-bold block text-slate-800 dark:text-slate-200">Timer Mode</span>
                      <span className="text-[10px] text-slate-400">Countdown pressure</span>
                    </div>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      isTimed || mode === 'rapid-fire' ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-300 dark:border-slate-700'
                    }`}>
                      {(isTimed || mode === 'rapid-fire') && <Check className="w-3 h-3" />}
                    </div>
                  </div>

                  <div
                    onClick={() => setHintsEnabled(!hintsEnabled)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                      hintsEnabled
                        ? 'border-indigo-600 bg-indigo-50/40 dark:bg-indigo-950/30'
                        : 'border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    <div>
                      <span className="text-xs font-bold block text-slate-800 dark:text-slate-200">Hints Active</span>
                      <span className="text-[10px] text-slate-400">Framework guidance</span>
                    </div>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      hintsEnabled ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-300 dark:border-slate-700'
                    }`}>
                      {hintsEnabled && <Check className="w-3 h-3" />}
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* Action Footer */}
          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-500">
              <span className="font-bold text-slate-700 dark:text-slate-300">Targeting:</span> {difficulty} • {category} ({questionCount} questions)
            </div>

            <div className="flex items-center space-x-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={onBackToArena}
                className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleStart}
                className="flex-1 sm:flex-none px-7 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-bold shadow-md shadow-indigo-500/25 transition-all flex items-center justify-center space-x-2 cursor-pointer"
              >
                <span>Enter Interview Room</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
