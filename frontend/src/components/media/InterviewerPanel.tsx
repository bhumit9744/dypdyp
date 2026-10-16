import React from 'react';
import { Bot, Mic, Volume2, RefreshCw, StopCircle } from 'lucide-react';

export type InterviewerPanelState = 'disconnected' | 'ready' | 'speaking' | 'listening' | 'evaluating';

interface InterviewerPanelProps {
  state: InterviewerPanelState;
  interviewerName?: string;
  interviewerRole?: string;
  callDurationSeconds?: number;
  onSkipAudio?: () => void;
  className?: string;
  children?: React.ReactNode;
}

/**
 * InterviewerPanel — main stage video panel holding the AI interviewer avatar
 * with real-time audio animation, status pills, and support for docked PIP camera.
 */
export const InterviewerPanel: React.FC<InterviewerPanelProps> = ({
  state,
  interviewerName = 'AI Interviewer',
  interviewerRole = 'Technical Assessment',
  callDurationSeconds,
  onSkipAudio,
  className = '',
  children
}) => {
  const isConnected = state !== 'disconnected';

  const formatDuration = (total: number) => {
    const m = Math.floor(total / 60);
    const s = total % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`relative aspect-video rounded-2xl bg-slate-950 border border-slate-800/80 overflow-hidden flex flex-col items-center justify-center p-6 shadow-md ${className}`}>
      {/* Subtle ambient lighting */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.08)_0%,transparent_70%)] pointer-events-none" />

      {/* Top-left status badge */}
      <div className="absolute top-3.5 left-3.5 z-10 flex items-center gap-2">
        <span
          className={`px-2.5 py-1 rounded-full text-[11px] font-semibold flex items-center gap-1.5 shadow-sm transition-colors ${
            state === 'speaking'
              ? 'bg-emerald-500/90 text-white'
              : state === 'listening'
              ? 'bg-blue-500/90 text-white'
              : state === 'evaluating'
              ? 'bg-amber-500/90 text-white'
              : isConnected
              ? 'bg-slate-800/90 text-slate-300 border border-slate-700/50'
              : 'bg-slate-800/60 text-slate-400'
          }`}
        >
          {state === 'speaking' && <Volume2 className="w-3.5 h-3.5 animate-pulse" />}
          {state === 'speaking' && 'Speaking'}
          {state === 'listening' && <Mic className="w-3.5 h-3.5 animate-pulse" />}
          {state === 'listening' && 'Listening'}
          {state === 'evaluating' && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
          {state === 'evaluating' && 'Evaluating…'}
          {state === 'ready' && 'Ready'}
          {state === 'disconnected' && 'Disconnected'}
        </span>
      </div>

      {/* Top-right controls / duration */}
      <div className="absolute top-3.5 right-3.5 z-10 flex items-center gap-2">
        {state === 'speaking' && onSkipAudio && (
          <button
            type="button"
            onClick={onSkipAudio}
            className="px-2.5 py-1 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-[11px] font-medium border border-slate-700 flex items-center gap-1 transition-colors"
            title="Skip audio"
          >
            <StopCircle className="w-3.5 h-3.5 text-rose-400" />
            <span>Skip Audio</span>
          </button>
        )}

        {isConnected && typeof callDurationSeconds === 'number' && (
          <span className="px-2.5 py-1 rounded-full bg-slate-900/80 text-slate-300 text-[11px] font-mono border border-slate-800">
            {formatDuration(callDurationSeconds)}
          </span>
        )}
      </div>

      {/* Avatar Stage */}
      <div className="relative flex flex-col items-center justify-center space-y-3 z-0">
        <div className="relative">
          {/* Animated ripple ring when speaking */}
          {state === 'speaking' && (
            <>
              <div className="absolute -inset-3 rounded-full bg-emerald-500/20 animate-ping opacity-75" />
              <div className="absolute -inset-6 rounded-full bg-brand-500/15 animate-pulse" />
            </>
          )}

          {/* Idle breathing ring */}
          {isConnected && (
            <div
              className={`absolute -inset-2.5 rounded-full border transition-all duration-300 ${
                state === 'speaking'
                  ? 'border-emerald-400/50'
                  : state === 'listening'
                  ? 'border-blue-400/60 animate-pulse'
                  : 'border-slate-700/60'
              }`}
            />
          )}

          {/* Main avatar shell */}
          <div
            className={`w-24 h-24 md:w-28 md:h-28 rounded-full border-2 shadow-lg flex items-center justify-center transition-all duration-200 ${
              state === 'speaking'
                ? 'border-emerald-400 bg-gradient-to-tr from-slate-900 via-brand-950 to-slate-900 scale-105'
                : state === 'listening'
                ? 'border-blue-400 bg-gradient-to-tr from-slate-900 to-slate-950'
                : state === 'evaluating'
                ? 'border-amber-400 bg-gradient-to-tr from-slate-900 to-slate-950'
                : 'border-slate-700/70 bg-slate-900'
            }`}
          >
            <Bot
              className={`w-12 h-12 md:w-14 md:h-14 transition-colors ${
                state === 'speaking'
                  ? 'text-emerald-300'
                  : isConnected
                  ? 'text-slate-200'
                  : 'text-slate-500'
              }`}
            />
          </div>
        </div>

        <div className="text-center space-y-0.5">
          <h3 className="font-semibold text-sm text-slate-100 tracking-tight">{interviewerName}</h3>
          <p className="text-[11px] text-slate-400">{interviewerRole}</p>
        </div>
      </div>

      {/* Docked children (e.g. Student PIP camera) */}
      {children}
    </div>
  );
};
