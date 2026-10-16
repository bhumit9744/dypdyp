import React, { useState, useEffect } from 'react';
import {
  Code2,
  Trophy,
  Zap,
  Target,
  Flame,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  BarChart3,
  HelpCircle,
  RotateCcw,
  BookOpen,
  Award,
  Layers,
  Bug,
  Database,
  Network
} from 'lucide-react';
import { QuizConfig, UserQuizStats, QuizResultData } from './types/quiz';
import { loadUserQuizStats, clearQuizHistory } from './utils/quizStorage';
import { DailyChallengeCard } from './components/DailyChallengeCard';

interface TechArenaDashboardProps {
  onLaunchGame: (gameId: 'code-quiz' | 'daily' | 'bug-hunter', config?: QuizConfig) => void;
  onReviewPastResult?: (result: QuizResultData) => void;
}

export const TechArenaDashboard: React.FC<TechArenaDashboardProps> = ({
  onLaunchGame,
  onReviewPastResult
}) => {
  const [stats, setStats] = useState<UserQuizStats>(loadUserQuizStats());

  useEffect(() => {
    setStats(loadUserQuizStats());
  }, []);

  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear your local quiz history? Your stats will reset to zero.')) {
      clearQuizHistory();
      setStats(loadUserQuizStats());
    }
  };

  const calculateLevel = (xp: number) => {
    return Math.floor(xp / 250) + 1;
  };

  const playerLevel = calculateLevel(stats.totalXpEarned);

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      
      {/* Hero Banner with Player Level & XP HUD */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-brand-600 via-indigo-600 to-violet-700 text-white shadow-xl shadow-brand-600/15 relative overflow-hidden border border-brand-400/30">
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-40 -bottom-20 w-80 h-80 bg-violet-400/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white backdrop-blur-md border border-white/30 text-xs font-semibold uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                Gamified Placement Hub
              </span>
              <span className="text-xs text-white/80 font-medium">
                DYPCOE Technical Arena
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white">
              Tech Arena
            </h1>

            <p className="text-xs text-indigo-100 leading-relaxed max-w-xl">
              Sharpen your core engineering fundamentals, algorithms, and system concepts through interactive, placement-focused technical games.
            </p>
          </div>

          {/* Quick HUD Card */}
          <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 shrink-0">
            <div className="text-center px-2">
              <span className="text-[10px] uppercase font-bold text-indigo-200 block">Player Rank</span>
              <span className="text-xl font-black text-white">Level {playerLevel}</span>
            </div>
            <div className="h-8 w-px bg-white/20" />
            <div className="text-center px-2">
              <span className="text-[10px] uppercase font-bold text-indigo-200 block">Arena XP</span>
              <span className="text-xl font-black text-amber-300 flex items-center justify-center gap-0.5">
                <Zap className="w-4 h-4 fill-amber-300" />
                {stats.totalXpEarned}
              </span>
            </div>
            <div className="h-8 w-px bg-white/20" />
            <div className="text-center px-2">
              <span className="text-[10px] uppercase font-bold text-indigo-200 block">Accuracy</span>
              <span className="text-xl font-black text-emerald-300">
                {stats.overallAccuracy}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Challenge Card Integration */}
      <DailyChallengeCard
        onStartDaily={(cfg) => onLaunchGame('daily', cfg)}
      />

      {/* Arena Games Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Trophy className="w-5 h-5 text-brand-600" />
              Interactive Placement Games
            </h2>
            <p className="text-xs text-slate-500">
              Select a challenge to prove your technical competence.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          
          {/* GAME 1: Code Quiz Arena (Featured & Playable) */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 border-brand-500/80 shadow-md shadow-brand-500/5 hover:border-brand-600 transition-all space-y-5 relative overflow-hidden group">
            
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center space-x-3.5">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-brand-500/25 shrink-0 group-hover:scale-105 transition-transform">
                  <Code2 className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300 border border-brand-200/60">
                      Featured • Ready to Play
                    </span>
                    <span className="text-[10px] font-semibold text-slate-400">
                      45+ Placement Qs
                    </span>
                  </div>
                  <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mt-0.5">
                    Code Quiz Arena
                  </h3>
                </div>
              </div>

              <span className="text-xs font-bold px-2.5 py-1 rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 shrink-0">
                Beginner - Advanced
              </span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              <em>Think fast. Code smart. Prove your fundamentals.</em> Rapid-fire software engineer placement questions spanning Programming, OOP, DSA, DBMS, OS, Networks, and Software Engineering.
            </p>

            <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold text-slate-600 dark:text-slate-400">
              <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800">
                ⏱️ Timed & Practice Modes
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800">
                📊 Detailed Answer Explanations
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800">
                ⚡ Earn Up to 300+ XP
              </span>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
              <span className="text-xs font-semibold text-slate-400">
                {stats.totalQuizzesCompleted} sessions completed
              </span>

              <button
                onClick={() => onLaunchGame('code-quiz')}
                className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-md shadow-brand-500/25 transition-all flex items-center space-x-1.5"
              >
                <span>Start Challenge</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>

          {/* GAME 2: Bug Hunter / Code Detective */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all space-y-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center space-x-3.5">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                  <Bug className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border border-amber-200/60">
                      Code Debugging
                    </span>
                    <span className="text-[10px] font-semibold text-slate-400">
                      6 Production Traps
                    </span>
                  </div>
                  <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mt-0.5">
                    Bug Hunter: Code Detective
                  </h3>
                </div>
              </div>

              <span className="text-xs font-bold px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 shrink-0">
                Mid - Senior
              </span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Diagnose real technical interview bugs: stale hook closures, quadratic O(N²) loops, SQL injection vulnerabilities, and memory leaks under ticking clock constraints.
            </p>

            <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold text-slate-600 dark:text-slate-400">
              <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800">
                🔍 Line-by-Line Inspection
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800">
                ⚡ Instant Test Runner
              </span>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
              <span className="text-xs font-semibold text-slate-400">
                Interactive Lab
              </span>

              <button
                onClick={() => onLaunchGame('code-quiz', {
                  topic: 'Programming Fundamentals',
                  difficulty: 'Intermediate',
                  questionCount: 5,
                  mode: 'Timed'
                })}
                className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-800 dark:text-slate-200 font-bold text-xs transition-colors flex items-center space-x-1.5"
              >
                <span>Launch Quick Run</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* GAME 3: SQL Query Master (Upcoming preview) */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 opacity-80">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center space-x-3.5">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center shrink-0">
                  <Database className="w-6 h-6" />
                </div>
                <div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-500">
                    Preview Module
                  </span>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                    SQL & Schema Quest
                  </h3>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">
                Coming Soon
              </span>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Complex joins, window functions, and indexing puzzles with instant schema query execution against simulated candidate databases.
            </p>
          </div>

          {/* GAME 4: System Architecture Duel (Upcoming preview) */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 opacity-80">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center space-x-3.5">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center shrink-0">
                  <Network className="w-6 h-6" />
                </div>
                <div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-500">
                    Preview Module
                  </span>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                    System Architecture Duel
                  </h3>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">
                Coming Soon
              </span>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Design high-throughput distributed systems, configure Redis caching, and eliminate single points of failure under traffic spikes.
            </p>
          </div>

        </div>
      </div>

      {/* Performance Tracking & Recent Attempts */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-brand-600" />
              Your Performance & History
            </h2>
            <p className="text-xs text-slate-500">
              Locally stored progress across your Code Quiz Arena sessions.
            </p>
          </div>

          {stats.recentAttempts.length > 0 && (
            <button
              onClick={handleClearHistory}
              className="text-xs font-semibold text-slate-400 hover:text-rose-600 transition-colors self-start sm:self-auto"
            >
              Clear History
            </button>
          )}
        </div>

        {/* Aggregated KPI Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Quizzes Done</span>
            <span className="text-lg font-black text-slate-900 dark:text-white">
              {stats.totalQuizzesCompleted}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Questions Solved</span>
            <span className="text-lg font-black text-slate-900 dark:text-white">
              {stats.totalCorrect}/{stats.totalQuestionsAttempted}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Best Score</span>
            <span className="text-lg font-black text-brand-600 dark:text-brand-400">
              {stats.bestScore} pts
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Average Accuracy</span>
            <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">
              {stats.overallAccuracy}%
            </span>
          </div>
        </div>

        {/* Recent Attempts Table or Empty State */}
        {stats.recentAttempts.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-slate-50 dark:bg-slate-850/60 border border-slate-200/80 dark:border-slate-800 space-y-2">
            <BookOpen className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">
              No Quiz Attempts Yet
            </h4>
            <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
              Launch your first <strong>Code Quiz Arena</strong> session above. Your score, accuracy, topic breakdowns, and reviewable answers will be tracked here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-850 text-slate-400 uppercase text-[10px] font-bold">
                <tr>
                  <th className="py-2.5 px-3 rounded-l-xl">Date</th>
                  <th className="py-2.5 px-3">Topic</th>
                  <th className="py-2.5 px-3">Difficulty</th>
                  <th className="py-2.5 px-3">Score</th>
                  <th className="py-2.5 px-3">Accuracy</th>
                  <th className="py-2.5 px-3 rounded-r-xl text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {stats.recentAttempts.map((att) => {
                  const d = new Date(att.timestamp);
                  const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

                  return (
                    <tr key={att.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-850/40 transition-colors">
                      <td className="py-3 px-3 text-slate-500 font-medium">
                        {dateStr}
                      </td>
                      <td className="py-3 px-3 font-semibold text-slate-900 dark:text-white">
                        {att.config.topic}
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {att.config.difficulty}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">
                        {att.score}/{att.maxScore}
                      </td>
                      <td className="py-3 px-3 font-bold text-emerald-600 dark:text-emerald-400">
                        {att.accuracy}%
                      </td>
                      <td className="py-3 px-3 text-right">
                        {onReviewPastResult && (
                          <button
                            onClick={() => onReviewPastResult(att)}
                            className="px-3 py-1 rounded-lg bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300 font-bold text-[11px] hover:bg-brand-100 transition-colors"
                          >
                            Review
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <div className="pt-2 text-[11px] text-slate-400 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-brand-600" />
            Performance records are stored locally in your browser.
          </span>
          <span>DYPCOE Campus Placement Benchmark</span>
        </div>

      </div>

    </div>
  );
};
