import React, { useState } from 'react';
import { RoadmapTask, TaskStatus, LearningResource } from '../types/roadmap';
import {
  X,
  CheckCircle2,
  AlertCircle,
  CircleDot,
  Clock,
  BookOpen,
  ExternalLink,
  Bookmark,
  BookmarkCheck,
  Save,
  Target,
  Sparkles,
  Layers,
  HelpCircle
} from 'lucide-react';

interface TaskDetailModalProps {
  task: RoadmapTask | null;
  resources: LearningResource[];
  onClose: () => void;
  onUpdateStatus: (taskId: string, status: TaskStatus, notes?: string) => void;
  onToggleSaveResource?: (resourceId: string) => void;
}

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
  task,
  resources,
  onClose,
  onUpdateStatus,
  onToggleSaveResource
}) => {
  if (!task) return null;

  const [currentStatus, setCurrentStatus] = useState<TaskStatus>(task.status);
  const [notes, setNotes] = useState<string>(task.notes || '');
  const [savedNotesFeedback, setSavedNotesFeedback] = useState<boolean>(false);

  // Filter linked resources
  const linkedResources = resources.filter(
    r =>
      (task.resource_ids && task.resource_ids.includes(r.id)) ||
      r.skills.some(s => s.toLowerCase() === task.associated_skill.toLowerCase())
  );

  const handleStatusChange = (newStatus: TaskStatus) => {
    setCurrentStatus(newStatus);
    onUpdateStatus(task.id, newStatus, notes);
  };

  const handleSaveNotes = () => {
    onUpdateStatus(task.id, currentStatus, notes);
    setSavedNotesFeedback(true);
    setTimeout(() => setSavedNotesFeedback(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl my-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 bg-slate-50 dark:bg-slate-850/80 border-b border-slate-200 dark:border-slate-800 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400 mb-2">
            <span className="font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider text-[11px]">
              Task #{task.task_number} • Week {task.week_number}
            </span>
            <span>•</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              {task.priority} Priority
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              ~{task.estimated_hours} Hours Target
            </span>
          </div>

          <h3 className="text-xl font-bold text-slate-900 dark:text-white pr-8">
            {task.title}
          </h3>

          <div className="mt-2 flex items-center space-x-2">
            <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300 border border-brand-200/50 dark:border-brand-800/40">
              Skill: {task.associated_skill}
            </span>
            {task.due_date && (
              <span className="text-xs text-slate-400">
                Target Due: {task.due_date}
              </span>
            )}
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Status Quick Switcher */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
              Update Current Task Status:
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { status: 'Not Started' as TaskStatus, label: 'Not Started', icon: CircleDot, style: 'hover:border-slate-400' },
                { status: 'In Progress' as TaskStatus, label: 'In Progress', icon: CircleDot, style: 'text-brand-600 border-brand-500 bg-brand-50 dark:bg-brand-950/60' },
                { status: 'Completed' as TaskStatus, label: 'Completed', icon: CheckCircle2, style: 'text-emerald-600 border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60' },
                { status: 'Blocked' as TaskStatus, label: 'Blocked', icon: AlertCircle, style: 'text-rose-600 border-rose-500 bg-rose-50 dark:bg-rose-950/60' }
              ].map(opt => {
                const Icon = opt.icon;
                const isActive = currentStatus === opt.status;
                return (
                  <button
                    type="button"
                    key={opt.status}
                    onClick={() => handleStatusChange(opt.status)}
                    className={`p-2.5 rounded-xl border-2 text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
                      isActive
                        ? opt.style
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Description & Objective */}
          <div className="space-y-3">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Description & Scope
              </span>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {task.description}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850/60 border border-slate-200/80 dark:border-slate-800 space-y-2">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400 block mb-0.5">
                  Learning Objective
                </span>
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  {task.learning_objective}
                </p>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                  Why this matters in Placement Interviews
                </span>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  {task.why_it_matters}
                </p>
              </div>
            </div>
          </div>

          {/* Practical Exercise & Definition of Done */}
          <div className="space-y-3">
            {task.practical_exercise && (
              <div className="p-4 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200/60 dark:border-indigo-800/40">
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300 flex items-center gap-1.5 mb-1">
                  <Target className="w-3.5 h-3.5" />
                  Practical Exercise
                </span>
                <p className="text-xs text-indigo-950 dark:text-indigo-200 leading-relaxed">
                  {task.practical_exercise}
                </p>
              </div>
            )}

            <div className="p-4 rounded-xl bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-800/30">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5 mb-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Completion Criteria (Definition of Done)
              </span>
              <p className="text-xs text-emerald-950 dark:text-emerald-200 leading-relaxed">
                {task.completion_criteria}
              </p>
            </div>
          </div>

          {/* Linked Learning Resources */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-brand-600" />
              Linked Learning Resources ({linkedResources.length})
            </span>

            {linkedResources.length > 0 ? (
              <div className="space-y-2">
                {linkedResources.map(res => (
                  <div
                    key={res.id}
                    className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 flex items-center justify-between gap-3 hover:border-slate-300"
                  >
                    <div className="min-w-0 space-y-0.5">
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                          {res.resource_type}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {res.provider} • {res.difficulty}
                        </span>
                      </div>
                      <h5 className="font-bold text-xs text-slate-900 dark:text-white truncate">
                        {res.title}
                      </h5>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0">
                      {onToggleSaveResource && (
                        <button
                          type="button"
                          onClick={() => onToggleSaveResource(res.id)}
                          className="p-2 rounded-lg text-slate-400 hover:text-brand-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title={res.saved_for_later ? 'Remove bookmark' : 'Save for later'}
                        >
                          {res.saved_for_later ? (
                            <BookmarkCheck className="w-4 h-4 text-brand-600" />
                          ) : (
                            <Bookmark className="w-4 h-4" />
                          )}
                        </button>
                      )}

                      <a
                        href={res.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-brand-50 hover:bg-brand-100 text-brand-700 dark:bg-brand-950 dark:hover:bg-brand-900 dark:text-brand-300 transition-colors flex items-center space-x-1"
                      >
                        <span>Open</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">
                No specific external links attached. Check the Resource Library tab to browse guides for {task.associated_skill}.
              </p>
            )}
          </div>

          {/* Student Personal Notes */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Personal Task Notes & Scratchpad:
              </label>
              {savedNotesFeedback && (
                <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                  Notes saved!
                </span>
              )}
            </div>

            <textarea
              rows={3}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Record implementation notes, bugs encountered, or links to your branch..."
              className="w-full p-3 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-brand-500"
            />

            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleSaveNotes}
                className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition-colors flex items-center space-x-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Notes</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-850/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            {currentStatus === 'Completed' ? 'Task completed & calculated in analytics.' : 'Changes persist automatically.'}
          </span>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90 transition-opacity"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
