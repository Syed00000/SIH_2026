import React from 'react';
import { Search, ChevronDown, RotateCcw, Plus } from 'lucide-react';
import { INDUSTRY_CATEGORIES, THEMATIC_DOMAINS } from './AddIndustryBasicFields.jsx';

export const IndustryFiltersToolbar = ({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedDomain,
  onDomainChange,
  selectedStatus,
  onStatusChange,
  selectedVerification,
  onVerificationChange,
  onResetFilters,
  onAddIndustry
}) => {
  return (
    <div className="space-y-2.5 select-none">
      {/* Top Row: Search Input + Add Industry Button */}
      <div className="flex items-center justify-between gap-2.5">
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by legal name, ID or SPOC..."
            className="w-full pl-9 pr-3.5 py-1.5 bg-slate-50/60 border border-slate-200 rounded-md text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:bg-white transition-all shadow-2xs"
          />
        </div>

        <button
          type="button"
          onClick={onAddIndustry}
          className="inline-flex items-center space-x-1.5 bg-slate-900 hover:bg-black text-white font-semibold px-3.5 py-1.5 rounded-md text-xs shadow-xs transition-colors cursor-pointer shrink-0"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Add Industry</span>
        </button>
      </div>

      {/* Bottom Filter Controls */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Category */}
        <div className="relative min-w-[125px] flex-1 sm:flex-initial">
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full bg-slate-50/60 border border-slate-200 rounded-md px-2.5 py-1.5 pr-7 text-xs font-medium text-slate-700 hover:border-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-900 cursor-pointer appearance-none shadow-2xs"
          >
            <option value="All Categories">All Categories</option>
            {INDUSTRY_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Thematic Domain */}
        <div className="relative min-w-[130px] flex-1 sm:flex-initial">
          <select
            value={selectedDomain}
            onChange={(e) => onDomainChange(e.target.value)}
            className="w-full bg-slate-50/60 border border-slate-200 rounded-md px-2.5 py-1.5 pr-7 text-xs font-medium text-slate-700 hover:border-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-900 cursor-pointer appearance-none shadow-2xs"
          >
            <option value="All Domains">All Domains</option>
            {THEMATIC_DOMAINS.map((domain) => (
              <option key={domain} value={domain}>
                {domain}
              </option>
            ))}
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Verification Status */}
        <div className="relative min-w-[120px] flex-1 sm:flex-initial">
          <select
            value={selectedVerification}
            onChange={(e) => onVerificationChange(e.target.value)}
            className="w-full bg-slate-50/60 border border-slate-200 rounded-md px-2.5 py-1.5 pr-7 text-xs font-medium text-slate-700 hover:border-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-900 cursor-pointer appearance-none shadow-2xs"
          >
            <option value="All Verification">All Verification</option>
            <option value="Approved">Approved</option>
            <option value="Pending">Pending Review</option>
            <option value="Rejected">Rejected</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Account Status */}
        <div className="relative min-w-[110px] flex-1 sm:flex-initial">
          <select
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full bg-slate-50/60 border border-slate-200 rounded-md px-2.5 py-1.5 pr-7 text-xs font-medium text-slate-700 hover:border-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-900 cursor-pointer appearance-none shadow-2xs"
          >
            <option value="All Status">All Status</option>
            <option value="Active">Active</option>
            <option value="Disabled">Disabled</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Reset Filter Button */}
        <button
          type="button"
          onClick={onResetFilters}
          className="flex items-center space-x-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 font-medium px-3 py-1.5 rounded-md border border-slate-200 text-xs shadow-2xs transition-colors cursor-pointer shrink-0"
          title="Reset Filters"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
          <span>Reset</span>
        </button>
      </div>
    </div>
  );
};

export default IndustryFiltersToolbar;
