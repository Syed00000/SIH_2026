import React from 'react';
import { Landmark, MoreVertical, Eye, Edit2, ShieldAlert, CheckCircle2 } from 'lucide-react';

export const StateDepartmentTable = ({ departments, viewMode, onViewDetails, onEdit }) => {
  if (departments.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-2xs">
        <Landmark className="w-12 h-12 text-slate-300 mx-auto mb-4" />
        <h3 className="text-sm font-bold text-slate-700">No State Departments Found</h3>
        <p className="text-xs text-slate-500 mt-1">There are currently no state departments matching your criteria.</p>
      </div>
    );
  }

  if (viewMode === 'grid') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {departments.map((dept) => (
          <div key={dept.deptId || dept._id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs hover:shadow-md transition-shadow relative group">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                  <Landmark className="w-5 h-5 text-slate-600" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 leading-tight">{dept.name}</h3>
                  <p className="text-[11px] font-bold text-slate-500 mt-0.5">{dept.deptId}</p>
                </div>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">HOD:</span>
                <span className="font-bold text-slate-900 truncate max-w-[150px]">{dept.headName || 'Not Assigned'}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Status:</span>
                <span className={`font-bold ${dept.status === 'Active' ? 'text-[#007A61]' : 'text-slate-400'}`}>
                  {dept.status || 'Draft'}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => onViewDetails(dept)}
                className="text-xs font-bold text-[#007A61] hover:text-[#00604c] flex items-center space-x-1"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View Details</span>
              </button>
              <button
                onClick={() => onEdit(dept)}
                className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center space-x-1"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-2xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-200">
              <th className="px-5 py-3 text-[10px] font-black text-slate-500 uppercase tracking-wider w-[60px]">#</th>
              <th className="px-5 py-3 text-[10px] font-black text-slate-500 uppercase tracking-wider">Department Identity</th>
              <th className="px-5 py-3 text-[10px] font-black text-slate-500 uppercase tracking-wider">Head of Department</th>
              <th className="px-5 py-3 text-[10px] font-black text-slate-500 uppercase tracking-wider">Hierarchy</th>
              <th className="px-5 py-3 text-[10px] font-black text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-5 py-3 text-[10px] font-black text-slate-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {departments.map((dept, index) => (
              <tr key={dept.deptId || dept._id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-5 py-4 text-xs font-bold text-slate-400">{index + 1}</td>
                <td className="px-5 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                      <Landmark className="w-4 h-4 text-slate-600" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">{dept.name}</div>
                      <div className="text-[10px] font-bold text-slate-500 mt-0.5 uppercase tracking-wider">{dept.deptId}</div>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <div className="text-xs font-bold text-slate-900">{dept.headName || 'Not Assigned'}</div>
                  <div className="text-[10px] text-slate-500">{dept.headRole || 'HOD'}</div>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center space-x-1 flex-wrap gap-y-1">
                    {(dept.hierarchyConfig || []).map((level, i) => (
                      <span key={i} className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-slate-100 text-slate-600 whitespace-nowrap border border-slate-200">
                        {level}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center space-x-1.5">
                    {dept.status === 'Active' ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#007A61]" />
                    ) : (
                      <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
                    )}
                    <span className={`text-[11px] font-bold ${dept.status === 'Active' ? 'text-[#007A61]' : 'text-amber-600'}`}>
                      {dept.status || 'Draft'}
                    </span>
                  </div>
                </td>
                <td className="px-5 py-4 text-right">
                  <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onViewDetails(dept)}
                      className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-600 transition-colors"
                      title="View Profile"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onEdit(dept)}
                      className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-600 transition-colors"
                      title="Edit Configuration"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
