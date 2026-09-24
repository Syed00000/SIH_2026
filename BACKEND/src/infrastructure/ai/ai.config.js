import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from backend root relative to this file
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
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

  // Groq — ultra-fast inference
  groqApiKey: (process.env.GROQ_API_KEY || '').trim(),
  groqModel: 'openai/gpt-oss-20b',
  groqModelLarge: 'openai/gpt-oss-120b',
  groqBaseUrl: 'https://api.groq.com/openai/v1/chat/completions',

  // OpenRouter (Fallback)
  openRouterApiKey: (process.env.OPENROUTER_API_KEY || '').trim(),
  openRouterModel: 'meta-llama/llama-3.1-8b-instruct',
  openRouterBaseUrl: 'https://openrouter.ai/api/v1/chat/completions',

  // Deduplication Thresholds
  duplicateThreshold: 0.75,
  strongDuplicateThreshold: 0.85
};

export default aiConfig;
