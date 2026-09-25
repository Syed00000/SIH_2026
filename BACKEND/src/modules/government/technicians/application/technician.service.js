import bcrypt from 'bcryptjs';
import technicianRepository from '../infrastructure/technician.repository.js';
import config from '../../../../shared/config/index.js';
import { ConflictError } from '../../../../shared/errors/AppError.js';
import { generateUniqueTechnicianId, generateDefaultDeptTechId } from './technician-id.helper.js';
import { syncTechnicianToUser } from '../../../auth/application/services/technician-auth.helper.js';

const DEFAULT_TRADE_MAP = {
  water: { name: 'Ram Kumar Mahto', trade: 'Drinking Water & Handpump Mechanic', phone: '9431100201' },
  electric: { name: 'Sunil Oraon', trade: 'High-Tension Lineman & Grid Overseer', phone: '9431100202' },
  road: { name: 'Manoj Singh', trade: 'Rural Works & Road Overseer', phone: '9431100203' },
  sanitation: { name: 'Anil Kumar', trade: 'Solid Waste & Drainage Supervisor', phone: '9431100204' },
  health: { name: 'Sunita Devi', trade: 'Anganwadi Coordinator & Health Worker', phone: '9431100205' }
};

export const technicianService = {
  ensureDefaultTechnicians: async (departmentId, departmentName = '', block = '', district = 'Ranchi') => {
    if (!departmentId) return;
    const existing = await technicianRepository.count({ departmentId });
    if (existing > 0) return;

    const lowerDept = (departmentName || '').toLowerCase();
    let key = 'water';
    if (lowerDept.includes('electric') || lowerDept.includes('power')) key = 'electric';
    else if (lowerDept.includes('road')) key = 'road';
    else if (lowerDept.includes('sanitation') || lowerDept.includes('waste')) key = 'sanitation';
    else if (lowerDept.includes('health') || lowerDept.includes('anganwadi')) key = 'health';

    const def = DEFAULT_TRADE_MAP[key] || DEFAULT_TRADE_MAP.water;
    const cleanKey = key;
    const deptSuffix = departmentId.replace(/[^a-zA-Z0-9]/g, '').slice(-6);
    const loginEmail = `tech.${cleanKey}.${deptSuffix.toLowerCase()}@jharkhand.gov.in`;
    const defaultTechPassword = config.DEFAULT_TECH_PASSWORD || process.env.DEFAULT_TECH_PASSWORD || 'Tech@JH2026!';
    const techId = generateDefaultDeptTechId(departmentId, cleanKey);

    try {
      const passwordHash = await bcrypt.hash(defaultTechPassword, 10);
      const created = await technicianRepository.create({
        technicianId: techId,
        name: def.name,
        departmentId,
        departmentName: departmentName || 'Department Wing',
        specialization: def.trade,
        phone: def.phone,
        email: loginEmail,
        district,
        block,
        credentials: {
          loginId: loginEmail,
          loginEmail,
          password: defaultTechPassword,
          generatedPassword: defaultTechPassword,
          passwordHash
        },
        status: 'Active',
        notes: 'Designated field technician for gram panchayat inspections'
      });
      const MongooseUser = (await import('../../../users/infrastructure/model.js')).default;
      await syncTechnicianToUser(created, MongooseUser, bcrypt);
    } catch (err) {
      if (err.code !== 11000) {
        console.error('Failed to create default technician:', err);
      }
    }
  },

  getTechnicians: async (filters = {}, pagination = {}) => {
    const query = {};
    if (filters.departmentId) query.departmentId = filters.departmentId;
    if (filters.block) query.block = filters.block;
    if (filters.district) query.district = filters.district;
    if (filters.status) query.status = filters.status;

    if (filters.departmentId) {
      await technicianService.ensureDefaultTechnicians(
        filters.departmentId,
        filters.departmentName,
        filters.block,
        filters.district
      );
    }

    const technicians = await technicianRepository.find(query, {
      sort: { createdAt: -1 },
      limit: Number(pagination.limit) || 100
    });
    return technicians.map((t) => (t && typeof t.toJSON === 'function' ? t.toJSON() : t));
  },

  getTechnicianById: async (id) => {
    return technicianRepository.findById(id);
  },

  createTechnician: async (data) => {
    const techId = data.technicianId?.trim() || (await generateUniqueTechnicianId(technicianRepository, data.departmentId));
    const email = (data.email || data.credentials?.loginEmail || `${techId.toLowerCase()}@jharkhand.gov.in`).toLowerCase().trim();

    const existing = await technicianRepository.findOne({
      $or: [{ email }, { 'credentials.loginEmail': email }, { technicianId: techId }]
    });
    if (existing) {
      throw new ConflictError(`A technician with email "${email}" or ID "${techId}" already exists.`);
    }

    const defaultTechPassword = config.DEFAULT_TECH_PASSWORD || process.env.DEFAULT_TECH_PASSWORD || 'Tech@JH2026!';
    const password = data.credentials?.password?.trim() || data.password?.trim() || defaultTechPassword;
    const passwordHash = await bcrypt.hash(password, 10);

    const created = await technicianRepository.create({
      ...data,
      technicianId: techId,
      email,
      credentials: {
        loginId: email,
        loginEmail: email,
        password,
        generatedPassword: password,
        passwordHash
      }
    });

    try {
      const MongooseUser = (await import('../../../users/infrastructure/model.js')).default;
      await syncTechnicianToUser(created, MongooseUser, bcrypt);
    } catch (userErr) {
      console.warn('MongooseUser creation error for technician:', userErr.message);
    }

    return created;
  },

  updateTechnician: async (id, data) => {
    if (data.password || data.credentials?.password || data.email) {
      try {
        const existing = await technicianRepository.findById(id);
        const newPass = data.credentials?.password?.trim() || data.password?.trim();
        const email = (data.email || existing?.email || '').toLowerCase().trim();
        if (newPass) {
          const passwordHash = await bcrypt.hash(newPass, 10);
          data.credentials = {
            ...(existing?.credentials || {}),
            password: newPass,
            generatedPassword: newPass,
            passwordHash
          };
          const MongooseUser = (await import('../../../users/infrastructure/model.js')).default;
          await MongooseUser.findOneAndUpdate(
            { $or: [{ email }, { 'profile.technicianId': existing?.technicianId }] },
            { passwordHash, role: 'TECHNICIAN', accountStatus: 'ACTIVE', emailVerification: { verified: true, verifiedAt: new Date() } }
          );
        }
      } catch (err) {
        console.warn('MongooseUser update on technician update error:', err.message);
      }
    }
    return technicianRepository.update(id, data);
  },

  deleteTechnician: async (id) => {
    try {
      const existing = await technicianRepository.findById(id);
      if (existing?.email || existing?.technicianId) {
        const MongooseUser = (await import('../../../users/infrastructure/model.js')).default;
        await MongooseUser.deleteOne({
          $or: [
            { email: existing.email?.toLowerCase() },
            { 'profile.technicianId': existing.technicianId }
          ]
        }).catch(() => {});
      }
    } catch (delErr) {
      console.warn('MongooseUser delete error for technician:', delErr.message);
    }
    return technicianRepository.delete(id);
  }
};

export default technicianService;
