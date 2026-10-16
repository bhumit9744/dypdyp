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
  Check
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
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

  // Device & Permission State
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [hasMicPermission, setHasMicPermission] = useState<boolean | null>(null);
  const [micVolume, setMicVolume] = useState<number>(0);
  const [consentAccepted, setConsentAccepted] = useState<boolean>(false);
  const [deviceError, setDeviceError] = useState<string | null>(null);

  // Active Session State
  const [currentSession, setCurrentSession] = useState<InterviewSession | null>(null);
  const [activeTurn, setActiveTurn] = useState<InterviewTurn | null>(null);
  const [interviewerState, setInterviewerState] = useState<'idle' | 'speaking' | 'listening' | 'evaluating'>('idle');
  const [turnTranscript, setTurnTranscript] = useState<string>('');
  const [interimTranscript, setInterimTranscript] = useState<string>('');
  const [inputMode, setInputMode] = useState<'voice' | 'text_fallback'>('voice');
  const [textAnswer, setTextAnswer] = useState<string>('');
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(false);
  const [isVideoDisabled, setIsVideoDisabled] = useState<boolean>(false);
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

  // DOM References
  const videoPreviewRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const recognitionRef = useRef<any>(null);
  const visionIntervalRef = useRef<any>(null);

  const verifiedSkills = skills.filter(s => s.verified);

  // -------------------------------------------------------------------------
  // Fetch Speech Architecture Diagnostics
  // -------------------------------------------------------------------------
  useEffect(() => {
    fetch(`${API_BASE}/interview/speech/status`)
      .then(res => res.json())
      .then(data => setSpeechDiagnostics(data))
      .catch(err => console.warn('Could not fetch speech architecture status:', err));
  }, []);

  // -------------------------------------------------------------------------
  // Initialize Hardware Media Stream (Camera & Mic)
  // -------------------------------------------------------------------------
  const startMediaPreview = async () => {
    setDeviceError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' },
        audio: true
      });
      streamRef.current = stream;
      setHasCameraPermission(true);
      setHasMicPermission(true);

      if (videoPreviewRef.current) {
        videoPreviewRef.current.srcObject = stream;
      }

      // Initialize Audio Visualizer
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        audioContextRef.current = audioCtx;
        const source = audioCtx.createMediaStreamSource(stream);
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 64;
        source.connect(analyser);
        analyserRef.current = analyser;

        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        const checkVolume = () => {
          if (!analyserRef.current) return;
          analyserRef.current.getByteFrequencyData(dataArray);
          let sum = 0;
          for (let i = 0; i < dataArray.length; i++) {
            sum += dataArray[i];
          }
          const avg = sum / dataArray.length;
          setMicVolume(Math.min(100, Math.round((avg / 128) * 100)));
          animFrameRef.current = requestAnimationFrame(checkVolume);
        };
        checkVolume();
      } catch (audioErr) {
        console.warn('Web Audio volume meter could not be initialized:', audioErr);
      }
    } catch (err: any) {
      console.error('Camera/Mic permission error:', err);
      setDeviceError(err.message || 'Camera or microphone permission was denied by browser.');
      setHasCameraPermission(false);
      setHasMicPermission(false);
    }
  };

  const stopMediaStream = () => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(() => {});
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoPreviewRef.current) {
      videoPreviewRef.current.srcObject = null;
    }
  };

  // Re-bind video preview whenever video element mounts
  useEffect(() => {
    if (videoPreviewRef.current && streamRef.current) {
      videoPreviewRef.current.srcObject = streamRef.current;
    }
  }, [studioStep, videoPreviewRef.current]);

  // Clean up media on unmount
  useEffect(() => {
    return () => {
      stopMediaStream();
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (e) {}
      }
      if (visionIntervalRef.current) {
        clearInterval(visionIntervalRef.current);
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

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

    // Pick pleasant natural voice
    const voices = window.speechSynthesis.getVoices();
    const englishVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha')));
    if (englishVoice) {
      utterance.voice = englishVoice;
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

      // 2. Fetch First Question from Claude
      await fetchNextQuestion(sessionData.session_id);
    } catch (err: any) {
      console.error('Session initialization error:', err);
      setApiError(err.message || 'Error communicating with backend Claude API.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // -------------------------------------------------------------------------
  // Fetch Next Question from Claude
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
        throw new Error(errJson.detail || 'Claude question generation failed.');
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
      setApiError(err.message || 'Claude API encountered an error generating the question.');
      setInterviewerState('idle');
    }
  };

  // -------------------------------------------------------------------------
  // Submit Answer & Evaluate via Claude Rubric
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
      setApiError(err.message || 'Claude API encountered an error evaluating your answer.');
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
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header Hero */}
        <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2.5">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200/60">
                100% On-Website • Zero Zoom Required
              </span>
              <span className="text-xs text-slate-400 font-medium">Native Browser AI Interview Room</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              AI Interview Studio
            </h1>
            <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
              Conduct high-fidelity technical and behavioral interviews directly in your browser. Real-time Web Speech recognition, Claude rubric scoring, and OpenCV camera telemetry — fully integrated into Placement Hub without external meeting tools.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 flex items-center space-x-4 shrink-0">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center text-white shadow-xs">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] text-slate-500 font-medium">Verified Profile Skills</span>
              <p className="text-lg font-bold text-slate-900 dark:text-white">
                {verifiedSkills.length} Verified
              </p>
            </div>
          </div>
        </div>

        {/* Configuration Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left 2 Cols: Setup Options */}
          <div className="md:col-span-2 space-y-6">
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-brand-600" />
                1. Select Interview Target & Parameters
              </h3>

              {/* Verified Campus Drives / Jobs Selector */}
              {jobs.length > 0 && (
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Optionally link to an Active Campus Job Listing:
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
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="">Custom Role Entry</option>
                    {jobs.map(j => (
                      <option key={j.id} value={j.id}>
                        {j.companyName} — {j.title} ({j.packageLpa} LPA)
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Target Role Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Target Role / Position Title:
                </label>
                <input
                  type="text"
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  placeholder="e.g., Distributed Systems Engineer, SRE, Frontend Specialist"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500"
                />
              </div>

              {/* Required Skills Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Required Competencies & Skills (comma separated):
                </label>
                <input
                  type="text"
                  value={customSkillsInput}
                  onChange={(e) => setCustomSkillsInput(e.target.value)}
                  placeholder="e.g., Python, Docker, Distributed Systems, Concurrency, SQL"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500"
                />
                <p className="text-[11px] text-slate-500">
                  Questions are generated strictly for these skills. Verified candidate skills will be cross-referenced for grounded follow-ups.
                </p>
              </div>

              {/* Interview Type & Difficulty Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Interview Round Type:
                  </label>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="Technical">Technical & Coding Architecture</option>
                    <option value="System Design">System Design & Scaling</option>
                    <option value="Behavioral">Behavioral & Culture Fit</option>
                    <option value="Mixed">Mixed Comprehensive Round</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Difficulty Level:
                  </label>
                  <select
                    value={selectedDifficulty}
                    onChange={(e) => setSelectedDifficulty(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="Easy">Standard Campus Round (Tier 2/3)</option>
                    <option value="Medium">Challenging Product Round (Tier 1)</option>
                    <option value="Hard">Elite FAANG / Core Systems Round</option>
                  </select>
                </div>
              </div>

              {/* Question Count & Time Limits */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Number of Questions:
                  </label>
                  <select
                    value={questionLimit}
                    onChange={(e) => setQuestionLimit(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500"
                  >
                    <option value={3}>3 Questions (Quick ~10 min session)</option>
                    <option value={5}>5 Questions (Standard ~15 min session)</option>
                    <option value={7}>7 Questions (Comprehensive ~25 min session)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Target Session Duration:
                  </label>
                  <select
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500"
                  >
                    <option value={10}>10 Minutes</option>
                    <option value={15}>15 Minutes</option>
                    <option value={25}>25 Minutes</option>
                  </select>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2">
                <button
                  onClick={proceedToDeviceCheck}
                  className="w-full py-3 px-4 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-xs hover:shadow-brand-500/20 transition-all flex items-center justify-center gap-2"
                >
                  Proceed to Device & Permissions Check
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Col: Verified Candidate Inventory & Diagnostics */}
          <div className="space-y-6">
            {/* Candidate Context Card */}
            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">
                Verified Candidate Profile
              </h4>
              <div className="space-y-2">
                <p className="font-bold text-sm text-slate-900 dark:text-white">
                  {studentProfile?.name || 'Verified Candidate'}
                </p>
                <p className="text-xs text-slate-500">
                  {studentProfile?.degree} • CGPA {studentProfile?.cgpa}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
                <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                  Available Verified Skill Proofs ({verifiedSkills.length}):
                </span>
                {verifiedSkills.length === 0 ? (
                  <p className="text-[11px] text-slate-400 italic">
                    No skills verified via GitHub/Assessments yet. Claude will evaluate purely based on your answers to the selected role requirements.
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-1.5">
                    {verifiedSkills.map(s => (
                      <span
                        key={s.id}
                        className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200/50"
                      >
                        ✓ {s.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* AI Engine & Voice Infrastructure Card */}
            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">
                Interview Infrastructure Status
              </h4>
              
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Claude Reasoning:</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    integrationsStatus?.claude_api?.status === 'connected'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                  }`}>
                    {integrationsStatus?.claude_api?.status === 'connected' ? 'Active (Live)' : 'Setup Required'}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Voice STT Engine:</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                    Web Speech API (Real-Time)
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Computer Vision:</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
                    OpenCV 5.0 (Headless)
                  </span>
                </div>
              </div>

              {integrationsStatus?.claude_api?.status !== 'connected' && (
                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-800/40 text-[11px] text-amber-900 dark:text-amber-200 leading-relaxed">
                  Notice: Anthropic API key requires valid authentication in <code>backend/.env</code>. When starting the session, Claude will be invoked directly.
                </div>
              )}
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
        <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600">
                Step 2 of 3 • Hardware & Privacy Check
              </span>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                Camera, Microphone & Privacy Verification
              </h2>
            </div>
            <button
              onClick={() => {
                stopMediaStream();
                setStudioStep('setup');
              }}
              className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-white font-medium"
            >
              ← Back to Setup
            </button>
          </div>

          {deviceError && (
            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/40 text-xs text-rose-800 dark:text-rose-200 flex items-start gap-3">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Hardware Access Error</p>
                <p>{deviceError}</p>
                <button
                  onClick={startMediaPreview}
                  className="mt-2 text-xs font-bold text-rose-700 dark:text-rose-300 underline"
                >
                  Retry Device Permissions
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            {/* Live Camera Preview */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Video className="w-4 h-4 text-brand-600" />
                  Live Webcam Preview
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  hasCameraPermission
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                }`}>
                  {hasCameraPermission ? 'Camera Active' : 'Connecting...'}
                </span>
              </div>

              <div className="relative aspect-video rounded-2xl bg-slate-900 overflow-hidden border border-slate-200 dark:border-slate-800 flex items-center justify-center">
                <video
                  ref={videoPreviewRef}
                  autoPlay
                  playsInline
                  muted
                  className={`w-full h-full object-cover transform -scale-x-100 ${isVideoDisabled ? 'hidden' : ''}`}
                />
                {isVideoDisabled && (
                  <div className="text-center p-4 text-slate-400 text-xs space-y-2">
                    <VideoOff className="w-8 h-8 mx-auto text-slate-500" />
                    <p>Camera is currently turned off</p>
                  </div>
                )}
                {!hasCameraPermission && !isVideoDisabled && (
                  <div className="text-center p-4 text-slate-400 text-xs space-y-2">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto text-brand-400" />
                    <p>Waiting for webcam access...</p>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Toggle preview:</span>
                <button
                  type="button"
                  onClick={() => setIsVideoDisabled(!isVideoDisabled)}
                  className="font-semibold text-brand-600 dark:text-brand-400 hover:underline"
                >
                  {isVideoDisabled ? 'Enable Camera' : 'Disable Camera'}
                </button>
              </div>
            </div>

            {/* Live Microphone Visualizer & Privacy */}
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Mic className="w-4 h-4 text-brand-600" />
                    Live Microphone Test
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    hasMicPermission
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                  }`}>
                    {hasMicPermission ? 'Mic Ready' : 'Connecting...'}
                  </span>
                </div>

                {/* Real-time dB volume bar */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Volume Level:</span>
                    <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                      {micVolume}%
                    </span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-75 rounded-full ${
                        micVolume > 70 ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.max(4, micVolume)}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 italic">
                    Speak into your microphone. The green bar should react to your voice.
                  </p>
                </div>
              </div>

              {/* Strict Privacy Notice */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white">
                    Data Retention & Privacy Notice
                  </h4>
                </div>
                <div className="text-[11px] text-slate-600 dark:text-slate-400 space-y-1.5 leading-relaxed">
                  <p>
                    • <strong>Real-time Audio & Vision:</strong> Video frames and audio streams are processed in-memory for live speech recognition and camera framing diagnostics. <em>Raw video and audio are NOT retained on servers.</em>
                  </p>
                  <p>
                    • <strong>Stored Data:</strong> Only your transcribed answers, Claude evaluation rubrics, and overall session feedback are persisted in your student history.
                  </p>
                  <p>
                    • <strong>Fairness & Ethics:</strong> Camera framing and lighting telemetry are strictly for ergonomic guidance and are <strong>never</strong> used to infer honesty, intelligence, cheating, or interview suitability.
                  </p>
                </div>

                <label className="flex items-start gap-2.5 pt-2 border-t border-slate-200/80 dark:border-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consentAccepted}
                    onChange={(e) => setConsentAccepted(e.target.checked)}
                    className="mt-0.5 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                  />
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    I have read and agree to the interview recording policy and transcript evaluation terms.
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Start Session CTA */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <button
              onClick={() => {
                stopMediaStream();
                setStudioStep('setup');
              }}
              className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>

            <button
              onClick={startInterviewSession}
              disabled={!consentAccepted || isSubmitting}
              className={`px-6 py-3 rounded-xl font-bold text-xs shadow-xs transition-all flex items-center gap-2 ${
                consentAccepted && !isSubmitting
                  ? 'bg-brand-600 hover:bg-brand-500 text-white shadow-brand-500/20'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Initializing Claude Session...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  Start Real-Time Interview Now
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
        {/* Top Control Bar */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500" />
            </span>
            <div>
              <h2 className="text-xs md:text-sm font-bold text-slate-900 dark:text-white">
                {currentSession?.role_target}
              </h2>
              <span className="text-[11px] text-slate-500">
                Round: {currentSession?.interview_type} • Difficulty: {currentSession?.difficulty}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Progress Counter */}
            <div className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300">
              Question {activeTurn?.turn_number || currentSession?.turns.length || 1} of {currentSession?.question_limit}
            </div>

            <button
              onClick={handleFinishInterview}
              disabled={isSubmitting}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              Finish & Generate Report
            </button>

            <button
              onClick={handleCancelSession}
              className="px-3 py-1.5 rounded-xl border border-rose-300 dark:border-rose-800/60 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-xs font-semibold transition-colors"
            >
              End Session
            </button>
          </div>
        </div>

        {/* API Error Notification */}
        {apiError && (
          <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/40 text-xs text-rose-800 dark:text-rose-200 flex items-start justify-between gap-3">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Claude API Execution Error:</p>
                <p>{apiError}</p>
                <p className="mt-1 text-[11px] text-slate-500">
                  Under the Live Data policy, no fabricated questions are substituted. You can retry with a valid key in <code>backend/.env</code>.
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                if (currentSession) fetchNextQuestion(currentSession.id);
              }}
              className="px-3 py-1 rounded-lg bg-rose-600 text-white font-semibold text-xs shrink-0"
            >
              Retry
            </button>
          </div>
        )}

        {/* Main Stage: AI Avatar Area + Candidate Camera PIP */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left 2 Cols: AI Interviewer Avatar & Question */}
          <div className="lg:col-span-2 space-y-4">
            {/* Interviewer Stage */}
            <div className="relative aspect-video rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 overflow-hidden flex flex-col items-center justify-center p-6 shadow-md">
              {/* Subtle Ambient Radial Lighting */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.15)_0%,transparent_70%)] pointer-events-none" />

              {/* Status Badge in Stage */}
              <div className="absolute top-4 left-4 z-10">
                <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1.5 shadow-sm ${
                  interviewerState === 'speaking'
                    ? 'bg-emerald-500 text-white animate-pulse'
                    : interviewerState === 'listening'
                    ? 'bg-blue-500 text-white'
                    : interviewerState === 'evaluating'
                    ? 'bg-amber-500 text-white'
                    : 'bg-slate-700 text-slate-200'
                }`}>
                  {interviewerState === 'speaking' && <Volume2 className="w-3.5 h-3.5" />}
                  {interviewerState === 'listening' && <Mic className="w-3.5 h-3.5" />}
                  {interviewerState === 'evaluating' && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  {interviewerState === 'speaking' && 'Interviewer Speaking'}
                  {interviewerState === 'listening' && 'Listening to Answer'}
                  {interviewerState === 'evaluating' && 'Claude Evaluating Answer...'}
                  {interviewerState === 'idle' && 'AI Interviewer Idle'}
                </span>
              </div>

              {/* Interruption / Stop Speaking Button */}
              {interviewerState === 'speaking' && (
                <div className="absolute top-4 right-4 z-10">
                  <button
                    onClick={stopInterviewerSpeaking}
                    className="px-3 py-1 rounded-full bg-slate-800/80 hover:bg-slate-700 text-white text-[11px] font-semibold border border-slate-700 flex items-center gap-1 shadow-xs transition-colors"
                  >
                    <StopCircle className="w-3.5 h-3.5 text-rose-400" />
                    Skip / Interrupt Audio
                  </button>
                </div>
              )}

              {/* Lightweight Animated AI Avatar */}
              <div className="relative flex flex-col items-center justify-center space-y-4 z-0">
                <div className="relative">
                  {/* Speaking Ripples: Synchronized strictly when audio is playing */}
                  {interviewerState === 'speaking' && (
                    <>
                      <div className="absolute -inset-4 rounded-full bg-brand-500/30 animate-ping opacity-75" />
                      <div className="absolute -inset-8 rounded-full bg-brand-400/20 animate-pulse" />
                    </>
                  )}

                  {/* Main Avatar Shell */}
                  <div className={`w-28 h-28 md:w-32 md:h-32 rounded-full border-4 shadow-xl flex items-center justify-center transition-all ${
                    interviewerState === 'speaking'
                      ? 'border-brand-400 bg-gradient-to-tr from-brand-700 to-indigo-600 scale-105'
                      : interviewerState === 'evaluating'
                      ? 'border-amber-400 bg-gradient-to-tr from-amber-700 to-slate-800'
                      : 'border-slate-700 bg-gradient-to-tr from-slate-800 to-slate-900'
                  }`}>
                    <Bot className={`w-14 h-14 md:w-16 md:h-16 transition-colors ${
                      interviewerState === 'speaking' ? 'text-white' : 'text-slate-300'
                    }`} />
                  </div>
                </div>

                <div className="text-center space-y-1">
                  <h3 className="font-bold text-sm text-white tracking-wide">
                    Claude AI Senior Technical Interviewer
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Placement Assessment Committee • D.Y. Patil College of Engineering
                  </p>
                </div>
              </div>

              {/* Soundwave Animation Strip */}
              {interviewerState === 'speaking' && (
                <div className="absolute bottom-4 flex items-center space-x-1">
                  {[40, 70, 100, 60, 90, 45, 80, 100, 75, 40].map((h, i) => (
                    <div
                      key={i}
                      className="w-1 bg-brand-400 rounded-full animate-pulse"
                      style={{
                        height: `${h * 0.25}px`,
                        animationDelay: `${i * 0.1}s`
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Current Question Card */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300 border border-brand-200/50">
                  {activeTurn?.question_category || 'Technical Question'}
                </span>
                <span className="text-xs text-slate-400">
                  Question #{activeTurn?.turn_number || 1}
                </span>
              </div>

              <h2 className="text-base md:text-lg font-bold text-slate-900 dark:text-white leading-snug">
                {activeTurn?.question_text || 'Waiting for interview question generation...'}
              </h2>

              <p className="text-[11px] text-slate-500 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Evaluated on: Correctness • Relevance • Depth & Completeness • Clarity • Concrete Evidence
              </p>
            </div>
          </div>

          {/* Right Col: Candidate Live Camera & Real-Time Computer Vision Telemetry */}
          <div className="space-y-4">
            {/* Webcam Feed PIP */}
            <div className="relative aspect-video rounded-3xl bg-slate-900 overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xs">
              <video
                ref={videoPreviewRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover transform -scale-x-100 ${isVideoDisabled ? 'hidden' : ''}`}
              />
              {isVideoDisabled && (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 text-xs">
                  <VideoOff className="w-6 h-6 mb-1" />
                  <p>Camera Disabled</p>
                </div>
              )}

              {/* Hardware Toggles Overlay */}
              <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between px-2 py-1.5 rounded-xl bg-slate-900/80 backdrop-blur-md text-white text-xs">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setIsAudioMuted(!isAudioMuted)}
                    className="p-1 rounded-md hover:bg-slate-700"
                    title={isAudioMuted ? 'Unmute Mic' : 'Mute Mic'}
                  >
                    {isAudioMuted ? <MicOff className="w-4 h-4 text-rose-400" /> : <Mic className="w-4 h-4 text-emerald-400" />}
                  </button>
                  <button
                    onClick={() => setIsVideoDisabled(!isVideoDisabled)}
                    className="p-1 rounded-md hover:bg-slate-700"
                    title={isVideoDisabled ? 'Enable Camera' : 'Disable Camera'}
                  >
                    {isVideoDisabled ? <VideoOff className="w-4 h-4 text-rose-400" /> : <Video className="w-4 h-4 text-emerald-400" />}
                  </button>
                </div>

                <span className="text-[10px] text-slate-300 font-mono">
                  Mic: {micVolume}%
                </span>
              </div>
            </div>

            {/* OpenCV Computer Vision Telemetry Diagnostic Card */}
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-indigo-600" />
                  Camera & Framing Telemetry
                </h4>
                <span className="text-[10px] font-mono text-slate-400">
                  OpenCV 5.0
                </span>
              </div>

              {visionTelemetry ? (
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Face Visibility:</span>
                    <span className={`font-semibold ${visionTelemetry.face_detected ? 'text-emerald-600' : 'text-amber-600'}`}>
                      {visionTelemetry.face_detected ? 'Face Centered' : 'No Face Detected'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Framing Position:</span>
                    <span className="font-medium text-slate-800 dark:text-slate-200">
                      {visionTelemetry.approx_head_pose}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Lighting Quality:</span>
                    <span className="font-medium text-slate-800 dark:text-slate-200">
                      {visionTelemetry.lighting_quality}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Confidence:</span>
                    <span className="font-mono text-slate-700 dark:text-slate-300">
                      {Math.round(visionTelemetry.confidence * 100)}%
                    </span>
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-400 italic">
                    Ethical Notice: Telemetry is for framing awareness only. Never used for candidate scoring.
                  </div>
                </div>
              ) : (
                <div className="text-[11px] text-slate-400 italic py-2 text-center">
                  Sampling camera frames with OpenCV...
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Live Answer Transcription & Response Area */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                <Mic className="w-4 h-4 text-brand-600" />
                Your Response (Transcribed in Real-Time):
              </span>
              {interviewerState === 'listening' && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 animate-pulse">
                  Listening...
                </span>
              )}
            </div>

            <div className="flex items-center space-x-3 text-xs">
              <button
                type="button"
                onClick={() => setInputMode(inputMode === 'voice' ? 'text_fallback' : 'voice')}
                className="font-semibold text-brand-600 dark:text-brand-400 hover:underline"
              >
                {inputMode === 'voice' ? 'Switch to Text Fallback' : 'Switch to Microphone Voice'}
              </button>
            </div>
          </div>

          {inputMode === 'voice' ? (
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 min-h-[90px] text-xs md:text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
              {turnTranscript ? (
                <span>
                  {turnTranscript} <span className="text-slate-400 italic">{interimTranscript}</span>
                </span>
              ) : (
                <span className="text-slate-400 italic">
                  {interviewerState === 'listening'
                    ? 'Speak naturally into your microphone. Your answer will be transcribed here word for word...'
                    : 'Awaiting interviewer question...'}
                </span>
              )}
            </div>
          ) : (
            <textarea
              rows={4}
              value={textAnswer}
              onChange={(e) => setTextAnswer(e.target.value)}
              placeholder="Type your complete technical answer here if you are unable to use voice transcription..."
              className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-xs md:text-sm text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-brand-500"
            />
          )}

          {/* Action Row */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-slate-500">
              When finished speaking, click Submit Answer for Claude evaluation.
            </span>

            <button
              onClick={handleSubmitAnswer}
              disabled={isSubmitting || interviewerState === 'evaluating'}
              className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-xs hover:shadow-brand-500/20 transition-all flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Evaluating with Claude Rubric...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Submit Answer for Evaluation
                </>
              )}
            </button>
          </div>
        </div>

        {/* Turn Evaluation Modal / Bottom Drawer */}
        {showEvaluationModal && recentEvaluation && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 md:p-8 space-y-5 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-300 flex items-center justify-center font-bold text-sm">
                    {Math.round(recentEvaluation.turn_overall_score)}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                      Claude Rubric Evaluation
                    </h3>
                    <span className="text-xs text-slate-500">
                      Overall Turn Score: {recentEvaluation.turn_overall_score} / 100
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setShowEvaluationModal(false)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs font-bold"
                >
                  ✕
                </button>
              </div>

              {/* 5-Metric Breakdown */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-850 text-center">
                  <span className="text-[10px] text-slate-400">Correctness</span>
                  <p className="font-bold text-xs text-slate-900 dark:text-white">
                    {recentEvaluation.correctness_score}%
                  </p>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-850 text-center">
                  <span className="text-[10px] text-slate-400">Relevance</span>
                  <p className="font-bold text-xs text-slate-900 dark:text-white">
                    {recentEvaluation.relevance_score}%
                  </p>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-850 text-center">
                  <span className="text-[10px] text-slate-400">Completeness</span>
                  <p className="font-bold text-xs text-slate-900 dark:text-white">
                    {recentEvaluation.completeness_score}%
                  </p>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-850 text-center">
                  <span className="text-[10px] text-slate-400">Clarity</span>
                  <p className="font-bold text-xs text-slate-900 dark:text-white">
                    {recentEvaluation.clarity_score}%
                  </p>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-850 text-center col-span-2 sm:col-span-1">
                  <span className="text-[10px] text-slate-400">Evidence</span>
                  <p className="font-bold text-xs text-slate-900 dark:text-white">
                    {recentEvaluation.evidence_score}%
                  </p>
                </div>
              </div>

              {/* Strengths & Improvements */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/40 space-y-1.5">
                  <h4 className="font-bold text-emerald-900 dark:text-emerald-200">Observed Strengths:</h4>
                  <ul className="list-disc list-inside space-y-1 text-emerald-800 dark:text-emerald-300 text-[11px]">
                    {recentEvaluation.strengths.map((s, idx) => (
                      <li key={idx}>{s}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-3.5 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-800/40 space-y-1.5">
                  <h4 className="font-bold text-amber-900 dark:text-amber-200">Areas for Growth:</h4>
                  <ul className="list-disc list-inside space-y-1 text-amber-800 dark:text-amber-300 text-[11px]">
                    {recentEvaluation.areas_for_improvement.map((g, idx) => (
                      <li key={idx}>{g}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Follow-up / Next Step CTA */}
              <div className="pt-2 flex items-center justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowEvaluationModal(false);
                    if (activeTurn && currentSession) {
                      speakQuestion(activeTurn.question_text);
                    } else if (currentSession) {
                      fetchNextQuestion(currentSession.id);
                    }
                  }}
                  className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-xs"
                >
                  Continue to Next Question →
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
        {/* Header Hero */}
        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300 border border-brand-200/60">
              Verified Interview Feedback Report
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Session ID: {currentSession?.id}
            </span>
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-1">
              <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                {currentSession?.role_target} Mock Assessment
              </h1>
              <p className="text-xs text-slate-500">
                Evaluation conducted by Claude 3.5 Sonnet across {currentSession?.turns.length} technical turns.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800/40 text-center shrink-0">
              <span className="text-[10px] uppercase font-bold text-brand-700 dark:text-brand-300 tracking-wider">
                Overall Score
              </span>
              <p className="text-3xl font-extrabold text-brand-600 dark:text-brand-400">
                {Math.round(finalReport.overall_score)}<span className="text-base font-normal">/100</span>
              </p>
            </div>
          </div>

          {/* Committee Recommendation */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Award className="w-5 h-5 text-brand-600" />
              <div>
                <span className="text-xs font-semibold text-slate-500">Hiring Readiness Verdict:</span>
                <p className="font-bold text-sm text-slate-900 dark:text-white">
                  {finalReport.hiring_readiness_recommendation}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">
            Executive Summary
          </h3>
          <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {finalReport.executive_summary}
          </p>
        </div>

        {/* Strengths & Priority Growth Areas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <h3 className="font-bold text-sm text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Demonstrated Technical Strengths
            </h3>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
              {finalReport.key_strengths.map((str, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">•</span>
                  <span>{str}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <h3 className="font-bold text-sm text-amber-700 dark:text-amber-400 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Priority Growth & Preparation Areas
            </h3>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
              {finalReport.priority_growth_areas.map((p, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold">•</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Question-by-Question Transcript Breakdown */}
        {currentSession && currentSession.turns.length > 0 && (
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Turn-by-Turn Question & Answer Transcript
            </h3>

            <div className="space-y-4">
              {currentSession.turns.map(turn => (
                <div
                  key={turn.id}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-white">
                      Q{turn.turn_number}: {turn.question_text}
                    </span>
                    {turn.evaluation_result && (
                      <span className="font-mono font-bold text-brand-600">
                        {Math.round(turn.evaluation_result.turn_overall_score)}/100
                      </span>
                    )}
                  </div>

                  <p className="text-slate-600 dark:text-slate-400 bg-white/60 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-200/50 dark:border-slate-800/50">
                    <strong className="text-slate-700 dark:text-slate-300">Your Answer:</strong> {turn.student_answer_transcript || 'No answer recorded.'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Restart Action */}
        <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <p className="text-xs text-slate-500">
            This interview session is saved in your authenticated placement records.
          </p>
          <button
            onClick={() => {
              stopMediaStream();
              setStudioStep('setup');
              setCurrentSession(null);
              setFinalReport(null);
            }}
            className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-xs"
          >
            Start Another Interview Session
          </button>
        </div>
      </div>
    );
  }

  return null;
};
