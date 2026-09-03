import React, { useState, useEffect } from 'react';
import { CheckCircle2, Clock, Info, ShieldCheck, ChevronRight, Coins } from 'lucide-react';
import apiClient from '../../../../infrastructure/api/client.js';
import { projectCsrSyncService } from '../../services/projectCsrSyncService.js';

export const CSRFundUtilization = () => {
  const [data, setData] = useState({ projects: [], paymentsCount: 0 });
  const [loading, setLoading] = useState(true);
  const [selectedProjectId, setSelectedProjectId] = useState(null);

  const fetchUtilization = async () => {
    try {
      const res = await apiClient.get('government/funds/utilization');
      const payload = res.data?.data || res.data || { projects: [] };
      setData(payload);
      if (payload.projects?.length && !selectedProjectId) {
        setSelectedProjectId(payload.projects[0].projectId);
      }
    } catch {
      setData({ projects: [], paymentsCount: 0 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUtilization();
    const unsub = projectCsrSyncService.subscribe(() => fetchUtilization());
    return unsub;
  }, []);

  const activeProject = data.projects.find((p) => p.projectId === selectedProjectId) || data.projects[0];

  return (
    <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-2xs space-y-5 select-none">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3.5">
        <div>
          <h3 className="text-xs sm:text-sm font-black text-slate-900 tracking-wider uppercase">
            FUND UTILIZATION & MILESTONE LINKAGE
          </h3>
          <p className="text-[11px] text-slate-500 font-medium">
            Live tracking linked directly to Citizen Problem Statements and University research benches.
          </p>
        </div>
        <div className="flex items-center space-x-2 text-xs font-bold text-slate-700 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 shrink-0">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>{data.projects.length} Citizen Solution(s) Monitored</span>
        </div>
      </div>

      {loading ? (
        <div className="py-12 text-center text-xs text-slate-400 font-semibold">Loading utilization telemetry...</div>
      ) : data.projects.length === 0 ? (
        <div className="py-12 border border-slate-100 rounded-xl text-center text-slate-400 text-xs flex flex-col items-center justify-center">
          <Info className="w-6 h-6 text-slate-300 mb-2" />
          <span className="font-bold text-slate-700 text-sm">No Active Problem Statement Projects</span>
          <span className="text-[11px] text-slate-400 mt-1 max-w-sm">
            Citizen problem statements assigned to universities will automatically appear here with their live budget and milestone utilization.
          </span>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Active Project Card */}
          {activeProject && (
            <div className="bg-slate-50/70 border border-slate-200/90 rounded-xl p-4.5 space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-200/70 pb-3.5">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-[11px] px-2 py-0.5 bg-slate-200 text-slate-800 rounded">
                      {activeProject.projectId}
                    </span>
                    {activeProject.challengeId && (
                      <span className="font-mono text-[11px] text-slate-500">
                        {activeProject.challengeId}
                      </span>
                    )}
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                      {activeProject.budgetStatus}
                    </span>
                  </div>
                  <h4 className="text-sm font-extrabold text-slate-900 mt-1">
                    {activeProject.citizenProblem || activeProject.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Beneficiary: <span className="font-bold text-slate-700">{activeProject.universityName}</span> | Domain: <span className="font-semibold text-slate-700">{activeProject.domain}</span>
                  </p>
                </div>

                <div className="flex items-center space-x-4 bg-white px-4 py-2.5 rounded-lg border border-slate-200 shrink-0 shadow-3xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Sanctioned</span>
                    <span className="font-mono font-extrabold text-xs text-slate-900">{activeProject.budget}</span>
                  </div>
                  <div className="w-px h-7 bg-slate-200" />
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Disbursed</span>
                    <span className="font-mono font-extrabold text-xs text-emerald-600">{activeProject.disbursedAmount}</span>
                  </div>
                  <div className="w-px h-7 bg-slate-200" />
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Progress</span>
                    <span className="font-bold text-xs text-blue-600">{activeProject.progressPercentage}%</span>
                  </div>
                </div>
              </div>

              {/* Milestones Roadmaps */}
              <div className="space-y-2">
                <span className="text-[11px] font-extrabold uppercase text-slate-700 tracking-wider block">
                  Milestone Execution & Deliverables
                </span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                  {(activeProject.milestones?.length ? activeProject.milestones : [
                    { title: 'TRL-3 Problem Formulation & CAD', status: 'Completed', deadline: 'Phase 1' },
                    { title: 'TRL-4 Lab Rig Prototyping', status: 'In Progress', deadline: 'Phase 2' },
                    { title: 'TRL-6 Field Deployment & Verification', status: 'Pending', deadline: 'Phase 3' }
                  ]).slice(0, 3).map((m, idx) => (
                    <div key={idx} className="bg-white p-3 rounded-lg border border-slate-200/80 shadow-3xs space-y-1">
                      <div className="flex items-center justify-between text-[10.5px]">
                        <span className="font-bold text-slate-500">Stage 0{idx + 1}</span>
                        <span className={`px-1.5 py-0.5 rounded font-bold text-[9.5px] ${m.status === 'Completed' ? 'bg-emerald-50 text-emerald-700' : m.status === 'In Progress' ? 'bg-blue-50 text-blue-700' : 'bg-slate-100 text-slate-500'}`}>
                          {m.status || 'Pending'}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-slate-800 line-clamp-1">{m.title}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Budget Breakdown */}
              {Array.isArray(activeProject.budgetBreakdown) && activeProject.budgetBreakdown.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[11px] font-extrabold uppercase text-slate-700 tracking-wider block">
                    Sanctioned Line-Item Budget Allocation
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    {activeProject.budgetBreakdown.slice(0, 4).map((item, idx) => (
                      <div key={idx} className="bg-white p-2.5 rounded-lg border border-slate-200 flex justify-between items-center shadow-3xs">
                        <span className="text-slate-600 truncate mr-2 text-[11px] font-medium">{item.category || item.title}</span>
                        <span className="font-mono font-bold text-slate-900 text-xs shrink-0">{item.amount}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CSRFundUtilization;
