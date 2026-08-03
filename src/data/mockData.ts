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

export const MOCK_OPPORTUNITIES: Opportunity[] = [
  {
    id: 'vos-001',
    title: 'Metro Food Bank Midnight Redistribution',
    organizer: 'Urban Harvest Alliance',
    organizerVerified: true,
    cause: 'Food Security',
    venueType: 'In-Person',
    location: 'Downtown Hub, 420 5th Ave',
    distance: '1.2 miles away',
    date: 'Tonight',
    time: '8:00 PM - 11:00 PM',
    durationHours: 3,
    spotsTotal: 15,
    spotsFilled: 11,
    description: 'Help sort and package surplus produce from regional grocery partners into cold-storage emergency family crates for night dispatch.',
    impactSummary: 'Provides 450+ fresh produce boxes for families in low-access zip codes.',
    requirements: ['Must be able to lift 25 lbs', 'Closed-toe shoes required', 'Brief 5-min safety video on site'],
    requiredAge: '18+',
    shifts: [
      { id: 's1', date: 'Tonight', time: '8:00 PM - 9:30 PM', spotsTotal: 8, spotsFilled: 6 },
      { id: 's2', date: 'Tonight', time: '9:30 PM - 11:00 PM', spotsTotal: 7, spotsFilled: 5 },
    ],
    source: 'VolunteerOS Native',
    aiMatchScore: 98,
    aiMatchReason: 'Matches your night availability and previous Food Security badge.',
    saved: true,
    applied: false,
    status: 'active',
  },
  {
    id: 'vos-002',
    title: 'AI & Coding Workshop for Youth',
    organizer: 'NextGen Tech Foundation',
    organizerVerified: true,
    cause: 'Tech Education',
    venueType: 'Hybrid',
    location: 'Innovation Lab & Zoom Stream',
    distance: '2.8 miles away / Remote',
    date: 'Saturday, Aug 8',
    time: '10:00 AM - 2:00 PM',
    durationHours: 4,
    spotsTotal: 10,
    spotsFilled: 8,
    description: 'Assist high school students in building their first web applications using AI tools and JavaScript. No expert teaching background required; 1:1 TA style.',
    impactSummary: 'Mentors 30+ underrepresented youth in tech fundamentals.',
    requirements: ['Basic HTML/JS knowledge', 'Background check required (fast track online)', 'Laptop required'],
    requiredAge: '16+',
    shifts: [
      { id: 's3', date: 'Saturday, Aug 8', time: '10:00 AM - 12:00 PM', spotsTotal: 5, spotsFilled: 4 },
      { id: 's4', date: 'Saturday, Aug 8', time: '12:00 PM - 2:00 PM', spotsTotal: 5, spotsFilled: 4 },
    ],
    source: 'Instagram',
    sourceUrl: 'https://instagram.com/p/nextgentech_workshop',
    aiMatchScore: 95,
    aiMatchReason: 'High affinity with your Tech Mentor profile.',
    saved: false,
    applied: true,
    status: 'active',
  },
  {
    id: 'vos-003',
    title: 'Emergency Flood Relief Packing Line',
    organizer: 'Regional Crisis Corps',
    organizerVerified: true,
    cause: 'Disaster Relief',
    venueType: 'In-Person',
    location: 'Logistics Hangar 4, Port Terminal',
    distance: '5.1 miles away',
    date: 'Tomorrow',
    time: '7:00 AM - 1:00 PM',
    durationHours: 6,
    spotsTotal: 40,
    spotsFilled: 29,
    description: 'Assemble emergency hygiene kits, potable water containers, and battery chargers for storm-affected coastal zones.',
    impactSummary: 'Direct emergency supplies for 1,200 displaced storm victims.',
    requirements: ['High energy', 'Standard work gloves recommended', 'Hydration pack provided'],
    requiredAge: '18+',
    shifts: [
      { id: 's5', date: 'Tomorrow', time: '7:00 AM - 10:00 AM', spotsTotal: 20, spotsFilled: 15 },
      { id: 's6', date: 'Tomorrow', time: '10:00 AM - 1:00 PM', spotsTotal: 20, spotsFilled: 14 },
    ],
    source: 'City Portal',
    sourceUrl: 'https://city.gov/volunteer/disaster-alert-892',
    aiMatchScore: 89,
    aiMatchReason: 'Urgent priority community event near your postal code.',
    saved: false,
    applied: false,
    status: 'active',
  },
  {
    id: 'vos-004',
    title: 'Urban Canopy Forest Planting Day',
    organizer: 'Green City Initiative',
    organizerVerified: true,
    cause: 'Environmental',
    venueType: 'In-Person',
    location: 'Riverside Ecological Park',
    distance: '3.4 miles away',
    date: 'Sunday, Aug 9',
    time: '9:00 AM - 1:00 PM',
    durationHours: 4,
    spotsTotal: 25,
    spotsFilled: 22,
    description: 'Plant 150 native tree saplings to restore urban shade canopy and combat summer heat island effects in East District.',
    impactSummary: 'Expands city green canopy by 1.5 acres.',
    requirements: ['Comfortable outdoor attire', 'Reusable water bottle', 'Shovels provided on site'],
    requiredAge: 'All Ages',
    shifts: [
      { id: 's7', date: 'Sunday, Aug 9', time: '9:00 AM - 1:00 PM', spotsTotal: 25, spotsFilled: 22 },
    ],
    source: 'Facebook',
    sourceUrl: 'https://facebook.com/events/greencity_plantday',
    aiMatchScore: 86,
    aiMatchReason: 'Matches your outdoor activity preference.',
    saved: true,
    applied: false,
    status: 'active',
  },
  {
    id: 'vos-005',
    title: 'Peer Support Warm-line Listener',
    organizer: 'Mindful Care Network',
    organizerVerified: true,
    cause: 'Crisis Support',
    venueType: 'Remote',
    location: 'Fully Remote (WebRTC System)',
    distance: 'Remote',
    date: 'Flexible Shift',
    time: 'Any 2-hour window',
    durationHours: 2,
    spotsTotal: 50,
    spotsFilled: 38,
    description: 'Provide empathetic, non-judgmental listening over our encrypted digital voice platform to individuals seeking friendly conversation.',
    impactSummary: 'Supports 100+ weekly calls reducing loneliness among isolated seniors.',
    requirements: ['Completion of 1-hr online training module', 'Quiet environment', 'Headset with mic'],
    requiredAge: '18+',
    shifts: [
      { id: 's8', date: 'Flexible', time: 'Morning Shift (9am-11am)', spotsTotal: 25, spotsFilled: 19 },
      { id: 's9', date: 'Flexible', time: 'Evening Shift (6pm-8pm)', spotsTotal: 25, spotsFilled: 19 },
    ],
    source: 'Direct Non-Profit',
    aiMatchScore: 92,
    aiMatchReason: 'Ideal fit for remote work flexibility.',
    saved: false,
    applied: false,
    status: 'active',
  },
  {
    id: 'vos-006',
    title: 'Shelter Dog Socialization & Walking',
    organizer: 'City Rescue League',
    organizerVerified: true,
    cause: 'Animal Welfare',
    venueType: 'In-Person',
    location: 'Westside Animal Haven',
    distance: '4.0 miles away',
    date: 'Daily',
    time: '8:00 AM - 10:00 AM',
    durationHours: 2,
    spotsTotal: 12,
    spotsFilled: 9,
    description: 'Walk, exercise, and socialize rescued dogs awaiting adoption to boost their physical health and behavioral readiness.',
    impactSummary: 'Directly improves adoption placement rates by 40%.',
    requirements: ['Love for animals', 'Sturdy footwear', 'Minimum 18 years old'],
    requiredAge: '18+',
    shifts: [
      { id: 's10', date: 'Tomorrow', time: '8:00 AM - 10:00 AM', spotsTotal: 12, spotsFilled: 9 },
    ],
    source: 'School Network',
    sourceUrl: 'https://university.edu/community/volunteer-hub/dog-walk',
    aiMatchScore: 91,
    aiMatchReason: 'Matches morning schedule preference.',
    saved: true,
    applied: false,
    status: 'active',
  }
];

