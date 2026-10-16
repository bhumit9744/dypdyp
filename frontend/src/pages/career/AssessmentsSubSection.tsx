import React, { useState } from 'react';
import {
  Award,
  CheckCircle2,
  Clock,
  ShieldCheck,
  AlertCircle,
  FileCheck2,
  Calendar,
  BarChart3,
  ExternalLink,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { mockAssessments } from '../../mock/data';

export const AssessmentsSubSection: React.FC = () => {
  const [filter, setFilter] = useState<'All' | 'Completed' | 'Available'>('All');

  const filteredTests = mockAssessments.filter(t => {
    if (filter === 'All') return true;
    return t.status === filter;
  });

  const completedCount = mockAssessments.filter(t => t.status === 'Completed').length;
  const avgScore = Math.round(
    mockAssessments.filter(t => t.score).reduce((acc, t) => acc + (t.score || 0), 0) / (completedCount || 1)
  );

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header Banner */}
      <div className="p-6 md:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300 border border-brand-200/80">
              Proctored Evaluations
            </span>
            <span className="text-xs text-slate-500">Department of Computer Engineering</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Award className="w-6 h-6 text-brand-600" />
            Standardized Proctored Assessments
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Verified cognitive and coding percentiles benchmarked against 14,000+ engineering graduates nationwide. Scores directly populate recruiter shortlists.
          </p>
        </div>

        {/* Quick Stats Pill */}
        <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-850 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shrink-0">
          <div className="text-center px-2">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Avg Score</span>
            <span className="text-xl font-extrabold text-brand-600 dark:text-brand-400">{avgScore}%</span>
          </div>
          <div className="h-8 w-px bg-slate-200 dark:bg-slate-700" />
          <div className="text-center px-2">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Completed</span>
            <span className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">{completedCount} Tests</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2">
        {(['All', 'Completed', 'Available'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              filter === tab
                ? 'bg-brand-600 text-white shadow-xs shadow-brand-500/25'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-brand-300'
            }`}
          >
            {tab} Tests
          </button>
        ))}
      </div>

      {/* Assessment Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTests.map(test => {
          const isCompleted = test.status === 'Completed';

          return (
            <div
              key={test.id}
              className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-brand-300 hover:shadow-md transition-all duration-200 space-y-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {test.category}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      test.difficulty === 'Hard'
                        ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                        : 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                    }`}>
                      {test.difficulty}
                    </span>
                  </div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white leading-snug">
                    {test.title}
                  </h3>
                </div>

                <div className="shrink-0">
                  {isCompleted ? (
                    <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/80">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      Completed
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200/80">
                      <Clock className="w-3.5 h-3.5 text-blue-500" />
                      Available
                    </span>
                  )}
                </div>
              </div>

              {/* Score & Percentile if Completed */}
              {isCompleted && (
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                      Score Attained
                    </span>
                    <span className="text-xl font-extrabold text-slate-900 dark:text-white">
                      {test.score}<span className="text-xs text-slate-500">/100</span>
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                      National Percentile
                    </span>
                    <span className="text-xl font-extrabold text-brand-600 dark:text-brand-400">
                      {test.percentile} %ile
                    </span>
                  </div>
                </div>
              )}

              {/* Test details */}
              <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {test.durationMinutes} mins
                  </span>
                  <span>{test.totalQuestions} questions</span>
                </div>
                {test.badge && (
                  <span className="flex items-center gap-1 font-semibold text-brand-600 dark:text-brand-400 text-[11px]">
                    <Sparkles className="w-3.5 h-3.5" />
                    {test.badge}
                  </span>
                )}
              </div>

              {/* Action Button */}
              <div>
                {isCompleted ? (
                  <button className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-brand-600" />
                    <span>View Proctored Credential & Breakdown</span>
                  </button>
                ) : (
                  <button className="w-full py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-xs transition-colors flex items-center justify-center gap-1.5">
                    <span>Start Practice Assessment</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
