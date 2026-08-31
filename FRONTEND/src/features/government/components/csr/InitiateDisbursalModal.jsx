import React, { useState, useEffect } from 'react';
import {
  X,
  CreditCard,
  Building2,
  ShieldCheck,
  Send,
  IndianRupee
} from 'lucide-react';
import { parseGrantRupees, formatRupeesINR } from '../projects/GrantPaymentModal.jsx';

export const InitiateDisbursalModal = ({
  isOpen,
  onClose,
  proposals = [],
  onDisbursalCreated,
  initialProposal = null
}) => {
  const [selectedProposalId, setSelectedProposalId] = useState(
    initialProposal ? initialProposal.id : (proposals[0]?.id || '')
  );

  const currentProposal =
    proposals.find((p) => p.id === selectedProposalId) || initialProposal || proposals[0];

  const totalBudget = parseGrantRupees(
    currentProposal?.fundingRequested || currentProposal?.allocatedAmount || currentProposal?.budget || '₹ 75,000'
  );

  const [grossAmount, setGrossAmount] = useState(Math.round(totalBudget * 0.5) || 37500);
  const [tdsType, setTdsType] = useState('194C'); // 194C (2%) or 194J (10%)
  const [mode, setMode] = useState('PFMS');
  const [purpose, setPurpose] = useState('Tranche 1 Payout: Hardware CAD, Rig Prototyping & Sensor Bench Setup');

  useEffect(() => {
    if (initialProposal) {
      setSelectedProposalId(initialProposal.id);
      const b = parseGrantRupees(
        initialProposal.fundingRequested || initialProposal.allocatedAmount || initialProposal.budget || '₹ 75,000'
      );
      if (b > 0) {
        setGrossAmount(Math.round(b * 0.5));
      }
    }
  }, [initialProposal?.id]);

  if (!isOpen) return null;

  // Calculate TDS
  const tdsPercent = tdsType === '194C' ? 0.02 : 0.10;
  const tdsAmount = Math.round(grossAmount * tdsPercent);
  const netAmount = grossAmount - tdsAmount;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!grossAmount || grossAmount <= 0) {
      alert('Please enter a valid disbursement amount greater than ₹0');
      return;
    }

    const newPayment = {
      id: `PAY-${Math.floor(90000 + Math.random() * 9999)}`,
      payer: 'Govt State Treasury (PFMS Escrow)',
      payee: currentProposal ? currentProposal.institutionName : 'Ranchi University (RU001)',
      amount: formatRupeesINR(grossAmount),
      rawAmount: grossAmount,
      disbursedAmount: formatRupeesINR(grossAmount),
      mode: mode,
      utr: `JH-PFMS-${Math.floor(1000000000 + Math.random() * 9000000000)}`,
      utrNumber: `JH-PFMS-${Math.floor(1000000000 + Math.random() * 9000000000)}`,
      makerCheckerSign: 'Authorized by State Nodal Officer',
      makerCheckerStatus: 'Approved',
      bankAckStatus: 'Credited to University Escrow',
      bankStatus: 'success',
      timestamp: new Date().toLocaleDateString('en-IN'),
      scheme: currentProposal ? currentProposal.sourceScheme : 'State Innovation Grant',
      projectRef: selectedProposalId || currentProposal?.id,
      tdsAmount: `₹ ${tdsAmount.toLocaleString('en-IN')} (${tdsType} @ ${tdsType === '194C' ? '2%' : '10%'})`,
      netDisbursed: formatRupeesINR(netAmount),
      purpose: purpose
    };

    onDisbursalCreated?.(newPayment);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 select-none animate-fadeIn">
      <div
        className="bg-white border border-slate-200 rounded-2xl shadow-2xl w-full max-w-xl max-h-[92vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-white">
                Direct State Grant Tranche Disbursal
              </h3>
              <p className="text-[11px] text-slate-300">
                Direct PFMS Escrow release to beneficiary university account
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs flex-1 bg-[#fafafa]">
          {/* Target Proposal Selector */}
          <div className="space-y-1 bg-white p-3.5 border border-slate-200/90 rounded-xl shadow-2xs">
            <label className="text-[10.5px] font-extrabold text-slate-600 uppercase tracking-wider block">
              Beneficiary Project & University
            </label>
            <select
              value={selectedProposalId}
              onChange={(e) => {
                setSelectedProposalId(e.target.value);
                const found = proposals.find((p) => p.id === e.target.value);
                if (found) {
                  const b = parseGrantRupees(found.fundingRequested || found.allocatedAmount || '₹ 75,000');
                  setGrossAmount(Math.round(b * 0.5));
                }
              }}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 text-xs focus:outline-none focus:bg-white"
            >
              {proposals.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.id} — {p.institutionName} ({p.fundingRequested || p.allocatedAmount || '₹ 75,000'})
                </option>
              ))}
            </select>
          </div>

          {/* Amount and Tranche Quick Select */}
          <div className="bg-white p-4 border border-slate-200/90 rounded-xl shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-[10.5px] font-extrabold text-slate-700 uppercase tracking-wider block">
                Disbursal Tranche Amount (INR) *
              </label>
              <div className="flex items-center space-x-1">
                <button
                  type="button"
                  onClick={() => setGrossAmount(Math.round(totalBudget * 0.25))}
                  className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[10px] font-bold cursor-pointer"
                >
                  25%
                </button>
                <button
                  type="button"
                  onClick={() => setGrossAmount(Math.round(totalBudget * 0.50))}
                  className="px-2 py-0.5 bg-emerald-50 hover:bg-emerald-100 text-[#007A61] border border-emerald-200 rounded text-[10px] font-bold cursor-pointer"
                >
                  50% (Tranche 1)
                </button>
                <button
                  type="button"
                  onClick={() => setGrossAmount(totalBudget)}
                  className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[10px] font-bold cursor-pointer"
                >
                  100% (Full)
                </button>
              </div>
            </div>

            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-sm">
                ₹
              </span>
              <input
                type="number"
                required
                min="1"
                value={grossAmount}
                onChange={(e) => setGrossAmount(Number(e.target.value) || 0)}
                className="w-full pl-8 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono font-black text-slate-900 text-sm focus:outline-none focus:bg-white"
              />
            </div>
            <div className="flex justify-between text-[11px] text-slate-500 font-medium">
              <span>Total Sanctioned: <strong>{formatRupeesINR(totalBudget)}</strong></span>
              <span>Net Credited (Post TDS): <strong className="text-[#007A61]">{formatRupeesINR(netAmount)}</strong></span>
            </div>
          </div>

          {/* Payment Routing Method */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white p-3.5 border border-slate-200/90 rounded-xl shadow-2xs space-y-1.5">
              <label className="text-[10px] font-extrabold text-slate-600 uppercase block">
                Disbursal Channel
              </label>
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-900 focus:outline-none"
              >
                <option value="Direct PFMS">Direct PFMS (Govt Portal)</option>
                <option value="RTGS">RTGS Treasury Wire</option>
                <option value="NEFT">NEFT Direct Account</option>
              </select>
            </div>

            <div className="bg-white p-3.5 border border-slate-200/90 rounded-xl shadow-2xs space-y-1.5">
              <label className="text-[10px] font-extrabold text-slate-600 uppercase block">
                Statutory TDS Deduction
              </label>
              <select
                value={tdsType}
                onChange={(e) => setTdsType(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-900 focus:outline-none"
              >
                <option value="194C">Section 194C (2% R&D Service)</option>
                <option value="194J">Section 194J (10% Technical)</option>
                <option value="NIL">Nil (Exempt 80G Entity)</option>
              </select>
            </div>
          </div>

          {/* Purpose & Remarks */}
          <div className="bg-white p-3.5 border border-slate-200/90 rounded-xl shadow-2xs space-y-1">
            <label className="text-[10px] font-extrabold text-slate-600 uppercase block">
              Tranche Description & Release Purpose
            </label>
            <input
              type="text"
              required
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:bg-white"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#007A61] hover:bg-[#006650] text-white text-xs font-bold transition-all shadow-2xs flex items-center space-x-1.5 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Confirm & Disburse {formatRupeesINR(grossAmount)}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InitiateDisbursalModal;
