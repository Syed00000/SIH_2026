import React, { useState } from 'react';
import { MoreVertical, ChevronLeft, ChevronRight } from 'lucide-react';

const getStatusPill = (status = '') => {
  if (status === 'Active') return 'bg-emerald-50 text-emerald-800 border-emerald-300';
  if (status === 'Pending') return 'bg-amber-50 text-amber-800 border-amber-300';
  if (status === 'Invited') return 'bg-slate-100 text-slate-800 border-slate-300';
  if (status === 'Completed') return 'bg-purple-50 text-purple-800 border-purple-300';
  return 'bg-rose-50 text-rose-800 border-rose-300';
};

const getSupportBadge = (supp = '') => {
  const s = supp.toLowerCase();
  if (s.includes('funding')) return 'bg-emerald-50 text-emerald-800 border-emerald-200';
  if (s.includes('mentorship')) return 'bg-slate-100 text-slate-800 border-slate-200';
  if (s.includes('equipment')) return 'bg-amber-50 text-amber-800 border-amber-200';
  if (s.includes('lab')) return 'bg-purple-50 text-purple-800 border-purple-200';
  if (s.includes('pilot')) return 'bg-blue-50 text-blue-800 border-blue-200';
  return 'bg-slate-100 text-slate-800 border-slate-200';
};

export const PartnersTable = ({
  partners = [],
  selectedPartnerId,
  onSelectPartner,
  loading = false
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  const totalPages = Math.max(1, Math.ceil(partners.length / pageSize));
  const activePage = Math.min(currentPage, totalPages);
  const startIndex = (activePage - 1) * pageSize;
  const paginatedItems = partners.slice(startIndex, startIndex + pageSize);

  return (
    <div className="bg-white border border-slate-200 shadow-2xs select-none rounded-none overflow-hidden flex flex-col justify-between">
      <div>
        <div className="p-3 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <h2 className="text-xs font-bold text-slate-900 tracking-tight uppercase">
            Partner List ({partners.length})
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[10.5px]">
              <tr>
                <th className="py-2.5 px-3">Partner</th>
                <th className="py-2.5 px-3">Industry Type</th>
                <th className="py-2.5 px-3">Support Offered</th>
                <th className="py-2.5 px-3">Active Projects</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {loading ? (
                [1, 2, 3, 4, 5, 6].map((i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={6} className="py-3 px-3">
                      <div className="h-4 bg-slate-100 w-full" />
                    </td>
                  </tr>
                ))
              ) : paginatedItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500 font-medium text-xs">
                    No corporate partners match the selected criteria.
                  </td>
                </tr>
              ) : (
                paginatedItems.map((p) => {
                  const isSelected = selectedPartnerId === (p.partnerId || p._id);
                  const supports = Array.isArray(p.supportOffered) ? p.supportOffered : ['Funding', 'Mentorship'];

                  return (
                    <tr
                      key={p.partnerId || p._id}
                      onClick={() => onSelectPartner(p)}
                      className={`hover:bg-slate-50 transition-colors cursor-pointer ${
                        isSelected ? 'bg-slate-100 border-l-4 border-l-slate-900' : ''
                      }`}
                    >
                      <td className="py-2.5 px-3">
                        <div className="flex items-center space-x-2.5">
                          <div className="w-7 h-7 rounded-none bg-slate-100 border border-slate-200 font-bold text-[10px] text-slate-900 flex items-center justify-center shrink-0">
                            {p.logoText || (p.name ? p.name.slice(0, 3).toUpperCase() : 'ABC')}
                          </div>
                          <div className="font-bold text-slate-900 truncate max-w-[180px]">{p.name}</div>
                        </div>
                      </td>
                      <td className="py-2.5 px-3 text-slate-700 font-medium">{p.industryType || p.type || 'Technology'}</td>
                      <td className="py-2.5 px-3">
                        <div className="flex items-center space-x-1 flex-wrap gap-y-1">
                          {supports.slice(0, 2).map((s, idx) => (
                            <span key={idx} className={`px-2 py-0.5 text-[10px] font-bold border rounded-none ${getSupportBadge(s)}`}>
                              {s}
                            </span>
                          ))}
                          {supports.length > 2 && (
                            <span className="text-[10px] font-bold text-slate-500 px-1">+ {supports.length - 2}</span>
                          )}
                        </div>
                      </td>
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-900">{p.activeProjectsCount || p.activePilots || 3} Projects</td>
                      <td className="py-2.5 px-3">
                        <span className={`px-2 py-0.5 text-[10px] font-bold border rounded-none ${getStatusPill(p.status)}`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <div className="flex items-center justify-end space-x-1" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => onSelectPartner(p)}
                            className="px-2.5 py-1 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-none cursor-pointer transition-colors"
                          >
                            View Profile
                          </button>
                          <button className="p-1 text-slate-400 hover:text-slate-900 cursor-pointer">
                            <MoreVertical className="w-3.5 h-3.5" />
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

      <div className="px-3.5 py-2 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 bg-slate-50">
        <div>Showing {partners.length === 0 ? 0 : startIndex + 1} to {Math.min(startIndex + pageSize, partners.length)} of {partners.length} partners</div>
        <div className="flex items-center space-x-1">
          <button
            disabled={activePage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="p-1 border border-slate-200 rounded-none hover:bg-slate-100 disabled:opacity-40 text-slate-600 cursor-pointer"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pNum) => (
            <button
              key={pNum}
              onClick={() => setCurrentPage(pNum)}
              className={`w-6 h-6 rounded-none font-bold text-xs flex items-center justify-center cursor-pointer ${
                activePage === pNum ? 'bg-slate-900 text-white' : 'border border-slate-200 hover:bg-slate-100 text-slate-700'
              }`}
            >
              {pNum}
            </button>
          ))}

          <button
            disabled={activePage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            className="p-1 border border-slate-200 rounded-none hover:bg-slate-100 disabled:opacity-40 text-slate-600 cursor-pointer"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PartnersTable;
