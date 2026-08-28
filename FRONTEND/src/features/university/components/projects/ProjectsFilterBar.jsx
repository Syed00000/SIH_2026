import React from 'react';
import { Search, Plus, Calendar, RotateCcw } from 'lucide-react';

export const ProjectsFilterBar = ({
  search,
  setSearch,
  domainFilter,
  setDomainFilter,
  statusFilter,
  setStatusFilter,
  facultyFilter,
  setFacultyFilter,
  facultyOptions = [],
  onResetFilters,
  onOpenCreateModal
}) => {
  return (
    <div className="bg-white border border-slate-200 p-2.5 space-y-2 shadow-2xs select-none rounded-none">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 items-center">
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects..."
            className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-slate-900 rounded-none"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        <div>
          <select
            value={domainFilter}
            onChange={(e) => setDomainFilter(e.target.value)}
            className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 text-xs text-slate-800 font-medium focus:bg-white focus:outline-none focus:border-slate-900 rounded-none cursor-pointer"
          >
            <option value="All">All Domains</option>
            <option value="Water">Water</option>
            <option value="Infrastructure">Infrastructure</option>
            <option value="Environment">Environment</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Energy">Energy</option>
            <option value="Agriculture">Agriculture</option>
            <option value="Education">Education</option>
          </select>
        </div>

        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 text-xs text-slate-800 font-medium focus:bg-white focus:outline-none focus:border-slate-900 rounded-none cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="In Progress">In Progress</option>
            <option value="Planning">Planning</option>
            <option value="Completed">Completed</option>
            <option value="Delayed">Delayed</option>
          </select>
        </div>

        <div>
          <select
            value={facultyFilter}
            onChange={(e) => setFacultyFilter(e.target.value)}
            className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 text-xs text-slate-800 font-medium focus:bg-white focus:outline-none focus:border-slate-900 rounded-none cursor-pointer"
          >
            <option value="All">All Faculty</option>
            {facultyOptions.map((f, i) => (
              <option key={i} value={f}>{f}</option>
            ))}
          </select>
        </div>

        <div className="relative">
          <div className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 text-xs text-slate-500 flex items-center justify-between cursor-pointer rounded-none">
            <span>Select date range</span>
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end space-x-2 pt-1.5 border-t border-slate-100">
        <button
          onClick={onResetFilters}
          className="px-3 py-1.5 border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 rounded-none flex items-center space-x-1 cursor-pointer transition-colors"
        >
          <RotateCcw className="w-3 h-3 text-slate-400" />
          <span>Clear Filters</span>
        </button>
      </div>
    </div>
  );
};

export default ProjectsFilterBar;
