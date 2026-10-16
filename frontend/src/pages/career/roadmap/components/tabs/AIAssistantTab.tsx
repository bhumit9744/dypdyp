import React, { useState } from 'react';
import { useRoadmap } from '../../context/RoadmapContext';
import {
  Bot,
  Send,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  Clock,
  Layers,
  Sliders,
  AlertTriangle,
  Lightbulb
} from 'lucide-react';

interface AIAssistantTabProps {
  onRequestDiagnostic?: (skillName: string) => void;
}

export const AIAssistantTab: React.FC<AIAssistantTabProps> = ({ onRequestDiagnostic }) => {
  const {
    roadmap,
    chatMessages,
    askAssistant,
    respondToProposal,
    activeProposal,
    isLoading
  } = useRoadmap();

  const [inputQuery, setInputQuery] = useState<string>('');

  const samplePrompts = [
    'What should I study today?',
    'I missed my weekly target. Adjust my schedule.',
    'Can I finish this roadmap in 3 months?',
    'I am stuck on this concept. What should I do?',
    'I already know this topic. Can I test out of it?',
    'Which tasks should I prioritize this week?'
  ];

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || inputQuery;
    if (!text.trim() || isLoading) return;
    setInputQuery('');
    await askAssistant(text.trim());
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300">
              Contextual AI Assistant
            </span>
            <span className="text-xs text-slate-400">Strictly Grounded in Roadmap State</span>
          </div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Bot className="w-5 h-5 text-brand-600" />
            AI Career Roadmap Copilot
          </h2>
          <p className="text-xs text-slate-500 max-w-lg leading-relaxed">
            Ask targeted questions about your current phase, request adaptive schedule realignments, or take diagnostic evaluations to test out of prerequisites.
          </p>
        </div>

        {roadmap && (
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-xs shrink-0">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Context Loaded</span>
            <span className="font-extrabold text-slate-800 dark:text-slate-200">
              {roadmap.career_title} (Phase {roadmap.current_phase_index + 1})
            </span>
          </div>
        )}
      </div>

      {/* Quick Prompts Carousel / Pills */}
      <div className="space-y-1.5">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
          Suggested Questions Grounded in Your Status:
        </span>
        <div className="flex items-center overflow-x-auto space-x-2 scrollbar-none pb-1">
          {samplePrompts.map((prompt, idx) => (
            <button
              type="button"
              key={idx}
              onClick={() => handleSend(prompt)}
              className="px-3 py-1.5 rounded-xl text-xs font-medium bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-brand-400 dark:hover:border-brand-600 text-slate-700 dark:text-slate-300 shrink-0 transition-colors flex items-center space-x-1"
            >
              <Lightbulb className="w-3 h-3 text-amber-500" />
              <span>{prompt}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Container */}
      <div className="p-4 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 min-h-[380px] max-h-[500px] overflow-y-auto">
        {chatMessages.map(msg => {
          const isUser = msg.sender === 'user';

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1.5`}
            >
              <div className="flex items-center space-x-1.5 text-[10px] text-slate-400">
                <span>{isUser ? 'You' : 'AI Assistant'}</span>
                <span>•</span>
                <span>{msg.timestamp}</span>
              </div>

              <div
                className={`p-4 rounded-2xl max-w-xl text-xs sm:text-sm leading-relaxed space-y-3 ${
                  isUser
                    ? 'bg-brand-600 text-white rounded-tr-xs'
                    : 'bg-slate-50 dark:bg-slate-850/80 text-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-slate-800 rounded-tl-xs'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.content}</div>

                {/* Test Out Diagnostic Request Button */}
                {msg.diagnosticSkill && onRequestDiagnostic && (
                  <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700">
                    <button
                      type="button"
                      onClick={() => onRequestDiagnostic(msg.diagnosticSkill!)}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-xs transition-colors flex items-center space-x-2"
                    >
                      <ShieldCheck className="w-4 h-4 text-emerald-300" />
                      <span>Take Diagnostic: {msg.diagnosticSkill}</span>
                    </button>
                  </div>
                )}

                {/* Structured Adaptation Proposal Card with Accept/Reject buttons */}
                {msg.proposal && (
                  <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border-2 border-brand-500 shadow-md space-y-3 mt-3 text-slate-900 dark:text-white">
                    <div className="flex items-center space-x-2">
                      <Sliders className="w-4 h-4 text-brand-600" />
                      <h4 className="font-extrabold text-xs">
                        {msg.proposal.title}
                      </h4>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300">
                      <strong>Reason:</strong> {msg.proposal.reason}
                    </p>

                    <div className="space-y-1.5 bg-slate-50 dark:bg-slate-850 p-3 rounded-lg text-xs">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                        Proposed Changes:
                      </span>
                      {msg.proposal.changes.map((chg, cIdx) => (
                        <div key={cIdx} className="flex items-start space-x-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-brand-500 shrink-0 mt-0.5" />
                          <span className="text-slate-700 dark:text-slate-300">
                            <strong>{chg.type}:</strong> {chg.description}
                          </span>
                        </div>
                      ))}
                    </div>

                    <p className="text-[11px] text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 p-2 rounded-lg">
                      Note: Changes will update your active timeline and reschedule remaining tasks only after your explicit acceptance.
                    </p>

                    <div className="flex items-center justify-end space-x-2 pt-1">
                      <button
                        type="button"
                        onClick={() => respondToProposal(false)}
                        className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        Reject Proposal
                      </button>

                      <button
                        type="button"
                        onClick={() => respondToProposal(true)}
                        className="px-4 py-1.5 rounded-lg text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-xs transition-colors flex items-center space-x-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Accept Changes</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center space-x-2 text-xs text-slate-400 p-2">
            <Bot className="w-4 h-4 text-brand-500 animate-spin" />
            <span>Analyzing roadmap schedule and evaluating context…</span>
          </div>
        )}
      </div>

      {/* Input Bar */}
      <div className="p-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center space-x-2">
        <input
          type="text"
          value={inputQuery}
          onChange={e => setInputQuery(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleSend())}
          placeholder="Ask anything about your roadmap, daily priority, or schedule adjustment..."
          className="flex-1 px-4 py-2.5 text-xs bg-transparent text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
        />

        <button
          type="button"
          onClick={() => handleSend()}
          disabled={!inputQuery.trim() || isLoading}
          className="p-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white disabled:opacity-40 transition-colors shadow-xs"
          aria-label="Send message"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
