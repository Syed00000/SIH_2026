import React, { useState } from 'react';
import {
  X,
  IndianRupee,
  CheckCircle2,
  Building2,
  CreditCard,
  FileCheck,
  Send,
  AlertCircle,
  Clock
} from 'lucide-react';
import { projectCsrSyncService } from '../../services/projectCsrSyncService.js';

export const parseGrantLakhs = (grantStr) => {
  if (typeof grantStr === 'number') return grantStr;
  if (!grantStr) return 0;
  const cleanStr = String(grantStr).replace(/,/g, '');
  const match = cleanStr.match(/[\d.]+/);
  if (!match) return 0;
  const val = parseFloat(match[0]);
  const lowerStr = cleanStr.toLowerCase();
  
  // If it mentions Lakhs/L, treat as Lakhs
  if (lowerStr.includes('lakh') || lowerStr.includes(' l') || lowerStr.endsWith('l')) {
    return val;
  }
  
  // If it mentions Cr/Crore, convert Cr to Lakhs (1 Cr = 100 Lakhs)
  if (lowerStr.includes('cr') || lowerStr.includes('crore')) {
    return val * 100;
  }
  
  // Otherwise, if it's a raw number >= 1000, assume it's raw Rupees and divide by 100,000 to get Lakhs
  if (val >= 1000) {
    return val / 100000;
  }
  
  return val;
};


export const formatGrantLakhs = (num) => {
  const n = parseFloat(num);
  if (isNaN(n)) return '₹ 0.00 Lakhs';
  return `₹ ${n.toFixed(2)} Lakhs`;
};

export const getGrantFinancials = (sanctioned, disbursed) => {
  const sNum = parseGrantLakhs(sanctioned);
  const dNum = parseGrantLakhs(disbursed);
  const pNum = Math.max(0, sNum - dNum);
  const percentage = sNum > 0 ? Math.min(100, Math.round((dNum / sNum) * 100)) : 0;
  const isFullyPaid = sNum > 0 && dNum >= sNum;

  const sCr = (sNum / 100).toFixed(3).replace(/\.?0+$/, '');
  const dCr = (dNum / 100).toFixed(3).replace(/\.?0+$/, '');
  const pCr = (pNum / 100).toFixed(3).replace(/\.?0+$/, '');

  return {
    sanctionedLakhs: sNum,
    disbursedLakhs: dNum,
    pendingLakhs: pNum,
    sanctionedCr: sNum / 100,
    disbursedCr: dNum / 100,
    pendingCr: pNum / 100,
    sanctionedCrStr: `₹ ${sCr} Cr`,
    disbursedCrStr: `₹ ${dCr} Cr`,
    pendingCrStr: `₹ ${pCr} Cr`,
    percentage,
    isFullyPaid,
    sanctionedStr: formatGrantLakhs(sNum),
    disbursedStr: formatGrantLakhs(dNum),
    pendingStr: formatGrantLakhs(pNum),
    statusText: isFullyPaid
      ? 'Fully Paid ✓'
      : dNum > 0
      ? `Partially Paid (${percentage}%)`
      : 'Unpaid (0%)'
  };
};

