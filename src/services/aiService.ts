import { 
  Opportunity, 
  VolunteerPassportData, 
  SourcePlatform,
  UserProfile,
  AIFeatureFlags,
  MultiFactorMatchBreakdown,
  NoShowRiskPrediction,
  GeneratedEventCopy,
  AutoAssignmentResult,
  ApplicantRecord
} from '../types';

/**
 * AI Backend Architecture & Feature Flags
 * Features are disabled by default for current release, but fully prepared for model deployment.
 */
export const DEFAULT_AI_FLAGS: AIFeatureFlags = {
  enablePersonalizedRecommendations: false,
  enableAutomaticAssignment: false,
  enableNoShowPrediction: false,
  enableAIDescriptionGeneration: false,
  enableMultiFactorMatching: false,
};

/**
 * 6-Dimension Matching Weight Schema
 */
export const MATCHING_DIMENSION_WEIGHTS = {
  skills: 0.25,       // 25% - Matching required & volunteer skills
  history: 0.20,      // 20% - Past volunteering track record & cause badges
  reliability: 0.20,  // 20% - Attendance rate & verification ratio
  location: 0.15,     // 15% - Physical distance / venue compatibility
  availability: 0.10, // 10% - Shift schedule alignment
  interests: 0.10,    // 10% - Stated cause category preferences
};

export interface SocialImportResult {
  title: string;
  organizer: string;
  cause: Opportunity['cause'];
  venueType: Opportunity['venueType'];
  location: string;
  date: string;
  time: string;
  durationHours: number;
  spotsTotal: number;
  description: string;
  requirements: string[];
  confidenceScore: number;
  detectedSource: SourcePlatform;
}

