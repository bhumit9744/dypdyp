import React, { useState } from 'react';
import { useGuidance } from '../../context/GuidanceContext';
import {
  GitCompare,
  Plus,
  X,
  Target,
  Save,
  CheckCircle2,
  HelpCircle,
  AlertCircle,
  Layers,
  Sparkles,
  BookOpen,
  Code2,
  Briefcase
} from 'lucide-react';

export const CareerComparisonTab: React.FC = () => {
  const {
    roles,
    comparedRoleIds,
    toggleCompareRole,
    removeComparedRole,
    saveComparison,
    setGoal,
    primaryGoal,
    alternativeGoals,
    profile
  } = useGuidance();

  const [personalNotes, setPersonalNotes] = useState('');
  const [attractions, setAttractions] = useState<Record<string, string>>({});
  const [concerns, setConcerns] = useState<Record<string, string>>({});
  const [unansweredQ, setUnansweredQ] = useState('');
  const [questionsList, setQuestionsList] = useState<string[]>([
    'How steep is the DSA cutoff vs project depth in campus technical rounds?',
    'What are typical day-to-day tasks for entry-level associates?'
  ]);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const comparedRoles = roles.filter(r => comparedRoleIds.includes(r.id));

  // Compute shared overlapping skills vs unique skills
  const computeOverlaps = () => {
    if (comparedRoles.length < 2) return { shared: [], unique: {} as Record<string, string[]> };

    const allSkills = comparedRoles.map(r => r.essential_skills);
    const firstSkills = allSkills[0];
    const shared = firstSkills.filter(sk => allSkills.every(sList => sList.includes(sk)));

    const unique: Record<string, string[]> = {};
    comparedRoles.forEach(r => {
      unique[r.id] = r.essential_skills.filter(sk => !shared.includes(sk));
    });

    return { shared, unique };
  };

  const { shared: sharedSkills, unique: uniqueSkills } = computeOverlaps();

  const handleSave = async () => {
    await saveComparison(personalNotes, attractions, concerns);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const addQuestion = () => {
    if (!unansweredQ.trim()) return;
    setQuestionsList([...questionsList, unansweredQ.trim()]);
    setUnansweredQ('');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 text-xs font-semibold mb-2">
            <GitCompare className="w-3.5 h-3.5" />
            <span>Multi-Role Decision Matrix</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Compare Career Options Side-by-Side
          </h2>
          <p className="text-xs text-slate-500 max-w-xl mt-1">
            Compare up to 3 roles simultaneously. Understand day-to-day work, identify overlapping skills you can learn once, and record what attracts or concerns you about each path.
          </p>
        </div>

        {comparedRoles.length >= 2 && (
          <button
            onClick={handleSave}
            className="px-5 py-2.5 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs shadow-md flex items-center gap-2 self-start sm:self-center transition-all active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>Save Comparison Notes</span>
          </button>
        )}
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Your career comparison notes and evaluated trade-offs have been saved to your Decision History!</span>
        </div>
      )}

      {/* Role Selector Badges / Dock */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Selected for Comparison ({comparedRoles.length}/3):
          </span>
          <div className="flex flex-wrap gap-2">
            {comparedRoles.map(role => (
              <span
                key={role.id}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700 text-xs font-semibold"
              >
                <span>{role.title}</span>
                <button onClick={() => removeComparedRole(role.id)} className="hover:text-red-500">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Add more dropdown */}
        {comparedRoles.length < 3 && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Add role:</span>
            <select
              onChange={e => {
                if (e.target.value) toggleCompareRole(e.target.value);
                e.target.value = '';
              }}
              defaultValue=""
              className="text-xs px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200"
            >
              <option value="" disabled>Choose role to add...</option>
              {roles
                .filter(r => !comparedRoleIds.includes(r.id))
                .map(r => (
                  <option key={r.id} value={r.id}>{r.title} ({r.category})</option>
                ))}
            </select>
          </div>
        )}
      </div>

      {comparedRoles.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-700 space-y-3">
          <GitCompare className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            No Roles Selected for Comparison
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Choose 2 or 3 roles from the dropdown above or check the "Compare" box on any card in the Recommendations tab.
          </p>
        </div>
      ) : (
        /* Side-by-Side Comparison Grid */
        <div className="space-y-6">
          {/* Overlapping Foundations Callout */}
          {sharedSkills.length > 0 && (
            <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200/60 dark:border-indigo-900/40 space-y-1.5">
              <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Overlapping Skill Foundations (Learn Once, Apply to Both):</span>
              </span>
              <div className="flex flex-wrap gap-1.5">
                {sharedSkills.map(sk => (
                  <span
                    key={sk}
                    className="text-xs px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-800 text-indigo-800 dark:text-indigo-200 font-semibold"
                  >
                    ★ {sk}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Side-by-Side Columns */}
          <div className={`grid grid-cols-1 ${comparedRoles.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3'} gap-6`}>
            {comparedRoles.map(role => {
              const isPrimary = primaryGoal?.career_id === role.id;
              const isAlternate = alternativeGoals.some(a => a.career_id === role.id);

              return (
                <div
                  key={role.id}
                  className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="space-y-1.5 border-b border-slate-100 dark:border-slate-800 pb-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                          {role.category}
                        </span>
                        <div className="flex items-center gap-1">
                          {isPrimary && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500 text-white font-bold">
                              Primary
                            </span>
                          )}
                          {isAlternate && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold">
                              Alternate
                            </span>
                          )}
                        </div>
                      </div>

                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                        {role.title}
                      </h3>
                      <p className="text-xs text-slate-500 line-clamp-2">
                        {role.description}
                      </p>
                    </div>

                    {/* Day-to-Day */}
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                        Typical Day-to-Day Work:
                      </span>
                      <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                        {role.day_to_day}
                      </p>
                    </div>

                    {/* Essential Skills */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                        Essential Skills Required:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {role.essential_skills.map(sk => (
                          <span
                            key={sk}
                            className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium"
                          >
                            {sk}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Distinct Skills Specific to this Career */}
                    {uniqueSkills[role.id]?.length > 0 && (
                      <div className="space-y-1.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-850/60 border border-slate-200/60 dark:border-slate-800">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-amber-600 dark:text-amber-400 block">
                          Skills Distinct to {role.title}:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {uniqueSkills[role.id].map(sk => (
                            <span
                              key={sk}
                              className="text-[10px] px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800"
                            >
                              • {sk}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Interview Focus & Portfolios */}
                    <div className="grid grid-cols-1 gap-2 pt-1 text-xs">
                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800 space-y-1">
                        <span className="text-[10px] font-bold uppercase text-indigo-600 dark:text-indigo-400 block">
                          Technical Interview Focus
                        </span>
                        <ul className="space-y-0.5 text-slate-600 dark:text-slate-300 text-[11px]">
                          {role.interview_focus.map((item, i) => (
                            <li key={i}>• {item}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800 space-y-1">
                        <span className="text-[10px] font-bold uppercase text-emerald-600 dark:text-emerald-400 block">
                          Recruiter Portfolio Expectations
                        </span>
                        <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                          {role.portfolio_expectations}
                        </p>
                      </div>
                    </div>

                    {/* Personal Attraction & Concerns Inputs */}
                    <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                      <div>
                        <label className="text-[10px] font-bold uppercase text-slate-500 block mb-1">
                          What Attracts Me to {role.title}:
                        </label>
                        <textarea
                          rows={2}
                          placeholder="e.g. Love working on customer-facing interfaces..."
                          value={attractions[role.id] || ''}
                          onChange={e => setAttractions({ ...attractions, [role.id]: e.target.value })}
                          className="w-full px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold uppercase text-slate-500 block mb-1">
                          What Concerns Me:
                        </label>
                        <textarea
                          rows={2}
                          placeholder="e.g. Need to build stronger math/DSA speed..."
                          value={concerns[role.id] || ''}
                          onChange={e => setConcerns({ ...concerns, [role.id]: e.target.value })}
                          className="w-full px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Goal Controls */}
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-2">
                    {!isPrimary && (
                      <button
                        onClick={() => setGoal(role.id, true)}
                        className="flex-1 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-sm flex items-center justify-center gap-1.5 transition-all"
                      >
                        <Target className="w-3.5 h-3.5" />
                        <span>Select as Primary</span>
                      </button>
                    )}
                    {!isAlternate && !isPrimary && (
                      <button
                        onClick={() => setGoal(role.id, false)}
                        className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300"
                      >
                        Add as Alternate
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Unanswered Questions & Synthesis Card */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-amber-600" />
              <span>Unanswered Questions to Clarify Before Committing</span>
            </h3>

            <div className="space-y-2">
              {questionsList.map((q, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850 flex items-center justify-between text-xs text-slate-700 dark:text-slate-300"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    <span>{q}</span>
                  </div>
                  <button
                    onClick={() => setQuestionsList(questionsList.filter((_, i) => i !== idx))}
                    className="text-slate-400 hover:text-red-500"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2 max-w-xl">
              <input
                type="text"
                placeholder="Add another question you need answered (e.g. Which companies hire for this?)"
                value={unansweredQ}
                onChange={e => setUnansweredQ(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
              />
              <button
                onClick={addQuestion}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-bold"
              >
                Add Question
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
