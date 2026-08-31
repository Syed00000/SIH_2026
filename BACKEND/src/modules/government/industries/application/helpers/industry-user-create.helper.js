import MongooseUser from '../../../../users/infrastructure/model.js';

export async function provisionIndustryUserAccount({
  effectiveLoginEmail,
  spocName,
  legalName,
  category,
  registrationNumber,
  designation,
  supportModes,
  passwordHash,
  cleanMobile
}) {
  let user = await MongooseUser.findOne({ email: effectiveLoginEmail });
  if (user) {
    user.role = 'INDUSTRY';
    user.passwordHash = passwordHash;
    user.fullName = spocName.trim();
    user.accountStatus = 'ACTIVE';
    user.emailVerification = { verified: true, verifiedAt: new Date() };
    user.profile = {
      preferredLanguage: 'HINDI',
      organizationName: legalName.trim(),
      entityType: category,
      cin: registrationNumber || '',
      primaryContactDesignation: designation.trim(),
      supportSectors: supportModes
    };
    await user.save();
    return user;
  }

  let mobile = cleanMobile;
  let existingMobile = await MongooseUser.findOne({ mobileNumber: mobile });
  while (existingMobile) {
    mobile = '9' + Math.floor(100000000 + Math.random() * 900000000).toString().slice(0, 9);
    existingMobile = await MongooseUser.findOne({ mobileNumber: mobile });
  }

  user = new MongooseUser({
    fullName: spocName.trim(),
    email: effectiveLoginEmail,
    mobileNumber: mobile,
    passwordHash,
    role: 'INDUSTRY',
    accountStatus: 'ACTIVE',
    emailVerification: { verified: true, verifiedAt: new Date() },
    profile: {
      preferredLanguage: 'HINDI',
      organizationName: legalName.trim(),
      entityType: category,
      cin: registrationNumber || '',
      primaryContactDesignation: designation.trim(),
      supportSectors: supportModes
    }
  });
  await user.save();
  return user;
}

export default provisionIndustryUserAccount;
