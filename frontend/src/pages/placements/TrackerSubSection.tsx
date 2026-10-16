import React from 'react';
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  Building2,
  Calendar,
  Award,
  ArrowRight,
  TrendingUp
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ApplicationStatus, Application } from '../../types';

export const TrackerSubSection: React.FC = () => {
  const { applications, setCurrentSubSection } = useApp();

  const columns: { id: ApplicationStatus; label: string; color: string }[] = [
    { id: 'Applied', label: 'Applied', color: 'border-blue-500 text-blue-600 bg-blue-50 dark:bg-blue-950/40' },
    { id: 'Screening', label: 'Screening / OA', color: 'border-amber-500 text-amber-600 bg-amber-50 dark:bg-amber-950/40' },
    { id: 'Interview', label: 'Technical Interview', color: 'border-brand-500 text-brand-600 bg-brand-50 dark:bg-brand-950/40' },
    { id: 'Offer', label: 'Offer Received', color: 'border-emerald-500 text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40' },
    { id: 'Rejected', label: 'Rejected / Closed', color: 'border-slate-500 text-slate-600 bg-slate-50 dark:bg-slate-900' }
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-brand-600" />
            Recruitment Stage Pipeline Tracker
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Visual kanban flow tracking your progression from campus registration to final corporate offer issuance.
          </p>
        </div>

        <button
          onClick={() => setCurrentSubSection('interviews')}
          className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Go to Interview Desk</span>
        </button>
      </div>

      {/* Kanban Board Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {columns.map((col) => {
          const colApps = applications.filter((a) => a.status === col.id);

          return (
            <div
              key={col.id}
              className="flex flex-col rounded-2xl bg-slate-100/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 p-3.5 min-h-[420px]"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200 dark:border-slate-800">
                <span className="font-bold text-xs text-slate-900 dark:text-white truncate">
                  {col.label}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${col.color}`}
                >
                  {colApps.length}
                </span>
              </div>

              {/* Column Cards */}
              <div className="space-y-3 flex-1 overflow-y-auto">
                {colApps.length === 0 ? (
                  <div className="h-32 flex flex-col items-center justify-center text-center p-3 text-slate-400">
                    <p className="text-[11px]">No applications in this phase</p>
                  </div>
                ) : (
                  colApps.map((app) => (
                    <div
                      key={app.id}
                      className="p-4 rounded-xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700/80 shadow-xs space-y-2.5 hover:shadow-md transition-all"
                    >
                      <div className="flex items-center space-x-2.5">
                        <img
                          src={app.companyLogo}
                          alt={app.companyName}
                          className="w-8 h-8 rounded-lg object-cover"
                        />
                        <div className="truncate">
                          <h4 className="font-semibold text-xs text-slate-900 dark:text-white truncate">
                            {app.companyName}
                          </h4>
                          <p className="text-[11px] text-brand-600 dark:text-brand-400 font-bold">
                            ₹ {app.packageLpa} LPA
                          </p>
                        </div>
                      </div>

                      <div className="text-xs text-slate-600 dark:text-slate-300">
                        <span className="font-medium text-slate-800 dark:text-slate-200 block truncate">
                          {app.jobTitle}
                        </span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">
                          {app.currentRound}
                        </span>
                      </div>

                      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
                        <span>Applied {app.appliedDate}</span>
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                          {app.matchScore}% Match
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
