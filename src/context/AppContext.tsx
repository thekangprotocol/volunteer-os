import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Theme, 
  UserRole, 
  Opportunity, 
  VolunteerPassportData, 
  OrganizerStats, 
  ApplicantRecord,
  NavigationTab,
  NotificationItem,
  ChatThread,
  HourLogEntry,
  UserSettings,
  UserProfile
} from '../types';
import { 
  MOCK_OPPORTUNITIES, 
  MOCK_PASSPORT, 
  MOCK_ORGANIZER_STATS, 
  MOCK_APPLICANTS,
  MOCK_NOTIFICATIONS,
  MOCK_CHAT_THREADS,
  MOCK_HOURS_LOGS,
  MOCK_USER_SETTINGS,
  MOCK_USER_PROFILE
} from '../data/mockData';
import { DEFAULT_AI_FLAGS } from '../services/aiService';

interface AppContextType {
  theme: Theme;
  toggleTheme: () => void;
  role: UserRole;
  setRole: (role: UserRole) => void;
  
  // Auth state
  isAuthenticated: boolean;
  login: (role?: UserRole) => void;
  logout: () => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;

  // View Navigation
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean | ((prev: boolean) => boolean)) => void;

  // Opportunities & Filters
  opportunities: Opportunity[];
  setOpportunities: React.Dispatch<React.SetStateAction<Opportunity[]>>;
  selectedOpportunity: Opportunity | null;
  setSelectedOpportunity: (opp: Opportunity | null) => void;
  toggleSaveOpportunity: (id: string) => void;
  applyOpportunity: (id: string, shiftId?: string) => void;
  addNewOpportunity: (opp: Opportunity) => void;
  updateOpportunity: (id: string, updatedFields: Partial<Opportunity>) => void;
  editingOpportunity: Opportunity | null;
  setEditingOpportunity: (opp: Opportunity | null) => void;
  
  // Volunteer Passport & Profile
  passport: VolunteerPassportData;
  userProfile: UserProfile;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  
  // Organizer Studio
  organizerStats: OrganizerStats;
  applicants: ApplicantRecord[];
  approveApplicant: (id: string) => void;
  
  // Notifications
  notifications: NotificationItem[];
  unreadNotificationsCount: number;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;

  // Messages / Chat
  chatThreads: ChatThread[];
  activeThreadId: string;
  setActiveThreadId: (id: string) => void;
  sendMessage: (threadId: string, text: string) => void;

  // Volunteer Hours Logging
  hoursLogs: HourLogEntry[];
  logManualHours: (entry: {
    opportunityTitle: string;
    organizer: string;
    category: any;
    hours: number;
    date: string;
    supervisorName?: string;
    supervisorEmail?: string;
    notes?: string;
  }) => void;

  // Settings
  userSettings: UserSettings;
  updateUserSettings: (settings: Partial<UserSettings>) => void;

  // AI Feature Flags Architecture
  aiFlags: typeof DEFAULT_AI_FLAGS;
  setAiFlags: React.Dispatch<React.SetStateAction<typeof DEFAULT_AI_FLAGS>>;

  // Command Menu & Modals
  isCommandMenuOpen: boolean;
  setIsCommandMenuOpen: (open: boolean) => void;
  isCreatorModalOpen: boolean;
  setIsCreatorModalOpen: (open: boolean) => void;
  isImportModalOpen: boolean;
  setIsImportModalOpen: (open: boolean) => void;
  isAIModalOpen: boolean;
  setIsAIModalOpen: (open: boolean) => void;

  // Notification Toast
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('dark');
  const [role, setRole] = useState<UserRole>('volunteer');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<NavigationTab>('explore');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  
  const [opportunities, setOpportunities] = useState<Opportunity[]>(MOCK_OPPORTUNITIES);
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
  const [passport, setPassport] = useState<VolunteerPassportData>(MOCK_PASSPORT);
  const [userProfile, setUserProfile] = useState<UserProfile>(MOCK_USER_PROFILE);
  const [organizerStats, setOrganizerStats] = useState<OrganizerStats>(MOCK_ORGANIZER_STATS);
  const [applicants, setApplicants] = useState<ApplicantRecord[]>(MOCK_APPLICANTS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(MOCK_NOTIFICATIONS);
  const [chatThreads, setChatThreads] = useState<ChatThread[]>(MOCK_CHAT_THREADS);
  const [activeThreadId, setActiveThreadId] = useState<string>('thread-1');
  const [hoursLogs, setHoursLogs] = useState<HourLogEntry[]>(MOCK_HOURS_LOGS);
  const [userSettings, setUserSettings] = useState<UserSettings>(MOCK_USER_SETTINGS);
  const [aiFlags, setAiFlags] = useState(DEFAULT_AI_FLAGS);
  
  const [isCommandMenuOpen, setIsCommandMenuOpen] = useState(false);
  const [isCreatorModalOpen, setIsCreatorModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync theme with HTML document class
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
  }, [theme]);

  // Keyboard shortcut for Command Menu (⌘K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandMenuOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    setUserSettings((prev) => ({ ...prev, theme: nextTheme }));
  };

  const login = (selectedRole?: UserRole) => {
    setIsAuthenticated(true);
    if (selectedRole) {
      setRole(selectedRole);
    }
    setIsAuthModalOpen(false);
    setActiveTab(selectedRole === 'organizer' ? 'organizer' : 'explore');
    showToast(`Signed in successfully as ${selectedRole || role}. Welcome to VolunteerOS!`);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setActiveTab('landing');
    showToast('Signed out of VolunteerOS.');
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const toggleSaveOpportunity = (id: string) => {
    setOpportunities((prev) =>
      prev.map((opp) => {
        if (opp.id === id) {
          const nextSaved = !opp.saved;
          showToast(nextSaved ? `Saved "${opp.title}" to saved opportunities.` : `Removed from saved.`);
          return { ...opp, saved: nextSaved };
        }
        return opp;
      })
    );
  };

  const applyOpportunity = (id: string, shiftId?: string) => {
    setOpportunities((prev) =>
      prev.map((opp) => {
        if (opp.id === id) {
          const nextApplied = true;
          showToast(`Successfully registered for "${opp.title}"! Added to your Passport calendar.`);
          
          setPassport((p) => ({
            ...p,
            totalHours: p.totalHours + opp.durationHours,
            eventsCompleted: p.eventsCompleted + 1,
            recentActivities: [
              {
                id: `act-${Date.now()}`,
                opportunityTitle: opp.title,
                organizer: opp.organizer,
                hours: opp.durationHours,
                dateCompleted: 'Just now',
                verificationHash: `vos-hash-0x${Math.random().toString(16).substring(2, 10)}`
              },
              ...p.recentActivities
            ]
          }));

          // Append to hours log as pending verification
          setHoursLogs((prevLogs) => [
            {
              id: `log-${Date.now()}`,
              opportunityTitle: opp.title,
              organizer: opp.organizer,
              category: opp.cause,
              hours: opp.durationHours,
              date: new Date().toISOString().split('T')[0],
              status: 'pending',
              verificationHash: `vos-hash-0x${Math.random().toString(16).substring(2, 10)}`,
              supervisorName: opp.organizer,
              notes: `Registered via VolunteerOS ${shiftId ? `(Shift ${shiftId})` : ''}`
            },
            ...prevLogs
          ]);

          return { ...opp, applied: nextApplied, spotsFilled: opp.spotsFilled + 1 };
        }
        return opp;
      })
    );

    if (selectedOpportunity?.id === id) {
      setSelectedOpportunity((prev) => prev ? { ...prev, applied: true, spotsFilled: prev.spotsFilled + 1 } : null);
    }
  };

  const [editingOpportunity, setEditingOpportunity] = useState<Opportunity | null>(null);

  const addNewOpportunity = (newOpp: Opportunity) => {
    setOpportunities((prev) => [newOpp, ...prev]);
    setOrganizerStats((prev) => ({
      ...prev,
      activeEventsCount: prev.activeEventsCount + 1,
      socialImportsCount: newOpp.source !== 'VolunteerOS Native' ? prev.socialImportsCount + 1 : prev.socialImportsCount
    }));
    showToast(`Published "${newOpp.title}" to VolunteerOS network.`);
  };

  const updateOpportunity = (id: string, updatedFields: Partial<Opportunity>) => {
    setOpportunities((prev) =>
      prev.map((opp) => (opp.id === id ? { ...opp, ...updatedFields } : opp))
    );
    if (selectedOpportunity?.id === id) {
      setSelectedOpportunity((prev) => prev ? { ...prev, ...updatedFields } : null);
    }
    showToast(`Updated opportunity parameters successfully.`);
  };

  const approveApplicant = (applicantId: string) => {
    setApplicants((prev) =>
      prev.map((app) => {
        if (app.id === applicantId) {
          showToast(`Approved ${app.volunteerName}'s hours for ${app.opportunityTitle}.`);
          return { ...app, status: 'approved' };
        }
        return app;
      })
    );
    setOrganizerStats((prev) => ({
      ...prev,
      verifiedHoursGranted: prev.verifiedHoursGranted + 4
    }));
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast('All notifications marked as read.');
  };

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  const sendMessage = (threadId: string, text: string) => {
    if (!text.trim()) return;
    const newMsg = {
      id: `msg-${Date.now()}`,
      senderId: 'me',
      senderName: userProfile.name,
      text: text.trim(),
      timestamp: 'Just now',
      isMe: true
    };
    setChatThreads((prev) =>
      prev.map((t) => {
        if (t.id === threadId) {
          return {
            ...t,
            lastMessage: text,
            lastMessageTime: 'Just now',
            messages: [...t.messages, newMsg]
          };
        }
        return t;
      })
    );
  };

  const logManualHours = (entry: {
    opportunityTitle: string;
    organizer: string;
    category: any;
    hours: number;
    date: string;
    supervisorName?: string;
    supervisorEmail?: string;
    notes?: string;
  }) => {
    const newLog: HourLogEntry = {
      id: `log-${Date.now()}`,
      ...entry,
      status: 'pending',
      verificationHash: `vos-hash-0x${Math.random().toString(16).substring(2, 10)}`
    };
    setHoursLogs((prev) => [newLog, ...prev]);
    showToast(`Logged ${entry.hours} hrs for "${entry.opportunityTitle}". Sent supervisor verification code.`);
  };

  const updateUserSettings = (newSettings: Partial<UserSettings>) => {
    setUserSettings((prev) => ({ ...prev, ...newSettings }));
    showToast('Settings saved successfully.');
  };

  const updateUserProfile = (newProfile: Partial<UserProfile>) => {
    setUserProfile((prev) => ({ ...prev, ...newProfile }));
    showToast('Profile updated successfully.');
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        role,
        setRole,
        isAuthenticated,
        login,
        logout,
        isAuthModalOpen,
        setIsAuthModalOpen,
        activeTab,
        setActiveTab,
        isSidebarOpen,
        setIsSidebarOpen,
        opportunities,
        setOpportunities,
        selectedOpportunity,
        setSelectedOpportunity,
        toggleSaveOpportunity,
        applyOpportunity,
        addNewOpportunity,
        updateOpportunity,
        editingOpportunity,
        setEditingOpportunity,
        passport,
        userProfile,
        updateUserProfile,
        organizerStats,
        applicants,
        approveApplicant,
        notifications,
        unreadNotificationsCount,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        chatThreads,
        activeThreadId,
        setActiveThreadId,
        sendMessage,
        hoursLogs,
        logManualHours,
        userSettings,
        updateUserSettings,
        aiFlags,
        setAiFlags,
        isCommandMenuOpen,
        setIsCommandMenuOpen,
        isCreatorModalOpen,
        setIsCreatorModalOpen,
        isImportModalOpen,
        setIsImportModalOpen,
        isAIModalOpen,
        setIsAIModalOpen,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
