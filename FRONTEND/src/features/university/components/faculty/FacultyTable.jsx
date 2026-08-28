import React from 'react';
import { MoreVertical, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

export const FacultyTable = ({
  facultyList = [],
  selectedFacultyId,
  onSelectFaculty,
  loading = false
}) => {
  if (loading) {
    return (
      <div className="bg-white border border-slate-200 rounded-none overflow-hidden select-none shadow-2xs">
        <div className="px-3.5 py-2.5 border-b border-slate-200 bg-slate-50">
          <div className="h-3 bg-slate-200 rounded-none w-32 animate-pulse"></div>
        </div>
        <div className="p-4 space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-10 bg-slate-100 rounded-none animate-pulse flex items-center justify-between px-3">
              <div className="flex items-center space-x-3 w-1/3">
                <div className="w-6 h-6 rounded-full bg-slate-200"></div>
                <div className="h-3 bg-slate-200 w-28"></div>
              </div>
              <div className="h-3 bg-slate-200 w-24"></div>
              <div className="h-3 bg-slate-200 w-16"></div>
              <div className="h-5 bg-slate-200 w-20"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-none overflow-hidden flex flex-col justify-between select-none shadow-2xs">
      <div className="px-3.5 py-2.5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
        <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
          Faculty List <span className="font-mono">({facultyList.length})</span>
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-700">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[10.5px]">
            <tr>
              <th className="py-2.5 px-3 w-8">
                <input type="checkbox" className="rounded-none cursor-pointer" />
              </th>
              <th className="py-2.5 px-3">Faculty</th>
              <th className="py-2.5 px-3">Department</th>
              <th className="py-2.5 px-3">Expertise / Skills</th>
              <th className="py-2.5 px-3">Experience</th>
              <th className="py-2.5 px-3">Status</th>
              <th className="py-2.5 px-3">Availability</th>
              <th className="py-2.5 px-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {facultyList.map((f, i) => {
              const isSelected = selectedFacultyId === (f._id || f.name);
              const initials = f.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();

              return (
                <tr
                  key={f._id || i}
                  onClick={() => onSelectFaculty(f)}
                  className={`cursor-pointer transition-colors ${
                    isSelected ? 'bg-slate-100 border-l-4 border-l-slate-900' : 'hover:bg-slate-50'
                  }`}
                >
                  <td className="py-2.5 px-3" onClick={(e) => e.stopPropagation()}>
                    <input type="checkbox" className="rounded-none cursor-pointer" />
                  </td>
                  <td className="py-2.5 px-3 whitespace-nowrap">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-[11px] shrink-0">
                        {initials}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">{f.name}</div>
                        <div className="text-[10px] text-slate-500 font-mono">{f.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-2.5 px-3 font-semibold text-slate-800">{f.department}</td>
                  <td className="py-2.5 px-3">
                    <div className="flex flex-wrap gap-1">
                      {(f.specialization || ['Water Quality', 'IoT']).slice(0, 3).map((s, idx) => (
                        <span key={idx} className="px-1.5 py-0.2 bg-slate-100 border border-slate-200 rounded-none text-[10px] font-semibold text-slate-800">
                          {s}
                        </span>
                      ))}
                      {(f.specialization?.length || 0) > 3 && (
                        <span className="text-[10px] text-slate-400 font-mono">+{f.specialization.length - 3}</span>
                      )}
                    </div>
                  </td>
                  <td className="py-2.5 px-3 font-mono text-slate-800">{f.experience || '10 Years'}</td>
                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 rounded-none text-[10.5px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-300">
                      {f.status || 'Active'}
                    </span>
                  </td>
                  <td className="py-2.5 px-3">
                    <span className={`px-2 py-0.5 rounded-none text-[10.5px] font-bold ${
                      f.availabilityStatus === 'Available'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                        : f.availabilityStatus === 'In Project'
                        ? 'bg-amber-50 text-amber-800 border border-amber-300'
                        : 'bg-rose-50 text-rose-800 border border-rose-300'
                    }`}>
                      {f.availabilityStatus || 'Available'}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end space-x-1.5">
                      <button
                        onClick={() => onSelectFaculty(f)}
                        className="px-2.5 py-1 bg-slate-900 hover:bg-black text-white rounded-none text-xs font-bold transition-colors cursor-pointer"
                      >
                        View Profile
                      </button>
                      <button className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer">
                        <MoreVertical className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="px-3.5 py-2 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 bg-slate-50">
        <div>Showing 1 to {Math.min(7, facultyList.length)} of {facultyList.length} faculty</div>
        <div className="flex items-center space-x-1">
          <button className="p-1 border border-slate-200 rounded-none hover:bg-slate-100 text-slate-600">
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button className="w-5 h-5 bg-slate-900 text-white rounded-none font-bold text-xs flex items-center justify-center">1</button>
          <button className="w-5 h-5 border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-none text-xs flex items-center justify-center">2</button>
          <button className="p-1 border border-slate-200 rounded-none hover:bg-slate-100 text-slate-600">
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FacultyTable;
