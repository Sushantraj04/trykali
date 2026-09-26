import React from 'react';
import { 
  Terminal, Shield, Compass, Cpu, Award, Wrench, ShieldAlert, 
  LogIn, LogOut, LayoutDashboard, Users, Sparkles, Zap, Activity
} from 'lucide-react';

export function Header({ activeTab, setActiveTab, totalXP, user, onOpenAuth, onLogout }) {
  // Dynamic Rank Tier Calculation
  const getRank = (xp) => {
    if (xp >= 500) return { title: "Red Team Elite", level: 4, color: "text-rose-400 bg-rose-500/10 border-rose-500/40 shadow-rose-500/10" };
    if (xp >= 300) return { title: "Security Specialist", level: 3, color: "text-amber-400 bg-amber-500/10 border-amber-500/40 shadow-amber-500/10" };
    if (xp >= 200) return { title: "Junior Pentester", level: 2, color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/40 shadow-cyan-500/10" };
    return { title: "Novice Hacker", level: 1, color: "text-cyber-green bg-cyber-green/10 border-cyber-green/40 shadow-cyber-green/10" };
  };

  const rank = getRank(totalXP);

  // Navigation Items Definition with tailored aesthetic accents
  const NAV_ITEMS = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, color: 'text-cyber-green', activeBg: 'bg-emerald-500/15 text-cyber-green border-cyber-green/40 shadow-sm' },
    { id: 'terminal', label: 'Terminal & Labs', icon: Terminal, color: 'text-cyan-400', activeBg: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/40 shadow-sm' },
    { id: 'tools', label: 'Kali Tools', icon: Shield, color: 'text-blue-400', activeBg: 'bg-blue-500/15 text-blue-400 border-blue-500/40 shadow-sm' },
    { id: 'social', label: 'Social Attacks', icon: Users, color: 'text-purple-400', activeBg: 'bg-purple-500/20 text-purple-300 border-purple-500/50 shadow-purple-500/20' },
    { id: 'utilities', label: 'Wordlists', icon: Wrench, color: 'text-amber-400', activeBg: 'bg-amber-500/15 text-amber-400 border-amber-500/40 shadow-sm' },
    { id: 'roadmap', label: 'Roadmap', icon: Compass, color: 'text-rose-400', activeBg: 'bg-rose-500/15 text-rose-400 border-rose-500/40 shadow-sm' },
    { id: 'ai', label: 'AI Mentor', icon: Cpu, color: 'text-violet-300', activeBg: 'bg-violet-500/15 text-violet-300 border-violet-500/40 shadow-sm' },
  ];

  return (
    <header className="sticky top-0 z-50 px-3 sm:px-6 pt-2.5 pb-1">
      {/* Floating Island Glass Capsule */}
      <div className="max-w-7xl mx-auto rounded-2xl bg-[#060913]/85 backdrop-blur-2xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] transition-all">
        {/* Subtle Neon Top Edge Accent Line */}
        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-cyber-green/40 to-transparent rounded-t-2xl opacity-60" />

        <div className="px-3.5 sm:px-5 py-2 sm:py-2.5 flex items-center justify-between gap-3">
          {/* Logo & Brand Identity */}
          <div 
            className="flex items-center space-x-3 cursor-pointer select-none group" 
            onClick={() => setActiveTab('dashboard')}
          >
            {/* Holographic Border Ring */}
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyber-green via-cyan-400 to-purple-600 p-[1.5px] shadow-lg shadow-cyber-green/20 group-hover:shadow-cyber-green/40 transition-all duration-300 group-hover:scale-105">
                <div className="w-full h-full bg-[#070b14] rounded-[10px] flex items-center justify-center">
                  <Terminal className="w-5 h-5 text-cyber-green group-hover:scale-110 transition-transform duration-200" />
                </div>
              </div>
              {/* Online Ping Dot */}
              <span className="absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyber-green opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyber-green border-2 border-[#060913]"></span>
              </span>
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <span className="text-lg sm:text-xl font-extrabold tracking-tight font-display text-white">
                  CYBER<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-green via-emerald-300 to-teal-200">KALI</span>
                </span>
                <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-cyber-green font-mono font-bold tracking-wider hidden sm:inline-block">
                  PRO LABS
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono hidden md:block tracking-tight -mt-0.5">
                Next-Gen Cybersecurity Sandbox
              </p>
            </div>
          </div>

          {/* Center Segmented Island Navigation Bar */}
          <nav className="hidden lg:flex items-center bg-[#04060d]/70 p-1 rounded-xl border border-white/5 shadow-inner">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs transition-all duration-200 cursor-pointer active:scale-95 ${
                    isActive
                      ? `${item.activeBg} font-semibold shadow-sm`
                      : 'text-slate-400 hover:text-white hover:bg-white/5 font-medium'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? '' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action & Gamified Identity HUD */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Real-time Telemetry Latency Pill */}
            <div className="hidden 2xl:flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-black/40 border border-white/5 text-[10px] font-mono text-slate-400">
              <Zap className="w-3 h-3 text-cyber-green" />
              <span>&lt; 12ms Virtual</span>
            </div>

            {/* User Rank Title Pill */}
            <div className={`hidden sm:flex items-center space-x-1.5 px-3 py-1 rounded-xl border text-[11px] font-mono font-bold tracking-tight shadow-sm ${rank.color}`}>
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>{rank.title}</span>
            </div>

            {/* Gamified XP Pill with Golden Hologram Glow */}
            <div className="flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold shadow-sm shadow-amber-500/10">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>{totalXP} XP</span>
            </div>

            {/* User Profile Pill or High-Octane Gen-Z Sign In Button */}
            {user ? (
              <div className="flex items-center space-x-1.5 bg-[#090d18] pl-2 pr-1 py-1 rounded-xl border border-white/10 text-xs shadow-md">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className="flex items-center space-x-2 hover:opacity-80 transition-opacity cursor-pointer group"
                  title="Open Operator Dashboard"
                >
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-cyber-green to-cyan-400 p-[1px] group-hover:scale-105 transition-transform">
                    <div className="w-full h-full bg-[#0a0d17] rounded-[7px] flex items-center justify-center text-cyber-green font-mono font-extrabold text-[11px]">
                      {(user.username || user.email || 'O')[0].toUpperCase()}
                    </div>
                  </div>
                  <span className="text-slate-200 font-mono font-semibold hidden md:inline text-xs group-hover:text-cyber-green transition-colors">
                    @{user.username || user.email?.split('@')[0]}
                  </span>
                </button>
                <button
                  onClick={onLogout}
                  className="p-1 hover:bg-slate-800/80 rounded-lg text-slate-400 hover:text-rose-400 transition-colors ml-1 cursor-pointer"
                  title="Sign Out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyber-green via-emerald-400 to-teal-300 hover:from-cyber-greenDim hover:to-emerald-400 text-slate-950 font-extrabold text-xs transition-all shadow-lg shadow-cyber-green/20 hover:shadow-cyber-green/40 hover:scale-[1.02] active:scale-95 cursor-pointer font-mono"
              >
                <Sparkles className="w-3.5 h-3.5 text-slate-950" />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation Segmented Dock */}
        <div className="flex lg:hidden items-center justify-between px-2 py-1.5 border-t border-white/5 text-[11px] font-mono overflow-x-auto gap-1">
          {NAV_ITEMS.map((item) => {
            const isActive = activeTab === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-2 py-1 rounded-lg flex items-center space-x-1 shrink-0 transition-all ${
                  isActive 
                    ? `${item.activeBg} font-bold` 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Icon className="w-3 h-3" />
                <span className="text-[10px]">{item.label.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
