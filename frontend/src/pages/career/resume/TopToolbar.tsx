import React, { useState, useRef, useEffect } from 'react';
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
  ChevronDown,
  Maximize2,
  Layers,
  Upload,
  FolderOpen
} from 'lucide-react';
import { FullResumeDocument, ResumeVersionSummary } from '../../../types/resume';

interface TopToolbarProps {
  resume: FullResumeDocument;
  resumes?: ResumeVersionSummary[];
  activeResumeId?: string;
  onSelectResume?: (id: string) => void;
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
  onOpenTailorModal?: () => void;
  onOpenTruthModal?: () => void;
  onOpenScoreModal?: () => void;
  activeTab?: string;
  onTabChange?: (tab: any) => void;
  onToggleVersionsDrawer?: () => void;
  onOpenCompareModal: () => void;
  onExportPdf: () => void;
  onOpenUploadModal: () => void;
}

export const TopToolbar: React.FC<TopToolbarProps> = ({
  resume,
  resumes = [],
  activeResumeId = '',
  onSelectResume,
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
  activeTab,
  onTabChange,
  onToggleVersionsDrawer,
  onOpenCompareModal,
  onExportPdf,
  onOpenUploadModal
}) => {
  const [isVersionDropdownOpen, setIsVersionDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const verifiedCount = resume.evidence_links.filter(
    (c) => c.status === 'Supported by linked evidence'
  ).length;

  // Close version dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsVersionDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleTailorClick = () => {
    if (onTabChange) {
      onTabChange('tailor');
    } else if (onOpenTailorModal) {
      onOpenTailorModal();
    }
  };

  const handleTruthClick = () => {
    if (onTabChange) {
      onTabChange('truth');
    } else if (onOpenTruthModal) {
      onOpenTruthModal();
    }
  };

  const handleScoreClick = () => {
    if (onTabChange) {
      onTabChange('truth');
    } else if (onOpenScoreModal) {
      onOpenScoreModal();
    }
  };

  return (
    <header className="h-14 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 flex items-center justify-between gap-3 shrink-0 select-none no-print z-20">
      {/* Left: Document Info & Quick Version Dropdown Switcher */}
      <div className="flex items-center space-x-2.5 min-w-0" ref={dropdownRef}>
        <div className="w-8 h-8 rounded-lg bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center shrink-0 border border-brand-100 dark:border-brand-900/50">
          <FileText className="w-4 h-4" />
        </div>

        <div className="min-w-0 flex items-center gap-1.5 relative">
          <input
            type="text"
            value={resume.title}
            onChange={(e) => onRenameTitle(e.target.value)}
            className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 rounded px-1.5 py-0.5 outline-none border border-transparent focus:border-brand-500 max-w-[160px] sm:max-w-[200px] truncate transition-colors"
            title="Click to rename document"
          />

          {resume.is_master ? (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 shrink-0">
              Master
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 shrink-0 max-w-[100px] truncate">
              {resume.target_role}
            </span>
          )}

          {/* Quick Version Dropdown Trigger */}
          {resumes.length > 0 && onSelectResume && (
            <button
              onClick={() => setIsVersionDropdownOpen((v) => !v)}
              className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
              title="Switch Resume Version"
            >
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isVersionDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
          )}

          {/* Versions Popover Dropdown */}
          {isVersionDropdownOpen && resumes.length > 0 && onSelectResume && (
            <div className="absolute top-full left-0 mt-2 w-72 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 p-2 z-50 text-xs animate-in fade-in zoom-in-95 duration-100">
              <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-100 dark:border-slate-800 px-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Switch Version ({resumes.length})
                </span>
                {onToggleVersionsDrawer && (
                  <button
                    onClick={() => {
                      setIsVersionDropdownOpen(false);
                      onToggleVersionsDrawer();
                    }}
                    className="text-[10px] text-brand-600 hover:underline flex items-center gap-1"
                  >
                    <FolderOpen className="w-3 h-3" />
                    <span>Drawer</span>
                  </button>
                )}
              </div>

              <div className="max-h-56 overflow-y-auto space-y-1">
                {resumes.map((r) => {
                  const isActive = r.id === (activeResumeId || resume.id);
                  return (
                    <div
                      key={r.id}
                      onClick={() => {
                        onSelectResume(r.id);
                        setIsVersionDropdownOpen(false);
                      }}
                      className={`p-2 rounded-lg cursor-pointer flex items-center justify-between transition-colors ${
                        isActive
                          ? 'bg-brand-50 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300 font-semibold'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="min-w-0 flex-1 pr-2">
                        <div className="flex items-center gap-1.5">
                          <span className="truncate">{r.title}</span>
                          {r.is_master && (
                            <span className="text-[9px] px-1 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 shrink-0 font-bold">
                              M
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate">
                          {r.target_role}
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="font-bold text-xs">{r.ats_score}</span>
                        <span className="text-[9px] text-slate-400">/100</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Middle: Undo, Redo, Zoom Presets, Edit/Preview toggle, Save status */}
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

        <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block" />

        {/* Zoom controls with Fit & 100% Presets */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800/80 rounded-lg p-0.5 border border-slate-200 dark:border-slate-700/60 text-xs">
          <button
            onClick={() => setZoom(90)}
            title="Fit Width (90%)"
            className={`px-1.5 py-1 rounded text-[11px] font-medium transition-colors ${
              zoom === 90
                ? 'bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-400 font-bold shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700'
            }`}
          >
            Fit
          </button>
          <button
            onClick={() => setZoom(100)}
            title="Actual Size (100%)"
            className={`px-1.5 py-1 rounded text-[11px] font-medium transition-colors ${
              zoom === 100
                ? 'bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-400 font-bold shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700'
            }`}
          >
            100%
          </button>
          <button
            onClick={() => setZoom((prev) => Math.max(50, prev - 10))}
            title="Zoom out"
            className="p-1 rounded-md text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 transition-colors"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="px-1.5 font-mono text-slate-700 dark:text-slate-300 min-w-[38px] text-center text-[11px]">
            {zoom}%
          </span>
          <button
            onClick={() => setZoom((prev) => Math.min(150, prev + 10))}
            title="Zoom in"
            className="p-1 rounded-md text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 transition-colors"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="h-4 w-px bg-slate-200 dark:bg-slate-800" />

        {/* Mode Toggle: Edit vs Preview */}
        <button
          onClick={() => setIsEditing(!isEditing)}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
            isEditing
              ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800 shadow-xs'
              : 'bg-white text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700'
          }`}
          title={isEditing ? 'Currently in inline editing mode' : 'Currently in clean preview mode'}
        >
          {isEditing ? (
            <>
              <Edit3 className="w-3.5 h-3.5 text-blue-600" />
              <span className="hidden sm:inline">Editing</span>
            </>
          ) : (
            <>
              <Eye className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Preview</span>
            </>
          )}
        </button>

        {/* Save status */}
        <div className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center gap-1 px-1">
          {isSaving ? (
            <>
              <Loader2 className="w-3 h-3 animate-spin text-brand-600" />
              <span className="hidden md:inline">Autosaving...</span>
            </>
          ) : (
            <>
              <Check className="w-3 h-3 text-emerald-500" />
              <span className="hidden md:inline">Saved</span>
            </>
          )}
        </div>
      </div>

      {/* Right: Signature Studio Actions */}
      <div className="flex items-center space-x-1.5 sm:space-x-2">
        {/* Upload existing PDF/DOCX */}
        <button
          onClick={onOpenUploadModal}
          className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-200 transition-colors flex items-center gap-1"
          title="Import resume from PDF or DOCX file"
        >
          <Upload className="w-3.5 h-3.5 text-slate-500" />
          <span className="hidden sm:inline">Import</span>
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
          onClick={handleTailorClick}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-xs transition-all"
          title="Tailor resume to job description using Google Gemini"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Gemini Tailor</span>
        </button>

        {/* Truth Verification Engine Status */}
        <button
          onClick={handleTruthClick}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold hover:bg-emerald-100 transition-colors"
          title="Inspect truth verification evidence links"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>{verifiedCount} Verified</span>
        </button>

        {/* Resume Score Badge */}
        <button
          onClick={handleScoreClick}
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
          <span className="hidden sm:inline">Export PDF</span>
        </button>
      </div>
    </header>
  );
};
