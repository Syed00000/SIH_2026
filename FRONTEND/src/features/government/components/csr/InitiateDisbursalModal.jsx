import React, { useState } from 'react';
import {
  X,
  CreditCard,
  Building2,
  ShieldCheck,
  Send
} from 'lucide-react';
import { projectCsrSyncService } from '../../services/projectCsrSyncService.js';

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
  const [projects] = useState(() => projectCsrSyncService.getActiveProjects());
  
  // Dynamically map projects to dedicated escrow accounts
  const vaults = projects.map((proj, idx) => {
    const bankNames = ['State Bank of India', 'Punjab National Bank', 'Bank of Baroda'];
    const bankName = bankNames[idx % bankNames.length];
    return {
      vaultId: `VLT-${proj.id.slice(-4)}`,
      bankName,
      currentBalance: proj.disbursedGrant || '₹ 0'
    };
  });

  const [vaultId, setVaultId] = useState(vaults[0]?.vaultId || 'VAULT-SBI-01');
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
      makerCheckerSign: 'Pending Sign-off',
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
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 select-none animate-fadeIn">
      <div className="bg-white rounded-lg max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-white">
          <div className="flex items-center space-x-2.5">
            <CreditCard className="w-5 h-5 text-slate-900 shrink-0" />
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900">Initiate Escrow Fund Disbursal</h3>
              <p className="text-xs text-slate-500 font-normal">Create tranche payment order with automated TDS withholding</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-md border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-900 cursor-pointer"
          >
            <X className="w-4 h-4 text-slate-900" />
          </button>
        </div>

        {/* Form Body - Clean and spacious */}
        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs overflow-y-auto flex-1 bg-white">
          {/* Target Proposal */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Target Institution & Proposal *
            </label>
            <select
              value={selectedProposalId}
              onChange={(e) => setSelectedProposalId(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md text-xs font-semibold text-slate-900 outline-none focus:border-slate-900"
            >
              {proposals.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.id} — {p.institutionName} ({p.sourceScheme})
                </option>
              ))}
            </select>
          </div>

          {/* Source Escrow Vault & Payment Channel */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Source Escrow Vault *
              </label>
              <select
                value={vaultId}
                onChange={(e) => setVaultId(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md text-xs font-medium text-slate-900 outline-none focus:border-slate-900"
              >
                {vaults.map((v) => (
                  <option key={v.vaultId} value={v.vaultId}>
                    {v.vaultId} — {v.bankName} (Bal: {v.currentBalance})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Payment Mode Channel *
              </label>
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md text-xs font-medium text-slate-900 outline-none focus:border-slate-900"
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
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Gross Tranche Amount (₹) *
              </label>
              <input
                type="number"
                min="10000"
                step="5000"
                value={grossAmount}
                onChange={(e) => setGrossAmount(Number(e.target.value))}
                required
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md text-xs font-mono font-bold text-slate-900 outline-none focus:border-slate-900"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                TDS Section & Rate
              </label>
              <select
                value={tdsType}
                onChange={(e) => setTdsType(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md text-xs font-medium text-slate-900 outline-none focus:border-slate-900"
              >
                <option value="194C">Section 194C (2% - Contractors & Equipment)</option>
                <option value="194J">Section 194J (10% - Technical Consultancy)</option>
                <option value="EXEMPT">Exempt (0% - Direct State Grant)</option>
              </select>
            </div>
          </div>

          {/* Live Calculation Preview - Clean Monochrome Box */}
          <div className="p-3.5 bg-white border border-slate-200 rounded-lg space-y-1.5 text-xs shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-medium">Gross Disbursal:</span>
              <span className="font-mono font-bold text-slate-900">₹{grossAmount.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span>TDS Deduction ({tdsType}):</span>
              <span className="font-mono font-medium text-slate-900">- ₹{tdsAmount.toLocaleString('en-IN')}</span>
            </div>
            <div className="pt-1.5 border-t border-slate-200 flex items-center justify-between text-xs font-bold text-slate-900">
              <span>Net Bank Credit Amount:</span>
              <span className="font-mono text-sm font-bold text-slate-900">₹{netAmount.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Purpose */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Tranche Purpose & Description *
            </label>
            <input
              type="text"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              required
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md text-xs font-medium text-slate-900 outline-none focus:border-slate-900"
            />
          </div>

          {/* Maker-Checker Info Box */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-md flex items-start space-x-2 text-[11px] text-slate-700 leading-relaxed">
            <ShieldCheck className="w-4 h-4 text-slate-900 shrink-0 mt-0.5" />
            <span>This payment order will be registered on the live ledger and queued for Dual-Key Maker-Checker signature before bank release.</span>
          </div>

          {/* Submit Actions */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md text-xs font-semibold text-slate-700 border border-slate-200 hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-md text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white cursor-pointer shadow-xs flex items-center space-x-1.5"
            >
              <Send className="w-3.5 h-3.5 text-white" />
              <span>Queue Disbursal</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InitiateDisbursalModal;
