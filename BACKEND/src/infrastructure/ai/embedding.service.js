import { aiConfig } from './ai.config.js';

class EmbeddingService {
  /**
   * Deterministic local fallback: generates a 384-dim normalized vector from text
   */
  generateFallbackEmbedding(text, dim = 384) {
    const vector = new Float32Array(dim);
    const cleaned = String(text || '').toLowerCase().trim();
    if (!cleaned) return Array.from(vector);

    // Hash tokens and character n-grams into vector buckets
    const words = cleaned.split(/\s+/);
    words.forEach((word, wordIdx) => {
      let hash = 0;
      for (let i = 0; i < word.length; i++) {
        hash = (hash << 5) - hash + word.charCodeAt(i);
        hash |= 0;
      }
      const idx = Math.abs(hash) % dim;
      const weight = 1.0 / (1 + wordIdx * 0.05);
      vector[idx] += weight;

      // 3-gram hashing for subword capture
      for (let i = 0; i < word.length - 2; i++) {
        const trigram = word.substring(i, i + 3);
        let th = 0;
        for (let j = 0; j < 3; j++) th = (th * 31 + trigram.charCodeAt(j)) | 0;
        const tidx = Math.abs(th) % dim;
        vector[tidx] += 0.5;
      }
    });

    // L2 Normalize
    let norm = 0;
    for (let i = 0; i < dim; i++) norm += vector[i] * vector[i];
    norm = Math.sqrt(norm);
    if (norm > 0) {
      for (let i = 0; i < dim; i++) vector[i] /= norm;
    }
    return Array.from(vector);
  }

  /**
   * Generates a 384-dim dense embedding for input text
   */
  async getEmbedding(text) {
    const cleanedText = String(text || '').slice(0, 1500).trim();
    if (!cleanedText) {
      return this.generateFallbackEmbedding('empty', aiConfig.vectorSize);
    }

    if (aiConfig.hfToken) {
      try {
        const response = await fetch(aiConfig.hfRouterUrl, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${aiConfig.hfToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ inputs: cleanedText }),
          signal: AbortSignal.timeout(6000)
        });

        if (response.ok) {
          const data = await response.json();
          // Hugging Face feature-extraction returns array or array of arrays
          let vec = data;
          if (Array.isArray(vec) && Array.isArray(vec[0])) {
            vec = vec[0];
          }
          if (Array.isArray(vec) && typeof vec[0] === 'number') {
            return vec;
          }
        }
      } catch (err) {
        console.warn('⚠️ HuggingFace embedding API error, activating local vector fallback:', err.message);
      }
    }

    return this.generateFallbackEmbedding(cleanedText, aiConfig.vectorSize);
  }
}

export const embeddingService = new EmbeddingService();
export default embeddingService;
