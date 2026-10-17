import React, { useState } from 'react';
import {
  GraduationCap,
  Search,
  CheckCircle2,
  Calendar,
  Clock,
  Star,
  Send,
  X,
  ShieldCheck,
  Building2,
  MessageSquare,
  Video,
  FileText,
  UserCheck,
  AlertCircle
} from 'lucide-react';
import { ConnectMentor, ConnectMentorshipRequest } from '../../../types';

interface MentorsTabProps {
  mentors: ConnectMentor[];
  requests: ConnectMentorshipRequest[];
  onSubmitRequest: (requestData: {
    mentor_id: string;
    mentor_name: string;
    topic: string;
    description: string;
    preferred_format: string;
    preferred_time?: string;
  }) => void;
}

export const MentorsTab: React.FC<MentorsTabProps> = ({
  mentors,
  requests,
  onSubmitRequest
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'directory' | 'my-requests'>('directory');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCareerPath, setSelectedCareerPath] = useState<string>('all');
  const [selectedCompany, setSelectedCompany] = useState<string>('all');

  // Request Modal State
  const [selectedMentor, setSelectedMentor] = useState<ConnectMentor | null>(null);
  const [requestTopic, setRequestTopic] = useState<string>('');
  const [requestDescription, setRequestDescription] = useState<string>('');
  const [preferredFormat, setPreferredFormat] = useState<string>('1-on-1 Video Session');
  const [preferredTime, setPreferredTime] = useState<string>('Saturday 4:00 PM IST');
  const [requestSubmittedSuccess, setRequestSubmittedSuccess] = useState<boolean>(false);
  const [requestError, setRequestError] = useState<string | null>(null);

  const careerPaths = [
    { id: 'all', label: 'All Career Paths' },
    { id: 'Software Development', label: 'Software Development' },
    { id: 'AI & Data Science', label: 'AI & Data Science' },
    { id: 'Cloud & DevOps', label: 'Cloud & DevOps' }
  ];

  const companies = [
    { id: 'all', label: 'All Companies' },
    { id: 'Microsoft', label: 'Microsoft' },
    { id: 'Amazon', label: 'Amazon' },
    { id: 'Barclays', label: 'Barclays' },
    { id: 'NVIDIA', label: 'NVIDIA' },
    { id: 'Veritas Technologies', label: 'Veritas' }
  ];

  const filteredMentors = mentors.filter((m) => {
    const matchesPath =
      selectedCareerPath === 'all' ||
      m.career_path.toLowerCase() === selectedCareerPath.toLowerCase();
    const matchesCompany =
      selectedCompany === 'all' ||
      m.company.toLowerCase().includes(selectedCompany.toLowerCase());
    const matchesSearch =
      searchQuery.trim() === '' ||
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.areas_of_expertise.some((e) => e.toLowerCase().includes(searchQuery.toLowerCase())) ||
      m.topics.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesPath && matchesCompany && matchesSearch;
  });

  const handleOpenRequest = (mentor: ConnectMentor) => {
    setSelectedMentor(mentor);
    setRequestTopic(mentor.topics[0] || 'Resume Review');
    setRequestDescription('');
    setRequestError(null);
    setRequestSubmittedSuccess(false);
  };

  const handleSendRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMentor) return;

    if (requestDescription.trim().length < 15) {
      setRequestError('Please provide a short description (at least 15 characters) so your mentor can prepare.');
      return;
    }

    onSubmitRequest({
      mentor_id: selectedMentor.id,
      mentor_name: selectedMentor.name,
      topic: requestTopic,
      description: requestDescription.trim(),
      preferred_format: preferredFormat,
      preferred_time: preferredTime
    });

    setRequestSubmittedSuccess(true);
    setTimeout(() => {
      setSelectedMentor(null);
      setRequestSubmittedSuccess(false);
      setActiveSubTab('my-requests');
    }, 1800);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Standout Mentoring Objective */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-900/60 p-6 sm:p-7 text-white shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-full bg-gradient-to-l from-indigo-500/10 to-transparent pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-2">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-[11px] font-bold uppercase tracking-wider">
              DYPCOE Senior & Alumni Network
            </span>
            <span className="text-xs text-indigo-200/70">
              • 100% Genuine College Mentors
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
            Learn directly from seniors who walked your exact placement path.
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Get practical, unfiltered advice on clearing off-campus tests, surviving technical whiteboards, and positioning your resume for top product & MNC companies.
          </p>
        </div>

        {/* Tab switch between Directory and My Requests */}
        <div className="flex items-center space-x-2 pt-4 relative z-10">
          <button
            onClick={() => setActiveSubTab('directory')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === 'directory'
                ? 'bg-white text-slate-900 shadow-md'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            Browse Mentors ({mentors.length})
          </button>

          <button
            onClick={() => setActiveSubTab('my-requests')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all relative ${
              activeSubTab === 'my-requests'
                ? 'bg-white text-slate-900 shadow-md'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            <span>My Mentorship Requests</span>
            {requests.length > 0 && (
              <span className="ml-1.5 px-1.5 py-0.2 rounded-full bg-emerald-500 text-white text-[10px] font-bold">
                {requests.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Directory View */}
      {activeSubTab === 'directory' ? (
        <div className="space-y-5">
          {/* Filters Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search mentors by name, company, or skills..."
                className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
              <select
                value={selectedCareerPath}
                onChange={(e) => setSelectedCareerPath(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200 focus:outline-hidden"
              >
                {careerPaths.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.label}
                  </option>
                ))}
              </select>

              <select
                value={selectedCompany}
                onChange={(e) => setSelectedCompany(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200 focus:outline-hidden"
              >
                {companies.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Mentors Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredMentors.map((mentor) => (
              <div
                key={mentor.id}
                className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-xs hover:shadow-md transition-all p-5 flex flex-col justify-between space-y-4"
              >
                {/* Header */}
                <div className="flex items-start space-x-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-brand-600 text-white font-bold text-sm flex items-center justify-center shrink-0 shadow-xs">
                    {mentor.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center space-x-1.5">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                        {mentor.name}
                      </h4>
                      {mentor.is_verified && (
                        <span title="Verified Alumni Senior">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        </span>
                      )}
                    </div>

                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate">
                      {mentor.role} • <span className="text-brand-600 dark:text-brand-400 font-bold">{mentor.company}</span>
                    </p>

                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                      {mentor.college_batch}
                    </p>
                  </div>
                </div>

                {/* Bio */}
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
                  {mentor.bio}
                </p>

                {/* Expertise Pills */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                    Areas of Guidance
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {mentor.areas_of_expertise.map((exp) => (
                      <span
                        key={exp}
                        className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-medium text-slate-600 dark:text-slate-300"
                      >
                        {exp}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Rating & Availability */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-xs flex items-center justify-between text-slate-500 dark:text-slate-400">
                  <div className="flex items-center space-x-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span className="font-bold text-slate-800 dark:text-slate-200">{mentor.rating}</span>
                    <span className="text-[11px]">({mentor.sessions_completed} sessions)</span>
                  </div>

                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold text-[11px]">
                    ● {mentor.availability_status}
                  </span>
                </div>

                {/* Action button */}
                <button
                  onClick={() => handleOpenRequest(mentor)}
                  className="w-full flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl bg-[#17172B] dark:bg-white text-white dark:text-[#17172B] text-xs font-bold hover:opacity-90 transition-opacity shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Request Mentorship</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* My Requests View */
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              My Active Mentorship Requests ({requests.length})
            </h3>
            <span className="text-xs text-slate-500">
              Responses delivered directly to your student workspace
            </span>
          </div>

          {requests.length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
              <GraduationCap className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                No active mentorship requests
              </h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Explore the mentor directory and submit your first request for a resume review, mock interview, or campus guidance.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {requests.map((req) => (
                <div
                  key={req.id}
                  className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 space-y-3 shadow-xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="space-y-0.5">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-bold text-slate-900 dark:text-white">
                          {req.topic}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                            req.status === 'Accepted'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300/60'
                              : req.status === 'Declined'
                              ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300/60'
                          }`}
                        >
                          {req.status === 'Accepted' ? 'Accepted • Scheduled' : req.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        Requested to: <strong className="text-brand-600 dark:text-brand-400">{req.mentor_name}</strong> • Format: {req.preferred_format} • {req.created_at}
                      </p>
                    </div>

                    <div className="text-right text-xs text-slate-500">
                      <span>Preferred Slot: {req.preferred_time || 'Flexible'}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-100 dark:border-slate-700/60">
                    "{req.description}"
                  </p>

                  {/* Mentor Response Note if Accepted */}
                  {req.response_note && (
                    <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/60 flex items-start space-x-2 text-xs text-emerald-900 dark:text-emerald-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="block mb-0.5">Mentor Note:</strong>
                        <span>{req.response_note}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Structured Mentorship Request Modal */}
      {selectedMentor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-xl max-h-[90vh] flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 shrink-0">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-bold">
                  {selectedMentor.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Request Guidance from {selectedMentor.name}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {selectedMentor.role} at {selectedMentor.company}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedMentor(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSendRequest} className="flex-1 overflow-y-auto p-6 space-y-4">
              {requestSubmittedSuccess ? (
                <div className="py-8 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 mx-auto flex items-center justify-center">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white">
                    Mentorship Request Sent!
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 max-w-xs mx-auto">
                    {selectedMentor.name} will review your question. You will receive an update in your 'My Requests' tab.
                  </p>
                </div>
              ) : (
                <>
                  {requestError && (
                    <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs font-semibold text-rose-600 dark:text-rose-400">
                      {requestError}
                    </div>
                  )}

                  {/* Topic Selector */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Guidance Topic *
                    </label>
                    <select
                      value={requestTopic}
                      onChange={(e) => setRequestTopic(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-brand-500"
                    >
                      {selectedMentor.topics.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                      <option value="General Placement Guidance">Other / General Placement Guidance</option>
                    </select>
                  </div>

                  {/* Description of Challenge */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      What challenge or question would you like help with? *
                    </label>
                    <textarea
                      rows={4}
                      value={requestDescription}
                      onChange={(e) => setRequestDescription(e.target.value)}
                      placeholder="e.g., I have an upcoming Barclays Round 2 technical interview next week. Could you review my project architecture bullets and test me on 1 core BFS/DFS pattern?"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-brand-500"
                      required
                    />
                  </div>

                  {/* Preferred Meeting Format */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Preferred Interaction Format
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: '1-on-1 Video Session', label: '1-on-1 Video', icon: Video },
                        { id: 'Async Q&A via Chat', label: 'Async Chat', icon: MessageSquare },
                        { id: 'Code / Resume Review', label: 'Doc Review', icon: FileText }
                      ].map((fmt) => {
                        const Icon = fmt.icon;
                        const isSelected = preferredFormat === fmt.id;
                        return (
                          <button
                            type="button"
                            key={fmt.id}
                            onClick={() => setPreferredFormat(fmt.id)}
                            className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-bold transition-all ${
                              isSelected
                                ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 text-indigo-700 dark:text-indigo-300 shadow-xs'
                                : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                            }`}
                          >
                            <Icon className="w-4 h-4 mb-1" />
                            <span>{fmt.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Preferred Date / Window */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Preferred Day or Window (Optional)
                    </label>
                    <input
                      type="text"
                      value={preferredTime}
                      onChange={(e) => setPreferredTime(e.target.value)}
                      placeholder="e.g., Saturday 4:00 PM IST or Weekend Mornings"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-hidden"
                    />
                  </div>

                  {/* Trust & Privacy Notice */}
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700 text-[11px] text-slate-500 flex items-start space-x-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>
                      Placement Hub protects private contact info. Verified alumni will respond via in-app scheduling or official college mail.
                    </span>
                  </div>
                </>
              )}

              {/* Submit Buttons */}
              {!requestSubmittedSuccess && (
                <div className="pt-2 flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setSelectedMentor(null)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-xs shadow-brand-600/30 transition-all flex items-center space-x-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Request</span>
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
