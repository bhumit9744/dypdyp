import React, { useState } from 'react';
import { RoadmapMilestone, MilestoneStatus } from '../../types/roadmap';
import { CheckCircle2, Clock, AlertTriangle, Calendar, Edit3, ArrowRight } from 'lucide-react';

interface MilestoneTimelineProps {
  milestones: RoadmapMilestone[];
  onReschedule?: (milestoneId: string, newDate: string) => void;
  onOpenPhase?: (phaseId: string) => void;
}

export const MilestoneTimeline: React.FC<MilestoneTimelineProps> = ({
  milestones,
  onReschedule,
  onOpenPhase
}) => {
  const [editingMilestoneId, setEditingMilestoneId] = useState<string | null>(null);
  const [newDateInput, setNewDateInput] = useState<string>('');

  if (!milestones || milestones.length === 0) {
    return (
      <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-2">
        <Calendar className="w-8 h-8 text-slate-400 mx-auto" />
        <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">No Milestones Scheduled</h4>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Phase and practical project milestones will appear here chronologically once your roadmap is initialized.
        </p>
      </div>
    );
  }

  const todayStr = new Date().toISOString().split('T')[0];

  const handleSaveReschedule = (id: string) => {
    if (newDateInput && onReschedule) {
      onReschedule(id, newDateInput);
    }
    setEditingMilestoneId(null);
    setNewDateInput('');
  };

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Chronological Milestone Trajectory
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              {milestones.length} Milestones
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Key deliverables, deadlines, and practical verification dates.
          </p>
        </div>
      </div>

      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
        {milestones.map((milestone) => {
          const isCompleted = milestone.status === 'Completed';
          const isOverdue = milestone.target_date < todayStr && !isCompleted;
          const isEditing = editingMilestoneId === milestone.id;

          return (
            <div key={milestone.id} className="relative group">
              {/* Circle Marker Node */}
              <div
                className={`absolute -left-[1.85rem] top-1 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  isCompleted
                    ? 'bg-emerald-500 border-emerald-500 text-white'
                    : isOverdue
                    ? 'bg-amber-500 border-amber-500 text-white ring-4 ring-amber-100 dark:ring-amber-950/60'
                    : milestone.status === 'In Progress'
                    ? 'bg-brand-600 border-brand-600 text-white ring-4 ring-brand-100 dark:ring-brand-950'
                    : 'bg-white dark:bg-slate-850 border-slate-300 dark:border-slate-700 text-slate-400'
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                ) : isOverdue ? (
                  <AlertTriangle className="w-3 h-3" />
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full bg-current" />
                )}
              </div>

              {/* Card Container */}
              <div className={`p-4 rounded-xl border transition-all ${
                isOverdue
                  ? 'bg-amber-50/40 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800/40'
                  : 'bg-slate-50/70 dark:bg-slate-850/60 border-slate-200/70 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2 flex-wrap">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Target Date: {milestone.target_date}
                      </span>
                      {isCompleted ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                          Completed
                        </span>
                      ) : isOverdue ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                          Target Passed (Schedule Adjustment Available)
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                          {milestone.status}
                        </span>
                      )}
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {milestone.title}
                    </h4>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2 pt-1 sm:pt-0">
                    {milestone.associated_phase_or_project && onOpenPhase && (
                      <button
                        type="button"
                        onClick={() => onOpenPhase(milestone.associated_phase_or_project!)}
                        className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
                      >
                        <span>View Tasks</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {!isCompleted && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingMilestoneId(milestone.id);
                          setNewDateInput(milestone.target_date);
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title="Reschedule target date"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Inline Reschedule Input */}
                {isEditing && (
                  <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center space-x-2">
                    <input
                      type="date"
                      value={newDateInput}
                      onChange={(e) => setNewDateInput(e.target.value)}
                      className="px-2.5 py-1 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                    />
                    <button
                      type="button"
                      onClick={() => handleSaveReschedule(milestone.id)}
                      className="px-3 py-1 rounded-lg text-xs font-semibold bg-brand-600 text-white hover:bg-brand-700"
                    >
                      Save Date
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingMilestoneId(null)}
                      className="px-2 py-1 rounded-lg text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
