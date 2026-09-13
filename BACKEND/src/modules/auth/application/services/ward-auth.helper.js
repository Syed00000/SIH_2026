import bcrypt from 'bcryptjs';
import Ward from '../../../government/wards/infrastructure/ward.schema.js';

export async function findWardByIdentifier(rawIdentifier) {
  if (!rawIdentifier) return null;
  const raw = rawIdentifier.trim();
  const lower = raw.toLowerCase();
  const upper = raw.toUpperCase();

  try {
    const ward = await Ward.findOne({
      $or: [
        { 'credentials.loginEmail': lower },
        { 'credentials.loginId': raw },
        { 'credentials.loginId': lower },
        { councillorEmail: lower },
        { wardId: upper },
        { wardId: raw }
      ]
    });
    return ward;
  } catch {
    return null;
  }
}

export async function findWardById(id) {
  if (!id) return null;
  try {
    const ward = (await Ward.findById(id).catch(() => null)) ||
      (await Ward.findOne({ wardId: id.toString().toUpperCase() }).catch(() => null));
    return ward;
  } catch {
    return null;
  }
}

export function toWardUserEntity(ward) {
  if (!ward) return null;
  const wardId = ward.wardId || (ward._id ? ward._id.toString() : '');
  const id = ward._id ? ward._id.toString() : wardId;
  const email = ward.credentials?.loginEmail || ward.councillorEmail || `${wardId.toLowerCase()}@jharkhand.gov.in`;
  const rawPass = ward.credentials?.password || 'Ward@2026';
  const passwordHash = rawPass.startsWith('$2') ? rawPass : bcrypt.hashSync(rawPass, 10);

  return {
    id,
    fullName: ward.name,
    email,
    passwordHash,
    mobileNumber: ward.councillorPhone || '9431188202',
    role: 'WARD',
    wardId,
    wardName: ward.name,
    district: ward.district || 'Ranchi',
    accountStatus: ward.status === 'Archived' ? 'SUSPENDED' : 'ACTIVE',
    emailVerification: { verified: true, verifiedAt: new Date() },
    isEmailVerified: true,
    wardDoc: ward,
    profile: {
      wardId,
      name: ward.name,
      district: ward.district || 'Ranchi',
      councillorName: ward.councillorName || '',
      councillorRole: 'Ward Councillor'
    },
    toSafeObject() {
      return {
        id: this.id,
        fullName: this.fullName,
        email: this.email,
        mobileNumber: this.mobileNumber,
        role: 'WARD',
        wardId: this.wardId,
        wardName: this.wardName,
        district: this.district,
        profile: this.profile,
        emailVerified: true,
        accountStatus: this.accountStatus
      };
    }
  };
}
