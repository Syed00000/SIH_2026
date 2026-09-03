import React from 'react';
import { FileDown } from 'lucide-react';

export const CSRLifecycleHeader = ({ sourceFilter, setSourceFilter, onExportAudit }) => {
  return (
    <div className="bg-white rounded-md p-5 sm:p-6 border border-slate-200 shadow-3xs flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
          End-to-End Fund Flow & Payment Process Lifecycle
        </h1>
        <p className="text-xs md:text-sm text-slate-500 font-medium mt-1 leading-relaxed">
          Master ledger tracking across Schedule VII compliance, multi-tier vetting, and automated disbursement gateways.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3 shrink-0">
        <div className="flex items-center space-x-1.5 bg-white border border-slate-200 px-3 py-1.5 rounded-md text-xs shadow-xs">
          <span className="text-slate-400 font-bold text-[11px]">Source:</span>
          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="bg-transparent font-bold text-slate-800 outline-none cursor-pointer text-xs"
          >
            <option value="All Sources">All Sources (Corporate + Govt)</option>
            <option value="Corporate CSR">Corporate CSR Funds</option>
            <option value="Govt Grants">Government Grants</option>
            <option value="Joint Co-Funding">Joint Co-Funding</option>
          </select>
        </div>

        <button
          onClick={onExportAudit}
          className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-md text-xs font-bold text-slate-700 shadow-xs cursor-pointer transition-colors"
          title="Download Comprehensive Statutory Audit PDF"
        >
          <FileDown className="w-3.5 h-3.5 text-slate-600" />
          <span>Export Audit Log</span>
        </button>

        <div className="px-3.5 py-1.5 bg-white border border-slate-200 rounded-md text-xs font-bold text-slate-900 shadow-xs whitespace-nowrap">
          Audit Active: 2026-27
        </div>
      </div>
    </div>
  );
};

export default CSRLifecycleHeader;
