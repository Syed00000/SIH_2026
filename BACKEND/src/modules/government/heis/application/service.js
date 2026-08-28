import bcrypt from 'bcryptjs';
import { universityRepository } from '../infrastructure/repository.js';
import MongooseUser from '../../../users/infrastructure/model.js';
import MongooseRefreshToken from '../../../auth/infrastructure/model.js';
import { BadRequestError, NotFoundError, ConflictError } from '../../../../shared/errors/AppError.js';
import logger from '../../../../shared/logger/index.js';

export class UniversityService {
  /**
   * Create a new University and associated HEI User Login Account
   */
  async createUniversity(data) {
    const {
      name,
      shortName,
      code,
      universityType,
      institutionCategory,
      establishmentYear,
      website,
      district,
      quickSummary,
      focusAreas,
      accreditation,
      nodalOfficer,
      universityEmail,
      universityPhone,
      initialPassword
    } = data;

    if (!name || !code || !district || !universityEmail || !nodalOfficer?.name || !nodalOfficer?.email) {
      throw new BadRequestError('Missing required university fields');
    }

    // Check if university with same name or code already exists
    const existingCode = await universityRepository.findByCode(code);
    if (existingCode) {
      throw new ConflictError(`University with code ${code} already exists`);
    }

    // Determine login credentials
    const loginEmail = (nodalOfficer.email || universityEmail).toLowerCase().trim();
    const rawPassword = initialPassword && initialPassword.trim() ? initialPassword.trim() : this.generatePassword(10);
    const passwordHash = await bcrypt.hash(rawPassword, 10);

    // Format mobile number
    let mobile = nodalOfficer.phone ? nodalOfficer.phone.replace(/\D/g, '') : '';
    if (mobile.length > 10) mobile = mobile.slice(-10);
    if (!mobile || mobile.length !== 10 || !/^[6-9]\d{9}$/.test(mobile)) {
      mobile = '98' + Math.floor(10000000 + Math.random() * 90000000).toString().slice(0, 8);
    }

    // 1. Create or sync associated MongooseUser account so HEI can log in
    let user = await MongooseUser.findOne({ email: loginEmail });
    if (user) {
      user.role = 'UNIVERSITY';
      user.passwordHash = passwordHash;
      user.fullName = nodalOfficer.name;
      user.mobileNumber = mobile;
      user.accountStatus = 'ACTIVE';
      user.emailVerification = { verified: true, verifiedAt: new Date() };
      user.profile = {
        institutionName: name,
        aisheCode: code,
        institutionType: universityType || 'State University',
        nodalOfficerDesignation: nodalOfficer.designation || 'Registrar',
        academicFocusDomains: focusAreas || []
      };
      await user.save();
    } else {
      // Ensure mobile unique if conflict
      const existingMobile = await MongooseUser.findOne({ mobileNumber: mobile });
      if (existingMobile) {
        mobile = '9' + Math.floor(100000000 + Math.random() * 900000000).toString().slice(0, 9);
      }

      user = new MongooseUser({
        fullName: nodalOfficer.name,
        email: loginEmail,
        mobileNumber: mobile,
        passwordHash,
        role: 'UNIVERSITY',
        accountStatus: 'ACTIVE',
        emailVerification: { verified: true, verifiedAt: new Date() },
        profile: {
          institutionName: name,
          aisheCode: code,
          institutionType: universityType || 'State University',
          nodalOfficerDesignation: nodalOfficer.designation || 'Registrar',
          academicFocusDomains: focusAreas || []
        }
      });
      await user.save();
    }

    // 2. Create University Entity
    const university = await universityRepository.create({
      name: name.trim(),
      shortName: shortName ? shortName.trim() : (name.match(/\b(\w)/g) || []).join('').toUpperCase(),
      code: code.toUpperCase().trim(),
      universityType: universityType || 'State University',
      institutionCategory: institutionCategory || 'University',
      status: 'Approved',
      accessStatus: 'Enabled',
      establishmentYear: establishmentYear ? Number(establishmentYear) : 2000,
      website: website || '',
      district: district.trim(),
      quickSummary: quickSummary || {
        departments: 18,
        totalFaculty: 120,
        availableFaculty: 65,
        labsAndFacilities: 25,
        activeProjects: 14,
        capacityStatus: 'Available'
      },
      focusAreas: focusAreas && focusAreas.length > 0 ? focusAreas : ['Infrastructure', 'Water Management', 'Education', 'Public Health'],
      accreditation: accreditation || {
        naacGrade: 'A',
        validity: '2028-12-31',
        nirfRanking: 50
      },
      aisheCode: data.aisheCode || code,
      tagline: data.tagline || `${name} is a premier higher education institution dedicated to academic excellence, research, and societal development.`,
      about: data.about || `${name} has a rich legacy of academic excellence and research. We collaborate with industries, government and communities to develop innovative solutions for real-world challenges.`,
      address: data.address || {
        campus: `${name}, ${district}, Jharkhand`,
        district: district,
        state: 'Jharkhand',
        pincode: '834001'
      },
      departments: data.departments || [
        { name: 'Computer Science & Engineering', facultyCount: 18 },
        { name: 'Civil Engineering', facultyCount: 14 },
        { name: 'Electrical Engineering', facultyCount: 12 },
        { name: 'Mechanical Engineering', facultyCount: 10 },
        { name: 'Chemistry', facultyCount: 8 },
        { name: 'Biotechnology', facultyCount: 6 },
        { name: 'Environmental Science', facultyCount: 5 },
        { name: 'Social Work', facultyCount: 4 }
      ],
      researchAreas: data.researchAreas || [
        'Artificial Intelligence',
        'IoT & Embedded Systems',
        'Water Technology',
        'Smart Agriculture',
        'Renewable Energy',
        'Public Health',
        'Data Science',
        'Environmental Studies',
        'Materials Science'
      ],
      facilities: data.facilities || [
        'AI & Data Science Lab',
        'IoT & Embedded Systems Lab',
        'Water Testing & Quality Lab',
        'Renewable Energy Lab',
        'Innovation & Incubation Centre',
        '3D Printing & Prototyping Lab',
        'Smart Classroom Facility'
      ],
      lastUpdatedBy: {
        name: nodalOfficer.name.trim(),
        updatedAt: new Date()
      },
      nodalOfficer: {
        name: nodalOfficer.name.trim(),
        designation: nodalOfficer.designation || 'Registrar',
        email: loginEmail,
        phone: nodalOfficer.phone || `+91 ${mobile}`
      },
      universityEmail: (universityEmail || loginEmail).toLowerCase().trim(),
      universityPhone: universityPhone || `+91 ${mobile}`,
      credentials: {
        loginEmail,
        generatedPassword: rawPassword,
        passwordHash
      },
      userId: user._id,
      auditLogs: [
        {
          action: 'CREATED',
          performedBy: 'Government Admin',
          timestamp: new Date(),
          details: `Institution onboarded with code ${code}. Credentials generated.`
        }
      ]
    });

    logger.info({ msg: 'University registered successfully', id: university._id, code: university.code });

    return {
      university,
      credentials: {
        email: loginEmail,
        password: rawPassword
      }
    };
  }

