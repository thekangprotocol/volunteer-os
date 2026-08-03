import { supabase, isSupabaseConfigured } from './supabaseClient';
import { UserRole, UserProfile, Opportunity, HourLogEntry } from '../types';

export const authService = {
  /**
   * Real Email & Password Sign Up
   */
  async signUp(email: string, password: string, name: string, role: UserRole) {
    if (!isSupabaseConfigured) {
      console.log('Supabase not yet configured. Simulating auth state locally.');
      return {
        user: { id: `user-${Date.now()}`, email },
        profile: { id: `user-${Date.now()}`, name, email, role },
        error: null
      };
    }

    try {
      // 1. Create auth user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            user_role: role
          }
        }
      });

      if (authError) return { user: null, profile: null, error: authError.message };
      if (!authData.user) return { user: null, profile: null, error: 'Failed to create account.' };

      // 2. Create user profile row in database
      const profile: Partial<UserProfile> = {
        id: authData.user.id,
        name,
        email,
        role,
        bio: `${role === 'volunteer' ? 'Community Volunteer' : 'Community Organizer'} on VolunteerOS protocol.`,
        location: 'San Francisco, CA',
        skills: [],
        causes: ['Food Security', 'Tech Education']
      };

      const { error: profileError } = await supabase
        .from('profiles')
        .upsert(profile);

      if (profileError) {
        console.warn('Profile upsert warning:', profileError.message);
      }

      return { user: authData.user, profile, error: null };
    } catch (err: any) {
      return { user: null, profile: null, error: err.message || 'Signup error' };
    }
  },

  /**
   * Real Email & Password Sign In
   */
  async signIn(email: string, password: string) {
    if (!isSupabaseConfigured) {
      return {
        user: { id: `user-${Date.now()}`, email },
        error: null
      };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) return { user: null, error: error.message };

      // Fetch user profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      return { user: data.user, profile, error: null };
    } catch (err: any) {
      return { user: null, error: err.message || 'Signin error' };
    }
  },

  /**
   * OAuth Social Login (Google / Apple)
   */
  async signInWithOAuth(provider: 'google' | 'apple') {
    if (!isSupabaseConfigured) {
      return { error: 'Supabase OAuth credentials not configured yet.' };
    }

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: window.location.origin
        }
      });

      if (error) {
        if (error.message.includes('not enabled') || error.message.includes('validation_failed')) {
          return { error: `${provider.toUpperCase()} provider is not enabled in your Supabase Dashboard under Authentication > Providers.` };
        }
        return { error: error.message };
      }

      return { data, error: null };
    } catch (err: any) {
      return { error: err.message || 'OAuth initialization failed' };
    }
  },

  /**
   * Sign Out
   */
  async signOut() {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
  },

  /**
   * Get Current Session User
   */
  async getCurrentSession() {
    if (!isSupabaseConfigured) return null;
    const { data } = await supabase.auth.getSession();
    return data.session;
  }
};
