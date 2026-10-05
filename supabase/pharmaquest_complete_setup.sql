-- ====================================================================
-- PHARMAQUEST — COMPLETE ALL-IN-ONE SUPABASE DATABASE SETUP
-- PCI ER-2020 D.PHARM PART I MULTI-USER WEB APPLICATION
--
-- Instructions:
-- 1. Open your Supabase Dashboard: https://supabase.com/dashboard
-- 2. Select your Project -> Click "SQL Editor" on the left menu
-- 3. Paste this ENTIRE file into the editor and click "Run"
--
-- This script safely executes:
--   PHASE 1: Creates all 17 tables in strict foreign-key dependency order
--   PHASE 2: Enables Row Level Security (RLS) & user-isolation policies
--   PHASE 3: Configures non-conflicting user onboarding trigger
--   PHASE 4: Seeds official PCI ER-2020 Part I subjects, chapters & questions
-- ====================================================================

-- ====================================================================
-- PHASE 1: EXTENSIONS & 17 TABLES IN DEPENDENCY ORDER
-- ====================================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles (Linked with auth.users)
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

-- Ensure columns exist if table was already created by another application
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS full_name TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS college_name TEXT DEFAULT 'Pharmacy College';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS year_of_study TEXT DEFAULT 'D.Pharm Part I (ER-2020)';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- 2. Subjects (Root Curriculum Table: ER20-11T through ER20-15T)
CREATE TABLE IF NOT EXISTS public.subjects (
  id TEXT PRIMARY KEY,
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

-- 3. Chapters (Foreign Key -> subjects)
CREATE TABLE IF NOT EXISTS public.chapters (
  id TEXT PRIMARY KEY,
  subject_id TEXT REFERENCES public.subjects(id) ON DELETE CASCADE,
  chapter_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  hours INTEGER NOT NULL,
  topics JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Questions (Foreign Key -> subjects, chapters)
CREATE TABLE IF NOT EXISTS public.questions (
  id TEXT PRIMARY KEY,
  subject_id TEXT REFERENCES public.subjects(id) ON DELETE CASCADE,
  chapter_id TEXT REFERENCES public.chapters(id) ON DELETE SET NULL,
  chapter_number INTEGER,
  chapter_title TEXT,
  code_label TEXT,
  question_text TEXT NOT NULL,
  question_type TEXT DEFAULT 'mcq',
  year INTEGER,
  difficulty TEXT DEFAULT 'Medium',
  radar_tag TEXT DEFAULT 'CONCEPTUAL',
  frequency TEXT,
  explanation_mechanism TEXT,
  explanation_key_point TEXT,
  explanation_syllabus_ref TEXT,
  marks INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Question Options (Foreign Key -> questions)
CREATE TABLE IF NOT EXISTS public.question_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id TEXT REFERENCES public.questions(id) ON DELETE CASCADE,
  option_index INTEGER NOT NULL,
  option_key TEXT NOT NULL,
  option_text TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL DEFAULT FALSE
);

-- 6. Question Answers / Model Answers (Foreign Key -> questions)
CREATE TABLE IF NOT EXISTS public.question_answers (
  question_id TEXT PRIMARY KEY REFERENCES public.questions(id) ON DELETE CASCADE,
  correct_option_index INTEGER NOT NULL,
  model_answer TEXT
);

-- 7. PYQs (Previous Years' Questions, Foreign Key -> questions)
CREATE TABLE IF NOT EXISTS public.pyqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id TEXT REFERENCES public.questions(id) ON DELETE CASCADE,
  exam_year INTEGER NOT NULL,
  exam_session TEXT DEFAULT 'Annual',
  marks INTEGER DEFAULT 3
);

-- 8. VVI Questions (Exam Radar, Foreign Key -> questions)
CREATE TABLE IF NOT EXISTS public.vvi_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id TEXT REFERENCES public.questions(id) ON DELETE CASCADE,
  priority_tier TEXT NOT NULL,
  reason TEXT
);

-- 9. Notes & Revision Monographs (Foreign Key -> subjects, chapters)
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

-- 10. Mock Tests (Foreign Key -> subjects)
CREATE TABLE IF NOT EXISTS public.mock_tests (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  subject_id TEXT REFERENCES public.subjects(id) ON DELETE SET NULL,
  duration_seconds INTEGER DEFAULT 900,
  total_questions INTEGER DEFAULT 5,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Mock Test Questions (Foreign Key -> mock_tests, questions)
CREATE TABLE IF NOT EXISTS public.mock_test_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mock_test_id TEXT REFERENCES public.mock_tests(id) ON DELETE CASCADE,
  question_id TEXT REFERENCES public.questions(id) ON DELETE CASCADE,
  sort_order INTEGER NOT NULL
);

-- 12. Question Attempts (Foreign Key -> auth.users, questions)
CREATE TABLE IF NOT EXISTS public.question_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  question_id TEXT REFERENCES public.questions(id) ON DELETE CASCADE,
  selected_option INTEGER NOT NULL,
  is_correct BOOLEAN NOT NULL,
  time_spent_seconds INTEGER DEFAULT 0,
  attempted_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. Mock Test Attempts (Foreign Key -> auth.users, mock_tests)
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

-- 14. Bookmarks (Foreign Key -> auth.users, questions)
CREATE TABLE IF NOT EXISTS public.bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  question_id TEXT REFERENCES public.questions(id) ON DELETE CASCADE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_user_bookmark UNIQUE (user_id, question_id)
);

