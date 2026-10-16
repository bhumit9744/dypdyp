import React, { useState } from 'react';
import {
  Sliders,
  Sparkles,
  ShieldCheck,
  BarChart3,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  XCircle,
  ExternalLink,
  Check,
  X,
  Edit2,
  RefreshCw,
  Loader2,
  ArrowRight,
  HelpCircle,
  CheckCheck
} from 'lucide-react';
import {
  StylingConfig,
  ClaimVerification,
  ClaimStatus,
  ScoreReport,
  TailoringReport,
  TailoringProposal
} from '../../../types/resume';

interface RightSidebarProps {
  styling: StylingConfig;
  onUpdateStyling: (newStyling: StylingConfig) => void;
  claims: ClaimVerification[];
  scoringReport: ScoreReport;
  onRunGeminiTailor: (targetRole: string, jobDesc: string, company?: string) => Promise<void>;
  isTailoring: boolean;
  tailoringReport: TailoringReport | null;
  onApplyProposals: (acceptedIds: string[], customEdits: Record<string, string>) => Promise<void>;
  availableJobs: { id: string; title: string; companyName: string; description?: string }[];
  defaultRole: string;
}

type RightTab = 'format' | 'tailor' | 'truth' | 'score';

export const RightSidebar: React.FC<RightSidebarProps> = ({
  styling,
  onUpdateStyling,
  claims,
  scoringReport,
  onRunGeminiTailor,
  isTailoring,
  tailoringReport,
  onApplyProposals,
  availableJobs,
  defaultRole
}) => {
  const [activeTab, setActiveTab] = useState<RightTab>('tailor');

  // Tailoring form state
  const [selectedJobId, setSelectedJobId] = useState<string>('');
  const [targetRoleInput, setTargetRoleInput] = useState<string>(defaultRole || 'Software Developer');
  const [targetCompanyInput, setTargetCompanyInput] = useState<string>('');
  const [jobDescriptionInput, setJobDescriptionInput] = useState<string>('');

  // Proposal acceptance state
  const [acceptedProposalIds, setAcceptedProposalIds] = useState<Set<string>>(new Set());
  const [rejectedProposalIds, setRejectedProposalIds] = useState<Set<string>>(new Set());
  const [editingProposalId, setEditingProposalId] = useState<string | null>(null);
  const [customEdits, setCustomEdits] = useState<Record<string, string>>({});
  const [isApplying, setIsApplying] = useState(false);

  // Truth claim filter
  const [claimFilter, setClaimFilter] = useState<string>('all');

  const handleSelectJob = (jobId: string) => {
    setSelectedJobId(jobId);
    const found = availableJobs.find((j) => j.id === jobId);
    if (found) {
      setTargetRoleInput(found.title);
      setTargetCompanyInput(found.companyName);
      if (found.description) setJobDescriptionInput(found.description);
    }
  };

  const handleTriggerTailor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobDescriptionInput.trim()) return;
    await onRunGeminiTailor(targetRoleInput, jobDescriptionInput, targetCompanyInput);
    // Auto-accept proposals initially for user convenience
    if (tailoringReport) {
      const allIds = new Set(tailoringReport.tailoring_proposals.map((p) => p.id));
      setAcceptedProposalIds(allIds);
    }
  };

  const toggleAcceptProposal = (id: string) => {
    const newAccepted = new Set(acceptedProposalIds);
    const newRejected = new Set(rejectedProposalIds);

    if (newAccepted.has(id)) {
      newAccepted.delete(id);
      newRejected.add(id);
    } else {
      newAccepted.add(id);
      newRejected.delete(id);
    }
    setAcceptedProposalIds(newAccepted);
    setRejectedProposalIds(newRejected);
  };

  const handleApplyAllAccepted = async () => {
    setIsApplying(true);
    try {
      await onApplyProposals(Array.from(acceptedProposalIds), customEdits);
    } finally {
      setIsApplying(false);
    }
  };

  const accentColors = [
    { label: 'Indigo', value: '#4f46e5' },
    { label: 'Blue', value: '#2563eb' },
    { label: 'Teal', value: '#0f766e' },
    { label: 'Purple', value: '#7c3aed' },
    { label: 'Slate', value: '#334155' },
    { label: 'Orange', value: '#ea580c' }
  ];

  const getStatusBadge = (status: ClaimStatus) => {
    switch (status) {
      case 'Supported by linked evidence':
        return {
          bg: 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
          icon: CheckCircle2
        };
      case 'Partially supported':
        return {
          bg: 'bg-blue-50 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800',
          icon: AlertCircle
        };
      case 'Student-confirmed':
        return {
          bg: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border-slate-200',
          icon: Check
        };
      case 'Conflicting evidence':
        return {
          bg: 'bg-red-50 text-red-800 dark:bg-red-950/60 dark:text-red-300 border-red-200 dark:border-red-800',
          icon: XCircle
        };
      case 'Unverified':
      default:
        return {
          bg: 'bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800',
          icon: AlertTriangle
        };
    }
  };

  const filteredClaims = claims.filter((c) => {
    if (claimFilter === 'all') return true;
    return c.status === claimFilter;
  });

  return (
    <aside className="w-88 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 flex flex-col shrink-0 select-none no-print">
      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 p-1.5 gap-1 bg-slate-50 dark:bg-slate-950/40">
        <button
          onClick={() => setActiveTab('tailor')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${
            activeTab === 'tailor'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          AI Tailor
        </button>
        <button
          onClick={() => setActiveTab('truth')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${
            activeTab === 'truth'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          Verification
        </button>
        <button
          onClick={() => setActiveTab('score')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${
            activeTab === 'score'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          Scorecard
        </button>
        <button
          onClick={() => setActiveTab('format')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${
            activeTab === 'format'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          Format
        </button>
      </div>

      {/* Tab 1: AI Job Tailoring (Requirement 4) */}
      {activeTab === 'tailor' && (
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="space-y-1">
            <h3 className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              Gemini Job Tailoring Engine
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              Google Gemini matches your genuine evidence against job descriptions. Never fabricates credentials or experience.
            </p>
          </div>

          <form onSubmit={handleTriggerTailor} className="space-y-2.5 text-xs">
            {availableJobs.length > 0 && (
              <div>
                <label className="text-[10px] font-medium text-slate-500 block mb-1">
                  Load Verified Campus Drive Opening
                </label>
                <select
                  value={selectedJobId}
                  onChange={(e) => handleSelectJob(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-1.5 text-xs outline-none"
                >
                  <option value="">-- Choose Opening (Optional) --</option>
                  {availableJobs.map((j) => (
                    <option key={j.id} value={j.id}>
                      {j.title} ({j.companyName})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="text-[10px] font-medium text-slate-500 block mb-1">
                Target Role & Company
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Target Role"
                  value={targetRoleInput}
                  onChange={(e) => setTargetRoleInput(e.target.value)}
                  className="w-1/2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-1.5 text-xs outline-none"
                />
                <input
                  type="text"
                  placeholder="Company"
                  value={targetCompanyInput}
                  onChange={(e) => setTargetCompanyInput(e.target.value)}
                  className="w-1/2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-1.5 text-xs outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-medium text-slate-500 block mb-1">
                Job Description Text
              </label>
              <textarea
                rows={4}
                placeholder="Paste requirements, preferred skills, and role expectations..."
                value={jobDescriptionInput}
                onChange={(e) => setJobDescriptionInput(e.target.value)}
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-xs outline-none resize-y"
              />
            </div>

            <button
              type="submit"
              disabled={isTailoring || !jobDescriptionInput.trim()}
              className="w-full py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-50 transition-all"
            >
              {isTailoring ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Analyzing with Gemini...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Analyze & Generate Proposals</span>
                </>
              )}
            </button>
          </form>

          {/* Tailoring Results & Proposals Review */}
          {tailoringReport && (
            <div className="space-y-3 pt-3 border-t border-slate-200 dark:border-slate-800">
              {/* Match Overview */}
              <div className="p-3 rounded-xl bg-purple-50/60 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-purple-950 dark:text-purple-200">
                    Role Match Fit
                  </span>
                  <span className="font-extrabold text-purple-700 dark:text-purple-400">
                    {tailoringReport.qualification_match.match_percentage}%
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-purple-200 dark:bg-purple-900 overflow-hidden">
                  <div
                    className="h-full bg-purple-600 rounded-full transition-all duration-500"
                    style={{ width: `${tailoringReport.qualification_match.match_percentage}%` }}
                  />
                </div>

                {/* Matched vs Missing */}
                <div className="text-[11px] space-y-1 pt-1">
                  <div>
                    <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                      Matched:
                    </span>{' '}
                    <span className="text-slate-600 dark:text-slate-300">
                      {tailoringReport.qualification_match.matched_skills.join(', ') || 'None'}
                    </span>
                  </div>
                  {tailoringReport.qualification_match.missing_skills.length > 0 && (
                    <div>
                      <span className="font-semibold text-amber-700 dark:text-amber-400">
                        Missing Requirements:
                      </span>{' '}
                      <span className="text-slate-600 dark:text-slate-300">
                        {tailoringReport.qualification_match.missing_skills.join(', ')}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Proposals Review Section */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-900 dark:text-white">
                    Proposed Changes ({tailoringReport.tailoring_proposals.length})
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {acceptedProposalIds.size} accepted
                  </span>
                </div>

                {tailoringReport.tailoring_proposals.map((prop) => {
                  const isAccepted = acceptedProposalIds.has(prop.id);
                  const isEditingThis = editingProposalId === prop.id;
                  const currentSuggested = customEdits[prop.id] || prop.suggested_text;

                  return (
                    <div
                      key={prop.id}
                      className={`p-3 rounded-xl border text-xs space-y-2 transition-all ${
                        isAccepted
                          ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800'
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                          {prop.section} • {prop.proposal_type.replace('_', ' ')}
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => setEditingProposalId(isEditingThis ? null : prop.id)}
                            className="p-1 rounded text-slate-500 hover:text-slate-800"
                            title="Edit suggested text manually"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => toggleAcceptProposal(prop.id)}
                            className={`px-2 py-0.5 rounded text-[10px] font-semibold flex items-center gap-1 transition-colors ${
                              isAccepted
                                ? 'bg-emerald-600 text-white'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600'
                            }`}
                          >
                            {isAccepted ? <Check className="w-3 h-3" /> : null}
                            <span>{isAccepted ? 'Accepted' : 'Accept'}</span>
                          </button>
                        </div>
                      </div>

                      {/* Before and After Comparison */}
                      <div className="space-y-1.5 font-mono text-[11px]">
                        <div className="p-1.5 rounded bg-red-50/60 dark:bg-red-950/30 text-red-700 dark:text-red-300 border border-red-100 dark:border-red-900/60">
                          <span className="font-bold text-[9px] block uppercase text-red-500">
                            Original:
                          </span>
                          {prop.original_text}
                        </div>
                        <div className="p-1.5 rounded bg-emerald-50/60 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-900/60">
                          <span className="font-bold text-[9px] block uppercase text-emerald-500">
                            Suggested Improvement:
                          </span>
                          {isEditingThis ? (
                            <textarea
                              rows={3}
                              value={currentSuggested}
                              onChange={(e) =>
                                setCustomEdits({ ...customEdits, [prop.id]: e.target.value })
                              }
                              className="w-full bg-white dark:bg-slate-900 border rounded p-1 text-xs text-slate-900 dark:text-white"
                            />
                          ) : (
                            currentSuggested
                          )}
                        </div>
                      </div>

                      <div className="text-[10px] text-slate-500 italic">
                        Reason: {prop.reasoning}
                      </div>
                    </div>
                  );
                })}

                <button
                  onClick={handleApplyAllAccepted}
                  disabled={isApplying || acceptedProposalIds.size === 0}
                  className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-50"
                >
                  {isApplying ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Applying Changes...</span>
                    </>
                  ) : (
                    <>
                      <CheckCheck className="w-3.5 h-3.5" />
                      <span>Apply {acceptedProposalIds.size} Approved Changes</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Signature Truth Verification (Requirement 5) */}
      {activeTab === 'truth' && (
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <div className="space-y-1">
            <h3 className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Truth Verification Engine
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              Every bullet, skill, and metric is verified against your authentic code repositories, assessments, and college records.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-1 text-[10px]">
            {['all', 'Supported by linked evidence', 'Partially supported', 'Student-confirmed', 'Unverified', 'Conflicting evidence'].map(
              (f) => (
                <button
                  key={f}
                  onClick={() => setClaimFilter(f)}
                  className={`px-2 py-0.5 rounded-full border transition-colors ${
                    claimFilter === f
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-transparent font-semibold'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                  }`}
                >
                  {f === 'all' ? 'All Claims' : f.split(' ')[0]}
                </button>
              )
            )}
          </div>

          {/* Claims List */}
          <div className="space-y-2.5">
            {filteredClaims.map((claim) => {
              const badge = getStatusBadge(claim.status);
              const IconComp = badge.icon;

              return (
                <div
                  key={claim.claim_id}
                  className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1.5 text-xs"
                >
                  <div className="flex justify-between items-start gap-2">
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {claim.statement}
                    </span>
                    <span
                      className={`px-1.5 py-0.5 rounded text-[9px] font-bold border flex items-center gap-1 shrink-0 ${badge.bg}`}
                    >
                      <IconComp className="w-2.5 h-2.5" />
                      {claim.status}
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-500 flex items-center gap-1">
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      Source:
                    </span>
                    <span>{claim.evidence_source}</span>
                    {claim.evidence_url && (
                      <a
                        href={claim.evidence_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-brand-600 hover:underline inline-flex items-center ml-1"
                      >
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    )}
                  </div>

                  {claim.limitations && (
                    <div className="p-1.5 rounded bg-slate-50 dark:bg-slate-800/50 text-[10px] text-slate-500 leading-relaxed border border-slate-100 dark:border-slate-800">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        Limitations:
                      </span>{' '}
                      {claim.limitations}
                    </div>
                  )}

                  {claim.recommended_correction && (
                    <div className="p-1.5 rounded bg-amber-50 dark:bg-amber-950/40 text-[10px] text-amber-800 dark:text-amber-300 leading-relaxed border border-amber-200">
                      <span className="font-semibold">Correction:</span>{' '}
                      {claim.recommended_correction}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 3: Transparent Resume Scoring (Requirement 6) */}
      {activeTab === 'score' && (
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="text-center p-4 rounded-2xl bg-gradient-to-b from-slate-50 to-white dark:from-slate-800/40 dark:to-slate-900 border border-slate-200 dark:border-slate-800">
            <div className="text-3xl font-black text-slate-900 dark:text-white">
              {scoringReport.overall_score}
              <span className="text-sm font-semibold text-slate-400">/100</span>
            </div>
            <div className="text-xs font-semibold text-slate-600 dark:text-slate-300 mt-1">
              Quality & Evidence Score
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              Deterministic rubric across 7 documented categories
            </div>
          </div>

          {/* 7-Category Rubric Breakdown */}
          <div className="space-y-2.5">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Score Breakdown
            </span>
            {Object.entries(scoringReport.breakdown || {}).map(([key, item]) => {
              const pct = (item.score / item.max) * 100;
              return (
                <div key={key} className="space-y-1 text-xs">
                  <div className="flex justify-between items-baseline">
                    <span className="font-medium text-slate-800 dark:text-slate-200">
                      {item.label}
                    </span>
                    <span className="font-mono text-slate-500">
                      {item.score}/{item.max}
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-brand-600 rounded-full"
                      style={{ width: `${Math.min(100, Math.max(0, pct))}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Actionable Improvement Checklist */}
          {scoringReport.improvement_actions && scoringReport.improvement_actions.length > 0 && (
            <div className="space-y-1.5 pt-2 border-t border-slate-200 dark:border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Score Improvement Actions
              </span>
              <ul className="space-y-1.5 text-xs">
                {scoringReport.improvement_actions.map((act, idx) => (
                  <li
                    key={idx}
                    className="p-2 rounded-lg bg-blue-50/60 dark:bg-blue-950/30 text-blue-900 dark:text-blue-300 border border-blue-100 dark:border-blue-900/60 flex items-start gap-1.5 text-[11px]"
                  >
                    <ArrowRight className="w-3 h-3 text-brand-600 shrink-0 mt-0.5" />
                    <span>{act}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Disclaimer */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-[10px] text-slate-400 leading-relaxed border border-slate-100 dark:border-slate-800">
            {scoringReport.disclaimer}
          </div>
        </div>
      )}

      {/* Tab 4: Formatting Controls */}
      {activeTab === 'format' && (
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
              Typography Font Family
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { id: 'inter', name: 'Inter (Sans)' },
                { id: 'serif', name: 'Merriweather (Serif)' },
                { id: 'mono', name: 'Roboto Mono' },
                { id: 'garamond', name: 'Garamond' }
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => onUpdateStyling({ ...styling, font_family: f.id as any })}
                  className={`p-2 rounded-lg border text-left font-medium transition-colors ${
                    styling.font_family === f.id
                      ? 'border-brand-500 bg-brand-50 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300 font-bold'
                      : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {f.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
              Font Sizing
            </label>
            <div className="flex gap-1.5">
              {['9pt', '10pt', '11pt'].map((s) => (
                <button
                  key={s}
                  onClick={() => onUpdateStyling({ ...styling, font_size: s as any })}
                  className={`flex-1 py-1.5 rounded-lg border font-semibold ${
                    styling.font_size === s
                      ? 'border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
              Line Spacing
            </label>
            <div className="flex gap-1.5">
              {['1.3', '1.4', '1.5'].map((lh) => (
                <button
                  key={lh}
                  onClick={() => onUpdateStyling({ ...styling, line_height: lh as any })}
                  className={`flex-1 py-1.5 rounded-lg border font-semibold ${
                    styling.line_height === lh
                      ? 'border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600'
                  }`}
                >
                  {lh}x
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
              Page Margins
            </label>
            <div className="flex gap-1.5">
              {['compact', 'standard', 'spacious'].map((m) => (
                <button
                  key={m}
                  onClick={() => onUpdateStyling({ ...styling, margins: m as any })}
                  className={`flex-1 py-1.5 rounded-lg border font-semibold capitalize ${
                    styling.margins === m
                      ? 'border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
              Accent Color
            </label>
            <div className="flex items-center gap-2">
              {accentColors.map((c) => (
                <button
                  key={c.value}
                  onClick={() => onUpdateStyling({ ...styling, accent_color: c.value })}
                  style={{ backgroundColor: c.value }}
                  className={`w-7 h-7 rounded-full border-2 transition-transform ${
                    styling.accent_color === c.value
                      ? 'border-slate-900 dark:border-white scale-110 shadow-sm'
                      : 'border-transparent hover:scale-105'
                  }`}
                  title={c.label}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
