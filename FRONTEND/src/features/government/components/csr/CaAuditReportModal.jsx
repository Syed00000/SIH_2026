import React, { useState } from 'react';
import { X, Check, ShieldCheck, Printer } from 'lucide-react';
import { CLOSURE_REPORTING_STEPS } from '../../data/csrConstants.js';

export const CaAuditReportModal = ({ isOpen, onClose }) => {
  const [isExporting, setIsExporting] = useState(false);
  const caData = CLOSURE_REPORTING_STEPS[1];

  if (!isOpen) return null;

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      window.print();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-lg max-w-xl w-full border border-slate-200 shadow-xl overflow-hidden animate-scaleUp">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-slate-900" />
            <h3 className="text-sm font-bold text-slate-900">
              Independent Statutory CA Audit Report
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
              <span className="text-slate-500 font-medium">Auditing CA Firm</span>
              <span className="font-bold text-slate-900">M/s Verma & Agrawal Chartered Accountants</span>
            </div>
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-slate-500 font-medium">Firm Registration No (FRN)</span>
              <span className="font-bold text-slate-900">008412C (ICAI Ranchi Chapter)</span>
            </div>
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-slate-500 font-medium">Unique Document ID (UDIN)</span>
              <span className="font-bold text-slate-900">26084123AAAAAA9912</span>
            </div>
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-slate-500 font-medium">Audit Opinion</span>
              <span className="font-bold text-slate-900">Unqualified Clean Audit (A-Grade)</span>
            </div>
          </div>

          <div className="border border-slate-200 rounded-md p-3.5 space-y-2 bg-white">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
              Statutory Auditor Statement
            </h4>
            <p className="text-[11px] text-slate-600 leading-relaxed font-normal">
              "We have audited the grant utilization statement of Ranchi University for Jharkhand Societal Innovation Hub R&D projects. In our opinion, the funds disbursed have been utilized strictly in conformity with GFR 2017 and State Department sanction guidelines."
            </p>
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
            onClick={handleExport}
            disabled={isExporting}
            className="px-3.5 py-1.5 rounded-md bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center space-x-1.5 cursor-pointer shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>{isExporting ? 'Generating PDF...' : 'Print Audit Statement'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CaAuditReportModal;
