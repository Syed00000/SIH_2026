import React, { useState } from 'react';
import { CheckCircle2, Clock, Share2, CreditCard, FileText, Coins, Edit2, Check } from 'lucide-react';

const INITIAL_TRANSACTIONS = [
  { id: 'PAY-99210', tracking: 'Smart Aqua IoT Water Network (RU)', amount: '₹ 15.00 Lakhs', mode: 'PFMS Direct Node', utr: 'PFMS-TR-992104', makerCheckerStatus: 'approved', makerChecker: 'Cleared by Nodal Board', bankStatus: 'ack', bankAck: 'SBI Node Acknowledged' },
  { id: 'PAY-99211', tracking: 'AI Crop Disease Detection (BIT)', amount: '₹ 12.50 Lakhs', mode: 'RBI RTGS Bulk', utr: 'RBI-UTR-773412', makerCheckerStatus: 'approved', makerChecker: 'Cleared by Finance Dept', bankStatus: 'ack', bankAck: 'RBI Direct Credit Ack' }
];

const INITIAL_MILESTONES = [
  { id: 'item_1', title: 'Problem Mapping & Ground Triage', percent: 100, color: 'bg-emerald-500' },
  { id: 'item_2', title: 'Sensor Hardware & Lab Prototype (TRL-4)', percent: 75, color: 'bg-blue-600' },
  { id: 'item_4', title: 'NABL Quality Certification', percent: 50, color: 'bg-amber-500' },
  { id: 'item_5', title: 'Field Validation & Deployment', percent: 25, color: 'bg-slate-400' }
];

export const CSRFundUtilization = () => {
  const [selectedTxId, setSelectedTxId] = useState('PAY-99210');
  const [milestones, setMilestones] = useState(INITIAL_MILESTONES);
  const [editingItemId, setEditingItemId] = useState(null);
  const [editPercent, setEditPercent] = useState(60);

  const selectedTx = INITIAL_TRANSACTIONS.find((t) => t.id === selectedTxId) || INITIAL_TRANSACTIONS[0];

  const handleSaveMilestone = (id) => {
    setMilestones(milestones.map((m) => (m.id === id ? { ...m, percent: Number(editPercent) } : m)));
    setEditingItemId(null);
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs space-y-6 select-none">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs sm:text-sm font-bold text-slate-900 tracking-wider uppercase">
            FUND UTILIZATION & MILESTONE LINKAGE
          </h3>
          <span className="text-[10.5px] font-bold text-slate-400">Select a transaction to link milestones</span>
        </div>

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
              {INITIAL_TRANSACTIONS.map((row) => {
                const isSelected = row.id === selectedTxId;
                return (
                  <tr
                    key={row.id}
                    onClick={() => setSelectedTxId(row.id)}
                    className={`transition-colors cursor-pointer ${isSelected ? 'bg-blue-50/70 font-semibold' : 'hover:bg-slate-50/70'}`}
                  >
                    <td className="py-2.5 px-3 font-mono text-[11px] font-bold text-blue-600">{row.id}</td>
                    <td className="py-2.5 px-3 font-medium text-slate-800 text-[11px]">{row.tracking}</td>
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-900 text-[11px]">{row.amount}</td>
                    <td className="py-2.5 px-2 text-[10px] font-bold text-slate-600">{row.mode}</td>
                    <td className="py-2.5 px-3 font-mono text-[11px] text-slate-500">{row.utr}</td>
                    <td className="py-2.5 px-3 text-[11px] text-emerald-700 font-semibold">{row.makerChecker}</td>
                    <td className="py-2.5 px-3 whitespace-nowrap text-[11px]">
                      <span className="inline-flex items-center space-x-1 text-emerald-700 font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        <span>{row.bankAck}</span>
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="space-y-4 pt-2 border-t border-slate-100">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wide">
            Active Milestone Work Breakdown ({selectedTx.tracking})
          </span>
          <span className="text-[10px] font-bold text-slate-400">Click percentage to adjust live progress</span>
        </div>

        <div className="space-y-4">
          {milestones.map((item) => {
            const isEditing = editingItemId === item.id;
            return (
              <div key={item.id} className="space-y-1.5 p-2 rounded-xl hover:bg-slate-50/60 transition-colors">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2 font-bold text-slate-800">
                    <Share2 className="w-3.5 h-3.5 text-slate-600" />
                    <span>{item.title}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {isEditing ? (
                      <div className="flex items-center space-x-1.5" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={editPercent}
                          onChange={(e) => setEditPercent(e.target.value)}
                          className="w-14 px-1.5 py-0.5 bg-white border border-slate-300 rounded text-xs font-mono font-bold text-center"
                        />
                        <button
                          onClick={() => handleSaveMilestone(item.id)}
                          className="p-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded cursor-pointer"
                        >
                          <Check className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setEditingItemId(item.id);
                          setEditPercent(item.percent);
                        }}
                        className="font-bold text-slate-900 hover:text-blue-600 flex items-center space-x-1 cursor-pointer"
                      >
                        <span>{item.percent}%</span>
                        <Edit2 className="w-2.5 h-2.5 text-slate-400" />
                      </button>
                    )}
                  </div>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-500 ${item.color}`} style={{ width: `${item.percent}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CSRFundUtilization;
