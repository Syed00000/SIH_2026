export class UniversityProjectService {
  constructor(repository) {
    this.repository = repository;
  }

  async getProjects(universityCode) {
    return await this.repository.getProjectsByUniversity(universityCode);
  }

  async createProject(universityCode, data) {
    return await this.repository.createProject(universityCode, data);
  }

  async updateProject(universityCode, id, data) {
    return await this.repository.updateProject(universityCode, id, data);
  }

  async deleteProject(universityCode, id) {
    return await this.repository.deleteProject(universityCode, id);
  }

  async assignFacultyToProject(universityCode, id, facultyInfo) {
    return await this.repository.assignFacultyToProject(universityCode, id, facultyInfo);
  }

  async submitPrototype(projectId, universityCode, prototypeData) {
    return await this.repository.submitPrototype(projectId, universityCode, prototypeData);
  }

  async forwardPrototypeToGovernment(projectId, universityCode, remarks) {
    return await this.repository.forwardPrototypeToGovernment(projectId, universityCode, remarks);
  }

  async updateGovernmentPrototypeStatus(projectId, status, trlLevel, remarks) {
    return await this.repository.updateGovernmentPrototypeStatus(projectId, status, trlLevel, remarks);
  }

  async uploadProjectPdf(projectId, universityCode, file, type = 'prototype') {
    return await this.repository.uploadProjectPdf(projectId, universityCode, file, type);
  }

  async deleteProjectPdf(projectId, universityCode, type = 'prototype') {
    return await this.repository.deleteProjectPdf(projectId, universityCode, type);
  }

  async deployProject(projectId, universityCode, payload) {
    return await this.repository.deployProject(projectId, universityCode, payload);
  }
}

export default UniversityProjectService;
