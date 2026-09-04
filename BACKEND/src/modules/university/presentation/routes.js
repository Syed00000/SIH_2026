import { Router } from 'express';
import { universityController } from './controller.js';

const router = Router();

router.get('/dashboard', (req, res, next) => universityController.getDashboard(req, res, next));
router.get('/challenges', (req, res, next) => universityController.getChallenges(req, res, next));
router.patch('/challenges/:id/status', (req, res, next) => universityController.updateChallengeStatus(req, res, next));
router.post('/challenges/:id/assign-faculty', (req, res, next) => universityController.assignFaculty(req, res, next));
router.delete('/challenges/:id', (req, res, next) => universityController.deleteChallenge(req, res, next));

router.get('/faculty', (req, res, next) => universityController.getFaculty(req, res, next));
router.post('/faculty', (req, res, next) => universityController.createFaculty(req, res, next));
router.patch('/faculty/:id', (req, res, next) => universityController.updateFaculty(req, res, next));
router.put('/faculty/:id', (req, res, next) => universityController.updateFaculty(req, res, next));
router.delete('/faculty/:id', (req, res, next) => universityController.deleteFaculty(req, res, next));

router.get('/teams', (req, res, next) => universityController.getTeams(req, res, next));
router.post('/teams', (req, res, next) => universityController.createTeam(req, res, next));
router.patch('/teams/:id', (req, res, next) => universityController.updateTeam(req, res, next));
router.put('/teams/:id', (req, res, next) => universityController.updateTeam(req, res, next));
router.delete('/teams/:id', (req, res, next) => universityController.deleteTeam(req, res, next));
router.get('/projects', (req, res, next) => universityController.getProjects(req, res, next));
router.post('/projects', (req, res, next) => universityController.createProject(req, res, next));
router.patch('/projects/:id', (req, res, next) => universityController.updateProject(req, res, next));
router.put('/projects/:id', (req, res, next) => universityController.updateProject(req, res, next));
router.delete('/projects/:id', (req, res, next) => universityController.deleteProject(req, res, next));
router.post('/projects/:id/assign-faculty', (req, res, next) => universityController.assignFacultyToProject(req, res, next));
router.patch('/projects/:id/assign-faculty', (req, res, next) => universityController.assignFacultyToProject(req, res, next));
router.post('/projects/:id/prototype', (req, res, next) => universityController.submitPrototype(req, res, next));
router.post('/projects/:id/forward-to-government', (req, res, next) => universityController.forwardPrototypeToGovernment(req, res, next));
router.patch('/projects/:id/government-prototype-status', (req, res, next) => universityController.updateGovernmentPrototypeStatus(req, res, next));
router.post('/projects/:id/request-tranche', (req, res, next) => universityController.requestTranche(req, res, next));

router.get('/activities', (req, res, next) => universityController.getActivities(req, res, next));
router.delete('/activities', (req, res, next) => universityController.clearActivities(req, res, next));
router.post('/activities/clear', (req, res, next) => universityController.clearActivities(req, res, next));

router.get('/partners', (req, res, next) => universityController.getPartners(req, res, next));
router.get('/approvals', (req, res, next) => universityController.getApprovals(req, res, next));
router.patch('/approvals/:id', (req, res, next) => universityController.updateApproval(req, res, next));
router.delete('/approvals/:id', (req, res, next) => universityController.deleteApproval(req, res, next));
router.post('/industry-request', (req, res, next) => universityController.createIndustryRequest(req, res, next));
router.get('/industry-requests', (req, res, next) => universityController.getIndustryRequests(req, res, next));
router.patch('/industry-requests/:id/status', (req, res, next) => universityController.updateIndustryRequestStatus(req, res, next));
router.delete('/industry-requests/:id', (req, res, next) => universityController.deleteIndustryRequest(req, res, next));
router.get('/reports', (req, res, next) => universityController.getReports(req, res, next));
router.get('/profile', (req, res, next) => universityController.getProfile(req, res, next));
router.put('/profile', (req, res, next) => universityController.updateProfile(req, res, next));
router.patch('/profile', (req, res, next) => universityController.updateProfile(req, res, next));
router.get('/notifications', (req, res, next) => universityController.getNotifications(req, res, next));
router.delete('/notifications', (req, res, next) => universityController.clearNotifications(req, res, next));

export default router;
