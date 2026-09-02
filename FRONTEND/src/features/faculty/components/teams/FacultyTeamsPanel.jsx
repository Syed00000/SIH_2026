import React from 'react';
import { useFacultyTeams } from './hooks/useFacultyTeams.js';
import { TeamsHeader } from './components/TeamsHeader.jsx';
import { FacultyTeamsListTable } from './components/FacultyTeamsListTable.jsx';
import { TeamProjectSelector } from './components/TeamProjectSelector.jsx';
import { TeamNameConfigCard } from './components/TeamNameConfigCard.jsx';
import { TeamRosterList } from './components/TeamRosterList.jsx';
import { AddTeamMemberForm } from './components/AddTeamMemberForm.jsx';
import { TeamGuidelinesCard } from './components/TeamGuidelinesCard.jsx';
import { EmptyProjectsState } from './components/EmptyProjectsState.jsx';
import { ReadonlyTeamTable } from './components/ReadonlyTeamTable.jsx';

export const FacultyTeamsPanel = ({
  projects = [],
  faculty,
  onRefresh,
  initialProjectId = null,
  hideHeader = false
}) => {
  const [viewMode, setViewMode] = React.useState('list'); // 'list' | 'detail' | 'create'

  const {
    selectedProjectId,
    setSelectedProjectId,
    teamName,
    setTeamName,
    teamMembers,
    newMember,
    setNewMember,
    saving,
    savedSuccess,
    handleAddMember,
    handleToggleLead,
    handleRemoveMember,
    handleSaveTeam
  } = useFacultyTeams({ projects, faculty, onRefresh, initialProjectId, viewMode });

  const onSaveAndReturn = async () => {
    await handleSaveTeam();
    setViewMode('list');
  };

  return (
    <div className={`space-y-4 max-w-7xl mx-auto select-none ${hideHeader ? '' : 'pb-12'}`}>
      {!hideHeader && <TeamsHeader />}

      {projects.length === 0 ? (
        <EmptyProjectsState />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className={hideHeader ? 'space-y-4' : 'lg:col-span-2 space-y-4'}>
            {hideHeader ? (
              // When inside Project Workspace, just show the read-only view
              <ReadonlyTeamTable
                teamName={teamName}
                teamMembers={teamMembers}
                faculty={faculty}
              />
            ) : viewMode === 'list' ? (
              // Master View: List of all teams (Global Sidebar)
              <FacultyTeamsListTable 
                projects={projects}
                onSelectProject={(id) => {
                  setSelectedProjectId(id);
                  setViewMode('detail');
                }}
                onAddNewTeam={() => {
                  // Optionally pre-select the first project that doesn't have a team
                  const firstPending = projects.find(p => !p.teamMembers || p.teamMembers.length === 0);
                  if (firstPending) {
                    setSelectedProjectId(firstPending.projectId || firstPending.challengeId || firstPending._id);
                  }
                  setViewMode('create');
                }}
              />
            ) : (
              // Detail/Create View: Editing/Creating a specific team (Global Sidebar)
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <button
                  onClick={() => setViewMode('list')}
                  className="flex items-center space-x-2 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-2xs cursor-pointer w-fit"
                >
                  <span>← Back to Teams List</span>
                </button>

                {viewMode === 'create' && (
                  <TeamProjectSelector
                    projects={projects}
                    selectedProjectId={selectedProjectId}
                    onProjectSelect={setSelectedProjectId}
                  />
                )}

                <TeamNameConfigCard
                  teamName={teamName}
                  setTeamName={setTeamName}
                />

                <TeamRosterList
                  teamName={teamName}
                  teamMembers={teamMembers}
                  faculty={faculty}
                  saving={saving}
                  savedSuccess={savedSuccess}
                  onSaveTeam={onSaveAndReturn}
                  onToggleLead={handleToggleLead}
                  onRemoveMember={handleRemoveMember}
                />

                <AddTeamMemberForm
                  newMember={newMember}
                  setNewMember={setNewMember}
                  onAddMember={handleAddMember}
                />
              </div>
            )}
          </div>

          {!hideHeader && <TeamGuidelinesCard />}
        </div>
      )}
    </div>
  );
};

export default FacultyTeamsPanel;
