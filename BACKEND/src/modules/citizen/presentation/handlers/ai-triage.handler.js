import mongoose from 'mongoose';
import { challengeIntelligenceService } from '../../../../infrastructure/ai/challenge-intelligence.service.js';
import logger from '../../../../shared/logger/index.js';
import { NotFoundError } from '../../../../shared/errors/AppError.js';

export const createAiTriageHandler = (citizenService) => {
  const findChallenge = async (id) => {
    const isObjectId = mongoose.Types.ObjectId.isValid(id);
    const query = isObjectId ? { $or: [{ _id: id }, { challengeId: id }] } : { challengeId: id };
    return mongoose.connection.db.collection('citizen_challenges').findOne(query);
  };

  const analyzeChallenge = async (req, res, next) => {
    try {
      const { id } = req.params;
      logger.info({ msg: 'Triggering AI analysis for challenge', id });

      const challenge = await findChallenge(id);
      if (!challenge) throw new NotFoundError(`Challenge ${id} not found`);

      const aiIntelligence = await challengeIntelligenceService.analyzeChallenge(challenge);

      res.status(200).json({
        success: true,
        message: 'AI intelligence generated successfully',
        data: aiIntelligence
      });
    } catch (error) {
      logger.error({ msg: 'AI analysis failed', error: error.message });
      next(error);
    }
  };

  const applyRecommendation = async (req, res, next) => {
    try {
      const { id } = req.params;
      const { type, department, university, remarks } = req.body;
      const user = req.user || { name: 'State Nodal Officer', role: 'NODAL' };

      const challenge = await findChallenge(id);
      if (!challenge) throw new NotFoundError(`Challenge ${id} not found`);

      let triagePayload = {};

      if (type === 'department' && department) {
        const isWardLevel = department.category === 'Ward Commissioner' || department.code?.startsWith('WARD');
        const isBlockLevel = department.category === 'Block / Tehsil Office' || department.code?.startsWith('BLK');

        triagePayload = {
          assignedDepartment: {
            id: department.id || '',
            name: department.name,
            code: department.code || 'JH-DEPT',
            category: department.category || (isWardLevel ? 'Ward Commissioner' : isBlockLevel ? 'Block / Tehsil Office' : 'District Department'),
            instructions: remarks || '',
            assignedAt: new Date()
          },
          status: 'In Progress',
          remarks: remarks || `Routed to ${department.name} (${department.category || 'Local Department'}) via AI Jurisdiction Triage.`
        };

        if (isWardLevel) {
          triagePayload.assignedWard = {
            name: department.name,
            wardNumber: challenge.location?.panchayatOrWard || 'Local',
            instructions: remarks || 'Dispatched for direct ward field crew inspection and maintenance.',
            district: challenge.location?.district || challenge.district || 'Ranchi'
          };
        } else if (isBlockLevel) {
          triagePayload.assignedBlock = {
            name: department.name,
            blockId: challenge.location?.block || 'Block',
            instructions: remarks || 'Dispatched for block office inspection.',
            district: challenge.location?.district || challenge.district || 'Ranchi'
          };
        }
      } else if (type === 'university' && university) {
        triagePayload = {
          assignedUniversity: {
            id: university.id || '',
            name: university.name,
            code: university.code || 'JH-HEI',
            department: university.department || 'Innovation Lab',
            assignedAt: new Date(),
            acceptanceStatus: 'Pending Review'
          },
          status: 'Under Review',
          remarks: remarks || `Allocated to ${university.name} via AI Research & Innovation Matching.`
        };
      }

      const updated = await citizenService.triageChallenge(challenge.challengeId || challenge._id, triagePayload, user);

      // Real-time notification to citizen & nodal desk
      try {
        const { getSocketIO } = await import('../../../../infrastructure/socket/socketServer.js');
        const io = getSocketIO();
        if (io) {
          io.emit('challenge_updated', {
            challengeId: challenge.challengeId,
            status: triagePayload.status,
            assignedDepartment: triagePayload.assignedDepartment,
            assignedUniversity: triagePayload.assignedUniversity
          });
          if (challenge.citizenId) {
            io.to(`user_${challenge.citizenId}`).emit('citizen_notification', {
              title: type === 'department' ? 'Department Assigned' : 'University Innovation Matched',
              message: `Your challenge has been routed to ${type === 'department' ? department.name : university.name} by State Nodal Cell.`
            });
          }
        }
      } catch (sockErr) {
        logger.warn({ msg: 'Socket notification failed on ai-apply', error: sockErr.message });
      }

      res.status(200).json({
        success: true,
        message: `AI recommendation (${type}) applied successfully`,
        data: updated
      });
    } catch (error) {
      logger.error({ msg: 'Failed to apply AI recommendation', error: error.message });
      next(error);
    }
  };

  const markDuplicate = async (req, res, next) => {
    try {
      const { id } = req.params;
      const { targetChallengeId, action = 'REJECT', citizenNotice } = req.body;
      const user = req.user || { name: 'State Nodal Officer', role: 'NODAL' };

      const challenge = await findChallenge(id);
      if (!challenge) throw new NotFoundError(`Challenge ${id} not found`);

      const noticeMessage =
        citizenNotice ||
        `This problem has been identified as a duplicate of registered issue [${targetChallengeId}]. Active remediation is underway for the area.`;

      const newStatus = action === 'RESOLVE' ? 'Resolved' : 'Rejected';

      const updateResult = await mongoose.connection.db.collection('citizen_challenges').findOneAndUpdate(
        { challengeId: challenge.challengeId },
        {
          $set: {
            status: newStatus,
            'aiIntelligence.deduplication.isDuplicate': true,
            'aiIntelligence.deduplication.matchedChallengeId': targetChallengeId,
            'aiIntelligence.deduplication.resolutionAction': action,
            'aiIntelligence.deduplication.citizenNotice': noticeMessage,
            'aiIntelligence.deduplication.resolvedAt': new Date(),
            updatedAt: new Date()
          },
          $push: {
            milestones: {
              step: (challenge.milestones?.length || 0) + 1,
              title: `Closed as Duplicate (${targetChallengeId})`,
              description: noticeMessage,
              status: 'COMPLETED',
              updatedBy: user.name || 'State Nodal Officer',
              remarks: `Consolidated with primary issue ${targetChallengeId}`,
              completedAt: new Date()
            }
          }
        },
        { returnDocument: 'after' }
      );

      // Real-time socket notification for duplicate resolution
      try {
        const { getSocketIO } = await import('../../../../infrastructure/socket/socketServer.js');
        const io = getSocketIO();
        if (io) {
          io.emit('challenge_updated', {
            challengeId: challenge.challengeId,
            status: newStatus,
            duplicateOf: targetChallengeId
          });
          if (challenge.citizenId) {
            io.to(`user_${challenge.citizenId}`).emit('citizen_notification', {
              title: action === 'RESOLVE' ? 'Challenge Consolidated' : 'Duplicate Submission Closed',
              message: noticeMessage
            });
          }
        }
      } catch (sockErr) {
        logger.warn({ msg: 'Socket notification failed on mark-duplicate', error: sockErr.message });
      }

      res.status(200).json({
        success: true,
        message: `Issue marked as duplicate of ${targetChallengeId} and citizen notified`,
        data: updateResult.value || updateResult
      });
    } catch (error) {
      logger.error({ msg: 'Failed to mark challenge as duplicate', error: error.message });
      next(error);
    }
  };

  const batchSync = async (req, res, next) => {
    try {
      logger.info('Starting batch AI vector sync and intelligence generation...');
      const results = await challengeIntelligenceService.syncAllChallenges();
      res.status(200).json({
        success: true,
        message: `Indexed and generated intelligence for ${results.length} challenges`,
        data: results
      });
    } catch (error) {
      logger.error({ msg: 'Batch sync failed', error: error.message });
      next(error);
    }
  };

  return {
    analyzeChallenge,
    applyRecommendation,
    markDuplicate,
    batchSync
  };
};

export default createAiTriageHandler;
