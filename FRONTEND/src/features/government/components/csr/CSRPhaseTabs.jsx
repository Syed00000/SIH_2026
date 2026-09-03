import React from 'react';
import { CSR_PHASES } from '../../data/csrConstants.js';

export const CSRPhaseTabs = ({ activePhase = 'phase_1_2', onSelectPhase }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 select-none">
      {CSR_PHASES.map((phase) => {
        const isActive = activePhase === phase.id;
        return (
          <button
            key={phase.id}
            onClick={() => onSelectPhase?.(phase.id)}
            className={`p-5 rounded-md text-left transition-all cursor-pointer bg-white ${
              isActive
                ? 'border-2 border-slate-900 shadow-2xs'
                : 'border border-slate-200/90 hover:border-slate-300 shadow-3xs'
            }`}
          >
            <span className="text-xs sm:text-sm font-black block leading-snug text-slate-950">
              {phase.title}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default CSRPhaseTabs;
