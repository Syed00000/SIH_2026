import React, { useState } from 'react';
import { ArrowLeft, Users, FileText, Target, CheckCircle2, FlaskConical, RotateCcw } from 'lucide-react';
import { FacultyProjectsPanel } from './FacultyProjectsPanel.jsx';
import { FacultyTeamsPanel } from '../teams/FacultyTeamsPanel.jsx';
import { FacultyProposalsPanel } from '../proposals/FacultyProposalsPanel.jsx';
import { FacultyPrototypePanel } from '../prototypes/FacultyPrototypePanel.jsx';

export const FacultyProjectWorkspace = ({ project, projects = [], teams = [], faculty, onRefresh, onBack }) => {
  const getInitialWorkspaceTab = () => {
    try {
      const p = new URLSearchParams(window.location.search);
      const tab = p.get('subtab');
      if (tab && ['overview', 'team', 'proposal', 'prototype'].includes(tab)) return tab;
      const stored = localStorage.getItem('joharsetu_faculty_workspace_tab');
      if (stored && ['overview', 'team', 'proposal', 'prototype'].includes(stored)) return stored;
    } catch {}
    return 'overview';
  };

  const [activeTab, setActiveTab] = useState(getInitialWorkspaceTab);

  const handleSetWorkspaceTab = (tab) => {
    setActiveTab(tab);
    try {
      localStorage.setItem('joharsetu_faculty_workspace_tab', tab);
      const url = new URL(window.location.href);
      url.searchParams.set('subtab', tab);
      window.history.replaceState({}, '', url.toString());
    } catch {}
  };

  if (!project) return null;

  const hasRevision = Boolean(project.adminRemarks) || Boolean(project.universityRemarks) ||
    String(project.budgetStatus || '').toLowerCase().includes('changes required') ||
    String(project.prototypeStatus || '').toLowerCase().includes('changes required');

  return (
    <div className="space-y-4 max-w-7xl mx-auto select-none pb-12 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <button onClick={onBack} className="flex items-center space-x-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors mb-2 cursor-pointer">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Dashboard</span>
          </button>
          <div className="flex items-center flex-wrap gap-2">
            <span className="text-[10px] font-mono font-bold bg-slate-100 px-2 py-0.5 rounded text-slate-700">{project.projectId}</span>
            <span className="text-[10.5px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">{project.domain}</span>
            <span className="text-[10.5px] font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">{project.status || 'Proposal Stage'}</span>
            {project.governmentStatus === 'Approved' || project.status === 'Completed' ? (
              <span className="text-[10.5px] font-extrabold text-emerald-800 bg-emerald-100/70 px-2.5 py-0.5 rounded-full border border-emerald-400 flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#007A61]" />
                <span>✓ State Certified & Deployed (TRL-9)</span>
              </span>
            ) : project.prototypeStatus === 'Approved' ? (
              <span className="text-[10.5px] font-extrabold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-300">
                ✓ University Approved (Forwarded to Govt)
              </span>
            ) : project.prototypeStatus === 'In Review' ? (
              <span className="text-[10.5px] font-extrabold text-blue-800 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                ⏳ Prototype Sent to University (Under Review)
              </span>
            ) : null}
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight mt-1">{project.title}</h1>
        </div>
      </div>

      {hasRevision && (
        <div className="bg-amber-50/90 border border-amber-300 rounded-2xl p-4 space-y-2 text-left">
          <div className="flex items-center justify-between border-b border-amber-200/80 pb-1.5">
            <div className="flex items-center space-x-2 text-amber-900 font-bold text-xs">
              <RotateCcw className="w-4 h-4 text-amber-600" />
              <span>University Authority Revision Directives:</span>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-500 text-white">Action Required</span>
          </div>
          <p className="text-xs text-amber-950 font-medium italic bg-white/70 p-2.5 rounded-xl border border-amber-200">
            "{project.adminRemarks || project.universityRemarks || 'Revisions requested by university review committee.'}"
          </p>
        </div>
      )}

      {project.prototypeWorkRequested && (
        <div className="bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-emerald-500/5 border border-emerald-300 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-left">
          <div className="flex items-start space-x-3">
            <div className="w-9 h-9 rounded-xl bg-[#007A61] text-white flex items-center justify-center shrink-0 mt-0.5">
              <FlaskConical className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-tight">
                  University Directive: Start Work on Prototype
                </h3>
                <span className="px-2 py-0.5 bg-emerald-100 text-[#007A61] text-[10px] font-extrabold rounded-full">
                  Grant Installment Credited ✓
                </span>
              </div>
              <p className="text-[11px] text-slate-600 font-medium mt-0.5">
                Ranchi University Authority has received the 1st Grant Installment from State PFMS Escrow and officially requested your team to commence Prototype R&D.
              </p>
            </div>
          </div>
          {activeTab !== 'prototype' && (
            <button
              onClick={() => handleSetWorkspaceTab('prototype')}
              className="px-3.5 py-1.5 bg-[#007A61] hover:bg-[#00604c] text-white rounded-xl text-xs font-bold transition-all shadow-xs shrink-0 cursor-pointer"
            >
              Open Prototype Lab →
            </button>
          )}
        </div>
      )}

      <div className="flex space-x-1 border-b border-slate-200">
        {[
          { id: 'overview', label: 'Overview & Milestones', icon: Target },
          { id: 'team', label: 'Student Team', icon: Users },
          { id: 'proposal', label: 'Proposal & Budget', icon: FileText },
          { id: 'prototype', label: 'Prototype Lab', icon: FlaskConical }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleSetWorkspaceTab(tab.id)}
              className={`px-4 py-2 text-xs font-bold transition-colors border-b-2 cursor-pointer flex items-center space-x-1.5 ${
                isActive ? 'border-[#007A61] text-[#007A61]' : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              {tab.id === 'prototype' && project.prototypeStatus === 'Approved' && (
                <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-emerald-100 text-emerald-800">✓ Done</span>
              )}
              {tab.id === 'prototype' && project.prototypeStatus === 'In Review' && (
                <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-blue-100 text-blue-800">Sent</span>
              )}
            </button>
          );
        })}
      </div>

      <div className="pt-2">
        {activeTab === 'overview' && <FacultyProjectsPanel projects={projects} faculty={faculty} onRefresh={onRefresh} initialProjectId={project.projectId || project.challengeId} hideHeader={true} />}
        {activeTab === 'team' && <FacultyTeamsPanel projects={projects} teams={teams} faculty={faculty} onRefresh={onRefresh} initialProjectId={project.projectId || project.challengeId} hideHeader={true} />}
        {activeTab === 'proposal' && <FacultyProposalsPanel projects={projects} faculty={faculty} onRefresh={onRefresh} initialProjectId={project.projectId || project.challengeId} hideHeader={true} />}
        {activeTab === 'prototype' && <FacultyPrototypePanel project={project} faculty={faculty} onRefresh={onRefresh} />}
      </div>
    </div>
  );
};

export default FacultyProjectWorkspace;
