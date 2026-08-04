import { supabase, isSupabaseConfigured } from './supabaseClient';
import { Opportunity } from '../types';

export const opportunityService = {
  /**
   * Fetch all real opportunities from Supabase Postgres database
   */
  async fetchOpportunities(): Promise<Opportunity[]> {
    if (!isSupabaseConfigured) return [];

    try {
      const { data, error } = await supabase
        .from('opportunities')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Supabase fetch opportunities warning:', error.message);
        return [];
      }

      if (!data || data.length === 0) return [];

      // Map database columns to Opportunity interface
      return data.map((row: any) => ({
        id: row.id,
        title: row.title,
        organizer: row.organizer,
        organizerLogo: row.organizer_logo || 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&q=80&w=200',
        organizerVerified: row.organizer_verified ?? true,
        cause: row.cause,
        venueType: row.venue_type as any,
        location: row.location,
        distance: row.distance || '1.2 miles away',
        date: row.date,
        time: row.time,
        durationHours: Number(row.duration_hours) || 3,
        spotsTotal: Number(row.spots_total) || 10,
        spotsFilled: Number(row.spots_filled) || 0,
        description: row.description,
        impactSummary: row.impact_summary,
        requirements: row.requirements || [],
        requiredAge: row.required_age || '18+',
        skills: row.skills || [],
        itemsToBring: row.items_to_bring || [],
        bannerImage: row.banner_image || 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&q=80&w=1000',
        source: row.source || 'VolunteerOS Native',
        status: row.status || 'active'
      }));
    } catch (err) {
      console.warn('Error fetching opportunities:', err);
      return [];
    }
  },

  /**
   * Save a newly created opportunity to Supabase Postgres database
   */
  async createOpportunity(opp: Opportunity, createdByUserId?: string) {
    if (!isSupabaseConfigured) return;

    try {
      const row = {
        id: opp.id,
        title: opp.title,
        organizer: opp.organizer,
        organizer_logo: opp.organizerLogo,
        organizer_verified: opp.organizerVerified,
        cause: opp.cause,
        venue_type: opp.venueType,
        location: opp.location,
        distance: opp.distance,
        date: opp.date,
        time: opp.time,
        duration_hours: opp.durationHours,
        spots_total: opp.spotsTotal,
        spots_filled: opp.spotsFilled,
        description: opp.description,
        impact_summary: opp.impactSummary,
        requirements: opp.requirements,
        required_age: opp.requiredAge,
        skills: opp.skills,
        items_to_bring: opp.itemsToBring,
        banner_image: opp.bannerImage,
        source: opp.source,
        status: opp.status || 'active',
        created_by: createdByUserId || null
      };

      const { error } = await supabase
        .from('opportunities')
        .insert(row);

      if (error) {
        console.error('Failed to save opportunity to Supabase:', error.message);
      }
    } catch (err) {
      console.error('Error creating opportunity in Supabase:', err);
    }
  }
};
