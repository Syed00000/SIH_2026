import React, { useState } from 'react';
import { ChevronUp, ChevronDown, CheckCircle2, Edit3, PowerOff } from 'lucide-react';
import { ProjectFundingSection } from './ProjectFundingSection.jsx';
import { ProjectPrototypeCard } from './ProjectPrototypeCard.jsx';
import { ProjectActivityFeed } from './ProjectActivityFeed.jsx';

export const ProjectOverviewTab = ({
  project,
  hasMentor,
  facultyName,
  facultyDept,
  initials,
  displayTimeline,
  calculatedPercentage,
  completedMilestones,
  totalMilestones,
  isDeployed,
  activities = [],
  trancheRequested,
  setTrancheRequested,
  isRequestingTranche,
  setIsRequestingTranche,
  onEdit,
  onMarkCompleted,
  onEndProject
}) => {
  const [showFullProblem, setShowFullProblem] = useState(false);

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
        <p className={`text-xs text-slate-700 leading-relaxed ${!showFullProblem ? 'line-clamp-2' : ''}`}>
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
          <span className="font-extrabold text-slate-900 text-xs mt-1 block truncate">{project.domain || 'General'}</span>
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
      <ProjectFundingSection
        project={project}
        trancheRequested={trancheRequested}
        setTrancheRequested={setTrancheRequested}
        isRequestingTranche={isRequestingTranche}
        setIsRequestingTranche={setIsRequestingTranche}
        isDeployed={isDeployed}
      />

      {/* Lead Faculty Mentor Card */}
      <div className="p-3.5 bg-white border border-emerald-200/80 rounded-xl space-y-2 shadow-2xs">
        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Lead Faculty Mentor</span>
        <div className="flex items-center space-x-3">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-black shrink-0 ${hasMentor ? 'bg-[#007A61] text-white shadow-xs' : 'bg-amber-100 text-amber-800 border border-amber-300'}`}>
            {initials}
          </div>
          <div className="min-w-0">
            <div className="font-extrabold text-slate-900 text-xs truncate">{facultyName}</div>
            <div className="text-[11px] text-slate-500 truncate">{facultyDept}</div>
          </div>
        </div>
      </div>

      {/* Prototype Blueprint Status Card */}
      <ProjectPrototypeCard project={project} />

      {/* Overall Progress */}
      <div className="space-y-2 p-3.5 bg-white border border-slate-200 rounded-xl shadow-2xs">
        <div className="flex justify-between items-center text-[11px]">
          <span className="font-bold text-slate-700">R&amp;D Lifecycle Progress</span>
          <span className="font-extrabold font-mono text-[#007A61]">{calculatedPercentage}%</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
          <div className="bg-[#007A61] h-2 rounded-full transition-all duration-500 ease-out" style={{ width: `${calculatedPercentage}%` }} />
        </div>
        <div className="flex justify-between items-center text-[10.5px] text-slate-500 pt-0.5">
          <span>Status: <strong className={isDeployed ? 'text-teal-700' : 'text-slate-800'}>{isDeployed ? '🔒 Deployed' : (project.status || (calculatedPercentage === 100 ? 'Completed' : 'In Progress'))}</strong></span>
          <span>Milestones: <strong className="text-[#007A61] font-bold">{completedMilestones}</strong> / {totalMilestones} Completed</span>
        </div>
      </div>

      {/* Action Controls */}
      <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-100">
        {isDeployed ? (
          <div className="col-span-3 flex items-center justify-center gap-2 py-3 bg-teal-50 border border-teal-200 rounded-xl text-xs font-bold text-teal-800">
            <span>🔒 Deployed &amp; Government Certified — All edits are locked</span>
          </div>
        ) : project.status !== 'Completed' ? (
          <button
            type="button"
            onClick={() => onMarkCompleted && onMarkCompleted(project)}
            className="py-2 bg-[#007A61] hover:bg-[#006650] text-white text-[11px] font-bold rounded-xl flex items-center justify-center space-x-1.5 cursor-pointer transition-colors shadow-2xs"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Mark Completed</span>
          </button>
        ) : (
          <button type="button" disabled className="py-2 bg-purple-50 text-purple-900 border border-purple-300 text-[11px] font-bold rounded-xl flex items-center justify-center space-x-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-purple-700" />
            <span>Completed</span>
          </button>
        )}

        {!isDeployed && (
          <button
            type="button"
            onClick={() => onEdit(project)}
            className="py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 text-[11px] font-bold rounded-xl flex items-center justify-center space-x-1.5 cursor-pointer transition-colors shadow-2xs"
          >
            <Edit3 className="w-3.5 h-3.5 text-slate-600" />
            <span>Edit</span>
          </button>
        )}

        {!isDeployed && (
          <button
            type="button"
            onClick={() => onEndProject(project)}
            className="py-2 border border-slate-200 text-slate-600 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 text-[11px] font-bold rounded-xl flex items-center justify-center space-x-1.5 cursor-pointer transition-colors"
          >
            <PowerOff className="w-3.5 h-3.5" />
            <span>Archive</span>
          </button>
        )}
      </div>

      {/* Recent Real Activity Feed */}
      <ProjectActivityFeed activities={activities} />
    </div>
  );
};

export default ProjectOverviewTab;
