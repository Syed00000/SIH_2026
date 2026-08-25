import React from 'react';
import { ClipboardList, Building2, IndianRupee, CheckCircle2 } from 'lucide-react';

export const KpiSummaryCards = ({ kpis }) => {
  const cards = [
    {
      title: "Problems Received",
      value: kpis?.problemsReceived?.value || "12,450",
      growth: kpis?.problemsReceived?.growthText || "+320 this week",
      icon: ClipboardList
    },
    {
      title: "Active HEIs",
      value: kpis?.activeHeis?.value || "340",
      growth: kpis?.activeHeis?.growthText || "+18 this month",
      icon: Building2
    },
    {
      title: "CSR Funds Committed",
      value: kpis?.csrFunds?.value || "₹4.2 Cr",
      growth: kpis?.csrFunds?.growthText || "+₹1.1 Cr this month",
      icon: IndianRupee
    },
    {
      title: "Problems Solved",
      value: kpis?.problemsSolved?.value || kpis?.solvedProblems?.value || "10,850",
      growth: kpis?.problemsSolved?.growthText || "+410 this week",
      icon: CheckCircle2
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {cards.map((card, idx) => {
        const IconComponent = card.icon;
        return (
          <div
            key={idx}
            className="bg-white border border-slate-200/90 rounded-2xl p-3.5 shadow-xs hover:shadow-sm transition-all duration-200 flex items-center space-x-3.5"
          >
            {/* Left Icon - Clean with NO colorful background */}
            <div className="w-10 h-10 flex items-center justify-center shrink-0 text-slate-700">
              <IconComponent className="w-5 h-5 text-slate-800" />
            </div>

            {/* Right Text Content */}
            <div className="space-y-0.5 min-w-0">
              <div className="text-2xl font-bold tracking-tight text-slate-900 leading-none">
                {card.value}
              </div>
              <div className="text-xs font-medium text-slate-500 truncate">
                {card.title}
              </div>
              <div className="flex items-center text-[11px] font-semibold text-emerald-600">
                <span>{card.growth}</span>
                <span className="ml-1">↑</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default KpiSummaryCards;
