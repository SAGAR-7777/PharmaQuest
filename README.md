# PHARMAQUEST — D.PHARM DIGITAL PHARMACY LAB
### Real Multi-User Web Application Grounded in PCI ER-2020 Part I Syllabus

PHARMAQUEST is a dark-first, scientific digital laboratory web application designed specifically for Diploma in Pharmacy (D.Pharm) students. It integrates real multi-user authentication, user-isolated progress tracking via Supabase with Row Level Security (RLS), and a secure server-side AI assistant.

---

## 1. Quick Start

### 1.1 Prerequisites
- **Node.js**: v18+ (tested on Node v24)
- Modern web browser (Chrome, Edge, Firefox, Safari)

### 1.2 Installation & Launch
```bash
# 1. Clone or open the repository directory
cd "c:\Users\Sagar\Documents\d pharma"

# 2. Configure your environment variables
copy .env.example .env

# 3. Start the application server
node server.js
```
Open **`http://127.0.0.1:3000`** in your browser.

---

## 2. Supabase Database & Multi-User Isolation

PHARMAQUEST uses Supabase for authentication and PostgreSQL data storage with strict **Row Level Security (RLS)**.

### 2.1 Supabase Tables Schema
The database architecture cleanly separates **Educational Content** from **User-Specific Records**:

#### Educational Content (Public Read):
- `subjects`: 5 foundational PCI ER-2020 courses (`ER20-11T/P` to `ER20-15T/P`).
- `chapters`: Official chapter breakdowns with PCI allocated hours.
- `questions`: Question bank with codes, difficulty, and 3-part mechanisms.
- `question_options`: Multiple choice options with correctness tags.
- `question_answers`: Monograph and examiner model answers.
- `pyqs`: Previous Years' Questions mapped by year (2021–2024).
- `vvi_questions`: Exam Radar high-priority and repeated questions.
- `notes`: Textbook-grade summaries, mnemonics, and exam tips.
- `mock_tests` & `mock_test_questions`: Sessional assessment structures.

#### User-Specific Data (Strictly Isolated by `auth.uid()`):
- `profiles`: User account details, college name, and year of study.
- `question_attempts`: Every question solved, selected option, correctness, and time spent.
- `mock_test_attempts`: Sessional test history, score percentage, and time taken.
- `bookmarks`: User's saved questions in their Revision Vault.
- `user_progress`: Subject-wise mastery and accuracy calculated from real attempts.
- `streaks`: Consecutive daily practice streak tracking.
- `revision_items`: Spaced repetition review schedule (24h, 3 days, 7+ days).

### 2.2 Running Migrations in Supabase
1. Log in to [Supabase](https://supabase.com/dashboard) and open your project.
2. Open your project's **SQL Editor** on the left navigation bar.
3. **Recommended (Single Step)**:
   Copy and execute the all-in-one setup script:
   [`supabase/pharmaquest_complete_setup.sql`](file:///c:/Users/Sagar/Documents/d%20pharma/supabase/pharmaquest_complete_setup.sql)
   *(This creates all 17 tables in strict dependency order, configures indexes, sets up RLS, applies the non-conflicting user trigger, and seeds all 5 ER-2020 courses in a single run.)*
4. **Alternative (Two-Step Flow)**:
   - First run schema migration: [`supabase/migrations/20261005_init_pharmaquest_schema.sql`](file:///c:/Users/Sagar/Documents/d%20pharma/supabase/migrations/20261005_init_pharmaquest_schema.sql)
   - Then run seed script: [`supabase/seed.sql`](file:///c:/Users/Sagar/Documents/d%20pharma/supabase/seed.sql)
5. Retrieve your project credentials from **Project Settings $\rightarrow$ API**:
   - `Project URL`
   - `Anon Public Key`
6. Add them to your `.env` file:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```
7. Restart the local server (`node server.js`).

---

## 3. Real Authentication Flow

1. **Sign Up**:
   - Click **JOIN LAB** in the header.
   - Enter your Full Name, College/Institution, Email, and Password.
   - Creates account in `auth.users` and triggers automatic profile initialization in `public.profiles`.
2. **Sign In**:
   - Click **SIGN IN** in the header.
   - Enter your credentials.
   - Syncs your real question attempts, bookmarks, and streaks.
3. **Multi-User Isolation Guarantee**:
   - User A logs in, solves 5 questions, bookmarks 2 questions, and takes a mock test.
   - User B logs in on the same browser (or another device) $\rightarrow$ User B sees **0 attempts**, **0 bookmarks**, and their own isolated stats.
   - Supabase RLS enforces that `auth.uid() = user_id` for all queries.

---

## 4. Secure Server-Side AI Assistant (Pharma AI powered by Groq)

The AI assistant provides ultra-fast, context-aware D.Pharm exam guidance powered exclusively by Groq LPU inference using the official `groq-sdk` package without ever exposing your API key to client-side code:

1. **Proxy Endpoint**: `POST /api/ai/chat` in `server.js`.
2. **Groq Model**: Configured to `llama-3.3-70b-versatile` by default (configurable via `GROQ_MODEL`).
3. **Configuration**:
   - Obtain a Groq API key from [GroqCloud Console](https://console.groq.com/keys).
   - Add it to `.env`:
     ```env
     GROQ_API_KEY=gsk_your_groq_api_key_here
     GROQ_MODEL=llama-3.3-70b-versatile
     ```
   - Restart or send a request to `server.js`.
4. **Structured JSON Output Format**:
   - *Simple Explanation*
   - *Exam Model Answer*
   - *Key Points*
   - *PCI Viva Tip*
   - *Next Step Practice*
5. **Graceful Fallback**: If `GROQ_API_KEY` is not configured, the assistant displays a clear configuration banner without crashing.
6. **Security Guarantee**:
   - The Groq API key is strictly server-side and is never exposed in client scripts, localStorage, or headers.
   - `NEXT_PUBLIC_GROQ_API_KEY` is not used.

---

## 5. Testing the User Flow

1. **Guest Browsing**: Explore the **Subject Orbit**, browse all 5 courses, inspect practical lab notebooks and crude drugs without logging in.
2. **Account Creation**: Click **JOIN LAB**, enter credentials, and watch the header update with your initials badge (e.g. `AS`) and personal streak.
3. **Practice & Attempt Logging**: Open the **Practice** screen or **PYQ Explorer**, submit an answer. Your attempt is written directly to the database.
4. **Bookmarking**: Click **☆ Save** on any question $\rightarrow$ question is securely saved to your personal **Revision Vault**.
5. **Mock Test**: Enter **Mock Exam**, complete questions, and click **SUBMIT ASSESSMENT**. Your score and accuracy ring are recorded to `mock_test_attempts`.
6. **Multi-User Check**: Click **SIGN OUT**, create a second account, and confirm that all counters reset to zero for the new user.
