import React, { useState } from 'react';
import {
  Trophy,
  CheckCircle2,
  Circle,
  Flame,
  ArrowRight,
  Share2,
  Sparkles,
  Award,
  Target,
  Clock,
  CheckSquare,
  Square,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { ConnectChallenge, ConnectSharedGoal, ConnectBadge } from '../../../types';

interface ChallengesTabProps {
  challenges: ConnectChallenge[];
  sharedGoals: ConnectSharedGoal[];
  badges: ConnectBadge[];
  onToggleJoinChallenge: (challengeId: string) => void;
  onToggleTask: (challengeId: string, taskId: string) => void;
  onToggleGoal: (goalId: string) => void;
  onShareWinToFeed: (challengeTitle: string, badgeName: string) => void;
}

export const ChallengesTab: React.FC<ChallengesTabProps> = ({
  challenges,
  sharedGoals,
  badges,
  onToggleJoinChallenge,
  onToggleTask,
  onToggleGoal,
  onShareWinToFeed
}) => {
  const [selectedChallengeId, setSelectedChallengeId] = useState<string>(challenges[0]?.id || 'ch-7day-dsa');

  const selectedChallenge = challenges.find((c) => c.id === selectedChallengeId) || challenges[0];

  return (
    <div className="space-y-6">
      {/* Top Banner: Challenges & Consistency Motivation */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-900/60 p-6 sm:p-7 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              Community Sprints & Progress
            </span>
            <span className="text-xs text-indigo-200/70">
              • Practice Together • Stay Accountable
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
            Build unshakeable placement muscle memory one day at a time.
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Follow structured daily tasks alongside hundreds of peers. Mark off tasks, unlock genuine participation badges, and celebrate your wins in the community feed.
          </p>
        </div>
      </div>

      {/* Main Grid: Left 8 cols (Selected Challenge Workspace) + Right 4 cols (Goals & Badges) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Challenge Picker & Active Sprint Workspace */}
        <div className="lg:col-span-8 space-y-5">
          {/* Challenge Selector Tabs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {challenges.map((ch) => {
              const isSelected = selectedChallenge?.id === ch.id;
              return (
                <button
                  key={ch.id}
                  onClick={() => setSelectedChallengeId(ch.id)}
                  className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-white dark:bg-slate-800/90 border-brand-500 dark:border-brand-400 shadow-md ring-1 ring-brand-500'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                        {ch.duration_days} Days • {ch.difficulty}
                      </span>
                      {ch.is_joined && (
                        <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.2 rounded-md">
                          Enrolled
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white leading-snug line-clamp-1">
                      {ch.title}
                    </p>
                  </div>

                  {/* Progress bar */}
                  <div className="pt-2 mt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
                    <span>{ch.completed_tasks_count}/{ch.tasks.length} tasks</span>
                    <span className="font-bold text-brand-600 dark:text-brand-400">{ch.percent_complete}%</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Challenge Detailed Checklist Workspace */}
          {selectedChallenge && (
            <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 space-y-6 shadow-xs">
              {/* Challenge Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300 text-[11px] font-bold border border-brand-200/60">
                      {selectedChallenge.category}
                    </span>
                    <span className="text-xs text-slate-500">
                      • {selectedChallenge.participants_count} students participating
                    </span>
                  </div>
                  <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                    {selectedChallenge.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    {selectedChallenge.description}
                  </p>
                </div>

                <div className="shrink-0">
                  <button
                    onClick={() => onToggleJoinChallenge(selectedChallenge.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      selectedChallenge.is_joined
                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                        : 'bg-brand-600 hover:bg-brand-500 text-white shadow-xs shadow-brand-600/30'
                    }`}
                  >
                    {selectedChallenge.is_joined ? 'Joined (Enrolled)' : '+ Join Challenge'}
                  </button>
                </div>
              </div>

              {/* Progress Bar & Reward Callout */}
              <div className="space-y-2 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    Your Sprint Progress
                  </span>
                  <span className="font-extrabold text-brand-600 dark:text-brand-400">
                    {selectedChallenge.completed_tasks_count} of {selectedChallenge.tasks.length} Complete ({selectedChallenge.percent_complete}%)
                  </span>
                </div>

                <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-brand-600 to-indigo-600 transition-all duration-300 rounded-full"
                    style={{ width: `${selectedChallenge.percent_complete}%` }}
                  />
                </div>

                {/* 100% Celebration Banner */}
                {selectedChallenge.percent_complete === 100 && (
                  <div className="mt-3 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-xs text-emerald-900 dark:text-emerald-300">
                      <Sparkles className="w-4 h-4 text-emerald-600" />
                      <span className="font-bold">
                        Challenge Finished! Badge Unlocked: "{selectedChallenge.reward_badge}"
                      </span>
                    </div>

                    <button
                      onClick={() =>
                        onShareWinToFeed(selectedChallenge.title, selectedChallenge.reward_badge)
                      }
                      className="px-3 py-1 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-500 flex items-center space-x-1"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Share Win to Feed</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Daily Checklist Tasks */}
              <div className="space-y-3">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                  Daily Tasks & Action Checklist
                </h4>

                <div className="space-y-2.5">
                  {selectedChallenge.tasks.map((task) => {
                    return (
                      <div
                        key={task.id}
                        onClick={() => onToggleTask(selectedChallenge.id, task.id)}
                        className={`p-3.5 rounded-xl border transition-all flex items-start space-x-3 cursor-pointer ${
                          task.is_completed
                            ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/40'
                            : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <button
                          type="button"
                          className="shrink-0 mt-0.5 text-slate-400 hover:text-emerald-600 transition-colors"
                        >
                          {task.is_completed ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100 dark:fill-emerald-950" />
                          ) : (
                            <Circle className="w-5 h-5" />
                          )}
                        </button>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <span className="text-[10px] font-extrabold uppercase tracking-wider px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                              Day {task.day}
                            </span>
                            <span
                              className={`text-xs font-bold leading-snug ${
                                task.is_completed
                                  ? 'line-through text-slate-400 dark:text-slate-500'
                                  : 'text-slate-900 dark:text-white'
                              }`}
                            >
                              {task.title}
                            </span>
                          </div>

                          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                            {task.description}
                          </p>

                          {task.resource_hint && (
                            <div className="mt-1 text-[11px] text-brand-600 dark:text-brand-400 font-medium">
                              💡 Tip: {task.resource_hint}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Shared Weekly Goals & Student Recognition Badges */}
        <div className="lg:col-span-4 space-y-5">
          {/* Shared Goals Widget */}
          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Target className="w-4 h-4 text-brand-600" />
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  Shared Weekly Goals
                </h4>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                Current Week
              </span>
            </div>

            <p className="text-xs text-slate-500 leading-snug">
              Optional targets to stay consistent alongside your batchmates.
            </p>

            <div className="space-y-2">
              {sharedGoals.map((goal) => {
                return (
                  <div
                    key={goal.id}
                    onClick={() => onToggleGoal(goal.id)}
                    className="flex items-start space-x-2.5 p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer transition-colors"
                  >
                    <button type="button" className="shrink-0 mt-0.5">
                      {goal.is_completed ? (
                        <CheckSquare className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-400" />
                      )}
                    </button>

                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-xs font-semibold leading-snug ${
                          goal.is_completed
                            ? 'line-through text-slate-400'
                            : 'text-slate-800 dark:text-slate-200'
                        }`}
                      >
                        {goal.title}
                      </p>
                      <span className="text-[10px] text-slate-400">
                        {goal.current_count}/{goal.target_count} • {goal.category}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Student Recognition Badges */}
          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 space-y-4 shadow-xs">
            <div className="flex items-center space-x-2">
              <Award className="w-4 h-4 text-amber-500" />
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                Participation Badges
              </h4>
            </div>

            <p className="text-xs text-slate-500 leading-snug">
              Earned through genuine consistency and helping classmates.
            </p>

            <div className="space-y-3">
              {badges.map((badge) => {
                return (
                  <div
                    key={badge.id}
                    className={`p-3 rounded-xl border flex items-start space-x-3 ${
                      badge.unlocked
                        ? 'bg-amber-50/40 dark:bg-amber-950/20 border-amber-200/80 dark:border-amber-900/40'
                        : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 opacity-60'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                        badge.unlocked
                          ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300'
                          : 'bg-slate-200 text-slate-500 dark:bg-slate-700'
                      }`}
                    >
                      <Trophy className="w-4 h-4" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          {badge.name}
                        </span>
                        {badge.unlocked && (
                          <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                            Unlocked
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                        {badge.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Note on genuine participation vs technical verification */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-start space-x-2 text-[11px] text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-brand-600 shrink-0 mt-0.5" />
              <span>
                Recognition badges celebrate community peer learning and consistency, distinct from formal technical verification.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
