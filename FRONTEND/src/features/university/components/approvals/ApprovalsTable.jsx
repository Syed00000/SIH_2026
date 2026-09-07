import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ApprovalTableRow } from './ApprovalTableRow.jsx';

export const ApprovalsTable = ({ approvals = [], selectedId, onSelect, loading = false }) => {
  const [page, setPage] = useState(1);
  const pageSize = 8;
  const totalPages = Math.max(1, Math.ceil(approvals.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * pageSize;
  const items = approvals.slice(start, start + pageSize);

  return (
    <div className="bg-white border border-slate-200/90 shadow-2xs rounded-2xl flex flex-col justify-between select-none overflow-hidden">
      <div>
        <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
          <h2 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
            Approval Dossiers ({approvals.length})
          </h2>
          <span className="text-[10.5px] text-slate-500 font-medium">Click any row to inspect proposal dossier</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50/50 border-b border-slate-200/80 text-slate-500 font-extrabold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-2.5 px-3.5">Approval ID</th>
                <th className="py-2.5 px-3.5">Project / Challenge</th>
                <th className="py-2.5 px-3.5">Type</th>
                <th className="py-2.5 px-3.5">Faculty Lead / Partner</th>
                <th className="py-2.5 px-3.5">Date</th>
                <th className="py-2.5 px-3.5">Status</th>
                <th className="py-2.5 px-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">Loading dossiers...</td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <p className="text-xs">No approval dossiers found in this category.</p>
                  </td>
                </tr>
              ) : (
                items.map((apr) => (
                  <ApprovalTableRow
                    key={apr.approvalId || apr._id}
                    apr={apr}
                    isSelected={selectedId === apr.approvalId || selectedId === apr.id}
                    onSelect={onSelect}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Footer */}
      <div className="px-4 py-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs text-slate-500">
        <span>
          Showing {approvals.length === 0 ? 0 : start + 1} to {Math.min(start + pageSize, approvals.length)} of {approvals.length} approvals
        </span>
        <div className="flex items-center space-x-1">
          <button
            disabled={currentPage === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="p-1 border border-slate-200 rounded-lg hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => i + 1).map((pNum) => (
            <button
              key={pNum}
              onClick={() => setPage(pNum)}
              className={`w-6 h-6 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                currentPage === pNum ? 'bg-[#007A61] text-white' : 'bg-white border border-slate-200 hover:bg-slate-100 text-slate-700'
              }`}
            >
              {pNum}
            </button>
          ))}
          <button
            disabled={currentPage === totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="p-1 border border-slate-200 rounded-lg hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApprovalsTable;
