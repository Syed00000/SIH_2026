import React from 'react';
import {
  ClipboardList,
  FolderGit2,
  Users,
  FileText,
  ChevronRight
} from 'lucide-react';

export const FacultyKpiGrid = ({
  challengesCount = 0,
  proposalsPendingCount = 0,
  totalTeamMembers = 0,
  activeProjectsCount = 0,
  onNavigateTab
}) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
      <div
        onClick={() => onNavigateTab('challenges')}
        className="p-4 bg-white border border-slate-200/90 rounded-2xl shadow-2xs hover:border-emerald-200 transition-all cursor-pointer group"
      >
        <div className="flex items-center justify-between">
          <span className="text-[10.5px] font-extrabold uppercase tracking-wider text-slate-400">
            Assigned Problems
          </span>
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#007A61] flex items-center justify-center group-hover:scale-105 transition-transform">
            <ClipboardList className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-black text-slate-900 mt-1">{challengesCount}</div>
        <span className="text-[11px] font-semibold text-slate-500 mt-0.5 flex items-center space-x-1">
          <span>Official Allocations</span>
          <ChevronRight className="w-3 h-3 text-slate-400" />
        </span>
      </div>

      <div
        onClick={() => onNavigateTab('projects')}
        className="p-4 bg-white border border-slate-200/90 rounded-2xl shadow-2xs hover:border-amber-200 transition-all cursor-pointer group"
      >
        <div className="flex items-center justify-between">
          <span className="text-[10.5px] font-extrabold uppercase tracking-wider text-slate-400">
            Proposals Pending
          </span>
          <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center group-hover:scale-105 transition-transform">
            <FileText className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-black text-slate-900 mt-1">{proposalsPendingCount}</div>
        <span className="text-[11px] font-semibold text-amber-700 mt-0.5 flex items-center space-x-1">
          <span>Budget & Solution Draft</span>
          <ChevronRight className="w-3 h-3 text-amber-500" />
        </span>
      </div>

      <div
        onClick={() => onNavigateTab('projects')}
        className="p-4 bg-white border border-slate-200/90 rounded-2xl shadow-2xs hover:border-purple-200 transition-all cursor-pointer group"
      >
        <div className="flex items-center justify-between">
          <span className="text-[10.5px] font-extrabold uppercase tracking-wider text-slate-400">
            Student Researchers
          </span>
          <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Users className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-black text-slate-900 mt-1">{totalTeamMembers}</div>
        <span className="text-[11px] font-semibold text-purple-700 mt-0.5 flex items-center space-x-1">
          <span>Lab Teams Formed</span>
          <ChevronRight className="w-3 h-3 text-purple-400" />
        </span>
      </div>

      <div
        onClick={() => onNavigateTab('projects')}
        className="p-4 bg-white border border-slate-200/90 rounded-2xl shadow-2xs hover:border-emerald-200 transition-all cursor-pointer group"
      >
        <div className="flex items-center justify-between">
          <span className="text-[10.5px] font-extrabold uppercase tracking-wider text-slate-400">
            Active R&D Projects
          </span>
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#007A61] flex items-center justify-center group-hover:scale-105 transition-transform">
            <FolderGit2 className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-black text-slate-900 mt-1">{activeProjectsCount}</div>
        <span className="text-[11px] font-semibold text-emerald-700 mt-0.5 flex items-center space-x-1">
          <span>Under Mentorship</span>
          <ChevronRight className="w-3 h-3 text-emerald-500" />
        </span>
      </div>
    </div>
  );
};

export default FacultyKpiGrid;
