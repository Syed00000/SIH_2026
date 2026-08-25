import mongoose from 'mongoose';
import Admin from '../infrastructure/models/Admin.js';
import { NotFoundError, ValidationError } from '../../../shared/errors/AppError.js';
import logger from '../../../shared/logger/index.js';
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
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) throw new NotFoundError(`Invalid Admin ID`);
    const doc = await Admin.findById(req.params.id);
    if (!doc) throw new NotFoundError(`Admin with ID ${req.params.id} not found`);
    res.json({ success: true, data: doc.toJSON() });
  } catch (error) { next(error); }
};

export const createAdmin = async (req, res, next) => {
  try {
    const { fullName, username, email, mobileNumber, role, primaryRole, accessLevel, district, assignedDepartment, employeeId, dateOfJoining, address, status, password } = req.body;
    if (!fullName || !email || !mobileNumber || !role || !district) {
      throw new ValidationError('Full Name, Email, Phone, Role and District are required');
    }

    const cleanEmail = email.toLowerCase().trim();
    const existing = await Admin.findOne({ email: cleanEmail });
    if (existing) throw new ValidationError('An administrator with this email already exists in database');

    const passwordHash = await bcrypt.hash(password || 'Admin@123456', 12);
    const doc = await Admin.create({
      fullName: fullName.trim(),
      username: (username || email.split('@')[0]).trim().toLowerCase(),
      email: cleanEmail,
      mobileNumber: mobileNumber.startsWith('+91') ? mobileNumber.trim() : `+91 ${mobileNumber.trim()}`,
      passwordHash,
      role: role === 'Select role' ? 'District Admin' : role,
      primaryRole: primaryRole || 'Administrator',
      accessLevel: accessLevel || 'District Level Access',
      district: district === 'Select district' ? 'Ranchi' : district,
      assignedDepartment: assignedDepartment || 'Higher & Technical Education',
      employeeId: employeeId || '',
      dateOfJoining: dateOfJoining ? new Date(dateOfJoining) : new Date(),
      address: address || '',
      status: status || 'Active',
      avatarColor: ['purple', 'green', 'orange', 'pink', 'teal', 'blue', 'cyan'][Math.floor(Math.random() * 7)]
    });

    res.status(201).json({ success: true, message: 'Admin saved to database collection', data: doc.toJSON() });
  } catch (error) { next(error); }
};

export const updateAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) throw new NotFoundError(`Invalid Admin ID`);
    const updateData = { ...req.body };
    if (updateData.email) updateData.email = updateData.email.toLowerCase().trim();

    const updated = await Admin.findByIdAndUpdate(id, { $set: updateData }, { new: true });
    if (!updated) throw new NotFoundError(`Admin not found in database`);
    res.json({ success: true, message: 'Admin updated successfully', data: updated.toJSON() });
  } catch (error) { next(error); }
};

export const updateAdminStatus = async (req, res, next) => {
  try {
    const { id } = req.params, { status } = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) throw new NotFoundError(`Invalid Admin ID`);
    const updated = await Admin.findByIdAndUpdate(id, { $set: { status } }, { new: true });
    if (!updated) throw new NotFoundError(`Admin not found in database`);
    res.json({ success: true, message: `Status updated to ${status}`, data: updated.toJSON() });
  } catch (error) { next(error); }
};

export const deleteAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) throw new NotFoundError(`Invalid Admin ID`);
    const deleted = await Admin.findByIdAndDelete(id);
    if (!deleted) throw new NotFoundError(`Admin not found in database`);
    res.json({ success: true, message: `Admin removed from database`, data: deleted.toJSON() });
  } catch (error) { next(error); }
};

export default { getAdmins, getAdminStats, getAdminById, createAdmin, updateAdmin, updateAdminStatus, deleteAdmin };
