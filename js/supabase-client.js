// Supabase Client Initializer with Dynamic Config Loader & Offline Fallback Provider
// Automatically connects with credentials from /api/config or manual project settings

let supabaseInstance = null;
let supabaseConfig = {
  url: '',
  anonKey: '',
  isConfigured: false,
  aiConfigured: false
};

// Fetch configuration from server endpoint /api/config
export async function loadServerConfig() {
  try {
    const res = await fetch('/api/config');
    if (res.ok) {
      const data = await res.json();
      supabaseConfig.url = data.supabaseUrl || '';
      supabaseConfig.anonKey = data.supabaseAnonKey || '';
      supabaseConfig.aiConfigured = Boolean(data.aiConfigured);
    }
  } catch (err) {
    console.warn("Could not fetch /api/config from server, checking local overrides", err);
  }

  // Also check localStorage for manual user override in developer mode
  const manualUrl = localStorage.getItem('pharmaquest_supabase_url');
  const manualKey = localStorage.getItem('pharmaquest_supabase_key');
  if (manualUrl && manualKey) {
    supabaseConfig.url = manualUrl;
    supabaseConfig.anonKey = manualKey;
  }

  supabaseConfig.isConfigured = Boolean(
    supabaseConfig.url && 
    supabaseConfig.url.startsWith('http') && 
    supabaseConfig.anonKey && 
    supabaseConfig.anonKey.length > 10
  );

  return supabaseConfig;
}

export function getConfig() {
  return supabaseConfig;
}

export function saveManualConfig(url, key) {
  if (url && key) {
    localStorage.setItem('pharmaquest_supabase_url', url);
    localStorage.setItem('pharmaquest_supabase_key', key);
    supabaseConfig.url = url;
    supabaseConfig.anonKey = key;
    supabaseConfig.isConfigured = true;
    supabaseInstance = null; // force re-instantiation
  }
}

// Get or initialize the Supabase client
export async function getSupabase() {
  if (supabaseInstance) return supabaseInstance;

  await loadServerConfig();

  if (supabaseConfig.isConfigured) {
    try {
      // Load Supabase JS client dynamically using modern ESM module
      const { createClient } = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm');
      supabaseInstance = createClient(supabaseConfig.url, supabaseConfig.anonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true
        }
      });
      console.log("✓ Supabase Live Client initialized successfully");
      return supabaseInstance;
    } catch (e) {
      console.error("Failed to load @supabase/supabase-js from CDN, falling back to local provider", e);
    }
  }

  // If live credentials are not yet configured, return null
  return null;
}
