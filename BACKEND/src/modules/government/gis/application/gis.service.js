import { gisRepository } from '../infrastructure/gis.repository.js';

export class GisService {
  constructor(repo = gisRepository) {
    this.repo = repo;
  }

  async getProblems(filters = {}) {
    const problems = await this.repo.findProblems(filters);
    const stats = this.computeStats(problems);
    return {
      problems,
      stats
    };
  }

  computeStats(problems = []) {
    const total = problems.length;
    let highPriority = 0;
    let active = 0;
    let resolved = 0;
    const byCategory = {};
    const byDistrict = {};
    const byStatus = {};
    const bySeverity = {};

    problems.forEach((p) => {
      // Severity counting
      const sev = (p.severity || 'MEDIUM').toUpperCase();
      bySeverity[sev] = (bySeverity[sev] || 0) + 1;
      if (sev === 'HIGH' || sev === 'CRITICAL') {
        highPriority += 1;
      }

      // Status counting
      const st = (p.status || 'UNDER_REVIEW').toUpperCase();
      byStatus[st] = (byStatus[st] || 0) + 1;
      if (st === 'RESOLVED' || st === 'DEPLOYED') {
        resolved += 1;
      } else if (st !== 'REJECTED' && st !== 'WITHDRAWN') {
        active += 1;
      }

      // Category breakdown
      const cat = p.category || 'Other';
      byCategory[cat] = (byCategory[cat] || 0) + 1;

      // District breakdown
      const dist = p.district || 'Unknown';
      byDistrict[dist] = (byDistrict[dist] || 0) + 1;
    });

    let topCategory = 'None';
    let maxCatCount = 0;
    Object.entries(byCategory).forEach(([cat, count]) => {
      if (count > maxCatCount) {
        maxCatCount = count;
        topCategory = cat;
      }
    });

    return {
      total,
      highPriority,
      active,
      resolved,
      topCategory,
      byCategory,
      byDistrict,
      byStatus,
      bySeverity
    };
  }
}

export const gisService = new GisService();
export default gisService;
