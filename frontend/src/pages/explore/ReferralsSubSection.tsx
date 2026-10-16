import React from 'react';
import {
  GitPullRequest,
  CheckCircle2,
  Clock,
  Send,
  Building,
  User,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ReferralsSubSection: React.FC = () => {
  const { referrals, requestReferral } = useApp();

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <GitPullRequest className="w-5 h-5 text-brand-600" />
            Alumni Employee Referral Board
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Request verified employee internal referrals backed by your audited skill proof score.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="px-3 py-1.5 rounded-xl bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300 font-semibold">
            Auto-Attaches 92 ATS Resume
          </span>
        </div>
      </div>

      {/* Referrals List */}
      <div className="space-y-4">
        {referrals.map((ref) => (
          <div
            key={ref.id}
            className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-brand-500/40 transition-colors"
          >
            <div className="space-y-3 max-w-2xl">
              <div className="flex items-center space-x-3">
                <img
                  src={ref.alumniAvatar}
                  alt={ref.alumniName}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-brand-500/30"
                />
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                      {ref.roleTitle}
                    </h3>
                    <span className="font-semibold text-xs text-brand-600 dark:text-brand-400">
                      @ {ref.companyName}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Posted by {ref.alumniName} • {ref.location}
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800/80 text-xs">
                <span className="font-semibold text-slate-700 dark:text-slate-200">
                  Eligibility Criteria from Alumni:
                </span>
                <p className="text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">
                  {ref.eligibilityNotes}
                </p>
              </div>
            </div>

            <div className="flex md:flex-col items-center md:items-end justify-between gap-3 shrink-0">
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  ref.status === 'Requested'
                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                }`}
              >
                {ref.status === 'Requested' ? 'Request in Review' : 'Open for Requests'}
              </span>

              {ref.status === 'Requested' ? (
                <span className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
                  <Clock className="w-3.5 h-3.5" />
                  Alumni notified
                </span>
              ) : (
                <button
                  onClick={() => requestReferral(ref.id)}
                  className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-xs transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Request Referral</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
