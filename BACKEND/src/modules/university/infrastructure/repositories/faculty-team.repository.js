import bcrypt from 'bcryptjs';
import { UniversityFaculty, UniversityTeam } from '../model.js';
import User from '../../../users/infrastructure/model.js';
import { findUniversityIdentity } from '../helpers/lookup.helper.js';
import { syncFacultyUserAccount } from '../helpers/faculty-user-sync.helper.js';

export class FacultyTeamRepository {
  async getFacultyByUniversity(universityCode) {
    const identity = await findUniversityIdentity(universityCode);
    if (!identity) return [];

    try {
      const faculty = await UniversityFaculty.find({
        universityCode: { $in: identity.validIdentifiers },
        status: { $ne: 'Removed' }
      }).sort({ name: 1 }).lean();
      return faculty || [];
    } catch {
      return [];
    }
  }

  async createFaculty(universityCode, facultyData) {
    const identity = await findUniversityIdentity(universityCode);
    const code = identity?.code || (universityCode || 'RU001').toUpperCase().trim();
    const uniDoc = identity?.doc || null;

    const cleanEmail = (facultyData.email || '').trim().toLowerCase();
    const cleanName = (facultyData.name || '').trim();
    const cleanPhone = (facultyData.phone || '+91 98765 43210').trim();
    const password = facultyData.password || 'Faculty@123456';
    const passwordHash = await bcrypt.hash(password, 12);

    try {
      const userAccount = await syncFacultyUserAccount({
        cleanEmail, cleanName, cleanPhone, passwordHash, code, uniDoc, facultyData
      });

      const facultyDoc = await UniversityFaculty.findOneAndUpdate(
        {
          $or: [
            { universityCode: code, email: cleanEmail },
            { universityCode: code, name: cleanName }
          ]
        },
        {
          $set: {
            universityCode: code,
            name: cleanName,
            email: cleanEmail,
            phone: cleanPhone,
            department: facultyData.department || 'Computer Science & Engineering',
            designation: facultyData.designation || 'Assistant Professor',
            specialization: facultyData.specialization || 'Distributed Systems & Data Engineering',
            experience: facultyData.experience || '8+ Years',
            qualification: facultyData.qualification || 'Ph.D. / M.Tech',
            researchAreas: facultyData.researchAreas || ['Artificial Intelligence', 'Smart Governance'],
            availabilityStatus: facultyData.availabilityStatus || 'Available',
            bio: facultyData.bio || '',
            passwordHash,
            userId: userAccount?._id || userAccount?.id || null,
            status: 'Active'
          }
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );

      return facultyDoc.toObject();
    } catch (err) {
      console.error('Error creating faculty:', err);
      throw err;
    }
  }

  async updateFaculty(universityCode, facultyId, updateData) {
    const identity = await findUniversityIdentity(universityCode);
    const code = identity?.code || (universityCode || 'RU001').toUpperCase().trim();

    try {
      const query = facultyId.match(/^[0-9a-fA-F]{24}$/)
        ? { _id: facultyId }
        : { $or: [{ name: facultyId }, { email: facultyId }] };

      const updated = await UniversityFaculty.findOneAndUpdate(
        query,
        { $set: { ...updateData, universityCode: code } },
        { new: true }
      );

      if (updated?.email && updateData.password) {
        const passwordHash = await bcrypt.hash(updateData.password, 12);
        await UniversityFaculty.findByIdAndUpdate(updated._id, { $set: { passwordHash } });
        await User.findOneAndUpdate(
          { email: updated.email.toLowerCase().trim() },
          { $set: { passwordHash } }
        ).catch(() => {});
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

      const fac = await UniversityFaculty.findOne(query);
      if (fac) {
        const User = (await import('../../../users/infrastructure/model.js')).default;
        const MongoTokenRepository = (await import('../../../auth/infrastructure/repository.js')).default;
        const tokenRepo = new MongoTokenRepository();

        let userId = fac.userId;
        if (!userId && fac.email) {
          const userDoc = await User.findOne({ email: fac.email.toLowerCase().trim() }).lean();
          userId = userDoc?._id;
        }

        if (userId) {
          await tokenRepo.deleteTokensByUserId(userId).catch(() => {});
          await User.findByIdAndUpdate(userId, {
            $set: { accountStatus: 'BLOCKED' }
          }).catch(() => {});
        }

        // Soft-delete/deactivate faculty to preserve historical research & mentorship audit records
        await UniversityFaculty.findByIdAndUpdate(fac._id, {
          $set: {
            status: 'Removed',
            availabilityStatus: 'Inactive',
            deletedAt: new Date()
          }
        });

        // Mark faculty status as Inactive on active projects without wiping mentor name history
        const { UniversityProject } = await import('../model.js');
        await UniversityProject.updateMany(
          {
            $or: [{ 'facultyMentor.email': fac.email }, { leadMentor: fac.name }],
            isDeleted: { $ne: true }
          },
          {
            $set: {
              'facultyMentor.status': 'Inactive',
              'facultyMentor.inactiveRemarks': 'Faculty member removed or deactivated. Please reassign active mentor.'
            }
          }
        );

        // Mark mentor status on active teams
        await UniversityTeam.updateMany(
          {
            $or: [{ facultyMentorName: fac.name }, { mentor: fac.name }],
            status: 'Active'
          },
          {
            $set: {
              mentorStatus: 'Inactive',
              mentorNotes: 'Mentor record archived. Reassignment pending.'
            }
          }
        );
      }
    } catch (err) {
      console.warn('Error deleting faculty cascade:', err);
    }
    return { success: true, facultyId };
  }

  async getTeamsByUniversity(universityCode) {
    const identity = await findUniversityIdentity(universityCode);
    if (!identity) return [];

    const validCodes = identity.validIdentifiers;
    const code = identity.code;

    try {
      const { UniversityProject } = await import('../model.js');
      let teams = (await UniversityTeam.find({
        universityCode: { $in: validCodes },
        status: { $ne: 'Archived' }
      }).sort({ updatedAt: -1, teamCode: 1 }).lean()) || [];

      // Auto-sync projects that have team rosters into university_teams if not already tracked
      const projectsWithTeams = await UniversityProject.find({
        universityCode: { $in: validCodes },
        'teamMembers.0': { $exists: true },
        isDeleted: { $ne: true }
      }).lean();

      const existingProjectIds = new Set(teams.map((t) => t.projectId).filter(Boolean));

      for (const proj of projectsWithTeams) {
        if (!existingProjectIds.has(proj.projectId)) {
          const teamCode = proj.teamCode || `TEAM-${proj.projectId.replace(/[^a-zA-Z0-9]/g, '')}`;
          const leadMember = proj.teamMembers.find((m) => m.isLead) || proj.teamMembers[0];
          const leaderName = proj.studentLead || leadMember?.name || 'Student Lead';
          const mentorName = proj.leadMentor || proj.facultyMentor?.name || 'Faculty Mentor';
          const department = leadMember?.department || proj.facultyMentor?.department || 'Engineering';

          try {
            const syncedTeam = await UniversityTeam.findOneAndUpdate(
              {
                $or: [
                  { projectId: proj.projectId, universityCode: { $in: validCodes } },
                  { teamCode, universityCode: { $in: validCodes } }
                ]
              },
              {
                $set: {
                  teamCode,
                  universityCode: code,
                  name: proj.studentTeam || `${proj.title.slice(0, 24)} Innovators`,
                  leader: leaderName,
                  membersCount: proj.teamMembers.length,
                  members: proj.teamMembers,
                  projectId: proj.projectId,
                  challengeId: proj.challengeId || '',
                  projectTitle: proj.title,
                  mentor: mentorName,
                  facultyMentorName: mentorName,
                  department,
                  nepCredits: proj.nepCredits || 4,
                  status: proj.isDeleted ? 'Archived' : 'Active'
                }
              },
              { upsert: true, new: true, setDefaultsOnInsert: true }
            ).lean();

            if (syncedTeam) {
              teams.push(syncedTeam);
              existingProjectIds.add(proj.projectId);
            }
          } catch (_) { }
        }
      }

      return teams;
    } catch {
      return [];
    }
  }
}

export const facultyTeamRepository = new FacultyTeamRepository();
export default facultyTeamRepository;
