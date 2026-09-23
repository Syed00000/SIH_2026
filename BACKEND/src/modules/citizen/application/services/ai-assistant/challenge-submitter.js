import { citizenService } from '../../service.js';
import { aiClient } from './ai-client.js';
import { languageManager } from './language-manager.js';
import { VALID_DOMAINS, BUBBLE_DELIMITER } from './constants.js';
import logger from '../../../../../shared/logger/index.js';

class ChallengeSubmitter {
  hasProblemContent(rawMessage, parsed) {
    const desc = (parsed?.problemDescription || '').trim();
    const lower = (rawMessage || '').toLowerCase().trim();

    const isJustSubmitCommand =
      /^(ek aur\s+)?(submit|shikayat|complain|complaint|darj|report|problem|samasya)\s*(karna hai|karni hai|karo|karein|hai|bhai)?$/i.test(lower) ||
      /^(mujhe\s+)?(ek aur\s+)?(naya|nayi|new|another)\s+(submit|problem|shikayat|issue|complaint)(\s+karna hai|\s+karni hai)?$/i.test(lower) ||
      /^(submit a challenge|naya challenge|new complaint|report problem|kuch complain karni hai|ek problem hai)$/i.test(lower) ||
      /^hey\s+(buddy|friend|bro)?,\s*how\s+do\s+i\s+submit/i.test(lower);

    if (isJustSubmitCommand) return false;

    if (desc.length > 5 && !/^(ek aur|naya|nayi|submit|karna hai|new complaint)/i.test(desc)) {
      return true;
    }

    return /(paani|pani|water|bijli|light|current|power|sadak|road|kachra|safai|garbage|drain|naali|nali|sewage|hospital|school|gaddha|pothole|leakage|toot|break|broken|damage|chori|pipeline|street light|jam|traffic|danger|pollution|handpump|nal|kuda|dhalan)/i.test(lower);
  }

