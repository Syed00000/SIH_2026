import React from 'react';
import { Search } from 'lucide-react';
import { JHARKHAND_DISTRICTS_LIST } from '../../../government/data/jharkhandDistrictsMeta.js';

const ALLOCATION_STATUS_TABS = ['All', 'Assigned', 'Unassigned'];

export const UniversitiesFilterBar = ({
  searchTerm,
  setSearchTerm,
  filterAllocationStatus,
  setFilterAllocationStatus,
  filterDistrict,
  setFilterDistrict
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white border border-slate-200/90 rounded-lg p-3.5 shadow-2xs">
      <div className="relative flex-1">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search by university name, code, district, or nodal officer..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200/80 rounded-lg text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-slate-900 transition-colors"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs font-semibold">
          {ALLOCATION_STATUS_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setFilterAllocationStatus(tab)}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                filterAllocationStatus === tab
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <select
          value={filterDistrict}
          onChange={(e) => setFilterDistrict(e.target.value)}
          className="px-3 py-2 bg-slate-50 border border-slate-200/80 rounded-lg text-xs font-bold text-slate-800 focus:bg-white focus:outline-none focus:border-slate-900 cursor-pointer"
        >
          <option value="All">All Districts</option>
          {JHARKHAND_DISTRICTS_LIST.map((dist) => (
            <option key={dist} value={dist}>
              {dist}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default UniversitiesFilterBar;
