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
  AlertTriangle,
  Building2,
  Calendar,
  AlertCircle,
  Clock,
  ArrowRight,
  ExternalLink,
  Lock,
  UserCheck,
  CheckSquare,
  X,
  FileCheck2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { mockShortlists } from '../../mock/data';
import { CandidateShortlist, CampusDrive } from '../../types';

export const ShortlistsSubSection: React.FC = () => {
  const {
    role,
    setRole,
    campusDrives,
    registerForDrive,
    publishDriveShortlist,
    skills: userSkills
  } = useApp();

  const [activeTab, setActiveTab] = useState<'drives' | 'shortlists'>('drives');
  const [candidates, setCandidates] = useState<CandidateShortlist[]>(mockShortlists);
  const [minCgpaFilter, setMinCgpaFilter] = useState<number>(8.0);
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [evidenceCandidate, setEvidenceCandidate] = useState<CandidateShortlist | null>(null);
  const [publishSuccessMessage, setPublishSuccessMessage] = useState<string | null>(null);

  const filteredCandidates = candidates.filter((c) => {
    const matchesCgpa = c.cgpa >= minCgpaFilter;
    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
    return matchesCgpa && matchesStatus;
  });

  const handleStatusChange = (candId: string, newStatus: any) => {
    if (role !== 'coordinator') return; // Enforce role restriction
    setCandidates((prev) =>
      prev.map((c) => (c.candidateId === candId ? { ...c, status: newStatus } : c))
    );
  };

  const handlePublishOfficial = (driveId: string) => {
    publishDriveShortlist(driveId);
    setPublishSuccessMessage('Official shortlist round results published to college portal.');
    setTimeout(() => setPublishSuccessMessage(null), 4000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400">
              <ListOrdered className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                  Campus Drives, Eligibility & Shortlists
                </h1>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    role === 'coordinator'
                      ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
                      : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  }`}
                >
                  {role === 'coordinator' ? 'TPO Authority View' : 'Student Merit View'}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Transparent eligibility criteria, drive registration, official shortlist publication, and conflict monitoring.
              </p>
            </div>
          </div>
        </div>

        {/* Role Toggle Switcher */}
        <div className="flex flex-wrap items-center gap-2">
          {role === 'student' ? (
            <button
              onClick={() => setRole('coordinator')}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 transition-colors flex items-center space-x-1.5"
            >
              <UserCheck className="w-3.5 h-3.5 text-brand-600" />
              <span>Switch to TPO Coordinator View</span>
            </button>
          ) : (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setRole('student')}
                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300"
              >
                Back to Student View
              </button>
              <button
                onClick={() => alert('Exported candidate rankings to CSV successfully.')}
                className="px-3.5 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Audit Sheet</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Success Banner */}
      {publishSuccessMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold text-emerald-800 dark:text-emerald-200 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{publishSuccessMessage}</span>
          </div>
          <button onClick={() => setPublishSuccessMessage(null)} className="text-slate-400">✕</button>
        </div>
      )}

      {/* Profile Readiness Check Widget */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <h3 className="font-bold text-xs text-slate-900 dark:text-white">
              Student Profile Readiness Check for Campus Drives
            </h3>
          </div>
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
            96% Readiness Score (Eligible for Super Dream Drives)
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-850 flex items-center justify-between">
            <span className="text-slate-500">Academic CGPA</span>
            <span className="font-bold text-emerald-600 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              8.84 / 10.0
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-850 flex items-center justify-between">
            <span className="text-slate-500">Active Backlogs</span>
            <span className="font-bold text-emerald-600 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              0 Backlogs
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-850 flex items-center justify-between">
            <span className="text-slate-500">Verified Skills</span>
            <span className="font-bold text-emerald-600 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              {userSkills.filter(s => s.verified).length} Endorsed
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-850 flex items-center justify-between">
            <span className="text-slate-500">ATS Resume Score</span>
            <span className="font-bold text-emerald-600 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              94 / 100 ATS
            </span>
          </div>
        </div>
      </div>

      {/* Sub-Tabs: Drives & Eligibility vs Official Shortlists */}
      <div className="flex items-center space-x-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold w-fit">
        <button
          onClick={() => setActiveTab('drives')}
          className={`px-4 py-2 rounded-lg transition-all ${
            activeTab === 'drives'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          Campus Drives & Eligibility ({campusDrives.length})
        </button>
        <button
          onClick={() => setActiveTab('shortlists')}
          className={`px-4 py-2 rounded-lg transition-all ${
            activeTab === 'shortlists'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          Official Selection Shortlists ({candidates.length} Ranked)
        </button>
      </div>

      {/* TAB 1: CAMPUS DRIVES & DETAILED ELIGIBILITY */}
      {activeTab === 'drives' && (
        <div className="space-y-4">
          {campusDrives.map((drive) => (
            <div
              key={drive.id}
              className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 hover:border-brand-500/40 transition-all"
            >
              {/* Schedule Conflict Alert Banner */}
              {drive.scheduleConflictAlert && (
                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 flex items-start space-x-2 text-xs text-amber-800 dark:text-amber-200">
                  <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Schedule Conflict Alert: </span>
                    <span>{drive.scheduleConflictAlert}</span>
                  </div>
                </div>
              )}

              {/* Main Drive Header */}
              <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                <div className="flex items-start space-x-3.5">
                  <img
                    src={drive.companyLogo}
                    alt={drive.companyName}
                    className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-800 shadow-xs"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-base text-slate-900 dark:text-white">
                        {drive.companyName}
                      </h3>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300">
                        {drive.tier}
                      </span>
                      {drive.officialShortlistPublished && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950 border border-emerald-200">
                          Official Shortlist Active ({drive.officialShortlistCount} Students)
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 font-medium mt-0.5">
                      {drive.role} • <strong className="text-brand-600 dark:text-brand-400">{drive.packageRange}</strong>
                    </p>
                    <p className="text-xs text-slate-400 mt-1 flex items-center gap-3">
                      <span>Drive Date: <strong>{drive.driveDate}</strong></span>
                      <span>•</span>
                      <span>Deadline: {drive.registrationDeadline}</span>
                    </p>
                  </div>
                </div>

                {/* Drive Registration Button */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2">
                  <button
                    onClick={() => registerForDrive(drive.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors shadow-xs ${
                      drive.registrationStatus === 'Registered'
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300'
                        : drive.registrationStatus === 'Closed'
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        : 'bg-brand-600 hover:bg-brand-700 text-white'
                    }`}
                  >
                    {drive.registrationStatus === 'Registered'
                      ? 'Registered for Drive ✓'
                      : drive.registrationStatus === 'Closed'
                      ? 'Registration Closed'
                      : 'Register for Campus Drive'}
                  </button>

                  {role === 'coordinator' && !drive.officialShortlistPublished && (
                    <button
                      onClick={() => handlePublishOfficial(drive.id)}
                      className="text-[11px] font-bold text-purple-600 hover:underline"
                    >
                      Publish Official Drive Shortlist →
                    </button>
                  )}
                </div>
              </div>

              {/* Instructions */}
              <p className="text-xs text-slate-600 dark:text-slate-300">
                <span className="font-semibold text-slate-700 dark:text-slate-200">TPO Instructions: </span>
                {drive.instructions}
              </p>

              {/* Explicit Separated Eligibility Analysis */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[10px]">
                    Eligibility Explanations (Automated Rule Engine)
                  </span>
                  <span className="text-[11px] font-bold text-emerald-600">
                    Status: {drive.eligibilityAnalysis.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {/* Met Requirements */}
                  <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-900/60 space-y-1">
                    <span className="font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-1 text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Met Requirements ({drive.eligibilityAnalysis.metRequirements.length})
                    </span>
                    {drive.eligibilityAnalysis.metRequirements.map((req, i) => (
                      <p key={i} className="text-slate-600 dark:text-slate-400 text-[11px]">
                        • {req}
                      </p>
                    ))}
                  </div>

                  {/* Unmet Requirements */}
                  <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                    <span className="font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1 text-[11px]">
                      <AlertCircle className="w-3.5 h-3.5" />
                      Unmet Requirements ({drive.eligibilityAnalysis.unmetRequirements.length})
                    </span>
                    {drive.eligibilityAnalysis.unmetRequirements.length === 0 ? (
                      <p className="text-slate-400 text-[11px] italic">No unmet criteria.</p>
                    ) : (
                      drive.eligibilityAnalysis.unmetRequirements.map((req, i) => (
                        <p key={i} className="text-rose-600 text-[11px]">• {req}</p>
                      ))
                    )}
                  </div>

                  {/* Unverified Requirements */}
                  <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-900/60 space-y-1">
                    <span className="font-bold text-amber-700 dark:text-amber-300 flex items-center gap-1 text-[11px]">
                      <Clock className="w-3.5 h-3.5" />
                      Unverified / Pending TPO ({drive.eligibilityAnalysis.unverifiedRequirements.length})
                    </span>
                    {drive.eligibilityAnalysis.unverifiedRequirements.length === 0 ? (
                      <p className="text-slate-400 text-[11px] italic">All credentials verified.</p>
                    ) : (
                      drive.eligibilityAnalysis.unverifiedRequirements.map((req, i) => (
                        <p key={i} className="text-amber-700 dark:text-amber-300 text-[11px]">• {req}</p>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Selection Rounds Sequence */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="text-slate-400 font-semibold text-[11px]">Rounds:</span>
                {drive.selectionRounds.map((rnd, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-medium"
                  >
                    {i + 1}. {rnd}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: OFFICIAL SELECTION SHORTLISTS */}
      {activeTab === 'shortlists' && (
        <div className="space-y-4">
          {/* Filter Toolbar */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center space-x-3">
              <span className="text-slate-500 font-medium">CGPA Cutoff:</span>
              <select
                value={minCgpaFilter}
                onChange={(e) => setMinCgpaFilter(Number(e.target.value))}
                className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 font-semibold text-slate-800 dark:text-slate-200 focus:outline-none"
              >
                <option value={7.5}>Min CGPA: 7.50</option>
                <option value={8.0}>Min CGPA: 8.00 (Super Dream)</option>
                <option value={8.5}>Min CGPA: 8.50 (Tier 1)</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 font-semibold text-slate-800 dark:text-slate-200 focus:outline-none"
              >
                <option value="All">All Statuses</option>
                <option value="Shortlisted">Shortlisted</option>
                <option value="Waitlisted">Waitlisted</option>
                <option value="Under Review">Under Review</option>
              </select>
            </div>

            <div className="flex items-center space-x-2 text-slate-400 text-xs">
              {role === 'student' ? (
                <span className="flex items-center gap-1 text-slate-500">
                  <Lock className="w-3.5 h-3.5" />
                  Official Selection Records are Read-Only for Students
                </span>
              ) : (
                <span className="text-purple-600 dark:text-purple-400 font-semibold">
                  TPO Authority: Status updates will publish directly to college records
                </span>
              )}
            </div>
          </div>

          {/* Candidates Ranking Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-850/80 text-slate-500 font-semibold">
                  <th className="py-3 px-4">Rank</th>
                  <th className="py-3 px-4">Candidate</th>
                  <th className="py-3 px-4">Branch & Roll</th>
                  <th className="py-3 px-4">CGPA</th>
                  <th className="py-3 px-4">Merit Match</th>
                  <th className="py-3 px-4">Verified Proofs</th>
                  <th className="py-3 px-4">Official Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredCandidates.map((cand) => (
                  <tr key={cand.candidateId} className="hover:bg-slate-50/60 dark:hover:bg-slate-850/60 transition-colors">
                    <td className="py-3 px-4">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full font-bold bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300 text-[11px]">
                        #{cand.ranking}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <strong className="font-semibold text-slate-900 dark:text-white block">
                        {cand.studentName}
                      </strong>
                      <span className="text-[10px] text-slate-400">ID: {cand.candidateId}</span>
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                      <span>{cand.department}</span>
                      <span className="text-[10px] text-slate-400 block font-mono">{cand.rollNo}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">
                        {cand.cgpa.toFixed(2)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full font-bold text-[10px] bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300">
                        {cand.matchScore}% Fit
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                      <span>{cand.verifiedSkillsCount} Skills • {cand.projectsCount} Projects</span>
                    </td>
                    <td className="py-3 px-4">
                      {role === 'coordinator' ? (
                        <select
                          value={cand.status}
                          onChange={(e) => handleStatusChange(cand.candidateId, e.target.value)}
                          className="px-2 py-1 rounded-lg text-xs font-bold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none"
                        >
                          <option value="Shortlisted">Shortlisted</option>
                          <option value="Waitlisted">Waitlisted</option>
                          <option value="Under Review">Under Review</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      ) : (
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            cand.status === 'Shortlisted'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : cand.status === 'Waitlisted'
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                              : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
                          }`}
                        >
                          {cand.status}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setEvidenceCandidate(cand)}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-[11px] font-semibold text-slate-700 dark:text-slate-300 transition-colors"
                      >
                        Inspect Proofs
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Evidence Preview Modal */}
      {evidenceCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl max-w-lg w-full space-y-4">
            <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Verified Evidence Dossier
                </h3>
                <p className="text-xs text-slate-500">
                  {evidenceCandidate.studentName} ({evidenceCandidate.rollNo}) • {evidenceCandidate.department}
                </p>
              </div>
              <button onClick={() => setEvidenceCandidate(null)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850 space-y-1">
                <span className="font-semibold text-slate-700 dark:text-slate-300 block">
                  Proctored Assessment Benchmark:
                </span>
                <p className="text-slate-600 dark:text-slate-400">
                  DSA Advanced Aptitude: <strong>92/100</strong> (Proctored on Oct 06, 2026).
                </p>
              </div>

              <div className="space-y-1">
                <span className="font-semibold text-slate-700 dark:text-slate-300 block">
                  Top Endorsed Competencies:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {evidenceCandidate.topSkills.map((sk, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-semibold text-[11px] flex items-center gap-1 border border-emerald-200"
                    >
                      <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                      {sk}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => setEvidenceCandidate(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
              >
                Close Evidence
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
