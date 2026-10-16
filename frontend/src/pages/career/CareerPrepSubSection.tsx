import React from 'react';
import {
  TrendingUp,
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  ExternalLink,
  Target,
  ArrowRight,
  HelpCircle
} from 'lucide-react';
import { mockCareerGaps } from '../../mock/data';

export const CareerPrepSubSection: React.FC = () => {
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Target Role & Readiness Gauge */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300">
              Target Track
            </span>
            <span className="text-xs text-slate-400">Super Dream Tier (24+ LPA)</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">
            Software Development Engineer I (Distributed Backend)
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xl leading-relaxed">
            Personalized curriculum tailored by comparing your validated Git/Project portfolio against interview criteria at Atlassian, Razorpay, and AWS.
          </p>
        </div>

        <div className="flex items-center space-x-4 p-4 rounded-xl bg-brand-50/60 dark:bg-brand-950/40 border border-brand-100 dark:border-brand-900/40">
          <div className="text-right">
            <span className="text-xs text-slate-500">Readiness Score</span>
            <p className="text-2xl font-black text-brand-600 dark:text-brand-400">89%</p>
          </div>
          <div className="w-12 h-12 rounded-full border-4 border-brand-600 border-t-brand-200 flex items-center justify-center font-bold text-xs text-brand-700 dark:text-brand-300">
            A+
          </div>
        </div>
      </div>

      {/* Identified Skill-Gaps & Curated Roadmaps */}
      <div className="space-y-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Target className="w-4 h-4 text-brand-600" />
            Identified Technical Skill Gaps & Remediation Plans
          </h2>
          <p className="text-xs text-slate-500">
            Closing these two gaps boosts interview shortlisting odds by an estimated 28%.
          </p>
        </div>

        <div className="space-y-3">
          {mockCareerGaps.map((gap, gIdx) => (
            <div
              key={gIdx}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 max-w-2xl">
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-sm text-slate-900 dark:text-white">
                    {gap.skill}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      gap.importance === 'High'
                        ? 'bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                        : 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                    }`}
                  >
                    {gap.importance} Priority
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {gap.gapDescription}
                </p>
                <div className="text-xs text-slate-500 flex items-center gap-1.5 pt-1">
                  <BookOpen className="w-3.5 h-3.5 text-brand-600" />
                  <span>Curated Module: </span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {gap.learningResource}
                  </span>
                </div>
              </div>

              <div className="flex md:flex-col items-center md:items-end justify-between gap-2 shrink-0">
                <span className="text-xs text-slate-400 font-medium">
                  Est. Duration: {gap.estimatedWeeks} Weeks
                </span>
                <button
                  onClick={() => alert(`Enrolled in: ${gap.learningResource}`)}
                  className="px-3.5 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors"
                >
                  <span>Start Lab</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mock Interview Guidance Card */}
      <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-850/60 border border-slate-200 dark:border-slate-800 text-xs space-y-3">
        <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-brand-600" />
          System Design & Behavioral Interview Advice for SDE Drives
        </h3>
        <ul className="space-y-2 text-slate-600 dark:text-slate-300 list-disc list-inside leading-relaxed">
          <li>
            <strong className="text-slate-900 dark:text-white">Clarify Non-Functional Requirements Early:</strong> Ask throughput (QPS), read/write ratio, latency targets (e.g. p99 &lt; 200ms), and availability SLAs upfront.
          </li>
          <li>
            <strong className="text-slate-900 dark:text-white">Ground Claims in Real Data:</strong> When discussing your projects, explain why you chose PostgreSQL over MongoDB and how you ensured idempotent message processing.
          </li>
          <li>
            <strong className="text-slate-900 dark:text-white">Structure with STAR:</strong> Situation, Task, Action, and Quantified Result for all behavioral and cross-functional leadership questions.
          </li>
        </ul>
      </div>
    </div>
  );
};
