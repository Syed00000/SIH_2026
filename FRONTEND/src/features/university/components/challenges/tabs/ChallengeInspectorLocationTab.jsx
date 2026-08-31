import React from 'react';
import { MapPin, Compass } from 'lucide-react';

export const ChallengeInspectorLocationTab = ({ challenge }) => {
  const loc = challenge.location || challenge.locationDetails || {};
  const state = loc.state || 'Jharkhand';
  const district = loc.district || challenge.district || 'Ranchi';
  const block = loc.block || 'Sadar Block';
  const subDivision = loc.subDivision || loc.block || `${district} Sub-Division`;
  const panchayat = loc.panchayatOrWard || loc.gramPanchayat || loc.ward || 'Gram Panchayat Ward 4';
  const landmark = loc.landmark || 'Near Primary Health Centre / High School';
  const fullAddress = loc.fullAddress || `${panchayat}, ${landmark}, ${subDivision}, ${district}, ${state} - ${loc.pincode || '834001'}`;
  const coordinates = loc.coordinates || '23.3441° N, 85.3096° E';
  const pincode = loc.pincode || '834001';

  return (
    <div className="space-y-3 text-xs text-slate-700 text-left">
      <div className="p-4 bg-white border border-slate-200/90 rounded-2xl shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center space-x-2 text-slate-900 font-extrabold text-sm">
            <MapPin className="w-4 h-4 text-[#007A61] shrink-0" />
            <span>{district}, {state}</span>
          </div>
          <span className="text-[10px] font-bold bg-emerald-50 text-[#007A61] border border-emerald-200 px-2.5 py-0.5 rounded-full">
            Ground Geotagged
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
          <div className="bg-slate-50/70 p-2.5 rounded-xl border border-slate-100">
            <span className="text-slate-400 font-bold block text-[10px] uppercase tracking-wider">Sub-Division / Block</span>
            <span className="font-bold text-slate-800 text-xs mt-0.5 block">{subDivision} • {block}</span>
          </div>

          <div className="bg-slate-50/70 p-2.5 rounded-xl border border-slate-100">
            <span className="text-slate-400 font-bold block text-[10px] uppercase tracking-wider">Gram Panchayat / Ward</span>
            <span className="font-bold text-slate-800 text-xs mt-0.5 block">{panchayat}</span>
          </div>

          <div className="bg-slate-50/70 p-2.5 rounded-xl border border-slate-100">
            <span className="text-slate-400 font-bold block text-[10px] uppercase tracking-wider">Ground Landmark</span>
            <span className="font-bold text-slate-800 text-xs mt-0.5 block">{landmark}</span>
          </div>

          <div className="bg-slate-50/70 p-2.5 rounded-xl border border-slate-100">
            <span className="text-slate-400 font-bold block text-[10px] uppercase tracking-wider">Postal PIN Code</span>
            <span className="font-mono font-bold text-slate-800 text-xs mt-0.5 block">{pincode}</span>
          </div>

          <div className="bg-slate-50/70 p-2.5 rounded-xl border border-slate-100 sm:col-span-2">
            <span className="text-slate-400 font-bold block text-[10px] uppercase tracking-wider">GPS Coordinates</span>
            <div className="flex items-center space-x-1.5 mt-0.5">
              <Compass className="w-3.5 h-3.5 text-[#007A61]" />
              <span className="font-mono font-bold text-[#007A61] text-xs">{coordinates}</span>
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Complete Ground Address
          </span>
          <p className="text-xs text-slate-800 bg-emerald-50/30 p-3 rounded-xl border border-emerald-100 leading-relaxed font-medium">
            {fullAddress}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChallengeInspectorLocationTab;
