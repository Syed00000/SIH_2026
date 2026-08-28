import React, { useState, useEffect } from 'react';
import { CheckCircle2, TrendingUp, Hourglass } from 'lucide-react';
import { universityApiService } from '../../services/universityApiService.js';

export const UniversityProjectProgress = ({
  projectProgress: initialProgress,
  topDomains: initialDomains = []
}) => {
  const [liveProjects, setLiveProjects] = useState([]);

  useEffect(() => {
    async function load() {
      const data = await universityApiService.getProjects('RU001');
      if (Array.isArray(data)) setLiveProjects(data);
    }
    load();
  }, []);

  const total = liveProjects.length || initialProgress?.totalProjects || initialProgress?.total || 28;
  const inProgressCount = liveProjects.length ? liveProjects.filter((p) => p.status === 'In Progress').length : (initialProgress?.breakdown?.[0]?.count || 14);
  const planningCount = liveProjects.length ? liveProjects.filter((p) => p.status === 'Planning').length : (initialProgress?.breakdown?.[1]?.count || 6);
  const completedCount = liveProjects.length ? liveProjects.filter((p) => p.status === 'Completed').length : (initialProgress?.breakdown?.[3]?.count || 8);
  const delayedCount = liveProjects.length ? liveProjects.filter((p) => p.status === 'Delayed').length : 0;

  const completedPercent = Math.round((completedCount / total) * 100) || 29;
  const inProgressPercent = Math.round((inProgressCount / total) * 100) || 50;
  const planningPercent = Math.round((planningCount / total) * 100) || 21;
  const delayedPercent = Math.round((delayedCount / total) * 100) || 0;

  const breakdown = [
    { status: 'Completed', count: completedCount, percentage: completedPercent, color: '#10b981' },
    { status: 'In Progress', count: inProgressCount, percentage: inProgressPercent, color: '#0f172a' },
    { status: 'Planning', count: planningCount, percentage: planningPercent, color: '#64748b' },
    { status: 'Delayed', count: delayedCount, percentage: delayedPercent, color: '#e11d48' }
  ];

  const size = 100;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  let cumulativePercent = 0;

  return (
    <div className="bg-white border border-slate-200 rounded-none p-3.5 space-y-3.5 select-none">
      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
        <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
          Project Progress Analytics
        </h2>
        <span className="text-[10.5px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 border border-emerald-300">
          {completedCount} Completed ({completedPercent}%)
        </span>
      </div>

      <div className="flex items-center justify-between gap-3">
        <div className="relative w-[100px] h-[100px] shrink-0 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox={`0 0 ${size} ${size}`}>
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="transparent"
              stroke="#f1f5f9"
              strokeWidth={strokeWidth}
            />
            {breakdown.map((seg, idx) => {
              if (seg.percentage === 0) return null;
              const strokeDasharray = `${(seg.percentage / 100) * circumference} ${circumference}`;
              const strokeDashoffset = -((cumulativePercent / 100) * circumference);
              cumulativePercent += seg.percentage;

              return (
                <circle
                  key={idx}
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="transparent"
                  stroke={seg.color}
                  strokeWidth={strokeWidth}
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                />
              );
            })}
          </svg>
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="text-base font-black text-slate-900 leading-none">{total}</span>
            <span className="text-[9px] text-slate-500 font-extrabold mt-0.5">PROJECTS</span>
          </div>
        </div>

        <div className="flex-1 space-y-1.5 text-xs">
          {breakdown.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between text-slate-700">
              <div className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-none" style={{ backgroundColor: item.color }} />
                <span className="font-bold text-slate-800 text-[11px]">{item.status}</span>
              </div>
              <span className="font-mono text-slate-900 text-[11px] font-bold">
                {item.count} <span className="text-slate-400 font-normal">({item.percentage}%)</span>
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-2.5 border-t border-slate-200 space-y-2">
        <h3 className="text-[11px] font-bold text-slate-900 uppercase tracking-wider">
          Top Domains Distribution
        </h3>
        <div className="space-y-1.5">
          {[
            { name: 'Water Resources', count: 8, percent: 35 },
            { name: 'Agriculture & Agro', count: 6, percent: 25 },
            { name: 'Infrastructure & GIS', count: 5, percent: 20 },
            { name: 'Renewable Energy', count: 5, percent: 12 },
            { name: 'Environment', count: 4, percent: 8 }
          ].map((dom, idx) => (
            <div key={idx} className="flex items-center justify-between gap-2 text-xs">
              <span className="w-24 font-semibold text-slate-800 truncate text-[11px]">
                {dom.name}
              </span>
              <div className="flex-1 bg-slate-100 rounded-none h-2 overflow-hidden border border-slate-200">
                <div
                  className="h-full bg-slate-900 transition-all duration-300 rounded-none"
                  style={{ width: `${dom.percent}%` }}
                />
              </div>
              <span className="font-mono font-bold text-slate-900 text-[11px] w-4 text-right">
                {dom.count}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UniversityProjectProgress;
