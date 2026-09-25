import Technician from './technician.schema.js';

export const technicianRepository = {
  find: async (query = {}, options = {}) => {
    return Technician.find(query)
      .sort(options.sort || { createdAt: -1 })
      .skip(options.skip || 0)
      .limit(options.limit || 100)
      .lean();
  },

  count: async (query = {}) => {
    return Technician.countDocuments(query);
  },

  findById: async (id) => {
    return Technician.findById(id);
  },

  findByTechnicianId: async (technicianId) => {
    return Technician.findOne({ technicianId });
  },

  findOne: async (query = {}) => {
    return Technician.findOne(query);
  },

  create: async (data) => {
    const technician = new Technician(data);
    return technician.save();
  },

  update: async (id, data) => {
    const isOid = typeof id === 'string' && /^[0-9a-fA-F]{24}$/.test(id);
    const query = isOid ? { $or: [{ _id: id }, { technicianId: id }] } : { technicianId: id };
    return Technician.findOneAndUpdate(
      query,
      { $set: data },
      { new: true }
    );
  },

  delete: async (id) => {
    const isOid = typeof id === 'string' && /^[0-9a-fA-F]{24}$/.test(id);
    const query = isOid ? { $or: [{ _id: id }, { technicianId: id }] } : { technicianId: id };
    return Technician.findOneAndDelete(query);
  }
};

export default technicianRepository;
