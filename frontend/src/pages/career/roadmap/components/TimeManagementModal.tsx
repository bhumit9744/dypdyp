import React, { useState } from 'react';
import { useRoadmap } from '../context/RoadmapContext';
import { X, Clock, Calendar, PauseCircle, PlayCircle, PlusCircle, CheckCircle2 } from 'lucide-react';

interface TimeManagementModalProps {
  onClose: () => void;
}

export const TimeManagementModal: React.FC<TimeManagementModalProps> = ({ onClose }) => {
  const {
    roadmap,
    updateWeeklyHours,
    extendTimelineMonths,
    togglePauseRoadmap
  } = useRoadmap();

  if (!roadmap) return null;

  const [hours, setHours] = useState<number>(roadmap.weekly_hours_available || 15);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleSaveHours = () => {
    updateWeeklyHours(hours);
    setFeedback('Weekly availability updated!');
    setTimeout(() => setFeedback(null), 2000);
  };

  const handleExtend = (months: number) => {
    extendTimelineMonths(months);
    setFeedback(`Timeline extended by ${months} month(s)!`);
    setTimeout(() => setFeedback(null), 2000);
  };

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
            Smart Scheduling & Controls
          </span>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Time Management & Roadmap Pacing
          </h3>
          <p className="text-xs text-slate-500">
            Adjust your weekly availability, add timeline buffers, or pause your roadmap without losing completed tasks.
          </p>
        </div>

        {feedback && (
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold text-emerald-800 dark:text-emerald-300 flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{feedback}</span>
          </div>
        )}

        <div className="space-y-5">
          {/* Pause / Resume Roadmap */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                Roadmap Active Status
              </span>
              <p className="text-[11px] text-slate-400">
                Current status: <strong>{roadmap.status}</strong>
              </p>
            </div>

            <button
              type="button"
              onClick={togglePauseRoadmap}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center space-x-1.5 ${
                roadmap.status === 'Active'
                  ? 'bg-amber-100 hover:bg-amber-200 text-amber-800 dark:bg-amber-950 dark:text-amber-200'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
            >
              {roadmap.status === 'Active' ? (
                <>
                  <PauseCircle className="w-4 h-4" />
                  <span>Pause Roadmap</span>
                </>
              ) : (
                <>
                  <PlayCircle className="w-4 h-4" />
                  <span>Resume Roadmap</span>
                </>
              )}
            </button>
          </div>

          {/* Change Weekly Availability Hours */}
          <div className="space-y-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-850/60 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-slate-800 dark:text-slate-200">Weekly Available Hours:</span>
              <span className="text-brand-600 dark:text-brand-400 font-extrabold">{hours} hrs/week</span>
            </div>

            <input
              type="range"
              min="5"
              max="40"
              step="5"
              value={hours}
              onChange={e => setHours(Number(e.target.value))}
              className="w-full accent-brand-600 cursor-pointer"
            />

            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleSaveHours}
                className="px-3.5 py-1 rounded-xl text-xs font-semibold bg-brand-600 text-white hover:bg-brand-700"
              >
                Save Hours
              </button>
            </div>
          </div>

          {/* Extend Target Timeline */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
              Extend Target Planning Timeline:
            </label>
            <p className="text-[11px] text-slate-400">
              Current target: {roadmap.target_timeline_months} Months. Adding a buffer extends due dates without resetting completed work.
            </p>

            <div className="grid grid-cols-3 gap-2 pt-1">
              {[1, 2, 3].map(months => (
                <button
                  type="button"
                  key={months}
                  onClick={() => handleExtend(months)}
                  className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-brand-500 bg-white dark:bg-slate-900 text-xs font-bold text-slate-800 dark:text-slate-200 text-center transition-all"
                >
                  +{months} Month{months > 1 ? 's' : ''}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-slate-900 dark:bg-white text-white dark:text-slate-900"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
