import React, { useState } from 'react';
import { useGuidance } from '../../context/GuidanceContext';
import {
  X,
  FlaskConical,
  Clock,
  CheckCircle2,
  Play,
  Save,
  HelpCircle,
  ExternalLink,
  BookOpen
} from 'lucide-react';

export const ExperimentModal: React.FC = () => {
  const {
    selectedExperimentForModal,
    setSelectedExperimentForModal,
    completeExperiment
  } = useGuidance();

  const exp = selectedExperimentForModal;

  const [enjoyed, setEnjoyed] = useState(exp?.student_progress?.reflection_enjoyed || '');
  const [difficult, setDifficult] = useState(exp?.student_progress?.reflection_difficult || '');
  const [matched, setMatched] = useState(exp?.student_progress?.reflection_matched_expectations || 'Matched');
  const [advance, setAdvance] = useState(true);
  const [nextStep, setNextStep] = useState(exp?.student_progress?.reflection_difficult ? 'Deep dive into practical exercises' : '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!exp) return null;

  const isDone = exp.student_progress?.status === 'Completed';

  const handleSubmitReflection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!enjoyed.trim() || !difficult.trim()) return;

    setIsSubmitting(true);
    await completeExperiment(exp.id, enjoyed, difficult, matched, advance, nextStep);
    setIsSubmitting(false);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      setSelectedExperimentForModal(null);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                {exp.career_category}
              </span>
              <span className="text-[11px] text-slate-500 flex items-center gap-1 font-semibold">
                <Clock className="w-3 h-3" /> {exp.expected_duration}
              </span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              {exp.title}
            </h3>
          </div>

          <button
            onClick={() => setSelectedExperimentForModal(null)}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs">
          {/* Objective */}
          <div className="p-4 rounded-2xl bg-purple-50/50 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/40 space-y-1">
            <span className="text-[10px] font-bold uppercase text-purple-700 dark:text-purple-300 tracking-wider block">
              Learning Objective
            </span>
            <p className="text-slate-700 dark:text-slate-200 leading-relaxed">
              {exp.learning_objective}
            </p>
          </div>

          {/* Zero-Cost Tools Required */}
          <div className="space-y-1.5">
            <span className="font-bold text-slate-800 dark:text-slate-200 block">
              Required Free Tools:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {exp.required_tools.map(tool => (
                <span
                  key={tool}
                  className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold"
                >
                  ✓ {tool}
                </span>
              ))}
            </div>
          </div>

          {/* Step-by-Step Instructions */}
          <div className="space-y-2">
            <span className="font-bold text-slate-800 dark:text-slate-200 block">
              Step-by-Step Execution Guide:
            </span>
            <div className="space-y-2">
              {exp.instructions.map((step, i) => (
                <div
                  key={i}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300 leading-relaxed"
                >
                  {step}
                </div>
              ))}
            </div>
          </div>

          {/* Expected Deliverable */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800 space-y-1">
            <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block">
              Expected Deliverable:
            </span>
            <p className="text-slate-700 dark:text-slate-200 leading-relaxed font-semibold">
              {exp.expected_deliverable}
            </p>
          </div>

          {/* Completion Criteria */}
          <div className="space-y-1.5">
            <span className="font-bold text-slate-800 dark:text-slate-200 block">
              Definition of Done Checklist:
            </span>
            <ul className="space-y-1 pl-4 list-disc text-slate-600 dark:text-slate-300">
              {exp.completion_criteria.map((crit, i) => (
                <li key={i}>{crit}</li>
              ))}
            </ul>
          </div>

          {/* Post-Experiment Reflective Questionnaire */}
          <form onSubmit={handleSubmitReflection} className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-850/80 border border-slate-200 dark:border-slate-800 space-y-4 pt-4">
            <div className="border-b border-slate-200 dark:border-slate-700 pb-2">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                {isDone ? 'Your Saved Reflection' : 'Save Your Post-Experiment Reflection'}
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Reflecting on hands-on work clarifies whether the reality matches your initial interest.
              </p>
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                1. What aspect of this task did you most enjoy? *
              </label>
              <textarea
                rows={2}
                required
                placeholder="e.g. Loved solving the logic of unit calculations..."
                value={enjoyed}
                onChange={e => setEnjoyed(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                2. What felt difficult or confusing? *
              </label>
              <textarea
                rows={2}
                required
                placeholder="e.g. Figuring out edge case validations took extra time..."
                value={difficult}
                onChange={e => setDifficult(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  3. Did the work match expectations?
                </label>
                <select
                  value={matched}
                  onChange={e => setMatched(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
                >
                  <option value="Exceeded">Exceeded Expectations</option>
                  <option value="Matched">Matched Expectations</option>
                  <option value="Different">Different Than Expected</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  4. Would you like to advance further in this field?
                </label>
                <div className="flex items-center gap-3 pt-2">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="advance"
                      checked={advance}
                      onChange={() => setAdvance(true)}
                    />
                    <span>Yes, definitely</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="advance"
                      checked={!advance}
                      onChange={() => setAdvance(false)}
                    />
                    <span>Uncertain / Prefer other tracks</span>
                  </label>
                </div>
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                5. What would you like to learn next?
              </label>
              <input
                type="text"
                placeholder="e.g. How to connect this to an authenticated database..."
                value={nextStep}
                onChange={e => setNextStep(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
              />
            </div>

            {success && (
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Reflection saved and logged to your Decision History!</span>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs shadow-md flex items-center gap-2 active:scale-95 transition-all"
              >
                <Save className="w-4 h-4" />
                <span>{isDone ? 'Update Reflection' : 'Save Completed Reflection'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex justify-end bg-slate-50/50 dark:bg-slate-850/50">
          <button
            onClick={() => setSelectedExperimentForModal(null)}
            className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
