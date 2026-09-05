import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const CSRProposalPagination = ({
  sortedLength,
  currentPage,
  pageSize,
  setPageSize,
  setCurrentPage,
  totalPages
}) => {
  return (
    <div className="p-3 sm:p-4 border-t border-slate-100 bg-white flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
      <div className="text-slate-600 text-[11.5px] font-medium">
        Showing <strong className="text-slate-900">{sortedLength > 0 ? (currentPage - 1) * pageSize + 1 : 0}</strong> to{' '}
        <strong className="text-slate-900">{Math.min(currentPage * pageSize, sortedLength)}</strong> of{' '}
        <strong className="text-slate-900">{sortedLength}</strong> proposals
      </div>

      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-1.5 text-slate-600 text-[11px]">
          <span>Rows per page:</span>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="bg-slate-50 border border-slate-200 rounded px-2 py-1 font-semibold text-slate-900 outline-none cursor-pointer text-xs"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
        </div>

        <div className="flex items-center space-x-1">
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="p-1.5 rounded-md border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white text-slate-900 cursor-pointer transition-colors"
            title="Previous Page"
          >
            <ChevronLeft className="w-3.5 h-3.5 text-slate-900" />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
            <button
              key={pageNum}
              type="button"
              onClick={() => setCurrentPage(pageNum)}
              className={`w-7 h-7 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                currentPage === pageNum
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'border border-slate-200 hover:bg-slate-50 text-slate-900'
              }`}
            >
              {pageNum}
            </button>
          ))}

          <button
            type="button"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            className="p-1.5 rounded-md border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white text-slate-900 cursor-pointer transition-colors"
            title="Next Page"
          >
            <ChevronRight className="w-3.5 h-3.5 text-slate-900" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CSRProposalPagination;
