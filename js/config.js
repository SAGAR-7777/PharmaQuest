// Central API & Environment Configuration for PHARMAQUEST
// Manages backend base URLs across Local development and Production (Vercel + Render)

/**
 * PRODUCTION RENDER BACKEND URL:
 * Live Node.js backend hosted on Render.
 */
export const PRODUCTION_BACKEND_URL = "https://pharmaquest.onrender.com";

/**
 * Resolves the appropriate API base URL based on runtime environment:
 * - Localhost / 127.0.0.1: Returns "" (relative URL, targeting local Node server on port 3000)
 * - Production (Vercel / non-localhost): Returns "https://pharmaquest.onrender.com"
 * - Override: window.__PHARMAQUEST_API_URL__ takes highest priority if explicitly set.
 */
export function getApiBaseUrl() {
  // 1. Explicit window override (can be set in index.html or DevTools)
  if (typeof window !== 'undefined' && window.__PHARMAQUEST_API_URL__) {
    const custom = window.__PHARMAQUEST_API_URL__.trim();
    if (custom.length > 0) {
      return custom.replace(/\/+$/, '');
    }
  }

  // 2. Local development detection:
  // If running locally (localhost or 127.0.0.1), use relative path "" to connect to local server.js
  if (typeof window !== 'undefined' && window.location) {
    const hostname = window.location.hostname;
    const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '0.0.0.0' || hostname === '';
    if (isLocalhost) {
      return "";
    }
  }

  // 3. LocalStorage override (for debugging or manual switching)
  try {
    if (typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem('pharmaquest_api_base_url');
      if (saved && saved.startsWith('http')) {
        return saved.trim().replace(/\/+$/, '');
      }
    }
  } catch (e) {}

  // 4. Production environment (e.g. Vercel, or outside localhost):
  // Return the live Render backend URL
  if (PRODUCTION_BACKEND_URL && PRODUCTION_BACKEND_URL.trim().length > 0) {
    return PRODUCTION_BACKEND_URL.trim().replace(/\/+$/, '');
  }

  return "";
}

/**
 * Helper to construct an absolute or relative API URL
 * @param {string} endpoint e.g. '/api/ai/chat' or '/api/config'
 * @returns {string} Fully qualified URL in production, or relative path in local development
 */
export function apiUrl(endpoint) {
  const base = getApiBaseUrl();
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return base ? `${base}${path}` : path;
}
