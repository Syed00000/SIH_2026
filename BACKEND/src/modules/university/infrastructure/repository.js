import mongoose from 'mongoose';
import {
  UniversityChallenge,
  UniversityProject,
  UniversityFaculty,
  UniversityTeam,
  UniversityPartner,
  UniversityApproval,
  UniversityActivity
} from './model.js';
import MongooseUniversity from '../../government/heis/infrastructure/model.js';
import MongooseIndustry from '../../government/industries/infrastructure/model.js';
import { CitizenChallenge } from '../../citizen/infrastructure/model.js';

export class UniversityDashboardRepository {
  isDbReady() {
    return mongoose.connection.readyState >= 1;
  }

  async findUniversityByCodeOrId(identifier) {
    if (!identifier) return null;
    const clean = identifier.trim();
    const query = {
      $or: [
        { code: { $regex: new RegExp(`^${clean}$`, 'i') } },
        { aisheCode: { $regex: new RegExp(`^${clean}$`, 'i') } },
        { shortName: { $regex: new RegExp(`^${clean}$`, 'i') } },
        { name: { $regex: new RegExp(clean, 'i') } },
        { universityEmail: clean.toLowerCase() },
        { 'credentials.loginEmail': clean.toLowerCase() },
        { 'nodalOfficer.email': clean.toLowerCase() }
      ]
    };
    if (this.isDbReady()) {
      try {
        const uni = await MongooseUniversity.findOne(query).lean();
        if (uni) return uni;
      } catch (err) {}
    }
    return null;
  }

