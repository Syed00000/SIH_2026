import mongoose from 'mongoose';
import { CitizenChallenge } from '../../../infrastructure/model.js';
import { isChallengeAssigned } from '../challenge-triage.service.js';
import { aiClient } from './ai-client.js';
import { languageManager } from './language-manager.js';
import { BUBBLE_DELIMITER } from './constants.js';

class ChallengeTracker {
  async track({ targetId, rawMessage, effectiveLang, user, userProfile, hasHistory = false }) {
    // 1. If explicit ID provided
    if (targetId) {
      const challenge = await CitizenChallenge.findOne({
        challengeId: new RegExp(`^${targetId.trim()}$`, 'i'),
        isDeleted: false
      }).lean();

      if (challenge) {
        return await this.generateTrackingResponse({ challenge, effectiveLang, rawMessage, hasHistory });
      }

      const notFoundPrompt = `The citizen asked to track problem ID **${targetId}**, but no record was found in the database.
Write a polite, respectful reply in ${effectiveLang} addressing them as 'Aap' or 'Bhai ji' across 2 short bubbles separated by "${BUBBLE_DELIMITER}". Do NOT say Namaste.
- Bubble 1: Politely explain that no complaint was found matching **${targetId}**.
- Bubble 2: Ask them to double-check their Problem ID, or tell you the date / registered phone number so you can locate their file.`;

      const aiReply = await aiClient.generateCompletion([
        { role: 'system', content: languageManager.getRespectfulSystemPrompt(effectiveLang, hasHistory) },
        { role: 'user', content: notFoundPrompt }
      ], 350, 0.3);

      const fallbackReply = `Aapki di gayi Problem ID **${targetId}** ke sath koi shikayat darj nahi mili.${BUBBLE_DELIMITER}Kripya ID dobara jaanch lein ya submit karne ki tareekh / registered mobile number batayein!`;

      return {
        reply: aiReply || fallbackReply,
        intent: 'TRACK_PROBLEM',
        trackingData: null
      };
    }

    // 2. Search for user's challenges safely without CastError
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
    const phoneInMsg = (rawMessage.match(/\b[6-9]\d{9}\b/) || [])[0];
    if (phoneInMsg) queryOr.push({ 'submitter.mobileNumber': phoneInMsg });

    let challenges = [];
    if (queryOr.length > 0) {
      challenges = await CitizenChallenge.find({ $or: queryOr, isDeleted: false })
        .sort({ createdAt: -1 })
        .limit(10)
        .lean();
    }

    if (challenges.length === 1) {
      return await this.generateTrackingResponse({ challenge: challenges[0], effectiveLang, rawMessage, hasHistory });
    }

    if (challenges.length > 1) {
      return this.formatChallengeList(challenges, effectiveLang);
    }

    const askIdPrompt = `The citizen wants to track their civic problem, but did not specify a Problem ID or phone number.
Write a respectful, polite request in ${effectiveLang} addressing them as 'Aap' or 'Bhai ji' across 2 short bubbles separated by "${BUBBLE_DELIMITER}". Do NOT say Namaste.
- Bubble 1: Politely ask them for their **Problem ID** (e.g. **CHL-JH-2026-XXXX**).
- Bubble 2: Mention that they can also provide their registered phone number or submission date so you can look up their live status.`;

    const aiAsk = await aiClient.generateCompletion([
      { role: 'system', content: languageManager.getRespectfulSystemPrompt(effectiveLang, hasHistory) },
      { role: 'user', content: askIdPrompt }
    ], 300, 0.3);

    const fallbackAsk = `Apni samasya ka live status dekhne ke liye, kripya apni **Problem ID** (jaise **CHL-JH-2026-XXXX**) batayein.${BUBBLE_DELIMITER}Aap apna registered mobile number ya submit karne ki tareekh bhi bata sakte hain, taaki hum turant records check kar sakein!`;

    return {
      reply: aiAsk || fallbackAsk,
      intent: 'TRACK_PROBLEM_NEED_ID',
      trackingData: null
    };
  }

