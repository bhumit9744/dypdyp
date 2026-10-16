import React from 'react';
import { useApp } from './context/AppContext';
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

      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-brand-500/20 selection:text-brand-900">
      {/* Top Navbar */}
      <Header />

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
  );
};

export const App: React.FC = () => {
  return <AppContent />;
};

export default App;
