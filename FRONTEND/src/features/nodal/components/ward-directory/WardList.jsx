import React from 'react';
import { Landmark } from 'lucide-react';
import { WardCard } from './WardCard.jsx';

export const WardList = ({
  wards = [],
  challenges = [],
  onViewWard,
  onEditWard,
  onDeleteWard,
  onAllocateProblem
}) => {
  if (!wards || wards.length === 0) {
    return (
      <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center">
          <Landmark className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-bold text-slate-800">No Ward Departments Found</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          No ward-level authorities or commissioner offices registered yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <span className="text-xs font-black text-slate-700 uppercase tracking-wider">
          Registered Ward Departments & Authorities ({wards.length})
        </span>
        <span className="text-[11px] text-slate-400 font-medium">
          Ward commissioner offices, credentials & municipal problem allocation
        </span>
      </div>

      <div className="space-y-2.5">
        {wards.map((ward) => {
          const wardId = ward.deptId || ward.code || ward.wardId || ward.id || ward._id;
          const assignedCount = challenges.filter(
            (c) =>
              c.assignedDepartment?.deptId === ward.deptId ||
              c.assignedDepartment?.name === ward.name ||
              c.assignedWard?.wardId === (ward.wardId || ward.deptId) ||
              c.assignedWard?.id === wardId
          ).length;

          return (
            <WardCard
              key={wardId}
              ward={ward}
              assignedCount={assignedCount}
              onViewWard={onViewWard}
              onEditWard={onEditWard}
              onDeleteWard={onDeleteWard}
              onAllocateProblem={onAllocateProblem}
            />
          );
        })}
      </div>
    </div>
  );
};

export default WardList;
