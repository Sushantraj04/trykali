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

// Generate realistic CRM Seed Users spanning various activity and inactivity windows
export function getInitialCRMSeedUsers() {
  const now = Date.now();
  const ONE_DAY = 24 * 60 * 60 * 1000;

  return {
    'admin@cyberkali.org': {
      id: 'usr_admin_master',
      email: 'admin@cyberkali.org',
      username: 'RootOperator',
      passwordHash: hashPassword('admin2026'),
      role: 'admin',
      xp: 1250,
      rank: 'Red Team Elite',
      completedTasks: { 'recon-1': true, 'recon-2': true, 'web-1': true, 'priv-1': true },
      createdAt: new Date(now - 270 * ONE_DAY).toISOString(), // 9 months ago
      lastLoginAt: new Date(now - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
      lastLogoutAt: null,
      isLoggedIn: true,
      sessionCount: 84,
      status: 'active',
      crmNotes: 'Lead Security Architect & Administrator'
    },
    'alex.vance@redteam.io': {
      id: 'usr_alex_vance',
      email: 'alex.vance@redteam.io',
      username: 'VanceSec',
      passwordHash: hashPassword('password123'),
      role: 'user',
      xp: 750,
      rank: 'Red Team Elite',
      completedTasks: { 'recon-1': true, 'recon-2': true, 'web-1': true },
      createdAt: new Date(now - 120 * ONE_DAY).toISOString(), // 4 months ago
      lastLoginAt: new Date(now - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
      lastLogoutAt: null,
      isLoggedIn: true,
      sessionCount: 42,
      status: 'active',
      crmNotes: 'High-performing operator. Completed 3 CTF labs.'
    },
    'sarah.connor@secops.dev': {
      id: 'usr_sarah_connor',
      email: 'sarah.connor@secops.dev',
      username: 'SarahConnor',
      passwordHash: hashPassword('password123'),
      role: 'user',
      xp: 350,
      rank: 'Security Specialist',
      completedTasks: { 'recon-1': true, 'recon-2': true },
      createdAt: new Date(now - 90 * ONE_DAY).toISOString(), // 3 months ago
      lastLoginAt: new Date(now - 2 * ONE_DAY).toISOString(), // 2 days ago
      lastLogoutAt: new Date(now - 1 * ONE_DAY).toISOString(), // 1 day ago
      isLoggedIn: false,
      sessionCount: 19,
      status: 'active',
      crmNotes: 'Logged out after finishing directory fuzzing module.'
    },
    'david.miller@cloudguard.net': {
      id: 'usr_david_miller',
      email: 'david.miller@cloudguard.net',
      username: 'CloudMiller',
      passwordHash: hashPassword('password123'),
      role: 'user',
      xp: 200,
      rank: 'Junior Pentester',
      completedTasks: { 'recon-1': true },
      createdAt: new Date(now - 60 * ONE_DAY).toISOString(), // 2 months ago
      lastLoginAt: new Date(now - 38 * ONE_DAY).toISOString(), // 38 days ago (1+ month inactive)
      lastLogoutAt: new Date(now - 38 * ONE_DAY + 45 * 60 * 1000).toISOString(),
      isLoggedIn: false,
      sessionCount: 5,
      status: 'inactive',
      crmNotes: 'Inactive for > 1 month. Recommended for email re-engagement.'
    },
    'rajesh.kumar@pentestlab.in': {
      id: 'usr_rajesh_k',
      email: 'rajesh.kumar@pentestlab.in',
      username: 'RajeshPentest',
      passwordHash: hashPassword('password123'),
      role: 'user',
      xp: 300,
      rank: 'Security Specialist',
      completedTasks: { 'recon-1': true },
      createdAt: new Date(now - 180 * ONE_DAY).toISOString(), // 6 months ago
      lastLoginAt: new Date(now - 85 * ONE_DAY).toISOString(), // 85 days ago (~3 months inactive)
      lastLogoutAt: new Date(now - 85 * ONE_DAY + 30 * 60 * 1000).toISOString(),
      isLoggedIn: false,
      sessionCount: 11,
      status: 'inactive',
      crmNotes: 'Inactive for ~3 months. Was preparing for OSCP.'
    },
    'elena.rostova@cyberdef.eu': {
      id: 'usr_elena_r',
      email: 'elena.rostova@cyberdef.eu',
      username: 'ElenaSec',
      passwordHash: hashPassword('password123'),
      role: 'user',
      xp: 150,
      rank: 'Novice Hacker',
      completedTasks: {},
      createdAt: new Date(now - 220 * ONE_DAY).toISOString(), // 7+ months ago
      lastLoginAt: new Date(now - 195 * ONE_DAY).toISOString(), // 195 days ago (6+ months dormant)
      lastLogoutAt: new Date(now - 195 * ONE_DAY + 20 * 60 * 1000).toISOString(),
      isLoggedIn: false,
      sessionCount: 2,
      status: 'dormant',
      crmNotes: 'Dormant user (> 6 months). Candidate for churn prevention offer.'
    },
    'zero_day_ghost@proton.me': {
      id: 'usr_zero_ghost',
      email: 'zero_day_ghost@proton.me',
      username: 'Ghost0Day',
      passwordHash: hashPassword('password123'),
      role: 'user',
      xp: 500,
      rank: 'Red Team Elite',
      completedTasks: { 'recon-1': true, 'priv-1': true },
      createdAt: new Date(now - 250 * ONE_DAY).toISOString(), // 8+ months ago
      lastLoginAt: new Date(now - 215 * ONE_DAY).toISOString(), // 215 days ago (7+ months dormant)
      lastLogoutAt: new Date(now - 215 * ONE_DAY + 50 * 60 * 1000).toISOString(),
      isLoggedIn: false,
      sessionCount: 8,
      status: 'dormant',
      crmNotes: 'Dormant user (> 7 months). High skilled operator.'
    },
    'spambot_crawler@trashmail.com': {
      id: 'usr_spambot',
      email: 'spambot_crawler@trashmail.com',
      username: 'SpamCrawlerBot',
      passwordHash: hashPassword('password123'),
      role: 'user',
      xp: 0,
      rank: 'Novice Hacker',
      completedTasks: {},
      createdAt: new Date(now - 40 * ONE_DAY).toISOString(),
      lastLoginAt: new Date(now - 39 * ONE_DAY).toISOString(),
      lastLogoutAt: new Date(now - 39 * ONE_DAY).toISOString(),
      isLoggedIn: false,
      sessionCount: 1,
      status: 'suspended',
      crmNotes: 'Suspended by admin due to automated brute-force attempts.'
    }
  };
}

// Helper to get all registered users (auto-seeded if empty)
function getRegisteredUsers() {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_USERS_KEY);
    if (!raw) {
      const seeded = getInitialCRMSeedUsers();
      localStorage.setItem(LOCAL_STORAGE_USERS_KEY, JSON.stringify(seeded));
      return seeded;
    }
    const parsed = JSON.parse(raw);
    // If only empty object, reseed
    if (Object.keys(parsed).length === 0) {
      const seeded = getInitialCRMSeedUsers();
      localStorage.setItem(LOCAL_STORAGE_USERS_KEY, JSON.stringify(seeded));
      return seeded;
    }
    return parsed;
  } catch {
    return getInitialCRMSeedUsers();
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

    const nowIso = new Date().toISOString();
    const newUser = {
      id: 'usr_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      email: cleanEmail,
      username: username?.trim() || cleanEmail.split('@')[0],
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
  },

  // ==========================================
  // CRM ADMIN METHODS
  // ==========================================

  // CRM: Retrieve all users with enriched analytics
  async getAllCRMUsers() {
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
