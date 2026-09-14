import React from 'react';
import { BarChart3, ArrowRight, Layers, Flame, CheckCircle2, ShieldAlert } from 'lucide-react';

export const NodalProblemDomainAnalyticsCard = ({
  challenges = [],
  onNavigateChallenges
}) => {
  const total = challenges.length;

  const domainCounts = challenges.reduce((acc, c) => {
    const d = c.domain || 'General Civic';
    acc[d] = (acc[d] || 0) + 1;
    return acc;
  }, {});

  const sortedDomains = Object.entries(domainCounts)
    .map(([domain, count]) => ({
      domain,
      count,
      percent: total > 0 ? Math.round((count / total) * 100) : 0,
      inProgress: challenges.filter(
        (c) => (c.domain || 'General Civic') === domain && c.status === 'In Progress'
      ).length,
      unassigned: challenges.filter(
        (c) => (c.domain || 'General Civic') === domain && !c.assignedUniversity?.id && !c.assignedDepartment?.deptId && !c.assignedWard?.wardId
      ).length
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const highPriorityCount = challenges.filter(
    (c) => (c.priority || '').toLowerCase() === 'high' || (c.priority || '').toLowerCase() === 'critical'
  ).length;

  const inProgressCount = challenges.filter((c) => c.status === 'In Progress').length;

  return (
    <div className="bg-white border border-slate-100 rounded-none p-5 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.03)] flex flex-col justify-between space-y-4 text-left">
      <div>
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-4 h-4 text-[#007A61] stroke-[2]" />
            <h3 className="text-sm font-bold text-slate-900">
              Civic Problem Domains & Urgency
            </h3>
          </div>
          <button
            type="button"
            onClick={() => onNavigateChallenges && onNavigateChallenges('All Status')}
            className="text-[11px] font-bold text-[#007A61] hover:text-[#00604c] flex items-center space-x-0.5 cursor-pointer transition-colors"
          >
            <span>View All</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="mt-3 space-y-3">
          {sortedDomains.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-xs">
              <Layers className="w-6 h-6 text-slate-300 mx-auto mb-1.5" />
              <p className="font-bold text-slate-600">No category data available</p>
              <p className="text-[11px] font-medium text-slate-400">Incoming citizen submissions will populate domain metrics automatically.</p>
            </div>
          ) : (
            sortedDomains.map((item) => (
              <div
                key={item.domain}
                onClick={() => onNavigateChallenges && onNavigateChallenges('All Status')}
                className="p-2 hover:bg-slate-50/70 transition-colors cursor-pointer group"
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-800 group-hover:text-[#007A61] transition-colors">
                      {item.domain}
                    </span>
                    {item.unassigned > 0 && (
                      <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-200/60 px-1.5 py-0.5 rounded">
                        {item.unassigned} pending
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-1.5 text-slate-600 font-mono font-bold text-[11px]">
                    <span>{item.count}</span>
                    <span className="text-slate-400 font-normal">({item.percent}%)</span>
                  </div>
                </div>

                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#007A61] to-[#00a884] rounded-full transition-all duration-300"
                    style={{ width: `${Math.max(item.percent, 8)}%` }}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="space-y-2 pt-2">
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center space-x-2 p-2 rounded bg-rose-50/70 border border-rose-100">
            <Flame className="w-3.5 h-3.5 text-rose-600 shrink-0" />
            <div className="min-w-0">
              <span className="text-[10px] font-bold text-rose-700 uppercase block leading-tight">High Priority</span>
              <span className="font-black text-slate-900 text-xs">{highPriorityCount} Issues</span>
            </div>
          </div>
          <div className="flex items-center space-x-2 p-2 rounded bg-emerald-50/70 border border-emerald-100">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <div className="min-w-0">
              <span className="text-[10px] font-bold text-emerald-700 uppercase block leading-tight">In Progress</span>
              <span className="font-black text-slate-900 text-xs">{inProgressCount} Active</span>
            </div>
          </div>
        </div>

        <div className="p-3 bg-slate-50 border border-slate-100 rounded-none flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <ShieldAlert className="w-4 h-4 text-[#007A61] shrink-0" />
            <span className="font-bold text-slate-700">
              {total} Total Ground Truth Submissions
            </span>
          </div>
          <button
            type="button"
            onClick={() => onNavigateChallenges && onNavigateChallenges('All Status')}
            className="text-[#007A61] font-bold hover:text-[#00604c] shrink-0 text-[11px] cursor-pointer transition-colors"
          >
            Review Pipeline
          </button>
        </div>
      </div>
    </div>
  );
};

export default NodalProblemDomainAnalyticsCard;
