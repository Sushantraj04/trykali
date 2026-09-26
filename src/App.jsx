import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { TerminalView } from './components/Terminal';
import { LabsView } from './components/Labs';
import { ToolsCatalog } from './components/ToolsCatalog';
import { UtilitiesSuite } from './components/UtilitiesSuite';
import { RoadmapView } from './components/Roadmap';
import { AIMentor } from './components/AIMentor';
import { DashboardView } from './components/Dashboard';
import { SocialEngineeringSuite } from './components/SocialEngineering';
import { BinaryBackground } from './components/BinaryBackground';
import { AuthModal } from './components/AuthModal';
import { TerminalSimulator } from './utils/terminalEngine';
import { cyberAuth } from './utils/supabaseClient';
import { LABS_DATA } from './data/labsData';
import { Terminal as TerminalIcon } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('terminal');
  const [activeLabId, setActiveLabId] = useState('lab-recon');
  const [labs, setLabs] = useState(LABS_DATA);
  const [totalXP, setTotalXP] = useState(150);
  const [terminalContext, setTerminalContext] = useState('');
  const [commandToInject, setCommandToInject] = useState('');

  // User Authentication State
  const [user, setUser] = useState(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Helper to load a specific user's progress into the UI
  const applyUserProgress = useCallback((activeUser) => {
    if (!activeUser) {
      // Reset labs to default uncompleted state
      setLabs(LABS_DATA.map(l => ({
        ...l,
        tasks: l.tasks.map(t => ({ ...t, completed: false }))
      })));
      setTotalXP(150);
      return;
    }

    setTotalXP(activeUser.xp || 150);
    const userCompletedMap = activeUser.completedTasks || {};

    // Restore completed tasks for this specific user
    setLabs(LABS_DATA.map(l => ({
      ...l,
      tasks: l.tasks.map(t => ({
        ...t,
        completed: Boolean(userCompletedMap[t.id])
      }))
    })));
  }, []);

  // Load existing session on mount
  useEffect(() => {
    async function checkSession() {
      const activeUser = await cyberAuth.getCurrentUser();
      if (activeUser) {
        setUser(activeUser);
        applyUserProgress(activeUser);
      }
    }
    checkSession();
  }, [applyUserProgress]);

  // Validate tasks against executed commands in real-time
  const handleLabAction = useCallback((action) => {
    setLabs(prevLabs => {
      let xpEarned = 0;
      let solvedTaskId = null;

      const updated = prevLabs.map(lab => {
        const newTasks = lab.tasks.map(task => {
          if (!task.completed && task.validate && task.validate(action)) {
            xpEarned += 50;
            solvedTaskId = task.id;
            return { ...task, completed: true };
          }
          return task;
        });
        return { ...lab, tasks: newTasks };
      });

      if (xpEarned > 0) {
        setTotalXP(curr => {
          const nextXP = curr + xpEarned;
          const rank = nextXP >= 500 ? 'Red Team Elite' : (nextXP >= 300 ? 'Security Specialist' : 'Junior Pentester');
          // Sync with database/profile for THIS logged-in user
          if (user?.id) {
            cyberAuth.syncUserProgress(user.id, {
              xp: nextXP,
              rank,
              completedTaskId: solvedTaskId
            });
          }
          return nextXP;
        });
      }
      return updated;
    });
  }, [user]);

  // Persistent simulator instance
  const simulator = useMemo(() => new TerminalSimulator(handleLabAction), [handleLabAction]);

  // When user clicks "Execute in Terminal" from Tools Catalog or Utilities
  const handleSendToTerminal = (cmd) => {
    setCommandToInject(cmd);
    setActiveTab('terminal');
  };

  // When user clicks "Run Hint" from Labs View
  const handleAutoFillTerminal = (cmd) => {
    setCommandToInject(cmd);
    setActiveTab('terminal');
  };

  // When user clicks "Ask AI to Explain"
  const handleSendToAI = (text) => {
    setTerminalContext(text);
    setActiveTab('ai');
  };

  // Handle successful login or registration
  const handleAuthSuccess = (loggedUser) => {
    setUser(loggedUser);
    applyUserProgress(loggedUser);
    setActiveTab('dashboard');
  };

  // Handle logout
  const handleLogout = async () => {
    await cyberAuth.signOut();
    setUser(null);
    applyUserProgress(null);
  };

  return (
    <div className="min-h-screen bg-[#05070c] text-slate-100 flex flex-col font-sans relative overflow-x-hidden selection:bg-cyber-green selection:text-black">
      {/* Animated Binary Numbers Stream in Background */}
      <BinaryBackground />

      {/* Foreground Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Top Navigation */}
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          totalXP={totalXP}
          user={user}
          onOpenAuth={() => setIsAuthOpen(true)}
          onLogout={handleLogout}
        />

        {/* Main Workspace Area */}
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
          {activeTab === 'dashboard' && (
            <DashboardView
              user={user}
              totalXP={totalXP}
              labs={labs}
              onLaunchLab={(labId) => {
                setActiveLabId(labId);
                setActiveTab('terminal');
              }}
              onOpenAuth={() => setIsAuthOpen(true)}
              onSendToTerminal={handleSendToTerminal}
            />
          )}

          {activeTab === 'terminal' && (
            <div className="space-y-6">
              {/* Live Practice Environment Header */}
              <div className="glass-card p-4 rounded-xl flex flex-wrap items-center justify-between gap-3 shadow-xl">
                <div className="flex items-center space-x-3.5">
                  <div className="w-10 h-10 rounded-lg bg-cyber-green/10 border border-cyber-green/40 flex items-center justify-center neon-border-green">
                    <TerminalIcon className="w-5 h-5 text-cyber-green" />
                  </div>
                  <div>
                    <h1 className="text-sm sm:text-base font-bold text-white tracking-tight flex items-center space-x-2">
                      <span>Hands-On Cyber Terminal Lab</span>
                      <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        Live Sandbox
                      </span>
                    </h1>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Execute real Kali Linux commands, scan virtual targets, and complete live CTF tasks.
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 text-xs font-mono">
                  <span className="text-slate-400">Target IP:</span>
                  <span className="text-cyber-green font-bold bg-[#080c14] px-2.5 py-1 rounded border border-cyber-green/30">
                    10.10.10.45
                  </span>
                </div>
              </div>

              {/* Split Screen Layout: Terminal (Left) + Guided Tasks (Right) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Terminal View (7 Cols) */}
                <div className="lg:col-span-7 flex flex-col">
                  <TerminalView
                    simulator={simulator}
                    onSendToAI={handleSendToAI}
                    commandToInject={commandToInject}
                    setCommandToInject={setCommandToInject}
                  />
                </div>

                {/* Guided Labs & Tasks (5 Cols) */}
                <div className="lg:col-span-5 flex flex-col">
                  <LabsView
                    labs={labs}
                    activeLabId={activeLabId}
                    setActiveLabId={setActiveLabId}
                    onAutoFillTerminal={handleAutoFillTerminal}
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'tools' && (
            <ToolsCatalog
              onSendToTerminal={handleSendToTerminal}
            />
          )}

          {activeTab === 'social' && (
            <SocialEngineeringSuite
              onSendToTerminal={handleSendToTerminal}
            />
          )}

          {activeTab === 'utilities' && (
            <UtilitiesSuite
              onSendToTerminal={handleSendToTerminal}
            />
          )}

          {activeTab === 'roadmap' && (
            <RoadmapView
              onStartLab={(labId) => {
                setActiveLabId(labId);
                setActiveTab('terminal');
              }}
            />
          )}

          {activeTab === 'ai' && (
            <AIMentor
              terminalContext={terminalContext}
            />
          )}
        </main>

        {/* Footer */}
        <footer className="bg-[#070a12]/80 backdrop-blur-md border-t border-[#1a2333] py-6 text-center text-xs text-slate-500 font-mono mt-auto">
          <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-between gap-3">
            <span>CyberKali Learning Platform © 2026. Professional Ethical Hacking Education.</span>
            <div className="flex items-center space-x-4">
              <span className="text-cyber-green font-semibold">100% In-Browser Practical Labs</span>
              <span>•</span>
              <span className="hover:text-slate-400 cursor-pointer" onClick={() => setActiveTab('terminal')}>Terminal</span>
              <span>•</span>
              <span className="hover:text-purple-400 cursor-pointer" onClick={() => setActiveTab('social')}>Social Attacks</span>
              <span>•</span>
              <span className="hover:text-slate-400 cursor-pointer" onClick={() => setActiveTab('tools')}>Tools</span>
              <span>•</span>
              <span className="hover:text-slate-400 cursor-pointer" onClick={() => setActiveTab('utilities')}>Wordlists</span>
            </div>
          </div>
        </footer>

        {/* Authentication Modal */}
        <AuthModal
          isOpen={isAuthOpen}
          onClose={() => setIsAuthOpen(false)}
          onAuthSuccess={handleAuthSuccess}
        />
      </div>
    </div>
  );
}
