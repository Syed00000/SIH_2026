import mongoose from 'mongoose';
import { embeddingService } from './embedding.service.js';
import { qdrantService } from './qdrant.service.js';
import { llmService } from './llm.service.js';
import { aiConfig } from './ai.config.js';
import { buildIntelligencePrompts, buildDeterministicFallback } from './challenge-ai-prompt.helper.js';

export function extractTrueCivicDomain(title = '', description = '', fallbackDomain = '') {
  const text = `${title} ${description}`.toLowerCase();
  const d = (fallbackDomain || '').toLowerCase();

  const isWater = /water|drain|sewer|pipe|paani|pani|nalka|submersible|leakage|flood|badh|naali|jal|waterlogging|boring|tanker|kuan|handpump/i.test(text);
  const isEnergy = /electric|light|power|wire|transformer|pole|bijli|line|andhera|voltage|bulb|current|powercut|meter/i.test(text);
  const isRoad = /road|pothole|gaddha|sadak|bridge|pul|traffic|street|highway/i.test(text);
  const isSanitation = /garbage|kachra|dustbin|safai|clean|smell|badbu|waste/i.test(text);
  const isHealth = /hospital|dawa|doctor|health|swasthya|dengue|malaria|clinic/i.test(text);

  // Content keywords take strict precedence over citizen dropdown
  if (isWater && !isEnergy) return 'Water Resources';
  if (isEnergy && !isWater) return 'Energy';
  if (isRoad) return 'Road Construction';
  if (isSanitation) return 'Urban Development';
  if (isHealth) return 'Healthcare';

  // Fallback to dropdown domain only if text has no domain-specific keywords
  if (d.includes('water')) return 'Water Resources';
  if (d.includes('energy') || d.includes('power')) return 'Energy';
  if (d.includes('road')) return 'Road Construction';
  if (d.includes('health')) return 'Healthcare';
  return 'Urban Development';
}

class ChallengeIntelligenceService {
  async fetchContextEntities() {
    const departments = await mongoose.connection.db
      .collection('departments')
      .find({}, { projection: { name: 1, code: 1, district: 1 } })
      .toArray()
      .catch(() => []);

    const universities = await mongoose.connection.db
      .collection('universities')
      .find({}, { projection: { name: 1, code: 1, district: 1 } })
      .toArray()
      .catch(() => []);

    return { departments, universities };
  }

