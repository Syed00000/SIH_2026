import { industryFundService } from './service.js';

export const getProfile = async (req, res, next) => {
  try {
    const userId = req.user?.id || req.user?.sub;
    const email = req.user?.email || req.query.email;
    const industryName = req.query.industryName || req.user?.organizationName;
    const data = await industryFundService.getIndustryProfile({ userId, email, industryName });
    res.status(200).json({ status: 'SUCCESS', data });
  } catch (error) {
    next(error);
  }
};

export const getFunds = async (req, res, next) => {
  try {
    const userId = req.user?.id || req.user?.sub;
    const email = req.user?.email || req.query.email;
    const industryName = req.query.industryName || req.user?.organizationName || 'Ariba Research Labs';
    const data = await industryFundService.getFundsOverview({ industryName, userId, email });
    res.status(200).json({ status: 'SUCCESS', data });
  } catch (error) {
    next(error);
  }
};

export const createFund = async (req, res, next) => {
  try {
    const industryName = req.body.industryName || req.user?.organizationName || 'Ariba Research Labs';
    const result = await industryFundService.createFund({ ...req.body, industryName });
    res.status(201).json({
      status: 'SUCCESS',
      message: 'Industry fund pool allocated successfully.',
      data: result
    });
  } catch (error) {
    if (error.message.includes('valid grant allocation amount')) {
      return res.status(400).json({ status: 'ERROR', message: error.message });
    }
    next(error);
  }
};

export const updateFund = async (req, res, next) => {
  try {
    const result = await industryFundService.updateFund(req.params.id, req.body);
    res.status(200).json({
      status: 'SUCCESS',
      message: 'Industry fund allocation updated successfully.',
      data: result
    });
  } catch (error) {
    if (error.message.includes('cannot be less')) {
      return res.status(400).json({ status: 'ERROR', message: error.message });
    }
    next(error);
  }
};

export const deleteFund = async (req, res, next) => {
  try {
    const result = await industryFundService.deleteFund(req.params.id);
    res.status(200).json({
      status: 'SUCCESS',
      message: 'Industry fund allocation removed successfully.',
      data: result
    });
  } catch (error) {
    if (error.message.includes('Cannot delete fund')) {
      return res.status(400).json({ status: 'ERROR', message: error.message });
    }
    next(error);
  }
};

export const disburseFund = async (req, res, next) => {
  try {
    const industryName = req.body.industryName || req.user?.organizationName || 'Ariba Research Labs';
    const result = await industryFundService.disburseFund({ ...req.body, industryName });
    res.status(200).json({
      status: 'SUCCESS',
      message: result.message,
      data: result
    });
  } catch (error) {
    if (error.message.includes('Insufficient balance') || error.message.includes('greater than ₹0') || error.message.includes('not found')) {
      return res.status(400).json({ status: 'ERROR', message: error.message });
    }
    next(error);
  }
};

export const approveAndFundRequest = async (req, res, next) => {
  try {
    const industryName = req.body.industryName || req.user?.organizationName || 'Ariba Research Labs';
    const result = await industryFundService.approveAndFundRequest({
      ...req.body,
      requestId: req.params.requestId || req.body.requestId,
      industryName
    });
    res.status(200).json({
      status: 'SUCCESS',
      message: result.message,
      data: result
    });
  } catch (error) {
    if (error.message.includes('Insufficient balance') || error.message.includes('greater than ₹0') || error.message.includes('not found')) {
      return res.status(400).json({ status: 'ERROR', message: error.message });
    }
    next(error);
  }
};

export default {
  getFunds,
  createFund,
  updateFund,
  deleteFund,
  disburseFund,
  approveAndFundRequest
};
