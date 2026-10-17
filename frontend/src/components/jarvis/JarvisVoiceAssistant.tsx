import React, { useState, useEffect, useRef, useCallback } from 'react';
import Vapi from '@vapi-ai/web';
import {
  Mic,
  MicOff,
  Volume2,
  Sparkles,
  Send,
  Mail,
  Bot,
  X,
  Maximize2,
  Minimize2,
  Copy,
  Check,
  RefreshCw,
  Share2,
  AlertCircle,
  Zap,
  PhoneOff,
  PhoneCall,
  Settings,
  ShieldCheck,
  Terminal
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

const LinkedinIcon: React.FC<{ className?: string }> = ({ className = 'w-3.5 h-3.5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.2a1.64 1.64 0 1 0 0 3.28 1.64 1.64 0 0 0 0-3.28Z" />
  </svg>
);

import { API_BASE } from '../../config/api';

interface JarvisMessage {
  id: string;
  sender: 'user' | 'jarvis';
  text: string;
  timestamp: string;
  plugin?: string;
  data?: any;
  toolCall?: string;
  actionButton?: {
    label: string;
    onClick: () => void;
  };
}

interface VapiConfigResponse {
  configured: boolean;
  public_key: string | null;
  assistant_id: string | null;
  assistant_instructions?: string;
  system_prompt?: string;
  tools_count: number;
}

const createVapiClient = (publicKey: string): any => {
  const Ctor: any = typeof Vapi === 'function' ? Vapi : (Vapi as any)?.default;
  if (typeof Ctor !== 'function') {
    throw new Error('Vapi SDK constructor could not be resolved from @vapi-ai/web.');
  }
  return new Ctor(publicKey);
};

const sanitizeVapiKey = (rawKey: string): string => {
  if (!rawKey) return '';
  const trimmed = rawKey.trim();
  const match = trimmed.match(/(?:VITE_)?VAPI_PUBLIC_KEY\s*=\s*([a-zA-Z0-9_-]+)/i);
  if (match && match[1]) {
    return match[1].trim();
  }
  if (trimmed.includes('=')) {
    const parts = trimmed.split(/\s+/);
    for (const part of parts) {
      if (/^(?:VITE_)?VAPI_PUBLIC_KEY=/i.test(part)) {
        return part.split('=')[1].replace(/['"]/g, '').trim();
      }
    }
    return trimmed.split('=')[1].replace(/['"]/g, '').trim();
  }
  return trimmed.replace(/['"]/g, '').split(/\s+/)[0].trim();
};

export const JarvisVoiceAssistant: React.FC = () => {
  const {
    studentProfile,
    skills,
    applications,
    setCurrentSection,
    setCurrentSubSection,
    setSearchQuery
  } = useApp();

  // Floating & Modal State — Sleek HUD docked at bottom-right, opens ONLY via tap or voice command
  const [autoTurnOn, setAutoTurnOn] = useState<boolean>(true); // Background wake-word voice command listener enabled
  const [isOpen, setIsOpen] = useState<boolean>(false); // ALWAYS starts closed on startup (opens only on tap or voice command)
  const [activeTab, setActiveTab] = useState<'voice' | 'linkedin' | 'mail' | 'system'>('voice');
  const [isMaximized, setIsMaximized] = useState<boolean>(false);

  // Clear any legacy auto-open preference so Jarvis never pops up automatically on page launch
  useEffect(() => {
    localStorage.setItem('jarvis_auto_open', 'false');
  }, []);

  // Vapi Configuration State
  const [vapiConfig, setVapiConfig] = useState<VapiConfigResponse | null>(null);
  const [publicKeyOverride, setPublicKeyOverride] = useState<string>('');
  const [showConfigDrawer, setShowConfigDrawer] = useState<boolean>(false);

  // Vapi Voice Session State — Exclusive single voice agent
  const [callStatus, setCallStatus] = useState<'idle' | 'connecting' | 'active'>('idle');
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isAssistantSpeaking, setIsAssistantSpeaking] = useState<boolean>(false);
  const [userVolume, setUserVolume] = useState<number>(0);
  const [assistantVolume, setAssistantVolume] = useState<number>(0);
  const [callDurationSeconds, setCallDurationSeconds] = useState<number>(0);
  const [interimTranscript, setInterimTranscript] = useState<string>('');
  const [activeToolName, setActiveToolName] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isStartingCall, setIsStartingCall] = useState<boolean>(false);

  // Chat & History
  const [query, setQuery] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [messages, setMessages] = useState<JarvisMessage[]>([
    {
      id: 'm_init',
      sender: 'jarvis',
      text: 'Good day, Sir. Jarvis is online powered exclusively by the Vapi Conversational Voice Engine. Connected directly with Placement Hub backend services, live tool calling, and verified telemetry. Click "Start Voice Conversation" or use Alt+J to begin speaking.',
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
  const [toolCatalog, setToolCatalog] = useState<any[]>([]);

  // Refs
  const vapiRef = useRef<any>(null);
  const timerIntervalRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const isInterviewActiveRef = useRef<boolean>(false);
  const callStatusRef = useRef<'idle' | 'connecting' | 'active'>('idle');
  const startVapiCallRef = useRef<() => Promise<void>>(async () => {});
  const lastAssistantChunkTimeRef = useRef<number>(0);
  const lastUserChunkTimeRef = useRef<number>(0);
  const backgroundRecognitionRef = useRef<any>(null);

  useEffect(() => {
    callStatusRef.current = callStatus;
  }, [callStatus]);

  // -------------------------------------------------------------------------
  // Resolve Effective Vapi Public Key & Assistant ID
  // -------------------------------------------------------------------------
  const effectivePublicKey = sanitizeVapiKey(
    publicKeyOverride ||
    (import.meta.env.VITE_VAPI_PUBLIC_KEY as string) ||
    vapiConfig?.public_key ||
    ''
  );

  const effectiveAssistantId = sanitizeVapiKey(
    (import.meta.env.VITE_VAPI_ASSISTANT_ID as string) ||
    vapiConfig?.assistant_id ||
    ''
  );

  // -------------------------------------------------------------------------
  // Fetch Vapi Configuration & Tools from Backend
  // -------------------------------------------------------------------------
  const fetchVapiConfig = useCallback(async () => {
    try {
      const [cfgRes, toolsRes] = await Promise.all([
        fetch(`${API_BASE}/jarvis/vapi/config`).catch(() => null),
        fetch(`${API_BASE}/jarvis/vapi/tools`).catch(() => null)
      ]);

      if (cfgRes && cfgRes.ok) {
        const data: VapiConfigResponse = await cfgRes.json();
        setVapiConfig(data);
      } else {
        // Fallback mock Vapi configuration for offline / static deployments
        setVapiConfig({
          configured: true,
          public_key: (import.meta.env.VITE_VAPI_PUBLIC_KEY as string) || null,
          assistant_id: (import.meta.env.VITE_VAPI_ASSISTANT_ID as string) || null,
          system_prompt: 'Jarvis Executive Voice Agent (Placement Hub)',
          tools_count: 8
        });
      }
      if (toolsRes && toolsRes.ok) {
        const toolsData = await toolsRes.json();
        setToolCatalog(toolsData.tools || []);
      } else {
        setToolCatalog([
          { name: 'open_app_or_website', description: 'Open external and internal apps (LinkedIn, GitHub, Profile)' },
          { name: 'open_resume_pdf', description: 'Open verified master resume document' },
          { name: 'post_to_linkedin', description: 'Draft and publish updates directly to LinkedIn' },
          { name: 'open_job_profile', description: 'Explore matched opportunity and job listings' }
        ]);
      }
    } catch (err) {
      console.warn('Could not load Vapi configuration from backend, loaded default mock configuration:', err);
    }
  }, []);

  useEffect(() => {
    fetchVapiConfig();
  }, [fetchVapiConfig]);

  // -------------------------------------------------------------------------
  // Web Audio Harmonic Chime (Jarvis Activation Sound)
  // -------------------------------------------------------------------------
  const playWakeChime = useCallback(() => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const now = ctx.currentTime;
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
  }, []);

  // -------------------------------------------------------------------------
  // Client Action & App Navigation Executor
  // -------------------------------------------------------------------------
  const executeClientAction = useCallback((actionName: string, args: any = {}) => {
    const clean = (actionName || '').toLowerCase().trim();
    const appTarget = (args.app || '').toLowerCase().trim();
    console.log(`[Jarvis Action] Executing client action: ${clean}`, args);

    // 1. Post to LinkedIn
    if (
      clean.includes('post_to_linkedin') ||
      (clean.includes('linkedin') && (clean.includes('post') || clean.includes('share') || args.content))
    ) {
      setActiveTab('linkedin');
      const topic = args.topic || 'Engineering Milestone & Placement Update';
      setLiTopic(topic);
      const content = args.content || (
        `🚀 Excited to share my journey in software engineering and cloud systems! ` +
        `Currently developing scalable full-stack applications with React, TypeScript, FastAPI, and Python. ` +
        `Grateful for the learning opportunities and placement support at Dr. D. Y. Patil College of Engineering, Akurdi. ` +
        `#ComputerScience #SoftwareEngineering #CareerGrowth #OpenToWork #PlacementHub`
      );
      const shareUrl = args.share_url || `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(content)}`;
      window.open(shareUrl, '_blank', 'noopener,noreferrer');

      setMessages(prev => [
        ...prev,
        {
          id: `act_${Date.now()}`,
          sender: 'jarvis',
          text: `Authorized LinkedIn Post Composer opened with your draft: "${content.substring(0, 110)}..."`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          plugin: 'linkedin',
          actionButton: {
            label: 'Open LinkedIn Composer ↗',
            onClick: () => window.open(shareUrl, '_blank', 'noopener,noreferrer')
          }
        }
      ]);
      return;
    }

    // 2. Open Both LinkedIn AND GitHub Links
    if (
      appTarget === 'all_links' ||
      clean === 'both' ||
      (clean.includes('linkedin') && (clean.includes('github') || clean.includes('git'))) ||
      (clean.includes('all') && (clean.includes('link') || clean.includes('platform')))
    ) {
      const liUrl = studentProfile?.linkedinUrl || 'https://www.linkedin.com';
      const ghUrl = studentProfile?.githubUrl || 'https://github.com';
      window.open(liUrl, '_blank', 'noopener,noreferrer');
      setTimeout(() => {
        window.open(ghUrl, '_blank', 'noopener,noreferrer');
      }, 350);

      setMessages(prev => [
        ...prev,
        {
          id: `act_${Date.now()}`,
          sender: 'jarvis',
          text: `Opened verified professional links in new tabs:\n• LinkedIn: ${liUrl}\n• GitHub: ${ghUrl}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          plugin: 'core',
          actionButton: {
            label: 'Open LinkedIn & GitHub ↗',
            onClick: () => {
              window.open(liUrl, '_blank', 'noopener,noreferrer');
              setTimeout(() => window.open(ghUrl, '_blank', 'noopener,noreferrer'), 300);
            }
          }
        }
      ]);
      return;
    }

    // 3. Open LinkedIn App / Website
    if (clean.includes('linkedin') || appTarget === 'linkedin') {
      const liUrl = studentProfile?.linkedinUrl || 'https://www.linkedin.com';
      window.open(liUrl, '_blank', 'noopener,noreferrer');
      setMessages(prev => [
        ...prev,
        {
          id: `act_${Date.now()}`,
          sender: 'jarvis',
          text: `Opened your LinkedIn profile and feed (${liUrl}) in a new tab.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          plugin: 'linkedin',
          actionButton: {
            label: 'Go to LinkedIn ↗',
            onClick: () => window.open(liUrl, '_blank', 'noopener,noreferrer')
          }
        }
      ]);
      return;
    }

    // 4. Open GitHub
    if (clean.includes('github') || clean.includes('git hub') || clean === 'git' || appTarget === 'github') {
      const ghUrl = studentProfile?.githubUrl || 'https://github.com';
      window.open(ghUrl, '_blank', 'noopener,noreferrer');
      setMessages(prev => [
        ...prev,
        {
          id: `act_${Date.now()}`,
          sender: 'jarvis',
          text: `Opened your GitHub repositories and profile (${ghUrl}) in a new tab.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          plugin: 'core',
          actionButton: {
            label: 'Open GitHub ↗',
            onClick: () => window.open(ghUrl, '_blank', 'noopener,noreferrer')
          }
        }
      ]);
      return;
    }

    // 5. Open Resume (Selva Resume.docx & Web View)
    if (
      clean.includes('resume') ||
      clean.includes('selva') ||
      clean.includes('cv') ||
      clean.includes('docx') ||
      appTarget === 'resume_pdf' ||
      appTarget === 'resume'
    ) {
      const docxUrl = '/avatars/Selva%20Resume.docx';
      const previewUrl = '/avatars/selva-resume.html';

      // 1. Trigger direct download / opening of Selva Resume.docx
      try {
        const link = document.createElement('a');
        link.href = docxUrl;
        link.download = 'Selva Resume.docx';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (err) {
        console.warn('Direct docx download error:', err);
      }

      // 2. Open high-fidelity interactive browser view in a new tab
      window.open(previewUrl, '_blank', 'noopener,noreferrer');

      // 3. Switch to ATS Resume Studio section in the background
      setCurrentSection('resume');

      setMessages(prev => [
        ...prev,
        {
          id: `act_${Date.now()}`,
          sender: 'jarvis',
          text: `Opened Selva Thevar's master resume:\n• File: Selva Resume.docx (downloaded)\n• Web View: Opened print-ready preview in a new tab\n• Role: Graphic Designer & Video Editor\n• Contact: +91-7208676986 • selvathevar175@gmail.com`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          plugin: 'core',
          actionButton: {
            label: 'View Selva Resume Online ↗',
            onClick: () => window.open(previewUrl, '_blank', 'noopener,noreferrer')
          }
        }
      ]);
      return;
    }

    // 6. Open Job Profile / Opportunities
    if (
      clean.includes('job') ||
      clean.includes('opp') ||
      appTarget === 'jobs' ||
      appTarget === 'opportunities' ||
      appTarget === 'job_profile'
    ) {
      setCurrentSection('opportunities');
      if (args.role_or_company) {
        setSearchQuery(args.role_or_company);
      }
      setMessages(prev => [
        ...prev,
        {
          id: `act_${Date.now()}`,
          sender: 'jarvis',
          text: `Opening Opportunities Intelligence for ${args.role_or_company ? `"${args.role_or_company}"` : 'campus placement openings'}...`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          plugin: 'core',
          actionButton: {
            label: 'Explore Opportunities ↗',
            onClick: () => setCurrentSection('opportunities')
          }
        }
      ]);
      return;
    }

    // 7. Open Candidate Profile
    if (clean.includes('profile') || appTarget === 'profile') {
      setCurrentSection('career');
      setCurrentSubSection('profile');
      setMessages(prev => [
        ...prev,
        {
          id: `act_${Date.now()}`,
          sender: 'jarvis',
          text: `Navigated to your full verified student profile. All verified metrics and skill badges are visible.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          plugin: 'core',
          actionButton: {
            label: 'View Profile ↗',
            onClick: () => {
              setCurrentSection('career');
              setCurrentSubSection('profile');
            }
          }
        }
      ]);
      return;
    }

    // 8. Integrations
    if (clean.includes('integration') || appTarget === 'integrations') {
      setCurrentSection('integrations');
      return;
    }
  }, [studentProfile, setCurrentSection, setCurrentSubSection, setSearchQuery, setActiveTab, setLiTopic]);

  // Intent pattern matcher for voice & text inputs
  const checkVoiceIntents = useCallback((rawText: string) => {
    const t = rawText.toLowerCase().trim();

    const wantsLinkedIn = t.includes('linkedin');
    const wantsGitHub = t.includes('github') || t.includes('git hub') || (t.includes('git') && !t.includes('digital'));

    // 1. Both LinkedIn and GitHub requested
    if (wantsLinkedIn && wantsGitHub) {
      executeClientAction('open_app_or_website', { app: 'all_links' });
      return;
    }

    // 2. LinkedIn Post Composer
    if (t.includes('post') && wantsLinkedIn) {
      executeClientAction('post_to_linkedin', { content: rawText });
      return;
    }

    // 3. Open LinkedIn
    if (
      wantsLinkedIn &&
      (t.includes('open') || t.includes('navigate') || t.includes('launch') || t.includes('go to') || t.includes('link') || t.includes('show') || t.includes('profile'))
    ) {
      executeClientAction('open_app_or_website', { app: 'linkedin' });
      return;
    }

    // 4. Open GitHub
    if (
      wantsGitHub &&
      (t.includes('open') || t.includes('navigate') || t.includes('launch') || t.includes('go to') || t.includes('link') || t.includes('show') || t.includes('repo') || t.includes('profile'))
    ) {
      executeClientAction('open_app_or_website', { app: 'github' });
      return;
    }

    // 5. Open Resume (Selva Resume.docx)
    if (
      t.includes('resume') ||
      t.includes('selva') ||
      t.includes('cv') ||
      t.includes('docx') ||
      ((t.includes('open') || t.includes('view') || t.includes('show') || t.includes('download')) && (t.includes('file') || t.includes('doc')))
    ) {
      executeClientAction('open_resume_pdf', { action: 'open_selva_resume' });
      return;
    }

    // 6. Open Job Profile
    if (
      (t.includes('job') || t.includes('opportunity')) &&
      (t.includes('open') || t.includes('show') || t.includes('view') || t.includes('find') || t.includes('explore'))
    ) {
      executeClientAction('open_job_profile', {});
      return;
    }

    // 7. Open Profile
    if (
      t.includes('profile') &&
      (t.includes('open') || t.includes('view') || t.includes('show') || t.includes('my profile'))
    ) {
      executeClientAction('open_app_or_website', { app: 'profile' });
      return;
    }
  }, [executeClientAction]);

  // -------------------------------------------------------------------------
  // Vapi SDK Lifecycle & Event Listeners (Exclusive Single Voice Engine)
  // -------------------------------------------------------------------------
  useEffect(() => {
    if (!effectivePublicKey) {
      return;
    }

    // Clean up any existing instance before initializing a new one
    if (vapiRef.current) {
      try {
        vapiRef.current.stop();
        vapiRef.current.removeAllListeners();
      } catch (err) {
        console.warn('Vapi instance teardown warning:', err);
      }
      vapiRef.current = null;
    }

    try {
      const vapi = createVapiClient(effectivePublicKey);
      vapiRef.current = vapi;

      vapi.on('call-start', () => {
        setCallStatus('active');
        callStatusRef.current = 'active';
        setIsStartingCall(false);
        setErrorMessage(null);
        setCallDurationSeconds(0);
        setIsMuted(false);

        if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = setInterval(() => {
          setCallDurationSeconds(prev => prev + 1);
        }, 1000);
      });

      vapi.on('call-end', () => {
        setCallStatus('idle');
        callStatusRef.current = 'idle';
        setIsStartingCall(false);
        setIsAssistantSpeaking(false);
        setUserVolume(0);
        setAssistantVolume(0);
        setActiveToolName(null);
        setInterimTranscript('');
        if (timerIntervalRef.current) {
          clearInterval(timerIntervalRef.current);
          timerIntervalRef.current = null;
        }
      });

      vapi.on('speech-start', () => {
        setIsAssistantSpeaking(true);
        lastAssistantChunkTimeRef.current = Date.now();
      });

      vapi.on('speech-end', () => {
        setIsAssistantSpeaking(false);
      });

      vapi.on('volume-level', (vol: number) => {
        setAssistantVolume(vol);
      });

      vapi.on('local-volume-level', (vol: number) => {
        setUserVolume(vol);
      });

      vapi.on('message', (msg: any) => {
        if (!msg) return;

        // 1. Handle live transcripts exclusively from Vapi SDK
        if (msg.type === 'transcript') {
          if (msg.transcriptType === 'partial') {
            if (msg.role === 'user') {
              setInterimTranscript(msg.transcript || '');
            }
          } else if (msg.transcriptType === 'final') {
            const transcriptText = (msg.transcript || '').trim();
            if (transcriptText) {
              setInterimTranscript('');
              const isAssistant = msg.role === 'assistant';
              const now = Date.now();

              // Trigger instant voice-activated app navigation and actions
              if (!isAssistant) {
                checkVoiceIntents(transcriptText);
              }

              setMessages(prev => {
                const last = prev[prev.length - 1];
                const isSameSender = last && last.sender === (isAssistant ? 'jarvis' : 'user');
                const lastChunkTime = isAssistant ? lastAssistantChunkTimeRef.current : lastUserChunkTimeRef.current;
                // Within an active speaking turn window (up to 8s between words/sentences)
                const withinTurnWindow = isSameSender && (now - lastChunkTime < 8000);

                if (withinTurnWindow) {
                  const prevText = last.text.trim();
                  let updatedText = prevText;

                  if (transcriptText.toLowerCase().startsWith(prevText.toLowerCase())) {
                    // Cumulative full sentence update from engine
                    updatedText = transcriptText;
                  } else if (prevText.toLowerCase().endsWith(transcriptText.toLowerCase()) || prevText.toLowerCase() === transcriptText.toLowerCase()) {
                    // Duplicate token chunk already present
                    return prev;
                  } else {
                    // Smart word/clause concatenation with punctuation awareness
                    const needsLeadingSpace = !/^[.,!?;:]/.test(transcriptText);
                    updatedText = `${prevText}${needsLeadingSpace ? ' ' : ''}${transcriptText}`;
                  }

                  if (isAssistant) {
                    lastAssistantChunkTimeRef.current = now;
                    lastUserChunkTimeRef.current = 0;
                  } else {
                    lastUserChunkTimeRef.current = now;
                    lastAssistantChunkTimeRef.current = 0;
                  }

                  const updated = [...prev];
                  updated[updated.length - 1] = {
                    ...last,
                    text: updatedText
                  };
                  return updated;
                }

                // New conversation turn: create a single clean response bubble
                if (isAssistant) {
                  lastAssistantChunkTimeRef.current = now;
                  lastUserChunkTimeRef.current = 0;
                } else {
                  lastUserChunkTimeRef.current = now;
                  lastAssistantChunkTimeRef.current = 0;
                }

                return [
                  ...prev,
                  {
                    id: `vapi_${now}_${Math.random().toString(36).substring(2, 7)}`,
                    sender: isAssistant ? 'jarvis' : 'user',
                    text: transcriptText,
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    plugin: 'vapi'
                  }
                ];
              });
            }
          }
        }

        // 3. Handle live tool execution telemetry & client-side app navigation
        if (msg.type === 'tool-calls' || msg.type === 'function-call') {
          const toolCalls = msg.toolCalls || (msg.functionCall ? [{ function: msg.functionCall }] : []);
          const firstTool = toolCalls[0];
          const toolName = firstTool?.function?.name || msg.functionCall?.name || 'hub_integration';
          setActiveToolName(toolName);
          setTimeout(() => setActiveToolName(null), 4000);

          let toolArgs: any = {};
          try {
            toolArgs = typeof firstTool?.function?.arguments === 'string'
              ? JSON.parse(firstTool.function.arguments)
              : (firstTool?.function?.arguments || {});
          } catch (_) {}

          if (['open_app_or_website', 'post_to_linkedin', 'open_job_profile', 'open_resume_pdf'].includes(toolName)) {
            executeClientAction(toolName, toolArgs);
          } else {
            setMessages(prev => [
              ...prev,
              {
                id: `vapi_tool_${Date.now()}`,
                sender: 'jarvis',
                text: `Invoking verified placement tool: ${toolName}...`,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                plugin: 'vapi',
                toolCall: toolName
              }
            ]);
          }
        }
      });

      const formatVapiError = (rawErr: any): string => {
        if (!rawErr) return '';
        if (typeof rawErr === 'string') return rawErr;

        const candidate =
          rawErr?.error?.message?.message ||
          rawErr?.error?.message ||
          rawErr?.message?.message ||
          rawErr?.message ||
          rawErr?.error;

        if (Array.isArray(candidate)) {
          return candidate.join(', ');
        }
        if (typeof candidate === 'string') {
          return candidate;
        }
        if (typeof candidate === 'object' && candidate !== null) {
          if (typeof candidate.message === 'string') return candidate.message;
          if (Array.isArray(candidate.message)) return candidate.message.join(', ');
          if (typeof candidate.error === 'string') return candidate.error;
        }
        if (typeof rawErr?.message === 'string') return rawErr.message;
        if (typeof rawErr?.error === 'string') return rawErr.error;
        return '';
      };

      vapi.on('error', (err: any) => {
        console.error('Vapi session error:', err);
        setIsStartingCall(false);
        const errorStr = formatVapiError(err);

        // Suppress transient schema mismatch / internal overrides warnings
        if (errorStr.includes('assistantOverrides') || errorStr.includes('start-method-error')) {
          setErrorMessage(null);
          setCallStatus('idle');
          return;
        }

        if (errorStr.includes('NotAllowedError') || errorStr.includes('Permission') || errorStr.includes('not-allowed')) {
          setErrorMessage(
            'Microphone access was denied. Please allow microphone permissions in your browser address bar to talk with Jarvis.'
          );
        } else if (errorStr.includes('network') || errorStr.includes('Failed to fetch')) {
          setErrorMessage('Network connection lost or timed out. Please check your internet connection.');
        } else if (errorStr.includes('401') || errorStr.includes('Unauthorized') || errorStr.includes('Invalid API key')) {
          setErrorMessage('Vapi authentication failed. Please verify your VAPI_PUBLIC_KEY configuration.');
        } else if (errorStr) {
          setErrorMessage(errorStr);
        }

        setCallStatus('idle');
        if (timerIntervalRef.current) {
          clearInterval(timerIntervalRef.current);
          timerIntervalRef.current = null;
        }
      });

      vapi.on('call-start-failed', (event: any) => {
        console.error('Vapi call-start-failed:', event);
        setIsStartingCall(false);
        setCallStatus('idle');
        callStatusRef.current = 'idle';

        const msg = formatVapiError(event?.error || event);
        if (msg.includes('assistantOverrides') || msg.includes('start-method-error')) {
          setErrorMessage(null);
          return;
        }

        if (msg.includes('NotAllowedError') || msg.includes('Permission') || msg.includes('not-allowed')) {
          setErrorMessage('Microphone permission was denied. Please allow microphone access in your browser address bar.');
        } else if (msg) {
          setErrorMessage(msg);
        }
      });
    } catch (err: any) {
      console.error('Failed to construct Vapi SDK client:', err);
      setErrorMessage(`Vapi client initialization failed: ${err?.message || err}`);
    }

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
      if (vapiRef.current) {
        try {
          vapiRef.current.stop();
          vapiRef.current.removeAllListeners();
        } catch (e) {
          console.warn('Vapi unmount cleanup:', e);
        }
        vapiRef.current = null;
      }
    };
  }, [effectivePublicKey]);

  // Coordinate with Interview Studio: stop Jarvis active call when interview starts
  useEffect(() => {
    const handleInterviewPause = () => {
      isInterviewActiveRef.current = true;
      if (backgroundRecognitionRef.current) {
        try {
          backgroundRecognitionRef.current.abort();
        } catch (_) {}
      }
      if (callStatus !== 'idle' && vapiRef.current) {
        try {
          vapiRef.current.stop();
        } catch (_) {}
      }
    };

    const handleInterviewResume = () => {
      isInterviewActiveRef.current = false;
    };

    window.addEventListener('jarvis-pause-listening', handleInterviewPause);
    window.addEventListener('jarvis-resume-listening', handleInterviewResume);
    return () => {
      window.removeEventListener('jarvis-pause-listening', handleInterviewPause);
      window.removeEventListener('jarvis-resume-listening', handleInterviewResume);
    };
  }, [callStatus]);

  // -------------------------------------------------------------------------
  // Start / End Vapi Call Handlers (Exclusive Voice Stream)
  // -------------------------------------------------------------------------
  const startVapiCall = useCallback(async () => {
    if (callStatusRef.current !== 'idle' || isStartingCall) return;
    if (isInterviewActiveRef.current) {
      setErrorMessage('AI Interview Studio session currently in progress. Please conclude your interview before starting Jarvis.');
      return;
    }

    if (!effectivePublicKey) {
      setShowConfigDrawer(true);
      setErrorMessage('Vapi Public Key is required. Please provide your Public Key from dashboard.vapi.ai.');
      return;
    }

    setIsStartingCall(true);
    setErrorMessage(null);
    setCallStatus('connecting');
    callStatusRef.current = 'connecting';
    playWakeChime();

    try {
      if (!vapiRef.current) {
        vapiRef.current = createVapiClient(effectivePublicKey);
      }

      // Candidate Profile & Full Data Permissions Payload
      const candidateContext: Record<string, string> = {
        student_name: studentProfile?.name || 'Candidate Student',
        student_email: studentProfile?.email || 'candidate@university.edu',
        student_department: studentProfile?.department || 'Computer Science & Engineering',
        student_college: 'Dr. D. Y. Patil College of Engineering, Akurdi, Pune',
        student_cgpa: studentProfile?.cgpa ? String(studentProfile.cgpa) : '8.8',
        student_target_role: 'Full-Stack Developer / Software Engineer',
        student_skills: skills?.map(s => s.name).join(', ') || 'Python, TypeScript, React, FastAPI, SQL, Docker',
        student_applications_count: String(applications?.length || 0),
        student_linkedin_url: studentProfile?.linkedinUrl || 'https://www.linkedin.com',
        student_github_url: studentProfile?.githubUrl || 'https://github.com',
        full_profile_access_granted: 'true',
        full_data_permissions: 'UNRESTRICTED_READ_ACCESS',
        app_open_permission: 'AUTHORIZED',
        app_navigation_permission: 'AUTHORIZED',
        linkedin_posting_permission: 'AUTHORIZED',
      };

      const fullSystemPrompt = (
        (vapiConfig?.assistant_instructions || vapiConfig?.system_prompt || '') +
        `\n\nLANGUAGE RESTRICTION: You MUST speak, converse, and reply EXCLUSIVELY in English at all times.` +
        `\nUnder NO circumstance should you use, translate, or switch to any other language, even if the user speaks to you in another language.` +
        `\nEvery spoken response, greeting, transcript, and tool description must be strictly in clear, professional English.` +
        `\n\nAUTHORIZATION NOTICE: You have FULL READ ACCESS, APP OPENING PERMISSIONS, AND NAVIGATION RIGHTS:` +
        `\n- Candidate Name: ${candidateContext.student_name}` +
        `\n- College: ${candidateContext.student_college}` +
        `\n- Department: ${candidateContext.student_department}` +
        `\n- CGPA: ${candidateContext.student_cgpa}` +
        `\n- Target Role: ${candidateContext.student_target_role}` +
        `\n- Verified Skills: ${candidateContext.student_skills}` +
        `\n- Applications in Pipeline: ${candidateContext.student_applications_count}` +
        `\n- LinkedIn Profile: ${candidateContext.student_linkedin_url}` +
        `\n- GitHub Profile: ${candidateContext.student_github_url}` +
        `\n- You have FULL PERMISSION to open external applications (LinkedIn, GitHub), navigate to internal pages (job profiles, opportunities, profile, resume studio), and compose or post messages to LinkedIn.` +
        `\n- When the candidate commands 'open linkedin', 'open github', 'open all links', 'open resume', 'open my resume', 'open resume pdf', or 'open resume docx', immediately invoke the corresponding tool (open_app_or_website, open_resume_pdf) to open and view their master document (Selva Resume.docx).` +
        `\nYou are fully empowered to cite, review, discuss, and execute all student operations without restrictions.`
      ).trim();

      const englishTranscriber = {
        provider: 'deepgram',
        model: 'nova-2',
        language: 'en'
      };

      if (effectiveAssistantId) {
        try {
          await vapiRef.current.start(effectiveAssistantId, {
            transcriber: englishTranscriber,
            variableValues: candidateContext
          });
        } catch (startErr) {
          console.warn('Assistant ID start failed, falling back to direct assistant config:', startErr);
          await vapiRef.current.start({
            name: 'Jarvis Placement Hub Assistant',
            transcriber: englishTranscriber,
            firstMessage: `Good day, ${candidateContext.student_name}! I am Jarvis, with full authorized access to your verified profile, master resume, and placement pipeline. How can I assist you with your career goals today?`,
            model: {
              provider: 'openai',
              model: 'gpt-4o-mini',
              messages: [
                {
                  role: 'system',
                  content: fullSystemPrompt
                }
              ]
            }
          });
        }
      } else {
        await vapiRef.current.start({
          name: 'Jarvis Placement Hub Assistant',
          transcriber: englishTranscriber,
          firstMessage: `Good day, ${candidateContext.student_name}! I am Jarvis, with full authorized access to your verified profile, master resume, and placement pipeline. How can I assist you with your career goals today?`,
          model: {
            provider: 'openai',
            model: 'gpt-4o-mini',
            messages: [
              {
                role: 'system',
                content: fullSystemPrompt
              }
            ]
          }
        });
      }
    } catch (err: any) {
      console.error('Error starting Vapi session:', err);
      setIsStartingCall(false);
      setCallStatus('idle');
      callStatusRef.current = 'idle';

      let msg = '';
      if (typeof err === 'string') {
        msg = err;
      } else if (err?.message) {
        msg = typeof err.message === 'string' ? err.message : JSON.stringify(err.message);
      } else if (err?.error) {
        msg = typeof err.error === 'string' ? err.error : JSON.stringify(err.error);
      } else {
        msg = String(err);
      }

      if (msg.includes('assistantOverrides') || msg.includes('start-method-error')) {
        setErrorMessage(null);
      } else if (msg.includes('NotAllowedError') || msg.includes('Permission') || msg.includes('not-allowed')) {
        setErrorMessage(
          'Microphone permission was denied. Please allow microphone access in your browser address bar to use Jarvis Voice.'
        );
      } else {
        setErrorMessage(msg || 'Failed to start Vapi voice session. Please check your credentials and connection.');
      }
    }
  }, [isStartingCall, effectivePublicKey, effectiveAssistantId, vapiConfig, playWakeChime]);

  startVapiCallRef.current = startVapiCall;

  const endVapiCall = useCallback(async () => {
    if (vapiRef.current) {
      try {
        await vapiRef.current.stop();
      } catch (e) {
        console.warn('Error during Vapi stop:', e);
      }
    }
    setCallStatus('idle');
    callStatusRef.current = 'idle';
    setIsStartingCall(false);
    setIsAssistantSpeaking(false);
    setUserVolume(0);
    setAssistantVolume(0);
    setActiveToolName(null);
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
  }, []);

  // Global Keyboard Shortcut: Ctrl + Space or Alt + J toggles Jarvis & directly connects to Vapi
  useEffect(() => {
    const handleKeyShortcut = (e: KeyboardEvent) => {
      if ((e.altKey && e.key.toLowerCase() === 'j') || (e.ctrlKey && e.code === 'Space')) {
        e.preventDefault();
        playWakeChime();
        setIsOpen(prev => {
          const next = !prev;
          if (next && !isInterviewActiveRef.current) {
            setTimeout(() => {
              startVapiCallRef.current?.();
            }, 100);
          } else if (!next && callStatusRef.current !== 'idle') {
            endVapiCall();
          }
          return next;
        });
      }
    };
    window.addEventListener('keydown', handleKeyShortcut);
    return () => window.removeEventListener('keydown', handleKeyShortcut);
  }, [playWakeChime, endVapiCall]);

  // Open Jarvis event: opens and directly connects to Vapi
  useEffect(() => {
    const handleOpen = () => {
      playWakeChime();
      setIsOpen(true);
      if (!isInterviewActiveRef.current) {
        setTimeout(() => {
          startVapiCallRef.current?.();
        }, 100);
      }
    };
    window.addEventListener('open-jarvis', handleOpen);
    return () => window.removeEventListener('open-jarvis', handleOpen);
  }, [playWakeChime]);

  // Scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, interimTranscript]);

  const toggleMute = () => {
    if (!vapiRef.current || callStatus !== 'active') return;
    const nextMute = !isMuted;
    try {
      vapiRef.current.setMuted(nextMute);
      setIsMuted(nextMute);
    } catch (err) {
      console.warn('Could not toggle mute state:', err);
    }
  };

  const formatDuration = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
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

  // -------------------------------------------------------------------------
  // Text Command Execution (Pure Text — NEVER calls local speech synthesis)
  // -------------------------------------------------------------------------
  const submitCommand = async (cmdText: string) => {
    const text = cmdText.trim();
    if (!text || isProcessing) return;

    const userMsg: JarvisMessage = {
      id: `u_${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, userMsg]);
    setQuery('');
    setIsProcessing(true);

    // Immediate intent check for navigation / LinkedIn / resume actions
    checkVoiceIntents(text);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 12000);

      const res = await fetch(`${API_BASE}/jarvis/command`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          query: text,
          source: 'text',
          student_id: studentProfile?.id || 'std_current_user'
        })
      });
      clearTimeout(timeoutId);

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

      if (data.plugin === 'linkedin') {
        fetchTelemetry();
        setActiveTab('linkedin');
      } else if (data.plugin === 'mail') {
        fetchTelemetry();
        setActiveTab('mail');
      }
    } catch (err: any) {
      console.warn('Jarvis executing in resilient fallback mode:', err);
      const lower = text.toLowerCase();
      let fallbackText = '';
      let plugin: 'core' | 'linkedin' | 'mail' = 'core';

      if (lower.includes('linkedin') || lower.includes('post')) {
        plugin = 'linkedin';
        const cleanTopic = text.replace(/jarvis/gi, '').replace(/draft a linkedin post about/gi, '').trim() || 'Software Engineering & Technical Interview Achievement';
        const newPost = {
          id: `lip_${Date.now()}`,
          created_at: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          title: cleanTopic,
          content: `🚀 Milestone Update: ${cleanTopic}\n\nDedicated to rigorous engineering principles, modular systems design, and verified outcomes. Excited to continue building robust solutions and learning from mentors across our tech community!\n\n#SoftwareEngineering #ContinuousImprovement #TechInnovation`,
          likes: 0,
          shares: 0,
          status: 'draft' as const
        };
        setLiPosts(prev => [newPost, ...prev]);
        setActiveTab('linkedin');
        fallbackText = `I have drafted your LinkedIn post on "${cleanTopic}", Sir:\n\n"${newPost.content}"`;
      } else if (lower.includes('email') || lower.includes('mail') || lower.includes('thank you') || lower.includes('follow up')) {
        plugin = 'mail';
        const draft = {
          id: `mail_draft_${Date.now()}`,
          recipient_name: 'Hiring Manager / Interviewer',
          recipient_email: 'recruiter@placement-partner.com',
          subject: 'Thank You - Software Engineering Interview Discussion',
          body: `Dear Hiring Team,\n\nThank you for the opportunity to discuss the Software Engineering role today. I enjoyed learning more about your technical architecture and engineering vision.\n\nSincerely,\nCandidate Student\nD.Y. Patil College of Engineering`,
          sent_at: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: 'draft'
        };
        setActiveTab('mail');
        fallbackText = `I have drafted your thank you email, Sir:\n\n**Subject:** ${draft.subject}\n\n${draft.body}`;
      } else if (lower.includes('interview') || lower.includes('mock')) {
        fallbackText = `Directing you to the AI Technical Interview Studio with real-time feedback, Sir.`;
        window.dispatchEvent(new CustomEvent('navigate-section', { detail: 'career-interview' }));
      } else if (lower.includes('resume')) {
        fallbackText = `Accessing your Master ATS Resume and tailored career profiles, Sir.`;
        window.dispatchEvent(new CustomEvent('navigate-section', { detail: 'career-resumes' }));
      } else if (lower.includes('opportunity') || lower.includes('opportunities') || lower.includes('job') || lower.includes('hackathon')) {
        fallbackText = `Accessing Opportunities Intelligence, scanning for verified campus drives, internships, and hackathons.`;
        window.dispatchEvent(new CustomEvent('navigate-section', { detail: 'opportunities' }));
      } else {
        fallbackText = `Jarvis is ready to assist you. Voice interactions are powered exclusively by the official Vapi SDK. Click "Start Voice Conversation" to begin real-time voice streaming.`;
      }

      const fallbackMsg: JarvisMessage = {
        id: `j_local_${Date.now()}`,
        sender: 'jarvis',
        text: fallbackText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        plugin: plugin
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsProcessing(false);
    }
  };

  // Background Wake-Word & Voice Command Listener (Opens Jarvis only on Voice Command or Tap)
  useEffect(() => {
    // If Jarvis is already open, or an interview is active, or a Vapi call is running, or wake listening is turned off
    if (isOpen || isInterviewActiveRef.current || callStatus !== 'idle' || !autoTurnOn) {
      if (backgroundRecognitionRef.current) {
        try {
          backgroundRecognitionRef.current.abort();
        } catch (_) {}
        backgroundRecognitionRef.current = null;
      }
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    let recognition: any = null;
    let isDisposed = false;

    const startWakeWordListener = () => {
      if (isDisposed || isOpen || isInterviewActiveRef.current || callStatusRef.current !== 'idle') return;

      try {
        recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
          let transcript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
          }
          const lower = transcript.toLowerCase().trim();

          // Check for Jarvis wake words or voice commands
          const hasWakeWord =
            lower.includes('jarvis') ||
            lower.includes('hey jarvis') ||
            lower.includes('ok jarvis') ||
            lower.includes('hello jarvis') ||
            lower.includes('open jarvis');

          if (hasWakeWord) {
            console.log('[Jarvis Wake-Word] Detected voice activation:', transcript);
            try {
              recognition.stop();
            } catch (_) {}

            playWakeChime();
            setIsOpen(true);

            // Execute specific command intent if spoken along with wake word (e.g. "jarvis open linkedin")
            if (lower.length > 7) {
              checkVoiceIntents(transcript);
            }

            // Connect to Vapi voice call
            setTimeout(() => {
              if (!isInterviewActiveRef.current) {
                startVapiCallRef.current?.();
              }
            }, 300);
          }
        };

        recognition.onerror = (e: any) => {
          if (e.error === 'not-allowed' || e.error === 'service-not-allowed') {
            return;
          }
        };

        recognition.onend = () => {
          if (!isDisposed && !isOpen && !isInterviewActiveRef.current && callStatusRef.current === 'idle') {
            setTimeout(() => {
              startWakeWordListener();
            }, 1000);
          }
        };

        recognition.start();
        backgroundRecognitionRef.current = recognition;
      } catch (err) {
        console.warn('[Jarvis Wake-Word] Background listener initialization notice:', err);
      }
    };

    startWakeWordListener();

    return () => {
      isDisposed = true;
      if (recognition) {
        try {
          recognition.abort();
        } catch (_) {}
      }
      backgroundRecognitionRef.current = null;
    };
  }, [isOpen, callStatus, autoTurnOn, playWakeChime, checkVoiceIntents]);

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
        const data = await res.json();
        setLiPosts(prev => [data.post, ...prev]);
      }
    } catch (e) {
      console.warn('LinkedIn post generation error:', e);
    } finally {
      setIsGeneratingLiPost(false);
    }
  };

  const handleGenerateOutreach = async () => {
    if (!outreachTarget || isGeneratingOutreach) return;
    setIsGeneratingOutreach(true);
    try {
      const res = await fetch(`${API_BASE}/jarvis/linkedin/outreach`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipient_role: outreachTarget,
          company: outreachCompany,
          mutual_context: 'D.Y. Patil College of Engineering Placement Drive'
        })
      });
      if (res.ok) {
        const data = await res.json();
        setOutreachResult(data.message);
      }
    } catch (e) {
      console.warn('Outreach generation error:', e);
    } finally {
      setIsGeneratingOutreach(false);
    }
  };

  // -------------------------------------------------------------------------
  // Mail Plugin Actions
  // -------------------------------------------------------------------------
  const handleDraftMail = async () => {
    setIsDraftingMail(true);
    try {
      const res = await fetch(`${API_BASE}/jarvis/mail/draft`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipient_name: mailRecipientName,
          recipient_email: mailRecipientEmail,
          purpose: mailType,
          context_notes: 'Software Engineering interview round at D.Y. Patil College of Engineering'
        })
      });
      if (res.ok) {
        const data = await res.json();
        setMailSubject(data.draft.subject);
        setMailBody(data.draft.body);
      }
    } catch (e) {
      console.warn('Mail draft error:', e);
    } finally {
      setIsDraftingMail(false);
    }
  };

  const handleSendMail = async () => {
    if (!mailRecipientEmail || !mailSubject || isSendingMail) return;
    setIsSendingMail(true);
    setMailSendSuccess(null);
    try {
      const res = await fetch(`${API_BASE}/jarvis/mail/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipient_email: mailRecipientEmail,
          subject: mailSubject,
          body: mailBody
        })
      });
      if (res.ok) {
        setMailSendSuccess('Email transmitted successfully via verified campus SMTP gateway.');
        fetchTelemetry();
        setTimeout(() => setMailSendSuccess(null), 4000);
      }
    } catch (e) {
      console.warn('Send mail error:', e);
    } finally {
      setIsSendingMail(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <>
      {/* ===================================================================
       * 1. Persistent Arc-Reactor Floating Trigger Pill (Bottom-Right)
       * =================================================================== */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 select-none no-print">
          {/* Status Bubble Badge */}
          <div
            onClick={() => {
              playWakeChime();
              setIsOpen(true);
              if (!isInterviewActiveRef.current) {
                setTimeout(() => {
                  startVapiCallRef.current?.();
                }, 100);
              }
            }}
            className="cursor-pointer px-3 py-1.5 rounded-full bg-white/90 dark:bg-slate-900/90 text-slate-800 dark:text-cyan-300 border border-slate-200 dark:border-cyan-500/30 backdrop-blur-md shadow-lg flex items-center gap-2 hover:scale-105 transition-transform"
          >
            <span
              className={`w-2 h-2 rounded-full ${
                callStatus === 'active'
                  ? 'bg-emerald-500 animate-ping'
                  : callStatus === 'connecting'
                  ? 'bg-amber-500 animate-pulse'
                  : 'bg-cyan-500 dark:bg-cyan-400'
              }`}
            />
            <span className="font-semibold tracking-wide text-xs">
              {callStatus === 'active'
                ? `🎙️ Jarvis Call Active (${formatDuration(callDurationSeconds)})`
                : callStatus === 'connecting'
                ? '⚡ Connecting Vapi Voice...'
                : '🎙️ Tap or Say "Jarvis"'}
            </span>
          </div>

          {/* Arc-Reactor Trigger Button */}
          <button
            onClick={() => {
              playWakeChime();
              setIsOpen(true);
              if (!isInterviewActiveRef.current) {
                setTimeout(() => {
                  startVapiCallRef.current?.();
                }, 100);
              }
            }}
            className="relative group w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl bg-gradient-to-tr from-white via-cyan-50 to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-cyan-950 border border-slate-200 dark:border-cyan-500/40 text-cyan-700 dark:text-cyan-300 hover:scale-110 hover:shadow-cyan-500/20"
            title="Jarvis AI Voice Assistant (Tap or say 'Jarvis' to activate)"
            aria-label="Open Jarvis Voice Assistant"
          >
            {/* Animated Glowing Rings */}
            <div
              className="absolute inset-0 rounded-full border border-cyan-400/40 dark:border-cyan-400/30 animate-spin"
              style={{ animationDuration: '8s' }}
            />
            <div
              className="absolute inset-1 rounded-full border border-dashed border-blue-400/50 dark:border-blue-400/40 animate-spin"
              style={{ animationDuration: '14s', animationDirection: 'reverse' }}
            />

            {/* Central Reactor Core */}
            <div className="relative z-10 flex items-center justify-center">
              {callStatus === 'active' ? (
                isAssistantSpeaking ? (
                  <Volume2 className="w-6 h-6 text-white animate-bounce" />
                ) : (
                  <Mic className="w-6 h-6 text-white animate-pulse" />
                )
              ) : callStatus === 'connecting' ? (
                <RefreshCw className="w-6 h-6 text-amber-500 dark:text-amber-300 animate-spin" />
              ) : (
                <Bot className="w-6 h-6 text-cyan-600 dark:text-cyan-300 group-hover:scale-110 transition-transform" />
              )}
            </div>

            {/* Status Dot */}
            <span
              className={`absolute top-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-slate-900 ${
                callStatus === 'active'
                  ? 'bg-emerald-500 animate-ping'
                  : callStatus === 'connecting'
                  ? 'bg-amber-500 animate-pulse'
                  : 'bg-cyan-500 dark:bg-cyan-400'
              }`}
            />
          </button>
        </div>
      )}

      {/* ===================================================================
       * 2. Jarvis Command Center HUD Modal
       * =================================================================== */}
      {isOpen && (
        <div
          className={`fixed z-50 transition-all duration-300 shadow-2xl no-print ${
            isMaximized
              ? 'inset-4 md:inset-8'
              : 'bottom-20 right-4 sm:right-6 w-[92vw] sm:w-[440px] max-w-[440px] h-[680px] max-h-[85vh]'
          }`}
        >
          <div className="w-full h-full rounded-2xl bg-white/95 dark:bg-slate-950/95 text-slate-900 dark:text-slate-100 border border-slate-200/90 dark:border-cyan-500/30 backdrop-blur-xl flex flex-col overflow-hidden shadow-2xl">
            {/* Top Header */}
            <div className="px-4 py-3 border-b border-slate-200 dark:border-cyan-500/20 bg-slate-50/90 dark:bg-slate-900/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative w-8 h-8 rounded-full bg-cyan-100 dark:bg-cyan-950 border border-cyan-300 dark:border-cyan-400 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                  <div className="absolute inset-0 rounded-full bg-cyan-400/20 animate-ping" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm tracking-wider bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-400 bg-clip-text text-transparent">
                      JARVIS
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-cyan-50 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800 font-mono">
                      Vapi Voice v2.7
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono flex items-center gap-1.5">
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        callStatus === 'active'
                          ? 'bg-emerald-500 animate-ping'
                          : callStatus === 'connecting'
                          ? 'bg-amber-500 animate-pulse'
                          : 'bg-cyan-500 dark:bg-cyan-400'
                      }`}
                    />
                    {callStatus === 'active'
                      ? `Voice Stream Active • ${formatDuration(callDurationSeconds)}`
                      : callStatus === 'connecting'
                      ? 'Connecting Vapi Webcall...'
                      : effectivePublicKey
                      ? 'Vapi SDK Online • Tool Bridge Ready'
                      : 'Configuration Required'}
                  </p>
                </div>
              </div>

              {/* Top Controls */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setShowConfigDrawer(!showConfigDrawer)}
                  className={`p-1.5 rounded-lg border text-xs transition-colors ${
                    showConfigDrawer
                      ? 'border-cyan-500 text-cyan-700 bg-cyan-50 dark:border-cyan-400 dark:text-cyan-300 dark:bg-cyan-950/60'
                      : 'border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-slate-900'
                  }`}
                  title="Configure Vapi Credentials"
                  aria-label="Vapi Settings"
                >
                  <Settings className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    const next = !autoTurnOn;
                    setAutoTurnOn(next);
                  }}
                  className={`px-2 py-1 rounded-lg border text-[10px] font-mono flex items-center gap-1 transition-all ${
                    autoTurnOn
                      ? 'border-cyan-300 bg-cyan-50 text-cyan-800 dark:border-cyan-500/60 dark:bg-cyan-950/60 dark:text-cyan-300 shadow-xs'
                      : 'border-slate-200 bg-white text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                  title={
                    autoTurnOn
                      ? 'Voice Command ("Jarvis") Wake-Word: Active'
                      : 'Voice Command ("Jarvis") Wake-Word: Disabled'
                  }
                >
                  <Zap className={`w-3 h-3 ${autoTurnOn ? 'text-amber-500 dark:text-amber-400 fill-amber-400' : 'text-slate-400'}`} />
                  <span className="hidden sm:inline">Voice Wake:</span>
                  <span className={autoTurnOn ? 'text-cyan-700 dark:text-cyan-300 font-bold' : 'text-slate-500 dark:text-slate-400'}>
                    {autoTurnOn ? 'ON' : 'OFF'}
                  </span>
                </button>

                <button
                  onClick={() => setIsMaximized(!isMaximized)}
                  className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                  aria-label={isMaximized ? 'Minimize window' : 'Maximize window'}
                >
                  {isMaximized ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>

                <button
                  onClick={() => {
                    setIsOpen(false);
                    if (callStatusRef.current !== 'idle') {
                      endVapiCall();
                    }
                  }}
                  className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:border-rose-300 dark:hover:border-rose-900 transition-colors"
                  aria-label="Close Jarvis"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-slate-200 dark:border-cyan-500/20 bg-slate-50/80 dark:bg-slate-900/40 text-xs font-semibold px-2">
              <button
                onClick={() => setActiveTab('voice')}
                className={`px-3 py-2.5 flex items-center gap-1.5 border-b-2 transition-all ${
                  activeTab === 'voice'
                    ? 'border-cyan-600 text-cyan-700 bg-cyan-50/80 dark:border-cyan-400 dark:text-cyan-300 dark:bg-cyan-950/30'
                    : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <Mic className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                <span>Vapi Voice & Chat</span>
              </button>

              <button
                onClick={() => setActiveTab('linkedin')}
                className={`px-3 py-2.5 flex items-center gap-1.5 border-b-2 transition-all ${
                  activeTab === 'linkedin'
                    ? 'border-blue-600 text-blue-700 bg-blue-50/80 dark:border-blue-400 dark:text-blue-300 dark:bg-blue-950/30'
                    : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <LinkedinIcon className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span>LinkedIn Plugin</span>
              </button>

              <button
                onClick={() => setActiveTab('mail')}
                className={`px-3 py-2.5 flex items-center gap-1.5 border-b-2 transition-all ${
                  activeTab === 'mail'
                    ? 'border-purple-600 text-purple-700 bg-purple-50/80 dark:border-purple-400 dark:text-purple-300 dark:bg-purple-950/30'
                    : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <Mail className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                <span>Mail Plugin</span>
              </button>

              <button
                onClick={() => setActiveTab('system')}
                className={`px-3 py-2.5 flex items-center gap-1.5 border-b-2 transition-all ${
                  activeTab === 'system'
                    ? 'border-emerald-600 text-emerald-700 bg-emerald-50/80 dark:border-emerald-400 dark:text-emerald-300 dark:bg-emerald-950/30'
                    : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <Terminal className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Tool Registry ({toolCatalog.length || 10})</span>
              </button>
            </div>

            {/* Vapi Configuration Drawer */}
            {showConfigDrawer && (
              <div className="p-3 bg-cyan-50/90 dark:bg-cyan-950/90 border-b border-cyan-200 dark:border-cyan-500/30 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-cyan-900 dark:text-cyan-200">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                    <span>Vapi Configuration Hub</span>
                  </div>
                  <button
                    onClick={() => setShowConfigDrawer(false)}
                    className="text-slate-400 hover:text-slate-700 dark:hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400">
                  Vapi public key is used safely by the browser SDK. All server-side tools execute authenticated on FastAPI.
                </p>
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-700 dark:text-slate-300 font-mono">VAPI_PUBLIC_KEY Override (Optional):</label>
                  <input
                    type="text"
                    value={publicKeyOverride}
                    onChange={e => {
                      const val = e.target.value;
                      const sanitized = sanitizeVapiKey(val);
                      setPublicKeyOverride(sanitized || val);
                    }}
                    placeholder={effectivePublicKey ? `Active: ${effectivePublicKey.substring(0, 8)}...` : 'Enter Vapi Public Key (e.g. 81cda39f-...)'}
                    className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 dark:text-white font-mono"
                  />
                  {effectivePublicKey && (
                    <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono">
                      ✓ Active Key: {effectivePublicKey.substring(0, 8)}...{effectivePublicKey.slice(-4)}
                    </p>
                  )}
                </div>
                <div className="flex items-center justify-between pt-1 text-[10px] text-slate-600 dark:text-slate-400 font-mono">
                  <span>Backend Config: {vapiConfig?.configured ? '✓ Configured' : '⚠️ Missing in backend .env'}</span>
                  <span>Tools Ready: {toolCatalog.length || 10} verified</span>
                </div>
              </div>
            )}

            {/* Error Notification Banner */}
            {errorMessage && (
              <div className="px-4 py-2.5 bg-rose-50 dark:bg-rose-950/80 border-b border-rose-200 dark:border-rose-500/40 text-rose-800 dark:text-rose-200 text-xs flex items-start justify-between gap-2">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-500 dark:text-rose-400 shrink-0 mt-0.5" />
                  <p className="leading-snug">{errorMessage}</p>
                </div>
                <button
                  onClick={() => setErrorMessage(null)}
                  className="text-rose-500 dark:text-rose-400 hover:text-rose-800 dark:hover:text-white shrink-0"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Tab Contents */}
            <div className="flex-1 min-h-0 flex flex-col">
              {/* =============================================================
               * TAB 1: VAPI VOICE & CONVERSATIONAL HUB (SOLE VOICE AGENT)
               * ============================================================= */}
              {activeTab === 'voice' && (
                <div className="flex-1 flex flex-col min-h-0">
                  {/* Real-Time Call Controller Strip */}
                  <div className="p-3 bg-gradient-to-r from-slate-50 via-cyan-50/60 to-slate-50 dark:from-slate-900 dark:via-cyan-950/40 dark:to-slate-900 border-b border-slate-200 dark:border-cyan-500/20">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {callStatus === 'active' ? (
                          <div className="flex items-center gap-2">
                            <span className="flex h-2.5 w-2.5 relative">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                            </span>
                            <span className="font-mono text-emerald-700 dark:text-emerald-300 text-xs font-bold">
                              CALL LIVE ({formatDuration(callDurationSeconds)})
                            </span>
                          </div>
                        ) : callStatus === 'connecting' ? (
                          <div className="flex items-center gap-2">
                            <RefreshCw className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400 animate-spin" />
                            <span className="font-mono text-amber-700 dark:text-amber-300 text-xs font-medium">
                              Connecting directly to Vapi Voice...
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                            <span className="font-mono text-cyan-700 dark:text-cyan-300 text-xs font-medium">
                              Jarvis Ready • Tap Start Call
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Call Action Buttons */}
                      <div className="flex items-center gap-2">
                        {callStatus === 'active' ? (
                          <>
                            {/* Mute/Unmute Toggle */}
                            <button
                              onClick={toggleMute}
                              className={`px-2.5 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                                isMuted
                                  ? 'bg-rose-50 border-rose-300 text-rose-700 dark:bg-rose-950/80 dark:border-rose-500 dark:text-rose-300'
                                  : 'bg-white border-slate-300 text-slate-700 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700'
                              }`}
                              aria-label={isMuted ? 'Unmute microphone' : 'Mute microphone'}
                              title={isMuted ? 'Microphone is Muted' : 'Microphone is Live'}
                            >
                              {isMuted ? <MicOff className="w-3.5 h-3.5 text-rose-500 dark:text-rose-400" /> : <Mic className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />}
                              <span>{isMuted ? 'Muted' : 'Mic Live'}</span>
                            </button>

                            {/* End Conversation Button */}
                            <button
                              onClick={endVapiCall}
                              className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-rose-900/20 transition-all"
                              aria-label="End conversation"
                            >
                              <PhoneOff className="w-3.5 h-3.5" />
                              <span>End Call</span>
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={startVapiCall}
                            disabled={isStartingCall}
                            className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-cyan-900/20 transition-all"
                            aria-label="Start Jarvis voice conversation"
                          >
                            {isStartingCall ? (
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <PhoneCall className="w-3.5 h-3.5" />
                            )}
                            <span>{isStartingCall ? 'Connecting...' : 'Start Voice Conversation'}</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Active Voice Level Waveform & Status Strip */}
                    {callStatus === 'active' && (
                      <div className="mt-2.5 pt-2 border-t border-slate-200 dark:border-cyan-500/20 flex items-center justify-between text-[11px] font-mono">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1.5">
                            <span className="text-slate-500 dark:text-slate-400">Jarvis:</span>
                            {isAssistantSpeaking ? (
                              <span className="text-emerald-600 dark:text-emerald-300 font-bold flex items-center gap-1">
                                <Volume2 className="w-3.5 h-3.5 animate-bounce" /> Speaking
                              </span>
                            ) : (
                              <span className="text-slate-400 dark:text-slate-500">Listening</span>
                            )}
                          </div>

                          {activeToolName && (
                            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-cyan-100 dark:bg-cyan-950 text-cyan-800 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800 animate-pulse">
                              <Terminal className="w-3 h-3" />
                              <span>Tool: {activeToolName}</span>
                            </div>
                          )}
                        </div>

                        {/* Real Audio Level Visualizer based on genuine SDK volume */}
                        <div className="flex items-center gap-1.5">
                          <span className="text-slate-500 dark:text-slate-400 text-[10px]">Audio Level:</span>
                          <div className="flex items-center gap-0.5 h-3 w-16 bg-slate-200 dark:bg-slate-950 rounded px-1">
                            {[0.1, 0.2, 0.35, 0.5, 0.7, 0.85].map((threshold, idx) => {
                              const activeLevel = isAssistantSpeaking ? assistantVolume : userVolume;
                              const isLit = activeLevel >= threshold;
                              return (
                                <span
                                  key={idx}
                                  className={`flex-1 h-2 rounded-xs transition-colors duration-75 ${
                                    isLit
                                      ? isAssistantSpeaking
                                        ? 'bg-emerald-500 dark:bg-emerald-400 shadow-xs shadow-emerald-400'
                                        : 'bg-cyan-600 dark:bg-cyan-400 shadow-xs shadow-cyan-400'
                                      : 'bg-slate-300 dark:bg-slate-800'
                                  }`}
                                />
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Public Key Warning Card if key is missing */}
                  {!effectivePublicKey && (
                    <div className="m-3 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-500/30 text-amber-800 dark:text-amber-200 text-xs space-y-2">
                      <div className="flex items-center gap-2 font-bold text-amber-900 dark:text-amber-300">
                        <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                        <span>Vapi Configuration Required</span>
                      </div>
                      <p className="text-[11px] text-amber-800/90 dark:text-amber-200/90 leading-relaxed">
                        To enable real-time speech synthesis, ultra-low latency voice and automated tool invocation, configure your Vapi Public Key:
                      </p>
                      <div className="p-2 rounded bg-white dark:bg-slate-950/80 font-mono text-[10px] text-slate-700 dark:text-slate-300 border border-amber-200 dark:border-amber-500/20">
                        Add to frontend/.env: VITE_VAPI_PUBLIC_KEY=your_key_here
                      </div>
                      <button
                        onClick={() => setShowConfigDrawer(true)}
                        className="px-2.5 py-1 rounded bg-amber-600 hover:bg-amber-500 text-white font-bold text-[10px] transition-colors"
                      >
                        Enter Key in UI
                      </button>
                    </div>
                  )}

                  {/* Messages Scroll Area */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs bg-slate-50/50 dark:bg-transparent">
                    {messages.map(m => (
                      <div
                        key={m.id}
                        className={`flex flex-col ${
                          m.sender === 'user' ? 'items-end' : 'items-start'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 mb-1 px-1 text-[10px] text-slate-500 font-mono">
                          <span>{m.sender === 'user' ? 'You' : 'JARVIS (Vapi)'}</span>
                          <span>•</span>
                          <span>{m.timestamp}</span>
                          {m.plugin === 'vapi' && (
                            <span className="text-cyan-600 dark:text-cyan-400 font-semibold">• Voice Transcript</span>
                          )}
                        </div>
                        <div
                          className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 leading-relaxed shadow-xs ${
                            m.sender === 'user'
                              ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-br-none shadow-cyan-600/20'
                              : 'bg-white dark:bg-slate-900/90 text-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-cyan-500/20 rounded-bl-none shadow-slate-200/50'
                          }`}
                        >
                          <div className="whitespace-pre-wrap">{m.text}</div>

                          {m.actionButton && (
                            <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                              <button
                                onClick={m.actionButton.onClick}
                                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                              >
                                <span>{m.actionButton.label}</span>
                              </button>
                            </div>
                          )}

                          {m.toolCall && (
                            <div className="mt-1.5 pt-1.5 border-t border-slate-200 dark:border-slate-800 text-[10px] text-cyan-600 dark:text-cyan-400 font-mono flex items-center gap-1">
                              <Terminal className="w-3 h-3" />
                              <span>Tool execution: {m.toolCall}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}

                    <div ref={messagesEndRef} />
                  </div>

                  {/* Quick Command Suggestions */}
                  <div className="px-3 py-1.5 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-200 dark:border-slate-800/80 flex items-center gap-1.5 overflow-x-auto text-[10px] no-scrollbar">
                    <button
                      onClick={() => executeClientAction('open_app_or_website', { app: 'all_links' })}
                      className="px-2.5 py-1 rounded-full bg-cyan-50 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800/60 hover:bg-cyan-100 whitespace-nowrap transition-colors shadow-2xs font-bold cursor-pointer"
                    >
                      🔗 Open LinkedIn & GitHub
                    </button>
                    <button
                      onClick={() => executeClientAction('open_app_or_website', { app: 'linkedin' })}
                      className="px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/50 hover:bg-blue-100 whitespace-nowrap transition-colors shadow-2xs font-medium cursor-pointer"
                    >
                      🌐 Open LinkedIn
                    </button>
                    <button
                      onClick={() => executeClientAction('open_app_or_website', { app: 'github' })}
                      className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 hover:bg-slate-200 whitespace-nowrap transition-colors shadow-2xs font-medium cursor-pointer"
                    >
                      🐙 Open GitHub
                    </button>
                    <button
                      onClick={() => executeClientAction('post_to_linkedin', { topic: 'Placement Milestone' })}
                      className="px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/50 hover:bg-indigo-100 whitespace-nowrap transition-colors shadow-2xs font-medium cursor-pointer"
                    >
                      📝 Post to LinkedIn
                    </button>
                    <button
                      onClick={() => executeClientAction('open_resume_pdf', { action: 'open_selva_resume' })}
                      className="px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/50 hover:bg-amber-100 whitespace-nowrap transition-colors shadow-2xs font-medium cursor-pointer"
                    >
                      📄 Open Selva Resume (.docx)
                    </button>
                    <button
                      onClick={() => executeClientAction('open_job_profile', {})}
                      className="px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50 hover:bg-emerald-100 whitespace-nowrap transition-colors shadow-2xs font-medium cursor-pointer"
                    >
                      💼 Open Job Profile
                    </button>
                    <button
                      onClick={() => executeClientAction('open_app_or_website', { app: 'profile' })}
                      className="px-2.5 py-1 rounded-full bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/50 hover:bg-purple-100 whitespace-nowrap transition-colors shadow-2xs font-medium cursor-pointer"
                    >
                      👤 View My Profile
                    </button>
                    <button
                      onClick={() => submitCommand('What is my current placement progress?')}
                      className="px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 text-cyan-700 dark:text-cyan-300 border border-slate-200 dark:border-transparent hover:bg-slate-100 dark:hover:bg-slate-700 whitespace-nowrap transition-colors shadow-2xs cursor-pointer"
                    >
                      📈 Placement Progress
                    </button>
                    <button
                      onClick={() => submitCommand('What are my connected integrations?')}
                      className="px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-transparent hover:bg-slate-100 dark:hover:bg-slate-700 whitespace-nowrap transition-colors shadow-2xs cursor-pointer"
                    >
                      🔗 Integrations
                    </button>
                  </div>

                  {/* Interim Speech Transcription Live Indicator */}
                  {interimTranscript && (
                    <div className="px-3.5 py-1.5 bg-cyan-50/95 dark:bg-cyan-950/95 border-t border-cyan-200 dark:border-cyan-800 text-cyan-800 dark:text-cyan-300 text-[11px] flex items-center justify-between gap-2 shadow-inner">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <Zap className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 shrink-0 animate-bounce" />
                        <span className="font-semibold text-[10px] text-cyan-700 dark:text-cyan-400 shrink-0">Hearing:</span>
                        <span className="italic truncate">"{interimTranscript}"</span>
                      </div>
                      <span className="text-[10px] font-mono text-cyan-600 dark:text-cyan-400 shrink-0">Vapi Live STT</span>
                    </div>
                  )}

                  {/* Text Input Bar */}
                  <div className="p-3 bg-white dark:bg-slate-900/90 border-t border-slate-200 dark:border-cyan-500/20 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        if (callStatus === 'active') {
                          toggleMute();
                        } else {
                          startVapiCall();
                        }
                      }}
                      className={`p-2 rounded-xl transition-all ${
                        callStatus === 'active'
                          ? isMuted
                            ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 border border-rose-300'
                            : 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/25 ring-2 ring-emerald-400/40 animate-pulse'
                          : isStartingCall
                          ? 'bg-amber-100 text-amber-700 animate-spin'
                          : 'bg-cyan-50 text-cyan-700 hover:bg-cyan-100 border border-cyan-200 dark:bg-cyan-950 dark:text-cyan-400 dark:hover:bg-cyan-900 dark:border-cyan-500/30'
                      }`}
                      title={
                        callStatus === 'active'
                          ? isMuted
                            ? 'Microphone Muted — Click to unmute'
                            : 'Microphone Live — Click to mute'
                          : 'Click to start direct Vapi voice conversation'
                      }
                      aria-label="Direct Vapi Voice Call"
                    >
                      {callStatus === 'active' && isMuted ? (
                        <MicOff className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                      ) : isStartingCall ? (
                        <RefreshCw className="w-4 h-4 animate-spin text-amber-600" />
                      ) : (
                        <Mic className={`w-4 h-4 ${callStatus === 'active' ? 'animate-bounce' : ''}`} />
                      )}
                    </button>

                    <input
                      type="text"
                      value={query}
                      onChange={e => setQuery(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && submitCommand(query)}
                      placeholder={
                        callStatus === 'active'
                          ? '🎙️ Vapi Call Active — Speak or type message here...'
                          : isStartingCall
                          ? 'Connecting directly to Vapi Voice...'
                          : 'Type a message or tap mic to connect to Vapi...'
                      }
                      className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-hidden focus:border-cyan-500 dark:focus:border-cyan-500 focus:bg-white transition-colors"
                    />

                    <button
                      type="button"
                      onClick={() => submitCommand(query)}
                      disabled={!query.trim() || isProcessing}
                      className="p-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-white transition-colors"
                      aria-label="Send message"
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
                <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs bg-slate-50/50 dark:bg-transparent">
                  <div className="p-3 rounded-xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-500/30 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
                        in
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white">LinkedIn Executive Sync</h4>
                        <p className="text-[11px] text-blue-700 dark:text-blue-300">
                          Account: {studentProfile?.name || 'Candidate Student'} (DYPCOE)
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 font-semibold">
                      Sync Active
                    </span>
                  </div>

                  {/* Post Generator */}
                  <div className="p-4 rounded-xl bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 space-y-3 shadow-xs">
                    <h3 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                      AI Viral Post Generator
                    </h3>

                    <div className="space-y-1">
                      <label className="text-[11px] text-slate-600 dark:text-slate-400">Post Topic / Milestone:</label>
                      <input
                        type="text"
                        value={liTopic}
                        onChange={e => setLiTopic(e.target.value)}
                        placeholder="e.g. Cleared Technical Interview Round, Completed Distributed Systems Project"
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-900 dark:text-white"
                      />
                    </div>

                    <div className="flex items-center justify-between gap-3">
                      <select
                        value={liTone}
                        onChange={e => setLiTone(e.target.value)}
                        className="bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-300"
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
                  <div className="p-4 rounded-xl bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 space-y-3 shadow-xs">
                    <h3 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <Share2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      Alumni & Recruiter Outreach (300-Char Ready)
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={outreachTarget}
                        onChange={e => setOutreachTarget(e.target.value)}
                        placeholder="Target Role (e.g. SDE-2)"
                        className="bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-900 dark:text-white"
                      />
                      <input
                        type="text"
                        value={outreachCompany}
                        onChange={e => setOutreachCompany(e.target.value)}
                        placeholder="Company (e.g. Microsoft)"
                        className="bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-900 dark:text-white"
                      />
                    </div>
                    <button
                      onClick={handleGenerateOutreach}
                      disabled={isGeneratingOutreach}
                      className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      {isGeneratingOutreach ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                      <span>Compose 300-Char Note</span>
                    </button>
                    {outreachResult && (
                      <div className="p-3 bg-blue-50/60 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 rounded-lg space-y-1.5">
                        <div className="flex items-center justify-between text-[11px] text-blue-700 dark:text-blue-300 font-semibold">
                          <span>Connection Request Message:</span>
                          <button
                            onClick={() => copyToClipboard(outreachResult, 'outreach')}
                            className="flex items-center gap-1 hover:underline text-cyan-600"
                          >
                            {copiedId === 'outreach' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                            <span>{copiedId === 'outreach' ? 'Copied' : 'Copy'}</span>
                          </button>
                        </div>
                        <p className="text-slate-800 dark:text-slate-200 leading-relaxed font-sans">{outreachResult}</p>
                      </div>
                    )}
                  </div>

                  {/* Historical Drafts */}
                  {liPosts.length > 0 && (
                    <div className="space-y-2">
                      <span className="font-bold text-slate-700 dark:text-slate-300">Generated LinkedIn Drafts:</span>
                      {liPosts.map(p => (
                        <div
                          key={p.id}
                          className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2 shadow-xs"
                        >
                          <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                            <span>{p.title}</span>
                            <button
                              onClick={() => copyToClipboard(p.content, p.id)}
                              className="text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1"
                            >
                              {copiedId === p.id ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                              <span>{copiedId === p.id ? 'Copied' : 'Copy Post'}</span>
                            </button>
                          </div>
                          <p className="whitespace-pre-wrap leading-relaxed text-slate-800 dark:text-slate-200">
                            {p.content}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* =============================================================
               * TAB 3: MAIL AUTOMATION PLUGIN
               * ============================================================= */}
              {activeTab === 'mail' && (
                <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs bg-slate-50/50 dark:bg-transparent">
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setMailSubTab('inbox')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                          mailSubTab === 'inbox'
                            ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
                            : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        Recruiter Inbox ({inboxEmails.length})
                      </button>
                      <button
                        onClick={() => setMailSubTab('compose')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                          mailSubTab === 'compose'
                            ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
                            : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        AI Email Composer
                      </button>
                    </div>
                  </div>

                  {mailSendSuccess && (
                    <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950 border border-emerald-300 text-emerald-800 dark:text-emerald-200 text-xs flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{mailSendSuccess}</span>
                    </div>
                  )}

                  {mailSubTab === 'compose' ? (
                    <div className="space-y-3 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] text-slate-500">Recipient Name:</label>
                          <input
                            type="text"
                            value={mailRecipientName}
                            onChange={e => setMailRecipientName(e.target.value)}
                            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-500">Recipient Email:</label>
                          <input
                            type="email"
                            value={mailRecipientEmail}
                            onChange={e => setMailRecipientEmail(e.target.value)}
                            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 dark:text-white"
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <select
                          value={mailType}
                          onChange={e => setMailType(e.target.value)}
                          className="bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-300"
                        >
                          <option value="thank_you">Post-Interview Thank You</option>
                          <option value="application_followup">Application Follow-Up</option>
                          <option value="recruiter_outreach">Direct Inbound Inquiry</option>
                        </select>
                        <button
                          onClick={handleDraftMail}
                          disabled={isDraftingMail}
                          className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-semibold flex items-center gap-1.5 transition-colors"
                        >
                          {isDraftingMail ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                          <span>Generate Draft</span>
                        </button>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-500">Subject Line:</label>
                        <input
                          type="text"
                          value={mailSubject}
                          onChange={e => setMailSubject(e.target.value)}
                          placeholder="Email subject..."
                          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 dark:text-white font-semibold"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-500">Body Content:</label>
                        <textarea
                          rows={6}
                          value={mailBody}
                          onChange={e => setMailBody(e.target.value)}
                          placeholder="Compose email body..."
                          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg p-2.5 text-xs text-slate-900 dark:text-white leading-relaxed resize-none"
                        />
                      </div>

                      <div className="flex justify-end gap-2 pt-1">
                        <button
                          onClick={handleSendMail}
                          disabled={isSendingMail || !mailSubject.trim()}
                          className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold flex items-center gap-1.5 shadow-md transition-all"
                        >
                          {isSendingMail ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                          <span>Send Email</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {inboxEmails.length === 0 ? (
                        <div className="p-8 text-center text-slate-400 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                          <Mail className="w-8 h-8 mx-auto mb-2 opacity-50" />
                          <p>No active recruiter threads yet. Connect campus email in Integrations.</p>
                        </div>
                      ) : (
                        inboxEmails.map(mail => (
                          <div
                            key={mail.id}
                            className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1.5 hover:border-purple-300 transition-colors cursor-pointer"
                            onClick={() => {
                              setMailRecipientName(mail.sender);
                              setMailRecipientEmail(mail.sender_email || 'recruiter@tech.com');
                              setMailSubject(`Re: ${mail.subject}`);
                              setMailSubTab('compose');
                            }}
                          >
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="font-bold text-slate-800 dark:text-slate-200">{mail.sender}</span>
                              <span className="text-[10px] text-slate-400 font-mono">{mail.received_at}</span>
                            </div>
                            <div className="font-medium text-slate-700 dark:text-slate-300">{mail.subject}</div>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">{mail.snippet}</p>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* =============================================================
               * TAB 4: SYSTEM TELEMETRY & TOOLS REGISTRY
               * ============================================================= */}
              {activeTab === 'system' && (
                <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs bg-slate-50/50 dark:bg-transparent font-mono">
                  <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-slate-700 dark:text-slate-300 font-bold">
                      <div className="flex items-center gap-2">
                        <Terminal className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        <span>Vapi Engine Architecture Status</span>
                      </div>
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">ONLINE</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-slate-200 dark:border-slate-800">
                      <div>Engine: <span className="text-cyan-600 dark:text-cyan-400">Vapi WebRTC SDK v2.7</span></div>
                      <div>Voice Model: <span className="text-cyan-600 dark:text-cyan-400">11Labs / Sarah</span></div>
                      <div>Conflict Guard: <span className="text-emerald-600 dark:text-emerald-400">Active (Single Voice Agent)</span></div>
                      <div>Backend Auth: <span className="text-emerald-600 dark:text-emerald-400">Deterministic</span></div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="font-bold text-slate-700 dark:text-slate-300">Registered Vapi Tool Bridges ({toolCatalog.length || 10}):</span>
                    <div className="space-y-1.5">
                      {(toolCatalog.length > 0 ? toolCatalog : [
                        { name: 'get_placement_progress', description: 'Returns real student applications, interviews, shortlists and verified progress score' },
                        { name: 'get_connected_services', description: 'Returns status of GitHub, LinkedIn, Gmail, and LeetCode connections' },
                        { name: 'search_opportunities', description: 'Scans verified campus drives, internships, and hackathons' },
                        { name: 'check_failed_github_workflows', description: 'Inspects real GitHub Actions workflow runs for failures' },
                        { name: 'create_linkedin_draft', description: 'Generates evidence-backed LinkedIn achievement post drafts' },
                        { name: 'create_email_draft', description: 'Drafts tailored professional interview follow-ups and thank-you emails' },
                        { name: 'get_interview_tips', description: 'Retrieves authentic preparation guidelines based on candidate target role' },
                        { name: 'navigate_to_page', description: 'Automates in-app navigation to Resume Studio, Interviews, or Integrations' }
                      ]).map((tool, idx) => (
                        <div
                          key={idx}
                          className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-start gap-2.5"
                        >
                          <Terminal className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 shrink-0 mt-0.5" />
                          <div className="space-y-0.5">
                            <span className="font-bold text-slate-800 dark:text-cyan-300">{tool.name}</span>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-sans leading-normal">
                              {tool.description}
                            </p>
                          </div>
                        </div>
                      ))}
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
