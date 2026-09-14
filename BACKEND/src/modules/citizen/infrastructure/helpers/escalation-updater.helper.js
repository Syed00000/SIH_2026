/**
 * Handles escalation up the multi-tier government hierarchy:
 * WARD -> BLOCK -> DISTRICT -> STATE -> MINISTRY -> APEX
 */
export function applyEscalationChanges(challenge, triageData, user = null) {
  if (triageData.status !== 'Escalated' && triageData.action !== 'ESCALATE_TO_HIGHER_AUTHORITY') {
    return;
  }

  challenge.status = 'Escalated';

  const rawLvl = (triageData.currentLevel || '').toUpperCase().trim();
  let prevLevel = '';

  if (rawLvl === 'MINISTRY' || rawLvl.includes('MINISTR') || rawLvl === 'APEX') {
    prevLevel = 'MINISTRY';
  } else if (rawLvl === 'STATE') {
    prevLevel = 'STATE';
  } else if (rawLvl === 'DISTRICT') {
    prevLevel = 'DISTRICT';
  } else if (rawLvl === 'BLOCK') {
    prevLevel = 'BLOCK';
  } else if (rawLvl === 'WARD') {
    prevLevel = 'WARD';
  } else {
    const deptCat = (challenge.assignedDepartment?.category || challenge.assignedDepartment?.level || '').toUpperCase();
    if (deptCat.includes('MINISTRY') || deptCat.includes('APEX')) prevLevel = 'MINISTRY';
    else if (deptCat.includes('STATE')) prevLevel = 'STATE';
    else if (deptCat.includes('DISTRICT')) prevLevel = 'DISTRICT';
    else if (challenge.assignedBlock && challenge.assignedBlock.status !== 'Escalated') prevLevel = 'BLOCK';
    else if (challenge.assignedWard && challenge.assignedWard.status !== 'Escalated') prevLevel = 'WARD';
    else prevLevel = 'DISTRICT';
  }

  // Capture previous authority resolution evidence before handing off to higher tier
  if (challenge.assignedTechnician && challenge.assignedTechnician.status === 'Completed') {
    const existingUrls = challenge.mediaUrls || [];
    const newMedia = existingUrls.length > 0 ? [existingUrls[existingUrls.length - 1]] : [];
    if (!challenge.escalationEvidence) challenge.escalationEvidence = [];

    challenge.escalationEvidence.push({
      level: prevLevel,
      authorityName: user?.fullName || challenge.assignedDepartment?.name || challenge.assignedBlock?.name || challenge.assignedWard?.name || 'Authority',
      technicianName: challenge.assignedTechnician.name || 'Field Technician',
      remarks: challenge.assignedTechnician.completionRemarks || 'No remarks provided.',
      mediaUrls: newMedia,
      date: new Date()
    });
    challenge.assignedTechnician = null;
  }

  if (prevLevel === 'WARD') {
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
  } else if (prevLevel === 'BLOCK') {
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
  } else if (prevLevel === 'DISTRICT') {
    if (challenge.assignedDepartment) challenge.assignedDepartment.status = 'Escalated';
    if (!triageData.assignedDepartment) {
      challenge.assignedDepartment = {
        name: 'State Department',
        deptId: 'DEPT-JH-STATE',
        level: 'State Department',
        category: 'State Department',
        district: 'Ranchi',
        assignedAt: new Date(),
        assignedBy: user?.fullName || 'District Authority',
        status: 'Assigned'
      };
      challenge.triageRemarks = 'Escalated from District to State Department for state-level intervention.';
    } else {
      challenge.triageRemarks = triageData.triageRemarks || 'Escalated to State Department.';
    }
  } else if (prevLevel === 'STATE') {
    if (challenge.assignedDepartment) challenge.assignedDepartment.status = 'Escalated';
    if (!triageData.assignedDepartment) {
      challenge.assignedDepartment = {
        name: 'State Line Ministry',
        deptId: 'DEPT-JH-STATE-MINISTRY',
        level: 'State Ministry',
        category: 'State Ministry',
        district: 'Ranchi',
        assignedAt: new Date(),
        assignedBy: user?.fullName || 'State Authority',
        status: 'Assigned'
      };
      challenge.triageRemarks = 'Escalated from State Department to State Ministry for policy-level intervention.';
    } else {
      challenge.triageRemarks = triageData.triageRemarks || 'Escalated to State Ministry.';
    }
  } else {
    // MINISTRY -> Apex
    if (challenge.assignedDepartment) challenge.assignedDepartment.status = 'Escalated';
    if (!triageData.assignedDepartment) {
      challenge.assignedDepartment = {
        name: 'Apex Government / Cabinet Secretariat',
        deptId: 'DEPT-JH-APEX',
        level: 'Apex Government',
        category: 'Apex Government',
        district: 'Ranchi',
        assignedAt: new Date(),
        assignedBy: user?.fullName || 'Ministry Authority',
        status: 'Assigned'
      };
      challenge.triageRemarks = 'Escalated from Ministry to Apex Government / Cabinet Secretariat.';
    } else {
      challenge.triageRemarks = triageData.triageRemarks || 'Escalated to Apex Government.';
    }
  }
}
