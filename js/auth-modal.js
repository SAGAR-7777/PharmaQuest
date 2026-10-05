// Auth Modal & Profile Management UI for PHARMAQUEST
// Implements Sign In, Sign Up, Forgot Password, and Supabase Live Connection Inspector

import { auth } from "./auth.js";
import { getConfig, saveManualConfig } from "./supabase-client.js";
import { ui } from "./ui.js";

export class AuthModal {
  constructor(onSuccess) {
    this.onSuccess = onSuccess;
    this.activeTab = 'signin'; // 'signin', 'signup', 'forgot', 'supabase'
  }

  show(initialTab = 'signin') {
    this.activeTab = initialTab;
    this.removeExisting();

    const overlay = document.createElement('div');
    overlay.className = 'modal-backdrop';
    overlay.id = 'auth-modal-overlay';
    overlay.style.cssText = `
      position: fixed;
      top: 0; left: 0; width: 100vw; height: 100vh;
      background: rgba(4, 6, 10, 0.82);
      backdrop-filter: blur(14px);
      z-index: 10000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      animation: fadeIn 0.25s ease-out;
    `;

    overlay.innerHTML = this.renderContent();
    document.body.appendChild(overlay);

    this.bindEvents(overlay);
  }

  removeExisting() {
    const existing = document.getElementById('auth-modal-overlay');
    if (existing) existing.remove();
  }

