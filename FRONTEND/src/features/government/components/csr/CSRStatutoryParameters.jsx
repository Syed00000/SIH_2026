import React from 'react';
import { MOCK_STATUTORY_PARAMETERS } from '../../data/mockCsrLifecycleData.js';

export const CSRStatutoryParameters = ({ activePhase = 'phase_1_2' }) => {
  const getPhaseTitle = () => {
    if (activePhase === 'phase_3_4') return 'ALLOCATION & TRANSFER METRICS (PHASE 3 & 4)';
    if (activePhase === 'phase_5_6') return 'UTILIZATION & COMPLIANCE TRACKING (PHASE 5 & 6)';
    if (activePhase === 'phase_7_8') return 'PAYMENT MODES & DISBURSEMENT LOGS (PHASE 7 & 8)';
    return 'STATUTORY VERIFICATION PARAMETERS (PHASE 1 & 2)';
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs space-y-3.5">
      <h3 className="text-[11px] font-bold text-slate-800 tracking-wider uppercase">
        {getPhaseTitle()}
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {MOCK_STATUTORY_PARAMETERS.map((param) => (
          <div key={param.id} className="space-y-1">
            <span className="block text-[11px] font-semibold text-slate-500">
              {param.label}
            </span>
            <div className="w-full bg-slate-50/80 border border-slate-200/90 rounded-xl px-3.5 py-2.5 shadow-2xs">
              <span className={`text-xs font-bold ${param.statusColor}`}>
                {param.value}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CSRStatutoryParameters;
