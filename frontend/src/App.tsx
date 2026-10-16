import React from 'react';
import { useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { SubNav } from './components/layout/SubNav';

// Dashboard
import { DashboardPage } from './pages/dashboard/DashboardPage';

// My Career Subsections
import { ProfileSubSection } from './pages/career/ProfileSubSection';
import { SkillsSubSection } from './pages/career/SkillsSubSection';
import { ResumeSubSection } from './pages/career/ResumeSubSection';
import { AssessmentsSubSection } from './pages/career/AssessmentsSubSection';
import { CareerPrepSubSection } from './pages/career/CareerPrepSubSection';

// Explore Subsections
import { JobsSubSection } from './pages/explore/JobsSubSection';
import { CompaniesSubSection } from './pages/explore/CompaniesSubSection';
import { AlumniSubSection } from './pages/explore/AlumniSubSection';
import { ReferralsSubSection } from './pages/explore/ReferralsSubSection';

// Placements Subsections
import { ApplicationsSubSection } from './pages/placements/ApplicationsSubSection';
import { TrackerSubSection } from './pages/placements/TrackerSubSection';
import { ShortlistsSubSection } from './pages/placements/ShortlistsSubSection';
import { InterviewsSubSection } from './pages/placements/InterviewsSubSection';

export const AppContent: React.FC = () => {
  const { currentSection, currentSubSection } = useApp();

  const renderContent = () => {
    switch (currentSection) {
      case 'dashboard':
        return <DashboardPage />;

      case 'career':
        switch (currentSubSection) {
          case 'skills':
            return <SkillsSubSection />;
          case 'resume':
            return <ResumeSubSection />;
          case 'assessments':
            return <AssessmentsSubSection />;
          case 'career-prep':
            return <CareerPrepSubSection />;
          case 'profile':
          default:
            return <ProfileSubSection />;
        }

      case 'explore':
        switch (currentSubSection) {
          case 'companies':
            return <CompaniesSubSection />;
          case 'alumni':
            return <AlumniSubSection />;
          case 'referrals':
            return <ReferralsSubSection />;
          case 'jobs':
          default:
            return <JobsSubSection />;
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

      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans">
      {/* Collapsible Left Navigation Bar */}
      <Sidebar />

      {/* Main Right Content Panel */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <Header />

        {/* Dynamic Contextual Sub-Navigation */}
        <SubNav />

        {/* Scrollable Viewport */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-50/60 dark:bg-slate-950">
          {renderContent()}

          {/* Footer note */}
          <footer className="mt-12 pt-6 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-400 dark:text-slate-500">
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
