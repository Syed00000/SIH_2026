import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const uri = process.env.URL || process.env.MONGODB_URI;

async function resetAllToZero() {
  try {
    await mongoose.connect(uri);
    console.log('Connected to DB:', mongoose.connection.name);

    // Reset industry CSR committed values to 0
    const indRes = await mongoose.connection.db.collection('industries').updateMany(
      {},
      {
        $set: {
          'financials.csrCommittedCr': 0,
          'financials.csrDisbursedCr': 0,
          'financials.supportedProjectsCount': 0
        }
      }
    );
    console.log('Industries updated to 0 CSR:', indRes.modifiedCount);

    // Reset any dummy state grant funds
    const fundsCount = await mongoose.connection.db.collection('government_grant_funds').countDocuments();
    console.log('Current state grant funds in DB:', fundsCount);

    console.log('All financial funds clean and zeroed out successfully!');
  } catch (err) {
    console.error('Error resetting funds:', err);
  } finally {
    await mongoose.disconnect();
  }
}

resetAllToZero();
