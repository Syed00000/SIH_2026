import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { IndianRupee, Landmark, Wallet, Receipt } from 'lucide-react';

const FundStat = ({ icon: Icon, label, value, sub }) => (
  <div className="flex items-center space-x-4 p-5 rounded-lg border border-zinc-200 bg-white hover:shadow-sm transition-shadow">
    <div className="w-12 h-12 flex items-center justify-center rounded-md bg-zinc-50 border border-zinc-200 text-zinc-900">
      <Icon className="w-6 h-6" />
    </div>
    <div>
      <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">{label}</div>
      <div className="flex items-baseline space-x-2 mt-1">
        <span className="text-2xl font-bold tracking-tight text-zinc-950">{value}</span>
        {sub && <span className="text-xs font-semibold text-zinc-400">({sub})</span>}
      </div>
    </div>
  </div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-zinc-200 p-3 rounded-lg shadow-md">
        <div className="flex items-center space-x-2 text-sm">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: payload[0].payload.color }} />
          <span className="font-medium text-zinc-700">{payload[0].name}:</span>
          <span className="font-bold text-zinc-950">₹{payload[0].value}L</span>
        </div>
      </div>
    );
  }
  return null;
};

export const FundUtilizationSection = ({
  totalFundingL = 0, utilizedL = 0, availableL = 0, thisMonthL = 0,
  expenseByCategory = [], fundDonut = []
}) => {
  const utilPct = totalFundingL > 0 ? ((utilizedL / totalFundingL) * 100).toFixed(1) : 0;
  const availPct = totalFundingL > 0 ? ((availableL / totalFundingL) * 100).toFixed(1) : 0;
  const monthPct = totalFundingL > 0 ? ((thisMonthL / totalFundingL) * 100).toFixed(1) : 0;

  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow-sm bg-white overflow-hidden w-full">
      <div className="flex flex-col space-y-1.5 p-6 border-b border-zinc-100">
        <h3 className="text-lg font-semibold leading-none tracking-tight text-zinc-950">Fund Utilization</h3>
        <p className="text-sm text-muted-foreground text-zinc-500">CSR financial breakdown and expense categorization.</p>
      </div>

      <div className="p-6 flex flex-col gap-8">
        {/* KPI Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <FundStat icon={Landmark} label="Total (CSR)" value={`₹${totalFundingL}L`} />
          <FundStat icon={IndianRupee} label="Utilized" value={`₹${utilizedL}L`} sub={`${utilPct}%`} />
          <FundStat icon={Wallet} label="Available" value={`₹${availableL}L`} sub={`${availPct}%`} />
          <FundStat icon={Receipt} label="Monthly Burn" value={`₹${thisMonthL}L`} sub={`${monthPct}%`} />
        </div>

        <div className="w-full h-[1px] bg-zinc-100" />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 flex-1">
          {/* Donut Chart */}
          <div className="col-span-1 md:col-span-5 flex flex-col">
             <p className="text-sm font-semibold text-zinc-900 mb-6">Utilization Overview</p>
             <div className="flex items-center flex-1">
               <div className="relative w-48 h-48 shrink-0">
                 <ResponsiveContainer width="100%" height="100%">
                   <PieChart>
                     <Pie data={fundDonut} cx="50%" cy="50%" innerRadius={60} outerRadius={85} dataKey="value" stroke="none" paddingAngle={2}>
                       {fundDonut.map((d, i) => <Cell key={i} fill={d.color} />)}
                     </Pie>
                     <Tooltip content={<CustomTooltip />} cursor={{fill: 'transparent'}} />
                   </PieChart>
                 </ResponsiveContainer>
                 <div className="absolute inset-0 flex items-center justify-center pointer-events-none mt-1">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-zinc-950 tracking-tight">{utilPct}%</div>
                      <div className="text-xs font-medium text-zinc-500 mt-1">Utilized</div>
                    </div>
                 </div>
               </div>
               <div className="ml-8 flex-1 space-y-4">
                 {fundDonut.map((d) => (
                   <div key={d.name} className="flex justify-between items-center text-sm">
                     <div className="flex items-center space-x-3">
                       <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: d.color }} />
                       <span className="font-medium text-zinc-700">{d.name}</span>
                     </div>
                     <div className="text-right">
                       <div className="font-bold text-zinc-950">₹{d.value}L</div>
                       <div className="text-xs font-semibold text-zinc-400">({((d.value/(totalFundingL||1))*100).toFixed(1)}%)</div>
                     </div>
                   </div>
                 ))}
               </div>
             </div>
          </div>

          <div className="hidden md:block col-span-1 w-[1px] bg-zinc-100 mx-auto h-full" />

          {/* Category Progress Bars */}
          <div className="col-span-1 md:col-span-6 flex flex-col">
            <p className="text-sm font-semibold text-zinc-900 mb-6">Expense Categories</p>
            <div className="space-y-5 flex-1 flex flex-col justify-center">
              {expenseByCategory.map((c) => {
                const maxVal = expenseByCategory[0]?.value || 1;
                const widthPct = Math.max(5, (c.value / maxVal) * 100);
                const sharePct = ((c.value / (utilizedL||1)) * 100).toFixed(1);
                return (
                  <div key={c.name} className="flex items-center space-x-4 text-sm group">
                    <div className="w-36 shrink-0 font-medium text-zinc-700 truncate">{c.name}</div>
                    <div className="flex-1 flex items-center space-x-4">
                      <div className="flex-1 h-3 bg-zinc-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-300 group-hover:opacity-80" style={{ width: `${widthPct}%`, backgroundColor: c.color }} />
                      </div>
                      <div className="w-24 text-right">
                        <span className="font-bold text-zinc-950 mr-2">₹{c.value}L</span>
                        <span className="text-xs font-semibold text-zinc-400">({sharePct}%)</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FundUtilizationSection;
