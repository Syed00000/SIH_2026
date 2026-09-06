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
  Clock,
  Landmark,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { projectCsrSyncService } from '../../services/projectCsrSyncService.js';
import apiClient from '../../../../infrastructure/api/client.js';
import { useGovernmentTreasury } from '../../hooks/useGovernmentTreasury.js';
import { LowFundAlertBanner } from '../common/LowFundAlertBanner.jsx';
import { AddStateGrantModal } from '../csr/AddStateGrantModal.jsx';

export const parseGrantRupees = (grantStr) => {
  if (typeof grantStr === 'number') return grantStr;
  if (!grantStr) return 0;
  const cleanStr = String(grantStr).replace(/,/g, '');
  const match = cleanStr.match(/[\d.]+/);
  if (!match) return 0;
  const val = parseFloat(match[0]);
  const lowerStr = cleanStr.toLowerCase();

  // If it mentions Cr/Crore
  if (lowerStr.includes('cr') || lowerStr.includes('crore')) {
    return val * 10000000;
  }
  // If it mentions Lakh/L
  if (lowerStr.includes('lakh') || lowerStr.includes(' l') || lowerStr.endsWith('l')) {
    return val * 100000;
  }
  return val;
};

export const formatRupeesINR = (num) => {
  const n = parseFloat(num) || 0;
  return `₹ ${n.toLocaleString('en-IN')}`;
};

export const formatLakhsCr = (num) => {
  const n = parseFloat(num) || 0;
  if (n >= 10000000) return `₹ ${(n / 10000000).toFixed(2)} Cr`;
  if (n >= 100000) return `₹ ${(n / 100000).toFixed(2)} Lakhs`;
  if (n > 0) return `₹ ${(n / 1000).toFixed(1)} K`;
  return '₹ 0';
};

export const formatGrantLakhs = formatLakhsCr;
export const parseGrantLakhs = parseGrantRupees;

export const getGrantFinancials = (sanctioned, disbursed) => {
  const sNum = parseGrantRupees(sanctioned);
  const dNum = parseGrantRupees(disbursed);
  const pNum = Math.max(0, sNum - dNum);
  const percentage = sNum > 0 ? Math.min(100, Math.round((dNum / sNum) * 100)) : 0;
  const isFullyPaid = sNum > 0 && dNum >= sNum;

  const sLakhs = sNum / 100000;
  const dLakhs = dNum / 100000;
  const pLakhs = pNum / 100000;

  return {
    sanctionedRupees: sNum,
    disbursedRupees: dNum,
    pendingRupees: pNum,
    sanctionedLakhs: sLakhs,
    disbursedLakhs: dLakhs,
    pendingLakhs: pLakhs,
    sanctionedCr: sNum / 10000000,
    disbursedCr: dNum / 10000000,
    pendingCr: pNum / 10000000,
    percentage,
    isFullyPaid,
    sanctionedStr: formatRupeesINR(sNum),
    disbursedStr: formatRupeesINR(dNum),
    pendingStr: formatRupeesINR(pNum),
    sanctionedSub: formatLakhsCr(sNum),
    disbursedSub: formatLakhsCr(dNum),
    pendingSub: formatLakhsCr(pNum),
    statusText: isFullyPaid
      ? 'Fully Paid ✓'
      : dNum > 0
      ? `Partially Paid (${percentage}%)`
      : 'Unpaid (0%)'
  };
};

