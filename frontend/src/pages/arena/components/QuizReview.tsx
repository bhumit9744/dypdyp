import React, { useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Code2,
  Filter,
  Check,
  X
} from 'lucide-react';
import { QuizQuestion, QuizResultData } from '../types/quiz';

interface QuizReviewProps {
  result: QuizResultData;
  questions: QuizQuestion[];
  onBackToResults: () => void;
}

export const QuizReview: React.FC<QuizReviewProps> = ({
  result,
  questions,
  onBackToResults
}) => {
  const [activeFilter, setActiveFilter] = useState<'All' | 'Correct' | 'Incorrect' | 'Unanswered'>('All');

  const questionMap = new Map<string, QuizQuestion>();
  questions.forEach(q => questionMap.set(q.id, q));

  const answersMap = new Map<string, number | null>();
  result.userAnswers.forEach(ua => answersMap.set(ua.questionId, ua.selectedOptionIndex));

  const filteredQuestions = questions.filter(q => {
    const userSelected = answersMap.get(q.id);
    const isAnswered = userSelected !== undefined && userSelected !== null;
    const isCorrect = isAnswered && userSelected === q.correctAnswerIndex;

    if (activeFilter === 'Correct') return isCorrect;
    if (activeFilter === 'Incorrect') return isAnswered && !isCorrect;
    if (activeFilter === 'Unanswered') return !isAnswered;
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Top Header */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <button
            onClick={onBackToResults}
            className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Performance Summary</span>
          </button>

          <h1 className="text-xl font-bold text-slate-900 dark:text-white">
            Answer Review & Key Insights
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Inspect all questions, correct choices, and technical explanations.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center flex-wrap gap-1.5 bg-slate-50 dark:bg-slate-850 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800">
          {(['All', 'Correct', 'Incorrect', 'Unanswered'] as const).map(f => {
            let count = questions.length;
            if (f === 'Correct') count = result.correctCount;
            if (f === 'Incorrect') count = result.incorrectCount;
            if (f === 'Unanswered') count = result.unansweredCount;

            const isActive = activeFilter === f;

            return (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-brand-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {f} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {filteredQuestions.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400 text-xs">
            No questions match the "{activeFilter}" filter.
          </div>
        ) : (
          filteredQuestions.map((q, idx) => {
            const userSelected = answersMap.get(q.id) ?? null;
            const isAnswered = userSelected !== null;
            const isCorrect = isAnswered && userSelected === q.correctAnswerIndex;

            return (
              <div
                key={q.id}
                className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4"
              >
                {/* Status Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center space-x-2">
                    <span className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold text-xs flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {q.topic}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {q.difficulty}
                    </span>
                  </div>

                  {/* Result Badge */}
                  <div>
                    {isCorrect ? (
                      <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Correct</span>
                      </span>
                    ) : isAnswered ? (
                      <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Incorrect</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                        <HelpCircle className="w-3.5 h-3.5" />
                        <span>Unanswered</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Question Text */}
                <p className="text-sm font-semibold text-slate-900 dark:text-white leading-relaxed">
                  {q.question}
                </p>

                {/* Optional Code Snippet */}
                {q.codeSnippet && (
                  <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950 text-emerald-300 font-mono text-xs p-3">
                    <pre><code>{q.codeSnippet}</code></pre>
                  </div>
                )}

                {/* 4 Options with status markers */}
                <div className="space-y-2">
                  {q.options.map((opt, optIdx) => {
                    const isUserChoice = userSelected === optIdx;
                    const isTheCorrectAnswer = q.correctAnswerIndex === optIdx;

                    let rowStyle = 'bg-slate-50 dark:bg-slate-850/60 border-slate-200/60 dark:border-slate-800 text-slate-700 dark:text-slate-300';
                    if (isTheCorrectAnswer) {
                      rowStyle = 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-500/80 text-emerald-950 dark:text-emerald-200 font-semibold ring-1 ring-emerald-500/30';
                    } else if (isUserChoice && !isTheCorrectAnswer) {
                      rowStyle = 'bg-rose-50/80 dark:bg-rose-950/40 border-rose-500/80 text-rose-950 dark:text-rose-200 font-semibold ring-1 ring-rose-500/30';
                    }

                    return (
                      <div
                        key={optIdx}
                        className={`p-3 rounded-xl border text-xs flex items-center justify-between ${rowStyle}`}
                      >
                        <div className="flex items-center space-x-2.5">
                          <span className="w-5 h-5 rounded-md bg-white/60 dark:bg-slate-800 flex items-center justify-center font-bold text-[10px]">
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          <span>{opt}</span>
                        </div>

                        <div className="flex items-center space-x-2 shrink-0 text-[11px] font-bold">
                          {isTheCorrectAnswer && (
                            <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                              <Check className="w-3.5 h-3.5" /> Correct Answer
                            </span>
                          )}
                          {isUserChoice && !isTheCorrectAnswer && (
                            <span className="text-rose-600 dark:text-rose-400 flex items-center gap-1">
                              <X className="w-3.5 h-3.5" /> Your Choice
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Explanation Box */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 text-xs space-y-1.5">
                  <p className="text-slate-800 dark:text-slate-200 leading-relaxed">
                    <strong>Technical Explanation:</strong> {q.explanation}
                  </p>
                  {q.misconception && (
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 italic">
                      💡 <strong>Common Pitfall:</strong> {q.misconception}
                    </p>
                  )}
                </div>

              </div>
            );
          })
        )}
      </div>

      {/* Bottom Return Button */}
      <div className="pt-2 flex justify-center">
        <button
          onClick={onBackToResults}
          className="px-6 py-2.5 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-xs font-bold hover:opacity-90 transition-opacity"
        >
          Return to Performance Summary
        </button>
      </div>

    </div>
  );
};
