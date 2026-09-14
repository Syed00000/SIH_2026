import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');
dotenv.config(); // defaults to .env in current directory

async function run() {
  const directURL = 'mongodb://officialsamadhan043_db_user:mtzjk9Brhkg6AWPc@ac-wiwdm77-shard-00-00.uzxwt7j.mongodb.net:27017,ac-wiwdm77-shard-00-01.uzxwt7j.mongodb.net:27017,ac-wiwdm77-shard-00-02.uzxwt7j.mongodb.net:27017/joharsetu?ssl=true&replicaSet=atlas-wiwdm77-shard-0&authSource=admin&retryWrites=true&w=majority';
  await mongoose.connect(directURL);
  const db = mongoose.connection.db;
  const teams = await db.collection('university_teams').find({}).toArray();
  for (const t of teams) {
    if (t.projectId && !t.projectId.startsWith('PRJ-')) {
       console.log('Bad Team:', t.name, 'ProjectId:', t.projectId);
       const proj = await db.collection('university_projects').findOne({ title: t.projectTitle || t.projectId });
       if (proj) {
         await db.collection('university_teams').updateOne({ _id: t._id }, { $set: { projectId: proj.projectId } });
         console.log('Fixed:', t._id);
       } else {
         await db.collection('university_teams').deleteOne({ _id: t._id });
         console.log('Deleted orphaned bad team:', t._id);
       }
    }
  }
  process.exit(0);
}
run();
