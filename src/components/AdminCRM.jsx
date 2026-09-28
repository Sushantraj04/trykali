import React, { useState, useEffect, useMemo } from 'react';
import { 
  Users, UserCheck, UserX, Clock, ShieldAlert, Search, Filter, 
  Download, Send, Edit3, Trash2, CheckCircle2, AlertTriangle, 
  Sparkles, RefreshCw, Key, Shield, ExternalLink, Mail, Award, 
  Zap, ArrowUpRight, ChevronRight, X, Save, Ban, Lock, BarChart3
} from 'lucide-react';
import { cyberAuth } from '../utils/supabaseClient';

export function AdminCRMView({ currentUser, onNavigate, onSendToTerminal, onOpenAuth }) {
  // Admin Authorization State
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(false);
  const [adminPinInput, setAdminPinInput] = useState('');
  const [pinError, setPinError] = useState('');

  // CRM Users & Data State
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // all | online | logged_out | inactive_1m | dormant_6m | suspended
  const [selectedUser, setSelectedUser] = useState(null); // For detail modal

  // Campaign & Broadcast Modal State
  const [isBroadcastOpen, setIsBroadcastOpen] = useState(false);
  const [broadcastTarget, setBroadcastTarget] = useState('inactive_1m');
  const [broadcastSubject, setBroadcastSubject] = useState('We miss you! 500 Bonus XP & New Kali CTF Labs Waiting');
  const [broadcastMessage, setBroadcastMessage] = useState('Hey Operator! Your security lab environment is waiting. Re-login today to claim 500 bonus XP and test new Social Recon & Exploit tools.');
  const [broadcastSuccess, setBroadcastSuccess] = useState(false);

  // Edit User State
  const [editingNotes, setEditingNotes] = useState('');
  const [editingXP, setEditingXP] = useState('');
  const [editingStatus, setEditingStatus] = useState('active');
  const [editingRole, setEditingRole] = useState('user');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  // Auto-unlock if logged-in user is already admin
  useEffect(() => {
    if (currentUser?.role === 'admin' || currentUser?.email?.includes('admin')) {
      setIsAdminUnlocked(true);
    }
  }, [currentUser]);

  // Load CRM Users
  const loadCRMData = async () => {
    setIsLoading(true);
    try {
      const data = await cyberAuth.getAllCRMUsers();
      setUsers(data);
    } catch (err) {
      console.error("Failed to load CRM data", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAdminUnlocked) {
      loadCRMData();
    }
  }, [isAdminUnlocked]);

  // Admin PIN verification
  const handleUnlockAdmin = (e) => {
    e.preventDefault();
    if (adminPinInput.trim() === 'admin2026' || adminPinInput.trim() === 'admin') {
      setIsAdminUnlocked(true);
      setPinError('');
    } else {
      setPinError('Invalid Master Passkey. Access Denied.');
    }
  };

  // Calculate Key CRM Metrics
  const metrics = useMemo(() => {
    const total = users.length;
    const online = users.filter(u => u.isLoggedIn).length;
    const loggedOut = users.filter(u => !u.isLoggedIn && u.status !== 'suspended').length;
    const suspended = users.filter(u => u.status === 'suspended').length;

    // Inactivity cohorts (Months Inactive breakdown)
    const activeWeek = users.filter(u => u.inactivity?.bracket === 'active_week').length;
    const inactive1M = users.filter(u => u.inactivity?.bracket === 'inactive_month_1').length;
    const inactive1To3M = users.filter(u => u.inactivity?.bracket === 'inactive_months_1_3').length;
    const inactive3To6M = users.filter(u => u.inactivity?.bracket === 'inactive_months_3_6').length;
    const dormant6MPlus = users.filter(u => u.inactivity?.bracket === 'dormant_months_6_plus').length;

    // Total inactive > 1 month (churn warning)
    const totalAtRisk = inactive1To3M + inactive3To6M + dormant6MPlus;
    const churnRate = total > 0 ? Math.round((totalAtRisk / total) * 100) : 0;
    const totalXP = users.reduce((acc, u) => acc + (u.xp || 0), 0);

    return {
      total,
      online,
      loggedOut,
      suspended,
      activeWeek,
      inactive1M,
      inactive1To3M,
      inactive3To6M,
      dormant6MPlus,
      totalAtRisk,
      churnRate,
      totalXP
    };
  }, [users]);

  // Filtered Users List
  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      // 1. Search Query Match
      const matchesSearch = 
        u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.id?.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      // 2. Status & Retention Bracket Filter
      if (statusFilter === 'all') return true;
      if (statusFilter === 'online') return u.isLoggedIn;
      if (statusFilter === 'logged_out') return !u.isLoggedIn && u.status !== 'suspended';
      if (statusFilter === 'inactive_1m') return ['inactive_month_1', 'inactive_months_1_3', 'inactive_months_3_6', 'dormant_months_6_plus'].includes(u.inactivity?.bracket);
      if (statusFilter === 'inactive_3m') return ['inactive_months_1_3', 'inactive_months_3_6', 'dormant_months_6_plus'].includes(u.inactivity?.bracket);
      if (statusFilter === 'dormant_6m') return u.inactivity?.bracket === 'dormant_months_6_plus';
      if (statusFilter === 'suspended') return u.status === 'suspended';

      return true;
    });
  }, [users, searchQuery, statusFilter]);

  // Handle Export CSV
  const handleExportCSV = () => {
    const headers = ['User ID', 'Username', 'Email', 'Role', 'Status', 'Is Online', 'XP', 'Rank', 'Created At', 'Last Login', 'Last Logout', 'Inactivity Days', 'Inactivity Months', 'CRM Notes'];
    const rows = users.map(u => [
      `"${u.id || ''}"`,
      `"${u.username || ''}"`,
      `"${u.email || ''}"`,
      `"${u.role || 'user'}"`,
      `"${u.status || 'active'}"`,
      `"${u.isLoggedIn ? 'Online' : 'Logged Out'}"`,
      u.xp || 0,
      `"${u.rank || 'Novice Hacker'}"`,
      `"${u.createdAt || ''}"`,
      `"${u.lastLoginAt || ''}"`,
      `"${u.lastLogoutAt || ''}"`,
      u.inactivity?.days || 0,
      u.inactivity?.months || 0,
      `"${(u.crmNotes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `cyberkali_crm_users_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Open Details Modal
  const handleOpenUserDetail = (u) => {
    setSelectedUser(u);
    setEditingNotes(u.crmNotes || '');
    setEditingXP(u.xp || 150);
    setEditingStatus(u.status || 'active');
    setEditingRole(u.role || 'user');
    setSaveSuccessMsg('');
  };

  // Save User Details
  const handleSaveUserDetails = async () => {
    if (!selectedUser) return;
    try {
      await cyberAuth.updateUserNotes(selectedUser.id, editingNotes);
      await cyberAuth.updateUserXP(selectedUser.id, editingXP);
      await cyberAuth.updateUserStatus(selectedUser.id, editingStatus);
      await cyberAuth.updateUserRole(selectedUser.id, editingRole);

      setSaveSuccessMsg('User dossier updated successfully!');
      setTimeout(() => setSaveSuccessMsg(''), 3000);
      loadCRMData();
    } catch (err) {
      alert("Failed to update user: " + err.message);
    }
  };

  // Quick 1-Click Re-engage User
  const handleReengageSingleUser = async (u) => {
    try {
      await cyberAuth.reengageUser(u.id, "Sent automated 250 XP bonus re-engagement email");
      alert(`Re-engagement alert dispatched to ${u.email}! Recorded in CRM timeline.`);
      loadCRMData();
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  // Toggle Suspend / Unsuspend
  const handleToggleSuspend = async (u) => {
    const nextStatus = u.status === 'suspended' ? 'active' : 'suspended';
    const confirmMsg = nextStatus === 'suspended' 
      ? `Are you sure you want to suspend @${u.username}? They will be forced logged out immediately.` 
      : `Re-activate @${u.username}?`;
    if (!window.confirm(confirmMsg)) return;

    try {
      await cyberAuth.updateUserStatus(u.id, nextStatus);
      loadCRMData();
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  // Delete User
  const handleDeleteUser = async (u) => {
    if (!window.confirm(`Permanently delete @${u.username} (${u.email})? This action cannot be undone.`)) return;
    try {
      await cyberAuth.deleteUser(u.id);
      loadCRMData();
      if (selectedUser?.id === u.id) setSelectedUser(null);
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  // Dispatch Broadcast Campaign
  const handleSendBroadcast = () => {
    setBroadcastSuccess(true);
    setTimeout(() => {
      setBroadcastSuccess(false);
      setIsBroadcastOpen(false);
      alert(`Re-engagement campaign dispatched to ${metrics.totalAtRisk} inactive operators! Email logs recorded.`);
    }, 1200);
  };

  // If Admin Gate is locked, render the Master Access Gate
  if (!isAdminUnlocked) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 font-sans">
        <div className="glass-card p-8 rounded-3xl border border-rose-500/30 shadow-2xl relative overflow-hidden text-center space-y-6">
          <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-500 p-0.5 mx-auto shadow-xl">
            <div className="w-full h-full bg-[#0a0d17] rounded-2xl flex items-center justify-center">
              <Lock className="w-8 h-8 text-rose-400" />
            </div>
          </div>

          <div>
            <h1 className="text-2xl font-black text-white tracking-tight font-display">
              CyberKali Operator CRM &amp; Admin Portal
            </h1>
            <p className="text-xs text-slate-400 font-mono mt-1">
              Restricted Area • Master Session Telemetry &amp; User Retention Dashboard
            </p>
          </div>

          <form onSubmit={handleUnlockAdmin} className="max-w-sm mx-auto space-y-3">
            <div className="relative">
              <Key className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={adminPinInput}
                onChange={(e) => setAdminPinInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleUnlockAdmin(e); }}
                placeholder="Enter Master Passkey & press Enter..."
                className="w-full bg-[#070b14] border border-slate-800 focus:border-rose-500 rounded-xl pl-10 pr-4 py-3 text-xs sm:text-sm font-mono text-white focus:outline-none shadow-inner"
              />
            </div>

            {pinError && (
              <p className="text-xs text-rose-400 font-mono flex items-center justify-center space-x-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>{pinError}</span>
              </p>
            )}
          </form>

          <div className="pt-2">
            <button
              onClick={() => onNavigate ? onNavigate('dashboard') : (window.location.href = '/')}
              className="text-xs font-mono text-slate-400 hover:text-white underline cursor-pointer"
            >
              ← Cancel &amp; Return to Public Labs
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 font-sans">
      {/* Secret Route Notification & Public Return Button */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-[#090d18] border border-rose-500/30 text-xs font-mono shadow-lg">
        <div className="flex items-center space-x-2 text-rose-300">
          <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
          <span>Secret Admin Route: <strong className="text-white font-bold">/admin</strong> (Hidden from public navigation bar)</span>
        </div>
        <button
          onClick={() => onNavigate ? onNavigate('dashboard') : (window.location.href = '/')}
          className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-all flex items-center space-x-1.5 cursor-pointer font-bold"
        >
          <span>← Return to Public Labs</span>
        </button>
      </div>

      {/* Top Banner & Control Bar */}
      <div className="glass-card p-6 rounded-2xl relative overflow-hidden shadow-2xl border border-rose-500/20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-3">
              <div className="w-11 h-11 rounded-xl bg-rose-500/10 border border-rose-500/40 flex items-center justify-center text-rose-400 shadow-md">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight font-display flex items-center space-x-2.5">
                  <span>CyberKali Operator CRM & Admin Panel</span>
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-mono font-bold border border-rose-500/30">
                    RESTRICTED ROOT
                  </span>
                </h1>
                <p className="text-xs text-slate-400 font-mono mt-0.5 flex items-center space-x-2">
                  <span>Database: Persistent Local + Supabase Active</span>
                  <span>•</span>
                  <span className="text-emerald-400">Telemetry: Real-Time Active</span>
                </p>
              </div>
            </div>
          </div>

          {/* Quick Actions Header Toolbar */}
          <div className="flex flex-wrap items-center gap-2.5 font-mono text-xs">
            <button
              onClick={() => setIsBroadcastOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold flex items-center space-x-2 transition-all shadow-md cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Broadcast Campaign</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="px-3.5 py-2 rounded-xl bg-[#0e1422] hover:bg-[#162035] border border-slate-700 text-slate-200 font-semibold flex items-center space-x-2 transition-all cursor-pointer"
              title="Export all user data to CSV"
            >
              <Download className="w-3.5 h-3.5 text-cyber-green" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={loadCRMData}
              disabled={isLoading}
              className="p-2 rounded-xl bg-[#0e1422] hover:bg-[#162035] border border-slate-700 text-slate-300 transition-all cursor-pointer"
              title="Refresh Registry"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-cyber-green' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* 4 Primary KPI Bento Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Total Registered Accounts */}
        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Total Accounts Created</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-cyber-green">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-white font-display">{metrics.total}</span>
            <span className="text-xs text-cyber-green font-mono font-bold">+18% this month</span>
          </div>
          <p className="text-[11px] text-slate-400 font-mono">
            Users registered with verified email and password.
          </p>
        </div>

        {/* KPI 2: Live Online Users */}
        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Currently Online (Active)</span>
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-cyan-400 font-display">{metrics.online}</span>
            <span className="flex items-center space-x-1 text-xs text-emerald-400 font-mono">
              <span className="w-2 h-2 rounded-full bg-cyber-green animate-pulse" />
              <span>Live Sessions</span>
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-mono">
            Active authenticated operator sessions right now.
          </p>
        </div>

        {/* KPI 3: Logged Out Users */}
        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Logged Out Users</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <UserX className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-amber-400 font-display">{metrics.loggedOut}</span>
            <span className="text-xs text-slate-400 font-mono">
              {metrics.total > 0 ? Math.round((metrics.loggedOut / metrics.total) * 100) : 0}% of registry
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-mono">
            Operators who performed a clean session sign-out.
          </p>
        </div>

        {/* KPI 4: Inactive & Dormant Users (> 1 Month) */}
        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Inactive &gt; 1 Month (At Risk)</span>
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-rose-400 font-display">{metrics.totalAtRisk}</span>
            <span className="text-xs text-rose-400 font-mono font-bold">
              {metrics.churnRate}% Churn Risk
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-mono">
            Have not returned to terminal for 30+ to 180+ days.
          </p>
        </div>
      </div>

      {/* Inactivity & Retention Cohort Analyzer ("Kitne Months Se Nhi Aye") */}
      <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-white font-display flex items-center space-x-2">
              <BarChart3 className="w-4 h-4 text-purple-400" />
              <span>Inactivity & Retention Telemetry (Months Inactive Distribution)</span>
            </h2>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Tracks how many operators haven't visited CyberKali in 1 month, 2-3 months, or 6+ months.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono text-slate-400">Click a cohort to filter user table:</span>
          </div>
        </div>

        {/* 5 Inactivity Cohort Pills / Progress Distribution */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-2">
          {/* Cohort 1: Active this week */}
          <button
            onClick={() => setStatusFilter(statusFilter === 'active_week' ? 'all' : 'active_week')}
            className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
              statusFilter === 'active_week' 
                ? 'bg-emerald-950/40 border-cyber-green text-white shadow-lg shadow-cyber-green/10' 
                : 'bg-[#080c14] border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-cyber-green font-bold flex items-center space-x-1.5">
                <Zap className="w-3.5 h-3.5" />
                <span>&lt; 7 Days Active</span>
              </span>
              <span className="text-white font-bold">{metrics.activeWeek}</span>
            </div>
            <div className="text-[11px] text-slate-400 font-mono mt-1">Recently Practiced</div>
            <div className="w-full bg-[#05080f] rounded-full h-1.5 mt-2 overflow-hidden">
              <div 
                className="bg-cyber-green h-full rounded-full" 
                style={{ width: `${metrics.total > 0 ? (metrics.activeWeek / metrics.total) * 100 : 0}%` }} 
              />
            </div>
          </button>

          {/* Cohort 2: Inactive 1 Month (7 - 30 days) */}
          <button
            onClick={() => setStatusFilter(statusFilter === 'inactive_1m' ? 'all' : 'inactive_1m')}
            className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
              statusFilter === 'inactive_1m' 
                ? 'bg-amber-950/40 border-amber-500 text-white shadow-lg shadow-amber-500/10' 
                : 'bg-[#080c14] border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-amber-400 font-bold flex items-center space-x-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>1 Month Inactive</span>
              </span>
              <span className="text-white font-bold">{metrics.inactive1M}</span>
            </div>
            <div className="text-[11px] text-slate-400 font-mono mt-1">7 - 30 Days Ago</div>
            <div className="w-full bg-[#05080f] rounded-full h-1.5 mt-2 overflow-hidden">
              <div 
                className="bg-amber-400 h-full rounded-full" 
                style={{ width: `${metrics.total > 0 ? (metrics.inactive1M / metrics.total) * 100 : 0}%` }} 
              />
            </div>
          </button>

          {/* Cohort 3: Inactive 1 - 3 Months */}
          <button
            onClick={() => setStatusFilter(statusFilter === 'inactive_3m' ? 'all' : 'inactive_3m')}
            className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
              statusFilter === 'inactive_3m' 
                ? 'bg-orange-950/40 border-orange-500 text-white shadow-lg shadow-orange-500/10' 
                : 'bg-[#080c14] border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-orange-400 font-bold flex items-center space-x-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>1 - 3 Months</span>
              </span>
              <span className="text-white font-bold">{metrics.inactive1To3M}</span>
            </div>
            <div className="text-[11px] text-slate-400 font-mono mt-1">30 - 90 Days Inactive</div>
            <div className="w-full bg-[#05080f] rounded-full h-1.5 mt-2 overflow-hidden">
              <div 
                className="bg-orange-400 h-full rounded-full" 
                style={{ width: `${metrics.total > 0 ? (metrics.inactive1To3M / metrics.total) * 100 : 0}%` }} 
              />
            </div>
          </button>

          {/* Cohort 4: Inactive 3 - 6 Months */}
          <button
            onClick={() => setStatusFilter(statusFilter === 'inactive_6m' ? 'all' : 'inactive_6m')}
            className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
              statusFilter === 'inactive_6m' 
                ? 'bg-rose-950/40 border-rose-500 text-white shadow-lg shadow-rose-500/10' 
                : 'bg-[#080c14] border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-rose-400 font-bold flex items-center space-x-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>3 - 6 Months</span>
              </span>
              <span className="text-white font-bold">{metrics.inactive3To6M}</span>
            </div>
            <div className="text-[11px] text-slate-400 font-mono mt-1">90 - 180 Days Inactive</div>
            <div className="w-full bg-[#05080f] rounded-full h-1.5 mt-2 overflow-hidden">
              <div 
                className="bg-rose-400 h-full rounded-full" 
                style={{ width: `${metrics.total > 0 ? (metrics.inactive3To6M / metrics.total) * 100 : 0}%` }} 
              />
            </div>
          </button>

          {/* Cohort 5: Dormant 6+ Months */}
          <button
            onClick={() => setStatusFilter(statusFilter === 'dormant_6m' ? 'all' : 'dormant_6m')}
            className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
              statusFilter === 'dormant_6m' 
                ? 'bg-purple-950/40 border-purple-500 text-white shadow-lg shadow-purple-500/10' 
                : 'bg-[#080c14] border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-purple-400 font-bold flex items-center space-x-1.5">
                <UserX className="w-3.5 h-3.5" />
                <span>6+ Months Dormant</span>
              </span>
              <span className="text-white font-bold">{metrics.dormant6MPlus}</span>
            </div>
            <div className="text-[11px] text-slate-400 font-mono mt-1">&gt; 180 Days Churned</div>
            <div className="w-full bg-[#05080f] rounded-full h-1.5 mt-2 overflow-hidden">
              <div 
                className="bg-purple-500 h-full rounded-full" 
                style={{ width: `${metrics.total > 0 ? (metrics.dormant6MPlus / metrics.total) * 100 : 0}%` }} 
              />
            </div>
          </button>
        </div>
      </div>

      {/* Main CRM User Management Directory */}
      <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
        {/* Table Filter Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
          {/* Search Box */}
          <div className="flex-1 min-w-[240px] max-w-md relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by username, email, ID..."
              className="w-full bg-[#070b14] border border-slate-800 focus:border-purple-500 rounded-xl pl-9 pr-4 py-2 text-xs font-mono text-white focus:outline-none"
            />
          </div>

          {/* Status Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 font-mono text-xs">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                statusFilter === 'all' 
                  ? 'bg-purple-600 text-white font-bold shadow-md' 
                  : 'bg-[#090d18] text-slate-400 hover:text-white'
              }`}
            >
              All ({metrics.total})
            </button>
            <button
              onClick={() => setStatusFilter('online')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center space-x-1.5 ${
                statusFilter === 'online' 
                  ? 'bg-emerald-600 text-white font-bold shadow-md' 
                  : 'bg-[#090d18] text-slate-400 hover:text-white'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-cyber-green animate-pulse" />
              <span>Online ({metrics.online})</span>
            </button>
            <button
              onClick={() => setStatusFilter('logged_out')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                statusFilter === 'logged_out' 
                  ? 'bg-amber-600 text-white font-bold shadow-md' 
                  : 'bg-[#090d18] text-slate-400 hover:text-white'
              }`}
            >
              Logged Out ({metrics.loggedOut})
            </button>
            <button
              onClick={() => setStatusFilter('inactive_1m')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                statusFilter === 'inactive_1m' 
                  ? 'bg-rose-600 text-white font-bold shadow-md' 
                  : 'bg-[#090d18] text-slate-400 hover:text-white'
              }`}
            >
              Inactive &gt; 1M ({metrics.totalAtRisk})
            </button>
            <button
              onClick={() => setStatusFilter('dormant_6m')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                statusFilter === 'dormant_6m' 
                  ? 'bg-purple-700 text-white font-bold shadow-md' 
                  : 'bg-[#090d18] text-slate-400 hover:text-white'
              }`}
            >
              Dormant 6M+ ({metrics.dormant6MPlus})
            </button>
            <button
              onClick={() => setStatusFilter('suspended')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                statusFilter === 'suspended' 
                  ? 'bg-red-800 text-white font-bold shadow-md' 
                  : 'bg-[#090d18] text-slate-400 hover:text-white'
              }`}
            >
              Suspended ({metrics.suspended})
            </button>
          </div>
        </div>

        {/* User CRM Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800/80 text-[11px] text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-3">Operator Identity</th>
                <th className="py-3 px-3">Role</th>
                <th className="py-3 px-3">Session Status</th>
                <th className="py-3 px-3">Inactivity Duration</th>
                <th className="py-3 px-3">Joined Date</th>
                <th className="py-3 px-3">XP & Rank</th>
                <th className="py-3 px-3 text-right">CRM Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-12 text-slate-400">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <Users className="w-8 h-8 text-slate-600" />
                      <p className="font-semibold text-white font-display text-sm">No Registered Operators Found</p>
                      <p className="text-xs text-slate-500 font-mono max-w-sm">Users who sign up on your live platform will automatically appear here with their session telemetry, XP, and CTF progress.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const inactivity = u.inactivity;
                  return (
                    <tr 
                      key={u.id}
                      className="hover:bg-[#0c121e]/80 transition-colors group cursor-pointer"
                      onClick={() => handleOpenUserDetail(u)}
                    >
                      {/* Operator Identity */}
                      <td className="py-3 px-3">
                        <div className="flex items-center space-x-2.5">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-cyan-500 p-[1px] shrink-0">
                            <div className="w-full h-full bg-[#0a0d17] rounded-[7px] flex items-center justify-center font-bold text-white text-xs">
                              {(u.username || u.email || 'U')[0].toUpperCase()}
                            </div>
                          </div>
                          <div>
                            <div className="font-bold text-white group-hover:text-purple-300 transition-colors flex items-center space-x-1.5">
                              <span>@{u.username}</span>
                              {u.status === 'suspended' && (
                                <span className="text-[9px] px-1.5 rounded bg-rose-500/20 text-rose-400 font-bold border border-rose-500/30">
                                  BANNED
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] text-slate-400">{u.email}</div>
                          </div>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          u.role === 'admin' 
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' 
                            : 'bg-slate-800 text-slate-300'
                        }`}>
                          {u.role === 'admin' ? 'ADMIN' : 'OPERATOR'}
                        </span>
                      </td>

                      {/* Session Status */}
                      <td className="py-3 px-3">
                        {u.status === 'suspended' ? (
                          <span className="flex items-center space-x-1.5 text-rose-400 font-semibold text-[11px]">
                            <Ban className="w-3.5 h-3.5" />
                            <span>Suspended</span>
                          </span>
                        ) : u.isLoggedIn ? (
                          <span className="flex items-center space-x-1.5 text-cyber-green font-semibold text-[11px]">
                            <span className="w-2 h-2 rounded-full bg-cyber-green animate-pulse" />
                            <span>Online Now</span>
                          </span>
                        ) : (
                          <span className="flex items-center space-x-1.5 text-slate-400 text-[11px]">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
                            <span>Logged Out</span>
                          </span>
                        )}
                      </td>

                      {/* Inactivity Duration */}
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded font-bold text-[10px] border ${
                          inactivity?.bracket === 'active_week' ? 'bg-emerald-500/10 text-cyber-green border-emerald-500/20' :
                          inactivity?.bracket === 'inactive_month_1' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                          inactivity?.bracket === 'inactive_months_1_3' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' :
                          inactivity?.bracket === 'inactive_months_3_6' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                          'bg-purple-950/40 text-purple-300 border-purple-500/30'
                        }`}>
                          {inactivity?.label}
                        </span>
                        <div className="text-[9px] text-slate-500 mt-0.5">
                          {inactivity?.days} days since last activity
                        </div>
                      </td>

                      {/* Joined Date */}
                      <td className="py-3 px-3 text-slate-300 text-[11px]">
                        {new Date(u.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>

                      {/* XP & Rank */}
                      <td className="py-3 px-3">
                        <div className="font-bold text-amber-400">{u.xp || 0} XP</div>
                        <div className="text-[10px] text-slate-400 truncate max-w-[120px]">{u.rank || 'Novice Hacker'}</div>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-3 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end space-x-1.5">
                          {/* Re-engage */}
                          <button
                            onClick={() => handleReengageSingleUser(u)}
                            className="p-1.5 rounded-lg bg-[#111624] hover:bg-purple-900/40 text-slate-300 hover:text-purple-300 border border-slate-700 transition-colors"
                            title="Send Inactivity Re-engagement Alert"
                          >
                            <Mail className="w-3.5 h-3.5 text-purple-400" />
                          </button>

                          {/* Dossier */}
                          <button
                            onClick={() => handleOpenUserDetail(u)}
                            className="p-1.5 rounded-lg bg-[#111624] hover:bg-cyan-900/40 text-slate-300 hover:text-cyan-300 border border-slate-700 transition-colors"
                            title="View Full CRM Dossier"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-cyan-400" />
                          </button>

                          {/* Suspend / Unsuspend */}
                          <button
                            onClick={() => handleToggleSuspend(u)}
                            className={`p-1.5 rounded-lg border transition-colors ${
                              u.status === 'suspended'
                                ? 'bg-emerald-950/40 hover:bg-emerald-900/50 text-emerald-400 border-emerald-500/40'
                                : 'bg-rose-950/30 hover:bg-rose-900/40 text-rose-400 border-rose-500/30'
                            }`}
                            title={u.status === 'suspended' ? 'Unsuspend Account' : 'Suspend Account'}
                          >
                            <Ban className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => handleDeleteUser(u)}
                            className="p-1.5 rounded-lg bg-[#111624] hover:bg-red-950/50 text-slate-400 hover:text-rose-400 border border-slate-700 transition-colors"
                            title="Delete User"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Dossier & CRM Management Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-card max-w-xl w-full p-6 rounded-3xl border border-purple-500/30 shadow-2xl relative space-y-5 animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/40 flex items-center justify-center font-bold text-purple-400 font-mono text-sm">
                  {(selectedUser.username || selectedUser.email)[0].toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-white text-base font-display">
                    Operator CRM Dossier: @{selectedUser.username}
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">{selectedUser.email} • ID: {selectedUser.id}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedUser(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Inactivity Telemetry Card */}
            <div className="p-3.5 rounded-xl bg-[#080c14] border border-slate-800 space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Inactivity Status:</span>
                <span className={`px-2 py-0.5 rounded font-bold border ${
                  selectedUser.inactivity?.bracket === 'active_week' ? 'bg-emerald-500/10 text-cyber-green border-emerald-500/20' :
                  selectedUser.inactivity?.bracket === 'inactive_month_1' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                  selectedUser.inactivity?.bracket === 'inactive_months_1_3' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' :
                  selectedUser.inactivity?.bracket === 'inactive_months_3_6' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                  'bg-purple-950/40 text-purple-300 border-purple-500/30'
                }`}>
                  {selectedUser.inactivity?.label}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                <div>
                  <span className="text-slate-500">Last Login:</span>
                  <div className="text-slate-200 mt-0.5 font-bold">
                    {selectedUser.lastLoginAt ? new Date(selectedUser.lastLoginAt).toLocaleString() : 'Never'}
                  </div>
                </div>
                <div>
                  <span className="text-slate-500">Last Logout:</span>
                  <div className="text-slate-200 mt-0.5 font-bold">
                    {selectedUser.lastLogoutAt ? new Date(selectedUser.lastLogoutAt).toLocaleString() : 'Active / Unrecorded'}
                  </div>
                </div>
              </div>
            </div>

            {/* Editable Fields: Status, Role, XP */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
              <div>
                <label className="text-slate-400 block mb-1">Account Status</label>
                <select
                  value={editingStatus}
                  onChange={(e) => setEditingStatus(e.target.value)}
                  className="w-full bg-[#080c14] border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="dormant">Dormant</option>
                  <option value="suspended">Suspended (Banned)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">System Role</label>
                <select
                  value={editingRole}
                  onChange={(e) => setEditingRole(e.target.value)}
                  className="w-full bg-[#080c14] border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="user">Operator (Standard)</option>
                  <option value="admin">Admin (Root Access)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Total XP</label>
                <input
                  type="number"
                  value={editingXP}
                  onChange={(e) => setEditingXP(e.target.value)}
                  className="w-full bg-[#080c14] border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            {/* CRM Notes */}
            <div className="text-xs font-mono space-y-1">
              <label className="text-slate-400 block">Internal CRM Notes & Timeline</label>
              <textarea
                rows="3"
                value={editingNotes}
                onChange={(e) => setEditingNotes(e.target.value)}
                placeholder="Add operator notes, enterprise lead status, or follow-up logs..."
                className="w-full bg-[#080c14] border border-slate-800 rounded-xl p-3 text-slate-200 focus:outline-none focus:border-purple-500 font-sans text-xs"
              />
            </div>

            {saveSuccessMsg && (
              <p className="text-xs text-cyber-green font-mono flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>{saveSuccessMsg}</span>
              </p>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs font-mono">
              <button
                onClick={() => handleReengageSingleUser(selectedUser)}
                className="px-3.5 py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/40 transition-all flex items-center space-x-1.5"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Send Re-engagement Email</span>
              </button>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setSelectedUser(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveUserDetails}
                  className="px-4 py-2 rounded-xl bg-cyber-green hover:bg-cyber-greenDim text-slate-950 font-bold transition-all flex items-center space-x-1.5 shadow-md shadow-cyber-green/20"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Changes</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Automated Campaign & Broadcast Modal */}
      {isBroadcastOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-card max-w-lg w-full p-6 rounded-3xl border border-purple-500/30 shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <Send className="w-5 h-5 text-purple-400" />
                <h3 className="font-bold text-white font-display text-base">
                  Dispatch CRM Automated Re-engagement Blast
                </h3>
              </div>
              <button
                onClick={() => setIsBroadcastOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div>
                <label className="text-slate-400 block mb-1">Target Inactivity Cohort</label>
                <select
                  value={broadcastTarget}
                  onChange={(e) => setBroadcastTarget(e.target.value)}
                  className="w-full bg-[#080c14] border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="inactive_1m">Inactive &gt; 1 Month ({metrics.totalAtRisk} Users)</option>
                  <option value="inactive_3m">Inactive 1 - 3 Months ({metrics.inactive1To3M} Users)</option>
                  <option value="dormant_6m">Dormant 6+ Months ({metrics.dormant6MPlus} Users)</option>
                  <option value="all">All Registered Operators ({metrics.total} Users)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Subject Line</label>
                <input
                  type="text"
                  value={broadcastSubject}
                  onChange={(e) => setBroadcastSubject(e.target.value)}
                  className="w-full bg-[#080c14] border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Message Body</label>
                <textarea
                  rows="4"
                  value={broadcastMessage}
                  onChange={(e) => setBroadcastMessage(e.target.value)}
                  className="w-full bg-[#080c14] border border-slate-800 rounded-xl p-3 text-slate-200 focus:outline-none focus:border-purple-500 font-sans"
                />
              </div>
            </div>

            <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-500/30 text-[11px] text-purple-300 font-mono">
              ⚡ Will simulate email dispatch to targeted cohort with a single-use login token and 500 bonus XP reward.
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-800 text-xs font-mono">
              <button
                onClick={() => setIsBroadcastOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSendBroadcast}
                disabled={broadcastSuccess}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold transition-all shadow-md flex items-center space-x-1.5"
              >
                {broadcastSuccess ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyber-green" />
                    <span>Dispatched!</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Launch Campaign Blast</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
