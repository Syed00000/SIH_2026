import React, { useState, useEffect } from 'react';
import { X, Send, CheckCircle2, Loader2, Landmark, AlertCircle } from 'lucide-react';
import apiClient from '../../../infrastructure/api/client.js';

export const AllocateFundModal = ({ isOpen, onClose, currentDepartment, onFundAllocated }) => {
  const [subordinates, setSubordinates] = useState([]);
  const [targetDeptId, setTargetDeptId] = useState('');
  const [amount, setAmount] = useState('');
  const [scheme, setScheme] = useState('Inter-Departmental Decentralized CSR Fund');
  const [sanctionOrderNo, setSanctionOrderNo] = useState(`JH-ALLOC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchingSubordinates, setFetchingSubordinates] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const availableBalance = Number(currentDepartment?.allocatedFundPool) || 0;
  const catLower = (currentDepartment?.category || 'State Ministry').toLowerCase();
  const isWard = catLower.includes('ward') || catLower.includes('commissioner');
  const isBlock = catLower.includes('block') || catLower.includes('tehsil');
  const isDistrict = catLower.includes('district');
  const isState = catLower.includes('state') || catLower.includes('ministry');

  useEffect(() => {
    if (!isOpen) return;
    const fetchSubordinates = async () => {
      setFetchingSubordinates(true);
      setError('');
      try {
        if (isWard) {
          const techRes = await apiClient.get(`government/technicians?departmentId=${currentDepartment?.deptId || currentDepartment?.id}`);
          const mapped = (techRes?.data || []).map((t) => ({
            deptId: t.technicianId, id: t.technicianId, name: `${t.name} (${t.specialization})`,
            allocatedFundPool: t.allocatedSalaryPool || 0, isTechnician: true
          }));
          setSubordinates(mapped);
          if (mapped.length > 0) setTargetDeptId(mapped[0].deptId);
        } else {
          const res = await apiClient.get('government/departments');
          const allDepts = res?.data || [];
          let filtered = [];
          if (isState) {
            const myDist = (currentDepartment?.district || 'Ranchi').toLowerCase();
            filtered = allDepts.filter((d) => d.category?.toLowerCase().includes('district'))
              .sort((a, b) => ((b.district || b.name || '').toLowerCase().includes(myDist) ? 1 : -1));
          } else if (isDistrict) {
            const myDist = (currentDepartment?.district || '').toLowerCase();
            filtered = allDepts.filter((d) => d.category?.toLowerCase().includes('block') && (!d.district || d.district.toLowerCase() === myDist));
            if (filtered.length === 0) filtered = allDepts.filter((d) => d.category?.toLowerCase().includes('block'));
          } else if (isBlock) {
            filtered = allDepts.filter((d) => d.category?.toLowerCase().includes('ward'));
          }
          setSubordinates(filtered);
          if (filtered.length > 0) setTargetDeptId(filtered[0].deptId || filtered[0].id);
        }
      } catch { setError('Failed to fetch subordinate recipients.'); } finally { setFetchingSubordinates(false); }
    };
    fetchSubordinates();
  }, [isOpen, catLower, currentDepartment?.district, currentDepartment?.deptId, isWard, isBlock, isDistrict, isState]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const numAmount = Number(amount);
    if (availableBalance <= 0) return setError('Yeh department fund allocate nahi kar sakta kyunki iske paas ₹0 fund hai (Sufficient fund nahi hai).');
    if (!numAmount || numAmount <= 0) return setError('Please enter an amount greater than ₹0.');
    if (numAmount > availableBalance) return setError(`Yeh department fund allocate nahi kar sakta kyunki iske paas sufficient fund nahi hai (Available: ₹${availableBalance.toLocaleString('en-IN')}).`);
    if (!targetDeptId) return setError('Please select a target subordinate department.');

    setLoading(true);
    setError('');
    try {
      const res = await apiClient.post('government/departments/allocate-fund', {
        fromDeptId: currentDepartment?.deptId || currentDepartment?.id,
        toDeptId: targetDeptId,
        amount: numAmount,
        scheme,
        sanctionOrderNo,
        description: description || `Direct hierarchical fund allocation from ${currentDepartment?.name}`,
        allocatedBy: currentDepartment?.headName || currentDepartment?.name
      });
      setSuccess(true);
      if (onFundAllocated) onFundAllocated(res?.data?.data);
      setTimeout(() => { setSuccess(false); onClose(); }, 1200);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Fund allocation failed');
    } finally { setLoading(false); }
  };

  const isExceeded = Number(amount) > availableBalance;
  const isZero = availableBalance <= 0;
  const actionTitle = isWard ? 'Disburse Wages to Field Technician' : isState ? 'Allocate Fund to District Department' : isDistrict ? 'Allocate Fund to Block' : 'Allocate Fund to Ward';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs select-none">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl w-full max-w-lg flex flex-col overflow-hidden">
        <div className="px-5 py-3.5 bg-gradient-to-r from-emerald-800 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300"><Landmark className="w-4 h-4" /></div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-300">{isWard ? 'Direct Technician Disbursal' : 'Hierarchical Disbursal'}</span>
              <h2 className="text-sm font-bold text-white">{actionTitle}</h2>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-emerald-200 hover:text-white hover:bg-white/10 cursor-pointer"><X className="w-5 h-5" /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-3 overflow-y-auto max-h-[75vh]">
          {isZero ? (
            <div className="p-2.5 bg-rose-50 border border-rose-300 rounded-xl text-rose-800 text-xs font-semibold flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>Yeh department fund allocate nahi kar sakta kyunki iske paas ₹0 fund hai (Sufficient fund nahi hai).</span>
            </div>
          ) : isExceeded ? (
            <div className="p-2.5 bg-amber-50 border border-amber-300 rounded-xl text-amber-800 text-xs font-semibold flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
              <span>Yeh department fund allocate nahi kar sakta kyunki iske paas sufficient fund nahi hai (Available: ₹{availableBalance.toLocaleString('en-IN')}).</span>
            </div>
          ) : null}

          {error && <div className="p-2 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold rounded-xl flex items-center space-x-1.5"><AlertCircle className="w-4 h-4 shrink-0" /><span>{error}</span></div>}
          {success && <div className="p-2 bg-emerald-50 border border-emerald-300 text-[#007A61] text-xs font-bold rounded-xl flex items-center space-x-1.5"><CheckCircle2 className="w-4 h-4" /><span>{isWard ? 'Technician Wages Disbursed Successfully!' : 'Fund Allocated & Transferred Successfully!'}</span></div>}

          <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
            <div><span className="text-[10px] text-slate-500 font-semibold block">Source Department:</span><p className="font-bold text-slate-900">{currentDepartment?.name}</p></div>
            <div className="text-right"><span className="text-[10px] text-slate-500 font-semibold block">Available Balance:</span><p className={`text-sm font-black font-mono ${isZero ? 'text-rose-600' : 'text-[#007A61]'}`}>₹ {availableBalance.toLocaleString('en-IN')}</p></div>
          </div>

          <div className="text-xs">
            <label className="block text-[11px] font-bold text-slate-700 mb-1">{isWard ? 'Target Field Technician *' : isState ? 'Target District Department *' : isDistrict ? 'Target Block Office *' : 'Target Ward Commissioner *'}</label>
            {fetchingSubordinates ? (
              <div className="p-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-500 text-xs flex items-center space-x-2"><Loader2 className="w-3.5 h-3.5 animate-spin" /><span>Loading...</span></div>
            ) : subordinates.length === 0 ? (
              <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs font-semibold">No recipients found for this tier.</div>
            ) : (
              <select value={targetDeptId} onChange={(e) => setTargetDeptId(e.target.value)} className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white">
                {subordinates.map((s) => (
                  <option key={s.deptId || s.id} value={s.deptId || s.id}>{s.name} ({s.deptId}) — {s.isTechnician ? 'Wages' : 'Balance'}: ₹{(Number(s.allocatedFundPool) || 0).toLocaleString('en-IN')}</option>
                ))}
              </select>
            )}
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span>Disbursal Amount (₹ INR) *</span>
              {amount > 0 && <span className={`font-mono font-extrabold ${isExceeded ? 'text-rose-600' : 'text-[#007A61]'}`}>₹ {Number(amount).toLocaleString('en-IN')}</span>}
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">₹</span>
              <input type="number" required min={1} max={availableBalance} disabled={isZero} value={amount} onChange={(e) => setAmount(e.target.value)} placeholder={isZero ? "Allocation locked (₹0 Fund)" : "e.g. 100000"} className="w-full pl-7 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold font-mono text-slate-900 focus:bg-white disabled:opacity-50" />
            </div>
            {!isZero && (
              <div className="flex flex-wrap gap-1 pt-1">
                {[50000, 100000, 250000, 500000].map((val, idx) => (
                  <button key={idx} type="button" onClick={() => setAmount(val)} disabled={val > availableBalance} className="px-2 py-0.5 bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-[#007A61] disabled:opacity-40 rounded text-[10.5px] font-bold cursor-pointer">+₹{(val / 1000).toFixed(0)}k</button>
                ))}
                <button type="button" onClick={() => setAmount(availableBalance)} className="px-2 py-0.5 bg-emerald-100 text-[#007A61] rounded text-[10.5px] font-extrabold cursor-pointer">Max Available</button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div><label className="block text-[11px] font-semibold text-slate-700 mb-0.5">Sanction Order No.</label><input type="text" value={sanctionOrderNo} onChange={(e) => setSanctionOrderNo(e.target.value)} className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900" /></div>
            <div><label className="block text-[11px] font-semibold text-slate-700 mb-0.5">Scheme</label><input type="text" value={scheme} onChange={(e) => setScheme(e.target.value)} className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900" /></div>
          </div>

          <div className="text-xs">
            <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">Disbursal Remarks</label>
            <textarea rows={2} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Allocation purpose..." className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 resize-none" />
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-end space-x-2">
            <button type="button" onClick={onClose} className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer">Cancel</button>
            <button type="submit" disabled={loading || success || subordinates.length === 0 || isZero || isExceeded} className="px-4 py-1.5 bg-[#007A61] hover:bg-[#006650] text-white text-xs font-bold rounded-xl flex items-center space-x-1.5 cursor-pointer shadow-sm disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
              <span>{isZero ? 'Insufficient Fund (₹0 Available)' : isExceeded ? 'Exceeds Available Fund' : (isWard ? 'Disburse Wages' : isState ? 'Allocate Fund to District Department' : isDistrict ? 'Allocate Fund to Block' : 'Allocate Fund to Ward')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AllocateFundModal;
