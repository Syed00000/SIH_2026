import React, { useState } from 'react';
import { X, Building2, Send, AlertCircle, ArrowRight } from 'lucide-react';
import apiClient from '../../../infrastructure/api/client.js';

export const BlockAssignToDeptModal = ({ challenge, departments = [], isOpen, onClose, onAssigned }) => {
  const [selectedDeptId, setSelectedDeptId] = useState('');
  const [instructions, setInstructions] = useState('');
  const [priority, setPriority] = useState(challenge?.priority || 'Medium');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !challenge) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDeptId) {
      setError('Please select a block department to assign.');
      return;
    }

    const dept = departments.find((d) => (d.deptId || d.id || d._id) === selectedDeptId);
    if (!dept) {
      setError('Selected department not found.');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      const targetId = challenge.challengeId || challenge.id || challenge._id;
      const payload = {
        priority,
        status: 'In Progress',
        assignedDepartment: {
          id: dept.deptId || dept.id || dept._id,
          deptId: dept.deptId || dept.id || dept._id,
          name: dept.name,
          category: dept.category || 'Block / Tehsil Office',
          headName: dept.headName,
          headEmail: dept.headEmail,
          district: dept.district || challenge.district || 'Ranchi',
          instructions: instructions.trim() || `Assigned by Block Office to ${dept.name}`
        }
      };

      const res = await apiClient.patch(`citizen/challenges/${targetId}/triage`, payload);
      const updated = res?.data?.data || { ...challenge, ...payload };
      if (onAssigned) onAssigned(updated);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to assign department');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs select-none">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden text-left flex flex-col">
        <div className="px-5 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-[#007A61]" />
            <h3 className="text-sm font-black text-slate-900">Assign to Block Department</h3>
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

          {/* Issue Summary */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] font-bold text-[#007A61] bg-[#007A61]/10 px-1.5 py-0.5 rounded">
                {challenge.challengeId}
              </span>
              <span className="font-bold text-slate-800 truncate">{challenge.title}</span>
            </div>
            <p className="text-[11px] text-slate-500">
              Gram Panchayat: <strong className="text-slate-700">{challenge.location?.panchayatOrWard || 'Block Area'}</strong>
            </p>
          </div>

          <div>
            <label className="font-bold text-slate-600 block mb-1">Target Block Department *</label>
            <select
              required
              value={selectedDeptId}
              onChange={(e) => setSelectedDeptId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:border-[#007A61]"
            >
              <option value="">Select Block Department...</option>
              {departments.map((d) => (
                <option key={d.deptId || d.id || d._id} value={d.deptId || d.id || d._id}>
                  {d.name} ({d.code || d.deptId}) — {d.headName || 'Officer'}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-bold text-slate-600 block mb-1">Action Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:border-[#007A61]"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
          </div>

          <div>
            <label className="font-bold text-slate-600 block mb-1">Field Instructions / Remedial Directive</label>
            <textarea
              rows={2}
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="e.g. Immediate inspection required at Panchayat handpump..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#007A61]"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button type="button" onClick={onClose} className="px-4 py-2 font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer">
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !selectedDeptId}
              className="px-5 py-2 bg-[#007A61] hover:bg-[#006651] disabled:opacity-50 text-white font-bold rounded-xl flex items-center gap-1.5 cursor-pointer transition-all shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{submitting ? 'Assigning...' : 'Assign to Department'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BlockAssignToDeptModal;
