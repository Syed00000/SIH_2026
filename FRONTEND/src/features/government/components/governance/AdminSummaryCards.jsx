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
      iconColor: 'text-blue-600'
    },
    {
      id: 'active',
      title: 'Active Admins',
      value: stats?.activeAdmins ?? 0,
      subtitle: 'Currently active',
      icon: ShieldCheck,
      iconColor: 'text-emerald-600'
    },
    {
      id: 'suspended',
      title: 'Suspended Admins',
      value: stats?.suspendedAdmins ?? 0,
      subtitle: 'Temporarily suspended',
      icon: PauseCircle,
      iconColor: 'text-amber-600'
    },
    {
      id: 'removed',
      title: 'Removed Admins',
      value: stats?.removedAdmins ?? 0,
      subtitle: 'Permanently removed',
      icon: Trash2,
      iconColor: 'text-rose-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
      {cards.map((card) => {
        const IconComponent = card.icon;
        return (
          <div
            key={card.id}
            className="bg-white border border-slate-200/90 rounded-lg p-4 shadow-2xs flex flex-col justify-between min-h-[96px] hover:border-slate-300 transition-colors"
          >
            {/* Top row: Label & Bare Icon without background box */}
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                {card.title}
              </span>
              <div className={`flex items-center justify-center ${card.iconColor}`}>
                <IconComponent className="w-4 h-4" />
              </div>
            </div>

            {/* Bottom row: Value & Subtitle */}
            <div className="mt-2">
              <div className="text-2xl font-extrabold text-slate-900 tracking-tight">
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
