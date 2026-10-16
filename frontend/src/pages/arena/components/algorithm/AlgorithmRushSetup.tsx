import React, { useState } from 'react';
import {
  Zap,
  Clock,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Code2,
  Cpu,
  Layers,
  Activity,
  Compass,
  Flame,
  Award,
  Terminal,
  BarChart2
} from 'lucide-react';
import {
  AlgorithmRushConfig,
  AlgorithmDifficulty,
  AlgorithmTopic,
  AlgorithmGameMode,
  AlgorithmLanguage
} from '../../types/algorithmRush';

interface AlgorithmRushSetupProps {
  onStartGame: (config: AlgorithmRushConfig) => void;
  onBackToArena: () => void;
  initialMode?: AlgorithmGameMode;
}

export const AlgorithmRushSetup: React.FC<AlgorithmRushSetupProps> = ({
  onStartGame,
  onBackToArena,
  initialMode = 'quick-solve'
}) => {
  const [mode, setMode] = useState<AlgorithmGameMode>(initialMode);
  const [topic, setTopic] = useState<AlgorithmTopic>('Mixed DSA');
  const [difficulty, setDifficulty] = useState<AlgorithmDifficulty>('Mixed');
  const [challengeCount, setChallengeCount] = useState<5 | 10 | 15>(5);
  const [language, setLanguage] = useState<AlgorithmLanguage>('Language-Independent');

  const modes: {
    id: AlgorithmGameMode;
    title: string;
    tagline: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    badge: string;
    badgeColor: string;
  }[] = [
    {
      id: 'quick-solve',
      title: 'Quick Solve',
      tagline: 'Rapid-fire algorithmic problem solving',
      description: 'Analyze concise interview problems, examine candidate approach implementations, and select the optimal strategy under time pressure.',
      icon: Zap,
      badge: 'Speed & Logic',
      badgeColor: 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
    },
    {
      id: 'complexity-clash',
      title: 'Complexity Clash',
      tagline: 'Asymptotic time & space mastery',
      description: 'Inspect algorithms, loops, and recursions. Identify Big-O time and auxiliary space bounds, best/worst cases, and optimal alternatives.',
      icon: Activity,
      badge: 'Big-O Analysis',
      badgeColor: 'bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300'
    },
    {
      id: 'pattern-match',
      title: 'Pattern Match',
      tagline: 'Recognize the winning DSA blueprint',
      description: 'Two Pointers, Sliding Window, Monotonic Stack, BFS/DFS, or DP? Diagnose the fundamental pattern that cracks the problem in O(N).',
      icon: Compass,
      badge: 'Pattern Recognition',
      badgeColor: 'bg-cyan-50 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300'
    },
    {
      id: 'rush-ladder',
      title: 'Rush Ladder',
      tagline: 'Climb from Beginner to Advanced algorithms',
      description: 'Face a stepped ladder of escalating difficulty. Start with fundamentals, progress through intermediate traps, and conquer senior DSA questions.',
      icon: Flame,
      badge: 'Stepped Challenge',
      badgeColor: 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
    }
  ];

  const topics: { id: AlgorithmTopic; label: string; icon: string }[] = [
    { id: 'Mixed DSA', label: 'All Topics (Mixed)', icon: '🌐' },
    { id: 'Arrays & Strings', label: 'Arrays & Strings', icon: '🧵' },
    { id: 'Searching & Sorting', label: 'Searching & Sorting', icon: '🔍' },
    { id: 'Hashing', label: 'Hashing & Sets', icon: '🗝️' },
    { id: 'Linked Lists', label: 'Linked Lists', icon: '🔗' },
    { id: 'Stacks & Queues', label: 'Stacks & Queues', icon: '🥞' },
    { id: 'Trees & Graphs', label: 'Trees & Graphs', icon: '🌲' },
    { id: 'Recursion & Backtracking', label: 'Recursion & Backtracking', icon: '🔄' },
    { id: 'Greedy Algorithms', label: 'Greedy Algorithms', icon: '⚡' },
    { id: 'Dynamic Programming', label: 'Dynamic Programming', icon: '📊' }
  ];

  const difficulties: { id: AlgorithmDifficulty; label: string; desc: string; color: string }[] = [
    { id: 'Beginner', label: 'Beginner (10 pts)', desc: 'Fundamental operations, single-pass loops, basic maps & base cases', color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60' },
    { id: 'Intermediate', label: 'Intermediate (20 pts)', desc: 'Two pointers, sliding window, binary search pivots & monotonic stacks', color: 'text-blue-600 bg-blue-50 dark:bg-blue-950/60' },
    { id: 'Advanced', label: 'Advanced (30 pts)', desc: 'Multi-dimensional DP, graph back-edges, LIS patience sorting & water trapping', color: 'text-purple-600 bg-purple-50 dark:bg-purple-950/60' },
    { id: 'Mixed', label: 'Mixed Difficulty', desc: 'Balanced distribution spanning easy warmups to tough interview questions', color: 'text-cyan-600 bg-cyan-50 dark:bg-cyan-950/60' }
  ];

  const languages: { id: AlgorithmLanguage; label: string; desc: string }[] = [
    { id: 'Language-Independent', label: 'General / Concept', desc: 'Focus on pure logic & Big-O' },
    { id: 'Python', label: 'Python 3', desc: 'Idiomatic list comprehensions & dicts' },
    { id: 'Java', label: 'Java', desc: 'Strict types & standard Collections' },
    { id: 'C++', label: 'C++ STL', desc: 'Vectors, pointers & standard algorithms' },
    { id: 'JavaScript', label: 'JavaScript / TS', desc: 'Modern arrays, objects & maps' }
  ];

  const handleStart = () => {
    onStartGame({
      mode,
      topic,
      difficulty,
      challengeCount,
      language
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
          <Zap className="w-3.5 h-3.5 text-cyan-500" />
          Algorithm Rush • Placement Edition
        </span>
      </div>

      {/* Main Setup Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-none p-6 sm:p-8 space-y-8">
        
        {/* Banner */}
        <div className="border-b border-slate-100 dark:border-slate-800 pb-6 space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-50 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300 border border-cyan-200/60 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              DSA Interview Simulator
            </span>
            <span className="text-xs font-bold text-slate-400">
              42+ Placement Challenges
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Algorithm Rush Setup
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
            Train under placement coding pressure. Select optimal problem-solving approaches, master asymptotic Big-O complexity, and recognize DSA patterns.
          </p>
        </div>

        <div className="space-y-8">
          
          {/* STEP 1: Select Game Mode */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-cyan-600" />
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
                        ? 'border-cyan-600 bg-cyan-50/40 dark:bg-cyan-950/30 shadow-sm ring-1 ring-cyan-500'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-850'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2.5">
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                            isSelected ? 'bg-cyan-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
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
                          isSelected ? 'bg-cyan-600 text-white' : m.badgeColor
                        }`}>
                          {m.badge}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-normal pt-1">
                        {m.description}
                      </p>
                    </div>

                    <div className="pt-3 flex items-center justify-between text-[10px] font-semibold text-slate-400">
                      <span>{m.id === 'rush-ladder' ? '📈 Stepped Progression' : '🎯 Timed Challenge'}</span>
                      {isSelected && (
                        <span className="text-cyan-600 dark:text-cyan-400 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Selected
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* STEP 2: DSA Topic */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-cyan-600" />
              2. DSA Topic Area
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {topics.map((t) => {
                const isSelected = topic === t.id;
                return (
                  <button
                    type="button"
                    key={t.id}
                    onClick={() => setTopic(t.id)}
                    className={`p-2.5 rounded-xl border text-left transition-all flex items-center gap-2 ${
                      isSelected
                        ? 'border-cyan-600 bg-cyan-600 text-white font-bold shadow-xs'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span className="text-sm shrink-0">{t.icon}</span>
                    <span className="text-xs truncate">{t.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 3: Difficulty & Challenge Length */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Difficulty */}
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-cyan-600" />
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
                          ? 'border-cyan-600 bg-cyan-50/40 dark:bg-cyan-950/30 ring-1 ring-cyan-500'
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
                        isSelected ? 'border-cyan-600 bg-cyan-600 text-white' : 'border-slate-300 dark:border-slate-700'
                      }`}>
                        {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Session Length & Language Preference */}
            <div className="space-y-6">
              
              {/* Challenge Length */}
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-cyan-600" />
                  4. Session Length
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
                            ? 'border-cyan-600 bg-cyan-600 text-white font-bold shadow-xs'
                            : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold'
                        }`}
                      >
                        <span className="text-xs block">{count} Challenges</span>
                        <span className={`text-[10px] block opacity-80 ${isSelected ? 'text-white' : 'text-slate-400'}`}>
                          ~{count * 1.5} mins
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Language Preference */}
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Code2 className="w-3.5 h-3.5 text-cyan-600" />
                  5. Code Syntax Preference
                </label>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {languages.map((lang) => {
                    const isSelected = language === lang.id;
                    return (
                      <button
                        type="button"
                        key={lang.id}
                        onClick={() => setLanguage(lang.id)}
                        className={`p-2 rounded-xl text-left border transition-all ${
                          isSelected
                            ? 'border-cyan-600 bg-cyan-50 dark:bg-cyan-950/60 text-cyan-800 dark:text-cyan-200 font-bold ring-1 ring-cyan-500'
                            : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <span className="text-xs block truncate">{lang.label}</span>
                        <span className="text-[9px] text-slate-400 block truncate">{lang.desc}</span>
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
              <span className="font-bold text-slate-700 dark:text-slate-300">Config:</span> {difficulty} • {topic} • {challengeCount} challenges ({language})
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
                className="flex-1 sm:flex-none px-7 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md shadow-cyan-500/25 transition-all flex items-center justify-center space-x-2 cursor-pointer"
              >
                <span>Start Algorithm Rush</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
