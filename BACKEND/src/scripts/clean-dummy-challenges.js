import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import CitizenChallenge from '../modules/citizen/infrastructure/schemas/challenge.schema.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const BANNED_WORDS = [
  'fuck', 'shit', 'bitch', 'asshole', 'cunt', 'dick', 'pussy', 'bastard', 'slut', 'whore',
  'test123', 'asdf', 'qwer', 'zxcv', 'dummy', 'lorem ipsum'
];

const containsProfaneOrDummyData = (text) => {
  if (!text) return false;
  const lowerText = text.toLowerCase();
  return BANNED_WORDS.some(word => lowerText.includes(word));
};

async function cleanDatabase() {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(process.env.URL);
    console.log('Connected successfully.\n');

    // Mongoose schema is exported, so we should create a model. 
    // Wait, the schema exports a mongoose.Schema. Let's register it.
    const ChallengeModel = mongoose.model('CitizenChallenge', CitizenChallenge);

    const challenges = await ChallengeModel.find({});
    console.log(`Found ${challenges.length} total challenges.`);

    let deletedCount = 0;
    for (const challenge of challenges) {
      if (containsProfaneOrDummyData(challenge.title) || containsProfaneOrDummyData(challenge.description)) {
        console.log(`\nDeleting Challenge: ${challenge.challengeId}`);
        console.log(`Title: ${challenge.title}`);
        console.log(`Description: ${challenge.description}`);
        
        await ChallengeModel.deleteOne({ _id: challenge._id });
        deletedCount++;
      }
    }

    console.log(`\nCleanup complete. Deleted ${deletedCount} dummy/profane challenges.`);
  } catch (error) {
    console.error('Error during cleanup:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from database.');
  }
}

cleanDatabase();
