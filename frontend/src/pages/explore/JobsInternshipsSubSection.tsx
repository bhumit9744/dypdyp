import React, { useState } from 'react';
import {
  Briefcase,
  Search,
  Filter,
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  AlertTriangle,
  Building2,
  MapPin,
  Clock,
  Sparkles,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  ShieldCheck,
  UserCheck,
  GraduationCap,
  X,
  FileCheck2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { JobOpening } from '../../types';

export const JobsInternshipsSubSection: React.FC = () => {
  const {
    jobs,
    applyToJob,
    toggleSaveJob,
    searchQuery,
    setSearchQuery,
    exploreCompanyFilter,
    setExploreCompanyFilter,
    skills: userSkills
  } = useApp();

  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedTier, setSelectedTier] = useState<string>('All');
  const [selectedWorkType, setSelectedWorkType] = useState<string>('All');
  const [showSavedOnly, setShowSavedOnly] = useState<boolean>(false);
  const [showAlumniSharedOnly, setShowAlumniSharedOnly] = useState<boolean>(false);
  const [expandedReasonJobId, setExpandedReasonJobId] = useState<string | null>(null);

  // Extract student verified skill names for instant match highlighting
  const studentSkillNames = userSkills.map((s) => s.name.toLowerCase());

  const filteredJobs = jobs.filter((job) => {
    // If filtered by company from Companies module
    if (exploreCompanyFilter && job.companyName.toLowerCase() !== exploreCompanyFilter.toLowerCase()) {
      return false;
    }

    const matchesSearch =
      searchQuery.trim() === '' ||
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.requiredSkills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
      job.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesType = selectedType === 'All' || job.opportunityType === selectedType;
    const matchesTier = selectedTier === 'All' || job.tier === selectedTier;
    const matchesWork = selectedWorkType === 'All' || job.workType === selectedWorkType;
    const matchesSaved = !showSavedOnly || job.isSaved;
    const matchesAlumniShared = !showAlumniSharedOnly || job.isAlumniShared;

    return matchesSearch && matchesType && matchesTier && matchesWork && matchesSaved && matchesAlumniShared;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Banner / Header */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Jobs & Internships
                <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-brand-100 dark:bg-brand-900/60 text-brand-700 dark:text-brand-300">
                  {filteredJobs.length} Available
                </span>
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Searchable on-campus drives, direct corporate postings, and verified alumni-shared openings.
              </p>
            </div>
          </div>
        </div>

        {/* Company filter active badge */}
        {exploreCompanyFilter && (
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-xs text-indigo-700 dark:text-indigo-300">
            <span>Filtered by: <strong>{exploreCompanyFilter}</strong></span>
            <button
              onClick={() => setExploreCompanyFilter(null)}
              className="p-1 rounded-md hover:bg-indigo-200 dark:hover:bg-indigo-900 transition-colors"
              title="Clear company filter"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Filter and Quick Toggle Toolbar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Search Bar */}
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by role, company, or tech stack (e.g. React, Python, Go)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-brand-500"
            />
          </div>

          {/* Opportunity Type */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-2 rounded-xl text-xs font-medium bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none focus:border-brand-500"
          >
            <option value="All">All Opportunity Types</option>
            <option value="Full-time">Full-time Roles</option>
            <option value="Summer Internship">Summer Internships</option>
            <option value="6-Month Co-op">6-Month Co-ops</option>
            <option value="Startup Internship">Startup Internships</option>
          </select>

          {/* Tier */}
          <select
            value={selectedTier}
            onChange={(e) => setSelectedTier(e.target.value)}
            className="px-3 py-2 rounded-xl text-xs font-medium bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none focus:border-brand-500"
          >
            <option value="All">All Compensation Tiers</option>
            <option value="Super Dream">Super Dream (&gt;20 LPA)</option>
            <option value="Dream">Dream (10-20 LPA)</option>
            <option value="Core">Core Engineering</option>
            <option value="Startup">High-Growth Startup</option>
          </select>

          {/* Work Model */}
          <select
            value={selectedWorkType}
            onChange={(e) => setSelectedWorkType(e.target.value)}
            className="px-3 py-2 rounded-xl text-xs font-medium bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none focus:border-brand-500"
          >
            <option value="All">All Locations</option>
            <option value="Hybrid">Hybrid</option>
            <option value="Remote">Remote</option>
            <option value="On-site">On-site</option>
          </select>
        </div>

        {/* Quick Toggles */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
          <button
            onClick={() => setShowSavedOnly(!showSavedOnly)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center space-x-1.5 ${
              showSavedOnly
                ? 'bg-brand-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Saved Jobs</span>
          </button>

          <button
            onClick={() => setShowAlumniSharedOnly(!showAlumniSharedOnly)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center space-x-1.5 ${
              showAlumniSharedOnly
                ? 'bg-amber-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Alumni Shared Only</span>
          </button>

          {(selectedType !== 'All' || selectedTier !== 'All' || selectedWorkType !== 'All' || showSavedOnly || showAlumniSharedOnly || searchQuery || exploreCompanyFilter) && (
            <button
              onClick={() => {
                setSelectedType('All');
                setSelectedTier('All');
                setSelectedWorkType('All');
                setShowSavedOnly(false);
                setShowAlumniSharedOnly(false);
                setSearchQuery('');
                setExploreCompanyFilter(null);
              }}
              className="text-xs text-rose-600 dark:text-rose-400 hover:underline ml-auto font-medium"
            >
              Reset all filters
            </button>
          )}
        </div>
      </div>

      {/* Listings Feed */}
      <div className="space-y-4">
        {filteredJobs.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
            <Briefcase className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto" />
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              No matching job opportunities found.
            </p>
            <p className="text-xs text-slate-400">Try adjusting your keyword search, tier, or type filters.</p>
          </div>
        ) : (
          filteredJobs.map((job) => {
            const isExpanded = expandedReasonJobId === job.id;

            return (
              <div
                key={job.id}
                className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-brand-500/40 transition-all space-y-4"
              >
                {/* Duplicate Notice Banner (if detected) */}
                {job.isDuplicateDetected && (
                  <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/40 flex items-start space-x-2 text-xs text-amber-800 dark:text-amber-200">
                    <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold">Duplicate Post Detection Notice: </span>
                      <span>{job.duplicateNotice}</span>
                    </div>
                  </div>
                )}

                {/* Main Card Header */}
                <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                  <div className="flex items-start space-x-4">
                    <img
                      src={job.companyLogo}
                      alt={job.companyName}
                      className="w-14 h-14 rounded-2xl object-cover border border-slate-200 dark:border-slate-800 shadow-xs shrink-0"
                    />
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-base font-bold text-slate-900 dark:text-white">
                          {job.title}
                        </h2>
                        {/* Alumni Shared Label */}
                        {job.isAlumniShared && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-300/60 dark:border-amber-800">
                            <UserCheck className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                            Alumni shared
                          </span>
                        )}
                        {/* Data Source Flag */}
                        <span
                          className={`text-[10px] font-medium px-2 py-0.5 rounded-md border ${
                            job.dataSource === 'Source Verified'
                              ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                          }`}
                        >
                          {job.dataSource}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                        <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                          <Building2 className="w-3.5 h-3.5 text-slate-400" />
                          {job.companyName}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          {job.location} ({job.workType})
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          Apply by {job.deadline}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Compensation & Save Job */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2">
                    <div className="text-left sm:text-right">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                        {job.opportunityType}
                      </span>
                      <span className="text-base font-extrabold text-brand-600 dark:text-brand-400">
                        {job.salaryOrStipendText}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => toggleSaveJob(job.id)}
                        className={`p-2 rounded-xl border transition-colors ${
                          job.isSaved
                            ? 'bg-brand-50 border-brand-300 text-brand-600 dark:bg-brand-950/60 dark:border-brand-800 dark:text-brand-400'
                            : 'border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}
                        title={job.isSaved ? 'Saved opportunity' : 'Save opportunity'}
                      >
                        {job.isSaved ? (
                          <BookmarkCheck className="w-4 h-4 fill-brand-600 dark:fill-brand-400" />
                        ) : (
                          <Bookmark className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Alumni Shared Origin Details (if applicable) */}
                {job.isAlumniShared && job.sharedByAlumniName && (
                  <div className="p-2.5 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/40 flex items-center justify-between text-xs text-amber-900 dark:text-amber-200">
                    <div className="flex items-center space-x-2">
                      <GraduationCap className="w-4 h-4 text-amber-600" />
                      <span>
                        Posted by alumnus <strong>{job.sharedByAlumniName}</strong> ({job.sharedByAlumniRole}).
                      </span>
                    </div>
                    <span className="text-[11px] font-semibold text-amber-700 dark:text-amber-300">
                      Alumni Referral Channel Available
                    </span>
                  </div>
                )}

                {/* Job Description Summary */}
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {job.description}
                </p>

                {/* Required Skills & Student Fit Indicators */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      Required Competencies:
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Green badges indicate verified match from your skills inventory
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {job.requiredSkills.map((skill, idx) => {
                      const isMatch = studentSkillNames.includes(skill.toLowerCase());
                      return (
                        <span
                          key={idx}
                          className={`text-xs px-2.5 py-1 rounded-lg font-medium flex items-center space-x-1 ${
                            isMatch
                              ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                          }`}
                        >
                          {isMatch && <CheckCircle2 className="w-3 h-3 text-emerald-500" />}
                          <span>{skill}</span>
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* Eligibility & Matching Engine Strip */}
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center space-x-4 text-slate-600 dark:text-slate-400">
                    <span>
                      Cutoff: <strong className="text-slate-900 dark:text-white">{job.requiredCgpa} CGPA</strong>
                    </span>
                    <span>•</span>
                    <span>
                      Type: <strong className="text-slate-900 dark:text-white">{job.tier}</strong>
                    </span>
                    <span>•</span>
                    <span>
                      Source: <strong className="text-slate-900 dark:text-white">{job.sourceType}</strong>
                    </span>
                  </div>

                  {/* Match Score Indicator */}
                  <button
                    onClick={() => setExpandedReasonJobId(isExpanded ? null : job.id)}
                    className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-brand-50 dark:bg-brand-950/80 text-brand-700 dark:text-brand-300 font-bold hover:bg-brand-100 dark:hover:bg-brand-900 transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-brand-500" />
                    <span>{job.matchScore}% Match Score</span>
                    {isExpanded ? (
                      <ChevronUp className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                {/* Explainable Match Breakdown Drawer */}
                {isExpanded && (
                  <div className="p-4 rounded-xl bg-brand-50/50 dark:bg-brand-950/30 border border-brand-200 dark:border-brand-800/60 space-y-2 text-xs animate-in fade-in duration-200">
                    <h4 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-brand-500" />
                      Algorithmic Match Engine Explainer
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                      <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-brand-100 dark:border-brand-900">
                        <span className="font-semibold text-slate-700 dark:text-slate-300 block">
                          Skills Alignment
                        </span>
                        <p className="text-slate-500 dark:text-slate-400 mt-1">
                          {job.matchReasons.skillsMatch}
                        </p>
                      </div>
                      <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-brand-100 dark:border-brand-900">
                        <span className="font-semibold text-slate-700 dark:text-slate-300 block">
                          Academic Eligibility
                        </span>
                        <p className="text-slate-500 dark:text-slate-400 mt-1">
                          {job.matchReasons.academicMatch}
                        </p>
                      </div>
                      <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-brand-100 dark:border-brand-900">
                        <span className="font-semibold text-slate-700 dark:text-slate-300 block">
                          Project Evidence
                        </span>
                        <p className="text-slate-500 dark:text-slate-400 mt-1">
                          {job.matchReasons.projectMatch}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Card Actions Footer */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center space-x-3 text-xs text-slate-500">
                    {job.sourceUrl && (
                      <a
                        href={job.sourceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 font-medium"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Official Source Link</span>
                      </a>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    {job.applied ? (
                      <div className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 text-xs font-bold border border-emerald-200 dark:border-emerald-800">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        <span>Applied & Tracked in Pipeline</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => applyToJob(job.id)}
                        className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-xs transition-colors flex items-center space-x-1.5"
                      >
                        <FileCheck2 className="w-4 h-4" />
                        <span>Apply & Track</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
