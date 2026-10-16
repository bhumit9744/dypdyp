import React, { useState } from 'react';
import {
  Building2,
  ExternalLink,
  Users,
  Search,
  Briefcase,
  MapPin,
  CheckCircle2,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  Layers,
  GraduationCap
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Company } from '../../types';

export const CompaniesSubSection: React.FC = () => {
  const {
    companies,
    searchQuery,
    setSearchQuery,
    setExploreCompanyFilter,
    setCurrentSubSection
  } = useApp();

  const [filterTier, setFilterTier] = useState<string>('All');
  const [filterVacancyOnly, setFilterVacancyOnly] = useState<boolean>(false);

  const filteredCompanies = companies.filter((company) => {
    const matchesSearch =
      searchQuery.trim() === '' ||
      company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.products.some((p) => p.toLowerCase().includes(searchQuery.toLowerCase())) ||
      company.requiredSkills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesTier = filterTier === 'All' || company.tier === filterTier;
    const matchesVacancy = !filterVacancyOnly || company.openRolesCount > 0;

    return matchesSearch && matchesTier && matchesVacancy;
  });

  const handleViewOpenings = (companyName: string) => {
    setExploreCompanyFilter(companyName);
    setCurrentSubSection('jobs-internships');
  };

  const handleViewAlumni = () => {
    setCurrentSubSection('people-referrals');
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Employer Directory & Companies
                <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-brand-100 dark:bg-brand-900/60 text-brand-700 dark:text-brand-300">
                  {companies.length} Profiles
                </span>
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Research hiring partners, product suites, historical recruitment records, and alumni networks.
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={filterTier}
            onChange={(e) => setFilterTier(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 text-xs font-medium text-slate-700 dark:text-slate-200 focus:outline-none focus:border-brand-500"
          >
            <option value="All">All Partner Tiers</option>
            <option value="Super Dream">Super Dream (&gt;20 LPA)</option>
            <option value="Dream">Dream (10-20 LPA)</option>
            <option value="Core">Core Engineering</option>
          </select>

          <button
            onClick={() => setFilterVacancyOnly(!filterVacancyOnly)}
            className={`px-3 py-2 rounded-xl text-xs font-medium transition-colors flex items-center space-x-1.5 ${
              filterVacancyOnly
                ? 'bg-brand-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Active Vacancies Only</span>
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search companies by name, product (e.g. AWS, Photoshop), or required skill..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-brand-500 shadow-xs"
        />
      </div>

      {/* Grid of Companies */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredCompanies.length === 0 ? (
          <div className="col-span-full p-12 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <Building2 className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto" />
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mt-2">
              No matching companies found.
            </p>
            <p className="text-xs text-slate-400">Try adjusting your tier filter or search terms.</p>
          </div>
        ) : (
          filteredCompanies.map((company) => {
            const hasVacancies = company.openRolesCount > 0;

            return (
              <div
                key={company.id}
                className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-4 hover:border-brand-500/40 transition-all"
              >
                {/* Top Header */}
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center space-x-3.5">
                      <img
                        src={company.logo}
                        alt={company.name}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-800 shadow-xs"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-bold text-base text-slate-900 dark:text-white">
                            {company.name}
                          </h3>
                          <span
                            className={`text-[9px] font-semibold px-1.5 py-0.2 rounded border ${
                              company.dataSource === 'Source Verified'
                                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                                : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                            }`}
                          >
                            {company.dataSource}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <span>{company.industry}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            {company.headquarters}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-brand-50 text-brand-700 dark:bg-brand-950/80 dark:text-brand-300 border border-brand-200/60 dark:border-brand-800">
                        {company.tier}
                      </span>
                      {hasVacancies ? (
                        <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          {company.openRolesCount} Active Roles
                        </span>
                      ) : (
                        <span className="text-[10px] font-medium text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                          0 Vacancies (Discoverable)
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {company.description}
                  </p>

                  {/* Core Products / Offerings */}
                  {company.products && company.products.length > 0 && (
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                        <Layers className="w-3 h-3" />
                        Key Products & Ecosystem:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {company.products.map((prod, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-md text-[11px] bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-medium"
                          >
                            {prod}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Metrics Strip */}
                  <div className="grid grid-cols-3 gap-2 text-xs p-3 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800/80">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">Compensation</span>
                      <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                        {company.packageRange}
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">Min CGPA</span>
                      <p className="font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                        {company.eligibilityCgpa} CGPA
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">Campus Alumni</span>
                      <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                        {company.hiredAlumniCount} Hired
                      </p>
                    </div>
                  </div>

                  {/* Historical Hiring Transparency */}
                  <div className="p-2.5 rounded-xl bg-slate-100/60 dark:bg-slate-850/60 border border-slate-200/60 dark:border-slate-800/60 text-xs">
                    <span className="font-semibold text-slate-700 dark:text-slate-300 block mb-0.5">
                      Historical Hiring Track Record:
                    </span>
                    {company.historicalHiringDisclosed && company.historicalHiringSummary ? (
                      <p className="text-slate-600 dark:text-slate-400 text-[11px]">
                        {company.historicalHiringSummary}
                      </p>
                    ) : (
                      <p className="text-slate-400 text-[11px] italic">
                        Historical batch hiring details not officially released for public review.
                      </p>
                    )}
                  </div>

                  {/* Required Tech Competencies */}
                  <div className="space-y-1">
                    <span className="text-[11px] font-semibold text-slate-400">
                      Primary Tech Stack:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {company.requiredSkills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded text-[11px] bg-slate-200/70 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Relevant Alumni Mentors */}
                  {company.relevantAlumniNames && company.relevantAlumniNames.length > 0 && (
                    <div className="flex items-center justify-between text-xs pt-1">
                      <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        <GraduationCap className="w-3.5 h-3.5 text-amber-500" />
                        Alumni at {company.name}:
                      </span>
                      <button
                        onClick={handleViewAlumni}
                        className="text-[11px] text-brand-600 dark:text-brand-400 hover:underline font-semibold"
                      >
                        {company.relevantAlumniNames.join(', ')} →
                      </button>
                    </div>
                  )}
                </div>

                {/* Footer Actions */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center space-x-3">
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noreferrer"
                      className="text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
                    >
                      Website
                    </a>
                    <span>•</span>
                    <a
                      href={company.careerPageUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-slate-500 hover:text-brand-600 dark:hover:text-brand-400 font-medium"
                    >
                      <span>Careers Portal</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  {hasVacancies ? (
                    <button
                      onClick={() => handleViewOpenings(company.name)}
                      className="px-3.5 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold transition-colors flex items-center space-x-1 shadow-xs"
                    >
                      <span>View Openings</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <a
                      href={company.careerPageUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center space-x-1 text-[11px]"
                    >
                      <span>Off-Campus Portal</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
