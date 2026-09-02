import User from '../../../users/infrastructure/model.js';

export async function syncFacultyUserAccount({ cleanEmail, cleanName, cleanPhone, passwordHash, code, uniDoc, facultyData }) {
  try {
    let rawDigits = (cleanPhone || '').replace(/[^0-9]/g, '').slice(-10);
    if (!rawDigits || !/^[6-9]\d{9}$/.test(rawDigits)) {
      rawDigits = `98${Date.now().toString().slice(-8)}`;
    }

    // Check if user exists by email
    let userAccount = await User.findOne({ email: cleanEmail });

    // Check if phone number is already taken by someone else
    const phoneOwner = await User.findOne({ mobileNumber: rawDigits });
    if (phoneOwner && (!userAccount || String(phoneOwner._id) !== String(userAccount._id))) {
      // Generate a unique valid 10-digit mobile number
      rawDigits = `99${Date.now().toString().slice(-8)}`;
    }

    if (!userAccount) {
      userAccount = await User.create({
        fullName: cleanName,
        email: cleanEmail,
        mobileNumber: rawDigits,
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
          'profile.department': facultyData.department || 'Engineering',
          'profile.designation': facultyData.designation || 'Associate Professor'
        }
      });
    }
    return userAccount;
  } catch (syncErr) {
    console.warn('syncFacultyUserAccount error (fallback will continue):', syncErr.message);
    return null;
  }
}

