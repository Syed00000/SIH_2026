import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import Admin from '../infrastructure/model.js';
import { NotFoundError, ValidationError } from '../../../../shared/errors/AppError.js';
import { calculateStats } from '../infrastructure/helpers/admin-stats.helper.js';
import { syncAdminUserAuth } from './helpers/admin-sync.helper.js';

export class AdminService {
  async getAdmins({ search = '', role = 'All', status = 'All', district = 'All', page = 1, limit = 10 }) {
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const query = {};

    if (search.trim()) {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [{ fullName: regex }, { email: regex }, { username: regex }, { district: regex }, { mobileNumber: regex }, { role: regex }];
    }
    if (role !== 'All' && role !== 'All Roles') query.role = new RegExp(`^${role}$`, 'i');
    if (status !== 'All' && status !== 'All Status') query.status = new RegExp(`^${status}$`, 'i');
    if (district !== 'All' && district !== 'All Districts') query.district = new RegExp(`^${district}$`, 'i');

    const [totalRecords, docs, stats] = await Promise.all([
      Admin.countDocuments(query),
      Admin.find(query).sort({ createdAt: -1 }).skip((pageNum - 1) * limitNum).limit(limitNum),
      calculateStats()
    ]);

    return {
      stats,
      data: docs.map((d) => d.toJSON()),
      pagination: {
        totalRecords,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(totalRecords / limitNum) || 1
      }
    };
  }

  async getAdminById(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) throw new ValidationError('Invalid Admin ID format');
    const admin = await Admin.findById(id);
    if (!admin) throw new NotFoundError('Administrator not found');
    return admin.toJSON();
  }

  async createAdmin(data) {
    const {
      fullName, username, email, password, mobileNumber,
      role = 'Nodal Officer', primaryRole = 'District Nodal Lead',
      accessLevel = 'District Level Access', district = 'Ranchi',
      assignedDepartment = 'Higher & Technical Education',
      employeeId, dateOfJoining, address, status = 'Active'
    } = data;

    if (!fullName || !email || !mobileNumber) {
      throw new ValidationError('Full name, email, and mobile number are required');
    }

    const existingEmail = await Admin.findOne({ email: email.toLowerCase().trim() });
    if (existingEmail) throw new ValidationError('An administrator with this email already exists');

    const finalUsername = (username && username.trim()) || email.split('@')[0];
    const existingUsername = await Admin.findOne({ username: finalUsername.toLowerCase().trim() });
    if (existingUsername) throw new ValidationError('Username is already taken');

    const cleanPassword = password && password.trim() ? password.trim() : 'Nodal@123456';
    const passwordHash = await bcrypt.hash(cleanPassword, 10);
    const colors = ['purple', 'green', 'orange', 'pink', 'teal', 'blue', 'cyan', 'indigo'];
    const avatarColor = colors[Math.floor(Math.random() * colors.length)];

    const cleanMobile = mobileNumber.toString().replace(/[^0-9]/g, '').slice(-10);

    const newAdmin = new Admin({
      fullName: fullName.trim(),
      username: finalUsername.toLowerCase().trim(),
      email: email.toLowerCase().trim(),
      password: cleanPassword,
      passwordHash,
      mobileNumber: cleanMobile || mobileNumber.trim(),
      role,
      primaryRole,
      accessLevel,
      district,
      assignedDepartment,
      employeeId: employeeId?.trim() || null,
      dateOfJoining: dateOfJoining ? new Date(dateOfJoining) : new Date(),
      address: address?.trim() || null,
      status,
      avatarColor,
      lastLogin: 'Never logged in'
    });

    await newAdmin.save();
    await syncAdminUserAuth(newAdmin, passwordHash);

    return newAdmin.toJSON();
  }

  async updateAdmin(id, updateData) {
    if (!mongoose.Types.ObjectId.isValid(id)) throw new ValidationError('Invalid Admin ID format');
    const existing = await Admin.findById(id).select('+passwordHash');
    if (!existing) throw new NotFoundError('Administrator not found');

    const oldEmail = existing.email;
    const { email, username, password, mobileNumber, ...rest } = updateData;

    if (email && email.toLowerCase().trim() !== existing.email) {
      const duplicateEmail = await Admin.findOne({ email: email.toLowerCase().trim(), _id: { $ne: id } });
      if (duplicateEmail) throw new ValidationError('Email already in use by another admin');
      existing.email = email.toLowerCase().trim();
      if (!username) {
        existing.username = email.split('@')[0].toLowerCase().trim();
      }
    }

    if (username && username.toLowerCase().trim() !== existing.username) {
      const duplicateUsername = await Admin.findOne({ username: username.toLowerCase().trim(), _id: { $ne: id } });
      if (duplicateUsername) throw new ValidationError('Username already in use');
      existing.username = username.toLowerCase().trim();
    }

    if (mobileNumber) {
      existing.mobileNumber = mobileNumber.toString().replace(/[^0-9]/g, '').slice(-10) || mobileNumber.trim();
    }

    let newPasswordHash = null;
    if (password && password.trim()) {
      const cleanPass = password.trim();
      newPasswordHash = await bcrypt.hash(cleanPass, 10);
      existing.password = cleanPass;
      existing.passwordHash = newPasswordHash;
    }

    Object.assign(existing, rest);
    await existing.save();

    await syncAdminUserAuth(existing, newPasswordHash || existing.passwordHash, oldEmail);

    return existing.toJSON();
  }

  async updateAdminStatus(id, status) {
    if (!['Active', 'Suspended', 'Restricted', 'Removed'].includes(status)) {
      throw new ValidationError('Invalid status value');
    }
    const admin = await Admin.findByIdAndUpdate(id, { status }, { new: true, runValidators: true });
    if (!admin) throw new NotFoundError('Administrator not found');
    return admin.toJSON();
  }

  async deleteAdmin(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) throw new ValidationError('Invalid Admin ID format');
    const admin = await Admin.findById(id);
    if (!admin) throw new NotFoundError('Administrator not found');

    // Cascade delete associated User account and refresh tokens
    try {
      const User = mongoose.model('User');
      const RefreshToken = mongoose.model('RefreshToken');
      const userDoc = await User.findOne({ email: admin.email.toLowerCase().trim() });
      if (userDoc) {
        await RefreshToken.deleteMany({ userId: userDoc._id }).catch(() => {});
        await User.findByIdAndDelete(userDoc._id).catch(() => {});
      }
    } catch (e) {
      console.warn('Cascade user deletion error during admin delete:', e.message);
    }

    await Admin.findByIdAndDelete(id);
    return true;
  }
}

export const adminService = new AdminService();
export default adminService;
