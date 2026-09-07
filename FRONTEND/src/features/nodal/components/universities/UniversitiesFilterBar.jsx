import React from 'react';
import { Search, LayoutList, LayoutGrid } from 'lucide-react';
import { JHARKHAND_DISTRICTS_LIST } from '../../../government/data/jharkhandDistrictsMeta.js';

const ALLOCATION_STATUS_TABS = ['All', 'Assigned', 'Unassigned'];

export const UniversitiesFilterBar = ({
  searchTerm,
  setSearchTerm,
  filterAllocationStatus,
  setFilterAllocationStatus,
  filterDistrict,
  setFilterDistrict,
  viewMode = 'table',
  setViewMode
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white border border-slate-200 rounded-lg p-3.5 shadow-2xs">
      <div className="relative flex-1">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search by university name, code, district, or nodal officer..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-md text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-[#047857] transition-colors"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        <div className="flex items-center bg-slate-100/90 p-1 rounded-md border border-slate-200 text-xs font-semibold">
          {ALLOCATION_STATUS_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setFilterAllocationStatus(tab)}
              className={`px-3 py-1.5 rounded text-xs font-bold transition-all cursor-pointer ${
                filterAllocationStatus === tab
                  ? 'bg-[#047857] text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <select
          value={filterDistrict}
          onChange={(e) => setFilterDistrict(e.target.value)}
          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-xs font-bold text-slate-800 focus:bg-white focus:outline-none focus:border-[#047857] cursor-pointer"
        >
          <option value="All">All Districts</option>
          {JHARKHAND_DISTRICTS_LIST.map((dist) => (
            <option key={dist} value={dist}>
              {dist}
            </option>
          ))}
        </select>

        {setViewMode && (
          <div className="flex items-center bg-slate-100/90 p-1 rounded-md border border-slate-200">
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded text-xs font-bold transition-all cursor-pointer flex items-center space-x-1 ${
                viewMode === 'table'
                  ? 'bg-[#047857] text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Form / List Table View"
            >
              <LayoutList className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-[11px]">List</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded text-xs font-bold transition-all cursor-pointer flex items-center space-x-1 ${
                viewMode === 'grid'
                  ? 'bg-[#047857] text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Card Grid View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-[11px]">Cards</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UniversitiesFilterBar;