  renderContent() {
    const config = getConfig();

    return `
      <div class="card-base" style="width: 100%; max-width: 460px; padding: 36px; border: 1px solid var(--border-medium); box-shadow: 0 24px 60px rgba(0,0,0,0.8); position: relative; animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);">
        <!-- Close Button -->
        <button id="btn-close-auth-modal" style="position: absolute; top: 20px; right: 20px; color: var(--text-muted); font-size: 1.2rem; cursor: pointer; padding: 4px 8px;">✕</button>

        <!-- Brand Monogram -->
        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 20px;">
          <div class="logo-symbol" style="width: 30px; height: 30px; font-size: 0.9rem;">⚚</div>
          <span style="font-family: var(--font-display); font-weight: 700; font-size: 1.1rem; letter-spacing: -0.01em;">
            PHARMA<strong style="color: var(--accent-cyan);">QUEST</strong> AUTH
          </span>
        </div>

        <!-- Tab Switcher -->
        <div style="display: flex; gap: 6px; border-bottom: 1px solid var(--border-subtle); padding-bottom: 12px; margin-bottom: 24px;">
          <button class="nav-link ${this.activeTab === 'signin' ? 'active' : ''}" data-auth-tab="signin" style="padding: 6px 12px; font-size: 0.85rem;">Sign In</button>
          <button class="nav-link ${this.activeTab === 'signup' ? 'active' : ''}" data-auth-tab="signup" style="padding: 6px 12px; font-size: 0.85rem;">Create Account</button>
          <button class="nav-link ${this.activeTab === 'supabase' ? 'active' : ''}" data-auth-tab="supabase" style="padding: 6px 12px; font-size: 0.85rem; color: var(--accent-cyan);" title="Inspect Database Connection">DB Setup</button>
        </div>

        <!-- Alert Container -->
        <div id="auth-alert-box" style="display: none; padding: 12px 16px; border-radius: var(--radius-sm); font-size: 0.85rem; margin-bottom: 18px;"></div>

        <!-- Form: Sign In -->
        ${this.activeTab === 'signin' ? `
          <form id="form-auth-signin" style="display: flex; flex-direction: column; gap: 16px;">
            <div>
              <label style="display: block; font-size: 0.78rem; font-family: var(--font-mono); color: var(--text-muted); margin-bottom: 6px;">EMAIL ADDRESS</label>
              <input type="email" id="auth-email" required class="search-input" style="width: 100%; padding-left: 14px;" placeholder="student@pharmacy.edu" />
            </div>

            <div>
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                <label style="font-size: 0.78rem; font-family: var(--font-mono); color: var(--text-muted);">PASSWORD</label>
                <a href="#" id="link-forgot-pw" style="font-size: 0.75rem; color: var(--accent-cyan);">Forgot?</a>
              </div>
              <input type="password" id="auth-password" required class="search-input" style="width: 100%; padding-left: 14px;" placeholder="••••••••" />
            </div>

            <button type="submit" class="btn btn-primary" id="btn-auth-submit" style="width: 100%; margin-top: 6px;">
              <span>SIGN IN TO DIGITAL LAB</span>
            </button>
          </form>
        ` : ''}

        <!-- Form: Sign Up -->
        ${this.activeTab === 'signup' ? `
          <form id="form-auth-signup" style="display: flex; flex-direction: column; gap: 14px;">
            <div>
              <label style="display: block; font-size: 0.75rem; font-family: var(--font-mono); color: var(--text-muted); margin-bottom: 6px;">FULL NAME</label>
              <input type="text" id="auth-name" required class="search-input" style="width: 100%; padding-left: 14px;" placeholder="Dr. Aarav Sharma" />
            </div>

            <div>
              <label style="display: block; font-size: 0.75rem; font-family: var(--font-mono); color: var(--text-muted); margin-bottom: 6px;">COLLEGE / INSTITUTION</label>
              <input type="text" id="auth-college" class="search-input" style="width: 100%; padding-left: 14px;" placeholder="Government College of Pharmacy" />
            </div>

            <div>
              <label style="display: block; font-size: 0.75rem; font-family: var(--font-mono); color: var(--text-muted); margin-bottom: 6px;">EMAIL ADDRESS</label>
              <input type="email" id="auth-email" required class="search-input" style="width: 100%; padding-left: 14px;" placeholder="aarav@pharmacy.edu" />
            </div>

            <div>
              <label style="display: block; font-size: 0.75rem; font-family: var(--font-mono); color: var(--text-muted); margin-bottom: 6px;">PASSWORD (MIN 6 CHARACTERS)</label>
              <input type="password" id="auth-password" minlength="6" required class="search-input" style="width: 100%; padding-left: 14px;" placeholder="••••••••" />
            </div>

            <button type="submit" class="btn btn-primary" id="btn-auth-submit" style="width: 100%; margin-top: 6px;">
              <span>CREATE D.PHARM ACCOUNT</span>
            </button>
          </form>
        ` : ''}

        <!-- Form: Forgot Password -->
        ${this.activeTab === 'forgot' ? `
          <form id="form-auth-forgot" style="display: flex; flex-direction: column; gap: 16px;">
            <p style="font-size: 0.88rem; color: var(--text-secondary);">Enter your account email to receive secure recovery instructions.</p>
            <div>
              <label style="display: block; font-size: 0.78rem; font-family: var(--font-mono); color: var(--text-muted); margin-bottom: 6px;">ACCOUNT EMAIL</label>
              <input type="email" id="auth-email" required class="search-input" style="width: 100%; padding-left: 14px;" placeholder="student@pharmacy.edu" />
            </div>

            <button type="submit" class="btn btn-primary" id="btn-auth-submit" style="width: 100%;">
              <span>SEND RECOVERY LINK</span>
            </button>

            <button type="button" class="btn btn-secondary" data-auth-tab="signin" style="width: 100%; font-size: 0.82rem;">
              RETURN TO SIGN IN
            </button>
          </form>
        ` : ''}

        <!-- Form: Supabase Configuration Inspector -->
        ${this.activeTab === 'supabase' ? `
          <div style="display: flex; flex-direction: column; gap: 14px; font-size: 0.86rem;">
            <div style="background: rgba(255,255,255,0.03); padding: 14px; border-radius: var(--radius-sm); border: 1px solid var(--border-subtle);">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                <span style="font-weight: 700;">Connection Status:</span>
                <span class="badge ${config.isConfigured ? 'badge-er2020' : 'badge-vvi'}" style="font-size: 0.7rem;">
                  ${config.isConfigured ? '● LIVE SUPABASE ACTIVE' : '○ DEV OFFLINE MODE'}
                </span>
              </div>
              <div style="font-size: 0.78rem; color: var(--text-muted);">
                ${config.isConfigured 
                  ? 'All authentication, attempts, bookmarks, and mock test scores sync with live PostgreSQL database with Row Level Security.' 
                  : 'Currently running in isolated multi-user development mode. Connect live Supabase credentials below or in .env.'}
              </div>
            </div>

            <form id="form-auth-supabase" style="display: flex; flex-direction: column; gap: 12px;">
              <div>
                <label style="display: block; font-size: 0.72rem; font-family: var(--font-mono); color: var(--text-muted); margin-bottom: 4px;">SUPABASE PROJECT URL</label>
                <input type="url" id="sb-url" class="search-input" style="width: 100%; padding-left: 14px;" value="${config.url}" placeholder="https://xyzcompany.supabase.co" />
              </div>

              <div>
                <label style="display: block; font-size: 0.72rem; font-family: var(--font-mono); color: var(--text-muted); margin-bottom: 4px;">SUPABASE ANON KEY</label>
                <input type="password" id="sb-key" class="search-input" style="width: 100%; padding-left: 14px;" value="${config.anonKey}" placeholder="eyJhbGciOiJIUzI1NiIsIn..." />
              </div>

              <button type="submit" class="btn btn-secondary" style="width: 100%; border-color: var(--accent-cyan); color: var(--accent-cyan);">
                SAVE & RECONNECT LIVE SUPABASE
              </button>
            </form>
          </div>
        ` : ''}

        <div style="margin-top: 24px; padding-top: 14px; border-top: 1px solid var(--border-subtle); text-align: center; font-size: 0.76rem; color: var(--text-muted);">
          Protected by Row Level Security (RLS) • PCI ER-2020 Compliant
        </div>
      </div>
    `;
  }

