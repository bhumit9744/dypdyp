import React, { useState } from 'react';
import { SkillComparisonItem } from '../../types/roadmap';
import { ShieldCheck, UserCheck, HelpCircle, BarChart3, Radar } from 'lucide-react';

interface SkillCoverageChartProps {
  skills: SkillComparisonItem[];
  careerTitle?: string;
}

export const SkillCoverageChart: React.FC<SkillCoverageChartProps> = ({
  skills,
  careerTitle = 'Target Role'
}) => {
  const [viewMode, setViewMode] = useState<'radar' | 'bars'>('bars');

  if (!skills || skills.length === 0) {
    return (
      <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-2">
        <HelpCircle className="w-8 h-8 text-slate-400 mx-auto" />
        <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">No Skill Assessment Data</h4>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Skill coverage benchmarks will appear once you configure your roadmap and verify skills through assessments or GitHub code evidence.
        </p>
      </div>
    );
  }

  // Radar Chart Calculations
  const size = 320;
  const center = size / 2;
  const radius = center - 45;
  const total = skills.length;

  const getCoordinates = (index: number, value: number) => {
    const angle = (Math.PI * 2 / total) * index - Math.PI / 2;
    const r = (value / 100) * radius;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle)
    };
  };

  // Compute Radar Polygon Points
  const requiredPoints = skills.map((s, idx) => {
    const pt = getCoordinates(idx, s.required_level);
    return `${pt.x},${pt.y}`;
  }).join(' ');

  const demonstratedPoints = skills.map((s, idx) => {
    const val = s.status === 'Demonstrated' ? s.demonstrated_level : 0;
    const pt = getCoordinates(idx, val);
    return `${pt.x},${pt.y}`;
  }).join(' ');

  const selfReportedPoints = skills.map((s, idx) => {
    const val = s.self_reported_level || (s.status === 'Demonstrated' ? s.demonstrated_level : 0);
    const pt = getCoordinates(idx, val);
    return `${pt.x},${pt.y}`;
  }).join(' ');

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
      {/* Header and Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Skill Coverage & Competency Benchmarks
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              {careerTitle}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Strict separation between verified demonstrated competence, self-reported claims, and unassessed areas.
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setViewMode('bars')}
            className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'bars'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Grouped Bars</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('radar')}
            className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'radar'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Radar className="w-3.5 h-3.5" />
            <span>Radar Polygon</span>
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 text-xs pt-1 border-t border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3 rounded-sm bg-brand-600 inline-block" />
          <span className="font-semibold text-slate-700 dark:text-slate-300">Required Benchmark</span>
          <span className="text-[10px] text-slate-400">(Role Baseline)</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3 rounded-sm bg-emerald-500 inline-block" />
          <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            Demonstrated Competence
          </span>
          <span className="text-[10px] text-slate-400">(Verified Evidence)</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3 rounded-sm bg-amber-400 inline-block" />
          <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
            <UserCheck className="w-3.5 h-3.5 text-amber-500" />
            Self-Reported Claim
          </span>
          <span className="text-[10px] text-slate-400">(Unverified)</span>
        </div>
      </div>

      {/* View 1: Grouped Bar Visualization */}
      {viewMode === 'bars' && (
        <div className="space-y-4">
          {skills.map((item, idx) => (
            <div key={idx} className="space-y-1.5 p-3 rounded-xl bg-slate-50/70 dark:bg-slate-850/50 border border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {item.skill}
                </span>

                <div className="flex items-center space-x-2">
                  {item.status === 'Demonstrated' ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200/50 dark:border-emerald-800/40">
                      <ShieldCheck className="w-3 h-3" />
                      Verified {item.demonstrated_level}%
                    </span>
                  ) : item.status === 'Self-Reported' ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-200/50 dark:border-amber-800/40">
                      <UserCheck className="w-3 h-3" />
                      Claimed {item.self_reported_level}% (Unverified)
                    </span>
                  ) : (
                    <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                      Not Assessed
                    </span>
                  )}
                </div>
              </div>

              {/* Progress Comparison Bars */}
              <div className="space-y-1">
                {/* Required Benchmark Bar */}
                <div className="w-full bg-slate-200/70 dark:bg-slate-800 h-2 rounded-full overflow-hidden relative">
                  <div
                    className="bg-brand-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${item.required_level}%` }}
                    title={`Required: ${item.required_level}%`}
                  />
                </div>

                {/* Actual Candidate Bar */}
                <div className="w-full bg-slate-200/40 dark:bg-slate-800/60 h-2 rounded-full overflow-hidden relative">
                  {item.status === 'Demonstrated' ? (
                    <div
                      className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${item.demonstrated_level}%` }}
                      title={`Demonstrated: ${item.demonstrated_level}%`}
                    />
                  ) : item.status === 'Self-Reported' ? (
                    <div
                      className="bg-amber-400 h-full rounded-full transition-all duration-500"
                      style={{ width: `${item.self_reported_level}%` }}
                      title={`Self-Reported: ${item.self_reported_level}%`}
                    />
                  ) : (
                    <div className="w-0 h-full" />
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-400 pt-0.5">
                <span>Target: {item.required_level}%</span>
                <span>
                  {item.status === 'Demonstrated'
                    ? `Evidence: ${item.verification_source || 'Coursework / Assessment'}`
                    : item.status === 'Self-Reported'
                    ? 'Requires verified evaluation to count towards credentials'
                    : 'Upcoming in roadmap phases'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* View 2: SVG Radar Polygon Visualization */}
      {viewMode === 'radar' && (
        <div className="flex flex-col items-center justify-center py-4">
          <svg width={size} height={size} className="overflow-visible">
            {/* Background Radial Webs */}
            {[0.25, 0.5, 0.75, 1.0].map((level, i) => (
              <circle
                key={i}
                cx={center}
                cy={center}
                r={radius * level}
                fill="none"
                stroke="currentColor"
                className="text-slate-200 dark:text-slate-800"
                strokeDasharray={level < 1 ? '3 3' : undefined}
              />
            ))}

            {/* Radial Spokes */}
            {skills.map((_, idx) => {
              const pt = getCoordinates(idx, 100);
              return (
                <line
                  key={idx}
                  x1={center}
                  y1={center}
                  x2={pt.x}
                  y2={pt.y}
                  stroke="currentColor"
                  className="text-slate-200 dark:text-slate-800"
                />
              );
            })}

            {/* Required Benchmark Polygon */}
            <polygon
              points={requiredPoints}
              fill="rgba(79, 70, 229, 0.12)"
              stroke="#4f46e5"
              strokeWidth="2"
              strokeDasharray="4 4"
            />

            {/* Self-Reported Polygon */}
            <polygon
              points={selfReportedPoints}
              fill="rgba(251, 191, 36, 0.15)"
              stroke="#fbbf24"
              strokeWidth="2"
            />

            {/* Demonstrated Evidence Polygon */}
            <polygon
              points={demonstratedPoints}
              fill="rgba(16, 185, 129, 0.25)"
              stroke="#10b981"
              strokeWidth="2.5"
            />

            {/* Point Labels around perimeter */}
            {skills.map((s, idx) => {
              const labelPt = getCoordinates(idx, 120);
              return (
                <text
                  key={idx}
                  x={labelPt.x}
                  y={labelPt.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  className="text-[9px] font-bold fill-slate-600 dark:fill-slate-300 select-none"
                >
                  {s.skill.length > 14 ? `${s.skill.slice(0, 12)}…` : s.skill}
                </text>
              );
            })}
          </svg>
        </div>
      )}
    </div>
  );
};
