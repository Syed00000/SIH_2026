import React from 'react';
import { Eye, Pencil, PauseCircle, PlayCircle, Trash2, Building, ChevronLeft, ChevronRight, ChevronDown, Key, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { TableSkeleton } from '../../../../shared/components/ui/tableSkeleton.jsx';

const CATEGORY_BADGE_STYLES = {
  'Private Industry': 'bg-blue-50 text-blue-700 border-blue-200/80',
  'Govt Dept': 'bg-purple-50 text-purple-700 border-purple-200/80',
  'Government Department': 'bg-purple-50 text-purple-700 border-purple-200/80',
  'MSME': 'bg-amber-50 text-amber-700 border-amber-200/80',
  'Research Lab': 'bg-teal-50 text-teal-700 border-teal-200/80',
  'Startup': 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
  'CSR': 'bg-violet-50 text-violet-700 border-violet-200/80',
  'PSU': 'bg-sky-50 text-sky-700 border-sky-200/80',
  'Industry Association': 'bg-indigo-50 text-indigo-700 border-indigo-200/80'
};

const getCategoryBadgeClass = (category) => {
  return CATEGORY_BADGE_STYLES[category] || 'bg-slate-100 text-slate-700 border-slate-200';
};

const getFirstLetter = (name = '') => {
  const clean = name.trim();
  return clean ? clean.charAt(0).toUpperCase() : 'I';
};

export const IndustryTable = ({
  industries = [],
  isLoading = false,
  totalRecords = 0,
  currentPage = 1,
  totalPages = 1,
  itemsPerPage = 10,
  onPageChange,
  onLimitChange,
  onView,
  onEdit,
  onToggleStatus,
  onResetPassword,
  onDelete,
  onApprove
}) => {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalRecords);

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden flex flex-col">
      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/75 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <th className="py-3 px-4">Entity ID</th>
              <th className="py-3 px-4">Organization Name</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Thematic Domain</th>
              <th className="py-3 px-4">Support Mode</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {isLoading ? (
              <TableSkeleton rows={6} columns={7} />
            ) : industries.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-400">
                  <Building className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                  <p className="font-semibold text-slate-600">No industry organizations found</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Try adjusting your search query or filters.</p>
                </td>
              </tr>
            ) : (
              industries.map((ind) => {
                const supportModeStr = Array.isArray(ind.supportModes) ? ind.supportModes.join(', ') : (ind.supportModes || 'Funding');
                const thematicDomainStr = ind.thematicDomain || (Array.isArray(ind.thematicDomains) ? ind.thematicDomains.join(', ') : 'Innovation');
                const isEnabled = ind.status === 'Active' && ind.accessStatus !== 'Disabled';

                return (
                  <tr key={ind._id || ind.industryId} className="hover:bg-slate-50/80 transition-colors">
                    {/* 1. Entity ID */}
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-800 text-[11px] whitespace-nowrap">
                      {ind.industryId}
                    </td>

                    {/* 2. Organization Name with Letter Avatar */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center shrink-0">
                          {getFirstLetter(ind.legalName)}
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-slate-900 leading-tight truncate">
                            {ind.legalName}
                          </div>
                          {ind.shortName && (
                            <div className="text-[10px] font-medium text-slate-400 mt-0.5">
                              {ind.shortName}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* 3. Category */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${getCategoryBadgeClass(
                          ind.category
                        )}`}
                      >
                        {ind.category}
                      </span>
                    </td>

                    {/* 4. Thematic Domain */}
                    <td className="py-3.5 px-4 text-slate-700 font-medium text-[11px] max-w-[180px] truncate" title={thematicDomainStr}>
                      {thematicDomainStr}
                    </td>

                    {/* 5. Support Mode */}
                    <td className="py-3.5 px-4 text-slate-600 font-medium text-[11px] max-w-[180px] truncate" title={supportModeStr}>
                      {supportModeStr}
                    </td>

                    {/* 6. Status */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {ind.verificationStatus === 'Pending' ? (
                        <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border bg-amber-50 text-amber-800 border-amber-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                          <span>Pending Review</span>
                        </span>
                      ) : ind.verificationStatus === 'Rejected' ? (
                        <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border bg-rose-50 text-rose-700 border-rose-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                          <span>Rejected</span>
                        </span>
                      ) : (
                        <span
                          className={`inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                            isEnabled
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-red-50 text-red-600 border-red-200'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isEnabled ? 'bg-emerald-500' : 'bg-red-500'
                            }`}
                          />
                          <span>{isEnabled ? 'Active' : 'Disabled'}</span>
                        </span>
                      )}
                    </td>

                    {/* 7. Actions */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end space-x-1.5">
                        {/* Pending Review Action */}
                        {ind.verificationStatus === 'Pending' && (
                          <button
                            onClick={() => onApprove?.(ind)}
                            className="h-7 px-2.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] flex items-center space-x-1 transition-colors cursor-pointer shadow-2xs"
                            title="Review and Approve Application"
                          >
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>Review & Approve</span>
                          </button>
                        )}

                        {/* View Action */}
                        <button
                          onClick={() => onView?.(ind)}
                          className="w-7 h-7 rounded border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer shadow-2xs"
                          title="View Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {/* Actions for Active / Verified records */}
                        {ind.verificationStatus !== 'Pending' && (
                          <>
                            {/* Edit Action */}
                            <button
                              onClick={() => onEdit?.(ind)}
                              className="w-7 h-7 rounded border border-slate-200 flex items-center justify-center text-blue-600 hover:bg-blue-50 hover:border-blue-300 transition-colors cursor-pointer shadow-2xs"
                              title="Edit Organization"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>

                            {/* Reset Password Action */}
                            <button
                              onClick={() => onResetPassword?.(ind)}
                              className="w-7 h-7 rounded border border-slate-200 flex items-center justify-center text-indigo-600 hover:bg-indigo-50 hover:border-indigo-300 transition-colors cursor-pointer shadow-2xs"
                              title="Regenerate Credentials"
                            >
                              <Key className="w-3.5 h-3.5" />
                            </button>

                            {/* Enable / Disable Action */}
                            <button
                              onClick={() => onToggleStatus?.(ind)}
                              className={`w-7 h-7 rounded border flex items-center justify-center transition-colors cursor-pointer shadow-2xs ${
                                isEnabled
                                  ? 'border-amber-200 text-amber-600 hover:bg-amber-50 hover:border-amber-300'
                                  : 'border-emerald-200 text-emerald-600 hover:bg-emerald-50 hover:border-emerald-300'
                              }`}
                              title={isEnabled ? 'Disable Account' : 'Enable Account'}
                            >
                              {isEnabled ? (
                                <PauseCircle className="w-3.5 h-3.5" />
                              ) : (
                                <PlayCircle className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </>
                        )}

                        {/* Delete Action */}
                        <button
                          onClick={() => onDelete?.(ind)}
                          className="w-7 h-7 rounded border border-red-200 flex items-center justify-center text-red-600 hover:bg-red-50 hover:border-red-300 transition-colors cursor-pointer shadow-2xs"
                          title="Remove Organization"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer matching Reference */}
      <div className="p-3.5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 bg-white">
        <div>
          Showing <span className="font-semibold text-slate-700">{totalRecords > 0 ? startIndex + 1 : 0}</span> to{' '}
          <span className="font-semibold text-slate-700">{endIndex}</span> of{' '}
          <span className="font-semibold text-slate-700">{totalRecords}</span> entries
        </div>

        <div className="flex items-center space-x-3">
          {/* Items Per Page Select */}
          <div className="relative">
            <select
              value={itemsPerPage}
              onChange={(e) => onLimitChange?.(Number(e.target.value))}
              className="bg-white border border-slate-200 rounded px-2.5 py-1.5 pr-7 text-xs font-semibold text-slate-700 hover:border-slate-300 focus:outline-none cursor-pointer appearance-none shadow-2xs"
            >
              <option value={10}>10 per page</option>
              <option value={20}>20 per page</option>
              <option value={50}>50 per page</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Page Buttons */}
          <div className="flex items-center space-x-1">
            <button
              onClick={() => onPageChange?.(Math.max(1, currentPage - 1))}
              disabled={currentPage <= 1}
              className="w-7 h-7 rounded border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 disabled:opacity-40 cursor-pointer shadow-2xs"
              title="Previous Page"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => onPageChange?.(pageNum)}
                className={`w-7 h-7 rounded text-xs font-bold transition-colors cursor-pointer ${
                  currentPage === pageNum
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {pageNum}
              </button>
            ))}

            <button
              onClick={() => onPageChange?.(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage >= totalPages}
              className="w-7 h-7 rounded border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 disabled:opacity-40 cursor-pointer shadow-2xs"
              title="Next Page"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndustryTable;
