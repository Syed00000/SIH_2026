import React from 'react';
import { Building2, CheckCircle2, Clock } from 'lucide-react';

export const IndustrySummaryCards = ({ stats }) => {
  const totalCount = stats?.totalIndustries ?? 0;
  const activeCount = stats?.activeIndustries ?? 0;
  const pendingCount = stats?.pendingReview ?? 0;

  const cards = [
    {
      id: 'total',
      title: 'Total Registered',
      value: totalCount,
      subtitle: 'All Applied & Onboarded',
      icon: Building2,
      iconBg: 'bg-blue-50 text-blue-700 border-blue-100',
      valueColor: 'text-slate-900'
    },
    {
      id: 'active',
      title: 'Approved & Active',
      value: activeCount,
      subtitle: 'Verified Partner Entities',
      icon: CheckCircle2,
      iconBg: 'bg-emerald-50 text-emerald-700 border-emerald-100',
      valueColor: 'text-emerald-700'
    },
    {
      id: 'pending',
      title: 'Pending Review',
      value: pendingCount,
      subtitle: 'Awaiting Govt. Approval',
      icon: Clock,
      iconBg: 'bg-amber-50 text-amber-700 border-amber-100',
      valueColor: 'text-amber-700'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {cards.map((card) => {
        const IconComponent = card.icon;
        return (
          <div
            key={card.id}
            className="bg-white rounded-xl border border-slate-200/90 p-4.5 flex flex-col justify-between shadow-2xs hover:border-slate-300 transition-all"
          >
            <div className="flex items-start justify-between">
              {/* Left Icon */}
              <div
                className={`w-10 h-10 rounded-xl ${card.iconBg} border flex items-center justify-center shrink-0`}
              >
                <IconComponent className="w-5 h-5" />
              </div>

              {/* Right Content */}
              <div className="text-right flex-1 pl-3 min-w-0">
                <span className="text-xs font-semibold text-slate-500 block truncate">
                  {card.title}
                </span>
                <div className={`text-2xl font-bold tracking-tight leading-tight mt-0.5 ${card.valueColor}`}>
                  {card.value}
                </div>
                <span className="text-[11px] font-medium text-slate-400 block truncate mt-0.5">
                  {card.subtitle}
                </span>
              </div>
            </div>

            {/* Bottom Indicator */}
            <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
              <span className="text-slate-400 font-medium">Status</span>
              <span className="font-bold text-slate-600">
                {totalCount > 0 ? `${Math.round((card.value / totalCount) * 100)}% of total` : '0%'}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default IndustrySummaryCards;
