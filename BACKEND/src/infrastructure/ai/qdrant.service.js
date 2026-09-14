import crypto from 'crypto';
import { aiConfig } from './ai.config.js';

function stringToUuid(str) {
  const hash = crypto.createHash('md5').update(String(str)).digest('hex');
  return `${hash.slice(0, 8)}-${hash.slice(8, 12)}-${hash.slice(12, 16)}-${hash.slice(16, 20)}-${hash.slice(20, 32)}`;
}

class QdrantService {
  constructor() {
    this.collectionInitialized = false;
  }

  get headers() {
    return {
      'api-key': aiConfig.qdrantApiKey,
      'Content-Type': 'application/json'
    };
  }

  /**
   * Automatically ensure collection exists with 384-dim Cosine configuration
   */
  async ensureCollection() {
    if (this.collectionInitialized || !aiConfig.qdrantUrl) return;

    try {
      const getRes = await fetch(`${aiConfig.qdrantUrl}/collections/${aiConfig.collectionName}`, {
        headers: this.headers,
        signal: AbortSignal.timeout(5000)
      });

      if (getRes.status === 404 || !getRes.ok) {
        console.log(`[Qdrant] Creating collection "${aiConfig.collectionName}"...`);
        const putRes = await fetch(`${aiConfig.qdrantUrl}/collections/${aiConfig.collectionName}`, {
          method: 'PUT',
          headers: this.headers,
          body: JSON.stringify({
            vectors: {
              size: aiConfig.vectorSize,
              distance: 'Cosine'
            }
          }),
          signal: AbortSignal.timeout(8000)
        });

        if (putRes.ok) {
          console.log(`[Qdrant] Collection "${aiConfig.collectionName}" created successfully.`);
          this.collectionInitialized = true;
        } else {
          const err = await putRes.text();
          console.warn('[Qdrant] Collection creation warning:', err);
        }
      } else {
        this.collectionInitialized = true;
      }
    } catch (err) {
      console.warn('⚠️ [Qdrant] Connection warning:', err.message);
    }
  }

  /**
   * Upsert a challenge vector into Qdrant
   */
  async upsertChallenge(challengeId, vector, payload = {}) {
    if (!aiConfig.qdrantUrl || !Array.isArray(vector) || vector.length === 0) return false;

    try {
      await this.ensureCollection();
      const pointId = stringToUuid(challengeId);

      const res = await fetch(`${aiConfig.qdrantUrl}/collections/${aiConfig.collectionName}/points`, {
        method: 'PUT',
        headers: this.headers,
        body: JSON.stringify({
          points: [
            {
              id: pointId,
              vector,
              payload: {
                challengeId: String(challengeId),
                ...payload,
                indexedAt: new Date().toISOString()
              }
            }
          ]
        }),
        signal: AbortSignal.timeout(6000)
      });

      return res.ok;
    } catch (err) {
      console.warn('⚠️ [Qdrant] Upsert error:', err.message);
      return false;
    }
  }

  /**
   * Search for nearest neighbors using cosine similarity
   */
  async searchSimilar(vector, limit = 5, excludeChallengeId = null) {
    if (!aiConfig.qdrantUrl || !Array.isArray(vector) || vector.length === 0) return [];

    try {
      await this.ensureCollection();

      const searchBody = {
        vector,
        limit: limit + (excludeChallengeId ? 1 : 0),
        with_payload: true
      };

      const res = await fetch(`${aiConfig.qdrantUrl}/collections/${aiConfig.collectionName}/points/search`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify(searchBody),
        signal: AbortSignal.timeout(6000)
      });

      if (!res.ok) return [];

      const data = await res.json();
      const points = data.result || [];

      return points
        .filter((pt) => {
          if (!excludeChallengeId) return true;
          return pt.payload?.challengeId !== String(excludeChallengeId);
        })
        .slice(0, limit)
        .map((pt) => ({
          challengeId: pt.payload?.challengeId,
          title: pt.payload?.title || '',
          domain: pt.payload?.domain || '',
          district: pt.payload?.district || '',
          block: pt.payload?.block || '',
          status: pt.payload?.status || '',
          similarityScore: Number(pt.score.toFixed(3)),
          payload: pt.payload
        }));
    } catch (err) {
      console.warn('⚠️ [Qdrant] Search error:', err.message);
      return [];
    }
  }

  /**
   * Delete vector point
   */
  async deleteChallenge(challengeId) {
    if (!aiConfig.qdrantUrl) return false;
    try {
      const pointId = stringToUuid(challengeId);
      const res = await fetch(`${aiConfig.qdrantUrl}/collections/${aiConfig.collectionName}/points/delete`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify({ points: [pointId] }),
        signal: AbortSignal.timeout(5000)
      });
      return res.ok;
    } catch {
      return false;
    }
  }
}

export const qdrantService = new QdrantService();
export default qdrantService;
