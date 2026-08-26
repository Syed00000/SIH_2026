import React from 'react';
import { CheckCircle2, Clock, RefreshCw } from 'lucide-react';
import { MOCK_COMPLIANCE_CHECKLIST } from '../../data/mockCsrLifecycleData.js';

export const CSRComplianceChecklist = () => {
  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs space-y-4 flex flex-col justify-between h-full">
      <div className="space-y-3">
        <h3 className="text-xs sm:text-sm font-bold text-slate-900 tracking-wider uppercase">
          VERIFICATION & COMPLIANCE CHECKLIST
        </h3>

        <div className="space-y-2.5">
          {MOCK_COMPLIANCE_CHECKLIST.map((item) => (
            <div
              key={item.id}
              className="p-3 bg-slate-50/70 border border-slate-200/80 rounded-xl flex items-center justify-between gap-2 shadow-2xs"
            >
              <div>
                <span className="text-xs font-bold text-slate-800 block">
                  {item.title}
                </span>
                {item.subtitle && (
                  <span className="text-[10px] text-slate-400 font-medium block">
                    {item.subtitle}
                  </span>
                )}
              </div>

              <div>
                {item.statusType === 'checked' && (
                  <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>Checked</span>
                  </span>
                )}
                {item.statusType === 'pending' && (
                  <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200/80">
                    <Clock className="w-3 h-3 text-amber-600" />
                    <span>Pending</span>
                  </span>
                )}
                {item.statusType === 'progress' && (
                  <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200/80">
                    <RefreshCw className="w-3 h-3 text-rose-600 animate-spin" />
                    <span>In-progress</span>
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-3 border-t border-slate-100">
        <p className="text-[10px] text-slate-400 italic leading-relaxed">
          NOTE: This flow is applicable for both CSR Funding and Government Grants. Includes the flow of share, payment utilization, and making system note.
        </p>
      </div>
    </div>
  );
};

export default CSRComplianceChecklist;
