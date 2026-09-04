import React, { useState } from 'react';
import {
  FolderGit2,
  CheckCircle2,
  Clock,
  ChevronRight,
  Calculator,
  Users,
  Send,
  Loader2,
  Calendar,
  AlertCircle,
  Trash2
} from 'lucide-react';
import { universityApiService } from '../../../university/services/universityApiService.js';
import { projectCsrSyncService } from '../../../government/services/projectCsrSyncService.js';

export const FacultyProjectsPanel = ({
  projects = [],
  faculty,
  onRefresh,
  onNavigateTab,
  initialProjectId = null,
  hideHeader = false
}) => {
  const [selectedProject, setSelectedProject] = useState(
    initialProjectId 
      ? projects.find(p => p.projectId === initialProjectId || p.challengeId === initialProjectId) || projects[0]
      : projects[0] || null
  );
  const [updating, setUpdating] = useState(false);

  const handleAdvanceMilestone = async (project, milestoneId) => {
    setUpdating(true);
    try {
      const updatedMilestones = project.milestones?.map((m) => {
        if (m.id === milestoneId) {
          return { ...m, status: 'Completed', completedAt: new Date() };
        }
        if (m.id === milestoneId + 1 && m.status === 'Pending') {
          return { ...m, status: 'In Progress' };
        }
        return m;
      }) || [];

      const completedCount = updatedMilestones.filter((m) => m.status === 'Completed').length;
      const progressPercentage = Math.round((completedCount / 7) * 100);

      const updated = {
        ...project,
        milestones: updatedMilestones,
        milestonesCompleted: completedCount,
        progressPercentage,
        status: progressPercentage === 100 ? 'Completed' : 'In Progress'
      };

      await universityApiService.updateProject(project.projectId || project._id, updated);
      setSelectedProject(updated);
      if (onRefresh) await onRefresh();
    } catch (err) {
      console.error('Milestone advance error:', err);
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteProject = async (proj) => {
    const pid = proj?.projectId || proj?._id;
    if (!pid) return;
    if (window.confirm(`Are you sure you want to delete/withdraw project "${proj.title || pid}"? All associated milestones and prototype drafts will be permanently purged.`)) {
      try {
        await universityApiService.deleteProject(pid, faculty?.universityCode || 'RU001');
        if (selectedProject?.projectId === pid || selectedProject?._id === pid) {
          setSelectedProject(null);
        }
        if (onRefresh) await onRefresh();
      } catch (err) {
        alert('Failed to delete project: ' + err.message);
      }
    }
  };

  return (
    <div className={`space-y-4 max-w-7xl mx-auto select-none ${hideHeader ? '' : 'pb-12'}`}>
      {/* Header */}
      {!hideHeader && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-200">
          <div>
            <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500 mb-1">
              <span>Faculty Research Node</span>
              <span>/</span>
              <span className="text-slate-900 font-bold">R&D Projects & Prototypes</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center space-x-2">
              <FolderGit2 className="w-5 h-5 text-[#007A61]" />
              <span>Active Prototyping & Project Tracking</span>
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Monitor R&D milestones, student engineering progress, and district pilot trial handovers.
            </p>
          </div>
        </div>
      )}

      {projects.length === 0 ? (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-10 text-center text-slate-400 space-y-2">
          <FolderGit2 className="w-10 h-10 mx-auto text-slate-300" />
          <h3 className="font-bold text-slate-700 text-sm">No Active Projects</h3>
          <p className="text-xs max-w-md mx-auto">
            When Ranchi University assigns problem statements to you, your active R&D workspaces will appear here.
          </p>
        </div>
      ) : (
        <div className={`grid grid-cols-1 gap-4 ${hideHeader ? 'lg:grid-cols-1' : 'lg:grid-cols-3'}`}>
          {/* Project List */}
          {!hideHeader && (
            <div className="space-y-2.5">
              <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                Mentored Projects ({projects.length})
              </h3>
              {projects.map((p, idx) => {
                const isSelected = (selectedProject?.projectId || selectedProject?.challengeId) === (p.projectId || p.challengeId);
                const done = p.milestonesCompleted || 1;
                const pct = p.progressPercentage || Math.round((done / 7) * 100);

                return (
                  <div
                    key={p.projectId || idx}
                    onClick={() => setSelectedProject(p)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer space-y-2 shadow-2xs ${
                      isSelected
                        ? 'bg-emerald-50/50 border-[#007A61] ring-1 ring-[#007A61]'
                        : 'bg-white border-slate-200/90 hover:border-emerald-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold bg-white border border-slate-200 px-1.5 py-0.5 rounded text-slate-600">
                        {p.projectId}
                      </span>
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${
                        p.prototypeStatus === 'Approved'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : p.prototypeStatus === 'In Review'
                          ? 'bg-blue-50 text-blue-800 border-blue-200'
                          : 'bg-amber-50 text-amber-800 border-amber-200'
                      }`}>
                        {p.prototypeStatus === 'Approved' ? '✓ Prototype Done' : p.prototypeStatus === 'In Review' ? '⏳ Proto In Review' : (p.status || 'Proposal Stage')}
                      </span>
                    </div>

                    <h4 className="text-xs font-extrabold text-slate-900 line-clamp-2">
                      {p.title}
                    </h4>

                    <div className="space-y-1 pt-1">
                      <div className="flex justify-between items-center text-[10px] font-semibold text-slate-600">
                        <span>Progress</span>
                        <span className="font-mono text-[#007A61] font-bold">{pct}%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-[#007A61] h-1.5 rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Project Details & Milestone Stepper */}
          {selectedProject && (
            <div className={hideHeader ? "" : "lg:col-span-2 space-y-4"}>
              <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs space-y-4">
                {/* Top Info */}
                <div className="space-y-2 pb-3 border-b border-slate-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-mono font-bold bg-slate-100 px-2 py-0.5 rounded text-slate-700">
                        {selectedProject.projectId}
                      </span>
                      <span className="text-[10.5px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {selectedProject.domain}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteProject(selectedProject)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-rose-200 flex items-center space-x-1 text-xs"
                      title="Delete / Withdraw Project"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                      <span className="text-[11px] font-bold text-rose-600">Delete Project</span>
                    </button>
                  </div>
                  <h2 className="text-base font-black text-slate-900">
                    {selectedProject.title}
                  </h2>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {selectedProject.problemStatement || selectedProject.description}
                  </p>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Sanctioned Grant</span>
                    <span className="font-extrabold text-slate-900 text-xs mt-0.5 block truncate">
                      {selectedProject.sanctionedBudget || (selectedProject.budget && selectedProject.budget !== 'N/A' ? selectedProject.budget : 'N/A (Pending Proposal)')}
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Student Team</span>
                    <span className="font-extrabold text-slate-900 text-xs mt-0.5 block truncate">
                      {selectedProject.teamMembers?.length ? `${selectedProject.teamMembers.length} Researchers` : 'Formation in Progress'}
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Prototype ETA</span>
                    <span className="font-extrabold text-slate-900 text-xs mt-0.5 block truncate">
                      {selectedProject.prototypeData?.timeline || 'Not Specified'}
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl col-span-2 sm:col-span-1">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block tracking-wider">Assigned Tasks Status</span>
                    <span className="font-extrabold text-slate-900 text-xs mt-0.5 block">
                      <span className="text-[#007A61]">
                        {selectedProject.governmentStatus === 'Approved' || selectedProject.status === 'Completed' ? 7 : (selectedProject.milestonesCompleted || 1)} Completed
                      </span>
                      {' • '}
                      <span className="text-amber-600">
                        {selectedProject.governmentStatus === 'Approved' || selectedProject.status === 'Completed' ? 0 : 7 - (selectedProject.milestonesCompleted || 1)} Pending
                      </span>
                    </span>
                  </div>
                </div>

                {/* Detailed Financial Breakdown */}
                {selectedProject.disbursedAmount && selectedProject.disbursedAmount !== '₹ 0' && selectedProject.disbursedAmount !== '0' && (
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <h3 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                      Funding & Disbursal Breakdown
                    </h3>
                    
                    {(() => {
                      const paymentLedger = projectCsrSyncService.getCsrLedger();
                      const p = selectedProject;
                      // Merge tranches from database and local storage
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
                        return <div className="text-[10.5px] text-slate-500 italic">No transaction ledger records found.</div>;
                      }

                      const totalBudgetVal = parseInt((p.sanctionedBudget || p.budget || p.proposedBudget || '73000').toString().replace(/[^0-9]/g, ''), 10) || 73000;
                      const totalDisbursedVal = linkedPayments.reduce((acc, pay) => acc + (Number(pay.rawAmount) || parseInt((pay.amount || '').replace(/[^0-9]/g, ''), 10) || 0), 0);
                      const pendingVal = Math.max(0, totalBudgetVal - totalDisbursedVal);

                      return (
                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2.5 shadow-2xs">
                          <div className="flex items-center justify-between text-[10.5px] text-slate-600 font-medium px-1">
                            <span>Total Sanctioned Grant</span>
                            <span className="font-bold text-slate-800">₹ {totalBudgetVal.toLocaleString('en-IN')}</span>
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
                            <div className="flex items-center justify-between text-[10.5px] text-amber-900 font-medium bg-amber-50 p-2 rounded-lg border border-amber-200 shadow-2xs">
                              <div className="flex items-center space-x-1.5">
                                <Clock className="w-3.5 h-3.5 text-amber-700" />
                                <span>Pending Balance</span>
                              </div>
                              <span className="font-bold">₹ {pendingVal.toLocaleString('en-IN')}</span>
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                )}

                <div className="space-y-2.5 pt-2">
                  <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                    Work Breakdown & Task Progress
                  </h3>

                  {(selectedProject.milestones || []).map((m, idx) => {
                    const isAllDone = selectedProject.governmentStatus === 'Approved' || selectedProject.status === 'Completed';
                    const isDone = isAllDone || m.status === 'Completed';
                    const isCurrent = !isAllDone && m.status === 'In Progress';

                    return (
                      <div
                        key={idx}
                        className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                          isDone
                            ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                            : isCurrent
                            ? 'bg-amber-50/80 border-amber-300 text-amber-950 ring-1 ring-amber-300/60'
                            : 'bg-slate-50/80 border-slate-200 text-slate-600'
                        }`}
                      >
                        <div className="flex items-center space-x-2.5 min-w-0">
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-[10.5px] font-black shrink-0 ${
                              isDone
                                ? 'bg-[#007A61] text-white shadow-xs'
                                : isCurrent
                                ? 'bg-amber-500 text-white animate-pulse'
                                : 'bg-slate-200 text-slate-600'
                            }`}
                          >
                            {isDone ? <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" /> : idx + 1}
                          </div>
                          <div>
                            <span className="font-extrabold text-xs block leading-tight">{m.title}</span>
                            <span className="text-[10px] text-slate-500">Status: {isDone ? 'Completed' : m.status}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FacultyProjectsPanel;
