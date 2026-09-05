import React, { useState } from 'react';
import { useFacultyTeams } from './hooks/useFacultyTeams.js';
import { TeamsHeader } from './components/TeamsHeader.jsx';
import { FacultyTeamsListTable } from './components/FacultyTeamsListTable.jsx';
import { TeamProjectSelector } from './components/TeamProjectSelector.jsx';
import { TeamNameConfigCard } from './components/TeamNameConfigCard.jsx';
import { TeamRosterList } from './components/TeamRosterList.jsx';
import { AddTeamMemberForm } from './components/AddTeamMemberForm.jsx';
import { TeamGuidelinesCard } from './components/TeamGuidelinesCard.jsx';
import { ReadonlyTeamTable } from './components/ReadonlyTeamTable.jsx';
import { SendPrototypeModal } from './components/SendPrototypeModal.jsx';
import { ArrowLeft, Sparkles } from 'lucide-react';

export const FacultyTeamsPanel = ({
  projects = [],
  challenges = [],
  teams = [],
  faculty,
  onRefresh,
  initialProjectId = null,
  hideHeader = false
}) => {
  const [viewMode, setViewMode] = useState('list');
  const [prototypeModalTeam, setPrototypeModalTeam] = useState(null);

  const {
    editingTeamId, selectedProjectId, setSelectedProjectId, teamName, setTeamName,
    teamMembers, newMember, setNewMember, saving, savedSuccess, allTeams,
    handleStartCreate, handleStartEdit, handleAddMember, handleToggleLead,
    handleRemoveMember, handleDeleteTeam, handleSaveTeam
  } = useFacultyTeams({ projects, challenges, teams, faculty, onRefresh, initialProjectId });

  const onSaveAndReturn = async () => {
    const ok = await handleSaveTeam();
    if (ok) setViewMode('list');
  };

  const matchedProject = projects.find(
    (p) => (p.projectId || p.challengeId) === (prototypeModalTeam?.projectId || selectedProjectId)
  ) || projects[0];

  return (
    <div className={`space-y-4 max-w-7xl mx-auto select-none ${hideHeader ? '' : 'pb-12'}`}>
      {!hideHeader && <TeamsHeader />}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className={hideHeader ? 'space-y-4' : 'lg:col-span-2 space-y-4'}>
          {hideHeader ? (
            <ReadonlyTeamTable
              teamName={teamName || projects[0]?.studentTeam}
              teamMembers={teamMembers.length ? teamMembers : (projects[0]?.teamMembers || [])}
              faculty={faculty}
            />
          ) : viewMode === 'list' ? (
            <FacultyTeamsListTable
              teams={allTeams}
              onSelectTeam={(t) => { handleStartEdit(t); setViewMode('editor'); }}
              onAddNewTeam={() => { handleStartCreate(); setViewMode('editor'); }}
              onDeleteTeam={handleDeleteTeam}
              onSendPrototype={(t) => setPrototypeModalTeam(t)}
              onRefresh={onRefresh}
            />
          ) : (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-200">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  className="flex items-center space-x-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-2xs cursor-pointer transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Teams List</span>
                </button>
                <div className="text-[10.5px] font-bold px-2.5 py-1 bg-emerald-50 text-[#007A61] border border-emerald-200 rounded-lg flex items-center space-x-1">
                  <Sparkles className="w-3 h-3 text-[#007A61]" />
                  <span>{editingTeamId ? `Editing: ${teamName || 'Team'}` : 'Creating New Research Team'}</span>
                </div>
              </div>

              <TeamProjectSelector
                projects={projects}
                challenges={challenges}
                selectedProjectId={selectedProjectId}
                onProjectSelect={setSelectedProjectId}
              />
              <TeamNameConfigCard teamName={teamName} setTeamName={setTeamName} />
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
              <AddTeamMemberForm newMember={newMember} setNewMember={setNewMember} onAddMember={handleAddMember} />
            </div>
          )}
        </div>

        {!hideHeader && <TeamGuidelinesCard />}
      </div>

      {prototypeModalTeam && (
        <SendPrototypeModal
          team={prototypeModalTeam}
          project={matchedProject}
          faculty={faculty}
          isOpen={Boolean(prototypeModalTeam)}
          onClose={() => setPrototypeModalTeam(null)}
          onSuccess={onRefresh}
        />
      )}
    </div>
  );
};

export default FacultyTeamsPanel;
