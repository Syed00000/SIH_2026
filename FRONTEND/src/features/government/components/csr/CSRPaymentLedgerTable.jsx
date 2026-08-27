import React, { useState } from 'react';
import {
  Search,
  CheckCircle2,
  Clock,
  Activity,
  ArrowRight,
  Plus,
  Eye,
  CreditCard,
  ShieldCheck,
  Zap,
  ArrowUpRight
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

  const filtered = ledger.filter((row) => {
    // 1. Search filter
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const match =
        row.id.toLowerCase().includes(q) ||
        row.payer.toLowerCase().includes(q) ||
        row.payee.toLowerCase().includes(q) ||
        row.utrNumber.toLowerCase().includes(q) ||
        row.mode.toLowerCase().includes(q);
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

  return (
    <>
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden flex flex-col">
        {/* Table Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white">
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 tracking-wider uppercase">
              PAYMENT TRANSFER LEDGER (UTR TRACKING & MAKER-CHECKER)
            </h3>
            <p className="text-[11px] text-slate-500 font-medium mt-0.5">
              Real-time Host-to-Host banking telemetry with automated TDS withholding
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/70">
              <Activity className="w-3 h-3 text-emerald-500 animate-pulse" />
              <span>Gateway Status: Online (24x7 RTGS/NEFT API)</span>
            </span>

            {/* Mode Filter */}
            <select
              value={modeFilter}
              onChange={(e) => setModeFilter(e.target.value)}
              className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-none cursor-pointer"
            >
              <option value="All">All Modes</option>
              <option value="RTGS">RTGS API</option>
              <option value="NEFT">NEFT Batch</option>
              <option value="Direct PFMS">Direct PFMS</option>
            </select>

            {/* Search Input */}
            <div className="relative min-w-[170px]">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search UTR / Entity..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-1 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:ring-1 focus:ring-blue-600 shadow-2xs"
              />
            </div>

            {/* Initiate Button */}
            <button
              onClick={() => setIsInitiateModalOpen(true)}
              className="inline-flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold px-3.5 py-1 rounded-xl text-xs shadow-xs transition-colors cursor-pointer shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Initiate Disbursal</span>
            </button>
          </div>
        </div>

        {/* Status filter banner if active */}
        {statusFilter && (
          <div className="px-5 py-2 bg-amber-50 border-b border-amber-200 flex items-center justify-between text-xs text-amber-900 font-semibold">
            <span>Showing records pending Maker-Checker Dual-Key signature</span>
            <button
              onClick={onClearStatusFilter}
              className="text-amber-800 underline font-bold hover:text-amber-950 cursor-pointer text-[11px]"
            >
              Show All Payments
            </button>
          </div>
        )}

        {/* Table Viewport */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-5">Payment ID</th>
                <th className="py-3.5 px-4">Payer — Payee Entity</th>
                <th className="py-3.5 px-4">Disbursed Amount</th>
                <th className="py-3.5 px-4">Mode</th>
                <th className="py-3.5 px-4">UTR Reference No.</th>
                <th className="py-3.5 px-4">Maker-Checker Sign</th>
                <th className="py-3.5 px-4">Bank Ack. Status</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-slate-400">
                    No payment ledger transactions found.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => setSelectedPayment(item)}
                    className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                  >
                    <td className="py-3.5 px-5 font-mono text-[11px] font-bold text-blue-600 whitespace-nowrap">
                      <span className="group-hover:underline flex items-center space-x-1">
                        <span>{item.id}</span>
                        <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800 whitespace-nowrap">
                      <div className="flex items-center space-x-1.5">
                        <span className="text-slate-600">{item.payer}</span>
                        <ArrowRight className="w-3 h-3 text-slate-400 inline shrink-0" />
                        <span className="font-bold text-slate-900">{item.payee}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                      {item.disbursedAmount}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                        {item.mode}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-blue-600 font-semibold whitespace-nowrap">
                      {item.utrNumber}
                    </td>
                    <td className="py-3.5 px-4 text-[11px] whitespace-nowrap">
                      {item.makerCheckerStatus === 'approved' ? (
                        <span className="text-emerald-700 font-semibold">{item.makerCheckerSign}</span>
                      ) : (
                        <span className="text-amber-700 font-semibold">{item.makerCheckerSign}</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {item.bankStatus === 'ack' ? (
                        <span className="inline-flex items-center space-x-1.5 text-emerald-700 font-semibold text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 fill-emerald-50" />
                          <span>{item.bankAckStatus}</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center space-x-1.5 text-amber-700 font-semibold text-[11px]">
                          <Clock className="w-3.5 h-3.5 text-amber-500" />
                          <span>{item.bankAckStatus}</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-5 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end space-x-1.5">
                        {item.makerCheckerStatus === 'pending' && (
                          <button
                            onClick={() => {
                              onAuthorizePayment?.(item.id);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10.5px] cursor-pointer shadow-2xs flex items-center space-x-1"
                            title="Dual-Key Authorize & Sign"
                          >
                            <ShieldCheck className="w-3 h-3" />
                            <span>Sign</span>
                          </button>
                        )}
                        <button
                          onClick={() => setSelectedPayment(item)}
                          className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 hover:text-slate-900 cursor-pointer"
                          title="View Payment Advice & Telemetry"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
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
        onDisbursalCreated={onAddNewDisbursal}
      />
    </>
  );
};

export default CSRPaymentLedgerTable;
