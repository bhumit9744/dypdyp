import React from 'react';
import {
  Users,
  GraduationCap,
  MapPin,
  MessageSquare,
  Sparkles,
  UserCheck
} from 'lucide-react';
import { LinkedinIcon } from '../../components/common/Icons';
import { useApp } from '../../context/AppContext';

export const AlumniSubSection: React.FC = () => {
  const { alumni, searchQuery, setCurrentSubSection } = useApp();

  const filtered = alumni.filter((a) => {
    return (
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.department.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Banner */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-brand-600" />
            Verified Alumni Network
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Connect directly with verified engineering graduates placed at technology product companies.
          </p>
        </div>

        <button
          onClick={() => setCurrentSubSection('referrals')}
          className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Referral Opportunities</span>
        </button>
      </div>

      {/* Grid or Honest Empty State */}
      {filtered.length === 0 ? (
        <div className="p-10 rounded-2xl bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-800 text-center space-y-3 max-w-2xl mx-auto">
          <div className="w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
            <UserCheck className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            No Verified Alumni Profiles Found
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            In accordance with the Live Data Only policy, no fabricated or simulated alumni profiles are seeded. Alumni profiles appear here when verified graduates register their professional coordinates or sync via official college alumni portals.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {filtered.map((alumnus) => (
            <div
              key={alumnus.id}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-4 hover:border-brand-500/40 transition-colors"
            >
              <div className="space-y-3">
                <div className="flex items-center space-x-3.5">
                  {alumnus.avatar ? (
                    <img
                      src={alumnus.avatar}
                      alt={alumnus.name}
                      className="w-12 h-12 rounded-xl object-cover ring-2 ring-brand-500/20"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-brand-100 dark:bg-brand-950 flex items-center justify-center text-brand-600 font-bold text-sm">
                      {alumnus.name[0]}
                    </div>
                  )}
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                      {alumnus.name}
                    </h3>
                    <p className="text-xs font-medium text-brand-600 dark:text-brand-400">
                      {alumnus.company}
                    </p>
                    <p className="text-[11px] text-slate-500">{alumnus.role}</p>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-850 text-xs space-y-1">
                  <div className="flex items-center space-x-1.5 text-slate-600 dark:text-slate-300">
                    <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                    <span>{alumnus.batch} • {alumnus.department}</span>
                  </div>
                  <div className="flex items-center space-x-1.5 text-slate-500">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{alumnus.location}</span>
                  </div>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-1.5">
                  {alumnus.willingToRefer && (
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900">
                      ✓ Open to Refer
                    </span>
                  )}
                  {alumnus.mentorshipAvailable && (
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300 border border-brand-200 dark:border-brand-900">
                      ★ Mentorship Ready
                    </span>
                  )}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                {alumnus.linkedinUrl ? (
                  <a
                    href={alumnus.linkedinUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-slate-500 hover:text-blue-600 flex items-center gap-1 font-medium"
                  >
                    <LinkedinIcon className="w-3.5 h-3.5" />
                    <span>LinkedIn</span>
                  </a>
                ) : (
                  <span></span>
                )}

                <button
                  onClick={() => alert(`Connection request sent to ${alumnus.name}.`)}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs flex items-center gap-1 transition-colors"
                >
                  <MessageSquare className="w-3 h-3" />
                  <span>Reach Out</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
