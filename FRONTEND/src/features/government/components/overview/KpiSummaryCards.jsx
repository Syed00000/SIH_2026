import React from 'react';
import { ClipboardList, Building2, IndianRupee, CheckCircle2, TrendingUp } from 'lucide-react';

export const KpiSummaryCards = ({ kpis }) => {
  const cards = [
    {
      title: 'Problems Received',
      value: kpis?.problemsReceived?.value || '0',
      growth: kpis?.problemsReceived?.growthText || 'Total Inflow',
      icon: ClipboardList,
      accentColor: '#3b82f6',
      bgLight: 'bg-blue-50/70 text-blue-700 border-blue-100',
      indicator: 'Total Inflow'
    },
    {
      title: 'Active HEIs',
      value: kpis?.activeHeis?.value || '0',
      growth: kpis?.activeHeis?.growthText || 'Accredited HEIs',
      icon: Building2,
      accentColor: '#8b5cf6',
      bgLight: 'bg-purple-50/70 text-purple-700 border-purple-100',
      indicator: 'All 24 Districts'
    },
    {
      title: 'CSR Funds Committed',
      value: kpis?.csrFunds?.value || '₹0.00 Cr',
      growth: kpis?.csrFunds?.growthText || 'Committed Funds',
      icon: IndianRupee,
      accentColor: '#f59e0b',
      bgLight: 'bg-amber-50/70 text-amber-700 border-amber-100',
      indicator: 'Govt. Approved'
    },
    {
      title: 'Problems Solved',
      value: kpis?.problemsSolved?.value || kpis?.solvedProblems?.value || '0',
      growth: kpis?.problemsSolved?.growthText || 'Verified Solutions',
      icon: CheckCircle2,
      accentColor: '#10b981',
      bgLight: 'bg-emerald-50/70 text-emerald-700 border-emerald-100',
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
            className="bg-white border border-slate-200/80 hover:border-slate-300/90 rounded-xl p-4 shadow-[0_1px_3px_rgba(15,23,42,0.03)] hover:shadow-[0_8px_24px_-6px_rgba(15,23,42,0.07)] transition-all duration-300 flex flex-col justify-between relative overflow-hidden group"
          >
            {/* Top Row: Icon & Status Tag */}
            <div className="flex items-center justify-between mb-2.5">
              <IconComponent className="w-5 h-5 text-slate-700 transition-colors group-hover:text-slate-900" />
              <span className="text-[9.5px] font-bold text-slate-400 bg-slate-50 border border-slate-200/60 px-2 py-0.5 rounded-full uppercase tracking-wider">
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
            <div className="flex items-center space-x-1.5 pt-2.5 mt-2 border-t border-slate-100 text-[11px] font-bold text-emerald-600">
              <TrendingUp className="w-3.5 h-3.5 shrink-0" />
              <span>{card.growth}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default KpiSummaryCards;
