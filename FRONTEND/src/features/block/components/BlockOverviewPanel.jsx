import React from 'react';
import { Building2, AlertCircle, CheckCircle2, Users, MapPin, ArrowRight } from 'lucide-react';

export const BlockOverviewPanel = ({
  block,
  challenges = [],
  departments = [],
  onSelectProblem,
  onNavigateTab
}) => {
  const activeCount = challenges.filter((c) => c.status !== 'Resolved' && c.status !== 'Deployed').length;
  const resolvedCount = challenges.filter((c) => c.status === 'Resolved' || c.status === 'Deployed').length;
  const panchayats = block?.panchayats || [];
  const [activeTab, setActiveTab] = React.useState('Active');

  const filteredIssues = challenges.filter((p) => {
    if (activeTab === 'Active') {
      return p.status !== 'Resolved' && p.status !== 'Deployed' && p.status !== 'Escalated';
    } else if (activeTab === 'Forwarded') {
      return p.status === 'Escalated';
    } else if (activeTab === 'Resolved') {
      return p.status === 'Resolved' || p.status === 'Deployed';
    }
    return true;
  });

  const kpis = [
    { label: 'Total Challenges', value: challenges.length, icon: AlertCircle, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Active Grievances', value: activeCount, icon: AlertCircle, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Resolved on Ground', value: resolvedCount, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Block Departments', value: departments.length, icon: Building2, color: 'text-[#007A61]', bg: 'bg-teal-50' }
  ];

  return (
    <div className="space-y-6 text-left select-none">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div key={idx} className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3.5">
              <div className={`w-11 h-11 rounded-xl ${kpi.bg} ${kpi.color} flex items-center justify-center shrink-0`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{kpi.label}</p>
                <p className="text-xl font-black text-slate-900 mt-0.5">{kpi.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Block Information & Panchayats Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#007A61]" />
              <span>{block?.name || 'Kanke Block'} — Block Development Office</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Administering {panchayats.length} Gram Panchayats • {block?.district || 'Ranchi'} District
            </p>
          </div>
          <div className="text-right">
            <span className="text-[10.5px] font-bold text-slate-400 uppercase block">In-Charge BDO</span>
            <span className="text-xs font-black text-slate-800">{block?.bdoName || 'Shri Rajesh Kumar Sinha'}</span>
          </div>
        </div>

        <div>
          <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-slate-500" />
            <span>Gram Panchayats Under Jurisdiction ({panchayats.length})</span>
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {panchayats.length > 0 ? (
              panchayats.map((p, i) => (
                <span key={i} className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200/70">
                  {p}
                </span>
              ))
            ) : (
              <span className="text-xs text-slate-400">No Gram Panchayats configured</span>
            )}
          </div>
        </div>
      </div>

      {/* Recent Civic Issues Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-100 pb-3 gap-3">
          <h3 className="text-sm font-black text-slate-900">Civic Grievances</h3>
          
          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('Active')}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-extrabold uppercase tracking-wider transition-all ${
                activeTab === 'Active' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Active / Upcoming
            </button>
            <button
              onClick={() => setActiveTab('Forwarded')}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-extrabold uppercase tracking-wider transition-all ${
                activeTab === 'Forwarded' ? 'bg-white text-amber-700 shadow-xs' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Forwarded
            </button>
            <button
              onClick={() => setActiveTab('Resolved')}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-extrabold uppercase tracking-wider transition-all ${
                activeTab === 'Resolved' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Resolved
            </button>
          </div>

          {onNavigateTab && (
            <button
              type="button"
              onClick={() => onNavigateTab('challenges')}
              className="text-xs font-bold text-[#007A61] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {filteredIssues.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400 font-medium">
            No civic issues found in this category.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredIssues.slice(0, 10).map((issue) => {
              const id = issue.challengeId || issue.id || issue._id;
              return (
                <div
                  key={id}
                  onClick={() => onSelectProblem && onSelectProblem(issue)}
                  className="py-3 flex items-center justify-between hover:bg-slate-50/70 px-2 rounded-xl cursor-pointer transition-colors"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold text-[#007A61] bg-[#007A61]/10 px-1.5 py-0.5 rounded">
                        {issue.challengeId || 'CHL'}
                      </span>
                      <span className="text-xs font-bold text-slate-800 hover:text-[#007A61]">{issue.title}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-1">{issue.description}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className={`px-2 py-0.5 rounded-full text-[10.5px] font-bold ${
                      issue.status === 'Resolved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {issue.status || 'Active'}
                    </span>
                    <p className="text-[10px] text-slate-400 mt-1">{issue.location?.panchayatOrWard || 'Block'}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlockOverviewPanel;
