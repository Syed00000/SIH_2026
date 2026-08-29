import React from 'react';
import { MOCK_CSR_PHASES } from '../../data/mockCsrLifecycleData.js';

export const CSRPhaseTabs = ({ activePhase = 'phase_1_2', onSelectPhase }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 select-none">
      {MOCK_CSR_PHASES.map((phase) => {
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
