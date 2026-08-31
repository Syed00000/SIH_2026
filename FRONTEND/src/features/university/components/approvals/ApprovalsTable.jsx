import React, { useState } from 'react';
import { MoreVertical, ChevronLeft, ChevronRight, Eye, CheckCircle2, FlaskConical } from 'lucide-react';

const getTypePill = (type = '') => {
  if (type.includes('Project')) return 'bg-blue-50 text-blue-800 border-blue-200';
  if (type.includes('Prototype')) return 'bg-purple-50 text-purple-800 border-purple-200';
  if (type.includes('Proposal')) return 'bg-emerald-50 text-[#007A61] border-emerald-200';
  if (type.includes('Partnership')) return 'bg-amber-50 text-amber-800 border-amber-200';
  if (type.includes('Payment')) return 'bg-emerald-50 text-emerald-800 border-emerald-200';
  return 'bg-slate-100 text-slate-800 border-slate-200';
};

const getStatusPill = (status = '') => {
  if (status === 'Approved') return 'bg-emerald-50 text-emerald-800 border-emerald-300';
  if (status === 'Pending') return 'bg-amber-50 text-amber-800 border-amber-300';
  if (status === 'Rejected') return 'bg-rose-50 text-rose-800 border-rose-300';
  if (status === 'Changes Required') return 'bg-orange-50 text-orange-800 border-orange-300';
  return 'bg-slate-100 text-slate-700 border-slate-200';
};

export const ApprovalsTable = ({
  approvals = [],
  selectedId,
  onSelect,
  loading = false
}) => {
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
          <span className="text-[10.5px] text-slate-500 font-medium">
            Click any row to inspect proposal dossier
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50/50 border-b border-slate-200/80 text-slate-500 font-extrabold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-2.5 px-3.5">Approval ID</th>
                <th className="py-2.5 px-3.5">Project / Challenge</th>
                <th className="py-2.5 px-3.5">Type</th>
                <th className="py-2.5 px-3.5">Faculty Lead</th>
                <th className="py-2.5 px-3.5">Date</th>
                <th className="py-2.5 px-3.5">Status</th>
                <th className="py-2.5 px-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {loading ? (
                [1, 2, 3, 4].map((i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={7} className="py-3 px-3.5">
                      <div className="h-4 bg-slate-100 rounded w-full" />
                    </td>
                  </tr>
                ))
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400 text-xs font-semibold">
                    No approval requests match the selected filters.
                  </td>
                </tr>
              ) : (
                items.map((apr) => {
                  const isSelected = selectedId === (apr.approvalId || apr._id);
                  return (
                    <tr
                      key={apr.approvalId || apr._id}
                      onClick={() => onSelect(apr)}
                      className={`hover:bg-emerald-50/30 transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-50/60 border-l-3 border-l-[#007A61]'
                          : ''
                      }`}
                    >
                      <td className="py-3 px-3.5 font-mono font-bold text-slate-900 text-xs">
                        {apr.approvalId}
                      </td>
                      <td className="py-3 px-3.5">
                        <div className="font-bold text-slate-900 truncate max-w-[180px]">
                          {apr.project}
                        </div>
                        {apr.challengeId && (
                          <div className="text-[10px] text-slate-400 font-mono">
                            {apr.challengeId}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-3.5">
                        <div className="flex items-center space-x-1.5">
                          {apr.type?.includes('Prototype') && <FlaskConical className="w-3.5 h-3.5 text-purple-600" />}
                          <span
                            className={`px-2 py-0.5 text-[10px] font-bold border rounded-full ${getTypePill(
                              apr.type
                            )}`}
                          >
                            {apr.type}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-3.5">
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 rounded-lg bg-slate-100 text-slate-700 text-[9px] font-black flex items-center justify-center shrink-0 border border-slate-200">
                            {(apr.requestedBy || '')
                              .split(' ')
                              .map((w) => w[0])
                              .join('')
                              .slice(0, 2)}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 text-xs leading-none">
                              {apr.requestedBy}
                            </div>
                            <div className="text-[10px] text-slate-400 font-medium mt-0.5">
                              {apr.requestedByDept}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3.5 text-slate-700">
                        <div className="font-semibold text-xs">{apr.date}</div>
                        <div className="text-[10px] text-slate-400">{apr.dateTime}</div>
                      </td>
                      <td className="py-3 px-3.5">
                        <span
                          className={`px-2 py-0.5 text-[10px] font-bold border rounded-md ${getStatusPill(
                            apr.status
                          )}`}
                        >
                          {apr.status}
                        </span>
                      </td>
                      <td className="py-3 px-3.5 text-right">
                        <div
                          className="flex items-center justify-end space-x-1"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={() => onSelect(apr)}
                            className="px-3 py-1 bg-white hover:bg-[#007A61] hover:text-white border border-slate-200 hover:border-[#007A61] text-slate-900 text-xs font-bold rounded-lg cursor-pointer transition-all shadow-2xs"
                          >
                            {apr.status === 'Pending' || apr.status === 'Changes Required'
                              ? 'Review'
                              : 'Inspect'}
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
      </div>

      <div className="px-4 py-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 bg-slate-50/70">
        <span>
          Showing {approvals.length === 0 ? 0 : start + 1} to{' '}
          {Math.min(start + pageSize, approvals.length)} of {approvals.length} approvals
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
                currentPage === pNum
                  ? 'bg-[#007A61] text-white'
                  : 'bg-white border border-slate-200 hover:bg-slate-100 text-slate-700'
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
