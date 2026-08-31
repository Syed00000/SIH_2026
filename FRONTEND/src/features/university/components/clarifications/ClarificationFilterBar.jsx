import React from 'react';
import { Search } from 'lucide-react';

const FILTER_TABS = [
  { id: 'ALL', label: 'All Discussions' },
  { id: 'ACTIVE', label: 'Active Queries' },
  { id: 'CLARIFIED', label: 'Clarified • Ready' },
  { id: 'ACCEPTED', label: 'In R&D' }
];

export const ClarificationFilterBar = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter
}) => {
  return (
    <div className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-left">
      <div className="relative flex-1 min-w-[220px]">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search problems, Nodal officers, or domains..."
          className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#007A61]"
        />
      </div>

      <div className="flex items-center space-x-1.5 bg-slate-100 p-1 rounded-xl text-xs font-bold text-slate-600">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setStatusFilter(tab.id)}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              statusFilter === tab.id
                ? 'bg-white text-[#007A61] shadow-2xs'
                : 'hover:text-slate-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ClarificationFilterBar;
