import React, { useState, useEffect, useRef } from 'react';
import {
  Zap,
  Clock,
  Sparkles,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Lightbulb,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Check,
  HelpCircle,
  Code2,
  Layers,
  Compass,
  Flame,
  ShieldCheck,
  Terminal,
  Award,
  Activity
} from 'lucide-react';
import {
  AlgorithmChallenge,
  AlgorithmRushConfig,
  AlgorithmAttemptRecord
} from '../../types/algorithmRush';

interface AlgorithmRushWorkspaceProps {
  config: AlgorithmRushConfig;
  challenges: AlgorithmChallenge[];
  onCompleteSession: (attempts: AlgorithmAttemptRecord[], totalTimeSeconds: number) => void;
  onExitToArena: () => void;
}

export const AlgorithmRushWorkspace: React.FC<AlgorithmRushWorkspaceProps> = ({
  config,
  challenges,
  onCompleteSession,
  onExitToArena
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [attempts, setAttempts] = useState<AlgorithmAttemptRecord[]>([]);

  // Challenge active state
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);

  // Hints
  const [hintsRevealed, setHintsRevealed] = useState<number>(0);
  const [confirmHintLevel, setConfirmHintLevel] = useState<number | null>(null);

  // Submission & Feedback
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionOutcome, setSubmissionOutcome] = useState<{
    isCorrect: boolean;
    pointsEarned: number;
    penalty: number;
  } | null>(null);

  // Exit Modal
  const [showExitModal, setShowExitModal] = useState(false);

  // Timers
  const isTimedMode = config.mode === 'quick-solve' || config.mode === 'rush-ladder';
  const initialTimeLimit = challenges[currentIndex]?.timeLimitSeconds || 60;
  const [timeRemaining, setTimeRemaining] = useState<number>(initialTimeLimit);
  const [totalElapsedTime, setTotalElapsedTime] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const currentChallenge: AlgorithmChallenge | undefined = challenges[currentIndex] || challenges[0];

  // Reset challenge-specific input states when moving to next challenge
  const resetChallengeState = () => {
    setSelectedOptionId(null);
    setHintsRevealed(0);
    setConfirmHintLevel(null);
    setIsSubmitted(false);
    setSubmissionOutcome(null);
    const nextLimit = challenges[currentIndex + 1]?.timeLimitSeconds || 60;
    setTimeRemaining(nextLimit);
  };

  // Timer effect
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTotalElapsedTime(prev => prev + 1);

      if (isTimedMode && !isSubmitted) {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleTimeoutSubmit();
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIndex, isTimedMode, isSubmitted]);

  // Window beforeunload guard
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  const handleTimeoutSubmit = () => {
    if (isSubmitted) return;
    executeSubmission(true);
  };

  // Progressive Hint unlock with penalty
  const requestHint = (level: number) => {
    setConfirmHintLevel(level);
  };

  const confirmHint = (level: number) => {
    setHintsRevealed(level);
    setConfirmHintLevel(null);
  };

  // Submit Answer & Evaluate
  const executeSubmission = (isTimeout: boolean = false) => {
    if (isSubmitted || !currentChallenge) return;

    const isCorrect = !isTimeout && selectedOptionId === currentChallenge.correctOptionId;

    // Compute hint penalties
    let penalty = 0;
    for (let i = 0; i < hintsRevealed; i++) {
      penalty += currentChallenge.hints[i]?.penalty || 0;
    }

    // Optional speed bonus if answered correctly within first 30% of time
    let speedBonus = 0;
    if (isCorrect && !isTimeout && isTimedMode) {
      const timeSpent = initialTimeLimit - timeRemaining;
      if (timeSpent <= Math.round(initialTimeLimit * 0.35)) {
        speedBonus = 5; // Capped speed bonus
      }
    }

    let pointsEarned = 0;
    if (isCorrect && !isTimeout) {
      pointsEarned = Math.max(0, currentChallenge.points - penalty + speedBonus);
    }

    const outcome = {
      isCorrect,
      pointsEarned,
      penalty
    };

    setSubmissionOutcome(outcome);
    setIsSubmitted(true);

    const attemptRecord: AlgorithmAttemptRecord = {
      challengeId: currentChallenge.id,
      selectedOptionId,
      isCorrect,
      hintsUsed: hintsRevealed,
      hintsPenalty: penalty,
      pointsEarned,
      maxPoints: currentChallenge.points,
      timeSpentSeconds: initialTimeLimit - timeRemaining
    };

    // Ensure no duplicate records
    setAttempts(prev => [...prev.filter(a => a.challengeId !== currentChallenge.id), attemptRecord]);
  };

  // Next Challenge or Finish Session
  const handleNextChallenge = () => {
    if (currentIndex < challenges.length - 1) {
      setCurrentIndex(prev => prev + 1);
      resetChallengeState();
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      onCompleteSession(attempts, totalElapsedTime);
    }
  };

  // Fallback if challenge is loading or missing
  if (!currentChallenge) {
    return (
      <div className="max-w-xl mx-auto p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4 my-12 animate-fadeIn">
        <Zap className="w-12 h-12 text-cyan-500 mx-auto" />
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          Preparing Challenges...
        </h3>
        <p className="text-xs text-slate-500">
          Loading algorithm workspace...
        </p>
        <button
          onClick={onExitToArena}
          className="px-5 py-2.5 rounded-xl bg-cyan-600 text-white font-bold text-xs"
        >
          Return to Games Hub
        </button>
      </div>
    );
  }

  // Live total score
  const totalScoreSoFar = attempts.reduce((acc, a) => acc + a.pointsEarned, 0);

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fadeIn">
      
      {/* TOP HUD BAR */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Left: Game Title, Badge & Progress */}
        <div className="flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center font-bold shrink-0">
            <Zap className="w-5 h-5" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                Algorithm Rush
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-50 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300 border border-cyan-200/60 uppercase">
                {config.mode === 'quick-solve' && 'Quick Solve'}
                {config.mode === 'complexity-clash' && 'Complexity Clash'}
                {config.mode === 'pattern-match' && 'Pattern Match'}
                {config.mode === 'rush-ladder' && 'Rush Ladder'}
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
              <span>Challenge {currentIndex + 1} of {challenges.length}</span>
              <span>•</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">{currentChallenge.topic}</span>
              <span>•</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">{currentChallenge.difficulty}</span>
            </div>
          </div>
        </div>

        {/* Center: Progress Bar */}
        <div className="flex-1 max-w-xs hidden lg:block">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 mb-1">
            <span>Progress</span>
            <span>{Math.round(((currentIndex + (isSubmitted ? 1 : 0)) / challenges.length) * 100)}%</span>
          </div>
          <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-indigo-600 transition-all duration-300"
              style={{ width: `${((currentIndex + (isSubmitted ? 1 : 0)) / challenges.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Right: Score, Timer & Exit */}
        <div className="flex items-center space-x-3 shrink-0">
          
          {/* Live Score */}
          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 border border-cyan-200/80 dark:border-cyan-900/60 text-cyan-700 dark:text-cyan-300">
            <Sparkles className="w-4 h-4 fill-cyan-400 text-cyan-500" />
            <span className="text-xs font-black">{totalScoreSoFar} pts</span>
          </div>

          {/* Countdown Timer */}
          {isTimedMode && (
            <div className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl font-mono text-xs font-bold border ${
              timeRemaining <= 15
                ? 'bg-rose-50 dark:bg-rose-950/80 text-rose-600 border-rose-200 dark:border-rose-900 animate-pulse'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
            }`}>
              <Clock className="w-3.5 h-3.5" />
              <span>{timeRemaining}s</span>
            </div>
          )}

          {/* Abort Button */}
          <button
            onClick={() => setShowExitModal(true)}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Exit
          </button>
        </div>

      </div>

      {/* WORKSPACE GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT PANEL: PROBLEM SPECIFICATION (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 space-y-5 shadow-xs">
            
            {/* Header info */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  {currentChallenge.topic}
                </span>

                <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400 flex items-center gap-1">
                  <Award className="w-3.5 h-3.5" />
                  +{currentChallenge.points} Max Points
                </span>
              </div>

              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-snug">
                {currentChallenge.title}
              </h2>
            </div>

            {/* Problem Statement */}
            <div className="space-y-1">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Problem Statement
              </h4>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                {currentChallenge.problemStatement}
              </p>
            </div>

            {/* Input & Output Specifications */}
            {(currentChallenge.inputFormat || currentChallenge.outputFormat) && (
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 space-y-1.5 text-xs">
                {currentChallenge.inputFormat && (
                  <div>
                    <span className="font-bold text-slate-500 text-[10px] uppercase block">Input Format</span>
                    <code className="text-cyan-600 dark:text-cyan-300 font-mono text-[11px]">{currentChallenge.inputFormat}</code>
                  </div>
                )}
                {currentChallenge.outputFormat && (
                  <div>
                    <span className="font-bold text-slate-500 text-[10px] uppercase block">Output Format</span>
                    <code className="text-cyan-600 dark:text-cyan-300 font-mono text-[11px]">{currentChallenge.outputFormat}</code>
                  </div>
                )}
              </div>
            )}

            {/* Examples */}
            {currentChallenge.examples && currentChallenge.examples.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Example Test Cases
                </h4>
                <div className="space-y-2">
                  {currentChallenge.examples.map((ex, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-850/80 border border-slate-200/60 dark:border-slate-800 text-xs space-y-1"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-slate-400">Input:</span>
                        <code className="font-mono text-slate-800 dark:text-slate-200 text-[11px]">{ex.input}</code>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-slate-400">Output:</span>
                        <code className="font-mono text-emerald-600 dark:text-emerald-400 font-bold text-[11px]">{ex.output}</code>
                      </div>
                      {ex.explanation && (
                        <p className="text-[10px] text-slate-500 pt-0.5">
                          {ex.explanation}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Constraints */}
            {currentChallenge.constraints && currentChallenge.constraints.length > 0 && (
              <div className="space-y-1.5 pt-1">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Constraints & Bounds
                </h4>
                <ul className="text-[11px] text-slate-600 dark:text-slate-400 space-y-0.5 list-disc list-inside">
                  {currentChallenge.constraints.map((c, i) => (
                    <li key={i} className="font-mono">{c}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Progressive Hint Drawer */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                  Progressive Hints
                </span>
                <span className="text-[10px] text-slate-400">
                  {hintsRevealed}/3 Unlocked
                </span>
              </div>

              {/* Hint buttons */}
              <div className="grid grid-cols-3 gap-2">
                {currentChallenge.hints.map((hint, idx) => {
                  const level = idx + 1;
                  const isRevealed = hintsRevealed >= level;

                  return (
                    <button
                      key={idx}
                      type="button"
                      disabled={isRevealed || isSubmitted}
                      onClick={() => requestHint(level)}
                      className={`py-1.5 px-2 rounded-xl text-[11px] font-bold border transition-all text-center ${
                        isRevealed
                          ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                          : 'border-slate-200 dark:border-slate-800 hover:border-amber-300 text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-850'
                      }`}
                    >
                      {isRevealed ? `Hint ${level} Active` : `Hint ${level} (-${hint.penalty}p)`}
                    </button>
                  );
                })}
              </div>

              {/* Hint Confirmation Dialog */}
              {confirmHintLevel !== null && (
                <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950 border border-amber-300 dark:border-amber-800 space-y-2">
                  <p className="text-xs text-amber-800 dark:text-amber-200 font-medium">
                    Unlock Hint {confirmHintLevel}? This will deduct{' '}
                    <strong className="font-bold">
                      {currentChallenge.hints[confirmHintLevel - 1]?.penalty} points
                    </strong>{' '}
                    from this challenge.
                  </p>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => confirmHint(confirmHintLevel)}
                      className="px-3 py-1 rounded-lg bg-amber-600 text-white text-xs font-bold hover:bg-amber-700 transition-colors"
                    >
                      Confirm (-{currentChallenge.hints[confirmHintLevel - 1]?.penalty} pts)
                    </button>
                    <button
                      onClick={() => setConfirmHintLevel(null)}
                      className="px-3 py-1 rounded-lg border border-amber-300 text-xs font-semibold text-amber-800 dark:text-amber-200 hover:bg-amber-100/50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Display revealed hints */}
              {hintsRevealed > 0 && (
                <div className="space-y-1.5 pt-1">
                  {currentChallenge.hints.slice(0, hintsRevealed).map((h, i) => (
                    <div
                      key={i}
                      className="text-[11px] p-2.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200/50 dark:border-amber-900/40 text-amber-900 dark:text-amber-200 leading-relaxed"
                    >
                      <strong className="font-bold">Hint {i + 1}:</strong> {h.text}
                    </div>
                  ))}
                </div>
              )}

            </div>

          </div>

        </div>

        {/* RIGHT PANEL: CODE PREVIEW & CANDIDATE OPTIONS (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* CODE SNIPPET (IF PRESENT) */}
          {currentChallenge.codeSnippet && (
            <div className="bg-slate-900 text-slate-100 rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
              <div className="px-4 py-2.5 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                  </div>
                  <span className="text-[11px] font-mono font-semibold text-slate-400 pl-2">
                    algorithm_implementation.{currentChallenge.language.toLowerCase() === 'python' ? 'py' : currentChallenge.language.toLowerCase() === 'java' ? 'java' : currentChallenge.language.toLowerCase() === 'c++' ? 'cpp' : 'js'}
                  </span>
                </div>
                <span className="text-[10px] font-semibold text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded-md border border-cyan-800/60">
                  Candidate Code
                </span>
              </div>
              <div className="p-4 font-mono text-xs overflow-x-auto leading-relaxed select-text">
                <pre className="text-cyan-200 whitespace-pre-wrap">
                  {currentChallenge.codeSnippet}
                </pre>
              </div>
            </div>
          )}

          {/* OPTIONS SELECTION CARD */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 space-y-5 shadow-xs">
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-cyan-600" />
                  Select the Optimal Solution / Answer
                </h3>
                <span className="text-[10px] text-slate-400">
                  Choose the correct algorithmic approach or complexity analysis
                </span>
              </div>

              {/* Deterministic Evaluation Disclaimer Badge */}
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-semibold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg">
                <ShieldCheck className="w-3 h-3 text-cyan-500" />
                Verified Algorithm Simulation
              </span>
            </div>

            {/* Candidate Options List */}
            <div className="space-y-3">
              {currentChallenge.options.map((opt) => {
                const isSelected = selectedOptionId === opt.id;
                const isCorrectOption = opt.isCorrect;

                // Color classes based on submission state
                let cardStyle = 'border-slate-200 dark:border-slate-800 hover:border-slate-300';
                if (!isSubmitted) {
                  if (isSelected) {
                    cardStyle = 'border-cyan-600 bg-cyan-50/50 dark:bg-cyan-950/40 ring-1 ring-cyan-500 shadow-xs';
                  }
                } else {
                  if (isCorrectOption) {
                    cardStyle = 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/50 ring-1 ring-emerald-500';
                  } else if (isSelected && !isCorrectOption) {
                    cardStyle = 'border-rose-500 bg-rose-50/70 dark:bg-rose-950/50 ring-1 ring-rose-500';
                  } else {
                    cardStyle = 'border-slate-200 dark:border-slate-800 opacity-60';
                  }
                }

                return (
                  <div
                    key={opt.id}
                    onClick={() => {
                      if (!isSubmitted) {
                        setSelectedOptionId(opt.id);
                      }
                    }}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${cardStyle}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start space-x-3">
                        <div className={`w-4 h-4 rounded-full border mt-0.5 flex items-center justify-center shrink-0 ${
                          isSelected
                            ? isSubmitted
                              ? isCorrectOption
                                ? 'border-emerald-600 bg-emerald-600 text-white'
                                : 'border-rose-600 bg-rose-600 text-white'
                              : 'border-cyan-600 bg-cyan-600 text-white'
                            : 'border-slate-300 dark:border-slate-700'
                        }`}>
                          {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>

                        <div>
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-snug">
                            {opt.label}
                          </h4>
                          {opt.explanation && !opt.codeSnippet && (
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                              {opt.explanation}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Post-submission badge */}
                      {isSubmitted && isCorrectOption && (
                        <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 shrink-0">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Correct
                        </span>
                      )}
                      {isSubmitted && isSelected && !isCorrectOption && (
                        <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1 shrink-0">
                          <XCircle className="w-3.5 h-3.5" /> Incorrect
                        </span>
                      )}
                    </div>

                    {/* Code snippet inside option */}
                    {opt.codeSnippet && (
                      <pre className="p-3 rounded-xl bg-slate-900 text-cyan-300 font-mono text-[11px] whitespace-pre-wrap mt-2 overflow-x-auto">
                        {opt.codeSnippet}
                      </pre>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Submission / Next Bar */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
              <span className="text-[11px] text-slate-400">
                {!isSubmitted ? 'Select an answer to unlock evaluation' : 'Review solution and insights below'}
              </span>

              {!isSubmitted ? (
                <button
                  type="button"
                  disabled={!selectedOptionId}
                  onClick={() => executeSubmission(false)}
                  className={`px-6 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all flex items-center space-x-1.5 ${
                    selectedOptionId
                      ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white shadow-cyan-500/25 cursor-pointer'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed shadow-none'
                  }`}
                >
                  <span>Submit Solution</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleNextChallenge}
                  className="px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-md shadow-cyan-500/25 transition-all flex items-center space-x-1.5 cursor-pointer"
                >
                  <span>{currentIndex < challenges.length - 1 ? 'Next Challenge' : 'Complete Session'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>

          </div>

          {/* LEARNING & EXPLANATION PANEL (AFTER SUBMISSION) */}
          {isSubmitted && submissionOutcome && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 space-y-4 shadow-sm animate-fadeIn">
              
              {/* Outcome Banner */}
              <div className={`p-4 rounded-2xl flex items-center justify-between gap-3 ${
                submissionOutcome.isCorrect
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200'
                  : 'bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200'
              }`}>
                <div className="flex items-center space-x-2.5">
                  {submissionOutcome.isCorrect ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  ) : (
                    <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                  )}
                  <div>
                    <h4 className="text-xs font-bold">
                      {submissionOutcome.isCorrect ? 'Correct Algorithm Identified!' : 'Incorrect Choice'}
                    </h4>
                    <p className="text-[11px] opacity-80">
                      {submissionOutcome.isCorrect
                        ? `You earned +${submissionOutcome.pointsEarned} points${submissionOutcome.penalty > 0 ? ` (deducted ${submissionOutcome.penalty} hint penalty)` : ''}.`
                        : 'Review the optimal pattern and asymptotic bounds below to learn the concept.'}
                    </p>
                  </div>
                </div>

                <span className="text-xs font-extrabold px-3 py-1 rounded-xl bg-white/80 dark:bg-slate-900/80 shadow-xs shrink-0">
                  {submissionOutcome.isCorrect ? `+${submissionOutcome.pointsEarned} pts` : '0 pts'}
                </span>
              </div>

              {/* Asymptotic Complexity Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 space-y-0.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Time Complexity</span>
                  <span className="text-xs font-black text-cyan-600 dark:text-cyan-400 font-mono">
                    {currentChallenge.timeComplexity}
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 space-y-0.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Auxiliary Space</span>
                  <span className="text-xs font-black text-indigo-600 dark:text-indigo-400 font-mono">
                    {currentChallenge.spaceComplexity}
                  </span>
                </div>

                <div className="col-span-2 sm:col-span-1 p-3 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 space-y-0.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Design Pattern</span>
                  <span className="text-xs font-bold text-purple-600 dark:text-purple-400">
                    {currentChallenge.pattern}
                  </span>
                </div>
              </div>

              {/* Detailed Technical Explanation */}
              <div className="space-y-1.5 pt-1">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Technical Explanation
                </h4>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                  {currentChallenge.detailedExplanation}
                </p>
              </div>

              {/* Optimal Approach & Common Pitfall */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="p-3 rounded-2xl bg-cyan-50/50 dark:bg-cyan-950/30 border border-cyan-200/60 dark:border-cyan-900/40 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-700 dark:text-cyan-300 flex items-center gap-1">
                    <Check className="w-3 h-3" /> Optimal Approach
                  </span>
                  <p className="text-[11px] text-slate-700 dark:text-slate-300">
                    {currentChallenge.optimalApproach}
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-amber-50/50 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/40 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> Common Trap
                  </span>
                  <p className="text-[11px] text-slate-700 dark:text-slate-300">
                    {currentChallenge.commonPitfall}
                  </p>
                </div>
              </div>

              {/* Interview Tip */}
              {currentChallenge.interviewTip && (
                <div className="p-3 rounded-2xl bg-indigo-50/40 dark:bg-indigo-950/30 border border-indigo-200/50 dark:border-indigo-900/40 flex items-start gap-2.5">
                  <Sparkles className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                  <div className="text-[11px] text-indigo-900 dark:text-indigo-200">
                    <strong className="font-bold">Placement Tip:</strong> {currentChallenge.interviewTip}
                  </div>
                </div>
              )}

            </div>
          )}

        </div>

      </div>

      {/* Exit Confirmation Modal */}
      {showExitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 max-w-sm w-full space-y-4 shadow-2xl animate-scaleUp">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 dark:bg-rose-950/60 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Exit Algorithm Rush?
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Your current session progress will be lost. Are you sure you want to return to the Games Hub?
              </p>
            </div>
            <div className="flex items-center space-x-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowExitModal(false);
                  onExitToArena();
                }}
                className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-colors"
              >
                Yes, Exit
              </button>
              <button
                type="button"
                onClick={() => setShowExitModal(false)}
                className="flex-1 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                Keep Playing
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
