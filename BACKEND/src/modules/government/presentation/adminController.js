import mongoose from 'mongoose';
import Admin from '../infrastructure/models/Admin.js';
import { NotFoundError, ValidationError } from '../../../shared/errors/AppError.js';
import logger from '../../../shared/logger/index.js';
import bcrypt from 'bcryptjs';

export const INITIAL_ADMINS = [
  { fullName: 'Ankit Sharma', username: 'ankit.sharma', mobileNumber: '+91 98765 43210', email: 'ankit.sharma@jh.gov.in', role: 'Super Admin', primaryRole: 'Administrator', accessLevel: 'Full System Access', district: 'Ranchi', assignedDepartment: 'Higher & Technical Education', lastLogin: '24 May 2026 10:30 AM', status: 'Active', avatarColor: 'purple' },
  { fullName: 'Ritu Verma', username: 'ritu.verma', mobileNumber: '+91 91234 56789', email: 'ritu.verma@jh.gov.in', role: 'Nodal Officer', primaryRole: 'Department Head', accessLevel: 'District Level Access', district: 'Dhanbad', assignedDepartment: 'Science & Technology', lastLogin: '23 May 2026 04:15 PM', status: 'Active', avatarColor: 'green' },
  { fullName: 'Prakash Singh', username: 'prakash.singh', mobileNumber: '+91 92345 67890', email: 'prakash.singh@jh.gov.in', role: 'District Admin', primaryRole: 'Administrator', accessLevel: 'District Level Access', district: 'Jamshedpur', assignedDepartment: 'IT & e-Governance', lastLogin: '22 May 2026 11:20 AM', status: 'Active', avatarColor: 'orange' },
  { fullName: 'Manoj Kumar', username: 'manoj.kumar', mobileNumber: '+91 98345 67812', email: 'manoj.kumar@jh.gov.in', role: 'HEI Admin', primaryRole: 'Technical Officer', accessLevel: 'Read & Write', district: 'Ranchi', assignedDepartment: 'Higher & Technical Education', lastLogin: '21 May 2026 09:45 AM', status: 'Suspended', avatarColor: 'pink' },
  { fullName: 'Neha Sinha', username: 'neha.sinha', mobileNumber: '+91 91232 45678', email: 'neha.sinha@jh.gov.in', role: 'Nodal Officer', primaryRole: 'Department Head', accessLevel: 'District Level Access', district: 'Bokaro', assignedDepartment: 'Tribal Welfare', lastLogin: '20 May 2026 02:30 PM', status: 'Suspended', avatarColor: 'yellow' },
  { fullName: 'Amit Kumar', username: 'amit.kumar', mobileNumber: '+91 90000 11122', email: 'amit.kumar@jh.gov.in', role: 'HEI Admin', primaryRole: 'Technical Officer', accessLevel: 'Audit Only', district: 'Dhanbad', assignedDepartment: 'Urban Development', lastLogin: '18 May 2026 10:10 AM', status: 'Removed', avatarColor: 'teal' },
  { fullName: 'Sneha Priya', username: 'sneha.priya', mobileNumber: '+91 93456 78901', email: 'sneha.priya@jh.gov.in', role: 'District Admin', primaryRole: 'Administrator', accessLevel: 'District Level Access', district: 'Palamu', assignedDepartment: 'IT & e-Governance', lastLogin: 'Today 09:05 AM', status: 'Active', avatarColor: 'blue' },
  { fullName: 'Deepak Barman', username: 'deepak.barman', mobileNumber: '+91 95777 22111', email: 'deepak.barman@jh.gov.in', role: 'Nodal Officer', primaryRole: 'Department Head', accessLevel: 'District Level Access', district: 'Giridih', assignedDepartment: 'Higher & Technical Education', lastLogin: 'Yesterday 03:25 PM', status: 'Active', avatarColor: 'cyan' },
  { fullName: 'Sanjay Murmu', username: 'sanjay.murmu', mobileNumber: '+91 94311 88990', email: 'sanjay.murmu@jh.gov.in', role: 'District Admin', primaryRole: 'Administrator', accessLevel: 'District Level Access', district: 'Dumka', assignedDepartment: 'Tribal Welfare', lastLogin: '24 May 2026 08:30 AM', status: 'Active', avatarColor: 'emerald' },
  { fullName: 'Pooja Agarwal', username: 'pooja.agarwal', mobileNumber: '+91 98350 12345', email: 'pooja.agarwal@jh.gov.in', role: 'Nodal Officer', primaryRole: 'Department Head', accessLevel: 'District Level Access', district: 'Hazaribagh', assignedDepartment: 'Science & Technology', lastLogin: '23 May 2026 11:15 AM', status: 'Active', avatarColor: 'violet' }
].map((a, i) => ({ id: `adm-00${i + 1}`, ...a }));

