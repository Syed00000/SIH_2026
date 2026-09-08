import React, { useState, useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-slate-100 p-3 rounded-md shadow-lg relative z-50">
        <p className="text-[11px] font-bold text-slate-800 mb-1.5">{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center space-x-2 text-[10px] mb-1">
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-slate-500 font-medium capitalize">{entry.name}:</span>
            <span className="font-bold text-slate-900">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export const UniversityDashboardCharts = ({ challenges = [], kpis }) => {
  const [barFilter, setBarFilter] = useState('Year');
  const [areaFilter, setAreaFilter] = useState('Month');
  
  // Dynamically generate chart data based on actual challenges
  const barData = useMemo(() => {
    const dataPoints = [];
    const now = new Date();

    if (barFilter === 'Year') {
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      for (let i = 11; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        dataPoints.push({ name: monthNames[d.getMonth()], monthIndex: d.getMonth(), year: d.getFullYear(), received: 0, completed: 0 });
      }
      challenges.forEach(c => {
        const d = new Date(c.createdAt || c.submittedAt || new Date());
        if (!isNaN(d)) {
          const pt = dataPoints.find(p => p.monthIndex === d.getMonth() && p.year === d.getFullYear());
          if (pt) {
            pt.received += 1;
            const status = (c.status || '').toLowerCase();
            if (status.includes('complet') || status.includes('deploy') || status.includes('accept')) pt.completed += 1;
          }
        }
      });
    } else if (barFilter === 'Month') {
      for (let i = 3; i >= 0; i--) {
        dataPoints.push({ name: `Week ${4-i}`, weekOffset: i, received: 0, completed: 0 });
      }
      challenges.forEach(c => {
        const d = new Date(c.createdAt || c.submittedAt || new Date());
        if (!isNaN(d)) {
          const diffDays = Math.floor((now - d) / (1000 * 60 * 60 * 24));
          const weekOffset = Math.floor(diffDays / 7);
          const pt = dataPoints.find(p => p.weekOffset === weekOffset);
          if (pt) {
            pt.received += 1;
            const status = (c.status || '').toLowerCase();
            if (status.includes('complet') || status.includes('deploy') || status.includes('accept')) pt.completed += 1;
          }
        }
      });
    } else if (barFilter === 'Week') {
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      for (let i = 6; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        dataPoints.push({ name: dayNames[d.getDay()], dateString: d.toDateString(), received: 0, completed: 0 });
      }
      challenges.forEach(c => {
        const d = new Date(c.createdAt || c.submittedAt || new Date());
        if (!isNaN(d)) {
          const pt = dataPoints.find(p => p.dateString === d.toDateString());
          if (pt) {
            pt.received += 1;
            const status = (c.status || '').toLowerCase();
            if (status.includes('complet') || status.includes('deploy') || status.includes('accept')) pt.completed += 1;
          }
        }
      });
    }
    return dataPoints;
  }, [challenges, barFilter]);

  const areaData = useMemo(() => {
    const dataPoints = [];
    const now = new Date();

    if (areaFilter === 'Year') {
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      for (let i = 11; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        dataPoints.push({ name: monthNames[d.getMonth()], monthIndex: d.getMonth(), year: d.getFullYear(), total: 0, active: 0 });
      }
      challenges.forEach(c => {
        const d = new Date(c.createdAt || c.submittedAt || new Date());
        if (!isNaN(d)) {
          const pt = dataPoints.find(p => p.monthIndex === d.getMonth() && p.year === d.getFullYear());
          if (pt) {
            pt.total += 1;
            const status = (c.status || '').toLowerCase();
            if (!status.includes('complet') && !status.includes('deploy') && !status.includes('accept')) pt.active += 1;
          }
        }
      });
    } else if (areaFilter === 'Month') {
      for (let i = 3; i >= 0; i--) {
        dataPoints.push({ name: `Week ${4-i}`, weekOffset: i, total: 0, active: 0 });
      }
      challenges.forEach(c => {
        const d = new Date(c.createdAt || c.submittedAt || new Date());
        if (!isNaN(d)) {
          const diffDays = Math.floor((now - d) / (1000 * 60 * 60 * 24));
          const weekOffset = Math.floor(diffDays / 7);
          const pt = dataPoints.find(p => p.weekOffset === weekOffset);
          if (pt) {
            pt.total += 1;
            const status = (c.status || '').toLowerCase();
            if (!status.includes('complet') && !status.includes('deploy') && !status.includes('accept')) pt.active += 1;
          }
        }
      });
    } else if (areaFilter === 'Week') {
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      for (let i = 6; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        dataPoints.push({ name: dayNames[d.getDay()], dateString: d.toDateString(), total: 0, active: 0 });
      }
      challenges.forEach(c => {
        const d = new Date(c.createdAt || c.submittedAt || new Date());
        if (!isNaN(d)) {
          const pt = dataPoints.find(p => p.dateString === d.toDateString());
          if (pt) {
            pt.total += 1;
            const status = (c.status || '').toLowerCase();
            if (!status.includes('complet') && !status.includes('deploy') && !status.includes('accept')) pt.active += 1;
          }
        }
      });
    }
    return dataPoints;
  }, [challenges, areaFilter]);

  const FilterButtons = ({ currentFilter, setFilter }) => (
    <div className="flex items-center space-x-1.5 bg-slate-50 p-1 rounded-md">
      {['Week', 'Month', 'Year'].map(f => (
        <button
          key={f}
          onClick={() => setFilter(f)}
          className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition-colors ${
            currentFilter === f ? 'bg-[#007A61] text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          {f}
        </button>
      ))}
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 select-none mt-4">
      {/* Bar Chart Container */}
      <div className="lg:col-span-2 bg-white rounded-md border border-slate-200 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[15px] font-extrabold text-slate-800 font-sans tracking-tight">Project Progress</h3>
          <FilterButtons currentFilter={barFilter} setFilter={setBarFilter} />
        </div>
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }} barSize={6}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }} 
                dy={10} 
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }} 
                allowDecimals={false}
              />
              <Tooltip cursor={{ fill: '#f8fafc' }} content={<CustomTooltip />} />
              <Bar dataKey="received" fill="#3b82f6" radius={[4, 4, 4, 4]} />
              <Bar dataKey="completed" fill="#84cc16" radius={[4, 4, 4, 4]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Area Chart Container */}
      <div className="lg:col-span-1 bg-white rounded-md border border-slate-200 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[15px] font-extrabold text-slate-800 font-sans tracking-tight">Active Projects</h3>
          <FilterButtons currentFilter={areaFilter} setFilter={setAreaFilter} />
        </div>
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={areaData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#84cc16" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#84cc16" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }} 
                dy={10} 
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }} 
                allowDecimals={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="total" stroke="#3b82f6" strokeWidth={2.5} fillOpacity={1} fill="url(#colorTotal)" />
              <Area type="monotone" dataKey="active" stroke="#84cc16" strokeWidth={2.5} fillOpacity={1} fill="url(#colorActive)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default UniversityDashboardCharts;
