import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import { challengeIntelligenceService } from '../infrastructure/ai/challenge-intelligence.service.js';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function main() {
  await mongoose.connect(process.env.URL);
  console.log('Connected to MongoDB.');

  const challenges = await mongoose.connection.db
    .collection('citizen_challenges')
    .find({ isDeleted: { $ne: true } })
    .toArray();

  console.log(`Found ${challenges.length} challenges. Syncing vectors and AI intelligence...`);

  for (const chl of challenges) {
    try {
      console.log(`Indexing ${chl.challengeId} (${chl.title})...`);
      const intel = await challengeIntelligenceService.analyzeChallenge(chl);
      console.log(`✓ ${chl.challengeId} -> Domain: ${intel.classifiedDomain} | Dept: ${intel.recommendedDepartment?.name} | Dup: ${intel.deduplication?.isDuplicate}`);
    } catch (err) {
      console.warn(`✗ ${chl.challengeId} error:`, err.message);
    }
    await sleep(2000); // 2s pause to stay well within Groq OTPM limit
  }

  await mongoose.disconnect();
  console.log('All challenges synchronized and indexed in Qdrant successfully!');
}

main().catch(console.error);
