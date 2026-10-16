import React, { useState } from 'react';
import {
  Trophy,
  Search,
  Filter,
  ExternalLink,
  Award,
  Calendar,
  Gift,
  DollarSign,
  FileCheck2,
  CheckCircle2,
  Sparkles,
  Users,
  Compass,
  ArrowRight,
  MapPin,
  Laptop
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ProgramOpportunity } from '../../types';

export const ProgramsChallengesSubSection: React.FC = () => {
  const { programs, registerForProgram, searchQuery, setSearchQuery } = useApp();
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedPathway, setSelectedPathway] = useState<string>('All');
  const [selectedMode, setSelectedMode] = useState<string>('All');
  const [onlyPrizes, setOnlyPrizes] = useState<boolean>(false);

  const filteredPrograms = programs.filter((prog) => {
    const matchesSearch =
      searchQuery.trim() === '' ||
      prog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prog.organizer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prog.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      prog.eligibility.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = selectedType === 'All' || prog.opportunityType === selectedType;
    const matchesPathway = selectedPathway === 'All' || prog.hiringPathway === selectedPathway;
    const matchesMode = selectedMode === 'All' || prog.mode === selectedMode;
    const matchesPrize = !onlyPrizes || Boolean(prog.prizeOrAward);

    return matchesSearch && matchesType && matchesPathway && matchesMode && matchesPrize;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Programs, Challenges & Experiences
                <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300">
                  {programs.length} Verified
                </span>
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Competitions, research fellowships, hackathons, and corporate fast-track challenges outside traditional drives.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Toggles */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 text-xs font-medium text-slate-700 dark:text-slate-200 focus:outline-none focus:border-emerald-500"
          >
            <option value="All">All Opportunity Types</option>
            <option value="Hackathon">Hackathons</option>
            <option value="Coding Competition">Coding Competitions</option>
            <option value="Research Fellowship">Research Fellowships</option>
            <option value="Innovation Challenge">Innovation Challenges</option>
            <option value="Workshop">Workshops & Bootcamps</option>
            <option value="Apprenticeship">Apprenticeships</option>
          </select>

          <select
            value={selectedPathway}
            onChange={(e) => setSelectedPathway(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 text-xs font-medium text-slate-700 dark:text-slate-200 focus:outline-none focus:border-emerald-500"
          >
            <option value="All">All Hiring Pathways</option>
            <option value="Direct Fast-Track Interview">Direct Fast-Track Interview</option>
            <option value="Shortlist PPO">Shortlist PPO / Internship</option>
            <option value="Corporate Visibility">Corporate Talent Visibility</option>
            <option value="Skill Credential Only">Skill Credential Only</option>
          </select>

          <button
            onClick={() => setOnlyPrizes(!onlyPrizes)}
            className={`px-3 py-2 rounded-xl text-xs font-medium transition-colors flex items-center space-x-1.5 ${
              onlyPrizes
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <Gift className="w-3.5 h-3.5" />
            <span>Cash / Prizes Only</span>
          </button>
        </div>
      </div>

      {/* Unified Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search programs by challenge name, organizer (e.g. Smart India Hackathon, Google Summer of Code), or domain..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-emerald-500 shadow-xs"
        />
      </div>

      {/* Programs Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredPrograms.length === 0 ? (
          <div className="col-span-full p-12 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <Trophy className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto" />
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mt-2">
              No matching programs or challenges found.
            </p>
            <p className="text-xs text-slate-400">Try loosening your opportunity type or pathway filter.</p>
          </div>
        ) : (
          filteredPrograms.map((prog) => (
            <div
              key={prog.id}
              className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-4 hover:border-emerald-500/40 transition-all"
            >
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center space-x-3.5">
                    <img
                      src={prog.logo}
                      alt={prog.organizer}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-800 shadow-xs shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-bold text-base text-slate-900 dark:text-white">
                          {prog.title}
                        </h3>
                        <span
                          className={`text-[9px] font-semibold px-1.5 py-0.2 rounded border ${
                            prog.dataSource === 'Verified Partner'
                              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                              : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                          }`}
                        >
                          {prog.dataSource}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">
                        Organized by <strong>{prog.organizer}</strong> • {prog.mode}
                      </p>
                    </div>
                  </div>

                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 shrink-0">
                    {prog.opportunityType}
                  </span>
                </div>

                {/* Explicit Requirement Labels Grid */}
                <div className="grid grid-cols-2 gap-2 text-xs p-3 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800/80">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      Eligibility
                    </span>
                    <strong className="text-slate-800 dark:text-slate-200 text-[11px] block mt-0.5">
                      {prog.eligibility}
                    </strong>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      Deadline
                    </span>
                    <span className="text-rose-600 dark:text-rose-400 font-bold text-[11px] block mt-0.5 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {prog.deadline}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      Stipend / Grant
                    </span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold text-[11px] block mt-0.5">
                      {prog.stipendOrGrant}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      Certificate
                    </span>
                    <span className="text-slate-700 dark:text-slate-300 font-medium text-[11px] block mt-0.5 flex items-center gap-1">
                      <FileCheck2 className="w-3 h-3 text-brand-500" />
                      {prog.hasCertificate ? 'Verified Certificate' : 'Participation Only'}
                    </span>
                  </div>
                </div>

                {/* Prize Pool (if any) */}
                {prog.prizeOrAward && (
                  <div className="p-2.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 flex items-center justify-between text-xs text-amber-900 dark:text-amber-200">
                    <span className="flex items-center gap-1.5 font-bold">
                      <Gift className="w-4 h-4 text-amber-600" />
                      Prize & Rewards:
                    </span>
                    <span className="font-semibold text-amber-700 dark:text-amber-300">
                      {prog.prizeOrAward}
                    </span>
                  </div>
                )}

                {/* Hiring Pathway Label */}
                <div className="p-2.5 rounded-xl bg-brand-50/60 dark:bg-brand-950/40 border border-brand-200/60 dark:border-brand-900/40 flex items-center justify-between text-xs">
                  <span className="text-slate-500 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-brand-500" />
                    Placement & Hiring Pathway:
                  </span>
                  <span className="font-bold text-brand-700 dark:text-brand-300">
                    {prog.hiringPathway}
                  </span>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                  {prog.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded text-[11px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Card Footer */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <a
                  href={prog.externalUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium"
                >
                  <span>Official Submission Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                <div className="flex items-center space-x-2">
                  <span className="text-[11px] text-slate-400">
                    {prog.registeredCount} Students Enrolled
                  </span>
                  <button
                    onClick={() => registerForProgram(prog.id)}
                    className={`px-4 py-1.5 rounded-xl font-semibold transition-colors shadow-xs ${
                      prog.isRegistered
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    }`}
                  >
                    {prog.isRegistered ? 'Enrolled ✓' : 'Register / Track'}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