-- 15. User Progress (Foreign Key -> auth.users, subjects)
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

-- 16. Streaks (Foreign Key -> auth.users)
CREATE TABLE IF NOT EXISTS public.streaks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  current_streak INTEGER DEFAULT 1,
  best_streak INTEGER DEFAULT 1,
  last_activity_date DATE DEFAULT CURRENT_DATE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 17. Revision Items (Foreign Key -> auth.users, questions, subjects)
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
-- PHASE 2: PERFORMANCE INDEXES & ROW LEVEL SECURITY (RLS)
-- ====================================================================
CREATE INDEX IF NOT EXISTS idx_questions_subject ON public.questions(subject_id);
CREATE INDEX IF NOT EXISTS idx_questions_chapter ON public.questions(chapter_id);
CREATE INDEX IF NOT EXISTS idx_question_attempts_user ON public.question_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_question_attempts_q ON public.question_attempts(question_id);
CREATE INDEX IF NOT EXISTS idx_mock_attempts_user ON public.mock_test_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_user ON public.bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_revision_user ON public.revision_items(user_id);

-- Enable RLS
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

-- Idempotent RLS Policies
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

DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
CREATE POLICY "Users can read own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can view own attempts" ON public.question_attempts;
CREATE POLICY "Users can view own attempts" ON public.question_attempts FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own attempts" ON public.question_attempts;
CREATE POLICY "Users can insert own attempts" ON public.question_attempts FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view own mock attempts" ON public.mock_test_attempts;
CREATE POLICY "Users can view own mock attempts" ON public.mock_test_attempts FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own mock attempts" ON public.mock_test_attempts;
CREATE POLICY "Users can insert own mock attempts" ON public.mock_test_attempts FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view own bookmarks" ON public.bookmarks;
CREATE POLICY "Users can view own bookmarks" ON public.bookmarks FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own bookmarks" ON public.bookmarks;
CREATE POLICY "Users can insert own bookmarks" ON public.bookmarks FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own bookmarks" ON public.bookmarks;
CREATE POLICY "Users can delete own bookmarks" ON public.bookmarks FOR DELETE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view own progress" ON public.user_progress;
CREATE POLICY "Users can view own progress" ON public.user_progress FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can upsert own progress" ON public.user_progress;
CREATE POLICY "Users can upsert own progress" ON public.user_progress FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view own streak" ON public.streaks;
CREATE POLICY "Users can view own streak" ON public.streaks FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can upsert own streak" ON public.streaks;
CREATE POLICY "Users can upsert own streak" ON public.streaks FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view own revision items" ON public.revision_items;
CREATE POLICY "Users can view own revision items" ON public.revision_items FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage own revision items" ON public.revision_items;
CREATE POLICY "Users can manage own revision items" ON public.revision_items FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Safe User Profile Initialization Trigger (Namespaced)
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
  ON CONFLICT (id) DO UPDATE SET
    full_name = COALESCE(EXCLUDED.full_name, public.profiles.full_name),
    college_name = COALESCE(EXCLUDED.college_name, public.profiles.college_name),
    year_of_study = COALESCE(EXCLUDED.year_of_study, public.profiles.year_of_study);

  INSERT INTO public.streaks (user_id, current_streak, best_streak, last_activity_date)
  VALUES (NEW.id, 1, 1, CURRENT_DATE)
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE WARNING 'handle_new_pharmaquest_user trigger warning: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_pharmaquest_user_created ON auth.users;
CREATE TRIGGER on_pharmaquest_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_pharmaquest_user();

