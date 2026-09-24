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
    const switchLang = languageManager.detectLanguageSwitch(rawMessage);
    const effectiveLang = switchLang || this.detectLanguage(rawMessage, selectedLanguage);

    // 0. Language Switch Interception:
    // If citizen commands to switch language (e.g. "hindi me bol na bhaai", "speak in english", etc.)
    // and does NOT describe a new civic issue, acknowledge warmly in target language and preserve draft
    if (switchLang && !challengeSubmitter.hasProblemContent(rawMessage, null)) {
      let existingDraft = null;
      if (Array.isArray(history)) {
        for (let i = history.length - 1; i >= 0; i--) {
          if (history[i]?.draftReport) { existingDraft = history[i].draftReport; break; }
        }
      }

      let switchReply = '';
      if (switchLang === 'hi') {
        switchReply = existingDraft
          ? `जी बिल्कुल! अब से हम आपसे हिंदी में बात करेंगे। 🙏${BUBBLE_DELIMITER}आपकी ड्राफ्ट शिकायत सुरक्षित है। क्या आप इसे सबमिट करना चाहते हैं या कोई बदलाव करना है?`
          : `जी बिल्कुल! अब से हम आपसे हिंदी में बात करेंगे। 🙏${BUBBLE_DELIMITER}बताएं, झारखंड में सड़क, पानी, बिजली या नागरिक सेवाओं से जुड़ी आपकी क्या समस्या है?`;
      } else if (switchLang === 'en') {
        switchReply = existingDraft
          ? `Certainly! I will communicate in English from now on. 👍${BUBBLE_DELIMITER}Your draft complaint is saved. Would you like to confirm and submit, or make changes?`
          : `Certainly! I will communicate with you in English from now on. 👋${BUBBLE_DELIMITER}Please let me know how I can assist you with civic services or reporting an issue in Jharkhand!`;
      } else if (switchLang === 'bn') {
        switchReply = existingDraft
          ? `হ্যাঁ নিশ্চয়ই! এখন থেকে আমরা বাংলায় কথা বলব। 🙏${BUBBLE_DELIMITER}আপনার ড্রাফট অভিযোগটি সংরক্ষিত আছে। আপনি কি এটি জমা দিতে চান?`
          : `হ্যাঁ নিশ্চয়ই! এখন থেকে हम বাংলায় কথা বলব। 🙏${BUBBLE_DELIMITER}বলুন, ঝাড়খণ্ডে নাগরিক সেবা বা সমস্যা সম্পর্কে কী জানতে চান?`;
      } else if (switchLang === 'sat') {
        switchReply = `ᱡᱚᱦᱟᱨ! ᱱᱤᱛᱚᱜ ᱠᱷᱚᱱ ᱥᱟᱱᱛᱟᱲᱤ ᱛᱮ ᱨᱚᱲ ᱦᱩᱭᱩᱜᱼᱟ᱾ 🙏${BUBBLE_DELIMITER}ᱞᱟᱹᱭ ᱢᱮ, ᱪᱮᱫ ᱜᱚᱲᱚ ᱫᱚᱨᱠᱟᱨ?`;
      } else {
        switchReply = existingDraft
          ? `Haan bhai ji bilkul! Ab se hum Hinglish me baat karenge. 👍${BUBBLE_DELIMITER}Aapki draft shikayat saved hai. Kya aap ise confirm karke submit karna chahte hain?`
          : `Haan bhai ji bilkul! Ab se hum Hinglish me baat karenge. 👍${BUBBLE_DELIMITER}Batayein, sadak, paani, bijli ya safai se judi kya samasya hai?`;
      }

      return {
        reply: switchReply,
        intent: 'LANGUAGE_SWITCHED',
        selectedLanguage: switchLang,
        draftReport: existingDraft
      };
    }

    if (!rawMessage && (!media || media.length === 0)) {
      const greetingPrompt = user
        ? `The citizen just opened the JoharSetu civic assistance portal.
Write a warm, respectful, welcoming greeting in ${effectiveLang} addressing them as 'Aap' or 'Bhai ji' across 2 short bubbles separated by "${BUBBLE_DELIMITER}".
- Bubble 1: Welcome them warmly to JoharSetu (Government of Jharkhand civic innovation portal).
- Bubble 2: Tell them they can report any civic issue (roads, water, electricity, sanitation) with photos/videos, or track an existing complaint with their Problem ID.`
        : `The user is browsing the JoharSetu landing page as a guest.
Write a warm, welcoming, informative greeting in ${effectiveLang} across 2 short bubbles separated by "${BUBBLE_DELIMITER}".
- Bubble 1: Welcome them to JoharSetu (Government of Jharkhand's Official Civic Innovation & Public Grievance Portal).
- Bubble 2: Inform them that you can answer any questions about JoharSetu, public departments, and how civic complaint resolution works.`;

      const aiGreeting = await aiClient.generateCompletion([
        { role: 'system', content: languageManager.getRespectfulSystemPrompt(effectiveLang) },
        { role: 'user', content: greetingPrompt }
      ], 300, 0.4);

      let fallbackGreeting = `Namaste! 🙏 JoharSetu par aapka swaagat hai.${BUBBLE_DELIMITER}Main aapka JoharSetu AI assistant hoon. Aap mujhse portal, civic services ya shikayat darj karne ke baare me poori jaankari le sakte hain!`;
      if (effectiveLang === 'en') {
        fallbackGreeting = `Welcome to JoharSetu — Government of Jharkhand's Civic Innovation & Public Grievance Portal! 👋${BUBBLE_DELIMITER}I am your JoharSetu Information Assistant. Feel free to ask any question about public services, grievance resolution, or portal features!`;
      } else if (effectiveLang === 'hi') {
        fallbackGreeting = `जोहारसेतु - झारखंड सरकार के नागरिक सेवा व शिकायत निवारण पोर्टल पर आपका स्वागत है! 🙏${BUBBLE_DELIMITER}मैं आपका आधिकारिक जोहारसेतु सूचना सहायक हूँ। आप मुझसे पोर्टल, नागरिक सेवाओं या शिकायत दर्ज करने की प्रक्रिया के बारे में कुछ भी पूछ सकते हैं!`;
      }

      const finalGreeting = (effectiveLang === 'hi' && aiGreeting && !/[\u0900-\u097F]/.test(aiGreeting)) ? fallbackGreeting : (aiGreeting || fallbackGreeting);

      return {
        reply: finalGreeting,
        intent: 'GREETING',
        selectedLanguage: effectiveLang
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

    // LANDING PAGE AI (Guest Mode: !user) — Information & FAQ only
    if (!user) {
      if (['SUBMIT_PROBLEM', 'CONFIRM_SUBMISSION', 'EDIT_DRAFT'].includes(parsed.intent)) {
        const guestSubmitPrompt = `The user is an unauthenticated guest browsing the JoharSetu landing page. They mentioned a civic problem or asked to file a complaint: "${rawMessage}".
TASK: Write an informative, welcoming response in ${effectiveLang} across 2 short bubbles separated by "${BUBBLE_DELIMITER}".
- Bubble 1: Acknowledge their issue topic ("${parsed.problemDescription || rawMessage}") and explain how JoharSetu connects citizens directly with Jharkhand District Nodal Officers for fast resolution.
- Bubble 2: Kindly inform them that to officially submit a complaint with photo evidence and location verification, they need to log in to their JoharSetu account.`;

        const aiReply = await aiClient.generateCompletion([
          { role: 'system', content: languageManager.getRespectfulSystemPrompt(effectiveLang, hasHistory) },
          { role: 'user', content: guestSubmitPrompt }
        ], 350, 0.4);

        let fallbackReply = `JoharSetu par aap civic samasyaayein (sadak, paani, bijli, safai) seedhe Zila Nodal Adhikariyon tak pahuncha sakte hain.${BUBBLE_DELIMITER}Apni shikayat ko photo-video aur location ke saath officially darj karne ke liye, kripya apne JoharSetu account me **login** karein!`;
        if (effectiveLang === 'en') {
          fallbackReply = `JoharSetu connects Jharkhand citizens directly with District Nodal Officers to resolve civic complaints efficiently.${BUBBLE_DELIMITER}To officially submit your complaint with photos and location verification, please **log in** to your JoharSetu account!`;
        } else if (effectiveLang === 'hi') {
          fallbackReply = `जोहारसेतु झारखंड के नागरिकों को सीधे ज़िला नोडल अधिकारियों से जोड़कर जनसमस्याओं का समाधान करता है।${BUBBLE_DELIMITER}अपनी शिकायत को फ़ोटो व लोकेशन के साथ आधिकारिक तौर पर दर्ज करने के लिए, कृपया अपने जोहारसेतु खाते में **लॉगिन** करें!`;
        }

        return { reply: aiReply || fallbackReply, intent: 'GUEST_SUBMIT_INFO' };
      }

      if (['TRACK_PROBLEM', 'WITHDRAW_PROBLEM', 'DELETE_PROBLEM'].includes(parsed.intent) || challengeIdMatch) {
        const guestTrackPrompt = `The user is an unauthenticated guest browsing the JoharSetu landing page. They asked to track or manage a complaint: "${rawMessage}".
TASK: Write an informative response in ${effectiveLang} across 2 short bubbles separated by "${BUBBLE_DELIMITER}".
- Bubble 1: Explain that JoharSetu provides live tracking for all registered civic complaints.
- Bubble 2: Inform them that to track live progress or manage their complaints, please log in to their JoharSetu account.`;

        const aiReply = await aiClient.generateCompletion([
          { role: 'system', content: languageManager.getRespectfulSystemPrompt(effectiveLang, hasHistory) },
          { role: 'user', content: guestTrackPrompt }
        ], 350, 0.4);

        let fallbackReply = `JoharSetu par har shikayat ka live status real-time track kiya ja sakta hai.${BUBBLE_DELIMITER}Apni darj samasya ka live status dekhne ya ise manage karne ke liye, kripya apne JoharSetu account me **login** karein!`;
        if (effectiveLang === 'en') {
          fallbackReply = `JoharSetu provides real-time status tracking for all registered civic complaints.${BUBBLE_DELIMITER}To track live status or manage your complaints, please **log in** to your JoharSetu account!`;
        } else if (effectiveLang === 'hi') {
          fallbackReply = `जोहारसेतु पर दर्ज हर शिकायत की लाइव प्रगति की जानकारी वास्तविक समय (real-time) में उपलब्ध रहती है।${BUBBLE_DELIMITER}अपनी शिकायत का लाइव स्टेटस देखने या प्रबंधन के लिए, कृपया अपने जोहारसेतु खाते में **लॉगिन** करें!`;
        }

        return { reply: aiReply || fallbackReply, intent: 'GUEST_TRACK_INFO' };
      }

      // Guest General Queries / Extra Questions / Information
      const landingFaqSystem = `${languageManager.getRespectfulSystemPrompt(effectiveLang, hasHistory)}
You are the official Information AI Assistant for JoharSetu (Government of Jharkhand).
Answer ANY citizen query, extra question, general knowledge inquiry, civic guidance, portal feature, government scheme, or general question accurately, clearly, and helpfully in ${effectiveLang}.`;

      const aiLandingFaq = await aiClient.generateCompletion([
        { role: 'system', content: landingFaqSystem },
        ...(Array.isArray(history) ? history.slice(-4) : []),
        { role: 'user', content: rawMessage }
      ], 450, 0.4);

      let fallbackLandingFaq = `JoharSetu Jharkhand sarkar ka aadhikarik civic portal hai. Hum sadak, paani, bijli, safai jaisi samasyaon ke samadhan me madad karte hain.${BUBBLE_DELIMITER}Aapko JoharSetu ya nagrik sewaon ke baare me kya jaankari chahiye?`;
      if (effectiveLang === 'en') {
        fallbackLandingFaq = `JoharSetu is the official civic portal of the Government of Jharkhand.${BUBBLE_DELIMITER}How can I assist you with information about public services, complaint filing, or general inquiries today?`;
      } else if (effectiveLang === 'hi') {
        fallbackLandingFaq = `जोहारसेतु झारखंड सरकार का आधिकारिक नागरिक सेवा पोर्टल है।${BUBBLE_DELIMITER}आप जोहारसेतु की सेवाओं, शिकायत निवारण या अन्य किसी जानकारी के बारे में क्या जानना चाहते हैं?`;
      }

      return { reply: aiLandingFaq || fallbackLandingFaq, intent: 'LANDING_INFO_QUERY' };
    }

    // LOGGED-IN CITIZEN AI (Full Functionality)
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

    // 1.5. Cancel action
    if (parsed.intent === 'CANCEL_ACTION') {
      let cancelReply = `Theek hai bhai ji, ise cancel kar diya gaya hai.${BUBBLE_DELIMITER}Batayein, kya aapki kisi aur samasya ya jankari me madad karein?`;
      if (effectiveLang === 'hi') {
        cancelReply = `ठीक है, इसे रद्द कर दिया गया है।${BUBBLE_DELIMITER}बताएं, क्या आपकी किसी अन्य नागरिक समस्या या सेवा में सहायता कर सकते हैं?`;
      } else if (effectiveLang === 'en') {
        cancelReply = `Understood, this action has been cancelled.${BUBBLE_DELIMITER}How else may I assist you today?`;
      }
      return {
        reply: cancelReply,
        intent: 'ACTION_CANCELLED',
        selectedLanguage: effectiveLang
      };
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
      null;

    const isNewProblemStart = /\b(aur|naya|nayi|doosra|doosri|ek aur|new|another)\b/i.test(rawMessage);
    const hasProblemInMsg = challengeSubmitter.hasProblemContent(rawMessage, parsed);
    const hadProblem = !isNewProblemStart && /(paani|pani|water|bijli|light|current|batti|power|sadak|road|kachra|safai|drain|naali|nali|sewage|hospital|school|gaddha|gaddhe|pothole|shikayat|damage|issue|tutal|tuta|kharab|line|transformer|khamba|pole|gandagi|badboo|keechad|kado|andhera|पानी|बिजली|सड़क|सड़कें|सफाई|कचरा|नाली|सीवर|अस्पताल|स्कूल|गड्ढा|गड्डा|शिकायत|समस्या|टूटी|टूटा|खराब|अंधेरा|खंभा|तार|लीकेज)/i.test(recentHistoryText);
    const lastAssistantMsg = Array.isArray(history) ? [...history].reverse().find(h => h.role === 'assistant') : null;
    const isAwaitingLocation = lastAssistantMsg && (
      /(district|zila|ज़िला|इलाका|area|block|मोहल्ला|location|mohalla|locality|सड़क|road)/i.test(lastAssistantMsg.content || '')
    );
    const askedLoc = Boolean(isAwaitingLocation) || /(district|zila|ज़िला|इलाका|area|block|प्रखंड|location|mohalla|locality|edit|badal|पते|पता)/i.test(recentHistoryText);
    const hasDraftInHistory = Array.isArray(history) && history.some(h => Boolean(h.draftReport));

    if (parsed.intent === 'SUBMIT_PROBLEM' || hasProblemInMsg || (hadProblem && (detectedDistrict || askedLoc)) || hasDraftInHistory) {
      const draftResult = await challengeSubmitter.prepareDraft({
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
      return {
        ...draftResult,
        selectedLanguage: effectiveLang
      };
    }

    // 5. General Queries / FAQs for logged-in citizen
    const faqSystem = `${languageManager.getRespectfulSystemPrompt(effectiveLang, hasHistory)}
JoharSetu connects Jharkhand citizens directly with district nodal officers and government departments to solve civic problems.`;

    const aiFaq = await aiClient.generateCompletion([
      { role: 'system', content: faqSystem },
      ...(Array.isArray(history) ? history.slice(-4) : []),
      { role: 'user', content: rawMessage }
    ], 350, 0.4);

    let fallbackFaq = `${hasHistory ? '' : 'Namaste! 🙏 '}JoharSetu par aapki madad ke liye hamesha taiyaar hain.${BUBBLE_DELIMITER}Aap yahan sadak, paani, bijli, safai jaisi samasyaayein darj kar sakte hain aur unka live status track kar sakte hain.${BUBBLE_DELIMITER}Batayein, aapki kya madad kar sakte hain?`;
    if (effectiveLang === 'en') {
      fallbackFaq = `I am here to assist you with JoharSetu civic services.${BUBBLE_DELIMITER}You can submit civic complaints regarding roads, water, electricity, and sanitation, or track live progress of existing issues.${BUBBLE_DELIMITER}How can I help you today?`;
    } else if (effectiveLang === 'hi') {
      fallbackFaq = `जोहारसेतु पर आपकी सहायता के लिए सदैव तत्पर हैं।${BUBBLE_DELIMITER}आप यहाँ सड़क, पानी, बिजली, स्वच्छता जैसी समस्याओं को दर्ज कर सकते हैं और उनका लाइव स्टेटस देख सकते हैं।${BUBBLE_DELIMITER}बताएं, आज आपकी क्या सहायता कर सकते हैं?`;
    }

    const finalFaq = (effectiveLang === 'hi' && aiFaq && !/[\u0900-\u097F]/.test(aiFaq)) ? fallbackFaq : (aiFaq || fallbackFaq);

    return {
      reply: finalFaq,
      intent: 'GENERAL_QUERY',
      selectedLanguage: effectiveLang
    };
  }
}

export const citizenAiAssistantService = new CitizenAiAssistantService();
export default citizenAiAssistantService;
