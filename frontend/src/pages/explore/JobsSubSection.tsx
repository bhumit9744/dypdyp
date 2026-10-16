import React, { useState } from 'react';
import {
  Briefcase,
  Search,
  Filter,
  Star,
  CheckCircle2,
  AlertTriangle,
  Building2,
  MapPin,
  Clock,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Info
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { JobOpening } from '../../types';

export const JobsSubSection: React.FC = () => {
  const { jobs, applyToJob, searchQuery } = useApp();
  const [selectedTier, setSelectedTier] = useState<string>('All');
  const [selectedWorkType, setSelectedWorkType] = useState<string>('All');
  const [expandedReasonJobId, setExpandedReasonJobId] = useState<string | null>(null);

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.requiredSkills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesTier = selectedTier === 'All' || job.tier === selectedTier;
    const matchesWork = selectedWorkType === 'All' || job.workType === selectedWorkType;

    return matchesSearch && matchesTier && matchesWork;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header and Controls */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-brand-600" />
            Active Campus Recruitment Drives
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Verified eligible job openings curated directly by the D.Y. Patil TPO Placement Cell.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedTier}
            onChange={(e) => setSelectedTier(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 text-xs text-slate-700 dark:text-slate-200 font-medium focus:outline-none"
          >
            <option value="All">All Tiers</option>
            <option value="Super Dream">Super Dream (&gt;20 LPA)</option>
            <option value="Dream">Dream (10-20 LPA)</option>
            <option value="Core">Core Engineering</option>
          </select>

          <select
            value={selectedWorkType}
            onChange={(e) => setSelectedWorkType(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 text-xs text-slate-700 dark:text-slate-200 font-medium focus:outline-none"
          >
            <option value="All">All Work Models</option>
            <option value="Hybrid">Hybrid</option>
            <option value="Remote">Remote</option>
            <option value="On-site">On-site</option>
          </select>
        </div>
      </div>

      {/* Jobs Feed */}
      <div className="space-y-4">
        {filteredJobs.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              No matching job drives found.
            </p>
            <p className="text-xs text-slate-400 mt-1">Try resetting your search query or tier filters.</p>
          </div>
        ) : (
          filteredJobs.map((job) => (
            <div
              key={job.id}
              className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-brand-500/50 transition-all space-y-4"
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

              {/* Job Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex items-start space-x-4">
                  <img
                    src={job.companyLogo}
                    alt={job.companyName}
                    className="w-14 h-14 rounded-2xl object-cover border border-slate-200 dark:border-slate-800 shadow-xs"
                  />
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-bold text-base text-slate-900 dark:text-white">
                        {job.title}
                      </h3>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300 border border-brand-100 dark:border-brand-900">
                        {job.tier}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                      <span className="font-medium text-slate-700 dark:text-slate-300">
                        {job.companyName}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {job.location} ({job.workType})
                      </span>
                      <span>•</span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        ₹ {job.packageLpa} LPA CTC
                      </span>
                      <span>•</span>
                      <span>Min CGPA: {job.requiredCgpa}</span>
                    </div>
                  </div>
                </div>

                {/* Match Score Badge */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0">
                  <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-bold text-xs border border-emerald-200 dark:border-emerald-800/40">
                    <Star className="w-4 h-4 fill-emerald-500 text-emerald-500" />
                    <span>{job.matchScore}% Match</span>
                  </div>
                  <span className="text-[11px] text-slate-400">Apply by: {job.deadline}</span>
                </div>
              </div>

              {/* Description Snippet */}
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {job.description}
              </p>

              {/* Required Skills Tags */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] text-slate-400 font-medium mr-1">Required:</span>
                {job.requiredSkills.map((skill, sIdx) => (
                  <span
                    key={sIdx}
                    className="px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              {/* Explainable Match Score Accordion */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() =>
                    setExpandedReasonJobId(expandedReasonJobId === job.id ? null : job.id)
                  }
                  className="flex items-center space-x-1.5 text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>
                    {expandedReasonJobId === job.id ? 'Hide Match Rationale' : 'Explain Why You Match (AI Verified)'}
                  </span>
                  {expandedReasonJobId === job.id ? (
                    <ChevronUp className="w-3 h-3" />
                  ) : (
                    <ChevronDown className="w-3 h-3" />
                  )}
                </button>

                {expandedReasonJobId === job.id && (
                  <div className="mt-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800/80 text-xs space-y-2">
                    <div className="flex items-start space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-slate-800 dark:text-slate-200">Skill Alignment: </strong>
                        <span className="text-slate-600 dark:text-slate-300">
                          {job.matchReasons.skillsMatch}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-slate-800 dark:text-slate-200">Academic Standing: </strong>
                        <span className="text-slate-600 dark:text-slate-300">
                          {job.matchReasons.academicMatch}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-slate-800 dark:text-slate-200">Project Evidence: </strong>
                        <span className="text-slate-600 dark:text-slate-300">
                          {job.matchReasons.projectMatch}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Actions */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-slate-400">
                  Verified campus direct drive • No off-campus agency markup
                </span>

                {job.applied ? (
                  <span className="px-4 py-2 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 font-semibold text-xs flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    Applied & Active in Tracker
                  </span>
                ) : (
                  <button
                    onClick={() => applyToJob(job.id)}
                    className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs shadow-sm transition-all"
                  >
                    Submit Application
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
