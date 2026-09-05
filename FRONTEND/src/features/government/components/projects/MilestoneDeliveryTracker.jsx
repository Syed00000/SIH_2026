import React from 'react';
import { Box, CheckCircle2, Building2, MapPin, Banknote, ChevronDown, Layers } from 'lucide-react';

export function computeDynamicMilestones(project) {
  const hasFaculty = Boolean(project.teamLead || project.leadMentor || project.facultyMentor?.name);
  const facultyName = project.teamLead || project.leadMentor || project.facultyMentor?.name || 'binod';
  const hasProposal = Boolean(
    (project.budgetBreakdown && project.budgetBreakdown.length > 0) ||
    project.methodology ||
    project.proposedBudget ||
    project.sentToGovernment ||
    (project.milestonesCompleted || 0) >= 3
  );
  const isForwarded = Boolean(project.sentToGovernment || project.forwardedToGovAt || (project.milestonesCompleted || 0) >= 4);
  const disbNum = Number(String(project.disbursedAmount || '0').replace(/[^\d]/g, '')) || 0;
  const isFunded = disbNum > 0 || project.budgetStatus === 'Grant Sanctioned by Government' || project.budgetStatus === 'Grant Disbursed' || (project.milestonesCompleted || 0) >= 5;
  const isPrototypeDone = Boolean(
    project.prototypeStatus === 'Approved' ||
    project.prototypeStatus === 'Ready for Deployment' ||
    project.testingCompleted ||
    project.testingReportPdfUrl ||
    (project.milestonesCompleted || 0) >= 6
  );
  const isDeployed = Boolean(project.isDeployed || project.status === 'Deployed' || (project.milestonesCompleted || 0) >= 7 || (project.progress || 0) >= 100);

  const s1 = 'Completed';
  const s2 = hasFaculty ? 'Completed' : 'In Progress';
  const s3 = hasProposal ? 'Completed' : (hasFaculty ? 'In Progress' : 'Pending');
  const s4 = isForwarded ? 'Completed' : (hasProposal ? 'In Progress' : 'Pending');
  const s5 = isFunded ? 'Completed' : (isForwarded ? 'In Progress' : 'Pending');
  const s6 = isPrototypeDone ? 'Completed' : (isFunded ? 'In Progress' : 'Pending');
  const s7 = isDeployed ? 'Completed' : (isPrototypeDone ? 'In Progress' : 'Pending');

  return [
    { id: 1, title: 'Problem Statement Allocated & Scoped', status: s1, description: 'Phase 1 deliverable execution' },
    { id: 2, title: `Lead Faculty Mentor Assigned (${facultyName})`, status: s2, description: 'Phase 2 deliverable execution' },
    { id: 3, title: 'Faculty Solution Analysis & Budget Proposal', status: s3, description: 'Phase 3 deliverable execution' },
    { id: 4, title: 'University Review & Submission to Government', status: s4, description: 'Phase 4 deliverable execution' },
    { id: 5, title: 'Government Budget Sanction & Grant Disbursal', status: s5, description: 'Phase 5 deliverable execution' },
    { id: 6, title: 'Prototype Development & Field Testing', status: s6, description: 'Phase 6 deliverable execution' },
    { id: 7, title: 'Government Handover & Final Audit', status: s7, description: 'Phase 7 deliverable execution' }
  ];
}

