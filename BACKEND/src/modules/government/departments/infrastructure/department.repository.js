import { Department } from './department.schema.js';

export class DepartmentRepository {
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
    if (id.startsWith('DEPT-')) {
      return Department.findOne({ deptId: id }).lean();
    }
    return Department.findById(id).lean();
  }

  async findByCode(code) {
    return Department.findOne({ code: code.toUpperCase() }).lean();
  }

  async update(id, updates) {
    const query = id.startsWith('DEPT-') ? { deptId: id } : { _id: id };
    return Department.findOneAndUpdate(query, { $set: updates }, { new: true, runValidators: true }).lean();
  }

  async delete(id) {
    const query = id.startsWith('DEPT-') ? { deptId: id } : { _id: id };
    return Department.findOneAndDelete(query).lean();
  }
}

export const departmentRepository = new DepartmentRepository();
export default departmentRepository;
