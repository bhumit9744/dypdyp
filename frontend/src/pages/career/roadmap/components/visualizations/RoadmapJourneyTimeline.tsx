import React, { useState } from 'react';
import { RoadmapPhase, TaskStatus } from '../../types/roadmap';
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  CircleDot,
  ChevronRight,
  ChevronDown,
  Sparkles,
  ArrowRight,
  Target,
  BookOpen
} from 'lucide-react';

interface RoadmapJourneyTimelineProps {
  phases: RoadmapPhase[];
  onSelectPhase?: (phase: RoadmapPhase) => void;
  onOpenTask?: (task: any) => void;
  selectedPhaseId?: string;
}

export const RoadmapJourneyTimeline: React.FC<RoadmapJourneyTimelineProps> = ({
  phases,
  onSelectPhase,
  onOpenTask,
  selectedPhaseId
}) => {
  const [expandedPhaseId, setExpandedPhaseId] = useState<string | null>(
    selectedPhaseId || (phases.length > 0 ? phases[0].id : null)
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Completed':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/40">
            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
            Completed
          </span>
        );
      case 'In Progress':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300 border border-brand-200/60 dark:border-brand-800/40 animate-pulse">
            <CircleDot className="w-3 h-3 text-brand-500" />
            In Progress
          </span>
        );
      case 'Blocked':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200/60 dark:border-rose-800/40">
            <AlertCircle className="w-3 h-3 text-rose-500" />
            Blocked
          </span>
        );
      case 'Upcoming':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
            <Clock className="w-3 h-3 text-slate-400" />
            Upcoming
          </span>
        );
    }
  };

  const getNodeColor = (status: string, isExpanded: boolean) => {
    if (status === 'Completed') {
      return 'bg-emerald-600 border-emerald-600 text-white shadow-emerald-500/30';
    }
    if (status === 'Blocked') {
      return 'bg-rose-600 border-rose-600 text-white shadow-rose-500/30';
    }
    if (status === 'In Progress') {
      return 'bg-brand-600 border-brand-600 text-white shadow-brand-500/30 ring-4 ring-brand-100 dark:ring-brand-950';
    }
    return isExpanded
      ? 'bg-slate-800 border-slate-700 text-white dark:bg-white dark:text-slate-900'
      : 'bg-white dark:bg-slate-850 border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300';
  };

  return (
    <div className="w-full space-y-6">
      {/* Desktop Horizontal Milestone Connected Ribbon (Hidden on small viewports) */}
      <div className="hidden lg:block relative p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-600" />
              Roadmap Journey Timeline
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Interactive milestone nodes. Click any phase node to inspect its weekly breakdown.
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-400">
            {phases.filter(p => p.status === 'Completed').length} of {phases.length} Phases Done
          </span>
        </div>

        {/* Timeline Track Line */}
        <div className="relative pt-6 pb-2">
          <div className="absolute top-[3.25rem] left-8 right-8 h-1 bg-slate-200 dark:bg-slate-800 -translate-y-1/2 z-0" />

          {/* Milestone Nodes */}
          <div className="relative z-10 grid gap-2" style={{ gridTemplateColumns: `repeat(${phases.length}, minmax(0, 1fr))` }}>
            {phases.map((phase, idx) => {
              const isExpanded = expandedPhaseId === phase.id;
              const completedTasksCount = phase.tasks.filter(t => t.status === 'Completed').length;
              const totalTasksCount = phase.tasks.length;
              const nodeStyle = getNodeColor(phase.status, isExpanded);

              return (
                <div
                  key={phase.id}
                  onClick={() => {
                    setExpandedPhaseId(isExpanded ? null : phase.id);
                    if (onSelectPhase) onSelectPhase(phase);
                  }}
                  className="cursor-pointer group flex flex-col items-center text-center px-1.5 transition-all"
                >
                  {/* Status Indicator Pill */}
                  <div className="mb-3 transform transition-transform group-hover:scale-105">
                    {getStatusBadge(phase.status)}
                  </div>

                  {/* Connected Node Button */}
                  <button
                    type="button"
                    className={`w-11 h-11 rounded-full border-2 flex items-center justify-center font-bold text-xs shadow-md transition-all duration-300 group-hover:scale-110 ${nodeStyle}`}
                    aria-label={`Phase ${phase.phase_number}: ${phase.title}`}
                  >
                    {phase.status === 'Completed' ? (
                      <CheckCircle2 className="w-5 h-5 text-white" />
                    ) : (
                      <span>{phase.phase_number}</span>
                    )}
                  </button>

                  {/* Node Title & Details */}
                  <div className="mt-3 space-y-1">
                    <p className={`text-xs font-bold line-clamp-1 transition-colors ${
                      isExpanded ? 'text-brand-600 dark:text-brand-400' : 'text-slate-800 dark:text-slate-200 group-hover:text-brand-600'
                    }`}>
                      {phase.title.replace(/^Phase \d+ — /, '')}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      ~{phase.estimated_duration_weeks} wks • {completedTasksCount}/{totalTasksCount} tasks
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Responsive Vertical Stepper (Visible on Mobile & Tablet, and detailed expansion) */}
      <div className="space-y-3">
        {phases.map((phase) => {
          const isExpanded = expandedPhaseId === phase.id;
          const completedTasksCount = phase.tasks.filter(t => t.status === 'Completed').length;
          const totalTasksCount = phase.tasks.length;
          const phaseProgress = totalTasksCount > 0 ? Math.round((completedTasksCount / totalTasksCount) * 100) : 0;

          return (
            <div
              key={phase.id}
              className={`rounded-2xl transition-all duration-200 border overflow-hidden ${
                isExpanded
                  ? 'bg-white dark:bg-slate-900 border-brand-300 dark:border-brand-800 shadow-md ring-1 ring-brand-500/10'
                  : 'bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              {/* Stepper Header Accordion Toggle */}
              <button
                type="button"
                onClick={() => {
                  setExpandedPhaseId(isExpanded ? null : phase.id);
                  if (onSelectPhase) onSelectPhase(phase);
                }}
                className="w-full p-4 sm:p-5 flex items-start sm:items-center justify-between text-left gap-4"
              >
                <div className="flex items-start sm:items-center space-x-3.5 min-w-0">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                    phase.status === 'Completed'
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                      : phase.status === 'In Progress'
                      ? 'bg-brand-600 text-white'
                      : phase.status === 'Blocked'
                      ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                      : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                  }`}>
                    {phase.status === 'Completed' ? <CheckCircle2 className="w-5 h-5" /> : phase.phase_number}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        Phase {phase.phase_number}
                      </span>
                      {getStatusBadge(phase.status)}
                      <span className="text-[11px] text-slate-400">
                        • {phase.estimated_duration_weeks} Weeks Planned
                      </span>
                    </div>
                    <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white truncate">
                      {phase.title.replace(/^Phase \d+ — /, '')}
                    </h4>
                  </div>
                </div>

                <div className="flex items-center space-x-3 shrink-0">
                  <div className="hidden sm:block text-right">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {phaseProgress}%
                    </span>
                    <p className="text-[10px] text-slate-400">
                      {completedTasksCount}/{totalTasksCount} tasks
                    </p>
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-850 flex items-center justify-center text-slate-400">
                    {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </div>
                </div>
              </button>

              {/* Expanded Phase Details & Task List */}
              {isExpanded && (
                <div className="px-4 pb-5 sm:px-6 sm:pb-6 pt-2 border-t border-slate-100 dark:border-slate-800/80 space-y-5">
                  {/* Phase Overview & Milestone Objective */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-850/60 border border-slate-200/70 dark:border-slate-800">
                    <div className="md:col-span-2 space-y-1.5">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Why this phase matters
                      </span>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        {phase.why_it_matters}
                      </p>
                    </div>

                    <div className="space-y-1.5 md:border-l md:border-slate-200 md:dark:border-slate-800 md:pl-4">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400 flex items-center gap-1">
                        <Target className="w-3.5 h-3.5" />
                        Practical Milestone
                      </span>
                      <p className="text-xs font-semibold text-slate-900 dark:text-white">
                        {phase.practical_milestone}
                      </p>
                    </div>
                  </div>

                  {/* Skills Covered in this Phase */}
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                      Skills Trained
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {phase.skills_covered.map((skill, skIdx) => (
                        <span
                          key={skIdx}
                          className="px-2.5 py-1 rounded-lg text-xs font-medium bg-brand-50/70 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300 border border-brand-200/50 dark:border-brand-800/40"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Task Checklist Items */}
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        Phase Tasks ({completedTasksCount}/{totalTasksCount})
                      </span>
                      <span className="text-[11px] text-slate-400">
                        Click a task to view criteria & linked resources
                      </span>
                    </div>

                    <div className="space-y-2">
                      {phase.tasks.map((task) => (
                        <div
                          key={task.id}
                          onClick={() => onOpenTask && onOpenTask(task)}
                          className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 hover:border-brand-300 dark:hover:border-brand-700 bg-white dark:bg-slate-900 transition-all flex items-center justify-between gap-3 cursor-pointer group"
                        >
                          <div className="flex items-center space-x-3 min-w-0">
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                              task.status === 'Completed'
                                ? 'bg-emerald-500 text-white'
                                : task.status === 'In Progress'
                                ? 'bg-brand-500 text-white'
                                : task.status === 'Blocked'
                                ? 'bg-rose-500 text-white'
                                : 'border-2 border-slate-300 dark:border-slate-600'
                            }`}>
                              {task.status === 'Completed' && <CheckCircle2 className="w-3.5 h-3.5" />}
                              {task.status === 'Blocked' && <AlertCircle className="w-3.5 h-3.5" />}
                            </div>

                            <div className="min-w-0">
                              <p className={`text-xs font-bold truncate group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors ${
                                task.status === 'Completed' ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-200'
                              }`}>
                                {task.title}
                              </p>
                              <div className="flex items-center space-x-2 text-[10px] text-slate-400">
                                <span>{task.associated_skill}</span>
                                <span>•</span>
                                <span>~{task.estimated_hours} hrs</span>
                                {task.due_date && (
                                  <>
                                    <span>•</span>
                                    <span>Due {task.due_date}</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2 shrink-0">
                            {getStatusBadge(task.status)}
                            <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-brand-500 transition-colors" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
