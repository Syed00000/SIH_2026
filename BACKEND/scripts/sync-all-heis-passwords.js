import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { connectMongo, closeMongo } from '../src/infrastructure/database/mongo/client.js';
import MongooseUniversity from '../src/modules/government/heis/infrastructure/model.js';
import MongooseUser from '../src/modules/users/infrastructure/model.js';

dotenv.config();

const syncAllHeis = async () => {
  try {
    await connectMongo();
    console.log('🔄 Synchronizing all Universities & User Credentials in MongoDB Atlas...');

    const universities = await MongooseUniversity.find({});
    console.log(`Found ${universities.length} universities.`);

    for (const uni of universities) {
      const loginEmail = (uni.credentials?.loginEmail || uni.nodalOfficer?.email || uni.universityEmail).toLowerCase().trim();
      const rawPassword = uni.credentials?.generatedPassword || 'HEI@Jharkhand2026!';
      const passwordHash = await bcrypt.hash(rawPassword, 12);

      let user = await MongooseUser.findOne({ email: loginEmail });

      if (user) {
        user.passwordHash = passwordHash;
        user.role = 'UNIVERSITY';
        user.fullName = uni.nodalOfficer?.name || uni.name;
        user.accountStatus = uni.accessStatus === 'Disabled' ? 'ACTIVE' : (user.accountStatus || 'ACTIVE');
        user.emailVerification = { verified: true, verifiedAt: new Date() };
        user.profile = {
          institutionName: uni.name,
          aisheCode: uni.code,
          institutionType: uni.universityType || 'State University',
          nodalOfficerDesignation: uni.nodalOfficer?.designation || 'Registrar',
          academicFocusDomains: uni.focusAreas || []
        };
        await user.save();
      } else {
        // Find by mobile or generate clean mobile
        let mobile = uni.nodalOfficer?.phone ? uni.nodalOfficer.phone.replace(/\D/g, '') : '';
        if (mobile.length > 10) mobile = mobile.slice(-10);
        if (!mobile || mobile.length !== 10) {
          mobile = '98' + Math.floor(10000000 + Math.random() * 90000000).toString().slice(0, 8);
        }

        user = new MongooseUser({
          fullName: uni.nodalOfficer?.name || uni.name,
          email: loginEmail,
          mobileNumber: mobile,
          passwordHash,
          role: 'UNIVERSITY',
          accountStatus: 'ACTIVE',
          emailVerification: { verified: true, verifiedAt: new Date() },
          profile: {
            institutionName: uni.name,
            aisheCode: uni.code,
            institutionType: uni.universityType || 'State University',
            nodalOfficerDesignation: uni.nodalOfficer?.designation || 'Registrar',
            academicFocusDomains: uni.focusAreas || []
          }
        });
        await user.save();
      }

      // Update university document
      uni.userId = user._id;
      uni.accessStatus = 'Enabled'; // Ensure all HEIs can log in
      if (!uni.credentials) uni.credentials = {};
      uni.credentials.loginEmail = loginEmail;
      uni.credentials.generatedPassword = rawPassword;
      uni.credentials.passwordHash = passwordHash;
      await uni.save();

      console.log(`✅ Synced: ${uni.name} (${uni.code}) -> Email: ${loginEmail} | Password: ${rawPassword}`);
    }

    console.log('\n🎉 All University credentials synchronized and activated successfully!');
  } catch (err) {
    console.error('Error syncing HEIs:', err);
  } finally {
    await closeMongo();
    process.exit(0);
  }
};

syncAllHeis();
