import React from 'react';
import {
  Undo2,
  Redo2,
  ZoomIn,
  ZoomOut,
  Download,
  Eye,
  Edit3,
  Sparkles,
  ShieldCheck,
  BarChart3,
  SplitSquareVertical,
  Check,
  Loader2,
  FileText,
  Layers,
  Upload,
  Sliders
} from 'lucide-react';
import { FullResumeDocument } from '../../../types/resume';

export type RightSidebarTab = 'tailor' | 'truth' | 'score' | 'format';

interface TopToolbarProps {
  resume: FullResumeDocument;
  zoom: number;
  setZoom: React.Dispatch<React.SetStateAction<number>>;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  isSaving: boolean;
  isEditing: boolean;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  onRenameTitle: (title: string) => void;
  isLeftPanelOpen: boolean;
  onToggleLeftPanel: () => void;
  resumesCount: number;
  isRightPanelOpen: boolean;
  activeRightTab: RightSidebarTab;
  onToggleRightPanel: (tab: RightSidebarTab) => void;
  onOpenCompareModal: () => void;
  onExportPdf: () => void;
  onOpenUploadModal: () => void;
}

export const TopToolbar: React.FC<TopToolbarProps> = ({
  resume,
  zoom,
  setZoom,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  isSaving,
  isEditing,
  setIsEditing,
  onRenameTitle,
  isLeftPanelOpen,
  onToggleLeftPanel,
  resumesCount,
  isRightPanelOpen,
  activeRightTab,
  onToggleRightPanel,
  onOpenCompareModal,
  onExportPdf,
  onOpenUploadModal
}) => {
  const verifiedCount = resume.evidence_links.filter(
    (c) => c.status === 'Supported by linked evidence'
  ).length;

  return (
    <header className="h-14 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-3 md:px-4 flex items-center justify-between gap-3 shrink-0 select-none no-print">
      {/* Left: Versions Drawer Toggle & Document Identity */}
      <div className="flex items-center space-x-2.5 min-w-0">
        <button
          onClick={onToggleLeftPanel}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
            isLeftPanelOpen
              ? 'bg-brand-50 text-brand-700 border-brand-200 dark:bg-brand-950/60 dark:text-brand-300 dark:border-brand-800 shadow-xs'
              : 'bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
          title={isLeftPanelOpen ? 'Close resume versions & templates' : 'Open resume versions & templates'}
        >
          <Layers className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
          <span>Versions</span>
          <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] bg-slate-200/80 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-mono">
            {resumesCount}
          </span>
        </button>

        <div className="h-4 w-px bg-slate-200 dark:bg-slate-800" />

        <div className="flex items-center gap-2 min-w-0">
          <div className="w-7 h-7 rounded-md bg-brand-50 dark:bg-brand-950/60 text-brand-600 flex items-center justify-center shrink-0">
            <FileText className="w-3.5 h-3.5" />
          </div>
          <input
            type="text"
            value={resume.title}
            onChange={(e) => onRenameTitle(e.target.value)}
            className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800/60 rounded px-1.5 py-0.5 outline-none border border-transparent focus:border-brand-500 max-w-[170px] sm:max-w-[210px] truncate transition-colors"
            title="Click to rename document"
          />
          {resume.is_master ? (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 shrink-0">
              Master
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 truncate max-w-[120px] shrink-0">
              {resume.target_role}
            </span>
          )}
        </div>
      </div>

      {/* Center: Clean Segmented Document Controls */}
      <div className="hidden md:flex items-center bg-slate-50 dark:bg-slate-800/80 rounded-xl p-1 border border-slate-200 dark:border-slate-700/60 shadow-2xs space-x-1">
        {/* Undo / Redo */}
        <div className="flex items-center">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            title="Undo (Ctrl+Z)"
            className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
          >
            <Undo2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            title="Redo (Ctrl+Y)"
            className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
          >
            <Redo2 className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="h-4 w-px bg-slate-200 dark:bg-slate-700" />

        {/* Zoom */}
        <div className="flex items-center text-xs">
          <button
            onClick={() => setZoom((prev) => Math.max(50, prev - 10))}
            title="Zoom out"
            className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 transition-colors"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setZoom(100)}
            title="Reset to 100%"
            className="px-1.5 py-0.5 rounded text-[11px] font-mono font-medium text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 min-w-[40px] text-center"
          >
            {zoom}%
          </button>
          <button
            onClick={() => setZoom((prev) => Math.min(150, prev + 10))}
            title="Zoom in"
            className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 transition-colors"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="h-4 w-px bg-slate-200 dark:bg-slate-700" />

        {/* Edit / Preview Segmented */}
        <div className="flex items-center bg-slate-200/60 dark:bg-slate-900/60 rounded-lg p-0.5 text-xs font-semibold">
          <button
            onClick={() => setIsEditing(true)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all ${
              isEditing
                ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            <Edit3 className="w-3 h-3" />
            <span>Edit</span>
          </button>
          <button
            onClick={() => setIsEditing(false)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all ${
              !isEditing
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            <Eye className="w-3 h-3" />
            <span>Preview</span>
          </button>
        </div>

        <div className="h-4 w-px bg-slate-200 dark:bg-slate-700" />

        {/* Save Status */}
        <div className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center gap-1 px-1.5">
          {isSaving ? (
            <>
              <Loader2 className="w-3 h-3 animate-spin text-brand-600" />
              <span className="hidden xl:inline">Saving</span>
            </>
          ) : (
            <>
              <Check className="w-3 h-3 text-emerald-500" />
              <span className="hidden xl:inline text-slate-400">Saved</span>
            </>
          )}
        </div>
      </div>

      {/* Right: Studio Drawer Triggers & Output */}
      <div className="flex items-center space-x-1.5 sm:space-x-2">
        {/* Upload / Import */}
        <button
          onClick={onOpenUploadModal}
          className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-medium text-slate-600 dark:text-slate-300 transition-colors"
          title="Import resume from PDF or DOCX"
        >
          <Upload className="w-3.5 h-3.5 sm:hidden" />
          <span className="hidden sm:inline">Import</span>
        </button>

        {/* Compare */}
        <button
          onClick={onOpenCompareModal}
          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
          title="Compare versions side-by-side"
        >
          <SplitSquareVertical className="w-3.5 h-3.5" />
        </button>

        <div className="h-4 w-px bg-slate-200 dark:bg-slate-800" />

        {/* Gemini Tailor Trigger */}
        <button
          onClick={() => onToggleRightPanel('tailor')}
          className={`flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            isRightPanelOpen && activeRightTab === 'tailor'
              ? 'bg-purple-600 text-white shadow-xs ring-2 ring-purple-400/40'
              : 'bg-purple-50 text-purple-700 hover:bg-purple-100 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800 border border-purple-200'
          }`}
          title="Toggle Gemini AI Job Tailoring Assistant"
        >
          <Sparkles className="w-3.5 h-3.5 text-purple-500 dark:text-purple-300" />
          <span className="hidden sm:inline">AI Tailor</span>
        </button>

        {/* Truth Verification Trigger */}
        <button
          onClick={() => onToggleRightPanel('truth')}
          className={`flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
            isRightPanelOpen && activeRightTab === 'truth'
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs ring-2 ring-emerald-400/40'
              : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800'
          }`}
          title="Toggle Truth Verification Claims Inspector"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span className="hidden sm:inline">{verifiedCount} Verified</span>
        </button>

        {/* ATS Scorecard Trigger */}
        <button
          onClick={() => onToggleRightPanel('score')}
          className={`flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-lg text-xs font-bold border transition-all ${
            isRightPanelOpen && activeRightTab === 'score'
              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs ring-2 ring-slate-400/40'
              : 'bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700 hover:bg-slate-200'
          }`}
          title="Toggle Transparent ATS Score Breakdown"
        >
          <BarChart3 className="w-3.5 h-3.5 text-brand-600" />
          <span>{resume.ats_score}</span>
          <span className="text-[10px] text-slate-400 font-normal">/100</span>
        </button>

        {/* Format & Style Trigger */}
        <button
          onClick={() => onToggleRightPanel('format')}
          className={`p-1.5 rounded-lg border transition-all ${
            isRightPanelOpen && activeRightTab === 'format'
              ? 'bg-blue-600 text-white border-blue-600 shadow-xs ring-2 ring-blue-400/40'
              : 'bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 hover:bg-slate-100'
          }`}
          title="Toggle Format, Typography & Theme Inspector"
        >
          <Sliders className="w-3.5 h-3.5" />
        </button>

        {/* Export PDF Primary Button */}
        <button
          onClick={onExportPdf}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-xs transition-colors shrink-0"
          title="Export vector-sharp selectable A4 PDF"
        >
          <Download className="w-3.5 h-3.5" />
          <span className="font-semibold">Export</span>
        </button>
      </div>
    </header>
  );
};
