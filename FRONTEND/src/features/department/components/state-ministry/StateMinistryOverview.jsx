import React from 'react';
import { Network, Building2, MapPin, Users, Activity, CheckCircle2 } from 'lucide-react';

export const StateMinistryOverview = ({ department }) => {
  return (
    <div className="space-y-4 animate-fadeIn">
      {/* Top Banner */}
      <div className="bg-white p-5 md:p-6 rounded-2xl border border-slate-200/90 shadow-2xs relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#007A61]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
              {department?.name || 'State Ministry Dashboard'}
            </h1>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl">
              {department?.mandate?.objective || 'Central administration and policy implementation across the state of Jharkhand. Use this dashboard to manage statewide sub-departments, monitor performance, and configure escalations.'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 bg-emerald-100 text-emerald-800 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-xs border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Active System
            </span>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Officers', value: department?.officersCount || '14', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
          { label: 'Active Districts', value: '24', icon: Building2, color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100' },
          { label: 'Local Bodies', value: '112', icon: MapPin, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
          { label: 'Escalation Rules', value: department?.escalationRules?.length || '0', icon: Activity, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${stat.bg} ${stat.border} border`}>
                  <Icon className={`w-4 h-4 ${stat.color}`} />
                </div>
              </div>
              <div>
                <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{stat.label}</h3>
                <p className="text-2xl font-black text-slate-900 mt-1">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-4">
              <Network className="w-4 h-4 text-[#007A61]" />
              Administrative Hierarchy
            </h3>
            <div className="flex flex-wrap gap-2">
              {(department?.hierarchyConfig || ['State Department', 'District Department']).map((level, i) => (
                <div key={i} className="flex items-center">
                  <span className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-700">
                    {level}
                  </span>
                  {i < (department?.hierarchyConfig?.length || 2) - 1 && (
                    <span className="text-slate-400 mx-2">→</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-4">
              <Users className="w-4 h-4 text-[#007A61]" />
              Key Personnel
            </h3>
            <div className="space-y-3">
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-wider mb-0.5">Head of Department</p>
                <p className="text-xs font-bold text-slate-900">{department?.headName || 'Not Assigned'}</p>
                <p className="text-[11px] text-slate-600">{department?.headRole || 'Principal Secretary'}</p>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-wider mb-0.5">Nodal Officer</p>
                <p className="text-xs font-bold text-slate-900">{department?.nodalOfficerName || 'Not Assigned'}</p>
                <p className="text-[11px] text-slate-600">{department?.nodalOfficerDesignation || 'Under Secretary'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
