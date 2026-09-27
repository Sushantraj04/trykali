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

  // Modern Gen-Z Navigation Items with fine-tuned accents and badge indicators
  const NAV_ITEMS = [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: LayoutDashboard, 
      activeBg: 'bg-emerald-500/15 text-cyber-green border-cyber-green/40 shadow-[0_0_16px_rgba(0,255,136,0.18)]' 
    },
    { 
      id: 'terminal', 
      label: 'Terminal & Labs', 
      icon: Terminal, 
      activeBg: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/40 shadow-[0_0_16px_rgba(0,229,255,0.18)]' 
    },
    { 
      id: 'tools', 
      label: 'Kali Tools', 
      icon: Shield, 
      badge: '600+',
      activeBg: 'bg-blue-500/15 text-blue-400 border-blue-500/40 shadow-[0_0_16px_rgba(59,130,246,0.18)]' 
    },
    { 
      id: 'social', 
      label: 'Social Attacks', 
      icon: Users, 
      badge: 'HOT',
      activeBg: 'bg-purple-500/20 text-purple-300 border-purple-500/50 shadow-[0_0_18px_rgba(168,85,247,0.25)]' 
    },
    { 
      id: 'utilities', 
      label: 'Wordlists', 
      icon: Wrench, 
      activeBg: 'bg-amber-500/15 text-amber-300 border-amber-500/40 shadow-[0_0_16px_rgba(245,158,11,0.18)]' 
    },
    { 
      id: 'roadmap', 
      label: 'Roadmap', 
      icon: Compass, 
      activeBg: 'bg-rose-500/15 text-rose-300 border-rose-500/40 shadow-[0_0_16px_rgba(244,63,94,0.18)]' 
    },
    { 
      id: 'ai', 
      label: 'AI Mentor', 
      icon: Cpu, 
      badge: 'AI',
      activeBg: 'bg-violet-500/15 text-violet-300 border-violet-500/40 shadow-[0_0_16px_rgba(139,92,246,0.18)]' 
    },
  ];

  return (
    <header className="sticky top-0 z-50 px-3 sm:px-6 pt-3 pb-1">
      {/* Floating Island Glass Capsule */}
      <div className="max-w-7xl mx-auto rounded-2xl bg-[#060913]/90 backdrop-blur-2xl border border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.6)] transition-all">
        {/* Subtle Ambient Glowing Edge Accent */}
        <div className="h-[1.5px] w-full bg-gradient-to-r from-transparent via-cyber-green/50 to-transparent rounded-t-2xl opacity-75" />

        <div className="px-3.5 sm:px-5 py-2.5 flex items-center justify-between gap-3">
          {/* Logo & Brand Identity */}
          <div 
            className="flex items-center space-x-3 cursor-pointer select-none group" 
            onClick={() => setActiveTab('dashboard')}
          >
            {/* Holographic Border Ring */}
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyber-green via-cyan-400 to-purple-600 p-[1.5px] shadow-lg shadow-cyber-green/20 group-hover:shadow-cyber-green/45 transition-all duration-300 group-hover:scale-105">
                <div className="w-full h-full bg-[#070b14] rounded-[10px] flex items-center justify-center">
                  <Terminal className="w-5 h-5 text-cyber-green group-hover:scale-110 transition-transform duration-200" />
                </div>
              </div>
              {/* Online Pulse Ping Beacon */}
              <span className="absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyber-green opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyber-green border-2 border-[#060913]"></span>
              </span>
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <span className="text-lg sm:text-xl font-extrabold tracking-tight font-display text-white">
                  CYBER<span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyber-green to-cyan-300">KALI</span>
                </span>
                <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-cyber-green font-mono font-bold tracking-wider hidden sm:inline-block">
                  v2.5 // GEN-Z
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono hidden md:block tracking-tight -mt-0.5">
                Next-Gen Cyber Labs &amp; Pentest OS
              </p>
            </div>
          </div>

          {/* Center Segmented Island Navigation Bar with High-Contrast Glass Aesthetic */}
          <nav className="hidden lg:flex items-center bg-[#04060d]/80 p-1.5 rounded-2xl border border-white/5 shadow-inner gap-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-display font-semibold transition-all duration-200 cursor-pointer active:scale-95 border ${
                    isActive
                      ? `${item.activeBg}`
                      : 'text-slate-400 hover:text-white hover:bg-white/[0.06] border-transparent'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 transition-colors ${isActive ? '' : 'text-slate-500 group-hover:text-slate-300'}`} />
                  <span>{item.label}</span>
                  
                  {/* Micro Badge for special tabs */}
                  {item.badge && (
                    <span className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-full uppercase tracking-tighter ${
                      item.badge === 'HOT' 
                        ? 'bg-purple-500/25 text-purple-300 border border-purple-500/40' 
                        : (item.badge === 'AI' 
                            ? 'bg-violet-500/25 text-violet-300 border border-violet-500/40' 
                            : 'bg-blue-500/20 text-blue-300 border border-blue-500/30')
                    }`}>
                      {item.badge}
                    </span>
                  )}

                  {/* Active Indicator Micro-dot */}
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-current shadow-[0_0_8px_currentColor] ml-0.5" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action & Gamified Identity HUD */}
          <div className="flex items-center space-x-2 sm:space-x-2.5">
            {/* Real-time Telemetry Latency Pill */}
            <div className="hidden 2xl:flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-black/40 border border-white/5 text-[10px] font-mono text-slate-300">
              <Zap className="w-3.5 h-3.5 text-cyber-green animate-pulse" />
              <span>&lt; 10ms VNET</span>
            </div>

            {/* User Rank Title Pill */}
            <div className={`hidden sm:flex items-center space-x-1.5 px-3 py-1 rounded-xl border text-[11px] font-mono font-bold tracking-tight shadow-sm ${rank.color}`}>
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>{rank.title}</span>
            </div>

            {/* Gamified XP Pill with Golden Hologram Glow */}
            <div className="flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-amber-500/15 border border-amber-500/35 text-amber-300 text-xs font-mono font-bold shadow-[0_0_12px_rgba(245,158,11,0.15)]">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>{totalXP} XP</span>
            </div>

            {/* User Profile Pill or High-Voltage Gen-Z Sign In Button */}
            {user ? (
              <div className="flex items-center space-x-1.5 bg-[#090d18] pl-2 pr-1.5 py-1 rounded-xl border border-white/10 text-xs shadow-md">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className="flex items-center space-x-2 hover:opacity-90 transition-opacity cursor-pointer group"
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
                className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyber-green via-emerald-400 to-teal-300 hover:from-cyber-greenDim hover:to-emerald-400 text-slate-950 font-extrabold text-xs transition-all shadow-lg shadow-cyber-green/25 hover:shadow-cyber-green/45 hover:scale-[1.03] active:scale-95 cursor-pointer font-display tracking-tight"
              >
                <Sparkles className="w-3.5 h-3.5 text-slate-950 fill-current" />
                <span>Connect ID</span>
              </button>
            )}

            {/* Secret Route Exit Button: strictly rendered only when on /admin route */}
            {activeTab === 'admin' && (
              <button
                onClick={() => setActiveTab('dashboard')}
                className="px-2.5 py-1 rounded-xl bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 border border-rose-500/40 text-xs font-mono font-bold transition-all cursor-pointer flex items-center space-x-1"
                title="Exit Admin and return to Public Labs"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                <span className="hidden sm:inline">Exit Admin (/admin)</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation Segmented Dock */}
        <div className="flex lg:hidden items-center justify-between px-2.5 py-2 border-t border-white/5 text-[11px] font-mono overflow-x-auto gap-1.5">
          {NAV_ITEMS.map((item) => {
            const isActive = activeTab === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-2.5 py-1.5 rounded-xl flex items-center space-x-1 shrink-0 transition-all font-display text-xs border ${
                  isActive 
                    ? `${item.activeBg} font-bold` 
                    : 'text-slate-400 hover:text-white border-transparent'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label.split(' ')[0]}</span>
                {item.badge && (
                  <span className="text-[8px] px-1 rounded-full bg-white/10 font-mono">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
