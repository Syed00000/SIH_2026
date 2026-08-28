import React from 'react';
import { Users, UserCheck, UserX, Briefcase } from 'lucide-react';

export const FacultyKpis = ({
  total = 0,
  active = 0,
  available = 0,
  onLeave = 0,
  inProjects = 0,
  loading = false
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 select-none">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white border border-slate-200 rounded-none p-3.5 h-20 animate-pulse flex items-center justify-between">
            <div className="space-y-2 w-3/4">
              <div className="h-2.5 bg-slate-200 rounded-none w-1/2"></div>
              <div className="h-5 bg-slate-300 rounded-none w-1/3"></div>
              <div className="h-2 bg-slate-200 rounded-none w-2/3"></div>
            </div>
            <div className="w-10 h-10 bg-slate-200 rounded-none"></div>
          </div>
        ))}
      </div>
    );
  }

  const cards = [
    { label: 'Total Faculty', value: total, sub: `Active: ${active}`, icon: Users },
    { label: 'Available Faculty', value: available, sub: 'Available for new projects', icon: UserCheck },
    { label: 'On Leave', value: onLeave, sub: 'Not available', icon: UserX },
    { label: 'Active in Projects', value: inProjects, sub: 'Working on projects', icon: Briefcase }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 select-none">
      {cards.map((c, i) => {
        const Icon = c.icon;
        return (
          <div
            key={i}
            className="bg-white border border-slate-200 rounded-none p-3.5 flex items-center justify-between shadow-2xs hover:border-slate-300 transition-colors"
          >
            <div>
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{c.label}</div>
              <div className="text-2xl font-extrabold text-slate-900 mt-1 font-mono">{c.value}</div>
              <div className="text-[10.5px] text-slate-500 mt-0.5 font-medium">{c.sub}</div>
            </div>
            <div className="w-10 h-10 bg-slate-100 border border-slate-200 rounded-none flex items-center justify-center text-slate-800">
              <Icon className="w-5 h-5" />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FacultyKpis;
