import React from 'react';
import { Building, ArrowRight, GraduationCap, ChevronRight } from 'lucide-react';

export const NodalInstitutionalAllocationCard = ({
  universities = [],
  challenges = [],
  onNavigateUniversities
}) => {
  const topUnis = universities.slice(0, 5);

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs flex flex-col justify-between space-y-4">
      <div>
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2">
            <GraduationCap className="w-4 h-4 text-[#047857] stroke-[2]" />
            <h3 className="text-sm font-extrabold text-slate-900">
              Accredited HEI Capacity & Problem Load
            </h3>
          </div>
          <button
            onClick={onNavigateUniversities}
            className="text-[11px] font-bold text-slate-700 hover:text-slate-900 flex items-center space-x-0.5 cursor-pointer"
          >
            <span>HEI Directory</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="divide-y divide-slate-100 mt-2">
          {topUnis.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-xs">
              <Building className="w-6 h-6 text-slate-300 mx-auto mb-1.5" />
              <p>No universities found in database.</p>
            </div>
          ) : (
            topUnis.map((uni) => {
              const assignedCount = challenges.filter((c) => {
                const assignedId = (c.assignedUniversity?.id || '').toUpperCase();
                const assignedName = (c.assignedUniversity?.name || '').toLowerCase();
                const uniCode = (uni.code || '').toUpperCase();
                const uniName = (uni.name || '').toLowerCase();
                return (
                  (assignedId && (assignedId === uniCode || uniCode.includes(assignedId))) ||
                  (assignedName && (assignedName.includes(uniName) || uniName.includes(assignedName)))
                );
              }).length;

              return (
                <div
                  key={uni.id || uni._id || uni.code}
                  onClick={onNavigateUniversities}
                  className="py-3 flex items-center justify-between gap-3 hover:bg-slate-50/70 p-2 rounded-xl transition-colors cursor-pointer group"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center space-x-2">
                      <h4 className="text-xs font-bold text-slate-900 group-hover:text-slate-800">
                        {uni.name}
                      </h4>
                      <span className="font-mono text-[10px] font-bold text-slate-600 bg-slate-100 px-1.5 py-0.2 rounded-full border border-slate-200">
                        {uni.code}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium">
                      {uni.district || 'Jharkhand'} &bull; {uni.universityType || 'State University'}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <div className="text-right">
                      <span className="text-xs font-black text-slate-900 block">
                        {assignedCount}
                      </span>
                      <span className="text-[10px] text-slate-500 font-medium block">
                        Allocated
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-200/70 flex items-center justify-between text-xs">
        <div className="flex items-center space-x-2">
          <Building className="w-4 h-4 text-[#047857] shrink-0" />
          <span className="font-semibold text-emerald-950">
            {universities.length} Verified Institutions participating across 24 Districts
          </span>
        </div>
        <button
          onClick={onNavigateUniversities}
          className="text-emerald-950 font-bold hover:underline shrink-0 text-[11px] cursor-pointer"
        >
          Manage All
        </button>
      </div>
    </div>
  );
};

export default NodalInstitutionalAllocationCard;
