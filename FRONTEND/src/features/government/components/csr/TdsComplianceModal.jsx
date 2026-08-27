import React from 'react';
import { X, FileCheck, ShieldCheck, CheckCircle2, AlertCircle, Printer, Download } from 'lucide-react';

export const TdsComplianceModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <FileCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Tax Deducted at Source (TDS) Compliance Matrix</h3>
              <p className="text-[11px] text-slate-500 font-medium">Statutory Withholding Rules under Income Tax Act 1961 (Sections 194C & 194J)</p>
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
          {/* Rules Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-emerald-900 text-sm">Section 194C (2.0%)</span>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded">Active Withholding</span>
              </div>
              <p className="text-[11px] text-emerald-700 font-medium leading-relaxed">
                Applies to work contracts, laboratory rig fabrications, sensor hardware procurement, and equipment vendors.
              </p>
              <div className="text-[10.5px] font-mono text-emerald-800 pt-1">
                Threshold: Single &gt; ₹30,000 | Aggregate &gt; ₹1,00,000/yr
              </div>
            </div>

            <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-blue-900 text-sm">Section 194J (10.0%)</span>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-100 text-blue-800 rounded">Active Withholding</span>
              </div>
              <p className="text-[11px] text-blue-700 font-medium leading-relaxed">
                Applies to professional advisory, technical R&D consultancy, AI algorithm development, and third-party testing fees.
              </p>
              <div className="text-[10.5px] font-mono text-blue-800 pt-1">
                Threshold: Aggregate &gt; ₹30,000/yr per entity
              </div>
            </div>
          </div>

          {/* ITNS 281 Challan Deposit Status */}
          <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100 bg-white">
            <div className="p-3 bg-slate-50/60 flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wide">Monthly Challan ITNS 281 Reconciliation</span>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                100% On-Time Deposit
              </span>
            </div>
            <div className="p-3 flex items-center justify-between">
              <span className="text-slate-600 font-medium">TAN of Deductor</span>
              <span className="font-mono font-bold text-slate-900">PTND01928F (DHTE Jharkhand)</span>
            </div>
            <div className="p-3 flex items-center justify-between">
              <span className="text-slate-600 font-medium">Total TDS Deposited in FY 2026-27</span>
              <span className="font-mono font-bold text-slate-900">₹94,80,000</span>
            </div>
            <div className="p-3 flex items-center justify-between">
              <span className="text-slate-600 font-medium">Form 26AS Real-Time Matching</span>
              <span className="inline-flex items-center space-x-1 font-bold text-emerald-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Zero Mismatch / Fully Reconciled</span>
              </span>
            </div>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-start space-x-2 text-[11px] text-slate-600 font-medium leading-relaxed">
            <ShieldCheck className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
            <span>TDS is deducted automatically by the payment gateway smart contract prior to Escrow ledger disbursement. Form 16A certificates are auto-generated every quarter.</span>
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

export default TdsComplianceModal;
