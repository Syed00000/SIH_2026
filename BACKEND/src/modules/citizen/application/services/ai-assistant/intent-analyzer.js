import { aiClient } from './ai-client.js';
import { JHARKHAND_DISTRICTS, VALID_DOMAINS } from './constants.js';
import logger from '../../../../../shared/logger/index.js';

class IntentAnalyzer {
  async analyze({ rawMessage, history = [], media = [], userDefaultDistrict = '' }) {
    const analysisSystemPrompt = `You are the intent and entity parser for JoharSetu (Jharkhand civic portal).
Classify citizen intent into one of:
1. "CONFIRM_SUBMISSION": User is confirming, agreeing, or approving to submit the drafted problem (e.g., "confirm", "haan submit kar do", "theek hai", "yes proceed", "submit kardo").
2. "WITHDRAW_PROBLEM": User wants to withdraw/retract an active problem.
3. "DELETE_PROBLEM": User wants to delete/remove an unassigned problem.
4. "TRACK_PROBLEM": User wants status update, asks "kya hua", provides a Problem ID, asks about submission date, or asks for problem list.
5. "SUBMIT_PROBLEM": User describes a civic issue or provides/updates location or problem details (e.g. "Location Dhanbad kar do", "Samasya me likho...").
6. "EDIT_DRAFT": User says they want to edit or change the draft in general without providing specific new details yet (e.g., "edit karna hai", "kuch badalna hai", "badalna hai", "kuch galat hai", "edit karo", "EDIT_DRAFT", "sudhar karna hai").
7. "GENERAL_QUERY": Portal info, greetings, general questions.

If "SUBMIT_PROBLEM", extract:
- problemDescription, district (${JHARKHAND_DISTRICTS.join(', ')}), areaOrBlock, domain (${VALID_DOMAINS.join(', ')}), priority ("Low"|"Medium"|"High"|"Critical"), title (4-8 words), isLocationProvided (boolean).

If "TRACK_PROBLEM", "WITHDRAW_PROBLEM", or "DELETE_PROBLEM", extract:
- challengeId (e.g. CHL-JH-2026-XXXX)

Output ONLY valid JSON:
{
  "intent": "CONFIRM_SUBMISSION" | "WITHDRAW_PROBLEM" | "DELETE_PROBLEM" | "TRACK_PROBLEM" | "SUBMIT_PROBLEM" | "EDIT_DRAFT" | "GENERAL_QUERY",
  "problemDescription": "...",
  "district": "...",
  "areaOrBlock": "...",
  "domain": "...",
  "priority": "...",
  "title": "...",
  "isLocationProvided": boolean,
  "challengeId": "..."
}`;

    const recentHistoryText = (Array.isArray(history) ? history.slice(-5) : [])
      .map((h) => `${h.role === 'user' ? 'Citizen' : 'Assistant'}: ${h.content}`)
      .join('\n');

    let parsed = null;
    try {
      const rawJson = await aiClient.generateCompletion([
        { role: 'system', content: analysisSystemPrompt },
        {
          role: 'user',
          content: `CONVERSATION:\n${recentHistoryText || 'None'}\n\nLATEST MESSAGE:\n"${rawMessage}"\nMedia Attached: ${media.length}\nUser District: ${userDefaultDistrict}`
        }
      ], 400, 0.1);
      parsed = aiClient.parseJsonSafely(rawJson);
    } catch (err) {
      logger.warn({ msg: 'Intent parsing failed', err: err.message });
    }

    // Heuristics fallback
    const lower = rawMessage.toLowerCase().trim();
    const actionPrefixMatch = rawMessage.match(/^(CONFIRM_WITHDRAW|CONFIRM_DELETE|WITHDRAW|DELETE):\s*(CHL-JH-\d{4}-\d+|CH-JH-\d{4}-\d+|CH-[A-Z0-9-]+)/i);
    const challengeIdMatch = rawMessage.match(/\b(CH-JH-\d{4}-\d+|CHL-JH-\d{4}-\d+|CH-[A-Z0-9-]+)\b/i);

    // Cancel guard — must be checked FIRST so it doesn't match withdraw/delete patterns
    const isCancelAction =
      /^(rehne do|cancel karo|nahi karna|nahi|mat karo|choddo|chhodo|ruk|ruk ja|cancel)\b/i.test(lower) ||
      /(रहने दो|रद्द करो|कैंसिल करो|नहीं करना|मत करो|छोड़ो)/.test(rawMessage);
    if (isCancelAction) {
      return { parsed: { intent: 'CANCEL_ACTION' }, challengeIdMatch: null, recentHistoryText };
    }

    const isConfirmWithdraw =
      rawMessage.startsWith('CONFIRM_WITHDRAW:') ||
      /\b(confirm withdraw|haan withdraw|pakka withdraw|haan wapas|wapas le lo)\b/i.test(lower) ||
      (/\b(confirm|haan|yes|ha|theek hai|proceed)\b/i.test(lower) && /withdraw|wapas|waapas/i.test(recentHistoryText)) ||
      /(हाँ वापस लो|वापस ले लो|हाँ वापस|वापस लें|पुष्टि करें और वापस लें)/.test(rawMessage);

    const isConfirmDelete =
      rawMessage.startsWith('CONFIRM_DELETE:') ||
      /\b(confirm delete|haan delete|pakka delete|hata do)\b/i.test(lower) ||
      (/\b(confirm|haan|yes|ha|theek hai|proceed)\b/i.test(lower) && /delete|hata|mitana/i.test(recentHistoryText)) ||
      /(हाँ हटा दो|हटा दो|डिलीट करो|स्थायी रूप से हटाएं)/.test(rawMessage);

    // Only explicit multi-word confirm phrases, OR a bare short "yes/haan/confirm" WITH draft in history
    // NEVER match if the message has new-problem keywords (aur, naya, doosra, ek aur, karna hai)
    const hasNewProblemKeyword = /\b(aur|naya|nayi|doosra|doosri|ek aur|new|another|phir se|dubara)\b/i.test(lower);
    const isExplicitConfirmSubmit =
      !isConfirmWithdraw &&
      !isConfirmDelete &&
      !hasNewProblemKeyword &&
      (rawMessage.startsWith('CONFIRM_SUBMIT:') ||
        /\b(confirm & submit|submit kardo|haan submit kardo|theek hai submit|haan bhej do|theek hai darj karo|darj kar do|bina photo|bina evidence|without evidence|without photo|bina tasveer|bina video|haan bina evidence)\b/i.test(lower) ||
        /(हाँ सबमिट कर दो|सबमिट कर दो|पुष्टि करें और सबमिट करें|दर्ज कर दो|हाँ दर्ज करें|बिना प्रमाण सबमिट करें|बिना प्रमाण सबमिट|बिना फोटो सबमिट करें)/.test(rawMessage) ||
        (/^(confirm|yes|haan|ha|proceed|bhej do|theek hai|हाँ|ठीक है|सबमिट)$/i.test(lower) &&
          /location|draft|darj|report|zila|district|लोकेशन|ज़िला|शिकायत/i.test(recentHistoryText)));

    const isExplicitWithdraw =
      isConfirmWithdraw ||
      Boolean(actionPrefixMatch && actionPrefixMatch[1].toUpperCase().includes('WITHDRAW')) ||
      /\b(withdraw|wapas|waapas|radd)\b/i.test(lower) ||
      /(वापस|रद्द|विथड्रॉ)/.test(rawMessage);

    const isExplicitDelete =
      isConfirmDelete ||
      Boolean(actionPrefixMatch && actionPrefixMatch[1].toUpperCase().includes('DELETE')) ||
      /\b(delete|hata do|hatao|mitana|remove|trash|डिलीट)\b/i.test(lower) ||
      /(हटा दें|हटाएं|हटा दो)/.test(rawMessage);

    const isExplicitTracking =
      challengeIdMatch ||
      /\b(track|status|kya hua|kahan hai|progress|meri problem|shikayat ka kya|update|list|tareekh|tareeq|tarikh|तारीख|pichhla|pichhli|complaint)\b/i.test(lower) ||
      /(ट्रैक|स्थिति|स्टेटस|कहाँ है|प्रगति|मेरी शिकायत|मेरी समस्या|पिछली शिकायत)/.test(rawMessage);

    const hasDraftInHistory = Array.isArray(history) && history.some(h => Boolean(h.draftReport));
    const isExplicitEdit =
      hasDraftInHistory &&
      (rawMessage.startsWith('EDIT_DRAFT') ||
        /\b(edit karna hai|kuch edit|badalna hai|change karna hai|modify karna hai|sudhaar|sudhar|galat likha hai|galat hai|kuch galat|edit karo|edit draft|kuch badalna|edit option|kya edit)\b/i.test(lower) ||
        /(एडिट|बदलना है|सुधार|गलत है|संशोधन)/.test(rawMessage));

    if (isExplicitEdit) {
      parsed = parsed || {};
      parsed.intent = 'EDIT_DRAFT';
    } else if (isExplicitWithdraw) {
      parsed = parsed || {};
      parsed.intent = 'WITHDRAW_PROBLEM';
      if (actionPrefixMatch) parsed.challengeId = actionPrefixMatch[2];
      else if (challengeIdMatch) parsed.challengeId = challengeIdMatch[0];
    } else if (isExplicitDelete) {
      parsed = parsed || {};
      parsed.intent = 'DELETE_PROBLEM';
      if (actionPrefixMatch) parsed.challengeId = actionPrefixMatch[2];
      else if (challengeIdMatch) parsed.challengeId = challengeIdMatch[0];
    } else if (isExplicitConfirmSubmit) {
      parsed = parsed || {};
      parsed.intent = 'CONFIRM_SUBMISSION';
    } else if (isExplicitTracking && (!parsed || parsed.intent === 'GENERAL_QUERY')) {
      parsed = parsed || {};
      parsed.intent = 'TRACK_PROBLEM';
      if (challengeIdMatch) parsed.challengeId = challengeIdMatch[0];
    } else if (!parsed) {
      const isSubmission = /(paani|bijli|pani|light|road|sadak|kachra|drain|naali|sewage|hospital|school|problem|samasya|gaddha|shikayat|repair|broken|damage|issue|पानी|बिजली|सड़क|सड़कें|कचरा|सफाई|नाली|सीवर|अस्पताल|स्कूल|समस्या|शिकायत|गड्डा|गड्ढा|टूटी|खराब|बह|लाइट|ट्रांसफॉर्मर|खंभा|प्रदूषण)/i.test(rawMessage);
      parsed = {
        intent: isSubmission ? 'SUBMIT_PROBLEM' : 'GENERAL_QUERY',
        challengeId: challengeIdMatch ? challengeIdMatch[0] : null,
        isLocationProvided: false
      };
    }

    return { parsed, challengeIdMatch, recentHistoryText };
  }

