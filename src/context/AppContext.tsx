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
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';
import { opportunityService } from '../services/opportunityService';

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
  const [role, setRoleState] = useState<UserRole>('volunteer');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(true);
  const [activeTab, setActiveTabState] = useState<NavigationTab>('landing');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
  const [editingOpportunity, setEditingOpportunity] = useState<Opportunity | null>(null);
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

  // Load opportunities from Supabase database on boot
  useEffect(() => {
    loadOpportunitiesFromDatabase();
  }, []);

  const loadOpportunitiesFromDatabase = async () => {
    const dbOpps = await opportunityService.fetchOpportunities();
    if (dbOpps && dbOpps.length > 0) {
      setOpportunities(dbOpps);
    } else {
      setOpportunities(MOCK_OPPORTUNITIES);
    }
  };

  // Listen for real Supabase session & Google OAuth redirect
  useEffect(() => {
    if (!isSupabaseConfigured) return;

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        handleUserSession(session.user);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        handleUserSession(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleUserSession = async (user: any) => {
    const userMeta = user.user_metadata || {};
    const realName = userMeta.full_name || userMeta.name || user.email?.split('@')[0] || 'Volunteer';
    const realEmail = user.email || '';
    const realAvatar = userMeta.avatar_url || userMeta.picture || '';

    // Check database profile for saved role
    let savedRole: UserRole = 'volunteer';
    const { data: dbProfile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    if (dbProfile?.role) {
      savedRole = dbProfile.role as UserRole;
    }

    setRoleState(savedRole);
    setUserProfile((prev) => ({
      ...prev,
      id: user.id,
      name: realName,
      email: realEmail,
      role: savedRole,
      avatar: realAvatar || prev.avatar,
    }));

    setIsAuthenticated(true);
    setIsAuthModalOpen(false);
    setActiveTabState(savedRole === 'organizer' ? 'organizer' : 'explore');
    
    // Refresh DB opportunities
    loadOpportunitiesFromDatabase();
  };

  // Strict Navigation Tab Setter enforcing Role Access Boundaries
  const setActiveTab = (tab: NavigationTab) => {
    if (role === 'volunteer' && tab === 'organizer') {
      setActiveTabState('explore');
      showToast('Organizer Studio is restricted to Organizer accounts.');
      return;
    }
    if (role === 'organizer' && (tab === 'explore' || tab === 'passport')) {
      setActiveTabState('organizer');
      showToast('Volunteer feed is restricted to Volunteer accounts.');
      return;
    }
    setActiveTabState(tab);
  };

  // Lock Role setting (cannot switch once selected)
  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    setUserProfile((prev) => ({ ...prev, role: newRole }));
  };

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
    const activeRole = selectedRole || role;
    setRoleState(activeRole);
    setIsAuthModalOpen(false);
    setActiveTabState(activeRole === 'organizer' ? 'organizer' : 'explore');
    showToast(`Signed in as ${activeRole}. Welcome to VolunteerOS!`);
  };

  const logout = () => {
    setIsAuthenticated(false);
    if (isSupabaseConfigured) {
      supabase.auth.signOut();
    }
    setActiveTabState('landing');
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
          const isSaved = !opp.saved;
          showToast(isSaved ? 'Saved opportunity to your list.' : 'Removed opportunity from saved list.');
          return { ...opp, saved: isSaved };
        }
        return opp;
      })
    );
  };

  const applyOpportunity = (id: string) => {
    setOpportunities((prev) =>
      prev.map((opp) => {
        if (opp.id === id) {
          if (opp.applied) return opp;
          showToast(`Applied to ${opp.title}!`);
          return { 
            ...opp, 
            applied: true, 
            spotsFilled: Math.min(opp.spotsTotal, opp.spotsFilled + 1) 
          };
        }
        return opp;
      })
    );
  };

  const addNewOpportunity = async (opp: Opportunity) => {
    // 1. Add locally
    setOpportunities((prev) => [opp, ...prev]);
    showToast(`Published opportunity: "${opp.title}"`);

    // 2. Persist to Supabase database so all volunteers see it immediately!
    await opportunityService.createOpportunity(opp, userProfile.id);
  };

  const updateOpportunity = (id: string, updatedFields: Partial<Opportunity>) => {
    setOpportunities((prev) =>
      prev.map((opp) => (opp.id === id ? { ...opp, ...updatedFields } : opp))
    );
    showToast('Updated opportunity successfully.');
  };

  const updateUserProfile = (profile: Partial<UserProfile>) => {
    setUserProfile((prev) => ({ ...prev, ...profile }));
  };

  const approveApplicant = (id: string) => {
    setApplicants((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status: 'approved' } : app))
    );
    showToast('Approved applicant!');
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const sendMessage = (threadId: string, text: string) => {
    setChatThreads((prev) =>
      prev.map((thread) => {
        if (thread.id === threadId) {
          return {
            ...thread,
            lastMessage: text,
            lastMessageTime: 'Just now',
            messages: [
              ...thread.messages,
              {
                id: `msg-${Date.now()}`,
                senderId: userProfile.id,
                senderName: userProfile.name,
                text,
                timestamp: 'Just now',
                isMe: true
              }
            ]
          };
        }
        return thread;
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
      opportunityTitle: entry.opportunityTitle,
      organizer: entry.organizer,
      category: entry.category,
      hours: entry.hours,
      date: entry.date,
      status: 'verified',
      verificationHash: `0x${Math.random().toString(16).substring(2, 10)}${Math.random().toString(16).substring(2, 10)}`,
      supervisorName: entry.supervisorName,
      supervisorEmail: entry.supervisorEmail,
      notes: entry.notes
    };

    setHoursLogs((prev) => [newLog, ...prev]);
    setPassport((prev) => ({
      ...prev,
      totalHours: prev.totalHours + entry.hours,
      verifiedHours: prev.verifiedHours + entry.hours,
      eventsCompleted: prev.eventsCompleted + 1
    }));

    showToast(`Logged ${entry.hours} service hours!`);
  };

  const updateUserSettings = (settings: Partial<UserSettings>) => {
    setUserSettings((prev) => ({ ...prev, ...settings }));
    showToast('Updated preferences.');
  };

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

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
        showToast
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
