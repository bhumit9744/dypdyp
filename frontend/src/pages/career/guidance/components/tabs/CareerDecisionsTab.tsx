import React from 'react';
import { useGuidance } from '../../context/GuidanceContext';
import {
  Calendar,
  CheckCircle2,
  Clock,
  Target,
  GitCompare,
  FlaskConical,
  ArrowRight,
  Sparkles,
  FileText,
  RotateCcw
} from 'lucide-react';

export const CareerDecisionsTab: React.FC = () => {
  const {
    decisionHistory,
    primaryGoal,
    alternativeGoals,
    setActiveTab,
    navigateToRoadmapWithRole
  } = useGuidance();

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold mb-2">
            <Clock className="w-3.5 h-3.5" />
            <span>Audit Trail & Evolution</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            My Career Decisions & History
          </h2>
          <p className="text-xs text-slate-500 max-w-xl mt-1">
            Track how your career goals, comparisons, and reflections evolve over your college journey. Changing your target goal never erases your learning history or project milestones.
          </p>
        </div>

        {primaryGoal && (
          <button
            onClick={() => navigateToRoadmapWithRole(primaryGoal.career_id)}
            className="px-4 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-sm flex items-center gap-1.5 self-start sm:self-center"
          >
            <Target className="w-3.5 h-3.5" />
            <span>Active Goal: {primaryGoal.career_title}</span>
          </button>
        )}
      </div>

      {/* Primary & Alternate Goals Summary Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Primary Goal Card */}
        <div className="p-5 rounded-3xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-200/60 dark:border-indigo-900/40 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-600 text-white">
              Current Primary Target
            </span>
            <span className="text-xs text-slate-500">
              {primaryGoal ? new Date(primaryGoal.created_at).toLocaleDateString() : ''}
            </span>
          </div>

          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            {primaryGoal?.career_title || 'None Established'}
          </h3>

          <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
            <span className="font-semibold block">Selection Rationale:</span>
            <ul className="space-y-0.5 pl-4 list-disc text-[11px]">
              {primaryGoal?.selection_reasons?.map((r, i) => (
                <li key={i}>{r}</li>
              )) || <li>No reasons logged</li>}
            </ul>
          </div>
        </div>

        {/* Alternative Goals Card */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
              Alternative Exploratory Tracks ({alternativeGoals.length})
            </span>
          </div>

          {alternativeGoals.length > 0 ? (
            <div className="space-y-2">
              {alternativeGoals.map(alt => (
                <div
                  key={alt.id}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850 flex items-center justify-between text-xs"
                >
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{alt.career_title}</span>
                  <button
                    onClick={() => setActiveTab('skill-gaps')}
                    className="text-xs text-indigo-600 hover:underline"
                  >
                    View Gaps
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic">No alternative goals added yet.</p>
          )}
        </div>
      </div>

      {/* Chronological Decision Timeline */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Calendar className="w-4 h-4 text-indigo-600" />
          <span>Chronological Decision Log</span>
        </h3>

        <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
          {decisionHistory.map((item, idx) => {
            const isGoal = item.decision_type.includes('Goal');
            const isExp = item.decision_type.includes('Experiment');
            const isCmp = item.decision_type.includes('Comparison');

            return (
              <div key={item.id} className="relative space-y-1 text-xs">
                {/* Node icon */}
                <div
                  className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full border-2 border-white dark:border-slate-900 flex items-center justify-center ${
                    isGoal
                      ? 'bg-indigo-600 text-white'
                      : isExp
                      ? 'bg-purple-600 text-white'
                      : 'bg-amber-500 text-white'
                  }`}
                >
                  {isGoal ? (
                    <Target className="w-2.5 h-2.5" />
                  ) : isExp ? (
                    <FlaskConical className="w-2.5 h-2.5" />
                  ) : (
                    <GitCompare className="w-2.5 h-2.5" />
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-white">
                    {item.decision_type}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {new Date(item.timestamp).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
                  </span>
                </div>

                {item.previous_goal && (
                  <span className="text-[11px] text-slate-400 block">
                    Changed from: <span className="line-through">{item.previous_goal}</span> → <strong>{item.new_goal}</strong>
                  </span>
                )}

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-850 p-3 rounded-xl border border-slate-100 dark:border-slate-800/80">
                  {item.explanation}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