let memoryAdmins = [...INITIAL_ADMINS];

// Seed Admin collection if empty
const seedAdminsIfEmpty = async () => {
  if (mongoose.connection.readyState === 1) {
    try {
      const count = await Admin.countDocuments();
      if (count === 0) {
        await Admin.insertMany(INITIAL_ADMINS.map(({ id, ...rest }) => rest));
        logger.info('🏛️ Seeded Admin MongoDB Collection with initial records');
      }
    } catch (e) {
      logger.warn({ msg: 'Admin collection seed warning', error: e.message });
    }
  }
};
seedAdminsIfEmpty();

export const calculateStats = async () => {
  if (mongoose.connection.readyState === 1) {
    const [total, active, suspended, removed] = await Promise.all([
      Admin.countDocuments(),
      Admin.countDocuments({ status: 'Active' }),
      Admin.countDocuments({ status: 'Suspended' }),
      Admin.countDocuments({ status: { $in: ['Removed', 'Restricted'] } })
    ]);
    return { totalAdmins: total, activeAdmins: active, suspendedAdmins: suspended, removedAdmins: removed };
  }
  return {
    totalAdmins: memoryAdmins.length,
    activeAdmins: memoryAdmins.filter(a => a.status === 'Active').length,
    suspendedAdmins: memoryAdmins.filter(a => a.status === 'Suspended').length,
    removedAdmins: memoryAdmins.filter(a => a.status === 'Removed' || a.status === 'Restricted').length
  };
};

export const getAdmins = async (req, res, next) => {
  try {
    const { search = '', role = 'All', status = 'All', district = 'All', page = 1, limit = 10 } = req.query;
    const pageNum = parseInt(page, 10) || 1, limitNum = parseInt(limit, 10) || 10;

    if (mongoose.connection.readyState === 1) {
      const query = {};
      if (search.trim()) {
        const regex = new RegExp(search.trim(), 'i');
        query.$or = [{ fullName: regex }, { email: regex }, { username: regex }, { district: regex }, { mobileNumber: regex }, { role: regex }];
      }
      if (role !== 'All') query.role = new RegExp(`^${role}$`, 'i');
      if (status !== 'All') query.status = new RegExp(`^${status}$`, 'i');
      if (district !== 'All') query.district = new RegExp(`^${district}$`, 'i');

      const [totalRecords, docs, stats] = await Promise.all([
        Admin.countDocuments(query),
        Admin.find(query).sort({ createdAt: -1 }).skip((pageNum - 1) * limitNum).limit(limitNum),
        calculateStats()
      ]);
      return res.json({ success: true, stats, data: docs.map(d => d.toJSON()), pagination: { totalRecords, page: pageNum, limit: limitNum, totalPages: Math.ceil(totalRecords / limitNum) || 1 } });
    }

    let filtered = [...memoryAdmins];
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      filtered = filtered.filter(a => a.fullName.toLowerCase().includes(q) || a.email.toLowerCase().includes(q) || a.role.toLowerCase().includes(q) || a.district.toLowerCase().includes(q) || a.mobileNumber.includes(q));
    }
    if (role !== 'All') filtered = filtered.filter(a => a.role.toLowerCase() === role.toLowerCase());
    if (status !== 'All') filtered = filtered.filter(a => a.status.toLowerCase() === status.toLowerCase());
    if (district !== 'All') filtered = filtered.filter(a => a.district.toLowerCase() === district.toLowerCase());

    const totalRecords = filtered.length;
    res.json({ success: true, stats: await calculateStats(), data: filtered.slice((pageNum - 1) * limitNum, pageNum * limitNum), pagination: { totalRecords, page: pageNum, limit: limitNum, totalPages: Math.ceil(totalRecords / limitNum) || 1 } });
  } catch (error) { next(error); }
};

export const getAdminStats = async (req, res, next) => {
  try { res.json({ success: true, data: await calculateStats() }); } catch (error) { next(error); }
};

