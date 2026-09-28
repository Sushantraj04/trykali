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

  // Modern, clean, luxury Navigation Items
  const NAV_ITEMS = [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: LayoutDashboard,
    },
    { 
      id: 'terminal', 
      label: 'Terminal & Labs', 
      icon: Terminal,
    },
    { 
      id: 'tools', 
      label: 'Kali Tools', 
      icon: Shield,
      badge: '600+',
      badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
    },
    { 
      id: 'social', 
      label: 'Social Attacks', 
      icon: Users, 
      badge: 'HOT',
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30'
    },
    { 
      id: 'utilities', 
      label: 'Wordlists', 
      icon: Wrench,
    },
    { 
      id: 'roadmap', 
      label: 'Roadmap', 
      icon: Compass,
    },
    { 
      id: 'ai', 
      label: 'AI Mentor', 
      icon: Cpu,
      badge: 'AI',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30'
    },
  ];

  return (
    <header className="sticky top-0 z-50 px-2 sm:px-3 lg:px-5 pt-2 pb-1">
      {/* Luxury Obsidian Glass Floating Island Capsule */}
      <div className="w-full max-w-[1440px] mx-auto rounded-2xl bg-[#050814]/95 backdrop-blur-2xl border border-cyber-green/25 shadow-[0_12px_45px_rgba(0,0,0,0.7),0_0_20px_rgba(0,255,136,0.06)]">
        {/* Glowing Ambient Top Edge Line */}
        <div className="h-[1.5px] w-full bg-gradient-to-r from-transparent via-cyber-green/70 via-cyan-400/40 to-transparent rounded-t-2xl" />

        <div className="px-2.5 sm:px-3.5 py-2 flex items-center justify-between gap-1.5 sm:gap-2.5">
          {/* 1. Left: Luxury Brand & Logo */}
          <div 
            className="flex items-center space-x-2 cursor-pointer select-none group shrink-0" 
            onClick={() => setActiveTab('dashboard')}
            title="Go to Dashboard"
          >
            {/* Holographic Border Icon */}
            <div className="relative">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyber-green via-emerald-400 to-cyan-500 p-[1.5px] shadow-sm shadow-cyber-green/20 group-hover:scale-105 transition-transform duration-200">
                <div className="w-full h-full bg-[#070b15] rounded-[10px] flex items-center justify-center">
                  <Terminal className="w-4 h-4 text-cyber-green" />
                </div>
              </div>
              {/* Online Pulse Beacon */}
              <span className="absolute -bottom-0.5 -right-0.5 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyber-green opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyber-green border-2 border-[#050814]"></span>
              </span>
            </div>

            <div className="flex items-center space-x-1.5">
              <span className="text-sm sm:text-base font-black tracking-tight font-display text-white whitespace-nowrap">
                TRY<span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyber-green">KALI</span>
              </span>
              <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-cyber-green font-mono font-bold tracking-wide whitespace-nowrap hidden sm:inline">
                v2.5
              </span>
            </div>
          </div>

          {/* 2. Center: Luxury Segmented Navigation Tabs (Responsive & Never overflows screen) */}
          <nav className="hidden lg:flex items-center bg-[#030610]/95 p-1 rounded-xl border border-white/8 space-x-0.5 xl:space-x-1 overflow-x-auto scrollbar-none min-w-0 max-w-fit mx-1 xl:mx-auto">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`whitespace-nowrap flex items-center space-x-1.5 px-2.5 xl:px-3 py-1.5 rounded-lg text-xs font-display transition-all duration-150 cursor-pointer border shrink-0 ${
                    isActive
                      ? 'bg-cyber-green/15 text-cyber-green border-cyber-green/40 shadow-[0_0_14px_rgba(0,255,136,0.18)] font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-white/[0.06] border-transparent font-medium'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-cyber-green' : 'text-slate-400'}`} />
                  <span className="whitespace-nowrap">{item.label}</span>
                  
                  {/* Micro Badge for special tabs */}
                  {item.badge && (
                    <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full uppercase tracking-tight whitespace-nowrap border ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* 3. Right: Luxury Operator Station HUD (Always 100% Visible, Never Cut Off) */}
          <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0 z-10">
            {user ? (
              /* Authenticated Operator HUD: Rank + Glowing XP + Profile + Prominent Logout */
              <div className="flex items-center bg-[#030610]/95 border border-white/10 rounded-xl p-1 shadow-[0_4px_25px_rgba(0,0,0,0.6)] space-x-1.5 whitespace-nowrap backdrop-blur-xl">
                {/* 1. Dynamic Rank Pill */}
                <div 
                  className={`flex items-center space-x-1.5 px-2 sm:px-2.5 py-1 rounded-lg border text-xs font-mono font-bold tracking-tight shadow-sm whitespace-nowrap ${rank.badgeBg}`}
                  title={`Operator Rank: ${rank.title} (Level ${rank.level})`}
                >
                  <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                  <span className="hidden sm:inline">{rank.title}</span>
                  <span className="sm:hidden">Lvl {rank.level}</span>
                </div>

                {/* 2. Prominent Score / XP Pill (Golden Glowing) */}
                <div 
                  className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-gradient-to-r from-amber-500/20 to-yellow-500/10 border border-amber-500/40 text-xs font-mono font-extrabold text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.25)] whitespace-nowrap"
                  title="Accumulated Practice Reputation Score"
                >
                  <Award className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>{totalXP} XP</span>
                </div>

                {/* Divider */}
                <div className="w-px h-4 bg-white/15 mx-0.5 shrink-0" />

                {/* 3. User Profile */}
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className="flex items-center space-x-1.5 px-2 py-1 rounded-lg hover:bg-white/5 transition-all text-xs font-mono text-slate-200 hover:text-cyber-green group cursor-pointer"
                  title="Open Operator Dashboard"
                >
                  <div className="w-5 h-5 rounded-md bg-gradient-to-tr from-cyber-green via-emerald-400 to-teal-300 p-[1px] shrink-0 shadow-sm shadow-cyber-green/20">
                    <div className="w-full h-full bg-[#080d18] rounded-[5px] flex items-center justify-center text-cyber-green font-mono font-bold text-[10px]">
                      {(user.username || user.email || 'O')[0].toUpperCase()}
                    </div>
                  </div>
                  <span className="text-slate-200 group-hover:text-cyber-green font-medium whitespace-nowrap hidden 2xl:inline">
                    @{user.username || user.email?.split('@')[0]}
                  </span>
                </button>

                {/* 4. Luxury Prominent Logout Button */}
                <button
                  onClick={onLogout}
                  className="flex items-center space-x-1.5 px-2.5 sm:px-3 py-1 rounded-lg bg-rose-500/15 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 hover:border-rose-500/70 text-xs font-mono font-bold transition-all shadow-sm hover:shadow-[0_0_14px_rgba(244,63,94,0.35)] cursor-pointer shrink-0"
                  title="Sign Out of Station"
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  <span className="font-mono text-xs">Logout</span>
                </button>
              </div>
            ) : (
              /* Guest Operator HUD: Rank + XP + Connect ID */
              <div className="flex items-center bg-[#030610]/95 border border-white/10 rounded-xl p-1 shadow-[0_4px_25px_rgba(0,0,0,0.6)] space-x-1.5 whitespace-nowrap backdrop-blur-xl">
                {/* Operator Rank Badge */}
                <div className={`flex items-center space-x-1.5 px-2 sm:px-2.5 py-1 rounded-lg border text-xs font-mono font-bold ${rank.badgeBg}`}>
                  <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                  <span>{rank.title}</span>
                </div>

                {/* Prominent XP Score */}
                <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-gradient-to-r from-amber-500/20 to-yellow-500/10 border border-amber-500/40 text-xs font-mono font-extrabold text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.25)]">
                  <Award className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>{totalXP} XP</span>
                </div>

                {/* Divider */}
                <div className="w-px h-4 bg-white/15 mx-0.5 shrink-0" />

                {/* Connect ID Action */}
                <button
                  onClick={onOpenAuth}
                  className="flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-gradient-to-r from-cyber-green via-emerald-400 to-teal-300 hover:from-emerald-400 hover:to-teal-200 text-slate-950 font-black text-xs transition-all shadow-md shadow-cyber-green/25 hover:scale-105 active:scale-95 cursor-pointer font-display whitespace-nowrap"
                >
                  <Sparkles className="w-3.5 h-3.5 text-slate-950 fill-current shrink-0" />
                  <span>Connect ID</span>
                </button>
              </div>
            )}

            {/* Secret Admin Route Exit (Only shown on /admin) */}
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

        {/* Mobile & Tablet Navigation Dock */}
        <div className="flex lg:hidden items-center px-2 py-1.5 border-t border-white/5 text-xs font-mono overflow-x-auto gap-1 scrollbar-none whitespace-nowrap">
          {NAV_ITEMS.map((item) => {
            const isActive = activeTab === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 shrink-0 transition-all font-display text-xs whitespace-nowrap border ${
                  isActive 
                    ? 'bg-cyber-green/15 text-cyber-green border-cyber-green/40 font-bold shadow-[0_0_12px_rgba(0,255,136,0.15)]' 
                    : 'text-slate-400 hover:text-white border-transparent'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-cyber-green' : 'text-slate-400'}`} />
                <span className="whitespace-nowrap">{item.label}</span>
                {item.badge && (
                  <span className={`text-[8px] px-1 rounded-full font-mono whitespace-nowrap border ${item.badgeColor}`}>
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
