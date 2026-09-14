import React, { useState, useEffect } from 'react';
import { X, Send, Landmark, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import apiClient from '../../../../infrastructure/api/client.js';

export const AllocateDepartmentFundModal = ({ isOpen, onClose, onFundAllocated }) => {
  const [departments, setDepartments] = useState([]);
  const [targetDeptId, setTargetDeptId] = useState('');
  const [amount, setAmount] = useState('');
  const [scheme, setScheme] = useState('Jharkhand State Innovation Council R&D Allocation');
  const [sanctionOrderNo, setSanctionOrderNo] = useState('');
  const [financialYear, setFinancialYear] = useState('2026-2027');
  const [description, setDescription] = useState('');
  const [allocatedBy, setAllocatedBy] = useState('Super Admin, Govt of Jharkhand');
  const [availablePool, setAvailablePool] = useState(0);
  const [loading, setLoading] = useState(false);
  const [fetchingDepts, setFetchingDepts] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    setSanctionOrderNo(`JH-GOV-SANCTION-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`);
    setError('');
    const fetchDepartments = async () => {
      setFetchingDepts(true);
      try {
        const [res, poolRes] = await Promise.all([
          apiClient.get('government/departments'),
          apiClient.get('government/grants')
        ]);
        const list = res?.data || [];
        setDepartments(list);
        if (list.length > 0) {
          setTargetDeptId(list[0].deptId || list[0].id || list[0]._id);
        }
        const poolData = poolRes?.data?.data || poolRes?.data || {};
        setAvailablePool(Number(poolData.stateGrantsTotal) || 0);
      } catch (err) {
        setError('Failed to load registered state departments.');
      } finally {
        setFetchingDepts(false);
      }
    };
    fetchDepartments();
  }, [isOpen]);

  if (!isOpen) return null;

  const selectedDept = departments.find((d) => (d.deptId || d.id || d._id) === targetDeptId);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const numAmount = Number(amount);
    if (availablePool <= 0) {
      return setError('Yeh state pool fund allocate nahi kar sakta kyunki iske paas ₹0 fund hai (Sufficient fund nahi hai).');
    }
    if (!numAmount || numAmount <= 0) return setError('Please enter an allocation amount greater than ₹0.');
    if (numAmount > availablePool) {
      return setError(`Yeh state pool fund allocate nahi kar sakta kyunki iske paas sufficient fund nahi hai (Available: ₹${availablePool.toLocaleString('en-IN')}).`);
    }
    if (!targetDeptId) return setError('Please select a target State Department.');

    setLoading(true);
    setError('');
    try {
      const payload = {
        amount: numAmount,
        title: `State Innovation Grant to ${selectedDept?.name || 'Department'}`,
        scheme: scheme.trim() || 'Jharkhand State Innovation Council R&D Allocation',
        department: selectedDept?.name || 'State Department',
        departmentId: selectedDept?.deptId || targetDeptId,
        departmentCategory: selectedDept?.category || 'State Ministry',
        sanctionOrderNo: sanctionOrderNo.trim(),
        financialYear,
        allocatedBy: allocatedBy.trim() || 'Super Admin, Govt of Jharkhand',
        description: description.trim() || `State grant fund allocated directly to ${selectedDept?.name || 'Department'}.`
      };

      const res = await apiClient.post('government/grants', payload);
      if (onFundAllocated) {
        onFundAllocated(res?.data?.data || res?.data);
      }
      onClose();
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Fund allocation failed.');
    } finally {
      setLoading(false);
    }
  };

  const isExceeded = Number(amount) > availablePool;
  const isZero = availablePool <= 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-xs select-none animate-fadeIn">
      <div className="bg-white rounded-xs border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden">
        <div className="bg-[#007A61] text-white px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Landmark className="w-5 h-5 text-emerald-200" />
            <span className="font-black text-sm uppercase tracking-wide">Allocate Fund to State Department</span>
          </div>
          <button type="button" onClick={onClose} className="p-1 hover:bg-white/20 rounded-xs text-white cursor-pointer"><X className="w-4 h-4" /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {isZero ? (
            <div className="p-2.5 bg-rose-50 border border-rose-300 rounded-xs flex items-center space-x-2 text-rose-700 text-xs font-bold">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>Yeh state pool fund allocate nahi kar sakta kyunki iske paas ₹0 fund hai (Sufficient fund nahi hai).</span>
            </div>
          ) : isExceeded ? (
            <div className="p-2.5 bg-amber-50 border border-amber-300 rounded-xs flex items-center space-x-2 text-amber-800 text-xs font-bold">
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
              <span>Yeh state pool fund allocate nahi kar sakta kyunki iske paas sufficient fund nahi hai (Available: ₹{availablePool.toLocaleString('en-IN')}).</span>
            </div>
          ) : null}

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xs flex items-center space-x-2 text-rose-700 text-xs font-bold">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Target Department *</label>
            {fetchingDepts ? (
              <div className="p-2 text-xs text-slate-500 flex items-center space-x-2 bg-slate-50 rounded-xs border border-slate-200"><Loader2 className="w-3.5 h-3.5 animate-spin" /><span>Loading departments...</span></div>
            ) : (
              <select value={targetDeptId} onChange={(e) => setTargetDeptId(e.target.value)} required className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xs text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-[#007A61]">
                {departments.map((d) => (
                  <option key={d.deptId || d.id || d._id} value={d.deptId || d.id || d._id}>
                    {d.name} ({d.category || 'Dept'}) — Current Balance: ₹ {(Number(d.allocatedFundPool) || 0).toLocaleString('en-IN')}
                  </option>
                ))}
              </select>
            )}
            {selectedDept && (
              <div className="mt-1 flex items-center justify-between text-[11px] text-slate-500 font-medium px-1">
                <span>Code: <strong className="font-mono text-slate-700">{selectedDept.code || selectedDept.deptId}</strong></span>
                <span>District: <strong className="text-slate-700">{selectedDept.district || 'State-wide'}</strong></span>
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-700">Allocation Amount (₹) *</label>
              <span className="text-[11px] font-bold text-slate-500">
                Treasury Available: <strong className="text-emerald-800 font-mono">₹ {availablePool.toLocaleString('en-IN')}</strong>
              </span>
            </div>
            <input type="number" min="1" step="any" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="e.g. 50000" required className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xs text-xs font-mono font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-[#007A61]" />
            <div className="flex flex-wrap gap-1.5 mt-2">
              {[25000, 50000, 100000, 500000].filter(v => availablePool <= 0 || v <= availablePool).map((val) => (
                <button key={val} type="button" onClick={() => setAmount(String(val))} className="px-2 py-0.5 text-[10px] font-bold font-mono bg-slate-100 hover:bg-[#007A61] hover:text-white border border-slate-200 rounded-xs text-slate-700 transition-colors cursor-pointer">
                  + ₹ {(val / 1000).toFixed(0)}k
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Sanction Order No</label>
              <input type="text" value={sanctionOrderNo} onChange={(e) => setSanctionOrderNo(e.target.value)} className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xs text-[11px] font-mono font-bold text-slate-800" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Financial Year</label>
              <input type="text" value={financialYear} onChange={(e) => setFinancialYear(e.target.value)} className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xs text-[11px] font-mono font-bold text-slate-800" />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Scheme / Budget Head</label>
            <input type="text" value={scheme} onChange={(e) => setScheme(e.target.value)} className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xs text-xs font-medium text-slate-800" />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Description / Remarks</label>
            <textarea rows={2} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Administrative purpose of fund allocation..." className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xs text-xs font-medium text-slate-800 focus:bg-white focus:outline-none" />
          </div>

          <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
            <button type="button" onClick={onClose} disabled={loading} className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xs cursor-pointer">Cancel</button>
            <button type="submit" disabled={loading || isZero || isExceeded} className="px-4 py-1.5 bg-[#007A61] hover:bg-[#00624e] text-white text-xs font-bold rounded-xs flex items-center space-x-1.5 cursor-pointer shadow-xs disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
              <span>{isZero ? 'Insufficient Fund (₹0 Available)' : isExceeded ? 'Exceeds Available Fund' : 'Confirm & Allocate Fund'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AllocateDepartmentFundModal;
