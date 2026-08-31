import React, { useState } from 'react';
import {
  CheckCircle2,
  Upload,
  MessageSquare,
  UserPlus,
  Edit3,
  PowerOff,
  ChevronDown,
  ChevronUp,
  FileText,
  Activity,
  Users,
  Award,
  Clock,
  Send
} from 'lucide-react';
import { projectCsrSyncService } from '../../../government/services/projectCsrSyncService.js';
import { universityApiService } from '../../services/universityApiService.js';

export const ProjectDrawerTabs = ({
  project,
  activeTab,
  onEdit,
  onAssignMentor,
  onEndProject,
  onMarkCompleted
}) => {
  const [showFullProblem, setShowFullProblem] = useState(false);

  const hasMentor = Boolean(
    project.facultyMentor?.name || (project.leadMentor && project.leadMentor !== 'Unassigned')
  );
  const facultyName = hasMentor ? (project.facultyMentor?.name || project.leadMentor) : 'Unassigned';
  const facultyDept = hasMentor
    ? (project.facultyMentor?.department || 'Department of Engineering')
    : 'No Department Assigned';
  const initials = hasMentor
    ? facultyName.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
    : 'NA';

  const activities = Array.isArray(project.recentActivity) ? project.recentActivity : [];
  const documents = Array.isArray(project.documents) ? project.documents : [];
  const hasStudentTeam = Array.isArray(project.teamMembers) && project.teamMembers.length > 0;

  const isFunded = Boolean(project.disbursedAmount && project.disbursedAmount !== '0' && project.disbursedAmount !== '₹ 0');
  const isProtoApproved = project.prototypeStatus === 'Approved';
  const isProtoInReview = project.prototypeStatus === 'In Review';
  const isProtoStarted = Boolean(project.prototypeData);

  const defaultMilestones = [
    { id: 1, title: 'Problem Statement Allocated & Scoped', status: 'Completed', dueDate: 'N/A' },
    {
      id: 2,
      title: hasMentor ? `Lead Faculty Mentor Assigned (${facultyName})` : 'Lead Faculty Mentor Assignment',
      status: hasMentor ? 'Completed' : 'In Progress',
      dueDate: 'N/A'
    },
    {
      id: 3,
      title: 'Faculty Solution Analysis & Budget Proposal',
      status: hasMentor ? 'Completed' : 'Pending',
      dueDate: 'N/A'
    },
    { 
      id: 4, 
      title: 'University Review & Submission to Government', 
      status: isFunded ? 'Completed' : 'In Progress', 
      dueDate: 'N/A' 
    },
    { 
      id: 5, 
      title: 'Government Budget Sanction & Grant Disbursal', 
      status: isFunded ? 'Completed' : 'Pending', 
      dueDate: 'N/A' 
    },
    { 
      id: 6, 
      title: isProtoApproved 
        ? 'Prototype Blueprint Verified & Approved' 
        : isProtoInReview 
        ? 'Prototype Blueprint Submitted for Review' 
        : 'Prototype Development & Field Testing', 
      status: isProtoApproved ? 'Completed' : (isProtoInReview || isProtoStarted ? 'In Progress' : 'Pending'), 
      dueDate: project.prototypeData?.timeline || 'N/A' 
    },
    { 
      id: 7, 
      title: isProtoApproved ? 'Ready for Industry CSR Matching & Handover' : 'Government Handover & Final Audit', 
      status: project.status === 'Completed' ? 'Completed' : (isProtoApproved ? 'In Progress' : 'Pending'), 
      dueDate: 'N/A' 
    }
  ];

  const milestonesList = project.milestones?.length ? project.milestones : defaultMilestones;
  const totalMilestones = milestonesList.length || 7;
  const completedMilestones = milestonesList.filter(
    (m) => m.status === 'Completed' || m.status === 'COMPLETED'
  ).length;
  const calculatedPercentage =
    project.status === 'Completed'
      ? 100
      : Math.round((completedMilestones / totalMilestones) * 100);

  const displayBudget = project.budget
    ? typeof project.budget === 'object'
      ? project.budget.total
        ? `₹ ${project.budget.total.toLocaleString('en-IN')}`
        : 'N/A'
      : project.budget
    : 'N/A';

  const displayTimeline = project.prototypeData?.timeline ? `${project.prototypeData.timeline} (Prototype Target)` : (project.timeline || project.deadline || 'N/A');

  if (activeTab === 'overview') {
    return (
      <div className="space-y-3.5">
        {/* Problem Statement Card */}
        <div className="p-3.5 bg-slate-50/80 border border-slate-200/90 rounded-xl space-y-1.5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">
              Problem Statement
            </span>
            <span className="text-[10.5px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-bold">
              {project.domain || 'Innovation'}
            </span>
          </div>
          <p
            className={`text-xs text-slate-700 leading-relaxed ${
              !showFullProblem ? 'line-clamp-2' : ''
            }`}
          >
            {project.problemStatement || project.description || 'No detailed problem statement provided.'}
          </p>
          {project.problemStatement && project.problemStatement.length > 120 && (
            <button
              type="button"
              onClick={() => setShowFullProblem(!showFullProblem)}
              className="text-[11px] font-bold text-[#007A61] hover:underline cursor-pointer flex items-center space-x-0.5 pt-0.5"
            >
              <span>{showFullProblem ? 'Show less' : 'Show full details'}</span>
              {showFullProblem ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          )}
        </div>

        {/* Project Key Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
          <div className="p-3 bg-white border border-slate-200/90 rounded-xl shadow-2xs">
            <span className="text-[10px] text-slate-400 font-bold uppercase block tracking-wider">Domain Sector</span>
            <span className="font-extrabold text-slate-900 text-xs mt-1 block truncate">
              {project.domain || 'General'}
            </span>
          </div>

          <div className="p-3 bg-white border border-slate-200/90 rounded-xl shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Allocated Budget</span>
              {project.disbursedAmount && project.disbursedAmount !== '₹ 0' && project.disbursedAmount !== '0' ? (
                <span className="text-[9px] font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">Disbursed</span>
              ) : (
                <span className="text-[9px] font-bold text-amber-800 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">Pending</span>
              )}
            </div>
            <span className="font-extrabold text-slate-900 text-xs mt-1 block truncate">
              {project.disbursedAmount && project.disbursedAmount !== '₹ 0' && project.disbursedAmount !== '0'
                ? `${project.disbursedAmount} (Received)`
                : project.sanctionedBudget || (project.budget && project.budget !== 'N/A' ? project.budget : 'N/A')}
            </span>
          </div>

          <div className="p-3 bg-white border border-slate-200/90 rounded-xl shadow-2xs col-span-2 sm:col-span-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase block tracking-wider">Lifecycle Target</span>
            <span className="font-extrabold text-slate-700 text-xs mt-1 block truncate">
              {displayTimeline !== 'N/A' ? displayTimeline : 'Proposal & Scoping'}
            </span>
          </div>
        </div>

        {/* Detailed Financial Breakdown */}
        {project.disbursedAmount && project.disbursedAmount !== '₹ 0' && project.disbursedAmount !== '0' ? (
          <div className="p-4 bg-emerald-50/40 border border-emerald-200/80 rounded-xl text-xs space-y-2.5">
            <div className="flex items-center space-x-1.5 font-bold text-emerald-950">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Funding Status: Grant Disbursed & Received</span>
            </div>
            
            {(() => {
              const paymentLedger = projectCsrSyncService.getCsrLedger();
              const p = project;
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
                return (
                  <p className="text-[11px] text-emerald-900 leading-relaxed pl-3.5">
                    Government has successfully disbursed {project.disbursedAmount} for this project.
                  </p>
                );
              }

              const totalBudgetVal = parseInt((p.sanctionedBudget || p.budget || p.proposedBudget || '73000').toString().replace(/[^0-9]/g, ''), 10) || 73000;
              const totalDisbursedVal = linkedPayments.reduce((acc, pay) => acc + (Number(pay.rawAmount) || parseInt((pay.amount || '').replace(/[^0-9]/g, ''), 10) || 0), 0);
              const pendingVal = Math.max(0, totalBudgetVal - totalDisbursedVal);
              const utilizedVal = Math.round(totalDisbursedVal * 0.78); // Mocking 78% utilization for demonstration

              return (
                <div className="pl-3.5 space-y-2">
                  <div className="flex items-center justify-between text-[10.5px] text-emerald-900 font-medium px-1 mb-1">
                    <span>Total Sanctioned Grant</span>
                    <span className="font-bold">₹ {totalBudgetVal.toLocaleString('en-IN')}</span>
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
                    <div key={pay.id || idx} className="flex items-center justify-between text-[10.5px] text-emerald-900 font-medium bg-emerald-100/50 p-2 rounded-lg border border-emerald-200 shadow-2xs">
                      <div className="flex items-center space-x-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#007A61]" />
                        <span>Tranche {idx + 1} (Received)</span>
                      </div>
                      <span className="font-bold">₹ {(Number(pay.rawAmount) || parseInt((pay.amount || '').replace(/[^0-9]/g, ''), 10) || 0).toLocaleString('en-IN')}</span>
                    </div>
                  ))}

                  {pendingVal > 0 && (
                    <div className="flex items-center justify-between text-[10.5px] text-amber-900 font-medium bg-amber-100/50 p-2 rounded-lg border border-amber-200 shadow-2xs mt-2">
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
        ) : (
          <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl text-xs space-y-1">
            <div className="flex items-center space-x-1.5 font-bold text-amber-950">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>Funding Status: Budget Not Sanctioned (Proposal Pending)</span>
            </div>
            <p className="text-[11px] text-amber-900 leading-relaxed pl-3.5">
              Budget will be formulated by the designated Faculty Mentor ({facultyName}) and team, approved by the University, and submitted to the Government for grant sanction.
            </p>
          </div>
        )}

        {/* Lead Faculty Mentor Card */}
        <div className="p-3.5 bg-white border border-emerald-200/80 rounded-xl space-y-2 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">
              Lead Faculty Mentor
            </span>
            {onAssignMentor && (
              <button
                type="button"
                onClick={() => onAssignMentor(project)}
                className="text-[11px] font-bold text-[#007A61] hover:text-[#00604c] hover:underline cursor-pointer flex items-center space-x-1"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>{hasMentor ? 'Change Mentor' : 'Assign Mentor'}</span>
              </button>
            )}
          </div>
          <div className="flex items-center space-x-3">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-black shrink-0 ${
                hasMentor
                  ? 'bg-[#007A61] text-white shadow-xs'
                  : 'bg-amber-100 text-amber-800 border border-amber-300'
              }`}
            >
              {initials}
            </div>
            <div className="min-w-0">
              <div className="font-extrabold text-slate-900 text-xs truncate">
                {facultyName}
              </div>
              <div className="text-[11px] text-slate-500 truncate">
                {facultyDept}
              </div>
            </div>
          </div>
        </div>

        {/* Prototype Blueprint Status Card */}
        {project.prototypeStatus && (
          <div className={`p-3.5 rounded-xl border space-y-2 shadow-2xs ${
            project.prototypeStatus === 'Approved'
              ? 'bg-emerald-50/70 border-emerald-300'
              : project.prototypeStatus === 'In Review'
              ? 'bg-blue-50/70 border-blue-200'
              : 'bg-amber-50/70 border-amber-200'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block">
                Prototype Lifecycle Status
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${
                project.prototypeStatus === 'Approved'
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                  : project.prototypeStatus === 'In Review'
                  ? 'bg-blue-100 text-blue-800 border-blue-300'
                  : 'bg-amber-100 text-amber-800 border-amber-300'
              }`}>
                {project.prototypeStatus === 'Approved' ? '✓ Prototype Done (Approved)' : project.prototypeStatus === 'In Review' ? '⏳ Under Review' : project.prototypeStatus}
              </span>
            </div>
            <p className="text-xs text-slate-700 font-medium">
              {project.prototypeStatus === 'Approved'
                ? 'Prototype blueprint has been approved by the University Authority and is ready for Industry CSR / Lab matching.'
                : project.prototypeStatus === 'In Review'
                ? 'Prototype blueprint has been submitted by the Faculty Mentor and is currently pending University evaluation.'
                : 'Prototype is in drafting / revision phase.'}
            </p>
            {project.prototypeData?.timeline && (
              <div className="text-[11px] text-[#007A61] font-bold">
                Target Timeline: {project.prototypeData.timeline}
              </div>
            )}

            {project.prototypeStatus === 'Approved' && (
              <div className="pt-2.5 border-t border-emerald-200/80 flex items-center justify-between">
                <span className="text-[10px] font-bold text-emerald-900">
                  {project.sentToGovernment ? '✓ Forwarded to Government (DHTE)' : 'Ready to Ship for State Evaluation'}
                </span>
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      await universityApiService.forwardPrototypeToGovernment(project.projectId || project.id, 'RU001');
                      project.sentToGovernment = true;
                    } catch (e) {
                      console.error(e);
                    }
                  }}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-[10px] font-bold flex items-center space-x-1 shadow-2xs cursor-pointer"
                >
                  <Send className="w-3 h-3 text-blue-400" />
                  <span>{project.sentToGovernment ? 'Resync with Government' : 'Ship to Government'}</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Overall Progress */}
        <div className="space-y-2 p-3.5 bg-white border border-slate-200 rounded-xl shadow-2xs">
          <div className="flex justify-between items-center text-[11px]">
            <span className="font-bold text-slate-700">R&D Lifecycle Progress</span>
            <span className="font-extrabold font-mono text-[#007A61]">
              {calculatedPercentage}%
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-[#007A61] h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${calculatedPercentage}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-[10.5px] text-slate-500 pt-0.5">
            <span>Status: <strong className="text-slate-800">{project.status || (calculatedPercentage === 100 ? 'Completed' : 'In Progress')}</strong></span>
            <span>
              Milestones: <strong className="text-[#007A61] font-bold">{completedMilestones}</strong> / {totalMilestones} Completed
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-100">
          {project.status !== 'Completed' ? (
            <button
              type="button"
              onClick={() => onMarkCompleted && onMarkCompleted(project)}
              className="py-2 bg-[#007A61] hover:bg-[#006650] text-white text-[11px] font-bold rounded-xl flex items-center justify-center space-x-1.5 cursor-pointer transition-colors shadow-2xs"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Mark Completed</span>
            </button>
          ) : (
            <button
              type="button"
              disabled
              className="py-2 bg-purple-50 text-purple-900 border border-purple-300 text-[11px] font-bold rounded-xl flex items-center justify-center space-x-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-purple-700" />
              <span>Completed</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => onEdit(project)}
            className="py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 text-[11px] font-bold rounded-xl flex items-center justify-center space-x-1.5 cursor-pointer transition-colors shadow-2xs"
          >
            <Edit3 className="w-3.5 h-3.5 text-slate-600" />
            <span>Edit</span>
          </button>

          <button
            type="button"
            onClick={() => onEndProject(project)}
            className="py-2 border border-slate-200 text-slate-600 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 text-[11px] font-bold rounded-xl flex items-center justify-center space-x-1.5 cursor-pointer transition-colors"
          >
            <PowerOff className="w-3.5 h-3.5" />
            <span>Archive</span>
          </button>
        </div>

        {/* Recent Real Activity Feed */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <span className="text-[10.5px] font-extrabold text-slate-900 uppercase">
              Recent Activity
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              {activities.length} Events
            </span>
          </div>

          {activities.length === 0 ? (
            <div className="p-4 bg-slate-50/70 border border-slate-200/80 rounded-xl text-center space-y-1">
              <Activity className="w-5 h-5 text-slate-300 mx-auto" />
              <div className="text-xs font-bold text-slate-700">No activity logs yet</div>
              <p className="text-[11px] text-slate-500">
                Activity logs will be recorded as milestone updates and mentor actions occur.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {activities.map((act, i) => (
                <div
                  key={i}
                  className="flex items-start space-x-2.5 text-[11px] bg-white p-2.5 rounded-xl border border-slate-200/80 shadow-2xs"
                >
                  <div className="w-6 h-6 rounded-lg bg-emerald-50 text-[#007A61] flex items-center justify-center shrink-0 mt-0.5 border border-emerald-100">
                    {act.type === 'milestone' ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    ) : act.type === 'document' ? (
                      <Upload className="w-3.5 h-3.5 text-slate-800" />
                    ) : act.type === 'comment' ? (
                      <MessageSquare className="w-3.5 h-3.5 text-amber-600" />
                    ) : (
                      <UserPlus className="w-3.5 h-3.5 text-[#007A61]" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-slate-900 leading-tight">{act.text}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">
                      By {act.user || 'System'} {act.time ? `• ${act.time}` : ''}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (activeTab === 'milestones') {
    return (
      <div className="space-y-2.5">
        <div className="flex items-center justify-between text-xs pb-1 border-b border-slate-100">
          <span className="font-bold text-slate-700">R&D Lifecycle Milestones</span>
          <span className="text-[11px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-bold">
            {completedMilestones} of {totalMilestones} Steps Completed ({calculatedPercentage}%)
          </span>
        </div>

        {milestonesList.map((m, idx) => {
          const isDone = m.status === 'Completed';
          const isCurrent = m.status === 'In Progress' || m.status === 'CURRENT';

          return (
            <div
              key={idx}
              className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                isDone
                  ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950 shadow-2xs'
                  : isCurrent
                  ? 'bg-amber-50/80 border-amber-300 text-amber-950 shadow-2xs ring-1 ring-amber-300/60'
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

                <div className="min-w-0">
                  <div className="font-bold text-slate-900 text-xs leading-tight truncate">
                    {m.title}
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                    {m.completedAt
                      ? `Completed on ${new Date(m.completedAt).toLocaleDateString('en-GB')}`
                      : m.dueDate && m.dueDate !== 'N/A'
                      ? `Target: ${m.dueDate}`
                      : 'Status: ' + (isDone ? 'Completed' : isCurrent ? 'Active Milestone' : 'Pending')}
                  </div>
                </div>
              </div>

              <span
                className={`px-2.5 py-0.5 text-[10px] font-bold rounded-md border shrink-0 ${
                  isDone
                    ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                    : isCurrent
                    ? 'bg-amber-100 text-amber-900 border-amber-300'
                    : 'bg-slate-100 text-slate-600 border-slate-200'
                }`}
              >
                {isDone ? 'Completed' : isCurrent ? 'In Progress' : 'Pending'}
              </span>
            </div>
          );
        })}
      </div>
    );
  }

  if (activeTab === 'team') {
    return (
      <div className="space-y-3">
        {/* Principal Investigator / Lead Mentor */}
        <div className="p-3.5 bg-white border border-emerald-200/90 rounded-xl space-y-1.5 shadow-2xs">
          <span className="text-[10px] text-slate-500 font-bold uppercase block tracking-wider">
            Principal Investigator / Lead Mentor
          </span>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${
                  hasMentor ? 'bg-[#007A61] text-white shadow-2xs' : 'bg-amber-100 text-amber-800'
                }`}
              >
                {initials}
              </div>
              <div>
                <div className="font-extrabold text-slate-900 text-xs">{facultyName}</div>
                <div className="text-[10.5px] text-slate-500">{facultyDept}</div>
              </div>
            </div>
            {hasMentor ? (
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded">
                Lead Mentor
              </span>
            ) : (
              <button
                type="button"
                onClick={() => onAssignMentor && onAssignMentor(project)}
                className="text-[10.5px] font-bold text-[#007A61] hover:underline cursor-pointer bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200"
              >
                + Assign Mentor
              </button>
            )}
          </div>
        </div>

        {/* Student Team Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10.5px] font-bold text-slate-900 uppercase">
              Student Research Team
            </span>
            <span className="text-[10px] font-mono text-slate-500">
              {hasStudentTeam ? `${project.teamMembers.length} Members Assigned` : 'Formation Pending'}
            </span>
          </div>

          {hasStudentTeam ? (
            project.teamMembers.map((tm, idx) => (
              <div
                key={idx}
                className="p-2.5 bg-white border border-slate-200 rounded-xl flex items-center justify-between shadow-2xs"
              >
                <div>
                  <div className="font-bold text-slate-900 text-xs">{tm.name}</div>
                  <div className="text-[10.5px] text-slate-500">{tm.department}</div>
                </div>
                <span className="text-[10px] font-bold text-slate-700 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded">
                  {tm.role}
                </span>
              </div>
            ))
          ) : (
            <div className="p-5 bg-slate-50/70 border border-dashed border-slate-300 rounded-xl text-center space-y-1.5">
              <Users className="w-6 h-6 text-slate-300 mx-auto" />
              <div className="text-xs font-bold text-slate-700">Student Team Not Assigned</div>
              <p className="text-[11px] text-slate-500 max-w-sm mx-auto leading-relaxed">
                Student researchers will be onboarded by{' '}
                <strong className="text-slate-800">{facultyName}</strong> once the project methodology is formulated.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Documents Tab
  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between text-xs pb-1 border-b border-slate-100">
        <span className="font-bold text-slate-700">Project Documents & Repository</span>
        <span className="text-[10.5px] font-mono text-slate-400">
          {documents.length} Files
        </span>
      </div>

      {documents.length === 0 ? (
        <div className="p-6 bg-slate-50/70 border border-dashed border-slate-300 rounded-xl text-center space-y-1.5">
          <FileText className="w-6 h-6 text-slate-300 mx-auto" />
          <div className="text-xs font-bold text-slate-700">No documents attached yet</div>
          <p className="text-[11px] text-slate-500 max-w-sm mx-auto leading-relaxed">
            Project proposals, test logs, and calibration documents uploaded by faculty mentors will appear here.
          </p>
        </div>
      ) : (
        documents.map((d, idx) => (
          <div
            key={idx}
            className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between shadow-2xs"
          >
            <div>
              <div className="font-bold text-slate-900 text-xs">{d.name}</div>
              <div className="text-[10.5px] text-slate-500 font-mono mt-0.5">
                {d.size} {d.date ? `• ${d.date}` : ''}
              </div>
            </div>
            <button
              type="button"
              className="text-xs font-bold text-[#007A61] hover:underline cursor-pointer"
            >
              Download
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default ProjectDrawerTabs;
