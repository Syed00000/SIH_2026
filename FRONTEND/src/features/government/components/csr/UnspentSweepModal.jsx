import React from 'react';
import { X, RefreshCcw, ShieldCheck } from 'lucide-react';
import { MOCK_CLOSURE_STEPS } from '../../data/mockCsrLifecycleData.js';

export const UnspentSweepModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  const sweepData = MOCK_CLOSURE_STEPS[2];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 select-none animate-fadeIn">
      <div className="bg-white rounded-lg max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-white">
          <div className="flex items-center space-x-2.5">
            <RefreshCcw className="w-5 h-5 text-slate-900 shrink-0" />
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900">Statutory Unspent Fund Sweep Protocol</h3>
              <p className="text-xs text-slate-500 font-normal">Automatic 30-Day Zero-Leakage Capital Return to State Corpus</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-md border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-900 cursor-pointer"
          >
            <X className="w-4 h-4 text-slate-900" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs bg-white">
          <div className="p-4 bg-white border border-slate-200 rounded-lg space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 text-xs uppercase tracking-wider">Sweep Ledger Transaction</span>
              <span className="font-mono text-[11px] font-semibold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                {sweepData.status}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs pt-1 border-t border-slate-100">
              <div>
                <span className="text-slate-500 block text-[10.5px] font-semibold uppercase">Sweep Reference</span>
                <span className="font-mono font-bold text-slate-900 text-[11.5px]">{sweepData.sweepRef}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10.5px] font-semibold uppercase">Swept Amount</span>
                <span className="font-mono font-bold text-slate-900 text-[11.5px]">{sweepData.sweptAmount}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10.5px] font-semibold uppercase">Execution Date</span>
                <span className="font-mono font-semibold text-slate-900 text-[11.5px]">{sweepData.date}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10.5px] font-semibold uppercase">Destination Main Corpus</span>
                <span className="font-semibold text-slate-900 text-[11.5px]">{sweepData.destinationVault}</span>
              </div>
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-md flex items-start space-x-2 text-xs text-slate-700 leading-relaxed">
            <ShieldCheck className="w-4 h-4 text-slate-900 shrink-0 mt-0.5" />
            <span>In accordance with Ministry of Corporate Affairs Section 135(6) and State Public Finance Rules, any unspent grant at project closure is automatically swept back to prevent fund idling and financial leakage.</span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-200 bg-white flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-md text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white cursor-pointer shadow-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default UnspentSweepModal;
