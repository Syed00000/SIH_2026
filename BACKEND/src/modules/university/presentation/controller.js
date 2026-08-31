import { universityService } from '../application/service.js';

export class UniversityController {
  async getDashboard(req, res, next) {
    try {
      const code = req.query.universityCode || req.user?.profile?.aisheCode || 'RUNI-JH';
      const data = await universityService.getDashboard(code);
      res.status(200).json({ status: 'SUCCESS', data });
    } catch (error) { next(error); }
  }

  async getChallenges(req, res, next) {
    try {
      const code = req.query.universityCode || req.user?.profile?.aisheCode || 'RUNI-JH';
      const data = await universityService.getChallenges(code, req.query);
      res.status(200).json({ status: 'SUCCESS', data });
    } catch (error) { next(error); }
  }

  async updateChallengeStatus(req, res, next) {
    try {
      const { id } = req.params;
      const code = req.query.universityCode || req.user?.profile?.aisheCode || 'RUNI-JH';
      const { status, actionLabel, remarks, query, declineReason, clarificationQuery } = req.body;
      const updated = await universityService.updateChallengeStatus(id, code, status, actionLabel, {
        clarificationQuery: clarificationQuery || query || remarks || '',
        query: query || clarificationQuery || remarks || '',
        declineReason: declineReason || '',
        declineRemarks: remarks || '',
        remarks: remarks || query || clarificationQuery || ''
      });
      res.status(200).json({ status: 'SUCCESS', message: 'Challenge status updated', data: updated });
    } catch (error) { next(error); }
  }

  async assignFaculty(req, res, next) {
    try {
      const { id } = req.params;
      const code = req.query.universityCode || req.user?.profile?.aisheCode || 'RUNI-JH';
      const { facultyInfo } = req.body;
      const updated = await universityService.assignFaculty(id, code, facultyInfo);
      res.status(200).json({ status: 'SUCCESS', message: 'Faculty assigned successfully', data: updated });
    } catch (error) { next(error); }
  }

  async getFaculty(req, res, next) {
    try {
      const code = req.query.universityCode || req.user?.profile?.aisheCode || 'RUNI-JH';
      const data = await universityService.getFaculty(code);
      res.status(200).json({ status: 'SUCCESS', data });
    } catch (error) { next(error); }
  }

  async createFaculty(req, res, next) {
    try {
      const code = req.query.universityCode || req.user?.profile?.aisheCode || 'RUNI-JH';
      const data = await universityService.createFaculty(code, req.body);
      res.status(201).json({ status: 'SUCCESS', message: 'Faculty registered successfully', data });
    } catch (error) { next(error); }
  }

  async updateFaculty(req, res, next) {
    try {
      const { id } = req.params;
      const code = req.query.universityCode || req.user?.profile?.aisheCode || 'RUNI-JH';
      const data = await universityService.updateFaculty(code, id, req.body);
      res.status(200).json({ status: 'SUCCESS', message: 'Faculty updated successfully', data });
    } catch (error) { next(error); }
  }

  async deleteFaculty(req, res, next) {
    try {
      const { id } = req.params;
      const code = req.query.universityCode || req.user?.profile?.aisheCode || 'RUNI-JH';
      const data = await universityService.deleteFaculty(code, id);
      res.status(200).json({ status: 'SUCCESS', message: 'Faculty removed successfully', data });
    } catch (error) { next(error); }
  }

  async getTeams(req, res, next) {
    try {
      const code = req.query.universityCode || req.user?.profile?.aisheCode || 'RUNI-JH';
      const data = await universityService.getTeams(code);
      res.status(200).json({ status: 'SUCCESS', data });
    } catch (error) { next(error); }
  }

  async getProjects(req, res, next) {
    try {
      const code = req.query.universityCode || req.user?.profile?.aisheCode || 'RUNI-JH';
      const data = await universityService.getProjects(code);
      res.status(200).json({ status: 'SUCCESS', data });
    } catch (error) { next(error); }
  }

  async createProject(req, res, next) {
    try {
      const code = req.query.universityCode || req.user?.profile?.aisheCode || 'RUNI-JH';
      const data = await universityService.createProject(code, req.body);
      res.status(201).json({ status: 'SUCCESS', message: 'Project registered successfully', data });
    } catch (error) { next(error); }
  }

  async updateProject(req, res, next) {
    try {
      const { id } = req.params;
      const code = req.query.universityCode || req.user?.profile?.aisheCode || 'RUNI-JH';
      const data = await universityService.updateProject(code, id, req.body);
      res.status(200).json({ status: 'SUCCESS', message: 'Project updated successfully', data });
    } catch (error) { next(error); }
  }

  async deleteProject(req, res, next) {
    try {
      const { id } = req.params;
      const code = req.query.universityCode || req.user?.profile?.aisheCode || 'RUNI-JH';
      const data = await universityService.deleteProject(code, id);
      res.status(200).json({ status: 'SUCCESS', message: 'Project removed successfully', data });
    } catch (error) { next(error); }
  }

  async assignFacultyToProject(req, res, next) {
    try {
      const { id } = req.params;
      const code = req.query.universityCode || req.user?.profile?.aisheCode || req.user?.profile?.code || 'RU001';
      const facultyInfo = req.body.facultyInfo || req.body;
      const data = await universityService.assignFacultyToProject(code, id, facultyInfo);
      res.status(200).json({ status: 'SUCCESS', message: 'Faculty mentor assigned to project successfully', data });
    } catch (error) { next(error); }
  }

