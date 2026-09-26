import React, { useState, useEffect, useRef } from 'react';
import { Terminal as TerminalIcon, Play, RefreshCw, Cpu, CheckCircle2, Copy, Sparkles, Server, Laptop, AlertCircle } from 'lucide-react';

export function TerminalView({ simulator, onCommandRun, onSendToAI, commandToInject, setCommandToInject, lang }) {
  const [terminalMode, setTerminalMode] = useState('browser'); // 'browser' | 'docker'
  const [dockerStatus, setDockerStatus] = useState('disconnected'); // 'connected' | 'connecting' | 'disconnected'
  const wsRef = useRef(null);

  const [lines, setLines] = useState([
    { type: 'system', text: "\x1b[1;32mKali Linux GNU/Linux Rolling (CyberLab Sandbox v2.5)\x1b[0m" },
    { type: 'system', text: "Target Environment: \x1b[1;36m10.10.10.45\x1b[0m | Scope: \x1b[1;33mInternal Pentest Practice\x1b[0m" },
    { type: 'system', text: "Type \x1b[1;32m'help'\x1b[0m to list available tools or \x1b[1;35m'ai-explain <tool>'\x1b[0m for AI assistance.\n" }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isProcessing, setIsProcessing] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  // If a command is injected from Tools catalog or Labs
  useEffect(() => {
    if (commandToInject) {
      setInputVal(commandToInject);
      inputRef.current?.focus();
      setCommandToInject('');
    }
  }, [commandToInject, setCommandToInject]);

  // Handle Cloud Docker WebSocket mode
  useEffect(() => {
    if (terminalMode === 'docker') {
      setDockerStatus('connecting');
      setLines(prev => [...prev, {
        type: 'system',
        text: "\x1b[1;33m[+] Connecting to Cloud Docker Gateway (ws://localhost:4000)...\x1b[0m"
      }]);

      try {
        const socket = new WebSocket('ws://localhost:4000');
        wsRef.current = socket;

        socket.onopen = () => {
          setDockerStatus('connected');
          setLines(prev => [...prev, {
            type: 'system',
            text: "\x1b[1;32m[✓] Connected to isolated Kali Linux container!\x1b[0m\n"
          }]);
        };

        socket.onmessage = (event) => {
          setLines(prev => [...prev, { type: 'output', text: event.data }]);
        };

        socket.onerror = () => {
          setDockerStatus('disconnected');
          setLines(prev => [...prev, {
            type: 'system',
            text: "\x1b[1;31m[!] Cloud container server offline (ws://localhost:4000). To run live containers, execute 'node backend/server.js'. Falling back to In-Browser Sandbox.\x1b[0m\n"
          }]);
        };

        socket.onclose = () => {
          setDockerStatus('disconnected');
        };

        return () => socket.close();
      } catch (err) {
        setDockerStatus('disconnected');
      }
    } else {
      if (wsRef.current) {
        wsRef.current.close();
      }
    }
  }, [terminalMode]);

  // Auto scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lines, isProcessing]);

  const handleTerminalClick = () => {
    inputRef.current?.focus();
  };

  const handleKeyDown = async (e) => {
    // Up arrow for history
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (simulator.history.length > 0) {
        const nextIdx = historyIndex === -1 ? simulator.history.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(nextIdx);
        setInputVal(simulator.history[nextIdx] || '');
      }
    }
    // Down arrow for history
    else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex !== -1) {
        const nextIdx = historyIndex + 1;
        if (nextIdx < simulator.history.length) {
          setHistoryIndex(nextIdx);
          setInputVal(simulator.history[nextIdx]);
        } else {
          setHistoryIndex(-1);
          setInputVal('');
        }
      }
    }
    // Tab key for auto-complete
    else if (e.key === 'Tab') {
      e.preventDefault();
      const available = [
        'nmap', 'ping', 'whois', 'curl', 'gobuster', 'sqlmap', 'hydra', 'john',
        'nikto', 'nc', 'ifconfig', 'cat', 'ls', 'pwd', 'help', 'clear', 'flag.txt',
        'notes.txt', '/etc/passwd', 'aircrack-ng', 'netstat'
      ];
      const match = available.find(c => c.startsWith(inputVal.trim()));
      if (match) {
        setInputVal(match + ' ');
      }
    }
    // Enter to execute command
    else if (e.key === 'Enter') {
      e.preventDefault();
      const cmdToRun = inputVal;
      setInputVal('');
      setHistoryIndex(-1);
      await executeCommand(cmdToRun);
    }
  };

  const executeCommand = async (commandStr) => {
    const trimmed = commandStr.trim();
    if (!trimmed) return;

    // Append user input line
    setLines(prev => [...prev, { type: 'input', text: `root@kali:${simulator.currentPath}# ${trimmed}` }]);

    // If connected to real Docker container via WebSocket
    if (terminalMode === 'docker' && wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(trimmed + '\n');
      return;
    }

    // In-Browser Sandbox Execution
    setIsProcessing(true);
    const isScanTool = ['nmap', 'gobuster', 'sqlmap', 'john', 'hydra', 'nikto', 'ping', 'aircrack-ng'].some(t => trimmed.startsWith(t));
    const delay = isScanTool ? 350 : 60;

    await new Promise(r => setTimeout(r, delay));

    const result = await simulator.execute(trimmed);
    setIsProcessing(false);

    if (result === '__CLEAR__') {
      setLines([]);
    } else {
      setLines(prev => [...prev, { type: 'output', text: result }]);
      if (onCommandRun) onCommandRun(trimmed, result);
    }
  };

  const handleShortcutClick = (cmd) => {
    setInputVal(cmd);
    inputRef.current?.focus();
  };

  // Convert ANSI escape codes to basic HTML colored spans
  const formatAnsi = (text) => {
    if (!text) return null;
    const parts = text.split(/(\x1b\[[0-9;]*m)/g);
    let currentColor = 'text-slate-200';
    let isBold = false;

    return parts.map((part, idx) => {
      if (part.startsWith('\x1b[')) {
        if (part === '\x1b[0m') {
          currentColor = 'text-slate-200';
          isBold = false;
        } else if (part.includes('32')) {
          currentColor = 'text-cyber-green';
        } else if (part.includes('31')) {
          currentColor = 'text-rose-400';
        } else if (part.includes('33')) {
          currentColor = 'text-amber-400';
        } else if (part.includes('34')) {
          currentColor = 'text-cyan-400';
        } else if (part.includes('35')) {
          currentColor = 'text-fuchsia-400';
        } else if (part.includes('36')) {
          currentColor = 'text-cyan-300';
        }
        if (part.includes('1;')) isBold = true;
        return null;
      }
      return (
        <span key={idx} className={`${currentColor} ${isBold ? 'font-bold' : ''}`}>
          {part}
        </span>
      );
    });
  };

  return (
    <div className="flex flex-col h-full bg-[#0a0d14] rounded-xl border border-cyber-border shadow-2xl overflow-hidden">
      {/* Terminal Title Bar */}
      <div className="bg-[#111622] px-4 py-3 border-b border-[#1e293b] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="flex space-x-1.5">
            <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
          </div>
          <span className="text-xs font-mono text-slate-300 flex items-center space-x-2">
            <TerminalIcon className="w-3.5 h-3.5 text-cyber-green" />
            <span className="font-semibold text-cyber-green">root@kali</span>
            <span className="text-slate-500">:</span>
            <span className="text-cyan-400">{simulator.currentPath}</span>
            <span className="text-slate-500">— /bin/bash</span>
          </span>
        </div>

        {/* Dual Mode Switcher & AI Explain */}
        <div className="flex items-center space-x-2 text-xs font-mono">
          {/* Mode Switcher */}
          <div className="bg-[#0a0d14] p-0.5 rounded-lg border border-slate-800 flex items-center">
            <button
              onClick={() => setTerminalMode('browser')}
              className={`flex items-center space-x-1 px-2 py-1 rounded text-[11px] transition-all ${
                terminalMode === 'browser'
                  ? 'bg-cyber-green/20 text-cyber-green font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Laptop className="w-3 h-3" />
              <span>In-Browser</span>
            </button>

            <button
              onClick={() => setTerminalMode('docker')}
              className={`flex items-center space-x-1 px-2 py-1 rounded text-[11px] transition-all ${
                terminalMode === 'docker'
                  ? 'bg-cyan-500/20 text-cyan-300 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Server className="w-3 h-3" />
              <span>Cloud Docker</span>
            </button>
          </div>

          <button
            onClick={() => onSendToAI(lines.filter(l => l.type === 'output').slice(-1)[0]?.text || 'help')}
            className="flex items-center space-x-1 px-2.5 py-1 rounded bg-fuchsia-950/50 hover:bg-fuchsia-900/60 border border-fuchsia-500/40 text-fuchsia-300 text-[11px] transition-all"
            title="Ask AI to explain current terminal output"
          >
            <Sparkles className="w-3 h-3 text-fuchsia-400" />
            <span>AI Explain</span>
          </button>
        </div>
      </div>

      {/* Quick Command Pills Bar */}
      <div className="bg-[#0e131f] px-4 py-2 border-b border-[#1e293b] flex items-center space-x-2 overflow-x-auto text-[11px] font-mono">
        <span className="text-slate-400 shrink-0 text-[10px] uppercase tracking-wider font-semibold">Quick Run:</span>
        <button
          onClick={() => handleShortcutClick('nmap -sV 10.10.10.45')}
          className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-cyber-green border border-cyber-green/30 shrink-0"
        >
          nmap -sV
        </button>
        <button
          onClick={() => handleShortcutClick('hydra -l admin -P /usr/share/wordlists/rockyou-sample.txt 10.10.10.45 ssh')}
          className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-rose-300 border border-rose-500/30 shrink-0"
        >
          hydra ssh
        </button>
        <button
          onClick={() => handleShortcutClick('gobuster dir -u http://10.10.10.45 -w /usr/share/wordlists/common-dirs.txt')}
          className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 shrink-0"
        >
          gobuster
        </button>
        <button
          onClick={() => handleShortcutClick('cat flag.txt')}
          className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-purple-300 border border-purple-500/30 shrink-0"
        >
          cat flag
        </button>
        <button
          onClick={() => handleShortcutClick('help')}
          className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 shrink-0"
        >
          help
        </button>
        <button
          onClick={() => executeCommand('clear')}
          className="px-2 py-0.5 rounded bg-slate-800/60 hover:bg-slate-700 text-slate-400 shrink-0 ml-auto"
        >
          clear
        </button>
      </div>

      {/* Terminal Body */}
      <div
        onClick={handleTerminalClick}
        className="flex-1 p-4 overflow-y-auto font-mono text-xs sm:text-sm leading-relaxed space-y-1.5 cursor-text select-text"
        style={{ minHeight: '380px' }}
      >
        {lines.map((item, idx) => (
          <div key={idx} className="whitespace-pre-wrap break-all">
            {item.type === 'input' ? (
              <span className="text-cyber-green font-semibold">{item.text}</span>
            ) : (
              formatAnsi(item.text)
            )}
          </div>
        ))}

        {isProcessing && (
          <div className="flex items-center space-x-2 text-cyber-green py-1">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            <span className="text-xs text-cyber-muted">Executing command on Kali sandbox...</span>
          </div>
        )}

        {/* Live Input Prompt Line */}
        <div className="flex items-center space-x-2 pt-1">
          <span className="text-cyber-green font-semibold shrink-0">
            root@kali:{simulator.currentPath}#
          </span>
          <input
            ref={inputRef}
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
            spellCheck="false"
            autoComplete="off"
            className="flex-1 bg-transparent text-white font-mono outline-none border-none p-0 focus:ring-0 text-xs sm:text-sm"
            placeholder="Type command here (e.g. nmap 10.10.10.45, hydra, help)..."
          />
        </div>

        <div ref={bottomRef} />
      </div>

      {/* Terminal Footer Info */}
      <div className="bg-[#0e131f] px-4 py-2 border-t border-[#1e293b] flex items-center justify-between text-[11px] text-slate-400 font-mono">
        <div className="flex items-center space-x-3">
          <span>Mode: <strong className={terminalMode === 'browser' ? 'text-cyber-green' : 'text-cyan-400'}>
            {terminalMode === 'browser' ? 'Browser Sandbox (Instant)' : `Cloud Container (${dockerStatus})`}
          </strong></span>
          <span className="hidden sm:inline">|</span>
          <span className="hidden sm:inline">Tab = Auto-Complete, Up/Down = History</span>
        </div>
        <div>
          <span>Target Host: <strong className="text-cyan-400">10.10.10.45</strong></span>
        </div>
      </div>
    </div>
  );
}
