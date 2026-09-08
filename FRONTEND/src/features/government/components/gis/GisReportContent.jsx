import React from 'react';
import { AlertCircle, CheckCircle, Clock, ShieldCheck } from 'lucide-react';

export const GisReportContent = ({ districtData = {}, problems = [], stats = {} }) => {
  const total = stats.total || problems.length || 0;
  const highPriority = stats.highPriority || 0;
  const active = stats.active || 0;
  const resolved = stats.resolved || 0;
  const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 0;

  return (
    <div className="p-6 overflow-y-auto space-y-5 text-slate-900">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Total Problems
          </span>
          <div className="text-2xl font-extrabold text-slate-900">{total}</div>
          <span className="text-[10px] font-semibold text-slate-500 block">Reported in GIS</span>
        </div>

        <div className="bg-red-50/60 border border-red-100 rounded-2xl p-3.5 space-y-1">
          <span className="text-[10px] font-bold text-red-700 uppercase tracking-wider block">
            High / Critical
          </span>
          <div className="text-2xl font-extrabold text-red-700">{highPriority}</div>
          <span className="text-[10px] font-semibold text-red-600 block">Urgent Intervention</span>
        </div>

        <div className="bg-amber-50/60 border border-amber-100 rounded-2xl p-3.5 space-y-1">
          <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider block">
            Active / Underway
          </span>
          <div className="text-2xl font-extrabold text-amber-700">{active}</div>
          <span className="text-[10px] font-semibold text-amber-600 block">Pending Resolution</span>
        </div>

        <div className="bg-emerald-50/60 border border-emerald-100 rounded-2xl p-3.5 space-y-1">
          <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">
            Resolved & Deployed
          </span>
          <div className="text-2xl font-extrabold text-emerald-700">{resolved} ({resolutionRate}%)</div>
          <span className="text-[10px] font-semibold text-emerald-600 block">Verified on Ground</span>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
          Domain Distribution
        </h4>
        {stats.byCategory && Object.keys(stats.byCategory).length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
            {Object.entries(stats.byCategory).map(([cat, count]) => (
              <div key={cat} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex justify-between items-center">
                <span className="font-semibold text-slate-700 truncate mr-2">{cat}</span>
                <span className="font-extrabold text-[#007A61] bg-[#007A61]/10 px-2 py-0.5 rounded-md text-[11px] shrink-0">
                  {count}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-xs text-slate-400">No domain breakdown available for current selection.</div>
        )}
      </div>

      {/* Problem Records List without Citizen PII */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Filtered Problems Registry
          </h4>
          <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#007A61]" /> Sanitized (No Citizen PII)
          </span>
        </div>

        {problems.length > 0 ? (
          <div className="border border-slate-100 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                  <th className="py-2.5 px-3">Problem ID</th>
                  <th className="py-2.5 px-3">Title</th>
                  <th className="py-2.5 px-3">District</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Severity</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {problems.slice(0, 15).map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/80">
                    <td className="py-2 px-3 font-mono font-bold text-slate-700">{p.id}</td>
                    <td className="py-2 px-3 font-semibold text-slate-900 max-w-xs truncate">{p.title}</td>
                    <td className="py-2 px-3 text-slate-600">{p.district}</td>
                    <td className="py-2 px-3 text-slate-600">{p.category}</td>
                    <td className="py-2 px-3">
                      <span className="font-bold text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        {p.severity}
                      </span>
                    </td>
                    <td className="py-2 px-3 font-semibold text-[#007A61]">
                      {p.rawStatus || p.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-6 text-xs text-slate-400">
            No problem data matching active filters.
          </div>
        )}
      </div>
    </div>
  );
};

export default GisReportContent;
