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

  create: async (data) => {
    const technician = new Technician(data);
    return technician.save();
  },

  update: async (id, data) => {
    return Technician.findOneAndUpdate(
      { $or: [{ _id: id }, { technicianId: id }] },
      { $set: data },
      { new: true, runValidators: true }
    );
  },

  delete: async (id) => {
    return Technician.findOneAndDelete({ $or: [{ _id: id }, { technicianId: id }] });
  }
};

export default technicianRepository;
