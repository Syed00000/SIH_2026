import mongoose from 'mongoose';
import { MongooseUser } from '../../../users/infrastructure/model.js';
import { aiClient } from './ai-assistant/ai-client.js';
import { languageManager } from './ai-assistant/language-manager.js';
import { intentAnalyzer } from './ai-assistant/intent-analyzer.js';
import { challengeTracker } from './ai-assistant/challenge-tracker.js';
import { challengeSubmitter } from './ai-assistant/challenge-submitter.js';
import { challengeWithdrawDelete } from './ai-assistant/challenge-withdraw-delete.js';
import { BUBBLE_DELIMITER } from './ai-assistant/constants.js';
import logger from '../../../../shared/logger/index.js';

export class CitizenAiAssistantService {
  detectDistrict(text) {
    return languageManager.detectDistrict(text);
  }

  detectLanguage(text, selectedLanguage = null) {
    return languageManager.detectLanguage(text, selectedLanguage);
  }

  async processCitizenChat({ message, history = [], media = [], user = null, selectedLanguage = null }) {
    const rawMessage = String(message || '').trim();
    const effectiveLang = this.detectLanguage(rawMessage, selectedLanguage);

    if (!rawMessage && (!media || media.length === 0)) {
      const greetingPrompt = `The citizen just opened the JoharSetu civic assistance portal.
Write a warm, respectful, welcoming greeting in ${effectiveLang} addressing them as 'Aap' or 'Bhai ji' across 2 short bubbles separated by "${BUBBLE_DELIMITER}".
- Bubble 1: Welcome them warmly to JoharSetu (Government of Jharkhand civic innovation portal).
- Bubble 2: Tell them they can report any civic issue (roads, water, electricity, sanitation) with photos/videos, or track an existing complaint with their Problem ID.`;

      const aiGreeting = await aiClient.generateCompletion([
        { role: 'system', content: languageManager.getRespectfulSystemPrompt(effectiveLang) },
        { role: 'user', content: greetingPrompt }
      ], 300, 0.4);

      const fallbackGreeting = `Namaste bhai ji! 🙏 JoharSetu par aapka swaagat hai.${BUBBLE_DELIMITER}Aap sadak, paani, bijli, naali, kachra ya kisi bhi civic samasya ko darj karne ke liye bata sakte hain, photo-video bhi jod sakte hain.${BUBBLE_DELIMITER}Ya agar purani shikayat ka live status janna ho toh Problem ID batayein!`;

      return {
        reply: aiGreeting || fallbackGreeting,
        intent: 'GREETING'
      };
    }

    let userProfile = null;
    const uid = user?.id || user?._id;
    if (uid && mongoose.isValidObjectId(uid) && mongoose.connection.readyState === 1) {
      try {
        userProfile = await MongooseUser.findById(uid).lean().maxTimeMS(2000);
      } catch (err) {
        logger.warn({ msg: 'Could not fetch user profile for AI chat', err: err.message });
      }
    }

    const userDefaultDistrict = userProfile?.profile?.district || user?.district || '';
    const { parsed, challengeIdMatch, recentHistoryText } = await intentAnalyzer.analyze({
      rawMessage,
      history,
      media,
      userDefaultDistrict
    });

    const hasHistory = Array.isArray(history) && history.filter(h => h.id !== 'welcome' && h.id !== 'welcome-reset').length > 0;

    // 0. Direct confirmed withdraw / delete (from UI confirmation card buttons)
    if (rawMessage.startsWith('CONFIRM_WITHDRAW:') || rawMessage.startsWith('CONFIRM_DELETE:')) {
      const isDelete = rawMessage.startsWith('CONFIRM_DELETE:');
      const targetId = rawMessage.replace(/^CONFIRM_(WITHDRAW|DELETE):\s*/i, '').trim();
      return await challengeWithdrawDelete.handle({
        intent: isDelete ? 'DELETE_PROBLEM' : 'WITHDRAW_PROBLEM',
        targetId,
        rawMessage,
        user,
        userProfile,
        effectiveLang,
        hasHistory
      });
    }

    // 0.1 Direct Edit Draft Inquiry (Ask what to edit ONLY if citizen hasn't provided the new details yet)
    const hasEditContent = Boolean(
      this.detectDistrict(rawMessage) ||
      (parsed.district && this.detectDistrict(parsed.district)) ||
      /^(?:location|jagah|pata|address|area|mohalla|samasya|problem|vivaran)[:\s]/i.test(rawMessage) ||
      /(?:me yeh likho|me likho|yeh kar do|ye kar do)/i.test(rawMessage)
    );

    if ((parsed.intent === 'EDIT_DRAFT' || rawMessage.startsWith('EDIT_DRAFT')) && !hasEditContent) {
      return await challengeSubmitter.askWhatToEdit({
        history,
        effectiveLang,
        hasHistory
      });
    }

    // 1. Confirm & Finalize Submission
    if (parsed.intent === 'CONFIRM_SUBMISSION' || rawMessage.startsWith('CONFIRM_SUBMIT:')) {
      let draftReport = null;
      if (rawMessage.startsWith('CONFIRM_SUBMIT:')) {
        try {
          draftReport = JSON.parse(rawMessage.replace('CONFIRM_SUBMIT:', '').trim());
        } catch (_) {}
      }

      // Extract draft from history or reconstruct from conversation context
      if (!draftReport && Array.isArray(history)) {
        for (let i = history.length - 1; i >= 0; i--) {
          if (history[i]?.draftReport) { draftReport = history[i].draftReport; break; }
        }
      }
      if (!draftReport) {
        const dist = this.detectDistrict(recentHistoryText) || userDefaultDistrict || 'Ranchi';
        const userMsg = Array.isArray(history) ? [...history].reverse().find(h => h.role === 'user' && !/^(haan|yes|ha|submit|confirm|theek hai)/i.test((h.content||'').trim())) : null;
        draftReport = {
          title: `Civic Issue in ${dist}`,
          description: userMsg?.content || recentHistoryText || `Civic issue reported in ${dist}`,
          district: dist,
          areaOrBlock: 'Main Ward / Sector',
          domain: 'Urban Development',
          priority: 'Medium',
          media: []
        };
      }

      // Ensure all media from draftReport, current message, and full history are preserved
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

      if (Array.isArray(draftReport.media)) draftReport.media.forEach(addMediaItem);
      if (Array.isArray(media)) media.forEach(addMediaItem);
      if (Array.isArray(history)) {
        for (const h of history) {
          if (Array.isArray(h.media)) h.media.forEach(addMediaItem);
          if (Array.isArray(h.draftReport?.media)) h.draftReport.media.forEach(addMediaItem);
        }
      }
      draftReport.media = accumulatedMedia;

      return await challengeSubmitter.executeSubmission({
        draftReport,
        user,
        userProfile,
        effectiveLang,
        hasHistory
      });
    }

    // 2. Withdraw or Delete
    if (parsed.intent === 'WITHDRAW_PROBLEM' || parsed.intent === 'DELETE_PROBLEM') {
      const targetId = parsed.challengeId || (challengeIdMatch ? challengeIdMatch[0] : null);
      return await challengeWithdrawDelete.handle({
        intent: parsed.intent,
        targetId,
        rawMessage,
        user,
        userProfile,
        effectiveLang,
        hasHistory
      });
    }

    // 3. Track Problem
    if (parsed.intent === 'TRACK_PROBLEM' || challengeIdMatch) {
      const targetId = challengeIdMatch ? challengeIdMatch[0] : parsed.challengeId;
      return await challengeTracker.track({
        targetId,
        rawMessage,
        effectiveLang,
        user,
        userProfile,
        hasHistory
      });
    }

    // 4. Submit Problem (Prepares Location & Verification Report)
    const detectedDistrict =
      this.detectDistrict(rawMessage) ||
      this.detectDistrict(recentHistoryText) ||
      (parsed.district && this.detectDistrict(parsed.district)) ||
      userDefaultDistrict ||
      null;

    const isNewProblemStart = /\b(aur|naya|nayi|doosra|doosri|ek aur|new|another)\b/i.test(rawMessage);
    const hadProblem = !isNewProblemStart && /(paani|pani|water|bijli|light|current|batti|power|sadak|road|kachra|safai|drain|naali|nali|sewage|hospital|school|gaddha|gaddhe|pothole|shikayat|damage|issue|tutal|tuta|kharab|line|transformer|khamba|pole|gandagi|badboo|keechad|kado|andhera)/i.test(recentHistoryText);
    const askedLoc = /(district|zila|ज़िला|इलाका|area|block|प्रखंड|location|mohalla|locality|edit|badal)/i.test(recentHistoryText);
    const hasDraftInHistory = Array.isArray(history) && history.some(h => Boolean(h.draftReport));

    if (parsed.intent === 'SUBMIT_PROBLEM' || (hadProblem && (detectedDistrict || askedLoc)) || hasDraftInHistory || detectedDistrict) {
      return await challengeSubmitter.prepareDraft({
        parsed,
        rawMessage,
        history,
        media,
        user,
        userProfile,
        detectedDistrict,
        effectiveLang,
        hasHistory
      });
    }

    // 5. General Queries / FAQs
    const faqSystem = `${languageManager.getRespectfulSystemPrompt(effectiveLang, hasHistory)}
JoharSetu connects Jharkhand citizens directly with district nodal officers and government departments to solve civic problems.`;

    const aiFaq = await aiClient.generateCompletion([
      { role: 'system', content: faqSystem },
      ...(Array.isArray(history) ? history.slice(-4) : []),
      { role: 'user', content: rawMessage }
    ], 350, 0.4);

    const fallbackFaq = `${hasHistory ? 'Bhai ji,' : 'Namaste bhai ji! 🙏'} JoharSetu par aapki madad ke liye hamesha taiyaar hain.${BUBBLE_DELIMITER}Aap yahan sadak, paani, bijli, safai jaisi samasyaayein darj kar sakte hain aur unka live status track kar sakte hain.${BUBBLE_DELIMITER}Batayein, aapki kya madad kar saktein hain?`;

    return {
      reply: aiFaq || fallbackFaq,
      intent: 'GENERAL_QUERY'
    };
  }
}

export const citizenAiAssistantService = new CitizenAiAssistantService();
export default citizenAiAssistantService;
