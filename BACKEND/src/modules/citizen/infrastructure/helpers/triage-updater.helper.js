/**
 * Applies triage changes, reassignments, and milestone progression to a CitizenChallenge document
 */
export function applyTriageChanges(challenge, triageData, user = null) {
  if (triageData.title) challenge.title = triageData.title.trim();
  if (triageData.description) challenge.description = triageData.description.trim();
  if (triageData.domain) challenge.domain = triageData.domain;
  if (triageData.priority) challenge.priority = triageData.priority;
  if (triageData.district && challenge.location) challenge.location.district = triageData.district;

  const isReassignment =
    challenge.assignedUniversity?.id &&
    triageData.assignedUniversity?.id &&
    challenge.assignedUniversity.id.toUpperCase() !== triageData.assignedUniversity.id.toUpperCase();

  const newStatus =
    triageData.status ||
    (triageData.clarificationResponse
      ? 'Clarified'
      : triageData.assignedUniversity?.id
      ? 'In Progress'
      : 'Under Review');
  challenge.status = newStatus;

  if (triageData.clarificationResponse) {
    challenge.clarificationResponse = triageData.clarificationResponse.trim();
    challenge.clarificationStatus = 'RESOLVED';
    challenge.status = 'Clarified';
    challenge.acceptanceStatus = 'Clarified';
    if (challenge.assignedUniversity) {
      challenge.assignedUniversity.acceptanceStatus = 'Clarified';
    }
  }

  if (triageData.assignedUniversity && triageData.assignedUniversity.id) {
    challenge.assignedUniversity = {
      id: triageData.assignedUniversity.id,
      name: triageData.assignedUniversity.name || 'Assigned University',
      department: triageData.assignedUniversity.department || 'Innovation Lab',
      mentorName: triageData.assignedUniversity.mentorName || '',
      assignedAt: challenge.assignedUniversity?.assignedAt || new Date(),
      acceptanceStatus:
        triageData.acceptanceStatus || (triageData.clarificationResponse ? 'Clarified' : 'Pending Review'),
      clarificationQuery:
        challenge.assignedUniversity?.clarificationQuery || challenge.clarificationQuery || '',
      declineReason: ''
    };
    challenge.acceptanceStatus = triageData.acceptanceStatus || (triageData.clarificationResponse ? 'Clarified' : 'Pending Review');
    if (user) {
      challenge.allocatedBy = {
        id: user.id || user._id ? String(user.id || user._id) : '',
        name: user.fullName || user.name || 'State Nodal Officer',
        email: user.email || 'nodal@joharsetu.gov.in',
        phone: user.mobileNumber || user.phone || '9123456789',
        designation: user.designation || (user.role === 'NODAL' ? 'State Nodal Officer' : 'Higher Education Director'),
        department: user.department || 'Dept. of Higher & Technical Education, GoJ',
        allocatedAt: new Date()
      };
    }
  }

  if (triageData.assignedDepartment && (triageData.assignedDepartment.name || triageData.assignedDepartment.deptId || triageData.assignedDepartment.id)) {
    const dept = triageData.assignedDepartment;
    challenge.assignedDepartment = {
      id: dept.id || dept.deptId || '',
      deptId: dept.deptId || dept.id || '',
      name: dept.name || 'Assigned Department',
      category: dept.category || 'District Department',
      headName: dept.headName || '',
      headEmail: dept.headEmail || '',
      headRole: dept.headRole || '',
      district: dept.district || challenge.district || challenge.location?.district || '',
      instructions: dept.instructions || triageData.instructions || '',
      assignedAt: new Date(),
      assignedBy: user?.fullName || 'State Nodal Officer',
      priority: triageData.priority || challenge.priority || 'Medium',
      targetDate: dept.targetDate || null,
      status: 'Assigned'
    };
    if (!triageData.status && (challenge.status === 'Submitted' || challenge.status === 'Under Review')) {
      challenge.status = 'In Progress';
    }
  }

  if (triageData.assignedTechnician) {
    const tech = triageData.assignedTechnician;
    const ex = challenge.assignedTechnician || {};
    challenge.assignedTechnician = {
      ...ex,
      id: tech.id || tech.technicianId || ex.id || ex.technicianId || '',
      technicianId: tech.technicianId || tech.id || ex.technicianId || ex.id || '',
      name: tech.name || ex.name || '',
      specialization: tech.specialization || ex.specialization || '',
      phone: tech.phone || ex.phone || '',
      instructions: tech.instructions || ex.instructions || triageData.instructions || '',
      status: tech.status || ex.status || 'Assigned',
      acceptedAt: tech.acceptedAt || ex.acceptedAt || (tech.status === 'Accepted' ? new Date() : null),
      completedAt: tech.completedAt || ex.completedAt || (tech.status === 'Completed' ? new Date() : null),
      completionRemarks: tech.completionRemarks || ex.completionRemarks || ''
    };
    if (challenge.assignedDepartment && tech.name) challenge.assignedDepartment.actionOfficer = tech.name;
    if (tech.status === 'Completed') {
      challenge.status = 'Resolved';
      challenge.resolvedAt = new Date();
    } else if (!triageData.status && (challenge.status === 'Submitted' || challenge.status === 'Under Review')) {
      challenge.status = 'In Progress';
    }
  }

  if (challenge.location && (!challenge.location.geoJSON?.coordinates || challenge.location.geoJSON.coordinates.length !== 2)) {
    challenge.location.geoJSON = undefined;
  }

  // Milestones progression
  if (challenge.milestones && challenge.milestones.length >= 4) {
    if (newStatus === 'Rejected') {
      challenge.milestones[1].status = 'REJECTED';
      challenge.milestones[1].completedAt = new Date();
      challenge.milestones[1].remarks = triageData.remarks || 'Rejected during State Nodal screening.';
      challenge.milestones[1].updatedBy = user?.fullName || 'State Nodal Officer';
    } else {
      // Step 2: Under Review / Verified
      challenge.milestones[1].status = 'COMPLETED';
      challenge.milestones[1].completedAt = new Date();
      challenge.milestones[1].remarks = triageData.remarks || 'Ground problem verified by State Nodal Cell.';
      challenge.milestones[1].updatedBy = user?.fullName || 'State Nodal Officer';

      // Step 3: University Assigned OR Block/Department Assigned
      if (triageData.assignedDepartment || challenge.assignedDepartment) {
        const dept = triageData.assignedDepartment || challenge.assignedDepartment;
        challenge.milestones[1].title = 'Block & Department Assigned';
        challenge.milestones[1].remarks = `Assigned to ${dept.block || 'Block'} • ${dept.name || 'Department'}`;
        challenge.milestones[2].title = 'Field Technician Dispatched';
        const tech = triageData.assignedTechnician || challenge.assignedTechnician;
        if (tech && (tech.name || tech.technicianId)) {
          const isAcc = tech.status === 'Accepted' || tech.status === 'Completed';
          const isDone = tech.status === 'Completed' || challenge.status === 'Resolved';
          challenge.milestones[2].status = isAcc ? 'COMPLETED' : 'CURRENT';
          challenge.milestones[2].remarks = isAcc ? `Technician ${tech.name} accepted task • Ph: ${tech.phone}` : `Assigned to ${tech.name} (Pending Acceptance)`;
          challenge.milestones[3].title = 'Field Remediation in Progress';
          challenge.milestones[3].status = isDone ? 'COMPLETED' : (isAcc ? 'CURRENT' : 'PENDING');
          challenge.milestones[3].remarks = isDone ? (tech.completionRemarks || 'Work completed on ground.') : 'Technician active on ground.';
          if (isDone && challenge.milestones[4]) {
            challenge.milestones[4].status = 'COMPLETED';
            challenge.milestones[4].completedAt = new Date();
          }
        } else {
          challenge.milestones[2].status = 'CURRENT';
          challenge.milestones[2].remarks = 'Awaiting technician allocation by department in-charge.';
        }
      } else if (triageData.assignedUniversity?.id || challenge.assignedUniversity?.id) {
        const uniName = triageData.assignedUniversity?.name || challenge.assignedUniversity?.name || 'Assigned University';
        const isExplicitlyAccepted = triageData.acceptanceStatus === 'Accepted';
        if (isExplicitlyAccepted) {
          challenge.milestones[2].status = 'COMPLETED';
          challenge.milestones[2].completedAt = new Date();
          challenge.milestones[2].remarks = `Accepted by ${uniName} for R&D and solution prototyping.`;
          challenge.milestones[3].status = 'CURRENT';
          challenge.milestones[3].remarks = `University team active in ${triageData.assignedUniversity?.department || 'R&D Lab'}.`;
        } else {
          challenge.milestones[2].status = 'CURRENT';
          challenge.milestones[2].completedAt = null;
          challenge.milestones[2].remarks = `Allocated to ${uniName}. Waiting for Department Acceptance.`;
          challenge.milestones[3].status = 'PENDING';
        }
      }
    }
  }
}

