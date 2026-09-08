import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

export const UniversityDashboardRightWidgets = ({ challenges = [], kpis }) => {
  // Derive completion data
  const total = challenges.length;
  const completed = challenges.filter(c => {
    const s = (c.status || '').toLowerCase();
    return s.includes('complet') || s.includes('deploy') || s.includes('accept');
  }).length;
  
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  const pieData = [
    { name: 'Completed', value: percentage, color: '#007A61' }, // Dark green
    { name: 'Remaining', value: 100 - percentage, color: '#f1f5f9' } // Slate 100
  ];

  // Derive domain breakdown
  const domains = {};
  challenges.forEach(c => {
    const d = c.domain || c.category || 'Other';
    domains[d] = (domains[d] || 0) + 1;
  });
  
  let topDomains = Object.keys(domains).map(k => ({ name: k, count: domains[k] })).sort((a,b) => b.count - a.count).slice(0, 4);
  
  const maxDomainCount = Math.max(...topDomains.map(d => d.count)) || 1;

  return (
    <div className="flex flex-col space-y-4 h-full select-none">
      
      {/* Radial Chart Widget */}
      <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.03)] hover:shadow-md transition-all">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[14px] font-bold text-slate-800 tracking-wide">Monthly Status</h3>
          <span className="text-[11px] font-semibold text-slate-400">August</span>
        </div>
        
        <div className="flex items-center">
          <div className="relative w-[110px] h-[110px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={50}
                  startAngle={90}
                  endAngle={-270}
                  dataKey="value"
                  stroke="none"
                  cornerRadius={10}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xl font-black text-slate-800">{percentage}%</span>
              <span className="text-[10px] font-semibold text-slate-500">solved</span>
            </div>
          </div>
          
          <div className="ml-5 flex flex-col space-y-3">
            <div>
              <div className="flex items-center text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                <span className="w-2 h-2 rounded-full bg-[#007A61] mr-1.5"></span>
                Completed
              </div>
              <div className="text-[15px] font-bold text-slate-800">{completed}</div>
            </div>
            <div>
              <div className="flex items-center text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                <span className="w-2 h-2 rounded-full bg-slate-200 mr-1.5"></span>
                Remaining
              </div>
              <div className="text-[15px] font-bold text-slate-800">{total - completed}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bars Widget */}
      <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.03)] hover:shadow-md transition-all flex-1">
        <h3 className="text-[14px] font-bold text-slate-800 tracking-wide mb-5">Projects by Domain</h3>
        
        <div className="space-y-4">
          {topDomains.length > 0 ? (
            topDomains.map((d, idx) => (
              <div key={idx}>
                <div className="flex items-center justify-between text-[11px] font-semibold mb-1.5">
                  <span className="text-slate-600 truncate mr-2">{d.name}</span>
                  <span className="text-slate-800">{d.count}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-[5px]">
                  <div 
                    className="bg-[#007A61] h-[5px] rounded-full" 
                    style={{ width: `${(d.count / maxDomainCount) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex items-center justify-center py-6 text-[11px] font-medium text-slate-400 text-center">
              No project data available yet.
            </div>
          )}
        </div>
      </div>

    </div>
  );
};
