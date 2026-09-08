import React from 'react';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';
import { Landmark, IndianRupee, Wallet, Receipt, ShieldCheck, CheckCircle2 } from 'lucide-react';

const FundStat = ({ icon: Icon, label, value, sub }) => (
  <div className="flex items-center space-x-3.5 p-4 rounded-none border border-slate-200 bg-white hover:border-slate-300 transition-colors">
    <div className="w-10 h-10 flex items-center justify-center rounded-none bg-slate-100 border border-slate-200 text-slate-800 shrink-0">
      <Icon className="w-5 h-5" />
    </div>
    <div className="min-w-0 flex-1">
      <div className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider truncate">{label}</div>
      <div className="flex items-baseline space-x-1.5 mt-0.5">
        <span className="text-lg font-black tracking-tight text-slate-900 font-mono">{value}</span>
        {sub && <span className="text-[10px] font-semibold text-slate-500 truncate">({sub})</span>}
      </div>
    </div>
  </div>
);

const CustomDonutTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const d = payload[0].payload;
    return (
      <div className="bg-slate-900 text-white border border-slate-700 px-3 py-2 rounded-none shadow-none text-xs">
        <div className="font-bold">{d.name}</div>
        <div className="text-slate-300 font-mono mt-0.5">
          ₹ {Number(d.value).toLocaleString('en-IN')} {d.sharePct ? `(${d.sharePct}%)` : ''}
        </div>
      </div>
    );
  }
  return null;
};

const CustomBarTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const d = payload[0].payload;
    return (
      <div className="bg-slate-900 text-white border border-slate-700 px-3 py-2 rounded-none shadow-none text-xs">
        <div className="font-bold">{d.name}</div>
        <div className="text-slate-300 font-mono mt-0.5">₹ {Number(d.amount).toLocaleString('en-IN')}</div>
      </div>
    );
  }
  return null;
};

