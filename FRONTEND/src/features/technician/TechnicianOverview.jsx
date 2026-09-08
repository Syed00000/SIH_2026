import React from 'react';
import { Wrench, Clock, CheckCircle2, ArrowRight } from 'lucide-react';
import { TechnicianProblemRow } from './TechnicianProblemRow.jsx';

export const TechnicianOverview = ({
  user,
  tasks,
  counts,
  loading,
  onNavigateTasks,
  onSelectChallenge
}) => {
  const name = user?.fullName || user?.name || 'Field Technician';
  const dept = user?.department || user?.departmentName || 'Department Operations';
  const recentTasks = tasks.slice(0, 5);

  const getPriorityBadge = (p) => {
    const pr = (p || 'Medium').toLowerCase();
    if (pr === 'urgent' || pr === 'high') return 'bg-rose-100 text-rose-800 border-rose-200';
    if (pr === 'medium') return 'bg-amber-100 text-amber-800 border-amber-200';
    return 'bg-blue-100 text-blue-800 border-blue-200';
  };

  return (
    <div className="space-y-6 text-left select-none animate-in fade-in duration-150">
      {/* Welcome Hero Banner */}
      <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-[#064e3b] via-[#047857] to-[#007A61] text-white shadow-md relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative z-10 space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/20 text-white backdrop-blur-xs">
              Field Technician Workspace
            </span>
            <span className="text-white/80 text-xs truncate max-w-[250px]">• {dept}</span>
          </div>
          <h2 className="text-xl font-black tracking-tight text-white">
            Welcome back, {name}
          </h2>
          <p className="text-xs text-white/90 max-w-xl leading-relaxed">
            Review civic problems assigned to your technician badge by block in-charges. Click any problem to open its action panel, accept assignment, and mark as done.
          </p>
        </div>

        <button
          type="button"
          onClick={onNavigateTasks}
          className="relative z-10 px-4 py-2.5 bg-white text-[#064e3b] hover:bg-emerald-50 rounded-xl text-xs font-bold shadow-xs transition flex items-center gap-2 self-start md:self-auto cursor-pointer"
        >
          <span>View All Assigned Problems</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Assigned Problems', val: counts.total, icon: Wrench, color: 'text-slate-900', bg: 'bg-white', border: 'border-slate-200' },
          { label: 'Pending Acceptance', val: counts.pending, icon: Clock, color: 'text-amber-700', bg: 'bg-amber-50/40', border: 'border-amber-200' },
          { label: 'Active on Field', val: counts.active, icon: Wrench, color: 'text-blue-700', bg: 'bg-blue-50/40', border: 'border-blue-200' },
          { label: 'Completed / Done', val: counts.completed, icon: CheckCircle2, color: 'text-emerald-700', bg: 'bg-emerald-50/40', border: 'border-emerald-200' },
        ].map((m) => (
          <div key={m.label} className={`p-4 rounded-2xl border ${m.border} ${m.bg} shadow-2xs`}>
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-xs font-bold text-slate-600">{m.label}</span>
              <m.icon className="w-4 h-4" />
            </div>
            <span className={`text-2xl font-black ${m.color}`}>{loading ? '...' : m.val}</span>
          </div>
        ))}
      </div>

      {/* Recent Assigned Problems Proper List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h3 className="text-sm font-black text-slate-900">Recent Assigned Problems</h3>
            <span className="text-xs text-slate-500 font-medium">({tasks.length} total)</span>
          </div>
          {tasks.length > 5 && (
            <button
              type="button"
              onClick={onNavigateTasks}
              className="text-xs font-bold text-[#007A61] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>See all</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl shadow-2xs overflow-hidden">
          {loading ? (
            <div className="p-10 text-center text-slate-400 text-xs font-semibold">
              Loading assignments...
            </div>
          ) : recentTasks.length === 0 ? (
            <div className="p-10 text-center space-y-1.5">
              <p className="text-sm font-bold text-slate-800">No active assignments</p>
              <p className="text-xs text-slate-500">You currently have zero pending problem statements assigned to your badge.</p>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-600">
                    <tr>
                      <th className="py-3 px-3.5 font-bold w-12 text-center">#</th>
                      <th className="py-3 px-3.5 font-bold min-w-[200px]">Problem Statement</th>
                      <th className="py-3 px-3.5 font-bold">Location</th>
                      <th className="py-3 px-3.5 font-bold">Domain</th>
                      <th className="py-3 px-3.5 font-bold">Priority</th>
                      <th className="py-3 px-3.5 font-bold">Status</th>
                      <th className="py-3 px-3.5 font-bold text-center w-24">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {recentTasks.map((t, idx) => (
                      <TechnicianProblemRow
                        key={t.challengeId || t.id || t._id}
                        task={t}
                        rowNumber={idx + 1}
                        onSelect={onSelectChallenge}
                        getPriorityBadge={getPriorityBadge}
                      />
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards List */}
              <div className="md:hidden divide-y divide-slate-100">
                {recentTasks.map((t, idx) => (
                  <TechnicianProblemRow
                    key={t.challengeId || t.id || t._id}
                    task={t}
                    rowNumber={idx + 1}
                    onSelect={onSelectChallenge}
                    getPriorityBadge={getPriorityBadge}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TechnicianOverview;
