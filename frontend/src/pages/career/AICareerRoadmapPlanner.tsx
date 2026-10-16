import React, { useState } from 'react';
import { RoadmapProvider, useRoadmap } from './roadmap/context/RoadmapContext';
import { RoadmapOverviewTab } from './roadmap/components/tabs/RoadmapOverviewTab';
import { LearningJourneyTab } from './roadmap/components/tabs/LearningJourneyTab';
import { CareerSelectionTab } from './roadmap/components/tabs/CareerSelectionTab';
import { ResourceLibraryTab } from './roadmap/components/tabs/ResourceLibraryTab';
import { ProjectMilestonesTab } from './roadmap/components/tabs/ProjectMilestonesTab';
import { ProgressAnalyticsTab } from './roadmap/components/tabs/ProgressAnalyticsTab';
import { AIAssistantTab } from './roadmap/components/tabs/AIAssistantTab';
import { CareerDetailModal } from './roadmap/components/CareerDetailModal';
import { RoadmapSetupWizard } from './roadmap/components/RoadmapSetupWizard';
import { TaskDetailModal } from './roadmap/components/TaskDetailModal';
import { DiagnosticModal } from './roadmap/components/DiagnosticModal';
import { TimeManagementModal } from './roadmap/components/TimeManagementModal';
import { CareerTrack } from './roadmap/types/roadmap';
import {
  Compass,
  Layers,
  BookOpen,
  Target,
  BarChart3,
  Bot,
  Sliders,
  PlusCircle,
  Sparkles,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

const RoadmapContent: React.FC = () => {
  const {
    roadmap,
    activeTab,
    setActiveTab,
    selectedTrackForPreview,
    setSelectedTrackForPreview,
    selectedTaskForDetail,
    setSelectedTaskForDetail,
    diagnosticSkill,
    setDiagnosticSkill,
    resources,
    updateTaskStatus,
    toggleSaveResource,
    completeDiagnostic,
    generateRoadmap,
    isGenerating
  } = useRoadmap();

  // Modal toggles
  const [isSetupWizardOpen, setIsSetupWizardOpen] = useState<boolean>(false);
  const [selectedTrackForSetup, setSelectedTrackForSetup] = useState<CareerTrack | null>(null);
  const [isTimeModalOpen, setIsTimeModalOpen] = useState<boolean>(false);

  const handleOpenSetup = (track: CareerTrack | null) => {
    setSelectedTrackForSetup(track);
    setIsSetupWizardOpen(true);
  };

  const handleWizardGenerate = async (prefs: any) => {
    await generateRoadmap(prefs);
    setIsSetupWizardOpen(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Workspace Header */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300 flex items-center gap-1 border border-brand-200/60">
              <Sparkles className="w-3 h-3 text-brand-500" />
              AI Career Roadmap Planner
            </span>
            <span className="text-xs text-slate-400">My Career • Placement Hub</span>
          </div>

          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            Personalized Career Learning Journey
          </h1>

          <p className="text-xs text-slate-500 max-w-xl leading-relaxed">
            Phased technical curricula, verified documentation links, project milestone proofs, and AI schedule adaptation.
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center space-x-2.5 self-start md:self-center">
          {roadmap && (
            <button
              type="button"
              onClick={() => setIsTimeModalOpen(true)}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-850 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors flex items-center space-x-1.5"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Time & Pace</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => handleOpenSetup(null)}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-md shadow-brand-600/20 transition-all flex items-center space-x-1.5"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>{roadmap ? 'Change / Reconfigure' : 'Create Roadmap'}</span>
          </button>
        </div>
      </div>

      {/* Workspace Inner Navigation Tabs */}
      <div className="flex items-center overflow-x-auto space-x-2 p-1.5 rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/90 dark:border-slate-800 shadow-xs scrollbar-none sticky top-14 md:top-12 z-20">
        {[
          { id: 'overview' as const, label: 'Roadmap Overview', icon: Compass },
          { id: 'journey' as const, label: 'My Learning Journey', icon: Layers, badge: roadmap ? `${roadmap.phases.length} Phases` : undefined },
          { id: 'explore-careers' as const, label: 'Choose Your Career', icon: Target },
          { id: 'projects' as const, label: 'Project Milestones', icon: CheckCircle2, badge: roadmap ? `${roadmap.projects.length}` : undefined },
          { id: 'resources' as const, label: 'Resource Library', icon: BookOpen, badge: `${resources.length}` },
          { id: 'analytics' as const, label: 'Progress Analytics', icon: BarChart3 },
          { id: 'assistant' as const, label: 'AI Copilot', icon: Bot, isAi: true }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                isActive
                  ? 'bg-brand-600 text-white shadow-xs shadow-brand-600/30'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : tab.isAi ? 'text-brand-500' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
              {tab.badge && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                    isActive
                      ? 'bg-white/25 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Active Tab View */}
      <div className="transition-opacity duration-200">
        {activeTab === 'overview' && (
          <RoadmapOverviewTab onOpenTimeManagement={() => setIsTimeModalOpen(true)} />
        )}

        {activeTab === 'journey' && <LearningJourneyTab />}

        {activeTab === 'explore-careers' && (
          <CareerSelectionTab
            onOpenTrackDetail={track => setSelectedTrackForPreview(track)}
            onSelectTrackForSetup={track => handleOpenSetup(track)}
          />
        )}

        {activeTab === 'projects' && <ProjectMilestonesTab />}

        {activeTab === 'resources' && <ResourceLibraryTab />}

        {activeTab === 'analytics' && <ProgressAnalyticsTab />}

        {activeTab === 'assistant' && (
          <AIAssistantTab onRequestDiagnostic={skill => setDiagnosticSkill(skill)} />
        )}
      </div>

      {/* Modals */}
      {selectedTrackForPreview && (
        <CareerDetailModal
          track={selectedTrackForPreview}
          onClose={() => setSelectedTrackForPreview(null)}
          onSelectTrack={track => handleOpenSetup(track)}
        />
      )}

      {isSetupWizardOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto">
          <div className="w-full my-8">
            <RoadmapSetupWizard
              initialTrack={selectedTrackForSetup}
              onGenerate={handleWizardGenerate}
              onCancel={() => setIsSetupWizardOpen(false)}
              isGenerating={isGenerating}
            />
          </div>
        </div>
      )}

      {selectedTaskForDetail && (
        <TaskDetailModal
          task={selectedTaskForDetail}
          resources={resources}
          onClose={() => setSelectedTaskForDetail(null)}
          onUpdateStatus={updateTaskStatus}
          onToggleSaveResource={toggleSaveResource}
        />
      )}

      {diagnosticSkill && (
        <DiagnosticModal
          skillName={diagnosticSkill}
          onClose={() => setDiagnosticSkill(null)}
          onComplete={completeDiagnostic}
        />
      )}

      {isTimeModalOpen && (
        <TimeManagementModal onClose={() => setIsTimeModalOpen(false)} />
      )}
    </div>
  );
};

export const AICareerRoadmapPlanner: React.FC = () => {
  return (
    <RoadmapProvider>
      <RoadmapContent />
    </RoadmapProvider>
  );
};

export default AICareerRoadmapPlanner;