export const MOCK_PASSPORT: VolunteerPassportData = {
  name: 'Zachary Taylor',
  handle: '@ztaylor',
  joinDate: 'January 2026',
  totalHours: 142.5,
  impactScore: 940,
  eventsCompleted: 28,
  badges: [
    {
      id: 'b-1',
      title: 'Centurion Volunteer',
      dateEarned: 'July 2026',
      category: 'Food Security',
      description: 'Completed 100+ verified community service hours.',
      hoursRequired: 100
    },
    {
      id: 'b-2',
      title: 'Tech Education Pioneer',
      dateEarned: 'May 2026',
      category: 'Tech Education',
      description: 'Mentored 20+ students in coding and digital literacy.',
      hoursRequired: 25
    },
    {
      id: 'b-3',
      title: 'Rapid Disaster Responder',
      dateEarned: 'March 2026',
      category: 'Disaster Relief',
      description: 'Deployed to 3 emergency packing & distribution operations.',
      hoursRequired: 15
    },
    {
      id: 'b-4',
      title: 'Canopy Guardian',
      dateEarned: 'February 2026',
      category: 'Environmental',
      description: 'Planted 50+ trees across urban reforestation initiatives.',
      hoursRequired: 20
    }
  ],
  recentActivities: [
    {
      id: 'act-101',
      opportunityTitle: 'AI & Coding Workshop for Youth',
      organizer: 'NextGen Tech Foundation',
      hours: 4.0,
      dateCompleted: 'Aug 1, 2026',
      verificationHash: 'vos-hash-0x98f2a41d'
    },
    {
      id: 'act-102',
      opportunityTitle: 'Metro Food Bank Midnight Redistribution',
      organizer: 'Urban Harvest Alliance',
      hours: 3.5,
      dateCompleted: 'Jul 28, 2026',
      verificationHash: 'vos-hash-0x41b8e92c'
    },
    {
      id: 'act-103',
      opportunityTitle: 'Emergency Flood Relief Packing Line',
      organizer: 'Regional Crisis Corps',
      hours: 6.0,
      dateCompleted: 'Jul 15, 2026',
      verificationHash: 'vos-hash-0x73c1d90a'
    }
  ]
};

