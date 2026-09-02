export class UniversityPartnerApprovalService {
  constructor(repository) {
    this.repository = repository;
  }

  async getActivities(universityCode) {
    return await this.repository.getActivitiesByUniversity(universityCode);
  }

  async clearActivities(universityCode) {
    return await this.repository.clearActivities(universityCode);
  }

  async getPartners(universityCode) {
    return await this.repository.getPartnersByUniversity(universityCode);
  }

  async getApprovals(universityCode) {
    return await this.repository.getApprovalsByUniversity(universityCode);
  }

  async updateApproval(approvalId, universityCode, status, remarks = '') {
    return await this.repository.updateApprovalStatus(approvalId, universityCode, status, remarks);
  }

  async deleteApproval(approvalId, universityCode) {
    return await this.repository.deleteApproval(approvalId, universityCode);
  }

  async createIndustryRequest(universityCode, payload) {
    return await this.repository.createIndustryRequest(universityCode, payload);
  }

  async getIndustryRequests(universityCode) {
    return await this.repository.getIndustryRequests(universityCode);
  }

  async deleteIndustryRequest(requestId, universityCode) {
    return await this.repository.deleteIndustryRequest(requestId, universityCode);
  }
}

export default UniversityPartnerApprovalService;
