import React from 'react';
import { ClipboardList, Clock, CheckCircle2, XCircle } from 'lucide-react';

export const ApprovalsKpis = ({ total = 56, pending = 18, approved = 30, rejected = 8, loading = false }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white border border-slate-200 p-3 animate-pulse">
            <div className="h-3 bg-slate-100 w-24 mb-2" />
            <div className="h-7 bg-slate-100 w-14" />
          </div>
        ))}
      </div>
    );
  }

  const cards = [
    { label: 'Total Requests', sub: 'All Requests', value: total, Icon: ClipboardList, cls: 'text-slate-900' },
    { label: 'Pending', sub: 'Awaiting Review', value: pending, Icon: Clock, cls: 'text-amber-700' },
    { label: 'Approved', sub: 'This Year', value: approved, Icon: CheckCircle2, cls: 'text-emerald-700' },
    { label: 'Rejected', sub: 'This Year', value: rejected, Icon: XCircle, cls: 'text-rose-700' }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 select-none">
      {cards.map(({ label, sub, value, Icon, cls }) => (
        <div key={label} className="bg-white border border-slate-200 p-3 flex items-center justify-between shadow-2xs rounded-none">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block">{label}</span>
            <div className={`text-2xl font-black mt-0.5 ${cls}`}>{value}</div>
            <span className="text-[10px] font-medium text-slate-500 mt-0.5 block">{sub}</span>
          </div>
          <div className={`w-9 h-9 rounded-none border border-slate-200 bg-slate-50 flex items-center justify-center shrink-0 ${cls}`}>
            <Icon className="w-4 h-4" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ApprovalsKpis;
