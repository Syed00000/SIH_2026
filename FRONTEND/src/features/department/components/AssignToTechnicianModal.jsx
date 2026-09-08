import React, { useState } from 'react';
import { X, Wrench, Send, AlertCircle, CheckCircle2 } from 'lucide-react';
import apiClient from '../../../infrastructure/api/client.js';

export const AssignToTechnicianModal = ({ challenge, technicians = [], isOpen, onClose, onAssigned }) => {
  const [selectedTechId, setSelectedTechId] = useState('');
  const [instructions, setInstructions] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !challenge) return null;

  const targetId = challenge.challengeId || challenge.id || challenge._id;
  const currentTech = challenge.assignedTechnician;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTechId) {
      setError('Please select a field technician.');
      return;
    }

    const tech = technicians.find((t) => (t.technicianId || t.id || t._id) === selectedTechId);
    if (!tech) {
      setError('Selected technician not found.');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      const payload = {
        assignedTechnician: {
          id: tech.technicianId || tech.id || tech._id,
          technicianId: tech.technicianId || tech.id || tech._id,
          name: tech.name,
          specialization: tech.specialization,
          phone: tech.phone,
          instructions: instructions.trim() || `Field repair assigned to ${tech.name}`
        }
      };

      const res = await apiClient.patch(`citizen/challenges/${targetId}/triage`, payload);
      const updated = res?.data?.data || { ...challenge, ...payload };
      if (onAssigned) onAssigned(updated);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to assign technician');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs select-none">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden text-left flex flex-col">
        <div className="px-5 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wrench className="w-5 h-5 text-[#007A61]" />
            <h3 className="text-sm font-black text-slate-900">Assign to Field Technician</h3>
          </div>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {error && (
            <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center gap-2 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Real Challenge Data Summary */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] font-bold text-[#007A61] bg-[#007A61]/10 px-1.5 py-0.5 rounded">
                {challenge.challengeId}
              </span>
              <span className="font-bold text-slate-900 truncate">{challenge.title}</span>
            </div>
            <p className="text-[11px] text-slate-500">
              Gram Panchayat: <strong className="text-slate-700">{challenge.location?.panchayatOrWard || challenge.location?.panchayat || 'Block Area'}</strong>
            </p>
            {currentTech?.name && (
              <p className="text-[10.5px] text-blue-700 font-semibold pt-1 border-t border-slate-200/60">
                Currently Assigned: {currentTech.name} ({currentTech.specialization})
              </p>
            )}
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Select Field Technician *</label>
            {technicians.length === 0 ? (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-[11.5px]">
                No technicians registered yet for this department. Please register technicians in the <strong>Technician Directory</strong>.
              </div>
            ) : (
              <select
                required
                value={selectedTechId}
                onChange={(e) => setSelectedTechId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-black font-semibold focus:outline-none focus:border-[#007A61] focus:bg-white"
              >
                <option value="">Choose Technician...</option>
                {technicians.map((t) => (
                  <option key={t.technicianId || t.id || t._id} value={t.technicianId || t.id || t._id}>
                    {t.name} — {t.specialization} ({t.phone})
                  </option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Repair Directives / Field Notes</label>
            <textarea
              rows={2}
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="e.g. Inspect transmission line fault near primary health center..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-black font-semibold placeholder:text-slate-400 focus:outline-none focus:border-[#007A61] focus:bg-white"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button type="button" onClick={onClose} className="px-4 py-2 font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer">
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !selectedTechId}
              className="px-5 py-2 bg-[#007A61] hover:bg-[#006651] disabled:opacity-50 text-white font-bold rounded-xl flex items-center gap-1.5 cursor-pointer transition-all shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{submitting ? 'Assigning...' : 'Assign to Technician'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignToTechnicianModal;
