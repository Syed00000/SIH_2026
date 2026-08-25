import React from 'react';
import { FileText, Clock, Edit3, Users } from 'lucide-react';
import { Card } from '../../../../../../shared/components/ui/card.jsx';
import { Badge } from '../../../../../../shared/components/ui/badge.jsx';

export const TriageHeaderStats = () => {
  const stats = [
    {
      title: 'Total Incoming Issues',
      value: '12,450',
      change: '+320 today',
      icon: FileText,
      iconBg: 'bg-blue-50 text-blue-600 border-blue-100',
      badgeVariant: 'success'
    },
    {
      title: 'Pending AI Review',
      value: '128',
      change: 'Needs attention',
      icon: Clock,
      iconBg: 'bg-amber-50 text-amber-600 border-amber-100',
      badgeVariant: 'warning'
    },
    {
      title: 'Manual Overrides',
      value: '256',
      change: 'This month',
      icon: Edit3,
      iconBg: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      badgeVariant: 'default'
    },
    {
      title: 'Duplicate Clusters',
      value: '412',
      change: 'Pending resolution',
      icon: Users,
      iconBg: 'bg-purple-50 text-purple-600 border-purple-100',
      badgeVariant: 'ai'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
      {stats.map((st, idx) => {
        const IconC = st.icon;
        return (
          <Card
            key={idx}
            className="flex items-center space-x-3 p-3 bg-white border-slate-200 shadow-2xs hover:border-slate-300 transition-all rounded-md"
          >
            <div
              className={`w-9 h-9 rounded-md border flex items-center justify-center flex-shrink-0 ${st.iconBg}`}
            >
              <IconC className="w-4.5 h-4.5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block leading-tight">
                {st.title}
              </span>
              <div className="flex items-baseline space-x-1.5 mt-0.5">
                <span className="text-lg font-extrabold text-slate-900 leading-none">
                  {st.value}
                </span>
                <Badge variant={st.badgeVariant} className="text-[9px] py-0 px-1 font-bold">
                  {st.change}
                </Badge>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default TriageHeaderStats;
