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
  CheckCheck,
  Layers,
  MoveUp,
  MoveDown,
  Copy,
  Archive,
  Plus,
  Users,
  FileText,
  Palette,
  CheckSquare
} from 'lucide-react';
import {
  StylingConfig,
  ClaimVerification,
  ClaimStatus,
  ScoreReport,
  TailoringReport,
  TailoringProposal,
  ResumeVersionSummary,
  AlumniExample
} from '../../../types/resume';

export type RightTab = 'tailor' | 'format' | 'sections' | 'truth' | 'versions';

export interface RightSidebarProps {
  styling: StylingConfig;
  onUpdateStyling: (newStyling: StylingConfig) => void;
  selectedTemplateId: string;
  onSelectTemplate: (templateId: string) => void;
  sectionsOrder: string[];
  onReorderSections: (newOrder: string[]) => void;
  claims: ClaimVerification[];
  scoringReport: ScoreReport;
  onRunGeminiTailor: (targetRole: string, jobDesc: string, company?: string) => Promise<void>;
  isTailoring: boolean;
  tailoringReport: TailoringReport | null;
  onApplyProposals: (acceptedIds: string[], customEdits: Record<string, string>) => Promise<void>;
  availableJobs: { id: string; title: string; companyName: string; description?: string }[];
  defaultRole: string;
  resumes: ResumeVersionSummary[];
  activeResumeId: string;
  onSelectResume: (id: string) => void;
  onCreateNewVersion: (targetRole: string, title: string, templateId: string) => void;
  onDuplicateResume: (id: string) => void;
  onArchiveResume: (id: string) => void;
  onRestoreResume?: (id: string) => void;
  alumniExamples: AlumniExample[];
  onUseAlumniTemplate: (templateId: string) => void;
  activeTab?: RightTab;
  onTabChange?: (tab: RightTab) => void;
}

