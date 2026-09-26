import React from 'react';
import { Target, CheckCircle2, Circle, ArrowRight, Award, Play } from 'lucide-react';

export function LabsView({ labs, activeLabId, setActiveLabId, onAutoFillTerminal }) {
  const currentLab = labs.find(l => l.id === activeLabId) || labs[0];
  const completedTasks = currentLab.tasks.filter(t => t.completed).length;
  const progressPercent = Math.round((completedTasks / currentLab.tasks.length) * 100);

  return (
    <div className="bg-[#0a0d14] rounded-xl border border-cyber-border p-4 sm:p-6 shadow-xl flex flex-col h-full">
      {/* Labs Header & Selector */}
      <div className="border-b border-[#1e293b] pb-4 mb-4">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center space-x-2">
            <Target className="w-5 h-5 text-cyber-green" />
            <h2 className="text-base sm:text-lg font-bold text-white tracking-wide">
              Hands-On Practical Labs
            </h2>
          </div>
          <span className="text-xs font-mono px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 font-semibold flex items-center space-x-1">
            <Award className="w-3.5 h-3.5" />
            <span>+{currentLab.xp} XP Upon Completion</span>
          </span>
        </div>

        {/* Lab Switcher Buttons */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs font-mono">
          {labs.map(lab => {
            const isDone = lab.tasks.every(t => t.completed);
            const isSelected = lab.id === currentLab.id;
            return (
              <button
                key={lab.id}
                onClick={() => setActiveLabId(lab.id)}
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg border transition-all shrink-0 ${
                  isSelected
                    ? 'bg-cyber-green/15 border-cyber-green text-cyber-green font-semibold shadow-sm'
                    : 'bg-[#111622] border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                }`}
              >
                {isDone ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyber-green" />
                ) : (
                  <Circle className="w-3.5 h-3.5 text-slate-500" />
                )}
                <span>{lab.title.split(':')[0]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Lab Details */}
      <div className="mb-4 bg-[#111622] p-4 rounded-lg border border-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <h3 className="font-bold text-white text-sm sm:text-base flex items-center space-x-2">
            <span>{currentLab.title}</span>
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/30 text-blue-400">
              {currentLab.level}
            </span>
          </h3>
          <div className="text-xs font-mono text-slate-400">
            Target Host: <strong className="text-cyber-cyan">{currentLab.target}</strong>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          {currentLab.description}
        </p>

        {/* Progress bar */}
        <div className="mt-3">
          <div className="flex justify-between text-[11px] font-mono mb-1">
            <span className="text-slate-400">Lab Progress</span>
            <span className="text-cyber-green font-semibold">{completedTasks} / {currentLab.tasks.length} Tasks ({progressPercent}%)</span>
          </div>
          <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
            <div
              className="bg-cyber-green h-full rounded-full transition-all duration-500 shadow-sm"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Tasks List */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono mb-2">
          Required Tasks (Execute in Terminal):
        </div>

        {currentLab.tasks.map((task, idx) => (
          <div
            key={task.id}
            className={`p-3.5 rounded-lg border transition-all ${
              task.completed
                ? 'bg-emerald-950/20 border-emerald-500/40 text-slate-200'
                : 'bg-[#111622] border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start space-x-2.5">
                <div className="mt-0.5 shrink-0">
                  {task.completed ? (
                    <CheckCircle2 className="w-4 h-4 text-cyber-green" />
                  ) : (
                    <span className="w-4 h-4 rounded-full border border-slate-600 flex items-center justify-center text-[10px] text-slate-400 font-mono">
                      {idx + 1}
                    </span>
                  )}
                </div>
                <div>
                  <h4 className={`text-xs sm:text-sm font-semibold ${task.completed ? 'text-cyber-green line-through' : 'text-white'}`}>
                    {task.title}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    {task.instruction}
                  </p>
                </div>
              </div>

              {/* Action: Auto-fill command into terminal */}
              {!task.completed && (
                <button
                  onClick={() => onAutoFillTerminal(task.commandHint)}
                  className="shrink-0 flex items-center space-x-1 px-2.5 py-1 rounded bg-cyber-green/10 hover:bg-cyber-green/20 border border-cyber-green/30 text-cyber-green text-[11px] font-mono transition-all"
                  title="Paste hint command into terminal"
                >
                  <Play className="w-3 h-3" />
                  <span>Run Hint</span>
                </button>
              )}
            </div>

            {/* Command Hint Badge */}
            <div className="mt-2.5 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] font-mono">
              <span className="text-slate-400">Target Command:</span>
              <code className="text-cyan-300 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                {task.commandHint}
              </code>
            </div>
          </div>
        ))}

        {progressPercent === 100 && (
          <div className="p-4 rounded-lg bg-cyber-green/15 border border-cyber-green text-center">
            <h4 className="text-cyber-green font-bold text-sm">
              🎉 Congratulations! Lab Completed!
            </h4>
            <p className="text-xs text-slate-300 mt-1">
              You earned +{currentLab.xp} XP. Proceed to the next lab to continue your cybersecurity journey!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
