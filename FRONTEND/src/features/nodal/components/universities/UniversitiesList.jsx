import React from 'react';
import { Building, MapPin, User, Plus, ChevronRight } from 'lucide-react';

export const UniversitiesList = ({
  loading,
  universities = [],
  getAssignedChallengesForUni,
  onSelectUniversity,
  onAllocateNew
}) => {
  if (loading) {
    return (
      <div className="bg-white border border-slate-200/90 rounded-lg overflow-hidden shadow-2xs">
        <div className="divide-y divide-slate-100">
          {[1, 2, 3, 4, 5].map((n) => (
            <div key={n} className="p-4 flex items-center justify-between space-x-4 animate-pulse">
              <div className="flex items-center space-x-3 w-1/3">
                <div className="w-10 h-10 rounded-lg bg-slate-200" />
                <div className="space-y-2 flex-1">
                  <div className="h-3.5 bg-slate-200 rounded w-3/4" />
                  <div className="h-2.5 bg-slate-100 rounded w-1/2" />
                </div>
              </div>
              <div className="h-4 bg-slate-100 rounded w-24" />
              <div className="h-4 bg-slate-100 rounded w-32" />
              <div className="h-8 bg-slate-200 rounded w-24" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (universities.length === 0) {
    return (
      <div className="bg-white border border-slate-200/90 rounded-lg p-12 text-center text-slate-500 space-y-2 shadow-2xs">
        <Building className="w-10 h-10 text-slate-300 mx-auto" />
        <h3 className="text-sm font-bold text-slate-900">No institutions match your search</h3>
        <p className="text-xs text-slate-400">Try adjusting your filters or search keywords.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200/90 rounded-lg overflow-hidden shadow-2xs">
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-black uppercase tracking-wider text-slate-500">
              <th className="py-3 px-4">Institution / Code</th>
              <th className="py-3 px-4">District & Type</th>
              <th className="py-3 px-4">Nodal Officer</th>
              <th className="py-3 px-4 text-center">Workload & Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {universities.map((uni) => {
              const assigned = getAssignedChallengesForUni(uni);
              const deployedCount = assigned.filter(
                (c) => c.status === 'Deployed' || Boolean(c.isDeployed) || Boolean(c.isLocked)
              ).length;
              const inProgressCount = assigned.filter(
                (c) => (c.status === 'In Progress' || c.assignedUniversity?.acceptanceStatus === 'Accepted')
                  && !c.isDeployed && !c.isLocked && c.status !== 'Deployed'
              ).length;

              return (
                <tr
                  key={uni.id || uni._id || uni.code}
                  onClick={() => onSelectUniversity(uni)}
                  className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                >
                  <td className="py-3.5 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-lg bg-slate-100 border border-slate-200/80 flex items-center justify-center text-slate-700 font-black text-xs shrink-0 group-hover:bg-[#064e3b] group-hover:text-white transition-colors">
                        <Building className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center space-x-1.5">
                          <span className="font-mono text-[10px] font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                            {uni.code || 'HEI-001'}
                          </span>
                        </div>
                        <div className="font-bold text-slate-900 text-xs group-hover:text-emerald-950 truncate max-w-xs">
                          {uni.name}
                        </div>
                        <div className="text-[11px] text-slate-500 font-medium truncate max-w-xs">
                          {uni.legalName || uni.name}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-1 text-slate-700 font-semibold">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{uni.district || 'Jharkhand'}</span>
                      </div>
                      <span className="inline-block text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                        {uni.universityType || uni.type || 'State University'}
                      </span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {uni.nodalOfficer?.name ? (
                      <div className="space-y-0.5">
                        <div className="flex items-center space-x-1.5 text-slate-800 font-bold">
                          <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{uni.nodalOfficer.name}</span>
                        </div>
                        {uni.nodalOfficer?.email && (
                          <div className="text-[11px] text-slate-400 pl-5 font-medium">
                            {uni.nodalOfficer.email}
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="text-slate-400 text-xs italic">Not Designated</span>
                    )}
                  </td>

                  <td className="py-3.5 px-4 whitespace-nowrap text-center">
                    <div className="inline-flex items-center space-x-2 bg-slate-50 border border-slate-200/80 rounded-lg px-2.5 py-1">
                      <div className="text-center px-1">
                        <span className="text-xs font-black text-slate-900 block">{assigned.length}</span>
                        <span className="text-[9.5px] text-slate-500 font-medium block">Assigned</span>
                      </div>
                      <span className="text-slate-300">|</span>
                      <div className="text-center px-1">
                        <span className="text-xs font-black text-[#047857] block">{inProgressCount}</span>
                        <span className="text-[9.5px] text-slate-500 font-medium block">Active</span>
                      </div>
                      {deployedCount > 0 && (
                        <>
                          <span className="text-slate-300">|</span>
                          <div className="text-center px-1">
                            <span className="text-xs font-black text-teal-700 block">{deployedCount}</span>
                            <span className="text-[9.5px] text-teal-600 font-bold block">Deployed</span>
                          </div>
                        </>
                      )}
                    </div>
                  </td>

                  <td className="py-3.5 px-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end space-x-1.5">
                      <button
                        onClick={(e) => onAllocateNew(e, uni)}
                        className="flex items-center space-x-1 bg-white hover:bg-[#064e3b] text-slate-900 hover:text-white border border-slate-200/90 hover:border-[#064e3b] text-xs font-bold px-2.5 py-1.5 rounded-md shadow-3xs transition-all cursor-pointer"
                        title="Allocate new problem to this institution"
                      >
                        <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>Allocate</span>
                      </button>
                      <button
                        className="p-1.5 rounded-md text-slate-400 group-hover:text-slate-900 hover:bg-slate-100 transition-colors"
                        title="View Details"
                      >
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UniversitiesList;
