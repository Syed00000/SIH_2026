import React from 'react';
import { PlayCircle } from 'lucide-react';

export const ActiveProjectsHeader = () => {
  return (
    <div className="bg-white border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-xs">
      <div>
        <div className="flex items-center space-x-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
          <span className="flex items-center space-x-1">
            <PlayCircle className="w-3.5 h-3.5 text-[#007A61]" />
            <span>Projects & Solutions</span>
          </span>
          <span>•</span>
          <span className="text-slate-700">Execution Phase</span>
        </div>
        <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
          ACTIVE PROJECTS IN EXECUTION
        </h1>
        <p className="text-xs md:text-sm text-slate-500 font-medium mt-0.5">
          Track project implementation progress, verify field milestones, and sanction tranche releases across Jharkhand institutions.
        </p>
      </div>

      <div className="flex items-center space-x-2.5">
        <a
          href="?tab=projects_proposals"
          className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xs transition-colors cursor-pointer flex items-center space-x-1.5 border border-slate-200"
        >
          <span>View Proposals Queue</span>
        </a>
      </div>
    </div>
  );
};

export default ActiveProjectsHeader;
