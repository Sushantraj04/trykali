import React, { useEffect, useRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export function BinaryBackground() {
  const canvasRef = useRef(null);
  const [isEnabled, setIsEnabled] = useState(true);

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
      opacities[i] = 0.08 + Math.random() * 0.12; // subtle opacity (never overpowering)
    }

    let frame = 0;

    const render = () => {
      frame++;
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
          ctx.fillStyle = '#00ff88';
          ctx.shadowColor = '#00ff88';
          ctx.shadowBlur = 8;
        } else {
          // Subtle neon green & cyan tint for body
          const isCyan = i % 7 === 0;
          ctx.fillStyle = isCyan 
            ? `rgba(0, 229, 255, ${opacities[i]})` 
            : `rgba(0, 255, 136, ${opacities[i]})`;
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
  }, [isEnabled]);

  return (
    <>
      {isEnabled && (
        <canvas
          ref={canvasRef}
          className="fixed inset-0 pointer-events-none z-0 opacity-80"
          style={{ mixBlendMode: 'screen' }}
        />
      )}

      {/* Floating Background FX Toggle */}
      <button
        onClick={() => setIsEnabled(!isEnabled)}
        className="fixed bottom-4 right-4 z-40 p-2 rounded-full bg-[#0c101a]/80 backdrop-blur-md border border-slate-800 text-slate-400 hover:text-cyber-green hover:border-cyber-green/50 text-xs transition-all shadow-lg flex items-center space-x-1.5 font-mono"
        title="Toggle Binary Background Animation"
      >
        {isEnabled ? (
          <>
            <Eye className="w-3.5 h-3.5 text-cyber-green" />
            <span className="text-[10px] hidden sm:inline">Binary FX: On</span>
          </>
        ) : (
          <>
            <EyeOff className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-[10px] hidden sm:inline">Binary FX: Off</span>
          </>
        )}
      </button>
    </>
  );
}
