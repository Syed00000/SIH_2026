import { UniversityTeam, UniversityProject } from '../model.js';
import { findUniversityIdentity } from '../helpers/lookup.helper.js';

export class TeamRepository {
  async getTeamsByUniversity(universityCode) {
    const identity = await findUniversityIdentity(universityCode);
    if (!identity) return [];

    const validCodes = identity.validIdentifiers;
    const code = identity.code;

    try {
      let teams = (await UniversityTeam.find({
        universityCode: { $in: validCodes },
        status: { $ne: 'Archived' }
      }).sort({ updatedAt: -1, teamCode: 1 }).lean()) || [];

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

  async createTeam(universityCode, teamData) {
    const identity = await findUniversityIdentity(universityCode);
    const code = identity?.code || (universityCode || 'RU001').toUpperCase().trim();
    const teamCode = teamData.teamCode || `TEAM-RU-${Date.now().toString().slice(-4)}`;
    try {
      const payload = {
        teamCode,
        universityCode: code,
        name: teamData.name || teamData.teamName || 'Research Innovation Team',
        leader: teamData.leader || teamData.studentLead || 'Unassigned',
        membersCount: (teamData.members || teamData.teamMembers || []).length,
        members: teamData.members || teamData.teamMembers || [],
        projectId: teamData.projectId || teamData.project || '',
        projectTitle: teamData.projectTitle || teamData.project || '',
        mentor: teamData.mentor || 'Faculty Mentor',
        facultyMentorName: teamData.mentor || 'Faculty Mentor',
        status: teamData.status || 'Active'
      };
      const doc = await UniversityTeam.create(payload);
      return doc ? doc.toObject() : payload;
    } catch {
      return { teamCode, ...teamData, universityCode: code };
    }
  }

  async updateTeam(universityCode, teamId, updateData) {
    try {
      const query = teamId.match(/^[0-9a-fA-F]{24}$/) ? { _id: teamId } : { teamCode: teamId };
      const doc = await UniversityTeam.findOneAndUpdate(query, { $set: updateData }, { new: true });
      return doc ? doc.toObject() : updateData;
    } catch {
      return updateData;
    }
  }

  async deleteTeam(universityCode, teamId) {
    try {
      const isObjectId = Boolean(teamId && /^[0-9a-fA-F]{24}$/.test(teamId));
      const query = isObjectId
        ? { $or: [{ _id: teamId }, { teamCode: teamId }, { projectId: teamId }] }
        : { $or: [{ teamCode: teamId }, { projectId: teamId }, { teamCode: `TEAM-${teamId}` }, { teamCode: `TEAM-PRJ-${teamId}` }] };

      const deletedDoc = await UniversityTeam.findOneAndDelete(query);
      const targetProjectId = deletedDoc?.projectId || (teamId?.startsWith('PRJ-') ? teamId : null);

      if (targetProjectId) {
        await UniversityProject.updateMany(
          { projectId: targetProjectId },
          {
            $set: {
              studentTeam: '',
              teamCode: '',
              studentLead: '',
              teamMembersCount: 0,
              teamMembers: []
            }
          }
        );
      }
    } catch (err) {
      console.warn('Error deleting team:', err);
    }
    return { success: true, teamId };
  }
}

export const teamRepository = new TeamRepository();
export default teamRepository;
