import { UniversityPartner, UniversityIndustryRequest, UniversityActivity } from '../model.js';
import MongooseIndustry from '../../../government/industries/infrastructure/model.js';
import { findUniversityIdentity } from '../helpers/lookup.helper.js';

export class PartnerRequestRepository {
  async getPartnersByUniversity(universityCode) {
    const identity = await findUniversityIdentity(universityCode);
    if (!identity) return [];

    try {
      const rawIndustries = await MongooseIndustry.find({ status: { $ne: 'Disabled' } }).sort({ createdAt: -1 }).lean();
      if (rawIndustries && rawIndustries.length > 0) {
        return rawIndustries.map((ind) => ({
          _id: ind._id,
          partnerId: ind.industryId || ind._id.toString(),
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
      return (await UniversityPartner.find({ universityCode: { $in: identity.validIdentifiers } }).lean()) || [];
    } catch {
      return [];
    }
  }

  async createIndustryRequest(universityCode, payload) {
    const identity = await findUniversityIdentity(universityCode);
    if (!identity) {
      return { success: false, error: 'Unauthorized: Invalid university identity' };
    }
    const code = identity.code;

    try {
      let partnerId = payload.partnerId || '';
      let partnerName = payload.partnerName || 'Industry Partner';

      // Ensure stable ID linkage by resolving against canonical MongooseIndustry
      if (!partnerId && partnerName) {
        const ind = await MongooseIndustry.findOne({
          $or: [{ legalName: partnerName }, { shortName: partnerName }]
        }).lean();
        if (ind) {
          partnerId = ind.industryId || ind._id.toString();
          partnerName = ind.legalName || partnerName;
        }
      }

      const requestId = `IND-REQ-${Date.now()}`;

      const newReq = await UniversityIndustryRequest.create({
        requestId,
        universityCode: code,
        projectTitle: payload.projectTitle,
        projectId: payload.projectId || '',
        partnerId,
        partnerName,
        partnerEmail: payload.partnerEmail || '',
        fundingRequested: Boolean(payload.fundingRequested),
        labAccessRequested: Boolean(payload.labAccessRequested),
        mentorshipRequested: Boolean(payload.mentorshipRequested),
        estimatedBudget: payload.estimatedBudget || '',
        duration: payload.duration || '3 Months',
        executionOutcome: payload.executionOutcome || '',
        facultyName: payload.facultyName || '',
        studentTeam: payload.studentTeam || '',
        status: 'Pending',
        submittedAt: new Date()
      });

      await UniversityActivity.create({
        universityCode: code,
        text: `Industry Partnership Proposal dispatched to "${partnerName}" for project "${payload.projectTitle}"`,
        type: 'INDUSTRY_REQUEST',
        user: 'University Nodal Officer',
        time: `${new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`,
        timestamp: new Date()
      });

      return { success: true, request: newReq };
    } catch (err) {
      console.warn('Error creating industry request in DB:', err);
      return { success: false, error: err.message };
    }
  }

  async getIndustryRequests(universityCode) {
    const identity = await findUniversityIdentity(universityCode);
    if (!identity) return [];

    try {
      return await UniversityIndustryRequest.find({
        universityCode: { $in: identity.validIdentifiers }
      }).sort({ createdAt: -1 }).lean();
    } catch (err) {
      console.warn('Error fetching industry requests in DB:', err);
      return [];
    }
  }

  async deleteIndustryRequest(requestId, universityCode) {
    const identity = await findUniversityIdentity(universityCode);
    if (!identity) return { success: false, error: 'Unauthorized university' };

    try {
      await UniversityIndustryRequest.deleteOne({
        requestId,
        universityCode: { $in: identity.validIdentifiers }
      });
      return { success: true, requestId };
    } catch (err) {
      console.warn('Error deleting industry request in DB:', err);
      return { success: false, error: err.message };
    }
  }
}

export const partnerRequestRepository = new PartnerRequestRepository();
export default partnerRequestRepository;
