import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Eye, FlaskConical, Lock, CheckCircle2 } from 'lucide-react';

const getTypePill = (type = '') => {
  if (type.includes('Project')) return 'bg-blue-50 text-blue-800 border-blue-200';
  if (type.includes('Prototype')) return 'bg-purple-50 text-purple-800 border-purple-200';
  if (type.includes('Proposal')) return 'bg-emerald-50 text-[#007A61] border-emerald-200';
  if (type.includes('Partnership')) return 'bg-amber-50 text-amber-800 border-amber-200';
  return 'bg-slate-100 text-slate-800 border-slate-200';
};

const getStatusBadge = (apr) => {
  const isDeployed = Boolean(
    apr.isDeployed ||
    apr.isLocked ||
    apr.status === 'Deployed' ||
    apr.governmentStatus === 'Approved & Deployed'
  );
  if (isDeployed) {
    return (
      <span className="px-2 py-0.5 text-[10px] font-black border rounded-md bg-teal-50 text-teal-800 border-teal-300 inline-flex items-center space-x-1">
        <Lock className="w-2.5 h-2.5 text-teal-700" />
        <span>🔒 Deployed</span>
      </span>
    );
  }

  const isForwarded = Boolean(
    apr.sentToGovernment ||
    apr.governmentStatus === 'Under State Evaluation' ||
    apr.governmentStatus === 'Approved'
  );
  if (isForwarded) {
    return (
      <span className="px-2 py-0.5 text-[10px] font-bold border rounded-md bg-blue-50 text-blue-800 border-blue-300 inline-flex items-center space-x-1">
        <CheckCircle2 className="w-2.5 h-2.5 text-blue-600" />
        <span>✓ Forwarded to Govt</span>
      </span>
    );
  }

  if (apr.status === 'Approved') {
    return (
      <span className="px-2 py-0.5 text-[10px] font-bold border rounded-md bg-emerald-50 text-emerald-800 border-emerald-300">
        Approved
      </span>
    );
  }
  if (apr.status === 'Rejected') {
    return (
      <span className="px-2 py-0.5 text-[10px] font-bold border rounded-md bg-rose-50 text-rose-800 border-rose-300">
        Rejected
      </span>
    );
  }
  if (apr.status === 'Changes Required') {
    return (
      <span className="px-2 py-0.5 text-[10px] font-bold border rounded-md bg-orange-50 text-orange-800 border-orange-300">
        Revisions Directed
      </span>
    );
  }

  return (
    <span className="px-2 py-0.5 text-[10px] font-bold border rounded-md bg-amber-50 text-amber-800 border-amber-300">
      Pending Review
    </span>
  );
};

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
                items.map((apr) => {
                  const isSelected = selectedId === apr.approvalId || selectedId === apr.id;
                  const isProto = apr.type?.includes('Prototype');
                  return (
                    <tr
                      key={apr.approvalId || apr._id}
                      onClick={() => onSelect(apr)}
                      className={`hover:bg-emerald-50/30 transition-colors cursor-pointer ${
                        isSelected ? 'bg-emerald-50/60 border-l-3 border-l-[#007A61]' : ''
                      }`}
                    >
                      <td className="py-3 px-3.5 font-mono font-bold text-slate-900 text-xs">{apr.approvalId}</td>
                      <td className="py-3 px-3.5">
                        <div className="font-bold text-slate-900 truncate max-w-[180px]">{apr.project}</div>
                        {apr.challengeId && <div className="text-[10px] text-slate-400 font-mono">{apr.challengeId}</div>}
                      </td>
                      <td className="py-3 px-3.5">
                        <div className="flex items-center space-x-1.5">
                          {isProto && <FlaskConical className="w-3.5 h-3.5 text-purple-600" />}
                          <span className={`px-2 py-0.5 text-[10px] font-bold border rounded-full ${getTypePill(apr.type)}`}>
                            {apr.type}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-3.5">
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 rounded-lg bg-slate-100 text-slate-700 text-[9px] font-black flex items-center justify-center shrink-0 border border-slate-200">
                            {(apr.partnerName || apr.requestedBy || 'IN').slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 text-xs leading-none">{apr.partnerName || apr.requestedBy}</div>
                            <div className="text-[10px] text-slate-400 font-medium mt-0.5">{apr.requestedByDept || 'Industry Partner'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3.5 text-slate-700">
                        <div className="font-semibold text-xs">{apr.date}</div>
                        <div className="text-[10px] text-slate-400">{apr.dateTime}</div>
                      </td>
                      <td className="py-3 px-3.5">
                        {getStatusBadge(apr)}
                      </td>
                      <td className="py-3 px-3.5 text-right">
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); onSelect(apr); }}
                          className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-[11px] font-bold inline-flex items-center space-x-1 shadow-2xs"
                        >
                          <Eye className="w-3 h-3 text-[#007A61]" />
                          <span>View</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
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
