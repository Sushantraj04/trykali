import React, { useState } from 'react';
import { Search, Shield, Play, Terminal, Sliders } from 'lucide-react';
import { TOOLS_CATEGORIES, KALI_TOOLS } from '../data/toolsData';

export function ToolsCatalog({ onSendToTerminal }) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTool, setActiveTool] = useState(KALI_TOOLS[0]);

  // Flags state for active tool builder
  const [selectedFlags, setSelectedFlags] = useState(() => {
    const initial = {};
    KALI_TOOLS.forEach(t => {
      initial[t.id] = t.flags.filter(f => f.checked).map(f => f.flag);
    });
    return initial;
  });

  const filteredTools = KALI_TOOLS.filter(tool => {
    const matchesCategory = selectedCategory === "All" || tool.category === selectedCategory;
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          tool.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleFlag = (toolId, flag) => {
    setSelectedFlags(prev => {
      const current = prev[toolId] || [];
      if (current.includes(flag)) {
        return { ...prev, [toolId]: current.filter(f => f !== flag) };
      } else {
        return { ...prev, [toolId]: [...current, flag] };
      }
    });
  };

  // Generate dynamic command from selected flags
  const generateCommand = (tool) => {
    const flags = selectedFlags[tool.id] || [];
    if (flags.length === 0) return `${tool.id} 10.10.10.45`;
    return `${tool.id} ${flags.join(' ')} 10.10.10.45`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Top Banner & Search */}
      <div className="mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center space-x-2">
              <Shield className="w-6 h-6 text-cyber-green" />
              <span>Kali Linux Tools Encyclopedia</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Explore 600+ ethical hacking tools with interactive flag builders and live terminal execution.
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tools (e.g. nmap, sqlmap, gobuster)..."
              className="w-full bg-[#111622] border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyber-green transition-all font-mono"
            />
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 text-xs font-mono">
          {TOOLS_CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg border whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-cyber-green/15 border-cyber-green text-cyber-green font-semibold'
                  : 'bg-[#0e131f] border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Layout: Tool List on Left, Interactive Builder on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Tools List (4 cols) */}
        <div className="lg:col-span-4 space-y-2 max-h-[600px] overflow-y-auto pr-1">
          {filteredTools.map(tool => {
            const isSelected = activeTool.id === tool.id;
            return (
              <div
                key={tool.id}
                onClick={() => setActiveTool(tool)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-cyber-green/10 border-cyber-green shadow-md'
                    : 'bg-[#0a0d14] border-slate-800/80 hover:border-slate-700 hover:bg-[#111622]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-white text-sm font-mono flex items-center space-x-1.5">
                    <span className={isSelected ? 'text-cyber-green' : 'text-slate-200'}>{tool.name}</span>
                  </span>
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                    {tool.badge}
                  </span>
                </div>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {tool.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Right: Active Tool Detail & Command Builder (8 cols) */}
        <div className="lg:col-span-8 bg-[#0a0d14] rounded-xl border border-cyber-border p-5 sm:p-6 shadow-xl">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#1e293b] pb-4 mb-4">
            <div>
              <div className="flex items-center space-x-3">
                <h2 className="text-xl font-bold text-white font-mono">{activeTool.name}</h2>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyber-green/10 border border-cyber-green/30 text-cyber-green font-mono">
                  {activeTool.category}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
                {activeTool.description}
              </p>
            </div>
          </div>

          {/* Interactive Flag Builder */}
          {activeTool.flags && activeTool.flags.length > 0 && (
            <div className="mb-5 bg-[#111622] p-4 rounded-xl border border-slate-800">
              <div className="flex items-center space-x-2 text-xs font-semibold text-slate-300 font-mono mb-3">
                <Sliders className="w-4 h-4 text-cyber-green" />
                <span>Interactive Flag Configurator:</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {activeTool.flags.map(f => {
                  const isChecked = (selectedFlags[activeTool.id] || []).includes(f.flag);
                  return (
                    <label
                      key={f.flag}
                      onClick={() => toggleFlag(activeTool.id, f.flag)}
                      className={`flex items-start space-x-2.5 p-2.5 rounded-lg border cursor-pointer select-none text-xs transition-all ${
                        isChecked
                          ? 'bg-cyber-green/10 border-cyber-green/50 text-white'
                          : 'bg-[#0e131f] border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        readOnly
                        className="mt-0.5 rounded border-slate-700 text-cyber-green focus:ring-0 bg-slate-900"
                      />
                      <div>
                        <div className="font-mono font-bold text-cyber-green">{f.flag}</div>
                        <div className="text-[11px] text-slate-300 font-medium">{f.label}</div>
                        <div className="text-[10px] text-slate-500 mt-0.5">{f.desc}</div>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {/* Live Generated Command Box */}
          <div className="mb-6 bg-[#07090e] p-4 rounded-xl border border-cyber-green/40 shadow-inner">
            <div className="text-[11px] font-mono text-slate-400 mb-1.5 flex items-center justify-between">
              <span>Live Generated Terminal Command:</span>
              <span className="text-cyber-green text-[10px] uppercase">Ready to Execute</span>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0d121c] p-3 rounded-lg border border-slate-800">
              <code className="text-cyber-green font-mono text-xs sm:text-sm font-semibold break-all">
                {generateCommand(activeTool)}
              </code>
              <button
                onClick={() => onSendToTerminal(generateCommand(activeTool))}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-cyber-green hover:bg-cyber-greenDim text-slate-950 font-bold text-xs transition-all shadow-md shrink-0 font-mono"
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>Execute in Terminal</span>
              </button>
            </div>
          </div>

          {/* Common Real-world Examples */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono mb-2">
              Common Real-World Examples:
            </h4>
            <div className="space-y-2">
              {activeTool.examples.map((ex, i) => (
                <div key={i} className="flex items-center justify-between p-2.5 rounded-lg bg-[#111622] border border-slate-800 text-xs">
                  <div>
                    <code className="text-cyan-300 font-mono font-semibold">{ex.cmd}</code>
                    <span className="text-slate-500 ml-2 text-[11px]">— {ex.note}</span>
                  </div>
                  <button
                    onClick={() => onSendToTerminal(ex.cmd)}
                    className="p-1.5 rounded hover:bg-slate-700 text-slate-400 hover:text-cyber-green transition-colors"
                    title="Send to Terminal"
                  >
                    <Play className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
