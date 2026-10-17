import React from 'react';
import { CareerTrack } from '../types/roadmap';
import { X, CheckCircle2, Clock, Target, Layers, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

interface CareerDetailModalProps {
  track: CareerTrack | null;
  onClose: () => void;
  onSelectTrack: (track: CareerTrack) => void;
}

export const CareerDetailModal: React.FC<CareerDetailModalProps> = ({
  track,
  onClose,
  onSelectTrack
}) => {
  if (!track) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl my-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 md:p-8 bg-gradient-to-r from-brand-600 to-indigo-700 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-2 text-xs font-semibold text-brand-200 mb-2">
            <span className="px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md">
              {track.category}
            </span>
            <span>•</span>
            <span>{track.level}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              Est. {track.estimated_duration_range}
            </span>
          </div>

          <h2 className="text-2xl md:text-3xl font-extrabold text-white">
            {track.title}
          </h2>
          <p className="mt-2 text-sm text-brand-100 max-w-2xl leading-relaxed">
            {track.description}
          </p>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 md:p-8 space-y-6 overflow-y-auto flex-1">
          {/* Core Competencies */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-brand-600" />
              Core Competencies & Skills Covered
            </h3>
            <div className="flex flex-wrap gap-2">
              {track.core_skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300 border border-brand-200/60 dark:border-brand-800/50"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Typical Practical Project Outcomes */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <Target className="w-4 h-4 text-brand-600" />
              Portfolio & Project Outcomes
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {track.typical_project_outcomes.map((outcome, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/70 dark:border-slate-800 flex items-start space-x-2.5"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="text-xs font-medium text-slate-800 dark:text-slate-200">
                    {outcome}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Phased Roadmap Breakdown */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-brand-600" />
              Curriculum & Phased Learning Journey ({track.template_phases.length} Phases)
            </h3>
            <div className="space-y-3">
              {track.template_phases.map((phase) => (
                <div
                  key={phase.phase_number}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850/50 space-y-2"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-extrabold text-brand-600 dark:text-brand-400">
                      Phase {phase.phase_number} • {phase.estimated_duration_weeks} Weeks
                    </span>
                    <span className="text-slate-400 text-[11px]">
                      {phase.skills_covered.length} Core Modules
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {phase.title.replace(/^Phase \d+ — /, '')}
                  </h4>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {phase.description}
                  </p>

                  <div className="pt-2 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-100 dark:border-slate-800">
                    <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                      <Target className="w-3.5 h-3.5 text-brand-500" />
                      Milestone: {phase.practical_milestone}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-5 md:p-6 bg-slate-50 dark:bg-slate-850/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            Back to Catalog
          </button>

          <button
            type="button"
            onClick={() => {
              onSelectTrack(track);
              onClose();
            }}
            className="px-6 py-2.5 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-md shadow-brand-600/20 transition-all flex items-center space-x-2"
          >
            <span>Personalize This Roadmap</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
