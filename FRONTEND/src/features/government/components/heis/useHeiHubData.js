import { useState, useEffect, useCallback } from 'react';
import apiClient from '../../../../infrastructure/api/client.js';
import { universityService } from '../../services/universityService.js';

export const useHeiHubData = () => {
  const [heisList, setHeisList] = useState([]);
  const [milestones, setMilestones] = useState([]);
  const [stats, setStats] = useState({
    totalHeis: 0,
    activeTeams: 0,
    problemsAssigned: 0,
    solutionsSubmitted: 0
  });
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const loadData = useCallback(async () => {
    try {
      const [heisRes, citizenRes, projectsRes] = await Promise.allSettled([
        universityService.getUniversities({ page: 1, limit: 100 }),
        apiClient.get('citizen/challenges?limit=100'),
        apiClient.get('university/projects')
      ]);

      const heis = heisRes.status === 'fulfilled' ? (heisRes.value?.records || []) : [];
      const challenges = citizenRes.status === 'fulfilled' ? (citizenRes.value?.data?.data || citizenRes.value?.data || []) : [];
      const projects = projectsRes.status === 'fulfilled' ? (projectsRes.value?.data?.data || projectsRes.value?.data || []) : [];

      setHeisList(heis);

      // 1. Build Milestone verification list from real projects
      const milestonesList = [];
      let totalCompletedMilestones = 0;
      (Array.isArray(projects) ? projects : []).forEach((p) => {
        (p.milestones || []).forEach((m, idx) => {
          if (m.status === 'Completed' || m.status === 'Approved') totalCompletedMilestones += 1;
          milestonesList.push({
            id: `${p.projectId || p._id}-M${idx + 1}`,
            projectId: p._id,
            projectCode: p.projectId,
            milestoneId: m.milestoneId || m._id || `M${idx + 1}`,
            title: `${p.title} (${m.name || m.title || `Stage ${idx + 1}`})`,
            hei: p.universityName || 'Accredited HEI',
            type: m.name || m.title || 'Deliverable',
            date: m.submittedAt ? new Date(m.submittedAt).toLocaleDateString('en-GB') : 'Recent',
            status: m.status || 'Under Review'
          });
        });
      });
      setMilestones(milestonesList);

      // 2. Compute Stats
      const assignedCount = (Array.isArray(challenges) ? challenges : []).filter((c) => c.assignedUniversity?.name || c.assignedUniversity?.id).length;
      const solvedCount = (Array.isArray(challenges) ? challenges : []).filter((c) => c.status === 'Resolved' || c.status === 'Deployed').length;
      setStats({
        totalHeis: heis.length,
        activeTeams: (Array.isArray(projects) ? projects : []).length,
        problemsAssigned: assignedCount,
        solutionsSubmitted: solvedCount
      });

      // 3. Institutional Performance Leaderboard
      const leaderboard = heis.map((h, idx) => {
        const uniProjects = (Array.isArray(projects) ? projects : []).filter(
          (p) =>
            p.universityId === String(h._id) ||
            p.universityCode === h.code ||
            (p.universityName && h.name && p.universityName.trim().toLowerCase() === h.name.trim().toLowerCase()) ||
            (p.universityCode && h.shortName && p.universityCode.trim().toLowerCase() === h.shortName.trim().toLowerCase())
        );
        const assigned = (Array.isArray(challenges) ? challenges : []).filter(
          (c) =>
            c.assignedUniversity?.id === String(h._id) ||
            c.assignedUniversity?.code === h.code ||
            (c.assignedUniversity?.name && h.name && c.assignedUniversity.name.trim().toLowerCase() === h.name.trim().toLowerCase())
        ).length;
        const submitted = uniProjects.filter((p) => p.status === 'Completed' || p.status === 'Resolved').length;
        const completedMilestones = uniProjects.reduce(
          (acc, p) => acc + (p.milestones || []).filter((m) => m.status === 'Completed' || m.status === 'Approved').length,
          0
        );
        return {
          rank: idx + 1,
          name: h.name,
          assigned,
          submitted,
          active: uniProjects.length,
          completedMilestones,
          credits: completedMilestones * 4
        };
      }).sort((a, b) => b.completedMilestones - a.completedMilestones || b.submitted - a.submitted || b.assigned - a.assigned);

      setLeaderboardData(leaderboard);
    } catch (err) {
      console.warn('Failed to load HEI Hub data:', err);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const submitMilestoneAction = async (selectedRecord, action, remarks) => {
    if (!remarks?.trim()) {
      showToast('Feedback remarks are required.', 'error');
      return false;
    }
    try {
      await apiClient.patch(`university/projects/${selectedRecord.projectId}`, {
        milestoneId: selectedRecord.milestoneId,
        status: action,
        remarks
      });
      showToast(`Milestone status updated to: ${action}`);
      await loadData();
      return true;
    } catch (err) {
      showToast(err.message || 'Failed to update milestone status', 'error');
      return false;
    }
  };

  return {
    heisList,
    milestones,
    stats,
    leaderboardData,
    toast,
    recentApprovals: milestones.filter((m) => m.status === 'Approved' || m.status === 'Completed'),
    submitMilestoneAction,
    loadData
  };
};

export default useHeiHubData;
