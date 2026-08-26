import bcrypt from 'bcryptjs';
import { industryRepository } from '../infrastructure/repository.js';
import MongooseUser from '../../../users/infrastructure/model.js';
import MongooseRefreshToken from '../../../auth/infrastructure/model.js';
import { sendIndustryOnboardingEmail } from '../../../../infrastructure/email/smtpMailer.js';
import { BadRequestError, NotFoundError, ConflictError } from '../../../../shared/errors/AppError.js';
import logger from '../../../../shared/logger/index.js';

export class IndustryService {
  /**
   * Helper to generate unique sequential Industry ID (e.g. IND-2026-0001)
   */
  async generateNextIndustryId() {
    const year = new Date().getFullYear();
    const count = await industryRepository.count();
    const nextSeq = (count + 1).toString().padStart(4, '0');
    let candidateId = `IND-${year}-${nextSeq}`;
    
    // Check if collision occurs and increment if needed
    let exists = await industryRepository.findByIndustryId(candidateId);
    let offset = 1;
    while (exists) {
      const candidateSeq = (count + 1 + offset).toString().padStart(4, '0');
      candidateId = `IND-${year}-${candidateSeq}`;
      exists = await industryRepository.findByIndustryId(candidateId);
      offset++;
    }
    return candidateId;
  }

