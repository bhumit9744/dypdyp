import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  Send,
  Mail,
  Cpu,
  Bot,
  X,
  Maximize2,
  Minimize2,
  Copy,
  Check,
  ExternalLink,
  RefreshCw,
  Share2,
  Inbox,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

const LinkedinIcon: React.FC<{ className?: string }> = ({ className = 'w-3.5 h-3.5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.2a1.64 1.64 0 1 0 0 3.28 1.64 1.64 0 0 0 0-3.28Z" />
  </svg>
);

const API_BASE = 'http://127.0.0.1:8000/api/v1';

interface JarvisMessage {
  id: string;
  sender: 'user' | 'jarvis';
  text: string;
  timestamp: string;
  plugin?: string;
  data?: any;
}

export const JarvisVoiceAssistant: React.FC = () => {
  const { studentProfile } = useApp();

  // Floating & Modal State
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'voice' | 'linkedin' | 'mail' | 'system'>('voice');
  const [isMaximized, setIsMaximized] = useState<boolean>(false);

  // Voice & Wake-word State
  const [isWakeWordArmed, setIsWakeWordArmed] = useState<boolean>(true);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [speechSupported, setSpeechSupported] = useState<boolean>(true);
  const [voiceVolumeEnabled, setVoiceVolumeEnabled] = useState<boolean>(true);
  const [interimTranscript, setInterimTranscript] = useState<string>('');
  const [wakeState, setWakeState] = useState<'idle' | 'listening' | 'processing' | 'speaking'>('idle');

  // Chat & History
  const [query, setQuery] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [messages, setMessages] = useState<JarvisMessage[]>([
    {
      id: 'm_init',
      sender: 'jarvis',
      text: 'Good day, Sir. JARVIS is online and primed. All systems synchronized with Google Gemini and OpenJarvis. You may speak to me directly by saying "Jarvis", or explore your LinkedIn and Mail plugins.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      plugin: 'core'
    }
  ]);

  // LinkedIn Plugin State
  const [liTopic, setLiTopic] = useState<string>('Cracking the Technical Placement Interview');
  const [liTone, setLiTone] = useState<string>('professional_inspiring');
  const [liPosts, setLiPosts] = useState<any[]>([]);
  const [isGeneratingLiPost, setIsGeneratingLiPost] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [outreachTarget, setOutreachTarget] = useState<string>('Senior Software Engineer');
  const [outreachCompany, setOutreachCompany] = useState<string>('Google');
  const [outreachResult, setOutreachResult] = useState<string | null>(null);
  const [isGeneratingOutreach, setIsGeneratingOutreach] = useState<boolean>(false);

  // Mail Plugin State
  const [mailSubTab, setMailSubTab] = useState<'inbox' | 'compose'>('inbox');
  const [inboxEmails, setInboxEmails] = useState<any[]>([]);
  const [mailRecipientName, setMailRecipientName] = useState<string>('Campus Hiring Manager');
  const [mailRecipientEmail, setMailRecipientEmail] = useState<string>('recruiter@techplacement.com');
  const [mailType, setMailType] = useState<string>('thank_you');
  const [mailSubject, setMailSubject] = useState<string>('');
  const [mailBody, setMailBody] = useState<string>('');
  const [isDraftingMail, setIsDraftingMail] = useState<boolean>(false);
  const [isSendingMail, setIsSendingMail] = useState<boolean>(false);
  const [mailSendSuccess, setMailSendSuccess] = useState<string | null>(null);

  // System & Telemetry State
  const [jarvisStatus, setJarvisStatus] = useState<any>(null);

  // Refs
  const recognitionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // -------------------------------------------------------------------------
  // Web Audio Harmonic Chime (Tony Stark Arc-Reactor Activation Sound)
  // -------------------------------------------------------------------------
  const playWakeChime = () => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const now = ctx.currentTime;
      // Dual resonant chord: 587.33Hz (D5) and 880Hz (A5) with quick arpeggio to 1174.66Hz (D6)
      const freqs = [587.33, 880, 1174.66];
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.07);

        gain.gain.setValueAtTime(0, now + idx * 0.07);
        gain.gain.linearRampToValueAtTime(0.18, now + idx * 0.07 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.07 + 0.4);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.07);
        osc.stop(now + idx * 0.07 + 0.45);
      });
    } catch (e) {
      console.warn('Audio chime unsupported:', e);
    }
  };

  // -------------------------------------------------------------------------
  // Speech Synthesis (Jarvis Voice)
  // -------------------------------------------------------------------------
  const speakJarvis = (text: string) => {
    if (!voiceVolumeEnabled || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.02;
      utterance.pitch = 0.95;

      // Select natural British or English voice if available
      const voices = window.speechSynthesis.getVoices();
      const preferred =
        voices.find(v => v.lang.includes('en-GB') || v.name.toLowerCase().includes('george') || v.name.toLowerCase().includes('daniel') || v.name.toLowerCase().includes('oliver')) ||
        voices.find(v => v.lang.startsWith('en')) ||
        voices[0];

      if (preferred) utterance.voice = preferred;

      utterance.onstart = () => setWakeState('speaking');
      utterance.onend = () => setWakeState('idle');
      utterance.onerror = () => setWakeState('idle');

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis error:', e);
      setWakeState('idle');
    }
  };

  // -------------------------------------------------------------------------
  // Speech Recognition & Wake-Word Detection
  // -------------------------------------------------------------------------
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechSupported(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        let currentInterim = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            handleSpokenFinal(transcript);
          } else {
            currentInterim += transcript;
          }
        }
        setInterimTranscript(currentInterim);
      };

      recognition.onerror = (event: any) => {
        if (event.error !== 'no-speech') {
          console.warn('Speech recognition status:', event.error);
        }
      };

      recognition.onend = () => {
        // Automatically restart if wake word is armed
        if (isWakeWordArmed) {
          try {
            recognition.start();
          } catch (_) {}
        } else {
          setIsListening(false);
        }
      };

      recognitionRef.current = recognition;
      if (isWakeWordArmed) {
        try {
          recognition.start();
          setIsListening(true);
        } catch (_) {}
      }
    } catch (err) {
      console.warn('Speech recognition init error:', err);
      setSpeechSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (_) {}
      }
    };
  }, [isWakeWordArmed]);

  useEffect(() => {
    const handleOpen = () => {
      playWakeChime();
      setIsOpen(true);
      speakJarvis('Jarvis online, Sir. How may I assist you?');
    };
    window.addEventListener('open-jarvis', handleOpen);
    return () => window.removeEventListener('open-jarvis', handleOpen);
  }, []);

  const handleSpokenFinal = (text: string) => {
    setInterimTranscript('');
    const clean = text.trim();
    if (!clean) return;

    // Wake-word pattern check
    const isWakeDetected = /\b(jarvis|hey jarvis|hello jarvis|ok jarvis)\b/i.test(clean);

    if (isWakeDetected) {
      playWakeChime();
      setIsOpen(true);
      setWakeState('listening');

      // Strip out the wake word to isolate the command if provided together
      const stripped = clean.replace(/\b(hey jarvis|hello jarvis|ok jarvis|jarvis)\b/gi, '').trim();

      if (stripped.length > 2) {
        // Direct command chained: e.g. "Jarvis, draft a LinkedIn post"
        submitCommand(stripped, 'voice');
      } else {
        // Wake-word alone: acknowledge readiness
        speakJarvis('Jarvis online, Sir. How may I assist you?');
      }
    } else if (isOpen && isListening) {
      // User is already in conversation with Jarvis
      submitCommand(clean, 'voice');
    }
  };

  // -------------------------------------------------------------------------
  // Fetch Status, Posts & Inbox
  // -------------------------------------------------------------------------
  const fetchTelemetry = async () => {
    try {
      const [statusRes, liRes, mailRes] = await Promise.all([
        fetch(`${API_BASE}/jarvis/status`).catch(() => null),
        fetch(`${API_BASE}/jarvis/linkedin/posts`).catch(() => null),
        fetch(`${API_BASE}/jarvis/mail/inbox`).catch(() => null)
      ]);

      if (statusRes && statusRes.ok) {
        const data = await statusRes.json();
        setJarvisStatus(data);
      }
      if (liRes && liRes.ok) {
        const posts = await liRes.json();
        setLiPosts(posts);
      }
      if (mailRes && mailRes.ok) {
        const mails = await mailRes.json();
        setInboxEmails(mails);
      }
    } catch (err) {
      console.warn('Error fetching Jarvis telemetry:', err);
    }
  };

  useEffect(() => {
    fetchTelemetry();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, interimTranscript]);

  // -------------------------------------------------------------------------
  // Command Execution (Voice & Text)
  // -------------------------------------------------------------------------
  const submitCommand = async (cmdText: string, source: 'voice' | 'text' = 'text') => {
    const text = cmdText.trim();
    if (!text || isProcessing) return;

    // Append user message
    const userMsg: JarvisMessage = {
      id: `u_${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, userMsg]);
    setQuery('');
    setIsProcessing(true);
    setWakeState('processing');

    try {
      const res = await fetch(`${API_BASE}/jarvis/command`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: text,
          source,
          student_id: studentProfile?.id || 'std_current_user'
        })
      });

      if (!res.ok) throw new Error('Jarvis command dispatch returned an error.');

      const data = await res.json();
      const jarvisMsg: JarvisMessage = {
        id: `j_${Date.now()}`,
        sender: 'jarvis',
        text: data.response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        plugin: data.plugin,
        data: data.data
      };

      setMessages(prev => [...prev, jarvisMsg]);

      // Speak back the response
      if (data.voice_speech) {
        speakJarvis(data.voice_speech);
      } else {
        setWakeState('idle');
      }

      // If action affected LinkedIn or Mail, refresh them
      if (data.plugin === 'linkedin') {
        fetchTelemetry();
        setActiveTab('linkedin');
      } else if (data.plugin === 'mail') {
        fetchTelemetry();
        setActiveTab('mail');
      }
    } catch (err: any) {
      const errMsg: JarvisMessage = {
        id: `j_err_${Date.now()}`,
        sender: 'jarvis',
        text: 'Apologies, Sir. I encountered a minor communication latency connecting with the neural core. Systems remain operational.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errMsg]);
      speakJarvis('Apologies, Sir. Communication latency encountered.');
      setWakeState('idle');
    } finally {
      setIsProcessing(false);
    }
  };

  // -------------------------------------------------------------------------
  // LinkedIn Plugin Actions
  // -------------------------------------------------------------------------
  const handleGenerateLinkedInPost = async () => {
    if (!liTopic.trim() || isGeneratingLiPost) return;
    setIsGeneratingLiPost(true);
    try {
      const res = await fetch(`${API_BASE}/jarvis/linkedin/post`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: liTopic,
          tone: liTone,
          highlights: ['Evidence-backed software milestones', 'Continuous engineering rigor']
        })
      });
      if (res.ok) {
        const newPost = await res.json();
        setLiPosts(prev => [newPost, ...prev]);
        speakJarvis('Your LinkedIn post has been drafted and is ready for publishing, Sir.');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingLiPost(false);
    }
  };

  const handleGenerateOutreach = async () => {
    if (!outreachTarget || !outreachCompany || isGeneratingOutreach) return;
    setIsGeneratingOutreach(true);
    try {
      const res = await fetch(`${API_BASE}/jarvis/linkedin/outreach`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          target_name: outreachTarget,
          target_company: outreachCompany,
          target_role: 'Engineering Lead / Alumni',
          student_interest: 'Full-Stack Architecture & Cloud Reliability'
        })
      });
      if (res.ok) {
        const data = await res.json();
        setOutreachResult(data.message);
        speakJarvis('LinkedIn connection outreach formulated, Sir.');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingOutreach(false);
    }
  };

  const copyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const shareToLinkedIn = (text: string) => {
    const encoded = encodeURIComponent(text);
    window.open(`https://www.linkedin.com/feed/?shareActive=true&text=${encoded}`, '_blank');
  };

  // -------------------------------------------------------------------------
  // Mail Plugin Actions
  // -------------------------------------------------------------------------
  const handleDraftEmail = async () => {
    setIsDraftingMail(true);
    setMailSendSuccess(null);
    try {
      const res = await fetch(`${API_BASE}/jarvis/mail/draft`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipient_name: mailRecipientName,
          recipient_email: mailRecipientEmail,
          email_type: mailType,
          job_role: 'Software Engineer',
          company_name: 'Placement Partner'
        })
      });
      if (res.ok) {
        const draft = await res.json();
        setMailSubject(draft.subject);
        setMailBody(draft.body);
        speakJarvis('Email draft compiled according to your specifications, Sir.');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsDraftingMail(false);
    }
  };

  const handleSendEmail = async () => {
    if (!mailRecipientEmail || !mailSubject || !mailBody || isSendingMail) return;
    setIsSendingMail(true);
    try {
      const res = await fetch(`${API_BASE}/jarvis/mail/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to_email: mailRecipientEmail,
          recipient_name: mailRecipientName,
          subject: mailSubject,
          body: mailBody
        })
      });
      if (res.ok) {
        setMailSendSuccess(`Successfully dispatched to ${mailRecipientEmail}`);
        speakJarvis(`Email dispatched to ${mailRecipientName}, Sir.`);
        setTimeout(() => setMailSendSuccess(null), 4000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSendingMail(false);
    }
  };

  return (
    <>
      {/* ===================================================================
       * 1. Floating Holographic Arc-Reactor Orb (Always Present Bottom-Right)
       * =================================================================== */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 select-none no-print">
        {/* Wake-Word Badge Notification */}
        {isWakeWordArmed && !isOpen && (
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 text-cyan-300 border border-cyan-500/40 text-xs shadow-lg backdrop-blur-md animate-pulse">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span className="font-semibold tracking-wide">Say "Jarvis" to Wake</span>
          </div>
        )}

        {/* Arc-Reactor Trigger Button */}
        <button
          onClick={() => {
            playWakeChime();
            setIsOpen(!isOpen);
            if (!isOpen) {
              speakJarvis('Jarvis online, Sir.');
            }
          }}
          className={`relative group w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl ${
            isOpen
              ? 'bg-gradient-to-tr from-cyan-600 to-blue-700 ring-4 ring-cyan-400/50 scale-105'
              : 'bg-gradient-to-tr from-slate-900 via-slate-800 to-cyan-950 border border-cyan-500/40 hover:scale-110 hover:shadow-cyan-500/30'
          }`}
          title="JARVIS AI Voice & Executive Agent"
          aria-label="Toggle Jarvis"
        >
          {/* Animated Glowing Rings */}
          <div className="absolute inset-0 rounded-full border border-cyan-400/30 animate-spin" style={{ animationDuration: '8s' }} />
          <div className="absolute inset-1 rounded-full border border-dashed border-blue-400/40 animate-spin" style={{ animationDuration: '14s', animationDirection: 'reverse' }} />

          {/* Central Reactor Core */}
          <div className="relative z-10 flex items-center justify-center">
            {wakeState === 'listening' ? (
              <Mic className="w-6 h-6 text-cyan-300 animate-pulse" />
            ) : wakeState === 'speaking' ? (
              <Volume2 className="w-6 h-6 text-emerald-300 animate-bounce" />
            ) : (
              <Bot className="w-6 h-6 text-cyan-300 group-hover:text-white transition-colors" />
            )}
          </div>

          {/* Pulse Status Indicator Dot */}
          <span className={`absolute top-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-slate-900 ${
            wakeState === 'listening' ? 'bg-amber-400 animate-ping' : 'bg-emerald-400'
          }`} />
        </button>
      </div>

      {/* ===================================================================
       * 2. Jarvis Command Center HUD Modal
       * =================================================================== */}
      {isOpen && (
        <div className={`fixed z-50 transition-all duration-300 shadow-2xl no-print ${
          isMaximized
            ? 'inset-4 md:inset-8'
            : 'bottom-24 right-6 w-[94vw] max-w-[540px] h-[680px] max-h-[85vh]'
        }`}>
          <div className="w-full h-full rounded-2xl bg-slate-950/95 text-slate-100 border border-cyan-500/30 backdrop-blur-xl flex flex-col overflow-hidden shadow-2xl">
            {/* Top Futuristic Header */}
            <div className="px-4 py-3.5 border-b border-cyan-500/20 bg-slate-900/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative w-8 h-8 rounded-full bg-cyan-950 border border-cyan-400 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-cyan-400" />
                  <div className="absolute inset-0 rounded-full bg-cyan-400/20 animate-ping" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm tracking-wider bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                      JARVIS
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 font-mono">
                      v3.5 LIVE
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    {jarvisStatus?.brain_engine || 'Gemini 3.5 & OpenJarvis'}
                  </p>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setVoiceVolumeEnabled(!voiceVolumeEnabled)}
                  className={`p-1.5 rounded-lg border text-xs transition-colors ${
                    voiceVolumeEnabled
                      ? 'border-cyan-500/40 text-cyan-400 bg-cyan-950/40'
                      : 'border-slate-800 text-slate-500 hover:text-slate-300'
                  }`}
                  title={voiceVolumeEnabled ? 'Voice Output Muted' : 'Enable Voice Output'}
                >
                  {voiceVolumeEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </button>

                <button
                  onClick={() => setIsMaximized(!isMaximized)}
                  className="p-1.5 rounded-lg border border-slate-800 text-slate-400 hover:text-white transition-colors"
                >
                  {isMaximized ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>

                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg border border-slate-800 text-slate-400 hover:text-rose-400 hover:border-rose-900 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-cyan-500/20 bg-slate-900/40 text-xs font-semibold px-2">
              <button
                onClick={() => setActiveTab('voice')}
                className={`px-3 py-2.5 flex items-center gap-1.5 border-b-2 transition-all ${
                  activeTab === 'voice'
                    ? 'border-cyan-400 text-cyan-300 bg-cyan-950/30'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Mic className="w-3.5 h-3.5" />
                <span>Voice & Chat</span>
              </button>

              <button
                onClick={() => setActiveTab('linkedin')}
                className={`px-3 py-2.5 flex items-center gap-1.5 border-b-2 transition-all ${
                  activeTab === 'linkedin'
                    ? 'border-blue-400 text-blue-300 bg-blue-950/30'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <LinkedinIcon className="w-3.5 h-3.5 text-blue-400" />
                <span>LinkedIn Plugin</span>
              </button>

              <button
                onClick={() => setActiveTab('mail')}
                className={`px-3 py-2.5 flex items-center gap-1.5 border-b-2 transition-all ${
                  activeTab === 'mail'
                    ? 'border-purple-400 text-purple-300 bg-purple-950/30'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Mail Plugin</span>
              </button>

              <button
                onClick={() => setActiveTab('system')}
                className={`px-3 py-2.5 flex items-center gap-1.5 border-b-2 transition-all ${
                  activeTab === 'system'
                    ? 'border-emerald-400 text-emerald-300 bg-emerald-950/30'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Cpu className="w-3.5 h-3.5" />
                <span>OpenJarvis Core</span>
              </button>
            </div>

            {/* Tab Contents */}
            <div className="flex-1 min-h-0 flex flex-col">
              {/* =============================================================
               * TAB 1: VOICE & CONVERSATIONAL HUB
               * ============================================================= */}
              {activeTab === 'voice' && (
                <div className="flex-1 flex flex-col min-h-0">
                  {/* Visualizer Wave & Wake Banner */}
                  <div className="p-3 bg-gradient-to-r from-slate-900 via-cyan-950/40 to-slate-900 border-b border-cyan-500/10 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${
                        wakeState === 'listening' ? 'bg-amber-400 animate-ping' : 'bg-cyan-400'
                      }`} />
                      <span className="font-mono text-cyan-300 text-[11px]">
                        {wakeState === 'listening' ? 'Listening to speech…' :
                         wakeState === 'speaking' ? 'Jarvis Speaking…' :
                         wakeState === 'processing' ? 'Thinking with Gemini Core…' :
                         'Armed • Say "Jarvis"'}
                      </span>
                    </div>

                    <button
                      onClick={() => setIsWakeWordArmed(!isWakeWordArmed)}
                      className={`text-[10px] px-2 py-0.5 rounded-full border transition-all ${
                        isWakeWordArmed
                          ? 'border-cyan-500/60 bg-cyan-950/60 text-cyan-300'
                          : 'border-slate-700 bg-slate-900 text-slate-500'
                      }`}
                    >
                      {isWakeWordArmed ? 'Wake-Word ON' : 'Wake-Word OFF'}
                    </button>
                  </div>

                  {/* Messages Scroll Area */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
                    {messages.map(m => (
                      <div
                        key={m.id}
                        className={`flex flex-col ${
                          m.sender === 'user' ? 'items-end' : 'items-start'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 mb-1 px-1 text-[10px] text-slate-500 font-mono">
                          <span>{m.sender === 'user' ? 'You' : 'JARVIS'}</span>
                          <span>•</span>
                          <span>{m.timestamp}</span>
                        </div>
                        <div
                          className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 leading-relaxed shadow-sm ${
                            m.sender === 'user'
                              ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-br-none'
                              : 'bg-slate-900/90 text-slate-200 border border-cyan-500/20 rounded-bl-none'
                          }`}
                        >
                          <div className="whitespace-pre-wrap">{m.text}</div>

                          {m.sender === 'jarvis' && (
                            <div className="mt-2 pt-2 border-t border-slate-800 flex items-center justify-end gap-2">
                              <button
                                onClick={() => speakJarvis(m.text)}
                                className="text-[10px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                              >
                                <Volume2 className="w-3 h-3" />
                                <span>Replay Voice</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}

                    {interimTranscript && (
                      <div className="flex flex-col items-end">
                        <div className="max-w-[80%] rounded-2xl px-3 py-2 bg-slate-800/80 text-cyan-300 border border-cyan-500/30 text-xs italic animate-pulse">
                          "{interimTranscript}"
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Quick Voice Chips */}
                  <div className="px-3 py-1.5 bg-slate-900/60 border-t border-slate-800/80 flex items-center gap-1.5 overflow-x-auto text-[10px] no-scrollbar">
                    <button
                      onClick={() => submitCommand('Jarvis, draft a LinkedIn post about clearing my technical interview')}
                      className="px-2.5 py-1 rounded-full bg-slate-800 text-cyan-300 hover:bg-slate-700 whitespace-nowrap transition-colors"
                    >
                      🚀 Draft LinkedIn Post
                    </button>
                    <button
                      onClick={() => submitCommand('Jarvis, draft a thank you email for the recruiter')}
                      className="px-2.5 py-1 rounded-full bg-slate-800 text-purple-300 hover:bg-slate-700 whitespace-nowrap transition-colors"
                    >
                      ✉️ Thank You Email
                    </button>
                    <button
                      onClick={() => submitCommand('Jarvis, check my placement inbox')}
                      className="px-2.5 py-1 rounded-full bg-slate-800 text-emerald-300 hover:bg-slate-700 whitespace-nowrap transition-colors"
                    >
                      📬 Check Inbox
                    </button>
                  </div>

                  {/* Input Bar */}
                  <div className="p-3 bg-slate-900/90 border-t border-cyan-500/20 flex items-center gap-2">
                    <button
                      onClick={() => {
                        playWakeChime();
                        if (recognitionRef.current) {
                          try {
                            recognitionRef.current.start();
                            setIsListening(true);
                            setWakeState('listening');
                          } catch (_) {}
                        }
                      }}
                      className={`p-2 rounded-xl transition-all ${
                        wakeState === 'listening'
                          ? 'bg-amber-500 text-slate-950 animate-pulse'
                          : 'bg-cyan-950 text-cyan-400 hover:bg-cyan-900 border border-cyan-500/30'
                      }`}
                      title="Hold / Tap to speak"
                    >
                      <Mic className="w-4 h-4" />
                    </button>

                    <input
                      type="text"
                      value={query}
                      onChange={e => setQuery(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && submitCommand(query, 'text')}
                      placeholder="Ask Jarvis anything or speak 'Jarvis'..."
                      className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-cyan-500"
                    />

                    <button
                      onClick={() => submitCommand(query, 'text')}
                      disabled={!query.trim() || isProcessing}
                      className="p-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-white transition-colors"
                    >
                      {isProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}

              {/* =============================================================
               * TAB 2: LINKEDIN PLUGIN
               * ============================================================= */}
              {activeTab === 'linkedin' && (
                <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
                  {/* Account Status Card */}
                  <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-500/30 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
                        in
                      </div>
                      <div>
                        <h4 className="font-bold text-white">LinkedIn Executive Sync</h4>
                        <p className="text-[11px] text-blue-300">
                          Account: {studentProfile?.name || 'Candidate Student'} (DYPCOE)
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">
                      Sync Active
                    </span>
                  </div>

                  {/* Post Generator */}
                  <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-3">
                    <h3 className="font-bold text-slate-200 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-cyan-400" />
                      AI Viral Post Generator
                    </h3>

                    <div className="space-y-1">
                      <label className="text-[11px] text-slate-400">Post Topic / Milestone:</label>
                      <input
                        type="text"
                        value={liTopic}
                        onChange={e => setLiTopic(e.target.value)}
                        placeholder="e.g. Cleared First Round at Barclays, Completed OpenJarvis Integration"
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white"
                      />
                    </div>

                    <div className="flex items-center justify-between gap-3">
                      <select
                        value={liTone}
                        onChange={e => setLiTone(e.target.value)}
                        className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300"
                      >
                        <option value="professional_inspiring">Inspiring & Professional</option>
                        <option value="technical_deepdive">Technical Deep-Dive</option>
                        <option value="casual_student">Student Journey Story</option>
                      </select>

                      <button
                        onClick={handleGenerateLinkedInPost}
                        disabled={isGeneratingLiPost}
                        className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold flex items-center gap-1.5 transition-colors"
                      >
                        {isGeneratingLiPost ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                        <span>Generate Post</span>
                      </button>
                    </div>
                  </div>

                  {/* Outreach Generator */}
                  <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-3">
                    <h3 className="font-bold text-slate-200 flex items-center gap-1.5">
                      <Share2 className="w-4 h-4 text-blue-400" />
                      Alumni & Recruiter Outreach (300-Char Ready)
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={outreachTarget}
                        onChange={e => setOutreachTarget(e.target.value)}
                        placeholder="Target Name / Role"
                        className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                      />
                      <input
                        type="text"
                        value={outreachCompany}
                        onChange={e => setOutreachCompany(e.target.value)}
                        placeholder="Company (e.g. Google)"
                        className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                      />
                    </div>
                    <button
                      onClick={handleGenerateOutreach}
                      disabled={isGeneratingOutreach}
                      className="w-full py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 font-semibold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      {isGeneratingOutreach ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                      <span>Formulate Personalized Note</span>
                    </button>

                    {outreachResult && (
                      <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-[11px] space-y-2">
                        <p className="whitespace-pre-wrap text-slate-300">{outreachResult}</p>
                        <button
                          onClick={() => copyText(outreachResult, 'outreach')}
                          className="px-2.5 py-1 rounded bg-blue-600 text-white font-medium flex items-center gap-1"
                        >
                          {copiedId === 'outreach' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedId === 'outreach' ? 'Copied' : 'Copy Connection Note'}</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Published & Drafted Posts Feed */}
                  <div className="space-y-2">
                    <h3 className="font-bold text-slate-300">Generated & Synced Posts</h3>
                    {liPosts.map(post => (
                      <div key={post.id} className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                        <div className="flex items-center justify-between text-[11px] text-slate-400">
                          <span className="font-semibold text-slate-200">{post.title}</span>
                          <span>{post.created_at}</span>
                        </div>
                        <p className="text-[11px] text-slate-300 whitespace-pre-wrap leading-relaxed">
                          {post.content}
                        </p>
                        <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-800/80">
                          <button
                            onClick={() => copyText(post.content, post.id)}
                            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center gap-1"
                          >
                            {copiedId === post.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                            <span>{copiedId === post.id ? 'Copied' : 'Copy'}</span>
                          </button>
                          <button
                            onClick={() => shareToLinkedIn(post.content)}
                            className="px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white font-medium flex items-center gap-1"
                          >
                            <ExternalLink className="w-3 h-3" />
                            <span>Share to LinkedIn</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* =============================================================
               * TAB 3: MAIL PLUGIN
               * ============================================================= */}
              {activeTab === 'mail' && (
                <div className="flex-1 flex flex-col min-h-0">
                  {/* Mail Sub-Navigation */}
                  <div className="px-4 py-2 border-b border-slate-800 flex items-center gap-2 text-xs">
                    <button
                      onClick={() => setMailSubTab('inbox')}
                      className={`px-3 py-1 rounded-lg transition-colors flex items-center gap-1.5 ${
                        mailSubTab === 'inbox' ? 'bg-purple-950 text-purple-300 font-bold' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <Inbox className="w-3.5 h-3.5" />
                      <span>Placement Inbox ({inboxEmails.length})</span>
                    </button>
                    <button
                      onClick={() => setMailSubTab('compose')}
                      className={`px-3 py-1 rounded-lg transition-colors flex items-center gap-1.5 ${
                        mailSubTab === 'compose' ? 'bg-purple-950 text-purple-300 font-bold' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Compose AI Email</span>
                    </button>
                  </div>

                  {/* Mail Sub-Content */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
                    {mailSubTab === 'inbox' ? (
                      <div className="space-y-2.5">
                        {inboxEmails.map(mail => (
                          <div
                            key={mail.id}
                            className={`p-3 rounded-xl border transition-all ${
                              !mail.read
                                ? 'bg-purple-950/30 border-purple-500/40'
                                : 'bg-slate-900/60 border-slate-800'
                            }`}
                          >
                            <div className="flex items-center justify-between text-[11px] mb-1">
                              <span className="font-bold text-slate-200">{mail.sender_name}</span>
                              <span className="text-slate-500">{mail.date}</span>
                            </div>
                            <h4 className="font-semibold text-slate-100 text-xs mb-1">{mail.subject}</h4>
                            <p className="text-[11px] text-slate-400 leading-relaxed">{mail.snippet}</p>

                            <div className="mt-2.5 flex items-center justify-between text-[10px]">
                              <span className="px-2 py-0.5 rounded-full bg-slate-800 text-purple-300 font-mono">
                                {mail.tag}
                              </span>
                              <button
                                onClick={() => {
                                  setMailRecipientEmail(mail.sender);
                                  setMailRecipientName(mail.sender_name);
                                  setMailType('thank_you');
                                  setMailSubTab('compose');
                                  handleDraftEmail();
                                }}
                                className="text-purple-400 hover:text-purple-300 font-semibold"
                              >
                                Reply with Jarvis AI →
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[11px] text-slate-400">Recipient Name:</label>
                            <input
                              type="text"
                              value={mailRecipientName}
                              onChange={e => setMailRecipientName(e.target.value)}
                              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                            />
                          </div>
                          <div>
                            <label className="text-[11px] text-slate-400">Recipient Email:</label>
                            <input
                              type="email"
                              value={mailRecipientEmail}
                              onChange={e => setMailRecipientEmail(e.target.value)}
                              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                            />
                          </div>
                        </div>

                        <div className="flex items-center justify-between gap-2">
                          <select
                            value={mailType}
                            onChange={e => setMailType(e.target.value)}
                            className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300"
                          >
                            <option value="thank_you">Post-Interview Thank You</option>
                            <option value="follow_up">Application Status Follow-up</option>
                            <option value="cold_outreach">Cold Recruiter Outreach</option>
                            <option value="recommendation_request">Faculty Recommendation Request</option>
                          </select>

                          <button
                            onClick={handleDraftEmail}
                            disabled={isDraftingMail}
                            className="px-3.5 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-semibold flex items-center gap-1.5 transition-colors"
                          >
                            {isDraftingMail ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                            <span>AI Draft</span>
                          </button>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] text-slate-400">Subject:</label>
                          <input
                            type="text"
                            value={mailSubject}
                            onChange={e => setMailSubject(e.target.value)}
                            placeholder="Email Subject Line"
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] text-slate-400">Message Body:</label>
                          <textarea
                            rows={7}
                            value={mailBody}
                            onChange={e => setMailBody(e.target.value)}
                            placeholder="Draft will populate here..."
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-white leading-relaxed font-mono"
                          />
                        </div>

                        {mailSendSuccess && (
                          <div className="p-2.5 rounded-lg bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs">
                            ✓ {mailSendSuccess}
                          </div>
                        )}

                        <div className="flex items-center justify-end gap-2 pt-2">
                          <button
                            onClick={() => copyText(`${mailSubject}\n\n${mailBody}`, 'mail')}
                            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center gap-1"
                          >
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy</span>
                          </button>
                          <button
                            onClick={handleSendEmail}
                            disabled={isSendingMail || !mailSubject || !mailBody}
                            className="px-4 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white font-semibold flex items-center gap-1.5 transition-colors"
                          >
                            {isSendingMail ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                            <span>Send Email</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* =============================================================
               * TAB 4: SYSTEM & OPENJARVIS TELEMETRY
               * ============================================================= */}
              {activeTab === 'system' && (
                <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
                  {/* OpenJarvis Status Card */}
                  <div className="p-4 rounded-xl bg-slate-900 border border-cyan-500/30 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Cpu className="w-5 h-5 text-cyan-400" />
                        <h3 className="font-bold text-white text-sm">OpenJarvis Local-First Architecture</h3>
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border font-mono ${
                        jarvisStatus?.openjarvis?.online
                          ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                          : 'bg-amber-950 text-amber-300 border-amber-800'
                      }`}>
                        {jarvisStatus?.openjarvis?.online ? 'Local Instance Online' : 'Gemini Failover Active'}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Placement Hub is equipped with dual intelligence: local-first execution via <strong>OpenJarvis</strong> (<a href="https://github.com/open-jarvis/OpenJarvis.git" target="_blank" rel="noreferrer" className="text-cyan-400 underline">open-jarvis/OpenJarvis</a>) with transparent failover to Google Gemini 3.5 Flash.
                    </p>

                    <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 font-mono text-[10px] text-slate-300 space-y-1">
                      <div>Repository: https://github.com/open-jarvis/OpenJarvis.git</div>
                      <div>Endpoint: http://127.0.0.1:8008</div>
                      <div>Fallback Provider: Google Gemini v2 SDK</div>
                    </div>
                  </div>

                  {/* Wake-Word Settings */}
                  <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
                    <h3 className="font-bold text-slate-200">Voice Recognition & Wake-Word Configuration</h3>
                    <div className="space-y-2">
                      <label className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950 border border-slate-800 cursor-pointer">
                        <div>
                          <span className="font-semibold text-slate-200">Always Listen for "Jarvis"</span>
                          <p className="text-[10px] text-slate-400">Activates microphone stream to respond to spoken call</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={isWakeWordArmed}
                          onChange={e => setIsWakeWordArmed(e.target.checked)}
                          className="rounded border-slate-700 text-cyan-500 focus:ring-cyan-400"
                        />
                      </label>

                      <label className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950 border border-slate-800 cursor-pointer">
                        <div>
                          <span className="font-semibold text-slate-200">Spoken Voice Responses</span>
                          <p className="text-[10px] text-slate-400">Jarvis speaks answers aloud using speech synthesis</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={voiceVolumeEnabled}
                          onChange={e => setVoiceVolumeEnabled(e.target.checked)}
                          className="rounded border-slate-700 text-cyan-500 focus:ring-cyan-400"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
