import React, { useState } from 'react';
import {
  X,
  CreditCard,
  Building2,
  DollarSign,
  Landmark,
  ShieldCheck,
  Send,
  Calculator
} from 'lucide-react';
import { MOCK_ESCROW_ACCOUNTS } from '../../data/mockCsrLifecycleData.js';

export const InitiateDisbursalModal = ({
  isOpen,
  onClose,
  proposals = [],
  onDisbursalCreated,
  initialProposal = null
}) => {
  const [selectedProposalId, setSelectedProposalId] = useState(
    initialProposal ? initialProposal.id : (proposals[0]?.id || 'PROP-011')
  );
  const [vaultId, setVaultId] = useState('VAULT-SBI-01');
  const [grossAmount, setGrossAmount] = useState(250000);
  const [tdsType, setTdsType] = useState('194C'); // 194C (2%) or 194J (10%)
  const [mode, setMode] = useState('RTGS');
  const [purpose, setPurpose] = useState('Tranche Payout: Equipment & Sensor Telemetry Setup');

  if (!isOpen) return null;

  const currentProposal = proposals.find((p) => p.id === selectedProposalId) || proposals[0];

  // Calculate TDS
  const tdsPercent = tdsType === '194C' ? 0.02 : 0.10;
  const tdsAmount = Math.round(grossAmount * tdsPercent);
  const netAmount = grossAmount - tdsAmount;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!grossAmount || grossAmount <= 0) {
      alert('Please enter a valid disbursement amount');
      return;
    }

    const newPayment = {
      id: `PAY-${Math.floor(90000 + Math.random() * 9999)}`,
      payer: currentProposal ? `${currentProposal.donor || 'Govt Escrow'}` : 'Govt Escrow',
      payee: currentProposal ? currentProposal.institutionName : 'BIT Mesra',
      disbursedAmount: `₹${grossAmount.toLocaleString('en-IN')}`,
      mode: mode,
      utrNumber: `UTR${Math.floor(1000000000 + Math.random() * 9000000000)}`,
      makerCheckerSign: 'Pending Final Sign-off',
      makerCheckerStatus: 'pending',
      bankAckStatus: 'In Transit',
      bankStatus: 'transit',
      timestamp: new Date().toLocaleString('en-IN'),
      scheme: currentProposal ? currentProposal.sourceScheme : 'Corporate CSR (Tata)',
      projectRef: selectedProposalId,
      tdsAmount: `₹${tdsAmount.toLocaleString('en-IN')} (${tdsType} @ ${tdsType === '194C' ? '2%' : '10%'})`,
      netDisbursed: `₹${netAmount.toLocaleString('en-IN')}`,
      purpose: purpose
    };

    onDisbursalCreated?.(newPayment);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Initiate Escrow Fund Disbursal</h3>
              <p className="text-[11px] text-slate-500 font-medium">Create tranche payment order with automated TDS withholding</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-700 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs overflow-y-auto flex-1">
          {/* Target Proposal */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">Target Institution & Proposal *</label>
            <select
              value={selectedProposalId}
              onChange={(e) => setSelectedProposalId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none"
            >
              {proposals.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.id} — {p.institutionName} ({p.sourceScheme})
                </option>
              ))}
            </select>
          </div>

          {/* Source Escrow Vault */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">Source Escrow Vault *</label>
              <select
                value={vaultId}
                onChange={(e) => setVaultId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none"
              >
                {MOCK_ESCROW_ACCOUNTS.map((v) => (
                  <option key={v.vaultId} value={v.vaultId}>
                    {v.vaultId} — {v.bankName} (Bal: {v.currentBalance})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">Payment Mode Channel *</label>
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none"
              >
                <option value="RTGS">RTGS API (Real-Time Settlement &gt; ₹2L)</option>
                <option value="NEFT">NEFT Batch (Hourly Clearing)</option>
                <option value="Direct PFMS">Direct PFMS (Central Treasury Map)</option>
              </select>
            </div>
          </div>

          {/* Amount and TDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">Gross Tranche Amount (₹) *</label>
              <input
                type="number"
                min="10000"
                step="5000"
                value={grossAmount}
                onChange={(e) => setGrossAmount(Number(e.target.value))}
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">TDS Section & Rate</label>
              <select
                value={tdsType}
                onChange={(e) => setTdsType(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none"
              >
                <option value="194C">Section 194C (2% - Contractors & Equipment)</option>
                <option value="194J">Section 194J (10% - Technical & R&D Consultancy)</option>
                <option value="EXEMPT">Exempt (0% - Direct State Grant)</option>
              </select>
            </div>
          </div>

          {/* Live Calculation Preview */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 font-medium text-slate-700">
            <div className="flex items-center justify-between text-xs">
              <span>Gross Disbursal:</span>
              <span className="font-mono font-bold text-slate-900">₹{grossAmount.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex items-center justify-between text-xs text-amber-700">
              <span>TDS Deduction ({tdsType}):</span>
              <span className="font-mono font-bold">- ₹{tdsAmount.toLocaleString('en-IN')}</span>
            </div>
            <div className="pt-1.5 border-t border-slate-200/80 flex items-center justify-between text-xs font-bold text-emerald-800">
              <span>Net Bank Credit Amount:</span>
              <span className="font-mono text-sm font-extrabold text-emerald-700">₹{netAmount.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Purpose */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">Tranche Purpose & Description *</label>
            <input
              type="text"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              required
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none"
            />
          </div>

          {/* Maker-Checker Info Box */}
          <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-xl flex items-start space-x-2 text-[11px] text-blue-900 font-medium leading-relaxed">
            <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <span>This payment order will be registered on the live ledger and queued for Dual-Key Maker-Checker signature before bank release.</span>
          </div>

          {/* Submit Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 border border-slate-200 hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white cursor-pointer shadow-xs flex items-center space-x-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Queue Disbursal</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InitiateDisbursalModal;
