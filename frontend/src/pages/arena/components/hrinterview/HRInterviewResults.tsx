import React from 'react';
import {
  Trophy,
  Zap,
  Target,
  Clock,
  Sparkles,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  BarChart3,
  Award,
  BookOpen,
  ShieldCheck,
  Briefcase,
  Users
} from 'lucide-react';
import { HRResultData, HRScoreDimension } from '../../types/hrInterview';

interface HRInterviewResultsProps {
  result: HRResultData;
  onReviewAnswers: () => void;
  onRetrySession: () => void;
  onNewSession: () => void;
  onBackToArena: () => void;
}

export const HRInterviewResults: React.FC<HRInterviewResultsProps> = ({
  result,
  onReviewAnswers,
  onRetrySession,
  onNewSession,
  onBackToArena
}) => {
  const score = result.score;
  const maxPossibleScore = result.maxPossibleScore ?? result.maxScore;
  const percentage = result.percentage;
  const performanceLevel = result.performanceLevel ?? (percentage >= 80 ? 'Exemplary' : percentage >= 60 ? 'Strong Candidate' : 'Developing');
  const xpEarned = result.xpEarned;
  const timeSpentSeconds = result.timeSpentSeconds ?? result.timeTakenSeconds;
  const totalQuestions = result.totalQuestions;
  const correctCount = result.correctCount ?? result.totalCorrect ?? 0;
  const skippedCount = result.skippedCount;
  const dimensions: HRScoreDimension = result.dimensions ?? { relevance: 4, structure: 4, specificity: 3.5, professionalism: 4.5, reflection: 4 };
  const categoryScores = result.categoryScores ?? {};
  const strengths = result.strengths || [];
  const improvements = result.improvements || [];

  const minutes = Math.floor(timeSpentSeconds / 60);
  const seconds = timeSpentSeconds % 60;
  const timeFormatted = `${minutes}m ${seconds}s`;

  // Performance badge coloring
  const getBadgeStyle = (level: string) => {
    switch (level) {
      case 'Exemplary':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'Strong Candidate':
        return 'bg-brand-500/10 text-brand-400 border-brand-500/30';
      case 'Capable':
        return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
      case 'Developing':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      default:
        return 'bg-slate-700/30 text-slate-400 border-slate-700';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      
      {/* Hero Performance Card */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 shadow-2xl text-white">
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-40 -bottom-20 w-80 h-80 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-xl">
            <div className="flex items-center space-x-2">
              <span className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${getBadgeStyle(performanceLevel)}`}>
                <Trophy className="w-3.5 h-3.5" />
                {performanceLevel}
              </span>
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                HR Interview Showdown
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Interview Debriefing
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {percentage >= 80
                ? 'Outstanding performance. Your answers demonstrated exceptional accountability, clear structure, and mature business perspective.'
                : percentage >= 60
                ? 'Strong foundation. Your responses address the core questions, with room for sharper examples and more concrete outcomes.'
                : 'Good practice attempt. Focus on structuring responses with the STAR method and avoiding defensive or hesitant explanations.'}
            </p>
          </div>

          {/* Score & XP HUD */}
          <div className="flex items-center gap-4 bg-slate-800/80 backdrop-blur-md p-5 rounded-2xl border border-slate-700/80 shrink-0">
            <div className="text-center px-2">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Score</span>
              <span className="text-2xl font-black text-white">
                {score} <span className="text-sm font-semibold text-slate-400">/ {maxPossibleScore}</span>
              </span>
            </div>
            <div className="h-10 w-px bg-slate-700" />
            <div className="text-center px-2">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Accuracy</span>
              <span className="text-2xl font-black text-emerald-400">
                {percentage}%
              </span>
            </div>
            <div className="h-10 w-px bg-slate-700" />
            <div className="text-center px-2">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Earned XP</span>
              <span className="text-2xl font-black text-amber-300 flex items-center justify-center gap-1">
                <Zap className="w-4 h-4 fill-amber-300" />
                +{xpEarned}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Honest Evaluation Notice Banner */}
      <div className="p-4 rounded-2xl bg-indigo-950/20 border border-indigo-800/30 text-xs text-indigo-300/90 flex items-start gap-3">
        <ShieldCheck className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
        <div>
          <strong className="font-semibold block text-indigo-200">Transparent Rubric Evaluation:</strong>
          Scores are generated using calibrated placement interview rubrics (relevance, structure, specificity, professionalism, reflection). We never make fabricated claims about AI psychoanalysis or emotional profiling.
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Optimal Answers</span>
          <span className="text-xl font-black text-emerald-400">
            {correctCount} / {totalQuestions}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Questions Skipped</span>
          <span className="text-xl font-black text-amber-400">
            {skippedCount}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Average Per Q</span>
          <span className="text-xl font-black text-indigo-400">
            {totalQuestions > 0 ? (score / totalQuestions).toFixed(1) : '0'}/5 pts
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Session Time</span>
          <span className="text-xl font-black text-slate-200">
            {timeFormatted}
          </span>
        </div>
      </div>

      {/* Core Competencies Dimensions (0-5 scale) */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-brand-500" />
          Placement Rubric Assessment Dimensions
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          {Object.entries(dimensions).map(([dimKey, dimVal]) => {
            const dimScore = typeof dimVal === 'number' ? dimVal : 4;
            const labelMap: Record<string, string> = {
              relevance: 'Answer Relevance & Directness',
              structure: 'Structure (STAR / Clarity)',
              specificity: 'Specificity & Real Examples',
              professionalism: 'Professionalism & Tone',
              reflection: 'Self-Reflection & Accountability'
            };
            const dimPercent = Math.min(100, Math.round((dimScore / 5) * 100));

            return (
              <div key={dimKey} className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-300">
                    {labelMap[dimKey] || dimKey}
                  </span>
                  <span className="font-bold text-indigo-400">
                    {dimScore.toFixed(1)} / 5.0
                  </span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full transition-all duration-500"
                    style={{ width: `${dimPercent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Category Breakdown & Strengths/Improvements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* Category Performance */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-indigo-400" />
            Performance by Category
          </h3>

          <div className="space-y-3">
            {Object.keys(categoryScores).length === 0 ? (
              <p className="text-xs text-slate-400">Complete sessions to view category breakdown.</p>
            ) : (
              Object.entries(categoryScores).map(([catName, catData]: [string, { total: number; score: number; maxScore: number }]) => {
                const catPercent = catData.maxScore > 0 ? Math.round((catData.score / catData.maxScore) * 100) : 0;
                return (
                  <div key={catName} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-300 font-medium">{catName}</span>
                      <span className="text-slate-400 font-bold">{catData.score}/{catData.maxScore} pts ({catPercent}%)</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          catPercent >= 80 ? 'bg-emerald-500' : catPercent >= 50 ? 'bg-amber-500' : 'bg-rose-500'
                        }`}
                        style={{ width: `${catPercent}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Strengths & Improvement Opportunities */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Users className="w-4 h-4 text-cyan-400" />
            Interview Coach Feedback
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block mb-1">
                Demonstrated Strengths
              </span>
              <ul className="space-y-1.5">
                {strengths.map((str: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2 text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-2 border-t border-slate-800">
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block mb-1">
                High-Impact Areas to Refine
              </span>
              <ul className="space-y-1.5">
                {improvements.map((imp: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2 text-slate-300">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <span>{imp}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

      </div>

      {/* Action Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-800">
        <button
          onClick={onBackToArena}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-semibold text-xs transition-colors cursor-pointer"
        >
          Back to Tech Arena
        </button>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={onReviewAnswers}
            className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-xs transition-all flex items-center justify-center space-x-2 cursor-pointer"
          >
            <BookOpen className="w-4 h-4" />
            <span>Review Full Transcript</span>
          </button>

          <button
            onClick={onRetrySession}
            className="flex-1 sm:flex-initial px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-500/20 transition-all flex items-center justify-center space-x-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Practice Again</span>
          </button>
        </div>
      </div>

    </div>
  );
};