export const RightSidebar: React.FC<RightSidebarProps> = ({
  styling,
  onUpdateStyling,
  selectedTemplateId,
  onSelectTemplate,
  sectionsOrder,
  onReorderSections,
  claims,
  scoringReport,
  onRunGeminiTailor,
  isTailoring,
  tailoringReport,
  onApplyProposals,
  availableJobs,
  defaultRole,
  resumes,
  activeResumeId,
  onSelectResume,
  onCreateNewVersion,
  onDuplicateResume,
  onArchiveResume,
  onRestoreResume,
  alumniExamples,
  onUseAlumniTemplate,
  activeTab: controlledTab,
  onTabChange
}) => {
  const [internalTab, setInternalTab] = useState<RightTab>('tailor');
  const activeTab = controlledTab !== undefined ? controlledTab : internalTab;

  const handleTabClick = (tab: RightTab) => {
    if (onTabChange) {
      onTabChange(tab);
    } else {
      setInternalTab(tab);
    }
  };

  // Sub-view toggle inside Score & Truth tab
  const [scoreSubTab, setScoreSubTab] = useState<'score' | 'truth'>('score');

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

  // New Version creation state inside Versions tab
  const [isCreatingVersion, setIsCreatingVersion] = useState(false);
  const [newVersionRole, setNewVersionRole] = useState('Backend Engineer');
  const [newVersionTitle, setNewVersionTitle] = useState('');
  const [newVersionTemplate, setNewVersionTemplate] = useState('classic-professional');

  const rolePresets = [
    'Software Developer',
    'Backend Engineer',
    'Frontend Developer',
    'Full-Stack Developer',
    'Data Analyst',
    'AI/ML Engineer',
    'Product Designer',
    'UI/UX Designer',
    'Custom Role'
  ];

  const templatesList = [
    {
      id: 'classic-professional',
      name: 'Classic Professional',
      description: 'Conservative single-column format with maximum ATS compatibility.',
      tag: 'Conservative ATS'
    },
    {
      id: 'modern-minimal',
      name: 'Modern Minimal',
      description: 'Refined typography with generous whitespace for tech startups.',
      tag: 'Clean Sans'
    },
    {
      id: 'technical-ats',
      name: 'Technical ATS',
      description: 'Structured high-density layout optimized for enterprise scanners.',
      tag: 'High Density'
    },
    {
      id: 'software-engineer',
      name: 'Software Engineer',
      description: 'Prioritizes technical skills matrix and code repository links.',
      tag: 'Code First'
    },
    {
      id: 'data-ai',
      name: 'Data & AI',
      description: 'Emphasizes quantitative benchmarks, models, and analytical tools.',
      tag: 'Metrics & Models'
    },
    {
      id: 'creative-professional',
      name: 'Creative Professional',
      description: 'Elegant dual-column hierarchy designed for product and design roles.',
      tag: 'Design & UX'
    }
  ];

  const accentColors = [
    { label: 'Indigo', value: '#4f46e5' },
    { label: 'Blue', value: '#2563eb' },
    { label: 'Teal', value: '#0f766e' },
    { label: 'Purple', value: '#7c3aed' },
    { label: 'Slate', value: '#334155' },
    { label: 'Orange', value: '#ea580c' }
  ];

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

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const title = newVersionTitle.trim() || `${newVersionRole} Resume`;
    onCreateNewVersion(newVersionRole, title, newVersionTemplate);
    setIsCreatingVersion(false);
    setNewVersionTitle('');
  };

  const moveSection = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= sectionsOrder.length) return;
    const newOrder = [...sectionsOrder];
    const [moved] = newOrder.splice(index, 1);
    newOrder.splice(targetIdx, 0, moved);
    onReorderSections(newOrder);
  };

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
    <aside className="w-full h-full bg-white dark:bg-slate-900 flex flex-col select-none no-print overflow-hidden">
      {/* 5-Tab Unified Studio Editor Navigation */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 p-1.5 gap-1 bg-slate-50 dark:bg-slate-950/50 shrink-0">
        <button
          onClick={() => handleTabClick('tailor')}
          title="AI Job Tailoring with Google Gemini"
          className={`flex-1 py-1.5 px-1 text-[11px] font-semibold rounded-lg transition-all flex items-center justify-center gap-1 truncate ${
            activeTab === 'tailor'
              ? 'bg-white dark:bg-slate-800 text-purple-700 dark:text-purple-300 shadow-xs border border-slate-200/60 dark:border-slate-700'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 shrink-0 text-purple-600" />
          <span className="truncate">Tailor</span>
        </button>

        <button
          onClick={() => handleTabClick('format')}
          title="Templates & Visual Styling"
          className={`flex-1 py-1.5 px-1 text-[11px] font-semibold rounded-lg transition-all flex items-center justify-center gap-1 truncate ${
            activeTab === 'format'
              ? 'bg-white dark:bg-slate-800 text-blue-700 dark:text-blue-300 shadow-xs border border-slate-200/60 dark:border-slate-700'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Sliders className="w-3.5 h-3.5 shrink-0 text-blue-600" />
          <span className="truncate">Design</span>
        </button>

        <button
          onClick={() => handleTabClick('sections')}
          title="Section Ordering & Layout Structure"
          className={`flex-1 py-1.5 px-1 text-[11px] font-semibold rounded-lg transition-all flex items-center justify-center gap-1 truncate ${
            activeTab === 'sections'
              ? 'bg-white dark:bg-slate-800 text-indigo-700 dark:text-indigo-300 shadow-xs border border-slate-200/60 dark:border-slate-700'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Layers className="w-3.5 h-3.5 shrink-0 text-indigo-600" />
          <span className="truncate">Sections</span>
        </button>

        <button
          onClick={() => handleTabClick('truth')}
          title="ATS Scorecard & Truth Verification"
          className={`flex-1 py-1.5 px-1 text-[11px] font-semibold rounded-lg transition-all flex items-center justify-center gap-1 truncate ${
            activeTab === 'truth'
              ? 'bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-300 shadow-xs border border-slate-200/60 dark:border-slate-700'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
          <span className="truncate">Score</span>
        </button>

        <button
          onClick={() => handleTabClick('versions')}
          title="Resume Versions & Alumni Examples"
          className={`flex-1 py-1.5 px-1 text-[11px] font-semibold rounded-lg transition-all flex items-center justify-center gap-1 truncate ${
            activeTab === 'versions'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs border border-slate-200/60 dark:border-slate-700'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <FileText className="w-3.5 h-3.5 shrink-0 text-slate-600 dark:text-slate-300" />
          <span className="truncate">Versions</span>
        </button>
      </div>

      {/* ===================================================================
       * TAB 1: AI Job Tailoring
       * =================================================================== */}
      {activeTab === 'tailor' && (
        <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-28">
          <div className="space-y-1">
            <h3 className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              Gemini Job Tailoring Engine
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              Google Gemini matches your genuine evidence against job descriptions. Never fabricates credentials or experience.
            </p>
          </div>

          <form onSubmit={handleTriggerTailor} className="space-y-3 text-xs">
            {availableJobs.length > 0 && (
              <div>
                <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                  Load Verified Campus Drive Opening
                </label>
                <select
                  value={selectedJobId}
                  onChange={(e) => handleSelectJob(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-xs outline-none focus:border-purple-500 transition-colors"
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
              <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                Target Role & Company
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Target Role"
                  value={targetRoleInput}
                  onChange={(e) => setTargetRoleInput(e.target.value)}
                  className="w-1/2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-xs outline-none focus:border-purple-500 transition-colors"
                />
                <input
                  type="text"
                  placeholder="Company"
                  value={targetCompanyInput}
                  onChange={(e) => setTargetCompanyInput(e.target.value)}
                  className="w-1/2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-xs outline-none focus:border-purple-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                Job Description Text
              </label>
              <textarea
                rows={4}
                placeholder="Paste requirements, preferred skills, and role expectations..."
                value={jobDescriptionInput}
                onChange={(e) => setJobDescriptionInput(e.target.value)}
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-xs outline-none resize-y focus:border-purple-500 transition-colors leading-relaxed"
              />
            </div>

            <button
              type="submit"
              disabled={isTailoring || !jobDescriptionInput.trim()}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-50 transition-all cursor-pointer"
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
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-900 dark:text-white">
                  ATS Match Score: {tailoringReport.qualification_match?.match_percentage || 0}%
                </span>
                <span className="text-[10px] text-purple-600 dark:text-purple-400 font-semibold">
                  {tailoringReport.tailoring_proposals.length} Proposals
                </span>
              </div>

              {tailoringReport.qualification_match?.matched_skills && tailoringReport.qualification_match.matched_skills.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {tailoringReport.qualification_match.matched_skills.map((kw: string, i: number) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-full text-[9px] font-semibold bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200 dark:border-purple-800"
                    >
                      ✓ {kw}
                    </span>
                  ))}
                </div>
              )}

              <div className="space-y-3">
                {tailoringReport.tailoring_proposals.map((prop) => {
                  const isAccepted = acceptedProposalIds.has(prop.id);
                  const isEditingThis = editingProposalId === prop.id;
                  const currentSuggested = customEdits[prop.id] !== undefined
                    ? customEdits[prop.id]
                    : prop.suggested_text;

                  return (
                    <div
                      key={prop.id}
                      className={`p-3 rounded-xl border space-y-2 transition-all ${
                        isAccepted
                          ? 'border-emerald-300 dark:border-emerald-700 bg-emerald-50/20 dark:bg-emerald-950/20'
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60'
                      }`}
                    >
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="font-bold uppercase tracking-wider text-slate-400">
                          {prop.section} Section
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() =>
                              setEditingProposalId(isEditingThis ? null : prop.id)
                            }
                            className="p-1 hover:text-slate-800 dark:hover:text-slate-200 rounded"
                            title="Edit proposal text"
                          >
                            <Edit2 className="w-3 h-3 text-slate-400" />
                          </button>
                          <button
                            onClick={() => toggleAcceptProposal(prop.id)}
                            className={`px-2 py-0.5 rounded font-semibold transition-colors flex items-center gap-1 ${
                              isAccepted
                                ? 'bg-emerald-600 text-white'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                            }`}
                          >
                            {isAccepted ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                            <span>{isAccepted ? 'Accepted' : 'Declined'}</span>
                          </button>
                        </div>
                      </div>

                      <div className="space-y-1.5 text-[11px]">
                        <div className="p-1.5 rounded bg-slate-50 dark:bg-slate-800/50 text-slate-500 line-through">
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
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-50 transition-colors"
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

      {/* ===================================================================
       * TAB 2: Design & Format (Templates + Typography + Colors)
       * =================================================================== */}
      {activeTab === 'format' && (
        <div className="flex-1 overflow-y-auto p-4 space-y-5 pb-28 text-xs">
          {/* Templates Switcher */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Resume Template Layout
              </label>
              <span className="text-[10px] text-brand-600 font-semibold">
                6 Verified Styles
              </span>
            </div>
            <div className="space-y-2">
              {templatesList.map((tpl) => {
                const isSelected = tpl.id === selectedTemplateId;
                return (
                  <div
                    key={tpl.id}
                    onClick={() => onSelectTemplate(tpl.id)}
                    className={`p-2.5 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-brand-50/70 dark:bg-brand-950/50 border-brand-500 shadow-xs'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-0.5">
                      <span className="font-bold text-xs text-slate-900 dark:text-white">
                        {tpl.name}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[9px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {tpl.tag}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                      {tpl.description}
                    </p>
                    {isSelected && (
                      <div className="mt-1.5 text-[10px] font-bold text-brand-600 dark:text-brand-400 flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        <span>Active Template</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="h-px bg-slate-200 dark:bg-slate-800" />

          {/* Typography Font Family */}
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
                      : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  {f.name}
                </button>
              ))}
            </div>
          </div>

          {/* Font Sizing */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
              Base Font Sizing
            </label>
            <div className="flex gap-1.5">
              {['9pt', '10pt', '11pt'].map((s) => (
                <button
                  key={s}
                  onClick={() => onUpdateStyling({ ...styling, font_size: s as any })}
                  className={`flex-1 py-1.5 rounded-lg border font-semibold ${
                    styling.font_size === s
                      ? 'border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Line Spacing */}
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
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {lh}x
                </button>
              ))}
            </div>
          </div>

          {/* Page Margins */}
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
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Accent Color */}
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

      {/* ===================================================================
       * TAB 3: Sections Reordering Manager
       * =================================================================== */}
      {activeTab === 'sections' && (
        <div className="flex-1 overflow-y-auto p-4 space-y-3 pb-28 text-xs">
          <div className="text-xs text-slate-500 leading-relaxed">
            Reorder resume sections to prioritize relevance for specific recruitment drives.
          </div>

          <div className="space-y-1.5">
            {sectionsOrder.map((sectionKey, idx) => (
              <div
                key={sectionKey}
                className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 shadow-xs"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-5 text-center font-mono text-slate-400 text-[10px]">
                    {idx + 1}
                  </span>
                  <span className="font-semibold capitalize text-slate-900 dark:text-white">
                    {sectionKey}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    disabled={idx === 0}
                    onClick={() => moveSection(idx, 'up')}
                    className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 transition-colors"
                    title="Move section up"
                  >
                    <MoveUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    disabled={idx === sectionsOrder.length - 1}
                    onClick={() => moveSection(idx, 'down')}
                    className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 transition-colors"
                    title="Move section down"
                  >
                    <MoveDown className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===================================================================
       * TAB 4: Scorecard & Verification Truth
       * =================================================================== */}
      {activeTab === 'truth' && (
        <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-28">
          {/* Sub-navigation pill toggle */}
          <div className="flex bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700/60 text-xs">
            <button
              onClick={() => setScoreSubTab('score')}
              className={`flex-1 py-1 rounded-md font-semibold transition-all flex items-center justify-center gap-1.5 ${
                scoreSubTab === 'score'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <BarChart3 className="w-3 h-3 text-brand-600" />
              <span>ATS Score ({scoringReport.overall_score}/100)</span>
            </button>
            <button
              onClick={() => setScoreSubTab('truth')}
              className={`flex-1 py-1 rounded-md font-semibold transition-all flex items-center justify-center gap-1.5 ${
                scoreSubTab === 'truth'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              <span>Verification ({claims.length})</span>
            </button>
          </div>

          {scoreSubTab === 'score' ? (
            <div className="space-y-4">
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
            </div>
          ) : (
            <div className="space-y-3">
              <div className="space-y-1">
                <h3 className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Truth Verification Engine
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  Every bullet, skill, and metric is verified against your authentic code repositories and college records.
                </p>
              </div>

              {/* Filter Pills */}
              <div className="flex flex-wrap gap-1 text-[10px]">
                {['all', 'Supported by linked evidence', 'Partially supported', 'Student-confirmed', 'Unverified'].map(
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
                      className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1.5 text-xs shadow-xs"
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
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ===================================================================
       * TAB 5: Versions & Alumni Library
       * =================================================================== */}
      {activeTab === 'versions' && (
        <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-28 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Resume Versions ({resumes.length})
            </span>
            <button
              onClick={() => setIsCreatingVersion((v) => !v)}
              className="px-2.5 py-1 rounded-md bg-brand-600 hover:bg-brand-500 text-white text-[11px] font-semibold flex items-center gap-1 shadow-xs transition-colors"
            >
              <Plus className="w-3 h-3" />
              <span>{isCreatingVersion ? 'Cancel' : 'New Version'}</span>
            </button>
          </div>

          {/* New version creation inline form */}
          {isCreatingVersion && (
            <form
              onSubmit={handleCreateSubmit}
              className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2.5 text-xs"
            >
              <div className="font-semibold text-slate-900 dark:text-white">
                Create Isolated Version
              </div>
              <div>
                <label className="text-[10px] font-medium text-slate-500 block mb-1">
                  Target Role
                </label>
                <select
                  value={newVersionRole}
                  onChange={(e) => {
                    setNewVersionRole(e.target.value);
                    if (!newVersionTitle) setNewVersionTitle(`${e.target.value} Resume`);
                  }}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-1.5 outline-none"
                >
                  {rolePresets.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-medium text-slate-500 block mb-1">
                  Version Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. SDE - Amazon Ready"
                  value={newVersionTitle}
                  onChange={(e) => setNewVersionTitle(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-1.5 outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-medium text-slate-500 block mb-1">
                  Starting Template
                </label>
                <select
                  value={newVersionTemplate}
                  onChange={(e) => setNewVersionTemplate(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-1.5 outline-none"
                >
                  {templatesList.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="submit"
                  className="flex-1 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs"
                >
                  Create
                </button>
                <button
                  type="button"
                  onClick={() => setIsCreatingVersion(false)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs text-slate-600 dark:text-slate-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* Resumes List */}
          <div className="space-y-2">
            {resumes.map((res) => {
              const isActive = res.id === activeResumeId;
              return (
                <div
                  key={res.id}
                  onClick={() => onSelectResume(res.id)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    isActive
                      ? 'bg-blue-50/60 dark:bg-blue-950/40 border-blue-400 dark:border-blue-700 shadow-xs'
                      : 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-xs text-slate-900 dark:text-white truncate">
                          {res.title}
                        </span>
                        {res.is_master && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 shrink-0">
                            MASTER
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                        {res.target_role}
                        {res.target_company ? ` • ${res.target_company}` : ''}
                      </div>
                    </div>

                    <div className="text-right shrink-0 ml-2">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        {res.ats_score}
                      </span>
                      <span className="text-[10px] text-slate-400">/100</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 dark:border-slate-800/80 text-[10px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-500" />
                      {res.evidence_backed_claims} verified
                    </span>

                    <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => onDuplicateResume(res.id)}
                        className="p-1 hover:text-slate-700 dark:hover:text-slate-200 rounded"
                        title="Duplicate as new version"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                      {!res.is_master && (
                        <button
                          onClick={() => onArchiveResume(res.id)}
                          className="p-1 hover:text-amber-600 rounded"
                          title="Archive version"
                        >
                          <Archive className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Alumni Library Section */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" />
              Alumni Example Resumes
            </span>
            {alumniExamples.length === 0 ? (
              <div className="p-3 rounded-lg border border-dashed border-slate-200 dark:border-slate-800 text-center text-[11px] text-slate-400">
                No alumni resumes available for this cohort.
              </div>
            ) : (
              <div className="space-y-2">
                {alumniExamples.map((ex) => (
                  <div
                    key={ex.id}
                    className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 text-xs space-y-1.5"
                  >
                    <div className="flex justify-between items-start">
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {ex.role}
                      </span>
                      {ex.placement_outcome && (
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Placed
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {ex.industry} • Class of {ex.graduation_year}
                    </div>
                    <div className="pt-1 flex justify-between items-center">
                      <span className="text-[10px] text-slate-400">
                        {ex.template_id}
                      </span>
                      <button
                        onClick={() => onUseAlumniTemplate(ex.template_id)}
                        className="px-2 py-0.5 rounded bg-white dark:bg-slate-800 hover:bg-slate-100 border border-slate-200 dark:border-slate-700 text-[10px] font-semibold text-slate-700 dark:text-slate-200"
                      >
                        Apply Layout
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </aside>
  );
};
