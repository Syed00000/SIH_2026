import React from 'react';
import { Droplet, Wrench, HeartPulse, Sprout, Trash2, Cpu, CheckCircle2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../../shared/components/ui/card.jsx';
import { Progress } from '../../../../shared/components/ui/progress.jsx';
import { Badge } from '../../../../shared/components/ui/badge.jsx';

export const ClassificationAnalytics = () => {
  const domains = [
    { name: 'Water Resources & Supply', count: 8, percentage: 33, color: 'bg-blue-500', icon: Droplet },
    { name: 'Public Infrastructure & Roads', count: 6, percentage: 25, color: 'bg-amber-500', icon: Wrench },
    { name: 'Healthcare & Public Hygiene', count: 5, percentage: 21, color: 'bg-rose-500', icon: HeartPulse },
    { name: 'Agriculture & Rural Livelihood', count: 3, percentage: 13, color: 'bg-emerald-500', icon: Sprout },
    { name: 'Solid Waste & Sanitation', count: 2, percentage: 8, color: 'bg-purple-500', icon: Trash2 }
  ];

  return (
    <Card className="bg-white border-slate-200 shadow-2xs">
      <CardHeader className="p-3 pb-2 border-b border-slate-100 flex flex-row items-center justify-between">
        <div className="flex items-center space-x-1.5">
          <Cpu className="w-3.5 h-3.5 text-blue-600" />
          <CardTitle className="text-xs md:text-sm font-bold text-slate-900">
            Domain Distribution & Classifier Accuracy
          </CardTitle>
        </div>
        <Badge variant="ai" className="text-[10px] font-bold">
          DistilBERT v2.4 Active
        </Badge>
      </CardHeader>

      <CardContent className="p-3 grid grid-cols-1 md:grid-cols-2 gap-3 items-center">
        <div className="space-y-2">
          {domains.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="flex items-center text-slate-700 text-[11px] truncate max-w-[200px]">
                    <Icon className="w-3 h-3 mr-1 text-slate-500" />
                    {item.name}
                  </span>
                  <span className="text-slate-900 font-extrabold text-[11px]">
                    {item.count} <span className="text-slate-400 font-normal">({item.percentage}%)</span>
                  </span>
                </div>
                <Progress value={item.percentage} className="h-1.5 bg-slate-100" indicatorColor={item.color} />
              </div>
            );
          })}
        </div>

        <div className="bg-slate-50/80 rounded border border-slate-200 p-2.5 space-y-2 text-xs">
          <div className="flex items-center justify-between text-slate-700 font-bold border-b border-slate-200/80 pb-1.5">
            <span>Model Confidence Thresholds</span>
            <span className="text-emerald-700 font-extrabold text-[11px]">94.2% Peak</span>
          </div>

          <div className="grid grid-cols-3 gap-1.5 text-center text-[10.5px]">
            <div className="bg-white p-1.5 rounded border border-slate-200">
              <span className="text-slate-400 block text-[9.5px]">High (&gt;85%)</span>
              <span className="font-extrabold text-emerald-600 text-xs">18 Issues</span>
            </div>
            <div className="bg-white p-1.5 rounded border border-slate-200">
              <span className="text-slate-400 block text-[9.5px]">Medium (70-85%)</span>
              <span className="font-extrabold text-amber-600 text-xs">5 Issues</span>
            </div>
            <div className="bg-white p-1.5 rounded border border-slate-200">
              <span className="text-slate-400 block text-[9.5px]">Low (&lt;70%)</span>
              <span className="font-extrabold text-rose-600 text-xs">1 Issue</span>
            </div>
          </div>

          <p className="text-[10px] text-slate-500 leading-snug flex items-start">
            <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600 shrink-0 mt-0.5" />
            Automatic threshold routing assigns issues &gt;80% directly to nodal department officers.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClassificationAnalytics;
