import { useState, useMemo } from 'react';
import { facultyApiService } from '../../../services/facultyApiService.js';
import { facultyTeamsStorage } from './facultyTeamsStorage.js';

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

  const validProjectIds = useMemo(() => projects.map((p) => p.projectId || p.challengeId || p._id).filter(Boolean), [projects]);
  const [localTeams, setLocalTeams] = useState(() => facultyTeamsStorage.getStoredTeams(validProjectIds));

  const [newMember, setNewMember] = useState({
    name: '', rollNo: '', department: 'Computer Science & Engineering',
    role: 'Student Team Leader', email: '', year: '3rd Year B.Tech', isLead: false
  });

  const allTeams = useMemo(() => {
    const list = [];
    const seen = new Set();
    const validSet = new Set(validProjectIds);

    projects.forEach((p) => {
      const id = p.projectId || p.challengeId || p._id;
      const tName = p.studentTeam || p.teamName || (p.teamMembers?.length ? `${p.title?.slice(0, 20)} Team` : '');
      if (tName || (p.teamMembers && p.teamMembers.length > 0)) {
        seen.add(id);
        if (p.teamCode) seen.add(p.teamCode);
        seen.add(`TEAM-${id}`);
        seen.add(`TEAM-PRJ-${id}`);
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
          isFunded: Boolean(p.disbursedAmount && p.disbursedAmount !== '0' && p.disbursedAmount !== '₹ 0'),
          prototypeStatus: p.prototypeStatus || 'Not Started',
          sanctionedBudget: p.sanctionedBudget || p.budget,
          pdfUrl: p.prototypeData?.pdfUrl || p.pdfUrl || '',
          pdfName: p.prototypeData?.pdfName || p.pdfName || '',
          source: 'project'
        });
      }
    });

    [...teams, ...localTeams].forEach((t) => {
      const code = t.teamCode || t.id || t._id;
      if (!code || seen.has(code) || (t.projectId && seen.has(t.projectId))) return;
      if (validSet.size > 0 && t.projectId && !validSet.has(t.projectId)) return;
      const title = (t.project || t.projectTitle || '').toLowerCase();
      if (title.includes('road beh') || title.includes('poor drainage')) return;
      seen.add(code);
      if (t.projectId) seen.add(t.projectId);
      const targetProj = projects.find((p) => p.projectId === t.projectId || p.challengeId === t.projectId);
      list.push({
        id: code,
        teamCode: code,
        name: t.name || t.teamName || 'Research Innovation Team',
        studentLead: t.leader || t.studentLead || t.members?.find((m) => m.isLead)?.name || 'Unassigned',
        membersCount: t.members?.length || t.teamMembers?.length || t.membersCount || 0,
        members: t.members || t.teamMembers || [],
        project: t.project && t.project !== 'Unassigned' ? t.project : (targetProj?.title || 'Not Assigned Yet (Independent Lab)'),
        projectId: t.projectId || targetProj?.projectId || '',
        domain: t.domain || targetProj?.domain || 'R&D',
        status: t.status || 'Active',
        isFunded: Boolean(targetProj?.disbursedAmount && targetProj.disbursedAmount !== '0' && targetProj.disbursedAmount !== '₹ 0'),
        prototypeStatus: targetProj?.prototypeStatus || t.prototypeStatus || 'Not Started',
        sanctionedBudget: targetProj?.sanctionedBudget || targetProj?.budget,
        pdfUrl: t.pdfUrl || targetProj?.prototypeData?.pdfUrl || targetProj?.pdfUrl || '',
        pdfName: t.pdfName || targetProj?.prototypeData?.pdfName || targetProj?.pdfName || '',
        source: 'standalone'
      });
    });
    return list;
  }, [projects, teams, localTeams, validProjectIds]);

  const handleStartCreate = () => {
    setEditingTeamId(null);
    setTeamName('');
    setSelectedProjectId(initialProjectId || (projects.length === 1 ? (projects[0]?.projectId || projects[0]?.challengeId) : ''));
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
    setNewMember({ name: '', rollNo: '', department: 'Computer Science & Engineering', role: 'Hardware & Sensor Engineer', email: '', year: '3rd Year B.Tech', isLead: false });
  };

  const handleToggleLead = (idx) => setTeamMembers((prev) => prev.map((m, i) => ({ ...m, isLead: i === idx })));
  const handleRemoveMember = (idx) => setTeamMembers((prev) => prev.filter((_, i) => i !== idx));

  const handleDeleteTeam = async (t) => {
    const targetId = t.teamCode || t.id || t.projectId;
    try {
      await facultyApiService.deleteTeam(targetId);
      if (t.projectId && t.projectId !== targetId) {
        await facultyApiService.deleteTeam(t.projectId);
      }
    } catch {}
    const updated = localTeams.filter((item) => item.id !== targetId && item.teamCode !== targetId && item.projectId !== t.projectId);
    setLocalTeams(updated);
    facultyTeamsStorage.saveStoredTeams(updated);
    if (onRefresh) await onRefresh();
  };

  const handleSaveTeam = async () => {
    setSaving(true);
    try {
      const leadMember = teamMembers.find((m) => m.isLead) || teamMembers[0];
      const finalTeamName = teamName.trim() || `${faculty?.name?.split(' ')[0] || 'Research'} Innovation Team`;
      const leadName = leadMember?.name || 'Unassigned';
      const targetProj = projects.find((p) => p.projectId === selectedProjectId || p.challengeId === selectedProjectId) || (projects.length === 1 ? projects[0] : null);
      const effectivePid = selectedProjectId || targetProj?.projectId || targetProj?.challengeId || '';
      const projTitle = targetProj?.title || (effectivePid ? effectivePid : 'Not Assigned Yet (Independent Lab)');
      const teamCode = editingTeamId || `TEAM-RU-${Date.now().toString().slice(-4)}`;

      const payload = {
        teamCode, id: teamCode, name: finalTeamName, teamName: finalTeamName,
        leader: leadName, studentLead: leadName, membersCount: teamMembers.length,
        members: teamMembers, project: projTitle, projectId: effectivePid,
        mentor: faculty?.name || 'Faculty Mentor', status: 'Active'
      };

      if (targetProj) {
        await facultyApiService.updateProject(targetProj.projectId || targetProj._id, {
          ...targetProj, teamMembers, teamMembersCount: teamMembers.length,
          studentLead: leadName, studentTeam: finalTeamName, teamName: finalTeamName, teamCode
        }).catch(() => {});
      }
      if (editingTeamId) await facultyApiService.updateTeam(teamCode, payload);
      else await facultyApiService.createTeam(payload);

      const filtered = localTeams.filter((t) => t.id !== teamCode && t.teamCode !== teamCode && (!selectedProjectId || t.projectId !== selectedProjectId));
      const updatedLocal = [payload, ...filtered];
      setLocalTeams(updatedLocal);
      facultyTeamsStorage.saveStoredTeams(updatedLocal);
      setSavedSuccess(true);
      if (onRefresh) await onRefresh();
      setTimeout(() => setSavedSuccess(false), 2000);
      return true;
    } catch (err) {
      console.error('Failed to save team:', err);
      return false;
    } finally {
      setSaving(false);
    }
  };

  return {
    editingTeamId, selectedProjectId, setSelectedProjectId, teamName, setTeamName,
    teamMembers, newMember, setNewMember, saving, savedSuccess, allTeams,
    handleStartCreate, handleStartEdit, handleAddMember, handleToggleLead,
    handleRemoveMember, handleDeleteTeam, handleSaveTeam
  };
};

export default useFacultyTeams;
