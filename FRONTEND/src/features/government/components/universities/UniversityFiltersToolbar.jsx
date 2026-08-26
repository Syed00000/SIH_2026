import React from 'react';
import { Search, ChevronDown, RotateCcw, Plus } from 'lucide-react';

export const UniversityFiltersToolbar = ({
  searchQuery,
  onSearchChange,
  selectedDistrict,
  onDistrictChange,
  districtOptions = [],
  selectedStatus,
  onStatusChange,
  onResetFilters,
  onAddUniversity
}) => {
  return (
    <div className="flex flex-wrap items-center gap-2.5 select-none">
      {/* Search Bar */}
      <div className="relative flex-1 min-w-[200px]">
        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search universities by name, code or email..."
          className="w-full pl-9 pr-3.5 py-1.5 bg-slate-50/60 border border-slate-200 rounded-md text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all shadow-2xs"
        />
      </div>

      {/* District Dropdown */}
      <div className="relative min-w-[130px]">
        <select
          value={selectedDistrict}
          onChange={(e) => onDistrictChange(e.target.value)}
          className="w-full bg-slate-50/60 border border-slate-200 rounded-md px-2.5 py-1.5 pr-7 text-xs font-medium text-slate-700 hover:border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer appearance-none shadow-2xs"
        >
          {districtOptions.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>

      {/* Status Dropdown */}
      <div className="relative min-w-[115px]">
        <select
          value={selectedStatus}
          onChange={(e) => onStatusChange(e.target.value)}
          className="w-full bg-slate-50/60 border border-slate-200 rounded-md px-2.5 py-1.5 pr-7 text-xs font-medium text-slate-700 hover:border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer appearance-none shadow-2xs"
        >
          <option value="All Status">All Status</option>
          <option value="Approved">Approved</option>
          <option value="Pending">Pending</option>
          <option value="Rejected">Rejected</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>

      {/* Reset Filters */}
      <button
        type="button"
        onClick={onResetFilters}
        className="flex items-center space-x-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 font-medium px-3 py-1.5 rounded-md border border-slate-200 text-xs shadow-2xs transition-colors cursor-pointer"
        title="Reset Filters"
      >
        <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
        <span>Reset</span>
      </button>

      {/* + Add Universities Button */}
      <button
        type="button"
        onClick={onAddUniversity}
        className="inline-flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-3.5 py-2 rounded-md text-xs shadow-xs transition-colors cursor-pointer shrink-0"
      >
        <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
        <span>Add Universities</span>
      </button>
    </div>
  );
};

export default UniversityFiltersToolbar;
