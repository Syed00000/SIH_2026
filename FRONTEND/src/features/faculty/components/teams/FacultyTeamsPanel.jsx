import React from 'react';
import { useFacultyTeams } from './hooks/useFacultyTeams.js';
import { TeamsHeader } from './components/TeamsHeader.jsx';
import { TeamProjectSelector } from './components/TeamProjectSelector.jsx';
import { TeamNameConfigCard } from './components/TeamNameConfigCard.jsx';
import { TeamRosterList } from './components/TeamRosterList.jsx';
import { AddTeamMemberForm } from './components/AddTeamMemberForm.jsx';
import { TeamGuidelinesCard } from './components/TeamGuidelinesCard.jsx';
import { EmptyProjectsState } from './components/EmptyProjectsState.jsx';

export const FacultyTeamsPanel = ({
  projects = [],
  faculty,
  onRefresh,
  initialProjectId = null,
  hideHeader = false
}) => {
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
  } = useFacultyTeams({ projects, faculty, onRefresh, initialProjectId });

  return (
    <div className={`space-y-4 max-w-7xl mx-auto select-none ${hideHeader ? '' : 'pb-12'}`}>
      {!hideHeader && <TeamsHeader />}

      {projects.length === 0 ? (
        <EmptyProjectsState />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className={hideHeader ? 'space-y-4' : 'lg:col-span-2 space-y-4'}>
            {!hideHeader && (
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
              onSaveTeam={handleSaveTeam}
              onToggleLead={handleToggleLead}
              onRemoveMember={handleRemoveMember}
            />

            <AddTeamMemberForm
              newMember={newMember}
              setNewMember={setNewMember}
              onAddMember={handleAddMember}
            />
          </div>

          {!hideHeader && <TeamGuidelinesCard />}
        </div>
      )}
    </div>
  );
};

export default FacultyTeamsPanel;