-- ====================================================================
-- PHASE 3: SEED OFFICIAL PCI ER-2020 CURRICULUM DATA
-- ====================================================================

-- 1. Seed 5 Subjects
INSERT INTO public.subjects (id, theory_code, practical_code, title, accent_color, total_theory_hours, total_tutorial_hours, total_practical_hours, scope)
VALUES
('pharmaceutics', 'ER20-11T', 'ER20-11P', 'Pharmaceutics', '#f59e0b', 75, 25, 75, 'Impart basic knowledge and skills on the art and science of formulating and dispensing different pharmaceutical dosage forms.'),
('chemistry', 'ER20-12T', 'ER20-12P', 'Pharmaceutical Chemistry', '#06b6d4', 75, 25, 75, 'Impart basic knowledge on the chemical structure, storage conditions and medicinal uses of organic and inorganic chemical substances used as drugs.'),
('pharmacognosy', 'ER20-13T', 'ER20-13P', 'Pharmacognosy', '#10b981', 75, 25, 75, 'Impart knowledge on the medicinal uses of various drugs of natural origin, alternative systems of medicine, nutraceuticals, and herbal cosmetics.'),
('hap', 'ER20-14T', 'ER20-14P', 'Human Anatomy & Physiology', '#f43f5e', 75, 25, 75, 'Impart basic knowledge on structure and functions of human body, homeostasis mechanisms and homeostatic imbalances.'),
('social', 'ER20-15T', 'ER20-15P', 'Social Pharmacy', '#8b5cf6', 75, 25, 75, 'Impart basic knowledge on public health, epidemiology, preventive care, and roles of pharmacists in public health programs.')
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  scope = EXCLUDED.scope,
  total_theory_hours = EXCLUDED.total_theory_hours,
  total_tutorial_hours = EXCLUDED.total_tutorial_hours,
  total_practical_hours = EXCLUDED.total_practical_hours;

-- 2. Seed Chapters
INSERT INTO public.chapters (id, subject_id, chapter_number, title, hours, topics)
VALUES
('pc-ch-01', 'pharmaceutics', 1, 'History of Pharmacy & Pharmacopoeias', 7, '["History of profession of Pharmacy in India", "Pharmacy as a career", "Introduction to IP, BP, USP, NF, Extra Pharmacopoeia", "Salient features of IP"]'::jsonb),
('pc-ch-02', 'pharmaceutics', 2, 'Packaging Materials', 5, '["Types, selection criteria, advantages and disadvantages of glass, plastic, metal, rubber"]'::jsonb),
('pc-ch-03', 'pharmaceutics', 3, 'Pharmaceutical Aids & Preservatives', 3, '["Organoleptic agents (Colouring, flavouring, sweetening)", "Preservatives: Definition, types with examples and uses"]'::jsonb),
('pc-ch-04', 'pharmaceutics', 4, 'Unit Operations', 9, '["Size reduction (hammer mill, ball mill)", "Size separation (cyclone separator, sieves IP)", "Mixing (double cone blender, silverson mixer)", "Filtration", "Drying (fluidized bed dryer, freeze drying)", "Extraction"]'::jsonb),
('pc-ch-05', 'pharmaceutics', 5, 'Pharmaceutical Dosage Forms', 37, '["Tablets (8h)", "Capsules (4h)", "Liquid oral preparations (6h)", "Topical preparations (8h)", "Nasal & Ear (2h)", "Powders & granules (3h)", "Sterile formulations (6h)", "Immunological products (4h)"]'::jsonb),
('pc-ch-06', 'pharmaceutics', 6, 'Plant Layout & Quality Management', 5, '["Basic structure, layout of manufacturing plants", "Quality control and quality assurance, cGMP, calibration, validation"]'::jsonb),
('pc-ch-07', 'pharmaceutics', 7, 'Novel Drug Delivery Systems (NDDS)', 5, '["Introduction, Classification with examples, advantages, and challenges"]'::jsonb),

