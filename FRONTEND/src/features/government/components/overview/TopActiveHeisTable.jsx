import React, { useState } from 'react';
import { ArrowRight, ArrowUpDown, Building, X, CheckCircle2, IndianRupee, Award, School } from 'lucide-react';

export const TopActiveHeisTable = ({ heis = [], onViewAll }) => {
  const [sortField, setSortField] = useState('solved'); // 'name', 'projects', 'solved'
  const [sortAsc, setSortAsc] = useState(false);
  const [selectedHei, setSelectedHei] = useState(null);

  const sortedHeis = [...heis].sort((a, b) => {
    let aVal = a[sortField];
    let bVal = b[sortField];
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

  const maxSolved = Math.max(...heis.map(h => h.solved || 1), 150);

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
                className="pb-2 text-center font-bold cursor-pointer hover:text-slate-700"
              >
                <div className="flex items-center justify-center space-x-1">
                  <span>Projects</span>
                  <ArrowUpDown className="w-2.5 h-2.5 text-slate-400" />
                </div>
              </th>
              <th
                onClick={() => handleSort('solved')}
                className="pb-2 text-right font-bold cursor-pointer hover:text-slate-700"
              >
                <div className="flex items-center justify-end space-x-1">
                  <span>Solved</span>
                  <ArrowUpDown className="w-2.5 h-2.5 text-slate-400" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {sortedHeis.slice(0, 5).map((hei, idx) => {
              const solvePct = Math.min(100, Math.round(((hei.solved || 0) / maxSolved) * 100));
              return (
                <tr
                  key={hei.id || idx}
                  onClick={() => setSelectedHei(hei)}
                  className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                >
                  <td className="py-2.5 font-bold text-slate-900 pr-2">
                    <div className="flex items-center space-x-2">
                      <span className="w-4 h-4 rounded-full bg-slate-100 text-slate-600 font-extrabold text-[9.5px] flex items-center justify-center shrink-0 group-hover:bg-purple-100 group-hover:text-purple-700 transition-colors">
                        {idx + 1}
                      </span>
                      <div className="truncate max-w-[130px] sm:max-w-[160px] text-[11.5px] group-hover:text-blue-600 font-semibold">
                        {hei.name}
                      </div>
                    </div>
                  </td>
                  <td className="py-2.5 text-center font-semibold text-slate-600 text-[11px]">
                    <span className="bg-slate-50 border border-slate-200/60 px-1.5 py-0.5 rounded text-[10.5px]">
                      {hei.projects}
                    </span>
                  </td>
                  <td className="py-2.5 text-right font-bold text-slate-900 text-[11px]">
                    <div className="flex items-center justify-end space-x-1.5">
                      <span className="text-emerald-700 font-black">{hei.solved}</span>
                      <div className="w-8 h-1 bg-slate-100 rounded-full overflow-hidden shrink-0">
                        <div
                          className="h-full bg-emerald-500 rounded-full"
                          style={{ width: `${solvePct}%` }}
                        />
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer Link */}
      <div className="pt-2.5 mt-1 border-t border-slate-100 flex items-center justify-between text-xs">
        <div className="flex items-center space-x-1 text-[11px] text-slate-400 font-medium">
          <Award className="w-3.5 h-3.5 text-amber-500" />
          <span>Verified NIRF/NAAC</span>
        </div>
        <button
          onClick={onViewAll}
          className="inline-flex items-center text-[11.5px] font-bold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
        >
          <span>View All HEIs</span>
          <ArrowRight className="w-3 h-3 ml-1" />
        </button>
      </div>

      {/* HEI Detail Modal */}
      {selectedHei && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 border border-slate-200 shadow-xl space-y-4">
            <div className="flex justify-between items-start border-b border-slate-100 pb-2.5">
              <div>
                <h4 className="text-sm font-bold text-slate-900">{selectedHei.name}</h4>
                <p className="text-xs text-slate-500 font-medium">Lead District: {selectedHei.leadDistrict || 'Ranchi'}</p>
              </div>
              <button onClick={() => setSelectedHei(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2 py-1 text-center bg-slate-50 rounded-xl p-3">
              <div>
                <span className="text-[10px] text-slate-400 font-semibold block">Projects</span>
                <span className="text-sm font-bold text-slate-900">{selectedHei.projects}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-semibold block">Solved</span>
                <span className="text-sm font-bold text-emerald-600">{selectedHei.solved}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-semibold block">Grants</span>
                <span className="text-sm font-bold text-amber-600">{selectedHei.fundsReceived || '₹35L'}</span>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                onClick={() => setSelectedHei(null)}
                className="px-3.5 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TopActiveHeisTable;
