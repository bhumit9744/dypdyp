import React from 'react';
import {
  Trophy,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Clock,
  Zap,
  Sparkles,
  Layers,
  Award,
  BarChart3,
  ChevronRight
} from 'lucide-react';
import { AlgorithmRushResultData } from '../../types/algorithmRush';
import { loadUserAlgoStats } from '../../utils/algorithmRushStorage';

interface AlgorithmRushResultsProps {
  result: AlgorithmRushResultData;
  onReviewAnswers: () => void;
  onRetrySession: () => void;
  onNewSession: () => void;
  onBackToArena: () => void;
}

export const AlgorithmRushResults: React.FC<AlgorithmRushResultsProps> = ({
  result,
  onReviewAnswers,
  onRetrySession,
  onNewSession,
  onBackToArena
}) => {
  const stats = loadUserAlgoStats();

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    if (mins === 0) return `${secs}s`;
    return `${mins}m ${secs}s`;
  };

  const isPerfectScore = result.accuracy === 100;
  const isGoodScore = result.accuracy >= 70;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
      
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToArena}
          className="flex items-center space-x-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Games Hub</span>
        </button>

        <span className="text-xs font-semibold text-slate-400">
          Algorithm Rush • Session Complete
        </span>
      </div>

      {/* Main Results Hero Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-none p-6 sm:p-8 space-y-8">
        
        {/* Banner Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-slate-100 dark:border-slate-800 pb-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border flex items-center gap-1 ${
                isPerfectScore
                  ? 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border-amber-200'
                  : isGoodScore
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200'
                  : 'bg-cyan-50 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300 border-cyan-200'
              }`}>
                <Trophy className="w-3 h-3" />
                {isPerfectScore ? 'Flawless Algorithmic Mastery' : isGoodScore ? 'Strong Placement Readiness' : 'Concept Practice Completed'}
              </span>

              <span className="text-xs font-bold text-slate-400">
                Mode: {result.config.mode}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Session Results
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-lg leading-relaxed">
              {isPerfectScore
                ? 'Outstanding! You correctly identified optimal DSA solutions and complexity bounds across all challenges.'
                : isGoodScore
                ? 'Great problem solving! Review the missed concepts below to refine your edge-case and asymptotic analysis.'
                : 'Keep practicing! Review the detailed explanations and optimal patterns below to build intuition.'}
            </p>
          </div>

          {/* XP & Score Dial */}
          <div className="flex items-center space-x-4 bg-slate-50 dark:bg-slate-850 p-4 rounded-3xl border border-slate-200/80 dark:border-slate-800 shrink-0">
            <div className="text-center px-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Score</span>
              <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                {result.score}<span className="text-sm font-semibold text-slate-400">/{result.maxScore}</span>
              </span>
            </div>

            <div className="h-10 w-px bg-slate-200 dark:bg-slate-700" />

            <div className="text-center px-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Arena XP</span>
              <span className="text-2xl sm:text-3xl font-black text-cyan-600 dark:text-cyan-400 flex items-center justify-center gap-1">
                <Zap className="w-5 h-5 fill-cyan-400 text-cyan-500" />
                +{result.xpEarned}
              </span>
            </div>
          </div>
        </div>

        {/* 4-KPI Metric Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-bold uppercase">Accuracy</span>
              <BarChart3 className="w-3.5 h-3.5" />
            </div>
            <span className={`text-xl font-black ${
              isGoodScore ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'
            }`}>
              {result.accuracy}%
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-bold uppercase">Solved / Total</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            </div>
            <span className="text-xl font-black text-slate-900 dark:text-white">
              {result.correctCount} / {result.totalChallenges}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-bold uppercase">Time Elapsed</span>
              <Clock className="w-3.5 h-3.5 text-cyan-500" />
            </div>
            <span className="text-xl font-black text-slate-900 dark:text-white">
              {formatTime(result.timeTakenSeconds)}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-bold uppercase">Best Record</span>
              <Award className="w-3.5 h-3.5 text-amber-500" />
            </div>
            <span className="text-xl font-black text-amber-600 dark:text-amber-400">
              {stats.bestScore} pts
            </span>
          </div>
        </div>

        {/* Breakdowns: Topic & Difficulty */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Topic Performance */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-cyan-600" />
              Performance by Topic
            </h3>

            <div className="space-y-2">
              {result.topicBreakdown.map((tb) => {
                const pct = Math.round((tb.correct / tb.total) * 100);
                return (
                  <div key={tb.topic} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-slate-700 dark:text-slate-300">{tb.topic}</span>
                      <span className="text-slate-400">{tb.correct}/{tb.total} ({pct}%)</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-cyan-600 rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Difficulty Performance */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-indigo-600" />
              Performance by Difficulty
            </h3>

            <div className="space-y-2">
              {result.difficultyBreakdown.map((db) => {
                const pct = Math.round((db.correct / db.total) * 100);
                return (
                  <div key={db.difficulty} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-slate-700 dark:text-slate-300">{db.difficulty}</span>
                      <span className="text-slate-400">{db.correct}/{db.total} ({pct}%)</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-600 rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Action Controls Footer */}
        <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={onReviewAnswers}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl border border-cyan-300 dark:border-cyan-800 bg-cyan-50 dark:bg-cyan-950/60 text-cyan-800 dark:text-cyan-200 font-bold text-xs hover:bg-cyan-100 transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
          >
            <span>Review Full Solutions</span>
            <ChevronRight className="w-4 h-4" />
          </button>

          <div className="flex items-center space-x-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={onRetrySession}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retry Set</span>
            </button>

            <button
              type="button"
              onClick={onNewSession}
              className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-cyan-500/20 transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              <span>New Challenge</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
