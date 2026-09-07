import React from 'react';
import { Search, LayoutGrid, LayoutList } from 'lucide-react';
import { JHARKHAND_DISTRICTS_LIST, SECTORS_LIST } from '../../government/data/governmentConstants.js';

export const NodalFilterBar = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  domainFilter,
  setDomainFilter,
  districtFilter,
  setDistrictFilter,
  priorityFilter,
  setPriorityFilter,
  totalCount,
  viewMode = 'grid',
  setViewMode
}) => {
  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-3 select-none">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
        <h2 className="font-extrabold text-slate-900 text-sm tracking-tight">Citizen Ground Submissions Triage Directory</h2>
        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold text-[#047857] bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            {totalCount} problem statements loaded
          </span>
          {setViewMode && (
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setViewMode('list')}
                title="List View"
                className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'list'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <LayoutList className="w-3.5 h-3.5" />
                <span>List</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                title="Grid View"
                className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Grid</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2 text-xs">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search title, ID, district..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-2.5 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#047857] hover:border-slate-300 shadow-2xs font-medium"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#047857] hover:border-slate-300 shadow-2xs font-medium cursor-pointer"
        >
          <option value="All Status">All Status</option>
          <option value="Clarification Requested">Clarification Requested</option>
          <option value="Clarified">Clarified</option>
          <option value="Under Review">Under Review</option>
          <option value="In Progress">In Progress</option>
          <option value="Resolved">Resolved</option>
          <option value="Deployed">🔒 Deployed</option>
          <option value="Withdrawn">Withdrawn</option>
          <option value="Rejected">Rejected</option>
        </select>

        <select
          value={domainFilter}
          onChange={(e) => setDomainFilter(e.target.value)}
          className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#047857] hover:border-slate-300 shadow-2xs font-medium cursor-pointer"
        >
          <option value="All Domains">All Domains</option>
          {SECTORS_LIST.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <select
          value={districtFilter}
          onChange={(e) => setDistrictFilter(e.target.value)}
          className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#047857] hover:border-slate-300 shadow-2xs font-medium cursor-pointer"
        >
          <option value="All Districts">All Districts</option>
          {JHARKHAND_DISTRICTS_LIST.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>

        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#047857] hover:border-slate-300 shadow-2xs font-medium cursor-pointer"
        >
          <option value="All Priority">All Priority</option>
          <option value="Critical">Critical Priority</option>
          <option value="High">High Priority</option>
          <option value="Medium">Medium Priority</option>
          <option value="Low">Low Priority</option>
        </select>
      </div>
    </div>
  );
};

export default NodalFilterBar;
