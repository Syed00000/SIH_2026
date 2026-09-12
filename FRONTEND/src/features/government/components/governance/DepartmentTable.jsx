import React, { useState } from 'react';
import { Eye, Pencil, Trash2, PauseCircle, PlayCircle, Landmark, Home, MapPin, KeyRound, Check, EyeOff, ShieldCheck } from 'lucide-react';

export const DepartmentTable = ({
  departments = [],
  onViewDetails,
  onEdit,
  onToggleStatus,
  onDelete
}) => {
  const [copiedId, setCopiedId] = useState(null);
  const [visiblePasswords, setVisiblePasswords] = useState({});

  const copyCreds = (dept) => {
    const idKey = dept.deptId || dept.id || dept._id;
    const pass = dept.credentials?.password || dept.credentials?.generatedPassword || '';
    const loginEmail = dept.credentials?.loginEmail || dept.headEmail || '';
    if (loginEmail || pass) {
      navigator.clipboard.writeText(`Department ID / Email: ${loginEmail}\nPassword: ${pass}`);
      setCopiedId(idKey);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const togglePasswordVisibility = (idKey) => {
    setVisiblePasswords(prev => ({
      ...prev,
      [idKey]: !prev[idKey]
    }));
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden select-none">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold text-slate-500 uppercase">
              <th className="py-3.5 px-4">Department ID &amp; Name</th>
              <th className="py-3.5 px-4">Jurisdiction &amp; Officers</th>
              <th className="py-3.5 px-4">Portal Login ID</th>
              <th className="py-3.5 px-4">Access Key</th>
              <th className="py-3.5 px-4 text-center">Status</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {departments.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-slate-400 font-medium">
                  <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-2">
                    <Landmark className="w-5 h-5" />
                  </div>
                  <p className="font-bold text-slate-700">No departments found matching the filter</p>
                  <p className="text-slate-400 text-xs">Try adjusting your search query or status filter.</p>
                </td>
              </tr>
            ) : (
              departments.map((dept) => {
                const isGramPanchayat = dept.category === 'Gram Panchayat' || dept.category === 'Ward Commissioner';
                const isInactive = dept.status === 'Inactive' || dept.status === 'Suspended';
                const idKey = dept.deptId || dept.id || dept._id;
                const isCopied = copiedId === idKey;
                const isPasswordVisible = visiblePasswords[idKey] || false;

                const locationStr = isGramPanchayat
                  ? [dept.panchayat, dept.block, dept.district].filter(Boolean).join(', ')
                  : dept.district ? `${dept.district} District` : dept.applicableJurisdiction || 'State Wide';

                const loginEmail = dept.credentials?.loginEmail || dept.headEmail || '-';
                const password = dept.credentials?.password || dept.credentials?.generatedPassword || '-';

                return (
                  <tr
                    key={idKey}
                    onClick={() => onViewDetails && onViewDetails(dept)}
                    className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                  >
                    {/* ID & Name */}
                    <td className="py-4 px-4">
                      <div className="space-y-0.5">
                        <span className="font-mono text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                          {dept.deptId || dept.code}
                        </span>
                        <h4 className="font-bold text-slate-900 text-xs line-clamp-1">{dept.name}</h4>
                        <span className="text-[10px] text-slate-500 font-medium">{dept.category}</span>
                      </div>
                    </td>

                    {/* Location & Officers */}
                    <td className="py-4 px-4">
                      <div className="space-y-0.5">
                        <span className="font-bold text-slate-900 block">{locationStr}</span>
                        <span className="text-[11px] text-slate-500 font-medium">Head: {dept.headName || 'Not Assigned'}</span>
                      </div>
                    </td>

                    {/* Login ID */}
                    <td className="py-4 px-4 font-mono text-xs">
                      <span className="font-medium text-slate-700 break-all">{loginEmail}</span>
                    </td>

                    {/* Access Key / Password */}
                    <td className="py-4 px-4 font-mono text-xs" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold bg-slate-100 px-2 py-0.5 rounded border border-slate-200 text-slate-700 tracking-wider">
                          {password === '-' ? '-' : (isPasswordVisible ? password : '••••••••')}
                        </span>
                        {password !== '-' && (
                          <button
                            type="button"
                            onClick={() => togglePasswordVisibility(idKey)}
                            className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors"
                            title={isPasswordVisible ? "Hide Password" : "Show Password"}
                          >
                            {isPasswordVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        )}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-4 text-center whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        !isInactive
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${!isInactive ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                        <span>{!isInactive ? 'Active' : 'Inactive'}</span>
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end space-x-1.5">
                        <button
                          type="button"
                          onClick={() => copyCreds(dept)}
                          className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                          title="Copy ID & Password"
                        >
                          {isCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <KeyRound className="w-4 h-4" />}
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
                          onClick={() => onViewDetails && onViewDetails(dept)}
                          className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs shadow-2xs cursor-pointer ml-1"
                        >
                          <Eye className="w-3.5 h-3.5 text-slate-400" />
                          <span>View</span>
                        </button>
                        {onDelete && (
                          <button
                            type="button"
                            onClick={() => onDelete && onDelete(dept)}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete Department"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
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
