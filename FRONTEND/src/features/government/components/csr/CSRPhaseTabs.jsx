import React from 'react';
import { MOCK_CSR_PHASES } from '../../data/mockCsrLifecycleData.js';

export const CSRPhaseTabs = ({ activePhase = 'phase_1_2', onSelectPhase }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {MOCK_CSR_PHASES.map((phase) => {
        const isActive = activePhase === phase.id;
        return (
          <button
            key={phase.id}
            onClick={() => onSelectPhase?.(phase.id)}
            className={`p-3.5 sm:p-4 rounded-xl text-left transition-all cursor-pointer border ${
              isActive
                ? 'bg-blue-50/50 border-blue-600 ring-1 ring-blue-600/30 shadow-2xs'
                : 'bg-white border-slate-200/80 hover:border-slate-300 hover:bg-slate-50/60 shadow-2xs'
            }`}
          >
            <span className={`text-[10px] font-bold tracking-wider uppercase block mb-0.5 ${
              isActive ? 'text-blue-600' : 'text-slate-400'
            }`}>
              {phase.phaseNumber}
            </span>
            <span className={`text-xs sm:text-sm font-bold block leading-snug ${
              isActive ? 'text-blue-900' : 'text-slate-700'
            }`}>
              {phase.title}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default CSRPhaseTabs;
