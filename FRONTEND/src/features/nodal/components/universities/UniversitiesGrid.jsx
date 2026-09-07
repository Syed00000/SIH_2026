import React from 'react';
import { Building, MapPin, User, Plus, ChevronRight, Eye } from 'lucide-react';
import { UniversityCard } from './UniversityCard.jsx';
import { SkeletonTable, SkeletonGridCards } from '../common/NodalSkeletonLoaders.jsx';

export const UniversitiesGrid = ({
  loading,
  universities = [],
  getAssignedChallengesForUni,
  onSelectUniversity,
  onAllocateNew,
  viewMode = 'table'
}) => {
  if (loading) {
    return viewMode === 'grid' ? (
      <SkeletonGridCards count={6} />
    ) : (
      <SkeletonTable rows={6} cols={6} />
    );
  }

  if (universities.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-md p-12 text-center text-slate-500 space-y-2 shadow-2xs">
        <Building className="w-10 h-10 text-slate-300 mx-auto" />
        <h3 className="text-sm font-bold text-slate-900">No institutions match your search</h3>
        <p className="text-xs text-slate-400">Try adjusting your filters or search keywords.</p>
      </div>
    );
  }

  if (viewMode === 'grid') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {universities.map((uni) => (
          <UniversityCard
            key={uni.id || uni._id || uni.code}
            uni={uni}
            assignedChallenges={getAssignedChallengesForUni(uni)}
            onSelectUniversity={onSelectUniversity}
            onAllocateNew={onAllocateNew}
          />
        ))}
      </div>
    );
  }

  // Primary Form/List Table View
  return (
    <div className="bg-white border border-slate-200 rounded-md overflow-hidden shadow-2xs w-full">
      <div className="overflow-x-auto custom-scrollbar w-full">
        <table className="w-full min-w-[950px] text-left text-xs border-collapse divide-y divide-slate-200">
          <thead className="bg-slate-50 text-[11px] font-extrabold text-slate-600 uppercase tracking-wider select-none">
            <tr>
              <th scope="col" className="py-3 px-3.5">Code & Institution Name</th>
              <th scope="col" className="py-3 px-3.5">Type</th>
              <th scope="col" className="py-3 px-3.5">District</th>
              <th scope="col" className="py-3 px-3.5">Nodal Officer</th>
              <th scope="col" className="py-3 px-3.5 text-center">Problem Load</th>
              <th scope="col" className="py-3 px-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {universities.map((uni) => {
              const assignedChallenges = getAssignedChallengesForUni(uni) || [];
              const deployedCount = assignedChallenges.filter(
                (c) => c.status === 'Deployed' || Boolean(c.isDeployed) || Boolean(c.isLocked)
              ).length;
              const inProgressCount = assignedChallenges.filter(
                (c) => (c.status === 'In Progress' || c.assignedUniversity?.acceptanceStatus === 'Accepted')
                  && !c.isDeployed && !c.isLocked && c.status !== 'Deployed'
              ).length;

              return (
                <tr
                  key={uni.id || uni._id || uni.code}
                  onClick={() => onSelectUniversity(uni)}
                  className="hover:bg-slate-50/90 transition-colors cursor-pointer group"
                >
                  {/* Code & Name */}
                  <td className="py-3 px-3.5">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-[11px] font-bold text-[#047857] shrink-0 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200">
                        {uni.code || 'HEI-001'}
                      </span>
                      <span className="font-bold text-slate-900 group-hover:text-[#047857] text-xs sm:text-sm transition-colors">
                        {uni.name}
                      </span>
                    </div>
                  </td>

                  {/* Type */}
                  <td className="py-3 px-3.5 whitespace-nowrap">
                    <span className="text-xs font-semibold text-slate-700">
                      {uni.universityType || uni.type || 'State University'}
                    </span>
                  </td>

                  {/* District */}
                  <td className="py-3 px-3.5 whitespace-nowrap">
                    <div className="flex items-center space-x-1.5 text-slate-600 font-medium text-xs">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{uni.district || 'Jharkhand'}</span>
                    </div>
                  </td>

                  {/* Nodal Officer */}
                  <td className="py-3 px-3.5 whitespace-nowrap">
                    {uni.nodalOfficer?.name ? (
                      <div className="flex items-center space-x-1.5 text-slate-700 font-medium text-xs">
                        <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{uni.nodalOfficer.name}</span>
                      </div>
                    ) : (
                      <span className="text-slate-400 text-[11px] font-medium">&mdash;</span>
                    )}
                  </td>

                  {/* Problem Load */}
                  <td className="py-3 px-3.5 text-center whitespace-nowrap">
                    <div className="inline-flex items-center space-x-2.5 text-xs font-extrabold">
                      <span className="text-slate-800">
                        {assignedChallenges.length} Assigned
                      </span>
                      <span className="text-[#047857]">
                        {inProgressCount} Active
                      </span>
                      {deployedCount > 0 && (
                        <span className="text-teal-800">
                          {deployedCount} Deployed
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-3.5 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end space-x-1.5">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onAllocateNew(e, uni);
                        }}
                        className="flex items-center space-x-1 bg-white hover:bg-[#047857] text-slate-800 hover:text-white border border-slate-300 hover:border-[#047857] text-xs font-bold px-2.5 py-1 rounded-md shadow-3xs transition-all cursor-pointer"
                        title="Allocate new problem statement"
                      >
                        <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>Allocate</span>
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectUniversity(uni);
                        }}
                        className="flex items-center space-x-1.5 bg-[#047857] hover:bg-[#064e3b] text-white text-xs font-bold px-3 py-1 rounded-md shadow-xs transition-all cursor-pointer"
                        title="View University Details & Assigned Problems"
                      >
                        <Eye className="w-3.5 h-3.5 text-emerald-200" />
                        <span>View Details</span>
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

export default UniversitiesGrid;
