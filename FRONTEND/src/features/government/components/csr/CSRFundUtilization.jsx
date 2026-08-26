import React, { useState } from 'react';
import { CheckCircle2, Clock, Share2, CreditCard, FileText, Coins, Layers } from 'lucide-react';
import { MOCK_UTILIZATION_TRANSACTIONS, MOCK_PROJECT_MILESTONES_MAP } from '../../data/mockCsrLifecycleData.js';

const MILESTONE_ICONS = {
  item_1: Share2,
  item_2: CreditCard,
  item_4: FileText,
  item_5: Coins
};

const AVAILABLE_PROJECTS = [
  { id: 'PRJ-101', name: 'PRJ-101: Smart Dam IoT Telemetry (BIT Mesra)' },
  { id: 'PRJ-102', name: 'PRJ-102: Mine Gas Early Warning (NIT Jamshedpur)' },
  { id: 'PRJ-104', name: 'PRJ-104: Solar Cold Storage (Ranchi University)' }
];

export const CSRFundUtilization = () => {
  const [selectedProjectId, setSelectedProjectId] = useState('PRJ-101');
  const milestones = MOCK_PROJECT_MILESTONES_MAP[selectedProjectId] || MOCK_PROJECT_MILESTONES_MAP['PRJ-101'];
  const filteredTransactions = MOCK_UTILIZATION_TRANSACTIONS.filter(t => !t.projectId || t.projectId === selectedProjectId);

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs space-y-6">
      {/* 1. Header & Project Linkage Selector */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 tracking-wider uppercase">
              FUND UTILIZATION & MILESTONE LINKAGE
            </h3>
            <p className="text-[11px] text-slate-500 font-medium">
              Real-time payment tracking synchronized with project milestone deliverables
            </p>
          </div>

          <div className="flex items-center space-x-1.5 shrink-0">
            <Layers className="w-3.5 h-3.5 text-blue-600" />
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="px-2.5 py-1 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl outline-none text-slate-800 shadow-2xs"
            >
              {AVAILABLE_PROJECTS.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Mini Table */}
        <div className="overflow-x-auto border border-slate-100 rounded-xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-2.5 px-3">Payment ID</th>
                <th className="py-2.5 px-3">Linked Project & Payee</th>
                <th className="py-2.5 px-3">Amount (₹)</th>
                <th className="py-2.5 px-2">Mode</th>
                <th className="py-2.5 px-3">UTR / Ref No</th>
                <th className="py-2.5 px-3">Maker-Checker</th>
                <th className="py-2.5 px-3">Bank Acknowledge</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredTransactions.map((row) => (
                <tr key={row.id + row.utr} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-2.5 px-3 font-mono text-[11px] font-bold text-blue-600">
                    {row.id}
                  </td>
                  <td className="py-2.5 px-3 font-medium text-slate-800 text-[11px]">
                    <div>{row.tracking}</div>
                    {row.projectTitle && <span className="text-[10px] text-blue-600 font-mono font-semibold">{row.projectId} · {row.projectTitle}</span>}
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
                    <span className={`font-semibold ${row.makerCheckerStatus === 'approved' ? 'text-emerald-700' : 'text-amber-700'}`}>
                      {row.makerChecker}
                    </span>
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
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Active Milestone Stage Gates</span>
          <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">{selectedProjectId} Live Progress</span>
        </div>
        {milestones.map((item) => {
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
