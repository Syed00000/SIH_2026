import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { AlertTriangle } from 'lucide-react';

const STAGE_COLORS = ['#e4e4e7', '#d4d4d8', '#a1a1aa', '#71717a', '#18181b'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-zinc-200 p-3 rounded-none shadow-none z-50">
        <p className="text-xs font-semibold text-zinc-500 mb-2">{label || payload[0].name}</p>
        {payload.map((p, idx) => (
          <div key={idx} className="flex items-center space-x-2 text-sm mb-1">
            <div className="w-2 h-2 rounded-none" style={{ backgroundColor: p.color || p.payload.fill }} />
            <span className="font-medium text-zinc-700">{p.name}:</span>
            <span className="font-bold text-zinc-950">{p.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export const ProjectProgressSection = ({ byStatus = [], byStage = [], delayedCount = 0 }) => {
  const total = byStatus.reduce((s, p) => s + p.value, 0);

  return (
    <div className="rounded-none border bg-card text-card-foreground shadow-none bg-white overflow-hidden w-full">
      <div className="flex flex-col space-y-1.5 p-6 border-b border-zinc-100">
        <h3 className="text-lg font-semibold leading-none tracking-tight text-zinc-950">Project Progress</h3>
        <p className="text-sm text-muted-foreground text-zinc-500">Breakdown of projects by status and implementation stage.</p>
      </div>

      <div className="p-6 flex flex-col md:flex-row gap-12">
        {/* Donut by status */}
        <div className="flex-1 flex flex-col justify-center">
          <p className="text-sm font-semibold text-zinc-900 mb-6">Projects by Status</p>
          <div className="flex items-center">
            <div className="relative w-48 h-48 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={byStatus} cx="50%" cy="50%" innerRadius={60} outerRadius={80} dataKey="value" stroke="none" paddingAngle={2}>
                    {byStatus.map((d, i) => <Cell key={i} fill={d.color} />)}
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
            
            <div className="ml-8 flex-1 space-y-3">
              {byStatus.map((s) => (
                <div key={s.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 rounded-none shadow-none" style={{ backgroundColor: s.color }} />
                    <span className="text-zinc-700 font-medium">{s.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-zinc-900">{s.value}</span>
                    <span className="text-zinc-400 font-medium w-8 text-right">({Math.round(s.value / (total || 1) * 100)}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="hidden md:block w-[1px] bg-zinc-100" />

        {/* Stage funnel */}
        <div className="flex-1 flex flex-col min-h-[250px]">
          <p className="text-sm font-semibold text-zinc-900 mb-6">Projects by Stage</p>
          <div className="flex-1 flex items-end space-x-3 mb-4">
            {byStage.map((s, i) => {
              const maxVal = byStage[0]?.count || 1;
              const heightPct = Math.max(15, Math.round((s.count / maxVal) * 100));
              return (
                <div key={s.stage} className="flex-1 flex flex-col items-center justify-end group cursor-pointer h-full">
                  <div className="text-sm font-bold text-zinc-900 mb-2 opacity-0 group-hover:opacity-100 transition-opacity">{s.count}</div>
                  <div
                    className="w-full rounded-t-md transition-all duration-300 hover:brightness-110 shadow-none"
                    style={{ height: `${heightPct}%`, backgroundColor: STAGE_COLORS[i] }}
                  />
                  <div className="text-xs font-medium text-zinc-500 mt-3 text-center leading-tight truncate w-full">{s.stage}</div>
                </div>
              );
            })}
          </div>
          {delayedCount > 0 && (
            <div className="flex items-center justify-between bg-zinc-50 border border-zinc-200 px-4 py-3 rounded-none mt-6">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="w-4 h-4 text-zinc-900 shrink-0" />
                <span className="text-sm font-medium text-zinc-900">{delayedCount} Projects Delayed</span>
              </div>
              <button className="text-xs font-bold text-zinc-950 hover:bg-zinc-100 px-3 py-1.5 rounded-none transition-colors border border-zinc-200">View</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectProgressSection;
