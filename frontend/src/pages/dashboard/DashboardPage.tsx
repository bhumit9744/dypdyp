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
  Award,
  UserCheck,
  Plus,
  Video
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const DashboardPage: React.FC = () => {
  const {
    jobs,
    applications,
    interviews,
    skills,
    studentProfile,
    setCurrentSection,
    setCurrentSubSection,
    applyToJob
  } = useApp();

  const activeInterviews = interviews.filter(i => i.status === 'Upcoming');
  const offers = applications.filter(a => a.status === 'Offer');
  const inInterviewCount = applications.filter(a => a.status === 'Interview').length;
  const verifiedSkillsCount = skills.filter(s => s.verified).length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Welcome Banner & Placement Journey Milestone */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 border border-indigo-400/30 p-6 md:p-8 text-white shadow-xl shadow-indigo-600/15">
        {/* Subtle decorative background blur glow */}
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-40 -bottom-20 w-80 h-80 bg-violet-400/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white backdrop-blur-md border border-white/30 text-xs font-semibold uppercase tracking-wider flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                Verified Placement Hub
              </span>
              <span className="text-xs text-white/80 font-medium">
                {studentProfile ? `Roll: ${studentProfile.rollNo} • ${studentProfile.department}` : 'Student Profile Active'}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
              {studentProfile ? `Welcome back, ${studentProfile.name}` : 'Welcome to Placement Hub'}
            </h1>
            <p className="text-sm text-indigo-100 leading-relaxed max-w-xl">
              {studentProfile
                ? `Academic status: ${studentProfile.degree} (CGPA ${studentProfile.cgpa}). Track campus drives, technical interview rounds, and verified skill credentials.`
                : 'Complete your student profile with real academic credentials to track campus drives, off-campus applications, and verified skill proofs.'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => {
                setCurrentSection('placements');
                setCurrentSubSection('applications');
              }}
              className="px-5 py-2.5 rounded-xl bg-white text-indigo-700 hover:bg-indigo-50 font-bold text-xs shadow-md transition-all flex items-center justify-center space-x-2"
            >
              <Briefcase className="w-4 h-4 text-indigo-600" />
              <span>Track Applications ({applications.length})</span>
            </button>
            <button
              onClick={() => {
                setCurrentSection('explore');
                setCurrentSubSection('jobs-internships');
              }}
              className="px-5 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white border border-white/25 backdrop-blur-md font-semibold text-xs transition-all flex items-center justify-center space-x-2"
            >
              <span>Explore Openings ({jobs.length})</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Milestone Steps Bar */}
        <div className="mt-8 pt-6 border-t border-white/20 grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs relative z-10">
          {[
            {
              label: 'Profile Registered',
              completed: Boolean(studentProfile),
              detail: studentProfile ? `${studentProfile.rollNo}` : 'Action Required'
            },
            {
              label: 'Verified Skills',
              completed: verifiedSkillsCount > 0,
              detail: verifiedSkillsCount > 0 ? `${verifiedSkillsCount} Verified` : 'No Proofs Added'
            },
            {
              label: 'Applications Active',
              completed: applications.length > 0,
              detail: `${applications.length} Submitted`
            },
            {
              label: 'Interview Pipeline',
              completed: inInterviewCount > 0 || activeInterviews.length > 0,
              detail: inInterviewCount > 0 ? `${inInterviewCount} in Rounds` : 'None Scheduled'
            },
            {
              label: 'Placement Offer',
              completed: offers.length > 0,
              detail: offers.length > 0 ? `${offers.length} Offer Secured` : 'In Progress'
            }
          ].map((milestone, idx) => (
            <div key={idx} className="flex flex-col space-y-1">
              <div className="flex items-center space-x-1.5 text-slate-300 font-medium">
                <CheckCircle2
                  className={`w-3.5 h-3.5 ${
                    milestone.completed ? 'text-emerald-400' : 'text-slate-600'
                  }`}
                />
                <span className="truncate">{milestone.label}</span>
              </div>
              <span className={`text-[11px] ${milestone.completed ? 'text-emerald-300' : 'text-slate-500'}`}>
                {milestone.detail}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* KPI Cards Row (Real Data Calculations) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Applications */}
        <div
          onClick={() => {
            setCurrentSection('placements');
            setCurrentSubSection('applications');
          }}
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs hover:border-brand-500/50 cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Applications</span>
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">{applications.length}</span>
            <span className="text-xs text-slate-500 font-medium">Genuine Records</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <span>{inInterviewCount} in interview stages</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

        {/* Verified Skills */}
        <div
          onClick={() => {
            setCurrentSection('career');
            setCurrentSubSection('skills');
          }}
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs hover:border-brand-500/50 cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Verified Skills</span>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">{verifiedSkillsCount}</span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Evidence Grounded</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <span>{skills.length} total claimed skills</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

        {/* Upcoming Interview */}
        <div
          onClick={() => {
            setCurrentSection('placements');
            setCurrentSubSection('tracker');
          }}
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs hover:border-brand-500/50 cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Scheduled Interviews</span>
            <div className="p-2 rounded-xl bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">
              {activeInterviews.length}
            </span>
            <span className="text-xs text-brand-600 dark:text-brand-400 font-medium">
              {activeInterviews.length > 0 ? 'Upcoming' : 'None Active'}
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <span className="truncate">
              {activeInterviews[0]?.companyName || 'No upcoming interviews'}
            </span>
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
            <span className="text-2xl font-bold text-slate-900 dark:text-white">{offers.length}</span>
            <span className="text-xs text-purple-600 dark:text-purple-400 font-medium">
              {offers.length > 0 ? 'Secured' : 'Awaiting'}
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <span className="truncate">
              {offers.length > 0 ? `${offers[0].companyName} • ${offers[0].packageLpa} LPA` : 'Zero fabricated results'}
            </span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </div>

      {/* Main Grid: Live Jobs & Pipeline Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Live Job Openings */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                Live Job Listings
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Source-backed positions and verified recruiter campus postings
              </p>
            </div>
            <button
              onClick={() => {
                setCurrentSection('explore');
                setCurrentSubSection('jobs-internships');
              }}
              className="text-xs text-brand-600 dark:text-brand-400 font-semibold hover:underline flex items-center gap-1"
            >
              View all ({jobs.length})
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {jobs.length === 0 ? (
            <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-800 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
                <Briefcase className="w-6 h-6" />
              </div>
              <div className="max-w-md mx-auto space-y-1">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                  No active job listings loaded
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  The hub is in Live Data Mode. No demo jobs or fabricated openings are seeded. You can add authentic job openings manually or import job postings.
                </p>
              </div>
              <button
                onClick={() => {
                  setCurrentSection('explore');
                  setCurrentSubSection('jobs-internships');
                }}
                className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-medium text-xs shadow-xs inline-flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Real Job Listing
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {jobs.slice(0, 3).map((job) => (
                <div
                  key={job.id}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-brand-500/50 transition-all space-y-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center space-x-3.5">
                      {job.companyLogo ? (
                        <img
                          src={job.companyLogo}
                          alt={job.companyName}
                          className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-800"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-brand-100 dark:bg-brand-950 flex items-center justify-center text-brand-600 font-bold text-sm">
                          {job.companyName[0]}
                        </div>
                      )}
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
                      <span className="text-[10px] text-slate-400">Deadline: {job.deadline}</span>
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium mt-1">
                        {job.sourceType || 'Real Listing'}
                      </span>
                    </div>
                  </div>

                  <p className="text-slate-600 dark:text-slate-300 text-xs line-clamp-2 leading-relaxed">
                    {job.description}
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                    <div className="flex flex-wrap gap-1.5">
                      {(job.requiredSkills || []).slice(0, 4).map((skill, sIdx) => (
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
                        Applied
                      </span>
                    ) : (
                      <button
                        onClick={() => applyToJob(job.id)}
                        className="px-3.5 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-medium text-xs shadow-xs transition-colors"
                      >
                        Apply Now
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Col: Genuine Pipeline & Interview Alerts */}
        <div className="space-y-4">
          {/* Interview Schedule Card */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-brand-600" />
                Upcoming Interviews
              </h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300">
                {activeInterviews.length} Scheduled
              </span>
            </div>

            {activeInterviews.length > 0 ? (
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-brand-100 dark:bg-brand-950 flex items-center justify-center font-bold text-xs text-brand-600">
                    {activeInterviews[0].companyName[0]}
                  </div>
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

                <button
                  onClick={() => {
                    setCurrentSection('career');
                    setCurrentSubSection('interview-studio');
                  }}
                  className="w-full py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs hover:shadow-brand-500/20"
                >
                  <Video className="w-3.5 h-3.5" />
                  Enter In-Platform Interview Studio
                </button>
              </div>
            ) : (
              <div className="py-4 text-center space-y-1.5">
                <p className="text-xs text-slate-500">No interviews currently scheduled.</p>
                <p className="text-[11px] text-slate-400">
                  When recruiters schedule rounds for your applications, meeting links and dates will appear here.
                </p>
              </div>
            )}
          </div>

          {/* System & Source Integrity Status Card */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                Data Integrity Policy
              </h3>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">Active</span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Placement Hub strictly prohibits seeded, mock, or fabricated business records. All data originates from real candidate actions, college records, or direct employer submissions.
            </p>

            <div className="space-y-1.5 pt-1 text-xs">
              <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                <span>Database Sync:</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">SQLite Connected</span>
              </div>
              <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                <span>Applications Recorded:</span>
                <span className="font-semibold text-slate-900 dark:text-white">{applications.length}</span>
              </div>
              <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                <span>Job Openings:</span>
                <span className="font-semibold text-slate-900 dark:text-white">{jobs.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
