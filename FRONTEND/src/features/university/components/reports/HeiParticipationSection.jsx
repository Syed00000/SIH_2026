import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const Stat = ({ label, value }) => (
  <div className="p-5 rounded-lg border border-zinc-200 bg-zinc-50 flex flex-col justify-between hover:shadow-sm transition-shadow">
    <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">{label}</div>
    <div className="text-3xl font-bold tracking-tight text-zinc-950">{value}</div>
  </div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-zinc-200 p-3 rounded-lg shadow-md">
        <p className="text-xs font-semibold text-zinc-500 mb-2">{label}</p>
        {payload.map((p, idx) => (
          <div key={idx} className="flex items-center space-x-2 text-sm mb-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color || p.payload.fill }} />
            <span className="font-medium text-zinc-700">{p.name}:</span>
            <span className="font-bold text-zinc-950">{p.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export const HeiParticipationSection = ({ hei = {}, topUniversities = [], supportBreakdown = [] }) => {
  const total = supportBreakdown.reduce((s, d) => s + d.value, 0);

  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow-sm bg-white overflow-hidden w-full mt-6">
      <div className="flex flex-col space-y-1.5 p-6 border-b border-zinc-100">
        <h3 className="text-lg font-semibold leading-none tracking-tight text-zinc-950">HEI Participation</h3>
        <p className="text-sm text-muted-foreground text-zinc-500">University engagement, student metrics, and support modes.</p>
      </div>

      <div className="p-6 flex flex-col md:flex-row gap-12">
        {/* KPI row */}
        <div className="flex-1 grid grid-cols-2 gap-4">
          <Stat label="Faculty Mentors" value={hei.faculty || 0} />
          <Stat label="Engaged Students" value={(hei.students || 0).toLocaleString()} />
          <Stat label="Total Projects" value={hei.projects || 0} />
          <Stat label="Completed" value={hei.completed || 0} />
        </div>

        <div className="hidden md:block w-[1px] bg-zinc-100" />

        {/* Top universities bar chart (styled as sleek progress bars) */}
        <div className="flex-1 flex flex-col justify-center">
          <p className="text-sm font-semibold text-zinc-900 mb-6">Top Universities (Projects)</p>
          <div className="space-y-5">
            {topUniversities.map((u) => {
               const maxP = topUniversities[0]?.projects || 1;
               const widthPct = Math.max(5, (u.projects / maxP) * 100);
               return (
                <div key={u.name} className="space-y-2 group">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-zinc-700 font-medium truncate max-w-[250px]">{u.name}</span>
                    <span className="font-bold text-zinc-950">{u.projects}</span>
                  </div>
                  <div className="w-full h-2.5 bg-zinc-100 rounded-full overflow-hidden">
                    <div className="h-full bg-zinc-900 rounded-full group-hover:opacity-80 transition-opacity" style={{ width: `${widthPct}%` }} />
                  </div>
                </div>
               );
            })}
          </div>
        </div>

        <div className="hidden md:block w-[1px] bg-zinc-100" />

        {/* Support donut */}
        <div className="flex-1 flex flex-col justify-center items-center relative">
          <p className="text-sm font-semibold text-zinc-900 w-full mb-6">Support Modes</p>
          <div className="relative w-48 h-48 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={supportBreakdown} cx="50%" cy="50%" innerRadius={60} outerRadius={80} dataKey="value" stroke="none">
                  {supportBreakdown.map((d, i) => <Cell key={i} fill={d.color} />)}
                </Pie>
                <Tooltip content={<CustomTooltip />} cursor={{fill: 'transparent'}} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none mt-1">
              <div className="text-center">
                <div className="text-3xl font-bold text-zinc-950 tracking-tight">{total}</div>
                <div className="text-xs font-medium text-zinc-500 mt-1">Total</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeiParticipationSection;
