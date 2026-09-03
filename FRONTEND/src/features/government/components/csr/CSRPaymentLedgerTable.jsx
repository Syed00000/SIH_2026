import React, { useState, useMemo } from 'react';
import {
  Search,
  CheckCircle2,
  Clock,
  Activity,
  ArrowRight,
  Plus,
  Eye,
  ShieldCheck,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  PenTool
} from 'lucide-react';
import { PaymentDetailModal } from './PaymentDetailModal.jsx';
import { InitiateDisbursalModal } from './InitiateDisbursalModal.jsx';

export const CSRPaymentLedgerTable = ({
  ledger = [],
  proposals = [],
  onAddNewDisbursal,
  onAuthorizePayment,
  statusFilter = null,
  onClearStatusFilter
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [modeFilter, setModeFilter] = useState('All');
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isInitiateModalOpen, setIsInitiateModalOpen] = useState(false);

  // Return live ledger directly, strictly filtering out any legacy mock entries
  const activeLedgerData = useMemo(() => {
    return (ledger || []).filter(
      (row) =>
        !row.payee?.includes('NIT Jamshedpur (IOT') &&
        !row.payee?.includes('Sido Kanhu Murmu') &&
        !row.payee?.includes('Vinoba Bhave Univ') &&
        !row.payer?.includes('Tata Steel CSR')
    );
  }, [ledger]);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);

  const filtered = useMemo(() => {
    return activeLedgerData.filter((row) => {
      const rawAmt = Number(row.rawAmount) || Number(String(row.amount || row.disbursedAmount || '0').replace(/[^\d]/g, ''));
      if (rawAmt <= 0) return false;

      // 1. Search filter
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const match =
          row.id?.toLowerCase().includes(q) ||
          row.payer?.toLowerCase().includes(q) ||
          row.payee?.toLowerCase().includes(q) ||
          row.utrNumber?.toLowerCase().includes(q) ||
          row.mode?.toLowerCase().includes(q);
        if (!match) return false;
      }

      // 2. Mode filter
      if (modeFilter !== 'All' && row.mode !== modeFilter) {
        return false;
      }

      // 3. Status filter from matrix
      if (statusFilter === 'pending' && row.makerCheckerStatus !== 'pending') {
        return false;
      }

      return true;
    });
  }, [activeLedgerData, searchTerm, modeFilter, statusFilter]);

  // Paginate
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginatedLedger = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, currentPage, pageSize]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleModeChange = (e) => {
    setModeFilter(e.target.value);
    setCurrentPage(1);
  };

  const handleCreateDisbursal = (newPayment) => {
    onAddNewDisbursal?.(newPayment);
    setIsInitiateModalOpen(false);
    setCurrentPage(1);
  };

  return (
    <>
      <div className="bg-white rounded-md border border-slate-200 shadow-xs overflow-hidden flex flex-col w-full min-w-0">
        {/* Table Header: Title, Live Status, Search, Filter, and Action Button */}
        <div className="p-4 sm:p-5 border-b border-slate-100 bg-white flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 tracking-wider uppercase">
              PAYMENT TRANSFER LEDGER
            </h3>
            <p className="text-[11px] text-slate-500 font-medium mt-0.5">
              Real-time Host-to-Host banking telemetry with automated TDS withholding
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Gateway Status Pill */}
            <div className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-900">
              <span className="w-2 h-2 rounded-full bg-slate-900 animate-pulse"></span>
              <span>Gateway Status: Online</span>
            </div>

            {/* Mode Filter */}
            <select
              value={modeFilter}
              onChange={handleModeChange}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-xs font-semibold text-slate-900 outline-none cursor-pointer shadow-xs"
            >
              <option value="All">All Modes</option>
              <option value="Direct PFMS">Direct PFMS</option>
              <option value="RTGS">RTGS API</option>
              <option value="NEFT">NEFT Batch</option>
            </select>

            {/* Search Input */}
            <div className="relative min-w-[200px]">
              <Search className="w-3.5 h-3.5 text-slate-900 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search UTR / Entity..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-xs outline-none focus:bg-white focus:ring-1 focus:ring-slate-900 shadow-xs"
              />
            </div>

            {/* Initiate Disbursal Button */}
            <button
              onClick={() => setIsInitiateModalOpen(true)}
              className="inline-flex items-center space-x-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-1.5 rounded-md text-xs shadow-xs transition-colors cursor-pointer shrink-0"
            >
              <Plus className="w-3.5 h-3.5 text-white" />
              <span>Initiate Disbursal</span>
            </button>
          </div>
        </div>

        {/* Status filter banner if active */}
        {statusFilter && (
          <div className="px-4 py-2 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs text-slate-900 font-bold">
            <span>Showing records pending Maker-Checker Dual-Key signature</span>
            <button
              onClick={onClearStatusFilter}
              className="text-slate-900 underline font-bold hover:text-slate-700 cursor-pointer text-[11px]"
            >
              Show All Payments
            </button>
          </div>
        )}

        {/* Table Viewport */}
        <div className="w-full overflow-x-auto min-w-0">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60 text-[10.5px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4 w-28">PAYMENT ID</th>
                <th className="py-3.5 px-4 min-w-[220px]">PAYER ➔ PAYEE ENTITY</th>
                <th className="py-3.5 px-4 w-28">DISBURSED AMOUNT</th>
                <th className="py-3.5 px-3 w-20">MODE</th>
                <th className="py-3.5 px-4 w-32">UTR REFERENCE</th>
                <th className="py-3.5 px-4 w-36">MAKER-CHECKER</th>
                <th className="py-3.5 px-4 w-36">BANK ACK. STATUS</th>
                <th className="py-3.5 px-4 w-16 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {paginatedLedger.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    No payment ledger transactions found matching the filter.
                  </td>
                </tr>
              ) : (
                paginatedLedger.map((item) => {
                  const isPending = item.makerCheckerStatus === 'pending' || item.bankStatus === 'pending';

                  return (
                    <tr
                      key={item.id}
                      onClick={() => setSelectedPayment(item)}
                      className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                    >
                      {/* Payment ID */}
                      <td className="py-3.5 px-4 font-mono text-[11px] font-bold text-slate-900 whitespace-nowrap">
                        <span className="group-hover:underline flex items-center space-x-1">
                          <span>{item.id}</span>
                          <ArrowUpRight className="w-3.5 h-3.5 text-slate-900 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </span>
                      </td>

                      {/* Payer ➔ Payee */}
                      <td className="py-3.5 px-4 font-medium text-slate-800">
                        <div className="flex items-center space-x-1.5 truncate max-w-[280px]">
                          <span className="text-slate-600 truncate">{item.payer}</span>
                          <span className="text-slate-400 font-bold">➔</span>
                          <span className="font-bold text-slate-900 truncate">{item.payee}</span>
                        </div>
                      </td>

                      {/* Disbursed Amount */}
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                        {item.disbursedAmount || item.amount}
                      </td>

                      {/* Mode */}
                      <td className="py-3.5 px-3 whitespace-nowrap font-medium text-slate-950">
                        {item.mode}
                      </td>

                      {/* UTR */}
                      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-900 font-semibold whitespace-nowrap">
                        {item.utrNumber || item.utr}
                      </td>

                      {/* Maker-Checker */}
                      <td className="py-3.5 px-4 text-[11px] whitespace-nowrap font-medium">
                        {item.makerCheckerStatus === 'pending' ? (
                          <span className="inline-flex items-center space-x-1.5 text-slate-900 font-semibold bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                            <Clock className="w-3.5 h-3.5 text-slate-900" />
                            <span>{item.makerCheckerSign || 'Pending Dual Sign-off'}</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1.5 text-slate-900 font-semibold bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                            <CheckCircle2 className="w-3.5 h-3.5 text-slate-900" />
                            <span>{item.makerCheckerSign || 'Verified & Approved'}</span>
                          </span>
                        )}
                      </td>

                      {/* Bank Ack */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          {item.bankStatus === 'pending' ? (
                            <>
                              <span className="inline-flex items-center space-x-1.5 text-slate-900 font-semibold text-[11px] bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200 mr-1">
                                <Clock className="w-3.5 h-3.5 text-slate-900" />
                                <span>{item.bankAckStatus || 'In Transit'}</span>
                              </span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onAuthorizePayment?.(item.id);
                                }}
                                className="px-2.5 py-0.5 rounded-md bg-slate-900 hover:bg-slate-800 text-white font-bold text-[10.5px] cursor-pointer shadow-xs flex items-center space-x-1"
                                title="Dual-Key Authorize & Sign"
                              >
                                <PenTool className="w-3 h-3 text-white" />
                                <span>Sign</span>
                              </button>
                            </>
                          ) : (
                            <span className="inline-flex items-center space-x-1.5 text-slate-900 font-semibold text-[11px] bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                              <CheckCircle2 className="w-3.5 h-3.5 text-slate-900" />
                              <span>{item.bankAckStatus || 'Acknowledged'}</span>
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => setSelectedPayment(item)}
                          className="p-1.5 rounded-md border border-slate-200 hover:bg-slate-100 text-slate-500 hover:text-slate-900 cursor-pointer shadow-xs transition-colors"
                          title="View Payment Advice & Telemetry"
                        >
                          <Eye className="w-3.5 h-3.5 text-slate-900" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Clean Pagination Controls */}
        <div className="p-3 sm:p-4 border-t border-slate-100 bg-white flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
          <div className="text-slate-600 text-[11.5px] font-medium">
            Showing <strong className="text-slate-900">{filtered.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}</strong> to{' '}
            <strong className="text-slate-900">{Math.min(currentPage * pageSize, filtered.length)}</strong> of{' '}
            <strong className="text-slate-900">{filtered.length}</strong> transactions
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
                <option value={10}>10</option>
                <option value={15}>15</option>
                <option value={25}>25</option>
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

      {/* Payment Detail Modal */}
      <PaymentDetailModal
        isOpen={Boolean(selectedPayment)}
        onClose={() => setSelectedPayment(null)}
        payment={selectedPayment}
        onAuthorizePayment={(id) => {
          onAuthorizePayment?.(id);
          if (selectedPayment) {
            setSelectedPayment({
              ...selectedPayment,
              makerCheckerSign: 'Verified & Approved',
              makerCheckerStatus: 'approved',
              bankAckStatus: 'Acknowledged',
              bankStatus: 'ack'
            });
          }
        }}
      />

      {/* Initiate Disbursal Modal */}
      <InitiateDisbursalModal
        isOpen={isInitiateModalOpen}
        onClose={() => setIsInitiateModalOpen(false)}
        proposals={proposals}
        onDisbursalCreated={handleCreateDisbursal}
      />
    </>
  );
};

export default CSRPaymentLedgerTable;
