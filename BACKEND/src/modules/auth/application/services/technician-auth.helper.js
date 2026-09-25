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

export async function syncTechnicianToUser(tech, MongooseUser, bcrypt) {
  if (!tech) return null;
  const techId = tech.technicianId || 'TECH-001';
  const targetEmail = (tech.credentials?.loginEmail || tech.email || `${techId.toLowerCase()}@jharkhand.gov.in`).toLowerCase().trim();
  let targetHash = tech.credentials?.passwordHash;
  const plainPass = tech.credentials?.password || tech.credentials?.generatedPassword || process.env.DEFAULT_TECH_PASSWORD || 'Tech@JH2026!';

  if (!targetHash && plainPass && bcrypt) {
    targetHash = await bcrypt.hash(plainPass.trim(), 10);
    tech.credentials = tech.credentials || {};
    tech.credentials.passwordHash = targetHash;
    await Technician.findByIdAndUpdate(tech._id, { 'credentials.passwordHash': targetHash }).catch(() => {});
  }

  let techUser = null;
  if (tech.userId) {
    techUser = await MongooseUser.findById(tech.userId).select('+passwordHash');
  }
  if (!techUser) {
    techUser = await MongooseUser.findOne({ email: targetEmail }).select('+passwordHash');
  }
  if (!techUser && techId) {
    techUser = await MongooseUser.findOne({ 'profile.technicianId': techId }).select('+passwordHash');
  }

  const profileData = {
    technicianId: techId,
    departmentId: tech.departmentId || '',
    department: tech.departmentName || 'Field Wing',
    specialization: tech.specialization || 'Field Operations',
    district: tech.district || 'Ranchi',
    block: tech.block || '',
    panchayat: tech.panchayat || '',
    phone: tech.phone || ''
  };

  if (!techUser) {
    let cleanMob = (tech.phone || '').toString().replace(/\D/g, '').slice(-10);
    if (!cleanMob || !/^[6-9]\d{9}$/.test(cleanMob)) {
      cleanMob = `98${Math.floor(10000000 + Math.random() * 90000000)}`;
    }
    const existingMob = await MongooseUser.findOne({ mobileNumber: cleanMob });
    if (existingMob) {
      cleanMob = `94${Date.now().toString().slice(-8)}`;
    }

    const fallbackHash = targetHash || (bcrypt ? await bcrypt.hash('Tech@JH2026!', 10) : '');
    techUser = await MongooseUser.create({
      fullName: tech.name || 'Field Technician',
      email: targetEmail,
      mobileNumber: cleanMob,
      passwordHash: fallbackHash,
      role: 'TECHNICIAN',
      accountStatus: tech.status === 'Inactive' ? 'SUSPENDED' : 'ACTIVE',
      emailVerification: { verified: true, verifiedAt: new Date() },
      profile: profileData
    });
    await Technician.findByIdAndUpdate(tech._id, { userId: techUser._id }).catch(() => {});
  } else {
    let changed = false;
    if (techUser.email !== targetEmail) { techUser.email = targetEmail; changed = true; }
    if (targetHash && techUser.passwordHash !== targetHash) { techUser.passwordHash = targetHash; changed = true; }
    if (techUser.role !== 'TECHNICIAN') { techUser.role = 'TECHNICIAN'; changed = true; }
    if (techUser.accountStatus !== 'ACTIVE' && tech.status !== 'Inactive') { techUser.accountStatus = 'ACTIVE'; changed = true; }
    if (!techUser.emailVerification?.verified) { techUser.emailVerification = { verified: true, verifiedAt: new Date() }; changed = true; }
    techUser.profile = { ...(techUser.profile || {}), ...profileData };
    changed = true;
    if (changed) await techUser.save();
    if (!tech.userId) {
      await Technician.findByIdAndUpdate(tech._id, { userId: techUser._id }).catch(() => {});
    }
  }

  return techUser;
}