export const GrantPaymentModal = ({ project, isOpen, onClose, onConfirmPayment }) => {
  if (!isOpen || !project) return null;

  const currentFinancials = getGrantFinancials(project.sanctionedGrant, project.disbursedAmount);
  const defaultPayAmount = currentFinancials.pendingLakhs > 0
    ? (currentFinancials.pendingLakhs >= 5 ? '5.00' : currentFinancials.pendingLakhs.toFixed(2))
    : '0.00';

  const [paymentAmount, setPaymentAmount] = useState(defaultPayAmount);
  const [trancheName, setTrancheName] = useState(
    currentFinancials.disbursedLakhs === 0
      ? 'Tranche 1: Equipment & Prototype Start'
      : 'Tranche 2: Field Trial & Equipment'
  );
  const [paymentMode, setPaymentMode] = useState('PFMS Direct Treasury Transfer');
  const [voucherRef, setVoucherRef] = useState(`JH-TR-${Math.floor(1000 + Math.random() * 9000)}`);
  const [remarks, setRemarks] = useState('Milestone deliverables verified. Releasing grant payment from State Innovation Fund.');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Live calculation of preview after this payment
  const payingNum = parseFloat(paymentAmount) || 0;
  const projectedDisbursed = currentFinancials.disbursedLakhs + payingNum;
  const projectedPending = Math.max(0, currentFinancials.sanctionedLakhs - projectedDisbursed);
  const projectedPercentage = currentFinancials.sanctionedLakhs > 0
    ? Math.min(100, Math.round((projectedDisbursed / currentFinancials.sanctionedLakhs) * 100))
    : 0;
  const isProjectedFullyPaid = currentFinancials.sanctionedLakhs > 0 && projectedDisbursed >= currentFinancials.sanctionedLakhs;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (payingNum <= 0) {
      alert('Please enter a valid payment amount greater than 0.');
      return;
    }

    setIsSubmitting(true);

    const newDisbursedStr = formatGrantLakhs(projectedDisbursed);

    const paymentRecord = {
      id: voucherRef,
      trancheName,
      amount: formatGrantLakhs(payingNum),
      date: new Date().toISOString().split('T')[0],
      paymentMode,
      remarks,
      status: 'Paid'
    };

    setTimeout(() => {
      // Sync into projectCsrSyncService for real-time reflection in CSR Grants
      try {
        projectCsrSyncService.disburseGrantPayment({
          projectId: project.id,
          amountLakhs: payingNum,
          trancheName,
          paymentMode,
          voucherRef,
          remarks
        });
      } catch (err) {
        console.error('Failed to sync payment into CSR ledger:', err);
      }

      onConfirmPayment(project.id, {
        newDisbursedStr,
        newPercent: projectedPercentage,
        paymentRecord
      });
      setIsSubmitting(false);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn select-none">
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xl w-full max-w-xl flex flex-col overflow-hidden animate-scaleUp">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold">
              <IndianRupee className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Release Grant Payment
              </h2>
              <p className="text-[11px] text-slate-500 font-medium">
                Disburse approved funding for {project.id} ({project.hei})
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {/* Current Financial Status Breakdown */}
          <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">1. Sanctioned Total</span>
              <span className="text-sm font-black text-slate-900 block mt-0.5">{currentFinancials.sanctionedStr}</span>
              <span className="text-[10px] text-slate-500">Approved Grant</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">2. Already Paid</span>
              <span className="text-sm font-black text-emerald-700 block mt-0.5">{currentFinancials.disbursedStr}</span>
              <span className="text-[10px] text-slate-500">Paid ({currentFinancials.percentage}%)</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">3. Currently Pending</span>
              <span className="text-sm font-black text-amber-700 block mt-0.5">{currentFinancials.pendingStr}</span>
              <span className="text-[10px] text-amber-800 font-semibold">To be Disbursed</span>
            </div>
          </div>

          {/* Tranche / Milestone Selection */}
          <div>
            <label className="text-[11px] font-bold text-slate-700 block mb-1">
              Select Payment Tranche / Purpose *
            </label>
            <select
              value={trancheName}
              onChange={(e) => setTrancheName(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-800 focus:bg-white focus:border-slate-800 focus:outline-hidden cursor-pointer"
            >
              <option value="Tranche 1: Equipment & Prototype Start">Tranche 1: Equipment & Prototype Start</option>
              <option value="Tranche 2: Field Trial & Equipment">Tranche 2: Field Trial & Testing</option>
              <option value="Tranche 3: Final District Handover & Scaling">Tranche 3: Final District Handover & Scaling</option>
              <option value="Custom Disbursal Release">Custom Disbursal Release</option>
            </select>
          </div>

          {/* Amount to Release & Voucher Ref */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-bold text-slate-700">
                  Amount to Release (in Lakhs ₹) *
                </label>
                {currentFinancials.pendingLakhs > 0 && (
                  <button
                    type="button"
                    onClick={() => setPaymentAmount(currentFinancials.pendingLakhs.toFixed(2))}
                    className="text-[10px] font-bold text-emerald-700 hover:underline cursor-pointer"
                  >
                    Pay Full Pending
                  </button>
                )}
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-400">₹</span>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  max={currentFinancials.pendingLakhs > 0 ? currentFinancials.pendingLakhs : 100}
                  required
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  className="w-full pl-7 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-900 focus:bg-white focus:border-slate-800 focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">
                Treasury Voucher Ref # *
              </label>
              <input
                type="text"
                required
                value={voucherRef}
                onChange={(e) => setVoucherRef(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-900 focus:bg-white focus:border-slate-800 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Live Dynamic Calculation Box */}
          <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl space-y-1.5 text-xs text-blue-950">
            <div className="flex items-center justify-between font-bold">
              <span>After Releasing ₹ {payingNum.toFixed(2)} Lakhs:</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                isProjectedFullyPaid ? 'bg-emerald-600 text-white' : 'bg-amber-100 text-amber-900'
              }`}>
                {isProjectedFullyPaid ? 'Will be Fully Paid (100%) ✓' : `Will be Partially Paid (${projectedPercentage}%)`}
              </span>
            </div>
            <div className="flex items-center justify-between text-[11px] pt-1 border-t border-blue-200/60">
              <span>New Total Disbursed: <strong>₹ {projectedDisbursed.toFixed(2)} Lakhs</strong></span>
              <span>Remaining Pending: <strong className={projectedPending > 0 ? 'text-amber-800' : 'text-emerald-700'}>
                ₹ {projectedPending.toFixed(2)} Lakhs
              </strong></span>
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <label className="text-[11px] font-bold text-slate-700 block mb-1">
              Disbursal Method *
            </label>
            <select
              value={paymentMode}
              onChange={(e) => setPaymentMode(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-800 focus:bg-white focus:border-slate-800 focus:outline-hidden cursor-pointer"
            >
              <option value="PFMS Direct Treasury Transfer">PFMS Direct Treasury Transfer (State Bank of India)</option>
              <option value="State Innovation Fund DBT">State Innovation Fund DBT</option>
              <option value="Higher Education Grant Account">Higher Education Grant Account Transfer</option>
            </select>
          </div>

          {/* Modal Actions */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || payingNum <= 0}
              className="px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer flex items-center space-x-1.5 shadow-2xs disabled:opacity-50"
            >
              <IndianRupee className="w-3.5 h-3.5 text-emerald-400" />
              <span>Confirm & Release ₹ {payingNum.toFixed(2)} Lakhs</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GrantPaymentModal;
