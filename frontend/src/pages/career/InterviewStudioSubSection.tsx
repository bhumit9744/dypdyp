import React, { useState, useEffect, useRef } from 'react';
import {
  Video,
  Mic,
  MicOff,
  VideoOff,
  Volume2,
  VolumeX,
  Play,
  Square,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  Bot,
  User,
  ArrowRight,
  RefreshCw,
  Award,
  ChevronRight,
  TrendingUp,
  Sliders,
  Clock,
  Eye,
  Sun,
  ShieldAlert,
  HelpCircle,
  Send,
  StopCircle,
  RotateCcw,
  Check,
  PhoneOff
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useMediaCall } from '../../hooks/useMediaCall';
import { LocalVideoPreview } from '../../components/media/LocalVideoPreview';
import { InterviewerPanel } from '../../components/media/InterviewerPanel';
import { CallControls } from '../../components/media/CallControls';
import { MediaErrorBanner } from '../../components/media/MediaErrorBanner';
import {
  InterviewSession,
  InterviewTurn,
  TurnEvaluation,
  InterviewFinalSummary,
  VisionSummary
} from '../../types';

const API_BASE = 'http://127.0.0.1:8000/api/v1';

interface SpeechArchitectureStatus {
  active_stt: {
    mode: string;
    provider: string;
    streaming_support: boolean;
    interim_transcription: boolean;
  };
  active_tts: {
    provider: string;
    lipsync_boundary_events: boolean;
    interruption_capable: boolean;
  };
  cloud_providers: {
    stt_whisper: {
      configured: boolean;
      missing_config?: string;
    };
    tts_neural: {
      configured: boolean;
      missing_config?: string;
    };
  };
}

interface ProviderDiagnostic {
  hostname: string;
  api_protocol: string;
  endpoint_path: string;
  model_id: string;
  credential_present: boolean;
  status: 'authenticated' | 'authentication_error' | 'quota_error' | 'unsupported_model' | 'not_configured' | 'provider_error' | 'error';
  http_status?: number;
  sanitized_error?: string;
  diagnostic_message: string;
}

