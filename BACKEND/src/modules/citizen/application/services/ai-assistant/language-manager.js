import { JHARKHAND_DISTRICTS, DISTRICT_ALIASES, BUBBLE_DELIMITER } from './constants.js';

class LanguageManager {
  detectDistrict(text) {
    if (!text) return null;
    const lower = text.toLowerCase();
    for (const [alias, canonical] of Object.entries(DISTRICT_ALIASES)) {
      if (new RegExp(`\\b${alias}\\b`, 'i').test(lower)) return canonical;
    }
    for (const d of JHARKHAND_DISTRICTS) {
      if (new RegExp(`\\b${d.toLowerCase()}\\b`, 'i').test(lower)) return d;
    }
    return null;
  }

  detectLanguage(text, selectedLanguage = null) {
    const raw = String(text || '').trim();
    const lower = raw.toLowerCase();

    // 1. Explicit native script detection (high priority)
    if (/[\u1C50-\u1C7F]/.test(raw) || /\b(johar|gate|menama|santal|santhali|ape|inj|am|dak|bah)\b/i.test(lower)) {
      return 'sat';
    }
    if (/[\u0980-\u09FF]/.test(raw)) {
      return 'bn';
    }
    if (/[\u0900-\u097F]/.test(raw)) {
      return 'hi';
    }

    // 2. If user explicitly selected a language in the UI, strictly respect it for Latin/standard inputs
    if (selectedLanguage === 'en') return 'en';
    if (selectedLanguage === 'hi') return 'hi';
    if (selectedLanguage === 'bn') return 'bn';
    if (selectedLanguage === 'sat') return 'sat';

    // 3. Check for distinct English sentence markers
    const englishWordMatches = (lower.match(/\b(what|how|where|when|why|who|which|is|are|the|this|that|please|tell|about|problem|issue|status|track|complaint|department|departments|university|emergency|number|helpline|login|register|portal|government|water|electricity|road|power|citizen|contact|main|can|you|help|my|in|for|with|details|explain|give|provide|how to|what is)\b/gi) || []).length;

    // Distinct unambiguous Hinglish keywords
    const hinglishWordMatches = (lower.match(/\b(bhai|bhaiya|yaar|kaise|kya|karo|kardo|karein|karna|karni|hua|hai|hain|ho|nahi|nhi|paani|pani|bijli|sadak|sadkein|kachra|gaddha|gaddhe|shikayat|samasya|mera|meri|mere|batana|batao|bata|btao|bataiye|dekh|dekho|kahan|kidhar|kab|kyun|hoga|tha|thi|mujhe|apna|apni|aap|aapka|aapki|aapko|theek|thik|achha|acha|chahiye|raha|rahi|aaya|aayi|tareekh|tarikh|pichhla|wapas|hatao|madad|bhejo|nikalo|darj)\b/gi) || []).length;

    if (englishWordMatches >= hinglishWordMatches && englishWordMatches > 0) {
      return 'en';
    }

    if (hinglishWordMatches > 0) {
      return 'hinglish';
    }

    if (/^[a-zA-Z0-9\s.,!?'"()-]+$/.test(raw)) {
      return 'en';
    }

    return 'en';
  }

  getRespectfulSystemPrompt(effectiveLang, hasHistory = false) {
    let languageInstruction = '';

    switch (effectiveLang) {
      case 'hi':
        languageInstruction = `STRICT LANGUAGE: Respond ONLY in polite, respectful Hindi (Devanagari script: हिन्दी).
नागरिक को हमेशा 'आप', 'आपका', 'आपकी' या 'भाई जी' कहकर सम्मान दें। 'तू/तेरा/तेरी' का प्रयोग पूर्णतः वर्जित है। उत्तर केवल हिन्दी (देवनागरी) में ही दें।`;
        break;
      case 'bn':
        languageInstruction = `STRICT LANGUAGE: Respond ONLY in polite, respectful Bengali (বাংলা script).
Address the citizen politely with 'আপনি' (Apni), 'আপনার' (Apnar), or 'ভাই' (Bhai). Respond entirely in Bengali.`;
        break;
      case 'sat':
        languageInstruction = `STRICT LANGUAGE: Respond ONLY in respectful Santhali (Ol Chiki ᱥᱟᱱᱛᱟᱲᱤ script or standard Santhali).
Speak warmly and respectfully with 'ᱡᱚᱦᱟᱨ' (Johar).`;
        break;
      case 'en':
        languageInstruction = `STRICT LANGUAGE: Pure, fluent, professional, and empathetic English. You MUST respond ENTIRELY in English. Do NOT mix Hindi or Hinglish words unless referring to official proper names (e.g. "JoharSetu", "Mukhyamantri Jan Samvad"). Address the citizen politely and helpfully.`;
        break;
      case 'hinglish':
      default:
        languageInstruction = `STRICT LANGUAGE: Respond ONLY in natural, respectful Hinglish (Roman script).
नागरिक से हमेशा आदर से बात करें: 'Aap', 'Aapka', 'Aapki', 'Bhai ji'.
भूलकर भी 'tu', 'tera', 'teri', 'tujhe' का इस्तेमाल मत करना!`;
        break;
    }

    const greetingRule = hasHistory
      ? `STRICT PROHIBITION: DO NOT say 'Namaste', 'Johar', 'Pranam', 'Hello', 'Hi', or ANY introductory greeting! This is an ONGOING conversation. Repeating greetings in later turns is strictly forbidden. Start directly addressing them with respect: 'Bhai ji, ...' or 'Regarding your query...' and jump straight to the topic.`
      : `INITIAL GREETING: First turn of session. You may include a single brief greeting ('Namaste bhai ji / Johar 🙏' in Hindi/Hinglish, or 'Hello' in English).`;

    return `You are "JoharSetu Assistant" (जोहारसेतु सहायक) - the official AI civic assistant for the Government of Jharkhand.
You assist citizens with registering local civic problems, tracking complaint status, providing department helplines, and facilitating university innovation.

KEY KNOWLEDGE BASE (JHARKHAND CIVIC GOVERNANCE):
- Emergency Police / National Emergency: 112 / 100
- Fire Emergency: 101
- Ambulance / Medical: 108 / 102
- Electricity (JBVNL) Grievance & Outages: 1912
- Jharkhand Jan Samvad Grievance Portal: 181
- Drinking Water & Sanitation (DWSD): 1800-345-6540
- Women Helpline: 1091 / 181
- Childline: 1098
- Key Departments: JBVNL (Energy), DWSD (Water), RCD/PWD (Roads), UDHD/Municipalities (Urban Sanitation, Drainage, Streetlights), Health & Family Welfare.
- University Innovation Partners: BIT Mesra (Smart Energy/AI), NIT Jamshedpur (Civil Infra/Flood), IIT ISM Dhanbad (Clean Groundwater/Mining), Ranchi University.
- 24 Districts across Jharkhand.

CRITICAL RULES:
1. RESPECTFUL TONE (MANDATORY): Always polite and helpful. NEVER use "tu/tera/teri/tujhe".
2. ${languageInstruction}
3. GREETING CONSTRAINT: ${greetingRule}
4. MULTI-BUBBLE FORMATTING: Divide your response into 2 to 3 readable message bubbles separated by "${BUBBLE_DELIMITER}".
5. NO RAW MARKDOWN TABLES: NEVER output markdown tables with pipe characters (|). Use clean bullet points or numbered lists.
6. TOPIC ACCURACY: Answer the user's EXACT query directly. Never get stuck on previous topics. If they ask about roads, water, login, or helplines, answer that topic immediately without referencing unrelated electricity or prior topics.`;
  }
}

export const languageManager = new LanguageManager();
export default languageManager;
