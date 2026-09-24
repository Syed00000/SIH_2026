import { JHARKHAND_DISTRICTS, DISTRICT_ALIASES, BUBBLE_DELIMITER } from './constants.js';

class LanguageManager {
  detectDistrict(text) {
    if (!text) return null;
    const lower = text.toLowerCase();
    for (const [alias, canonical] of Object.entries(DISTRICT_ALIASES)) {
      const aliasLower = alias.toLowerCase();
      // For Devanagari or Unicode scripts, regex \b fails, so use substring/space matching
      if (/[\u0900-\u097F]/.test(alias)) {
        if (lower.includes(aliasLower)) return canonical;
      } else {
        if (new RegExp(`\\b${aliasLower}\\b`, 'i').test(lower)) return canonical;
      }
    }
    for (const d of JHARKHAND_DISTRICTS) {
      if (new RegExp(`\\b${d.toLowerCase()}\\b`, 'i').test(lower)) return d;
    }
    return null;
  }

  detectLanguageSwitch(text) {
    if (!text) return null;
    const lower = text.toLowerCase().trim();
    if (
      /\b(?:hindi|हिन्दी)\s*(?:me|mein|mai)?\s*(?:bol|bolo|boliye|baat|likh|likho|jawab|jwaab|bol\s*na|bolna|samjha|batao)\b/i.test(lower) ||
      /\b(?:talk|speak|reply|respond|answer|switch\s*to)\s*(?:in|using)?\s*hindi\b/i.test(lower) ||
      /\b(?:hindi\s*please|in\s*hindi|hindi\s*me|hindi\s*mein)\b/i.test(lower) ||
      /^(?:hindi|हिन्दी)$/i.test(lower)
    ) {
      return 'hi';
    }
    if (
      /\b(?:english|अंग्रेजी)\s*(?:me|mein|mai)?\s*(?:bol|bolo|boliye|baat|likh|likho|jawab|jwaab|bol\s*na|bolna|samjha|batao)\b/i.test(lower) ||
      /\b(?:talk|speak|reply|respond|answer|switch\s*to)\s*(?:in|using)?\s*english\b/i.test(lower) ||
      /\b(?:in\s*english|english\s*please|english\s*me|english\s*mein)\b/i.test(lower) ||
      /^(?:english|अंग्रेजी)$/i.test(lower)
    ) {
      return 'en';
    }
    if (/\b(?:hinglish)\s*(?:me|mein|mai)?\s*(?:bol|bolo|boliye|baat|likh|likho|jawab|jwaab)\b/i.test(lower) || /^(?:hinglish)$/i.test(lower)) {
      return 'hinglish';
    }
    if (/\b(?:bengali|bangla)\s*(?:me|mein|in)?\s*(?:bol|bolo|katha|boliye)\b/i.test(lower) || /^(?:bengali|bangla)$/i.test(lower)) {
      return 'bn';
    }
    if (/\b(?:santhali|ol\s*chiki)\s*(?:me|mein|in)?\s*(?:bol|bolo|ror)\b/i.test(lower) || /^(?:santhali|ol\s*chiki)$/i.test(lower)) {
      return 'sat';
    }
    return null;
  }

