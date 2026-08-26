import React from 'react';
import {
  MapPin,
  Building2,
  ExternalLink,
  ChevronRight,
  Map,
  Layers,
  Clock,
  Sparkles,
  IndianRupee,
  Users
} from 'lucide-react';

export const RegionalMappingView = ({
  mappings = [],
  onViewDistrictMap,
  onViewDistrictDetails
}) => {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Sync Complete':
      case 'Active Hub':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Syncing':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Active':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Under Review':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-4 select-none">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xs font-black text-slate-900 uppercase tracking-widest">
            Regional Districts & Institutions Mapping
          </h2>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Geographic distribution of R&D challenges, funded projects, and lead academic nodal institutions
          </p>
        </div>
        <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
          {mappings.length} Districts Mapped
        </span>
      </div>

      <div className="space-y-3">
        {mappings.map((item) => {
          return (
            <div
              key={item.district}
              className="bg-white border border-slate-200 rounded-2xl p-4 transition-all duration-150 hover:shadow-xs hover:border-slate-300 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xs"
            >
              {/* Left Pin & District Info */}
              <div className="flex items-start space-x-3.5 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-800 flex-shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900">{item.district}</h3>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getStatusBadge(
                        item.status
                      )}`}
                    >
                      Status: {item.status}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500 mt-1">
                    <span className="font-semibold text-slate-800">
                      {item.activeProjects} Active Projects
                    </span>
                    <span>•</span>
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>Last Sync: {item.lastSync}</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center space-x-1 text-slate-700">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      <span>Lead: <strong>{item.leadInstitute}</strong></span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Action Buttons matching Image 3 */}
              <div className="flex items-center space-x-2 flex-shrink-0 self-end md:self-center">
                <button
                  type="button"
                  onClick={() => onViewDistrictMap && onViewDistrictMap(item)}
                  className="px-3.5 py-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer flex items-center space-x-1.5 shadow-2xs"
                >
                  <Map className="w-3.5 h-3.5" />
                  <span>View Map</span>
                </button>

                <button
                  type="button"
                  onClick={() => onViewDistrictDetails && onViewDistrictDetails(item)}
                  className="px-3.5 py-1.5 text-xs font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer flex items-center space-x-1"
                >
                  <span>Details</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RegionalMappingView;
