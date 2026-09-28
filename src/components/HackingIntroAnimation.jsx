import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Shield, Cpu, Lock, CheckCircle2, Zap, AlertTriangle } from 'lucide-react';

export function HackingIntroAnimation({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);
  const canvasRef = useRef(null);

  const BOOT_LOGS = [
    { text: "INITIALIZING TRYKALI V2.5 SANDBOX KERNEL 6.12-AMD64...", delay: 0 },
    { text: "ESTABLISHING ENCRYPTED VNET TUNNEL (AES-256-GCM)...", delay: 900 },
    { text: "CALIBRATING ENCRYPTED CLOUD DATASTORE... [200 OK]", delay: 1800 },
    { text: "CALIBRATING 600+ KALI TOOLS & EXPLOIT FRAMEWORKS...", delay: 2700 },
    { text: "ALLOCATING ISOLATED DOCKER CONTAINER (TARGET: 10.10.10.45)...", delay: 3600 },
    { text: "ALL SYSTEMS NOMINAL — ACCESS GRANTED!", delay: 4400 }
  ];

  // 1. Matrix Digital Rain Canvas Effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const chars = '0123456789ABCDEF<>/:;!@#$%&*+-=~';
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops = Array(columns).fill(1);

    let animationId;
    const drawMatrix = () => {
      ctx.fillStyle = 'rgba(5, 7, 12, 0.08)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#00ff88';
      ctx.font = `${fontSize}px 'JetBrains Mono', monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = chars.charAt(Math.floor(Math.random() * chars.length));
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
      animationId = requestAnimationFrame(drawMatrix);
    };

    drawMatrix();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // 2. 5-Second Timer & Progress Bar (0% -> 100%)
  useEffect(() => {
    const startTime = Date.now();
    const duration = 5000; // 5 seconds total

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const currentProgress = Math.min(100, Math.floor((elapsed / duration) * 100));
      setProgress(currentProgress);

      // Determine step
      const stepIndex = BOOT_LOGS.findIndex((log, idx) => {
        const nextLog = BOOT_LOGS[idx + 1];
        if (!nextLog) return true;
        return elapsed >= log.delay && elapsed < nextLog.delay;
      });
      if (stepIndex !== -1) {
        setCurrentStep(stepIndex);
      }

      if (elapsed >= duration) {
        clearInterval(interval);
        setFadeOut(true);
        setTimeout(() => {
          if (onComplete) onComplete();
        }, 500);
      }
    }, 40);

    return () => clearInterval(interval);
  }, [onComplete]);

  const handleSkip = () => {
    setFadeOut(true);
    setTimeout(() => {
      if (onComplete) onComplete();
    }, 300);
  };

  return (
    <div className={`fixed inset-0 z-[99999] bg-[#05070c] flex flex-col items-center justify-center p-4 transition-opacity duration-500 ${
      fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
    }`}>
      {/* Matrix Canvas Layer */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none opacity-40"
      />

      {/* Center Cyber HUD Container */}
      <div className="relative z-10 max-w-xl w-full bg-[#070b16]/90 border border-cyber-green/40 rounded-3xl p-6 sm:p-8 backdrop-blur-2xl shadow-[0_0_80px_rgba(0,255,136,0.25)] space-y-6">
        {/* Holographic Glowing Emblem */}
        <div className="flex items-center justify-center">
          <div className="relative group">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-cyber-green via-cyan-400 to-purple-600 p-[2px] shadow-[0_0_35px_rgba(0,255,136,0.4)] animate-pulse">
              <div className="w-full h-full bg-[#0a0d17] rounded-[14px] flex items-center justify-center">
                <Terminal className="w-10 h-10 text-cyber-green" />
              </div>
            </div>
            {/* Ping beacon */}
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyber-green opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-cyber-green border-2 border-[#070b16]"></span>
            </span>
          </div>
        </div>

        {/* Brand & Subtitle */}
        <div className="text-center space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-display">
            TRY<span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyber-green to-cyan-300">KALI</span>
          </h1>
          <p className="text-xs text-cyber-green font-mono uppercase tracking-widest flex items-center justify-center space-x-2">
            <Zap className="w-3.5 h-3.5 animate-pulse" />
            <span>Initializing Security Sandbox Environment</span>
          </p>
        </div>

        {/* Live Terminal Log Stream */}
        <div className="bg-[#03050a] border border-slate-800/80 rounded-2xl p-4 font-mono text-xs space-y-1.5 shadow-inner min-h-[140px] flex flex-col justify-end">
          {BOOT_LOGS.slice(0, currentStep + 1).map((log, index) => (
            <div 
              key={index} 
              className={`flex items-start space-x-2 transition-all ${
                index === currentStep ? 'text-cyber-green font-bold' : 'text-slate-500'
              }`}
            >
              <span className="text-cyan-400 shrink-0">&gt;</span>
              <span className="break-all">{log.text}</span>
            </div>
          ))}
          <div className="flex items-center space-x-1 text-cyber-green animate-pulse pt-1">
            <span>_</span>
          </div>
        </div>

        {/* Progress Bar & Percentage */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400">Sandbox Boot Sequence:</span>
            <span className="text-cyber-green font-bold">{progress}%</span>
          </div>

          <div className="w-full bg-[#03050a] rounded-full h-3 p-0.5 border border-white/10 overflow-hidden shadow-inner">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyber-green via-cyan-400 to-emerald-300 transition-all duration-75 shadow-[0_0_15px_#00ff88]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Educational Purpose Disclaimer */}
        <div className="flex items-center justify-center space-x-2 text-[11px] font-mono text-amber-300/90 bg-amber-500/10 border border-amber-500/25 px-3 py-2 rounded-xl text-center shadow-sm">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>Notice: Strictly for educational and ethical learning purposes only.</span>
        </div>

        {/* Skip Button */}
        <div className="text-center pt-0.5">
          <button
            onClick={handleSkip}
            className="text-[11px] font-mono text-slate-500 hover:text-slate-300 transition-colors underline cursor-pointer"
          >
            Press here to skip boot sequence &rarr;
          </button>
        </div>
      </div>
    </div>
  );
}