export const GrantPaymentModal = ({ project, isOpen, onClose, onConfirmPayment }) => {
  if (!isOpen || !project) return null;

  const currentFinancials = getGrantFinancials(project.sanctionedGrant || project.budget, project.disbursedAmount);

  // Default tranche amount is 50% of pending or full if smaller
  const defaultPayAmount = currentFinancials.pendingRupees > 0
    ? (currentFinancials.disbursedRupees === 0
        ? Math.round(currentFinancials.pendingRupees * 0.5)
        : currentFinancials.pendingRupees)
    : 0;

  const [paymentAmount, setPaymentAmount] = useState(defaultPayAmount);
  const [trancheName, setTrancheName] = useState(
    currentFinancials.disbursedRupees === 0
      ? 'Tranche 1: Lab Fabrication & Telemetry Setup'
      : 'Tranche 2: Field Deployment & Calibration'
  );
  const [paymentMode, setPaymentMode] = useState('PFMS Direct Treasury Transfer');
  const [sourceBank, setSourceBank] = useState('State Innovation Treasury Escrow - SBI Main Branch');
  const [destAccount, setDestAccount] = useState('Ranchi University R&D Account #9182374912, IFSC: SBIN0001234');
  const [voucherRef, setVoucherRef] = useState(`JH-TR-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`);
  const [utrNumber, setUtrNumber] = useState(`SBIN${Date.now().toString().slice(-9)}`);
  const [remarks, setRemarks] = useState('Milestone deliverables verified. Releasing approved grant from State Innovation Fund.');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const payingNum = parseFloat(paymentAmount) || 0;
  const projectedDisbursed = currentFinancials.disbursedRupees + payingNum;
  const projectedPending = Math.max(0, currentFinancials.sanctionedRupees - projectedDisbursed);
  const projectedPercentage = currentFinancials.sanctionedRupees > 0
    ? Math.min(100, Math.round((projectedDisbursed / currentFinancials.sanctionedRupees) * 100))
    : 0;

  const treasury = useGovernmentTreasury();
  const [isAddStateGrantOpen, setIsAddStateGrantOpen] = useState(false);
  const isInsufficientFund = payingNum > treasury.availableStateFund;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (payingNum <= 0) {
      alert('Please enter a valid payment amount greater than ₹0.');
      return;
    }
    if (isInsufficientFund) {
      alert(`Low Budget Alert: Available Government State Grant pool has only ${formatRupeesINR(treasury.availableStateFund)}. You cannot release a grant of ${formatRupeesINR(payingNum)}. Please add State Grant Funds first.`);
      return;
    }

    setIsSubmitting(true);

    const newDisbursedStr = formatRupeesINR(projectedDisbursed);

    const paymentRecord = {
      id: voucherRef,
      trancheName,
      amount: formatRupeesINR(payingNum),
      amountRaw: payingNum,
      date: new Date().toISOString().split('T')[0],
      paymentMode,
      sourceBank,
      destAccount,
      utrNumber,
      remarks,
      status: 'Paid'
    };

    setTimeout(() => {
      try {
        projectCsrSyncService.recordDisbursal({
          projectId: project.id,
          projectRef: project.id,
          amount: formatRupeesINR(payingNum),
          rawAmount: payingNum,
          disbursedAmount: formatRupeesINR(payingNum),
          mode: paymentMode,
          sourceBank,
          destAccount,
          voucherRef,
          utrNumber,
          purpose: trancheName,
          remarks
        });
        const pId = project.id;
        const totalNum = parseGrantRupees(project.sanctionedGrant || project.sanctionedBudget || project.budget || 80000);
        const isFullNow = projectedDisbursed >= totalNum;
        const payload = {
          disbursedAmount: newDisbursedStr,
          budgetStatus: isFullNow ? 'Grant Fully Disbursed' : 'Grant Disbursed',
          trancheRequest: { status: 'Approved', amount: payingNum, approvedAt: new Date() }
        };
        apiClient.put(`university/projects/${pId}?universityCode=RU001`, payload).catch(() => {});
        apiClient.patch(`university/approvals/${pId}?universityCode=RU001`, payload).catch(() => {});
        apiClient.patch(`university/approvals/APP-${pId}?universityCode=RU001`, payload).catch(() => {});
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs select-none animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-emerald-900 via-emerald-800 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300">
              <IndianRupee className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-300">
                  Government Grant Disbursal
                </span>
              </div>
              <h2 className="text-sm font-extrabold text-white">
                Release Grant Tranche to {project.hei || 'University'}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-emerald-200/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs overflow-y-auto max-h-[75vh]">
          {/* Current Financial Status Breakdown */}
          <div className="grid grid-cols-3 gap-2.5 p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-center">
            <div>
              <span className="text-[10px] font-extrabold text-slate-400 uppercase block tracking-wider">
                1. Sanctioned Total
              </span>
              <span className="text-sm font-black font-mono text-slate-900 block mt-0.5">
                {currentFinancials.sanctionedStr}
              </span>
              <span className="text-[10px] font-bold text-slate-500">{currentFinancials.sanctionedSub}</span>
            </div>
            <div>
              <span className="text-[10px] font-extrabold text-slate-400 uppercase block tracking-wider">
                2. Already Disbursed
              </span>
              <span className="text-sm font-black font-mono text-[#007A61] block mt-0.5">
                {currentFinancials.disbursedStr}
              </span>
              <span className="text-[10px] font-bold text-[#007A61]">({currentFinancials.percentage}%)</span>
            </div>
            <div>
              <span className="text-[10px] font-extrabold text-slate-400 uppercase block tracking-wider">
                3. Remaining Pending
              </span>
              <span className="text-sm font-black font-mono text-amber-700 block mt-0.5">
                {currentFinancials.pendingStr}
              </span>
              <span className="text-[10px] font-bold text-amber-600">{currentFinancials.pendingSub}</span>
            </div>
          </div>

          {/* Low Fund Warning Banner */}
          <LowFundAlertBanner
            availableAmount={treasury.availableStateFund}
            requiredAmount={payingNum}
            onOpenAddFund={() => setIsAddStateGrantOpen(true)}
          />

          {/* Amount to Release */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700">
                Grant Tranche Amount to Release (in ₹ INR) *
              </label>
              {payingNum > 0 && (
                <span className="text-xs font-bold text-[#007A61]">
                  {formatLakhsCr(payingNum)}
                </span>
              )}
            </div>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
                ₹
              </span>
              <input
                type="number"
                required
                min={1}
                max={currentFinancials.pendingRupees || 100000000}
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                className="w-full pl-8 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-base font-black font-mono text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#007A61] focus:bg-white"
              />
            </div>

            {/* Quick Percentage Presets */}
            {currentFinancials.pendingRupees > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                <button
                  type="button"
                  onClick={() => setPaymentAmount(Math.round(currentFinancials.pendingRupees * 0.25))}
                  className="px-2.5 py-1 bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-[#007A61] border border-slate-200 hover:border-emerald-200 rounded-lg text-[10.5px] font-bold transition-all shadow-2xs cursor-pointer"
                >
                  25% (₹ {Math.round(currentFinancials.pendingRupees * 0.25).toLocaleString('en-IN')})
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentAmount(Math.round(currentFinancials.pendingRupees * 0.5))}
                  className="px-2.5 py-1 bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-[#007A61] border border-slate-200 hover:border-emerald-200 rounded-lg text-[10.5px] font-bold transition-all shadow-2xs cursor-pointer"
                >
                  50% (₹ {Math.round(currentFinancials.pendingRupees * 0.5).toLocaleString('en-IN')})
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentAmount(currentFinancials.pendingRupees)}
                  className="px-2.5 py-1 bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-[#007A61] border border-slate-200 hover:border-emerald-200 rounded-lg text-[10.5px] font-bold transition-all shadow-2xs cursor-pointer"
                >
                  100% Full (₹ {currentFinancials.pendingRupees.toLocaleString('en-IN')})
                </button>
              </div>
            )}
          </div>

          {/* Tranche Name & Mode */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Tranche Milestone Purpose *
              </label>
              <input
                type="text"
                required
                value={trancheName}
                onChange={(e) => setTrancheName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#007A61] focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Disbursal Channel / Mode *
              </label>
              <select
                value={paymentMode}
                onChange={(e) => setPaymentMode(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#007A61] focus:bg-white"
              >
                <option value="PFMS Direct Treasury Transfer">PFMS Direct Treasury Transfer</option>
                <option value="RTGS Real-Time Settlement">RTGS Real-Time Settlement</option>
                <option value="Direct State Innovation Escrow">Direct State Innovation Escrow</option>
                <option value="NEFT Treasury Batch">NEFT Treasury Batch</option>
              </select>
            </div>
          </div>

          {/* Bank Accounts */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Source Treasury Bank
              </label>
              <input
                type="text"
                value={sourceBank}
                onChange={(e) => setSourceBank(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#007A61] focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Destination University Account & IFSC
              </label>
              <input
                type="text"
                value={destAccount}
                onChange={(e) => setDestAccount(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#007A61] focus:bg-white"
              />
            </div>
          </div>

          {/* UTR & Sanction Ref */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                UTR / Transaction Reference No.
              </label>
              <input
                type="text"
                value={utrNumber}
                onChange={(e) => setUtrNumber(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#007A61] focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Sanction Order / G.O. Voucher
              </label>
              <input
                type="text"
                value={voucherRef}
                onChange={(e) => setVoucherRef(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#007A61] focus:bg-white"
              />
            </div>
          </div>

          {/* Audit Remarks */}
          <div className="text-xs">
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Official Disbursal Remarks & Scope
            </label>
            <input
              type="text"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#007A61] focus:bg-white"
            />
          </div>

          {/* Projected Post-Payment Status Preview */}
          <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-1 text-xs text-emerald-950">
            <div className="flex items-center justify-between font-bold">
              <span>Post-Disbursal Coverage:</span>
              <span className="font-mono text-sm text-[#007A61]">
                {formatRupeesINR(projectedDisbursed)} / {currentFinancials.sanctionedStr} ({projectedPercentage}%)
              </span>
            </div>
            <p className="text-[11px] text-slate-600">
              {projectedPending > 0
                ? `Remaining ₹ ${projectedPending.toLocaleString('en-IN')} will be held in State Escrow for field deployment.`
                : '✓ Full 100% grant allocation will be disbursed.'}
            </p>
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all shadow-2xs cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting || isInsufficientFund}
              className={`px-5 py-2.5 text-xs font-bold rounded-xl flex items-center space-x-1.5 transition-all shadow-2xs ${
                isInsufficientFund
                  ? 'bg-rose-600 hover:bg-rose-700 text-white cursor-not-allowed opacity-90 shadow-rose-200'
                  : 'bg-[#007A61] hover:bg-[#006650] text-white cursor-pointer'
              }`}
            >
              <Send className="w-3.5 h-3.5" />
              <span>
                {isInsufficientFund
                  ? 'Low Budget • Insufficient State Funds'
                  : isSubmitting
                  ? 'Authorizing...'
                  : 'Authorize & Disburse Grant'}
              </span>
            </button>
          </div>
        </form>

        {isAddStateGrantOpen && (
          <AddStateGrantModal
            isOpen={isAddStateGrantOpen}
            onClose={() => {
              setIsAddStateGrantOpen(false);
              treasury.refreshTreasury();
            }}
            onFundCreated={() => {
              setIsAddStateGrantOpen(false);
              treasury.refreshTreasury();
            }}
          />
        )}
      </div>
    </div>
  );
};

export default GrantPaymentModal;
