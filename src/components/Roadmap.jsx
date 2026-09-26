import React from 'react';
import { Compass, Clock, ChevronRight, Terminal } from 'lucide-react';
import { ROADMAP_STEPS } from '../data/roadmapData';

export function RoadmapView({ onStartLab }) {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Title */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyber-green/10 border border-cyber-green/30 text-cyber-green text-xs font-mono mb-3">
          <Compass className="w-3.5 h-3.5" />
          <span>CYBERSECURITY CAREER BLUEPRINT</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-display">
          Ethical Hacking & Cybersecurity Roadmap
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto mt-2 leading-relaxed">
          Zero to Pro step-by-step practical pathway. Follow every stage and master live terminal skills.
        </p>
      </div>

      {/* Timeline Steps */}
      <div className="relative border-l-2 border-slate-800 ml-4 sm:ml-8 pl-6 sm:pl-8 space-y-10">
        {ROADMAP_STEPS.map((s) => (
          <div key={s.step} className="relative group">
            {/* Step Number Dot */}
            <div className="absolute -left-[35px] sm:-left-[43px] top-1.5 w-8 h-8 rounded-full bg-[#0a0d14] border-2 border-cyber-green flex items-center justify-center text-xs font-bold text-cyber-green font-mono shadow-md group-hover:scale-110 transition-transform">
              0{s.step}
            </div>

            {/* Step Card */}
            <div className="bg-[#0a0d14] rounded-xl border border-cyber-border p-5 sm:p-6 shadow-xl hover:border-cyber-green/40 transition-all">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <h3 className="text-base sm:text-lg font-bold text-white flex items-center space-x-2 font-display">
                  <span>{s.title}</span>
                </h3>
                <span className="text-[11px] font-mono text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2.5 py-0.5 rounded-full flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>{s.duration}</span>
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                {s.description}
              </p>

              {/* Skills Tags */}
              <div className="mb-4">
                <div className="text-[11px] font-mono text-slate-500 uppercase tracking-wider mb-2 font-semibold">
                  Core Competencies:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {s.skills.map((skill, i) => (
                    <span
                      key={i}
                      className="text-xs px-2.5 py-1 rounded bg-[#111622] border border-slate-800 text-slate-300 font-mono"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Associated Practice Lab */}
              <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center space-x-2 text-xs text-slate-400">
                  <span className="text-cyber-green font-mono font-semibold">Recommended Practice:</span>
                  <span>{s.labRecommendation}</span>
                </div>

                <button
                  onClick={() => onStartLab(s.step === 1 ? 'lab-recon' : (s.step === 2 ? 'lab-linux-perm' : 'lab-web-fuzz'))}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-cyber-green/15 hover:bg-cyber-green/25 border border-cyber-green/40 text-cyber-green text-xs font-semibold font-mono transition-all"
                >
                  <Terminal className="w-3.5 h-3.5" />
                  <span>Open Lab</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