  detectLanguage(text, selectedLanguage = null) {
    const raw = String(text || '').trim();
    const lower = raw.toLowerCase();

    // 0. Explicit language switch command in current message OVERRIDES everything!
    const switchLang = this.detectLanguageSwitch(raw);
    if (switchLang) return switchLang;

    // 1. Script-based detection (Devanagari, Bengali, Ol Chiki ALWAYS dictate their script language!)
    if (/[\u1C50-\u1C7F]/.test(raw) || /\b(johar|gate|menama|santal|santhali|ape|inj|am|dak|bah)\b/i.test(lower)) {
      return 'sat';
    }
    if (/[\u0980-\u09FF]/.test(raw)) return 'bn';
    if (/[\u0900-\u097F]/.test(raw)) return 'hi';

    // 2. Explicit user selected language
    if (selectedLanguage === 'en') return 'en';
    if (selectedLanguage === 'hi') return 'hi';
    if (selectedLanguage === 'bn') return 'bn';
    if (selectedLanguage === 'sat') return 'sat';
    if (selectedLanguage === 'hinglish') return 'hinglish';

    // 3. Distinct Hinglish keywords check (excluding common English words like 'do', 'me', 'na', 'to', 'is', 'go')
    const hinglishDistinctPattern = /\b(bhai|bhaiya|yaar|kaise|kya|karo|kardo|karein|kar\s+do|bata\s+do|bhej\s+do|hata\s+do|hua|hai|hain|ho|nahi|nhi|paani|pani|bijli|sadak|sadkein|kachra|gaddha|gaddhe|gadda|shikayat|samasya|mera|meri|mere|batana|batao|bata|btao|dekh|dekho|bol|bolo|wala|wali|wale|kahan|kidhar|kab|kyun|hoga|karna|tha|thi|the|mujhe|apna|apni|aap|aapka|aapki|aapko|sun|suno|theek|thik|achha|acha|chahiye|chal|raha|rahi|aaya|aayi|tareekh|tareeq|tarikh|pichhla|wapas|hata|hatao|madad|bhejo|nikalo)\b/i;

    if (hinglishDistinctPattern.test(lower)) return 'hinglish';

    // 4. Default to 'en' for English Latin script
    if (/^[a-zA-Z0-9\s.,!?'"()\-:\/\\]+$/.test(raw)) {
      return 'en';
    }

    return 'en';
  }

  getRespectfulSystemPrompt(effectiveLang, hasHistory = false) {
    let languageInstruction = '';

    switch (effectiveLang) {
      case 'hi':
        languageInstruction = `STRICT LANGUAGE REQUIREMENT: You MUST reply 100% in pure Hindi using Devanagari script (हिन्दी).
CRITICAL: Do NOT use Latin/English letters (A-Z). Do NOT use English words or Hinglish.
Every single sentence must be written in Devanagari script. Address the citizen respectfully as 'आप', 'आपका', 'आपकी' (कभी 'तू/तेरा' न कहें)।`;
        break;
      case 'bn':
        languageInstruction = `STRICT LANGUAGE REQUIREMENT: Respond ONLY in polite, respectful Bengali (বাংলা script).
Address the citizen politely with 'আপনি' (Apni), 'আপনার' (Apnar).`;
        break;
      case 'sat':
        languageInstruction = `STRICT LANGUAGE REQUIREMENT: Respond ONLY in respectful Santhali (Ol Chiki ᱥᱟᱱᱛᱟᱲᱤ script or standard Santhali).
Speak warmly and respectfully with 'ᱡᱚᱦᱟᱨ' (Johar).`;
        break;
      case 'en':
        languageInstruction = `STRICT LANGUAGE REQUIREMENT: You MUST reply 100% in pure, professional, polite, and clear English.
Address the citizen respectfully as a valued resident of Jharkhand.
CRITICAL: Do NOT use Hindi or Hinglish words (such as 'Namaste', 'bhai ji', 'samasya', 'shikayat', 'aapka', 'darj', 'zila') when replying to an English prompt. Output standard English only.`;
        break;
      case 'hinglish':
      default:
        languageInstruction = `STRICT LANGUAGE REQUIREMENT: Reply in polite, clean, natural conversational Hinglish (Hindi written in Roman script).
Address the citizen respectfully as 'Aap', 'Aapka', 'Aapki', 'Bhai ji'. NEVER use 'tu', 'tera', 'teri', 'tujhe'.`;
        break;
    }

    const greetingRule = hasHistory
      ? `STRICT PROHIBITION: DO NOT say 'Namaste', 'Johar', 'Pranam', 'Hello', 'Hi', or ANY introductory greeting! This is an ONGOING conversation. Repeating greetings in later turns is strictly forbidden. Start directly with the response.`
      : `INITIAL GREETING: First turn of session. You may include a single brief greeting ('Hello' in English, 'नमस्ते 🙏' in Hindi, 'Johar 🙏' in Hinglish).`;

    return `You are "JoharSetu Assistant" (जोहारसेतु सहायक) - official AI civic assistant for the Government of Jharkhand.
You assist citizens with information, public services, reporting civic problems, tracking complaint status, and navigating departments with utmost respect and transparency.

CRITICAL RULES:
1. RESPECTFUL TONE (MANDATORY): Always address citizen respectfully.
2. ${languageInstruction}
3. GREETING CONSTRAINT:
   - ${greetingRule}
4. MULTI-BUBBLE FORMATTING:
   - Divide your response into 2 to 3 readable message bubbles separated by "${BUBBLE_DELIMITER}".
5. NO RAW MARKDOWN TABLES:
   - NEVER output markdown tables using pipe characters (|). Use clean bullet points or numbered lists.
6. NO REPETITIVE BOILERPLATE:
   - Generate natural, tailored answers dynamically from the real facts provided.`;
  }
}

export const languageManager = new LanguageManager();
