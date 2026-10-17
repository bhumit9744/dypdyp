import React, { useState } from 'react';
import { useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { SubNav } from './components/layout/SubNav';
import { JarvisVoiceAssistant } from './components/jarvis/JarvisVoiceAssistant';

// Dashboard
import { DashboardPage } from './pages/dashboard/DashboardPage';

// My Career Subsections
import { ProfileSubSection } from './pages/career/ProfileSubSection';
import { SkillsSubSection } from './pages/career/SkillsSubSection';
import { AssessmentsSubSection } from './pages/career/AssessmentsSubSection';
import { InterviewStudioSubSection } from './pages/career/InterviewStudioSubSection';
import { AICareerRoadmapPlanner } from './pages/career/AICareerRoadmapPlanner';
import { AICareerGuidance } from './pages/career/AICareerGuidance';
import { ResumeSubSection } from './pages/career/ResumeSubSection';

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
// Integration Center
import { IntegrationCenterPage } from './pages/integrations/IntegrationCenterPage';

// Opportunities Intelligence
import { OpportunitiesPage } from './pages/opportunities/OpportunitiesPage';

// Student Connect
import { StudentConnectPage } from './pages/connect/StudentConnectPage';

export const AppContent: React.FC = () => {
  const { currentSection, currentSubSection } = useApp();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const renderContent = () => {
    switch (currentSection) {
      case 'dashboard':
        return <DashboardPage />;

      case 'integrations':
        return <IntegrationCenterPage />;

      case 'opportunities':
        return <OpportunitiesPage />;

      case 'resume':
        return <ResumeSubSection />;

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

      case 'connect':
        return <StudentConnectPage />;

      default:
        return <DashboardPage />;
    }
  };

  const getSectionTitle = () => {
    switch (currentSection) {
      case 'dashboard': return 'Dashboard';
      case 'integrations': return 'Integrations';
      case 'opportunities': return 'Opportunities';
      case 'connect': return 'Student Connect';
      case 'career': return 'My Career';
      case 'explore': return 'Explore';
      case 'placements': return 'Placements';
      case 'arena': return 'Games';
      case 'resume': return 'Resume Studio';
      default: return 'Placement Hub';
    }
  };

  return (
    <div className="min-h-screen flex bg-canvas-dots text-[#17172B] dark:text-slate-100 font-sans selection:bg-brand-500/20 selection:text-brand-900">
      {/* Side Navigation Section (Permanent on desktop, drawer on mobile) */}
      <Sidebar mobileOpen={mobileSidebarOpen} setMobileOpen={setMobileSidebarOpen} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen overflow-x-hidden">
        {/* Top Navbar Header with Student Connect & All Primary Navigation */}
        <Header onOpenMobileSidebar={() => setMobileSidebarOpen(true)} />

        {/* Dynamic Contextual Sub-Navigation */}
        <SubNav />

        {/* Main Viewport */}
        <main className="flex-1 w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-5 md:py-7">
          {renderContent()}

          {/* Footer */}
          <footer className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-400 dark:text-slate-500">
            <p>
              Placement Hub • PS6 Campus Recruitment & Evidence Intelligence Architecture • D.Y. Patil College of Engineering, Akurdi
            </p>
          </footer>
        </main>
      </div>

      {/* Global Jarvis Voice & Executive Agent (Wake-word, LinkedIn & Mail plugins) */}
      <JarvisVoiceAssistant />
    </div>
  );
};

export const App: React.FC = () => {
  return <AppContent />;
};

export default App;
