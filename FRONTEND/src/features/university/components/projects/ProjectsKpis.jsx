import React from 'react';
import { ClipboardList, TrendingUp, Hourglass, CheckCircle2 } from 'lucide-react';

export const ProjectsKpis = ({ total = 28, inProgress = 14, planning = 6, completed = 8, loading = false }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white border border-slate-200 p-3 animate-pulse rounded-none">
            <div className="h-3 bg-slate-200 w-20 mb-2" />
            <div className="h-6 bg-slate-200 w-12 mb-1" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 select-none">
      <div className="bg-white border border-slate-200 p-3 flex items-center justify-between rounded-none shadow-2xs">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block">Total Projects</span>
          <div className="text-xl font-black text-slate-900 mt-0.5">{total}</div>
          <span className="text-[10px] text-slate-500 font-medium mt-0.5 block">Active R&D Record</span>
        </div>
        <div className="w-8 h-8 rounded-none bg-slate-100 border border-slate-200 text-slate-800 flex items-center justify-center shrink-0">
          <ClipboardList className="w-4 h-4" />
        </div>
      </div>

      <div className="bg-white border border-slate-200 p-3 flex items-center justify-between rounded-none shadow-2xs">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block">In Progress</span>
          <div className="text-xl font-black text-slate-900 mt-0.5">{inProgress}</div>
          <span className="text-[10px] text-slate-600 font-bold mt-0.5 block">Ongoing Field R&D</span>
        </div>
        <div className="w-8 h-8 rounded-none bg-slate-100 border border-slate-200 text-slate-900 flex items-center justify-center shrink-0">
          <TrendingUp className="w-4 h-4" />
        </div>
      </div>

      <div className="bg-white border border-slate-200 p-3 flex items-center justify-between rounded-none shadow-2xs">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block">Planning</span>
          <div className="text-xl font-black text-slate-900 mt-0.5">{planning}</div>
          <span className="text-[10px] text-slate-600 font-bold mt-0.5 block">Proposal Stage</span>
        </div>
        <div className="w-8 h-8 rounded-none bg-slate-100 border border-slate-200 text-slate-800 flex items-center justify-center shrink-0">
          <Hourglass className="w-4 h-4" />
        </div>
      </div>

      <div className="bg-white border border-slate-200 p-3 flex items-center justify-between rounded-none shadow-2xs">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block">Completed</span>
          <div className="text-xl font-black text-slate-900 mt-0.5">{completed}</div>
          <span className="text-[10px] text-slate-600 font-bold mt-0.5 block">Verified & Archived</span>
        </div>
        <div className="w-8 h-8 rounded-none bg-slate-100 border border-slate-200 text-slate-900 flex items-center justify-center shrink-0">
          <CheckCircle2 className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
};

export default ProjectsKpis;
