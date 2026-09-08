import React, { useState } from 'react';
import { X, Send, AlertCircle, Building2, MapPin, CheckCircle2 } from 'lucide-react';
import apiClient from '../../../../infrastructure/api/client.js';

export const BlockAssignProblemModal = ({ isOpen, onClose, block, challenges = [], onAssigned }) => {
  const [selectedChallengeId, setSelectedChallengeId] = useState('');
  const [selectedPanchayat, setSelectedPanchayat] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('Drinking Water & Sanitation');
  const [priority, setPriority] = useState('Medium');
  const [instructions, setInstructions] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !block) return null;

  const handleAssign = async (e) => {
    e.preventDefault();
    if (!selectedChallengeId) {
      setError('Please select a problem statement.');
      return;
    }
    try {
      setSubmitting(true);
      setError('');

      const deptPayload = {
        id: block.blockId,
        deptId: block.blockId,
        name: `${block.name} - ${selectedDepartment}`,
        category: 'Block / Tehsil Office',
        block: block.name,
        panchayat: selectedPanchayat || block.panchayats?.[0] || '',
        headName: block.bdoName || 'Block Development Officer',
        headEmail: block.bdoEmail || '',
        headRole: 'Block Development Officer',
        district: block.district || 'Ranchi',
        instructions: instructions.trim() || 'Ground resolution allocated by District Nodal Officer.',
        status: 'Assigned'
      };

      const res = await apiClient.patch(`citizen/challenges/${selectedChallengeId}/triage`, {
        assignedDepartment: deptPayload,
        status: 'In Progress',
        priority
      });

      const updated = res?.data?.data || res?.data;
      if (onAssigned) onAssigned(updated);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to assign problem to block');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-slate-200 overflow-hidden text-left">
        <div className="px-5 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#007A61]/10 text-[#007A61] flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-black text-slate-900 leading-none">Assign Problem to {block.name}</h2>
              <p className="text-[10px] text-slate-500 mt-0.5">{block.district} District • {block.panchayats?.length || 0} Gram Panchayats</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleAssign} className="p-5 space-y-3.5">
          {error && (
            <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="text-[10.5px] font-bold text-slate-600 uppercase block mb-1">Select Citizen Problem *</label>
            <select
              value={selectedChallengeId}
              onChange={(e) => setSelectedChallengeId(e.target.value)}
              required
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50/50 font-semibold focus:border-[#007A61] focus:outline-none"
            >
              <option value="">-- Choose Problem Statement --</option>
              {challenges.map((c) => (
                <option key={c.challengeId || c._id} value={c.challengeId || c._id}>
                  [{c.challengeId}] {c.title} • {c.location?.panchayatOrWard || c.domain}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10.5px] font-bold text-slate-600 uppercase block mb-1">Target Gram Panchayat</label>
              <select
                value={selectedPanchayat}
                onChange={(e) => setSelectedPanchayat(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50/50 font-semibold focus:border-[#007A61] focus:outline-none"
              >
                <option value="">-- All Panchayats / Block Office --</option>
                {(block.panchayats || []).map((p) => (
                  <option key={p} value={p}>{p} Panchayat</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10.5px] font-bold text-slate-600 uppercase block mb-1">Block Department</label>
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50/50 font-semibold focus:border-[#007A61] focus:outline-none"
              >
                {(block.departments || [
                  'Drinking Water & Sanitation',
                  'Roads & Rural Works',
                  'Electricity & Power',
                  'Sanitation & Solid Waste',
                  'Public Health & Anganwadi'
                ]).map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-[10.5px] font-bold text-slate-600 uppercase block mb-1">Directive Instructions for BDO / Panchayat</label>
            <textarea
              rows={2}
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="e.g. Conduct field verification at village, repair pipeline within 3 days..."
              className="w-full p-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#007A61]"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button type="button" onClick={onClose} className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer">Cancel</button>
            <button
              type="submit"
              disabled={submitting || !selectedChallengeId}
              className="px-5 py-2 bg-[#007A61] hover:bg-[#006651] disabled:opacity-50 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer transition-all shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{submitting ? 'Assigning...' : 'Assign to Block'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BlockAssignProblemModal;
