import React, { useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Bug,
  Code2,
  Lightbulb,
  Terminal,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Filter
} from 'lucide-react';
import { BugHunterResultData, BugChallenge } from '../../types/bugHunter';

interface BugHunterReviewProps {
  result: BugHunterResultData;
  challenges: BugChallenge[];
  onBackToResults: () => void;
}

export const BugHunterReview: React.FC<BugHunterReviewProps> = ({
  result,
  challenges,
  onBackToResults
}) => {
  const [filter, setFilter] = useState<'all' | 'correct' | 'incorrect'>('all');
  const [expandedChallenges, setExpandedChallenges] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => {
    setExpandedChallenges(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const filteredChallenges = challenges.filter(ch => {
    const attempt = result.attempts.find(a => a.challengeId === ch.id);
    const isCorrect = attempt?.isCorrect || false;

    if (filter === 'correct') return isCorrect;
    if (filter === 'incorrect') return !isCorrect;
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
      
      {/* Header & Back Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBackToResults}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Back to results"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div>
            <h1 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Bug className="w-5 h-5 text-amber-500" />
              Bug Hunter Challenge Review
            </h1>
            <p className="text-xs text-slate-500">
              In-depth diagnostic breakdown of all {challenges.length} challenges
            </p>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 shrink-0 self-start sm:self-auto">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              filter === 'all'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            All ({challenges.length})
          </button>
          <button
            onClick={() => setFilter('correct')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              filter === 'correct'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Correct ({result.correctCount})
          </button>
          <button
            onClick={() => setFilter('incorrect')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              filter === 'incorrect'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Incorrect ({result.incorrectCount})
          </button>
        </div>
      </div>

      {/* Challenge List */}
      <div className="space-y-4">
        {filteredChallenges.map((ch, idx) => {
          const attempt = result.attempts.find(a => a.challengeId === ch.id);
          const isCorrect = attempt?.isCorrect || false;
          const isExpanded = expandedChallenges[ch.id] ?? true; // expanded by default

          const codeLines = ch.faultyCode.split('\n');

          return (
            <div
              key={ch.id}
              className={`rounded-3xl border transition-all overflow-hidden ${
                isCorrect
                  ? 'border-emerald-200 dark:border-emerald-900/60 bg-white dark:bg-slate-900'
                  : 'border-rose-200 dark:border-rose-900/60 bg-white dark:bg-slate-900'
              }`}
            >
              {/* Challenge Header / Accordion Trigger */}
              <div
                onClick={() => toggleExpand(ch.id)}
                className="p-4 sm:p-5 flex items-start justify-between gap-4 cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-850/50 transition-colors"
              >
                <div className="flex items-start space-x-3.5">
                  {isCorrect ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  )}

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold text-slate-400">
                        #{idx + 1}
                      </span>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {ch.language}
                      </span>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {ch.category}
                      </span>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {ch.difficulty}
                      </span>
                      {attempt && attempt.hintsUsed > 0 && (
                        <span className="text-[10px] font-semibold text-amber-600 bg-amber-50 dark:bg-amber-950 px-2 py-0.5 rounded-md">
                          {attempt.hintsUsed} Hint{attempt.hintsUsed > 1 ? 's' : ''} (-{attempt.hintsPenalty}p)
                        </span>
                      )}
                    </div>

                    <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
                      {ch.title}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center space-x-3 shrink-0">
                  <span className={`text-xs font-black px-2.5 py-1 rounded-xl ${
                    isCorrect
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                  }`}>
                    {attempt ? `${attempt.pointsEarned}/${ch.points} pts` : `0/${ch.points} pts`}
                  </span>

                  <button className="text-slate-400 hover:text-slate-600">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Accordion Content */}
              {isExpanded && (
                <div className="px-5 pb-6 pt-2 border-t border-slate-100 dark:border-slate-800 space-y-5 text-xs">
                  
                  {/* Problem & Symptom */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Problem Context
                    </span>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                      {ch.problemStatement}
                    </p>
                  </div>

                  {/* Faulty Code with Bug Line Highlight */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                      <span>Faulty Code Snippet</span>
                      <span className="text-rose-600 font-sans font-bold">
                        Bug on Line {ch.faultyLineNumber}
                      </span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-900 text-slate-200 font-mono text-xs overflow-x-auto space-y-0.5">
                      {codeLines.map((line, lIdx) => {
                        const lineNum = lIdx + 1;
                        const isBuggy = lineNum === ch.faultyLineNumber;

                        return (
                          <div
                            key={lineNum}
                            className={`flex items-start px-2 py-0.5 rounded ${
                              isBuggy ? 'bg-rose-500/20 text-rose-300 border-l-2 border-rose-500 font-bold' : ''
                            }`}
                          >
                            <span className={`w-8 select-none text-right pr-3 shrink-0 ${
                              isBuggy ? 'text-rose-400' : 'text-slate-600'
                            }`}>
                              {lineNum}
                            </span>
                            <span className="whitespace-pre flex-1">
                              {line || ' '}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Diagnosis & Fix Explanation */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-3.5 rounded-2xl bg-rose-50/60 dark:bg-rose-950/30 border border-rose-200/60 dark:border-rose-900/40 space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400 block">
                        Root Cause of Failure
                      </span>
                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                        {ch.whyOriginalFailed}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-900/40 space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 block">
                        Why the Fix Works
                      </span>
                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                        {ch.whyFixWorks}
                      </p>
                    </div>
                  </div>

                  {/* Accepted Fix Code */}
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-bold text-slate-500">
                      Optimal Verified Solution:
                    </span>
                    <pre className="p-3 rounded-2xl bg-slate-900 text-emerald-300 font-mono text-xs overflow-x-auto whitespace-pre-wrap">
                      {ch.correctedCode}
                    </pre>
                  </div>

                  {/* Predefined Test Cases Breakdown */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1.5">
                      <Terminal className="w-3.5 h-3.5 text-brand-500" />
                      Verification Test Cases:
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {ch.testCases.map((tc) => (
                        <div
                          key={tc.id}
                          className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 space-y-1 font-mono text-[11px]"
                        >
                          <div className="flex items-center justify-between font-sans">
                            <span className="font-bold text-slate-700 dark:text-slate-300">
                              {tc.name}
                            </span>
                            {tc.exposesBug && (
                              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                                Exposes Bug
                              </span>
                            )}
                          </div>
                          <div className="text-slate-500">Input: <span className="text-slate-800 dark:text-slate-200">{tc.input}</span></div>
                          <div className="text-slate-500">Expected: <span className="text-emerald-600 dark:text-emerald-400">{tc.expectedOutput}</span></div>
                          {tc.exposesBug && (
                            <div className="text-slate-500">Faulty Actual: <span className="text-rose-600 dark:text-rose-400">{tc.actualWithBug}</span></div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Interview Takeaway */}
                  <div className="p-3.5 rounded-2xl bg-brand-50/60 dark:bg-brand-950/30 border border-brand-200/60 dark:border-brand-900/40 flex items-start space-x-2.5">
                    <Sparkles className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="font-bold text-slate-900 dark:text-white">Interview Tip: </strong>
                      <span className="text-slate-600 dark:text-slate-300">{ch.interviewTip}</span>
                    </div>
                  </div>

                </div>
              )}

            </div>
          );
        })}
      </div>

      {/* Bottom return button */}
      <div className="pt-4 flex justify-center">
        <button
          onClick={onBackToResults}
          className="px-6 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold text-xs transition-colors flex items-center space-x-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Results Summary</span>
        </button>
      </div>

    </div>
  );
};
