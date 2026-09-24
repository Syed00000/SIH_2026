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
Write a polite, respectful reply in ${effectiveLang} addressing them as 'Aap' or 'Bhai ji' across 2 short bubbles separated by "${BUBBLE_DELIMITER}".
CRITICAL LANGUAGE: If ${effectiveLang} is 'hi', reply ONLY in 100% pure Devanagari Hindi (हिन्दी). If 'en', reply ONLY in English. Do NOT say Namaste.
- Bubble 1: Politely explain that no complaint was found matching **${targetId}**.
- Bubble 2: Ask them to double-check their Problem ID, or tell you the date / registered phone number so you can locate their file.`;

      const aiReply = await aiClient.generateCompletion([
        { role: 'system', content: languageManager.getRespectfulSystemPrompt(effectiveLang, hasHistory) },
        { role: 'user', content: notFoundPrompt }
      ], 350, 0.3);

      let fallbackReply = `Aapki di gayi Problem ID **${targetId}** ke sath koi shikayat darj nahi mili.${BUBBLE_DELIMITER}Kripya ID dobara jaanch lein ya submit karne ki tareekh / registered mobile number batayein!`;
      if (effectiveLang === 'hi') {
        fallbackReply = `आपकी दी गई Problem ID **${targetId}** के साथ कोई शिकायत दर्ज नहीं मिली।${BUBBLE_DELIMITER}कृपया अपनी शिकायत क्रमांक (ID) दोबारा जांच लें या दर्ज करने का मोबाइल नंबर बताएं!`;
      } else if (effectiveLang === 'en') {
        fallbackReply = `No complaint was found matching Problem ID **${targetId}**.${BUBBLE_DELIMITER}Please verify the ID or provide your registered mobile number so we can look up your record!`;
      }

      const finalReply = (effectiveLang === 'hi' && aiReply && !/[\u0900-\u097F]/.test(aiReply)) ? fallbackReply : (aiReply || fallbackReply);

      return {
        reply: finalReply,
        intent: 'TRACK_PROBLEM',
        trackingData: null,
        selectedLanguage: effectiveLang
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
Write a respectful, polite request in ${effectiveLang} addressing them as 'Aap' or 'Bhai ji' across 2 short bubbles separated by "${BUBBLE_DELIMITER}".
CRITICAL LANGUAGE: If ${effectiveLang} is 'hi', reply ONLY in 100% pure Devanagari Hindi (हिन्दी). If 'en', reply ONLY in English. Do NOT say Namaste.
- Bubble 1: Politely ask them for their **Problem ID** (e.g. **CHL-JH-2026-XXXX**).
- Bubble 2: Mention that they can also provide their registered phone number or submission date so you can look up their live status.`;

    const aiAsk = await aiClient.generateCompletion([
      { role: 'system', content: languageManager.getRespectfulSystemPrompt(effectiveLang, hasHistory) },
      { role: 'user', content: askIdPrompt }
    ], 300, 0.3);

    let fallbackAsk = `Apni samasya ka live status dekhne ke liye, kripya apni **Problem ID** (jaise **CHL-JH-2026-XXXX**) batayein.${BUBBLE_DELIMITER}Aap apna registered mobile number ya submit karne ki tareekh bhi bata sakte hain, taaki hum turant records check kar sakein!`;
    if (effectiveLang === 'hi') {
      fallbackAsk = `अपनी समस्या का लाइव स्टेटस देखने के लिए, कृपया अपनी **Problem ID** (जैसे **CHL-JH-2026-XXXX**) बताएं।${BUBBLE_DELIMITER}आप अपना पंजीकृत मोबाइल नंबर भी बता सकते हैं, ताकि हम तुरंत रिकॉर्ड देखकर बता सकें!`;
    } else if (effectiveLang === 'en') {
      fallbackAsk = `To track the status of your complaint, please provide your **Problem ID** (e.g. **CHL-JH-2026-XXXX**).${BUBBLE_DELIMITER}You may also provide your registered phone number so we can look up your files!`;
    }

    const finalAsk = (effectiveLang === 'hi' && aiAsk && !/[\u0900-\u097F]/.test(aiAsk)) ? fallbackAsk : (aiAsk || fallbackAsk);

    return {
      reply: finalAsk,
      intent: 'TRACK_PROBLEM_NEED_ID',
      trackingData: null,
      selectedLanguage: effectiveLang
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
CRITICAL LANGUAGE: If ${effectiveLang} is 'hi', reply ONLY in 100% pure Devanagari Hindi (हिन्दी). If 'en', reply ONLY in English.
${hasHistory ? 'CRITICAL: DO NOT say Namaste, Johar, or any greeting. Address directly.' : 'You may use a brief opening greeting.'}
Divide your response into exactly 2 to 3 bubbles separated by "${BUBBLE_DELIMITER}".
- Bubble 1: Acknowledge problem ID **${challenge.challengeId}** and title directly with respect.
- Bubble 2: Live status breakdown explaining what ${status} means, who is handling it, and the next resolution step. Do NOT use markdown tables (|).
- Bubble 3: Warm reassurance that the administration is on it, and asking if they need any other assistance.`;

    const aiReply = await aiClient.generateCompletion([
      { role: 'system', content: languageManager.getRespectfulSystemPrompt(effectiveLang, hasHistory) },
      { role: 'user', content: prompt }
    ], 600, 0.3);

    let fallbackReply = `Aapki samasya **${challenge.challengeId}** (${challenge.title}) ka live status:${BUBBLE_DELIMITER}• Status: **${status}**\n• Sambandhit vibhag: **${departmentName}**\n• Nodal Officer: **${nodalName}** (${district})${BUBBLE_DELIMITER}Zila prashasan ispe sakriyata se karyawahi kar raha hai. Agar aapko koi aur jaankari chahiye toh batayein!`;
    if (effectiveLang === 'hi') {
      fallbackReply = `आपकी समस्या **${challenge.challengeId}** (${challenge.title}) का लाइव स्टेटस:${BUBBLE_DELIMITER}• वर्तमान स्थिति: **${status}**\n• संबंधित विभाग: **${departmentName}**\n• ज़िला नोडल अधिकारी: **${nodalName}** (${district})${BUBBLE_DELIMITER}ज़िला प्रशासन इस पर सक्रियता से कार्रवाई कर रहा है। यदि कोई अन्य सहायता चाहिए तो अवश्य बताएं!`;
    } else if (effectiveLang === 'en') {
      fallbackReply = `Live status for complaint **${challenge.challengeId}** (${challenge.title}):${BUBBLE_DELIMITER}• Status: **${status}**\n• Department: **${departmentName}**\n• Nodal Officer: **${nodalName}** (${district})${BUBBLE_DELIMITER}The district administration is actively acting on this matter. Please let us know if you need any further information!`;
    }

    const finalReply = (effectiveLang === 'hi' && aiReply && !/[\u0900-\u097F]/.test(aiReply)) ? fallbackReply : (aiReply || fallbackReply);

    return {
      reply: finalReply,
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
      },
      selectedLanguage: effectiveLang
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
    let reply = `Aapke account mein nimnlikhit samasyaayein darj mili hain:${BUBBLE_DELIMITER}${lines.join('\n')}${BUBBLE_DELIMITER}Aap inme se kis samasya ka live status dekhna chahte hain? Kripya uski **Problem ID** batayein ya neeche diye gaye card par click karein!`;
    if (effectiveLang === 'hi') {
      reply = `आपके खाते में निम्नलिखित शिकायतें दर्ज पाई गईं:${BUBBLE_DELIMITER}${lines.join('\n')}${BUBBLE_DELIMITER}आप इनमें से किस समस्या का लाइव स्टेटस देखना चाहते हैं? कृपया उसकी **Problem ID** बताएं या नीचे दिए गए कार्ड पर क्लिक करें!`;
    } else if (effectiveLang === 'en') {
      reply = `The following complaints are registered under your account:${BUBBLE_DELIMITER}${lines.join('\n')}${BUBBLE_DELIMITER}Which problem would you like to track? Please provide the **Problem ID** or click a card below!`;
    }

    return {
      reply,
      intent: 'TRACK_PROBLEM_LIST',
      challengesList: list,
      trackingData: null,
      selectedLanguage: effectiveLang
    };
  }
}

export const challengeTracker = new ChallengeTracker();
