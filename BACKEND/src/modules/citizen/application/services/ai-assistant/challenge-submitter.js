import { citizenService } from '../../service.js';
import { aiClient } from './ai-client.js';
import { languageManager } from './language-manager.js';
import { VALID_DOMAINS, BUBBLE_DELIMITER } from './constants.js';
import logger from '../../../../../shared/logger/index.js';

class ChallengeSubmitter {
  extractProblemFromHistory(history = []) {
    if (!Array.isArray(history) || history.length === 0) return null;
    for (let i = history.length - 1; i >= 0; i--) {
      const item = history[i];
      if (item.draftReport?.description) return item.draftReport.description;
      if (item.role === 'user') {
        const text = String(item.content || '').trim();
        if (
          text.length > 4 &&
          !/^(confirm|yes|haan|ha|theek hai|proceed|cancel|rehne do|status|track|hello|hi|namaste)/i.test(text) &&
          !/^(ranchi|dhanbad|jamshedpur|bokaro|deoghar|hazaribagh|giridih|ramgarh|palamu|dumka|godda|sahibganj|pakur|jamtara|khunti|gumla|simdega|lohardaga|latehar|garhwa|koderma|chatra|chaibasa|saraikela)$/i.test(text)
        ) {
          return text;
        }
      }
    }
    return null;
  }

  extractDomainFromHistory(history = []) {
    if (!Array.isArray(history) || history.length === 0) return null;
    for (let i = history.length - 1; i >= 0; i--) {
      const item = history[i];
      if (item.draftReport?.domain) return item.draftReport.domain;
    }
    return null;
  }

  hasProblemContent(rawMessage, parsed) {
    const desc = (parsed?.problemDescription || '').trim();
    const lower = (rawMessage || '').toLowerCase().trim();

    const isJustSubmitCommand =
      /^(ek aur\s+)?(submit|shikayat|complain|complaint|darj|report|problem|samasya)\s*(karna hai|karni hai|karo|karein|hai|bhai)?$/i.test(lower) ||
      /^(mujhe\s+)?(ek aur\s+)?(naya|nayi|new|another)\s+(submit|problem|shikayat|issue|complaint)(\s+karna hai|\s+karni hai)?$/i.test(lower) ||
      /^(submit a challenge|naya challenge|new complaint|report problem|kuch complain karni hai|ek problem hai)$/i.test(lower) ||
      /^hey\s+(buddy|friend|bro)?,\s*how\s+do\s+i\s+submit/i.test(lower);

    if (isJustSubmitCommand) return false;

    if (desc.length > 4 && !/^(ek aur|naya|nayi|submit|karna hai|new complaint|problem hai)/i.test(desc)) {
      return true;
    }

    // Expanded keyword list: Hindi, Bhojpuri, Magahi, Hinglish, and common civic terms
    return /(paani|pani|water|bijli|light|current|batti|power|sadak|road|kachra|safai|garbage|drain|naali|nali|sewage|hospital|school|gaddha|gaddhe|pothole|leakage|toot|tuta|tutal|break|broken|damage|chori|pipeline|street\s*light|jam|traffic|danger|pollution|handpump|nal|kuda|dhalan|andhera|line|tar|taar|transformer|khamba|pole|badboo|gandagi|keechad|kado|dhasan|gir\s*gaya|marammat|repair|bimar|swasthya|rasta|raasta|hamaar|hamin|hamare|gali|mohalla|nahi\s+aa|nahi\s+hai|band\s+hai|kharab|phunka|bhar\s+ga|toofan|aandhi|flood|baarish|pani\s+bhara|makaan|makan|footpath|pareshani|takleef|musibat|bijli\s*cut|load\s*shedding|blackout|motor|pump|bore|kuan|parking|divider|bridge|pul)/i.test(lower);
  }
  detectDomainFromText(text) {
    if (!text) return null;
    const lower = text.toLowerCase();
    if (/(paani|pani|water|naali|nali|drain|sewage|handpump|motor|pipe|pipeline|leakage|borewell|kuan)/i.test(lower)) return 'Water Resources';
    if (/(bijli|light|current|power|voltage|transformer|khamba|pole|load\s*shedding|blackout|street\s*light)/i.test(lower)) return 'Energy';
    if (/(sadak|road|gaddha|pothole|footpath|divider|bridge|pul|traffic|jam)/i.test(lower)) return 'Urban Development';
    if (/(kachra|safai|garbage|kuda|gandagi|badboo|pollution)/i.test(lower)) return 'Environment';
    if (/(hospital|doctor|dawa|aspatal|nurse|treatment|ilaj|swasthya|health)/i.test(lower)) return 'Healthcare';
    if (/(school|college|padhai|shiksha|teacher|master|class)/i.test(lower)) return 'Education';
    if (/(kisan|kheti|crop|fasal|beej|tractor|anaaj)/i.test(lower)) return 'Agriculture';
    return null;
  }

