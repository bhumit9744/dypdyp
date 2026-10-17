import React, { useState, useRef, useEffect } from 'react';
import { useGuidance } from '../../context/GuidanceContext';
import {
  Sparkles,
  Send,
  User,
  Bot,
  ArrowRight,
  GitCompare,
  FlaskConical,
  Compass,
  BarChart3,
  HelpCircle,
  Lightbulb,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const AICounsellorTab: React.FC = () => {
  const {
    chatMessages,
    sendCounsellorMessage,
    isLoading,
    setActiveTab,
    toggleCompareRole,
    setSelectedExperimentForModal,
    experiments,
    setSkillGapSelectedRoleId,
    navigateToRoadmapWithRole,
    primaryGoal
  } = useGuidance();

  const [inputMessage, setInputMessage] = useState('');
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const CONVERSATION_STARTERS = [
    "Should I choose Full-Stack Development or AI/ML?",
    "I enjoy both coding and visual design. What fits best?",
    "I have 6 months before internships. How should I prioritize?",
    "I don't have enough projects. What should I build first?",
    "Review my current preparation strategy and skill gaps."
  ];

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isLoading]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;
    const text = inputMessage;
    setInputMessage('');
    await sendCounsellorMessage(text);
  };

  const handleActionClick = (action: string, payload?: any) => {
    if (action === 'open_comparison') {
      if (Array.isArray(payload)) {
        payload.forEach(id => toggleCompareRole(id));
      }
      setActiveTab('compare');
    } else if (action === 'open_experiment') {
      const exp = experiments.find(e => e.id === payload);
      if (exp) setSelectedExperimentForModal(exp);
      else setActiveTab('experiments');
    } else if (action === 'open_experiments_list') {
      setActiveTab('experiments');
    } else if (action === 'open_discovery') {
      setActiveTab('discovery');
    } else if (action === 'open_skill_gaps') {
      if (payload) setSkillGapSelectedRoleId(payload);
      setActiveTab('skill-gaps');
    } else if (action === 'open_recommendations') {
      setActiveTab('recommendations');
    } else if (action === 'open_roadmap_planner') {
      navigateToRoadmapWithRole(primaryGoal?.career_id || 'role_fullstack');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Personalized AI Career Counsellor</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                Context-Aware
              </span>
            </h2>
            <p className="text-xs text-slate-500">
              Understands your academic background, verified skills, and active placement goals.
            </p>
          </div>
        </div>
      </div>

      {/* Chat Messages Container */}
      <div className="p-4 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm min-h-[480px] flex flex-col justify-between space-y-4">
        {/* Messages List */}
        <div className="space-y-5 overflow-y-auto max-h-[560px] pr-2">
          {chatMessages.map(msg => {
            const isUser = msg.sender === 'user';

            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 mt-1 shadow-sm">
                    <Sparkles className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-2xl rounded-3xl p-4 sm:p-5 text-xs leading-relaxed space-y-3 ${
                    isUser
                      ? 'bg-indigo-600 text-white rounded-br-none shadow-md'
                      : 'bg-slate-50 dark:bg-slate-850/80 text-slate-800 dark:text-slate-200 border border-slate-200/60 dark:border-slate-800 rounded-bl-none shadow-sm'
                  }`}
                >
                  {/* Structured response display */}
                  {msg.structured_sections ? (
                    <div className="space-y-3">
                      {msg.structured_sections.headline && (
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-200/60 dark:border-slate-800 pb-2">
                          {msg.structured_sections.headline}
                        </h4>
                      )}

                      {msg.structured_sections.understanding && (
                        <p className="text-xs text-slate-600 dark:text-slate-300">
                          {msg.structured_sections.understanding}
                        </p>
                      )}

                      {/* Options breakdown */}
                      {msg.structured_sections.options && msg.structured_sections.options.length > 0 && (
                        <div className="space-y-2 pt-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                            Strategic Trade-Offs:
                          </span>
                          <div className="grid grid-cols-1 gap-2">
                            {msg.structured_sections.options.map((opt, i) => (
                              <div
                                key={i}
                                className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-1"
                              >
                                <span className="font-bold text-indigo-600 dark:text-indigo-400 block">
                                  {opt.title}
                                </span>
                                <p className="text-slate-600 dark:text-slate-300 text-[11px]">
                                  <strong>Fit:</strong> {opt.fit}
                                </p>
                                <p className="text-slate-500 text-[11px]">
                                  <strong>Trade-off:</strong> {opt.trade_off}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Recommended next steps */}
                      {msg.structured_sections.recommended_next_steps && msg.structured_sections.recommended_next_steps.length > 0 && (
                        <div className="space-y-1 pt-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 block">
                            Recommended Next Steps:
                          </span>
                          <ul className="space-y-1 pl-4 list-disc text-slate-600 dark:text-slate-300">
                            {msg.structured_sections.recommended_next_steps.map((step, idx) => (
                              <li key={idx}>{step}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                  )}

                  {/* Contextual Action Chips embedded in the message */}
                  {msg.contextual_actions && msg.contextual_actions.length > 0 && (
                    <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800 flex flex-wrap gap-1.5">
                      {msg.contextual_actions.map((act, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleActionClick(act.action, act.payload)}
                          className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 hover:bg-indigo-50 dark:hover:bg-indigo-950 border border-slate-200 dark:border-slate-700 text-indigo-600 dark:text-indigo-400 font-semibold text-[11px] shadow-sm flex items-center gap-1 transition-all active:scale-95"
                        >
                          <span>{act.label}</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      ))}
                    </div>
                  )}

                  <span className="text-[10px] text-slate-400 block text-right pt-0.5">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center shrink-0 mt-1 shadow-sm">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3 justify-start items-center">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm animate-pulse">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 text-xs text-slate-500 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
                <span>Synthesizing profile context and formulating advice...</span>
              </div>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Input Bar & Conversation Starters */}
        <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
          {/* Starters */}
          <div className="flex flex-wrap gap-1.5">
            {CONVERSATION_STARTERS.map((starter, idx) => (
              <button
                key={idx}
                onClick={() => sendCounsellorMessage(starter)}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-left transition-all"
              >
                {starter}
              </button>
            ))}
          </div>

          <form onSubmit={handleSend} className="relative flex items-center">
            <input
              type="text"
              placeholder="Type your career question, trade-off dilemma, or preparation concern..."
              value={inputMessage}
              onChange={e => setInputMessage(e.target.value)}
              disabled={isLoading}
              className="w-full pl-4 pr-12 py-3 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isLoading}
              className="absolute right-2 p-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-40 transition-all shadow-sm active:scale-95"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
