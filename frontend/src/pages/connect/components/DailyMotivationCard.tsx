import React, { useState } from 'react';
import { Sparkles, Bookmark, BookmarkCheck, Share2, Check, ArrowRight, Quote } from 'lucide-react';
import { ConnectMotivation } from '../../../types';

interface DailyMotivationCardProps {
  motivation: ConnectMotivation;
  savedQuotes: ConnectMotivation[];
  onToggleSave: (motivation: ConnectMotivation) => void;
  onOpenSavedModal: () => void;
}

export const DailyMotivationCard: React.FC<DailyMotivationCardProps> = ({
  motivation,
  savedQuotes,
  onToggleSave,
  onOpenSavedModal
}) => {
  const isSaved = savedQuotes.some((q) => q.id === motivation.id || q.quote === motivation.quote);
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    const textToCopy = `“${motivation.quote}” — ${motivation.author}\n\nToday's Action: ${motivation.action_today}\n\nVia Placement Hub • Student Connect`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  return (
    <div className="relative rounded-2xl bg-gradient-to-br from-amber-50/90 via-amber-100/40 to-orange-50/60 dark:from-amber-950/20 dark:via-slate-900 dark:to-orange-950/10 border border-amber-200/80 dark:border-amber-900/40 p-5 md:p-6 shadow-xs overflow-hidden transition-all">
      {/* Background Decorative Accent */}
      <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-amber-400/10 dark:bg-amber-400/5 blur-2xl pointer-events-none" />

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative z-10">
        {/* Left Side: Quote, Author, Student Message */}
        <div className="space-y-3 flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-200/60 dark:bg-amber-900/50 text-amber-900 dark:text-amber-300 text-[11px] font-bold tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              Daily Motivation & Discipline
            </span>
            <span className="text-xs text-amber-800/70 dark:text-amber-400/60 font-medium">
              • {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>

          <div className="flex items-start space-x-3">
            <Quote className="w-5 h-5 text-amber-500/70 shrink-0 mt-1 rotate-180" />
            <div className="space-y-1">
              <p className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug tracking-tight font-sans">
                “{motivation.quote}”
              </p>
              <p className="text-xs font-semibold text-amber-800 dark:text-amber-300/90">
                — {motivation.author}
              </p>
            </div>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
            {motivation.message}
          </p>
        </div>

        {/* Right Side: Action Box & Interactions */}
        <div className="lg:w-80 shrink-0 flex flex-col justify-between p-3.5 rounded-xl bg-white/80 dark:bg-slate-800/80 border border-amber-200/60 dark:border-slate-700/80 shadow-xs space-y-3">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-700 dark:text-amber-400 block mb-1">
              🎯 Today's Practical Action
            </span>
            <p className="text-xs font-medium text-slate-800 dark:text-slate-200 leading-snug">
              {motivation.action_today}
            </p>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-amber-100 dark:border-slate-700/60 text-xs">
            <div className="flex items-center space-x-1.5">
              <button
                onClick={() => onToggleSave(motivation)}
                className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  isSaved
                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-200'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
                title={isSaved ? 'Remove from saved quotes' : 'Save this quote'}
              >
                {isSaved ? <BookmarkCheck className="w-3.5 h-3.5 text-amber-600" /> : <Bookmark className="w-3.5 h-3.5" />}
                <span>{isSaved ? 'Saved' : 'Save'}</span>
              </button>

              <button
                onClick={handleShare}
                className="flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                title="Share or copy quote"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Share'}</span>
              </button>
            </div>

            {savedQuotes.length > 0 && (
              <button
                onClick={onOpenSavedModal}
                className="text-[11px] font-bold text-brand-600 dark:text-brand-400 hover:underline flex items-center space-x-0.5"
              >
                <span>Saved ({savedQuotes.length})</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
