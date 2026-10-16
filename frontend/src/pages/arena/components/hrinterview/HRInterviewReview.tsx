import React, { useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Lightbulb,
  Award,
  Users,
  Briefcase,
  Terminal,
  Filter,
  Check,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { HRResultData, HRQuestion, HRAttemptRecord, HROption } from '../../types/hrInterview';

interface HRInterviewReviewProps {
  result: HRResultData;
  questions: HRQuestion[];
  onBackToResults: () => void;
}

export const HRInterviewReview: React.FC<HRInterviewReviewProps> = ({
  result,
  questions,
  onBackToResults
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'optimal' | 'needs-work'>('all');
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});

  const questionMap = new Map<string, HRQuestion>();
  questions.forEach((q: HRQuestion) => questionMap.set(q.id, q));

  const filteredAttempts = result.attempts.filter((att: HRAttemptRecord) => {
    const score = att.score ?? att.pointsEarned ?? 0;
    if (activeFilter === 'optimal') return att.isOptimal || score >= 4;
    if (activeFilter === 'needs-work') return !att.isOptimal && score < 4;
    return true;
  });

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const maxPossibleScore = result.maxPossibleScore ?? result.maxScore;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      
      {/* Top Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBackToResults}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Back to Results"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-base font-extrabold text-white">
              Interview Transcript Review
            </h1>
            <p className="text-xs text-slate-400">
              Score: {result.score}/{maxPossibleScore} ({result.percentage}%) • {result.attempts.length} Questions Reviewed
            </p>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-1.5 bg-slate-800/80 p-1 rounded-2xl border border-slate-700">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeFilter === 'all'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All ({result.attempts.length})
          </button>
          <button
            onClick={() => setActiveFilter('optimal')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeFilter === 'optimal'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Optimal ({result.attempts.filter((a: HRAttemptRecord) => a.isOptimal || (a.score ?? a.pointsEarned ?? 0) >= 4).length})
          </button>
          <button
            onClick={() => setActiveFilter('needs-work')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeFilter === 'needs-work'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Needs Refinement ({result.attempts.filter((a: HRAttemptRecord) => !a.isOptimal && (a.score ?? a.pointsEarned ?? 0) < 4).length})
          </button>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {filteredAttempts.length === 0 ? (
          <div className="p-8 text-center rounded-3xl bg-slate-900 border border-slate-800 text-slate-400 text-xs">
            No questions match the selected filter.
          </div>
        ) : (
          filteredAttempts.map((att: HRAttemptRecord, idx: number) => {
            const questionData = questionMap.get(att.questionId);
            if (!questionData) return null;

            const isExpanded = expandedIds[att.questionId] ?? true;
            const chosenOption = questionData.options?.find((o: HROption) => o.id === att.selectedOptionId);
            const optimalOption = questionData.options?.find((o: HROption) => o.quality === 'optimal' || o.isOptimal);

            const score = att.score ?? att.pointsEarned ?? 0;
            const maxScore = att.maxScore ?? att.maxPoints ?? 5;
            const responseType = questionData.responseType || questionData.type || 'multiple-choice';
            const scenarioContext = questionData.scenarioContext || questionData.context;
            const recruiterIntent = questionData.explanation?.recruiterIntent || questionData.interviewerIntent;
            const keyTakeaway = questionData.explanation?.keyTakeaway || questionData.idealTakeaway;
            const modelAnswer = questionData.explanation?.modelAnswer;

            return (
              <div
                key={att.questionId}
                className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4"
              >
                {/* Header row */}
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold text-slate-400">
                        Q{idx + 1}.
                      </span>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                        {questionData.category}
                      </span>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-800/60 text-slate-400">
                        {responseType === 'typed' ? 'Typed STAR Response' : 'Multiple Choice'}
                      </span>
                    </div>

                    <h2 className="text-sm sm:text-base font-bold text-white pt-1">
                      {questionData.question}
                    </h2>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <span
                      className={`px-3 py-1 rounded-xl font-bold text-xs ${
                        score >= 4
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : score >= 2
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                      }`}
                    >
                      {score}/{maxScore} pts
                    </span>

                    <button
                      onClick={() => toggleExpand(att.questionId)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Collapsible Details */}
                {isExpanded && (
                  <div className="space-y-4 pt-2 border-t border-slate-800 text-xs text-slate-300">
                    
                    {/* Scenario context if present */}
                    {scenarioContext && (
                      <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700 text-slate-300 text-xs">
                        <strong className="text-slate-200 block mb-0.5">Scenario:</strong>
                        {scenarioContext}
                      </div>
                    )}

                    {/* Candidate's submitted response */}
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                        Your Response
                      </span>

                      {att.skipped ? (
                        <div className="p-3 rounded-xl bg-slate-800 border border-slate-700 text-amber-300 italic">
                          (Question was skipped)
                        </div>
                      ) : responseType === 'typed' ? (
                        <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-200 font-mono text-xs whitespace-pre-wrap leading-relaxed">
                          {att.typedResponse || att.typedAnswer || '(No response text)'}
                        </div>
                      ) : (
                        <div
                          className={`p-3.5 rounded-xl border text-xs ${
                            att.isOptimal
                              ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
                              : 'bg-slate-800 border-slate-700 text-slate-200'
                          }`}
                        >
                          <strong className="block mb-1 font-bold">
                            Option {chosenOption?.id.toUpperCase()}:
                          </strong>
                          {chosenOption?.text || '(None selected)'}
                        </div>
                      )}
                    </div>

                    {/* If multiple choice and not optimal, show optimal choice */}
                    {responseType !== 'typed' && !att.isOptimal && optimalOption && (
                      <div className="space-y-1.5">
                        <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block">
                          Optimal Response Approach
                        </span>
                        <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-emerald-200 text-xs">
                          <strong className="block mb-1 font-bold text-emerald-300">
                            Option {optimalOption.id.toUpperCase()}:
                          </strong>
                          {optimalOption.text}
                        </div>
                      </div>
                    )}

                    {/* Exemplary Benchmark for typed response */}
                    {responseType === 'typed' && modelAnswer && (
                      <div className="space-y-1.5">
                        <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block">
                          Exemplary Placement Response Benchmark
                        </span>
                        <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-emerald-200 text-xs italic leading-relaxed">
                          "{modelAnswer}"
                        </div>
                      </div>
                    )}

                    {/* Recruiter intent */}
                    <div className="p-3 rounded-xl bg-indigo-950/20 border border-indigo-800/30 text-indigo-200 text-xs">
                      <strong className="text-indigo-300 block mb-0.5 font-semibold">Recruiter's True Evaluation Criteria:</strong>
                      {recruiterIntent}
                    </div>

                    {/* Actionable takeaway */}
                    <div className="p-3 rounded-xl bg-cyan-950/20 border border-cyan-800/30 text-cyan-200 text-xs">
                      <strong className="text-cyan-300 block mb-0.5 font-semibold">Campus Placement Takeaway:</strong>
                      {keyTakeaway}
                    </div>

                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Bottom Back Button */}
      <div className="pt-4 flex justify-center">
        <button
          onClick={onBackToResults}
          className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors cursor-pointer"
        >
          Back to Results Summary
        </button>
      </div>

    </div>
  );
};
