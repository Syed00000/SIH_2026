import bcrypt from 'bcryptjs';
import MongooseUser from '../../../../users/infrastructure/model.js';
import { BadRequestError, ConflictError } from '../../../../../shared/errors/AppError.js';
import logger from '../../../../../shared/logger/index.js';
import { generatePassword } from '../helpers/password.helper.js';
import { getDefaultDepartments, getDefaultFacilities, getDefaultResearchAreas } from '../helpers/hei-defaults.helper.js';

export class HeiOnboardingService {
  constructor(repository) {
    this.repository = repository;
  }

  async createUniversity(data) {
    const {
      name, shortName, code, universityType, institutionCategory,
      establishmentYear, website, district, quickSummary, focusAreas,
      accreditation, nodalOfficer, universityEmail, universityPhone, initialPassword
    } = data;

    if (!name || !code || !district || !universityEmail || !nodalOfficer?.name || !nodalOfficer?.email) {
      throw new BadRequestError('Missing required university fields');
    }

    const existingCode = await this.repository.findByCode(code);
    if (existingCode) {
      throw new ConflictError(`University with code ${code} already exists`);
    }

    const loginEmail = (nodalOfficer.email || universityEmail).toLowerCase().trim();
    const rawPassword = initialPassword && initialPassword.trim() ? initialPassword.trim() : generatePassword(10);
    const passwordHash = await bcrypt.hash(rawPassword, 10);

    let mobile = nodalOfficer.phone ? nodalOfficer.phone.replace(/\D/g, '') : '';
    if (mobile.length > 10) mobile = mobile.slice(-10);
    if (!mobile || mobile.length !== 10 || !/^[6-9]\d{9}$/.test(mobile)) {
      mobile = '98' + Math.floor(10000000 + Math.random() * 90000000).toString().slice(0, 8);
    }

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

    const university = await this.repository.create({
      name: name.trim(),
      shortName: shortName ? shortName.trim() : (name.match(/\b(\w)/g) || []).join('').toUpperCase(),
      code: code.toUpperCase().trim(),
      universityType: universityType || 'State University',
      institutionCategory: institutionCategory || 'University',
      status: 'Approved',
      accessStatus: 'Enabled',
      establishmentYear: establishmentYear ? Number(establishmentYear) : null,
      website: website || '',
      district: district.trim(),
      quickSummary: quickSummary || { departments: 0, totalFaculty: 0, availableFaculty: 0, labsAndFacilities: 0, activeProjects: 0, capacityStatus: 'Available' },
      focusAreas: focusAreas && focusAreas.length > 0 ? focusAreas : [],
      accreditation: accreditation || { naacGrade: '', validity: '', nirfRanking: null },
      aisheCode: data.aisheCode || code,
      tagline: data.tagline || '',
      about: data.about || '',
      address: data.address || { campus: '', district: district, state: 'Jharkhand', pincode: '' },
      departments: data.departments || getDefaultDepartments(),
      researchAreas: data.researchAreas || getDefaultResearchAreas(),
      facilities: data.facilities || getDefaultFacilities(),
      lastUpdatedBy: { name: nodalOfficer.name.trim(), updatedAt: new Date() },
      nodalOfficer: {
        name: nodalOfficer.name.trim(),
        designation: nodalOfficer.designation || 'Registrar',
        email: loginEmail,
        phone: nodalOfficer.phone || `+91 ${mobile}`
      },
      universityEmail: (universityEmail || loginEmail).toLowerCase().trim(),
      universityPhone: universityPhone || `+91 ${mobile}`,
      credentials: { loginEmail, generatedPassword: rawPassword, passwordHash },
      userId: user._id,
      auditLogs: [{ action: 'CREATED', performedBy: 'Government Admin', timestamp: new Date(), details: `Institution onboarded with code ${code}. Credentials generated.` }]
    });

    logger.info({ msg: 'University registered successfully', id: university._id, code: university.code });

    return {
      university,
      credentials: { email: loginEmail, password: rawPassword }
    };
  }
}

export default HeiOnboardingService;
