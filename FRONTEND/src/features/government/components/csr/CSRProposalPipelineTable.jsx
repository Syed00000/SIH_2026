import React, { useState, useMemo } from 'react';
import { Search, FileText, ArrowUpDown } from 'lucide-react';
import { ProposalDetailModal } from './ProposalDetailModal.jsx';
import { CSRProposalTableRow } from './CSRProposalTableRow.jsx';
import { CSRProposalPagination } from './CSRProposalPagination.jsx';

export const CSRProposalPipelineTable = ({
  proposals = [],
  onUpdateProposal,
  onDeleteProposal,
  onInitiateDisbursal,
  activeFilter = null,
  onSelectProposal
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [schemeFilter, setSchemeFilter] = useState('All');
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [sortAsc, setSortAsc] = useState(true);

  const filtered = useMemo(() => {
    return proposals.filter((p) => {
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const match =
          p.id.toLowerCase().includes(q) ||
          p.institutionName?.toLowerCase().includes(q) ||
          p.sourceScheme?.toLowerCase().includes(q) ||
          p.dueDiligence?.toLowerCase().includes(q) ||
          (p.district && p.district.toLowerCase().includes(q));
        if (!match) return false;
      }
      if (schemeFilter !== 'All') {
        if (schemeFilter === 'Corporate' && !p.sourceScheme?.includes('Corporate')) return false;
        if (schemeFilter === 'Govt' && !p.sourceScheme?.includes('Govt')) return false;
        if (schemeFilter === 'Joint' && !p.sourceScheme?.includes('Joint')) return false;
      }
      if (activeFilter === 'verified') return p.dueDiligenceStatus === 'passed';
      if (activeFilter === 'pending') return p.dueDiligenceStatus === 'review';
      if (activeFilter === 'rejected') {
        return (
          p.dueDiligenceStatus === 'failed' ||
          p.dueDiligence?.includes('Failed') ||
          p.dueDiligence?.includes('Rejected') ||
          p.dueDiligence?.includes('Disqualified') ||
          p.boardApproval?.includes('Rejected')
        );
      }
      return true;
    });
  }, [proposals, searchTerm, schemeFilter, activeFilter]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const nameA = (a.institutionName || '').trim().toLowerCase();
      const nameB = (b.institutionName || '').trim().toLowerCase();
      return sortAsc ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
    });
  }, [filtered, sortAsc]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const paginatedProposals = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sorted.slice(start, start + pageSize);
  }, [sorted, currentPage, pageSize]);

  const handleSelect = (item) => {
    if (onSelectProposal) onSelectProposal(item);
    else setSelectedProposal(item);
  };

  if (!onSelectProposal && selectedProposal) {
    return (
      <ProposalDetailModal
        isOpen={true}
        onClose={() => setSelectedProposal(null)}
        proposal={selectedProposal}
        onUpdateProposal={(updated) => {
          onUpdateProposal?.(updated);
          setSelectedProposal(updated);
        }}
        onInitiateDisbursal={onInitiateDisbursal}
      />
    );
  }

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden flex flex-col w-full">
      <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white">
        <div>
          <h3 className="text-xs sm:text-sm font-bold text-slate-900 tracking-wider uppercase">
            COMPREHENSIVE PROPOSAL APPROVAL PIPELINE
          </h3>
          <p className="text-[11px] text-slate-500 font-medium mt-0.5">
            Alphabetically sorted proposals with serial number tracking &amp; pagination
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setSortAsc(!sortAsc)}
            className="px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-md text-xs font-semibold text-slate-900 flex items-center space-x-1 cursor-pointer transition-colors"
            title="Sort Alphabetically"
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-900" />
            <span>{sortAsc ? 'A ➔ Z' : 'Z ➔ A'}</span>
          </button>

          <select
            value={schemeFilter}
            onChange={(e) => { setSchemeFilter(e.target.value); setCurrentPage(1); }}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-xs font-semibold text-slate-900 outline-none cursor-pointer"
          >
            <option value="All">All Funding Schemes</option>
            <option value="Corporate">Corporate CSR (Sec 135)</option>
            <option value="Govt">Government Grants (State R&amp;D)</option>
            <option value="Joint">Joint Co-Funding (PPP)</option>
          </select>

          <div className="relative min-w-[220px]">
            <Search className="w-3.5 h-3.5 text-slate-900 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search proposal ID, HEI, title..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-xs outline-none focus:bg-white focus:ring-1 focus:ring-slate-900 shadow-xs"
            />
          </div>
        </div>
      </div>

      <div className="w-full overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <th className="py-3 px-2.5 w-12 text-center">S.No.</th>
              <th className="py-3 px-3 w-24">ID &amp; Code</th>
              <th className="py-3 px-3">Institution / Project Title</th>
              <th className="py-3 px-3">Source &amp; Scheme</th>
              <th className="py-3 px-3">Due Diligence Status</th>
              <th className="py-3 px-3">Board Approval</th>
              <th className="py-3 px-3">MoU Execution</th>
              <th className="py-3 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {paginatedProposals.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-slate-400">
                  <FileText className="w-6 h-6 mx-auto mb-2 text-slate-900" />
                  <span>No proposal entries found matching criteria.</span>
                </td>
              </tr>
            ) : (
              paginatedProposals.map((item, idx) => (
                <CSRProposalTableRow
                  key={item.id}
                  item={item}
                  serialNumber={(currentPage - 1) * pageSize + idx + 1}
                  onSelectProposal={handleSelect}
                  onDeleteProposal={onDeleteProposal}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      <CSRProposalPagination
        sortedLength={sorted.length}
        currentPage={currentPage}
        pageSize={pageSize}
        setPageSize={setPageSize}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
      />
    </div>
  );
};

export default CSRProposalPipelineTable;
