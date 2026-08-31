import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { UniversityFaculty } from '../modules/university/infrastructure/model.js';
import User from '../modules/users/infrastructure/model.js';

dotenv.config();

async function syncFaculty() {
  try {
    const uri = process.env.URL || process.env.MONGO_URI || 'mongodb://localhost:27017/sih_2026';
    await mongoose.connect(uri);
    console.log('--- Connected to MongoDB ---');

    const defaultPassword = 'Faculty@123456';
    const defaultHash = await bcrypt.hash(defaultPassword, 12);

    const facultyDocs = await UniversityFaculty.find({}).lean();
    console.log(`Syncing ${facultyDocs.length} faculty members...`);

    for (const f of facultyDocs) {
      const cleanEmail = f.email.toLowerCase().trim();
      const hashToUse = f.passwordHash || defaultHash;

      // Update or create User in users collection
      const user = await User.findOneAndUpdate(
        { email: cleanEmail },
        {
          $set: {
            fullName: f.name,
            email: cleanEmail,
            passwordHash: hashToUse,
            role: 'FACULTY',
            accountStatus: 'ACTIVE',
            emailVerification: { verified: true, verifiedAt: new Date() },
            profile: {
              universityCode: f.universityCode || 'RU001',
              department: f.department || 'Engineering',
              designation: f.designation || 'Professor'
            }
          }
        },
        { upsert: true, new: true }
      );

      // Update UniversityFaculty doc
      await UniversityFaculty.findByIdAndUpdate(f._id, {
        $set: {
          passwordHash: hashToUse,
          userId: user._id,
          status: 'Active',
          availabilityStatus: f.availabilityStatus || 'Available'
        }
      });

      console.log(`✔ Synced Faculty: "${f.name}" | Email: "${cleanEmail}" | Password: "${defaultPassword}"`);
    }

    console.log('\nAll faculty members successfully synchronized for direct login!');
  } catch (err) {
    console.error('Sync error:', err);
  } finally {
    await mongoose.disconnect();
  }
}

syncFaculty();
