-- ==========================================================
-- VOLUNTEEROS DATABASE SCHEMA FOR SUPABASE (Postgres)
-- Paste this script into your Supabase SQL Editor and click RUN
-- ==========================================================

-- 1. Create Profiles Table (Linked to Supabase Auth Users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'volunteer',
  avatar TEXT,
  bio TEXT,
  location TEXT,
  skills TEXT[] DEFAULT '{}',
  causes TEXT[] DEFAULT '{}',
  organization_name TEXT,
  organization_website TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create Opportunities Table
CREATE TABLE IF NOT EXISTS public.opportunities (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  organizer TEXT NOT NULL,
  organizer_logo TEXT,
  organizer_verified BOOLEAN DEFAULT true,
  cause TEXT NOT NULL,
  venue_type TEXT NOT NULL,
  location TEXT NOT NULL,
  distance TEXT DEFAULT '1.0 miles away',
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  duration_hours NUMERIC NOT NULL,
  spots_total INTEGER NOT NULL,
  spots_filled INTEGER DEFAULT 0,
  description TEXT NOT NULL,
  impact_summary TEXT,
  requirements TEXT[] DEFAULT '{}',
  required_age TEXT DEFAULT '18+',
  skills TEXT[] DEFAULT '{}',
  items_to_bring TEXT[] DEFAULT '{}',
  banner_image TEXT,
  source TEXT DEFAULT 'VolunteerOS Native',
  status TEXT DEFAULT 'active',
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create Applications / Registrations Table
CREATE TABLE IF NOT EXISTS public.applications (
  id TEXT PRIMARY KEY,
  volunteer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  volunteer_name TEXT NOT NULL,
  volunteer_email TEXT NOT NULL,
  opportunity_id TEXT REFERENCES public.opportunities(id) ON DELETE CASCADE,
  opportunity_title TEXT NOT NULL,
  applied_date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  hours_claimed NUMERIC NOT NULL,
  status TEXT DEFAULT 'pending'
);

-- 4. Create Hours Logs Table
CREATE TABLE IF NOT EXISTS public.hours_logs (
  id TEXT PRIMARY KEY,
  volunteer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  opportunity_title TEXT NOT NULL,
  organizer TEXT NOT NULL,
  category TEXT NOT NULL,
  hours NUMERIC NOT NULL,
  date DATE NOT NULL,
  status TEXT DEFAULT 'pending',
  verification_hash TEXT NOT NULL,
  supervisor_name TEXT,
  supervisor_email TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hours_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies for Public Access & User Ownership
CREATE POLICY "Allow public read access to opportunities" ON public.opportunities FOR SELECT USING (true);
CREATE POLICY "Allow authenticated users to insert opportunities" ON public.opportunities FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Allow creator to update opportunity" ON public.opportunities FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "Allow users to read profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Allow user to update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Allow user to insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Allow users to read own applications" ON public.applications FOR SELECT USING (auth.uid() = volunteer_id);
CREATE POLICY "Allow users to insert own applications" ON public.applications FOR INSERT WITH CHECK (auth.uid() = volunteer_id);

CREATE POLICY "Allow users to read own hours logs" ON public.hours_logs FOR SELECT USING (auth.uid() = volunteer_id);
CREATE POLICY "Allow users to insert own hours logs" ON public.hours_logs FOR INSERT WITH CHECK (auth.uid() = volunteer_id);
