import mongoose from 'mongoose';
import dotenv from 'dotenv';
import MongooseUser from './src/modules/users/infrastructure/model.js';
import { connectMongo, closeMongo } from './src/infrastructure/database/mongo/client.js';

dotenv.config();

const activateAll = async () => {
  try {
    await connectMongo();
    const result = await MongooseUser.updateMany(
      {},
      {
        $set: {
          accountStatus: 'ACTIVE',
          'emailVerification.verified': true,
          'emailVerification.verifiedAt': new Date(),
          emailVerificationCode: null,
          emailVerificationExpires: null
        }
      }
    );
    console.log(`✅ Activated and verified ${result.modifiedCount} accounts in MongoDB Atlas!`);

    const users = await MongooseUser.find({}).select('email role accountStatus emailVerification');
    console.log('\n📋 Active Database Accounts:');
    users.forEach(u => {
      console.log(`- Email: ${u.email} | Role: ${u.role} | Status: ${u.accountStatus} | Verified: ${u.emailVerification?.verified}`);
    });
  } catch (err) {
    console.error('Error activating users:', err);
  } finally {
    await closeMongo();
    process.exit(0);
  }
};

activateAll();
