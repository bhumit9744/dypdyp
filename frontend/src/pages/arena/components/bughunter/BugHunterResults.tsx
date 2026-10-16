import React from 'react';
import {
  Trophy,
  Zap,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  ArrowRight,
  RotateCcw,
  BookOpen,
  TrendingUp,
  AlertCircle,
  Code2,
  Bug,
  ShieldCheck,
  Award
} from 'lucide-react';
import { BugHunterResultData } from '../../types/bugHunter';

interface BugHunterResultsProps {
  result: BugHunterResultData;
  onReviewAnswers: () => void;
  onRetrySession: () => void;
  onNewSession: () => void;
  onBackToArena: () => void;
}

export const BugHunterResults: React.FC<BugHunterResultsProps> = ({
  result,
  onReviewAnswers,
  onRetrySession,
  onNewSession,
  onBackToArena
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const isExcellent = result.accuracy >= 80;
  const isGood = result.accuracy >= 60 && result.accuracy < 80;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
      
      {/* HERO SCORE CARD */}
      <div className={`p-6 sm:p-8 rounded-3xl border shadow-xl relative overflow-hidden text-white ${
        isExcellent
          ? 'bg-gradient-to-br from-emerald-600 via-teal-600 to-indigo-700 border-emerald-400/30'
          : isGood
          ? 'bg-gradient-to-br from-brand-600 via-indigo-600 to-purple-700 border-brand-400/30'
          : 'bg-gradient-to-br from-slate-800 via-slate-900 to-indigo-950 border-slate-700'
      }`}>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white backdrop-blur-md text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-300" />
                Bug Hunter Complete
              </span>
              <span className="text-xs text-white/80 font-medium">
                Placement Debugging Evaluation
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {isExcellent ? 'Master Debugger! Exceptional Logic' : isGood ? 'Solid Analytical Performance' : 'Debugging Session Concluded'}
            </h1>

            <p className="text-xs sm:text-sm text-indigo-100/90 leading-relaxed">
              {isExcellent
                ? 'You demonstrated precise code inspection, accurate edge-case detection, and rapid root-cause isolation.'
                : isGood
                ? 'Good grasp of debugging fundamentals. Review the failed test cases to eliminate subtle off-by-one and boundary traps.'
                : 'Debugging under constraints takes practice. Review the detailed explanations to sharpen your diagnostic intuition.'}
            </p>
          </div>

          {/* Quick HUD Metrics */}
          <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 shrink-0">
            <div className="text-center px-2">
              <span className="text-[10px] uppercase font-bold text-white/70 block">Accuracy</span>
              <span className="text-2xl font-black text-white">{result.accuracy}%</span>
            </div>
            <div className="h-8 w-px bg-white/20" />
            <div className="text-center px-2">
              <span className="text-[10px] uppercase font-bold text-white/70 block">Score</span>
              <span className="text-2xl font-black text-amber-300">
                {result.score}/{result.maxScore}
              </span>
            </div>
            <div className="h-8 w-px bg-white/20" />
            <div className="text-center px-2">
              <span className="text-[10px] uppercase font-bold text-white/70 block">XP Gained</span>
              <span className="text-2xl font-black text-emerald-300 flex items-center justify-center gap-0.5">
                <Zap className="w-4 h-4 fill-emerald-300" />
                +{result.xpEarned}
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* METRICS GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-1">
          <div className="flex items-center space-x-1.5 text-xs text-slate-500 font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Correct Solves</span>
          </div>
          <div className="text-xl font-black text-slate-900 dark:text-white">
            {result.correctCount} / {result.totalChallenges}
          </div>
          <span className="text-[10px] text-slate-400">
            {result.incorrectCount} incorrect or timed out
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-1">
          <div className="flex items-center space-x-1.5 text-xs text-slate-500 font-semibold">
            <Clock className="w-4 h-4 text-blue-500" />
            <span>Time Taken</span>
          </div>
          <div className="text-xl font-black text-slate-900 dark:text-white">
            {formatTime(result.timeTakenSeconds)}
          </div>
          <span className="text-[10px] text-slate-400">
            Avg ~{Math.round(result.timeTakenSeconds / Math.max(1, result.totalChallenges))}s per challenge
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-1">
          <div className="flex items-center space-x-1.5 text-xs text-slate-500 font-semibold">
            <Award className="w-4 h-4 text-amber-500" />
            <span>Hints Used</span>
          </div>
          <div className="text-xl font-black text-slate-900 dark:text-white">
            {result.totalHintsUsed}
          </div>
          <span className="text-[10px] text-slate-400">
            -{result.totalPenalty} pts hint penalty
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-1">
          <div className="flex items-center space-x-1.5 text-xs text-slate-500 font-semibold">
            <ShieldCheck className="w-4 h-4 text-brand-500" />
            <span>Skill Level</span>
          </div>
          <div className="text-xl font-black text-slate-900 dark:text-white">
            {isExcellent ? 'Senior Logic' : isGood ? 'Mid-Level' : 'Developing'}
          </div>
          <span className="text-[10px] text-slate-400">
            Based on {result.totalChallenges} diagnostic tests
          </span>
        </div>

      </div>

      {/* PERFORMANCE BREAKDOWN: CATEGORIES & LANGUAGES */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Category Breakdown */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-5 sm:p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-brand-600" />
              Accuracy by Bug Category
            </h3>
            <span className="text-[10px] text-slate-400 font-semibold">
              Performance breakdown
            </span>
          </div>

          <div className="space-y-3">
            {result.categoryBreakdown.map((cb) => (
              <div key={cb.category} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    {cb.category}
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {cb.correct}/{cb.total} ({cb.accuracy}%)
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      cb.accuracy >= 75 ? 'bg-emerald-500' : cb.accuracy >= 50 ? 'bg-amber-500' : 'bg-rose-500'
                    }`}
                    style={{ width: `${cb.accuracy}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Language Breakdown */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-5 sm:p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Code2 className="w-3.5 h-3.5 text-brand-600" />
              Accuracy by Language
            </h3>
            <span className="text-[10px] text-slate-400 font-semibold">
              Syntax & runtime mastery
            </span>
          </div>

          <div className="space-y-3">
            {result.languageBreakdown.map((lb) => (
              <div key={lb.language} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    {lb.language}
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {lb.correct}/{lb.total} ({lb.accuracy}%)
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      lb.accuracy >= 75 ? 'bg-emerald-500' : lb.accuracy >= 50 ? 'bg-amber-500' : 'bg-rose-500'
                    }`}
                    style={{ width: `${lb.accuracy}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* STRENGTHS & GROWTH AREAS */}
      {(result.strongAreas.length > 0 || result.weakAreas.length > 0) && (
        <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {result.strongAreas.length > 0 && (
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> High Proficiency Areas
              </span>
              <p className="text-xs text-slate-700 dark:text-slate-300">
                {result.strongAreas.join(', ')} — Strong mental model of control flow and edge validation.
              </p>
            </div>
          )}

          {result.weakAreas.length > 0 && (
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> Recommended Practice Areas
              </span>
              <p className="text-xs text-slate-700 dark:text-slate-300">
                {result.weakAreas.join(', ')} — Focus on boundary condition proofs and language runtime nuances.
              </p>
            </div>
          )}
        </div>
      )}

      {/* ACTION FOOTER */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        
        <button
          onClick={onReviewAnswers}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-center space-x-2"
        >
          <BookOpen className="w-4 h-4 text-brand-600" />
          <span>Review Detailed Solutions</span>
        </button>

        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <button
            onClick={onRetrySession}
            className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-center space-x-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Retry Set</span>
          </button>

          <button
            onClick={onNewSession}
            className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-md shadow-brand-500/20 transition-all flex items-center justify-center space-x-1.5"
          >
            <span>New Challenge</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onBackToArena}
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            Games Hub
          </button>
        </div>

      </div>

    </div>
  );
};
