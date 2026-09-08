import React from 'react';
import { Search, Filter, RotateCcw } from 'lucide-react';

const DOMAINS = [
  'All Domains',
  'Urban Development',
  'Water & Sanitation',
  'Roads & Transportation',
  'Healthcare',
  'Rural Development',
  'Electricity & Power',
  'Education & Youth',
  'Environment & Forestry'
];

const STATUSES = [
  'All Status',
  'Pending Assignment',
  'Assigned to Dept',
  'In Progress',
  'Resolved'
];

const PRIORITIES = ['All Priority', 'Critical', 'High', 'Medium', 'Low'];

export const DistrictIssuesFilterBar = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  domainFilter,
  setDomainFilter,
  priorityFilter,
  setPriorityFilter,
  onReset
}) => {
  return (
    <div className="bg-white p-3 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2 select-none text-left">
      <div className="flex flex-col md:flex-row items-center gap-2.5">
        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by problem title, citizen name, tracking ID, panchayat..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50/80 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#007A61]/20 focus:border-[#007A61]"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            aria-label="Filter by Status"
            className="px-2.5 py-2 bg-slate-50/80 border border-slate-200 rounded-xl text-xs text-slate-700 font-semibold focus:outline-none focus:border-[#007A61] cursor-pointer"
          >
            {STATUSES.map((st) => (
              <option key={st} value={st}>{st}</option>
            ))}
          </select>

          {/* Domain Filter */}
          <select
            value={domainFilter}
            onChange={(e) => setDomainFilter(e.target.value)}
            aria-label="Filter by Domain"
            className="px-2.5 py-2 bg-slate-50/80 border border-slate-200 rounded-xl text-xs text-slate-700 font-semibold focus:outline-none focus:border-[#007A61] cursor-pointer"
          >
            {DOMAINS.map((dm) => (
              <option key={dm} value={dm}>{dm}</option>
            ))}
          </select>

          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            aria-label="Filter by Priority"
            className="px-2.5 py-2 bg-slate-50/80 border border-slate-200 rounded-xl text-xs text-slate-700 font-semibold focus:outline-none focus:border-[#007A61] cursor-pointer"
          >
            {PRIORITIES.map((pr) => (
              <option key={pr} value={pr}>{pr}</option>
            ))}
          </select>

          {/* Reset Button */}
          {onReset && (
            <button
              type="button"
              onClick={onReset}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              title="Reset Filters"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DistrictIssuesFilterBar;
