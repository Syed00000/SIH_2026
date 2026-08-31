export function buildChallengeStatusUpdatePayload(status, resolvedUniName, metadata = {}) {
  const isAccepted = status === 'Accepted' || status === 'In Progress';
  const isDeclined = status === 'Rejected' || status === 'Declined';
  const isClarification = status === 'Clarification Requested' || status === 'Under Clarification';
  const isClarified = status === 'Clarified';
  const citizenStatus = isAccepted ? 'In Progress' : isDeclined ? 'Declined' : isClarification ? 'Clarification Requested' : isClarified ? 'Clarified' : status === 'Resolved' ? 'Resolved' : 'Under Review';
  const clarQuery = metadata.clarificationQuery || metadata.query || metadata.remarks || metadata.clarification || 'Technical ground parameters / lab reports needed.';
  const reason = metadata.declineReason || metadata.remarks || metadata.query || 'Outside departmental research scope';
  const accStatus = isAccepted ? 'Accepted' : isDeclined ? 'Declined' : isClarification ? 'Clarification Requested' : isClarified ? 'Clarified' : 'Pending Review';

  const updatePayload = {
    status: citizenStatus,
    'assignedUniversity.acceptanceStatus': accStatus,
    'assignedUniversity.declineReason': isDeclined ? reason : '',
    acceptanceStatus: accStatus
  };

  if (isClarification) {
    updatePayload['assignedUniversity.clarificationQuery'] = clarQuery;
    updatePayload.clarificationQuery = clarQuery;
    updatePayload.clarificationDate = new Date();
    updatePayload.clarificationStatus = 'PENDING';
  }

  if (isAccepted) {
    updatePayload['milestones.1.status'] = 'COMPLETED';
    updatePayload['milestones.1.completedAt'] = new Date();
    updatePayload['milestones.2.status'] = 'COMPLETED';
    updatePayload['milestones.2.completedAt'] = new Date();
    updatePayload['milestones.2.remarks'] = `Accepted by ${resolvedUniName}. Problem allocation finalized for research and prototyping.`;
    updatePayload['milestones.3.status'] = 'CURRENT';
    updatePayload['milestones.3.remarks'] = `Active solution development and prototyping in progress at ${resolvedUniName}.`;
  } else if (isDeclined) {
    updatePayload['milestones.2.status'] = 'PENDING';
    updatePayload['milestones.2.completedAt'] = null;
    updatePayload['milestones.2.remarks'] = `Declined by ${resolvedUniName}: ${reason}. State Nodal Officer reviewing for immediate reassignment.`;
    updatePayload['milestones.3.status'] = 'PENDING';
    updatePayload['milestones.3.remarks'] = 'Awaiting State Nodal reallocation.';
  } else if (isClarification) {
    updatePayload['milestones.2.status'] = 'CURRENT';
    updatePayload['milestones.2.remarks'] = `Technical clarification requested by ${resolvedUniName}: "${metadata.query || metadata.remarks}". State Nodal Officer in active discussion with institution.`;
  }

  return updatePayload;
}
