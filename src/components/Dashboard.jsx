import React, { useState } from 'react';
import { 
  Terminal, Shield, Award, Zap, Flame, Trophy, CheckCircle2, 
  ArrowUpRight, Play, Cpu, Lock, Sparkles, Activity, Clock, 
  ChevronRight, Compass, ShieldAlert, Laptop
} from 'lucide-react';

export function DashboardView({ user, totalXP, labs, onLaunchLab, onOpenAuth, onSendToTerminal }) {
  // If not logged in, show a high-energy Gen-Z preview teaser prompting them to sign in
  const isGuest = !user;
  const username = user?.username || user?.email?.split('@')[0] || 'Guest Operator';
  const email = user?.email || 'unregistered@sandbox.local';

  // Calculate statistics
  const totalTasks = labs.reduce((acc, l) => acc + l.tasks.length, 0);
  const completedTasks = labs.reduce((acc, l) => acc + l.tasks.filter(t => t.completed).length, 0);
  const completionRate = Math.round((completedTasks / totalTasks) * 100);

  // Ranks
  const getRankData = (xp) => {
    if (xp >= 500) return { title: "Red Team Elite", level: 4, nextXP: 1000, color: "from-rose-500 to-amber-500", border: "border-rose-500/40", text: "text-rose-400" };
    if (xp >= 300) return { title: "Security Specialist", level: 3, nextXP: 500, color: "from-amber-400 to-orange-500", border: "border-amber-500/40", text: "text-amber-400" };
    if (xp >= 200) return { title: "Junior Pentester", level: 2, nextXP: 300, color: "from-cyan-400 to-blue-500", border: "border-cyan-500/40", text: "text-cyan-400" };
    return { title: "Novice Hacker", level: 1, nextXP: 200, color: "from-cyber-green to-emerald-400", border: "border-cyber-green/40", text: "text-cyber-green" };
  };

  const rank = getRankData(totalXP);
  const progressToNext = Math.min(100, Math.round((totalXP / rank.nextXP) * 100));

  // GenZ Badges
  const BADGES = [
    { id: 'recon', title: 'Port Sweeper', desc: 'Ran first Nmap port discovery', icon: Terminal, unlocked: completedTasks >= 1, color: 'text-cyber-green border-cyber-green/30 bg-cyber-green/10' },
    { id: 'fuzz', title: 'Endpoint Ghost', desc: 'Discovered hidden paths with Gobuster', icon: Zap, unlocked: completedTasks >= 2, color: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10' },
    { id: 'flag', title: 'Flag Hunter', desc: 'Captured secret verification flag', icon: Trophy, unlocked: completedTasks >= 3, color: 'text-amber-400 border-amber-500/30 bg-amber-500/10' },
    { id: 'priv', title: 'Privilege Auditor', desc: 'Audited /etc/passwd and file permissions', icon: Lock, unlocked: completedTasks >= 4, color: 'text-purple-400 border-purple-500/30 bg-purple-500/10' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 font-sans space-y-6">
      {/* Top GenZ Banner: Bento Hero Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0c121e]/90 via-[#090e17]/80 to-[#05070c] border border-white/10 p-6 sm:p-8 backdrop-blur-2xl shadow-2xl">
        {/* Subtle Neon Radial Accents in background */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyber-green/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-wrap items-center justify-between gap-6">
          {/* User Profile Identity */}
          <div className="flex items-center space-x-4 sm:space-x-5">
            <div className="relative group">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-cyber-green via-cyan-400 to-purple-600 p-0.5 shadow-xl">
                <div className="w-full h-full bg-[#0a0d14] rounded-2xl flex items-center justify-center">
                  <span className="font-display font-extrabold text-2xl sm:text-3xl text-white">
                    {username[0].toUpperCase()}
                  </span>
                </div>
              </div>
              <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyber-green opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-cyber-green border-2 border-[#0a0d14]"></span>
              </span>
            </div>

            <div>
              <div className="flex items-center space-x-2.5">
                <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight font-display">
                  @{username}
                </h1>
                <span className={`text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${rank.border} ${rank.text} bg-black/40`}>
                  LVL {rank.level} • {rank.title}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-1 flex items-center space-x-2">
                <span>{email}</span>
                <span>•</span>
                <span className="text-emerald-400 font-medium">Session: Encrypted</span>
              </p>
            </div>
          </div>

          {/* Quick Action Pills */}
          <div className="flex flex-wrap items-center gap-2.5 font-mono text-xs">
            {isGuest ? (
              <button
                onClick={onOpenAuth}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyber-green to-emerald-400 text-slate-950 font-bold shadow-lg shadow-cyber-green/20 hover:scale-105 transition-all flex items-center space-x-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Sign In to Save Progress</span>
              </button>
            ) : (
              <div className="flex items-center space-x-2 bg-[#111622]/80 border border-slate-800 px-3.5 py-2 rounded-xl text-slate-300">
                <Activity className="w-4 h-4 text-cyber-green animate-pulse" />
                <span>Cloud Sync: <strong className="text-white">Active</strong></span>
              </div>
            )}

            <button
              onClick={() => onLaunchLab('lab-recon')}
              className="px-4 py-2 rounded-xl bg-[#111622] hover:bg-[#1a2333] border border-slate-700 text-white font-semibold flex items-center space-x-2 transition-all"
            >
              <Terminal className="w-4 h-4 text-cyber-green" />
              <span>Launch Terminal</span>
            </button>
          </div>
        </div>

        {/* Level XP Progression Bar inside Hero */}
        <div className="mt-8 pt-6 border-t border-white/10">
          <div className="flex flex-wrap justify-between items-center text-xs font-mono mb-2">
            <div className="flex items-center space-x-2">
              <span className="text-slate-400">Current Rank Progression:</span>
              <strong className="text-white font-bold">{totalXP} XP</strong>
              <span className="text-slate-500">/ {rank.nextXP} XP Target</span>
            </div>
            <span className="text-cyber-green font-bold">
              {progressToNext}% to Next Rank
            </span>
          </div>

          <div className="w-full bg-[#05070c] rounded-full h-3 p-0.5 border border-white/10 overflow-hidden">
            <div
              className={`h-full rounded-full bg-gradient-to-r ${rank.color} transition-all duration-700 shadow-md`}
              style={{ width: `${progressToNext}%` }}
            />
          </div>
        </div>
      </div>

      {/* Bento Grid: 4 Core Stat Tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Tile 1: Total XP */}
        <div className="group rounded-2xl bg-[#0a0e17]/80 border border-slate-800/90 p-5 hover:border-cyber-green/50 transition-all hover:shadow-[0_0_20px_rgba(0,255,136,0.1)] flex flex-col justify-between backdrop-blur-xl">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-mono uppercase tracking-wider font-semibold">Reputation XP</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-cyber-green border border-emerald-500/20">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-display">
              {totalXP}
            </div>
            <div className="text-[11px] text-cyber-green font-mono mt-1 flex items-center space-x-1">
              <span>+50 XP per solved lab task</span>
            </div>
          </div>
        </div>

        {/* Tile 2: Labs Completion */}
        <div className="group rounded-2xl bg-[#0a0e17]/80 border border-slate-800/90 p-5 hover:border-cyan-500/50 transition-all hover:shadow-[0_0_20px_rgba(0,229,255,0.1)] flex flex-col justify-between backdrop-blur-xl">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-mono uppercase tracking-wider font-semibold">Labs Mastered</span>
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-display">
              {completedTasks} / {totalTasks}
            </div>
            <div className="text-[11px] text-cyan-400 font-mono mt-1">
              {completionRate}% Total Syllabus Completed
            </div>
          </div>
        </div>

        {/* Tile 3: Daily Hack Streak */}
        <div className="group rounded-2xl bg-[#0a0e17]/80 border border-slate-800/90 p-5 hover:border-amber-500/50 transition-all hover:shadow-[0_0_20px_rgba(245,158,11,0.1)] flex flex-col justify-between backdrop-blur-xl">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-mono uppercase tracking-wider font-semibold">Hack Streak</span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-display flex items-center space-x-1.5">
              <span>4 Days</span>
              <span className="text-xs font-mono text-amber-400">🔥</span>
            </div>
            <div className="text-[11px] text-amber-400 font-mono mt-1">
              Top 10% consistent learner
            </div>
          </div>
        </div>

        {/* Tile 4: Command Accuracy */}
        <div className="group rounded-2xl bg-[#0a0e17]/80 border border-slate-800/90 p-5 hover:border-purple-500/50 transition-all hover:shadow-[0_0_20px_rgba(168,85,247,0.1)] flex flex-col justify-between backdrop-blur-xl">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-mono uppercase tracking-wider font-semibold">Terminal Speed</span>
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-display">
              98.2%
            </div>
            <div className="text-[11px] text-purple-400 font-mono mt-1">
              Clean syntax execution rate
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Left (Hands-On Labs Hub) + Right (Achievements & Live Telemetry) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): Practice Labs Hub */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-bold text-white font-display flex items-center space-x-2">
              <Terminal className="w-5 h-5 text-cyber-green" />
              <span>Assigned Practical Labs</span>
            </h2>
            <span className="text-xs font-mono text-slate-400">
              Live Target Range: <strong className="text-cyber-green">Active</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {labs.map(lab => {
              const isAllDone = lab.tasks.every(t => t.completed);
              const doneCount = lab.tasks.filter(t => t.completed).length;

              return (
                <div
                  key={lab.id}
                  className="rounded-2xl bg-[#0a0e17]/90 border border-slate-800/80 p-5 hover:border-slate-700 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 backdrop-blur-xl"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center space-x-2.5">
                      <span className="font-bold text-white text-sm sm:text-base font-display">
                        {lab.title}
                      </span>
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/30 text-blue-400">
                        {lab.level}
                      </span>
                      {isAllDone && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-cyber-green flex items-center space-x-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Pwned</span>
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed max-w-xl">
                      {lab.description}
                    </p>
                    <div className="text-[11px] font-mono text-slate-500 flex items-center space-x-3 pt-1">
                      <span>Target: <strong className="text-cyan-400">{lab.target}</strong></span>
                      <span>•</span>
                      <span>Progress: <strong className="text-cyber-green">{doneCount} / {lab.tasks.length} Tasks</strong></span>
                    </div>
                  </div>

                  <button
                    onClick={() => onLaunchLab(lab.id)}
                    className="shrink-0 w-full sm:w-auto px-4 py-2.5 rounded-xl bg-cyber-green/15 hover:bg-cyber-green/25 border border-cyber-green/40 text-cyber-green text-xs font-mono font-bold flex items-center justify-center space-x-2 transition-all"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>{isAllDone ? 'Review Room' : 'Resume Lab'}</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column (4 cols): GenZ Trophy Badges & Activity Telemetry */}
        <div className="lg:col-span-4 space-y-6">
          {/* Achievement Badges */}
          <div className="rounded-2xl bg-[#0a0e17]/90 border border-slate-800/80 p-5 backdrop-blur-xl shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <h3 className="font-bold text-white text-sm font-display flex items-center space-x-2">
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
                        ? 'bg-[#111726]/80 border-slate-700/80'
                        : 'bg-[#080c14]/40 border-slate-900 opacity-50'
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-lg border flex items-center justify-center shrink-0 ${badge.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-xs text-white flex items-center space-x-1.5">
                        <span>{badge.title}</span>
                        {badge.unlocked && <CheckCircle2 className="w-3 h-3 text-cyber-green" />}
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

          {/* Quick Terminal Telemetry Card */}
          <div className="rounded-2xl bg-[#0a0e17]/90 border border-slate-800/80 p-5 backdrop-blur-xl shadow-xl space-y-3">
            <h3 className="font-bold text-white text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center space-x-2">
              <Activity className="w-3.5 h-3.5 text-cyber-green" />
              <span>Real-Time Lab Telemetry</span>
            </h3>

            <div className="bg-[#05070c] rounded-xl p-3 border border-slate-900 font-mono text-[11px] space-y-1.5 text-slate-400">
              <div className="flex justify-between">
                <span>Docker Sandbox:</span>
                <span className="text-cyber-green">Allocated</span>
              </div>
              <div className="flex justify-between">
                <span>Kernel Subsystem:</span>
                <span className="text-slate-300">x86_64 Kali Rolling</span>
              </div>
              <div className="flex justify-between">
                <span>Target Gateway:</span>
                <span className="text-cyan-400">10.10.10.45</span>
              </div>
              <div className="flex justify-between">
                <span>Active Network:</span>
                <span className="text-emerald-400">Isolated VNET</span>
              </div>
            </div>

            <button
              onClick={() => onSendToTerminal('help')}
              className="w-full py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-mono font-medium transition-colors flex items-center justify-center space-x-1.5"
            >
              <span>Quick Help Command in Terminal</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
