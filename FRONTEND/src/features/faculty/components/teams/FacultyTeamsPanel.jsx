import React, { useState, useEffect } from 'react';
import { useFacultyTeams } from './hooks/useFacultyTeams.js';
import { TeamsHeader } from './components/TeamsHeader.jsx';
import { FacultyTeamsListTable } from './components/FacultyTeamsListTable.jsx';
import { TeamProjectSelector } from './components/TeamProjectSelector.jsx';
import { TeamNameConfigCard } from './components/TeamNameConfigCard.jsx';
import { TeamRosterList } from './components/TeamRosterList.jsx';
import { AddTeamMemberForm } from './components/AddTeamMemberForm.jsx';
import { TeamGuidelinesCard } from './components/TeamGuidelinesCard.jsx';
import { ReadonlyTeamTable } from './components/ReadonlyTeamTable.jsx';
import { facultyApiService } from '../../services/facultyApiService.js';
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

  const currentProject = projects.find(
    (p) => (p.projectId || p.challengeId || p._id) === initialProjectId
  ) || projects[0];

  const matchedTeam =
    allTeams.find((t) => (t.projectId && t.projectId === initialProjectId) || (t.id && t.id === initialProjectId)) ||
    allTeams.find((t) => currentProject?.title && t.project && t.project.toLowerCase() === currentProject.title.toLowerCase()) ||
    (currentProject?.teamMembers?.length > 0 ? {
      name: currentProject.studentTeam || currentProject.teamName || 'Innovation Lab',
      members: currentProject.teamMembers,
      studentLead: currentProject.studentLead,
      teamCode: currentProject.teamCode
    } : null) ||
    allTeams[0] ||
    null;

  const displayTeamName = matchedTeam?.name || currentProject?.studentTeam || currentProject?.teamName || teamName || 'Innovation Lab';
  const displayMembers = (matchedTeam?.members && matchedTeam.members.length > 0)
    ? matchedTeam.members
    : (currentProject?.teamMembers && currentProject.teamMembers.length > 0)
    ? currentProject.teamMembers
    : teamMembers;

  // Auto-sync matched team to project if not yet linked
  useEffect(() => {
    if (hideHeader && currentProject && matchedTeam && matchedTeam.members?.length > 0 && (!currentProject.teamMembers || currentProject.teamMembers.length === 0)) {
      const pId = currentProject.projectId || currentProject.challengeId || currentProject._id;
      facultyApiService.updateProject(pId, {
        studentTeam: matchedTeam.name,
        teamMembers: matchedTeam.members,
        studentLead: matchedTeam.studentLead || matchedTeam.members?.find((m) => m.isLead)?.name || 'Lead',
        teamCode: matchedTeam.teamCode
      }).then(() => {
        if (onRefresh) onRefresh();
      }).catch(() => {});
    }
  }, [hideHeader, currentProject?.projectId, matchedTeam?.teamCode]);

  return (
    <div className={`space-y-4 max-w-7xl mx-auto select-none ${hideHeader ? '' : 'pb-12'}`}>
      {!hideHeader && <TeamsHeader />}

      <div className="w-full space-y-4">
        {hideHeader ? (
          <ReadonlyTeamTable
            teamName={displayTeamName}
            teamMembers={displayMembers}
            teamCode={matchedTeam?.teamCode}
            studentLead={matchedTeam?.studentLead}
            faculty={faculty}
            allTeams={allTeams}
            projectId={initialProjectId || currentProject?.projectId}
            onAssignTeam={async (teamToAssign) => {
              const pId = initialProjectId || currentProject?.projectId;
              if (!pId || !teamToAssign) return;
              await facultyApiService.updateProject(pId, {
                studentTeam: teamToAssign.name,
                teamMembers: teamToAssign.members,
                studentLead: teamToAssign.studentLead,
                teamCode: teamToAssign.teamCode
              }).catch(() => {});
              if (onRefresh) onRefresh();
            }}
          />
        ) : viewMode === 'list' ? (
          <FacultyTeamsListTable
            teams={allTeams}
            onSelectTeam={(t) => { handleStartEdit(t); setViewMode('editor'); }}
            onAddNewTeam={() => { handleStartCreate(); setViewMode('editor'); }}
            onDeleteTeam={handleDeleteTeam}
          />
        ) : (
          <div className="space-y-4">
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

        {!hideHeader && <TeamGuidelinesCard />}
      </div>
    </div>
  );
};

export default FacultyTeamsPanel;
