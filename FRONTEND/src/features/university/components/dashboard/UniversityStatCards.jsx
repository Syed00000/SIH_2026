import React from 'react';
import { Folder, Rocket, Users, ClipboardCheck, Handshake, ArrowUpRight, IndianRupee } from 'lucide-react';

export const UniversityStatCards = ({ kpis, onCardClick, loading = false }) => {
  if (loading || !kpis) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 select-none">
        {[1, 2, 3, 4, 5, 6].map((i) => (
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
      value: kpis?.assignedChallenges?.total ?? 12,
      subText: `${kpis?.assignedChallenges?.reviewNeeded ?? 2} require review`,
      icon: Folder
    },
    {
      id: 'projects',
      title: 'Active R&D Projects',
      value: kpis?.activeProjects?.total ?? 8,
      subText: `${kpis?.activeProjects?.onTrack ?? 0} on track`,
      icon: Rocket
    },
    {
      id: 'faculty',
      title: 'Faculty Mentors',
      value: kpis?.facultyMentors?.total ?? 0,
      subText: `${kpis?.facultyMentors?.active ?? 0} active`,
      icon: Users
    },
    {
      id: 'grants',
      title: 'Sanctioned Funds',
      value: kpis?.totalGrants?.value ?? '₹ 0',
      subText: kpis?.totalGrants?.note || 'Disbursed Grants',
      icon: IndianRupee
    },
    {
      id: 'approvals',
      title: 'Pending Action',
      value: kpis?.pendingApprovals?.total ?? 3,
      subText: kpis?.pendingApprovals?.note || 'Action required',
      icon: ClipboardCheck,
      isPending: (kpis?.pendingApprovals?.total ?? 3) > 0
    },
    {
      id: 'partners',
      title: 'Industry Partners',
      value: kpis?.industryPartners?.total ?? 2,
      subText: kpis?.industryPartners?.note || 'Active CSR MoUs',
      icon: Handshake
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 select-none">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.id}
            onClick={() => onCardClick && onCardClick(card.id)}
            className="bg-white border border-slate-200/90 hover:border-slate-300 rounded-xl p-3.5 flex items-center justify-between shadow-2xs transition-all cursor-pointer group"
          >
            <div className="flex items-center space-x-3 min-w-0">
              <div
                className={`p-2.5 rounded-lg border shrink-0 ${
                  card.isPending
                    ? 'bg-amber-50 border-amber-200 text-amber-800'
                    : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
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
