import React, { useState, useEffect, useRef } from 'react';
import {
  Clock,
  Zap,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowLeft,
  ArrowRight,
  AlertTriangle,
  Code2,
  Copy,
  Check,
  Flag,
  BookOpen,
  Sparkles,
  Trophy
} from 'lucide-react';
import { QuizConfig, QuizQuestion } from '../types/quiz';
import { getPointsForDifficulty } from '../utils/quizStorage';

interface QuizActiveProps {
  config: QuizConfig;
  questions: QuizQuestion[];
  onCompleteQuiz: (answers: Record<string, number | null>, timeTakenSeconds: number) => void;
  onAbortQuiz: () => void;
}

export const QuizActive: React.FC<QuizActiveProps> = ({
  config,
  questions,
  onCompleteQuiz,
  onAbortQuiz
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number | null>>({});
  
  // Practice mode: track which questions have had their answer checked
  const [checkedPracticeQuestions, setCheckedPracticeQuestions] = useState<Record<string, boolean>>({});

  // Timer state
  const totalAllocatedSeconds = config.questionCount * 60; // 60s per question in timed mode
  const [timeRemaining, setTimeRemaining] = useState(totalAllocatedSeconds);
  const [elapsedTime, setElapsedTime] = useState(0);

  // Modals & UI States
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showAbortModal, setShowAbortModal] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Setup timer
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setElapsedTime(prev => prev + 1);

      if (config.mode === 'Timed') {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            // Auto submit
            handleFinalSubmission(true);
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [config.mode]);

  // Window beforeunload warning
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  const currentQuestion = questions[currentIndex] || questions[0];
  const selectedOption = answers[currentQuestion.id] ?? null;
  const isPracticeChecked = checkedPracticeQuestions[currentQuestion.id] || false;

  // Compute live score so far
  let liveScore = 0;
  let liveAnsweredCount = 0;
  questions.forEach(q => {
    const ans = answers[q.id];
    if (ans !== undefined && ans !== null) {
      liveAnsweredCount++;
      if (ans === q.correctAnswerIndex) {
        liveScore += getPointsForDifficulty(q.difficulty);
      }
    }
  });

  const handleSelectOption = (index: number) => {
    // In practice mode, if already checked, do not allow changing answer
    if (config.mode === 'Practice' && isPracticeChecked) return;

    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: index
    }));
  };

  const handleCheckPracticeAnswer = () => {
    if (selectedOption === null) return;
    setCheckedPracticeQuestions(prev => ({
      ...prev,
      [currentQuestion.id]: true
    }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      handlePromptFinish();
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handlePromptFinish = () => {
    const unanswered = questions.filter(q => answers[q.id] === undefined || answers[q.id] === null).length;
    if (unanswered > 0) {
      setShowSubmitModal(true);
    } else {
      handleFinalSubmission(false);
    }
  };

  const handleFinalSubmission = (_isAutoTimeout: boolean) => {
    if (timerRef.current) clearInterval(timerRef.current);
    onCompleteQuiz(answers, elapsedTime);
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Keyboard navigation for options A, B, C, D
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['1', 'a', 'A'].includes(e.key)) handleSelectOption(0);
      if (['2', 'b', 'B'].includes(e.key)) handleSelectOption(1);
      if (['3', 'c', 'C'].includes(e.key)) handleSelectOption(2);
      if (['4', 'd', 'D'].includes(e.key)) handleSelectOption(3);
      if (e.key === 'ArrowRight' && currentIndex < questions.length - 1) handleNext();
      if (e.key === 'ArrowLeft' && currentIndex > 0) handlePrevious();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, currentQuestion, isPracticeChecked]);

  // Format MM:SS
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const progressPercent = Math.round(((currentIndex + 1) / questions.length) * 100);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Top HUD: Navigation, Timer, Score, and Progress */}
      <div className="p-4 md:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex items-center justify-between gap-4">
          
          {/* Left: Abort Button & Question Indicator */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowAbortModal(true)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
              title="Quit Quiz"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Question {currentIndex + 1} of {questions.length}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[200px] sm:max-w-xs">
                  {currentQuestion.topic}
                </span>
                <span className={`px-2 py-0.2 rounded-full text-[10px] font-bold ${
                  currentQuestion.difficulty === 'Beginner'
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                    : currentQuestion.difficulty === 'Intermediate'
                    ? 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                    : 'bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                }`}>
                  {currentQuestion.difficulty}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Timer & Score Badges */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Live Score pill */}
            <div className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center space-x-1.5">
              <Zap className="w-3.5 h-3.5 text-brand-600" />
              <span>{liveScore} pts</span>
            </div>

            {/* Timer Badge */}
            {config.mode === 'Timed' ? (
              <div
                className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold flex items-center space-x-1.5 transition-colors ${
                  timeRemaining <= 20
                    ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 animate-pulse'
                    : timeRemaining <= 60
                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    : 'bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>{formatTime(timeRemaining)}</span>
              </div>
            ) : (
              <div className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 text-xs font-semibold flex items-center space-x-1">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Practice</span>
              </div>
            )}

            {/* Finish Action */}
            <button
              onClick={handlePromptFinish}
              className="px-3 py-1.5 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-xs font-bold hover:opacity-90 transition-opacity shadow-xs"
            >
              Finish
            </button>
          </div>

        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-brand-600 h-full transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Main Question Card */}
      <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
        
        {/* Question Text */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-xs text-slate-400 font-semibold">
            <span>Points: +{getPointsForDifficulty(currentQuestion.difficulty)} pts</span>
            <span>•</span>
            <span>Est: {currentQuestion.estimatedSeconds || 30}s</span>
          </div>
          <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white leading-relaxed">
            {currentQuestion.question}
          </h2>
        </div>

        {/* Code Snippet (if available) */}
        {currentQuestion.codeSnippet && (
          <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 text-slate-100 font-mono text-xs shadow-inner">
            <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5 text-brand-400" />
                {currentQuestion.codeLanguage || 'code'}
              </span>
              <button
                onClick={() => handleCopyCode(currentQuestion.codeSnippet!)}
                className="flex items-center gap-1 hover:text-white transition-colors"
              >
                {copiedCode ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedCode ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <pre className="p-4 overflow-x-auto leading-relaxed text-emerald-300">
              <code>{currentQuestion.codeSnippet}</code>
            </pre>
          </div>
        )}

        {/* 4 Options Grid */}
        <div className="space-y-3">
          {currentQuestion.options.map((opt, idx) => {
            const isSelected = selectedOption === idx;
            const letter = String.fromCharCode(65 + idx); // A, B, C, D

            // Practice mode feedback state
            let optionStyle = 'bg-slate-50/70 dark:bg-slate-850 border-slate-200/80 dark:border-slate-800 hover:border-brand-300 dark:hover:border-slate-700';
            if (isSelected) {
              optionStyle = 'bg-brand-50/80 dark:bg-brand-950/60 border-brand-500 ring-2 ring-brand-500/20 text-brand-950 dark:text-brand-100 font-semibold shadow-xs';
            }

            if (config.mode === 'Practice' && isPracticeChecked) {
              if (idx === currentQuestion.correctAnswerIndex) {
                optionStyle = 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-950 dark:text-emerald-100 ring-2 ring-emerald-500/20';
              } else if (isSelected && idx !== currentQuestion.correctAnswerIndex) {
                optionStyle = 'bg-rose-50 dark:bg-rose-950/60 border-rose-500 text-rose-950 dark:text-rose-100 ring-2 ring-rose-500/20';
              }
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelectOption(idx)}
                className={`w-full text-left p-4 rounded-2xl border transition-all flex items-start space-x-3.5 ${optionStyle}`}
              >
                <div
                  className={`w-6 h-6 rounded-lg font-bold text-xs flex items-center justify-center shrink-0 transition-colors ${
                    isSelected
                      ? 'bg-brand-600 text-white'
                      : 'bg-slate-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {letter}
                </div>
                <div className="flex-1 text-xs md:text-sm text-slate-800 dark:text-slate-200 pt-0.5 leading-relaxed">
                  {opt}
                </div>
                {isSelected && !isPracticeChecked && (
                  <Check className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
                )}
                {isPracticeChecked && idx === currentQuestion.correctAnswerIndex && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                )}
                {isPracticeChecked && isSelected && idx !== currentQuestion.correctAnswerIndex && (
                  <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                )}
              </button>
            );
          })}
        </div>

        {/* Practice Mode Instant Explanation Box */}
        {config.mode === 'Practice' && (
          <div className="pt-2">
            {!isPracticeChecked ? (
              <button
                onClick={handleCheckPracticeAnswer}
                disabled={selectedOption === null}
                className="px-4 py-2 rounded-xl bg-brand-50 text-brand-700 dark:bg-brand-950/80 dark:text-brand-300 border border-brand-200/80 text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-brand-100 transition-colors flex items-center space-x-2"
              >
                <HelpCircle className="w-4 h-4" />
                <span>Check Answer & Explanation</span>
              </button>
            ) : (
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                <div className="flex items-center space-x-2 font-bold">
                  {selectedOption === currentQuestion.correctAnswerIndex ? (
                    <span className="text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Correct Answer!
                    </span>
                  ) : (
                    <span className="text-rose-600 flex items-center gap-1">
                      <XCircle className="w-4 h-4" /> Incorrect
                    </span>
                  )}
                </div>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  <strong>Explanation:</strong> {currentQuestion.explanation}
                </p>
                {currentQuestion.misconception && (
                  <p className="text-slate-500 dark:text-slate-400 text-[11px] italic bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800">
                    💡 <strong>Common Misconception:</strong> {currentQuestion.misconception}
                  </p>
                )}
              </div>
            )}
          </div>
        )}

      </div>

      {/* Bottom Bar: Palette jumper & Navigation */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Question Palette Jumper */}
        <div className="flex items-center flex-wrap gap-1.5">
          {questions.map((q, idx) => {
            const isAnswered = answers[q.id] !== undefined && answers[q.id] !== null;
            const isCurrent = idx === currentIndex;

            let pillStyle = 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200';
            if (isAnswered) {
              pillStyle = 'bg-brand-600 text-white font-bold border-brand-600 shadow-2xs';
            }
            if (isCurrent) {
              pillStyle += ' ring-2 ring-brand-500 ring-offset-2 dark:ring-offset-slate-900';
            }

            return (
              <button
                key={q.id}
                onClick={() => setCurrentIndex(idx)}
                className={`w-7 h-7 rounded-lg text-xs font-semibold transition-all border ${pillStyle}`}
                title={`Question ${idx + 1}`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-3 w-full md:w-auto justify-end">
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center space-x-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Previous</span>
          </button>

          {currentIndex < questions.length - 1 ? (
            <button
              onClick={handleNext}
              className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-xs transition-colors flex items-center space-x-1"
            >
              <span>Next</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={handlePromptFinish}
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xs transition-colors flex items-center space-x-1"
            >
              <span>Submit Quiz</span>
              <Check className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

      </div>

      {/* Confirmation Modal: Incomplete Quiz Submit */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950 text-amber-600 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Unanswered Questions Remaining
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                You have answered <strong>{liveAnsweredCount}</strong> of{' '}
                <strong>{questions.length}</strong> questions ({questions.length - liveAnsweredCount} unanswered will be marked with 0 points). Are you ready to submit your assessment?
              </p>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-50"
              >
                Continue Answering
              </button>
              <button
                onClick={() => {
                  setShowSubmitModal(false);
                  handleFinalSubmission(false);
                }}
                className="px-5 py-2 rounded-xl bg-brand-600 text-white text-xs font-bold shadow-xs hover:bg-brand-500"
              >
                Submit Assessment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal: Abort Quiz */}
      {showAbortModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Abandon Active Quiz?
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Your current session progress, timer, and answers will be discarded. No score or penalty will be recorded.
              </p>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                onClick={() => setShowAbortModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-50"
              >
                Resume Quiz
              </button>
              <button
                onClick={() => {
                  setShowAbortModal(false);
                  onAbortQuiz();
                }}
                className="px-5 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold shadow-xs hover:bg-rose-500"
              >
                Quit to Arena
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
