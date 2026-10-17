import React from 'react';
import { Bot, Volume2, Sparkles, Mic, Radio, Waves, Cpu } from 'lucide-react';
import { InterviewerPanelState } from './InterviewerPanel';

export type AvatarPersona = 'sarah' | 'alex' | 'nova' | 'jarvis';

interface AIFaceAvatarProps {
  state: InterviewerPanelState;
  persona?: AvatarPersona;
  onPersonaChange?: (persona: AvatarPersona) => void;
  className?: string;
  micLevel?: number;
}

/**
 * AIBotSpeaker (formerly AIFaceAvatar)
 * Replaces human photographic images with a clean, futuristic AI Bot Speaker interface.
 * Features dynamic acoustic ripple soundwaves, animated frequency equalizers,
 * responsive microphone feedback, and autonomous voice status indicators.
 */
export const AIFaceAvatar: React.FC<AIFaceAvatarProps> = ({
  state,
  persona: _persona = 'jarvis',
  onPersonaChange: _onPersonaChange,
  className = '',
  micLevel = 0
}) => {
  const isSpeaking = state === 'speaking';
  const isListening = state === 'listening';
  const isEvaluating = state === 'evaluating';
  const isReady = state === 'ready';

  return (
    <div
      className={`relative w-full h-full flex flex-col items-center justify-center overflow-hidden select-none bg-gradient-to-b from-slate-950 via-[#070b14] to-slate-950 ${className}`}
    >
      {/* Background Subtle Tech Audio Grid & Ambient Light Field */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:28px_28px] opacity-30 pointer-events-none" />

      {/* Ambient Acoustic Radial Backglow */}
      <div
        className={`absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full filter blur-3xl pointer-events-none transition-all duration-700 ${
          isSpeaking
            ? 'bg-emerald-500/20 scale-125'
            : isListening
            ? 'bg-cyan-500/20 scale-110'
            : isEvaluating
            ? 'bg-amber-500/15 scale-100'
            : 'bg-blue-600/10 scale-90'
        }`}
      />

      {/* ===================================================================
       * CENTER: The AI Bot Speaker with Concentric Sonic Waves
       * =================================================================== */}
      <div className="relative flex flex-col items-center justify-center z-10">
        {/* Outer Expanding Acoustic Sonic Ripples (Visible during speech) */}
        {isSpeaking && (
          <>
            <div className="absolute w-52 h-52 sm:w-64 sm:h-64 rounded-full border border-emerald-400/40 pointer-events-none animate-speaker-ripple-1" />
            <div className="absolute w-52 h-52 sm:w-64 sm:h-64 rounded-full border border-teal-400/30 pointer-events-none animate-speaker-ripple-2" />
            <div className="absolute w-52 h-52 sm:w-64 sm:h-64 rounded-full border border-cyan-400/20 pointer-events-none animate-speaker-ripple-3" />
          </>
        )}

        {/* Concentric Tech Orbit Rings */}
        <div className="relative w-44 h-44 sm:w-56 sm:h-56 md:w-60 md:h-60 rounded-full flex items-center justify-center">
          {/* Outer Dashed Orbit Ring */}
          <div
            className={`absolute inset-0 rounded-full border border-dashed transition-colors duration-500 ${
              isSpeaking
                ? 'border-emerald-400/50 animate-spin'
                : isListening
                ? 'border-cyan-400/50 animate-spin'
                : isEvaluating
                ? 'border-amber-400/60 animate-spin'
                : 'border-slate-700/50'
            }`}
            style={{ animationDuration: isSpeaking ? '14s' : isEvaluating ? '6s' : '22s' }}
          />

          {/* Secondary Precision Audio Wave Ring */}
          <div
            className={`absolute inset-3 rounded-full border transition-all duration-300 ${
              isSpeaking
                ? 'border-teal-500/50 shadow-lg shadow-emerald-950/40'
                : isListening
                ? 'border-cyan-500/40 shadow-lg shadow-cyan-950/40'
                : isEvaluating
                ? 'border-amber-500/40'
                : 'border-slate-800'
            }`}
          />

          {/* Main Bot Speaker Chassis Orb */}
          <div
            className={`relative w-32 h-32 sm:w-40 sm:h-40 md:w-44 md:h-44 rounded-full flex flex-col items-center justify-center border-2 transition-all duration-300 shadow-2xl ${
              isSpeaking
                ? 'bg-gradient-to-tr from-slate-900 via-emerald-950/60 to-slate-900 border-emerald-400/80 animate-speaker-pulse'
                : isListening
                ? 'bg-gradient-to-tr from-slate-900 via-cyan-950/50 to-slate-900 border-cyan-400/70 shadow-cyan-950/50 scale-100'
                : isEvaluating
                ? 'bg-gradient-to-tr from-slate-900 via-amber-950/40 to-slate-900 border-amber-400/70 shadow-amber-950/50'
                : 'bg-gradient-to-tr from-slate-900 to-slate-950 border-slate-700/60'
            }`}
          >
            {/* Top Antenna / Signal Pulse Node */}
            <div className="absolute -top-3 flex flex-col items-center">
              <span
                className={`w-2 h-2 rounded-full transition-colors ${
                  isSpeaking
                    ? 'bg-emerald-400 shadow-md shadow-emerald-400'
                    : isListening
                    ? 'bg-cyan-400 shadow-md shadow-cyan-400'
                    : isEvaluating
                    ? 'bg-amber-400 animate-ping'
                    : 'bg-slate-600'
                }`}
              />
              <span className="w-0.5 h-2 bg-slate-700" />
            </div>

            {/* Glowing Bot Face & Visor */}
            <div className="relative flex flex-col items-center justify-center">
              {/* Bot Icon with Animated Colors */}
              <Bot
                className={`w-14 h-14 sm:w-16 sm:h-16 md:w-18 md:h-18 transition-all duration-300 ${
                  isSpeaking
                    ? 'text-emerald-300 drop-shadow-[0_0_12px_rgba(52,211,153,0.6)]'
                    : isListening
                    ? 'text-cyan-300 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]'
                    : isEvaluating
                    ? 'text-amber-300 drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]'
                    : 'text-slate-400'
                }`}
              />

              {/* Bot Digital Eyes (Blinking Animation overlay) */}
              <div className="absolute top-[22px] sm:top-[26px] md:top-[30px] flex items-center justify-center gap-3 pointer-events-none animate-bot-eye">
                <span
                  className={`w-2.5 h-2 rounded-sm transition-colors ${
                    isSpeaking
                      ? 'bg-emerald-200 shadow-[0_0_8px_#34d399]'
                      : isListening
                      ? 'bg-cyan-200 shadow-[0_0_8px_#22d3ee]'
                      : isEvaluating
                      ? 'bg-amber-200 shadow-[0_0_8px_#fbbf24]'
                      : 'bg-slate-400'
                  }`}
                />
                <span
                  className={`w-2.5 h-2 rounded-sm transition-colors ${
                    isSpeaking
                      ? 'bg-emerald-200 shadow-[0_0_8px_#34d399]'
                      : isListening
                      ? 'bg-cyan-200 shadow-[0_0_8px_#22d3ee]'
                      : isEvaluating
                      ? 'bg-amber-200 shadow-[0_0_8px_#fbbf24]'
                      : 'bg-slate-400'
                  }`}
                />
              </div>
            </div>

            {/* Speaker Diaphragm / Acoustic Waves within chassis */}
            <div className="flex items-center gap-1 mt-1.5 h-3">
              {isSpeaking ? (
                <>
                  <span className="w-1 bg-emerald-400 rounded-full animate-voice-bar-1" />
                  <span className="w-1 bg-teal-300 rounded-full animate-voice-bar-3" />
                  <span className="w-1 bg-cyan-300 rounded-full animate-voice-bar-2" />
                  <span className="w-1 bg-teal-300 rounded-full animate-voice-bar-4" />
                  <span className="w-1 bg-emerald-400 rounded-full animate-voice-bar-5" />
                </>
              ) : isListening ? (
                <div className="flex items-center gap-1">
                  <span
                    className="w-1 bg-cyan-400 rounded-full animate-voice-bar-2"
                    style={micLevel > 0.05 ? { transform: `scaleY(${1 + Math.min(2.0, micLevel * 2)})` } : undefined}
                  />
                  <span
                    className="w-1 bg-cyan-300 rounded-full animate-voice-bar-4"
                    style={micLevel > 0.05 ? { transform: `scaleY(${1 + Math.min(2.5, micLevel * 2.5)})` } : undefined}
                  />
                  <span
                    className="w-1 bg-cyan-400 rounded-full animate-voice-bar-1"
                    style={micLevel > 0.05 ? { transform: `scaleY(${1 + Math.min(2.0, micLevel * 2)})` } : undefined}
                  />
                </div>
              ) : (
                <div className="flex items-center gap-1 opacity-40">
                  <span className="w-1 h-1 bg-slate-500 rounded-full" />
                  <span className="w-1 h-1 bg-slate-400 rounded-full" />
                  <span className="w-1 h-1 bg-slate-500 rounded-full" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Dynamic Symmetrical Stereo Equalizer (Speaker Waveform) */}
        <div className="flex items-center justify-center gap-1.5 mt-5 h-7 px-4 py-1 rounded-full bg-slate-900/60 backdrop-blur-md border border-slate-800/80 shadow-inner">
          <Volume2
            className={`w-3.5 h-3.5 shrink-0 ${
              isSpeaking ? 'text-emerald-400 animate-pulse' : 'text-slate-500'
            }`}
          />
          <div className="flex items-center gap-1">
            {isSpeaking ? (
              <>
                <span className="w-1 bg-gradient-to-t from-emerald-500 to-teal-300 rounded-full animate-voice-bar-1" />
                <span className="w-1 bg-gradient-to-t from-teal-500 to-cyan-300 rounded-full animate-voice-bar-3" />
                <span className="w-1 bg-gradient-to-t from-emerald-400 to-teal-200 rounded-full animate-voice-bar-2" />
                <span className="w-1 bg-gradient-to-t from-cyan-400 to-teal-300 rounded-full animate-voice-bar-4" />
                <span className="w-1.5 bg-gradient-to-t from-emerald-400 to-white rounded-full animate-voice-bar-5" />
                <span className="w-1 bg-gradient-to-t from-cyan-400 to-teal-300 rounded-full animate-voice-bar-4" />
                <span className="w-1 bg-gradient-to-t from-emerald-400 to-teal-200 rounded-full animate-voice-bar-2" />
                <span className="w-1 bg-gradient-to-t from-teal-500 to-cyan-300 rounded-full animate-voice-bar-3" />
                <span className="w-1 bg-gradient-to-t from-emerald-500 to-teal-300 rounded-full animate-voice-bar-1" />
              </>
            ) : isListening ? (
              <>
                <span className="w-1 bg-cyan-500 rounded-full animate-voice-bar-2" />
                <span className="w-1 bg-cyan-400 rounded-full animate-voice-bar-4" />
                <span className="w-1.5 bg-cyan-300 rounded-full animate-voice-bar-3" />
                <span className="w-1 bg-cyan-400 rounded-full animate-voice-bar-4" />
                <span className="w-1 bg-cyan-500 rounded-full animate-voice-bar-2" />
              </>
            ) : isEvaluating ? (
              <>
                <span className="w-1 bg-amber-400 rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
                <span className="w-1 bg-amber-400 rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
                <span className="w-1 bg-amber-400 rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
                <span className="w-1 bg-amber-400 rounded-full animate-pulse" style={{ animationDelay: '450ms' }} />
              </>
            ) : (
              <span className="text-[10px] text-slate-500 font-medium px-2">
                Acoustic Speaker Ready
              </span>
            )}
          </div>
        </div>

        {/* Live Audio Status Pill */}
        <div className="mt-3">
          {isSpeaking ? (
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/70 border border-emerald-500/50 text-emerald-300 text-xs font-semibold shadow-lg shadow-emerald-950/60">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>AI Bot Speaking</span>
            </div>
          ) : isListening ? (
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-500/50 text-cyan-300 text-xs font-semibold shadow-lg shadow-cyan-950/60">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>Listening to Candidate</span>
            </div>
          ) : isEvaluating ? (
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/70 border border-amber-500/50 text-amber-300 text-xs font-semibold shadow-lg shadow-amber-950/60">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-spin" />
              <span>Evaluating Response…</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-700/60 text-slate-400 text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>AI Voice Bot Online</span>
            </div>
          )}
        </div>
      </div>

      {/* ===================================================================
       * Bottom Interviewer Identification Tag
       * =================================================================== */}
      <div className="absolute bottom-3 left-4 z-30 flex items-center gap-3 px-3.5 py-1.5 rounded-xl bg-slate-950/85 backdrop-blur-md border border-slate-800/80 shadow-lg">
        <span
          className={`w-2.5 h-2.5 rounded-full ${
            isSpeaking
              ? 'bg-emerald-400 animate-ping'
              : isListening
              ? 'bg-cyan-400 animate-pulse'
              : isEvaluating
              ? 'bg-amber-400 animate-spin'
              : 'bg-emerald-500'
          }`}
        />
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-slate-800/80 border border-slate-700 flex items-center justify-center text-cyan-400">
            <Bot className="w-3.5 h-3.5" />
          </div>
          <div>
            <h4 className="font-bold text-xs text-white leading-tight">
              AI Technical Interviewer
            </h4>
            <p className="text-[10px] text-slate-400 leading-tight">
              Autonomous Bot Speaker • Real-time Evaluation
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
