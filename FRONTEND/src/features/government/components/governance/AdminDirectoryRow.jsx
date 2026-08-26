import React from 'react';
import { Eye, Pencil, Trash2, PauseCircle, PlayCircle } from 'lucide-react';

const getRoleTextStyle = (role) => {
  const map = {
    'Super Admin': 'text-purple-700 font-bold',
    'Nodal Officer': 'text-blue-700 font-bold',
    'District Admin': 'text-sky-700 font-bold',
    'HEI Admin': 'text-cyan-700 font-bold'
  };
  return map[role] || 'text-slate-700 font-semibold';
};

const getInitials = (name = '') => {
  const parts = name.trim().split(' ');
  return (parts.length >= 2 ? `${parts[0][0]}${parts[1][0]}` : name.slice(0, 2) || 'AD').toUpperCase();
};

export const AdminDirectoryRow = ({
  admin,
  index,
  onViewAdmin,
  onEditAdmin,
  onToggleStatus,
  onDeleteAdmin
}) => {
  const isSuspended = admin.status === 'Suspended' || admin.status === 'Inactive';

  return (
    <tr className="hover:bg-slate-50/70 transition-colors group select-none">
      {/* 0. S.No */}
      <td className="py-2.5 px-2.5 text-center font-mono text-[11px] font-semibold text-slate-400">
        {index}
      </td>

      {/* 1. Admin Info */}
      <td className="py-2.5 px-3">
        <div className="flex items-center space-x-2.5">
          <div className="w-7 h-7 rounded-md bg-slate-100 text-slate-700 font-bold text-[11px] flex items-center justify-center shrink-0 border border-slate-200/60">
            {getInitials(admin.fullName)}
          </div>
          <div className="min-w-0">
            <div
              className="font-bold text-slate-900 hover:text-blue-600 cursor-pointer text-xs leading-tight"
              onClick={() => onViewAdmin(admin)}
            >
              {admin.fullName}
            </div>
            <div className="text-[10px] text-slate-400 font-mono mt-0.5 truncate">{admin.email}</div>
          </div>
        </div>
      </td>

      {/* 2. Role */}
      <td className="py-2.5 px-2.5">
        <span className={`text-xs ${getRoleTextStyle(admin.role)}`}>{admin.role}</span>
        <div className="text-[10px] text-slate-400 mt-0.5">{admin.assignedDepartment || 'General Governance'}</div>
      </td>

      {/* 3. District */}
      <td className="py-2.5 px-2.5 font-semibold text-slate-700 text-[11px]">{admin.district}</td>

      {/* 4. Phone Number */}
      <td className="py-2.5 px-2.5 font-mono text-[11px] text-slate-600">{admin.mobileNumber}</td>

      {/* 5. Account Status */}
      <td className="py-2.5 px-2.5 whitespace-nowrap">
        <span
          className={`inline-flex items-center space-x-1.5 text-[11px] font-semibold ${
            !isSuspended ? 'text-emerald-600' : 'text-red-600'
          }`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${!isSuspended ? 'bg-emerald-500' : 'bg-red-500'}`} />
          <span>{admin.status}</span>
        </span>
      </td>

      {/* 6. Action Buttons */}
      <td className="py-2.5 px-3 text-right whitespace-nowrap">
        <div className="flex items-center justify-end space-x-1">
          <button
            type="button"
            onClick={() => onViewAdmin(admin)}
            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors cursor-pointer"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onEditAdmin(admin)}
            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors cursor-pointer"
            title="Edit Admin"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onToggleStatus(admin)}
            className={`p-1.5 rounded-md transition-colors cursor-pointer ${
              !isSuspended
                ? 'text-slate-400 hover:text-amber-600 hover:bg-amber-50'
                : 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50'
            }`}
            title={!isSuspended ? 'Suspend Admin' : 'Activate Admin'}
          >
            {!isSuspended ? <PauseCircle className="w-4 h-4" /> : <PlayCircle className="w-4 h-4" />}
          </button>
          <button
            type="button"
            onClick={() => onDeleteAdmin(admin.id)}
            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
            title="Delete Admin"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default AdminDirectoryRow;
