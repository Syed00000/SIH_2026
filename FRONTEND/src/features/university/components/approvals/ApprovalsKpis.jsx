import React from 'react';
import { ClipboardList, Clock, CheckCircle2, XCircle, Lock } from 'lucide-react';

export const ApprovalsKpis = ({
  total = 0,
  pending = 0,
  approved = 0,
  rejected = 0,
  deployed = 0,
  loading = false
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="bg-white border border-slate-200 p-3 animate-pulse">
            <div className="h-3 bg-slate-100 w-24 mb-2" />
            <div className="h-7 bg-slate-100 w-14" />
          </div>
        ))}
      </div>
    );
  }

  const cards = [
    { label: 'Total Requests', sub: 'All Dossiers', value: total, Icon: ClipboardList, cls: 'text-slate-900', bg: 'bg-slate-50', border: 'border-slate-200' },
    { label: 'Pending Action', sub: pending > 0 ? 'Awaiting Review' : '0 Pending', value: pending, Icon: Clock, cls: pending > 0 ? 'text-amber-700' : 'text-slate-400', bg: 'bg-amber-50/50', border: 'border-slate-200' },
    { label: 'Forwarded / Approved', sub: 'To Government', value: approved, Icon: CheckCircle2, cls: 'text-emerald-700', bg: 'bg-emerald-50/50', border: 'border-slate-200' },
    { label: 'Rejected', sub: 'Returned', value: rejected, Icon: XCircle, cls: 'text-rose-700', bg: 'bg-rose-50/50', border: 'border-slate-200' },
    { label: '🔒 Deployed & Locked', sub: 'State Certified', value: deployed, Icon: Lock, cls: 'text-teal-700', bg: 'bg-teal-50/50', border: 'border-teal-300' }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 select-none">
      {cards.map(({ label, sub, value, Icon, cls, bg, border }) => (
        <div key={label} className={`bg-white border ${border} p-3 flex items-center justify-between shadow-2xs rounded-none`}>
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block">{label}</span>
            <div className={`text-2xl font-black mt-0.5 ${cls}`}>{value}</div>
            <span className="text-[10px] font-medium text-slate-500 mt-0.5 block">{sub}</span>
          </div>
          <div className={`w-9 h-9 rounded-none border border-slate-200 ${bg} flex items-center justify-center shrink-0 ${cls}`}>
            <Icon className="w-4 h-4" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ApprovalsKpis;
