import React, { useState, useEffect } from 'react';
import { X, Send, Landmark, Building2, CheckCircle2, AlertTriangle, ArrowRight, ShieldCheck, Receipt } from 'lucide-react';
import industryFundService from '../../services/industryFundService.js';

export const DisburseGrantModal = ({
  isOpen,
  onClose,
  onSuccess,
  funds = [],
  availableUniversities = [],
  targetRequest = null, // If opened from an incoming request approval
  user
}) => {
  const [selectedFundId, setSelectedFundId] = useState('');
  const [selectedUniversityCode, setSelectedUniversityCode] = useState('');
  const [selectedUniversityName, setSelectedUniversityName] = useState('');
  const [projectTitle, setProjectTitle] = useState('');
  const [projectId, setProjectId] = useState('');
  const [amount, setAmount] = useState('');
  const [mode, setMode] = useState('Direct Corporate Escrow');
  const [utrNumber, setUtrNumber] = useState(`CORP-ESCROW-${Math.floor(1000000000 + Math.random() * 9000000000)}`);
  const [purpose, setPurpose] = useState('Tranche 1 - Prototype R&D Grant');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Pre-fill if opened for a specific university request
  useEffect(() => {
    if (targetRequest) {
      setSelectedUniversityCode(targetRequest.universityCode || 'HEI-JH');
      setSelectedUniversityName(targetRequest.universityName || 'Partner University');
      setProjectTitle(targetRequest.projectTitle || '');
      setProjectId(targetRequest.projectId || '');
      if (targetRequest.amountNumber) {
        setAmount(targetRequest.amountNumber.toString());
      } else if (targetRequest.estimatedBudget) {
        const parsed = Number(String(targetRequest.estimatedBudget).replace(/[^\d]/g, ''));
        if (parsed) setAmount(parsed.toString());
      }
      setPurpose(`Approved Funding for Request #${targetRequest.requestId || targetRequest._id}`);
    } else if (availableUniversities?.length > 0 && !selectedUniversityCode) {
      const u = availableUniversities[0];
      setSelectedUniversityCode(u.code);
      setSelectedUniversityName(u.name);
      if (u.activeProjects?.length > 0) {
        setProjectTitle(u.activeProjects[0].title);
        setProjectId(u.activeProjects[0].id);
      }
    }
  }, [targetRequest, availableUniversities, isOpen]);

  // Set default fund pool
  useEffect(() => {
    if (funds?.length > 0 && !selectedFundId) {
      // If targetRequest has category suggestion, pick matching fund
      if (targetRequest?.categorySuggestion) {
        const match = funds.find(f => f.category === targetRequest.categorySuggestion && f.remainingAmount > 0);
        if (match) {
          setSelectedFundId(match.fundId || match._id);
          return;
        }
      }
      // Or first fund with remaining balance
      const firstAvailable = funds.find(f => f.remainingAmount > 0) || funds[0];
      if (firstAvailable) setSelectedFundId(firstAvailable.fundId || firstAvailable._id);
    }
  }, [funds, targetRequest, isOpen]);

  if (!isOpen) return null;

  const currentFund = funds.find(f => (f.fundId === selectedFundId || f._id === selectedFundId));
  const numAmount = Number(amount) || 0;
  const availableBal = currentFund ? Number(currentFund.remainingAmount || 0) : 0;
  const remainingAfter = availableBal - numAmount;
  const isExceeded = numAmount > availableBal;

  const handleUniversityChange = (code) => {
    setSelectedUniversityCode(code);
    const uni = availableUniversities.find(u => u.code === code);
    if (uni) {
      setSelectedUniversityName(uni.name);
      if (uni.activeProjects?.length > 0) {
        setProjectTitle(uni.activeProjects[0].title);
        setProjectId(uni.activeProjects[0].id);
      } else {
        setProjectTitle('');
        setProjectId('');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!currentFund) {
      setError('Please select a source fund pool.');
      return;
    }

    if (!numAmount || numAmount <= 0) {
      setError('Please enter a valid disbursement amount greater than ₹0.');
      return;
    }

    if (isExceeded) {
      setError(`Requested amount (₹ ${numAmount.toLocaleString('en-IN')}) exceeds available balance in "${currentFund.title}" (₹ ${availableBal.toLocaleString('en-IN')}).`);
      return;
    }

    if (!projectTitle.trim()) {
      setError('Please specify the project title being funded.');
      return;
    }

    setLoading(true);
    try {
      let res;
      if (targetRequest) {
        res = await industryFundService.approveAndFundRequest(targetRequest.requestId || targetRequest._id, {
          fundId: currentFund.fundId || currentFund._id,
          amount: numAmount,
          universityCode: selectedUniversityCode,
          universityName: selectedUniversityName,
          projectTitle,
          projectId,
          mode,
          utrNumber,
          purpose,
          industryName: user?.organizationName || 'Ariba Research Labs'
        });
      } else {
        res = await industryFundService.disburseGrant({
          fundId: currentFund.fundId || currentFund._id,
          amount: numAmount,
          universityCode: selectedUniversityCode,
          universityName: selectedUniversityName,
          projectTitle,
          projectId,
          mode,
          utrNumber,
          purpose,
          industryName: user?.organizationName || 'Ariba Research Labs'
        });
      }

      if (onSuccess) {
        onSuccess(res?.data?.disbursement || res?.disbursement || {
          disbursementId: `IND-DISB-${Date.now().toString().slice(-6)}`,
          fundTitle: currentFund.title,
          category: currentFund.category,
          universityName: selectedUniversityName,
          projectTitle,
          amount: numAmount,
          mode,
          utrNumber,
          disbursedAt: new Date()
        });
      }
      onClose();
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Failed to disburse grant');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white border border-slate-200 rounded-2xl shadow-2xl w-full max-w-xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#007A61]/20 border border-[#007A61]/40 flex items-center justify-center text-emerald-400">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold tracking-wider text-emerald-400 uppercase">
                {targetRequest ? 'Approve & Disburse Request' : 'Grant Disbursal Portal'}
              </span>
              <h2 className="text-base font-black text-white">Disburse Funding to University</h2>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[82vh] overflow-y-auto">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center text-xs text-rose-700 font-semibold space-x-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{error}</span>
            </div>
          )}

          {/* 1. Beneficiary University */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Beneficiary University *</label>
              {targetRequest ? (
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 flex items-center space-x-2">
                  <Building2 className="w-4 h-4 text-slate-500" />
                  <span>{selectedUniversityName}</span>
                </div>
              ) : (
                <select
                  value={selectedUniversityCode}
                  onChange={(e) => handleUniversityChange(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-600 outline-none font-semibold text-slate-800"
                >
                  {availableUniversities.map(u => (
                    <option key={u.code} value={u.code}>{u.name} ({u.district})</option>
                  ))}
                </select>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Project / Innovation Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Smart Water Monitoring System"
                value={projectTitle}
                onChange={(e) => setProjectTitle(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-600 outline-none font-semibold"
              />
            </div>
          </div>

          {/* 2. Source Fund Pool with Dynamic Balance Preview */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                Source Industry Fund Pool (To Deduct From) *
              </label>
              <span className="text-[10px] text-slate-500 font-bold">Auto-Debited</span>
            </div>

            {funds && funds.length > 0 ? (
              <select
                value={selectedFundId}
                onChange={(e) => setSelectedFundId(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:border-emerald-600 outline-none font-bold text-slate-900"
              >
                {funds.map(f => (
                  <option key={f.fundId || f._id} value={f.fundId || f._id} disabled={f.remainingAmount <= 0}>
                    {f.title} ({f.category}) — Available: ₹ {(f.remainingAmount / 100000).toFixed(2)} Lakhs {f.remainingAmount <= 0 ? '[DEPLETED]' : ''}
                  </option>
                ))}
              </select>
            ) : (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 space-y-1">
                <p className="font-bold">No active corporate fund pools available.</p>
                <p className="text-[11px] text-amber-700">Please allocate a company fund pool first (Tab 1: "Allocate New Fund") before disbursing grants.</p>
              </div>
            )}

            {/* Live Balance Computation Card */}
            {currentFund && (
              <div className={`p-3 rounded-xl border transition-all ${
                isExceeded 
                  ? 'bg-rose-50/80 border-rose-200 text-rose-900' 
                  : 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
              }`}>
                <div className="flex justify-between items-center text-xs">
                  <span className="font-medium text-slate-600">Current Available Pool:</span>
                  <span className="font-black text-slate-900">₹ {availableBal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between items-center text-xs mt-1">
                  <span className="font-medium text-slate-600">Grant Deduction:</span>
                  <span className="font-black text-rose-600">- ₹ {numAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="pt-2 mt-2 border-t border-slate-200/60 flex justify-between items-center">
                  <span className="text-[11px] font-bold">Remaining Pool After Disbursal:</span>
                  <span className={`text-xs font-black ${isExceeded ? 'text-rose-600' : 'text-emerald-700'}`}>
                    {isExceeded ? 'Insufficient Balance!' : `₹ ${remainingAfter.toLocaleString('en-IN')}`}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* 3. Grant Amount */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold text-slate-700">Grant Disbursal Amount (₹) *</label>
              <span className="text-[11px] font-bold text-emerald-600">
                {amount ? `₹ ${(Number(amount) / 100000).toFixed(2)} Lakhs` : '₹ 0.00'}
              </span>
            </div>
            <input
              type="number"
              required
              min="10000"
              step="10000"
              placeholder="e.g. 1500000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className={`w-full px-3.5 py-2.5 text-sm font-bold bg-slate-50 border rounded-xl outline-none transition-all ${
                isExceeded 
                  ? 'border-rose-400 bg-rose-50 text-rose-900' 
                  : 'border-slate-200 text-slate-900 focus:bg-white focus:border-emerald-600'
              }`}
            />
          </div>

          {/* 4. Payment Mode & UTR */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Payment / Settlement Mode</label>
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-600 outline-none font-semibold text-slate-800"
              >
                <option value="Direct Corporate Escrow">Direct Corporate Escrow</option>
                <option value="RTGS / Corporate Banking">RTGS / Corporate Banking</option>
                <option value="PFMS Co-Funding">PFMS Co-Funding</option>
                <option value="Corporate Cheque / DD">Corporate Cheque / DD</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">UTR / Escrow Ref Number</label>
              <input
                type="text"
                required
                value={utrNumber}
                onChange={(e) => setUtrNumber(e.target.value)}
                className="w-full px-3.5 py-2 text-xs font-mono font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-600 outline-none"
              />
            </div>
          </div>

          {/* 5. Purpose */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Grant Purpose / Tranche Description</label>
            <input
              type="text"
              placeholder="e.g. Prototype Hardware Components & Sensor Benches"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-600 outline-none"
            />
          </div>

          {/* Verification Badge */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center space-x-2 text-[11px] text-slate-600">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              Transactions are officially signed via JoharSetu Corporate Escrow Protocol. Beneficiary HEI receives instantaneous credit notification.
            </span>
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end space-x-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || isExceeded || !funds?.length}
              className="px-5 py-2.5 bg-[#007A61] hover:bg-[#00604c] text-white text-xs font-bold rounded-xl flex items-center space-x-2 shadow-sm transition-all disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              <span>{targetRequest ? 'Approve & Disburse Funds' : 'Execute Disbursal & Cut Fund'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DisburseGrantModal;
