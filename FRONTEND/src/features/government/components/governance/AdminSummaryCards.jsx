import React from 'react';
import { Users, ShieldCheck, PauseCircle, Trash2 } from 'lucide-react';

export const AdminSummaryCards = ({ stats }) => {
  const cards = [
    {
      id: 'total',
      title: 'Total Admins',
      value: stats?.totalAdmins ?? 0,
      subtitle: 'All administrators',
      icon: Users,
      iconColor: 'text-blue-600',
      borderColor: 'border-l-blue-600'
    },
    {
      id: 'active',
      title: 'Active Admins',
      value: stats?.activeAdmins ?? 0,
      subtitle: 'Currently active',
      icon: ShieldCheck,
      iconColor: 'text-emerald-600',
      borderColor: 'border-l-emerald-600'
    },
    {
      id: 'suspended',
      title: 'Suspended Admins',
      value: stats?.suspendedAdmins ?? 0,
      subtitle: 'Temporarily suspended',
      icon: PauseCircle,
      iconColor: 'text-amber-600',
      borderColor: 'border-l-amber-600'
    },
    {
      id: 'removed',
      title: 'Removed Admins',
      value: stats?.removedAdmins ?? 0,
      subtitle: 'Permanently removed',
      icon: Trash2,
      iconColor: 'text-rose-600',
      borderColor: 'border-l-rose-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const IconComponent = card.icon;
        return (
          <div
            key={card.id}
            className={`bg-white border border-slate-200 border-l-4 ${card.borderColor} p-5 shadow-xs flex items-center justify-between transition-all hover:border-slate-300`}
          >
            {/* Metrics Information */}
            <div className="min-w-0 flex-1 pr-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block truncate">
                {card.title}
              </span>
              <div className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight mt-1">
                {card.value}
              </div>
              <span className="text-[11px] font-medium text-slate-400 block truncate mt-0.5">
                {card.subtitle}
              </span>
            </div>

            {/* Direct Crisp Icon with No Background Shape */}
            <div className="shrink-0 flex items-center justify-center p-1">
              <IconComponent className={`w-7 h-7 ${card.iconColor}`} strokeWidth={2} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AdminSummaryCards;