export const MOCK_ORGANIZER_STATS: OrganizerStats = {
  activeEventsCount: 6,
  totalApplicantsCount: 144,
  verifiedHoursGranted: 1280,
  socialImportsCount: 19
};

export const MOCK_APPLICANTS: ApplicantRecord[] = [
  {
    id: 'app-001',
    volunteerName: 'Sophia Lin',
    volunteerEmail: 'sophia.lin@domain.com',
    opportunityId: 'vos-001',
    opportunityTitle: 'Metro Food Bank Midnight Redistribution',
    appliedDate: '2 hours ago',
    hoursClaimed: 3,
    status: 'pending'
  },
  {
    id: 'app-002',
    volunteerName: 'Marcus Vance',
    volunteerEmail: 'marcus.v@domain.com',
    opportunityId: 'vos-001',
    opportunityTitle: 'Metro Food Bank Midnight Redistribution',
    appliedDate: '5 hours ago',
    hoursClaimed: 3,
    status: 'approved'
  },
  {
    id: 'app-003',
    volunteerName: 'Elena Rostova',
    volunteerEmail: 'elena.r@domain.com',
    opportunityId: 'vos-002',
    opportunityTitle: 'AI & Coding Workshop for Youth',
    appliedDate: 'Yesterday',
    hoursClaimed: 4,
    status: 'checked_in'
  },
  {
    id: 'app-004',
    volunteerName: 'David Chen',
    volunteerEmail: 'd.chen@domain.com',
    opportunityId: 'vos-003',
    opportunityTitle: 'Emergency Flood Relief Packing Line',
    appliedDate: '2 days ago',
    hoursClaimed: 6,
    status: 'pending'
  }
];

export const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Upcoming Shift Reminder',
    message: 'Your shift for "AI & Coding Workshop for Youth" is scheduled for Saturday, Aug 8 at 10:00 AM.',
    timestamp: '10m ago',
    read: false,
    type: 'shift',
    linkTab: 'calendar'
  },
  {
    id: 'notif-2',
    title: 'Hours Approved & Verified',
    message: 'NextGen Tech Foundation verified 4.0 hours for AI & Coding Workshop. Certificate updated.',
    timestamp: '2h ago',
    read: false,
    type: 'approval',
    linkTab: 'hours'
  },
  {
    id: 'notif-3',
    title: 'New Organizer Message',
    message: 'Sarah Jenkins sent a message: "Thanks for signing up! Here is the parking guide..."',
    timestamp: 'Yesterday',
    read: true,
    type: 'message',
    linkTab: 'messages'
  },
  {
    id: 'notif-4',
    title: 'Badge Unlocked!',
    message: 'Congratulations! You earned the "Centurion Volunteer" badge for 100+ verified hours.',
    timestamp: '3 days ago',
    read: true,
    type: 'system',
    linkTab: 'passport'
  }
];

