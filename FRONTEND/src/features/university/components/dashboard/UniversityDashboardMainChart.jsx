import React, { useState, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export const UniversityDashboardMainChart = ({ challenges = [] }) => {
  const [filter, setFilter] = useState('Month'); // Week, Month, Year

  const { chartData, stats } = useMemo(() => {
    const dataPoints = [];
    const now = new Date();
    let receivedTotal = 0;
    let completedTotal = 0;

    // Build the base timeline based on filter
    if (filter === 'Year') {
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      for (let i = 11; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        dataPoints.push({ name: monthNames[d.getMonth()], monthIndex: d.getMonth(), year: d.getFullYear(), total: 0 });
      }
    } else if (filter === 'Month') {
      for (let i = 4; i >= 0; i--) {
        dataPoints.push({ name: `Week ${5 - i}`, weekOffset: i, total: 0 });
      }
    } else if (filter === 'Week') {
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      for (let i = 6; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        dataPoints.push({ name: dayNames[d.getDay()], dateString: d.toDateString(), total: 0 });
      }
    }

    // Populate data
    challenges.forEach(c => {
      receivedTotal++;
      const status = (c.status || '').toLowerCase();
      if (status.includes('complet') || status.includes('deploy') || status.includes('accept')) {
        completedTotal++;
      }

      const d = new Date(c.createdAt || c.submittedAt || new Date());
      if (isNaN(d)) return;

      if (filter === 'Year') {
        const pt = dataPoints.find(p => p.monthIndex === d.getMonth() && p.year === d.getFullYear());
        if (pt) pt.total += 1;
      } else if (filter === 'Month') {
        const diffDays = Math.floor((now - d) / (1000 * 60 * 60 * 24));
        const weekOffset = Math.floor(diffDays / 7);
        const pt = dataPoints.find(p => p.weekOffset === weekOffset);
        if (pt) pt.total += 1;
      } else if (filter === 'Week') {
        const pt = dataPoints.find(p => p.dateString === d.toDateString());
        if (pt) pt.total += 1;
      }
    });

    return {
      chartData: dataPoints,
      stats: {
        totalReceived: receivedTotal,
        totalCompleted: completedTotal,
        avgMonthly: (receivedTotal / 6).toFixed(1)
      }
    };
  }, [challenges, filter]);

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.03)] h-full flex flex-col relative select-none">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[15px] font-semibold text-slate-800 tracking-wide font-sans">
          Project Activity
        </h3>
        <div className="flex items-center space-x-1 bg-slate-50 p-1 rounded-lg border border-slate-100">
          {['Week', 'Month', 'Year'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 text-[11px] font-bold rounded-md transition-all ${
                filter === f ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Main Big Number */}
      <div className="flex items-end space-x-3 mb-6">
        <div className="text-3xl font-black text-slate-800 tracking-tight font-sans">
          {stats.totalReceived}
        </div>
      </div>

      {/* Chart */}
      <div className="flex-1 w-full h-[180px] min-h-[180px] mt-2 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 5, right: 0, left: 0, bottom: 20 }}>
            <defs>
              <linearGradient id="colorProject" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#007A61" stopOpacity={0.25}/>
                <stop offset="95%" stopColor="#007A61" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 500 }} 
              dy={15}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-white border border-slate-100 p-2.5 rounded-lg shadow-lg">
                      <p className="text-[11px] font-bold text-slate-800 mb-1">{payload[0].payload.name}</p>
                      <p className="text-[12px] font-bold text-[#007A61]">Projects: {payload[0].value}</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area 
              type="monotone" 
              dataKey="total" 
              stroke="#007A61" 
              strokeWidth={3} 
              fillOpacity={1} 
              fill="url(#colorProject)" 
              animationDuration={500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Bottom Footer Stats */}
      <div className="grid grid-cols-3 gap-4 pt-5 border-t border-slate-100">
        <div>
          <div className="text-[11px] font-semibold text-slate-500 mb-1">Total Received</div>
          <div className="text-[16px] font-bold text-slate-800">{stats.totalReceived}</div>
        </div>
        <div>
          <div className="text-[11px] font-semibold text-slate-500 mb-1">Total Completed</div>
          <div className="text-[16px] font-bold text-slate-800">{stats.totalCompleted}</div>
        </div>
        <div>
          <div className="text-[11px] font-semibold text-slate-500 mb-1">Avg. Monthly</div>
          <div className="text-[16px] font-bold text-[#007A61] flex items-center">
             {stats.avgMonthly}
          </div>
        </div>
      </div>

    </div>
  );
};
