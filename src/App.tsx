import React, { Component, ErrorInfo, ReactNode, useState, useEffect } from 'react';
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
import { OnboardingLocationModal } from './components/auth/OnboardingLocationModal';
import { OpportunityCreatorModal } from './components/organizer/OpportunityCreatorModal';
import { AggregationImportModal } from './components/organizer/AggregationImportModal';
import { CommandMenu } from './components/common/CommandMenu';
import { AISmartAssistantModal } from './components/ai/AISmartAssistantModal';
import { Toast } from './components/common/Toast';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught VolunteerOS Error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center p-6">
          <div className="max-w-md w-full p-8 rounded-3xl bg-zinc-900 border border-zinc-800 text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold">VolunteerOS Recovery</h2>
            <p className="text-xs text-zinc-400 leading-relaxed">
              {this.state.error?.message || "An unexpected error occurred. The application remains protected."}
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="w-full py-3 px-4 rounded-2xl bg-white text-zinc-950 font-extrabold text-xs flex items-center justify-center gap-2 hover:bg-zinc-200 transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reload Application</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const MainLayout: React.FC = () => {
  const { activeTab, theme, isSidebarOpen, isAuthenticated, userProfile } = useApp();
  const isDark = theme === 'dark';
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);

  // Trigger onboarding modal after sign-in if location is not configured
  useEffect(() => {
    if (isAuthenticated) {
      const hasConfiguredLocation = localStorage.getItem('volunteer_os_location_configured');
      if (!hasConfiguredLocation) {
        setIsOnboardingOpen(true);
      }
    }
  }, [isAuthenticated]);

  const handleCloseOnboarding = () => {
    localStorage.setItem('volunteer_os_location_configured', 'true');
    setIsOnboardingOpen(false);
  };

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
      <OnboardingLocationModal
        isOpen={isOnboardingOpen}
        onClose={handleCloseOnboarding}
      />
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
    <ErrorBoundary>
      <AppProvider>
        <MainLayout />
      </AppProvider>
    </ErrorBoundary>
  );
}

export default App;
