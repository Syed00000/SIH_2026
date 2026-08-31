import React from 'react';
import { Loader2, Info } from 'lucide-react';

export const StudentTeamsTable = ({ loading, students = [] }) => {
  if (loading) {
    return (
      <div className="py-12 flex flex-col items-center justify-center space-y-2 text-slate-400 text-xs">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
        <span>Loading student roster...</span>
      </div>
    );
  }

  if (students.length === 0) {
    return (
      <div className="py-12 text-center text-slate-400 text-xs flex flex-col items-center justify-center">
        <Info className="w-6 h-6 text-slate-300 mb-1.5" />
        <span className="font-bold text-slate-700">No student innovators registered yet</span>
        <span className="text-[11px] text-slate-400 mt-0.5">Student teams allocated by mentors will appear in this directory.</span>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto text-left">
      <table className="w-full text-left text-xs border-collapse min-w-[700px]">
        <thead>
          <tr className="border-b border-slate-200/80 bg-slate-50 text-[10.5px] uppercase font-bold text-slate-500 select-none">
            <th className="py-2.5 px-3.5">Student Name & Roll No</th>
            <th className="py-2.5 px-3">Department & Year</th>
            <th className="py-2.5 px-3">Assigned Team</th>
            <th className="py-2.5 px-3">Innovation Challenge</th>
            <th className="py-2.5 px-3">Faculty Mentor</th>
            <th className="py-2.5 px-3 text-right">NEP Credits</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {students.map((s, idx) => (
            <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
              <td className="py-3 px-3.5">
                <div className="font-bold text-slate-900">{s.name}</div>
                <div className="font-mono text-[10.5px] text-slate-400">{s.rollNo}</div>
              </td>
              <td className="py-3 px-3 text-slate-600">
                <div>{s.department}</div>
                <div className="text-[10px] text-slate-400">{s.year}</div>
              </td>
              <td className="py-3 px-3">
                <span className="px-2 py-0.5 rounded text-[10.5px] font-semibold bg-purple-50 text-purple-700 border border-purple-100">
                  {s.teamName}
                </span>
              </td>
              <td className="py-3 px-3 font-medium text-slate-900 max-w-[200px] truncate">
                {s.project}
              </td>
              <td className="py-3 px-3 text-slate-600 font-medium">
                {s.mentor}
              </td>
              <td className="py-3 px-3 text-right">
                <span className="px-2 py-0.5 rounded text-[10.5px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {s.nepCredits}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentTeamsTable;