  async prepareDraft({ parsed, rawMessage, history, media, user, userProfile, detectedDistrict, effectiveLang, hasHistory = false }) {
    // 1. If citizen hasn't described WHAT the problem is yet, ask for details
    if (!this.hasProblemContent(rawMessage, parsed)) {
      const askDetailsPrompt = `Citizen wants to submit a civic problem: "${rawMessage}".
They haven't described what is broken or needed.
Ask them warmly and respectfully in ${effectiveLang} as 'Aap' or 'Bhai ji' (NEVER 'tu/tera') what the problem is (roads, water, electricity, sanitation, etc.) and where in Jharkhand it is. Do NOT say Namaste.`;

      const aiAsk = await aiClient.generateCompletion([
        { role: 'system', content: languageManager.getRespectfulSystemPrompt(effectiveLang, hasHistory) },
        { role: 'user', content: askDetailsPrompt }
      ], 350, 0.3);

      const fallbackAsk = `Haan bhai ji, bilkul! Batayein, kya samasya hai?${BUBBLE_DELIMITER}Sadak, paani, bijli, safai ya koi aur dikkat? Aur yeh kis ilaqe ya zila ki baat hai, taaki hum turant madad kar sakein!`;

      return {
        reply: aiAsk || fallbackAsk,
        intent: 'SUBMIT_PROBLEM_NEED_DETAILS'
      };
    }

    // 2. If district is missing, ask for district & locality
    if (!detectedDistrict) {
      const askLocationPrompt = `The citizen reported: "${rawMessage}".
We need their Jharkhand District (ज़िला) and Locality/Area.
Write a respectful request in ${effectiveLang} addressing them as 'Aap' or 'Bhai ji' (NEVER 'tu/tera'). Do NOT say Namaste. Concise in 1-2 bubbles separated by "${BUBBLE_DELIMITER}".`;

      const aiAskLoc = await aiClient.generateCompletion([
        { role: 'system', content: languageManager.getRespectfulSystemPrompt(effectiveLang, hasHistory) },
        { role: 'user', content: askLocationPrompt }
      ], 350, 0.3);

      const fallbackLoc = `Aapki samasya samajh aa gayi hai bhai ji.${BUBBLE_DELIMITER}Kripya apna **Zila (District)** aur **Mohalla/Area** batayein, taaki hum ise seedhe aapke Zila Nodal Adhikari tak bhej sakein. Agar photo ho toh 📎 se jod dein!`;

      return {
        reply: aiAskLoc || fallbackLoc,
        intent: 'SUBMIT_PROBLEM_NEED_LOCATION',
        suggestedDistrict: null
      };
    }

    // 3. Problem described & District known -> Generate verification preview report
    const domain = VALID_DOMAINS.includes(parsed?.domain) ? parsed.domain : 'Urban Development';
    const priority = ['Low', 'Medium', 'High', 'Critical'].includes(parsed?.priority) ? parsed.priority : 'Medium';
    const finalArea = parsed?.areaOrBlock && parsed.areaOrBlock.trim().length > 1 ? parsed.areaOrBlock.trim() : 'Main Ward / Sector';
    const finalTitle = parsed?.title && parsed.title.length > 5 ? parsed.title : `${domain} Issue in ${finalArea}, ${detectedDistrict}`;
    const finalDescription = parsed?.problemDescription || rawMessage;

    // Accumulate media from current message + history + any previous draftReports
    const accumulatedMedia = [];
    const seenUrls = new Set();
    const addMediaItem = (item) => {
      if (!item) return;
      const rawUrl = typeof item === 'string' ? item.trim() : (item.url || item.accessUrl || item.src || '').trim();
      if (!rawUrl || seenUrls.has(rawUrl)) return;
      seenUrls.add(rawUrl);
      if (typeof item === 'string') {
        accumulatedMedia.push({ url: rawUrl, accessUrl: rawUrl, resourceType: 'image', fileType: 'image' });
      } else {
        accumulatedMedia.push({
          url: rawUrl,
          accessUrl: rawUrl,
          mediaId: item.mediaId || item.publicId || '',
          publicId: item.publicId || item.providerPublicId || item.mediaId || '',
          resourceType: item.resourceType || item.fileType || 'image',
          fileType: item.fileType || item.resourceType || 'image',
          fileName: item.fileName || item.caption || 'Ground Evidence',
          caption: item.caption || ''
        });
      }
    };

    if (Array.isArray(media)) media.forEach(addMediaItem);
    if (Array.isArray(history)) {
      for (const h of history) {
        if (Array.isArray(h.media)) h.media.forEach(addMediaItem);
        if (Array.isArray(h.draftReport?.media)) h.draftReport.media.forEach(addMediaItem);
      }
    }

    const draftReport = {
      title: finalTitle,
      description: finalDescription,
      domain,
      priority,
      district: detectedDistrict,
      areaOrBlock: finalArea,
      media: accumulatedMedia
    };

    const reviewPrompt = `Civic complaint analyzed: Title: ${finalTitle}, District: ${detectedDistrict}, Locality: ${finalArea}, Category: ${domain}, Problem: "${finalDescription}".
TASK: Warm, respectful message in ${effectiveLang} addressing citizen as 'Aap' or 'Bhai ji' (NEVER 'tu/tera') reviewing their issue.
Divide into 2 bubbles separated by "${BUBBLE_DELIMITER}".
- Bubble 1: State the exact problem they reported ("${finalDescription}") and that location (${finalArea}, ${detectedDistrict}) has been verified under ${domain}.
- Bubble 2: Ask them to confirm if the location and problem details look accurate. Tap 'Confirm & Submit' or say 'Haan submit kardo'. Do NOT say Namaste.`;

    const aiReply = await aiClient.generateCompletion([
      { role: 'system', content: languageManager.getRespectfulSystemPrompt(effectiveLang, hasHistory) },
      { role: 'user', content: reviewPrompt }
    ], 500, 0.3);

    const fallbackReply = `Bhai ji, humne aapki darj samasya aur location ki jaanch kar ke yeh preview taiyaar kiya hai:${BUBBLE_DELIMITER}• **समस्या (Issue):** ${finalDescription}\n• **ज़िला (District):** ${detectedDistrict}\n• **इलाका (Area):** ${finalArea}\n• **विभाग (Domain):** ${domain}\n\nAgar sab theek hai toh neeche **'Confirm & Submit'** button dabayein ya 'Haan submit kardo' kahein!`;

    return { reply: aiReply || fallbackReply, intent: 'DRAFT_CONFIRMATION_NEEDED', draftReport };
  }