  async askWhatToEdit({ history = [], effectiveLang = 'hi', hasHistory = false }) {
    let existingDraft = null;
    if (Array.isArray(history)) {
      for (let i = history.length - 1; i >= 0; i--) {
        if (history[i]?.draftReport) {
          existingDraft = history[i].draftReport;
          break;
        }
      }
    }

    const editAskPrompt = `The citizen wants to edit their drafted civic problem.
Current Draft Details:
- Title: ${existingDraft?.title || 'Civic Problem'}
- District: ${existingDraft?.district || 'Not specified'}
- Area: ${existingDraft?.areaOrBlock || 'Not specified'}
- Problem: "${existingDraft?.description || ''}"
- Evidence: ${Array.isArray(existingDraft?.media) ? existingDraft.media.length : 0} asset(s) attached.

TASK: Write a respectful, helpful message in ${effectiveLang} addressing them as 'Aap' or 'Bhai ji' (NEVER 'tu/tera') asking what they want to edit.
Divide into 2 short bubbles separated by "${BUBBLE_DELIMITER}".
- Bubble 1: Acknowledge that they want to edit their report.
- Bubble 2: Ask them clearly what to edit:
  1. 📍 **Location / Zila** (e.g. "Location Dhanbad kar do")
  2. 📝 **Samasya ka vivaran** (e.g. "Samasya me likho ki...")
  3. 📎 **Photo / Video evidence** (e.g. photo jodein ya badlein)
  Tell them they can speak, type, or tap the quick options below. Do NOT say Namaste.`;

    const aiAsk = await aiClient.generateCompletion([
      { role: 'system', content: languageManager.getRespectfulSystemPrompt(effectiveLang, hasHistory) },
      { role: 'user', content: editAskPrompt }
    ], 350, 0.3);

    let fallbackAsk = '';
    if (effectiveLang === 'en') {
      fallbackAsk = `Sure, you can edit any part of your complaint!${BUBBLE_DELIMITER}What would you like to change?\n• 📍 **Location / Area** (e.g. 'Change location to Dhanbad')\n• 📝 **Problem Description** (e.g. 'Update issue to...')\n• 📎 **Photo / Video Evidence** (attach or replace files)\n\nYou can speak, type your update, or tap the quick buttons below!`;
    } else {
      fallbackAsk = `Haan bhai ji, aap draft report mein koi bhi jaankari badal sakte hain!${BUBBLE_DELIMITER}Aapko kya edit karna hai?\n• 📍 **Location / Zila** (Jaise: 'Location Dhanbad kar do')\n• 📝 **Samasya ka vivaran** (Jaise: 'Samasya me likho ki...')\n• 📎 **Photo / Video evidence** (📎 se nayi photo jodein)\n\nAap bol kar, likh kar, ya neeche diye gaye buttons se vikalp chun sakte hain!`;
    }

    return {
      reply: aiAsk || fallbackAsk,
      intent: 'EDIT_DRAFT_INQUIRY',
      draftReport: null,
      showEditChips: true
    };
  }

