export type UserRole = 'volunteer' | 'organizer';
export type Theme = 'dark' | 'light';

export type CauseCategory = 
  | 'Food Security' 
  | 'Tech Education' 
  | 'Disaster Relief' 
  | 'Environmental' 
  | 'Crisis Support' 
  | 'Animal Welfare' 
  | 'Senior Care'
  | 'Arts & Culture';

export type VenueType = 'In-Person' | 'Remote' | 'Hybrid';

export type SourcePlatform = 
  | 'Facebook' 
  | 'Instagram' 
  | 'City Portal' 
  | 'School Network' 
  | 'Direct Non-Profit' 
  | 'VolunteerOS Native';

export interface Shift {
  id: string;
  time: string;
  date: string;
  spotsTotal: number;
  spotsFilled: number;
}

export interface Opportunity {
  id: string;
  title: string;
  organizer: string;
  organizerLogo?: string;
  organizerVerified: boolean;
  cause: CauseCategory;
  venueType: VenueType;
  location: string;
  distance: string;
  date: string;
  time: string;
  durationHours: number;
  spotsTotal: number;
  spotsFilled: number;
  description: string;
  impactSummary: string;
  requirements: string[];
  requiredAge?: string;
  skills?: string[];
  itemsToBring?: string[];
  contactInfo?: { name: string; email: string; phone?: string };
  bannerImage?: string;
  shifts: Shift[];
  source: SourcePlatform;
  sourceUrl?: string;
  aiMatchScore?: number;
  aiMatchReason?: string;
  saved?: boolean;
  applied?: boolean;
  status: 'active' | 'upcoming' | 'completed';
}

export interface Badge {
  id: string;
  title: string;
  dateEarned: string;
  category: CauseCategory;
  description: string;
  hoursRequired: number;
}

export interface VerifiedActivity {
  id: string;
  opportunityTitle: string;
  organizer: string;
  hours: number;
  dateCompleted: string;
  verificationHash: string;
}

export interface VolunteerPassportData {
  name: string;
  handle: string;
  joinDate: string;
  totalHours: number;
  impactScore: number;
  eventsCompleted: number;
  badges: Badge[];
  recentActivities: VerifiedActivity[];
}

export interface OrganizerStats {
  activeEventsCount: number;
  totalApplicantsCount: number;
  verifiedHoursGranted: number;
  socialImportsCount: number;
}

export interface ApplicantRecord {
  id: string;
  volunteerName: string;
  volunteerEmail: string;
  opportunityId: string;
  opportunityTitle: string;
  appliedDate: string;
  hoursClaimed: number;
  status: 'pending' | 'approved' | 'checked_in' | 'rejected';
}

export type NavigationTab = 
  | 'landing' 
  | 'explore' 
  | 'passport' 
  | 'organizer' 
  | 'hours' 
  | 'calendar' 
  | 'saved' 
  | 'messages' 
  | 'notifications' 
  | 'profile' 
  | 'settings';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'shift' | 'approval' | 'message' | 'system';
  linkTab?: NavigationTab;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  text: string;
  timestamp: string;
  isMe: boolean;
}

export interface ChatThread {
  id: string;
  title: string;
  subtitle?: string;
  avatar?: string;
  type: 'direct' | 'channel';
  unreadCount: number;
  lastMessage: string;
  lastMessageTime: string;
  messages: ChatMessage[];
}

export interface HourLogEntry {
  id: string;
  opportunityTitle: string;
  organizer: string;
  category: CauseCategory;
  hours: number;
  date: string;
  status: 'verified' | 'pending' | 'rejected';
  verificationHash: string;
  supervisorName?: string;
  supervisorEmail?: string;
  notes?: string;
}

export interface UserSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsAlerts: boolean;
  publicProfile: boolean;
  showHoursOnPassport: boolean;
  theme: Theme;
  language: string;
  linkedPlatforms: {
    facebook: boolean;
    instagram: boolean;
    linkedin: boolean;
  };
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio: string;
  location: string;
  role: UserRole;
  skills: string[];
  causes: CauseCategory[];
  organizationName?: string;
  organizationWebsite?: string;
}

// --- AI BACKEND ARCHITECTURE & FEATURE FLAGS TYPES ---

export interface AIFeatureFlags {
  enablePersonalizedRecommendations: boolean;
  enableAutomaticAssignment: boolean;
  enableNoShowPrediction: boolean;
  enableAIDescriptionGeneration: boolean;
  enableMultiFactorMatching: boolean;
}

export interface MultiFactorMatchBreakdown {
  totalScore: number;
  skillsScore: number;
  historyScore: number;
  reliabilityScore: number;
  locationScore: number;
  availabilityScore: number;
  interestScore: number;
  matchReason: string;
  recommendedRole?: string;
}

export interface NoShowRiskPrediction {
  volunteerId: string;
  shiftId: string;
  riskScore: number; // 0.0 - 1.0
  riskLevel: 'low' | 'medium' | 'high';
  confidence: number; // 0 - 100
  contributingFactors: string[];
  recommendedMitigation?: string;
}

export interface GeneratedEventCopy {
  title: string;
  description: string;
  impactSummary: string;
  suggestedRequirements: string[];
  suggestedSkills: string[];
  suggestedItemsToBring: string[];
}

export interface AutoAssignmentResult {
  opportunityId: string;
  assignedVolunteers: Array<{
    volunteerId: string;
    volunteerName: string;
    matchScore: number;
    assignedShiftId: string;
    assignmentReason: string;
  }>;
  waitlistedVolunteers: string[];
  unassignedCount: number;
}


