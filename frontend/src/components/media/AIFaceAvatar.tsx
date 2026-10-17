import React, { useState, useEffect, useRef } from 'react';
import { Bot, Volume2, Mic, Sparkles, Activity } from 'lucide-react';
import { InterviewerPanelState } from './InterviewerPanel';

export type AvatarPersona = 'sarah' | 'alex' | 'nova' | 'jarvis';

interface AIFaceAvatarProps {
  state: InterviewerPanelState;
  persona?: AvatarPersona;
  onPersonaChange?: (persona: AvatarPersona) => void;
  className?: string;
}

export const AIFaceAvatar: React.FC<AIFaceAvatarProps> = ({
  state,
  persona = 'sarah',
  onPersonaChange: _onPersonaChange,
  className = ''
}) => {
  const [selectedPersona, setSelectedPersona] = useState<AvatarPersona>(persona);

  // Natural human expression state
  const [blinkProgress, setBlinkProgress] = useState<number>(0); // 0 (open) to 1 (closed)
  const [headTilt, setHeadTilt] = useState<{ x: number; y: number; r: number }>({ x: 0, y: 0, r: 0 });
  const [browRaise, setBrowRaise] = useState<number>(0);

  // Sound vibration frequency bands (16 harmonic audio bars for sound vibration animation)
  const [soundVibrationBands, setSoundVibrationBands] = useState<number[]>(Array(16).fill(0.1));

  // Animation and timing refs
  const animFrameRef = useRef<number | null>(null);

  // Sync external persona change
  useEffect(() => {
    setSelectedPersona(persona);
  }, [persona]);

  // -------------------------------------------------------------------------
  // 1. Natural Human Eye-Blinking Engine (Realistic 140ms sweep with micro-blinks)
  // -------------------------------------------------------------------------
  useEffect(() => {
    let blinkTimer: any;
    let isBlinking = false;

    const performBlink = (isDouble = false) => {
      isBlinking = true;
      const startTime = performance.now();
      const blinkDuration = 140;

      const stepBlink = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(1, elapsed / blinkDuration);

        let eyeClosure = 0;
        if (progress < 0.4) {
          eyeClosure = progress / 0.4;
        } else {
          eyeClosure = 1 - (progress - 0.4) / 0.6;
        }

        setBlinkProgress(Math.max(0, Math.min(1, eyeClosure)));

        if (progress < 1) {
          requestAnimationFrame(stepBlink);
        } else {
          setBlinkProgress(0);
          isBlinking = false;

          if (!isDouble && Math.random() < 0.18) {
            setTimeout(() => performBlink(true), 90);
          } else {
            scheduleNextBlink();
          }
        }
      };

      requestAnimationFrame(stepBlink);
    };

    const scheduleNextBlink = () => {
      const delay = 3200 + Math.random() * 2200;
      blinkTimer = setTimeout(() => {
        performBlink();
      }, delay);
    };

    scheduleNextBlink();
    return () => clearTimeout(blinkTimer);
  }, []);

  // -------------------------------------------------------------------------
  // 2. 60FPS Sound Vibration Visualizer Engine & Natural Facial Presence
  // -------------------------------------------------------------------------
  useEffect(() => {
    let active = true;

    const updateLoop = (now: number) => {
      if (!active) return;

      if (state === 'speaking') {
        // Active speech: Calculate dynamic 16-band sound vibration frequencies
        const freqs = Array.from({ length: 16 }, (_, i) => {
          const wave1 = Math.sin(now * 0.014 + i * 0.52) * 0.45 + 0.45;
          const wave2 = Math.cos(now * 0.021 + i * 0.88) * 0.35 + 0.35;
          const wave3 = Math.sin(now * 0.008 + i * 0.32) * 0.2 + 0.2;
          return Math.min(1, Math.max(0.15, (wave1 + wave2 + wave3) * 0.78));
        });
        setSoundVibrationBands(freqs);

        // Conversational head movement and attentive eyebrow lift
        setHeadTilt({
          x: Math.sin(now * 0.0028) * 1.5,
          y: Math.cos(now * 0.0035) * 1.1,
          r: Math.sin(now * 0.002) * 0.7
        });
        setBrowRaise(0.3 + Math.sin(now * 0.002) * 0.12);
      } else if (state === 'listening') {
        // Listening mode: Gentle undulating acoustic rhythm
        const freqs = Array.from({ length: 16 }, (_, i) => {
          const wave = Math.sin(now * 0.006 + i * 0.4) * 0.15 + 0.2;
          return Math.max(0.1, wave);
        });
        setSoundVibrationBands(freqs);
        setBrowRaise(0.1);

        // Gentle listening nod
        const nodPhase = (now * 0.0018) % (Math.PI * 2);
        const nodY = Math.sin(nodPhase) > 0.4 ? Math.sin(nodPhase * 2) * 2.0 : 0;
        setHeadTilt({
          x: Math.sin(now * 0.001) * 0.8,
          y: nodY,
          r: Math.sin(now * 0.0008) * 0.5
        });
      } else if (state === 'evaluating') {
        // Evaluating mode: Thoughtful tilt
        setSoundVibrationBands(Array(16).fill(0.12));
        setBrowRaise(0.0);
        setHeadTilt({
          x: 1.4,
          y: 2.0,
          r: 1.0
        });
      } else {
        // Idle ready state: Resting vibration and calm breathing float
        setSoundVibrationBands(Array(16).fill(0.08));
        setBrowRaise(0.0);
        setHeadTilt({
          x: Math.sin(now * 0.001) * 0.4,
          y: Math.sin(now * 0.0015) * 0.7,
          r: 0
        });
      }

      animFrameRef.current = requestAnimationFrame(updateLoop);
    };

    animFrameRef.current = requestAnimationFrame(updateLoop);
    return () => {
      active = false;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [state]);

  // -------------------------------------------------------------------------
  // Persona Specifications (Natural Eye Positions for Blinking)
  // -------------------------------------------------------------------------
  const personaSpecs = {
    sarah: {
      name: 'Sarah Jenkins',
      role: 'Principal System Architect',
      image: '/avatars/sarah.jpg',
      eyes: {
        leftEye: { top: 31.5, left: 46.8, w: 3.8, h: 2.0 },
        rightEye: { top: 31.5, left: 53.2, w: 3.8, h: 2.0 },
        lidColor: '#8a5940'
      }
    },
    alex: {
      name: 'Alex Vance',
      role: 'Senior Staff Tech Lead',
      image: '/avatars/alex.jpg',
      eyes: {
        leftEye: { top: 31.0, left: 46.5, w: 4.4, h: 2.2 },
        rightEye: { top: 31.0, left: 53.5, w: 4.4, h: 2.2 },
        lidColor: '#784d38'
      }
    }
  };

  const isPhotorealistic = selectedPersona === 'sarah' || selectedPersona === 'alex';
  const currentPhotoConfig = isPhotorealistic ? personaSpecs[selectedPersona as 'sarah' | 'alex'] : null;

  return (
    <div
      className={`relative w-full h-full flex flex-col items-center justify-center overflow-hidden select-none bg-slate-950 transition-shadow duration-300 ${
        state === 'speaking' ? 'shadow-[inset_0_0_50px_rgba(16,185,129,0.2)]' : ''
      } ${className}`}
    >
      {/* ===================================================================
       * STAGE 1: Photorealistic Avatars (Clean Natural Portrait with NO Lip-Syncing)
       * =================================================================== */}
      {isPhotorealistic && currentPhotoConfig && (
        <div
          className="relative w-full h-full flex items-center justify-center overflow-hidden"
          style={{
            transform: `translate3d(${headTilt.x}px, ${headTilt.y}px, 0) rotate(${headTilt.r}deg)`,
            transition: 'transform 0.08s ease-out'
          }}
        >
          {/* Pristine, High-Definition 8K Studio Portrait Base */}
          <img
            src={currentPhotoConfig.image}
            alt={currentPhotoConfig.name}
            className="w-full h-full object-cover object-center filter brightness-[0.98] contrast-[1.02]"
            draggable={false}
          />

          {/* ---------------------------------------------------------------
           * Natural Eye-Blinking Mechanism
           * --------------------------------------------------------------- */}
          {blinkProgress > 0.05 && (
            <>
              {/* Left Eye Eyelid */}
              <div
                className="absolute pointer-events-none rounded-[50%/60%] overflow-hidden z-20"
                style={{
                  top: `${currentPhotoConfig.eyes.leftEye.top}%`,
                  left: `${currentPhotoConfig.eyes.leftEye.left}%`,
                  width: `${currentPhotoConfig.eyes.leftEye.w}%`,
                  height: `${currentPhotoConfig.eyes.leftEye.h * blinkProgress}%`,
                  transform: 'translate(-50%, -50%)',
                  backgroundColor: currentPhotoConfig.eyes.lidColor,
                  boxShadow: 'inset 0 -2px 4px rgba(0,0,0,0.6), 0 2px 3px rgba(0,0,0,0.3)',
                  borderBottom: '1px solid rgba(30,15,10,0.85)'
                }}
              />

              {/* Right Eye Eyelid */}
              <div
                className="absolute pointer-events-none rounded-[50%/60%] overflow-hidden z-20"
                style={{
                  top: `${currentPhotoConfig.eyes.rightEye.top}%`,
                  left: `${currentPhotoConfig.eyes.rightEye.left}%`,
                  width: `${currentPhotoConfig.eyes.rightEye.w}%`,
                  height: `${currentPhotoConfig.eyes.rightEye.h * blinkProgress}%`,
                  transform: 'translate(-50%, -50%)',
                  backgroundColor: currentPhotoConfig.eyes.lidColor,
                  boxShadow: 'inset 0 -2px 4px rgba(0,0,0,0.6), 0 2px 3px rgba(0,0,0,0.3)',
                  borderBottom: '1px solid rgba(30,15,10,0.85)'
                }}
              />
            </>
          )}

          {/* ---------------------------------------------------------------
           * Acoustic Sound Vibration Ripple Rings (Vibrates when speaking)
           * --------------------------------------------------------------- */}
          {state === 'speaking' && (
            <div className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center overflow-hidden">
              <div
                className="absolute rounded-full border-2 border-emerald-400/40 pointer-events-none animate-ping"
                style={{
                  width: '240px',
                  height: '240px',
                  animationDuration: '1.8s',
                  animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)'
                }}
              />
              <div
                className="absolute rounded-full border border-teal-400/30 pointer-events-none animate-ping"
                style={{
                  width: '340px',
                  height: '340px',
                  animationDuration: '2.4s',
                  animationDelay: '0.5s',
                  animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)'
                }}
              />
              <div
                className="absolute rounded-full border border-cyan-400/20 pointer-events-none animate-ping"
                style={{
                  width: '460px',
                  height: '460px',
                  animationDuration: '3.0s',
                  animationDelay: '1.0s',
                  animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)'
                }}
              />
            </div>
          )}

          {/* Cinematic Vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-slate-950/20 pointer-events-none" />
        </div>
      )}

      {/* ===================================================================
       * STAGE 2: NOVA 3D Digital Human (Clean Vector Human without Visemes)
       * =================================================================== */}
      {selectedPersona === 'nova' && (
        <div
          className="relative w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950"
          style={{
            transform: `translate3d(${headTilt.x}px, ${headTilt.y}px, 0) rotate(${headTilt.r}deg)`,
            transition: 'transform 0.08s ease-out'
          }}
        >
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute w-80 h-80 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

          {/* Acoustic Sound Vibration Rings for Nova */}
          {state === 'speaking' && (
            <div className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center overflow-hidden">
              <div className="absolute w-64 h-64 rounded-full border border-cyan-400/40 animate-ping" style={{ animationDuration: '2s' }} />
              <div className="absolute w-80 h-80 rounded-full border border-blue-400/25 animate-ping" style={{ animationDuration: '2.6s', animationDelay: '0.6s' }} />
            </div>
          )}

          <div className="relative w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 z-20">
            <svg viewBox="0 0 400 400" className="w-full h-full drop-shadow-[0_10px_25px_rgba(0,0,0,0.8)]">
              <defs>
                <linearGradient id="novaSkin" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f8fafc" />
                  <stop offset="70%" stopColor="#e2e8f0" />
                  <stop offset="100%" stopColor="#cbd5e1" />
                </linearGradient>
                <linearGradient id="novaHair" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#0ea5e9" />
                  <stop offset="50%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#6366f1" />
                </linearGradient>
              </defs>

              {/* Head Silhouette */}
              <ellipse cx="200" cy="205" rx="100" ry="125" fill="url(#novaSkin)" />

              {/* Hair Geometry */}
              <path
                d="M 100 180 Q 90 80 200 70 Q 310 80 300 180 Q 285 110 200 100 Q 115 110 100 180 Z"
                fill="url(#novaHair)"
              />

              {/* Eyes */}
              <g transform="translate(150, 185)">
                <ellipse cx="0" cy="0" rx="14" ry={Math.max(1.5, 9 * (1 - blinkProgress))} fill="#0f172a" />
                {blinkProgress < 0.8 && <circle cx="-2" cy="-2" r="3" fill="#ffffff" />}
              </g>
              <g transform="translate(250, 185)">
                <ellipse cx="0" cy="0" rx="14" ry={Math.max(1.5, 9 * (1 - blinkProgress))} fill="#0f172a" />
                {blinkProgress < 0.8 && <circle cx="-2" cy="-2" r="3" fill="#ffffff" />}
              </g>

              {/* Eyebrows */}
              <path
                d={`M 134 ${165 - browRaise * 6} Q 150 ${158 - browRaise * 8} 168 ${165 - browRaise * 6}`}
                fill="none"
                stroke="#334155"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              <path
                d={`M 232 ${165 - browRaise * 6} Q 250 ${158 - browRaise * 8} 266 ${165 - browRaise * 6}`}
                fill="none"
                stroke="#334155"
                strokeWidth="3.5"
                strokeLinecap="round"
              />

              {/* Nose */}
              <path d="M 200 195 L 196 235 L 206 235" fill="none" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" />

              {/* Clean Cyber Soundwave Mouth Line (NO artificial viseme opening) */}
              <g transform="translate(200, 275)">
                <line
                  x1="-24"
                  y1="0"
                  x2="24"
                  y2="0"
                  stroke="#3b82f6"
                  strokeWidth={state === 'speaking' ? '3' : '2'}
                  strokeLinecap="round"
                  className={state === 'speaking' ? 'animate-pulse' : ''}
                  opacity={state === 'speaking' ? '0.95' : '0.75'}
                />
              </g>

              {/* Cyber Accents */}
              <circle cx="120" cy="245" r="2.5" fill="#38bdf8" opacity="0.6" />
              <circle cx="280" cy="245" r="2.5" fill="#38bdf8" opacity="0.6" />
            </svg>
          </div>
        </div>
      )}

      {/* ===================================================================
       * STAGE 3: JARVIS Neural Holographic Core
       * =================================================================== */}
      {selectedPersona === 'jarvis' && (
        <div className="relative w-full h-full flex flex-col items-center justify-center space-y-4">
          <div className="relative w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 rounded-full flex items-center justify-center">
            {/* Concentric Rotating Hologram Rings */}
            <div className="absolute inset-0 rounded-full border-2 border-cyan-400/40 animate-spin" style={{ animationDuration: '10s' }} />
            <div className="absolute inset-3 rounded-full border border-dashed border-blue-400/50 animate-spin" style={{ animationDuration: '16s', animationDirection: 'reverse' }} />
            <div className="absolute inset-6 rounded-full border border-cyan-500/30 animate-pulse" />

            {/* Acoustic Ripple Rings when Speaking */}
            {state === 'speaking' && (
              <div className="absolute inset-0 rounded-full border-2 border-cyan-400/60 animate-ping" style={{ animationDuration: '1.8s' }} />
            )}

            {/* Holographic Glowing Core */}
            <div
              className={`w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 rounded-full flex flex-col items-center justify-center transition-all duration-200 shadow-2xl ${
                state === 'speaking'
                  ? 'bg-gradient-to-tr from-cyan-900 via-blue-800 to-cyan-500 scale-105 shadow-cyan-500/50 ring-4 ring-cyan-400'
                  : state === 'listening'
                  ? 'bg-gradient-to-tr from-slate-900 via-blue-950 to-slate-900 ring-2 ring-blue-400'
                  : 'bg-slate-900 ring-1 ring-cyan-500/40'
              }`}
            >
              <Bot
                className={`w-14 h-14 md:w-18 md:h-18 transition-colors ${
                  state === 'speaking' ? 'text-white animate-pulse' : 'text-cyan-300'
                }`}
              />
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================
       * DYNAMIC SOUND VIBRATION ANIMATION CAPSULE
       * Replaces the lipsyncing overlay with an elegant, responsive soundwave visualizer
       * =================================================================== */}
      <div className="absolute bottom-14 left-1/2 -translate-x-1/2 z-30 pointer-events-none flex items-center justify-center transition-all duration-200">
        {state === 'speaking' ? (
          <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-slate-950/85 backdrop-blur-md border border-emerald-500/60 shadow-xl shadow-emerald-500/25 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-1.5 text-emerald-400 font-mono text-[11px] font-bold tracking-wider uppercase">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
              <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span>Voice</span>
            </div>

            {/* 16-Band Dynamic Sound Vibration Frequency Bars */}
            <div className="flex items-center gap-[3px] h-6 px-1">
              {soundVibrationBands.map((amp, idx) => (
                <span
                  key={idx}
                  className="w-[3px] rounded-full bg-gradient-to-t from-emerald-500 via-teal-300 to-cyan-300 shadow-sm shadow-emerald-400/40"
                  style={{
                    height: `${Math.max(4, amp * 24)}px`,
                    transition: 'height 0.05s ease-out'
                  }}
                />
              ))}
            </div>
          </div>
        ) : state === 'listening' ? (
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-950/80 backdrop-blur-md border border-blue-500/40 shadow-lg shadow-blue-500/15 animate-in fade-in duration-200">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
            <Mic className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
            <span className="text-[11px] font-medium text-blue-300 tracking-wide">Listening to you…</span>
            <div className="flex items-center gap-[2.5px] h-3 ml-1">
              <span className="w-1 h-2 bg-blue-400/80 rounded-full animate-pulse" />
              <span className="w-1 h-3.5 bg-blue-300 rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
              <span className="w-1 h-2 bg-blue-400/80 rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        ) : state === 'evaluating' ? (
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-950/80 backdrop-blur-md border border-amber-500/40 shadow-lg shadow-amber-500/15 animate-in fade-in duration-200">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
            <span className="text-[11px] font-medium text-amber-300 tracking-wide">Analyzing response rubric…</span>
          </div>
        ) : null}
      </div>

      {/* ===================================================================
       * Bottom Interviewer Identification Tag
       * =================================================================== */}
      <div className="absolute bottom-3 left-4 z-30 flex items-center gap-3 px-3.5 py-1.5 rounded-xl bg-slate-950/85 backdrop-blur-md border border-slate-800/80 shadow-lg">
        <span
          className={`w-2.5 h-2.5 rounded-full ${
            state === 'speaking'
              ? 'bg-emerald-400 animate-ping'
              : state === 'listening'
              ? 'bg-blue-400 animate-pulse'
              : state === 'evaluating'
              ? 'bg-amber-400 animate-spin'
              : 'bg-slate-400'
          }`}
        />
        <div>
          <h4 className="font-bold text-xs text-white leading-tight">
            {selectedPersona === 'sarah'
              ? 'Sarah Jenkins'
              : selectedPersona === 'alex'
              ? 'Alex Vance'
              : selectedPersona === 'nova'
              ? 'Nova 3D Digital Human'
              : 'JARVIS Core'}
          </h4>
          <p className="text-[10px] text-slate-400 leading-tight">
            {selectedPersona === 'sarah'
              ? 'Principal System Architect'
              : selectedPersona === 'alex'
              ? 'Senior Staff Tech Lead'
              : selectedPersona === 'nova'
              ? 'AI Evaluator & Code Reviewer'
              : 'Autonomous AI Technical Evaluator'}
          </p>
        </div>
      </div>
    </div>
  );
};
