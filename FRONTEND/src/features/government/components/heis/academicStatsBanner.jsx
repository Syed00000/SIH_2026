import React from 'react';
import { Building, Users, FileText, CheckCircle, Award } from 'lucide-react';

export const AcademicStatsBanner = ({ stats = {} }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
      {/* Total HEIs */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-3.5 shadow-2xs relative overflow-hidden flex flex-col justify-between min-h-[92px]">
        <div className="flex justify-between items-start">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            Total HEIs
          </span>
          <div className="shrink-0">
            <Building className="w-4 h-4 text-blue-600" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline">
          <span className="text-xl font-extrabold text-slate-900 tracking-tight">{stats.totalHeis ?? 0}</span>
          <span className="text-[9px] text-emerald-600 font-bold ml-2 inline-flex items-center">
            +3 this month <span className="ml-0.5">↑</span>
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
          <span className="text-[9px] text-emerald-600 font-bold ml-2 inline-flex items-center">
            +12 this month <span className="ml-0.5">↑</span>
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
          <span className="text-[9px] text-emerald-600 font-bold ml-2 inline-flex items-center">
            +28 this month <span className="ml-0.5">↑</span>
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
          <span className="text-[9px] text-emerald-600 font-bold ml-2 inline-flex items-center">
            +19 this month <span className="ml-0.5">↑</span>
          </span>
        </div>
      </div>

      {/* NEP Credits Earned */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-3.5 shadow-2xs relative overflow-hidden flex flex-col justify-between min-h-[92px]">
        <div className="flex justify-between items-start">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            NEP 2020 Credits Earned
          </span>
          <div className="shrink-0">
            <Award className="w-4 h-4 text-indigo-600" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline">
          <span className="text-xl font-extrabold text-slate-900 tracking-tight">{(stats.creditsEarned ?? 0).toLocaleString()}</span>
          <span className="text-[9px] text-emerald-600 font-bold ml-2 inline-flex items-center">
            +1,250 this month <span className="ml-0.5">↑</span>
          </span>
        </div>
      </div>
    </div>
  );
};
export default AcademicStatsBanner;
