import { aiConfig } from './ai.config.js';

class LlmService {
  /**
   * Cleans raw text from LLM, removing code fences or reasoning <think> blocks
   */
  extractJson(rawText) {
    if (!rawText) return null;
    let text = String(rawText).trim();

    // Strip <think>...</think> blocks if present
    text = text.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();

    // Strip markdown code block markers
    if (text.startsWith('```json')) {
      text = text.slice(7);
    } else if (text.startsWith('```')) {
      text = text.slice(3);
    }
    if (text.endsWith('```')) {
      text = text.slice(0, -3);
    }
    text = text.trim();

    try {
      return JSON.parse(text);
    } catch {
      // Find outermost JSON object
      const start = text.indexOf('{');
      const end = text.lastIndexOf('}');
      if (start !== -1 && end !== -1 && end > start) {
        try {
          return JSON.parse(text.slice(start, end + 1));
        } catch {
          return null;
        }
      }
      return null;
    }
  }

  /**
   * Call Groq OpenAI-compatible endpoint
   */
  async callGroq(systemPrompt, userPrompt) {
    if (!aiConfig.groqApiKey) throw new Error('GROQ_API_KEY is not set');

    const res = await fetch(aiConfig.groqBaseUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${aiConfig.groqApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: aiConfig.groqModel,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.2,
        max_tokens: 350
      }),
      signal: AbortSignal.timeout(10000)
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Groq HTTP ${res.status}: ${errText}`);
    }

    const data = await res.json();
    return data.choices?.[0]?.message?.content || '';
  }

  /**
   * Call OpenRouter endpoint
   */
  async callOpenRouter(systemPrompt, userPrompt) {
    if (!aiConfig.openRouterApiKey) throw new Error('OPENROUTER_API_KEY is not set');

    const res = await fetch(aiConfig.openRouterBaseUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${aiConfig.openRouterApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: aiConfig.openRouterModel,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.2,
        max_tokens: 350
      }),
      signal: AbortSignal.timeout(18000)
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`OpenRouter HTTP ${res.status}: ${errText}`);
    }

    const data = await res.json();
    return data.choices?.[0]?.message?.content || '';
  }

  /**
   * Generate structured JSON with robust multi-provider fallback
   */
  async generateJson(systemPrompt, userPrompt, fallbackData = null) {
    // 1. Try Groq (Ultra-fast)
    try {
      const raw = await this.callGroq(systemPrompt, userPrompt);
      const parsed = this.extractJson(raw);
      if (parsed) return parsed;
    } catch (err) {
      console.warn('⚠️ [LLM] Groq request failed, attempting OpenRouter fallback:', err.message);
    }

    // 2. Try OpenRouter (LLaMA-3.1-8b)
    try {
      const raw = await this.callOpenRouter(systemPrompt, userPrompt);
      const parsed = this.extractJson(raw);
      if (parsed) return parsed;
    } catch (err) {
      console.warn('⚠️ [LLM] OpenRouter fallback failed:', err.message);
    }

    // 3. Fallback to provided deterministic object or empty object
    return fallbackData || {};
  }
}

export const llmService = new LlmService();
export default llmService;
