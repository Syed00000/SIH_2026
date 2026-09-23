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

    // Santhali script (Ol Chiki) or core keywords
    if (/[\u1C50-\u1C7F]/.test(raw) || /\b(johar|gate|menama|santal|santhali|ape|inj|am|dak|bah)\b/i.test(lower)) {
      return 'sat';
    }
    if (/[\u0980-\u09FF]/.test(raw)) return 'bn';
    if (/[\u0900-\u097F]/.test(raw)) return 'hi';

    if (selectedLanguage === 'bn') return 'bn';
    if (selectedLanguage === 'sat') return 'sat';
    if (selectedLanguage === 'hi') return 'hi';

    // Hinglish keywords
    const hinglishPattern = /\b(bhai|bhaiya|yaar|kaise|kya|karo|kardo|kar|de|do|dost|hua|hai|hain|ho|nahi|nhi|na|paani|pani|bijli|sadak|sadkein|kachra|gaddha|gaddhe|gadda|shikayat|samasya|mera|meri|mere|batana|batao|bata|btao|dekh|dekho|bol|bolo|wala|wali|wale|kahan|kidhar|kab|kyun|hoga|karna|tha|thi|the|mujhe|apna|apni|aap|aapka|aapki|aapko|sun|suno|theek|thik|achha|acha|mat|chahiye|chal|raha|rahi|aaya|aayi|tareekh|tareeq|tarikh|pichhla|wapas|hata|hatao|madad|bhejo|nikalo)\b/i;
    if (hinglishPattern.test(lower)) return 'hinglish';

    if (selectedLanguage === 'en') return 'en';

    if (/^[a-zA-Z0-9\s.,!?'"()-]+$/.test(raw) && !hinglishPattern.test(lower)) {
      return 'en';
    }

    return 'hinglish';
  }

  getRespectfulSystemPrompt(effectiveLang, hasHistory = false) {
    let languageInstruction = '';

    switch (effectiveLang) {
      case 'hi':
        languageInstruction = `भाषा: आदरणीय, शुद्ध और विनम्र हिन्दी (Devanagari script)। नागरिक को हमेशा 'आप', 'आपका', 'आपकी' या 'भाई जी' कहकर सम्मान दें। 'तू/तेरा/तेरी' का प्रयोग पूर्णतः वर्जित है।`;
        break;
      case 'bn':
        languageInstruction = `Language: Respectful, polite Bengali (বাংলা script). Address the citizen politely with 'আপনি' (Apni), 'আপনার' (Apnar), or 'ভাই' (Bhai).`;
        break;
      case 'sat':
        languageInstruction = `Language: Respectful Santhali (Ol Chiki ᱥᱟᱱᱛᱟᱲᱤ script or standard Santhali). Speak warmly and respectfully with 'ᱡᱚᱦᱟᱨ' (Johar).`;
        break;
      case 'en':
        languageInstruction = `Language: Clear, polite, professional, and empathetic English. Address the citizen respectfully as a valued resident of Jharkhand.`;
        break;
      case 'hinglish':
      default:
        languageInstruction = `भाषा: सम्मानजनक, प्राकृतिक और विनम्र हिंग्लिश (Hinglish/Roman script). नागरिक से हमेशा आदर से बात करें: 'Aap', 'Aapka', 'Aapki', 'Bhai ji'. भूलकर भी 'tu', 'tera', 'teri', 'tujhe' का इस्तेमाल मत करना!`;
        break;
    }

    const greetingRule = hasHistory
      ? `STRICT PROHIBITION: DO NOT say 'Namaste', 'Johar', 'Pranam', 'Hello', 'Hi', or ANY introductory greeting! This is an ONGOING conversation. Repeating greetings in later turns is strictly forbidden. Start directly addressing them with respect: 'Bhai ji, ...' or jump straight to the topic.`
      : `INITIAL GREETING: First turn of session. You may include a single brief greeting ('Namaste bhai ji / Johar 🙏').`;

    return `You are "JoharSetu Assistant" (जोहारसेतु सहायक) - the official AI civic assistant for the Government of Jharkhand.
You assist citizens with registering local problems, tracking status, and navigating departments with utmost respect and transparency.

CRITICAL RULES:
1. RESPECTFUL TONE (MANDATORY):
   - Always address citizen respectfully ("Aap", "Aapka", "Bhai ji"). NEVER use "tu/tera/teri/tujhe/te".
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
