import React, { useState } from 'react';
import {
  Upload,
  FileText,
  AlertCircle,
  CheckCircle2,
  X,
  Loader2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  SplitSquareVertical,
  Check
} from 'lucide-react';
import {
  ResumeContent,
  ResumeVersionSummary,
  BestRecommendation
} from '../../../types/resume';

/* =========================================================================
 * 1. Upload & Extraction Modal (Entry Path B)
 * ========================================================================= */
interface UploadResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportExtracted: (content: ResumeContent, title: string, asMaster: boolean) => Promise<void>;
}

export const UploadResumeModal: React.FC<UploadResumeModalProps> = ({
  isOpen,
  onClose,
  onImportExtracted
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractedData, setExtractedData] = useState<ResumeContent | null>(null);
  const [parsingNotes, setParsingNotes] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [importAsMaster, setImportAsMaster] = useState(false);
  const [importTitle, setImportTitle] = useState('Imported Resume');

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      if (selected.size > 8 * 1024 * 1024) {
        setErrorMsg('File exceeds 8MB size limit.');
        return;
      }
      setFile(selected);
      setErrorMsg(null);
    }
  };

  const handleUploadAndParse = async () => {
    if (!file) return;
    setIsExtracting(true);
    setErrorMsg(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/v1/resumes/upload-extract', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.detail || 'Failed to extract document.');
      }

      const data = await response.json();
      const extracted = data.extracted_content;
      setExtractedData(extracted);
      setParsingNotes(extracted.parsing_notes);
      setImportTitle(`Imported - ${file.name.replace(/\.[^/.]+$/, '')}`);
    } catch (err: any) {
      setErrorMsg(err.message || 'Extraction failed. Ensure file is a valid PDF or text.');
    } finally {
      setIsExtracting(false);
    }
  };

  const handleConfirmImport = async () => {
    if (!extractedData) return;
    await onImportExtracted(extractedData, importTitle, importAsMaster);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center">
              <Upload className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Import Resume Document
              </h3>
              <p className="text-[11px] text-slate-500">
                pypdf text extraction + Google Gemini structured field parsing
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border border-red-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {!extractedData ? (
            /* Upload stage */
            <div className="space-y-4">
              <label className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-brand-500 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors text-center">
                <FileText className="w-10 h-10 text-slate-400 mb-2" />
                <span className="text-xs font-semibold text-slate-900 dark:text-white">
                  {file ? file.name : 'Click or drag PDF / DOCX / TXT file here'}
                </span>
                <span className="text-[10px] text-slate-400 mt-1">
                  Supported formats: PDF, TXT (Maximum file size: 8MB)
                </span>
                <input
                  type="file"
                  accept=".pdf,.txt,.md"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>

              {file && (
                <button
                  onClick={handleUploadAndParse}
                  disabled={isExtracting}
                  className="w-full py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-50"
                >
                  {isExtracting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Extracting with Gemini...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Extract & Review Fields</span>
                    </>
                  )}
                </button>
              )}
            </div>
          ) : (
            /* Review Screen before importing */
            <div className="space-y-4 text-xs">
              <div className="p-3 rounded-xl bg-emerald-50 text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200">
                <span className="font-bold block mb-0.5">Extraction Successful</span>
                Review the parsed information below. No facts were fabricated.
              </div>

              <div className="space-y-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Version Title
                  </label>
                  <input
                    type="text"
                    value={importTitle}
                    onChange={(e) => setImportTitle(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                  />
                </div>

                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800 space-y-1.5">
                  <div className="font-semibold text-slate-900 dark:text-white">
                    Parsed Candidate
                  </div>
                  <div className="text-slate-600 dark:text-slate-400">
                    {extractedData.contact.full_name} • {extractedData.contact.email}
                  </div>
                  {extractedData.summary && (
                    <div className="text-[11px] text-slate-500 italic mt-1">
                      "{extractedData.summary}"
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2 rounded bg-slate-50 dark:bg-slate-800">
                    <span className="font-bold">Education:</span>{' '}
                    {extractedData.education.length} entries
                  </div>
                  <div className="p-2 rounded bg-slate-50 dark:bg-slate-800">
                    <span className="font-bold">Skills:</span>{' '}
                    {extractedData.skills.reduce((acc, s) => acc + s.items.length, 0)} skills
                  </div>
                  <div className="p-2 rounded bg-slate-50 dark:bg-slate-800">
                    <span className="font-bold">Projects:</span>{' '}
                    {extractedData.projects.length} projects
                  </div>
                  <div className="p-2 rounded bg-slate-50 dark:bg-slate-800">
                    <span className="font-bold">Experience:</span>{' '}
                    {extractedData.experience.length} experiences
                  </div>
                </div>

                <label className="flex items-center gap-2 cursor-pointer pt-2">
                  <input
                    type="checkbox"
                    checked={importAsMaster}
                    onChange={(e) => setImportAsMaster(e.target.checked)}
                    className="rounded text-brand-600 focus:ring-0"
                  />
                  <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                    Make this my new Master Profile
                  </span>
                </label>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={handleConfirmImport}
                  className="flex-1 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs"
                >
                  Confirm & Import Document
                </button>
                <button
                  onClick={() => setExtractedData(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50"
                >
                  Back
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


/* =========================================================================
 * 2. Compare Versions Modal (Requirement 3)
 * ========================================================================= */
interface CompareVersionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  resumes: ResumeVersionSummary[];
  activeResumeId: string;
}

export const CompareVersionsModal: React.FC<CompareVersionsModalProps> = ({
  isOpen,
  onClose,
  resumes,
  activeResumeId
}) => {
  const [leftId, setLeftId] = useState<string>(activeResumeId);
  const [rightId, setRightId] = useState<string>(
    resumes.find((r) => r.id !== activeResumeId)?.id || activeResumeId
  );

  if (!isOpen) return null;

  const leftResume = resumes.find((r) => r.id === leftId);
  const rightResume = resumes.find((r) => r.id === rightId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-4xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <SplitSquareVertical className="w-5 h-5 text-brand-600" />
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Compare Resume Versions Side by Side
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto grid grid-cols-2 gap-6 text-xs">
          {/* Left Column */}
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">
                Version A
              </label>
              <select
                value={leftId}
                onChange={(e) => setLeftId(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border rounded-lg p-2 font-semibold"
              >
                {resumes.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.title} ({r.target_role})
                  </option>
                ))}
              </select>
            </div>

            {leftResume && (
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-900 dark:text-white">ATS Quality Score</span>
                  <span className="text-lg font-black text-brand-600">{leftResume.ats_score}/100</span>
                </div>
                <div>
                  <span className="font-medium text-slate-500">Target Role:</span>{' '}
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{leftResume.target_role}</span>
                </div>
                <div>
                  <span className="font-medium text-slate-500">Template:</span>{' '}
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{leftResume.template_id}</span>
                </div>
                <div>
                  <span className="font-medium text-slate-500">Evidence Claims:</span>{' '}
                  <span className="font-semibold text-emerald-600">{leftResume.evidence_backed_claims} verified</span>
                </div>
                <div className="text-[11px] text-slate-500 italic pt-2 border-t">
                  "{leftResume.summary || 'No summary set'}"
                </div>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">
                Version B
              </label>
              <select
                value={rightId}
                onChange={(e) => setRightId(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border rounded-lg p-2 font-semibold"
              >
                {resumes.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.title} ({r.target_role})
                  </option>
                ))}
              </select>
            </div>

            {rightResume && (
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-900 dark:text-white">ATS Quality Score</span>
                  <span className="text-lg font-black text-brand-600">{rightResume.ats_score}/100</span>
                </div>
                <div>
                  <span className="font-medium text-slate-500">Target Role:</span>{' '}
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{rightResume.target_role}</span>
                </div>
                <div>
                  <span className="font-medium text-slate-500">Template:</span>{' '}
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{rightResume.template_id}</span>
                </div>
                <div>
                  <span className="font-medium text-slate-500">Evidence Claims:</span>{' '}
                  <span className="font-semibold text-emerald-600">{rightResume.evidence_backed_claims} verified</span>
                </div>
                <div className="text-[11px] text-slate-500 italic pt-2 border-t">
                  "{rightResume.summary || 'No summary set'}"
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};


/* =========================================================================
 * 3. Best Resume Recommendation Modal (Requirement 8)
 * ========================================================================= */
interface RecommendationModalProps {
  isOpen: boolean;
  onClose: () => void;
  recommendation: BestRecommendation | null;
  onSelectRecommended: (id: string) => void;
}

export const RecommendationModal: React.FC<RecommendationModalProps> = ({
  isOpen,
  onClose,
  recommendation,
  onSelectRecommended
}) => {
  if (!isOpen || !recommendation) return null;
  const best = recommendation.recommended_version;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4 text-xs">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Recommended Resume Version
              </h3>
              <p className="text-[11px] text-slate-500">
                Target Role: {recommendation.target_role}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded hover:bg-slate-100 text-slate-400">
            <X className="w-4 h-4" />
          </button>
        </div>

        {best ? (
          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 space-y-2">
              <div className="flex justify-between items-baseline">
                <span className="font-bold text-sm text-emerald-950 dark:text-emerald-200">
                  {best.title}
                </span>
                <span className="text-base font-black text-emerald-600">
                  {best.overall_score}/100
                </span>
              </div>
              <div className="text-[11px] text-slate-600 dark:text-slate-300">
                Grounded on {best.evidence_backed_claims} verified evidence claims.
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="font-bold text-slate-900 dark:text-white block">
                Why this version is recommended:
              </span>
              <ul className="space-y-1 text-slate-600 dark:text-slate-300">
                {recommendation.reasons.map((r, idx) => (
                  <li key={idx} className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => {
                onSelectRecommended(best.id);
                onClose();
              }}
              className="w-full py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-sm"
            >
              <span>Open & Edit Recommended Version</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <p className="text-slate-500">No versions available to evaluate.</p>
        )}

        <div className="text-[10px] text-slate-400 italic text-center">
          {recommendation.disclaimer}
        </div>
      </div>
    </div>
  );
};
