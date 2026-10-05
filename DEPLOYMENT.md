# PHARMAQUEST — Production Deployment Guide
**Architecture: Frontend on Vercel | Backend on Render | AI on Groq | Database & Auth on Supabase**

---

## 🏗️ Architecture Overview

```
                      ┌───────────────────────────────────────────────┐
                      │              USER WEB BROWSER                 │
                      └──────────────┬─────────────────▲──────────────┘
                                     │                 │
            1. Static UI Assets      │                 │ 2. Direct Auth & Data
          (HTML, CSS, ES Modules)    │                 │ (CDN Client SDK)
                                     ▼                 │
                         ┌──────────────────────┐      │
                         │   VERCEL (Frontend)  │      │
                         │   pharmaquest.vercel.│      │
                         │         app          │      │
                         └──────────────────────┘      │
                                                       │
                                                       │
                 ┌─────────────────────────────────────┴───────┐
                 │                                             │
                 ▼                                             ▼
  ┌───────────────────────────────┐             ┌───────────────────────────────┐
  │        RENDER (Backend)       │             │       SUPABASE (Cloud)        │
  │   pharmaquest.onrender.com    │             │   ywfpnkkpxfeqboyggrsp.       │
  │                               │             │         supabase.co           │
  │ • Node.js Native HTTP Server  │             │ • PostgreSQL Database         │
  │ • GET /api/health             │             │ • Supabase Auth               │
  │ • GET /api/config             │             │ • Row Level Security (RLS)    │
  │ • POST /api/ai/chat           │             │ • Storage & Realtime          │
  └──────────────┬────────────────┘             └───────────────────────────────┘
                 │
                 │ 3. Server-Side Inference
                 │    (API Key Protected)
                 ▼
  ┌───────────────────────────────┐
  │        GROQ CLOUD LPU         │
  │   api.groq.com (OpenAI-compat)│
  │   Model: qwen/qwen3.8-27b     │
  └───────────────────────────────┘
```

---

## 🔑 Environment Variables Breakdown

It is critical to configure environment variables in the right location. Never place secret backend keys in frontend hosting.

### 1. Render (Backend Web Service) — Private Server Environment
Configure these in **Render Dashboard** → **Your Web Service** → **Environment**:

