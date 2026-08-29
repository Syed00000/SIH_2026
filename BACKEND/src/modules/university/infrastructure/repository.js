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

export class UniversityDashboardRepository {
  isDbReady() {
    return mongoose.connection.readyState >= 1;
  }

  async findUniversityByCodeOrId(identifier) {
    if (!identifier) return null;
    let query = { code: identifier.toUpperCase() };
    if (!identifier.match(/^[A-Z0-9_-]+$/i) || identifier.includes('@')) {
      const regex = new RegExp(identifier.trim(), 'i');
      query = {
        $or: [
          { code: regex },
          { shortName: regex },
          { name: regex },
          { universityEmail: regex },
          { 'credentials.loginEmail': regex },
          { 'nodalOfficer.email': regex }
        ]
      };
    }
    if (this.isDbReady()) {
      try {
        const uni = await MongooseUniversity.findOne(query).lean();
        if (uni) return uni;
      } catch (err) {}
    }
    return null;
  }

  async getChallengesByUniversity(universityCode, { status, domain, district, search, page = 1, limit = 100 } = {}) {
    const code = (universityCode || '').toUpperCase();
    const query = { universityCode: code, isDeleted: { $ne: true } };
    if (status && status !== 'All Status' && status !== 'All') query.status = status;
    if (domain && domain !== 'All Domains' && domain !== 'All') query.domain = domain;
    if (district && district !== 'All Districts' && district !== 'All') query.district = district;
    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), 'i');
      query.$and = [{ $or: [{ challengeId: regex }, { title: regex }, { domain: regex }, { district: regex }] }];
    }
    const skip = (Number(page) - 1) * Number(limit);
    try {
      const [challenges, total] = await Promise.all([
        UniversityChallenge.find(query).sort({ assignedOn: -1 }).skip(skip).limit(Number(limit)).lean(),
        UniversityChallenge.countDocuments(query)
      ]);
      return {
        challenges: challenges || [],
        total: total || 0,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil((total || 0) / Number(limit)) || 1
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
      const res = await UniversityChallenge.findOneAndUpdate({ challengeId }, { $set: { status, actionLabel: actionLabel || status, ...metadata } }, { new: true });
      if (res) return res;
    } catch (err) {}
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
      if (res) return res;
    } catch (err) {}
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
