import React from 'react';
import {
  Trophy,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Clock,
  Zap,
  ArrowRight,
  RotateCcw,
  BookOpen,
  ArrowLeft,
  Target,
  Sparkles,
  BarChart3,
  Award
} from 'lucide-react';
import { QuizResultData } from '../types/quiz';

interface QuizResultsProps {
  result: QuizResultData;
  onReviewAnswers: () => void;
  onRetryQuiz: () => void;
  onNewQuiz: () => void;
  onBackToArena: () => void;
}

export const QuizResults: React.FC<QuizResultsProps> = ({
  result,
  onReviewAnswers,
  onRetryQuiz,
  onNewQuiz,
  onBackToArena
}) => {
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}m ${s < 10 ? '0' : ''}${s}s`;
  };

  const isHighScorer = result.accuracy >= 75;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToArena}
          className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Tech Arena</span>
        </button>

        <span className="text-[11px] font-semibold text-slate-400">
          Session ID: {result.id.slice(0, 15)}...
        </span>
      </div>

      {/* Main Score Hero Card */}
      <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 text-center md:text-left">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300 border border-brand-200/80 text-xs font-bold">
              <Trophy className="w-3.5 h-3.5 text-brand-600" />
              <span>Assessment Completed • {result.config.mode} Mode</span>
            </div>

            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {isHighScorer ? 'Placement Ready Effort!' : 'Technical Challenge Complete'}
            </h1>

            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-lg leading-relaxed">
              {result.performanceSummary}
            </p>
          </div>

          {/* Big Score & XP Callout */}
          <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-850 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shrink-0">
            <div className="text-center px-3">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-0.5">
                Total Score
              </span>
              <div className="text-3xl font-black text-slate-900 dark:text-white">
                {result.score}
                <span className="text-xs font-semibold text-slate-400">/{result.maxScore}</span>
              </div>
            </div>

            <div className="h-10 w-px bg-slate-200 dark:bg-slate-700" />

            <div className="text-center px-3">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-0.5">
                XP Earned
              </span>
              <div className="text-3xl font-black text-brand-600 dark:text-brand-400 flex items-center justify-center gap-1">
                <Zap className="w-5 h-5 fill-brand-600" />
                <span>+{result.xpEarned}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        
        {/* Accuracy */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs text-center space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Accuracy</span>
          <p className={`text-xl font-black ${
            result.accuracy >= 75
              ? 'text-emerald-600 dark:text-emerald-400'
              : result.accuracy >= 50
              ? 'text-amber-600 dark:text-amber-400'
              : 'text-rose-600 dark:text-rose-400'
          }`}>
            {result.accuracy}%
          </p>
          <span className="text-[10px] text-slate-400">Overall</span>
        </div>

        {/* Correct */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs text-center space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Correct</span>
          <p className="text-xl font-black text-emerald-600 dark:text-emerald-400">
            {result.correctCount}
          </p>
          <span className="text-[10px] text-slate-400">of {result.totalQuestions} Qs</span>
        </div>

        {/* Incorrect */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs text-center space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Incorrect</span>
          <p className="text-xl font-black text-rose-600 dark:text-rose-400">
            {result.incorrectCount}
          </p>
          <span className="text-[10px] text-slate-400">Missed</span>
        </div>

        {/* Unanswered */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs text-center space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Unanswered</span>
          <p className="text-xl font-black text-slate-600 dark:text-slate-300">
            {result.unansweredCount}
          </p>
          <span className="text-[10px] text-slate-400">Skipped</span>
        </div>

        {/* Time Taken */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs text-center space-y-1 col-span-2 sm:col-span-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Time</span>
          <p className="text-xl font-black text-slate-800 dark:text-slate-200">
            {formatTime(result.timeTakenSeconds)}
          </p>
          <span className="text-[10px] text-slate-400">Duration</span>
        </div>

      </div>

      {/* Breakdowns: Topic & Difficulty */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Topic Breakdown */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-brand-600" />
            Topic-Wise Mastery
          </h2>

          <div className="space-y-3">
            {result.topicBreakdown.map((tb) => (
              <div key={tb.topic} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-700 dark:text-slate-300 truncate max-w-[200px]">
                    {tb.topic}
                  </span>
                  <span className="text-slate-500">
                    {tb.correct}/{tb.total} ({tb.accuracy}%)
                  </span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      tb.accuracy >= 75
                        ? 'bg-emerald-500'
                        : tb.accuracy >= 50
                        ? 'bg-amber-500'
                        : 'bg-rose-500'
                    }`}
                    style={{ width: `${tb.accuracy}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Difficulty Breakdown */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Target className="w-4 h-4 text-indigo-600" />
            Difficulty-Wise Breakdown
          </h2>

          <div className="space-y-3">
            {result.difficultyBreakdown.map((db) => (
              <div key={db.difficulty} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-700 dark:text-slate-300">
                    {db.difficulty} Level
                  </span>
                  <span className="text-slate-500">
                    {db.correct}/{db.total} ({db.accuracy}%)
                  </span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      db.difficulty === 'Beginner'
                        ? 'bg-emerald-500'
                        : db.difficulty === 'Intermediate'
                        ? 'bg-amber-500'
                        : 'bg-rose-500'
                    }`}
                    style={{ width: `${db.accuracy}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-850/80 border border-slate-200/60 dark:border-slate-800 text-[11px] text-slate-500 leading-relaxed">
            💡 <strong>Placement Cell Tip:</strong> Tier-1 tech interviews heavily weigh Intermediate & Advanced algorithm and DBMS questions. Review explanations for any missed items.
          </div>
        </div>

      </div>

      {/* Action Footer */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-4">
        
        <div className="flex items-center flex-wrap gap-2">
          {/* Review Answers */}
          <button
            onClick={onReviewAnswers}
            className="px-5 py-2.5 rounded-xl bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300 border border-brand-200 font-bold text-xs hover:bg-brand-100 transition-colors flex items-center space-x-1.5"
          >
            <BookOpen className="w-4 h-4" />
            <span>Review Answers & Explanations</span>
          </button>

          {/* Retry Same Quiz */}
          <button
            onClick={onRetryQuiz}
            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center space-x-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Retry Same Quiz</span>
          </button>
        </div>

        <div className="flex items-center space-x-2">
          {/* Start New Challenge */}
          <button
            onClick={onNewQuiz}
            className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-xs transition-colors flex items-center space-x-1.5"
          >
            <span>Start New Challenge</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
};
