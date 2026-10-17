import React, { useState, useMemo } from 'react';
import { useRoadmap } from '../../context/RoadmapContext';
import { RoadmapPhase, RoadmapTask, TaskStatus } from '../../types/roadmap';
import { RoadmapJourneyTimeline } from '../visualizations/RoadmapJourneyTimeline';
import {
  Layers,
  Filter,
  Search,
  CheckCircle2,
  AlertCircle,
  CircleDot,
  Clock,
  ChevronRight,
  BookOpen,
  Calendar,
  Sliders,
  Sparkles
} from 'lucide-react';

export const LearningJourneyTab: React.FC = () => {
  const {
    roadmap,
    setSelectedTaskForDetail,
    updateTaskStatus,
    setActiveTab
  } = useRoadmap();

  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedPhaseId, setSelectedPhaseId] = useState<string | undefined>(
    roadmap?.phases[0]?.id
  );

  if (!roadmap) {
    return (
      <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
        <Layers className="w-10 h-10 text-slate-400 mx-auto" />
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          No Learning Journey Active
        </h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Select a career track from the catalog to generate your sequenced weekly curriculum.
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

  // Filter tasks across phases
  const filteredPhases = useMemo(() => {
    return roadmap.phases.map(phase => {
      const tasks = phase.tasks.filter(task => {
        const matchesStatus =
          statusFilter === 'All' || task.status.toLowerCase() === statusFilter.toLowerCase();
        const matchesSearch =
          searchQuery === '' ||
          task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          task.associated_skill.toLowerCase().includes(searchQuery.toLowerCase()) ||
          task.description.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesStatus && matchesSearch;
      });

      return {
        ...phase,
        tasks
      };
    });
  }, [roadmap.phases, statusFilter, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Top Banner & Timeline Ribbon */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-brand-600" />
              {roadmap.career_title} — Learning Journey
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Sequenced by dependency. Each phase concludes with an evaluated practical milestone.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold px-3 py-1 rounded-xl bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300 border border-brand-200/60">
              {roadmap.metrics.completed_tasks} of {roadmap.metrics.total_tasks} Tasks Done ({roadmap.metrics.completion_percentage}%)
            </span>
          </div>
        </div>

        {/* Interactive Roadmap Journey Milestone Timeline */}
        <RoadmapJourneyTimeline
          phases={roadmap.phases}
          selectedPhaseId={selectedPhaseId}
          onSelectPhase={(phase) => setSelectedPhaseId(phase.id)}
          onOpenTask={(task) => setSelectedTaskForDetail(task)}
        />
      </div>

      {/* Task Filters & Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search tasks, skills, or exercises..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 text-slate-900 dark:text-white"
          />
        </div>

        {/* Status Filters */}
        <div className="flex items-center overflow-x-auto space-x-1.5 w-full md:w-auto scrollbar-none">
          {['All', 'In Progress', 'Not Started', 'Completed', 'Blocked'].map(st => (
            <button
              type="button"
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all ${
                statusFilter === st
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Detailed Tasks List by Phase */}
      <div className="space-y-6">
        {filteredPhases.map(phase => {
          if (filteredPhases.every(p => p.tasks.length === 0)) return null;
          if (phase.tasks.length === 0 && searchQuery) return null;

          return (
            <div
              key={phase.id}
              className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 gap-2">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                      Phase {phase.phase_number}
                    </span>
                    <span className="text-xs text-slate-400">• ~{phase.estimated_duration_weeks} Weeks</span>
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                    {phase.title.replace(/^Phase \d+ — /, '')}
                  </h3>
                </div>

                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 self-start sm:self-auto">
                  {phase.tasks.filter(t => t.status === 'Completed').length} / {phase.tasks.length} Completed
                </span>
              </div>

              {/* Tasks in Phase */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {phase.tasks.map(task => {
                  return (
                    <div
                      key={task.id}
                      className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/40 hover:border-brand-300 dark:hover:border-brand-700 transition-all flex flex-col justify-between space-y-3"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300">
                            {task.associated_skill}
                          </span>

                          <div className="flex items-center space-x-2 text-[10px] text-slate-400 font-semibold">
                            <span>Week {task.week_number}</span>
                            <span>•</span>
                            <span>~{task.estimated_hours} hrs</span>
                          </div>
                        </div>

                        <h4
                          onClick={() => setSelectedTaskForDetail(task)}
                          className={`font-bold text-sm cursor-pointer hover:text-brand-600 transition-colors ${
                            task.status === 'Completed' ? 'line-through text-slate-400' : 'text-slate-900 dark:text-white'
                          }`}
                        >
                          {task.title}
                        </h4>

                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                          {task.description}
                        </p>
                      </div>

                      {/* Footer Actions */}
                      <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
                        {/* Status Toggle Dropdown / Buttons */}
                        <div className="flex items-center space-x-1">
                          <button
                            type="button"
                            onClick={() =>
                              updateTaskStatus(
                                task.id,
                                task.status === 'Completed' ? 'In Progress' : 'Completed'
                              )
                            }
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors flex items-center space-x-1 ${
                              task.status === 'Completed'
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                : 'bg-slate-200/70 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-emerald-50 hover:text-emerald-700'
                            }`}
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>{task.status === 'Completed' ? 'Completed' : 'Mark Done'}</span>
                          </button>

                          {task.status !== 'Completed' && (
                            <button
                              type="button"
                              onClick={() =>
                                updateTaskStatus(
                                  task.id,
                                  task.status === 'Blocked' ? 'In Progress' : 'Blocked'
                                )
                              }
                              className={`p-1.5 rounded-lg text-xs transition-colors ${
                                task.status === 'Blocked'
                                  ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                                  : 'text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800'
                              }`}
                              title={task.status === 'Blocked' ? 'Unblock task' : 'Mark as blocked'}
                            >
                              <AlertCircle className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => setSelectedTaskForDetail(task)}
                          className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
                        >
                          <span>Criteria & Guides</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
