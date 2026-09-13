import { useState, useEffect, useCallback } from 'react';
import apiClient from '../../../../infrastructure/api/client.js';
import { universityService } from '../../services/universityService.js';

export const useHeiHubData = () => {
  const [heisList, setHeisList] = useState([]);
  const [overrideData, setOverrideData] = useState([]);
  const [milestones, setMilestones] = useState([]);
  const [stats, setStats] = useState({
    totalHeis: 0,
    activeTeams: 0,
    problemsAssigned: 0,
    solutionsSubmitted: 0,
    creditsEarned: 0
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
        universityService.fetchHeis({ page: 1, limit: 100 }),
        apiClient.get('citizen/challenges?limit=100'),
        apiClient.get('university/projects')
      ]);

      const heis = heisRes.status === 'fulfilled' ? (heisRes.value?.records || []) : [];
      const challenges = citizenRes.status === 'fulfilled' ? (citizenRes.value?.data?.data || citizenRes.value?.data || []) : [];
      const projects = projectsRes.status === 'fulfilled' ? (projectsRes.value?.data?.data || projectsRes.value?.data || []) : [];

      setHeisList(heis);

      // 1. Build Allocation Override list from real challenges
      const overrides = (Array.isArray(challenges) ? challenges : []).map((c) => {
        const hasUni = c.assignedUniversity?.name || c.assignedUniversity?.id;
        const isDeclined = c.acceptanceStatus === 'Declined';
        return {
          id: c.challengeId || String(c._id),
          rawId: c._id,
          title: c.title || 'Untitled Problem',
          currentHei: c.assignedUniversity?.name || 'Unassigned',
          currentHeiId: c.assignedUniversity?.id || '',
          suggestedHei: c.suggestedHei || '—',
          sector: c.domain || 'General',
          district: c.district || c.location?.district || 'Ranchi',
          priority: c.priority || 'Medium',
          status: isDeclined ? 'Reassignment Requested' : hasUni ? 'Reassigned' : 'Pending'
        };
      });
      setOverrideData(overrides);

      // 2. Build Milestone verification list from real projects
      const milestonesList = [];
      let totalCompletedMilestones = 0;
      (Array.isArray(projects) ? projects : []).forEach((p) => {
        (p.milestones || []).forEach((m, idx) => {
          if (m.status === 'Completed') totalCompletedMilestones += 1;
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

      // 3. Compute Stats
      const assignedCount = overrides.filter((o) => o.currentHei !== 'Unassigned').length;
      const solvedCount = (Array.isArray(challenges) ? challenges : []).filter(
        (c) => c.status === 'Resolved' || c.status === 'Deployed'
      ).length;
      setStats({
        totalHeis: heis.length,
        activeTeams: (Array.isArray(projects) ? projects : []).length,
        problemsAssigned: assignedCount,
        solutionsSubmitted: solvedCount,
        creditsEarned: totalCompletedMilestones * 4
      });

      // 4. Institutional Leaderboard
      const leaderboard = heis.map((h, idx) => {
        const assigned = overrides.filter((o) => o.currentHeiId === String(h._id) || o.currentHei === h.name).length;
        const uniProjects = (Array.isArray(projects) ? projects : []).filter(
          (p) => p.universityId === String(h._id) || p.universityCode === h.code
        );
        const submitted = uniProjects.filter((p) => p.status === 'Completed' || p.status === 'Resolved').length;
        const completedMilestones = uniProjects.reduce(
          (acc, p) => acc + (p.milestones || []).filter((m) => m.status === 'Completed').length,
          0
        );
        return {
          rank: idx + 1,
          name: h.name,
          assigned,
          submitted,
          active: uniProjects.length,
          credits: completedMilestones * 4
        };
      }).sort((a, b) => b.credits - a.credits || b.assigned - a.assigned);

      setLeaderboardData(leaderboard);
    } catch (err) {
      console.warn('Failed to load HEI Hub data:', err);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const submitOverrideAction = async (selectedRecord, approved, selectedHeiName, remarks) => {
    if (!remarks?.trim()) {
      showToast('Remarks are required.', 'error');
      return false;
    }
    try {
      const targetUni = heisList.find((h) => h.name === selectedHeiName);
      if (approved) {
        await apiClient.patch(`citizen/challenges/${selectedRecord.id}/assign`, {
          assignedUniversity: targetUni ? { id: String(targetUni._id), name: targetUni.name, code: targetUni.code } : { name: selectedHeiName },
          adminRemarks: remarks
        });
      } else {
        await apiClient.patch(`citizen/challenges/${selectedRecord.id}/triage`, {
          status: 'Under Review',
          acceptanceStatus: 'Accepted',
          adminRemarks: remarks
        });
      }
      showToast(`Reassignment request ${approved ? 'approved' : 'declined'} successfully`);
      loadData();
      return true;
    } catch (err) {
      showToast(err.message || 'Failed to update assignment', 'error');
      return false;
    }
  };

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
      loadData();
      return true;
    } catch (err) {
      showToast(err.message || 'Failed to update milestone status', 'error');
      return false;
    }
  };

  return {
    heisList,
    overrideData,
    milestones,
    stats,
    leaderboardData,
    toast,
    submitOverrideAction,
    submitMilestoneAction
  };
};

export default useHeiHubData;
