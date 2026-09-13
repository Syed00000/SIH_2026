import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Landmark } from 'lucide-react';

const PALETTE = ['#007A61', '#334155', '#475569', '#64748b', '#0f766e'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 text-white text-xs px-3 py-2 rounded-xs shadow-lg border border-slate-700">
        <div className="font-bold text-slate-200">{label || payload[0].name}</div>
        <div className="text-emerald-400 font-mono font-bold mt-0.5">
          ₹ {Number(payload[0].value).toLocaleString('en-IN')}
        </div>
      </div>
    );
  }
  return null;
};

export const CSRGrantsAnalyticsChart = ({ grantsData, financials }) => {
  const barData = useMemo(() => {
    const inflow = Number(grantsData?.totalCommittedInflows) || 0;
    const allocated = Number(grantsData?.totalAllocatedToDepts) || 0;
    const available = Number(grantsData?.stateGrantsTotal) || 0;
    const corporateCr = Number(financials?.totalCsrFundsCr) || 0;
    const corporate = corporateCr * 10000000;

    return [
      { name: 'Total Inflow', amount: inflow, fill: '#334155' },
      { name: 'Dept Allocated', amount: allocated, fill: '#007A61' },
      { name: 'Available Pool', amount: available, fill: '#0f766e' },
      { name: 'Corporate CSR', amount: corporate, fill: '#64748b' }
    ];
  }, [grantsData, financials]);

  const tierData = useMemo(() => {
    const entries = grantsData?.fundEntries || [];
    const grouped = {};
    entries.forEach((e) => {
      const cat = e.departmentCategory || 'State Ministry';
      const amt = Number(e.amount) || 0;
      if (amt > 0) grouped[cat] = (grouped[cat] || 0) + amt;
    });
    return Object.entries(grouped).map(([name, value], i) => ({
      name,
      value,
      color: PALETTE[i % PALETTE.length]
    }));
  }, [grantsData]);

  const totalAllocated = Number(grantsData?.totalAllocatedToDepts) || 0;
  const availableBal = Number(grantsData?.stateGrantsTotal) || 0;

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 md:p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 bg-[#007A61]/10 text-[#007A61] rounded-lg">
            <Landmark className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">CSR & State Grants Treasury Analytics</h3>
            <p className="text-[11px] text-slate-500">Live database budgetary allocations, corporate CSR pool, and tier disbursements.</p>
          </div>
        </div>
        <div className="flex items-center space-x-2 text-xs font-mono">
          <span className="text-slate-500 font-medium">Available Treasury:</span>
          <span className="font-bold text-[#007A61] bg-[#007A61]/10 px-2 py-0.5 rounded">₹ {availableBal.toLocaleString('en-IN')}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-4 items-center">
        {/* Bar Chart: Budgetary Liquidity */}
        <div className="lg:col-span-7">
          <span className="text-[11px] font-bold uppercase text-slate-500 tracking-wider block mb-2">Fund Allocation & Reserves</span>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} tickFormatter={(v) => `₹${v >= 10000000 ? `${(v/10000000).toFixed(1)}Cr` : v >= 1000 ? `${(v/1000).toFixed(0)}k` : v}`} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                  {barData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Donut Chart: Tier Wise Distribution */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center pt-2 sm:pt-0">
          <span className="text-[11px] font-bold uppercase text-slate-500 tracking-wider block mb-2 w-full text-left">Department Tier Share</span>
          {tierData.length > 0 ? (
            <>
              <div className="relative w-44 h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={tierData} cx="50%" cy="50%" innerRadius={50} outerRadius={70} dataKey="value" stroke="#ffffff" strokeWidth={2}>
                      {tierData.map((entry, idx) => (
                        <Cell key={`tier-${idx}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Total Sanctioned</span>
                  <span className="text-xs font-mono font-bold text-slate-900">₹ {totalAllocated.toLocaleString('en-IN')}</span>
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-2 mt-3 w-full">
                {tierData.map((t, idx) => (
                  <div key={idx} className="flex items-center space-x-1.5 text-[10px] font-medium text-slate-600">
                    <span className="w-2 h-2 rounded-xs" style={{ backgroundColor: t.color }} />
                    <span>{t.name} (₹ {t.value.toLocaleString('en-IN')})</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="h-44 w-full flex items-center justify-center bg-slate-50 border border-dashed border-slate-200 rounded-lg text-xs text-slate-400 font-medium">
              No department allocations recorded yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CSRGrantsAnalyticsChart;
