import React from 'react';
import {
  Layers,
  CheckCircle2,
  Building,
  Clock,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  HelpCircle
} from 'lucide-react';

export const NodalStatCards = ({ stats = {}, onCardClick }) => {
  const cards = [
    {
      id: 'all',
      title: 'Total Citizen Submissions',
      value: stats.total || 0,
      subtext: 'Ground issues across 24 districts',
      actionText: 'View All Problems',
      icon: Layers,
      accentColor: 'text-slate-900',
      iconColor: 'text-slate-600'
    },
    {
      id: 'review',
      title: 'Awaiting Nodal Triage',
      value: stats.underReview || stats.submitted || 0,
      subtext: 'Pending initial screening',
      actionText: 'Triage Pending',
      icon: Clock,
      accentColor: 'text-slate-800',
      iconColor: 'text-slate-600'
    },
    {
      id: 'clarifications',
      title: 'Clarifications Pending',
      value: stats.clarificationRequested || 0,
      subtext: 'Queries from HEI research desks',
      actionText: 'Review Queries',
      icon: HelpCircle,
      accentColor: 'text-amber-800',
      iconColor: 'text-amber-600',
      highlight: (stats.clarificationRequested || 0) > 0
    },
    {
      id: 'assigned',
      title: 'Allocated to Universities',
      value: stats.inProgress || 0,
      subtext: 'Active HEI research & pilots',
      actionText: 'Explore Allocations',
      icon: Building,
      accentColor: 'text-[#047857]',
      iconColor: 'text-[#047857]'
    },
    {
      id: 'resolved',
      title: 'Field Verified & Resolved',
      value: stats.resolved || 0,
      subtext: 'Completed solutions on ground',
      actionText: 'View Resolved',
      icon: CheckCircle2,
      accentColor: 'text-emerald-800',
      iconColor: 'text-emerald-600'
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
              card.highlight ? 'border-amber-400 bg-amber-50/30 ring-1 ring-amber-300' : 'border-slate-200/90 hover:border-emerald-400/80'
            } rounded-xl p-4 shadow-2xs hover:shadow-xs transition-all duration-150 flex flex-col justify-between cursor-pointer`}
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500 leading-tight">{card.title}</span>
                <Icon className={`w-4 h-4 ${card.iconColor} shrink-0`} />
              </div>
              <div className={`text-2xl sm:text-3xl font-black ${card.accentColor} mt-2 tracking-tight flex items-baseline justify-between`}>
                <span>{card.value}</span>
                {card.highlight && (
                  <span className="text-[10px] font-bold font-mono bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full border border-amber-300 animate-pulse">
                    Action
                  </span>
                )}
              </div>
            </div>

            <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
              <span className="text-slate-500 font-medium truncate">{card.subtext}</span>
              <span className="font-bold text-[#047857] group-hover:translate-x-0.5 transition-transform flex items-center space-x-0.5 shrink-0 ml-1">
                <span>{card.actionText}</span>
                <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default NodalStatCards;
