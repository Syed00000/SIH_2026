import { generateChallengeId } from '../helpers/challenge-id.helper.js';

export class ChallengeSubmissionService {
  constructor(repository) {
    this.repository = repository;
  }

  async submitChallenge(data, user = null) {
    if (!data.title || data.title.trim().length < 5) {
      throw new Error('Title must be at least 5 characters long');
    }
    if (!data.description || data.description.trim().length < 10) {
      throw new Error('Please provide a detailed problem statement of at least 10 characters');
    }
    const districtName = (data.district || data.location?.district || '').trim();
    if (!districtName) {
      throw new Error('District is required');
    }

    const challengeId = generateChallengeId();

    // Verify and map to designated district Nodal Officer in database
    let assignedNodalOfficer = null;
    try {
      const { Admin } = await import('../../../government/admins/infrastructure/model.js');
      let nodalAdmin = await Admin.findOne({
        role: /nodal/i,
        district: new RegExp(`^${districtName}$`, 'i'),
        status: { $in: ['Active', 'ACTIVE', 'active'] }
      }).lean();

      if (!nodalAdmin) {
        nodalAdmin = await Admin.findOne({
          district: new RegExp(`^${districtName}$`, 'i')
        }).lean();
      }

      if (nodalAdmin) {
        assignedNodalOfficer = {
          id: String(nodalAdmin._id),
          name: nodalAdmin.fullName,
          email: nodalAdmin.email,
          district: nodalAdmin.district,
          department: nodalAdmin.assignedDepartment || 'Higher & Technical Education'
        };
      } else {
        const { User } = await import('../../../users/infrastructure/model.js');
        const nodalUser = await User.findOne({
          role: 'NODAL',
          'profile.district': new RegExp(`^${districtName}$`, 'i')
        }).lean();
        if (nodalUser) {
          assignedNodalOfficer = {
            id: String(nodalUser._id),
            name: nodalUser.fullName,
            email: nodalUser.email,
            district: nodalUser.profile?.district || districtName,
            department: nodalUser.profile?.institutionName || 'Higher & Technical Education'
          };
        }
      }
    } catch (_) {}

    const newChallenge = {
      challengeId,
      citizenId: user?.id || null,
      title: data.title.trim(),
      description: data.description.trim(),
      domain: data.domain || '',
      district: districtName,
      priority: data.priority || 'Medium',
      status: 'Under Review',
      location: {
        district: districtName,
        block: data.block || data.location?.block || '',
        panchayatOrWard: data.panchayatOrWard || data.location?.panchayatOrWard || '',
        landmark: data.landmark || data.location?.landmark || '',
        pincode: data.pincode || data.location?.pincode || '',
        fullAddress:
          data.fullAddress ||
          data.location?.fullAddress ||
          `${data.landmark || data.location?.landmark ? (data.landmark || data.location?.landmark) + ', ' : ''}${
            data.block || data.location?.block ? (data.block || data.location?.block) + ', ' : ''
          }${districtName}`,
        coordinates: data.coordinates || data.location?.coordinates || ''
      },
      assignedNodalOfficer,
      submitter: {
        name: data.submitterName || user?.fullName || '',
        mobileNumber: data.submitterPhone || user?.mobileNumber || '',
        email: data.submitterEmail || user?.email || '',
        role: data.submitterRole || 'Citizen',
        designation: data.designation || '',
        organization: data.organization || ''
      },
      impactMetrics: {
        affectedPopulation: data.affectedPopulation || '',
        estimatedBudget: data.estimatedBudget || ''
      },
      media: Array.isArray(data.media) ? data.media : [],
      mediaUrls: Array.isArray(data.mediaUrls)
        ? data.mediaUrls
        : Array.isArray(data.media)
          ? data.media.map((m) => (typeof m === 'string' ? m : m.url)).filter(Boolean)
          : [],
      submittedAt: new Date()
    };

    const saved = await this.repository.create(newChallenge);

    return saved.toObject();
  }
}

export default ChallengeSubmissionService;
