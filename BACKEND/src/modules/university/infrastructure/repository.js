import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import {
  UniversityChallenge,
  UniversityProject,
  UniversityFaculty,
  UniversityTeam,
  UniversityPartner,
  UniversityApproval,
  UniversityActivity
} from './model.js';
import MongooseUniversity from '../../government/heis/infrastructure/model.js';
import MongooseIndustry from '../../government/industries/infrastructure/model.js';
import { CitizenChallenge } from '../../citizen/infrastructure/model.js';
import User from '../../users/infrastructure/model.js';
import Admin from '../../government/admins/infrastructure/model.js';

export class UniversityDashboardRepository {
  isDbReady() {
    return mongoose.connection.readyState >= 1;
  }

  async findUniversityByCodeOrId(identifier) {
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
    if (this.isDbReady()) {
      try {
        const uni = await MongooseUniversity.findOne(query).lean();
        if (uni) return uni;
      } catch (err) { }
    }
    return null;
  }

  async getChallengesByUniversity(universityCode, { status, domain, district, search, page = 1, limit = 100 } = {}) {
    const rawCode = (universityCode || '').trim();
    const uniDoc = await this.findUniversityByCodeOrId(rawCode);
    const code = (uniDoc?.code || rawCode).toUpperCase();
    const aishe = (uniDoc?.aisheCode || '').toUpperCase();
    const uniName = uniDoc?.name || uniDoc?.legalName || '';

    const validUniIdentifiers = Array.from(new Set([code, rawCode.toUpperCase(), aishe, uniDoc?.shortName].filter(Boolean)));
    const citizenOrConditions = [
      { 'assignedUniversity.id': { $in: validUniIdentifiers } }
    ];
    if (uniName) {
      citizenOrConditions.push({ 'assignedUniversity.name': { $regex: new RegExp(uniName, 'i') } });
    }

    const query = { universityCode: { $in: validUniIdentifiers }, isDeleted: { $ne: true } };
    if (status && status !== 'All Status' && status !== 'All') query.status = status;
    if (domain && domain !== 'All Domains' && domain !== 'All') query.domain = domain;
    if (district && district !== 'All Districts' && district !== 'All') query.district = district;
    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), 'i');
      query.$and = [{ $or: [{ challengeId: regex }, { title: regex }, { domain: regex }, { district: regex }] }];
    }
    const skip = (Number(page) - 1) * Number(limit);
    try {
      const [uniChallenges, total, citizenChallenges, defaultNodalUser] = await Promise.all([
        UniversityChallenge.find(query).sort({ assignedOn: -1 }).skip(skip).limit(Number(limit)).lean(),
        UniversityChallenge.countDocuments(query),
        CitizenChallenge.find({ $or: citizenOrConditions }).sort({ submittedAt: -1 }).limit(Number(limit)).lean(),
        User.findOne({ role: { $in: ['NODAL', 'GOVERNMENT'] } }).lean()
      ]);

      const formatChallenge = (c) => {
        const loc = c.location || c.locationDetails || {};
        const district = loc.district || c.district || 'NA';
        const block = loc.block && loc.block !== 'Not specified' ? loc.block : (loc.subDivision || 'Not specified');
        const subDivision = loc.subDivision && loc.subDivision !== 'Not specified' ? loc.subDivision : (loc.block || 'Not specified');
        const panchayatOrWard = loc.panchayatOrWard && loc.panchayatOrWard !== 'Not specified' ? loc.panchayatOrWard : (loc.gramPanchayat || loc.ward || 'Not specified');
        const landmark = loc.landmark && loc.landmark !== 'Ground Location' ? loc.landmark : 'Ground Location';
        const pincode = loc.pincode || 'N/A';
        const state = loc.state || 'Jharkhand';
        const coordinates = loc.coordinates || 'Coordinates not provided';
        const fullAddress = loc.fullAddress || [landmark !== 'Ground Location' ? landmark : '', panchayatOrWard !== 'Not specified' ? panchayatOrWard : '', block !== 'Not specified' ? block : '', district, state, pincode !== 'N/A' ? pincode : ''].filter(Boolean).join(', ') || `${district}, ${state}`;

        const rawPhone = c.submitter?.mobileNumber || '';
        const maskedMobile = rawPhone && rawPhone.length >= 4
          ? `+91 ******${rawPhone.slice(-4)}`
          : '+91 ******4829';

        const accStatus = c.assignedUniversity?.acceptanceStatus || c.acceptanceStatus || (c.status === 'Accepted' ? 'Accepted' : c.status === 'Declined' ? 'Declined' : 'Pending Review');

        const assignedUni = {
          id: c.assignedUniversity?.id || c.universityCode || code,
          name: c.assignedUniversity?.name || uniName || 'University Innovation Portal',
          department: c.assignedUniversity?.department || c.assignedFaculty?.department || 'Department of Applied Sciences & Engineering',
          mentorName: c.assignedUniversity?.mentorName || c.assignedFaculty?.name || '',
          assignedAt: c.assignedUniversity?.assignedAt || c.assignedOn || c.submittedAt || c.createdAt || new Date(),
          acceptanceStatus: accStatus,
          declineReason: c.assignedUniversity?.declineReason || c.declineReason || ''
        };

        const assignedFac = (c.assignedFaculty?.name || c.assignedUniversity?.mentorName) ? {
          name: c.assignedFaculty?.name || c.assignedUniversity?.mentorName,
          department: c.assignedFaculty?.department || assignedUni.department,
          email: c.assignedFaculty?.email || '',
          designation: c.assignedFaculty?.designation || 'Lead Faculty Mentor'
        } : null;

        const realNodalName = c.allocatedBy?.name || defaultNodalUser?.fullName || defaultNodalUser?.name || 'Ritu Verma';
        const realNodalPhone = c.allocatedBy?.phone || c.allocatedBy?.mobileNumber || defaultNodalUser?.mobileNumber || defaultNodalUser?.phone || '9123456789';
        const realNodalEmail = c.allocatedBy?.email || defaultNodalUser?.email || 'ritu.verma@jh.gov.in';
        const realNodalDesignation = c.allocatedBy?.designation || defaultNodalUser?.designation || (defaultNodalUser?.role === 'NODAL' ? 'State Nodal Officer' : 'Higher Education Director');
        const realNodalDepartment = c.allocatedBy?.department || defaultNodalUser?.department || 'Dept. of Higher & Technical Education, Govt. of Jharkhand';

        const allocatedByInfo = {
          name: realNodalName,
          phone: String(realNodalPhone).startsWith('+91') ? realNodalPhone : `+91 ${realNodalPhone}`,
          mobileNumber: String(realNodalPhone).startsWith('+91') ? realNodalPhone : `+91 ${realNodalPhone}`,
          email: realNodalEmail,
          designation: realNodalDesignation,
          department: realNodalDepartment
        };

        return {
          challengeId: c.challengeId || c.id,
          id: c.challengeId || c.id,
          universityCode: code,
          title: c.title,
          domain: c.domain || 'Urban Development',
          district,
          state,
          priority: c.priority || 'Medium',
          status: accStatus === 'Accepted'
            ? 'Accepted'
            : accStatus === 'Declined'
              ? 'Declined'
              : accStatus === 'Clarified' || c.status === 'Clarified'
                ? 'Clarified'
                : accStatus === 'Clarification Requested' || c.status === 'Clarification Requested'
                  ? 'Clarification Requested'
                  : 'Pending',
          acceptanceStatus: accStatus,
          declineReason: assignedUni.declineReason,
          clarificationQuery: c.clarificationQuery || c.assignedUniversity?.clarificationQuery || '',
          clarificationResponse: c.clarificationResponse || '',
          clarificationStatus: c.clarificationStatus || (c.clarificationResponse ? 'RESOLVED' : c.clarificationQuery ? 'PENDING' : 'NONE'),
          clarificationDate: c.clarificationDate || null,
          assignedOn: assignedUni.assignedAt,
          deadline: c.deadline || 'Active Review',
          problemStatement: c.problemStatement || c.description,
          description: c.description || c.problemStatement,
          affectedPopulation: c.affectedPopulation || c.impactMetrics?.affectedPopulation || '~ 5,000 Citizens',
          aiCategory: c.aiCategory || c.domain,
          requiredSkills: c.requiredSkills?.length ? c.requiredSkills : ['Ground Engineering', 'Data Analytics', 'Field Telemetry'],
          submitter: {
            name: 'Verified Citizen',
            role: 'Verified Citizen / Resident',
            mobileNumber: `${maskedMobile} (Confidential)`,
            maskedMobile: `${maskedMobile} (Confidential)`,
            isVerified: true,
            email: c.submitter?.email ? 'citizen.confidential@jharkhand.gov.in' : '',
            organization: c.submitter?.organization || ''
          },
          location: {
            state,
            district,
            block,
            subDivision,
            panchayatOrWard,
            landmark,
            pincode,
            fullAddress,
            coordinates
          },
          locationDetails: {
            state,
            district,
            block,
            subDivision,
            panchayatOrWard,
            landmark,
            pincode,
            fullAddress,
            coordinates
          },
          allocatedBy: allocatedByInfo,
          nodalOfficer: allocatedByInfo,
          assignedUniversity: assignedUni,
          assignedFaculty: assignedFac,
          milestones: c.milestones || [],
          mediaUrls: c.mediaUrls || [],
          actionLabel: accStatus === 'Accepted' ? 'View' : accStatus === 'Declined' ? 'Declined' : 'Review'
        };
      };

      const seenIds = new Set((uniChallenges || []).map((c) => c.challengeId));
      const mappedCitizen = (citizenChallenges || [])
        .filter((cit) => !seenIds.has(cit.challengeId))
        .map((cit) => formatChallenge(cit));

      const mappedUni = (uniChallenges || []).map((u) => formatChallenge(u));
      const combined = [...mappedUni, ...mappedCitizen];

      return {
        challenges: combined,
        total: (total || 0) + mappedCitizen.length,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(((total || 0) + mappedCitizen.length) / Number(limit)) || 1
      };
    } catch (err) {
      return { challenges: [], total: 0, page: Number(page), limit: Number(limit), totalPages: 1 };
    }
  }

  async getProjectsByUniversity(universityCode, includeDeleted = false) {
    const code = (universityCode || '').toUpperCase();
    const query = { universityCode: code };
    if (!includeDeleted) query.isDeleted = { $ne: true };
    try {
      let projects = (await UniversityProject.find(query).sort({ updatedAt: -1 }).lean()) || [];

      // Also find any accepted or assigned challenges for this university
      const acceptedChallenges = await CitizenChallenge.find({
        $or: [
          { 'assignedUniversity.id': { $in: [code, 'RU001', 'RUNI-JH'] } },
          { 'assignedUniversity.name': new RegExp('Ranchi', 'i') },
          { status: { $in: ['In Progress', 'Accepted', 'Clarified', 'Under Review'] }, 'assignedUniversity.acceptanceStatus': 'Accepted' }
        ]
      }).lean();

      const existingChallengeIds = new Set(projects.map((p) => p.challengeId).filter(Boolean));

      for (const chl of acceptedChallenges) {
        if (!existingChallengeIds.has(chl.challengeId)) {
          const mentor = chl.assignedUniversity?.mentorName || chl.assignedFaculty?.name || null;
          const dept = chl.assignedUniversity?.department || chl.assignedFaculty?.department || 'Engineering & Technology';

          const projDoc = {
            projectId: `PRJ-${chl.challengeId?.replace(/[^0-9]/g, '') || Math.floor(1000 + Math.random() * 9000)}`,
            challengeId: chl.challengeId,
            universityCode: code,
            title: chl.title,
            problemStatement: chl.description || chl.problemStatement || chl.title,
            domain: chl.domain || chl.category || 'General',
            estimatedCost: chl.estimatedCost || null,
            sanctionedBudget: chl.sanctionedBudget || null,
            budget: chl.sanctionedBudget ? (typeof chl.sanctionedBudget === 'number' ? `₹ ${chl.sanctionedBudget.toLocaleString('en-IN')}` : chl.sanctionedBudget) : 'N/A',
            budgetStatus: chl.budgetStatus || 'Pending Proposal',
            leadMentor: mentor || 'Unassigned',
            facultyMentor: mentor ? { name: mentor, department: dept, designation: 'Lead Faculty Mentor' } : null,
            status: chl.status === 'Resolved' ? 'Completed' : (chl.status === 'Active R&D' ? 'In Progress' : 'Proposal Stage'),
            milestonesCompleted: mentor ? 2 : 1,
            milestonesTotal: 7,
            progressPercentage: chl.status === 'Resolved' ? 100 : Math.round(((mentor ? 2 : 1) / 7) * 100),
            deadline: 'N/A',
            timeline: 'N/A',
            daysLeft: 'N/A',
            teamMembers: [],
            documents: [],
            recentActivity: [],
            isDeleted: false,
            milestones: [
              { id: 1, title: 'Problem Statement Allocated & Scoped', status: 'Completed', dueDate: 'N/A', completedAt: chl.createdAt || new Date() },
              { id: 2, title: mentor ? `Lead Faculty Mentor Assigned (${mentor})` : 'Lead Faculty Mentor Assignment', status: mentor ? 'Completed' : 'In Progress', dueDate: 'N/A', completedAt: mentor ? new Date() : null },
              { id: 3, title: 'Faculty Solution Analysis & Budget Proposal', status: mentor ? 'In Progress' : 'Pending', dueDate: 'N/A' },
              { id: 4, title: 'University Review & Submission to Government', status: 'Pending', dueDate: 'N/A' },
              { id: 5, title: 'Government Budget Sanction & Grant Disbursal', status: 'Pending', dueDate: 'N/A' },
              { id: 6, title: 'Prototype Development & Field Testing', status: 'Pending', dueDate: 'N/A' },
              { id: 7, title: 'Government Handover & Final Audit', status: 'Pending', dueDate: 'N/A' }
            ]
          };

          try {
            await UniversityProject.findOneAndUpdate(
              { challengeId: chl.challengeId },
              { $setOnInsert: projDoc },
              { upsert: true, new: true }
            );
          } catch (e) { }

          projects.push(projDoc);
          existingChallengeIds.add(chl.challengeId);
        }
      }

      return projects;
    } catch (err) {
      return [];
    }
  }

  async createProject(universityCode, projectData) {
    const code = (universityCode || '').toUpperCase();
    const newProj = {
      projectId: projectData.projectId || `PRJ-${Date.now().toString().slice(-4)}`,
      ...projectData,
      universityCode: code,
      isDeleted: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    try {
      return await UniversityProject.create(newProj);
    } catch (err) {
      return newProj;
    }
  }

  async updateProject(universityCode, projectId, updateData) {
    const query =
      typeof projectId === 'string' && projectId.match(/^[0-9a-fA-F]{24}$/)
        ? { _id: projectId }
        : { $or: [{ projectId }, { challengeId: projectId }] };
    try {
      const res = await UniversityProject.findOneAndUpdate(query, { $set: updateData }, { new: true });
      const uniCode = (universityCode || res?.universityCode || 'RU001').toUpperCase();

      // Auto-record activity for University
      if (updateData.teamMembers && Array.isArray(updateData.teamMembers)) {
        await UniversityActivity.create({
          universityCode: uniCode,
          text: `Student Research Team (${updateData.teamMembers.length} members) organized for project ${res?.projectId || projectId}.`,
          type: 'TEAM_UPDATED',
          timestamp: new Date()
        });
      }
      // Auto-create/sync UniversityApproval request for University Review
      if (updateData.budgetStatus === 'Submitted to University for Review' || updateData.proposedBudget || updateData.budgetBreakdown) {
        const approvalId = `APP-${res?.projectId || projectId || Date.now().toString().slice(-4)}`;
        const isRevision = updateData.isRevised || updateData.revisionCount > 0;
        const approvalType = isRevision ? `Re-Proposal (Revised v${updateData.revisionCount || 2})` : 'R&D Grant Proposal';

        await UniversityApproval.findOneAndUpdate(
          { approvalId },
          {
            $set: {
              approvalId,
              universityCode: uniCode,
              title: `${isRevision ? 'Revised ' : ''}R&D Grant Proposal & Line-Item Budget: ${res?.title || updateData.title || 'Innovation Project'}`,
              type: approvalType,
              isRevised: isRevision,
              revisionCount: updateData.revisionCount || (isRevision ? 2 : 1),
              project: res?.title || updateData.title || 'Innovation Project',
              projectId: res?.projectId || projectId,
              challengeId: res?.challengeId || '',
              requestedBy: res?.leadMentor || updateData.leadMentor || res?.facultyMentor?.name || 'Faculty Mentor',
              requestedByDept: res?.facultyMentor?.department || 'Engineering',
              date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
              dateTime: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
              status: 'Pending',
              faculty: {
                name: res?.leadMentor || res?.facultyMentor?.name || 'Faculty Mentor',
                department: res?.facultyMentor?.department || 'Engineering'
              },
              team: {
                name: res?.studentTeam || 'Student Research Team',
                membersCount: res?.teamMembers?.length || 4
              },
              startDate: res?.startDate || '20 May 2026',
              estimatedBudget: updateData.proposedBudget || updateData.budget || '₹ 80,000',
              proposedBudget: updateData.proposedBudget || updateData.budget || '₹ 80,000',
              methodology: updateData.methodology || res?.methodology || '',
              budgetBreakdown: updateData.budgetBreakdown || res?.budgetBreakdown || [],
              supportTypes: ['Government Grant Funding', 'Lab Testing Bench'],
              documentsCount: 3
            },
            $push: {
              history: {
                action: isRevision ? `Re-Proposal Submitted (v${updateData.revisionCount || 2})` : 'Proposal Submitted by Faculty',
                performedBy: res?.leadMentor || 'Faculty Mentor',
                timestamp: `${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}, ${new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`,
                note: isRevision
                  ? 'Faculty submitted revised research proposal & budget in response to University Authority feedback.'
                  : `Itemized R&D Budget of ${updateData.proposedBudget || updateData.budget || '₹ 80,000'} submitted for review.`
              }
            }
          },
          { upsert: true, new: true }
        );

        await UniversityActivity.create({
          universityCode: uniCode,
          text: isRevision
            ? `Re-Proposal (Revised v${updateData.revisionCount || 2}) submitted by Faculty for "${res?.title || projectId}". Action required by University Authority.`
            : `R&D Grant Proposal & Line-Item Budget (${updateData.proposedBudget || updateData.budget || 'Submitted'}) formulated for project ${res?.projectId || projectId}.`,
          type: isRevision ? 'RE_PROPOSAL_SUBMITTED' : 'PROPOSAL_SUBMITTED',
          timestamp: new Date()
        });
      }

      // Handle Government Clarification / Revision Request
      if (updateData.budgetStatus === 'Changes Required by Government') {
        const approvalId = `APP-${res?.projectId || projectId || ''}`;
        const note = updateData.governmentRemarks || updateData.adminRemarks || 'Government Authority requested line-item revision.';
        await UniversityApproval.findOneAndUpdate(
          { approvalId },
          {
            $set: {
              status: 'Changes Required',
              adminRemarks: `Government Directive: ${note}`,
              governmentRemarks: note
            },
            $push: {
              history: {
                action: 'Clarification Requested by Government',
                performedBy: 'Government Authority',
                timestamp: `${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}, ${new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`,
                note
              }
            }
          }
        );

        await UniversityActivity.create({
          universityCode: uniCode,
          text: `⚠️ Government Authority requested proposal revision for "${res?.title || projectId}": ${note}`,
          type: 'GOVERNMENT_REVISION_REQUESTED',
          timestamp: new Date()
        });
      }

      // Handle Government Grant Sanction & Fund Disbursal
      if (updateData.budgetStatus === 'Grant Sanctioned by Government') {
        const approvalId = `APP-${res?.projectId || projectId || ''}`;
        const orderNo = updateData.sanctionOrderNo || 'JH-GOV-RD-2026-8842';
        const grantAmt = updateData.sanctionedBudget || updateData.budget || '₹ 75,000';

        await UniversityApproval.findOneAndUpdate(
          { approvalId },
          {
            $set: {
              status: 'Approved',
              sanctionOrderNo: orderNo,
              sanctionedBudget: grantAmt,
              adminRemarks: `Grant Sanctioned under Sanction Order ${orderNo}`
            },
            $push: {
              history: {
                action: 'Grant Sanctioned & Disbursed by Government',
                performedBy: 'State Innovation Council (Govt of Jharkhand)',
                timestamp: `${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}, ${new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`,
                note: `Sanction Order ${orderNo} approved for ${grantAmt}. Escrow funds active.`
              }
            }
          }
        );

        await UniversityActivity.create({
          universityCode: uniCode,
          text: `🏛️ Grant sanctioned and funds released under Order ${orderNo} for "${res?.title || projectId}" (${grantAmt}).`,
          type: 'GRANT_SANCTIONED_BY_GOVERNMENT',
          timestamp: new Date()
        });
      }

      if (res) return res;
    } catch (err) { }
    return { projectId, ...updateData };
  }

  async assignFacultyToProject(universityCode, projectId, facultyInfo) {
    const query =
      typeof projectId === 'string' && projectId.match(/^[0-9a-fA-F]{24}$/)
        ? { _id: projectId }
        : { projectId };

    try {
      const existingProj = await UniversityProject.findOne(query).lean();
      const chlId = existingProj?.challengeId;

      const milestones = existingProj?.milestones?.length
        ? existingProj.milestones.map((m, idx) => {
          if (idx === 0) return { ...m, status: 'Completed', completedAt: m.completedAt || new Date() };
          if (idx === 1) return { ...m, status: 'Completed', title: `Lead Faculty Mentor Assigned (${facultyInfo.name})`, completedAt: new Date() };
          if (idx === 2 && m.status !== 'Completed') return { ...m, status: 'In Progress' };
          return m;
        })
        : [
          { id: 1, title: 'Problem Statement Allocated & Scoped', status: 'Completed', dueDate: 'N/A', completedAt: new Date() },
          { id: 2, title: `Lead Faculty Mentor Assigned (${facultyInfo.name})`, status: 'Completed', dueDate: 'N/A', completedAt: new Date() },
          { id: 3, title: 'Faculty Solution Analysis & Budget Proposal', status: 'In Progress', dueDate: 'N/A' },
          { id: 4, title: 'University Review & Submission to Government', status: 'Pending', dueDate: 'N/A' },
          { id: 5, title: 'Government Budget Sanction & Grant Disbursal', status: 'Pending', dueDate: 'N/A' },
          { id: 6, title: 'Prototype Development & Field Testing', status: 'Pending', dueDate: 'N/A' },
          { id: 7, title: 'Government Handover & Final Audit', status: 'Pending', dueDate: 'N/A' }
        ];

      const completedCount = milestones.filter((m) => m.status === 'Completed' || m.status === 'COMPLETED').length;
      const progressPercentage = Math.round((completedCount / (milestones.length || 7)) * 100);

      const res = await UniversityProject.findOneAndUpdate(
        query,
        {
          $set: {
            leadMentor: facultyInfo.name,
            facultyMentor: {
              name: facultyInfo.name,
              department: facultyInfo.department || 'Engineering',
              email: facultyInfo.email || '',
              designation: facultyInfo.designation || 'Lead Faculty Mentor'
            },
            status: 'In Progress',
            progressPercentage,
            milestonesCompleted: completedCount,
            milestones,
            updatedAt: new Date()
          }
        },
        { new: true }
      );

      // 1. Update Faculty in database
      if (facultyInfo?.email || facultyInfo?.name) {
        await UniversityFaculty.findOneAndUpdate(
          { $or: [{ email: facultyInfo.email }, { name: facultyInfo.name }] },
          {
            $set: { availabilityStatus: 'In Project' },
            $inc: { activeProjects: 1 },
            $addToSet: {
              assignedChallenges: {
                challengeId: chlId || existingProj?.projectId || projectId,
                title: existingProj?.title || 'R&D Innovation Project',
                role: 'Lead Project Mentor'
              }
            }
          }
        );
      }

      // 2. Cross-sync to UniversityChallenge if exists
      if (chlId) {
        await UniversityChallenge.findOneAndUpdate(
          { challengeId: chlId },
          {
            $set: {
              assignedFaculty: {
                name: facultyInfo.name,
                department: facultyInfo.department || 'Engineering',
                email: facultyInfo.email || ''
              },
              status: 'Accepted'
            }
          }
        );

        // 3. Cross-sync to CitizenChallenge in database
        const uniDoc = await MongooseUniversity.findOne({ code: (universityCode || '').toUpperCase() }).lean();
        const resolvedUniName = uniDoc?.name || uniDoc?.legalName || universityCode || 'Assigned University';

        await CitizenChallenge.findOneAndUpdate(
          { challengeId: chlId },
          {
            $set: {
              status: 'In Progress',
              'assignedUniversity.id': universityCode,
              'assignedUniversity.name': resolvedUniName,
              'assignedUniversity.mentorName': facultyInfo.name,
              'assignedUniversity.department': facultyInfo.department || 'Engineering',
              'assignedUniversity.acceptanceStatus': 'Accepted',
              'milestones.2.status': 'COMPLETED',
              'milestones.2.completedAt': new Date(),
              'milestones.2.remarks': `Assigned to Lead Faculty Mentor: ${facultyInfo.name} (${facultyInfo.department || 'R&D Lab'}) at ${resolvedUniName}`,
              'milestones.3.status': 'CURRENT',
              'milestones.3.remarks': `Faculty Mentor ${facultyInfo.name} leading solution execution and prototyping.`
            }
          }
        );
      }

      return res || existingProj;
    } catch (err) {
      console.error('Error assigning faculty to project:', err);
      return { projectId, ...facultyInfo };
    }
  }

  async deleteProject(universityCode, projectId, deletedBy = 'University Admin') {
    const query =
      typeof projectId === 'string' && projectId.match(/^[0-9a-fA-F]{24}$/)
        ? { _id: projectId }
        : { projectId };
    try {
      const res = await UniversityProject.findOneAndUpdate(
        query,
        { $set: { isDeleted: true, deletedBy, deletedAt: new Date(), status: 'Archived' } },
        { new: true }
      );
      if (res) return res;
    } catch (err) { }
    return { success: true, projectId };
  }

  async getFacultyByUniversity(universityCode) {
    const rawCode = (universityCode || '').trim();
    const uniDoc = await this.findUniversityByCodeOrId(rawCode);
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
    } catch (err) {
      return [];
    }
  }

  async createFaculty(universityCode, facultyData) {
    const rawCode = (universityCode || '').trim();
    const uniDoc = await this.findUniversityByCodeOrId(rawCode);
    const code = (uniDoc?.code || rawCode).toUpperCase();
    const cleanEmail = (facultyData.email || '').trim().toLowerCase();
    const cleanName = (facultyData.name || '').trim();
    const cleanPhone = (facultyData.phone || '+91 98765 43210').trim();
    const password = facultyData.password || 'Faculty@123456';
    const passwordHash = await bcrypt.hash(password, 12);

    try {
      // 1. Create or Update User account in users collection for authentication
      let userAccount = await User.findOne({ email: cleanEmail });
      if (!userAccount) {
        userAccount = await User.create({
          fullName: cleanName,
          email: cleanEmail,
          mobileNumber: cleanPhone.replace(/[^0-9]/g, '').slice(-10) || `98${Math.floor(10000000 + Math.random() * 90000000)}`,
          passwordHash,
          role: 'FACULTY',
          accountStatus: 'ACTIVE',
          emailVerification: { verified: true, verifiedAt: new Date() },
          profile: {
            institutionName: uniDoc?.name || 'Ranchi University',
            aisheCode: uniDoc?.aisheCode || code,
            universityCode: code,
            department: facultyData.department || 'Engineering',
            designation: facultyData.designation || 'Associate Professor'
          }
        });
      } else {
        await User.findByIdAndUpdate(userAccount._id, {
          $set: {
            fullName: cleanName,
            passwordHash,
            role: 'FACULTY',
            accountStatus: 'ACTIVE',
            emailVerification: { verified: true, verifiedAt: new Date() },
            'profile.universityCode': code,
            'profile.department': facultyData.department || 'Engineering'
          }
        });
      }

      // 2. Create or Update UniversityFaculty in university_faculty collection
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
        status: 'Active',
        availabilityStatus: facultyData.availabilityStatus || 'Available'
      };

      if (existingFac) {
        const updated = await UniversityFaculty.findByIdAndUpdate(
          existingFac._id,
          { $set: facultyPayload },
          { new: true }
        );
        return updated.toObject ? updated.toObject() : updated;
      }

      const created = await UniversityFaculty.create(facultyPayload);
      return created.toObject ? created.toObject() : created;
    } catch (err) {
      console.warn('Error creating faculty:', err);
      return {
        id: `FAC-${Date.now().toString().slice(-4)}`,
        ...facultyData,
        email: cleanEmail,
        name: cleanName,
        universityCode: code
      };
    }
  }

  async updateFaculty(universityCode, facultyId, updateData) {
    const code = (universityCode || '').toUpperCase();
    try {
      let passwordHash = undefined;
      if (updateData.password) {
        passwordHash = await bcrypt.hash(updateData.password, 12);
        updateData.passwordHash = passwordHash;
      }

      const query =
        facultyId && facultyId.match(/^[0-9a-fA-F]{24}$/)
          ? { _id: facultyId }
          : { $or: [{ name: facultyId }, { email: facultyId }, { facultyId: facultyId }, { id: facultyId }] };

      const updated = await UniversityFaculty.findOneAndUpdate(query, { $set: updateData }, { new: true });

      // Synchronize User password if updated
      const facEmail = updated?.email || updateData.email;
      if (facEmail && passwordHash) {
        await User.findOneAndUpdate(
          { email: facEmail.toLowerCase() },
          { $set: { passwordHash, accountStatus: 'ACTIVE', 'emailVerification.verified': true } }
        );
      }

      return updated ? updated.toObject() : { _id: facultyId, ...updateData, universityCode: code };
    } catch (err) {
      return { _id: facultyId, ...updateData, universityCode: code };
    }
  }

  async deleteFaculty(universityCode, facultyId) {
    try {
      const query =
        facultyId.match(/^[0-9a-fA-F]{24}$/)
          ? { _id: facultyId }
          : { $or: [{ name: facultyId }, { email: facultyId }] };
      await UniversityFaculty.findOneAndDelete(query);
    } catch (err) { }
    return { success: true, facultyId };
  }

  async getTeamsByUniversity(universityCode) {
    const code = (universityCode || '').toUpperCase();
    try {
      return (await UniversityTeam.find({ universityCode: code }).sort({ teamCode: 1 }).lean()) || [];
    } catch (err) {
      return [];
    }
  }

  async getPartnersByUniversity() {
    try {
      const rawIndustries = await MongooseIndustry.find({}).sort({ createdAt: -1 }).lean();
      if (rawIndustries && rawIndustries.length > 0) {
        return rawIndustries.map((ind) => ({
          _id: ind._id,
          partnerId: ind.industryId || `IND-${ind._id}`,
          name: ind.legalName || 'Government Registered Partner',
          shortName: ind.shortName || ind.legalName,
          logoText: (ind.shortName || ind.legalName || 'IND').slice(0, 3).toUpperCase(),
          type: ind.category || 'Private Industry',
          industryType: ind.category || 'Private Industry',
          committedGrant: ind.financials?.csrCommittedCr ? `₹ ${ind.financials.csrCommittedCr} Cr` : '₹ 0.0 Lakhs',
          grantAmount: ind.financials?.csrCommittedCr ? `₹ ${ind.financials.csrCommittedCr} Cr` : '₹ 0.0 Lakhs',
          focusArea: ind.thematicDomain || 'Technology & Innovation',
          domains: ind.thematicDomains?.length ? ind.thematicDomains : [ind.thematicDomain || 'Technology'],
          supportOffered: ind.supportModes?.length ? ind.supportModes : [],
          activeProjectsCount: ind.financials?.supportedProjectsCount || 0,
          status: ind.status === 'Disabled' ? 'Declined' : ind.status || 'Active',
          mouStatus: ind.verificationStatus === 'Verified' ? 'Active' : 'Pending',
          contactPerson: {
            name: ind.spocName || 'Nodal Officer',
            role: ind.designation || 'Nodal Officer',
            email: ind.officialEmail || ind.credentials?.loginEmail || '',
            phone: ind.mobileNumber || ''
          },
          website: ind.website || '',
          location: ind.address ? `${ind.address.city || ''}, ${ind.address.state || 'Jharkhand'}, India` : 'Jharkhand, India',
          registeredOn: ind.createdAt ? new Date(ind.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '',
          engagementStatus: ind.verificationStatus === 'Verified' ? 'Government Verified Partner' : 'Pending Verification',
          about: ind.legalName ? `${ind.legalName} is an official industry partner registered under Jharkhand State Higher Education.` : ''
        }));
      }
      return (await UniversityPartner.find({}).lean()) || [];
    } catch (err) {
      return [];
    }
  }

  async getApprovalsByUniversity(universityCode) {
    const code = (universityCode || '').toUpperCase();
    try {
      return (await UniversityApproval.find({ universityCode: code }).sort({ date: -1 }).lean()) || [];
    } catch (err) {
      return [];
    }
  }

  async updateApprovalStatus(approvalId, universityCode, status, remarks = '') {
    try {
      const res = await UniversityApproval.findOneAndUpdate(
        { approvalId },
        {
          $set: {
            status,
            adminRemarks: remarks
          },
          $push: {
            history: {
              action: status === 'Approved' ? 'Approved by University Authority' : status === 'Changes Required' ? 'Changes Requested' : 'Rejected',
              performedBy: 'University Nodal Officer',
              timestamp: `${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}, ${new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`,
              note: remarks || (status === 'Approved' ? 'Proposal approved and forwarded to Government for grant sanction.' : 'Review decision updated.')
            }
          }
        },
        { new: true }
      );

      // Update corresponding project status, remarks & advance lifecycle
      if (res) {
        const projId = res.projectId || approvalId.replace('APP-', '');
        let newBudgetStatus = 'Submitted to University for Review';
        let progressPct = 43;
        let milestonesDone = 3;

        if (status === 'Approved' || status === 'APPROVED') {
          newBudgetStatus = 'Forwarded to Government for Grant Sanction';
          progressPct = 57;
          milestonesDone = 4;
        } else if (status === 'Changes Required') {
          newBudgetStatus = 'Changes Required by University';
        } else if (status === 'Rejected') {
          newBudgetStatus = 'Rejected by University';
        }

        await UniversityProject.findOneAndUpdate(
          { $or: [{ projectId: projId }, { challengeId: projId }] },
          {
            $set: {
              budgetStatus: newBudgetStatus,
              adminRemarks: remarks,
              progressPercentage: progressPct,
              milestonesCompleted: milestonesDone
            }
          }
        );

        await UniversityActivity.create({
          universityCode: (universityCode || 'RU001').toUpperCase(),
          text: `R&D Proposal for "${res.project}" review decision: ${status.toUpperCase()} by University Authority.${remarks ? ` Remarks: "${remarks}"` : ''}`,
          type: status === 'Approved' ? 'PROPOSAL_APPROVED' : 'PROPOSAL_REVIEWED',
          timestamp: new Date()
        });
      }

      if (res) return res;
    } catch (err) { }
    return { approvalId, status };
  }

  async getActivitiesByUniversity(universityCode, limit = 10) {
    const code = (universityCode || '').toUpperCase();
    try {
      return (await UniversityActivity.find({ universityCode: code }).sort({ timestamp: -1 }).limit(limit).lean()) || [];
    } catch (err) {
      return [];
    }
  }

  async clearActivities(universityCode) {
    const code = (universityCode || 'RU001').toUpperCase();
    try {
      await UniversityActivity.deleteMany({ universityCode: code });
      return { success: true, message: 'All activities cleared' };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  async updateChallengeStatus(challengeId, universityCode, status, actionLabel, metadata = {}) {
    try {
      const rawCode = (universityCode || '').trim();
      const uniDoc = await this.findUniversityByCodeOrId(rawCode);
      const resolvedUniName = uniDoc?.name || uniDoc?.legalName || rawCode || 'Assigned University';
      const code = (uniDoc?.code || rawCode).toUpperCase();

      const res = await UniversityChallenge.findOneAndUpdate(
        { challengeId },
        { $set: { status, actionLabel: actionLabel || status, ...metadata } },
        { new: true }
      );

      const isAccepted = status === 'Accepted' || status === 'In Progress';
      const isDeclined = status === 'Rejected' || status === 'Declined';
      const isClarification = status === 'Clarification Requested' || status === 'Under Clarification';
      const isClarified = status === 'Clarified';
      const citizenStatus = isAccepted
        ? 'In Progress'
        : isDeclined
          ? 'Declined'
          : isClarification
            ? 'Clarification Requested'
            : isClarified
              ? 'Clarified'
              : status === 'Resolved'
                ? 'Resolved'
                : 'Under Review';
      const clarQuery = metadata.clarificationQuery || metadata.query || metadata.remarks || metadata.clarification || 'Technical ground parameters / lab reports needed.';
      const reason = metadata.declineReason || metadata.remarks || metadata.query || 'Outside departmental research scope';
      const accStatus = isAccepted
        ? 'Accepted'
        : isDeclined
          ? 'Declined'
          : isClarification
            ? 'Clarification Requested'
            : isClarified
              ? 'Clarified'
              : 'Pending Review';

      const updatePayload = {
        status: citizenStatus,
        'assignedUniversity.acceptanceStatus': accStatus,
        'assignedUniversity.declineReason': isDeclined ? reason : '',
        'acceptanceStatus': accStatus
      };

      if (isClarification) {
        updatePayload['assignedUniversity.clarificationQuery'] = clarQuery;
        updatePayload.clarificationQuery = clarQuery;
        updatePayload.clarificationDate = new Date();
        updatePayload.clarificationStatus = 'PENDING';
      }

      if (isAccepted) {
        updatePayload['milestones.1.status'] = 'COMPLETED';
        updatePayload['milestones.1.completedAt'] = new Date();
        updatePayload['milestones.2.status'] = 'COMPLETED';
        updatePayload['milestones.2.completedAt'] = new Date();
        updatePayload['milestones.2.remarks'] = `Accepted by ${resolvedUniName}. Problem allocation finalized for research and prototyping.`;
        updatePayload['milestones.3.status'] = 'CURRENT';
        updatePayload['milestones.3.remarks'] = `Active solution development and prototyping in progress at ${resolvedUniName}.`;
      } else if (isDeclined) {
        updatePayload['milestones.2.status'] = 'PENDING';
        updatePayload['milestones.2.completedAt'] = null;
        updatePayload['milestones.2.remarks'] = `Declined by ${resolvedUniName}: ${reason}. State Nodal Officer reviewing for immediate reassignment.`;
        updatePayload['milestones.3.status'] = 'PENDING';
        updatePayload['milestones.3.remarks'] = `Awaiting State Nodal reallocation.`;
      } else if (isClarification) {
        updatePayload['milestones.2.status'] = 'CURRENT';
        updatePayload['milestones.2.remarks'] = `Technical clarification requested by ${resolvedUniName}: "${metadata.query || metadata.remarks}". State Nodal Officer in active discussion with institution.`;
      }

      await CitizenChallenge.findOneAndUpdate(
        { challengeId },
        { $set: updatePayload }
      );

      if (res) return res;
    } catch (err) {
      console.warn('Error updating challenge status in DB:', err);
    }
    return { challengeId, status, actionLabel };
  }

  async assignFaculty(challengeId, universityCode, facultyInfo) {
    try {
      const res = await UniversityChallenge.findOneAndUpdate(
        { challengeId },
        { $set: { assignedFaculty: facultyInfo, status: 'Accepted', actionLabel: 'View' } },
        { new: true }
      );
      if (facultyInfo?.email || facultyInfo?.name) {
        await UniversityFaculty.findOneAndUpdate(
          { $or: [{ email: facultyInfo.email }, { name: facultyInfo.name }] },
          { $set: { availabilityStatus: 'In Project' }, $inc: { activeProjects: 1 } }
        );
      }

      const uniDoc = await MongooseUniversity.findOne({ code: (universityCode || '').toUpperCase() }).lean();
      const resolvedUniName = uniDoc?.name || uniDoc?.legalName || universityCode || 'Assigned University';

      // Synchronize Citizen Challenge milestone progression in database
      await CitizenChallenge.findOneAndUpdate(
        { challengeId },
        {
          $set: {
            status: 'In Progress',
            'assignedUniversity.id': universityCode,
            'assignedUniversity.name': resolvedUniName,
            'assignedUniversity.department': facultyInfo.department || 'Engineering & Technology',
            'assignedUniversity.mentorName': facultyInfo.name,
            'assignedUniversity.assignedAt': new Date(),
            'assignedUniversity.acceptanceStatus': 'Accepted',
            'acceptanceStatus': 'Accepted',
            'milestones.2.status': 'COMPLETED',
            'milestones.2.completedAt': new Date(),
            'milestones.2.remarks': `Assigned to Lead Faculty Mentor: ${facultyInfo.name} (${facultyInfo.department || 'Innovation Lab'}) at ${resolvedUniName}`,
            'milestones.3.status': 'CURRENT',
            'milestones.3.remarks': `Faculty Mentor ${facultyInfo.name} leading solution execution.`
          }
        }
      );

      if (res) return res;
    } catch (err) {
      console.warn('Error assigning faculty in DB:', err);
    }
    return { challengeId, assignedFaculty: facultyInfo, status: 'Accepted' };
  }

  async getUniversityProfile(universityCode) {
    const code = (universityCode || '').toUpperCase();
    const uni = await this.findUniversityByCodeOrId(code);
    const [facultyList, teamsList, projectsList] = await Promise.all([
      this.getFacultyByUniversity(code),
      this.getTeamsByUniversity(code),
      this.getProjectsByUniversity(code)
    ]);
    return {
      _id: uni?._id || null,
      name: uni?.name || 'University Profile',
      shortName: uni?.shortName || code,
      code: uni?.code || code,
      aisheCode: uni?.aisheCode || uni?.code || '',
      tagline: uni?.tagline || '',
      about: uni?.about || '',
      universityType: uni?.institutionType || 'University',
      establishmentYear: uni?.establishmentYear || null,
      website: uni?.website || '',
      universityEmail: uni?.universityEmail || '',
      universityPhone: uni?.universityPhone || '',
      accreditation: uni?.accreditation || {},
      address: uni?.address || { campus: '', district: uni?.district || '', state: 'Jharkhand', pincode: '' },
      stats: {
        facultyMembers: facultyList.length,
        students: teamsList.reduce((acc, t) => acc + (t.membersCount || 0), 0),
        activeTeams: teamsList.length,
        activeProjects: projectsList.filter((p) => p.status !== 'Completed' && p.status !== 'Archived').length,
        completedProjects: projectsList.filter((p) => p.status === 'Completed').length
      },
      departments: uni?.departments || [],
      researchAreas: uni?.researchAreas || [],
      facilities: uni?.facilities || [],
      status: uni?.status || 'Active',
      isVerified: uni?.verificationStatus === 'Verified'
    };
  }

  async updateUniversityProfile(universityCode, updateData, user) {
    const code = (universityCode || '').toUpperCase();
    if (this.isDbReady()) {
      try {
        await MongooseUniversity.findOneAndUpdate({ code }, { $set: updateData }, { new: true });
      } catch (err) { }
    }
    return await this.getUniversityProfile(code);
  }
}

export const universityDashboardRepository = new UniversityDashboardRepository();
export default universityDashboardRepository;
