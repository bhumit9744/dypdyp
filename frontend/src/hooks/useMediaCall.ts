import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * useMediaCall — real webcam/microphone call session for the AI Interview Studio.
 *
 * Owns the single MediaStream for the local call. All control actions act on the
 * actual media tracks (stopping/re-acquiring the video track, toggling audio
 * track.enabled, flipping the camera by acquiring a replacement track). Nothing
 * here records, uploads, or forwards the stream to any other service.
 */

export type MediaCallPhase = 'idle' | 'initializing' | 'ready' | 'error';

export type MediaCallErrorKind =
  | 'permission'
  | 'no-device'
  | 'device-busy'
  | 'not-secure'
  | 'unsupported'
  | 'overconstrained'
  | 'unknown';

export interface MediaCallError {
  kind: MediaCallErrorKind;
  title: string;
  message: string;
  instructions: string;
}

export interface UseMediaCallOptions {
  /** Interval (ms) at which the mic level is sampled for UI meters. */
  micLevelIntervalMs?: number;
}

export interface UseMediaCallReturn {
  phase: MediaCallPhase;
  error: MediaCallError | null;
  /** Live local MediaStream while phase === 'ready'; null otherwise. */
  stream: MediaStream | null;
  /** Bumped whenever the stream/tracks change so consumers can rebind srcObject. */
  streamVersion: number;
  cameraEnabled: boolean;
  micEnabled: boolean;
  /** True while phase === 'ready' and the mic is not muted (drives listening indicators). */
  isMicActive: boolean;
  /** 0–100 sampled mic level; 0 when inactive. */
  micLevel: number;
  /** True when the current stream's video track can face the environment (rear camera). */
  canFlipCamera: boolean;
  isFlippingCamera: boolean;
  join: () => Promise<void>;
  leave: () => void;
  toggleCamera: () => Promise<void>;
  toggleMic: () => void;
  flipCamera: () => Promise<void>;
}

/** Errors that are expected to recover with basic (unconstrained) video settings. */
const RETRY_WITH_BASIC_VIDEO = new Set(['overconstrained', 'not-secure']);

function describeMediaError(err: unknown): MediaCallError {
  const name = (err as { name?: string } | null)?.name ?? '';
  const raw = (err as { message?: string } | null)?.message ?? 'An unknown browser error occurred.';

  switch (name) {
    case 'NotAllowedError':
    case 'PermissionDeniedError':
      return {
        kind: 'permission',
        title: 'Camera or microphone access denied',
        message: 'The browser blocked access to your camera and/or microphone for this site.',
        instructions:
          'Click the camera/lock icon in your browser address bar, set Camera and Microphone to "Allow" for this site, then click Join again. In Chrome/Edge you can also open Settings → Privacy and security → Site settings.'
      };
    case 'NotFoundError':
    case 'DevicesNotFoundError':
      return {
        kind: 'no-device',
        title: 'No camera or microphone found',
        message: 'Your device does not expose a usable camera or microphone.',
        instructions:
          'Connect a webcam/microphone (or enable the built-in one) and make sure it is not disabled in your operating system privacy settings, then click Join again.'
      };
    case 'NotReadableError':
    case 'TrackStartError':
      return {
        kind: 'device-busy',
        title: 'Camera or microphone is already in use',
        message: 'Another application on this computer is currently holding the device.',
        instructions:
          'Close other apps using the camera (video meeting tools, camera viewers), then click Join again.'
      };
    case 'OverconstrainedError':
    case 'ConstraintNotSatisfiedError':
      return {
        kind: 'overconstrained',
        title: 'Camera settings not supported',
        message: 'Your camera could not satisfy the requested video settings.',
        instructions: 'Click Join again to retry with basic camera settings.'
      };
    case 'SecurityError':
      return {
        kind: 'not-secure',
        title: 'Camera requires a secure connection',
        message: 'getUserMedia is only available on HTTPS or localhost pages.',
        instructions:
          'Open Placement Hub over https:// (or http://localhost) and click Join again.'
      };
    case 'AbortError':
      return {
        kind: 'unknown',
        title: 'Device initialization aborted',
        message: 'The browser aborted access to your camera or microphone.',
        instructions: 'Click Join again. If this repeats, restart your browser.'
      };
    default:
      return {
        kind: 'unknown',
        title: 'Could not start camera and microphone',
        message: raw,
        instructions: 'Click Join again to retry. If this repeats, check your browser device permissions.'
      };
  }
}