export const getAdminById = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(req.params.id)) {
      const doc = await Admin.findById(req.params.id);
      if (doc) return res.json({ success: true, data: doc.toJSON() });
    }
    const admin = memoryAdmins.find(a => a.id === req.params.id);
    if (!admin) throw new NotFoundError(`Admin with ID ${req.params.id} not found`);
    res.json({ success: true, data: admin });
  } catch (error) { next(error); }
};

export const createAdmin = async (req, res, next) => {
  try {
    const { fullName, username, email, mobileNumber, role, primaryRole, accessLevel, district, assignedDepartment, employeeId, dateOfJoining, address, status, password } = req.body;
    if (!fullName || !email || !mobileNumber || !role || !district) throw new ValidationError('Full Name, Email, Phone, Role and District are required');

    const cleanEmail = email.toLowerCase().trim();
    if (mongoose.connection.readyState === 1) {
      const existing = await Admin.findOne({ email: cleanEmail });
      if (existing) throw new ValidationError('An admin with this email address already exists');

      const passwordHash = await bcrypt.hash(password || 'Admin@123456', 12);
      const doc = await Admin.create({
        fullName: fullName.trim(), username: (username || email.split('@')[0]).trim().toLowerCase(),
        email: cleanEmail, mobileNumber: mobileNumber.startsWith('+91') ? mobileNumber.trim() : `+91 ${mobileNumber.trim()}`,
        passwordHash, role: role === 'Select role' ? 'District Admin' : role,
        primaryRole: primaryRole || 'Administrator', accessLevel: accessLevel || 'District Level Access',
        district: district === 'Select district' ? 'Ranchi' : district, assignedDepartment: assignedDepartment || 'Higher & Technical Education',
        employeeId: employeeId || '', dateOfJoining: dateOfJoining ? new Date(dateOfJoining) : new Date(),
        address: address || '', status: status || 'Active', avatarColor: ['purple', 'green', 'orange', 'pink', 'teal', 'blue', 'cyan'][Math.floor(Math.random() * 7)]
      });
      return res.status(201).json({ success: true, message: 'Admin saved to database collection', data: doc.toJSON() });
    }

    const newAdmin = { id: `adm-${Date.now().toString().slice(-4)}`, ...req.body, email: cleanEmail };
    memoryAdmins.unshift(newAdmin);
    res.status(201).json({ success: true, message: 'Admin created successfully', data: newAdmin });
  } catch (error) { next(error); }
};

export const updateAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(id)) {
      const updated = await Admin.findByIdAndUpdate(id, { $set: req.body }, { new: true });
      if (updated) return res.json({ success: true, message: 'Admin updated successfully', data: updated.toJSON() });
    }
    const idx = memoryAdmins.findIndex(a => a.id === id);
    if (idx === -1) throw new NotFoundError(`Admin with ID ${id} not found`);
    memoryAdmins[idx] = { ...memoryAdmins[idx], ...req.body };
    res.json({ success: true, message: 'Admin updated successfully', data: memoryAdmins[idx] });
  } catch (error) { next(error); }
};

export const updateAdminStatus = async (req, res, next) => {
  try {
    const { id } = req.params, { status } = req.body;
    if (mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(id)) {
      const updated = await Admin.findByIdAndUpdate(id, { $set: { status } }, { new: true });
      if (updated) return res.json({ success: true, message: `Status updated to ${status}`, data: updated.toJSON() });
    }
    const idx = memoryAdmins.findIndex(a => a.id === id);
    if (idx === -1) throw new NotFoundError(`Admin with ID ${id} not found`);
    memoryAdmins[idx].status = status;
    res.json({ success: true, message: `Admin status changed to ${status}`, data: memoryAdmins[idx] });
  } catch (error) { next(error); }
};

export const deleteAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(id)) {
      const deleted = await Admin.findByIdAndDelete(id);
      if (deleted) return res.json({ success: true, message: `Admin removed`, data: deleted.toJSON() });
    }
    const idx = memoryAdmins.findIndex(a => a.id === id);
    if (idx === -1) throw new NotFoundError(`Admin with ID ${id} not found`);
    const removed = memoryAdmins.splice(idx, 1)[0];
    res.json({ success: true, message: `Admin removed`, data: removed });
  } catch (error) { next(error); }
};

export default { getAdmins, getAdminStats, getAdminById, createAdmin, updateAdmin, updateAdminStatus, deleteAdmin };
