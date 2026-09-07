import React from 'react';
import {
  Layers,
  CheckCircle2,
  Building,
  Clock,
  HelpCircle
} from 'lucide-react';

export const NodalStatCards = ({ stats = {} }) => {
  const cards = [
    {
      id: 'All Status',
      title: 'Total Citizen Submissions',
      value: stats.total || 0,
      subtext: 'Ground issues across 24 districts',
      icon: Layers
    },
    {
      id: 'Under Review',
      title: 'Awaiting Nodal Triage',
      value: stats.underReview || stats.submitted || 0,
      subtext: 'Pending initial screening',
      icon: Clock
    },
    {
      id: 'Clarification Requested',
      title: 'Clarifications Pending',
      value: stats.clarificationRequested || 0,
      subtext: 'Queries from HEI research desks',
      icon: HelpCircle,
      highlight: (stats.clarificationRequested || 0) > 0
    },
    {
      id: 'In Progress',
      title: 'Allocated to Universities',
      value: stats.inProgress || 0,
      subtext: 'Active HEI research & pilots',
      icon: Building
    },
    {
      id: 'Resolved',
      title: 'Field Verified & Resolved',
      value: stats.resolved || 0,
      subtext: 'Completed solutions on ground',
      icon: CheckCircle2
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 select-none text-left">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.id}
            className={`bg-white border ${
              card.highlight ? 'border-amber-400 bg-amber-50/20 ring-1 ring-amber-300' : 'border-slate-200/90'
            } rounded-md p-4 shadow-2xs transition-all duration-150 flex flex-col justify-between cursor-default`}
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500 leading-tight">{card.title}</span>
                <Icon className={`w-4.5 h-4.5 stroke-[2] ${
                  card.highlight ? 'text-amber-700' : 'text-slate-600'
                }`} />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-2 tracking-tight flex items-baseline justify-between">
                <span>{card.value}</span>
                {card.highlight && (
                  <span className="text-[10px] font-bold font-mono bg-amber-100 text-amber-900 px-2 py-0.5 rounded-md border border-amber-300">
                    Action
                  </span>
                )}
              </div>
            </div>

            <div className="mt-3 pt-2.5 border-t border-slate-100 text-[11px] text-slate-500 font-medium leading-normal">
              <span>{card.subtext}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default NodalStatCards;
