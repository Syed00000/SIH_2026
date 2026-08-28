import React from 'react';
import { Folder, Rocket, Users, ClipboardCheck, Handshake } from 'lucide-react';

export const UniversityStatCards = ({ kpis, onCardClick, loading = false }) => {
  if (loading || !kpis) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 select-none">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="bg-white border border-slate-200 rounded-none p-3 h-18 animate-pulse flex items-center space-x-2.5">
            <div className="w-8 h-8 bg-slate-200 rounded-none"></div>
            <div className="space-y-1.5 flex-1">
              <div className="h-4 bg-slate-300 w-1/3"></div>
              <div className="h-2.5 bg-slate-200 w-3/4"></div>
              <div className="h-2 bg-slate-200 w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const cards = [
    {
      id: 'challenges',
      title: 'Assigned Challenges',
      value: kpis?.assignedChallenges?.total ?? 0,
      subText: `${kpis?.assignedChallenges?.reviewNeeded ?? 0} need review`,
      icon: Folder,
      subTextColor: 'text-slate-900 font-bold'
    },
    {
      id: 'projects',
      title: 'Active Projects',
      value: kpis?.activeProjects?.total ?? 0,
      subText: `${kpis?.activeProjects?.delayed ?? 0} delayed`,
      icon: Rocket,
      subTextColor: 'text-rose-600 font-semibold'
    },
    {
      id: 'faculty',
      title: 'Faculty Mentors',
      value: kpis?.facultyMentors?.total ?? 0,
      subText: `${kpis?.facultyMentors?.onLeave ?? 0} on leave`,
      icon: Users,
      subTextColor: 'text-slate-500 font-medium'
    },
    {
      id: 'approvals',
      title: 'Pending Approvals',
      value: kpis?.pendingApprovals?.total ?? 0,
      subText: kpis?.pendingApprovals?.note || 'Action needed',
      icon: ClipboardCheck,
      subTextColor: 'text-amber-700 font-semibold'
    },
    {
      id: 'partners',
      title: 'Industry Partners',
      value: kpis?.industryPartners?.total ?? 0,
      subText: kpis?.industryPartners?.note || 'Active collaborations',
      icon: Handshake,
      subTextColor: 'text-emerald-700 font-semibold'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 select-none">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.id}
            onClick={() => onCardClick && onCardClick(card.id)}
            className="bg-white border border-slate-200 rounded-none p-3 flex items-center justify-between shadow-none hover:border-slate-400 transition-colors cursor-pointer"
          >
            <div className="flex items-center space-x-2.5">
              <div className="p-2 bg-slate-100 text-slate-800 rounded-none border border-slate-200">
                <Icon className="w-4 h-4" />
              </div>
              <div>
                <div className="text-lg font-bold text-slate-900 tracking-tight leading-none font-mono">
                  {card.value}
                </div>
                <div className="text-xs font-semibold text-slate-800 mt-1 leading-tight">
                  {card.title}
                </div>
                <div className={`text-[10.5px] mt-0.5 leading-tight ${card.subTextColor}`}>
                  {card.subText}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default UniversityStatCards;
