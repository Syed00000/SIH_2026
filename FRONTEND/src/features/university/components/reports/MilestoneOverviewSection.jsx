import React from 'react';
import { CheckCircle2, Clock, Hourglass, AlertCircle, CalendarClock } from 'lucide-react';

const StatBox = ({ label, value, sub, icon: Icon }) => (
  <div className="flex flex-col items-center justify-center p-6 rounded-none border border-zinc-200 bg-white hover:shadow-none transition-shadow">
    <div className="flex items-center space-x-2 mb-3">
      <Icon className="w-4 h-4 text-zinc-500" />
      <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">{label}</span>
    </div>
    <div className="text-3xl font-bold tracking-tight text-zinc-950">{value}</div>
    {sub && <div className="text-xs font-medium mt-2 text-zinc-500">{sub}</div>}
  </div>
);

export const MilestoneOverviewSection = ({
  totalMilestones = 0, completedMil = 0, inProgressMil = 0, pendingMil = 0, overdueMil = 0,
  milestoneByStage = []
}) => {
  return (
    <div className="rounded-none border bg-card text-card-foreground shadow-none bg-white overflow-hidden w-full">
      <div className="flex flex-col space-y-1.5 p-6 border-b border-zinc-100">
        <h3 className="text-lg font-semibold leading-none tracking-tight text-zinc-950">Milestone Tracking</h3>
        <p className="text-sm text-muted-foreground text-zinc-500">Detailed breakdown of milestone completion across project stages.</p>
      </div>

      <div className="p-6 flex flex-col gap-8">
        {/* Top KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <StatBox label="Total" value={totalMilestones.toLocaleString()} icon={CalendarClock} />
          <StatBox label="Completed" value={completedMil.toLocaleString()} sub={`${Math.round((completedMil/totalMilestones)*100 || 0)}% of total`} icon={CheckCircle2} />
          <StatBox label="In Progress" value={inProgressMil.toLocaleString()} sub={`${Math.round((inProgressMil/totalMilestones)*100 || 0)}% of total`} icon={Clock} />
          <StatBox label="Pending" value={pendingMil.toLocaleString()} sub={`${Math.round((pendingMil/totalMilestones)*100 || 0)}% of total`} icon={Hourglass} />
          <StatBox label="Overdue" value={overdueMil.toLocaleString()} sub={`${Math.round((overdueMil/totalMilestones)*100 || 0)}% of total`} icon={AlertCircle} />
        </div>

        <div className="w-full h-[1px] bg-zinc-100" />

        {/* Detailed Table */}
        <div className="flex-1 flex flex-col border border-slate-200 rounded-none overflow-hidden">
          <div className="bg-slate-50 border-b border-slate-200 px-5 py-3.5 grid grid-cols-12 gap-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            <div className="col-span-4">Research & Implementation Stage</div>
            <div className="col-span-2 text-center">Timeline</div>
            <div className="col-span-2 text-right">Status</div>
            <div className="col-span-4 pl-4 text-right">Stage Completion</div>
          </div>
          <div className="divide-y divide-slate-100 overflow-y-auto bg-white">
            {milestoneByStage.map((s, idx) => (
              <div key={s.stage || idx} className="px-5 py-3.5 grid grid-cols-12 gap-3 items-center text-xs group hover:bg-slate-50/70 transition-colors">
                <div className="col-span-4">
                  <div className="font-bold text-slate-900">{s.stage}</div>
                  {s.deliverable && (
                    <div className="text-[11px] text-slate-500 truncate mt-0.5" title={s.deliverable}>
                      {s.deliverable}
                    </div>
                  )}
                </div>
                <div className="col-span-2 text-center">
                  <span className="px-2 py-0.5 bg-slate-100 border border-slate-200 text-slate-700 text-[10.5px] font-mono font-semibold rounded">
                    {s.targetDays || 'Phase Active'}
                  </span>
                </div>
                <div className="col-span-2 text-right">
                  <span className={`px-2 py-0.5 text-[10.5px] font-bold rounded-none ${
                    s.completionPct === 100
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-700 border border-slate-200'
                  }`}>
                    {s.completionPct === 100 ? '✓ Verified' : 'In Progress'}
                  </span>
                </div>
                <div className="col-span-4 pl-4 flex items-center justify-end space-x-2.5">
                  <div className="flex-1 h-2 bg-slate-100 rounded-none overflow-hidden">
                    <div className="h-full bg-slate-900 rounded-none" style={{ width: `${s.completionPct}%` }} />
                  </div>
                  <span className="font-bold text-slate-900 font-mono w-10 text-right">{s.completionPct}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MilestoneOverviewSection;
