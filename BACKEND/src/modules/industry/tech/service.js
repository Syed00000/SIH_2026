import { IndustryTechTool } from './model.js';
import { UniversityProject, UniversityIndustryRequest, UniversityActivity } from '../../university/infrastructure/model.js';

export class IndustryTechService {
  async getTechTools({ industryName } = {}) {
    let query = {};
    if (industryName && industryName.trim()) {
      query = { industryName: new RegExp(industryName.trim(), 'i') };
    }

    const tools = await IndustryTechTool.find(query).sort({ createdAt: -1 }).lean();

    const totalTools = tools.length;
    const allocatedTools = tools.filter((t) => (t.allocatedProjects?.length || 0) > 0).length;
    const availableTools = tools.filter((t) => t.status === 'Available').length;
    const activeGrants = tools.reduce((acc, t) => acc + (t.allocatedProjects?.length || 0), 0);

    // Problem statements whose fee is locked by University (Approved & Accepted)
    const sanctionedRequests = await UniversityIndustryRequest.find({
      status: 'Approved',
      quoteStatus: 'Accepted'
    }).sort({ updatedAt: -1 }).lean();

    const eligibleProblemStatements = sanctionedRequests.map((r) => {
      const p = r.prototypeData || {};
      return {
        requestId: r.requestId || r._id.toString(),
        projectId: r.projectId || r.requestId,
        challengeId: r.challengeId || '',
        title: r.projectTitle || r.title || 'Sanctioned Prototype',
        problemStatement: r.problemStatement || r.executionOutcome || r.projectTitle || '',
        domain: p.department || r.domain || 'Applied R&D',
        universityCode: r.universityCode || 'RU001',
        universityName: r.universityName || 'Ranchi University',
        studentTeam: r.studentTeam || 'Student Research Team',
        leadMentor: r.facultyName || 'Faculty Lead',
        facultyMentor: r.facultyName || 'Faculty Lead',
        feeAmount: r.labChargesQuoted || '₹ 25,000',
        quoteStatus: r.quoteStatus || 'Accepted',
        prototypeData: p,
        department: p.department || '',
        requiredTechTool: p.requiredTechTool || '',
        techStack: p.techStack || '',
        bomSensors: p.bomSensors || '',
        demoUrl: p.demoUrl || '',
        mechanism: p.mechanism || p.content || '',
        pdfUrl: r.pdfUrl || p.pdfUrl || '',
        pdfName: r.pdfName || p.pdfName || 'Blueprint.pdf',
        grantedTechHelp: r.grantedTechHelp || []
      };
    });

    return {
      tools: tools || [],
      stats: { totalTools, allocatedTools, availableTools, activeGrants },
      eligibleProblemStatements
    };
  }

  async createTechTool(data) {
    const toolId = data.toolId || `TECH-${Date.now().toString().slice(-6)}`;
    const tool = new IndustryTechTool({ ...data, toolId, status: data.status || 'Available' });
    return await tool.save();
  }

  async grantTechHelp(toolId, payload) {
    let tool = await IndustryTechTool.findOne({ toolId });
    if (!tool) {
      tool = new IndustryTechTool({
        toolId: toolId || `LAB-${Date.now().toString().slice(-6)}`,
        name: payload.toolName || 'Certified Research Lab & Testing Rig',
        category: payload.category || 'Industrial Testing Facility',
        licenseType: payload.licenseType || 'Institutional Lab Authorization',
        industryName: payload.industryName || 'Ariba Research Labs',
        status: 'Allocated'
      });
      await tool.save();
    }

    const allocationItem = {
      projectId: payload.projectId,
      challengeId: payload.challengeId || '',
      projectTitle: payload.projectTitle || payload.title,
      universityCode: payload.universityCode || 'RU001',
      universityName: payload.universityName || 'Ranchi University',
      studentTeam: payload.studentTeam || '',
      accessCredentials: payload.accessCredentials || `TECH-${Date.now().toString().slice(-4)}-KEY`,
      validity: payload.validity || '1 Year Active R&D',
      notes: payload.notes || 'Full enterprise technical assistance & testing access granted.',
      grantedAt: new Date()
    };

    const exists = tool.allocatedProjects.some((p) => p.projectId === allocationItem.projectId);
    if (!exists) {
      tool.allocatedProjects.push(allocationItem);
      tool.status = 'Allocated';
      await tool.save();
    }

    const letterNo = payload.letterNo || `IND-GRANT/${tool.toolId}/${Date.now().toString().slice(-4)}`;
    const techHelpRecord = {
      toolId: tool.toolId,
      toolName: tool.name,
      category: tool.category,
      version: tool.version,
      licenseType: tool.licenseType,
      industryName: tool.industryName,
      accessCredentials: allocationItem.accessCredentials,
      validity: allocationItem.validity,
      notes: allocationItem.notes,
      grantedAt: allocationItem.grantedAt,
      letterNo,
      grantLetter: payload.grantLetter || {
        letterNo,
        dispatchDate: allocationItem.grantedAt,
        issuingPartner: tool.industryName,
        recipientUniversity: allocationItem.universityName,
        projectTitle: allocationItem.projectTitle,
        toolName: tool.name,
        accessCredentials: allocationItem.accessCredentials,
        validity: allocationItem.validity
      }
    };

    // Update University Project with the granted tool
    await UniversityProject.updateMany(
      { $or: [{ projectId: allocationItem.projectId }, { title: allocationItem.projectTitle }] },
      { 
        $push: { grantedTechHelp: techHelpRecord },
        $set: { updatedAt: new Date() }
      }
    );

    // Update University Industry Request if present
    await UniversityIndustryRequest.updateMany(
      {
        $or: [
          { requestId: allocationItem.projectId },
          { projectId: allocationItem.projectId },
          { projectTitle: allocationItem.projectTitle }
        ]
      },
      {
        $push: { grantedTechHelp: techHelpRecord },
        $set: {
          updatedAt: new Date(),
          labAccessKey: techHelpRecord.accessCredentials,
          labAccessLetter: techHelpRecord.grantLetter
        }
      }
    );

    // Log Activity for University Audit Trail
    await UniversityActivity.create({
      universityCode: allocationItem.universityCode,
      text: `Industry Partner "${tool.industryName}" granted Tech Tool Access "${tool.name}" (${tool.category}) for prototype "${allocationItem.projectTitle}".`,
      type: 'TECH_HELP_GRANTED',
      user: tool.industryName,
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      timestamp: new Date()
    });

    return { tool, allocationItem, techHelpRecord };
  }

  async revokeTechHelp(toolId, projectId) {
    const tool = await IndustryTechTool.findOne({ toolId });
    if (!tool) throw new Error(`Tech Tool with ID ${toolId} not found`);

    tool.allocatedProjects = tool.allocatedProjects.filter((p) => p.projectId !== projectId);
    if (tool.allocatedProjects.length === 0) tool.status = 'Available';
    await tool.save();

    await UniversityProject.updateMany(
      { projectId },
      { $pull: { grantedTechHelp: { toolId } }, $set: { updatedAt: new Date() } }
    );
    await UniversityIndustryRequest.updateMany(
      { projectId },
      { $pull: { grantedTechHelp: { toolId } }, $set: { updatedAt: new Date() } }
    );

    return { success: true };
  }
}

export default new IndustryTechService();
