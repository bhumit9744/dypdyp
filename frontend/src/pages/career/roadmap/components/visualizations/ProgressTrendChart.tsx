import React from 'react';
import { ProgressSnapshot } from '../../types/roadmap';
import { TrendingUp, Clock, History, Calendar } from 'lucide-react';

interface ProgressTrendChartProps {
  snapshots?: ProgressSnapshot[];
}

export const ProgressTrendChart: React.FC<ProgressTrendChartProps> = ({ snapshots = [] }) => {
  // Check if we have real historical snapshots
  const hasHistory = snapshots && snapshots.length >= 2;

  if (!hasHistory) {
    return (
      <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center space-x-2 text-slate-800 dark:text-slate-200">
          <History className="w-4 h-4 text-brand-600" />
          <h3 className="font-bold text-sm">Roadmap Velocity & Historical Trend</h3>
        </div>

        <div className="p-6 rounded-xl bg-slate-50 dark:bg-slate-850/60 border border-dashed border-slate-200 dark:border-slate-700 text-center space-y-2">
          <Clock className="w-8 h-8 text-slate-400 mx-auto" />
          <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Awaiting Historical Data Points
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
            As you mark tasks completed, reschedule milestones, or update your roadmap, Placement Hub automatically records timestamped progress snapshots to graph your learning velocity.
          </p>
          <div className="pt-2 flex justify-center">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300 border border-brand-200/50">
              Active Snapshot Recorder Initialized
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Width and Height for SVG
  const width = 600;
  const height = 180;
  const padding = { top: 20, right: 30, bottom: 30, left: 40 };

  const usableWidth = width - padding.left - padding.right;
  const usableHeight = height - padding.top - padding.bottom;

  // Map snapshot points
  const points = snapshots.map((s, idx) => {
    const x = padding.left + (idx / (snapshots.length - 1)) * usableWidth;
    const y = padding.top + usableHeight - (s.completion_percentage / 100) * usableHeight;
    return { x, y, pct: s.completion_percentage, date: new Date(s.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' }) };
  });

  const pathD = points.reduce((acc, pt, idx) => {
    return idx === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1].x} ${padding.top + usableHeight} L ${points[0].x} ${padding.top + usableHeight} Z`;

  const latestPct = snapshots[snapshots.length - 1].completion_percentage;
  const initialPct = snapshots[0].completion_percentage;
  const netGain = Math.round(latestPct - initialPct);

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-emerald-500" />
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Roadmap Progress Velocity
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
              +{netGain}% Total Gain
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Plotting real historical snapshots recorded across task updates.
          </p>
        </div>

        <span className="text-xs text-slate-400">
          {snapshots.length} Data Points Logged
        </span>
      </div>

      {/* SVG Line Chart */}
      <div className="w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-44 sm:h-52 overflow-visible select-none"
        >
          <defs>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map((val) => {
            const y = padding.top + usableHeight - (val / 100) * usableHeight;
            return (
              <g key={val}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={width - padding.right}
                  y2={y}
                  stroke="currentColor"
                  className="text-slate-100 dark:text-slate-800/80"
                  strokeDasharray="3 3"
                />
                <text
                  x={padding.left - 8}
                  y={y + 3}
                  textAnchor="end"
                  className="text-[9px] fill-slate-400"
                >
                  {val}%
                </text>
              </g>
            );
          })}

          {/* Gradient Area Fill */}
          <path d={areaD} fill="url(#areaGradient)" />

          {/* Line Stroke */}
          <path
            d={pathD}
            fill="none"
            stroke="#4f46e5"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Point Markers */}
          {points.map((pt, idx) => (
            <g key={idx} className="group cursor-pointer">
              <circle
                cx={pt.x}
                cy={pt.y}
                r="4.5"
                fill="#ffffff"
                stroke="#4f46e5"
                strokeWidth="2.5"
                className="transition-transform group-hover:scale-150"
              />
              <text
                x={pt.x}
                y={padding.top + usableHeight + 16}
                textAnchor="middle"
                className="text-[9px] fill-slate-400"
              >
                {pt.date}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
};
