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
  async findUniversityByCodeOrId(identifier) {
    if (!identifier) return null;
    let query = { code: identifier.toUpperCase() };
    if (!identifier.match(/^[A-Z0-9_-]+$/i) || identifier.includes('@')) {
      const regex = new RegExp(identifier.trim(), 'i');
      query = {
        $or: [
          { code: regex }, { shortName: regex }, { name: regex },
          { universityEmail: regex }, { 'credentials.loginEmail': regex }, { 'nodalOfficer.email': regex }
        ]
      };
    }
    return await MongooseUniversity.findOne(query).lean();
  }

  async getChallengesByUniversity(universityCode, { status, domain, district, search, page = 1, limit = 100 }) {
    const code = (universityCode || 'RU001').toUpperCase();
    const query = {
      $or: [{ universityCode: code }, { universityCode: 'RU001' }, { universityCode: 'RUNI-JH' }],
      isDeleted: { $ne: true }
    };
    if (status && status !== 'All Status' && status !== 'All') query.status = status;
    if (domain && domain !== 'All Domains' && domain !== 'All') query.domain = domain;
    if (district && district !== 'All Districts' && district !== 'All') query.district = district;
    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), 'i');
      query.$and = [{ $or: [{ challengeId: regex }, { title: regex }, { domain: regex }, { district: regex }] }];
    }
    const skip = (Number(page) - 1) * Number(limit);
    const [challenges, total] = await Promise.all([
      UniversityChallenge.find(query).sort({ assignedOn: -1 }).skip(skip).limit(Number(limit)).lean(),
      UniversityChallenge.countDocuments(query)
    ]);
    return { challenges, total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total / Number(limit)) };
  }

  async getProjectsByUniversity(universityCode, includeDeleted = false) {
    const code = (universityCode || 'RU001').toUpperCase();
    const query = {
      $or: [{ universityCode: code }, { universityCode: 'RU001' }, { universityCode: 'RUNI-JH' }]
    };
    if (!includeDeleted) query.isDeleted = { $ne: true };
    return await UniversityProject.find(query).sort({ updatedAt: -1 }).lean();
  }

  async createProject(universityCode, projectData) {
    const code = (universityCode || 'RU001').toUpperCase();
    return await UniversityProject.create({ ...projectData, universityCode: code, isDeleted: false });
  }

  async updateProject(universityCode, projectId, updateData) {
    let query = {};
    if (typeof projectId === 'string' && projectId.match(/^[0-9a-fA-F]{24}$/)) query._id = projectId;
    else query.projectId = projectId;
    return await UniversityProject.findOneAndUpdate(query, { $set: updateData }, { new: true });
  }

  async deleteProject(universityCode, projectId, deletedBy = 'University Admin') {
    let query = {};
    if (typeof projectId === 'string' && projectId.match(/^[0-9a-fA-F]{24}$/)) query._id = projectId;
    else query.projectId = projectId;
    return await UniversityProject.findOneAndUpdate(
      query,
      { $set: { isDeleted: true, deletedBy, deletedAt: new Date(), status: 'Archived' } },
      { new: true }
    );
  }

  async getFacultyByUniversity(universityCode) {
    const code = (universityCode || 'RU001').toUpperCase();
    const rawList = await UniversityFaculty.find({
      $or: [{ universityCode: code }, { universityCode: 'RU001' }, { universityCode: 'RUNI-JH' }]
    }).sort({ name: 1 }).lean();

    const seenNames = new Set();
    const seenEmails = new Set();
    return rawList.filter((f) => {
      const nameKey = (f.name || '').toLowerCase().trim();
      const emailKey = (f.email || '').toLowerCase().trim();
      if (!nameKey && !emailKey) return false;
      if (nameKey && seenNames.has(nameKey)) return false;
      if (emailKey && seenEmails.has(emailKey)) return false;
      if (nameKey) seenNames.add(nameKey);
      if (emailKey) seenEmails.add(emailKey);
      return true;
    });
  }

  async createFaculty(universityCode, facultyData) {
    const code = (universityCode || 'RU001').toUpperCase();
    const nameKey = (facultyData.name || '').toLowerCase().trim();
    const emailKey = (facultyData.email || '').toLowerCase().trim();
    const existing = await UniversityFaculty.findOne({
      $or: [
        { universityCode: code, name: new RegExp(`^${nameKey}$`, 'i') },
        { universityCode: code, email: new RegExp(`^${emailKey}$`, 'i') }
      ]
    });
    if (existing) {
      return existing;
    }
    return await UniversityFaculty.create({ ...facultyData, universityCode: code });
  }

  async deleteFaculty(universityCode, facultyId) {
    let query = {};
    if (facultyId.match(/^[0-9a-fA-F]{24}$/)) query._id = facultyId;
    else query.$or = [{ name: facultyId }, { email: facultyId }];
    return await UniversityFaculty.findOneAndDelete(query);
  }

  async getTeamsByUniversity(universityCode) {
    const code = (universityCode || 'RU001').toUpperCase();
    return await UniversityTeam.find({
      $or: [{ universityCode: code }, { universityCode: 'RU001' }, { universityCode: 'RUNI-JH' }]
    }).sort({ teamCode: 1 }).lean();
  }

  async getPartnersByUniversity() {
    const rawIndustries = await MongooseIndustry.find({}).sort({ createdAt: -1 }).lean();
    if (!rawIndustries || rawIndustries.length === 0) {
      return await UniversityPartner.find({}).sort({ grantAmount: -1 }).lean();
    }
    return rawIndustries.map((ind) => {
      const grantCr = ind.financials?.csrCommittedCr;
      const grantStr = grantCr ? `₹ ${grantCr} Cr` : '₹ 25.0 Lakhs';
      const logoText = ind.shortName ? ind.shortName.slice(0, 3).toUpperCase() : ind.legalName ? ind.legalName.slice(0, 3).toUpperCase() : 'IND';

      return {
        _id: ind._id,
        partnerId: ind.industryId || `IND-${ind._id}`,
        name: ind.legalName || 'Government Registered Partner',
        shortName: ind.shortName || ind.legalName,
        logoText,
        type: ind.category || 'Private Industry',
        industryType: ind.category || 'Private Industry',
        committedGrant: grantStr,
        grantAmount: grantStr,
        focusArea: ind.thematicDomain || 'Technology & Innovation',
        domains: ind.thematicDomains?.length ? ind.thematicDomains : [ind.thematicDomain || 'Technology'],
        supportOffered: ind.supportModes?.length ? ind.supportModes : ['Funding', 'Mentorship'],
        activeProjectsCount: ind.financials?.supportedProjectsCount || 3,
        status: ind.status === 'Disabled' ? 'Declined' : ind.status || 'Active',
        mouStatus: ind.verificationStatus === 'Verified' ? 'Active' : 'Pending',
        contactPerson: {
          name: ind.spocName || 'Nodal Officer',
          role: ind.designation || 'Nodal Officer',
          email: ind.officialEmail || ind.credentials?.loginEmail || 'nodal@industry.com',
          phone: ind.mobileNumber || '+91 98351 00000'
        },
        website: ind.website || 'www.jharkhand.gov.in',
        location: ind.address ? `${ind.address.city || 'Ranchi'}, ${ind.address.state || 'Jharkhand'}, India` : 'Ranchi, Jharkhand, India',
        registeredOn: ind.createdAt ? new Date(ind.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '15 Jan 2024',
        engagementStatus: ind.verificationStatus === 'Verified' ? 'Government Verified Partner' : 'Pending Verification',
        about: `${ind.legalName} is an official Government-onboarded industry partner registered under Jharkhand State Higher Education.`,
        collaborations: [
          { title: 'Water Quality Telemetry & Sensor Pilot', support: 'Support: Funding + Lab', status: 'In Progress' },
          { title: 'Smart Agriculture & Drip Irrigation Pilot', support: 'Support: Mentorship', status: 'In Progress' }
        ]
      };
    });
  }

  async getApprovalsByUniversity(universityCode) {
    const code = (universityCode || 'RU001').toUpperCase();
    return await UniversityApproval.find({
      $or: [{ universityCode: code }, { universityCode: 'RU001' }, { universityCode: 'RUNI-JH' }]
    }).sort({ date: -1 }).lean();
  }

  async updateApprovalStatus(approvalId, universityCode, status) {
    return await UniversityApproval.findOneAndUpdate({ approvalId }, { $set: { status } }, { new: true });
  }

  async getActivitiesByUniversity(universityCode, limit = 10) {
    const code = (universityCode || 'RU001').toUpperCase();
    return await UniversityActivity.find({
      $or: [{ universityCode: code }, { universityCode: 'RU001' }, { universityCode: 'RUNI-JH' }]
    }).sort({ timestamp: -1 }).limit(limit).lean();
  }

  async updateChallengeStatus(challengeId, universityCode, status, actionLabel, metadata = {}) {
    return await UniversityChallenge.findOneAndUpdate(
      { challengeId },
      { $set: { status, actionLabel: actionLabel || status, ...metadata } },
      { new: true }
    );
  }

  async assignFaculty(challengeId, universityCode, facultyInfo) {
    return await UniversityChallenge.findOneAndUpdate(
      { challengeId },
      { $set: { assignedFaculty: facultyInfo, status: 'Accepted', actionLabel: 'View' } },
      { new: true }
    );
  }

  async getUniversityProfile(universityCode) {
    const code = (universityCode || 'RU001').toUpperCase();
    let uni = await this.findUniversityByCodeOrId(code);
    if (!uni) {
      uni = await MongooseUniversity.findOne({
        $or: [{ code: 'RU001' }, { code: 'RUNI-JH' }, { name: /Ranchi University/i }]
      }).lean();
    }

    // Dynamic metrics aggregation from actual DB collections
    const [facultyList, teamsList, projectsList] = await Promise.all([
      this.getFacultyByUniversity(code),
      this.getTeamsByUniversity(code),
      this.getProjectsByUniversity(code)
    ]);

    const facultyMembersCount = facultyList.length;
    const activeTeamsCount = teamsList.length;
    const totalStudentsCount = teamsList.reduce((acc, t) => acc + (t.membersCount || 5), 0);
    const activeProjectsCount = projectsList.filter((p) => p.status !== 'Completed').length;
    const completedProjectsCount = projectsList.filter((p) => p.status === 'Completed').length;

    // Aggregate department faculty counts dynamically if available
    const deptMap = {};
    facultyList.forEach((f) => {
      if (f.department) {
        deptMap[f.department] = (deptMap[f.department] || 0) + 1;
      }
    });

    let departments = uni?.departments || [];
    if (!departments.length && Object.keys(deptMap).length > 0) {
      departments = Object.entries(deptMap).map(([name, facultyCount]) => ({ name, facultyCount }));
    }
    if (!departments.length) {
      departments = [
        { name: 'Computer Science & Engineering', facultyCount: 18 },
        { name: 'Civil Engineering', facultyCount: 14 },
        { name: 'Electrical Engineering', facultyCount: 12 },
        { name: 'Mechanical Engineering', facultyCount: 10 },
        { name: 'Chemistry', facultyCount: 8 },
        { name: 'Biotechnology', facultyCount: 6 },
        { name: 'Environmental Science', facultyCount: 5 },
        { name: 'Social Work', facultyCount: 4 }
      ];
    }

    const researchAreas = uni?.researchAreas?.length
      ? uni.researchAreas
      : [
          'Artificial Intelligence',
          'IoT & Embedded Systems',
          'Water Technology',
          'Smart Agriculture',
          'Renewable Energy',
          'Public Health',
          'Data Science',
          'Environmental Studies',
          'Materials Science'
        ];

    const facilities = uni?.facilities?.length
      ? uni.facilities
      : [
          'AI & Data Science Lab',
          'IoT & Embedded Systems Lab',
          'Water Testing & Quality Lab',
          'Renewable Energy Lab',
          'Innovation & Incubation Centre',
          '3D Printing & Prototyping Lab',
          'Smart Classroom Facility'
        ];

    return {
      _id: uni?._id,
      name: uni?.name || 'Ranchi University',
      shortName: uni?.shortName || 'RU',
      code: uni?.code || code,
      aisheCode: uni?.aisheCode || uni?.code || 'U-0467',
      tagline:
        uni?.tagline ||
        'Ranchi University is a premier state university committed to quality education, research and solving real-world problems for societal impact.',
      about:
        uni?.about ||
        'Ranchi University has a rich legacy of academic excellence and research. We collaborate with industries, government and communities to develop innovative solutions for real-world challenges, especially in the areas of sustainability, technology and social development.',
      universityType: uni?.universityType || 'State University',
      establishmentYear: uni?.establishmentYear || 1960,
      website: uni?.website || 'www.ranchiuniversity.ac.in',
      universityEmail: uni?.universityEmail || 'info@ranchiuniversity.ac.in',
      universityPhone: uni?.universityPhone || '+91 651 220 1234',
      accreditation: {
        naacGrade: uni?.accreditation?.naacGrade || 'NAAC A+',
        validity: uni?.accreditation?.validity || '2028-12-31',
        nirfRanking: uni?.accreditation?.nirfRanking || 85
      },
      address: {
        campus: uni?.address?.campus || 'Ranchi University, Morabadi, Ranchi, Jharkhand - 834008',
        district: uni?.address?.district || uni?.district || 'Ranchi',
        state: uni?.address?.state || 'Jharkhand',
        pincode: uni?.address?.pincode || '834008'
      },
      stats: {
        facultyMembers: facultyMembersCount,
        students: totalStudentsCount,
        activeTeams: activeTeamsCount,
        activeProjects: activeProjectsCount,
        completedProjects: completedProjectsCount
      },
      departments,
      researchAreas,
      facilities,
      status: uni?.status || 'Approved',
      isVerified: true,
      lastUpdatedBy: uni?.lastUpdatedBy || {
        name: uni?.nodalOfficer?.name || 'Dr. Ankit Verma',
        updatedAt: uni?.updatedAt || new Date()
      }
    };
  }

  async updateUniversityProfile(universityCode, updateData, user) {
    const code = (universityCode || 'RU001').toUpperCase();
    let uni = await this.findUniversityByCodeOrId(code);
    if (!uni) {
      uni = await MongooseUniversity.findOne({
        $or: [{ code: 'RU001' }, { code: 'RUNI-JH' }, { name: /Ranchi University/i }]
      });
    }
    if (!uni) return null;

    // Security & Data Integrity: Disallow modifying immutable/auth fields
    const safeData = { ...updateData };
    delete safeData.code;
    delete safeData.aisheCode;
    delete safeData.universityEmail;
    delete safeData.credentials;
    delete safeData.userId;
    delete safeData.loginEmail;
    delete safeData.password;
    delete safeData.passwordHash;

    safeData.lastUpdatedBy = {
      name: user?.fullName || uni.nodalOfficer?.name || 'Dr. Ankit Verma',
      updatedAt: new Date()
    };

    const updated = await MongooseUniversity.findByIdAndUpdate(
      uni._id,
      { $set: safeData },
      { new: true, runValidators: true }
    ).lean();

    return await this.getUniversityProfile(updated?.code || code);
  }
}

export const universityDashboardRepository = new UniversityDashboardRepository();
export default universityDashboardRepository;
