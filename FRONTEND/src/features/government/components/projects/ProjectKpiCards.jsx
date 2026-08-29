import React from 'react';
import {
  Layers,
  FileCheck,
  Award,
  PlayCircle,
  Rocket,
  CheckCircle2
} from 'lucide-react';

export const ProjectKpiCards = ({ kpis = {}, onKpiClick, activeFilter }) => {
  const safeKpis = kpis || {};

  const cards = [
    {
      id: 'total_challenges',
      title: 'Total Challenges',
      value: safeKpis.totalChallenges || 0,
      color: 'text-slate-900',
      icon: Layers
    },
    {
      id: 'solution_proposals',
      title: 'Solution Proposals',
      value: safeKpis.solutionProposals || 0,
      color: 'text-slate-900',
      icon: FileCheck
    },
    {
      id: 'projects_approved',
      title: 'Projects Approved',
      value: safeKpis.projectsApproved || 0,
      color: 'text-slate-900',
      icon: Award
    },
    {
      id: 'in_progress',
      title: 'In Progress',
      value: safeKpis.inProgress || 0,
      color: 'text-slate-900',
      icon: PlayCircle
    },
    {
      id: 'deployed',
      title: 'Deployed',
      value: safeKpis.deployed || 0,
      color: 'text-slate-900',
      icon: Rocket
    },
    {
      id: 'completed',
      title: 'Completed',
      value: safeKpis.completed || 0,
      color: 'text-slate-900',
      icon: CheckCircle2
    }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 select-none">
      {cards.map((card) => {
        const isActive = activeFilter === card.id || 
          (activeFilter === 'recent_proposals' && card.id === 'solution_proposals') ||
          (activeFilter === 'in_progress' && card.id === 'in_progress') ||
          (activeFilter === 'deployment' && card.id === 'deployed');

        return (
          <div
            key={card.id}
            onClick={() => onKpiClick && onKpiClick(card.id)}
            className={`bg-white border rounded-xl px-5 py-4.5 transition-all duration-150 cursor-pointer shadow-3xs flex flex-col justify-between h-22 ${
              isActive ? 'border-slate-800 ring-2 ring-slate-800/80 shadow-2xs' : 'border-slate-200/80 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400">
                {card.title}
              </span>
              {card.icon && <card.icon className="w-3.5 h-3.5 text-slate-400" />}
            </div>
            <div className={`text-xl md:text-2xl font-black ${card.color} tracking-tight mt-1.5`}>
              {card.value}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProjectKpiCards;
