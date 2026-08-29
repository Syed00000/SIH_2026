import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectMongo, closeMongo } from '../infrastructure/database/mongo/client.js';

dotenv.config();

const printStatus = async () => {
  console.log('Connecting to database to check status...');
  try {
    await connectMongo();
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    console.log('\n--- Database Collections Status ---');
    for (const coll of collections) {
      const count = await db.collection(coll.name).countDocuments();
      console.log(`- ${coll.name}: ${count} documents`);
    }
    console.log('-----------------------------------\n');
  } catch (err) {
    console.error('Error getting database status:', err);
  } finally {
    await closeMongo();
    process.exit(0);
  }
};

printStatus();