  /**
   * Fetch all universities with search & filters
   */
  async getUniversities(queryParams) {
    const result = await universityRepository.findAll(queryParams);
    const kpis = await universityRepository.getKpis();

    return {
      ...result,
      kpis
    };
  }

  /**
   * Fetch a single university by ID
   */
  async getUniversityById(id) {
    const university = await universityRepository.findById(id);
    if (!university) {
      throw new NotFoundError('University not found');
    }
    return university;
  }

  /**
   * Update university details
   */
  async updateUniversity(id, updateData) {
    const existing = await universityRepository.findById(id);
    if (!existing) {
      throw new NotFoundError('University not found');
    }

    const auditEntry = {
      action: 'UPDATED',
      performedBy: 'Government Admin',
      timestamp: new Date(),
      details: 'University parameters modified by administration.'
    };

    const updated = await universityRepository.update(id, {
      ...updateData,
      $push: { auditLogs: auditEntry }
    });

    if (updateData.credentials?.generatedPassword && existing.userId) {
      const passwordHash = await bcrypt.hash(updateData.credentials.generatedPassword, 10);
      await MongooseUser.findByIdAndUpdate(existing.userId, { passwordHash });
    }

    return updated;
  }

  /**
   * Toggle HEI Access Status (Enabled / Disabled)
   */
  async toggleAccessStatus(id) {
    const university = await universityRepository.findById(id);
    if (!university) {
      throw new NotFoundError('University not found');
    }

    const nextStatus = university.accessStatus === 'Enabled' ? 'Disabled' : 'Enabled';
    const nextAccountStatus = nextStatus === 'Enabled' ? 'ACTIVE' : 'SUSPENDED';

    const updated = await universityRepository.update(id, {
      accessStatus: nextStatus
    });

    await universityRepository.addAuditLog(id, {
      action: nextStatus === 'Enabled' ? 'ACCESS_ENABLED' : 'ACCESS_DISABLED',
      performedBy: 'Government Admin',
      details: `Portal access ${nextStatus.toLowerCase()} by administration.`
    });

    if (university.userId) {
      await MongooseUser.findByIdAndUpdate(university.userId, {
        accountStatus: nextAccountStatus
      });

      if (nextStatus === 'Disabled') {
        await MongooseRefreshToken.updateMany(
          { userId: university.userId },
          { $set: { revoked: true } }
        );
        logger.info(`🔒 Revoked active sessions for disabled university: ${university.name}`);
      }
    }

    return updated;
  }

