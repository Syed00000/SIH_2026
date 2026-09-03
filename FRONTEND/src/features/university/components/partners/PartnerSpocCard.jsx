import React from 'react';
import { Mail, Phone } from 'lucide-react';

export const PartnerSpocCard = ({ spoc }) => {
  if (!spoc) return null;

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-3">
      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
        Official Corporate SPOC / Nodal Contact
      </span>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase">SPOC Name & Role</span>
          <p className="text-xs font-black text-slate-900">{spoc.name}</p>
          <p className="text-[11px] text-[#007A61] font-bold">{spoc.role}</p>
        </div>

        <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-1.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Direct Channels</span>
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-700">
            <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <a href={`mailto:${spoc.email}`} className="hover:text-[#007A61] hover:underline truncate">
              {spoc.email}
            </a>
          </div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-700">
            <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <a href={`tel:${spoc.phone}`} className="hover:text-[#007A61] hover:underline">
              {spoc.phone}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnerSpocCard;
