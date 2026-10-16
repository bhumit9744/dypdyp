import React, { useState } from 'react';
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  Building2,
  Calendar,
  Award,
  ArrowRight,
  TrendingUp,
  ExternalLink,
  ShieldCheck,
  CheckSquare,
  Square,
  Sparkles,
  DollarSign,
  AlertTriangle,
  Scale,
  X,
  FileCheck2,
  BellRing,
  Video
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Application, ApplicationStatus, InterviewSchedule } from '../../types';

export const TrackerSubSection: React.FC = () => {
  const {
    applications,
    interviews,
    toggleInterviewChecklist,
    updateOfferDecision,
    setCurrentSection,
    setCurrentSubSection
  } = useApp();

  const [selectedAppId, setSelectedAppId] = useState<string>(applications[0]?.id || 'app_01');
  const [viewMode, setViewMode] = useState<'timeline' | 'kanban'>('timeline');
  const [showOfferCompareModal, setShowOfferCompareModal] = useState<boolean>(false);
  const [reminderToast, setReminderToast] = useState<string | null>(null);

  const currentApp = applications.find((a) => a.id === selectedAppId) || applications[0];
  const currentInterview = interviews.find((i) => i.companyName.toLowerCase() === currentApp?.companyName.toLowerCase());

  // Kanban columns
  const kanbanColumns: { id: ApplicationStatus; label: string; color: string }[] = [
    { id: 'Applied', label: 'Applied', color: 'border-blue-500 text-blue-600 bg-blue-50 dark:bg-blue-950/40' },
    { id: 'Screening', label: 'Screening / OA', color: 'border-amber-500 text-amber-600 bg-amber-50 dark:bg-amber-950/40' },
    { id: 'Interview', label: 'Technical Interview', color: 'border-brand-500 text-brand-600 bg-brand-50 dark:bg-brand-950/40' },
    { id: 'Offer', label: 'Offer Received', color: 'border-emerald-500 text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40' },
    { id: 'Rejected', label: 'Closed / Withdrawn', color: 'border-slate-500 text-slate-600 bg-slate-50 dark:bg-slate-900' }
  ];

  const handleSetReminder = (round: string) => {
    setReminderToast(`Reminder configured for ${round}. Google Calendar .ics notification ready.`);
    setTimeout(() => setReminderToast(null), 4000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Application Tracker & Recruitment Timeline
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Detailed step-by-step recruitment milestone progression, confirmed interview dates, and offer management.
              </p>
            </div>
          </div>
        </div>

        {/* View Switcher & Offer Comparison */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowOfferCompareModal(true)}
            className="px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold flex items-center space-x-1.5 transition-colors"
          >
            <Scale className="w-3.5 h-3.5 text-emerald-600" />
            <span>Side-by-Side Offer Comparison</span>
          </button>

          <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold">
            <button
              onClick={() => setViewMode('timeline')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'timeline'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Timeline View
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'kanban'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Kanban Pipeline
            </button>
          </div>
        </div>
      </div>

      {/* Reminder Toast */}
      {reminderToast && (
        <div className="p-3.5 rounded-xl bg-brand-50 dark:bg-brand-950 border border-brand-200 dark:border-brand-800 text-xs font-semibold text-brand-800 dark:text-brand-300 flex items-center justify-between animate-in fade-in">
          <div className="flex items-center space-x-2">
            <BellRing className="w-4 h-4 text-brand-600" />
            <span>{reminderToast}</span>
          </div>
          <button onClick={() => setReminderToast(null)} className="text-slate-400 hover:text-slate-600">✕</button>
        </div>
      )}

      {/* KANBAN VIEW */}
      {viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {kanbanColumns.map((col) => {
            const colApps = applications.filter((a) => {
              if (col.id === 'Rejected') return a.status === 'Rejected' || a.status === 'Withdrawn';
              return a.status === col.id;
            });

            return (
              <div
                key={col.id}
                className="flex flex-col rounded-2xl bg-slate-100/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 p-3.5 min-h-[420px]"
              >
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200 dark:border-slate-800">
                  <span className="font-bold text-xs text-slate-900 dark:text-white truncate">
                    {col.label}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${col.color}`}>
                    {colApps.length}
                  </span>
                </div>

                <div className="space-y-3 flex-1 overflow-y-auto">
                  {colApps.length === 0 ? (
                    <div className="h-32 flex flex-col items-center justify-center text-center p-3 text-slate-400">
                      <p className="text-[11px]">No applications</p>
                    </div>
                  ) : (
                    colApps.map((app) => (
                      <div
                        key={app.id}
                        onClick={() => {
                          setSelectedAppId(app.id);
                          setViewMode('timeline');
                        }}
                        className="p-4 rounded-xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700/80 shadow-xs space-y-2 hover:border-brand-500 cursor-pointer transition-all"
                      >
                        <div className="flex items-center space-x-2.5">
                          <img
                            src={app.companyLogo}
                            alt={app.companyName}
                            className="w-8 h-8 rounded-lg object-cover"
                          />
                          <div className="truncate">
                            <h4 className="font-semibold text-xs text-slate-900 dark:text-white truncate">
                              {app.companyName}
                            </h4>
                            <p className="text-[11px] text-brand-600 dark:text-brand-400 font-bold">
                              ₹ {app.packageLpa} LPA
                            </p>
                          </div>
                        </div>

                        <p className="text-xs text-slate-700 dark:text-slate-300 font-medium truncate">
                          {app.jobTitle}
                        </p>

                        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
                          <span>{app.currentRound}</span>
                          <span className="text-brand-600 font-semibold">Inspect →</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* TIMELINE VIEW */
        <div className="space-y-6">
          {/* Application Selection Tabs */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-2">
            {applications.map((app) => (
              <button
                key={app.id}
                onClick={() => setSelectedAppId(app.id)}
                className={`flex items-center space-x-2.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 border ${
                  selectedAppId === app.id
                    ? 'bg-brand-600 text-white border-brand-600 shadow-xs'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-brand-400'
                }`}
              >
                <img
                  src={app.companyLogo}
                  alt={app.companyName}
                  className="w-5 h-5 rounded-md object-cover"
                />
                <span>{app.companyName}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  selectedAppId === app.id ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600'
                }`}>
                  {app.status}
                </span>
              </button>
            ))}
          </div>

          {currentApp && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column: Visual Timeline & Update History */}
              <div className="lg:col-span-2 space-y-6">
                {/* Application Header Card */}
                <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center space-x-4">
                      <img
                        src={currentApp.companyLogo}
                        alt={currentApp.companyName}
                        className="w-14 h-14 rounded-2xl object-cover border border-slate-200 dark:border-slate-800 shadow-xs"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                            {currentApp.companyName}
                          </h2>
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300 border border-brand-200">
                            {currentApp.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-300 font-medium mt-0.5">
                          {currentApp.jobTitle} • ₹ {currentApp.packageLpa} LPA CTC
                        </p>
                        <p className="text-[11px] text-slate-400 mt-1">
                          Source: {currentApp.source || 'Campus Drive'} • Applied on {currentApp.appliedDate}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] uppercase font-bold text-slate-400">Match Fit</span>
                      <p className="text-base font-extrabold text-brand-600 dark:text-brand-400">
                        {currentApp.matchScore}%
                      </p>
                    </div>
                  </div>

                  {/* Contextual Next-Step Guidance */}
                  <div className="p-3.5 rounded-xl bg-brand-50/60 dark:bg-brand-950/40 border border-brand-200 dark:border-brand-900/50 flex items-start space-x-2.5 text-xs text-brand-900 dark:text-brand-200">
                    <Sparkles className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block">Contextual Next-Step Guidance:</strong>
                      <span className="text-slate-600 dark:text-slate-300">
                        {currentApp.status === 'Interview'
                          ? 'Review system design partitioning strategies. Principal architect emphasizes low write-latency.'
                          : currentApp.status === 'Offer'
                          ? 'Formal digital offer issued. Review compensation breakup and acceptance conditions by Oct 24.'
                          : currentApp.status === 'Screening'
                          ? 'Online assessment submitted. College verified evaluation in progress.'
                          : 'Application registered in portal. Prepare your elevator pitch and GitHub walkthrough.'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Recruitment Stages Visual Timeline */}
                <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                    <Clock className="w-4 h-4 text-brand-600" />
                    Multi-Round Recruitment Timeline
                  </h3>

                  <div className="space-y-4 pt-2">
                    {currentApp.timeline.map((step, idx) => (
                      <div key={idx} className="flex items-start space-x-3.5">
                        <div className="flex flex-col items-center">
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                              step.completed
                                ? 'bg-emerald-500 text-white'
                                : step.current
                                ? 'bg-brand-600 text-white animate-pulse'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700'
                            }`}
                          >
                            {step.completed ? '✓' : idx + 1}
                          </div>
                          {idx !== currentApp.timeline.length - 1 && (
                            <div className="w-0.5 h-10 bg-slate-200 dark:bg-slate-800 my-1" />
                          )}
                        </div>

                        <div className="flex-1 pb-2">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs text-slate-900 dark:text-white">
                              {step.step}
                            </span>
                            <span className="text-[11px] text-slate-400 font-mono">
                              {step.date}
                            </span>
                          </div>
                          {step.source && (
                            <span
                              className={`text-[9px] font-semibold px-2 py-0.2 rounded mt-1 inline-block ${
                                step.source === 'Recruiter Confirmed'
                                  ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
                                  : step.source === 'College Verified Integration'
                                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                  : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
                              }`}
                            >
                              {step.source}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Auditable Timestamped Update History */}
                {currentApp.updateHistory && currentApp.updateHistory.length > 0 && (
                  <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                      Auditable Recruitment Activity Log
                    </h3>
                    <div className="space-y-2">
                      {currentApp.updateHistory.map((item, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 text-xs flex items-start justify-between gap-3"
                        >
                          <div>
                            <span className="font-bold text-slate-900 dark:text-white block">
                              {item.step}
                            </span>
                            <p className="text-slate-500 text-[11px] mt-0.5">
                              {item.details}
                            </p>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="text-[10px] text-slate-400 font-mono block">
                              {item.date}
                            </span>
                            <span
                              className={`text-[9px] font-semibold px-1.5 py-0.2 rounded ${
                                item.source === 'Recruiter Confirmed'
                                  ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
                                  : item.source === 'College Verified Integration'
                                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                  : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
                              }`}
                            >
                              {item.source}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Confirmed Interview Slot, Prep Checklist, Offer Card */}
              <div className="space-y-6">
                {/* Confirmed Interview Card (if scheduled) */}
                {currentInterview && (
                  <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-brand-600 dark:text-brand-400 flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" />
                        Confirmed Interview Slot
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950 border border-emerald-200">
                        Recruiter Confirmed
                      </span>
                    </div>

                    <div className="space-y-1">
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                        {currentInterview.roundName}
                      </h4>
                      <p className="text-xs text-slate-500">
                        {currentInterview.date} • {currentInterview.time} ({currentInterview.durationMinutes} mins)
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Interviewer: <strong>{currentInterview.interviewer}</strong>
                      </p>
                    </div>

                    <div className="flex items-center space-x-2 pt-2">
                      <button
                        onClick={() => {
                          setCurrentSection('career');
                          setCurrentSubSection('interview-studio');
                        }}
                        className="flex-1 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs text-center flex items-center justify-center gap-1.5 shadow-xs hover:shadow-brand-500/20 transition-all"
                      >
                        <Video className="w-3.5 h-3.5" />
                        <span>Launch In-Platform Interview Studio</span>
                      </button>
                      <button
                        onClick={() => handleSetReminder(currentInterview.roundName)}
                        className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                        title="Set Calendar Reminder"
                      >
                        <BellRing className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Preparation Topics */}
                    {currentInterview.preparationTopics && (
                      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1.5 text-xs">
                        <span className="font-semibold text-slate-700 dark:text-slate-300">
                          Role & Round Specific Topics:
                        </span>
                        <div className="space-y-1">
                          {currentInterview.preparationTopics.map((topic, i) => (
                            <div key={i} className="flex items-center space-x-1.5 text-slate-600 dark:text-slate-400 text-[11px]">
                              <span>•</span>
                              <span>{topic}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Preparation Checklist */}
                {currentInterview && currentInterview.preparationChecklist && (
                  <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3 text-xs">
                    <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <CheckSquare className="w-4 h-4 text-emerald-500" />
                      Interactive Preparation Checklist
                    </h4>
                    <div className="space-y-2">
                      {currentInterview.preparationChecklist.map((item, idx) => (
                        <div
                          key={idx}
                          onClick={() => toggleInterviewChecklist(currentInterview.id, idx)}
                          className="flex items-start space-x-2 cursor-pointer p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-850 transition-colors"
                        >
                          {item.done ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          ) : (
                            <Square className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                          )}
                          <span className={item.done ? 'line-through text-slate-400' : 'text-slate-700 dark:text-slate-200'}>
                            {item.item}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Offer Management Card (if offer details present) */}
                {currentApp.offerDetails && (
                  <div className="p-6 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 shadow-xs space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5">
                        <Award className="w-4 h-4 text-emerald-600" />
                        Offer Management
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">
                        {currentApp.offerDetails.status}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-900 space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Total CTC:</span>
                        <strong className="text-base text-emerald-600 font-extrabold">
                          ₹ {currentApp.offerDetails.totalCtcLpa} LPA
                        </strong>
                      </div>
                      <div className="flex justify-between text-slate-600 dark:text-slate-400 text-[11px]">
                        <span>Base Salary:</span>
                        <span>₹ {currentApp.offerDetails.baseSalaryLpa} LPA</span>
                      </div>
                      <div className="flex justify-between text-slate-600 dark:text-slate-400 text-[11px]">
                        <span>Joining Bonus & Performance:</span>
                        <span>₹ {currentApp.offerDetails.variableLpa} LPA</span>
                      </div>
                      <div className="flex justify-between text-slate-600 dark:text-slate-400 text-[11px]">
                        <span>Joining Location:</span>
                        <span>{currentApp.offerDetails.location}</span>
                      </div>
                      <div className="flex justify-between text-slate-600 dark:text-slate-400 text-[11px]">
                        <span>Decision Deadline:</span>
                        <strong className="text-rose-600 dark:text-rose-400">
                          {currentApp.offerDetails.acceptanceDeadline}
                        </strong>
                      </div>
                    </div>

                    {/* Offer Actions */}
                    <div className="flex items-center space-x-2 pt-1 text-xs">
                      <button
                        onClick={() => updateOfferDecision(currentApp.id, 'Accepted')}
                        className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-colors"
                      >
                        Accept Offer
                      </button>
                      <button
                        onClick={() => updateOfferDecision(currentApp.id, 'Declined')}
                        className="px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold hover:bg-slate-100"
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Side-by-Side Offer Comparison Modal */}
      {showOfferCompareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600">
                  <Scale className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    Side-by-Side Corporate Offer Comparison
                  </h3>
                  <p className="text-xs text-slate-500">
                    Compare confirmed corporate offers against college placement tier benchmarks.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowOfferCompareModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Comparison Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {/* Card 1: Morgan Stanley (Confirmed Offer) */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-850 border-2 border-emerald-500/60 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">Morgan Stanley</h4>
                    <p className="text-[11px] text-slate-500">Junior Data Engineer</p>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">
                    Confirmed Offer
                  </span>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Total CTC:</span>
                    <strong className="text-emerald-600 text-sm">₹ 20.00 LPA</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Fixed Base:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">₹ 15.50 LPA</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Variable / Joining:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">₹ 4.50 LPA</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Location:</span>
                    <span className="text-slate-800 dark:text-slate-200">Mumbai (Nesco)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Service Bond:</span>
                    <span className="text-emerald-600 font-semibold">None (0 Months)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Work Policy:</span>
                    <span className="text-slate-800 dark:text-slate-200">Hybrid (3 Days Office)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Acceptance Deadline:</span>
                    <strong className="text-rose-600">Oct 24, 2026</strong>
                  </div>
                </div>
              </div>

              {/* Card 2: Atlassian (Benchmark Stage SDE-1) */}
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">Atlassian</h4>
                    <p className="text-[11px] text-slate-500">MTS Backend (SDE-1)</p>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-brand-100 text-brand-800 dark:bg-brand-950 dark:text-brand-300">
                    Round 2 Active
                  </span>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Projected CTC:</span>
                    <strong className="text-brand-600 text-sm">₹ 28.50 LPA</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Fixed Base:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">₹ 20.00 LPA</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">RSU Equity (4 Years):</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">₹ 6.50 LPA/yr</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Location:</span>
                    <span className="text-slate-800 dark:text-slate-200">Bengaluru / Remote-First</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Service Bond:</span>
                    <span className="text-emerald-600 font-semibold">None (0 Months)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Work Policy:</span>
                    <span className="text-slate-800 dark:text-slate-200">TEAM Anywhere (Remote)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Current Phase:</span>
                    <span className="text-brand-600 font-bold">Round 2 Tomorrow</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850 text-[11px] text-slate-500">
              Note: Acceptance of a Super Dream or Dream tier offer conforms to the official D.Y. Patil Placement Policy (Single Offer Acceptance rule).
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowOfferCompareModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
              >
                Close Comparison
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
