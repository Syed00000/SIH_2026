import React, { useState } from 'react';
import { X } from 'lucide-react';
import { ProjectDrawerTabs } from './ProjectDrawerTabs.jsx';

export const ProjectDrawer = ({ project, onClose, onEdit, onAssignMentor, onEndProject, onMarkCompleted }) => {
  const [activeTab, setActiveTab] = useState('overview');

  if (!project) return null;

  return (
    <div className="bg-white rounded-xl flex flex-col justify-between h-full overflow-hidden select-none">
      <div className="p-4 border-b border-slate-100 bg-slate-50/70 space-y-2.5">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center space-x-2 flex-wrap gap-1">
              <h2 className="text-base font-bold text-slate-900 leading-snug">{project.title}</h2>
              {(project.status === 'Deployed' || project.isDeployed || project.isLocked) ? (
                <span className="px-2 py-0.5 text-[10px] font-bold rounded border bg-teal-50 text-teal-900 border-teal-300">
                  🔒 Deployed & Locked
                </span>
              ) : (
                <span className={`px-2 py-0.5 text-[10px] font-bold rounded border ${
                  project.status === 'Completed' ? 'bg-purple-50 text-purple-900 border-purple-200' : 'bg-emerald-50 text-emerald-900 border-emerald-200'
                }`}>
                  {project.status || 'In Progress'}
                </span>
              )}
            </div>
            <div className="text-[10.5px] text-slate-500 font-mono mt-0.5">
              Challenge ID: {project.challengeId || 'CHL-1024'} &bull; Project: {project.projectId}
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-900 p-1.5 hover:bg-slate-200/50 rounded-md transition-colors cursor-pointer"
            title="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex border-b border-slate-200 text-xs">
          {['overview', 'milestones', 'team', 'documents'].map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`pb-2 px-3 font-bold capitalize transition-colors cursor-pointer border-b-2 ${
                activeTab === t ? 'border-b-[#007A61] text-[#007A61]' : 'border-b-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="p-3.5 flex-1 overflow-y-auto space-y-3.5 text-xs text-slate-700">
        <ProjectDrawerTabs
          project={project}
          activeTab={activeTab}
          onEdit={onEdit}
          onAssignMentor={onAssignMentor}
          onEndProject={onEndProject}
          onMarkCompleted={onMarkCompleted}
        />
      </div>
    </div>
  );
};

export default ProjectDrawer;
