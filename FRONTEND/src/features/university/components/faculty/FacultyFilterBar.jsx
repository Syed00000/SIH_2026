import React from 'react';
import { Search, Filter, RotateCcw, UserPlus } from 'lucide-react';

export const FacultyFilterBar = ({
  search,
  setSearch,
  deptFilter,
  setDeptFilter,
  domainFilter,
  setDomainFilter,
  availabilityFilter,
  setAvailabilityFilter,
  statusFilter,
  setStatusFilter,
  onResetFilters,
  onOpenAddModal
}) => {
  return (
    <div className="bg-white border border-slate-200 rounded-none p-3 space-y-2.5 select-none shadow-2xs">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
        {/* Search */}
        <div className="relative">
          <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Search Faculty</label>
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full pl-2.5 pr-7 py-1.5 bg-white border border-slate-200 rounded-none text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden focus:border-slate-900"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
          </div>
        </div>

        {/* Department */}
        <div>
          <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Department</label>
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-none text-xs text-slate-900 cursor-pointer"
          >
            <option value="All">All Departments</option>
            <option value="Water Resources Engineering">Water Resources Engineering</option>
            <option value="Civil Engineering">Civil Engineering</option>
            <option value="Computer Science & Engineering">Computer Science & Engineering</option>
            <option value="Mechanical Engineering">Mechanical Engineering</option>
            <option value="Chemistry">Chemistry</option>
            <option value="Agriculture">Agriculture</option>
            <option value="Management Studies">Management Studies</option>
          </select>
        </div>

        {/* Expertise / Domain */}
        <div>
          <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Expertise / Domain</label>
          <select
            value={domainFilter}
            onChange={(e) => setDomainFilter(e.target.value)}
            className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-none text-xs text-slate-900 cursor-pointer"
          >
            <option value="All">All Domains</option>
            <option value="Water Quality">Water Quality</option>
            <option value="IoT">IoT</option>
            <option value="Machine Learning">Machine Learning</option>
            <option value="Structural Engg.">Structural Engg.</option>
            <option value="Automation">Automation</option>
            <option value="Soil Science">Soil Science</option>
            <option value="Project Management">Project Management</option>
          </select>
        </div>

        {/* Availability */}
        <div>
          <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Availability</label>
          <select
            value={availabilityFilter}
            onChange={(e) => setAvailabilityFilter(e.target.value)}
            className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-none text-xs text-slate-900 cursor-pointer"
          >
            <option value="All">All Availability</option>
            <option value="Available">Available</option>
            <option value="In Project">In Project</option>
            <option value="On Leave">On Leave</option>
            <option value="Deployed">🔒 Deployed</option>
          </select>
        </div>

        {/* Status */}
        <div>
          <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Status</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-none text-xs text-slate-900 cursor-pointer"
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Deployed">🔒 Deployed</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
        <button
          onClick={onResetFilters}
          className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center space-x-1.5 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Clear Filters</span>
        </button>

        <div className="flex items-center space-x-2">
          <button
            onClick={onOpenAddModal}
            className="px-3.5 py-1.5 bg-slate-900 hover:bg-black text-white rounded-none text-xs font-bold transition-colors cursor-pointer flex items-center space-x-1.5"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>+ Onboard New Faculty</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FacultyFilterBar;
