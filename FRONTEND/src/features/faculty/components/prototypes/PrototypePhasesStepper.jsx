import React from 'react';
import { Sparkles, CheckCircle2 } from 'lucide-react';

export const PrototypePhasesStepper = ({ phases, activePhase, setActivePhase, phaseData, phaseColors }) => {
  return (
    <div className="flex border-b border-slate-200">
      {phases.map((p, i) => {
        const isActive = i === activePhase;
        const pColors = phaseColors[p.color];
        const phaseContent = phaseData[p.key];
        const isDone = phaseContent && phaseContent.replace(/<[^>]*>/g, '').trim().length > 0;

        return (
          <button
            key={p.key}
            type="button"
            onClick={() => setActivePhase(i)}
            className={`flex-1 flex items-center justify-center space-x-2 py-3.5 px-3 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer relative ${
              isActive
                ? `${pColors.bg} ${pColors.text} ${pColors.border} border-b-2`
                : isDone
                ? 'bg-slate-50 text-slate-600 hover:bg-slate-100 border-b-2 border-transparent'
                : 'bg-white text-slate-400 hover:text-slate-600 hover:bg-slate-50 border-b-2 border-transparent'
            }`}
          >
            {isActive && <Sparkles className="w-3 h-3 animate-pulse opacity-70" />}
            {isDone && !isActive && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
            <span className="font-extrabold">{i + 1}. {p.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default PrototypePhasesStepper;
