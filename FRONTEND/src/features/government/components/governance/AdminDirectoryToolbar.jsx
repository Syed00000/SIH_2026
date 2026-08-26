import React from 'react';
import { Search, ChevronDown, RotateCcw } from 'lucide-react';
import { JHARKHAND_DISTRICTS_LIST } from '../../data/mockGovernmentData.js';
import { ADMIN_ROLES_LIST, ADMIN_STATUS_LIST } from '../../data/mockAdminData.js';

export const AdminDirectoryToolbar = ({
  searchTerm,
  onSearchChange,
  selectedRole,
  onRoleChange,
  selectedStatus,
  onStatusChange,
  selectedDistrict,
  onDistrictChange,
  onResetFilters
}) => {
  return (
    <div className="flex flex-wrap items-center gap-2.5 select-none">
      {/* Search Input Bar */}
      <div className="relative flex-1 min-w-[220px]">
        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search by name, email or role..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-9 pr-3.5 py-1.5 bg-slate-50/60 border border-slate-200 rounded-md text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all shadow-2xs"
        />
      </div>

      {/* Role Filter */}
      <div className="relative min-w-[130px]">
        <select
          value={selectedRole}
          onChange={(e) => onRoleChange(e.target.value)}
          className="w-full bg-slate-50/60 border border-slate-200 rounded-md px-2.5 py-1.5 pr-7 text-xs font-medium text-slate-700 hover:border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer appearance-none shadow-2xs"
        >
          {ADMIN_ROLES_LIST.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>

      {/* Status Filter */}
      <div className="relative min-w-[110px]">
        <select
          value={selectedStatus}
          onChange={(e) => onStatusChange(e.target.value)}
          className="w-full bg-slate-50/60 border border-slate-200 rounded-md px-2.5 py-1.5 pr-7 text-xs font-medium text-slate-700 hover:border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer appearance-none shadow-2xs"
        >
          {ADMIN_STATUS_LIST.map((st) => (
            <option key={st} value={st}>
              {st}
            </option>
          ))}
        </select>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>

      {/* District Filter */}
      <div className="relative min-w-[120px]">
        <select
          value={selectedDistrict}
          onChange={(e) => onDistrictChange(e.target.value)}
          className="w-full bg-slate-50/60 border border-slate-200 rounded-md px-2.5 py-1.5 pr-7 text-xs font-medium text-slate-700 hover:border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer appearance-none shadow-2xs"
        >
          <option value="All">All Districts</option>
          {JHARKHAND_DISTRICTS_LIST.map((dist) => (
            <option key={dist} value={dist}>
              {dist}
            </option>
          ))}
        </select>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>

      {/* Reset Filter Button */}
      <button
        onClick={onResetFilters}
        className="flex items-center space-x-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 font-medium px-3 py-1.5 rounded-md border border-slate-200 text-xs shadow-2xs transition-colors cursor-pointer"
        title="Reset Filters"
      >
        <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
        <span>Reset</span>
      </button>
    </div>
  );
};

export default AdminDirectoryToolbar;