('ch-ch-01', 'chemistry', 1, 'Introduction, Errors & Limit Tests', 8, '["Scope & objectives", "Sources & types of errors", "Impurities in Pharmaceuticals & Limit tests (chlorides, sulphates, iron, heavy metals, arsenic)"]'::jsonb),
('ch-ch-02', 'chemistry', 2, 'Volumetric & Gravimetric Analysis', 8, '["Acid-base, non-aqueous, precipitation, complexometric, redox titrations", "Gravimetric analysis"]'::jsonb),
('ch-ch-03', 'chemistry', 3, 'Inorganic Pharmaceuticals', 7, '["Haematinics", "Gastro-intestinal agents", "Topical agents", "Dental products", "Medicinal gases"]'::jsonb),
('ch-ch-04', 'chemistry', 4, 'Nomenclature of Heterocyclic Compounds', 2, '["Nomenclature of organic chemical systems containing up to three rings"]'::jsonb),
('ch-ch-05', 'chemistry', 5, 'Drugs Acting on Central Nervous System', 9, '["Anaesthetics (Thiopental Sodium*, Ketamine HCl*)", "Sedatives & Hypnotics (Diazepam*)", "Antipsychotics", "Anticonvulsants (Phenytoin*)", "Anti-Depressants"]'::jsonb),
('ch-ch-11', 'chemistry', 11, 'Anti-Infective Agents', 12, '["Antifungal, Urinary tract anti-infectives", "Anti-Tubercular (INH*, Ethambutol*)", "Antiviral, Antimalarials, Sulfonamides"]'::jsonb),

('cg-ch-01', 'pharmacognosy', 1, 'Definition, History & Scope', 2, '["Scope and historical development of Pharmacognosy"]'::jsonb),
('cg-ch-02', 'pharmacognosy', 2, 'Classification of Crude Drugs', 4, '["Alphabetical, Taxonomical, Morphological, Pharmacological, Chemical, Chemo-taxonomical"]'::jsonb),
('cg-ch-04', 'pharmacognosy', 4, 'Primary & Secondary Metabolites', 6, '["Alkaloids, Glycosides, Tannins, Volatile oils, Resins"]'::jsonb),
('cg-ch-05', 'pharmacognosy', 5, 'Biological Source, Chemistry & Efficacy', 50, '["Laxatives (Senna, Aloe)", "Cardiotonics (Digitalis)", "Carminatives", "Astringents", "Antihypertensives (Rauwolfia)"]'::jsonb),

('ha-ch-01', 'hap', 1, 'Scope of Anatomy & Elementary Tissues', 4, '["Definition, anatomical terms, cellular components, primary tissues"]'::jsonb),
('ha-ch-05', 'hap', 5, 'Haemopoietic System', 8, '["Composition and functions of blood", "Blood groups", "Blood clotting mechanism and disorders"]'::jsonb),
('ha-ch-07', 'hap', 7, 'Cardiovascular System', 8, '["Anatomy of heart, blood vessels, cardiac cycle, conduction system, ECG basics"]'::jsonb),

