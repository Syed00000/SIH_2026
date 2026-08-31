import React, { useState } from 'react';
import { X, Check, FileCheck, ArrowRight, Printer } from 'lucide-react';
import { CLOSURE_REPORTING_STEPS } from '../../data/csrConstants.js';

export const Gfr12AModal = ({ isOpen, onClose }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const gfrData = CLOSURE_REPORTING_STEPS[0];

  if (!isOpen) return null;

  const handleDownload = () => {
    setIsDownloading(true);
    setTimeout(() => {
      setIsDownloading(false);
      window.print();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-lg max-w-xl w-full border border-slate-200 shadow-xl overflow-hidden animate-scaleUp">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center space-x-2">
            <FileCheck className="w-4 h-4 text-slate-900" />
            <h3 className="text-sm font-bold text-slate-900">
              Form GFR 12-A Statutory Utilization Certificate
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
              <span className="text-slate-500 font-medium">Statutory Rule Reference</span>
              <span className="font-bold text-slate-900">Rule 238(1) GFR 2017</span>
            </div>
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-slate-500 font-medium">Beneficiary HEI</span>
              <span className="font-bold text-slate-900">Ranchi University Innovation Node</span>
            </div>
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-slate-500 font-medium">Total Sanctioned Grant</span>
              <span className="font-bold text-slate-900">₹ 2,00,000</span>
            </div>
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-slate-500 font-medium">Certified Utilization Amount</span>
              <span className="font-bold text-slate-900">₹ 2,00,000 (100% Utilized)</span>
            </div>
          </div>

          <div className="border border-slate-200 rounded-md p-3.5 space-y-2 bg-white">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
              Statutory Officer Sign-Off & Verification
            </h4>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2 bg-slate-50 rounded-md border border-slate-100">
                <span className="text-slate-500 block text-[10px]">Finance Officer Sign:</span>
                <span className="font-bold text-slate-900">Shri R. K. Soren, FO (RU)</span>
                <span className="text-slate-400 block text-[9.5px]">Digital Signature Verified</span>
              </div>
              <div className="p-2 bg-slate-50 rounded-md border border-slate-100">
                <span className="text-slate-500 block text-[10px]">Lead Mentor Sign:</span>
                <span className="font-bold text-slate-900">Dr. Binod Kumar (RU001)</span>
                <span className="text-slate-400 block text-[9.5px]">Lab Milestone Audited</span>
              </div>
            </div>
          </div>
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
            onClick={handleDownload}
            disabled={isDownloading}
            className="px-3.5 py-1.5 rounded-md bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center space-x-1.5 cursor-pointer shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>{isDownloading ? 'Preparing Document...' : 'Print / Export Certificate'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Gfr12AModal;
