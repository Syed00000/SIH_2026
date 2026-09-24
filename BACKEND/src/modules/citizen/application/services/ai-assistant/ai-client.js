import { aiConfig } from '../../../../../infrastructure/ai/ai.config.js';
import logger from '../../../../../shared/logger/index.js';

class AiClient {
  /**
   * Invokes Groq -> Gemini -> OpenRouter with resilient multi-provider fallback
   */
  async generateCompletion(messages, maxTokens = 800, temperature = 0.3) {
    // 1. Try Groq (ultra-fast primary & fallback model)
    if (aiConfig.groqApiKey) {
      const groqModels = [aiConfig.groqModel || 'llama-3.3-70b-versatile', aiConfig.groqFallbackModel || 'llama-3.1-8b-instant'];
      for (const model of groqModels) {
        try {
          const res = await fetch(aiConfig.groqBaseUrl, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${aiConfig.groqApiKey}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              model,
              messages,
              max_tokens: maxTokens,
              temperature
            }),
            signal: AbortSignal.timeout(6000)
          });

          if (res.ok) {
            const data = await res.json();
            const choice = data.choices?.[0]?.message;
            let content = choice?.content || choice?.reasoning;
            if (content && typeof content === 'string' && content.trim()) {
              content = content.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
              logger.info({ msg: 'Live AI completion generated via Groq', model });
              return content;
            }
          } else {
            const errText = await res.text();
            logger.warn({ msg: `Groq chat completion non-OK status (${model})`, status: res.status, err: errText });
          }
        } catch (err) {
          logger.warn({ msg: `Groq completion failed for ${model}`, error: err.message });
        }
      }
    }

    // 2. Try Google Gemini API
    if (aiConfig.geminiApiKey) {
      try {
        const systemMsg = messages.find(m => m.role === 'system')?.content || '';
        const userAndAssistantMsgs = messages.filter(m => m.role !== 'system');
        const contents = userAndAssistantMsgs.map(m => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }]
        }));

        const geminiUrl = `${aiConfig.geminiBaseUrl}/${aiConfig.geminiModel}:generateContent?key=${aiConfig.geminiApiKey}`;
        const res = await fetch(geminiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents,
            systemInstruction: systemMsg ? { parts: [{ text: systemMsg }] } : undefined,
            generationConfig: {
              maxOutputTokens: maxTokens,
              temperature
            }
          }),
          signal: AbortSignal.timeout(7000)
        });

        if (res.ok) {
          const data = await res.json();
          const candidate = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (candidate && typeof candidate === 'string' && candidate.trim()) {
            let clean = candidate.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
            logger.info({ msg: 'Live AI completion generated via Google Gemini', model: aiConfig.geminiModel });
            return clean;
          }
        } else {
          const errText = await res.text();
          logger.warn({ msg: 'Gemini completion non-OK status', status: res.status, err: errText });
        }
      } catch (err) {
        logger.warn({ msg: 'Gemini completion call failed', error: err.message });
      }
    }

    // 3. Try OpenRouter (LLaMA-3.1-8b)
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
          signal: AbortSignal.timeout(8000)
        });

        if (res.ok) {
          const data = await res.json();
          const choice = data.choices?.[0]?.message;
          let content = choice?.content;
          if (content && typeof content === 'string' && content.trim()) {
            content = content.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
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
export default aiClient;
