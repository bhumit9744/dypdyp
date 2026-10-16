import React, { useState, useEffect, useRef } from 'react';
import { Bot, Sparkles, Volume2, Mic, User } from 'lucide-react';
import { InterviewerPanelState } from './InterviewerPanel';

export type AvatarPersona = 'sarah' | 'alex' | 'nova' | 'jarvis';

interface AIFaceAvatarProps {
  state: InterviewerPanelState;
  persona?: AvatarPersona;
  onPersonaChange?: (persona: AvatarPersona) => void;
  className?: string;
}

interface VisemeParams {
  open: number;      // 0.0 (closed) to 1.0 (wide open)
  width: number;     // 0.8 (puckered) to 1.3 (wide smile)
  jaw: number;       // 0.0 to 1.0
  teethVisible: boolean;
  tongueUp: boolean;
  duration: number;  // ms
}

export const AIFaceAvatar: React.FC<AIFaceAvatarProps> = ({
  state,
  persona = 'sarah',
  onPersonaChange,
  className = ''
}) => {
  const [selectedPersona, setSelectedPersona] = useState<AvatarPersona>(persona);

  // Viseme morph state (lerped smoothly at 60fps)
  const [mouthOpen, setMouthOpen] = useState<number>(0);
  const [mouthWidth, setMouthWidth] = useState<number>(1);
  const [jawDrop, setJawDrop] = useState<number>(0);
  const [blinkProgress, setBlinkProgress] = useState<number>(0); // 0 (open) to 1 (closed)
  const [headTilt, setHeadTilt] = useState<{ x: number; y: number; r: number }>({ x: 0, y: 0, r: 0 });
  const [browRaise, setBrowRaise] = useState<number>(0); // 0 (neutral) to 1 (raised)

  // Animation and timing refs
  const animFrameRef = useRef<number | null>(null);
  const currentOpenRef = useRef<number>(0);
  const currentWidthRef = useRef<number>(1);
  const currentJawRef = useRef<number>(0);
  const targetOpenRef = useRef<number>(0);
  const targetWidthRef = useRef<number>(1);
  const targetJawRef = useRef<number>(0);
  const phonemeIndexRef = useRef<number>(0);
  const phonemeExpiryRef = useRef<number>(0);

  // Sync external persona change
  useEffect(() => {
    setSelectedPersona(persona);
  }, [persona]);

  const handleSelectPersona = (p: AvatarPersona) => {
    setSelectedPersona(p);
    if (onPersonaChange) onPersonaChange(p);
  };

  // -------------------------------------------------------------------------
  // 1. Natural Human Eye-Blinking Engine (Realistic 130ms sweep with double-blink)
  // -------------------------------------------------------------------------
  useEffect(() => {
    let blinkTimer: any;
    let isBlinking = false;

    const performBlink = (isDouble = false) => {
      isBlinking = true;
      const startTime = performance.now();
      const blinkDuration = 140; // 140ms full blink cycle

      const stepBlink = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(1, elapsed / blinkDuration);

        // Sinusoidal blink curve (fast close, smooth open)
        let eyeClosure = 0;
        if (progress < 0.4) {
          eyeClosure = progress / 0.4; // closing
        } else {
          eyeClosure = 1 - (progress - 0.4) / 0.6; // opening
        }

        setBlinkProgress(Math.max(0, Math.min(1, eyeClosure)));

        if (progress < 1) {
          requestAnimationFrame(stepBlink);
        } else {
          setBlinkProgress(0);
          isBlinking = false;

          // 18% chance of immediate subtle micro-double blink
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
      // Human blink rate: every 3.2 to 5.4 seconds
      const delay = 3200 + Math.random() * 2200;
      blinkTimer = setTimeout(() => {
        performBlink();
      }, delay);
    };

    scheduleNextBlink();
    return () => clearTimeout(blinkTimer);
  }, []);

  // -------------------------------------------------------------------------
  // 2. Anatomical Phoneme Visemes & 60FPS Fluid Lerp Loop
  // -------------------------------------------------------------------------
  useEffect(() => {
    let active = true;

    // Organic spoken phoneme stream sequence
    const visemePhonemes: VisemeParams[] = [
      { open: 0.85, width: 1.05, jaw: 0.8, teethVisible: true, tongueUp: false, duration: 170 }, // AA (start word)
      { open: 0.35, width: 1.25, jaw: 0.3, teethVisible: true, tongueUp: false, duration: 140 }, // EE
      { open: 0.70, width: 0.88, jaw: 0.65, teethVisible: true, tongueUp: false, duration: 180 }, // OH
      { open: 0.25, width: 1.10, jaw: 0.2, teethVisible: true, tongueUp: true, duration: 130 },  // TH
      { open: 0.60, width: 1.00, jaw: 0.55, teethVisible: true, tongueUp: false, duration: 150 }, // AH
      { open: 0.05, width: 0.96, jaw: 0.05, teethVisible: false, tongueUp: false, duration: 120 }, // MM (word pause)
      { open: 0.45, width: 1.18, jaw: 0.4, teethVisible: true, tongueUp: false, duration: 160 }, // IH
      { open: 0.80, width: 0.95, jaw: 0.75, teethVisible: true, tongueUp: false, duration: 170 }, // AW
      { open: 0.00, width: 1.00, jaw: 0.0, teethVisible: false, tongueUp: false, duration: 160 }, // Breath pause
    ];

    const updateLoop = (now: number) => {
      if (!active) return;

      if (state === 'speaking') {
        // Advance phoneme if current expired
        if (now >= phonemeExpiryRef.current) {
          const nextIndex = (phonemeIndexRef.current + 1) % visemePhonemes.length;
          phonemeIndexRef.current = nextIndex;
          const phoneme = visemePhonemes[nextIndex];

          // Add slight natural duration variance (±20ms)
          const jitter = (Math.random() - 0.5) * 40;
          phonemeExpiryRef.current = now + Math.max(90, phoneme.duration + jitter);

          targetOpenRef.current = phoneme.open;
          targetWidthRef.current = phoneme.width;
          targetJawRef.current = phoneme.jaw;
        }

        // Active speech conversational head movement and eyebrow engagement
        setHeadTilt({
          x: Math.sin(now * 0.0028) * 1.6,
          y: Math.cos(now * 0.0035) * 1.2,
          r: Math.sin(now * 0.002) * 0.8
        });
        setBrowRaise(0.3 + Math.sin(now * 0.002) * 0.15); // raised eyebrows during questions
      } else if (state === 'listening') {
        // Attentive candidate listening: gentle nod & warm micro-smile
        targetOpenRef.current = 0.0;
        targetWidthRef.current = 1.05; // pleasant subtle resting smile
        targetJawRef.current = 0.0;
        setBrowRaise(0.1);

        // Periodic gentle listening nod
        const nodPhase = (now * 0.0018) % (Math.PI * 2);
        const nodY = Math.sin(nodPhase) > 0.4 ? Math.sin(nodPhase * 2) * 2.2 : 0;
        setHeadTilt({
          x: Math.sin(now * 0.001) * 0.8,
          y: nodY,
          r: Math.sin(now * 0.0008) * 0.5
        });
      } else if (state === 'evaluating') {
        // Evaluating / reading candidate response rubric: thoughtful tilt
        targetOpenRef.current = 0.0;
        targetWidthRef.current = 0.98;
        targetJawRef.current = 0.0;
        setBrowRaise(0.0);
        setHeadTilt({
          x: 1.4,
          y: 2.2, // looking down slightly at rubric
          r: 1.2
        });
      } else {
        // Idle ready state: gentle breathing float
        targetOpenRef.current = 0.0;
        targetWidthRef.current = 1.0;
        targetJawRef.current = 0.0;
        setBrowRaise(0.0);
        setHeadTilt({
          x: Math.sin(now * 0.001) * 0.5,
          y: Math.sin(now * 0.0015) * 0.8, // gentle breathing
          r: 0
        });
      }

      // Smooth Spring / Lerp interpolation (35% per frame @ 60fps)
      const lerpSpeed = 0.35;
      currentOpenRef.current += (targetOpenRef.current - currentOpenRef.current) * lerpSpeed;
      currentWidthRef.current += (targetWidthRef.current - currentWidthRef.current) * lerpSpeed;
      currentJawRef.current += (targetJawRef.current - currentJawRef.current) * lerpSpeed;

      setMouthOpen(currentOpenRef.current);
      setMouthWidth(currentWidthRef.current);
      setJawDrop(currentJawRef.current);

      animFrameRef.current = requestAnimationFrame(updateLoop);
    };

    animFrameRef.current = requestAnimationFrame(updateLoop);
    return () => {
      active = false;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [state]);

  // -------------------------------------------------------------------------
  // Persona Facial Rig Specifications (Measured on 16:9 Widescreen Portraits)
  // -------------------------------------------------------------------------
  const personaSpecs = {
    sarah: {
      name: 'Sarah Jenkins',
      role: 'Principal System Architect',
      image: '/avatars/sarah.jpg',
      mouth: {
        top: 44.4,    // % Y center
        left: 50.0,   // % X center
        width: 7.2,   // % W
        height: 2.8,  // % H resting
        skinTone: '#c79d82',
        lipUpper: '#a85a64',
        lipLower: '#be6b76'
      },
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
      mouth: {
        top: 42.6,    // % Y center
        left: 50.0,   // % X center
        width: 8.4,   // % W
        height: 3.0,  // % H resting
        skinTone: '#cb9a7d',
        lipUpper: '#8d5045',
        lipLower: '#a66255'
      },
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
    <div className={`relative w-full h-full flex flex-col items-center justify-center overflow-hidden select-none bg-slate-950 ${className}`}>
      {/* ===================================================================
       * Persona Selector Toolbar (Floating Top-Right)
       * =================================================================== */}
      <div className="absolute top-3 right-3 z-40 flex items-center gap-1.5 p-1 rounded-xl bg-slate-900/85 backdrop-blur-md border border-slate-700/60 shadow-xl">
        <button
          onClick={() => handleSelectPersona('sarah')}
          className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
            selectedPersona === 'sarah'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
          title="Sarah - Principal System Architect"
        >
          <span>👩‍💼 Sarah</span>
        </button>

        <button
          onClick={() => handleSelectPersona('alex')}
          className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
            selectedPersona === 'alex'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
          title="Alex - Senior Staff Tech Lead"
        >
          <span>👨‍💼 Alex</span>
        </button>

        <button
          onClick={() => handleSelectPersona('nova')}
          className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
            selectedPersona === 'nova'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
          title="Nova - Interactive 3D Digital Human"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
          <span>Nova 3D</span>
        </button>

        <button
          onClick={() => handleSelectPersona('jarvis')}
          className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
            selectedPersona === 'jarvis'
              ? 'bg-cyan-600 text-white shadow-md shadow-cyan-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
          title="JARVIS - Holographic Neural Core"
        >
          <Bot className="w-3.5 h-3.5 text-cyan-300" />
          <span>JARVIS</span>
        </button>
      </div>

      {/* ===================================================================
       * STAGE 1: Photorealistic Avatars with Seamless Anatomical Visemes
       * =================================================================== */}
      {isPhotorealistic && currentPhotoConfig && (
        <div
          className="relative w-full h-full flex items-center justify-center overflow-hidden"
          style={{
            transform: `translate3d(${headTilt.x}px, ${headTilt.y}px, 0) rotate(${headTilt.r}deg)`,
            transition: 'transform 0.08s ease-out'
          }}
        >
          {/* High-Definition 8K Studio Portrait Base */}
          <img
            src={currentPhotoConfig.image}
            alt={currentPhotoConfig.name}
            className="w-full h-full object-cover object-center filter brightness-[0.98] contrast-[1.02]"
            draggable={false}
          />

          {/* ---------------------------------------------------------------
           * Realistic Eyelid Blinking Mechanism
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
           * Seamless Anatomical Lip-Syncing Rig
           * Only renders dynamic inner cavity and articulating lips when speaking
           * --------------------------------------------------------------- */}
          {mouthOpen > 0.08 && (
            <div
              className="absolute pointer-events-none z-20 flex items-center justify-center transition-transform"
              style={{
                top: `${currentPhotoConfig.mouth.top + jawDrop * 0.4}%`,
                left: `${currentPhotoConfig.mouth.left}%`,
                width: `${currentPhotoConfig.mouth.width * mouthWidth}%`,
                height: `${Math.max(1.2, currentPhotoConfig.mouth.height * (1.2 + mouthOpen * 1.8))}%`,
                transform: 'translate(-50%, -50%)',
                // Feathered radial mask so edges melt seamlessly into facial skin with NO hard borders
                WebkitMaskImage: 'radial-gradient(ellipse 90% 85% at center, black 50%, rgba(0,0,0,0.8) 75%, transparent 100%)',
                maskImage: 'radial-gradient(ellipse 90% 85% at center, black 50%, rgba(0,0,0,0.8) 75%, transparent 100%)'
              }}
            >
              {/* Full Anatomical SVG Mouth Rig (Upper Lip, Lower Lip, Teeth, Tongue, Cavity) */}
              <svg
                viewBox="0 0 200 100"
                className="w-full h-full overflow-visible"
                preserveAspectRatio="none"
              >
                <defs>
                  {/* Pearlescent Teeth Gradient */}
                  <linearGradient id="teethGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ffffff" />
                    <stop offset="60%" stopColor="#f1f5f9" />
                    <stop offset="100%" stopColor="#cbd5e1" />
                  </linearGradient>

                  {/* Deep Throat Oral Cavity Gradient */}
                  <radialGradient id="cavityGrad" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#1a0408" />
                    <stop offset="70%" stopColor="#2b0a12" />
                    <stop offset="100%" stopColor="#3d101b" />
                  </radialGradient>

                  {/* Soft Tongue Gradient */}
                  <linearGradient id="tongueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#c56172" />
                    <stop offset="100%" stopColor="#963e4e" />
                  </linearGradient>
                </defs>

                {/* 1. Deep Oral Cavity */}
                <ellipse
                  cx="100"
                  cy="50"
                  rx={85 * mouthWidth}
                  ry={Math.max(12, 38 * mouthOpen)}
                  fill="url(#cavityGrad)"
                />

                {/* 2. Upper Teeth Row (Visible when mouth drops) */}
                <path
                  d={`M ${100 - 58 * mouthWidth} ${32}
                     Q 100 ${36} ${100 + 58 * mouthWidth} ${32}
                     L ${100 + 50 * mouthWidth} ${44 + mouthOpen * 4}
                     Q 100 ${48 + mouthOpen * 4} ${100 - 50 * mouthWidth} ${44 + mouthOpen * 4} Z`}
                  fill="url(#teethGrad)"
                  opacity={Math.min(1, mouthOpen * 1.6)}
                />

                {/* Subtle Tooth Separation Lines */}
                {mouthOpen > 0.25 && (
                  <g opacity="0.35" stroke="#94a3b8" strokeWidth="0.8">
                    <line x1="100" y1="36" x2="100" y2="47" />
                    <line x1="90" y1="35" x2="89" y2="46" />
                    <line x1="110" y1="35" x2="111" y2="46" />
                    <line x1="80" y1="34" x2="79" y2="44" />
                    <line x1="120" y1="34" x2="121" y2="44" />
                  </g>
                )}

                {/* 3. Tongue Arch at Bottom of Cavity */}
                {mouthOpen > 0.3 && (
                  <ellipse
                    cx="100"
                    cy={70 + (1 - mouthOpen) * 6}
                    rx={48 * mouthWidth}
                    ry={18 * mouthOpen}
                    fill="url(#tongueGrad)"
                  />
                )}

                {/* 4. Upper Lip (Cupid's Bow Contour matching face tone) */}
                <path
                  d={`M ${100 - 82 * mouthWidth} 48
                     Q ${100 - 42 * mouthWidth} ${30 - browRaise * 3} 94 ${34}
                     Q 100 ${37} 106 ${34}
                     Q ${100 + 42 * mouthWidth} ${30 - browRaise * 3} ${100 + 82 * mouthWidth} 48
                     Q 100 ${44 - mouthOpen * 6} ${100 - 82 * mouthWidth} 48 Z`}
                  fill={currentPhotoConfig.mouth.lipUpper}
                  opacity="0.95"
                />

                {/* 5. Lower Lip (Full natural contour matching face tone) */}
                <path
                  d={`M ${100 - 82 * mouthWidth} 50
                     Q 100 ${52 + mouthOpen * 6} ${100 + 82 * mouthWidth} 50
                     Q 100 ${72 + mouthOpen * 20} ${100 - 82 * mouthWidth} 50 Z`}
                  fill={currentPhotoConfig.mouth.lipLower}
                  opacity="0.95"
                />

                {/* Lower Lip Specular Highlight */}
                <ellipse
                  cx="100"
                  cy={56 + mouthOpen * 14}
                  rx={26 * mouthWidth}
                  ry={3.5}
                  fill="rgba(255, 230, 230, 0.3)"
                />
              </svg>
            </div>
          )}

          {/* Cinematic Vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-slate-950/20 pointer-events-none" />
        </div>
      )}

      {/* ===================================================================
       * STAGE 2: NOVA 3D — Cutting-Edge Interactive Vector Digital Human
       * =================================================================== */}
      {selectedPersona === 'nova' && (
        <div
          className="relative w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950"
          style={{
            transform: `translate3d(${headTilt.x * 1.5}px, ${headTilt.y * 1.5}px, 0) rotate(${headTilt.r * 1.2}deg)`,
            transition: 'transform 0.08s ease-out'
          }}
        >
          {/* Interactive 3D Vector Head Rig */}
          <div className="relative w-72 h-80 sm:w-80 sm:h-92 md:w-96 md:h-108 flex items-center justify-center">
            <svg
              viewBox="0 0 400 480"
              className="w-full h-full filter drop-shadow-[0_15px_35px_rgba(30,58,138,0.35)]"
            >
              <defs>
                {/* 3D Skin Shading Gradient */}
                <radialGradient id="novaSkin" cx="48%" cy="40%" r="65%">
                  <stop offset="0%" stopColor="#fde047" stopOpacity="0.15" />
                  <stop offset="25%" stopColor="#e2e8f0" />
                  <stop offset="70%" stopColor="#94a3b8" />
                  <stop offset="100%" stopColor="#475569" />
                </radialGradient>

                {/* Cyber Hair Shading */}
                <linearGradient id="novaHair" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#38bdf8" />
                  <stop offset="40%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#1e1b4b" />
                </linearGradient>

                {/* Glowing Iris Gradient */}
                <radialGradient id="novaIris" cx="45%" cy="45%" r="55%">
                  <stop offset="0%" stopColor="#a5f3fc" />
                  <stop offset="45%" stopColor="#06b6d4" />
                  <stop offset="85%" stopColor="#0369a1" />
                  <stop offset="100%" stopColor="#082f49" />
                </radialGradient>

                {/* Lip Gradient */}
                <linearGradient id="novaLip" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f472b6" />
                  <stop offset="100%" stopColor="#db2777" />
                </linearGradient>

                {/* Soft Shadow */}
                <filter id="novaGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="6" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* 1. Neck and Collar */}
              <path
                d="M 160 360 L 160 440 L 240 440 L 240 360 Z"
                fill="#64748b"
              />
              <path
                d="M 120 440 Q 200 470 280 440 L 320 480 L 80 480 Z"
                fill="#1e293b"
                stroke="#38bdf8"
                strokeWidth="1.5"
              />

              {/* 2. Face Base & Jawline */}
              <path
                d={`M 110 160
                   C 105 280 130 380 200 ${390 + jawDrop * 12}
                   C 270 380 295 280 290 160
                   C 285 70 115 70 110 160 Z`}
                fill="url(#novaSkin)"
                stroke="#0ea5e9"
                strokeWidth="1.5"
              />

              {/* 3. Sleek Cyber Hair */}
              <path
                d="M 95 180 C 85 90 140 40 200 40 C 270 40 320 90 305 180 C 290 120 270 95 200 95 C 130 95 110 120 95 180 Z"
                fill="url(#novaHair)"
                filter="url(#novaGlow)"
              />

              {/* 4. Left Eye & Iris */}
              <g transform="translate(150, 205)">
                {/* Sclera (White) */}
                <ellipse cx="0" cy="0" rx="22" ry={14 * (1 - blinkProgress)} fill="#f8fafc" />
                {/* Glowing Iris */}
                {blinkProgress < 0.8 && (
                  <>
                    <circle cx={headTilt.x * 1.5} cy={headTilt.y * 1.5} r="10" fill="url(#novaIris)" />
                    <circle cx={headTilt.x * 1.5} cy={headTilt.y * 1.5} r="5" fill="#0f172a" />
                    <circle cx={headTilt.x * 1.5 - 3} cy={headTilt.y * 1.5 - 3} r="2.5" fill="#ffffff" />
                  </>
                )}
                {/* Eyelid on Blink */}
                {blinkProgress > 0.1 && (
                  <ellipse cx="0" cy={-14 + 14 * blinkProgress} rx="23" ry={14 * blinkProgress} fill="#64748b" />
                )}
                {/* Upper Eyelash Line */}
                <path d="M -23 -1 Q 0 -15 23 -1" stroke="#0f172a" strokeWidth="2.5" fill="none" />
              </g>

              {/* 5. Right Eye & Iris */}
              <g transform="translate(250, 205)">
                {/* Sclera */}
                <ellipse cx="0" cy="0" rx="22" ry={14 * (1 - blinkProgress)} fill="#f8fafc" />
                {/* Glowing Iris */}
                {blinkProgress < 0.8 && (
                  <>
                    <circle cx={headTilt.x * 1.5} cy={headTilt.y * 1.5} r="10" fill="url(#novaIris)" />
                    <circle cx={headTilt.x * 1.5} cy={headTilt.y * 1.5} r="5" fill="#0f172a" />
                    <circle cx={headTilt.x * 1.5 - 3} cy={headTilt.y * 1.5 - 3} r="2.5" fill="#ffffff" />
                  </>
                )}
                {/* Eyelid on Blink */}
                {blinkProgress > 0.1 && (
                  <ellipse cx="0" cy={-14 + 14 * blinkProgress} rx="23" ry={14 * blinkProgress} fill="#64748b" />
                )}
                {/* Upper Eyelash Line */}
                <path d="M -23 -1 Q 0 -15 23 -1" stroke="#0f172a" strokeWidth="2.5" fill="none" />
              </g>

              {/* 6. Expressive Eyebrows */}
              <path
                d={`M 125 ${180 - browRaise * 8} Q 150 ${165 - browRaise * 10} 175 ${178 - browRaise * 6}`}
                stroke="#0f172a"
                strokeWidth="4"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d={`M 225 ${178 - browRaise * 6} Q 250 ${165 - browRaise * 10} 275 ${180 - browRaise * 8}`}
                stroke="#0f172a"
                strokeWidth="4"
                strokeLinecap="round"
                fill="none"
              />

              {/* 7. Nose */}
              <path
                d="M 200 205 L 195 260 Q 200 268 205 260 Z"
                fill="none"
                stroke="#64748b"
                strokeWidth="2"
                strokeLinecap="round"
              />

              {/* 8. Fully Articulated Viseme Mouth */}
              <g transform={`translate(200, ${315 + jawDrop * 8})`}>
                {/* Oral Cavity */}
                {mouthOpen > 0.05 && (
                  <ellipse
                    cx="0"
                    cy="0"
                    rx={38 * mouthWidth}
                    ry={Math.max(6, 22 * mouthOpen)}
                    fill="#1e1014"
                  />
                )}

                {/* Upper Teeth */}
                {mouthOpen > 0.1 && (
                  <rect
                    x={-24 * mouthWidth}
                    y={-14 * mouthOpen}
                    width={48 * mouthWidth}
                    height={9}
                    rx="3"
                    fill="#ffffff"
                  />
                )}

                {/* Tongue */}
                {mouthOpen > 0.35 && (
                  <ellipse
                    cx="0"
                    cy={12 * mouthOpen}
                    rx={20 * mouthWidth}
                    ry={7 * mouthOpen}
                    fill="#ec4899"
                  />
                )}

                {/* Upper Lip */}
                <path
                  d={`M ${-42 * mouthWidth} 0
                     Q ${-20 * mouthWidth} ${-10 - mouthOpen * 4} 0 ${-6}
                     Q ${20 * mouthWidth} ${-10 - mouthOpen * 4} ${42 * mouthWidth} 0
                     Q 0 ${-2 + mouthOpen * 2} ${-42 * mouthWidth} 0 Z`}
                  fill="url(#novaLip)"
                />

                {/* Lower Lip */}
                <path
                  d={`M ${-42 * mouthWidth} 0
                     Q 0 ${4 + mouthOpen * 2} ${42 * mouthWidth} 0
                     Q 0 ${16 + mouthOpen * 16} ${-42 * mouthWidth} 0 Z`}
                  fill="url(#novaLip)"
                />
              </g>

              {/* Subtle Tech Cyber Cheek Accents */}
              <circle cx="120" cy="280" r="2.5" fill="#38bdf8" opacity="0.6" />
              <circle cx="280" cy="280" r="2.5" fill="#38bdf8" opacity="0.6" />
              <line x1="115" y1="290" x2="135" y2="290" stroke="#38bdf8" strokeWidth="1" opacity="0.4" />
              <line x1="265" y1="290" x2="285" y2="290" stroke="#38bdf8" strokeWidth="1" opacity="0.4" />
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

            {/* Holographic Glowing Core */}
            <div className={`w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 rounded-full flex flex-col items-center justify-center transition-all duration-200 shadow-2xl ${
              state === 'speaking'
                ? 'bg-gradient-to-tr from-cyan-900 via-blue-800 to-cyan-500 scale-105 shadow-cyan-500/50 ring-4 ring-cyan-400'
                : state === 'listening'
                ? 'bg-gradient-to-tr from-slate-900 via-blue-950 to-slate-900 ring-2 ring-blue-400'
                : 'bg-slate-900 ring-1 ring-cyan-500/40'
            }`}>
              <Bot className={`w-14 h-14 md:w-18 md:h-18 transition-colors ${
                state === 'speaking' ? 'text-white animate-pulse' : 'text-cyan-300'
              }`} />

              {/* Dynamic Soundwave Viseme Bars inside JARVIS Core */}
              {state === 'speaking' && (
                <div className="flex items-center gap-1 mt-2">
                  <span className="w-1.5 h-3 bg-cyan-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-6 bg-white rounded-full animate-bounce" style={{ animationDelay: '100ms' }} />
                  <span className="w-1.5 h-4 bg-cyan-300 rounded-full animate-bounce" style={{ animationDelay: '200ms' }} />
                  <span className="w-1.5 h-7 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-3 bg-cyan-300 rounded-full animate-bounce" style={{ animationDelay: '250ms' }} />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================
       * Bottom Interviewer Identification Tag
       * =================================================================== */}
      <div className="absolute bottom-3 left-4 z-30 flex items-center gap-3 px-3.5 py-1.5 rounded-xl bg-slate-950/85 backdrop-blur-md border border-slate-800/80 shadow-lg">
        <span className={`w-2.5 h-2.5 rounded-full ${
          state === 'speaking'
            ? 'bg-emerald-400 animate-ping'
            : state === 'listening'
            ? 'bg-blue-400 animate-pulse'
            : state === 'evaluating'
            ? 'bg-amber-400 animate-spin'
            : 'bg-slate-400'
        }`} />
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
