import React from 'react';
import { Droplet, Wrench, HeartPulse, Sprout, Trash2, Cpu, CheckCircle2, Info } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../../shared/components/ui/card.jsx';
import { Progress } from '../../../../shared/components/ui/progress.jsx';

export const ClassificationAnalytics = ({ issues = [], issuesCount = 0 }) => {
  const safeIssues = Array.isArray(issues) ? issues : [];
  const total = safeIssues.length || issuesCount || 0;

  // Compute live domain counts
  const domainCounts = {};
  safeIssues.forEach((iss) => {
    const d = iss.domain || 'General';
    domainCounts[d] = (domainCounts[d] || 0) + 1;
  });

  const domainIcons = {
    'Water Resources': { icon: Droplet, color: 'bg-[#007A61]' },
    'Public Infrastructure': { icon: Wrench, color: 'bg-amber-600' },
    'Healthcare': { icon: HeartPulse, color: 'bg-rose-600' },
    'Agriculture': { icon: Sprout, color: 'bg-emerald-600' },
    'Sanitation': { icon: Trash2, color: 'bg-purple-600' }
  };

  const domainList = Object.keys(domainCounts).map((k) => ({
    name: k,
    count: domainCounts[k],
    percentage: total > 0 ? Math.round((domainCounts[k] / total) * 100) : 0,
    color: domainIcons[k]?.color || 'bg-[#007A61]',
    icon: domainIcons[k]?.icon || Droplet
  }));

  const highConf = safeIssues.filter((i) => (i.confidence || 0) >= 85).length;
  const medConf = safeIssues.filter((i) => (i.confidence || 0) >= 70 && (i.confidence || 0) < 85).length;
  const lowConf = safeIssues.filter((i) => (i.confidence || 0) < 70).length;

  return (
    <Card className="bg-white border-slate-200/80 rounded-xl shadow-[0_1px_3px_rgba(15,23,42,0.03)]">
      <CardHeader className="p-3.5 pb-2.5 border-b border-slate-100 flex flex-row items-center justify-between">
        <div className="flex items-center space-x-2">
          <Cpu className="w-4 h-4 text-slate-700" />
          <CardTitle className="text-xs font-bold text-slate-900 tracking-tight">
            Domain Distribution & Classifier Accuracy
          </CardTitle>
        </div>
        <span className="text-[10px] font-mono font-semibold text-slate-600 bg-slate-100 border border-slate-200/80 px-2 py-0.5 rounded">
          Live AI Triage Pipeline
        </span>
      </CardHeader>

      <CardContent className="p-3.5 grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
        {/* Domain Distribution Progress Bars */}
        <div className="space-y-2.5">
          {domainList.length === 0 ? (
            <div className="py-6 text-center text-slate-400 text-xs">
              <Info className="w-4 h-4 mx-auto text-slate-300 mb-1" />
              No issues classified in the current stream.
            </div>
          ) : (
            domainList.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center text-slate-700 font-medium text-[11px] truncate max-w-[200px]">
                      <Icon className="w-3 h-3 mr-1.5 text-slate-500" />
                      {item.name}
                    </span>
                    <span className="text-slate-900 font-bold text-[11px]">
                      {item.count} <span className="text-slate-400 font-normal text-[10px]">({item.percentage}%)</span>
                    </span>
                  </div>
                  <Progress value={item.percentage} className="h-1.5 bg-slate-100" indicatorColor={item.color} />
                </div>
              );
            })
          )}
        </div>

        {/* Confidence Thresholds Panel */}
        <div className="bg-slate-50/70 rounded-xl border border-slate-200/80 p-3 space-y-2.5 text-xs">
          <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
            <span className="text-slate-800 font-bold text-xs">Confidence Thresholds</span>
            <span className="font-mono text-slate-900 font-bold text-xs">
              {total > 0 ? 'Active Stream' : 'Zero Inflow'}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-white p-2 rounded-lg border border-slate-200/70 shadow-2xs">
              <span className="text-slate-400 block text-[9.5px] font-medium mb-0.5">High (&gt;85%)</span>
              <span className="font-bold text-slate-900 text-xs">{highConf} Issues</span>
            </div>
            <div className="bg-white p-2 rounded-lg border border-slate-200/70 shadow-2xs">
              <span className="text-slate-400 block text-[9.5px] font-medium mb-0.5">Med (70-85%)</span>
              <span className="font-bold text-slate-900 text-xs">{medConf} Issues</span>
            </div>
            <div className="bg-white p-2 rounded-lg border border-slate-200/70 shadow-2xs">
              <span className="text-slate-400 block text-[9.5px] font-medium mb-0.5">Low (&lt;70%)</span>
              <span className="font-bold text-slate-900 text-xs">{lowConf} Issues</span>
            </div>
          </div>

          <p className="text-[10.5px] text-slate-500 leading-snug flex items-center pt-0.5">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-emerald-600 shrink-0" />
            <span>Automatic threshold routing assigns issues &gt;80% directly to nodal officers.</span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClassificationAnalytics;
