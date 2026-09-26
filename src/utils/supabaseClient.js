import { createClient } from '@supabase/supabase-js';

// Read environment variables (Vite prefix: VITE_)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// True only if valid Supabase credentials have been provided
export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('your-supabase-url') &&
  !supabaseUrl.includes('your-project-id')
);

// Initialize real Supabase client if configured
export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Local Database Helper for Persistent Multi-User Accounts
const LOCAL_STORAGE_USERS_KEY = 'cyberkali_db_users';
const LOCAL_STORAGE_SESSION_KEY = 'cyberkali_active_session';

// Helper to get all registered users
function getRegisteredUsers() {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_USERS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

// Helper to save all registered users
function saveRegisteredUsers(usersMap) {
  localStorage.setItem(LOCAL_STORAGE_USERS_KEY, JSON.stringify(usersMap));
}

// Simple deterministic hash for local credential verification
function hashPassword(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return 'h_' + Math.abs(hash).toString(36);
}

// Unified Authentication & Database Service
export const cyberAuth = {
  // SIGN UP: Register a new account
  async signUp({ email, password, username }) {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();

    if (!cleanEmail || !cleanPass) {
      throw new Error("Both email and password are required.");
    }
    if (cleanPass.length < 6) {
      throw new Error("Password must be at least 6 characters long.");
    }

    // 1. If Real Supabase is configured
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password: cleanPass,
        options: {
          data: { username: username || cleanEmail.split('@')[0], xp: 150, rank: 'Novice Hacker' }
        }
      });
      if (error) throw new Error(error.message);

      if (data.user) {
        await supabase.from('profiles').upsert({
          id: data.user.id,
          email: cleanEmail,
          username: username || cleanEmail.split('@')[0],
          xp: 150,
          rank: 'Novice Hacker'
        });
        return data.user;
      }
      throw new Error("Registration failed on server. Please try again.");
    }

    // 2. Strict Local Database Registration
    const users = getRegisteredUsers();

    // Check if email already registered
    if (users[cleanEmail]) {
      throw new Error("This email is already registered! Please sign in.");
    }

    const newUser = {
      id: 'usr_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      email: cleanEmail,
      username: username?.trim() || cleanEmail.split('@')[0],
      passwordHash: hashPassword(cleanPass),
      xp: 150,
      rank: 'Novice Hacker',
      completedTasks: {}, // { [taskId]: true }
      createdAt: new Date().toISOString()
    };

    // Save to users registry
    users[cleanEmail] = newUser;
    saveRegisteredUsers(users);

    // Set active session for this user
    localStorage.setItem(LOCAL_STORAGE_SESSION_KEY, JSON.stringify(newUser));

    return newUser;
  },

  // SIGN IN: Authenticate ONLY registered users with matching password
  async signIn({ email, password }) {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();

    if (!cleanEmail || !cleanPass) {
      throw new Error("Please enter both email and password.");
    }

    // 1. If Real Supabase is configured
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: cleanPass
      });
      if (error) {
        throw new Error("Invalid email or password! Please check your credentials.");
      }

      // Fetch profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      return {
        id: data.user.id,
        email: data.user.email,
        username: profile?.username || data.user.email.split('@')[0],
        xp: profile?.xp || 150,
        rank: profile?.rank || 'Novice Hacker'
      };
    }

    // 2. Strict Local Database Verification
    const users = getRegisteredUsers();
    const existingUser = users[cleanEmail];

    // Check 1: Does this user exist?
    if (!existingUser) {
      throw new Error("No account found with this email! Please sign up first.");
    }

    // Check 2: Does password match?
    if (existingUser.passwordHash !== hashPassword(cleanPass)) {
      throw new Error("Incorrect password! Please enter the correct password.");
    }

    // Authentication Success: Set active session
    localStorage.setItem(LOCAL_STORAGE_SESSION_KEY, JSON.stringify(existingUser));

    return existingUser;
  },

  // SIGN OUT: Clear active session
  async signOut() {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem(LOCAL_STORAGE_SESSION_KEY);
  },

  // Get current active logged-in user
  async getCurrentUser() {
    if (isSupabaseConfigured && supabase) {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      return {
        id: user.id,
        email: user.email,
        username: profile?.username || user.email.split('@')[0],
        xp: profile?.xp || 150,
        rank: profile?.rank || 'Novice Hacker'
      };
    }

    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_SESSION_KEY);
      if (!raw) return null;
      const sessionUser = JSON.parse(raw);

      // Verify user still exists in database
      const users = getRegisteredUsers();
      if (sessionUser.email && users[sessionUser.email]) {
        return users[sessionUser.email];
      }
      return null;
    } catch {
      return null;
    }
  },

  // SYNC USER DATA: Update XP, Rank, and Tasks for the logged-in user
  async syncUserProgress(userId, { xp, rank, completedTaskId }) {
    if (!userId) return;

    if (isSupabaseConfigured && supabase) {
      await supabase.from('profiles').update({ xp, rank }).eq('id', userId);
      return;
    }

    // Update in local registry
    const users = getRegisteredUsers();
    for (const emailKey in users) {
      if (users[emailKey].id === userId) {
        users[emailKey].xp = xp;
        users[emailKey].rank = rank;
        if (completedTaskId) {
          users[emailKey].completedTasks = users[emailKey].completedTasks || {};
          users[emailKey].completedTasks[completedTaskId] = true;
        }
        saveRegisteredUsers(users);

        // Update active session
        localStorage.setItem(LOCAL_STORAGE_SESSION_KEY, JSON.stringify(users[emailKey]));
        break;
      }
    }
  }
};
