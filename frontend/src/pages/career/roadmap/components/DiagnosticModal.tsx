import React, { useState } from 'react';
import { X, ShieldCheck, CheckCircle2, AlertCircle, ArrowRight, HelpCircle } from 'lucide-react';

interface DiagnosticModalProps {
  skillName: string | null;
  onClose: () => void;
  onComplete: (skillName: string, passed: boolean) => void;
}

export const DiagnosticModal: React.FC<DiagnosticModalProps> = ({
  skillName,
  onClose,
  onComplete
}) => {
  if (!skillName) return null;

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [submitted, setSubmitted] = useState<boolean>(false);

  // Curated 3-question diagnostic evaluation for competency validation
  const questions = [
    {
      question: `In production applications utilizing ${skillName}, what is the primary architectural principle for managing side effects or asynchronous execution?`,
      options: [
        'Blocking the main execution thread until all network calls finish synchronously',
        'Isolating asynchronous workflows with explicit error boundaries and promise handling',
        'Executing all operations in background workers without error catching',
        'Storing sensitive operational state in unencrypted client local storage'
      ],
      correctIndex: 1
    },
    {
      question: `When optimizing high-traffic services involving ${skillName}, how should data latency and caching be handled?`,
      options: [
        'Query the primary database on every single incoming HTTP request',
        'Employ cache-aside patterns with appropriate TTL and cache invalidation strategies',
        'Disable indexing to maximize row write performance across tables',
        'Perform in-memory full table scans on every client filter update'
      ],
      correctIndex: 1
    },
    {
      question: `What is the standard practice for automated regression verification in ${skillName}?`,
      options: [
        'Manual ad-hoc testing directly in production environments',
        'Decoupling unit, integration, and E2E tests in automated CI/CD pipelines',
        'Skipping test coverage when deployment deadlines are tight',
        'Testing only happy-path inputs and assuming inputs are always well-formed'
      ],
      correctIndex: 1
    }
  ];

  const handleSelectOption = (idx: number) => {
    const updated = [...selectedAnswers];
    updated[currentQuestionIndex] = idx;
    setSelectedAnswers(updated);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Evaluate
      setSubmitted(true);
      const correctCount = selectedAnswers.reduce((acc, ans, i) => {
        return ans === questions[i].correctIndex ? acc + 1 : acc;
      }, 0);

      const passed = correctCount >= 2;
      setTimeout(() => {
        onComplete(skillName, passed);
      }, 1500);
    }
  };

  const isCurrentAnswered = selectedAnswers[currentQuestionIndex] !== undefined;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-lg my-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400 px-2.5 py-0.5 rounded-full bg-brand-50 dark:bg-brand-950 border border-brand-200/50">
            Prerequisite Verification Diagnostic
          </span>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Skill Test-Out: {skillName}
          </h3>
          <p className="text-xs text-slate-500">
            Complete this short 3-question evaluation to substantiate practical competence and skip introductory tasks.
          </p>
        </div>

        {!submitted ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
              <span>Pass threshold: 2/3 Correct</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850/60 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 leading-relaxed">
              {questions[currentQuestionIndex].question}
            </div>

            <div className="space-y-2">
              {questions[currentQuestionIndex].options.map((opt, oIdx) => {
                const isSelected = selectedAnswers[currentQuestionIndex] === oIdx;
                return (
                  <button
                    type="button"
                    key={oIdx}
                    onClick={() => handleSelectOption(oIdx)}
                    className={`w-full p-3 rounded-xl border text-xs text-left transition-all ${
                      isSelected
                        ? 'border-brand-600 bg-brand-50/50 dark:bg-brand-950/40 text-brand-900 dark:text-brand-200 font-bold'
                        : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={handleNext}
                disabled={!isCurrentAnswered}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white disabled:opacity-40 transition-all flex items-center space-x-1.5"
              >
                <span>{currentQuestionIndex === questions.length - 1 ? 'Submit Evaluation' : 'Next Question'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6 text-center space-y-3">
            <ShieldCheck className="w-10 h-10 text-emerald-500 mx-auto animate-bounce" />
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Evaluating Diagnostic Submissions…
            </h4>
            <p className="text-xs text-slate-500">
              Validating responses against engineering rubrics and updating your verified skill record.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