  /**
   * Approve, Reject or Update University Review Status
   */
  async updateStatus(id, status, remarks = '') {
    const university = await universityRepository.findById(id);
    if (!university) {
      throw new NotFoundError('University not found');
    }

    const nextAccessStatus = status === 'Approved' ? 'Enabled' : (status === 'Rejected' ? 'Disabled' : university.accessStatus);
    const nextAccountStatus = status === 'Approved' ? 'ACTIVE' : (status === 'Rejected' ? 'SUSPENDED' : 'PENDING_VERIFICATION');

    const updated = await universityRepository.update(id, {
      status,
      accessStatus: nextAccessStatus
    });

    await universityRepository.addAuditLog(id, {
      action: `STATUS_${status.toUpperCase()}`,
      performedBy: 'Government Admin',
      details: remarks || `University status changed to ${status} by administration.`
    });

    if (university.userId) {
      await MongooseUser.findByIdAndUpdate(university.userId, {
        accountStatus: nextAccountStatus
      });

      if (status === 'Rejected') {
        await MongooseRefreshToken.updateMany(
          { userId: university.userId },
          { $set: { revoked: true } }
        );
        logger.info(`🔒 Session revoked for rejected university: ${university.name}`);
      }
    }

    return updated;
  }

  /**
   * Delete University and disable user
   */
  async deleteUniversity(id) {
    const university = await universityRepository.findById(id);
    if (!university) {
      throw new NotFoundError('University not found');
    }

    if (university.userId) {
      await MongooseUser.findByIdAndUpdate(university.userId, {
        accountStatus: 'BLOCKED'
      });
    }

    await universityRepository.delete(id);
    return { success: true, message: 'University removed successfully' };
  }

  /**
   * Helper to generate strong readable passwords
   */
  generatePassword(length = 10) {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%';
    let pwd = 'HEI@';
    for (let i = 0; i < length - 4; i++) {
      pwd += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return pwd;
  }
}

export const universityService = new UniversityService();
export default universityService;
