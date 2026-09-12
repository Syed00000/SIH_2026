import React from 'react';
import { Landmark, Eye, Trash2, Mail, MapPin, Send } from 'lucide-react';

export const StateList = ({
  ministries = [],
  challenges = [],
  onViewMinistry,
  onDeleteMinistry,
  onAllocateProblem
}) => {
  if (!ministries || ministries.length === 0) {
    return (
      <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#007A61] mx-auto flex items-center justify-center">
          <Landmark className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-bold text-slate-800">No State Department Registered</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          No state-level apex department found in the system.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <span className="text-xs font-black text-slate-700 uppercase tracking-wider">
          State Department ({ministries.length})
        </span>
        <span className="text-[11px] text-slate-400 font-medium">
          Statewide policymaking and high-priority problem allocation
        </span>
      </div>

      <div className="space-y-2.5">
        {ministries.map((ministry) => {
          const mId = ministry.deptId || ministry.id || ministry._id;
          const assignedCount = challenges.filter(
            (c) => c.assignedDepartment?.deptId === ministry.deptId || c.assignedDepartment?.name === ministry.name
          ).length;

          return (
            <div
              key={mId}
              className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs hover:border-[#007A61]/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-3 text-left"
            >
              <div className="flex items-start gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-[#007A61]/10 text-[#007A61] flex items-center justify-center shrink-0 mt-0.5 font-bold">
                  <Landmark className="w-5 h-5" />
                </div>
                <div className="min-w-0 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-sm font-black text-slate-900 leading-tight">
                      {ministry.name}
                    </h2>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-slate-100 text-slate-600 border border-slate-200">
                      {ministry.deptId || ministry.code}
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                      State Level
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-[11px] text-slate-500 flex-wrap">
                    <span className="flex items-center gap-1 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      State of Jharkhand
                    </span>
                    {ministry.headName && (
                      <span className="font-semibold text-slate-700">
                        Lead: {ministry.headName} {ministry.headRole ? `(${ministry.headRole})` : ''}
                      </span>
                    )}
                    {ministry.headEmail && (
                      <span className="flex items-center gap-1 text-slate-500">
                        <Mail className="w-3 h-3 text-slate-400" />
                        {ministry.headEmail}
                      </span>
                    )}
                  </div>

                  {ministry.description && (
                    <p className="text-[11px] text-slate-500 line-clamp-1 pt-0.5">
                      {ministry.description}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  {assignedCount} Assigned
                </span>

                {onAllocateProblem && (
                  <button
                    type="button"
                    onClick={() => onAllocateProblem(ministry)}
                    className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold bg-[#007A61] hover:bg-[#006651] text-white rounded-lg transition-colors cursor-pointer shadow-2xs"
                    title="Allocate Problem to this State Ministry"
                  >
                    <Send className="w-3 h-3" />
                    <span>Allocate Issue</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => onViewMinistry(ministry)}
                  className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                  title="View Ministry Details"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onDeleteMinistry(ministry)}
                  className="p-1.5 text-slate-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                  title="Delete Ministry"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StateList;
