import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { Footer } from './components/layout/Footer';

import { LandingPage } from './components/pages/LandingPage';
import { OpportunityFeedView } from './components/pages/OpportunityFeedView';
import { VolunteerPassport } from './components/volunteer/VolunteerPassport';
import { OrganizerStudio } from './components/organizer/OrganizerStudio';
import { VolunteerHoursView } from './components/pages/VolunteerHoursView';
import { CalendarView } from './components/pages/CalendarView';
import { SavedOpportunitiesView } from './components/pages/SavedOpportunitiesView';
import { MessagesView } from './components/pages/MessagesView';
import { NotificationsView } from './components/pages/NotificationsView';
import { ProfileView } from './components/pages/ProfileView';
import { SettingsView } from './components/pages/SettingsView';

import { AuthModal } from './components/auth/AuthModal';
import { OpportunityCreatorModal } from './components/organizer/OpportunityCreatorModal';
import { AggregationImportModal } from './components/organizer/AggregationImportModal';
import { CommandMenu } from './components/common/CommandMenu';
import { AISmartAssistantModal } from './components/ai/AISmartAssistantModal';
import { Toast } from './components/common/Toast';

const MainLayout: React.FC = () => {
  const { activeTab, theme, isSidebarOpen, isAuthenticated } = useApp();
  const isDark = theme === 'dark';

  const renderActiveView = () => {
    switch (activeTab) {
      case 'landing':
        return <LandingPage />;
      case 'explore':
        return <OpportunityFeedView />;
      case 'passport':
        return <VolunteerPassport />;
      case 'organizer':
        return <OrganizerStudio />;
      case 'hours':
        return <VolunteerHoursView />;
      case 'calendar':
        return <CalendarView />;
      case 'saved':
        return <SavedOpportunitiesView />;
      case 'messages':
        return <MessagesView />;
      case 'notifications':
        return <NotificationsView />;
      case 'profile':
        return <ProfileView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <OpportunityFeedView />;
    }
  };

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-500 font-sans ${
      isDark ? 'bg-zinc-950 text-white' : 'bg-zinc-50 text-zinc-950'
    }`}>
      {/* Floating Apple-Style Header Navbar */}
      <Navbar />

      {/* Notion-Style Collapsible Sidebar */}
      {isAuthenticated && <Sidebar />}

      {/* Main Content Area */}
      <main className={`flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 transition-all duration-300 ${
        isAuthenticated && isSidebarOpen ? 'md:pl-64' : 'md:pl-8'
      }`}>
        {renderActiveView()}
      </main>

      {/* Minimalist Footer */}
      <Footer />

      {/* Global Modals & Notifications */}
      <AuthModal />
      <OpportunityCreatorModal />
      <AggregationImportModal />
      <CommandMenu />
      <AISmartAssistantModal />
      <Toast />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}

export default App;
