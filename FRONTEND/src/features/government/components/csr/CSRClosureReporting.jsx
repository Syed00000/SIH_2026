import React, { useState } from 'react';
import { CheckCircle2, ChevronRight } from 'lucide-react';
import { MOCK_CLOSURE_STEPS } from '../../data/mockCsrLifecycleData.js';
import { Gfr12AModal } from './Gfr12AModal.jsx';
import { CaAuditReportModal } from './CaAuditReportModal.jsx';
import { UnspentSweepModal } from './UnspentSweepModal.jsx';

export const CSRClosureReporting = () => {
  const [selectedStepModal, setSelectedStepModal] = useState(null);

  return (
    <>
      <div className="bg-white rounded-lg p-5 border border-slate-200 shadow-xs space-y-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 tracking-wider uppercase">
              Statutory Project Closure & Reporting
            </h3>
            <p className="text-xs text-slate-500 font-normal mt-0.5">
              End-of-cycle compliance and utilization certification checklist. Click any step to view certificates.
            </p>
          </div>

          {/* Clean Inline Text - No Background Box */}
          <span className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-900 self-start sm:self-auto">
            <CheckCircle2 className="w-3.5 h-3.5 text-slate-900" />
            <span>Audit Cleared</span>
          </span>
        </div>

        {/* 4 Step Cards - Screenshot 3 Match */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {MOCK_CLOSURE_STEPS.map((item) => (
            <div
              key={item.step}
              onClick={() => setSelectedStepModal(String(item.step))}
              className="p-4 bg-white border border-slate-200/90 rounded-lg flex flex-col justify-between h-24 hover:border-slate-300 hover:shadow-xs shadow-3xs transition-all cursor-pointer group relative"
            >
              <div className="flex items-start justify-between gap-1">
                <h4 className="text-xs font-bold text-slate-900 leading-snug group-hover:underline">
                  {item.step}. {item.title}
                </h4>
                <ChevronRight className="w-3.5 h-3.5 text-slate-800 group-hover:translate-x-0.5 transition-transform shrink-0" />
              </div>

              <div className="text-[11px] font-semibold text-slate-500">
                View Sweep Ledger
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modals for each step */}
      <Gfr12AModal
        isOpen={selectedStepModal === '1'}
        onClose={() => setSelectedStepModal(null)}
      />

      <CaAuditReportModal
        isOpen={selectedStepModal === '2'}
        onClose={() => setSelectedStepModal(null)}
      />

      <UnspentSweepModal
        isOpen={selectedStepModal === '3'}
        onClose={() => setSelectedStepModal(null)}
      />
    </>
  );
};

export default CSRClosureReporting;
