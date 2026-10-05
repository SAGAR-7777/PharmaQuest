import { store } from "./state.js";
import { auth } from "./auth.js";
import { ui } from "./ui.js";
import { AuthModal } from "./auth-modal.js";
import { SYLLABUS_PART_I } from "./syllabus-data.js";
import { QUESTIONS_BANK, VIVA_QUESTIONS } from "./questions-data.js";
import { PRACTICAL_EXPERIMENTS } from "./practicals-data.js";
import { CRUDE_DRUGS } from "./crude-drugs-data.js";
import { HETEROCYCLIC_RINGS, STARRED_DRUGS } from "./chemistry-data.js";
import { apiUrl } from "./config.js";

class PharmaQuestApp {
  constructor() {
    this.appRoot = document.getElementById("app-root");
    this.headerUserSlot = document.getElementById("header-user-slot");
    this.authModal = new AuthModal(() => this.onAuthSuccess());
    this.init();
  }

  init() {
    // Subscribe to state changes
    store.subscribe((state) => {
      this.renderHeader(state);
      this.render(state);
    });

    this.bindGlobalEvents();
    this.renderHeader(store.get());
    this.render(store.get());
  }

  onAuthSuccess() {
    this.renderHeader(store.get());
    this.render(store.get());
  }

  renderHeader(state) {
    const slot = document.getElementById("header-user-slot");
    if (!slot) return;

    const user = state.currentUser;
    const profile = state.currentProfile;

    if (user) {
      const name = profile?.full_name || user.email?.split('@')[0] || "Pharmacist";
      const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

      slot.innerHTML = `
        <div class="user-streak-pill" title="Personal Streak">
          <span>🔥</span>
          <span>${state.streak} ${state.streak === 1 ? 'DAY' : 'DAYS'}</span>
        </div>

        <div style="display: flex; align-items: center; gap: 8px;">
          <div style="width: 34px; height: 34px; border-radius: 50%; background: linear-gradient(135deg, #06b6d4, #0284c7); color: #07090d; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.8rem; cursor: pointer;" id="btn-user-profile" title="${name} (${user.email})">
            ${initials}
          </div>
          <button class="btn btn-secondary" id="btn-signout" style="padding: 6px 12px; font-size: 0.78rem;">
            SIGN OUT
          </button>
        </div>
      `;

      document.getElementById("btn-signout")?.addEventListener("click", async () => {
        await auth.signOut();
        ui.showToast("Signed out. Returned to guest laboratory view.", "info");
      });

      document.getElementById("btn-user-profile")?.addEventListener("click", () => {
        store.setView("dashboard");
      });
    } else {
      slot.innerHTML = `
        <button class="btn btn-secondary" id="btn-header-signin" style="padding: 7px 14px; font-size: 0.82rem;">
          SIGN IN
        </button>
        <button class="btn btn-primary" id="btn-header-join" style="padding: 7px 16px; font-size: 0.82rem;">
          JOIN LAB
        </button>
      `;

      document.getElementById("btn-header-signin")?.addEventListener("click", () => {
        this.authModal.show('signin');
      });

      document.getElementById("btn-header-join")?.addEventListener("click", () => {
        this.authModal.show('signup');
      });
    }
  }