('sp-ch-01', 'social', 1, 'Introduction to Social Pharmacy', 5, '["Definition, scope, National Health Policy, Millenium Development Goals, WHO concepts"]'::jsonb),
('sp-ch-02', 'social', 2, 'Preventive Healthcare & Environment', 18, '["Nutrition, Balanced diet, Micronutrient deficiencies", "Immunization schedules, vaccines"]'::jsonb),
('sp-ch-04', 'social', 4, 'Microbiology, Epidemiology & Communicable Diseases', 28, '["Causative agents, epidemiology, and prevention of tuberculosis, dengue, malaria, AIDS"]'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- 3. Seed Questions
INSERT INTO public.questions (id, subject_id, chapter_id, chapter_number, chapter_title, code_label, question_text, question_type, year, difficulty, radar_tag, frequency, explanation_mechanism, explanation_key_point, explanation_syllabus_ref, marks)
VALUES
('q-pc-01', 'pharmaceutics', 'pc-ch-01', 1, 'History of Pharmacy & Pharmacopoeias', 'ER20-11T #014', 'Which edition of the Indian Pharmacopoeia (IP) was first published, and who was the chairman of the committee?', 'pyq', 2024, 'Medium', 'HIGH PRIORITY', 'Appeared 4 times in 2021–2024', 'The First Edition of the Indian Pharmacopoeia was published in 1955 under the chairmanship of Dr. B. N. Ghosh by the Ministry of Health, Government of India.', 'Historical landmark: 1955 = 1st Edition (Dr. B. N. Ghosh). Supplement in 1960.', 'ER20-11T Chapter 1: History of Pharmacy in India & Salient features of IP.', 3),
('q-pc-02', 'pharmaceutics', 'pc-ch-04', 4, 'Unit Operations', 'ER20-11T #028', 'In a Ball Mill, size reduction predominantly occurs through which combination of physical mechanisms?', 'mcq', 2023, 'Hard', 'CONCEPTUAL', 'Board Exam 2023', 'In a ball mill, when the cylinder rotates at optimum speed, cascading balls impart impact and shearing/attrition.', 'Hammer mill = Impact only. Ball mill = Both Impact and Attrition.', 'ER20-11T Chapter 4: Size reduction: hammer mill and ball mill.', 1),
('q-pc-03', 'pharmaceutics', 'pc-ch-05', 5, 'Pharmaceutical Dosage Forms', 'ER20-11T #042', 'What is the primary difference between a hard gelatin capsule and a soft gelatin capsule regarding their plasticizer-to-gelatin ratio?', 'pyq', 2023, 'Medium', 'REPEATED', 'Repeated in 2022 & 2023', 'Soft gelatin capsules require high flexibility achieved by adding glycerol/sorbitol in a ratio of approximately 0.8:1, whereas hard gelatin has ~0.4:1.', 'Soft gel = High plasticizer (flexible, hermetically sealed in single step).', 'ER20-11T Chapter 5: Capsules – hard and soft gelatine capsules.', 3),
('q-pc-04', 'pharmaceutics', 'pc-ch-04', 4, 'Unit Operations', 'ER20-11T #055', 'Freeze drying (Lyophilization) is based on which fundamental thermodynamic phenomenon?', 'vvi', 2022, 'Hard', 'MUST REVISE', 'Core VVI Question', 'Lyophilization operates below the triple point of water (0.01°C and 4.58 mmHg). Moisture frozen into ice is removed directly by sublimation into water vapor without passing through the liquid phase.', 'Direct Solid -> Gas transition without liquid phase = Sublimation.', 'ER20-11T Chapter 4: Drying: working of fluidized bed dryer and process of freeze drying.', 5),

('q-ch-01', 'chemistry', 'ch-ch-01', 1, 'Introduction, Errors & Limit Tests', 'ER20-12T #019', 'In the Limit Test for Iron as per the Indian Pharmacopoeia, which reagent is added to prevent precipitation of iron as ferrous hydroxide?', 'pyq', 2024, 'Medium', 'HIGH PRIORITY', 'Annual Sessional & Final 2024', 'Citric acid complexes with iron to prevent premature precipitation as ferrous hydroxide when made alkaline by ammonia. Thioglycolic acid then reacts with Fe2+ to produce purple colored ferrous thioglycolate.', 'Citric Acid = Prevents precipitation. Thioglycolic Acid = Color-forming reducing agent.', 'ER20-12T Chapter 1: Limit tests for iron.', 3),
('q-ch-02', 'chemistry', 'ch-ch-05', 5, 'Drugs Acting on Central Nervous System', 'ER20-12T #033', 'Phenytoin* (starred compound in syllabus) belongs chemically to which heterocyclic ring system?', 'mcq', 2023, 'Medium', 'MUST REVISE', 'Board Exam 2023', 'Phenytoin is 5,5-diphenylhydantoin (5,5-diphenylimidazolidine-2,4-dione). It is a first-line anticonvulsant that stabilizes voltage-gated sodium channels.', 'Phenytoin = Hydantoin derivative. Starred (*) in ER20-12T syllabus.', 'ER20-12T Chapter 5: Anticonvulsants: Phenytoin*.', 1),
('q-ch-03', 'chemistry', 'ch-ch-11', 11, 'Anti-Infective Agents', 'ER20-12T #062', 'Isoniazid (INH*) is a first-line anti-tubercular agent chemically classified as:', 'vvi', 2024, 'Hard', 'HIGH PRIORITY', 'Must revise VVI', 'INH (Isoniazid) is the hydrazide of isonicotinic acid (Pyridine-4-carbohydrazide). It inhibits mycolic acid synthesis in the Mycobacterium tuberculosis cell wall after activation by KatG.', 'Pyridine ring + -CONHNH2 group at position 4. Starred compound in syllabus.', 'ER20-12T Chapter 11: Anti-Tubercular Agents: INH*.', 3),

('q-cg-01', 'pharmacognosy', 'cg-ch-05', 5, 'Biological Source, Chemistry & Efficacy', 'ER20-13T #011', 'What is the biological source and active chemical class of Senna?', 'pyq', 2024, 'Easy', 'REPEATED', 'Repeated in 2021, 2022, 2023, 2024', 'Senna consists of dried leaflets of Cassia senna or Cassia angustifolia, family Leguminosae. It contains Sennoside A and B which are stimulant anthraquinone laxatives.', 'Cassia angustifolia / Leguminosae / Anthraquinone glycosides / Laxative.', 'ER20-13T Chapter 5: Laxatives: Aloe, Castor oil, Ispaghula, Senna.', 3),
('q-cg-02', 'pharmacognosy', 'cg-ch-05', 5, 'Biological Source, Chemistry & Efficacy', 'ER20-13T #035', 'Which chemical test is used for the detection of Anthraquinone glycosides in Senna leaves?', 'mcq', 2023, 'Medium', 'CONCEPTUAL', 'Board Exam 2023', 'In Borntrager test, powder is boiled with dilute acid, filtered, extracted with organic solvent, and shaken with dilute ammonia. A rose pink or cherry red color confirms free anthraquinones.', 'Keller-Kiliani = Deoxy sugars (Digitalis). Borntrager = Anthraquinones (Senna).', 'ER20-13T Chapter 4 & 5: Identification tests of glycosides; Laxatives.', 1),

('q-ha-01', 'hap', 'ha-ch-07', 7, 'Cardiovascular System', 'ER20-14T #007', 'In the cardiac conduction system of the human heart, what is the natural pacemaker and what is its typical intrinsic firing rate?', 'pyq', 2024, 'Medium', 'HIGH PRIORITY', 'Universal D.Pharm Exam Question', 'The Sinoatrial (SA) node located in the superior wall of the right atrium initiates rhythmic action potentials at 60–100 impulses per minute, making it the primary physiological pacemaker.', 'SA Node -> AV Node -> Bundle of His -> Purkinje Fibers.', 'ER20-14T Chapter 7: Anatomy and Physiology of heart, Cardiac cycle and Heart sounds.', 3),
('q-ha-02', 'hap', 'ha-ch-05', 5, 'Haemopoietic System', 'ER20-14T #022', 'Which blood clotting factor is known as the Stuart-Prower factor in the coagulation cascade?', 'mcq', 2023, 'Easy', 'MUST REVISE', 'Annual Exam 2023', 'Factor X is the Stuart-Prower factor. Its activation to Factor Xa is the convergence point where intrinsic and extrinsic pathways merge into the common pathway to activate prothrombin to thrombin.', 'Factor X = Stuart-Prower factor. Factor I = Fibrinogen. Factor II = Prothrombin.', 'ER20-14T Chapter 5: Mechanism of Blood Clotting.', 1),

('q-sp-01', 'social', 'sp-ch-02', 2, 'Preventive Healthcare & Environment', 'ER20-15T #016', 'Under the National Immunization Schedule (NIS) in India, which vaccines are administered at birth to a newborn?', 'pyq', 2024, 'Medium', 'HIGH PRIORITY', 'Board Exam 2024', 'At birth, the child receives three primary immunizations: BCG against tuberculosis (intradermal), Oral Polio Vaccine (OPV zero dose), and Hepatitis B birth dose (intramuscular within 24 hours).', 'Birth doses: BCG + OPV 0 + Hep-B (within 24 hrs).', 'ER20-15T Chapter 2: Overview of Vaccines, types of immunity and immunization.', 3),
('q-sp-02', 'social', 'sp-ch-04', 4, 'Microbiology, Epidemiology & Communicable Diseases', 'ER20-15T #039', 'Which vector transmits Dengue and Chikungunya fevers in humans?', 'mcq', 2023, 'Medium', 'CONCEPTUAL', 'National Health Program Section', 'Aedes aegypti (day-biting mosquito) is the primary biological vector for Dengue virus (Flaviviridae) and Chikungunya virus (Togaviridae). Anopheles transmits Malaria; Culex transmits Filariasis.', 'Aedes aegypti = Dengue / Chikungunya. Anopheles = Malaria. Culex = Filariasis.', 'ER20-15T Chapter 4: Causative agents, epidemiology and prevention of Dengue and Malaria.', 1)
ON CONFLICT (id) DO NOTHING;

-- 4. Seed Options for Questions
INSERT INTO public.question_options (question_id, option_index, option_key, option_text, is_correct)
VALUES
('q-pc-01', 0, 'A', '1955, Dr. B. N. Ghosh', true),
('q-pc-01', 1, 'B', '1966, Dr. B. Mukerji', false),
('q-pc-01', 2, 'C', '1985, Dr. Nitya Anand', false),
('q-pc-01', 3, 'D', '1948, Dr. Ram Nath Chopra', false),

('q-pc-02', 0, 'A', 'Impact only', false),
('q-pc-02', 1, 'B', 'Attrition only', false),
('q-pc-02', 2, 'C', 'Both Impact and Attrition', true),
('q-pc-02', 3, 'D', 'Cutting and shearing', false),

('q-pc-03', 0, 'A', 'Hard gelatin capsules contain more plasticizer than soft gelatin capsules', false),
('q-pc-03', 1, 'B', 'Soft gelatin capsules contain a higher plasticizer-to-gelatin ratio (0.8:1) to maintain flexibility', true),
('q-pc-03', 2, 'C', 'Soft gelatin capsules contain zero plasticizer', false),
('q-pc-03', 3, 'D', 'Both hard and soft gelatin capsules have identical plasticizer ratios', false),

('q-pc-04', 0, 'A', 'Condensation at atmospheric pressure', false),
('q-pc-04', 1, 'B', 'Sublimation of ice to vapor below the triple point of water', true),
('q-pc-04', 2, 'C', 'Evaporation by convection current', false),
('q-pc-04', 3, 'D', 'Adiabatic flash drying', false),

('q-ch-01', 0, 'A', 'Thioglycolic acid', false),
('q-ch-01', 1, 'B', 'Citric acid (Iron-free)', true),
('q-ch-01', 2, 'C', 'Ammonia solution', false),
('q-ch-01', 3, 'D', 'Lead acetate cotton', false),

('q-ch-02', 0, 'A', 'Barbiturate ring', false),
('q-ch-02', 1, 'B', 'Hydantoin (Imidazolidinedione) ring', true),
('q-ch-02', 2, 'C', 'Benzodiazepine ring', false),
('q-ch-02', 3, 'D', 'Phenothiazine ring', false),

('q-ch-03', 0, 'A', 'Isonicotinic acid hydrazide (Pyridine derivative)', true),
('q-ch-03', 1, 'B', 'Diaminodiphenyl sulfone (Aniline derivative)', false),
('q-ch-03', 2, 'C', 'Fluoroquinolone derivative', false),
('q-ch-03', 3, 'D', 'Purine analogue', false),

('q-cg-01', 0, 'A', 'Dried leaflets of Cassia angustifolia (Family: Leguminosae) containing Anthraquinone glycosides (Sennoside A & B)', true),
('q-cg-01', 1, 'B', 'Dried leaves of Digitalis purpurea (Family: Scrophulariaceae) containing Cardiac glycosides', false),
('q-cg-01', 2, 'C', 'Dried rhizomes of Zingiber officinale containing Volatile oils', false),
('q-cg-01', 3, 'D', 'Dried bark of Cinchona calisaya containing Quinoline alkaloids', false),

('q-cg-02', 0, 'A', 'Keller-Kiliani test', false),
('q-cg-02', 1, 'B', 'Borntrager test (Modified Borntrager for C-glycosides)', true),
('q-cg-02', 2, 'C', 'Mayer reagent test', false),
('q-cg-02', 3, 'D', 'Shinoda test', false),

('q-ha-01', 0, 'A', 'Atrioventricular (AV) node, 40–60 bpm', false),
('q-ha-01', 1, 'B', 'Sinoatrial (SA) node, 60–100 bpm', true),
('q-ha-01', 2, 'C', 'Bundle of His, 30–40 bpm', false),
('q-ha-01', 3, 'D', 'Purkinje fibers, 15–20 bpm', false),

('q-ha-02', 0, 'A', 'Factor VIII', false),
('q-ha-02', 1, 'B', 'Factor IX', false),
('q-ha-02', 2, 'C', 'Factor X', true),
('q-ha-02', 3, 'D', 'Factor XII', false),

('q-sp-01', 0, 'A', 'BCG, OPV-0, Hepatitis B birth dose', true),
('q-sp-01', 1, 'B', 'DPT, Rotavirus, PCV', false),
('q-sp-01', 2, 'C', 'Measles-Rubella, Vitamin A', false),
('q-sp-01', 3, 'D', 'TT-1, Pentavalent', false),

('q-sp-02', 0, 'A', 'Anopheles stephensi', false),
('q-sp-02', 1, 'B', 'Aedes aegypti', true),
('q-sp-02', 2, 'C', 'Culex quinquefasciatus', false),
('q-sp-02', 3, 'D', 'Mansonia annulifera', false)
ON CONFLICT DO NOTHING;

-- 5. Seed Question Model Answers
INSERT INTO public.question_answers (question_id, correct_option_index, model_answer)
VALUES
('q-pc-01', 0, 'The First Edition of the Indian Pharmacopoeia was compiled by the IP Committee constituted in 1948 under the chairmanship of Dr. B. N. Ghosh and officially published in 1955.'),
('q-pc-02', 2, 'Size reduction in ball mill operates simultaneously by impact (falling balls) and attrition (balls rolling against one another). Critical speed maintains proper cascading.'),
('q-pc-03', 1, 'Soft gelatin capsules use a higher plasticizer-to-gelatin ratio (~0.8:1) using glycerol, sorbitol or propylene glycol to ensure elasticity and airtight seal.'),
('q-pc-04', 1, 'Lyophilization sublimates frozen water below the triple point (0.01°C, 4.58 mmHg), protecting thermolabile biological products like vaccines and antibiotics.'),
('q-ch-01', 1, 'Citric acid prevents precipitation of iron by ammonia by forming a soluble iron-citrate complex. Thioglycolic acid reduces Fe3+ to Fe2+ to yield purple ferrous thioglycolate.'),
('q-ch-02', 1, 'Phenytoin is 5,5-diphenylhydantoin, an anticonvulsant that delays sodium channel reactivation to block high-frequency neuronal firing.'),
('q-ch-03', 0, 'Isoniazid is isonicotinic acid hydrazide. It stops cell-wall mycolic acid formation in Mycobacterium tuberculosis.'),
('q-cg-01', 0, 'Senna consists of leaflets of Cassia angustifolia (Tinnevelly) or Cassia acutifolia (Alexandrian), Leguminosae, rich in Sennosides A & B.'),
('q-cg-02', 1, 'Borntrager test yields a distinct rose-pink or red color in the ammoniacal layer in the presence of free anthraquinone aglycones.'),
('q-ha-01', 1, 'The SA node in the right atrium possesses the highest automaticity (60–100 bpm) and depolarizes first to set the physiological heart rate.'),
('q-ha-02', 2, 'Factor X (Stuart-Prower factor) activates prothrombin (Factor II) to thrombin (Factor IIa) in the presence of Factor V, Ca2+ and phospholipids.'),
('q-sp-01', 0, 'Under the Indian National Immunization Schedule, BCG, zero dose OPV, and birth-dose Hepatitis B are administered within 24 hours of birth.'),
('q-sp-02', 1, 'Aedes aegypti mosquitoes with characteristic white markings on legs transmit Dengue and Chikungunya arboviruses.')
ON CONFLICT (question_id) DO NOTHING;

-- 6. Seed PYQs
INSERT INTO public.pyqs (question_id, exam_year, exam_session, marks)
VALUES
('q-pc-01', 2024, 'Annual Board Exam', 3),
('q-pc-03', 2023, 'Sessional Exam', 3),
('q-ch-01', 2024, 'Annual Board Exam', 3),
('q-cg-01', 2024, 'Supplementary Exam', 3),
('q-ha-01', 2024, 'Annual Board Exam', 3),
('q-sp-01', 2024, 'Annual Board Exam', 3)
ON CONFLICT DO NOTHING;

-- 7. Seed VVI Exam Radar Questions
INSERT INTO public.vvi_questions (question_id, priority_tier, reason)
VALUES
('q-pc-01', 'TIER 1 (MUST REVISE)', 'Repeated in 4 consecutive exam cycles across state boards'),
('q-pc-04', 'TIER 1 (MUST REVISE)', 'Core thermodynamic unit operation question in pharmaceutics'),
('q-ch-01', 'TIER 1 (MUST REVISE)', 'Mandatory inorganic limit test question with exact reagent roles'),
('q-ch-03', 'TIER 1 (MUST REVISE)', 'Starred (*) structure compound in anti-infectives syllabus'),
('q-cg-01', 'TIER 2 (HIGH PROBABILITY)', 'Standard biological source and chemical class question'),
('q-ha-01', 'TIER 1 (MUST REVISE)', 'Fundamental physiology diagram and conduction system question'),
('q-sp-01', 'TIER 1 (MUST REVISE)', 'National Health Programme Immunization schedule priority')
ON CONFLICT DO NOTHING;

-- 8. Seed Mock Test
INSERT INTO public.mock_tests (id, title, subject_id, duration_seconds, total_questions, description)
VALUES
('mock-er20-01', 'D.Pharm Part I Comprehensive Sessional Assessment', 'pharmaceutics', 900, 5, 'Full-spectrum ER-2020 sessional mock assessment covering Pharmaceutics, Chemistry, Pharmacognosy, HAP, and Social Pharmacy.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.mock_test_questions (mock_test_id, question_id, sort_order)
VALUES
('mock-er20-01', 'q-pc-01', 1),
('mock-er20-01', 'q-pc-02', 2),
('mock-er20-01', 'q-ch-01', 3),
('mock-er20-01', 'q-cg-01', 4),
('mock-er20-01', 'q-ha-01', 5)
ON CONFLICT DO NOTHING;
