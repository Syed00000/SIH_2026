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

  // Groq — ultra-fast inference (qwen/qwen3.8-27b is verified active on account with ~500ms latency)
  groqApiKey: (process.env.GROQ_API_KEY || '').trim(),
  groqModel: 'qwen/qwen3.8-27b',
  groqBaseUrl: 'https://api.groq.com/openai/v1/chat/completions',

  // OpenRouter (Fallback)
  openRouterApiKey: (process.env.OPENROUTER_API_KEY || '').trim(),
  openRouterModel: 'meta-llama/llama-3.1-8b-instruct',
  openRouterBaseUrl: 'https://openrouter.ai/api/v1/chat/completions',

  // Deduplication Thresholds
  duplicateThreshold: 0.75, // Cosine similarity threshold for flagging potential duplicate
  strongDuplicateThreshold: 0.85 // Strong duplicate threshold
};

export default aiConfig;
