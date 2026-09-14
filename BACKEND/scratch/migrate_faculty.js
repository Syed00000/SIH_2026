import mongoose from 'mongoose';
import { CitizenChallenge } from './src/modules/citizen/infrastructure/model.js';

async function run() {
  try {
    await mongoose.connect('mongodb+srv://officialsamadhan043_db_user:mtzjk9Brhkg6AWPc@samadhan043.uzxwt7j.mongodb.net/joharsetu?retryWrites=true&w=majority');
    const challenges = await CitizenChallenge.find({
      'assignedUniversity.mentorName': { $exists: true, $ne: '' }
    });

    console.log(`Found ${challenges.length} challenges with mentorName`);
    for (const c of challenges) {
      if (!c.assignedFaculty || !c.assignedFaculty.name) {
        c.assignedFaculty = {
          name: c.assignedUniversity.mentorName,
          email: c.assignedUniversity.mentorEmail || '',
          department: c.assignedUniversity.department || ''
        };
        await c.save();
        console.log(`Migrated assignedFaculty for ${c.challengeId}`);
      }
    }
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}
run();
