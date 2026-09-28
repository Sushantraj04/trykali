import React, { useEffect, useRef, useState } from 'react';
import { Eye, EyeOff, Palette } from 'lucide-react';

export function BinaryBackground() {
  const canvasRef = useRef(null);
  const [isEnabled, setIsEnabled] = useState(true);
  const [colorTheme, setColorTheme] = useState(() => {
    try {
      return localStorage.getItem('cyberkali_bg_theme') || 'green';
    } catch {
      return 'green';
    }
  });

  const handleThemeChange = (newTheme) => {
    setColorTheme(newTheme);
    try {
      localStorage.setItem('cyberkali_bg_theme', newTheme);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    if (!isEnabled) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;

    // Set canvas dimensions
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Characters pool: binary digits with occasional hex/cyber runes
    const chars = ['0', '1', '0', '1', '1', '0', '0', '1', '0x', 'FF', '7F', 'A9', '10', '01'];
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    
    // Each column has y-position, speed, and brightness
    const drops = [];
    const speeds = [];
    const opacities = [];

    for (let i = 0; i < columns; i++) {
      drops[i] = Math.random() * -100; // stagger initial start
      speeds[i] = 0.5 + Math.random() * 0.8; // variable falling speed for depth
      opacities[i] = 0.08 + Math.random() * 0.14; // subtle opacity
    }

    const isRed = colorTheme === 'red';

    const render = () => {
      // Subtle transparent clear to create falling trails
      ctx.fillStyle = 'rgba(5, 7, 12, 0.09)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `${fontSize}px "JetBrains Mono", monospace`;

      for (let i = 0; i < drops.length; i++) {
        // Pick random character
        const char = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        // Draw leading bright head
        if (Math.random() > 0.95) {
          if (isRed) {
            ctx.fillStyle = '#ff3366';
            ctx.shadowColor = '#ff2a5f';
          } else {
            ctx.fillStyle = '#00ff88';
            ctx.shadowColor = '#00ff88';
          }
          ctx.shadowBlur = 8;
        } else {
          // Trail colors
          if (isRed) {
            const isOrange = i % 7 === 0;
            ctx.fillStyle = isOrange 
              ? `rgba(255, 140, 0, ${opacities[i]})` 
              : `rgba(255, 42, 95, ${opacities[i]})`;
          } else {
            const isCyan = i % 7 === 0;
            ctx.fillStyle = isCyan 
              ? `rgba(0, 229, 255, ${opacities[i]})` 
              : `rgba(0, 255, 136, ${opacities[i]})`;
          }
          ctx.shadowBlur = 0;
        }

        ctx.fillText(char, x, y);

        // Reset drop to top with randomized delay once off-screen
        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
          speeds[i] = 0.5 + Math.random() * 0.8;
        }

        // Increment drop position
        drops[i] += speeds[i];
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isEnabled, colorTheme]);

  return (
    <>
      {isEnabled && (
        <canvas
          ref={canvasRef}
          className="fixed inset-0 pointer-events-none z-0 opacity-80"
          style={{ mixBlendMode: 'screen' }}
        />
      )}

      {/* Floating Luxury Background Theme & FX Controller */}
      <div className="fixed bottom-4 right-4 z-40 flex items-center space-x-1.5 p-1 rounded-2xl bg-[#050814]/90 backdrop-blur-2xl border border-white/10 shadow-[0_10px_35px_rgba(0,0,0,0.7)] text-xs font-mono select-none">
        {/* Palette Indicator */}
        <div className="pl-2 pr-1 text-slate-400 flex items-center space-x-1">
          <Palette className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-[10px] hidden md:inline uppercase font-bold text-slate-400">FX</span>
        </div>

        {/* Color Palette Switcher: Green & Red */}
        <div className="flex items-center space-x-1 bg-[#030610] p-0.5 rounded-xl border border-white/5">
          {/* Cyber Green Button */}
          <button
            onClick={() => handleThemeChange('green')}
            className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
              colorTheme === 'green'
                ? 'bg-cyber-green/20 text-cyber-green border border-cyber-green/50 shadow-[0_0_12px_rgba(0,255,136,0.3)] font-bold'
                : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
            title="Switch Background to Cyber Green (Sandbox / Defense)"
          >
            <span className="w-2 h-2 rounded-full bg-cyber-green shadow-[0_0_6px_#00ff88]"></span>
            <span className="text-[11px]">Green</span>
          </button>

          {/* Red Team Button */}
          <button
            onClick={() => handleThemeChange('red')}
            className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
              colorTheme === 'red'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/50 shadow-[0_0_12px_rgba(244,63,94,0.35)] font-bold'
                : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
            title="Switch Background to Crimson Red (Offensive / Red Team)"
          >
            <span className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_6px_#f43f5e]"></span>
            <span className="text-[11px]">Red</span>
          </button>
        </div>

        {/* Vertical Divider */}
        <div className="w-px h-4 bg-white/10 mx-0.5" />

        {/* Toggle On/Off Button */}
        <button
          onClick={() => setIsEnabled(!isEnabled)}
          className={`p-1.5 rounded-xl transition-all cursor-pointer flex items-center justify-center ${
            isEnabled 
              ? (colorTheme === 'green' ? 'text-cyber-green hover:bg-cyber-green/10' : 'text-rose-400 hover:bg-rose-500/10')
              : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
          }`}
          title={isEnabled ? "Disable Binary Background FX" : "Enable Binary Background FX"}
        >
          {isEnabled ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
        </button>
      </div>
    </>
  );
}
