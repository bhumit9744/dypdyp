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
  micLevel?: number;
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
  micLevel,
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
      {/* AI Bot Speaker Interface */}
      <AIFaceAvatar
        state={state}
        persona={persona}
        onPersonaChange={onPersonaChange}
        className="absolute inset-0 w-full h-full"
        micLevel={micLevel}
      />

      {/* Top-left voice vibration animation / status indicator */}
      <div className="absolute top-3.5 left-3.5 z-20 flex items-center gap-2">
        {state === 'listening' ? (
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-950/80 backdrop-blur-md border border-cyan-500/40 shadow-lg shadow-cyan-950/50 text-cyan-300 transition-all duration-300"
            title="Voice vibration — Listening to your speech"
            aria-label="Voice vibration listening animation"
          >
            {/* Glowing Pulsing Core Dot */}
            <div className="relative flex items-center justify-center w-2 h-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 opacity-75 animate-ping absolute" />
              <span className="w-2 h-2 rounded-full bg-cyan-400 relative" />
            </div>

            {/* Simple Voice Vibration Wave Bars */}
            <div className="flex items-center gap-1 h-6 px-0.5">
              <span
                className="w-1 bg-gradient-to-t from-cyan-500 to-blue-400 rounded-full animate-voice-bar-1"
                style={micLevel && micLevel > 0.05 ? { transform: `scaleY(${1 + Math.min(1.8, micLevel * 2)})` } : undefined}
              />
              <span
                className="w-1 bg-gradient-to-t from-cyan-400 to-sky-300 rounded-full animate-voice-bar-2"
                style={micLevel && micLevel > 0.05 ? { transform: `scaleY(${1 + Math.min(2.0, micLevel * 2.4)})` } : undefined}
              />
              <span
                className="w-1 bg-gradient-to-t from-blue-400 to-indigo-300 rounded-full animate-voice-bar-3"
                style={micLevel && micLevel > 0.05 ? { transform: `scaleY(${1 + Math.min(2.2, micLevel * 2.8)})` } : undefined}
              />
              <span
                className="w-1 bg-gradient-to-t from-cyan-400 to-sky-300 rounded-full animate-voice-bar-4"
                style={micLevel && micLevel > 0.05 ? { transform: `scaleY(${1 + Math.min(2.0, micLevel * 2.4)})` } : undefined}
              />
              <span
                className="w-1 bg-gradient-to-t from-cyan-500 to-blue-400 rounded-full animate-voice-bar-5"
                style={micLevel && micLevel > 0.05 ? { transform: `scaleY(${1 + Math.min(1.8, micLevel * 2)})` } : undefined}
              />
            </div>
          </div>
        ) : state === 'speaking' ? (
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-950/80 backdrop-blur-md border border-emerald-500/40 shadow-lg shadow-emerald-950/50 text-emerald-300 transition-all duration-300"
            title="AI Interviewer speaking"
            aria-label="AI speaking voice animation"
          >
            <div className="relative flex items-center justify-center w-2 h-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 opacity-75 animate-ping absolute" />
              <span className="w-2 h-2 rounded-full bg-emerald-400 relative" />
            </div>
            <div className="flex items-center gap-1 h-6 px-0.5">
              <span className="w-1 bg-gradient-to-t from-emerald-500 to-teal-400 rounded-full animate-voice-bar-2" />
              <span className="w-1 bg-gradient-to-t from-emerald-400 to-teal-300 rounded-full animate-voice-bar-4" />
              <span className="w-1 bg-gradient-to-t from-teal-400 to-cyan-300 rounded-full animate-voice-bar-1" />
              <span className="w-1 bg-gradient-to-t from-emerald-400 to-teal-300 rounded-full animate-voice-bar-3" />
              <span className="w-1 bg-gradient-to-t from-emerald-500 to-teal-400 rounded-full animate-voice-bar-5" />
            </div>
          </div>
        ) : state === 'evaluating' ? (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-amber-500/40 text-amber-300 text-[11px] font-medium shadow-md">
            <RefreshCw className="w-3 h-3 animate-spin text-amber-400" />
            <span>Evaluating…</span>
          </div>
        ) : isConnected ? (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-slate-700/60 text-slate-300 text-[11px] font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Ready</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-slate-800 text-slate-400 text-[11px]">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
            <span>Standby</span>
          </div>
        )}
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
