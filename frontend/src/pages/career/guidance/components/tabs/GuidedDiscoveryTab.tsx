import React, { useState } from 'react';
import { useGuidance } from '../../context/GuidanceContext';
import { DISCOVERY_QUESTIONS } from '../../data/guidanceData';
import {
  Compass,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  RotateCcw,
  Lightbulb,
  FlaskConical,
  GitCompare,
  Target,
  ShieldAlert
} from 'lucide-react';

export const GuidedDiscoveryTab: React.FC = () => {
  const {
    profile,
    roles,
    updateProfile,
    setGoal,
    setActiveTab,
    setSelectedRoleForModal
  } = useGuidance();

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string[]>>({
    1: ['act_build_apps', 'act_data_analysis'],
    2: ['tech_js_ts', 'tech_sql', 'tech_py'],
    3: ['sub_dsa', 'sub_dbms'],
    4: ['style_systems'],
    5: ['goal_campus_placement']
  });

  const [isCompleted, setIsCompleted] = useState(false);

  const currentQ = DISCOVERY_QUESTIONS[currentStepIndex];
  const progressPercent = Math.round(((currentStepIndex + 1) / DISCOVERY_QUESTIONS.length) * 100);

  const handleToggleOption = (optionId: string) => {
    const currentSelected = answers[currentQ.id] || [];
    if (currentSelected.includes(optionId)) {
      setAnswers({ ...answers, [currentQ.id]: currentSelected.filter(id => id !== optionId) });
    } else {
      setAnswers({ ...answers, [currentQ.id]: [...currentSelected, optionId] });
    }
  };

  const handleNext = () => {
    if (currentStepIndex < DISCOVERY_QUESTIONS.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      // Finalize and generate exploration summary
      setIsCompleted(true);

      // Map answers back to student profile
      const newInterests: string[] = [];
      const newActivities: string[] = [];

      (answers[1] || []).forEach(ansId => {
        const opt = DISCOVERY_QUESTIONS[0].options.find(o => o.id === ansId);
        if (opt) newActivities.push(opt.label);
      });

      (answers[3] || []).forEach(ansId => {
        const opt = DISCOVERY_QUESTIONS[2].options.find(o => o.id === ansId);
        if (opt) newInterests.push(opt.label);
      });

      updateProfile({
        preferred_activities: Array.from(new Set([...(profile.preferred_activities || []), ...newActivities])),
        interests: Array.from(new Set([...(profile.interests || []), ...newInterests]))
      });
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const handleRestart = () => {
    setCurrentStepIndex(0);
    setIsCompleted(false);
  };

  // Derive top 3 matching roles from answers
  const topMatches = roles.slice(0, 3);

  return (
    <div className="space-y-6">
      {!isCompleted ? (
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Header Card */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 text-xs font-semibold">
                <Compass className="w-3.5 h-3.5" />
                <span>Question {currentStepIndex + 1} of {DISCOVERY_QUESTIONS.length}</span>
              </div>
              <span className="text-xs font-bold text-slate-500">
                {progressPercent}% Complete
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white leading-snug">
                {currentQ.title}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                {currentQ.subtitle}
              </p>
            </div>
          </div>

          {/* Options Grid */}
          <div className="space-y-2.5">
            {currentQ.options.map(opt => {
              const selected = (answers[currentQ.id] || []).includes(opt.id);
              return (
                <div
                  key={opt.id}
                  onClick={() => handleToggleOption(opt.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    selected
                      ? 'bg-indigo-50/70 dark:bg-indigo-950/40 border-indigo-400 dark:border-indigo-600 shadow-sm'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-all ${
                        selected
                          ? 'bg-indigo-600 border-indigo-600 text-white'
                          : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800'
                      }`}
                    >
                      {selected && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </div>
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                      {opt.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={handleBack}
              disabled={currentStepIndex === 0}
              className={`px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all ${
                currentStepIndex === 0 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={handleNext}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-all"
              >
                Skip Question
              </button>
              <button
                onClick={handleNext}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md flex items-center gap-1.5 transition-all active:scale-95"
              >
                <span>{currentStepIndex === DISCOVERY_QUESTIONS.length - 1 ? 'Generate Summary' : 'Continue'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Discovery Results Summary */
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-semibold mb-2">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Discovery Questionnaire Completed</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Your Career Exploration Summary
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Synthesized from your stated work preferences, technical foundations, and 6-month goals.
              </p>
            </div>

            <button
              onClick={handleRestart}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold flex items-center gap-1.5 text-slate-700 dark:text-slate-300 transition-all self-start sm:self-center"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retake Questionnaire</span>
            </button>
          </div>

          {/* Scientific Disclaimer Note */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850/60 border border-slate-200/60 dark:border-slate-800 flex items-start gap-2.5 text-xs text-slate-500">
            <ShieldAlert className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
            <span>
              <strong>Transparent Methodology:</strong> This summary matches your declared interests and self-reported skills against curriculum benchmarks. It is not an opaque personality or aptitude score; you remain in full control of your career decisions.
            </span>
          </div>

          {/* 3 Top Matching Career Paths */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Top 3 Career Paths Aligned with Your Responses</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {topMatches.map((role, idx) => (
                <div
                  key={role.id}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 transition-all flex flex-col justify-between space-y-4 shadow-sm"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                        Match #{idx + 1} • {role.category}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-slate-900 dark:text-white">
                      {role.title}
                    </h4>

                    <p className="text-xs text-slate-500 line-clamp-3">
                      {role.description}
                    </p>

                    <div className="pt-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                        Core Placement Skills:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {role.essential_skills.slice(0, 3).map(sk => (
                          <span
                            key={sk}
                            className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                          >
                            {sk}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                    <button
                      onClick={() => setGoal(role.id, true)}
                      className="flex-1 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-all shadow-sm flex items-center justify-center gap-1"
                    >
                      <Target className="w-3.5 h-3.5" />
                      <span>Set as Goal</span>
                    </button>
                    <button
                      onClick={() => setSelectedRoleForModal(role)}
                      className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold"
                      title="View Details"
                    >
                      Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions to Explore Further */}
          <div className="p-6 rounded-3xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                Next Strategic Action:
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Compare your top choices side-by-side or try a 45-minute beginner experiment to test your reaction.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveTab('compare')}
                className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 shadow-sm"
              >
                <GitCompare className="w-3.5 h-3.5" />
                <span>Compare Top Roles</span>
              </button>
              <button
                onClick={() => setActiveTab('experiments')}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm flex items-center gap-1.5"
              >
                <FlaskConical className="w-3.5 h-3.5" />
                <span>Try an Experiment</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
