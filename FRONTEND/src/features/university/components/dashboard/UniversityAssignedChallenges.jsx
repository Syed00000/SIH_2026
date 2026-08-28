import React, { useState } from 'react';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { DOMAIN_BADGE_STYLES, STATUS_PILL_STYLES, PRIORITY_BADGE_STYLES } from '../../../../shared/config/designSystem.js';

export const UniversityAssignedChallenges = ({
  challenges = [],
  totalCount = 8,
  onActionClick,
  onViewAll
}) => {
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [domainFilter, setDomainFilter] = useState('All Domains');
  const [districtFilter, setDistrictFilter] = useState('All Districts');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const filtered = challenges.filter((item) => {
    if (statusFilter !== 'All Status' && item.status !== statusFilter) return false;
    if (domainFilter !== 'All Domains' && item.domain !== domainFilter) return false;
    if (districtFilter !== 'All Districts' && item.district !== districtFilter) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const id = item.id || item.challengeId || '';
      return item.title?.toLowerCase().includes(q) || id.toLowerCase().includes(q);
    }
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const activePage = Math.min(currentPage, totalPages);
  const startIndex = (activePage - 1) * pageSize;
  const paginatedItems = filtered.slice(startIndex, startIndex + pageSize);

  return (
    <div className="bg-white border border-slate-200 rounded-none shadow-none select-none">
      <div className="px-3.5 py-2.5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
        <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
          Assigned Challenges
        </h2>
        <button
          onClick={onViewAll}
          className="text-xs font-bold text-slate-900 hover:text-black cursor-pointer underline"
        >
          View All ({filtered.length})
        </button>
      </div>

      <div className="p-2.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 bg-white">
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
            className="px-2 py-1 bg-white border border-slate-200 rounded-none text-xs text-slate-800 font-medium cursor-pointer"
          >
            <option value="All Status">All Status</option>
            <option value="Review">Review Needed</option>
            <option value="Accepted">Accepted</option>
            <option value="Faculty Pending">Faculty Pending</option>
            <option value="Clarification">Clarification</option>
          </select>

          <select
            value={domainFilter}
            onChange={(e) => { setDomainFilter(e.target.value); setCurrentPage(1); }}
            className="px-2 py-1 bg-white border border-slate-200 rounded-none text-xs text-slate-800 font-medium cursor-pointer"
          >
            <option value="All Domains">All Domains</option>
            <option value="Water">Water</option>
            <option value="Education">Education</option>
            <option value="Infrastructure">Infrastructure</option>
            <option value="Environment">Environment</option>
            <option value="Agriculture">Agriculture</option>
          </select>

          <select
            value={districtFilter}
            onChange={(e) => { setDistrictFilter(e.target.value); setCurrentPage(1); }}
            className="px-2 py-1 bg-white border border-slate-200 rounded-none text-xs text-slate-800 font-medium cursor-pointer"
          >
            <option value="All Districts">All Districts</option>
            <option value="Ranchi">Ranchi</option>
            <option value="Dumka">Dumka</option>
            <option value="Gumla">Gumla</option>
            <option value="Jamshedpur">Jamshedpur</option>
            <option value="Pakur">Pakur</option>
          </select>
        </div>

        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            placeholder="Search challenge..."
            className="pl-2 pr-7 py-1 bg-white border border-slate-200 rounded-none text-xs text-slate-800 placeholder-slate-400 w-44"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-2 pointer-events-none" />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-700">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10.5px]">
            <tr>
              <th className="py-2 px-3">ID</th>
              <th className="py-2 px-3">Title</th>
              <th className="py-2 px-3">Domain</th>
              <th className="py-2 px-3">District</th>
              <th className="py-2 px-3">Priority</th>
              <th className="py-2 px-3">Status</th>
              <th className="py-2 px-3">Assigned On</th>
              <th className="py-2 px-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {paginatedItems.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-6 text-center text-slate-400 text-xs">
                  No challenges found matching the selected filters.
                </td>
              </tr>
            ) : (
              paginatedItems.map((row, index) => (
                <tr key={`${row._id || row.id || row.challengeId || 'chl'}-${index}`} className="hover:bg-slate-50 transition-colors">
                  <td className="py-2 px-3 font-mono text-slate-900 font-bold">{row.id || row.challengeId}</td>
                  <td className="py-2 px-3 font-bold text-slate-900 truncate max-w-[200px]">{row.title}</td>
                  <td className="py-2 px-3">
                    <span className={`px-2 py-0.5 rounded-none text-[11px] font-semibold ${DOMAIN_BADGE_STYLES[row.domain] || 'bg-slate-100 text-slate-800'}`}>
                      {row.domain}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-slate-700">{row.district}</td>
                  <td className={`py-2 px-3 ${PRIORITY_BADGE_STYLES[row.priority] || 'text-slate-600'}`}>{row.priority}</td>
                  <td className="py-2 px-3">
                    <span className={`px-2 py-0.5 rounded-none text-[11px] font-semibold ${STATUS_PILL_STYLES[row.status] || 'bg-slate-100 text-slate-800'}`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-slate-500 whitespace-nowrap">{typeof row.assignedOn === 'string' ? row.assignedOn.slice(0, 10) : '2026-05-20'}</td>
                  <td className="py-2 px-3 text-right">
                    <button
                      onClick={() => onActionClick && onActionClick(row)}
                      className="px-2.5 py-1 rounded-none text-xs font-bold transition-colors cursor-pointer bg-slate-900 hover:bg-black text-white"
                    >
                      {row.actionText || (row.status === 'Review' ? 'Review' : 'View')}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="px-3.5 py-2 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 bg-slate-50">
        <div>Showing {filtered.length === 0 ? 0 : startIndex + 1} to {Math.min(startIndex + pageSize, filtered.length)} of {filtered.length}</div>
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
              className={`w-5 h-5 rounded-none font-bold text-xs flex items-center justify-center cursor-pointer ${
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

export default UniversityAssignedChallenges;
