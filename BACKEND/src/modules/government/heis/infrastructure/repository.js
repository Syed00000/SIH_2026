import MongooseUniversity from './model.js';
import { UniversityChallenge, UniversityProject } from '../../../university/infrastructure/model.js';

export class UniversityRepository {
  async create(data) {
    const university = new MongooseUniversity(data);
    return await university.save();
  }

  async findById(id) {
    return await MongooseUniversity.findById(id).populate('userId', 'fullName email mobileNumber accountStatus role');
  }

  async findByCode(code) {
    return await MongooseUniversity.findOne({ code: code.toUpperCase() });
  }

  async findByEmail(email) {
    return await MongooseUniversity.findOne({
      $or: [
        { universityEmail: email.toLowerCase() },
        { 'credentials.loginEmail': email.toLowerCase() },
        { 'nodalOfficer.email': email.toLowerCase() }
      ]
    });
  }

  async findAll({ search, district, status, accessStatus, page = 1, limit = 10 }) {
    const query = {};

    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { name: searchRegex },
        { shortName: searchRegex },
        { code: searchRegex },
        { universityEmail: searchRegex },
        { 'nodalOfficer.name': searchRegex },
        { 'nodalOfficer.email': searchRegex }
      ];
    }

    if (district && district !== 'All' && district !== 'All Districts') {
      query.district = new RegExp(`^${district}$`, 'i');
    }

    if (status && status !== 'All' && status !== 'All Status') {
      query.status = status;
    }

    if (accessStatus && accessStatus !== 'All') {
      query.accessStatus = accessStatus;
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [records, total] = await Promise.all([
      MongooseUniversity.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      MongooseUniversity.countDocuments(query)
    ]);

    // Live sync active challenges & projects count from university collections
    const populated = await Promise.all(
      records.map(async (u) => {
        const [activeProjectsCount, activeChallengesCount] = await Promise.all([
          UniversityProject.countDocuments({ universityCode: u.code, status: { $ne: 'Completed' } }),
          UniversityChallenge.countDocuments({ universityCode: u.code, status: { $in: ['Review', 'Accepted', 'In Progress'] } })
        ]);
        return {
          ...u,
          quickSummary: {
            ...u.quickSummary,
            activeProjects: activeProjectsCount || u.quickSummary?.activeProjects || 0,
            activeChallenges: activeChallengesCount || 0
          }
        };
      })
    );

    return {
      records: populated,
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit))
    };
  }

  async getKpis() {
    const [total, active, disabled, pending] = await Promise.all([
      MongooseUniversity.countDocuments(),
      MongooseUniversity.countDocuments({ accessStatus: 'Enabled', status: 'Approved' }),
      MongooseUniversity.countDocuments({ accessStatus: 'Disabled' }),
      MongooseUniversity.countDocuments({ status: 'Pending' })
    ]);

    return {
      totalUniversities: total,
      activeUniversities: active,
      disabledUniversities: disabled,
      pendingApproval: pending,
      activePercentage: total > 0 ? Number(((active / total) * 100).toFixed(1)) : 0,
      disabledPercentage: total > 0 ? Number(((disabled / total) * 100).toFixed(1)) : 0
    };
  }

  async update(id, updateData) {
    return await MongooseUniversity.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );
  }

  async addAuditLog(id, logEntry) {
    return await MongooseUniversity.findByIdAndUpdate(
      id,
      {
        $push: {
          auditLogs: {
            action: logEntry.action,
            performedBy: logEntry.performedBy || 'Government Admin',
            timestamp: new Date(),
            details: logEntry.details || ''
          }
        }
      },
      { new: true }
    );
  }
}

export const universityRepository = new UniversityRepository();
export default universityRepository;
