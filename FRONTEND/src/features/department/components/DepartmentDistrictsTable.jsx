import React from 'react';
import { Eye, EyeOff, Trash2 } from 'lucide-react';
import { MASKED_SHORT, getJurisdictionValue } from './departmentDistricts.helper.js';

export const DepartmentDistrictsTable = ({
  filtered = [],
  isBlockDept = false,
  isDistrictDept = false,
  getJurisdictionLabel,
  visiblePasswords = {},
  togglePasswordVisibility,
  setViewingDistrict,
  deletingId,
  handleDelete
}) => {
  if (filtered.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-8 text-center text-xs text-slate-400 font-medium">
          {isBlockDept
            ? 'No ward commissioners registered. Click "Add Ward Commissioner" to create credentials.'
            : isDistrictDept
            ? 'No blocks or tehsils registered. Click "Add Block / Tehsil" to create credentials.'
            : 'No district departments registered. Click "Add District" to create credentials.'}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-100 text-[10.5px] font-bold text-slate-400 uppercase tracking-wider">
              <th className="py-3 px-4">Department & Code</th>
              <th className="py-3 px-4">{getJurisdictionLabel()}</th>
              <th className="py-3 px-4">Fund Pool</th>
              <th className="py-3 px-4">Portal Login ID</th>
              <th className="py-3 px-4">Password</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((dist) => {
              const targetId = dist.deptId || dist.id || dist._id;
              const loginEmail = dist.headEmail || dist.credentials?.loginEmail || dist.credentials?.loginId || '-';
              const rowSecret = dist.credentials?.password || dist.credentials?.generatedPassword || '-';
              const isPasswordVisible = visiblePasswords[targetId] || false;
              const jurisdictionValue = getJurisdictionValue(dist, isBlockDept, isDistrictDept);

              return (
                <tr
                  key={targetId}
                  onClick={() => setViewingDistrict(dist)}
                  className="hover:bg-slate-50/70 transition-colors cursor-pointer group"
                >
                  <td className="py-3.5 px-4">
                    <div className="font-extrabold text-slate-900 group-hover:text-[#0f4b3a] transition-colors">
                      {dist.name}
                    </div>
                    <span className="text-[10px] font-mono font-bold text-[#0f4b3a] bg-[#0f4b3a]/10 px-1.5 py-0.2 rounded inline-block mt-0.5">
                      {dist.code || dist.deptId}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-800">
                    {jurisdictionValue}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-black text-emerald-700">
                    ₹ {(Number(dist.allocatedFundPool) || 0).toLocaleString('en-IN')}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[11px] text-slate-700">{loginEmail}</td>
                  <td className="py-3.5 px-4 font-mono text-[11px]">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-700 font-bold w-24 truncate text-center">
                        {rowSecret === '-' ? '-' : isPasswordVisible ? rowSecret : MASKED_SHORT}
                      </span>
                      {rowSecret !== '-' && (
                        <button
                          type="button"
                          onClick={(e) => togglePasswordVisibility(e, targetId)}
                          className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded transition-colors"
                          title={isPasswordVisible ? 'Hide Password' : 'Show Password'}
                        >
                          {isPasswordVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      )}
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        dist.status === 'Active' || !dist.status
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {dist.status || 'Active'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        title="View Department Details"
                        onClick={(e) => {
                          e.stopPropagation();
                          setViewingDistrict(dist);
                        }}
                        className="flex items-center gap-1 px-2.5 py-1 bg-[#0f4b3a]/10 hover:bg-[#0f4b3a] text-[#0f4b3a] hover:text-white font-bold text-[11px] rounded-lg border border-[#0f4b3a]/20 transition cursor-pointer shadow-2xs"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View</span>
                      </button>
                      <button
                        type="button"
                        title="Delete Department"
                        disabled={deletingId === targetId}
                        onClick={(e) => handleDelete(e, dist)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DepartmentDistrictsTable;
