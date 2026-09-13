import React from 'react';
import { Network, Building2, MapPin, Layers, Map } from 'lucide-react';

export const StateDepartmentHierarchyConfig = ({ department }) => {
  const hierarchyLevels = department.hierarchyConfig || [];

  const getIconForLevel = (level) => {
    switch(level) {
      case 'State Department': return <Building2 className="w-5 h-5 text-indigo-600" />;
      case 'District Department': return <Building2 className="w-5 h-5 text-blue-600" />;
      case 'Block / Tehsil Office': return <Layers className="w-5 h-5 text-orange-600" />;
      case 'Gram Panchayat':
      case 'Ward / Field Office': return <MapPin className="w-5 h-5 text-emerald-600" />;
      default: return <Map className="w-5 h-5 text-slate-600" />;
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Network className="w-5 h-5 text-[#007A61]" />
            Administrative Hierarchy Flow
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            The defined structural chain of command for this department across the state.
          </p>
        </div>
      </div>

      <div className="relative pt-4 pb-8 px-4">
        {/* Connecting Line */}
        <div className="absolute left-[39px] top-8 bottom-12 w-0.5 bg-slate-200"></div>

        <div className="space-y-8">
          {hierarchyLevels.map((level, index) => (
            <div key={level} className="relative flex items-start gap-6 group">
              <div className="relative z-10 w-12 h-12 rounded-2xl bg-white border-2 border-slate-200 flex items-center justify-center shrink-0 shadow-sm group-hover:border-[#007A61] group-hover:shadow-md transition-all">
                {getIconForLevel(level)}
                {index < hierarchyLevels.length - 1 && (
                  <div className="absolute -bottom-9 left-1/2 -translate-x-1/2 w-3 h-3 border-r-2 border-b-2 border-slate-300 rotate-45"></div>
                )}
              </div>
              
              <div className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-4 group-hover:border-slate-300 transition-colors">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-900">{level}</h4>
                  <span className="text-[10px] font-bold px-2 py-1 bg-white border border-slate-200 rounded-lg text-slate-500 uppercase tracking-wider">
                    Level {index + 1}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  {level === 'State Department' ? 'Apex level authority, policy making, and state-wide budget allocation.' :
                   level === 'District Department' ? 'District-level execution, nodal supervision, and localized fund management.' :
                   level === 'Block / Tehsil Office' ? 'Sub-district operational coordination and frontline service delivery.' :
                   'Grassroots level implementation, direct citizen interaction, and field telemetry.'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
