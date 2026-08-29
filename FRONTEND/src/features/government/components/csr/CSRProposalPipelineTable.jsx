import React, { useState, useMemo } from 'react';
import {
  CheckCircle2,
  Clock,
  Search,
  Eye,
  ArrowUpRight,
  Trash2,
  XCircle,
  FileText,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown
} from 'lucide-react';
import { ProposalDetailModal } from './ProposalDetailModal.jsx';

export const CSRProposalPipelineTable = ({
  proposals = [],
  onUpdateProposal,
  onDeleteProposal,
  onInitiateDisbursal,
  activeFilter = null
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [schemeFilter, setSchemeFilter] = useState('All');
  const [selectedProposal, setSelectedProposal] = useState(null);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [sortAsc, setSortAsc] = useState(true);

  // 1. Filter proposals
  const filtered = useMemo(() => {
    return proposals.filter((p) => {
      // Search Query
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

      // Scheme Filter
      if (schemeFilter !== 'All') {
        if (schemeFilter === 'Corporate' && !p.sourceScheme?.includes('Corporate')) return false;
        if (schemeFilter === 'Govt' && !p.sourceScheme?.includes('Govt')) return false;
        if (schemeFilter === 'Joint' && !p.sourceScheme?.includes('Joint')) return false;
      }

      // Statutory Filter Card
      if (activeFilter === 'verified') {
        return p.dueDiligenceStatus === 'passed';
      }
      if (activeFilter === 'pending') {
        return p.dueDiligenceStatus === 'review';
      }
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

  // 2. Sort Alphabetically by Institution Name (A to Z)
  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const nameA = (a.institutionName || '').trim().toLowerCase();
      const nameB = (b.institutionName || '').trim().toLowerCase();
      return sortAsc ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
    });
  }, [filtered, sortAsc]);

  // 3. Paginate
  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const paginatedProposals = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sorted.slice(start, start + pageSize);
  }, [sorted, currentPage, pageSize]);

  // Reset to page 1 if search/filter changes
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleSchemeChange = (e) => {
    setSchemeFilter(e.target.value);
    setCurrentPage(1);
  };

  return (
    <>
      <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden flex flex-col w-full">
        {/* Table Header Controls */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white">
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 tracking-wider uppercase">
              COMPREHENSIVE PROPOSAL APPROVAL PIPELINE
            </h3>
            <p className="text-[11px] text-slate-500 font-medium mt-0.5">
              Alphabetically sorted proposals with serial number tracking & pagination
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Sort Toggle */}
            <button
              type="button"
              onClick={() => setSortAsc(!sortAsc)}
              className="px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-md text-xs font-semibold text-slate-900 flex items-center space-x-1 cursor-pointer transition-colors"
              title="Sort Alphabetically"
            >
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-900" />
              <span>{sortAsc ? 'A ➔ Z' : 'Z ➔ A'}</span>
            </button>

            {/* Scheme Filter */}
            <select
              value={schemeFilter}
              onChange={handleSchemeChange}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-xs font-semibold text-slate-900 outline-none cursor-pointer"
            >
              <option value="All">All Funding Schemes</option>
              <option value="Corporate">Corporate CSR (Sec 135)</option>
              <option value="Govt">Government Grants (State R&D)</option>
              <option value="Joint">Joint Co-Funding (PPP)</option>
            </select>

            {/* Search Input */}
            <div className="relative min-w-[220px]">
              <Search className="w-3.5 h-3.5 text-slate-900 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search proposal ID, HEI, title..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-xs outline-none focus:bg-white focus:ring-1 focus:ring-slate-900 shadow-xs"
              />
            </div>
          </div>
        </div>

        {/* Table Content - Clean responsive container */}
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-2.5 w-12 text-center">S.No.</th>
                <th className="py-3 px-3 w-24">ID & Code</th>
                <th className="py-3 px-3">Institution / Project Title</th>
                <th className="py-3 px-3">Source & Scheme</th>
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
                paginatedProposals.map((item, idx) => {
                  const serialNumber = (currentPage - 1) * pageSize + idx + 1;
                  const isFailed =
                    item.dueDiligenceStatus === 'failed' ||
                    item.dueDiligence?.includes('Failed') ||
                    item.dueDiligence?.includes('Disqualified') ||
                    item.dueDiligence?.includes('Rejected') ||
                    item.boardApproval?.includes('Rejected');

                  return (
                    <tr
                      key={item.id}
                      onClick={() => setSelectedProposal(item)}
                      className="hover:bg-slate-50/70 transition-colors cursor-pointer group"
                    >
                      {/* S.No. Column */}
                      <td className="py-3 px-2.5 text-center font-mono text-[11px] font-bold text-slate-900 whitespace-nowrap">
                        #{serialNumber}
                      </td>

                      <td className="py-3 px-3 font-mono text-[11px] font-bold text-slate-900 whitespace-nowrap">
                        <span className="group-hover:underline flex items-center space-x-1">
                          <span>{item.id}</span>
                          <ArrowUpRight className="w-3.5 h-3.5 text-slate-900 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </span>
                      </td>

                      <td className="py-3 px-3 font-bold text-slate-900">
                        <div className="line-clamp-1">{item.institutionName}</div>
                        <div className="text-[11px] text-slate-500 font-normal line-clamp-1">
                          {item.projectTitle || 'Societal Innovation & Tech Transfer'}
                        </div>
                        {item.district && (
                          <div className="text-[10px] text-slate-400 font-medium mt-0.5">{item.district} District</div>
                        )}
                      </td>

                      <td className="py-3 px-3 whitespace-nowrap">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-900 border border-slate-200">
                          {item.sourceScheme}
                        </span>
                      </td>

                      <td className="py-3 px-3 whitespace-nowrap">
                        {isFailed ? (
                          <span className="inline-flex items-center space-x-1.5 text-slate-900 font-semibold text-[11px] bg-slate-100 px-2 py-0.5 rounded border border-slate-300">
                            <XCircle className="w-3.5 h-3.5 text-slate-900" />
                            <span>{item.dueDiligence || 'Failed / Disqualified'}</span>
                          </span>
                        ) : item.dueDiligenceStatus === 'passed' ? (
                          <span className="inline-flex items-center space-x-1.5 text-slate-900 font-semibold text-[11px]">
                            <CheckCircle2 className="w-3.5 h-3.5 text-slate-900" />
                            <span>{item.dueDiligence}</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1.5 text-slate-900 font-semibold text-[11px]">
                            <Clock className="w-3.5 h-3.5 text-slate-900" />
                            <span>{item.dueDiligence}</span>
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-3 text-[11px] whitespace-nowrap">
                        <span className="font-semibold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                          {item.boardApproval}
                        </span>
                      </td>

                      <td className="py-3 px-3 text-[11px] whitespace-nowrap font-medium text-slate-900">
                        {item.mouExecution}
                      </td>

                      <td className="py-3 px-3 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end space-x-1">
                          <button
                            onClick={() => setSelectedProposal(item)}
                            className="px-2 py-1 rounded-md border border-slate-200 hover:bg-slate-100 text-slate-900 font-semibold flex items-center space-x-1 text-[11px] cursor-pointer"
                            title="View Full Proposal Dossier & Payments"
                          >
                            <Eye className="w-3 h-3 text-slate-900" />
                            <span>View Dossier</span>
                          </button>
                          {onDeleteProposal && (
                            <button
                              onClick={() => {
                                if (window.confirm(`Delete proposal ${item.id}?`)) {
                                  onDeleteProposal(item.id);
                                }
                              }}
                              className="p-1 rounded-md border border-slate-200 hover:bg-slate-100 text-slate-900 cursor-pointer"
                              title="Delete Proposal"
                            >
                              <Trash2 className="w-3 h-3 text-slate-900" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Clean Shadcn Pagination Controls */}
        <div className="p-3 sm:p-4 border-t border-slate-100 bg-white flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
          <div className="text-slate-600 text-[11.5px] font-medium">
            Showing <strong className="text-slate-900">{sorted.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}</strong> to{' '}
            <strong className="text-slate-900">{Math.min(currentPage * pageSize, sorted.length)}</strong> of{' '}
            <strong className="text-slate-900">{sorted.length}</strong> proposals
          </div>

          <div className="flex items-center space-x-3">
            {/* Rows Per Page */}
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

            {/* Page Buttons */}
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
      </div>

      {/* Detail Dossier & Payment Modal */}
      <ProposalDetailModal
        isOpen={Boolean(selectedProposal)}
        onClose={() => setSelectedProposal(null)}
        proposal={selectedProposal}
        onUpdateProposal={(updated) => {
          onUpdateProposal?.(updated);
          setSelectedProposal(updated);
        }}
        onInitiateDisbursal={onInitiateDisbursal}
      />
    </>
  );
};

export default CSRProposalPipelineTable;
