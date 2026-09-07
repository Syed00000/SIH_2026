import { IndustryExpert } from './model.js';
import {
  UniversityIndustryRequest, UniversityProject,
  UniversityActivity, UniversityApproval
} from '../../university/infrastructure/model.js';

export class IndustryExpertService {
  async getExperts({ industryName } = {}) {
    let query = {};
    if (industryName && industryName.trim()) {
      query = { industryName: new RegExp(industryName.trim(), 'i') };
    }

    let experts = await IndustryExpert.find(query).sort({ createdAt: -1 }).lean();
    if ((!experts || experts.length === 0) && industryName) {
      experts = await IndustryExpert.find({}).sort({ createdAt: -1 }).lean();
    }

    const totalExperts = experts.length;
    const activeMentors = experts.filter((e) => (e.assignedProblems?.length || 0) > 0).length;
    const availableExperts = experts.filter((e) => e.status === 'Available').length;
    const totalAssignments = experts.reduce((acc, e) => acc + (e.assignedProblems?.length || 0), 0);

    const mentorshipRequests = await UniversityIndustryRequest.find({
      status: 'Approved',
      quoteStatus: 'Accepted',
      $or: [{ collaborationPurpose: 'Mentorship' }, { purpose: 'Mentorship' }, { mentorshipRequested: true }]
    }).sort({ updatedAt: -1 }).lean();

    return {
      experts: experts || [],
      stats: { totalExperts, activeMentors, availableExperts, totalAssignments },
      eligibleProblemStatements: mentorshipRequests.map((r) => ({
        requestId: r.requestId || r._id.toString(),
        projectId: r.projectId || '',
        challengeId: r.challengeId || '',
        title: r.projectTitle || r.title || 'Mentorship Project',
        problemStatement: r.problemStatement || r.executionOutcome || r.projectTitle || '',
        universityCode: r.universityCode || 'RU001',
        universityName: r.universityName || 'Ranchi University',
        studentTeam: r.studentTeam || 'Student Research Team',
        leadMentor: r.facultyName || 'Faculty Nodal Officer',
        assignedMentor: r.assignedMentor || null,
        feeAmount: r.labChargesQuoted || '₹ 0',
        pdfUrl: r.pdfUrl || ''
      }))
    };
  }

  async createExpert(data) {
    const expertId = data.expertId || `EXP-${Date.now().toString().slice(-6)}`;
    const expert = new IndustryExpert({ ...data, expertId, status: data.status || 'Available' });
    return await expert.save();
  }

  async assignProblemToExpert(expertId, problemData) {
    const expert = await IndustryExpert.findOne({ expertId });
    if (!expert) throw new Error(`Expert with ID ${expertId} not found`);

    const problemItem = {
      requestId: problemData.requestId,
      projectId: problemData.projectId || '',
      challengeId: problemData.challengeId || '',
      problemTitle: problemData.problemTitle || problemData.title,
      problemStatement: problemData.problemStatement || '',
      universityCode: problemData.universityCode || 'RU001',
      universityName: problemData.universityName || 'Ranchi University',
      studentTeam: problemData.studentTeam || '',
      leadMentor: problemData.leadMentor || '',
      assignedAt: new Date()
    };

    const alreadyAssigned = expert.assignedProblems.some(
      (p) => p.requestId === problemItem.requestId || (p.projectId && p.projectId === problemItem.projectId)
    );
    if (!alreadyAssigned) {
      expert.assignedProblems.push(problemItem);
      expert.status = 'Assigned';
      await expert.save();
    }

    const mentorSummary = {
      expertId: expert.expertId,
      name: expert.name,
      designation: expert.designation,
      specialization: expert.specialization,
      email: expert.email,
      phone: expert.phone,
      company: expert.industryName,
      assignedAt: new Date()
    };

    // 1. Update University Industry Request
    await UniversityIndustryRequest.updateMany(
      { $or: [{ requestId: problemItem.requestId }, { projectId: problemItem.projectId }] },
      { $set: { assignedMentor: mentorSummary, updatedAt: new Date() } }
    );

    // 2. Update University Project
    if (problemItem.projectId || problemItem.problemTitle) {
      await UniversityProject.updateMany(
        { $or: [{ projectId: problemItem.projectId }, { title: problemItem.problemTitle }] },
        { $set: { industryMentor: mentorSummary, updatedAt: new Date() } }
      );
    }

    // 3. Log University Notification Activity
    await UniversityActivity.create({
      universityCode: problemItem.universityCode || 'RU001',
      text: `Industry Partner "${expert.industryName}" assigned Technical Mentor "${expert.name}" (${expert.designation}) to problem "${problemItem.problemTitle}".`,
      type: 'MENTOR_ASSIGNED',
      user: expert.industryName,
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      timestamp: new Date()
    });

    // 4. Sync to University Prototype Approval Queue
    const protoQuery = {
      $or: [{ projectId: problemItem.projectId }, { challengeId: problemItem.projectId }, { project: problemItem.problemTitle }],
      type: 'Prototype Approval'
    };
    const existing = await UniversityApproval.findOne(protoQuery);
    const nowStr = `${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}, ${new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`;
    const historyEntry = {
      action: 'Industry Corporate Mentor Assigned',
      performedBy: expert.name,
      timestamp: nowStr,
      note: `Corporate Guide ${expert.name} (${expert.designation}) assigned by ${expert.industryName}.`
    };

    if (existing) {
      await UniversityApproval.updateOne(
        { _id: existing._id },
        {
          $set: { status: 'Pending', assignedMentor: mentorSummary, mentorshipAssigned: true, partnerName: expert.industryName, updatedAt: new Date() },
          $push: { history: historyEntry }
        }
      );
    } else {
      await UniversityApproval.create({
        approvalId: `APP-PROTO-${Date.now()}`,
        universityCode: problemItem.universityCode || 'RU001',
        title: `Prototype Mentorship Assigned — ${problemItem.problemTitle}`,
        type: 'Prototype Approval',
        project: problemItem.problemTitle,
        projectId: problemItem.projectId,
        challengeId: problemItem.challengeId || '',
        requestedBy: problemItem.leadMentor || 'Faculty Mentor',
        teamName: problemItem.studentTeam || 'Student Research Team',
        partnerName: expert.industryName,
        assignedMentor: mentorSummary,
        mentorshipAssigned: true,
        problemStatement: problemItem.problemStatement || problemItem.problemTitle,
        date: new Date(),
        status: 'Pending',
        notes: `Technical guide ${expert.name} (${expert.designation}) assigned by ${expert.industryName}.`,
        history: [historyEntry]
      });
    }

    return { expert, assignedProblem: problemItem };
  }

  async unassignProblemFromExpert(expertId, requestId) {
    const expert = await IndustryExpert.findOne({ expertId });
    if (!expert) throw new Error(`Expert with ID ${expertId} not found`);

    const unassigned = expert.assignedProblems.find((p) => p.requestId === requestId);
    expert.assignedProblems = expert.assignedProblems.filter((p) => p.requestId !== requestId);
    if (expert.assignedProblems.length === 0) expert.status = 'Available';
    await expert.save();

    await UniversityIndustryRequest.updateMany(
      { requestId },
      { $unset: { assignedMentor: 1 }, $set: { updatedAt: new Date() } }
    );
    if (unassigned?.projectId) {
      await UniversityProject.updateMany(
        { projectId: unassigned.projectId },
        { $unset: { industryMentor: 1 }, $set: { updatedAt: new Date() } }
      );
    }
    return { success: true, expert };
  }
}

export const industryExpertService = new IndustryExpertService();
export default industryExpertService;
