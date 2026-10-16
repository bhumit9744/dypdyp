import React, { useState, useEffect, useRef } from 'react';
import {
  Briefcase,
  Users,
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
  Award,
  Terminal,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  FileText,
  MessageSquare
} from 'lucide-react';
import {
  HRQuestion,
  HRConfig,
  HRQuestionAttempt,
  HRScoreDimension,
  HROption
} from '../../types/hrInterview';
import { evaluateTypedResponse } from '../../utils/hrInterviewStorage';

interface HRInterviewWorkspaceProps {
  config: HRConfig;
  questions: HRQuestion[];
  onFinishSession: (attempts: HRQuestionAttempt[], totalTimeSeconds: number) => void;
  onExitSession: () => void;
}

export const HRInterviewWorkspace: React.FC<HRInterviewWorkspaceProps> = ({
  config,
  questions,
  onFinishSession,
  onExitSession
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [attempts, setAttempts] = useState<HRQuestionAttempt[]>([]);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [typedAnswer, setTypedAnswer] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [showStarHelper, setShowStarHelper] = useState<boolean>(false);
  const [currentAttempt, setCurrentAttempt] = useState<HRQuestionAttempt | null>(null);

  const isTimed = config.isTimed ?? config.timedMode ?? false;
  const showHints = config.hintsEnabled ?? config.showHints ?? true;

  // Timers
  const [secondsRemaining, setSecondsRemaining] = useState<number>(() => {
    return config.mode === 'rapid-fire' ? 35 : (isTimed ? 75 : 0);
  });
  const [totalElapsedTime, setTotalElapsedTime] = useState<number>(0);
  const timerRef = useRef<any>(null);
  const questionStartTimeRef = useRef<number>(Date.now());

  const currentQ = questions[currentIndex] || questions[0];
  const isLastQuestion = currentIndex === questions.length - 1;

  const responseType = currentQ.responseType || currentQ.type || 'multiple-choice';
  const scenarioContext = currentQ.scenarioContext || currentQ.context;
  const maxPoints = currentQ.scoring?.maxPoints ?? currentQ.points ?? 5;
  const recruiterIntent = currentQ.explanation?.recruiterIntent || currentQ.interviewerIntent;
  const keyTakeaway = currentQ.explanation?.keyTakeaway || currentQ.idealTakeaway;
  const modelAnswer = currentQ.explanation?.modelAnswer;

  // Initialize per question
  useEffect(() => {
    setSelectedOptionId(null);
    setTypedAnswer('');
    setIsSubmitted(false);
    setShowHint(false);
    setShowStarHelper(false);
    setCurrentAttempt(null);
    questionStartTimeRef.current = Date.now();

    const initialSecs = config.mode === 'rapid-fire' ? 35 : (isTimed ? 75 : 0);
    setSecondsRemaining(initialSecs);
  }, [currentIndex, config.mode, isTimed]);

  // Overall and countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      setTotalElapsedTime((prev) => prev + 1);

      if (isTimed && !isSubmitted) {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            handleTimeExpired();
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);

    timerRef.current = interval;
    return () => clearInterval(interval);
  }, [currentIndex, isSubmitted, isTimed]);

  // Handle countdown expiry safely
  const handleTimeExpired = () => {
    if (isSubmitted) return;
    if (responseType === 'typed') {
      handleSubmitTyped(true);
    } else {
      handleSubmitOption(selectedOptionId || '', true);
    }
  };

  const calculateTimeSpent = () => {
    return Math.max(1, Math.round((Date.now() - questionStartTimeRef.current) / 1000));
  };

  // Submit Multiple Choice
  const handleSubmitOption = (optionId: string, isAutoTimeout = false) => {
    if (isSubmitted) return;
    const timeSpent = calculateTimeSpent();
    const chosenOpt = currentQ.options?.find((o: HROption) => o.id === optionId);

    const score = chosenOpt ? chosenOpt.points : 0;
    const isOptimal = chosenOpt ? (chosenOpt.quality === 'optimal' || !!chosenOpt.isOptimal) : false;

    const dimensions: HRScoreDimension = {
      relevance: score >= 4 ? 5 : (score >= 2 ? 3 : 1),
      structure: score >= 4 ? 5 : 3,
      specificity: score >= 4 ? 5 : 2,
      professionalism: score >= 4 ? 5 : 3,
      reflection: score >= 4 ? 4 : 2
    };

    const feedbackNotes: string[] = [];
    if (chosenOpt) {
      feedbackNotes.push(chosenOpt.critique || chosenOpt.feedback);
    } else if (isAutoTimeout) {
      feedbackNotes.push('Time expired before selecting an answer.');
    }

    const attempt: HRQuestionAttempt = {
      questionId: currentQ.id,
      answerType: 'multiple-choice',
      selectedOptionId: optionId || undefined,
      typedResponse: undefined,
      pointsEarned: score,
      score,
      maxPoints,
      maxScore: maxPoints,
      isOptimal,
      timeSpentSeconds: timeSpent,
      dimensionsAssessed: dimensions,
      strengths: chosenOpt && chosenOpt.points >= 4 ? ['Professional framing', 'Mature workplace perspective'] : [],
      improvements: chosenOpt && chosenOpt.points < 4 ? ['Refine tone to avoid defensive framing', 'Provide clearer professional accountability'] : [],
      feedbackNotes,
      skipped: false
    };

    setCurrentAttempt(attempt);
    setIsSubmitted(true);
    setAttempts((prev) => [...prev, attempt]);
  };

  // Submit Typed Response
  const handleSubmitTyped = (isAutoTimeout = false) => {
    if (isSubmitted) return;
    const timeSpent = calculateTimeSpent();

    if (!typedAnswer.trim() && !isAutoTimeout) {
      return;
    }

    const evalResult = evaluateTypedResponse(currentQ, typedAnswer);

    const attempt: HRQuestionAttempt = {
      questionId: currentQ.id,
      answerType: 'typed',
      selectedOptionId: undefined,
      typedAnswer: typedAnswer.trim(),
      typedResponse: typedAnswer.trim() || (isAutoTimeout ? '(No response submitted before time expired)' : ''),
      pointsEarned: evalResult.score,
      score: evalResult.score,
      maxPoints,
      maxScore: maxPoints,
      isOptimal: evalResult.isOptimal,
      timeSpentSeconds: timeSpent,
      dimensionsAssessed: evalResult.dimensions,
      strengths: evalResult.strengths,
      improvements: evalResult.improvements,
      feedbackNotes: evalResult.feedbackNotes,
      skipped: false
    };

    setCurrentAttempt(attempt);
    setIsSubmitted(true);
    setAttempts((prev) => [...prev, attempt]);
  };

  // Skip question
  const handleSkipQuestion = () => {
    if (isSubmitted) return;
    const timeSpent = calculateTimeSpent();

    const attempt: HRQuestionAttempt = {
      questionId: currentQ.id,
      answerType: responseType,
      pointsEarned: 0,
      score: 0,
      maxPoints,
      maxScore: maxPoints,
      isOptimal: false,
      timeSpentSeconds: timeSpent,
      dimensionsAssessed: {
        relevance: 0,
        structure: 0,
        specificity: 0,
        professionalism: 0,
        reflection: 0
      },
      strengths: [],
      improvements: ['Question was skipped without response.'],
      feedbackNotes: ['Skipped. In real placement interviews, pausing to collect your thoughts is preferred over passing completely.'],
      skipped: true
    };

    setCurrentAttempt(attempt);
    setIsSubmitted(true);
    setAttempts((prev) => [...prev, attempt]);
  };

  // Next Question or Finish
  const handleNext = () => {
    if (isLastQuestion) {
      onFinishSession(attempts, totalElapsedTime);
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handleConfirmExit = () => {
    if (attempts.length > 0 && !isSubmitted) {
      if (window.confirm('You have an interview session in progress. Leaving will discard this attempt. Are you sure?')) {
        onExitSession();
      }
    } else {
      onExitSession();
    }
  };

  const wordCount = typedAnswer.trim() ? typedAnswer.trim().split(/\s+/).length : 0;
  const progressPercent = Math.round(((currentIndex + 1) / questions.length) * 100);

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Top Header & Progress Strip */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <button
              onClick={handleConfirmExit}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Quit Session"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  {config.mode === 'core-interview' && 'Core HR Interview'}
                  {config.mode === 'rapid-fire' && '⚡ Rapid Fire HR'}
                  {config.mode === 'workplace-situations' && 'Workplace Situations'}
                  {config.mode === 'difficult-hr' && '🎯 Difficult HR Round'}
                </span>
                <span className="text-xs text-slate-400 font-medium capitalize">
                  {currentQ.difficulty} Tier
                </span>
              </div>
              <h2 className="text-base font-extrabold text-white mt-0.5">
                Question {currentIndex + 1} of {questions.length}
              </h2>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Category Badge */}
            <span className="hidden sm:inline-flex items-center px-2.5 py-1 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-700">
              {currentQ.category}
            </span>

            {/* Countdown Timer (if timed) */}
            {isTimed && (
              <div
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                  secondsRemaining <= 10
                    ? 'bg-rose-950/80 border-rose-500/50 text-rose-400 animate-pulse'
                    : 'bg-slate-800/80 border-slate-700 text-amber-300'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>{secondsRemaining}s</span>
              </div>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 via-brand-500 to-cyan-400 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Main Question Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        
        {/* Question Header & Context */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-[11px] font-bold text-indigo-400 tracking-wide uppercase flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5" />
              {responseType === 'typed' ? 'Typed Response • STAR Rubric' : 'Multiple Choice Selection'}
            </span>

            {currentQ.recommendedFramework && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-cyan-950 text-cyan-300 border border-cyan-800/60">
                Framework: {currentQ.recommendedFramework}
              </span>
            )}
          </div>

          <h1 className="text-lg sm:text-xl font-bold text-white leading-relaxed">
            {currentQ.question}
          </h1>

          {/* Context box if available */}
          {scenarioContext && (
            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 text-xs sm:text-sm text-slate-300 leading-relaxed">
              <strong className="text-slate-200 block mb-1 font-semibold flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                Scenario Context:
              </strong>
              {scenarioContext}
            </div>
          )}
        </div>

        {/* Optional Hint Toggle */}
        {showHints && currentQ.hint && (
          <div>
            {!showHint ? (
              <button
                onClick={() => setShowHint(true)}
                className="inline-flex items-center space-x-1.5 text-xs font-semibold text-amber-400/90 hover:text-amber-300 hover:underline transition-all cursor-pointer"
              >
                <Lightbulb className="w-3.5 h-3.5" />
                <span>Show Interview Coaching Hint</span>
              </button>
            ) : (
              <div className="p-3.5 rounded-2xl bg-amber-950/40 border border-amber-600/30 text-amber-200/90 text-xs flex items-start gap-2.5">
                <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-semibold block text-amber-300">Coaching Tip:</strong>
                  {currentQ.hint}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Interaction Area: Multiple Choice OR Typed Response */}
        {responseType !== 'typed' && currentQ.options ? (
          <div className="space-y-3 pt-2">
            <span className="text-xs font-semibold text-slate-400 block">
              Select the response that demonstrates the highest professional maturity:
            </span>

            <div className="grid grid-cols-1 gap-3">
              {currentQ.options.map((opt: HROption) => {
                const isSelected = selectedOptionId === opt.id;
                const isOptOptimal = opt.quality === 'optimal' || !!opt.isOptimal;
                let optionStyle = 'border-slate-800 bg-slate-800/50 hover:bg-slate-800 hover:border-slate-700 text-slate-200';

                if (isSubmitted) {
                  if (isOptOptimal) {
                    optionStyle = 'border-emerald-500/80 bg-emerald-950/40 text-emerald-200 shadow-md shadow-emerald-500/10';
                  } else if (isSelected && !isOptOptimal) {
                    optionStyle = 'border-rose-500/80 bg-rose-950/30 text-rose-200';
                  } else {
                    optionStyle = 'border-slate-800/60 bg-slate-800/30 text-slate-400 opacity-60';
                  }
                } else if (isSelected) {
                  optionStyle = 'border-indigo-500 bg-indigo-950/40 text-white shadow-md shadow-indigo-500/10';
                }

                return (
                  <button
                    key={opt.id}
                    disabled={isSubmitted}
                    onClick={() => setSelectedOptionId(opt.id)}
                    className={`p-4 rounded-2xl border text-left transition-all flex items-start gap-3.5 cursor-pointer disabled:cursor-default ${optionStyle}`}
                  >
                    <span
                      className={`w-7 h-7 rounded-xl font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                        isSubmitted
                          ? isOptOptimal
                            ? 'bg-emerald-500 text-white'
                            : isSelected
                            ? 'bg-rose-500 text-white'
                            : 'bg-slate-700 text-slate-400'
                          : isSelected
                          ? 'bg-indigo-500 text-white'
                          : 'bg-slate-700 text-slate-300'
                      }`}
                    >
                      {opt.id.toUpperCase()}
                    </span>
                    <span className="text-xs sm:text-sm font-medium leading-relaxed flex-1">
                      {opt.text}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Submission / Skip Buttons for MCQ */}
            {!isSubmitted && (
              <div className="pt-4 flex items-center justify-between border-t border-slate-800">
                <button
                  onClick={handleSkipQuestion}
                  className="text-xs font-semibold text-slate-400 hover:text-slate-300 transition-colors cursor-pointer"
                >
                  Skip Question
                </button>

                <button
                  disabled={!selectedOptionId}
                  onClick={() => selectedOptionId && handleSubmitOption(selectedOptionId)}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold text-xs shadow-md shadow-indigo-500/20 transition-all flex items-center space-x-2 cursor-pointer disabled:cursor-not-allowed"
                >
                  <span>Lock Answer</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Typed Answer Area */
          <div className="space-y-4 pt-2">
            
            {/* STAR Helper Toggle */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">
                Draft your placement interview response:
              </span>

              <button
                type="button"
                onClick={() => setShowStarHelper(!showStarHelper)}
                className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{showStarHelper ? 'Hide STAR Structure' : 'STAR Method Cheat Sheet'}</span>
                {showStarHelper ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
            </div>

            {/* Collapsible STAR Method Guide */}
            {showStarHelper && (
              <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-800/40 text-xs text-slate-300 space-y-2">
                <span className="font-bold text-cyan-300 block">
                  Recommended STAR Framework:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2 rounded-xl bg-slate-800/60 border border-slate-700/50">
                    <strong className="text-indigo-300">S - Situation:</strong> Context, team size, project setting.
                  </div>
                  <div className="p-2 rounded-xl bg-slate-800/60 border border-slate-700/50">
                    <strong className="text-indigo-300">T - Task:</strong> The specific obstacle or responsibility assigned to you.
                  </div>
                  <div className="p-2 rounded-xl bg-slate-800/60 border border-slate-700/50">
                    <strong className="text-cyan-300">A - Action:</strong> Concrete technical/communication actions YOU took.
                  </div>
                  <div className="p-2 rounded-xl bg-slate-800/60 border border-slate-700/50">
                    <strong className="text-emerald-300">R - Result:</strong> Positive outcome, performance impact, or key learning.
                  </div>
                </div>
              </div>
            )}

            <div className="relative">
              <textarea
                disabled={isSubmitted}
                value={typedAnswer}
                onChange={(e) => setTypedAnswer(e.target.value)}
                placeholder="Type your structured response here... (e.g., In my final year project, our team encountered... I addressed this by...)"
                rows={5}
                className="w-full p-4 rounded-2xl bg-slate-800/60 border border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-white placeholder-slate-500 text-xs sm:text-sm font-normal leading-relaxed resize-y min-h-[130px] disabled:opacity-80"
              />

              <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1 px-1">
                <span>
                  Words: <strong className="text-white">{wordCount}</strong> • Characters: <strong className="text-white">{typedAnswer.length}</strong>
                </span>
                <span className="italic">
                  Target: ~40 to 120 words for clarity
                </span>
              </div>
            </div>

            {/* Submission / Skip Buttons for Typed */}
            {!isSubmitted && (
              <div className="pt-2 flex items-center justify-between border-t border-slate-800">
                <button
                  onClick={handleSkipQuestion}
                  className="text-xs font-semibold text-slate-400 hover:text-slate-300 transition-colors cursor-pointer"
                >
                  Skip Question
                </button>

                <button
                  disabled={!typedAnswer.trim()}
                  onClick={() => handleSubmitTyped(false)}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold text-xs shadow-md shadow-indigo-500/20 transition-all flex items-center space-x-2 cursor-pointer disabled:cursor-not-allowed"
                >
                  <span>Evaluate Response</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Post-Submission Feedback Drawer */}
        {isSubmitted && currentAttempt && (
          <div className="mt-6 pt-6 border-t border-slate-800 space-y-5 animate-in fade-in duration-300">
            
            {/* Score & Rubric Notice Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-800/80 border border-slate-700">
              <div className="flex items-center space-x-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shrink-0 ${
                    currentAttempt.score! >= 4
                      ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/25'
                      : currentAttempt.score! >= 2
                      ? 'bg-amber-500 text-white'
                      : 'bg-rose-500 text-white'
                  }`}
                >
                  {currentAttempt.score}/{currentAttempt.maxScore}
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-extrabold text-white">
                    {currentAttempt.score! >= 4
                      ? '🌟 Optimal Placement Response'
                      : currentAttempt.score! >= 2
                      ? '⚠️ Solid Grounding • Needs Refinement'
                      : '❌ High Risk or Suboptimal Framing'}
                  </h3>
                  <span className="text-[11px] text-slate-400">
                    Transparent rubric evaluation • {currentAttempt.timeSpentSeconds}s elapsed
                  </span>
                </div>
              </div>

              <button
                onClick={handleNext}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-500/25 transition-all flex items-center justify-center space-x-2 cursor-pointer shrink-0"
              >
                <span>{isLastQuestion ? 'View Results Summary' : 'Next Question'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Recruiter Mindset & Intent Card */}
            <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-800/40 space-y-2">
              <div className="flex items-center space-x-2 text-indigo-300 text-xs font-bold">
                <Users className="w-4 h-4 text-indigo-400" />
                <span>What Campus Recruiters Are Evaluating:</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {recruiterIntent}
              </p>
            </div>

            {/* Specific Feedback / Critique */}
            {currentAttempt.feedbackNotes && currentAttempt.feedbackNotes.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-300 block">
                  Evaluation Feedback:
                </span>
                <div className="space-y-1.5">
                  {currentAttempt.feedbackNotes.map((note: string, idx: number) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs text-slate-300 flex items-start gap-2"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <span>{note}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Rubric Dimensions Grid (Relevance, Structure, Specificity, Professionalism, Reflection) */}
            {currentAttempt.dimensionsAssessed && (
              <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/50 space-y-2">
                <span className="text-[11px] uppercase font-bold text-slate-400 block tracking-wider">
                  Rubric Assessment Dimensions (0-5 Scale)
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
                  <div className="p-2 rounded-xl bg-slate-800 border border-slate-700/80">
                    <span className="text-[10px] text-slate-400 block">Relevance</span>
                    <strong className="text-white font-bold text-sm">
                      {currentAttempt.dimensionsAssessed.relevance}/5
                    </strong>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-800 border border-slate-700/80">
                    <span className="text-[10px] text-slate-400 block">Structure</span>
                    <strong className="text-white font-bold text-sm">
                      {currentAttempt.dimensionsAssessed.structure}/5
                    </strong>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-800 border border-slate-700/80">
                    <span className="text-[10px] text-slate-400 block">Specificity</span>
                    <strong className="text-white font-bold text-sm">
                      {currentAttempt.dimensionsAssessed.specificity}/5
                    </strong>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-800 border border-slate-700/80">
                    <span className="text-[10px] text-slate-400 block">Professionalism</span>
                    <strong className="text-white font-bold text-sm">
                      {currentAttempt.dimensionsAssessed.professionalism}/5
                    </strong>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-800 border border-slate-700/80">
                    <span className="text-[10px] text-slate-400 block">Reflection</span>
                    <strong className="text-white font-bold text-sm">
                      {currentAttempt.dimensionsAssessed.reflection}/5
                    </strong>
                  </div>
                </div>
              </div>
            )}

            {/* Model Response / Benchmark for Typed Questions */}
            {responseType === 'typed' && modelAnswer && (
              <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-800/40 space-y-1.5">
                <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5" />
                  Exemplary Placement Benchmark:
                </span>
                <p className="text-xs text-slate-300 italic leading-relaxed">
                  "{modelAnswer}"
                </p>
              </div>
            )}

            {/* Key Actionable Takeaway */}
            <div className="p-3.5 rounded-2xl bg-cyan-950/20 border border-cyan-800/30 text-xs text-cyan-200 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold block text-cyan-300">Key Takeaway for Real Interviews:</strong>
                {keyTakeaway}
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
