import React, { useState, useEffect } from 'react';
import { CheckCircle2, Clock, Share2, CreditCard, FileText, Coins, Edit2, Check, Info } from 'lucide-react';
import { projectCsrSyncService } from '../../services/projectCsrSyncService.js';

export const CSRFundUtilization = () => {
  const [ledger, setLedger] = useState(() => projectCsrSyncService.getCsrLedger() || []);
  const [selectedTxId, setSelectedTxId] = useState(null);
  const [milestones, setMilestones] = useState([]);

  useEffect(() => {
    const unsubscribe = projectCsrSyncService.subscribe((eventType, data) => {
      if (data?.updatedCsrLedger) {
        setLedger(data.updatedCsrLedger);
      }
    });
    return unsubscribe;
  }, []);

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs space-y-6 select-none">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs sm:text-sm font-bold text-slate-900 tracking-wider uppercase">
            FUND UTILIZATION & MILESTONE LINKAGE
          </h3>
          <span className="text-[10.5px] font-bold text-slate-400">Escrow Transaction Audit</span>
        </div>

        {ledger.length === 0 ? (
          <div className="py-10 border border-slate-100 rounded-xl text-center text-slate-400 text-xs flex flex-col items-center justify-center">
            <Info className="w-5 h-5 text-slate-300 mb-1.5" />
            <span className="font-bold text-slate-700">No grant disbursals recorded yet</span>
            <span className="text-[11px] text-slate-400 mt-0.5">Approved payments and tranche milestones will appear in this ledger.</span>
          </div>
        ) : (
          <div className="overflow-x-auto border border-slate-100 rounded-xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-2.5 px-3">Payment ID</th>
                  <th className="py-2.5 px-3">Project / Ref Tracking</th>
                  <th className="py-2.5 px-3">Amount (₹)</th>
                  <th className="py-2.5 px-2">Payment Mode</th>
                  <th className="py-2.5 px-3">UTR / Ref No</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Bank Ack</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {ledger.map((row) => {
                  const isSelected = row.id === selectedTxId;
                  return (
                    <tr
                      key={row.id}
                      onClick={() => setSelectedTxId(row.id)}
                      className={`transition-colors cursor-pointer ${isSelected ? 'bg-blue-50/70 font-semibold' : 'hover:bg-slate-50/70'}`}
                    >
                      <td className="py-3 px-3 font-mono font-bold text-slate-900">{row.id}</td>
                      <td className="py-3 px-3 text-slate-700 max-w-[200px] truncate">{row.project || row.tracking}</td>
                      <td className="py-3 px-3 font-mono font-bold text-slate-900">{row.amount}</td>
                      <td className="py-3 px-2 text-slate-600">{row.mode}</td>
                      <td className="py-3 px-3 font-mono text-[11px] text-slate-500">{row.utr || row.utrNumber}</td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {row.makerCheckerStatus || 'Approved'}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-semibold text-emerald-700">{row.bankAck || 'Acknowledged'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CSRFundUtilization;
