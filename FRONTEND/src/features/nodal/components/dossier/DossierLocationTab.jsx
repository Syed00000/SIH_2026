import React from 'react';
import { MapPin, Navigation, ExternalLink } from 'lucide-react';

export const DossierLocationTab = ({ fullAddress, district, block, panchayat, landmark, coordinates }) => {
  return (
    <div className="space-y-4">
      <div className="p-4 bg-slate-50 border border-slate-200/90 rounded-lg space-y-3">
        <div className="flex items-center space-x-2 text-slate-900 font-bold text-xs">
          <MapPin className="w-4 h-4 text-rose-500" />
          <span>Ground Geolocation & Administrative Mapping</span>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-white border border-slate-200/80 rounded-lg">
            <span className="text-[11px] text-slate-400 block font-medium">District</span>
            <span className="font-bold text-slate-900 text-sm">{district}</span>
          </div>

          <div className="p-3 bg-white border border-slate-200/80 rounded-lg">
            <span className="text-[11px] text-slate-400 block font-medium">Block / Tehsil</span>
            <span className="font-bold text-slate-900 text-sm">{block}</span>
          </div>

          <div className="p-3 bg-white border border-slate-200/80 rounded-lg">
            <span className="text-[11px] text-slate-400 block font-medium">Gram Panchayat / Ward</span>
            <span className="font-bold text-slate-900 text-sm">{panchayat}</span>
          </div>

          <div className="p-3 bg-white border border-slate-200/80 rounded-lg">
            <span className="text-[11px] text-slate-400 block font-medium">Local Landmark</span>
            <span className="font-bold text-slate-900 text-sm">{landmark}</span>
          </div>
        </div>

        <div className="p-3 bg-white border border-slate-200/80 rounded-lg flex items-center justify-between">
          <div className="space-y-0.5 text-xs">
            <span className="text-[11px] text-slate-400 font-medium block">GPS Coordinates:</span>
            <span className="font-mono font-bold text-slate-800">{coordinates}</span>
          </div>

          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1.5 bg-slate-100 hover:bg-[#047857] text-slate-800 hover:text-white text-xs font-bold px-3 py-1.5 rounded-md border border-slate-200 hover:border-[#047857] transition-all"
          >
            <span>Open in Google Maps</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default DossierLocationTab;
