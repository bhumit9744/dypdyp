import React from 'react';
import { ZoomIn, ZoomOut, Maximize2, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { FullResumeDocument, ResumeContent } from '../../../types/resume';
import { ResumeTemplateRenderer } from './ResumeTemplates';

interface ResumeCanvasProps {
  resume: FullResumeDocument;
  zoom: number;
  isEditing: boolean;
  onUpdateContent: (newContent: ResumeContent) => void;
  pageCount: number;
}

export const ResumeCanvas: React.FC<ResumeCanvasProps> = ({
  resume,
  zoom,
  isEditing,
  onUpdateContent,
  pageCount
}) => {
  return (
    <div className="flex-1 overflow-auto bg-slate-100 dark:bg-slate-950 p-6 flex flex-col items-center relative select-text">
      {/* Page length guidance banner */}
      <div className="mb-4 no-print flex items-center gap-2 px-3 py-1.5 rounded-full text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        {pageCount === 1 ? (
          <>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span className="text-slate-600 dark:text-slate-300 font-medium">
              1-Page A4 Standard — Optimal for automated ATS & campus screening
            </span>
          </>
        ) : (
          <>
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
            <span className="text-slate-600 dark:text-slate-300 font-medium">
              Multi-page layout detected ({pageCount} pages). Ensure critical qualifications appear on Page 1.
            </span>
          </>
        )}
      </div>

      {/* A4 Canvas Sheet Container */}
      <div
        className="transition-transform duration-150 ease-out origin-top"
        style={{
          transform: `scale(${zoom / 100})`,
          width: '210mm'
        }}
      >
        <div
          id="resume-print-canvas"
          className="resume-print-container relative bg-white shadow-xl dark:shadow-2xl rounded-sm border border-slate-200/80 dark:border-slate-800 text-slate-900 overflow-hidden"
          style={{
            width: '210mm',
            minHeight: '297mm'
          }}
        >
          {/* Subtle page margin guide during editing */}
          {isEditing && (
            <div className="absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-mono bg-blue-50 text-blue-700 border border-blue-200 no-print z-10 opacity-70 hover:opacity-100 transition-opacity">
              Editable Document Canvas
            </div>
          )}

          {/* Actual Template Content */}
          <ResumeTemplateRenderer
            templateId={resume.template_id || 'classic-professional'}
            content={resume.content}
            styling={resume.styling_config}
            sectionsOrder={resume.sections_order}
            isEditing={isEditing}
            onUpdateContent={onUpdateContent}
          />

          {/* Visual A4 Page 1 Break Indicator (297mm boundary guide) */}
          <div
            className="absolute left-0 right-0 border-b-2 border-dashed border-red-300 pointer-events-none no-print opacity-60 flex items-center justify-end pr-4"
            style={{ top: '297mm' }}
          >
            <span className="bg-red-50 text-red-600 font-mono text-[9px] px-1.5 py-0.5 rounded-t border-t border-l border-r border-red-200">
              Page 1 End (297mm)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
