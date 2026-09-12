import { updateMilestonesForStatus } from './milestone-status-updater.helper.js';
export { updateMilestonesForStatus };

export function applyTriageChanges(challenge, triageData, user = null) {
  if (triageData.title) challenge.title = triageData.title.trim();
  if (triageData.description) challenge.description = triageData.description.trim();
  if (triageData.domain) challenge.domain = triageData.domain;
  if (triageData.priority) challenge.priority = triageData.priority;
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
        mediaUrl: challenge.mediaUrls && challenge.mediaUrls.length > 0 
                    ? challenge.mediaUrls[challenge.mediaUrls.length - 1] 
                    : null,
        rejectReason: tech.rejectReason || 'Work rejected and reassigned by Ward Commissioner'
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
      workHistory: workHistory
    };
    // Note: Do not auto-resolve the challenge here. Ward Commissioner must approve first.
  }

  if (triageData.status === 'Escalated') {
    if (challenge.assignedWard && challenge.assignedWard.name && challenge.assignedWard.status !== 'Escalated') {
      challenge.assignedWard.status = 'Escalated';
      challenge.assignedWard.actionRemarks = 'Escalated to Higher Authority (Block Department).';
      
      const bName = challenge.location?.block || challenge.location?.district || 'District';
      challenge.assignedBlock = {
        name: `${bName} Block Office`,
        level: 'Block / Tehsil Office',
        category: 'Block / Tehsil Office',
        district: challenge.district || 'Ranchi',
        assignedAt: new Date(),
        assignedBy: user?.fullName || 'Ward Commissioner',
        status: 'Escalated'
      };
    } else if (challenge.assignedBlock && challenge.assignedBlock.name && challenge.assignedBlock.status !== 'Escalated') {
      challenge.assignedBlock.status = 'Escalated';
      challenge.assignedBlock.actionRemarks = 'Escalated to Higher Authority (District Department).';
      
      const bName = challenge.location?.district || 'District';
      challenge.assignedDepartment = {
        name: `${bName} District Department`,
        category: 'District Department',
        level: 'District Department',
        district: challenge.district || 'Ranchi',
        assignedAt: new Date(),
        assignedBy: user?.fullName || 'Block Office',
        status: 'Escalated'
      };
    } else if (challenge.assignedDepartment && challenge.assignedDepartment.name && challenge.assignedDepartment.status !== 'Escalated') {
      const isDistrict = challenge.assignedDepartment.category === 'District Department' || challenge.assignedDepartment.level === 'District Department';
      if (isDistrict) {
        challenge.status = 'Under Review';
        challenge.triageRemarks = 'Escalated from District level to State Nodal Cell. Requires immediate State intervention.';
        challenge.priority = 'High';
        
        challenge.assignedDepartment = null;
        challenge.assignedBlock = null;
        challenge.assignedWard = null;
      } else {
        // State Ministry escalating back to Nodal Cell
        challenge.status = 'Under Review';
        challenge.triageRemarks = 'The problem has not resolved yet';
        
        challenge.assignedDepartment = null;
        challenge.assignedBlock = null;
        challenge.assignedWard = null;
      }
    }
  }

  applyMilestones(challenge, triageData, user);
}

function applyMilestones(challenge, triageData, user) {
  if (!challenge.milestones || challenge.milestones.length < 4) return;
  challenge.milestones[0].status = 'COMPLETED';
  if (!challenge.milestones[0].completedAt) challenge.milestones[0].completedAt = new Date();

  challenge.milestones[1].status = 'COMPLETED';
  challenge.milestones[1].completedAt = new Date();
  challenge.milestones[1].remarks = triageData.remarks || 'Ground problem verified by State Nodal Cell.';
  challenge.milestones[1].updatedBy = user?.fullName || 'State Nodal Officer';

  if (triageData.assignedWard || challenge.assignedWard) {
    const wrd = triageData.assignedWard || challenge.assignedWard;
    challenge.milestones[1].title = 'Ward Assigned';
    challenge.milestones[1].remarks = `Assigned to ${wrd.name || 'Ward'} for local municipal resolution.`;
    challenge.milestones[2].title = 'Ward Action Initiated';
    challenge.milestones[2].status = 'CURRENT';
    challenge.milestones[2].remarks = `In charge: ${wrd.councillorName || 'Ward Councillor'}.`;
  } else if (triageData.assignedBlock || challenge.assignedBlock) {
    const blk = triageData.assignedBlock || challenge.assignedBlock;
    challenge.milestones[1].title = 'Block Assigned';
    challenge.milestones[1].remarks = `Assigned to ${blk.name || 'Block'} for local body administration.`;
    challenge.milestones[2].title = 'Block Action Initiated';
    challenge.milestones[2].status = 'CURRENT';
    challenge.milestones[2].remarks = `In charge: ${blk.bdoName || 'Block Development Officer'}.`;
  } else if (triageData.assignedDepartment || challenge.assignedDepartment) {
    const dept = triageData.assignedDepartment || challenge.assignedDepartment;
    challenge.milestones[1].title = `${dept.category || 'Department'} Assigned`;
    challenge.milestones[1].remarks = `Assigned to ${dept.name || 'Department'}`;
    challenge.milestones[2].title = 'Department Action Initiated';
    challenge.milestones[2].status = 'CURRENT';
    challenge.milestones[2].remarks = `In charge: ${dept.headName || 'Department Head'}.`;
  } else if (triageData.assignedUniversity?.id || challenge.assignedUniversity?.id) {
    const uni = triageData.assignedUniversity || challenge.assignedUniversity;
    challenge.milestones[2].title = 'HEI Assignment';
    challenge.milestones[2].status = 'CURRENT';
    challenge.milestones[2].remarks = `Allocated to ${uni.name || 'University'}.`;
  }
}
