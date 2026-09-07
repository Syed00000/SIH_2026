import React from 'react';
import { FileText, Building2 } from 'lucide-react';

export const ProposalHeader = ({ faculty }) => {
  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div>
        <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500 mb-1">
          <span>Faculty Research Node</span>
          <span>/</span>
          <span className="text-slate-900 font-bold">Solution Proposal & Line-Item Budget Builder</span>
        </div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center space-x-2">
          <FileText className="w-5 h-5 text-[#007A61]" />
          <span>R&D Grant Proposal & Roadmap Builder</span>
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Formulate technical methodology, milestone stages, and itemized line-item budgets for University and Government sanction review.
        </p>
      </div>

      <div className="flex items-center space-x-2">
        <div className="px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-[#007A61] flex items-center space-x-1.5">
          <Building2 className="w-3.5 h-3.5" />
          <span>{faculty?.department || 'Engineering Lab'}</span>
        </div>
      </div>
    </div>
  );
};

export default ProposalHeader;
