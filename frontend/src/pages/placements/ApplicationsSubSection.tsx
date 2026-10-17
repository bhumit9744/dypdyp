import React, { useState } from 'react';
import {
  FileCheck2,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  Search,
  Filter,
  AlertTriangle,
  FileText,
  BookmarkCheck,
  ShieldCheck,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  FileDown,
  ChevronDown,
  ChevronUp,
  Award,
  Sparkles,
  Edit3,
  CheckSquare,
  Square,
  Bell,
  X,
  Send,
  Plus
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Application, ApplicationStatus } from '../../types';

export const ApplicationsSubSection: React.FC = () => {
  const {
    applications,
    addApplication,
    updateApplicationNotes,
    toggleApplicationTask,
    updateApplicationStatus,
    setCurrentSection,
    setCurrentSubSection
  } = useApp();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedSource, setSelectedSource] = useState<string>('All');
  const [activeAppDetail, setActiveAppDetail] = useState<Application | null>(null);
  const [editingNotesAppId, setEditingNotesAppId] = useState<string | null>(null);
  const [noteInput, setNoteInput] = useState<string>('');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [userResumes, setUserResumes] = useState<any[]>([]);
  const [attachWarning, setAttachWarning] = useState<string | null>(null);

  React.useEffect(() => {
    fetch('http://127.0.0.1:8000/api/v1/resumes')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setUserResumes(data);
      })
      .catch(() => {});
  }, []);

  const handleAttachResume = async (appId: string, resumeId: string) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/v1/resumes/applications/${appId}/attach-resume?resume_id=${resumeId}`, {
        method: 'POST'
      });
      if (res.ok) {
        const data = await res.json();
        setAttachWarning(data.warning || null);
        const selected = userResumes.find((r) => r.id === resumeId);
        if (selected && activeAppDetail) {
          setActiveAppDetail({
            ...activeAppDetail,
            resumeVersion: {
              fileName: `${selected.title} (${selected.target_role})`,
              uploadedAt: data.snapshot_date || 'Just now',
              atsScore: selected.ats_score
            }
          });
        }
      }
    } catch (err) {
      console.error('Failed to attach resume:', err);
    }
  };

  // New Application Form State
  const [newCompany, setNewCompany] = useState<string>('');
  const [newTitle, setNewTitle] = useState<string>('');
  const [newPackage, setNewPackage] = useState<number>(15.0);
  const [newSource, setNewSource] = useState<string>('Off-Campus Drive');
  const [newType, setNewType] = useState<string>('Full-time');
  const [newStatus, setNewStatus] = useState<ApplicationStatus>('Applied');
  const [newNotes, setNewNotes] = useState<string>('');
  const [newLink, setNewLink] = useState<string>('');

  // Overview metrics
  const totalApps = applications.length;
  const activeApps = applications.filter(a => a.status === 'Applied' || a.status === 'Screening' || a.status === 'Interview').length;
  const upcomingInterviewsCount = applications.filter(a => a.status === 'Interview').length;
  const offersCount = applications.filter(a => a.status === 'Offer').length;

  // Filtered applications
  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      searchQuery.trim() === '' ||
      app.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.jobTitle.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = selectedStatus === 'All' || app.status === selectedStatus;
    const matchesSource = selectedSource === 'All' || app.source === selectedSource;

    return matchesSearch && matchesStatus && matchesSource;
  });

  // Action Center: collect all open tasks across applications
  const allActionTasks = applications.flatMap((app) =>
    (app.tasks || [])
      .filter((t) => !t.completed)
      .map((t) => ({ ...t, appId: app.id, companyName: app.companyName }))
  );

  const handleOpenDetail = (app: Application) => {
    setActiveAppDetail(app);
    setNoteInput(app.privateNotes || '');
  };

  const handleSaveNotes = (appId: string) => {
    updateApplicationNotes(appId, noteInput);
    setEditingNotesAppId(null);
    if (activeAppDetail && activeAppDetail.id === appId) {
      setActiveAppDetail({ ...activeAppDetail, privateNotes: noteInput });
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                My Applications
                <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-brand-100 dark:bg-brand-900/60 text-brand-700 dark:text-brand-300">
                  {totalApps} Total Tracked
                </span>
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Centralized dashboard managing on-campus drives, off-campus roles, alumni referrals, and explore submissions.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold flex items-center space-x-1.5 shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Log Application</span>
          </button>
          <button
            onClick={() => setCurrentSubSection('tracker')}
            className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center space-x-1.5 transition-colors"
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Tracker</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 4 Metric Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center space-x-3.5">
          <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Total Applications
            </span>
            <span className="text-xl font-bold text-slate-900 dark:text-white">
              {totalApps}
            </span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center space-x-3.5">
          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Active in Pipeline
            </span>
            <span className="text-xl font-bold text-slate-900 dark:text-white">
              {activeApps}
            </span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center space-x-3.5">
          <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Upcoming Interviews
            </span>
            <span className="text-xl font-bold text-slate-900 dark:text-white">
              {upcomingInterviewsCount}
            </span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center space-x-3.5">
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Offers Received
            </span>
            <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
              {offersCount}
            </span>
          </div>
        </div>
      </div>

      {/* Action Center Banner */}
      {allActionTasks.length > 0 && (
        <div className="p-4 rounded-2xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bell className="w-4 h-4 text-amber-600" />
              <h3 className="font-bold text-xs text-amber-900 dark:text-amber-200">
                Action Center: {allActionTasks.length} Pending Tasks & Deadlines
              </h3>
            </div>
            <span className="text-[10px] text-amber-700 dark:text-amber-400 font-semibold">
              Prioritize before next rounds
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 pt-1">
            {allActionTasks.map((task) => (
              <div
                key={task.id}
                onClick={() => toggleApplicationTask(task.appId, task.id)}
                className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-900/40 text-xs flex items-start space-x-2 cursor-pointer hover:border-amber-400 transition-colors"
              >
                <Square className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <p className="font-semibold text-slate-900 dark:text-white truncate">
                    {task.title}
                  </p>
                  <span className="text-[10px] text-slate-500">
                    {task.companyName} • Due: <strong className="text-amber-700 dark:text-amber-400">{task.dueDate}</strong>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter and Search Toolbar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search applications by company or role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-brand-500"
          />
        </div>

        {/* Status Filter */}
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-3 py-2 rounded-xl text-xs font-medium bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none focus:border-brand-500"
        >
          <option value="All">All Pipeline Stages</option>
          <option value="Interview">Interview Stage</option>
          <option value="Screening">Online Screening / OA</option>
          <option value="Applied">Application Submitted</option>
          <option value="Offer">Offer Received</option>
          <option value="Rejected">Rejected</option>
          <option value="Withdrawn">Withdrawn</option>
        </select>

        {/* Source Filter */}
        <select
          value={selectedSource}
          onChange={(e) => setSelectedSource(e.target.value)}
          className="px-3 py-2 rounded-xl text-xs font-medium bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none focus:border-brand-500"
        >
          <option value="All">All Application Sources</option>
          <option value="Campus Direct Drive">Campus Direct Drive</option>
          <option value="Alumni Referral">Alumni Referral</option>
          <option value="Off-Campus Drive">Off-Campus Drive</option>
          <option value="Explore Module">Explore Module</option>
        </select>
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        {filteredApplications.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
            <FileCheck2 className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto" />
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              No genuine applications logged yet.
            </h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
              Operating under Live Data Policy. No demo applications are seeded. Track your placement applications by logging authentic off-campus jobs or applying to campus drives.
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-xs inline-flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Log First Application
            </button>
          </div>
        ) : (
          filteredApplications.map((app) => (
            <div
              key={app.id}
              className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 hover:border-brand-500/40 transition-all"
            >
              {/* Duplicate Notice Banner (if applicable) */}
              {app.isDuplicateWarning && (
                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 flex items-start space-x-2 text-xs text-amber-800 dark:text-amber-200">
                  <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Duplicate Application Warning: </span>
                    <span>{app.duplicateWarningText}</span>
                  </div>
                </div>
              )}

              {/* Main Card Header */}
              <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                <div className="flex items-start space-x-3.5">
                  <img
                    src={app.companyLogo}
                    alt={app.companyName}
                    className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-800 shadow-xs shrink-0"
                  />
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-bold text-base text-slate-900 dark:text-white">
                        {app.jobTitle}
                      </h3>
                      {/* Status Badge */}
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          app.status === 'Offer'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : app.status === 'Interview'
                            ? 'bg-brand-100 text-brand-800 dark:bg-brand-950 dark:text-brand-300'
                            : app.status === 'Screening'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                            : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                        }`}
                      >
                        {app.status} Stage
                      </span>

                      {/* Source Tag */}
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {app.source || 'Campus Drive'}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 mt-1">
                      <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        {app.companyName}
                      </span>
                      <span>•</span>
                      <span className="font-bold text-brand-600 dark:text-brand-400">
                        ₹ {app.packageLpa} LPA
                      </span>
                      <span>•</span>
                      <span>Applied: {app.appliedDate}</span>
                    </div>
                  </div>
                </div>

                {/* Right CTA and Match */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2">
                  <div className="text-left sm:text-right">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase">
                      Current Milestone
                    </span>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {app.currentRound}
                    </p>
                  </div>
                  <span className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">
                    {app.nextStepDeadline}
                  </span>
                </div>
              </div>

              {/* Resume & Document Version Tag */}
              {app.resumeVersion && (
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800/80 flex flex-wrap items-center justify-between text-xs gap-2">
                  <div className="flex items-center space-x-2">
                    <FileText className="w-3.5 h-3.5 text-brand-500" />
                    <span className="text-slate-500">Submitted Resume:</span>
                    <strong className="text-slate-800 dark:text-slate-200 font-mono text-[11px]">
                      {app.resumeVersion.fileName}
                    </strong>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-950 font-semibold">
                      ATS: {app.resumeVersion.atsScore}%
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    {app.supportingDocuments && app.supportingDocuments.length > 0 && (
                      <span className="text-[11px] text-slate-400">
                        {app.supportingDocuments.length} Verified {app.supportingDocuments.length === 1 ? 'Proof' : 'Proofs'} Attached
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Private Notes Preview / Input */}
              <div className="p-3 rounded-xl bg-slate-100/60 dark:bg-slate-850/60 border border-slate-200/60 dark:border-slate-800/60 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Edit3 className="w-3.5 h-3.5 text-slate-400" />
                    Private Recruiter Conversation & Preparation Notes:
                  </span>
                  {editingNotesAppId !== app.id && (
                    <button
                      onClick={() => {
                        setEditingNotesAppId(app.id);
                        setNoteInput(app.privateNotes || '');
                      }}
                      className="text-[11px] text-brand-600 hover:underline font-medium"
                    >
                      {app.privateNotes ? 'Edit Notes' : '+ Add Private Note'}
                    </button>
                  )}
                </div>

                {editingNotesAppId === app.id ? (
                  <div className="space-y-2 pt-1">
                    <textarea
                      value={noteInput}
                      onChange={(e) => setNoteInput(e.target.value)}
                      placeholder="Add private conversation points, interviewer names, expected questions..."
                      rows={2}
                      className="w-full p-2.5 rounded-lg text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none"
                    />
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => setEditingNotesAppId(null)}
                        className="px-2.5 py-1 rounded text-xs bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleSaveNotes(app.id)}
                        className="px-3 py-1 rounded text-xs bg-brand-600 text-white font-semibold"
                      >
                        Save Notes
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-slate-600 dark:text-slate-400 italic text-[11px]">
                    {app.privateNotes || 'No private notes entered yet. Notes remain strictly private to you.'}
                  </p>
                )}
              </div>

              {/* Footer Actions */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center space-x-3">
                  <span className="text-slate-400 text-[11px]">
                    Match Fit: <strong className="text-brand-600 dark:text-brand-400">{app.matchScore}%</strong>
                  </span>
                  <span>•</span>
                  {app.externalApplicationLink && (
                    <a
                      href={app.externalApplicationLink}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-slate-500 hover:text-brand-600 transition-colors"
                    >
                      <span>Careers Portal</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleOpenDetail(app)}
                    className="px-4 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold transition-colors"
                  >
                    View Application Dossier
                  </button>
                  <button
                    onClick={() => setCurrentSubSection('tracker')}
                    className="px-4 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold transition-colors"
                  >
                    Track in Timeline
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Application Dossier Detail Drawer Modal */}
      {activeAppDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-5">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center space-x-3.5">
                <img
                  src={activeAppDetail.companyLogo}
                  alt={activeAppDetail.companyName}
                  className="w-12 h-12 rounded-xl object-cover"
                />
                <div>
                  <h2 className="font-bold text-base text-slate-900 dark:text-white">
                    {activeAppDetail.jobTitle}
                  </h2>
                  <p className="text-xs text-slate-500">
                    {activeAppDetail.companyName} • ₹ {activeAppDetail.packageLpa} LPA CTC
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveAppDetail(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Stage Selector */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Update Application Pipeline Stage:</span>
              <select
                value={activeAppDetail.status}
                onChange={(e) => {
                  const newStatus = e.target.value as ApplicationStatus;
                  updateApplicationStatus(activeAppDetail.id, newStatus);
                  setActiveAppDetail({ ...activeAppDetail, status: newStatus });
                }}
                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold text-slate-800 dark:text-slate-200 focus:outline-none"
              >
                <option value="Applied">Applied</option>
                <option value="Screening">Screening / OA</option>
                <option value="Interview">Interview</option>
                <option value="Offer">Offer</option>
                <option value="Rejected">Rejected</option>
                <option value="Withdrawn">Withdrawn</option>
              </select>
            </div>

            {/* Description & Eligibility */}
            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[10px]">
                Role Scope & Requirements
              </h4>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                {activeAppDetail.jobDescription || 'Full stack engineering role with distributed backend microservices ownership.'}
              </p>
              {activeAppDetail.eligibilityCriteria && (
                <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 flex flex-wrap gap-4 text-slate-700 dark:text-slate-300">
                  <span>Min Cutoff: <strong>{activeAppDetail.eligibilityCriteria.minCgpa} CGPA</strong></span>
                  <span>Allowed Backlogs: <strong>{activeAppDetail.eligibilityCriteria.maxBacklogs}</strong></span>
                  <span>Branches: <strong>{activeAppDetail.eligibilityCriteria.eligibleBranches.join(', ')}</strong></span>
                </div>
              )}
            </div>

            {/* Resume Version and Documents */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[10px]">
                  Submitted Resume Snapshot
                </h4>
                <button
                  onClick={() => {
                    setCurrentSection('resume');
                  }}
                  className="text-[11px] font-semibold text-brand-600 hover:underline flex items-center gap-1"
                >
                  <FileText className="w-3 h-3" />
                  <span>Open in Resume Studio</span>
                </button>
              </div>

              {/* Attach / Change Tailored Resume */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 space-y-2.5">
                <div>
                  <label className="text-[10px] font-medium text-slate-500 block mb-1">
                    Attach Tailored Resume Version
                  </label>
                  <select
                    onChange={(e) => {
                      if (e.target.value) handleAttachResume(activeAppDetail.id, e.target.value);
                    }}
                    defaultValue=""
                    className="w-full p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
                  >
                    <option value="" disabled>-- Select tailored version to attach --</option>
                    {userResumes.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.title} ({r.target_role}) — ATS {r.ats_score}%
                      </option>
                    ))}
                  </select>
                </div>

                {attachWarning && (
                  <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 text-[11px] flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                    <span>{attachWarning}</span>
                  </div>
                )}

                {activeAppDetail.resumeVersion ? (
                  <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 dark:border-slate-700">
                    <div>
                      <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                        {activeAppDetail.resumeVersion.fileName}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        Snapshot recorded: {activeAppDetail.resumeVersion.uploadedAt}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-emerald-600">
                      ATS {activeAppDetail.resumeVersion.atsScore}%
                    </span>
                  </div>
                ) : (
                  <div className="text-[11px] text-slate-400 italic">
                    No tailored resume snapshot attached yet. Select a version above to record snapshot.
                  </div>
                )}

                {activeAppDetail.supportingDocuments && activeAppDetail.supportingDocuments.map((doc, idx) => (
                  <div key={idx} className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100 dark:border-slate-800">
                    <span>• {doc.name}</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                      Verified
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Confirmed Update History */}
            {activeAppDetail.updateHistory && activeAppDetail.updateHistory.length > 0 && (
              <div className="space-y-2 text-xs">
                <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[10px]">
                  Auditable Recruitment Log (Source Attribution)
                </h4>
                <div className="space-y-2">
                  {activeAppDetail.updateHistory.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 text-xs flex items-start justify-between gap-3"
                    >
                      <div>
                        <strong className="text-slate-800 dark:text-slate-200 block">{item.step}</strong>
                        <p className="text-slate-500 text-[11px] mt-0.5">{item.details}</p>
                      </div>
                      <span
                        className={`text-[9px] font-bold px-2 py-0.5 rounded shrink-0 ${
                          item.source === 'Recruiter Confirmed'
                            ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
                            : item.source === 'College Verified Integration'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {item.source}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Modal Footer */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end space-x-2">
              <button
                onClick={() => setActiveAppDetail(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}
      {/* LOG APPLICATION MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-brand-600" />
                Log Real Job Application
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!newCompany || !newTitle) {
                  alert('Company name and job title are required.');
                  return;
                }
                const newAppRecord: Application = {
                  id: `app_${Date.now()}`,
                  jobId: `job_${Date.now()}`,
                  jobTitle: newTitle,
                  companyName: newCompany,
                  companyLogo: '',
                  packageLpa: Number(newPackage) || 0,
                  appliedDate: new Date().toISOString().split('T')[0],
                  status: newStatus,
                  currentRound: 'Application Review',
                  matchScore: 0,
                  source: newSource as any,
                  opportunityType: newType as any,
                  externalApplicationLink: newLink || undefined,
                  privateNotes: newNotes,
                  tasks: [
                    { id: `tsk_${Date.now()}`, title: 'Review company tech stack & prepare elevator pitch', dueDate: 'In 3 days', completed: false, type: 'InterviewPrep' }
                  ],
                  timeline: [
                    { step: 'Application Submitted', date: 'Today', completed: true, current: true, source: 'Student Reported' }
                  ],
                  updateHistory: [
                    { step: 'Application Logged in Hub', date: 'Today', source: 'Student Reported', details: 'Candidate submitted verified application via Placement Hub portal.' }
                  ]
                };
                await addApplication(newAppRecord);
                setShowAddModal(false);
                setNewCompany('');
                setNewTitle('');
                setNewNotes('');
                setNewLink('');
              }}
              className="space-y-3.5 text-xs"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Company Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Google, Datadog"
                    value={newCompany}
                    onChange={(e) => setNewCompany(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 text-slate-800 dark:text-slate-200 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Job Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Associate Software Engineer"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 text-slate-800 dark:text-slate-200 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Package (LPA)</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    value={newPackage}
                    onChange={(e) => setNewPackage(parseFloat(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 text-slate-800 dark:text-slate-200 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Source</label>
                  <select
                    value={newSource}
                    onChange={(e) => setNewSource(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 text-slate-800 dark:text-slate-200 focus:outline-none"
                  >
                    <option value="Off-Campus Drive">Off-Campus Drive</option>
                    <option value="Campus Direct Drive">Campus Direct Drive</option>
                    <option value="Alumni Referral">Alumni Referral</option>
                    <option value="Explore Module">Explore Module</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Current Stage</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as ApplicationStatus)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 text-slate-800 dark:text-slate-200 focus:outline-none"
                  >
                    <option value="Applied">Applied</option>
                    <option value="Screening">Screening</option>
                    <option value="Interview">Interview</option>
                    <option value="Offer">Offer</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Careers / Job Portal URL</label>
                <input
                  type="url"
                  placeholder="https://careers.company.com/job/..."
                  value={newLink}
                  onChange={(e) => setNewLink(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 text-slate-800 dark:text-slate-200 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Private Notes</label>
                <textarea
                  rows={2}
                  placeholder="Referral name, job requisitions, or key dates..."
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 text-slate-800 dark:text-slate-200 focus:outline-none"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-brand-600 hover:bg-brand-500 text-white"
                >
                  Save Real Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
