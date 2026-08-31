import mongoose from 'mongoose';
import { universityChallengeSchema, universityProjectSchema } from './schemas/challenge-project.schemas.js';
import { universityFacultySchema, universityTeamSchema } from './schemas/faculty-team.schemas.js';
import { universityPartnerSchema, universityApprovalSchema } from './schemas/partner-approval.schemas.js';
import { universityActivitySchema, universityIndustryRequestSchema } from './schemas/activity-request.schemas.js';

export { universityChallengeSchema, universityProjectSchema } from './schemas/challenge-project.schemas.js';
export { universityFacultySchema, universityTeamSchema } from './schemas/faculty-team.schemas.js';
export { universityPartnerSchema, universityApprovalSchema } from './schemas/partner-approval.schemas.js';
export { universityActivitySchema, universityIndustryRequestSchema } from './schemas/activity-request.schemas.js';

export const UniversityChallenge = mongoose.models.UniversityChallenge || mongoose.model('UniversityChallenge', universityChallengeSchema);
export const UniversityProject = mongoose.models.UniversityProject || mongoose.model('UniversityProject', universityProjectSchema);
export const UniversityFaculty = mongoose.models.UniversityFaculty || mongoose.model('UniversityFaculty', universityFacultySchema);
export const UniversityTeam = mongoose.models.UniversityTeam || mongoose.model('UniversityTeam', universityTeamSchema);
export const UniversityPartner = mongoose.models.UniversityPartner || mongoose.model('UniversityPartner', universityPartnerSchema);
export const UniversityApproval = mongoose.models.UniversityApproval || mongoose.model('UniversityApproval', universityApprovalSchema);
export const UniversityActivity = mongoose.models.UniversityActivity || mongoose.model('UniversityActivity', universityActivitySchema);
export const UniversityIndustryRequest = mongoose.models.UniversityIndustryRequest || mongoose.model('UniversityIndustryRequest', universityIndustryRequestSchema);

export default {
  UniversityChallenge,
  UniversityProject,
  UniversityFaculty,
  UniversityTeam,
  UniversityPartner,
  UniversityApproval,
  UniversityActivity,
  UniversityIndustryRequest
};
