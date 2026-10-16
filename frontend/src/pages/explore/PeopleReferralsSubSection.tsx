import React, { useState } from 'react';
import {
  Users,
  Search,
  Building2,
  GraduationCap,
  GitPullRequest,
  Calendar,
  CalendarDays,
  Send,
  ExternalLink,
  CheckCircle2,
  Clock,
  Sparkles,
  UserCheck,
  ShieldCheck,
  Mail,
  ArrowRight,
  Briefcase
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { LinkedinIcon, GithubIcon } from '../../components/common/Icons';
import { Alumni, RecruiterContact, ReferralOpportunity, NetworkingEvent } from '../../types';

export const PeopleReferralsSubSection: React.FC = () => {
  const {
    alumni,
    recruiters,
    referrals,
    networkingEvents,
    requestReferral,
    registerForEvent,
    setCurrentSubSection,
    setSearchQuery
  } = useApp();

  const [activeTab, setActiveTab] = useState<'alumni' | 'referrals' | 'recruiters' | 'events'>('alumni');
  const [peopleSearch, setPeopleSearch] = useState<string>('');
  const [selectedCompany, setSelectedCompany] = useState<string>('All');
  const [referralSuccessModal, setReferralSuccessModal] = useState<string | null>(null);

  // Extract companies represented by alumni
  const alumniCompanies = Array.from(new Set(alumni.map((a) => a.company)));

  // Filter Alumni
  const filteredAlumni = alumni.filter((a) => {
    const matchesSearch =
      peopleSearch.trim() === '' ||
      a.name.toLowerCase().includes(peopleSearch.toLowerCase()) ||
      a.company.toLowerCase().includes(peopleSearch.toLowerCase()) ||
      a.role.toLowerCase().includes(peopleSearch.toLowerCase()) ||
      (a.mentorshipTopics && a.mentorshipTopics.some((t) => t.toLowerCase().includes(peopleSearch.toLowerCase())));

    const matchesComp = selectedCompany === 'All' || a.company === selectedCompany;

    return matchesSearch && matchesComp;
  });

  // Filter Referrals
  const filteredReferrals = referrals.filter((r) => {
    return (
      peopleSearch.trim() === '' ||
      r.roleTitle.toLowerCase().includes(peopleSearch.toLowerCase()) ||
      r.companyName.toLowerCase().includes(peopleSearch.toLowerCase()) ||
      r.alumniName.toLowerCase().includes(peopleSearch.toLowerCase())
    );
  });

  // Filter Recruiters
  const filteredRecruiters = recruiters.filter((rec) => {
    return (
      peopleSearch.trim() === '' ||
      rec.name.toLowerCase().includes(peopleSearch.toLowerCase()) ||
      rec.company.toLowerCase().includes(peopleSearch.toLowerCase()) ||
      rec.role.toLowerCase().includes(peopleSearch.toLowerCase()) ||
      rec.hiringFocus.some((f) => f.toLowerCase().includes(peopleSearch.toLowerCase()))
    );
  });

  const handleJumpToAlumniJobs = () => {
    setCurrentSubSection('jobs-internships');
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Module Header */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                People, Alumni & Referrals
                <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300">
                  Verified Directory
                </span>
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Opt-in alumni network, internal employee referrals, company recruiters, and live networking sessions.
              </p>
            </div>
          </div>
        </div>

        {/* Quick link to Alumni-shared jobs in Module A */}
        <button
          onClick={handleJumpToAlumniJobs}
          className="px-4 py-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/80 hover:bg-amber-100 dark:hover:bg-amber-900 text-xs font-semibold transition-colors flex items-center space-x-1.5"
        >
          <Briefcase className="w-3.5 h-3.5 text-amber-600" />
          <span>View Alumni-Shared Jobs</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Tabs and Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Sub-Tabs */}
          <div className="flex items-center space-x-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('alumni')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'alumni'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Alumni Directory ({alumni.length})
            </button>
            <button
              onClick={() => setActiveTab('referrals')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'referrals'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Referral Requests ({referrals.length})
            </button>
            <button
              onClick={() => setActiveTab('recruiters')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'recruiters'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Opt-in Recruiters ({recruiters.length})
            </button>
            <button
              onClick={() => setActiveTab('events')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'events'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Networking Events ({networkingEvents.length})
            </button>
          </div>

          {/* Company Filter (for alumni tab) */}
          {activeTab === 'alumni' && (
            <select
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 text-xs font-medium text-slate-700 dark:text-slate-200 focus:outline-none"
            >
              <option value="All">All Employer Affiliations</option>
              {alumniCompanies.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={
              activeTab === 'alumni'
                ? 'Search alumni by name, employer, role, or mentorship topic...'
                : activeTab === 'referrals'
                ? 'Search referrals by target role or company...'
                : activeTab === 'recruiters'
                ? 'Search recruiters by company or technical hiring domain...'
                : 'Search networking events...'
            }
            value={peopleSearch}
            onChange={(e) => setPeopleSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none"
          />
        </div>
      </div>

      {/* TAB 1: ALUMNI DIRECTORY */}
      {activeTab === 'alumni' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredAlumni.map((alum) => (
            <div
              key={alum.id}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-4 hover:border-amber-500/40 transition-colors"
            >
              <div className="space-y-3">
                <div className="flex items-start space-x-3.5">
                  <img
                    src={alum.avatar}
                    alt={alum.name}
                    className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-800"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                        {alum.name}
                      </h3>
                      {alum.isOptIn && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 font-semibold shrink-0">
                          Opt-In
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-amber-600 dark:text-amber-400 font-medium truncate">
                      {alum.role}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <Building2 className="w-3 h-3 text-slate-400" />
                      {alum.company} • {alum.location}
                    </p>
                  </div>
                </div>

                <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-850 text-[11px] text-slate-600 dark:text-slate-400 flex items-center justify-between">
                  <span>Batch of {alum.batch}</span>
                  <span>{alum.department}</span>
                </div>

                {alum.mentorshipTopics && alum.mentorshipTopics.length > 0 && (
                  <div className="space-y-1">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase">
                      Mentorship Topics:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {alum.mentorshipTopics.map((topic, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-md text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <a
                    href={alum.linkedinUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-brand-600"
                    title="LinkedIn Profile"
                  >
                    <LinkedinIcon className="w-3.5 h-3.5" />
                  </a>
                  {alum.githubUrl && (
                    <a
                      href={alum.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900"
                      title="GitHub Profile"
                    >
                      <GithubIcon className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>

                {alum.willingToRefer ? (
                  <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                    Open to Referrals
                  </span>
                ) : (
                  <span className="text-[11px] text-slate-400">Mentorship Only</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: REFERRAL REQUESTS */}
      {activeTab === 'referrals' && (
        <div className="space-y-4">
          {filteredReferrals.map((ref) => (
            <div
              key={ref.id}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="flex items-start space-x-3.5">
                <img
                  src={ref.alumniAvatar}
                  alt={ref.alumniName}
                  className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-800"
                />
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-base text-slate-900 dark:text-white">
                      {ref.roleTitle}
                    </h3>
                    <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300">
                      {ref.companyName}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Shared by Alumnus <strong>{ref.alumniName}</strong> • {ref.location}
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                    Eligibility / Criteria: {ref.eligibilityNotes}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
                {ref.status === 'Requested' ? (
                  <span className="px-3 py-1.5 rounded-xl bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 text-xs font-bold flex items-center gap-1 border border-amber-200 dark:border-amber-800">
                    <Clock className="w-3.5 h-3.5 text-amber-500" />
                    Referral Requested
                  </span>
                ) : (
                  <button
                    onClick={() => {
                      requestReferral(ref.id);
                      setReferralSuccessModal(ref.companyName);
                    }}
                    className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold transition-colors flex items-center space-x-1.5 shadow-xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Request Referral</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: OPT-IN RECRUITERS */}
      {activeTab === 'recruiters' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredRecruiters.map((rec) => (
            <div
              key={rec.id}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start space-x-3.5">
                  <img
                    src={rec.avatar}
                    alt={rec.name}
                    className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-800"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                        {rec.name}
                      </h3>
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 font-semibold">
                        Verified Recruiter
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      {rec.role} @ <strong>{rec.company}</strong>
                    </p>
                    <p className="text-[11px] text-brand-600 dark:text-brand-400 font-medium mt-0.5">
                      Active Drives: {rec.activeDrivesCount} Campus Rounds
                    </p>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase">
                    Hiring Focus Areas:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {rec.hiringFocus.map((focus, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded text-[11px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium"
                      >
                        {focus}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-500 font-mono truncate max-w-[200px]">
                  {rec.approvedContactChannel}
                </span>
                <a
                  href={`mailto:${rec.approvedContactChannel}?subject=DY%20Patil%20Student%20Query%20-%20Placement%20Hub`}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center space-x-1"
                >
                  <Mail className="w-3 h-3" />
                  <span>Contact Desk</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 4: NETWORKING EVENTS */}
      {activeTab === 'events' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {networkingEvents.map((evt) => (
            <div
              key={evt.id}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                    {evt.eventType}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    {evt.attendeesCount} Registered
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    {evt.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    {evt.date} • {evt.time} ({evt.locationOrPlatform})
                  </p>
                </div>

                <div className="flex items-center space-x-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800/80">
                  <img
                    src={evt.hostAvatar}
                    alt={evt.hostName}
                    className="w-10 h-10 rounded-xl object-cover"
                  />
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      Session Host
                    </span>
                    <strong className="text-xs text-slate-800 dark:text-slate-200">
                      {evt.hostName}
                    </strong>
                    <span className="text-[11px] text-slate-500 block">
                      {evt.hostCompany}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <a
                  href={evt.meetUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-slate-500 hover:text-brand-600 flex items-center gap-1"
                >
                  <span>Portal Room</span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                <button
                  onClick={() => registerForEvent(evt.id)}
                  className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                    evt.isRegistered
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200'
                      : 'bg-brand-600 hover:bg-brand-700 text-white'
                  }`}
                >
                  {evt.isRegistered ? 'Registered ✓' : 'Register / RSVP'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Referral Requested Toast / Modal */}
      {referralSuccessModal && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800 shadow-xl flex items-center space-x-3 max-w-md animate-in slide-in-from-bottom-5">
          <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-xs text-slate-900 dark:text-white">
              Referral Request Dispatched
            </h4>
            <p className="text-[11px] text-slate-500">
              Your verified academic record and ATS resume were routed to the alumnus at {referralSuccessModal}.
            </p>
          </div>
          <button
            onClick={() => setReferralSuccessModal(null)}
            className="text-slate-400 hover:text-slate-600 text-xs ml-auto"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};
