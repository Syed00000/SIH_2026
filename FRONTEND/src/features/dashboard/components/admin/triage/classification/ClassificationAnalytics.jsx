import React from 'react';
import { Droplet, Wrench, HeartPulse, Sprout, Trash2, Cpu, CheckCircle2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../../../../shared/components/ui/card.jsx';
import { Progress } from '../../../../../../shared/components/ui/progress.jsx';
import { Badge } from '../../../../../../shared/components/ui/badge.jsx';

export const ClassificationAnalytics = () => {
  const domains = [
    { name: 'Water Resources', count: 42, pct: 34, color: 'bg-blue-600', icon: Droplet, text: 'text-blue-700' },
    { name: 'Infrastructure', count: 36, pct: 28, color: 'bg-amber-600', icon: Wrench, text: 'text-amber-800' },
    { name: 'Public Health', count: 24, pct: 18, color: 'bg-rose-600', icon: HeartPulse, text: 'text-rose-700' },
    { name: 'Agriculture', count: 18, pct: 14, color: 'bg-emerald-600', icon: Sprout, text: 'text-emerald-700' },
    { name: 'Sanitation', count: 8, pct: 6, color: 'bg-teal-600', icon: Trash2, text: 'text-teal-700' }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
      {/* Domain Distribution Progress Bars */}
      <Card className="lg:col-span-2 bg-white border-slate-200 shadow-2xs">
        <CardHeader className="pb-2 flex flex-row items-center justify-between border-b border-slate-100">
          <CardTitle className="font-bold text-slate-900 text-xs md:text-sm">
            AI Domain Classification Distribution
          </CardTitle>
          <Badge variant="default" className="text-[10px] font-medium">128 Issues in Queue</Badge>
        </CardHeader>
        <CardContent className="pt-3 space-y-2.5">
          {domains.map((dom, i) => {
            const IconC = dom.icon;
            return (
              <div key={i} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center text-slate-700 font-semibold text-[11px]">
                    <IconC className={`w-3 h-3 mr-1.5 ${dom.text}`} />
                    {dom.name}
                  </span>
                  <span className="font-bold text-slate-900 text-[11px]">
                    {dom.count} ({dom.pct}%)
                  </span>
                </div>
                <Progress value={dom.pct} indicatorColor={dom.color} className="h-1.5" />
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Model Performance & Confidence Health */}
      <Card className="bg-white border-slate-200 shadow-2xs flex flex-col justify-between">
        <div>
          <CardHeader className="pb-2 flex flex-row items-center space-x-1.5 border-b border-slate-100">
            <Cpu className="w-3.5 h-3.5 text-blue-600" />
            <CardTitle className="font-bold text-slate-900 text-xs md:text-sm">
              JoharNLP Engine Status
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-3 space-y-2 text-xs">
            <div className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-100">
              <span className="text-slate-600 font-medium">Model Accuracy</span>
              <Badge variant="success" className="font-extrabold flex items-center">
                <CheckCircle2 className="w-3 h-3 mr-1" /> 94.8%
              </Badge>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-100">
              <span className="text-slate-600 font-medium">Avg Confidence</span>
              <Badge variant="info" className="font-extrabold">89.2%</Badge>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-100">
              <span className="text-slate-600 font-medium">Model Version</span>
              <span className="font-bold text-slate-800">v2.4-Transformer</span>
            </div>
          </CardContent>
        </div>
        <div className="text-[10px] text-slate-400 font-medium p-3 pt-2 border-t border-slate-100">
          Last model fine-tuning: 24 May 2026
        </div>
      </Card>
    </div>
  );
};

export default ClassificationAnalytics;
