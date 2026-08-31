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
    challenge.acceptanceStatus =
      triageData.acceptanceStatus || (triageData.clarificationResponse ? 'Clarified' : 'Pending Review');

    if (user) {
      challenge.allocatedBy = {
        id: user.id || user._id ? String(user.id || user._id) : '',
        name: user.fullName || user.name || 'State Nodal Officer',
        email: user.email || 'nodal@joharsetu.gov.in',
        phone: user.mobileNumber || user.phone || '9123456789',
        designation:
          user.designation || (user.role === 'NODAL' ? 'State Nodal Officer' : 'Higher Education Director'),
        department: user.department || 'Dept. of Higher & Technical Education, GoJ',
        allocatedAt: new Date()
      };
    }
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

      // Step 3: University Assigned
      if (triageData.assignedUniversity?.id || challenge.assignedUniversity?.id) {
        const uniName =
          triageData.assignedUniversity?.name || challenge.assignedUniversity?.name || 'Assigned University';
        const isExplicitlyAccepted = triageData.acceptanceStatus === 'Accepted';

        if (isExplicitlyAccepted) {
          challenge.milestones[2].status = 'COMPLETED';
          challenge.milestones[2].completedAt = new Date();
          challenge.milestones[2].remarks = isReassignment
            ? `Reassigned and accepted by ${uniName} for priority R&D and solution prototyping.`
            : `Accepted by ${uniName} for R&D and solution prototyping.`;
          challenge.milestones[2].updatedBy = user?.fullName || 'State Nodal Officer';

          // Step 4: Solution in Progress
          challenge.milestones[3].status = 'CURRENT';
          challenge.milestones[3].remarks = `University team allocated in ${
            triageData.assignedUniversity?.department || 'R&D Lab'
          }. Active solution prototyping underway.`;
        } else {
          challenge.milestones[2].status = 'CURRENT';
          challenge.milestones[2].completedAt = null;
          challenge.milestones[2].remarks = isReassignment
            ? `Reallocated to ${uniName}. Waiting for University Department Acceptance & Mentor Onboarding.`
            : `Allocated to ${uniName}. Waiting for University Department Acceptance & Mentor Onboarding.`;
          challenge.milestones[2].updatedBy = user?.fullName || 'State Nodal Officer';

          // Step 4: Solution in Progress
          challenge.milestones[3].status = 'PENDING';
          challenge.milestones[3].remarks = 'Awaiting HEI department acceptance to commence field R&D.';
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
    challenge.milestones.forEach((m) => {
      m.status = 'COMPLETED';
      if (!m.completedAt) m.completedAt = new Date();
    });
    if (challenge.milestones[4]) {
      challenge.milestones[4].remarks = remarks || 'Successfully resolved and verified';
    }
  }
}
