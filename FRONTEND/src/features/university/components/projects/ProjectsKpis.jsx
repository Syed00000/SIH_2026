import React from 'react';
import { ClipboardList, TrendingUp, Hourglass, CheckCircle2, Rocket } from 'lucide-react';

export const ProjectsKpis = ({ total = 0, inProgress = 0, planning = 0, completed = 0, deployed = 0, loading = false }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="bg-white border border-slate-200/90 p-4 animate-pulse rounded-2xl shadow-2xs">
            <div className="h-3 bg-slate-200 rounded w-20 mb-2" />
            <div className="h-6 bg-slate-200 rounded w-12 mb-1" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5 select-none">
      {/* Total */}
      <div className="bg-white border border-slate-200/90 p-4 flex items-center justify-between rounded-none shadow-2xs hover:border-emerald-200 transition-colors">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">Total Portfolio</span>
          <div className="text-2xl font-black text-slate-900 mt-0.5">{total}</div>
          <span className="text-[10.5px] text-[#007A61] font-semibold mt-0.5 block">Allocated Projects</span>
        </div>
        <div className="text-[#007A61] flex items-center justify-center shrink-0">
          <ClipboardList className="w-6 h-6" />
        </div>
      </div>

      {/* In Progress */}
      <div className="bg-white border border-slate-200/90 p-4 flex items-center justify-between rounded-none shadow-2xs hover:border-emerald-200 transition-colors">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">In Progress</span>
          <div className="text-2xl font-black text-slate-900 mt-0.5">{inProgress}</div>
          <span className="text-[10.5px] text-[#007A61] font-semibold mt-0.5 block">Active R&D Phase</span>
        </div>
        <div className="text-[#007A61] flex items-center justify-center shrink-0">
          <TrendingUp className="w-6 h-6" />
        </div>
      </div>

      {/* Planning */}
      <div className="bg-white border border-slate-200/90 p-4 flex items-center justify-between rounded-none shadow-2xs hover:border-emerald-200 transition-colors">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">Proposal Stage</span>
          <div className="text-2xl font-black text-slate-900 mt-0.5">{planning}</div>
          <span className="text-[10.5px] text-[#007A61] font-semibold mt-0.5 block">Budget & Proposal Pending</span>
        </div>
        <div className="text-[#007A61] flex items-center justify-center shrink-0">
          <Hourglass className="w-6 h-6" />
        </div>
      </div>

      {/* Completed */}
      <div className="bg-white border border-slate-200/90 p-4 flex items-center justify-between rounded-none shadow-2xs hover:border-emerald-200 transition-colors">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">Completed</span>
          <div className="text-2xl font-black text-slate-900 mt-0.5">{completed}</div>
          <span className="text-[10.5px] text-[#007A61] font-semibold mt-0.5 block">Handed Over to Govt</span>
        </div>
        <div className="text-[#007A61] flex items-center justify-center shrink-0">
          <CheckCircle2 className="w-6 h-6" />
        </div>
      </div>

      {/* Deployed */}
      <div className="bg-white border border-slate-200/90 p-4 flex items-center justify-between rounded-none shadow-2xs hover:border-emerald-200 transition-colors">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">🔒 Deployed</span>
          <div className="text-2xl font-black text-slate-900 mt-0.5">{deployed}</div>
          <span className="text-[10.5px] text-[#007A61] font-semibold mt-0.5 block">Govt Certified & Live</span>
        </div>
        <div className="text-[#007A61] flex items-center justify-center shrink-0">
          <Rocket className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};

export default ProjectsKpis;
