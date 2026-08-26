import React from 'react';
import { MOCK_ESCROW_COMPLIANCE_MATRIX } from '../../data/mockCsrLifecycleData.js';

export const CSREscrowMatrix = () => {
  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs space-y-3.5">
      <h3 className="text-[11px] font-bold text-slate-800 tracking-wider uppercase">
        ESCROW ACCOUNT LOCK-IN & TAX COMPLIANCE MATRIX
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {MOCK_ESCROW_COMPLIANCE_MATRIX.map((item) => (
          <div key={item.id} className="space-y-1">
            <span className="block text-[11px] font-semibold text-slate-500">
              {item.label}
            </span>
            <div className="w-full bg-slate-50/80 border border-slate-200/90 rounded-xl px-4 py-2.5 shadow-2xs">
              <span className={`text-xs font-bold ${item.color}`}>
                {item.value}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CSREscrowMatrix;
