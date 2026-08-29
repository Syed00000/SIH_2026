import React from 'react';
import {
  Layers,
  Briefcase,
  GraduationCap,
  CheckCircle2,
  Handshake
} from 'lucide-react';

export const NodalStatCards = () => {
  const statCards = [
    {
      id: 'assigned',
      title: 'Assigned Challenges',
      value: 12,
      subTag: '3 Action Needed',
      subColor: 'text-amber-600 bg-amber-50 border-amber-200',
      icon: Layers,
      trend: '+15% vs last month'
    },
    {
      id: 'projects',
      title: 'Active Projects',
      value: 8,
      subTag: '1 Milestone Delayed',
      subColor: 'text-red-600 bg-red-50 border-red-200',
      icon: Briefcase,
      trend: '+10% vs last month'
    },
    {
      id: 'faculty',
      title: 'Faculty Mentors',
      value: 24,
      subTag: '2 on Sabbatical',
      subColor: 'text-slate-500 bg-slate-50 border-slate-200',
      icon: GraduationCap,
      trend: '6 Departments'
    },
    {
      id: 'approvals',
      title: 'Pending Approvals',
      value: 4,
      subTag: '2 Urgent Action',
      subColor: 'text-purple-600 bg-purple-50 border-purple-200',
      icon: CheckCircle2,
      trend: 'Proposals & UCs'
    },
    {
      id: 'partners',
      title: 'Industry Partners',
      value: 7,
      subTag: '2 MoUs in Progress',
      subColor: 'text-blue-600 bg-blue-50 border-blue-200',
      icon: Handshake,
      trend: 'CSR Matched'
    }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {statCards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.id}
            className="bg-white border border-slate-200/90 rounded-xl p-3.5 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-500 truncate">{card.title}</span>
              <div className="p-1.5 rounded-lg bg-slate-50 border border-slate-100 text-slate-700">
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <div className="mt-2">
              <div className="text-2xl font-black text-slate-900 leading-none">{card.value}</div>
              <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-50">
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${card.subColor}`}>
                  {card.subTag}
                </span>
                <span className="text-[10px] text-slate-400 font-medium">{card.trend}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default NodalStatCards;
