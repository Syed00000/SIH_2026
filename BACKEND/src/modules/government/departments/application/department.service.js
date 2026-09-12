import { departmentRepository } from '../infrastructure/department.repository.js';
import { Admin } from '../../admins/infrastructure/model.js';
import { CitizenChallenge } from '../../../citizen/infrastructure/model.js';
import { ensureDefaultAdminDepartments } from './helpers/default-admin-departments.helper.js';

export class DepartmentService {
  constructor(repo = departmentRepository) {
    this.repo = repo;
  }

  async generateDeptId() {
    const randomHex = Math.floor(1000 + Math.random() * 9000);
    const candidate = `DEPT-JH-${randomHex}`;
    const existing = await this.repo.findById(candidate);
    if (existing) return this.generateDeptId();
    return candidate;
  }

  async listDepartments(filters = {}) {
    await ensureDefaultAdminDepartments(this.repo);

    const mongoFilter = {};
    if (filters.district && filters.district !== 'all' && filters.district !== 'All Districts') {
      mongoFilter.district = new RegExp(`^${filters.district.trim()}$`, 'i');
    }
    if (filters.block && filters.block !== 'all') {
      mongoFilter.block = new RegExp(`^${filters.block.trim()}$`, 'i');
    }
    if (filters.category && filters.category !== 'all') {
      mongoFilter.category = filters.category;
    }
    if (filters.status && filters.status !== 'all') {
      mongoFilter.status = filters.status;
    }

    const departments = await this.repo.find(mongoFilter);
    const [allAdmins, allChallenges] = await Promise.all([
      Admin.find({ status: { $ne: 'Removed' } }).select('fullName email mobileNumber district assignedDepartment role primaryRole status').lean(),
      CitizenChallenge.find({ isDeleted: { $ne: true } }).select('challengeId title description district domain priority status location isDeployed assignedDepartment submitter submittedAt mediaUrls media').lean()
    ]);

    return departments.map((dept) => {
      const deptNameLower = dept.name.toLowerCase().replace(/department of |dept\. of /i, '').replace(/&/g, 'and').trim();
      const deptCodeLower = (dept.code || '').toLowerCase();

      const matchedOfficers = allAdmins.filter((a) => {
        const adminDept = (a.assignedDepartment || '').toLowerCase().replace(/&/g, 'and').trim();
        return adminDept && (adminDept.includes(deptCodeLower) || deptNameLower.includes(adminDept) || adminDept.includes(deptNameLower));
      });

      const matchedChallenges = allChallenges.filter((c) => {
        const assignedDeptId = c.assignedDepartment?.deptId || c.assignedDepartment?.id;
        if (assignedDeptId && (assignedDeptId === dept.deptId || assignedDeptId === dept.id || assignedDeptId === dept._id?.toString())) {
          return true;
        }
        if (c.assignedDepartment?.name && c.assignedDepartment.name.toLowerCase() === dept.name.toLowerCase()) {
          return true;
        }
        const domainClean = (c.domain || '').toLowerCase().replace(/&/g, 'and').trim();
        return domainClean && (domainClean.includes(deptCodeLower) || deptNameLower.includes(domainClean) || domainClean.includes(deptNameLower));
      });

      const raw = typeof dept?.toJSON === 'function' ? dept.toJSON() : dept;
      return {
        ...raw,
        id: raw._id?.toString() || raw.id || raw.deptId,
        officers: matchedOfficers,
        problems: matchedChallenges,
        officersCount: matchedOfficers.length,
        problemsCount: matchedChallenges.length,
        activeProjectsCount: matchedChallenges.filter((p) => p.status === 'Deployed' || p.status === 'In Progress').length
      };
    });
  }

  async createDepartment(data) {
    if (!data.name?.trim()) throw new Error('Department name is required');
    const deptId = data.deptId?.trim() || (await this.generateDeptId());
    const code = data.code?.trim() || data.name.split(' ').map((w) => w[0] || '').join('').toUpperCase();
    const digits = deptId.replace(/\D/g, '') || '2026';
    
    // Use credentials object from frontend if provided, fallback to root level or defaults
    const password = data.credentials?.password?.trim() || data.password?.trim() || `Dept@JH${digits}!`;
    const loginEmail = data.credentials?.loginEmail?.trim() || data.headEmail?.trim() || `${deptId.toLowerCase()}@jharkhand.gov.in`;
    const loginId = data.credentials?.loginId?.trim() || data.loginId?.trim() || deptId;

    const payload = {
      deptId,
      name: data.name.trim(),
      code,
      category: data.category || 'District Department',
      headName: data.headName?.trim() || null,
      headRole: data.headRole?.trim() || 'Department Officer',
      headEmail: data.headEmail?.trim() || null,
      headPhone: data.headPhone?.trim() || null,
      district: data.district?.trim() || 'Ranchi',
      block: data.block?.trim() || '',
      panchayat: data.panchayat?.trim() || '',
      description: data.description?.trim() || '',
      credentials: {
        loginId,
        loginEmail,
        password,
        generatedPassword: password
      },
      status: data.status || 'Active'
    };

    return this.repo.create(payload);
  }

  async getDepartment(id) {
    const departments = await this.listDepartments();
    const dept = departments.find((d) => d.deptId === id || d.id === id || d._id?.toString() === id);
    if (dept) return dept;
    const direct = await this.repo.findById(id);
    if (!direct) throw new Error('Department not found');
    return direct;
  }

  async updateDepartment(id, updates) {
    if (updates.password || updates.headEmail || updates.loginId || updates.credentials) {
      const existing = await this.repo.findById(id);
      const prevCreds = existing?.credentials || {};
      const newPass = updates.credentials?.password?.trim() || updates.password?.trim() || prevCreds.password || prevCreds.generatedPassword || 'Dept@JH2026!';
      updates.credentials = {
        loginId: updates.credentials?.loginId?.trim() || updates.loginId?.trim() || prevCreds.loginId || existing?.deptId || id,
        loginEmail: updates.credentials?.loginEmail?.trim() || updates.headEmail?.trim() || prevCreds.loginEmail,
        password: newPass,
        generatedPassword: newPass
      };
    }
    const dept = await this.repo.update(id, updates);
    if (!dept) throw new Error('Department not found for update');
    return dept;
  }

  async deleteDepartment(id) {
    const dept = await this.repo.delete(id);
    if (!dept) throw new Error('Department not found for deletion');
    return { success: true, message: `Department ${id} deleted successfully` };
  }
}

export const departmentService = new DepartmentService();
export default departmentService;
