import React from 'react';
import {
  Briefcase,
  Calendar,
  CheckCircle2,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Star,
  Clock,
  Sparkles,
  ChevronRight,
  Award
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { mockStudentProfile, mockAssessments, mockCareerGaps } from '../../mock/data';

export const DashboardPage: React.FC = () => {
  const {
    jobs,
    applications,
    interviews,
    setCurrentSection,
    setCurrentSubSection,
    applyToJob
  } = useApp();

  const activeInterviews = interviews.filter(i => i.status === 'Upcoming');
  const offersCount = applications.filter(a => a.status === 'Offer').length;
  const inInterviewCount = applications.filter(a => a.status === 'Interview').length;
  const topRecommendedJob = jobs[0];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Welcome Banner & Placement Journey Milestone */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-brand-950 to-slate-900 border border-slate-800 p-6 md:p-8 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full bg-brand-500/20 text-brand-300 border border-brand-400/30 text-xs font-semibold uppercase tracking-wider">
                Drive 2026 Ready
              </span>
              <span className="text-xs text-slate-400">
                Roll No: {mockStudentProfile.rollNo} • {mockStudentProfile.department}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
              Welcome back, {mockStudentProfile.name}
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Your placement credentials and verified evidence scores are primed for Super Dream campus slots. 1 interview is scheduled for tomorrow.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => {
                setCurrentSection('placements');
                setCurrentSubSection('interviews');
              }}
              className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-medium text-xs shadow-lg shadow-brand-600/30 transition-all flex items-center justify-center space-x-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Prep for Tomorrow</span>
            </button>
            <button
              onClick={() => {
                setCurrentSection('explore');
                setCurrentSubSection('jobs');
              }}
              className="px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700 font-medium text-xs transition-all flex items-center justify-center space-x-2"
            >
              <span>Explore 4 Openings</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Milestone Steps Bar */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
          {[
            { label: 'Registration', status: 'Completed' },
            { label: 'Resume ATS Verified', status: 'Completed (92)' },
            { label: 'DSA & Tech Assessment', status: 'Completed (Top 2%)' },
            { label: 'Super Dream Shortlist', status: 'Active (Atlassian)' },
            { label: 'Final Offer', status: offersCount > 0 ? 'Offer Received' : 'In Progress' }
          ].map((milestone, idx) => (
            <div key={idx} className="flex flex-col space-y-1">
              <div className="flex items-center space-x-1.5 text-slate-300 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span className="truncate">{milestone.label}</span>
              </div>
              <span className="text-[11px] text-brand-300/80">{milestone.status}</span>
            </div>
          ))}
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Applications */}
        <div
          onClick={() => {
            setCurrentSection('placements');
            setCurrentSubSection('applications');
          }}
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-5 shadow-xs hover:border-brand-500/50 cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Applications</span>
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">{applications.length}</span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">100% On-Campus</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <span>{inInterviewCount} in active interview stage</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

        {/* ATS Score */}
        <div
          onClick={() => {
            setCurrentSection('career');
            setCurrentSubSection('resume');
          }}
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs hover:border-brand-500/50 cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Resume ATS Rating</span>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">92 / 100</span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Optimized</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <span>8 verified evidence-backed claims</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

        {/* Upcoming Interview */}
        <div
          onClick={() => {
            setCurrentSection('placements');
            setCurrentSubSection('interviews');
          }}
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs hover:border-brand-500/50 cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Next Interview</span>
            <div className="p-2 rounded-xl bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-base font-bold text-slate-900 dark:text-white truncate">
              {activeInterviews[0]?.companyName || 'No Scheduled'}
            </span>
            <span className="text-xs text-brand-600 dark:text-brand-400 font-medium">Tomorrow</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <span className="truncate">{activeInterviews[0]?.roundName || 'View details'}</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

        {/* Offers Secured */}
        <div
          onClick={() => {
            setCurrentSection('placements');
            setCurrentSubSection('tracker');
          }}
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs hover:border-brand-500/50 cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Offers in Hand</span>
            <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">{offersCount}</span>
            <span className="text-xs text-purple-600 dark:text-purple-400 font-medium">20.0 LPA</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <span>Morgan Stanley • SDE-1</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </div>

      {/* Main Grid: Recommended Match & Upcoming Interview Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: High Confidence Job Recommendations */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                AI Explainable Job Matches
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Ranked by verification strength against Atlassian and Razorpay skill criteria
              </p>
            </div>
            <button
              onClick={() => {
                setCurrentSection('explore');
                setCurrentSubSection('jobs');
              }}
              className="text-xs text-brand-600 dark:text-brand-400 font-semibold hover:underline flex items-center gap-1"
            >
              View all 4 roles
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {jobs.slice(0, 2).map((job) => (
              <div
                key={job.id}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-brand-500/50 transition-all space-y-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center space-x-3.5">
                    <img
                      src={job.companyLogo}
                      alt={job.companyName}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-800"
                    />
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-sm text-slate-900 dark:text-white">
                          {job.title}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300">
                          {job.tier}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-0.5">
                        <span>{job.companyName}</span>
                        <span>•</span>
                        <span>{job.location}</span>
                        <span>•</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          {job.packageLpa} LPA
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end">
                    <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-bold text-xs border border-emerald-200 dark:border-emerald-800/40">
                      <Star className="w-3.5 h-3.5 fill-emerald-500 text-emerald-500" />
                      <span>{job.matchScore}% Match</span>
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1">Deadline: {job.deadline}</span>
                  </div>
                </div>

                {/* Match Reason Explainer */}
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800/80 text-xs space-y-1.5">
                  <div className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-200">
                    <ShieldCheck className="w-3.5 h-3.5 text-brand-600" />
                    <span>Why you matched:</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                    {job.matchReasons.skillsMatch} {job.matchReasons.projectMatch}
                  </p>
                </div>

                {/* Tech tags and action */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                  <div className="flex flex-wrap gap-1.5">
                    {job.requiredSkills.slice(0, 3).map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="px-2 py-0.5 rounded-md text-[11px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  {job.applied ? (
                    <span className="px-3.5 py-1.5 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 font-semibold text-xs flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Applied & In Review
                    </span>
                  ) : (
                    <button
                      onClick={() => applyToJob(job.id)}
                      className="px-3.5 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-medium text-xs shadow-xs transition-colors"
                    >
                      Instant Campus Apply
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Col: Tomorrow's Interview & Skill Gap Alert */}
        <div className="space-y-4">
          {/* Interview Card */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-brand-600" />
                Upcoming Interview
              </h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                Tomorrow
              </span>
            </div>

            {activeInterviews[0] ? (
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <img
                    src={activeInterviews[0].companyLogo}
                    alt={activeInterviews[0].companyName}
                    className="w-10 h-10 rounded-lg object-cover"
                  />
                  <div>
                    <h4 className="font-semibold text-xs text-slate-900 dark:text-white">
                      {activeInterviews[0].companyName}
                    </h4>
                    <p className="text-[11px] text-slate-500">{activeInterviews[0].roundName}</p>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-850 text-xs space-y-1">
                  <div className="text-slate-500 dark:text-slate-400">
                    Time: <span className="text-slate-800 dark:text-slate-200 font-medium">{activeInterviews[0].time}</span>
                  </div>
                  <div className="text-slate-500 dark:text-slate-400">
                    Interviewer: <span className="text-slate-800 dark:text-slate-200 font-medium">{activeInterviews[0].interviewer}</span>
                  </div>
                </div>

                <a
                  href={activeInterviews[0].meetUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-medium text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Launch Zoom Meeting
                </a>
              </div>
            ) : (
              <p className="text-xs text-slate-500">No interviews scheduled today.</p>
            )}
          </div>

          {/* Skill Gap Alert Card */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                Skill Gap Alert
              </h3>
              <span className="text-[10px] text-amber-600 dark:text-amber-400 font-medium">High Priority</span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Target role <span className="font-semibold">SDE-1 Distributed Systems</span> requires container orchestration experience.
            </p>

            <div className="p-3 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/30 text-xs space-y-1">
              <span className="font-semibold text-amber-900 dark:text-amber-200">Recommended Action:</span>
              <p className="text-[11px] text-amber-800 dark:text-amber-300">
                Complete {mockCareerGaps[0]?.learningResource} to boost eligibility for Tier-1 drives.
              </p>
            </div>

            <button
              onClick={() => {
                setCurrentSection('career');
                setCurrentSubSection('career-prep');
              }}
              className="w-full py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors"
            >
              Open Career Prep Roadmap
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
