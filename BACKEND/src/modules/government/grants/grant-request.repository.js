import { DepartmentGrantRequest } from './grant-request.model.js';

export class GrantRequestRepository {
  async create(data) {
    return DepartmentGrantRequest.create(data);
  }

  async find(filter = {}, options = {}) {
    const query = DepartmentGrantRequest.find(filter).sort({ createdAt: -1 });
    if (options.limit) query.limit(options.limit);
    if (options.skip) query.skip(options.skip);
    return query.lean();
  }

  async count(filter = {}) {
    return DepartmentGrantRequest.countDocuments(filter);
  }

  async findById(id) {
    if (id.startsWith('GR-') || id.startsWith('REQ-')) {
      return DepartmentGrantRequest.findOne({ requestId: id }).lean();
    }
    return DepartmentGrantRequest.findById(id).lean();
  }

  async update(id, updates) {
    const query = id.startsWith('GR-') || id.startsWith('REQ-')
      ? { requestId: id }
      : { _id: id };
    return DepartmentGrantRequest.findOneAndUpdate(
      query,
      { $set: updates },
      { new: true, runValidators: true }
    ).lean();
  }

  async delete(id) {
    const query = id.startsWith('GR-') || id.startsWith('REQ-')
      ? { requestId: id }
      : { _id: id };
    return DepartmentGrantRequest.findOneAndDelete(query).lean();
  }
}

export const grantRequestRepository = new GrantRequestRepository();
export default grantRequestRepository;
