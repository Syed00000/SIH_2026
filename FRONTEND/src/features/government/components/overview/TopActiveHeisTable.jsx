import React, { useState } from 'react';
import { ArrowUpDown, School, Info } from 'lucide-react';

export const TopActiveHeisTable = ({ heis = [], onViewAll }) => {
  const [sortField, setSortField] = useState('solved');
  const [sortAsc, setSortAsc] = useState(false);

  const safeHeis = Array.isArray(heis) ? heis : [];

  const sortedHeis = [...safeHeis].sort((a, b) => {
    let aVal = a[sortField] || 0;
    let bVal = b[sortField] || 0;
    if (typeof aVal === 'string') {
      return sortAsc ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    }
    return sortAsc ? aVal - bVal : bVal - aVal;
  });

  const handleSort = (field) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200/80 hover:border-slate-300/90 rounded-xl p-4 shadow-[0_1px_3px_rgba(15,23,42,0.03)] hover:shadow-[0_8px_24px_-6px_rgba(15,23,42,0.07)] flex flex-col justify-between h-full min-h-[340px] transition-all duration-300 relative">
      {/* Header */}
      <div className="flex items-center justify-between pb-2.5 mb-2 border-b border-slate-100">
        <div className="flex items-center space-x-2">
          <School className="w-4 h-4 text-purple-600" />
          <div>
            <h3 className="text-xs font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
              <span>Top Active HEIs</span>
            </h3>
            <span className="text-[10px] text-slate-400 font-medium block leading-tight">
              Institutional Problem-Solving Leaderboard
            </span>
          </div>
        </div>
      </div>

      {/* Table Content */}
      <div className="flex-1 overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-100 text-[10px] uppercase font-bold text-slate-400 select-none">
              <th
                onClick={() => handleSort('name')}
                className="pb-2 font-bold cursor-pointer hover:text-slate-700"
              >
                <div className="flex items-center space-x-1">
                  <span>HEI Name</span>
                  <ArrowUpDown className="w-2.5 h-2.5 text-slate-400" />
                </div>
              </th>
              <th
                onClick={() => handleSort('projects')}
                className="pb-2 font-bold text-center cursor-pointer hover:text-slate-700"
              >
                <div className="flex items-center justify-center space-x-1">
                  <span>Active</span>
                  <ArrowUpDown className="w-2.5 h-2.5 text-slate-400" />
                </div>
              </th>
              <th
                onClick={() => handleSort('solved')}
                className="pb-2 font-bold text-right cursor-pointer hover:text-slate-700"
              >
                <div className="flex items-center justify-end space-x-1">
                  <span>Solved</span>
                  <ArrowUpDown className="w-2.5 h-2.5 text-slate-400" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {sortedHeis.length === 0 ? (
              <tr>
                <td colSpan="3" className="py-8 text-center text-slate-400 text-xs">
                  <Info className="w-5 h-5 mx-auto text-slate-300 mb-1" />
                  No HEI performance records found.
                </td>
              </tr>
            ) : (
              sortedHeis.map((hei, idx) => (
                <tr key={hei.id || idx} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-2.5 pr-2">
                    <span className="font-bold text-slate-900 truncate block max-w-[140px] text-[11.5px]">
                      {hei.name}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {hei.district || 'Jharkhand'}
                    </span>
                  </td>
                  <td className="py-2.5 px-2 text-center">
                    <span className="inline-flex items-center justify-center px-1.5 py-0.5 rounded-full text-[10.5px] font-bold bg-purple-50 text-purple-700 border border-purple-100">
                      {hei.activeProjects || hei.projects || 0}
                    </span>
                  </td>
                  <td className="py-2.5 pl-2 text-right">
                    <span className="font-bold text-slate-900 text-xs">
                      {hei.solvedChallenges || hei.solved || 0}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer Info */}
      <div className="pt-2.5 mt-1 border-t border-slate-100 flex items-center justify-between text-xs">
        <span className="text-[11px] text-slate-400 font-medium">
          {sortedHeis.length} HEIs Tracked
        </span>
        <button
          onClick={onViewAll}
          className="text-[11.5px] font-bold text-purple-700 hover:underline cursor-pointer"
        >
          View Full HEI Directory →
        </button>
      </div>
    </div>
  );
};

export default TopActiveHeisTable;
