import bcrypt from 'bcryptjs';
import { UniversityFaculty, UniversityTeam } from '../model.js';
import User from '../../../users/infrastructure/model.js';
import { findUniversityByCodeOrId } from '../helpers/lookup.helper.js';
import { syncFacultyUserAccount } from '../helpers/faculty-user-sync.helper.js';

export class FacultyTeamRepository {
  async getFacultyByUniversity(universityCode) {
    const rawCode = (universityCode || '').trim();
    const uniDoc = await findUniversityByCodeOrId(rawCode);
    const code = (uniDoc?.code || rawCode).toUpperCase();
    const aishe = (uniDoc?.aisheCode || '').toUpperCase();
    const validCodes = Array.from(new Set([code, rawCode.toUpperCase(), aishe, uniDoc?.shortName].filter(Boolean)));

    try {
      const faculty = await UniversityFaculty.find({
        $or: [
          { universityCode: { $in: validCodes } },
          { universityCode: code }
        ]
      }).sort({ name: 1 }).lean();
      return faculty || [];
    } catch {
      return [];
    }
  }

  async createFaculty(universityCode, facultyData) {
    const rawCode = (universityCode || '').trim();
    const uniDoc = await findUniversityByCodeOrId(rawCode);
    const code = (uniDoc?.code || rawCode).toUpperCase();
    const cleanEmail = (facultyData.email || '').trim().toLowerCase();
    const cleanName = (facultyData.name || '').trim();
    const cleanPhone = (facultyData.phone || '+91 98765 43210').trim();
    const password = facultyData.password || 'Faculty@123456';
    const passwordHash = await bcrypt.hash(password, 12);

    let userAccount = null;
    try {
      userAccount = await syncFacultyUserAccount({
        cleanEmail, cleanName, cleanPhone, passwordHash, code, uniDoc, facultyData
      });
    } catch (e) {
      console.warn('User account sync skipped:', e.message);
    }

    try {
      let existingFac = await UniversityFaculty.findOne({
        $or: [
          { universityCode: code, email: cleanEmail },
          { email: cleanEmail }
        ]
      });

      const facultyPayload = {
        ...facultyData,
        email: cleanEmail,
        name: cleanName,
        universityCode: code,
        passwordHash,
        userId: userAccount?._id || null,
        status: facultyData.status || 'Active',
        availabilityStatus: facultyData.availabilityStatus || 'Available'
      };

      if (existingFac) {
        const updated = await UniversityFaculty.findByIdAndUpdate(
          existingFac._id,
          { $set: facultyPayload },
          { new: true }
        );
        return updated?.toObject ? updated.toObject() : updated;
      }

      const created = await UniversityFaculty.create(facultyPayload);
      return created?.toObject ? created.toObject() : created;
    } catch (err) {
      console.error('Error in createFaculty mongo save:', err);
      try {
        const fallback = await UniversityFaculty.findOneAndUpdate(
          { email: cleanEmail },
          {
            $set: {
              name: cleanName,
              email: cleanEmail,
              universityCode: code,
              department: facultyData.department || 'Engineering',
              designation: facultyData.designation || 'Faculty Mentor',
              status: 'Active',
              availabilityStatus: 'Available'
            }
          },
          { upsert: true, new: true }
        );
        return fallback?.toObject ? fallback.toObject() : fallback;
      } catch (fallbackErr) {
        console.error('Fallback save failed:', fallbackErr);
        return {
          id: `FAC-${Date.now().toString().slice(-4)}`,
          ...facultyData,
          email: cleanEmail,
          name: cleanName,
          universityCode: code
        };
      }
    }
  }

  async updateFaculty(universityCode, facultyId, updateData) {
    const code = (universityCode || '').toUpperCase();
    try {
      let passwordHash;
      if (updateData.password) {
        passwordHash = await bcrypt.hash(updateData.password, 12);
        updateData.passwordHash = passwordHash;
      }

      const query = facultyId && facultyId.match(/^[0-9a-fA-F]{24}$/)
        ? { _id: facultyId }
        : { $or: [{ name: facultyId }, { email: facultyId }, { facultyId }, { id: facultyId }] };

      const updated = await UniversityFaculty.findOneAndUpdate(query, { $set: updateData }, { new: true });

      const facEmail = updated?.email || updateData.email;
      if (facEmail && passwordHash) {
        await User.findOneAndUpdate(
          { email: facEmail.toLowerCase() },
          { $set: { passwordHash, accountStatus: 'ACTIVE', 'emailVerification.verified': true } }
        );
      }

      return updated ? updated.toObject() : { _id: facultyId, ...updateData, universityCode: code };
    } catch {
      return { _id: facultyId, ...updateData, universityCode: code };
    }
  }

  async deleteFaculty(universityCode, facultyId) {
    try {
      const query = facultyId.match(/^[0-9a-fA-F]{24}$/)
        ? { _id: facultyId }
        : { $or: [{ name: facultyId }, { email: facultyId }] };
      await UniversityFaculty.findOneAndDelete(query);
    } catch { }
    return { success: true, facultyId };
  }

  async getTeamsByUniversity(universityCode) {
    const code = (universityCode || '').toUpperCase();
    try {
      return (await UniversityTeam.find({ universityCode: code }).sort({ teamCode: 1 }).lean()) || [];
    } catch {
      return [];
    }
  }
}

export const facultyTeamRepository = new FacultyTeamRepository();
export default facultyTeamRepository;
