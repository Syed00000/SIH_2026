import React, { useState } from 'react';
import { Building2, Plus, Eye, EyeOff, Trash2, Search } from 'lucide-react';
import departmentService from '../../government/services/departmentService.js';
import { ViewDistrictModal } from './ViewDistrictModal.jsx';

export const DepartmentDistrictsPanel = ({
  districts = [],
  isDistrictDept = false,
  isBlockDept = false,
  onAddDistrict,
  onDeletedDistrict
}) => {
  const [search, setSearch] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [visiblePasswords, setVisiblePasswords] = useState({});
  const [viewingDistrict, setViewingDistrict] = useState(null);

  const filtered = districts.filter((d) => {
    const q = search.toLowerCase();
    return (
      (d.name || '').toLowerCase().includes(q) ||
      (d.district || '').toLowerCase().includes(q) ||
      (d.code || '').toLowerCase().includes(q) ||
      (d.headEmail || d.credentials?.loginEmail || '').toLowerCase().includes(q)
    );
  });

  const handleDelete = async (e, dist) => {
    e.stopPropagation();
    const distId = dist.id || dist._id;
    if (!window.confirm(`Are you sure you want to remove district department "${dist.name}"?`)) return;
    try {
      setDeletingId(distId);
      await departmentService.deleteDepartment(distId);
      if (onDeletedDistrict) onDeletedDistrict(distId);
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Failed to delete district department');
    } finally {
      setDeletingId(null);
    }
  };

  const togglePasswordVisibility = (e, idKey) => {
    e.stopPropagation();
    setVisiblePasswords(prev => ({
      ...prev,
      [idKey]: !prev[idKey]
    }));
  };

  return (
    <div className="space-y-4 text-left select-none animate-in fade-in duration-150">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#0f4b3a]/10 text-[#0f4b3a] flex items-center justify-center shrink-0">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-black text-slate-900 leading-tight">
              {isBlockDept ? 'Ward Commissioners' : (isDistrictDept ? 'Block & Tehsil Offices' : 'District Departments')} ({districts.length})
            </h2>
            <p className="text-xs text-slate-500">
              {isBlockDept ? 'Manage ward-level offices & portal access credentials' : (isDistrictDept ? 'Manage local block/tehsil bodies & portal access' : 'Manage district-level departments & portal access credentials')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-56">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={isBlockDept ? "Search wards..." : (isDistrictDept ? "Search blocks & tehsils..." : "Search districts...")}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#0f4b3a]"
            />
          </div>
          <button
            type="button"
            onClick={onAddDistrict}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0f4b3a] hover:bg-[#0a3a2c] text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>{isBlockDept ? 'Add Ward Commissioner' : (isDistrictDept ? 'Add Block / Tehsil' : 'Add District')}</span>
          </button>
        </div>
      </div>

      {/* Content: Desktop Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400 font-medium">
            {isBlockDept ? 'No ward commissioners registered. Click "Add Ward Commissioner" to create credentials.' : (isDistrictDept ? 'No blocks or tehsils registered. Click "Add Block / Tehsil" to create credentials.' : 'No district departments registered. Click "Add District" to create credentials.')}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-100 text-[10.5px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-4">Department & Code</th>
                  <th className="py-3 px-4">{isBlockDept ? 'Ward' : (isDistrictDept ? 'Block / Jurisdiction' : 'District')}</th>
                  <th className="py-3 px-4">Portal Login ID</th>
                  <th className="py-3 px-4">Password</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((dist) => {
                  const targetId = dist.id || dist._id;
                  // Use only database values, no fallback generated mock data
                  const loginEmail = dist.headEmail || dist.credentials?.loginEmail || '-';
                  const password = dist.credentials?.password || '-';
                  const isPasswordVisible = visiblePasswords[targetId] || false;

                  return (
                    <tr 
                      key={targetId} 
                      onClick={() => setViewingDistrict(dist)}
                      className="hover:bg-slate-50/70 transition-colors cursor-pointer group"
                    >
                      <td className="py-3.5 px-4">
                        <div className="font-extrabold text-slate-900 group-hover:text-[#0f4b3a] transition-colors">{dist.name}</div>
                        <span className="text-[10px] font-mono font-bold text-[#0f4b3a] bg-[#0f4b3a]/10 px-1.5 py-0.2 rounded inline-block mt-0.5">
                          {dist.code}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-800">{isBlockDept ? (dist.ward || dist.applicableJurisdiction || dist.district) : (isDistrictDept ? (dist.block || dist.applicableJurisdiction || dist.district) : dist.district)}</td>
                      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-700">{loginEmail}</td>
                      <td className="py-3.5 px-4 font-mono text-[11px]">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-700 font-bold w-24 truncate text-center">
                            {password === '-' ? '-' : (isPasswordVisible ? password : '••••••••')}
                          </span>
                          {password !== '-' && (
                            <button
                              type="button"
                              onClick={(e) => togglePasswordVisibility(e, targetId)}
                              className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded transition-colors"
                              title={isPasswordVisible ? "Hide Password" : "Show Password"}
                            >
                              {isPasswordVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                            </button>
                          )}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          dist.status === 'Active' ? 'bg-emerald-100 text-emerald-800' :
                          'bg-slate-100 text-slate-600'
                        }`}>
                          {dist.status || 'Active'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
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
        )}
      </div>

      <ViewDistrictModal 
        isOpen={Boolean(viewingDistrict)}
        onClose={() => setViewingDistrict(null)}
        district={viewingDistrict}
      />
    </div>
  );
};

export default DepartmentDistrictsPanel;
