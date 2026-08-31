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
  onResetFilters
}) => {
  return (
    <div className="bg-white border border-slate-200/90 p-3 rounded-2xl shadow-2xs select-none">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 items-center">
        {/* Search */}
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by company name, sector, domain..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#007A61] focus:border-[#007A61] shadow-2xs"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Industry Category Filter */}
        <div>
          <select
            value={industryFilter}
            onChange={(e) => setIndustryFilter(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#007A61] focus:border-[#007A61] shadow-2xs cursor-pointer"
          >
            <option value="All">All Categories</option>
            <option value="Private Industry">Private Industry</option>
            <option value="Govt Dept">Govt Dept / PSU</option>
            <option value="PSU / Mining">PSU / Mining & Energy</option>
            <option value="Tech / IT">Tech / IT Services</option>
            <option value="Manufacturing">Manufacturing & Heavy Eng</option>
          </select>
        </div>

        {/* Support Type Filter */}
        <div>
          <select
            value={supportFilter}
            onChange={(e) => setSupportFilter(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:border-[#007A61] focus:ring-1 focus:ring-[#007A61] shadow-2xs cursor-pointer"
          >
            <option value="All">All Support Types</option>
            <option value="Funding">Direct CSR Co-Funding</option>
            <option value="Mentorship">Technical Mentorship</option>
            <option value="Equipment">Lab / Equipment Access</option>
            <option value="Prototyping">Prototyping & Pilots</option>
          </select>
        </div>

        {/* Reset */}
        <div className="flex items-center space-x-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#007A61] focus:border-[#007A61] shadow-2xs cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active / Verified</option>
            <option value="Pending">Pending MoU</option>
          </select>

          <button
            onClick={onResetFilters}
            title="Reset Filters"
            className="p-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl flex items-center justify-center cursor-pointer transition-colors shadow-2xs shrink-0"
          >
            <RotateCcw className="w-4 h-4 text-slate-500" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PartnersFilterBar;
