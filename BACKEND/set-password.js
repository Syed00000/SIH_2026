import bcrypt from 'bcryptjs';
import MongooseUser from './src/modules/users/infrastructure/model.js';
import { connectMongo, closeMongo } from './src/infrastructure/database/mongo/client.js';

const setPassword = async () => {
  try {
    await connectMongo();
    const adminHash = await bcrypt.hash('Admin@123456', 12);
    const citizenHash = await bcrypt.hash('Citizen@123456', 12);
    const userHash = await bcrypt.hash('123456789', 12);
    
    await MongooseUser.updateOne(
      { email: 'admin@dtejharkhand.gov.in' },
      { 
        $set: { 
          passwordHash: adminHash,
          role: 'GOVERNMENT',
          accountStatus: 'ACTIVE',
          'emailVerification.verified': true
        } 
      },
      { upsert: true }
    );

    await MongooseUser.updateOne(
      { email: 'citizen@joharsetu.gov.in' },
      { 
        $set: { 
          passwordHash: citizenHash,
          role: 'CITIZEN',
          accountStatus: 'ACTIVE',
          'emailVerification.verified': true
        } 
      },
      { upsert: true }
    );

    await MongooseUser.updateOne(
      { email: 'shadanakram82@gmail.com' },
      { 
        $set: { 
          passwordHash: userHash,
          accountStatus: 'ACTIVE',
          'emailVerification.verified': true
        } 
      }
    );
    console.log('✅ Updated passwords for admin (Admin@123456), citizen (Citizen@123456), and shadanakram82');
  } catch (err) {
    console.error(err);
  } finally {
    await closeMongo();
    process.exit(0);
  }
};

setPassword();
