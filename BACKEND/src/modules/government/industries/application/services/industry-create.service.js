import bcrypt from 'bcryptjs';
import { sendIndustryOnboardingEmail } from '../../../../../infrastructure/email/smtpMailer.js';
import { BadRequestError, ConflictError } from '../../../../../shared/errors/AppError.js';
import logger from '../../../../../shared/logger/index.js';
import { generateNextIndustryId, generatePassword } from '../helpers/industry-id.helper.js';
import { provisionIndustryUserAccount } from '../helpers/industry-user-create.helper.js';

export async function createIndustryEntity(repository, data) {
  const {
    legalName, shortName, category, registrationNumber, thematicDomain,
    thematicDomains, supportModes, website, spocName, designation,
    officialEmail, loginEmail, mobileNumber, alternateContact, address, financials, initialPassword
  } = data;

  if (!legalName?.trim()) throw new BadRequestError('Organization legal name is required.');
  if (!category) throw new BadRequestError('Organization category is required.');
  if (!thematicDomain && (!thematicDomains || thematicDomains.length === 0)) {
    throw new BadRequestError('Thematic/Societal domain is required.');
  }
  if (!supportModes || !Array.isArray(supportModes) || supportModes.length === 0) {
    throw new BadRequestError('At least one Mode of Support must be selected.');
  }
  if (!spocName?.trim()) throw new BadRequestError('Nodal SPOC name is required.');
  if (!designation?.trim()) throw new BadRequestError('SPOC designation is required.');
  if (!officialEmail?.trim()) throw new BadRequestError('Official email address is required.');
  if (!mobileNumber?.trim()) throw new BadRequestError('Mobile contact number is required.');

  const normalizedOfficialEmail = officialEmail.toLowerCase().trim();
  const effectiveLoginEmail = (loginEmail && loginEmail.trim() ? loginEmail : officialEmail).toLowerCase().trim();

  const existingIndustry = await repository.findByEmail(effectiveLoginEmail);
  if (existingIndustry) {
    throw new ConflictError(`An industry organization with login email "${effectiveLoginEmail}" already exists.`);
  }

  const rawPassword = initialPassword && initialPassword.trim() ? initialPassword.trim() : generatePassword(10);
  const passwordHash = await bcrypt.hash(rawPassword, 10);

  let cleanMobile = mobileNumber.replace(/\D/g, '');
  if (cleanMobile.length > 10) cleanMobile = cleanMobile.slice(-10);
  if (!cleanMobile || cleanMobile.length !== 10 || !/^[6-9]\d{9}$/.test(cleanMobile)) {
    cleanMobile = '98' + Math.floor(10000000 + Math.random() * 90000000).toString().slice(0, 8);
  }

  const user = await provisionIndustryUserAccount({
    effectiveLoginEmail, spocName, legalName, category,
    registrationNumber, designation, supportModes, passwordHash, cleanMobile
  });

  const industryId = await generateNextIndustryId(repository);
  const normalizedDomain = thematicDomain || (Array.isArray(thematicDomains) ? thematicDomains.join(', ') : 'Innovation');

  const industry = await repository.create({
    industryId,
    legalName: legalName.trim(),
    shortName: shortName ? shortName.trim() : (legalName.match(/\b(\w)/g) || []).join('').toUpperCase().slice(0, 6),
    category,
    registrationNumber: registrationNumber ? registrationNumber.trim() : '',
    thematicDomain: normalizedDomain,
    thematicDomains: Array.isArray(thematicDomains) && thematicDomains.length > 0 ? thematicDomains : [normalizedDomain],
    supportModes,
    website: website ? website.trim() : '',
    spocName: spocName.trim(),
    designation: designation.trim(),
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
    status: 'Active',
    accessStatus: 'Enabled',
    verificationStatus: 'Verified',
    financials: financials || { csrCommittedCr: 0, supportedProjectsCount: 0, labsCount: 0 },
    credentials: { loginEmail: effectiveLoginEmail, generatedPassword: rawPassword, passwordHash },
    userId: user._id,
    auditLogs: [{ action: 'CREATED', performedBy: 'Government Admin', timestamp: new Date(), details: `Industry registered with ID ${industryId}.` }]
  });

  logger.info({ msg: 'Industry organization created', industryId, legalName });

  try {
    await sendIndustryOnboardingEmail({
      email: normalizedOfficialEmail,
      organizationName: legalName.trim(),
      spocName: spocName.trim(),
      industryId,
      loginEmail: effectiveLoginEmail,
      temporaryPassword: rawPassword
    });
  } catch (emailErr) {
    logger.warn({ msg: 'SMTP dispatch skipped or failed', error: emailErr.message });
  }

  return {
    industry,
    credentials: {
      industryId,
      legalName: industry.legalName,
      email: effectiveLoginEmail,
      officialEmail: normalizedOfficialEmail,
      password: rawPassword,
      status: 'Active'
    }
  };
}

export default createIndustryEntity;
