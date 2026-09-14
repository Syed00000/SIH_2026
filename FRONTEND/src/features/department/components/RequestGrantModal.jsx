import React, { useState, useEffect } from 'react';
import { X, HandCoins, AlertCircle, Send, Landmark, Loader2 } from 'lucide-react';
import grantRequestService from '../../government/services/grantRequestService.js';
import departmentService from '../../government/services/departmentService.js';

export const RequestGrantModal = ({ department, isOpen, onClose, onCreated, prefilledProblem = null, prefilledAmount = null }) => {
  const [amount, setAmount] = useState('');
  const [sector, setSector] = useState('Drinking Water & Sanitation');
  const [purpose, setPurpose] = useState('');
  const [justification, setJustification] = useState('');
  const [priority, setPriority] = useState('Normal');
  const [targetDeptId, setTargetDeptId] = useState('');
  const [availableTargets, setAvailableTargets] = useState([]);
  const [fetchingTargets, setFetchingTargets] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const catLower = (department?.category || 'Ward Commissioner').toLowerCase();
  const isState = catLower.includes('state') || catLower.includes('ministry');
  const isDistrict = catLower.includes('district');
  const isBlock = catLower.includes('block') || catLower.includes('tehsil');

  useEffect(() => {
    if (!isOpen) return;
    const fetchTargets = async () => {
      setFetchingTargets(true);
      try {
        const res = await departmentService.getDepartments({ limit: 100 });
        const all = res?.data || (Array.isArray(res) ? res : []) || [];
        let targets = [];
        if (isBlock) {
          targets = all.filter((d) => (d.category || '').toLowerCase().includes('district'));
        } else if (isDistrict) {
          targets = all.filter((d) => (d.category || '').toLowerCase().includes('state') || (d.category || '').toLowerCase().includes('ministry'));
        } else {
          targets = all.filter((d) => (d.category || '').toLowerCase().includes('block'));
        }
        setAvailableTargets(targets);
        if (targets.length > 0) setTargetDeptId(targets[0].deptId || targets[0].id || targets[0]._id);
      } catch { /* ignore fallback */ } finally { setFetchingTargets(false); }
    };
    fetchTargets();
  }, [isOpen, catLower, isBlock, isDistrict]);

  useEffect(() => {
    if (prefilledAmount) setAmount(String(prefilledAmount));
    if (prefilledProblem) {
      setPurpose(prefilledProblem.title || '');
      if (prefilledProblem.sector || prefilledProblem.category) setSector(prefilledProblem.sector || prefilledProblem.category);
      setJustification(`Requisition for budget shortfall on civic problem ${prefilledProblem.challengeId || ''} (${prefilledProblem.title})`);
      if (prefilledProblem.priority === 'Critical') setPriority('Urgent');
    }
  }, [prefilledProblem, prefilledAmount, isOpen]);

  if (!isOpen) return null;

  const selectedTarget = availableTargets.find((t) => (t.deptId || t.id || t._id) === targetDeptId) || availableTargets[0];
  const targetAuthorityName = selectedTarget ? `${selectedTarget.name} (${selectedTarget.category || 'Authority'})` : (isDistrict ? 'State Secretariat' : isBlock ? 'District Department' : 'Block Development Office');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const numAmt = Number(String(amount).replace(/[^\d]/g, ''));
    if (!numAmt || numAmt <= 0) return setError('Please enter a valid grant requisition amount');
    if (!purpose.trim()) return setError('Please specify the project purpose or problem statement');

    try {
      setSubmitting(true);
      setError('');
      const payload = {
        requesterDeptId: department?.deptId || department?.id || department?._id || 'DEPT-CURRENT',
        requesterName: department?.name || 'Local Authority',
        requesterCategory: department?.category || (isDistrict ? 'District Department' : isBlock ? 'Block / Tehsil Office' : 'Ward Commissioner'),
        targetDeptId: selectedTarget?.deptId || targetDeptId || (isDistrict ? 'DEPT-JH-STATE' : 'DEPT-JH-DIST-RNC'),
        targetName: selectedTarget?.name || targetAuthorityName,
        targetCategory: selectedTarget?.category || (isDistrict ? 'State Ministry' : 'District Department'),
        district: department?.district || 'Ranchi',
        block: department?.block || '',
        wardId: department?.wardId || '',
        requestedAmount: numAmt,
        purpose: purpose.trim(),
        sector,
        justification: justification.trim(),
        priority
      };
      const created = await grantRequestService.createRequest(payload);
      if (onCreated) onCreated(created);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to submit grant requisition');
    } finally { setSubmitting(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs select-none">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden text-left flex flex-col max-h-[92vh]">
        <div className="flex items-center justify-between px-5 py-3.5 bg-gradient-to-r from-emerald-800 to-teal-800 text-white">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-white/10 text-emerald-300"><HandCoins className="w-5 h-5" /></div>
            <div>
              <h3 className="text-sm font-black">Submit Grant Fund Requisition</h3>
              <p className="text-[11px] text-emerald-200">Request allocation for civic problem resolution</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-1 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition cursor-pointer"><X className="w-5 h-5" /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-3.5 custom-scrollbar text-xs">
          {error && <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 flex items-center gap-2 font-medium"><AlertCircle className="w-4 h-4 shrink-0" /><span>{error}</span></div>}

          <div className="p-3 bg-emerald-50/70 border border-emerald-200/80 rounded-xl space-y-1.5">
            <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">Approving Authority / Target Department *</span>
            {fetchingTargets ? (
              <div className="flex items-center gap-2 text-slate-500 text-xs"><Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-600" /><span>Fetching approving authorities...</span></div>
            ) : availableTargets.length > 0 ? (
              <select value={targetDeptId} onChange={(e) => setTargetDeptId(e.target.value)} className="w-full px-3 py-1.5 bg-white border border-emerald-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none">
                {availableTargets.map((t) => (
                  <option key={t.deptId || t._id} value={t.deptId || t._id}>{t.name} ({t.category || t.deptId})</option>
                ))}
              </select>
            ) : (
              <div className="text-xs font-black text-emerald-950 flex items-center gap-1.5"><Landmark className="w-3.5 h-3.5 text-emerald-700" /><span>{targetAuthorityName}</span></div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Requisition Amount (₹) *</label>
              <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="e.g. 50000" required className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-emerald-600" />
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">Sector / Problem Domain</label>
              <select value={sector} onChange={(e) => setSector(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-emerald-600 cursor-pointer">
                <option value="Drinking Water & Sanitation">Drinking Water & Sanitation</option>
                <option value="Road & Civic Drainage">Road & Civic Drainage</option>
                <option value="Clean Energy & Street Lighting">Clean Energy & Street Lighting</option>
                <option value="Solid Waste Management">Solid Waste Management</option>
                <option value="Public Health Infrastructure">Public Health Infrastructure</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">Purpose / Civic Problem Statement *</label>
            <input type="text" value={purpose} onChange={(e) => setPurpose(e.target.value)} placeholder="e.g. Pipeline repair and infrastructure restoration" required className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-emerald-600" />
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">DPR & Scope Justification</label>
            <textarea rows={2} value={justification} onChange={(e) => setJustification(e.target.value)} placeholder="Provide scope details..." className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-emerald-600 custom-scrollbar" />
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">Priority</label>
            <div className="flex gap-2">
              {['Normal', 'High', 'Urgent'].map((p) => (
                <button type="button" key={p} onClick={() => setPriority(p)} className={`flex-1 py-1.5 rounded-xl font-bold text-xs transition cursor-pointer ${priority === p ? 'bg-emerald-700 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>{p}</button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer">Cancel</button>
            <button type="submit" disabled={submitting} className="flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow-xs cursor-pointer disabled:opacity-50">
              <Send className="w-3.5 h-3.5" /><span>{submitting ? 'Submitting...' : 'Dispatch Requisition'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RequestGrantModal;