export function updateMilestonesForStatus(challenge, newStatus, remarks = '') {
  if (!challenge.milestones || challenge.milestones.length === 0) return;
  if (newStatus === 'Under Review') {
    challenge.milestones[0].status = 'COMPLETED';
    challenge.milestones[1].status = 'CURRENT';
    challenge.milestones[1].remarks = remarks || 'Under review by innovation cell';
  } else if (newStatus === 'In Progress') {
    challenge.milestones[0].status = 'COMPLETED';
    challenge.milestones[1].status = 'COMPLETED';
    challenge.milestones[2].status = 'COMPLETED';
    challenge.milestones[3].status = 'CURRENT';
    challenge.milestones[3].remarks = remarks || 'Assigned and solution in progress';
  } else if (newStatus === 'Resolved') {
    challenge.milestones.forEach((m) => { m.status = 'COMPLETED'; if (!m.completedAt) m.completedAt = new Date(); });
    if (challenge.milestones[4]) challenge.milestones[4].remarks = remarks || 'Successfully resolved and verified';
  } else if (newStatus === 'Withdrawn') {
    challenge.milestones[0].status = 'COMPLETED';
    if (challenge.milestones[1]) {
      challenge.milestones[1].status = 'CANCELLED';
      challenge.milestones[1].remarks = remarks || 'Problem statement withdrawn by citizen';
      challenge.milestones[1].completedAt = new Date();
    }
  }
}
