import React, { useEffect, useRef, useState } from 'react';
import { VideoOff, Loader2, AlertCircle } from 'lucide-react';

interface LocalVideoPreviewProps {
  stream: MediaStream | null;
  /** Bumped by the call hook whenever tracks change; rebinds srcObject. */
  streamVersion?: number;
  cameraEnabled: boolean;
  phase: 'idle' | 'initializing' | 'ready' | 'error';
  mirrored?: boolean;
  className?: string;
  micLevel?: number;
  micEnabled?: boolean;
  /**
   * Optional externally-owned video ref (e.g. for canvas frame capture).
   * When provided it is used as the video element ref instead of the internal one.
   */
  videoRef?: React.MutableRefObject<HTMLVideoElement | null>;
}

/**
 * LocalVideoPreview — renders the student's real live webcam feed via srcObject.
 * Mirrored by default (self-view convention). Never renders a static image.
 */
export const LocalVideoPreview: React.FC<LocalVideoPreviewProps> = ({
  stream,
  streamVersion = 0,
  cameraEnabled,
  phase,
  mirrored = true,
  className = '',
  micLevel = 0,
  micEnabled,
  videoRef: externalVideoRef
}) => {
  const internalVideoRef = useRef<HTMLVideoElement | null>(null);
  const videoRef = externalVideoRef ?? internalVideoRef;
  const [isMirrored, setIsMirrored] = useState(mirrored);

  // Bind the live MediaStream to the video element and keep it bound across re-mounts.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (stream && cameraEnabled) {
      video.srcObject = stream;
      video.play().catch(() => {
        /* autoplay may reject if muted playback is blocked; muted preview avoids this */
      });
    } else {
      video.srcObject = null;
    }
  }, [stream, streamVersion, cameraEnabled, phase]);

  const showVideo = cameraEnabled && stream && phase === 'ready';
  const showInitializing = phase === 'initializing';
  const showError = phase === 'error';
  const showCameraOff = phase === 'ready' && !cameraEnabled;

  const liveRing = micLevel > 8;

  return (
    <div className={`relative aspect-video rounded-2xl bg-slate-900 overflow-hidden border border-slate-200 dark:border-slate-800 ${className}`}>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className={`w-full h-full object-cover transform transition-transform duration-300 ${isMirrored ? '-scale-x-100' : ''} ${
          showVideo ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Mic level indicator */}
      {showVideo && micEnabled !== undefined && (
        <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-900/80 backdrop-blur-sm border border-slate-700/50">
          <span className={`h-1.5 w-1.5 rounded-full transition-colors ${liveRing ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
          <span className="text-[10px] font-mono text-slate-300">{Math.max(4, micLevel)}%</span>
        </div>
      )}

      {/* Candidate "You" badge & Mirror toggle */}
      {showVideo && (
        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between pointer-events-none">
          <span className="px-2 py-0.5 rounded-md bg-slate-900/80 backdrop-blur-sm text-[10px] font-medium text-slate-300 border border-slate-700/50">
            You
          </span>
          <button
            type="button"
            onClick={() => setIsMirrored((m) => !m)}
            className="pointer-events-auto p-1 rounded-md bg-slate-900/80 hover:bg-slate-800 text-slate-300 text-[10px] font-medium border border-slate-700/50 transition-colors"
            title={isMirrored ? 'Unmirror preview' : 'Mirror preview'}
            aria-label={isMirrored ? 'Unmirror preview' : 'Mirror preview'}
          >
            {isMirrored ? 'Flip' : 'Normal'}
          </button>
        </div>
      )}

      {/* Camera off placeholder */}
      {showCameraOff && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 text-xs space-y-1.5 bg-slate-900">
          <VideoOff className="w-6 h-6 text-slate-500" />
          <span className="text-[11px] font-medium text-slate-400">Camera off</span>
        </div>
      )}

      {/* Loading / initializing */}
      {showInitializing && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 text-xs space-y-1.5 bg-slate-900">
          <Loader2 className="w-5 h-5 animate-spin text-brand-400" />
          <span className="text-[11px] font-medium text-slate-400">Connecting…</span>
        </div>
      )}

      {/* Error state */}
      {showError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 text-xs space-y-1.5 bg-slate-900 p-2 text-center">
          <AlertCircle className="w-5 h-5 text-rose-400" />
          <span className="text-[11px] font-medium text-rose-300">Camera unavailable</span>
        </div>
      )}
    </div>
  );
};
