// Authentication Manager for PHARMAQUEST
// Supports real Supabase Auth with automatic session persistence and user profile synchronization

import { getSupabase, getConfig } from "./supabase-client.js";

let authListeners = [];
let currentUser = null;
let currentProfile = null;

// Local fallback storage key when testing in unconfigured dev environment
const LOCAL_USERS_KEY = "pharmaquest_auth_mock_users";
const LOCAL_SESSION_KEY = "pharmaquest_auth_mock_session";

function getLocalUsers() {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_USERS_KEY) || "[]");
  } catch (e) {
    return [];
  }
}

function saveLocalUsers(users) {
  localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
}

export const auth = {
  // Subscribe to auth state changes
  onAuthStateChange(callback) {
    authListeners.push(callback);
    callback(currentUser, currentProfile);
    return () => {
      authListeners = authListeners.filter(cb => cb !== callback);
    };
  },

  notify() {
    for (const cb of authListeners) {
      try {
        cb(currentUser, currentProfile);
      } catch (e) {
        console.error("Auth listener error", e);
      }
    }
  },

  getCurrentUser() {
    return currentUser;
  },

  getCurrentProfile() {
    return currentProfile;
  },

  isAuthenticated() {
    return Boolean(currentUser && currentUser.id);
  },

  // Initialize session on page load
  async init() {
    const supabase = await getSupabase();

    if (supabase) {
      // 1. Live Supabase Auth Flow
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (session && session.user) {
          currentUser = session.user;
          await this.loadProfile(currentUser.id);
        }

        // Listen for live Supabase Auth state changes
        supabase.auth.onAuthStateChange(async (event, session) => {
          if (session && session.user) {
            currentUser = session.user;
            await this.loadProfile(currentUser.id);
          } else {
            currentUser = null;
            currentProfile = null;
          }
          this.notify();
        });
      } catch (err) {
        console.warn("Error initializing live Supabase session:", err);
      }
    } else {
      // 2. Dev Mock Fallback Session
      try {
        const sessionData = localStorage.getItem(LOCAL_SESSION_KEY);
        if (sessionData) {
          const session = JSON.parse(sessionData);
          currentUser = session.user;
          currentProfile = session.profile;
        }
      } catch (e) {
        console.warn("Could not restore dev session", e);
      }
    }

    this.notify();
    return currentUser;
  },

  // Load User Profile from profiles table
  async loadProfile(userId) {
    const supabase = await getSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .maybeSingle();

        if (data) {
          currentProfile = {
            ...data,
            full_name: data.full_name || data.name || currentUser?.user_metadata?.full_name || currentUser?.email?.split('@')[0] || "Pharmacist",
            college_name: data.college_name || currentUser?.user_metadata?.college_name || "Pharmacy College",
            year_of_study: data.year_of_study || currentUser?.user_metadata?.year_of_study || "D.Pharm Part I (ER-2020)"
          };
        } else if (currentUser) {
          // If profile trigger hasn't completed yet, create default
          currentProfile = {
            id: userId,
            email: currentUser.email,
            full_name: currentUser.user_metadata?.full_name || currentUser.email.split('@')[0],
            college_name: currentUser.user_metadata?.college_name || 'Pharmacy College',
            year_of_study: currentUser.user_metadata?.year_of_study || 'D.Pharm Part I (ER-2020)'
          };
        }
      } catch (e) {
        console.error("Error loading user profile:", e);
      }
    } else if (currentUser) {
      // Fallback profile
      currentProfile = {
        id: currentUser.id,
        email: currentUser.email,
        full_name: currentUser.user_metadata?.full_name || currentUser.email.split('@')[0],
        college_name: currentUser.user_metadata?.college_name || 'Pharmacy College',
        year_of_study: 'D.Pharm Part I (ER-2020)'
      };
    }
    return currentProfile;
  },

  // Sign Up
  async signUp(email, password, fullName, collegeName = "Pharmacy College", yearOfStudy = "D.Pharm Part I (ER-2020)") {
    const supabase = await getSupabase();

    if (supabase) {
      // Live Supabase Sign Up
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            college_name: collegeName,
            year_of_study: yearOfStudy
          }
        }
      });

      if (error) throw error;

      if (data.user) {
        currentUser = data.user;
        await this.loadProfile(currentUser.id);
        this.notify();
      }
      return data;
    } else {
      // Dev Mock Sign Up
      const users = getLocalUsers();
      if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
        throw new Error("An account with this email address already exists.");
      }

      const mockUser = {
        id: "usr-" + Math.random().toString(36).substring(2, 10),
        email,
        user_metadata: {
          full_name: fullName,
          college_name: collegeName,
          year_of_study: yearOfStudy
        },
        created_at: new Date().toISOString()
      };

      const mockProfile = {
        id: mockUser.id,
        email: mockUser.email,
        full_name: fullName,
        college_name: collegeName,
        year_of_study: yearOfStudy,
        created_at: new Date().toISOString()
      };

      users.push({ ...mockUser, password });
      saveLocalUsers(users);

      currentUser = mockUser;
      currentProfile = mockProfile;
      localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify({ user: mockUser, profile: mockProfile }));
      this.notify();
      return { user: mockUser };
    }
  },

  // Sign In
  async signIn(email, password) {
    const supabase = await getSupabase();

    if (supabase) {
      // Live Supabase Sign In
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      if (data.user) {
        currentUser = data.user;
        await this.loadProfile(currentUser.id);
        this.notify();
      }
      return data;
    } else {
      // Dev Mock Sign In
      const users = getLocalUsers();
      const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);

      if (!user) {
        throw new Error("Invalid login credentials. Please check your email and password.");
      }

      const mockUser = {
        id: user.id,
        email: user.email,
        user_metadata: user.user_metadata,
        created_at: user.created_at
      };

      const mockProfile = {
        id: user.id,
        email: user.email,
        full_name: user.user_metadata.full_name,
        college_name: user.user_metadata.college_name,
        year_of_study: user.user_metadata.year_of_study,
        created_at: user.created_at
      };

      currentUser = mockUser;
      currentProfile = mockProfile;
      localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify({ user: mockUser, profile: mockProfile }));
      this.notify();
      return { user: mockUser };
    }
  },

  // Sign Out
  async signOut() {
    const supabase = await getSupabase();

    if (supabase) {
      await supabase.auth.signOut();
    } else {
      localStorage.removeItem(LOCAL_SESSION_KEY);
    }

    currentUser = null;
    currentProfile = null;
    this.notify();
  },

  // Password Reset Request
  async resetPassword(email) {
    const supabase = await getSupabase();
    if (supabase) {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin
      });
      if (error) throw error;
      return data;
    } else {
      return { message: "In dev mode, reset instructions would be dispatched to: " + email };
    }
  },

  // Update Profile
  async updateProfile(updates) {
    if (!currentUser) throw new Error("No authenticated user");

    const supabase = await getSupabase();
    if (supabase) {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', currentUser.id)
        .select()
        .single();

      if (error) throw error;
      currentProfile = { ...currentProfile, ...data };
      this.notify();
      return currentProfile;
    } else {
      currentProfile = { ...currentProfile, ...updates };
      const sessionData = localStorage.getItem(LOCAL_SESSION_KEY);
      if (sessionData) {
        const session = JSON.parse(sessionData);
        session.profile = currentProfile;
        localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(session));
      }
      this.notify();
      return currentProfile;
    }
  }
};
