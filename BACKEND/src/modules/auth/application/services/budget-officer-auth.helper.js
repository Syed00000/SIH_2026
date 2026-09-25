import bcrypt from 'bcryptjs';
import BudgetOfficer from '../../../government/budget-officers/infrastructure/budgetOfficer.schema.js';

export async function findBudgetOfficerByIdentifier(rawIdentifier) {
  if (!rawIdentifier) return null;
  const raw = rawIdentifier.trim();
  const lower = raw.toLowerCase();
  const upper = raw.toUpperCase();

  try {
    return await BudgetOfficer.findOne({
      $or: [
        { 'credentials.loginEmail': lower },
        { email: lower },
        { officerId: upper },
        { 'credentials.loginId': raw },
        { 'credentials.loginId': lower },
        { phone: raw }
      ]
    });
  } catch {
    return null;
  }
}

export async function findBudgetOfficerById(id) {
  if (!id) return null;
  try {
    return (await BudgetOfficer.findById(id).catch(() => null)) ||
      (await BudgetOfficer.findOne({ officerId: id.toString().toUpperCase() }).catch(() => null));
  } catch {
    return null;
  }
}

export function toBudgetOfficerUserEntity(officer) {
  if (!officer) return null;
  const officerId = officer.officerId || 'BO-001';
  const id = officer._id ? officer._id.toString() : officerId;
  const email = officer.email || officer.credentials?.loginEmail || `${officerId.toLowerCase()}@jharkhand.gov.in`;

  return {
    id,
    fullName: officer.name || officer.fullName,
    email,
    mobileNumber: officer.phone || '9431100000',
    role: 'BUDGET_OFFICER',
    officerId: officerId,
    departmentId: officer.departmentId,
    department: officer.departmentName || 'Budget Wing',
    designation: officer.designation,
    block: officer.block || '',
    district: officer.district || 'Ranchi',
    accountStatus: officer.status === 'Inactive' ? 'SUSPENDED' : 'ACTIVE',
    emailVerification: { verified: true, verifiedAt: new Date() },
    isEmailVerified: true,
    password: officer.credentials?.password || process.env.DEFAULT_BUDGET_OFFICER_PASSWORD || '',
    profile: {
      officerId: officerId,
      departmentId: officer.departmentId,
      department: officer.departmentName || 'Budget Wing',
      designation: officer.designation,
      phone: officer.phone
    },
    toSafeObject() {
      return {
        id: this.id,
        fullName: this.fullName,
        email: this.email,
        mobileNumber: this.mobileNumber,
        role: 'BUDGET_OFFICER',
        officerId: this.officerId,
        departmentId: this.departmentId,
        department: this.department,
        designation: this.designation,
        emailVerified: true,
        accountStatus: this.accountStatus
      };
    }
  };
}

export async function syncBudgetOfficerToUser(officer, MongooseUser, bcrypt) {
  if (!officer) return null;
  const targetEmail = (officer.credentials?.loginEmail || officer.email || `${officer.officerId.toLowerCase()}@jharkhand.gov.in`).toLowerCase().trim();
  let targetHash = officer.credentials?.passwordHash;
  const plainPass = officer.credentials?.password || officer.credentials?.generatedPassword || process.env.DEFAULT_BUDGET_OFFICER_PASSWORD || 'tau123';
  if (!targetHash && plainPass) {
    targetHash = await bcrypt.hash(plainPass.trim(), 10);
    officer.credentials = officer.credentials || {};
    officer.credentials.passwordHash = targetHash;
    await BudgetOfficer.findByIdAndUpdate(officer._id, { 'credentials.passwordHash': targetHash }).catch(() => {});
  }

  let boUser = null;
  if (officer.userId) {
    boUser = await MongooseUser.findById(officer.userId).select('+passwordHash');
  }
  if (!boUser) {
    boUser = await MongooseUser.findOne({ email: targetEmail }).select('+passwordHash');
  }

  const profileData = {
    officerId: officer.officerId,
    departmentId: officer.departmentId,
    department: officer.departmentName || 'Budget Wing',
    designation: officer.designation || 'Budget Officer',
    district: officer.district || 'Ranchi',
    phone: officer.phone
  };

  if (!boUser) {
    let cleanMob = (officer.phone || '').replace(/\D/g, '').slice(-10);
    if (!cleanMob || !/^[6-9]\d{9}$/.test(cleanMob)) {
      cleanMob = `98${Math.floor(10000000 + Math.random() * 90000000)}`;
    }
    const existingMob = await MongooseUser.findOne({ mobileNumber: cleanMob });
    if (existingMob) {
      cleanMob = `94${Date.now().toString().slice(-8)}`;
    }

    boUser = await MongooseUser.create({
      fullName: officer.name || officer.fullName || 'Budget Officer',
      email: targetEmail,
      mobileNumber: cleanMob,
      passwordHash: targetHash || (await bcrypt.hash('tau123', 10)),
      role: 'BUDGET_OFFICER',
      accountStatus: officer.status === 'Inactive' ? 'SUSPENDED' : 'ACTIVE',
      emailVerification: { verified: true, verifiedAt: new Date() },
      profile: profileData
    });
    await BudgetOfficer.findByIdAndUpdate(officer._id, { userId: boUser._id }).catch(() => {});
  } else {
    let changed = false;
    if (boUser.email !== targetEmail) { boUser.email = targetEmail; changed = true; }
    if (targetHash && boUser.passwordHash !== targetHash) { boUser.passwordHash = targetHash; changed = true; }
    if (boUser.role !== 'BUDGET_OFFICER') { boUser.role = 'BUDGET_OFFICER'; changed = true; }
    if (boUser.accountStatus !== 'ACTIVE' && officer.status !== 'Inactive') { boUser.accountStatus = 'ACTIVE'; changed = true; }
    if (!boUser.emailVerification?.verified) { boUser.emailVerification = { verified: true, verifiedAt: new Date() }; changed = true; }
    const currP = boUser.profile || {};
    if (currP.officerId !== officer.officerId || currP.departmentId !== officer.departmentId) {
      boUser.profile = { ...currP, ...profileData };
      changed = true;
    }
    if (changed) await boUser.save();
    if (!officer.userId) {
      await BudgetOfficer.findByIdAndUpdate(officer._id, { userId: boUser._id }).catch(() => {});
    }
  }

  return boUser;
}

export async function verifyBudgetOfficerPassword(user, uniqueCandidates, userService) {
  if (user.password && (uniqueCandidates.includes(user.password) || uniqueCandidates.includes(user.password.trim()))) {
    return true;
  }
  try {
    const boDoc = await BudgetOfficer.findOne({
      $or: [
        { email: user.email?.toLowerCase() },
        { 'credentials.loginEmail': user.email?.toLowerCase() },
        { officerId: user.profile?.officerId || user.officerId }
      ]
    });
    if (boDoc?.credentials) {
      const boPlain = boDoc.credentials.password || boDoc.credentials.generatedPassword;
      if (boPlain && uniqueCandidates.some((c) => c.toLowerCase() === boPlain.trim().toLowerCase())) {
        const newHash = await bcrypt.hash(boPlain.trim(), 10);
        if (userService?.updateResetCredentials) {
          await userService.updateResetCredentials(user.id, { passwordHash: newHash });
        }
        user.passwordHash = newHash;
        return true;
      }
    }
  } catch {
    // ignore
  }
  return false;
}
