import MongooseUniversity from '../../../government/heis/infrastructure/model.js';
import { findUniversityByCodeOrId, isDbReady } from '../helpers/lookup.helper.js';

export class ProfileRepository {
  constructor(facultyTeamRepo, projectCrudRepo) {
    this.facultyTeamRepo = facultyTeamRepo;
    this.projectCrudRepo = projectCrudRepo;
  }

  async getUniversityProfile(universityCode) {
    const code = (universityCode || '').toUpperCase();
    const uni = await findUniversityByCodeOrId(code);
    const [facultyList, teamsList, projectsList] = await Promise.all([
      this.facultyTeamRepo.getFacultyByUniversity(code),
      this.facultyTeamRepo.getTeamsByUniversity(code),
      this.projectCrudRepo.getProjectsByUniversity(code)
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

  async updateUniversityProfile(universityCode, updateData) {
    const code = (universityCode || '').toUpperCase();
    if (isDbReady()) {
      try {
        await MongooseUniversity.findOneAndUpdate({ code }, { $set: updateData }, { new: true });
      } catch { }
    }
    return await this.getUniversityProfile(code);
  }
}

export default ProfileRepository;
