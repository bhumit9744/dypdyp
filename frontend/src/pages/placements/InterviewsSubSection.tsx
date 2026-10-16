import React, { useState } from 'react';
import {
  CalendarDays,
  Clock,
  BookOpen,
  Search,
  Filter,
  CheckCircle2,
  ExternalLink,
  AlertTriangle,
  Award,
  Sparkles,
  ChevronDown,
  ChevronUp,
  ThumbsUp,
  Flag,
  User,
  EyeOff,
  Building2,
  PlusCircle,
  HelpCircle,
  CheckSquare,
  Square,
  X,
  FileText,
  ShieldAlert,
  Layers,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { InterviewExperience, InterviewSchedule } from '../../types';

export const InterviewsSubSection: React.FC = () => {
  const {
    interviewExperiences,
    interviews,
    addInterviewExperience,
    reportInterviewExperience,
    toggleInterviewChecklist
  } = useApp();

  const [activeTab, setActiveTab] = useState<'experiences' | 'questions' | 'liveSlots'>('experiences');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCompany, setSelectedCompany] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [selectedTopic, setSelectedTopic] = useState<string>('All');
  const [expandedExpId, setExpandedExpId] = useState<string | null>(interviewExperiences[0]?.id || null);
  const [showSubmitModal, setShowSubmitModal] = useState<boolean>(false);
  const [helpfulGiven, setHelpfulGiven] = useState<Record<string, boolean>>({});
  const [reportModalExpId, setReportModalExpId] = useState<string | null>(null);

  // Form state for new experience submission
  const [formCompany, setFormCompany] = useState<string>('');
  const [formRole, setFormRole] = useState<string>('');
  const [formYear, setFormYear] = useState<number>(2026);
  const [formDifficulty, setFormDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [formOutcome, setFormOutcome] = useState<'Offer Received' | 'Rejected' | 'Withdrawn'>('Offer Received');
  const [formRoundName, setFormRoundName] = useState<string>('Technical Round 1 (DSA)');
  const [formDescription, setFormDescription] = useState<string>('');
  const [formQuestions, setFormQuestions] = useState<string>('');
  const [formIsAnonymous, setFormIsAnonymous] = useState<boolean>(false);

  // Extract unique companies
  const companiesList = Array.from(new Set(interviewExperiences.map((e) => e.companyName)));

  // Filter Experiences
  const filteredExperiences = interviewExperiences.filter((exp) => {
    const matchesSearch =
      searchQuery.trim() === '' ||
      exp.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.roleTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.technicalQuestions.some((q) => q.question.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesComp = selectedCompany === 'All' || exp.companyName === selectedCompany;
    const matchesDiff = selectedDifficulty === 'All' || exp.overallDifficulty === selectedDifficulty;

    return matchesSearch && matchesComp && matchesDiff;
  });

  // Extract all questions for the Technical Question Bank
  const allTechnicalQuestions = interviewExperiences.flatMap((exp) =>
    exp.technicalQuestions.map((q) => ({
      ...q,
      companyName: exp.companyName,
      companyLogo: exp.companyLogo,
      roleTitle: exp.roleTitle,
      year: exp.recruitmentYear
    }))
  );

  const filteredQuestions = allTechnicalQuestions.filter((q) => {
    const matchesTopic = selectedTopic === 'All' || q.topic === selectedTopic;
    const matchesSearch =
      searchQuery.trim() === '' ||
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.companyName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTopic && matchesSearch;
  });

  const handleHelpfulClick = (expId: string) => {
    if (helpfulGiven[expId]) return;
    setHelpfulGiven((prev) => ({ ...prev, [expId]: true }));
  };

  const handleReportSubmit = (expId: string) => {
    reportInterviewExperience(expId);
    setReportModalExpId(null);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formCompany || !formRole) return;

    const questionsList = formQuestions.split('\n').filter((q) => q.trim().length > 0);

    const newExp: InterviewExperience = {
      id: `exp_${Date.now()}`,
      companyName: formCompany,
      companyLogo: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=128',
      roleTitle: formRole,
      recruitmentYear: formYear,
      recruitmentType: 'On-Campus TPO',
      authorName: formIsAnonymous ? 'Anonymous Student' : 'Bhumit G.',
      authorBatch: '2026',
      isAnonymous: formIsAnonymous,
      overallDifficulty: formDifficulty,
      outcome: formOutcome,
      roundsBreakdown: [
        {
          roundNumber: 1,
          roundName: formRoundName,
          roundType: 'Technical Round 1',
          duration: '45 mins',
          difficulty: formDifficulty,
          description: formDescription || 'Live technical problem solving and complexity walkthrough.',
          questionsAsked: questionsList.length > 0 ? questionsList : ['Describe a complex challenge you solved in your capstone project.']
        }
      ],
      technicalQuestions: questionsList.map((q) => ({
        topic: 'DSA',
        question: q,
        difficulty: formDifficulty
      })),
      studyMaterialsRecommended: ['Official Documentation', 'LeetCode Curated List'],
      preparationChecklist: ['Practice explaining algorithmic approaches out loud', 'Clarify constraints early'],
      similarCompanyRecommendations: ['Atlassian', 'Microsoft', 'Razorpay'],
      submissionDate: 'Just now',
      verificationBadge: 'Student Reported',
      helpfulCount: 1
    };

    addInterviewExperience(newExp);
    setShowSubmitModal(false);
    // Reset form
    setFormCompany('');
    setFormRole('');
    setFormDescription('');
    setFormQuestions('');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Interview Experiences & Question Bank
                <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-brand-100 dark:bg-brand-900/60 text-brand-700 dark:text-brand-300">
                  {interviewExperiences.length} Curated Archives
                </span>
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Community-contributed interview breakdowns, round-by-round technical questions, and prep checklists.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowSubmitModal(true)}
          className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold flex items-center space-x-1.5 shadow-xs transition-colors"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Contribute Experience</span>
        </button>
      </div>

      {/* Ethics & Moderation Disclaimer */}
      <div className="p-3.5 rounded-2xl bg-slate-100/70 dark:bg-slate-850/60 border border-slate-200 dark:border-slate-800 flex items-start space-x-2.5 text-xs text-slate-600 dark:text-slate-400">
        <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-slate-800 dark:text-slate-200">
            Integrity Policy & Moderation:
          </span>{' '}
          All interview experiences are student-reported and peer-moderated under college placement guidelines. Never publish confidential online tests, NDA-protected problems, leaked questions, or private recruiter contact details.
        </div>
      </div>

      {/* Tabs Switcher & Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('experiences')}
              className={`px-4 py-1.5 rounded-lg transition-all ${
                activeTab === 'experiences'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Company Experiences ({interviewExperiences.length})
            </button>
            <button
              onClick={() => setActiveTab('questions')}
              className={`px-4 py-1.5 rounded-lg transition-all ${
                activeTab === 'questions'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Technical Question Bank ({allTechnicalQuestions.length})
            </button>
            <button
              onClick={() => setActiveTab('liveSlots')}
              className={`px-4 py-1.5 rounded-lg transition-all ${
                activeTab === 'liveSlots'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Live Scheduled Slots ({interviews.length})
            </button>
          </div>

          {activeTab === 'experiences' && (
            <div className="flex items-center space-x-2">
              <select
                value={selectedCompany}
                onChange={(e) => setSelectedCompany(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 text-xs font-medium text-slate-700 dark:text-slate-200 focus:outline-none"
              >
                <option value="All">All Employers</option>
                {companiesList.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>

              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 text-xs font-medium text-slate-700 dark:text-slate-200 focus:outline-none"
              >
                <option value="All">All Difficulties</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          )}

          {activeTab === 'questions' && (
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 text-xs font-medium text-slate-700 dark:text-slate-200 focus:outline-none"
            >
              <option value="All">All Topics</option>
              <option value="DSA">Data Structures & Algorithms</option>
              <option value="Operating Systems">Operating Systems</option>
              <option value="DBMS">Database Management (DBMS)</option>
              <option value="System Design">System Design</option>
              <option value="Computer Networks">Computer Networks</option>
              <option value="Web / Frameworks">Web & Frameworks</option>
            </select>
          )}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={
              activeTab === 'questions'
                ? 'Search questions by keyword (e.g. LRU Cache, TCP handshake, React Fiber)...'
                : 'Search experiences by company name, role, or technical keywords...'
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none"
          />
        </div>
      </div>

      {/* TAB 1: COMPANY EXPERIENCES */}
      {activeTab === 'experiences' && (
        <div className="space-y-4">
          {filteredExperiences.map((exp) => {
            const isExpanded = expandedExpId === exp.id;
            const isHelpful = helpfulGiven[exp.id];

            return (
              <div
                key={exp.id}
                className={`p-6 rounded-2xl bg-white dark:bg-slate-900 border shadow-xs transition-all space-y-4 ${
                  exp.isReported
                    ? 'border-amber-400/60 bg-amber-50/20'
                    : 'border-slate-200 dark:border-slate-800 hover:border-brand-500/40'
                }`}
              >
                {exp.isReported && (
                  <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-xs text-amber-800 dark:text-amber-300 flex items-center justify-between">
                    <span>This submission has been flagged by students and is under active moderation review.</span>
                    <span className="font-semibold text-[10px]">Under Review</span>
                  </div>
                )}

                {/* Card Header */}
                <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                  <div className="flex items-start space-x-3.5">
                    <img
                      src={exp.companyLogo}
                      alt={exp.companyName}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-800 shadow-xs shrink-0"
                    />
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-bold text-base text-slate-900 dark:text-white">
                          {exp.companyName}
                        </h3>
                        <span className="text-xs text-slate-500 font-medium">
                          ({exp.recruitmentYear} Recruitment Cycle)
                        </span>

                        {/* Verification Badge */}
                        <span
                          className={`text-[9px] font-bold px-2 py-0.5 rounded border ${
                            exp.verificationBadge === 'TPO Verified Experience'
                              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200'
                              : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-slate-200'
                          }`}
                        >
                          {exp.verificationBadge}
                        </span>

                        {/* Outcome Badge */}
                        <span
                          className={`text-[9px] font-bold px-2 py-0.5 rounded ${
                            exp.outcome === 'Offer Received'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                          }`}
                        >
                          {exp.outcome}
                        </span>
                      </div>

                      <p className="text-xs text-slate-700 dark:text-slate-300 font-semibold mt-0.5">
                        {exp.roleTitle} • {exp.recruitmentType}
                      </p>

                      <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1">
                        <span>Contributed by {exp.isAnonymous ? 'Anonymous Candidate' : exp.authorName}</span>
                        <span>•</span>
                        <span>Batch {exp.authorBatch}</span>
                        <span>•</span>
                        <span>Submitted {exp.submissionDate}</span>
                      </div>
                    </div>
                  </div>

                  {/* Difficulty & Expand Toggle */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        exp.overallDifficulty === 'Hard'
                          ? 'bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300 border border-rose-200'
                          : exp.overallDifficulty === 'Medium'
                          ? 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border border-amber-200'
                          : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200'
                      }`}
                    >
                      {exp.overallDifficulty} Difficulty
                    </span>

                    <button
                      onClick={() => setExpandedExpId(isExpanded ? null : exp.id)}
                      className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
                    >
                      <span>{isExpanded ? 'Collapse Rounds' : 'Inspect Round Details'}</span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Round-wise Breakdown Drawer */}
                {isExpanded && (
                  <div className="space-y-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                    <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[10px]">
                      Round-by-Round Breakdown ({exp.roundsBreakdown.length} Rounds)
                    </h4>

                    <div className="space-y-3">
                      {exp.roundsBreakdown.map((rnd) => (
                        <div
                          key={rnd.roundNumber}
                          className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 space-y-2"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-900 dark:text-white text-xs">
                              Round {rnd.roundNumber}: {rnd.roundName}
                            </span>
                            <div className="flex items-center space-x-2 text-[11px] text-slate-500">
                              <span>Duration: {rnd.duration}</span>
                              <span>•</span>
                              <span className="font-semibold text-amber-600">{rnd.difficulty}</span>
                            </div>
                          </div>

                          <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
                            {rnd.description}
                          </p>

                          {rnd.questionsAsked && rnd.questionsAsked.length > 0 && (
                            <div className="pt-1 space-y-1">
                              <span className="font-semibold text-slate-700 dark:text-slate-300 block text-[10px] uppercase">
                                Sample Questions / Prompts:
                              </span>
                              {rnd.questionsAsked.map((q, idx) => (
                                <p key={idx} className="text-slate-600 dark:text-slate-400 pl-2 border-l-2 border-brand-400">
                                  {q}
                                </p>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Study Materials & Checklist */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                      <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5">
                        <span className="font-bold text-slate-800 dark:text-slate-200 text-[11px] block">
                          Recommended Preparation Resources:
                        </span>
                        {exp.studyMaterialsRecommended.map((mat, i) => (
                          <p key={i} className="text-slate-600 dark:text-slate-400 text-[11px]">• {mat}</p>
                        ))}
                      </div>

                      <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5">
                        <span className="font-bold text-slate-800 dark:text-slate-200 text-[11px] block">
                          Candidate Revision Checklist:
                        </span>
                        {exp.preparationChecklist.map((chk, i) => (
                          <p key={i} className="text-slate-600 dark:text-slate-400 text-[11px]">• {chk}</p>
                        ))}
                      </div>
                    </div>

                    {/* Similar Companies Recommendations */}
                    {exp.similarCompanyRecommendations && exp.similarCompanyRecommendations.length > 0 && (
                      <div className="p-2.5 rounded-xl bg-slate-100/60 dark:bg-slate-850 flex items-center justify-between text-xs">
                        <span className="text-slate-500">
                          Similar interview formats and technical overlaps:
                        </span>
                        <span className="font-semibold text-brand-600 dark:text-brand-400">
                          {exp.similarCompanyRecommendations.join(' • ')}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Footer Actions */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <button
                    onClick={() => handleHelpfulClick(exp.id)}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border transition-colors ${
                      isHelpful
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>Helpful ({exp.helpfulCount + (isHelpful ? 1 : 0)})</span>
                  </button>

                  <button
                    onClick={() => setReportModalExpId(exp.id)}
                    className="flex items-center space-x-1 text-slate-400 hover:text-rose-600 transition-colors text-[11px]"
                  >
                    <Flag className="w-3.5 h-3.5" />
                    <span>Report Submission</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 2: TECHNICAL QUESTION BANK */}
      {activeTab === 'questions' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between text-xs">
            <span className="text-slate-500">
              Showing <strong>{filteredQuestions.length}</strong> real technical interview questions curated from campus candidates.
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredQuestions.map((q, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3 hover:border-brand-500/40 transition-all flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300">
                      {q.topic}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        q.difficulty === 'Hard'
                          ? 'bg-rose-50 text-rose-700'
                          : q.difficulty === 'Medium'
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-emerald-50 text-emerald-700'
                      }`}
                    >
                      {q.difficulty}
                    </span>
                  </div>

                  <p className="font-semibold text-sm text-slate-900 dark:text-white leading-relaxed">
                    {q.question}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center space-x-2">
                    <img src={q.companyLogo} alt={q.companyName} className="w-5 h-5 rounded-md object-cover" />
                    <span className="font-semibold text-slate-700 dark:text-slate-300">{q.companyName}</span>
                  </div>
                  <span>{q.year} Drive</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: LIVE SCHEDULED INTERVIEW SLOTS */}
      {activeTab === 'liveSlots' && (
        <div className="space-y-4">
          {interviews.map((int) => (
            <div
              key={int.id}
              className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 hover:border-brand-500/40 transition-all"
            >
              <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                <div className="flex items-start space-x-4">
                  <img src={int.companyLogo} alt={int.companyName} className="w-12 h-12 rounded-xl object-cover" />
                  <div>
                    <h3 className="font-bold text-base text-slate-900 dark:text-white">{int.companyName}</h3>
                    <p className="text-xs text-brand-600 dark:text-brand-400 font-semibold">{int.roundName}</p>
                    <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      {int.date} • {int.time} ({int.durationMinutes} mins)
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <a
                    href={int.meetUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs flex items-center space-x-1.5 shadow-xs"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Join Meeting Room</span>
                  </a>
                </div>
              </div>

              {/* Checklist */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850 space-y-2 text-xs">
                <span className="font-bold text-slate-900 dark:text-white block text-[11px]">
                  Interviewer Logistics & Prep Checklist:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {int.preparationChecklist.map((item, idx) => (
                    <div
                      key={idx}
                      onClick={() => toggleInterviewChecklist(int.id, idx)}
                      className="flex items-start space-x-2 cursor-pointer p-1.5 rounded hover:bg-white dark:hover:bg-slate-800 transition-colors"
                    >
                      {item.done ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                      )}
                      <span className={item.done ? 'line-through text-slate-400' : 'text-slate-700 dark:text-slate-300'}>
                        {item.item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CONTRIBUTE EXPERIENCE MODAL */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-brand-600" />
                Contribute Interview Experience
              </h3>
              <button onClick={() => setShowSubmitModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Company Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Goldman Sachs"
                    value={formCompany}
                    onChange={(e) => setFormCompany(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 text-slate-800 dark:text-slate-200 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Role Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Analyst / SDE-1"
                    value={formRole}
                    onChange={(e) => setFormRole(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 text-slate-800 dark:text-slate-200 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Recruitment Year</label>
                  <select
                    value={formYear}
                    onChange={(e) => setFormYear(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 text-slate-800 dark:text-slate-200 focus:outline-none"
                  >
                    <option value={2026}>2026 Batch</option>
                    <option value={2025}>2025 Batch</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Overall Difficulty</label>
                  <select
                    value={formDifficulty}
                    onChange={(e) => setFormDifficulty(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 text-slate-800 dark:text-slate-200 focus:outline-none"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Outcome</label>
                  <select
                    value={formOutcome}
                    onChange={(e) => setFormOutcome(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 text-slate-800 dark:text-slate-200 focus:outline-none"
                  >
                    <option value="Offer Received">Offer Received</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Withdrawn">Withdrawn</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Round Name</label>
                <input
                  type="text"
                  placeholder="e.g. Technical Round 1 (DSA & System Architecture)"
                  value={formRoundName}
                  onChange={(e) => setFormRoundName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 text-slate-800 dark:text-slate-200 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Round Description & Experience Walkthrough</label>
                <textarea
                  rows={3}
                  placeholder="Explain the round structure, time constraints, interviewer demeanor, and key focus areas..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 text-slate-800 dark:text-slate-200 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Technical Questions Asked (One per line)</label>
                <textarea
                  rows={3}
                  placeholder="e.g. Design LRU Cache with TTL&#10;Explain thread-safety in Go"
                  value={formQuestions}
                  onChange={(e) => setFormQuestions(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 text-slate-800 dark:text-slate-200 focus:outline-none"
                />
              </div>

              {/* Anonymous Checkbox */}
              <div className="flex items-center space-x-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-850">
                <input
                  type="checkbox"
                  id="anonymousCheck"
                  checked={formIsAnonymous}
                  onChange={(e) => setFormIsAnonymous(e.target.checked)}
                  className="rounded text-brand-600 focus:ring-brand-500"
                />
                <label htmlFor="anonymousCheck" className="text-slate-700 dark:text-slate-300 cursor-pointer font-medium">
                  Publish Anonymously (Hide student name and batch roll number from public view)
                </label>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSubmitModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-brand-600 hover:bg-brand-700 text-white"
                >
                  Submit for Peer Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* REPORT / FLAG MODERATION MODAL */}
      {reportModalExpId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl max-w-md w-full space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                <Flag className="w-4 h-4 text-rose-500" />
                Report Inaccurate or Inappropriate Submission
              </h3>
              <button onClick={() => setReportModalExpId(null)} className="text-slate-400">✕</button>
            </div>

            <p className="text-slate-600 dark:text-slate-400">
              Flagging this submission alerts the college TPO student moderation committee to verify the authenticity of the questions and details.
            </p>

            <div className="space-y-1.5 text-slate-700 dark:text-slate-300">
              <label className="flex items-center space-x-2">
                <input type="radio" name="reportReason" defaultChecked className="text-brand-600" />
                <span>Inaccurate technical questions or solutions</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="radio" name="reportReason" className="text-brand-600" />
                <span>Potential breach of private recruiter NDA</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="radio" name="reportReason" className="text-brand-600" />
                <span>Misleading or inappropriate content</span>
              </label>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setReportModalExpId(null)}
                className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={() => handleReportSubmit(reportModalExpId)}
                className="px-4 py-1.5 rounded-lg bg-rose-600 text-white font-semibold"
              >
                Submit Report Flag
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
