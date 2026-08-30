import React from 'react';
import { Folder, Rocket, Users, ClipboardCheck, Handshake, ArrowUpRight } from 'lucide-react';

export const UniversityStatCards = ({ kpis, onCardClick, loading = false }) => {
  if (loading || !kpis) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 select-none">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="bg-white border border-slate-200/90 rounded-xl p-3.5 h-20 animate-pulse flex items-center space-x-3 shadow-2xs">
            <div className="w-10 h-10 bg-slate-100 rounded-lg"></div>
            <div className="space-y-1.5 flex-1">
              <div className="h-4 bg-slate-200 rounded w-1/3"></div>
              <div className="h-2.5 bg-slate-100 rounded w-3/4"></div>
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
      subText: `${kpis?.assignedChallenges?.reviewNeeded ?? 0} require review`,
      icon: Folder,
      accentBg: 'bg-emerald-50 border-emerald-200 text-[#007A61]',
      badgeBg: 'bg-emerald-100/70 text-[#007A61]',
      hoverBorder: 'hover:border-[#007A61]/50'
    },
    {
      id: 'projects',
      title: 'Active R&D Projects',
      value: kpis?.activeProjects?.total ?? 0,
      subText: `${kpis?.activeProjects?.delayed ?? 0} on track`,
      icon: Rocket,
      accentBg: 'bg-emerald-50 border-emerald-200 text-[#007A61]',
      badgeBg: 'bg-emerald-100/70 text-[#007A61]',
      hoverBorder: 'hover:border-[#007A61]/50'
    },
    {
      id: 'faculty',
      title: 'Faculty Mentors',
      value: kpis?.facultyMentors?.total ?? 0,
      subText: `${kpis?.facultyMentors?.onLeave ?? 0} active`,
      icon: Users,
      accentBg: 'bg-slate-50 border-slate-200 text-slate-800',
      badgeBg: 'bg-slate-100/70 text-slate-900',
      hoverBorder: 'hover:border-slate-400'
    },
    {
      id: 'approvals',
      title: 'Pending Action',
      value: kpis?.pendingApprovals?.total ?? 0,
      subText: kpis?.pendingApprovals?.note || 'Action required',
      icon: ClipboardCheck,
      accentBg: 'bg-amber-50 border-amber-200 text-amber-800',
      badgeBg: 'bg-amber-100/70 text-amber-900',
      hoverBorder: 'hover:border-amber-500/50'
    },
    {
      id: 'partners',
      title: 'Industry Partners',
      value: kpis?.industryPartners?.total ?? 0,
      subText: kpis?.industryPartners?.note || 'Active CSR MoUs',
      icon: Handshake,
      accentBg: 'bg-emerald-50 border-emerald-200 text-[#007A61]',
      badgeBg: 'bg-emerald-100/70 text-[#007A61]',
      hoverBorder: 'hover:border-[#007A61]/50'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 select-none">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.id}
            onClick={() => onCardClick && onCardClick(card.id)}
            className={`bg-white border border-slate-200/90 rounded-xl p-3.5 flex items-center justify-between shadow-2xs hover:shadow-md ${card.hoverBorder} transition-all cursor-pointer group`}
          >
            <div className="flex items-center space-x-3 min-w-0">
              <div className={`p-2.5 rounded-lg border ${card.accentBg} shrink-0 transition-transform group-hover:scale-105`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-xl font-black text-slate-900 tracking-tight font-mono leading-none">
                  {card.value}
                </div>
                <div className="text-xs font-bold text-slate-800 mt-1 truncate leading-tight">
                  {card.title}
                </div>
                <div className="text-[10.5px] text-slate-500 font-medium mt-0.5 truncate leading-tight">
                  {card.subText}
                </div>
              </div>
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-slate-700 transition-colors shrink-0 self-start mt-0.5" />
          </div>
        );
      })}
    </div>
  );
};

export default UniversityStatCards;
