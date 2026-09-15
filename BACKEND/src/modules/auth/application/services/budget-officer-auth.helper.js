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
    password: officer.credentials?.password || 'Officer@JH2026!',
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
