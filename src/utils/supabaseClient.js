import { createClient } from '@supabase/supabase-js';

// Read environment variables (Vite prefix: VITE_) securely from environment
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

// Local Database Helper for Persistent Multi-User Accounts & CRM Telemetry
const LOCAL_STORAGE_USERS_KEY = 'cyberkali_db_users';
const LOCAL_STORAGE_SESSION_KEY = 'cyberkali_active_session';

// Simple deterministic hash for local credential verification
function hashPassword(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return 'h_' + Math.abs(hash).toString(36);
}

// Production User Store Initialization
export function getInitialCRMSeedUsers() {
  return {};
}

// Helper to get all registered users
function getRegisteredUsers() {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_USERS_KEY);
    if (!raw) return {};
    return JSON.parse(raw) || {};
  } catch {
    return {};
  }
}

// Helper to save all registered users
function saveRegisteredUsers(usersMap) {
  localStorage.setItem(LOCAL_STORAGE_USERS_KEY, JSON.stringify(usersMap));
}

// Helper: Calculate exact inactivity duration and cohort bracket
export function calculateInactivity(lastLoginAt, lastLogoutAt) {
  const lastActive = lastLoginAt || lastLogoutAt;
  if (!lastActive) {
    return { days: 0, months: 0, label: 'Recently Active', bracket: 'active_week' };
  }

  const diffMs = Date.now() - new Date(lastActive).getTime();
  const days = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
  const months = parseFloat((days / 30.4).toFixed(1));

  if (days < 7) {
    return { days, months, label: 'Active this week', bracket: 'active_week' };
  } else if (days < 30) {
    return { days, months, label: `${days} days ago (< 1 month)`, bracket: 'inactive_month_1' };
  } else if (days < 90) {
    const m = Math.round(days / 30);
    return { days, months, label: `${m} month${m > 1 ? 's' : ''} inactive`, bracket: 'inactive_months_1_3' };
  } else if (days < 180) {
    const m = Math.round(days / 30);
    return { days, months, label: `${m} months inactive`, bracket: 'inactive_months_3_6' };
  } else {
    const m = Math.round(days / 30);
    return { days, months, label: `Dormant (${m}+ months)`, bracket: 'dormant_months_6_plus' };
  }
}

