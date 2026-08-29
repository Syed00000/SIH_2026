import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { connectMongo, closeMongo } from '../src/infrastructure/database/mongo/client.js';
import Admin from '../src/modules/government/admins/infrastructure/model.js';
import MongooseUser from '../src/modules/users/infrastructure/model.js';

dotenv.config();

const syncAdmins = async () => {
  try {
    await connectMongo();
    console.log('🔄 Syncing Admin Directory to Users Authentication Collection...');

    const admins = await Admin.find({});
    const defaultHash = await bcrypt.hash('Admin@123456', 12);

    for (let i = 0; i < admins.length; i++) {
      const a = admins[i];
      const authRole = (a.role || '').toLowerCase().includes('nodal') ? 'NODAL' : 'GOVERNMENT';
      const email = a.email.toLowerCase().trim();

      // Check if user already exists
      let user = await MongooseUser.findOne({ email });
      if (!user) {
        // Find if mobile number is occupied
        const fallbackMobile = '98765' + String(10000 + i);
        const mobileToUse = a.mobileNumber && /^[6-9]\d{9}$/.test(a.mobileNumber) ? a.mobileNumber : fallbackMobile;
        
        // Remove any conflicting old record with same mobile
        await MongooseUser.deleteMany({ mobileNumber: mobileToUse, email: { $ne: email } });

        user = new MongooseUser({
          fullName: a.fullName,
          mobileNumber: mobileToUse,
          email,
          passwordHash: defaultHash,
          role: authRole,
          accountStatus: 'ACTIVE',
          emailVerification: { verified: true, verifiedAt: new Date() },
          profile: {
            institutionName: a.assignedDepartment || 'State Innovation Cell',
            nodalOfficerDesignation: a.role,
            preferredLanguage: 'HINDI'
          }
        });
        await user.save();
      } else {
        user.fullName = a.fullName;
        user.role = authRole;
        user.passwordHash = defaultHash;
        user.accountStatus = 'ACTIVE';
        user.emailVerification = { verified: true, verifiedAt: new Date() };
        user.profile = {
          institutionName: a.assignedDepartment || 'State Innovation Cell',
          nodalOfficerDesignation: a.role,
          preferredLanguage: 'HINDI'
        };
        await user.save();
      }

      console.log(`✅ SYNCED: ${a.fullName} (${a.role}) -> Login Email: ${email} | Role: ${authRole}`);
    }

    console.log('🎉 ALL ADMIN DIRECTORY USERS SUCCESSFULLY SYNCHRONIZED!');
    await closeMongo();
    process.exit(0);
  } catch (err) {
    console.error('Error syncing admins:', err);
    process.exit(1);
  }
};

syncAdmins();
