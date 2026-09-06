import React from 'react';
import { Building, MapPin, User, Plus, ChevronRight } from 'lucide-react';

export const UniversityCard = ({
  uni,
  assignedChallenges = [],
  onSelectUniversity,
  onAllocateNew
}) => {
  const deployedCount = assignedChallenges.filter(
    (c) => c.status === 'Deployed' || Boolean(c.isDeployed) || Boolean(c.isLocked)
  ).length;
  const inProgressCount = assignedChallenges.filter(
    (c) => (c.status === 'In Progress' || c.assignedUniversity?.acceptanceStatus === 'Accepted')
      && !c.isDeployed && !c.isLocked && c.status !== 'Deployed'
  ).length;

  return (
    <div
      onClick={() => onSelectUniversity(uni)}
      className="bg-white border border-slate-200/90 rounded-lg p-5 shadow-2xs hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between space-y-4 group text-left"
    >
      <div className="space-y-3">
        {/* Card Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1">
            <span className="font-mono text-[10.5px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
              {uni.code || 'HEI-001'}
            </span>
            <h3 className="text-sm font-black text-slate-900 line-clamp-1 group-hover:text-slate-800">
              {uni.name}
            </h3>
            <p className="text-xs text-slate-500 font-medium line-clamp-1">
              {uni.legalName || uni.name}
            </p>
          </div>

          <span className="text-[10.5px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full shrink-0 border border-slate-200">
            {uni.universityType || uni.type || 'State University'}
          </span>
        </div>

        {/* Location & Nodal Contact */}
        <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs text-slate-600 font-medium">
          <div className="flex items-center space-x-2">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="line-clamp-1">{uni.district || 'Jharkhand'}</span>
          </div>

          {uni.nodalOfficer?.name && (
            <div className="flex items-center space-x-2">
              <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="line-clamp-1">Nodal: {uni.nodalOfficer.name}</span>
            </div>
          )}
        </div>
      </div>

      {/* Allocation Metrics & Actions */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div>
            <span className="text-xs font-black text-slate-900 block">
              {assignedChallenges.length}
            </span>
            <span className="text-[10px] text-slate-500 font-medium block">
              Assigned
            </span>
          </div>
          <div>
            <span className="text-xs font-black text-[#047857] block">
              {inProgressCount}
            </span>
            <span className="text-[10px] text-slate-500 font-medium block">
              In Progress
            </span>
          </div>
          {deployedCount > 0 && (
            <div>
              <span className="text-xs font-black text-teal-700 block">
                {deployedCount}
              </span>
              <span className="text-[10px] text-teal-600 font-bold block">
                🔒 Deployed
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-1.5">
          <button
            onClick={(e) => onAllocateNew(e, uni)}
            className="flex items-center space-x-1 bg-white hover:bg-[#064e3b] text-slate-900 hover:text-white border border-slate-200/90 hover:border-[#064e3b] text-xs font-bold px-2.5 py-1.5 rounded-md shadow-3xs transition-all cursor-pointer"
            title="Allocate new problem to this institution"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Allocate</span>
          </button>

          <button className="p-1.5 rounded-md text-slate-400 group-hover:text-slate-900 hover:bg-slate-100 transition-colors">
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default UniversityCard;
