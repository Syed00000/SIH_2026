import MongooseIndustry from './model.js';
import { computeIndustryKpis } from './helpers/industry-kpis.helper.js';
import { buildIndustryFilter } from './helpers/industry-query.helper.js';

export class IndustryRepository {
  async create(data) {
    const industry = new MongooseIndustry(data);
    return await industry.save();
  }

  async findById(id) {
    return await MongooseIndustry.findById(id).populate('userId', 'fullName email mobileNumber accountStatus role');
  }

  async findByIndustryId(industryId) {
    return await MongooseIndustry.findOne({ industryId: industryId.toUpperCase() });
  }

  async findByEmail(email) {
    const normalized = email.toLowerCase().trim();
    return await MongooseIndustry.findOne({
      $or: [
        { officialEmail: normalized },
        { 'credentials.loginEmail': normalized }
      ]
    });
  }

  async findAll(params) {
    const { page = 1, limit = 10 } = params;
    const query = buildIndustryFilter(params);
    const skip = (Number(page) - 1) * Number(limit);

    const [records, total] = await Promise.all([
      MongooseIndustry.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      MongooseIndustry.countDocuments(query)
    ]);

    return {
      records,
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit))
    };
  }

  async getKpis() {
    return computeIndustryKpis(MongooseIndustry);
  }

  async update(id, updateData) {
    return await MongooseIndustry.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );
  }

  async addAuditLog(id, logEntry) {
    return await MongooseIndustry.findByIdAndUpdate(
      id,
      {
        $push: {
          auditLogs: {
            ...logEntry,
            timestamp: new Date()
          }
        }
      },
      { new: true }
    );
  }

  async delete(id) {
    return await MongooseIndustry.findByIdAndDelete(id);
  }

  async count() {
    return await MongooseIndustry.countDocuments();
  }

  async findLatestIndustry() {
    return await MongooseIndustry.findOne().sort({ createdAt: -1 });
  }
}

export const industryRepository = new IndustryRepository();
export default industryRepository;
