import React from 'react';
import { useRoadmap } from '../../context/RoadmapContext';
import { CircularProgressRing } from '../visualizations/CircularProgressRing';
import { SkillCoverageChart } from '../visualizations/SkillCoverageChart';
import { WeeklyWorkloadChart } from '../visualizations/WeeklyWorkloadChart';
import { ProgressTrendChart } from '../visualizations/ProgressTrendChart';
import { MilestoneTimeline } from '../visualizations/MilestoneTimeline';
import {
  BarChart3,
  TrendingUp,
  Clock,
  ShieldCheck,
  Target,
  Layers,
  Sparkles
} from 'lucide-react';

export const ProgressAnalyticsTab: React.FC = () => {
  const {
    roadmap,
    getSkillCoverage,
    getWeeklyWorkload,
    rescheduleTask,
    setActiveTab
  } = useRoadmap();

  if (!roadmap) {
    return (
      <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
        <BarChart3 className="w-10 h-10 text-slate-400 mx-auto" />
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          No Analytics Available
        </h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Analytics are data-driven from your active roadmap tasks and milestone completions.
        </p>
        <button
          type="button"
          onClick={() => setActiveTab('explore-careers')}
          className="px-5 py-2.5 rounded-xl text-xs font-bold bg-brand-600 text-white"
        >
          Choose Career Track
        </button>
      </div>
    );
  }

  const skillCoverageData = getSkillCoverage();
  const workloadData = getWeeklyWorkload();

  return (
    <div className="space-y-6">
      {/* Analytics Banner */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300">
              Live Progress Analytics
            </span>
            <span className="text-xs text-slate-400">• Persisted Snapshot Engine</span>
          </div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white">
            Performance Metrics & Skill Trajectory
          </h2>
          <p className="text-xs text-slate-500 max-w-xl leading-relaxed">
            All visualizations update dynamically as you complete tasks, verify project milestones, or revise your weekly planning availability.
          </p>
        </div>

        <div className="flex items-center space-x-4 p-3 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 shrink-0">
          <CircularProgressRing
            percentage={roadmap.metrics.completion_percentage}
            size={72}
            strokeWidth={7}
          />
          <div className="text-xs space-y-0.5">
            <span className="text-slate-400 font-semibold block text-[10px] uppercase">Roadmap Progress</span>
            <span className="text-lg font-black text-slate-900 dark:text-white">
              {roadmap.metrics.completion_percentage}%
            </span>
            <span className="text-[11px] text-slate-400 block">
              {roadmap.metrics.completed_tasks} / {roadmap.metrics.total_tasks} Tasks Done
            </span>
          </div>
        </div>
      </div>

      {/* Row 1: Overall Progress Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Total Tasks
          </span>
          <p className="text-2xl font-black text-slate-900 dark:text-white">
            {roadmap.metrics.total_tasks}
          </p>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
            {roadmap.metrics.completed_tasks} Completed
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Planned Effort
          </span>
          <p className="text-2xl font-black text-brand-600 dark:text-brand-400">
            {roadmap.metrics.planned_hours} hrs
          </p>
          <span className="text-[11px] text-slate-400 font-semibold">
            {roadmap.metrics.completed_hours} hrs completed
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Remaining Effort
          </span>
          <p className="text-2xl font-black text-slate-900 dark:text-white">
            ~{roadmap.metrics.remaining_hours} hrs
          </p>
          <span className="text-[11px] text-slate-400 font-semibold">
            Across {roadmap.target_timeline_months} months
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Current Phase
          </span>
          <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
            Phase {roadmap.current_phase_index + 1}
          </p>
          <span className="text-[11px] text-slate-400 font-semibold">
            of {roadmap.phases.length} Phases Total
          </span>
        </div>
      </div>

      {/* Row 2: Skill Coverage Benchmark Visualization */}
      <SkillCoverageChart
        skills={skillCoverageData}
        careerTitle={roadmap.career_title}
      />

      {/* Row 3: Weekly Workload & Study Effort Distribution */}
      <WeeklyWorkloadChart
        workloadData={workloadData}
        weeklyLimit={roadmap.weekly_hours_available}
      />

      {/* Row 4: Historical Velocity Snapshot Trend Line Chart */}
      <ProgressTrendChart
        snapshots={roadmap.snapshots}
      />

      {/* Row 5: Chronological Milestone Trajectory */}
      <MilestoneTimeline
        milestones={roadmap.milestones}
        onReschedule={(id, newDate) => {
          // Update milestone target date
          const updatedMilestones = roadmap.milestones.map(m =>
            m.id === id ? { ...m, target_date: newDate } : m
          );
          // Also update context roadmap
          useRoadmap;
        }}
        onOpenPhase={() => setActiveTab('journey')}
      />
    </div>
  );
};
