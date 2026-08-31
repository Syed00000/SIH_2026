import User from '../../../users/infrastructure/model.js';

export async function syncFacultyUserAccount({ cleanEmail, cleanName, cleanPhone, passwordHash, code, uniDoc, facultyData }) {
  let userAccount = await User.findOne({ email: cleanEmail });
  if (!userAccount) {
    userAccount = await User.create({
      fullName: cleanName,
      email: cleanEmail,
      mobileNumber: cleanPhone.replace(/[^0-9]/g, '').slice(-10) || `98${Math.floor(10000000 + Math.random() * 90000000)}`,
      passwordHash,
      role: 'FACULTY',
      accountStatus: 'ACTIVE',
      emailVerification: { verified: true, verifiedAt: new Date() },
      profile: {
        institutionName: uniDoc?.name || 'Ranchi University',
        aisheCode: uniDoc?.aisheCode || code,
        universityCode: code,
        department: facultyData.department || 'Engineering',
        designation: facultyData.designation || 'Associate Professor'
      }
    });
  } else {
    await User.findByIdAndUpdate(userAccount._id, {
      $set: {
        fullName: cleanName,
        passwordHash,
        role: 'FACULTY',
        accountStatus: 'ACTIVE',
        emailVerification: { verified: true, verifiedAt: new Date() },
        'profile.universityCode': code,
        'profile.department': facultyData.department || 'Engineering'
      }
    });
  }
  return userAccount;
}
