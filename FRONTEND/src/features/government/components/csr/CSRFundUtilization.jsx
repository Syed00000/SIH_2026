import React from 'react';
import { CheckCircle2, Clock, Share2, CreditCard, FileText, Coins } from 'lucide-react';
import { MOCK_UTILIZATION_TRANSACTIONS, MOCK_MILESTONES_PROGRESS } from '../../data/mockCsrLifecycleData.js';

const MILESTONE_ICONS = {
  item_1: Share2,
  item_2: CreditCard,
  item_4: FileText,
  item_5: Coins
};

export const CSRFundUtilization = () => {
  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs space-y-6">
      {/* 1. Header & Mini-Table */}
      <div className="space-y-3">
        <h3 className="text-xs sm:text-sm font-bold text-slate-900 tracking-wider uppercase">
          FUND UTILIZATION & MILESTONE LINKAGE
        </h3>

        <div className="overflow-x-auto border border-slate-100 rounded-xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-2.5 px-3">Payment ID</th>
                <th className="py-2.5 px-3">Inst / Ref Tracking</th>
                <th className="py-2.5 px-3">Amount (₹)</th>
                <th className="py-2.5 px-2">Payment Mode</th>
                <th className="py-2.5 px-3">UTR / Ref No</th>
                <th className="py-2.5 px-3">Maker-Checker Status</th>
                <th className="py-2.5 px-3">Bank Acknowledge</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {MOCK_UTILIZATION_TRANSACTIONS.map((row) => (
                <tr key={row.id + row.utr} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-2.5 px-3 font-mono text-[11px] font-bold text-blue-600">
                    {row.id}
                  </td>
                  <td className="py-2.5 px-3 font-medium text-slate-800 text-[11px]">
                    {row.tracking}
                  </td>
                  <td className="py-2.5 px-3 font-mono font-bold text-slate-900 text-[11px]">
                    {row.amount}
                  </td>
                  <td className="py-2.5 px-2 text-[10px] font-bold text-slate-600">
                    {row.mode}
                  </td>
                  <td className="py-2.5 px-3 font-mono text-[11px] text-slate-500">
                    {row.utr}
                  </td>
                  <td className="py-2.5 px-3 text-[11px]">
                    {row.makerCheckerStatus === 'approved' ? (
                      <span className="text-emerald-700 font-semibold">{row.makerChecker}</span>
                    ) : (
                      <span className="text-amber-700 font-semibold">{row.makerChecker}</span>
                    )}
                  </td>
                  <td className="py-2.5 px-3 whitespace-nowrap text-[11px]">
                    {row.bankStatus === 'ack' ? (
                      <span className="inline-flex items-center space-x-1 text-emerald-700 font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        <span>{row.bankAck}</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center space-x-1 text-amber-700 font-semibold">
                        <Clock className="w-3.5 h-3.5 text-amber-500" />
                        <span>{row.bankAck}</span>
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 2. Milestone Execution Progress Bars */}
      <div className="space-y-4 pt-2">
        {MOCK_MILESTONES_PROGRESS.map((item) => {
          const IconComp = MILESTONE_ICONS[item.id] || Share2;
          return (
            <div key={item.id} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2 font-bold text-slate-800">
                  <IconComp className="w-3.5 h-3.5 text-slate-600" />
                  <span>{item.title}</span>
                </div>
                <span className="font-bold text-slate-900">{item.percent}%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${item.color}`}
                  style={{ width: `${item.percent}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CSRFundUtilization;