  showAlert(message, type = 'error') {
    const alertBox = document.getElementById('auth-alert-box');
    if (!alertBox) return;

    alertBox.style.display = 'block';
    if (type === 'error') {
      alertBox.style.background = 'rgba(239, 68, 68, 0.12)';
      alertBox.style.border = '1px solid var(--state-error)';
      alertBox.style.color = '#fca5a5';
    } else {
      alertBox.style.background = 'rgba(16, 185, 129, 0.12)';
      alertBox.style.border = '1px solid var(--state-success)';
      alertBox.style.color = '#a7f3d0';
    }
    alertBox.textContent = message;
  }

  bindEvents(overlay) {
    // Close on overlay click or button
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay || e.target.id === 'btn-close-auth-modal') {
        this.removeExisting();
      }
    });

    // Tab buttons
    overlay.querySelectorAll('[data-auth-tab]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.activeTab = btn.getAttribute('data-auth-tab');
        overlay.innerHTML = this.renderContent();
        this.bindEvents(overlay);
      });
    });

    // Forgot password link
    document.getElementById('link-forgot-pw')?.addEventListener('click', (e) => {
      e.preventDefault();
      this.activeTab = 'forgot';
      overlay.innerHTML = this.renderContent();
      this.bindEvents(overlay);
    });

    // Sign In Form Submit
    document.getElementById('form-auth-signin')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('auth-email').value.trim();
      const password = document.getElementById('auth-password').value;
      const submitBtn = document.getElementById('btn-auth-submit');

      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>SIGNING IN...</span>`;

      try {
        await auth.signIn(email, password);
        ui.showToast(`Welcome back, ${auth.getCurrentProfile()?.full_name || email}!`, 'success');
        this.removeExisting();
        if (this.onSuccess) this.onSuccess();
      } catch (err) {
        this.showAlert(err.message || "Failed to sign in. Please verify credentials.");
        submitBtn.disabled = false;
        submitBtn.innerHTML = `<span>SIGN IN TO DIGITAL LAB</span>`;
      }
    });

    // Sign Up Form Submit
    document.getElementById('form-auth-signup')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('auth-name').value.trim();
      const college = document.getElementById('auth-college').value.trim() || "Pharmacy College";
      const email = document.getElementById('auth-email').value.trim();
      const password = document.getElementById('auth-password').value;
      const submitBtn = document.getElementById('btn-auth-submit');

      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>CREATING ACCOUNT...</span>`;

      try {
        await auth.signUp(email, password, name, college);
        ui.showToast(`Account created! Welcome, ${name}.`, 'success');
        this.removeExisting();
        if (this.onSuccess) this.onSuccess();
      } catch (err) {
        this.showAlert(err.message || "Registration failed. Please check inputs.");
        submitBtn.disabled = false;
        submitBtn.innerHTML = `<span>CREATE D.PHARM ACCOUNT</span>`;
      }
    });

    // Forgot Password Submit
    document.getElementById('form-auth-forgot')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('auth-email').value.trim();
      const submitBtn = document.getElementById('btn-auth-submit');

      submitBtn.disabled = true;
      try {
        await auth.resetPassword(email);
        this.showAlert(`Recovery instructions dispatched to ${email}`, 'success');
        submitBtn.disabled = false;
      } catch (err) {
        this.showAlert(err.message || "Could not dispatch password reset email.");
        submitBtn.disabled = false;
      }
    });

    // Supabase Live Config Form Submit
    document.getElementById('form-auth-supabase')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const url = document.getElementById('sb-url').value.trim();
      const key = document.getElementById('sb-key').value.trim();

      saveManualConfig(url, key);
      ui.showToast("Supabase credentials updated! Re-initializing session...", "info");
      await auth.init();
      overlay.innerHTML = this.renderContent();
      this.bindEvents(overlay);
    });
  }
}