| Variable Name | Required | Example / Default | Description |
|---|---|---|---|
| `PORT` | Auto | Provided by Render | Render automatically sets this (e.g. `10000`). `server.js` listens on this port. |
| `GROQ_API_KEY` | **Yes** | `gsk_...` | Your secret Groq API key from [Groq Console](https://console.groq.com/keys). **Never expose to browser!** |
| `GROQ_MODEL` | Optional | `qwen/qwen3.8-27b` | Active Groq model. |
| `NEXT_PUBLIC_SUPABASE_URL` | **Yes** | `https://xyz.supabase.co` | Your Supabase project URL (served to client via `/api/config`). |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | **Yes** | `sb_publishable_...` | Supabase publishable/anon key (safe for public clients). |
| `ALLOWED_ORIGIN` | Optional | `https://your-app.vercel.app` | Production CORS allowed origin. Defaults to `*` if left blank. |

### 2. Vercel (Frontend Static Host)
The frontend is pure static HTML/CSS/JavaScript with ES Modules.
- It requires **no serverless functions** on Vercel.
- The API base URL is configured either in `js/config.js` or `index.html`.

---

## 🚀 Step-by-Step Deployment Instructions

### Step 1: Push Code to GitHub
Ensure you are in the project root:
```bash
git add .
git commit -m "chore: prepare for Vercel + Render production deployment"
git push origin main
```
> **Security Check**: Your `.gitignore` automatically prevents `.env`, `.env.local`, and sensitive credentials from being committed. Verify with `git status` that `.env` is untracked.

---

### Step 2: Deploy Backend to Render

1. Log in to [Render Dashboard](https://dashboard.render.com/).
2. Click **New +** → **Web Service**.
3. Connect your GitHub repository: `SAGAR-7777/PharmaQuest` (or your repository).
4. Configure the Web Service settings:
   - **Name**: `pharmaquest-backend` (or your desired name)
   - **Region**: Choose the closest region (e.g., Singapore, Frankfurt, Oregon)
   - **Branch**: `main`
   - **Root Directory**: Leave blank (root of repo)
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start` (or `node server.js`)
   - **Instance Type**: `Free`
5. Scroll down to **Environment Variables** and add:
   - `GROQ_API_KEY`: *(paste your secret `gsk_...` key)*
   - `GROQ_MODEL`: `qwen/qwen3.8-27b`
   - `NEXT_PUBLIC_SUPABASE_URL`: *(your Supabase URL)*
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: *(your Supabase anon key)*
   - `ALLOWED_ORIGIN`: `*` *(or your Vercel URL once known)*
6. Click **Create Web Service**.
7. Wait for deployment to complete. Once finished, Render will display your service URL:
   ```
   https://pharmaquest.onrender.com
   ```

---

### Step 3: Verify Render Backend Health Check

Open your browser or terminal and test the health endpoint:
```bash
curl https://pharmaquest.onrender.com/api/health
```
**Expected Response:**
```json
{"status":"ok","app":"PHARMAQUEST"}
```

Test the safe config endpoint:
```bash
curl https://pharmaquest.onrender.com/api/config
```
**Expected Response:**
```json
{
  "supabaseUrl": "https://...",
  "supabaseAnonKey": "sb_publishable_...",
  "aiConfigured": true,
  "aiProvider": "groq",
  "groqModel": "qwen/qwen3.8-27b"
}
```
*(Notice that `GROQ_API_KEY` is completely hidden and protected).*

---

### Step 4: Configure Frontend with Render Backend URL

`js/config.js` is already pre-configured with the live Render backend URL:
```javascript
export const PRODUCTION_BACKEND_URL = "https://pharmaquest.onrender.com";
```

The system automatically detects the environment:
- **On Vercel (or any live host)**: API requests route to `https://pharmaquest.onrender.com`.
- **On Localhost / 127.0.0.1**: API requests route to relative path `/api/...` (connecting to your local `server.js`).


---

### Step 5: Deploy Frontend to Vercel

1. Log in to [Vercel Dashboard](https://vercel.com/).
2. Click **Add New...** → **Project**.
3. Import your GitHub repository: `SAGAR-7777/PharmaQuest`.
4. Configure Project:
   - **Framework Preset**: **Other** (Pure static HTML/CSS/JS — do NOT select Next.js)
   - **Root Directory**: `./`
   - **Build Command**: Leave blank (no build step needed)
   - **Output Directory**: Leave blank (root `./` contains `index.html`)
5. Click **Deploy**.
6. Vercel will instantly publish your site (e.g. `https://pharmaquest.vercel.app`).

---

### Step 6: Post-Deployment Verification Checklist

| # | Test | Procedure | Expected Result |
|---|---|---|---|
| 1 | **Backend Health** | Open `https://pharmaquest.onrender.com/api/health` | Returns `{"status":"ok","app":"PHARMAQUEST"}` |
| 2 | **Frontend Landing** | Open `https://YOUR-FRONTEND.vercel.app` | Ultra-premium PHARMAQUEST landing page loads with all styling, fonts, and icons |
| 3 | **Client Navigation** | Click "Mission", "Syllabus", "PYQs", "Radar", "Viva Lab" | Smooth instant SPA view transitions |
| 4 | **Pharma AI Chat** | Go to Pharma AI tab, ask: *"What is the Limit Test for Iron?"* | Real-time Groq AI response with structured PCI study notes |
| 5 | **Supabase Auth** | Click "Sign In", create a test account or log in | Authenticates via Supabase, profile avatar updates |
| 6 | **Mock Test / Quiz** | Attempt a mock test or practice question | Score calculated and progress updated |

---

## 🔒 Security Best Practices Implemented

1. **Server-Side AI Secrets**:
   - `GROQ_API_KEY` is loaded only on the Render server runtime.
   - It is never included in client bundles, never passed through `/api/config`, and never printed in logs.
2. **CORS Hardening**:
   - `server.js` dynamically validates request origins against `ALLOWED_ORIGIN`, localhost, and `*.vercel.app`.
   - Preflight `OPTIONS` requests respond with `204 No Content` and standard security headers.
3. **No Framework Bloat**:
   - The frontend remains lightweight vanilla HTML/CSS/JavaScript with native ES Modules.
   - Zero compilation or build overhead on Vercel.
