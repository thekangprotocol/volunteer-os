import { createClient } from '@supabase/supabase-js';

// Environment variables from Vite
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Check if credentials are present
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

if (!isSupabaseConfigured) {
  console.warn(
    'VolunteerOS Supabase Warning: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are missing. Add them to your environment variables or Vercel Environment Variables.'
  );
}

// Fallback dummy URL to prevent client crash before user configures keys
const validUrl = supabaseUrl || 'https://placeholder.supabase.co';
const validKey = supabaseAnonKey || 'placeholder-anon-key';

export const supabase = createClient(validUrl, validKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});
