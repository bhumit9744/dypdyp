import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Plus,
  ThumbsUp,
  Filter,
  Search
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SkillItem } from '../../types';

export const SkillsSubSection: React.FC = () => {
  const { skills } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [filterVerifiedOnly, setFilterVerifiedOnly] = useState<boolean>(false);

  const categories = ['All', 'Frontend', 'Backend', 'Database', 'DevOps', 'Fundamentals', 'AI / ML'];

  const filteredSkills = skills.filter((skill) => {
    const matchesCat = selectedCategory === 'All' || skill.category === selectedCategory;
    const matchesVer = !filterVerifiedOnly || skill.verified;
    return matchesCat && matchesVer;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header & Stats Banner */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-brand-600" />
            Skill Inventory & Proof of Work
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Every claimed skill links to a cryptographically validated Git commit, hackathon certificate, or coursework grade.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <div className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40 text-xs font-semibold flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>6 of 7 Verified</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Toggle */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-brand-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <label className="flex items-center space-x-2 text-xs text-slate-600 dark:text-slate-300 cursor-pointer">
          <input
            type="checkbox"
            checked={filterVerifiedOnly}
            onChange={(e) => setFilterVerifiedOnly(e.target.checked)}
            className="rounded border-slate-300 text-brand-600 focus:ring-brand-500"
          />
          <span>Show verified proofs only</span>
        </label>
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSkills.map((skill) => (
          <div
            key={skill.id}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-4 hover:border-brand-500/40 transition-colors"
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-sm text-slate-900 dark:text-white">
                    {skill.name}
                  </h3>
                  <span className="text-[11px] text-slate-400 font-medium">
                    {skill.category} • {skill.level}
                  </span>
                </div>

                {skill.verified ? (
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    Verified
                  </span>
                ) : (
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                    <AlertCircle className="w-3 h-3 text-amber-600" />
                    Pending Proof
                  </span>
                )}
              </div>

              {skill.verified && skill.verificationSource && (
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800/80 text-[11px] space-y-1">
                  <div className="text-slate-500 dark:text-slate-400">
                    Proof Source: <span className="font-medium text-slate-700 dark:text-slate-200">{skill.verificationSource}</span>
                  </div>
                  {skill.evidenceUrl && (
                    <a
                      href={skill.evidenceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1 font-medium truncate"
                    >
                      <ExternalLink className="w-3 h-3 shrink-0" />
                      <span className="truncate">{skill.evidenceUrl}</span>
                    </a>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100 dark:border-slate-800 text-slate-500">
              <span className="flex items-center gap-1.5">
                <ThumbsUp className="w-3.5 h-3.5 text-slate-400" />
                {skill.endorsements} Faculty & Peer Endorsements
              </span>
              <span className="text-[10px] font-semibold text-brand-600 dark:text-brand-400">
                Tier-1 Qualified
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
