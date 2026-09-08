import React, { useState, useEffect } from 'react';
import { X, Building2, AlertCircle, Send } from 'lucide-react';
import apiClient from '../../../../infrastructure/api/client.js';
import { blockService } from '../../../government/services/blockService.js';

export const AssignProblemToBlockModal = ({ isOpen, onClose, challenge, onAssigned }) => {
  const [blocks, setBlocks] = useState([]);
  const [selectedBlockId, setSelectedBlockId] = useState('');
  const [selectedDept, setSelectedDept] = useState('Drinking Water & Sanitation');
  const [selectedPanchayat, setSelectedPanchayat] = useState('');
  const [instructions, setInstructions] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      blockService.getBlocks({ district: challenge?.location?.district || 'Ranchi' })
        .then((res) => {
          setBlocks(res || []);
          if (res?.length > 0) {
            setSelectedBlockId(res[0].blockId);
            if (res[0].panchayats?.length > 0) setSelectedPanchayat(res[0].panchayats[0]);
          }
        })
        .catch((err) => console.warn('Failed to load blocks:', err));
    }
  }, [isOpen]);

  if (!isOpen || !challenge) return null;

  const activeBlock = blocks.find((b) => b.blockId === selectedBlockId) || blocks[0];
  const departments = activeBlock?.departments || [
    'Drinking Water & Sanitation', 'Roads & Rural Works', 'Electricity & Power',
    'Sanitation & Solid Waste', 'Public Health & Anganwadi'
  ];
  const panchayats = activeBlock?.panchayats || [];

  const handleBlockChange = (bId) => {
    setSelectedBlockId(bId);
    const b = blocks.find((item) => item.blockId === bId);
    setSelectedPanchayat(b?.panchayats?.length > 0 ? b.panchayats[0] : '');
  };

  const handleConfirmAssign = async (e) => {
    e.preventDefault();
    if (!activeBlock) return setError('Please select an administrative block.');

    try {
      setSubmitting(true);
      setError('');
      const targetChlId = challenge.challengeId || challenge.id || challenge._id;
      const deptPayload = {
        id: activeBlock.blockId,
        deptId: activeBlock.blockId,
        name: `${activeBlock.name} - ${selectedDept}`,
        category: 'Block Administration',
        block: activeBlock.name,
        panchayat: selectedPanchayat || panchayats[0] || '',
        headName: activeBlock.bdoName || 'Block Development Officer',
        headEmail: activeBlock.bdoEmail || activeBlock.credentials?.loginEmail || '',
        district: activeBlock.district || 'Ranchi',
        instructions: instructions.trim() || 'Assigned for grassroots resolution by District Nodal Officer.',
        status: 'Assigned'
      };

      const res = await apiClient.patch(`citizen/challenges/${targetChlId}/triage`, {
        assignedDepartment: deptPayload,
        status: 'In Progress'
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in select-none">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-slate-200 overflow-hidden text-left">
        <div className="px-5 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#007A61]/10 text-[#007A61] flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-black text-slate-900 leading-none">Assign Problem to Block</h2>
              <p className="text-[10px] text-slate-500 mt-0.5 truncate max-w-xs">[{challenge.challengeId || challenge.id}] {challenge.title}</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer"><X className="w-4 h-4" /></button>
        </div>

        <form onSubmit={handleConfirmAssign} className="p-5 space-y-3.5">
          {error && (
            <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" /><span>{error}</span>
            </div>
          )}

          {/* 1. Administrative Block Dropdown */}
          <div>
            <label className="text-[10px] font-bold text-slate-600 uppercase block mb-1">
              Select Administrative Block ({blocks.length} Added in District) *
            </label>
            <select
              value={selectedBlockId}
              onChange={(e) => handleBlockChange(e.target.value)}
              required
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 font-bold text-slate-900 focus:border-[#007A61] focus:outline-none"
            >
              {blocks.length === 0 ? (
                <option value="">No Blocks Registered in District</option>
              ) : (
                blocks.map((b) => (
                  <option key={b.blockId} value={b.blockId}>
                    {b.name} [{b.blockId}] — {b.district} District ({b.panchayats?.length || 0} Panchayats)
                  </option>
                ))
              )}
            </select>
          </div>

          {/* 2. Department & Gram Panchayat Dropdowns */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold text-slate-600 uppercase block mb-1">Department *</label>
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-xl bg-slate-50 font-semibold focus:border-[#007A61] focus:outline-none"
              >
                {departments.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-600 uppercase block mb-1">Gram Panchayat *</label>
              <select
                value={selectedPanchayat}
                onChange={(e) => setSelectedPanchayat(e.target.value)}
                className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-xl bg-slate-50 font-semibold focus:border-[#007A61] focus:outline-none"
              >
                {panchayats.length === 0 ? (
                  <option value="">General Block Area</option>
                ) : (
                  panchayats.map((p) => <option key={p} value={p}>{p}</option>)
                )}
              </select>
            </div>
          </div>

          {/* 3. Directives */}
          <div>
            <label className="text-[10px] font-bold text-slate-600 uppercase block mb-1">Resolution Instructions / Directives</label>
            <textarea
              rows={2}
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="e.g. Inspect ground water pipeline and execute field restoration within 48 hours..."
              className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:border-[#007A61] focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button type="button" onClick={onClose} className="px-4 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer">Cancel</button>
            <button
              type="submit"
              disabled={submitting || !activeBlock}
              className="px-5 py-1.5 bg-[#007A61] hover:bg-[#006651] disabled:opacity-50 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer transition-all shadow-xs"
            >
              <Send className="w-3.5 h-3.5 text-emerald-200" />
              <span>{submitting ? 'Assigning...' : `Assign to ${activeBlock?.name || 'Block'}`}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignProblemToBlockModal;
