import React, { useState } from 'react';
import { Info, ChevronDown, ChevronUp } from 'lucide-react';

export const MapLegendCard = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const severities = [
    { label: 'Critical', color: '#dc2626' },
    { label: 'High', color: '#ea580c' },
    { label: 'Medium', color: '#d97706' },
    { label: 'Low', color: '#16a34a' }
  ];

  const statuses = [
    { label: 'Submitted', color: '#64748b' },
    { label: 'Under Review', color: '#0284c7' },
    { label: 'In Progress', color: '#f59e0b' },
    { label: 'Deployed / Resolved', color: '#16a34a' }
  ];

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-xl border border-slate-200 shadow-md text-xs w-52 overflow-hidden">
      <button
        type="button"
        onClick={() => setIsExpanded((prev) => !prev)}
        className="w-full px-3 py-2 flex items-center justify-between font-bold text-slate-800 hover:bg-slate-50 transition-colors cursor-pointer"
      >
        <span className="flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-[#007A61]" />
          Map Legend
        </span>
        {isExpanded ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
      </button>

      {isExpanded && (
        <div className="px-3 pb-2.5 pt-1 space-y-2.5 border-t border-slate-100">
          <div>
            <div className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1">
              Severity Level
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {severities.map((s) => (
                <div key={s.label} className="flex items-center gap-1.5 text-[11px] text-slate-700">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
                  <span>{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1">
              Lifecycle Status
            </div>
            <div className="space-y-1">
              {statuses.map((st) => (
                <div key={st.label} className="flex items-center gap-1.5 text-[11px] text-slate-700">
                  <span className="w-2 h-2 rounded-xs shrink-0" style={{ backgroundColor: st.color }} />
                  <span>{st.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapLegendCard;