export const MOCK_CHAT_THREADS: ChatThread[] = [
  {
    id: 'thread-1',
    title: 'NextGen Tech Foundation',
    subtitle: 'Sarah Jenkins • Event Lead',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
    type: 'direct',
    unreadCount: 1,
    lastMessage: 'We will be using Vite & React, so basic JS knowledge is perfect.',
    lastMessageTime: '10:42 AM',
    messages: [
      {
        id: 'm1',
        senderId: 'sarah',
        senderName: 'Sarah Jenkins',
        senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
        text: 'Hi Zachary! Welcome to the mentor roster for Saturday’s Youth AI Workshop.',
        timestamp: '10:30 AM',
        isMe: false
      },
      {
        id: 'm2',
        senderId: 'me',
        senderName: 'Zachary Taylor',
        text: 'Thanks Sarah! Exciting project. Do I need to prep any environment beforehand?',
        timestamp: '10:35 AM',
        isMe: true
      },
      {
        id: 'm3',
        senderId: 'sarah',
        senderName: 'Sarah Jenkins',
        senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
        text: 'We will be using Vite & React, so basic JS knowledge is perfect.',
        timestamp: '10:42 AM',
        isMe: false
      }
    ]
  },
  {
    id: 'thread-2',
    title: 'Metro Food Bank Night Team',
    subtitle: 'Event Channel • 12 Active Volunteers',
    type: 'channel',
    unreadCount: 0,
    lastMessage: 'Reminder: Closed-toe shoes required for hangar safety!',
    lastMessageTime: 'Yesterday',
    messages: [
      {
        id: 'm4',
        senderId: 'organizer',
        senderName: 'Urban Harvest Lead',
        text: 'Welcome everyone! Reminder: Closed-toe shoes required for hangar safety!',
        timestamp: 'Yesterday',
        isMe: false
      },
      {
        id: 'm5',
        senderId: 'me',
        senderName: 'Zachary Taylor',
        text: 'Will there be designated parking for night shift volunteers?',
        timestamp: 'Yesterday',
        isMe: true
      },
      {
        id: 'm6',
        senderId: 'organizer',
        senderName: 'Urban Harvest Lead',
        text: 'Yes! Park in Gate 3 lot and show your VolunteerOS event ticket.',
        timestamp: 'Yesterday',
        isMe: false
      }
    ]
  }
];

export const MOCK_HOURS_LOGS: HourLogEntry[] = [
  {
    id: 'log-1',
    opportunityTitle: 'AI & Coding Workshop for Youth',
    organizer: 'NextGen Tech Foundation',
    category: 'Tech Education',
    hours: 4.0,
    date: '2026-08-01',
    status: 'verified',
    verificationHash: 'vos-hash-0x98f2a41d',
    supervisorName: 'Sarah Jenkins',
    supervisorEmail: 's.jenkins@nextgentech.org',
    notes: 'Mentored students through building 3 full web app prototypes.'
  },
  {
    id: 'log-2',
    opportunityTitle: 'Metro Food Bank Midnight Redistribution',
    organizer: 'Urban Harvest Alliance',
    category: 'Food Security',
    hours: 3.5,
    date: '2026-07-28',
    status: 'verified',
    verificationHash: 'vos-hash-0x41b8e92c',
    supervisorName: 'Michael Chang',
    supervisorEmail: 'mchang@urbanharvest.org',
    notes: 'Sorted 450 lbs of organic produce and packed emergency crates.'
  },
  {
    id: 'log-3',
    opportunityTitle: 'Emergency Flood Relief Packing Line',
    organizer: 'Regional Crisis Corps',
    category: 'Disaster Relief',
    hours: 6.0,
    date: '2026-07-15',
    status: 'verified',
    verificationHash: 'vos-hash-0x73c1d90a',
    supervisorName: 'Alex Rivera',
    supervisorEmail: 'arivera@crisiscorps.org',
    notes: 'Assembled 120 emergency hygiene kits for flood-affected families.'
  },
  {
    id: 'log-4',
    opportunityTitle: 'Urban Canopy Reforestation Day',
    organizer: 'Green City Initiative',
    category: 'Environmental',
    hours: 4.0,
    date: '2026-08-02',
    status: 'pending',
    verificationHash: 'vos-hash-pending-01',
    supervisorName: 'David Vance',
    supervisorEmail: 'dvance@greencity.org',
    notes: 'Planted 15 saplings in Riverside Park.'
  }
];

export const MOCK_USER_SETTINGS: UserSettings = {
  emailNotifications: true,
  pushNotifications: true,
  smsAlerts: false,
  publicProfile: true,
  showHoursOnPassport: true,
  theme: 'dark',
  language: 'English',
  linkedPlatforms: {
    facebook: true,
    instagram: true,
    linkedin: true
  }
};

export const MOCK_USER_PROFILE: UserProfile = {
  id: 'user-001',
  name: 'Zachary Taylor',
  email: 'zachary.taylor@volunteer-os.org',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
  bio: 'Full-stack developer & community organizer passionate about tech equity, civic tech, food security, and urban climate resilience.',
  location: 'San Francisco, CA',
  role: 'volunteer',
  skills: ['TypeScript', 'React', 'UI/UX Design', 'Event Logistics', 'Youth Mentorship', 'First Aid'],
  causes: ['Tech Education', 'Food Security', 'Environmental', 'Disaster Relief']
};

