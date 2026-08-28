import React from 'react';
import { Building2, Handshake, Clock, Briefcase } from 'lucide-react';

export const PartnersKpis = ({
  total = 42,
  active = 18,
  pending = 9,
  completed = 15,
  loading = false
}) => {
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
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block">Total Partners</span>
          <div className="text-xl font-black text-slate-900 mt-0.5">{total}</div>
          <span className="text-[10px] text-slate-500 font-medium mt-0.5 block">All registered</span>
        </div>
        <div className="w-8 h-8 rounded-none bg-slate-100 border border-slate-200 text-slate-800 flex items-center justify-center shrink-0">
          <Building2 className="w-4 h-4" />
        </div>
      </div>

      <div className="bg-white border border-slate-200 p-3 flex items-center justify-between rounded-none shadow-2xs">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block">Active Partners</span>
          <div className="text-xl font-black text-slate-900 mt-0.5">{active}</div>
          <span className="text-[10px] text-slate-600 font-bold mt-0.5 block">Currently collaborating</span>
        </div>
        <div className="w-8 h-8 rounded-none bg-slate-100 border border-slate-200 text-slate-900 flex items-center justify-center shrink-0">
          <Handshake className="w-4 h-4" />
        </div>
      </div>

      <div className="bg-white border border-slate-200 p-3 flex items-center justify-between rounded-none shadow-2xs">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block">Pending Requests</span>
          <div className="text-xl font-black text-slate-900 mt-0.5">{pending}</div>
          <span className="text-[10px] text-slate-600 font-bold mt-0.5 block">Awaiting response</span>
        </div>
        <div className="w-8 h-8 rounded-none bg-slate-100 border border-slate-200 text-slate-800 flex items-center justify-center shrink-0">
          <Clock className="w-4 h-4" />
        </div>
      </div>

      <div className="bg-white border border-slate-200 p-3 flex items-center justify-between rounded-none shadow-2xs">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block">Completed</span>
          <div className="text-xl font-black text-slate-900 mt-0.5">{completed}</div>
          <span className="text-[10px] text-slate-600 font-bold mt-0.5 block">Past collaborations</span>
        </div>
        <div className="w-8 h-8 rounded-none bg-slate-100 border border-slate-200 text-slate-900 flex items-center justify-center shrink-0">
          <Briefcase className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
};

export default PartnersKpis;
