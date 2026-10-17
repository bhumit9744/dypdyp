import React from 'react';
import { useGuidance } from '../../context/GuidanceContext';
import {
  X,
  Target,
  Compass,
  Briefcase,
  CheckCircle2,
  Code2,
  BookOpen,
  Award,
  Layers,
  ArrowRight
} from 'lucide-react';

export const CareerDetailModal: React.FC = () => {
  const {
    selectedRoleForModal,
    setSelectedRoleForModal,
    primaryGoal,
    setGoal,
    navigateToRoadmapWithRole
  } = useGuidance();

  if (!selectedRoleForModal) return null;

  const role = selectedRoleForModal;
  const isPrimary = primaryGoal?.career_id === role.id;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                {role.category}
              </span>
              {isPrimary && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500 text-white">
                  Current Primary Goal
                </span>
              )}
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              {role.title}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Typical Entry Titles: {role.entry_job_titles.join(', ')}
            </p>
          </div>

          <button
            onClick={() => setSelectedRoleForModal(null)}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs">
          {/* Description & Day to Day */}
          <div className="space-y-2">
            <span className="font-bold text-slate-800 dark:text-slate-200 block">
              Overview & Day-to-Day Realities:
            </span>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-850 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800">
              {role.description}
            </p>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              <strong>Daily Work:</strong> {role.day_to_day}
            </p>
          </div>

          {/* Core Responsibilities */}
          <div className="space-y-1.5">
            <span className="font-bold text-slate-800 dark:text-slate-200 block">
              Core Job Responsibilities:
            </span>
            <ul className="space-y-1 pl-4 list-disc text-slate-600 dark:text-slate-300">
              {role.core_responsibilities.map((resp, i) => (
                <li key={i}>{resp}</li>
              ))}
            </ul>
          </div>

          {/* Essential Skills & Tools */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 space-y-1.5">
              <span className="text-[10px] uppercase font-bold text-indigo-700 dark:text-indigo-300 tracking-wider block">
                Essential Technical Competencies:
              </span>
              <div className="flex flex-wrap gap-1">
                {role.essential_skills.map(sk => (
                  <span
                    key={sk}
                    className="text-[10px] px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-800 text-indigo-800 dark:text-indigo-200 font-medium"
                  >
                    {sk}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800 space-y-1.5">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
                Common Industry Tools:
              </span>
              <div className="flex flex-wrap gap-1">
                {role.tools_technologies.map(t => (
                  <span
                    key={t}
                    className="text-[10px] px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Example Projects */}
          <div className="space-y-1.5">
            <span className="font-bold text-slate-800 dark:text-slate-200 block">
              Benchmark Portfolio Projects:
            </span>
            <div className="space-y-1.5">
              {role.example_projects.map((proj, i) => (
                <div
                  key={i}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850 flex items-center gap-2 text-slate-700 dark:text-slate-300 font-medium"
                >
                  <Code2 className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>{proj}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Interview & Portfolio expectations */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800 space-y-2">
            <div>
              <span className="font-bold text-slate-800 dark:text-slate-200 block mb-0.5">
                Technical Interview Focus:
              </span>
              <p className="text-slate-600 dark:text-slate-400">
                {role.interview_focus.join(' • ')}
              </p>
            </div>
            <div>
              <span className="font-bold text-slate-800 dark:text-slate-200 block mb-0.5">
                Recruiter Portfolio Expectations:
              </span>
              <p className="text-slate-600 dark:text-slate-400">
                {role.portfolio_expectations}
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-850/50">
          <button
            onClick={() => setSelectedRoleForModal(null)}
            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Close
          </button>

          <div className="flex items-center gap-2">
            {!isPrimary && (
              <button
                onClick={() => {
                  setGoal(role.id, true);
                  setSelectedRoleForModal(null);
                }}
                className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md flex items-center gap-1.5"
              >
                <Target className="w-3.5 h-3.5" />
                <span>Select as Primary Goal</span>
              </button>
            )}

            <button
              onClick={() => {
                setSelectedRoleForModal(null);
                navigateToRoadmapWithRole(role.id);
              }}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-md flex items-center gap-1.5"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Generate Roadmap</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
