import React from 'react';
import { MapPin } from 'lucide-react';

export const DossierLocationTab = ({ district, block, panchayat, landmark }) => {
  return (
    <div className="space-y-4">
      <div className="p-4 bg-slate-50 border border-slate-200/90 rounded-lg space-y-3">
        <div className="flex items-center space-x-2 text-slate-900 font-bold text-xs">
          <MapPin className="w-4 h-4 text-rose-500" />
          <span>Ground Administrative & Jurisdiction Details</span>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-white border border-slate-200/80 rounded-lg">
            <span className="text-[11px] text-slate-400 block font-medium">District</span>
            <span className="font-bold text-slate-900 text-sm">{district || 'Not specified'}</span>
          </div>

          <div className="p-3 bg-white border border-slate-200/80 rounded-lg">
            <span className="text-[11px] text-slate-400 block font-medium">Block / Tehsil</span>
            <span className="font-bold text-slate-900 text-sm">{block || 'Not specified'}</span>
          </div>

          <div className="p-3 bg-white border border-slate-200/80 rounded-lg">
            <span className="text-[11px] text-slate-400 block font-medium">Gram Panchayat / Ward</span>
            <span className="font-bold text-slate-900 text-sm">{panchayat || 'Not specified'}</span>
          </div>

          <div className="p-3 bg-white border border-slate-200/80 rounded-lg">
            <span className="text-[11px] text-slate-400 block font-medium">Local Landmark</span>
            <span className="font-bold text-slate-900 text-sm">{landmark || 'Not specified'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DossierLocationTab;

