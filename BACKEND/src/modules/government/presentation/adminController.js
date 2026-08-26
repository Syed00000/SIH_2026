import mongoose from 'mongoose';
import Admin from '../infrastructure/models/Admin.js';
import { NotFoundError, ValidationError } from '../../../shared/errors/AppError.js';
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
    if (role && role !== 'All' && role !== 'All Roles') query.role = new RegExp(`^${role}$`, 'i');
    if (status && status !== 'All' && status !== 'All Status') query.status = new RegExp(`^${status}$`, 'i');
    if (district && district !== 'All' && district !== 'All Districts') query.district = new RegExp(`^${district}$`, 'i');

    const [totalRecords, docs, stats] = await Promise.all([
      Admin.countDocuments(query),
      Admin.find(query).sort({ createdAt: -1 }).skip((pageNum - 1) * limitNum).limit(limitNum),
      calculateStats()
    ]);

    res.json({
      success: true,
      stats,
      data: docs.map(d => ({ ...d.toJSON(), id: d._id.toString() })),
      pagination: { totalRecords, page: pageNum, limit: limitNum, totalPages: Math.ceil(totalRecords / limitNum) || 1 }
    });
  } catch (error) { next(error); }
};

export const getAdminStats = async (req, res, next) => {
  try { res.json({ success: true, data: await calculateStats() }); } catch (error) { next(error); }
};

export const getAdminById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) throw new NotFoundError(`Invalid Admin ID`);
    const doc = await Admin.findById(id);
    if (!doc) throw new NotFoundError(`Admin not found`);
    res.json({ success: true, data: { ...doc.toJSON(), id: doc._id.toString() } });
  } catch (error) { next(error); }
};

export const createAdmin = async (req, res, next) => {
  try {
    const { fullName, username, email, mobileNumber, role, primaryRole, accessLevel, district, assignedDepartment, employeeId, dateOfJoining, address, status, password } = req.body;
    if (!fullName?.trim() || !email?.trim() || !mobileNumber?.trim()) {
      throw new ValidationError('Full Name, Email, and Mobile Number are required');
    }

    const cleanEmail = email.toLowerCase().trim();
    const existing = await Admin.findOne({ email: cleanEmail });
    if (existing) throw new ValidationError(`Administrator with email "${cleanEmail}" already exists`);

    const rawPass = password && password.trim() ? password.trim() : 'Admin@123456';
    const passwordHash = await bcrypt.hash(rawPass, 12);
    
    let joinDate = new Date();
    if (dateOfJoining) {
      const parsed = new Date(dateOfJoining);
      if (!isNaN(parsed.getTime())) joinDate = parsed;
    }

    const doc = await Admin.create({
      fullName: fullName.trim(),
      username: (username || email.split('@')[0]).trim().toLowerCase(),
      email: cleanEmail,
      mobileNumber: mobileNumber.startsWith('+91') ? mobileNumber.trim() : `+91 ${mobileNumber.trim()}`,
      passwordHash,
      role: !role || role === 'Select role' ? 'District Admin' : role,
      primaryRole: !primaryRole || primaryRole === 'Select primary role' ? 'Administrator' : primaryRole,
      accessLevel: !accessLevel || accessLevel === 'Select access level' ? 'District Level Access' : accessLevel,
      district: !district || district === 'Select district' ? 'Ranchi' : district,
      assignedDepartment: !assignedDepartment || assignedDepartment === 'Select department' ? 'Higher & Technical Education' : assignedDepartment,
      employeeId: employeeId || '',
      dateOfJoining: joinDate,
      address: address || '',
      status: status || 'Active',
      avatarColor: ['purple', 'green', 'orange', 'pink', 'teal', 'blue', 'cyan'][Math.floor(Math.random() * 7)]
    });

    res.status(201).json({ success: true, message: 'Admin created successfully', data: { ...doc.toJSON(), id: doc._id.toString() } });
  } catch (error) { next(error); }
};

export const updateAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) throw new NotFoundError(`Invalid Admin ID: ${id}`);
    
    const updateData = { ...req.body };
    delete updateData.id;
    delete updateData._id;
    if (updateData.email) updateData.email = updateData.email.toLowerCase().trim();
    if (updateData.dateOfJoining) {
      const parsed = new Date(updateData.dateOfJoining);
      if (!isNaN(parsed.getTime())) updateData.dateOfJoining = parsed;
      else delete updateData.dateOfJoining;
    }

    const updated = await Admin.findByIdAndUpdate(id, { $set: updateData }, { new: true });
    if (!updated) throw new NotFoundError(`Admin with ID ${id} not found`);
    res.json({ success: true, message: 'Admin updated successfully', data: { ...updated.toJSON(), id: updated._id.toString() } });
  } catch (error) { next(error); }
};

export const updateAdminStatus = async (req, res, next) => {
  try {
    const { id } = req.params, { status } = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) throw new NotFoundError(`Invalid Admin ID`);
    const updated = await Admin.findByIdAndUpdate(id, { $set: { status } }, { new: true });
    if (!updated) throw new NotFoundError(`Admin not found`);
    res.json({ success: true, message: `Status updated to ${status}`, data: { ...updated.toJSON(), id: updated._id.toString() } });
  } catch (error) { next(error); }
};

export const deleteAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) throw new NotFoundError(`Invalid Admin ID`);
    const deleted = await Admin.findByIdAndDelete(id);
    if (!deleted) throw new NotFoundError(`Admin not found`);
    res.json({ success: true, message: 'Admin deleted successfully', data: { ...deleted.toJSON(), id: deleted._id.toString() } });
  } catch (error) { next(error); }
};

export default { getAdmins, getAdminStats, getAdminById, createAdmin, updateAdmin, updateAdminStatus, deleteAdmin };
