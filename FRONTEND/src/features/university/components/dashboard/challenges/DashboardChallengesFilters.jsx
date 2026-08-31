import React from 'react';
import { Search, ChevronDown } from 'lucide-react';

export const DashboardChallengesFilters = ({
  statusFilter,
  setStatusFilter,
  domainFilter,
  setDomainFilter,
  districtFilter,
  setDistrictFilter,
  searchTerm,
  setSearchTerm,
  onFilterChange
}) => {
  return (
    <div className="p-3 border-b border-slate-100 flex flex-wrap items-center justify-between gap-2 bg-white">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); onFilterChange(); }}
            className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 pr-7 text-xs font-semibold text-slate-700 hover:border-[#007A61] focus:outline-none cursor-pointer appearance-none shadow-2xs"
          >
            <option value="All Status">All Status</option>
            <option value="Pending">Pending Review</option>
            <option value="Clarification Requested">Clarification Active</option>
            <option value="Accepted">Accepted</option>
            <option value="Rejected">Declined</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        <div className="relative">
          <select
            value={domainFilter}
            onChange={(e) => { setDomainFilter(e.target.value); onFilterChange(); }}
            className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 pr-7 text-xs font-semibold text-slate-700 hover:border-[#007A61] focus:outline-none cursor-pointer appearance-none shadow-2xs"
          >
            <option value="All Domains">All Domains</option>
            <option value="Water Resources">Water Resources</option>
            <option value="Education">Education</option>
            <option value="Infrastructure">Infrastructure</option>
            <option value="Environment">Environment</option>
            <option value="Agriculture">Agriculture</option>
            <option value="Healthcare">Healthcare</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        <div className="relative">
          <select
            value={districtFilter}
            onChange={(e) => { setDistrictFilter(e.target.value); onFilterChange(); }}
            className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 pr-7 text-xs font-semibold text-slate-700 hover:border-[#007A61] focus:outline-none cursor-pointer appearance-none shadow-2xs"
          >
            <option value="All Districts">All Districts</option>
            <option value="Ranchi">Ranchi</option>
            <option value="Dumka">Dumka</option>
            <option value="Gumla">Gumla</option>
            <option value="Dhanbad">Dhanbad</option>
            <option value="Jamshedpur">Jamshedpur</option>
            <option value="Hazaribagh">Hazaribagh</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => { setSearchTerm(e.target.value); onFilterChange(); }}
          placeholder="Search challenges..."
          className="pl-3 pr-8 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 w-48 shadow-2xs focus:outline-none focus:border-[#007A61]"
        />
        <Search className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
      </div>
    </div>
  );
};

export default DashboardChallengesFilters;
