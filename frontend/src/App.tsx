import React, { useState } from 'react';
import { useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { SubNav } from './components/layout/SubNav';
import { Menu } from 'lucide-react';

// Dashboard
import { DashboardPage } from './pages/dashboard/DashboardPage';

// My Career Subsections
import { ProfileSubSection } from './pages/career/ProfileSubSection';
import { SkillsSubSection } from './pages/career/SkillsSubSection';
import { AssessmentsSubSection } from './pages/career/AssessmentsSubSection';
import { InterviewStudioSubSection } from './pages/career/InterviewStudioSubSection';
import { AICareerRoadmapPlanner } from './pages/career/AICareerRoadmapPlanner';
import { AICareerGuidance } from './pages/career/AICareerGuidance';

// Explore Subsections (6 Modules)
import { JobsInternshipsSubSection } from './pages/explore/JobsInternshipsSubSection';
import { CompaniesSubSection } from './pages/explore/CompaniesSubSection';
import { StartupsSubSection } from './pages/explore/StartupsSubSection';
import { PeopleReferralsSubSection } from './pages/explore/PeopleReferralsSubSection';
import { ProgramsChallengesSubSection } from './pages/explore/ProgramsChallengesSubSection';
import { ProjectsFreelanceSubSection } from './pages/explore/ProjectsFreelanceSubSection';

// Placements Subsections
import { ApplicationsSubSection } from './pages/placements/ApplicationsSubSection';
import { TrackerSubSection } from './pages/placements/TrackerSubSection';
import { ShortlistsSubSection } from './pages/placements/ShortlistsSubSection';
import { InterviewsSubSection } from './pages/placements/InterviewsSubSection';

// Tech Arena / Games
import { TechArenaPage } from './pages/arena/TechArenaPage';

export const AppContent: React.FC = () => {
  const { currentSection, currentSubSection } = useApp();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const renderContent = () => {
    switch (currentSection) {
      case 'dashboard':
        return <DashboardPage />;

      case 'career':
        switch (currentSubSection) {
          case 'career-guidance':
            return <AICareerGuidance />;
          case 'career-roadmap':
            return <AICareerRoadmapPlanner />;
          case 'skills':
            return <SkillsSubSection />;
          case 'assessments':
            return <AssessmentsSubSection />;
          case 'interview-studio':
            return <InterviewStudioSubSection />;
          case 'profile':
          default:
            return <ProfileSubSection />;
        }

      case 'explore':
        switch (currentSubSection) {
          case 'companies':
            return <CompaniesSubSection />;
          case 'startups':
            return <StartupsSubSection />;
          case 'people-referrals':
          case 'alumni':
          case 'referrals':
            return <PeopleReferralsSubSection />;
          case 'programs-challenges':
            return <ProgramsChallengesSubSection />;
          case 'projects-freelance':
            return <ProjectsFreelanceSubSection />;
          case 'jobs-internships':
          case 'jobs':
          default:
            return <JobsInternshipsSubSection />;
        }

      case 'placements':
        switch (currentSubSection) {
          case 'tracker':
            return <TrackerSubSection />;
          case 'shortlists':
            return <ShortlistsSubSection />;
          case 'interviews':
            return <InterviewsSubSection />;
          case 'applications':
          default:
            return <ApplicationsSubSection />;
        }

      case 'arena':
        return <TechArenaPage />;

      default:
        return <DashboardPage />;
    }
  };

  const getSectionTitle = () => {
    switch (currentSection) {
      case 'dashboard': return 'Dashboard';
      case 'career': return 'My Career';
      case 'explore': return 'Explore';
      case 'placements': return 'Placements';
      case 'arena': return 'Games';
      default: return 'Placement Hub';
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-brand-500/20 selection:text-brand-900">
      {/* Side Navigation Section (Permanent on desktop, drawer on mobile) */}
      <Sidebar mobileOpen={mobileSidebarOpen} setMobileOpen={setMobileSidebarOpen} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen overflow-x-hidden">
        {/* Mobile Header Bar (Only visible on small viewports to open side navigation) */}
        <div className="md:hidden flex items-center justify-between h-14 px-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="p-1.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Open side navigation"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="font-extrabold text-sm text-slate-900 dark:text-white">
              Placement Hub
            </span>
          </div>

          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300 border border-brand-200/60">
            {getSectionTitle()}
          </span>
        </div>

        {/* Dynamic Contextual Sub-Navigation */}
        <SubNav />

        {/* Main Viewport */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
          {renderContent()}

          {/* Footer */}
          <footer className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-400 dark:text-slate-500">
            <p>
              Placement Hub • PS6 Campus Recruitment & Evidence Intelligence Architecture • D.Y. Patil College of Engineering, Akurdi
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
};

export const App: React.FC = () => {
  return <AppContent />;
};

export default App;