export const InterviewStudioSubSection: React.FC = () => {
  const {
    studentProfile,
    skills,
    jobs,
    campusDrives,
    integrationsStatus,
    activeInterviewTarget
  } = useApp();

  // -------------------------------------------------------------------------
  // Workflow States: 'setup' | 'device-check' | 'in-progress' | 'summary'
  // -------------------------------------------------------------------------
  const [studioStep, setStudioStep] = useState<'setup' | 'device-check' | 'in-progress' | 'summary'>('setup');
  // 'call' is the standalone video-call room reached via "Join Interview".
  const [roomMode, setRoomMode] = useState<'studio' | 'call'>('studio');

  // Setup Form State
  const [selectedRole, setSelectedRole] = useState<string>('Full Stack Software Engineer');
  const [selectedType, setSelectedType] = useState<string>('Technical');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('Medium');
  const [questionLimit, setQuestionLimit] = useState<number>(3);
  const [durationMinutes, setDurationMinutes] = useState<number>(15);
  const [customSkillsInput, setCustomSkillsInput] = useState<string>('React, TypeScript, Node.js, PostgreSQL');
  const [selectedJobId, setSelectedJobId] = useState<string>('');

  // Auto-populate when launched with specific target from scheduled slots or job postings
  useEffect(() => {
    if (activeInterviewTarget) {
      if (activeInterviewTarget.role) {
        setSelectedRole(
          activeInterviewTarget.company
            ? `${activeInterviewTarget.role} (${activeInterviewTarget.company})`
            : activeInterviewTarget.role
        );
      }
      if (activeInterviewTarget.type) setSelectedType(activeInterviewTarget.type);
      if (activeInterviewTarget.skills && activeInterviewTarget.skills.length > 0) {
        setCustomSkillsInput(activeInterviewTarget.skills.join(', '));
      }
    }
  }, [activeInterviewTarget]);

  // Device & Permission State (managed by the real media call hook)
  const mediaCall = useMediaCall({ micLevelIntervalMs: 100 });
  const {
    phase: mediaPhase,
    error: mediaError,
    stream: mediaStream,
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
  } = mediaCall;
  const [consentAccepted, setConsentAccepted] = useState<boolean>(false);
  const [deviceError, setDeviceError] = useState<string | null>(null);
  const [callStartedAt, setCallStartedAt] = useState<number | null>(null);
  const [callElapsedSeconds, setCallElapsedSeconds] = useState<number>(0);

  // Active Session State
  const [currentSession, setCurrentSession] = useState<InterviewSession | null>(null);
  const [activeTurn, setActiveTurn] = useState<InterviewTurn | null>(null);
  const [interviewerState, setInterviewerState] = useState<'idle' | 'speaking' | 'listening' | 'evaluating'>('idle');
  const [interviewerPersona, setInterviewerPersona] = useState<'sarah' | 'alex' | 'nova' | 'jarvis'>('sarah');
  const [turnTranscript, setTurnTranscript] = useState<string>('');
  const [interimTranscript, setInterimTranscript] = useState<string>('');
  const [inputMode, setInputMode] = useState<'voice' | 'text_fallback'>('voice');
  const [textAnswer, setTextAnswer] = useState<string>('');
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [recentEvaluation, setRecentEvaluation] = useState<TurnEvaluation | null>(null);
  const [showEvaluationModal, setShowEvaluationModal] = useState<boolean>(false);
  const [finalReport, setFinalReport] = useState<InterviewFinalSummary | null>(null);

  // Computer Vision Diagnostics
  const [visionTelemetry, setVisionTelemetry] = useState<VisionSummary | null>(null);
  const [visionFrameCount, setVisionFrameCount] = useState<number>(0);

  // Speech Diagnostics from backend
  const [speechDiagnostics, setSpeechDiagnostics] = useState<SpeechArchitectureStatus | null>(null);
  const [providerDiagnostic, setProviderDiagnostic] = useState<ProviderDiagnostic | null>(null);
  const [isCheckingProvider, setIsCheckingProvider] = useState<boolean>(false);
  const [showDiagnosticDetails, setShowDiagnosticDetails] = useState<boolean>(false);

  const fetchProviderDiagnostic = async () => {
    setIsCheckingProvider(true);
    try {
      const res = await fetch(`${API_BASE}/interview/provider-diagnostic`);
      const data = await res.json();
      setProviderDiagnostic(data);
    } catch (err) {
      console.warn('Could not fetch provider diagnostic:', err);
    } finally {
      setIsCheckingProvider(false);
    }
  };

  // DOM References
  const videoPreviewRef = useRef<HTMLVideoElement | null>(null);
  const recognitionRef = useRef<any>(null);
  const visionIntervalRef = useRef<any>(null);

  const verifiedSkills = skills.filter(s => s.verified);

  // Media aliases preserved for the page's existing logic (real track state, not icons).
  const isAudioMuted = !micEnabled;
  const isVideoDisabled = !cameraEnabled;
  const micVolume = micLevel;

  // -------------------------------------------------------------------------
  // Join Interview (real webcam & mic, requested only on click)
  // -------------------------------------------------------------------------
  const handleJoinCall = async () => {
    setDeviceError(null);
    await join();
  };

  // Call duration timer while in the live call.
  useEffect(() => {
    if (mediaPhase === 'ready' && callStartedAt !== null) {
      const interval = setInterval(() => {
        setCallElapsedSeconds(Math.floor((Date.now() - callStartedAt) / 1000));
      }, 1000);
      return () => clearInterval(interval);
    }
    setCallElapsedSeconds(0);
    return undefined;
  }, [mediaPhase, callStartedAt]);

  useEffect(() => {
    if (mediaPhase === 'ready' && callStartedAt === null) {
      setCallStartedAt(Date.now());
    }
    if (mediaPhase !== 'ready' && callStartedAt !== null) {
      setCallStartedAt(null);
    }
  }, [mediaPhase, callStartedAt]);

  // -------------------------------------------------------------------------
  // Release every media device when ending the call / leaving any room
  // -------------------------------------------------------------------------
  const endCallSafely = () => {
    stopSpeechRecognition();
    if (visionIntervalRef.current) clearInterval(visionIntervalRef.current);
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    leave();
    setCallStartedAt(null);
    setCallElapsedSeconds(0);
  };

  // -------------------------------------------------------------------------
  // Fetch Speech & Provider Architecture Diagnostics
  // -------------------------------------------------------------------------
  useEffect(() => {
    fetch(`${API_BASE}/interview/speech/status`)
      .then(res => res.json())
      .then(data => setSpeechDiagnostics(data))
      .catch(err => console.warn('Could not fetch speech architecture status:', err));

    fetchProviderDiagnostic();
  }, []);

  // -------------------------------------------------------------------------
  // Initialize Hardware Media Stream (Camera & Mic) — delegated to useMediaCall
  // -------------------------------------------------------------------------
  const startMediaPreview = async () => {
    setDeviceError(null);
    await join();
  };

  const stopMediaStream = () => {
    leave();
  };

  // -------------------------------------------------------------------------
  // Speech-to-Text: Native Web Speech Recognition
  // -------------------------------------------------------------------------
  const startSpeechRecognition = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn('Web Speech Recognition API not available in this browser. Using text fallback.');
      setInputMode('text_fallback');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setInterviewerState('listening');
      };

      recognition.onresult = (event: any) => {
        let interim = '';
        let final = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            final += event.results[i][0].transcript + ' ';
          } else {
            interim += event.results[i][0].transcript;
          }
        }
        if (final) {
          setTurnTranscript(prev => (prev + ' ' + final).trim());
        }
        setInterimTranscript(interim);
      };

      recognition.onerror = (e: any) => {
        console.warn('Speech recognition warning/error:', e.error);
        if (e.error === 'not-allowed') {
          setInputMode('text_fallback');
        }
      };

      recognition.onend = () => {
        // Keep listening if user is still in listening turn
        if (interviewerState === 'listening') {
          try { recognition.start(); } catch (e) {}
        }
      };

      recognition.start();
      recognitionRef.current = recognition;
    } catch (err) {
      console.warn('Speech recognition start failed:', err);
      setInputMode('text_fallback');
    }
  };

  const stopSpeechRecognition = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
      recognitionRef.current = null;
    }
  };

  // -------------------------------------------------------------------------
  // Text-to-Speech: Native Vocalization with Lipsync Synchronizer
  // -------------------------------------------------------------------------
  const speakQuestion = (text: string, onComplete?: () => void) => {
    if (!('speechSynthesis' in window) || isAudioMuted) {
      setInterviewerState('listening');
      startSpeechRecognition();
      if (onComplete) onComplete();
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    // Pick pleasant natural voice matching persona
    const voices = window.speechSynthesis.getVoices();
    let matchedVoice;
    if (interviewerPersona === 'alex') {
      matchedVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('David') || v.name.includes('Mark') || v.name.includes('Guy') || v.name.includes('Male') || v.name.includes('George')));
    } else {
      matchedVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Samantha') || v.name.includes('Zira') || v.name.includes('Female') || v.name.includes('Jenny') || v.name.includes('Google')));
    }
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    utterance.onstart = () => {
      setInterviewerState('speaking');
    };

    utterance.onend = () => {
      setInterviewerState('listening');
      startSpeechRecognition();
      if (onComplete) onComplete();
    };

    utterance.onerror = () => {
      setInterviewerState('listening');
      startSpeechRecognition();
      if (onComplete) onComplete();
    };

    window.speechSynthesis.speak(utterance);
  };

  const stopInterviewerSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setInterviewerState('listening');
    startSpeechRecognition();
  };

  // -------------------------------------------------------------------------
  // Computer Vision Frame Snapshot (OpenCV server-side telemetry)
  // -------------------------------------------------------------------------
  const captureVisionFrame = async (sessionId: string) => {
    if (!videoPreviewRef.current || isVideoDisabled) return;

    try {
      const video = videoPreviewRef.current;
      if (video.videoWidth === 0 || video.videoHeight === 0) return;

      const canvas = document.createElement('canvas');
      canvas.width = 320;
      canvas.height = 240;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.drawImage(video, 0, 0, 320, 240);
      const base64Data = canvas.toDataURL('image/jpeg', 0.6);

      const res = await fetch(`${API_BASE}/interview/sessions/${sessionId}/vision-frame`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-student-id': studentProfile?.id || 'std_current_user'
        },
        body: JSON.stringify({ image_base64: base64Data })
      });

      if (res.ok) {
        const data = await res.json();
        setVisionTelemetry({
          face_detected: data.face_detected,
          approx_head_pose: data.approx_head_pose,
          lighting_quality: data.lighting_quality,
          confidence: data.confidence,
          total_frames_analyzed: visionFrameCount + 1,
          disclaimer: data.disclaimer
        });
        setVisionFrameCount(prev => prev + 1);
      }
    } catch (err) {
      // Vision telemetry is non-blocking
      console.warn('Vision frame capture heartbeat:', err);
    }
  };

  // -------------------------------------------------------------------------
  // Step 1 -> Step 2: Proceed to Device Check
  // -------------------------------------------------------------------------
  const proceedToDeviceCheck = () => {
    setStudioStep('device-check');
    startMediaPreview();
  };

  // -------------------------------------------------------------------------
  // Step 2 -> Step 3: Start Real Interview Session
  // -------------------------------------------------------------------------
  const startInterviewSession = async () => {
    if (!consentAccepted) {
      setDeviceError('You must review and accept the privacy disclosure before starting the interview.');
      return;
    }

    setApiError(null);
    setIsSubmitting(true);

    try {
      // 1. Create Session in Backend
      const skillsArray = customSkillsInput
        .split(',')
        .map(s => s.trim())
        .filter(s => s.length > 0);

      const payload = {
        role_target: selectedRole,
        job_id: selectedJobId || undefined,
        interview_type: selectedType,
        difficulty: selectedDifficulty,
        question_limit: Number(questionLimit),
        duration_minutes: Number(durationMinutes),
        required_skills: skillsArray,
        consent: {
          camera_enabled: !isVideoDisabled,
          mic_enabled: !isAudioMuted,
          storage_policy_accepted: true
        }
      };

      const res = await fetch(`${API_BASE}/interview/sessions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-student-id': studentProfile?.id || 'std_current_user'
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.detail || 'Failed to initialize interview session.');
      }

      const sessionData = await res.json();
      const newSession: InterviewSession = {
        id: sessionData.session_id,
        student_id: studentProfile?.id || 'std_current_user',
        role_target: selectedRole,
        interview_type: selectedType,
        difficulty: selectedDifficulty,
        required_skills: skillsArray,
        status: 'InProgress',
        question_limit: Number(questionLimit),
        duration_minutes: Number(durationMinutes),
        turns: []
      };
      setCurrentSession(newSession);
      setStudioStep('in-progress');

      // Start Computer Vision Periodic Telemetry (every 6s)
      visionIntervalRef.current = setInterval(() => {
        captureVisionFrame(sessionData.session_id);
      }, 6000);

      // 2. Fetch First Question from Google Gemini
      await fetchNextQuestion(sessionData.session_id);
    } catch (err: any) {
      console.error('Session initialization error:', err);
      setApiError(err.message || 'Error communicating with backend Gemini API.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // -------------------------------------------------------------------------
  // Fetch Next Question from Google Gemini
  // -------------------------------------------------------------------------
  const fetchNextQuestion = async (sessionId: string) => {
    setApiError(null);
    setInterviewerState('evaluating');
    setTurnTranscript('');
    setInterimTranscript('');
    setTextAnswer('');

    try {
      const res = await fetch(`${API_BASE}/interview/sessions/${sessionId}/next-question`, {
        method: 'POST',
        headers: {
          'x-student-id': studentProfile?.id || 'std_current_user'
        }
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.detail || 'Google Gemini question generation failed.');
      }

      const data = await res.json();
      const turnInfo: InterviewTurn = {
        id: data.turn.id,
        turn_number: data.turn.turn_number,
        question_text: data.turn.question_text,
        question_category: data.turn.question_category,
        turn_status: 'Asking'
      };
      setActiveTurn(turnInfo);

      // Vocalize with synchronized animated avatar
      speakQuestion(turnInfo.question_text);
    } catch (err: any) {
      console.error('Next question error:', err);
      setApiError(err.message || 'Google Gemini API encountered an error generating the question.');
      setInterviewerState('idle');
    }
  };

  // -------------------------------------------------------------------------
  // Submit Answer & Evaluate via Gemini Rubric
  // -------------------------------------------------------------------------
  const handleSubmitAnswer = async () => {
    if (!currentSession || !activeTurn) return;

    const answerToSubmit = inputMode === 'voice'
      ? (turnTranscript + (interimTranscript ? ' ' + interimTranscript : '')).trim()
      : textAnswer.trim();

    if (!answerToSubmit) {
      alert('Please provide an answer via microphone transcription or text input before submitting.');
      return;
    }

    stopSpeechRecognition();
    setInterviewerState('evaluating');
    setIsSubmitting(true);
    setApiError(null);

    try {
      const payload = {
        turn_id: activeTurn.id,
        student_answer: answerToSubmit,
        input_method: inputMode,
        answer_duration_seconds: 30
      };

      const res = await fetch(`${API_BASE}/interview/sessions/${currentSession.id}/submit-answer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-student-id': studentProfile?.id || 'std_current_user'
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.detail || 'Answer evaluation failed.');
      }

      const data = await res.json();
      setRecentEvaluation(data.evaluation);
      setShowEvaluationModal(true);

      // Update Session Turns in memory
      const updatedTurn: InterviewTurn = {
        ...activeTurn,
        student_answer_transcript: answerToSubmit,
        input_method: inputMode,
        evaluation_result: data.evaluation,
        turn_status: 'Completed'
      };

      setCurrentSession(prev => {
        if (!prev) return null;
        return {
          ...prev,
          turns: [...prev.turns.filter(t => t.id !== activeTurn.id), updatedTurn]
        };
      });

      // Check if follow-up turn was returned
      if (data.follow_up_turn) {
        const followTurn: InterviewTurn = {
          id: data.follow_up_turn.id,
          turn_number: data.follow_up_turn.turn_number,
          question_text: data.follow_up_turn.question_text,
          question_category: 'FollowUp',
          is_followup: true,
          turn_status: 'Asking'
        };
        setActiveTurn(followTurn);
      } else if (data.is_last_question) {
        // Final question completed -> offer to generate final summary report
        setActiveTurn(null);
      }
    } catch (err: any) {
      console.error('Submit answer error:', err);
      setApiError(err.message || 'Google Gemini API encountered an error evaluating your answer.');
      setInterviewerState('idle');
    } finally {
      setIsSubmitting(false);
    }
  };

  // -------------------------------------------------------------------------
  // Finish Interview & Synthesize Final Report
  // -------------------------------------------------------------------------
  const handleFinishInterview = async () => {
    if (!currentSession) return;

    stopSpeechRecognition();
    if (visionIntervalRef.current) clearInterval(visionIntervalRef.current);
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();

    setIsSubmitting(true);
    setApiError(null);

    try {
      const res = await fetch(`${API_BASE}/interview/sessions/${currentSession.id}/finish`, {
        method: 'POST',
        headers: {
          'x-student-id': studentProfile?.id || 'std_current_user'
        }
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.detail || 'Final interview synthesis failed.');
      }

      const data = await res.json();
      setFinalReport(data.overall_feedback);
      setStudioStep('summary');
    } catch (err: any) {
      console.error('Finish session error:', err);
      setApiError(err.message || 'Could not generate final interview summary report.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // -------------------------------------------------------------------------
  // Cancel Session
  // -------------------------------------------------------------------------
  const handleCancelSession = async () => {
    if (window.confirm('Are you sure you want to end this interview session? Your progress will be discarded.')) {
      stopSpeechRecognition();
      if (visionIntervalRef.current) clearInterval(visionIntervalRef.current);
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      stopMediaStream();

      if (currentSession) {
        try {
          await fetch(`${API_BASE}/interview/sessions/${currentSession.id}/cancel`, {
            method: 'POST',
            headers: {
              'x-student-id': studentProfile?.id || 'std_current_user'
            }
          });
        } catch (e) {}
      }

      setStudioStep('setup');
      setCurrentSession(null);
      setActiveTurn(null);
    }
  };

  // =========================================================================
  // VIEW: STEP 1 — ROLE & SKILLS CONFIGURATION
  // =========================================================================
  if (studioStep === 'setup') {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header Hero */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                AI Interview Studio
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200/60">
                In-Browser
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Mock technical and behavioral interviews with real-time feedback.
            </p>
          </div>

          <div className="flex items-center gap-3 px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-xs shrink-0">
            <div className="w-8 h-8 rounded-lg bg-brand-600/10 dark:bg-brand-500/20 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold">
              {studentProfile?.name ? studentProfile.name.charAt(0) : 'C'}
            </div>
            <div>
              <p className="font-semibold text-slate-900 dark:text-slate-100">{studentProfile?.name || 'Candidate'}</p>
              <p className="text-[11px] text-slate-500">{verifiedSkills.length} Verified Skills</p>
            </div>
          </div>
        </div>

        {/* Configuration Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left: Setup Parameters */}
          <div className="md:col-span-2 space-y-5 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <h2 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-brand-600" />
              Interview Parameters
            </h2>

            {/* Optional Job Link */}
            {jobs.length > 0 && (
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  Target Campus Job (Optional)
                </label>
                <select
                  value={selectedJobId}
                  onChange={(e) => {
                    const jId = e.target.value;
                    setSelectedJobId(jId);
                    const matched = jobs.find(j => j.id === jId);
                    if (matched) {
                      setSelectedRole(`${matched.title} (${matched.companyName})`);
                      if (matched.requiredSkills && matched.requiredSkills.length > 0) {
                        setCustomSkillsInput(matched.requiredSkills.join(', '));
                      }
                    }
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500"
                >
                  <option value="">Custom Role</option>
                  {jobs.map(j => (
                    <option key={j.id} value={j.id}>
                      {j.companyName} — {j.title} ({j.packageLpa} LPA)
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Role Title */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                Target Role
              </label>
              <input
                type="text"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                placeholder="e.g. Full Stack Engineer, SRE, Frontend Specialist"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500"
              />
            </div>

            {/* Required Skills */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                Required Skills
              </label>
              <input
                type="text"
                value={customSkillsInput}
                onChange={(e) => setCustomSkillsInput(e.target.value)}
                placeholder="e.g. React, TypeScript, Node.js, PostgreSQL"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500"
              />
            </div>

            {/* Round & Difficulty */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  Round
                </label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500"
                >
                  <option value="Technical">Technical & Coding</option>
                  <option value="System Design">System Design</option>
                  <option value="Behavioral">Behavioral</option>
                  <option value="Mixed">Mixed Round</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  Difficulty
                </label>
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500"
                >
                  <option value="Easy">Standard Campus Round</option>
                  <option value="Medium">Challenging Product Round</option>
                  <option value="Hard">Advanced Systems Round</option>
                </select>
              </div>
            </div>

            {/* Count & Duration */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  Questions
                </label>
                <select
                  value={questionLimit}
                  onChange={(e) => setQuestionLimit(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500"
                >
                  <option value={3}>3 Questions (~10 min)</option>
                  <option value={5}>5 Questions (~15 min)</option>
                  <option value={7}>7 Questions (~25 min)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  Duration
                </label>
                <select
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500"
                >
                  <option value={10}>10 Minutes</option>
                  <option value={15}>15 Minutes</option>
                  <option value={25}>25 Minutes</option>
                </select>
              </div>
            </div>

            <button
              onClick={proceedToDeviceCheck}
              className="w-full py-2.5 px-4 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs shadow-xs transition-colors flex items-center justify-center gap-2"
            >
              Continue to Device Check
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleJoinCall}
              className="w-full py-2.5 px-4 rounded-xl border border-brand-200 dark:border-brand-800/60 text-brand-700 dark:text-brand-300 hover:bg-brand-50 dark:hover:bg-brand-950/40 font-semibold text-xs transition-colors flex items-center justify-center gap-2"
            >
              <Video className="w-4 h-4" />
              Join Interview (opens camera & microphone)
            </button>
          </div>

          {/* Right: Candidate Context & AI Engine Status */}
          <div className="space-y-4">
            {/* Verified Skills */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
              <h3 className="font-semibold text-xs uppercase tracking-wider text-slate-400">
                Verified Skills ({verifiedSkills.length})
              </h3>
              {verifiedSkills.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No verified skills attached.</p>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {verifiedSkills.map(s => (
                    <span
                      key={s.id}
                      className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200/50"
                    >
                      ✓ {s.name}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* AI Engine Status */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-xs uppercase tracking-wider text-slate-400">
                  AI Provider
                </h3>
                <button
                  onClick={fetchProviderDiagnostic}
                  disabled={isCheckingProvider}
                  className="text-[11px] text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1 font-semibold disabled:opacity-50"
                  title="Re-test provider"
                >
                  <RefreshCw className={`w-3 h-3 ${isCheckingProvider ? 'animate-spin' : ''}`} />
                  <span>Test</span>
                </button>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Service:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    Google Gemini
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Model:</span>
                  <span className="font-mono text-[11px] text-slate-700 dark:text-slate-300">
                    {providerDiagnostic?.model_id || 'gemini-3.5-flash-lite'}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500">Status:</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    providerDiagnostic?.status === 'authenticated'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : providerDiagnostic?.status === 'quota_error'
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                  }`}>
                    {providerDiagnostic?.status === 'authenticated'
                      ? 'Verified (HTTP 200)'
                      : providerDiagnostic?.status === 'quota_error'
                      ? 'Quota Exceeded'
                      : 'Pending / Key Required'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW: STEP 2 — DEVICE CHECK & PRIVACY CONSENT
  // =========================================================================
  if (studioStep === 'device-check') {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="p-6 md:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600">
                Step 2 of 3 • Hardware & Privacy
              </span>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                Device & Privacy Verification
              </h2>
            </div>
            <button
              onClick={() => {
                stopMediaStream();
                setStudioStep('setup');
              }}
              className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-white font-medium"
            >
              ← Back
            </button>
          </div>

          {/* Device / Permission Errors */}
          {deviceError && (
            <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/40 text-xs text-rose-800 dark:text-rose-200 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-semibold">{deviceError}</p>
                <button
                  onClick={startMediaPreview}
                  className="text-xs font-bold text-rose-700 dark:text-rose-300 underline"
                >
                  Retry Permissions
                </button>
              </div>
            </div>
          )}

          {/* API / Backend Connection Error */}
          {apiError && (
            <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/40 text-xs text-rose-800 dark:text-rose-200 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-semibold">{apiError}</p>
                <p className="text-[11px] text-slate-500">Ensure the backend API server is running on http://127.0.0.1:8000.</p>
              </div>
            </div>
          )}

          {mediaError && (
            <MediaErrorBanner
              error={mediaError}
              onRetry={handleJoinCall}
              isRetrying={mediaPhase === 'initializing'}
            />
          )}

          {/* 2-Column Device Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            {/* Left: Camera Preview */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Video className="w-4 h-4 text-brand-600" />
                  Webcam Feed
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  mediaPhase === 'ready' && cameraEnabled
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                }`}>
                  {mediaPhase === 'ready' ? (cameraEnabled ? 'Camera Active' : 'Camera Off') : 'Connecting…'}
                </span>
              </div>

              <LocalVideoPreview
                stream={mediaStream}
                streamVersion={streamVersion}
                cameraEnabled={cameraEnabled}
                phase={mediaPhase}
                videoRef={videoPreviewRef}
                micLevel={micLevel}
                micEnabled={micEnabled}
              />

              <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                <span>Camera toggle:</span>
                <button
                  type="button"
                  onClick={() => toggleCamera()}
                  className="font-semibold text-brand-600 dark:text-brand-400 hover:underline"
                >
                  {cameraEnabled ? 'Turn Off Camera' : 'Turn On Camera'}
                </button>
              </div>
            </div>

            {/* Right: Microphone Test & Privacy */}
            <div className="space-y-4">
              {/* Mic Meter */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Mic className="w-4 h-4 text-brand-600" />
                    Microphone Level
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    mediaPhase === 'ready' && micEnabled
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                  }`}>
                    {mediaPhase === 'ready' ? (micEnabled ? 'Mic Ready' : 'Muted') : 'Connecting…'}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Volume:</span>
                    <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                      {micLevel}%
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-75 rounded-full ${
                        micLevel > 70 ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.max(4, micLevel)}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-slate-400">Speak into your mic to test audio responsiveness.</p>
                </div>
              </div>

              {/* Privacy Notice */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-2.5">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <h3 className="font-bold text-xs text-slate-900 dark:text-white">
                    Privacy & Data Policy
                  </h3>
                </div>
                <ul className="text-[11px] text-slate-600 dark:text-slate-400 space-y-1.5 leading-relaxed">
                  <li>• <strong>In-Memory Processing:</strong> Video frames and audio streams are processed in-memory for real-time speech and framing. Raw video/audio is never stored.</li>
                  <li>• <strong>Stored Records:</strong> Only transcribed text answers and Gemini evaluation rubrics are saved to your student profile.</li>
                  <li>• <strong>Ergonomics Only:</strong> Camera framing telemetry is strictly for posture guidance and never impacts your score.</li>
                </ul>

                <label className="flex items-start gap-2.5 pt-2 border-t border-slate-200/80 dark:border-slate-700/60 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consentAccepted}
                    onChange={(e) => setConsentAccepted(e.target.checked)}
                    className="mt-0.5 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                  />
                  <span className="text-xs font-medium text-slate-800 dark:text-slate-200">
                    I agree to the interview transcription and rubric evaluation terms.
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Bottom CTA Bar */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <button
              onClick={() => {
                stopMediaStream();
                setStudioStep('setup');
              }}
              className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>

            <button
              onClick={startInterviewSession}
              disabled={!consentAccepted || isSubmitting}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs shadow-xs transition-all flex items-center gap-2 ${
                consentAccepted && !isSubmitting
                  ? 'bg-brand-600 hover:bg-brand-500 text-white shadow-brand-500/20'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Connecting Gemini Session…
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  Start Interview
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW: STEP 3 — LIVE INTERVIEW ROOM
  // =========================================================================
  if (studioStep === 'in-progress') {
    return (
      <div className="max-w-6xl mx-auto space-y-4">
        {/* Top Studio Bar */}
        <div className="p-3 sm:p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                  {currentSession?.role_target || 'Interview Assessment'}
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300 border border-brand-200/50">
                  {currentSession?.interview_type || 'Technical'}
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                  {currentSession?.difficulty || 'Standard'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Question Counter */}
            <div className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 font-mono">
              Q{activeTurn?.turn_number || currentSession?.turns.length || 1} / {currentSession?.question_limit || 5}
            </div>

            {/* Timer */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-mono font-medium text-slate-600 dark:text-slate-300">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>
                {Math.floor(callElapsedSeconds / 60).toString().padStart(2, '0')}:
                {(callElapsedSeconds % 60).toString().padStart(2, '0')}
              </span>
            </div>

            {/* Finish Early Action */}
            <button
              type="button"
              onClick={handleFinishInterview}
              disabled={isSubmitting}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-xs transition-colors flex items-center gap-1.5 disabled:opacity-50"
              title="Finish interview and generate report"
            >
              <Check className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Finish</span>
            </button>

            {/* Leave / Exit */}
            <button
              type="button"
              onClick={() => {
                endCallSafely();
                handleCancelSession();
              }}
              className="px-3 py-1.5 rounded-xl border border-rose-300 dark:border-rose-800/60 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-xs font-semibold transition-colors flex items-center gap-1.5"
              title="End session"
            >
              <PhoneOff className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Exit</span>
            </button>
          </div>
        </div>

        {/* API Error Notification */}
        {apiError && (
          <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-xs text-rose-900 dark:text-rose-100 space-y-2.5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <p className="font-bold text-xs">
                    {apiError.includes('429') || apiError.toLowerCase().includes('quota')
                      ? 'AI Provider Quota Reached'
                      : 'AI Service Notice'}
                  </p>
                  <p className="text-[11px] text-rose-800 dark:text-rose-200 leading-relaxed">
                    {apiError}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (currentSession) fetchNextQuestion(currentSession.id);
                }}
                className="px-3 py-1 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shrink-0 shadow-xs transition-colors"
              >
                Retry
              </button>
            </div>

            {/* Diagnostic Details Toggle */}
            <div className="pt-1 border-t border-rose-200/60 dark:border-rose-800/40">
              <button
                type="button"
                onClick={() => setShowDiagnosticDetails(prev => !prev)}
                className="text-[10px] text-rose-700 dark:text-rose-300 underline font-medium"
              >
                {showDiagnosticDetails ? 'Hide technical diagnostics' : 'Show technical diagnostics'}
              </button>
              {showDiagnosticDetails && (
                <div className="mt-2 p-2.5 rounded-xl bg-white/70 dark:bg-slate-900/70 border border-rose-200 dark:border-rose-800 text-[10px] font-mono grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div>
                    <span className="text-slate-400 block">Host:</span>
                    <span className="text-slate-800 dark:text-slate-200 truncate block">{providerDiagnostic?.hostname || 'Google Gemini API'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Model:</span>
                    <span className="text-slate-800 dark:text-slate-200 truncate block">{providerDiagnostic?.model_id || 'gemini-3.5-flash-lite'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Endpoint:</span>
                    <span className="text-slate-800 dark:text-slate-200 truncate block">{providerDiagnostic?.endpoint_path || 'generateContent'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Status:</span>
                    <span className="text-slate-800 dark:text-slate-200">{providerDiagnostic?.status || 'Active'}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Studio Grid: Stage (8 cols) + Console (4 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          {/* Main Stage (8 cols) */}
          <div className="lg:col-span-8 space-y-3">
            {/* Interviewer Panel with Docked Candidate PIP */}
            <InterviewerPanel
              state={interviewerState === 'idle' ? (mediaPhase === 'ready' ? 'ready' : 'disconnected') : interviewerState}
              persona={interviewerPersona}
              onPersonaChange={setInterviewerPersona}
              interviewerName={
                interviewerPersona === 'sarah'
                  ? 'Sarah Jenkins'
                  : interviewerPersona === 'alex'
                  ? 'Alex Vance'
                  : interviewerPersona === 'nova'
                  ? 'Nova 3D Digital Human'
                  : 'JARVIS Core'
              }
              interviewerRole={currentSession?.role_target ? `${currentSession.role_target} Assessment` : 'Technical Evaluation'}
              callDurationSeconds={callElapsedSeconds}
              onSkipAudio={stopInterviewerSpeaking}
              className="w-full shadow-md"
            >
              {/* Student PIP Camera Preview (Docked Bottom-Right) */}
              <div className="absolute bottom-3 right-3 w-36 sm:w-44 md:w-48 aspect-video rounded-xl overflow-hidden shadow-2xl border border-slate-700/80 z-20 transition-all hover:scale-[1.02]">
                <LocalVideoPreview
                  stream={mediaStream}
                  streamVersion={streamVersion}
                  cameraEnabled={cameraEnabled}
                  phase={mediaPhase}
                  micLevel={micVolume}
                  micEnabled={micEnabled}
                  videoRef={videoPreviewRef}
                />
              </div>
            </InterviewerPanel>

            {/* Compact Call Controls Toolbar & OpenCV Telemetry */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
              <CallControls
                phase={mediaPhase}
                cameraEnabled={cameraEnabled}
                micEnabled={micEnabled}
                canFlipCamera={canFlipCamera}
                isFlippingCamera={isFlippingCamera}
                onJoin={handleJoinCall}
                onLeave={() => {
                  endCallSafely();
                  handleCancelSession();
                }}
                onToggleCamera={() => toggleCamera()}
                onToggleMic={toggleMic}
                onFlipCamera={() => flipCamera()}
                disabled={isSubmitting}
                className="w-full sm:w-auto"
              />

              {/* OpenCV Camera Framing Telemetry Pill */}
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] text-slate-300">
                <Eye className="w-3.5 h-3.5 text-brand-400 shrink-0" />
                <span>
                  {visionTelemetry ? (
                    <span className="flex items-center gap-1.5 font-medium">
                      <span className={`inline-block w-1.5 h-1.5 rounded-full ${visionTelemetry.face_detected ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                      {visionTelemetry.face_detected ? 'Face Centered' : 'Adjust Camera'}
                      <span className="text-slate-500">•</span>
                      <span className="text-slate-400">{visionTelemetry.lighting_quality}</span>
                    </span>
                  ) : (
                    <span className="text-slate-400">Framing: Ready</span>
                  )}
                </span>
                <span className="text-slate-500 text-[10px] hidden md:inline">• Guidance only</span>
              </div>
            </div>
          </div>

          {/* Interactive Console: Question + Speech Transcript + Submit (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            {/* Active Question Card */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300 border border-brand-200/50">
                  {activeTurn?.question_category || 'Question'}
                </span>
                <span className="text-xs font-mono text-slate-400">
                  #{activeTurn?.turn_number || 1}
                </span>
              </div>

              <h3 className="text-sm md:text-base font-bold text-slate-900 dark:text-white leading-snug">
                {activeTurn?.question_text || 'Waiting for interview question…'}
              </h3>

              <div className="flex items-center gap-1.5 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Rubric: Correctness • Depth • Clarity</span>
              </div>
            </div>

            {/* Answer Transcription Card */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Mic className="w-4 h-4 text-brand-600" />
                  <span className="font-bold text-xs text-slate-900 dark:text-white">
                    Your Response
                  </span>
                  {interviewerState === 'listening' && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 animate-pulse">
                      Listening…
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setInputMode(inputMode === 'voice' ? 'text_fallback' : 'voice')}
                  className="text-[11px] font-semibold text-brand-600 dark:text-brand-400 hover:underline"
                >
                  {inputMode === 'voice' ? 'Text Mode' : 'Voice Mode'}
                </button>
              </div>

              {inputMode === 'voice' ? (
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 min-h-[120px] max-h-[220px] overflow-y-auto text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
                  {turnTranscript || interimTranscript ? (
                    <span>
                      {turnTranscript} <span className="text-slate-400 italic">{interimTranscript}</span>
                    </span>
                  ) : (
                    <span className="text-slate-400 italic text-xs">
                      {interviewerState === 'listening'
                        ? 'Speak into your microphone. Words will appear here in real time…'
                        : 'Awaiting next turn…'}
                    </span>
                  )}
                </div>
              ) : (
                <textarea
                  rows={5}
                  value={textAnswer}
                  onChange={(e) => setTextAnswer(e.target.value)}
                  placeholder="Type your response here…"
                  className="w-full p-3.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-brand-500 leading-relaxed resize-none"
                />
              )}

              {/* Submit Answer CTA */}
              <button
                type="button"
                onClick={handleSubmitAnswer}
                disabled={isSubmitting || interviewerState === 'evaluating'}
                aria-label="Submit answer for evaluation"
                className="w-full py-2.5 px-4 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-xs hover:shadow-brand-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Evaluating with Gemini…
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Submit Answer
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Turn Evaluation Modal */}
        {showEvaluationModal && recentEvaluation && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 flex items-center justify-center font-extrabold text-sm border border-emerald-200/60">
                    {Math.round(recentEvaluation.turn_overall_score)}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                      Turn Evaluation
                    </h3>
                    <span className="text-xs text-slate-500">
                      Score: {recentEvaluation.turn_overall_score} / 100
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowEvaluationModal(false)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm font-bold p-1 rounded-lg"
                  aria-label="Close modal"
                >
                  ✕
                </button>
              </div>

              {/* 5-Metric Breakdown */}
              <div className="grid grid-cols-5 gap-2 text-center">
                {[
                  { label: 'Correct', score: recentEvaluation.correctness_score },
                  { label: 'Relevant', score: recentEvaluation.relevance_score },
                  { label: 'Complete', score: recentEvaluation.completeness_score },
                  { label: 'Clarity', score: recentEvaluation.clarity_score },
                  { label: 'Evidence', score: recentEvaluation.evidence_score }
                ].map((m, idx) => (
                  <div key={idx} className="p-2 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800/60">
                    <span className="text-[10px] text-slate-400 block">{m.label}</span>
                    <p className="font-bold text-xs text-slate-800 dark:text-slate-100 mt-0.5">
                      {m.score}%
                    </p>
                  </div>
                ))}
              </div>

              {/* Strengths & Growth */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/40 space-y-1.5">
                  <h4 className="font-bold text-emerald-900 dark:text-emerald-200 text-[11px] flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Strengths
                  </h4>
                  <ul className="space-y-1 text-emerald-800 dark:text-emerald-300 text-[11px]">
                    {recentEvaluation.strengths.map((s, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-emerald-500 font-bold">•</span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-800/40 space-y-1.5">
                  <h4 className="font-bold text-amber-900 dark:text-amber-200 text-[11px] flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-amber-600" />
                    Areas for Growth
                  </h4>
                  <ul className="space-y-1 text-amber-800 dark:text-amber-300 text-[11px]">
                    {recentEvaluation.areas_for_improvement.map((g, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-amber-500 font-bold">•</span>
                        <span>{g}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Continue CTA */}
              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setShowEvaluationModal(false);
                    if (activeTurn && currentSession) {
                      speakQuestion(activeTurn.question_text);
                    } else if (currentSession) {
                      fetchNextQuestion(currentSession.id);
                    }
                  }}
                  className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // =========================================================================
  // VIEW: STEP 4 — FINAL COMPREHENSIVE FEEDBACK REPORT
  // =========================================================================
  if (studioStep === 'summary' && finalReport) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header Hero Scorecard */}
        <div className="p-6 md:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300 border border-brand-200/60">
                Assessment Report
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {currentSession?.id}
              </span>
            </div>
            <span className="text-xs text-slate-500 font-medium">
              {currentSession?.interview_type} • {currentSession?.difficulty}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
            <div className="space-y-1">
              <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                {currentSession?.role_target} Mock Interview
              </h1>
              <p className="text-xs text-slate-500">
                Evaluation across {currentSession?.turns.length} technical turns powered by Google Gemini.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800/40 text-center shrink-0 min-w-[110px]">
              <span className="text-[10px] uppercase font-bold text-brand-700 dark:text-brand-300 tracking-wider block">
                Overall Score
              </span>
              <p className="text-2xl md:text-3xl font-extrabold text-brand-600 dark:text-brand-400">
                {Math.round(finalReport.overall_score)}<span className="text-xs font-normal text-slate-400">/100</span>
              </p>
            </div>
          </div>

          {/* Hiring Readiness Verdict */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 flex items-center gap-3">
            <Award className="w-5 h-5 text-brand-600 shrink-0" />
            <div className="text-xs">
              <span className="text-slate-500 mr-2">Readiness Verdict:</span>
              <span className="font-bold text-slate-900 dark:text-white">
                {finalReport.hiring_readiness_recommendation}
              </span>
            </div>
          </div>

          {/* Executive Summary */}
          <div className="space-y-1.5 pt-1">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400">
              Executive Summary
            </h3>
            <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {finalReport.executive_summary}
            </p>
          </div>
        </div>

        {/* Strengths & Growth Areas Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="p-5 md:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <h3 className="font-bold text-xs uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Demonstrated Strengths
            </h3>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
              {finalReport.key_strengths.map((str, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold">•</span>
                  <span>{str}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-5 md:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <h3 className="font-bold text-xs uppercase tracking-wider text-amber-700 dark:text-amber-400 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Priority Growth Areas
            </h3>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
              {finalReport.priority_growth_areas.map((p, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-amber-500 font-bold">•</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Turn-by-Turn Question Transcript */}
        {currentSession && currentSession.turns.length > 0 && (
          <div className="p-5 md:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400">
              Turn-by-Turn Review ({currentSession.turns.length})
            </h3>

            <div className="space-y-3">
              {currentSession.turns.map(turn => (
                <div
                  key={turn.id}
                  className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-semibold text-slate-900 dark:text-white">
                      Q{turn.turn_number}: {turn.question_text}
                    </span>
                    {turn.evaluation_result && (
                      <span className="font-mono font-bold text-xs px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300 border border-brand-200/50 shrink-0">
                        {Math.round(turn.evaluation_result.turn_overall_score)}/100
                      </span>
                    )}
                  </div>

                  <p className="text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200/60 dark:border-slate-800/60 leading-relaxed">
                    <strong className="text-slate-700 dark:text-slate-300">Answer:</strong> {turn.student_answer_transcript || 'No answer recorded.'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Footer */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <p className="text-xs text-slate-500">
            Saved to your authenticated placement records.
          </p>
          <button
            type="button"
            onClick={() => {
              stopMediaStream();
              setStudioStep('setup');
              setCurrentSession(null);
              setFinalReport(null);
            }}
            className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-xs transition-colors"
          >
            Start Another Session
          </button>
        </div>
      </div>
    );
  }

  return null;
};