const UNSUPPORTED_ERROR: MediaCallError = {
  kind: 'unsupported',
  title: 'Camera APIs unavailable',
  message: 'This browser does not expose the navigator.mediaDevices APIs required for the interview room.',
  instructions:
    'Use a recent version of Chrome, Edge, Firefox or Safari. On iOS, camera access requires Safari (in-app browsers cannot open the camera).'
};

export function useMediaCall(options: UseMediaCallOptions = {}): UseMediaCallReturn {
  const { micLevelIntervalMs = 100 } = options;

  const [phase, setPhase] = useState<MediaCallPhase>('idle');
  const [error, setError] = useState<MediaCallError | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [streamVersion, setStreamVersion] = useState(0);
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [micEnabled, setMicEnabled] = useState(true);
  const [micLevel, setMicLevel] = useState(0);
  const [canFlipCamera, setCanFlipCamera] = useState(false);
  const [isFlippingCamera, setIsFlippingCamera] = useState(false);

  // Refs mirror the state above so callbacks never read stale values.
  const streamRef = useRef<MediaStream | null>(null);
  const phaseRef = useRef<MediaCallPhase>('idle');
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const micRafRef = useRef<number | null>(null);
  const micLevelDataRef = useRef<Uint8Array | null>(null);
  const micLevelLastUpdateRef = useRef(0);
  const joinedRef = useRef(false);

  const setPhaseBoth = useCallback((p: MediaCallPhase) => {
    phaseRef.current = p;
    setPhase(p);
  }, []);

  const clearMicMeter = useCallback(() => {
    if (micRafRef.current !== null) {
      cancelAnimationFrame(micRafRef.current);
      micRafRef.current = null;
    }
    analyserRef.current = null;
    micLevelDataRef.current = null;
    setMicLevel(0);
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(() => {});
    }
    audioContextRef.current = null;
  }, []);

  const startMicMeter = useCallback(
    (mediaStream: MediaStream) => {
      clearMicMeter();
      try {
        const Ctor: typeof AudioContext | undefined =
          window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
        if (!Ctor) return;
        const audioCtx = new Ctor();
        const source = audioCtx.createMediaStreamSource(mediaStream);
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 64;
        source.connect(analyser);
        audioContextRef.current = audioCtx;
        analyserRef.current = analyser;
        micLevelDataRef.current = new Uint8Array(analyser.frequencyBinCount);

        const sample = (timestamp: number) => {
          const currentAnalyser = analyserRef.current;
          const data = micLevelDataRef.current;
          if (!currentAnalyser || !data) return;
          micRafRef.current = requestAnimationFrame(sample);
          if (timestamp - micLevelLastUpdateRef.current < micLevelIntervalMs) return;
          micLevelLastUpdateRef.current = timestamp;
          currentAnalyser.getByteFrequencyData(data as any);
          let sum = 0;
          for (let i = 0; i < data.length; i++) sum += data[i];
          const avg = sum / data.length;
          setMicLevel(Math.min(100, Math.round((avg / 128) * 100)));
        };
        micRafRef.current = requestAnimationFrame(sample);
      } catch (audioErr) {
        // The volume meter is cosmetic; the call continues without it.
        console.warn('Web Audio mic meter could not be initialized:', audioErr);
      }
    },
    [clearMicMeter, micLevelIntervalMs]
  );

  /** Rebind the meter when the audio track is replaced (camera flip keeps audio). */
  useEffect(() => {
    if (stream && micEnabled) {
      startMicMeter(stream);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [streamVersion]);

  useEffect(() => () => clearMicMeter(), [clearMicMeter]);

  const stopStreamTracks = useCallback((mediaStream: MediaStream) => {
    mediaStream.getTracks().forEach((track) => track.stop());
  }, []);

  const hasMediaDevices = typeof navigator !== 'undefined' && !!navigator.mediaDevices?.getUserMedia;

  const evaluateCameraFlip = useCallback((mediaStream: MediaStream) => {
    // Flipping needs either a second video input device or a facingMode-capable camera.
    const facingMode = mediaStream
      .getVideoTracks()
      .map((t) => t.getSettings?.().facingMode)
      .find(Boolean);
    const hasSecondDevice =
      typeof navigator !== 'undefined' &&
      !!navigator.mediaDevices?.enumerateDevices &&
      !!navigator.mediaDevices
        .enumerateDevices()
        .then((devices) => devices.filter((d) => d.kind === 'videoinput').length > 1)
        .catch(() => false);
    void hasSecondDevice;
    // Decide asynchronously; keep this dependency-free for the caller.
    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.enumerateDevices) {
      setCanFlipCamera(false);
      return;
    }
    navigator.mediaDevices
      .enumerateDevices()
      .then((devices) => {
        const videoInputs = devices.filter((d) => d.kind === 'videoinput');
        setCanFlipCamera(videoInputs.length > 1 || facingMode === 'user' || facingMode === 'environment');
      })
      .catch(() => setCanFlipCamera(!!facingMode));
  }, []);

  const join = useCallback(async () => {
    if (!hasMediaDevices) {
      setError(UNSUPPORTED_ERROR);
      setPhaseBoth('error');
      return;
    }
    // Guard: never acquire a second stream / duplicate permission prompt.
    if (joinedRef.current || streamRef.current) return;
    if (phaseRef.current === 'initializing') return;

    setError(null);
    setPhaseBoth('initializing');
    joinedRef.current = true;

    const basicVideo: MediaTrackConstraints = { facingMode: 'user' };
    const richVideo: MediaTrackConstraints = {
      facingMode: 'user',
      width: { ideal: 1280 },
      height: { ideal: 720 }
    };

    try {
      let mediaStream: MediaStream;
      try {
        mediaStream = await navigator.mediaDevices.getUserMedia({ video: richVideo, audio: true });
      } catch (firstErr) {
        const described = describeMediaError(firstErr);
        if (RETRY_WITH_BASIC_VIDEO.has(described.kind)) {
          mediaStream = await navigator.mediaDevices.getUserMedia({ video: basicVideo, audio: true });
        } else {
          throw firstErr;
        }
      }

      streamRef.current = mediaStream;
      setStream(mediaStream);
      setStreamVersion((v) => v + 1);
      setCameraEnabled(true);
      setMicEnabled(true);
      startMicMeter(mediaStream);
      evaluateCameraFlip(mediaStream);
      setPhaseBoth('ready');
    } catch (err) {
      joinedRef.current = false;
      setError(describeMediaError(err));
      setPhaseBoth('error');
    }
  }, [evaluateCameraFlip, hasMediaDevices, setPhaseBoth, startMicMeter]);

  const leave = useCallback(() => {
    clearMicMeter();
    if (streamRef.current) {
      stopStreamTracks(streamRef.current);
    }
    streamRef.current = null;
    joinedRef.current = false;
    setStream(null);
    setCameraEnabled(true);
    setMicEnabled(true);
    setCanFlipCamera(false);
    setIsFlippingCamera(false);
    setError(null);
    setStreamVersion((v) => v + 1);
    setPhaseBoth('idle');
  }, [clearMicMeter, setPhaseBoth, stopStreamTracks]);

  const toggleCamera = useCallback(async () => {
    const mediaStream = streamRef.current;
    if (!mediaStream || phaseRef.current !== 'ready') return;

    const videoTrack = mediaStream.getVideoTracks()[0];
    if (cameraEnabled && videoTrack) {
      // Fully stop the video track so the camera hardware indicator turns off.
      videoTrack.stop();
      mediaStream.removeTrack(videoTrack);
      setCameraEnabled(false);
      setStreamVersion((v) => v + 1);
      return;
    }

    if (!cameraEnabled) {
      // Re-acquire only the video track; the call session and audio stay intact.
      try {
        const newStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user' }
        });
        const newTrack = newStream.getVideoTracks()[0];
        newStream.getTracks().forEach((t) => {
          if (t !== newTrack) t.stop();
        });
        if (!mediaStream.getAudioTracks().length) {
          newStream.getAudioTracks().forEach((t) => mediaStream.addTrack(t));
        }
        mediaStream.addTrack(newTrack);
        setCameraEnabled(true);
        evaluateCameraFlip(mediaStream);
        setStreamVersion((v) => v + 1);
      } catch (err) {
        console.warn('Could not re-enable camera:', err);
        setError(describeMediaError(err));
      }
    }
  }, [cameraEnabled, evaluateCameraFlip]);

  const toggleMic = useCallback(() => {
    const mediaStream = streamRef.current;
    if (!mediaStream || phaseRef.current !== 'ready') return;
    const audioTrack = mediaStream.getAudioTracks()[0];
    if (!audioTrack) {
      setError({
        kind: 'no-device',
        title: 'No microphone track',
        message: 'The active session does not include a microphone track.',
        instructions: 'End the call and click Join again to re-acquire your microphone.'
      });
      return;
    }
    const next = !micEnabled;
    audioTrack.enabled = next;
    setMicEnabled(next);
  }, [micEnabled]);

  const flipCamera = useCallback(async () => {
    const mediaStream = streamRef.current;
    if (!mediaStream || phaseRef.current !== 'ready' || isFlippingCamera) return;

    setIsFlippingCamera(true);
    const oldTrack = mediaStream.getVideoTracks()[0];
    const oldFacingMode = oldTrack?.getSettings?.().facingMode;
    const targetFacingMode = oldFacingMode === 'environment' ? 'user' : 'environment';

    try {
      let newTrack: MediaStreamTrack | null = null;
      // Try an explicit facing-mode switch first (mobile browsers).
      if (oldFacingMode) {
        try {
          const facingStream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: { ideal: targetFacingMode } }
          });
          newTrack = facingStream.getVideoTracks()[0];
          facingStream.getTracks().forEach((t) => {
            if (t !== newTrack) t.stop();
          });
        } catch {
          newTrack = null;
        }
      }
      // Fall back to a second enumerated video input device (desktops with two cams).
      if (!newTrack && typeof navigator !== 'undefined' && navigator.mediaDevices?.enumerateDevices) {
        const videoInputs = await navigator.mediaDevices
          .enumerateDevices()
          .then((devices) => devices.filter((d) => d.kind === 'videoinput' && d.deviceId !== oldTrack?.getSettings?.().deviceId))
          .catch(() => [] as MediaDeviceInfo[]);
        if (videoInputs.length > 0) {
          const secondStream = await navigator.mediaDevices.getUserMedia({
            video: { deviceId: { exact: videoInputs[0].deviceId } }
          });
          newTrack = secondStream.getVideoTracks()[0];
          secondStream.getTracks().forEach((t) => {
            if (t !== newTrack) t.stop();
          });
        }
      }

      if (!newTrack) {
        throw new Error('No alternative camera is available to switch to.');
      }

      if (oldTrack) {
        oldTrack.stop();
        mediaStream.removeTrack(oldTrack);
      }
      mediaStream.addTrack(newTrack);
      evaluateCameraFlip(mediaStream);
      setStreamVersion((v) => v + 1);
    } catch (err) {
      console.warn('Camera flip failed:', err);
      setError({
        kind: 'unknown',
        title: 'Camera switch failed',
        message: (err as { message?: string } | null)?.message ?? 'Could not switch to another camera.',
        instructions: 'This device may only have one usable camera. Keep using the current camera, or end the call and retry.'
      });
    } finally {
      setIsFlippingCamera(false);
    }
  }, [evaluateCameraFlip, isFlippingCamera]);

  // Safety net: release devices if the owning component unmounts mid-call.
  useEffect(
    () => () => {
      clearMicMeter();
      if (streamRef.current) stopStreamTracks(streamRef.current);
      streamRef.current = null;
      joinedRef.current = false;
    },
    [clearMicMeter, stopStreamTracks]
  );

  const isMicActive = phase === 'ready' && micEnabled;

  return {
    phase,
    error,
    stream,
    streamVersion,
    cameraEnabled,
    micEnabled,
    isMicActive,
    micLevel,
    canFlipCamera,
    isFlippingCamera,
    join,
    leave,
    toggleCamera,
    toggleMic,
    flipCamera
  };
}
