import React from 'react';
import { ClipboardList, Building2, IndianRupee, CheckCircle2, TrendingUp } from 'lucide-react';

export const KpiSummaryCards = ({ kpis }) => {
  const cards = [
    {
      title: 'Problems Received',
      value: kpis?.problemsReceived?.value || '0',
      growth: kpis?.problemsReceived?.growthText || 'Total Inflow',
      icon: ClipboardList,
      indicator: 'Total Inflow'
    },
    {
      title: 'Active HEIs',
      value: kpis?.activeHeis?.value || '0',
      growth: kpis?.activeHeis?.growthText || 'Accredited HEIs',
      icon: Building2,
      indicator: 'All 24 Districts'
    },
    {
      title: 'CSR Funds Committed',
      value: kpis?.csrFunds?.value || '₹0.00 Cr',
      growth: kpis?.csrFunds?.growthText || 'Committed Funds',
      icon: IndianRupee,
      indicator: 'Govt. Approved'
    },
    {
      title: 'Problems Solved',
      value: kpis?.problemsSolved?.value || kpis?.solvedProblems?.value || '0',
      growth: kpis?.problemsSolved?.growthText || 'Verified Solutions',
      icon: CheckCircle2,
      indicator: 'Resolution Rate'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {cards.map((card, idx) => {
        const IconComponent = card.icon;
        return (
          <div
            key={idx}
            className="bg-white border border-slate-200/90 hover:border-slate-300 rounded-xl p-4 shadow-2xs transition-all duration-200 flex flex-col justify-between group"
          >
            {/* Top Row: Icon & Status Tag */}
            <div className="flex items-center justify-between mb-2.5">
              <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
                <IconComponent className="w-4 h-4" />
              </div>
              <span className="text-[9.5px] font-bold text-slate-500 bg-slate-50 border border-slate-200/80 px-2 py-0.5 rounded-full uppercase tracking-wider">
                {card.indicator}
              </span>
            </div>

            {/* Middle Row: Numbers & Title */}
            <div className="space-y-1 my-0.5">
              <div className="text-2xl font-black tracking-tight text-slate-900 leading-none">
                {card.value}
              </div>
              <div className="text-xs font-semibold text-slate-500 truncate">
                {card.title}
              </div>
            </div>

            {/* Bottom Row: Growth Badge */}
            <div className="flex items-center space-x-1.5 pt-2.5 mt-2 border-t border-slate-100 text-[11px] font-semibold text-slate-600">
              <TrendingUp className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span>{card.growth}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default KpiSummaryCards;
