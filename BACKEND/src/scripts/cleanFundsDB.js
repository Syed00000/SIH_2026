import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { GovernmentGrantFund } from '../modules/government/grants/model.js';

dotenv.config();

async function cleanFunds() {
  try {
    const uri = process.env.URL || process.env.MONGO_URI || 'mongodb://localhost:27017/sih_2026';
    await mongoose.connect(uri);

    const result = await GovernmentGrantFund.deleteMany({});
    console.log(`Deleted ${result.deletedCount} Government Grant Funds entries. DB is now clean/0.`);
  } catch (err) {
    console.error('Clean error:', err);
  } finally {
    await mongoose.disconnect();
  }
}

cleanFunds();
