import React from 'react';
import { GuidanceProvider, useGuidance } from './guidance/context/GuidanceContext';
import { GuidanceTab } from './guidance/types/guidance';
import { GuidanceHomeTab } from './guidance/components/tabs/GuidanceHomeTab';
import { CareerProfileTab } from './guidance/components/tabs/CareerProfileTab';
import { GuidedDiscoveryTab } from './guidance/components/tabs/GuidedDiscoveryTab';
import { RecommendationsTab } from './guidance/components/tabs/RecommendationsTab';
import { CareerComparisonTab } from './guidance/components/tabs/CareerComparisonTab';
import { SkillGapAnalysisTab } from './guidance/components/tabs/SkillGapAnalysisTab';
import { CareerExperimentsTab } from './guidance/components/tabs/CareerExperimentsTab';
import { CareerDecisionsTab } from './guidance/components/tabs/CareerDecisionsTab';
import { AICounsellorTab } from './guidance/components/tabs/AICounsellorTab';
import { ActionPlanTab } from './guidance/components/tabs/ActionPlanTab';
import { CareerDetailModal } from './guidance/components/modals/CareerDetailModal';
import { ExperimentModal } from './guidance/components/modals/ExperimentModal';

import {
  Sparkles,
  User,
  Compass,
  Lightbulb,
  GitCompare,
  BarChart3,
  FlaskConical,
  Clock,
  Bot,
  CheckSquare,
  Target,
  ArrowRight
} from 'lucide-react';

const AICareerGuidanceContent: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    primaryGoal,
    navigateToRoadmapWithRole,
    comparedRoleIds
  } = useGuidance();

  const TABS: { id: GuidanceTab; label: string; icon: React.ComponentType<{ className?: string }>; badge?: string }[] = [
    { id: 'home', label: 'Guidance Home', icon: Sparkles },
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'discovery', label: 'Guided Discovery', icon: Compass },
    { id: 'recommendations', label: 'Recommendations', icon: Lightbulb, badge: '16 Roles' },
    { id: 'compare', label: 'Compare Options', icon: GitCompare, badge: comparedRoleIds.length ? `${comparedRoleIds.length}` : undefined },
    { id: 'skill-gaps', label: 'Skill-Gap Analysis', icon: BarChart3 },
    { id: 'experiments', label: 'Career Experiments', icon: FlaskConical },
    { id: 'decisions', label: 'My Decisions', icon: Clock },
    { id: 'counsellor', label: 'AI Counsellor', icon: Bot, badge: 'AI Live' },
    { id: 'action-plan', label: 'Action Plan', icon: CheckSquare }
  ];

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'home':
        return <GuidanceHomeTab />;
      case 'profile':
        return <CareerProfileTab />;
      case 'discovery':
        return <GuidedDiscoveryTab />;
      case 'recommendations':
        return <RecommendationsTab />;
      case 'compare':
        return <CareerComparisonTab />;
      case 'skill-gaps':
        return <SkillGapAnalysisTab />;
      case 'experiments':
        return <CareerExperimentsTab />;
      case 'decisions':
        return <CareerDecisionsTab />;
      case 'counsellor':
        return <AICounsellorTab />;
      case 'action-plan':
        return <ActionPlanTab />;
      default:
        return <GuidanceHomeTab />;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 py-4">
      {/* Workspace Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white flex items-center justify-center shadow-md">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                AI Career Guidance & Counselling
              </h1>
              <p className="text-xs text-slate-500">
                Placement Hub • Intelligent Direction, Role Comparison & Skill-Gap Strategy
              </p>
            </div>
          </div>
        </div>

        {/* Primary Goal Banner & Quick Switcher */}
        <div className="flex items-center gap-3">
          {primaryGoal && (
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-xs">
              <Target className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span className="text-slate-600 dark:text-slate-300">Target:</span>
              <span className="font-bold text-indigo-700 dark:text-indigo-300">{primaryGoal.career_title}</span>
            </div>
          )}

          <button
            onClick={() => navigateToRoadmapWithRole(primaryGoal?.career_id || 'role_fullstack')}
            className="px-4 py-2 rounded-2xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 font-semibold text-xs shadow-sm flex items-center gap-1.5 transition-all"
          >
            <Compass className="w-3.5 h-3.5 text-indigo-400 dark:text-indigo-600" />
            <span>Open Roadmap Planner</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Guidance Navigation Ribbon */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 no-scrollbar border-b border-slate-200/80 dark:border-slate-800">
        {TABS.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.badge && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Render Active Sub-View */}
      <main className="transition-all animate-fade-in">
        {renderActiveTab()}
      </main>

      {/* Modals */}
      <CareerDetailModal />
      <ExperimentModal />
    </div>
  );
};

export const AICareerGuidance: React.FC = () => {
  return (
    <GuidanceProvider>
      <AICareerGuidanceContent />
    </GuidanceProvider>
  );
};
