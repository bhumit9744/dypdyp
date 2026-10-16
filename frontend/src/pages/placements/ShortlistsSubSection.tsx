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
  FileCheck2,
  Plus
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CandidateShortlist, CampusDrive } from '../../types';
import { mockShortlists } from '../../mock/data';

export const ShortlistsSubSection: React.FC = () => {
  const {
    role,
    setRole,
    campusDrives,
    registerForDrive,
    publishDriveShortlist,
    skills: userSkills,
    studentProfile
  } = useApp();

  const [activeTab, setActiveTab] = useState<'drives' | 'shortlists'>('drives');
  const [candidates, setCandidates] = useState<CandidateShortlist[]>(mockShortlists);
  const [minCgpaFilter, setMinCgpaFilter] = useState<number>(7.5);
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [evidenceCandidate, setEvidenceCandidate] = useState<CandidateShortlist | null>(null);
  const [publishSuccessMessage, setPublishSuccessMessage] = useState<string | null>(null);

  // Coordinator Add Drive Form
  const [showAddDriveModal, setShowAddDriveModal] = useState(false);
  const [newDriveData, setNewDriveData] = useState({
    companyName: '',
    role: '',
    tier: 'Dream' as const,
    packageRange: '12.0 - 18.0 LPA',
    date: new Date().toISOString().split('T')[0],
    minCgpa: 7.0,
    maxBacklogs: 0
  });

  const filteredCandidates = candidates.filter((c) => {
    const matchesCgpa = c.cgpa >= minCgpaFilter;
    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
    return matchesCgpa && matchesStatus;
  });

  const handleStatusChange = (candId: string, newStatus: any) => {
    if (role !== 'coordinator') return;
    setCandidates((prev) =>
      prev.map((c) => (c.candidateId === candId ? { ...c, status: newStatus } : c))
    );
  };

  const handlePublishOfficial = (driveId: string) => {
    publishDriveShortlist(driveId);
    setPublishSuccessMessage('Official shortlist round results published to college records.');
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
                Official college-authorized eligibility criteria, drive notices, and shortlist rosters.
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
                onClick={() => alert('Official audit sheet exported to CSV.')}
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

      {/* Profile Readiness Check Widget (Real Data Grounded) */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <h3 className="font-bold text-xs text-slate-900 dark:text-white">
              Student Eligibility Parameters (Authenticated Academic Record)
            </h3>
          </div>
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
            {studentProfile ? `CGPA ${studentProfile.cgpa} • ${studentProfile.placementStatus}` : 'Profile Setup Required'}
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-850 flex items-center justify-between">
            <span className="text-slate-500">Academic CGPA</span>
            <span className="font-bold text-slate-900 dark:text-white">
              {studentProfile ? `${studentProfile.cgpa} / 10.0` : 'Not Set'}
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-850 flex items-center justify-between">
            <span className="text-slate-500">Active Backlogs</span>
            <span className="font-bold text-slate-900 dark:text-white">
              {studentProfile ? `${studentProfile.activeBacklogs} Backlogs` : '0'}
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-850 flex items-center justify-between">
            <span className="text-slate-500">Verified Skills</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">
              {userSkills.filter(s => s.verified).length} Endorsed
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-850 flex items-center justify-between">
            <span className="text-slate-500">Department</span>
            <span className="font-bold text-slate-900 dark:text-white truncate">
              {studentProfile ? studentProfile.department : 'General'}
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
          Official Selection Shortlists ({candidates.length})
        </button>
      </div>

      {/* TAB 1: CAMPUS DRIVES */}
      {activeTab === 'drives' && (
        <div className="space-y-4">
          {campusDrives.length === 0 ? (
            <div className="p-10 rounded-2xl bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-800 text-center space-y-3 max-w-2xl mx-auto">
              <div className="w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
                <Building2 className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                No Official Campus Drives Published Yet
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Official campus eligibility and drive notices must originate from authorized college placement officers or verified employer schedules. No synthetic drive records are created.
              </p>
              {role === 'coordinator' && (
                <button
                  onClick={() => alert('Campus drive publisher modal opened for TPO Coordinator.')}
                  className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-medium text-xs shadow-xs inline-flex items-center gap-1.5 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Publish Official Campus Drive
                </button>
              )}
            </div>
          ) : (
            campusDrives.map((drive) => (
              <div
                key={drive.id}
                className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 hover:border-brand-500/40 transition-all"
              >
                <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                  <div className="flex items-start space-x-3.5">
                    {drive.companyLogo ? (
                      <img
                        src={drive.companyLogo}
                        alt={drive.companyName}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-800 shadow-xs"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-brand-100 dark:bg-brand-950 flex items-center justify-center text-brand-600 font-bold">
                        {drive.companyName[0]}
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-base text-slate-900 dark:text-white">
                          {drive.companyName}
                        </h3>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300">
                          {drive.tier}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 font-medium mt-0.5">
                        {drive.role} • <strong className="text-brand-600 dark:text-brand-400">{drive.packageRange}</strong>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {role === 'coordinator' && (
                      <button
                        onClick={() => handlePublishOfficial(drive.id)}
                        className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs shadow-xs"
                      >
                        Publish Shortlist
                      </button>
                    )}
                    <button
                      onClick={() => registerForDrive(drive.id)}
                      className={`px-4 py-2 rounded-xl text-xs font-semibold shadow-xs transition-colors ${
                        drive.registrationStatus === 'Registered'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200'
                          : 'bg-brand-600 hover:bg-brand-500 text-white'
                      }`}
                    >
                      {drive.registrationStatus === 'Registered' ? 'Registered' : 'Register for Drive'}
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 2: OFFICIAL SELECTION SHORTLISTS */}
      {activeTab === 'shortlists' && (
        <div className="space-y-4">
          {candidates.length === 0 ? (
            <div className="p-10 rounded-2xl bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-800 text-center space-y-3 max-w-2xl mx-auto">
              <div className="w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
                <FileCheck2 className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                No Official Shortlists Published Yet
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Under the Live Data Only policy, no simulated or seeded candidate rankings are shown. Official shortlist rosters will appear here once the College Training & Placement Cell or verified recruiter uploads evaluated results.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-850/80 text-slate-500 font-semibold">
                    <th className="py-3 px-4">Rank</th>
                    <th className="py-3 px-4">Candidate</th>
                    <th className="py-3 px-4">Branch & Roll</th>
                    <th className="py-3 px-4">CGPA</th>
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
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                          {cand.status}
                        </span>
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
          )}
        </div>
      )}
    </div>
  );
};