export const MilestoneDeliveryTracker = ({ project, isExpanded, onToggleExpand, onVerifyMilestone }) => {
  const dynamicMilestones = computeDynamicMilestones(project);
  const milestonesList = dynamicMilestones.map((dm) => {
    const existing = (project.milestones || []).find((m) => m.id === dm.id || m.title === dm.title);
    if (existing?.status === 'Completed' || existing?.status === 'COMPLETED') {
      return { ...dm, status: 'Completed' };
    }
    return dm;
  });

  const completedCount = milestonesList.filter((m) => m.status === 'Completed').length;
  const computedProgress = Math.round((completedCount / 7) * 100);
  const displayProgress = project.progress ? Math.max(project.progress, computedProgress) : computedProgress;
  const isCompleted = displayProgress >= 100;
  const isDeployed = Boolean(project.isDeployed || project.status === 'Deployed' || isCompleted);

  return (
    <div className={`bg-white border rounded-2xl transition-all duration-200 shadow-2xs overflow-hidden ${isExpanded ? 'border-slate-400 ring-4 ring-slate-100' : 'border-slate-200 hover:border-slate-300'}`}>
      {/* Collapsed Header */}
      <div 
        className={`p-4 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors ${isExpanded ? 'bg-slate-50/50 border-b border-slate-200' : ''}`}
        onClick={() => onToggleExpand(project.id)}
      >
        <div className="flex items-start space-x-3.5 min-w-0">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${isCompleted ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-slate-50 border border-slate-200 text-slate-600'}`}>
            <Box className="w-5 h-5" />
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900 truncate">{project.title}</h3>
              <span className="font-mono text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">{project.id}</span>
              <div className="flex items-center space-x-1.5 text-[11px] font-bold ml-1">
                <span className={`w-1.5 h-1.5 rounded-full ${isCompleted ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
                <span className={isCompleted ? 'text-emerald-700' : 'text-amber-700'}>
                  {isDeployed ? 'Deployed' : (isCompleted ? 'Completed' : 'In Progress')} ({displayProgress}%)
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 mt-1.5">
              <span className="flex items-center space-x-1"><Building2 className="w-3.5 h-3.5 text-slate-400" /><span className="font-medium text-slate-700">{project.hei}</span></span>
              <span className="flex items-center space-x-1"><MapPin className="w-3.5 h-3.5 text-slate-400" /><span>{project.district}</span></span>
              <span className="flex items-center space-x-1"><Banknote className="w-3.5 h-3.5 text-emerald-500" /><span className="font-bold text-emerald-700">{project.disbursedAmount || project.sanctionedGrant || 'Pending'}</span></span>
            </div>
          </div>
        </div>

        <div className={`p-1 rounded-full transition-transform duration-200 ${isExpanded ? '-rotate-90 bg-slate-200 text-slate-800' : 'bg-slate-50 text-slate-400'}`}>
          <ChevronDown className="w-5 h-5" />
        </div>
      </div>

      {/* Expanded Delivery Tracker */}
      {isExpanded && (
        <div className="p-5 md:p-6 bg-slate-50/50 space-y-6">
          <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1 flex items-center space-x-2">
            <Layers className="w-3.5 h-3.5" /><span>Milestone Delivery Tracker</span>
          </h4>

          {milestonesList.length === 0 ? (
            <div className="text-center py-6 text-slate-400 text-xs">No milestones mapped for this project yet.</div>
          ) : (
            <div className="relative pl-3 md:pl-5">
              <div className="absolute left-[27px] md:left-[35px] top-4 bottom-4 w-0.5 bg-slate-200 rounded-full" />
              <div className="space-y-6">
                {milestonesList.map((m, idx) => {
                  const mCompleted = m.status === 'Completed' || m.status === 'COMPLETED';
                  const mInProgress = m.status === 'In Progress' || m.status === 'CURRENT';

                  return (
                    <div key={m.id || idx} className="relative pl-10 md:pl-12 flex items-start gap-4">
                      <div className={`absolute left-0 w-8 h-8 rounded-full border-2 flex items-center justify-center z-10 bg-white ${
                        mCompleted ? 'border-emerald-500 shadow-[0_0_0_4px_rgba(16,185,129,0.1)]' : mInProgress ? 'border-amber-500 ring-2 ring-amber-100' : 'border-slate-300'
                      }`}>
                        {mCompleted ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <span className={`text-[11px] font-black ${mInProgress ? 'text-amber-500' : 'text-slate-400'}`}>{idx + 1}</span>}
                      </div>

                      <div className={`flex-1 border rounded-xl p-3.5 transition-colors shadow-2xs ${mCompleted ? 'bg-emerald-50/30 border-emerald-100' : mInProgress ? 'bg-white border-amber-200' : 'bg-white border-slate-200'}`}>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div>
                            <h5 className={`text-sm font-bold ${mCompleted ? 'text-emerald-900' : mInProgress ? 'text-amber-900' : 'text-slate-700'}`}>{m.title}</h5>
                            <span className="text-[11px] text-slate-500 font-medium">{m.description || `Phase ${idx + 1} deliverable execution`}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border whitespace-nowrap ${mCompleted ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : mInProgress ? 'bg-amber-100 text-amber-800 border-amber-200' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                              {m.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MilestoneDeliveryTracker;
