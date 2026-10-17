import React from 'react';
import { Mic, Volume2, RefreshCw, StopCircle } from 'lucide-react';
import { AIFaceAvatar } from './AIFaceAvatar';

export type InterviewerPanelState = 'disconnected' | 'ready' | 'speaking' | 'listening' | 'evaluating';

interface InterviewerPanelProps {
  state: InterviewerPanelState;
  interviewerName?: string;
  interviewerRole?: string;
  callDurationSeconds?: number;
  onSkipAudio?: () => void;
  persona?: 'sarah' | 'alex' | 'nova' | 'jarvis';
  onPersonaChange?: (persona: 'sarah' | 'alex' | 'nova' | 'jarvis') => void;
  className?: string;
  children?: React.ReactNode;
}

/**
 * InterviewerPanel — main stage video panel holding the photorealistic AI interviewer
 * with synchronized lip-syncing, facial visemes, natural eye-blinking, and docked PIP camera.
 */
export const InterviewerPanel: React.FC<InterviewerPanelProps> = ({
  state,
  callDurationSeconds,
  onSkipAudio,
  persona,
  onPersonaChange,
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
    <div className={`relative aspect-video rounded-2xl bg-slate-950 border border-slate-800/80 overflow-hidden flex flex-col items-center justify-center shadow-2xl ${className}`}>
      {/* Photorealistic AI Face with Synchronized Lip-Syncing & Blinking */}
      <AIFaceAvatar
        state={state}
        persona={persona}
        onPersonaChange={onPersonaChange}
        className="absolute inset-0 w-full h-full"
      />

      {/* Top-left status badge */}
      <div className="absolute top-3.5 left-3.5 z-20 flex items-center gap-2">
        <span
          className={`px-2.5 py-1 rounded-full text-[11px] font-semibold flex items-center gap-1.5 shadow-md backdrop-blur-md transition-colors ${
            state === 'speaking'
              ? 'bg-emerald-500/90 text-white shadow-emerald-500/30'
              : state === 'listening'
              ? 'bg-blue-500/90 text-white shadow-blue-500/30'
              : state === 'evaluating'
              ? 'bg-amber-500/90 text-white shadow-amber-500/30'
              : isConnected
              ? 'bg-slate-900/90 text-slate-300 border border-slate-700/60'
              : 'bg-slate-900/70 text-slate-400'
          }`}
        >
          {state === 'speaking' && <Volume2 className="w-3.5 h-3.5 animate-pulse" />}
          {state === 'speaking' && 'AI Speaking'}
          {state === 'listening' && <Mic className="w-3.5 h-3.5 animate-pulse" />}
          {state === 'listening' && 'Listening to you'}
          {state === 'evaluating' && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
          {state === 'evaluating' && 'Evaluating answer…'}
          {state === 'ready' && 'Ready'}
          {state === 'disconnected' && 'Disconnected'}
        </span>
      </div>

      {/* Top-right controls / duration */}
      <div className="absolute top-3.5 right-3.5 z-20 flex items-center gap-2">
        {state === 'speaking' && onSkipAudio && (
          <button
            type="button"
            onClick={onSkipAudio}
            className="px-2.5 py-1 rounded-full bg-slate-900/90 hover:bg-slate-800 text-slate-200 text-[11px] font-medium border border-slate-700/80 backdrop-blur-md flex items-center gap-1 transition-colors shadow-md"
            title="Skip audio"
          >
            <StopCircle className="w-3.5 h-3.5 text-rose-400" />
            <span>Skip Audio</span>
          </button>
        )}

        {isConnected && typeof callDurationSeconds === 'number' && (
          <span className="px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-slate-300 text-[11px] font-mono border border-slate-800 shadow-md">
            {formatDuration(callDurationSeconds)}
          </span>
        )}
      </div>

      {/* Docked children (e.g. Student PIP camera) */}
      {children}
    </div>
  );
};
