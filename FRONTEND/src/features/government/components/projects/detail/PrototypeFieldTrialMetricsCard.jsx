import React from 'react';
import { Activity, Building2, Star, CheckSquare } from 'lucide-react';

export const PrototypeFieldTrialMetricsCard = ({ project }) => {
  const pData = project.prototypeData || {};
  const fieldMetrics = pData.fieldMetrics || {
    site: `${project.district || 'Ranchi'} Pilot Cluster (Ward 14 & 18)`,
    duration: '45 Days Live Field Operation',
    precision: '98.4% Telemetry Reliability',
    citizenScore: '4.8 / 5.0 (320 Verified Citizens)'
  };
  const targetDept = project.targetDepartment || project.domain || project.sector || 'Urban Development & Housing Department';

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div className="flex items-center space-x-2">
          <Activity className="w-4 h-4 text-[#007A61]" />
          <h3 className="text-xs font-black uppercase text-slate-800 tracking-wider">Field Trial Metrics & Line Department Handover</h3>
        </div>
        <span className="text-[11px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
          Pilot Stage Completed
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
        <div className="p-2.5 bg-slate-50/60 rounded-xl border border-slate-100 space-y-0.5">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Pilot Test Site</span>
          <p className="font-bold text-slate-900 truncate">{fieldMetrics.site}</p>
          <span className="text-[10px] text-slate-500 block">{fieldMetrics.duration}</span>
        </div>
        <div className="p-2.5 bg-slate-50/60 rounded-xl border border-slate-100 space-y-0.5">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Operational Accuracy</span>
          <p className="font-black text-emerald-800 truncate">{fieldMetrics.precision}</p>
          <span className="text-[10px] text-slate-500 block">Zero Critical Failures</span>
        </div>
        <div className="p-2.5 bg-slate-50/60 rounded-xl border border-slate-100 space-y-0.5">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Citizen Impact Rating</span>
          <p className="font-black text-amber-700 flex items-center space-x-1">
            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500 inline" />
            <span>{fieldMetrics.citizenScore}</span>
          </p>
          <span className="text-[10px] text-slate-500 block">High Community Adoption</span>
        </div>
        <div className="p-2.5 bg-slate-50/60 rounded-xl border border-slate-100 space-y-0.5">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Target Handover Dept</span>
          <p className="font-bold text-slate-900 truncate flex items-center space-x-1">
            <Building2 className="w-3 h-3 text-[#007A61] shrink-0" />
            <span className="truncate">{targetDept}</span>
          </p>
          <span className="text-[10px] text-emerald-700 font-semibold block">SLA & Protocol Aligned</span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-slate-100 text-xs text-slate-600">
        <div className="flex items-center space-x-1.5 text-slate-700 font-semibold">
          <CheckSquare className="w-3.5 h-3.5 text-emerald-600" />
          <span>Handover Readiness Checklist:</span>
        </div>
        <span className="text-[11px] bg-slate-100 px-2 py-0.5 rounded text-slate-700">✓ Firmware Signed</span>
        <span className="text-[11px] bg-slate-100 px-2 py-0.5 rounded text-slate-700">✓ Maintenance Manual</span>
        <span className="text-[11px] bg-slate-100 px-2 py-0.5 rounded text-slate-700">✓ Field Telemetry Live</span>
        <span className="text-[11px] bg-slate-100 px-2 py-0.5 rounded text-slate-700">✓ Citizen SMS Notification Wired</span>
      </div>
    </div>
  );
};

export default PrototypeFieldTrialMetricsCard;
