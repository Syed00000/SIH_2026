import mongoose from 'mongoose';

async function run() {
  await mongoose.connect('mongodb+srv://officialsamadhan043_db_user:mtzjk9Brhkg6AWPc@samadhan043.uzxwt7j.mongodb.net/joharsetu?retryWrites=true&w=majority');
  const db = mongoose.connection.db;
  
  const challenges = await db.collection('citizenchallenges').find({ 'assignedFaculty': { $exists: true, $ne: null } }).project({ assignedFaculty: 1 }).toArray();
  console.log("Challenges with assignedFaculty:", JSON.stringify(challenges, null, 2));

  const facs = await db.collection('universityfaculties').find({}).project({ name: 1, email: 1 }).toArray();
  console.log("Faculty:", JSON.stringify(facs, null, 2));

  process.exit(0);
}
run();
