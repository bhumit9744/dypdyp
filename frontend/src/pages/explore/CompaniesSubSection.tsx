import React, { useState } from 'react';
import {
  Building2,
  ExternalLink,
  Users,
  Award,
  Calendar,
  Briefcase,
  Search
} from 'lucide-react';
import { mockCompanies } from '../../mock/data';
import { useApp } from '../../context/AppContext';

export const CompaniesSubSection: React.FC = () => {
  const { searchQuery, setCurrentSection, setCurrentSubSection } = useApp();
  const [filterTier, setFilterTier] = useState<string>('All');

  const filtered = mockCompanies.filter((comp) => {
    const matchesSearch =
      comp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comp.industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comp.requiredSkills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesTier = filterTier === 'All' || comp.tier === filterTier;
    return matchesSearch && matchesTier;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Building2 className="w-5 h-5 text-brand-600" />
            Partner Companies & Campus Recruiters
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Browse corporate partners visiting D.Y. Patil College of Engineering with confirmed recruitment quotas.
          </p>
        </div>

        <select
          value={filterTier}
          onChange={(e) => setFilterTier(e.target.value)}
          className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 text-xs font-medium text-slate-700 dark:text-slate-200 focus:outline-none"
        >
          <option value="All">All Tiers</option>
          <option value="Super Dream">Super Dream Tier</option>
          <option value="Dream">Dream Tier</option>
        </select>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map((company) => (
          <div
            key={company.id}
            className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-4 hover:border-brand-500/40 transition-colors"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3.5">
                  <img
                    src={company.logo}
                    alt={company.name}
                    className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-800"
                  />
                  <div>
                    <h3 className="font-bold text-base text-slate-900 dark:text-white">
                      {company.name}
                    </h3>
                    <p className="text-xs text-slate-500">{company.industry}</p>
                  </div>
                </div>

                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300">
                  {company.tier}
                </span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {company.description}
              </p>

              <div className="grid grid-cols-2 gap-2 text-xs p-3 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800/80">
                <div>
                  <span className="text-[11px] text-slate-400">Package Range</span>
                  <p className="font-bold text-slate-800 dark:text-slate-200">{company.packageRange}</p>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400">Min CGPA Cutoff</span>
                  <p className="font-bold text-emerald-600 dark:text-emerald-400">
                    {company.eligibilityCgpa} CGPA
                  </p>
                </div>
                <div className="pt-1">
                  <span className="text-[11px] text-slate-400">Alumni Hired</span>
                  <p className="font-medium text-slate-700 dark:text-slate-300">
                    {company.hiredAlumniCount} Engineers
                  </p>
                </div>
                <div className="pt-1">
                  <span className="text-[11px] text-slate-400">On-Campus Date</span>
                  <p className="font-medium text-brand-600 dark:text-brand-400">
                    {company.visitedDate}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {company.requiredSkills.map((skill, sIdx) => (
                  <span
                    key={sIdx}
                    className="px-2 py-0.5 rounded-md text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <a
                href={company.website}
                target="_blank"
                rel="noreferrer"
                className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1 font-medium"
              >
                <span>Company Portal</span>
                <ExternalLink className="w-3 h-3" />
              </a>

              <button
                onClick={() => {
                  setCurrentSection('explore');
                  setCurrentSubSection('jobs');
                }}
                className="text-brand-600 dark:text-brand-400 font-semibold hover:underline flex items-center gap-1"
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>{company.openRolesCount} Openings Listed</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
