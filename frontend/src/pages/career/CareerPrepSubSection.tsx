import React from 'react';
import {
  TrendingUp,
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  ExternalLink,
  Target,
  ArrowRight,
  ShieldCheck,
  Bot,
  Sparkles,
  Zap,
  Clock
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { mockCareerGaps } from '../../mock/data';

export const CareerPrepSubSection: React.FC = () => {
  const { skills, studentProfile, integrationsStatus, setCurrentSection, setCurrentSubSection } = useApp();

  const verifiedSkills = skills.filter(s => s.verified);
  const claudeConnected = integrationsStatus?.claude_api?.status === 'connected';

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Target Role & Readiness Gauge */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300">
              Evidence Grounded
            </span>
            <span className="text-xs text-slate-400">Campus Placement Preparation</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">
            Technical Interview & Skill Gap Analysis
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xl leading-relaxed">
            Preparation roadmaps grounded strictly on your validated skill inventory ({verifiedSkills.length} verified out of {skills.length} claimed).
          </p>
        </div>

        <div className="flex items-center space-x-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800">
          <div className="text-right">
            <span className="text-xs text-slate-500">Verified Skills</span>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">
              {verifiedSkills.length}
            </p>
          </div>
          <div className="w-12 h-12 rounded-full bg-brand-50 dark:bg-brand-950 text-brand-600 flex items-center justify-center font-bold text-xs">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* AI Interview Coach Integration Status */}
      <div className={`p-5 rounded-2xl border shadow-xs space-y-3 ${
        claudeConnected
          ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/40'
          : 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800/40'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <Bot className={`w-5 h-5 ${claudeConnected ? 'text-emerald-600' : 'text-amber-600'}`} />
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Claude AI Interview Preparation Engine
              </h3>
              <p className="text-xs text-slate-500">
                Backend-only Anthropic Claude API for structured mock questions and grounded explanations
              </p>
            </div>
          </div>
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
            claudeConnected
              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200'
              : 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200'
          }`}>
            {claudeConnected ? 'Connected (Live)' : 'Disconnected (Setup Required)'}
          </span>
        </div>

        {!claudeConnected && (
          <div className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-white/60 dark:bg-slate-900/60 p-3.5 rounded-xl border border-amber-200/60 dark:border-amber-800/30">
            <p className="font-semibold text-amber-900 dark:text-amber-200 mb-1">
              Live Claude API Key Not Active:
            </p>
            <p>
              To enable AI interview simulations and evidence-grounded match explanations, provide a valid <code>ANTHROPIC_API_KEY</code> in <code>backend/.env</code>. Under the Live Data Only policy, no simulated or fabricated AI responses are generated.
            </p>
          </div>
        )}

        <div className="pt-2 flex items-center justify-between">
          <p className="text-xs text-slate-500">
            Practice real technical questions with live speech-to-text, camera framing telemetry, and Claude rubric evaluations.
          </p>
          <button
            onClick={() => {
              setCurrentSection('career');
              setCurrentSubSection('interview-studio');
            }}
            className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-xs hover:shadow-brand-500/20 transition-all flex items-center gap-1.5 shrink-0"
          >
            Launch Interview Studio <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Real Verified Skills Breakdown */}
      <div className="space-y-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Target className="w-4 h-4 text-brand-600" />
            Verified Skill Coverage
          </h2>
          <p className="text-xs text-slate-500">
            Skills backed by GitHub repository commits, proctored assessments, or verified coursework.
          </p>
        </div>

        {skills.length === 0 ? (
          <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-800 text-center space-y-3">
            <p className="text-xs text-slate-500">No skills logged in your career inventory yet.</p>
            <button
              onClick={() => {
                setCurrentSection('career');
                setCurrentSubSection('skills');
              }}
              className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-medium text-xs shadow-xs transition-colors"
            >
              Add Verified Skills
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {skills.map(s => (
              <div
                key={s.id}
                className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between"
              >
                <div>
                  <h4 className="font-semibold text-xs text-slate-900 dark:text-white">{s.name}</h4>
                  <span className="text-[11px] text-slate-500">{s.category} • {s.level}</span>
                </div>
                {s.verified ? (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Verified ({s.verificationSource})
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                    Self-Reported
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Target Skill Gaps & Recommended Roadmaps */}
      <div className="space-y-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-brand-600" />
            Target Skill Gaps for Top Product Roles
          </h2>
          <p className="text-xs text-slate-500">
            Competencies frequently demanded by Tier-1 campus recruiters that are missing from your verified proofs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mockCareerGaps.map((gap, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-brand-300 transition-all space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    gap.importance === 'High'
                      ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                      : 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                  }`}>
                    {gap.importance} Priority Gap
                  </span>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white mt-1.5">{gap.skill}</h4>
                </div>
                <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  ~{gap.estimatedWeeks}w roadmap
                </span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {gap.gapDescription}
              </p>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 truncate">
                  <BookOpen className="w-3.5 h-3.5 text-brand-600 shrink-0" />
                  <span className="truncate text-slate-700 dark:text-slate-300 font-medium">{gap.learningResource}</span>
                </div>
                <button className="text-brand-600 dark:text-brand-400 font-semibold text-xs shrink-0 hover:underline flex items-center gap-1">
                  Start <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
