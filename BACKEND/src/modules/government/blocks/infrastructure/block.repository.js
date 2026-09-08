import mongoose from 'mongoose';
import { Block } from './block.schema.js';

export class BlockRepository {
  async findAll({ district = '', search = '' } = {}) {
    const query = { status: { $ne: 'Archived' } };
    if (district && district !== 'All' && district !== 'All Districts') {
      query.district = new RegExp(`^${district.trim()}$`, 'i');
    }
    if (search) {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [{ name: regex }, { blockId: regex }, { panchayats: regex }, { bdoName: regex }];
    }
    return await Block.find(query).sort({ name: 1 }).lean();
  }

  async findById(id) {
    if (!id) return null;
    const isObjectId = mongoose.Types.ObjectId.isValid(id);
    const query = isObjectId
      ? { $or: [{ _id: id }, { blockId: id.toString().toUpperCase() }] }
      : { blockId: id.toString().toUpperCase() };
    return await Block.findOne(query).lean();
  }

  async findByName(name, district = 'Ranchi') {
    if (!name) return null;
    return await Block.findOne({
      name: new RegExp(`^${name.trim()}$`, 'i'),
      district: new RegExp(`^${district.trim()}$`, 'i')
    }).lean();
  }

  async create(data) {
    const block = new Block(data);
    const saved = await block.save();
    return saved.toObject();
  }

  async update(id, updates) {
    const isObjectId = mongoose.Types.ObjectId.isValid(id);
    const query = isObjectId
      ? { $or: [{ _id: id }, { blockId: id.toString().toUpperCase() }] }
      : { blockId: id.toString().toUpperCase() };
    return await Block.findOneAndUpdate(query, { $set: updates }, { new: true, runValidators: true }).lean();
  }

  async delete(id) {
    const isObjectId = mongoose.Types.ObjectId.isValid(id);
    const query = isObjectId
      ? { $or: [{ _id: id }, { blockId: id.toString().toUpperCase() }] }
      : { blockId: id.toString().toUpperCase() };
    return await Block.findOneAndDelete(query).lean();
  }

  async count() {
    return await Block.countDocuments({ status: { $ne: 'Archived' } });
  }
}

export const blockRepository = new BlockRepository();
export default blockRepository;
