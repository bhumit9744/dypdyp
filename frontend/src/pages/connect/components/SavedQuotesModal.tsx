import React from 'react';
import { X, Bookmark, Quote, Trash2 } from 'lucide-react';
import { ConnectMotivation } from '../../../types';

interface SavedQuotesModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedQuotes: ConnectMotivation[];
  onRemoveQuote: (id: string) => void;
}

export const SavedQuotesModal: React.FC<SavedQuotesModalProps> = ({
  isOpen,
  onClose,
  savedQuotes,
  onRemoveQuote
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-xl max-h-[85vh] flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 flex items-center justify-center">
              <Bookmark className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Saved Motivation & Reflections
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {savedQuotes.length} saved {savedQuotes.length === 1 ? 'quote' : 'quotes'} for your placement journey
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quotes List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {savedQuotes.length === 0 ? (
            <div className="text-center py-12 space-y-2">
              <Quote className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                No saved quotes yet
              </p>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Click the 'Save' button on any daily motivation card to revisit inspiring thoughts and habits anytime.
              </p>
            </div>
          ) : (
            savedQuotes.map((quote) => (
              <div
                key={quote.id}
                className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/70 space-y-2.5 relative group"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                      “{quote.quote}”
                    </p>
                    <p className="text-xs font-semibold text-amber-700 dark:text-amber-400">
                      — {quote.author}
                    </p>
                  </div>
                  <button
                    onClick={() => onRemoveQuote(quote.id)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-all"
                    title="Remove from saved"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/50 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                  <span className="font-medium">Action: {quote.action_today}</span>
                  <span className="shrink-0">{quote.date}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold hover:opacity-90 transition-opacity"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
