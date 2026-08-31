import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { GovernmentGrantFund } from '../modules/government/grants/model.js';

dotenv.config();

async function testFunds() {
  try {
    const uri = process.env.URL || process.env.MONGO_URI || 'mongodb://localhost:27017/sih_2026';
    await mongoose.connect(uri);

    const count = await GovernmentGrantFund.countDocuments();
    console.log(`Current Government Grant Funds in DB: ${count}`);

    const funds = await GovernmentGrantFund.find({}).lean();
    for (const f of funds) {
      console.log(`- ${f.fundId}: ${f.title} -> ₹${f.amount.toLocaleString('en-IN')}`);
    }
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await mongoose.disconnect();
  }
}

testFunds();
