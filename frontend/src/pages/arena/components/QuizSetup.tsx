import React, { useState } from 'react';
import {
  Code2,
  Clock,
  BookOpen,
  Zap,
  ShieldCheck,
  ChevronRight,
  ArrowLeft,
  Sparkles,
  Target,
  Sliders,
  Check
} from 'lucide-react';
import { QuizConfig, QuizDifficulty, QuizTopic, QuizMode } from '../types/quiz';

interface QuizSetupProps {
  onStartQuiz: (config: QuizConfig) => void;
  onBackToArena: () => void;
  initialTopic?: QuizTopic;
  isDaily?: boolean;
}

const TOPICS: { id: QuizTopic; label: string; icon: string; count: number }[] = [
  { id: 'Mixed Topics', label: 'Mixed Topics (All Domains)', icon: '🌐', count: 45 },
  { id: 'Programming Fundamentals', label: 'Programming Fundamentals', icon: '💻', count: 6 },
  { id: 'Object-Oriented Programming', label: 'Object-Oriented Programming', icon: '🧩', count: 6 },
  { id: 'Data Structures and Algorithms', label: 'Data Structures & Algorithms', icon: '⚡', count: 7 },
  { id: 'Database Management Systems', label: 'Database Systems (DBMS)', icon: '🗄️', count: 6 },
  { id: 'Operating Systems', label: 'Operating Systems (OS)', icon: '⚙️', count: 7 },
  { id: 'Computer Networks', label: 'Computer Networks (CN)', icon: '📡', count: 7 },
  { id: 'Software Engineering', label: 'Software Engineering & Git', icon: '🛠️', count: 6 }
];

