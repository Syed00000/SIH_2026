import React from 'react';
import { Building, Users, FileText, CheckCircle } from 'lucide-react';

export const AcademicStatsBanner = ({ stats = {} }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
      {/* Total HEIs */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-3.5 shadow-2xs relative overflow-hidden flex flex-col justify-between min-h-[92px]">
        <div className="flex justify-between items-start">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            Total HEIs
          </span>
          <div className="shrink-0">
            <Building className="w-4 h-4 text-[#007A61]" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline">
          <span className="text-xl font-extrabold text-slate-900 tracking-tight">{stats.totalHeis ?? 0}</span>
          <span className="text-[9.5px] text-slate-500 font-semibold ml-2">
            Accredited Institutions
          </span>
        </div>
      </div>

      {/* Active Project Teams */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-3.5 shadow-2xs relative overflow-hidden flex flex-col justify-between min-h-[92px]">
        <div className="flex justify-between items-start">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            Active Project Teams
          </span>
          <div className="shrink-0">
            <Users className="w-4 h-4 text-emerald-600" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline">
          <span className="text-xl font-extrabold text-slate-900 tracking-tight">{stats.activeTeams ?? 0}</span>
          <span className="text-[9.5px] text-emerald-600 font-semibold ml-2">
            Active In-Progress
          </span>
        </div>
      </div>

      {/* Problems Assigned */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-3.5 shadow-2xs relative overflow-hidden flex flex-col justify-between min-h-[92px]">
        <div className="flex justify-between items-start">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            Problems Assigned
          </span>
          <div className="shrink-0">
            <FileText className="w-4 h-4 text-violet-600" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline">
          <span className="text-xl font-extrabold text-slate-900 tracking-tight">{stats.problemsAssigned ?? 0}</span>
          <span className="text-[9.5px] text-slate-500 font-semibold ml-2">
            Allocated to Teams
          </span>
        </div>
      </div>

      {/* Solutions Submitted */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-3.5 shadow-2xs relative overflow-hidden flex flex-col justify-between min-h-[92px]">
        <div className="flex justify-between items-start">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            Solutions Submitted
          </span>
          <div className="shrink-0">
            <CheckCircle className="w-4 h-4 text-amber-600" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline">
          <span className="text-xl font-extrabold text-slate-900 tracking-tight">{stats.solutionsSubmitted ?? 0}</span>
          <span className="text-[9.5px] text-emerald-600 font-semibold ml-2">
            Resolved & Deployed
          </span>
        </div>
      </div>
    </div>
  );
};

export default AcademicStatsBanner;
