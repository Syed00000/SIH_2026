import React from 'react';
import { AlertCircle, Clock, CheckCircle2, Flame, Building2, MapPin, ArrowRight, HandCoins } from 'lucide-react';

export const DepartmentOverview = ({
  department,
  problems = [],
  onSelectProblem,
  onNavigateProblems,
  onNavigateBudgetApprovals
}) => {
  const total = problems.length;
  const inProgress = problems.filter((p) => p.status === 'In Progress' || p.status === 'Assigned').length;
  const resolved = problems.filter((p) => p.status === 'Resolved' || p.status === 'Deployed').length;
  const critical = problems.filter((p) => p.priority === 'Critical' || p.priority === 'High').length;
  const pendingBudgets = problems.filter((p) => p.assignedBudgetOfficer?.status === 'Submitted').length;

  const kpis = [
    { label: 'Assigned Problems', value: total, sub: 'Total civic directives received', icon: AlertCircle, color: 'text-slate-900', bg: 'bg-slate-100', iconColor: 'text-slate-900' },
    { label: 'Work In Progress', value: inProgress, sub: 'Active field investigation/work', icon: Clock, color: 'text-slate-900', bg: 'bg-slate-100', iconColor: 'text-slate-900' },
    { label: 'Resolved & Closed', value: resolved, sub: 'Ground issues resolved', icon: CheckCircle2, color: 'text-[#007A61]', bg: 'bg-emerald-50', iconColor: 'text-[#007A61]' },
    { label: 'Critical / High Priority', value: critical, sub: 'Requires immediate attention', icon: Flame, color: 'text-slate-900', bg: 'bg-slate-100', iconColor: 'text-slate-900' }
  ];

  const recentProblems = problems.slice(0, 5);
  const [activeTab, setActiveTab] = React.useState('Active');

  const filteredProblems = problems.filter((p) => {
    if (activeTab === 'Active') return p.status !== 'Resolved' && p.status !== 'Deployed' && p.status !== 'Escalated';
    if (activeTab === 'Forwarded') return p.status === 'Escalated';
    if (activeTab === 'Resolved') return p.status === 'Resolved' || p.status === 'Deployed';
    return true;
  });

  return (
    <div className="space-y-4 select-none text-left animate-in fade-in duration-150">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {kpis.map((k, i) => {
          const Icon = k.icon;
          return (
            <div key={i} className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs flex items-center justify-between">
              <div className="min-w-0 pr-2">
                <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider truncate">
                  {k.label}
                </span>
                <div className={`text-xl font-black ${k.color} mt-0.5`}>{k.value}</div>
                <span className="text-[10px] text-slate-500 font-medium block truncate mt-0.5">{k.sub}</span>
              </div>
              <div className={`w-9 h-9 rounded-xl ${k.bg} flex items-center justify-center shrink-0`}>
                <Icon className={`w-4 h-4 ${k.iconColor}`} />
              </div>
            </div>
          );
        })}
      </div>

      {pendingBudgets > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
              <HandCoins className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <h3 className="text-xs font-black text-amber-900 uppercase tracking-wide">
                {pendingBudgets} Budget Requisition{pendingBudgets > 1 ? 's' : ''} Ready for Review
              </h3>
              <p className="text-[11px] text-amber-700 font-medium mt-0.5">
                Submitted by assigned Budget Officer. Review and submit to State Government.
              </p>
            </div>
          </div>
          {onNavigateBudgetApprovals && (
            <button
              type="button"
              onClick={onNavigateBudgetApprovals}
              className="px-3.5 py-1.5 bg-[#007A61] hover:bg-[#00604c] text-white font-bold text-xs rounded-xl transition-all shadow-xs flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
            >
              <span>Review Approvals</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {/* Recent Problems Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-4 space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-100 pb-3 gap-3">
          <div>
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-wide">Civic Problems</h2>
            <p className="text-[10px] text-slate-400 font-medium">Manage and track your assigned directives</p>
          </div>
          
          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('Active')}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-extrabold uppercase tracking-wider transition-all ${
                activeTab === 'Active' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Active / Upcoming
            </button>
            <button
              onClick={() => setActiveTab('Forwarded')}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-extrabold uppercase tracking-wider transition-all ${
                activeTab === 'Forwarded' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Forwarded
            </button>
            <button
              onClick={() => setActiveTab('Resolved')}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-extrabold uppercase tracking-wider transition-all ${
                activeTab === 'Resolved' ? 'bg-[#007A61] text-white shadow-xs' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Resolved
            </button>
          </div>

          {onNavigateProblems && (
            <button
              type="button"
              onClick={onNavigateProblems}
              className="text-xs font-bold text-[#007A61] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View All ({problems.length})</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>

        {filteredProblems.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-xs font-medium">
            No civic problems found in this category.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="text-[10.5px] font-bold text-slate-400 uppercase border-b border-slate-100">
                  <th className="py-2 px-2">Problem Statement</th>
                  <th className="py-2 px-2">Citizen Location</th>
                  <th className="py-2 px-2 text-center">Priority</th>
                  <th className="py-2 px-2 text-center">Status</th>
                  <th className="py-2 px-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProblems.slice(0, 10).map((p) => {
                  const idKey = p.challengeId || p.id || p._id;
                  const locStr = [p.location?.panchayat || p.panchayat, p.location?.district || p.district || 'Ranchi'].filter(Boolean).join(', ');
                  return (
                    <tr key={idKey} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-2.5 px-2 max-w-xs">
                        <div className="font-bold text-slate-900 truncate">{p.title}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{idKey} • {p.domain}</div>
                      </td>
                      <td className="py-2.5 px-2 text-slate-600 truncate">{locStr}</td>
                      <td className="py-2.5 px-2 text-center whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded-full text-[9.5px] font-extrabold border ${
                          p.priority === 'Critical' ? 'bg-slate-900 text-white border-slate-900' :
                          p.priority === 'High' ? 'bg-slate-100 text-slate-900 border-slate-300' :
                          'bg-slate-50 text-slate-700 border-slate-200'
                        }`}>
                          {p.priority || 'Medium'}
                        </span>
                      </td>
                      <td className="py-2.5 px-2 text-center whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded-full text-[9.5px] font-extrabold border ${
                          p.status === 'Resolved' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
                          'bg-slate-100 text-slate-800 border-slate-200'
                        }`}>
                          {p.status || 'Assigned'}
                        </span>
                      </td>
                      <td className="py-2.5 px-2 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => onSelectProblem && onSelectProblem(p)}
                          className="px-2.5 py-1 bg-slate-900 hover:bg-[#007A61] text-white rounded-lg font-bold text-xs transition-colors cursor-pointer"
                        >
                          Take Action
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DepartmentOverview;
