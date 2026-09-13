import { updateMilestonesForStatus, applyMilestones } from './milestone-status-updater.helper.js';
export { updateMilestonesForStatus };

export function applyTriageChanges(challenge, triageData, user = null) {
  ['title', 'description', 'domain', 'priority'].forEach((k) => {
    if (triageData[k]) challenge[k] = typeof triageData[k] === 'string' ? triageData[k].trim() : triageData[k];
  });
  if (triageData.district && challenge.location) challenge.location.district = triageData.district;
  if (triageData.mediaUrls) challenge.mediaUrls = triageData.mediaUrls;

  const hasAssignment =
    triageData.assignedUniversity?.id ||
    triageData.assignedDepartment?.name ||
    triageData.assignedWard?.name ||
    triageData.assignedBlock?.name;

  challenge.status = triageData.status || (triageData.clarificationResponse ? 'Clarified' : hasAssignment ? 'In Progress' : 'Under Review');

  if (triageData.clarificationResponse) {
    challenge.clarificationResponse = triageData.clarificationResponse.trim();
    challenge.clarificationStatus = 'RESOLVED';
    challenge.acceptanceStatus = 'Clarified';
  }

  if (triageData.assignedUniversity?.id) {
    challenge.assignedUniversity = {
      id: triageData.assignedUniversity.id,
      name: triageData.assignedUniversity.name || 'Assigned University',
      department: triageData.assignedUniversity.department || 'Innovation Lab',
      mentorName: triageData.assignedUniversity.mentorName || '',
      assignedAt: challenge.assignedUniversity?.assignedAt || new Date(),
      acceptanceStatus: triageData.acceptanceStatus || 'Pending Review',
      clarificationQuery: challenge.assignedUniversity?.clarificationQuery || '',
      declineReason: ''
    };
    challenge.acceptanceStatus = challenge.assignedUniversity.acceptanceStatus;
    if (user) {
      challenge.allocatedBy = {
        id: user.id || user._id ? String(user.id || user._id) : '',
        name: user.fullName || user.name || 'State Nodal Officer',
        email: user.email || 'nodal@joharsetu.gov.in',
        phone: user.mobileNumber || user.phone || '9123456789',
        designation: user.designation || 'State Nodal Officer',
        department: user.department || 'Dept. of Higher & Technical Education, GoJ',
        allocatedAt: new Date()
      };
    }
  }

  if (triageData.assignedWard && (triageData.assignedWard.name || triageData.assignedWard.wardId)) {
    const w = triageData.assignedWard;
    challenge.assignedWard = {
      id: w.id || w.wardId || '',
      wardId: w.wardId || w.id || '',
      wardNumber: w.wardNumber || '',
      name: w.name || `Ward ${w.wardNumber || ''}`,
      councillorName: w.councillorName || w.inchargeName || '',
      councillorPhone: w.councillorPhone || '',
      councillorEmail: w.councillorEmail || '',
      district: w.district || challenge.district || 'Ranchi',
      instructions: w.instructions || triageData.instructions || '',
      assignedAt: new Date(),
      assignedBy: user?.fullName || 'State Nodal Officer',
      priority: triageData.priority || challenge.priority || 'Medium',
      status: 'Assigned'
    };
  }

  if (triageData.assignedBlock && (triageData.assignedBlock.name || triageData.assignedBlock.blockId)) {
    const b = triageData.assignedBlock;
    challenge.assignedBlock = {
      id: b.id || b.blockId || '',
      blockId: b.blockId || b.id || '',
      name: b.name || `Block ${b.blockId || ''}`,
      bdoName: b.bdoName || '',
      bdoPhone: b.bdoPhone || '',
      bdoEmail: b.bdoEmail || '',
      district: b.district || challenge.district || 'Ranchi',
      instructions: b.instructions || triageData.instructions || '',
      assignedAt: new Date(),
      assignedBy: user?.fullName || 'State Nodal Officer',
      priority: triageData.priority || challenge.priority || 'Medium',
      status: 'Assigned'
    };
  }

  if (triageData.assignedDepartment && (triageData.assignedDepartment.name || triageData.assignedDepartment.deptId)) {
    const d = triageData.assignedDepartment;
    challenge.assignedDepartment = {
      id: d.id || d.deptId || '',
      deptId: d.deptId || d.id || '',
      name: d.name || 'Assigned Department',
      category: d.category || 'District Department',
      headName: d.headName || '',
      headEmail: d.headEmail || '',
      headRole: d.headRole || '',
      district: d.district || challenge.district || '',
      instructions: d.instructions || triageData.instructions || '',
      assignedAt: new Date(),
      assignedBy: user?.fullName || 'State Nodal Officer',
      priority: triageData.priority || challenge.priority || 'Medium',
      status: 'Assigned'
    };
  }

  if (triageData.assignedTechnician) {
    const tech = triageData.assignedTechnician;
    const ex = challenge.assignedTechnician || {};
    let workHistory = ex.workHistory || [];
    const isReassigned = tech.status === 'Assigned' && ex.status === 'Completed';
    if (isReassigned) {
      workHistory.push({
        completedAt: ex.completedAt,
        completionRemarks: ex.completionRemarks,
        mediaUrl: challenge.mediaUrls && challenge.mediaUrls.length > 0 ? challenge.mediaUrls[challenge.mediaUrls.length - 1] : null,
        rejectReason: tech.rejectReason || 'Work rejected and reassigned by Authority'
      });
    }

    challenge.assignedTechnician = {
      ...ex,
      id: tech.id || tech.technicianId || ex.id || '',
      technicianId: tech.technicianId || tech.id || ex.technicianId || '',
      name: tech.name || ex.name || '',
      specialization: tech.specialization || ex.specialization || '',
      phone: tech.phone || ex.phone || '',
      instructions: tech.instructions || ex.instructions || triageData.instructions || '',
      status: tech.status || ex.status || 'Assigned',
      acceptedAt: tech.acceptedAt || ex.acceptedAt || (tech.status === 'Accepted' ? new Date() : null),
      completedAt: isReassigned ? null : (tech.completedAt || ex.completedAt || (tech.status === 'Completed' ? new Date() : null)),
      completionRemarks: isReassigned ? '' : (tech.completionRemarks || ex.completionRemarks || ''),
      workHistory
    };
  }

  // 1. Action: Reject and Return Back to Nodal Officer
  if (triageData.action === 'REJECT_BACK_TO_NODAL' || triageData.rejectBackToNodal) {
    challenge.status = 'Under Review';
    challenge.triageStatus = 'Unassigned';
    challenge.triageRemarks = triageData.rejectReason || `Rejected by ${triageData.authorityName || user?.fullName || 'Local Authority'}. Returned to Nodal Officer for re-allocation.`;
    challenge.assignedDepartment = null;
    challenge.assignedBlock = null;
    challenge.assignedWard = null;
    challenge.assignedTechnician = null;
  }

  // 2. Action: Escalate to Higher Authority (Ward -> Block -> District -> State)
  if (triageData.status === 'Escalated' || triageData.action === 'ESCALATE_TO_HIGHER_AUTHORITY') {
    challenge.status = 'Escalated';

    const lvl = (triageData.currentLevel || '').toUpperCase();
    const isWard = lvl === 'WARD' || (challenge.assignedWard?.name && challenge.assignedWard.status !== 'Escalated') || challenge.assignedDepartment?.category === 'Ward Commissioner';
    const isBlock = lvl === 'BLOCK' || (!isWard && (challenge.assignedBlock?.name && challenge.assignedBlock.status !== 'Escalated') || challenge.assignedDepartment?.category === 'Block / Tehsil Office');

    // Capture previous evidence before assigning to higher level
    if (challenge.assignedTechnician && challenge.assignedTechnician.status === 'Completed') {
      const existingUrls = challenge.mediaUrls || [];
      const newMedia = existingUrls.length > 0 ? [existingUrls[existingUrls.length - 1]] : [];
      if (!challenge.escalationEvidence) challenge.escalationEvidence = [];
      
      const prevLevel = isWard ? 'WARD' : (isBlock ? 'BLOCK' : 'DISTRICT');
      challenge.escalationEvidence.push({
        level: prevLevel,
        authorityName: user?.fullName || 'Authority',
        technicianName: challenge.assignedTechnician.name || 'Field Technician',
        remarks: challenge.assignedTechnician.completionRemarks || 'No remarks provided.',
        mediaUrls: newMedia,
        date: new Date()
      });
      // Reset technician for the next authority level to assign a new one
      challenge.assignedTechnician = null;
    }

    if (isWard) {
      if (challenge.assignedWard) challenge.assignedWard.status = 'Escalated';
      if (!triageData.assignedBlock) {
        const bName = challenge.location?.block || challenge.location?.district || 'Kanke';
        challenge.assignedBlock = {
          name: `${bName} Block Office`,
          blockId: 'BLK-JH-RN-01',
          level: 'Block / Tehsil Office',
          category: 'Block / Tehsil Office',
          district: challenge.district || 'Ranchi',
          assignedAt: new Date(),
          assignedBy: user?.fullName || 'Ward Authority',
          status: 'Assigned'
        };
        challenge.triageRemarks = `Escalated from Ward to Block (${bName} Block Office).`;
      } else {
        challenge.triageRemarks = triageData.triageRemarks || `Escalated from Ward to Block.`;
      }
    } else if (isBlock) {
      if (challenge.assignedBlock) challenge.assignedBlock.status = 'Escalated';
      if (!triageData.assignedDepartment) {
        const dName = challenge.location?.district || challenge.district || 'Ranchi';
        challenge.assignedDepartment = {
          name: `${dName} District Department`,
          deptId: 'DEPT-JH-DIST-RNC',
          level: 'District Department',
          category: 'District Department',
          district: dName,
          assignedAt: new Date(),
          assignedBy: user?.fullName || 'Block Office',
          status: 'Assigned'
        };
        challenge.triageRemarks = `Escalated from Block to District (${dName} District Department).`;
      } else {
        challenge.triageRemarks = triageData.triageRemarks || `Escalated from Block to District.`;
      }
    } else {
      // District -> State
      if (!triageData.assignedDepartment) {
        challenge.assignedDepartment = {
          name: 'State Department',
          deptId: 'DEPT-JH-STATE',
          level: 'State Ministry',
          category: 'State Ministry',
          district: 'Ranchi',
          assignedAt: new Date(),
          assignedBy: user?.fullName || 'District Authority',
          status: 'Assigned'
        };
        challenge.triageRemarks = 'Escalated from District to State Ministry for high-level intervention.';
      } else {
        challenge.triageRemarks = triageData.triageRemarks || 'Escalated to State Ministry.';
      }
    }
  }

  applyMilestones(challenge, triageData, user);
}
