import React, { useState, useEffect, useRef } from 'react';
import {
  Bug,
  Clock,
  Zap,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Lightbulb,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Sparkles,
  Play,
  Terminal,
  ShieldCheck,
  Check,
  HelpCircle,
  Code2,
  FileCode,
  Layers,
  ChevronRight,
  Compass,
  Search,
  Wrench,
  Target
} from 'lucide-react';
import {
  BugChallenge,
  BugHunterConfig,
  BugAttemptRecord,
  BugFixOption,
  BugTestCase
} from '../../types/bugHunter';

interface BugHunterWorkspaceProps {
  config: BugHunterConfig;
  challenges: BugChallenge[];
  onCompleteSession: (attempts: BugAttemptRecord[], totalTimeSeconds: number) => void;
  onExitToArena: () => void;
}

export const BugHunterWorkspace: React.FC<BugHunterWorkspaceProps> = ({
  config,
  challenges,
  onCompleteSession,
  onExitToArena
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [attempts, setAttempts] = useState<BugAttemptRecord[]>([]);

  // Challenge active state
  const [selectedLine, setSelectedLine] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedDiagnosisIndex, setSelectedDiagnosisIndex] = useState<number | null>(null);
  const [selectedFixId, setSelectedFixId] = useState<string | null>(null);
  const [selectedTestCaseId, setSelectedTestCaseId] = useState<string | null>(null);

  // Active code preview tab for Fix the Code mode
  const [codeTab, setCodeTab] = useState<'faulty' | 'preview'>('faulty');

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

  // Modals
  const [showExitModal, setShowExitModal] = useState(false);

  // Timers
  const isSprintMode = config.mode === 'sprint';
  const initialTimeLimit = isSprintMode ? 75 : (challenges[currentIndex]?.timeLimitSeconds || 90);
  const [timeRemaining, setTimeRemaining] = useState<number>(initialTimeLimit);
  const [totalElapsedTime, setTotalElapsedTime] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const currentChallenge: BugChallenge | undefined = challenges[currentIndex] || challenges[0];

  // Reset challenge-specific input states when moving to next challenge
  const resetChallengeState = () => {
    setSelectedLine(null);
    setSelectedCategory(null);
    setSelectedDiagnosisIndex(null);
    setSelectedFixId(null);
    setSelectedTestCaseId(null);
    setCodeTab('faulty');
    setHintsRevealed(0);
    setConfirmHintLevel(null);
    setIsSubmitted(false);
    setSubmissionOutcome(null);
    if (isSprintMode) {
      setTimeRemaining(75);
    }
  };

  // Setup timer
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTotalElapsedTime(prev => prev + 1);

      if (isSprintMode) {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            // Auto submit on time out if not yet submitted
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
  }, [currentIndex, isSprintMode, isSubmitted]);

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

    let isCorrect = false;

    if (config.mode === 'find-bug') {
      const lineCorrect = selectedLine === currentChallenge.faultyLineNumber;
      const categoryCorrect = selectedCategory === currentChallenge.category;
      const diagnosisCorrect =
        selectedDiagnosisIndex !== null &&
        currentChallenge.bugOptions[selectedDiagnosisIndex]?.isCorrect;
      
      // Correct if user located line and chose correct diagnosis or category
      isCorrect = (lineCorrect && (categoryCorrect || diagnosisCorrect)) || (diagnosisCorrect && categoryCorrect);
    } else if (config.mode === 'fix-code' || config.mode === 'sprint') {
      const fix = currentChallenge.fixOptions.find(f => f.id === selectedFixId);
      isCorrect = fix?.isCorrect || false;
    } else if (config.mode === 'test-detective') {
      isCorrect = selectedTestCaseId === currentChallenge.exposingTestCaseId;
    }

    // Compute hint penalties
    let penalty = 0;
    for (let i = 0; i < hintsRevealed; i++) {
      penalty += currentChallenge.hints[i]?.penalty || 0;
    }

    let pointsEarned = 0;
    if (isCorrect && !isTimeout) {
      pointsEarned = Math.max(0, currentChallenge.points - penalty);
    }

    const outcome = {
      isCorrect,
      pointsEarned,
      penalty
    };

    setSubmissionOutcome(outcome);
    setIsSubmitted(true);

    const attemptRecord: BugAttemptRecord = {
      challengeId: currentChallenge.id,
      selectedLine,
      selectedCategory,
      selectedDiagnosisIndex,
      selectedFixId,
      selectedTestCaseId,
      isCorrect,
      hintsUsed: hintsRevealed,
      hintsPenalty: penalty,
      pointsEarned,
      maxPoints: currentChallenge.points,
      timeSpentSeconds: initialTimeLimit - timeRemaining
    };

    setAttempts(prev => [...prev.filter(a => a.challengeId !== currentChallenge.id), attemptRecord]);
  };

  // Next Challenge or Finish Session
  const handleNextChallenge = () => {
    if (currentIndex < challenges.length - 1) {
      setCurrentIndex(prev => prev + 1);
      resetChallengeState();
    } else {
      // Completed all challenges
      if (timerRef.current) clearInterval(timerRef.current);
      onCompleteSession(attempts, totalElapsedTime);
    }
  };

  // Safe guard: if currentChallenge is not ready, show clean fallback UI
  if (!currentChallenge) {
    return (
      <div className="max-w-xl mx-auto p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4 my-12 animate-fadeIn">
        <Bug className="w-12 h-12 text-amber-500 mx-auto" />
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          Preparing Challenges...
        </h3>
        <p className="text-xs text-slate-500">
          Loading debugging workspace...
        </p>
        <button
          onClick={onExitToArena}
          className="px-5 py-2.5 rounded-xl bg-brand-600 text-white font-bold text-xs"
        >
          Return to Games Hub
        </button>
      </div>
    );
  }

  // Compute live current total score
  const totalScoreSoFar = attempts.reduce((acc, a) => acc + a.pointsEarned, 0);

  // Split code into lines for interactive line selector
  const codeLines = (currentChallenge.faultyCode || '').split('\n');

  // Currently selected fix preview
  const selectedFix = currentChallenge.fixOptions?.find(f => f.id === selectedFixId);

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fadeIn">
      
      {/* TOP HUD BAR */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Left: Game Title, Badge & Progress */}
        <div className="flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold shrink-0">
            <Bug className="w-5 h-5" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                Bug Hunter
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border border-amber-200/60 uppercase">
                {config.mode === 'find-bug' && 'Mode: Find the Bug'}
                {config.mode === 'fix-code' && 'Mode: Fix the Code'}
                {config.mode === 'test-detective' && 'Mode: Test Detective'}
                {config.mode === 'sprint' && 'Mode: Timed Sprint'}
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
              <span>Challenge {currentIndex + 1} of {challenges.length}</span>
              <span>•</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">{currentChallenge.language}</span>
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
              className="h-full bg-gradient-to-r from-amber-500 to-brand-600 transition-all duration-300"
              style={{ width: `${((currentIndex + (isSubmitted ? 1 : 0)) / challenges.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Right: Score, Timer & Exit */}
        <div className="flex items-center space-x-3 shrink-0">
          
          {/* Live Score */}
          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200/80 dark:border-amber-900/60 text-amber-700 dark:text-amber-300">
            <Zap className="w-4 h-4 fill-amber-400 text-amber-500" />
            <span className="text-xs font-black">{totalScoreSoFar} pts</span>
          </div>

          {/* Sprint Countdown Timer */}
          {isSprintMode && (
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
        
        {/* LEFT / TOP: PROBLEM PANEL (5 cols on large) */}
        <div className="lg:col-span-5 space-y-4">
          
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 space-y-5 shadow-xs">
            
            {/* Header info */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  {currentChallenge.category}
                </span>

                <span className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
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
                Problem Context
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {currentChallenge.problemStatement}
              </p>
            </div>

            {/* Expected vs Actual Behavior */}
            <div className="grid grid-cols-1 gap-2.5 pt-1">
              
              <div className="p-3 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-900/40 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Expected Behavior
                </span>
                <p className="text-xs text-slate-700 dark:text-slate-300">
                  {currentChallenge.expectedBehavior}
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-rose-50/60 dark:bg-rose-950/30 border border-rose-200/60 dark:border-rose-900/40 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> Actual Behavior / Symptom
                </span>
                <p className="text-xs text-slate-700 dark:text-slate-300">
                  {currentChallenge.actualBehavior}
                </p>
              </div>

            </div>

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

        {/* RIGHT / MAIN: CODE & DEBUG CONTROLS (7 cols on large) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* CODE EDITOR PANEL */}
          <div className="bg-slate-900 text-slate-100 rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
            
            {/* Code Header Bar */}
            <div className="px-4 py-3 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                </div>
                <span className="text-[11px] font-mono font-semibold text-slate-400 pl-2">
                  solution.{currentChallenge.language.toLowerCase() === 'python' ? 'py' : currentChallenge.language.toLowerCase() === 'java' ? 'java' : currentChallenge.language.toLowerCase() === 'c++' ? 'cpp' : 'js'}
                </span>
              </div>

              {/* Tab Switcher if in Fix the Code mode */}
              {config.mode === 'fix-code' && selectedFix && (
                <div className="flex items-center p-0.5 rounded-lg bg-slate-800 text-[10px] font-bold">
                  <button
                    onClick={() => setCodeTab('faulty')}
                    className={`px-2 py-0.5 rounded-md transition-all ${
                      codeTab === 'faulty' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Original Faulty
                  </button>
                  <button
                    onClick={() => setCodeTab('preview')}
                    className={`px-2 py-0.5 rounded-md transition-all ${
                      codeTab === 'preview' ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Fix Preview
                  </button>
                </div>
              )}

              {config.mode === 'find-bug' && (
                <span className="text-[10px] font-semibold text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded-md border border-amber-800/60">
                  {selectedLine ? `Line ${selectedLine} Selected` : 'Click a line to select bug'}
                </span>
              )}
            </div>

            {/* Code Body */}
            <div className="p-4 font-mono text-xs overflow-x-auto leading-relaxed select-none">
              {codeTab === 'preview' && selectedFix ? (
                <div className="space-y-1">
                  <div className="text-[11px] text-emerald-400 font-sans font-semibold mb-2 flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5" />
                    Previewing selected patch:
                  </div>
                  <pre className="text-emerald-300 font-mono text-xs whitespace-pre-wrap bg-emerald-950/30 p-3 rounded-xl border border-emerald-900/50">
                    {selectedFix.codeSnippet}
                  </pre>
                  <p className="text-[11px] text-slate-400 font-sans pt-1">
                    {selectedFix.explanation}
                  </p>
                </div>
              ) : (
                <div className="space-y-0.5">
                  {codeLines.map((line, idx) => {
                    const lineNum = idx + 1;
                    const isSelected = selectedLine === lineNum;
                    const isKnownBuggy = isSubmitted && lineNum === currentChallenge.faultyLineNumber;

                    return (
                      <div
                        key={lineNum}
                        onClick={() => {
                          if (!isSubmitted && config.mode === 'find-bug') {
                            setSelectedLine(lineNum);
                          }
                        }}
                        className={`flex items-start group rounded-md px-2 py-0.5 transition-colors ${
                          config.mode === 'find-bug' && !isSubmitted ? 'cursor-pointer' : ''
                        } ${
                          isSelected
                            ? 'bg-amber-500/20 text-amber-200 border-l-2 border-amber-400 font-bold'
                            : isKnownBuggy
                            ? 'bg-rose-500/20 text-rose-200 border-l-2 border-rose-500'
                            : 'hover:bg-slate-800/60'
                        }`}
                      >
                        <span className={`w-8 select-none text-[11px] text-right pr-3 shrink-0 ${
                          isSelected ? 'text-amber-400 font-bold' : 'text-slate-600 group-hover:text-slate-400'
                        }`}>
                          {lineNum}
                        </span>
                        <span className="whitespace-pre flex-1 text-slate-200">
                          {line || ' '}
                        </span>
                        {config.mode === 'find-bug' && !isSubmitted && isSelected && (
                          <span className="text-[9px] font-sans font-bold px-1.5 py-0.2 rounded bg-amber-500 text-slate-950 ml-2">
                            FAULTY
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>

          {/* CONTROLS AREA BY MODE */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 space-y-5 shadow-xs">
            
            {/* MODE A: FIND THE BUG CONTROLS */}
            {config.mode === 'find-bug' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <Search className="w-3.5 h-3.5 text-brand-600" />
                    Identify the Bug
                  </h3>
                  {selectedLine && (
                    <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                      Line {selectedLine} Marked
                    </span>
                  )}
                </div>

                {/* Bug Category Selector */}
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                    Step 1: Select Bug Category
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {(['Logic', 'Runtime', 'Edge Cases', 'Algorithms', 'Syntax'] as const).map((cat) => {
                      const isCatSelected = selectedCategory === cat;
                      return (
                        <button
                          key={cat}
                          type="button"
                          disabled={isSubmitted}
                          onClick={() => setSelectedCategory(cat)}
                          className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all text-left ${
                            isCatSelected
                              ? 'border-brand-600 bg-brand-600 text-white font-bold shadow-xs'
                              : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          {cat}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Explanation / Diagnosis Selector */}
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                    Step 2: Select the Root Cause Diagnosis
                  </label>
                  <div className="space-y-2">
                    {currentChallenge.bugOptions.map((opt, idx) => {
                      const isOptionSelected = selectedDiagnosisIndex === idx;
                      return (
                        <div
                          key={idx}
                          onClick={() => !isSubmitted && setSelectedDiagnosisIndex(idx)}
                          className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-start space-x-3 ${
                            isOptionSelected
                              ? 'border-brand-600 bg-brand-50/60 dark:bg-brand-950/40 ring-1 ring-brand-500'
                              : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                          }`}
                        >
                          <div className={`w-4 h-4 rounded-full border mt-0.5 flex items-center justify-center shrink-0 ${
                            isOptionSelected ? 'border-brand-600 bg-brand-600 text-white' : 'border-slate-300 dark:border-slate-700'
                          }`}>
                            {isOptionSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                          </div>
                          <div className="space-y-0.5">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                              {opt.category}
                            </span>
                            <p className="text-xs text-slate-700 dark:text-slate-300 leading-normal">
                              {opt.explanation}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            )}

            {/* MODE B & D: FIX THE CODE / SPRINT CONTROLS */}
            {(config.mode === 'fix-code' || config.mode === 'sprint') && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <Wrench className="w-3.5 h-3.5 text-brand-600" />
                    Select the Correct Fix
                  </h3>
                  <span className="text-[10px] text-slate-400">
                    Inspect patch options below
                  </span>
                </div>

                <div className="space-y-3">
                  {currentChallenge.fixOptions.map((fix) => {
                    const isFixSelected = selectedFixId === fix.id;

                    return (
                      <div
                        key={fix.id}
                        onClick={() => {
                          if (!isSubmitted) {
                            setSelectedFixId(fix.id);
                            setCodeTab('preview');
                          }
                        }}
                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                          isFixSelected
                            ? 'border-brand-600 bg-brand-50/60 dark:bg-brand-950/40 ring-1 ring-brand-500'
                            : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                              isFixSelected ? 'border-brand-600 bg-brand-600 text-white' : 'border-slate-300 dark:border-slate-700'
                            }`}>
                              {isFixSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                            </div>
                            <span className="text-xs font-bold text-slate-900 dark:text-white">
                              Patch {fix.id.toUpperCase()}
                            </span>
                          </div>

                          <span className="text-[10px] font-mono text-slate-400">
                            {fix.diffSummary || 'Code replacement'}
                          </span>
                        </div>

                        <pre className="p-2.5 rounded-xl bg-slate-900 text-emerald-300 font-mono text-xs whitespace-pre-wrap">
                          {fix.codeSnippet}
                        </pre>

                        <p className="text-[11px] text-slate-600 dark:text-slate-400">
                          {fix.explanation}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* MODE C: TEST CASE DETECTIVE CONTROLS */}
            {config.mode === 'test-detective' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <Target className="w-3.5 h-3.5 text-brand-600" />
                    Find the Exposing Test Case
                  </h3>
                  <span className="text-[10px] text-slate-400">
                    Which input causes the bug to surface?
                  </span>
                </div>

                <div className="space-y-3">
                  {currentChallenge.testCases.map((tc) => {
                    const isSelected = selectedTestCaseId === tc.id;

                    return (
                      <div
                        key={tc.id}
                        onClick={() => !isSubmitted && setSelectedTestCaseId(tc.id)}
                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                          isSelected
                            ? 'border-brand-600 bg-brand-50/60 dark:bg-brand-950/40 ring-1 ring-brand-500'
                            : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                              isSelected ? 'border-brand-600 bg-brand-600 text-white' : 'border-slate-300 dark:border-slate-700'
                            }`}>
                              {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                            </div>
                            <span className="text-xs font-bold text-slate-900 dark:text-white">
                              {tc.name}
                            </span>
                          </div>

                          <span className="text-[10px] font-semibold text-slate-400">
                            {tc.id}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                          <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700">
                            <span className="text-[10px] font-sans font-bold text-slate-400 block">Input:</span>
                            <span className="text-slate-800 dark:text-slate-200">{tc.input}</span>
                          </div>
                          <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700">
                            <span className="text-[10px] font-sans font-bold text-slate-400 block">Expected:</span>
                            <span className="text-emerald-600 dark:text-emerald-400 font-bold">{tc.expectedOutput}</span>
                          </div>
                        </div>

                        <p className="text-[11px] text-slate-500">
                          {tc.explanation}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ACTION BUTTONS (SUBMIT & NEXT) */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100 dark:border-slate-800">
              <div className="text-xs text-slate-500">
                {isSubmitted ? (
                  <span className="font-bold text-slate-700 dark:text-slate-300">
                    Challenge evaluated. Review test breakdown below.
                  </span>
                ) : (
                  <span>Select your answer and submit to run verification.</span>
                )}
              </div>

              <div className="flex items-center space-x-2.5 w-full sm:w-auto">
                {!isSubmitted ? (
                  <button
                    onClick={() => executeSubmission(false)}
                    disabled={
                      (config.mode === 'find-bug' && (!selectedLine || selectedDiagnosisIndex === null)) ||
                      ((config.mode === 'fix-code' || config.mode === 'sprint') && !selectedFixId) ||
                      (config.mode === 'test-detective' && !selectedTestCaseId)
                    }
                    className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-brand-600 hover:from-amber-600 hover:to-brand-700 text-white font-bold text-xs shadow-md shadow-brand-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-1.5"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>Run Verification & Submit</span>
                  </button>
                ) : (
                  <button
                    onClick={handleNextChallenge}
                    className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-500/20 transition-all flex items-center justify-center space-x-1.5"
                  >
                    <span>
                      {currentIndex < challenges.length - 1 ? 'Next Challenge' : 'Complete Session'}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

          </div>

          {/* POST-SUBMISSION FEEDBACK & HONEST PREDEFINED TEST RUNNER */}
          {isSubmitted && submissionOutcome && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 space-y-5 animate-fadeIn">
              
              {/* Status Banner */}
              <div className={`p-4 rounded-2xl border flex items-start space-x-3.5 ${
                submissionOutcome.isCorrect
                  ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-100'
                  : 'bg-rose-50/80 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-100'
              }`}>
                {submissionOutcome.isCorrect ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
                )}

                <div className="space-y-1 flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-extrabold">
                      {submissionOutcome.isCorrect ? 'Correct Diagnosis & Solution!' : 'Incorrect Diagnosis'}
                    </h4>
                    <span className="text-xs font-black">
                      +{submissionOutcome.pointsEarned} Points
                      {submissionOutcome.penalty > 0 && (
                        <span className="text-[10px] font-normal opacity-80 pl-1">
                          (-{submissionOutcome.penalty} hint penalty)
                        </span>
                      )}
                    </span>
                  </div>

                  <p className="text-xs leading-relaxed opacity-90">
                    {currentChallenge.correctDiagnosis}
                  </p>
                </div>
              </div>

              {/* Explanations */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 block">
                    Why the Original Code Failed
                  </span>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                    {currentChallenge.whyOriginalFailed}
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block">
                    Why the Fix Works
                  </span>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                    {currentChallenge.whyFixWorks}
                  </p>
                </div>
              </div>

              {/* PREDEFINED TEST RUNNER CONSOLE */}
              <div className="bg-slate-950 text-slate-100 rounded-2xl border border-slate-800 overflow-hidden font-mono text-xs">
                
                <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-slate-400 text-[11px]">
                    <Terminal className="w-3.5 h-3.5 text-brand-400" />
                    <span>Deterministic Test Runner [Simulated Environment]</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-sans">
                    3/3 Predefined Test Cases
                  </span>
                </div>

                <div className="p-4 space-y-3">
                  {currentChallenge.testCases.map((tc, idx) => {
                    // If challenge was solved correctly, tests pass. If not, exposing test case fails.
                    const testPassed = submissionOutcome.isCorrect || !tc.exposesBug;

                    return (
                      <div key={tc.id} className="border-b border-slate-800/80 pb-2.5 last:border-0 last:pb-0">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-slate-300 font-bold">
                            Test #{idx + 1}: {tc.name}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            testPassed
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/50'
                              : 'bg-rose-950 text-rose-400 border border-rose-800/50'
                          }`}>
                            {testPassed ? 'PASS' : 'FAIL'}
                          </span>
                        </div>

                        <div className="mt-1 text-[11px] text-slate-400 space-y-0.5">
                          <div>Input: <span className="text-slate-200">{tc.input}</span></div>
                          <div>Expected: <span className="text-emerald-400">{tc.expectedOutput}</span></div>
                          {!testPassed && (
                            <div>Actual with Bug: <span className="text-rose-400">{tc.actualWithBug}</span></div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

              </div>

              {/* Interview Takeaway Tip */}
              <div className="p-3.5 rounded-2xl bg-brand-50/60 dark:bg-brand-950/40 border border-brand-200/60 dark:border-brand-900/40 text-xs flex items-start space-x-2.5">
                <Sparkles className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold text-slate-900 dark:text-white">Placement Interview Insight: </strong>
                  <span className="text-slate-600 dark:text-slate-300">{currentChallenge.interviewTip}</span>
                </div>
              </div>

            </div>
          )}

        </div>

      </div>

      {/* EXIT CONFIRMATION MODAL */}
      {showExitModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-sm w-full p-6 space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 dark:bg-rose-950 dark:text-rose-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Exit Bug Hunter Session?
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Your current session progress and points will be discarded if you leave early.
              </p>
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <button
                onClick={() => setShowExitModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                Keep Playing
              </button>

              <button
                onClick={onExitToArena}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md shadow-rose-600/20"
              >
                Exit to Games Hub
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
