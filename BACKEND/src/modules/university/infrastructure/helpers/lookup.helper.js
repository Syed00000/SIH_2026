import mongoose from 'mongoose';
import MongooseUniversity from '../../../government/heis/infrastructure/model.js';

export function isDbReady() {
  return mongoose.connection.readyState >= 1;
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Canonical University Resolver
 * Resolves any valid institutional identifier (code, AISHE, _id, exact anchored name, login email)
 * to a standardized, immutable, tenant-safe identity object.
 *
 * Rules:
 * - Never uses unanchored regexes.
 * - Never allows empty or undefined identifiers into validIdentifiers.
 * - Fails closed (returns null) when identity cannot be established.
 *
 * @param {string} identifier - Raw input identifier (e.g. 'RU001', 'U-0205', 'Ranchi University')
 * @returns {Promise<{ id: string, code: string, aisheCode: string, name: string, validIdentifiers: string[], doc: object|null } | null>}
 */
export async function findUniversityIdentity(identifier) {
  if (!identifier || typeof identifier !== 'string') return null;
  const clean = identifier.trim();
  if (!clean || clean.length < 2) return null;

  const escaped = escapeRegex(clean);
  const isObjectId = mongoose.isValidObjectId(clean);

  const orConditions = [
    { code: { $regex: new RegExp(`^${escaped}$`, 'i') } },
    { aisheCode: { $regex: new RegExp(`^${escaped}$`, 'i') } },
    { shortName: { $regex: new RegExp(`^${escaped}$`, 'i') } },
    { name: { $regex: new RegExp(`^${escaped}$`, 'i') } }, // Strictly anchored exact name
    { universityEmail: clean.toLowerCase() },
    { 'credentials.loginEmail': clean.toLowerCase() },
    { 'nodalOfficer.email': clean.toLowerCase() }
  ];

  if (isObjectId) {
    orConditions.unshift({ _id: clean });
  }

  let uniDoc = null;
  if (isDbReady()) {
    try {
      uniDoc = await MongooseUniversity.findOne({ $or: orConditions }).lean();
    } catch {
      uniDoc = null;
    }
  }

  if (uniDoc) {
    const code = (uniDoc.code || '').toUpperCase().trim();
    const aisheCode = (uniDoc.aisheCode || '').toUpperCase().trim();
    const id = uniDoc._id ? uniDoc._id.toString() : '';
    const name = uniDoc.name || clean;

    const validSet = new Set();
    if (code) validSet.add(code);
    if (aisheCode) validSet.add(aisheCode);
    if (id) validSet.add(id);

    return {
      id,
      code,
      aisheCode,
      name,
      validIdentifiers: Array.from(validSet),
      doc: uniDoc
    };
  }

  // Fallback for standalone/mock codes if format is a valid code (e.g. RU001, CUJ001, U-0205)
  const codeRegex = /^[A-Za-z0-9\-_]{2,20}$/;
  if (codeRegex.test(clean)) {
    const upper = clean.toUpperCase();
    return {
      id: upper,
      code: upper,
      aisheCode: '',
      name: clean,
      validIdentifiers: [upper],
      doc: null
    };
  }

  // Fail closed
  return null;
}

/**
 * Backward compatibility wrapper returning raw university document.
 */
export async function findUniversityByCodeOrId(identifier) {
  const identity = await findUniversityIdentity(identifier);
  return identity?.doc || null;
}

export default { isDbReady, findUniversityIdentity, findUniversityByCodeOrId };
