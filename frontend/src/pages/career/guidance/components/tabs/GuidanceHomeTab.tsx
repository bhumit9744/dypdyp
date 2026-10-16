import React, { useState } from 'react';
import { useGuidance } from '../../context/GuidanceContext';
import {
  Sparkles,
  Compass,
  ArrowRight,
  Target,
  FlaskConical,
  GitCompare,
  BarChart3,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Send,
  HelpCircle,
  Lightbulb,
  ExternalLink,
  BookOpen
} from 'lucide-react';

export const GuidanceHomeTab: React.FC = () => {
  const {
    profile,
    primaryGoal,
    alternativeGoals,
    experiments,
    decisionHistory,
    setActiveTab,
    sendCounsellorMessage,
    navigateToRoadmapWithRole,
    setSelectedExperimentForModal
  } = useGuidance();

  const [promptInput, setPromptInput] = useState('');

  const completedExperimentsCount = experiments.filter(e => e.student_progress?.status === 'Completed').length;

  const SUGGESTED_PROMPTS = [
    "I don't know which career to choose.",
    "Help me decide between Full-Stack Development and AI/ML.",
    "I want to prepare for internships.",
    "I have skills but don't know how to use them for placements.",
    "I need a career plan based on my current abilities.",
    "I want to explore careers beyond software development."
  ];

  const handlePromptSelect = (promptText: string) => {
    sendCounsellorMessage(promptText);
    setActiveTab('counsellor');
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptInput.trim()) return;
    sendCounsellorMessage(promptInput);
    setActiveTab('counsellor');
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 p-6 sm:p-8 text-white shadow-xl border border-indigo-800/40">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-indigo-300 animate-pulse" />
            <span>AI Career Counsellor • Personalized Strategic Guidance</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
            Let's find a career direction that works for you.
          </h1>

          <p className="text-sm text-indigo-200/90 leading-relaxed max-w-2xl">
            Explore diverse tech roles, understand your strengths, compare career paths side-by-side, test unfamiliar work with micro-experiments, and turn your decision into a structured placement roadmap.
          </p>

          {/* Prompt Input Form */}
          <form onSubmit={handleFormSubmit} className="pt-2">
            <div className="relative flex items-center max-w-xl">
              <input
                type="text"
                value={promptInput}
                onChange={e => setPromptInput(e.target.value)}
                placeholder="Ask anything (e.g. 'Should I choose Full-Stack or AI/ML for internships?')"
                className="w-full pl-4 pr-12 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 focus:bg-white/20 border border-white/20 text-white placeholder-indigo-200/60 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 backdrop-blur-md transition-all shadow-inner"
              />
              <button
                type="submit"
                className="absolute right-2 p-2 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white transition-all shadow-md active:scale-95"
                title="Send to AI Counsellor"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Quick Starter Chips */}
          <div className="pt-1">
            <span className="text-[11px] font-semibold text-indigo-300/80 block mb-2 uppercase tracking-wider">
              Suggested Questions
            </span>
            <div className="flex flex-wrap gap-2">
              {SUGGESTED_PROMPTS.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handlePromptSelect(prompt)}
                  className="text-xs px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-indigo-100 hover:text-white transition-all text-left flex items-center gap-1.5"
                >
                  <HelpCircle className="w-3 h-3 text-indigo-400 shrink-0" />
                  <span>{prompt}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Ambient subtle background graphic */}
        <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Primary Action Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={() => setActiveTab('discovery')}
          className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500/50 hover:shadow-md transition-all text-left group"
        >
          <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
            <Compass className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-slate-900 dark:text-white block">
            Discover Careers
          </span>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
            6-step guided questionnaire
          </span>
        </button>

        <button
          onClick={() => setActiveTab('recommendations')}
          className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500/50 hover:shadow-md transition-all text-left group"
        >
          <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
            <Lightbulb className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-slate-900 dark:text-white block">
            Personalized Roles
          </span>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
            16 career profiles & fits
          </span>
        </button>

        <button
          onClick={() => setActiveTab('compare')}
          className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500/50 hover:shadow-md transition-all text-left group"
        >
          <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
            <GitCompare className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-slate-900 dark:text-white block">
            Compare Careers
          </span>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
            Side-by-side up to 3 roles
          </span>
        </button>

        <button
          onClick={() => setActiveTab('experiments')}
          className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500/50 hover:shadow-md transition-all text-left group"
        >
          <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
            <FlaskConical className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-slate-900 dark:text-white block">
            Career Experiments
          </span>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
            Try practical 45-min labs
          </span>
        </button>
      </div>

      {/* Main Grid: Current Career Direction & Quick Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: My Current Career Direction */}
        <div className="lg:col-span-2 space-y-4">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  My Current Career Direction
                </h2>
              </div>
              {primaryGoal && (
                <span className="px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Primary Target Active</span>
                </span>
              )}
            </div>

            {primaryGoal ? (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[11px] uppercase tracking-wider font-bold text-indigo-600 dark:text-indigo-400 block mb-0.5">
                      Primary Career Goal
                    </span>
                    <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                      {primaryGoal.career_title}
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Established {new Date(primaryGoal.created_at).toLocaleDateString()}</span>
                      </span>
                      <span>•</span>
                      <span>Status: {primaryGoal.status}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => navigateToRoadmapWithRole(primaryGoal.career_id)}
                      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-all shadow-sm flex items-center gap-1.5"
                    >
                      <Compass className="w-3.5 h-3.5" />
                      <span>Open in Roadmap Planner</span>
                    </button>
                  </div>
                </div>

                {/* Key Reasons Selected */}
                {primaryGoal.selection_reasons.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                      Why You Chose This Goal:
                    </span>
                    <ul className="space-y-1">
                      {primaryGoal.selection_reasons.map((reason, idx) => (
                        <li key={idx} className="text-xs text-slate-600 dark:text-slate-400 flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                          <span>{reason}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Current Uncertainties */}
                {primaryGoal.uncertainties.length > 0 && (
                  <div className="p-3.5 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/40 space-y-1">
                    <span className="text-xs font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                      <span>Current Uncertainties Under Investigation</span>
                    </span>
                    <ul className="space-y-1 pl-5">
                      {primaryGoal.uncertainties.map((unc, idx) => (
                        <li key={idx} className="text-xs text-slate-600 dark:text-slate-400 list-disc">
                          {unc}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Alternate Goals */}
                {alternativeGoals.length > 0 && (
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                      Alternative Exploratory Paths:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {alternativeGoals.map(alt => (
                        <div
                          key={alt.id}
                          className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-300 flex items-center gap-2"
                        >
                          <span className="w-2 h-2 rounded-full bg-slate-400" />
                          <span className="font-semibold">{alt.career_title}</span>
                          <button
                            onClick={() => {
                              setActiveTab('skill-gaps');
                            }}
                            className="text-[10px] text-indigo-600 dark:text-indigo-400 hover:underline ml-1"
                          >
                            Check Gaps
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-8 text-center rounded-2xl bg-slate-50 dark:bg-slate-850 border border-dashed border-slate-300 dark:border-slate-700 space-y-3">
                <Compass className="w-10 h-10 text-slate-400 mx-auto" />
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  No Primary Career Goal Established Yet
                </h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Take the 6-step guided questionnaire or explore personalized recommendations to discover roles that align with your interests.
                </p>
                <div className="flex justify-center gap-2 pt-2">
                  <button
                    onClick={() => setActiveTab('discovery')}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-sm flex items-center gap-1.5"
                  >
                    <span>Start Guided Discovery</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Recommended Next Strategic Actions */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>Recommended Strategic Actions for You</span>
              </h3>
              <button
                onClick={() => setActiveTab('action-plan')}
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
              >
                <span>View Action Plan</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-2.5">
              <div
                onClick={() => setActiveTab('skill-gaps')}
                className="p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-850 dark:hover:bg-slate-800/80 border border-slate-200/70 dark:border-slate-800 flex items-center justify-between cursor-pointer transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center font-bold text-xs">
                    1
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white block">
                      Audit Your Skill Gaps for {primaryGoal?.career_title || 'Software Engineering'}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Compare your verified skills against industry placement benchmarks.
                    </span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </div>

              <div
                onClick={() => setActiveTab('experiments')}
                className="p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-850 dark:hover:bg-slate-800/80 border border-slate-200/70 dark:border-slate-800 flex items-center justify-between cursor-pointer transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center font-bold text-xs">
                    2
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white block">
                      Try a 45-Minute Practical Career Experiment
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Hands-on micro-project to test day-to-day engagement before committing.
                    </span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </div>

              <div
                onClick={() => setActiveTab('compare')}
                className="p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-850 dark:hover:bg-slate-800/80 border border-slate-200/70 dark:border-slate-800 flex items-center justify-between cursor-pointer transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center font-bold text-xs">
                    3
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white block">
                      Compare 2 or 3 Roles Side-by-Side
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Uncover shared skill foundations and distinct interview expectations.
                    </span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Student Profile Quick Summary & Metrics */}
        <div className="space-y-6">
          {/* Quick Metrics Widget */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Counselling Summary
            </h3>

            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800">
                <span className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400 block">
                  {completedExperimentsCount}
                </span>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                  Experiments Done
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800">
                <span className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 block">
                  {decisionHistory.length}
                </span>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                  Decisions Logged
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Academic Year</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{profile.batch} ({profile.graduation_year})</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Weekly Prep Availability</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{profile.weekly_hours_available} hrs/week</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Preparation Horizon</span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400">{profile.preparation_timeline}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Verified Skills Count</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">{profile.verified_skills?.length || 0} Skills</span>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('profile')}
              className="w-full py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-xs transition-all text-center block"
            >
              Edit Career Profile & Constraints
            </button>
          </div>

          {/* Quick Decisions History Sneak Peek */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Recent Career Decisions
              </h3>
              <button
                onClick={() => setActiveTab('decisions')}
                className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
              >
                View History
              </button>
            </div>

            <div className="space-y-2">
              {decisionHistory.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-xl bg-slate-50/70 dark:bg-slate-850/60 border border-slate-200/50 dark:border-slate-800 space-y-1 text-xs"
                >
                  <div className="flex items-center justify-between font-semibold text-slate-800 dark:text-slate-200">
                    <span className="text-indigo-600 dark:text-indigo-400 font-bold">{item.decision_type}</span>
                    <span className="text-[10px] text-slate-400">{new Date(item.timestamp).toLocaleDateString()}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                    {item.explanation}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
