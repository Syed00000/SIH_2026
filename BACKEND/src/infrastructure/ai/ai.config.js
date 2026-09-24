import dotenv from 'dotenv';
dotenv.config();

export const aiConfig = {
  // Hugging Face
  hfToken: (process.env.HF_TOKEN || '').trim(),
  hfModel: 'BAAI/bge-small-en-v1.5',
  hfRouterUrl: 'https://router.huggingface.co/hf-inference/models/BAAI/bge-small-en-v1.5',

  // Qdrant Vector DB
  qdrantUrl: (process.env.QDRANT_URL || '').trim().replace(/\/+$/, ''),
  qdrantApiKey: (process.env.QDRANT_API_KEY || '').trim(),
  collectionName: 'joharsetu_challenges',
  vectorSize: 384,

  // Groq — ultra-fast inference with valid active models
  groqApiKey: (process.env.GROQ_API_KEY || '').trim(),
  groqModel: 'llama-3.3-70b-versatile',
  groqFallbackModel: 'llama-3.1-8b-instant',
  groqModelLarge: 'llama-3.3-70b-versatile',
  groqBaseUrl: 'https://api.groq.com/openai/v1/chat/completions',

  // Google Gemini API
  geminiApiKey: (process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || '').trim(),
  geminiModel: 'gemini-1.5-flash',
  geminiBaseUrl: 'https://generativelanguage.googleapis.com/v1beta/models',

  // OpenRouter (Fallback)
  openRouterApiKey: (process.env.OPENROUTER_API_KEY || '').trim(),
  openRouterModel: 'meta-llama/llama-3.1-8b-instruct',
  openRouterBaseUrl: 'https://openrouter.ai/api/v1/chat/completions',

  // Deduplication Thresholds
  duplicateThreshold: 0.75, // Cosine similarity threshold for flagging potential duplicate
  strongDuplicateThreshold: 0.85 // Strong duplicate threshold
};

export default aiConfig;
