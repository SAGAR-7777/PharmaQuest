-- ====================================================================
-- PHARMAQUEST — SUPABASE DATABASE SCHEMA MIGRATION
-- PCI ER-2020 D.PHARM PART I MULTI-USER WEB APPLICATION
-- Created in exact foreign key dependency order with Row Level Security (RLS)
-- Safe to run on existing Supabase projects without modifying unrelated tables
-- ====================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ====================================================================
-- 2. USER PROFILES TABLE (Linked with auth.users)
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  college_name TEXT DEFAULT 'Pharmacy College',
  year_of_study TEXT DEFAULT 'D.Pharm Part I (ER-2020)',
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- 3. EDUCATIONAL CONTENT TABLES (Shared Curriculum Data)
-- ====================================================================

-- 3.1 Subjects Table (Root Curriculum Entity)
CREATE TABLE IF NOT EXISTS public.subjects (
  id TEXT PRIMARY KEY, -- e.g. 'pharmaceutics', 'chemistry', 'pharmacognosy', 'hap', 'social'
  theory_code TEXT NOT NULL,
  practical_code TEXT NOT NULL,
  title TEXT NOT NULL,
  accent_color TEXT NOT NULL,
  total_theory_hours INTEGER NOT NULL,
  total_tutorial_hours INTEGER NOT NULL,
  total_practical_hours INTEGER NOT NULL,
  scope TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3.2 Chapters Table (Depends on subjects)
CREATE TABLE IF NOT EXISTS public.chapters (
  id TEXT PRIMARY KEY,
  subject_id TEXT REFERENCES public.subjects(id) ON DELETE CASCADE,
  chapter_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  hours INTEGER NOT NULL,
  topics JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3.3 Questions Table (Depends on subjects, chapters)
CREATE TABLE IF NOT EXISTS public.questions (
  id TEXT PRIMARY KEY,
  subject_id TEXT REFERENCES public.subjects(id) ON DELETE CASCADE,
  chapter_id TEXT REFERENCES public.chapters(id) ON DELETE SET NULL,
  chapter_number INTEGER,
  chapter_title TEXT,
  code_label TEXT,
  question_text TEXT NOT NULL,
  question_type TEXT DEFAULT 'mcq', -- 'mcq', 'pyq', 'vvi', 'viva'
  year INTEGER,
  difficulty TEXT DEFAULT 'Medium',
  radar_tag TEXT DEFAULT 'CONCEPTUAL', -- 'HIGH PRIORITY', 'REPEATED', 'MUST REVISE', 'CONCEPTUAL'
  frequency TEXT,
  explanation_mechanism TEXT,
  explanation_key_point TEXT,
  explanation_syllabus_ref TEXT,
  marks INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3.4 Question Options Table (Depends on questions)
CREATE TABLE IF NOT EXISTS public.question_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id TEXT REFERENCES public.questions(id) ON DELETE CASCADE,
  option_index INTEGER NOT NULL,
  option_key TEXT NOT NULL, -- 'A', 'B', 'C', 'D'
  option_text TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL DEFAULT FALSE
);

-- 3.5 Question Answers / Model Answer Table (Depends on questions)
CREATE TABLE IF NOT EXISTS public.question_answers (
  question_id TEXT PRIMARY KEY REFERENCES public.questions(id) ON DELETE CASCADE,
  correct_option_index INTEGER NOT NULL,
  model_answer TEXT
);

-- 3.6 PYQs Table (Previous Years' Questions, Depends on questions)
CREATE TABLE IF NOT EXISTS public.pyqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id TEXT REFERENCES public.questions(id) ON DELETE CASCADE,
  exam_year INTEGER NOT NULL,
  exam_session TEXT DEFAULT 'Annual',
  marks INTEGER DEFAULT 3
);

-- 3.7 VVI Questions Table (Very Very Important Exam Radar, Depends on questions)
CREATE TABLE IF NOT EXISTS public.vvi_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id TEXT REFERENCES public.questions(id) ON DELETE CASCADE,
  priority_tier TEXT NOT NULL,
  reason TEXT
);

-- 3.8 Notes & Editorial Textbook Table (Depends on subjects, chapters)
CREATE TABLE IF NOT EXISTS public.notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id TEXT REFERENCES public.subjects(id) ON DELETE CASCADE,
  chapter_id TEXT REFERENCES public.chapters(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  exam_definition TEXT,
  mnemonic TEXT,
  exam_tip TEXT,
  content_markdown TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3.9 Mock Tests Table (Depends on subjects)
CREATE TABLE IF NOT EXISTS public.mock_tests (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  subject_id TEXT REFERENCES public.subjects(id) ON DELETE SET NULL,
  duration_seconds INTEGER DEFAULT 900,
  total_questions INTEGER DEFAULT 5,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3.10 Mock Test Questions Table (Depends on mock_tests, questions)
CREATE TABLE IF NOT EXISTS public.mock_test_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mock_test_id TEXT REFERENCES public.mock_tests(id) ON DELETE CASCADE,
  question_id TEXT REFERENCES public.questions(id) ON DELETE CASCADE,
  sort_order INTEGER NOT NULL
);

-- ====================================================================
-- 4. USER-SPECIFIC TABLES (Strictly Isolated by auth.uid())
-- ====================================================================

-- 4.1 Question Attempts Table (Depends on auth.users, questions)
CREATE TABLE IF NOT EXISTS public.question_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  question_id TEXT REFERENCES public.questions(id) ON DELETE CASCADE,
  selected_option INTEGER NOT NULL,
  is_correct BOOLEAN NOT NULL,
  time_spent_seconds INTEGER DEFAULT 0,
  attempted_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4.2 Mock Test Attempts Table (Depends on auth.users, mock_tests)
CREATE TABLE IF NOT EXISTS public.mock_test_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  mock_test_id TEXT REFERENCES public.mock_tests(id) ON DELETE SET NULL,
  score_percentage INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  correct_count INTEGER NOT NULL,
  wrong_count INTEGER NOT NULL,
  skipped_count INTEGER NOT NULL,
  duration_seconds INTEGER NOT NULL,
  answers_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4.3 Bookmarks Table (Depends on auth.users, questions)
CREATE TABLE IF NOT EXISTS public.bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  question_id TEXT REFERENCES public.questions(id) ON DELETE CASCADE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_user_bookmark UNIQUE (user_id, question_id)
);

-- 4.4 User Progress Table (Depends on auth.users, subjects)
CREATE TABLE IF NOT EXISTS public.user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subject_id TEXT REFERENCES public.subjects(id) ON DELETE CASCADE,
  questions_solved INTEGER DEFAULT 0,
  correct_answers INTEGER DEFAULT 0,
  mastery_percentage INTEGER DEFAULT 0,
  last_activity_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_user_subject_progress UNIQUE (user_id, subject_id)
);