  async generateTrackingResponse({ challenge, effectiveLang, rawMessage, hasHistory = false }) {
    const status = challenge.status || 'Under Review';
    const district = challenge.district || 'Jharkhand';
    const domain = challenge.domain || 'Urban Development';
    const nodalName = challenge.assignedNodalOfficer?.name || `${district} Nodal Officer`;
    const departmentName = challenge.assignedDepartment?.name || challenge.assignedNodalOfficer?.department || `${domain} Department`;
    const isAssigned = isChallengeAssigned(challenge);
    const canWithdraw = !isAssigned && challenge.status !== 'Withdrawn' && !['Resolved', 'Deployed'].includes(status);
    const canDelete = !isAssigned && !['Resolved', 'Deployed'].includes(status);

    const prompt = `REAL DATABASE FACTS:
- Problem ID: ${challenge.challengeId}
- Title: ${challenge.title}
- Live Status: ${status}
- District: ${district}
- Domain/Department: ${domain} / ${departmentName}
- Assigned Nodal Officer: ${nodalName}
- Is Work Assigned to Ground Team: ${isAssigned ? 'Yes' : 'In Nodal Review'}
- Submission Date: ${new Date(challenge.createdAt || challenge.submittedAt || Date.now()).toLocaleDateString('en-IN')}
- Citizen Query: "${rawMessage}"

TASK:
Generate a respectful response in ${effectiveLang} addressing the citizen as 'Aap' or 'Bhai ji' (NEVER use 'tu/tera').
${hasHistory ? 'CRITICAL: DO NOT say Namaste, Johar, or any greeting. Address directly.' : 'You may use a brief opening greeting.'}
Divide your response into exactly 2 to 3 bubbles separated by "${BUBBLE_DELIMITER}".
- Bubble 1: ${hasHistory ? 'Acknowledge problem ID **' + challenge.challengeId + '** and title directly with respect.' : 'Greeting and problem acknowledgement (Problem ID: **' + challenge.challengeId + '**).'}
- Bubble 2: Live status breakdown explaining what ${status} means, who is handling it, and the next resolution step. Do NOT use markdown tables (|).
- Bubble 3: Warm reassurance that the government team is on it, and asking if they need any other assistance.`;

    const aiReply = await aiClient.generateCompletion([
      { role: 'system', content: languageManager.getRespectfulSystemPrompt(effectiveLang, hasHistory) },
      { role: 'user', content: prompt }
    ], 600, 0.3);

    const prefix = hasHistory ? 'Bhai ji,' : 'Namaste bhai ji! 🙏';
    const fallbackReply = `${prefix} Aapki samasya **${challenge.challengeId}** (${challenge.title}) ka live status humne verify kar liya hai.${BUBBLE_DELIMITER}Abhi ye samasya **${status}** stage par hai.\n• Sambandhit vibhag: **${departmentName}**\n• Zila Nodal Adhikari: **${nodalName}** (${district})\n• Agla kadam: Field team dwara zameeni nirikshan aur samadhan karya.${BUBBLE_DELIMITER}Aap nishchint rahein, zila prashasan ispe sakriyata se karyawahi kar raha hai. Agar aapko koi aur jaankari chahiye toh kripya batayein!`;

    return {
      reply: aiReply || fallbackReply,
      intent: 'TRACK_PROBLEM',
      trackingData: {
        challengeId: challenge.challengeId,
        title: challenge.title,
        description: challenge.description || '',
        status,
        district,
        domain,
        isAssigned,
        canWithdraw,
        canDelete,
        assignedNodalOfficer: challenge.assignedNodalOfficer,
        assignedDepartment: challenge.assignedDepartment,
        createdAt: challenge.createdAt || challenge.submittedAt
      }
    };
  }

  formatChallengeList(challenges, effectiveLang) {
    const list = challenges.map((c, i) => ({
      challengeId: c.challengeId,
      title: c.title,
      description: c.description || '',
      status: c.status || 'Under Review',
      domain: c.domain || 'Urban Development',
      district: c.district || 'Jharkhand',
      dateFormatted: new Date(c.createdAt || c.submittedAt || Date.now()).toLocaleDateString('en-IN', {
        day: 'numeric', month: 'short', year: 'numeric'
      }),
      number: i + 1
    }));

    const lines = list.map(c => `${c.number}. 📋 **${c.challengeId}** (${c.dateFormatted}): ${c.title} — [${c.status}]`);
    const reply = `Aapke account mein nimnlikhit samasyaayein darj mili hain:${BUBBLE_DELIMITER}${lines.join('\n')}${BUBBLE_DELIMITER}Aap inme se kis samasya ka live status dekhna chahte hain? Kripya uski **Problem ID** batayein ya neeche diye gaye card par click karein!`;

    return {
      reply,
      intent: 'TRACK_PROBLEM_LIST',
      challengesList: list,
      trackingData: null
    };
  }
}

export const challengeTracker = new ChallengeTracker();
