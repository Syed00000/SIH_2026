import { CitizenChallenge } from '../../../citizen/infrastructure/model.js';
import { DepartmentGrantRequest } from '../../grants/grant-request.model.js';

export class GovernmentNotificationService {
  async getLiveNotifications() {
    try {
      const [pendingGrants, grantedGrants, pendingChallenges, inProgressChallenges, resolvedChallenges] =
        await Promise.all([
          DepartmentGrantRequest.find({ status: 'Pending' }).sort({ createdAt: -1 }).limit(10).lean(),
          DepartmentGrantRequest.find({ status: 'Granted' }).sort({ updatedAt: -1 }).limit(5).lean(),
          CitizenChallenge.find({
            isDeleted: { $ne: true },
            status: { $in: ['Under Review', 'Submitted', 'Clarification Requested'] }
          })
            .sort({ createdAt: -1 })
            .limit(10)
            .lean(),
          CitizenChallenge.find({
            isDeleted: { $ne: true },
            status: 'In Progress'
          })
            .sort({ updatedAt: -1 })
            .limit(5)
            .lean(),
          CitizenChallenge.find({
            isDeleted: { $ne: true },
            status: 'Resolved'
          })
            .sort({ updatedAt: -1 })
            .limit(5)
            .lean()
        ]);

      const notifications = [];

      // 1. Pending Department Grants (Action Required)
      pendingGrants.forEach((g) => {
        notifications.push({
          id: `req-${g.requestId || g._id}`,
          title: `Requisition: ${g.requesterName}`,
          message: `Requested ₹${Number(g.requestedAmount || 0).toLocaleString('en-IN')} for ${g.purpose}`,
          category: 'Grant Clearance',
          priority: g.isEmergency ? 'Emergency' : g.priority || 'Urgent',
          type: g.isEmergency ? 'emergency' : 'action_required',
          actionTab: 'csr',
          timestamp: g.createdAt || new Date().toISOString()
        });
      });

      // 2. Pending Citizen Grievances (Action Required)
      pendingChallenges.forEach((c) => {
        notifications.push({
          id: `chl-${c.challengeId || c._id}`,
          title: `Citizen Grievance: ${c.title}`,
          message: `${c.domain || 'Problem'} reported in ${c.district || 'Jharkhand'} (${c.location?.address || 'Awaiting Triage'})`,
          category: 'Citizen Triage',
          priority: c.priority || 'High',
          type: 'action_required',
          actionTab: 'overview',
          timestamp: c.createdAt || new Date().toISOString()
        });
      });

      // 3. Field Remediation in Progress
      inProgressChallenges.forEach((c) => {
        notifications.push({
          id: `prog-${c.challengeId || c._id}`,
          title: `In Progress: ${c.title}`,
          message: `Remediation underway by ${c.assignedTechnician?.name || c.assignedDepartment?.name || 'Assigned Department'}`,
          category: 'Remediation',
          priority: 'Normal',
          type: 'info',
          actionTab: 'overview',
          timestamp: c.updatedAt || c.createdAt || new Date().toISOString()
        });
      });

      // 4. Granted / Disbursed Grants
      grantedGrants.forEach((g) => {
        notifications.push({
          id: `grtd-${g.requestId || g._id}`,
          title: `Grant Cleared: ${g.requesterName}`,
          message: `₹${Number(g.sanctionedAmount || g.requestedAmount || 0).toLocaleString('en-IN')} disbursed (UTR: ${g.utrNumber || 'PFMS'})`,
          category: 'Treasury Disbursal',
          priority: 'Normal',
          type: 'success',
          actionTab: 'csr',
          timestamp: g.grantedAt || g.updatedAt || g.createdAt || new Date().toISOString()
        });
      });

      // 5. Ground Solved Grievances
      resolvedChallenges.forEach((c) => {
        notifications.push({
          id: `res-${c.challengeId || c._id}`,
          title: `Problem Solved: ${c.title}`,
          message: `Citizen grievance in ${c.district || 'Jharkhand'} successfully resolved on ground.`,
          category: 'Resolved Case',
          priority: 'Normal',
          type: 'success',
          actionTab: 'overview',
          timestamp: c.resolvedAt || c.updatedAt || c.createdAt || new Date().toISOString()
        });
      });

      // Sort newest first
      notifications.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

      const unreadCount = notifications.filter(
        (n) => n.type === 'action_required' || n.type === 'emergency'
      ).length;

      return {
        notifications,
        unreadCount: Math.max(unreadCount, 0),
        total: notifications.length
      };
    } catch (err) {
      console.error('GovernmentNotificationService error:', err.message);
      return { notifications: [], unreadCount: 0, total: 0 };
    }
  }
}

export const governmentNotificationService = new GovernmentNotificationService();
export default governmentNotificationService;
