import React, { useState } from 'react';
import {
  X,
  IndianRupee,
  CheckCircle2,
  Building2,
  CreditCard,
  FileCheck,
  Send,
  AlertCircle
} from 'lucide-react';

export const GrantPaymentModal = ({ project, isOpen, onClose, onConfirmPayment }) => {
  const [paymentAmount, setPaymentAmount] = useState('5.00'); // in Lakhs
  const [trancheName, setTrancheName] = useState('Tranche 2: Field Trial & Equipment');
  const [paymentMode, setPaymentMode] = useState('PFMS Direct Treasury Transfer');
  const [voucherRef, setVoucherRef] = useState(`JH-TR-${Math.floor(1000 + Math.random() * 9000)}`);
  const [remarks, setRemarks] = useState('Milestone deliverables verified. Releasing grant payment from State Innovation Fund.');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !project) return null;

  // Parse amounts
  const parseLakhs = (str) => {
    if (!str) return 0;
    const match = str.match(/[\d.]+/);
    return match ? parseFloat(match[0]) : 0;
  };

  const sanctionedLakhs = parseLakhs(project.sanctionedGrant);
  const disbursedLakhs = parseLakhs(project.disbursedAmount);
  const pendingLakhs = Math.max(0, sanctionedLakhs - disbursedLakhs).toFixed(2);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const paidNum = parseFloat(paymentAmount) || 0;
    const newDisbursed = (disbursedLakhs + paidNum).toFixed(2);
    const newDisbursedStr = `₹ ${newDisbursed} Lakhs`;
    const newPercent = Math.min(100, Math.round((parseFloat(newDisbursed) / sanctionedLakhs) * 100));

    const paymentRecord = {
      id: voucherRef,
      trancheName,
      amount: `₹ ${paidNum.toFixed(2)} Lakhs`,
      date: new Date().toISOString().split('T')[0],
      paymentMode,
      remarks,
      status: 'Paid'
    };

    setTimeout(() => {
      onConfirmPayment(project.id, {
        newDisbursedStr,
        newPercent,
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
                Disburse pending funding for {project.id} ({project.hei})
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
          {/* Grant Financial Summary Box */}
          <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Sanctioned Grant</span>
              <span className="text-sm font-black text-slate-900 block mt-0.5">{project.sanctionedGrant}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Already Paid</span>
              <span className="text-sm font-black text-emerald-700 block mt-0.5">{project.disbursedAmount}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Pending to Pay</span>
              <span className="text-sm font-black text-amber-700 block mt-0.5">₹ {pendingLakhs} Lakhs</span>
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
              <option value="Tranche 2: Field Trial & Testing">Tranche 2: Field Trial & Testing</option>
              <option value="Tranche 3: Final District Handover & Scaling">Tranche 3: Final District Handover & Scaling</option>
              <option value="Special Grant Release: Hardware Expansion">Special Grant Release: Hardware Expansion</option>
            </select>
          </div>

          {/* Amount to Release & Voucher Ref */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">
                Amount to Release (in Lakhs ₹) *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-400">₹</span>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  max={pendingLakhs > 0 ? pendingLakhs : 50}
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
              <option value="PFMS Direct Treasury Transfer">PFMS Direct Treasury Transfer (State Bank)</option>
              <option value="State Innovation Fund DBT">State Innovation Fund DBT</option>
              <option value="Higher Education Grant Account">Higher Education Grant Account Transfer</option>
            </select>
          </div>

          {/* Remarks */}
          <div>
            <label className="text-[11px] font-bold text-slate-700 block mb-1">
              Disbursal Order Notes / Approval Remarks
            </label>
            <textarea
              rows={2}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:border-slate-800 focus:outline-hidden"
            />
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
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer flex items-center space-x-1.5 shadow-2xs disabled:opacity-50"
            >
              <IndianRupee className="w-3.5 h-3.5 text-emerald-400" />
              <span>Confirm & Release ₹ {paymentAmount} Lakhs</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GrantPaymentModal;