-- 4.5 Streaks Table (Depends on auth.users)
CREATE TABLE IF NOT EXISTS public.streaks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  current_streak INTEGER DEFAULT 1,
  best_streak INTEGER DEFAULT 1,
  last_activity_date DATE DEFAULT CURRENT_DATE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4.6 Spaced Revision Items Table (Depends on auth.users, questions, subjects)
CREATE TABLE IF NOT EXISTS public.revision_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  question_id TEXT REFERENCES public.questions(id) ON DELETE CASCADE,
  subject_id TEXT REFERENCES public.subjects(id) ON DELETE SET NULL,
  next_review_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '1 day'),
  interval_days INTEGER DEFAULT 1,
  mastery_level INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_user_revision_item UNIQUE (user_id, question_id)
);

-- ====================================================================
-- 5. INDEXES FOR HIGH PERFORMANCE QUERYING
-- ====================================================================
CREATE INDEX IF NOT EXISTS idx_questions_subject ON public.questions(subject_id);
CREATE INDEX IF NOT EXISTS idx_questions_chapter ON public.questions(chapter_id);
CREATE INDEX IF NOT EXISTS idx_question_attempts_user ON public.question_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_question_attempts_q ON public.question_attempts(question_id);
CREATE INDEX IF NOT EXISTS idx_mock_attempts_user ON public.mock_test_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_user ON public.bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_revision_user ON public.revision_items(user_id);

-- ====================================================================
-- 6. ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================

-- 6.1 Enable RLS on ALL tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.question_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.question_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pyqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vvi_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mock_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mock_test_questions ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.question_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mock_test_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.revision_items ENABLE ROW LEVEL SECURITY;

