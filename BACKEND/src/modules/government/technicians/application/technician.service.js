import technicianRepository from '../infrastructure/technician.repository.js';
import Technician from '../infrastructure/technician.schema.js';

const DEFAULT_TRADE_MAP = {
  water: { name: 'Ram Kumar Mahto', trade: 'Drinking Water & Handpump Mechanic', phone: '9431100201' },
  electric: { name: 'Sunil Oraon', trade: 'High-Tension Lineman & Grid Overseer', phone: '9431100202' },
  road: { name: 'Manoj Singh', trade: 'Rural Works & Road Overseer', phone: '9431100203' },
  sanitation: { name: 'Anil Kumar', trade: 'Solid Waste & Drainage Supervisor', phone: '9431100204' },
  health: { name: 'Sunita Devi', trade: 'Anganwadi Coordinator & Health Worker', phone: '9431100205' }
};

export const technicianService = {
  ensureDefaultTechnicians: async (departmentId, departmentName = '', block = 'Kanke Block', district = 'Ranchi') => {
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
    const blockShort = (block || 'Kanke').split(' ')[0].toLowerCase();
    const deptSuffix = departmentId.replace(/[^a-zA-Z0-9]/g, '').slice(-6);
    const loginEmail = `tech.${cleanKey}.${deptSuffix.toLowerCase()}@jharkhand.gov.in`;

    try {
      await technicianRepository.create({
        technicianId: `TECH-${cleanKey.toUpperCase()}-${deptSuffix}`,
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
          password: 'Tech@JH2026!',
          generatedPassword: 'Tech@JH2026!'
        },
        status: 'Active',
        notes: 'Designated field technician for inspections'
      });
    } catch (err) {
      // Ignore duplicate key error safely
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
    const count = await technicianRepository.count();
    const techId = data.technicianId || `TECH-${String(count + 1).padStart(3, '0')}`;
    const email = (data.email || `${techId.toLowerCase()}@jharkhand.gov.in`).toLowerCase();
    const password = data.credentials?.password || data.password || 'Tech@JH2026!';

    return technicianRepository.create({
      ...data,
      technicianId: techId,
      email,
      credentials: {
        loginId: email,
        loginEmail: email,
        password,
        generatedPassword: password
      }
    });
  },

  updateTechnician: async (id, data) => {
    return technicianRepository.update(id, data);
  },

  deleteTechnician: async (id) => {
    return technicianRepository.delete(id);
  }
};

export default technicianService;
