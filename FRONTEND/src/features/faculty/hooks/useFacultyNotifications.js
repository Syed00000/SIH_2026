import { useMemo } from 'react';

/**
 * Custom hook to aggregate and deduplicate live notifications and directives for Faculty.
 */
export const useFacultyNotifications = (data = {}) => {
  const projectRevisionsCount = useMemo(() => {
    return (data.projects || []).filter((p) => {
      const s = `${p.budgetStatus} ${p.prototypeStatus} ${p.governmentStatus} ${p.status}`.toLowerCase();
      return s.includes('changes required') || Boolean(p.adminRemarks && s.includes('changes'));
    }).length;
  }, [data.projects]);

  const totalRevisionCount = Math.max(projectRevisionsCount, (data.revisions || []).length);

  const notificationsList = useMemo(() => {
    const list = [
      ...(data.activities || []).map((a) => ({
        id: `act-${a.id || a._id}`,
        title: a.title || (a.type === 'directive' ? 'University Revision Directive' : 'Institutional Notification'),
        message: a.description || a.text,
        type: a.type || 'directive',
        projectId: a.projectId,
        challengeId: a.challengeId,
        date: a.time || a.timestamp || new Date().toISOString()
      })),
      ...(data.projects || []).filter((p) => p.prototypeWorkRequested).map((p) => ({
        id: `proto-dir-${p.projectId || p.challengeId}`,
        title: `Directive: Start Prototype Work (${p.title || p.projectId})`,
        message: '1st Grant Installment received from State Escrow. Ranchi University Authority has officially authorized your team to start prototype development.',
        type: 'directive',
        projectId: p.projectId || p.challengeId,
        date: p.prototypeWorkRequestedAt || p.updatedAt || new Date().toISOString()
      })),
      ...(data.projects || []).filter((p) => p.adminRemarks || p.universityRemarks).map((p) => ({
        id: `notif-${p.projectId || p.challengeId}`,
        title: `University Directive: ${p.title || p.projectId}`,
        message: p.adminRemarks || p.universityRemarks,
        type: 'directive',
        projectId: p.projectId || p.challengeId,
        date: p.updatedAt || new Date().toISOString()
      })),
      ...(data.approvals || []).flatMap((app) =>
        (app.history || [])
          .filter((h) => h.action === 'Changes Requested' || h.action?.includes('Revision'))
          .map((h, idx) => ({
            id: `rev-hist-${app.approvalId || app.projectId}-${idx}`,
            title: `Revision Feedback #${idx + 1}: ${app.project || app.title || 'Proposal'}`,
            message: h.note || 'Revision requested by University Authority.',
            type: 'directive',
            projectId: app.projectId || app.approvalId?.replace('APP-', ''),
            challengeId: app.challengeId,
            date: h.timestamp || app.date || new Date().toISOString()
          }))
      )
    ];

    const seen = new Set();
    return list.filter((item) => {
      const key = `${item.projectId || ''}_${(item.message || '').trim().toLowerCase()}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [data.activities, data.projects, data.approvals]);

  return {
    totalRevisionCount,
    notificationsList,
    totalNotificationCount: notificationsList.length
  };
};

export default useFacultyNotifications;
