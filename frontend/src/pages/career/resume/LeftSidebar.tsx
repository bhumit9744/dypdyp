import React, { useState, useMemo } from 'react';
import {
  Layers,
  Copy,
  Archive,
  RotateCcw,
  Plus,
  Trash2,
  MoveUp,
  MoveDown,
  LayoutTemplate,
  Users,
  ShieldCheck,
  Check,
  FileCheck,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Search,
  X
} from 'lucide-react';
import {
  ResumeVersionSummary,
  FullResumeDocument,
  AlumniExample
} from '../../../types/resume';

interface LeftSidebarProps {
  resumes: ResumeVersionSummary[];
  activeResumeId: string;
  onSelectResume: (id: string) => void;
  onCreateNewVersion: (targetRole: string, title: string, templateId: string) => void;
  onDuplicateResume: (id: string) => void;
  onArchiveResume: (id: string) => void;
  onRestoreResume: (id: string) => void;
  sectionsOrder: string[];
  onReorderSections: (newOrder: string[]) => void;
  selectedTemplateId: string;
  onSelectTemplate: (templateId: string) => void;
  alumniExamples: AlumniExample[];
  onUseAlumniTemplate: (templateId: string) => void;
  onClose?: () => void;
}

type SidebarTab = 'versions' | 'sections' | 'templates' | 'alumni';

