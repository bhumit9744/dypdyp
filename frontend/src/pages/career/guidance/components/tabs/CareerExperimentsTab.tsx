import React, { useState } from 'react';
import { useGuidance } from '../../context/GuidanceContext';
import { CareerExperimentItem } from '../../types/guidance';
import {
  FlaskConical,
  Clock,
  CheckCircle2,
  ExternalLink,
  ArrowRight,
  BookOpen,
  Sparkles,
  HelpCircle,
  Play
} from 'lucide-react';

export const CareerExperimentsTab: React.FC = () => {
  const { experiments, setSelectedExperimentForModal } = useGuidance();

  const [categoryFilter, setCategoryFilter] = useState<string>('All');

  const CATEGORIES = [
    'All',
    'Software Development',
    'UI/UX Design',
    'AI/ML and Data',
    'Cybersecurity',
    'Cloud and DevOps'
  ];

  const filteredExperiments = experiments.filter(e => {
    if (categoryFilter === 'All') return true;
    return e.career_category === categoryFilter;
  });

  const completedCount = experiments.filter(e => e.student_progress?.status === 'Completed').length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-400 text-xs font-semibold mb-2">
            <FlaskConical className="w-3.5 h-3.5" />
            <span>Try Before You Choose • Practical Micro-Labs</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Practical Career Micro-Experiments
          </h2>
          <p className="text-xs text-slate-500 max-w-xl mt-1">
            Many students pick career tracks based on hype or assumptions. Complete a 45-minute beginner-friendly task to see if you genuinely enjoy the day-to-day work before committing months of study.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-center">
          <div className="px-4 py-2 rounded-2xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300">
            {completedCount} of {experiments.length} Labs Completed
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-1.5">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`text-xs px-3 py-1.5 rounded-xl font-semibold transition-all ${
              categoryFilter === cat
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Experiments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredExperiments.map(exp => {
          const isDone = exp.student_progress?.status === 'Completed';

          return (
            <div
              key={exp.id}
              className={`p-6 rounded-3xl bg-white dark:bg-slate-900 border transition-all flex flex-col justify-between space-y-4 shadow-sm hover:shadow-md ${
                isDone
                  ? 'border-emerald-300 dark:border-emerald-800/80 bg-emerald-50/10'
                  : 'border-slate-200 dark:border-slate-800 hover:border-purple-300 dark:hover:border-purple-700'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                    {exp.career_category}
                  </span>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-500 flex items-center gap-1 font-semibold">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{exp.expected_duration}</span>
                    </span>
                    {isDone && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Completed
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {exp.title}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {exp.learning_objective}
                </p>

                {/* Free Tools Needed */}
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850/60 border border-slate-200/60 dark:border-slate-800 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                    Zero-Cost Tools Required:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {exp.required_tools.map(tool => (
                      <span
                        key={tool}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Deliverable preview */}
                <div className="text-xs text-slate-500 space-y-0.5">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                    Expected Deliverable:
                  </span>
                  <p className="text-slate-700 dark:text-slate-300">
                    {exp.expected_deliverable}
                  </p>
                </div>

                {/* Completed Reflection Snippet */}
                {isDone && exp.student_progress?.reflection_enjoyed && (
                  <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-200 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-400 tracking-wider block">
                      Your Saved Reflection:
                    </span>
                    <p className="line-clamp-2 italic">
                      "{exp.student_progress.reflection_enjoyed}"
                    </p>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => setSelectedExperimentForModal(exp)}
                  className={`w-full py-2.5 rounded-2xl font-semibold text-xs transition-all shadow-sm flex items-center justify-center gap-1.5 active:scale-95 ${
                    isDone
                      ? 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200'
                      : 'bg-purple-600 hover:bg-purple-700 text-white'
                  }`}
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>{isDone ? 'Review Instructions & Reflection' : 'Start Micro-Experiment Lab'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
