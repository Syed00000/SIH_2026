import React from 'react';
import { Wrench, Clock, CheckCircle2, ChevronRight as ArrowRight } from 'lucide-react';

export const TechnicianProblemRow = ({ task, rowNumber, onSelect, getPriorityBadge, isMobile }) => {
  const tech = task.assignedTechnician || {};
  const isDone = task.status === 'Resolved';
  const isPendingApproval = tech.status === 'Completed' && task.status !== 'Resolved';
  const isActive = tech.status === 'Accepted' && !isDone && !isPendingApproval;
  const loc = task.location || {};
  const locText = [loc.panchayatOrWard || loc.panchayat, loc.district || 'Ranchi'].filter(Boolean).join(', ');

  if (isMobile) {
    return (
      <div
        onClick={() => onSelect(task)}
        className="p-3.5 active:bg-slate-50 transition cursor-pointer flex items-center justify-between gap-2"
      >
        <div className="space-y-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10.5px] font-bold text-[#007A61]">
              {task.challengeId || task.id}
            </span>
            <span className={`text-[10px] font-extrabold ${getPriorityBadge(task.priority)}`}>
              {task.priority || 'Medium'}
            </span>
          </div>
          <h4 className="text-xs font-bold text-slate-900 truncate">{task.title}</h4>
          <p className="text-[11px] text-slate-500 truncate">{locText || 'Block Jurisdiction'}</p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {isDone ? (
            <span className="text-[10px] font-bold text-emerald-700">Done</span>
          ) : isPendingApproval ? (
            <span className="text-[10px] font-bold text-purple-700">Pending Approval</span>
          ) : isActive ? (
            <span className="text-[10px] font-bold text-blue-700">Active</span>
          ) : (
            <span className="text-[10px] font-bold text-amber-700">Pending</span>
          )}
          <ArrowRight className="w-4 h-4 text-slate-400" />
        </div>
      </div>
    );
  }

  return (
      <tr
        onClick={() => onSelect(task)}
        className="hover:bg-emerald-50/40 transition cursor-pointer"
      >
        <td className="py-3 px-3.5 text-center text-slate-400 font-bold">{rowNumber}</td>
        <td className="py-3 px-3.5">
          <div className="font-bold text-slate-900 line-clamp-1">{task.title}</div>
          <div className="font-mono text-[10.5px] text-[#007A61] font-semibold">
            {task.challengeId || task.id}
          </div>
        </td>
        <td className="py-3 px-3.5 text-slate-600 truncate max-w-[140px]">{locText || 'Block Area'}</td>
        <td className="py-3 px-3.5 text-slate-700">{task.domain || 'Civic'}</td>
        <td className="py-3 px-3.5">
          <span className={`text-[10.5px] font-extrabold ${getPriorityBadge(task.priority)}`}>
            {task.priority || 'Medium'}
          </span>
        </td>
        <td className="py-3 px-3.5">
          {isDone ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700">
              <CheckCircle2 className="w-3.5 h-3.5" /> Done
            </span>
          ) : isPendingApproval ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-purple-700">
              <Clock className="w-3.5 h-3.5" /> Pending Approval
            </span>
          ) : isActive ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-700">
              <Wrench className="w-3.5 h-3.5" /> Active
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700">
              <Clock className="w-3.5 h-3.5" /> Pending
            </span>
          )}
        </td>
        <td className="py-3 px-3.5 text-center">
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onSelect(task); }}
            className="px-3 py-1 rounded-none bg-slate-100 border border-slate-200 hover:bg-[#007A61] hover:border-[#007A61] hover:text-white text-slate-700 text-[11px] font-bold transition cursor-pointer"
          >
            Open
          </button>
        </td>
      </tr>
  );
};

export default TechnicianProblemRow;
