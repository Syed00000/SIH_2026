import React, { useState, useEffect } from 'react';
import { Rocket, CheckCircle2, TrendingUp, Hourglass, FolderGit2 } from 'lucide-react';
import { universityApiService } from '../../services/universityApiService.js';

export const UniversityProjectProgress = ({
  projectProgress: initialProgress,
  challenges = [],
  universityCode = 'RU001'
}) => {
  const [liveProjects, setLiveProjects] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await universityApiService.getProjects(universityCode);
      if (Array.isArray(data)) setLiveProjects(data);
      setLoading(false);
    }
    load();
  }, [universityCode]);

  const total = liveProjects.length;
  const inProgressCount = liveProjects.filter((p) => p.status === 'In Progress' || p.status === 'On Track').length;
  const planningCount = liveProjects.filter((p) => p.status === 'Planning' || p.status === 'At Risk').length;
  const completedCount = liveProjects.filter((p) => p.status === 'Completed').length;
  const delayedCount = liveProjects.filter((p) => p.status === 'Delayed').length;

  const completedPercent = total > 0 ? Math.round((completedCount / total) * 100) : 0;
  const inProgressPercent = total > 0 ? Math.round((inProgressCount / total) * 100) : 0;
  const planningPercent = total > 0 ? Math.round((planningCount / total) * 100) : 0;
  const delayedPercent = total > 0 ? Math.round((delayedCount / total) * 100) : 0;

  const breakdown = [
    { status: 'Completed', count: completedCount, percentage: completedPercent, color: '#10b981' },
    { status: 'In Progress', count: inProgressCount, percentage: inProgressPercent, color: '#0f172a' },
    { status: 'Planning', count: planningCount, percentage: planningPercent, color: '#64748b' },
    { status: 'Delayed', count: delayedCount, percentage: delayedPercent, color: '#e11d48' }
  ];

  // Dynamic Domain calculation from real assigned challenges
  const domainCounts = {};
  challenges.forEach((c) => {
    if (c.domain) {
      domainCounts[c.domain] = (domainCounts[c.domain] || 0) + 1;
    }
  });

  const topDomains = Object.keys(domainCounts).map((dom) => ({
    name: dom,
    count: domainCounts[dom],
    percent: challenges.length > 0 ? Math.round((domainCounts[dom] / challenges.length) * 100) : 0
  })).sort((a, b) => b.count - a.count);

  const size = 100;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  let cumulativePercent = 0;

  return (
    <div className="bg-white border border-slate-200/90 rounded-xl p-4 space-y-4 select-none shadow-2xs">
      <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
        <div>
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            R&D Project Progress
          </h2>
          <span className="text-[11px] text-slate-500 font-medium">
            Live database pipeline
          </span>
        </div>
        <span className="text-[10.5px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-300">
          {completedCount} Completed ({completedPercent}%)
        </span>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="relative w-[96px] h-[96px] shrink-0 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox={`0 0 ${size} ${size}`}>
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="transparent"
              stroke="#f1f5f9"
              strokeWidth={strokeWidth}
            />
            {total > 0 && breakdown.map((seg, idx) => {
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
            <span className="text-lg font-black text-slate-900 leading-none font-mono">{total}</span>
            <span className="text-[8.5px] text-slate-400 font-extrabold mt-0.5 tracking-wider">PROJECTS</span>
          </div>
        </div>

        <div className="flex-1 space-y-1.5 text-xs">
          {breakdown.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between text-slate-700">
              <div className="flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="font-bold text-slate-800 text-[11px]">{item.status}</span>
              </div>
              <span className="font-mono text-slate-900 text-[11px] font-bold">
                {item.count} <span className="text-slate-400 font-normal">({item.percentage}%)</span>
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-3 border-t border-slate-100 space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-[11px] font-bold text-slate-900 uppercase tracking-wider">
            Allocated Problem Domains
          </h3>
          <span className="text-[10px] text-slate-400 font-mono">
            {challenges.length} Problem{challenges.length !== 1 ? 's' : ''}
          </span>
        </div>

        {topDomains.length === 0 ? (
          <div className="py-3 text-center text-slate-400 text-xs font-medium bg-slate-50 rounded-lg">
            No challenges assigned yet in database
          </div>
        ) : (
          <div className="space-y-1.5">
            {topDomains.map((dom, idx) => (
              <div key={idx} className="flex items-center justify-between gap-2 text-xs">
                <span className="w-28 font-semibold text-slate-800 truncate text-[11px]" title={dom.name}>
                  {dom.name}
                </span>
                <div className="flex-1 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="h-full bg-emerald-600 transition-all duration-300 rounded-full"
                    style={{ width: `${Math.max(5, dom.percent)}%` }}
                  />
                </div>
                <span className="font-mono font-bold text-slate-900 text-[11px] w-6 text-right">
                  {dom.count}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UniversityProjectProgress;
