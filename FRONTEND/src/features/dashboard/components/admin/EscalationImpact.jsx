import React from 'react';
import { Bell, Eye, Share2, TrendingUp } from 'lucide-react';

export const EscalationImpact = () => {
  const impacts = [
    {
      icon: Bell,
      text: 'Instant notification to District Officials'
    },
    {
      icon: Eye,
      text: 'Visible in Critical Dashboard'
    },
    {
      icon: Share2,
      text: 'Auto routed to concerned department'
    },
    {
      icon: TrendingUp,
      text: 'Priority action tracking enabled'
    }
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-md p-4 shadow-2xs space-y-3">
      <h3 className="font-bold text-slate-900 text-sm pb-2 border-b border-slate-100">
        Escalation Impact
      </h3>

      <div className="space-y-2.5">
        {impacts.map((imp, idx) => {
          const IconC = imp.icon;
          return (
            <div
              key={idx}
              className="flex items-center space-x-2.5 p-2 rounded-md bg-slate-50/70 border border-slate-100/80"
            >
              <div className="w-7 h-7 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0 text-blue-600">
                <IconC className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-semibold text-slate-700 leading-tight">
                {imp.text}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EscalationImpact;
