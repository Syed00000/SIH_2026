import React from 'react';
import { Card } from '../../../../shared/components/ui/card.jsx';

export const DepartmentRoutingMatrix = ({ criticalCount = 0, urgentCount = 0, normalCount = 0 }) => {
  const routing = [
    {
      level: 'Critical (L3)',
      sla: '24 Hours',
      action: 'DC / Principal Secretary SMS Broadcast',
      count: criticalCount,
      color: 'text-red-700 bg-red-50 border-red-200'
    },
    {
      level: 'Urgent (L2)',
      sla: '48 Hours',
      action: 'Nodal Officer Direct Auto-Assignment',
      count: urgentCount,
      color: 'text-amber-700 bg-amber-50 border-amber-200'
    },
    {
      level: 'High / Normal (L1)',
      sla: '5 Days',
      action: 'Standard Department Queue Placement',
      count: normalCount,
      color: 'text-[#007A61] bg-[#007A61]/10 border-[#007A61]/20'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
      {routing.map((r, i) => (
        <Card key={i} className="p-3 bg-white border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="font-extrabold text-xs text-slate-900">{r.level}</span>
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${r.color}`}>
              SLA: {r.sla}
            </span>
          </div>
          <p className="text-[11px] text-slate-600 font-medium mt-1">{r.action}</p>
          <div className="mt-2 pt-1.5 border-t border-slate-100 flex items-center justify-between text-[10.5px]">
            <span className="text-slate-400">Active Incidents</span>
            <span className="font-extrabold text-slate-800">{r.count} Tickets</span>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default DepartmentRoutingMatrix;