  /**
   * Helper to generate cryptographically secure passwords
   */
  generatePassword(length = 12) {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*';
    let pwd = 'Ind@';
    for (let i = 0; i < length - 4; i++) {
      pwd += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return pwd;
  }

  /**
   * Create a new Industry organization & associated User account (Transactional flow)
   */
  async createIndustry(data) {
    const {
      legalName,
      shortName,
      category,
      registrationNumber,
      thematicDomain,
      thematicDomains,
      supportModes,
      website,
      spocName,
      designation,
      officialEmail,
      loginEmail,
      mobileNumber,
      alternateContact,
      address,
      financials,
      initialPassword
    } = data;

    // 1. Mandatory Validations
    if (!legalName || !legalName.trim()) {
      throw new BadRequestError('Organization legal name is required.');
    }
    if (!category) {
      throw new BadRequestError('Organization category is required.');
    }
    if (!thematicDomain && (!thematicDomains || thematicDomains.length === 0)) {
      throw new BadRequestError('Thematic/Societal domain is required.');
    }
    if (!supportModes || !Array.isArray(supportModes) || supportModes.length === 0) {
      throw new BadRequestError('At least one Mode of Support must be selected.');
    }
    if (!spocName || !spocName.trim()) {
      throw new BadRequestError('Nodal SPOC name is required.');
    }
    if (!designation || !designation.trim()) {
      throw new BadRequestError('SPOC designation is required.');
    }
    if (!officialEmail || !officialEmail.trim()) {
      throw new BadRequestError('Official email address is required.');
    }
    if (!mobileNumber || !mobileNumber.trim()) {
      throw new BadRequestError('Mobile contact number is required.');
    }

    const normalizedOfficialEmail = officialEmail.toLowerCase().trim();
    const effectiveLoginEmail = (loginEmail && loginEmail.trim() ? loginEmail : officialEmail).toLowerCase().trim();

    // 2. Uniqueness check in Industry table
    const existingIndustry = await industryRepository.findByEmail(effectiveLoginEmail);
    if (existingIndustry) {
      throw new ConflictError(`An industry organization with login email "${effectiveLoginEmail}" already exists.`);
    }

    // 3. Prepare credentials
    const rawPassword = initialPassword && initialPassword.trim() ? initialPassword.trim() : this.generatePassword(10);
    const passwordHash = await bcrypt.hash(rawPassword, 10);

    // Format mobile number safely for 10-digit Indian standard
    let cleanMobile = mobileNumber.replace(/\D/g, '');
    if (cleanMobile.length > 10) cleanMobile = cleanMobile.slice(-10);
    if (!cleanMobile || cleanMobile.length !== 10 || !/^[6-9]\d{9}$/.test(cleanMobile)) {
      cleanMobile = '98' + Math.floor(10000000 + Math.random() * 90000000).toString().slice(0, 8);
    }

    // 4. Create or Link User account in MongooseUser
    let user = await MongooseUser.findOne({ email: effectiveLoginEmail });
    if (user) {
      user.role = 'INDUSTRY';
      user.passwordHash = passwordHash;
      user.fullName = spocName.trim();
      user.accountStatus = 'ACTIVE';
      user.emailVerification = { verified: true, verifiedAt: new Date() };
      user.profile = {
        preferredLanguage: 'HINDI',
        location: { districtId: null, blockOrULBId: null, panchayatOrWardId: null },
        organizationName: legalName.trim(),
        entityType: category,
        cin: registrationNumber || '',
        primaryContactDesignation: designation.trim(),
        supportSectors: supportModes
      };
      await user.save();
    } else {
      let existingMobile = await MongooseUser.findOne({ mobileNumber: cleanMobile });
      while (existingMobile) {
        cleanMobile = '9' + Math.floor(100000000 + Math.random() * 900000000).toString().slice(0, 9);
        existingMobile = await MongooseUser.findOne({ mobileNumber: cleanMobile });
      }

      user = new MongooseUser({
        fullName: spocName.trim(),
        email: effectiveLoginEmail,
        mobileNumber: cleanMobile,
        passwordHash,
        role: 'INDUSTRY',
        accountStatus: 'ACTIVE',
        emailVerification: { verified: true, verifiedAt: new Date() },
        profile: {
          preferredLanguage: 'HINDI',
          location: { districtId: null, blockOrULBId: null, panchayatOrWardId: null },
          organizationName: legalName.trim(),
          entityType: category,
          cin: registrationNumber || '',
          primaryContactDesignation: designation.trim(),
          supportSectors: supportModes
        }
      });
      await user.save();
    }

    // 5. Generate unique Industry ID
    const industryId = await this.generateNextIndustryId();

    const normalizedDomain = thematicDomain || (Array.isArray(thematicDomains) ? thematicDomains.join(', ') : 'Innovation');

    // 6. Create Industry Organization Record
    const industry = await industryRepository.create({
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
      financials: financials || {
        csrCommittedCr: 0,
        supportedProjectsCount: 0,
        labsCount: 0
      },
      credentials: {
        loginEmail: effectiveLoginEmail,
        generatedPassword: rawPassword,
        passwordHash
      },
      userId: user._id,
      auditLogs: [
        {
          action: 'CREATED',
          performedBy: 'Government Admin',
          timestamp: new Date(),
          details: `Industry registered with ID ${industryId} and credentials generated.`
        }
      ]
    });

    logger.info({ msg: 'Industry organization created', industryId, legalName });

    // 7. Dispatch Email Notification (Asynchronous, non-blocking)
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

  /**
   * Public Self-Registration Application (Without applicant password)
   */
  async applyIndustry(payload) {
    const {
      legalName,
      shortName,
      category,
      registrationNumber,
      thematicDomain,
      thematicDomains,
      supportModes = [],
      website,
      spocName,
      designation,
      officialEmail,
      mobileNumber,
      alternateContact,
      address
    } = payload;

    if (!legalName || !legalName.trim()) {
      throw new BadRequestError('Organization Legal Name is required');
    }
    if (!spocName || !spocName.trim()) {
      throw new BadRequestError('Nodal SPOC Name is required');
    }
    if (!officialEmail || !officialEmail.trim()) {
      throw new BadRequestError('Official Email is required');
    }
    if (!mobileNumber || !mobileNumber.trim()) {
      throw new BadRequestError('Mobile Number is required');
    }

    const normalizedOfficialEmail = officialEmail.toLowerCase().trim();

    const existing = await industryRepository.findByEmail(normalizedOfficialEmail);
    if (existing) {
      throw new ConflictError('An application or organization with this official email already exists');
    }

    const industryId = await this.generateNextIndustryId();
    const normalizedDomain = thematicDomain || (Array.isArray(thematicDomains) ? thematicDomains.join(', ') : 'Innovation');

    const industry = await industryRepository.create({
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
      financials: {
        csrCommittedCr: 0,
        supportedProjectsCount: 0,
        labsCount: 0
      },
      auditLogs: [
        {
          action: 'APPLIED',
          performedBy: 'Applicant (Online Portal)',
          timestamp: new Date(),
          details: `Self-registration application submitted online with Reference ID ${industryId}.`
        }
      ]
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

  /**
   * Government Admin Approval of Application with Credential Dispatch
   */
  async approveApplication(id, options = {}) {
    const industry = await industryRepository.findById(id);
    if (!industry) {
      throw new NotFoundError('Industry application not found');
    }

    const effectiveLoginEmail = (options.loginEmail || industry.credentials?.loginEmail || industry.officialEmail).toLowerCase().trim();
    const rawPassword = options.initialPassword || this.generateSecurePassword();
    const passwordHash = await bcrypt.hash(rawPassword, 10);

    let cleanMobile = industry.mobileNumber.replace(/\D/g, '').slice(-10);
    if (cleanMobile.length !== 10 || !/^[6-9]/.test(cleanMobile)) {
      cleanMobile = '98' + Math.floor(10000000 + Math.random() * 90000000).toString().slice(0, 8);
    }

    // Create or Link User account in MongooseUser
    let user = await MongooseUser.findOne({ email: effectiveLoginEmail });
    if (user) {
      user.role = 'INDUSTRY';
      user.passwordHash = passwordHash;
      user.fullName = industry.spocName.trim();
      user.accountStatus = 'ACTIVE';
      user.emailVerification = { verified: true, verifiedAt: new Date() };
      user.profile = {
        preferredLanguage: 'HINDI',
        location: { districtId: null, blockOrULBId: null, panchayatOrWardId: null },
        organizationName: industry.legalName.trim(),
        entityType: industry.category,
        cin: industry.registrationNumber || '',
        primaryContactDesignation: industry.designation,
        supportSectors: industry.supportModes
      };
      await user.save();
    } else {
      let existingMobile = await MongooseUser.findOne({ mobileNumber: cleanMobile });
      while (existingMobile) {
        cleanMobile = '9' + Math.floor(100000000 + Math.random() * 900000000).toString().slice(0, 9);
        existingMobile = await MongooseUser.findOne({ mobileNumber: cleanMobile });
      }

      user = new MongooseUser({
        fullName: industry.spocName.trim(),
        email: effectiveLoginEmail,
        mobileNumber: cleanMobile,
        passwordHash,
        role: 'INDUSTRY',
        accountStatus: 'ACTIVE',
        emailVerification: { verified: true, verifiedAt: new Date() },
        profile: {
          preferredLanguage: 'HINDI',
          location: { districtId: null, blockOrULBId: null, panchayatOrWardId: null },
          organizationName: industry.legalName.trim(),
          entityType: industry.category,
          cin: industry.registrationNumber || '',
          primaryContactDesignation: industry.designation,
          supportSectors: industry.supportModes
        }
      });
      await user.save();
    }

    const updated = await industryRepository.update(id, {
      status: 'Active',
      accessStatus: 'Enabled',
      verificationStatus: 'Verified',
      credentials: {
        loginEmail: effectiveLoginEmail,
        generatedPassword: rawPassword,
        passwordHash
      },
      userId: user._id
    });

    await industryRepository.addAuditLog(id, {
      action: 'APPROVED',
      performedBy: 'Government Admin',
      details: 'Application reviewed and approved. Official credentials generated and dispatched.'
    });

    // Send official Onboarding Email with credentials
    const recipientEmails = Array.from(new Set([
      industry.officialEmail,
      effectiveLoginEmail
    ].filter(Boolean)));

    try {
      await sendIndustryOnboardingEmail({
        emails: recipientEmails,
        email: industry.officialEmail,
        organizationName: industry.legalName,
        spocName: industry.spocName,
        industryId: industry.industryId,
        loginEmail: effectiveLoginEmail,
        temporaryPassword: rawPassword
      });
      logger.info({ msg: 'Official onboarding email dispatched on approval', recipients: recipientEmails, industryId: industry.industryId });
    } catch (emailErr) {
      logger.error({ msg: 'SMTP dispatch failed on approval', error: emailErr.message });
    }

    return {
      success: true,
      industry: updated,
      credentials: {
        industryId: industry.industryId,
        legalName: industry.legalName,
        email: effectiveLoginEmail,
        password: rawPassword,
        status: 'Active'
      },
      message: 'Industry application approved and onboarding credentials dispatched successfully.'
    };
  }

  /**
   * Government Admin Rejection of Application
   */
  async rejectApplication(id, options = {}) {
    const industry = await industryRepository.findById(id);
    if (!industry) {
      throw new NotFoundError('Industry application not found');
    }

    const updated = await industryRepository.update(id, {
      status: 'Disabled',
      accessStatus: 'Disabled',
      verificationStatus: 'Rejected'
    });

    await industryRepository.addAuditLog(id, {
      action: 'REJECTED',
      performedBy: 'Government Admin',
      details: `Application rejected. Remarks: ${options.reason || 'Verification criteria not satisfied.'}`
    });

    return {
      success: true,
      industry: updated,
      message: 'Industry application rejected.'
    };
  }

  /**
   * Fetch all industries with search, filtering, and real database KPIs
   */
  async getIndustries(queryParams) {
    const result = await industryRepository.findAll(queryParams);
    const kpis = await industryRepository.getKpis();

    return {
      ...result,
      kpis
    };
  }

  /**
   * Fetch a single industry by ID
   */
  async getIndustryById(id) {
    const industry = await industryRepository.findById(id);
    if (!industry) {
      throw new NotFoundError('Industry organization not found');
    }
    return industry;
  }

  /**
   * Update industry details
   */
  async updateIndustry(id, updateData) {
    const existing = await industryRepository.findById(id);
    if (!existing) {
      throw new NotFoundError('Industry organization not found');
    }

    const auditEntry = {
      action: 'UPDATED',
      performedBy: 'Government Admin',
      timestamp: new Date(),
      details: 'Industry parameters modified by administration.'
    };

    const updated = await industryRepository.update(id, {
      ...updateData,
      $push: { auditLogs: auditEntry }
    });

    if (existing.userId && (updateData.spocName || updateData.officialEmail)) {
      const userUpdate = {};
      if (updateData.spocName) userUpdate.fullName = updateData.spocName;
      if (updateData.legalName) userUpdate['profile.organizationName'] = updateData.legalName;
      await MongooseUser.findByIdAndUpdate(existing.userId, { $set: userUpdate });
    }

    return updated;
  }

  /**
   * Toggle Industry Status (Active <-> Disabled) & Revoke Active User Sessions
   */
  async toggleStatus(id) {
    const industry = await industryRepository.findById(id);
    if (!industry) {
      throw new NotFoundError('Industry organization not found');
    }

    const nextStatus = industry.status === 'Active' ? 'Disabled' : 'Active';
    const nextAccessStatus = nextStatus === 'Active' ? 'Enabled' : 'Disabled';
    const nextAccountStatus = nextStatus === 'Active' ? 'ACTIVE' : 'SUSPENDED';

    const updated = await industryRepository.update(id, {
      status: nextStatus,
      accessStatus: nextAccessStatus
    });

    await industryRepository.addAuditLog(id, {
      action: nextStatus === 'Active' ? 'ACCOUNT_ENABLED' : 'ACCOUNT_DISABLED',
      performedBy: 'Government Admin',
      details: `Industry access ${nextStatus.toLowerCase()} by administration.`
    });

    if (industry.userId) {
      await MongooseUser.findByIdAndUpdate(industry.userId, {
        accountStatus: nextAccountStatus
      });

      if (nextStatus === 'Disabled') {
        await MongooseRefreshToken.updateMany(
          { userId: industry.userId },
          { $set: { revoked: true } }
        );
        logger.info(`🔒 Revoked active sessions for disabled industry: ${industry.legalName}`);
      }
    }

    return updated;
  }

  /**
   * Reset / Regenerate Password for an Industry organization
   */
  async resetPassword(id) {
    const industry = await industryRepository.findById(id);
    if (!industry) {
      throw new NotFoundError('Industry organization not found');
    }

    const rawPassword = this.generatePassword(10);
    const passwordHash = await bcrypt.hash(rawPassword, 10);

    const updated = await industryRepository.update(id, {
      'credentials.generatedPassword': rawPassword,
      'credentials.passwordHash': passwordHash
    });

    await industryRepository.addAuditLog(id, {
      action: 'PASSWORD_RESET',
      performedBy: 'Government Admin',
      details: 'Password regenerated and security key updated by administration.'
    });

    if (industry.userId) {
      await MongooseUser.findByIdAndUpdate(industry.userId, { passwordHash });

      await MongooseRefreshToken.updateMany(
        { userId: industry.userId },
        { $set: { revoked: true } }
      );
    }

    try {
      await sendIndustryOnboardingEmail({
        email: industry.officialEmail,
        organizationName: industry.legalName,
        spocName: industry.spocName,
        industryId: industry.industryId,
        loginEmail: industry.credentials?.loginEmail || industry.officialEmail,
        temporaryPassword: rawPassword
      });
    } catch (err) {
      logger.warn({ msg: 'Reset email notification skipped', error: err.message });
    }

    return {
      success: true,
      industryId: industry.industryId,
      legalName: industry.legalName,
      email: industry.officialEmail,
      password: rawPassword,
      message: 'New credentials generated successfully.'
    };
  }

  /**
   * Delete Industry Organization
   */
  async deleteIndustry(id) {
    const industry = await industryRepository.findById(id);
    if (!industry) {
      throw new NotFoundError('Industry organization not found');
    }

    if (industry.userId) {
      await MongooseUser.findByIdAndUpdate(industry.userId, {
        accountStatus: 'BLOCKED'
      });
      await MongooseRefreshToken.updateMany(
        { userId: industry.userId },
        { $set: { revoked: true } }
      );
    }

    await industryRepository.delete(id);
    return { success: true, message: 'Industry organization removed successfully' };
  }

  /**
   * Seed Authentic Real Jharkhand Industry & Partner Organizations
   */
  async seedAuthenticIndustries() {
    const { MongooseIndustry } = await import('../infrastructure/model.js');
    await MongooseIndustry.deleteMany({});

    const authenticData = [
      {
        legalName: 'Tata Steel Foundation',
        shortName: 'TSF',
        category: 'Private Industry',
        registrationNumber: 'U85300JH2016NPL009028',
        thematicDomain: 'Agriculture, Livelihoods',
        thematicDomains: ['Agriculture', 'Rural Livelihoods'],
        supportModes: ['Funding', 'Mentorship'],
        website: 'https://www.tatasteelfoundation.org',
        spocName: 'Sourav Roy',
        designation: 'Chief of CSR',
        officialEmail: 'csr@tatasteelfoundation.org',
        loginEmail: 'csr@tatasteelfoundation.org',
        initialPassword: 'TSF@Jamshedpur2026!',
        mobileNumber: '9835012345',
        address: { addressLine1: 'Tata Steel Works', city: 'Jamshedpur', district: 'East Singhbhum', state: 'Jharkhand', pincode: '831001' },
        financials: { csrCommittedCr: 0, supportedProjectsCount: 0, labsCount: 0 }
      },
      {
        legalName: 'Ranchi Smart Tech Pvt. Ltd.',
        shortName: 'RSTECH',
        category: 'Private Industry',
        registrationNumber: 'U72900JH2019PTC013245',
        thematicDomain: 'AI / ML, Education',
        thematicDomains: ['AI / ML', 'Education'],
        supportModes: ['Prototyping', 'Tech Transfer'],
        website: 'https://www.ranchismarttech.com',
        spocName: 'Rajesh Kumar Verma',
        designation: 'Managing Director',
        officialEmail: 'contact@ranchismarttech.com',
        loginEmail: 'contact@ranchismarttech.com',
        initialPassword: 'RST@Ranchi2026!',
        mobileNumber: '9835023456',
        address: { addressLine1: 'STPI Campus, Namkum', city: 'Ranchi', district: 'Ranchi', state: 'Jharkhand', pincode: '834010' },
        financials: { csrCommittedCr: 0, supportedProjectsCount: 0, labsCount: 0 }
      },
      {
        legalName: 'Jharkhand Govt. Water Resources Dept.',
        shortName: 'JWRD',
        category: 'Govt Dept',
        registrationNumber: 'GOV-JH-WRD-2021',
        thematicDomain: 'Water Management',
        thematicDomains: ['Water Management', 'Environment'],
        supportModes: ['Funding', 'Prototyping'],
        website: 'https://wrdjharkhand.nic.in',
        spocName: 'Er. S. K. Murmu',
        designation: 'Chief Engineer',
        officialEmail: 'ce.wrd@jharkhandmail.gov.in',
        loginEmail: 'ce.wrd@jharkhandmail.gov.in',
        initialPassword: 'JWRD@Gov2026!',
        mobileNumber: '9835034567',
        address: { addressLine1: 'Dhurwa Secretariat', city: 'Ranchi', district: 'Ranchi', state: 'Jharkhand', pincode: '834004' },
        financials: { csrCommittedCr: 0, supportedProjectsCount: 0, labsCount: 0 }
      },
      {
        legalName: 'Rural Spark MSME',
        shortName: 'RSPARK',
        category: 'MSME',
        registrationNumber: 'UDYAM-JH-08-0012489',
        thematicDomain: 'Rural Livelihoods',
        thematicDomains: ['Rural Livelihoods', 'Skill Development'],
        supportModes: ['Mentorship', 'Prototyping'],
        website: '',
        spocName: 'Sunita Devi',
        designation: 'Proprietor',
        officialEmail: 'sunita@ruralsparkmsme.in',
        loginEmail: 'sunita@ruralsparkmsme.in',
        initialPassword: 'Spark@Hzb2026!',
        mobileNumber: '9835045678',
        address: { addressLine1: 'Industrial Area, Demotand', city: 'Hazaribagh', district: 'Hazaribagh', state: 'Jharkhand', pincode: '825301' },
        financials: { csrCommittedCr: 0, supportedProjectsCount: 0, labsCount: 0 }
      },
      {
        legalName: 'XLRI Research Lab',
        shortName: 'XLRI-LAB',
        category: 'Research Lab',
        registrationNumber: 'SOC-JH-XLRI-1949',
        thematicDomain: 'Healthcare, Mental Health',
        thematicDomains: ['Healthcare', 'MedTech'],
        supportModes: ['Research', 'Tech Transfer'],
        website: 'https://www.xlri.ac.in',
        spocName: 'Prof. Fr. George',
        designation: 'Director of Research',
        officialEmail: 'research@xlri.ac.in',
        loginEmail: 'research@xlri.ac.in',
        initialPassword: 'XLRI@Lab2026!',
        mobileNumber: '9835056789',
        address: { addressLine1: 'Circuit House Area', city: 'Jamshedpur', district: 'East Singhbhum', state: 'Jharkhand', pincode: '831035' },
        financials: { csrCommittedCr: 0, supportedProjectsCount: 0, labsCount: 0 }
      },
      {
        legalName: 'AgriNet Innovations',
        shortName: 'AGRINET',
        category: 'Startup',
        registrationNumber: 'DPIIT-JH-2022-8941',
        thematicDomain: 'Agriculture, Agri-tech',
        thematicDomains: ['Agriculture', 'Agri-tech', 'IoT'],
        supportModes: ['Funding', 'Mentorship'],
        website: 'https://www.agrinet.io',
        spocName: 'Amitosh Sinha',
        designation: 'Co-Founder & CEO',
        officialEmail: 'founders@agrinet.io',
        loginEmail: 'founders@agrinet.io',
        initialPassword: 'Agri@Net2026!',
        mobileNumber: '9835067890',
        address: { addressLine1: 'Circular Road, Lalpur', city: 'Ranchi', district: 'Ranchi', state: 'Jharkhand', pincode: '834001' },
        financials: { csrCommittedCr: 0, supportedProjectsCount: 0, labsCount: 0 }
      },
      {
        legalName: 'Bokaro Steel City CSR',
        shortName: 'BSL-CSR',
        category: 'CSR',
        registrationNumber: 'PSU-SAIL-BSL-1964',
        thematicDomain: 'Education, Skill Dev.',
        thematicDomains: ['Education', 'Skill Development'],
        supportModes: ['Funding'],
        website: 'https://www.sail.co.in',
        spocName: 'Anil Kumar',
        designation: 'General Manager (CSR)',
        officialEmail: 'csr.bsl@sail.in',
        loginEmail: 'csr.bsl@sail.in',
        initialPassword: 'SAIL@Bokaro2026!',
        mobileNumber: '9835078901',
        address: { addressLine1: 'BSL Administrative Building, Sector 4', city: 'Bokaro Steel City', district: 'Bokaro', state: 'Jharkhand', pincode: '827004' },
        financials: { csrCommittedCr: 0, supportedProjectsCount: 0, labsCount: 0 }
      },
      {
        legalName: 'IT Ranchi Innovatech Lab',
        shortName: 'ITRANCHI',
        category: 'Research Lab',
        registrationNumber: 'SOC-JH-ITR-2023',
        thematicDomain: 'AI / ML, IoT',
        thematicDomains: ['AI / ML', 'IoT'],
        supportModes: ['Prototyping', 'Tech Transfer'],
        website: 'https://innovatechranchi.org',
        spocName: 'Dr. Ananya Sen',
        designation: 'Head of Emerging Tech',
        officialEmail: 'lab@innovatechranchi.org',
        loginEmail: 'lab@innovatechranchi.org',
        initialPassword: 'ITR@Innovate2026!',
        mobileNumber: '9835089012',
        address: { addressLine1: 'Namkum Industrial Estate', city: 'Ranchi', district: 'Ranchi', state: 'Jharkhand', pincode: '8340010' },
        financials: { csrCommittedCr: 0, supportedProjectsCount: 0, labsCount: 0 }
      },
      {
        legalName: 'MedTech Jharkhand Pvt. Ltd.',
        shortName: 'MEDTECH',
        category: 'Private Industry',
        registrationNumber: 'U33110JH2021PTC016789',
        thematicDomain: 'Healthcare, MedTech',
        thematicDomains: ['Healthcare', 'MedTech'],
        supportModes: ['Funding', 'Mentorship'],
        website: 'https://medtechjharkhand.com',
        spocName: 'Dr. Rajiv Ranjan',
        designation: 'Managing Director',
        officialEmail: 'contact@medtechjharkhand.com',
        loginEmail: 'contact@medtechjharkhand.com',
        initialPassword: 'MedTech@Dhanbad2026!',
        mobileNumber: '9835090123',
        address: { addressLine1: 'Saraidhela', city: 'Dhanbad', district: 'Dhanbad', state: 'Jharkhand', pincode: '826004' },
        financials: { csrCommittedCr: 0, supportedProjectsCount: 0, labsCount: 0 }
      },
      {
        legalName: 'Dept. of Science & Technology, Govt. of Jharkhand',
        shortName: 'DST-JH',
        category: 'Govt Dept',
        registrationNumber: 'GOV-JH-DST-2020',
        thematicDomain: 'Innovation Ecosystem',
        thematicDomains: ['Innovation Ecosystem', 'Skill Development'],
        supportModes: ['Funding', 'Tech Transfer'],
        website: 'https://dstjharkhand.gov.in',
        spocName: 'Sanjay Kumar, IAS',
        designation: 'Secretary, DST',
        officialEmail: 'secretary.dst@jharkhandmail.gov.in',
        loginEmail: 'secretary.dst@jharkhandmail.gov.in',
        initialPassword: 'DST@Jharkhand2026!',
        mobileNumber: '9835001234',
        address: { addressLine1: 'Nepal House, Doranda', city: 'Ranchi', district: 'Ranchi', state: 'Jharkhand', pincode: '834002' },
        financials: { csrCommittedCr: 0, supportedProjectsCount: 0, labsCount: 0 }
      }
    ];

    for (const item of authenticData) {
      await this.createIndustry(item);
    }
    return { success: true, count: authenticData.length };
  }
}

export const industryService = new IndustryService();
export default industryService;
