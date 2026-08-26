import React from 'react';
import {
  Layers,
  FileCheck,
  Award,
  PlayCircle,
  Rocket,
  CheckCircle2,
  TrendingUp
} from 'lucide-react';

export const ProjectKpiCards = ({ kpis, onKpiClick, activeFilter }) => {
  const cards = [
    {
      id: 'total_challenges',
      title: 'Total Challenges',
      value: kpis.totalChallenges || 124,
      change: kpis.totalChallengesChange || '+12 this month',
      icon: Layers,
      accentColor: 'text-slate-900',
      badgeBg: 'bg-slate-100 text-slate-700'
    },
    {
      id: 'solution_proposals',
      title: 'Solution Proposals',
      value: kpis.solutionProposals || 86,
      change: kpis.solutionProposalsChange || '+8 this month',
      icon: FileCheck,
      accentColor: 'text-emerald-700',
      badgeBg: 'bg-emerald-50 text-emerald-700'
    },
    {
      id: 'projects_approved',
      title: 'Projects Approved',
      value: kpis.projectsApproved || 42,
      change: kpis.projectsApprovedChange || '+6 this month',
      icon: Award,
      accentColor: 'text-slate-900',
      badgeBg: 'bg-slate-100 text-slate-700'
    },
    {
      id: 'in_progress',
      title: 'In Progress',
      value: kpis.inProgress || 28,
      change: kpis.inProgressChange || 'Active R&D',
      icon: PlayCircle,
      accentColor: 'text-amber-700',
      badgeBg: 'bg-amber-50 text-amber-700'
    },
    {
      id: 'deployed',
      title: 'Deployed',
      value: kpis.deployed || 11,
      change: kpis.deployedChange || '+2 this month',
      icon: Rocket,
      accentColor: 'text-blue-700',
      badgeBg: 'bg-blue-50 text-blue-700'
    },
    {
      id: 'completed',
      title: 'Completed',
      value: kpis.completed || 7,
      change: kpis.completedChange || '+1 this month',
      icon: CheckCircle2,
      accentColor: 'text-emerald-700',
      badgeBg: 'bg-emerald-50 text-emerald-700'
    }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 select-none">
      {cards.map((card) => {
        const Icon = card.icon;
        const isActive = activeFilter === card.id;

        return (
          <div
            key={card.id}
            onClick={() => onKpiClick && onKpiClick(card.id)}
            className={`bg-white border rounded-2xl p-4 transition-all duration-150 cursor-pointer shadow-2xs hover:shadow-xs hover:border-slate-300 flex flex-col justify-between ${
              isActive ? 'border-slate-900 ring-1 ring-slate-900' : 'border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider line-clamp-1">
                {card.title}
              </span>
              <div className="p-1 rounded-lg bg-slate-50 border border-slate-100 text-slate-700">
                <Icon className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="mt-3">
              <div className="text-2xl font-black text-slate-900 tracking-tight">
                {card.value}
              </div>
              <div className="flex items-center space-x-1 mt-1">
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${card.badgeBg}`}>
                  {card.change}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProjectKpiCards;
