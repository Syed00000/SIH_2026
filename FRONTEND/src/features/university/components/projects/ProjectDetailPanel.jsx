import React, { useState } from 'react';
import {
  Lock, CheckCircle2, Eye, Edit3, UserPlus, FileText
} from 'lucide-react';
import { FullPageDetailPanel } from '../../../../shared/components/layout/FullPageDetailPanel.jsx';
import { ProjectDrawerTabs } from './ProjectDrawerTabs.jsx';
import { ProblemIndustryCollaborationSection } from './ProblemIndustryCollaborationSection.jsx';

export const ProjectDetailPanel = ({
  project,
  onClose,
  onEdit,
  onAssignMentor,
  onEndProject,
  onMarkCompleted,
  onViewProblemDossier
}) => {
  const [activeTab, setActiveTab] = useState('overview');

  if (!project) return null;

  const isDeployed = project.status === 'Deployed' || Boolean(project.isDeployed) || Boolean(project.isLocked);
  const isCompleted = project.status === 'Completed';

  return (
    <FullPageDetailPanel
      onBack={onClose}
      backLabel="Back to Projects Portfolio"
      breadcrumbs={['University R&D Center', 'Project Portfolio', project.projectId || project.id]}
      idBadge={project.projectId || project.id}
      statusBadge={
        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border flex items-center space-x-1 ${
          isDeployed
            ? 'bg-teal-50 text-teal-800 border-teal-300'
            : isCompleted
            ? 'bg-purple-50 text-purple-800 border-purple-300'
            : 'bg-emerald-50 text-emerald-800 border-emerald-300'
        }`}>
          {isDeployed ? (
            <>
              <Lock className="w-3 h-3 text-teal-700" />
              <span>🔒 Deployed & Locked (TRL-9)</span>
            </>
          ) : (
            <span>{project.status || 'Active R&D'}</span>
          )}
        </span>
      }
      title={project.title}
      subtitle={`Domain: ${project.domain || 'State R&D'} • Lead: ${project.leadMentor || project.facultyMentor?.name || 'Assigned Mentor'} • Challenge ID: ${project.challengeId || 'CHL-JH-2026'}`}
      stickyFooter={
        <div className="w-full flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer shadow-2xs"
          >
            Back to Projects Portfolio
          </button>
          <div className="flex items-center space-x-2.5">
            <button
              type="button"
              onClick={() => onViewProblemDossier && onViewProblemDossier(project)}
              className="px-3.5 py-2 text-xs font-bold text-teal-900 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-xl cursor-pointer flex items-center space-x-1.5 shadow-2xs"
            >
              <Eye className="w-3.5 h-3.5 text-teal-700" />
              <span>Inspect Problem Dossier</span>
            </button>
            {!isDeployed && onAssignMentor && (
              <button
                type="button"
                onClick={() => onAssignMentor(project)}
                className="px-3.5 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl cursor-pointer flex items-center space-x-1.5 shadow-2xs"
              >
                <UserPlus className="w-3.5 h-3.5 text-slate-500" />
                <span>Assign Mentor</span>
              </button>
            )}
            {!isDeployed && onEdit && (
              <button
                type="button"
                onClick={() => onEdit(project)}
                className="px-3.5 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl cursor-pointer flex items-center space-x-1.5 shadow-2xs"
              >
                <Edit3 className="w-3.5 h-3.5 text-slate-500" />
                <span>Edit</span>
              </button>
            )}
            {!isDeployed && !isCompleted && onMarkCompleted && (
              <button
                type="button"
                onClick={() => onMarkCompleted(project)}
                className="px-4 py-2 text-xs font-black text-white bg-[#007A61] hover:bg-[#00604c] rounded-xl shadow-xs flex items-center space-x-1.5 cursor-pointer"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Mark Completed</span>
              </button>
            )}
          </div>
        </div>
      }
    >
      {/* Citizen Problem Statement Card */}
      <div className="bg-gradient-to-r from-emerald-50/70 via-slate-50 to-teal-50/50 p-4 rounded-2xl border border-emerald-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1 max-w-2xl">
          <span className="text-[10px] font-black uppercase tracking-wider text-[#007A61] flex items-center space-x-1">
            <FileText className="w-3.5 h-3.5" />
            <span>Ground Problem Statement & Citizen Challenge</span>
          </span>
          <p className="text-xs text-slate-800 italic font-medium leading-relaxed">
            "{project.problemStatement || project.title}"
          </p>
          <span className="text-[10.5px] text-slate-500 font-mono block">
            Challenge Reference: {project.challengeId || 'CHL-JH-2026-DEFAULT'}
          </span>
        </div>
        <button
          type="button"
          onClick={() => onViewProblemDossier && onViewProblemDossier(project)}
          className="px-3.5 py-2 bg-white hover:bg-emerald-50 text-[#007A61] border border-emerald-300 rounded-xl text-xs font-bold transition-all shadow-2xs flex items-center space-x-1.5 cursor-pointer shrink-0"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Open Evidence Dossier</span>
        </button>
      </div>

      {/* Dedicated Industry Partner, Mentorship & Tech Collaboration Section */}
      <ProblemIndustryCollaborationSection
        project={project}
        onViewProblemDossier={onViewProblemDossier}
      />

      {/* Tab Navigation */}
      <div className="flex border-b border-slate-200 text-xs">
        {['overview', 'milestones', 'team', 'documents'].map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setActiveTab(t)}
            className={`pb-2.5 px-4 font-bold capitalize transition-all cursor-pointer border-b-2 ${
              activeTab === t
                ? 'border-b-[#007A61] text-[#007A61]'
                : 'border-b-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Content Tabs */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs">
        <ProjectDrawerTabs
          project={project}
          activeTab={activeTab}
          onEdit={onEdit}
          onAssignMentor={onAssignMentor}
          onEndProject={onEndProject}
          onMarkCompleted={onMarkCompleted}
        />
      </div>
    </FullPageDetailPanel>
  );
};

export default ProjectDetailPanel;
