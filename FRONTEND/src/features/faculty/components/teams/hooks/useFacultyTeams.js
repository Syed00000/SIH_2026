import { useState, useEffect } from 'react';
import { universityApiService } from '../../../../university/services/universityApiService.js';

export const useFacultyTeams = ({ projects = [], faculty, onRefresh, initialProjectId = null, viewMode = 'list' }) => {
  const [selectedProjectId, setSelectedProjectId] = useState(
    initialProjectId || projects[0]?.projectId || projects[0]?.challengeId || projects[0]?._id || ''
  );

  useEffect(() => {
    if (!selectedProjectId && projects.length > 0) {
      setSelectedProjectId(initialProjectId || projects[0]?.projectId || projects[0]?.challengeId || projects[0]?._id);
    }
  }, [projects, initialProjectId, selectedProjectId]);

  const currentProject =
    projects.find(
      (p) =>
        p.projectId === selectedProjectId ||
        p.challengeId === selectedProjectId ||
        (p._id && p._id.toString() === selectedProjectId)
    ) ||
    projects[0] ||
    null;

  const [teamName, setTeamName] = useState(
    currentProject?.studentTeam || currentProject?.teamName || 'Smart Aqua Innovators'
  );

  const [teamMembers, setTeamMembers] = useState(
    Array.isArray(currentProject?.teamMembers) && currentProject.teamMembers.length > 0
      ? currentProject.teamMembers
      : []
  );

  const [newMember, setNewMember] = useState({
    name: '',
    rollNo: '',
    department: 'Computer Science & Engineering',
    role: 'Student Team Leader',
    email: '',
    year: '3rd Year B.Tech',
    isLead: true
  });

  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Synchronize teamName and teamMembers when project changes
  useEffect(() => {
    if (currentProject) {
      const defaultName =
        currentProject.studentTeam ||
        currentProject.teamName ||
        `${faculty?.name?.split(' ')[0] || 'Research'} Innovation Team`;
      setTeamName(defaultName);
      setTeamMembers(Array.isArray(currentProject.teamMembers) ? currentProject.teamMembers : []);
    }
  }, [currentProject?.projectId, currentProject?._id, currentProject?.challengeId]);

  const handleSaveTeam = async (overrideMembers = null, overrideTeamName = null) => {
    if (!currentProject) return;
    setSaving(true);
    try {
      const activeMembers = overrideMembers !== null ? overrideMembers : teamMembers;
      const activeName = overrideTeamName !== null ? overrideTeamName : teamName;
      const leadMember = activeMembers.find((m) => m.isLead) || (activeMembers.length > 0 ? activeMembers[0] : null);
      const finalTeamName = activeName?.trim() || `${faculty?.name?.split(' ')[0] || 'Research'} Innovation Team`;
      const leadName = leadMember?.name || 'Unassigned';

      const projId = currentProject.projectId || currentProject.challengeId || currentProject._id;
      const uniCode = faculty?.universityCode || currentProject.universityCode || 'RU001';

      await universityApiService.updateProject(
        projId,
        {
          teamMembers: activeMembers,
          teamMembersCount: activeMembers.length,
          studentLead: leadName,
          studentTeam: finalTeamName,
          teamName: finalTeamName
        },
        uniCode
      );

      setSavedSuccess(true);
      if (onRefresh) await onRefresh();
      setTimeout(() => setSavedSuccess(false), 3000);
      return true;
    } catch (err) {
      console.error('Failed to save team:', err);
      return false;
    } finally {
      setSaving(false);
    }
  };

  const handleAddMember = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!newMember.name.trim()) return;

    const isThisLead = Boolean(
      newMember.isLead ||
      newMember.role?.toLowerCase().includes('lead') ||
      teamMembers.length === 0 ||
      !teamMembers.some((m) => m.isLead)
    );

    const updatedExisting = isThisLead
      ? teamMembers.map((m) => ({ ...m, isLead: false }))
      : teamMembers;

    const addedMember = {
      id: `STU-${Date.now().toString().slice(-4)}`,
      name: newMember.name.trim(),
      rollNo: newMember.rollNo.trim() || `RU23BTECH${Math.floor(100 + Math.random() * 900)}`,
      department: newMember.department,
      role: newMember.role.trim() || (isThisLead ? 'Student Team Leader' : 'Student Researcher'),
      email: newMember.email.trim() || `${newMember.name.toLowerCase().replace(/\s+/g, '.')}@student.ru.ac.in`,
      year: newMember.year || '3rd Year B.Tech',
      isLead: isThisLead
    };

    const newRoster = [...updatedExisting, addedMember];
    setTeamMembers(newRoster);

    // Auto-save instantly so student leader is saved in database immediately
    await handleSaveTeam(newRoster, teamName);

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

  const handleToggleLead = async (idx) => {
    const updated = teamMembers.map((m, i) => ({ ...m, isLead: i === idx }));
    setTeamMembers(updated);
    await handleSaveTeam(updated, teamName);
  };

  const handleRemoveMember = async (idx) => {
    let remaining = teamMembers.filter((_, i) => i !== idx);
    if (teamMembers[idx]?.isLead && remaining.length > 0 && !remaining.some((m) => m.isLead)) {
      remaining = remaining.map((m, i) => ({ ...m, isLead: i === 0 }));
    }
    setTeamMembers(remaining);
    await handleSaveTeam(remaining, teamName);
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
