import React from 'react';
import { CheckCircle2 } from 'lucide-react';

export const PartnerDomainBadges = ({ domains = [], supportModes = [] }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-2">
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
          Thematic Research Domains
        </span>
        <div className="flex flex-wrap gap-1.5">
          {domains.map((d, i) => (
            <span key={i} className="px-2.5 py-1 bg-emerald-50 border border-emerald-200 text-[#007A61] text-[11px] font-bold rounded-lg">
              {d}
            </span>
          ))}
        </div>
      </div>

      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-2">
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
          Support Modes Offered
        </span>
        <div className="flex flex-wrap gap-1.5">
          {supportModes.map((s, i) => (
            <span key={i} className="px-2.5 py-1 bg-blue-50 border border-blue-200 text-blue-800 text-[11px] font-bold rounded-lg flex items-center space-x-1">
              <CheckCircle2 className="w-3 h-3 text-blue-600 shrink-0" />
              <span>{s}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PartnerDomainBadges;
