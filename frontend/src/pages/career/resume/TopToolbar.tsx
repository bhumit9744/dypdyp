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
  FileText
} from 'lucide-react';
import { FullResumeDocument } from '../../../types/resume';

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
  onOpenTailorModal: () => void;
  onOpenTruthModal: () => void;
  onOpenScoreModal: () => void;
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
  onOpenTailorModal,
  onOpenTruthModal,
  onOpenScoreModal,
  onOpenCompareModal,
  onExportPdf,
  onOpenUploadModal
}) => {
  const verifiedCount = resume.evidence_links.filter(
    (c) => c.status === 'Supported by linked evidence'
  ).length;

  return (
    <header className="h-14 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 flex items-center justify-between gap-3 shrink-0 select-none no-print">
      {/* Left: Document Info & Inline Rename */}
      <div className="flex items-center space-x-3 min-w-0">
        <div className="w-8 h-8 rounded-lg bg-brand-50 dark:bg-brand-950/60 text-brand-600 flex items-center justify-center shrink-0">
          <FileText className="w-4 h-4" />
        </div>
        <div className="min-w-0 flex items-center gap-2">
          <input
            type="text"
            value={resume.title}
            onChange={(e) => onRenameTitle(e.target.value)}
            className="text-sm font-bold text-slate-900 dark:text-white bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 rounded px-1.5 py-0.5 outline-none border border-transparent focus:border-brand-500 max-w-[200px] truncate"
            title="Click to rename document"
          />
          {resume.is_master ? (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              Master Profile
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              {resume.target_role}
            </span>
          )}
        </div>
      </div>

      {/* Middle: Undo, Redo, Zoom, Edit/Preview toggles */}
      <div className="flex items-center space-x-1.5">
        <div className="flex items-center bg-slate-100 dark:bg-slate-800/80 rounded-lg p-0.5 border border-slate-200 dark:border-slate-700/60">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            title="Undo (Ctrl+Z)"
            className="p-1.5 rounded-md text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
          >
            <Undo2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            title="Redo (Ctrl+Y)"
            className="p-1.5 rounded-md text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
          >
            <Redo2 className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="h-4 w-px bg-slate-200 dark:bg-slate-800" />

        {/* Zoom controls */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800/80 rounded-lg p-0.5 border border-slate-200 dark:border-slate-700/60 text-xs">
          <button
            onClick={() => setZoom((prev) => Math.max(50, prev - 10))}
            title="Zoom out"
            className="p-1.5 rounded-md text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 transition-colors"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="px-2 font-mono text-slate-700 dark:text-slate-300 min-w-[42px] text-center">
            {zoom}%
          </span>
          <button
            onClick={() => setZoom((prev) => Math.min(150, prev + 10))}
            title="Zoom in"
            className="p-1.5 rounded-md text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 transition-colors"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="h-4 w-px bg-slate-200 dark:bg-slate-800" />

        {/* Mode Toggle: Edit vs Preview */}
        <button
          onClick={() => setIsEditing(!isEditing)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
            isEditing
              ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800'
              : 'bg-white text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700'
          }`}
          title={isEditing ? 'Currently in inline editing mode' : 'Currently in clean preview mode'}
        >
          {isEditing ? (
            <>
              <Edit3 className="w-3.5 h-3.5 text-blue-600" />
              <span>Editing Mode</span>
            </>
          ) : (
            <>
              <Eye className="w-3.5 h-3.5 text-slate-500" />
              <span>Preview Mode</span>
            </>
          )}
        </button>

        {/* Save status */}
        <div className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center gap-1 px-1">
          {isSaving ? (
            <>
              <Loader2 className="w-3 h-3 animate-spin text-brand-600" />
              <span>Autosaving...</span>
            </>
          ) : (
            <>
              <Check className="w-3 h-3 text-emerald-500" />
              <span>Saved</span>
            </>
          )}
        </div>
      </div>

      {/* Right: Signature Studio Actions */}
      <div className="flex items-center space-x-2">
        {/* Upload existing PDF/DOCX */}
        <button
          onClick={onOpenUploadModal}
          className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-200 transition-colors"
          title="Import resume from PDF or DOCX file"
        >
          Import PDF
        </button>

        {/* Compare Versions */}
        <button
          onClick={onOpenCompareModal}
          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors"
          title="Compare resume versions side-by-side"
        >
          <SplitSquareVertical className="w-4 h-4" />
        </button>

        {/* Gemini Job Tailor Button */}
        <button
          onClick={onOpenTailorModal}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-xs transition-all"
          title="Tailor resume to job description using Google Gemini"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Gemini Tailor</span>
        </button>

        {/* Truth Verification Engine Status */}
        <button
          onClick={onOpenTruthModal}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold hover:bg-emerald-100 transition-colors"
          title="Inspect truth verification evidence links"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>{verifiedCount} Verified</span>
        </button>

        {/* Resume Score Badge */}
        <button
          onClick={onOpenScoreModal}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold hover:opacity-90 transition-opacity"
          title="View transparent 7-category resume score breakdown"
        >
          <BarChart3 className="w-3.5 h-3.5 text-brand-400 dark:text-brand-600" />
          <span>{resume.ats_score}/100</span>
        </button>

        {/* Export / Print PDF */}
        <button
          onClick={onExportPdf}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-xs transition-colors"
          title="Export vector-sharp selectable A4 PDF"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export PDF</span>
        </button>
      </div>
    </header>
  );
};
