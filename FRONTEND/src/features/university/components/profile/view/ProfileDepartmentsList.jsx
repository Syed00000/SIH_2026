import React from 'react';
import { BookOpen } from 'lucide-react';

export const ProfileDepartmentsList = ({ departments = [] }) => {
  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs space-y-3 text-left">
      <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
        <BookOpen className="w-4 h-4 text-slate-700" />
        <h3 className="text-sm font-extrabold text-slate-900">Academic & Technical Departments</h3>
        <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full border border-slate-200">
          {departments.length}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
        {departments.map((d, idx) => (
          <div
            key={idx}
            className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between"
          >
            <span className="font-bold text-slate-800">{d.name}</span>
            <span className="text-[10.5px] font-semibold text-slate-500 font-mono">
              {d.facultyCount || 10} Faculty
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfileDepartmentsList;
