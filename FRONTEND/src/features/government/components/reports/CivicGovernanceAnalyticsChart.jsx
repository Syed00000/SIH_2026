import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 text-white text-xs px-3 py-2 rounded-xs shadow-lg border border-slate-700">
        <div className="font-bold text-slate-200">{payload[0].name}</div>
        <div className="text-emerald-400 font-bold mt-0.5">
          {payload[0].value} Problem Statement{payload[0].value !== 1 ? 's' : ''}
        </div>
      </div>
    );
  }
  return null;
};

export const CivicGovernanceAnalyticsChart = ({ challenges = [], totalProblems = 0, departments = [] }) => {
  const statusData = useMemo(() => {
    let resolved = 0;
    let inProgress = 0;
    let pending = 0;

    if (Array.isArray(challenges) && challenges.length > 0) {
      challenges.forEach((c) => {
        const s = (c.status || '').toLowerCase();
        if (s === 'resolved' || s === 'completed' || c.acceptanceStatus === 'Accepted') {
          resolved++;
        } else if (s === 'under review' || s === 'escalated' || s === 'assigned' || c.assignedDepartment || c.assignedTechnician) {
          inProgress++;
        } else {
          pending++;
        }
      });
    }

    return [
      { name: 'Resolved / Verified', value: resolved, color: '#007A61' },
      { name: 'In Governance Action', value: inProgress, color: '#334155' },
      { name: 'Pending Triage Review', value: pending, color: '#94a3b8' }
    ];
  }, [challenges]);

  const totalEvaluated = statusData.reduce((s, d) => s + d.value, 0);

  const deptTierBreakdown = useMemo(() => {
    const counts = { 'State Ministry': 0, 'District Department': 0, 'Block / Tehsil Office': 0, 'Gram Panchayat / Ward': 0 };
    if (Array.isArray(departments) && departments.length > 0) {
      departments.forEach((d) => {
        const cat = d.category || '';
        if (cat === 'State Ministry') counts['State Ministry']++;
        else if (cat === 'District Department') counts['District Department']++;
        else if (cat.includes('Block')) counts['Block / Tehsil Office']++;
        else if (cat.includes('Ward') || cat.includes('Panchayat')) counts['Gram Panchayat / Ward']++;
      });
    }
    return Object.entries(counts);
  }, [departments]);

  const hasAnyCases = totalEvaluated > 0;

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 md:p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 bg-[#007A61]/10 text-[#007A61] rounded-lg">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">Citizen Problems & Department Action</h3>
            <p className="text-[11px] text-slate-500">Real-time citizen problems filed on portal and resolution progress across departments.</p>
          </div>
        </div>
        <div className="flex items-center space-x-2 text-xs">
          <span className="text-slate-500 font-medium">Total Problems:</span>
          <span className="font-bold text-[#007A61] bg-[#007A61]/10 px-2 py-0.5 rounded font-mono">{totalProblems || totalEvaluated} Reported</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-4 items-center">
        {/* Donut Chart: Resolution Rate */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center">
          <span className="text-[11px] font-bold uppercase text-slate-500 tracking-wider block mb-2 w-full text-left">Problem Resolution Status</span>
          {hasAnyCases ? (
            <>
              <div className="relative w-44 h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={statusData} cx="50%" cy="50%" innerRadius={50} outerRadius={70} dataKey="value" stroke="#ffffff" strokeWidth={2}>
                      {statusData.map((entry, idx) => (
                        <Cell key={`civic-${idx}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Total Cases</span>
                  <span className="text-xs font-mono font-bold text-slate-900">{totalProblems || totalEvaluated}</span>
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-2 mt-3">
                {statusData.map((s, idx) => (
                  <div key={idx} className="flex items-center space-x-1.5 text-[10px] font-medium text-slate-600">
                    <span className="w-2 h-2 rounded-xs" style={{ backgroundColor: s.color }} />
                    <span>{s.name} ({s.value})</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="h-44 w-full flex items-center justify-center bg-slate-50 border border-dashed border-slate-200 rounded-lg text-xs text-slate-400 font-medium">
              No problem cases recorded in database.
            </div>
          )}
        </div>

        {/* Real 4-Tier Governance Desk Coverage from Database */}
        <div className="lg:col-span-7 border-t lg:border-t-0 lg:border-l border-slate-100 lg:pl-5 pt-4 lg:pt-0">
          <span className="text-[11px] font-bold uppercase text-slate-500 tracking-wider block mb-3">Administrative Desk Roster by Governance Tier</span>
          <div className="grid grid-cols-2 gap-2.5">
            {deptTierBreakdown.map(([tier, count], idx) => (
              <div key={idx} className="p-3 bg-slate-50 border border-slate-100 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 truncate">{tier}</span>
                  <span className="text-xs font-black font-mono text-[#007A61]">{count}</span>
                </div>
                <span className="text-[10px] text-slate-400 font-medium block mt-1">Active Desks in Database</span>
              </div>
            ))}
          </div>
          <div className="mt-3 p-2.5 bg-emerald-50/50 border border-emerald-100 rounded-lg flex items-center space-x-2 text-[11px] text-emerald-900 font-medium">
            <CheckCircle2 className="w-4 h-4 text-[#007A61] shrink-0" />
            <span>Administrative telemetry synchronized with live Jharkhand Government line departments.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CivicGovernanceAnalyticsChart;
