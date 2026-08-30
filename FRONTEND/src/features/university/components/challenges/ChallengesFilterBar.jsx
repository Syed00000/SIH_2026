import React from 'react';
import { Search, Calendar } from 'lucide-react';

export const ChallengesFilterBar = ({
  statusFilter,
  setStatusFilter,
  domainFilter,
  setDomainFilter,
  districtFilter,
  setDistrictFilter,
  priorityFilter,
  setPriorityFilter,
  dateRange,
  setDateRange,
  searchTerm,
  setSearchTerm
}) => {
  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-3 flex flex-wrap items-center justify-between gap-2 shadow-2xs">
      <div className="flex flex-wrap items-center gap-2">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 font-semibold cursor-pointer focus:border-[#007A61] focus:outline-none"
        >
          <option value="All Status">All Status</option>
          <option value="Pending">Pending Review</option>
          <option value="Clarification Requested">Clarification Requested</option>
          <option value="Clarified">Clarified by Nodal</option>
          <option value="Accepted">Accepted</option>
          <option value="Rejected">Declined</option>
        </select>

        <select
          value={domainFilter}
          onChange={(e) => setDomainFilter(e.target.value)}
          className="px-2 py-1.5 bg-white border border-slate-200 rounded-none text-xs text-slate-800 font-medium cursor-pointer"
        >
          <option value="All Domains">All Domains</option>
          <option value="Water">Water</option>
          <option value="Education">Education</option>
          <option value="Infrastructure">Infrastructure</option>
          <option value="Environment">Environment</option>
          <option value="Agriculture">Agriculture</option>
          <option value="Healthcare">Healthcare</option>
          <option value="Energy">Energy</option>
        </select>

        <select
          value={districtFilter}
          onChange={(e) => setDistrictFilter(e.target.value)}
          className="px-2 py-1.5 bg-white border border-slate-200 rounded-none text-xs text-slate-800 font-medium cursor-pointer"
        >
          <option value="All Districts">All Districts</option>
          <option value="Dumka">Dumka</option>
          <option value="Ranchi">Ranchi</option>
          <option value="Gumla">Gumla</option>
          <option value="Jamshedpur">Jamshedpur</option>
          <option value="Pakur">Pakur</option>
          <option value="Latehar">Latehar</option>
          <option value="Simdega">Simdega</option>
          <option value="Bokaro">Bokaro</option>
        </select>

        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="px-2 py-1.5 bg-white border border-slate-200 rounded-none text-xs text-slate-800 font-medium cursor-pointer"
        >
          <option value="All Priority">All Priority</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>

        <div className="flex items-center space-x-1.5 px-2.5 py-1.5 bg-white border border-slate-200 rounded-none text-xs text-slate-600">
          <span>From - To</span>
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
        </div>
      </div>

      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by title or ID.."
          className="pl-2.5 pr-8 py-1.5 bg-white border border-slate-200 rounded-none text-xs text-slate-900 placeholder-slate-400 w-52"
        />
        <Search className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
      </div>
    </div>
  );
};

export default ChallengesFilterBar;