  bindGlobalEvents() {
    // Header navigation links
    document.addEventListener("click", (e) => {
      const navTarget = e.target.closest("[data-view]");
      if (navTarget) {
        e.preventDefault();
        const view = navTarget.getAttribute("data-view");
        const subjectId = navTarget.getAttribute("data-subject") || null;

        // Protected routes check
        if (view === "exam" && !auth.isAuthenticated()) {
          this.authModal.show('signin');
          ui.showToast("Please sign in or create an account to track your test score.", "info");
          return;
        }

        store.setView(view, subjectId);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }

      // Subject Orbit node clicks
      const orbitNode = e.target.closest(".orbit-node");
      if (orbitNode) {
        const subjectId = orbitNode.getAttribute("data-subject-id");
        store.setView("subject", subjectId);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }

      // Bookmark button clicks
      const bookmarkBtn = e.target.closest(".btn-bookmark");
      if (bookmarkBtn) {
        e.stopPropagation();
        if (!auth.isAuthenticated()) {
          this.authModal.show('signin');
          ui.showToast("Sign in to save questions to your personal Revision Vault", "info");
          return;
        }
        const qId = bookmarkBtn.getAttribute("data-qid");
        store.toggleBookmark(qId).then(added => {
          ui.showToast(added ? "✓ Question saved to your Revision Vault" : "Removed from bookmarks");
        });
      }
    });

    // Keyboard shortcuts
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        const modal = document.getElementById("auth-modal-overlay");
        if (modal) modal.remove();
      }
    });
  }

  render(state) {
    // Update active nav indicators in header & mobile bar
    document.querySelectorAll("[data-view]").forEach(el => {
      if (el.getAttribute("data-view") === state.currentView) {
        el.classList.add("active");
      } else {
        el.classList.remove("active");
      }
    });

    // Check if in Exam Mode
    if (state.currentView === "exam") {
      document.body.classList.add("in-exam-mode");
    } else {
      document.body.classList.remove("in-exam-mode");
    }

    // View Routing
    switch (state.currentView) {
      case "landing":
        this.renderLanding(state);
        break;
      case "dashboard":
        this.renderDashboard(state);
        break;
      case "subject":
        this.renderSubject(state);
        break;
      case "pyq":
        this.renderPYQ(state);
        break;
      case "practice":
        this.renderPracticeMCQ(state);
        break;
      case "radar":
        this.renderRadar(state);
        break;
      case "exam":
        this.renderExamMode(state);
        break;
      case "exam-results":
        this.renderExamResults(state);
        break;
      case "viva":
        this.renderVivaLab(state);
        break;
      case "practicals":
        this.renderPracticals(state);
        break;
      case "anatomy":
        this.renderAnatomy(state);
        break;
      case "pharmacognosy":
        this.renderPharmacognosy(state);
        break;
      case "chemistry":
        this.renderChemistry(state);
        break;
      case "social":
        this.renderSocial(state);
        break;
      case "notes":
        this.renderNotesVault(state);
        break;
      case "ai":
        this.renderPharmaAI(state);
        break;
      case "admin":
        this.renderAdmin(state);
        break;
      default:
        this.renderLanding(state);
    }
  }

  // --- 01. LANDING PAGE & SIGNATURE SUBJECT ORBIT ---
  renderLanding(state) {
    this.appRoot.innerHTML = `
      <!-- Hero Section -->
      <section class="hero-section">
        <div class="container hero-grid">
          <div class="hero-content">
            <div class="hero-tagline">
              <span class="badge badge-er2020">
                <span class="badge-dot"></span>
                D.PHARM • ER-2020 SYLLABUS
              </span>
              <span class="badge">Part I Curriculum</span>
            </div>

            <h1 class="hero-title">
              MASTER <span class="gradient-text">D.PHARM.</span><br />
              ONE QUESTION<br />
              AT A TIME.
            </h1>

            <p class="hero-subtitle">
              The digital pharmacy lab engineered exclusively for D.Pharm students. 
              Authentic PYQs, PCI-compliant practical notebooks, viva room simulation, and intelligent syllabus-mapped practice.
            </p>

            <div class="hero-cta-group">
              <button class="btn btn-primary btn-magnetic" data-view="dashboard">
                <span>ENTER LAB MISSION</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </button>
              <button class="btn btn-secondary btn-magnetic" data-view="subject" data-subject="pharmaceutics">
                <span>EXPLORE SYLLABUS</span>
              </button>
            </div>

            <div class="hero-meta-stats">
              <div class="meta-stat-item">
                <span class="val">5 COURSES</span>
                <span class="lbl">PCI ER-2020 PART I</span>
              </div>
              <div class="meta-stat-item">
                <span class="val">375 HOURS</span>
                <span class="lbl">THEORY DIRECTORY</span>
              </div>
              <div class="meta-stat-item">
                <span class="val">375 HOURS</span>
                <span class="lbl">HANDS-ON LABS</span>
              </div>
              <div class="meta-stat-item">
                <span class="val">100%</span>
                <span class="lbl">DOCUMENT GROUNDED</span>
              </div>
            </div>
          </div>

          <!-- Right: Floating Digital Pharmacy Lab Scene -->
          <div class="hero-lab-scene">
            <div class="lab-scene-backdrop"></div>
            <div class="lab-scene-grid-lines"></div>
            <canvas id="hero-lab-canvas" style="position: absolute; top:0; left:0; width:100%; height:100%; pointer-events:none;"></canvas>

            <!-- 3D Vector Pharmaceutical Capsule -->
            <div class="floating-center-capsule">
              <svg width="140" height="260" viewBox="0 0 140 260" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="capGradTop" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#0284c7" />
                    <stop offset="100%" stop-color="#0369a1" />
                  </linearGradient>
                  <linearGradient id="capGradBottom" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#f8fafc" />
                    <stop offset="100%" stop-color="#94a3b8" />
                  </linearGradient>
                  <filter id="capsuleGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="8" stdDeviation="16" flood-color="rgba(6, 182, 212, 0.45)" />
                  </filter>
                </defs>
                <path d="M15 70 C15 30, 40 10, 70 10 C100 10, 125 30, 125 70 L125 130 L15 130 Z" fill="url(#capGradTop)" filter="url(#capsuleGlow)"/>
                <path d="M15 130 L125 130 L125 190 C125 230, 100 250, 70 250 C40 250, 15 230, 15 190 Z" fill="url(#capGradBottom)" filter="url(#capsuleGlow)"/>
                <rect x="13" y="126" width="114" height="8" rx="4" fill="rgba(255,255,255,0.7)" />
                <path d="M30 40 C30 25, 45 20, 60 20 L60 240 C45 240, 30 235, 30 220 Z" fill="rgba(255,255,255,0.18)" />
                <text x="70" y="85" font-family="'Space Grotesk', sans-serif" font-weight="700" font-size="14" fill="#ffffff" text-anchor="middle" letter-spacing="1">PCI • ER-2020</text>
                <text x="70" y="185" font-family="'JetBrains Mono', monospace" font-weight="600" font-size="12" fill="#0f172a" text-anchor="middle">PART-I</text>
              </svg>
            </div>

            <!-- Floating Question Card Top-Right -->
            <div class="floating-lab-card card-top-right">
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
                <span class="badge badge-vvi" style="font-size: 0.65rem;">EXAM RADAR</span>
                <span style="font-family: var(--font-mono); font-size: 0.7rem; color: var(--text-muted);">ER20-11T</span>
              </div>
              <div style="font-size: 0.84rem; font-weight: 600; max-width: 180px; line-height: 1.3;">
                Ball Mill: Mechanism of Attrition & Impact
              </div>
            </div>

            <!-- Floating Progress Ring Bottom-Left -->
            <div class="floating-lab-card card-bottom-left">
              <div style="display: flex; align-items: center; gap: 12px;">
                <div style="width: 38px; height: 38px; border-radius: 50%; border: 3px solid var(--accent-cyan); display: flex; align-items: center; justify-content: center; font-family: var(--font-mono); font-weight: 700; font-size: 0.78rem;">
                  ${state.overallProgress}%
                </div>
                <div>
                  <div style="font-size: 0.75rem; font-weight: 700;">DAILY DOSE</div>
                  <div style="font-size: 0.68rem; color: var(--state-success);">Streak: ${state.streak} Days 🔥</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Signature Subject Orbit Section -->
      <section class="subject-orbit-section">
        <div class="container">
          <div class="section-header">
            <span class="badge badge-er2020 section-tag">SIGNATURE INTERACTION</span>
            <h2>THE SUBJECT ORBIT</h2>
            <p>
              Navigate the 5 foundational pillars of D.Pharm Part I. Each orbital node acts as an interactive laboratory portal with direct syllabus mapping.
            </p>
          </div>

          <div class="orbit-arena">
            <div class="orbit-track orbit-track-inner"></div>
            <div class="orbit-track orbit-track-outer"></div>

            <!-- Central Core -->
            <div class="orbit-core" data-view="dashboard">
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="var(--accent-cyan)" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
              <span style="font-family: var(--font-mono); font-size: 0.7rem; font-weight: 700; margin-top: 4px;">D.PHARM</span>
              <span style="font-size: 0.6rem; color: var(--text-muted);">LAB HUB</span>
            </div>

            <!-- 5 Orbiting Nodes -->
            <div class="orbit-node node-pharmaceutics" data-subject-id="pharmaceutics">
              <div class="orbit-node-icon">PC</div>
              <div class="orbit-node-info">
                <span class="orbit-node-title">Pharmaceutics</span>
                <span class="orbit-node-code">ER20-11T • 75h Theory / 75h Lab</span>
              </div>
            </div>

            <div class="orbit-node node-chemistry" data-subject-id="chemistry">
              <div class="orbit-node-icon">CH</div>
              <div class="orbit-node-info">
                <span class="orbit-node-title">Pharmaceutical Chemistry</span>
                <span class="orbit-node-code">ER20-12T • 75h Theory / 75h Lab</span>
              </div>
            </div>

            <div class="orbit-node node-pharmacognosy" data-subject-id="pharmacognosy">
              <div class="orbit-node-icon">CG</div>
              <div class="orbit-node-info">
                <span class="orbit-node-title">Pharmacognosy</span>
                <span class="orbit-node-code">ER20-13T • 75h Theory / 75h Lab</span>
              </div>
            </div>

            <div class="orbit-node node-hap" data-subject-id="hap">
              <div class="orbit-node-icon">HA</div>
              <div class="orbit-node-info">
                <span class="orbit-node-title">Human Anatomy & Physiology</span>
                <span class="orbit-node-code">ER20-14T • 75h Theory / 75h Lab</span>
              </div>
            </div>

            <div class="orbit-node node-social" data-subject-id="social">
              <div class="orbit-node-icon">SP</div>
              <div class="orbit-node-info">
                <span class="orbit-node-title">Social Pharmacy</span>
                <span class="orbit-node-code">ER20-15T • 75h Theory / 75h Lab</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Signature Laboratory Features Grid -->
      <section style="padding: 40px 0 80px;">
        <div class="container">
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 24px;">
            <div class="card-base" style="cursor: pointer;" data-view="practicals">
              <div style="color: var(--subj-pharmacognosy); font-family: var(--font-mono); font-size: 0.78rem; font-weight: 700; margin-bottom: 8px;">PRACTICAL LAB NOTEBOOKS</div>
              <h3 style="font-size: 1.25rem; margin-bottom: 10px;">Vertical Laboratory Dossiers</h3>
              <p style="font-size: 0.9rem;">Complete official monographs: Aim, Principle, Chemical equations, Step-by-step procedure, Observations, Results, and Viva Voce questions.</p>
              <div style="margin-top: 16px; font-size: 0.85rem; color: var(--accent-cyan); font-weight: 600;">ENTER PRACTICAL LAB →</div>
            </div>

            <div class="card-base" style="cursor: pointer;" data-view="viva">
              <div style="color: var(--subj-hap); font-family: var(--font-mono); font-size: 0.78rem; font-weight: 700; margin-bottom: 8px;">EXAMINATION ROOM SIMULATOR</div>
              <h3 style="font-size: 1.25rem; margin-bottom: 10px;">PCI Viva Voce Lab</h3>
              <p style="font-size: 0.9rem;">Experience real oral examinations. Rapid-fire cards with examiner-approved responses and confidence self-rating.</p>
              <div style="margin-top: 16px; font-size: 0.85rem; color: var(--subj-hap); font-weight: 600;">ENTER VIVA LAB →</div>
            </div>

            <div class="card-base" style="cursor: pointer;" data-view="exam">
              <div style="color: var(--subj-social); font-family: var(--font-mono); font-size: 0.78rem; font-weight: 700; margin-bottom: 8px;">DISTRACTION-FREE EXAM</div>
              <h3 style="font-size: 1.25rem; margin-bottom: 10px;">Sessional & Board Mock Test</h3>
              <p style="font-size: 0.9rem;">Timed tests with live question navigator palette, marked-for-review tags, and detailed diagnostic weakness analytics.</p>
              <div style="margin-top: 16px; font-size: 0.85rem; color: var(--subj-social); font-weight: 600;">LAUNCH MOCK TEST →</div>
            </div>
          </div>
        </div>
      </section>
    `;

    ui.initHeroCanvas();
  }

  // --- 02. DASHBOARD / MISSION CONTROL (REAL DATA) ---
  renderDashboard(state) {
    const user = state.currentUser;
    const profile = state.currentProfile;
    const daily = state.dailyDose;
    const totalTarget = daily.mcqsTarget + daily.pyqsTarget + daily.vviTarget + daily.vivaTarget;
    const totalDone = daily.mcqsCompleted + daily.pyqsCompleted + daily.vviCompleted + daily.vivaCompleted;
    const dosePct = Math.round((totalDone / totalTarget) * 100);

    const displayName = profile?.full_name || (user ? user.email.split('@')[0] : "PHARMACIST");

    this.appRoot.innerHTML = `
      <div class="container dashboard-view">
        <div class="dash-header-banner">
          <div>
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
              <span class="badge badge-er2020">MISSION CONTROL</span>
              ${user ? `<span class="badge" style="border-color: var(--accent-cyan); color: var(--accent-cyan);">AUTHENTICATED SESSION</span>` : `<span class="badge badge-vvi">GUEST PREVIEW</span>`}
            </div>
            <h1 style="font-size: 2.4rem;">WELCOME BACK, ${displayName.toUpperCase()}.</h1>
            <p style="margin-top: 4px;">${profile?.college_name ? `${profile.college_name} • ${profile.year_of_study}` : "Your digital laboratory training dashboard grounded in PCI ER-2020."}</p>
          </div>
          <div style="display: flex; gap: 12px;">
            <button class="btn btn-secondary" data-view="viva">
              <span>VIVA ROOM</span>
            </button>
            <button class="btn btn-primary" data-view="exam">
              <span>START MOCK TEST</span>
            </button>
          </div>
        </div>

        <!-- Metric Top Strip (Real User Stats) -->
        <div class="dash-metric-strip">
          <div class="metric-strip-card">
            <span class="label">CURRENT STREAK</span>
            <span class="num" style="color: var(--subj-pharmaceutics);">${state.streak} ${state.streak === 1 ? 'DAY' : 'DAYS'} 🔥</span>
          </div>
          <div class="metric-strip-card">
            <span class="label">SYLLABUS MASTERY</span>
            <span class="num" style="color: var(--accent-cyan);">${state.overallProgress}%</span>
          </div>
          <div class="metric-strip-card">
            <span class="label">QUESTIONS SOLVED</span>
            <span class="num">${state.totalQuestionsSolved}</span>
          </div>
          <div class="metric-strip-card">
            <span class="label">GLOBAL ACCURACY</span>
            <span class="num" style="color: var(--state-success);">${state.userAccuracy}%</span>
          </div>
        </div>

        <!-- Onboarding Banner for New Users with 0 attempts -->
        ${state.totalQuestionsSolved === 0 ? `
          <div class="card-base" style="background: linear-gradient(135deg, rgba(6, 182, 212, 0.08), rgba(18, 22, 32, 0.95)); border: 1px solid var(--accent-cyan); margin-bottom: 28px;">
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;">
              <div>
                <span class="badge badge-er2020" style="margin-bottom: 6px;">FIRST TIME IN LAB?</span>
                <h3 style="font-size: 1.25rem;">Start your first question practice session to calibrate your radar.</h3>
                <p style="font-size: 0.88rem; margin-top: 4px;">Solve official board questions from 2021–2024 to unlock personalized weakness detection.</p>
              </div>
              <button class="btn btn-primary" data-view="practice">
                SOLVE FIRST QUESTION →
              </button>
            </div>
          </div>
        ` : ''}

        <!-- Split Grid: Daily Dose Metaphor + Weakness Recommendation -->
        <div class="dash-grid-top">
          <!-- Daily Dose Signature Capsule -->
          <div class="dose-capsule-widget">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px;">
              <div>
                <span class="badge badge-er2020">SIGNATURE METAPHOR</span>
                <h3 style="font-size: 1.35rem; margin-top: 4px;">DAILY DOSE</h3>
              </div>
              <div style="font-family: var(--font-mono); font-size: 1.4rem; font-weight: 700; color: var(--accent-cyan);">
                ${dosePct}%
              </div>
            </div>

            <div class="capsule-graphic-wrapper">
              <div class="capsule-body">
                <div class="capsule-highlight"></div>
                <div class="capsule-liquid" style="height: ${Math.max(8, dosePct)}%;"></div>
              </div>

              <div class="dose-task-list">
                <div class="dose-task-item ${daily.mcqsCompleted >= daily.mcqsTarget ? 'completed' : ''}">
                  <span>10 ER-2020 MCQs</span>
                  <span style="font-family: var(--font-mono); font-weight: 600;">${daily.mcqsCompleted} / ${daily.mcqsTarget}</span>
                </div>
                <div class="dose-task-item ${daily.pyqsCompleted >= daily.pyqsTarget ? 'completed' : ''}">
                  <span>5 Board PYQs (2021–2024)</span>
                  <span style="font-family: var(--font-mono); font-weight: 600;">${daily.pyqsCompleted} / ${daily.pyqsTarget}</span>
                </div>
                <div class="dose-task-item ${daily.vviCompleted >= daily.vviTarget ? 'completed' : ''}">
                  <span>3 Exam Radar VVI Questions</span>
                  <span style="font-family: var(--font-mono); font-weight: 600;">${daily.vviCompleted} / ${daily.vviTarget}</span>
                </div>
                <div class="dose-task-item ${daily.vivaCompleted >= daily.vivaTarget ? 'completed' : ''}">
                  <span>1 Official Viva Flashcard</span>
                  <span style="font-family: var(--font-mono); font-weight: 600;">${daily.vivaCompleted} / ${daily.vivaTarget}</span>
                </div>

                <div style="margin-top: 8px;">
                  <button class="btn btn-primary" style="width: 100%;" data-view="practice">
                    <span>COMPLETE REMAINING DOSE →</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Weakness Radar Recommendation -->
          <div style="display: flex; flex-direction: column; gap: 16px;">
            <div class="card-recommendation">
              <div>
                <span class="badge badge-vvi" style="margin-bottom: 6px;">HIGH-YIELD RADAR RECOMMENDATION</span>
                <h4 style="font-size: 1.1rem; color: #ff5c7c;">Pharmaceutical Chemistry Accuracy Boost</h4>
                <p style="font-size: 0.85rem; margin-top: 4px;">Limit Tests procedures & Iron precipitation buffer (Accuracy: ${state.subjectMastery.chemistry || 0}%).</p>
                <div style="margin-top: 16px;">
                  <button class="btn btn-secondary" style="font-size: 0.82rem; padding: 8px 16px;" data-view="practice">
                    START TARGETED PRACTICE
                  </button>
                </div>
              </div>
            </div>

            <!-- Subject Progress Spread -->
            <div class="card-base" style="flex-grow: 1;">
              <h4 style="font-size: 1rem; margin-bottom: 14px;">SUBJECT ACCURACY SPREAD</h4>
              <div style="display: flex; flex-direction: column; gap: 10px;">
                ${store.getSubjects().map(c => {
                  const mastery = state.subjectMastery[c.id] || 0;
                  return `
                    <div>
                      <div style="display: flex; justify-content: space-between; font-size: 0.82rem; margin-bottom: 4px;">
                        <span>${c.title} (${c.theoryCode})</span>
                        <span style="font-family: var(--font-mono); font-weight: 600;">${mastery}%</span>
                      </div>
                      <div style="width: 100%; height: 6px; background: rgba(255,255,255,0.06); border-radius: var(--radius-full); overflow: hidden;">
                        <div style="width: ${Math.max(4, mastery)}%; height: 100%; background: ${c.accent}; border-radius: var(--radius-full);"></div>
                      </div>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>
          </div>
        </div>

        <!-- Direct Lab Navigation Tiles -->
        <h3 style="font-size: 1.4rem; margin: 32px 0 18px;">DIGITAL LABORATORY MODULES</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 16px;">
          <div class="card-base" style="cursor: pointer;" data-view="pyq">
            <div style="font-size: 0.82rem; font-family: var(--font-mono); color: var(--accent-cyan);">ARCHIVE</div>
            <div style="font-weight: 700; margin: 4px 0;">Official PYQ Explorer</div>
            <div style="font-size: 0.8rem; color: var(--text-muted);">Explore 2021–2024 board questions by topic</div>
          </div>

          <div class="card-base" style="cursor: pointer;" data-view="radar">
            <div style="font-size: 0.82rem; font-family: var(--font-mono); color: var(--subj-hap);">EXAM RADAR</div>
            <div style="font-weight: 700; margin: 4px 0;">High Priority & VVI</div>
            <div style="font-size: 0.8rem; color: var(--text-muted);">Repeated questions, must-revise concepts</div>
          </div>

          <div class="card-base" style="cursor: pointer;" data-view="anatomy">
            <div style="font-size: 0.82rem; font-family: var(--font-mono); color: var(--subj-hap);">ANATOMY LAB</div>
            <div style="font-weight: 700; margin: 4px 0;">Body Systems Explorer</div>
            <div style="font-size: 0.8rem; color: var(--text-muted);">Cardiovascular, nervous, respiratory models</div>
          </div>

          <div class="card-base" style="cursor: pointer;" data-view="pharmacognosy">
            <div style="font-size: 0.82rem; font-family: var(--font-mono); color: var(--subj-pharmacognosy);">HERBARIUM</div>
            <div style="font-weight: 700; margin: 4px 0;">Crude Drug Explorer</div>
            <div style="font-size: 0.8rem; color: var(--text-muted);">Botanical sources, constituents, chemical tests</div>
          </div>

          <div class="card-base" style="cursor: pointer;" data-view="chemistry">
            <div style="font-size: 0.82rem; font-family: var(--font-mono); color: var(--subj-chemistry);">CHEMISTRY MAP</div>
            <div style="font-weight: 700; margin: 4px 0;">Heterocycles & Starred Drugs</div>
            <div style="font-size: 0.8rem; color: var(--text-muted);">Starred (*) chemical structures & brand names</div>
          </div>

          <div class="card-base" style="cursor: pointer;" data-view="notes">
            <div style="font-size: 0.82rem; font-family: var(--font-mono); color: var(--subj-social);">REVISION VAULT</div>
            <div style="font-weight: 700; margin: 4px 0;">Digital Textbook & Bookmarks</div>
            <div style="font-size: 0.8rem; color: var(--text-muted);">${state.bookmarks.length} questions saved in vault</div>
          </div>
        </div>
      </div>
    `;
  }

  // --- 03. SUBJECT PAGE & TIMELINE ---
  renderSubject(state) {
    const course = store.getSubject(state.activeSubjectId);
    const chapters = store.getChapters(course.id);
    const mastery = state.subjectMastery[course.id] || 0;

    this.appRoot.innerHTML = `
      <div class="container" style="padding: 40px 0 80px;">
        <div class="subject-banner" style="background: linear-gradient(135deg, rgba(18, 22, 32, 0.95), rgba(10, 13, 20, 0.98)); border-left: 5px solid ${course.accent};">
          <div class="subject-banner-meta">
            <span class="badge badge-er2020">${course.theoryCode} • ${course.practicalCode}</span>
            <span class="badge" style="border-color: ${course.accent}; color: ${course.accent};">PCI ER-2020</span>
          </div>

          <h1 class="subject-banner-title" style="color: #ffffff;">${course.title.toUpperCase()}</h1>
          <p style="max-width: 740px; font-size: 0.95rem; line-height: 1.6;">${course.scope}</p>

          <div class="subject-stat-pills">
            <span class="stat-pill" style="color: ${course.accent}; font-weight: 700;">${mastery}% COMPLETE</span>
            <span class="stat-pill">${chapters.length} Chapters</span>
            <span class="stat-pill">${course.theoryHours || course.totalTheoryHours || 75}h Theory (3h/wk)</span>
            <span class="stat-pill">${course.tutorialHours || course.totalTutorialHours || 25}h Tutorial (1h/wk)</span>
            <span class="stat-pill">${course.practicalHours || course.practicalTotalHours || 75}h Practical Lab</span>
          </div>
        </div>

        <!-- Subject Switcher Pills -->
        <div style="display: flex; gap: 8px; overflow-x: auto; padding-bottom: 16px; margin-bottom: 32px;">
          ${store.getSubjects().map(c => `
            <button class="btn btn-secondary ${c.id === course.id ? 'active' : ''}" 
                    style="${c.id === course.id ? `border-color: ${c.accent}; color: ${c.accent}; font-weight: 700;` : ''}"
                    data-view="subject" data-subject="${c.id}">
              ${c.title}
            </button>
          `).join('')}
        </div>

        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px;">
          <div>
            <h2 style="font-size: 1.6rem;">OFFICIAL CHAPTER LEARNING PATH</h2>
            <p style="font-size: 0.88rem;">Structured directly from the ER-2020 syllabus document with exact PCI hour allocations.</p>
          </div>
          <button class="btn btn-primary" data-view="practice">
            <span>PRACTICE CHAPTER 1 →</span>
          </button>
        </div>

        <div class="timeline-container">
          ${chapters.map((ch, idx) => `
            <div class="timeline-chapter-card ${idx === 0 ? 'current' : ''}">
              <div class="timeline-chapter-header">
                <div class="chapter-title-group">
                  <div class="chapter-number-pill" style="${idx === 0 ? `background: ${course.accent}; color: #000; font-weight: 800;` : ''}">
                    ${ch.chapterNumber}
                  </div>
                  <div>
                    <h3 style="font-size: 1.15rem;">${ch.title}</h3>
                    <span style="font-family: var(--font-mono); font-size: 0.76rem; color: var(--text-muted);">
                      Official PCI Allocation: ${ch.hours} Hours
                    </span>
                  </div>
                </div>

                <div class="chapter-node-actions">
                  <button class="btn btn-secondary" style="font-size: 0.78rem; padding: 6px 12px;" data-view="pyq">
                    VIEW PYQs
                  </button>
                  <button class="btn btn-secondary" style="font-size: 0.78rem; padding: 6px 12px;" data-view="notes">
                    STUDY NOTES
                  </button>
                  <button class="btn btn-primary" style="font-size: 0.78rem; padding: 6px 14px;" data-view="practice">
                    TEST KNOWLEDGE
                  </button>
                </div>
              </div>

              <div style="background: rgba(0,0,0,0.25); border-radius: var(--radius-sm); padding: 14px 18px; border: 1px solid var(--border-subtle);">
                <div style="font-size: 0.75rem; font-family: var(--font-mono); text-transform: uppercase; color: var(--text-muted); margin-bottom: 8px;">
                  Syllabus Topics (Verbatim Document Extract)
                </div>
                <ul style="display: flex; flex-direction: column; gap: 6px; font-size: 0.88rem; line-height: 1.5; color: var(--text-secondary);">
                  ${ch.topics.map(t => `<li style="display: flex; gap: 8px;"><span style="color: ${course.accent};">▸</span><span>${t}</span></li>`).join('')}
                </ul>
              </div>
            </div>
          `).join('')}
        </div>

        <div style="margin-top: 48px;">
          <h2 style="font-size: 1.6rem; margin-bottom: 16px;">LABORATORY EXPERIMENTS & ASSIGNMENTS</h2>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px;">
            <div class="card-base">
              <h3 style="font-size: 1.1rem; color: ${course.accent}; margin-bottom: 12px;">Practical Course (${course.practicalCode})</h3>
              <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 14px;">75 Hours / 3 Hours per week hands-on training.</p>
              <ul style="display: flex; flex-direction: column; gap: 8px; font-size: 0.85rem;">
                ${(course.practicalExperiments || []).slice(0, 5).map(e => `
                  <li style="display: flex; gap: 8px;"><span style="color: var(--state-success);">✓</span><span>${e}</span></li>
                `).join('')}
              </ul>
              <div style="margin-top: 16px;">
                <button class="btn btn-secondary" style="width: 100%; font-size: 0.82rem;" data-view="practicals">
                  OPEN PRACTICAL LAB NOTEBOOK →
                </button>
              </div>
            </div>

            <div class="card-base">
              <h3 style="font-size: 1.1rem; color: var(--subj-pharmaceutics); margin-bottom: 12px;">Official Sessional Assignments</h3>
              <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 14px;">Minimum 3 written assignments per student required by PCI regulations.</p>
              <ul style="display: flex; flex-direction: column; gap: 8px; font-size: 0.85rem;">
                ${course.assignments.map((a, i) => `
                  <li style="display: flex; gap: 8px;"><span style="font-family: var(--font-mono); color: var(--text-muted);">${i+1}.</span><span>${a}</span></li>
                `).join('')}
              </ul>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // --- 04. PYQ EXPLORER ---
  renderPYQ(state) {
    this.appRoot.innerHTML = `
      <div class="container" style="padding: 40px 0 80px;">
        <div style="margin-bottom: 24px;">
          <span class="badge badge-er2020">ARCHIVE EXPLORATION</span>
          <h1 style="font-size: 2.2rem; margin-top: 6px;">PREVIOUS YEARS' QUESTIONS (PYQs)</h1>
          <p>Explore real D.Pharm board examination questions mapped precisely by subject, year, chapter, and exam frequency.</p>
        </div>

        <div class="filter-shelf">
          <div class="filter-group">
            <select class="filter-select" id="pyq-subj-filter">
              <option value="all">All 5 Subjects</option>
              ${store.getSubjects().map(c => `<option value="${c.id}">${c.title} (${c.theoryCode})</option>`).join('')}
            </select>

            <select class="filter-select" id="pyq-year-filter">
              <option value="all">All Years (2021–2024)</option>
              <option value="2024">2024 Annual Exam</option>
              <option value="2023">2023 Board Exam</option>
              <option value="2022">2022 Examination</option>
              <option value="2021">2021 ER-2020 First Batch</option>
            </select>

            <select class="filter-select" id="pyq-radar-filter">
              <option value="all">All Priorities</option>
              <option value="HIGH PRIORITY">High Priority</option>
              <option value="REPEATED">Repeated</option>
              <option value="MUST REVISE">Must Revise</option>
              <option value="CONCEPTUAL">Conceptual</option>
            </select>
          </div>

          <div class="search-input-wrapper">
            <span class="search-icon">🔍</span>
            <input type="text" class="search-input" id="pyq-search" placeholder="Search drug, formula, topic..." />
          </div>
        </div>

        <div style="display: flex; flex-direction: column; gap: 16px;" id="pyq-list-container">
          ${store.getQuestions().map(q => this.buildPYQCard(q, state)).join('')}
        </div>
      </div>
    `;

    const subjFilter = document.getElementById("pyq-subj-filter");
    const yearFilter = document.getElementById("pyq-year-filter");
    const radarFilter = document.getElementById("pyq-radar-filter");
    const searchInput = document.getElementById("pyq-search");

    const updateFilter = () => {
      const sVal = subjFilter.value;
      const yVal = yearFilter.value;
      const rVal = radarFilter.value;
      const qVal = searchInput.value.toLowerCase().trim();

      const filtered = store.getQuestions().filter(q => {
        const qSubj = q.subjectId || q.courseId || '';
        if (sVal !== "all" && qSubj !== sVal) return false;
        if (yVal !== "all" && q.year && q.year.toString() !== yVal) return false;
        if (rVal !== "all" && q.radarTag !== rVal) return false;
        if (qVal && !q.question.toLowerCase().includes(qVal) && !(q.chapterTitle || '').toLowerCase().includes(qVal)) return false;
        return true;
      });

      const container = document.getElementById("pyq-list-container");
      if (filtered.length === 0) {
        container.innerHTML = `
          <div class="card-base" style="text-align: center; padding: 48px;">
            <h3>NO QUESTIONS MATCHED YOUR FILTER</h3>
            <p style="margin-top: 8px;">Try clearing filters or search terms.</p>
          </div>
        `;
      } else {
        container.innerHTML = filtered.map(q => this.buildPYQCard(q, state)).join('');
      }
    };

    subjFilter.addEventListener("change", updateFilter);
    yearFilter.addEventListener("change", updateFilter);
    radarFilter.addEventListener("change", updateFilter);
    searchInput.addEventListener("input", updateFilter);
  }

  buildPYQCard(q, state) {
    const isSaved = state.bookmarks.includes(q.id);
    return `
      <div class="card-research">
        <div class="card-research-meta">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span class="badge" style="color: var(--accent-cyan);">${q.codeLabel}</span>
            <span class="badge badge-er2020">${q.year}</span>
            <span class="badge ${q.radarTag === 'HIGH PRIORITY' ? 'badge-high-priority' : q.radarTag === 'REPEATED' ? 'badge-repeated' : 'badge-must-revise'}">
              ${q.radarTag}
            </span>
          </div>
          <div style="display: flex; align-items: center; gap: 12px;">
            <span>${q.frequency}</span>
            <button class="btn-ghost btn-bookmark" data-qid="${q.id}" style="padding: 4px; color: ${isSaved ? 'var(--subj-pharmaceutics)' : 'var(--text-muted)'};" title="Bookmark">
              ${isSaved ? '★ Saved' : '☆ Save'}
            </button>
          </div>
        </div>

        <h3 style="font-size: 1.15rem; font-weight: 600; line-height: 1.4; margin-bottom: 12px;">
          ${q.question}
        </h3>

        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; font-size: 0.82rem; color: var(--text-muted); border-top: 1px solid var(--border-subtle); padding-top: 12px; margin-top: 12px;">
          <div>
            <span>Chapter ${q.chapterNumber}: </span>
            <strong style="color: var(--text-secondary);">${q.chapterTitle}</strong>
          </div>
          <button class="btn btn-secondary" style="font-size: 0.78rem; padding: 6px 14px;" data-view="practice">
            SOLVE & SEE MECHANISM →
          </button>
        </div>
      </div>
    `;
  }

  // --- 05. QUESTION & MCQ PRACTICE SOLVER (REAL ATTEMPTS) ---
  renderPracticeMCQ(state) {
    const allQuestions = store.getQuestions();
    const qIndex = (this.practiceQuestionIndex || 0) % (allQuestions.length || 1);
    const q = allQuestions[qIndex] || allQuestions[0];
    let selectedOption = null;
    let answered = false;

    this.appRoot.innerHTML = `
      <div class="container" style="padding: 40px 0 80px;">
        <div class="mcq-stage-container">
          <div class="mcq-stage-header">
            <div style="display: flex; align-items: center; gap: 10px;">
              <span class="badge badge-er2020">${q.courseCode}</span>
              <span class="badge ${q.radarTag === 'HIGH PRIORITY' ? 'badge-high-priority' : 'badge-repeated'}">${q.radarTag}</span>
              <span style="font-family: var(--font-mono); font-size: 0.85rem; color: var(--text-muted);">Question ${qIndex + 1} of ${allQuestions.length}</span>
            </div>
            <div class="mcq-timer">
              ⏱ <span>00:45</span>
            </div>
          </div>

          <div style="font-size: 0.8rem; font-family: var(--font-mono); color: var(--text-muted); margin-bottom: 8px;">
            ${q.chapterTitle} (Chapter ${q.chapterNumber})
          </div>

          <h2 class="mcq-question-text">
            ${q.question}
          </h2>

          <div class="mcq-options-grid" id="mcq-options">
            ${q.options.map((opt, idx) => `
              <div class="mcq-option-item" data-opt-idx="${idx}">
                <div class="mcq-option-key">${['A', 'B', 'C', 'D'][idx]}</div>
                <div style="font-size: 0.95rem;">${opt}</div>
              </div>
            `).join('')}
          </div>

          <div id="mcq-feedback-slot"></div>

          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 24px; padding-top: 16px; border-top: 1px solid var(--border-subtle);">
            <button class="btn btn-secondary btn-bookmark" data-qid="${q.id}">
              ${state.bookmarks.includes(q.id) ? '★ Saved in Revision Vault' : '☆ Save to Revision Vault'}
            </button>
            <button class="btn btn-primary" id="btn-next-mcq" style="display: none;">
              NEXT QUESTION →
            </button>
          </div>
        </div>
      </div>
    `;

    const optionsContainer = document.getElementById("mcq-options");
    const feedbackSlot = document.getElementById("mcq-feedback-slot");
    const nextBtn = document.getElementById("btn-next-mcq");

    optionsContainer.addEventListener("click", async (e) => {
      const optionEl = e.target.closest(".mcq-option-item");
      if (!optionEl || answered) return;

      answered = true;
      selectedOption = parseInt(optionEl.getAttribute("data-opt-idx"), 10);
      const isCorrect = selectedOption === q.correctAnswer;

      // Real user attempt recorded in Supabase / User DB
      await store.recordAttempt(q.id, selectedOption, isCorrect, 15);

      if (isCorrect) {
        optionEl.classList.add("correct");
        ui.showToast("✓ CORRECT! Great mastery of ER-2020 syllabus.", "success");
      } else {
        optionEl.classList.add("wrong");
        const correctEl = optionsContainer.querySelector(`[data-opt-idx="${q.correctAnswer}"]`);
        if (correctEl) correctEl.classList.add("correct");
        ui.showToast("NOT QUITE. Review the mechanism below.");
      }

      feedbackSlot.innerHTML = `
        <div class="mcq-explanation-card">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
            <span style="font-weight: 700; color: ${isCorrect ? 'var(--state-success)' : 'var(--state-error)'};">
              ${isCorrect ? '✓ CORRECT ANSWER' : '✗ DETAILED EXPLANATION'}
            </span>
          </div>

          <div class="ai-block" style="border-left-color: var(--accent-cyan); margin-bottom: 10px;">
            <div class="ai-block-title">PHARMACEUTICAL MECHANISM</div>
            <div class="ai-block-content">${q.explanation.mechanism}</div>
          </div>

          <div class="ai-block" style="border-left-color: var(--subj-pharmaceutics); margin-bottom: 10px;">
            <div class="ai-block-title">EXAM KEY POINT</div>
            <div class="ai-block-content">${q.explanation.keyPoint}</div>
          </div>

          <div class="ai-block" style="border-left-color: var(--subj-social);">
            <div class="ai-block-title">SYLLABUS GROUNDING</div>
            <div class="ai-block-content" style="font-family: var(--font-mono); font-size: 0.8rem;">${q.explanation.syllabusRef}</div>
          </div>
        </div>
      `;

      nextBtn.style.display = "inline-flex";
    });

    nextBtn.addEventListener("click", () => {
      this.practiceQuestionIndex = (qIndex + 1) % allQuestions.length;
      ui.showToast("Loading next question...");
      this.renderPracticeMCQ(store.get());
    });
  }

  // --- 06. EXAM RADAR / VVI HUB ---
  renderRadar(state) {
    const vvis = store.getQuestions().filter(q => q.radarTag === "HIGH PRIORITY" || q.radarTag === "REPEATED" || q.radarTag === "MUST REVISE");

    this.appRoot.innerHTML = `
      <div class="container" style="padding: 40px 0 80px;">
        <div style="margin-bottom: 32px;">
          <span class="badge badge-vvi">EXAM RADAR</span>
          <h1 style="font-size: 2.2rem; margin-top: 6px;">HIGH-YIELD & VVI QUESTION RADAR</h1>
          <p>Questions classified by appearance frequency, sessional weightage, and conceptual recurrence across D.Pharm Part I boards.</p>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(340px, 1fr)); gap: 20px;">
          ${vvis.map(q => `
            <div class="card-base" style="border-top: 3px solid ${q.radarTag === 'HIGH PRIORITY' ? 'var(--subj-hap)' : 'var(--subj-pharmaceutics)'};">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                <span class="badge ${q.radarTag === 'HIGH PRIORITY' ? 'badge-high-priority' : 'badge-repeated'}">${q.radarTag}</span>
                <span style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-muted);">${q.frequency}</span>
              </div>
              <h3 style="font-size: 1.08rem; line-height: 1.4; margin-bottom: 12px;">${q.question}</h3>
              <div style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 16px;">
                ${q.courseCode} • Chapter ${q.chapterNumber}: ${q.chapterTitle}
              </div>
              <button class="btn btn-secondary" style="width: 100%; font-size: 0.82rem;" data-view="practice">
                SOLVE ON RADAR →
              </button>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // --- 07. MOCK TEST (EXAM MODE WITH REAL DB PERSISTENCE) ---
  renderExamMode(state) {
    if (!state.activeExam) {
      store.startExam();
      return;
    }

    const { questions, currentIndex, answers, marked, timeRemaining } = state.activeExam;
    const currentQ = questions[currentIndex];

    this.appRoot.innerHTML = `
      <div class="exam-mode-stage">
        <div class="exam-mode-topbar">
          <div style="display: flex; align-items: center; gap: 14px;">
            <span class="badge badge-er2020">D.PHARM EXAM MODE</span>
            <span style="font-weight: 700;">PART I SESSIONAL ASSESSMENT</span>
          </div>

          <div style="display: flex; align-items: center; gap: 24px;">
            <div style="font-family: var(--font-mono); font-size: 1.15rem; font-weight: 700; color: var(--accent-cyan);">
              ⏱ 14:45
            </div>
            <button class="btn btn-primary" id="btn-submit-exam" style="background: linear-gradient(135deg, #f43f5e, #e11d48); color: white;">
              SUBMIT ASSESSMENT
            </button>
          </div>
        </div>

        <div class="exam-layout-split">
          <div class="card-base" style="display: flex; flex-direction: column; justify-content: space-between; padding: 36px;">
            <div>
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                <span class="badge badge-er2020">Question ${currentIndex + 1} of ${questions.length}</span>
                <span style="font-family: var(--font-mono); font-size: 0.78rem; color: var(--text-muted);">${currentQ.courseCode} • Chapter ${currentQ.chapterNumber}</span>
              </div>

              <h2 style="font-size: 1.35rem; font-weight: 600; line-height: 1.45; margin-bottom: 24px;">
                ${currentQ.question}
              </h2>

              <div class="mcq-options-grid">
                ${currentQ.options.map((opt, idx) => {
                  const isSelected = answers[currentQ.id] === idx;
                  return `
                    <div class="mcq-option-item ${isSelected ? 'correct' : ''}" data-exam-opt="${idx}">
                      <div class="mcq-option-key">${['A', 'B', 'C', 'D'][idx]}</div>
                      <div style="font-size: 0.95rem;">${opt}</div>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>

            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 24px; padding-top: 16px; border-top: 1px solid var(--border-subtle);">
              <button class="btn btn-secondary" id="btn-exam-mark">
                ${marked[currentQ.id] ? '★ Marked for Review' : '☆ Mark for Review'}
              </button>

              <div style="display: flex; gap: 10px;">
                <button class="btn btn-secondary" id="btn-exam-prev" ${currentIndex === 0 ? 'disabled' : ''}>
                  ← PREVIOUS
                </button>
                <button class="btn btn-primary" id="btn-exam-next" ${currentIndex === questions.length - 1 ? 'disabled' : ''}>
                  NEXT →
                </button>
              </div>
            </div>
          </div>

          <div class="card-base" style="padding: 24px;">
            <h4 style="font-size: 0.95rem; margin-bottom: 8px;">QUESTION NAVIGATOR</h4>
            <div style="display: flex; gap: 8px; font-size: 0.72rem; color: var(--text-muted); margin-bottom: 14px;">
              <span>● Answered</span>
              <span>● Marked</span>
              <span>○ Unanswered</span>
            </div>

            <div class="exam-palette-grid">
              ${questions.map((q, idx) => {
                const isAns = answers[q.id] !== undefined;
                const isMark = marked[q.id];
                const isActive = idx === currentIndex;
                let cls = 'palette-btn';
                if (isActive) cls += ' active';
                if (isAns) cls += ' answered';
                if (isMark) cls += ' marked';
                return `<button class="${cls}" data-goto-q="${idx}">${idx + 1}</button>`;
              }).join('')}
            </div>

            <div style="margin-top: 32px; padding-top: 16px; border-top: 1px solid var(--border-subtle); font-size: 0.78rem; color: var(--text-muted);">
              <div>Total Questions: <strong>${questions.length}</strong></div>
              <div>Answered: <strong>${Object.keys(answers).length}</strong></div>
              <div>Marked: <strong>${Object.values(marked).filter(Boolean).length}</strong></div>
            </div>
          </div>
        </div>
      </div>
    `;

    document.querySelectorAll("[data-exam-opt]").forEach(el => {
      el.addEventListener("click", () => {
        const opt = parseInt(el.getAttribute("data-exam-opt"), 10);
        store.setExamAnswer(currentQ.id, opt);
        this.renderExamMode(store.get());
      });
    });

    document.querySelectorAll("[data-goto-q]").forEach(el => {
      el.addEventListener("click", () => {
        const idx = parseInt(el.getAttribute("data-goto-q"), 10);
        const exam = { ...store.get().activeExam, currentIndex: idx };
        store.set({ activeExam: exam });
        this.renderExamMode(store.get());
      });
    });

    document.getElementById("btn-exam-next")?.addEventListener("click", () => {
      if (currentIndex < questions.length - 1) {
        const exam = { ...store.get().activeExam, currentIndex: currentIndex + 1 };
        store.set({ activeExam: exam });
        this.renderExamMode(store.get());
      }
    });

    document.getElementById("btn-exam-prev")?.addEventListener("click", () => {
      if (currentIndex > 0) {
        const exam = { ...store.get().activeExam, currentIndex: currentIndex - 1 };
        store.set({ activeExam: exam });
        this.renderExamMode(store.get());
      }
    });

    document.getElementById("btn-exam-mark")?.addEventListener("click", () => {
      store.toggleExamMark(currentQ.id);
      this.renderExamMode(store.get());
    });

    document.getElementById("btn-submit-exam")?.addEventListener("click", async () => {
      if (confirm("Are you sure you wish to submit your assessment? Score will be saved to your profile.")) {
        await store.submitExam();
      }
    });
  }

  // --- 08. RESULT EXPERIENCE ---
  renderExamResults(state) {
    const results = state.examResults || {
      scorePct: 80,
      correct: 4,
      wrong: 1,
      skipped: 0,
      total: 5,
      durationSec: 320
    };

    const circ = 2 * Math.PI * 52;
    const offset = circ - (results.scorePct / 100) * circ;

    this.appRoot.innerHTML = `
      <div class="container" style="padding: 40px 0 80px; max-width: 820px;">
        <div class="card-base" style="text-align: center; padding: 48px 36px;">
          <div style="display: flex; justify-content: center; gap: 8px; margin-bottom: 12px;">
            <span class="badge badge-er2020">ASSESSMENT REPORT</span>
            <span class="badge" style="border-color: var(--state-success); color: var(--state-success);">SAVED TO SUPABASE</span>
          </div>
          <h1 style="font-size: 2.2rem; margin-bottom: 24px;">YOUR PERFORMANCE</h1>

          <div class="score-ring-container" style="margin: 0 auto 28px;">
            <svg class="score-ring-svg" viewBox="0 0 120 120">
              <circle class="score-ring-bg" cx="60" cy="60" r="52"></circle>
              <circle class="score-ring-val" cx="60" cy="60" r="52" 
                      style="stroke-dasharray: ${circ}; stroke-dashoffset: ${offset};"></circle>
            </svg>
            <div class="score-ring-label">
              <span class="val">${results.scorePct}%</span>
              <span class="sub">ACCURACY</span>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 32px;">
            <div style="background: rgba(255,255,255,0.03); padding: 12px; border-radius: var(--radius-sm);">
              <div style="font-size: 0.72rem; color: var(--text-muted);">CORRECT</div>
              <div style="font-family: var(--font-mono); font-size: 1.3rem; font-weight: 700; color: var(--state-success);">${results.correct}</div>
            </div>
            <div style="background: rgba(255,255,255,0.03); padding: 12px; border-radius: var(--radius-sm);">
              <div style="font-size: 0.72rem; color: var(--text-muted);">INCORRECT</div>
              <div style="font-family: var(--font-mono); font-size: 1.3rem; font-weight: 700; color: var(--state-error);">${results.wrong}</div>
            </div>
            <div style="background: rgba(255,255,255,0.03); padding: 12px; border-radius: var(--radius-sm);">
              <div style="font-size: 0.72rem; color: var(--text-muted);">SKIPPED</div>
              <div style="font-family: var(--font-mono); font-size: 1.3rem; font-weight: 700;">${results.skipped}</div>
            </div>
            <div style="background: rgba(255,255,255,0.03); padding: 12px; border-radius: var(--radius-sm);">
              <div style="font-size: 0.72rem; color: var(--text-muted);">TIME TAKEN</div>
              <div style="font-family: var(--font-mono); font-size: 1.3rem; font-weight: 700; color: var(--accent-cyan);">${Math.floor(results.durationSec / 60)}m ${results.durationSec % 60}s</div>
            </div>
          </div>

          <div style="background: rgba(244, 63, 94, 0.06); border: 1px solid rgba(244, 63, 94, 0.25); border-radius: var(--radius-md); padding: 20px; text-align: left; margin-bottom: 28px;">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
              <span class="badge badge-vvi" style="font-size: 0.68rem;">KNOW YOUR WEAKNESS</span>
            </div>
            <h3 style="font-size: 1.05rem; color: #ff5c7c;">Pharmaceutical Chemistry • Limit Tests & Errors</h3>
            <p style="font-size: 0.86rem; color: var(--text-secondary); margin-top: 4px;">
              Your response time and accuracy dipped in inorganic limit tests.
            </p>
            <div style="margin-top: 14px;">
              <button class="btn btn-secondary" style="font-size: 0.8rem; padding: 6px 14px;" data-view="notes">
                REVISE THIS TOPIC IN NOTES →
              </button>
            </div>
          </div>

          <div style="display: flex; justify-content: center; gap: 14px;">
            <button class="btn btn-secondary" data-view="dashboard">
              RETURN TO LAB MISSION
            </button>
            <button class="btn btn-primary" data-view="exam">
              RETAKE ASSESSMENT
            </button>
          </div>
        </div>
      </div>
    `;
  }

  // --- 09. VIVA LAB ---
  renderVivaLab(state) {
    const idx = state.activeVivaIndex % VIVA_QUESTIONS.length;
    const vq = VIVA_QUESTIONS[idx];

    this.appRoot.innerHTML = `
      <div class="container" style="padding: 40px 0 80px;">
        <div style="text-align: center; max-width: 600px; margin: 0 auto 36px;">
          <span class="badge badge-er2020">ORAL EXAMINATION ROOM</span>
          <h1 style="font-size: 2.2rem; margin-top: 6px;">PCI VIVA VOCE LAB</h1>
          <p>Face typical external examiner questions with verified official answers and confidence self-rating.</p>
        </div>

        <div class="viva-card">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <span class="badge badge-er2020">${vq.courseCode}</span>
            <span style="font-family: var(--font-mono); font-size: 0.78rem; color: var(--text-muted);">Topic: ${vq.topic}</span>
            <span style="font-family: var(--font-mono); font-size: 0.78rem; color: var(--accent-cyan);">Question ${idx + 1} of ${VIVA_QUESTIONS.length}</span>
          </div>

          <div class="viva-question-text">
            "${vq.question}"
          </div>

          <div id="viva-answer-slot">
            <button class="btn btn-primary" id="btn-reveal-viva">
              <span>REVEAL EXAMINER ANSWER</span>
            </button>
          </div>

          <div class="viva-feedback-row" id="viva-rating-row" style="display: none;">
            <button class="btn btn-secondary" style="border-color: var(--state-success); color: var(--state-success);" id="btn-viva-knew">
              ✓ I KNEW IT
            </button>
            <button class="btn btn-secondary" style="border-color: var(--state-warning); color: var(--state-warning);" id="btn-viva-part">
              ~ PARTIALLY
            </button>
            <button class="btn btn-secondary" style="border-color: var(--state-error); color: var(--state-error);" id="btn-viva-didnt">
              ✗ DIDN'T KNOW
            </button>
          </div>
        </div>
      </div>
    `;

    const revealBtn = document.getElementById("btn-reveal-viva");
    const answerSlot = document.getElementById("viva-answer-slot");
    const ratingRow = document.getElementById("viva-rating-row");

    revealBtn?.addEventListener("click", () => {
      answerSlot.innerHTML = `
        <div class="viva-answer-box">
          <div style="font-family: var(--font-mono); font-size: 0.72rem; color: var(--accent-cyan); text-transform: uppercase; margin-bottom: 8px;">
            OFFICIAL EXAMINER MODEL ANSWER
          </div>
          <div>${vq.answer}</div>
          <div style="margin-top: 12px; display: flex; gap: 6px; flex-wrap: wrap;">
            ${vq.keyKeywords.map(k => `<span class="badge" style="font-size: 0.68rem;">🔑 ${k}</span>`).join('')}
          </div>
        </div>
      `;
      ratingRow.style.display = "flex";
    });

    const nextViva = () => {
      store.set({ activeVivaIndex: idx + 1 });
      this.renderVivaLab(store.get());
    };

    document.getElementById("btn-viva-knew")?.addEventListener("click", nextViva);
    document.getElementById("btn-viva-part")?.addEventListener("click", nextViva);
    document.getElementById("btn-viva-didnt")?.addEventListener("click", nextViva);
  }

  // --- 10. PRACTICAL LAB NOTEBOOKS ---
  renderPracticals(state) {
    this.appRoot.innerHTML = `
      <div class="container" style="padding: 40px 0 80px;">
        <div style="margin-bottom: 32px;">
          <span class="badge badge-er2020">HANDS-ON LABORATORY</span>
          <h1 style="font-size: 2.2rem; margin-top: 6px;">PRACTICAL EXPERIMENT NOTEBOOKS</h1>
          <p>Complete experiment dossiers formatted in vertical laboratory notebook style with chemical principles, procedures, and precautions.</p>
        </div>

        <div style="display: flex; flex-direction: column; gap: 32px;">
          ${PRACTICAL_EXPERIMENTS.map(exp => `
            <div class="notebook-sheet">
              <div class="notebook-header-table">
                <div>
                  EXPERIMENT NO: <strong style="color: var(--text-primary);">${exp.experimentNo}</strong><br />
                  COURSE: <strong style="color: var(--text-primary);">${exp.courseCode}</strong>
                </div>
                <div style="text-align: right;">
                  STATUS: <span style="color: var(--state-success); font-weight: 600;">VERIFIED IP DOSSIER</span><br />
                  SYLLABUS COMPLIANCE: <strong>ER-2020</strong>
                </div>
              </div>

              <h2 style="font-size: 1.5rem; margin-bottom: 12px;">${exp.title}</h2>

              <div class="notebook-section-title">AIM OF THE EXPERIMENT</div>
              <p style="font-size: 0.95rem; color: #cbd5e1;">${exp.aim}</p>

              <div class="notebook-section-title">PRINCIPLE & CHEMICAL REACTIONS</div>
              <p style="font-size: 0.92rem; color: #94a3b8; white-space: pre-line; line-height: 1.6;">${exp.principle}</p>

              <div class="notebook-section-title">REQUIREMENTS</div>
              <div style="background: rgba(255,255,255,0.02); padding: 12px; border-radius: var(--radius-sm); font-size: 0.86rem;">
                <div><strong>Apparatus:</strong> ${exp.requirements.apparatus}</div>
                <div style="margin-top: 4px;"><strong>Chemicals & Reagents:</strong> ${exp.requirements.chemicals}</div>
              </div>

              <div class="notebook-section-title">STEP-BY-STEP PROCEDURE</div>
              <ol style="display: flex; flex-direction: column; gap: 6px; padding-left: 20px; font-size: 0.9rem; color: #cbd5e1;">
                ${exp.procedure.map(step => `<li>${step}</li>`).join('')}
              </ol>

              <div class="notebook-section-title">OBSERVATION & RESULT</div>
              <div style="background: rgba(16, 185, 129, 0.05); border: 1px solid rgba(16, 185, 129, 0.2); border-radius: var(--radius-sm); padding: 14px;">
                <p style="font-size: 0.9rem; color: #a7f3d0;"><strong>Observation:</strong> ${exp.observation}</p>
                <p style="font-size: 0.92rem; color: #ffffff; font-weight: 600; margin-top: 6px;"><strong>Result:</strong> ${exp.result}</p>
              </div>

              <div class="notebook-section-title">SAFETY PRECAUTIONS</div>
              <ul style="display: flex; flex-direction: column; gap: 4px; font-size: 0.86rem; color: #94a3b8;">
                ${exp.precautions.map(p => `<li>⚠ ${p}</li>`).join('')}
              </ul>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // --- 11. ANATOMY ATLAS ---
  renderAnatomy(state) {
    const systems = [
      { name: "Cardiovascular System", hours: "8 Hours", desc: "Heart anatomy, pulmonary & systemic circulation, cardiac cycle, ECG, blood pressure regulation.", icon: "🫀", ch: 7 },
      { name: "Nervous System", hours: "8 Hours", desc: "Cerebrum, cerebellum, midbrain, cranial nerves (I–XII), sympathetic and parasympathetic autonomic divisions.", icon: "🧠", ch: 11 },
      { name: "Respiratory System", hours: "4 Hours", desc: "Respiratory tract organs, regulation and mechanics of respiration, vital capacity, tidal volumes.", icon: "🫁", ch: 8 },
      { name: "Digestive System", hours: "8 Hours", desc: "GIT organs, accessory glands (liver, pancreas), digestive enzymes, mechanics of absorption.", icon: "🥨", ch: 9 },
      { name: "Haemopoietic System", hours: "8 Hours", desc: "Blood composition, hemopoiesis, RBC/WBC/platelet functions, clotting cascade, ABO/Rh grouping.", icon: "🩸", ch: 5 },
      { name: "Urinary System", hours: "4 Hours", desc: "Nephron histology, urine formation, renin-angiotensin-aldosterone axis, clearance tests.", icon: "💧", ch: 13 },
      { name: "Endocrine System", hours: "6 Hours", desc: "Pituitary, thyroid, parathyroid, adrenal, endocrine pancreas, and gonadal hormones.", icon: "🧬", ch: 14 },
      { name: "Osseous & Joints", hours: "6 Hours", desc: "Axial and appendicular skeleton, joint classifications (synovial, fibrous), arthritis & disorders.", icon: "🦴", ch: 4 }
    ];

    this.appRoot.innerHTML = `
      <div class="container" style="padding: 40px 0 80px;">
        <div style="margin-bottom: 32px;">
          <span class="badge" style="color: var(--subj-hap); border-color: rgba(244, 63, 94, 0.3);">ER20-14T • HUMAN ANATOMY</span>
          <h1 style="font-size: 2.2rem; margin-top: 6px;">BODY SYSTEMS INTERACTIVE ATLAS</h1>
          <p>Study organ systems, homeostatic mechanisms, and vital physiological monitoring straight from your HAP syllabus.</p>
        </div>

        <div class="anatomy-system-grid">
          ${systems.map(s => `
            <div class="anatomy-system-card" data-view="subject" data-subject="hap">
              <div style="font-size: 2.4rem; margin-bottom: 12px;">${s.icon}</div>
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                <span class="badge" style="color: var(--subj-hap); font-size: 0.68rem;">CHAPTER ${s.ch}</span>
                <span style="font-family: var(--font-mono); font-size: 0.72rem; color: var(--text-muted);">${s.hours}</span>
              </div>
              <h3 style="font-size: 1.15rem; margin-bottom: 8px;">${s.name}</h3>
              <p style="font-size: 0.85rem; line-height: 1.5;">${s.desc}</p>
              <div style="margin-top: 14px; font-size: 0.8rem; color: var(--subj-hap); font-weight: 600;">
                OPEN CHAPTER MODULE →
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // --- 12. PHARMACOGNOSY CRUDE DRUG EXPLORER ---
  renderPharmacognosy(state) {
    this.appRoot.innerHTML = `
      <div class="container" style="padding: 40px 0 80px;">
        <div style="margin-bottom: 32px;">
          <span class="badge" style="color: var(--subj-pharmacognosy); border-color: rgba(16, 185, 129, 0.3);">ER20-13T • PHARMACOGNOSY</span>
          <h1 style="font-size: 2.2rem; margin-top: 6px;">CRUDE DRUG HERBARIUM EXPLORER</h1>
          <p>Official monographs of crude drugs categorized in Chapter 5: biological sources, families, chemical constituents, and identification tests.</p>
        </div>

        <div class="crude-drug-grid">
          ${CRUDE_DRUGS.map(d => `
            <div class="specimen-card">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                <span class="badge" style="color: var(--subj-pharmacognosy); font-size: 0.68rem;">${d.category}</span>
                <span style="font-family: var(--font-mono); font-size: 0.72rem; color: var(--text-muted);">${d.partUsed}</span>
              </div>

              <h3 style="font-size: 1.35rem; color: #ffffff; margin-bottom: 6px;">${d.name}</h3>
              <div style="font-size: 0.82rem; font-style: italic; color: #94a3b8; margin-bottom: 12px;">${d.biologicalSource} (${d.family})</div>

              <div style="background: rgba(255,255,255,0.02); padding: 12px; border-radius: var(--radius-sm); margin-bottom: 12px; font-size: 0.85rem;">
                <strong style="color: var(--accent-cyan);">Constituents:</strong> ${d.chemicalConstituents}
              </div>

              <div style="font-size: 0.85rem; margin-bottom: 12px;">
                <strong style="color: var(--subj-pharmaceutics);">Therapeutic Use:</strong> ${d.therapeuticUses}
              </div>

              <div style="background: rgba(16, 185, 129, 0.05); border: 1px solid rgba(16, 185, 129, 0.2); padding: 10px; border-radius: var(--radius-sm); font-size: 0.8rem; color: #a7f3d0;">
                <strong>Identification Test:</strong> ${d.chemicalTest}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // --- 13. CHEMISTRY MAP ---
  renderChemistry(state) {
    this.appRoot.innerHTML = `
      <div class="container" style="padding: 40px 0 80px;">
        <div style="margin-bottom: 32px;">
          <span class="badge" style="color: var(--subj-chemistry); border-color: rgba(6, 182, 212, 0.3);">ER20-12T • PHARMACEUTICAL CHEMISTRY</span>
          <h1 style="font-size: 2.2rem; margin-top: 6px;">CHEMISTRY MAP & STARRED DRUGS</h1>
          <p>Nomenclature of heterocyclic compounds up to three rings and medicinal chemistry profiles of asterisk (*) marked drugs requiring chemical structure mastery.</p>
        </div>

        <h2 style="font-size: 1.4rem; margin-bottom: 16px;">HETEROCYCLIC RING SYSTEMS (CHAPTER 4)</h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px; margin-bottom: 48px;">
          ${HETEROCYCLIC_RINGS.map(r => `
            <div class="card-base" style="border-left: 3px solid var(--subj-chemistry);">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                <h3 style="font-size: 1.15rem;">${r.name}</h3>
                <span style="font-family: var(--font-mono); font-size: 0.95rem; color: var(--accent-cyan);">${r.svgIcon}</span>
              </div>
              <div style="font-size: 0.82rem; color: var(--text-muted); margin-bottom: 4px;">Heteroatom: <strong>${r.heteroatom}</strong></div>
              <div style="font-size: 0.82rem; color: var(--text-muted); margin-bottom: 8px;">Ring Size: ${r.ringSize}</div>
              <div style="font-size: 0.84rem; color: var(--text-secondary);">Examples: <strong style="color: var(--text-primary);">${r.exampleDrugs}</strong></div>
            </div>
          `).join('')}
        </div>

        <h2 style="font-size: 1.4rem; margin-bottom: 16px;">STARRED (*) MEDICINAL COMPOUNDS</h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(340px, 1fr)); gap: 20px;">
          ${STARRED_DRUGS.map(d => `
            <div class="chem-compound-card">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                <span class="badge" style="color: var(--subj-chemistry);">${d.category}</span>
                <span style="font-family: var(--font-mono); font-size: 0.72rem; color: var(--text-muted);">${d.courseChapter}</span>
              </div>

              <h3 style="font-size: 1.3rem; margin-bottom: 4px;">${d.name}</h3>
              <div style="font-family: var(--font-mono); font-size: 0.78rem; color: var(--accent-cyan); margin-bottom: 12px;">${d.chemicalName}</div>

              <div style="background: rgba(0,0,0,0.3); padding: 10px; border-radius: var(--radius-sm); font-size: 0.82rem; margin-bottom: 10px;">
                <strong>Ring System:</strong> ${d.ringSystem}
              </div>

              <div style="font-size: 0.85rem; margin-bottom: 10px;">
                <strong>Clinical Uses:</strong> ${d.uses}
              </div>

              <div style="font-size: 0.82rem; color: #94a3b8; margin-bottom: 10px;">
                <strong>Stability & Storage:</strong> ${d.storage}
              </div>

              <div style="border-top: 1px solid var(--border-subtle); padding-top: 10px; font-size: 0.82rem; color: var(--subj-pharmaceutics);">
                <strong>Popular Brands:</strong> ${d.brandNames}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // --- 14. SOCIAL PHARMACY ---
  renderSocial(state) {
    this.appRoot.innerHTML = `
      <div class="container" style="padding: 40px 0 80px;">
        <div style="margin-bottom: 32px;">
          <span class="badge" style="color: var(--subj-social); border-color: rgba(139, 92, 246, 0.3);">ER20-15T • SOCIAL PHARMACY</span>
          <h1 style="font-size: 2.2rem; margin-top: 6px;">PUBLIC HEALTH & SOCIAL PHARMACY ATLAS</h1>
          <p>National health missions, immunization schedules, communicable diseases, and the frontline public health role of pharmacists.</p>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 20px;">
          <div class="card-base" style="border-left: 3px solid var(--subj-social);">
            <span class="badge" style="color: var(--subj-social); font-size: 0.68rem; margin-bottom: 8px;">CHAPTER 2</span>
            <h3 style="font-size: 1.2rem; margin-bottom: 10px;">National Immunization Schedule (NIS)</h3>
            <p style="font-size: 0.88rem; line-height: 1.5; color: #cbd5e1;">
              • <strong>At Birth:</strong> BCG (Intradermal left upper arm), OPV-0 (Oral), Hepatitis B (Intramuscular anterolateral thigh).<br />
              • <strong>6, 10, 14 Weeks:</strong> Pentavalent (DPT+HepB+Hib), OPV 1-3, Rotavirus, Fractional IPV, PCV.<br />
              • <strong>9–12 Months:</strong> MR 1st dose, Vitamin A 1st dose, PCV Booster.<br />
              • <strong>16–24 Months:</strong> MR 2nd dose, DPT booster 1, OPV booster.
            </p>
          </div>

          <div class="card-base" style="border-left: 3px solid var(--state-warning);">
            <span class="badge" style="color: var(--state-warning); font-size: 0.68rem; margin-bottom: 8px;">CHAPTER 4</span>
            <h3 style="font-size: 1.2rem; margin-bottom: 10px;">Epidemiology & Communicable Diseases</h3>
            <p style="font-size: 0.88rem; line-height: 1.5; color: #cbd5e1;">
              • <strong>Respiratory:</strong> Tuberculosis (M. tuberculosis), Influenza, COVID-19, Measles, Diphtheria.<br />
              • <strong>Intestinal:</strong> Cholera (Vibrio cholerae), Typhoid (Salmonella typhi), Poliomyelitis, Amoebiasis.<br />
              • <strong>Arthropod-borne:</strong> Malaria (Anopheles), Dengue & Chikungunya (Aedes aegypti), Filariasis (Culex).
            </p>
          </div>

          <div class="card-base" style="border-left: 3px solid var(--subj-hap);">
            <span class="badge" style="color: var(--subj-hap); font-size: 0.68rem; margin-bottom: 8px;">PRACTICAL ACTIVITY 09</span>
            <h3 style="font-size: 1.2rem; margin-bottom: 10px;">First Aid & BSL (Basic Life Support)</h3>
            <p style="font-size: 0.88rem; line-height: 1.5; color: #cbd5e1;">
              • <strong>CPR Ratio:</strong> 30 high-quality chest compressions to 2 rescue breaths at 100–120 cpm.<br />
              • <strong>Depth:</strong> At least 2 inches (5 cm) on lower half of sternum.<br />
              • <strong>AED:</strong> Automated External Defibrillator pad placement (Right infraclavicular, Left anterolateral).
            </p>
          </div>
        </div>
      </div>
    `;
  }

  // --- 15. NOTES & REVISION VAULT ---
  renderNotesVault(state) {
    const saved = store.getQuestions().filter(q => state.bookmarks.includes(q.id));

    this.appRoot.innerHTML = `
      <div class="container" style="padding: 40px 0 80px;">
        <div style="margin-bottom: 32px;">
          <span class="badge badge-er2020">DIGITAL TEXTBOOK & VAULT</span>
          <h1 style="font-size: 2.2rem; margin-top: 6px;">REVISION VAULT & EDITORIAL NOTES</h1>
          <p>Textbook-grade revision summaries with high-yield exam callouts, saved questions, and spaced repetition tracking.</p>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 340px; gap: 32px;">
          <div>
            <div class="card-base" style="padding: 36px; margin-bottom: 24px;">
              <span class="badge badge-er2020" style="margin-bottom: 12px;">EXAM DEFINITIONS & CALLOUTS</span>
              <h2 style="font-size: 1.5rem; margin-bottom: 16px;">Pharmacopoeias & Official Standards (ER20-11T)</h2>

              <div class="ai-block" style="border-left-color: var(--accent-cyan);">
                <div class="ai-block-title">EXAM DEFINITION: PHARMACOPOEIA</div>
                <div class="ai-block-content">
                  A Pharmacopoeia is an authoritative, legally binding book containing standards, monographs, criteria of identity, purity, and strength for medicines published under the direction of an authority of a government.
                </div>
              </div>

              <div class="ai-block" style="border-left-color: var(--subj-pharmaceutics);">
                <div class="ai-block-title">REMEMBER (EXAM MNEMONIC)</div>
                <div class="ai-block-content">
                  <strong>Indian Pharmacopoeia Editions:</strong> 1955 (Dr. B.N. Ghosh) -> 1966 (Dr. B. Mukerji) -> 1985 (Dr. Nitya Anand) -> 1996 -> 2007 -> 2010 -> 2014 -> 2018 -> 2022 (Current 9th edition).
                </div>
              </div>

              <div class="ai-block" style="border-left-color: var(--subj-hap);">
                <div class="ai-block-title">EXAM TIP</div>
                <div class="ai-block-content">
                  In practical exams, when asked about Indian Pharmacopoeia volumes, state that IP 2022 is published in 4 volumes (Volume I: General notices & chapters; Volumes II-IV: Individual drug dosage forms and chemical monographs).
                </div>
              </div>
            </div>

            <h3 style="font-size: 1.3rem; margin-bottom: 16px;">SAVED QUESTIONS IN VAULT (${saved.length})</h3>
            ${saved.length === 0 ? `
              <div class="card-base" style="text-align: center; padding: 36px;">
                <p>YOUR REVISION VAULT IS EMPTY</p>
                <div style="font-size: 0.85rem; color: var(--text-muted); margin-top: 4px;">Save questions while practicing and they will appear here.</div>
              </div>
            ` : saved.map(q => this.buildPYQCard(q, state)).join('')}
          </div>

          <div style="display: flex; flex-direction: column; gap: 20px;">
            <div class="card-base">
              <h3 style="font-size: 1.1rem; margin-bottom: 14px;">SPACED REPETITION SCHEDULE</h3>
              <div style="display: flex; flex-direction: column; gap: 12px; font-size: 0.84rem;">
                <div style="display: flex; justify-content: space-between; padding: 10px; background: rgba(255,255,255,0.03); border-radius: var(--radius-sm);">
                  <span>Due in 24 Hours</span>
                  <strong style="color: var(--subj-pharmaceutics);">${Math.min(saved.length, 3)} Topics</strong>
                </div>
                <div style="display: flex; justify-content: space-between; padding: 10px; background: rgba(255,255,255,0.03); border-radius: var(--radius-sm);">
                  <span>Due in 3 Days</span>
                  <strong style="color: var(--accent-cyan);">${Math.max(0, saved.length - 3)} Topics</strong>
                </div>
                <div style="display: flex; justify-content: space-between; padding: 10px; background: rgba(255,255,255,0.03); border-radius: var(--radius-sm);">
                  <span>Mastered (7+ Days)</span>
                  <strong style="color: var(--state-success);">${state.totalQuestionsSolved} Questions</strong>
                </div>
              </div>
            </div>

            <div class="card-base">
              <h3 style="font-size: 1.1rem; margin-bottom: 10px;">USER ATTEMPTS LOG</h3>
              <div style="font-size: 0.85rem; color: var(--text-muted);">
                Total Attempts: <strong>${state.userAttempts.length}</strong>
              </div>
              <div style="font-size: 0.85rem; color: var(--text-muted); margin-top: 4px;">
                Mock Tests Taken: <strong>${state.mockAttempts.length}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // --- 16. PHARMA AI (GROQ LPU SERVER-SIDE ASSISTANT) ---
  renderPharmaAI(state) {
    const course = store.getSubject(state.activeSubjectId);

    this.appRoot.innerHTML = `
      <div class="container" style="padding: 30px 0 60px;">
        <div style="margin-bottom: 20px;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span class="badge badge-er2020">GROQ LPU ACCELERATED</span>
            <span class="badge" style="border-color: var(--accent-cyan); color: var(--accent-cyan);">llama-3.3-70b-versatile</span>
            <span class="badge" style="border-color: var(--border-medium); color: var(--text-muted);">SERVER SECURED</span>
          </div>
          <h1 style="font-size: 1.8rem; margin-top: 4px;">PHARMA AI ASSISTANT</h1>
          <p style="font-size: 0.88rem; color: var(--text-muted); margin-top: 2px;">
            Ultra-fast D.Pharm study assistant powered by Groq LPU inference. Grounded in the official PCI ER-2020 Part I syllabus & Indian Pharmacopoeia.
          </p>
        </div>

        <div class="ai-desk-layout">
          <div class="ai-sidebar">
            <h4 style="font-size: 0.85rem; font-family: var(--font-mono); margin-bottom: 12px; color: var(--text-muted);">TOPICS HISTORY</h4>
            <div style="display: flex; flex-direction: column; gap: 8px;">
              <button class="quick-action-pill" data-history-query="Explain Limit Test for Iron as per Indian Pharmacopoeia" style="border-left: 2px solid var(--accent-cyan);">Limit Test for Iron</button>
              <button class="quick-action-pill" data-history-query="Explain working principle and mechanics of Ball Mill">Ball Mill Mechanics</button>
              <button class="quick-action-pill" data-history-query="Explain morphological and microscopic identification of Senna">Senna Identification</button>
              <button class="quick-action-pill" data-history-query="Explain cardiac conduction system and ECG waves in HAP">Cardiac Conduction</button>
              <button class="quick-action-pill" data-history-query="Explain role of pharmacist in National Health Programmes">National Health Programs</button>
            </div>
          </div>

          <div class="ai-main-chat">
            <div class="ai-messages-scroll" id="ai-chat-thread">
              ${state.aiHistory.map(msg => `
                <div>
                  <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
                    <span class="badge badge-er2020">${msg.sender === 'ai' ? 'PHARMA AI' : 'YOU'}</span>
                    <span style="font-size: 0.7rem; color: var(--text-muted);">${msg.timestamp}</span>
                  </div>

                  ${msg.structuredContent ? `
                    <div style="background: rgba(14, 18, 26, 0.9); border: 1px solid var(--border-medium); border-radius: var(--radius-md); padding: 20px;">
                      <h4 style="font-size: 1.1rem; color: var(--text-primary); margin-bottom: 14px;">${msg.structuredContent.title}</h4>
                      
                      <div class="ai-block" style="border-left-color: var(--accent-cyan);">
                        <div class="ai-block-title">SIMPLE EXPLANATION</div>
                        <div class="ai-block-content">${msg.structuredContent.simpleExplanation}</div>
                      </div>

                      <div class="ai-block" style="border-left-color: var(--subj-pharmaceutics);">
                        <div class="ai-block-title">EXAM ANSWER</div>
                        <div class="ai-block-content" style="white-space: pre-line;">${msg.structuredContent.examAnswer}</div>
                      </div>

                      <div class="ai-block" style="border-left-color: var(--state-success);">
                        <div class="ai-block-title">KEY POINTS</div>
                        <ul class="ai-block-content" style="padding-left: 16px;">
                          ${msg.structuredContent.keyPoints ? msg.structuredContent.keyPoints.map(kp => `<li>${kp}</li>`).join('') : ''}
                        </ul>
                      </div>

                      <div class="ai-block" style="border-left-color: var(--subj-hap);">
                        <div class="ai-block-title">PCI VIVA TIP</div>
                        <div class="ai-block-content">${msg.structuredContent.viva}</div>
                      </div>

                      <div class="ai-block" style="border-left-color: var(--subj-social);">
                        <div class="ai-block-title">NEXT STEP PRACTICE</div>
                        <div class="ai-block-content">${msg.structuredContent.practice}</div>
                      </div>
                    </div>
                  ` : `
                    <div style="background: rgba(255,255,255,0.04); border-radius: var(--radius-md); padding: 14px 18px; font-size: 0.95rem;">
                      ${msg.text}
                    </div>
                  `}
                </div>
              `).join('')}
            </div>

            <div class="ai-input-bar">
              <input type="text" id="ai-user-prompt" class="search-input" style="padding-left: 14px;" placeholder="Ask anything about D.Pharm Part I (e.g. Limit tests, Dosage forms, Soxhlet)..." />
              <button class="btn btn-primary" id="btn-send-ai">
                SEND
              </button>
            </div>
          </div>

          <div class="ai-context-panel">
            <h4 style="font-size: 0.85rem; font-family: var(--font-mono); color: var(--text-muted);">ACTIVE SYLLABUS CONTEXT</h4>
            <div style="background: rgba(255,255,255,0.03); padding: 12px; border-radius: var(--radius-sm); font-size: 0.82rem;">
              <strong style="color: ${course.accent};">${course.title}</strong><br />
              <span style="color: var(--text-muted);">${course.theoryCode} • ER-2020</span>
            </div>

            <div style="display: flex; flex-direction: column; gap: 8px;">
              <div style="font-size: 0.75rem; font-family: var(--font-mono); color: var(--text-muted);">QUICK DESK ACTIONS</div>
              <button class="quick-action-pill" data-ai-action="explain">💡 Explain Ball Mill Simply</button>
              <button class="quick-action-pill" data-ai-action="limit">🧪 Explain Limit Test for Iron</button>
              <button class="quick-action-pill" data-ai-action="viva">🎙️ Give Me a Viva Question</button>
              <button class="quick-action-pill" data-ai-action="plan">📅 Create 7-Day Revision Plan</button>
            </div>
          </div>
        </div>
      </div>
    `;

    // Auto-scroll chat thread to bottom
    const thread = document.getElementById("ai-chat-thread");
    if (thread) {
      thread.scrollTop = thread.scrollHeight;
    }

    // Quick history sidebar pills
    document.querySelectorAll("[data-history-query]").forEach(btn => {
      btn.addEventListener("click", () => {
        const query = btn.getAttribute("data-history-query");
        if (query) this.handleAISend(query, course.title);
      });
    });

    // Quick desk actions
    document.querySelectorAll("[data-ai-action]").forEach(btn => {
      btn.addEventListener("click", () => {
        const action = btn.getAttribute("data-ai-action");
        let query = "Explain Ball Mill working and mechanics";
        if (action === "limit") query = "Explain Limit test for Iron principle and procedure";
        if (action === "viva") query = "Ask me a challenging D.Pharm viva question";
        if (action === "plan") query = "Create a 7-day revision plan for D.Pharm Part I ER-2020";

        this.handleAISend(query, course.title);
      });
    });

    // Send button event
    document.getElementById("btn-send-ai")?.addEventListener("click", () => {
      const input = document.getElementById("ai-user-prompt");
      if (!input || !input.value.trim()) {
        ui.showToast("Please enter a question or topic for Pharma AI", "warning");
        input?.focus();
        return;
      }
      const text = input.value.trim();
      input.value = "";
      this.handleAISend(text, course.title);
    });

    // Input Enter key event
    document.getElementById("ai-user-prompt")?.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const input = e.target;
        if (!input || !input.value.trim()) {
          ui.showToast("Please enter a question or topic for Pharma AI", "warning");
          return;
        }
        const text = input.value.trim();
        input.value = "";
        this.handleAISend(text, course.title);
      }
    });
  }

  async handleAISend(userText, currentSubject = "Pharmaceutics") {
    // Validate empty prompt
    if (!userText || !userText.trim()) {
      ui.showToast("Please enter a question or topic for Pharma AI", "warning");
      return;
    }

    const cleanPrompt = userText.trim();
    const history = [...store.get().aiHistory];
    history.push({
      sender: "user",
      timestamp: "Just now",
      text: cleanPrompt
    });

    // Temporary loading placeholder
    history.push({
      sender: "ai",
      timestamp: "Processing...",
      text: "⚡ Consulting D.Pharm ER-2020 syllabus via Groq LPU inference..."
    });

    store.set({ aiHistory: history });
    this.renderPharmaAI(store.get());

    // Disable input and button while waiting for response
    const sendBtn = document.getElementById("btn-send-ai");
    const input = document.getElementById("ai-user-prompt");
    if (sendBtn) {
      sendBtn.disabled = true;
      sendBtn.innerHTML = '<span>⚡ THINKING...</span>';
    }
    if (input) input.disabled = true;

    try {
      // Secure server-side call to /api/ai/chat (works across local and Render production)
      const chatEndpoint = apiUrl('/api/ai/chat');
      const res = await fetch(chatEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: cleanPrompt,
          subject: currentSubject,
          chapter: "ER-2020 Core Curriculum",
          syllabusRef: "Indian Pharmacopoeia (IP 2022) / PCI ER-2020"
        })
      });

      const result = await res.json();
      history.pop(); // remove loading placeholder

      if (result.configured === false) {
        ui.showToast("Groq API key required in server environment", "info");
      }

      if (result.structuredContent) {
        history.push({
          sender: "ai",
          timestamp: "Just now",
          structuredContent: result.structuredContent
        });
      } else {
        history.push({
          sender: "ai",
          timestamp: "Just now",
          text: result.message || result.error || "Response received."
        });
      }
    } catch (e) {
      history.pop();
      const chatEndpoint = apiUrl('/api/ai/chat');
      history.push({
        sender: "ai",
        timestamp: "Notice",
        text: `Could not reach server AI endpoint (${chatEndpoint}). Ensure backend server is active.`
      });
      ui.showToast("Failed to connect to backend server", "error");
    }

    store.set({ aiHistory: history });
    this.renderPharmaAI(store.get());
  }

  // --- 17. ADMIN UI ---
  renderAdmin(state) {
    this.appRoot.innerHTML = `
      <div class="container" style="padding: 40px 0 80px;">
        <div style="margin-bottom: 24px;">
          <span class="badge badge-er2020">SYSTEM MANAGEMENT</span>
          <h1 style="font-size: 2rem; margin-top: 4px;">PHARMAQUEST ADMIN CONSOLE</h1>
          <p>Inspect syllabus ground truth, database counts, and multi-user authentication status.</p>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px;">
          <div class="card-base">
            <h3 style="font-size: 1.15rem; margin-bottom: 12px;">DATABASE INTEGRITY STATUS</h3>
            <ul style="display: flex; flex-direction: column; gap: 8px; font-size: 0.88rem;">
              <li style="display: flex; justify-content: space-between;">
                <span>ER-2020 Courses Verified:</span>
                <strong>5 Theory + 5 Practical</strong>
              </li>
              <li style="display: flex; justify-content: space-between;">
                <span>Total Theory Hours:</span>
                <strong>375 Hours</strong>
              </li>
              <li style="display: flex; justify-content: space-between;">
                <span>Total Tutorial Hours:</span>
                <strong>125 Hours</strong>
              </li>
              <li style="display: flex; justify-content: space-between;">
                <span>Verified Questions in Bank:</span>
                <strong>${store.getQuestions().length} Questions</strong>
              </li>
              <li style="display: flex; justify-content: space-between;">
                <span>Viva Examination Dossiers:</span>
                <strong>${VIVA_QUESTIONS.length} Questions</strong>
              </li>
              <li style="display: flex; justify-content: space-between;">
                <span>Lab Experiments in Dossier:</span>
                <strong>${PRACTICAL_EXPERIMENTS.length} Notebooks</strong>
              </li>
            </ul>
          </div>

          <div class="card-base">
            <h3 style="font-size: 1.15rem; margin-bottom: 12px;">SUPABASE DATABASE CONNECTION</h3>
            <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 16px;">
              Manage your Supabase configuration, Row Level Security (RLS) tables, and session tokens.
            </p>
            <div style="display: flex; gap: 10px;">
              <button class="btn btn-secondary" id="btn-open-db-config" style="border-color: var(--accent-cyan); color: var(--accent-cyan);">
                CONFIGURE SUPABASE LIVE DB
              </button>
              <button class="btn btn-secondary" style="border-color: var(--state-error); color: var(--state-error);" id="btn-reset-state">
                RESET LOCAL DEV DATA
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    document.getElementById("btn-open-db-config")?.addEventListener("click", () => {
      this.authModal.show('supabase');
    });

    document.getElementById("btn-reset-state")?.addEventListener("click", () => {
      if (confirm("Reset local test data to defaults?")) {
        localStorage.clear();
        location.reload();
      }
    });
  }
}

// Instantiate App
window.addEventListener("DOMContentLoaded", () => {
  new PharmaQuestApp();
});
