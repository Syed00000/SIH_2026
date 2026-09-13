import React from 'react';
import { FileText, Clock, Edit3, Users } from 'lucide-react';
import { Card } from '../../../../shared/components/ui/card.jsx';
import { Badge } from '../../../../shared/components/ui/badge.jsx';

export const TriageHeaderStats = ({ triageCount = 0, overrideCount = 0, clusterCount = 0, avgConfidence = 0 }) => {
  const stats = [
    {
      title: 'Active Triage Queue',
      value: String(triageCount),
      subtext: `Auto-Classified: ${triageCount} | Manual: ${overrideCount}`,
      badge: 'Real-time Stream',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      icon: FileText,
      iconColor: 'text-[#007A61] bg-[#007A61]/10'
    },
    {
      title: 'Confidence Level',
      value: avgConfidence > 0 ? `${avgConfidence}%` : '—',
      subtext: avgConfidence > 0 ? `Avg Model Score: ${avgConfidence}%` : 'Awaiting Inflow',
      badge: 'Model Inference',
      badgeColor: 'bg-[#007A61]/10 text-[#007A61] border-[#007A61]/20',
      icon: Clock,
      iconColor: 'text-emerald-600 bg-emerald-50'
    },
    {
      title: 'Manual Overrides',
      value: String(overrideCount),
      subtext: `${overrideCount} Overrides Logged`,
      badge: 'Audit Active',
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
      icon: Edit3,
      iconColor: 'text-amber-600 bg-amber-50'
    },
    {
      title: 'Duplicate Clusters',
      value: String(clusterCount),
      subtext: `${clusterCount} Deduplicated Groups`,
      badge: 'Cosine Semantic',
      badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
      icon: Users,
      iconColor: 'text-purple-600 bg-purple-50'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
      {stats.map((item, idx) => {
        const Icon = item.icon;
        return (
          <Card
            key={idx}
            className="p-3 bg-white border-slate-200 shadow-2xs hover:shadow-xs transition-shadow duration-150"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 tracking-wide uppercase">
                {item.title}
              </span>
              <Icon className="w-4 h-4 text-slate-600" />
            </div>
            <div className="mt-1 flex items-baseline justify-between">
              <span className="text-xl font-extrabold text-slate-900 tracking-tight">
                {item.value}
              </span>
              <Badge variant="default" className={`text-[9.5px] px-1.5 py-0.2 border ${item.badgeColor}`}>
                {item.badge}
              </Badge>
            </div>
            <p className="text-[10px] text-slate-500 mt-1 truncate">
              {item.subtext}
            </p>
          </Card>
        );
      })}
    </div>
  );
};

export default TriageHeaderStats;
