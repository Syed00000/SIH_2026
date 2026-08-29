import React from 'react';
import { AlertTriangle, Sparkles, Clock, Briefcase } from 'lucide-react';

export const NodalRecentAlertsCard = ({ alertsData, onViewAll }) => {
  const defaultAlerts = [
    {
      id: 1,
      title: '23 challenges are pending review',
      subtitle: 'Require your action',
      time: '10m ago',
      icon: AlertTriangle,
      iconColor: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-100'
    },
    {
      id: 2,
      title: 'AI detected 15 possible duplicates',
      subtitle: 'Review suggested',
      time: '45m ago',
      icon: Sparkles,
      iconColor: 'text-amber-600',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-100'
    },
    {
      id: 3,
      title: '7 projects are delayed',
      subtitle: 'Need attention',
      time: '2h ago',
      icon: Clock,
      iconColor: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-100'
    },
    {
      id: 4,
      title: '5 CSR proposals await approval',
      subtitle: 'Approval required',
      time: '3h ago',
      icon: Briefcase,
      iconColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-100'
    }
  ];

  const alerts = alertsData || defaultAlerts;

  return (
    <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <h3 className="font-bold text-slate-900 text-sm">Recent Alerts</h3>
        <button
          onClick={onViewAll}
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
        >
          View All
        </button>
      </div>

      {/* Alerts List */}
      <div className="space-y-3 my-auto py-1">
        {alerts.map((alert) => {
          const Icon = alert.icon || AlertTriangle;
          return (
            <div
              key={alert.id}
              className="flex items-start justify-between space-x-3 p-1 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-start space-x-3 min-w-0">
                <div
                  className={`w-8 h-8 rounded-lg ${alert.bgColor || 'bg-blue-50'} border ${alert.borderColor || 'border-blue-100'} flex items-center justify-center shrink-0 mt-0.5`}
                >
                  <Icon className={`w-4 h-4 ${alert.iconColor || 'text-blue-600'}`} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-900 leading-snug truncate">
                    {alert.title}
                  </p>
                  <p className="text-[11px] text-slate-500 font-medium leading-tight">
                    {alert.subtitle}
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-semibold text-slate-400 shrink-0">
                {alert.time}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NodalRecentAlertsCard;
