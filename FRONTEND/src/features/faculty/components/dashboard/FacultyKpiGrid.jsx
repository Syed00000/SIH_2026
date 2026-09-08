import React from 'react';
import {
  ClipboardList,
  FolderGit2,
  FileText,
  CheckCircle2
} from 'lucide-react';

export const FacultyKpiGrid = ({
  challengesCount = 0,
  proposalsPendingCount = 0,
  activeProjectsCount = 0,
  resolvedProjectsCount = 0
}) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
      <div className="p-4 bg-white border border-slate-200/90 rounded-2xl shadow-2xs">
        <div className="flex items-center justify-between">
          <span className="text-[10.5px] font-bold uppercase tracking-wider text-slate-500">
            Assigned Problems
          </span>
          <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
            <ClipboardList className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-black text-slate-900 mt-1">{challengesCount}</div>
        <span className="text-[11px] font-semibold text-slate-500 mt-0.5 block">
          Official Allocations
        </span>
      </div>

      <div className="p-4 bg-white border border-slate-200/90 rounded-2xl shadow-2xs">
        <div className="flex items-center justify-between">
          <span className="text-[10.5px] font-bold uppercase tracking-wider text-slate-500">
            Proposals Pending
          </span>
          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 flex items-center justify-center">
            <FileText className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-black text-slate-900 mt-1">{proposalsPendingCount}</div>
        <span className="text-[11px] font-semibold text-amber-800 mt-0.5 block">
          Action Required
        </span>
      </div>

      <div className="p-4 bg-white border border-slate-200/90 rounded-2xl shadow-2xs">
        <div className="flex items-center justify-between">
          <span className="text-[10.5px] font-bold uppercase tracking-wider text-slate-500">
            Active R&amp;D Projects
          </span>
          <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
            <FolderGit2 className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-black text-slate-900 mt-1">{activeProjectsCount}</div>
        <span className="text-[11px] font-semibold text-slate-500 mt-0.5 block">
          Under Mentorship
        </span>
      </div>

      <div className="p-4 bg-white border border-slate-200/90 rounded-2xl shadow-2xs">
        <div className="flex items-center justify-between">
          <span className="text-[10.5px] font-bold uppercase tracking-wider text-slate-500">
            Resolved / Tackled
          </span>
          <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-black text-slate-900 mt-1">{resolvedProjectsCount}</div>
        <span className="text-[11px] font-semibold text-slate-500 mt-0.5 block">
          Field Verified
        </span>
      </div>
    </div>
  );
};

export default FacultyKpiGrid;
