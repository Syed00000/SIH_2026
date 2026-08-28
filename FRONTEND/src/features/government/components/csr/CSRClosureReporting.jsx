import React, { useState } from 'react';
import { CheckCircle2, ChevronRight } from 'lucide-react';
import { Gfr12AModal } from './Gfr12AModal.jsx';
import { CaAuditReportModal } from './CaAuditReportModal.jsx';
import { UnspentSweepModal } from './UnspentSweepModal.jsx';

const CLOSURE_STEPS = [
  { step: '1', title: 'GFR 12-A Utilization Certificate', desc: 'Statutory government compliance certifying project funds were spent for designated purposes.' },
  { step: '2', title: 'Chartered Accountant Audit Statement', desc: 'Third-party CA ledger audit certifying invoices, vouchers, and zero cash compliance.' },
  { step: '3', title: 'Unspent Grant Treasury Sweep', desc: 'Automatic sweep of residual grant funds back to state escrow node upon project closure.' }
];

export const CSRClosureReporting = () => {
  const [selectedStepModal, setSelectedStepModal] = useState(null);

  return (
    <>
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs space-y-4 select-none">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 tracking-wider uppercase">
              PHASE 7: STATUTORY PROJECT CLOSURE & REPORTING
            </h3>
            <p className="text-[11px] text-slate-500 font-medium mt-0.5">
              End-of-cycle compliance lifecycle and utilization certification checklist. Click steps to view certificates.
            </p>
          </div>

          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/80 shadow-2xs self-start sm:self-auto">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Status: Audit Cleared</span>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {CLOSURE_STEPS.map((item) => (
            <div
              key={item.step}
              onClick={() => setSelectedStepModal(item.step)}
              className="p-4 bg-slate-50/70 border border-slate-200/80 rounded-xl space-y-2.5 shadow-2xs hover:bg-slate-50 hover:border-slate-300 transition-all cursor-pointer group relative"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center shrink-0 border border-blue-200 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    {item.step}
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 leading-tight group-hover:text-blue-600 transition-colors">
                    {item.title}
                  </h4>
                </div>

                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </div>

              <p className="text-[11px] text-slate-500 font-medium leading-relaxed">{item.desc}</p>

              <div className="pt-1 text-[10.5px] font-bold text-blue-600 flex items-center space-x-1">
                <span>View {item.step === '1' ? 'GFR 12-A Certificate' : item.step === '2' ? 'CA Audit Statement' : 'Sweep Ledger'}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Gfr12AModal isOpen={selectedStepModal === '1'} onClose={() => setSelectedStepModal(null)} />
      <CaAuditReportModal isOpen={selectedStepModal === '2'} onClose={() => setSelectedStepModal(null)} />
      <UnspentSweepModal isOpen={selectedStepModal === '3'} onClose={() => setSelectedStepModal(null)} />
    </>
  );
};

export default CSRClosureReporting;
