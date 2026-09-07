import React from 'react';
import { UserCheck, Trash2 } from 'lucide-react';

export const IndustryAssignedProblemsList = ({ assignedList = [], onUnassign, isSubmitting }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-3">
      <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center space-x-2">
        <UserCheck className="w-4 h-4 text-[#007A61]" />
        <span>Currently Mentored Problems ({assignedList.length})</span>
      </h4>

      {assignedList.length === 0 ? (
        <div className="p-4 text-center text-xs text-slate-400">
          This expert is not currently assigned to any active problem statement.
        </div>
      ) : (
        <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
          {assignedList.map((p) => (
            <div key={p.requestId} className="p-3.5 hover:bg-slate-50/80 flex items-center justify-between gap-3 bg-white">
              <div>
                <h6 className="text-xs font-black text-slate-900">{p.problemTitle}</h6>
                <p className="text-[10.5px] text-slate-500 font-medium">
                  {p.universityName} &bull; Challenge: {p.challengeId || p.projectId}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onUnassign(p.requestId)}
                disabled={isSubmitting}
                className="px-2.5 py-1 text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg text-xs font-bold flex items-center space-x-1 cursor-pointer disabled:opacity-50 shrink-0"
              >
                <Trash2 className="w-3 h-3" />
                <span>Unassign</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default IndustryAssignedProblemsList;
