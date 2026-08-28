import React from 'react';
import { Search, Filter, RotateCcw } from 'lucide-react';

export const PartnersFilterBar = ({
  search,
  setSearch,
  industryFilter,
  setIndustryFilter,
  supportFilter,
  setSupportFilter,
  statusFilter,
  setStatusFilter,
  domainFilter,
  setDomainFilter,
  onResetFilters,
  onApplyFilters
}) => {
  return (
    <div className="bg-white border border-slate-200 p-2.5 space-y-2 shadow-2xs select-none rounded-none">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 items-center">
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or industry..."
            className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-slate-900 rounded-none"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        <div>
          <select
            value={industryFilter}
            onChange={(e) => setIndustryFilter(e.target.value)}
            className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 text-xs text-slate-800 font-medium focus:bg-white focus:outline-none focus:border-slate-900 rounded-none cursor-pointer"
          >
            <option value="All">All Industries</option>
            <option value="Technology">Technology</option>
            <option value="Environmental">Environmental</option>
            <option value="Water Technology">Water Technology</option>
            <option value="IT & Analytics">IT & Analytics</option>
            <option value="Energy">Energy</option>
            <option value="Infrastructure">Infrastructure</option>
            <option value="Non-Profit">Non-Profit</option>
          </select>
        </div>

        <div>
          <select
            value={supportFilter}
            onChange={(e) => setSupportFilter(e.target.value)}
            className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 text-xs text-slate-800 font-medium focus:bg-white focus:outline-none focus:border-slate-900 rounded-none cursor-pointer"
          >
            <option value="All">All Support Types</option>
            <option value="Funding">Funding</option>
            <option value="Mentorship">Mentorship</option>
            <option value="Equipment">Equipment</option>
            <option value="Lab Support">Lab Support</option>
            <option value="Pilot Support">Pilot Support</option>
          </select>
        </div>

        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 text-xs text-slate-800 font-medium focus:bg-white focus:outline-none focus:border-slate-900 rounded-none cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Pending">Pending</option>
            <option value="Invited">Invited</option>
            <option value="Completed">Completed</option>
            <option value="Declined">Declined</option>
          </select>
        </div>

        <div>
          <select
            value={domainFilter}
            onChange={(e) => setDomainFilter(e.target.value)}
            className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 text-xs text-slate-800 font-medium focus:bg-white focus:outline-none focus:border-slate-900 rounded-none cursor-pointer"
          >
            <option value="All">All Domains</option>
            <option value="Water">Water</option>
            <option value="Environment">Environment</option>
            <option value="Technology">Technology</option>
            <option value="Energy">Energy</option>
            <option value="Healthcare">Healthcare</option>
          </select>
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
        <button
          onClick={onApplyFilters}
          className="px-4 py-1.5 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-none flex items-center space-x-1 cursor-pointer transition-colors shadow-2xs"
        >
          <Filter className="w-3.5 h-3.5" />
          <span>Apply Filters</span>
        </button>
      </div>
    </div>
  );
};

export default PartnersFilterBar;
