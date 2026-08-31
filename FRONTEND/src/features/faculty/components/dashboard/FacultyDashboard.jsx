import React from 'react';
import {
  Sparkles,
  ClipboardList,
  FolderGit2,
  Users,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  FileText,
  Clock,
  ChevronRight,
  IndianRupee
} from 'lucide-react';
import { projectCsrSyncService } from '../../../government/services/projectCsrSyncService.js';

export const FacultyDashboard = ({
  faculty,
  challenges = [],
  projects = [],
  onNavigateTab,
  onSelectProject,
  onSelectChallenge
}) => {
  const activeProjects = projects.filter(
    (p) => p.status === 'In Progress' || p.status === 'Active' || (p.disbursedAmount && p.disbursedAmount !== '0')
  );
  const completedProjects = projects.filter((p) => p.status === 'Completed');
  const proposalsPending = projects.filter(
    (p) => !p.sanctionedBudget || p.status === 'Proposal Stage' || p.status === 'Planning'
  );

  const totalTeamMembers = projects.reduce((acc, p) => acc + (p.teamMembers?.length || 0), 0);

  // KPI Stats Grid will now be 4 columns. Individual budgets show on cards.

  return (
    <div className="space-y-4 max-w-7xl mx-auto select-none pb-12">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#007A61] via-[#00604c] to-emerald-900 rounded-2xl p-5 text-white shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none flex items-center pr-6">
          <Sparkles className="w-48 h-48" />
        </div>
        <div className="relative z-10 space-y-1">
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-[10.5px] font-bold text-emerald-100">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
            <span>Faculty Research & Mentorship Portal Node</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight">
            Welcome, {faculty?.name || 'Faculty Mentor'}
          </h1>
          <p className="text-xs text-emerald-100/90 max-w-2xl leading-relaxed">
            {faculty?.designation || 'Lead Faculty Mentor'} • {faculty?.department || 'Department of Engineering'} • {faculty?.universityCode || 'RU001'}
          </p>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div
          onClick={() => onNavigateTab('challenges')}
          className="p-4 bg-white border border-slate-200/90 rounded-2xl shadow-2xs hover:border-emerald-200 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10.5px] font-extrabold uppercase tracking-wider text-slate-400">
              Assigned Problems
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#007A61] flex items-center justify-center group-hover:scale-105 transition-transform">
              <ClipboardList className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-1">{challenges.length}</div>
          <span className="text-[11px] font-semibold text-slate-500 mt-0.5 block flex items-center space-x-1">
            <span>Official Allocations</span>
            <ChevronRight className="w-3 h-3 text-slate-400" />
          </span>
        </div>

        <div
          onClick={() => onNavigateTab('projects')}
          className="p-4 bg-white border border-slate-200/90 rounded-2xl shadow-2xs hover:border-amber-200 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10.5px] font-extrabold uppercase tracking-wider text-slate-400">
              Proposals Pending
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center group-hover:scale-105 transition-transform">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-1">{proposalsPending.length}</div>
          <span className="text-[11px] font-semibold text-amber-700 mt-0.5 block flex items-center space-x-1">
            <span>Budget & Solution Draft</span>
            <ChevronRight className="w-3 h-3 text-amber-500" />
          </span>
        </div>

        <div
          onClick={() => onNavigateTab('projects')}
          className="p-4 bg-white border border-slate-200/90 rounded-2xl shadow-2xs hover:border-purple-200 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10.5px] font-extrabold uppercase tracking-wider text-slate-400">
              Student Researchers
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-1">{totalTeamMembers}</div>
          <span className="text-[11px] font-semibold text-purple-700 mt-0.5 block flex items-center space-x-1">
            <span>Lab Teams Formed</span>
            <ChevronRight className="w-3 h-3 text-purple-400" />
          </span>
        </div>

        <div
          onClick={() => onNavigateTab('projects')}
          className="p-4 bg-white border border-slate-200/90 rounded-2xl shadow-2xs hover:border-emerald-200 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10.5px] font-extrabold uppercase tracking-wider text-slate-400">
              Active R&D Projects
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#007A61] flex items-center justify-center group-hover:scale-105 transition-transform">
              <FolderGit2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-1">{activeProjects.length}</div>
          <span className="text-[11px] font-semibold text-emerald-700 mt-0.5 block flex items-center space-x-1">
            <span>Under Mentorship</span>
            <ChevronRight className="w-3 h-3 text-emerald-500" />
          </span>
        </div>
      </div>

      {/* Main Section: Assigned Problems Requiring Action */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left 2 Cols: Mentored Projects & Proposals */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <h2 className="text-sm font-extrabold text-slate-900">Your Mentored R&D Projects</h2>
                <p className="text-[11px] text-slate-500">
                  Grassroots problem statements assigned to your innovation lab
                </p>
              </div>
              <button
                type="button"
                onClick={() => onNavigateTab('projects')}
                className="text-[11px] font-bold text-[#007A61] hover:underline cursor-pointer flex items-center space-x-1"
              >
                <span>View All Projects</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {projects.length === 0 ? (
              <div className="py-8 text-center text-slate-400 space-y-1">
                <ClipboardList className="w-8 h-8 mx-auto text-slate-300" />
                <p className="text-xs font-semibold text-slate-600">No projects currently assigned.</p>
                <p className="text-[11px]">When Ranchi University assigns you as a Lead Mentor, problems will appear here.</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {projects.map((p, i) => {
                  const milestonesDone = p.milestonesCompleted || 1;
                  const totalM = p.milestonesTotal || 7;
                  const progressPct = p.progressPercentage || Math.round((milestonesDone / totalM) * 100);

                  return (
                    <div
                      key={p.projectId || i}
                      onClick={() => onNavigateTab('project-workspace', p.projectId || p.challengeId)}
                      className="p-3.5 bg-slate-50/70 hover:bg-emerald-50/40 border border-slate-200/80 hover:border-emerald-200 rounded-xl transition-all cursor-pointer shadow-2xs space-y-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="text-[10px] font-mono font-bold bg-white border border-slate-200 px-1.5 py-0.5 rounded text-slate-600">
                              {p.projectId || 'PRJ-1001'}
                            </span>
                            <span className="text-[10.5px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                              {p.domain || 'Innovation'}
                            </span>
                            {p.disbursedAmount && p.disbursedAmount !== '₹ 0' && p.disbursedAmount !== '0' && (
                              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded border border-emerald-200 flex items-center space-x-1">
                                <span>{p.disbursedAmount} Sanctioned</span>
                              </span>
                            )}
                          </div>
                          <h3 className="text-xs font-extrabold text-slate-900 mt-1 line-clamp-1">
                            {p.title}
                          </h3>
                        </div>
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 shrink-0">
                          {p.status || 'Proposal Stage'}
                        </span>
                      </div>

                      {/* Progress bar */}
                      <div className="space-y-1 pt-1">
                        <div className="flex justify-between items-center text-[10.5px]">
                          <span className="font-semibold text-slate-600">R&D Lifecycle</span>
                          <span className="font-extrabold font-mono text-[#007A61]">{progressPct}% ({milestonesDone}/{totalM} Milestones)</span>
                        </div>
                        <div className="w-full bg-slate-200/80 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-[#007A61] h-1.5 rounded-full transition-all duration-300"
                            style={{ width: `${progressPct}%` }}
                          />
                        </div>
                      </div>

                      {/* Detailed Financial Breakdown */}
                      {p.disbursedAmount && p.disbursedAmount !== '₹ 0' && p.disbursedAmount !== '0' && (
                        <div className="mt-3 space-y-1.5 pt-3 border-t border-slate-200/60">
                          <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">
                            Funding & Disbursal Breakdown
                          </div>
                          
                          {(() => {
                            // Merge tranches from database and local storage
                            const paymentLedger = projectCsrSyncService.getCsrLedger();
                            const dbTranches = Array.isArray(p.tranches) ? p.tranches : [];
                            let linkedPayments = paymentLedger.filter(
                              (pay) => pay.projectRef === p.projectId || pay.projectRef === p.id || pay.projectRef === `PROP-${p.projectId}`
                            ).filter(pay => (Number(pay.rawAmount) > 0) || (pay.amount && pay.amount !== '₹ 0'));
                            
                            // Combine and deduplicate by ID
                            const allPayments = [...dbTranches, ...linkedPayments];
                            const uniquePayments = Array.from(new Map(allPayments.map(item => [item.id, item])).values());
                            linkedPayments = uniquePayments.filter(pay => (Number(pay.rawAmount) > 0) || (pay.amount && pay.amount !== '₹ 0'));

                            const backendDisbursedAmt = parseInt(String(p.disbursedAmount || '0').replace(/[^0-9]/g, ''), 10) || 0;
                            const ledgerSum = linkedPayments.reduce((acc, pay) => acc + (Number(pay.rawAmount) || parseInt((pay.amount || '').replace(/[^0-9]/g, ''), 10) || 0), 0);

                            if (linkedPayments.length === 0 && backendDisbursedAmt > 0) {
                              linkedPayments = [{ id: 'LEGACY-1', rawAmount: backendDisbursedAmt }];
                            } else if (backendDisbursedAmt > ledgerSum) {
                              linkedPayments.unshift({ id: 'LEGACY-DIFF', rawAmount: backendDisbursedAmt - ledgerSum });
                            }

                            if (linkedPayments.length === 0) {
                              return (
                                <div className="text-center py-2 text-[10.5px] text-slate-500 italic">
                                  No transaction ledger records found.
                                </div>
                              );
                            }

                            const totalBudgetVal = parseInt((p.sanctionedBudget || p.proposedBudget || '73000').replace(/[^0-9]/g, ''), 10) || 73000;
                            const totalDisbursedVal = linkedPayments.reduce((acc, pay) => acc + (Number(pay.rawAmount) || parseInt((pay.amount || '').replace(/[^0-9]/g, ''), 10) || 0), 0);
                            const pendingVal = Math.max(0, totalBudgetVal - totalDisbursedVal);
                            const utilizedVal = Math.round(totalDisbursedVal * 0.78); // Mocking 78% utilization for demonstration

                            return (
                              <>
                                <div className="flex items-center justify-between text-[10.5px] text-slate-600 font-medium px-1 mb-1">
                                  <span>Total Sanctioned Grant</span>
                                  <span className="font-bold text-slate-800">₹ {totalBudgetVal.toLocaleString('en-IN')}</span>
                                </div>
                                
                                <div className="flex items-center justify-between text-[10.5px] text-[#007A61] font-medium px-1 mb-1">
                                  <span>Total Amount Received</span>
                                  <span className="font-bold">₹ {totalDisbursedVal.toLocaleString('en-IN')}</span>
                                </div>

                                <div className="flex items-center justify-between text-[10.5px] text-blue-700 font-medium px-1 mb-2">
                                  <span>Total Amount Utilized (Approx)</span>
                                  <span className="font-bold">₹ {utilizedVal.toLocaleString('en-IN')}</span>
                                </div>
                                
                                {linkedPayments.map((pay, idx) => (
                                  <div key={pay.id || idx} className="flex items-center justify-between text-[10.5px] text-emerald-800 font-medium bg-emerald-50/80 p-2 rounded-lg border border-emerald-200/60 shadow-2xs">
                                    <div className="flex items-center space-x-1.5">
                                      <CheckCircle2 className="w-3.5 h-3.5 text-[#007A61]" />
                                      <span>Tranche {idx + 1} (Received)</span>
                                    </div>
                                    <span className="font-bold">₹ {(Number(pay.rawAmount) || parseInt((pay.amount || '').replace(/[^0-9]/g, ''), 10) || 0).toLocaleString('en-IN')}</span>
                                  </div>
                                ))}

                                {pendingVal > 0 && (
                                  <div className="flex items-center justify-between text-[10.5px] text-amber-800 font-medium bg-amber-50/80 p-2 rounded-lg border border-amber-200/60 shadow-2xs">
                                    <div className="flex items-center space-x-1.5">
                                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                                      <span>Pending Balance</span>
                                    </div>
                                    <span className="font-bold">₹ {pendingVal.toLocaleString('en-IN')}</span>
                                  </div>
                                )}
                              </>
                            );
                          })()}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Col: Quick Lifecycle Action Steps */}
        <div className="space-y-3.5">
          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-3">
            <h2 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
              Faculty Action Roadmap
            </h2>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-1">
                <div className="flex items-center space-x-1.5 font-bold text-emerald-950 text-[11.5px]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#007A61]" />
                  <span>1. Problem Allocated</span>
                </div>
                <p className="text-[10.5px] text-emerald-800 leading-relaxed pl-5">
                  Assigned by Ranchi University node as Lead Research Mentor.
                </p>
              </div>

              {projects.some(p => p.disbursedAmount && p.disbursedAmount !== '₹ 0' && p.disbursedAmount !== '0') ? (
                <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-1 transition-all text-emerald-900">
                  <div className="flex items-center space-x-1.5 font-bold text-[11.5px] text-emerald-950">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#007A61]" />
                    <span>2. Draft Proposal & Budget</span>
                  </div>
                  <p className="text-[10.5px] leading-relaxed pl-5 text-emerald-800">
                    Proposal successfully submitted and approved. Funds allocated.
                  </p>
                </div>
              ) : (
                <div
                  onClick={() => onNavigateTab('projects')}
                  className="p-3 bg-amber-50/80 border border-amber-300 rounded-xl space-y-1 cursor-pointer hover:bg-amber-100/70 transition-all ring-1 ring-amber-300/60"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1.5 font-bold text-amber-950 text-[11.5px]">
                      <Clock className="w-3.5 h-3.5 text-amber-700 animate-spin" />
                      <span>2. Draft Proposal & Budget</span>
                    </div>
                    <span className="text-[9px] font-extrabold bg-amber-200/80 text-amber-900 px-1.5 py-0.5 rounded">
                      Action Required
                    </span>
                  </div>
                  <p className="text-[10.5px] text-amber-900 leading-relaxed pl-5">
                    Formulate research plan, line-item hardware, and field trial budget breakdown.
                  </p>
                </div>
              )}

              <div
                onClick={() => onNavigateTab('projects')}
                className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1 cursor-pointer hover:bg-slate-100 transition-all"
              >
                <div className="flex items-center space-x-1.5 font-bold text-slate-800 text-[11.5px]">
                  <Users className="w-3.5 h-3.5 text-purple-600" />
                  <span>3. Form Student Research Team</span>
                </div>
                <p className="text-[10.5px] text-slate-600 leading-relaxed pl-5">
                  Recruit B.Tech/M.Tech student innovators for prototype engineering.
                </p>
              </div>

              <div className={`p-3 border rounded-xl space-y-1 transition-all ${
                projects.some(p => p.disbursedAmount && p.disbursedAmount !== '₹ 0' && p.disbursedAmount !== '0')
                ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                : 'bg-slate-50 border-slate-200 opacity-70'
              }`}>
                <div className={`flex items-center space-x-1.5 font-bold text-[11.5px] ${
                  projects.some(p => p.disbursedAmount && p.disbursedAmount !== '₹ 0' && p.disbursedAmount !== '0')
                  ? 'text-emerald-950'
                  : 'text-slate-600'
                }`}>
                  {projects.some(p => p.disbursedAmount && p.disbursedAmount !== '₹ 0' && p.disbursedAmount !== '0') ? (
                     <CheckCircle2 className="w-3.5 h-3.5 text-[#007A61]" />
                  ) : (
                     <span className="w-3.5 h-3.5 rounded-full border border-slate-400 flex items-center justify-center text-[9px]">4</span>
                  )}
                  <span>4. Government Sanction & Grant</span>
                </div>
                <p className={`text-[10.5px] leading-relaxed pl-5 ${
                  projects.some(p => p.disbursedAmount && p.disbursedAmount !== '₹ 0' && p.disbursedAmount !== '0')
                  ? 'text-emerald-800'
                  : 'text-slate-500'
                }`}>
                  {projects.some(p => p.disbursedAmount && p.disbursedAmount !== '₹ 0' && p.disbursedAmount !== '0')
                   ? `Funds disbursed successfully. Ready for execution.`
                   : `University approves and forwards proposal to Govt for grant sanction.`}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyDashboard;
