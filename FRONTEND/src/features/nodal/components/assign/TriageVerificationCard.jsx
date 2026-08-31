import React from 'react';
import { ShieldCheck, Sparkles } from 'lucide-react';
import { DOMAIN_OPTIONS, PRIORITY_OPTIONS, VERIFICATION_OPTIONS } from './assignConstants.js';

export const TriageVerificationCard = ({
  verificationStatus,
  setVerificationStatus,
  selectedDomain,
  setSelectedDomain,
  selectedPriority,
  setSelectedPriority
}) => {
  return (
    <div className="space-y-4">
      {/* 1. Triage Decision Status */}
      <div>
        <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2">
          1. Nodal Screening & Triage Status
        </label>
        <div className="grid grid-cols-2 gap-2">
          {VERIFICATION_OPTIONS.map((opt) => {
            const isSelected = verificationStatus === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => setVerificationStatus(opt.value)}
                className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer text-xs font-bold flex items-center space-x-2 ${
                  isSelected
                    ? 'border-slate-900 bg-slate-900 text-white shadow-2xs'
                    : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                }`}
              >
                <div className={`w-2 h-2 rounded-full shrink-0 ${
                  opt.color === 'emerald' ? 'bg-emerald-500' :
                  opt.color === 'amber' ? 'bg-amber-500' :
                  opt.color === 'blue' ? 'bg-blue-500' : 'bg-rose-500'
                }`} />
                <span className="line-clamp-1">{opt.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Domain & Priority Selectors */}
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
