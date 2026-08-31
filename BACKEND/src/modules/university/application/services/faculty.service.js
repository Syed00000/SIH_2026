export class UniversityFacultyService {
  constructor(repository) {
    this.repository = repository;
  }

  async getFaculty(universityCode) {
    return await this.repository.getFacultyByUniversity(universityCode);
  }

  async createFaculty(universityCode, data) {
    return await this.repository.createFaculty(universityCode, data);
  }

  async updateFaculty(universityCode, id, data) {
    return await this.repository.updateFaculty(universityCode, id, data);
  }

  async deleteFaculty(universityCode, id) {
    return await this.repository.deleteFaculty(universityCode, id);
  }

  async getTeams(universityCode) {
    return await this.repository.getTeamsByUniversity(universityCode);
  }
}

export default UniversityFacultyService;
