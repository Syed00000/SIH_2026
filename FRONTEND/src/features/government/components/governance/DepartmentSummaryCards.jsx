import React from 'react';
import { Landmark, Users, AlertCircle, FolderKanban } from 'lucide-react';

export const DepartmentSummaryCards = ({
  totalDepartments = 0,
  totalOfficers = 0,
  totalChallenges = 0,
  activeProjects = 0
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
      {/* Card 1: TOTAL DEPARTMENTS */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs flex flex-col justify-between h-[135px]">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
              Line Departments
            </span>
            <Landmark className="w-4 h-4 text-slate-400" />
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-black text-slate-900 tracking-tight font-mono">
              {totalDepartments}
            </span>
            <span className="text-[11px] text-slate-600 font-bold flex items-center">
              <span className="w-1.5 h-1.5 rounded-full bg-[#007A61] mr-1.5"></span>
              Active Units
            </span>
          </div>
        </div>
        <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-400 font-medium">
          Core line departments &amp; administrative desks
        </div>
      </div>

      {/* Card 2: ASSIGNED NODAL OFFICERS */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs flex flex-col justify-between h-[135px]">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
              Nodal Officers
            </span>
            <Users className="w-4 h-4 text-[#007A61]" />
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-black text-[#007A61] tracking-tight font-mono">
              {totalOfficers}
            </span>
            <span className="text-[11px] text-[#007A61] font-bold">
              Assigned Leads
            </span>
          </div>
        </div>
        <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-400 font-medium">
          Assigned department admins &amp; nodal leads
        </div>
      </div>

      {/* Card 3: PROBLEM MANDATES */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs flex flex-col justify-between h-[135px]">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
              Problem Mandates
            </span>
            <AlertCircle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-black text-amber-800 tracking-tight font-mono">
              {totalChallenges}
            </span>
            <span className="text-[11px] text-amber-700 font-bold">
              Civic Telemetry
            </span>
          </div>
        </div>
        <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-400 font-medium">
          Civic grievances &amp; problem telemetry allocated
        </div>
      </div>

      {/* Card 4: COLLABORATIVE SOLUTIONS */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs flex flex-col justify-between h-[135px]">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
              R&amp;D Solutions
            </span>
            <FolderKanban className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-black text-indigo-700 tracking-tight font-mono">
              {activeProjects}
            </span>
            <span className="text-[11px] text-indigo-700 font-bold">
              Active Pilots
            </span>
          </div>
        </div>
        <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-400 font-medium">
          University &amp; industry collaborative solutions
        </div>
      </div>
    </div>
  );
};

export default DepartmentSummaryCards;
