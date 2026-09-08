import React from 'react';
import { Building2, Handshake, Clock, CheckCircle2, TrendingUp, Sparkles } from 'lucide-react';

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
      {/* Total Partners */}
      <div className="bg-white border border-slate-200/90 rounded-none p-4 flex items-center justify-between shadow-2xs hover:border-[#007A61]/40 transition-all">
        <div className="space-y-1">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
            Total Partners
          </span>
          <div className="text-2xl font-black text-slate-900">{total}</div>
          <span className="text-[11px] text-slate-500 font-semibold flex items-center space-x-1">
            <span>Govt Verified DB</span>
          </span>
        </div>
        <div className="text-[#007A61] flex items-center justify-center shrink-0">
          <Building2 className="w-6 h-6" />
        </div>
      </div>

      {/* Active Partners */}
      <div className="bg-white border border-slate-200/90 rounded-none p-4 flex items-center justify-between shadow-2xs hover:border-[#007A61]/40 transition-all">
        <div className="space-y-1">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
            Active Collaborations
          </span>
          <div className="text-2xl font-black text-[#007A61]">{active}</div>
          <span className="text-[11px] text-emerald-700 font-semibold flex items-center space-x-1">
            <span>Signed MoUs & Grants</span>
          </span>
        </div>
        <div className="text-[#007A61] flex items-center justify-center shrink-0">
          <Handshake className="w-6 h-6" />
        </div>
      </div>

      {/* Pending Requests */}
      <div className="bg-white border border-slate-200/90 rounded-none p-4 flex items-center justify-between shadow-2xs hover:border-amber-300 transition-all">
        <div className="space-y-1">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
            Requests Dispatched
          </span>
          <div className="text-2xl font-black text-amber-600">{pending}</div>
          <span className="text-[11px] text-amber-700 font-semibold flex items-center space-x-1">
            <span>Under Evaluation</span>
          </span>
        </div>
        <div className="text-amber-600 flex items-center justify-center shrink-0">
          <Clock className="w-6 h-6" />
        </div>
      </div>

      {/* CSR Impact */}
      <div className="bg-white border border-slate-200/90 rounded-none p-4 flex items-center justify-between shadow-2xs hover:border-[#007A61]/40 transition-all">
        <div className="space-y-1">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
            CSR Capital Pool
          </span>
          <div className="text-2xl font-black text-slate-900">₹ 2.4 Cr</div>
          <span className="text-[11px] text-[#007A61] font-semibold flex items-center space-x-1">
            <span>R&D Grant Fund</span>
          </span>
        </div>
        <div className="text-[#007A61] flex items-center justify-center shrink-0">
          <TrendingUp className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};

export default PartnersKpis;
