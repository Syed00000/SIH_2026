import React from 'react';
import { Building2, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import { TableSkeleton } from '../../../../shared/components/ui/tableSkeleton.jsx';
import { UniversityTableRow } from './UniversityTableRow.jsx';

export const UniversityTable = ({
  records = [],
  loading = false,
  total = 0,
  page = 1,
  limit = 10,
  onPageChange,
  onLimitChange,
  onViewUniversity,
  onEditUniversity,
  onToggleAccess,
  onUpdateStatus,
  onDeleteClick,
  onResetFilters
}) => {
  const totalPages = Math.ceil(total / limit) || 1;

  return (
    <div className="border border-slate-200/90 rounded-lg overflow-hidden flex flex-col w-full shadow-2xs select-none">
      <div className="overflow-x-auto w-full">
        <table className="w-full text-left border-collapse min-w-[850px]">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/60 text-[10.5px] font-bold text-slate-400 uppercase tracking-wider select-none">
              <th className="py-2.5 px-2.5 w-[45px] text-center">#</th>
              <th className="py-2.5 px-3 min-w-[190px]">University / Institution</th>
              <th className="py-2.5 px-2.5 w-[110px]">District</th>
              <th className="py-2.5 px-2.5 w-[160px]">Nodal Officer</th>
              <th className="py-2.5 px-2.5 w-[95px]">Registered On</th>
              <th className="py-2.5 px-2.5 w-[100px]">Review Status</th>
              <th className="py-2.5 px-2.5 w-[95px]">Access Status</th>
              <th className="py-2.5 px-3 w-[110px] text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {loading ? (
              <TableSkeleton rows={6} columns={8} />
            ) : records.length === 0 ? (
              <tr>
                <td colSpan="8" className="py-12 text-center text-slate-400">
                  <Building2 className="w-7 h-7 text-slate-300 mx-auto mb-2" />
                  <div className="font-semibold text-slate-600">No universities found matching criteria</div>
                  <button
                    onClick={onResetFilters}
                    className="mt-1 text-[11px] font-bold text-blue-600 hover:underline cursor-pointer"
                  >
                    Reset all filters
                  </button>
                </td>
              </tr>
            ) : (
              records.map((uni, index) => (
                <UniversityTableRow
                  key={uni._id || uni.id || uni.code || index}
                  uni={uni}
                  index={(page - 1) * limit + index + 1}
                  onViewUniversity={onViewUniversity}
                  onEditUniversity={onEditUniversity}
                  onToggleAccess={onToggleAccess}
                  onUpdateStatus={onUpdateStatus}
                  onDeleteClick={onDeleteClick}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-3.5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 bg-slate-50/30">
        <div>
          Showing <span className="font-bold text-slate-800">{records.length > 0 ? (page - 1) * limit + 1 : 0}</span> to{' '}
          <span className="font-bold text-slate-800">{Math.min(page * limit, total)}</span> of{' '}
          <span className="font-bold text-slate-800">{total}</span> universities
        </div>

        <div className="flex items-center space-x-2.5">
          <div className="relative">
            <select
              value={limit}
              onChange={(e) => onLimitChange(Number(e.target.value))}
              className="bg-white border border-slate-200 rounded-md px-2 py-1 pr-6 text-xs font-medium text-slate-700 hover:border-slate-300 focus:outline-none cursor-pointer appearance-none shadow-2xs"
            >
              <option value={10}>10 per page</option>
              <option value={20}>20 per page</option>
              <option value={50}>50 per page</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <div className="flex items-center space-x-1">
            <button
              disabled={page <= 1}
              onClick={() => onPageChange(Math.max(1, page - 1))}
              className="w-7 h-7 rounded-md border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 disabled:opacity-40 cursor-pointer shadow-2xs"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                className={`w-7 h-7 rounded-md text-xs font-bold transition-colors cursor-pointer ${
                  page === pageNum
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {pageNum}
              </button>
            ))}

            <button
              disabled={page >= totalPages}
              onClick={() => onPageChange(page + 1)}
              className="w-7 h-7 rounded-md border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 disabled:opacity-40 cursor-pointer shadow-2xs"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UniversityTable;
