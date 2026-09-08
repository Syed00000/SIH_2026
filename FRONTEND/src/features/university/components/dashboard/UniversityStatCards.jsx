import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export const UniversityStatCards = ({ kpis, onCardClick, loading = false }) => {
  if (loading || !kpis) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 select-none">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-md border border-slate-200 p-4 h-24 animate-pulse flex flex-col shadow-sm">
            <div className="h-1 bg-slate-100 rounded-full w-1/3 mb-3"></div>
            <div className="h-3 bg-slate-200 rounded w-1/2 mb-2"></div>
            <div className="h-6 bg-slate-100 rounded w-3/4"></div>
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
      icon: (
        <svg className="w-4 h-4 text-[#007A61]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      )
    },
    {
      id: 'projects',
      title: 'Active R&D Projects',
      value: kpis?.activeProjects?.total ?? 8,
      icon: (
        <svg className="w-4 h-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      )
    },
    {
      id: 'approvals',
      title: 'Pending Action',
      value: kpis?.pendingApprovals?.total ?? 3,
      icon: (
        <svg className="w-4 h-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      )
    },
    {
      id: 'grants',
      title: 'Sanctioned Funds',
      value: kpis?.totalGrants?.value ?? '₹ 31,140',
      icon: (
        <svg className="w-4 h-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      )
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 select-none">
      {cards.map((card) => {
        return (
          <div
            key={card.id}
            onClick={() => onCardClick && onCardClick(card.id)}
            className="bg-white rounded-2xl border border-slate-100 p-5 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.03)] hover:shadow-md transition-all cursor-pointer relative flex flex-col justify-between h-[120px]"
          >
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-semibold text-slate-500 tracking-wide font-sans">
                {card.title}
              </span>
              <div className="w-7 h-7 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-100">
                {card.icon}
              </div>
            </div>
            
            <div className="mt-2 flex flex-col justify-end flex-1 pb-1">
              <div className="text-[26px] font-bold text-slate-800 tracking-tight font-sans leading-none">
                {card.value}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default UniversityStatCards;
