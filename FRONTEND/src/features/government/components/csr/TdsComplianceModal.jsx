import React from 'react';
import { X, FileCheck, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const TdsComplianceModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 select-none animate-fadeIn">
      <div className="bg-white rounded-lg max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-white">
          <div className="flex items-center space-x-2.5">
            <FileCheck className="w-5 h-5 text-slate-900 shrink-0" />
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900">Tax Deducted at Source (TDS) Compliance Matrix</h3>
              <p className="text-xs text-slate-500 font-normal">Statutory Withholding Rules under Income Tax Act 1961 (Sections 194C & 194J)</p>
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
          {/* Rules Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-4 bg-white border border-slate-200 rounded-lg space-y-2 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-sm">Section 194C (2.0%)</span>
                <span className="text-[10.5px] font-semibold px-2 py-0.5 bg-slate-100 text-slate-900 rounded border border-slate-200">Active</span>
              </div>
              <p className="text-xs text-slate-600 font-normal leading-relaxed">
                Applies to work contracts, laboratory rig fabrications, sensor hardware procurement, and equipment vendors.
              </p>
              <div className="text-[11px] font-mono text-slate-700 pt-1 border-t border-slate-100">
                Threshold: Single &gt; ₹30,000 | Aggregate &gt; ₹1,00,000/yr
              </div>
            </div>

            <div className="p-4 bg-white border border-slate-200 rounded-lg space-y-2 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-sm">Section 194J (10.0%)</span>
                <span className="text-[10.5px] font-semibold px-2 py-0.5 bg-slate-100 text-slate-900 rounded border border-slate-200">Active</span>
              </div>
              <p className="text-xs text-slate-600 font-normal leading-relaxed">
                Applies to professional advisory, technical R&D consultancy, AI algorithm development, and third-party testing fees.
              </p>
              <div className="text-[11px] font-mono text-slate-700 pt-1 border-t border-slate-100">
                Threshold: Aggregate &gt; ₹30,000/yr per entity
              </div>
            </div>
          </div>

          {/* ITNS 281 Challan Deposit Status */}
          <div className="border border-slate-200 rounded-lg overflow-hidden divide-y divide-slate-100 bg-white shadow-xs">
            <div className="p-3 bg-slate-50 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">Challan ITNS 281 Reconciliation</span>
              <span className="text-[10.5px] font-semibold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                100% On-Time Deposit
              </span>
            </div>
            <div className="p-3 flex items-center justify-between">
              <span className="text-slate-500 font-medium">TAN of Deductor</span>
              <span className="font-mono font-bold text-slate-900">PTND01928F (DHTE Jharkhand)</span>
            </div>
            <div className="p-3 flex items-center justify-between">
              <span className="text-slate-500 font-medium">Total TDS Deposited in FY 2026-27</span>
              <span className="font-mono font-bold text-slate-900">₹94,80,000</span>
            </div>
            <div className="p-3 flex items-center justify-between">
              <span className="text-slate-500 font-medium">Form 26AS Real-Time Matching</span>
              <span className="inline-flex items-center space-x-1.5 font-bold text-slate-900">
                <CheckCircle2 className="w-3.5 h-3.5 text-slate-900" />
                <span>Zero Mismatch / Fully Reconciled</span>
              </span>
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-md flex items-start space-x-2 text-[11px] text-slate-700 leading-relaxed">
            <ShieldCheck className="w-4 h-4 text-slate-900 shrink-0 mt-0.5" />
            <span>TDS is deducted automatically by the payment gateway smart contract prior to Escrow ledger disbursement. Form 16A certificates are auto-generated every quarter.</span>
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

export default TdsComplianceModal;
