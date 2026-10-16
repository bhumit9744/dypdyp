import React, { useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Zap,
  Code2,
  Lightbulb,
  Terminal,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Filter,
  Award
} from 'lucide-react';
import { AlgorithmRushResultData, AlgorithmChallenge } from '../../types/algorithmRush';

interface AlgorithmRushReviewProps {
  result: AlgorithmRushResultData;
  challenges: AlgorithmChallenge[];
  onBackToResults: () => void;
}

export const AlgorithmRushReview: React.FC<AlgorithmRushReviewProps> = ({
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
              <Zap className="w-5 h-5 text-cyan-600" />
              Challenge Solutions & Insights
            </h1>
            <p className="text-xs text-slate-500">
              Review optimal approaches, Big-O asymptotic analysis, and placement traps.
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl self-start sm:self-auto text-xs">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
              filter === 'all'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            All ({challenges.length})
          </button>
          <button
            onClick={() => setFilter('correct')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
              filter === 'correct'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Correct ({result.correctCount})
          </button>
          <button
            onClick={() => setFilter('incorrect')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
              filter === 'incorrect'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Missed ({challenges.length - result.correctCount})
          </button>
        </div>
      </div>

      {/* Accordion Challenge List */}
      <div className="space-y-4">
        {filteredChallenges.map((ch, idx) => {
          const attempt = result.attempts.find(a => a.challengeId === ch.id);
          const isCorrect = attempt?.isCorrect || false;
          const isExpanded = expandedChallenges[ch.id] ?? false;

          const chosenOption = ch.options.find(o => o.id === attempt?.selectedOptionId);
          const correctOption = ch.options.find(o => o.id === ch.correctOptionId);

          return (
            <div
              key={ch.id}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs transition-all"
            >
              {/* Accordion Clickable Header */}
              <div
                onClick={() => toggleExpand(ch.id)}
                className="p-5 flex items-center justify-between cursor-pointer hover:bg-slate-50/60 dark:hover:bg-slate-850/40 transition-colors"
              >
                <div className="flex items-center space-x-3.5">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                    isCorrect
                      ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/80 dark:text-emerald-400'
                      : 'bg-rose-50 text-rose-600 dark:bg-rose-950/80 dark:text-rose-400'
                  }`}>
                    {isCorrect ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-400">
                        #{idx + 1}
                      </span>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                        {ch.title}
                      </h3>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                      <span className="font-semibold text-slate-600 dark:text-slate-300">{ch.topic}</span>
                      <span>•</span>
                      <span>{ch.difficulty}</span>
                      <span>•</span>
                      <span className="text-cyan-600 dark:text-cyan-400 font-semibold">{ch.pattern}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3 shrink-0">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-xl ${
                    isCorrect
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                  }`}>
                    {isCorrect ? `+${attempt?.pointsEarned || ch.points} pts` : '0 pts'}
                  </span>

                  <button
                    type="button"
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    aria-label={isExpanded ? 'Collapse' : 'Expand'}
                  >
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Accordion Expanded Body */}
              {isExpanded && (
                <div className="p-5 pt-0 border-t border-slate-100 dark:border-slate-800 space-y-4 text-xs">
                  
                  {/* Problem Statement Recap */}
                  <div className="pt-4 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Problem Context
                    </span>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                      {ch.problemStatement}
                    </p>
                  </div>

                  {/* Asymptotic Complexity Badges */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 space-y-0.5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Time Complexity</span>
                      <span className="text-xs font-black text-cyan-600 dark:text-cyan-400 font-mono">
                        {ch.timeComplexity}
                      </span>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 space-y-0.5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Auxiliary Space</span>
                      <span className="text-xs font-black text-indigo-600 dark:text-indigo-400 font-mono">
                        {ch.spaceComplexity}
                      </span>
                    </div>

                    <div className="col-span-2 sm:col-span-1 p-3 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 space-y-0.5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Core Pattern</span>
                      <span className="text-xs font-bold text-purple-600 dark:text-purple-400">
                        {ch.pattern}
                      </span>
                    </div>
                  </div>

                  {/* User Answer vs Correct Solution */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    
                    {/* Your Answer */}
                    <div className={`p-3.5 rounded-2xl border space-y-1.5 ${
                      isCorrect
                        ? 'border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/50 dark:bg-emerald-950/30'
                        : 'border-rose-200 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/30'
                    }`}>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                        {isCorrect ? <CheckCircle2 className="w-3 h-3 text-emerald-600" /> : <XCircle className="w-3 h-3 text-rose-600" />}
                        Your Selected Answer
                      </span>
                      <p className="font-semibold text-slate-800 dark:text-slate-200">
                        {chosenOption?.label || 'Timed out / None selected'}
                      </p>
                      {chosenOption?.codeSnippet && (
                        <pre className="p-2 rounded-xl bg-slate-900 text-cyan-300 font-mono text-[10px] whitespace-pre-wrap">
                          {chosenOption.codeSnippet}
                        </pre>
                      )}
                    </div>

                    {/* Correct Answer */}
                    <div className="p-3.5 rounded-2xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/50 dark:bg-emerald-950/30 space-y-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Optimal Correct Solution
                      </span>
                      <p className="font-semibold text-slate-800 dark:text-slate-200">
                        {correctOption?.label}
                      </p>
                      {correctOption?.codeSnippet && (
                        <pre className="p-2 rounded-xl bg-slate-900 text-emerald-300 font-mono text-[10px] whitespace-pre-wrap">
                          {correctOption.codeSnippet}
                        </pre>
                      )}
                    </div>

                  </div>

                  {/* Technical Explanation */}
                  <div className="space-y-1 pt-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Why It Works
                    </span>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                      {ch.detailedExplanation}
                    </p>
                  </div>

                  {/* Optimal Approach & Common Pitfall */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
                        Optimal Strategy
                      </span>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400">
                        {ch.optimalApproach}
                      </p>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                        Common Interview Trap
                      </span>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400">
                        {ch.commonPitfall}
                      </p>
                    </div>
                  </div>

                  {/* Placement Tip */}
                  {ch.interviewTip && (
                    <div className="p-3 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-200/50 dark:border-indigo-900/40 flex items-start gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
                      <div className="text-[11px] text-indigo-900 dark:text-indigo-200">
                        <strong className="font-bold">Placement Tip:</strong> {ch.interviewTip}
                      </div>
                    </div>
                  )}

                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};
