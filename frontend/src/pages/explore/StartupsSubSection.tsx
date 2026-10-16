import React, { useState } from 'react';
import {
  Rocket,
  Search,
  Filter,
  ExternalLink,
  Users,
  Sparkles,
  Zap,
  Building,
  Mail,
  CheckCircle2,
  Code2,
  DollarSign,
  Layers,
  Award,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Startup } from '../../types';

export const StartupsSubSection: React.FC = () => {
  const { startups, searchQuery, setSearchQuery, setCurrentSubSection, setExploreCompanyFilter } = useApp();
  const [selectedStage, setSelectedStage] = useState<string>('All');
  const [selectedIndustry, setSelectedIndustry] = useState<string>('All');
  const [mvpOnly, setMvpOnly] = useState<boolean>(false);
  const [contactModalStartup, setContactModalStartup] = useState<Startup | null>(null);

  // Extract unique industries
  const industries = Array.from(new Set(startups.map((s) => s.industry)));

  const filteredStartups = startups.filter((startup) => {
    const matchesSearch =
      searchQuery.trim() === '' ||
      startup.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      startup.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      startup.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      startup.products.some((p) => p.toLowerCase().includes(searchQuery.toLowerCase())) ||
      startup.requiredSkills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
      startup.founderName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStage = selectedStage === 'All' || startup.growthStage === selectedStage;
    const matchesIndustry = selectedIndustry === 'All' || startup.industry === selectedIndustry;
    const matchesMvp = !mvpOnly || startup.mvpCollaborationOpen;

    return matchesSearch && matchesStage && matchesIndustry && matchesMvp;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
              <Rocket className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Startup Ecosystem & Venture Hub
                <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300">
                  {startups.length} Ventures
                </span>
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Discover early-stage disruptors, MVP co-development initiatives, early-team roles, and approved founder outreach.
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Stage Filter */}
          <select
            value={selectedStage}
            onChange={(e) => setSelectedStage(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 text-xs font-medium text-slate-700 dark:text-slate-200 focus:outline-none focus:border-purple-500"
          >
            <option value="All">All Growth Stages</option>
            <option value="Bootstrapped">Bootstrapped</option>
            <option value="Pre-Seed">Pre-Seed</option>
            <option value="Seed">Seed</option>
            <option value="Series A">Series A</option>
            <option value="Series B">Series B</option>
          </select>

          {/* Industry Filter */}
          <select
            value={selectedIndustry}
            onChange={(e) => setSelectedIndustry(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 text-xs font-medium text-slate-700 dark:text-slate-200 focus:outline-none focus:border-purple-500"
          >
            <option value="All">All Sectors</option>
            {industries.map((ind) => (
              <option key={ind} value={ind}>
                {ind}
              </option>
            ))}
          </select>

          {/* MVP Collaboration Toggle */}
          <button
            onClick={() => setMvpOnly(!mvpOnly)}
            className={`px-3 py-2 rounded-xl text-xs font-medium transition-colors flex items-center space-x-1.5 ${
              mvpOnly
                ? 'bg-purple-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Open MVP Collaborations</span>
          </button>
        </div>
      </div>

      {/* Unified Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search startups by name, products, tech stack, or founder..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-purple-500 shadow-xs"
        />
      </div>

      {/* Startup Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredStartups.length === 0 ? (
          <div className="col-span-full p-12 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <Rocket className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto" />
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mt-2">
              No matching startup ventures found.
            </p>
            <p className="text-xs text-slate-400">Try broadening your stage or industry filters.</p>
          </div>
        ) : (
          filteredStartups.map((startup) => (
            <div
              key={startup.id}
              className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-4 hover:border-purple-500/40 transition-all"
            >
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center space-x-3.5">
                    <img
                      src={startup.logo}
                      alt={startup.name}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-800 shadow-xs shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-bold text-base text-slate-900 dark:text-white">
                          {startup.name}
                        </h3>
                        <span
                          className={`text-[9px] font-semibold px-1.5 py-0.2 rounded border ${
                            startup.dataSource === 'Source Verified'
                              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                              : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                          }`}
                        >
                          {startup.dataSource}
                        </span>
                      </div>
                      <p className="text-xs text-purple-600 dark:text-purple-400 font-medium">
                        {startup.tagline}
                      </p>
                    </div>
                  </div>

                  {/* Growth Stage Badge */}
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 dark:bg-purple-950/80 dark:text-purple-300 border border-purple-200/60 dark:border-purple-800 shrink-0">
                    {startup.growthStage}
                  </span>
                </div>

                {/* Incubator / Accelerator Callout (if backed) */}
                {startup.incubatorOrAccelerator && (
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-200 text-xs font-semibold border border-amber-200 dark:border-amber-900/60">
                    <Award className="w-3.5 h-3.5 text-amber-500" />
                    <span>Backed by: {startup.incubatorOrAccelerator}</span>
                  </div>
                )}

                {/* Description */}
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {startup.description}
                </p>

                {/* Products Built */}
                {startup.products && startup.products.length > 0 && (
                  <div className="space-y-1">
                    <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                      <Layers className="w-3 h-3" />
                      Core Products & Systems:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {startup.products.map((prod, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md text-[11px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium"
                        >
                          {prod}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Funding Transparency Strip */}
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-4 h-4 text-emerald-500" />
                    <span className="text-slate-500">Stage & Capital:</span>
                    <strong className="text-slate-800 dark:text-slate-200">
                      {startup.fundingDisclosed && startup.fundingAmount
                        ? `${startup.growthStage} • ${startup.fundingAmount}`
                        : `${startup.growthStage} (Capital Undisclosed / Bootstrapped)`}
                    </strong>
                  </div>
                  <span className="text-[11px] text-slate-400">{startup.headquarters}</span>
                </div>

                {/* MVP Collaboration Callout Box */}
                {startup.mvpCollaborationOpen && (
                  <div className="p-3 rounded-xl bg-purple-50/60 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900/50 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-purple-900 dark:text-purple-200 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-purple-500" />
                        Open MVP Co-Development
                      </span>
                      <span className="text-[10px] uppercase font-bold text-purple-600 dark:text-purple-400">
                        Student Team Welcome
                      </span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                      {startup.mvpCollaborationDescription ||
                        'Open for student engineering squads to build proof-of-concept features and production integrations.'}
                    </p>
                  </div>
                )}

                {/* Required Tech Competencies */}
                <div className="space-y-1">
                  <span className="text-[11px] font-semibold text-slate-400">Tech Stack:</span>
                  <div className="flex flex-wrap gap-1">
                    {startup.requiredSkills.map((sk, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded text-[11px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                      >
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Founder Info & Approved Channel */}
                <div className="p-2.5 rounded-xl bg-slate-100/60 dark:bg-slate-850/60 border border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Leadership</span>
                    <p className="font-bold text-slate-800 dark:text-slate-200">
                      {startup.founderName} ({startup.founderRole})
                    </p>
                  </div>
                  <button
                    onClick={() => setContactModalStartup(startup)}
                    className="px-2.5 py-1 rounded-lg bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-semibold hover:bg-purple-200 dark:hover:bg-purple-900 transition-colors text-[11px] flex items-center space-x-1"
                  >
                    <Mail className="w-3 h-3" />
                    <span>Approved Founder Contact</span>
                  </button>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <a
                  href={startup.website}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-slate-500 hover:text-purple-600 dark:hover:text-purple-400 font-medium"
                >
                  <span>Startup Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setExploreCompanyFilter(startup.name);
                      setCurrentSubSection('jobs-internships');
                    }}
                    className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold transition-colors flex items-center space-x-1 shadow-xs"
                  >
                    <span>
                      {startup.earlyTeamOpportunitiesCount} Early-Team {startup.earlyTeamOpportunitiesCount === 1 ? 'Role' : 'Roles'}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Approved Founder Contact Modal */}
      {contactModalStartup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl max-w-md w-full space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <img
                  src={contactModalStartup.logo}
                  alt={contactModalStartup.name}
                  className="w-10 h-10 rounded-xl object-cover"
                />
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    Contact {contactModalStartup.founderName}
                  </h3>
                  <p className="text-xs text-slate-500">{contactModalStartup.founderRole} @ {contactModalStartup.name}</p>
                </div>
              </div>
              <button
                onClick={() => setContactModalStartup(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
              >
                ✕
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900/50 space-y-2 text-xs">
              <span className="font-semibold text-purple-900 dark:text-purple-200 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-purple-600" />
                Authorized Communication Channel
              </span>
              <p className="text-slate-600 dark:text-slate-300">
                Placement Hub has verified this official talent desk for student founder outreach:
              </p>
              <div className="p-2 rounded-lg bg-white dark:bg-slate-900 font-mono text-purple-700 dark:text-purple-300 break-all select-all font-semibold">
                {contactModalStartup.founderContactChannel}
              </div>
            </div>

            <p className="text-[11px] text-slate-500">
              Tip: Include your GitHub repository link, target contribution area (frontend, backend, ML), and mention your placement batch for prioritized review.
            </p>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setContactModalStartup(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
              >
                Close
              </button>
              <a
                href={
                  contactModalStartup.founderContactChannel.startsWith('http')
                    ? contactModalStartup.founderContactChannel
                    : `mailto:${contactModalStartup.founderContactChannel}?subject=Placement%20Hub%20Student%20Inquiry%20-%20DY%20Patil`
                }
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-purple-600 hover:bg-purple-700 text-white transition-colors"
              >
                Open Approved Channel
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
