import { useState, useMemo } from 'react';
import { facultyApiService } from '../../../services/facultyApiService.js';

const STORAGE_KEY = 'joharsetu_faculty_custom_teams';

const getStoredTeams = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
};

export const useFacultyTeams = ({
  projects = [],
  challenges = [],
  teams = [],
  faculty,
  onRefresh,
  initialProjectId = null
}) => {
  const [editingTeamId, setEditingTeamId] = useState(null);
  const [selectedProjectId, setSelectedProjectId] = useState(initialProjectId || '');
  const [teamName, setTeamName] = useState('');
  const [teamMembers, setTeamMembers] = useState([]);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [localTeams, setLocalTeams] = useState(getStoredTeams);

  const [newMember, setNewMember] = useState({
    name: '',
    rollNo: '',
    department: 'Computer Science & Engineering',
    role: 'Student Team Leader',
    email: '',
    year: '3rd Year B.Tech',
    isLead: false
  });

  const allTeams = useMemo(() => {
    const list = [];
    const seen = new Set();

    projects.forEach((p) => {
      const id = p.projectId || p.challengeId || p._id;
      const tName = p.studentTeam || p.teamName || (p.teamMembers?.length ? `${p.title?.slice(0, 20)} Team` : '');
      if (tName || (p.teamMembers && p.teamMembers.length > 0)) {
        seen.add(id);
        list.push({
          id,
          teamCode: p.teamCode || `TEAM-PRJ-${id}`,
          name: tName || 'Innovation Lab Team',
          studentLead: p.studentLead || p.teamMembers?.find((m) => m.isLead)?.name || 'Unassigned',
          membersCount: p.teamMembers?.length || 0,
          members: p.teamMembers || [],
          project: p.title || 'Assigned Project',
          projectId: id,
          domain: p.domain || 'Technology',
          status: p.status || 'Active',
          source: 'project'
        });
      }
    });

    [...teams, ...localTeams].forEach((t) => {
      const code = t.teamCode || t.id || t._id;
      if (!code || seen.has(code)) return;
      seen.add(code);
      list.push({
        id: code,
        teamCode: code,
        name: t.name || t.teamName || 'Research Innovation Team',
        studentLead: t.leader || t.studentLead || t.members?.find((m) => m.isLead)?.name || 'Unassigned',
        membersCount: t.members?.length || t.teamMembers?.length || t.membersCount || 0,
        members: t.members || t.teamMembers || [],
        project: t.project && t.project !== 'Unassigned' ? t.project : 'Not Assigned Yet (Independent Lab)',
        projectId: t.projectId || '',
        domain: t.domain || 'R&D',
        status: t.status || 'Active',
        source: 'standalone'
      });
    });
    return list;
  }, [projects, teams, localTeams]);

  const handleStartCreate = () => {
    setEditingTeamId(null);
    setTeamName('');
    setSelectedProjectId('');
    setTeamMembers([]);
  };

  const handleStartEdit = (t) => {
    setEditingTeamId(t.id || t.teamCode || t.projectId);
    setTeamName(t.name || t.teamName || '');
    setSelectedProjectId(t.projectId || '');
    setTeamMembers(Array.isArray(t.members) ? t.members : Array.isArray(t.teamMembers) ? t.teamMembers : []);
  };

  const handleAddMember = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!newMember.name.trim()) return;

    setTeamMembers((prev) => [
      ...prev,
      {
        id: `STU-${Date.now().toString().slice(-4)}`,
        name: newMember.name.trim(),
        rollNo: newMember.rollNo.trim() || `RU23BTECH${Math.floor(100 + Math.random() * 900)}`,
        department: newMember.department,
        role: newMember.role,
        email: newMember.email.trim() || `${newMember.name.toLowerCase().replace(/\s+/g, '.')}@student.ru.ac.in`,
        year: newMember.year,
        isLead: newMember.isLead || prev.length === 0
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

  const handleToggleLead = (idx) => setTeamMembers((prev) => prev.map((m, i) => ({ ...m, isLead: i === idx })));
  const handleRemoveMember = (idx) => setTeamMembers((prev) => prev.filter((_, i) => i !== idx));

  const handleDeleteTeam = async (t) => {
    const id = t.id || t.teamCode || t.projectId;
    try {
      await facultyApiService.deleteTeam(id);
    } catch { }
    const updated = localTeams.filter((item) => item.id !== id && item.teamCode !== id && item.projectId !== id);
    setLocalTeams(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    if (onRefresh) await onRefresh();
  };

  const handleSaveTeam = async () => {
    setSaving(true);
    try {
      const leadMember = teamMembers.find((m) => m.isLead) || teamMembers[0];
      const finalTeamName = teamName.trim() || `${faculty?.name?.split(' ')[0] || 'Research'} Innovation Team`;
      const leadName = leadMember?.name || 'Unassigned';

      const targetProj = projects.find((p) => p.projectId === selectedProjectId || p.challengeId === selectedProjectId);
      const targetChl = challenges.find((c) => c.challengeId === selectedProjectId || c.id === selectedProjectId);
      const projTitle =
        targetProj?.title ||
        targetChl?.title ||
        (selectedProjectId ? selectedProjectId : 'Not Assigned Yet (Independent Lab)');

      const teamCode = editingTeamId || `TEAM-RU-${Date.now().toString().slice(-4)}`;
      const payload = {
        teamCode,
        id: teamCode,
        name: finalTeamName,
        teamName: finalTeamName,
        leader: leadName,
        studentLead: leadName,
        membersCount: teamMembers.length,
        members: teamMembers,
        project: projTitle,
        projectId: selectedProjectId || '',
        mentor: faculty?.name || 'Faculty Mentor',
        status: 'Active'
      };

      if (targetProj) {
        await facultyApiService.updateProject(targetProj.projectId || targetProj._id, {
          ...targetProj,
          teamMembers,
          teamMembersCount: teamMembers.length,
          studentLead: leadName,
          studentTeam: finalTeamName,
          teamName: finalTeamName
        });
      }

      if (editingTeamId) {
        await facultyApiService.updateTeam(teamCode, payload);
      } else {
        await facultyApiService.createTeam(payload);
      }

      const filtered = localTeams.filter(
        (t) => t.id !== teamCode && t.teamCode !== teamCode && (!selectedProjectId || t.projectId !== selectedProjectId)
      );
      const updatedLocal = [payload, ...filtered];
      setLocalTeams(updatedLocal);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedLocal));

      setSavedSuccess(true);
      if (onRefresh) await onRefresh();
      setTimeout(() => setSavedSuccess(false), 2500);
      return true;
    } catch (err) {
      console.error('Failed to save team:', err);
      return false;
    } finally {
      setSaving(false);
    }
  };

  return {
    editingTeamId,
    selectedProjectId,
    setSelectedProjectId,
    teamName,
    setTeamName,
    teamMembers,
    newMember,
    setNewMember,
    saving,
    savedSuccess,
    allTeams,
    handleStartCreate,
    handleStartEdit,
    handleAddMember,
    handleToggleLead,
    handleRemoveMember,
    handleDeleteTeam,
    handleSaveTeam
  };
};

export default useFacultyTeams;
