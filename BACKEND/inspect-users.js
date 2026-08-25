import mongoose from 'mongoose';
import dotenv from 'dotenv';
import MongoUserRepository from './src/modules/users/infrastructure/repository.js';
import { connectMongo, closeMongo } from './src/infrastructure/database/mongo/client.js';

dotenv.config();

const inspect = async () => {
  try {
    await connectMongo();
    const repo = new MongoUserRepository();
    const users = await repo.model.find({}).lean();
    
    console.log(`\n📊 Total Users in DB: ${users.length}`);
    users.forEach((u, i) => {
      console.log(`\n--- User ${i + 1} ---`);
      console.log(`ID: ${u._id}`);
      console.log(`Email: ${u.email}`);
      console.log(`Full Name: ${u.fullName}`);
      console.log(`Role: ${u.role}`);
      console.log(`Account Status: ${u.accountStatus}`);
      console.log(`Email Verified: ${u.emailVerification?.verified}`);
      console.log(`Verification Code: ${u.emailVerificationCode}`);
    });
  } catch (err) {
    console.error('Inspection error:', err);
  } finally {
    await closeMongo();
    process.exit(0);
  }
};

inspect();
