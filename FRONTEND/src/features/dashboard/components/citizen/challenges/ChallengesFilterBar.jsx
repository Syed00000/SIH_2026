import React from 'react';
import { Search, ChevronDown } from 'lucide-react';

export const ChallengesFilterBar = ({
  statusFilter,
  setStatusFilter,
  categoryFilter,
  setCategoryFilter,
  searchQuery,
  setSearchQuery
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-3 border border-slate-200 rounded-md shadow-2xs">
      <div className="flex flex-wrap items-center gap-2.5">
        {/* Status Filter */}
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="appearance-none border border-slate-200 rounded-md pl-3 pr-7 py-1.5 bg-white text-xs font-semibold text-slate-700 outline-none cursor-pointer focus:ring-1 focus:ring-slate-900 focus:border-slate-900 min-w-[105px]"
          >
            <option value="All Status">All Status</option>
            <option value="Submitted">Submitted</option>
            <option value="Under Review">Under Review</option>
            <option value="In Evaluation">In Evaluation</option>
            <option value="Resolved">Resolved</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 transform -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Category Filter */}
        <div className="relative">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="appearance-none border border-slate-200 rounded-md pl-3 pr-7 py-1.5 bg-white text-xs font-semibold text-slate-700 outline-none cursor-pointer focus:ring-1 focus:ring-slate-900 focus:border-slate-900 min-w-[125px]"
          >
            <option value="All Categories">All Categories</option>
            <option value="Water Management">Water Management</option>
            <option value="Infrastructure">Infrastructure</option>
            <option value="Education">Education</option>
            <option value="Sanitation">Sanitation</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 transform -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Time Filter */}
        <div className="relative">
          <select className="appearance-none border border-slate-200 rounded-md pl-3 pr-7 py-1.5 bg-white text-xs font-semibold text-slate-700 outline-none cursor-pointer focus:ring-1 focus:ring-slate-900 focus:border-slate-900 min-w-[90px]">
            <option value="All Time">All Time</option>
            <option value="Last 30 Days">Last 30 Days</option>
            <option value="Last 6 Months">Last 6 Months</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 transform -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 transform -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search by challenge title or ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border border-slate-200 rounded-md pl-8 pr-3 py-1.5 bg-white text-xs font-medium text-slate-700 outline-none w-full md:w-72 focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
        />
      </div>
    </div>
  );
};

export default ChallengesFilterBar;
