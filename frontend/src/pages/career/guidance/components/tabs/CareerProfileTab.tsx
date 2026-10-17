import React, { useState } from 'react';
import { useGuidance } from '../../context/GuidanceContext';
import {
  User,
  GraduationCap,
  Code2,
  Briefcase,
  Clock,
  Target,
  Sparkles,
  Save,
  CheckCircle2,
  ShieldCheck,
  AlertCircle,
  Plus,
  X,
  Building2,
  BookOpen
} from 'lucide-react';

export const CareerProfileTab: React.FC = () => {
  const { profile, updateProfile, setActiveTab } = useGuidance();

  const [formData, setFormData] = useState({ ...profile });
  const [newInterestInput, setNewInterestInput] = useState('');
  const [newActivityInput, setNewActivityInput] = useState('');
  const [newDislikedInput, setNewDislikedInput] = useState('');
  const [newSkillInput, setNewSkillInput] = useState('');
  const [newCompanyInput, setNewCompanyInput] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const addTag = (field: keyof typeof formData, value: string, setter: (val: string) => void) => {
    if (!value.trim()) return;
    const currentList = (formData[field] as string[]) || [];
    if (!currentList.includes(value.trim())) {
      setFormData({ ...formData, [field]: [...currentList, value.trim()] });
    }
    setter('');
  };

  const removeTag = (field: keyof typeof formData, itemToRemove: string) => {
    const currentList = (formData[field] as string[]) || [];
    setFormData({ ...formData, [field]: currentList.filter(item => item !== itemToRemove) });
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 text-xs font-semibold mb-2">
            <User className="w-3.5 h-3.5" />
            <span>Contextual Profile for AI Counselling</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            My Career & Preparation Profile
          </h2>
          <p className="text-xs text-slate-500 max-w-xl mt-1">
            We prefill details from your Placement Hub profile. Edit your preferences, constraints, and priorities below so your recommendations stay accurate.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md flex items-center gap-2 self-start sm:self-center transition-all active:scale-95"
        >
          <Save className="w-4 h-4" />
          <span>Save Profile Updates</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Your career profile has been updated! Recommendations have recalculated automatically.</span>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Academic Context (Imported from Placement Hub) */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Academic Context
              </h3>
            </div>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
              Imported from Placement Hub
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Degree & Branch
              </label>
              <input
                type="text"
                disabled
                value={formData.degree || ''}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-500 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Batch & Graduation Year
              </label>
              <input
                type="text"
                disabled
                value={`${formData.batch || ''} (Graduating ${formData.graduation_year || ''})`}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-500 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Current CGPA
              </label>
              <input
                type="text"
                disabled
                value={`${formData.cgpa || 8.50} / 10.0`}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-500 cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Current Skills & Evidence */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Technical & Analytical Skills
              </h3>
            </div>
            <div className="flex items-center gap-3 text-[11px]">
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" /> Verified Competence
              </span>
              <span className="flex items-center gap-1 text-slate-500">
                <span className="w-2 h-2 rounded-full bg-slate-400" /> Self-Reported
              </span>
            </div>
          </div>

          {/* Skills Badges */}
          <div className="flex flex-wrap gap-2">
            {formData.technical_skills?.map(skill => {
              const isVerified = formData.verified_skills?.includes(skill);
              return (
                <div
                  key={skill}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border ${
                    isVerified
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {isVerified && <ShieldCheck className="w-3 h-3 text-emerald-600" />}
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => removeTag('technical_skills', skill)}
                    className="hover:text-red-500 ml-1"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Add skill input */}
          <div className="flex gap-2 max-w-sm pt-1">
            <input
              type="text"
              placeholder="Add skill (e.g. Docker, TypeScript)"
              value={newSkillInput}
              onChange={e => setNewSkillInput(e.target.value)}
              className="flex-1 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
            />
            <button
              type="button"
              onClick={() => addTag('technical_skills', newSkillInput, setNewSkillInput)}
              className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-bold"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Section 3: Career Interests & Working Styles */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Interests, Liked & Disliked Activities
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs">
            {/* Interests */}
            <div className="space-y-2">
              <label className="font-bold text-slate-700 dark:text-slate-300 block">
                Domains of Curiosity
              </label>
              <div className="flex flex-wrap gap-1.5 min-h-[48px]">
                {formData.interests?.map(item => (
                  <span
                    key={item}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-[11px]"
                  >
                    <span>{item}</span>
                    <button type="button" onClick={() => removeTag('interests', item)}>
                      <X className="w-2.5 h-2.5 hover:text-red-500" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. Distributed systems"
                  value={newInterestInput}
                  onChange={e => setNewInterestInput(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
                />
                <button
                  type="button"
                  onClick={() => addTag('interests', newInterestInput, setNewInterestInput)}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Preferred Activities */}
            <div className="space-y-2">
              <label className="font-bold text-slate-700 dark:text-slate-300 block">
                Activities You Enjoy Most
              </label>
              <div className="flex flex-wrap gap-1.5 min-h-[48px]">
                {formData.preferred_activities?.map(item => (
                  <span
                    key={item}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[11px]"
                  >
                    <span>{item}</span>
                    <button type="button" onClick={() => removeTag('preferred_activities', item)}>
                      <X className="w-2.5 h-2.5 hover:text-red-500" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. Designing user flows"
                  value={newActivityInput}
                  onChange={e => setNewActivityInput(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
                />
                <button
                  type="button"
                  onClick={() => addTag('preferred_activities', newActivityInput, setNewActivityInput)}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Disliked Activities */}
            <div className="space-y-2">
              <label className="font-bold text-slate-700 dark:text-slate-300 block">
                Activities to Avoid
              </label>
              <div className="flex flex-wrap gap-1.5 min-h-[48px]">
                {formData.disliked_activities?.map(item => (
                  <span
                    key={item}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800 text-[11px]"
                  >
                    <span>{item}</span>
                    <button type="button" onClick={() => removeTag('disliked_activities', item)}>
                      <X className="w-2.5 h-2.5 hover:text-red-500" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. Sales calls, cold calling"
                  value={newDislikedInput}
                  onChange={e => setNewDislikedInput(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
                />
                <button
                  type="button"
                  onClick={() => addTag('disliked_activities', newDislikedInput, setNewDislikedInput)}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: Constraints & Timeline */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Preparation Constraints & Timeline
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs">
            <div>
              <div className="flex justify-between font-semibold text-slate-700 dark:text-slate-300 mb-1">
                <span>Available Weekly Prep Time:</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-bold">{formData.weekly_hours_available} hrs/week</span>
              </div>
              <input
                type="range"
                min="5"
                max="40"
                step="1"
                value={formData.weekly_hours_available}
                onChange={e => setFormData({ ...formData, weekly_hours_available: Number(e.target.value) })}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Realistic time excluding college classes & exams.
              </span>
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Target Preparation Horizon
              </label>
              <select
                value={formData.preparation_timeline}
                onChange={e => setFormData({ ...formData, preparation_timeline: e.target.value as any })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
              >
                <option value="3 Months">3 Months (Intensive Sprint)</option>
                <option value="6 Months">6 Months (Standard Placement Prep)</option>
                <option value="1 Year">1 Year (Long-term Mastery)</option>
                <option value="Custom">Custom Flexible Pace</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Immediate Priority Focus
              </label>
              <select
                value={formData.immediate_priority}
                onChange={e => setFormData({ ...formData, immediate_priority: e.target.value as any })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
              >
                <option value="Skill Development">Foundational Skill Development</option>
                <option value="Internship">Summer Internship Placement</option>
                <option value="Placement">Final-Year Campus Placement Drive</option>
                <option value="Exploration">Career Direction Exploration</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 5: Target Companies */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <Building2 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Target Dream Companies & Recruiters
            </h3>
          </div>

          <div className="flex flex-wrap gap-2">
            {formData.target_companies?.map(comp => (
              <span
                key={comp}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 text-xs font-semibold"
              >
                <Building2 className="w-3 h-3" />
                <span>{comp}</span>
                <button type="button" onClick={() => removeTag('target_companies', comp)}>
                  <X className="w-3 h-3 hover:text-red-500" />
                </button>
              </span>
            ))}
          </div>

          <div className="flex gap-2 max-w-sm">
            <input
              type="text"
              placeholder="e.g. Atlassian, Adobe, Microsoft"
              value={newCompanyInput}
              onChange={e => setNewCompanyInput(e.target.value)}
              className="flex-1 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
            />
            <button
              type="button"
              onClick={() => addTag('target_companies', newCompanyInput, setNewCompanyInput)}
              className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-bold"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="submit"
            className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md transition-all flex items-center gap-2 active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile Updates</span>
          </button>
        </div>
      </form>
    </div>
  );
};
