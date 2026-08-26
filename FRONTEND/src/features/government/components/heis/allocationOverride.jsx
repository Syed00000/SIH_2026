import React from 'react';
import { Search, Droplet, Sprout, Heart, Hammer, Trash2 } from 'lucide-react';
import { JHARKHAND_DISTRICTS_LIST } from '../../data/mockGovernmentData.js';

export const AllocationOverride = ({
  overrideData,
  statusFilter,
  setStatusFilter,
  sectorFilter,
  setSectorFilter,
  districtFilter,
  setDistrictFilter,
  searchQuery,
  setSearchQuery,
  filteredOverride,
  handleOverrideReview,
  setSelectedRecord,
  setReviewType
}) => {
  const getSectorIcon = (sector) => {
    switch (sector?.toLowerCase()) {
      case 'water':
        return <Droplet className="w-3.5 h-3.5 text-blue-500 mr-1 shrink-0" />;
      case 'agriculture':
        return <Sprout className="w-3.5 h-3.5 text-emerald-500 mr-1 shrink-0" />;
      case 'health':
        return <Heart className="w-3.5 h-3.5 text-red-500 mr-1 shrink-0" />;
      case 'infrastructure':
        return <Hammer className="w-3.5 h-3.5 text-orange-500 mr-1 shrink-0" />;
      default:
        return <Trash2 className="w-3.5 h-3.5 text-slate-500 mr-1 shrink-0" />;
    }
  };

  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-4.5 shadow-2xs space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <h3 className="font-bold text-slate-900 text-sm">1. Institutional Allocation Override</h3>
          <p className="text-[10.5px] text-slate-400 font-medium">Re-route challenges to suitable academic domains based on team competency.</p>
        </div>
        <span className="text-[11px] text-blue-600 font-bold hover:underline cursor-pointer">View All</span>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-slate-50 border border-slate-200/90 rounded-xl px-2.5 py-1.5 text-[10.5px] font-bold text-slate-700 outline-hidden cursor-pointer"
        >
          <option value="All">All Status</option>
          <option value="Reassignment Requested">Reassignment Requested</option>
          <option value="Pending">Pending</option>
          <option value="Reassigned">Reassigned</option>
          <option value="Completed">Completed</option>
        </select>

        <select
          value={sectorFilter}
          onChange={(e) => setSectorFilter(e.target.value)}
          className="bg-slate-50 border border-slate-200/90 rounded-xl px-2.5 py-1.5 text-[10.5px] font-bold text-slate-700 outline-hidden cursor-pointer"
        >
          <option value="All">All Sectors</option>
          <option value="Water">Water</option>
          <option value="Agriculture">Agriculture</option>
          <option value="Health">Health</option>
          <option value="Infrastructure">Infrastructure</option>
          <option value="Sanitation">Sanitation</option>
        </select>

        <select
          value={districtFilter}
          onChange={(e) => setDistrictFilter(e.target.value)}
          className="bg-slate-50 border border-slate-200/90 rounded-xl px-2.5 py-1.5 text-[10.5px] font-bold text-slate-700 outline-hidden cursor-pointer"
        >
          {JHARKHAND_DISTRICTS_LIST.map(dist => (
            <option key={dist} value={dist}>{dist === 'All' ? 'All Districts' : dist}</option>
          ))}
        </select>

        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by Problem ID or Title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 border border-slate-200 focus:border-blue-400 outline-none bg-slate-50 rounded-xl text-[10.5px] font-medium text-slate-800 placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-100 text-[10.5px] uppercase font-bold text-slate-400 select-none pb-2 bg-slate-50/50">
              <th className="py-2.5 px-3">Problem ID</th>
              <th className="py-2.5 px-3">Problem Title</th>
              <th className="py-2.5 px-3">Current HEI</th>
              <th className="py-2.5 px-3">Suggested HEI</th>
              <th className="py-2.5 px-3">Sector</th>
              <th className="py-2.5 px-3">Priority</th>
              <th className="py-2.5 px-3">Status</th>
              <th className="py-2.5 px-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredOverride.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/55 transition-colors">
                <td className="py-3 px-3 font-bold text-slate-500">{item.id}</td>
                <td className="py-3 px-3 font-bold text-slate-900 max-w-[180px] truncate">{item.title}</td>
                <td className="py-3 px-3 font-semibold text-slate-700">{item.currentHei}</td>
                <td className="py-3 px-3 font-semibold text-slate-500">{item.suggestedHei}</td>
                <td className="py-3 px-3">
                  <span className="inline-flex items-center font-semibold text-slate-700">
                    {getSectorIcon(item.sector)}
                    {item.sector}
                  </span>
                </td>
                <td className="py-3 px-3">
                  <div className="flex items-center space-x-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                      item.priority === 'High' ? 'bg-rose-500'
                      : item.priority === 'Medium' ? 'bg-amber-400'
                      : 'bg-slate-300'
                    }`} />
                    <span className="text-[10.5px] font-medium text-slate-700">{item.priority}</span>
                  </div>
                </td>
                <td className="py-3 px-3">
                  <div className="flex items-center space-x-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                      item.status === 'Reassignment Requested' ? 'bg-amber-400'
                      : item.status === 'Pending' ? 'bg-slate-400'
                      : item.status === 'Reassigned' ? 'bg-emerald-500'
                      : item.status === 'Completed' ? 'bg-blue-500'
                      : 'bg-slate-300'
                    }`} />
                    <span className="text-[10.5px] font-medium text-slate-700 whitespace-nowrap">{item.status}</span>
                  </div>
                </td>
                <td className="py-3 px-3 text-center">
                  {['Pending', 'Reassignment Requested'].includes(item.status) ? (
                    <button
                      onClick={() => handleOverrideReview(item)}
                      className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white font-bold text-[10px] rounded-lg transition-colors cursor-pointer"
                    >
                      Review
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setSelectedRecord(item);
                        setReviewType('override-view');
                      }}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[10px] rounded-lg border border-slate-200/60 transition-colors cursor-pointer"
                    >
                      View
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center border-t border-slate-100 pt-3 text-[10.5px] font-semibold text-slate-400">
        <span>Showing 1 to {filteredOverride.length} of {overrideData.length} records</span>
        <div className="flex space-x-1.5">
          <button className="w-6 h-6 flex items-center justify-center rounded-lg bg-blue-600 text-white font-bold">1</button>
          <button className="w-6 h-6 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold">2</button>
          <button className="w-6 h-6 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold">3</button>
          <span className="px-1 text-slate-400">...</span>
          <button className="w-6 h-6 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold">9</button>
        </div>
      </div>
    </div>
  );
};
export default AllocationOverride;
