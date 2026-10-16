import React, { useState } from 'react';
import {
  Code2,
  Search,
  Filter,
  DollarSign,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Layers,
  Sparkles,
  ExternalLink,
  Laptop,
  Briefcase,
  HelpCircle,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PracticalExperienceProject } from '../../types';

export const ProjectsFreelanceSubSection: React.FC = () => {
  const {
    projectsFreelance,
    applyToProject,
    searchQuery,
    setSearchQuery
  } = useApp();

  const [selectedCompType, setSelectedCompType] = useState<string>('All');
  const [selectedSponsorType, setSelectedSponsorType] = useState<string>('All');

  const filteredProjects = projectsFreelance.filter((proj) => {
    const matchesSearch =
      searchQuery.trim() === '' ||
      proj.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proj.sponsorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proj.techStack.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      proj.deliverablesSummary.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesComp = selectedCompType === 'All' || proj.compensationType === selectedCompType;
    const matchesSponsor = selectedSponsorType === 'All' || proj.sponsorType === selectedSponsorType;

    return matchesSearch && matchesComp && matchesSponsor;
  });

  const getCompensationBadge = (proj: PracticalExperienceProject) => {
    switch (proj.compensationType) {
      case 'Paid':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
            <DollarSign className="w-3.5 h-3.5" />
            <span>Paid ({proj.compensationAmount || 'Disclosed Stipend'})</span>
          </span>
        );
      case 'Speculative':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Speculative ({proj.compensationAmount || 'Contingent / Grant'})</span>
          </span>
        );
      case 'Portfolio-only':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-sky-50 text-sky-700 dark:bg-sky-950/80 dark:text-sky-300 border border-sky-300 dark:border-sky-800">
            <Laptop className="w-3.5 h-3.5" />
            <span>Portfolio-only (Verified Public Credit)</span>
          </span>
        );
      case 'Unpaid':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-300 dark:border-slate-700">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Unpaid (Academic / Experience Only)</span>
          </span>
        );
      case 'Compensation-unknown':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-orange-50 text-orange-800 dark:bg-orange-950/80 dark:text-orange-300 border border-orange-300 dark:border-orange-800">
            <HelpCircle className="w-3.5 h-3.5 text-orange-500" />
            <span>Compensation-unknown (To be negotiated)</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Projects, Freelance & Experience
                <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-cyan-100 dark:bg-cyan-950/80 text-cyan-800 dark:text-cyan-300">
                  {projectsFreelance.length} Opportunities
                </span>
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Paid freelance contracts, open-source bounties, corporate-sponsored capstones, and startup trial projects.
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Mandatory Compensation Type Filter */}
          <select
            value={selectedCompType}
            onChange={(e) => setSelectedCompType(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 text-xs font-medium text-slate-700 dark:text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            <option value="All">All Compensation Models</option>
            <option value="Paid">Paid Projects Only</option>
            <option value="Speculative">Speculative (Equity / Bonus)</option>
            <option value="Portfolio-only">Portfolio-Only Opportunities</option>
            <option value="Unpaid">Unpaid / Academic Credit</option>
            <option value="Compensation-unknown">Compensation Unknown</option>
          </select>

          {/* Sponsor Type Filter */}
          <select
            value={selectedSponsorType}
            onChange={(e) => setSelectedSponsorType(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 text-xs font-medium text-slate-700 dark:text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            <option value="All">All Sponsor Types</option>
            <option value="Company Sponsored">Company Sponsored Projects</option>
            <option value="Startup Trial">Startup Trial Engagements</option>
            <option value="Open Source">Open Source Contributions</option>
            <option value="Freelance Contract">Freelance Contracts</option>
            <option value="Campus Ambassador">Campus Ambassador Programs</option>
          </select>
        </div>
      </div>

      {/* Unified Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search projects by deliverable, sponsor, or tech stack (e.g. Next.js, FastAPI, Kubernetes)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-cyan-500 shadow-xs"
        />
      </div>

      {/* Projects Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredProjects.length === 0 ? (
          <div className="col-span-full p-12 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <Code2 className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto" />
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mt-2">
              No matching experience projects found.
            </p>
            <p className="text-xs text-slate-400">Try switching your compensation or sponsor filter.</p>
          </div>
        ) : (
          filteredProjects.map((proj) => (
            <div
              key={proj.id}
              className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-4 hover:border-cyan-500/40 transition-all"
            >
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center space-x-3.5">
                    <img
                      src={proj.sponsorLogo}
                      alt={proj.sponsorName}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-800 shadow-xs shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-bold text-base text-slate-900 dark:text-white">
                          {proj.title}
                        </h3>
                        <span
                          className={`text-[9px] font-semibold px-1.5 py-0.2 rounded border ${
                            proj.dataSource === 'Verified Program'
                              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                              : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                          }`}
                        >
                          {proj.dataSource}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">
                        Sponsored by <strong>{proj.sponsorName}</strong> ({proj.sponsorType})
                      </p>
                    </div>
                  </div>

                  <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 shrink-0">
                    {proj.durationWeeks} Weeks
                  </span>
                </div>

                {/* Mandatory Compensation Type Banner */}
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800/80">
                  <span className="text-[11px] font-semibold text-slate-500">
                    Compensation Model:
                  </span>
                  {getCompensationBadge(proj)}
                </div>

                {/* Deliverables Summary */}
                <div className="space-y-1">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase">
                    Deliverables & Scope:
                  </span>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {proj.deliverablesSummary}
                  </p>
                </div>

                {/* Tech Stack Required */}
                <div className="space-y-1">
                  <span className="text-[11px] font-semibold text-slate-400">
                    Core Technologies:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {proj.techStack.map((tech, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded text-[11px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Verification Proof Badge */}
                <div className="p-2.5 rounded-xl bg-cyan-50/60 dark:bg-cyan-950/40 border border-cyan-200/60 dark:border-cyan-900/40 flex items-center justify-between text-xs text-cyan-900 dark:text-cyan-200">
                  <span className="flex items-center gap-1.5 font-medium">
                    <ShieldCheck className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                    <span>Evidence / Credential:</span>
                  </span>
                  <span className="font-bold text-cyan-700 dark:text-cyan-300">
                    {proj.verificationProofBadge || proj.verificationBadgeAwarded || 'Verified Credential Provided'}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400 text-[11px]">
                  Status: <strong className="text-slate-700 dark:text-slate-300">{proj.status}</strong>
                </span>

                <div className="flex items-center space-x-2">
                  {proj.applied ? (
                    <span className="px-4 py-2 rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 font-bold border border-emerald-200 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      Applied & Proposal Submitted
                    </span>
                  ) : (
                    <button
                      onClick={() => applyToProject(proj.id)}
                      className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold transition-colors shadow-xs flex items-center space-x-1.5"
                    >
                      <Briefcase className="w-3.5 h-3.5" />
                      <span>Apply / Propose Solution</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