  async analyzeChallenge(challenge) {
    if (!challenge) throw new Error('Challenge object required for AI analysis');

    const textToEmbed = `${challenge.title}. ${challenge.description}. District: ${
      challenge.location?.district || challenge.district || ''
    }. Domain: ${challenge.domain || ''}`;

    // 1. Generate dense vector embedding (focus on problem semantics)
    const vector = await embeddingService.getEmbedding(
      `${challenge.title}. ${challenge.description}. District: ${challenge.location?.district || challenge.district || 'Jharkhand'}`
    );

    // 2. Index / Upsert into Qdrant
    await qdrantService.upsertChallenge(challenge.challengeId, vector, {
      challengeId: challenge.challengeId,
      title: challenge.title,
      domain: challenge.domain,
      district: challenge.location?.district || challenge.district || '',
      block: challenge.location?.block || '',
      status: challenge.status
    });

    // 3. Search vector database for similar challenges
    const rawMatches = await qdrantService.searchSimilar(vector, 5, challenge.challengeId);

    // 3. Extract true domain from content (text keywords take strict precedence over citizen dropdown)
    const currentTrueDomain = extractTrueCivicDomain(challenge.title, challenge.description, challenge.domain);

    const similarMatches = rawMatches.map((m) => {
      const matchTrueDomain = extractTrueCivicDomain(m.title, m.payload?.description, m.domain);
      const isDomainAligned = currentTrueDomain === matchTrueDomain;

      // Strict Domain Gate: if domains don't match, cap similarity at 0.15 max
      let adjustedScore = m.similarityScore;
      if (!isDomainAligned) {
        adjustedScore = Math.min(adjustedScore * 0.15, 0.18);
      } else {
        adjustedScore = Math.min(adjustedScore * 1.10, 0.98);
      }

      return {
        ...m,
        domain: matchTrueDomain,
        similarityScore: Number(adjustedScore.toFixed(3)),
        isDomainAligned
      };
    }).sort((a, b) => b.similarityScore - a.similarityScore);

    const topMatch = similarMatches[0] || null;

    let deduplication = {
      isDuplicate: false,
      similarityScore: 0,
      matchedChallengeId: '',
      matchedTitle: '',
      duplicateReason: 'Verified unique. No duplicate problem statements detected in the state vector database.'
    };

    if (topMatch && topMatch.isDomainAligned && topMatch.similarityScore >= aiConfig.duplicateThreshold) {
      const matchDist = (topMatch.district || '').toLowerCase();
      const currDist = (challenge.location?.district || challenge.district || '').toLowerCase();
      const sameArea = matchDist === currDist || !matchDist;

      deduplication.isDuplicate = true;
      deduplication.similarityScore = topMatch.similarityScore;
      deduplication.matchedChallengeId = topMatch.challengeId;
      deduplication.matchedTitle = topMatch.title;
      deduplication.duplicateReason = sameArea
        ? `Duplicate Detected: ${Math.round(topMatch.similarityScore * 100)}% semantic vector match with registered issue [${topMatch.challengeId}] in ${topMatch.district || 'same locality'}. Both report similar civic disruptions in the same domain.`
        : `High semantic similarity (${Math.round(topMatch.similarityScore * 100)}%) with problem [${topMatch.challengeId}] in ${topMatch.district}.`;
    }

    // 4. Query live departments & universities
    const { departments, universities } = await this.fetchContextEntities();

    // 5. Build prompt and run LLM
    const { systemPrompt, userPrompt } = buildIntelligencePrompts({
      challenge,
      departments,
      universities,
      similarMatches
    });

    const fallbackData = buildDeterministicFallback({
      challenge,
      departments,
      universities,
      topMatch
    });

    const llmResult = await llmService.generateJson(systemPrompt, userPrompt, fallbackData);

    // 6. Assemble complete AI Intelligence Record with Jurisdictional Governance Tiers
    const isMacro = fallbackData.problemScope.isMacroChallenge;

    const aiIntelligence = {
      analyzedAt: new Date(),
      modelUsed: aiConfig.groqModel,
      classifiedDomain: llmResult.classifiedDomain || fallbackData.classifiedDomain,
      problemScope: fallbackData.problemScope,
      recommendedDepartment: {
        name: isMacro
          ? (llmResult.recommendedDepartment?.name || fallbackData.recommendedDepartment.name)
          : fallbackData.recommendedDepartment.name,
        code: isMacro
          ? (llmResult.recommendedDepartment?.code || fallbackData.recommendedDepartment.code)
          : fallbackData.recommendedDepartment.code,
        category: fallbackData.recommendedDepartment.category || (isMacro ? 'State Ministry' : 'Ward Commissioner'),
        confidence: Number(llmResult.recommendedDepartment?.confidence || fallbackData.recommendedDepartment.confidence),
        reasoning: isMacro
          ? (llmResult.recommendedDepartment?.reasoning || fallbackData.recommendedDepartment.reasoning)
          : fallbackData.recommendedDepartment.reasoning
      },
      recommendedHEI: {
        isAcademicRequired: isMacro,
        name: isMacro
          ? (llmResult.recommendedHEI?.name || fallbackData.recommendedHEI.name)
          : 'Not Applicable (Routine Ward Maintenance)',
        code: isMacro
          ? (llmResult.recommendedHEI?.code || fallbackData.recommendedHEI.code)
          : 'ROUTINE-MAINTENANCE',
        confidence: isMacro
          ? Number(llmResult.recommendedHEI?.confidence || fallbackData.recommendedHEI.confidence)
          : 0,
        reasoning: isMacro
          ? (llmResult.recommendedHEI?.reasoning || fallbackData.recommendedHEI.reasoning)
          : fallbackData.recommendedHEI.reasoning
      },
      recommendedIndustry: {
        name: llmResult.recommendedIndustry?.name || fallbackData.recommendedIndustry.name,
        reasoning: llmResult.recommendedIndustry?.reasoning || fallbackData.recommendedIndustry.reasoning
      },
      priorityAssessment: {
        priority: llmResult.priorityAssessment?.priority || fallbackData.priorityAssessment.priority,
        severityScore: Number(llmResult.priorityAssessment?.severityScore || fallbackData.priorityAssessment.severityScore),
        affectedEstimate: llmResult.priorityAssessment?.affectedEstimate || fallbackData.priorityAssessment.affectedEstimate,
        urgencyReason: llmResult.priorityAssessment?.urgencyReason || fallbackData.priorityAssessment.urgencyReason
      },
      deduplication,
      solutionStatus: {
        hasPrecedent: Boolean(llmResult.solutionStatus?.hasPrecedent ?? fallbackData.solutionStatus.hasPrecedent),
        precedentSummary: llmResult.solutionStatus?.precedentSummary || fallbackData.solutionStatus.precedentSummary,
        recommendedAction: llmResult.solutionStatus?.recommendedAction || fallbackData.solutionStatus.recommendedAction
      },
      summary: llmResult.summary || fallbackData.summary,
      keywords: Array.isArray(llmResult.keywords) ? llmResult.keywords : fallbackData.keywords,
      similarMatches: similarMatches.slice(0, 3)
    };

    // 7. Persist to MongoDB
    await mongoose.connection.db.collection('citizen_challenges').updateOne(
      { challengeId: challenge.challengeId },
      { $set: { aiIntelligence, updatedAt: new Date() } }
    );

    return aiIntelligence;
  }

  /**
   * Batch indexes and generates intelligence for all unindexed challenges
   */
  async syncAllChallenges() {
    const challenges = await mongoose.connection.db
      .collection('citizen_challenges')
      .find({ isDeleted: { $ne: true } })
      .toArray();

    const results = [];
    for (const chl of challenges) {
      try {
        const intel = await this.analyzeChallenge(chl);
        results.push({ challengeId: chl.challengeId, status: 'SUCCESS', intel });
      } catch (err) {
        results.push({ challengeId: chl.challengeId, status: 'FAILED', error: err.message });
      }
    }
    return results;
  }
}

export const challengeIntelligenceService = new ChallengeIntelligenceService();
export default challengeIntelligenceService;
