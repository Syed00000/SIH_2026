import bcrypt from 'bcryptjs';
import { universityRepository } from '../infrastructure/repository.js';
import MongooseUser from '../../users/infrastructure/model.js';
import MongooseRefreshToken from '../../auth/infrastructure/model.js';
import { BadRequestError, NotFoundError, ConflictError } from '../../../shared/errors/AppError.js';
import logger from '../../../shared/logger/index.js';

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

    // If database has 0 universities, seed initial state universities automatically
    if (result.total === 0 && (!queryParams.search && !queryParams.district)) {
      await this.seedDefaultJharkhandUniversities();
      return await this.getUniversities(queryParams);
    }

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

    // Add audit entry
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

    // If password was updated, sync User hash
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

      // When disabling an institution, revoke all refresh tokens immediately so current active sessions are logged out!
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

  /**
   * Seed authentic Jharkhand universities matching the reference UI image
   */
  async seedDefaultJharkhandUniversities() {
    const defaultHeis = [
      {
        name: 'Ranchi University',
        shortName: 'RU',
        code: 'RU001',
        universityType: 'State University',
        institutionCategory: 'University',
        status: 'Approved',
        accessStatus: 'Enabled',
        establishmentYear: 1960,
        website: 'https://www.ranchiuniversity.ac.in',
        district: 'Ranchi',
        quickSummary: { departments: 24, totalFaculty: 160, availableFaculty: 82, labsAndFacilities: 45, activeProjects: 22, capacityStatus: 'Available' },
        focusAreas: ['Water Management', 'Waste Management', 'Public Health', 'Education'],
        accreditation: { naacGrade: 'B++', validity: '2028-06-30', nirfRanking: 120 },
        nodalOfficer: { name: 'Dr. Anil Kumar', designation: 'Registrar', email: 'anil.kumar@ru.ac.in', phone: '+91 90000 11111' },
        universityEmail: 'ranchiuniversity@gmail.com',
        universityPhone: '0651-2205177',
        initialPassword: 'RU@Ranchi2026!'
      },
      {
        name: 'Birsa Agricultural University',
        shortName: 'BAU',
        code: 'BAU002',
        universityType: 'State University',
        institutionCategory: 'University',
        status: 'Approved',
        accessStatus: 'Enabled',
        establishmentYear: 1981,
        website: 'https://www.bauranchi.org',
        district: 'Ranchi',
        quickSummary: { departments: 16, totalFaculty: 95, availableFaculty: 48, labsAndFacilities: 30, activeProjects: 19, capacityStatus: 'Available' },
        focusAreas: ['Agriculture', 'Rural Development', 'Water Management', 'IoT'],
        accreditation: { naacGrade: 'A', validity: '2027-11-20', nirfRanking: 85 },
        nodalOfficer: { name: 'Dr. Meena Singh', designation: 'Dean Agriculture', email: 'meena.singh@bau.ac.in', phone: '+91 90000 22222' },
        universityEmail: 'admin@bau.ac.in',
        universityPhone: '0651-2455688',
        initialPassword: 'BAU@Kanke2026!'
      },
      {
        name: 'Kolhan University',
        shortName: 'KU',
        code: 'KU003',
        universityType: 'State University',
        institutionCategory: 'University',
        status: 'Approved',
        accessStatus: 'Enabled',
        establishmentYear: 2009,
        website: 'https://www.kolhanuniversity.ac.in',
        district: 'Chaibasa',
        quickSummary: { departments: 18, totalFaculty: 110, availableFaculty: 52, labsAndFacilities: 26, activeProjects: 14, capacityStatus: 'Available' },
        focusAreas: ['Environmental Science', 'Tribal Welfare', 'Education', 'Infrastructure'],
        accreditation: { naacGrade: 'B+', validity: '2028-04-15', nirfRanking: 145 },
        nodalOfficer: { name: 'Prof. S. Choudhary', designation: 'Registrar', email: 'registrar@kolhanuniversity.ac.in', phone: '+91 90000 33333' },
        universityEmail: 'info@kolhanuniversity.ac.in',
        universityPhone: '06582-255274',
        initialPassword: 'KU@Chaibasa2026!'
      },
      {
        name: 'Nilamber Pitamber University',
        shortName: 'NPU',
        code: 'NPU004',
        universityType: 'State University',
        institutionCategory: 'University',
        status: 'Approved',
        accessStatus: 'Disabled',
        establishmentYear: 2009,
        website: 'https://www.npu.ac.in',
        district: 'Medininagar',
        quickSummary: { departments: 14, totalFaculty: 75, availableFaculty: 32, labsAndFacilities: 18, activeProjects: 9, capacityStatus: 'Limited' },
        focusAreas: ['Water Scarcity', 'Drought Management', 'Education', 'Public Health'],
        accreditation: { naacGrade: 'B', validity: '2026-09-30', nirfRanking: null },
        nodalOfficer: { name: 'Dr. P. Verma', designation: 'Dean Academic', email: 'dr.verma@npu.ac.in', phone: '+91 90000 44444' },
        universityEmail: 'contact@npu.ac.in',
        universityPhone: '06562-222345',
        initialPassword: 'NPU@Palamu2026!'
      },
      {
        name: 'Vinoba Bhave University',
        shortName: 'VBU',
        code: 'VBU005',
        universityType: 'State University',
        institutionCategory: 'University',
        status: 'Approved',
        accessStatus: 'Enabled',
        establishmentYear: 1992,
        website: 'https://www.vbu.ac.in',
        district: 'Hazaribagh',
        quickSummary: { departments: 22, totalFaculty: 135, availableFaculty: 70, labsAndFacilities: 38, activeProjects: 18, capacityStatus: 'Available' },
        focusAreas: ['Renewable Energy', 'Mining Rehabilitation', 'Water Management', 'AI / ML'],
        accreditation: { naacGrade: 'B++', validity: '2028-10-10', nirfRanking: 110 },
        nodalOfficer: { name: 'Dr. R. Das', designation: 'Registrar', email: 'registrar@vbu.ac.in', phone: '+91 90000 55555' },
        universityEmail: 'vbu.admin@gmail.com',
        universityPhone: '06546-264212',
        initialPassword: 'VBU@Hzb2026!'
      },
      {
        name: 'Sidho Kanho Birsha University',
        shortName: 'SKBU',
        code: 'SKBU006',
        universityType: 'State University',
        institutionCategory: 'University',
        status: 'Pending',
        accessStatus: 'Disabled',
        establishmentYear: 2010,
        website: 'https://www.skbu.ac.in',
        district: 'Dumka',
        quickSummary: { departments: 15, totalFaculty: 80, availableFaculty: 38, labsAndFacilities: 20, activeProjects: 7, capacityStatus: 'Available' },
        focusAreas: ['Education', 'Tribal Culture', 'Public Health', 'Rural Development'],
        accreditation: { naacGrade: 'B', validity: '2027-05-15', nirfRanking: null },
        nodalOfficer: { name: 'Dr. N. Murmu', designation: 'Nodal Coordinator', email: 'noca@skbu.ac.in', phone: '+91 90000 66666' },
        universityEmail: 'support@skbu.ac.in',
        universityPhone: '06434-222889',
        initialPassword: 'SKBU@Dumka2026!'
      },
      {
        name: 'Central University of Jharkhand',
        shortName: 'CUJ',
        code: 'CUJ-2026',
        universityType: 'Central University',
        institutionCategory: 'University',
        status: 'Approved',
        accessStatus: 'Enabled',
        establishmentYear: 2009,
        website: 'https://www.cuj.ac.in',
        district: 'Ranchi',
        quickSummary: { departments: 18, totalFaculty: 142, availableFaculty: 68, labsAndFacilities: 32, activeProjects: 18, capacityStatus: 'Available' },
        focusAreas: ['Water Management', 'Waste Management', 'Environmental Science', 'Renewable Energy', 'AI / ML', 'IoT', 'Agriculture', 'Public Health', 'Rural Development'],
        accreditation: { naacGrade: 'A', validity: '2027-12-28', nirfRanking: 45 },
        nodalOfficer: { name: 'Dr. Rajeev Kumar', designation: 'Registrar', email: 'registrar@cuj.ac.in', phone: '0651-2799000' },
        universityEmail: 'registrar@cuj.ac.in',
        universityPhone: '0651-2799000',
        initialPassword: 'CUJ@Admin2026!'
      },
      {
        name: 'Birla Institute of Technology, Mesra',
        shortName: 'BIT Mesra',
        code: 'BITM-008',
        universityType: 'Deemed',
        institutionCategory: 'Engineering College',
        status: 'Approved',
        accessStatus: 'Enabled',
        establishmentYear: 1955,
        website: 'https://www.bitmesra.ac.in',
        district: 'Ranchi',
        quickSummary: { departments: 20, totalFaculty: 220, availableFaculty: 110, labsAndFacilities: 65, activeProjects: 35, capacityStatus: 'Available' },
        focusAreas: ['AI / ML', 'IoT', 'Renewable Energy', 'Infrastructure', 'Robotics'],
        accreditation: { naacGrade: 'A', validity: '2028-08-30', nirfRanking: 53 },
        nodalOfficer: { name: 'Prof. Sandeep Singh', designation: 'Dean R&D', email: 'dean.rnd@bitmesra.ac.in', phone: '+91 94311 22334' },
        universityEmail: 'registrar@bitmesra.ac.in',
        universityPhone: '0651-2275444',
        initialPassword: 'BIT@Mesra2026!'
      },
      {
        name: 'IIT (ISM) Dhanbad',
        shortName: 'IIT-ISM',
        code: 'IITISM-009',
        universityType: 'Institute of National Importance',
        institutionCategory: 'Institute of National Importance',
        status: 'Approved',
        accessStatus: 'Enabled',
        establishmentYear: 1926,
        website: 'https://www.iitism.ac.in',
        district: 'Dhanbad',
        quickSummary: { departments: 22, totalFaculty: 310, availableFaculty: 145, labsAndFacilities: 80, activeProjects: 52, capacityStatus: 'Available' },
        focusAreas: ['Mining Safety', 'Geosciences', 'Water Management', 'Environmental Science', 'Renewable Energy'],
        accreditation: { naacGrade: 'A++', validity: '2029-12-31', nirfRanking: 17 },
        nodalOfficer: { name: 'Prof. D. K. Mitra', designation: 'Associate Dean', email: 'ad.rnd@iitism.ac.in', phone: '+91 94311 55667' },
        universityEmail: 'registrar@iitism.ac.in',
        universityPhone: '0326-2235001',
        initialPassword: 'IIT@Dhanbad2026!'
      },
      {
        name: 'National Institute of Technology Jamshedpur',
        shortName: 'NIT JSR',
        code: 'NITJSR-010',
        universityType: 'Institute of National Importance',
        institutionCategory: 'Institute of National Importance',
        status: 'Approved',
        accessStatus: 'Enabled',
        establishmentYear: 1960,
        website: 'https://www.nitjsr.ac.in',
        district: 'East Singhbhum',
        quickSummary: { departments: 16, totalFaculty: 180, availableFaculty: 85, labsAndFacilities: 48, activeProjects: 28, capacityStatus: 'Available' },
        focusAreas: ['Infrastructure', 'Manufacturing', 'Automotive', 'AI / ML', 'Renewable Energy'],
        accreditation: { naacGrade: 'A', validity: '2028-05-15', nirfRanking: 86 },
        nodalOfficer: { name: 'Dr. Rajesh Prasad', designation: 'Dean Academic', email: 'dean.acad@nitjsr.ac.in', phone: '+91 94311 88990' },
        universityEmail: 'registrar@nitjsr.ac.in',
        universityPhone: '0657-2286622',
        initialPassword: 'NIT@Jamshedpur2026!'
      }
    ];

    for (const heiData of defaultHeis) {
      try {
        await this.createUniversity(heiData);
      } catch (e) {
        // Continue if already exists
      }
    }
  }
}

export const universityService = new UniversityService();
export default universityService;
