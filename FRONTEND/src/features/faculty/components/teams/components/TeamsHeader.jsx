import React from 'react';
import { Users } from 'lucide-react';

export const TeamsHeader = () => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-200">
      <div>
        <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500 mb-1">
          <span>Faculty Research Node</span>
          <span>/</span>
          <span className="text-slate-900 font-bold">Student Research Team Management</span>
        </div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center space-x-2">
          <Users className="w-5 h-5 text-[#007A61]" />
          <span>Form & Name Student Research Teams</span>
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Assign custom team names, recruit student researchers from Ranchi University departments, and designate Team Leads.
        </p>
      </div>
    </div>
  );
};

export default TeamsHeader;
