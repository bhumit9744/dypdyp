import React from 'react';
import {
  CalendarDays,
  Clock,
  UserCheck,
  CheckSquare,
  Square,
  ExternalLink,
  AlertCircle,
  FileText
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const InterviewsSubSection: React.FC = () => {
  const { interviews, toggleInterviewChecklist } = useApp();

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-brand-600" />
            Interview Desk & Live Preparation Deck
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Confirmed interview slots, virtual room URLs, and interactive prep checklists.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="px-3 py-1.5 rounded-xl bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300 text-xs font-semibold">
            {interviews.length} Scheduled Rounds
          </span>
        </div>
      </div>

      {/* Interviews List */}
      <div className="space-y-5">
        {interviews.map((interview) => (
          <div
            key={interview.id}
            className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5 hover:border-brand-500/40 transition-colors"
          >
            {/* Top Bar */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="flex items-start space-x-4">
                <img
                  src={interview.companyLogo}
                  alt={interview.companyName}
                  className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-800 shadow-xs"
                />
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-bold text-base text-slate-900 dark:text-white">
                      {interview.companyName}
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300">
                      {interview.roleTitle}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {interview.roundName}
                  </p>
                  <p className="text-xs text-slate-500 flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{interview.date} • {interview.time} ({interview.durationMinutes} mins)</span>
                  </p>
                </div>
              </div>

              <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0">
                <a
                  href={interview.meetUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-xs transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Join Meeting Room</span>
                </a>
                <span className="text-[11px] text-slate-400">
                  Interviewer: <strong className="text-slate-700 dark:text-slate-200">{interview.interviewer}</strong>
                </span>
              </div>
            </div>

            {/* Preparation Notes */}
            {interview.notes && (
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800/80 text-xs">
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  Interviewer Strategy Focus:
                </span>
                <p className="text-slate-600 dark:text-slate-300 mt-0.5">
                  {interview.notes}
                </p>
              </div>
            )}

            {/* Interactive Checklist */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                Pre-Interview Preparation Checklist (Click to toggle)
              </span>
              <div className="space-y-1.5">
                {interview.preparationChecklist.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => toggleInterviewChecklist(interview.id, idx)}
                    className="w-full text-left flex items-start space-x-2.5 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors text-xs text-slate-700 dark:text-slate-300"
                  >
                    {item.done ? (
                      <CheckSquare className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    )}
                    <span className={item.done ? 'line-through text-slate-400' : ''}>
                      {item.item}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
