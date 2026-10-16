import React from 'react';
import { Sparkles, Calendar, Zap, ArrowRight, Trophy } from 'lucide-react';
import { QuizConfig } from '../types/quiz';

interface DailyChallengeCardProps {
  onStartDaily: (config: QuizConfig) => void;
}

export const DailyChallengeCard: React.FC<DailyChallengeCardProps> = ({ onStartDaily }) => {
  const today = new Date();
  const dateFormatted = today.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const handleLaunch = () => {
    onStartDaily({
      topic: 'Mixed Topics',
      difficulty: 'Mixed',
      questionCount: 5,
      mode: 'Timed',
      isDailyChallenge: true
    });
  };

  return (
    <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-900 via-slate-900 to-brand-950 text-white border border-indigo-500/20 shadow-lg relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
      
      {/* Background radial glow */}
      <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-brand-500/15 rounded-full blur-2xl pointer-events-none" />

      <div className="space-y-2 relative z-10">
        <div className="flex items-center space-x-2">
          <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-[10px] font-bold text-indigo-300 flex items-center gap-1">
            <Calendar className="w-3 h-3 text-indigo-300" />
            Daily Placement Sprint • {dateFormatted}
          </span>
          <span className="px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-300 text-[10px] font-bold">
            +150 XP Potential
          </span>
        </div>

        <h3 className="text-lg md:text-xl font-bold tracking-tight text-white flex items-center gap-2">
          <span>Today's 5-Question CS Core Sprint</span>
        </h3>

        <p className="text-xs text-indigo-200/80 max-w-xl leading-relaxed">
          Curated daily mixed-topic assessment (Algorithms, OS, DBMS, Networks). Boost your campus standing and maintain your daily streak.
        </p>
      </div>

      <div className="relative z-10 shrink-0 w-full sm:w-auto">
        <button
          onClick={handleLaunch}
          className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-white text-indigo-950 hover:bg-indigo-50 font-extrabold text-xs shadow-md transition-all flex items-center justify-center space-x-2"
        >
          <span>Launch Daily Sprint</span>
          <ArrowRight className="w-4 h-4 text-indigo-600" />
        </button>
      </div>

    </div>
  );
};