export const FundUtilizationSection = ({
  totalSanctionedGrant = 80000,
  totalDisbursed = 40000,
  netUniversityFunds = 15000,
  pendingGrantEscrow = 40000,
  totalLabFees = 25000,
  expenseByCategory = [],
  fundDonut = [],
  cashFlowBarData = [],
  ledgerTransactions = []
}) => {
  const disbursalPct = totalSanctionedGrant > 0 ? Math.round((totalDisbursed / totalSanctionedGrant) * 100) : 0;
  const escrowPendingPct = totalSanctionedGrant > 0 ? Math.round((pendingGrantEscrow / totalSanctionedGrant) * 100) : 0;

  // Fallback cash flow data if not passed directly
  const chartData = cashFlowBarData.length > 0 ? cashFlowBarData : [
    { name: 'Sanctioned DPR', amount: totalSanctionedGrant, fill: '#09090b' },
    { name: 'Disbursed (PFMS)', amount: totalDisbursed, fill: '#27272a' },
    { name: 'Partner Lab Fee', amount: totalLabFees, fill: '#71717a' },
    { name: 'Net HEI Escrow', amount: netUniversityFunds, fill: '#52525b' },
    { name: 'Pending Escrow', amount: pendingGrantEscrow, fill: '#a1a1aa' }
  ];

  return (
    <div className="rounded-none border border-slate-200 bg-white overflow-hidden w-full shadow-none">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 border-b border-slate-100 gap-2">
        <div>
          <h3 className="text-base font-bold text-slate-900 uppercase tracking-wide">
            Government Grant Sanction & PFMS Escrow Cash Flow
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            Direct state disbursal analytics, research expenditure categories & university escrow tracking.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="px-2.5 py-1 bg-slate-100 border border-slate-200 text-slate-700 text-[11px] font-bold rounded-none flex items-center space-x-1">
            <ShieldCheck className="w-3.5 h-3.5 text-slate-700" />
            <span>PFMS Verified</span>
          </span>
        </div>
      </div>

      <div className="p-5 flex flex-col gap-6">
        {/* KPI Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <FundStat
            icon={Landmark}
            label="Sanctioned DPR"
            value={`₹ ${totalSanctionedGrant.toLocaleString('en-IN')}`}
            sub="Official State Sanction"
          />
          <FundStat
            icon={IndianRupee}
            label="PFMS Disbursed"
            value={`₹ ${totalDisbursed.toLocaleString('en-IN')}`}
            sub={`${disbursalPct}% Released`}
          />
          <FundStat
            icon={Wallet}
            label="Net HEI Escrow"
            value={`₹ ${netUniversityFunds.toLocaleString('en-IN')}`}
            sub={totalLabFees > 0 ? `After ₹ ${totalLabFees.toLocaleString('en-IN')} Lab Fee` : 'Full Credit'}
          />
          <FundStat
            icon={Receipt}
            label="Pending Escrow"
            value={`₹ ${pendingGrantEscrow.toLocaleString('en-IN')}`}
            sub={pendingGrantEscrow > 0 ? `${escrowPendingPct}% for Phase 2` : 'Fully Settled'}
          />
        </div>

        {/* Charts Section: Cash Flow Bar Chart & DPR Category Donut */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Cash Flow Bar Chart (Left 7 Cols) */}
          <div className="col-span-1 lg:col-span-7 bg-slate-50/60 border border-slate-200 rounded-none p-4 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs font-bold text-slate-900 uppercase tracking-wider">Grant Cash Flow & Escrow Disbursal</p>
                <p className="text-[11px] text-slate-500 font-medium">Comparison of Sanctioned vs Released vs Remaining Escrow</p>
              </div>
              <span className="text-[11px] font-mono font-bold text-slate-600 bg-white border border-slate-200 px-2 py-0.5 rounded">
                INR (₹)
              </span>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 25 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 10, fill: '#64748b', fontWeight: 600 }}
                    angle={-15}
                    textAnchor="end"
                    interval={0}
                  />
                  <YAxis
                    tick={{ fontSize: 10, fill: '#64748b' }}
                    tickFormatter={(v) => `₹${v >= 1000 ? `${v / 1000}k` : v}`}
                  />
                  <Tooltip content={<CustomBarTooltip />} />
                  <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`bar-${index}`} fill={entry.fill || '#1e293b'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* DPR Allocation Donut & Legend (Right 5 Cols) */}
          <div className="col-span-1 lg:col-span-5 bg-slate-50/60 border border-slate-200 rounded-none p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-bold text-slate-900 uppercase tracking-wider">DPR Budget Breakdown</p>
                <span className="text-[10px] font-mono font-bold text-slate-600">
                  {expenseByCategory.length} Categories
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium mb-3">Allocations vetted by University Research Board</p>

              {expenseByCategory.length > 0 ? (
                <div className="space-y-2.5">
                  {expenseByCategory.map((c) => (
                    <div key={c.name} className="p-2 bg-white rounded-none border border-slate-200 text-xs">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-slate-800 truncate pr-2 text-[11.5px]">{c.name}</span>
                        <span className="font-black text-slate-900 font-mono shrink-0">{c.formattedAmount}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 h-1.5 bg-slate-100 rounded-none overflow-hidden">
                          <div
                            className="h-full bg-slate-800 rounded-none"
                            style={{ width: `${Math.max(8, c.sharePct)}%` }}
                          />
                        </div>
                        <span className="text-[10px] font-bold text-slate-500 font-mono w-10 text-right">{c.sharePct}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-48 text-xs text-slate-400">
                  No breakdown recorded
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Live PFMS Disbursal Ledger Audit Table */}
        {ledgerTransactions.length > 0 && (
          <div className="border border-slate-200 rounded-none overflow-hidden bg-white">
            <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-slate-700" />
                <span className="text-xs font-black text-slate-900 uppercase tracking-wide">
                  PFMS Escrow Transaction Ledger
                </span>
              </div>
              <span className="text-[10px] font-bold text-slate-500">
                {ledgerTransactions.length} Settled Record(s)
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/50 text-[10px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">
                  <tr>
                    <th className="px-4 py-2.5">TX / Payment ID</th>
                    <th className="px-4 py-2.5">PFMS UTR Number</th>
                    <th className="px-4 py-2.5">Project Reference</th>
                    <th className="px-4 py-2.5">Amount Disbursed</th>
                    <th className="px-4 py-2.5">Treasury Verification</th>
                    <th className="px-4 py-2.5">Bank Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {ledgerTransactions.map((tx, idx) => (
                    <tr key={tx.id || tx.paymentId || idx} className="hover:bg-slate-50/70">
                      <td className="px-4 py-2.5 font-mono font-bold text-slate-900">{tx.paymentId || tx.id || 'N/A'}</td>
                      <td className="px-4 py-2.5 font-mono text-slate-600">{tx.utrNumber || tx.utr || 'N/A'}</td>
                      <td className="px-4 py-2.5 font-medium text-slate-800">{tx.project || tx.projectRef || 'State R&D'}</td>
                      <td className="px-4 py-2.5 font-mono font-bold text-slate-900">{tx.amount || `₹ ${tx.rawAmount}`}</td>
                      <td className="px-4 py-2.5">
                        <span className="px-2 py-0.5 bg-slate-100 border border-slate-200 text-slate-700 text-[10px] font-bold rounded-none">
                          {tx.makerCheckerStatus || 'Approved'}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-slate-600 font-medium">
                        {tx.bankAckStatus || tx.bankAck || 'Credited to University Escrow'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FundUtilizationSection;
