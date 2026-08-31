import React from 'react';
import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';

export const DashboardChallengesPagination = ({
  filteredCount,
  startIndex,
  itemsPerPage,
  setItemsPerPage,
  activePage,
  totalPages,
  setCurrentPage
}) => {
  return (
    <div className="p-3.5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 bg-slate-50/30">
      <div>
        Showing <span className="font-bold text-slate-800">{filteredCount > 0 ? startIndex + 1 : 0}</span> to{' '}
        <span className="font-bold text-slate-800">{Math.min(startIndex + itemsPerPage, filteredCount)}</span> of{' '}
        <span className="font-bold text-slate-800">{filteredCount}</span> challenges
      </div>

      <div className="flex items-center space-x-2.5">
        <div className="relative">
          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="bg-white border border-slate-200 rounded-md px-2 py-1 pr-6 text-xs font-medium text-slate-700 hover:border-slate-300 focus:outline-none cursor-pointer appearance-none shadow-2xs"
          >
            <option value={5}>5 per page</option>
            <option value={10}>10 per page</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        <div className="flex items-center space-x-1">
          <button
            disabled={activePage <= 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="w-7 h-7 rounded-md border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 disabled:opacity-40 cursor-pointer shadow-2xs"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
            <button
              key={pageNum}
              onClick={() => setCurrentPage(pageNum)}
              className={`w-7 h-7 rounded-md text-xs font-bold transition-colors cursor-pointer ${
                activePage === pageNum
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {pageNum}
            </button>
          ))}

          <button
            disabled={activePage >= totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            className="w-7 h-7 rounded-md border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 disabled:opacity-40 cursor-pointer shadow-2xs"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardChallengesPagination;
