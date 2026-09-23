import mongoose from 'mongoose';
import { CitizenChallenge } from '../../../infrastructure/model.js';
import { citizenService } from '../../service.js';
import { isChallengeAssigned } from '../challenge-triage.service.js';
import { aiClient } from './ai-client.js';
import { languageManager } from './language-manager.js';
import { BUBBLE_DELIMITER } from './constants.js';
import logger from '../../../../../shared/logger/index.js';

class ChallengeWithdrawDelete {
  async handle({ intent, targetId, rawMessage, user, userProfile, effectiveLang, hasHistory = false }) {
    const isDelete = intent === 'DELETE_PROBLEM';
    const actionLabel = isDelete ? 'delete' : 'withdraw (wapas)';
    const cleanMsg = (rawMessage || '').trim();

    // Check if user has explicitly confirmed the action
    const isExplicitlyConfirmed =
      cleanMsg.startsWith('CONFIRM_WITHDRAW:') ||
      cleanMsg.startsWith('CONFIRM_DELETE:') ||
      /\b(confirm withdraw|haan withdraw|pakka withdraw|confirm delete|haan delete)\b/i.test(cleanMsg);

    // 1. Locate challenge
    let challenge = null;
    let explicitId = targetId;
    if (cleanMsg.startsWith('CONFIRM_WITHDRAW:')) explicitId = cleanMsg.replace('CONFIRM_WITHDRAW:', '').trim();
    if (cleanMsg.startsWith('CONFIRM_DELETE:')) explicitId = cleanMsg.replace('CONFIRM_DELETE:', '').trim();

    if (explicitId) {
      challenge = await CitizenChallenge.findOne({
        challengeId: new RegExp(`^${explicitId.trim()}$`, 'i'),
        isDeleted: false
      }).lean();
    }

    if (!challenge) {
      const queryOr = [];
      const uid = user?.id || user?._id;
      if (uid && mongoose.isValidObjectId(uid)) queryOr.push({ citizenId: uid });
      if (userProfile?.email && userProfile.email !== 'citizen@joharsetu.jharkhand.gov.in') {
        queryOr.push({ 'submitter.email': userProfile.email });
      }
      if (user?.email && user.email !== 'citizen@joharsetu.jharkhand.gov.in') {
        queryOr.push({ 'submitter.email': user.email });
      }
      if (userProfile?.mobileNumber && userProfile.mobileNumber !== '9800000000') {
        queryOr.push({ 'submitter.mobileNumber': userProfile.mobileNumber });
      }
      if (user?.mobileNumber && user.mobileNumber !== '9800000000') {
        queryOr.push({ 'submitter.mobileNumber': user.mobileNumber });
      }
      const phoneInMsg = (cleanMsg.match(/\b[6-9]\d{9}\b/) || [])[0];
      if (phoneInMsg) queryOr.push({ 'submitter.mobileNumber': phoneInMsg });

      const candidates = queryOr.length > 0
        ? await CitizenChallenge.find({ $or: queryOr, isDeleted: false }).sort({ createdAt: -1 }).limit(10).lean()
        : [];

      if (candidates.length === 0) {
        return {
          reply: `Aap kaun si samasya ko ${actionLabel} karna chahte hain? Kripya uski **Problem ID** (jaise **CHL-JH-2026-XXXX**) batayein.`,
          intent: isDelete ? 'DELETE_PROBLEM_NEED_ID' : 'WITHDRAW_PROBLEM_NEED_ID'
        };
      }
      if (candidates.length === 1) {
        challenge = candidates[0];
      } else {
        const lines = candidates.map((c, i) => `${i + 1}. 📋 **${c.challengeId}**: ${c.title} (${c.status})`);
        return {
          reply: `Aapke account mein nimn samasyaayein darj hain, aap kise ${actionLabel} karna chahte hain?${BUBBLE_DELIMITER}${lines.join('\n')}${BUBBLE_DELIMITER}Kripya uski **Problem ID** batayein!`,
          intent: isDelete ? 'DELETE_PROBLEM_CHOOSE' : 'WITHDRAW_PROBLEM_CHOOSE',
          challengesList: candidates.map(c => ({ challengeId: c.challengeId, title: c.title, status: c.status }))
        };
      }
    }

    // 2. Check if already Withdrawn
    if (!isDelete && challenge.status === 'Withdrawn') {
      return {
        reply: `Bhai ji, samasya **${challenge.challengeId}** pehle se hi wapas (Withdrawn) li ja chuki hai.${BUBBLE_DELIMITER}Ispe abhi koi aage karyawahi nahi chal rahi hai. Kisi aur samasya ke liye mujhe zaroor batayein!`,
        intent: 'WITHDRAW_PROBLEM_ALREADY_WITHDRAWN',
        withdrawnChallenge: { challengeId: challenge.challengeId, title: challenge.title, status: 'Withdrawn' }
      };
    }

    // 3. Strict Pre-Assignment Check
    const assigned = isChallengeAssigned(challenge);
    if (assigned) {
      const assignedEntity = challenge.assignedDepartment?.name || challenge.assignedTechnician?.name || challenge.assignedNodalOfficer?.name || 'Line Department';
      const blockedPrompt = `FACTS: Problem ID ${challenge.challengeId} is assigned to ${assignedEntity} and field work is active. Action ${actionLabel} is blocked by govt charter rules to protect accountability.
Explain this respectfully to the citizen in ${effectiveLang} across 2 bubbles separated by "${BUBBLE_DELIMITER}". Do NOT say Namaste.`;

      const aiReply = await aiClient.generateCompletion([
        { role: 'system', content: languageManager.getRespectfulSystemPrompt(effectiveLang, hasHistory) },
        { role: 'user', content: blockedPrompt }
      ], 450, 0.3);

      const fallbackReply = `Bhai ji, samasya **${challenge.challengeId}** ko abhi ${actionLabel} nahi kiya ja sakta.${BUBBLE_DELIMITER}Yeh mamla pehle hi **${assignedEntity}** ko karyawahi ke liye assign ho chuka hai (Status: ${challenge.status}). Sarkari niyam ke anusaar inspection record banaye rakhne ke liye ise cancel nahi kiya ja sakta. Kripya nishchint rahein!`;

      return {
        reply: aiReply || fallbackReply,
        intent: isDelete ? 'DELETE_PROBLEM_BLOCKED' : 'WITHDRAW_PROBLEM_BLOCKED',
        trackingData: { challengeId: challenge.challengeId, title: challenge.title, description: challenge.description || '', status: challenge.status, isAssigned: true }
      };
    }

    // 4. ASK FOR CONFIRMATION FIRST IF NOT EXPLICITLY CONFIRMED
    if (!isExplicitlyConfirmed) {
      const confirmPrompt = `Citizen requested to ${actionLabel} problem **${challenge.challengeId}** (${challenge.title}).
Ask them to confirm this action in ${effectiveLang} across 2 bubbles separated by "${BUBBLE_DELIMITER}". Do NOT say Namaste.
- Bubble 1: Ask if they are sure they want to ${actionLabel} problem **${challenge.challengeId}**.
- Bubble 2: Warn them that once ${actionLabel}ed, all departmental action will stop. Ask them to click 'Confirm' below or say yes.`;

      const aiReply = await aiClient.generateCompletion([
        { role: 'system', content: languageManager.getRespectfulSystemPrompt(effectiveLang, hasHistory) },
        { role: 'user', content: confirmPrompt }
      ], 350, 0.3);

      const fallbackReply = `Bhai ji, kya aap waqai samasya **${challenge.challengeId}** ko ${actionLabel} karna chahte hain?${BUBBLE_DELIMITER}Ek baar ${actionLabel} karne ke baad ispe vibhagiye karwayi rok di jayegi. Kripya neeche diye gaye button par tap karke pushti karein!`;

      return {
        reply: aiReply || fallbackReply,
        intent: isDelete ? 'DELETE_CONFIRMATION_NEEDED' : 'WITHDRAW_CONFIRMATION_NEEDED',
        actionTarget: {
          challengeId: challenge.challengeId,
          title: challenge.title,
          description: challenge.description || '',
          status: challenge.status,
          actionType: isDelete ? 'DELETE' : 'WITHDRAW'
        }
      };
    }

    // 5. Execute Confirmed Delete or Withdraw
    try {
      if (isDelete) {
        await citizenService.deleteChallenge(challenge.challengeId, user?.fullName || 'Citizen');
      } else {
        await citizenService.withdrawChallenge(challenge.challengeId, 'Withdrawn by citizen via AI', user);
      }

      const donePrompt = `FACTS: Problem ${challenge.challengeId} (${challenge.title}) has been officially ${isDelete ? 'deleted' : 'withdrawn'}.
Write a polite confirmation in ${effectiveLang} across 2 bubbles separated by "${BUBBLE_DELIMITER}". Do NOT say Namaste.`;

      const aiReply = await aiClient.generateCompletion([
        { role: 'system', content: languageManager.getRespectfulSystemPrompt(effectiveLang, hasHistory) },
        { role: 'user', content: donePrompt }
      ], 350, 0.3);

      const fallbackReply = `Aapke nirdesh par samasya **${challenge.challengeId}** ko ${isDelete ? 'delete' : 'wapas (withdraw)'} kar diya gaya hai.${BUBBLE_DELIMITER}Ab ispe aage koi karwayi nahi hogi. Kisi bhi naye mamle mein hum hamesha aapki madad ke liye taiyaar hain!`;

      return {
        reply: aiReply || fallbackReply,
        intent: isDelete ? 'DELETE_PROBLEM_SUCCESS' : 'WITHDRAW_PROBLEM_SUCCESS',
        deletedChallengeId: isDelete ? challenge.challengeId : null,
        withdrawnChallenge: isDelete ? null : { challengeId: challenge.challengeId, title: challenge.title, status: 'Withdrawn' }
      };
    } catch (err) {
      logger.error({ msg: 'Action failed', err: err.message });
      return { reply: `Samasya ${actionLabel} karne mein truti aayi: ${err.message}`, intent: `${isDelete ? 'DELETE' : 'WITHDRAW'}_PROBLEM_ERROR` };
    }
  }
}

export const challengeWithdrawDelete = new ChallengeWithdrawDelete();
