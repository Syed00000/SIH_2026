import React, { useState } from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { CLOSURE_REPORTING_STEPS } from '../../data/csrConstants.js';
import { Gfr12AModal } from './Gfr12AModal.jsx';
import { CaAuditReportModal } from './CaAuditReportModal.jsx';
import { UnspentSweepModal } from './UnspentSweepModal.jsx';

export const CSRClosureReporting = () => {
  const [activeModal, setActiveModal] = useState(null);

  const handleStepAction = (idx) => {
    if (idx === 0) setActiveModal('gfr12a');
    else if (idx === 1) setActiveModal('caAudit');
    else if (idx === 2) setActiveModal('unspentSweep');
  };

  return (
    <>
      <div className="bg-white rounded-lg p-5 border border-slate-200 shadow-xs space-y-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 tracking-wider uppercase">
              Financial Closure & Statutory Reporting
            </h3>
            <p className="text-xs text-slate-500 font-normal mt-0.5">
              Statutory verification pipeline for grant completion, final UC audit, and unspent fund sweeps.
            </p>
          </div>
        </div>

        {/* 3 Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {CLOSURE_REPORTING_STEPS.map((item, idx) => (
            <div
              key={item.id}
              onClick={() => handleStepAction(idx)}
              className="p-4 rounded-lg border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/50 transition-all flex flex-col justify-between space-y-3 cursor-pointer shadow-3xs group"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Step 0{idx + 1}
                  </span>
                  <span className="text-[10.5px] font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md">
                    {item.status}
                  </span>
                </div>

                <h4 className="text-xs font-bold text-slate-900 leading-snug group-hover:text-slate-800">
                  {item.title}
                </h4>

                <p className="text-[11px] text-slate-500 leading-relaxed font-normal">
                  {item.desc}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-900">
                <span>Inspect Certificate & Logs</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <Gfr12AModal
        isOpen={activeModal === 'gfr12a'}
        onClose={() => setActiveModal(null)}
      />
      <CaAuditReportModal
        isOpen={activeModal === 'caAudit'}
        onClose={() => setActiveModal(null)}
      />
      <UnspentSweepModal
        isOpen={activeModal === 'unspentSweep'}
        onClose={() => setActiveModal(null)}
      />
    </>
  );
};

export default CSRClosureReporting;
