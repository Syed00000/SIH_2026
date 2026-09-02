import { useState, useEffect } from 'react';
import { universityApiService } from '../../../../university/services/universityApiService.js';

export const useFacultyTeams = ({ projects = [], faculty, onRefresh, initialProjectId = null, viewMode = 'list' }) => {
  const [selectedProjectId, setSelectedProjectId] = useState(
    initialProjectId || projects[0]?.projectId || projects[0]?.challengeId || ''
  );

  const currentProject =
    projects.find((p) => p.projectId === selectedProjectId || p.challengeId === selectedProjectId) ||
    projects[0] ||
    null;

  const [teamName, setTeamName] = useState(
    currentProject?.studentTeam || currentProject?.teamName || 'Smart Aqua Innovators'
  );

  const [teamMembers, setTeamMembers] = useState(
    currentProject?.teamMembers?.length ? currentProject.teamMembers : []
  );

  const [newMember, setNewMember] = useState({
    name: '',
    rollNo: '',
    department: 'Computer Science & Engineering',
    role: 'Student Team Leader',
    email: '',
    year: '3rd Year B.Tech',
    isLead: false
  });

  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (viewMode === 'create') {
      setTeamName('');
      setTeamMembers([]);
    } else if (currentProject) {
      setTeamName(currentProject.studentTeam || currentProject.teamName || 'Smart Aqua Innovators');
      setTeamMembers(Array.isArray(currentProject.teamMembers) ? currentProject.teamMembers : []);
    }
  }, [currentProject?.projectId, viewMode]);

  const handleAddMember = (e) => {
    e.preventDefault();
    if (!newMember.name.trim()) return;

    setTeamMembers([
      ...teamMembers,
      {
        id: `STU-${Date.now().toString().slice(-4)}`,
        name: newMember.name.trim(),
        rollNo: newMember.rollNo.trim() || `RU23BTECH${Math.floor(100 + Math.random() * 900)}`,
        department: newMember.department,
        role: newMember.role,
        email: newMember.email.trim() || `${newMember.name.toLowerCase().replace(/\s+/g, '.')}@student.ru.ac.in`,
        year: newMember.year,
        isLead: newMember.isLead || teamMembers.length === 0
      }
    ]);

    setNewMember({
      name: '',
      rollNo: '',
      department: 'Computer Science & Engineering',
      role: 'Hardware & Sensor Engineer',
      email: '',
      year: '3rd Year B.Tech',
      isLead: false
    });
  };

  const handleToggleLead = (idx) => {
    setTeamMembers(teamMembers.map((m, i) => ({ ...m, isLead: i === idx })));
  };

  const handleRemoveMember = (idx) => {
    setTeamMembers(teamMembers.filter((_, i) => i !== idx));
  };

  const handleSaveTeam = async () => {
    if (!currentProject) return;
    setSaving(true);
    try {
      const leadMember = teamMembers.find((m) => m.isLead) || teamMembers[0];
      const finalTeamName = teamName.trim() || `${faculty?.name?.split(' ')[0] || 'Research'} Innovation Team`;

      await universityApiService.updateProject(currentProject.projectId || currentProject._id, {
        ...currentProject,
        teamMembers,
        teamMembersCount: teamMembers.length,
        studentLead: leadMember?.name || 'Unassigned',
        studentTeam: finalTeamName,
        teamName: finalTeamName
      });
      setSavedSuccess(true);
      if (onRefresh) await onRefresh();
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save team:', err);
    } finally {
      setSaving(false);
    }
  };

  return {
    selectedProjectId,
    setSelectedProjectId,
    currentProject,
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
  };
};

export default useFacultyTeams;
