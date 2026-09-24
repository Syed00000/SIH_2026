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
        let noRecordReply = `Aap kaun si samasya ko ${actionLabel} karna chahte hain? Kripya uski **Problem ID** (jaise **CHL-JH-2026-XXXX**) batayein.`;
        if (effectiveLang === 'hi') {
          noRecordReply = `आप किस समस्या को ${isDelete ? 'हटाना (Delete)' : 'वापस लेना (Withdraw)'} चाहते हैं? कृपया उसकी **Problem ID** (जैसे **CHL-JH-2026-XXXX**) बताएं।`;
        } else if (effectiveLang === 'en') {
          noRecordReply = `Which complaint would you like to ${isDelete ? 'delete' : 'withdraw'}? Please provide its **Problem ID** (e.g. **CHL-JH-2026-XXXX**).`;
        }
        return {
          reply: noRecordReply,
          intent: isDelete ? 'DELETE_PROBLEM_NEED_ID' : 'WITHDRAW_PROBLEM_NEED_ID',
          selectedLanguage: effectiveLang
        };
      }
      if (candidates.length === 1) {
        challenge = candidates[0];
      } else {
        const lines = candidates.map((c, i) => `${i + 1}. 📋 **${c.challengeId}**: ${c.title} (${c.status})`);
        let chooseReply = `Aapke account mein nimn samasyaayein darj hain, aap kise ${actionLabel} karna chahte hain?${BUBBLE_DELIMITER}${lines.join('\n')}${BUBBLE_DELIMITER}Kripya uski **Problem ID** batayein!`;
        if (effectiveLang === 'hi') {
          chooseReply = `आपके खाते में निम्न शिकायतें दर्ज हैं, आप किसे ${isDelete ? 'हटाना' : 'वापस लेना'} चाहते हैं?${BUBBLE_DELIMITER}${lines.join('\n')}${BUBBLE_DELIMITER}कृपया उसकी **Problem ID** बताएं!`;
        } else if (effectiveLang === 'en') {
          chooseReply = `The following complaints are registered under your account:${BUBBLE_DELIMITER}${lines.join('\n')}${BUBBLE_DELIMITER}Which Problem ID would you like to select?`;
        }
        return {
          reply: chooseReply,
          intent: isDelete ? 'DELETE_PROBLEM_CHOOSE' : 'WITHDRAW_PROBLEM_CHOOSE',
          challengesList: candidates.map(c => ({ challengeId: c.challengeId, title: c.title, status: c.status })),
          selectedLanguage: effectiveLang
        };
      }
    }

    // 2. Check if already Withdrawn
    if (!isDelete && challenge.status === 'Withdrawn') {
      let alreadyWithdrawnReply = `Bhai ji, samasya **${challenge.challengeId}** pehle se hi wapas (Withdrawn) li ja chuki hai.${BUBBLE_DELIMITER}Ispe abhi koi aage karyawahi nahi chal rahi hai. Kisi aur samasya ke liye mujhe zaroor batayein!`;
      if (effectiveLang === 'hi') {
        alreadyWithdrawnReply = `समस्या **${challenge.challengeId}** पहले से ही वापस (Withdrawn) ली जा चुकी है।${BUBBLE_DELIMITER}इस पर वर्तमान में कोई विभागीय कार्रवाई सक्रिय नहीं है। किसी अन्य समस्या के लिए हमें अवश्य बताएं!`;
      } else if (effectiveLang === 'en') {
        alreadyWithdrawnReply = `Problem **${challenge.challengeId}** has already been withdrawn.${BUBBLE_DELIMITER}No active departmental review is ongoing. Please let us know if you need assistance with any other issue!`;
      }
      return {
        reply: alreadyWithdrawnReply,
        intent: 'WITHDRAW_PROBLEM_ALREADY_WITHDRAWN',
        withdrawnChallenge: { challengeId: challenge.challengeId, title: challenge.title, status: 'Withdrawn' },
        selectedLanguage: effectiveLang
      };
    }

    // 3. Strict Pre-Assignment Check
    const assigned = isChallengeAssigned(challenge);
    if (assigned) {
      const assignedEntity = challenge.assignedDepartment?.name || challenge.assignedTechnician?.name || challenge.assignedNodalOfficer?.name || 'Line Department';
      const blockedPrompt = `FACTS: Problem ID ${challenge.challengeId} is assigned to ${assignedEntity} and field work is active. Action ${actionLabel} is blocked by govt charter rules to protect accountability.
Explain this respectfully to the citizen in ${effectiveLang} across 2 bubbles separated by "${BUBBLE_DELIMITER}".
CRITICAL LANGUAGE: If ${effectiveLang} is 'hi', reply ONLY in 100% pure Devanagari Hindi (हिन्दी). If 'en', reply ONLY in English. Do NOT say Namaste.`;

      const aiReply = await aiClient.generateCompletion([
        { role: 'system', content: languageManager.getRespectfulSystemPrompt(effectiveLang, hasHistory) },
        { role: 'user', content: blockedPrompt }
      ], 450, 0.3);

      let fallbackReply = `Bhai ji, samasya **${challenge.challengeId}** ko abhi ${actionLabel} nahi kiya ja sakta.${BUBBLE_DELIMITER}Yeh mamla pehle hi **${assignedEntity}** ko karyawahi ke liye assign ho chuka hai (Status: ${challenge.status}). Sarkari niyam ke anusaar inspection record banaye rakhne ke liye ise cancel nahi kiya ja sakta. Kripya nishchint rahein!`;
      if (effectiveLang === 'hi') {
        fallbackReply = `समस्या **${challenge.challengeId}** को अभी ${isDelete ? 'हटाया' : 'वापस लिया'} नहीं जा सकता।${BUBBLE_DELIMITER}यह प्रकरण पहले ही **${assignedEntity}** को स्थल निरीक्षण व कार्रवाई हेतु आवंटित हो चुका है (स्थिति: ${challenge.status})। सरकारी नियमों के अनुसार चालू निरीक्षण के दौरान शिकायत वापस नहीं ली जा सकती।`;
      } else if (effectiveLang === 'en') {
        fallbackReply = `Problem **${challenge.challengeId}** cannot be ${actionLabel}ed at this stage.${BUBBLE_DELIMITER}This issue has already been assigned to **${assignedEntity}** for active resolution (Status: ${challenge.status}). As per administrative protocols, active assignments cannot be cancelled.`;
      }

      const finalReply = (effectiveLang === 'hi' && aiReply && !/[\u0900-\u097F]/.test(aiReply)) ? fallbackReply : (aiReply || fallbackReply);

      return {
        reply: finalReply,
        intent: isDelete ? 'DELETE_PROBLEM_BLOCKED' : 'WITHDRAW_PROBLEM_BLOCKED',
        trackingData: { challengeId: challenge.challengeId, title: challenge.title, description: challenge.description || '', status: challenge.status, isAssigned: true },
        selectedLanguage: effectiveLang
      };
    }

    // 4. ASK FOR CONFIRMATION FIRST IF NOT EXPLICITLY CONFIRMED
    if (!isExplicitlyConfirmed) {
      const confirmPrompt = `Citizen requested to ${actionLabel} problem **${challenge.challengeId}** (${challenge.title}).
Ask them to confirm this action in ${effectiveLang} across 2 bubbles separated by "${BUBBLE_DELIMITER}".
CRITICAL LANGUAGE: If ${effectiveLang} is 'hi', reply ONLY in 100% pure Devanagari Hindi (हिन्दी). If 'en', reply ONLY in English. Do NOT say Namaste.
- Bubble 1: Ask if they are sure they want to ${actionLabel} problem **${challenge.challengeId}**.
- Bubble 2: Warn them that once ${actionLabel}ed, all departmental action will stop. Ask them to click the confirm button below.`;

      const aiReply = await aiClient.generateCompletion([
        { role: 'system', content: languageManager.getRespectfulSystemPrompt(effectiveLang, hasHistory) },
        { role: 'user', content: confirmPrompt }
      ], 350, 0.3);

      let fallbackReply = `Bhai ji, kya aap waqai samasya **${challenge.challengeId}** ko ${actionLabel} karna chahte hain?${BUBBLE_DELIMITER}Ek baar ${actionLabel} karne ke baad ispe vibhagiye karwayi rok di jayegi. Kripya neeche diye gaye button par tap karke pushti karein!`;
      if (effectiveLang === 'hi') {
        fallbackReply = `क्या आप वाकई समस्या **${challenge.challengeId}** को ${isDelete ? 'स्थायी रूप से हटाना' : 'वापस लेना'} चाहते हैं?${BUBBLE_DELIMITER}एक बार ${isDelete ? 'हटाने' : 'वापस लेने'} के बाद इस पर आगे की सभी विभागीय समीक्षा व कार्रवाई रोक दी जाएगी। कृपया नीचे दिए गए बटन पर टैप करके पुष्टि करें!`;
      } else if (effectiveLang === 'en') {
        fallbackReply = `Are you sure you want to ${isDelete ? 'permanently delete' : 'withdraw'} problem **${challenge.challengeId}**?${BUBBLE_DELIMITER}Once confirmed, all departmental review on this issue will cease. Please tap the confirmation button below!`;
      }

      const finalReply = (effectiveLang === 'hi' && aiReply && !/[\u0900-\u097F]/.test(aiReply)) ? fallbackReply : (aiReply || fallbackReply);

      return {
        reply: finalReply,
        intent: isDelete ? 'DELETE_CONFIRMATION_NEEDED' : 'WITHDRAW_CONFIRMATION_NEEDED',
        actionTarget: {
          challengeId: challenge.challengeId,
          title: challenge.title,
          description: challenge.description || '',
          status: challenge.status,
          actionType: isDelete ? 'DELETE' : 'WITHDRAW'
        },
        selectedLanguage: effectiveLang
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
Write a polite confirmation in ${effectiveLang} across 2 bubbles separated by "${BUBBLE_DELIMITER}".
CRITICAL LANGUAGE: If ${effectiveLang} is 'hi', reply ONLY in 100% pure Devanagari Hindi (हिन्दी). If 'en', reply ONLY in English. Do NOT say Namaste.`;

      const aiReply = await aiClient.generateCompletion([
        { role: 'system', content: languageManager.getRespectfulSystemPrompt(effectiveLang, hasHistory) },
        { role: 'user', content: donePrompt }
      ], 350, 0.3);

      let fallbackReply = `Aapke nirdesh par samasya **${challenge.challengeId}** ko ${isDelete ? 'delete' : 'wapas (withdraw)'} kar diya gaya hai.${BUBBLE_DELIMITER}Ab ispe aage koi karwayi nahi hogi. Kisi bhi naye mamle mein hum hamesha aapki madad ke liye taiyaar hain!`;
      if (effectiveLang === 'hi') {
        fallbackReply = `आपके निर्देशानुसार समस्या **${challenge.challengeId}** को आधिकारिक तौर पर ${isDelete ? 'हटा' : 'वापस ले'} लिया गया है।${BUBBLE_DELIMITER}अब इस प्रकरण पर आगे कोई कार्रवाई नहीं होगी। किसी भी नई नागरिक समस्या के लिए हम सदैव आपकी सेवा में तत्पर हैं!`;
      } else if (effectiveLang === 'en') {
        fallbackReply = `As per your instruction, problem **${challenge.challengeId}** has been officially ${isDelete ? 'deleted' : 'withdrawn'}.${BUBBLE_DELIMITER}All departmental workflows on this issue have been closed. We remain at your service for any further civic needs!`;
      }

      const finalReply = (effectiveLang === 'hi' && aiReply && !/[\u0900-\u097F]/.test(aiReply)) ? fallbackReply : (aiReply || fallbackReply);

      return {
        reply: finalReply,
        intent: isDelete ? 'DELETE_PROBLEM_SUCCESS' : 'WITHDRAW_PROBLEM_SUCCESS',
        deletedChallengeId: isDelete ? challenge.challengeId : null,
        withdrawnChallenge: isDelete ? null : { challengeId: challenge.challengeId, title: challenge.title, status: 'Withdrawn' },
        selectedLanguage: effectiveLang
      };
    } catch (err) {
      logger.error({ msg: 'Action failed', err: err.message });
      return {
        reply: `Samasya ${actionLabel} karne mein truti aayi: ${err.message}`,
        intent: `${isDelete ? 'DELETE' : 'WITHDRAW'}_PROBLEM_ERROR`,
        selectedLanguage: effectiveLang
      };
    }
  }
}

export const challengeWithdrawDelete = new ChallengeWithdrawDelete();
