import React from 'react';
import { Building2, Handshake, Clock, TrendingUp } from 'lucide-react';

export const PartnersKpis = ({
  total = 0,
  active = 0,
  pending = 0,
  completed = 0,
  loading = false
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white border border-slate-200/90 rounded-2xl p-4 animate-pulse shadow-2xs">
            <div className="h-3 bg-slate-200 rounded w-24 mb-3" />
            <div className="h-7 bg-slate-200 rounded w-16 mb-2" />
            <div className="h-2 bg-slate-100 rounded w-32" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 select-none">
      {/* 1. Total Partners */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 flex items-center justify-between shadow-2xs hover:border-[#007A61]/30 transition-colors">
        <div className="space-y-1">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
            Total Partners
          </span>
          <div className="text-2xl font-black text-slate-900">{total}</div>
          <span className="text-[11px] text-slate-500 font-semibold block">
            Govt Verified DB
          </span>
        </div>
        <div className="w-11 h-11 rounded-xl bg-slate-50 border border-slate-200/80 text-[#007A61] flex items-center justify-center shrink-0 shadow-2xs">
          <Building2 className="w-5 h-5" />
        </div>
      </div>

      {/* 2. Active Collaborations */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 flex items-center justify-between shadow-2xs hover:border-[#007A61]/30 transition-colors">
        <div className="space-y-1">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
            Active Collaborations
          </span>
          <div className="text-2xl font-black text-slate-900">{active}</div>
          <span className="text-[11px] text-emerald-700 font-semibold block">
            Signed MoUs &amp; Grants
          </span>
        </div>
        <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-200 text-[#007A61] flex items-center justify-center shrink-0 shadow-2xs">
          <Handshake className="w-5 h-5" />
        </div>
      </div>

      {/* 3. Requests Dispatched */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 flex items-center justify-between shadow-2xs hover:border-[#007A61]/30 transition-colors">
        <div className="space-y-1">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
            Requests Dispatched
          </span>
          <div className="text-2xl font-black text-slate-900">{pending}</div>
          <span className="text-[11px] text-slate-500 font-semibold block">
            Under Evaluation
          </span>
        </div>
        <div className="w-11 h-11 rounded-xl bg-slate-50 border border-slate-200/80 text-amber-600 flex items-center justify-center shrink-0 shadow-2xs">
          <Clock className="w-5 h-5" />
        </div>
      </div>

      {/* 4. CSR Capital Pool */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 flex items-center justify-between shadow-2xs hover:border-[#007A61]/30 transition-colors">
        <div className="space-y-1">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
            CSR Capital Pool
          </span>
          <div className="text-2xl font-black text-slate-900">₹ 2.4 Cr</div>
          <span className="text-[11px] text-emerald-700 font-semibold block">
            R&amp;D Grant Fund
          </span>
        </div>
        <div className="w-11 h-11 rounded-xl bg-slate-50 border border-slate-200/80 text-[#007A61] flex items-center justify-center shrink-0 shadow-2xs">
          <TrendingUp className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};

export default PartnersKpis;
