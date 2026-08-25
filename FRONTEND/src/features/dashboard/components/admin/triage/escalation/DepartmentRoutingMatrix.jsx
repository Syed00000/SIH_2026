import React from 'react';
import { Bell, Eye, Share2, TrendingUp } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../../../../shared/components/ui/card.jsx';

export const DepartmentRoutingMatrix = () => {
  const routing = [
    {
      icon: Bell,
      title: 'District Administration Notification',
      desc: 'Instant broadcast to DC & District Project Officers'
    },
    {
      icon: Eye,
      title: 'Critical Emergency Dashboard',
      desc: 'Pinned to top of State Level Monitoring Console'
    },
    {
      icon: Share2,
      title: 'Automated Department Dispatch',
      desc: 'Auto routed to technical team with 24-hr response mandate'
    },
    {
      icon: TrendingUp,
      title: 'Active SLA & Resolution Tracking',
      desc: 'Automated daily compliance checkpoints enabled'
    }
  ];

  return (
    <Card className="bg-white border-slate-200 p-4 shadow-2xs space-y-3">
      <CardHeader className="p-0 pb-2 border-b border-slate-100">
        <CardTitle className="font-bold text-slate-900 text-xs md:text-sm">
          Escalation & Routing Protocol
        </CardTitle>
      </CardHeader>

      <CardContent className="p-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {routing.map((item, idx) => {
            const IconC = item.icon;
            return (
              <div
                key={idx}
                className="flex items-start space-x-2.5 p-2.5 rounded-md bg-slate-50/80 border border-slate-100"
              >
                <div className="w-7 h-7 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0 text-blue-600 mt-0.5">
                  <IconC className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 block leading-tight">
                    {item.title}
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium block leading-tight mt-1">
                    {item.desc}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default DepartmentRoutingMatrix;
