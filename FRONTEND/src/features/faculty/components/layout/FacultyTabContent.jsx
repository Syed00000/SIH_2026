import React, { useState } from 'react';
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
  const [returnTab, setReturnTab] = useState('challenges');

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
        projects={data.projects || []}
        faculty={data.faculty}
        onRefresh={loadData}
        onOpenProject={(projectId) => {
          setReturnTab('challenges');
          setSelectedProjectId(projectId);
          handleSetActiveTab('project-workspace', projectId);
        }}
        onDraftProposal={(c) => {
          const targetId = c.challengeId || c.id || c._id;
          setReturnTab('challenges');
          setSelectedProjectId(targetId);
          handleSetActiveTab('project-workspace', targetId);
        }}
      />
    );
  }

  if (activeTab === 'project-workspace') {
    let selectedProj = data.projects?.find(
      (p) => p.projectId === selectedProjectId || p.challengeId === selectedProjectId || p._id === selectedProjectId
    );

    if (!selectedProj) {
      const challengeMatch = (data.challenges || data.allChallenges || []).find(
        (c) => c.challengeId === selectedProjectId || c.id === selectedProjectId || c._id === selectedProjectId
      );
      if (challengeMatch) {
        selectedProj = {
          projectId: challengeMatch.challengeId || `PRJ-${selectedProjectId}`,
          challengeId: challengeMatch.challengeId,
          title: challengeMatch.title,
          problemStatement: challengeMatch.problemStatement || challengeMatch.description,
          domain: challengeMatch.domain || challengeMatch.category || 'Urban Development',
          status: challengeMatch.status || 'Proposal Stage',
          location: challengeMatch.location,
          assignedFaculty: challengeMatch.assignedFaculty,
          assignedUniversity: challengeMatch.assignedUniversity,
          prototypeStatus: challengeMatch.prototypeStatus || 'Not Started',
          governmentStatus: challengeMatch.governmentStatus || 'Pending',
          disbursedAmount: '0',
          sanctionedBudget: null
        };
      }
    }

    if (!selectedProj && data.projects?.length > 0) {
      selectedProj = data.projects[0];
    }

    if (selectedProj) {
      return (
        <FacultyProjectWorkspace
          project={selectedProj}
          projects={data.projects}
          teams={data.teams || []}
          faculty={data.faculty}
          onRefresh={loadData}
          onBack={() => handleSetActiveTab(returnTab || 'projects')}
        />
      );
    }

    return (
      <FacultyAssignedChallenges
        challenges={data.challenges || []}
        allChallenges={data.allChallenges || []}
        projects={data.projects || []}
        faculty={data.faculty}
        onRefresh={loadData}
        onOpenProject={(projectId) => {
          setReturnTab('challenges');
          setSelectedProjectId(projectId);
          handleSetActiveTab('project-workspace', projectId);
        }}
        onDraftProposal={(c) => {
          const targetId = c.challengeId || c.id || c._id;
          setReturnTab('challenges');
          setSelectedProjectId(targetId);
          handleSetActiveTab('project-workspace', targetId);
        }}
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
        onNavigateTab={(tab, id = null) => {
          setReturnTab('revisions');
          handleSetActiveTab(tab, id);
        }}
      />
    );
  }

  if (activeTab === 'projects') {
    return (
      <FacultyProjectsPanel
        projects={data.projects}
        faculty={data.faculty}
        onRefresh={loadData}
        onNavigateTab={(tab, id = null) => {
          setReturnTab('projects');
          handleSetActiveTab(tab, id);
        }}
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
      onNavigateTab={(tab, id = null) => {
        setReturnTab('dashboard');
        handleSetActiveTab(tab, id);
      }}
    />
  );
};

export default FacultyTabContent;
