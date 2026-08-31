import { Router } from 'express';
import { GovernmentGrantFund } from './model.js';
import { MongooseIndustry } from '../industries/infrastructure/model.js';

const router = Router();

// GET /api/v1/government/funds
router.get('/', async (req, res, next) => {
  try {
    const [fundList, industryAgg] = await Promise.all([
      GovernmentGrantFund.find({ status: 'Active' }).sort({ allocationDate: -1 }).lean(),
      MongooseIndustry.aggregate([
        {
          $group: {
            _id: null,
            totalCsrCr: { $sum: '$financials.csrCommittedCr' }
          }
        }
      ])
    ]);

    const stateGrantsTotal = fundList.reduce((sum, f) => sum + (Number(f.amount) || 0), 0);
    const corporateCsrTotalCr = industryAgg[0]?.totalCsrCr || 0;
    const corporateCsrTotal = corporateCsrTotalCr * 10000000; // 1 Cr = 10,000,000 INR
    const totalJointCorpus = stateGrantsTotal + corporateCsrTotal;

    res.status(200).json({
      status: 'SUCCESS',
      data: {
        stateGrantsTotal,
        corporateCsrTotal,
        corporateCsrTotalCr,
        totalJointCorpus,
        fundEntries: fundList
      }
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/v1/government/funds - Add State Grant Allocation
router.post('/', async (req, res, next) => {
  try {
    const {
      amount,
      title,
      scheme,
      department,
      sanctionOrderNo,
      financialYear,
      allocatedBy,
      description
    } = req.body;

    const parsedAmount = Number(amount);
    if (!parsedAmount || parsedAmount <= 0) {
      return res.status(400).json({
        status: 'ERROR',
        message: 'A valid grant allocation amount greater than ₹0 is required.'
      });
    }

    const fundId = `GGF-${Date.now().toString().slice(-6)}`;
    const newFund = await GovernmentGrantFund.create({
      fundId,
      title: title || 'State Innovation Council R&D Grant Allocation',
      scheme: scheme || 'Jharkhand State Innovation Council R&D Allocation',
      department: department || 'Department of Higher & Technical Education',
      amount: parsedAmount,
      sanctionOrderNo: sanctionOrderNo || `JH-GOV-RD-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      financialYear: financialYear || '2026-2027',
      allocationDate: new Date(),
      allocatedBy: allocatedBy || 'Principal Secretary, Govt of Jharkhand',
      description: description || 'Budgetary allocation for university problem solving and lab prototyping grants.',
      status: 'Active'
    });

    // Recompute live totals
    const fundList = await GovernmentGrantFund.find({ status: 'Active' }).lean();
    const stateGrantsTotal = fundList.reduce((sum, f) => sum + (Number(f.amount) || 0), 0);

    res.status(201).json({
      status: 'SUCCESS',
      message: 'State Grant Fund successfully allocated and committed into State Innovation Pool.',
      data: {
        createdFund: newFund,
        stateGrantsTotal
      }
    });
  } catch (error) {
    next(error);
  }
});

// PUT /api/v1/government/funds/:id - Edit State Grant Allocation
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      amount,
      title,
      scheme,
      department,
      sanctionOrderNo,
      financialYear,
      allocatedBy,
      description
    } = req.body;

    const query = id.startsWith('GGF-') ? { fundId: id } : { _id: id };
    const existing = await GovernmentGrantFund.findOne(query);

    if (!existing) {
      return res.status(404).json({
        status: 'ERROR',
        message: 'State Grant Fund entry not found.'
      });
    }

    if (amount !== undefined) {
      const parsedAmount = Number(amount);
      if (!parsedAmount || parsedAmount <= 0) {
        return res.status(400).json({
          status: 'ERROR',
          message: 'Grant amount must be a positive number.'
        });
      }
      existing.amount = parsedAmount;
    }

    if (title) existing.title = title;
    if (scheme) existing.scheme = scheme;
    if (department) existing.department = department;
    if (sanctionOrderNo) existing.sanctionOrderNo = sanctionOrderNo;
    if (financialYear) existing.financialYear = financialYear;
    if (allocatedBy) existing.allocatedBy = allocatedBy;
    if (description !== undefined) existing.description = description;

    await existing.save();

    res.status(200).json({
      status: 'SUCCESS',
      message: 'State Grant Fund allocation updated successfully.',
      data: existing
    });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/v1/government/funds/:id - Delete State Grant Allocation
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const query = id.startsWith('GGF-') ? { fundId: id } : { _id: id };
    const deleted = await GovernmentGrantFund.findOneAndDelete(query);

    if (!deleted) {
      return res.status(404).json({
        status: 'ERROR',
        message: 'State Grant Fund entry not found.'
      });
    }

    res.status(200).json({
      status: 'SUCCESS',
      message: 'State Grant Fund allocation removed successfully.',
      data: deleted
    });
  } catch (error) {
    next(error);
  }
});

export default router;
