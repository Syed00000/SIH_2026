import { BadRequestError, ConflictError } from '../../../../../shared/errors/AppError.js';
import logger from '../../../../../shared/logger/index.js';
import { generateNextIndustryId } from '../helpers/industry-id.helper.js';

export async function applyIndustryApplication(repository, payload) {
  const {
    legalName, shortName, category, registrationNumber, thematicDomain,
    thematicDomains, supportModes = [], website, spocName, designation,
    officialEmail, mobileNumber, alternateContact, address
  } = payload;

  if (!legalName?.trim()) throw new BadRequestError('Organization Legal Name is required');
  if (!spocName?.trim()) throw new BadRequestError('Nodal SPOC Name is required');
  if (!officialEmail?.trim()) throw new BadRequestError('Official Email is required');
  if (!mobileNumber?.trim()) throw new BadRequestError('Mobile Number is required');

  const normalizedOfficialEmail = officialEmail.toLowerCase().trim();
  const existing = await repository.findByEmail(normalizedOfficialEmail);
  if (existing) {
    throw new ConflictError('An application or organization with this official email already exists');
  }

  const industryId = await generateNextIndustryId(repository);
  const normalizedDomain = thematicDomain || (Array.isArray(thematicDomains) ? thematicDomains.join(', ') : 'Innovation');

  const industry = await repository.create({
    industryId,
    legalName: legalName.trim(),
    shortName: shortName ? shortName.trim() : '',
    category: category || 'Private Industry',
    registrationNumber: registrationNumber ? registrationNumber.trim() : '',
    thematicDomain: normalizedDomain,
    thematicDomains: Array.isArray(thematicDomains) && thematicDomains.length > 0 ? thematicDomains : [normalizedDomain],
    supportModes,
    website: website ? website.trim() : '',
    spocName: spocName.trim(),
    designation: designation ? designation.trim() : 'Nodal Representative',
    officialEmail: normalizedOfficialEmail,
    mobileNumber: mobileNumber.trim(),
    alternateContact: alternateContact ? alternateContact.trim() : '',
    address: {
      addressLine1: address?.addressLine1 || '',
      addressLine2: address?.addressLine2 || '',
      state: address?.state || 'Jharkhand',
      district: address?.district || 'Ranchi',
      city: address?.city || 'Ranchi',
      pincode: address?.pincode || '834001'
    },
    status: 'Pending',
    accessStatus: 'Disabled',
    verificationStatus: 'Pending',
    financials: { csrCommittedCr: 0, supportedProjectsCount: 0, labsCount: 0 },
    auditLogs: [{ action: 'APPLIED', performedBy: 'Applicant (Online Portal)', timestamp: new Date(), details: `Self-registration application submitted online with Reference ID ${industryId}.` }]
  });

  logger.info({ msg: 'Industry self-registration application submitted', industryId, legalName });

  return {
    success: true,
    industryId,
    legalName: industry.legalName,
    officialEmail: normalizedOfficialEmail,
    status: 'Pending',
    verificationStatus: 'Pending',
    message: 'Application submitted successfully. It has been routed to the Government of Jharkhand for administrative review.'
  };
}

export default applyIndustryApplication;
