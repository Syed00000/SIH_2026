import React from 'react';
import {
  Layers,
  CheckCircle2,
  Building,
  Clock,
  ArrowRight,
  HelpCircle
} from 'lucide-react';

export const NodalStatCards = ({ stats = {}, onCardClick }) => {
  const cards = [
    {
      id: 'All Status',
      title: 'Total Citizen Submissions',
      value: stats.total || 0,
      subtext: 'Ground issues across 24 districts',
      actionText: 'View All Problems',
      icon: Layers
    },
    {
      id: 'Under Review',
      title: 'Awaiting Nodal Triage',
      value: stats.underReview || stats.submitted || 0,
      subtext: 'Pending initial screening',
      actionText: 'Triage Pending',
      icon: Clock
    },
    {
      id: 'Clarification Requested',
      title: 'Clarifications Pending',
      value: stats.clarificationRequested || 0,
      subtext: 'Queries from HEI research desks',
      actionText: 'Review Queries',
      icon: HelpCircle,
      highlight: (stats.clarificationRequested || 0) > 0
    },
    {
      id: 'In Progress',
      title: 'Allocated to Universities',
      value: stats.inProgress || 0,
      subtext: 'Active HEI research & pilots',
      actionText: 'Explore Allocations',
      icon: Building
    },
    {
      id: 'Resolved',
      title: 'Field Verified & Resolved',
      value: stats.resolved || 0,
      subtext: 'Completed solutions on ground',
      actionText: 'View Resolved',
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
            onClick={() => onCardClick && onCardClick(card.id)}
            className={`group bg-white border ${
              card.highlight ? 'border-amber-400 bg-amber-50/20 ring-1 ring-amber-300' : 'border-slate-200/90 hover:border-slate-300'
            } rounded-2xl p-4 shadow-2xs transition-all duration-150 flex flex-col justify-between cursor-pointer`}
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
                  <span className="text-[10px] font-bold font-mono bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full border border-amber-300">
                    Action
                  </span>
                )}
              </div>
            </div>

            <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
              <span className="text-slate-500 font-medium truncate">{card.subtext}</span>
              <span className="font-bold text-slate-800 group-hover:text-slate-900 group-hover:translate-x-0.5 transition-all flex items-center space-x-0.5 shrink-0 ml-1">
                <span>{card.actionText}</span>
                <ArrowRight className="w-3 h-3 text-slate-500" />
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default NodalStatCards;
