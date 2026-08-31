import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { UniversityFaculty } from '../modules/university/infrastructure/model.js';
import User from '../modules/users/infrastructure/model.js';

dotenv.config();

async function checkFaculty() {
  try {
    const uri = process.env.URL || process.env.MONGO_URI || 'mongodb://localhost:27017/sih_2026';
    await mongoose.connect(uri);
    console.log('--- Connected to MongoDB at:', uri, '---');

    const facultyDocs = await UniversityFaculty.find({}).lean();
    console.log(`\n==============================================`);
    console.log(`TOTAL FACULTY IN 'university_faculty' COLLECTION: ${facultyDocs.length}`);
    console.log(`==============================================`);

    for (const f of facultyDocs) {
      console.log(`\n▶ ID: ${f._id}`);
      console.log(`  Name: ${f.name}`);
      console.log(`  Email: ${f.email}`);
      console.log(`  University Code: ${f.universityCode}`);
      console.log(`  Department: ${f.department}`);
      console.log(`  Designation: ${f.designation}`);
      console.log(`  PasswordHash in Faculty Doc: ${f.passwordHash ? f.passwordHash.slice(0, 25) + '...' : 'NONE'}`);

      // Check corresponding User
      const user = await User.findOne({ email: f.email.toLowerCase() }).select('+passwordHash').lean();
      if (user) {
        console.log(`  User Account (users col): FOUND (Role: ${user.role}, Status: ${user.accountStatus})`);
        console.log(`  User PasswordHash: ${user.passwordHash ? user.passwordHash.slice(0, 25) + '...' : 'NONE'}`);
      } else {
        console.log(`  User Account (users col): NOT FOUND`);
      }
    }

    // Also find any Users with role 'FACULTY' in users collection
    const facultyUsers = await User.find({ role: 'FACULTY' }).select('+passwordHash').lean();
    console.log(`\n==============================================`);
    console.log(`TOTAL USERS WITH ROLE 'FACULTY' IN 'users' COLLECTION: ${facultyUsers.length}`);
    console.log(`==============================================`);
    for (const u of facultyUsers) {
      console.log(`  User: ${u.fullName} | Email: ${u.email} | Hash: ${u.passwordHash ? u.passwordHash.slice(0, 25) + '...' : 'NONE'}`);
    }

  } catch (err) {
    console.error('Error checking faculty:', err);
  } finally {
    await mongoose.disconnect();
    console.log('\n--- Finished check ---');
  }
}

checkFaculty();
