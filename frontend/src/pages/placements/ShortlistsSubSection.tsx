import React, { useState } from 'react';
import {
  ListOrdered,
  Award,
  CheckCircle2,
  ShieldCheck,
  Download,
  Filter,
  Users,
  Search,
  Sparkles,
  ArrowUpDown
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { mockShortlists } from '../../mock/data';
import { CandidateShortlist } from '../../types';

export const ShortlistsSubSection: React.FC = () => {
  const { role, setRole } = useApp();
  const [candidates, setCandidates] = useState<CandidateShortlist[]>(mockShortlists);
  const [minCgpaFilter, setMinCgpaFilter] = useState<number>(8.0);
  const [statusFilter, setStatusFilter] = useState<string>('All');

  const filteredCandidates = candidates.filter((c) => {
    const matchesCgpa = c.cgpa >= minCgpaFilter;
    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
    return matchesCgpa && matchesStatus;
  });

  const handleStatusChange = (candId: string, newStatus: any) => {
    setCandidates((prev) =>
      prev.map((c) => (c.candidateId === candId ? { ...c, status: newStatus } : c))
    );
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ListOrdered className="w-5 h-5 text-brand-600" />
              Evidence-Backed Candidate Rankings
            </h1>
            <span
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                role === 'coordinator'
                  ? 'bg-brand-600 text-white'
                  : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
              }`}
            >
              {role === 'coordinator' ? 'TPO Authority View' : 'Student Merit View'}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Automated ranking algorithm calculated via: CGPA (30%) + Proctored DSA Assessment (40%) + Verified Git Proofs (30%).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {role === 'student' ? (
            <button
              onClick={() => setRole('coordinator')}
              className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 transition-colors"
            >
              Switch to TPO Coordinator View
            </button>
          ) : (
            <button
              onClick={() => alert('Exported candidate rankings to CSV successfully.')}
              className="px-3.5 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export TPO Audit Sheet</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-3">
          <span className="text-slate-500 font-medium">Filter by Cutoff:</span>
          <select
            value={minCgpaFilter}
            onChange={(e) => setMinCgpaFilter(Number(e.target.value))}
            className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-semibold text-slate-700 dark:text-slate-200 focus:outline-none"
          >
            <option value={7.5}>Min CGPA: 7.50</option>
            <option value={8.0}>Min CGPA: 8.00 (Super Dream)</option>
            <option value={8.5}>Min CGPA: 8.50 (Tier 1)</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-semibold text-slate-700 dark:text-slate-200 focus:outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="Shortlisted">Shortlisted</option>
            <option value="Waitlisted">Waitlisted</option>
            <option value="Under Review">Under Review</option>
          </select>
        </div>

        <span className="text-slate-400">
          Showing {filteredCandidates.length} eligible students
        </span>
      </div>

      {/* Rankings Table */}
      <div className="overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-850/80 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Rank</th>
                <th className="py-3 px-4">Candidate & Roll</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">CGPA</th>
                <th className="py-3 px-4">Match Score</th>
                <th className="py-3 px-4">Verified Proofs</th>
                <th className="py-3 px-4">Status & Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-200">
              {filteredCandidates.map((cand) => (
                <tr
                  key={cand.candidateId}
                  className={`hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors ${
                    cand.studentName === 'Bhumit Gupta'
                      ? 'bg-brand-50/40 dark:bg-brand-950/20 font-medium'
                      : ''
                  }`}
                >
                  <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                    <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 inline-flex items-center justify-center text-xs">
                      #{cand.ranking}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <span>{cand.studentName}</span>
                      {cand.studentName === 'Bhumit Gupta' && (
                        <span className="px-1.5 py-0.2 rounded bg-brand-100 text-brand-700 dark:bg-brand-900/60 dark:text-brand-300 text-[10px]">
                          You
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-400">{cand.rollNo}</span>
                  </td>

                  <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                    {cand.department}
                  </td>

                  <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                    {cand.cgpa}
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex items-center space-x-1.5 font-bold text-emerald-600 dark:text-emerald-400">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                      <span>{cand.matchScore}%</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="text-slate-600 dark:text-slate-300">
                      {cand.verifiedSkillsCount} Skills • {cand.projectsCount} Projs
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    {role === 'coordinator' ? (
                      <select
                        value={cand.status}
                        onChange={(e) => handleStatusChange(cand.candidateId, e.target.value)}
                        className="px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold focus:outline-none"
                      >
                        <option value="Shortlisted">Shortlisted</option>
                        <option value="Waitlisted">Waitlisted</option>
                        <option value="Under Review">Under Review</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    ) : (
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                          cand.status === 'Shortlisted'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : cand.status === 'Waitlisted'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                            : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                        }`}
                      >
                        {cand.status}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