const DIFFICULTIES: { id: QuizDifficulty; label: string; desc: string; badgeColor: string }[] = [
  { id: 'Mixed', label: 'Mixed Difficulty', desc: 'Balanced distribution across all levels', badgeColor: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300' },
  { id: 'Beginner', label: 'Beginner', desc: 'Foundational syntax, definitions & concepts (10 pts/q)', badgeColor: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' },
  { id: 'Intermediate', label: 'Intermediate', desc: 'Standard campus placement interview questions (20 pts/q)', badgeColor: 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300' },
  { id: 'Advanced', label: 'Advanced', desc: 'Tricky edge cases, internals & deep architecture (30 pts/q)', badgeColor: 'bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300' }
];

export const QuizSetup: React.FC<QuizSetupProps> = ({
  onStartQuiz,
  onBackToArena,
  initialTopic = 'Mixed Topics',
  isDaily = false
}) => {
  const [topic, setTopic] = useState<QuizTopic>(initialTopic);
  const [difficulty, setDifficulty] = useState<QuizDifficulty>('Mixed');
  const [questionCount, setQuestionCount] = useState<5 | 10 | 15>(10);
  const [mode, setMode] = useState<QuizMode>('Timed');

  const handleStart = () => {
    onStartQuiz({
      topic,
      difficulty,
      questionCount,
      mode,
      isDailyChallenge: isDaily
    });
  };

  const estimatedMinutes = Math.ceil(
    questionCount * (mode === 'Timed' ? 1.0 : 1.5)
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Breadcrumb / Return */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToArena}
          className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Tech Arena</span>
        </button>

        <div className="flex items-center space-x-2 text-xs font-semibold px-3 py-1 rounded-full bg-brand-50 text-brand-700 dark:bg-brand-950/80 dark:text-brand-300 border border-brand-200/60 dark:border-brand-800/40">
          <Sparkles className="w-3.5 h-3.5 text-brand-500" />
          <span>Software Engineer Placement Training</span>
        </div>
      </div>

      {/* Hero Header */}
      <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs relative overflow-hidden">
        <div className="relative z-10 space-y-3">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-brand-500/25">
              <Code2 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Code Quiz Arena
              </h1>
              <p className="text-xs text-brand-600 dark:text-brand-400 font-medium italic">
                Think fast. Code smart. Prove your fundamentals.
              </p>
            </div>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
            Configure your technical challenge session below. Test your readiness in core CS subjects, earn XP, and practice under real campus assessment constraints.
          </p>
        </div>
      </div>

      {/* Configuration Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Step 1: Topic Selection */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-brand-600" />
              1. Select Topic
            </h2>
            <span className="text-[11px] font-semibold text-slate-400">
              8 Available Options
            </span>
          </div>

          <div className="space-y-2 max-h-72 overflow-y-auto pr-1 scrollbar-thin">
            {TOPICS.map((t) => {
              const isSelected = topic === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setTopic(t.id)}
                  className={`w-full text-left p-3 rounded-xl border text-xs font-semibold transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-brand-50/80 dark:bg-brand-950/50 border-brand-500 text-brand-900 dark:text-brand-200 shadow-xs'
                      : 'bg-slate-50/60 dark:bg-slate-850 border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center space-x-2.5 truncate">
                    <span className="text-base">{t.icon}</span>
                    <span className="truncate">{t.label}</span>
                  </div>
                  {isSelected && (
                    <div className="w-4 h-4 rounded-full bg-brand-600 text-white flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Difficulty, Question Count & Game Mode */}
        <div className="space-y-6">
          
          {/* Step 2: Difficulty */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Target className="w-4 h-4 text-indigo-600" />
              2. Target Difficulty
            </h2>

            <div className="grid grid-cols-2 gap-2">
              {DIFFICULTIES.map((d) => {
                const isSelected = difficulty === d.id;
                return (
                  <button
                    key={d.id}
                    onClick={() => setDifficulty(d.id)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-indigo-50/80 dark:bg-indigo-950/50 border-indigo-500 shadow-xs'
                        : 'bg-slate-50/60 dark:bg-slate-850 border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        {d.label}
                      </span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                    </div>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-snug">
                      {d.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 3: Question Count & Mode */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="grid grid-cols-2 gap-4">
              
              {/* Question Count */}
              <div>
                <label className="text-xs font-bold text-slate-900 dark:text-white block mb-2">
                  Questions
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {([5, 10, 15] as const).map((count) => (
                    <button
                      key={count}
                      onClick={() => setQuestionCount(count)}
                      className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                        questionCount === count
                          ? 'bg-brand-600 text-white border-brand-600 shadow-xs'
                          : 'bg-slate-50 dark:bg-slate-850 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                      }`}
                    >
                      {count} Qs
                    </button>
                  ))}
                </div>
              </div>

              {/* Mode Selection */}
              <div>
                <label className="text-xs font-bold text-slate-900 dark:text-white block mb-2">
                  Session Mode
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {(['Practice', 'Timed'] as const).map((m) => (
                    <button
                      key={m}
                      onClick={() => setMode(m)}
                      className={`py-2 px-1 rounded-xl text-xs font-bold transition-all border flex items-center justify-center space-x-1 ${
                        mode === m
                          ? 'bg-brand-600 text-white border-brand-600 shadow-xs'
                          : 'bg-slate-50 dark:bg-slate-850 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                      }`}
                    >
                      {m === 'Timed' ? <Clock className="w-3 h-3" /> : <BookOpen className="w-3 h-3" />}
                      <span>{m}</span>
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Mode Guidance note */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850/80 border border-slate-200/60 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400">
              {mode === 'Timed' ? (
                <div className="flex items-center space-x-2">
                  <Zap className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>
                    <strong>Timed Mode:</strong> 60 seconds per question with countdown pressure. Evaluated on finish or timeout. Extra XP for high accuracy!
                  </span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>
                    <strong>Practice Mode:</strong> No clock pressure. You can check immediate answers and read code explanations as you learn.
                  </span>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>

      {/* Summary Footer & Launch Bar */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
            <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
              {topic}
            </span>
            <span>•</span>
            <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
              {difficulty}
            </span>
            <span>•</span>
            <span>{questionCount} Questions</span>
            <span>•</span>
            <span className="text-brand-600 dark:text-brand-400">~{estimatedMinutes} mins</span>
          </div>
          <p className="text-[11px] text-slate-400">
            All questions feature real-world placement explanations and code snippets.
          </p>
        </div>

        <button
          onClick={handleStart}
          className="w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-brand-500/25 hover:shadow-lg transition-all flex items-center justify-center space-x-2 shrink-0"
        >
          <span>Start Challenge</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
