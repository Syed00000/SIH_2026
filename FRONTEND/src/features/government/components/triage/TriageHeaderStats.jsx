import React from 'react';
import { FileText, Clock, Edit3, Users } from 'lucide-react';
import { Card } from '../../../../shared/components/ui/card.jsx';
import { Badge } from '../../../../shared/components/ui/badge.jsx';

export const TriageHeaderStats = () => {
  const stats = [
    {
      title: 'Active Triage Queue',
      value: '24',
      subtext: 'Auto-Classified: 24 | Manual: 0',
      badge: 'Real-time Stream',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      icon: FileText,
      iconColor: 'text-blue-600 bg-blue-50'
    },
    {
      title: 'Confidence Level',
      value: '87.5%',
      subtext: 'Avg Model Score: 87.5%',
      badge: 'High Precision',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
      icon: Clock,
      iconColor: 'text-emerald-600 bg-emerald-50'
    },
    {
      title: 'Manual Overrides',
      value: '14.3%',
      subtext: '3 Overrides Logged',
      badge: 'Audit Active',
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
      icon: Edit3,
      iconColor: 'text-amber-600 bg-amber-50'
    },
    {
      title: 'Duplicate Clusters',
      value: '6',
      subtext: '18 Deduplicated Issues',
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
              <div className={`p-1 rounded ${item.iconColor}`}>
                <Icon className="w-3.5 h-3.5" />
              </div>
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
