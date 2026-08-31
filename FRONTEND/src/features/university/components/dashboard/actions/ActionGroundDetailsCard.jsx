import React from 'react';
import { MapPin, ShieldCheck, GraduationCap } from 'lucide-react';

export const ActionGroundDetailsCard = ({ challenge }) => {
  const loc = challenge.location || challenge.locationDetails || {};
  const district = loc.district || challenge.district || 'Ranchi';
  const state = loc.state || 'Jharkhand';
  const subDivision = loc.subDivision || loc.block || `${district} Sub-Division`;
  const panchayat = loc.panchayatOrWard || loc.gramPanchayat || loc.ward || 'Gram Panchayat Ward 4';
  const landmark = loc.landmark || 'Near Primary Health Centre / High School';
  const pincode = loc.pincode || '834001';
  const coordinates = loc.coordinates || '23.3441° N, 85.3096° E';
  const assignedUni = challenge.assignedUniversity?.name || challenge.universityName || 'Ranchi University';
  const assignedDept = challenge.assignedUniversity?.department || challenge.assignedFaculty?.department || 'Department of Applied Sciences & Engineering';

  return (
    <div className="space-y-3.5">
      <div>
        <h3 className="text-base font-black text-slate-900 leading-snug">{challenge.title}</h3>
        <div className="flex flex-wrap items-center gap-1 text-[11px] text-slate-500 font-medium mt-1">
          <span className="flex items-center space-x-1 text-slate-700 font-semibold">
            <MapPin className="w-3 h-3 text-[#007A61]" />
            <span>{district}, {state}</span>
          </span>
          <span>&bull;</span>
          <span>Domain: <strong className="text-slate-700">{challenge.domain}</strong></span>
        </div>
      </div>

      <div className="p-3.5 bg-white border border-slate-200/90 rounded-2xl shadow-2xs space-y-2">
        <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">
          Ground Location & Submitter
        </span>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-400 font-bold block text-[10px] uppercase">Gram Panchayat / Block</span>
            <span className="font-bold text-slate-800 text-xs block mt-0.5">{panchayat} • {subDivision}</span>
          </div>
          <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-400 font-bold block text-[10px] uppercase">Ground Landmark</span>
            <span className="font-bold text-slate-800 text-xs block mt-0.5">{landmark}</span>
          </div>
          <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-400 font-bold block text-[10px] uppercase">Citizen Submitter</span>
            <span className="font-bold text-[#007A61] text-xs flex items-center space-x-1 mt-0.5">
              <ShieldCheck className="w-3 h-3" />
              <span>Verified Citizen</span>
            </span>
          </div>
          <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-400 font-bold block text-[10px] uppercase">PIN Code & GPS</span>
            <span className="font-mono font-bold text-slate-800 text-xs block mt-0.5">{pincode} • {coordinates}</span>
          </div>
        </div>
      </div>

      <div className="p-3.5 bg-white border border-slate-200/90 rounded-2xl shadow-2xs space-y-1">
        <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">
          Ground Problem Statement
        </span>
        <p className="text-xs text-slate-800 leading-relaxed font-normal">
          {challenge.problemStatement || challenge.description || 'Ground issue logged by citizen under Jharkhand State Innovation Hub.'}
        </p>
      </div>

      <div className="p-3.5 bg-white border border-slate-200/90 rounded-2xl shadow-2xs space-y-1.5">
        <div className="flex items-center space-x-1.5 text-slate-900 font-bold text-xs">
          <GraduationCap className="w-4 h-4 text-[#007A61]" />
          <span>Allocated Institution: <strong className="text-[#007A61]">{assignedUni}</strong></span>
        </div>
        <div className="text-[11px] text-slate-600">
          Allocated Department: <strong className="text-slate-800">{assignedDept}</strong>
        </div>
      </div>
    </div>
  );
};

export default ActionGroundDetailsCard;
