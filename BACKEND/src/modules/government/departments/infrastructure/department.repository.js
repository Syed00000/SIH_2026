import { Department } from './department.schema.js';

export class DepartmentRepository {
  _query(id) {
    if (!id) return null;
    const str = String(id).trim();
    const conds = [{ deptId: str }, { code: str.toUpperCase() }, { wardId: str }, { block: str }];
    if (/^[0-9a-fA-F]{24}$/.test(str)) conds.push({ _id: str });
    return { $or: conds };
  }

  async create(data) {
    return Department.create(data);
  }

  async find(filter = {}, options = {}) {
    const query = Department.find(filter).sort({ createdAt: -1 });
    if (options.limit) query.limit(options.limit);
    if (options.skip) query.skip(options.skip);
    return query.lean();
  }

  async count(filter = {}) {
    return Department.countDocuments(filter);
  }

  async findById(id) {
    const q = this._query(id);
    return q ? Department.findOne(q).lean() : null;
  }

  async findByCode(code) {
    return Department.findOne({ code: String(code).toUpperCase() }).lean();
  }

  async update(id, updates) {
    const q = this._query(id);
    return q ? Department.findOneAndUpdate(q, { $set: updates }, { new: true }).lean() : null;
  }

  async delete(id) {
    const q = this._query(id);
    return q ? Department.findOneAndDelete(q).lean() : null;
  }
}

export const departmentRepository = new DepartmentRepository();
export default departmentRepository;
