import React from 'react';
import { Users, GraduationCap, Award } from 'lucide-react';

export const StudentTeamsKpis = ({ totalStudents, totalTeams, nepCreditsCount }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
      <div className="bg-white border border-slate-200/80 rounded-xl p-3.5 shadow-2xs flex items-center justify-between">
        <div>
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Total Innovators</span>
          <div className="text-xl font-black text-slate-900 mt-0.5">{totalStudents}</div>
        </div>
        <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
          <Users className="w-4 h-4" />
        </div>
      </div>

      <div className="bg-white border border-slate-200/80 rounded-xl p-3.5 shadow-2xs flex items-center justify-between">
        <div>
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Allocated Project Teams</span>
          <div className="text-xl font-black text-slate-900 mt-0.5">{totalTeams}</div>
        </div>
        <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
          <GraduationCap className="w-4 h-4" />
        </div>
      </div>

      <div className="bg-white border border-slate-200/80 rounded-xl p-3.5 shadow-2xs flex items-center justify-between">
        <div>
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">NEP Credit Beneficiaries</span>
          <div className="text-xl font-black text-slate-900 mt-0.5">{nepCreditsCount}</div>
        </div>
        <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
          <Award className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
};

export default StudentTeamsKpis;
