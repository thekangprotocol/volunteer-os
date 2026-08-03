import { 
  Opportunity, 
  VolunteerPassportData, 
  OrganizerStats, 
  ApplicantRecord,
  NotificationItem,
  ChatThread,
  HourLogEntry,
  UserSettings,
  UserProfile
} from '../types';

/**
 * Clean Production State - No fake opportunities or simulated profiles.
 * Users create their own real opportunities, log hours, and manage real applications.
 */

export const MOCK_OPPORTUNITIES: Opportunity[] = [];

export const MOCK_PASSPORT: VolunteerPassportData = {
  name: 'New Volunteer',
  handle: '@volunteer',
  joinDate: 'August 2026',
  totalHours: 0,
  impactScore: 0,
  eventsCompleted: 0,
  badges: [],
  recentActivities: []
};

export const MOCK_ORGANIZER_STATS: OrganizerStats = {
  activeEventsCount: 0,
  totalApplicantsCount: 0,
  verifiedHoursGranted: 0,
  socialImportsCount: 0
};

export const MOCK_APPLICANTS: ApplicantRecord[] = [];

export const MOCK_NOTIFICATIONS: NotificationItem[] = [];

export const MOCK_CHAT_THREADS: ChatThread[] = [];

export const MOCK_HOURS_LOGS: HourLogEntry[] = [];

export const MOCK_USER_SETTINGS: UserSettings = {
  emailNotifications: true,
  pushNotifications: true,
  smsAlerts: false,
  publicProfile: true,
  showHoursOnPassport: true,
  theme: 'dark',
  language: 'English',
  linkedPlatforms: {
    facebook: false,
    instagram: false,
    linkedin: false
  }
};

export const MOCK_USER_PROFILE: UserProfile = {
  id: 'user-fresh',
  name: 'New User',
  email: 'user@example.com',
  bio: 'Community volunteer on VolunteerOS protocol.',
  location: 'San Francisco, CA',
  role: 'volunteer',
  skills: [],
  causes: ['Food Security', 'Tech Education']
};
