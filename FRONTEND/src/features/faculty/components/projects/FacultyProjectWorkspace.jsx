import React, { useState } from 'react';
import { ArrowLeft, Users, FileText, Target, CheckCircle2, FlaskConical } from 'lucide-react';
import { FacultyProjectsPanel } from './FacultyProjectsPanel.jsx';
import { FacultyTeamsPanel } from '../teams/FacultyTeamsPanel.jsx';
import { FacultyProposalsPanel } from '../proposals/FacultyProposalsPanel.jsx';
import { FacultyPrototypePanel } from '../prototypes/FacultyPrototypePanel.jsx';

export const FacultyProjectWorkspace = ({
  project,
  projects = [],
  faculty,
  onRefresh,
  onBack
}) => {
  const [activeTab, setActiveTab] = useState('overview');

  if (!project) return null;

  return (
    <div className="space-y-4 max-w-7xl mx-auto select-none pb-12">
      {/* Top Breadcrumb & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <button 
            onClick={onBack}
            className="flex items-center space-x-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors mb-2 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Dashboard</span>
          </button>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-mono font-bold bg-slate-100 px-2 py-0.5 rounded text-slate-700">
              {project.projectId}
            </span>
            <span className="text-[10.5px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              {project.domain}
            </span>
            <span className="text-[10.5px] font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
              {project.status || 'Proposal Stage'}
            </span>
            {project.governmentStatus === 'Approved' || project.status === 'Completed' ? (
              <span className="text-[10.5px] font-extrabold text-emerald-800 bg-emerald-100/70 px-2.5 py-0.5 rounded-full border border-emerald-400 flex items-center space-x-1 shadow-2xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#007A61]" />
                <span>✓ State Certified & Deployed (TRL-9)</span>
              </span>
            ) : project.governmentStatus === 'Changes Required' ? (
              <span className="text-[10.5px] font-extrabold text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300 flex items-center space-x-1 shadow-2xs">
                <span>⚠️ Government Directives (Revisions Required)</span>
              </span>
            ) : project.prototypeStatus === 'Approved' ? (
              <span className="text-[10.5px] font-extrabold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-300 flex items-center space-x-1 shadow-2xs">
                <span>✓ University Approved (In State Review)</span>
              </span>
            ) : project.prototypeStatus === 'In Review' ? (
              <span className="text-[10.5px] font-extrabold text-blue-800 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200 flex items-center space-x-1 shadow-2xs">
                <span>⏳ Prototype Submitted (Under Review)</span>
              </span>
            ) : null}
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight mt-1">
            {project.title}
          </h1>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 text-xs font-bold transition-colors border-b-2 cursor-pointer ${
            activeTab === 'overview' ? 'border-[#007A61] text-[#007A61]' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <div className="flex items-center space-x-1.5">
            <Target className="w-3.5 h-3.5" />
            <span>Overview & Milestones</span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab('team')}
          className={`px-4 py-2 text-xs font-bold transition-colors border-b-2 cursor-pointer ${
            activeTab === 'team' ? 'border-[#007A61] text-[#007A61]' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <div className="flex items-center space-x-1.5">
            <Users className="w-3.5 h-3.5" />
            <span>Student Team</span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab('proposal')}
          className={`px-4 py-2 text-xs font-bold transition-colors border-b-2 cursor-pointer ${
            activeTab === 'proposal' ? 'border-[#007A61] text-[#007A61]' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <div className="flex items-center space-x-1.5">
            <FileText className="w-3.5 h-3.5" />
            <span>Proposal & Budget</span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab('prototype')}
          className={`px-4 py-2 text-xs font-bold transition-colors border-b-2 cursor-pointer ${
            activeTab === 'prototype' ? 'border-[#007A61] text-[#007A61]' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <div className="flex items-center space-x-1.5">
            <FlaskConical className="w-3.5 h-3.5" />
            <span>Prototype Lab</span>
            {project.prototypeStatus === 'Approved' && (
              <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-emerald-100 text-emerald-800 border border-emerald-200">
                ✓ Done
              </span>
            )}
            {project.prototypeStatus === 'In Review' && (
              <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-blue-100 text-blue-800 border border-blue-200">
                Sent
              </span>
            )}
          </div>
        </button>
      </div>

      {/* Content Area */}
      <div className="pt-2">
        {activeTab === 'overview' && (
          <FacultyProjectsPanel 
            projects={projects} 
            faculty={faculty} 
            onRefresh={onRefresh} 
            initialProjectId={project.projectId || project.challengeId}
            hideHeader={true}
          />
        )}
        {activeTab === 'team' && (
          <FacultyTeamsPanel 
            projects={projects} 
            faculty={faculty} 
            onRefresh={onRefresh} 
            initialProjectId={project.projectId || project.challengeId}
            hideHeader={true}
          />
        )}
        {activeTab === 'proposal' && (
          <FacultyProposalsPanel 
            projects={projects} 
            faculty={faculty} 
            onRefresh={onRefresh} 
            initialProjectId={project.projectId || project.challengeId}
            hideHeader={true}
          />
        )}
        {activeTab === 'prototype' && (
          <FacultyPrototypePanel 
            project={project} 
            faculty={faculty} 
            onRefresh={onRefresh} 
          />
        )}
      </div>
    </div>
  );
};

export default FacultyProjectWorkspace;