  async prepareDraft({ parsed, rawMessage, history = [], media = [], user, userProfile, detectedDistrict, effectiveLang, hasHistory = false }) {
    // Check if an existing draft already exists in history to merge edits
    let existingDraft = null;
    if (Array.isArray(history)) {
      for (let i = history.length - 1; i >= 0; i--) {
        if (history[i]?.draftReport) {
          existingDraft = history[i].draftReport;
          break;
        }
      }
    }

    const hasCurrentProblem = this.hasProblemContent(rawMessage, parsed);
    const historyProblem = existingDraft?.description || this.extractProblemFromHistory(history);
    const hasAnyProblem = hasCurrentProblem || Boolean(historyProblem);

    // 1. If citizen hasn't described WHAT the problem is yet in current message OR history:
    if (!hasAnyProblem) {
      const askDetailsPrompt = `Citizen wants to submit a civic problem: "${rawMessage}".
They haven't described what is broken or needed.
Ask them warmly and respectfully in ${effectiveLang} as 'Aap' or 'Bhai ji' (NEVER 'tu/tera') what the problem is (roads, water, electricity, sanitation, etc.) and where in Jharkhand it is. Do NOT say Namaste.`;

      const aiAsk = await aiClient.generateCompletion([
        { role: 'system', content: languageManager.getRespectfulSystemPrompt(effectiveLang, hasHistory) },
        { role: 'user', content: askDetailsPrompt }
      ], 300, 0.3);

      const fallbackAsk = `Haan bhai ji, bilkul! Batayein, kya samasya hai?${BUBBLE_DELIMITER}Sadak, paani, bijli, safai ya koi aur dikkat? Aur yeh kis ilaqe ya zila ki baat hai, taaki hum turant madad kar sakein!`;

      return {
        reply: aiAsk || fallbackAsk,
        intent: 'SUBMIT_PROBLEM_NEED_DETAILS'
      };
    }

    const currentOrHistoryProblem = hasCurrentProblem ? (parsed?.problemDescription || rawMessage) : (historyProblem || rawMessage);

    // 2. District & Area resolution (with edit support)
    const newDistrictInMsg = languageManager.detectDistrict(rawMessage) || (parsed?.district && languageManager.detectDistrict(parsed.district));
    const finalDistrict = newDistrictInMsg || detectedDistrict || existingDraft?.district || null;

    if (!finalDistrict) {
      const askLocationPrompt = `The citizen reported a civic issue: "${currentOrHistoryProblem}".
We understood their problem. Now we ONLY need their Jharkhand District (ज़िला) and Locality/Area (मोहल्ला/इलाका).
TASK: Write a respectful request in ${effectiveLang} addressing them as 'Aap' or 'Bhai ji' (NEVER 'tu/tera').
STRICT RULE: Do NOT ask what their problem is again! We already know the problem is "${currentOrHistoryProblem}". ONLY ask for their Jharkhand District and Locality/Area. Do NOT say Namaste. Concise in 1-2 bubbles separated by "${BUBBLE_DELIMITER}".`;

      const aiAskLoc = await aiClient.generateCompletion([
        { role: 'system', content: languageManager.getRespectfulSystemPrompt(effectiveLang, hasHistory) },
        { role: 'user', content: askLocationPrompt }
      ], 300, 0.3);

      const fallbackLoc = `Bhai ji, aapki samasya samajh aa gayi hai.${BUBBLE_DELIMITER}Kripya apna **Zila (District)** aur **Mohalla/Area** batayein, taaki hum ise seedhe aapke Zila Nodal Adhikari tak bhej sakein! Agar photo/video ho toh 📎 se jod dein.`;

      return {
        reply: aiAskLoc || fallbackLoc,
        intent: 'SUBMIT_PROBLEM_NEED_LOCATION',
        suggestedDistrict: null
      };
    }

    // 3. Area / Locality resolution
    const cleanCandidateArea = (str) => {
      if (!str) return '';
      let prev = '';
      let curr = str;
      while (prev !== curr) {
        prev = curr;
        curr = curr
          .replace(/^(?:me|mein|par|pe|ke|ki|ka|se|near|paas|badal\s*kar|badlo|badal\s*do|change|location|area|zila|district|yeh\s*kar\s*do|ye\s*kar\s*do|yeh|ye|kar\s*do|kardo)\s+/gi, '')
          .replace(/\s+(?:me|mein|par|pe|ke|ki|ka|se|hai|tha|thi|kar\s*do|kardo|hoga|hogi)$/gi, '')
          .trim();
      }
      return curr;
    };

    let extractedArea = null;
    let textForArea = rawMessage;
    if (finalDistrict) {
      textForArea = textForArea.replace(new RegExp(`\\b${finalDistrict}\\b`, 'gi'), ' ');
    }

    // 3a. Check for specific landmarks, roads, colonies, mohallas, wards
    const roadMatch = textForArea.match(/([a-zA-Z0-9\u0900-\u097F\s]{2,25}\s*(?:road|chowk|colony|nagar|market|gali|mohalla|para|more|mod|mor|bazaar|bazar|station|stand|ward\s*\d+|sector\s*\d+))/i);
    if (roadMatch) {
      const candidate = cleanCandidateArea(roadMatch[1]);
      if (candidate.length >= 2 && !/(?:toot|kharab|gaya|gayi|beh|light|bijli|fat|jal)/i.test(candidate)) {
        extractedArea = candidate;
      }
    }

    // 3b. Strip common prompt/edit/action boilerplate
    if (!extractedArea) {
      const cleaned = cleanCandidateArea(textForArea
        .replace(/(?:location|area|zila|district|jagah|pata|address|mohalla|ward|block|nagar|chowk|road|sadak)\s*(?:badal\s*kar|badlo|badal\s*do|change\s*kar\s*do|change|kar\s*do|kar\s*de|kardo|karde|karo|hoga|hogi|hai)?\s*(?:yeh\s*kar\s*do|ye\s*kar\s*do|kar\s*do|kardo)?/gi, ' ')
        .replace(/(?:badal\s*kar\s*yeh\s*kar\s*do|badal\s*kar|badlo|badal\s*do|yeh\s*kar\s*do|ye\s*kar\s*do|kar\s*do|kar\s*de|kardo|karde|karo|likho|rakho|hoga|hogi|hona\s*chahiye|kripya|please|hamaara|hamara|mera|meri|mein|me|se|ko|pe|par|hai|tha|the|thi|ka|ke|ki|aur)[:\s]*/gi, ' ')
        .replace(/[:,\/\-\.]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim());

      const isProblemText = /(?:toot|kharab|gaya|gayi|paani|pani|beh|light|bijli|fat|jal|marammat|gaddha|pothole|naali|nali|kachra|drain)/i.test(cleaned);
      if (!isProblemText && cleaned.length >= 2 && !/^(haan|nahi|theek|submit|edit|darj|report|yes|no|ok)$/i.test(cleaned)) {
        extractedArea = cleaned;
      }
    }

    const districtChanged = Boolean(existingDraft && newDistrictInMsg && existingDraft.district && newDistrictInMsg.toLowerCase() !== existingDraft.district.toLowerCase());
    const isProblemArea = (val) => !val || /(?:toot|kharab|gaya|gayi|paani|pani|beh|light|bijli|fat|jal|marammat|gaddha|pothole|naali|nali|kachra|drain)/i.test(val);
    const parsedValidArea = (parsed?.areaOrBlock && !['Main Ward / Sector', '', 'None'].includes(parsed.areaOrBlock) && !isProblemArea(parsed.areaOrBlock)) ? parsed.areaOrBlock.trim() : null;
    const fallbackArea = districtChanged ? 'Main Ward / Sector' : (existingDraft?.areaOrBlock || 'Main Ward / Sector');
    const finalArea = extractedArea || parsedValidArea || fallbackArea;

    // 4. Description edit resolution
    const descPrefixMatch = rawMessage.match(/^(?:samasya me yeh likho|samasya me likho|samasya badal kar|samasya badlo|samasya badal do|problem badal kar|problem badlo|problem badal do|vivaran badal kar|vivaran badlo|naya vivaran|likho ki|ye likho|samasya ye hai|meri samasya yeh hai|problem yeh hai|vivaran yeh hai)[:\s]+(.+)$/i);
    const isExplicitDescEdit = Boolean(descPrefixMatch);
    const newDesc = isExplicitDescEdit ? descPrefixMatch[1].trim() : (hasCurrentProblem && !newDistrictInMsg && !extractedArea ? (parsed?.problemDescription || rawMessage) : null);
    const finalDescription = newDesc || existingDraft?.description || currentOrHistoryProblem;

    // 5. Domain & Title resolution
    const domain = (newDesc && this.detectDomainFromText(newDesc)) ||
      (parsed?.domain && VALID_DOMAINS.includes(parsed.domain) ? parsed.domain : null) ||
      (existingDraft?.domain || this.detectDomainFromText(finalDescription) || 'Urban Development');

    const priority = ['Low', 'Medium', 'High', 'Critical'].includes(parsed?.priority)
      ? parsed.priority
      : (existingDraft?.priority || 'Medium');

    const finalTitle = (newDesc || (existingDraft && finalDistrict !== existingDraft.district))
      ? `${domain} Issue in ${finalArea}, ${finalDistrict}`
      : (existingDraft?.title || (parsed?.title && parsed.title.length > 5 ? parsed.title : `${domain} Issue in ${finalArea}, ${finalDistrict}`));

    const isEditUpdate = Boolean(existingDraft && (newDistrictInMsg || extractedArea || newDesc || media.length > 0));

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

    if (existingDraft && Array.isArray(existingDraft.media)) existingDraft.media.forEach(addMediaItem);
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
      district: finalDistrict,
      areaOrBlock: finalArea,
      media: accumulatedMedia
    };

    const hasEvidence = accumulatedMedia.length > 0;
    const evidenceStatusText = hasEvidence
      ? `Evidence Attached: ${accumulatedMedia.length} ground photo/video asset(s) attached.`
      : `Evidence Attached: NONE. (Crucial: explicitly ask citizen whether they want to submit without evidence, or attach photo/video evidence first).`;

    const reviewPrompt = `Civic complaint ${isEditUpdate ? 'UPDATED by citizen' : 'analyzed'}:
Title: ${finalTitle}
District: ${finalDistrict}
Locality: ${finalArea}
Category: ${domain}
Problem: "${finalDescription}"
${evidenceStatusText}

TASK: Warm, respectful message in ${effectiveLang} addressing citizen as 'Aap' or 'Bhai ji' (NEVER 'tu/tera') reviewing their issue.
Divide into 2 short bubbles separated by "${BUBBLE_DELIMITER}".
- Bubble 1: ${isEditUpdate ? `Confirm warmly that their requested changes have been updated in the draft report.` : `State the exact problem they reported ("${finalDescription}") and that location (${finalArea}, ${finalDistrict}) has been verified under ${domain}.`}
- Bubble 2: ${
  hasEvidence
    ? `Confirm evidence is attached. Ask them to verify the updated preview card and tap 'Confirm & Submit' or say 'Haan submit kardo'.`
    : `Remind them that NO photo or video evidence is attached. Ask clearly: "Kya aap bina evidence ke hi problem submit karna chahte hain, ya photo/video attach karenge?" Tell them they can tap '📎 Photo / Video Jodein' to attach or tap 'Bina Evidence Submit' if they wish to proceed without photo.`
} Do NOT say Namaste.`;

    const aiReply = await aiClient.generateCompletion([
      { role: 'system', content: languageManager.getRespectfulSystemPrompt(effectiveLang, hasHistory) },
      { role: 'user', content: reviewPrompt }
    ], 500, 0.3);

    let fallbackReply = '';
    if (isEditUpdate) {
      if (effectiveLang === 'en') {
        fallbackReply = `I've updated your draft report as requested!${BUBBLE_DELIMITER}• **Location:** ${finalArea}, ${finalDistrict}\n• **Category:** ${domain}\n• **Issue:** ${finalDescription}\n\nPlease review the updated card and ${hasEvidence ? "tap **'Confirm & Submit'** to finalize!" : "tap **'Bina Evidence Submit'** or attach a photo via 📎!"}`;
      } else if (effectiveLang === 'hi') {
        fallbackReply = `भाई जी, आपके बताए अनुसार ड्राफ्ट रिपोर्ट अपडेट कर दी गई है:${BUBBLE_DELIMITER}• **स्थान:** ${finalArea}, ${finalDistrict}\n• **विभाग:** ${domain}\n• **समस्या:** ${finalDescription}\n\nकृपया नया प्रीव्यू कार्ड देखें और ${hasEvidence ? "**'Confirm & Submit'** दबाएं!" : "बिना प्रमाण के दर्ज करने के लिए **'Bina Evidence Submit'** दबाएं या 📎 से फ़ोटो जोड़ें!"}`;
      } else {
        fallbackReply = `Bhai ji, aapke bataye anusar draft report update kar di gayi hai:${BUBBLE_DELIMITER}• **Location:** ${finalArea}, ${finalDistrict}\n• **Category:** ${domain}\n• **Problem:** ${finalDescription}\n\nKripya naya preview card verify karein aur ${hasEvidence ? "**'Confirm & Submit'** dabayein!" : "bina photo ke submit karna ho toh **'Bina Evidence Submit'** dabayein ya 📎 se photo jodein!"}`;
      }
    } else if (effectiveLang === 'en') {
      fallbackReply = hasEvidence
        ? `Here is the verified summary of your complaint:${BUBBLE_DELIMITER}• **Issue:** ${finalDescription}\n• **District:** ${finalDistrict}\n• **Area:** ${finalArea}\n• **Category:** ${domain}\n• **Evidence:** ${accumulatedMedia.length} file(s) attached\n\nPlease review the card and tap **'Confirm & Submit'** to register your complaint!`
        : `Here is the verified summary of your complaint:${BUBBLE_DELIMITER}• **Issue:** ${finalDescription}\n• **District:** ${finalDistrict}\n• **Area:** ${finalArea}\n• **Category:** ${domain}\n\n⚠️ **Notice:** No ground photo/video evidence is attached. Would you like to attach evidence with 📎, or submit without evidence? Please choose an option below!`;
    } else if (effectiveLang === 'hi') {
      fallbackReply = hasEvidence
        ? `आपकी समस्या और लोकेशन का सत्यापन कर लिया गया है:${BUBBLE_DELIMITER}• **समस्या:** ${finalDescription}\n• **ज़िला:** ${finalDistrict}\n• **इलाका:** ${finalArea}\n• **विभाग:** ${domain}\n• **प्रमाण (Evidence):** ${accumulatedMedia.length} फ़ाइलें संलग्न\n\nयदि सभी विवरण सही हैं, तो नीचे **'Confirm & Submit'** दबाएं!`
        : `आपकी समस्या और लोकेशन नोट कर ली गई है:${BUBBLE_DELIMITER}• **समस्या:** ${finalDescription}\n• **ज़िला:** ${finalDistrict}\n• **इलाका:** ${finalArea}\n• **विभाग:** ${domain}\n\n⚠️ **ध्यान दें:** आपने कोई फ़ोटो या वीडियो प्रमाण (evidence) नहीं जोड़ा है। क्या आप बिना प्रमाण के ही समस्या दर्ज करना चाहते हैं, या फ़ोटो/वीडियो जोड़ेंगे? नीचे दिए गए विकल्प से चुनें!`;
    } else {
      fallbackReply = hasEvidence
        ? `Bhai ji, humne aapki darj samasya aur location ki jaanch kar ke preview taiyaar kiya hai:${BUBBLE_DELIMITER}• **समस्या (Issue):** ${finalDescription}\n• **ज़िला (District):** ${finalDistrict}\n• **इलाका (Area):** ${finalArea}\n• **विभाग (Domain):** ${domain}\n• **Evidence:** ${accumulatedMedia.length} file(s) attached\n\nAgar sab theek hai toh neeche **'Confirm & Submit'** button dabayein ya 'Haan submit kardo' kahein!`
        : `Bhai ji, humne aapki samasya aur location note kar li hai:${BUBBLE_DELIMITER}• **समस्या (Issue):** ${finalDescription}\n• **ज़िला (District):** ${finalDistrict}\n• **इलाका (Area):** ${finalArea}\n• **विभाग (Domain):** ${domain}\n\n⚠️ **Dhyan dein:** Aapne koi photo ya video evidence nahi joda hai. Kya aap bina evidence ke hi submit karna chahte hain, ya photo/video attach karenge? Neeche button se chunein ya bolkar batayein!`;
    }

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
