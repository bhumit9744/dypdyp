import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Clock, CheckCircle2, AlertTriangle, Calendar } from 'lucide-react';

interface WeeklyWorkloadChartProps {
  workloadData: { week: number; plannedHours: number; completedHours: number }[];
  weeklyLimit?: number;
}

export const WeeklyWorkloadChart: React.FC<WeeklyWorkloadChartProps> = ({
  workloadData,
  weeklyLimit = 15
}) => {
  const [selectedWeekIndex, setSelectedWeekIndex] = useState<number>(0);

  if (!workloadData || workloadData.length === 0) {
    return (
      <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-2">
        <Clock className="w-8 h-8 text-slate-400 mx-auto" />
        <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">No Weekly Schedule Data</h4>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Generate a roadmap to compute weekly workload distribution across your target timeline.
        </p>
      </div>
    );
  }

  const currentItem = workloadData[selectedWeekIndex] || workloadData[0];
  const maxHours = Math.max(weeklyLimit * 1.3, ...workloadData.map(d => d.plannedHours), 20);

  const prevWeek = () => {
    setSelectedWeekIndex(prev => Math.max(0, prev - 1));
  };

  const nextWeek = () => {
    setSelectedWeekIndex(prev => Math.min(workloadData.length - 1, prev + 1));
  };

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Weekly Workload & Study Effort Distribution
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300">
              {workloadData.length} Weeks Scheduled
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Planned study commitments vs tracked completions. Note: Task estimates are planning targets, not rigid timers.
          </p>
        </div>

        {/* Week Stepper Controls */}
        <div className="flex items-center space-x-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={prevWeek}
            disabled={selectedWeekIndex === 0}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 transition-colors"
            aria-label="Previous week"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-850 text-slate-800 dark:text-slate-200">
            Week {currentItem.week}
          </span>
          <button
            type="button"
            onClick={nextWeek}
            disabled={selectedWeekIndex === workloadData.length - 1}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 transition-colors"
            aria-label="Next week"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Selected Week Callout */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-850/60 border border-slate-200/80 dark:border-slate-800">
        <div className="space-y-0.5">
          <span className="text-[11px] font-semibold text-slate-400">Planned Hours (Week {currentItem.week})</span>
          <p className="text-xl font-bold text-brand-600 dark:text-brand-400">
            {currentItem.plannedHours} hrs
          </p>
        </div>
        <div className="space-y-0.5">
          <span className="text-[11px] font-semibold text-slate-400">Completed Effort</span>
          <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
            {currentItem.completedHours} hrs
          </p>
        </div>
        <div className="space-y-0.5">
          <span className="text-[11px] font-semibold text-slate-400">Remaining for Week</span>
          <p className="text-xl font-bold text-slate-800 dark:text-slate-200">
            {Math.max(0, currentItem.plannedHours - currentItem.completedHours)} hrs
          </p>
        </div>
      </div>

      {/* SVG Bar Chart */}
      <div className="space-y-2">
        <div className="h-44 sm:h-52 w-full flex items-end justify-between gap-2 pt-6 pb-2 px-2 border-b border-slate-200 dark:border-slate-800 overflow-x-auto scrollbar-none">
          {workloadData.map((item, idx) => {
            const isSelected = idx === selectedWeekIndex;
            const plannedHeight = (item.plannedHours / maxHours) * 100;
            const completedHeight = (item.completedHours / maxHours) * 100;
            const isOverloaded = item.plannedHours > weeklyLimit;

            return (
              <div
                key={item.week}
                onClick={() => setSelectedWeekIndex(idx)}
                className="flex-1 min-w-[28px] max-w-[56px] h-full flex flex-col justify-end items-center cursor-pointer group transition-all"
              >
                {/* Overload Warning Icon */}
                {isOverloaded && (
                  <span title="Workload exceeds target weekly availability limit" className="mb-1 inline-flex">
                    <AlertTriangle className="w-3 h-3 text-amber-500" />
                  </span>
                )}

                {/* Bars Container */}
                <div className="w-full flex items-end justify-center gap-1 h-full">
                  {/* Planned Bar */}
                  <div
                    className={`w-3 sm:w-4 rounded-t-md transition-all duration-300 ${
                      isSelected
                        ? 'bg-brand-600 ring-2 ring-brand-300 dark:ring-brand-800'
                        : 'bg-brand-400/60 dark:bg-brand-500/40 group-hover:bg-brand-500'
                    }`}
                    style={{ height: `${Math.max(6, plannedHeight)}%` }}
                    title={`Week ${item.week} Planned: ${item.plannedHours} hrs`}
                  />

                  {/* Completed Bar */}
                  <div
                    className={`w-3 sm:w-4 rounded-t-md transition-all duration-300 ${
                      isSelected
                        ? 'bg-emerald-600 ring-2 ring-emerald-300 dark:ring-emerald-800'
                        : 'bg-emerald-400/80 dark:bg-emerald-500/50 group-hover:bg-emerald-500'
                    }`}
                    style={{ height: `${Math.max(item.completedHours > 0 ? 6 : 0, completedHeight)}%` }}
                    title={`Week ${item.week} Completed: ${item.completedHours} hrs`}
                  />
                </div>

                {/* X-Axis Label */}
                <span className={`text-[10px] mt-2 font-bold select-none ${
                  isSelected ? 'text-brand-600 dark:text-brand-400 font-extrabold' : 'text-slate-400'
                }`}>
                  W{item.week}
                </span>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-2">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded-xs bg-brand-500" />
              <span>Planned Target</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded-xs bg-emerald-500" />
              <span>Tracked Completion</span>
            </div>
          </div>
          <span className="text-[11px] text-slate-400">
            Max Budget: {weeklyLimit} hrs/week
          </span>
        </div>
      </div>
    </div>
  );
};