  async getPartners(req, res, next) {
    try {
      const code = req.query.universityCode || req.user?.profile?.aisheCode || 'RUNI-JH';
      const data = await universityService.getPartners(code);
      res.status(200).json({ status: 'SUCCESS', data });
    } catch (error) { next(error); }
  }

  async getActivities(req, res, next) {
    try {
      const code = req.query.universityCode || req.user?.profile?.aisheCode || 'RU001';
      const data = await universityService.getActivities(code);
      res.status(200).json({ status: 'SUCCESS', data });
    } catch (error) { next(error); }
  }

  async clearActivities(req, res, next) {
    try {
      const code = req.query.universityCode || req.body.universityCode || req.user?.profile?.aisheCode || 'RU001';
      const data = await universityService.clearActivities(code);
      res.status(200).json({ status: 'SUCCESS', message: 'All activities cleared successfully', data });
    } catch (error) { next(error); }
  }

  async getApprovals(req, res, next) {
    try {
      const code = req.query.universityCode || req.user?.profile?.aisheCode || 'RUNI-JH';
      const data = await universityService.getApprovals(code);
      res.status(200).json({ status: 'SUCCESS', data });
    } catch (error) { next(error); }
  }

  async submitPrototype(req, res, next) {
    try {
      const { id } = req.params;
      const code = req.query.universityCode || req.user?.profile?.aisheCode || 'RUNI-JH';
      const data = await universityService.submitPrototype(id, code, req.body);
      res.status(200).json({ status: 'SUCCESS', message: 'Prototype submitted successfully', data });
    } catch (error) { next(error); }
  }

  async updateApproval(req, res, next) {
    try {
      const { id } = req.params;
      const code = req.query.universityCode || req.user?.profile?.aisheCode || 'RUNI-JH';
      const { status } = req.body;
      const data = await universityService.updateApproval(id, code, status);
      res.status(200).json({ status: 'SUCCESS', message: 'Approval status updated', data });
    } catch (error) { next(error); }
  }

  async deleteApproval(req, res, next) {
    try {
      const { id } = req.params;
      const code = req.query.universityCode || req.user?.profile?.aisheCode || 'RUNI-JH';
      const data = await universityService.deleteApproval(id, code);
      res.status(200).json({ status: 'SUCCESS', message: 'Approval deleted', data });
    } catch (error) { next(error); }
  }

  async createIndustryRequest(req, res, next) {
    try {
      const code = req.query.universityCode || req.user?.profile?.aisheCode || 'RU001';
      const data = await universityService.createIndustryRequest(code, req.body);
      res.status(201).json({ status: 'SUCCESS', message: 'Industry collaboration request dispatched', data });
    } catch (error) { next(error); }
  }

  async getIndustryRequests(req, res, next) {
    try {
      const code = req.query.universityCode || req.user?.profile?.aisheCode || 'RU001';
      const data = await universityService.getIndustryRequests(code);
      res.status(200).json({ status: 'SUCCESS', data });
    } catch (error) { next(error); }
  }

  async deleteIndustryRequest(req, res, next) {
    try {
      const { id } = req.params;
      const code = req.query.universityCode || req.user?.profile?.aisheCode || 'RU001';
      const data = await universityService.deleteIndustryRequest(id, code);
      res.status(200).json({ status: 'SUCCESS', message: 'Industry request deleted', data });
    } catch (error) { next(error); }
  }

  async forwardPrototypeToGovernment(req, res, next) {
    try {
      const { id } = req.params;
      const code = req.query.universityCode || req.user?.profile?.aisheCode || 'RU001';
      const { remarks } = req.body;
      const data = await universityService.forwardPrototypeToGovernment(id, code, remarks);
      res.status(200).json({ status: 'SUCCESS', message: 'Prototype forwarded to Government successfully', data });
    } catch (error) { next(error); }
  }

  async updateGovernmentPrototypeStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { status, trlLevel, remarks } = req.body;
      const data = await universityService.updateGovernmentPrototypeStatus(id, status, trlLevel, remarks);
      res.status(200).json({ status: 'SUCCESS', message: 'Government prototype evaluation updated', data });
    } catch (error) { next(error); }
  }

  async getReports(req, res, next) {
    try {
      const code = req.query.universityCode || req.user?.profile?.aisheCode || 'RUNI-JH';
      const data = await universityService.getReports(code);
      res.status(200).json({ status: 'SUCCESS', data });
    } catch (error) { next(error); }
  }

  async getProfile(req, res, next) {
    try {
      const code = req.query.universityCode || req.user?.profile?.aisheCode || 'RU001';
      const data = await universityService.getProfile(code);
      res.status(200).json({ status: 'SUCCESS', data });
    } catch (error) { next(error); }
  }

  async updateProfile(req, res, next) {
    try {
      const code = req.query.universityCode || req.user?.profile?.aisheCode || 'RU001';
      const data = await universityService.updateProfile(code, req.body, req.user);
      res.status(200).json({ status: 'SUCCESS', message: 'University profile updated successfully', data });
    } catch (error) { next(error); }
  }
}

export const universityController = new UniversityController();
export default universityController;
