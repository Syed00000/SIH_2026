import React from 'react';
import { Building2, CheckCircle2, Clock } from 'lucide-react';
import { Skeleton } from '../../../../shared/components/ui/skeleton.jsx';

export const IndustrySummaryCards = ({ stats, kpis, isLoading }) => {
  const data = kpis || stats || {};
  const totalCount = data.totalIndustries ?? 0;
  const activeCount = data.activeIndustries ?? 0;
  const pendingCount = data.pendingReview ?? 0;

  const cards = [
    {
      id: 'total',
      title: 'Total Registered',
      value: totalCount,
      subtitle: 'All Applied & Onboarded',
      icon: Building2,
      iconColor: 'text-blue-600'
    },
    {
      id: 'active',
      title: 'Approved & Active',
      value: activeCount,
      subtitle: 'Verified Partner Entities',
      icon: CheckCircle2,
      iconColor: 'text-emerald-600'
    },
    {
      id: 'pending',
      title: 'Pending Review',
      value: pendingCount,
      subtitle: 'Awaiting Govt. Approval',
      icon: Clock,
      iconColor: 'text-amber-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 select-none">
      {isLoading ? (
        [...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-[104px] w-full rounded-lg" />
        ))
      ) : (
        cards.map((card) => {
          const IconComponent = card.icon;
          return (
            <div
              key={card.id}
              className="bg-white border border-slate-200/90 rounded-lg p-4 shadow-2xs flex flex-col justify-between min-h-[96px] hover:border-slate-300 transition-colors"
            >
              {/* Top row: Label & Bare Icon */}
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  {card.title}
                </span>
                <div className={`flex items-center justify-center ${card.iconColor}`}>
                  <IconComponent className="w-4 h-4" />
                </div>
              </div>

              {/* Bottom row: Value & Subtitle */}
              <div className="mt-2">
                <div className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  {card.value}
                </div>
                <span className="text-[11px] font-medium text-slate-400 block truncate mt-0.5">
                  {card.subtitle}
                </span>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default IndustrySummaryCards;
