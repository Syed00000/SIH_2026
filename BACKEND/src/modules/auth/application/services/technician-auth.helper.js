import Technician from '../../../government/technicians/infrastructure/technician.schema.js';

export async function findTechnicianByIdentifier(rawIdentifier) {
  if (!rawIdentifier) return null;
  const raw = rawIdentifier.trim();
  const lower = raw.toLowerCase();
  const upper = raw.toUpperCase();

  try {
    return await Technician.findOne({
      $or: [
        { 'credentials.loginEmail': lower },
        { email: lower },
        { technicianId: upper },
        { 'credentials.loginId': raw },
        { 'credentials.loginId': lower },
        { phone: raw }
      ]
    });
  } catch {
    return null;
  }
}

export async function findTechnicianById(id) {
  if (!id) return null;
  try {
    return (await Technician.findById(id).catch(() => null)) ||
      (await Technician.findOne({ technicianId: id.toString().toUpperCase() }).catch(() => null));
  } catch {
    return null;
  }
}

export function toTechnicianUserEntity(tech) {
  if (!tech) return null;
  const techId = tech.technicianId || 'TECH-001';
  const id = tech._id ? tech._id.toString() : techId;
  const email = tech.email || tech.credentials?.loginEmail || `${techId.toLowerCase()}@jharkhand.gov.in`;

  return {
    id,
    fullName: tech.name,
    email,
    mobileNumber: tech.phone || '9431100000',
    role: 'TECHNICIAN',
    technicianId: techId,
    departmentId: tech.departmentId,
    department: tech.departmentName || 'Field Wing',
    specialization: tech.specialization,
    block: tech.block || '',
    district: tech.district || 'Ranchi',
    accountStatus: tech.status === 'Inactive' ? 'SUSPENDED' : 'ACTIVE',
    emailVerification: { verified: true, verifiedAt: new Date() },
    isEmailVerified: true,
    password: tech.credentials?.password || process.env.DEFAULT_TECH_PASSWORD || '',
    profile: {
      technicianId: techId,
      departmentId: tech.departmentId,
      department: tech.departmentName || 'Field Wing',
      specialization: tech.specialization,
      phone: tech.phone
    },
    toSafeObject() {
      return {
        id: this.id,
        fullName: this.fullName,
        email: this.email,
        mobileNumber: this.mobileNumber,
        role: 'TECHNICIAN',
        technicianId: this.technicianId,
        departmentId: this.departmentId,
        department: this.department,
        specialization: this.specialization,
        emailVerified: true,
        accountStatus: this.accountStatus
      };
    }
  };
}
