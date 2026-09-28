import React, { useState } from 'react';
import { 
  Terminal, Shield, Award, Zap, Flame, Trophy, CheckCircle2, 
  ArrowUpRight, Play, Cpu, Lock, Sparkles, Activity, Clock, 
  ChevronRight, Compass, ShieldAlert, Laptop, Users, Wrench,
  Search, ExternalLink, Hash, Check
} from 'lucide-react';

export function DashboardView({ 
  user, 
  totalXP, 
  labs, 
  onLaunchLab, 
  onOpenAuth, 
  onSendToTerminal, 
  setActiveTab 
}) {
  const isGuest = !user;
  const username = user?.username || user?.email?.split('@')[0] || 'Guest_Operator';
  const email = user?.email || 'unregistered@sandbox.vnet';

  // Lab category filter state
  const [labFilter, setLabFilter] = useState('all');

  // Calculate statistics
  const totalTasks = labs.reduce((acc, l) => acc + l.tasks.length, 0);
  const completedTasks = labs.reduce((acc, l) => acc + l.tasks.filter(t => t.completed).length, 0);
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Rank Tiers & XP Calculation
  const getRankData = (xp) => {
    if (xp >= 500) return { title: "Red Team Elite", level: 4, nextXP: 1000, color: "from-rose-500 via-pink-500 to-amber-500", border: "border-rose-500/40", text: "text-rose-400", glow: "shadow-rose-500/20" };
    if (xp >= 300) return { title: "Security Specialist", level: 3, nextXP: 500, color: "from-amber-400 via-orange-500 to-yellow-500", border: "border-amber-500/40", text: "text-amber-400", glow: "shadow-amber-500/20" };
    if (xp >= 200) return { title: "Junior Pentester", level: 2, nextXP: 300, color: "from-cyan-400 via-teal-400 to-blue-500", border: "border-cyan-500/40", text: "text-cyan-400", glow: "shadow-cyan-500/20" };
    return { title: "Novice Hacker", level: 1, nextXP: 200, color: "from-cyber-green via-emerald-400 to-teal-300", border: "border-cyber-green/40", text: "text-cyber-green", glow: "shadow-cyber-green/20" };
  };

  const rank = getRankData(totalXP);
  const progressToNext = Math.min(100, Math.round((totalXP / rank.nextXP) * 100));

  // Gen-Z Quick Jump Modules inside Dashboard
  const DASHBOARD_QUICK_NAV = [
    { 
      id: 'terminal', 
      title: 'Interactive Labs', 
      desc: 'Bash terminal & live CTF challenges', 
      icon: Terminal, 
      accent: 'text-cyan-400 border-cyan-500/30 hover:border-cyan-400/70 hover:bg-cyan-500/10 hover:shadow-cyan-500/15',
      badge: 'Live Sandbox'
    },
    { 
      id: 'social', 
      title: 'Social Attacks', 
      desc: 'AnonyIG, tracking & phishing OSINT', 
      icon: Users, 
      accent: 'text-purple-400 border-purple-500/30 hover:border-purple-400/70 hover:bg-purple-500/10 hover:shadow-purple-500/15',
      badge: 'NEW // HOT'
    },
    { 
      id: 'tools', 
      title: '600+ Kali Tools', 
      desc: 'Nmap, Metasploit, Wireshark & more', 
      icon: Shield, 
      accent: 'text-blue-400 border-blue-500/30 hover:border-blue-400/70 hover:bg-blue-500/10 hover:shadow-blue-500/15',
      badge: 'Arsenal'
    },
    { 
      id: 'utilities', 
      title: 'Wordlist Vault', 
      desc: 'RockYou, Dirbuster & password tools', 
      icon: Wrench, 
      accent: 'text-amber-400 border-amber-500/30 hover:border-amber-400/70 hover:bg-amber-500/10 hover:shadow-amber-500/15',
      badge: 'Payloads'
    },
    { 
      id: 'roadmap', 
      title: 'Career Roadmap', 
      desc: 'OSCP, CEH & CompTIA career paths', 
      icon: Compass, 
      accent: 'text-rose-400 border-rose-500/30 hover:border-rose-400/70 hover:bg-rose-500/10 hover:shadow-rose-500/15',
      badge: 'Guide'
    },
    { 
      id: 'ai', 
      title: 'AI Cyber Mentor', 
      desc: 'Instant exploit guidance & command tips', 
      icon: Cpu, 
      accent: 'text-violet-400 border-violet-500/30 hover:border-violet-400/70 hover:bg-violet-500/10 hover:shadow-violet-500/15',
      badge: 'AI Copilot'
    },
  ];

  // Operator Badges
  const BADGES = [
    { id: 'recon', title: 'Port Sweeper', desc: 'Executed Nmap port discovery', icon: Terminal, unlocked: completedTasks >= 1, color: 'text-cyber-green border-cyber-green/30 bg-cyber-green/10' },
    { id: 'fuzz', title: 'Endpoint Ghost', desc: 'Discovered hidden paths with Gobuster', icon: Zap, unlocked: completedTasks >= 2, color: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10' },
    { id: 'flag', title: 'Flag Hunter', desc: 'Captured secret verification flag', icon: Trophy, unlocked: completedTasks >= 3, color: 'text-amber-400 border-amber-500/30 bg-amber-500/10' },
    { id: 'priv', title: 'Privilege Auditor', desc: 'Audited /etc/passwd and root privileges', icon: Lock, unlocked: completedTasks >= 4, color: 'text-purple-400 border-purple-500/30 bg-purple-500/10' }
  ];

  // Quick Command Chips to inject directly into terminal
  const QUICK_COMMANDS = [
    { label: 'nmap -sV 10.10.10.45', desc: 'Port Scan target' },
    { label: 'gobuster dir -u http://10.10.10.45 -w common.txt', desc: 'Web directory discovery' },
    { label: 'cat /etc/passwd', desc: 'Inspect user accounts' },
    { label: 'whoami', desc: 'Check current privileges' },
    { label: 'help', desc: 'List all commands' }
  ];

  // Filtered labs
  const filteredLabs = labs.filter(lab => {
    if (labFilter === 'all') return true;
    if (labFilter === 'recon') return lab.id.includes('recon');
    if (labFilter === 'web') return lab.id.includes('web') || lab.title.toLowerCase().includes('web');
    if (labFilter === 'priv') return lab.id.includes('priv') || lab.title.toLowerCase().includes('privilege');
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8 font-sans">
      {/* 1. TOP BENTO HERO CARD: Operator Identity & Level Passport */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0c121e]/95 via-[#080d17]/90 to-[#04060c] border border-white/10 p-6 sm:p-8 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
        {/* Subtle Neon Radial Accents in background */}
        <div className="absolute top-0 right-0 w-[28rem] h-[28rem] bg-cyber-green/10 rounded-full blur-[100px] pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 flex flex-wrap items-center justify-between gap-6">
          {/* User Profile Identity Section */}
          <div className="flex items-center space-x-4 sm:space-x-5">
            <div className="relative group">
              {/* Iridescent Holographic Border */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-cyber-green via-cyan-400 to-purple-600 p-[2px] shadow-xl group-hover:scale-105 transition-transform duration-300">
                <div className="w-full h-full bg-[#0a0d14] rounded-[14px] flex items-center justify-center">
                  <span className="font-display font-extrabold text-2xl sm:text-3xl text-white">
                    {username[0].toUpperCase()}
                  </span>
                </div>
              </div>
              {/* Online Ping Beacon */}
              <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyber-green opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-cyber-green border-2 border-[#0a0d14]"></span>
              </span>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-display">
                  @{username}
                </h1>
                <span className={`text-[11px] font-mono font-bold px-3 py-0.5 rounded-full border ${rank.border} ${rank.text} bg-black/50 shadow-sm`}>
                  LVL {rank.level} • {rank.title}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-cyber-green border border-emerald-500/30 hidden sm:inline-block">
                  VERIFIED WHITEHAT
                </span>
              </div>
              
              <div className="text-xs text-slate-400 font-mono mt-1.5 flex flex-wrap items-center gap-2 sm:gap-3">
                <span className="text-slate-300">{email}</span>
                <span className="text-slate-600">•</span>
                <span className="text-emerald-400 font-medium flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
                  <span>Session: Encrypted VNET</span>
                </span>
                <span className="text-slate-600 hidden sm:inline">•</span>
                <span className="text-slate-400 hidden sm:inline">Target IP: 10.10.10.45</span>
              </div>
            </div>
          </div>

          {/* Quick Gen-Z Action Controls */}
          <div className="flex flex-wrap items-center gap-2.5 font-display text-xs">
            {isGuest ? (
              <button
                onClick={onOpenAuth}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyber-green via-emerald-400 to-teal-300 text-slate-950 font-extrabold shadow-lg shadow-cyber-green/20 hover:shadow-cyber-green/40 hover:scale-105 active:scale-95 transition-all flex items-center space-x-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 fill-current text-slate-950" />
                <span>Connect ID to Save XP</span>
              </button>
            ) : (
              <div className="flex items-center space-x-2 bg-[#111622]/90 border border-slate-800 px-3.5 py-2 rounded-xl text-slate-300 font-mono text-xs shadow-inner">
                <Activity className="w-4 h-4 text-cyber-green animate-pulse" />
                <span>Cloud Sync: <strong className="text-white">Active</strong></span>
              </div>
            )}

            <button
              onClick={() => onLaunchLab('lab-recon')}
              className="px-4 py-2.5 rounded-xl bg-[#111726] hover:bg-[#1a2338] border border-cyan-500/40 text-cyan-300 font-bold flex items-center space-x-2 transition-all hover:scale-105 active:scale-95 shadow-md shadow-cyan-500/10 cursor-pointer"
            >
              <Terminal className="w-4 h-4 text-cyan-400" />
              <span>Launch Lab Terminal</span>
            </button>
          </div>
        </div>

        {/* Level XP Progression Bar with Milestones */}
        <div className="mt-8 pt-6 border-t border-white/10">
          <div className="flex flex-wrap justify-between items-center text-xs font-mono mb-2.5">
            <div className="flex items-center space-x-2">
              <span className="text-slate-400 font-medium">Rank Progression:</span>
              <strong className="text-white font-bold">{totalXP} XP</strong>
              <span className="text-slate-500">/ {rank.nextXP} XP Target</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-slate-400">Next Tier:</span>
              <span className={`font-bold ${rank.text}`}>
                {progressToNext}% Complete
              </span>
            </div>
          </div>

          <div className="relative w-full bg-[#05070c] rounded-full h-3.5 p-0.5 border border-white/10 overflow-hidden shadow-inner">
            <div
              className={`h-full rounded-full bg-gradient-to-r ${rank.color} transition-all duration-700 shadow-md`}
              style={{ width: `${progressToNext}%` }}
            />
          </div>

          {/* Micro Milestone Markers */}
          <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 mt-2 px-1">
            <span>0 XP (Novice)</span>
            <span>200 XP (Junior)</span>
            <span>300 XP (Specialist)</span>
            <span>500+ XP (Elite)</span>
          </div>
        </div>
      </div>

      {/* 2. GEN-Z QUICK NAVIGATION HUB: Jump into any module with 1 Click */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-cyber-green animate-pulse" />
            <h2 className="text-base sm:text-lg font-extrabold text-white font-display tracking-tight">
              Explore TryKali Ecosystem
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-400">
            Click to navigate directly
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {DASHBOARD_QUICK_NAV.map((mod) => {
            const Icon = mod.icon;
            return (
              <button
                key={mod.id}
                onClick={() => setActiveTab && setActiveTab(mod.id)}
                className={`p-3.5 rounded-2xl bg-[#090d16]/80 backdrop-blur-xl border transition-all text-left group flex flex-col justify-between cursor-pointer hover:scale-[1.02] active:scale-95 shadow-lg ${mod.accent}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 rounded-xl bg-white/5 group-hover:bg-white/10 transition-colors">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-300">
                    {mod.badge}
                  </span>
                </div>
                <div>
                  <h3 className="text-xs font-extrabold text-white font-display group-hover:text-white flex items-center justify-between">
                    <span>{mod.title}</span>
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </h3>
                  <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">
                    {mod.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. BENTO STAT GRID: 4 High-Octane Performance Tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Tile 1: Total XP */}
        <div className="group rounded-2xl bg-[#090e18]/85 border border-slate-800/90 p-5 hover:border-cyber-green/50 transition-all hover:shadow-[0_0_25px_rgba(0,255,136,0.12)] flex flex-col justify-between backdrop-blur-xl">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-mono uppercase tracking-wider font-semibold">Reputation XP</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-cyber-green border border-emerald-500/20 group-hover:scale-110 transition-transform">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-white font-display tracking-tight">
              {totalXP}
            </div>
            <div className="text-[11px] text-cyber-green font-mono mt-1 flex items-center space-x-1">
              <span>+50 XP per solved lab objective</span>
            </div>
          </div>
        </div>

        {/* Tile 2: Labs Mastered */}
        <div className="group rounded-2xl bg-[#090e18]/85 border border-slate-800/90 p-5 hover:border-cyan-500/50 transition-all hover:shadow-[0_0_25px_rgba(0,229,255,0.12)] flex flex-col justify-between backdrop-blur-xl">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-mono uppercase tracking-wider font-semibold">Labs Mastered</span>
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 group-hover:scale-110 transition-transform">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-white font-display tracking-tight">
              {completedTasks} <span className="text-lg text-slate-500 font-normal">/ {totalTasks}</span>
            </div>
            <div className="text-[11px] text-cyan-400 font-mono mt-1">
              {completionRate}% Syllabus Objectives Solved
            </div>
          </div>
        </div>

        {/* Tile 3: Daily Hack Streak */}
        <div className="group rounded-2xl bg-[#090e18]/85 border border-slate-800/90 p-5 hover:border-amber-500/50 transition-all hover:shadow-[0_0_25px_rgba(245,158,11,0.12)] flex flex-col justify-between backdrop-blur-xl">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-mono uppercase tracking-wider font-semibold">Hack Streak</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 group-hover:scale-110 transition-transform">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-white font-display tracking-tight flex items-center space-x-2">
              <span>5 Days</span>
              <span className="text-base text-amber-400">🔥</span>
            </div>
            <div className="text-[11px] text-amber-400 font-mono mt-1">
              Top 5% consistent pentester
            </div>
          </div>
        </div>

        {/* Tile 4: Command Accuracy */}
        <div className="group rounded-2xl bg-[#090e18]/85 border border-slate-800/90 p-5 hover:border-purple-500/50 transition-all hover:shadow-[0_0_25px_rgba(168,85,247,0.12)] flex flex-col justify-between backdrop-blur-xl">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-mono uppercase tracking-wider font-semibold">Terminal Accuracy</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 group-hover:scale-110 transition-transform">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-white font-display tracking-tight">
              99.1%
            </div>
            <div className="text-[11px] text-purple-400 font-mono mt-1">
              Clean Kali syntax execution
            </div>
          </div>
        </div>
      </div>

      {/* 4. MAIN SPLIT: Left (Assigned Practice Labs) + Right (Badges & Telemetry) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        {/* Left Column (8 cols): Practice Labs Hub with Category Navigation */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-base sm:text-lg font-extrabold text-white font-display flex items-center space-x-2">
              <Terminal className="w-5 h-5 text-cyber-green" />
              <span>Assigned Practical Labs</span>
            </h2>

            {/* Filter Navigation Pills */}
            <div className="flex items-center bg-[#070b13] p-1 rounded-xl border border-white/5 text-xs font-mono">
              {[
                { id: 'all', label: 'All Labs' },
                { id: 'recon', label: 'Recon' },
                { id: 'web', label: 'Web Exploit' },
                { id: 'priv', label: 'Privilege' },
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setLabFilter(f.id)}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                    labFilter === f.id
                      ? 'bg-cyber-green/15 text-cyber-green font-bold shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {filteredLabs.map(lab => {
              const isAllDone = lab.tasks.every(t => t.completed);
              const doneCount = lab.tasks.filter(t => t.completed).length;

              return (
                <div
                  key={lab.id}
                  className="rounded-2xl bg-[#090d16]/90 border border-slate-800/80 p-5 hover:border-slate-700 hover:shadow-xl transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 backdrop-blur-xl group"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-extrabold text-white text-base font-display group-hover:text-cyber-green transition-colors">
                        {lab.title}
                      </span>
                      <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 font-bold">
                        {lab.level}
                      </span>
                      {isAllDone && (
                        <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-cyber-green flex items-center space-x-1 font-bold">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Pwned</span>
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed max-w-xl">
                      {lab.description}
                    </p>
                    <div className="text-[11px] font-mono text-slate-400 flex flex-wrap items-center gap-3 pt-1">
                      <span>Target: <strong className="text-cyan-400 font-semibold">{lab.target}</strong></span>
                      <span>•</span>
                      <span>Progress: <strong className="text-cyber-green font-semibold">{doneCount} / {lab.tasks.length} Solved</strong></span>
                      <span>•</span>
                      <span className="text-slate-500">Estimated: 15 mins</span>
                    </div>
                  </div>

                  <button
                    onClick={() => onLaunchLab(lab.id)}
                    className="shrink-0 w-full sm:w-auto px-4 py-2.5 rounded-xl bg-cyber-green/15 hover:bg-cyber-green/25 border border-cyber-green/40 text-cyber-green text-xs font-display font-bold flex items-center justify-center space-x-2 transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-md shadow-cyber-green/10"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>{isAllDone ? 'Review Room' : 'Resume Lab'}</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column (4 cols): Gen-Z Trophies & Live Telemetry HUD */}
        <div className="lg:col-span-4 space-y-6">
          {/* Operator Badges Showcase */}
          <div className="rounded-2xl bg-[#090d16]/90 border border-slate-800/80 p-5 backdrop-blur-xl shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <h3 className="font-extrabold text-white text-sm font-display flex items-center space-x-2">
                <Trophy className="w-4 h-4 text-amber-400" />
                <span>Operator Badges</span>
              </h3>
              <span className="text-[11px] font-mono text-slate-400">
                {BADGES.filter(b => b.unlocked).length} / {BADGES.length} Unlocked
              </span>
            </div>

            <div className="space-y-3">
              {BADGES.map(badge => {
                const Icon = badge.icon;
                return (
                  <div
                    key={badge.id}
                    className={`p-3 rounded-xl border flex items-center space-x-3 transition-all ${
                      badge.unlocked
                        ? 'bg-[#111726]/80 border-slate-700/80 shadow-sm'
                        : 'bg-[#080c14]/40 border-slate-900 opacity-60'
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 ${badge.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-xs text-white flex items-center space-x-1.5 font-display">
                        <span>{badge.title}</span>
                        {badge.unlocked ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-cyber-green" />
                        ) : (
                          <Lock className="w-3 h-3 text-slate-500" />
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5 leading-tight">
                        {badge.desc}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Command Launcher (Direct Terminal Execution) */}
          <div className="rounded-2xl bg-[#090d16]/90 border border-slate-800/80 p-5 backdrop-blur-xl shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-white text-xs font-mono uppercase tracking-wider text-slate-300 flex items-center space-x-2">
                <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                <span>1-Click Terminal Chips</span>
              </h3>
              <span className="text-[10px] font-mono text-slate-500">Tap to run</span>
            </div>

            <div className="space-y-2">
              {QUICK_COMMANDS.map((cmd, idx) => (
                <button
                  key={idx}
                  onClick={() => onSendToTerminal(cmd.label.split(' ')[0])}
                  className="w-full text-left p-2.5 rounded-xl bg-[#060911] hover:bg-[#0c1220] border border-slate-800/80 hover:border-cyber-green/40 transition-all flex items-center justify-between group cursor-pointer"
                >
                  <div>
                    <div className="font-mono text-xs text-cyber-green group-hover:text-emerald-300 font-semibold flex items-center space-x-1.5">
                      <span className="text-slate-600">$</span>
                      <span>{cmd.label}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      {cmd.desc}
                    </div>
                  </div>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-cyber-green transition-colors shrink-0" />
                </button>
              ))}
            </div>
          </div>

          {/* Sandbox Telemetry Card */}
          <div className="rounded-2xl bg-[#090d16]/90 border border-slate-800/80 p-5 backdrop-blur-xl shadow-xl space-y-3">
            <h3 className="font-extrabold text-white text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center space-x-2">
              <Activity className="w-3.5 h-3.5 text-cyber-green" />
              <span>Real-Time Sandbox Telemetry</span>
            </h3>

            <div className="bg-[#05070c] rounded-xl p-3 border border-slate-900 font-mono text-[11px] space-y-2 text-slate-400">
              <div className="flex justify-between">
                <span>Kernel Subsystem:</span>
                <span className="text-slate-200">Kali Rolling 6.12-amd64</span>
              </div>
              <div className="flex justify-between">
                <span>Target Gateway:</span>
                <span className="text-cyan-400 font-bold">10.10.10.45</span>
              </div>
              <div className="flex justify-between">
                <span>Virtual Subnet:</span>
                <span className="text-emerald-400">10.10.10.0/24 Isolated</span>
              </div>
              <div className="flex justify-between">
                <span>Allocated Memory:</span>
                <span className="text-slate-200">2048 MB / Container</span>
              </div>
            </div>

            <button
              onClick={() => onSendToTerminal('help')}
              className="w-full py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-display font-semibold transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              <span>Launch Quick Help in Terminal</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
