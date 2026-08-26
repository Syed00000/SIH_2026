import React, { useState } from 'react';
import { Search, CheckCircle2, Clock, Activity, ArrowRight, Layers } from 'lucide-react';
import { MOCK_PAYMENT_LEDGER } from '../../data/mockCsrLifecycleData.js';

export const CSRPaymentLedgerTable = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [ledger] = useState(MOCK_PAYMENT_LEDGER);

  const filtered = ledger.filter((row) => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    return (
      row.id.toLowerCase().includes(q) ||
      row.payer.toLowerCase().includes(q) ||
      row.payee.toLowerCase().includes(q) ||
      (row.projectTitle && row.projectTitle.toLowerCase().includes(q)) ||
      row.utrNumber.toLowerCase().includes(q)
    );
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden flex flex-col">
      {/* Table Header */}
      <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white">
        <div>
          <h3 className="text-xs sm:text-sm font-bold text-slate-900 tracking-wider uppercase">
            PAYMENT TRANSFER LEDGER (UTR TRACKING & MAKER-CHECKER)
          </h3>
          <p className="text-[11px] text-slate-500 font-medium">
            Disbursement pipeline linked directly with verified Project Escrow accounts
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/70">
            <Activity className="w-3 h-3 text-emerald-500 animate-pulse" />
            <span>Gateway Status: Online (24x7 RTGS/NEFT API)</span>
          </span>

          <div className="relative min-w-[180px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by UTR, Entity, Project..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:ring-1 focus:ring-blue-600 shadow-2xs"
            />
          </div>
        </div>
      </div>

      {/* Table Viewport */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/60 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <th className="py-3.5 px-5">Payment ID</th>
              <th className="py-3.5 px-4">Payer — Payee & Project Link</th>
              <th className="py-3.5 px-4">Disbursed Amount</th>
              <th className="py-3.5 px-4">Mode</th>
              <th className="py-3.5 px-4">UTR Reference No.</th>
              <th className="py-3.5 px-4">Maker-Checker Sign</th>
              <th className="py-3.5 px-5">Bank Ack. Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-10 text-center text-slate-400">
                  No payment ledger transactions found.
                </td>
              </tr>
            ) : (
              filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-5 font-mono text-[11px] font-bold text-blue-600">
                    {item.id}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-800 flex items-center space-x-1.5 whitespace-nowrap">
                      <span>{item.payer}</span>
                      <ArrowRight className="w-3 h-3 text-slate-400 inline shrink-0" />
                      <span className="font-bold text-slate-900">{item.payee}</span>
                    </div>
                    {item.projectTitle && (
                      <div className="text-[10px] text-blue-600 font-medium flex items-center space-x-1 mt-0.5">
                        <span className="font-mono bg-blue-50 px-1 py-0.2 rounded font-bold">{item.projectId}</span>
                        <span className="truncate max-w-[220px]">{item.projectTitle}</span>
                      </div>
                    )}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                    {item.disbursedAmount}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                      {item.mode}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[11px] text-slate-600">
                    {item.utrNumber}
                  </td>
                  <td className="py-3.5 px-4 text-[11px]">
                    {item.makerCheckerStatus === 'approved' ? (
                      <span className="text-emerald-700 font-semibold">{item.makerCheckerSign}</span>
                    ) : (
                      <span className="text-amber-700 font-semibold">{item.makerCheckerSign}</span>
                    )}
                  </td>
                  <td className="py-3.5 px-5 whitespace-nowrap">
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
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CSRPaymentLedgerTable;