export const LeftSidebar: React.FC<LeftSidebarProps> = ({
  resumes,
  activeResumeId,
  onSelectResume,
  onCreateNewVersion,
  onDuplicateResume,
  onArchiveResume,
  onRestoreResume,
  sectionsOrder,
  onReorderSections,
  selectedTemplateId,
  onSelectTemplate,
  alumniExamples,
  onUseAlumniTemplate,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<SidebarTab>('versions');
  const [searchQuery, setSearchQuery] = useState('');
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

  const filteredResumes = useMemo(() => {
    if (!searchQuery.trim()) return resumes;
    const q = searchQuery.toLowerCase();
    return resumes.filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        r.target_role.toLowerCase().includes(q) ||
        (r.target_company && r.target_company.toLowerCase().includes(q))
    );
  }, [resumes, searchQuery]);

  return (
    <aside className="w-80 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col shrink-0 select-none no-print h-full shadow-lg">
      {/* Library Header */}
      <div className="flex items-center justify-between px-3.5 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-brand-600 dark:text-brand-400" />
          <span className="text-xs font-bold text-slate-900 dark:text-white">Resume Library</span>
          <span className="text-[10px] bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold px-2 py-0.5 rounded-full font-mono">
            {resumes.length}
          </span>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
            title="Close Library"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 p-1.5 gap-1 bg-slate-50 dark:bg-slate-950/40">
        <button
          onClick={() => setActiveTab('versions')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${
            activeTab === 'versions'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          Versions
        </button>
        <button
          onClick={() => setActiveTab('sections')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${
            activeTab === 'sections'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          Sections
        </button>
        <button
          onClick={() => setActiveTab('templates')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${
            activeTab === 'templates'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          Templates
        </button>
        <button
          onClick={() => setActiveTab('alumni')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${
            activeTab === 'alumni'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          Alumni
        </button>
      </div>

      {/* Tab 1: Versions List */}
      {activeTab === 'versions' && (
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Versions ({filteredResumes.length})
            </span>
            <button
              onClick={() => setIsCreatingVersion(true)}
              className="px-2.5 py-1 rounded-md bg-brand-600 hover:bg-brand-500 text-white text-[11px] font-semibold flex items-center gap-1 shadow-xs transition-colors"
            >
              <Plus className="w-3 h-3" />
              <span>New Version</span>
            </button>
          </div>

          {/* Search filter for versions */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by title, role, company..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-7 py-1.5 bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-lg text-xs outline-none focus:border-brand-500 placeholder:text-slate-400 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* New version creation drawer */}
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
                  className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 text-xs text-slate-600"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* Resumes List */}
          {filteredResumes.length === 0 ? (
            <div className="text-center py-6 px-3 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 text-xs text-slate-400">
              No matching resume versions found
            </div>
          ) : (
            <div className="space-y-2">
              {filteredResumes.map((res) => {
                const isActive = res.id === activeResumeId;
                return (
                  <div
                    key={res.id}
                    onClick={() => onSelectResume(res.id)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      isActive
                        ? 'bg-blue-50/50 dark:bg-blue-950/40 border-blue-300 dark:border-blue-700 shadow-xs'
                        : 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-slate-300'
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
          )}

          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40 text-[11px] text-slate-500 leading-relaxed border border-slate-100 dark:border-slate-800">
            <span className="font-semibold text-slate-700 dark:text-slate-300 block mb-0.5">
              Strict Version Isolation
            </span>
            Edits made in customized role resumes never alter the Master Profile or other versions.
          </div>
        </div>
      )}

      {/* Tab 2: Sections Manager */}
      {activeTab === 'sections' && (
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <div className="text-xs text-slate-500 leading-relaxed">
            Reorder resume sections to prioritize relevance for specific recruitment drives.
          </div>

          <div className="space-y-1.5">
            {sectionsOrder.map((sectionKey, idx) => (
              <div
                key={sectionKey}
                className="flex items-center justify-between p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200"
              >
                <div className="flex items-center gap-2">
                  <span className="w-5 text-center font-mono text-slate-400 text-[10px]">
                    {idx + 1}
                  </span>
                  <span className="font-medium capitalize">{sectionKey}</span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    disabled={idx === 0}
                    onClick={() => moveSection(idx, 'up')}
                    className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30"
                    title="Move section up"
                  >
                    <MoveUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    disabled={idx === sectionsOrder.length - 1}
                    onClick={() => moveSection(idx, 'down')}
                    className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30"
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

      {/* Tab 3: Templates Switcher */}
      {activeTab === 'templates' && (
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <div className="text-xs text-slate-500 leading-relaxed">
            Switch template layouts without losing or fabricating any resume content.
          </div>

          <div className="space-y-2.5">
            {templatesList.map((tpl) => {
              const isSelected = tpl.id === selectedTemplateId;
              return (
                <div
                  key={tpl.id}
                  onClick={() => onSelectTemplate(tpl.id)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-brand-50/60 dark:bg-brand-950/40 border-brand-500 shadow-xs'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
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
                    <div className="mt-2 text-[10px] font-semibold text-brand-600 flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      Active Template
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 4: Authorized Alumni Examples */}
      {activeTab === 'alumni' && (
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/60 text-xs text-purple-900 dark:text-purple-300 space-y-1">
            <div className="font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              Authorized Alumni Library
            </div>
            <p className="text-[11px] leading-relaxed text-purple-800/80 dark:text-purple-300/80">
              Only real alumni resumes with explicit consent are displayed. Personal details are protected.
            </p>
          </div>

          {alumniExamples.length === 0 ? (
            <div className="text-center py-8 px-4 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 space-y-2">
              <Users className="w-8 h-8 text-slate-300 mx-auto" />
              <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                No Authorized Alumni Resumes
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed max-w-xs mx-auto">
                No institution-authorized alumni resumes are currently registered for this cohort. Use our verified standard templates above.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {alumniExamples.map((ex) => (
                <div
                  key={ex.id}
                  className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2 text-xs"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white">
                        {ex.role}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {ex.industry} • Class of {ex.graduation_year}
                      </div>
                    </div>
                    {ex.placement_outcome && (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Placed
                      </span>
                    )}
                  </div>

                  {ex.placement_outcome && (
                    <div className="text-[11px] text-slate-700 dark:text-slate-300 italic">
                      Outcome: {ex.placement_outcome}
                    </div>
                  )}

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                    <span className="text-[10px] text-slate-400">
                      Template: {ex.template_id}
                    </span>
                    <button
                      onClick={() => onUseAlumniTemplate(ex.template_id)}
                      className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-[11px] font-medium text-slate-800 transition-colors"
                    >
                      Apply Layout
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </aside>
  );
};
