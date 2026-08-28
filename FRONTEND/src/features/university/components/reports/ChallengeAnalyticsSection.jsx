import React from 'react';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const RADIAN = Math.PI / 180;
const renderLabel = ({ cx, cy, midAngle, outerRadius, percent, name }) => {
  if (percent < 0.05) return null;
  const r = outerRadius + 20;
  const x = cx + r * Math.cos(-midAngle * RADIAN);
  const y = cy + r * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="#71717a" fontSize={11} fontWeight={600} textAnchor={x > cx ? 'start' : 'end'}>
      {`${name} (${(percent * 100).toFixed(0)}%)`}
    </text>
  );
};

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

export const ChallengeAnalyticsSection = ({ pipeline = [], byDomain = [], trend = [] }) => {
  const total = byDomain.reduce((s, d) => s + d.value, 0);

  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow-sm bg-white overflow-hidden w-full">
      <div className="flex flex-col space-y-1.5 p-6 border-b border-zinc-100">
        <h3 className="text-lg font-semibold leading-none tracking-tight text-zinc-950">Challenge Analytics</h3>
        <p className="text-sm text-muted-foreground text-zinc-500">Pipeline distribution and submission trends.</p>
      </div>

      <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Pipeline & Donut - Left Side */}
        <div className="col-span-1 md:col-span-5 flex flex-col gap-8">
          {/* Pipeline */}
          <div>
            <p className="text-sm font-semibold text-zinc-900 mb-4">Pipeline Status</p>
            <div className="space-y-3">
              {pipeline.map((s, i) => (
                <div key={s.label} className="flex items-center">
                  <span className="text-sm font-medium text-zinc-600 w-28">{s.label}</span>
                  <div className="flex-1 flex items-center space-x-3">
                    <div className="h-4 rounded-full bg-zinc-100 w-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-500"
                           style={{ backgroundColor: s.color, width: `${Math.max(5, (s.value / (pipeline[0]?.value || 1)) * 100)}%` }} />
                    </div>
                    <span className="text-sm font-bold text-zinc-900 w-8 text-right">{s.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full h-[1px] bg-zinc-100" />

          {/* Donut */}
          <div className="relative">
            <p className="text-sm font-semibold text-zinc-900 mb-4">Domain Distribution</p>
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={byDomain} cx="50%" cy="50%" innerRadius={60} outerRadius={85} dataKey="value" stroke="none" label={renderLabel}>
                    {byDomain.map((d, i) => <Cell key={i} fill={d.color} />)}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} cursor={{fill: 'transparent'}} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none mt-10">
              <div className="text-center">
                <div className="text-3xl font-bold text-zinc-950">{total}</div>
                <div className="text-xs font-medium text-zinc-500 mt-1">Total</div>
              </div>
            </div>
          </div>
        </div>

        <div className="hidden md:block col-span-1 w-[1px] bg-zinc-100 mx-auto" />

        {/* Line Trend - Right Side */}
        <div className="col-span-1 md:col-span-6 flex flex-col min-h-[300px]">
          <p className="text-sm font-semibold text-zinc-900 mb-4">Monthly Trend</p>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trend} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#71717a' }} axisLine={false} tickLine={false} dy={10} />
                <YAxis tick={{ fontSize: 12, fill: '#71717a' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{stroke: '#d4d4d8', strokeWidth: 1}} />
                <Line type="monotone" dataKey="received" stroke="#a1a1aa" strokeWidth={2} dot={{r:4, strokeWidth:2, fill:'#fff'}} activeDot={{r:6, fill:'#a1a1aa', stroke:'#fff', strokeWidth:2}} name="Received" />
                <Line type="monotone" dataKey="solved" stroke="#18181b" strokeWidth={2} dot={{r:4, strokeWidth:2, fill:'#fff'}} activeDot={{r:6, fill:'#18181b', stroke:'#fff', strokeWidth:2}} name="Solved" />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 13, fontWeight: 500, color: '#52525b', paddingTop: '20px' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ChallengeAnalyticsSection;
