import React from 'react';
import { Layers, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';
import { Card } from '../../../../../../shared/components/ui/card.jsx';
import { Badge } from '../../../../../../shared/components/ui/badge.jsx';

export const DeduplicationMetrics = () => {
  const metrics = [
    { title: 'Pending Duplicate Clusters', value: '412', sub: 'Across 24 districts', icon: Layers, color: 'text-purple-700 bg-purple-50 border-purple-100', badge: 'ai' },
    { title: 'Redundant Tickets Merged', value: '1,840', sub: 'This quarter', icon: CheckCircle2, color: 'text-emerald-700 bg-emerald-50 border-emerald-100', badge: 'success' },
    { title: 'Avg NLP Cluster Similarity', value: '92.4%', sub: 'Cosine text embedding', icon: ShieldCheck, color: 'text-blue-700 bg-blue-50 border-blue-100', badge: 'info' },
    { title: 'HEI Matching Efficiency', value: '+42%', sub: 'Zero duplicate allocations', icon: Zap, color: 'text-amber-800 bg-amber-50 border-amber-100', badge: 'warning' }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
      {metrics.map((m, i) => {
        const IconC = m.icon;
        return (
          <Card key={i} className="flex items-center space-x-3 p-3 bg-white border-slate-200 shadow-2xs">
            <div className={`w-8 h-8 rounded-md border flex items-center justify-center flex-shrink-0 ${m.color}`}>
              <IconC className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block leading-tight">{m.title}</span>
              <div className="flex items-baseline space-x-1.5 mt-0.5">
                <span className="text-base font-extrabold text-slate-900 leading-none">{m.value}</span>
                <Badge variant={m.badge} className="text-[9px] py-0 px-1">{m.sub}</Badge>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default DeduplicationMetrics;
