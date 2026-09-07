import React from 'react';
import { FacultyDashboard } from '../dashboard/FacultyDashboard.jsx';
import { FacultyAssignedChallenges } from '../challenges/FacultyAssignedChallenges.jsx';
import { FacultyTeamsPanel } from '../teams/FacultyTeamsPanel.jsx';
import { FacultyProjectsPanel } from '../projects/FacultyProjectsPanel.jsx';
import { FacultyProjectWorkspace } from '../projects/FacultyProjectWorkspace.jsx';
import { FacultyProfilePanel } from '../profile/FacultyProfilePanel.jsx';
import { FacultyRevisionsPanel } from '../revisions/FacultyRevisionsPanel.jsx';
import { FacultyNotificationsPanel } from './FacultyNotificationsPanel.jsx';

export const FacultyTabContent = ({
  loading,
  activeTab,
  selectedProjectId,
  data,
  universityCode,
  notificationsList,
  handleSetActiveTab,
  setSelectedProjectId,
  loadData
}) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-xs font-semibold text-slate-500">
        Loading Faculty Mentorship Workspace...
      </div>
    );
  }

  if (activeTab === 'notifications') {
    return (
      <FacultyNotificationsPanel
        onBack={() => handleSetActiveTab('dashboard')}
        universityCode={universityCode}
        notifications={notificationsList}
        onNavigateProject={(id) => { setSelectedProjectId(id); handleSetActiveTab('project-workspace', id); }}
        onClearNotifications={() => loadData(false)}
      />
    );
  }

  if (activeTab === 'challenges') {
    return (
      <FacultyAssignedChallenges
        challenges={data.challenges || []}
        allChallenges={data.allChallenges || []}
        faculty={data.faculty}
        onRefresh={loadData}
        onDraftProposal={() => handleSetActiveTab('dashboard')}
      />
    );
  }

  if (activeTab === 'revisions') {
    return (
      <FacultyRevisionsPanel
        revisions={data.revisions || []}
        projects={data.projects || []}
        faculty={data.faculty}
        onRefresh={loadData}
        onNavigateTab={(tab, id = null) => handleSetActiveTab(tab, id)}
      />
    );
  }

  if (activeTab === 'project-workspace') {
    const selectedProj = data.projects?.find(
      (p) => p.projectId === selectedProjectId || p.challengeId === selectedProjectId
    );

    if (selectedProj) {
      return (
        <FacultyProjectWorkspace
          project={selectedProj}
          projects={data.projects}
          teams={data.teams || []}
          faculty={data.faculty}
          onRefresh={loadData}
          onBack={() => handleSetActiveTab('dashboard')}
        />
      );
    }

    return (
      <div className="bg-white border border-slate-200/90 rounded-2xl p-10 text-center text-slate-500 space-y-3">
        <p className="text-xs font-semibold text-slate-700">Project workspace could not locate selected project or is loading.</p>
        <button
          onClick={() => handleSetActiveTab('dashboard')}
          className="px-4 py-2 bg-[#007A61] hover:bg-[#006650] text-white text-xs font-bold rounded-xl transition-all shadow-2xs cursor-pointer"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  if (activeTab === 'projects') {
    return (
      <FacultyProjectsPanel
        projects={data.projects}
        faculty={data.faculty}
        onRefresh={loadData}
        onNavigateTab={(tab, id = null) => handleSetActiveTab(tab, id)}
      />
    );
  }

  if (activeTab === 'teams') {
    return (
      <FacultyTeamsPanel
        projects={data.projects || []}
        challenges={data.challenges || data.allChallenges || []}
        teams={data.teams || []}
        faculty={data.faculty}
        onRefresh={loadData}
      />
    );
  }

  if (activeTab === 'profile') {
    return <FacultyProfilePanel faculty={data.faculty} onRefresh={loadData} />;
  }

  return (
    <FacultyDashboard
      faculty={data.faculty}
      challenges={data.challenges}
      projects={data.projects}
      onNavigateTab={(tab, id = null) => handleSetActiveTab(tab, id)}
    />
  );
};

export default FacultyTabContent;
