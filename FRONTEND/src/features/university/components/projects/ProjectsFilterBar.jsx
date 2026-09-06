import React from 'react';
import { Search, Plus, RotateCcw } from 'lucide-react';

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
    <div className="bg-white border border-slate-200/90 p-3 rounded-2xl shadow-2xs select-none">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 items-center">
        {/* Search */}
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects by title, domain..."
            className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#007A61] focus:border-[#007A61] rounded-xl transition-all shadow-2xs"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Domain Filter */}
        <div>
          <select
            value={domainFilter}
            onChange={(e) => setDomainFilter(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-xs text-slate-800 font-semibold focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#007A61] focus:border-[#007A61] rounded-xl cursor-pointer shadow-2xs"
          >
            <option value="All">All Domains</option>
            <option value="Water">Water & Sanitation</option>
            <option value="Infrastructure">Infrastructure</option>
            <option value="Environment">Environment</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Energy">Energy</option>
            <option value="Agriculture">Agriculture</option>
            <option value="Education">Education</option>
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-xs text-slate-800 font-semibold focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#007A61] focus:border-[#007A61] rounded-xl cursor-pointer shadow-2xs"
          >
            <option value="All">All Statuses</option>
            <option value="In Progress">In Progress</option>
            <option value="Planning">Proposal Stage</option>
            <option value="Completed">Completed</option>
            <option value="Deployed">🔒 Deployed</option>
          </select>
        </div>

        {/* Faculty Filter */}
        <div>
          <select
            value={facultyFilter}
            onChange={(e) => setFacultyFilter(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-xs text-slate-800 font-semibold focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#007A61] focus:border-[#007A61] rounded-xl cursor-pointer shadow-2xs"
          >
            <option value="All">All Mentors</option>
            {facultyOptions.map((f, i) => (
              <option key={i} value={f}>
                {f}
              </option>
            ))}
          </select>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={onResetFilters}
            className="p-2 border border-slate-200 hover:bg-slate-100 text-slate-600 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            title="Reset Filters"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onOpenCreateModal}
            className="flex-1 px-3.5 py-2 bg-[#007A61] hover:bg-[#006650] text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-all cursor-pointer shadow-2xs"
          >
            <Plus className="w-4 h-4" />
            <span>Create Project</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectsFilterBar;
