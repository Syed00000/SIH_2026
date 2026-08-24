import React, { useState } from 'react';
import { ArrowRight, ArrowUpDown, Building, X, CheckCircle2, IndianRupee } from 'lucide-react';

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

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 shadow-xs flex flex-col justify-between h-full min-h-[300px] relative">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 mb-1 border-b border-slate-100">
        <h3 className="text-sm font-bold text-slate-900 tracking-tight">
          Top Active HEIs
        </h3>
        <button
          onClick={onViewAll}
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
        >
          View All
        </button>
      </div>

      {/* Table Content */}
      <div className="flex-1 overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-100 text-[10px] uppercase font-bold text-slate-400 select-none">
              <th
                onClick={() => handleSort('name')}
                className="pb-2 font-semibold cursor-pointer hover:text-slate-700"
              >
                <div className="flex items-center space-x-1">
                  <span>HEI Name</span>
                  <ArrowUpDown className="w-2.5 h-2.5" />
                </div>
              </th>
              <th
                onClick={() => handleSort('projects')}
                className="pb-2 text-center font-semibold cursor-pointer hover:text-slate-700"
              >
                <div className="flex items-center justify-center space-x-1">
                  <span>Projects</span>
                  <ArrowUpDown className="w-2.5 h-2.5" />
                </div>
              </th>
              <th
                onClick={() => handleSort('solved')}
                className="pb-2 text-right font-semibold cursor-pointer hover:text-slate-700"
              >
                <div className="flex items-center justify-end space-x-1">
                  <span>Solved</span>
                  <ArrowUpDown className="w-2.5 h-2.5" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {sortedHeis.slice(0, 5).map((hei) => (
              <tr
                key={hei.id}
                onClick={() => setSelectedHei(hei)}
                className="hover:bg-slate-50/80 transition-colors cursor-pointer"
              >
                <td className="py-2.5 font-bold text-slate-900 pr-2">
                  <div className="truncate max-w-[140px] sm:max-w-[170px] hover:text-blue-600">
                    {hei.name}
                  </div>
                </td>
                <td className="py-2.5 text-center font-semibold text-slate-600">
                  {hei.projects}
                </td>
                <td className="py-2.5 text-right font-bold text-slate-800">
                  {hei.solved}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer Link */}
      <div className="pt-2 border-t border-slate-100 text-right mt-1">
        <button
          onClick={onViewAll}
          className="inline-flex items-center text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
        >
          <span>View All HEIs</span>
          <ArrowRight className="w-3.5 h-3.5 ml-1" />
        </button>
      </div>

      {/* HEI Detail Modal */}
      {selectedHei && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 border border-slate-200 shadow-xl space-y-4">
            <div className="flex justify-between items-start border-b border-slate-100 pb-2.5">
              <div>
                <h4 className="text-sm font-bold text-slate-900">{selectedHei.name}</h4>
                <p className="text-xs text-slate-500 font-medium">Lead District: {selectedHei.leadDistrict}</p>
              </div>
              <button onClick={() => setSelectedHei(null)} className="text-slate-400 hover:text-slate-600">
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
                className="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold"
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
