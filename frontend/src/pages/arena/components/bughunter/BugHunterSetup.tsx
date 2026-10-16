import React, { useState } from 'react';
import {
  Bug,
  Code2,
  Terminal,
  Zap,
  Target,
  Clock,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  ShieldAlert,
  Search,
  Wrench,
  CheckCircle2,
  Cpu
} from 'lucide-react';
import {
  BugHunterConfig,
  BugDifficulty,
  BugLanguage,
  BugCategory,
  BugGameMode
} from '../../types/bugHunter';

interface BugHunterSetupProps {
  onStartGame: (config: BugHunterConfig) => void;
  onBackToArena: () => void;
  initialMode?: BugGameMode;
}

export const BugHunterSetup: React.FC<BugHunterSetupProps> = ({
  onStartGame,
  onBackToArena,
  initialMode = 'find-bug'
}) => {
  const [mode, setMode] = useState<BugGameMode>(initialMode);
  const [language, setLanguage] = useState<BugLanguage>('Python');
  const [difficulty, setDifficulty] = useState<BugDifficulty>('Beginner');
  const [category, setCategory] = useState<BugCategory>('Mixed');
  const [challengeCount, setChallengeCount] = useState<5 | 10 | 15>(5);

  const modes: {
    id: BugGameMode;
    title: string;
    tagline: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    badge: string;
  }[] = [
    {
      id: 'find-bug',
      title: 'Find the Bug',
      tagline: 'Locate faulty lines & diagnose the root cause',
      description: 'Inspect the code snippet, click the exact broken line, identify the bug category, and select the correct diagnosis.',
      icon: Search,
      badge: 'Interactive Inspection'
    },
    {
      id: 'fix-code',
      title: 'Fix the Code',
      tagline: 'Inspect broken code & apply the optimal repair',
      description: 'Analyze faulty logic, examine replacement patch options, verify against test cases, and restore correct program behavior.',
      icon: Wrench,
      badge: 'Code Repair'
    },
    {
      id: 'test-detective',
      title: 'Test Case Detective',
      tagline: 'Design & pick inputs that break faulty code',
      description: 'Evaluate edge cases, boundary inputs, empty collections, and extreme values to expose hidden algorithmic flaws.',
      icon: Target,
      badge: 'Edge Case Mastery'
    },
    {
      id: 'sprint',
      title: 'Debugging Sprint',
      tagline: 'Rapid-fire debugging under ticking clock pressure',
      description: 'Tackle a sequence of real interview debugging problems with a live countdown timer. Fast fixes earn speed bonuses.',
      icon: Zap,
      badge: 'Timed Challenge'
    }
  ];

  const languages: { id: BugLanguage; label: string; icon: string; count: string }[] = [
    { id: 'Python', label: 'Python', icon: '🐍', count: '10+ challenges' },
    { id: 'Java', label: 'Java', icon: '☕', count: '8+ challenges' },
    { id: 'C++', label: 'C++', icon: '⚡', count: '7+ challenges' },
    { id: 'JavaScript', label: 'JavaScript', icon: '💛', count: '7+ challenges' },
    { id: 'Mixed', label: 'Mixed Languages', icon: '🌐', count: 'All 32 challenges' }
  ];

  const difficulties: { id: BugDifficulty; label: string; desc: string; color: string }[] = [
    { id: 'Beginner', label: 'Beginner', desc: 'Off-by-one, type errors, basic syntax & comparison bugs', color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60' },
    { id: 'Intermediate', label: 'Intermediate', desc: 'Scope traps, iterator invalidation, heap order & async closures', color: 'text-blue-600 bg-blue-50 dark:bg-blue-950/60' },
    { id: 'Advanced', label: 'Advanced', desc: 'Concurrency, memory safety, dynamic programming & intervals', color: 'text-purple-600 bg-purple-50 dark:bg-purple-950/60' },
    { id: 'Mixed', label: 'Mixed Difficulty', desc: 'Adaptive progression across beginner to senior traps', color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/60' }
  ];

  const categories: { id: BugCategory; label: string }[] = [
    { id: 'Mixed', label: 'All Categories' },
    { id: 'Logic', label: 'Logical Errors' },
    { id: 'Runtime', label: 'Runtime & Memory' },
    { id: 'Edge Cases', label: 'Edge Cases' },
    { id: 'Algorithms', label: 'Algorithm Pitfalls' },
    { id: 'Syntax', label: 'Syntax & Types' }
  ];

  const handleStart = () => {
    onStartGame({
      mode,
      language,
      difficulty,
      category,
      challengeCount
    });
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
          <Bug className="w-3.5 h-3.5 text-amber-500" />
          Bug Hunter • Placement Edition
        </span>
      </div>

      {/* Main Setup Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-none p-6 sm:p-8 space-y-8">
        
        {/* Banner */}
        <div className="border-b border-slate-100 dark:border-slate-800 pb-6 space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200/60 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Developer Debugging Simulator
            </span>
            <span className="text-xs font-bold text-slate-400">
              32+ Placement Challenges
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Bug Hunter Setup
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
            Configure your debugging session. Inspect faulty real-world code, isolate bugs, fix logic defects, and run verified test cases to prove your analytical thinking.
          </p>
        </div>

        <div className="space-y-8">
          
          {/* STEP 1: Select Game Mode */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-brand-600" />
              1. Choose Game Mode
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
                        ? 'border-brand-600 bg-brand-50/50 dark:bg-brand-950/40 shadow-sm ring-1 ring-brand-500'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-850'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2.5">
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                            isSelected ? 'bg-brand-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
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
                          isSelected ? 'bg-brand-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                        }`}>
                          {m.badge}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-normal pt-1">
                        {m.description}
                      </p>
                    </div>

                    <div className="pt-3 flex items-center justify-between text-[10px] font-semibold text-slate-400">
                      <span>{m.id === 'sprint' ? '⚡ 75s Timed Sprint' : '🎯 Untimed / Focused Practice'}</span>
                      {isSelected && (
                        <span className="text-brand-600 dark:text-brand-400 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Selected
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* STEP 2: Programming Language */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Code2 className="w-3.5 h-3.5 text-brand-600" />
              2. Programming Language
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {languages.map((lang) => {
                const isSelected = language === lang.id;
                return (
                  <button
                    type="button"
                    key={lang.id}
                    onClick={() => setLanguage(lang.id)}
                    className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1 ${
                      isSelected
                        ? 'border-brand-600 bg-brand-50 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300 ring-1 ring-brand-500 shadow-xs'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span className="text-lg">{lang.icon}</span>
                    <span className="text-xs font-bold">{lang.label}</span>
                    <span className="text-[9px] text-slate-400">{lang.count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 3: Difficulty & Bug Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Difficulty */}
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-brand-600" />
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
                          ? 'border-brand-600 bg-brand-50/40 dark:bg-brand-950/30 ring-1 ring-brand-500'
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
                        isSelected ? 'border-brand-600 bg-brand-600 text-white' : 'border-slate-300 dark:border-slate-700'
                      }`}>
                        {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Category & Length */}
            <div className="space-y-6">
              
              {/* Category */}
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-brand-600" />
                  4. Bug Category
                </label>

                <div className="grid grid-cols-2 gap-2">
                  {categories.map((cat) => {
                    const isSelected = category === cat.id;
                    return (
                      <button
                        type="button"
                        key={cat.id}
                        onClick={() => setCategory(cat.id)}
                        className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all text-left truncate ${
                          isSelected
                            ? 'border-brand-600 bg-brand-600 text-white'
                            : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {cat.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Challenge Length */}
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-brand-600" />
                  5. Session Length
                </label>

                <div className="grid grid-cols-3 gap-2.5">
                  {([5, 10, 15] as const).map((count) => {
                    const isSelected = challengeCount === count;
                    return (
                      <button
                        type="button"
                        key={count}
                        onClick={() => setChallengeCount(count)}
                        className={`py-2.5 px-3 rounded-xl border text-center transition-all ${
                          isSelected
                            ? 'border-brand-600 bg-brand-600 text-white font-bold shadow-xs'
                            : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold'
                        }`}
                      >
                        <span className="text-xs block">{count} Challenges</span>
                        <span className={`text-[10px] block opacity-80 ${isSelected ? 'text-white' : 'text-slate-400'}`}>
                          ~{count * 2} mins
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>

          </div>

          {/* Action Footer */}
          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-500">
              <span className="font-bold text-slate-700 dark:text-slate-300">Targeting:</span> {difficulty} • {language} • {category} ({challengeCount} challenges)
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
                className="flex-1 sm:flex-none px-7 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-brand-600 hover:from-amber-600 hover:to-brand-700 text-white text-xs font-bold shadow-md shadow-brand-500/25 transition-all flex items-center justify-center space-x-2 cursor-pointer"
              >
                <span>Start Bug Hunter</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