  matchChallengesByDate(challenges, text) {
    if (!text || !Array.isArray(challenges) || challenges.length === 0) return [];
    const lower = text.toLowerCase();
    const now = new Date();

    if (/\b(aaj|today)\b/i.test(lower)) {
      const d = now.getDate(), m = now.getMonth(), y = now.getFullYear();
      return challenges.filter((c) => {
        const cd = new Date(c.createdAt || c.submittedAt);
        return cd.getDate() === d && cd.getMonth() === m && cd.getFullYear() === y;
      });
    }

    if (/\b(kal|yesterday|pichhle din)\b/i.test(lower)) {
      const yDate = new Date(now);
      yDate.setDate(yDate.getDate() - 1);
      const d = yDate.getDate(), m = yDate.getMonth(), y = yDate.getFullYear();
      return challenges.filter((c) => {
        const cd = new Date(c.createdAt || c.submittedAt);
        return cd.getDate() === d && cd.getMonth() === m && cd.getFullYear() === y;
      });
    }

    const dayMatch =
      lower.match(/\b([1-9]|[12][0-9]|3[01])\s*(?:tareekh|tareeq|tarikh|तारीख|st|nd|rd|th|ko|\/|-)/i) ||
      lower.match(/\b(?:date|tareekh|tareeq|tarikh|तारीख)\s*([1-9]|[12][0-9]|3[01])\b/i);

    if (dayMatch) {
      const targetDay = parseInt(dayMatch[1], 10);
      return challenges.filter((c) => {
        const cd = new Date(c.createdAt || c.submittedAt);
        return cd.getDate() === targetDay;
      });
    }

    return [];
  }
}

export const intentAnalyzer = new IntentAnalyzer();
