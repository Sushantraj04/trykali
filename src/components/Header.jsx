import React from 'react';
import { 
  Terminal, Shield, Compass, Cpu, Award, Wrench, ShieldAlert, 
  LogOut, LayoutDashboard, Users, Sparkles
} from 'lucide-react';

export function Header({ activeTab, setActiveTab, totalXP, user, onOpenAuth, onLogout }) {
  // Dynamic Rank Tier Calculation
  const getRank = (xp) => {
    if (xp >= 500) {
      return { 
        title: "Red Team Elite", 
        level: 4, 
        badgeBg: "bg-rose-500/15 text-rose-300 border-rose-500/40 shadow-rose-500/10" 
      };
    }
    if (xp >= 300) {
      return { 
        title: "Security Specialist", 
        level: 3, 
        badgeBg: "bg-amber-500/15 text-amber-300 border-amber-500/40 shadow-amber-500/10" 
      };
    }
    if (xp >= 200) {
      return { 
        title: "Junior Pentester", 
        level: 2, 
        badgeBg: "bg-cyan-500/15 text-cyan-300 border-cyan-500/40 shadow-cyan-500/10" 
      };
    }
    return { 
      title: "Novice Hacker", 
      level: 1, 
      badgeBg: "bg-cyber-green/15 text-cyber-green border-cyber-green/40 shadow-cyber-green/10" 
    };
  };

  const rank = getRank(totalXP);

  // Modern, clean, professional Navigation Items
  const NAV_ITEMS = [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: LayoutDashboard,
      activeColor: 'text-cyber-green bg-cyber-green/10 border-cyber-green/30 shadow-[0_0_12px_rgba(0,255,136,0.12)]'
    },
    { 
      id: 'terminal', 
      label: 'Terminal & Labs', 
      icon: Terminal,
      activeColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30 shadow-[0_0_12px_rgba(0,229,255,0.12)]'
    },
    { 
      id: 'tools', 
      label: 'Kali Tools', 
      icon: Shield,
      badge: '600+',
      activeColor: 'text-blue-400 bg-blue-500/10 border-blue-500/30 shadow-[0_0_12px_rgba(59,130,246,0.12)]'
    },
    { 
      id: 'social', 
      label: 'Social Attacks', 
      icon: Users, 
      badge: 'HOT',
      activeColor: 'text-purple-300 bg-purple-500/15 border-purple-500/40 shadow-[0_0_14px_rgba(168,85,247,0.18)]'
    },
    { 
      id: 'utilities', 
      label: 'Wordlists', 
      icon: Wrench,
      activeColor: 'text-amber-300 bg-amber-500/10 border-amber-500/30 shadow-[0_0_12px_rgba(245,158,11,0.12)]'
    },
    { 
      id: 'roadmap', 
      label: 'Roadmap', 
      icon: Compass,
      activeColor: 'text-rose-300 bg-rose-500/10 border-rose-500/30 shadow-[0_0_12px_rgba(244,63,94,0.12)]'
    },
    { 
      id: 'ai', 
      label: 'AI Mentor', 
      icon: Cpu,
      badge: 'AI',
      activeColor: 'text-violet-300 bg-violet-500/10 border-violet-500/30 shadow-[0_0_12px_rgba(139,92,246,0.12)]'
    },
  ];

  return (
    <header className="sticky top-0 z-50 px-2 sm:px-4 lg:px-6 pt-2.5 pb-1">
      {/* Floating Island Glass Capsule with Generous Width */}
      <div className="w-full max-w-[1440px] mx-auto rounded-2xl bg-[#070b15]/90 backdrop-blur-2xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
        {/* Subtle Ambient Glowing Edge Accent */}
        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-cyber-green/40 to-transparent rounded-t-2xl" />

        <div className="px-3 sm:px-4 py-2 flex items-center justify-between gap-2 sm:gap-4">
          {/* 1. Left: Logo & Brand Identity */}
          <div 
            className="flex items-center space-x-2.5 cursor-pointer select-none group shrink-0" 
            onClick={() => setActiveTab('dashboard')}
          >
            {/* Holographic Border Icon */}
            <div className="relative">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyber-green via-cyan-400 to-purple-600 p-[1.5px] shadow-md shadow-cyber-green/20 group-hover:scale-105 transition-transform duration-200">
                <div className="w-full h-full bg-[#080d18] rounded-[10px] flex items-center justify-center">
                  <Terminal className="w-4 h-4 text-cyber-green" />
                </div>
              </div>
              {/* Online Pulse Ping Beacon */}
              <span className="absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyber-green opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyber-green border-2 border-[#070b15]"></span>
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-base sm:text-lg font-extrabold tracking-tight font-display text-white whitespace-nowrap">
                CYBER<span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyber-green">KALI</span>
              </span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-cyber-green font-mono font-semibold tracking-wide whitespace-nowrap">
                v2.5
              </span>
            </div>
          </div>

          {/* 2. Center: Segmented Island Navigation Bar */}
          <nav className="hidden xl:flex items-center bg-[#040711]/90 p-1 rounded-xl border border-white/5 space-x-0.5 shrink-0">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`whitespace-nowrap flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-display transition-all duration-150 cursor-pointer border ${
                    isActive
                      ? `${item.activeColor} font-semibold`
                      : 'text-slate-400 hover:text-white hover:bg-white/5 border-transparent font-medium'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? '' : 'text-slate-400'}`} />
                  <span className="whitespace-nowrap">{item.label}</span>
                  
                  {/* Micro Badge for special tabs */}
                  {item.badge && (
                    <span className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-full uppercase tracking-tight whitespace-nowrap ${
                      item.badge === 'HOT' 
                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' 
                        : (item.badge === 'AI' 
                            ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30' 
                            : 'bg-blue-500/20 text-blue-300 border border-blue-500/30')
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* 3. Right: Professionally Unified Operator HUD */}
          <div className="flex items-center space-x-2 shrink-0">
            {user ? (
              /* Unified Operator Identity Capsule: Rank + XP + Profile + Logout */
              <div className="flex items-center bg-[#040711]/90 border border-white/10 rounded-xl p-1 shadow-md whitespace-nowrap">
                {/* Professionally Arranged Rank Badge */}
                <div 
                  className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg border text-xs font-mono font-bold tracking-tight shadow-sm whitespace-nowrap ${rank.badgeBg}`}
                  title={`Operator Tier: ${rank.title} (Level ${rank.level})`}
                >
                  <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                  <span>{rank.title}</span>
                </div>

                {/* XP Pill Counter */}
                <div 
                  className="flex items-center space-x-1 px-2.5 py-1 text-xs font-mono font-bold text-amber-300 whitespace-nowrap"
                  title="Accumulated Practice Reputation XP"
                >
                  <Award className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>{totalXP} XP</span>
                </div>

                {/* Subtle Divider */}
                <div className="w-px h-4 bg-white/10 mx-1 shrink-0" />

                {/* User Handle & Quick Profile Link */}
                <div className="flex items-center space-x-1 pl-1 pr-0.5">
                  <button
                    onClick={() => setActiveTab('dashboard')}
                    className="flex items-center space-x-1.5 hover:opacity-80 transition-opacity cursor-pointer group whitespace-nowrap"
                    title="Open Dashboard"
                  >
                    <div className="w-5 h-5 rounded-md bg-gradient-to-tr from-cyber-green to-cyan-400 p-[1px] shrink-0">
                      <div className="w-full h-full bg-[#0a0d17] rounded-[5px] flex items-center justify-center text-cyber-green font-mono font-bold text-[10px]">
                        {(user.username || user.email || 'O')[0].toUpperCase()}
                      </div>
                    </div>
                    <span className="text-slate-200 group-hover:text-cyber-green font-mono font-medium text-xs whitespace-nowrap hidden md:inline">
                      @{user.username || user.email?.split('@')[0]}
                    </span>
                  </button>

                  <button
                    onClick={onLogout}
                    className="p-1 hover:bg-slate-800 rounded-md text-slate-400 hover:text-rose-400 transition-colors ml-1 cursor-pointer shrink-0"
                    title="Sign Out"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              /* Guest Operator HUD: Rank + XP + Connect ID */
              <div className="flex items-center space-x-2 whitespace-nowrap">
                <div className="flex items-center bg-[#040711]/90 border border-white/10 rounded-xl p-1 shadow-sm whitespace-nowrap">
                  <div className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg border text-xs font-mono font-bold ${rank.badgeBg}`}>
                    <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                    <span>{rank.title}</span>
                  </div>
                  <div className="flex items-center space-x-1 px-2.5 py-1 text-xs font-mono font-bold text-amber-300">
                    <Award className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>{totalXP} XP</span>
                  </div>
                </div>

                <button
                  onClick={onOpenAuth}
                  className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyber-green to-emerald-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-bold text-xs transition-all shadow-md shadow-cyber-green/20 hover:scale-105 active:scale-95 cursor-pointer font-display whitespace-nowrap"
                >
                  <Sparkles className="w-3.5 h-3.5 text-slate-950 fill-current shrink-0" />
                  <span>Connect ID</span>
                </button>
              </div>
            )}

            {/* Secret Admin Route Exit */}
            {activeTab === 'admin' && (
              <button
                onClick={() => setActiveTab('dashboard')}
                className="px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 border border-rose-500/40 text-xs font-mono font-semibold transition-all cursor-pointer flex items-center space-x-1 whitespace-nowrap shrink-0"
                title="Exit Admin and return to Public Labs"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                <span>Exit Admin</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile & Tablet Navigation Segmented Dock */}
        <div className="flex xl:hidden items-center px-2 py-1.5 border-t border-white/5 text-xs font-mono overflow-x-auto gap-1 scrollbar-none whitespace-nowrap">
          {NAV_ITEMS.map((item) => {
            const isActive = activeTab === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-2.5 py-1 rounded-lg flex items-center space-x-1.5 shrink-0 transition-all font-display text-xs whitespace-nowrap border ${
                  isActive 
                    ? `${item.activeColor} font-semibold` 
                    : 'text-slate-400 hover:text-white border-transparent'
                }`}
              >
                <Icon className="w-3 h-3 shrink-0" />
                <span className="whitespace-nowrap">{item.label}</span>
                {item.badge && (
                  <span className="text-[8px] px-1 rounded-full bg-white/10 font-mono whitespace-nowrap">
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
