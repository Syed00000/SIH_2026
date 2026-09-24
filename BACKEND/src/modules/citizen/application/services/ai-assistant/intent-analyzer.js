import { aiClient } from './ai-client.js';
import { JHARKHAND_DISTRICTS, VALID_DOMAINS } from './constants.js';
import logger from '../../../../../shared/logger/index.js';

class IntentAnalyzer {
  async analyze({ rawMessage, history = [], media = [], userDefaultDistrict = '' }) {
    const analysisSystemPrompt = `You are the accurate intent and entity parser for JoharSetu (Government of Jharkhand civic innovation portal).
Classify citizen intent into one of:
1. "CONFIRM_SUBMISSION": User is explicitly confirming/approving to submit a drafted complaint (e.g., "confirm", "haan submit kardo", "theek hai submit kar do", "yes submit", "proceed").
2. "WITHDRAW_PROBLEM": User wants to withdraw an active complaint.
3. "DELETE_PROBLEM": User wants to delete/remove an unassigned complaint.
4. "TRACK_PROBLEM": User wants status update, asks "kya hua", provides a Problem ID (CHL-JH-...), asks about submission date, or asks for problem list.
5. "SUBMIT_PROBLEM": User is actively reporting or asserting a real, on-ground civic breakdown (e.g. "water pipe broken in Bariatu", "road pothole in Ranchi", "transformer burnt in Dhanbad", "sewage overflow") or providing/updating location/problem details. NOT questions asking how the portal works!
6. "EDIT_DRAFT": User says they want to edit or change the draft in general without providing specific new details yet (e.g., "edit karna hai", "kuch badalna hai", "badalna hai", "kuch galat hai", "edit karo", "EDIT_DRAFT", "sudhar karna hai").
7. "GENERAL_QUERY": General inquiries, questions about how portal works, login/registration help, department helplines, emergency numbers, university research & grants, rules, greetings, small talk.

CRITICAL RULES:
- Base intent, domain, and problem strictly on the LATEST MESSAGE.
- NEVER drag forward or inherit previous topics (like electricity or water) into new questions or greetings.
- If the latest message is an inquiry (e.g. "what is the helpline", "how to submit", "tell me about roads", "login issues"), it MUST be classified as "GENERAL_QUERY".

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

    // Heuristics fallback & disambiguation
    const lower = rawMessage.toLowerCase().trim();
    const actionPrefixMatch = rawMessage.match(/^(CONFIRM_WITHDRAW|CONFIRM_DELETE|WITHDRAW|DELETE):\s*(CHL-JH-\d{4}-\d+|CH-JH-\d{4}-\d+|CH-[A-Z0-9-]+)/i);
    const challengeIdMatch = rawMessage.match(/\b(CH-JH-\d{4}-\d+|CHL-JH-\d{4}-\d+|CH-[A-Z0-9-]+)\b/i);

    // Cancel guard
    const isCancelAction = /^(rehne do|cancel karo|nahi karna|nahi|mat karo|choddo|chhodo|ruk|ruk ja)\b/i.test(lower);
    if (isCancelAction) {
      return { parsed: { intent: 'GENERAL_QUERY' }, challengeIdMatch: null, recentHistoryText };
    }

    const isConfirmWithdraw =
      rawMessage.startsWith('CONFIRM_WITHDRAW:') ||
      /\b(confirm withdraw|haan withdraw|pakka withdraw|haan wapas|wapas le lo)\b/i.test(lower) ||
      (/\b(confirm|haan|yes|ha|theek hai|proceed)\b/i.test(lower) && /withdraw|wapas|waapas/i.test(recentHistoryText));

    const isConfirmDelete =
      rawMessage.startsWith('CONFIRM_DELETE:') ||
      /\b(confirm delete|haan delete|pakka delete|hata do)\b/i.test(lower) ||
      (/\b(confirm|haan|yes|ha|theek hai|proceed)\b/i.test(lower) && /delete|hata|mitana/i.test(recentHistoryText));

    const hasNewProblemKeyword = /\b(aur|naya|nayi|doosra|doosri|ek aur|new|another|phir se|dubara)\b/i.test(lower);
    const isExplicitConfirmSubmit =
      !isConfirmWithdraw &&
      !isConfirmDelete &&
      !hasNewProblemKeyword &&
      (rawMessage.startsWith('CONFIRM_SUBMIT:') ||
        /\b(confirm & submit|submit kardo|haan submit kardo|theek hai submit|haan bhej do|theek hai darj karo|darj kar do|bina photo|bina evidence|without evidence|without photo|bina tasveer|bina video|haan bina evidence)\b/i.test(lower) ||
        (/^(confirm|yes|haan|ha|proceed|bhej do|theek hai)$/i.test(lower) &&
          /location|draft|darj|report|zila|district/i.test(recentHistoryText)));

    const isExplicitWithdraw =
      isConfirmWithdraw ||
      Boolean(actionPrefixMatch && actionPrefixMatch[1].toUpperCase().includes('WITHDRAW')) ||
      /\b(withdraw|wapas|waapas|radd|wapas lena hai)\b/i.test(lower);

    const isExplicitDelete =
      isConfirmDelete ||
      Boolean(actionPrefixMatch && actionPrefixMatch[1].toUpperCase().includes('DELETE')) ||
      /\b(delete|hata do|hatao|mitana|remove|trash|डिलीट)\b/i.test(lower);

    const isExplicitTracking =
      challengeIdMatch ||
      /\b(track|status|kya hua|kahan hai|progress|meri problem|shikayat ka kya|update|list|tareekh|tareeq|tarikh|तारीख|pichhla|pichhli|complaint status)\b/i.test(lower);

    // Is the user asking an informational question?
    const isInformationalQuery =
      /\b(kaise|how to|kya hai|what is|kahan|where|kab|when|kyun|why|who|helpline|number|toll free|contact|jaankari|batao|bataiye|explain|details|list|rules|process|timing|login|register|signup|password|role|student|university|grant|scholarship|internship|portal|platform)\b/i.test(lower);

    // Active ground assertion (user reporting an actual fault on the ground)
    const isGroundProblemAssertion =
      (/\b(hamare yahan|hamare mohalle|mera area|mere ghar|gali me|road pe|sadak pe|yahan|yaha|colony me|ward me|village me|gaon me)\b/i.test(lower) ||
       /\b(toota hai|tooti hai|kharab hai|band hai|nahi aa raha|nahi aati|overflow|jal gaya|current aa raha|gaddha hai|paani bhar gaya|kachra pada hai|badbu aa rahi hai|darkness hai|andhera hai|leakage ho rahi hai)\b/i.test(lower) ||
       /\b(broken|damaged|overflowing|not working|leaking|flooded|pothole|power cut for|no water since)\b/i.test(lower)) &&
      !isInformationalQuery;

    const hasDraftInHistory = Array.isArray(history) && history.some(h => Boolean(h.draftReport));
    const isExplicitEdit =
      hasDraftInHistory &&
      (rawMessage.startsWith('EDIT_DRAFT') ||
        /\b(edit karna hai|kuch edit|badalna hai|change karna hai|modify karna hai|sudhaar|sudhar|galat likha hai|galat hai|kuch galat|edit karo|edit draft|kuch badalna|edit option|kya edit)\b/i.test(lower));

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
    } else if (isInformationalQuery && !isGroundProblemAssertion) {
      // STRICTLY General query for informational questions, even if they contain words like "paani" or "problem"
      parsed = {
        intent: 'GENERAL_QUERY',
        challengeId: null,
        isLocationProvided: false
      };
    } else if (isGroundProblemAssertion) {
      parsed = {
        intent: 'SUBMIT_PROBLEM',
        problemDescription: rawMessage,
        challengeId: null,
        isLocationProvided: false
      };
    } else if (!parsed) {
      parsed = {
        intent: 'GENERAL_QUERY',
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
export default intentAnalyzer;
