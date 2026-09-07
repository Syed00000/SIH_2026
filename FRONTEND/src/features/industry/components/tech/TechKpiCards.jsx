import React from 'react';
import { FolderGit2, Lock, CheckCircle2, Clock } from 'lucide-react';

export const TechKpiCards = ({ eligibleProblems = [] }) => {
  const totalCount = eligibleProblems.length;
  const lockedCount = eligibleProblems.filter((p) => p.quoteStatus === 'Accepted').length;
  const grantedCount = eligibleProblems.filter((p) => (p.grantedTechHelp?.length || 0) > 0).length;
  const awaitingCount = Math.max(0, totalCount - grantedCount);

  const cards = [
    {
      title: 'Submitted Prototypes & Problems',
      value: totalCount,
      sub: 'Sanctioned for Tech Transfer',
      icon: FolderGit2,
      textColor: 'text-[#007A61]',
      bgColor: 'bg-emerald-50'
    },
    {
      title: 'Fee Locked by University',
      value: lockedCount,
      sub: 'Proposal & Lab Fee Accepted',
      icon: Lock,
      textColor: 'text-amber-700',
      bgColor: 'bg-amber-50'
    },
    {
      title: 'Lab Access Dispatched',
      value: grantedCount,
      sub: 'Official Access ID Key Issued',
      icon: CheckCircle2,
      textColor: 'text-blue-700',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Awaiting Lab Key Dispatch',
      value: awaitingCount,
      sub: 'Action Ready for Tech Grant',
      icon: Clock,
      textColor: 'text-purple-700',
      bgColor: 'bg-purple-50'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs hover:shadow-xs transition-all flex items-center justify-between"
          >
            <div className="space-y-1 text-left">
              <p className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wider">{card.title}</p>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">{card.value}</h3>
              <p className="text-[10px] text-slate-400 font-medium">{card.sub}</p>
            </div>
            <div className={`w-11 h-11 rounded-2xl ${card.bgColor} ${card.textColor} flex items-center justify-center shrink-0 shadow-2xs`}>
              <Icon className="w-5 h-5" />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TechKpiCards;