-- 6.2 Public Read Policies for Educational Content (Idempotent)
DROP POLICY IF EXISTS "Public read subjects" ON public.subjects;
CREATE POLICY "Public read subjects" ON public.subjects FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read chapters" ON public.chapters;
CREATE POLICY "Public read chapters" ON public.chapters FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read questions" ON public.questions;
CREATE POLICY "Public read questions" ON public.questions FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read question options" ON public.question_options;
CREATE POLICY "Public read question options" ON public.question_options FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read question answers" ON public.question_answers;
CREATE POLICY "Public read question answers" ON public.question_answers FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read pyqs" ON public.pyqs;
CREATE POLICY "Public read pyqs" ON public.pyqs FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read vvi" ON public.vvi_questions;
CREATE POLICY "Public read vvi" ON public.vvi_questions FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read notes" ON public.notes;
CREATE POLICY "Public read notes" ON public.notes FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read mock tests" ON public.mock_tests;
CREATE POLICY "Public read mock tests" ON public.mock_tests FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read mock test questions" ON public.mock_test_questions;
CREATE POLICY "Public read mock test questions" ON public.mock_test_questions FOR SELECT USING (true);

-- 6.3 Strict User-Isolated Policies for Profiles
DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
CREATE POLICY "Users can read own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- 6.4 Strict User-Isolated Policies for Question Attempts
DROP POLICY IF EXISTS "Users can view own attempts" ON public.question_attempts;
CREATE POLICY "Users can view own attempts" ON public.question_attempts FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own attempts" ON public.question_attempts;
CREATE POLICY "Users can insert own attempts" ON public.question_attempts FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 6.5 Strict User-Isolated Policies for Mock Test Attempts
DROP POLICY IF EXISTS "Users can view own mock attempts" ON public.mock_test_attempts;
CREATE POLICY "Users can view own mock attempts" ON public.mock_test_attempts FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own mock attempts" ON public.mock_test_attempts;
CREATE POLICY "Users can insert own mock attempts" ON public.mock_test_attempts FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 6.6 Strict User-Isolated Policies for Bookmarks
DROP POLICY IF EXISTS "Users can view own bookmarks" ON public.bookmarks;
CREATE POLICY "Users can view own bookmarks" ON public.bookmarks FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own bookmarks" ON public.bookmarks;
CREATE POLICY "Users can insert own bookmarks" ON public.bookmarks FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own bookmarks" ON public.bookmarks;
CREATE POLICY "Users can delete own bookmarks" ON public.bookmarks FOR DELETE USING (auth.uid() = user_id);

-- 6.7 Strict User-Isolated Policies for User Progress
DROP POLICY IF EXISTS "Users can view own progress" ON public.user_progress;
CREATE POLICY "Users can view own progress" ON public.user_progress FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can upsert own progress" ON public.user_progress;
CREATE POLICY "Users can upsert own progress" ON public.user_progress FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 6.8 Strict User-Isolated Policies for Streaks
DROP POLICY IF EXISTS "Users can view own streak" ON public.streaks;
CREATE POLICY "Users can view own streak" ON public.streaks FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can upsert own streak" ON public.streaks;
CREATE POLICY "Users can upsert own streak" ON public.streaks FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 6.9 Strict User-Isolated Policies for Revision Items
DROP POLICY IF EXISTS "Users can view own revision items" ON public.revision_items;
CREATE POLICY "Users can view own revision items" ON public.revision_items FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage own revision items" ON public.revision_items;
CREATE POLICY "Users can manage own revision items" ON public.revision_items FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ====================================================================
-- 7. SAFE USER PROFILE INITIALIZATION TRIGGER
-- (Namespaced to on_pharmaquest_user_created so it never overrides other apps)
-- ====================================================================
CREATE OR REPLACE FUNCTION public.handle_new_pharmaquest_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, college_name, year_of_study)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'college_name', 'Pharmacy College'),
    COALESCE(NEW.raw_user_meta_data->>'year_of_study', 'D.Pharm Part I (ER-2020)')
  )
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.streaks (user_id, current_streak, best_streak, last_activity_date)
  VALUES (NEW.id, 1, 1, CURRENT_DATE)
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_pharmaquest_user_created ON auth.users;
CREATE TRIGGER on_pharmaquest_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_pharmaquest_user();
