import React, { useState } from 'react';
import { Cpu, Send, Sparkles, Lightbulb } from 'lucide-react';

export function AIMentor({ terminalContext }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: "Hello! I am your AI Cyber Mentor. You can ask me anything about Kali Linux tools, terminal syntax, network reconnaissance, web penetration testing, or CTF challenges."
    }
  ]);
  const [inputMsg, setInputMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Suggested questions in English
  const SUGGESTIONS = [
    "What is the difference between Nmap scan types (-sS vs -sT vs -sV)?",
    "What is the difference between a Reverse Shell and a Bind Shell?",
    "How to detect and prevent SQL Injection vulnerabilities?",
    "What do Linux file permissions (755, 644, 600) mean?"
  ];

  const handleSend = async (userText) => {
    const textToSend = userText || inputMsg;
    if (!textToSend.trim()) return;

    const userMessage = { role: 'user', text: textToSend };
    setMessages(prev => [...prev, userMessage]);
    setInputMsg('');
    setLoading(true);

    // Realistic smart response generator (Defensive & Educational in English)
    await new Promise(r => setTimeout(r, 600));

    let reply = "";
    const lower = textToSend.toLowerCase();

    if (lower.includes('nmap')) {
      reply = `**Nmap Scanning Methodology:**
- **-sS (TCP SYN Stealth Scan):** A half-open scan that does not complete the 3-way TCP handshake, making it faster and less conspicuous than full-connect scans.
- **-sV (Version Detection):** Probes open ports to determine the exact software name and version (e.g., Apache 2.4.52 or OpenSSH 8.9p1).
- **-T4 (Aggressive Timing):** Optimizes probe timeouts and parallelization for faster scanning on reliable networks.
- **Defensive Mitigation:** Configure stateful firewalls and Intrusion Detection Systems (IDS/IPS like Snort/Suricata) with rate-limiting rules to alert on port sweeps.`;
    } else if (lower.includes('reverse shell') || lower.includes('shell')) {
      reply = `**Reverse Shell vs Bind Shell:**
1. **Reverse Shell (Outbound Connection):** The target machine initiates an outbound TCP connection back to the penetration tester's listening machine. This effectively traverses Network Address Translation (NAT) and bypasses restrictive inbound firewall rules.
2. **Bind Shell (Inbound Connection):** The target machine opens a listening port on itself, and the tester connects directly to it. Most enterprise perimeter firewalls will block unexpected inbound connections.
- **Example Netcat Listener:** \`nc -lvnp 4444\``;
    } else if (lower.includes('sql') || lower.includes('injection')) {
      reply = `**SQL Injection (SQLi) Vulnerability Overview:**
- **Root Cause:** Occurs when untrusted user input is directly concatenated into a dynamic SQL query without validation or parameterized bindings.
- **Classic Test Vector:** \`admin' OR '1'='1\`
- **Defensive Remediations:**
  1. Always enforce **Parameterized Queries (Prepared Statements)** across all database queries.
  2. Implement strict input validation, allowlists, and modern Object-Relational Mappers (ORMs).
  3. Enforce the **Principle of Least Privilege** for database user service accounts.`;
    } else if (lower.includes('chmod') || lower.includes('permission')) {
      reply = `**Linux File Permissions Breakdown:**
- Notation Format: \`Owner (User) | Group | Others\`
- Numerical Representation: Read (4) + Write (2) + Execute (1)
  - **777:** Full access to all users (Severe security risk!).
  - **755:** Owner gets Read/Write/Execute (7), Group and Others get Read/Execute (5). Common for binaries and web assets.
  - **600:** Read and write access restricted strictly to the owner. Recommended for sensitive credential files and private SSH keys (\`id_rsa\`).`;
    } else {
      reply = `Hands-on command execution is the most effective way to build cybersecurity competence.
Feel free to execute commands in the live terminal, paste errors here, and I will walk you through the troubleshooting and methodology step by step!`;
    }

    setMessages(prev => [...prev, { role: 'assistant', text: reply }]);
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="bg-[#0a0d14] rounded-xl border border-cyber-border shadow-2xl flex flex-col h-[650px] overflow-hidden">
        {/* Chat Header */}
        <div className="bg-[#111622] px-6 py-4 border-b border-[#1e293b] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-cyber-cyan/15 border border-cyber-cyan/50 flex items-center justify-center">
              <Cpu className="w-5 h-5 text-cyber-cyan" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm sm:text-base flex items-center space-x-2">
                <span>CyberKali AI Mentor</span>
                <span className="text-[10px] bg-cyber-cyan/20 text-cyber-cyan px-2 py-0.5 rounded-full font-mono">
                  Online
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                AI Copilot for Ethical Hacking, Terminal Commands & Bug Bounty
              </p>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 font-sans text-xs sm:text-sm">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-xl p-4 leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-cyber-green text-slate-950 font-medium'
                    : 'bg-[#111622] border border-slate-800 text-slate-200 shadow-md'
                }`}
              >
                <div className="whitespace-pre-wrap">{m.text}</div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-[#111622] border border-slate-800 text-slate-400 p-3 rounded-xl text-xs flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-cyber-cyan animate-spin" />
                <span>AI Mentor is analyzing...</span>
              </div>
            </div>
          )}
        </div>

        {/* Suggested Queries */}
        <div className="px-4 py-2 bg-[#0e131f] border-t border-slate-800/80 flex items-center space-x-2 overflow-x-auto text-[11px]">
          <span className="text-slate-400 shrink-0 flex items-center space-x-1">
            <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
            <span>Suggested Topics:</span>
          </span>
          {SUGGESTIONS.map((s, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(s)}
              className="px-2.5 py-1 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 whitespace-nowrap shrink-0 transition-colors"
            >
              {s.slice(0, 45)}...
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-[#111622] border-t border-[#1e293b] flex items-center space-x-3">
          <input
            type="text"
            value={inputMsg}
            onChange={(e) => setInputMsg(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask anything about Kali Linux, terminal syntax, or paste error outputs..."
            className="flex-1 bg-[#0a0d14] border border-slate-800 rounded-lg px-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyber-cyan transition-all font-mono"
          />
          <button
            onClick={() => handleSend()}
            disabled={!inputMsg.trim() || loading}
            className="p-2.5 rounded-lg bg-cyber-cyan hover:bg-cyan-400 text-slate-950 font-bold transition-all disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
