import React from 'react';
import { FlaskConical, Sparkles } from 'lucide-react';

export const ProfileResearchFacilities = ({ researchAreas = [], facilities = [] }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-left">
      {/* Research Areas */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs space-y-3">
        <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <h3 className="text-sm font-extrabold text-slate-900">Key Research Strengths</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {researchAreas.map((area, idx) => (
            <span
              key={idx}
              className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/90 text-slate-800 text-xs font-bold"
            >
              {area}
            </span>
          ))}
        </div>
      </div>

      {/* Facilities & Labs */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs space-y-3">
        <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
          <FlaskConical className="w-4 h-4 text-[#007A61]" />
          <h3 className="text-sm font-extrabold text-slate-900">Core Labs & Innovation Facilities</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          {facilities.map((fac, idx) => (
            <div
              key={idx}
              className="p-2.5 bg-emerald-50/50 border border-emerald-200/70 rounded-xl font-bold text-emerald-950 flex items-center space-x-2"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-[#007A61] shrink-0" />
              <span className="truncate">{fac}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileResearchFacilities;
