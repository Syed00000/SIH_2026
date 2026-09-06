import React from 'react';
import { DOMAIN_OPTIONS, PRIORITY_OPTIONS } from './assignConstants.js';

export const TriageVerificationCard = ({
  selectedDomain,
  setSelectedDomain,
  selectedPriority,
  setSelectedPriority
}) => {
  return (
    <div className="space-y-3">
      {/* Domain & Priority Selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Domain Classification
          </label>
          <select
            value={selectedDomain}
            onChange={(e) => setSelectedDomain(e.target.value)}
            className="w-full border border-slate-200 rounded-md p-2 text-xs font-semibold text-slate-900 bg-white focus:outline-none focus:border-slate-900 cursor-pointer"
          >
            {DOMAIN_OPTIONS.map((dom) => (
              <option key={dom} value={dom}>
                {dom}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Priority Level
          </label>
          <div className="flex items-center space-x-1.5">
            {PRIORITY_OPTIONS.map((p) => {
              const isSelected = selectedPriority === p;
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => setSelectedPriority(p)}
                  className={`flex-1 py-2 rounded-md text-xs font-bold border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-slate-900 bg-slate-900 text-white shadow-2xs'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                  }`}
                >
                  {p}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TriageVerificationCard;
