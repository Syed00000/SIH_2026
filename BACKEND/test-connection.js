import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const url = process.env.URL || process.env.MONGO_URI;

const testConnection = async () => {
  console.log('🔄 Attempting connection to MongoDB cluster...');
  console.log(`📍 Connection URL: ${url ? url.replace(/:([^@]+)@/, ':****@') : 'Not defined'}`); // Hide password in logs

  if (!url) {
    console.error('❌ Error: MONGO_URI / URL is not defined in .env');
    process.exit(1);
  }

  try {
    await mongoose.connect(url, {
      serverSelectionTimeoutMS: 8000
    });
    console.log('✅ Connection to MongoDB Atlas was SUCCESSFUL!');
    console.log(`📂 Database Name: ${mongoose.connection.name}`);
    console.log(`🟢 Connection State: Connected (readyState: ${mongoose.connection.readyState})`);
    
    await mongoose.disconnect();
    console.log('🔌 Disconnected successfully. Test complete.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Connection to MongoDB Atlas FAILED!');
    console.error(err);
    process.exit(1);
  }
};

testConnection();
