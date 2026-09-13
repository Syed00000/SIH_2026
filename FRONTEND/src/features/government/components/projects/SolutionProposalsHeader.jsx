import React from 'react';
import { FileText, PlayCircle } from 'lucide-react';

export const SolutionProposalsHeader = () => {
  return (
    <div className="bg-white border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-xs">
      <div>
        <div className="flex items-center space-x-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
          <span className="flex items-center space-x-1">
            <FileText className="w-3.5 h-3.5 text-[#007A61]" />
            <span>Projects & Solutions</span>
          </span>
          <span>•</span>
          <span className="text-slate-700">Institutional Proposals</span>
        </div>
        <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
          SOLUTION PROPOSALS QUEUE
        </h1>
        <p className="text-xs md:text-sm text-slate-500 font-medium mt-0.5">
          Review institutional project proposals, scrutinize sanctioned budgets, and grant clearance for field execution across Jharkhand.
        </p>
      </div>

      <div className="flex items-center space-x-2.5">
        <a
          href="?tab=projects_active"
          className="px-4 py-2 text-xs font-bold text-white bg-[#007A61] hover:bg-[#00624e] rounded-xs transition-colors cursor-pointer flex items-center space-x-1.5 shadow-xs"
        >
          <PlayCircle className="w-4 h-4 text-emerald-100" />
          <span>View Active Projects</span>
        </a>
      </div>
    </div>
  );
};

export default SolutionProposalsHeader;
