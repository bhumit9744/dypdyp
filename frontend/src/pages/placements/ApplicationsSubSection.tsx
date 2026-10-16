import React, { useState } from 'react';
import {
  FileCheck2,
  Building,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  ChevronRight,
  Filter
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ApplicationStatus } from '../../types';

export const ApplicationsSubSection: React.FC = () => {
  const { applications, setCurrentSubSection } = useApp();
  const [selectedStatus, setSelectedStatus] = useState<string>('All');

  const filtered = applications.filter((app) => {
    if (selectedStatus === 'All') return true;
    return app.status === selectedStatus;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-brand-600" />
            Applied Campus Opportunities & History
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Track multi-round application milestones, coding rounds, and technical interview stages.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 text-xs font-medium text-slate-700 dark:text-slate-200 focus:outline-none"
          >
            <option value="All">All Statuses ({applications.length})</option>
            <option value="Interview">Interview Stage</option>
            <option value="Screening">Online Screening</option>
            <option value="Offer">Offer Received</option>
          </select>

          <button
            onClick={() => setCurrentSubSection('tracker')}
            className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors"
          >
            Switch to Kanban Tracker
          </button>
        </div>
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        {filtered.map((app) => (
          <div
            key={app.id}
            className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5 hover:border-brand-500/40 transition-colors"
          >
            {/* Top Info Row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <img
                  src={app.companyLogo}
                  alt={app.companyName}
                  className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-800 shadow-xs"
                />
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                      {app.jobTitle}
                    </h3>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                        app.status === 'Offer'
                          ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
                          : app.status === 'Interview'
                          ? 'bg-brand-100 text-brand-800 dark:bg-brand-950 dark:text-brand-300'
                          : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                      }`}
                    >
                      {app.status} Stage
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-slate-500 mt-0.5">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{app.companyName}</span>
                    <span>•</span>
                    <span>₹ {app.packageLpa} LPA</span>
                    <span>•</span>
                    <span>Applied on {app.appliedDate}</span>
                  </div>
                </div>
              </div>

              <div className="text-right sm:text-right">
                <span className="text-xs text-slate-400">Current Round:</span>
                <p className="font-bold text-xs text-slate-800 dark:text-slate-200">{app.currentRound}</p>
                {app.nextStepDeadline && (
                  <span className="text-[11px] text-brand-600 dark:text-brand-400 font-medium">
                    {app.nextStepDeadline}
                  </span>
                )}
              </div>
            </div>

            {/* Timeline Stepper */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-3">
                Placement Journey Milestones
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2">
                {app.timeline.map((step, sIdx) => (
                  <div
                    key={sIdx}
                    className={`p-2.5 rounded-xl text-xs space-y-1 transition-all ${
                      step.current
                        ? 'bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800/60 shadow-xs'
                        : step.completed
                        ? 'bg-slate-50 dark:bg-slate-850/40 text-slate-700 dark:text-slate-300'
                        : 'opacity-50 bg-slate-50/50 dark:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center space-x-1.5">
                      {step.completed ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      ) : step.current ? (
                        <Clock className="w-3.5 h-3.5 text-brand-600 shrink-0 animate-pulse" />
                      ) : (
                        <span className="w-3.5 h-3.5 rounded-full border border-slate-400 shrink-0"></span>
                      )}
                      <span className="font-semibold truncate text-[11px]">{step.step}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 block truncate">{step.date}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
