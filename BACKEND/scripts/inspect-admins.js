import dotenv from 'dotenv';
import mongoose from 'mongoose';
dotenv.config();

async function run() {
  await mongoose.connect(process.env.URL);
  const Admin = (await import('../src/modules/government/admins/infrastructure/model.js')).default;
  const User = (await import('../src/modules/users/infrastructure/model.js')).default;

  const admins = await Admin.find({}).lean();
  console.log('=== ADMINS in admin_users ===');
  console.log(admins.map(a => ({
    id: a._id,
    name: a.fullName,
    email: a.email,
    username: a.username,
    role: a.role,
    mobile: a.mobileNumber,
    hasPass: !!a.passwordHash,
    status: a.status
  })));

  const users = await User.find({ role: { $in: ['NODAL', 'ADMIN', 'GOVERNMENT'] } }).select('+passwordHash').lean();
  console.log('=== USERS with role NODAL/ADMIN/GOV ===');
  console.log(users.map(u => ({
    id: u._id,
    name: u.fullName,
    email: u.email,
    role: u.role,
    mobile: u.mobileNumber,
    hasPass: !!u.passwordHash,
    status: u.accountStatus
  })));

  process.exit(0);
}

run().catch(console.error);
