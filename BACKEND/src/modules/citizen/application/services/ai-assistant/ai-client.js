import { aiConfig } from '../../../../../infrastructure/ai/ai.config.js';
import logger from '../../../../../shared/logger/index.js';

class AiClient {
  cleanCompletion(text) {
    if (!text || typeof text !== 'string') return '';
    let clean = text.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
    if (
      /cannot fulfill your request|as an ai language model|i cannot assist with that|i can help you with a different prompt|i cannot (?:create|provide|generate|write|help with|fulfill) (?:a |the )?(?:message|response|complaint|request)/i.test(clean)
    ) {
      return null;
    }
    // Strip common LLM meta preambles and boilerplate
    clean = clean.replace(/^(?:here(?:'s| is) (?:a |the )?(?:response|reply|answer|message)[^\n]*\n*)/i, '');
    clean = clean.replace(/^(?:sure(?: thing)?|certainly|of course)[,!.\s]*\n*/i, '');
    clean = clean.replace(/^(?:here is what I will say:?)\s*\n*/i, '');
    clean = clean.replace(/^(?:---+|\*\*\*+|___+)\s*\n*/gm, '');
    return clean.trim();
  }

  /**
   * Invokes Groq first with fast fallback to OpenRouter using user API keys
   */
  async generateCompletion(messages, maxTokens = 800, temperature = 0.3) {
    // 1. Try Groq (ultra-fast inference)
    if (aiConfig.groqApiKey) {
      try {
        const res = await fetch(aiConfig.groqBaseUrl, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${aiConfig.groqApiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: aiConfig.groqModel || 'openai/gpt-oss-20b',
            messages,
            max_tokens: maxTokens,
            temperature
          }),
          signal: AbortSignal.timeout(8000)
        });

        if (res.ok) {
          const data = await res.json();
          const choice = data.choices?.[0]?.message;
          let content = choice?.content;
          if (content && typeof content === 'string' && content.trim()) {
            content = this.cleanCompletion(content);
            logger.info({ msg: 'Live AI completion generated via Groq', model: aiConfig.groqModel });
            return content;
          }
        } else if (res.status === 429) {
          // Rate limited — immediately fall through to OpenRouter, no retry wait
          logger.warn({ msg: 'Groq rate limited (429), switching to OpenRouter fallback', model: aiConfig.groqModel });
        } else {
          const errText = await res.text();
          logger.warn({ msg: 'Groq chat completion non-OK status', status: res.status, err: errText });
        }
      } catch (err) {
        logger.warn({ msg: 'Groq completion failed, falling back to OpenRouter', error: err.message });
      }
    }

    // 2. Fallback to OpenRouter
    if (aiConfig.openRouterApiKey) {
      try {
        const res = await fetch(aiConfig.openRouterBaseUrl, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${aiConfig.openRouterApiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://joharsetu.jharkhand.gov.in',
            'X-Title': 'JoharSetu Civic AI'
          },
          body: JSON.stringify({
            model: aiConfig.openRouterModel || 'meta-llama/llama-3.1-8b-instruct',
            messages,
            max_tokens: maxTokens,
            temperature
          }),
          signal: AbortSignal.timeout(10000)
        });

        if (res.ok) {
          const data = await res.json();
          const choice = data.choices?.[0]?.message;
          let content = choice?.content;
          if (content && typeof content === 'string' && content.trim()) {
            content = this.cleanCompletion(content);
            logger.info({ msg: 'Live AI completion generated via OpenRouter', model: aiConfig.openRouterModel });
            return content;
          }
        } else {
          const errText = await res.text();
          logger.warn({ msg: 'OpenRouter non-OK status', status: res.status, err: errText });
        }
      } catch (err) {
        logger.warn({ msg: 'OpenRouter completion call failed', error: err.message });
      }
    }

    return null;
  }

  /**
   * Safely parse JSON from LLM markdown code blocks
   */
  parseJsonSafely(text) {
    if (!text) return null;
    let clean = String(text).replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
    if (clean.startsWith('```json')) clean = clean.slice(7);
    else if (clean.startsWith('```')) clean = clean.slice(3);
    if (clean.endsWith('```')) clean = clean.slice(0, -3);
    clean = clean.trim();

    try {
      return JSON.parse(clean);
    } catch {
      const start = clean.indexOf('{');
      const end = clean.lastIndexOf('}');
      if (start !== -1 && end > start) {
        try {
          return JSON.parse(clean.slice(start, end + 1));
        } catch {}
      }
      return null;
    }
  }
}

export const aiClient = new AiClient();
