import React, { useState } from 'react';
import { CareerTrack, RoadmapSetupPreferences, StartingProficiency, LearningStyle } from '../types/roadmap';
import { useApp } from '../../../../context/AppContext';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  Clock,
  Layers,
  Building2,
  Edit2,
  Info,
  Calendar,
  AlertCircle
} from 'lucide-react';

interface RoadmapSetupWizardProps {
  initialTrack?: CareerTrack | null;
  onGenerate: (prefs: RoadmapSetupPreferences) => Promise<void>;
  onCancel: () => void;
  isGenerating?: boolean;
}

export const RoadmapSetupWizard: React.FC<RoadmapSetupWizardProps> = ({
  initialTrack,
  onGenerate,
  onCancel,
  isGenerating = false
}) => {
  const { studentProfile, skills: appSkills } = useApp();

  // Wizard Multi-Step (1: Academic Profile Confirmation, 2: Career & Proficiency, 3: Schedule & Style, 4: Summary & Generate)
  const [step, setStep] = useState<number>(1);

  // Form State prefilled from real Placement Hub student profile!
  const [targetCareerTitle, setTargetCareerTitle] = useState<string>(
    initialTrack ? initialTrack.title : 'Full-Stack Developer'
  );
  const [specialization, setSpecialization] = useState<string>('');
  const [startingProficiency, setStartingProficiency] = useState<StartingProficiency>('Beginner');
  const [targetTimelineMonths, setTargetTimelineMonths] = useState<number>(6);
  const [weeklyHoursAvailable, setWeeklyHoursAvailable] = useState<number>(15);
  const [learningStyle, setLearningStyle] = useState<LearningStyle>('Guided Practice');
  const [priorityFocus, setPriorityFocus] = useState<string>('Placements & Portfolio');
  const [targetCompaniesInput, setTargetCompaniesInput] = useState<string>('Google, Microsoft, TCS Digital, Cognizant');

  // Known skills prefilled from profile
  const verifiedNames = appSkills.filter(s => s.verified).map(s => s.name);
  const [selectedKnownSkills, setSelectedKnownSkills] = useState<string[]>(verifiedNames);
  const [newSkillInput, setNewSkillInput] = useState<string>('');

  const toggleSkill = (skillName: string) => {
    setSelectedKnownSkills(prev =>
      prev.includes(skillName) ? prev.filter(s => s !== skillName) : [...prev, skillName]
    );
  };

  const addCustomSkill = () => {
    if (newSkillInput.trim() && !selectedKnownSkills.includes(newSkillInput.trim())) {
      setSelectedKnownSkills(prev => [...prev, newSkillInput.trim()]);
      setNewSkillInput('');
    }
  };

  const handleFinish = async () => {
    const companies = targetCompaniesInput
      .split(',')
      .map(c => c.trim())
      .filter(Boolean);

    const prefs: RoadmapSetupPreferences = {
      career_track_id: initialTrack?.id,
      career_title: targetCareerTitle,
      custom_goal: initialTrack ? undefined : targetCareerTitle,
      specialization: specialization.trim() || undefined,
      starting_proficiency: startingProficiency,
      target_timeline_months: targetTimelineMonths,
      weekly_hours_available: weeklyHoursAvailable,
      learning_style: learningStyle,
      priority_focus: priorityFocus,
      target_companies: companies,
      already_known_skills: selectedKnownSkills
    };

    await onGenerate(prefs);
  };

  return (
    <div className="max-w-3xl mx-auto rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
      {/* Wizard Header */}
      <div className="p-6 sm:p-8 bg-gradient-to-r from-brand-600 to-indigo-700 text-white relative">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider bg-white/20 px-3 py-0.5 rounded-full backdrop-blur-md">
            Step {step} of 4 • Personalized Roadmap Setup
          </span>
          <span className="text-xs text-brand-200">
            {step === 1 && 'Confirm Academic Foundation'}
            {step === 2 && 'Proficiency & Specialization'}
            {step === 3 && 'Schedule & Pace'}
            {step === 4 && 'Review & Generate'}
          </span>
        </div>

        <h2 className="text-xl sm:text-2xl font-black text-white">
          {initialTrack ? `Configure: ${initialTrack.title}` : 'Build Custom Career Roadmap'}
        </h2>
        <p className="text-xs text-brand-100 mt-1 max-w-xl">
          We have prefilled your credentials directly from your student profile so you never re-enter verified data.
        </p>

        {/* Stepper Progress Bar */}
        <div className="mt-4 grid grid-cols-4 gap-2">
          {[1, 2, 3, 4].map(s => (
            <div
              key={s}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                s <= step ? 'bg-white' : 'bg-white/25'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Body Steps */}
      <div className="p-6 sm:p-8 space-y-6">
        {/* STEP 1: Academic & Skills Confirmation */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-500" />
                1. Academic Profile Confirmation
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Verified student profile details from D.Y. Patil College of Engineering records.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-850/60 border border-slate-200 dark:border-slate-800 text-xs">
              <div>
                <span className="text-slate-400 block font-semibold">Student Name & Roll No</span>
                <span className="font-bold text-slate-900 dark:text-white text-sm">
                  {studentProfile?.name || 'Bhumit Gupta'} ({studentProfile?.rollNo || '21CS1044'})
                </span>
              </div>

              <div>
                <span className="text-slate-400 block font-semibold">Degree & Department</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {studentProfile?.degree || 'B.Tech'} — {studentProfile?.department || 'Computer Science & Engineering'}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block font-semibold">Batch & Graduation Year</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {studentProfile?.batch || '2022 - 2026'} (Graduating {studentProfile?.graduationYear || 2026})
                </span>
              </div>

              <div>
                <span className="text-slate-400 block font-semibold">Current CGPA & Standing</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {studentProfile?.cgpa || 8.84} CGPA • Eligible for Campus Placement
                </span>
              </div>
            </div>

            {/* Existing Skills Checklist */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                Select skills you already know (Roadmap will adjust to skip redundant basics):
              </label>

              <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-3 rounded-xl bg-slate-50 dark:bg-slate-850/40 border border-slate-200 dark:border-slate-800">
                {appSkills.map(skill => {
                  const isSelected = selectedKnownSkills.includes(skill.name);
                  return (
                    <button
                      type="button"
                      key={skill.id}
                      onClick={() => toggleSkill(skill.name)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center space-x-1.5 ${
                        isSelected
                          ? 'bg-emerald-600 text-white shadow-xs shadow-emerald-600/30'
                          : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-slate-400'
                      }`}
                    >
                      {skill.verified && <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />}
                      <span>{skill.name}</span>
                      {isSelected && <CheckCircle2 className="w-3 h-3 text-white" />}
                    </button>
                  );
                })}
              </div>

              {/* Add custom skill chip */}
              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="text"
                  placeholder="Add another skill (e.g. Docker, Python, Figma)"
                  value={newSkillInput}
                  onChange={e => setNewSkillInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addCustomSkill())}
                  className="px-3 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 flex-1"
                />
                <button
                  type="button"
                  onClick={addCustomSkill}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Career, Specialization & Starting Proficiency */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-brand-600" />
                2. Target Goal & Starting Proficiency
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Tailor your curriculum pacing based on your current practical comfort level.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Target Career Track
                </label>
                <input
                  type="text"
                  value={targetCareerTitle}
                  onChange={e => setTargetCareerTitle(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-semibold"
                  placeholder="e.g. Full-Stack Developer, AI/ML Engineer"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Optional Specialization / Niche Focus
                </label>
                <input
                  type="text"
                  value={specialization}
                  onChange={e => setSpecialization(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                  placeholder="e.g. Distributed Cloud Systems, FinTech UI, RAG Pipelines (Optional)"
                />
              </div>

              {/* Starting Proficiency Level Selector */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
                  Current Proficiency in this domain:
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    {
                      id: 'Beginner' as StartingProficiency,
                      title: 'Beginner',
                      desc: 'Starting from fundamental syntax and core concepts.'
                    },
                    {
                      id: 'Intermediate' as StartingProficiency,
                      title: 'Intermediate',
                      desc: 'Familiar with syntax, built small projects, ready for system depth.'
                    },
                    {
                      id: 'Advanced' as StartingProficiency,
                      title: 'Advanced',
                      desc: 'Comfortable with architectures; focusing on production polish and DSA.'
                    }
                  ].map(lvl => (
                    <div
                      key={lvl.id}
                      onClick={() => setStartingProficiency(lvl.id)}
                      className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                        startingProficiency === lvl.id
                          ? 'border-brand-600 bg-brand-50/50 dark:bg-brand-950/40 text-brand-900 dark:text-brand-100 shadow-xs'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                      }`}
                    >
                      <h4 className="font-bold text-xs">{lvl.title}</h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                        {lvl.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Timeline, Availability & Learning Style */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-brand-600" />
                3. Pacing, Commitment & Learning Style
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Configure realistic study hours. Planning timelines are targets, not rigid guarantees.
              </p>
            </div>

            <div className="space-y-5">
              {/* Target Timeline Options */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
                  Target Preparation Timeline:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { months: 1, label: '1 Month', sub: 'Intensive Sprint' },
                    { months: 3, label: '3 Months', sub: 'Quarterly Track' },
                    { months: 6, label: '6 Months', sub: 'Recommended' },
                    { months: 12, label: '12 Months', sub: 'Full Year Mastery' }
                  ].map(opt => (
                    <button
                      type="button"
                      key={opt.months}
                      onClick={() => setTargetTimelineMonths(opt.months)}
                      className={`p-3 rounded-xl border text-center transition-all ${
                        targetTimelineMonths === opt.months
                          ? 'border-brand-600 bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 font-bold shadow-xs'
                          : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                      }`}
                    >
                      <span className="block text-sm font-extrabold">{opt.label}</span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">{opt.sub}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Weekly Hours Slider */}
              <div className="space-y-2 p-4 rounded-xl bg-slate-50 dark:bg-slate-850/50 border border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-700 dark:text-slate-300">Available Effort per Week:</span>
                  <span className="text-brand-600 dark:text-brand-400 text-sm">{weeklyHoursAvailable} Hours/Week (~{Math.round(weeklyHoursAvailable / 7 * 10) / 10} hrs/day)</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="40"
                  step="5"
                  value={weeklyHoursAvailable}
                  onChange={e => setWeeklyHoursAvailable(Number(e.target.value))}
                  className="w-full accent-brand-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>5 hrs (Casual)</span>
                  <span>15 hrs (Balanced)</span>
                  <span>40 hrs (Full-time)</span>
                </div>
              </div>

              {/* Preferred Learning Style */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
                  Preferred Learning Approach:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'Guided Practice' as LearningStyle, title: 'Guided Practice' },
                    { id: 'Project-First' as LearningStyle, title: 'Project-First' },
                    { id: 'Videos' as LearningStyle, title: 'Video Tutorials' },
                    { id: 'Reading' as LearningStyle, title: 'Documentation & Books' }
                  ].map(style => (
                    <button
                      type="button"
                      key={style.id}
                      onClick={() => setLearningStyle(style.id)}
                      className={`p-2.5 rounded-xl border text-xs font-bold transition-all text-center ${
                        learningStyle === style.id
                          ? 'border-brand-600 bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300 shadow-xs'
                          : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {style.title}
                    </button>
                  ))}
                </div>
              </div>

              {/* Target Companies */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Target Companies (Optional):
                </label>
                <input
                  type="text"
                  value={targetCompaniesInput}
                  onChange={e => setTargetCompaniesInput(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                  placeholder="e.g. Google, Microsoft, Infosys, Amazon, Persistent"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Review Summary & Generate */}
        {step === 4 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-brand-600" />
                4. Verify Settings & Generate Roadmap
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Please review your configuration. You can modify these settings anytime from your roadmap overview.
              </p>
            </div>

            <div className="space-y-3 p-5 rounded-2xl bg-slate-50 dark:bg-slate-850/70 border border-slate-200 dark:border-slate-800 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-200 dark:border-slate-800">
                <span className="text-slate-500">Selected Goal:</span>
                <span className="font-bold text-slate-900 dark:text-white">{targetCareerTitle}</span>
              </div>

              {specialization && (
                <div className="flex justify-between py-1.5 border-b border-slate-200 dark:border-slate-800">
                  <span className="text-slate-500">Specialization:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{specialization}</span>
                </div>
              )}

              <div className="flex justify-between py-1.5 border-b border-slate-200 dark:border-slate-800">
                <span className="text-slate-500">Starting Proficiency:</span>
                <span className="font-bold text-brand-600 dark:text-brand-400">{startingProficiency}</span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-slate-200 dark:border-slate-800">
                <span className="text-slate-500">Target Timeline:</span>
                <span className="font-bold text-slate-900 dark:text-white">{targetTimelineMonths} Months</span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-slate-200 dark:border-slate-800">
                <span className="text-slate-500">Weekly Availability:</span>
                <span className="font-bold text-slate-900 dark:text-white">{weeklyHoursAvailable} Hours/Week</span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-slate-200 dark:border-slate-800">
                <span className="text-slate-500">Learning Approach:</span>
                <span className="font-bold text-slate-900 dark:text-white">{learningStyle}</span>
              </div>

              <div className="flex justify-between py-1.5">
                <span className="text-slate-500">Prior Recognized Skills:</span>
                <span className="font-bold text-slate-900 dark:text-white">{selectedKnownSkills.length} Verified Skills</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/70 dark:border-amber-800/40 text-xs text-amber-900 dark:text-amber-300 flex items-start space-x-2.5">
              <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <p>
                <strong>Important Notice:</strong> Target durations and schedules are realistic planning benchmarks tailored for structured campus preparation, not a contractual guarantee of hiring or placement.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Footer Navigation Buttons */}
      <div className="p-5 sm:p-6 bg-slate-50 dark:bg-slate-850/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
        {step > 1 ? (
          <button
            type="button"
            onClick={() => setStep(prev => prev - 1)}
            disabled={isGenerating}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors flex items-center space-x-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={onCancel}
            disabled={isGenerating}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
        )}

        {step < 4 ? (
          <button
            type="button"
            onClick={() => setStep(prev => prev + 1)}
            className="px-6 py-2 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-md shadow-brand-600/20 transition-all flex items-center space-x-2"
          >
            <span>Next Step</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleFinish}
            disabled={isGenerating}
            className="px-7 py-2.5 rounded-xl text-xs font-extrabold bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white shadow-lg shadow-brand-600/30 transition-all flex items-center space-x-2 disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isGenerating ? 'Synthesizing Roadmap…' : 'Generate My Roadmap'}</span>
          </button>
        )}
      </div>
    </div>
  );
};
