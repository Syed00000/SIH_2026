import React, { useState } from 'react';
import { Building2, Plus, Eye, Edit2, Trash2, ShieldCheck, Mail, Phone, Search } from 'lucide-react';
import departmentService from '../../government/services/departmentService.js';

export const BlockDepartmentsPanel = ({
  departments = [],
  block,
  onAddDept,
  onViewDept,
  onEditDept,
  onDeletedDept
}) => {
  const [search, setSearch] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  const filtered = departments.filter((d) => {
    const q = search.toLowerCase();
    return (
      (d.name || '').toLowerCase().includes(q) ||
      (d.code || '').toLowerCase().includes(q) ||
      (d.deptId || '').toLowerCase().includes(q) ||
      (d.headName || '').toLowerCase().includes(q)
    );
  });

  const handleDelete = async (dept) => {
    const deptId = dept.deptId || dept.id || dept._id;
    if (!window.confirm(`Are you sure you want to delete the department "${dept.name}"?`)) return;
    try {
      setDeletingId(deptId);
      await departmentService.deleteDepartment(deptId);
      if (onDeletedDept) onDeletedDept(deptId);
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Failed to delete department');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-4 text-left select-none">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#007A61]/10 text-[#007A61] flex items-center justify-center shrink-0">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-black text-slate-900 leading-tight">Block Departments ({departments.length})</h2>
            <p className="text-xs text-slate-500">Manage departmental wings & portal access credentials</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search departments..."
              className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#007A61]"
            />
          </div>
          <button
            type="button"
            onClick={onAddDept}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#007A61] hover:bg-[#006651] text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Department</span>
          </button>
        </div>
      </div>

      {/* Departments Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400 font-medium">
            No block departments found. Click "Add Department" to configure one.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-100 text-[10.5px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-4">Department & Code</th>
                  <th className="py-3 px-4">In-Charge Officer</th>
                  <th className="py-3 px-4">Portal Login ID</th>
                  <th className="py-3 px-4">Password</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((dept) => {
                  const targetId = dept.deptId || dept.id || dept._id;
                  const loginEmail = dept.credentials?.loginEmail || dept.headEmail || 'dept@jharkhand.gov.in';
                  const password = dept.credentials?.password || dept.credentials?.generatedPassword || '••••••••';
                  return (
                    <tr
                      key={targetId}
                      onClick={() => onViewDept && onViewDept(dept)}
                      className="hover:bg-slate-50/70 transition-colors cursor-pointer group"
                    >
                      <td className="py-3.5 px-4">
                        <div className="font-extrabold text-slate-900 group-hover:text-[#007A61] transition-colors">{dept.name}</div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-[10px] font-mono font-bold text-[#007A61] bg-[#007A61]/10 px-1.5 py-0.2 rounded">
                            {dept.code || dept.deptId}
                          </span>
                          <span className="text-[10px] text-slate-400">{dept.category || 'Block Office'}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-800">{dept.headName || 'Officer in Charge'}</div>
                        <div className="text-[10px] text-slate-500">{dept.headPhone || '0651-2450000'}</div>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-700">
                        {loginEmail}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-600">
                        <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-700 font-bold">
                          {password}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            title="View Department Details"
                            onClick={(e) => {
                              e.stopPropagation();
                              onViewDept && onViewDept(dept);
                            }}
                            className="flex items-center gap-1 px-2.5 py-1 bg-[#007A61]/10 hover:bg-[#007A61] text-[#007A61] hover:text-white font-bold text-[11px] rounded-lg border border-[#007A61]/20 transition cursor-pointer shadow-2xs"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View</span>
                          </button>
                          <button
                            type="button"
                            title="Edit Department"
                            onClick={(e) => {
                              e.stopPropagation();
                              onEditDept && onEditDept(dept);
                            }}
                            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            title="Delete Department"
                            disabled={deletingId === targetId}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(dept);
                            }}
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
    </div>
  );
};

export default BlockDepartmentsPanel;
