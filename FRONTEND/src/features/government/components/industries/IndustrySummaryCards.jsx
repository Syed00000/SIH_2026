import React from 'react';
import { Users, IndianRupee, FolderCheck } from 'lucide-react';

export const IndustrySummaryCards = ({ stats }) => {
  const activeCount = stats?.activeIndustries ?? 0;
  const totalCount = stats?.totalIndustries ?? 0;
  const totalCsrCr = typeof stats?.totalCsrFundsCr === 'number' ? stats.totalCsrFundsCr : 0;
  const supportedProjects = stats?.supportedProjects ?? 0;

  // Real Dynamic CSR Trend Heights (proportional from database top contributors)
  const csrValues = Array.isArray(stats?.csrTrend) && stats.csrTrend.length > 0
    ? stats.csrTrend.slice(0, 4)
    : [18.5, 12.0, 9.4, 6.8];
  const maxCsr = Math.max(...csrValues, 1);
  const csrBarHeights = csrValues.map((v) => Math.max(4, Math.round((v / maxCsr) * 20)));

  const cards = [
    {
      id: 'active',
      title: 'Active Partners',
      value: activeCount,
      subtitle: totalCount > activeCount ? `${activeCount}/${totalCount} Operational` : 'MSME Corp. Status',
      icon: Users,
      iconBg: 'bg-emerald-50 text-emerald-600',
      sparklineType: 'line'
    },
    {
      id: 'csr_funds',
      title: 'CSR & Innovation Funds',
      value: `₹${totalCsrCr.toFixed(2)} Cr`,
      subtitle: 'Total Committed',
      icon: IndianRupee,
      iconBg: 'bg-emerald-50 text-emerald-600',
      sparklineType: 'bars',
      barHeights: csrBarHeights
    },
    {
      id: 'supported_projects',
      title: 'Supported Projects',
      value: supportedProjects,
      subtitle: 'Across Domains',
      icon: FolderCheck,
      iconBg: 'bg-emerald-50 text-emerald-600',
      sparklineType: 'wave'
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
              {/* Left Circular Icon */}
              <div
                className={`w-11 h-11 rounded-full ${card.iconBg} flex items-center justify-center shrink-0`}
              >
                <IconComponent className="w-5 h-5" />
              </div>

              {/* Right Content */}
              <div className="text-right flex-1 pl-3 min-w-0">
                <span className="text-xs font-semibold text-slate-500 block truncate">
                  {card.title}
                </span>
                <div className="text-2xl font-bold text-slate-900 tracking-tight leading-tight mt-0.5">
                  {card.value}
                </div>
                <span className="text-[11px] font-medium text-slate-400 block truncate mt-0.5">
                  {card.subtitle}
                </span>
              </div>
            </div>

            {/* Bottom Mini Sparkline Graphic matching Reference */}
            <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-end">
              {card.sparklineType === 'line' && (
                <svg className="w-24 h-5 text-emerald-500" viewBox="0 0 100 20" fill="none">
                  <path
                    d="M0 16 L20 14 L40 17 L60 8 L80 12 L100 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
              {card.sparklineType === 'wave' && (
                <svg className="w-24 h-5 text-emerald-500" viewBox="0 0 100 20" fill="none">
                  <path
                    d="M0 12 L20 16 L40 10 L60 15 L80 6 L100 11"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
              {card.sparklineType === 'bars' && (
                <div className="flex items-end space-x-1 h-5">
                  {card.barHeights.map((h, i) => (
                    <span
                      key={i}
                      style={{ height: `${h}px` }}
                      className="w-1.5 bg-emerald-500 rounded-xs transition-all duration-300"
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default IndustrySummaryCards;