// Unified Authentication & CRM Database Service
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

    const users = getRegisteredUsers();

    // Check if email already registered
    if (users[cleanEmail]) {
      throw new Error("An account with this email is already registered! Please switch to Sign In.");
    }

    const nowIso = new Date().toISOString();
    const cleanUsername = username?.trim() || cleanEmail.split('@')[0];
    const newUser = {
      id: 'usr_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      email: cleanEmail,
      username: cleanUsername,
      passwordHash: hashPassword(cleanPass),
      role: cleanEmail.includes('admin') ? 'admin' : 'user',
      xp: 150,
      rank: 'Novice Hacker',
      completedTasks: {}, // { [taskId]: true }
      createdAt: nowIso,
      lastLoginAt: nowIso,
      lastLogoutAt: null,
      isLoggedIn: true,
      sessionCount: 1,
      status: 'active',
      crmNotes: 'Self-registered via Web Portal'
    };

    // Save to users registry
    users[cleanEmail] = newUser;
    saveRegisteredUsers(users);

    // Set active session for this user
    localStorage.setItem(LOCAL_STORAGE_SESSION_KEY, JSON.stringify(newUser));

    // Optional background Supabase Auth synchronization (non-blocking, won't throw rate limit error to user)
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.auth.signUp({
          email: cleanEmail,
          password: cleanPass,
          options: {
            data: { username: cleanUsername, xp: 150, rank: 'Novice Hacker' }
          }
        });
      } catch (e) {
        // Silently caught: Email rate limits or SMTP provider delays never block the user!
      }
    }

    return newUser;
  },

  // SIGN IN: Authenticate registered user with matching email & password
  async signIn({ email, password }) {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();

    if (!cleanEmail || !cleanPass) {
      throw new Error("Please enter both email and password.");
    }

    const users = getRegisteredUsers();
    let existingUser = users[cleanEmail];

    // Check against Supabase Auth if not in local cache
    if (!existingUser && isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password: cleanPass
        });
        if (!error && data?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();
          const nowIso = new Date().toISOString();
          existingUser = {
            id: data.user.id,
            email: cleanEmail,
            username: profile?.username || cleanEmail.split('@')[0],
            passwordHash: hashPassword(cleanPass),
            role: cleanEmail.includes('admin') ? 'admin' : 'user',
            xp: profile?.xp || 150,
            rank: profile?.rank || 'Novice Hacker',
            completedTasks: profile?.completed_tasks || {},
            createdAt: profile?.created_at || nowIso,
            lastLoginAt: nowIso,
            lastLogoutAt: null,
            isLoggedIn: true,
            sessionCount: 1,
            status: 'active',
            crmNotes: 'Authenticated via Cloud'
          };
          users[cleanEmail] = existingUser;
          saveRegisteredUsers(users);
        }
      } catch {
        // ignore
      }
    }

    // Check 1: Does this user exist?
    if (!existingUser) {
      throw new Error("No account found with this email! Please register first.");
    }

    // Check 2: Account suspended?
    if (existingUser.status === 'suspended') {
      throw new Error("This account has been suspended by the administrator. Please contact support.");
    }

    // Check 3: Does password match?
    if (existingUser.passwordHash !== hashPassword(cleanPass)) {
      throw new Error("Incorrect password! Please enter the correct password.");
    }

    // Authentication Success: Update session & telemetry
    existingUser.lastLoginAt = new Date().toISOString();
    existingUser.lastLogoutAt = null;
    existingUser.isLoggedIn = true;
    existingUser.sessionCount = (existingUser.sessionCount || 0) + 1;
    existingUser.status = 'active';

    users[cleanEmail] = existingUser;
    saveRegisteredUsers(users);

    // Set active session
    localStorage.setItem(LOCAL_STORAGE_SESSION_KEY, JSON.stringify(existingUser));

    // Non-blocking background sync with Supabase
    if (isSupabaseConfigured && supabase) {
      supabase.auth.signInWithPassword({ email: cleanEmail, password: cleanPass }).catch(() => {});
    }

    return existingUser;
  },

  // SIGN OUT: Clear active session and record logout time
  async signOut() {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_SESSION_KEY);
      if (raw) {
        const sessionUser = JSON.parse(raw);
        const users = getRegisteredUsers();
        if (sessionUser?.email && users[sessionUser.email]) {
          users[sessionUser.email].isLoggedIn = false;
          users[sessionUser.email].lastLogoutAt = new Date().toISOString();
          saveRegisteredUsers(users);
        }
      }
    } catch {
      // ignore
    }

    if (isSupabaseConfigured && supabase) {
      supabase.auth.signOut().catch(() => {});
    }
    localStorage.removeItem(LOCAL_STORAGE_SESSION_KEY);
  },

  // Get current active logged-in user
  async getCurrentUser() {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_SESSION_KEY);
      if (raw) {
        const sessionUser = JSON.parse(raw);
        const users = getRegisteredUsers();
        if (sessionUser?.email && users[sessionUser.email]) {
          return users[sessionUser.email];
        }
      }
    } catch {
      // fallback
    }

    // Fallback: Check Supabase Auth
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
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
      } catch {
        // ignore
      }
    }

    return null;
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
  },

  // ==========================================
  // CRM ADMIN METHODS
  // ==========================================

  // CRM: Retrieve all users with enriched analytics (Live Supabase + Local)
  async getAllCRMUsers() {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('profiles').select('*');
        if (!error && Array.isArray(data) && data.length > 0) {
          return data.map(p => ({
            id: p.id,
            email: p.email,
            username: p.username,
            role: p.role || 'user',
            xp: p.xp || 150,
            rank: p.rank || 'Novice Hacker',
            status: p.status || 'active',
            isLoggedIn: p.is_logged_in ?? true,
            createdAt: p.created_at,
            lastLoginAt: p.last_login_at,
            lastLogoutAt: p.last_logout_at,
            sessionCount: p.session_count || 1,
            crmNotes: p.crm_notes || '',
            inactivity: calculateInactivity(p.last_login_at, p.last_logout_at)
          }));
        }
      } catch (err) {
        console.warn("Supabase fetch profiles error:", err);
      }
    }

    const usersMap = getRegisteredUsers();
    return Object.values(usersMap).map(u => ({
      ...u,
      inactivity: calculateInactivity(u.lastLoginAt, u.lastLogoutAt)
    }));
  },

  // CRM: Update user account status
  async updateUserStatus(userId, newStatus) {
    const users = getRegisteredUsers();
    for (const emailKey in users) {
      if (users[emailKey].id === userId) {
        users[emailKey].status = newStatus;
        if (newStatus === 'suspended') {
          users[emailKey].isLoggedIn = false;
        }
        saveRegisteredUsers(users);
        return users[emailKey];
      }
    }
    throw new Error("User not found");
  },

  // CRM: Update user role
  async updateUserRole(userId, newRole) {
    const users = getRegisteredUsers();
    for (const emailKey in users) {
      if (users[emailKey].id === userId) {
        users[emailKey].role = newRole;
        saveRegisteredUsers(users);
        return users[emailKey];
      }
    }
    throw new Error("User not found");
  },

  // CRM: Adjust user XP
  async updateUserXP(userId, newXp) {
    const users = getRegisteredUsers();
    for (const emailKey in users) {
      if (users[emailKey].id === userId) {
        users[emailKey].xp = Math.max(0, parseInt(newXp, 10) || 0);
        const xp = users[emailKey].xp;
        users[emailKey].rank = xp >= 500 ? 'Red Team Elite' : (xp >= 300 ? 'Security Specialist' : (xp >= 200 ? 'Junior Pentester' : 'Novice Hacker'));
        saveRegisteredUsers(users);
        return users[emailKey];
      }
    }
    throw new Error("User not found");
  },

  // CRM: Update internal CRM notes
  async updateUserNotes(userId, notes) {
    const users = getRegisteredUsers();
    for (const emailKey in users) {
      if (users[emailKey].id === userId) {
        users[emailKey].crmNotes = notes;
        saveRegisteredUsers(users);
        return users[emailKey];
      }
    }
    throw new Error("User not found");
  },

  // CRM: Delete user account
  async deleteUser(userId) {
    const users = getRegisteredUsers();
    for (const emailKey in users) {
      if (users[emailKey].id === userId) {
        delete users[emailKey];
        saveRegisteredUsers(users);
        return true;
      }
    }
    throw new Error("User not found");
  },

  // CRM: Re-engage single user (simulated notification trigger)
  async reengageUser(userId, message) {
    const users = getRegisteredUsers();
    for (const emailKey in users) {
      if (users[emailKey].id === userId) {
        users[emailKey].reengagedAt = new Date().toISOString();
        const msg = message || 'Sent 250 XP Re-engagement bonus email';
        users[emailKey].crmNotes = (users[emailKey].crmNotes || '') + ` | [Re-engage Alert]: ${msg} (${new Date().toLocaleDateString()})`;
        saveRegisteredUsers(users);
        return true;
      }
    }
    throw new Error("User not found");
  },

  // CRM: Reset registry back to demo seed data
  async resetToDemoCRMData() {
    const seeded = getInitialCRMSeedUsers();
    saveRegisteredUsers(seeded);
    return Object.values(seeded).map(u => ({
      ...u,
      inactivity: calculateInactivity(u.lastLoginAt, u.lastLogoutAt)
    }));
  }
};
