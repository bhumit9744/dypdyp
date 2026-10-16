import React, { useState } from 'react';
import { useGuidance } from '../../context/GuidanceContext';
import {
  Lightbulb,
  Search,
  Filter,
  CheckCircle2,
  ArrowRight,
  GitCompare,
  Target,
  FlaskConical,
  MessageSquare,
  Compass,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

export const RecommendationsTab: React.FC = () => {
  const {
    recommendations,
    roles,
    primaryGoal,
    setGoal,
    comparedRoleIds,
    toggleCompareRole,
    setSelectedRoleForModal,
    setSelectedExperimentForModal,
    experiments,
    sendCounsellorMessage,
    setActiveTab,
    navigateToRoadmapWithRole
  } = useGuidance();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const CATEGORIES = [
    'All',
    'Software Engineering',
    'AI & Data Science',
    'Design & Product',
    'Cloud & Infrastructure',
    'Quality & Testing',
    'Hardware & Systems',
    'Business & Strategy'
  ];

  const filteredRecs = recommendations.filter(rec => {
    const matchesCategory = selectedCategory === 'All' || rec.category === selectedCategory;
    const matchesSearch =
      rec.career_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.existing_skills_matched.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
      rec.important_skill_gaps.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleAskAI = (careerTitle: string) => {
    sendCounsellorMessage(`Can you explain why ${careerTitle} might be a strong fit for my profile, and what the day-to-day work looks like?`);
    setActiveTab('counsellor');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 text-xs font-semibold mb-2">
            <Lightbulb className="w-3.5 h-3.5" />
            <span>Curated Role Catalog & Alignment</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Personalized Career Recommendations
          </h2>
          <p className="text-xs text-slate-500 max-w-xl mt-1">
            Explore 16 supported tech career roles. Each recommendation transparently explains why the role matches your profile and which skill gaps require focused preparation.
          </p>
        </div>

        {/* Comparison Dock Pill */}
        {comparedRoleIds.length > 0 && (
          <button
            onClick={() => setActiveTab('compare')}
            className="px-4 py-2 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs shadow-md flex items-center gap-2 transition-all self-start sm:self-center"
          >
            <GitCompare className="w-4 h-4" />
            <span>Compare Shortlist ({comparedRoleIds.length}/3)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by role title, category, or skill (e.g. React, PyTorch, Docker)..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs px-3 py-1.5 rounded-xl font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Recommendations Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredRecs.map(rec => {
          const isPrimary = primaryGoal?.career_id === rec.career_id;
          const isCompared = comparedRoleIds.includes(rec.career_id);
          const fullRole = roles.find(r => r.id === rec.career_id);

          return (
            <div
              key={rec.career_id}
              className={`p-6 rounded-3xl bg-white dark:bg-slate-900 border transition-all flex flex-col justify-between space-y-5 shadow-sm hover:shadow-md ${
                isPrimary
                  ? 'border-indigo-500 ring-2 ring-indigo-500/20'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              {/* Header */}
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                        {rec.category}
                      </span>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                          rec.badge_tag === 'Top Match'
                            ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                            : rec.badge_tag === 'Promising'
                            ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        {rec.alignment_tier}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <span>{rec.career_title}</span>
                      {isPrimary && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500 text-white font-bold">
                          Primary Goal
                        </span>
                      )}
                    </h3>
                  </div>

                  {/* Compare Checkbox Toggle */}
                  <button
                    onClick={() => toggleCompareRole(rec.career_id)}
                    className={`text-xs px-2.5 py-1 rounded-xl border flex items-center gap-1 font-semibold transition-all ${
                      isCompared
                        ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-300'
                        : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <GitCompare className="w-3.5 h-3.5" />
                    <span>{isCompared ? 'Comparing' : 'Compare'}</span>
                  </button>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {rec.description}
                </p>

                {/* Why worth exploring */}
                <div className="p-3.5 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 text-xs text-slate-600 dark:text-slate-300 space-y-1">
                  <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block">
                    Why This Role Fits Your Profile:
                  </span>
                  <p className="leading-relaxed">
                    {rec.why_worth_exploring}
                  </p>
                </div>

                {/* Skills Grid (Matched vs Gaps) */}
                <div className="grid grid-cols-2 gap-3 text-xs pt-1">
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">
                      Skills Already Present ({rec.existing_skills_matched.length}):
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {rec.existing_skills_matched.length > 0 ? (
                        rec.existing_skills_matched.map(sk => (
                          <span
                            key={sk}
                            className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                          >
                            ✓ {sk}
                          </span>
                        ))
                      ) : (
                        <span className="text-[10px] text-slate-400 italic">None logged yet</span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider block">
                      Key Skill Gaps ({rec.important_skill_gaps.length}):
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {rec.important_skill_gaps.slice(0, 3).map(sk => (
                        <span
                          key={sk}
                          className="text-[10px] px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800"
                        >
                          + {sk}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
                <div className="flex flex-wrap gap-2">
                  {!isPrimary ? (
                    <button
                      onClick={() => setGoal(rec.career_id, true)}
                      className="flex-1 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-sm flex items-center justify-center gap-1.5 transition-all"
                    >
                      <Target className="w-3.5 h-3.5" />
                      <span>Set as Primary Goal</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => navigateToRoadmapWithRole(rec.career_id)}
                      className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-sm flex items-center justify-center gap-1.5 transition-all"
                    >
                      <Compass className="w-3.5 h-3.5" />
                      <span>Open Roadmap Planner</span>
                    </button>
                  )}

                  {fullRole && (
                    <button
                      onClick={() => setSelectedRoleForModal(fullRole)}
                      className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs transition-all"
                    >
                      Details
                    </button>
                  )}

                  <button
                    onClick={() => handleAskAI(rec.career_title)}
                    className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-indigo-50 dark:hover:bg-indigo-950 text-indigo-600 dark:text-indigo-400 transition-all"
                    title="Ask AI about this role"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                  <button
                    onClick={() => {
                      const exp = experiments.find(e => e.id === rec.suggested_experiment_id);
                      if (exp) setSelectedExperimentForModal(exp);
                      else setActiveTab('experiments');
                    }}
                    className="hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1 text-slate-500 font-medium"
                  >
                    <FlaskConical className="w-3 h-3 text-purple-500" />
                    <span>Try Beginner Lab</span>
                  </button>

                  <button
                    onClick={() => navigateToRoadmapWithRole(rec.career_id)}
                    className="hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-medium"
                  >
                    <span>Generate Roadmap</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
