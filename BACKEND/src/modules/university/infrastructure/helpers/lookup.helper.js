import mongoose from 'mongoose';
import MongooseUniversity from '../../../government/heis/infrastructure/model.js';

export function isDbReady() {
  return mongoose.connection.readyState >= 1;
}

export async function findUniversityByCodeOrId(identifier) {
  if (!identifier) return null;
  const clean = identifier.trim();
  const query = {
    $or: [
      { code: { $regex: new RegExp(`^${clean}$`, 'i') } },
      { aisheCode: { $regex: new RegExp(`^${clean}$`, 'i') } },
      { shortName: { $regex: new RegExp(`^${clean}$`, 'i') } },
      { name: { $regex: new RegExp(clean, 'i') } },
      { universityEmail: clean.toLowerCase() },
      { 'credentials.loginEmail': clean.toLowerCase() },
      { 'nodalOfficer.email': clean.toLowerCase() }
    ]
  };

  if (isDbReady()) {
    try {
      const uni = await MongooseUniversity.findOne(query).lean();
      if (uni) return uni;
    } catch { }
  }
  return null;
}
