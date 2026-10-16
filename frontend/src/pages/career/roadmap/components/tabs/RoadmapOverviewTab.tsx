import React, { useState } from 'react';
import { useRoadmap } from '../../context/RoadmapContext';
import { CircularProgressRing } from '../visualizations/CircularProgressRing';
import {
  Sparkles,
  ArrowRight,
  Compass,
  CheckCircle2,
  Clock,
  AlertCircle,
  CircleDot,
  Calendar,
  Layers,
  BookOpen,
  Target,
  BarChart3,
  Bot,
  PlayCircle,
  PauseCircle,
  Sliders,
  ChevronRight,
  HelpCircle,
  ShieldCheck
} from 'lucide-react';
import { TaskStatus } from '../../types/roadmap';

interface RoadmapOverviewTabProps {
  onOpenTimeManagement?: () => void;
}

export const RoadmapOverviewTab: React.FC<RoadmapOverviewTabProps> = ({ onOpenTimeManagement }) => {
  const {
    roadmap,
    setActiveTab,
    setSelectedTaskForDetail,
    updateTaskStatus
  } = useRoadmap();

  if (!roadmap) {
    return (
      <div className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-6 max-w-2xl mx-auto my-6 shadow-sm">
        <div className="w-16 h-16 rounded-2xl bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 mx-auto flex items-center justify-center">
          <Compass className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300 border border-brand-200/60">
            Placement Hub Intelligence
          </span>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">
            Transform Your Career Ambition into a Trackable Journey
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-lg mx-auto leading-relaxed">
            Select a verified career track or specify your target domain. The AI Career Roadmap Planner generates a structured, phased curriculum with milestones, real resources, and placement metrics.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => setActiveTab('explore-careers')}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-lg shadow-brand-600/30 transition-all flex items-center justify-center space-x-2"
          >
            <Compass className="w-4 h-4" />
            <span>Choose Your Career Track</span>
          </button>
        </div>
      </div>
    );
  }

  const currentPhase = roadmap.phases[roadmap.current_phase_index] || roadmap.phases[0];
  const allTasks = roadmap.phases.flatMap(p => p.tasks);
  const inProgressTasks = allTasks.filter(t => t.status === 'In Progress');
  const blockedTasks = allTasks.filter(t => t.status === 'Blocked');
  const notStartedTasks = allTasks.filter(t => t.status === 'Not Started');

  // Today's recommended tasks: blocked tasks first, then in-progress, then next upcoming
  const todaysTasks = [
    ...blockedTasks,
    ...inProgressTasks,
    ...notStartedTasks
  ].slice(0, 3);

  const upcomingMilestone = roadmap.milestones.find(m => m.status !== 'Completed') || roadmap.milestones[0];

  return (
    <div className="space-y-6">
      {/* Target Goal Summary Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-brand-600 via-indigo-600 to-indigo-800 text-white shadow-xl shadow-brand-600/15 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-bold uppercase tracking-wider backdrop-blur-md">
                Active Career Goal
              </span>
              <span className="text-xs text-brand-200">
                {roadmap.status === 'Active' ? '• Plan on Track' : '• Plan Paused'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {roadmap.career_title}
            </h1>

            {roadmap.specialization && (
              <p className="text-xs font-semibold text-brand-200">
                Specialization: {roadmap.specialization}
              </p>
            )}

            <p className="text-xs sm:text-sm text-brand-100 leading-relaxed">
              Target Timeline: <strong>{roadmap.target_timeline_months} Months</strong> • Availability:{' '}
              <strong>{roadmap.weekly_hours_available} hrs/week</strong> • Level:{' '}
              <strong>{roadmap.starting_proficiency}</strong>
            </p>
          </div>

          {/* Quick Overview Metrics Pill */}
          <div className="flex items-center space-x-4 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shrink-0">
            <CircularProgressRing
              percentage={roadmap.metrics.completion_percentage}
              size={90}
              strokeWidth={8}
            />

            <div className="space-y-1 text-xs">
              <div>
                <span className="text-brand-200 text-[10px] uppercase font-bold block">Tasks Done</span>
                <span className="text-lg font-black text-white">
                  {roadmap.metrics.completed_tasks} / {roadmap.metrics.total_tasks}
                </span>
              </div>
              <div>
                <span className="text-brand-200 text-[10px] uppercase font-bold block">Remaining Effort</span>
                <span className="text-sm font-bold text-white">
                  ~{roadmap.metrics.remaining_hours} Hours
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action strip */}
        <div className="mt-6 pt-4 border-t border-white/20 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2 text-brand-100">
            <Calendar className="w-3.5 h-3.5" />
            <span>Next Milestone: <strong>{upcomingMilestone?.title || 'Capstone Review'}</strong> ({upcomingMilestone?.target_date})</span>
          </div>

          <div className="flex items-center space-x-2">
            {onOpenTimeManagement && (
              <button
                type="button"
                onClick={onOpenTimeManagement}
                className="px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-semibold text-xs backdrop-blur-md transition-colors flex items-center space-x-1.5"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Adjust Pace / Hours</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setActiveTab('journey')}
              className="px-3.5 py-1.5 rounded-xl bg-white text-brand-700 hover:bg-brand-50 font-bold text-xs transition-colors flex items-center space-x-1.5"
            >
              <span>Explore Journey</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Current Phase & Today's Recommended Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Current Phase Card */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
              Current Learning Phase
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              Phase {currentPhase.phase_number} of {roadmap.phases.length}
            </span>
          </div>

          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
              {currentPhase.title.replace(/^Phase \d+ — /, '')}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-3 leading-relaxed">
              {currentPhase.description}
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/70 dark:border-slate-800 space-y-1">
            <span className="text-[10px] font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider flex items-center gap-1">
              <Target className="w-3 h-3" />
              Phase Practical Milestone
            </span>
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
              {currentPhase.practical_milestone}
            </p>
          </div>

          {/* Phase completion linear bar */}
          <div className="space-y-1.5 pt-1">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400 font-semibold">Phase Progress</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">
                {currentPhase.tasks.filter(t => t.status === 'Completed').length} / {currentPhase.tasks.length} Tasks
              </span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-brand-600 h-full rounded-full transition-all duration-500"
                style={{
                  width: `${
                    currentPhase.tasks.length > 0
                      ? Math.round(
                          (currentPhase.tasks.filter(t => t.status === 'Completed').length /
                            currentPhase.tasks.length) *
                            100
                        )
                      : 0
                  }%`
                }}
              />
            </div>
          </div>

          <button
            type="button"
            onClick={() => setActiveTab('journey')}
            className="w-full py-2.5 rounded-xl text-xs font-bold text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-950/60 border border-brand-200/60 dark:border-brand-800/40 transition-colors flex items-center justify-center space-x-1"
          >
            <span>Open Phase Syllabus</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Today's Recommended Tasks (2 cols) */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand-600" />
                What Should I Work on Today?
              </h3>
              <p className="text-xs text-slate-500">
                Top prioritized tasks scheduled based on your weekly availability.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setActiveTab('journey')}
              className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline"
            >
              View All Tasks
            </button>
          </div>

          {todaysTasks.length > 0 ? (
            <div className="space-y-3">
              {todaysTasks.map(task => (
                <div
                  key={task.id}
                  className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-850/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300">
                        {task.associated_skill}
                      </span>
                      <span className="text-[10px] text-slate-400 font-semibold">
                        ~{task.estimated_hours} hrs • Due {task.due_date || 'This Week'}
                      </span>
                      {task.status === 'Blocked' && (
                        <span className="text-[10px] font-bold text-rose-600 bg-rose-50 dark:bg-rose-950 px-2 py-0.5 rounded-full">
                          Blocked
                        </span>
                      )}
                    </div>

                    <h4
                      onClick={() => setSelectedTaskForDetail(task)}
                      className="font-bold text-sm text-slate-900 dark:text-white hover:text-brand-600 cursor-pointer transition-colors"
                    >
                      {task.title}
                    </h4>

                    <p className="text-xs text-slate-500 line-clamp-1">
                      {task.learning_objective}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0 self-end sm:self-center">
                    {task.status !== 'Completed' ? (
                      <button
                        type="button"
                        onClick={() => updateTaskStatus(task.id, 'Completed')}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:hover:bg-emerald-900 dark:text-emerald-300 transition-colors flex items-center space-x-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Mark Done</span>
                      </button>
                    ) : (
                      <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" />
                        Completed
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={() => setSelectedTaskForDetail(task)}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-750 transition-colors"
                    >
                      Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 py-6 text-center">
              All scheduled tasks completed! Check practical milestone projects.
            </p>
          )}
        </div>
      </div>

      {/* Feature Quick Launch Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          {
            id: 'journey' as const,
            title: 'Learning Journey',
            desc: `${roadmap.phases.length} Phased Roadmap`,
            icon: Layers,
            color: 'text-brand-600 bg-brand-50 dark:bg-brand-950'
          },
          {
            id: 'projects' as const,
            title: 'Project Milestones',
            desc: `${roadmap.projects.length} Practical Capstones`,
            icon: Target,
            color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950'
          },
          {
            id: 'resources' as const,
            title: 'Resource Library',
            desc: 'Verified Documentation & Guides',
            icon: BookOpen,
            color: 'text-amber-600 bg-amber-50 dark:bg-amber-950'
          },
          {
            id: 'analytics' as const,
            title: 'Progress Analytics',
            desc: 'Radar Skills & Workload',
            icon: BarChart3,
            color: 'text-violet-600 bg-violet-50 dark:bg-violet-950'
          }
        ].map(item => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-brand-300 dark:hover:border-brand-700 hover:shadow-md cursor-pointer transition-all space-y-2 group"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${item.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-brand-600 transition-colors">
                  {item.title}
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {item.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
