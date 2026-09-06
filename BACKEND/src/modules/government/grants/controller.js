import { grantFundService } from './service.js';

export const getFunds = async (req, res, next) => {
  try {
    const data = await grantFundService.getFundsOverview();
    res.status(200).json({ status: 'SUCCESS', data });
  } catch (error) {
    next(error);
  }
};

export const createFund = async (req, res, next) => {
  try {
    const data = await grantFundService.createGrantFund(req.body);
    res.status(201).json({
      status: 'SUCCESS',
      message: 'State Grant Fund successfully allocated and committed into State Innovation Pool.',
      data
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
    const updated = await grantFundService.updateGrantFund(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ status: 'ERROR', message: 'State Grant Fund entry not found.' });
    }
    res.status(200).json({
      status: 'SUCCESS',
      message: 'State Grant Fund allocation updated successfully.',
      data: updated
    });
  } catch (error) {
    if (error.message.includes('Grant amount must be a positive number')) {
      return res.status(400).json({ status: 'ERROR', message: error.message });
    }
    next(error);
  }
};

export const deleteFund = async (req, res, next) => {
  try {
    const deleted = await grantFundService.deleteGrantFund(req.params.id);
    if (!deleted) {
      return res.status(404).json({ status: 'ERROR', message: 'State Grant Fund entry not found.' });
    }
    res.status(200).json({
      status: 'SUCCESS',
      message: 'State Grant Fund allocation removed successfully.',
      data: deleted
    });
  } catch (error) {
    next(error);
  }
};

export const getLedger = async (req, res, next) => {
  try {
    const { governmentLedgerService } = await import('./ledger.service.js');
    const data = await governmentLedgerService.getLedger();
    res.status(200).json({ status: 'SUCCESS', data });
  } catch (error) {
    next(error);
  }
};

export const createPayment = async (req, res, next) => {
  try {
    const { governmentLedgerService } = await import('./ledger.service.js');
    const data = await governmentLedgerService.createPayment(req.body);
    res.status(201).json({ status: 'SUCCESS', message: 'Grant disbursement recorded successfully', data });
  } catch (error) {
    if (error.message.includes('Low Budget') || error.message.includes('Insufficient State Grant Fund')) {
      return res.status(400).json({ status: 'ERROR', message: error.message });
    }
    next(error);
  }
};

export const authorizePayment = async (req, res, next) => {
  try {
    const { governmentLedgerService } = await import('./ledger.service.js');
    const data = await governmentLedgerService.authorizePayment(req.params.id);
    res.status(200).json({ status: 'SUCCESS', message: 'Payment authorized', data });
  } catch (error) {
    next(error);
  }
};

export const clearLedger = async (req, res, next) => {
  try {
    const { governmentLedgerService } = await import('./ledger.service.js');
    const data = await governmentLedgerService.clearLedger();
    res.status(200).json({ status: 'SUCCESS', ...data });
  } catch (error) {
    next(error);
  }
};

export const getUtilization = async (req, res, next) => {
  try {
    const { governmentLedgerService } = await import('./ledger.service.js');
    const data = await governmentLedgerService.getUtilizationAndCompliance();
    res.status(200).json({ status: 'SUCCESS', data });
  } catch (error) {
    next(error);
  }
};

export const getGateways = async (req, res, next) => {
  try {
    const { governmentGatewayService } = await import('./gateway.service.js');
    const data = await governmentGatewayService.getGateways();
    res.status(200).json({ status: 'SUCCESS', data });
  } catch (error) {
    next(error);
  }
};

export const pingGateway = async (req, res, next) => {
  try {
    const { governmentGatewayService } = await import('./gateway.service.js');
    const data = await governmentGatewayService.pingGateway(req.params.id);
    res.status(200).json({ status: 'SUCCESS', data });
  } catch (error) {
    next(error);
  }
};

export default {
  getFunds,
  createFund,
  updateFund,
  deleteFund,
  getLedger,
  createPayment,
  authorizePayment,
  clearLedger,
  getUtilization,
  getGateways,
  pingGateway
};
