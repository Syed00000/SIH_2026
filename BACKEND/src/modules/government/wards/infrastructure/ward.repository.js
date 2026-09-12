import mongoose from 'mongoose';
import { Ward } from './ward.schema.js';

export class WardRepository {
  async findAll({ district, blockId, search } = {}) {
    const query = { status: { $ne: 'Archived' } };
    if (district && district !== 'All') {
      query.district = new RegExp(`^${district}$`, 'i');
    }
    if (blockId) {
      query.blockId = blockId;
    }
    if (search) {
      const regex = new RegExp(search, 'i');
      query.$or = [{ name: regex }, { wardId: regex }, { localities: regex }, { councillorName: regex }];
    }
    return await Ward.find(query).sort({ wardNumber: 1, name: 1 }).lean();
  }

  async findById(id) {
    if (!id) return null;
    const isObjectId = mongoose.Types.ObjectId.isValid(id);
    const query = isObjectId
      ? { $or: [{ _id: id }, { wardId: id.toString().toUpperCase() }] }
      : { wardId: id.toString().toUpperCase() };
    return await Ward.findOne(query).lean();
  }

  async findByWardNumber(wardNumber, district = 'Ranchi') {
    return await Ward.findOne({
      wardNumber: Number(wardNumber),
      district: new RegExp(`^${district}$`, 'i'),
      status: { $ne: 'Archived' }
    }).lean();
  }

  async create(data) {
    const ward = new Ward(data);
    const saved = await ward.save();
    return saved.toJSON();
  }

  async update(id, updates) {
    const isObjectId = mongoose.Types.ObjectId.isValid(id);
    const query = isObjectId
      ? { $or: [{ _id: id }, { wardId: id.toString().toUpperCase() }] }
      : { wardId: id.toString().toUpperCase() };
    return await Ward.findOneAndUpdate(query, { $set: updates }, { new: true, runValidators: true }).lean();
  }

  async delete(id) {
    const isObjectId = mongoose.Types.ObjectId.isValid(id);
    const query = isObjectId
      ? { $or: [{ _id: id }, { wardId: id.toString().toUpperCase() }] }
      : { wardId: id.toString().toUpperCase() };
    return await Ward.findOneAndDelete(query).lean();
  }

  async count(district) {
    const query = { status: { $ne: 'Archived' } };
    if (district && district !== 'All') query.district = new RegExp(`^${district}$`, 'i');
    return await Ward.countDocuments(query);
  }
}

export const wardRepository = new WardRepository();
export default wardRepository;
