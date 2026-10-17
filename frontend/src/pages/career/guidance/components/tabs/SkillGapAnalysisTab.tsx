import React, { useState } from 'react';
import { useGuidance } from '../../context/GuidanceContext';
import { useApp } from '../../../../../context/AppContext';
import {
  BarChart3,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ShieldCheck,
  ArrowRight,
  BookOpen,
  Code2,
  Bot,
  Plus,
  Compass,
  ExternalLink
} from 'lucide-react';

export const SkillGapAnalysisTab: React.FC = () => {
  const {
    roles,
    profile,
    skillGapSelectedRoleId,
    setSkillGapSelectedRoleId,
    navigateToRoadmapWithRole,
    transferActionToRoadmap
  } = useGuidance();

  const { setCurrentSection, setCurrentSubSection } = useApp();

  const [activeTierFilter, setActiveTierFilter] = useState<'All' | 'Demonstrated' | 'Self-Reported' | 'Needs Development' | 'Not Assessed'>('All');
  const [feedbackMsg, setFeedbackMsg] = useState<{ id: string; msg: string } | null>(null);

  const selectedRole = roles.find(r => r.id === skillGapSelectedRoleId) || roles[0];

  // Verified skills from student profile
  const verifiedSkillSet = new Set((profile.verified_skills || []).map(s => s.toLowerCase()));
  const technicalSkillSet = new Set((profile.technical_skills || []).map(s => s.toLowerCase()));

  // Categorize role skills
  const categorizedSkills = selectedRole.essential_skills.map((skillName, idx) => {
    const sLower = skillName.toLowerCase();
    const isVerified = Array.from(verifiedSkillSet).some(v => v.includes(sLower) || sLower.includes(v));
    const isSelfReported = Array.from(technicalSkillSet).some(t => t.includes(sLower) || sLower.includes(t));

    let tier: 'Demonstrated' | 'Self-Reported' | 'Needs Development' | 'Not Assessed' = 'Needs Development';
    let evidenceText = 'No verified project or assessment record found in profile.';
    let validationAction = 'Complete a practical capstone project or verified skill assessment.';

    if (isVerified) {
      tier = 'Demonstrated';
      evidenceText = 'Verified through campus assessments or completed student projects.';
      validationAction = 'Evidence validated. Ready for technical interview discussions.';
    } else if (isSelfReported) {
      tier = 'Self-Reported';
      evidenceText = 'Listed on your resume / academic profile without third-party assessment.';
      validationAction = 'Take a 20-min campus skill assessment or submit a GitHub repository to verify.';
    } else if (idx === selectedRole.essential_skills.length - 1) {
      tier = 'Not Assessed';
      evidenceText = 'Advanced domain concept. Evaluation pending.';
      validationAction = 'Review documentation and solve introductory interview problems.';
    }

    return {
      id: `sk_${idx}`,
      name: skillName,
      tier,
      why_it_matters: `Frequently probed by recruiters evaluating candidates for ${selectedRole.title}.`,
      evidence: evidenceText,
      validation_suggestion: validationAction,
      practice_activity: `Build an end-to-end practical exercise applying ${skillName} with clean Git commits.`
    };
  });

  const demonstratedCount = categorizedSkills.filter(s => s.tier === 'Demonstrated').length;
  const selfReportedCount = categorizedSkills.filter(s => s.tier === 'Self-Reported').length;
  const needsDevCount = categorizedSkills.filter(s => s.tier === 'Needs Development').length;
  const notAssessedCount = categorizedSkills.filter(s => s.tier === 'Not Assessed').length;
  const totalSkills = categorizedSkills.length;

  const demonstratedPercent = Math.round((demonstratedCount / totalSkills) * 100);
  const selfReportedPercent = Math.round((selfReportedCount / totalSkills) * 100);
  const needsDevPercent = Math.round((needsDevCount / totalSkills) * 100);

  const filteredSkills = categorizedSkills.filter(s => {
    if (activeTierFilter === 'All') return true;
    return s.tier === activeTierFilter;
  });

  const handleTransferToRoadmap = async (skill: typeof categorizedSkills[0]) => {
    const res = await transferActionToRoadmap(skill.id);
    setFeedbackMsg({ id: skill.id, msg: res.message });
    setTimeout(() => setFeedbackMsg(null), 3000);
  };

  const handleRouteToInterview = () => {
    setCurrentSection('career');
    setCurrentSubSection('interview-studio');
  };

  return (
    <div className="space-y-6">
      {/* Header & Role Switcher */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 text-xs font-semibold mb-2">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Profile vs Industry Requirements</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Career Skill-Gap Analysis
          </h2>
          <p className="text-xs text-slate-500 max-w-xl mt-1">
            Audit where your verified abilities meet industry placement benchmarks and which foundational skills to develop next.
          </p>
        </div>

        {/* Role Selector Dropdown */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          <span className="text-xs font-semibold text-slate-500">Target Role:</span>
          <select
            value={skillGapSelectedRoleId}
            onChange={e => setSkillGapSelectedRoleId(e.target.value)}
            className="px-3 py-2 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-xs font-bold shadow-sm"
          >
            {roles.map(r => (
              <option key={r.id} value={r.id}>
                {r.title} ({r.category})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Visual Coverage Bar & Metrics Breakdown */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Skill Coverage Breakdown for {selectedRole.title}
            </h3>
            <span className="text-xs text-slate-500">
              {demonstratedCount} verified of {totalSkills} essential competencies ({demonstratedPercent}%)
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5 text-emerald-600 font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              Demonstrated ({demonstratedCount})
            </span>
            <span className="flex items-center gap-1.5 text-indigo-600 font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
              Self-Reported ({selfReportedCount})
            </span>
            <span className="flex items-center gap-1.5 text-amber-600 font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              Needs Development ({needsDevCount})
            </span>
            <span className="flex items-center gap-1.5 text-slate-400 font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
              Not Assessed ({notAssessedCount})
            </span>
          </div>
        </div>

        {/* Stacked Progress Bar */}
        <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden flex">
          <div
            className="bg-emerald-500 h-full transition-all duration-500"
            style={{ width: `${demonstratedPercent}%` }}
            title={`Demonstrated: ${demonstratedPercent}%`}
          />
          <div
            className="bg-indigo-500 h-full transition-all duration-500"
            style={{ width: `${selfReportedPercent}%` }}
            title={`Self-Reported: ${selfReportedPercent}%`}
          />
          <div
            className="bg-amber-400 h-full transition-all duration-500"
            style={{ width: `${needsDevPercent}%` }}
            title={`Needs Development: ${needsDevPercent}%`}
          />
        </div>

        {/* Honest Representation Notice */}
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850/60 border border-slate-200/60 dark:border-slate-800 text-[11px] text-slate-500 flex items-start gap-2">
          <HelpCircle className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
          <span>
            <strong>Transparency Principle:</strong> Self-reported skills from resumes are not displayed as proven competence until verified via practical projects or campus skill assessments.
          </span>
        </div>
      </div>

      {/* Tier Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {(['All', 'Demonstrated', 'Self-Reported', 'Needs Development', 'Not Assessed'] as const).map(tier => (
          <button
            key={tier}
            onClick={() => setActiveTierFilter(tier)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTierFilter === tier
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            {tier}
          </button>
        ))}
      </div>

      {/* Skills Detail Cards */}
      <div className="space-y-3">
        {filteredSkills.map(skill => {
          const isDemonstrated = skill.tier === 'Demonstrated';
          const isSelf = skill.tier === 'Self-Reported';
          const isNeedsDev = skill.tier === 'Needs Development';

          return (
            <div
              key={skill.id}
              className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 hover:border-slate-300 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                        isDemonstrated
                          ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                          : isSelf
                          ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800'
                          : isNeedsDev
                          ? 'bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {skill.tier}
                    </span>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white">
                      {skill.name}
                    </h4>
                  </div>
                  <p className="text-xs text-slate-500">
                    {skill.why_it_matters}
                  </p>
                </div>

                {/* Status Indicator */}
                <div className="flex items-center gap-2 text-xs">
                  {isDemonstrated ? (
                    <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                      <ShieldCheck className="w-4 h-4" /> Ready for Interview
                    </span>
                  ) : isSelf ? (
                    <span className="flex items-center gap-1 text-indigo-600 font-semibold">
                      <CheckCircle2 className="w-4 h-4" /> Needs Assessment
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-amber-600 font-semibold">
                      <AlertCircle className="w-4 h-4" /> Priority Learning Gap
                    </span>
                  )}
                </div>
              </div>

              {/* Grid: Evidence vs Suggested Validation */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-1">
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850/60 border border-slate-200/60 dark:border-slate-800 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                    Available Evidence:
                  </span>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                    {skill.evidence}
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850/60 border border-slate-200/60 dark:border-slate-800 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-indigo-600 dark:text-indigo-400 tracking-wider block">
                    Recommended Validation & Practice:
                  </span>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                    {skill.validation_suggestion}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <button
                    onClick={() => handleTransferToRoadmap(skill)}
                    className="px-3.5 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900 text-indigo-700 dark:text-indigo-300 font-semibold flex items-center gap-1.5 transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add to Career Roadmap</span>
                  </button>

                  <button
                    onClick={handleRouteToInterview}
                    className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition-all"
                  >
                    <Bot className="w-3.5 h-3.5 text-purple-600" />
                    <span>Practice Interview Studio</span>
                  </button>
                </div>

                {feedbackMsg?.id === skill.id && (
                  <span className="text-xs text-emerald-600 font-bold animate-fade-in">
                    {feedbackMsg.msg}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
