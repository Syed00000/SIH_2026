import React from 'react';
import { Users, UserCheck, UserX, Briefcase, Award } from 'lucide-react';

export const FacultyKpis = ({
  total = 0,
  active = 0,
  available = 0,
  onLeave = 0,
  inProjects = 0,
  deliveredSolutions = 0,
  loading = false
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 select-none">
        {[1, 2, 3, 4, 5].map((i) => (
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
    { label: 'Active in Projects', value: inProjects, sub: inProjects > 0 ? 'Mentoring ongoing R&D' : 'No ongoing projects', icon: Briefcase },
    { label: 'Solutions Delivered', value: deliveredSolutions, sub: 'TRL-9 Solutions Deployed', icon: Award, isSuccess: true }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 select-none">
      {cards.map((c, i) => {
        const Icon = c.icon;
        return (
          <div
            key={i}
            className={`border rounded-none p-3.5 flex items-center justify-between shadow-2xs transition-colors ${
              c.isSuccess
                ? 'bg-emerald-50/50 border-emerald-300 hover:border-emerald-400'
                : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            <div>
              <div className={`text-[11px] font-bold uppercase tracking-wider ${c.isSuccess ? 'text-[#007A61] font-extrabold' : 'text-slate-500'}`}>
                {c.label}
              </div>
              <div className={`text-2xl font-extrabold mt-1 font-mono ${c.isSuccess ? 'text-emerald-950' : 'text-slate-900'}`}>
                {c.value}
              </div>
              <div className={`text-[10.5px] mt-0.5 font-medium ${c.isSuccess ? 'text-[#007A61]' : 'text-slate-500'}`}>
                {c.sub}
              </div>
            </div>
            <div className={`w-10 h-10 border rounded-none flex items-center justify-center ${
              c.isSuccess
                ? 'bg-emerald-100 border-emerald-300 text-[#007A61]'
                : 'bg-slate-100 border-slate-200 text-slate-800'
            }`}>
              <Icon className="w-5 h-5" />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FacultyKpis;
