import React, { useState } from 'react';
import { useGuidance } from '../../context/GuidanceContext';
import {
  CheckSquare,
  Square,
  Clock,
  Compass,
  ArrowRight,
  Plus,
  Target,
  Sparkles,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const ActionPlanTab: React.FC = () => {
  const {
    actionItems,
    toggleActionStatus,
    transferActionToRoadmap,
    primaryGoal,
    navigateToRoadmapWithRole
  } = useGuidance();

  const [feedback, setFeedback] = useState<{ id: string; msg: string; isError?: boolean } | null>(null);

  const handleTransfer = async (actionId: string) => {
    const res = await transferActionToRoadmap(actionId);
    setFeedback({ id: actionId, msg: res.message, isError: !res.success });
    setTimeout(() => setFeedback(null), 3500);
  };

  const completedCount = actionItems.filter(a => a.status === 'Completed').length;
  const progressPercent = actionItems.length > 0 ? Math.round((completedCount / actionItems.length) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 text-xs font-semibold mb-2">
            <CheckSquare className="w-3.5 h-3.5" />
            <span>Targeted Execution Milestones</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Personalized Career Action Plan
          </h2>
          <p className="text-xs text-slate-500 max-w-xl mt-1">
            Conclude your career counselling with concrete milestones. Check off completed items or transfer them directly into your AI Career Roadmap Planner.
          </p>
        </div>

        {primaryGoal && (
          <button
            onClick={() => navigateToRoadmapWithRole(primaryGoal.career_id)}
            className="px-4 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md flex items-center gap-1.5 self-start sm:self-center transition-all"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Open in Roadmap Planner</span>
          </button>
        )}
      </div>

      {/* Progress Card */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
          <span>Action Plan Completion: {completedCount} of {actionItems.length} Milestones</span>
          <span className="text-indigo-600 dark:text-indigo-400">{progressPercent}%</span>
        </div>

        <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
          <div
            className="bg-indigo-600 h-full rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Action Items List */}
      <div className="space-y-4">
        {actionItems.map(item => {
          const isDone = item.status === 'Completed';

          return (
            <div
              key={item.id}
              className={`p-6 rounded-3xl bg-white dark:bg-slate-900 border transition-all flex flex-col justify-between space-y-4 shadow-sm hover:shadow-md ${
                isDone
                  ? 'border-emerald-300 dark:border-emerald-800 bg-emerald-50/10 opacity-90'
                  : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => toggleActionStatus(item.id)}
                      className="mt-0.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                    >
                      {isDone ? (
                        <CheckSquare className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <Square className="w-5 h-5" />
                      )}
                    </button>

                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                          {item.related_career}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold">
                          Skill: {item.related_skill}
                        </span>
                      </div>

                      <h3 className={`text-base font-bold ${isDone ? 'line-through text-slate-400' : 'text-slate-900 dark:text-white'}`}>
                        {item.title}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Est: {item.estimated_effort}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pl-8">
                  {item.explanation}
                </p>

                <div className="pl-8 text-xs text-slate-500">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Why it matters:</span> {item.why_it_matters}
                </div>
              </div>

              {/* Action Transfer Footer */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs pl-8">
                <div>
                  {item.suggested_deadline && (
                    <span className="text-slate-400 text-[11px]">
                      Target Completion: {new Date(item.suggested_deadline).toLocaleDateString()}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  {feedback?.id === item.id && (
                    <span className={`text-xs font-bold ${feedback.isError ? 'text-red-500' : 'text-emerald-600'}`}>
                      {feedback.msg}
                    </span>
                  )}

                  {!item.transferred_to_roadmap ? (
                    <button
                      onClick={() => handleTransfer(item.id)}
                      className="px-3.5 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900 text-indigo-700 dark:text-indigo-300 font-semibold flex items-center gap-1.5 transition-all shadow-sm"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Transfer to Roadmap</span>
                    </button>
                  ) : (
                    <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Linked to Roadmap</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
