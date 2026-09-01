import React from 'react';
import { BookOpen, User, GraduationCap, FlaskConical, Layers } from 'lucide-react';

export const UniversityCapacityStats = ({ quickSummary = {} }) => {
  return (
    <div className="bg-white p-4 sm:p-5 rounded-lg border border-slate-200/90 shadow-2xs space-y-3.5 select-none">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-1.5">
          <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
          <span>Capacity & Resource Strength</span>
        </h3>
        <span className="text-xs font-semibold text-slate-600">
          Status: <span className="font-bold text-emerald-600">{quickSummary?.capacityStatus || 'Available'}</span>
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
        <div className="bg-slate-50/60 border border-slate-200/80 rounded-md p-2.5 text-center">
          <BookOpen className="w-4 h-4 text-blue-600 mx-auto mb-1" />
          <div className="text-base font-black text-slate-900">{quickSummary?.departments ?? 0}</div>
          <div className="text-[10px] text-slate-400 font-medium mt-0.5">Departments</div>
        </div>

        <div className="bg-slate-50/60 border border-slate-200/80 rounded-md p-2.5 text-center">
          <User className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
          <div className="text-base font-black text-slate-900">{quickSummary?.totalFaculty ?? 0}</div>
          <div className="text-[10px] text-slate-400 font-medium mt-0.5">Total Faculty</div>
        </div>

        <div className="bg-slate-50/60 border border-slate-200/80 rounded-md p-2.5 text-center">
          <GraduationCap className="w-4 h-4 text-indigo-600 mx-auto mb-1" />
          <div className="text-base font-black text-slate-900">{quickSummary?.availableFaculty ?? 0}</div>
          <div className="text-[10px] text-slate-400 font-medium mt-0.5">Available Faculty</div>
        </div>

        <div className="bg-slate-50/60 border border-slate-200/80 rounded-md p-2.5 text-center">
          <FlaskConical className="w-4 h-4 text-amber-600 mx-auto mb-1" />
          <div className="text-base font-black text-slate-900">{quickSummary?.labsAndFacilities ?? 0}</div>
          <div className="text-[10px] text-slate-400 font-medium mt-0.5">Labs & Facilities</div>
        </div>

        <div className="bg-slate-50/60 border border-slate-200/80 rounded-md p-2.5 text-center">
          <Layers className="w-4 h-4 text-purple-600 mx-auto mb-1" />
          <div className="text-base font-black text-slate-900">{quickSummary?.activeProjects ?? 0}</div>
          <div className="text-[10px] text-slate-400 font-medium mt-0.5">Active Projects</div>
        </div>
      </div>
    </div>
  );
};

export default UniversityCapacityStats;
