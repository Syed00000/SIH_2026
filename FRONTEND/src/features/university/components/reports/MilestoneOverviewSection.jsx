import React from 'react';
import { CheckCircle2, Clock, Hourglass, AlertCircle, CalendarClock } from 'lucide-react';

const StatBox = ({ label, value, sub, icon: Icon }) => (
  <div className="flex flex-col items-center justify-center p-6 rounded-lg border border-zinc-200 bg-white hover:shadow-sm transition-shadow">
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
    <div className="rounded-xl border bg-card text-card-foreground shadow-sm bg-white overflow-hidden w-full">
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
        <div className="flex-1 flex flex-col">
          <div className="bg-zinc-50/50 rounded-t-lg border-b border-zinc-200 px-6 py-4 grid grid-cols-12 gap-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
            <div className="col-span-3">Project Stage</div>
            <div className="col-span-2 text-right">Total</div>
            <div className="col-span-2 text-right">Completed</div>
            <div className="col-span-2 text-right">In Prog</div>
            <div className="col-span-1 text-right">Pend</div>
            <div className="col-span-2 pl-6">Completion</div>
          </div>
          <div className="divide-y divide-zinc-100 overflow-y-auto">
            {milestoneByStage.map((s) => (
              <div key={s.stage} className="px-6 py-4 grid grid-cols-12 gap-4 items-center text-sm group hover:bg-zinc-50 transition-colors">
                <div className="col-span-3 font-semibold text-zinc-900">{s.stage}</div>
                <div className="col-span-2 text-right font-medium text-zinc-500">{s.total}</div>
                <div className="col-span-2 text-right font-bold text-zinc-950">{s.completed}</div>
                <div className="col-span-2 text-right font-bold text-zinc-700">{s.inProgress}</div>
                <div className="col-span-1 text-right font-medium text-zinc-400">{s.pending}</div>
                <div className="col-span-2 pl-6 flex items-center space-x-3">
                  <span className="font-bold text-zinc-900 w-10 text-right">{s.completionPct}%</span>
                  <div className="flex-1 h-2 bg-zinc-100 rounded-full overflow-hidden">
                    <div className="h-full bg-zinc-900 rounded-full" style={{ width: `${s.completionPct}%` }} />
                  </div>
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
