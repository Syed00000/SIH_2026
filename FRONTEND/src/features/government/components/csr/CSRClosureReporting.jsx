import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { MOCK_CLOSURE_STEPS } from '../../data/mockCsrLifecycleData.js';

export const CSRClosureReporting = () => {
  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div>
          <h3 className="text-xs sm:text-sm font-bold text-slate-900 tracking-wider uppercase">
            PHASE 7: STATUTORY PROJECT CLOSURE & REPORTING
          </h3>
          <p className="text-[11px] text-slate-500 font-medium mt-0.5">
            End-of-cycle compliance lifecycle and utilization certification checklist.
          </p>
        </div>

        <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/80 shadow-2xs self-start sm:self-auto">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>Status: Audit Cleared</span>
        </span>
      </div>

      {/* 3 Step Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {MOCK_CLOSURE_STEPS.map((item) => (
          <div
            key={item.step}
            className="p-4 bg-slate-50/70 border border-slate-200/80 rounded-xl space-y-2 shadow-2xs hover:bg-slate-50 transition-all"
          >
            <div className="flex items-center space-x-2.5">
              <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center shrink-0 border border-blue-200">
                {item.step}
              </div>
              <h4 className="text-xs font-bold text-slate-900 leading-tight">
                {item.title}
              </h4>
            </div>
            <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
              {item.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CSRClosureReporting;
