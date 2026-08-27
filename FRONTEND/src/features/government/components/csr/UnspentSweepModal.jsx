import React from 'react';
import { X, RefreshCcw, CheckCircle2, ShieldCheck, Landmark } from 'lucide-react';
import { MOCK_CLOSURE_STEPS } from '../../data/mockCsrLifecycleData.js';

export const UnspentSweepModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  const sweepData = MOCK_CLOSURE_STEPS[2];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <RefreshCcw className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Statutory Unspent Fund Sweep Protocol</h3>
              <p className="text-[11px] text-slate-500 font-medium">Automatic 30-Day Zero-Leakage Capital Return to State Corpus</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-700 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs">
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 text-xs">Sweep Ledger Transaction</span>
              <span className="font-mono text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                {sweepData.status}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs pt-1">
              <div>
                <span className="text-slate-400 block text-[10.5px] font-bold">Sweep Reference</span>
                <span className="font-mono font-bold text-blue-600">{sweepData.sweepRef}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10.5px] font-bold">Swept Amount</span>
                <span className="font-mono font-bold text-emerald-700">{sweepData.sweptAmount}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10.5px] font-bold">Execution Date</span>
                <span className="font-mono font-semibold text-slate-800">{sweepData.date}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10.5px] font-bold">Destination Main Corpus</span>
                <span className="font-semibold text-slate-800">{sweepData.destinationVault}</span>
              </div>
            </div>
          </div>

          <div className="p-3.5 bg-blue-50/50 border border-blue-100 rounded-xl flex items-start space-x-2 text-[11px] text-blue-900 font-medium leading-relaxed">
            <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <span>In accordance with Ministry of Corporate Affairs Section 135(6) and State Public Finance Rules, any unspent grant at project closure is automatically swept back to prevent fund idling and financial leakage.</span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50/50 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default UnspentSweepModal;
