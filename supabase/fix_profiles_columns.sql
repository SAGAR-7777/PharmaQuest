-- ====================================================================
-- PHARMAQUEST — SAFE NON-DESTRUCTIVE FIX FOR PROFILES TABLE & TRIGGER
--
-- Why this is needed:
-- Your Supabase project already had a 'profiles' table from another website
-- with columns (id, email, name, phone, created_at, updated_at).
-- This script adds the PHARMAQUEST columns (full_name, college_name, year_of_study, avatar_url)
-- without deleting or modifying any existing columns or data.
-- It also adds exception handling to the user creation trigger so signups never fail.
--
-- Instructions:
-- 1. Open Supabase Dashboard -> SQL Editor
-- 2. Paste this script and click "Run"
-- ====================================================================

-- 1. Safely add missing columns to existing public.profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS full_name TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS college_name TEXT DEFAULT 'Pharmacy College';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS year_of_study TEXT DEFAULT 'D.Pharm Part I (ER-2020)';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- 2. Populate full_name from existing name if present
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'name'
  ) THEN
    UPDATE public.profiles SET full_name = name WHERE full_name IS NULL;
  END IF;
END $$;

-- 3. Robust, fault-tolerant user trigger with EXCEPTION safety block
CREATE OR REPLACE FUNCTION public.handle_new_pharmaquest_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert into public.profiles
  INSERT INTO public.profiles (id, email, full_name, college_name, year_of_study)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'college_name', 'Pharmacy College'),
    COALESCE(NEW.raw_user_meta_data->>'year_of_study', 'D.Pharm Part I (ER-2020)')
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = COALESCE(EXCLUDED.full_name, public.profiles.full_name),
    college_name = COALESCE(EXCLUDED.college_name, public.profiles.college_name),
    year_of_study = COALESCE(EXCLUDED.year_of_study, public.profiles.year_of_study);

  -- Initialize streak record
  INSERT INTO public.streaks (user_id, current_streak, best_streak, last_activity_date)
  VALUES (NEW.id, 1, 1, CURRENT_DATE)
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Guarantee that auth user creation NEVER fails due to secondary table insertions
    RAISE WARNING 'handle_new_pharmaquest_user trigger warning: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Re-attach trigger
DROP TRIGGER IF EXISTS on_pharmaquest_user_created ON auth.users;
CREATE TRIGGER on_pharmaquest_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_pharmaquest_user();