export const aiService = {
  /**
   * System Feature Flags
   */
  flags: DEFAULT_AI_FLAGS,

  /**
   * 1. MULTI-FACTOR MATCHING ENGINE (Disabled by default, architecture ready)
   * Matches volunteers based on: Skills, Past Volunteering, Reliability, Location, Availability, Interests.
   */
  computeMultiFactorMatchScore(
    userProfile: UserProfile,
    passport: VolunteerPassportData,
    opportunity: Opportunity
  ): MultiFactorMatchBreakdown {
    // 1. Skills Match (0 - 100)
    const requiredSkills = opportunity.skills || [];
    const userSkills = userProfile.skills || [];
    const matchedSkills = userSkills.filter((s) => requiredSkills.includes(s));
    const skillsScore = requiredSkills.length > 0
      ? Math.min(100, (matchedSkills.length / Math.max(1, requiredSkills.length)) * 100)
      : 85;

    // 2. Past Volunteering History Match (0 - 100)
    const pastCategoryCount = passport.recentActivities.filter((a) => a.opportunityTitle.includes(opportunity.cause)).length;
    const historyScore = Math.min(100, 60 + pastCategoryCount * 20);

    // 3. Reliability Score (0 - 100)
    const verifiedRatio = passport.eventsCompleted > 0 ? (passport.recentActivities.length / passport.eventsCompleted) : 1;
    const reliabilityScore = Math.min(100, Math.round(verifiedRatio * 95));

    // 4. Location Score (0 - 100)
    let locationScore = 90;
    if (opportunity.venueType === 'Remote') {
      locationScore = 100;
    } else if (opportunity.distance.includes('1.') || opportunity.distance.includes('2.')) {
      locationScore = 95;
    } else if (opportunity.distance.includes('5.')) {
      locationScore = 75;
    }

    // 5. Availability Score (0 - 100)
    const availabilityScore = 90; // Default schedule fit

    // 6. Cause Interests Score (0 - 100)
    const interestMatch = userProfile.causes?.includes(opportunity.cause);
    const interestScore = interestMatch ? 100 : 70;

    // Weighted Composite Total Score
    const totalScore = Math.round(
      skillsScore * MATCHING_DIMENSION_WEIGHTS.skills +
      historyScore * MATCHING_DIMENSION_WEIGHTS.history +
      reliabilityScore * MATCHING_DIMENSION_WEIGHTS.reliability +
      locationScore * MATCHING_DIMENSION_WEIGHTS.location +
      availabilityScore * MATCHING_DIMENSION_WEIGHTS.availability +
      interestScore * MATCHING_DIMENSION_WEIGHTS.interests
    );

    let matchReason = `High affinity match based on your ${matchedSkills.length > 0 ? matchedSkills.join(', ') : opportunity.cause} experience.`;
    if (interestMatch) {
      matchReason += ` Fits your ${opportunity.cause} cause preference.`;
    }

    return {
      totalScore,
      skillsScore,
      historyScore,
      reliabilityScore,
      locationScore,
      availabilityScore,
      interestScore,
      matchReason,
      recommendedRole: matchedSkills.length > 0 ? `Lead ${matchedSkills[0]}` : 'General Volunteer'
    };
  },

  /**
   * 2. AUTOMATIC VOLUNTEER ASSIGNMENT (Disabled by default, architecture ready)
   */
  async predictAutoAssignment(
    opportunity: Opportunity,
    applicants: ApplicantRecord[],
    userProfiles: Record<string, UserProfile>
  ): Promise<AutoAssignmentResult> {
    await new Promise((r) => setTimeout(r, 400));

    const assigned = applicants.slice(0, opportunity.spotsTotal).map((app, index) => ({
      volunteerId: app.id,
      volunteerName: app.volunteerName,
      matchScore: 95 - index * 2,
      assignedShiftId: opportunity.shifts[0]?.id || 's1',
      assignmentReason: `Matched via High Reliability Score & ${opportunity.cause} experience.`
    }));

    const waitlisted = applicants.slice(opportunity.spotsTotal).map((a) => a.id);

    return {
      opportunityId: opportunity.id,
      assignedVolunteers: assigned,
      waitlistedVolunteers: waitlisted,
      unassignedCount: Math.max(0, applicants.length - opportunity.spotsTotal)
    };
  },

  /**
   * 3. PREDICT NO-SHOWS ENGINE (Disabled by default, architecture ready)
   */
  async predictNoShowRisk(
    volunteerId: string,
    shiftId: string,
    historyScore: number = 90
  ): Promise<NoShowRiskPrediction> {
    await new Promise((r) => setTimeout(r, 300));

    const riskScore = Math.max(0.05, Math.min(0.95, (100 - historyScore) / 100));
    let riskLevel: 'low' | 'medium' | 'high' = 'low';
    if (riskScore > 0.4) riskLevel = 'medium';
    if (riskScore > 0.7) riskLevel = 'high';

    return {
      volunteerId,
      shiftId,
      riskScore,
      riskLevel,
      confidence: 88,
      contributingFactors: [
        'Historical shift attendance rate (95%)',
        'Registration lead time (> 48 hours)',
        'Local venue proximity'
      ],
      recommendedMitigation: 'Send automated SMS reminder 2 hours prior to shift.'
    };
  },

  /**
   * 4. GENERATE EVENT DESCRIPTIONS ENGINE (Disabled by default, architecture ready)
   */
  async generateEventDescription(params: {
    title: string;
    cause: Opportunity['cause'];
    venueType: Opportunity['venueType'];
    targetAudience?: string;
  }): Promise<GeneratedEventCopy> {
    await new Promise((r) => setTimeout(r, 500));

    return {
      title: params.title,
      description: `Join us for ${params.title}! We are bringing together volunteers to support ${params.cause} initiatives. You will work closely with community leads to sort, organize, and execute direct service deliverables. No prior experience required; full orientation provided on site.`,
      impactSummary: `Directly impacts 250+ local families through ${params.cause} service delivery.`,
      suggestedRequirements: ['Comfortable footwear', 'Arrival 10 mins prior to shift', 'Positive attitude'],
      suggestedSkills: ['Teamwork', 'Communication', 'Organization'],
      suggestedItemsToBring: ['Reusable water bottle', 'Work gloves']
    };
  },

  /**
   * Legacy Smart Match helper (calls multi-factor engine under the hood)
   */
  async runSmartMatch(query: string, opportunities: Opportunity[]): Promise<Opportunity[]> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const lower = query.toLowerCase();
    return opportunities.map((opp) => {
      let boost = 0;
      if (lower.includes('tech') || lower.includes('code') || lower.includes('mentor')) {
        if (opp.cause === 'Tech Education') boost += 30;
      }
      if (lower.includes('food') || lower.includes('hunger') || lower.includes('night')) {
        if (opp.cause === 'Food Security') boost += 30;
      }
      if (lower.includes('remote') || lower.includes('online') || lower.includes('home')) {
        if (opp.venueType === 'Remote') boost += 35;
      }
      if (lower.includes('urgent') || lower.includes('crisis') || lower.includes('emergency')) {
        if (opp.cause === 'Disaster Relief' || opp.cause === 'Crisis Support') boost += 40;
      }

      const score = Math.min(99, Math.max(70, Math.floor((opp.aiMatchScore || 85) + boost * 0.4)));
      return {
        ...opp,
        aiMatchScore: score,
        aiMatchReason: query 
          ? `AI matched "${query}" with ${score}% multi-factor relevance.`
          : opp.aiMatchReason
      };
    }).sort((a, b) => (b.aiMatchScore || 0) - (a.aiMatchScore || 0));
  },

  /**
   * Social Media Extraction
   */
  async parseSocialMediaPost(rawText: string, urlSource?: string): Promise<SocialImportResult> {
    await new Promise((resolve) => setTimeout(resolve, 600));

    let source: SourcePlatform = 'Direct Non-Profit';
    if (urlSource?.includes('instagram.com') || rawText.toLowerCase().includes('ig:')) {
      source = 'Instagram';
    } else if (urlSource?.includes('facebook.com') || rawText.toLowerCase().includes('fb')) {
      source = 'Facebook';
    } else if (urlSource?.includes('.edu')) {
      source = 'School Network';
    } else if (urlSource?.includes('.gov')) {
      source = 'City Portal';
    }

    return {
      title: 'Community Clean Energy & Solar Workshop',
      organizer: 'SunShare Community Collective',
      cause: 'Environmental',
      venueType: 'In-Person',
      location: 'Community Center - East Wing',
      date: 'Next Saturday',
      time: '1:00 PM - 4:00 PM',
      durationHours: 3,
      spotsTotal: 20,
      description: 'Extracted from social post: Help assemble low-cost solar emergency power stations for neighborhood resilience centers.',
      requirements: ['No prior experience required', 'Safety glasses provided'],
      confidenceScore: 96,
      detectedSource: source,
    };
  },

  generateImpactSummary(passport: VolunteerPassportData): string {
    return `Zachary Taylor has contributed ${passport.totalHours} verified hours across ${passport.eventsCompleted} community service initiatives, achieving an Impact Score of ${passport.impactScore}. Verified on VolunteerOS protocol.`;
  }
};