  async getChallengesByUniversity(universityCode, { status, domain, district, search, page = 1, limit = 100 } = {}) {
    const rawCode = (universityCode || '').trim();
    const uniDoc = await this.findUniversityByCodeOrId(rawCode);
    const code = (uniDoc?.code || rawCode).toUpperCase();
    const aishe = (uniDoc?.aisheCode || '').toUpperCase();
    const uniName = uniDoc?.name || uniDoc?.legalName || '';

    const validUniIdentifiers = Array.from(new Set([code, rawCode.toUpperCase(), aishe, uniDoc?.shortName].filter(Boolean)));
    const citizenOrConditions = [
      { 'assignedUniversity.id': { $in: validUniIdentifiers } }
    ];
    if (uniName) {
      citizenOrConditions.push({ 'assignedUniversity.name': { $regex: new RegExp(uniName, 'i') } });
    }

    const query = { universityCode: { $in: validUniIdentifiers }, isDeleted: { $ne: true } };
    if (status && status !== 'All Status' && status !== 'All') query.status = status;
    if (domain && domain !== 'All Domains' && domain !== 'All') query.domain = domain;
    if (district && district !== 'All Districts' && district !== 'All') query.district = district;
    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), 'i');
      query.$and = [{ $or: [{ challengeId: regex }, { title: regex }, { domain: regex }, { district: regex }] }];
    }
    const skip = (Number(page) - 1) * Number(limit);
    try {
      const [uniChallenges, total, citizenChallenges] = await Promise.all([
        UniversityChallenge.find(query).sort({ assignedOn: -1 }).skip(skip).limit(Number(limit)).lean(),
        UniversityChallenge.countDocuments(query),
        CitizenChallenge.find({ $or: citizenOrConditions }).sort({ submittedAt: -1 }).limit(Number(limit)).lean()
      ]);

      const seenIds = new Set((uniChallenges || []).map((c) => c.challengeId));
      const mappedCitizen = (citizenChallenges || [])
        .filter((cit) => !seenIds.has(cit.challengeId))
        .map((cit) => {
          const accStatus = cit.assignedUniversity?.acceptanceStatus || cit.acceptanceStatus || 'Pending Review';
          return {
            challengeId: cit.challengeId,
            id: cit.challengeId,
            universityCode: code,
            title: cit.title,
            domain: cit.domain,
            district: cit.location?.district || 'Ranchi',
            priority: cit.priority || 'Medium',
            status: accStatus === 'Accepted' ? 'Accepted' : accStatus === 'Declined' ? 'Declined' : 'Pending',
            acceptanceStatus: accStatus,
            declineReason: cit.assignedUniversity?.declineReason || '',
            assignedOn: cit.assignedUniversity?.assignedAt || cit.submittedAt || cit.createdAt || new Date(),
            deadline: 'Active Review',
            problemStatement: cit.description,
            description: cit.description,
            affectedPopulation: cit.impactMetrics?.affectedPopulation || '~ 5,000 Citizens',
            aiCategory: cit.domain,
            requiredSkills: ['Ground Engineering', 'Data Analytics', 'Field Telemetry'],
            submitter: cit.submitter,
            location: cit.location,
            milestones: cit.milestones,
            mediaUrls: cit.mediaUrls,
            locationDetails: {
              block: cit.location?.block || 'Sadar Block',
              panchayatOrWard: cit.location?.panchayatOrWard || '',
              landmark: cit.location?.landmark || '',
              fullAddress: cit.location?.fullAddress || '',
              coordinates: cit.location?.coordinates || ''
            },
            assignedFaculty: cit.assignedUniversity?.mentorName ? {
              name: cit.assignedUniversity.mentorName,
              department: cit.assignedUniversity.department || 'R&D Cell'
            } : null,
            actionLabel: accStatus === 'Accepted' ? 'View' : accStatus === 'Declined' ? 'Declined' : 'Review'
          };
        });

      const combined = [...(uniChallenges || []), ...mappedCitizen];

      return {
        challenges: combined,
        total: (total || 0) + mappedCitizen.length,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(((total || 0) + mappedCitizen.length) / Number(limit)) || 1
      };
    } catch (err) {
      return { challenges: [], total: 0, page: Number(page), limit: Number(limit), totalPages: 1 };
    }
  }

  async getProjectsByUniversity(universityCode, includeDeleted = false) {
    const code = (universityCode || '').toUpperCase();
    const query = { universityCode: code };
    if (!includeDeleted) query.isDeleted = { $ne: true };
    try {
      return (await UniversityProject.find(query).sort({ updatedAt: -1 }).lean()) || [];
    } catch (err) {
      return [];
    }
  }

  async createProject(universityCode, projectData) {
    const code = (universityCode || '').toUpperCase();
    const newProj = {
      projectId: projectData.projectId || `PRJ-${Date.now().toString().slice(-4)}`,
      ...projectData,
      universityCode: code,
      isDeleted: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    try {
      return await UniversityProject.create(newProj);
    } catch (err) {
      return newProj;
    }
  }

  async updateProject(universityCode, projectId, updateData) {
    const query =
      typeof projectId === 'string' && projectId.match(/^[0-9a-fA-F]{24}$/)
        ? { _id: projectId }
        : { projectId };
    try {
      const res = await UniversityProject.findOneAndUpdate(query, { $set: updateData }, { new: true });
      if (res) return res;
    } catch (err) {}
    return { projectId, ...updateData };
  }

  async deleteProject(universityCode, projectId, deletedBy = 'University Admin') {
    const query =
      typeof projectId === 'string' && projectId.match(/^[0-9a-fA-F]{24}$/)
        ? { _id: projectId }
        : { projectId };
    try {
      const res = await UniversityProject.findOneAndUpdate(
        query,
        { $set: { isDeleted: true, deletedBy, deletedAt: new Date(), status: 'Archived' } },
        { new: true }
      );
      if (res) return res;
    } catch (err) {}
    return { success: true, projectId };
  }

  async getFacultyByUniversity(universityCode) {
    const code = (universityCode || '').toUpperCase();
    try {
      return (await UniversityFaculty.find({ universityCode: code }).sort({ name: 1 }).lean()) || [];
    } catch (err) {
      return [];
    }
  }

  async createFaculty(universityCode, facultyData) {
    const code = (universityCode || '').toUpperCase();
    try {
      const existing = await UniversityFaculty.findOne({
        $or: [
          { universityCode: code, name: new RegExp(`^${(facultyData.name || '').trim()}$`, 'i') },
          { universityCode: code, email: new RegExp(`^${(facultyData.email || '').trim()}$`, 'i') }
        ]
      });
      if (existing) return existing;
      return await UniversityFaculty.create({ ...facultyData, universityCode: code });
    } catch (err) {
      return { id: `FAC-${Date.now().toString().slice(-4)}`, ...facultyData, universityCode: code };
    }
  }

  async updateFaculty(universityCode, facultyId, updateData) {
    const code = (universityCode || '').toUpperCase();
    try {
      const query =
        facultyId && facultyId.match(/^[0-9a-fA-F]{24}$/)
          ? { _id: facultyId }
          : { $or: [{ name: facultyId }, { email: facultyId }, { facultyId: facultyId }, { id: facultyId }] };
      const updated = await UniversityFaculty.findOneAndUpdate(query, { $set: updateData }, { new: true });
      return updated ? updated.toObject() : { _id: facultyId, ...updateData, universityCode: code };
    } catch (err) {
      return { _id: facultyId, ...updateData, universityCode: code };
    }
  }

  async deleteFaculty(universityCode, facultyId) {
    try {
      const query =
        facultyId.match(/^[0-9a-fA-F]{24}$/)
          ? { _id: facultyId }
          : { $or: [{ name: facultyId }, { email: facultyId }] };
      await UniversityFaculty.findOneAndDelete(query);
    } catch (err) {}
    return { success: true, facultyId };
  }

  async getTeamsByUniversity(universityCode) {
    const code = (universityCode || '').toUpperCase();
    try {
      return (await UniversityTeam.find({ universityCode: code }).sort({ teamCode: 1 }).lean()) || [];
    } catch (err) {
      return [];
    }
  }

  async getPartnersByUniversity() {
    try {
      const rawIndustries = await MongooseIndustry.find({}).sort({ createdAt: -1 }).lean();
      if (rawIndustries && rawIndustries.length > 0) {
        return rawIndustries.map((ind) => ({
          _id: ind._id,
          partnerId: ind.industryId || `IND-${ind._id}`,
          name: ind.legalName || 'Government Registered Partner',
          shortName: ind.shortName || ind.legalName,
          logoText: (ind.shortName || ind.legalName || 'IND').slice(0, 3).toUpperCase(),
          type: ind.category || 'Private Industry',
          industryType: ind.category || 'Private Industry',
          committedGrant: ind.financials?.csrCommittedCr ? `₹ ${ind.financials.csrCommittedCr} Cr` : '₹ 0.0 Lakhs',
          grantAmount: ind.financials?.csrCommittedCr ? `₹ ${ind.financials.csrCommittedCr} Cr` : '₹ 0.0 Lakhs',
          focusArea: ind.thematicDomain || 'Technology & Innovation',
          domains: ind.thematicDomains?.length ? ind.thematicDomains : [ind.thematicDomain || 'Technology'],
          supportOffered: ind.supportModes?.length ? ind.supportModes : [],
          activeProjectsCount: ind.financials?.supportedProjectsCount || 0,
          status: ind.status === 'Disabled' ? 'Declined' : ind.status || 'Active',
          mouStatus: ind.verificationStatus === 'Verified' ? 'Active' : 'Pending',
          contactPerson: {
            name: ind.spocName || 'Nodal Officer',
            role: ind.designation || 'Nodal Officer',
            email: ind.officialEmail || ind.credentials?.loginEmail || '',
            phone: ind.mobileNumber || ''
          },
          website: ind.website || '',
          location: ind.address ? `${ind.address.city || ''}, ${ind.address.state || 'Jharkhand'}, India` : 'Jharkhand, India',
          registeredOn: ind.createdAt ? new Date(ind.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '',
          engagementStatus: ind.verificationStatus === 'Verified' ? 'Government Verified Partner' : 'Pending Verification',
          about: ind.legalName ? `${ind.legalName} is an official industry partner registered under Jharkhand State Higher Education.` : ''
        }));
      }
      return (await UniversityPartner.find({}).lean()) || [];
    } catch (err) {
      return [];
    }
  }

  async getApprovalsByUniversity(universityCode) {
    const code = (universityCode || '').toUpperCase();
    try {
      return (await UniversityApproval.find({ universityCode: code }).sort({ date: -1 }).lean()) || [];
    } catch (err) {
      return [];
    }
  }

  async updateApprovalStatus(approvalId, universityCode, status) {
    try {
      const res = await UniversityApproval.findOneAndUpdate({ approvalId }, { $set: { status } }, { new: true });
      if (res) return res;
    } catch (err) {}
    return { approvalId, status };
  }

  async getActivitiesByUniversity(universityCode, limit = 10) {
    const code = (universityCode || '').toUpperCase();
    try {
      return (await UniversityActivity.find({ universityCode: code }).sort({ timestamp: -1 }).limit(limit).lean()) || [];
    } catch (err) {
      return [];
    }
  }

  async updateChallengeStatus(challengeId, universityCode, status, actionLabel, metadata = {}) {
    try {
      const rawCode = (universityCode || '').trim();
      const uniDoc = await this.findUniversityByCodeOrId(rawCode);
      const resolvedUniName = uniDoc?.name || uniDoc?.legalName || rawCode || 'Assigned University';
      const code = (uniDoc?.code || rawCode).toUpperCase();

      const res = await UniversityChallenge.findOneAndUpdate(
        { challengeId },
        { $set: { status, actionLabel: actionLabel || status, ...metadata } },
        { new: true }
      );

      const isAccepted = status === 'Accepted' || status === 'In Progress';
      const isDeclined = status === 'Rejected' || status === 'Declined';
      const citizenStatus = isAccepted ? 'In Progress' : isDeclined ? 'Under Review' : status === 'Resolved' ? 'Resolved' : 'Under Review';
      const reason = metadata.declineReason || metadata.remarks || metadata.query || 'Outside departmental research scope';

      const updatePayload = {
        status: citizenStatus,
        'assignedUniversity.acceptanceStatus': isAccepted ? 'Accepted' : isDeclined ? 'Declined' : 'Pending Review',
        'assignedUniversity.declineReason': isDeclined ? reason : '',
        'acceptanceStatus': isAccepted ? 'Accepted' : isDeclined ? 'Declined' : 'Pending Review'
      };

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
        updatePayload['milestones.3.remarks'] = `Awaiting State Nodal reallocation.`;
      }

      await CitizenChallenge.findOneAndUpdate(
        { challengeId },
        { $set: updatePayload }
      );

      if (res) return res;
    } catch (err) {
      console.warn('Error updating challenge status in DB:', err);
    }
    return { challengeId, status, actionLabel };
  }

  async assignFaculty(challengeId, universityCode, facultyInfo) {
    try {
      const res = await UniversityChallenge.findOneAndUpdate(
        { challengeId },
        { $set: { assignedFaculty: facultyInfo, status: 'Accepted', actionLabel: 'View' } },
        { new: true }
      );
      if (facultyInfo?.email || facultyInfo?.name) {
        await UniversityFaculty.findOneAndUpdate(
          { $or: [{ email: facultyInfo.email }, { name: facultyInfo.name }] },
          { $set: { availabilityStatus: 'In Project' }, $inc: { activeProjects: 1 } }
        );
      }

      const uniDoc = await MongooseUniversity.findOne({ code: (universityCode || '').toUpperCase() }).lean();
      const resolvedUniName = uniDoc?.name || uniDoc?.legalName || universityCode || 'Assigned University';

      // Synchronize Citizen Challenge milestone progression in database
      await CitizenChallenge.findOneAndUpdate(
        { challengeId },
        {
          $set: {
            status: 'In Progress',
            'assignedUniversity.id': universityCode,
            'assignedUniversity.name': resolvedUniName,
            'assignedUniversity.department': facultyInfo.department || 'Engineering & Technology',
            'assignedUniversity.mentorName': facultyInfo.name,
            'assignedUniversity.assignedAt': new Date(),
            'assignedUniversity.acceptanceStatus': 'Accepted',
            'acceptanceStatus': 'Accepted',
            'milestones.2.status': 'COMPLETED',
            'milestones.2.completedAt': new Date(),
            'milestones.2.remarks': `Assigned to Lead Faculty Mentor: ${facultyInfo.name} (${facultyInfo.department || 'Innovation Lab'}) at ${resolvedUniName}`,
            'milestones.3.status': 'CURRENT',
            'milestones.3.remarks': `Faculty Mentor ${facultyInfo.name} leading solution execution.`
          }
        }
      );

      if (res) return res;
    } catch (err) {
      console.warn('Error assigning faculty in DB:', err);
    }
    return { challengeId, assignedFaculty: facultyInfo, status: 'Accepted' };
  }

  async getUniversityProfile(universityCode) {
    const code = (universityCode || '').toUpperCase();
    const uni = await this.findUniversityByCodeOrId(code);
    const [facultyList, teamsList, projectsList] = await Promise.all([
      this.getFacultyByUniversity(code),
      this.getTeamsByUniversity(code),
      this.getProjectsByUniversity(code)
    ]);
    return {
      _id: uni?._id || null,
      name: uni?.name || 'University Profile',
      shortName: uni?.shortName || code,
      code: uni?.code || code,
      aisheCode: uni?.aisheCode || uni?.code || '',
      tagline: uni?.tagline || '',
      about: uni?.about || '',
      universityType: uni?.institutionType || 'University',
      establishmentYear: uni?.establishmentYear || null,
      website: uni?.website || '',
      universityEmail: uni?.universityEmail || '',
      universityPhone: uni?.universityPhone || '',
      accreditation: uni?.accreditation || {},
      address: uni?.address || { campus: '', district: uni?.district || '', state: 'Jharkhand', pincode: '' },
      stats: {
        facultyMembers: facultyList.length,
        students: teamsList.reduce((acc, t) => acc + (t.membersCount || 0), 0),
        activeTeams: teamsList.length,
        activeProjects: projectsList.filter((p) => p.status !== 'Completed' && p.status !== 'Archived').length,
        completedProjects: projectsList.filter((p) => p.status === 'Completed').length
      },
      departments: uni?.departments || [],
      researchAreas: uni?.researchAreas || [],
      facilities: uni?.facilities || [],
      status: uni?.status || 'Active',
      isVerified: uni?.verificationStatus === 'Verified'
    };
  }

  async updateUniversityProfile(universityCode, updateData, user) {
    const code = (universityCode || '').toUpperCase();
    if (this.isDbReady()) {
      try {
        await MongooseUniversity.findOneAndUpdate({ code }, { $set: updateData }, { new: true });
      } catch (err) {}
    }
    return await this.getUniversityProfile(code);
  }
}

export const universityDashboardRepository = new UniversityDashboardRepository();
export default universityDashboardRepository;
