import React, { useState } from 'react';
import { Eye, Pencil, Trash2, PauseCircle, PlayCircle, Landmark, Home, MapPin, KeyRound, Check } from 'lucide-react';

export const DepartmentTable = ({
  departments = [],
  onViewDetails,
  onEdit,
  onToggleStatus,
  onDelete
}) => {
  const [copiedId, setCopiedId] = useState(null);

  const copyCreds = (dept) => {
    const idKey = dept.deptId || dept.id || dept._id;
    const digits = (dept.deptId || '').replace(/\D/g, '') || '2026';
    const pass = dept.credentials?.password || dept.credentials?.generatedPassword || `Dept@JH${digits}!`;
    const loginEmail = dept.credentials?.loginEmail || dept.headEmail || `${(dept.deptId || 'dept').toLowerCase()}@jharkhand.gov.in`;
    navigator.clipboard.writeText(`Department ID / Email: ${loginEmail}\nPassword: ${pass}`);
    setCopiedId(idKey);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden select-none">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <th className="py-3 px-3 text-center w-12">#</th>
              <th className="py-3 px-3">Department / Office</th>
              <th className="py-3 px-3">Category</th>
              <th className="py-3 px-3">Department Head / Mukhiya</th>
              <th className="py-3 px-3">Jurisdiction</th>
              <th className="py-3 px-3 text-center">Officers</th>
              <th className="py-3 px-3 text-center">Problems</th>
              <th className="py-3 px-3 text-center">Status</th>
              <th className="py-3 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {departments.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-8 text-center text-slate-400 font-medium">
                  No departments found. Click "+ Add Department" to create one.
                </td>
              </tr>
            ) : (
              departments.map((dept, idx) => {
                const isGramPanchayat = dept.category === 'Gram Panchayat';
                const isInactive = dept.status === 'Inactive' || dept.status === 'Suspended';
                const idKey = dept.deptId || dept.id || dept._id;
                const isCopied = copiedId === idKey;

                const locationStr = isGramPanchayat
                  ? [dept.panchayat, dept.block, dept.district].filter(Boolean).join(', ')
                  : `${dept.district} District`;

                return (
                  <tr key={idKey} className="hover:bg-slate-50/70 transition-colors group">
                    <td className="py-3 px-3 text-center font-mono text-slate-400 font-bold">{idx + 1}</td>

                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                          isGramPanchayat ? 'bg-amber-50 text-amber-700' : 'bg-[#007A61]/10 text-[#007A61]'
                        }`}>
                          {isGramPanchayat ? <Home className="w-4 h-4" /> : <Landmark className="w-4 h-4" />}
                        </div>
                        <div className="min-w-0">
                          <div
                            onClick={() => onViewDetails && onViewDetails(dept)}
                            className="font-bold text-slate-900 group-hover:text-[#007A61] cursor-pointer text-xs truncate max-w-xs transition-colors"
                          >
                            {dept.name}
                          </div>
                          <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono mt-0.5">
                            <span className="bg-slate-100 px-1 rounded font-bold text-slate-600">{dept.deptId || dept.code}</span>
                            <span>•</span>
                            <button
                              type="button"
                              onClick={() => copyCreds(dept)}
                              className="text-amber-700 hover:text-amber-800 font-bold flex items-center gap-1 cursor-pointer bg-amber-50 px-1 rounded border border-amber-200"
                              title="Copy ID & Password"
                            >
                              {isCopied ? <Check className="w-2.5 h-2.5 text-emerald-600" /> : <KeyRound className="w-2.5 h-2.5" />}
                              <span>{isCopied ? 'Copied!' : 'ID/Pass'}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${
                        isGramPanchayat ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      }`}>
                        {dept.category || 'District Department'}
                      </span>
                    </td>

                    <td className="py-3 px-3">
                      <div className="min-w-0">
                        <span className="font-extrabold text-slate-800 block truncate">{dept.headName || 'Pending Assignment'}</span>
                        <span className="text-[10px] text-slate-400 font-medium block truncate">{dept.headRole || 'Department Head'}</span>
                        {dept.headEmail && <span className="text-[10px] font-mono text-slate-500 block truncate">{dept.headEmail}</span>}
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1 text-slate-600 truncate max-w-xs">
                        <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                        <span className="text-[11px] truncate font-medium">{locationStr}</span>
                      </div>
                    </td>

                    <td className="py-3 px-3 text-center font-black text-slate-800">{dept.officersCount || 0}</td>

                    <td className="py-3 px-3 text-center">
                      <span className={`font-black text-xs ${(dept.problemsCount || 0) > 0 ? 'text-amber-700' : 'text-slate-400'}`}>
                        {dept.problemsCount || 0}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-center whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        !isInactive ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${!isInactive ? 'bg-emerald-500' : 'bg-red-500'}`} />
                        <span>{!isInactive ? 'Active' : 'Inactive'}</span>
                      </span>
                    </td>

                    <td className="py-3 px-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end space-x-1">
                        <button
                          type="button"
                          onClick={() => onViewDetails && onViewDetails(dept)}
                          className="p-1.5 text-slate-400 hover:text-[#007A61] hover:bg-[#007A61]/10 rounded-lg transition-colors cursor-pointer"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onEdit && onEdit(dept)}
                          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                          title="Edit Department"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onToggleStatus && onToggleStatus(dept)}
                          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                            !isInactive ? 'text-slate-400 hover:text-amber-600 hover:bg-amber-50' : 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50'
                          }`}
                          title={!isInactive ? 'Deactivate' : 'Activate'}
                        >
                          {!isInactive ? <PauseCircle className="w-4 h-4" /> : <PlayCircle className="w-4 h-4" />}
                        </button>
                        <button
                          type="button"
                          onClick={() => onDelete && onDelete(dept)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete Department"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DepartmentTable;