  async executeSubmission({ draftReport, user, userProfile, effectiveLang, hasHistory = false }) {
    const citizenName = userProfile?.fullName || user?.fullName || 'Jharkhand Citizen';
    const citizenMobile = userProfile?.mobileNumber || user?.mobileNumber || '9800000000';
    const citizenEmail = userProfile?.email || user?.email || 'citizen@joharsetu.jharkhand.gov.in';

    const mediaList = [];
    const mediaUrls = [];
    if (Array.isArray(draftReport.media)) {
      for (const m of draftReport.media) {
        const rawUrl = typeof m === 'string' ? m.trim() : (m.url || m.accessUrl || '').trim();
        if (rawUrl && !mediaUrls.includes(rawUrl)) {
          mediaUrls.push(rawUrl);
          mediaList.push({
            mediaId: typeof m === 'object' ? (m.mediaId || m.publicId || '') : '',
            url: rawUrl,
            caption: (typeof m === 'object' ? m.caption : '') || '',
            fileName: (typeof m === 'object' ? m.fileName : '') || 'Ground Evidence',
            fileType: (typeof m === 'object' ? (m.fileType || m.resourceType) : 'image') || 'image',
            resourceType: (typeof m === 'object' ? (m.resourceType || m.fileType) : 'image') || 'image',
            providerPublicId: (typeof m === 'object' ? (m.providerPublicId || m.publicId) : '') || ''
          });
        }
      }
    }

    const payload = {
      title: draftReport.title,
      description: draftReport.description,
      domain: draftReport.domain || 'Urban Development',
      priority: draftReport.priority || 'Medium',
      district: draftReport.district,
      location: {
        district: draftReport.district,
        block: draftReport.areaOrBlock,
        panchayatOrWard: draftReport.areaOrBlock,
        landmark: draftReport.areaOrBlock,
        fullAddress: `${draftReport.areaOrBlock}, ${draftReport.district}, Jharkhand`
      },
      submitterName: citizenName,
      submitterPhone: citizenMobile,
      submitterEmail: citizenEmail,
      media: mediaList,
      mediaUrls
    };

    try {
      const created = await citizenService.submitChallenge(
        payload,
        user ? { id: user.id, fullName: citizenName, mobileNumber: citizenMobile, email: citizenEmail } : null
      );

      logger.info({ msg: 'Problem officially submitted after user confirmation', challengeId: created.challengeId });

      const confirmPrompt = `REAL SUBMISSION FACTS:
- Problem ID: ${created.challengeId}
- Title: ${created.title}
- District: ${created.district}
- Category: ${created.domain}
- Assigned Officer: ${created.assignedNodalOfficer?.name || 'District Nodal Officer'} (${created.district} Nodal Cell)

TASK:
Write a warm, respectful confirmation in ${effectiveLang} addressing the citizen as 'Aap' or 'Bhai ji' (NEVER 'tu/tera') across 2-3 bubbles separated by "${BUBBLE_DELIMITER}".
- Bubble 1: Confirm that problem **${created.challengeId}** has been officially registered with the Government of Jharkhand!
- Bubble 2: Explain it is routed to ${created.district} Nodal Cell for line department field inspection.
- Bubble 3: Reassure that they can track it live anytime here in chat or in 'My Challenges'. Do NOT say Namaste.`;

      const aiReply = await aiClient.generateCompletion([
        { role: 'system', content: languageManager.getRespectfulSystemPrompt(effectiveLang, hasHistory) },
        { role: 'user', content: confirmPrompt }
      ], 600, 0.3);

      const fallbackReply = `Aapki samasya safaltapoorvak JoharSetu par darj kar li gayi hai! 🎉\n\n📋 **Problem ID:** ${created.challengeId}\n📌 **Vishy:** ${created.title}${BUBBLE_DELIMITER}Yeh mamla **${created.district} Zila Nodal Cell** ko bhej diya gaya hai. Sambandhit vibhag jald hi zameeni jaanch karega.${BUBBLE_DELIMITER}Aap iska live status kabhi bhi yahan chat mein ya 'My Challenges' section mein dekh sakte hain.`;

      return {
        reply: aiReply || fallbackReply,
        intent: 'SUBMIT_PROBLEM_SUCCESS',
        createdChallenge: {
          challengeId: created.challengeId,
          title: created.title,
          description: created.description || draftReport.description || '',
          status: created.status || 'Under Review',
          district: created.district,
          domain: created.domain,
          priority: created.priority,
          media: created.media || mediaList,
          mediaUrls: created.mediaUrls || mediaUrls,
          assignedNodalOfficer: created.assignedNodalOfficer,
          submittedAt: created.submittedAt || new Date().toISOString()
        }
      };
    } catch (err) {
      logger.error({ msg: 'Submission via AI failed', error: err.message });
      return {
        reply: `Khed hai, samasya darj karne mein takneeki samasya aayi: ${err.message}. Kripya punah prayas karein.`,
        intent: 'SUBMIT_PROBLEM_ERROR'
      };
    }
  }
}

export const challengeSubmitter = new ChallengeSubmitter();
