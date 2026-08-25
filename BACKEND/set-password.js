import bcrypt from 'bcryptjs';
import MongooseUser from './src/modules/users/infrastructure/model.js';
import { connectMongo, closeMongo } from './src/infrastructure/database/mongo/client.js';

const setPassword = async () => {
  try {
    await connectMongo();
    const hash = await bcrypt.hash('123456789', 12);
    
    await MongooseUser.updateOne(
      { email: 'shadanakram82@gmail.com' },
      { 
        $set: { 
          passwordHash: hash,
          accountStatus: 'ACTIVE',
          'emailVerification.verified': true
        } 
      }
    );
    console.log('✅ Updated password for shadanakram82@gmail.com to 123456789');
  } catch (err) {
    console.error(err);
  } finally {
    await closeMongo();
    process.exit(0);
  }
};

setPassword();
