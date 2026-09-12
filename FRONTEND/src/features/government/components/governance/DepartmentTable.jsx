import React, { useState } from 'react';
import { Eye, Pencil, Trash2, PauseCircle, PlayCircle, Landmark, Home, MapPin, KeyRound, Check, EyeOff } from 'lucide-react';

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
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <th className="py-3 px-4">DEPARTMENT & CODE</th>
              <th className="py-3 px-3">DISTRICT / JURISDICTION</th>
              <th className="py-3 px-3">PORTAL LOGIN ID</th>
              <th className="py-3 px-3">PASSWORD</th>
              <th className="py-3 px-3 text-center">STATUS</th>
              <th className="py-3 px-4 text-right">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {departments.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-400 font-medium">
                  No departments found. Click "+ Add Department" to create one.
                </td>
              </tr>
            ) : (
              departments.map((dept) => {
                const isGramPanchayat = dept.category === 'Gram Panchayat';
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
                  <tr key={idKey} className="hover:bg-slate-50/70 transition-colors group">
                    <td 
                      className="py-3 px-4 cursor-pointer"
                      onClick={() => onViewDetails && onViewDetails(dept)}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                          isGramPanchayat ? 'bg-amber-50 text-amber-700' : 'bg-[#007A61]/10 text-[#007A61]'
                        }`}>
                          {isGramPanchayat ? <Home className="w-4 h-4" /> : <Landmark className="w-4 h-4" />}
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-slate-900 group-hover:text-[#007A61] text-xs truncate max-w-xs transition-colors">
                            {dept.name}
                          </div>
                          <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono mt-0.5">
                            <span className="bg-slate-100 px-1 rounded font-bold text-slate-600">{dept.deptId || dept.code}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td 
                      className="py-3 px-3 cursor-pointer"
                      onClick={() => onViewDetails && onViewDetails(dept)}
                    >
                      <span className="font-bold text-slate-800">{locationStr}</span>
                    </td>

                    <td 
                      className="py-3 px-3 cursor-pointer"
                      onClick={() => onViewDetails && onViewDetails(dept)}
                    >
                      <span className="font-mono text-slate-500 font-medium">{loginEmail}</span>
                    </td>

                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold bg-slate-100 px-2 py-1 rounded text-slate-700 w-28 truncate">
                          {password === '-' ? '-' : (isPasswordVisible ? password : '••••••••')}
                        </span>
                        {password !== '-' && (
                          <button
                            type="button"
                            onClick={() => togglePasswordVisibility(idKey)}
                            className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded transition-colors"
                            title={isPasswordVisible ? "Hide Password" : "Show Password"}
                          >
                            {isPasswordVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        )}
                      </div>
                    </td>

                    <td 
                      className="py-3 px-3 text-center whitespace-nowrap cursor-pointer"
                      onClick={() => onViewDetails && onViewDetails(dept)}
                    >
                      <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        !isInactive ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${!isInactive ? 'bg-emerald-500' : 'bg-red-500'}`} />
                        <span>{!isInactive ? 'Active' : 'Inactive'}</span>
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end space-x-1">
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
