import React from 'react';
import { JHARKHAND_DISTRICTS_LIST, ADMIN_ROLES_LIST } from '../../data/adminConstants.js';

const DEPARTMENTS = [
  'Select department',
  'Higher & Technical Education',
  'Science & Technology',
  'IT & e-Governance',
  'Tribal Welfare',
  'Urban Development'
];

const PRIMARY_ROLES = [
  'Select primary role',
  'Administrator',
  'Department Head',
  'Technical Officer',
  'District Nodal Lead',
  'Inspector'
];

const ACCESS_LEVELS = [
  'Select access level',
  'Full System Access',
  'District Level Access',
  'Read & Write',
  'Audit Only'
];

export const AdminFormRoleSection = ({ form, onChange }) => {
  return (
    <div className="space-y-2.5 pt-1 select-none">
      <h4 className="font-bold text-slate-900 text-xs tracking-tight">Role & Access Control</h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div>
          <label className="block text-[11px] font-semibold text-slate-700 mb-1">
            Role <span className="text-red-500">*</span>
          </label>
          <select
            value={form.role}
            onChange={(e) => onChange('role', e.target.value)}
            className="w-full px-3 py-1.5 bg-slate-50/60 border border-slate-200 rounded-none text-slate-700 outline-none text-xs"
          >
            {['Select role', ...ADMIN_ROLES_LIST.filter((r) => r !== 'All Roles')].map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-700 mb-1">
            Primary Role <span className="text-red-500">*</span>
          </label>
          <select
            value={form.primaryRole}
            onChange={(e) => onChange('primaryRole', e.target.value)}
            className="w-full px-3 py-1.5 bg-slate-50/60 border border-slate-200 rounded-none text-slate-700 outline-none text-xs"
          >
            {PRIMARY_ROLES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-700 mb-1">
            Access Level <span className="text-red-500">*</span>
          </label>
          <select
            value={form.accessLevel}
            onChange={(e) => onChange('accessLevel', e.target.value)}
            className="w-full px-3 py-1.5 bg-slate-50/60 border border-slate-200 rounded-none text-slate-700 outline-none text-xs"
          >
            {ACCESS_LEVELS.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-700 mb-1">
            Assigned Department <span className="text-red-500">*</span>
          </label>
          <select
            value={form.assignedDepartment}
            onChange={(e) => onChange('assignedDepartment', e.target.value)}
            className="w-full px-3 py-1.5 bg-slate-50/60 border border-slate-200 rounded-none text-slate-700 outline-none text-xs"
          >
            {DEPARTMENTS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-700 mb-1">
            District <span className="text-red-500">*</span>
          </label>
          <select
            value={form.district}
            onChange={(e) => onChange('district', e.target.value)}
            className="w-full px-3 py-1.5 bg-slate-50/60 border border-slate-200 rounded-none text-slate-700 outline-none text-xs"
          >
            {['Select district', ...JHARKHAND_DISTRICTS_LIST].map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-700 mb-1">Account Status</label>
          <select
            value={form.status}
            onChange={(e) => onChange('status', e.target.value)}
            className="w-full px-3 py-1.5 bg-slate-50/60 border border-slate-200 rounded-none text-slate-700 outline-none text-xs"
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default AdminFormRoleSection;
