import React, { useState, useEffect } from 'react';
import { X, Send, Landmark, AlertCircle, Loader2 } from 'lucide-react';
import apiClient from '../../../../infrastructure/api/client.js';

export const CreateDepartmentRequisitionModal = ({ isOpen, onClose, onCreated }) => {
  const [departments, setDepartments] = useState([]);
  const [selectedDeptId, setSelectedDeptId] = useState('');
  const [amount, setAmount] = useState('');
  const [purpose, setPurpose] = useState('');
  const [sector, setSector] = useState('Drinking Water & Sanitation');
  const [justification, setJustification] = useState('');
  const [priority, setPriority] = useState('Normal');
  const [isEmergency, setIsEmergency] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchingDepts, setFetchingDepts] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    setError('');
    const loadDepts = async () => {
      setFetchingDepts(true);
      try {
        const res = await apiClient.get('government/departments');
        const list = res?.data || [];
        setDepartments(list);
        if (list.length > 0) setSelectedDeptId(list[0].deptId || list[0].id || list[0]._id);
      } catch (e) {
        setError('Failed to load registered departments.');
      } finally {
        setFetchingDepts(false);
      }
    };
    loadDepts();
  }, [isOpen]);

  if (!isOpen) return null;

  const targetDept = departments.find((d) => (d.deptId || d.id || d._id) === selectedDeptId);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const numAmt = Number(amount);
    if (!numAmt || numAmt <= 0) return setError('Please enter a valid requested amount.');
    if (!purpose.trim()) return setError('Please enter project purpose / problem description.');
    if (!selectedDeptId) return setError('Please select a requester department.');

    setLoading(true);
    setError('');
    try {
      const payload = {
        requesterDeptId: targetDept?.deptId || selectedDeptId,
        requesterName: targetDept?.name || 'Department Authority',
        requesterCategory: targetDept?.category || 'State Ministry',
        targetName: 'Government of Jharkhand CSR & Innovation Pool',
        district: targetDept?.district || 'Ranchi',
        requestedAmount: numAmt,
        purpose: purpose.trim(),
        sector,
        justification: justification.trim() || `Department grant requisition for ${targetDept?.name || 'department'} civic works.`,
        priority: isEmergency ? 'Emergency SOS' : priority,
        isEmergency
      };

      const res = await apiClient.post('government/grant-requests', payload);
      if (onCreated) onCreated(res?.data?.data || res?.data);
      onClose();
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Failed to submit requisition.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-xs select-none animate-fadeIn">
      <div className="bg-white rounded-xs border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden">
        <div className="bg-[#007A61] text-white px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Landmark className="w-5 h-5 text-emerald-200" />
            <span className="font-black text-sm uppercase tracking-wide">Submit Department Fund Requisition</span>
          </div>
          <button type="button" onClick={onClose} className="p-1 hover:bg-white/20 rounded-xs text-white cursor-pointer"><X className="w-4 h-4" /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {error && <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 font-bold rounded-xs flex items-center space-x-2"><AlertCircle className="w-4 h-4 shrink-0" /><span>{error}</span></div>}

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Requester Department *</label>
            {fetchingDepts ? (
              <div className="p-2 text-xs text-slate-500 flex items-center space-x-2 bg-slate-50 rounded-xs border border-slate-200"><Loader2 className="w-3.5 h-3.5 animate-spin" /><span>Loading departments...</span></div>
            ) : (
              <select value={selectedDeptId} onChange={(e) => setSelectedDeptId(e.target.value)} required className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xs text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-[#007A61]">
                {departments.map((d) => (
                  <option key={d.deptId || d.id || d._id} value={d.deptId || d.id || d._id}>
                    {d.name} ({d.category || 'Dept'}) • {d.district || 'Ranchi'}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Requested Amount (₹) *</label>
              <input type="number" min="1" step="any" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="e.g. 100000" required className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xs text-xs font-mono font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-[#007A61]" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Priority</label>
              <select value={priority} onChange={(e) => { setPriority(e.target.value); setIsEmergency(e.target.value === 'Emergency SOS'); }} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xs text-xs font-bold text-slate-900 focus:bg-white focus:outline-none">
                <option value="Normal">Normal</option>
                <option value="Urgent">Urgent</option>
                <option value="Emergency SOS">Emergency SOS</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Purpose / Civic Problem Statement *</label>
            <input type="text" value={purpose} onChange={(e) => setPurpose(e.target.value)} placeholder="e.g. Immediate repair of municipal transformer in ward 01" required className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xs text-xs font-medium text-slate-800" />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Sector / Scheme</label>
            <input type="text" value={sector} onChange={(e) => setSector(e.target.value)} className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xs text-xs font-medium text-slate-800" />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Justification & Utilization Plan</label>
            <textarea rows={2} value={justification} onChange={(e) => setJustification(e.target.value)} placeholder="Detailed justification and planned expenditure breakdown..." className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xs text-xs font-medium text-slate-800" />
          </div>

          <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
            <button type="button" onClick={onClose} disabled={loading} className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xs cursor-pointer">Cancel</button>
            <button type="submit" disabled={loading} className="px-4 py-1.5 bg-[#007A61] hover:bg-[#00624e] text-white font-bold rounded-xs flex items-center space-x-1.5 cursor-pointer shadow-xs disabled:opacity-50">
              {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
              <span>Submit Requisition</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateDepartmentRequisitionModal;
