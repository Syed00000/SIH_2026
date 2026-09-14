import dotenv from 'dotenv';
dotenv.config();

import { embeddingService } from '../infrastructure/ai/embedding.service.js';
import { qdrantService } from '../infrastructure/ai/qdrant.service.js';
import { llmService } from '../infrastructure/ai/llm.service.js';
import { challengeIntelligenceService } from '../infrastructure/ai/challenge-intelligence.service.js';
import mongoose from 'mongoose';

async function main() {
  console.log('1. Testing LLM Service...');
  const llmOut = await llmService.generateJson(
    'You are a JSON assistant. Output valid JSON only.',
    'Classify problem: "broken water pipe flooding main road in Ranchi". Respond with {"domain": "Water Resources", "priority": "High"}'
  );
  console.log('LLM Output:', llmOut);

  console.log('2. Connecting to MongoDB...');
  await mongoose.connect(process.env.URL);

  console.log('3. Running AI analysis on first challenge...');
  const sample = await mongoose.connection.db.collection('citizen_challenges').findOne({});
  if (sample) {
    const analysis = await challengeIntelligenceService.analyzeChallenge(sample);
    console.log('AI Analysis completed:');
    console.log('Classified Domain:', analysis.classifiedDomain);
    console.log('Recommended Dept:', analysis.recommendedDepartment);
    console.log('Recommended HEI:', analysis.recommendedHEI);
    console.log('Priority Assessment:', analysis.priorityAssessment);
    console.log('Deduplication Radar:', analysis.deduplication);
  }

  await mongoose.disconnect();
  console.log('Done!');
}

main().catch(console.error);
