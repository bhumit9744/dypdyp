import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  FileText,
  Loader2,
  AlertCircle,
  Sparkles,
  Download,
  ShieldCheck,
  BarChart3,
  SplitSquareVertical,
  Upload,
  RefreshCw
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  ResumeVersionSummary,
  FullResumeDocument,
  ResumeContent,
  StylingConfig,
  TailoringReport,
  ScoreReport,
  AlumniExample,
  BestRecommendation
} from '../../types/resume';
import { TopToolbar, RightSidebarTab } from './resume/TopToolbar';
import { LeftSidebar } from './resume/LeftSidebar';
import { RightSidebar } from './resume/RightSidebar';
import { ResumeCanvas } from './resume/ResumeCanvas';
import { exportResumeToPdf } from './resume/printUtils';
import {
  UploadResumeModal,
  CompareVersionsModal,
  RecommendationModal
} from './resume/ResumeModals';
import { API_BASE } from '../../config/api';

export const ResumeSubSection: React.FC = () => {
  const { studentProfile, skills, jobs, setCurrentSection, setCurrentSubSection } = useApp();

  // Primary State
  const [resumes, setResumes] = useState<ResumeVersionSummary[]>([]);
  const [activeResumeId, setActiveResumeId] = useState<string>('');
  const [activeResume, setActiveResume] = useState<FullResumeDocument | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Canvas State
  const [zoom, setZoom] = useState<number>(95);
  const [isEditing, setIsEditing] = useState<boolean>(true);

  // Collapsible Studio Panels State
  const [isLeftPanelOpen, setIsLeftPanelOpen] = useState<boolean>(false);
  const [isRightPanelOpen, setIsRightPanelOpen] = useState<boolean>(false);
  const [rightPanelTab, setRightPanelTab] = useState<RightSidebarTab>('tailor');

  const handleToggleRightPanel = (tab: RightSidebarTab) => {
    if (isRightPanelOpen && rightPanelTab === tab) {
      setIsRightPanelOpen(false);
    } else {
      setRightPanelTab(tab);
      setIsRightPanelOpen(true);
    }
  };

  // Undo / Redo history stack
  const [history, setHistory] = useState<ResumeContent[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  // Modals state
  const [isUploadOpen, setIsUploadOpen] = useState<boolean>(false);
  const [isCompareOpen, setIsCompareOpen] = useState<boolean>(false);
  const [isRecommendOpen, setIsRecommendOpen] = useState<boolean>(false);
  const [recommendation, setRecommendation] = useState<BestRecommendation | null>(null);

  // Tailoring & Alumni state
  const [isTailoring, setIsTailoring] = useState<boolean>(false);
  const [tailoringReport, setTailoringReport] = useState<TailoringReport | null>(null);
  const [alumniExamples, setAlumniExamples] = useState<AlumniExample[]>([]);

  // Debounce save timer ref
  const saveTimeoutRef = useRef<any>(null);

  /* =========================================================================
   * 1. Fetch Resumes List & Alumni Examples
   * ========================================================================= */
  const fetchResumes = useCallback(async (selectId?: string) => {
    try {
      setIsLoading(true);
      setErrorMsg(null);
      const res = await fetch(`${API_BASE}/resumes`);
      if (!res.ok) throw new Error('Failed to load resumes from server.');
      const data: ResumeVersionSummary[] = await res.json();
      setResumes(data);

      const targetId = selectId || activeResumeId || (data.length > 0 ? data[0].id : '');
      if (targetId) {
        setActiveResumeId(targetId);
        await fetchResumeDetail(targetId);
      }
    } catch (err: any) {
      console.error('Error fetching resumes:', err);
      setErrorMsg(err.message || 'Could not connect to Placement Hub backend.');
    } finally {
      setIsLoading(false);
    }
  }, [activeResumeId]);

  const fetchResumeDetail = async (id: string) => {
    try {
      const res = await fetch(`${API_BASE}/resumes/${id}`);
      if (!res.ok) throw new Error(`Failed to load resume ${id}`);
      const doc: FullResumeDocument = await res.json();
      setActiveResume(doc);
      // Initialize history stack
      setHistory([doc.content]);
      setHistoryIndex(0);
    } catch (err: any) {
      console.error('Error fetching resume detail:', err);
      setErrorMsg(err.message);
    }
  };

  const fetchAlumni = async () => {
    try {
      const res = await fetch(`${API_BASE}/resumes/alumni-examples`);
      if (res.ok) {
        const data = await res.json();
        setAlumniExamples(data);
      }
    } catch (err) {
      console.error('Error fetching alumni examples:', err);
    }
  };

  useEffect(() => {
    fetchResumes();
    fetchAlumni();
  }, []);

  /* =========================================================================
   * 2. Autosave with Debounce
   * ========================================================================= */
  const triggerAutosave = useCallback(
    (updatedDoc: Partial<FullResumeDocument>) => {
      if (!activeResumeId) return;
      setIsSaving(true);

      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      saveTimeoutRef.current = setTimeout(async () => {
        try {
          const res = await fetch(`${API_BASE}/resumes/${activeResumeId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedDoc)
          });
          if (res.ok) {
            const data = await res.json();
            setActiveResume((prev) =>
              prev
                ? {
                    ...prev,
                    last_updated: data.last_updated,
                    ats_score: data.ats_score,
                    evidence_backed_claims: data.evidence_backed_claims
                  }
                : null
            );
            // Refresh list summary
            setResumes((prev) =>
              prev.map((r) =>
                r.id === activeResumeId
                  ? {
                      ...r,
                      ats_score: data.ats_score,
                      evidence_backed_claims: data.evidence_backed_claims,
                      last_updated: data.last_updated
                    }
                  : r
              )
            );
          }
        } catch (err) {
          console.error('Autosave error:', err);
        } finally {
          setIsSaving(false);
        }
      }, 600);
    },
    [activeResumeId]
  );

  /* =========================================================================
   * 3. History Management (Undo / Redo) & Inline Content Updates
   * ========================================================================= */
  const handleUpdateContent = (newContent: ResumeContent) => {
    if (!activeResume) return;

    // Update history
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newContent);
    // Limit history stack size to 50
    if (newHistory.length > 50) newHistory.shift();

    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);

    // Update active document state
    const updated = { ...activeResume, content: newContent };
    setActiveResume(updated);

    // Trigger debounced autosave
    triggerAutosave({ content: newContent });
  };

  const handleUndo = () => {
    if (historyIndex > 0 && activeResume) {
      const prevIndex = historyIndex - 1;
      const prevContent = history[prevIndex];
      setHistoryIndex(prevIndex);
      setActiveResume({ ...activeResume, content: prevContent });
      triggerAutosave({ content: prevContent });
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1 && activeResume) {
      const nextIndex = historyIndex + 1;
      const nextContent = history[nextIndex];
      setHistoryIndex(nextIndex);
      setActiveResume({ ...activeResume, content: nextContent });
      triggerAutosave({ content: nextContent });
    }
  };

  const handleExportPdf = useCallback(() => {
    if (!activeResume) return;
    const candidateName =
      activeResume.content.contact.full_name || activeResume.title || 'Candidate Resume';
    exportResumeToPdf('resume-print-canvas', candidateName, activeResume.target_role);
  }, [activeResume]);

  useEffect(() => {
    const handleJarvisExport = () => {
      handleExportPdf();
    };
    window.addEventListener('jarvis_export_resume_pdf', handleJarvisExport);
    return () => window.removeEventListener('jarvis_export_resume_pdf', handleJarvisExport);
  }, [handleExportPdf]);

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        if (e.shiftKey) {
          e.preventDefault();
          handleRedo();
        } else {
          e.preventDefault();
          handleUndo();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        e.preventDefault();
        handleRedo();
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        handleExportPdf();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [historyIndex, history, activeResume, handleExportPdf]);

  /* =========================================================================
   * 4. Version Management Handlers
   * ========================================================================= */
  const handleSelectResume = async (id: string) => {
    if (id === activeResumeId) return;
    setActiveResumeId(id);
    setIsLoading(true);
    await fetchResumeDetail(id);
    setIsLoading(false);
  };

  const handleCreateNewVersion = async (
    targetRole: string,
    title: string,
    templateId: string
  ) => {
    try {
      const res = await fetch(`${API_BASE}/resumes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          target_role: targetRole,
          template_id: templateId,
          source_resume_id: activeResumeId
        })
      });
      if (res.ok) {
        const data = await res.json();
        await fetchResumes(data.id);
      }
    } catch (err) {
      console.error('Failed to create resume version:', err);
    }
  };

  const handleDuplicateResume = async (id: string) => {
    try {
      const res = await fetch(`${API_BASE}/resumes/${id}/duplicate`, {
        method: 'POST'
      });
      if (res.ok) {
        const data = await res.json();
        await fetchResumes(data.id);
      }
    } catch (err) {
      console.error('Failed to duplicate resume:', err);
    }
  };

  const handleArchiveResume = async (id: string) => {
    try {
      const res = await fetch(`${API_BASE}/resumes/${id}/archive`, {
        method: 'POST'
      });
      if (res.ok) {
        await fetchResumes();
      }
    } catch (err) {
      console.error('Failed to archive resume:', err);
    }
  };

  const handleRestoreResume = async (id: string) => {
    try {
      const res = await fetch(`${API_BASE}/resumes/${id}/restore`, {
        method: 'POST'
      });
      if (res.ok) {
        await fetchResumes();
      }
    } catch (err) {
      console.error('Failed to restore resume:', err);
    }
  };

  const handleRenameTitle = (newTitle: string) => {
    if (!activeResume) return;
    const updated = { ...activeResume, title: newTitle };
    setActiveResume(updated);
    setResumes((prev) =>
      prev.map((r) => (r.id === activeResumeId ? { ...r, title: newTitle } : r))
    );
    triggerAutosave({ title: newTitle });
  };

  const handleSelectTemplate = (templateId: string) => {
    if (!activeResume) return;
    const updated = { ...activeResume, template_id: templateId };
    setActiveResume(updated);
    triggerAutosave({ template_id: templateId });
  };

  const handleUpdateStyling = (newStyling: StylingConfig) => {
    if (!activeResume) return;
    const updated = { ...activeResume, styling_config: newStyling };
    setActiveResume(updated);
    triggerAutosave({ styling_config: newStyling });
  };

  const handleReorderSections = (newOrder: string[]) => {
    if (!activeResume) return;
    const updated = { ...activeResume, sections_order: newOrder };
    setActiveResume(updated);
    triggerAutosave({ sections_order: newOrder });
  };

  /* =========================================================================
   * 5. Gemini Tailoring Handlers
   * ========================================================================= */
  const handleRunGeminiTailor = async (
    targetRole: string,
    jobDesc: string,
    company?: string
  ) => {
    if (!activeResumeId) return;
    setIsTailoring(true);
    setErrorMsg(null);
    try {
      const res = await fetch(`${API_BASE}/resumes/${activeResumeId}/tailor`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          target_role: targetRole,
          job_description: jobDesc,
          target_company: company
        })
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || 'Gemini tailoring request failed.');
      }

      const report: TailoringReport = await res.json();
      setTailoringReport(report);
    } catch (err: any) {
      console.error('Tailoring error:', err);
      setErrorMsg(err.message || 'Gemini AI tailoring failed.');
    } finally {
      setIsTailoring(false);
    }
  };

  const handleApplyProposals = async (
    acceptedIds: string[],
    customEdits: Record<string, string>
  ) => {
    if (!activeResumeId) return;
    try {
      const res = await fetch(`${API_BASE}/resumes/${activeResumeId}/apply-proposals`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accepted_proposal_ids: acceptedIds,
          custom_edits: customEdits
        })
      });
      if (res.ok) {
        await fetchResumeDetail(activeResumeId);
        setTailoringReport(null);
      }
    } catch (err) {
      console.error('Failed to apply proposals:', err);
    }
  };

  /* =========================================================================
   * 6. Import Document Handler (Entry Path B)
   * ========================================================================= */
  const handleImportExtracted = async (
    content: ResumeContent,
    title: string,
    asMaster: boolean
  ) => {
    try {
      const res = await fetch(`${API_BASE}/resumes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          content,
          is_master: asMaster,
          target_role: 'Software Developer',
          template_id: 'classic-professional'
        })
      });
      if (res.ok) {
        const data = await res.json();
        await fetchResumes(data.id);
      }
    } catch (err) {
      console.error('Failed to import extracted document:', err);
    }
  };

  /* =========================================================================
   * 7. Best Recommendation Handler
   * ========================================================================= */
  const handleFetchRecommendation = async (targetRole: string) => {
    try {
      const res = await fetch(
        `${API_BASE}/resumes/recommendation/best?target_role=${encodeURIComponent(targetRole)}`
      );
      if (res.ok) {
        const data = await res.json();
        setRecommendation(data);
        setIsRecommendOpen(true);
      }
    } catch (err) {
      console.error('Failed to fetch recommendation:', err);
    }
  };

  /* =========================================================================
   * 8. Estimated Page Count Calculation
   * ========================================================================= */
  const calculateEstimatedPages = () => {
    if (!activeResume) return 1;
    let itemsScore = 0;
    if (activeResume.content.summary) itemsScore += 2;
    itemsScore += (activeResume.content.education || []).length * 2;
    itemsScore += (activeResume.content.skills || []).length * 1.5;
    itemsScore += (activeResume.content.experience || []).reduce(
      (acc, e) => acc + 2 + (e.bullets || []).length,
      0
    );
    itemsScore += (activeResume.content.projects || []).reduce(
      (acc, p) => acc + 2 + (p.bullets || []).length,
      0
    );
    return itemsScore > 22 ? 2 : 1;
  };

  if (isLoading && !activeResume) {
    return (
      <div className="h-[750px] flex flex-col items-center justify-center space-y-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
        <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
        <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">
          Loading AI Resume Studio Workspace...
        </div>
        <p className="text-xs text-slate-400">
          Compiling genuine student records and verification links
        </p>
      </div>
    );
  }

  if (!activeResume) {
    return (
      <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
        <AlertCircle className="w-10 h-10 text-amber-500 mx-auto" />
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          No Active Resume Available
        </h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          We could not load your master resume profile. Ensure the backend server is running on port 8000 and click below to re-initialize your workspace.
        </p>
        {errorMsg && (
          <p className="text-xs text-rose-500 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-lg p-2 max-w-md mx-auto">
            {errorMsg}
          </p>
        )}
        <button
          onClick={() => fetchResumes()}
          disabled={isLoading}
          className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white font-semibold text-xs inline-flex items-center gap-1.5"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>{isLoading ? 'Connecting to Backend...' : 'Reload Studio'}</span>
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[86vh] min-h-[720px] rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden select-none">
      {/* Top Professional Toolbar */}
      <TopToolbar
        resume={activeResume}
        zoom={zoom}
        setZoom={setZoom}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
        onUndo={handleUndo}
        onRedo={handleRedo}
        isSaving={isSaving}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        onRenameTitle={handleRenameTitle}
        isLeftPanelOpen={isLeftPanelOpen}
        onToggleLeftPanel={() => setIsLeftPanelOpen((prev) => !prev)}
        resumesCount={resumes.length}
        isRightPanelOpen={isRightPanelOpen}
        activeRightTab={rightPanelTab}
        onToggleRightPanel={handleToggleRightPanel}
        onOpenCompareModal={() => setIsCompareOpen(true)}
        onExportPdf={handleExportPdf}
        onOpenUploadModal={() => setIsUploadOpen(true)}
      />

      {/* Main Studio Body: Collapsible Left Sidebar + Center Canvas + Collapsible Right Sidebar */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Sidebar (Versions, Sections, Templates, Alumni) */}
        {isLeftPanelOpen && (
          <LeftSidebar
            resumes={resumes}
            activeResumeId={activeResumeId}
            onSelectResume={handleSelectResume}
            onCreateNewVersion={handleCreateNewVersion}
            onDuplicateResume={handleDuplicateResume}
            onArchiveResume={handleArchiveResume}
            onRestoreResume={handleRestoreResume}
            sectionsOrder={activeResume.sections_order}
            onReorderSections={handleReorderSections}
            selectedTemplateId={activeResume.template_id}
            onSelectTemplate={handleSelectTemplate}
            alumniExamples={alumniExamples}
            onUseAlumniTemplate={handleSelectTemplate}
            onClose={() => setIsLeftPanelOpen(false)}
          />
        )}

        {/* Center Live A4 Document Canvas */}
        <ResumeCanvas
          resume={activeResume}
          zoom={zoom}
          isEditing={isEditing}
          onUpdateContent={handleUpdateContent}
          pageCount={calculateEstimatedPages()}
        />

        {/* Right Sidebar (AI Tailor, Verification, Scorecard, Format) */}
        {isRightPanelOpen && (
          <RightSidebar
            styling={activeResume.styling_config}
            onUpdateStyling={handleUpdateStyling}
            claims={activeResume.evidence_links}
            scoringReport={activeResume.scoring_report}
            onRunGeminiTailor={handleRunGeminiTailor}
            isTailoring={isTailoring}
            tailoringReport={tailoringReport}
            onApplyProposals={handleApplyProposals}
            availableJobs={jobs}
            defaultRole={activeResume.target_role}
            activeTab={rightPanelTab}
            onTabChange={(tab) => setRightPanelTab(tab)}
            onClose={() => setIsRightPanelOpen(false)}
          />
        )}
      </div>

      {/* Modals */}
      <UploadResumeModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onImportExtracted={handleImportExtracted}
      />

      <CompareVersionsModal
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        resumes={resumes}
        activeResumeId={activeResumeId}
      />

      <RecommendationModal
        isOpen={isRecommendOpen}
        onClose={() => setIsRecommendOpen(false)}
        recommendation={recommendation}
        onSelectRecommended={handleSelectResume}
      />
    </div>
  );
};
