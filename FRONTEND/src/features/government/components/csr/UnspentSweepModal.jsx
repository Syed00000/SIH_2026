import React, { useState } from 'react';
import { X, Check, RotateCcw, ArrowDownLeft } from 'lucide-react';
import { CLOSURE_REPORTING_STEPS } from '../../data/csrConstants.js';

export const UnspentSweepModal = ({ isOpen, onClose }) => {
  const [sweepExecuted, setSweepExecuted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const sweepData = CLOSURE_REPORTING_STEPS[2];

  if (!isOpen) return null;

  const handleExecuteSweep = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setSweepExecuted(true);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-lg max-w-xl w-full border border-slate-200 shadow-xl overflow-hidden animate-scaleUp">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center space-x-2">
            <RotateCcw className="w-4 h-4 text-slate-900" />
            <h3 className="text-sm font-bold text-slate-900">
              Treasury Unspent Reverse-Sweep Rule
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 text-xs">
          <div className="bg-slate-50 border border-slate-200 rounded-md p-3.5 space-y-2">
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-slate-500 font-medium">Statutory Provision</span>
              <span className="font-bold text-slate-900">Rule 230(8) GFR 2017</span>
            </div>
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-slate-500 font-medium">Sweep Destination</span>
              <span className="font-bold text-slate-900">Consolidated State Escrow Fund (SBI)</span>
            </div>
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-slate-500 font-medium">Unspent Interest / Surplus</span>
              <span className="font-bold text-slate-900">₹ 0.00 (Zero Idle Balances)</span>
            </div>
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-slate-500 font-medium">Rule Status</span>
              <span className="font-bold text-slate-900">Automated Webhook Monitoring Active</span>
            </div>
          </div>

          {sweepExecuted && (
            <div className="bg-slate-50 border border-slate-200 rounded-md p-3.5 space-y-1">
              <div className="flex items-center space-x-2 font-bold text-slate-900 text-xs">
                <Check className="w-4 h-4 text-slate-900" />
                <span>Zero-Balance Sweep Re-verified</span>
              </div>
              <p className="text-[11px] text-slate-500 pl-6">
                All beneficiary sub-accounts verified clear of idle interest balances.
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-md border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-100 cursor-pointer shadow-xs"
          >
            Close
          </button>
          <button
            onClick={handleExecuteSweep}
            disabled={isProcessing}
            className="px-3.5 py-1.5 rounded-md bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center space-x-1.5 cursor-pointer shadow-xs"
          >
            <ArrowDownLeft className="w-3.5 h-3.5" />
            <span>{isProcessing ? 'Verifying Balances...' : 'Verify Zero Idle Balances'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UnspentSweepModal;
