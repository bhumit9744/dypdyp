import React from 'react';
import {
  Award,
  CheckCircle2,
  Clock,
  BarChart2,
  ShieldCheck,
  Play,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { mockAssessments } from '../../mock/data';

export const AssessmentsSubSection: React.FC = () => {
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Banner */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-brand-600" />
            Standardized Proctored Assessments
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Scores and percentiles verified directly by the campus placement committee and shared with partnering recruiters.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/40 text-xs font-semibold flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-purple-500" />
            <span>Diamond Tier Ranking</span>
          </span>
        </div>
      </div>

      {/* Tests Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mockAssessments.map((test) => (
          <div
            key={test.id}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-4 hover:border-brand-500/40 transition-colors"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-sm text-slate-900 dark:text-white">
                    {test.title}
                  </h3>
                  <span className="text-xs text-slate-500">{test.category}</span>
                </div>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                    test.status === 'Completed'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300'
                  }`}
                >
                  {test.status}
                </span>
              </div>

              {test.status === 'Completed' ? (
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800/80 grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500 text-[11px]">Score Earned</span>
                    <p className="text-base font-bold text-slate-900 dark:text-white">{test.score}%</p>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[11px]">National Percentile</span>
                    <p className="text-base font-bold text-emerald-600 dark:text-emerald-400">
                      {test.percentile}th %ile
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800/80 text-xs space-y-1">
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Duration: {test.durationMinutes} Minutes • {test.totalQuestions} Questions</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Difficulty: <span className="font-semibold text-amber-500">{test.difficulty}</span>
                  </p>
                </div>
              )}

              {test.badge && (
                <div className="flex items-center space-x-1.5 text-xs text-purple-700 dark:text-purple-300 font-medium">
                  <Award className="w-3.5 h-3.5 text-purple-500" />
                  <span>Badge Awarded: {test.badge}</span>
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              {test.status === 'Completed' ? (
                <span className="text-[11px] text-slate-400">
                  Completed on {test.completedDate}
                </span>
              ) : (
                <button
                  onClick={() => alert(`Starting proctored session for: ${test.title}`)}
                  className="w-full py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  Take Assessment
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
