import React from 'react';
import { Wrench, Clock, CheckCircle2, ChevronRight as ArrowRight } from 'lucide-react';

export const TechnicianProblemRow = ({ task, rowNumber, onSelect, getPriorityBadge }) => {
  const tech = task.assignedTechnician || {};
  const isAcc = tech.status === 'Accepted' || tech.status === 'Completed';
  const isDone = tech.status === 'Completed' || task.status === 'Resolved';
  const loc = task.location || {};
  const locText = [loc.panchayatOrWard || loc.panchayat, loc.district || 'Ranchi'].filter(Boolean).join(', ');

  return (
    <>
      {/* Desktop Table Row */}
      <tr
        onClick={() => onSelect(task)}
        className="hidden md:table-row hover:bg-emerald-50/40 transition cursor-pointer"
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
          <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${getPriorityBadge(task.priority)}`}>
            {task.priority || 'Medium'}
          </span>
        </td>
        <td className="py-3 px-3.5">
          {isDone ? (
            <span className="inline-flex items-center gap-1 text-[10.5px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
              <CheckCircle2 className="w-3 h-3" /> Done
            </span>
          ) : isAcc ? (
            <span className="inline-flex items-center gap-1 text-[10.5px] font-bold text-blue-800 bg-blue-100 px-2 py-0.5 rounded-full">
              <Wrench className="w-3 h-3" /> Active
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[10.5px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
              <Clock className="w-3 h-3" /> Pending
            </span>
          )}
        </td>
        <td className="py-3 px-3.5 text-center">
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onSelect(task); }}
            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-[#007A61] hover:text-white text-slate-700 text-[11px] font-bold transition cursor-pointer"
          >
            Open
          </button>
        </td>
      </tr>

      {/* Mobile Row Card */}
      <div
        onClick={() => onSelect(task)}
        className="md:hidden p-3.5 active:bg-slate-50 transition cursor-pointer flex items-center justify-between gap-2"
      >
        <div className="space-y-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10.5px] font-bold text-[#007A61] bg-[#007A61]/10 px-1.5 py-0.2 rounded">
              {task.challengeId || task.id}
            </span>
            <span className={`text-[9.5px] font-extrabold px-1.5 py-0.2 rounded-full border ${getPriorityBadge(task.priority)}`}>
              {task.priority || 'Medium'}
            </span>
          </div>
          <h4 className="text-xs font-bold text-slate-900 truncate">{task.title}</h4>
          <p className="text-[11px] text-slate-500 truncate">{locText || 'Block Jurisdiction'}</p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {isDone ? (
            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">Done</span>
          ) : isAcc ? (
            <span className="text-[10px] font-bold text-blue-800 bg-blue-100 px-2 py-0.5 rounded-full">Active</span>
          ) : (
            <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">Pending</span>
          )}
          <ArrowRight className="w-4 h-4 text-slate-400" />
        </div>
      </div>
    </>
  );
};

export default TechnicianProblemRow;
