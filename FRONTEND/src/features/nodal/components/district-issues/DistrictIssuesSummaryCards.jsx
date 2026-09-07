import React from 'react';
import { AlertCircle, Clock, Building2, CheckCircle2 } from 'lucide-react';

export const DistrictIssuesSummaryCards = ({ challenges = [] }) => {
  const total = challenges.length;
  const pending = challenges.filter(
    (c) => !c.assignedDepartment?.name && c.status !== 'Resolved' && c.status !== 'Rejected'
  ).length;
  const assigned = challenges.filter((c) => Boolean(c.assignedDepartment?.name)).length;
  const resolved = challenges.filter((c) => c.status === 'Resolved' || c.status === 'Deployed').length;

  const cards = [
    {
      label: 'Total District Submissions',
      value: total,
      subtext: 'Ground issues from citizens',
      icon: AlertCircle,
      textColor: 'text-slate-800',
      bgColor: 'bg-slate-50',
      iconColor: 'text-slate-600'
    },
    {
      label: 'Pending Assignment',
      value: pending,
      subtext: 'Awaiting department allocation',
      icon: Clock,
      textColor: 'text-amber-700',
      bgColor: 'bg-amber-50/80',
      iconColor: 'text-amber-600'
    },
    {
      label: 'Assigned to Departments',
      value: assigned,
      subtext: 'Active departmental ownership',
      icon: Building2,
      textColor: 'text-blue-700',
      bgColor: 'bg-blue-50/80',
      iconColor: 'text-blue-600'
    },
    {
      label: 'Resolved / Addressed',
      value: resolved,
      subtext: 'Successfully completed on ground',
      icon: CheckCircle2,
      textColor: 'text-emerald-700',
      bgColor: 'bg-emerald-50/80',
      iconColor: 'text-emerald-600'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 select-none text-left">
      {cards.map((c, i) => {
        const Icon = c.icon;
        return (
          <div key={i} className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs flex items-center justify-between">
            <div className="min-w-0 pr-2">
              <span className="text-[10.5px] font-bold text-slate-400 block uppercase tracking-wider truncate">
                {c.label}
              </span>
              <div className={`text-xl font-black ${c.textColor} mt-0.5`}>{c.value}</div>
              <span className="text-[10px] text-slate-500 font-medium block truncate mt-0.5">
                {c.subtext}
              </span>
            </div>
            <div className={`w-9 h-9 rounded-xl ${c.bgColor} flex items-center justify-center shrink-0`}>
              <Icon className={`w-4 h-4 ${c.iconColor}`} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DistrictIssuesSummaryCards;
