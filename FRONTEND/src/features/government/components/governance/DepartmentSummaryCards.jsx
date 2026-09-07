import React from 'react';
import { Landmark, Users, AlertCircle, FolderKanban } from 'lucide-react';

export const DepartmentSummaryCards = ({
  totalDepartments = 0,
  totalOfficers = 0,
  totalChallenges = 0,
  activeProjects = 0
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mb-4">
      {/* Total Departments */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-3.5 shadow-2xs">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Line Departments</span>
          <div className="w-7 h-7 rounded-lg bg-[#007A61]/10 text-[#007A61] flex items-center justify-center">
            <Landmark className="w-4 h-4" />
          </div>
        </div>
        <div className="text-xl font-black text-slate-900 mt-1">{totalDepartments}</div>
        <span className="text-[10px] text-slate-400 font-medium">Core Government Ministries</span>
      </div>

      {/* Assigned Officers */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-3.5 shadow-2xs">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Nodal Officers</span>
          <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <Users className="w-4 h-4" />
          </div>
        </div>
        <div className="text-xl font-black text-slate-900 mt-1">{totalOfficers}</div>
        <span className="text-[10px] text-slate-400 font-medium">Assigned Department Admins</span>
      </div>

      {/* Allocated Challenges */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-3.5 shadow-2xs">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Problem Mandates</span>
          <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
            <AlertCircle className="w-4 h-4" />
          </div>
        </div>
        <div className="text-xl font-black text-slate-900 mt-1">{totalChallenges}</div>
        <span className="text-[10px] text-slate-400 font-medium">Civic Grievances Allocated</span>
      </div>

      {/* Active Projects */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-3.5 shadow-2xs">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">R&D Initiatives</span>
          <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <FolderKanban className="w-4 h-4" />
          </div>
        </div>
        <div className="text-xl font-black text-slate-900 mt-1">{activeProjects}</div>
        <span className="text-[10px] text-slate-400 font-medium">University Collaborative Solutions</span>
      </div>
    </div>
  );
};

export default DepartmentSummaryCards;
