import React from 'react';
import { MapPin, Wrench, ArrowRight, User } from 'lucide-react';

export const DepartmentProblemCard = ({
  problem,
  rowNumber,
  onSelect,
  onAssignTech
}) => {
  const idKey = problem.challengeId || problem.id || problem._id;
  const locStr = [problem.location?.panchayat || problem.panchayat, problem.location?.district || problem.district || 'Ranchi'].filter(Boolean).join(', ');
  const submitterName = problem.submitter?.fullName || problem.submitter?.name || 'Citizen';

  return (
    <div
      onClick={() => onSelect && onSelect(problem)}
      className="p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs space-y-2 text-left cursor-pointer active:bg-slate-50 transition"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-mono text-[10px] font-bold text-[#007A61] bg-[#007A61]/10 px-1.5 py-0.2 rounded border border-[#007A61]/20">
              {idKey}
            </span>
            <span className="text-[10px] text-slate-500 font-medium">
              {problem.domain || 'Civic'}
            </span>
          </div>
          <h3 className="font-bold text-xs text-slate-900 line-clamp-1 mt-1">{problem.title}</h3>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-extrabold border ${
            problem.priority === 'Critical' ? 'bg-slate-900 text-white border-slate-900' :
            problem.priority === 'High' ? 'bg-slate-100 text-slate-900 border-slate-300' :
            'bg-slate-50 text-slate-700 border-slate-200'
          }`}>
            {problem.priority || 'Medium'}
          </span>
          <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-extrabold border ${
            problem.status === 'Resolved' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
            problem.status === 'Escalated' ? 'bg-slate-900 text-white border-slate-900' :
            'bg-slate-100 text-slate-800 border-slate-200'
          }`}>
            {problem.status || 'Assigned'}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
        <div className="flex items-center gap-1 truncate max-w-[200px]">
          <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
          <span className="truncate">{locStr}</span>
        </div>
        <span className="text-[10.5px] text-slate-700 font-medium">{submitterName}</span>
      </div>

      {problem.assignedTechnician?.name && (
        <div className="text-[10px] text-[#007A61] font-semibold bg-[#007A61]/10 px-2 py-0.5 rounded flex items-center gap-1">
          <Wrench className="w-3 h-3" />
          <span>Tech: {problem.assignedTechnician.name}</span>
        </div>
      )}

      <div className="flex items-center justify-end gap-1.5 pt-1">
        {onAssignTech && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onAssignTech(problem); }}
            className="flex items-center gap-1 px-2.5 py-1 bg-teal-50 hover:bg-[#007A61] text-[#007A61] hover:text-white rounded-lg font-bold text-xs transition cursor-pointer border border-teal-200"
          >
            <Wrench className="w-3 h-3" />
            <span>{problem.assignedTechnician?.name ? 'Reassign' : 'Assign Tech'}</span>
          </button>
        )}
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onSelect && onSelect(problem); }}
          className="flex items-center gap-1 px-2.5 py-1 bg-[#007A61] text-white rounded-lg font-bold text-xs transition cursor-pointer"
        >
          <span>Action</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};

export default DepartmentProblemCard;
