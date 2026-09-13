import React from 'react';
import { Search, Table, Grid } from 'lucide-react';
import { SECTOR_OPTIONS, DISTRICT_OPTIONS } from '../../data/projectConstants.js';

export const SolutionProposalsToolbar = ({
  selectedStatus,
  setSelectedStatus,
  viewMode,
  setViewMode,
  searchQuery,
  setSearchQuery,
  selectedSector,
  setSelectedSector,
  selectedDistrict,
  setSelectedDistrict
}) => {
  return (
    <div className="bg-white border border-slate-200 p-4 shadow-xs space-y-4 rounded-xs">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div className="flex items-center space-x-1.5 overflow-x-auto">
          {['All', 'Pending', 'Approved', 'Rejected'].map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setSelectedStatus(status)}
              className={`px-3.5 py-1.5 rounded-xs text-xs font-bold transition-all cursor-pointer whitespace-nowrap border ${
                selectedStatus === status
                  ? 'bg-[#007A61] text-white border-[#007A61] shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {status === 'All' ? 'All Proposals' : status}
            </button>
          ))}
        </div>

        <div className="border border-slate-200 rounded-xs p-0.5 bg-slate-50 flex items-center">
          <button
            type="button"
            onClick={() => setViewMode('cards')}
            className={`p-1.5 rounded-xs transition-all cursor-pointer ${
              viewMode === 'cards' ? 'bg-white shadow-xs text-slate-900 font-bold border border-slate-200' : 'text-slate-400 hover:text-slate-700'
            }`}
            title="Card View"
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setViewMode('table')}
            className={`p-1.5 rounded-xs transition-all cursor-pointer ${
              viewMode === 'table' ? 'bg-white shadow-xs text-slate-900 font-bold border border-slate-200' : 'text-slate-400 hover:text-slate-700'
            }`}
            title="Table View"
          >
            <Table className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search proposal title, HEI name, ID..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xs text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#007A61]"
          />
        </div>

        <select
          value={selectedSector}
          onChange={(e) => setSelectedSector(e.target.value)}
          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xs text-xs text-slate-900 font-bold focus:bg-white focus:outline-none focus:border-[#007A61] cursor-pointer"
        >
          {SECTOR_OPTIONS.map((sec) => (
            <option key={sec} value={sec}>{sec}</option>
          ))}
        </select>

        <select
          value={selectedDistrict}
          onChange={(e) => setSelectedDistrict(e.target.value)}
          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xs text-xs text-slate-900 font-bold focus:bg-white focus:outline-none focus:border-[#007A61] cursor-pointer"
        >
          {DISTRICT_OPTIONS.map((dist) => (
            <option key={dist} value={dist}>{dist}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default SolutionProposalsToolbar;
