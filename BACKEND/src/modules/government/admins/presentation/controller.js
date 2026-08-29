import mongoose from 'mongoose';
import Admin from '../infrastructure/model.js';
import MongooseUser from '../../../users/infrastructure/model.js';
import { NotFoundError, ValidationError } from '../../../../shared/errors/AppError.js';
import logger from '../../../../shared/logger/index.js';
import bcrypt from 'bcryptjs';

export const calculateStats = async () => {
  try {
    const [total, active, suspended, removed] = await Promise.all([
      Admin.countDocuments(),
      Admin.countDocuments({ status: 'Active' }),
      Admin.countDocuments({ status: 'Suspended' }),
      Admin.countDocuments({ status: { $in: ['Removed', 'Restricted'] } })
    ]);
    return { totalAdmins: total, activeAdmins: active, suspendedAdmins: suspended, removedAdmins: removed };
  } catch {
    return { totalAdmins: 0, activeAdmins: 0, suspendedAdmins: 0, removedAdmins: 0 };
  }
};

export const getAdmins = async (req, res, next) => {
  try {
    const { search = '', role = 'All', status = 'All', district = 'All', page = 1, limit = 10 } = req.query;
    const pageNum = parseInt(page, 10) || 1, limitNum = parseInt(limit, 10) || 10;
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

    res.json({
      success: true,
      stats,
      data: docs.map(d => d.toJSON()),
      pagination: {
        totalRecords,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(totalRecords / limitNum) || 1
      }
    });
  } catch (error) { next(error); }
};

export const getAdminStats = async (req, res, next) => {
  try { res.json({ success: true, data: await calculateStats() }); } catch (error) { next(error); }
};

export const getAdminById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) throw new ValidationError('Invalid Admin ID format');

    const admin = await Admin.findById(id);
    if (!admin) throw new NotFoundError('Administrator not found');

    res.json({ success: true, data: admin.toJSON() });
  } catch (error) { next(error); }
};

export const createAdmin = async (req, res, next) => {
  try {
    const {
      fullName,
      username,
      email,
      password,
      mobileNumber,
      role = 'District Admin',
      primaryRole = 'Administrator',
      accessLevel = 'District Level Access',
      district = 'Ranchi',
      assignedDepartment = 'Higher & Technical Education',
      employeeId,
      dateOfJoining,
      address,
      status = 'Active'
    } = req.body;

    if (!fullName || !email || !mobileNumber) {
      throw new ValidationError('Full name, email, and mobile number are required');
    }

    const existingEmail = await Admin.findOne({ email: email.toLowerCase().trim() });
    if (existingEmail) throw new ValidationError('An administrator with this email already exists');

    const finalUsername = (username && username.trim()) || email.split('@')[0];
    const existingUsername = await Admin.findOne({ username: finalUsername.toLowerCase().trim() });
    if (existingUsername) throw new ValidationError('Username is already taken');

    const passwordHash = password ? await bcrypt.hash(password, 10) : await bcrypt.hash('Admin@Jharkhand2026!', 10);

    const colors = ['purple', 'green', 'orange', 'pink', 'teal', 'blue', 'cyan', 'indigo'];
    const avatarColor = colors[Math.floor(Math.random() * colors.length)];

    const newAdmin = new Admin({
      fullName: fullName.trim(),
      username: finalUsername.toLowerCase().trim(),
      email: email.toLowerCase().trim(),
      passwordHash,
      mobileNumber: mobileNumber.trim(),
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

    // Automatically sync login credentials with users authentication collection
    const authRole = role.toLowerCase().includes('nodal') ? 'NODAL' : 'GOVERNMENT';
    await MongooseUser.findOneAndUpdate(
      { email: newAdmin.email },
      {
        fullName: newAdmin.fullName,
        mobileNumber: newAdmin.mobileNumber,
        passwordHash: passwordHash,
        role: authRole,
        accountStatus: newAdmin.status === 'Active' ? 'ACTIVE' : 'SUSPENDED',
        emailVerification: { verified: true, verifiedAt: new Date() },
        profile: {
          institutionName: newAdmin.assignedDepartment,
          nodalOfficerDesignation: newAdmin.role,
          preferredLanguage: 'HINDI'
        }
      },
      { upsert: true, new: true }
    );

    logger.info({ msg: 'Admin created & user auth synchronized successfully in MongoDB', adminId: newAdmin._id, email: newAdmin.email });

    res.status(201).json({
      success: true,
      message: 'Administrator created successfully',
      data: newAdmin.toJSON()
    });
  } catch (error) { next(error); }
};

export const updateAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) throw new ValidationError('Invalid Admin ID format');

    const existing = await Admin.findById(id);
    if (!existing) throw new NotFoundError('Administrator not found');

    const { email, username, password, ...rest } = req.body;
    if (email && email.toLowerCase().trim() !== existing.email) {
      const duplicateEmail = await Admin.findOne({ email: email.toLowerCase().trim(), _id: { $ne: id } });
      if (duplicateEmail) throw new ValidationError('Email already in use by another admin');
      existing.email = email.toLowerCase().trim();
    }
    if (username && username.toLowerCase().trim() !== existing.username) {
      const duplicateUsername = await Admin.findOne({ username: username.toLowerCase().trim(), _id: { $ne: id } });
      if (duplicateUsername) throw new ValidationError('Username already in use');
      existing.username = username.toLowerCase().trim();
    }
    if (password && password.trim()) {
      existing.passwordHash = await bcrypt.hash(password.trim(), 10);
    }

    Object.assign(existing, rest);
    await existing.save();

    res.json({
      success: true,
      message: 'Administrator updated successfully',
      data: existing.toJSON()
    });
  } catch (error) { next(error); }
};

export const updateAdminStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!['Active', 'Suspended', 'Restricted', 'Removed'].includes(status)) {
      throw new ValidationError('Invalid status value');
    }

    const admin = await Admin.findByIdAndUpdate(id, { status }, { new: true, runValidators: true });
    if (!admin) throw new NotFoundError('Administrator not found');

    res.json({
      success: true,
      message: `Administrator status changed to ${status}`,
      data: admin.toJSON()
    });
  } catch (error) { next(error); }
};

export const deleteAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) throw new ValidationError('Invalid Admin ID format');

    const admin = await Admin.findByIdAndDelete(id);
    if (!admin) throw new NotFoundError('Administrator not found');

    res.json({ success: true, message: 'Administrator permanently removed from database' });
  } catch (error) { next(error); }
};
