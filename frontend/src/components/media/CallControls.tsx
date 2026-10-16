import React from 'react';
import { Mic, MicOff, Video, VideoOff, PhoneOff, RefreshCw, Phone } from 'lucide-react';

export type CallPhase = 'idle' | 'initializing' | 'ready' | 'error';

interface CallControlsProps {
  phase: CallPhase;
  cameraEnabled: boolean;
  micEnabled: boolean;
  canFlipCamera: boolean;
  isFlippingCamera: boolean;
  onJoin: () => void;
  onLeave: () => void;
  onToggleCamera: () => void;
  onToggleMic: () => void;
  onFlipCamera: () => void;
  disabled?: boolean;
  className?: string;
}

/**
 * CallControls — bottom toolbar for the interview call. Each button acts on the
 * real media tracks via the call hook (never purely visual state).
 */
export const CallControls: React.FC<CallControlsProps> = ({
  phase,
  cameraEnabled,
  micEnabled,
  canFlipCamera,
  isFlippingCamera,
  onJoin,
  onLeave,
  onToggleCamera,
  onToggleMic,
  onFlipCamera,
  disabled = false,
  className = ''
}) => {
  const isLive = phase === 'ready';

  const baseBtn =
    'flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 disabled:opacity-40 disabled:cursor-not-allowed select-none';

  const toggleCls = (active: boolean) =>
    active
      ? 'bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700/60'
      : 'bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/40';

  return (
    <div className={`flex items-center justify-center gap-2 sm:gap-2.5 p-2 rounded-2xl bg-slate-900/90 backdrop-blur-md border border-slate-800 shadow-lg ${className}`}>
      {/* Join button (pre-call only) */}
      {!isLive && (
        <button
          type="button"
          onClick={onJoin}
          disabled={disabled || phase === 'initializing'}
          className={`${baseBtn} px-5 py-3 bg-brand-600 hover:bg-brand-500 text-white shadow-sm`}
        >
          <Phone className="w-4 h-4" />
          {phase === 'initializing' ? 'Starting…' : 'Join Interview'}
        </button>
      )}

      {/* Mic toggle */}
      <button
        type="button"
        onClick={onToggleMic}
        disabled={!isLive || disabled}
        aria-pressed={!micEnabled}
        aria-label={micEnabled ? 'Mute microphone' : 'Unmute microphone'}
        title={micEnabled ? 'Mute microphone' : 'Unmute microphone'}
        className={`${baseBtn} ${toggleCls(micEnabled)}`}
      >
        {micEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
        <span className="hidden sm:inline">{micEnabled ? 'Mic on' : 'Muted'}</span>
      </button>

      {/* Camera toggle */}
      <button
        type="button"
        onClick={onToggleCamera}
        disabled={!isLive || disabled}
        aria-pressed={!cameraEnabled}
        aria-label={cameraEnabled ? 'Turn camera off' : 'Turn camera on'}
        title={cameraEnabled ? 'Turn camera off' : 'Turn camera on'}
        className={`${baseBtn} ${toggleCls(cameraEnabled)}`}
      >
        {cameraEnabled ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
        <span className="hidden sm:inline">{cameraEnabled ? 'Camera on' : 'Camera off'}</span>
      </button>

      {/* Camera flip (front/rear) */}
      <button
        type="button"
        onClick={onFlipCamera}
        disabled={!isLive || !canFlipCamera || disabled || isFlippingCamera}
        aria-label="Switch between front and rear cameras"
        title={canFlipCamera ? 'Switch camera' : 'No alternative camera detected'}
        className={`${baseBtn} bg-slate-800 hover:bg-slate-700 text-slate-100`}
      >
        <RefreshCw className={`w-4 h-4 ${isFlippingCamera ? 'animate-spin' : ''}`} />
        <span className="hidden md:inline">{isFlippingCamera ? 'Switching…' : 'Switch camera'}</span>
      </button>

      {/* Leave / End call */}
      {isLive && (
        <button
          type="button"
          onClick={onLeave}
          disabled={disabled}
          aria-label="End interview call"
          title="End call"
          className={`${baseBtn} px-5 py-3 bg-rose-600 hover:bg-rose-500 text-white shadow-sm`}
        >
          <PhoneOff className="w-4 h-4" />
          <span className="hidden sm:inline">End Call</span>
        </button>
      )}
    </div>
  );
};
