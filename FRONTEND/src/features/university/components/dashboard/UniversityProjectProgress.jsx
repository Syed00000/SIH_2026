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
    { status: 'Completed', count: completedCount, percentage: completedPercent, color: '#007A61' },
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
    <div className="bg-white border border-slate-200/90 rounded-2xl p-5 space-y-4 select-none shadow-xs">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <h2 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
            R&D Project Progress
          </h2>
          <span className="text-[11px] text-slate-500 font-medium">
            Live database pipeline
          </span>
        </div>
        <span className="text-[10.5px] font-extrabold text-[#007A61] bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-300 shadow-2xs">
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
                  className="transition-all duration-500 ease-out"
                />
              );
            })}
          </svg>
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="text-lg font-mono font-black text-slate-900 leading-none">
              {total}
            </span>
            <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-tighter mt-0.5">
              Projects
            </span>
          </div>
        </div>

        <div className="space-y-1.5 flex-1 min-w-0">
          {breakdown.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2 truncate">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <span className="text-slate-600 truncate font-semibold text-[11px]">{item.status}</span>
              </div>
              <div className="flex items-center space-x-1.5 font-mono text-[11px] shrink-0">
                <span className="font-extrabold text-slate-800">{item.count}</span>
                <span className="text-slate-400 font-medium">({item.percentage}%)</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Progress by Domain list */}
      <div className="pt-2 border-t border-slate-100 space-y-2">
        <span className="text-[10.5px] font-extrabold text-slate-400 uppercase tracking-wider block">
          Allocated Problem Domains
        </span>
        {topDomains.length === 0 ? (
          <div className="py-2.5 text-center text-slate-400 text-xs font-semibold bg-slate-50 rounded-xl">
            No challenges assigned yet
          </div>
        ) : (
          <div className="space-y-2">
            {topDomains.slice(0, 3).map((dom, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-slate-700 truncate">{dom.name}</span>
                  <span className="font-mono text-slate-500 font-bold">{dom.count} ({dom.percent}%)</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#007A61] rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(dom.percent, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UniversityProjectProgress;
