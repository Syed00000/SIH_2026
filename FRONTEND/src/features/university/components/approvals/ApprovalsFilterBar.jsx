import React from 'react';
import { Search, RotateCcw, Filter, Calendar } from 'lucide-react';

export const ApprovalsFilterBar = ({
  search, setSearch,
  typeFilter, setTypeFilter,
  statusFilter, setStatusFilter,
  onReset
}) => {
  return (
    <div className="bg-white border border-slate-200 p-2.5 shadow-2xs select-none rounded-none space-y-2">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 items-center">
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by ID, project or challenge..."
            className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-slate-900 rounded-none"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 text-xs text-slate-800 font-medium focus:bg-white focus:outline-none focus:border-slate-900 rounded-none cursor-pointer"
        >
          <option value="All">All Types</option>
          <option value="Project Approval">Project Approval</option>
          <option value="Proposal Approval">Proposal Approval</option>
          <option value="Prototype Approval">Prototype Approval</option>
          <option value="Partnership Approval">Partnership Approval</option>
          <option value="Payment Approval">Payment Approval</option>
          <option value="Lab Clearance">Lab Clearance</option>
          <option value="Equipment Grant">Equipment Grant</option>
          <option value="Field Trial Permit">Field Trial Permit</option>
          <option value="Administrative Clearance">Administrative Clearance</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 text-xs text-slate-800 font-medium focus:bg-white focus:outline-none focus:border-slate-900 rounded-none cursor-pointer"
        >
          <option value="All">All Statuses</option>
          <option value="Pending">Pending Review</option>
          <option value="Forwarded">✓ Forwarded to Govt</option>
          <option value="Approved">Approved</option>
          <option value="Deployed">🔒 Deployed</option>
          <option value="Rejected">Rejected</option>
          <option value="Changes Required">Revisions Directed</option>
        </select>

        <div className="relative">
          <input
            type="text"
            placeholder="Select date range"
            className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 text-xs text-slate-500 focus:bg-white focus:outline-none focus:border-slate-900 rounded-none cursor-pointer"
            readOnly
          />
          <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      <div className="flex items-center justify-end space-x-2 pt-1.5 border-t border-slate-100">
        <button
          onClick={onReset}
          className="px-3 py-1.5 border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 rounded-none flex items-center space-x-1 cursor-pointer transition-colors"
        >
          <RotateCcw className="w-3 h-3 text-slate-400" />
          <span>Clear Filters</span>
        </button>
        <button
          className="px-4 py-1.5 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-none flex items-center space-x-1 cursor-pointer transition-colors"
        >
          <Filter className="w-3.5 h-3.5" />
          <span>Apply Filters</span>
        </button>
      </div>
    </div>
  );
};

export default ApprovalsFilterBar;
