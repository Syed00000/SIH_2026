import React from 'react';
import { Users, ShieldCheck, PauseCircle, Trash2 } from 'lucide-react';

export const AdminSummaryCards = ({ stats }) => {
  const cards = [
    {
      id: 'total',
      title: 'Total Admins',
      value: stats?.totalAdmins ?? 28,
      subtitle: 'All administrators',
      icon: Users,
      iconColor: 'text-blue-600',
      iconBg: 'bg-blue-50'
    },
    {
      id: 'active',
      title: 'Active Admins',
      value: stats?.activeAdmins ?? 23,
      subtitle: 'Currently active',
      icon: ShieldCheck,
      iconColor: 'text-emerald-600',
      iconBg: 'bg-emerald-50'
    },
    {
      id: 'suspended',
      title: 'Suspended Admins',
      value: stats?.suspendedAdmins ?? 4,
      subtitle: 'Temporarily suspended',
      icon: PauseCircle,
      iconColor: 'text-orange-600',
      iconBg: 'bg-orange-50'
    },
    {
      id: 'removed',
      title: 'Removed Admins',
      value: stats?.removedAdmins ?? 1,
      subtitle: 'Permanently removed',
      icon: Trash2,
      iconColor: 'text-red-600',
      iconBg: 'bg-red-50'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const IconComponent = card.icon;
        return (
          <div
            key={card.id}
            className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex items-center space-x-4 transition-all hover:shadow-sm"
          >
            {/* Circular Icon Container */}
            <div
              className={`w-13 h-13 rounded-2xl ${card.iconBg} flex items-center justify-center shrink-0`}
            >
              <IconComponent className={`w-6 h-6 ${card.iconColor}`} />
            </div>

            {/* Metrics Information */}
            <div className="min-w-0 flex-1">
              <span className="text-xs font-semibold text-slate-500 block truncate">
                {card.title}
              </span>
              <div className="text-2xl font-black text-slate-900 tracking-tight mt-0.5">
                {card.value}
              </div>
              <span className="text-[11px] font-medium text-slate-400 block truncate mt-0.5">
                {card.subtitle}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AdminSummaryCards;
