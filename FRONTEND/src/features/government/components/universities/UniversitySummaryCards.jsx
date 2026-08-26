import React from 'react';
import { Building2, Clock } from 'lucide-react';

export const UniversitySummaryCards = ({ kpis = {}, total = 0 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 select-none">
      {/* Total Universities */}
      <div className="bg-white border border-slate-200/90 rounded-lg p-4 shadow-2xs flex flex-col justify-between min-h-[96px] hover:border-slate-300 transition-colors">
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            Total Universities
          </span>
          <div className="flex items-center justify-center text-blue-600">
            <Building2 className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2">
          <div className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {kpis.totalUniversities ?? total}
          </div>
          <span className="text-[11px] font-medium text-slate-400 block truncate mt-0.5">
            All Registered in DB
          </span>
        </div>
      </div>

      {/* Active Universities */}
      <div className="bg-white border border-slate-200/90 rounded-lg p-4 shadow-2xs flex flex-col justify-between min-h-[96px] hover:border-slate-300 transition-colors">
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            Active Universities
          </span>
          <div className="flex items-center justify-center text-emerald-600">
            <Building2 className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2">
          <div className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {kpis.activeUniversities ?? 0}
          </div>
          <span className="text-[11px] font-medium text-slate-400 block truncate mt-0.5">
            Active Platform Access
          </span>
        </div>
      </div>

      {/* Disabled Universities */}
      <div className="bg-white border border-slate-200/90 rounded-lg p-4 shadow-2xs flex flex-col justify-between min-h-[96px] hover:border-slate-300 transition-colors">
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            Disabled Universities
          </span>
          <div className="flex items-center justify-center text-red-600">
            <Building2 className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2">
          <div className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {kpis.disabledUniversities ?? 0}
          </div>
          <span className="text-[11px] font-medium text-slate-400 block truncate mt-0.5">
            Access Suspended
          </span>
        </div>
      </div>

      {/* Pending Approval */}
      <div className="bg-white border border-slate-200/90 rounded-lg p-4 shadow-2xs flex flex-col justify-between min-h-[96px] hover:border-slate-300 transition-colors">
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            Pending Approval
          </span>
          <div className="flex items-center justify-center text-amber-600">
            <Clock className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2">
          <div className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {kpis.pendingApproval ?? 0}
          </div>
          <span className="text-[11px] font-medium text-slate-400 block truncate mt-0.5">
            Awaiting Review
          </span>
        </div>
      </div>
    </div>
  );
};

export default UniversitySummaryCards;
